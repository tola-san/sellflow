<?php

namespace App\Http\Controllers\Api\Dashboard;

use App\Http\Controllers\Controller;
use App\Services\Dashboard\AnalyticsService;
use App\Services\Billing\BillingService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class AnalyticsController extends Controller
{
    public function __invoke(
        Request $request,
        AnalyticsService $analytics,
        BillingService $billing,
    ): JsonResponse
    {
        $validated = $request->validate([
            'days' => ['nullable', 'integer', Rule::in([7, 30, 90, 365])],
        ]);
        $days = (int) ($validated['days'] ?? 30);
        $business = $request->user()->business;

        if (! $business) {
            return response()->json([
                'success' => true,
                'data' => null,
            ]);
        }

        $historyLimit = $billing->current($business)->plan->feature('analytics_history_days');
        if ($historyLimit !== null && $days > (int) $historyLimit) {
            return response()->json([
                'success' => false,
                'code' => 'SUBSCRIPTION_LIMIT_REACHED',
                'message' => "Your current plan includes {$historyLimit} days of analytics history.",
                'upgrade_required' => true,
                'billing_url' => '/dashboard/billing',
            ], 422);
        }

        return response()->json([
            'success' => true,
            'data' => $analytics->report($business, $days),
        ]);
    }
}
