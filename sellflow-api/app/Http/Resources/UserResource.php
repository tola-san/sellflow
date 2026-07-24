<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $business = $this->business()->first();
        $hasBusiness = $business !== null;

        return [

            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'has_business' => $hasBusiness,
            'onboarding_completed' => $hasBusiness,
            'business_type' => $business?->business_type,
            'business' => $business ? [
                'id' => $business->id,
                'name' => $business->name,
                'slug' => $business->slug,
                'business_type' => $business->business_type,
                'logo' => $business->logoUrl(),
                'is_active' => $business->is_active,
            ] : null,
        ];
    }
}
