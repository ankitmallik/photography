<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Coupon extends Model
{
    use HasFactory;

    protected $fillable = [
        'code',
        'discount_type',
        'discount_value',
        'min_booking_amount',
        'max_discount_amount',
        'usage_limit',
        'used_count',
        'start_date',
        'end_date',
        'is_active',
    ];

    protected $casts = [
        'discount_value' => 'decimal:2',
        'min_booking_amount' => 'decimal:2',
        'max_discount_amount' => 'decimal:2',
        'usage_limit' => 'integer',
        'used_count' => 'integer',
        'start_date' => 'date',
        'end_date' => 'date',
        'is_active' => 'boolean',
    ];

    public function isValidForAmount(float $amount): bool
    {
        if (!$this->is_active) return false;
        if ($this->usage_limit !== null && $this->used_count >= $this->usage_limit) return false;
        if ($this->start_date && now()->lt($this->start_date)) return false;
        if ($this->end_date && now()->gt($this->end_date)) return false;
        if ($amount < $this->min_booking_amount) return false;

        return true;
    }

    public function calculateDiscount(float $amount): float
    {
        if (!$this->isValidForAmount($amount)) return 0.0;

        if ($this->discount_type === 'percentage') {
            $discount = ($amount * $this->discount_value) / 100;
            if ($this->max_discount_amount) {
                $discount = min($discount, $this->max_discount_amount);
            }
            return round($discount, 2);
        }

        return min($this->discount_value, $amount);
    }

    public function bookings(): HasMany
    {
        return $this->hasMany(Booking::class);
    }
}
