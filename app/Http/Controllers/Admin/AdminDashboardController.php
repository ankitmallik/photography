<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Payment;
use App\Models\Payout;
use App\Models\PhotographerProfile;
use App\Models\PlatformCommission;
use App\Models\Report;
use App\Models\Review;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class AdminDashboardController extends Controller
{
    public function dashboard(): Response
    {
        $totalCustomers = User::where('role', 'customer')->count();
        $totalPhotographers = PhotographerProfile::count();
        $pendingApprovals = PhotographerProfile::where('verification_status', 'pending')->count();
        $totalBookings = Booking::count();
        $pendingBookings = Booking::where('booking_status', 'pending')->count();
        $completedBookings = Booking::where('booking_status', 'completed')->count();
        
        $totalRevenue = Payment::where('status', 'successful')->sum('amount');
        $platformCommission = PlatformCommission::sum('commission_amount');
        $pendingPayoutsCount = Payout::where('status', 'pending')->count();
        $pendingReportsCount = Report::where('status', 'pending')->count();

        // Recent Bookings
        $recentBookings = Booking::with(['customer', 'photographer', 'package'])
            ->latest()
            ->take(5)
            ->get();

        // Pending Photographers
        $pendingPhotographers = PhotographerProfile::where('verification_status', 'pending')
            ->with(['user', 'categories'])
            ->latest()
            ->take(5)
            ->get();

        // Recent Payments
        $recentPayments = Payment::with(['booking', 'user'])
            ->latest()
            ->take(5)
            ->get();

        // Monthly Stats (Last 6 Months)
        $monthlyRevenue = Payment::where('status', 'successful')
            ->where('created_at', '>=', now()->subMonths(6))
            ->selectRaw('DATE_FORMAT(created_at, "%Y-%m") as month, SUM(amount) as revenue, count(*) as count')
            ->groupBy('month')
            ->orderBy('month')
            ->get();

        return Inertia::render('Admin/Dashboard', [
            'metrics' => [
                'total_customers' => $totalCustomers,
                'total_photographers' => $totalPhotographers,
                'pending_approvals' => $pendingApprovals,
                'total_bookings' => $totalBookings,
                'pending_bookings' => $pendingBookings,
                'completed_bookings' => $completedBookings,
                'total_revenue' => (float) $totalRevenue,
                'platform_commission' => (float) $platformCommission,
                'pending_payouts' => $pendingPayoutsCount,
                'pending_reports' => $pendingReportsCount,
            ],
            'recentBookings' => $recentBookings,
            'pendingPhotographers' => $pendingPhotographers,
            'recentPayments' => $recentPayments,
            'monthlyRevenue' => $monthlyRevenue,
        ]);
    }
}
