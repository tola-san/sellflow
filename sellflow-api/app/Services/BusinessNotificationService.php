<?php

namespace App\Services;

use App\Events\BusinessNotificationCreated;
use App\Models\BusinessNotification;
use App\Models\Order;
use App\Models\Product;
use App\Models\ProductVariant;

class BusinessNotificationService
{
    public function orderCreated(Order $order): void
    {
        $order->loadMissing(['items.product', 'items.productVariant']);

        $this->upsert(
            $order->business_id,
            "order:{$order->id}:created",
            'order',
            "New order {$order->order_number}",
            "{$order->customer_name} placed an order for $".number_format((float) $order->total, 2).'.',
            '/dashboard/orders',
            ['order_id' => $order->id, 'order_number' => $order->order_number]
        );

        foreach ($order->items as $item) {
            $target = $item->productVariant ?? $item->product;

            if (! $target || $target->stock > $target->low_stock_threshold) {
                continue;
            }

            $this->lowStock($item->product, $item->productVariant);
        }
    }

    public function lowStock(?Product $product, ?ProductVariant $variant = null): void
    {
        if (! $product) {
            return;
        }

        $target = $variant ?? $product;
        $label = $variant ? "{$product->name} · {$variant->name}" : $product->name;
        $severity = $target->stock <= 0 ? 'out of stock' : 'low on stock';

        $this->upsert(
            $product->business_id,
            'inventory:'.($variant ? "variant:{$variant->id}" : "product:{$product->id}"),
            'inventory',
            $target->stock <= 0 ? 'Item out of stock' : 'Low stock alert',
            "{$label} is {$severity} ({$target->stock} remaining).",
            '/dashboard/inventory',
            [
                'product_id' => $product->id,
                'product_variant_id' => $variant?->id,
                'stock' => $target->stock,
            ]
        );
    }

    public function stockChanged(Product $product, ?ProductVariant $variant = null): void
    {
        $target = $variant ?? $product;
        $key = 'inventory:'.($variant ? "variant:{$variant->id}" : "product:{$product->id}");

        if ($target->stock <= $target->low_stock_threshold) {
            $this->lowStock($product, $variant);
            return;
        }

        BusinessNotification::query()
            ->where('business_id', $product->business_id)
            ->where('key', $key)
            ->whereNull('dismissed_at')
            ->update([
                'read_at' => now(),
                'dismissed_at' => now(),
            ]);
    }

    private function upsert(
        int $businessId,
        string $key,
        string $type,
        string $title,
        string $message,
        ?string $actionUrl,
        array $data
    ): BusinessNotification {
        $notification = BusinessNotification::query()->updateOrCreate(
            ['business_id' => $businessId, 'key' => $key],
            [
                'type' => $type,
                'title' => $title,
                'message' => $message,
                'action_url' => $actionUrl,
                'data' => $data,
                'read_at' => null,
                'dismissed_at' => null,
            ]
        );

        BusinessNotificationCreated::dispatch($notification);

        return $notification;
    }
}
