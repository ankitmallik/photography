<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PlatformCommission extends Model
{
    use HasFactory;

    protected $fillable = [
        'booking_id',
        'payment_id',
        'gross_amount',
        'commission_percentage',
        'commission_amount',
    ];

    protected $casts = [
        'gross_amount' => 'decimal:2',
        'commission_percentage' => 'decimal:2',
        'commission_amount' => 'decimal:2',
    ];

    public function booking(): BelongsTo
    {
        return $this->belongsTo(Booking::class);
    }

    public function payment(): BelongsTo
    {
        return $this->belongsTo(Payment::class);
    }
}
