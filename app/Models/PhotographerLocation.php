<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PhotographerLocation extends Model
{
    use HasFactory;

    protected $fillable = [
        'photographer_profile_id',
        'city',
        'state',
        'is_primary',
        'travel_fee_per_km',
    ];

    protected $casts = [
        'is_primary' => 'boolean',
        'travel_fee_per_km' => 'decimal:2',
    ];

    public function photographer(): BelongsTo
    {
        return $this->belongsTo(PhotographerProfile::class, 'photographer_profile_id');
    }
}
