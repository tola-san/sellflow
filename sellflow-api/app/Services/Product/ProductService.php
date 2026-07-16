<?php

namespace App\Services\Product;

use App\Models\Product;
use App\Models\User;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Str;

class ProductService
{
    public function index(User $user): Collection
    {
        if (! $user->business) {
            return new Collection;
        }

        return $user->business
            ->products()
            ->with('category')
            ->latest()
            ->get();
    }

    public function store(User $user, array $data): Product
    {
        $business = $user->business;

        if (! $business) {
            abort(422, 'Please create a business first.');
        }

        return $business->products()->create([

            'category_id' => $data['category_id'],
            'name' => $data['name'],
            'slug' => Str::slug($data['slug']),
            'sku' => $data['sku'] ?? null,
            'description' => $data['description'] ?? null,
            'price' => $data['price'],
            'discount_price' => $data['discount_price'] ?? null,
            'stock' => $data['stock'] ?? 0,
            'thumbnail' => $data['thumbnail'] ?? null,
            'is_featured' => $data['is_featured'] ?? false,
            'is_active' => $data['is_active'] ?? true,
        ]);
    }

    public function show(Product $product): Product
    {
        return $product->load('category');
    }

    public function update(Product $product, array $data): Product
    {
        $product->update([
            'category_id' => $data['category_id'],
            'name' => $data['name'],
            'slug' => Str::slug($data['slug']),
            'sku' => $data['sku'] ?? null,
            'description' => $data['description'] ?? null,
            'price' => $data['price'],
            'discount_price' => $data['discount_price'] ?? null,
            'stock' => $data['stock'] ?? 0,
            'thumbnail' => $data['thumbnail'] ?? null,
            'is_featured' => $data['is_featured'] ?? false,
            'is_active' => $data['is_active'] ?? true,
        ]);

        return $product->fresh()->load('category');
    }

    public function destroy(Product $product): void
    {
        $product->delete();
    }
}
