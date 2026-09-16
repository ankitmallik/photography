<?php

use App\Http\Controllers\Admin\AdminBookingController;
use App\Http\Controllers\Admin\AdminCategoryController;
use App\Http\Controllers\Admin\AdminCommissionController;
use App\Http\Controllers\Admin\AdminCouponController;
use App\Http\Controllers\Admin\AdminCustomerController;
use App\Http\Controllers\Admin\AdminDashboardController;
use App\Http\Controllers\Admin\AdminPaymentController;
use App\Http\Controllers\Admin\AdminPayoutController;
use App\Http\Controllers\Admin\AdminPhotographerController;
use App\Http\Controllers\Admin\AdminReportController;
use App\Http\Controllers\Admin\AdminReviewController;
use App\Http\Controllers\Admin\AdminSettingController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\Customer\CustomerController;
use App\Http\Controllers\Photographer\PhotographerDashboardController;
use App\Http\Controllers\Public\PublicController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Public Marketplace Routes
|--------------------------------------------------------------------------
*/
Route::get('/', [PublicController::class, 'home'])->name('home');
Route::get('/photographers', [PublicController::class, 'photographers'])->name('photographers.index');
Route::get('/photographers/{slug}', [PublicController::class, 'show'])->name('photographers.show');
Route::post('/api/coupons/validate', [PublicController::class, 'validateCoupon'])->name('coupons.validate');

/*
|--------------------------------------------------------------------------
| Authentication Routes
|--------------------------------------------------------------------------
*/
Route::middleware('guest')->group(function () {
    Route::get('/login', [AuthController::class, 'showLogin'])->name('login');
    Route::post('/login', [AuthController::class, 'login']);

    Route::get('/register', [AuthController::class, 'showCustomerRegister'])->name('register');
    Route::post('/register', [AuthController::class, 'registerCustomer']);

    Route::get('/register/photographer', [AuthController::class, 'showPhotographerRegister'])->name('register.photographer');
    Route::post('/register/photographer', [AuthController::class, 'registerPhotographer']);
});

Route::post('/logout', [AuthController::class, 'logout'])->name('logout')->middleware('auth');

/*
|--------------------------------------------------------------------------
| Customer Portal Routes (Role: customer)
|--------------------------------------------------------------------------
*/
Route::middleware(['auth', 'role:customer,admin'])->prefix('customer')->name('customer.')->group(function () {
    Route::get('/dashboard', [CustomerController::class, 'dashboard'])->name('dashboard');
    Route::get('/profile', [CustomerController::class, 'profile'])->name('profile');
    Route::post('/profile', [CustomerController::class, 'updateProfile'])->name('profile.update');

    Route::get('/bookings', [CustomerController::class, 'bookings'])->name('bookings');
    Route::post('/bookings/request', [CustomerController::class, 'requestBooking'])->name('bookings.request');
    Route::get('/bookings/{id}', [CustomerController::class, 'showBooking'])->name('bookings.show');
    Route::post('/bookings/{id}/pay', [CustomerController::class, 'payBooking'])->name('bookings.pay');
    Route::post('/bookings/{id}/cancel', [CustomerController::class, 'cancelBooking'])->name('bookings.cancel');

    Route::get('/favorites', [CustomerController::class, 'favorites'])->name('favorites');
    Route::post('/favorites/toggle', [CustomerController::class, 'toggleFavorite'])->name('favorites.toggle');

    Route::post('/bookings/{id}/reviews', [CustomerController::class, 'submitReview'])->name('reviews.submit');

    Route::get('/messages', [CustomerController::class, 'messages'])->name('messages');
    Route::post('/messages/send', [CustomerController::class, 'sendMessage'])->name('messages.send');
});

