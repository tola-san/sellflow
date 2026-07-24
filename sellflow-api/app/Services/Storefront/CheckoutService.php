<?php

namespace App\Services\Storefront;

use App\Models\Business;
use App\Models\Order;
use App\Models\Product;
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
                ])
                ->lockForUpdate()
                ->get()
                ->keyBy('slug');

            if ($products->count() !== $requestedSlugs->count()) {
                throw ValidationException::withMessages([
                    'items' => ['One or more products are unavailable in this store.'],
                ]);
            }

            foreach ($requested->groupBy('product_slug') as $slug => $lines) {
                $product = $products->get($slug);
                $totalQuantity = $lines->sum(fn ($line) => (int) $line['quantity']);

                if ($totalQuantity > $product->stock) {
                    throw ValidationException::withMessages([
                        'items' => ["Only {$product->stock} unit(s) of {$product->name} are available."],
                    ]);
                }
            }

            $items = [];
            $subtotalCents = 0;

            foreach ($requested as $requestedItem) {
                $product = $products->get($requestedItem['product_slug']);
                $quantity = (int) $requestedItem['quantity'];
                $modifiers = $this->resolveModifiers($product, $requestedItem['modifier_ids'] ?? []);
                $price = (float) ($product->discount_price ?? $product->price);
                $modifierTotal = collect($modifiers)->sum(fn ($modifier) => (float) $modifier['price_adjustment']);
                $unitCents = (int) round(($price + $modifierTotal) * 100);
                $lineCents = $unitCents * $quantity;
                $subtotalCents += $lineCents;
                $items[] = [
                    'product_id' => $product->id,
                    'product_name' => $product->name,
                    'product_slug' => $product->slug,
                    'thumbnail' => $product->thumbnailUrl(),
                    'modifiers' => $modifiers,
                    'unit_price' => $this->money($unitCents),
                    'quantity' => $quantity,
                    'line_total' => $this->money($lineCents),
                ];
            }

            $order = $business->orders()->create([
                'order_number' => $this->orderNumber(),
                'customer_name' => $data['customer_name'],
                'customer_phone' => $data['customer_phone'],
                'telegram_user_id' => $data['telegram_user_id'] ?? null,
                'telegram_chat_id' => $data['telegram_chat_id'] ?? null,
                'telegram_username' => $data['telegram_username'] ?? null,
                'telegram_notifications_enabled' => $data['telegram_notifications_enabled'] ?? false,
                'delivery_address' => $data['delivery_address'],
                'city' => $data['city'] ?? null,
                'notes' => $data['notes'] ?? null,
                'subtotal' => $this->money($subtotalCents),
                'total' => $this->money($subtotalCents),
                'payment_method' => $data['payment_method'],
                'payment_status' => 'pending',
                'status' => 'pending',
            ]);

            $order->items()->createMany($items);

            return $order->load('items');
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
