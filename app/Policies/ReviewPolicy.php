<?php

namespace App\Policies;

use App\Models\Booking;
use App\Models\Review;
use App\Models\User;

class ReviewPolicy
{
    public function create(User $user, Booking $booking): bool
    {
        // Only customer who booked and booking status is completed
        if ($booking->customer_id !== $user->id) return false;
        if ($booking->booking_status !== 'completed') return false;
        if ($booking->review()->exists()) return false;

        return true;
    }

    public function reply(User $user, Review $review): bool
    {
        return $user->photographerProfile && $user->photographerProfile->id === $review->photographer_profile_id;
    }

    public function moderate(User $user): bool
    {
        return $user->isAdmin();
    }
}
