<?php

use App\Http\Controllers\Api\Auth\AuthController;
use App\Http\Controllers\Api\Business\BusinessController;
use App\Http\Controllers\Api\Business\BusinessThemeController;
use App\Http\Controllers\Api\Business\TelegramNotificationController;
use App\Http\Controllers\Api\Category\CategoryController;
use App\Http\Controllers\Api\Dashboard\AnalyticsController;
use App\Http\Controllers\Api\Dashboard\DashboardController;
use App\Http\Controllers\Api\Inventory\InventoryController;
use App\Http\Controllers\Api\ModifierGroup\ModifierGroupController;
use App\Http\Controllers\Api\Order\OrderController;
use App\Http\Controllers\Api\Product\ProductController;
use App\Http\Controllers\Api\ProductVariant\ProductVariantController;
use App\Http\Controllers\Api\Restaurant\MenuAvailabilityController;
use App\Http\Controllers\Api\Restaurant\RestaurantTableController;
use App\Http\Controllers\Api\Storefront\CheckoutController;
use App\Http\Controllers\Api\Storefront\StorefrontController;
use App\Http\Controllers\Api\TelegramWebhookController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {
    // Public customer storefront. Authentication is intentionally not required.
    Route::get('/store/{slug}', [StorefrontController::class, 'show']);
    Route::get('/store/{slug}/products/{productSlug}', [StorefrontController::class, 'product']);
    Route::get('/store/{slug}/tables/{token}', [StorefrontController::class, 'table']);
    Route::post('/store/{slug}/checkout', [CheckoutController::class, 'store'])->middleware('throttle:20,1');
    /*
    |--------------------------------------------------------------------------
    | Public authentication routes
    |--------------------------------------------------------------------------
    */

    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/integrations/telegram/webhook', TelegramWebhookController::class)
        ->middleware('throttle:60,1')
        ->name('telegram.webhook');

    /*
    |--------------------------------------------------------------------------
    | Protected routes
    |--------------------------------------------------------------------------
    */

    Route::middleware('auth:sanctum')->group(function () {
        // Authentication
        Route::get('/me', [AuthController::class, 'me']);
        Route::post('/logout', [AuthController::class, 'logout']);

        // Dashboard summary
        Route::get('/dashboard/overview', [DashboardController::class, 'overview']);
        Route::get('/dashboard/analytics', AnalyticsController::class);

        // Business
        Route::get('/business', [BusinessController::class, 'show']);
        Route::post('/business', [BusinessController::class, 'store']);
        Route::put('/business', [BusinessController::class, 'update']);
        Route::get('/business/theme', [BusinessThemeController::class, 'show']);
        Route::put('/business/theme', [BusinessThemeController::class, 'update']);
        Route::get('/business/notifications/telegram', [TelegramNotificationController::class, 'show']);
        Route::post('/business/notifications/telegram/connect-code', [TelegramNotificationController::class, 'createCode']);
        Route::patch('/business/notifications/telegram', [TelegramNotificationController::class, 'update']);
        Route::post('/business/notifications/telegram/test', [TelegramNotificationController::class, 'test']);
        Route::delete('/business/notifications/telegram', [TelegramNotificationController::class, 'destroy']);

        // Categories
        Route::apiResource('categories', CategoryController::class);

        // Products
        Route::apiResource('products', ProductController::class);
        Route::apiResource('product-variants', ProductVariantController::class)->except('show');
        Route::get('/inventory', [InventoryController::class, 'index']);
        Route::patch('/inventory/stock', [InventoryController::class, 'adjust']);

        // Restaurant add-ons and modifiers
        Route::apiResource('modifier-groups', ModifierGroupController::class)->except('show');
        Route::get('/menu-availability', [MenuAvailabilityController::class, 'index']);
        Route::patch('/menu-availability/{product}', [MenuAvailabilityController::class, 'update']);
        Route::apiResource('restaurant-tables', RestaurantTableController::class)->except('show');
        Route::post('/restaurant-tables/{restaurantTable}/regenerate-qr', [RestaurantTableController::class, 'regenerateQr']);

        // Orders
        Route::get('/orders', [OrderController::class, 'index']);
        Route::get('/orders/{order}', [OrderController::class, 'show']);
        Route::patch('/orders/{order}/status', [OrderController::class, 'updateStatus']);
        Route::patch('/orders/{order}/payment-status', [OrderController::class, 'updatePaymentStatus']);
    });
});
