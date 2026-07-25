<?php

namespace App\Http\Controllers\Api\Storefront;

use App\Http\Controllers\Controller;
use App\Http\Resources\Storefront\PublicBusinessResource;
use App\Http\Resources\Storefront\PublicCategoryResource;
use App\Http\Resources\Storefront\PublicProductResource;
use App\Models\Business;
use App\Models\RestaurantTable;
use App\Services\Storefront\StorefrontService;
use Illuminate\Http\JsonResponse;

class StorefrontController extends Controller
{
    public function __construct(
        protected StorefrontService $storefrontService
    ) {}

    public function show(string $slug): JsonResponse
    {
        $business = $this->storefrontService->findBySlug($slug);

        return response()->json([
            'success' => true,
            'data' => [
                'business' => new PublicBusinessResource($business),
                'categories' => PublicCategoryResource::collection($business->categories),
                'products' => PublicProductResource::collection($business->products),
            ],
        ]);
    }

    public function product(string $slug, string $productSlug): JsonResponse
    {
        ['business' => $business, 'product' => $product] = $this->storefrontService
            ->findProduct($slug, $productSlug);

        return response()->json([
            'success' => true,
            'data' => [
                'business' => new PublicBusinessResource($business),
                'product' => new PublicProductResource($product),
            ],
        ]);
    }

    public function table(string $slug, string $token): JsonResponse
    {
        $business = Business::query()
            ->where('slug', $slug)
            ->where('business_type', 'food_beverage')
            ->where('is_active', true)
            ->firstOrFail();
        $table = RestaurantTable::query()
            ->where('business_id', $business->id)
            ->where('qr_token', $token)
            ->where('is_active', true)
            ->where('status', '!=', 'inactive')
            ->firstOrFail();

        return response()->json([
            'success' => true,
            'data' => [
                'name' => $table->name,
                'area' => $table->area,
                'capacity' => $table->capacity,
                'token' => $table->qr_token,
            ],
        ]);
    }
}
