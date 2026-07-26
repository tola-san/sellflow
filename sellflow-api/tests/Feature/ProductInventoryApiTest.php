<?php

namespace Tests\Feature;

use App\Models\Business;
use App\Models\Category;
use App\Models\InventoryMovement;
use App\Models\Order;
use App\Models\Product;
use App\Models\ProductVariant;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class ProductInventoryApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_retail_seller_can_manage_variants_and_adjust_inventory(): void
    {
        [$user, $business, $product] = $this->catalog('fashion');
        Sanctum::actingAs($user);

        $create = $this->postJson('/api/v1/product-variants', [
            'product_id' => $product->id,
            'name' => 'Black / Medium',
            'attributes' => ['Color' => 'Black', 'Size' => 'M'],
            'sku' => 'TEE-BLK-M',
            'price' => 24.50,
            'discount_price' => 20,
            'stock' => 8,
            'low_stock_threshold' => 3,
            'is_active' => true,
            'sort_order' => 0,
        ]);

        $create->assertCreated()
            ->assertJsonPath('data.name', 'Black / Medium')
            ->assertJsonPath('data.attributes.Size', 'M')
            ->assertJsonPath('data.stock', 8);

        $variant = ProductVariant::query()->firstOrFail();
        $this->assertSame(8, $product->fresh()->stock);

        $this->putJson("/api/v1/products/{$product->id}", [
            'category_id' => $product->category_id,
            'name' => $product->name,
            'slug' => $product->slug,
            'price' => 10,
            'stock' => 999,
            'is_active' => true,
            'is_featured' => false,
        ])->assertOk();
        $this->assertSame(8, $product->fresh()->stock);

        $this->putJson("/api/v1/product-variants/{$variant->id}", [
            'name' => 'Black / Medium',
            'attributes' => ['Color' => 'Black', 'Size' => 'M'],
            'sku' => 'TEE-BLK-M',
            'price' => 24.50,
            'discount_price' => 20,
            'stock' => 8,
            'low_stock_threshold' => 3,
            'is_active' => true,
            'sort_order' => 0,
        ])->assertOk();

        $this->patchJson('/api/v1/inventory/stock', [
            'product_id' => $product->id,
            'product_variant_id' => $variant->id,
            'quantity' => 4,
            'low_stock_threshold' => 5,
            'reason' => 'Stock count',
        ])->assertOk()
            ->assertJsonPath('data.variant.stock', 4)
            ->assertJsonPath('data.movement.quantity_delta', -4);

        $this->getJson('/api/v1/inventory')
            ->assertOk()
            ->assertJsonPath('data.summary.products', 1)
            ->assertJsonPath('data.summary.variants', 1)
            ->assertJsonPath('data.summary.low_stock', 1)
            ->assertJsonPath('data.items.0.sku', 'TEE-BLK-M');

        $this->assertDatabaseHas('inventory_movements', [
            'business_id' => $business->id,
            'product_variant_id' => $variant->id,
            'quantity_after' => 4,
            'reason' => 'Stock count',
        ]);
    }

    public function test_checkout_requires_a_variant_and_deducts_variant_stock(): void
    {
        [$user, $business, $product] = $this->catalog('grocery_retail');
        $variant = ProductVariant::query()->create([
            'business_id' => $business->id,
            'product_id' => $product->id,
            'name' => '500 g pack',
            'attributes' => ['Weight' => '500 g'],
            'sku' => 'RICE-500',
            'price' => 6,
            'stock' => 5,
            'low_stock_threshold' => 2,
            'is_active' => true,
        ]);
        $product->syncVariantStock();

        $payload = [
            'customer_name' => 'Inventory Customer',
            'customer_phone' => '012345678',
            'delivery_address' => 'Phnom Penh',
            'payment_method' => 'cash',
            'items' => [[
                'product_slug' => $product->slug,
                'quantity' => 2,
                'modifier_ids' => [],
            ]],
        ];

        $this->postJson("/api/v1/store/{$business->slug}/checkout", $payload)
            ->assertUnprocessable()
            ->assertJsonValidationErrors('items');

        $payload['items'][0]['variant_id'] = $variant->id;
        $this->postJson("/api/v1/store/{$business->slug}/checkout", $payload)
            ->assertCreated()
            ->assertJsonPath('data.items.0.variant.name', '500 g pack')
            ->assertJsonPath('data.items.0.unit_price', '6.00');

        $this->assertSame(3, $variant->fresh()->stock);
        $this->assertSame(3, $product->fresh()->stock);
        $this->assertTrue(InventoryMovement::query()
            ->where('type', 'sale')
            ->where('product_variant_id', $variant->id)
            ->where('quantity_delta', -2)
            ->exists());

        $order = Order::query()->firstOrFail();
        Sanctum::actingAs($user);
        $this->patchJson("/api/v1/orders/{$order->id}/status", ['status' => 'cancelled'])
            ->assertOk();
        $this->assertSame(5, $variant->fresh()->stock);
        $this->assertSame(5, $product->fresh()->stock);
    }

    public function test_variant_and_inventory_endpoints_reject_non_retail_businesses(): void
    {
        [$user, , $product] = $this->catalog('services');
        Sanctum::actingAs($user);

        $this->getJson('/api/v1/inventory')->assertForbidden();
        $this->postJson('/api/v1/product-variants', [
            'product_id' => $product->id,
            'name' => 'Option',
            'stock' => 1,
            'low_stock_threshold' => 1,
            'is_active' => true,
        ])->assertForbidden();
    }

    private function catalog(string $businessType): array
    {
        $user = User::factory()->create();
        $business = Business::query()->create([
            'user_id' => $user->id,
            'name' => 'Variant Store',
            'business_type' => $businessType,
            'slug' => 'variant-store-'.str_replace('_', '-', $businessType),
            'is_active' => true,
        ]);
        $category = Category::query()->create([
            'business_id' => $business->id,
            'name' => 'Catalog',
            'slug' => 'catalog',
            'is_active' => true,
        ]);
        $product = Product::query()->create([
            'business_id' => $business->id,
            'category_id' => $category->id,
            'name' => 'Variant Product',
            'slug' => 'variant-product',
            'price' => 10,
            'stock' => 0,
            'is_active' => true,
        ]);

        return [$user, $business, $product];
    }
}
