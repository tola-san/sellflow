<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('businesses', function (Blueprint $table) {
            $table->string('theme_preset', 32)->default('modern')->after('secondary_color');
            $table->json('theme_settings')->nullable()->after('theme_preset');
        });
    }

    public function down(): void
    {
        Schema::table('businesses', function (Blueprint $table) {
            $table->dropColumn(['theme_preset', 'theme_settings']);
        });
    }
};
