<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\PhotographerProfile;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AdminPhotographerController extends Controller
{
    public function index(Request $request): Response
    {
        $query = PhotographerProfile::with(['user', 'categories', 'locations'])->latest();

        if ($status = $request->input('verification_status')) {
            $query->where('verification_status', $status);
        }

        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('business_name', 'like', "%{$search}%")
                  ->orWhere('city', 'like', "%{$search}%")
                  ->orWhereHas('user', function ($uq) use ($search) {
                      $uq->where('name', 'like', "%{$search}%")
                         ->orWhere('email', 'like', "%{$search}%")
                         ->orWhere('phone', 'like', "%{$search}%");
                  });
            });
        }

        $photographers = $query->paginate(15)->withQueryString();

        return Inertia::render('Admin/Photographers', [
            'photographers' => $photographers,
            'filters' => $request->all(),
        ]);
    }

    public function pending(): Response
    {
        $photographers = PhotographerProfile::where('verification_status', 'pending')
            ->with(['user', 'categories', 'locations'])
            ->latest()
            ->paginate(15);

        return Inertia::render('Admin/Photographers', [
            'photographers' => $photographers,
            'filters' => ['verification_status' => 'pending'],
            'isPendingOnly' => true,
        ]);
    }

    public function show(int $id): Response
    {
        $photographer = PhotographerProfile::with([
            'user',
            'categories',
            'locations',
            'services',
            'packages',
            'portfolios.media',
            'bankAccounts',
            'reviews.customer',
            'bookings' => function ($q) {
                $q->latest()->take(10);
            },
        ])->findOrFail($id);

        return Inertia::render('Admin/PhotographerVerification', [
            'photographer' => $photographer,
        ]);
    }

    public function updateVerification(Request $request, int $id)
    {
        $photographer = PhotographerProfile::findOrFail($id);

        $request->validate([
            'status' => 'required|in:approved,rejected,suspended,pending',
            'rejection_reason' => 'nullable|string|max:1000',
        ]);

        $status = $request->input('status');
        $rejectionReason = $request->input('rejection_reason');

        $photographer->verification_status = $status;
        $photographer->rejection_reason = ($status === 'rejected') ? $rejectionReason : null;
        $photographer->save();

        $msg = match ($status) {
            'approved' => 'Photographer approved! Profile is now publicly visible.',
            'rejected' => 'Photographer application rejected with reason.',
            'suspended' => 'Photographer profile has been suspended.',
            default => 'Verification status updated.',
        };

        return back()->with('success', $msg);
    }

    public function toggleFeatured(int $id)
    {
        $photographer = PhotographerProfile::findOrFail($id);
        $photographer->is_featured = !$photographer->is_featured;
        $photographer->featured_until = $photographer->is_featured ? now()->addMonths(3) : null;
        $photographer->save();

        return back()->with('success', $photographer->is_featured ? 'Photographer marked as Featured!' : 'Photographer removed from featured.');
    }
}
