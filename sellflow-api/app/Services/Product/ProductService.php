<?php

namespace App\Services\Product;

use App\Models\Product;
use App\Models\User;
use Cloudinary\Cloudinary;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Throwable;

class ProductService
{
    public function index(User $user): Collection
    {
        if (! $user->business) {
            return new Collection;
        }

        return $user->business
            ->products()
            ->with(['category', 'modifierGroups.options', 'variants.product'])
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

        try {
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
        } catch (Throwable $exception) {
            $this->deleteManagedThumbnail($thumbnail);
            throw $exception;
        }
    }

    public function show(Product $product): Product
    {
        return $product->load(['category', 'modifierGroups.options', 'variants.product']);
    }

    public function update(Product $product, array $data): Product
    {
        $oldThumbnail = $product->thumbnail;
        $thumbnail = $oldThumbnail;
        $newThumbnail = null;

        if (($data['remove_thumbnail'] ?? false) && ! isset($data['thumbnail'])) {
            $thumbnail = null;
        }

        if (isset($data['thumbnail'])) {
            $newThumbnail = $this->storeThumbnail($data['thumbnail'], $product->business_id);
            $thumbnail = $newThumbnail;
        }

        try {
            $product->update([
                'category_id' => $data['category_id'],
                'name' => $data['name'],
                'slug' => Str::slug($data['slug']),
                'sku' => $data['sku'] ?? null,
                'description' => $data['description'] ?? null,
                'price' => $data['price'],
                'discount_price' => $data['discount_price'] ?? null,
                'stock' => $product->variants()->exists() ? $product->stock : ($data['stock'] ?? 0),
                'thumbnail' => $thumbnail,
                'is_featured' => $data['is_featured'] ?? false,
                'is_active' => $data['is_active'] ?? true,
            ]);
        } catch (Throwable $exception) {
            $this->deleteManagedThumbnail($newThumbnail);
            throw $exception;
        }

        if ($thumbnail !== $oldThumbnail) {
            $this->deleteManagedThumbnail($oldThumbnail);
        }

        return $product->fresh()->load(['category', 'modifierGroups.options', 'variants.product']);
    }

    public function destroy(Product $product): void
    {
        $thumbnail = $product->thumbnail;
        $product->delete();
        $this->deleteManagedThumbnail($thumbnail);
    }

    private function storeThumbnail(UploadedFile $file, int $businessId): string
    {
        $disk = config('product_images.disk', 'public');
        $directory = trim(config('product_images.directory', 'products'), '/').'/'.$businessId;

        if ($disk === 'cloudinary') {
            return $this->storeCloudinaryThumbnail($file, $directory);
        }

        $path = $file->store($directory, $disk);

        if (! $path) {
            abort(422, 'The product image could not be stored.');
        }

        return $path;
    }

    private function storeCloudinaryThumbnail(UploadedFile $file, string $directory): string
    {
        $cloudinary = $this->cloudinary();

        try {
            $result = $cloudinary->uploadApi()->upload($file->getRealPath(), [
                'folder' => 'sellflow/'.$directory,
                'resource_type' => 'image',
                'unique_filename' => true,
                'overwrite' => false,
            ]);
        } catch (Throwable $exception) {
            Log::error('Cloudinary product image upload failed.', [
                'exception_class' => $exception::class,
                'exception_message' => $exception->getMessage(),
            ]);
            abort(502, 'Cloudinary rejected the image upload. Check the Render logs and CLOUDINARY_URL credentials.');
        }

        $secureUrl = $result['secure_url'] ?? null;

        if (! is_string($secureUrl) || $secureUrl === '') {
            abort(502, 'Cloudinary did not return a product image URL.');
        }

        return $secureUrl;
    }

    private function deleteManagedThumbnail(?string $thumbnail): void
    {
        if (! $thumbnail) {
            return;
        }

        if ($this->isCloudinaryUrl($thumbnail)) {
            $publicId = $this->cloudinaryPublicId($thumbnail);

            if ($publicId) {
                try {
                    $this->cloudinary()->uploadApi()->destroy($publicId, [
                        'resource_type' => 'image',
                        'invalidate' => true,
                    ]);
                } catch (Throwable $exception) {
                    Log::warning('Cloudinary product image cleanup failed.', [
                        'public_id' => $publicId,
                        'exception' => $exception,
                    ]);
                }
            }

            return;
        }

        $directory = trim(config('product_images.directory', 'products'), '/').'/';

        if (Str::startsWith($thumbnail, $directory)) {
            $disk = config('product_images.disk', 'public');
            Storage::disk($disk === 'cloudinary' ? 'public' : $disk)->delete($thumbnail);
        }
    }

    private function cloudinary(): Cloudinary
    {
        $url = config('services.cloudinary.url');

        if (! is_string($url) || $url === '') {
            abort(503, 'Cloudinary image storage is not configured.');
        }

        $url = trim($url, " \t\n\r\0\x0B\"'");

        // Render already supplies the environment key separately. Tolerate a
        // pasted `CLOUDINARY_URL=` prefix so a common dashboard mistake does
        // not turn into an opaque authentication failure.
        if (Str::startsWith($url, 'CLOUDINARY_URL=')) {
            $url = trim(Str::after($url, 'CLOUDINARY_URL='));
        }

        $parts = parse_url($url);

        if (! is_array($parts)
            || ($parts['scheme'] ?? null) !== 'cloudinary'
            || empty($parts['user'])
            || empty($parts['pass'])
            || empty($parts['host'])
            || Str::contains($url, ['<', '>', '*'])) {
            abort(503, 'CLOUDINARY_URL is invalid. Use cloudinary://API_KEY:API_SECRET@CLOUD_NAME with real credentials.');
        }

        return new Cloudinary($url);
    }

    private function isCloudinaryUrl(string $url): bool
    {
        return parse_url($url, PHP_URL_HOST) === 'res.cloudinary.com';
    }

    private function cloudinaryPublicId(string $url): ?string
    {
        $path = parse_url($url, PHP_URL_PATH);

        if (! is_string($path)
            || ! preg_match('#/image/upload/(?:v\d+/)?(.+)\.[^./]+$#', $path, $matches)) {
            return null;
        }

        return rawurldecode($matches[1]);
    }
}
