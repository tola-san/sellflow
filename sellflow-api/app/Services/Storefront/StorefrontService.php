<?php

namespace App\Services\Storefront;

use App\Models\Business;
use App\Models\Product;

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
                    ->where('availability_status', '!=', 'hidden')
                    ->whereHas('category', fn ($category) => $category
                        ->whereColumn('categories.business_id', 'products.business_id')
                        ->where('is_active', true))
                    ->with([
                        'category',
                        'modifierGroups' => fn ($groups) => $groups
                            ->where('is_active', true)
                            ->with(['options' => fn ($options) => $options->where('is_active', true)]),
                        'availabilitySchedules',
                    ])
                    ->orderByDesc('is_featured')
                    ->latest(),
            ])
            ->firstOrFail();
    }

    public function findProduct(string $businessSlug, string $productSlug): array
    {
        $business = Business::query()
            ->where('slug', $businessSlug)
            ->where('is_active', true)
            ->firstOrFail();

        $product = Product::query()
            ->where('business_id', $business->id)
            ->where('slug', $productSlug)
            ->where('is_active', true)
            ->where('availability_status', '!=', 'hidden')
            ->whereHas('category', fn ($category) => $category
                ->where('business_id', $business->id)
                ->where('is_active', true))
            ->with([
                'category',
                'modifierGroups' => fn ($groups) => $groups
                    ->where('is_active', true)
                    ->with(['options' => fn ($options) => $options->where('is_active', true)]),
                'availabilitySchedules',
            ])
            ->firstOrFail();

        return compact('business', 'product');
    }
}
