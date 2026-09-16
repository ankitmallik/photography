<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AdminBookingController extends Controller
{
    public function index(Request $request): Response
    {
        $query = Booking::with(['customer', 'photographer', 'package', 'payments'])->latest();

        if ($status = $request->input('booking_status')) {
            $query->where('booking_status', $status);
        }

        if ($paymentStatus = $request->input('payment_status')) {
            $query->where('payment_status', $paymentStatus);
        }

        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('booking_number', 'like', "%{$search}%")
                  ->orWhere('city', 'like', "%{$search}%")
                  ->orWhereHas('customer', function ($cq) use ($search) {
                      $cq->where('name', 'like', "%{$search}%")->orWhere('email', 'like', "%{$search}%");
                  })
                  ->orWhereHas('photographer', function ($pq) use ($search) {
                      $pq->where('business_name', 'like', "%{$search}%");
                  });
            });
        }

        $bookings = $query->paginate(15)->withQueryString();

        return Inertia::render('Admin/Bookings', [
            'bookings' => $bookings,
            'filters' => $request->all(),
        ]);
    }

    public function show(int $id): Response
    {
        $booking = Booking::with([
            'customer',
            'photographer.bankAccounts',
            'package',
            'addons',
            'coupon',
            'statusHistories.changedByUser',
            'payments.user',
            'earnings',
            'commission',
            'review',
        ])->findOrFail($id);

        return Inertia::render('Admin/BookingDetail', [
            'booking' => $booking,
        ]);
    }

    public function updateStatus(Request $request, int $id)
    {
        $booking = Booking::findOrFail($id);

        $request->validate([
            'status' => 'required|in:pending,accepted,rejected,confirmed,in_progress,completed,cancelled',
            'notes' => 'nullable|string',
        ]);

        $booking->recordStatusChange($request->input('status'), auth()->id(), $request->input('notes'));

        return back()->with('success', 'Booking status changed to ' . $booking->booking_status);
    }
}
