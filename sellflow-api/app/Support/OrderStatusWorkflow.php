<?php

namespace App\Support;

use App\Models\Order;

final class OrderStatusWorkflow
{
    public const STATUSES = ['pending', 'confirmed', 'preparing', 'ready', 'completed', 'cancelled'];

    public static function next(Order $order): array
    {
        return match ($order->status) {
            'pending' => ['confirmed', 'cancelled'],
            'confirmed' => ['preparing', 'cancelled'],
            'preparing' => self::supportsReady($order)
                ? ['ready', 'cancelled']
                : ['completed', 'cancelled'],
            'ready' => ['completed', 'cancelled'],
            default => [],
        };
    }

    public static function supportsReady(Order $order): bool
    {
        $order->loadMissing('business');

        return $order->business?->business_type === 'food_beverage';
    }

    public static function actionLabel(string $status): string
    {
        return match ($status) {
            'confirmed' => 'Confirm',
            'preparing' => 'Start preparing',
            'ready' => 'Mark ready',
            'completed' => 'Complete',
            'cancelled' => 'Cancel',
            default => ucfirst($status),
        };
    }
}
