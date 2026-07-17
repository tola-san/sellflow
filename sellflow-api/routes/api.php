<?php

use App\Http\Controllers\Api\Auth\AuthController;
use App\Http\Controllers\Api\Business\BusinessController;
use App\Http\Controllers\Api\Business\BusinessThemeController;
use App\Http\Controllers\Api\Category\CategoryController;
use App\Http\Controllers\Api\Dashboard\DashboardController;
use App\Http\Controllers\Api\Product\ProductController;
use App\Http\Controllers\Api\Order\OrderController;
use App\Http\Controllers\Api\Storefront\StorefrontController;
use App\Http\Controllers\Api\Storefront\CheckoutController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {
    // Public customer storefront. Authentication is intentionally not required.
    Route::get('/store/{slug}', [StorefrontController::class, 'show']);
    Route::get('/store/{slug}/products/{productSlug}', [StorefrontController::class, 'product']);
    Route::post('/store/{slug}/checkout', [CheckoutController::class, 'store'])->middleware('throttle:20,1');
    /*
    |--------------------------------------------------------------------------
    | Public authentication routes
    |--------------------------------------------------------------------------
    */

    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);

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

        // Business
        Route::get('/business', [BusinessController::class, 'show']);
        Route::post('/business', [BusinessController::class, 'store']);
        Route::put('/business', [BusinessController::class, 'update']);
        Route::get('/business/theme', [BusinessThemeController::class, 'show']);
        Route::put('/business/theme', [BusinessThemeController::class, 'update']);

        // Categories
        Route::apiResource('categories', CategoryController::class);

        // Products
        Route::apiResource('products', ProductController::class);

        // Orders
        Route::get('/orders', [OrderController::class, 'index']);
        Route::get('/orders/{order}', [OrderController::class, 'show']);
        Route::patch('/orders/{order}/status', [OrderController::class, 'updateStatus']);
        Route::patch('/orders/{order}/payment-status', [OrderController::class, 'updatePaymentStatus']);
    });
});
