<?php

namespace App\Policies;

use App\Models\PhotographerProfile;
use App\Models\User;

class PhotographerProfilePolicy
{
    public function update(User $user, PhotographerProfile $profile): bool
    {
        return $user->isAdmin() || $user->id === $profile->user_id;
    }

    public function manage(User $user, PhotographerProfile $profile): bool
    {
        return $user->isAdmin() || $user->id === $profile->user_id;
    }
}
