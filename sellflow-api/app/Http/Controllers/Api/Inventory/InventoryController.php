<?php

namespace App\Http\Controllers\Api\Inventory;

use App\Http\Controllers\Controller;
use App\Http\Requests\Inventory\AdjustInventoryRequest;
use App\Http\Resources\InventoryMovementResource;
use App\Http\Resources\ProductResource;
use App\Http\Resources\ProductVariantResource;
use App\Models\Product;
use App\Models\ProductVariant;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class InventoryController extends Controller
{
    private const RETAIL_TYPES = ['fashion', 'beauty', 'electronics', 'grocery_retail'];

    public function index(Request $request): JsonResponse
    {
        $business = $this->retailBusiness($request);
        $products = $business->products()
            ->with(['category', 'variants.product'])
            ->orderBy('name')
            ->get();
        $variants = $products->flatMap->variants;

        $items = $products->flatMap(function (Product $product) {
            if ($product->variants->isNotEmpty()) {
                return $product->variants->map(fn (ProductVariant $variant) => [
                    'key' => "variant-{$variant->id}",
                    'product_id' => $product->id,
                    'product_variant_id' => $variant->id,
                    'product_name' => $product->name,
                    'variant_name' => $variant->name,
                    'attributes' => $variant->attributes ?? [],
                    'sku' => $variant->sku,
                    'thumbnail' => $product->thumbnailUrl(),
                    'stock' => $variant->stock,
                    'low_stock_threshold' => $variant->low_stock_threshold,
                    'is_active' => $product->is_active && $variant->is_active,
                ]);
            }

            return [[
                'key' => "product-{$product->id}",
                'product_id' => $product->id,
                'product_variant_id' => null,
                'product_name' => $product->name,
                'variant_name' => null,
                'attributes' => [],
                'sku' => $product->sku,
                'thumbnail' => $product->thumbnailUrl(),
                'stock' => $product->stock,
                'low_stock_threshold' => $product->low_stock_threshold,
                'is_active' => $product->is_active,
            ]];
        })->values();

        $movements = $business->inventoryMovements()
            ->with(['product', 'variant'])
            ->latest()
            ->limit(20)
            ->get();

        return response()->json([
            'success' => true,
            'data' => [
                'summary' => [
                    'products' => $products->count(),
                    'variants' => $variants->count(),
                    'units' => $items->sum('stock'),
                    'low_stock' => $items->filter(
                        fn (array $item) => $item['stock'] <= $item['low_stock_threshold']
                    )->count(),
                    'out_of_stock' => $items->where('stock', 0)->count(),
                ],
                'items' => $items,
                'movements' => InventoryMovementResource::collection($movements),
            ],
        ]);
    }

    public function adjust(AdjustInventoryRequest $request): JsonResponse
    {
        $business = $this->retailBusiness($request);
        $data = $request->validated();

        $result = DB::transaction(function () use ($business, $data, $request) {
            $product = Product::query()
                ->where('business_id', $business->id)
                ->lockForUpdate()
                ->findOrFail($data['product_id']);
            $variant = null;

            if (! empty($data['product_variant_id'])) {
                $variant = ProductVariant::query()
                    ->where('business_id', $business->id)
                    ->where('product_id', $product->id)
                    ->lockForUpdate()
                    ->findOrFail($data['product_variant_id']);
            } elseif ($product->variants()->exists()) {
                throw ValidationException::withMessages([
                    'product_variant_id' => ['Choose a variant when adjusting a product that has variants.'],
                ]);
            }

            $target = $variant ?? $product;
            $before = $target->stock;
            $updates = ['stock' => $data['quantity']];
            if (array_key_exists('low_stock_threshold', $data)) {
                $updates['low_stock_threshold'] = $data['low_stock_threshold'];
            }
            $target->update($updates);

            $movement = $business->inventoryMovements()->create([
                'product_id' => $product->id,
                'product_variant_id' => $variant?->id,
                'user_id' => $request->user()->id,
                'type' => 'adjustment',
                'quantity_delta' => $data['quantity'] - $before,
                'quantity_before' => $before,
                'quantity_after' => $data['quantity'],
                'reason' => $data['reason'] ?? 'Manual stock adjustment',
            ]);

            if ($variant) {
                $product->syncVariantStock();
            }

            return [
                'product' => $product->fresh()->load(['category', 'variants.product']),
                'variant' => $variant?->fresh()->load('product'),
                'movement' => $movement->load(['product', 'variant']),
            ];
        });

        return response()->json([
            'success' => true,
            'message' => 'Inventory updated successfully.',
            'data' => [
                'product' => new ProductResource($result['product']),
                'variant' => $result['variant'] ? new ProductVariantResource($result['variant']) : null,
                'movement' => new InventoryMovementResource($result['movement']),
            ],
        ]);
    }

    private function retailBusiness(Request $request)
    {
        $business = $request->user()?->business;
        abort_unless($business, 422, 'Please create a business first.');
        abort_unless(
            in_array($business->business_type, self::RETAIL_TYPES, true),
            403,
            'Inventory management is available for retail businesses.'
        );

        return $business;
    }
}
