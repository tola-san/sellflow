<?php

namespace Tests\Feature;

use App\Models\Business;
use App\Models\Category;
use App\Models\Product;
use App\Models\Order;
use App\Models\User;
use Illuminate\Database\UniqueConstraintViolationException;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class StorefrontApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_active_storefront_is_public_and_tenant_scoped(): void
    {
        $store = $this->business('Coffee House', 'coffee-house');
        $activeCategory = $this->category($store, 'Coffee', true, 2);
        $inactiveCategory = $this->category($store, 'Secret', false, 1);

        $visible = $this->product($store, $activeCategory, 'Latte', 'latte', true);
        $this->product($store, $activeCategory, 'Hidden', 'hidden', false);
        $this->product($store, $inactiveCategory, 'Archived', 'archived', true);

        $otherStore = $this->business('Other Store', 'other-store');
        $otherCategory = $this->category($otherStore, 'Other', true);
        $this->product($otherStore, $otherCategory, 'Foreign', 'foreign', true);

        $response = $this->getJson('/api/v1/store/coffee-house');

        $response->assertOk()
            ->assertJsonPath('data.business.slug', 'coffee-house')
            ->assertJsonPath('data.business.theme.primary_color', '#10B981')
            ->assertJsonCount(1, 'data.categories')
            ->assertJsonCount(1, 'data.products')
            ->assertJsonPath('data.products.0.slug', $visible->slug)
            ->assertJsonMissing(['business_id' => $store->id])
            ->assertJsonMissing(['slug' => 'foreign'])
            ->assertJsonMissing(['slug' => 'hidden'])
            ->assertJsonMissing(['slug' => 'archived']);
    }

    public function test_missing_or_inactive_storefront_returns_not_found(): void
    {
        $this->business('Closed Store', 'closed-store', false);

        $this->getJson('/api/v1/store/missing-store')->assertNotFound();
        $this->getJson('/api/v1/store/closed-store')->assertNotFound();
    }

    public function test_public_checkout_calculates_prices_and_creates_tenant_scoped_order(): void
    {
        $store = $this->business('Checkout Store', 'checkout-store');
        $category = $this->category($store, 'Drinks', true);
        $product = $this->product($store, $category, 'Iced Latte', 'iced-latte', true);
        $product->update(['price' => 5.25, 'discount_price' => 4.50, 'stock' => 5]);

        $response = $this->postJson('/api/v1/store/checkout-store/checkout', [
            'customer_name' => 'Test Customer',
            'customer_phone' => '012345678',
            'delivery_address' => 'Phnom Penh',
            'payment_method' => 'cash',
            'items' => [[
                'product_slug' => 'iced-latte',
                'quantity' => 2,
                'price' => 0.01,
            ]],
        ]);

        $response->assertCreated()
            ->assertJsonPath('data.total', '9.00')
            ->assertJsonPath('data.items.0.unit_price', '4.50')
            ->assertJsonPath('data.items.0.quantity', 2);

        $this->assertDatabaseHas('orders', [
            'business_id' => $store->id,
            'customer_phone' => '012345678',
            'total' => 9.00,
        ]);
    }

    public function test_checkout_rejects_products_from_another_business_and_excess_stock(): void
    {
        $store = $this->business('First Store', 'first-store');
        $category = $this->category($store, 'First Category', true);
        $product = $this->product($store, $category, 'Limited', 'limited', true);
        $product->update(['stock' => 1]);

        $other = $this->business('Second Store', 'second-store');
        $otherCategory = $this->category($other, 'Second Category', true);
        $this->product($other, $otherCategory, 'Foreign', 'foreign', true);

        $base = [
            'customer_name' => 'Test Customer',
            'customer_phone' => '012345678',
            'delivery_address' => 'Phnom Penh',
            'payment_method' => 'cash',
        ];

        $this->postJson('/api/v1/store/first-store/checkout', $base + [
            'items' => [['product_slug' => 'foreign', 'quantity' => 1]],
        ])->assertUnprocessable()->assertJsonValidationErrors('items');

        $this->postJson('/api/v1/store/first-store/checkout', $base + [
            'items' => [['product_slug' => 'limited', 'quantity' => 2]],
        ])->assertUnprocessable()->assertJsonValidationErrors('items');
    }

    public function test_dashboard_endpoints_still_require_authentication(): void
    {
        $this->getJson('/api/v1/products')->assertUnauthorized();
        $this->getJson('/api/v1/categories')->assertUnauthorized();
        $this->getJson('/api/v1/business')->assertUnauthorized();
        $this->getJson('/api/v1/business/theme')->assertUnauthorized();
        $this->putJson('/api/v1/business/theme', [])->assertUnauthorized();
        $this->getJson('/api/v1/orders')->assertUnauthorized();
    }

    public function test_seller_can_publish_a_valid_theme_to_the_public_storefront(): void
    {
        $user = User::factory()->create();
        $business = $this->business('Theme Store', 'theme-store', true, $user);
        Sanctum::actingAs($user);

        $theme = [
            'preset' => 'modern',
            'primary_color' => '#7C3AED',
            'secondary_color' => '#0891B2',
            'background_color' => '#F8FAFC',
            'surface_color' => '#FFFFFF',
            'text_color' => '#0F172A',
            'muted_color' => '#64748B',
            'font_family' => 'modern',
            'card_style' => 'elevated',
            'button_style' => 'pill',
            'hero_style' => 'gradient',
            'grid_columns' => 4,
        ];

        $this->putJson('/api/v1/business/theme', $theme)
            ->assertOk()
            ->assertJsonPath('data.theme.preset', 'modern')
            ->assertJsonPath('data.theme.button_style', 'pill');

        $this->assertDatabaseHas('businesses', [
            'id' => $business->id,
            'theme_preset' => 'modern',
            'primary_color' => '#7C3AED',
        ]);

        $this->getJson('/api/v1/store/theme-store')
            ->assertOk()
            ->assertJsonPath('data.business.theme.primary_color', '#7C3AED')
            ->assertJsonPath('data.business.theme.grid_columns', 4);
    }

    public function test_theme_endpoint_rejects_unsafe_or_unknown_values(): void
    {
        $user = User::factory()->create();
        $this->business('Safe Store', 'safe-store', true, $user);
        Sanctum::actingAs($user);

        $this->putJson('/api/v1/business/theme', [
            'preset' => 'custom-script',
            'primary_color' => 'javascript:alert(1)',
        ])->assertUnprocessable()
            ->assertJsonValidationErrors(['preset', 'primary_color']);
    }

    public function test_seller_cannot_access_another_sellers_catalog_resources(): void
    {
        $owner = User::factory()->create();
        $ownerBusiness = $this->business('Owner', 'owner', true, $owner);
        $category = $this->category($ownerBusiness, 'Owner Category', true);
        $product = $this->product($ownerBusiness, $category, 'Owner Product', 'owner-product', true);

        $attacker = User::factory()->create();
        $this->business('Attacker', 'attacker', true, $attacker);
        Sanctum::actingAs($attacker);

        $this->getJson("/api/v1/categories/{$category->id}")->assertForbidden();
        $this->deleteJson("/api/v1/categories/{$category->id}")->assertForbidden();
        $this->getJson("/api/v1/products/{$product->id}")->assertForbidden();
        $this->deleteJson("/api/v1/products/{$product->id}")->assertForbidden();
    }

    public function test_seller_order_management_is_tenant_scoped_and_enforces_transitions(): void
    {
        $owner = User::factory()->create();
        $business = $this->business('Order Owner', 'order-owner', true, $owner);
        $order = Order::create([
            'business_id' => $business->id,
            'order_number' => 'SF-TEST-OWNER',
            'customer_name' => 'Customer One',
            'customer_phone' => '012345678',
            'delivery_address' => 'Phnom Penh',
            'subtotal' => 10,
            'total' => 10,
            'payment_method' => 'cash',
            'payment_status' => 'pending',
            'status' => 'pending',
        ]);

        $attacker = User::factory()->create();
        $this->business('Order Attacker', 'order-attacker', true, $attacker);
        Sanctum::actingAs($attacker);
        $this->getJson("/api/v1/orders/{$order->id}")->assertForbidden();
        $this->patchJson("/api/v1/orders/{$order->id}/status", ['status' => 'confirmed'])->assertForbidden();

        Sanctum::actingAs($owner);
        $this->getJson('/api/v1/orders?search=Customer')
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('summary.pending', 1);

        $this->patchJson("/api/v1/orders/{$order->id}/status", ['status' => 'completed'])
            ->assertUnprocessable()
            ->assertJsonValidationErrors('status');

        $this->patchJson("/api/v1/orders/{$order->id}/status", ['status' => 'confirmed'])
            ->assertOk()
            ->assertJsonPath('data.status', 'confirmed');

        $this->patchJson("/api/v1/orders/{$order->id}/payment-status", ['payment_status' => 'paid'])
            ->assertOk()
            ->assertJsonPath('data.payment_status', 'paid');
    }

    public function test_user_can_own_only_one_business(): void
    {
        $user = User::factory()->create();
        $this->business('First', 'first', true, $user);

        $this->expectException(UniqueConstraintViolationException::class);
        $this->business('Second', 'second', true, $user);
    }

    private function business(string $name, string $slug, bool $active = true, ?User $user = null): Business
    {
        return Business::create([
            'user_id' => ($user ?? User::factory()->create())->id,
            'name' => $name,
            'slug' => $slug,
            'is_active' => $active,
        ]);
    }

    private function category(Business $business, string $name, bool $active, int $order = 0): Category
    {
        return Category::create([
            'business_id' => $business->id,
            'name' => $name,
            'slug' => strtolower(str_replace(' ', '-', $name)),
            'sort_order' => $order,
            'is_active' => $active,
        ]);
    }

    private function product(Business $business, Category $category, string $name, string $slug, bool $active): Product
    {
        return Product::create([
            'business_id' => $business->id,
            'category_id' => $category->id,
            'name' => $name,
            'slug' => $slug,
            'price' => 4.50,
            'stock' => 10,
            'is_active' => $active,
        ]);
    }
}
