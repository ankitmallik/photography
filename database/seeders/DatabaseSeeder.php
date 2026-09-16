<?php

namespace Database\Seeders;

use App\Models\Booking;
use App\Models\Category;
use App\Models\Coupon;
use App\Models\CustomerProfile;
use App\Models\FeaturedPhotographer;
use App\Models\Payment;
use App\Models\PhotographerAvailability;
use App\Models\PhotographerBankAccount;
use App\Models\PhotographerEarning;
use App\Models\PhotographerPackage;
use App\Models\PhotographerProfile;
use App\Models\PhotographerService;
use App\Models\PlatformCommission;
use App\Models\Portfolio;
use App\Models\PortfolioMedia;
use App\Models\Review;
use App\Models\Setting;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Settings
        Setting::set('site_name', 'LensCraft — Photographer Marketplace', 'general');
        Setting::set('commission_percentage', '10', 'finance');
        Setting::set('advance_percentage', '25', 'finance');
        Setting::set('currency_symbol', '₹', 'general');
        Setting::set('support_email', 'support@lenscraft.in', 'general');
        Setting::set('support_phone', '+91 98765 43210', 'general');

        // 2. Admin User
        $admin = User::create([
            'name' => 'Super Admin',
            'email' => 'admin@lenscraft.com',
            'phone' => '+91 9876500001',
            'password' => Hash::make('password'),
            'role' => 'admin',
            'status' => 'active',
            'avatar' => 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
            'email_verified_at' => now(),
        ]);

        // 3. Customer User
        $customerUser = User::create([
            'name' => 'Rahul Sharma',
            'email' => 'rahul@example.com',
            'phone' => '+91 9876500002',
            'password' => Hash::make('password'),
            'role' => 'customer',
            'status' => 'active',
            'avatar' => 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
            'email_verified_at' => now(),
        ]);

        CustomerProfile::create([
            'user_id' => $customerUser->id,
            'city' => 'Delhi',
            'state' => 'Delhi NCR',
            'address' => '42 Connaught Place, New Delhi',
            'bio' => 'Looking for cinematic wedding photographers for upcoming family events.',
        ]);

        // 4. Categories
        $categoriesData = [
            [
                'name' => 'Wedding Photography',
                'slug' => 'wedding-photography',
                'icon' => 'Heart',
                'image' => 'https://images.unsplash.com/photo-1519741497674-611481863552?w=600&auto=format&fit=crop&q=80',
                'description' => 'Capture every sacred ritual, emotional moment, and grand celebration of your dream wedding.',
                'sort_order' => 1,
            ],
            [
                'name' => 'Pre-Wedding Shoot',
                'slug' => 'pre-wedding-shoot',
                'icon' => 'Camera',
                'image' => 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=600&auto=format&fit=crop&q=80',
                'description' => 'Romantic and candid outdoor/studio photography telling your unique love story.',
                'sort_order' => 2,
            ],
            [
                'name' => 'Birthday & Private Events',
                'slug' => 'birthday-and-events',
                'icon' => 'Gift',
                'image' => 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=600&auto=format&fit=crop&q=80',
                'description' => 'Vibrant memories of milestone birthdays, anniversaries, and family get-togethers.',
                'sort_order' => 3,
            ],
            [
                'name' => 'Maternity & Baby Shoot',
                'slug' => 'maternity-baby-shoot',
                'icon' => 'Smile',
                'image' => 'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=600&auto=format&fit=crop&q=80',
                'description' => 'Cherish the purest moments of motherhood and newborn innocence.',
                'sort_order' => 4,
            ],
            [
                'name' => 'Cinematic & Drone Films',
                'slug' => 'cinematic-drone-films',
                'icon' => 'Video',
                'image' => 'https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?w=600&auto=format&fit=crop&q=80',
                'description' => '4K Ultra-HD cinematography, breathtaking aerial drone perspectives, and teaser reels.',
                'sort_order' => 5,
            ],
            [
                'name' => 'Fashion & Modeling',
                'slug' => 'fashion-modeling',
                'icon' => 'Sparkles',
                'image' => 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600&auto=format&fit=crop&q=80',
                'description' => 'High-fashion model portfolios, editorial lookbooks, and glamour shoots.',
                'sort_order' => 6,
            ],
            [
                'name' => 'Corporate & Brand Events',
                'slug' => 'corporate-brand-events',
                'icon' => 'Briefcase',
                'image' => 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=600&auto=format&fit=crop&q=80',
                'description' => 'Professional coverage of business summits, product launches, and corporate headshots.',
                'sort_order' => 7,
            ],
            [
                'name' => 'Product & Commercial',
                'slug' => 'product-commercial',
                'icon' => 'ShoppingBag',
                'image' => 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80',
                'description' => 'Clean e-commerce product photos, advertising visuals, and studio cataloging.',
                'sort_order' => 8,
            ],
        ];

        $categories = [];
        foreach ($categoriesData as $data) {
            $categories[$data['slug']] = Category::create($data);
        }

        // 5. Coupons
        Coupon::create([
            'code' => 'WELCOME10',
            'discount_type' => 'percentage',
            'discount_value' => 10,
            'min_booking_amount' => 5000,
            'max_discount_amount' => 3000,
            'usage_limit' => 100,
            'is_active' => true,
        ]);

        Coupon::create([
            'code' => 'FESTIVE5000',
            'discount_type' => 'fixed',
            'discount_value' => 5000,
            'min_booking_amount' => 40000,
            'is_active' => true,
        ]);

        // 6. Photographers Data
        $photographersData = [
            [
                'name' => 'Arjun Malhotra',
                'email' => 'arjun@malhotrastudios.com',
                'phone' => '+91 9811122233',
                'business_name' => 'Malhotra Wedding & Cinematic Studios',
                'tagline' => 'Award-winning Luxury Wedding Cinematography & Candid Portraits',
                'bio' => 'With over 10 years of storytelling experience across India and international destination weddings, Malhotra Studios crafts cinematic heirlooms that capture emotion and elegance.',
                'experience_years' => 10,
                'city' => 'Delhi',
                'state' => 'Delhi NCR',
                'pincode' => '110001',
                'profile_image' => 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
                'cover_image' => 'https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&auto=format&fit=crop&q=80',
                'starting_price' => 35000,
                'max_price' => 180000,
                'average_rating' => 4.95,
                'review_count' => 48,
                'total_bookings' => 62,
                'cats' => ['wedding-photography', 'pre-wedding-shoot', 'cinematic-drone-films'],
            ],
            [
                'name' => 'Sneha Kulkarni',
                'email' => 'sneha@mumbaiclickers.com',
                'phone' => '+91 9822233344',
                'business_name' => 'Aura Frames by Sneha',
                'tagline' => 'Contemporary Pre-Wedding, Maternity & Fashion Storyteller',
                'bio' => 'Specializing in natural light aesthetics, intimate candid moments, and modern fashion portraits across Mumbai, Pune, and Goa.',
                'experience_years' => 7,
                'city' => 'Mumbai',
                'state' => 'Maharashtra',
                'pincode' => '400050',
                'profile_image' => 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
                'cover_image' => 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=1200&auto=format&fit=crop&q=80',
                'starting_price' => 25000,
                'max_price' => 95000,
                'average_rating' => 4.90,
                'review_count' => 34,
                'total_bookings' => 45,
                'cats' => ['pre-wedding-shoot', 'maternity-baby-shoot', 'fashion-modeling'],
            ],
            [
                'name' => 'Vikramaditya Rathore',
                'email' => 'vikram@royaljaipurframes.in',
                'phone' => '+91 9833344455',
                'business_name' => 'Royal Heritage Visions',
                'tagline' => 'Grand Destination Weddings & Royal Palace Photography',
                'bio' => 'Bringing the regal grandeur of Rajasthan palaces to life. Master of heritage architecture backdrops, royal bridal portraits, and 4K aerial cinematography.',
                'experience_years' => 12,
                'city' => 'Jaipur',
                'state' => 'Rajasthan',
                'pincode' => '302001',
                'profile_image' => 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&auto=format&fit=crop&q=80',
                'cover_image' => 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=1200&auto=format&fit=crop&q=80',
                'starting_price' => 50000,
                'max_price' => 250000,
                'average_rating' => 5.00,
                'review_count' => 29,
                'total_bookings' => 38,
                'cats' => ['wedding-photography', 'cinematic-drone-films'],
            ],
            [
                'name' => 'Rajeev Ranjan',
                'email' => 'rajeev@purneaphotography.com',
                'phone' => '+91 9844455566',
                'business_name' => 'Raj Photography & Films Purnea',
                'tagline' => 'Top Rated Wedding & Event Photography Studio in Purnea & Seemanchal',
                'bio' => 'Complete high-definition wedding coverage, drone cinematography, candid shoots, and premium photobooks in Purnea, Katihar, Bhagalpur and Bihar.',
                'experience_years' => 8,
                'city' => 'Purnea',
                'state' => 'Bihar',
                'pincode' => '854301',
                'profile_image' => 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&auto=format&fit=crop&q=80',
                'cover_image' => 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?w=1200&auto=format&fit=crop&q=80',
                'starting_price' => 18000,
                'max_price' => 85000,
                'average_rating' => 4.88,
                'review_count' => 52,
                'total_bookings' => 74,
                'cats' => ['wedding-photography', 'birthday-and-events', 'cinematic-drone-films'],
            ],
            [
                'name' => 'Ananya Iyer',
                'email' => 'ananya@bengalurulens.com',
                'phone' => '+91 9855566677',
                'business_name' => 'Pixel Storytellers Bengaluru',
                'tagline' => 'Corporate Summits, Tech Brand Launches & Executive Headshots',
                'bio' => 'Trusted by leading startups and Fortune 500 enterprises for professional media coverage, executive portraits, and tech conventions.',
                'experience_years' => 6,
                'city' => 'Bengaluru',
                'state' => 'Karnataka',
                'pincode' => '560001',
                'profile_image' => 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&auto=format&fit=crop&q=80',
                'cover_image' => 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=1200&auto=format&fit=crop&q=80',
                'starting_price' => 20000,
                'max_price' => 90000,
                'average_rating' => 4.92,
                'review_count' => 21,
                'total_bookings' => 31,
                'cats' => ['corporate-brand-events', 'product-commercial'],
            ],
        ];

        foreach ($photographersData as $pData) {
            $user = User::create([
                'name' => $pData['name'],
                'email' => $pData['email'],
                'phone' => $pData['phone'],
                'password' => Hash::make('password'),
                'role' => 'photographer',
                'status' => 'active',
                'avatar' => $pData['profile_image'],
                'email_verified_at' => now(),
            ]);

            $slug = Str::slug($pData['business_name']);
            $profile = PhotographerProfile::create([
                'user_id' => $user->id,
                'business_name' => $pData['business_name'],
                'display_name' => $pData['name'],
                'slug' => $slug,
                'tagline' => $pData['tagline'],
                'bio' => $pData['bio'],
                'experience_years' => $pData['experience_years'],
                'profile_image' => $pData['profile_image'],
                'cover_image' => $pData['cover_image'],
                'address' => 'Main Market Road',
                'city' => $pData['city'],
                'state' => $pData['state'],
                'pincode' => $pData['pincode'],
                'verification_status' => 'approved',
                'profile_status' => 'active',
                'is_featured' => in_array($pData['city'], ['Delhi', 'Mumbai', 'Purnea']),
                'featured_until' => now()->addMonths(3),
                'starting_price' => $pData['starting_price'],
                'max_price' => $pData['max_price'],
                'average_rating' => $pData['average_rating'],
                'review_count' => $pData['review_count'],
                'total_bookings' => $pData['total_bookings'],
                'completion_percentage' => 100,
                'social_links' => [
                    'instagram' => 'https://instagram.com/' . Str::slug($pData['name']),
                    'youtube' => 'https://youtube.com/@' . Str::slug($pData['business_name']),
                ],
            ]);

            // Featured table entry
            if ($profile->is_featured) {
                FeaturedPhotographer::create([
                    'photographer_profile_id' => $profile->id,
                    'start_date' => now()->subDays(10),
                    'end_date' => now()->addDays(80),
                    'priority' => 10,
                    'is_active' => true,
                ]);
            }

            // Sync categories
            $catIds = [];
            foreach ($pData['cats'] as $cSlug) {
                if (isset($categories[$cSlug])) {
                    $catIds[] = $categories[$cSlug]->id;
                }
            }
            $profile->categories()->sync($catIds);

            // Locations
            $profile->locations()->create([
                'city' => $pData['city'],
                'state' => $pData['state'],
                'is_primary' => true,
                'travel_fee_per_km' => 15.00,
            ]);

            // Bank Account
            $profile->bankAccounts()->create([
                'account_holder_name' => $pData['name'],
                'account_number' => '50100' . rand(10000000, 99999999),
                'ifsc_code' => 'HDFC0001234',
                'bank_name' => 'HDFC Bank',
                'upi_id' => strtolower(Str::slug($pData['name'])) . '@upi',
                'is_primary' => true,
            ]);

            // Services
            $profile->services()->create([
                'category_id' => $catIds[0] ?? null,
                'name' => 'Full Day Candid & Traditional Photography',
                'description' => 'Comprehensive multi-camera coverage capturing all key rituals, family moments, and decor details.',
                'price_type' => 'starting_from',
                'price' => $pData['starting_price'],
                'max_price' => $pData['starting_price'] * 2,
                'is_active' => true,
            ]);

            $profile->services()->create([
                'category_id' => $catIds[1] ?? ($catIds[0] ?? null),
                'name' => 'Cinematic Teaser & Highlight Reel (4K)',
                'description' => 'Artistically color-graded 3-5 minute music highlight video + full wedding documentary film.',
                'price_type' => 'fixed',
                'price' => 25000,
                'is_active' => true,
            ]);

            // Packages
            $profile->packages()->create([
                'name' => 'Silver Day Package',
                'slug' => Str::slug($profile->business_name . ' silver-package'),
                'description' => 'Ideal for single day wedding or engagement ceremonies.',
                'price' => $pData['starting_price'],
                'duration_hours' => 6,
                'photographer_count' => 1,
                'videographer_count' => 1,
                'edited_photos_count' => 150,
                'raw_photos_included' => true,
                'video_duration_minutes' => 30,
                'cinematic_video' => false,
                'drone' => false,
                'album' => false,
                'album_pages' => 0,
                'travel_included' => true,
                'features' => [
                    '1 Senior Candid Photographer',
                    '1 HD Traditional Videographer',
                    '150 High-Res Edited Photos',
                    'All Unedited RAW Photos via Cloud Drive',
                    '30 Min Full Event Video',
                ],
                'is_active' => true,
                'sort_order' => 1,
            ]);

            $profile->packages()->create([
                'name' => 'Royal Gold Wedding Package',
                'slug' => Str::slug($profile->business_name . ' gold-package'),
                'description' => 'Our most popular comprehensive luxury wedding coverage with 4K drone cinematography.',
                'price' => $pData['starting_price'] * 2.2,
                'duration_hours' => 12,
                'photographer_count' => 2,
                'videographer_count' => 2,
                'edited_photos_count' => 450,
                'raw_photos_included' => true,
                'video_duration_minutes' => 60,
                'cinematic_video' => true,
                'drone' => true,
                'album' => true,
                'album_pages' => 40,
                'travel_included' => true,
                'features' => [
                    '2 Candid Photographers + 2 Cinematographers',
                    'Licensed 4K Aerial Drone Coverage',
                    '450+ Magazine Style Color Graded Photos',
                    'Cinematic 4K Wedding Teaser (3-5 mins)',
                    '60 Min 4K Full Wedding Film',
                    'Premium Hardcover Coffee Table Album (40 Pages)',
                    'Express Delivery within 14 Days',
                ],
                'is_active' => true,
                'sort_order' => 2,
            ]);

            // Portfolios
            $portfolio = Portfolio::create([
                'photographer_profile_id' => $profile->id,
                'category_id' => $catIds[0] ?? null,
                'title' => 'The Grand Royal Wedding — Kabir & Roshni',
                'slug' => Str::slug('kabir-roshni-wedding-' . $profile->id),
                'description' => 'A vibrant 3-day royal celebration filled with traditional traditions, emotional pheras, and energetic sangeet performances.',
                'event_date' => now()->subDays(25),
                'cover_image' => $pData['cover_image'],
                'is_featured' => true,
                'is_approved' => true,
                'view_count' => 320,
            ]);

            $sampleMedia = [
                'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&auto=format&fit=crop&q=80',
                'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&auto=format&fit=crop&q=80',
                'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=800&auto=format&fit=crop&q=80',
                'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?w=800&auto=format&fit=crop&q=80',
                'https://images.unsplash.com/photo-1606800052052-a08af7148866?w=800&auto=format&fit=crop&q=80',
            ];

            foreach ($sampleMedia as $idx => $url) {
                PortfolioMedia::create([
                    'portfolio_id' => $portfolio->id,
                    'media_type' => 'image',
                    'file_path' => $url,
                    'title' => 'Moment ' . ($idx + 1),
                    'sort_order' => $idx + 1,
                    'is_cover' => $idx === 0,
                ]);
            }

            // Availability: mark some dates booked
            PhotographerAvailability::create([
                'photographer_profile_id' => $profile->id,
                'date' => Carbon::now()->addDays(5)->format('Y-m-d'),
                'status' => 'booked',
                'notes' => 'Pre-booked Wedding',
            ]);
            PhotographerAvailability::create([
                'photographer_profile_id' => $profile->id,
                'date' => Carbon::now()->addDays(12)->format('Y-m-d'),
                'status' => 'blocked',
                'notes' => 'Studio Maintenance',
            ]);
        }

        // 7. Seed Sample Bookings, Payments, Earnings & Reviews for Malhotra Studios & Rahul
        $malhotra = PhotographerProfile::first();
        $package = $malhotra->packages()->first();

        // Completed Booking
        $completedBooking = Booking::create([
            'booking_number' => 'BK-2026-000001',
            'customer_id' => $customerUser->id,
            'photographer_profile_id' => $malhotra->id,
            'package_id' => $package->id,
            'event_type' => 'Wedding Photography',
            'event_date' => now()->subDays(15),
            'start_time' => '10:00:00',
            'end_time' => '22:00:00',
            'event_location' => 'The Leela Palace, Chanakyapuri, New Delhi',
            'city' => 'Delhi',
            'state' => 'Delhi NCR',
            'guest_count' => 350,
            'package_price' => 35000,
            'addons_total' => 0,
            'travel_charges' => 0,
            'discount_amount' => 0,
            'gross_amount' => 35000,
            'advance_amount' => 8750,
            'remaining_amount' => 26250,
            'paid_amount' => 35000,
            'booking_status' => 'completed',
            'payment_status' => 'paid',
            'special_instructions' => 'Focus on candid expressions during the varmala and sangeet.',
        ]);

        $completedBooking->recordStatusChange('completed', $admin->id, 'Event completed and full payment settled.');

        // Payments for completed booking
        $p1 = Payment::create([
            'transaction_id' => 'PAY-ADV-849302',
            'booking_id' => $completedBooking->id,
            'user_id' => $customerUser->id,
            'amount' => 8750,
            'currency' => 'INR',
            'gateway' => 'razorpay',
            'payment_type' => 'advance',
            'status' => 'successful',
            'paid_at' => now()->subDays(20),
        ]);

        $p2 = Payment::create([
            'transaction_id' => 'PAY-REM-930281',
            'booking_id' => $completedBooking->id,
            'user_id' => $customerUser->id,
            'amount' => 26250,
            'currency' => 'INR',
            'gateway' => 'razorpay',
            'payment_type' => 'remaining',
            'status' => 'successful',
            'paid_at' => now()->subDays(14),
        ]);

        // Platform Commissions
        PlatformCommission::create([
            'booking_id' => $completedBooking->id,
            'payment_id' => $p1->id,
            'gross_amount' => 8750,
            'commission_percentage' => 10,
            'commission_amount' => 875,
        ]);
        PlatformCommission::create([
            'booking_id' => $completedBooking->id,
            'payment_id' => $p2->id,
            'gross_amount' => 26250,
            'commission_percentage' => 10,
            'commission_amount' => 2625,
        ]);

        // Photographer Earnings
        PhotographerEarning::create([
            'photographer_profile_id' => $malhotra->id,
            'booking_id' => $completedBooking->id,
            'payment_id' => $p1->id,
            'gross_amount' => 8750,
            'commission_rate' => 10,
            'commission_amount' => 875,
            'net_amount' => 7875,
            'status' => 'available',
        ]);
        PhotographerEarning::create([
            'photographer_profile_id' => $malhotra->id,
            'booking_id' => $completedBooking->id,
            'payment_id' => $p2->id,
            'gross_amount' => 26250,
            'commission_rate' => 10,
            'commission_amount' => 2625,
            'net_amount' => 23625,
            'status' => 'available',
        ]);

        // Review
        Review::create([
            'booking_id' => $completedBooking->id,
            'customer_id' => $customerUser->id,
            'photographer_profile_id' => $malhotra->id,
            'rating' => 5,
            'review_text' => 'Arjun and his crew were phenomenal! The candid shots of our parents during the pheras made everyone cry happy tears. Highly recommend their cinematic package!',
            'photographer_reply' => 'Thank you so much Rahul! It was an absolute honor to capture your beautiful family celebration. Wishing you both a lifetime of happiness!',
            'replied_at' => now()->subDays(10),
            'is_approved' => true,
        ]);

        // Upcoming Confirmed Booking
        $upcomingBooking = Booking::create([
            'booking_number' => 'BK-2026-000002',
            'customer_id' => $customerUser->id,
            'photographer_profile_id' => $malhotra->id,
            'package_id' => $package->id,
            'event_type' => 'Pre-Wedding Shoot',
            'event_date' => now()->addDays(18),
            'start_time' => '06:00:00',
            'end_time' => '14:00:00',
            'event_location' => 'Humayun Tomb & Lodhi Art District, New Delhi',
            'city' => 'Delhi',
            'state' => 'Delhi NCR',
            'guest_count' => 2,
            'package_price' => 35000,
            'addons_total' => 0,
            'travel_charges' => 0,
            'discount_amount' => 3500, // WELCOME10 coupon
            'gross_amount' => 31500,
            'advance_amount' => 7875,
            'remaining_amount' => 23625,
            'paid_amount' => 7875,
            'booking_status' => 'confirmed',
            'payment_status' => 'partial',
            'special_instructions' => 'Golden hour sunrise shoot required.',
        ]);

        $upcomingBooking->recordStatusChange('confirmed', $customerUser->id, 'Advance payment confirmed.');

        // Lock date
        PhotographerAvailability::create([
            'photographer_profile_id' => $malhotra->id,
            'date' => now()->addDays(18)->format('Y-m-d'),
            'status' => 'booked',
            'notes' => 'Booked for #' . $upcomingBooking->booking_number,
        ]);
    }
}
