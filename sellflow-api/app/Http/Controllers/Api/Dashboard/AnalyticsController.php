<?php

namespace App\Http\Controllers\Api\Dashboard;

use App\Http\Controllers\Controller;
use App\Services\Dashboard\AnalyticsService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class AnalyticsController extends Controller
{
    public function __invoke(Request $request, AnalyticsService $analytics): JsonResponse
    {
        $validated = $request->validate([
            'days' => ['nullable', 'integer', Rule::in([7, 30, 90])],
        ]);
        $days = (int) ($validated['days'] ?? 30);
        $business = $request->user()->business;

        if (! $business) {
            return response()->json([
                'success' => true,
                'data' => null,
            ]);
        }

        return response()->json([
            'success' => true,
            'data' => $analytics->report($business, $days),
        ]);
    }
}
