<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
         return [
            'id' => $this->id,

            'business_id' => $this->business_id,

            'category_id' => $this->category_id,

            'name' => $this->name,

            'slug' => $this->slug,

            'sku' => $this->sku,

            'description' => $this->description,

            'price' => $this->price,

            'discount_price' => $this->discount_price,

            'stock' => $this->stock,

            'thumbnail' => $this->thumbnailUrl(),

            'is_featured' => $this->is_featured,

            'is_active' => $this->is_active,

            'category' => $this->whenLoaded('category'),

            'created_at' => $this->created_at,
        ];
    }
}
