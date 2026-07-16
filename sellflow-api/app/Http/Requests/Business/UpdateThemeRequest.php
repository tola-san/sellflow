<?php

namespace App\Http\Requests\Business;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateThemeRequest extends FormRequest
{
    public function authorize(): bool
    {
        return (bool) $this->user()?->business;
    }

    public function rules(): array
    {
        $hex = ['required', 'regex:/^#[0-9A-Fa-f]{6}$/'];

        return [
            'preset' => ['required', Rule::in(array_keys(config('storefront_themes.presets', [])))],
            'primary_color' => $hex,
            'secondary_color' => $hex,
            'background_color' => $hex,
            'surface_color' => $hex,
            'text_color' => $hex,
            'muted_color' => $hex,
            'font_family' => ['required', Rule::in(['system', 'modern', 'classic'])],
            'card_style' => ['required', Rule::in(['elevated', 'bordered', 'flat'])],
            'button_style' => ['required', Rule::in(['rounded', 'pill', 'square'])],
            'hero_style' => ['required', Rule::in(['gradient', 'banner', 'minimal'])],
            'grid_columns' => ['required', 'integer', Rule::in([2, 3, 4])],
        ];
    }
}
