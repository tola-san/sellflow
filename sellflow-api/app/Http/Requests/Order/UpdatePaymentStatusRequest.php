<?php

namespace App\Http\Requests\Order;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdatePaymentStatusRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->business?->id === $this->route('order')?->business_id;
    }

    public function rules(): array
    {
        return ['payment_status' => ['required', Rule::in(['pending', 'paid', 'failed', 'refunded'])]];
    }
}
