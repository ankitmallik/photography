<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AdminSettingController extends Controller
{
    public function index(): Response
    {
        $settings = Setting::all()->pluck('value', 'key');

        return Inertia::render('Admin/Settings', [
            'settings' => $settings,
        ]);
    }

    public function update(Request $request)
    {
        $data = $request->validate([
            'site_name' => 'required|string|max:255',
            'support_email' => 'required|email',
            'support_phone' => 'nullable|string|max:50',
            'commission_percentage' => 'required|numeric|min:0|max:100',
            'advance_percentage' => 'required|numeric|min:5|max:100',
            'currency_symbol' => 'required|string|max:10',
            'razorpay_key' => 'nullable|string',
            'razorpay_secret' => 'nullable|string',
        ]);

        foreach ($data as $key => $val) {
            Setting::set($key, (string) $val);
        }

        return back()->with('success', 'System settings saved successfully!');
    }
}
