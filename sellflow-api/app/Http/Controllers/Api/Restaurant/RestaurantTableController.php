<?php

namespace App\Http\Controllers\Api\Restaurant;

use App\Http\Controllers\Controller;
use App\Http\Requests\Restaurant\SaveRestaurantTableRequest;
use App\Http\Resources\RestaurantTableResource;
use App\Models\RestaurantTable;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class RestaurantTableController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $business = $this->restaurantBusiness($request);
        $tables = $business->restaurantTables()
            ->with(['orders' => fn ($orders) => $orders
                ->whereNotIn('status', ['completed', 'cancelled'])
                ->latest()
                ->limit(1)])
            ->orderBy('sort_order')
            ->orderBy('name')
            ->get();

        return response()->json([
            'success' => true,
            'data' => RestaurantTableResource::collection($tables),
        ]);
    }

    public function store(SaveRestaurantTableRequest $request): JsonResponse
    {
        $business = $this->restaurantBusiness($request);
        $table = $business->restaurantTables()->create([
            ...$request->validated(),
            'qr_token' => Str::random(40),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Restaurant table created successfully.',
            'data' => new RestaurantTableResource($table),
        ], 201);
    }

    public function update(SaveRestaurantTableRequest $request, RestaurantTable $restaurantTable): JsonResponse
    {
        $business = $this->restaurantBusiness($request);
        abort_unless($restaurantTable->business_id === $business->id, 404);
        if ($restaurantTable->orders()->whereNotIn('status', ['completed', 'cancelled'])->exists()) {
            abort_if(
                $request->validated('status') !== 'occupied' || ! $request->validated('is_active'),
                422,
                'A table with an active order must remain active and occupied.'
            );
        }
        $restaurantTable->update($request->validated());

        return response()->json([
            'success' => true,
            'message' => 'Restaurant table updated successfully.',
            'data' => new RestaurantTableResource($restaurantTable->fresh()),
        ]);
    }

    public function destroy(Request $request, RestaurantTable $restaurantTable): JsonResponse
    {
        $business = $this->restaurantBusiness($request);
        abort_unless($restaurantTable->business_id === $business->id, 404);
        abort_if($restaurantTable->orders()->whereNotIn('status', ['completed', 'cancelled'])->exists(), 422, 'Complete or cancel the active order before deleting this table.');
        $restaurantTable->delete();

        return response()->json(['success' => true, 'message' => 'Restaurant table deleted successfully.']);
    }

    public function regenerateQr(Request $request, RestaurantTable $restaurantTable): JsonResponse
    {
        $business = $this->restaurantBusiness($request);
        abort_unless($restaurantTable->business_id === $business->id, 404);
        $restaurantTable->update(['qr_token' => Str::random(40)]);

        return response()->json([
            'success' => true,
            'message' => 'QR ordering link regenerated.',
            'data' => new RestaurantTableResource($restaurantTable->fresh()),
        ]);
    }

    private function restaurantBusiness(Request $request)
    {
        $business = $request->user()?->business;
        abort_unless($business, 422, 'Please create a business first.');
        abort_unless($business->business_type === 'food_beverage', 403, 'Tables are available for restaurant businesses.');

        return $business;
    }
}
