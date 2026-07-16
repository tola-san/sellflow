<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        $this->consolidateDuplicateBusinesses();

        Schema::table('businesses', function (Blueprint $table) {
            $table->unique('user_id', 'businesses_user_id_unique');
        });

        Schema::table('categories', function (Blueprint $table) {
            $table->index(['business_id', 'is_active', 'sort_order'], 'categories_storefront_index');
        });

        Schema::table('products', function (Blueprint $table) {
            $table->index(['business_id', 'is_active', 'category_id'], 'products_storefront_index');
        });
    }

    /**
     * Preserve existing catalog data before enforcing one business per user.
     * The oldest business remains primary; duplicate catalogs are merged into it.
     */
    private function consolidateDuplicateBusinesses(): void
    {
        $duplicateUserIds = DB::table('businesses')
            ->select('user_id')
            ->groupBy('user_id')
            ->havingRaw('COUNT(*) > 1')
            ->pluck('user_id');

        foreach ($duplicateUserIds as $userId) {
            $businessIds = DB::table('businesses')
                ->where('user_id', $userId)
                ->orderBy('id')
                ->pluck('id');

            $primaryBusinessId = $businessIds->shift();

            foreach ($businessIds as $duplicateBusinessId) {
                DB::transaction(function () use ($primaryBusinessId, $duplicateBusinessId): void {
                    $this->makeCategorySlugsUnique($primaryBusinessId, $duplicateBusinessId);
                    $this->makeProductIdentifiersUnique($primaryBusinessId, $duplicateBusinessId);

                    DB::table('categories')
                        ->where('business_id', $duplicateBusinessId)
                        ->update(['business_id' => $primaryBusinessId]);

                    DB::table('products')
                        ->where('business_id', $duplicateBusinessId)
                        ->update(['business_id' => $primaryBusinessId]);

                    // Related catalog rows have been preserved on the primary business.
                    DB::table('businesses')->where('id', $duplicateBusinessId)->delete();
                });
            }
        }
    }

    private function makeCategorySlugsUnique(int $primaryBusinessId, int $duplicateBusinessId): void
    {
        $categories = DB::table('categories')
            ->where('business_id', $duplicateBusinessId)
            ->get(['id', 'slug']);

        foreach ($categories as $category) {
            if (! DB::table('categories')->where('business_id', $primaryBusinessId)->where('slug', $category->slug)->exists()) {
                continue;
            }

            $slug = $this->uniqueValue(
                'categories',
                'slug',
                $category->slug,
                $duplicateBusinessId,
                $primaryBusinessId,
                255
            );

            DB::table('categories')->where('id', $category->id)->update(['slug' => $slug]);
        }
    }

    private function makeProductIdentifiersUnique(int $primaryBusinessId, int $duplicateBusinessId): void
    {
        $products = DB::table('products')
            ->where('business_id', $duplicateBusinessId)
            ->get(['id', 'slug', 'sku']);

        foreach ($products as $product) {
            $updates = [];

            if (DB::table('products')->where('business_id', $primaryBusinessId)->where('slug', $product->slug)->exists()) {
                $updates['slug'] = $this->uniqueValue(
                    'products',
                    'slug',
                    $product->slug,
                    $duplicateBusinessId,
                    $primaryBusinessId,
                    255
                );
            }

            if ($product->sku !== null && DB::table('products')->where('business_id', $primaryBusinessId)->where('sku', $product->sku)->exists()) {
                $updates['sku'] = $this->uniqueValue(
                    'products',
                    'sku',
                    $product->sku,
                    $duplicateBusinessId,
                    $primaryBusinessId,
                    100
                );
            }

            if ($updates !== []) {
                DB::table('products')->where('id', $product->id)->update($updates);
            }
        }
    }

    private function uniqueValue(
        string $table,
        string $column,
        string $original,
        int $legacyBusinessId,
        int $primaryBusinessId,
        int $maxLength
    ): string {
        $attempt = 0;

        do {
            $suffix = '-legacy-'.$legacyBusinessId.($attempt > 0 ? '-'.$attempt : '');
            $candidate = mb_substr($original, 0, $maxLength - mb_strlen($suffix)).$suffix;
            $attempt++;
        } while (DB::table($table)
            ->whereIn('business_id', [$primaryBusinessId, $legacyBusinessId])
            ->where($column, $candidate)
            ->exists());

        return $candidate;
    }

    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->dropIndex('products_storefront_index');
        });

        Schema::table('categories', function (Blueprint $table) {
            $table->dropIndex('categories_storefront_index');
        });

        Schema::table('businesses', function (Blueprint $table) {
            $table->dropUnique('businesses_user_id_unique');
        });
    }
};
