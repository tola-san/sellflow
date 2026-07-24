<?php

namespace Tests\Feature;

use App\Jobs\SendNewOrderTelegramNotification;
use App\Models\Business;
use App\Models\Category;
use App\Models\ModifierGroup;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use Illuminate\Database\UniqueConstraintViolationException;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Bus;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;
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

    public function test_public_product_detail_is_active_and_tenant_scoped(): void
    {
        $store = $this->business('Coffee House', 'coffee-house');
        $category = $this->category($store, 'Coffee', true);
        $product = $this->product($store, $category, 'Iced Latte', 'iced-latte', true);

        $otherStore = $this->business('Other Store', 'other-store');
        $otherCategory = $this->category($otherStore, 'Other', true);
        $this->product($otherStore, $otherCategory, 'Foreign', 'foreign', true);

        $this->getJson('/api/v1/store/coffee-house/products/iced-latte')
            ->assertOk()
            ->assertJsonPath('data.business.slug', 'coffee-house')
            ->assertJsonPath('data.product.slug', $product->slug)
            ->assertJsonPath('data.product.category.slug', $category->slug)
            ->assertJsonMissing(['business_id' => $store->id]);

        $this->getJson('/api/v1/store/coffee-house/products/foreign')->assertNotFound();
    }

    public function test_public_product_detail_hides_inactive_products_and_categories(): void
    {
        $store = $this->business('Hidden Store', 'hidden-store');
        $activeCategory = $this->category($store, 'Active', true);
        $inactiveCategory = $this->category($store, 'Inactive', false);
        $this->product($store, $activeCategory, 'Hidden Product', 'hidden-product', false);
        $this->product($store, $inactiveCategory, 'Archived Product', 'archived-product', true);

        $this->getJson('/api/v1/store/hidden-store/products/hidden-product')->assertNotFound();
        $this->getJson('/api/v1/store/hidden-store/products/archived-product')->assertNotFound();
    }

    public function test_public_checkout_calculates_prices_and_creates_tenant_scoped_order(): void
    {
        Bus::fake([SendNewOrderTelegramNotification::class]);
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

        $order = Order::query()->where('business_id', $store->id)->firstOrFail();
        Bus::assertDispatchedAfterResponse(
            SendNewOrderTelegramNotification::class,
            fn (SendNewOrderTelegramNotification $job) => $job->orderId === $order->id
        );
    }

    public function test_restaurant_modifiers_are_published_validated_and_priced_by_the_server(): void
    {
        Bus::fake([SendNewOrderTelegramNotification::class]);
        $store = $this->business('Coffee House', 'coffee-house');
        $store->update(['business_type' => 'food_beverage']);
        $category = $this->category($store, 'Coffee', true);
        $product = $this->product($store, $category, 'Iced Latte', 'iced-latte', true);
        $group = ModifierGroup::create([
            'business_id' => $store->id,
            'name' => 'Size',
            'selection_type' => 'single',
            'is_required' => true,
            'min_select' => 1,
            'max_select' => 1,
            'is_active' => true,
        ]);
        $large = $group->options()->create([
            'name' => 'Large',
            'price_adjustment' => 1.25,
            'is_active' => true,
        ]);
        $group->products()->attach($product);

        $this->getJson('/api/v1/store/coffee-house/products/iced-latte')
            ->assertOk()
            ->assertJsonPath('data.product.modifier_groups.0.name', 'Size')
            ->assertJsonPath('data.product.modifier_groups.0.options.0.name', 'Large');

        $this->postJson('/api/v1/store/coffee-house/checkout', [
            'customer_name' => 'Test Customer',
            'customer_phone' => '012345678',
            'delivery_address' => 'Phnom Penh',
            'payment_method' => 'cash',
            'items' => [['product_slug' => 'iced-latte', 'quantity' => 2]],
        ])->assertUnprocessable();

        $this->postJson('/api/v1/store/coffee-house/checkout', [
            'customer_name' => 'Test Customer',
            'customer_phone' => '012345678',
            'delivery_address' => 'Phnom Penh',
            'payment_method' => 'cash',
            'items' => [[
                'product_slug' => 'iced-latte',
                'quantity' => 2,
                'modifier_ids' => [$large->id],
            ]],
        ])->assertCreated()
            ->assertJsonPath('data.items.0.unit_price', '5.75')
            ->assertJsonPath('data.items.0.modifiers.0.option_name', 'Large')
            ->assertJsonPath('data.total', '11.50');
    }

    public function test_modifier_management_is_restricted_to_restaurant_businesses(): void
    {
        $user = User::factory()->create();
        $this->business('Retail Store', 'retail-store', true, $user);
        Sanctum::actingAs($user);

        $this->getJson('/api/v1/modifier-groups')->assertForbidden();
    }

    public function test_website_checkout_returns_a_secure_telegram_receipt_link(): void
    {
        Bus::fake([SendNewOrderTelegramNotification::class]);
        config(['services.telegram.bot_username' => 'sellflow_test_bot']);
        $store = $this->business('Link Store', 'link-store');
        $category = $this->category($store, 'Drinks', true);
        $this->product($store, $category, 'Tea', 'tea', true);

        $response = $this->postJson('/api/v1/store/link-store/checkout', [
            'customer_name' => 'Website Customer',
            'customer_phone' => '012345678',
            'delivery_address' => 'Phnom Penh',
            'payment_method' => 'cash',
            'items' => [['product_slug' => 'tea', 'quantity' => 1]],
        ]);

        $response->assertCreated()
            ->assertJsonPath('data.telegram_receipt_sent', false);

        $url = $response->json('data.telegram_link_url');
        $this->assertStringStartsWith('https://t.me/sellflow_test_bot?start=sfl_', $url);
        $token = parse_url($url, PHP_URL_QUERY);
        parse_str($token, $query);
        $this->assertDatabaseHas('order_telegram_links', [
            'token_hash' => hash('sha256', $query['start']),
            'used_at' => null,
        ]);
        $this->assertDatabaseMissing('order_telegram_links', ['token_hash' => $query['start']]);
    }

    public function test_successful_checkout_sends_a_new_order_alert_to_connected_telegram(): void
    {
        config(['services.telegram.bot_token' => 'TEST_TOKEN']);
        Http::fake(['https://api.telegram.org/*' => Http::response(['ok' => true, 'result' => true])]);
        $store = $this->business('Alert & Store', 'alert-store');
        $store->notificationSetting()->create([
            'telegram_chat_id' => '987654321',
            'telegram_chat_name' => 'Alert Team',
            'telegram_enabled' => true,
            'new_order_enabled' => true,
            'payment_enabled' => true,
            'connected_at' => now(),
        ]);
        $category = $this->category($store, 'Drinks', true);
        $product = $this->product($store, $category, 'Iced Latte', 'iced-latte', true);
        $product->update(['price' => 4.50, 'stock' => 5]);

        $response = $this->postJson('/api/v1/store/alert-store/checkout', [
            'customer_name' => 'Telegram <Customer>',
            'customer_phone' => '012345678',
            'delivery_address' => 'Phnom Penh',
            'payment_method' => 'cash',
            'items' => [['product_slug' => 'iced-latte', 'quantity' => 2]],
        ]);

        $response->assertCreated();
        $orderNumber = $response->json('data.order_number');

        Http::assertSent(fn ($request) => $request->url() === 'https://api.telegram.org/botTEST_TOKEN/sendMessage'
            && $request['chat_id'] === '987654321'
            && $request['parse_mode'] === 'HTML'
            && str_contains($request['text'], "<code>#{$orderNumber}</code>")
            && str_contains($request['text'], '<blockquote><b>Customer</b>')
            && str_contains($request['text'], 'Telegram &lt;Customer&gt;')
            && str_contains($request['text'], 'Alert &amp; Store')
            && str_contains($request['text'], '<b>Total</b>  <code>$9.00</code>'));
    }

    public function test_checkout_skips_telegram_when_new_order_alerts_are_disabled(): void
    {
        config(['services.telegram.bot_token' => 'TEST_TOKEN']);
        Http::fake();
        $store = $this->business('Quiet Store', 'quiet-store');
        $store->notificationSetting()->create([
            'telegram_chat_id' => '987654321',
            'telegram_enabled' => true,
            'new_order_enabled' => false,
            'payment_enabled' => true,
            'connected_at' => now(),
        ]);
        $category = $this->category($store, 'Drinks', true);
        $this->product($store, $category, 'Tea', 'tea', true);

        $this->postJson('/api/v1/store/quiet-store/checkout', [
            'customer_name' => 'Quiet Customer',
            'customer_phone' => '012345678',
            'delivery_address' => 'Phnom Penh',
            'payment_method' => 'cash',
            'items' => [['product_slug' => 'tea', 'quantity' => 1]],
        ])->assertCreated();

        Http::assertNothingSent();
    }

    public function test_verified_telegram_checkout_notifies_customer_and_connected_seller(): void
    {
        config([
            'services.telegram.bot_token' => 'TEST_TOKEN',
            'services.telegram.bot_username' => 'sellflow_test_bot',
        ]);
        Http::fake(['https://api.telegram.org/*' => Http::response(['ok' => true])]);

        $store = $this->business('Telegram Store', 'telegram-store');
        $store->notificationSetting()->create([
            'telegram_chat_id' => 'SELLER_CHAT',
            'telegram_chat_name' => 'Store Team',
            'telegram_enabled' => true,
            'new_order_enabled' => true,
            'payment_enabled' => true,
            'connected_at' => now(),
        ]);
        $category = $this->category($store, 'Drinks', true);
        $this->product($store, $category, 'Iced Latte', 'iced-latte', true);

        $response = $this->postJson('/api/v1/store/telegram-store/checkout', [
            'customer_name' => 'Telegram Customer',
            'customer_phone' => '012345678',
            'delivery_address' => 'Phnom Penh',
            'payment_method' => 'cash',
            'telegram_init_data' => $this->signedTelegramInitData('778899', 'coffee_customer'),
            'items' => [['product_slug' => 'iced-latte', 'quantity' => 1]],
        ]);

        $response->assertCreated()
            ->assertJsonPath('data.telegram_receipt_sent', true);

        $this->assertDatabaseHas('orders', [
            'business_id' => $store->id,
            'telegram_user_id' => '778899',
            'telegram_chat_id' => '778899',
            'telegram_username' => 'coffee_customer',
            'telegram_notifications_enabled' => true,
            'telegram_last_notified_status' => 'pending',
        ]);

        Http::assertSentCount(2);
        Http::assertSent(fn ($request) => $request['chat_id'] === 'SELLER_CHAT'
            && str_contains($request['text'], 'New order received'));
        Http::assertSent(fn ($request) => $request['chat_id'] === '778899'
            && str_contains($request['text'], 'Order received')
            && $request['reply_markup']['inline_keyboard'][0][0]['text'] === 'Open store');
    }

    public function test_checkout_rejects_forged_telegram_customer_data(): void
    {
        config(['services.telegram.bot_token' => 'TEST_TOKEN']);
        Http::fake();
        $store = $this->business('Secure Telegram Store', 'secure-telegram-store');
        $category = $this->category($store, 'Drinks', true);
        $this->product($store, $category, 'Tea', 'tea', true);

        $this->postJson('/api/v1/store/secure-telegram-store/checkout', [
            'customer_name' => 'Forged Customer',
            'customer_phone' => '012345678',
            'delivery_address' => 'Phnom Penh',
            'payment_method' => 'cash',
            'telegram_init_data' => 'auth_date='.now()->timestamp.'&user=%7B%22id%22%3A123%7D&hash='.str_repeat('0', 64),
            'items' => [['product_slug' => 'tea', 'quantity' => 1]],
        ])->assertUnprocessable()->assertJsonValidationErrors('telegram_init_data');

        $this->assertDatabaseCount('orders', 0);
        Http::assertNothingSent();
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

    public function test_new_seller_can_load_the_empty_business_page_and_create_a_store(): void
    {
        $user = User::factory()->create();
        Sanctum::actingAs($user);

        $this->getJson('/api/v1/business')
            ->assertOk()
            ->assertExactJson([
                'success' => true,
                'data' => null,
            ]);

        $this->getJson('/api/v1/me')
            ->assertOk()
            ->assertJsonPath('data.has_business', false)
            ->assertJsonPath('data.onboarding_completed', false)
            ->assertJsonPath('data.business_type', null)
            ->assertJsonPath('data.business', null);

        $this->postJson('/api/v1/business', [
            'name' => 'New Store',
            'business_type' => 'food_beverage',
            'slug' => 'new-store',
            'is_active' => true,
        ])
            ->assertCreated()
            ->assertJsonPath('data.name', 'New Store')
            ->assertJsonPath('data.business_type', 'food_beverage')
            ->assertJsonPath('data.slug', 'new-store');

        $this->assertDatabaseHas('businesses', [
            'user_id' => $user->id,
            'business_type' => 'food_beverage',
            'slug' => 'new-store',
        ]);

        $this->getJson('/api/v1/me')
            ->assertOk()
            ->assertJsonPath('data.has_business', true)
            ->assertJsonPath('data.onboarding_completed', true)
            ->assertJsonPath('data.business_type', 'food_beverage')
            ->assertJsonPath('data.business.name', 'New Store')
            ->assertJsonPath('data.business.slug', 'new-store')
            ->assertJsonPath('data.business.business_type', 'food_beverage')
            ->assertJsonPath('data.business.is_active', true);

        $anotherUser = User::factory()->create();
        Sanctum::actingAs($anotherUser);

        $this->postJson('/api/v1/business', [
            'name' => 'Another Store',
            'business_type' => 'unsupported',
            'slug' => 'another-store',
        ])
            ->assertUnprocessable()
            ->assertJsonValidationErrors('business_type');
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
            'banner_overlay_opacity' => 42,
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
            ->assertJsonPath('data.business.theme.banner_overlay_opacity', 42)
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

    public function test_seller_can_upload_replace_and_delete_a_product_image(): void
    {
        Storage::fake('public');
        config(['product_images.disk' => 'public']);

        $user = User::factory()->create();
        $business = $this->business('Image Store', 'image-store', true, $user);
        $category = $this->category($business, 'Image Category', true);
        Sanctum::actingAs($user);

        $payload = [
            'category_id' => $category->id,
            'name' => 'Photo Product',
            'slug' => 'photo-product',
            'price' => 12.50,
            'stock' => 4,
            'is_active' => 1,
            'is_featured' => 0,
            'thumbnail' => UploadedFile::fake()->image('first.jpg', 800, 800),
        ];

        $create = $this->post('/api/v1/products', $payload, ['Accept' => 'application/json']);
        $create->assertCreated()->assertJsonPath('data.name', 'Photo Product');
        $product = Product::query()->where('slug', 'photo-product')->firstOrFail();
        $firstPath = $product->thumbnail;
        Storage::disk('public')->assertExists($firstPath);

        $replace = $this->post("/api/v1/products/{$product->id}", [
            ...$payload,
            '_method' => 'PUT',
            'thumbnail' => UploadedFile::fake()->image('replacement.webp', 900, 900),
        ], ['Accept' => 'application/json']);
        $replace->assertOk();
        $product->refresh();
        Storage::disk('public')->assertMissing($firstPath);
        Storage::disk('public')->assertExists($product->thumbnail);

        $currentPath = $product->thumbnail;
        $this->deleteJson("/api/v1/products/{$product->id}")->assertOk();
        Storage::disk('public')->assertMissing($currentPath);
    }

    public function test_seller_can_upload_business_media_and_publish_social_links(): void
    {
        Storage::fake('public');
        config(['business_media.disk' => 'public']);

        $user = User::factory()->create();
        $business = $this->business('Social Store', 'social-store', true, $user);
        Sanctum::actingAs($user);

        $response = $this->post('/api/v1/business', [
            '_method' => 'PUT',
            'name' => 'Social Store',
            'slug' => 'social-store',
            'phone' => '012345678',
            'facebook_url' => 'https://facebook.com/socialstore',
            'instagram_url' => 'https://instagram.com/socialstore',
            'telegram_url' => 'https://t.me/socialstore',
            'tiktok_url' => 'https://tiktok.com/@socialstore',
            'banner_overlay_opacity' => 25,
            'is_active' => 1,
            'logo_image' => UploadedFile::fake()->image('logo.png', 600, 600),
            'banner_image' => UploadedFile::fake()->image('banner.jpg', 1600, 600),
        ], ['Accept' => 'application/json']);

        $response->assertOk()
            ->assertJsonPath('data.facebook_url', 'https://facebook.com/socialstore')
            ->assertJsonMissingPath('data.email');

        $business->refresh();
        Storage::disk('public')->assertExists($business->logo);
        Storage::disk('public')->assertExists($business->banner);

        $this->getJson('/api/v1/store/social-store')
            ->assertOk()
            ->assertJsonPath('data.business.telegram_url', 'https://t.me/socialstore')
            ->assertJsonPath('data.business.theme.banner_overlay_opacity', 25)
            ->assertJsonMissingPath('data.business.email');
    }

    public function test_product_upload_rejects_non_image_files(): void
    {
        Storage::fake('public');
        $user = User::factory()->create();
        $business = $this->business('Safe Upload Store', 'safe-upload-store', true, $user);
        $category = $this->category($business, 'Safe Category', true);
        Sanctum::actingAs($user);

        $this->post('/api/v1/products', [
            'category_id' => $category->id,
            'name' => 'Unsafe Product',
            'slug' => 'unsafe-product',
            'price' => 5,
            'stock' => 1,
            'thumbnail' => UploadedFile::fake()->create('payload.txt', 10, 'text/plain'),
        ], ['Accept' => 'application/json'])
            ->assertUnprocessable()
            ->assertJsonValidationErrors('thumbnail');
    }

    public function test_product_image_uses_the_configured_persistent_disk(): void
    {
        Storage::fake('public');
        Storage::fake('s3');
        config(['product_images.disk' => 's3']);

        $user = User::factory()->create();
        $business = $this->business('Cloud Image Store', 'cloud-image-store', true, $user);
        $category = $this->category($business, 'Cloud Category', true);
        Sanctum::actingAs($user);

        $this->post('/api/v1/products', [
            'category_id' => $category->id,
            'name' => 'Persistent Product',
            'slug' => 'persistent-product',
            'price' => 9.50,
            'stock' => 2,
            'thumbnail' => UploadedFile::fake()->image('persistent.webp', 600, 600),
        ], ['Accept' => 'application/json'])->assertCreated();

        $product = Product::query()->where('slug', 'persistent-product')->firstOrFail();
        Storage::disk('s3')->assertExists($product->thumbnail);
        Storage::disk('public')->assertMissing($product->thumbnail);
    }

    public function test_cloudinary_mode_handles_legacy_paths_and_secure_urls(): void
    {
        config(['product_images.disk' => 'cloudinary']);

        $product = new Product(['thumbnail' => 'products/1/old-local-image.jpg']);
        $this->assertNull($product->thumbnailUrl());

        $cloudinaryUrl = 'https://res.cloudinary.com/demo/image/upload/v1/sellflow/products/1/item.jpg';
        $product->thumbnail = $cloudinaryUrl;
        $this->assertSame($cloudinaryUrl, $product->thumbnailUrl());
    }

    public function test_cloudinary_upload_rejects_placeholder_configuration_clearly(): void
    {
        config([
            'product_images.disk' => 'cloudinary',
            'services.cloudinary.url' => 'CLOUDINARY_URL=cloudinary://<api_key>:********@cloud_name',
        ]);

        $user = User::factory()->create();
        $business = $this->business('Cloud Config Store', 'cloud-config-store', true, $user);
        $category = $this->category($business, 'Cloud Config Category', true);
        Sanctum::actingAs($user);

        $this->post('/api/v1/products', [
            'category_id' => $category->id,
            'name' => 'Cloud Config Product',
            'slug' => 'cloud-config-product',
            'price' => 10,
            'stock' => 1,
            'thumbnail' => UploadedFile::fake()->image('cloud-config.jpg'),
        ], ['Accept' => 'application/json'])
            ->assertStatus(503)
            ->assertJsonPath(
                'message',
                'CLOUDINARY_URL is invalid. Use cloudinary://API_KEY:API_SECRET@CLOUD_NAME with real credentials.'
            );
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

    private function signedTelegramInitData(string $userId, string $username): string
    {
        $parameters = [
            'auth_date' => (string) now()->timestamp,
            'query_id' => 'AAHdF6IQAAAAAN0XohDhrOrc',
            'user' => json_encode([
                'id' => (int) $userId,
                'first_name' => 'Telegram',
                'username' => $username,
            ], JSON_UNESCAPED_SLASHES),
        ];
        ksort($parameters, SORT_STRING);
        $dataCheckString = collect($parameters)->map(fn ($value, $key) => $key.'='.$value)->implode("\n");
        $secretKey = hash_hmac('sha256', 'TEST_TOKEN', 'WebAppData', true);
        $parameters['hash'] = hash_hmac('sha256', $dataCheckString, $secretKey);

        return http_build_query($parameters, '', '&', PHP_QUERY_RFC3986);
    }
}
