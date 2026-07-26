<?php

namespace App\Services\Dashboard;

use App\Models\Business;
use App\Models\Order;
use App\Models\OrderItem;
use Carbon\CarbonImmutable;
use Illuminate\Support\Collection;

class AnalyticsService
{
    public function report(Business $business, int $days): array
    {
        $today = CarbonImmutable::today();
        $currentStart = $today->subDays($days - 1);
        $currentEnd = $today->endOfDay();
        $previousStart = $currentStart->subDays($days);
        $previousEnd = $currentStart->subSecond();

        $currentOrders = $this->ordersForPeriod($business, $currentStart, $currentEnd);
        $previousOrders = $this->ordersForPeriod($business, $previousStart, $previousEnd);
        $currentSummary = $this->summary($currentOrders);
        $previousSummary = $this->summary($previousOrders);

        return [
            'period' => [
                'days' => $days,
                'from' => $currentStart->toDateString(),
                'to' => $today->toDateString(),
            ],
            'summary' => [
                ...$currentSummary,
                'changes' => [
                    'revenue' => $this->percentageChange($currentSummary['revenue'], $previousSummary['revenue']),
                    'orders' => $this->percentageChange($currentSummary['orders'], $previousSummary['orders']),
                    'average_order_value' => $this->percentageChange(
                        $currentSummary['average_order_value'],
                        $previousSummary['average_order_value']
                    ),
                ],
            ],
            'trend' => $this->dailyTrend($currentOrders, $currentStart, $days),
            'statuses' => $this->statusBreakdown($currentOrders),
            'payment_statuses' => $this->paymentBreakdown($currentOrders),
            'order_types' => $this->orderTypeBreakdown($currentOrders),
            'top_products' => $this->topProducts($business, $currentStart, $currentEnd),
        ];
    }

    private function ordersForPeriod(Business $business, CarbonImmutable $start, CarbonImmutable $end): Collection
    {
        return Order::query()
            ->where('business_id', $business->id)
            ->whereBetween('created_at', [$start, $end])
            ->get(['id', 'total', 'payment_status', 'status', 'order_type', 'created_at']);
    }

    private function summary(Collection $orders): array
    {
        $paidOrders = $orders->where('payment_status', 'paid');
        $revenue = (float) $paidOrders->sum(fn (Order $order): float => (float) $order->total);
        $completed = $orders->where('status', 'completed')->count();

        return [
            'revenue' => number_format($revenue, 2, '.', ''),
            'orders' => $orders->count(),
            'average_order_value' => number_format(
                $paidOrders->isNotEmpty() ? $revenue / $paidOrders->count() : 0,
                2,
                '.',
                ''
            ),
            'completion_rate' => $orders->isNotEmpty()
                ? round(($completed / $orders->count()) * 100, 1)
                : 0,
        ];
    }

    private function dailyTrend(Collection $orders, CarbonImmutable $start, int $days): array
    {
        $byDate = $orders->groupBy(fn (Order $order): string => $order->created_at->toDateString());

        return collect(range(0, $days - 1))->map(function (int $offset) use ($start, $byDate): array {
            $date = $start->addDays($offset)->toDateString();
            $dayOrders = $byDate->get($date, collect());
            $revenue = $dayOrders
                ->where('payment_status', 'paid')
                ->sum(fn (Order $order): float => (float) $order->total);

            return [
                'date' => $date,
                'orders' => $dayOrders->count(),
                'revenue' => number_format((float) $revenue, 2, '.', ''),
            ];
        })->all();
    }

    private function statusBreakdown(Collection $orders): array
    {
        return collect(['pending', 'confirmed', 'preparing', 'ready', 'completed', 'cancelled'])
            ->map(fn (string $status): array => [
                'status' => $status,
                'count' => $orders->where('status', $status)->count(),
            ])
            ->all();
    }

    private function paymentBreakdown(Collection $orders): array
    {
        return collect(['pending', 'paid', 'failed', 'refunded'])
            ->map(fn (string $status): array => [
                'status' => $status,
                'count' => $orders->where('payment_status', $status)->count(),
            ])
            ->all();
    }

    private function orderTypeBreakdown(Collection $orders): array
    {
        return collect(['delivery', 'dine_in'])
            ->map(fn (string $type): array => [
                'type' => $type,
                'count' => $orders->where('order_type', $type)->count(),
            ])
            ->all();
    }

    private function topProducts(Business $business, CarbonImmutable $start, CarbonImmutable $end): array
    {
        return OrderItem::query()
            ->whereHas('order', fn ($query) => $query
                ->where('business_id', $business->id)
                ->whereBetween('created_at', [$start, $end])
                ->where('status', '!=', 'cancelled'))
            ->selectRaw('product_name, SUM(quantity) as quantity_sold, SUM(line_total) as revenue')
            ->groupBy('product_name')
            ->orderByDesc('quantity_sold')
            ->limit(5)
            ->get()
            ->map(fn (OrderItem $item): array => [
                'name' => $item->product_name,
                'quantity' => (int) $item->quantity_sold,
                'revenue' => number_format((float) $item->revenue, 2, '.', ''),
            ])
            ->all();
    }

    private function percentageChange(float|int|string $current, float|int|string $previous): ?float
    {
        $current = (float) $current;
        $previous = (float) $previous;

        if ($previous === 0.0) {
            return $current === 0.0 ? 0 : null;
        }

        return round((($current - $previous) / $previous) * 100, 1);
    }
}
