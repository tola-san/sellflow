<?php

namespace Tests\Feature;

use App\Models\Business;
use App\Models\TelegramConnectionCode;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Http;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class TelegramNotificationApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_telegram_dashboard_endpoints_require_authentication(): void
    {
        $this->getJson('/api/v1/business/notifications/telegram')->assertUnauthorized();
        $this->postJson('/api/v1/business/notifications/telegram/connect-code')->assertUnauthorized();
        $this->postJson('/api/v1/business/notifications/telegram/test')->assertUnauthorized();
        $this->deleteJson('/api/v1/business/notifications/telegram')->assertUnauthorized();
    }

    public function test_seller_can_generate_a_hashed_expiring_connection_code(): void
    {
        config([
            'services.telegram.bot_token' => 'TEST_TOKEN',
            'services.telegram.bot_username' => 'sellflow_test_bot',
            'services.telegram.webhook_secret' => 'test-webhook-secret',
            'services.telegram.webhook_url' => 'https://api.sellflow.test/api/v1/integrations/telegram/webhook',
        ]);
        Http::fake(['https://api.telegram.org/*' => Http::response(['ok' => true, 'result' => true])]);
        $business = $this->actingAsBusinessOwner('Coffee House');

        $response = $this->postJson('/api/v1/business/notifications/telegram/connect-code');

        $response->assertCreated()
            ->assertJsonPath('success', true)
            ->assertJsonStructure(['data' => ['code', 'command', 'expires_at', 'bot_username']]);

        $plainCode = $response->json('data.code');
        $record = TelegramConnectionCode::query()->where('business_id', $business->id)->firstOrFail();

        $this->assertStringStartsWith('SF-', $plainCode);
        $this->assertSame(hash('sha256', strtoupper($plainCode)), $record->code_hash);
        $this->assertNotSame($plainCode, $record->code_hash);
        $this->assertTrue($record->expires_at->isFuture());
        $this->assertTrue($record->expires_at->lessThanOrEqualTo(now()->addMinutes(10)));
        Http::assertSent(fn ($request) => $request->url() === 'https://api.telegram.org/botTEST_TOKEN/setWebhook'
            && $request['url'] === 'https://api.sellflow.test/api/v1/integrations/telegram/webhook'
            && $request['secret_token'] === 'test-webhook-secret');
    }

    public function test_valid_webhook_connects_the_business_and_consumes_the_code(): void
    {
        config([
            'services.telegram.bot_token' => 'TEST_TOKEN',
            'services.telegram.bot_username' => 'sellflow_test_bot',
            'services.telegram.webhook_secret' => 'test-webhook-secret',
            'services.telegram.webhook_url' => 'https://api.sellflow.test/api/v1/integrations/telegram/webhook',
        ]);
        Http::fake(['https://api.telegram.org/*' => Http::response(['ok' => true, 'result' => true])]);
        $business = $this->actingAsBusinessOwner('Coffee House');
        $code = $this->postJson('/api/v1/business/notifications/telegram/connect-code')->json('data.code');

        $response = $this->withHeader('X-Telegram-Bot-Api-Secret-Token', 'test-webhook-secret')
            ->postJson('/api/v1/integrations/telegram/webhook', [
                'update_id' => 123,
                'message' => [
                    'text' => "/connect {$code}",
                    'chat' => ['id' => 987654, 'first_name' => 'San', 'last_name' => 'Tola'],
                ],
            ]);

        $response->assertOk()->assertJsonPath('ok', true);
        $this->assertDatabaseHas('business_notification_settings', [
            'business_id' => $business->id,
            'telegram_chat_id' => '987654',
            'telegram_chat_name' => 'San Tola',
            'telegram_enabled' => true,
        ]);
        $this->assertNotNull(TelegramConnectionCode::query()->firstOrFail()->used_at);
        Http::assertSent(fn ($request) => $request->url() === 'https://api.telegram.org/botTEST_TOKEN/sendMessage'
            && $request['chat_id'] === '987654');
    }

    public function test_webhook_rejects_missing_or_invalid_secret(): void
    {
        config(['services.telegram.webhook_secret' => 'correct-secret']);

        $this->postJson('/api/v1/integrations/telegram/webhook', [])->assertForbidden();
        $this->withHeader('X-Telegram-Bot-Api-Secret-Token', 'wrong-secret')
            ->postJson('/api/v1/integrations/telegram/webhook', [])
            ->assertForbidden();
    }

    public function test_connection_code_reports_the_exact_missing_bot_configuration(): void
    {
        config([
            'services.telegram.bot_token' => 'TEST_TOKEN',
            'services.telegram.bot_username' => 'sellflow_test_bot',
            'services.telegram.webhook_secret' => null,
        ]);
        $this->actingAsBusinessOwner('Coffee House');

        $this->postJson('/api/v1/business/notifications/telegram/connect-code')
            ->assertStatus(503)
            ->assertJsonPath('message', 'Telegram bot is not configured. Missing Render API variables: TELEGRAM_WEBHOOK_SECRET. Save them and redeploy the API service.');
    }

    public function test_connection_code_rejects_a_non_https_webhook_url(): void
    {
        config([
            'services.telegram.bot_token' => 'TEST_TOKEN',
            'services.telegram.bot_username' => 'sellflow_test_bot',
            'services.telegram.webhook_secret' => 'test-webhook-secret',
            'services.telegram.webhook_url' => 'http://sellflow.test/api/v1/integrations/telegram/webhook',
        ]);
        Http::preventStrayRequests();
        $this->actingAsBusinessOwner('Coffee House');

        $this->postJson('/api/v1/business/notifications/telegram/connect-code')
            ->assertStatus(503)
            ->assertJsonPath('message', 'TELEGRAM_WEBHOOK_URL must be a valid HTTPS URL for the deployed API service.');

        Http::assertNothingSent();
    }

    public function test_connected_seller_can_update_preferences_test_and_disconnect(): void
    {
        config(['services.telegram.bot_token' => 'TEST_TOKEN']);
        Http::fake(['https://api.telegram.org/*' => Http::response(['ok' => true])]);
        $business = $this->actingAsBusinessOwner('Coffee House');
        $business->notificationSetting()->create([
            'telegram_chat_id' => '12345',
            'telegram_chat_name' => 'Coffee Team',
            'telegram_enabled' => true,
            'new_order_enabled' => true,
            'payment_enabled' => true,
            'connected_at' => now(),
        ]);

        $this->patchJson('/api/v1/business/notifications/telegram', [
            'new_order_enabled' => false,
            'payment_enabled' => true,
        ])->assertOk()
            ->assertJsonPath('data.connected', true)
            ->assertJsonPath('data.new_order_enabled', false);

        $this->postJson('/api/v1/business/notifications/telegram/test')
            ->assertOk()
            ->assertJsonPath('success', true);

        $this->deleteJson('/api/v1/business/notifications/telegram')
            ->assertOk()
            ->assertJsonPath('data.connected', false);

        $this->assertDatabaseHas('business_notification_settings', [
            'business_id' => $business->id,
            'telegram_chat_id' => null,
            'telegram_enabled' => false,
        ]);
    }

    public function test_expired_connection_code_cannot_connect_a_business(): void
    {
        config([
            'services.telegram.bot_token' => 'TEST_TOKEN',
            'services.telegram.webhook_secret' => 'test-secret',
        ]);
        Http::fake(['https://api.telegram.org/*' => Http::response(['ok' => true])]);
        $business = $this->actingAsBusinessOwner('Coffee House');
        TelegramConnectionCode::create([
            'business_id' => $business->id,
            'code_hash' => hash('sha256', 'SF-EXPIRED1'),
            'expires_at' => now()->subMinute(),
        ]);

        $this->withHeader('X-Telegram-Bot-Api-Secret-Token', 'test-secret')
            ->postJson('/api/v1/integrations/telegram/webhook', [
                'message' => ['text' => '/connect SF-EXPIRED1', 'chat' => ['id' => 999, 'title' => 'Old Chat']],
            ])->assertOk();

        $this->assertDatabaseMissing('business_notification_settings', ['business_id' => $business->id]);
    }

    private function actingAsBusinessOwner(string $businessName): Business
    {
        $user = User::factory()->create();
        $business = Business::create([
            'user_id' => $user->id,
            'name' => $businessName,
            'slug' => str($businessName)->slug(),
            'is_active' => true,
        ]);
        Sanctum::actingAs($user);

        return $business;
    }
}
