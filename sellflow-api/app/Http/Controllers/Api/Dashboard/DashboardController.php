<?php

namespace App\Http\Controllers\Api\Dashboard;

use App\Http\Controllers\Controller;
use App\Http\Resources\BusinessResource;
use App\Http\Resources\ProductResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function overview(Request $request): JsonResponse
    {
        $business = $request->user()->business()
            ->withCount([
                'products',
                'products as active_products_count' => fn ($query) => $query->where('is_active', true),
                'products as low_stock_count' => fn ($query) => $query->where('stock', '<=', 5),
                'categories',
                'categories as active_categories_count' => fn ($query) => $query->where('is_active', true),
            ])
            ->first();

        if (! $business) {
            return response()->json([
                'success' => true,
                'data' => [
                    'business' => null,
                    'stats' => [
                        'products' => 0,
                        'active_products' => 0,
                        'categories' => 0,
                        'active_categories' => 0,
                        'low_stock' => 0,
                    ],
                    'recent_products' => [],
                ],
            ]);
        }

        $stats = [
            'products' => $business->products_count,
            'active_products' => $business->active_products_count,
            'categories' => $business->categories_count,
            'active_categories' => $business->active_categories_count,
            'low_stock' => $business->low_stock_count,
        ];

        $recentProducts = $business->products()
            ->with('category')
            ->latest()
            ->limit(5)
            ->get();

        return response()->json([
            'success' => true,
            'data' => [
                'business' => new BusinessResource($business),
                'stats' => $stats,
                'recent_products' => ProductResource::collection($recentProducts),
            ],
        ]);
    }
}
