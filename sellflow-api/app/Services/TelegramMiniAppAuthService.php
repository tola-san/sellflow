<?php

namespace App\Services;

use Illuminate\Validation\ValidationException;

class TelegramMiniAppAuthService
{
    public function validate(?string $initData): ?array
    {
        if ($initData === null || trim($initData) === '') {
            return null;
        }

        $botToken = config('services.telegram.bot_token');

        if (! is_string($botToken) || $botToken === '') {
            throw ValidationException::withMessages([
                'telegram_init_data' => ['Telegram checkout is temporarily unavailable.'],
            ]);
        }

        parse_str($initData, $parameters);
        $receivedHash = $parameters['hash'] ?? null;
        unset($parameters['hash']);

        if (! is_string($receivedHash) || ! preg_match('/^[a-f0-9]{64}$/i', $receivedHash)) {
            $this->invalid();
        }

        ksort($parameters, SORT_STRING);
        $dataCheckString = collect($parameters)
            ->map(fn ($value, $key) => $key.'='.$value)
            ->implode("\n");
        $secretKey = hash_hmac('sha256', $botToken, 'WebAppData', true);
        $calculatedHash = hash_hmac('sha256', $dataCheckString, $secretKey);

        if (! hash_equals(strtolower($receivedHash), strtolower($calculatedHash))) {
            $this->invalid();
        }

        $authDate = filter_var($parameters['auth_date'] ?? null, FILTER_VALIDATE_INT);
        $ttl = max((int) config('services.telegram.init_data_ttl', 3600), 60);

        if (! $authDate || $authDate > now()->timestamp + 60 || $authDate < now()->timestamp - $ttl) {
            $this->invalid('The Telegram session has expired. Reopen the store and try again.');
        }

        $user = json_decode((string) ($parameters['user'] ?? ''), true);

        if (! is_array($user) || ! isset($user['id']) || ! is_numeric($user['id'])) {
            $this->invalid();
        }

        return [
            'telegram_user_id' => (string) $user['id'],
            // Private Telegram chat IDs are the same identifier as the user ID.
            'telegram_chat_id' => (string) $user['id'],
            'telegram_username' => isset($user['username']) ? (string) $user['username'] : null,
            'telegram_notifications_enabled' => true,
        ];
    }

    private function invalid(string $message = 'Telegram customer verification failed. Reopen the store and try again.'): never
    {
        throw ValidationException::withMessages([
            'telegram_init_data' => [$message],
        ]);
    }
}
