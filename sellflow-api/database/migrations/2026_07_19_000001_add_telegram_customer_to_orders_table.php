<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->string('telegram_user_id', 32)->nullable()->after('customer_email')->index();
            $table->string('telegram_chat_id', 32)->nullable()->after('telegram_user_id');
            $table->string('telegram_username')->nullable()->after('telegram_chat_id');
            $table->boolean('telegram_notifications_enabled')->default(false)->after('telegram_username');
            $table->timestamp('telegram_receipt_sent_at')->nullable()->after('telegram_notifications_enabled');
            $table->string('telegram_last_notified_status', 32)->nullable()->after('telegram_receipt_sent_at');
            $table->timestamp('telegram_last_notification_sent_at')->nullable()->after('telegram_last_notified_status');
        });
    }

    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropIndex(['telegram_user_id']);
            $table->dropColumn([
                'telegram_user_id',
                'telegram_chat_id',
                'telegram_username',
                'telegram_notifications_enabled',
                'telegram_receipt_sent_at',
                'telegram_last_notified_status',
                'telegram_last_notification_sent_at',
            ]);
        });
    }
};
