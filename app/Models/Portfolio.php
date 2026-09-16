<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Portfolio extends Model
{
    use HasFactory;

    protected $fillable = [
        'photographer_profile_id',
        'category_id',
        'title',
        'slug',
        'description',
        'event_date',
        'cover_image',
        'is_featured',
        'is_approved',
        'view_count',
    ];

    protected $casts = [
        'event_date' => 'date',
        'is_featured' => 'boolean',
        'is_approved' => 'boolean',
        'view_count' => 'integer',
    ];

    public function photographer(): BelongsTo
    {
        return $this->belongsTo(PhotographerProfile::class, 'photographer_profile_id');
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function media(): HasMany
    {
        return $this->hasMany(PortfolioMedia::class)->orderBy('sort_order');
    }

    public function photos(): HasMany
    {
        return $this->hasMany(PortfolioMedia::class)->where('media_type', 'image')->orderBy('sort_order');
    }

    public function videos(): HasMany
    {
        return $this->hasMany(PortfolioMedia::class)->where('media_type', 'video')->orderBy('sort_order');
    }
}
