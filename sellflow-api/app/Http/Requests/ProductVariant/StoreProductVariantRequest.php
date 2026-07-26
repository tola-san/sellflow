<?php

namespace App\Http\Requests\ProductVariant;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreProductVariantRequest extends FormRequest
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
            'name' => ['required', 'string', 'max:150'],
            'attributes' => ['nullable', 'array', 'max:10'],
            'attributes.*' => ['required', 'string', 'max:100'],
            'sku' => [
                'nullable',
                'string',
                'max:100',
                Rule::unique('product_variants', 'sku')->where('business_id', $businessId),
            ],
            'price' => ['nullable', 'numeric', 'min:0', 'max:99999999.99'],
            'discount_price' => ['nullable', 'numeric', 'min:0', 'max:99999999.99'],
            'stock' => ['required', 'integer', 'min:0', 'max:999999999'],
            'low_stock_threshold' => ['required', 'integer', 'min:0', 'max:999999999'],
            'is_active' => ['required', 'boolean'],
            'sort_order' => ['nullable', 'integer', 'min:0', 'max:999999'],
        ];
    }

    public function after(): array
    {
        return [
            function ($validator) {
                $price = $this->input('price');
                $discount = $this->input('discount_price');
                if ($price !== null && $discount !== null && (float) $discount > (float) $price) {
                    $validator->errors()->add('discount_price', 'The discount price must not exceed the variant price.');
                }
            },
        ];
    }
}
