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

            'uuid' => $this->uuid,

            'business_id' => $this->business_id,

            'category_id' => $this->category_id,

            'name' => $this->name,

            'slug' => $this->slug,

            'sku' => $this->sku,

            'description' => $this->description,

            'price' => $this->price,

            'discount_price' => $this->discount_price,

            'stock' => $this->stock,

            'low_stock_threshold' => $this->low_stock_threshold,

            'thumbnail' => $this->thumbnailUrl(),

            'is_featured' => $this->is_featured,

            'is_active' => $this->is_active,

            'availability_status' => $this->availability_status,

            'is_available_now' => $this->when(
                $this->relationLoaded('availabilitySchedules'),
                fn () => $this->isAvailableNow()
            ),

            'availability_schedules' => $this->whenLoaded('availabilitySchedules'),

            'category' => $this->whenLoaded('category'),

            'modifier_groups' => ModifierGroupResource::collection($this->whenLoaded('modifierGroups')),

            'variants' => ProductVariantResource::collection($this->whenLoaded('variants')),

            'created_at' => $this->created_at,
        ];
    }
}
