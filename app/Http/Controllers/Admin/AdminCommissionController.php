<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\PlatformCommission;
use App\Models\Setting;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AdminCommissionController extends Controller
{
    public function index(Request $request): Response
    {
        $commissions = PlatformCommission::with(['booking.photographer', 'booking.customer', 'payment'])
            ->latest()
            ->paginate(15);

        $totalCommissionEarned = PlatformCommission::sum('commission_amount');
        $currentRate = Setting::get('commission_percentage', '10');

        return Inertia::render('Admin/Commissions', [
            'commissions' => $commissions,
            'totalCommissionEarned' => (float) $totalCommissionEarned,
            'currentRate' => (float) $currentRate,
        ]);
    }

    public function updateRate(Request $request)
    {
        $data = $request->validate([
            'commission_percentage' => 'required|numeric|min:0|max:100',
        ]);

        Setting::set('commission_percentage', (string) $data['commission_percentage'], 'finance');

        return back()->with('success', 'Platform Commission rate updated to ' . $data['commission_percentage'] . '%');
    }
}
