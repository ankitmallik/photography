<?php

namespace App\Services;

use App\Models\Booking;
use App\Models\Coupon;
use App\Models\PhotographerAvailability;
use App\Models\PhotographerPackage;
use App\Models\PhotographerProfile;
use App\Models\User;
use Exception;
use Illuminate\Support\Facades\DB;

class BookingService
{
    /**
     * Calculate price securely on server side
     */
    public function calculatePricing(
        PhotographerProfile $photographer,
        ?PhotographerPackage $package,
        array $addons = [],
        ?string $couponCode = null,
        float $travelCharges = 0.0
    ): array {
        $packagePrice = $package ? (float) $package->price : (float) $photographer->starting_price;
        
        $addonsTotal = 0.0;
        foreach ($addons as $addon) {
            $addonsTotal += (float) ($addon['price'] ?? 0);
        }

        $subtotal = $packagePrice + $addonsTotal + $travelCharges;
        
        $discountAmount = 0.0;
        $coupon = null;
        if ($couponCode) {
            $coupon = Coupon::where('code', strtoupper(trim($couponCode)))->first();
            if ($coupon && $coupon->isValidForAmount($subtotal)) {
                $discountAmount = $coupon->calculateDiscount($subtotal);
            }
        }

        $grossAmount = max(0, $subtotal - $discountAmount);
        
        // 25% Advance by default
        $advancePercentage = (float) \App\Models\Setting::get('advance_percentage', 25);
        $advanceAmount = round(($grossAmount * $advancePercentage) / 100, 2);
        $remainingAmount = round($grossAmount - $advanceAmount, 2);

        return [
            'package_price' => $packagePrice,
            'addons_total' => $addonsTotal,
            'travel_charges' => $travelCharges,
            'subtotal' => $subtotal,
            'coupon_id' => $coupon ? $coupon->id : null,
            'discount_amount' => $discountAmount,
            'gross_amount' => $grossAmount,
            'advance_amount' => $advanceAmount,
            'remaining_amount' => $remainingAmount,
        ];
    }

    /**
     * Check if photographer is available on specified date
     */
    public function isDateAvailable(PhotographerProfile $photographer, string $date): bool
    {
        // 1. Check if date is explicitly booked or blocked in photographer_availabilities
        $blocked = PhotographerAvailability::where('photographer_profile_id', $photographer->id)
            ->where('date', $date)
            ->whereIn('status', ['booked', 'blocked'])
            ->exists();

        if ($blocked) {
            return false;
        }

        // 2. Check if there are active confirmed/in_progress bookings on this date
        $booked = Booking::where('photographer_profile_id', $photographer->id)
            ->where('event_date', $date)
            ->whereIn('booking_status', ['confirmed', 'in_progress'])
            ->exists();

        return !$booked;
    }

    /**
     * Create booking request with backend transaction and safety lock
     */
    public function createBookingRequest(User $customer, array $data): Booking
    {
        $photographer = PhotographerProfile::findOrFail($data['photographer_profile_id']);
        $eventDate = $data['event_date'];

        return DB::transaction(function () use ($customer, $photographer, $eventDate, $data) {
            // Validate availability
            if (!$this->isDateAvailable($photographer, $eventDate)) {
                throw new Exception('The selected photographer is not available on ' . $eventDate);
            }

            $package = isset($data['package_id']) && $data['package_id']
                ? PhotographerPackage::find($data['package_id'])
                : null;

            $pricing = $this->calculatePricing(
                $photographer,
                $package,
                $data['addons'] ?? [],
                $data['coupon_code'] ?? null,
                (float) ($data['travel_charges'] ?? 0)
            );

            $booking = Booking::create([
                'booking_number' => Booking::generateBookingNumber(),
                'customer_id' => $customer->id,
                'photographer_profile_id' => $photographer->id,
                'package_id' => $package ? $package->id : null,
                'event_type' => $data['event_type'],
                'event_date' => $eventDate,
                'start_time' => $data['start_time'] ?? null,
                'end_time' => $data['end_time'] ?? null,
                'event_location' => $data['event_location'],
                'city' => $data['city'] ?? $photographer->city ?? 'Unknown',
                'state' => $data['state'] ?? $photographer->state,
                'guest_count' => $data['guest_count'] ?? null,
                'package_price' => $pricing['package_price'],
                'addons_total' => $pricing['addons_total'],
                'travel_charges' => $pricing['travel_charges'],
                'coupon_id' => $pricing['coupon_id'],
                'discount_amount' => $pricing['discount_amount'],
                'gross_amount' => $pricing['gross_amount'],
                'advance_amount' => $pricing['advance_amount'],
                'remaining_amount' => $pricing['remaining_amount'],
                'paid_amount' => 0,
                'booking_status' => 'pending',
                'payment_status' => 'unpaid',
                'special_instructions' => $data['special_instructions'] ?? null,
            ]);

            // Save addons if any
            if (!empty($data['addons']) && is_array($data['addons'])) {
                foreach ($data['addons'] as $addon) {
                    if (!empty($addon['name'])) {
                        $booking->addons()->create([
                            'name' => $addon['name'],
                            'price' => (float) ($addon['price'] ?? 0),
                        ]);
                    }
                }
            }

            // Record initial history
            $booking->recordStatusChange('pending', $customer->id, 'Booking request submitted by customer.');

            // Update coupon used count if applicable
            if ($pricing['coupon_id']) {
                Coupon::where('id', $pricing['coupon_id'])->increment('used_count');
            }

            return $booking;
        });
    }

    /**
     * Mark date as booked when booking becomes confirmed
     */
    public function lockPhotographerDate(Booking $booking): void
    {
        PhotographerAvailability::updateOrCreate(
            [
                'photographer_profile_id' => $booking->photographer_profile_id,
                'date' => $booking->event_date,
            ],
            [
                'status' => 'booked',
                'notes' => 'Booked for #' . $booking->booking_number,
            ]
        );
    }
}
