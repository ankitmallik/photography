<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AdminCustomerController extends Controller
{
    public function index(Request $request): Response
    {
        $query = User::where('role', 'customer')
            ->with(['customerProfile', 'customerBookings' => function ($q) {
                $q->latest();
            }])
            ->withCount('customerBookings')
            ->latest();

        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('phone', 'like', "%{$search}%");
            });
        }

        if ($status = $request->input('status')) {
            $query->where('status', $status);
        }

        $customers = $query->paginate(15)->withQueryString();

        return Inertia::render('Admin/Customers', [
            'customers' => $customers,
            'filters' => $request->all(),
        ]);
    }

    public function toggleStatus(int $id)
    {
        $customer = User::where('role', 'customer')->findOrFail($id);
        $customer->status = ($customer->status === 'active') ? 'suspended' : 'active';
        $customer->save();

        return back()->with('success', 'Customer account status changed to ' . $customer->status);
    }
}
