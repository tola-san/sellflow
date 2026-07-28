<?php

namespace App\Http\Controllers\Api\Billing;

use App\Http\Controllers\Controller;
use App\Services\Billing\BillingService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class BillingController extends Controller
{
    public function __construct(private readonly BillingService $billing) {}

    public function plans(): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => $this->billing->plans()
                ->map(fn ($plan): array => $this->billing->planData($plan))
                ->all(),
        ]);
    }

    public function overview(Request $request): JsonResponse
    {
        $business = $request->user()->business;
        if (! $business) {
            return response()->json([
                'success' => false,
                'message' => 'Create a business before managing a subscription.',
            ], 409);
        }

        return response()->json([
            'success' => true,
            'data' => $this->billing->overview($business),
        ]);
    }

    public function payments(Request $request): JsonResponse
    {
        $business = $request->user()->business;
        if (! $business) {
            return response()->json(['success' => true, 'data' => []]);
        }

        return response()->json([
            'success' => true,
            'data' => $this->billing->payments($business),
        ]);
    }
}
