<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class BusinessSubscription extends Model
{
    protected $fillable = [
        'business_id',
        'subscription_plan_id',
        'status',
        'billing_cycle',
        'trial_started_at',
        'trial_ends_at',
        'current_period_start',
        'current_period_end',
        'cancel_at_period_end',
        'cancelled_at',
        'provider',
        'provider_subscription_id',
    ];

    protected $casts = [
        'trial_started_at' => 'datetime',
        'trial_ends_at' => 'datetime',
        'current_period_start' => 'datetime',
        'current_period_end' => 'datetime',
        'cancel_at_period_end' => 'boolean',
        'cancelled_at' => 'datetime',
    ];

    public function business(): BelongsTo
    {
        return $this->belongsTo(Business::class);
    }

    public function plan(): BelongsTo
    {
        return $this->belongsTo(SubscriptionPlan::class, 'subscription_plan_id');
    }

    public function payments(): HasMany
    {
        return $this->hasMany(SubscriptionPayment::class);
    }

    public function effectiveStatus(): string
    {
        if ($this->status === 'trialing' && $this->trial_ends_at?->isPast()) {
            return 'trial_expired';
        }

        if ($this->status === 'active' && $this->current_period_end?->isPast()) {
            return 'expired';
        }

        return $this->status;
    }

    public function hasAccess(): bool
    {
        return in_array($this->effectiveStatus(), ['trialing', 'active'], true);
    }

    public function trialDaysRemaining(): int
    {
        if ($this->effectiveStatus() !== 'trialing' || ! $this->trial_ends_at) {
            return 0;
        }

        return max(0, (int) ceil(now()->diffInSeconds($this->trial_ends_at, false) / 86400));
    }
}
