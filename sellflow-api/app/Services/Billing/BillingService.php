<?php

namespace App\Services\Billing;

use App\Models\Business;
use App\Models\BusinessSubscription;
use App\Models\SubscriptionPayment;
use App\Models\SubscriptionPlan;
use Illuminate\Database\Eloquent\Collection;
use RuntimeException;

class BillingService
{
    public function plans(): Collection
    {
        return SubscriptionPlan::query()
            ->where('is_active', true)
            ->orderBy('sort_order')
            ->get();
    }

    public function startTrial(Business $business): BusinessSubscription
    {
        $existing = $business->subscription()->first();
        if ($existing) {
            return $existing->load('plan');
        }

        $plan = SubscriptionPlan::query()
            ->where('slug', config('billing.trial_plan', 'growth'))
            ->where('is_active', true)
            ->first();

        if (! $plan) {
            throw new RuntimeException('The configured trial plan is unavailable.');
        }

        $startedAt = now();

        return $business->subscription()->create([
            'subscription_plan_id' => $plan->id,
            'status' => 'trialing',
            'trial_started_at' => $startedAt,
            'trial_ends_at' => $startedAt->copy()->addDays(config('billing.trial_days', 30)),
        ])->load('plan');
    }

    public function current(Business $business): BusinessSubscription
    {
        return $business->subscription()->with('plan')->first()
            ?? $this->startTrial($business);
    }

    public function overview(Business $business): array
    {
        $subscription = $this->current($business);

        return [
            'subscription' => $this->subscriptionData($subscription),
            'usage' => $this->usage($business, $subscription->plan),
        ];
    }

    public function usage(Business $business, ?SubscriptionPlan $plan = null): array
    {
        $plan ??= $this->current($business)->plan;
        $values = [
            'businesses' => 1,
            'staff' => 1,
            'products' => $business->products()->count(),
        ];

        return collect($values)->mapWithKeys(function (int $used, string $key) use ($plan): array {
            $limit = $plan->limit($key);

            return [$key => [
                'used' => $used,
                'limit' => $limit,
                'remaining' => $limit === null ? null : max(0, $limit - $used),
                'percent' => $limit === null ? null : min(100, round(($used / max($limit, 1)) * 100)),
                'unlimited' => $limit === null,
            ]];
        })->all();
    }

    public function productLimitReached(Business $business): bool
    {
        $plan = $this->current($business)->plan;
        $limit = $plan->limit('products');

        return $limit !== null && $business->products()->count() >= $limit;
    }

    public function payments(Business $business): array
    {
        return SubscriptionPayment::query()
            ->where('business_id', $business->id)
            ->with('plan:id,name,slug')
            ->latest()
            ->limit(50)
            ->get()
            ->map(fn (SubscriptionPayment $payment): array => [
                'id' => $payment->id,
                'invoice_number' => $payment->invoice_number,
                'plan' => $payment->plan?->only(['name', 'slug']),
                'amount' => $payment->amount,
                'currency' => $payment->currency,
                'billing_cycle' => $payment->billing_cycle,
                'status' => $payment->status,
                'provider' => $payment->provider,
                'period_start' => $payment->period_start?->toIso8601String(),
                'period_end' => $payment->period_end?->toIso8601String(),
                'paid_at' => $payment->paid_at?->toIso8601String(),
                'created_at' => $payment->created_at?->toIso8601String(),
            ])
            ->all();
    }

    public function planData(SubscriptionPlan $plan): array
    {
        return [
            'id' => $plan->id,
            'name' => $plan->name,
            'slug' => $plan->slug,
            'description' => $plan->description,
            'monthly_price' => $plan->monthly_price,
            'yearly_price' => $plan->yearly_price,
            'currency' => $plan->currency,
            'limits' => $plan->limits,
            'features' => $plan->features,
            'is_popular' => $plan->slug === 'growth',
        ];
    }

    private function subscriptionData(BusinessSubscription $subscription): array
    {
        return [
            'id' => $subscription->id,
            'status' => $subscription->effectiveStatus(),
            'has_access' => $subscription->hasAccess(),
            'billing_cycle' => $subscription->billing_cycle,
            'trial_started_at' => $subscription->trial_started_at?->toIso8601String(),
            'trial_ends_at' => $subscription->trial_ends_at?->toIso8601String(),
            'trial_days_remaining' => $subscription->trialDaysRemaining(),
            'current_period_start' => $subscription->current_period_start?->toIso8601String(),
            'current_period_end' => $subscription->current_period_end?->toIso8601String(),
            'cancel_at_period_end' => $subscription->cancel_at_period_end,
            'cancelled_at' => $subscription->cancelled_at?->toIso8601String(),
            'plan' => $this->planData($subscription->plan),
        ];
    }
}
