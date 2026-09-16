<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Category extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'icon',
        'image',
        'description',
        'is_active',
        'sort_order',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'sort_order' => 'integer',
    ];

    public function photographers(): BelongsToMany
    {
        return $this->belongsToMany(PhotographerProfile::class, 'category_photographer');
    }

    public function services(): HasMany
    {
        return $this->hasMany(PhotographerService::class);
    }

    public function portfolios(): HasMany
    {
        return $this->hasMany(Portfolio::class);
    }
}
