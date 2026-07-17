<?php

namespace App\Services\Product;

use App\Models\Product;
use App\Models\User;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Str;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

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

        $thumbnail = isset($data['thumbnail'])
            ? $this->storeThumbnail($data['thumbnail'], $business->id)
            : null;

        return $business->products()->create([

            'category_id' => $data['category_id'],
            'name' => $data['name'],
            'slug' => Str::slug($data['slug']),
            'sku' => $data['sku'] ?? null,
            'description' => $data['description'] ?? null,
            'price' => $data['price'],
            'discount_price' => $data['discount_price'] ?? null,
            'stock' => $data['stock'] ?? 0,
            'thumbnail' => $thumbnail,
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
        $thumbnail = $product->thumbnail;

        if (($data['remove_thumbnail'] ?? false) && ! isset($data['thumbnail'])) {
            $this->deleteManagedThumbnail($thumbnail);
            $thumbnail = null;
        }

        if (isset($data['thumbnail'])) {
            $newThumbnail = $this->storeThumbnail($data['thumbnail'], $product->business_id);
            $this->deleteManagedThumbnail($thumbnail);
            $thumbnail = $newThumbnail;
        }

        $product->update([
            'category_id' => $data['category_id'],
            'name' => $data['name'],
            'slug' => Str::slug($data['slug']),
            'sku' => $data['sku'] ?? null,
            'description' => $data['description'] ?? null,
            'price' => $data['price'],
            'discount_price' => $data['discount_price'] ?? null,
            'stock' => $data['stock'] ?? 0,
            'thumbnail' => $thumbnail,
            'is_featured' => $data['is_featured'] ?? false,
            'is_active' => $data['is_active'] ?? true,
        ]);

        return $product->fresh()->load('category');
    }

    public function destroy(Product $product): void
    {
        $this->deleteManagedThumbnail($product->thumbnail);
        $product->delete();
    }

    private function storeThumbnail(UploadedFile $file, int $businessId): string
    {
        $disk = config('product_images.disk', 'public');
        $directory = trim(config('product_images.directory', 'products'), '/').'/'.$businessId;
        $path = $file->storePublicly($directory, $disk);

        if (! $path) {
            abort(422, 'The product image could not be stored.');
        }

        return $path;
    }

    private function deleteManagedThumbnail(?string $thumbnail): void
    {
        $directory = trim(config('product_images.directory', 'products'), '/').'/';

        if ($thumbnail && Str::startsWith($thumbnail, $directory)) {
            Storage::disk(config('product_images.disk', 'public'))->delete($thumbnail);
        }
    }
}
