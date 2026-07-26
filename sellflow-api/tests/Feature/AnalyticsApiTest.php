<?php

namespace Tests\Feature;

use App\Models\Business;
use App\Models\Order;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class AnalyticsApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_analytics_are_tenant_scoped_and_include_sales_breakdowns(): void
    {
        $owner = User::factory()->create();
        $business = $this->business($owner, 'Analytics Cafe', 'analytics-cafe');
        $otherBusiness = $this->business(User::factory()->create(), 'Other Store', 'other-store');

        $paidOrder = $this->order($business, 'SF-ANALYTICS-1', 24.50, 'paid', 'completed');
        $paidOrder->items()->create([
            'product_name' => 'Iced Latte',
            'product_slug' => 'iced-latte',
            'unit_price' => 4.90,
            'quantity' => 5,
            'line_total' => 24.50,
        ]);
        $this->order($business, 'SF-ANALYTICS-2', 10, 'pending', 'preparing');
        $this->order($otherBusiness, 'SF-OTHER-1', 999, 'paid', 'completed');

        Sanctum::actingAs($owner);
        $this->getJson('/api/v1/dashboard/analytics?days=30')
            ->assertOk()
            ->assertJsonPath('data.period.days', 30)
            ->assertJsonPath('data.summary.revenue', '24.50')
            ->assertJsonPath('data.summary.orders', 2)
            ->assertJsonPath('data.statuses.2.status', 'preparing')
            ->assertJsonPath('data.statuses.2.count', 1)
            ->assertJsonPath('data.top_products.0.name', 'Iced Latte')
            ->assertJsonPath('data.top_products.0.quantity', 5);
    }

    public function test_analytics_require_authentication_and_validate_the_period(): void
    {
        $this->getJson('/api/v1/dashboard/analytics')->assertUnauthorized();

        $owner = User::factory()->create();
        $this->business($owner, 'Analytics Store', 'analytics-store');
        Sanctum::actingAs($owner);

        $this->getJson('/api/v1/dashboard/analytics?days=14')
            ->assertUnprocessable()
            ->assertJsonValidationErrors('days');
    }

    private function business(User $owner, string $name, string $slug): Business
    {
        return Business::create([
            'user_id' => $owner->id,
            'name' => $name,
            'slug' => $slug,
            'business_type' => 'food_beverage',
            'is_active' => true,
        ]);
    }

    private function order(
        Business $business,
        string $number,
        float $total,
        string $paymentStatus,
        string $status
    ): Order {
        return Order::create([
            'business_id' => $business->id,
            'order_number' => $number,
            'customer_name' => 'Analytics Customer',
            'customer_phone' => '012345678',
            'delivery_address' => 'Phnom Penh',
            'subtotal' => $total,
            'total' => $total,
            'payment_method' => 'cash',
            'payment_status' => $paymentStatus,
            'status' => $status,
            'order_type' => 'delivery',
        ]);
    }
}
