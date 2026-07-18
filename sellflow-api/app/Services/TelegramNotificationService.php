<?php

namespace App\Services;

use App\Models\Business;
use App\Models\BusinessNotificationSetting;
use App\Models\TelegramConnectionCode;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;
use RuntimeException;

class TelegramNotificationService
{
    public function settings(Business $business): BusinessNotificationSetting
    {
        return $business->notificationSetting()->firstOrCreate([], [
            'telegram_enabled' => false,
            'new_order_enabled' => true,
            'payment_enabled' => true,
        ]);
    }

    public function createConnectionCode(Business $business): array
    {
        $botUsername = config('services.telegram.bot_username');

        if (! is_string(config('services.telegram.bot_token')) || config('services.telegram.bot_token') === ''
            || ! is_string($botUsername) || $botUsername === '') {
            throw new RuntimeException('Telegram bot is not configured. Add TELEGRAM_BOT_TOKEN and TELEGRAM_BOT_USERNAME to the API environment.');
        }

        TelegramConnectionCode::query()->where('business_id', $business->id)->whereNull('used_at')->delete();

        do {
            $plainCode = 'SF-'.Str::upper(Str::random(8));
            $hash = $this->hashCode($plainCode);
        } while (TelegramConnectionCode::query()->where('code_hash', $hash)->exists());

        $connectionCode = TelegramConnectionCode::create([
            'business_id' => $business->id,
            'code_hash' => $hash,
            'expires_at' => now()->addMinutes(10),
        ]);

        return [
            'code' => $plainCode,
            'command' => "/connect {$plainCode}",
            'expires_at' => $connectionCode->expires_at,
            'bot_username' => $botUsername,
        ];
    }

    public function connectFromWebhook(array $update): bool
    {
        $message = $update['message'] ?? null;
        $text = trim((string) ($message['text'] ?? ''));
        $chatId = isset($message['chat']['id']) ? (string) $message['chat']['id'] : null;

        if (! $chatId || ! preg_match('/^\/connect(?:@\w+)?\s+(SF-[A-Z0-9]{8})$/i', $text, $matches)) {
            return false;
        }

        $connectionCode = TelegramConnectionCode::query()
            ->where('code_hash', $this->hashCode(Str::upper($matches[1])))
            ->whereNull('used_at')
            ->where('expires_at', '>', now())
            ->first();

        if (! $connectionCode) {
            $this->sendMessage($chatId, 'This SellFlow connection code is invalid or expired. Generate a new code from your dashboard.');

            return false;
        }

        $chatName = $this->chatName($message['chat']);

        DB::transaction(function () use ($connectionCode, $chatId, $chatName) {
            $lockedCode = TelegramConnectionCode::query()->lockForUpdate()->findOrFail($connectionCode->id);

            if ($lockedCode->used_at || $lockedCode->expires_at->isPast()) {
                throw new RuntimeException('Telegram connection code is no longer valid.');
            }

            BusinessNotificationSetting::query()->updateOrCreate(
                ['business_id' => $lockedCode->business_id],
                ['telegram_chat_id' => $chatId, 'telegram_chat_name' => $chatName, 'telegram_enabled' => true, 'connected_at' => now()]
            );
            $lockedCode->update(['used_at' => now()]);
        });

        $this->sendMessage($chatId, 'Telegram notifications connected to SellFlow. Return to your business dashboard and send a test alert.');

        return true;
    }

    public function sendTest(Business $business): void
    {
        $settings = $this->settings($business);

        if (! $settings->telegram_enabled || ! $settings->telegram_chat_id) {
            throw new RuntimeException('Connect Telegram before sending a test notification.');
        }

        $this->sendMessage($settings->telegram_chat_id, "SellFlow notifications are working for {$business->name}. New order alerts will appear in this chat.");
    }

    public function disconnect(Business $business): BusinessNotificationSetting
    {
        $settings = $this->settings($business);
        $settings->update(['telegram_chat_id' => null, 'telegram_chat_name' => null, 'telegram_enabled' => false, 'connected_at' => null]);
        $business->telegramConnectionCodes()->whereNull('used_at')->delete();

        return $settings->fresh();
    }

    public function sendMessage(string $chatId, string $text): void
    {
        $token = config('services.telegram.bot_token');

        if (! is_string($token) || $token === '') {
            throw new RuntimeException('Telegram bot is not configured. Add TELEGRAM_BOT_TOKEN to the API environment.');
        }

        Http::asJson()->timeout(10)->retry(2, 300)
            ->post("https://api.telegram.org/bot{$token}/sendMessage", ['chat_id' => $chatId, 'text' => $text])
            ->throw();
    }

    private function hashCode(string $code): string
    {
        return hash('sha256', Str::upper(trim($code)));
    }

    private function chatName(array $chat): string
    {
        return (string) ($chat['title'] ?? trim(($chat['first_name'] ?? '').' '.($chat['last_name'] ?? '')) ?: ($chat['username'] ?? 'Telegram chat'));
    }
}
