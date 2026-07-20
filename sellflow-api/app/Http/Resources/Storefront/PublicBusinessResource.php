<?php

namespace App\Http\Resources\Storefront;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PublicBusinessResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'name' => $this->name,
            'slug' => $this->slug,
            'logo' => $this->logoUrl(),
            'banner' => $this->bannerUrl(),
            'description' => $this->description,
            'phone' => $this->phone,
            'website' => $this->website,
            'facebook_url' => $this->facebook_url,
            'instagram_url' => $this->instagram_url,
            'telegram_url' => $this->telegram_url,
            'tiktok_url' => $this->tiktok_url,
            'address' => $this->address,
            'city' => $this->city,
            'country' => $this->country,
            'theme' => $this->resolvedTheme(),
        ];
    }
}
