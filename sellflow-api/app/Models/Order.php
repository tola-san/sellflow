<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Order extends Model
{
    protected $fillable = [
        'business_id', 'order_number', 'customer_name', 'customer_phone',
        'customer_email', 'telegram_user_id', 'telegram_chat_id', 'telegram_username',
        'telegram_notifications_enabled', 'telegram_receipt_sent_at',
        'telegram_last_notified_status', 'telegram_last_notification_sent_at',
        'delivery_address', 'city', 'notes', 'subtotal',
        'total', 'payment_method', 'payment_status', 'status',
    ];

    protected $casts = [
        'subtotal' => 'decimal:2',
        'total' => 'decimal:2',
        'telegram_notifications_enabled' => 'boolean',
        'telegram_receipt_sent_at' => 'datetime',
        'telegram_last_notification_sent_at' => 'datetime',
    ];

    public function business(): BelongsTo
    {
        return $this->belongsTo(Business::class);
    }

    public function items(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }
}
