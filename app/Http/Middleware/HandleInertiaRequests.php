<?php

namespace App\Http\Middleware;

use App\Models\Category;
use App\Models\Message;
use App\Models\Setting;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    protected $rootView = 'app';

    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    public function share(Request $request): array
    {
        $user = $request->user();
        $photographerProfile = null;
        $customerProfile = null;
        $unreadMessagesCount = 0;

        if ($user) {
            if ($user->isPhotographer()) {
                $photographerProfile = $user->photographerProfile;
            } elseif ($user->isCustomer()) {
                $customerProfile = $user->customerProfile;
            }

            // Unread messages count
            $unreadMessagesCount = Message::whereHas('conversation', function ($q) use ($user) {
                $q->where('customer_id', $user->id)
                  ->orWhere('photographer_id', $user->id);
            })->where('sender_id', '!=', $user->id)
              ->where('is_read', false)
              ->count();
        }

        return [
            ...parent::share($request),
            'auth' => [
                'user' => $user ? [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'phone' => $user->phone,
                    'role' => $user->role,
                    'status' => $user->status,
                    'avatar' => $user->avatar,
                ] : null,
                'photographer' => $photographerProfile,
                'customer' => $customerProfile,
                'unreadMessagesCount' => $unreadMessagesCount,
            ],
            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'error' => fn () => $request->session()->get('error'),
                'warning' => fn () => $request->session()->get('warning'),
                'info' => fn () => $request->session()->get('info'),
            ],
            'settings' => [
                'site_name' => Setting::get('site_name', 'LensCraft Marketplace'),
                'commission_percentage' => (float) Setting::get('commission_percentage', 10),
                'currency_symbol' => Setting::get('currency_symbol', '₹'),
                'razorpay_key' => config('services.razorpay.key', env('RAZORPAY_KEY', 'rzp_test_placeholderKey123')),
            ],
            'globalCategories' => fn () => Category::where('is_active', true)->orderBy('sort_order')->get(['id', 'name', 'slug', 'icon']),
        ];
    }
}
