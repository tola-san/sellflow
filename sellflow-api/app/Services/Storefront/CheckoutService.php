<?php

namespace App\Services\Storefront;

use App\Models\Business;
use App\Models\Order;
use App\Models\Product;
use App\Models\ProductVariant;
use App\Models\RestaurantTable;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class CheckoutService
{
    public function create(string $businessSlug, array $data): Order
    {
        return DB::transaction(function () use ($businessSlug, $data) {
            $business = Business::query()
                ->where('slug', $businessSlug)
                ->where('is_active', true)
                ->firstOrFail();

            $restaurantTable = null;
            if (! empty($data['table_token'])) {
                $restaurantTable = RestaurantTable::query()
                    ->where('business_id', $business->id)
                    ->where('qr_token', $data['table_token'])
                    ->where('is_active', true)
                    ->where('status', '!=', 'inactive')
                    ->lockForUpdate()
                    ->first();

                if (! $restaurantTable) {
                    throw ValidationException::withMessages([
                        'table_token' => ['This table ordering link is invalid or inactive.'],
                    ]);
                }
            }

            $requested = collect($data['items']);
            $requestedSlugs = $requested->pluck('product_slug')->unique()->values();
            $products = Product::query()
                ->where('business_id', $business->id)
                ->whereIn('slug', $requestedSlugs)
                ->where('is_active', true)
                ->whereHas('category', fn ($query) => $query->where('is_active', true))
                ->with([
                    'modifierGroups' => fn ($groups) => $groups
                        ->where('is_active', true)
                        ->with(['options' => fn ($options) => $options->where('is_active', true)]),
                    'availabilitySchedules',
                    'variants',
                ])
                ->lockForUpdate()
                ->get()
                ->keyBy('slug');

            if ($products->count() !== $requestedSlugs->count()) {
                throw ValidationException::withMessages([
                    'items' => ['One or more products are unavailable in this store.'],
                ]);
            }

            $requestedVariantIds = $requested->pluck('variant_id')->filter()->map(fn ($id) => (int) $id)->unique();
            $lockedVariants = ProductVariant::query()
                ->where('business_id', $business->id)
                ->whereIn('id', $requestedVariantIds)
                ->lockForUpdate()
                ->get()
                ->keyBy('id');

            foreach ($products as $product) {
                if (! $product->isAvailableNow()) {
                    throw ValidationException::withMessages([
                        'items' => ["{$product->name} is not currently available."],
                    ]);
                }
            }

            $resolved = $requested->map(function (array $line) use ($products, $lockedVariants) {
                $product = $products->get($line['product_slug']);
                $variantId = isset($line['variant_id']) ? (int) $line['variant_id'] : null;
                $variant = $variantId
                    ? $lockedVariants->get($variantId)
                    : null;

                if (($variantId && ! $variant)
                    || ($variant && $variant->product_id !== $product->id)
                    || ($product->variants->isNotEmpty() && ! $variant)) {
                    throw ValidationException::withMessages([
                        'items' => ["Choose an available variant for {$product->name}."],
                    ]);
                }

                if ($variant && ! $variant->is_active) {
                    throw ValidationException::withMessages([
                        'items' => ["The selected {$product->name} variant is unavailable."],
                    ]);
                }

                return [
                    ...$line,
                    '_product' => $product,
                    '_variant' => $variant,
                    '_stock_key' => $product->id.':'.($variant?->id ?? 'base'),
                ];
            });

            foreach ($resolved->groupBy('_stock_key') as $lines) {
                $product = $lines->first()['_product'];
                $variant = $lines->first()['_variant'];
                $available = $variant?->stock ?? $product->stock;
                $totalQuantity = $lines->sum(fn ($line) => (int) $line['quantity']);

                if ($totalQuantity > $available) {
                    $label = $variant ? "{$product->name} ({$variant->name})" : $product->name;
                    throw ValidationException::withMessages([
                        'items' => ["Only {$available} unit(s) of {$label} are available."],
                    ]);
                }
            }

            $items = [];
            $subtotalCents = 0;

            foreach ($resolved as $requestedItem) {
                $product = $requestedItem['_product'];
                $variant = $requestedItem['_variant'];
                $quantity = (int) $requestedItem['quantity'];
                $modifiers = $this->resolveModifiers($product, $requestedItem['modifier_ids'] ?? []);
                $price = (float) ($variant?->effectivePrice() ?? $product->discount_price ?? $product->price);
                $modifierTotal = collect($modifiers)->sum(fn ($modifier) => (float) $modifier['price_adjustment']);
                $unitCents = (int) round(($price + $modifierTotal) * 100);
                $lineCents = $unitCents * $quantity;
                $subtotalCents += $lineCents;
                $items[] = [
                    'product_id' => $product->id,
                    'product_variant_id' => $variant?->id,
                    'product_name' => $product->name,
                    'product_slug' => $product->slug,
                    'thumbnail' => $product->thumbnailUrl(),
                    'variant' => $variant ? [
                        'id' => $variant->id,
                        'name' => $variant->name,
                        'attributes' => $variant->attributes ?? [],
                        'sku' => $variant->sku,
                    ] : null,
                    'modifiers' => $modifiers,
                    'unit_price' => $this->money($unitCents),
                    'quantity' => $quantity,
                    'line_total' => $this->money($lineCents),
                ];
            }

            $order = $business->orders()->create([
                'restaurant_table_id' => $restaurantTable?->id,
                'order_type' => $restaurantTable ? 'dine_in' : 'delivery',
                'order_number' => $this->orderNumber(),
                'customer_name' => $data['customer_name'],
                'customer_phone' => $data['customer_phone'],
                'telegram_user_id' => $data['telegram_user_id'] ?? null,
                'telegram_chat_id' => $data['telegram_chat_id'] ?? null,
                'telegram_username' => $data['telegram_username'] ?? null,
                'telegram_notifications_enabled' => $data['telegram_notifications_enabled'] ?? false,
                'delivery_address' => $restaurantTable
                    ? 'Dine-in · '.$restaurantTable->name
                    : $data['delivery_address'],
                'city' => $data['city'] ?? null,
                'notes' => $data['notes'] ?? null,
                'subtotal' => $this->money($subtotalCents),
                'total' => $this->money($subtotalCents),
                'payment_method' => $data['payment_method'],
                'payment_status' => 'pending',
                'status' => 'pending',
            ]);

            $order->items()->createMany($items);

            foreach ($resolved->groupBy('_stock_key') as $lines) {
                /** @var Product $product */
                $product = $lines->first()['_product'];
                /** @var ProductVariant|null $variant */
                $variant = $lines->first()['_variant'];
                $quantity = $lines->sum(fn ($line) => (int) $line['quantity']);
                $target = $variant ?? $product;
                $before = $target->stock;
                $target->decrement('stock', $quantity);

                $business->inventoryMovements()->create([
                    'product_id' => $product->id,
                    'product_variant_id' => $variant?->id,
                    'type' => 'sale',
                    'quantity_delta' => -$quantity,
                    'quantity_before' => $before,
                    'quantity_after' => $before - $quantity,
                    'reason' => 'Customer order',
                    'reference' => $order->order_number,
                ]);

                if ($variant) {
                    $product->syncVariantStock();
                }
            }

            if ($restaurantTable) {
                $restaurantTable->update(['status' => 'occupied']);
            }

            return $order->load(['items', 'restaurantTable']);
        });
    }

    private function resolveModifiers(Product $product, array $selectedIds): array
    {
        $selectedIds = collect($selectedIds)->map(fn ($id) => (int) $id)->unique()->values();
        $availableOptions = $product->modifierGroups
            ->flatMap(fn ($group) => $group->options)
            ->keyBy('id');

        if ($selectedIds->contains(fn ($id) => ! $availableOptions->has($id))) {
            throw ValidationException::withMessages([
                'items' => ["One or more selected add-ons are unavailable for {$product->name}."],
            ]);
        }

        $snapshots = [];

        foreach ($product->modifierGroups as $group) {
            $selected = $group->options->whereIn('id', $selectedIds);
            $count = $selected->count();
            $minimum = (int) $group->min_select;
            $maximum = $group->selection_type === 'single' ? 1 : $group->max_select;

            if ($group->is_required && $count < max(1, $minimum)) {
                throw ValidationException::withMessages([
                    'items' => ['Choose at least '.max(1, $minimum)." option(s) from {$group->name} for {$product->name}."],
                ]);
            }

            if ($count > 0 && $count < $minimum) {
                throw ValidationException::withMessages([
                    'items' => ["Choose at least {$minimum} option(s) from {$group->name} for {$product->name}."],
                ]);
            }

            if ($maximum !== null && $count > (int) $maximum) {
                throw ValidationException::withMessages([
                    'items' => ["Choose no more than {$maximum} option(s) from {$group->name} for {$product->name}."],
                ]);
            }

            foreach ($selected as $option) {
                $snapshots[] = [
                    'group_id' => $group->id,
                    'group_name' => $group->name,
                    'option_id' => $option->id,
                    'option_name' => $option->name,
                    'price_adjustment' => $option->price_adjustment,
                ];
            }
        }

        return $snapshots;
    }

    private function money(int $cents): string
    {
        return number_format($cents / 100, 2, '.', '');
    }

    private function orderNumber(): string
    {
        do {
            $number = 'SF-'.now()->format('ymd').'-'.Str::upper(Str::random(7));
        } while (Order::query()->where('order_number', $number)->exists());

        return $number;
    }
}
