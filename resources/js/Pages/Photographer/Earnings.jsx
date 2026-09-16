import React from 'react';
import { Head, Link } from '@inertiajs/react';
import PhotographerLayout from '@/Layouts/PhotographerLayout';
import AdminPagination from '@/Components/AdminPagination';
import { TrendingUp, CreditCard, ArrowRight, Building, CheckCircle2 } from 'lucide-react';

export default function PhotographerEarnings({ earnings, totalEarnings = 0, availableBalance = 0, paidOut = 0, bankAccount = null }) {
    return (
        <PhotographerLayout title="Earnings Ledger">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-extrabold text-white">Studio Earnings & Ledger</h1>
                    <p className="text-xs text-slate-400 mt-0.5">Track your net revenues after platform commission deductions.</p>
                </div>

                <Link href="/photographer/payouts" className="btn-primary btn-sm flex items-center gap-1.5 self-start">
                    <CreditCard size={14} /> Request Payout
                </Link>
            </div>

            {/* Top Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">Total Net Earned</span>
                    <div className="text-3xl font-black text-white">₹{Number(totalEarnings).toLocaleString('en-IN')}</div>
                    <span className="text-[11px] text-emerald-400 font-medium block mt-1">From all completed bookings</span>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">Available for Payout</span>
                    <div className="text-3xl font-black text-emerald-400">₹{Number(availableBalance).toLocaleString('en-IN')}</div>
                    <span className="text-[11px] text-slate-400 font-medium block mt-1">Ready for withdrawal</span>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">Total Paid Out</span>
                    <div className="text-3xl font-black text-slate-300">₹{Number(paidOut).toLocaleString('en-IN')}</div>
                    <span className="text-[11px] text-slate-400 font-medium block mt-1">Deposited to bank account</span>
                </div>
            </div>

            {/* Earnings Transactions Table */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 shadow-xl">
                <h3 className="font-bold text-base text-white mb-4">Earnings History</h3>

                {earnings.data && earnings.data.length > 0 ? (
                    <div className="table-responsive">
                        <table>
                            <thead>
                                <tr>
                                    <th>Booking</th>
                                    <th>Gross Amount</th>
                                    <th>Platform Commission</th>
                                    <th>Net Payout Amount</th>
                                    <th>Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {earnings.data.map((e) => (
                                    <tr key={e.id}>
                                        <td>
                                            <span className="font-bold text-white block">{e.booking?.booking_number}</span>
                                            <span className="text-slate-400 text-xs">{e.booking?.customer?.name}</span>
                                        </td>
                                        <td className="font-semibold text-slate-200">
                                            ₹{Number(e.gross_amount).toLocaleString('en-IN')}
                                        </td>
                                        <td className="text-red-400 font-medium">
                                            -₹{Number(e.commission_amount).toLocaleString('en-IN')} ({e.commission_rate}%)
                                        </td>
                                        <td className="font-extrabold text-emerald-400 text-sm">
                                            ₹{Number(e.net_amount).toLocaleString('en-IN')}
                                        </td>
                                        <td className="text-slate-400 text-xs">
                                            {new Date(e.created_at).toLocaleDateString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        <AdminPagination links={earnings.links} />
                    </div>
                ) : (
                    <p className="text-center py-10 text-slate-400 text-xs italic">
                        No earnings records generated yet.
                    </p>
                )}
            </div>

        </PhotographerLayout>
    );
}
