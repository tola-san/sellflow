<?php

namespace App\Services\Business;

use App\Models\Business;
use App\Models\User;
use Illuminate\Support\Str;

class BusinessService
{
    public function create(User $user, array $data): Business
    {
        return Business::create([
            'user_id' => $user->id,
            'name' => $data['name'],
            'slug' => Str::slug($data['slug']),
            'description' => $data['description'] ?? null,
            'email' => $data['email'] ?? null,
            'phone' => $data['phone'] ?? null,
            'website' => $data['website'] ?? null,
            'logo' => $data['logo'] ?? null,
            'banner' => $data['banner'] ?? null,
            'address' => $data['address'] ?? null,
            'city' => $data['city'] ?? null,
            'country' => $data['country'] ?? null,
            'primary_color' => $data['primary_color'] ?? '#10B981',
            'secondary_color' => $data['secondary_color'] ?? '#0F172A',
            'is_active' => $data['is_active'] ?? true,
        ]);
    }

    public function update(Business $business, array $data): Business
    {
        $business->update([
            'name' => $data['name'],
            'slug' => Str::slug($data['slug']),
            'description' => $data['description'] ?? null,
            'email' => $data['email'] ?? null,
            'phone' => $data['phone'] ?? null,
            'website' => $data['website'] ?? null,
            'logo' => $data['logo'] ?? null,
            'banner' => $data['banner'] ?? null,
            'address' => $data['address'] ?? null,
            'city' => $data['city'] ?? null,
            'country' => $data['country'] ?? null,
            'primary_color' => $data['primary_color'] ?? '#10B981',
            'secondary_color' => $data['secondary_color'] ?? '#0F172A',
            'is_active' => $data['is_active'] ?? true,
        ]);

        return $business->fresh();
    }
}
