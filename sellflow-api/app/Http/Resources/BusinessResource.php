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

            'phone' => $this->phone,

            'website' => $this->website,

            'facebook_url' => $this->facebook_url,

            'instagram_url' => $this->instagram_url,

            'telegram_url' => $this->telegram_url,

            'tiktok_url' => $this->tiktok_url,

            'logo' => $this->logoUrl(),

            'banner' => $this->bannerUrl(),

            'address' => $this->address,

            'city' => $this->city,

            'country' => $this->country,

            'primary_color' => $this->primary_color,

            'secondary_color' => $this->secondary_color,

            'theme' => $this->resolvedTheme(),

            'is_active' => $this->is_active,

            'created_at' => $this->created_at,
        ];
    }
}
