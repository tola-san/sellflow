<?php

namespace App\Http\Middleware;

use App\Models\Business;
use App\Services\Billing\BillingService;
use Closure;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureSubscriptionAccess
{
    public function __construct(private readonly BillingService $billing) {}

    public function handle(Request $request, Closure $next): Response
    {
        $business = $request->user()?->business;

        if (! $business && $request->route('slug')) {
            $business = Business::query()->where('slug', $request->route('slug'))->first();
        }

        if (! $business) {
            return $next($request);
        }

        $subscription = $this->billing->current($business);
        if ($subscription->hasAccess()) {
            return $next($request);
        }

        return new JsonResponse([
            'success' => false,
            'code' => 'SUBSCRIPTION_REQUIRED',
            'message' => 'This business subscription is no longer active.',
            'billing_url' => '/dashboard/billing',
        ], 402);
    }
}
