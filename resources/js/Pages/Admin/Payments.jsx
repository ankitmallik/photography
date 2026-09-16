import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import AdminBadge from '@/Components/AdminBadge';
import AdminPagination from '@/Components/AdminPagination';
import { Search, CreditCard, DollarSign } from 'lucide-react';

export default function AdminPayments({ payments, totalCollected = 0, filters = {} }) {
    const [search, setSearch] = useState(filters.q || '');

    const handleSearch = (e) => {
        e.preventDefault();
        router.get('/admin/payments', { q: search }, { preserveState: true });
    };

    return (
        <AdminLayout title="Payment Gateway Transactions">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-extrabold text-white">Payment Transactions</h1>
                    <p className="text-xs text-slate-400 mt-0.5">All customer advance & remaining balance payments processed via Razorpay.</p>
                </div>

                <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-xs">
                    <span className="text-slate-400 block">Total Payments Collected</span>
                    <span className="text-xl font-black text-emerald-400">₹{Number(totalCollected).toLocaleString('en-IN')}</span>
                </div>
            </div>

            <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 shadow-xl">
                {payments.data && payments.data.length > 0 ? (
                    <div className="table-responsive">
                        <table>
                            <thead>
                                <tr>
                                    <th>Transaction ID</th>
                                    <th>Booking</th>
                                    <th>Payer</th>
                                    <th>Type</th>
                                    <th>Amount (₹)</th>
                                    <th>Status</th>
                                    <th>Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {payments.data.map((p) => (
                                    <tr key={p.id}>
                                        <td className="font-mono text-emerald-400 text-xs font-bold">{p.transaction_id}</td>
                                        <td className="text-white text-xs font-semibold">{p.booking?.booking_number}</td>
                                        <td className="text-slate-300 text-xs">{p.user?.name} ({p.user?.email})</td>
                                        <td className="text-slate-400 text-xs capitalize">{p.payment_type}</td>
                                        <td className="font-extrabold text-white text-xs">₹{Number(p.amount).toLocaleString('en-IN')}</td>
                                        <td>
                                            <AdminBadge status={p.status} />
                                        </td>
                                        <td className="text-slate-400 text-xs">{new Date(p.created_at).toLocaleString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        <AdminPagination links={payments.links} />
                    </div>
                ) : (
                    <p className="text-center py-10 text-slate-400 text-xs italic">No transactions recorded.</p>
                )}
            </div>

        </AdminLayout>
    );
}
