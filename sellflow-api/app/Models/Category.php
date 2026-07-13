<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use  Illuminate\Database\Eloquent\Factories\HasFactory;

class Category extends Model
{
    // use 
    use HasFactory;

    protected $fillable = [
        'business_id',
        'name',
        'slug',
        'description',
        'image',
        'sort_order',
        'is_active'
    ];

    protected $casts = [
        'is_active' => 'boolean',
         'sort_order' => 'integer'
    ];

    /**
     * Get the business that owns the category.
     */
    public function business() {
        
        return $this->belongsTo(Business::class);
    }

    /**
     * Category has many products.
     */
    public function products()
    {
        return $this->hasMany(Product::class);
    }
}
