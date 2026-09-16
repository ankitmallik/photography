<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class FeaturedPhotographer extends Model
{
    use HasFactory;

    protected $fillable = [
        'photographer_profile_id',
        'start_date',
        'end_date',
        'priority',
        'is_active',
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
        'priority' => 'integer',
        'is_active' => 'boolean',
    ];

    public function photographer(): BelongsTo
    {
        return $this->belongsTo(PhotographerProfile::class, 'photographer_profile_id');
    }
}
