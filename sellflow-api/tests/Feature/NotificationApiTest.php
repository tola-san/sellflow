<?php

namespace Tests\Feature;

use App\Models\Business;
use App\Models\BusinessNotification;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
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
