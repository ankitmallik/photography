<?php

namespace App\Http\Controllers\Photographer;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Category;
use App\Models\Conversation;
use App\Models\Message;
use App\Models\Payout;
use App\Models\PhotographerAvailability;
use App\Models\PhotographerBankAccount;
use App\Models\PhotographerEarning;
use App\Models\PhotographerPackage;
use App\Models\PhotographerProfile;
use App\Models\PhotographerService;
use App\Models\Portfolio;
use App\Models\PortfolioMedia;
use App\Models\Review;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class PhotographerDashboardController extends Controller
{
    private function getProfile(): PhotographerProfile
    {
        $profile = auth()->user()->photographerProfile;
        if (!$profile) {
            $user = auth()->user();
            $profile = PhotographerProfile::create([
                'user_id' => $user->id,
                'business_name' => $user->name . ' Photography',
                'slug' => Str::slug($user->name . '-' . rand(100, 999)),
                'experience_years' => 1,
                'starting_price' => 10000,
                'verification_status' => 'pending',
                'profile_status' => 'active',
            ]);
        }
        return $profile;
    }

    public function dashboard(): Response
    {
        $profile = $this->getProfile();

        $totalBookings = Booking::where('photographer_profile_id', $profile->id)->count();
        $pendingRequests = Booking::where('photographer_profile_id', $profile->id)->where('booking_status', 'pending')->count();
        $upcomingEvents = Booking::where('photographer_profile_id', $profile->id)
            ->whereIn('booking_status', ['confirmed', 'accepted'])
            ->where('event_date', '>=', now()->toDateString())
            ->count();
        $completedBookings = Booking::where('photographer_profile_id', $profile->id)->where('booking_status', 'completed')->count();

        // Earnings
        $totalEarnings = PhotographerEarning::where('photographer_profile_id', $profile->id)->sum('net_amount');
        $availableBalance = PhotographerEarning::where('photographer_profile_id', $profile->id)->where('status', 'available')->sum('net_amount');
        $paidOut = Payout::where('photographer_profile_id', $profile->id)->where('status', 'completed')->sum('amount');

        $recentBookings = Booking::where('photographer_profile_id', $profile->id)
            ->with(['customer', 'package'])
            ->latest()
            ->take(5)
            ->get();

        $recentReviews = Review::where('photographer_profile_id', $profile->id)
            ->with('customer')
            ->latest()
            ->take(3)
            ->get();

        $completionScore = $profile->recalculateProfileCompletion();

        return Inertia::render('Photographer/Dashboard', [
            'profile' => $profile,
            'metrics' => [
                'total_bookings' => $totalBookings,
                'pending_requests' => $pendingRequests,
                'upcoming_events' => $upcomingEvents,
                'completed_bookings' => $completedBookings,
                'total_earnings' => (float) $totalEarnings,
                'available_balance' => max(0, (float) ($availableBalance - $paidOut)),
                'average_rating' => (float) $profile->average_rating,
                'review_count' => (int) $profile->review_count,
                'completion_percentage' => $completionScore,
            ],
            'recentBookings' => $recentBookings,
            'recentReviews' => $recentReviews,
        ]);
    }

    public function profile(): Response
    {
        $profile = $this->getProfile()->load(['categories', 'locations']);
        $categories = Category::where('is_active', true)->orderBy('sort_order')->get();

        return Inertia::render('Photographer/Profile', [
            'profile' => $profile,
            'allCategories' => $categories,
        ]);
    }

    public function updateProfile(Request $request)
    {
        $profile = $this->getProfile();

        $data = $request->validate([
            'business_name' => 'required|string|max:255',
            'display_name' => 'nullable|string|max:255',
            'tagline' => 'nullable|string|max:255',
            'bio' => 'nullable|string',
            'experience_years' => 'required|numeric|min:0',
            'profile_image' => 'nullable|string',
            'cover_image' => 'nullable|string',
            'address' => 'nullable|string',
            'city' => 'required|string|max:100',
            'state' => 'required|string|max:100',
            'pincode' => 'nullable|string|max:20',
            'starting_price' => 'required|numeric|min:0',
            'max_price' => 'nullable|numeric|min:0',
            'category_ids' => 'nullable|array',
            'social_links' => 'nullable|array',
        ]);

        $profile->update($data);

        if (isset($data['category_ids'])) {
            $profile->categories()->sync($data['category_ids']);
        }

        $profile->recalculateProfileCompletion();

        return back()->with('success', 'Profile updated successfully!');
    }

    public function services(): Response
    {
        $profile = $this->getProfile();
        $services = $profile->services()->with('category')->latest()->get();
        $categories = Category::where('is_active', true)->get();

        return Inertia::render('Photographer/Services', [
            'services' => $services,
            'categories' => $categories,
        ]);
    }

    public function storeService(Request $request)
    {
        $profile = $this->getProfile();

        $data = $request->validate([
            'category_id' => 'nullable|exists:categories,id',
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price_type' => 'required|in:fixed,starting_from,custom_quote',
            'price' => 'required|numeric|min:0',
            'max_price' => 'nullable|numeric|min:0',
            'is_active' => 'boolean',
        ]);

        $profile->services()->create($data);
        $profile->recalculateProfileCompletion();

        return back()->with('success', 'Service created successfully!');
    }

    public function updateService(Request $request, int $id)
    {
        $profile = $this->getProfile();
        $service = $profile->services()->findOrFail($id);

        $data = $request->validate([
            'category_id' => 'nullable|exists:categories,id',
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price_type' => 'required|in:fixed,starting_from,custom_quote',
            'price' => 'required|numeric|min:0',
            'max_price' => 'nullable|numeric|min:0',
            'is_active' => 'boolean',
        ]);

        $service->update($data);

        return back()->with('success', 'Service updated successfully!');
    }

    public function deleteService(int $id)
    {
        $profile = $this->getProfile();
        $service = $profile->services()->findOrFail($id);
        $service->delete();

        return back()->with('success', 'Service deleted successfully!');
    }

    public function packages(): Response
    {
        $profile = $this->getProfile();
        $packages = $profile->packages()->orderBy('sort_order')->get();

        return Inertia::render('Photographer/Packages', [
            'packages' => $packages,
        ]);
    }

    public function storePackage(Request $request)
    {
        $profile = $this->getProfile();

        $data = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'duration_hours' => 'required|numeric|min:1',
            'photographer_count' => 'required|numeric|min:1',
            'videographer_count' => 'nullable|numeric|min:0',
            'edited_photos_count' => 'required|numeric|min:0',
            'raw_photos_included' => 'boolean',
            'video_duration_minutes' => 'nullable|numeric|min:0',
            'cinematic_video' => 'boolean',
            'drone' => 'boolean',
            'album' => 'boolean',
            'album_pages' => 'nullable|numeric|min:0',
            'travel_included' => 'boolean',
            'features' => 'nullable|array',
            'is_active' => 'boolean',
        ]);

        $data['slug'] = Str::slug($profile->business_name . '-' . $data['name'] . '-' . rand(10, 99));

        $profile->packages()->create($data);
        $profile->recalculateProfileCompletion();

        return back()->with('success', 'Package created successfully!');
    }

    public function updatePackage(Request $request, int $id)
    {
        $profile = $this->getProfile();
        $package = $profile->packages()->findOrFail($id);

        $data = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'duration_hours' => 'required|numeric|min:1',
            'photographer_count' => 'required|numeric|min:1',
            'videographer_count' => 'nullable|numeric|min:0',
            'edited_photos_count' => 'required|numeric|min:0',
            'raw_photos_included' => 'boolean',
            'video_duration_minutes' => 'nullable|numeric|min:0',
            'cinematic_video' => 'boolean',
            'drone' => 'boolean',
            'album' => 'boolean',
            'album_pages' => 'nullable|numeric|min:0',
            'travel_included' => 'boolean',
            'features' => 'nullable|array',
            'is_active' => 'boolean',
        ]);

        $package->update($data);

        return back()->with('success', 'Package updated successfully!');
    }

    public function deletePackage(int $id)
    {
        $profile = $this->getProfile();
        $package = $profile->packages()->findOrFail($id);
        $package->delete();

        return back()->with('success', 'Package deleted successfully!');
    }

    public function portfolios(): Response
    {
        $profile = $this->getProfile();
        $portfolios = $profile->portfolios()->with(['category', 'media'])->latest()->get();
        $categories = Category::where('is_active', true)->get();

        return Inertia::render('Photographer/Portfolio', [
            'portfolios' => $portfolios,
            'categories' => $categories,
        ]);
    }

    public function storePortfolio(Request $request)
    {
        $profile = $this->getProfile();

        $data = $request->validate([
            'title' => 'required|string|max:255',
            'category_id' => 'nullable|exists:categories,id',
            'description' => 'nullable|string',
            'event_date' => 'nullable|date',
            'cover_image' => 'nullable|string',
            'media_urls' => 'nullable|array',
            'media_urls.*' => 'string',
        ]);

        $portfolio = $profile->portfolios()->create([
            'title' => $data['title'],
            'slug' => Str::slug($data['title'] . '-' . rand(100, 999)),
            'category_id' => $data['category_id'] ?? null,
            'description' => $data['description'] ?? null,
            'event_date' => $data['event_date'] ?? null,
            'cover_image' => $data['cover_image'] ?? ($data['media_urls'][0] ?? null),
            'is_approved' => true,
        ]);

        if (!empty($data['media_urls'])) {
            foreach ($data['media_urls'] as $idx => $url) {
                $portfolio->media()->create([
                    'media_type' => 'image',
                    'file_path' => $url,
                    'sort_order' => $idx,
                    'is_cover' => $idx === 0,
                ]);
            }
        }

        $profile->recalculateProfileCompletion();

        return back()->with('success', 'Portfolio album created!');
    }

    public function deletePortfolio(int $id)
    {
        $profile = $this->getProfile();
        $portfolio = $profile->portfolios()->findOrFail($id);
        $portfolio->delete();

        return back()->with('success', 'Portfolio album deleted!');
    }

    public function availability(): Response
    {
        $profile = $this->getProfile();
        $availabilities = $profile->availabilities()
            ->where('date', '>=', now()->subDays(30)->toDateString())
            ->get();

        return Inertia::render('Photographer/Availability', [
            'availabilities' => $availabilities,
        ]);
    }

    public function updateAvailability(Request $request)
    {
        $profile = $this->getProfile();

        $data = $request->validate([
            'date' => 'required|date',
            'status' => 'required|in:available,booked,blocked',
            'notes' => 'nullable|string|max:255',
        ]);

        PhotographerAvailability::updateOrCreate(
            [
                'photographer_profile_id' => $profile->id,
                'date' => $data['date'],
            ],
            [
                'status' => $data['status'],
                'notes' => $data['notes'] ?? null,
            ]
        );

        return back()->with('success', 'Availability updated for ' . $data['date']);
    }

    public function bookings(Request $request): Response
    {
        $profile = $this->getProfile();
        $query = Booking::where('photographer_profile_id', $profile->id)
            ->with(['customer', 'package', 'payments'])
            ->latest();

        if ($status = $request->input('status')) {
            $query->where('booking_status', $status);
        }

        $bookings = $query->paginate(10)->withQueryString();

        return Inertia::render('Photographer/Bookings', [
            'bookings' => $bookings,
            'currentStatus' => $request->input('status', 'all'),
        ]);
    }

    public function showBooking(int $id): Response
    {
        $profile = $this->getProfile();
        $booking = Booking::where('photographer_profile_id', $profile->id)
            ->with(['customer', 'package', 'addons', 'statusHistories', 'payments', 'review'])
            ->findOrFail($id);

        return Inertia::render('Photographer/BookingDetail', [
            'booking' => $booking,
        ]);
    }

    public function updateBookingStatus(Request $request, int $id)
    {
        $profile = $this->getProfile();
        $booking = Booking::where('photographer_profile_id', $profile->id)->findOrFail($id);

        $request->validate([
            'action' => 'required|in:accept,reject,start,complete',
            'reason' => 'nullable|string',
        ]);

        $action = $request->input('action');
        $userId = auth()->id();

        if ($action === 'accept') {
            $booking->recordStatusChange('accepted', $userId, 'Photographer accepted the booking request.');
        } elseif ($action === 'reject') {
            $booking->rejection_reason = $request->input('reason', 'Declined by photographer due to schedule.');
            $booking->recordStatusChange('rejected', $userId, $booking->rejection_reason);
        } elseif ($action === 'start') {
            $booking->recordStatusChange('in_progress', $userId, 'Event shoot has commenced.');
        } elseif ($action === 'complete') {
            $booking->recordStatusChange('completed', $userId, 'Event photography completed.');
        }

        return redirect()->route('photographer.bookings.show', $booking->id)->with('success', 'Booking status updated to: ' . $booking->booking_status);
    }

    public function earnings(): Response
    {
        $profile = $this->getProfile();

        $earnings = PhotographerEarning::where('photographer_profile_id', $profile->id)
            ->with(['booking.customer', 'payment'])
            ->latest()
            ->paginate(15);

        $totalEarnings = PhotographerEarning::where('photographer_profile_id', $profile->id)->sum('net_amount');
        $paidOut = Payout::where('photographer_profile_id', $profile->id)->where('status', 'completed')->sum('amount');
        $availableBalance = max(0, (float) ($totalEarnings - $paidOut));

        $bankAccount = $profile->primaryBankAccount;

        return Inertia::render('Photographer/Earnings', [
            'earnings' => $earnings,
            'totalEarnings' => (float) $totalEarnings,
            'availableBalance' => $availableBalance,
            'paidOut' => (float) $paidOut,
            'bankAccount' => $bankAccount,
        ]);
    }

    public function payouts(): Response
    {
        $profile = $this->getProfile();

        $payouts = Payout::where('photographer_profile_id', $profile->id)->latest()->paginate(10);
        $totalEarnings = PhotographerEarning::where('photographer_profile_id', $profile->id)->sum('net_amount');
        $paidOut = Payout::where('photographer_profile_id', $profile->id)->where('status', 'completed')->sum('amount');
        $availableBalance = max(0, (float) ($totalEarnings - $paidOut));

        $bankAccount = $profile->primaryBankAccount;

        return Inertia::render('Photographer/Payouts', [
            'payouts' => $payouts,
            'availableBalance' => $availableBalance,
            'bankAccount' => $bankAccount,
        ]);
    }

    public function requestPayout(Request $request)
    {
        $profile = $this->getProfile();

        $totalEarnings = PhotographerEarning::where('photographer_profile_id', $profile->id)->sum('net_amount');
        $paidOut = Payout::where('photographer_profile_id', $profile->id)->where('status', 'completed')->sum('amount');
        $availableBalance = max(0, (float) ($totalEarnings - $paidOut));

        $data = $request->validate([
            'amount' => 'required|numeric|min:500|max:' . $availableBalance,
            'payout_method' => 'required|in:bank_transfer,upi',
        ]);

        $bank = $profile->primaryBankAccount;
        if (!$bank) {
            return back()->withErrors(['payout' => 'Please add your bank account or UPI details first.']);
        }

        Payout::create([
            'photographer_profile_id' => $profile->id,
            'amount' => $data['amount'],
            'payout_method' => $data['payout_method'],
            'payout_account_details' => [
                'account_holder' => $bank->account_holder_name,
                'account_number' => $bank->account_number,
                'ifsc_code' => $bank->ifsc_code,
                'bank_name' => $bank->bank_name,
                'upi_id' => $bank->upi_id,
            ],
            'status' => 'pending',
            'requested_at' => now(),
        ]);

        return back()->with('success', 'Payout request of ₹' . number_format($data['amount'], 2) . ' submitted for admin processing!');
    }

    public function updateBankDetails(Request $request)
    {
        $profile = $this->getProfile();

        $data = $request->validate([
            'account_holder_name' => 'required|string|max:255',
            'account_number' => 'required|string|max:50',
            'ifsc_code' => 'required|string|max:20',
            'bank_name' => 'required|string|max:100',
            'upi_id' => 'nullable|string|max:100',
        ]);

        PhotographerBankAccount::updateOrCreate(
            ['photographer_profile_id' => $profile->id],
            [
                ...$data,
                'is_primary' => true,
            ]
        );

        $profile->recalculateProfileCompletion();

        return back()->with('success', 'Bank and Payout details updated successfully!');
    }

    public function reviews(): Response
    {
        $profile = $this->getProfile();

        $reviews = Review::where('photographer_profile_id', $profile->id)
            ->with(['customer', 'booking'])
            ->latest()
            ->paginate(15);

        return Inertia::render('Photographer/Reviews', [
            'reviews' => $reviews,
        ]);
    }

    public function replyReview(Request $request, int $id)
    {
        $profile = $this->getProfile();
        $review = Review::where('photographer_profile_id', $profile->id)->findOrFail($id);

        $request->validate([
            'reply' => 'required|string|max:1000',
        ]);

        $review->update([
            'photographer_reply' => $request->input('reply'),
            'replied_at' => now(),
        ]);

        return back()->with('success', 'Reply submitted successfully!');
    }

    public function messages(Request $request): Response
    {
        $userId = auth()->id();

        $conversations = Conversation::where('photographer_id', $userId)
            ->with(['customer', 'booking', 'messages' => function ($q) {
                $q->latest()->take(1);
            }])
            ->orderByDesc('last_message_at')
            ->get();

        $selectedConversation = null;
        if ($convId = $request->input('conversation_id')) {
            $selectedConversation = Conversation::where('photographer_id', $userId)
                ->with(['customer', 'booking', 'messages.sender'])
                ->find($convId);

            if ($selectedConversation) {
                Message::where('conversation_id', $selectedConversation->id)
                    ->where('sender_id', '!=', $userId)
                    ->where('is_read', false)
                    ->update(['is_read' => true, 'read_at' => now()]);
            }
        } elseif ($conversations->isNotEmpty()) {
            $selectedConversation = Conversation::where('id', $conversations->first()->id)
                ->with(['customer', 'booking', 'messages.sender'])
                ->first();
        }

        return Inertia::render('Photographer/Messages', [
            'conversations' => $conversations,
            'selectedConversation' => $selectedConversation,
        ]);
    }

    public function sendMessage(Request $request)
    {
        $request->validate([
            'conversation_id' => 'required|exists:conversations,id',
            'message_text' => 'required|string|max:2000',
        ]);

        $userId = auth()->id();
        $convId = $request->input('conversation_id');

        Message::create([
            'conversation_id' => $convId,
            'sender_id' => $userId,
            'message_text' => $request->input('message_text'),
            'is_read' => false,
        ]);

        Conversation::where('id', $convId)->update(['last_message_at' => now()]);

        return redirect()->route('photographer.messages', ['conversation_id' => $convId]);
    }
}
