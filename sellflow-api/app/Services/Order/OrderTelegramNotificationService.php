<?php

namespace App\Services\Order;

use App\Models\Order;
use App\Services\TelegramNotificationService;
use App\Support\OrderStatusWorkflow;
use Illuminate\Support\Facades\Log;
use Throwable;

class OrderTelegramNotificationService
{
    public function __construct(private readonly TelegramNotificationService $telegram) {}

    public function orderCreated(Order $order): void
    {
        $order->loadMissing(['business', 'items']);

        if ($this->canNotifyCustomer($order)) {
            $sent = $this->attempt(
                $order,
                'customer_receipt',
                fn () => $this->telegram->sendMessage(
                    $order->telegram_chat_id,
                    $this->customerReceiptMessage($order),
                    $this->storeButton($order)
                )
            );

            if ($sent) {
                $order->forceFill([
                    'telegram_receipt_sent_at' => now(),
                    'telegram_last_notified_status' => $order->status,
                    'telegram_last_notification_sent_at' => now(),
                ])->save();
            }
        }
    }

    public function orderStatusChanged(Order $order): void
    {
        if (! $this->canNotifyCustomer($order) || $order->telegram_last_notified_status === $order->status) {
            return;
        }

        $order->loadMissing('business');
        $sent = $this->attempt(
            $order,
            'customer_status',
            fn () => $this->telegram->sendMessage(
                $order->telegram_chat_id,
                $this->customerStatusMessage($order),
                $this->storeButton($order)
            )
        );

        if ($sent) {
            $order->forceFill([
                'telegram_last_notified_status' => $order->status,
                'telegram_last_notification_sent_at' => now(),
            ])->save();
        }
    }

    public function paymentStatusChanged(Order $order): void
    {
        if (! $this->canNotifyCustomer($order)) {
            return;
        }

        $order->loadMissing('business');
        $labels = [
            'pending' => 'Payment is awaiting confirmation.',
            'paid' => 'Payment confirmed. Thank you!',
            'failed' => 'Payment could not be confirmed. Please contact the store.',
            'refunded' => 'Your payment has been refunded.',
        ];

        $sent = $this->attempt(
            $order,
            'customer_payment',
            fn () => $this->telegram->sendMessage(
                $order->telegram_chat_id,
                "<b>Payment update</b>\n\nOrder <code>".$this->escape($order->order_number).'</code> - '.$this->escape($order->business->name)."\n".$this->escape($labels[$order->payment_status] ?? ucfirst($order->payment_status)),
                $this->storeButton($order)
            )
        );

        if ($sent) {
            $order->forceFill(['telegram_last_notification_sent_at' => now()])->save();
        }
    }

    private function canNotifyCustomer(Order $order): bool
    {
        return (bool) ($order->telegram_notifications_enabled && $order->telegram_chat_id);
    }

    private function attempt(Order $order, string $type, callable $callback): bool
    {
        try {
            $callback();

            return true;
        } catch (Throwable $exception) {
            Log::warning('Telegram order notification could not be delivered.', [
                'order_id' => $order->id,
                'order_number' => $order->order_number,
                'notification_type' => $type,
                'error' => $exception->getMessage(),
            ]);

            return false;
        }
    }

    private function customerReceiptMessage(Order $order): string
    {
        $lines = $order->items->take(8)->map(function ($item) {
            $modifiers = collect($item->modifiers ?? [])
                ->pluck('option_name')
                ->filter()
                ->map(fn ($name) => $this->escape($name))
                ->implode(', ');

            return '- '.$this->escape($item->product_name).' x '.$item->quantity
                .($modifiers ? ' ('.$modifiers.')' : '');
        })->implode("\n");

        return "<b>Order received</b>\n\n"
            .'<blockquote><b>'.$this->escape($order->business->name).'</b>'."\n"
            .'Order <code>'.$this->escape($order->order_number).'</code>'."\n"
            .$lines."\n\n"
            .'Total: <b>'.$this->escape($order->business->formatMoney($order->total)).'</b>'."\n"
            .'Status: Pending</blockquote>'."\n"
            .'We will notify you when the seller updates your order.';
    }

    private function customerStatusMessage(Order $order): string
    {
        $statuses = [
            'pending' => 'Your order is pending review.',
            'confirmed' => 'The seller confirmed your order.',
            'preparing' => 'Your order is being prepared.',
            'ready' => 'Your order is ready for pickup or serving.',
            'completed' => 'Your order is complete. Thank you!',
            'cancelled' => 'Your order was cancelled. Please contact the store if you need help.',
        ];

        $timelineStatuses = OrderStatusWorkflow::supportsReady($order)
            ? ['confirmed', 'preparing', 'ready', 'completed']
            : ['confirmed', 'preparing', 'completed'];
        $timeline = collect($timelineStatuses)
            ->map(fn (string $status): string => ($status === $order->status ? '&#9654; ' : '')
                .$this->escape(ucfirst($status)))
            ->implode('  &#8250;  ');

        return "<b>Order update</b>\n\n"
            .'Order <code>'.$this->escape($order->order_number).'</code> - '.$this->escape($order->business->name)."\n"
            .$this->escape($statuses[$order->status] ?? 'Your order status was updated.')."\n\n"
            .'<b>Status</b>: '.$timeline;
    }

    private function storeButton(Order $order): array
    {
        $username = ltrim((string) config('services.telegram.bot_username'), '@');

        if ($username === '') {
            return ['parse_mode' => 'HTML'];
        }

        return [
            'parse_mode' => 'HTML',
            'reply_markup' => [
                'inline_keyboard' => [[[
                    'text' => 'Open store',
                    'url' => 'https://t.me/'.$username.'?startapp='.rawurlencode($order->business->slug),
                ]]],
            ],
        ];
    }

    private function escape(string $value): string
    {
        return htmlspecialchars($value, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
    }
}
