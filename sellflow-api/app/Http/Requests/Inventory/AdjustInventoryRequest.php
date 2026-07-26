<?php

namespace App\Http\Requests\Inventory;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class AdjustInventoryRequest extends FormRequest
{
    private const RETAIL_TYPES = ['fashion', 'beauty', 'electronics', 'grocery_retail'];

    public function authorize(): bool
    {
        return in_array($this->user()?->business?->business_type, self::RETAIL_TYPES, true);
    }

    public function rules(): array
    {
        $businessId = $this->user()?->business?->id;

        return [
            'product_id' => [
                'required',
                'integer',
                Rule::exists('products', 'id')->where('business_id', $businessId),
            ],
            'product_variant_id' => [
                'nullable',
                'integer',
                Rule::exists('product_variants', 'id')->where('business_id', $businessId),
            ],
            'quantity' => ['required', 'integer', 'min:0', 'max:999999999'],
            'low_stock_threshold' => ['nullable', 'integer', 'min:0', 'max:999999999'],
            'reason' => ['nullable', 'string', 'max:255'],
        ];
    }
}
