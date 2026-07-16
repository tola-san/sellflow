<?php

namespace Tests\Feature;

use App\Models\Business;
use App\Models\Category;
use App\Models\Product;
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

    public function test_dashboard_endpoints_still_require_authentication(): void
    {
        $this->getJson('/api/v1/products')->assertUnauthorized();
        $this->getJson('/api/v1/categories')->assertUnauthorized();
        $this->getJson('/api/v1/business')->assertUnauthorized();
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
