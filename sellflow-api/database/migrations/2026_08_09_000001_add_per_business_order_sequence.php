<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('businesses', function (Blueprint $table) {
            $table->unsignedBigInteger('next_order_number')->default(1);
        });

        Schema::table('orders', function (Blueprint $table) {
            $table->dropUnique('orders_order_number_unique');
            $table->unique(
                ['business_id', 'order_number'],
                'orders_business_order_number_unique'
            );
        });
    }

    public function down(): void
    {
        // Restore globally unique values before restoring the original index.
        DB::table('orders')
            ->select('id')
            ->orderBy('id')
            ->chunkById(500, function ($orders): void {
                foreach ($orders as $order) {
                    DB::table('orders')
                        ->where('id', $order->id)
                        ->update(['order_number' => 'SF-'.$order->id]);
                }
            });

        Schema::table('orders', function (Blueprint $table) {
            $table->dropUnique('orders_business_order_number_unique');
            $table->unique('order_number');
        });

        Schema::table('businesses', function (Blueprint $table) {
            $table->dropColumn('next_order_number');
        });
    }
};
