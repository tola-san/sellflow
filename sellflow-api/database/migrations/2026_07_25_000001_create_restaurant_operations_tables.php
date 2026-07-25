<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->string('availability_status', 20)->default('always')->after('is_active');
        });

        Schema::create('product_availability_schedules', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->constrained()->cascadeOnDelete();
            $table->string('name', 50);
            $table->json('days');
            $table->time('start_time');
            $table->time('end_time');
            $table->boolean('is_active')->default(true);
            $table->unsignedInteger('sort_order')->default(0);
            $table->timestamps();
        });

        Schema::create('restaurant_tables', function (Blueprint $table) {
            $table->id();
            $table->foreignId('business_id')->constrained()->cascadeOnDelete();
            $table->string('name', 80);
            $table->string('area', 80)->nullable();
            $table->unsignedSmallInteger('capacity')->default(2);
            $table->string('status', 20)->default('available');
            $table->string('qr_token', 64)->unique();
            $table->boolean('is_active')->default(true);
            $table->unsignedInteger('sort_order')->default(0);
            $table->timestamps();

            $table->unique(['business_id', 'name']);
            $table->index(['business_id', 'status']);
        });

        Schema::table('orders', function (Blueprint $table) {
            $table->foreignId('restaurant_table_id')->nullable()->after('business_id')
                ->constrained('restaurant_tables')->nullOnDelete();
            $table->string('order_type', 20)->default('delivery')->after('restaurant_table_id');
        });
    }

    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropConstrainedForeignId('restaurant_table_id');
            $table->dropColumn('order_type');
        });
        Schema::dropIfExists('restaurant_tables');
        Schema::dropIfExists('product_availability_schedules');
        Schema::table('products', function (Blueprint $table) {
            $table->dropColumn('availability_status');
        });
    }
};
