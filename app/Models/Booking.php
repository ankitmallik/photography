<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;

class Booking extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'booking_number',
        'customer_id',
        'photographer_profile_id',
        'package_id',
        'event_type',
        'event_date',
        'start_time',
        'end_time',
        'event_location',
        'city',
        'state',
        'guest_count',
        'package_price',
        'addons_total',
        'travel_charges',
        'coupon_id',
        'discount_amount',
        'gross_amount',
        'advance_amount',
        'remaining_amount',
        'paid_amount',
        'booking_status',
        'payment_status',
        'special_instructions',
        'rejection_reason',
        'cancellation_reason',
    ];

    protected $casts = [
        'event_date' => 'date',
        'guest_count' => 'integer',
        'package_price' => 'decimal:2',
        'addons_total' => 'decimal:2',
        'travel_charges' => 'decimal:2',
        'discount_amount' => 'decimal:2',
        'gross_amount' => 'decimal:2',
        'advance_amount' => 'decimal:2',
        'remaining_amount' => 'decimal:2',
        'paid_amount' => 'decimal:2',
        'deleted_at' => 'datetime',
    ];

    public static function generateBookingNumber(): string
    {
        $year = date('Y');
        $lastBooking = self::whereYear('created_at', $year)->latest('id')->first();
        $nextNum = $lastBooking ? ($lastBooking->id + 1) : 1;
        return sprintf('BK-%s-%06d', $year, $nextNum);
    }

    public function customer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'customer_id');
    }

    public function photographer(): BelongsTo
    {
        return $this->belongsTo(PhotographerProfile::class, 'photographer_profile_id');
    }

    public function package(): BelongsTo
    {
        return $this->belongsTo(PhotographerPackage::class, 'package_id');
    }

    public function coupon(): BelongsTo
    {
        return $this->belongsTo(Coupon::class);
    }

    public function addons(): HasMany
    {
        return $this->hasMany(BookingAddon::class);
    }

    public function statusHistories(): HasMany
    {
        return $this->hasMany(BookingStatusHistory::class)->latest();
    }

    public function payments(): HasMany
    {
        return $this->hasMany(Payment::class)->latest();
    }

    public function earnings(): HasMany
    {
        return $this->hasMany(PhotographerEarning::class);
    }

    public function commission(): HasOne
    {
        return $this->hasOne(PlatformCommission::class);
    }

    public function review(): HasOne
    {
        return $this->hasOne(Review::class);
    }

    public function conversation(): HasOne
    {
        return $this->hasOne(Conversation::class);
    }

    public function recordStatusChange(string $newStatus, ?int $changedByUserId = null, ?string $notes = null): void
    {
        $oldStatus = $this->booking_status;
        $this->booking_status = $newStatus;
        $this->save();

        $this->statusHistories()->create([
            'old_status' => $oldStatus,
            'new_status' => $newStatus,
            'changed_by_user_id' => $changedByUserId,
            'notes' => $notes,
        ]);
    }
}
