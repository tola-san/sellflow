<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Business extends Model
{
    // The attributes that are mass assignable.
    use HasFactory;

    protected $fillable = [
        'user_id',
        'name',
        'slug',
        'description',
        'email',
        'phone',
        'website',
        'logo',
        'banner',
        'address',
        'city',
        'country',
        'primary_color',
        'secondary_color',
        'is_active'
    ];


    protected $casts = [
        'is_active' => 'boolean',
    ];  

    /**
     * Business belongs to one user.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

}
