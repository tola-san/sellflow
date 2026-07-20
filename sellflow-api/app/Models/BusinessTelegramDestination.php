<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class BusinessTelegramDestination extends Model
{
    public const PURPOSES = ['sales_channel', 'customer_group', 'staff_group'];

    protected $fillable = [
        'business_id', 'telegram_chat_id', 'telegram_chat_name', 'telegram_chat_type',
        'purpose', 'is_active', 'bot_is_admin', 'settings', 'connected_at',
    ];

    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
            'bot_is_admin' => 'boolean',
            'settings' => 'array',
            'connected_at' => 'datetime',
        ];
    }

    public function business(): BelongsTo
    {
        return $this->belongsTo(Business::class);
    }
}
