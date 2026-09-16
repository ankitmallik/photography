<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Payout extends Model
{
    use HasFactory;

    protected $fillable = [
        'photographer_profile_id',
        'amount',
        'payout_method',
        'payout_account_details',
        'status',
        'admin_notes',
        'transaction_reference',
        'requested_at',
        'processed_at',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'payout_account_details' => 'array',
        'requested_at' => 'datetime',
        'processed_at' => 'datetime',
    ];

    public function photographer(): BelongsTo
    {
        return $this->belongsTo(PhotographerProfile::class, 'photographer_profile_id');
    }
}
