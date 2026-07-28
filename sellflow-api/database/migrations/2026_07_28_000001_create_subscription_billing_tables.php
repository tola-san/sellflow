<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('subscription_plans', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->text('description')->nullable();
            $table->decimal('monthly_price', 10, 2);
            $table->decimal('yearly_price', 10, 2);
            $table->string('currency', 3)->default('USD');
            $table->json('limits');
            $table->json('features');
            $table->boolean('is_active')->default(true);
            $table->unsignedSmallInteger('sort_order')->default(0);
            $table->timestamps();
        });

        Schema::create('business_subscriptions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('business_id')->unique()->constrained()->cascadeOnDelete();
            $table->foreignId('subscription_plan_id')->constrained()->restrictOnDelete();
            $table->string('status')->default('trialing')->index();
            $table->string('billing_cycle')->nullable();
            $table->timestamp('trial_started_at')->nullable();
            $table->timestamp('trial_ends_at')->nullable()->index();
            $table->timestamp('current_period_start')->nullable();
            $table->timestamp('current_period_end')->nullable()->index();
            $table->boolean('cancel_at_period_end')->default(false);
            $table->timestamp('cancelled_at')->nullable();
            $table->string('provider')->nullable();
            $table->string('provider_subscription_id')->nullable()->unique();
            $table->timestamps();
        });

        Schema::create('subscription_payments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('business_subscription_id')->constrained()->cascadeOnDelete();
            $table->foreignId('business_id')->constrained()->cascadeOnDelete();
            $table->foreignId('subscription_plan_id')->constrained()->restrictOnDelete();
            $table->string('invoice_number')->unique();
            $table->decimal('amount', 10, 2);
            $table->string('currency', 3)->default('USD');
            $table->string('billing_cycle');
            $table->string('status')->default('pending')->index();
            $table->string('provider')->nullable();
            $table->string('provider_reference')->nullable()->unique();
            $table->timestamp('period_start')->nullable();
            $table->timestamp('period_end')->nullable();
            $table->timestamp('paid_at')->nullable();
            $table->json('metadata')->nullable();
            $table->timestamps();
        });

        $now = now();
        DB::table('subscription_plans')->insert([
            [
                'name' => 'Starter',
                'slug' => 'starter',
                'description' => 'Essential tools for a small business starting online.',
                'monthly_price' => 6,
                'yearly_price' => 60,
                'currency' => 'USD',
                'limits' => json_encode(['businesses' => 1, 'staff' => 1, 'products' => 100]),
                'features' => json_encode([
                    'inventory' => 'basic',
                    'telegram_notifications' => true,
                    'restaurant_qr' => false,
                    'analytics_history_days' => 30,
                    'custom_domain' => false,
                    'priority_support' => false,
                ]),
                'is_active' => true,
                'sort_order' => 1,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'name' => 'Growth',
                'slug' => 'growth',
                'description' => 'Advanced operations for a growing store or restaurant.',
                'monthly_price' => 12,
                'yearly_price' => 120,
                'currency' => 'USD',
                'limits' => json_encode(['businesses' => 1, 'staff' => 5, 'products' => null]),
                'features' => json_encode([
                    'inventory' => 'advanced',
                    'telegram_notifications' => true,
                    'restaurant_qr' => true,
                    'analytics_history_days' => 365,
                    'custom_domain' => false,
                    'priority_support' => false,
                ]),
                'is_active' => true,
                'sort_order' => 2,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'name' => 'Pro',
                'slug' => 'pro',
                'description' => 'Multiple businesses, unlimited insights, and priority support.',
                'monthly_price' => 25,
                'yearly_price' => 250,
                'currency' => 'USD',
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
                'created_at' => $now,
                'updated_at' => $now,
            ],
        ]);

        $growthPlanId = DB::table('subscription_plans')->where('slug', 'growth')->value('id');
        DB::table('businesses')->orderBy('id')->chunkById(100, function ($businesses) use ($growthPlanId, $now): void {
            DB::table('business_subscriptions')->insert(
                $businesses->map(fn ($business): array => [
                    'business_id' => $business->id,
                    'subscription_plan_id' => $growthPlanId,
                    'status' => 'trialing',
                    'trial_started_at' => $now,
                    'trial_ends_at' => $now->copy()->addDays(30),
                    'cancel_at_period_end' => false,
                    'created_at' => $now,
                    'updated_at' => $now,
                ])->all()
            );
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('subscription_payments');
        Schema::dropIfExists('business_subscriptions');
        Schema::dropIfExists('subscription_plans');
    }
};