/*
|--------------------------------------------------------------------------
| Photographer Portal Routes (Role: photographer)
|--------------------------------------------------------------------------
*/
Route::middleware(['auth', 'role:photographer,admin'])->prefix('photographer')->name('photographer.')->group(function () {
    Route::get('/dashboard', [PhotographerDashboardController::class, 'dashboard'])->name('dashboard');
    Route::get('/profile', [PhotographerDashboardController::class, 'profile'])->name('profile');
    Route::post('/profile', [PhotographerDashboardController::class, 'updateProfile'])->name('profile.update');

    // Services CRUD
    Route::get('/services', [PhotographerDashboardController::class, 'services'])->name('services');
    Route::post('/services', [PhotographerDashboardController::class, 'storeService'])->name('services.store');
    Route::put('/services/{id}', [PhotographerDashboardController::class, 'updateService'])->name('services.update');
    Route::delete('/services/{id}', [PhotographerDashboardController::class, 'deleteService'])->name('services.destroy');

    // Packages CRUD
    Route::get('/packages', [PhotographerDashboardController::class, 'packages'])->name('packages');
    Route::post('/packages', [PhotographerDashboardController::class, 'storePackage'])->name('packages.store');
    Route::put('/packages/{id}', [PhotographerDashboardController::class, 'updatePackage'])->name('packages.update');
    Route::delete('/packages/{id}', [PhotographerDashboardController::class, 'deletePackage'])->name('packages.destroy');

    // Portfolios
    Route::get('/portfolio', [PhotographerDashboardController::class, 'portfolios'])->name('portfolio');
    Route::post('/portfolio', [PhotographerDashboardController::class, 'storePortfolio'])->name('portfolio.store');
    Route::delete('/portfolio/{id}', [PhotographerDashboardController::class, 'deletePortfolio'])->name('portfolio.destroy');

    // Availability Calendar
    Route::get('/availability', [PhotographerDashboardController::class, 'availability'])->name('availability');
    Route::post('/availability', [PhotographerDashboardController::class, 'updateAvailability'])->name('availability.update');

    // Bookings
    Route::get('/bookings', [PhotographerDashboardController::class, 'bookings'])->name('bookings');
    Route::get('/bookings/{id}', [PhotographerDashboardController::class, 'showBooking'])->name('bookings.show');
    Route::post('/bookings/{id}/status', [PhotographerDashboardController::class, 'updateBookingStatus'])->name('bookings.status');

    // Finance & Payouts
    Route::get('/earnings', [PhotographerDashboardController::class, 'earnings'])->name('earnings');
    Route::get('/payouts', [PhotographerDashboardController::class, 'payouts'])->name('payouts');
    Route::post('/payouts/request', [PhotographerDashboardController::class, 'requestPayout'])->name('payouts.request');
    Route::post('/bank-details', [PhotographerDashboardController::class, 'updateBankDetails'])->name('bank.update');

    // Reviews & Messages
    Route::get('/reviews', [PhotographerDashboardController::class, 'reviews'])->name('reviews');
    Route::post('/reviews/{id}/reply', [PhotographerDashboardController::class, 'replyReview'])->name('reviews.reply');
    Route::get('/messages', [PhotographerDashboardController::class, 'messages'])->name('messages');
    Route::post('/messages/send', [PhotographerDashboardController::class, 'sendMessage'])->name('messages.send');
});

/*
|--------------------------------------------------------------------------
| Admin Console Routes (Role: admin)
|--------------------------------------------------------------------------
*/
Route::middleware(['auth', 'role:admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/dashboard', [AdminDashboardController::class, 'dashboard'])->name('dashboard');

    // Customer Management
    Route::get('/customers', [AdminCustomerController::class, 'index'])->name('customers.index');
    Route::post('/customers/{id}/status', [AdminCustomerController::class, 'toggleStatus'])->name('customers.status');

    // Photographer Management & Verification
    Route::get('/photographers', [AdminPhotographerController::class, 'index'])->name('photographers.index');
    Route::get('/photographers/pending', [AdminPhotographerController::class, 'pending'])->name('photographers.pending');
    Route::get('/photographers/{id}', [AdminPhotographerController::class, 'show'])->name('photographers.show');
    Route::post('/photographers/{id}/verify', [AdminPhotographerController::class, 'updateVerification'])->name('photographers.verify');
    Route::post('/photographers/{id}/feature', [AdminPhotographerController::class, 'toggleFeatured'])->name('photographers.feature');

    // Categories
    Route::get('/categories', [AdminCategoryController::class, 'index'])->name('categories.index');
    Route::post('/categories', [AdminCategoryController::class, 'store'])->name('categories.store');
    Route::put('/categories/{id}', [AdminCategoryController::class, 'update'])->name('categories.update');
    Route::delete('/categories/{id}', [AdminCategoryController::class, 'destroy'])->name('categories.destroy');

    // Bookings
    Route::get('/bookings', [AdminBookingController::class, 'index'])->name('bookings.index');
    Route::get('/bookings/{id}', [AdminBookingController::class, 'show'])->name('bookings.show');
    Route::post('/bookings/{id}/status', [AdminBookingController::class, 'updateStatus'])->name('bookings.status');

    // Payments & Commissions
    Route::get('/payments', [AdminPaymentController::class, 'index'])->name('payments.index');
    Route::get('/commissions', [AdminCommissionController::class, 'index'])->name('commissions.index');
    Route::post('/commissions/rate', [AdminCommissionController::class, 'updateRate'])->name('commissions.rate');

    // Payouts
    Route::get('/payouts', [AdminPayoutController::class, 'index'])->name('payouts.index');
    Route::post('/payouts/{id}/status', [AdminPayoutController::class, 'updateStatus'])->name('payouts.status');

    // Reviews & Reports
    Route::get('/reviews', [AdminReviewController::class, 'index'])->name('reviews.index');
    Route::post('/reviews/{id}/approval', [AdminReviewController::class, 'toggleApproval'])->name('reviews.approval');
    Route::delete('/reviews/{id}', [AdminReviewController::class, 'destroy'])->name('reviews.destroy');

    Route::get('/reports', [AdminReportController::class, 'index'])->name('reports.index');
    Route::post('/reports/{id}/status', [AdminReportController::class, 'updateStatus'])->name('reports.status');

    // Coupons & Settings
    Route::get('/coupons', [AdminCouponController::class, 'index'])->name('coupons.index');
    Route::post('/coupons', [AdminCouponController::class, 'store'])->name('coupons.store');
    Route::put('/coupons/{id}', [AdminCouponController::class, 'update'])->name('coupons.update');
    Route::delete('/coupons/{id}', [AdminCouponController::class, 'destroy'])->name('coupons.destroy');

    Route::get('/settings', [AdminSettingController::class, 'index'])->name('settings.index');
    Route::post('/settings', [AdminSettingController::class, 'update'])->name('settings.update');
});
