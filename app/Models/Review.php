<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Review extends Model
{
    use HasFactory;

    protected $fillable = [
        'booking_id',
        'customer_id',
        'photographer_profile_id',
        'rating',
        'review_text',
        'photographer_reply',
        'replied_at',
        'is_approved',
    ];

    protected $casts = [
        'rating' => 'integer',
        'replied_at' => 'datetime',
        'is_approved' => 'boolean',
    ];

    public function booking(): BelongsTo
    {
        return $this->belongsTo(Booking::class);
    }

    public function customer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'customer_id');
    }

    public function photographer(): BelongsTo
    {
        return $this->belongsTo(PhotographerProfile::class, 'photographer_profile_id');
    }
}
