<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProductAvailabilitySchedule extends Model
{
    protected $fillable = [
        'product_id', 'name', 'days', 'start_time', 'end_time', 'is_active', 'sort_order',
    ];

    protected $casts = [
        'days' => 'array',
        'is_active' => 'boolean',
        'sort_order' => 'integer',
    ];

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    public function isAvailableAt(\DateTimeInterface $dateTime): bool
    {
        if (! $this->is_active || ! in_array((int) $dateTime->format('w'), $this->days ?? [], true)) {
            return false;
        }

        $time = $dateTime->format('H:i:s');

        return $this->start_time <= $this->end_time
            ? $time >= $this->start_time && $time <= $this->end_time
            : $time >= $this->start_time || $time <= $this->end_time;
    }
}
