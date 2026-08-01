<?php

namespace App\Models;

use App\Models\Concerns\HasPublicUuid;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class Product extends Model
{
    use HasFactory, HasPublicUuid;

    protected $fillable = [
        'business_id',
        'category_id',
        'name',
        'slug',
        'sku',
        'description',
        'price',
        'discount_price',
        'stock',
        'low_stock_threshold',
        'thumbnail',
        'is_featured',
        'is_active',
        'availability_status',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'discount_price' => 'decimal:2',
        'stock' => 'integer',
        'low_stock_threshold' => 'integer',
        'is_featured' => 'boolean',
        'is_active' => 'boolean',
    ];

    public function business()
    {
        return $this->belongsTo(Business::class);
    }

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function modifierGroups(): BelongsToMany
    {
        return $this->belongsToMany(ModifierGroup::class)
            ->orderBy('modifier_groups.sort_order')
            ->orderBy('modifier_groups.id');
    }

    public function availabilitySchedules()
    {
        return $this->hasMany(ProductAvailabilitySchedule::class)->orderBy('sort_order')->orderBy('id');
    }

    public function variants(): HasMany
    {
        return $this->hasMany(ProductVariant::class)
            ->orderBy('sort_order')
            ->orderBy('id');
    }

    public function inventoryMovements(): HasMany
    {
        return $this->hasMany(InventoryMovement::class);
    }

    public function syncVariantStock(): void
    {
        $this->update([
            'stock' => (int) $this->variants()->where('is_active', true)->sum('stock'),
        ]);
    }

    public function isAvailableNow(): bool
    {
        if (! $this->is_active || $this->stock < 1 || in_array($this->availability_status, ['sold_out', 'hidden'], true)) {
            return false;
        }

        if ($this->availability_status !== 'scheduled') {
            return true;
        }

        $now = now();

        return $this->availabilitySchedules->contains(
            fn (ProductAvailabilitySchedule $schedule) => $schedule->isAvailableAt($now)
        );
    }

    public function thumbnailUrl(): ?string
    {
        if (! $this->thumbnail) {
            return null;
        }

        if (Str::startsWith($this->thumbnail, ['http://', 'https://', 'data:', '/storage/'])) {
            return $this->thumbnail;
        }

        $disk = config('product_images.disk', 'public');

        // Cloudinary assets are stored as complete secure URLs. A relative
        // value here belongs to the old ephemeral public disk and can no
        // longer be resolved after switching providers.
        if ($disk === 'cloudinary') {
            return null;
        }

        return Storage::disk($disk)->url($this->thumbnail);
    }
}
