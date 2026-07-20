<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('business_telegram_destinations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('business_id')->constrained()->cascadeOnDelete();
            $table->string('telegram_chat_id')->unique();
            $table->string('telegram_chat_name');
            $table->string('telegram_chat_type', 32);
            $table->string('purpose', 32);
            $table->boolean('is_active')->default(true);
            $table->boolean('bot_is_admin')->default(false);
            $table->json('settings')->nullable();
            $table->timestamp('connected_at');
            $table->timestamps();

            $table->unique(['business_id', 'purpose']);
        });

        Schema::table('telegram_connection_codes', function (Blueprint $table) {
            $table->string('purpose', 32)->default('staff_group')->after('business_id');
        });
    }

    public function down(): void
    {
        Schema::table('telegram_connection_codes', fn (Blueprint $table) => $table->dropColumn('purpose'));
        Schema::dropIfExists('business_telegram_destinations');
    }
};
