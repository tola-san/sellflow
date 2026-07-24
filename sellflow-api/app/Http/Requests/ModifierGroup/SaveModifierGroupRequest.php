<?php

namespace App\Http\Requests\ModifierGroup;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class SaveModifierGroupRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->business?->business_type === 'food_beverage';
    }

    public function rules(): array
    {
        $businessId = $this->user()?->business?->id;

        return [
            'name' => ['required', 'string', 'max:100'],
            'selection_type' => ['required', Rule::in(['single', 'multiple'])],
            'is_required' => ['required', 'boolean'],
            'min_select' => ['nullable', 'integer', 'min:0', 'max:20'],
            'max_select' => ['nullable', 'integer', 'min:1', 'max:20', 'gte:min_select'],
            'is_active' => ['required', 'boolean'],
            'product_ids' => ['array'],
            'product_ids.*' => [
                'integer',
                'distinct',
                Rule::exists('products', 'id')->where('business_id', $businessId),
            ],
            'options' => ['required', 'array', 'min:1', 'max:50'],
            'options.*.name' => ['required', 'string', 'max:100'],
            'options.*.price_adjustment' => ['required', 'numeric', 'min:0', 'max:999999.99'],
            'options.*.is_active' => ['required', 'boolean'],
        ];
    }
}
