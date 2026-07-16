<?php

namespace App\Services\Storefront;

use App\Models\Business;

class StorefrontService
{
    public function findBySlug(string $slug): Business
    {
        return Business::query()
            ->where('slug', $slug)
            ->where('is_active', true)
            ->with([
                'categories' => fn ($query) => $query
                    ->where('is_active', true)
                    ->orderBy('sort_order')
                    ->orderBy('name'),
                'products' => fn ($query) => $query
                    ->where('is_active', true)
                    ->whereHas('category', fn ($category) => $category
                        ->whereColumn('categories.business_id', 'products.business_id')
                        ->where('is_active', true))
                    ->with('category')
                    ->orderByDesc('is_featured')
                    ->latest(),
            ])
            ->firstOrFail();
    }
}
