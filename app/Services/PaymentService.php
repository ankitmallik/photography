<?php

namespace App\Services;

use App\Models\Booking;
use App\Models\Payment;
use App\Models\PhotographerEarning;
use App\Models\PlatformCommission;
use App\Models\Setting;
use App\Models\User;
use Exception;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class PaymentService
{
    /**
     * Process a simulated or Razorpay verified payment
     */
    public function recordPayment(
        Booking $booking,
        User $user,
        float $amount,
        string $paymentType = 'advance',
        string $gateway = 'razorpay',
        ?string $transactionId = null,
        array $gatewayResponse = []
    ): Payment {
        return DB::transaction(function () use ($booking, $user, $amount, $paymentType, $gateway, $transactionId, $gatewayResponse) {
            $txnId = $transactionId ?: ('PAY-' . strtoupper(Str::random(12)));

            // 1. Create Payment record
            $payment = Payment::create([
                'transaction_id' => $txnId,
                'booking_id' => $booking->id,
                'user_id' => $user->id,
                'amount' => $amount,
                'currency' => 'INR',
                'gateway' => $gateway,
                'payment_type' => $paymentType,
                'status' => 'successful',
                'gateway_response' => $gatewayResponse,
                'paid_at' => now(),
            ]);

            // 2. Update Booking paid_amount and payment_status
            $newPaidAmount = $booking->paid_amount + $amount;
            $booking->paid_amount = $newPaidAmount;

            if ($newPaidAmount >= $booking->gross_amount) {
                $booking->payment_status = 'paid';
            } elseif ($newPaidAmount > 0) {
                $booking->payment_status = 'partial';
            }

            // If paying advance on accepted booking, move to confirmed
            if ($booking->booking_status === 'accepted' && $paymentType === 'advance') {
                $booking->booking_status = 'confirmed';
                $booking->recordStatusChange('confirmed', $user->id, 'Advance payment received. Booking confirmed.');
                
                // Lock photographer calendar date
                app(BookingService::class)->lockPhotographerDate($booking);
            }

            $booking->save();

            // 3. Calculate Platform Commission (Configurable, default 10%)
            $commissionRate = (float) Setting::get('commission_percentage', 10.0);
            $commissionAmount = round(($amount * $commissionRate) / 100, 2);
            $photographerNetAmount = round($amount - $commissionAmount, 2);

            // Record Platform Commission
            PlatformCommission::create([
                'booking_id' => $booking->id,
                'payment_id' => $payment->id,
                'gross_amount' => $amount,
                'commission_percentage' => $commissionRate,
                'commission_amount' => $commissionAmount,
            ]);

            // Record Photographer Earning
            PhotographerEarning::create([
                'photographer_profile_id' => $booking->photographer_profile_id,
                'booking_id' => $booking->id,
                'payment_id' => $payment->id,
                'gross_amount' => $amount,
                'commission_rate' => $commissionRate,
                'commission_amount' => $commissionAmount,
                'net_amount' => $photographerNetAmount,
                'status' => 'available',
            ]);

            // Update photographer profile total bookings counter
            $photographer = $booking->photographer;
            if ($photographer) {
                $photographer->increment('total_bookings');
            }

            return $payment;
        });
    }
}
