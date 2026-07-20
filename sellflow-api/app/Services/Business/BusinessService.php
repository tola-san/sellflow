<?php

namespace App\Services\Business;

use App\Models\Business;
use App\Models\User;
use Illuminate\Support\Str;
use Throwable;

class BusinessService
{
    public function __construct(private readonly BusinessMediaService $media) {}

    public function create(User $user, array $data): Business
    {
        $business = Business::create([
            'user_id' => $user->id,
            'name' => $data['name'],
            'slug' => Str::slug($data['slug']),
            'description' => $data['description'] ?? null,
            'phone' => $data['phone'] ?? null,
            'website' => $data['website'] ?? null,
            'facebook_url' => $data['facebook_url'] ?? null,
            'instagram_url' => $data['instagram_url'] ?? null,
            'telegram_url' => $data['telegram_url'] ?? null,
            'tiktok_url' => $data['tiktok_url'] ?? null,
            'address' => $data['address'] ?? null,
            'city' => $data['city'] ?? null,
            'country' => $data['country'] ?? null,
            'primary_color' => $data['primary_color'] ?? '#10B981',
            'secondary_color' => $data['secondary_color'] ?? '#0F172A',
            'theme_settings' => isset($data['banner_overlay_opacity'])
                ? ['banner_overlay_opacity' => (int) $data['banner_overlay_opacity']]
                : null,
            'is_active' => $data['is_active'] ?? true,
        ]);

        $logo = null;
        $banner = null;

        try {
            $logo = isset($data['logo_image']) ? $this->media->store($data['logo_image'], $business->id, 'logo') : null;
            $banner = isset($data['banner_image']) ? $this->media->store($data['banner_image'], $business->id, 'banner') : null;
            $business->update([
                'logo' => $logo,
                'banner' => $banner,
            ]);
        } catch (Throwable $exception) {
            $this->media->delete($logo);
            $this->media->delete($banner);
            $business->delete();
            throw $exception;
        }

        return $business->fresh();
    }

    public function update(Business $business, array $data): Business
    {
        $oldLogo = $business->logo;
        $oldBanner = $business->banner;
        $logo = ($data['remove_logo'] ?? false) ? null : $oldLogo;
        $banner = ($data['remove_banner'] ?? false) ? null : $oldBanner;
        $newLogo = null;
        $newBanner = null;
        $themeSettings = $business->theme_settings;

        if (array_key_exists('banner_overlay_opacity', $data)) {
            $themeSettings = [
                ...(is_array($themeSettings) ? $themeSettings : []),
                'banner_overlay_opacity' => (int) $data['banner_overlay_opacity'],
            ];
        }

        try {
            $newLogo = isset($data['logo_image']) ? $this->media->store($data['logo_image'], $business->id, 'logo') : null;
            $newBanner = isset($data['banner_image']) ? $this->media->store($data['banner_image'], $business->id, 'banner') : null;
            $logo = $newLogo ?? $logo;
            $banner = $newBanner ?? $banner;

            $business->update([
                'name' => $data['name'],
                'slug' => Str::slug($data['slug']),
                'description' => $data['description'] ?? null,
                'phone' => $data['phone'] ?? null,
                'website' => $data['website'] ?? null,
                'facebook_url' => $data['facebook_url'] ?? null,
                'instagram_url' => $data['instagram_url'] ?? null,
                'telegram_url' => $data['telegram_url'] ?? null,
                'tiktok_url' => $data['tiktok_url'] ?? null,
                'logo' => $logo,
                'banner' => $banner,
                'address' => $data['address'] ?? null,
                'city' => $data['city'] ?? null,
                'country' => $data['country'] ?? null,
                'primary_color' => $data['primary_color'] ?? '#10B981',
                'secondary_color' => $data['secondary_color'] ?? '#0F172A',
                'theme_settings' => $themeSettings,
                'is_active' => $data['is_active'] ?? true,
            ]);
        } catch (Throwable $exception) {
            $this->media->delete($newLogo);
            $this->media->delete($newBanner);
            throw $exception;
        }

        if ($logo !== $oldLogo) {
            $this->media->delete($oldLogo);
        }
        if ($banner !== $oldBanner) {
            $this->media->delete($oldBanner);
        }

        return $business->fresh();
    }
}
