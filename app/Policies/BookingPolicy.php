<?php

namespace App\Policies;

use App\Models\Booking;
use App\Models\User;

class BookingPolicy
{
    public function view(User $user, Booking $booking): bool
    {
        if ($user->isAdmin()) return true;
        if ($user->id === $booking->customer_id) return true;
        if ($user->photographerProfile && $user->photographerProfile->id === $booking->photographer_profile_id) return true;

        return false;
    }

    public function updateStatus(User $user, Booking $booking): bool
    {
        if ($user->isAdmin()) return true;
        if ($user->photographerProfile && $user->photographerProfile->id === $booking->photographer_profile_id) return true;

        return false;
    }

    public function cancel(User $user, Booking $booking): bool
    {
        if ($user->isAdmin()) return true;
        if ($user->id === $booking->customer_id && in_array($booking->booking_status, ['pending', 'accepted'])) return true;
        if ($user->photographerProfile && $user->photographerProfile->id === $booking->photographer_profile_id) return true;

        return false;
    }
}
