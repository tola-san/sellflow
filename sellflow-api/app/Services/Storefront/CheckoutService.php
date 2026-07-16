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

            $requested = collect($data['items'])->keyBy('product_slug');
            $products = Product::query()
                ->where('business_id', $business->id)
                ->whereIn('slug', $requested->keys())
                ->where('is_active', true)
                ->whereHas('category', fn ($query) => $query->where('is_active', true))
                ->lockForUpdate()
                ->get()
                ->keyBy('slug');

            if ($products->count() !== $requested->count()) {
                throw ValidationException::withMessages([
                    'items' => ['One or more products are unavailable in this store.'],
                ]);
            }

            $items = [];
            $subtotalCents = 0;

            foreach ($requested as $slug => $requestedItem) {
                $product = $products->get($slug);
                $quantity = (int) $requestedItem['quantity'];

                if ($quantity > $product->stock) {
                    throw ValidationException::withMessages([
                        'items' => ["Only {$product->stock} unit(s) of {$product->name} are available."],
                    ]);
                }

                $price = $product->discount_price ?? $product->price;
                $unitCents = (int) round(((float) $price) * 100);
                $lineCents = $unitCents * $quantity;
                $subtotalCents += $lineCents;
                $items[] = [
                    'product_id' => $product->id,
                    'product_name' => $product->name,
                    'product_slug' => $product->slug,
                    'thumbnail' => $product->thumbnail,
                    'unit_price' => $this->money($unitCents),
                    'quantity' => $quantity,
                    'line_total' => $this->money($lineCents),
                ];
            }

            $order = $business->orders()->create([
                'order_number' => $this->orderNumber(),
                'customer_name' => $data['customer_name'],
                'customer_phone' => $data['customer_phone'],
                'customer_email' => $data['customer_email'] ?? null,
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
