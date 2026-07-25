<?php

namespace App\Http\Requests\Restaurant;

use App\Models\RestaurantTable;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class SaveRestaurantTableRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->business?->business_type === 'food_beverage';
    }

    public function rules(): array
    {
        $businessId = $this->user()?->business?->id;
        $table = $this->route('restaurant_table');
        $tableId = $table instanceof RestaurantTable ? $table->id : null;

        return [
            'name' => [
                'required', 'string', 'max:80',
                Rule::unique('restaurant_tables', 'name')
                    ->where('business_id', $businessId)
                    ->ignore($tableId),
            ],
            'area' => ['nullable', 'string', 'max:80'],
            'capacity' => ['required', 'integer', 'min:1', 'max:100'],
            'status' => ['required', Rule::in(['available', 'occupied', 'reserved', 'inactive'])],
            'is_active' => ['required', 'boolean'],
            'sort_order' => ['nullable', 'integer', 'min:0', 'max:99999'],
        ];
    }
}
