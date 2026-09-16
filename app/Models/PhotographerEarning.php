<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PhotographerEarning extends Model
{
    use HasFactory;

    protected $fillable = [
        'photographer_profile_id',
        'booking_id',
        'payment_id',
        'gross_amount',
        'commission_rate',
        'commission_amount',
        'net_amount',
        'status',
    ];

    protected $casts = [
        'gross_amount' => 'decimal:2',
        'commission_rate' => 'decimal:2',
        'commission_amount' => 'decimal:2',
        'net_amount' => 'decimal:2',
    ];

    public function photographer(): BelongsTo
    {
        return $this->belongsTo(PhotographerProfile::class, 'photographer_profile_id');
    }

    public function booking(): BelongsTo
    {
        return $this->belongsTo(Booking::class);
    }

    public function payment(): BelongsTo
    {
        return $this->belongsTo(Payment::class);
    }
}
