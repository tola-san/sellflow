<?php

namespace App\Http\Requests\Restaurant;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateMenuAvailabilityRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->business?->business_type === 'food_beverage';
    }

    public function rules(): array
    {
        return [
            'availability_status' => ['required', Rule::in(['always', 'scheduled', 'sold_out', 'hidden'])],
            'schedules' => ['array', 'max:20'],
            'schedules.*.name' => ['required', 'string', 'max:50'],
            'schedules.*.days' => ['required', 'array', 'min:1', 'max:7'],
            'schedules.*.days.*' => ['integer', 'distinct', 'between:0,6'],
            'schedules.*.start_time' => ['required', 'date_format:H:i'],
            'schedules.*.end_time' => ['required', 'date_format:H:i'],
            'schedules.*.is_active' => ['required', 'boolean'],
        ];
    }
}
