<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PhotographerAvailability extends Model
{
    use HasFactory;

    protected $fillable = [
        'photographer_profile_id',
        'date',
        'status',
        'notes',
    ];

    protected $casts = [
        'date' => 'date',
    ];

    public function photographer(): BelongsTo
    {
        return $this->belongsTo(PhotographerProfile::class, 'photographer_profile_id');
    }
}
