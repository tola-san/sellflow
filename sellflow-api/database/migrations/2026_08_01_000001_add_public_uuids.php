<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;

return new class extends Migration
{
    /**
     * @var list<string>
     */
    private array $tables = ['businesses', 'products', 'orders'];

    public function up(): void
    {
        foreach ($this->tables as $tableName) {
            Schema::table($tableName, function (Blueprint $table): void {
                $table->uuid('uuid')->nullable()->after('id');
            });

            DB::table($tableName)
                ->select('id')
                ->whereNull('uuid')
                ->orderBy('id')
                ->chunkById(500, function ($records) use ($tableName): void {
                    foreach ($records as $record) {
                        DB::table($tableName)
                            ->where('id', $record->id)
                            ->update(['uuid' => (string) Str::uuid7()]);
                    }
                });

            Schema::table($tableName, function (Blueprint $table) use ($tableName): void {
                $table->unique('uuid', "{$tableName}_uuid_unique");
            });
        }
    }

    public function down(): void
    {
        foreach (array_reverse($this->tables) as $tableName) {
            Schema::table($tableName, function (Blueprint $table) use ($tableName): void {
                $table->dropUnique("{$tableName}_uuid_unique");
                $table->dropColumn('uuid');
            });
        }
    }
};
