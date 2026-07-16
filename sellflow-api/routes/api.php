<?php

use App\Http\Controllers\Api\Auth\AuthController;
use App\Http\Controllers\Api\Business\BusinessController;
use App\Http\Controllers\Api\Category\CategoryController;
use App\Http\Controllers\Api\Dashboard\DashboardController;
use App\Http\Controllers\Api\Product\ProductController;
use App\Http\Controllers\Api\Storefront\StorefrontController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {
    // Public customer storefront. Authentication is intentionally not required.
    Route::get('/store/{slug}', [StorefrontController::class, 'show']);
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

        // Categories
        Route::apiResource('categories', CategoryController::class);

        // Products
        Route::apiResource('products', ProductController::class);
    });
});
