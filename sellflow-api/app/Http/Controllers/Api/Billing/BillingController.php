<?php

namespace App\Http\Controllers\Api\Billing;

use App\Http\Controllers\Controller;
use App\Models\SubscriptionPayment;
use App\Services\Billing\BillingService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

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

    public function createPayment(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'plan_slug' => ['required', 'string', Rule::exists('subscription_plans', 'slug')->where('is_active', true)],
            'billing_cycle' => ['required', Rule::in(['monthly', 'yearly'])],
        ]);
        $business = $request->user()->business;
        if (! $business) {
            return response()->json(['success' => false, 'message' => 'Create a business before subscribing.'], 409);
        }

        $payment = $this->billing->createPayment($business, $validated['plan_slug'], $validated['billing_cycle']);

        return response()->json([
            'success' => true,
            'data' => $this->billing->paymentData($payment),
        ], 201);
    }

    public function submitProof(Request $request, int $payment): JsonResponse
    {
        $validated = $request->validate([
            'receipt' => ['required', 'file', 'mimes:jpg,jpeg,png,pdf', 'max:5120'],
            'transaction_reference' => ['nullable', 'string', 'max:100'],
        ]);
        $business = $request->user()->business;
        if (! $business) {
            return response()->json(['success' => false, 'message' => 'Create a business before subscribing.'], 409);
        }

        $submitted = $this->billing->submitPaymentProof(
            $business,
            SubscriptionPayment::query()->findOrFail($payment),
            $validated['receipt'],
            $validated['transaction_reference'] ?? null,
        );

        return response()->json([
            'success' => true,
            'data' => $this->billing->paymentData($submitted),
        ]);
    }
}
