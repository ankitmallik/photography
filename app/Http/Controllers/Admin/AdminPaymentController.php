<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Payment;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AdminPaymentController extends Controller
{
    public function index(Request $request): Response
    {
        $query = Payment::with(['booking.photographer', 'user'])->latest();

        if ($type = $request->input('payment_type')) {
            $query->where('payment_type', $type);
        }

        if ($status = $request->input('status')) {
            $query->where('status', $status);
        }

        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('transaction_id', 'like', "%{$search}%")
                  ->orWhereHas('user', function ($uq) use ($search) {
                      $uq->where('name', 'like', "%{$search}%")->orWhere('email', 'like', "%{$search}%");
                  });
            });
        }

        $payments = $query->paginate(15)->withQueryString();
        $totalCollected = Payment::where('status', 'successful')->sum('amount');

        return Inertia::render('Admin/Payments', [
            'payments' => $payments,
            'totalCollected' => (float) $totalCollected,
            'filters' => $request->all(),
        ]);
    }
}
