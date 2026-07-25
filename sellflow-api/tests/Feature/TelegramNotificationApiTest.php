<?php

namespace Tests\Feature;

use App\Models\Business;
use App\Models\BusinessTelegramDestination;
use App\Models\Order;
use App\Models\OrderTelegramLink;
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

    public function test_customer_group_can_connect_and_use_start_and_shop_commands(): void
    {
        config([
            'services.telegram.bot_token' => 'TEST_TOKEN',
            'services.telegram.bot_username' => 'sellflow_test_bot',
            'services.telegram.webhook_secret' => 'test-webhook-secret',
            'services.telegram.webhook_url' => 'https://api.sellflow.test/api/v1/integrations/telegram/webhook',
        ]);
        Http::fake(function ($request) {
            if (str_ends_with($request->url(), '/getMe')) {
                return Http::response(['ok' => true, 'result' => ['id' => 555]]);
            }
            if (str_ends_with($request->url(), '/getChatMember')) {
                return Http::response(['ok' => true, 'result' => ['status' => (string) $request['user_id'] === '777' ? 'administrator' : 'member']]);
            }

            return Http::response(['ok' => true, 'result' => true]);
        });
        $business = $this->actingAsBusinessOwner('Glow Beauty');
        $code = $this->postJson('/api/v1/business/notifications/telegram/connect-code', [
            'purpose' => 'customer_group',
        ])->assertCreated()->assertJsonPath('data.purpose', 'customer_group')->json('data.code');

        $webhook = fn (array $message) => $this->withHeader('X-Telegram-Bot-Api-Secret-Token', 'test-webhook-secret')
            ->postJson('/api/v1/integrations/telegram/webhook', ['message' => $message]);

        $webhook([
            'text' => "/connect {$code}",
            'from' => ['id' => 777],
            'chat' => ['id' => -100123, 'title' => 'Glow Community', 'type' => 'supergroup'],
        ])->assertOk();

        $this->assertDatabaseHas('business_telegram_destinations', [
            'business_id' => $business->id,
            'telegram_chat_id' => '-100123',
            'purpose' => 'customer_group',
            'is_active' => true,
        ]);

        $webhook([
            'text' => '/start@SellFlowBot',
            'from' => ['id' => 888],
            'chat' => ['id' => -100123, 'title' => 'Glow Community', 'type' => 'supergroup'],
        ])->assertOk();
        $webhook([
            'text' => '/shop',
            'from' => ['id' => 888],
            'chat' => ['id' => -100123, 'title' => 'Glow Community', 'type' => 'supergroup'],
        ])->assertOk();

        Http::assertSent(fn ($request) => str_ends_with($request->url(), '/sendMessage')
            && $request['chat_id'] === '-100123'
            && data_get($request->data(), 'reply_markup.inline_keyboard.0.0.url') === 'https://t.me/sellflow_test_bot?startapp=glow-beauty');
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

    public function test_customer_receives_message_when_seller_updates_order_status(): void
    {
        config([
            'services.telegram.bot_token' => 'TEST_TOKEN',
            'services.telegram.bot_username' => 'sellflow_test_bot',
        ]);
        Http::fake(['https://api.telegram.org/*' => Http::response(['ok' => true])]);
        $business = $this->actingAsBusinessOwner('Status Store');
        $order = Order::create([
            'business_id' => $business->id,
            'order_number' => 'SF-STATUS-TEST',
            'customer_name' => 'Telegram Customer',
            'customer_phone' => '012345678',
            'telegram_user_id' => '778899',
            'telegram_chat_id' => '778899',
            'telegram_notifications_enabled' => true,
            'telegram_last_notified_status' => 'pending',
            'delivery_address' => 'Phnom Penh',
            'subtotal' => 10,
            'total' => 10,
            'payment_method' => 'cash',
            'payment_status' => 'pending',
            'status' => 'pending',
        ]);

        $this->patchJson("/api/v1/orders/{$order->id}/status", ['status' => 'confirmed'])
            ->assertOk()
            ->assertJsonPath('data.status', 'confirmed');

        $this->assertDatabaseHas('orders', [
            'id' => $order->id,
            'telegram_last_notified_status' => 'confirmed',
        ]);
        Http::assertSent(fn ($request) => $request['chat_id'] === '778899'
            && str_contains($request['text'], 'seller confirmed your order'));
    }

    public function test_restaurant_staff_can_advance_an_order_to_ready_from_telegram(): void
    {
        config([
            'services.telegram.bot_token' => 'TEST_TOKEN',
            'services.telegram.bot_username' => 'sellflow_test_bot',
            'services.telegram.webhook_secret' => 'test-secret',
        ]);
        Http::fake(['https://api.telegram.org/*' => Http::response(['ok' => true, 'result' => true])]);
        $business = $this->actingAsBusinessOwner('Telegram Restaurant');
        $business->update(['business_type' => 'food_beverage']);
        BusinessTelegramDestination::create([
            'business_id' => $business->id,
            'telegram_chat_id' => '-100123',
            'telegram_chat_name' => 'Restaurant Staff',
            'telegram_chat_type' => 'supergroup',
            'purpose' => 'staff_group',
            'is_active' => true,
            'bot_is_admin' => true,
            'connected_at' => now(),
        ]);
        $order = Order::create([
            'business_id' => $business->id,
            'order_number' => 'SF-TELEGRAM-ACTION',
            'customer_name' => 'Telegram Customer',
            'customer_phone' => '012345678',
            'telegram_chat_id' => '778899',
            'telegram_notifications_enabled' => true,
            'telegram_last_notified_status' => 'pending',
            'delivery_address' => 'Dine-in - Table A04',
            'subtotal' => 12.50,
            'total' => 12.50,
            'payment_method' => 'cash',
            'payment_status' => 'pending',
            'status' => 'pending',
        ]);

        $press = function (string $status, int $messageId) use ($order) {
            return $this->withHeader('X-Telegram-Bot-Api-Secret-Token', 'test-secret')
                ->postJson('/api/v1/integrations/telegram/webhook', [
                    'callback_query' => [
                        'id' => "callback-{$status}",
                        'data' => "sf:order:{$order->id}:{$status}",
                        'from' => ['id' => 777, 'first_name' => 'Sokha'],
                        'message' => [
                            'message_id' => $messageId,
                            'chat' => ['id' => -100123, 'type' => 'supergroup'],
                        ],
                    ],
                ]);
        };

        $press('confirmed', 10)->assertOk();
        $press('preparing', 11)->assertOk();
        $press('ready', 12)->assertOk();

        $this->assertDatabaseHas('orders', [
            'id' => $order->id,
            'status' => 'ready',
            'telegram_last_notified_status' => 'ready',
        ]);
        Http::assertSent(fn ($request) => $request['chat_id'] === '778899'
            && str_contains($request['text'], 'ready for pickup or serving'));
        Http::assertSent(fn ($request) => str_ends_with($request->url(), '/answerCallbackQuery')
            && $request['callback_query_id'] === 'callback-ready');
        Http::assertSent(fn ($request) => $request['chat_id'] === '-100123'
            && str_contains((string) $request['text'], 'Updated by Sokha')
            && data_get($request->data(), 'reply_markup.inline_keyboard.0.0.callback_data') === "sf:order:{$order->id}:completed");
    }

    public function test_website_customer_can_claim_an_order_and_receive_the_receipt_once(): void
    {
        config([
            'services.telegram.bot_token' => 'TEST_TOKEN',
            'services.telegram.bot_username' => 'sellflow_test_bot',
            'services.telegram.webhook_secret' => 'test-secret',
        ]);
        Http::fake(['https://api.telegram.org/*' => Http::response(['ok' => true])]);
        $business = $this->actingAsBusinessOwner('Claim Store');
        $order = Order::create([
            'business_id' => $business->id,
            'order_number' => 'SF-CLAIM-TEST',
            'customer_name' => 'Website Customer',
            'customer_phone' => '012345678',
            'delivery_address' => 'Phnom Penh',
            'subtotal' => 10,
            'total' => 10,
            'payment_method' => 'cash',
            'payment_status' => 'pending',
            'status' => 'pending',
        ]);
        $token = 'sfl_'.str_repeat('A', 40);
        OrderTelegramLink::create([
            'order_id' => $order->id,
            'token_hash' => hash('sha256', $token),
            'expires_at' => now()->addHour(),
        ]);

        $payload = [
            'message' => [
                'text' => "/start {$token}",
                'from' => ['id' => 778899, 'username' => 'website_customer'],
                'chat' => ['id' => 778899, 'type' => 'private'],
            ],
        ];
        $webhook = fn () => $this->withHeader('X-Telegram-Bot-Api-Secret-Token', 'test-secret')
            ->postJson('/api/v1/integrations/telegram/webhook', $payload);

        $webhook()->assertOk();

        $this->assertDatabaseHas('orders', [
            'id' => $order->id,
            'telegram_chat_id' => '778899',
            'telegram_username' => 'website_customer',
            'telegram_notifications_enabled' => true,
            'telegram_last_notified_status' => 'pending',
        ]);
        $this->assertNotNull(OrderTelegramLink::firstOrFail()->used_at);
        Http::assertSentCount(1);
        Http::assertSent(fn ($request) => $request['chat_id'] === '778899'
            && str_contains($request['text'], 'Order received')
            && str_contains($request['text'], 'SF-CLAIM-TEST'));

        $webhook()->assertOk();
        Http::assertSentCount(1);
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
