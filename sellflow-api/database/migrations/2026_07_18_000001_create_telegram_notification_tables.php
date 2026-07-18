<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('business_notification_settings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('business_id')->unique()->constrained()->cascadeOnDelete();
            $table->string('telegram_chat_id')->nullable()->index();
            $table->string('telegram_chat_name')->nullable();
            $table->boolean('telegram_enabled')->default(false);
            $table->boolean('new_order_enabled')->default(true);
            $table->boolean('payment_enabled')->default(true);
            $table->timestamp('connected_at')->nullable();
            $table->timestamps();
        });

        Schema::create('telegram_connection_codes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('business_id')->constrained()->cascadeOnDelete();
            $table->char('code_hash', 64)->unique();
            $table->timestamp('expires_at')->index();
            $table->timestamp('used_at')->nullable();
            $table->timestamps();

            $table->index(['business_id', 'used_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('telegram_connection_codes');
        Schema::dropIfExists('business_notification_settings');
    }
};
