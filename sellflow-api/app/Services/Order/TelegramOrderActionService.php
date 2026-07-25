<?php

namespace App\Services\Order;

use App\Models\Order;
use App\Services\TelegramNotificationService;
use App\Support\OrderStatusWorkflow;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;
use Throwable;

class TelegramOrderActionService
{
    public function __construct(
        private readonly OrderService $orders,
        private readonly TelegramNotificationService $telegram,
    ) {}

    public function handle(array $update): bool
    {
        $callback = $update['callback_query'] ?? null;
        $callbackId = (string) data_get($callback, 'id');
        $data = (string) data_get($callback, 'data');

        if ($callbackId === '' || ! preg_match('/^sf:order:(\d+):([a-z_]+)$/', $data, $matches)) {
            return false;
        }

        $chatId = (string) data_get($callback, 'message.chat.id');
        $messageId = (int) data_get($callback, 'message.message_id');
        $nextStatus = $matches[2];
        $order = Order::query()
            ->with(['business.notificationSetting', 'business.telegramDestinations'])
            ->find((int) $matches[1]);

        if (! $order || ! in_array($nextStatus, OrderStatusWorkflow::STATUSES, true) || ! $this->isAuthorizedStaffChat($order, $chatId)) {
            $this->safelyAnswer($callbackId, 'This order action is not authorized.', true);

            return true;
        }

        if (! in_array($nextStatus, OrderStatusWorkflow::next($order), true)) {
            $this->safelyClearKeyboard($chatId, $messageId);
            $this->safelyAnswer($callbackId, 'Order is already '.str_replace('_', ' ', $order->status).'.', true);

            return true;
        }

        try {
            $updated = $this->orders->updateStatus($order, $nextStatus);
        } catch (ValidationException) {
            $fresh = $order->fresh();
            $this->safelyClearKeyboard($chatId, $messageId);
            $currentStatus = $fresh?->status ? str_replace('_', ' ', $fresh->status) : 'updated';
            $this->safelyAnswer($callbackId, "Order is already {$currentStatus}.", true);

            return true;
        } catch (Throwable $exception) {
            Log::error('Telegram staff order action failed.', [
                'order_id' => $order->id,
                'next_status' => $nextStatus,
                'error' => $exception->getMessage(),
            ]);
            $this->safelyAnswer($callbackId, 'The order could not be updated. Try again.', true);

            return true;
        }

        $actor = trim((string) data_get($callback, 'from.first_name').' '.(string) data_get($callback, 'from.last_name'));
        $actor = $actor !== '' ? $actor : ((string) data_get($callback, 'from.username') ?: 'Telegram staff');
        $statusLabel = ucfirst(str_replace('_', ' ', $updated->status));

        $this->safelyAnswer($callbackId, "Order marked {$statusLabel}.");
        $this->safelyClearKeyboard($chatId, $messageId);

        try {
            $this->telegram->sendMessage(
                $chatId,
                '<b>Order update</b>'."\n\n"
                    .'Order <code>#'.$this->escape($updated->order_number).'</code>'."\n"
                    .'Status: <b>'.$this->escape($statusLabel).'</b>'."\n"
                    .'Updated by '.$this->escape($actor),
                [
                    'parse_mode' => 'HTML',
                    'reply_markup' => $this->telegram->staffOrderReplyMarkup($updated),
                ]
            );
        } catch (Throwable $exception) {
            Log::warning('Telegram staff order confirmation could not be delivered.', [
                'order_id' => $updated->id,
                'error' => $exception->getMessage(),
            ]);
        }

        return true;
    }

    private function isAuthorizedStaffChat(Order $order, string $chatId): bool
    {
        if ($chatId === '' || ! $order->business?->is_active) {
            return false;
        }

        $connectedDestination = $order->business->telegramDestinations
            ->contains(fn ($destination): bool => $destination->purpose === 'staff_group'
                && $destination->is_active
                && $destination->telegram_chat_id === $chatId);

        return $connectedDestination
            || ($order->business->notificationSetting?->telegram_enabled
                && $order->business->notificationSetting->telegram_chat_id === $chatId);
    }

    private function safelyAnswer(string $callbackId, string $message, bool $showAlert = false): void
    {
        try {
            $this->telegram->answerCallbackQuery($callbackId, $message, $showAlert);
        } catch (Throwable $exception) {
            Log::warning('Telegram callback acknowledgement failed.', ['error' => $exception->getMessage()]);
        }
    }

    private function safelyClearKeyboard(string $chatId, int $messageId): void
    {
        if ($chatId === '' || $messageId < 1) {
            return;
        }

        try {
            $this->telegram->clearInlineKeyboard($chatId, $messageId);
        } catch (Throwable $exception) {
            Log::warning('Telegram order keyboard could not be cleared.', ['error' => $exception->getMessage()]);
        }
    }

    private function escape(string $value): string
    {
        return htmlspecialchars($value, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
    }
}
