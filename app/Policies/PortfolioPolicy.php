<?php

namespace App\Policies;

use App\Models\Portfolio;
use App\Models\User;

class PortfolioPolicy
{
    public function manage(User $user, Portfolio $portfolio): bool
    {
        if ($user->isAdmin()) return true;
        return $user->photographerProfile && $user->photographerProfile->id === $portfolio->photographer_profile_id;
    }
}
