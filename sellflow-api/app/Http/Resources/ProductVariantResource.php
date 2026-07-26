<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductVariantResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'product_id' => $this->product_id,
            'name' => $this->name,
            'attributes' => $this->attributes ?? [],
            'sku' => $this->sku,
            'price' => $this->price,
            'discount_price' => $this->discount_price,
            'effective_price' => $this->when(
                $this->relationLoaded('product'),
                fn () => $this->effectivePrice()
            ),
            'stock' => $this->stock,
            'low_stock_threshold' => $this->low_stock_threshold,
            'is_low_stock' => $this->stock <= $this->low_stock_threshold,
            'is_active' => $this->is_active,
            'sort_order' => $this->sort_order,
            'product' => $this->whenLoaded('product', fn () => [
                'id' => $this->product->id,
                'name' => $this->product->name,
                'slug' => $this->product->slug,
                'thumbnail' => $this->product->thumbnailUrl(),
            ]),
            'created_at' => $this->created_at,
        ];
    }
}
