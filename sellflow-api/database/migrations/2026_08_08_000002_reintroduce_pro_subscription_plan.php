<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::table('subscription_plans')->where('slug', 'pro')->update([
            'name' => 'Pro',
            'description' => 'Multi-business tools, unlimited insights, and priority support.',
            'monthly_price' => 12,
            'yearly_price' => 120,
            'limits' => json_encode(['businesses' => 3, 'staff' => 15, 'products' => null]),
            'features' => json_encode([
                'inventory' => 'advanced',
                'telegram_notifications' => true,
                'restaurant_qr' => true,
                'analytics_history_days' => null,
                'custom_domain' => true,
                'priority_support' => true,
            ]),
            'is_active' => true,
            'sort_order' => 3,
            'updated_at' => now(),
        ]);
    }

    public function down(): void
    {
        DB::table('subscription_plans')->where('slug', 'pro')->update([
            'is_active' => false,
            'updated_at' => now(),
        ]);
    }
};
