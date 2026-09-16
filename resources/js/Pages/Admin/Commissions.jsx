import React from 'react';
import { Head } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import AdminPagination from '@/Components/AdminPagination';
import { TrendingUp, DollarSign, Percent } from 'lucide-react';

export default function AdminCommissions({ commissions, totalCommission = 0 }) {
    return (
        <AdminLayout title="Platform Commissions">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-extrabold text-white">Platform Commission Revenue</h1>
                    <p className="text-xs text-slate-400 mt-0.5">Summary of marketplace transaction commissions earned from completed shoots.</p>
                </div>

                <div className="p-4 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-xs">
                    <span className="text-slate-400 block mb-0.5">Total Platform Revenue</span>
                    <span className="text-2xl font-black text-purple-400">₹{Number(totalCommission).toLocaleString('en-IN')}</span>
                </div>
            </div>

            <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 shadow-xl">
                {commissions.data && commissions.data.length > 0 ? (
                    <div className="table-responsive">
                        <table>
                            <thead>
                                <tr>
                                    <th>Booking</th>
                                    <th>Photographer</th>
                                    <th>Gross Volume</th>
                                    <th>Commission %</th>
                                    <th>Earned Commission (₹)</th>
                                    <th>Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {commissions.data.map((c) => (
                                    <tr key={c.id}>
                                        <td className="font-bold text-white text-xs">{c.booking?.booking_number}</td>
                                        <td className="text-emerald-400 text-xs font-semibold">{c.photographer?.business_name}</td>
                                        <td className="text-slate-200 text-xs font-semibold">₹{Number(c.booking_amount).toLocaleString('en-IN')}</td>
                                        <td className="text-slate-300 text-xs">{c.commission_percentage}%</td>
                                        <td className="font-extrabold text-purple-400 text-sm">₹{Number(c.commission_amount).toLocaleString('en-IN')}</td>
                                        <td className="text-slate-400 text-xs">{new Date(c.created_at).toLocaleDateString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        <AdminPagination links={commissions.links} />
                    </div>
                ) : (
                    <p className="text-center py-10 text-slate-400 text-xs italic">No commissions logged yet.</p>
                )}
            </div>

        </AdminLayout>
    );
}
