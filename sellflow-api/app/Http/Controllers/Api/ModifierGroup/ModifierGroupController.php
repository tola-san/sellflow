<?php

namespace App\Http\Controllers\Api\ModifierGroup;

use App\Http\Controllers\Controller;
use App\Http\Requests\ModifierGroup\SaveModifierGroupRequest;
use App\Http\Resources\ModifierGroupResource;
use App\Models\ModifierGroup;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ModifierGroupController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $business = $this->restaurantBusiness($request);
        $groups = $business->modifierGroups()
            ->with(['options', 'products:id'])
            ->orderBy('sort_order')
            ->latest('id')
            ->get();

        return response()->json([
            'success' => true,
            'data' => ModifierGroupResource::collection($groups),
        ]);
    }

    public function store(SaveModifierGroupRequest $request): JsonResponse
    {
        $business = $this->restaurantBusiness($request);
        $group = DB::transaction(function () use ($business, $request) {
            $data = $request->validated();
            $group = $business->modifierGroups()->create($this->groupData($data));
            $group->products()->sync($data['product_ids'] ?? []);
            $this->replaceOptions($group, $data['options']);

            return $group->load(['options', 'products:id']);
        });

        return response()->json([
            'success' => true,
            'message' => 'Add-on group created successfully.',
            'data' => new ModifierGroupResource($group),
        ], 201);
    }

    public function update(SaveModifierGroupRequest $request, ModifierGroup $modifierGroup): JsonResponse
    {
        $business = $this->restaurantBusiness($request);
        abort_unless($modifierGroup->business_id === $business->id, 404);

        $group = DB::transaction(function () use ($modifierGroup, $request) {
            $data = $request->validated();
            $modifierGroup->update($this->groupData($data));
            $modifierGroup->products()->sync($data['product_ids'] ?? []);
            $modifierGroup->options()->delete();
            $this->replaceOptions($modifierGroup, $data['options']);

            return $modifierGroup->fresh()->load(['options', 'products:id']);
        });

        return response()->json([
            'success' => true,
            'message' => 'Add-on group updated successfully.',
            'data' => new ModifierGroupResource($group),
        ]);
    }

    public function destroy(Request $request, ModifierGroup $modifierGroup): JsonResponse
    {
        $business = $this->restaurantBusiness($request);
        abort_unless($modifierGroup->business_id === $business->id, 404);
        $modifierGroup->delete();

        return response()->json([
            'success' => true,
            'message' => 'Add-on group deleted successfully.',
        ]);
    }

    private function restaurantBusiness(Request $request)
    {
        $business = $request->user()?->business;
        abort_unless($business, 422, 'Please create a business first.');
        abort_unless($business->business_type === 'food_beverage', 403, 'Add-ons are available for restaurant businesses.');

        return $business;
    }

    private function groupData(array $data): array
    {
        $single = $data['selection_type'] === 'single';
        $required = (bool) $data['is_required'];

        return [
            'name' => $data['name'],
            'selection_type' => $data['selection_type'],
            'is_required' => $required,
            'min_select' => $single ? ($required ? 1 : 0) : ($data['min_select'] ?? ($required ? 1 : 0)),
            'max_select' => $single ? 1 : ($data['max_select'] ?? null),
            'is_active' => $data['is_active'],
        ];
    }

    private function replaceOptions(ModifierGroup $group, array $options): void
    {
        $group->options()->createMany(collect($options)->values()->map(
            fn (array $option, int $index) => [
                'name' => $option['name'],
                'price_adjustment' => $option['price_adjustment'],
                'is_active' => $option['is_active'],
                'sort_order' => $index,
            ]
        )->all());
    }
}
