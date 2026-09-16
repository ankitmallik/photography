<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class PhotographerPackage extends Model
{
    use HasFactory;

    protected $fillable = [
        'photographer_profile_id',
        'name',
        'slug',
        'description',
        'price',
        'duration_hours',
        'photographer_count',
        'videographer_count',
        'edited_photos_count',
        'raw_photos_included',
        'video_duration_minutes',
        'cinematic_video',
        'drone',
        'album',
        'album_pages',
        'travel_included',
        'features',
        'is_active',
        'sort_order',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'duration_hours' => 'integer',
        'photographer_count' => 'integer',
        'videographer_count' => 'integer',
        'edited_photos_count' => 'integer',
        'raw_photos_included' => 'boolean',
        'video_duration_minutes' => 'integer',
        'cinematic_video' => 'boolean',
        'drone' => 'boolean',
        'album' => 'boolean',
        'album_pages' => 'integer',
        'travel_included' => 'boolean',
        'features' => 'array',
        'is_active' => 'boolean',
        'sort_order' => 'integer',
    ];

    public function photographer(): BelongsTo
    {
        return $this->belongsTo(PhotographerProfile::class, 'photographer_profile_id');
    }

    public function bookings(): HasMany
    {
        return $this->hasMany(Booking::class, 'package_id');
    }
}
