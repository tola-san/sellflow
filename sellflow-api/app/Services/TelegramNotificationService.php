<?php

namespace App\Services;

use App\Models\Business;
use App\Models\BusinessNotificationSetting;
use App\Models\BusinessTelegramDestination;
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

    public function createConnectionCode(Business $business, string $webhookUrl, string $purpose = 'staff_group'): array
    {
        if (! in_array($purpose, BusinessTelegramDestination::PURPOSES, true)) {
            throw new RuntimeException('Invalid Telegram destination purpose.');
        }
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

        TelegramConnectionCode::query()->where('business_id', $business->id)->where('purpose', $purpose)->whereNull('used_at')->delete();

        do {
            $plainCode = 'SF-'.Str::upper(Str::random(8));
            $hash = $this->hashCode($plainCode);
        } while (TelegramConnectionCode::query()->where('code_hash', $hash)->exists());

        $connectionCode = TelegramConnectionCode::create([
            'business_id' => $business->id,
            'purpose' => $purpose,
            'code_hash' => $hash,
            'expires_at' => now()->addMinutes(10),
        ]);

        return [
            'code' => $plainCode,
            'command' => "/connect {$plainCode}",
            'expires_at' => $connectionCode->expires_at,
            'bot_username' => $botUsername,
            'purpose' => $purpose,
        ];
    }

    public function handleUpdate(array $update): bool
    {
        if ($this->connectFromWebhook($update)) {
            return true;
        }

        return $this->handleCustomerCommand($update);
    }

    public function connectFromWebhook(array $update): bool
    {
        $message = $update['message'] ?? $update['channel_post'] ?? null;
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

        $chat = $message['chat'];
        $chatType = (string) ($chat['type'] ?? 'private');
        $purpose = $connectionCode->purpose ?: 'staff_group';

        if (! $this->purposeMatchesChat($purpose, $chatType)) {
            $this->sendMessage($chatId, 'This connection code is for a different Telegram destination type. Generate the correct code in SellFlow.');

            return false;
        }

        $botIsAdmin = $chatType === 'private' ? true : $this->botIsAdministrator($chatId);
        if ($purpose === 'sales_channel' && ! $botIsAdmin) {
            $this->sendMessage($chatId, 'Promote SellFlow Bot to channel administrator, then generate a new connection code.');

            return false;
        }

        if (in_array($chatType, ['group', 'supergroup'], true) && ! $this->senderIsAdministrator($chatId, data_get($message, 'from.id'))) {
            $this->sendMessage($chatId, 'Only a Telegram group administrator can connect this chat to SellFlow.');

            return false;
        }

        $chatName = $this->chatName($chat);
        $claimedDestination = BusinessTelegramDestination::query()->where('telegram_chat_id', $chatId)->first();
        if ($claimedDestination && ($claimedDestination->business_id !== $connectionCode->business_id || $claimedDestination->purpose !== $purpose)) {
            $this->sendMessage($chatId, 'This Telegram chat is already connected to another SellFlow destination. Disconnect it first.');

            return false;
        }

        DB::transaction(function () use ($connectionCode, $chatId, $chatName, $chatType, $purpose, $botIsAdmin) {
            $lockedCode = TelegramConnectionCode::query()->lockForUpdate()->findOrFail($connectionCode->id);

            if ($lockedCode->used_at || $lockedCode->expires_at->isPast()) {
                throw new RuntimeException('Telegram connection code is no longer valid.');
            }

            if ($purpose === 'staff_group') {
                BusinessNotificationSetting::query()->updateOrCreate(
                    ['business_id' => $lockedCode->business_id],
                    ['telegram_chat_id' => $chatId, 'telegram_chat_name' => $chatName, 'telegram_enabled' => true, 'connected_at' => now()]
                );
            }
            BusinessTelegramDestination::query()->updateOrCreate(
                ['business_id' => $lockedCode->business_id, 'purpose' => $purpose],
                [
                    'telegram_chat_id' => $chatId,
                    'telegram_chat_name' => $chatName,
                    'telegram_chat_type' => $chatType,
                    'is_active' => true,
                    'bot_is_admin' => $botIsAdmin,
                    'connected_at' => now(),
                ]
            );
            $lockedCode->update(['used_at' => now()]);
        });

        $label = Str::headline($purpose);
        $this->sendMessage($chatId, "{$label} connected to SellFlow. Return to your business dashboard to manage it.");

        return true;
    }

    public function sendTest(Business $business, string $purpose = 'staff_group'): void
    {
        $destination = $business->telegramDestinations()->where('purpose', $purpose)->where('is_active', true)->first();
        if ($destination) {
            $this->sendMessage($destination->telegram_chat_id, "SellFlow is connected to {$business->name} as ".Str::headline($purpose).'.');

            return;
        }

        $settings = $this->settings($business);

        if (! $settings->telegram_enabled || ! $settings->telegram_chat_id) {
            throw new RuntimeException('Connect Telegram before sending a test notification.');
        }

        $this->sendMessage($settings->telegram_chat_id, "SellFlow notifications are working for {$business->name}. New order alerts will appear in this chat.");
    }

    public function sendNewOrder(Order $order): void
    {
        $order->loadMissing(['business.notificationSetting', 'items']);
        $destination = $order->business?->telegramDestinations()->where('purpose', 'staff_group')->where('is_active', true)->first();
        $settings = $order->business?->notificationSetting;

        $chatId = $destination?->telegram_chat_id ?: $settings?->telegram_chat_id;
        if (! $chatId || (! $destination && (! $settings?->telegram_enabled || ! $settings->new_order_enabled))) {
            return;
        }

        $items = $order->items
            ->take(10)
            ->map(function ($item) {
                $modifiers = collect($item->modifiers ?? [])
                    ->pluck('option_name')
                    ->filter()
                    ->map(fn ($name) => $this->escapeHtml($name))
                    ->implode(', ');

                return '• <b>'.$item->quantity.'×</b> '.$this->escapeHtml($item->product_name)
                    .($modifiers ? ' <i>('.$modifiers.')</i>' : '')
                    .' — $'.$this->money($item->line_total);
            })
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
            ($order->restaurantTable
                ? '🍽 '.$this->escapeHtml($order->restaurantTable->name)
                    .($order->restaurantTable->area ? ' · '.$this->escapeHtml($order->restaurantTable->area) : '')
                : '📍 '.$this->escapeHtml($order->delivery_address)).'</blockquote>',
            '',
            '<b>Order items</b>',
            ...$items,
            '',
            '<b>Total</b>  <code>$'.$this->money($order->total).'</code>',
            '💳 '.$this->escapeHtml(Str::headline($order->payment_method)).' · '.$this->escapeHtml(Str::headline($order->status)),
        ]);

        $this->sendMessage($chatId, $message, 'HTML');
    }

    public function disconnect(Business $business, ?string $purpose = null): BusinessNotificationSetting
    {
        $settings = $this->settings($business);
        $destinations = $business->telegramDestinations();
        if ($purpose) {
            $destinations->where('purpose', $purpose)->delete();
            $business->telegramConnectionCodes()->where('purpose', $purpose)->whereNull('used_at')->delete();
        } else {
            $destinations->delete();
            $business->telegramConnectionCodes()->whereNull('used_at')->delete();
        }
        if (! $purpose || $purpose === 'staff_group') {
            $settings->update(['telegram_chat_id' => null, 'telegram_chat_name' => null, 'telegram_enabled' => false, 'connected_at' => null]);
        }

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

    private function handleCustomerCommand(array $update): bool
    {
        $message = $update['message'] ?? null;
        $chatId = data_get($message, 'chat.id');
        $text = trim((string) data_get($message, 'text'));
        if (! $chatId || ! preg_match('/^\/(start|shop)(?:@\w+)?(?:\s+.*)?$/i', $text, $matches)) {
            return false;
        }

        $destination = BusinessTelegramDestination::query()
            ->with('business')
            ->where('telegram_chat_id', (string) $chatId)
            ->where('purpose', 'customer_group')
            ->where('is_active', true)
            ->first();
        if (! $destination?->business?->is_active) {
            return false;
        }

        $business = $destination->business;
        $username = ltrim((string) config('services.telegram.bot_username'), '@');
        $url = 'https://t.me/'.$username.'?startapp='.rawurlencode($business->slug);
        $command = strtolower($matches[1]);
        $text = $command === 'start'
            ? "<b>Welcome to {$this->escapeHtml($business->name)}</b>\n\nBrowse products and checkout securely in the SellFlow Mini App."
            : "<b>Shop {$this->escapeHtml($business->name)}</b>\n\nOpen the store to browse products, add items to your cart, and checkout.";

        $this->sendMessage((string) $chatId, $text, [
            'parse_mode' => 'HTML',
            'reply_markup' => ['inline_keyboard' => [[['text' => 'Open store', 'url' => $url]]]],
        ]);

        return true;
    }

    private function purposeMatchesChat(string $purpose, string $chatType): bool
    {
        return match ($purpose) {
            'sales_channel' => $chatType === 'channel',
            'customer_group' => in_array($chatType, ['group', 'supergroup'], true),
            'staff_group' => in_array($chatType, ['private', 'group', 'supergroup'], true),
            default => false,
        };
    }

    private function senderIsAdministrator(string $chatId, mixed $userId): bool
    {
        if (! $userId) {
            return false;
        }

        return $this->chatMemberIsAdministrator($chatId, (string) $userId);
    }

    private function botIsAdministrator(string $chatId): bool
    {
        $token = trim((string) config('services.telegram.bot_token'));
        $response = Http::get("https://api.telegram.org/bot{$token}/getMe")->throw();
        $botId = (string) $response->json('result.id');

        return $botId !== '' && $this->chatMemberIsAdministrator($chatId, $botId);
    }

    private function chatMemberIsAdministrator(string $chatId, string $userId): bool
    {
        $token = trim((string) config('services.telegram.bot_token'));
        $response = Http::get("https://api.telegram.org/bot{$token}/getChatMember", [
            'chat_id' => $chatId,
            'user_id' => $userId,
        ])->throw();

        return in_array($response->json('result.status'), ['creator', 'administrator'], true);
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
