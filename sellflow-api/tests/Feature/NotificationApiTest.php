<?php

namespace Tests\Feature;

use App\Events\BusinessNotificationCreated;
use App\Models\Business;
use App\Models\BusinessNotification;
use App\Models\Order;
use App\Models\User;
use App\Services\BusinessNotificationService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Broadcast;
use Illuminate\Support\Facades\Event;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class NotificationApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_notification_feed_is_tenant_scoped_and_supports_read_and_dismiss_actions(): void
    {
        $owner = User::factory()->create();
        $business = $this->business($owner, 'Notification Store', 'notification-store');
        $otherBusiness = $this->business(User::factory()->create(), 'Other Store', 'other-notification-store');

        $notification = BusinessNotification::create([
            'business_id' => $business->id,
            'key' => 'order:1:created',
            'type' => 'order',
            'title' => 'New order SF-1',
            'message' => 'A customer placed a new order.',
            'action_url' => '/dashboard/orders',
        ]);
        BusinessNotification::create([
            'business_id' => $otherBusiness->id,
            'key' => 'order:2:created',
            'type' => 'order',
            'title' => 'Other tenant order',
            'message' => 'This must not be visible.',
        ]);

        Sanctum::actingAs($owner);

        $this->getJson('/api/v1/notifications')
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('unread_count', 1)
            ->assertJsonPath('data.0.title', 'New order SF-1');

        $this->patchJson("/api/v1/notifications/{$notification->id}/read")
            ->assertOk()
            ->assertJsonPath('data.is_read', true);

        $this->deleteJson("/api/v1/notifications/{$notification->id}")
            ->assertOk();

        $this->getJson('/api/v1/notifications')
            ->assertOk()
            ->assertJsonCount(0, 'data')
            ->assertJsonPath('unread_count', 0);
    }

    public function test_notification_actions_reject_another_business_notification(): void
    {
        $owner = User::factory()->create();
        $this->business($owner, 'Owner Store', 'owner-store');
        $otherBusiness = $this->business(User::factory()->create(), 'Other Store', 'other-owner-store');
        $notification = BusinessNotification::create([
            'business_id' => $otherBusiness->id,
            'key' => 'system:private',
            'type' => 'system',
            'title' => 'Private',
            'message' => 'Private tenant activity.',
        ]);

        Sanctum::actingAs($owner);

        $this->patchJson("/api/v1/notifications/{$notification->id}/read")->assertForbidden();
        $this->deleteJson("/api/v1/notifications/{$notification->id}")->assertForbidden();
    }

    public function test_creating_a_business_notification_dispatches_the_realtime_event(): void
    {
        Event::fake([BusinessNotificationCreated::class]);
        $business = $this->business(User::factory()->create(), 'Realtime Store', 'realtime-store');
        $order = Order::create([
            'business_id' => $business->id,
            'order_number' => 'SF-REALTIME-1',
            'customer_name' => 'Realtime Customer',
            'customer_phone' => '012345678',
            'delivery_address' => 'Phnom Penh',
            'subtotal' => 12.50,
            'total' => 12.50,
            'payment_method' => 'cash',
            'payment_status' => 'pending',
            'status' => 'pending',
            'order_type' => 'delivery',
        ]);

        app(BusinessNotificationService::class)->orderCreated($order);

        Event::assertDispatched(
            BusinessNotificationCreated::class,
            fn (BusinessNotificationCreated $event) => $event->notification->business_id === $business->id
                && $event->broadcastOn()->name === "private-business.{$business->id}"
        );
    }

    public function test_private_business_channel_uses_sanctum_tenant_authorization(): void
    {
        config([
            'broadcasting.default' => 'reverb',
            'broadcasting.connections.reverb' => [
                'driver' => 'reverb',
                'key' => 'test-key',
                'secret' => 'test-secret',
                'app_id' => 'test-app',
                'options' => [
                    'host' => '127.0.0.1',
                    'port' => 8080,
                    'scheme' => 'http',
                    'useTLS' => false,
                ],
            ],
        ]);
        Broadcast::getFacadeRoot()->forgetDrivers();
        require base_path('routes/channels.php');

        $owner = User::factory()->create();
        $business = $this->business($owner, 'Private Channel Store', 'private-channel-store');
        Sanctum::actingAs($owner);

        $this->postJson('/api/v1/broadcasting/auth', [
            'socket_id' => '1234.5678',
            'channel_name' => "private-business.{$business->id}",
        ])->assertOk()->assertJsonStructure(['auth']);

        $otherOwner = User::factory()->create();
        $this->business($otherOwner, 'Other Channel Store', 'other-channel-store');
        Sanctum::actingAs($otherOwner);

        $this->postJson('/api/v1/broadcasting/auth', [
            'socket_id' => '1234.5678',
            'channel_name' => "private-business.{$business->id}",
        ])->assertForbidden();
    }

    private function business(User $owner, string $name, string $slug): Business
    {
        return Business::create([
            'user_id' => $owner->id,
            'name' => $name,
            'slug' => $slug,
            'business_type' => 'fashion',
            'is_active' => true,
        ]);
    }
}
