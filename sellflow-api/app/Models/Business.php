<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class Business extends Model
{
    // The attributes that are mass assignable.
    use HasFactory;

    protected $fillable = [
        'user_id',
        'name',
        'business_type',
        'slug',
        'description',
        'email',
        'phone',
        'website',
        'facebook_url',
        'instagram_url',
        'telegram_url',
        'tiktok_url',
        'logo',
        'banner',
        'address',
        'city',
        'country',
        'show_map',
        'primary_color',
        'secondary_color',
        'theme_preset',
        'theme_settings',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'show_map' => 'boolean',
        'theme_settings' => 'array',
    ];

    public function resolvedTheme(): array
    {
        $presets = config('storefront_themes.presets', []);
        $preset = array_key_exists($this->theme_preset, $presets)
            ? $this->theme_preset
            : config('storefront_themes.default', 'modern');
        $defaults = $presets[$preset] ?? [];
        $settings = is_array($this->theme_settings) ? $this->theme_settings : [];

        if (! array_key_exists('primary_color', $settings)) {
            $settings['primary_color'] = $this->primary_color;
        }

        if (! array_key_exists('secondary_color', $settings)) {
            $settings['secondary_color'] = $this->secondary_color;
        }

        return ['preset' => $preset, ...array_merge($defaults, $settings)];
    }

    public function logoUrl(): ?string
    {
        return $this->mediaUrl($this->logo);
    }

    public function bannerUrl(): ?string
    {
        return $this->mediaUrl($this->banner);
    }

    private function mediaUrl(?string $path): ?string
    {
        if (! $path) {
            return null;
        }

        if (Str::startsWith($path, ['http://', 'https://', 'data:', '/storage/'])) {
            return $path;
        }

        $disk = config('business_media.disk', 'public');

        return $disk === 'cloudinary' ? null : Storage::disk($disk)->url($path);
    }

    /**
     * Business belongs to one user.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Business has many categories.
     */
    public function categories()
    {

        return $this->hasMany(Category::class);
    }

    /**
     * Business has many products.
     */
    public function products()
    {
        return $this->hasMany(Product::class);
    }

    public function productVariants(): HasMany
    {
        return $this->hasMany(ProductVariant::class);
    }

    public function inventoryMovements(): HasMany
    {
        return $this->hasMany(InventoryMovement::class);
    }

    public function modifierGroups(): HasMany
    {
        return $this->hasMany(ModifierGroup::class);
    }

    public function restaurantTables(): HasMany
    {
        return $this->hasMany(RestaurantTable::class);
    }

    public function orders()
    {
        return $this->hasMany(Order::class);
    }

    public function notificationSetting(): HasOne
    {
        return $this->hasOne(BusinessNotificationSetting::class);
    }

    public function telegramConnectionCodes(): HasMany
    {
        return $this->hasMany(TelegramConnectionCode::class);
    }

    public function telegramDestinations(): HasMany
    {
        return $this->hasMany(BusinessTelegramDestination::class);
    }
}
