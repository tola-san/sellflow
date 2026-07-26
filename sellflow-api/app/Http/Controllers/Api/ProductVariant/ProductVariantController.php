<?php

namespace App\Http\Controllers\Api\ProductVariant;

use App\Http\Controllers\Controller;
use App\Http\Requests\ProductVariant\StoreProductVariantRequest;
use App\Http\Requests\ProductVariant\UpdateProductVariantRequest;
use App\Http\Resources\ProductVariantResource;
use App\Models\Product;
use App\Models\ProductVariant;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ProductVariantController extends Controller
{
    private const RETAIL_TYPES = ['fashion', 'beauty', 'electronics', 'grocery_retail'];

    public function index(Request $request): JsonResponse
    {
        $business = $this->retailBusiness($request);
        $variants = $business->productVariants()
            ->when($request->integer('product_id'), fn ($query, $productId) => $query->where('product_id', $productId))
            ->with('product')
            ->orderBy('product_id')
            ->orderBy('sort_order')
            ->orderBy('id')
            ->get();

        return response()->json([
            'success' => true,
            'data' => ProductVariantResource::collection($variants),
        ]);
    }

    public function store(StoreProductVariantRequest $request): JsonResponse
    {
        $business = $this->retailBusiness($request);
        $data = $request->validated();
        $product = $business->products()->findOrFail($data['product_id']);

        $variant = DB::transaction(function () use ($business, $product, $data, $request) {
            $variant = $product->variants()->create([
                ...$this->variantData($data),
                'business_id' => $business->id,
            ]);

            if ($variant->stock > 0) {
                $business->inventoryMovements()->create([
                    'product_id' => $product->id,
                    'product_variant_id' => $variant->id,
                    'user_id' => $request->user()->id,
                    'type' => 'initial',
                    'quantity_delta' => $variant->stock,
                    'quantity_before' => 0,
                    'quantity_after' => $variant->stock,
                    'reason' => 'Initial variant stock',
                ]);
            }

            $product->syncVariantStock();

            return $variant->load('product');
        });

        return response()->json([
            'success' => true,
            'message' => 'Product variant created successfully.',
            'data' => new ProductVariantResource($variant),
        ], 201);
    }

    public function update(
        UpdateProductVariantRequest $request,
        ProductVariant $productVariant
    ): JsonResponse {
        $business = $this->retailBusiness($request);
        abort_unless($productVariant->business_id === $business->id, 404);
        $data = $request->validated();

        $variant = DB::transaction(function () use ($productVariant, $data, $request, $business) {
            $before = $productVariant->stock;
            $productVariant->update($this->variantData($data));

            if ($before !== $productVariant->stock) {
                $business->inventoryMovements()->create([
                    'product_id' => $productVariant->product_id,
                    'product_variant_id' => $productVariant->id,
                    'user_id' => $request->user()->id,
                    'type' => 'adjustment',
                    'quantity_delta' => $productVariant->stock - $before,
                    'quantity_before' => $before,
                    'quantity_after' => $productVariant->stock,
                    'reason' => 'Updated from product variants',
                ]);
            }

            $productVariant->product->syncVariantStock();

            return $productVariant->fresh()->load('product');
        });

        return response()->json([
            'success' => true,
            'message' => 'Product variant updated successfully.',
            'data' => new ProductVariantResource($variant),
        ]);
    }

    public function destroy(Request $request, ProductVariant $productVariant): JsonResponse
    {
        $business = $this->retailBusiness($request);
        abort_unless($productVariant->business_id === $business->id, 404);

        DB::transaction(function () use ($productVariant) {
            $product = Product::query()->findOrFail($productVariant->product_id);
            $productVariant->delete();
            $product->syncVariantStock();
        });

        return response()->json([
            'success' => true,
            'message' => 'Product variant deleted successfully.',
        ]);
    }

    private function variantData(array $data): array
    {
        return [
            'name' => $data['name'],
            'attributes' => $data['attributes'] ?? [],
            'sku' => $data['sku'] ?? null,
            'price' => $data['price'] ?? null,
            'discount_price' => $data['discount_price'] ?? null,
            'stock' => $data['stock'],
            'low_stock_threshold' => $data['low_stock_threshold'],
            'is_active' => $data['is_active'],
            'sort_order' => $data['sort_order'] ?? 0,
        ];
    }

    private function retailBusiness(Request $request)
    {
        $business = $request->user()?->business;
        abort_unless($business, 422, 'Please create a business first.');
        abort_unless(
            in_array($business->business_type, self::RETAIL_TYPES, true),
            403,
            'Product variants are available for retail businesses.'
        );

        return $business;
    }
}
