<?php

namespace App\Http\Requests\Business;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class StoreBusinessRequest extends FormRequest
{
    public function authorize(): bool
    {
        return ! $this->user()?->business;
    }

    protected function prepareForValidation(): void
    {
        $this->merge(['slug' => Str::slug((string) $this->input('slug'))]);
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'business_type' => ['required', 'string', Rule::in(array_keys(config('business_types', [])))],
            'slug' => ['required', 'string', 'max:255', 'regex:/^[a-z0-9]+(?:-[a-z0-9]+)*$/', Rule::notIn(self::reservedSlugs()), 'unique:businesses,slug'],
            'description' => ['nullable', 'string'],
            'phone' => ['nullable', 'string'],
            'website' => ['nullable', 'url'],
            'facebook_url' => ['nullable', 'url', 'max:2048'],
            'instagram_url' => ['nullable', 'url', 'max:2048'],
            'telegram_url' => ['nullable', 'url', 'max:2048'],
            'tiktok_url' => ['nullable', 'url', 'max:2048'],
            'logo_image' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:'.config('business_media.max_size_kb', 4096)],
            'banner_image' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:'.config('business_media.max_size_kb', 4096)],
            'banner_overlay_opacity' => ['nullable', 'integer', 'between:0,100'],
            'address' => ['nullable', 'string'],
            'city' => ['nullable', 'string'],
            'country' => ['nullable', 'string'],
            'show_map' => ['nullable', 'boolean'],
            'primary_color' => ['nullable', 'regex:/^#[0-9A-Fa-f]{6}$/'],
            'secondary_color' => ['nullable', 'regex:/^#[0-9A-Fa-f]{6}$/'],
            'is_active' => ['nullable', 'boolean'],
        ];
    }

    public static function reservedSlugs(): array
    {
        return ['api', 'dashboard', 'admin', 'login', 'register', 'assets', 'cart', 'checkout'];
    }
}
