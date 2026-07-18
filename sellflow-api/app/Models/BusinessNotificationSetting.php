<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class BusinessNotificationSetting extends Model
{
    protected $fillable = ['business_id', 'telegram_chat_id', 'telegram_chat_name', 'telegram_enabled', 'new_order_enabled', 'payment_enabled', 'connected_at'];

    protected function casts(): array
    {
        return [
            'telegram_enabled' => 'boolean',
            'new_order_enabled' => 'boolean',
            'payment_enabled' => 'boolean',
            'connected_at' => 'datetime',
        ];
    }

    public function business(): BelongsTo
    {
        return $this->belongsTo(Business::class);
    }
}
