<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Coupon;
use App\Models\FeaturedPhotographer;
use App\Models\PhotographerAvailability;
use App\Models\PhotographerProfile;
use App\Models\Review;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PublicController extends Controller
{
    public function home(): Response
    {
        $categories = Category::where('is_active', true)
            ->withCount(['photographers' => function ($q) {
                $q->publiclyVisible();
            }])
            ->orderBy('sort_order')
            ->get();

        $featuredPhotographers = PhotographerProfile::publiclyVisible()
            ->where('is_featured', true)
            ->with(['categories', 'locations'])
            ->take(6)
            ->get();

        $recentReviews = Review::where('is_approved', true)
            ->with(['customer', 'photographer'])
            ->latest()
            ->take(4)
            ->get();

        $topCities = PhotographerProfile::publiclyVisible()
            ->whereNotNull('city')
            ->select('city', 'state')
            ->selectRaw('count(*) as count')
            ->groupBy('city', 'state')
            ->orderByDesc('count')
            ->take(6)
            ->get();

        return Inertia::render('Public/Home', [
            'categories' => $categories,
            'featuredPhotographers' => $featuredPhotographers,
            'recentReviews' => $recentReviews,
            'topCities' => $topCities,
        ]);
    }

    public function photographers(Request $request): Response
    {
        $query = PhotographerProfile::publiclyVisible()->with(['categories', 'locations', 'packages']);

        // Search text
        if ($search = $request->input('q')) {
            $query->where(function ($q) use ($search) {
                $q->where('business_name', 'like', "%{$search}%")
                  ->orWhere('display_name', 'like', "%{$search}%")
                  ->orWhere('bio', 'like', "%{$search}%")
                  ->orWhere('tagline', 'like', "%{$search}%")
                  ->orWhere('city', 'like', "%{$search}%");
            });
        }

        // Category filter
        if ($categorySlug = $request->input('category')) {
            $query->whereHas('categories', function ($q) use ($categorySlug) {
                $q->where('slug', $categorySlug);
            });
        }

        // Location filter (City / State)
        if ($location = $request->input('location')) {
            $query->where(function ($q) use ($location) {
                $q->where('city', 'like', "%{$location}%")
                  ->orWhere('state', 'like', "%{$location}%")
                  ->orWhereHas('locations', function ($lq) use ($location) {
                      $lq->where('city', 'like', "%{$location}%");
                  });
            });
        }

        // Min & Max Price
        if ($minPrice = $request->input('min_price')) {
            $query->where('starting_price', '>=', (float) $minPrice);
        }
        if ($maxPrice = $request->input('max_price')) {
            $query->where('starting_price', '<=', (float) $maxPrice);
        }

        // Minimum Rating
        if ($minRating = $request->input('min_rating')) {
            $query->where('average_rating', '>=', (float) $minRating);
        }

        // Experience
        if ($minExp = $request->input('experience')) {
            $query->where('experience_years', '>=', (int) $minExp);
        }

        // Availability date check
        if ($eventDate = $request->input('date')) {
            $query->whereDoesntHave('availabilities', function ($aq) use ($eventDate) {
                $aq->where('date', $eventDate)->whereIn('status', ['booked', 'blocked']);
            });
        }

        // Sorting
        $sort = $request->input('sort', 'recommended');
        switch ($sort) {
            case 'rating':
                $query->orderByDesc('average_rating')->orderByDesc('review_count');
                break;
            case 'price_low':
                $query->orderBy('starting_price', 'asc');
                break;
            case 'price_high':
                $query->orderBy('starting_price', 'desc');
                break;
            case 'most_reviewed':
                $query->orderByDesc('review_count');
                break;
            case 'most_booked':
                $query->orderByDesc('total_bookings');
                break;
            case 'recommended':
            default:
                $query->orderByDesc('is_featured')
                      ->orderByDesc('average_rating')
                      ->orderByDesc('total_bookings');
                break;
        }

        $photographers = $query->paginate(12)->withQueryString();
        $categories = Category::where('is_active', true)->orderBy('sort_order')->get();

        return Inertia::render('Public/Photographers', [
            'photographers' => $photographers,
            'categories' => $categories,
            'filters' => $request->all(),
        ]);
    }

    public function show(string $slug): Response
    {
        $photographer = PhotographerProfile::where('slug', $slug)
            ->with([
                'categories',
                'locations',
                'services' => function ($q) {
                    $q->where('is_active', true);
                },
                'packages' => function ($q) {
                    $q->where('is_active', true)->orderBy('sort_order');
                },
                'portfolios' => function ($q) {
                    $q->where('is_approved', true)->with('media');
                },
                'availabilities' => function ($q) {
                    $q->where('date', '>=', now()->toDateString());
                },
                'reviews' => function ($q) {
                    $q->where('is_approved', true)->with('customer')->latest();
                },
            ])
            ->firstOrFail();

        // Check if current customer has favorited this photographer
        $isFavorited = false;
        if ($user = auth()->user()) {
            $isFavorited = $user->favorites()->where('photographer_profile_id', $photographer->id)->exists();
        }

        return Inertia::render('Public/PhotographerProfile', [
            'photographer' => $photographer,
            'isFavorited' => $isFavorited,
        ]);
    }

    public function validateCoupon(Request $request)
    {
        $request->validate([
            'code' => 'required|string',
            'amount' => 'required|numeric|min:0',
        ]);

        $coupon = Coupon::where('code', strtoupper(trim($request->input('code'))))->first();

        if (!$coupon) {
            return response()->json(['valid' => false, 'message' => 'Invalid coupon code.'], 422);
        }

        if (!$coupon->isValidForAmount((float) $request->input('amount'))) {
            return response()->json(['valid' => false, 'message' => 'Coupon criteria not met or expired.'], 422);
        }

        $discount = $coupon->calculateDiscount((float) $request->input('amount'));

        return response()->json([
            'valid' => true,
            'coupon_id' => $coupon->id,
            'code' => $coupon->code,
            'discount' => $discount,
            'message' => 'Coupon applied successfully!',
        ]);
    }
}
