<?php

namespace App\Http\Resources\Storefront;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PublicOrderResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'order_number' => $this->order_number,
            'customer_name' => $this->customer_name,
            'subtotal' => $this->subtotal,
            'total' => $this->total,
            'payment_method' => $this->payment_method,
            'payment_status' => $this->payment_status,
            'status' => $this->status,
            'telegram_receipt_sent' => $this->telegram_receipt_sent_at !== null,
            'items' => $this->items->map(fn ($item) => [
                'product_name' => $item->product_name,
                'product_slug' => $item->product_slug,
                'thumbnail' => $item->thumbnail,
                'modifiers' => $item->modifiers ?? [],
                'unit_price' => $item->unit_price,
                'quantity' => $item->quantity,
                'line_total' => $item->line_total,
            ]),
            'created_at' => $this->created_at,
        ];
    }
}
