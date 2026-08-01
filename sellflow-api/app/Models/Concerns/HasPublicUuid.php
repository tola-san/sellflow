<?php

namespace App\Models\Concerns;

use Illuminate\Support\Str;

trait HasPublicUuid
{
    public static function bootHasPublicUuid(): void
    {
        static::creating(function ($model): void {
            if (blank($model->uuid)) {
                $model->uuid = (string) Str::uuid7();
            }
        });
    }

    public function resolveRouteBindingQuery($query, $value, $field = null)
    {
        $bindingField = $field ?? (Str::isUuid($value) ? 'uuid' : $this->getRouteKeyName());

        return $query->where($bindingField, $value);
    }
}
