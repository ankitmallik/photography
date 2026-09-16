import React, { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import AdminBadge from '@/Components/AdminBadge';
import AdminPagination from '@/Components/AdminPagination';
import { CreditCard, CheckCircle2, XCircle, X, Building } from 'lucide-react';

export default function AdminPayouts({ payouts }) {
    const [selectedPayout, setSelectedPayout] = useState(null);
    const [modalType, setModalType] = useState(null); // 'complete' or 'reject'

    const completeForm = useForm({
        transaction_reference: '',
    });

    const rejectForm = useForm({
        rejection_reason: '',
    });

    const handleCompleteSubmit = (e) => {
        e.preventDefault();
        completeForm.post(`/admin/payouts/${selectedPayout.id}/complete`, {
            onSuccess: () => {
                setSelectedPayout(null);
                setModalType(null);
            },
        });
    };

    const handleRejectSubmit = (e) => {
        e.preventDefault();
        rejectForm.post(`/admin/payouts/${selectedPayout.id}/reject`, {
            onSuccess: () => {
                setSelectedPayout(null);
                setModalType(null);
            },
        });
    };

    return (
        <AdminLayout title="Photographer Payouts">
            
            <div className="mb-6">
                <h1 className="text-2xl font-extrabold text-white">Photographer Payout Requests</h1>
                <p className="text-xs text-slate-400 mt-0.5">Process bank withdrawals and record transaction reference numbers.</p>
            </div>

            <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 shadow-xl">
                {payouts.data && payouts.data.length > 0 ? (
                    <div className="table-responsive">
                        <table>
                            <thead>
                                <tr>
                                    <th>Photographer</th>
                                    <th>Amount (₹)</th>
                                    <th>Method</th>
                                    <th>Status</th>
                                    <th>Reference ID</th>
                                    <th>Date</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {payouts.data.map((p) => (
                                    <tr key={p.id}>
                                        <td>
                                            <span className="font-bold text-white text-xs block">{p.photographer?.business_name}</span>
                                            <span className="text-slate-400 text-[11px]">{p.photographer?.user?.name}</span>
                                        </td>
                                        <td className="font-black text-emerald-400 text-sm">₹{Number(p.amount).toLocaleString('en-IN')}</td>
                                        <td className="text-slate-300 text-xs capitalize">{p.payout_method.replace('_', ' ')}</td>
                                        <td>
                                            <AdminBadge status={p.status} />
                                        </td>
                                        <td className="font-mono text-slate-400 text-xs">{p.transaction_reference || '—'}</td>
                                        <td className="text-slate-400 text-xs">{new Date(p.requested_at).toLocaleDateString()}</td>
                                        <td>
                                            {p.status === 'pending' && (
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => {
                                                            setSelectedPayout(p);
                                                            setModalType('complete');
                                                        }}
                                                        className="px-2.5 py-1 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition"
                                                    >
                                                        Mark Paid
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            setSelectedPayout(p);
                                                            setModalType('reject');
                                                        }}
                                                        className="px-2.5 py-1 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 font-semibold text-xs"
                                                    >
                                                        Reject
                                                    </button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        <AdminPagination links={payouts.links} />
                    </div>
                ) : (
                    <p className="text-center py-10 text-slate-400 text-xs italic">No payout requests found.</p>
                )}
            </div>

            {/* COMPLETE MODAL */}
            {modalType === 'complete' && selectedPayout && (
                <div className="fixed inset-0 z-200 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-bold text-white text-base">Complete Payout (₹{Number(selectedPayout.amount).toLocaleString('en-IN')})</h3>
                            <button onClick={() => setModalType(null)} className="text-slate-400 hover:text-white">
                                <X size={18} />
                            </button>
                        </div>

                        <form onSubmit={handleCompleteSubmit} className="space-y-4 text-xs">
                            <div>
                                <label className="block text-slate-300 font-semibold mb-1">Bank UTR / Transaction Reference *</label>
                                <input 
                                    type="text"
                                    placeholder="e.g. UTR123456789"
                                    value={completeForm.data.transaction_reference}
                                    onChange={(e) => completeForm.setData('transaction_reference', e.target.value)}
                                    required
                                    className="form-control"
                                />
                            </div>

                            <button type="submit" disabled={completeForm.processing} className="w-full btn-primary">
                                {completeForm.processing ? 'Saving...' : 'Confirm Bank Transfer Completed'}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* REJECT MODAL */}
            {modalType === 'reject' && selectedPayout && (
                <div className="fixed inset-0 z-200 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-bold text-white text-base">Reject Payout Request</h3>
                            <button onClick={() => setModalType(null)} className="text-slate-400 hover:text-white">
                                <X size={18} />
                            </button>
                        </div>

                        <form onSubmit={handleRejectSubmit} className="space-y-4 text-xs">
                            <div>
                                <label className="block text-slate-300 font-semibold mb-1">Rejection Reason *</label>
                                <textarea 
                                    rows="3"
                                    placeholder="e.g. Invalid bank account details..."
                                    value={rejectForm.data.rejection_reason}
                                    onChange={(e) => rejectForm.setData('rejection_reason', e.target.value)}
                                    required
                                    className="form-control"
                                />
                            </div>

                            <button type="submit" disabled={rejectForm.processing} className="w-full btn-danger">
                                {rejectForm.processing ? 'Rejecting...' : 'Confirm Rejection (Refund to Studio)'}
                            </button>
                        </form>
                    </div>
                </div>
            )}

        </AdminLayout>
    );
}
