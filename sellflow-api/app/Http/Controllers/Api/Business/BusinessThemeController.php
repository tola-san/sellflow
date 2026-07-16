<?php

namespace App\Http\Controllers\Api\Business;

use App\Http\Controllers\Controller;
use App\Http\Requests\Business\UpdateThemeRequest;
use App\Http\Resources\BusinessResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class BusinessThemeController extends Controller
{
    public function show(Request $request): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => $request->user()->business?->resolvedTheme(),
        ]);
    }

    public function update(UpdateThemeRequest $request): JsonResponse
    {
        $business = $request->user()->business;
        $data = $request->validated();
        $preset = $data['preset'];
        unset($data['preset']);

        $business->update([
            'theme_preset' => $preset,
            'theme_settings' => $data,
            'primary_color' => $data['primary_color'],
            'secondary_color' => $data['secondary_color'],
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Storefront theme published successfully.',
            'data' => new BusinessResource($business->fresh()),
        ]);
    }
}
