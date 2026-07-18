<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Business extends Model
{
    // The attributes that are mass assignable.
    use HasFactory;

    protected $fillable = [
        'user_id',
        'name',
        'slug',
        'description',
        'email',
        'phone',
        'website',
        'logo',
        'banner',
        'address',
        'city',
        'country',
        'primary_color',
        'secondary_color',
        'theme_preset',
        'theme_settings',
        'is_active'
    ];


    protected $casts = [
        'is_active' => 'boolean',
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
    public function categories() {
        
        return $this->hasMany(Category::class);
    }


    /**
     * Business has many products.
     */
    public function products()
    {
        return $this->hasMany(Product::class);
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
}
