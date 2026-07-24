<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ModifierGroupResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'selection_type' => $this->selection_type,
            'is_required' => $this->is_required,
            'min_select' => $this->min_select,
            'max_select' => $this->max_select,
            'is_active' => $this->is_active,
            'sort_order' => $this->sort_order,
            'product_ids' => $this->whenLoaded('products', fn () => $this->products->pluck('id')->values()),
            'options' => $this->whenLoaded('options', fn () => $this->options->map(fn ($option) => [
                'id' => $option->id,
                'name' => $option->name,
                'price_adjustment' => $option->price_adjustment,
                'is_active' => $option->is_active,
                'sort_order' => $option->sort_order,
            ])),
        ];
    }
}
