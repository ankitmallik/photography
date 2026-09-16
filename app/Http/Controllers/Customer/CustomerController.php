<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Conversation;
use App\Models\Favorite;
use App\Models\Message;
use App\Models\PhotographerProfile;
use App\Models\Review;
use App\Services\BookingService;
use App\Services\PaymentService;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class CustomerController extends Controller
{
    public function dashboard(): Response
    {
        $user = auth()->user();

        $totalBookings = Booking::where('customer_id', $user->id)->count();
        $upcomingBookingsCount = Booking::where('customer_id', $user->id)
            ->whereIn('booking_status', ['confirmed', 'accepted'])
            ->where('event_date', '>=', now()->toDateString())
            ->count();
        $completedBookingsCount = Booking::where('customer_id', $user->id)
            ->where('booking_status', 'completed')
            ->count();
        $pendingRequestsCount = Booking::where('customer_id', $user->id)
            ->where('booking_status', 'pending')
            ->count();

        $recentBookings = Booking::where('customer_id', $user->id)
            ->with(['photographer', 'package'])
            ->latest()
            ->take(5)
            ->get();

        $favorites = Favorite::where('customer_id', $user->id)
            ->with('photographer.categories')
            ->latest()
            ->take(4)
            ->get();

        return Inertia::render('Customer/Dashboard', [
            'metrics' => [
                'total_bookings' => $totalBookings,
                'upcoming_bookings' => $upcomingBookingsCount,
                'completed_bookings' => $completedBookingsCount,
                'pending_requests' => $pendingRequestsCount,
            ],
            'recentBookings' => $recentBookings,
            'favorites' => $favorites,
        ]);
    }

    public function bookings(Request $request): Response
    {
        $user = auth()->user();
        $query = Booking::where('customer_id', $user->id)
            ->with(['photographer', 'package', 'review', 'payments'])
            ->latest();

        if ($status = $request->input('status')) {
            $query->where('booking_status', $status);
        }

        $bookings = $query->paginate(10)->withQueryString();

        return Inertia::render('Customer/Bookings', [
            'bookings' => $bookings,
            'currentStatus' => $request->input('status', 'all'),
        ]);
    }

    public function showBooking(int $id): Response
    {
        $user = auth()->user();
        $booking = Booking::where('customer_id', $user->id)
            ->with(['photographer.categories', 'photographer.bankAccounts', 'package', 'addons', 'statusHistories', 'payments', 'review'])
            ->findOrFail($id);

        return Inertia::render('Customer/BookingDetail', [
            'booking' => $booking,
        ]);
    }

    public function requestBooking(Request $request, BookingService $bookingService)
    {
        $data = $request->validate([
            'photographer_profile_id' => 'required|exists:photographer_profiles,id',
            'package_id' => 'nullable|exists:photographer_packages,id',
            'event_type' => 'required|string|max:100',
            'event_date' => 'required|date|after_or_equal:today',
            'start_time' => 'nullable|string',
            'end_time' => 'nullable|string',
            'event_location' => 'required|string',
            'city' => 'required|string|max:100',
            'state' => 'nullable|string|max:100',
            'guest_count' => 'nullable|numeric|min:1',
            'travel_charges' => 'nullable|numeric|min:0',
            'coupon_code' => 'nullable|string|max:50',
            'special_instructions' => 'nullable|string',
            'addons' => 'nullable|array',
            'addons.*.name' => 'required|string',
            'addons.*.price' => 'required|numeric|min:0',
        ]);

        try {
            $booking = $bookingService->createBookingRequest(auth()->user(), $data);

            return redirect()->route('customer.bookings.show', $booking->id)
                ->with('success', 'Booking request sent successfully! Booking number: ' . $booking->booking_number);
        } catch (Exception $e) {
            return back()->withErrors(['booking' => $e->getMessage()]);
        }
    }

    public function payBooking(Request $request, int $id, PaymentService $paymentService)
    {
        $booking = Booking::where('customer_id', auth()->id())->findOrFail($id);
        
        $request->validate([
            'payment_type' => 'required|in:advance,remaining,full',
            'amount' => 'required|numeric|min:1',
            'gateway' => 'nullable|string',
        ]);

        $amount = (float) $request->input('amount');
        $paymentType = $request->input('payment_type');

        try {
            $payment = $paymentService->recordPayment(
                $booking,
                auth()->user(),
                $amount,
                $paymentType,
                'razorpay',
                'TXN-' . strtoupper(uniqid()),
                ['simulated' => true, 'timestamp' => now()->toIso8601String()]
            );

            return redirect()->route('customer.bookings.show', $booking->id)
                ->with('success', 'Payment of ₹' . number_format($amount, 2) . ' processed successfully!');
        } catch (Exception $e) {
            return back()->withErrors(['payment' => $e->getMessage()]);
        }
    }

    public function cancelBooking(Request $request, int $id)
    {
        $booking = Booking::where('customer_id', auth()->id())->findOrFail($id);

        if (!in_array($booking->booking_status, ['pending', 'accepted'])) {
            return back()->withErrors(['booking' => 'Cannot cancel a confirmed or in-progress booking. Please contact support.']);
        }

        $booking->recordStatusChange('cancelled', auth()->id(), $request->input('reason', 'Cancelled by customer.'));
        $booking->cancellation_reason = $request->input('reason');
        $booking->save();

        return redirect()->route('customer.bookings.show', $booking->id)->with('success', 'Booking has been cancelled.');
    }

    public function toggleFavorite(Request $request)
    {
        $request->validate([
            'photographer_profile_id' => 'required|exists:photographer_profiles,id',
        ]);

        $photographerId = $request->input('photographer_profile_id');
        $userId = auth()->id();

        $existing = Favorite::where('customer_id', $userId)
            ->where('photographer_profile_id', $photographerId)
            ->first();

        if ($existing) {
            $existing->delete();
            $favorited = false;
            $msg = 'Removed from favorites';
        } else {
            Favorite::create([
                'customer_id' => $userId,
                'photographer_profile_id' => $photographerId,
            ]);
            $favorited = true;
            $msg = 'Added to favorites!';
        }

        if ($request->wantsJson()) {
            return response()->json(['favorited' => $favorited, 'message' => $msg]);
        }

        return back()->with('success', $msg);
    }

    public function favorites(): Response
    {
        $favorites = Favorite::where('customer_id', auth()->id())
            ->with(['photographer.categories', 'photographer.locations'])
            ->latest()
            ->paginate(12);

        return Inertia::render('Customer/Favorites', [
            'favorites' => $favorites,
        ]);
    }

    public function submitReview(Request $request, int $bookingId)
    {
        $booking = Booking::where('customer_id', auth()->id())
            ->where('booking_status', 'completed')
            ->findOrFail($bookingId);

        if ($booking->review()->exists()) {
            return back()->withErrors(['review' => 'You have already reviewed this booking.']);
        }

        $data = $request->validate([
            'rating' => 'required|integer|min:1|max:5',
            'review_text' => 'required|string|min:10|max:1500',
        ]);

        Review::create([
            'booking_id' => $booking->id,
            'customer_id' => auth()->id(),
            'photographer_profile_id' => $booking->photographer_profile_id,
            'rating' => $data['rating'],
            'review_text' => $data['review_text'],
            'is_approved' => true,
        ]);

        // Recalculate photographer average rating
        $photographer = $booking->photographer;
        if ($photographer) {
            $avg = Review::where('photographer_profile_id', $photographer->id)->where('is_approved', true)->avg('rating');
            $cnt = Review::where('photographer_profile_id', $photographer->id)->where('is_approved', true)->count();
            $photographer->average_rating = round($avg, 2);
            $photographer->review_count = $cnt;
            $photographer->save();
        }

        return back()->with('success', 'Thank you! Your review has been submitted.');
    }

    public function messages(Request $request): Response
    {
        $userId = auth()->id();

        $conversations = Conversation::where('customer_id', $userId)
            ->with(['photographer', 'booking', 'messages' => function ($q) {
                $q->latest()->take(1);
            }])
            ->orderByDesc('last_message_at')
            ->get();

        $selectedConversation = null;
        if ($convId = $request->input('conversation_id')) {
            $selectedConversation = Conversation::where('customer_id', $userId)
                ->with(['photographer', 'booking', 'messages.sender'])
                ->find($convId);

            if ($selectedConversation) {
                // Mark messages as read
                Message::where('conversation_id', $selectedConversation->id)
                    ->where('sender_id', '!=', $userId)
                    ->where('is_read', false)
                    ->update(['is_read' => true, 'read_at' => now()]);
            }
        } elseif ($conversations->isNotEmpty()) {
            $selectedConversation = Conversation::where('id', $conversations->first()->id)
                ->with(['photographer', 'booking', 'messages.sender'])
                ->first();
        }

        return Inertia::render('Customer/Messages', [
            'conversations' => $conversations,
            'selectedConversation' => $selectedConversation,
        ]);
    }

    public function sendMessage(Request $request)
    {
        $request->validate([
            'conversation_id' => 'nullable|exists:conversations,id',
            'photographer_id' => 'required_without:conversation_id|exists:users,id',
            'booking_id' => 'nullable|exists:bookings,id',
            'message_text' => 'required|string|max:2000',
        ]);

        $userId = auth()->id();
        $convId = $request->input('conversation_id');

        if (!$convId) {
            $conv = Conversation::firstOrCreate(
                [
                    'customer_id' => $userId,
                    'photographer_id' => $request->input('photographer_id'),
                    'booking_id' => $request->input('booking_id'),
                ],
                ['last_message_at' => now()]
            );
            $convId = $conv->id;
        }

        $message = Message::create([
            'conversation_id' => $convId,
            'sender_id' => $userId,
            'message_text' => $request->input('message_text'),
            'is_read' => false,
        ]);

        Conversation::where('id', $convId)->update(['last_message_at' => now()]);

        return redirect()->route('customer.messages', ['conversation_id' => $convId]);
    }

    public function profile(): Response
    {
        $user = auth()->user();
        $profile = $user->customerProfile;

        return Inertia::render('Customer/Profile', [
            'user' => $user,
            'profile' => $profile,
        ]);
    }

    public function updateProfile(Request $request)
    {
        $user = auth()->user();

        $data = $request->validate([
            'name' => 'required|string|max:255',
            'phone' => 'required|string|max:20',
            'city' => 'nullable|string|max:100',
            'state' => 'nullable|string|max:100',
            'address' => 'nullable|string',
            'bio' => 'nullable|string',
        ]);

        $user->update([
            'name' => $data['name'],
            'phone' => $data['phone'],
        ]);

        CustomerProfile::updateOrCreate(
            ['user_id' => $user->id],
            [
                'city' => $data['city'] ?? null,
                'state' => $data['state'] ?? null,
                'address' => $data['address'] ?? null,
                'bio' => $data['bio'] ?? null,
            ]
        );

        return back()->with('success', 'Profile updated successfully!');
    }
}
