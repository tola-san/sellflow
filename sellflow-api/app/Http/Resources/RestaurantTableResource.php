<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class RestaurantTableResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $activeOrder = $this->relationLoaded('orders') ? $this->orders->first() : null;

        return [
            'id' => $this->id,
            'name' => $this->name,
            'area' => $this->area,
            'capacity' => $this->capacity,
            'status' => $this->status,
            'qr_token' => $this->qr_token,
            'is_active' => $this->is_active,
            'sort_order' => $this->sort_order,
            'active_order' => $activeOrder ? [
                'id' => $activeOrder->id,
                'order_number' => $activeOrder->order_number,
                'total' => $activeOrder->total,
                'status' => $activeOrder->status,
                'created_at' => $activeOrder->created_at,
            ] : null,
        ];
    }
}
