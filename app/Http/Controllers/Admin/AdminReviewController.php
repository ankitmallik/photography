<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Review;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AdminReviewController extends Controller
{
    public function index(Request $request): Response
    {
        $query = Review::with(['customer', 'photographer', 'booking'])->latest();

        if ($request->has('is_approved')) {
            $query->where('is_approved', $request->boolean('is_approved'));
        }

        $reviews = $query->paginate(15)->withQueryString();

        return Inertia::render('Admin/Reviews', [
            'reviews' => $reviews,
            'filters' => $request->all(),
        ]);
    }

    public function toggleApproval(int $id)
    {
        $review = Review::findOrFail($id);
        $review->is_approved = !$review->is_approved;
        $review->save();

        return back()->with('success', $review->is_approved ? 'Review approved.' : 'Review hidden.');
    }

    public function destroy(int $id)
    {
        $review = Review::findOrFail($id);
        $review->delete();

        return back()->with('success', 'Review deleted successfully.');
    }
}
