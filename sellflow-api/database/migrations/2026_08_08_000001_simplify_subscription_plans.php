<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::table('subscription_plans')->where('slug', 'starter')->update([
            'name' => 'Starter',
            'description' => 'Essential selling tools for independent shops starting online.',
            'monthly_price' => 3,
            'yearly_price' => 30,
            'limits' => json_encode(['businesses' => 1, 'staff' => 1, 'products' => 100]),
            'features' => json_encode([
                'inventory' => 'basic',
                'telegram_notifications' => true,
                'restaurant_qr' => false,
                'analytics_history_days' => 30,
                'custom_domain' => false,
                'priority_support' => false,
            ]),
            'sort_order' => 1,
            'updated_at' => now(),
        ]);

        DB::table('subscription_plans')->where('slug', 'growth')->update([
            'name' => 'Business',
            'slug' => 'business',
            'description' => 'Advanced operations for growing stores and restaurants.',
            'monthly_price' => 9,
            'yearly_price' => 90,
            'limits' => json_encode(['businesses' => 1, 'staff' => 5, 'products' => null]),
            'features' => json_encode([
                'inventory' => 'advanced',
                'telegram_notifications' => true,
                'restaurant_qr' => true,
                'analytics_history_days' => 365,
                'custom_domain' => false,
                'priority_support' => true,
            ]),
            'sort_order' => 2,
            'updated_at' => now(),
        ]);

        DB::table('subscription_plans')->where('slug', 'pro')->update([
            'is_active' => false,
            'updated_at' => now(),
        ]);
    }

    public function down(): void
    {
        DB::table('subscription_plans')->where('slug', 'starter')->update([
            'monthly_price' => 6,
            'yearly_price' => 60,
            'updated_at' => now(),
        ]);

        DB::table('subscription_plans')->where('slug', 'business')->update([
            'name' => 'Growth',
            'slug' => 'growth',
            'monthly_price' => 12,
            'yearly_price' => 120,
            'updated_at' => now(),
        ]);

        DB::table('subscription_plans')->where('slug', 'pro')->update([
            'is_active' => true,
            'updated_at' => now(),
        ]);
    }
};
