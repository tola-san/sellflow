<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BusinessResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,

            'name' => $this->name,

            'slug' => $this->slug,

            'description' => $this->description,

            'email' => $this->email,

            'phone' => $this->phone,

            'website' => $this->website,

            'logo' => $this->logo,

            'banner' => $this->banner,

            'address' => $this->address,

            'city' => $this->city,

            'country' => $this->country,

            'primary_color' => $this->primary_color,

            'secondary_color' => $this->secondary_color,

            'is_active' => $this->is_active,

            'created_at' => $this->created_at,
        ];
    }
}