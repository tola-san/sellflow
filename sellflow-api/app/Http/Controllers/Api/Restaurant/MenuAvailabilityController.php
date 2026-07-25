<?php

namespace App\Http\Controllers\Api\Restaurant;

use App\Http\Controllers\Controller;
use App\Http\Requests\Restaurant\UpdateMenuAvailabilityRequest;
use App\Http\Resources\ProductResource;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class MenuAvailabilityController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $business = $this->restaurantBusiness($request);
        $products = $business->products()
            ->with(['category', 'availabilitySchedules'])
            ->orderBy('name')
            ->get();

        return response()->json([
            'success' => true,
            'data' => ProductResource::collection($products),
        ]);
    }

    public function update(UpdateMenuAvailabilityRequest $request, Product $product): JsonResponse
    {
        $business = $this->restaurantBusiness($request);
        abort_unless($product->business_id === $business->id, 404);

        $product = DB::transaction(function () use ($product, $request) {
            $data = $request->validated();
            $product->update(['availability_status' => $data['availability_status']]);
            $product->availabilitySchedules()->delete();

            if ($data['availability_status'] === 'scheduled') {
                $product->availabilitySchedules()->createMany(
                    collect($data['schedules'] ?? [])->values()->map(fn (array $schedule, int $index) => [
                        ...$schedule,
                        'sort_order' => $index,
                    ])->all()
                );
            }

            return $product->fresh()->load(['category', 'availabilitySchedules']);
        });

        return response()->json([
            'success' => true,
            'message' => 'Menu availability updated successfully.',
            'data' => new ProductResource($product),
        ]);
    }

    private function restaurantBusiness(Request $request)
    {
        $business = $request->user()?->business;
        abort_unless($business, 422, 'Please create a business first.');
        abort_unless($business->business_type === 'food_beverage', 403, 'Menu availability is available for restaurant businesses.');

        return $business;
    }
}
