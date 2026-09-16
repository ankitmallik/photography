<?php

namespace App\Policies;

use App\Models\Payout;
use App\Models\User;

class PayoutPolicy
{
    public function view(User $user, Payout $payout): bool
    {
        if ($user->isAdmin()) return true;
        return $user->photographerProfile && $user->photographerProfile->id === $payout->photographer_profile_id;
    }
}
