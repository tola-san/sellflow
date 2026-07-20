<?php

namespace App\Services\Business;

use Cloudinary\Cloudinary;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Throwable;

class BusinessMediaService
{
    public function store(UploadedFile $file, int $businessId, string $type): string
    {
        $disk = config('business_media.disk', 'public');
        $directory = trim(config('business_media.directory', 'businesses'), '/')."/{$businessId}/{$type}";

        if ($disk === 'cloudinary') {
            return $this->storeOnCloudinary($file, $directory);
        }

        $path = $file->store($directory, $disk);
        if (! $path) {
            abort(422, 'The business image could not be stored.');
        }

        return $path;
    }

    public function delete(?string $path): void
    {
        if (! $path) {
            return;
        }

        if (parse_url($path, PHP_URL_HOST) === 'res.cloudinary.com') {
            $publicId = $this->cloudinaryPublicId($path);
            if ($publicId) {
                try {
                    $this->cloudinary()->uploadApi()->destroy($publicId, ['resource_type' => 'image', 'invalidate' => true]);
                } catch (Throwable $exception) {
                    Log::warning('Cloudinary business image cleanup failed.', ['public_id' => $publicId, 'exception' => $exception]);
                }
            }

            return;
        }

        $directory = trim(config('business_media.directory', 'businesses'), '/').'/';
        if (Str::startsWith($path, $directory)) {
            $disk = config('business_media.disk', 'public');
            Storage::disk($disk === 'cloudinary' ? 'public' : $disk)->delete($path);
        }
    }

    private function storeOnCloudinary(UploadedFile $file, string $directory): string
    {
        try {
            $result = $this->cloudinary()->uploadApi()->upload($file->getRealPath(), [
                'folder' => 'sellflow/'.$directory,
                'resource_type' => 'image',
                'unique_filename' => true,
                'overwrite' => false,
            ]);
        } catch (Throwable $exception) {
            Log::error('Cloudinary business image upload failed.', ['exception_class' => $exception::class, 'exception_message' => $exception->getMessage()]);
            abort(502, 'Cloudinary rejected the business image upload. Check the API storage credentials.');
        }

        $secureUrl = $result['secure_url'] ?? null;
        if (! is_string($secureUrl) || $secureUrl === '') {
            abort(502, 'Cloudinary did not return a business image URL.');
        }

        return $secureUrl;
    }

    private function cloudinary(): Cloudinary
    {
        $url = config('services.cloudinary.url');
        if (! is_string($url) || trim($url) === '') {
            abort(503, 'Cloudinary image storage is not configured.');
        }

        $url = trim($url, " \t\n\r\0\x0B\"'");
        if (Str::startsWith($url, 'CLOUDINARY_URL=')) {
            $url = trim(Str::after($url, 'CLOUDINARY_URL='));
        }

        $parts = parse_url($url);
        if (! is_array($parts) || ($parts['scheme'] ?? null) !== 'cloudinary' || empty($parts['user']) || empty($parts['pass']) || empty($parts['host']) || Str::contains($url, ['<', '>', '*'])) {
            abort(503, 'CLOUDINARY_URL is invalid.');
        }

        return new Cloudinary($url);
    }

    private function cloudinaryPublicId(string $url): ?string
    {
        $path = parse_url($url, PHP_URL_PATH);
        if (! is_string($path) || ! preg_match('#/image/upload/(?:v\d+/)?(.+)\.[^./]+$#', $path, $matches)) {
            return null;
        }

        return rawurldecode($matches[1]);
    }
}
