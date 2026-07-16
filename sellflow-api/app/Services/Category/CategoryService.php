<?php

namespace App\Services\Category;

use App\Models\Category;
use App\Models\User;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Str;

class CategoryService
{
    public function index(User $user): Collection
    {
        if (! $user->business) {
            return new Collection;
        }

        return $user->business
            ->categories()
            ->latest()
            ->get();
    }

    public function store(User $user, array $data): Category
    {
        if (! $user->business) {
            abort(422, 'Please create a business first.');
        }

        return $user->business
            ->categories()
            ->create([
                'name' => $data['name'],
                'slug' => Str::slug($data['slug']),
                'description' => $data['description'] ?? null,
                'image' => $data['image'] ?? null,
                'sort_order' => $data['sort_order'] ?? 0,
                'is_active' => $data['is_active'] ?? true,
            ]);
    }

    public function show(Category $category): Category
    {
        return $category;
    }

    public function update(Category $category, array $data): Category
    {
        $category->update([
            'name' => $data['name'],
            'slug' => Str::slug($data['slug']),
            'description' => $data['description'] ?? null,
            'image' => $data['image'] ?? null,
            'sort_order' => $data['sort_order'] ?? 0,
            'is_active' => $data['is_active'] ?? true,
        ]);

        return $category->fresh();
    }

    public function destroy(Category $category): void
    {
        $category->delete();
    }
}
