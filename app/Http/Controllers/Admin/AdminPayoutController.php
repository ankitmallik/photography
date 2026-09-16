<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Payout;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AdminPayoutController extends Controller
{
    public function index(Request $request): Response
    {
        $query = Payout::with('photographer.user')->latest();

        if ($status = $request->input('status')) {
            $query->where('status', $status);
        }

        $payouts = $query->paginate(15)->withQueryString();

        $totalPaid = Payout::where('status', 'completed')->sum('amount');
        $pendingPayoutsSum = Payout::where('status', 'pending')->sum('amount');

        return Inertia::render('Admin/Payouts', [
            'payouts' => $payouts,
            'totalPaid' => (float) $totalPaid,
            'pendingPayoutsSum' => (float) $pendingPayoutsSum,
            'filters' => $request->all(),
        ]);
    }

    public function updateStatus(Request $request, int $id)
    {
        $payout = Payout::findOrFail($id);

        $request->validate([
            'status' => 'required|in:processing,completed,rejected',
            'transaction_reference' => 'nullable|string|max:100',
            'admin_notes' => 'nullable|string',
        ]);

        $status = $request->input('status');

        $payout->update([
            'status' => $status,
            'transaction_reference' => $request->input('transaction_reference') ?? $payout->transaction_reference,
            'admin_notes' => $request->input('admin_notes') ?? $payout->admin_notes,
            'processed_at' => ($status === 'completed') ? now() : $payout->processed_at,
        ]);

        return back()->with('success', 'Payout request updated to: ' . ucfirst($status));
    }
}
