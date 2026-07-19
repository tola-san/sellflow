<?php

namespace App\Services;

use App\Models\Business;
use App\Models\BusinessNotificationSetting;
use App\Models\Order;
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

    public function createConnectionCode(Business $business, string $webhookUrl): array
    {
        $botToken = trim((string) config('services.telegram.bot_token'));
        $botUsername = ltrim(trim((string) config('services.telegram.bot_username')), '@');
        $webhookSecret = trim((string) config('services.telegram.webhook_secret'));

        $missingVariables = array_keys(array_filter([
            'TELEGRAM_BOT_TOKEN' => $botToken,
            'TELEGRAM_BOT_USERNAME' => $botUsername,
            'TELEGRAM_WEBHOOK_SECRET' => $webhookSecret,
        ], fn (string $value): bool => $value === ''));

        if ($missingVariables !== []) {
            throw new RuntimeException('Telegram bot is not configured. Missing Render API variables: '.implode(', ', $missingVariables).'. Save them and redeploy the API service.');
        }

        if (filter_var($webhookUrl, FILTER_VALIDATE_URL) === false || parse_url($webhookUrl, PHP_URL_SCHEME) !== 'https') {
            throw new RuntimeException('TELEGRAM_WEBHOOK_URL must be a valid HTTPS URL for the deployed API service.');
        }

        $this->registerWebhook($botToken, $webhookSecret, $webhookUrl);

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

    public function sendNewOrder(Order $order): void
    {
        $order->loadMissing(['business.notificationSetting', 'items']);
        $settings = $order->business?->notificationSetting;

        if (! $settings?->telegram_enabled || ! $settings->new_order_enabled || ! $settings->telegram_chat_id) {
            return;
        }

        $items = $order->items
            ->take(10)
            ->map(fn ($item) => '• <b>'.$item->quantity.'×</b> '.$this->escapeHtml($item->product_name).' — $'.$this->money($item->line_total))
            ->all();

        if ($order->items->count() > 10) {
            $items[] = '• +'.($order->items->count() - 10).' more item(s)';
        }

        $message = implode("\n", [
            '🛍 <b>New order received</b>',
            '<code>#'.$this->escapeHtml($order->order_number).'</code> · '.$this->escapeHtml($order->business->name),
            '',
            '<blockquote><b>Customer</b>',
            $this->escapeHtml($order->customer_name),
            '📞 '.$this->escapeHtml($order->customer_phone),
            '📍 '.$this->escapeHtml($order->delivery_address).'</blockquote>',
            '',
            '<b>Order items</b>',
            ...$items,
            '',
            '<b>Total</b>  <code>$'.$this->money($order->total).'</code>',
            '💳 '.$this->escapeHtml(Str::headline($order->payment_method)).' · '.$this->escapeHtml(Str::headline($order->status)),
        ]);

        $this->sendMessage($settings->telegram_chat_id, $message, 'HTML');
    }

    public function disconnect(Business $business): BusinessNotificationSetting
    {
        $settings = $this->settings($business);
        $settings->update(['telegram_chat_id' => null, 'telegram_chat_name' => null, 'telegram_enabled' => false, 'connected_at' => null]);
        $business->telegramConnectionCodes()->whereNull('used_at')->delete();

        return $settings->fresh();
    }

    public function sendMessage(string $chatId, string $text, string|array|null $options = null): void
    {
        $token = trim((string) config('services.telegram.bot_token'));

        if ($token === '') {
            throw new RuntimeException('Telegram bot is not configured. Add TELEGRAM_BOT_TOKEN to the API environment.');
        }

        $payload = [
            'chat_id' => $chatId,
            'text' => $text,
        ];

        if (is_string($options)) {
            $payload['parse_mode'] = $options;
        } elseif (is_array($options)) {
            $payload = [...$payload, ...$options];
        }

        Http::asJson()->timeout(10)->retry(2, 300)
            ->post("https://api.telegram.org/bot{$token}/sendMessage", $payload)
            ->throw();
    }

    private function registerWebhook(string $token, string $secret, string $webhookUrl): void
    {
        try {
            $response = Http::asJson()->timeout(10)->retry(2, 300)
                ->post("https://api.telegram.org/bot{$token}/setWebhook", [
                    'url' => $webhookUrl,
                    'secret_token' => $secret,
                ])
                ->throw();
        } catch (\Throwable $exception) {
            throw new RuntimeException('SellFlow could not register the Telegram webhook. Verify the bot token and deployed API URL, then try again.', previous: $exception);
        }

        if ($response->json('ok') !== true || $response->json('result') !== true) {
            throw new RuntimeException('Telegram rejected the webhook configuration. Verify the bot token, webhook secret, and HTTPS API URL.');
        }
    }

    private function hashCode(string $code): string
    {
        return hash('sha256', Str::upper(trim($code)));
    }

    private function money(string|float|int $amount): string
    {
        return number_format((float) $amount, 2, '.', '');
    }

    private function escapeHtml(string $value): string
    {
        return htmlspecialchars($value, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
    }

    private function chatName(array $chat): string
    {
        return (string) ($chat['title'] ?? trim(($chat['first_name'] ?? '').' '.($chat['last_name'] ?? '')) ?: ($chat['username'] ?? 'Telegram chat'));
    }
}
