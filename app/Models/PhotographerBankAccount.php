<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PhotographerBankAccount extends Model
{
    use HasFactory;

    protected $fillable = [
        'photographer_profile_id',
        'account_holder_name',
        'account_number',
        'ifsc_code',
        'bank_name',
        'upi_id',
        'is_primary',
    ];

    protected $casts = [
        'is_primary' => 'boolean',
    ];

    public function photographer(): BelongsTo
    {
        return $this->belongsTo(PhotographerProfile::class, 'photographer_profile_id');
    }
}
