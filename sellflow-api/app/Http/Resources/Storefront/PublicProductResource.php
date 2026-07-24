<?php

namespace App\Http\Resources\Storefront;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PublicProductResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'name' => $this->name,
            'slug' => $this->slug,
            'description' => $this->description,
            'price' => $this->price,
            'discount_price' => $this->discount_price,
            'stock' => $this->stock,
            'thumbnail' => $this->thumbnailUrl(),
            'is_featured' => $this->is_featured,
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
        ];
    }
}
