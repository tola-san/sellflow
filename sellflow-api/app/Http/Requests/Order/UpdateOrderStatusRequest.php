<?php

namespace App\Http\Requests\Order;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateOrderStatusRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->business?->id === $this->route('order')?->business_id;
    }

    public function rules(): array
    {
        return ['status' => ['required', Rule::in(['pending', 'confirmed', 'preparing', 'completed', 'cancelled'])]];
    }
}
