<?php

namespace App\Services\Order;

use App\Models\Business;
use App\Models\Order;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Validation\ValidationException;

class OrderService
{
    public function __construct(private readonly OrderTelegramNotificationService $notifications) {}

    private const STATUS_TRANSITIONS = [
        'pending' => ['confirmed', 'cancelled'],
        'confirmed' => ['preparing', 'cancelled'],
        'preparing' => ['completed', 'cancelled'],
        'completed' => [],
        'cancelled' => [],
    ];

    private const PAYMENT_TRANSITIONS = [
        'pending' => ['paid', 'failed'],
        'failed' => ['pending', 'paid'],
        'paid' => ['refunded'],
        'refunded' => [],
    ];

    public function paginate(Business $business, array $filters): LengthAwarePaginator
    {
        return $this->filteredQuery($business, $filters)
            ->with('restaurantTable')
            ->withCount('items')
            ->latest()
            ->paginate(min((int) ($filters['per_page'] ?? 15), 50));
    }

    public function summary(Business $business): array
    {
        $row = $business->orders()
            ->selectRaw('COUNT(*) as total')
            ->selectRaw("SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending")
            ->selectRaw("SUM(CASE WHEN status = 'confirmed' THEN 1 ELSE 0 END) as confirmed")
            ->selectRaw("SUM(CASE WHEN status = 'preparing' THEN 1 ELSE 0 END) as preparing")
            ->selectRaw("SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed")
            ->selectRaw("SUM(CASE WHEN payment_status = 'paid' THEN total ELSE 0 END) as paid_revenue")
            ->first();

        return [
            'total' => (int) ($row?->total ?? 0),
            'pending' => (int) ($row?->pending ?? 0),
            'confirmed' => (int) ($row?->confirmed ?? 0),
            'preparing' => (int) ($row?->preparing ?? 0),
            'completed' => (int) ($row?->completed ?? 0),
            'paid_revenue' => number_format((float) ($row?->paid_revenue ?? 0), 2, '.', ''),
        ];
    }

    public function show(Order $order): Order
    {
        return $order->load(['items', 'restaurantTable']);
    }

    public function updateStatus(Order $order, string $nextStatus): Order
    {
        $this->validateTransition('status', $order->status, $nextStatus, self::STATUS_TRANSITIONS);
        $changed = $order->status !== $nextStatus;
        $order->update(['status' => $nextStatus]);
        if ($order->restaurant_table_id && in_array($nextStatus, ['completed', 'cancelled'], true)) {
            $hasOtherActiveOrders = $order->restaurantTable->orders()
                ->whereKeyNot($order->id)
                ->whereNotIn('status', ['completed', 'cancelled'])
                ->exists();
            if (! $hasOtherActiveOrders) {
                $order->restaurantTable->update(['status' => 'available']);
            }
        }
        $updated = $order->fresh()->load(['items', 'restaurantTable']);

        if ($changed) {
            $this->notifications->orderStatusChanged($updated);
        }

        return $updated;
    }

    public function updatePaymentStatus(Order $order, string $nextStatus): Order
    {
        $this->validateTransition('payment_status', $order->payment_status, $nextStatus, self::PAYMENT_TRANSITIONS);
        $changed = $order->payment_status !== $nextStatus;
        $order->update(['payment_status' => $nextStatus]);
        $updated = $order->fresh()->load(['items', 'restaurantTable']);

        if ($changed) {
            $this->notifications->paymentStatusChanged($updated);
        }

        return $updated;
    }

    private function filteredQuery(Business $business, array $filters): Builder
    {
        return Order::query()
            ->where('business_id', $business->id)
            ->when($filters['status'] ?? null, fn (Builder $query, string $status) => $query->where('status', $status))
            ->when($filters['payment_status'] ?? null, fn (Builder $query, string $status) => $query->where('payment_status', $status))
            ->when($filters['search'] ?? null, function (Builder $query, string $search) {
                $query->where(function (Builder $nested) use ($search) {
                    $term = '%'.str_replace(['%', '_'], ['\\%', '\\_'], $search).'%';
                    $nested->where('order_number', 'like', $term)
                        ->orWhere('customer_name', 'like', $term)
                        ->orWhere('customer_phone', 'like', $term);
                });
            });
    }

    private function validateTransition(string $field, string $current, string $next, array $transitions): void
    {
        if ($current === $next) {
            return;
        }

        if (! in_array($next, $transitions[$current] ?? [], true)) {
            throw ValidationException::withMessages([
                $field => ["Cannot change {$field} from {$current} to {$next}."],
            ]);
        }
    }
}
