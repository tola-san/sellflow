<?php

namespace App\Http\Requests\Storefront;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class CheckoutRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'customer_name' => ['required', 'string', 'max:255'],
            'customer_phone' => ['required', 'string', 'max:50'],
            'delivery_address' => ['required_without:table_token', 'nullable', 'string', 'max:1000'],
            'table_token' => ['nullable', 'string', 'size:40'],
            'city' => ['nullable', 'string', 'max:255'],
            'notes' => ['nullable', 'string', 'max:1000'],
            'payment_method' => ['required', Rule::in(['cash', 'bakong'])],
            'telegram_init_data' => ['nullable', 'string', 'max:8192'],
            'items' => ['required', 'array', 'min:1', 'max:50'],
            'items.*.product_slug' => ['required', 'string', 'max:255'],
            'items.*.variant_id' => ['nullable', 'integer'],
            'items.*.quantity' => ['required', 'integer', 'min:1', 'max:99'],
            'items.*.modifier_ids' => ['sometimes', 'array', 'max:50'],
            'items.*.modifier_ids.*' => ['integer', 'distinct'],
        ];
    }
}
