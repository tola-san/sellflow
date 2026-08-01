<?php

namespace App\Http\Resources\Storefront;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PublicProductResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'uuid' => $this->uuid,
            'name' => $this->name,
            'slug' => $this->slug,
            'description' => $this->description,
            'price' => $this->price,
            'discount_price' => $this->discount_price,
            'stock' => $this->stock,
            'thumbnail' => $this->thumbnailUrl(),
            'is_featured' => $this->is_featured,
            'availability_status' => $this->availability_status,
            'is_available_now' => $this->isAvailableNow(),
            'category' => new PublicCategoryResource($this->whenLoaded('category')),
            'modifier_groups' => $this->whenLoaded('modifierGroups', fn () => $this->modifierGroups->map(fn ($group) => [
                'id' => $group->id,
                'name' => $group->name,
                'selection_type' => $group->selection_type,
                'is_required' => $group->is_required,
                'min_select' => $group->min_select,
                'max_select' => $group->max_select,
                'options' => $group->options->map(fn ($option) => [
                    'id' => $option->id,
                    'name' => $option->name,
                    'price_adjustment' => $option->price_adjustment,
                ])->values(),
            ])->values()),
            'variants' => $this->whenLoaded('variants', fn () => $this->variants
                ->where('is_active', true)
                ->map(fn ($variant) => [
                    'id' => $variant->id,
                    'name' => $variant->name,
                    'attributes' => $variant->attributes ?? [],
                    'sku' => $variant->sku,
                    'price' => $variant->price,
                    'discount_price' => $variant->discount_price,
                    'effective_price' => (string) (
                        $variant->discount_price
                        ?? $variant->price
                        ?? $this->discount_price
                        ?? $this->price
                    ),
                    'stock' => $variant->stock,
                ])->values()),
        ];
    }
}
