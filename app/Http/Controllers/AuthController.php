<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\CustomerProfile;
use App\Models\PhotographerProfile;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class AuthController extends Controller
{
    public function showLogin(): Response
    {
        return Inertia::render('Auth/Login');
    }

    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => 'required|email',
            'password' => 'required|string',
        ]);

        if (Auth::attempt($credentials, $request->boolean('remember'))) {
            $request->session()->regenerate();
            $user = Auth::user();

            if ($user->status === 'suspended') {
                Auth::logout();
                return back()->withErrors(['email' => 'Your account has been suspended. Please contact support.']);
            }

            if ($user->isAdmin()) {
                return redirect()->intended(route('admin.dashboard'));
            } elseif ($user->isPhotographer()) {
                return redirect()->intended(route('photographer.dashboard'));
            }

            return redirect()->intended(route('customer.dashboard'));
        }

        return back()->withErrors([
            'email' => 'The provided credentials do not match our records.',
        ]);
    }

    public function showCustomerRegister(): Response
    {
        return Inertia::render('Auth/RegisterCustomer');
    }

    public function registerCustomer(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'phone' => 'required|string|max:20',
            'password' => 'required|string|min:6|confirmed',
            'city' => 'nullable|string|max:100',
        ]);

        DB::transaction(function () use ($data) {
            $user = User::create([
                'name' => $data['name'],
                'email' => $data['email'],
                'phone' => $data['phone'],
                'password' => Hash::make($data['password']),
                'role' => 'customer',
                'status' => 'active',
                'email_verified_at' => now(),
            ]);

            CustomerProfile::create([
                'user_id' => $user->id,
                'city' => $data['city'] ?? null,
            ]);

            Auth::login($user);
        });

        return redirect()->route('customer.dashboard')->with('success', 'Welcome to LensCraft Marketplace!');
    }

    public function showPhotographerRegister(): Response
    {
        $categories = Category::where('is_active', true)->orderBy('sort_order')->get();
        return Inertia::render('Auth/RegisterPhotographer', [
            'categories' => $categories,
        ]);
    }

    public function registerPhotographer(Request $request)
    {
        $data = $request->validate([
            // Step 1: Basic
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'phone' => 'required|string|max:20',
            'password' => 'required|string|min:6|confirmed',
            // Step 2: Business Profile
            'business_name' => 'required|string|max:255',
            'display_name' => 'nullable|string|max:255',
            'bio' => 'nullable|string',
            'experience_years' => 'required|numeric|min:0',
            'profile_image' => 'nullable|string',
            'cover_image' => 'nullable|string',
            // Step 3: Location
            'address' => 'nullable|string',
            'city' => 'required|string|max:100',
            'state' => 'required|string|max:100',
            'pincode' => 'nullable|string|max:20',
            // Step 4: Categories
            'category_ids' => 'required|array|min:1',
            'category_ids.*' => 'exists:categories,id',
            // Step 5: Starting Price
            'starting_price' => 'required|numeric|min:0',
            // Step 9: Bank details
            'account_holder_name' => 'nullable|string|max:255',
            'account_number' => 'nullable|string|max:50',
            'ifsc_code' => 'nullable|string|max:20',
            'bank_name' => 'nullable|string|max:100',
            'upi_id' => 'nullable|string|max:100',
        ]);

        DB::transaction(function () use ($data) {
            $user = User::create([
                'name' => $data['name'],
                'email' => $data['email'],
                'phone' => $data['phone'],
                'password' => Hash::make($data['password']),
                'role' => 'photographer',
                'status' => 'active',
                'avatar' => $data['profile_image'] ?? null,
                'email_verified_at' => now(),
            ]);

            $slug = Str::slug($data['business_name']) . '-' . rand(100, 999);

            $profile = PhotographerProfile::create([
                'user_id' => $user->id,
                'business_name' => $data['business_name'],
                'display_name' => $data['display_name'] ?? $data['name'],
                'slug' => $slug,
                'bio' => $data['bio'] ?? null,
                'experience_years' => $data['experience_years'],
                'profile_image' => $data['profile_image'] ?? null,
                'cover_image' => $data['cover_image'] ?? null,
                'address' => $data['address'] ?? null,
                'city' => $data['city'],
                'state' => $data['state'],
                'pincode' => $data['pincode'] ?? null,
                'starting_price' => $data['starting_price'],
                'verification_status' => 'pending',
                'profile_status' => 'active',
            ]);

            // Sync categories
            $profile->categories()->sync($data['category_ids']);

            // Primary location
            $profile->locations()->create([
                'city' => $data['city'],
                'state' => $data['state'],
                'is_primary' => true,
            ]);

            // Bank details if provided
            if (!empty($data['account_number']) || !empty($data['upi_id'])) {
                $profile->bankAccounts()->create([
                    'account_holder_name' => $data['account_holder_name'] ?? $data['name'],
                    'account_number' => $data['account_number'] ?? '',
                    'ifsc_code' => $data['ifsc_code'] ?? '',
                    'bank_name' => $data['bank_name'] ?? '',
                    'upi_id' => $data['upi_id'] ?? null,
                    'is_primary' => true,
                ]);
            }

            $profile->recalculateProfileCompletion();

            Auth::login($user);
        });

        return redirect()->route('photographer.dashboard')->with('success', 'Registration submitted! Your profile has been sent for admin verification.');
    }

    public function logout(Request $request)
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->route('home');
    }
}
