<?php

use Illuminate\Support\Facades\Broadcast;

Broadcast::channel(
    'business.{businessId}',
    fn ($user, int $businessId): bool => (int) $user->business?->id === $businessId,
    ['guards' => ['sanctum']]
);
