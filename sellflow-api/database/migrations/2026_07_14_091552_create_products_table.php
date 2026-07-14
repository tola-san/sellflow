<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();

            $table->foreignId('business_id')
                ->constrained()
                ->cascadeOnDelete();

            $table->foreignId('category_id')
                ->constrained()
                ->cascadeOnDelete();

            $table->string('name');

            $table->string('slug');

            $table->string('sku')
                ->nullable();

            $table->text('description')
                ->nullable();

            $table->decimal('price', 10, 2);

            $table->decimal('discount_price', 10, 2)
                ->nullable();

            $table->unsignedInteger('stock')
                ->default(0);

            $table->string('thumbnail')
                ->nullable();

            $table->boolean('is_featured')
                ->default(false);

            $table->boolean('is_active')
                ->default(true);

            $table->timestamps();

            $table->unique([
                'business_id',
                'slug',
            ]);

            $table->unique([
                'business_id',
                'sku',
            ]);

            $table->index([
                'business_id',
                'category_id',
                'is_active',
            ]);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};