<?php

namespace Tests\Feature;

use App\Models\Business;
use App\Models\SubscriptionPlan;
use App\Models\User;
use Carbon\CarbonImmutable;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class BillingApiTest extends TestCase
{
    use RefreshDatabase;

    protected function tearDown(): void
    {
        CarbonImmutable::setTestNow();
        parent::tearDown();
    }

    public function test_billing_exposes_the_confirmed_plan_catalog(): void
    {
        $this->getJson('/api/v1/billing/plans')
            ->assertOk()
            ->assertJsonCount(3, 'data')
            ->assertJsonPath('data.0.slug', 'starter')
            ->assertJsonPath('data.0.monthly_price', '6.00')
            ->assertJsonPath('data.1.slug', 'growth')
            ->assertJsonPath('data.1.yearly_price', '120.00')
            ->assertJsonPath('data.1.is_popular', true)
            ->assertJsonPath('data.2.slug', 'pro')
            ->assertJsonPath('data.2.limits.businesses', 3);
    }

    public function test_existing_business_receives_a_growth_trial_and_usage_summary(): void
    {
        CarbonImmutable::setTestNow('2026-07-28 09:00:00');
        $owner = User::factory()->create();
        $business = $this->business($owner);
        Sanctum::actingAs($owner);

        $this->getJson('/api/v1/billing')
            ->assertOk()
            ->assertJsonPath('data.subscription.status', 'trialing')
            ->assertJsonPath('data.subscription.has_access', true)
            ->assertJsonPath('data.subscription.trial_days_remaining', 30)
            ->assertJsonPath('data.subscription.plan.slug', 'growth')
            ->assertJsonPath('data.usage.businesses.used', 1)
            ->assertJsonPath('data.usage.staff.used', 1)
            ->assertJsonPath('data.usage.products.used', 0)
            ->assertJsonPath('data.usage.products.unlimited', true);

        $this->assertDatabaseHas('business_subscriptions', [
            'business_id' => $business->id,
            'status' => 'trialing',
            'subscription_plan_id' => SubscriptionPlan::query()->where('slug', 'growth')->value('id'),
        ]);
    }

    public function test_business_creation_starts_the_trial_automatically(): void
    {
        CarbonImmutable::setTestNow('2026-07-28 09:00:00');
        $owner = User::factory()->create();
        Sanctum::actingAs($owner);

        $this->postJson('/api/v1/business', [
            'name' => 'Trial Cafe',
            'business_type' => 'food_beverage',
            'slug' => 'trial-cafe',
        ])->assertCreated();

        $business = $owner->fresh()->business;
        $this->assertNotNull($business?->subscription);
        $this->assertSame('growth', $business->subscription->plan->slug);
        $this->assertSame('2026-08-27', $business->subscription->trial_ends_at->toDateString());
    }

    public function test_expired_trial_blocks_checkout_but_billing_remains_available(): void
    {
        CarbonImmutable::setTestNow('2026-07-28 09:00:00');
        $owner = User::factory()->create();
        $business = $this->business($owner);
        Sanctum::actingAs($owner);

        $this->getJson('/api/v1/billing')->assertOk();
        $business->subscription()->update(['trial_ends_at' => now()->subMinute()]);

        $this->postJson("/api/v1/store/{$business->slug}/checkout", [])
            ->assertStatus(402)
            ->assertJsonPath('code', 'SUBSCRIPTION_REQUIRED')
            ->assertJsonPath('billing_url', '/dashboard/billing');

        $this->getJson('/api/v1/billing')
            ->assertOk()
            ->assertJsonPath('data.subscription.status', 'trial_expired')
            ->assertJsonPath('data.subscription.has_access', false);
    }

    public function test_starter_plan_limits_analytics_history_to_thirty_days(): void
    {
        $owner = User::factory()->create();
        $business = $this->business($owner);
        Sanctum::actingAs($owner);

        $this->getJson('/api/v1/billing')->assertOk();
        $business->subscription()->update([
            'subscription_plan_id' => SubscriptionPlan::query()->where('slug', 'starter')->value('id'),
        ]);

        $this->getJson('/api/v1/dashboard/analytics?days=90')
            ->assertUnprocessable()
            ->assertJsonPath('code', 'SUBSCRIPTION_LIMIT_REACHED')
            ->assertJsonPath('upgrade_required', true);
    }

    private function business(User $owner): Business
    {
        return Business::query()->create([
            'user_id' => $owner->id,
            'name' => 'Billing Store',
            'slug' => 'billing-store-'.$owner->id,
            'business_type' => 'food_beverage',
            'is_active' => true,
        ]);
    }
}
