<?php

namespace App\Services\Order;

use App\Models\Order;
use App\Models\OrderTelegramLink;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class OrderTelegramLinkService
{
    public function __construct(private readonly OrderTelegramNotificationService $notifications) {}

    public function create(Order $order): ?string
    {
        $username = ltrim(trim((string) config('services.telegram.bot_username')), '@');
        if ($username === '' || $order->telegram_chat_id) {
            return null;
        }

        do {
            $token = 'sfl_'.Str::random(40);
            $hash = $this->hash($token);
        } while (OrderTelegramLink::query()->where('token_hash', $hash)->exists());

        OrderTelegramLink::query()->updateOrCreate(
            ['order_id' => $order->id],
            ['token_hash' => $hash, 'expires_at' => now()->addHours(24), 'used_at' => null]
        );

        return "https://t.me/{$username}?start={$token}";
    }

    public function claimFromUpdate(array $update): bool
    {
        $message = $update['message'] ?? null;
        $chatId = data_get($message, 'chat.id');
        $chatType = data_get($message, 'chat.type', 'private');
        $text = trim((string) data_get($message, 'text'));

        if (! $chatId || $chatType !== 'private' || ! preg_match('/^\/start(?:@\w+)?\s+(sfl_[A-Za-z0-9_-]+)$/', $text, $matches)) {
            return false;
        }

        $order = DB::transaction(function () use ($matches, $chatId, $message): ?Order {
            $link = OrderTelegramLink::query()
                ->where('token_hash', $this->hash($matches[1]))
                ->lockForUpdate()
                ->first();

            if (! $link || $link->used_at || $link->expires_at->isPast()) {
                return null;
            }

            $order = Order::query()->lockForUpdate()->find($link->order_id);
            if (! $order || $order->telegram_chat_id) {
                return null;
            }

            $order->forceFill([
                'telegram_user_id' => (string) (data_get($message, 'from.id') ?: $chatId),
                'telegram_chat_id' => (string) $chatId,
                'telegram_username' => data_get($message, 'from.username'),
                'telegram_notifications_enabled' => true,
            ])->save();
            $link->update(['used_at' => now()]);

            return $order->load(['business', 'items']);
        });

        if (! $order) {
            return false;
        }

        $this->notifications->orderCreated($order);

        return true;
    }

    private function hash(string $token): string
    {
        return hash('sha256', $token);
    }
}
