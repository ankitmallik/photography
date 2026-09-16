<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Report;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AdminReportController extends Controller
{
    public function index(Request $request): Response
    {
        $query = Report::with(['reporter', 'reportable'])->latest();

        if ($status = $request->input('status')) {
            $query->where('status', $status);
        }

        $reports = $query->paginate(15)->withQueryString();

        return Inertia::render('Admin/Reports', [
            'reports' => $reports,
            'filters' => $request->all(),
        ]);
    }

    public function updateStatus(Request $request, int $id)
    {
        $report = Report::findOrFail($id);

        $request->validate([
            'status' => 'required|in:reviewed,resolved,dismissed',
            'admin_notes' => 'nullable|string',
        ]);

        $report->update([
            'status' => $request->input('status'),
            'admin_notes' => $request->input('admin_notes') ?? $report->admin_notes,
            'resolved_by' => auth()->id(),
        ]);

        return back()->with('success', 'Report status updated to: ' . ucfirst($request->input('status')));
    }
}
