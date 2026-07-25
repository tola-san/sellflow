<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class RestaurantTable extends Model
{
    protected $fillable = [
        'business_id', 'name', 'area', 'capacity', 'status', 'qr_token', 'is_active', 'sort_order',
    ];

    protected $casts = [
        'capacity' => 'integer',
        'is_active' => 'boolean',
        'sort_order' => 'integer',
    ];

    public function business(): BelongsTo
    {
        return $this->belongsTo(Business::class);
    }

    public function orders(): HasMany
    {
        return $this->hasMany(Order::class);
    }
}
