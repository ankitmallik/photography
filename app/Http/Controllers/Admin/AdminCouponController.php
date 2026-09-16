<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Coupon;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AdminCouponController extends Controller
{
    public function index(): Response
    {
        $coupons = Coupon::latest()->get();

        return Inertia::render('Admin/Coupons', [
            'coupons' => $coupons,
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'code' => 'required|string|max:50|unique:coupons,code',
            'discount_type' => 'required|in:percentage,fixed',
            'discount_value' => 'required|numeric|min:1',
            'min_booking_amount' => 'nullable|numeric|min:0',
            'max_discount_amount' => 'nullable|numeric|min:0',
            'usage_limit' => 'nullable|numeric|min:1',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'is_active' => 'boolean',
        ]);

        $data['code'] = strtoupper(trim($data['code']));

        Coupon::create($data);

        return back()->with('success', 'Coupon created successfully!');
    }

    public function update(Request $request, int $id)
    {
        $coupon = Coupon::findOrFail($id);

        $data = $request->validate([
            'code' => 'required|string|max:50|unique:coupons,code,' . $coupon->id,
            'discount_type' => 'required|in:percentage,fixed',
            'discount_value' => 'required|numeric|min:1',
            'min_booking_amount' => 'nullable|numeric|min:0',
            'max_discount_amount' => 'nullable|numeric|min:0',
            'usage_limit' => 'nullable|numeric|min:1',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date',
            'is_active' => 'boolean',
        ]);

        $data['code'] = strtoupper(trim($data['code']));

        $coupon->update($data);

        return back()->with('success', 'Coupon updated successfully!');
    }

    public function destroy(int $id)
    {
        $coupon = Coupon::findOrFail($id);
        $coupon->delete();

        return back()->with('success', 'Coupon deleted successfully!');
    }
}
