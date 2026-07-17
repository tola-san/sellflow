<?php

namespace App\Http\Requests\Product;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\File;

class UpdateProductRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $businessId = $this->user()?->business?->id;
        $productId = $this->route('product')?->id
            ?? $this->route('product');

        return [
            'category_id' => [
                'sometimes',
                'required',
                'integer',
                Rule::exists('categories', 'id')
                    ->where(fn($query) => $query
                        ->where('business_id', $businessId)
                        ->where('is_active', true)),
            ],

            'name' => [
                'sometimes',
                'required',
                'string',
                'max:255',
            ],

            'slug' => [
                'sometimes',
                'required',
                'string',
                'max:255',
                Rule::unique('products', 'slug')
                    ->where(fn($query) => $query
                        ->where('business_id', $businessId))
                    ->ignore($productId),
            ],

            'sku' => [
                'sometimes',
                'nullable',
                'string',
                'max:100',
                Rule::unique('products', 'sku')
                    ->where(fn($query) => $query
                        ->where('business_id', $businessId))
                    ->ignore($productId),
            ],

            'description' => [
                'sometimes',
                'nullable',
                'string',
            ],

            'price' => [
                'sometimes',
                'required',
                'numeric',
                'min:0',
            ],

            'discount_price' => [
                'sometimes',
                'nullable',
                'numeric',
                'min:0',
                'lte:price',
            ],

            'stock' => [
                'sometimes',
                'required',
                'integer',
                'min:0',
            ],

            'thumbnail' => [
                'sometimes',
                'nullable',
                File::image()
                    ->types(['jpg', 'jpeg', 'png', 'webp'])
                    ->max(config('product_images.max_size_kb', 4096)),
            ],

            'remove_thumbnail' => [
                'sometimes',
                'boolean',
            ],

            'is_featured' => [
                'sometimes',
                'boolean',
            ],

            'is_active' => [
                'sometimes',
                'boolean',
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'category_id.exists' =>
            'The selected category does not belong to your business or is inactive.',

            'slug.unique' =>
            'This product slug is already used by your business.',

            'sku.unique' =>
            'This SKU is already used by your business.',

            'discount_price.lte' =>
            'The discount price must not be greater than the regular price.',
        ];
    }
}
