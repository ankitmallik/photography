import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import AdminCard from '@/Components/AdminCard';
import AdminBadge from '@/Components/AdminBadge';
import { 
    DollarSign, 
    TrendingUp, 
    CalendarCheck, 
    Camera, 
    Users, 
    ShieldAlert, 
    ArrowRight, 
    CheckCircle2, 
    Clock, 
    Sparkles 
} from 'lucide-react';

export default function AdminDashboard({ metrics = {}, recentBookings = [], pendingPhotographers = [] }) {
    return (
        <AdminLayout title="Admin Overview">
            
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Platform Overview</h1>
                    <p className="text-xs text-slate-400 mt-1">Real-time marketplace revenue, booking volume, and studio audits.</p>
                </div>

                {pendingPhotographers.length > 0 && (
                    <Link 
                        href="/admin/photographers/pending"
                        className="px-4 py-2.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400 font-bold text-xs flex items-center gap-2 hover:bg-amber-500/25 transition"
                    >
                        <ShieldAlert size={16} />
                        <span>{pendingPhotographers.length} Studios Awaiting Verification</span>
                    </Link>
                )}
            </div>

            {/* KPI Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <AdminCard 
                    title="Total Marketplace GMV"
                    value={`₹${Number(metrics.total_revenue || 0).toLocaleString('en-IN')}`}
                    subtitle="Gross booking volume"
                    icon={DollarSign}
                    color="emerald"
                />
                <AdminCard 
                    title="Platform Commission"
                    value={`₹${Number(metrics.total_commission || 0).toLocaleString('en-IN')}`}
                    subtitle="Net marketplace earnings"
                    icon={TrendingUp}
                    color="purple"
                />
                <AdminCard 
                    title="Total Bookings"
                    value={metrics.total_bookings || 0}
                    subtitle={`${metrics.completed_bookings || 0} completed shoots`}
                    icon={CalendarCheck}
                    color="blue"
                />
                <AdminCard 
                    title="Active Photographers"
                    value={metrics.total_photographers || 0}
                    subtitle={`${metrics.pending_photographers || 0} pending audit`}
                    icon={Camera}
                    color="amber"
                />
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Left 2 Cols: Recent Bookings */}
                <div className="lg:col-span-2 bg-slate-900/60 border border-slate-800 rounded-3xl p-6 shadow-xl">
                    <div className="flex items-center justify-between mb-5">
                        <h2 className="font-bold text-base text-white">Recent Marketplace Bookings</h2>
                        <Link href="/admin/bookings" className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1">
                            View All Orders <ArrowRight size={13} />
                        </Link>
                    </div>

                    {recentBookings.length > 0 ? (
                        <div className="table-responsive">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Order Number</th>
                                        <th>Customer</th>
                                        <th>Photographer</th>
                                        <th>Total (₹)</th>
                                        <th>Status</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recentBookings.map((b) => (
                                        <tr key={b.id}>
                                            <td className="font-bold text-white text-xs">{b.booking_number}</td>
                                            <td className="text-slate-300 text-xs">{b.customer?.name}</td>
                                            <td className="text-emerald-400 text-xs font-medium">{b.photographer?.business_name}</td>
                                            <td className="font-bold text-white text-xs">₹{Number(b.gross_amount).toLocaleString('en-IN')}</td>
                                            <td>
                                                <AdminBadge status={b.booking_status} />
                                            </td>
                                            <td>
                                                <Link href={`/admin/bookings/${b.id}`} className="text-xs text-emerald-400 hover:underline font-semibold">
                                                    Inspect
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p className="text-center py-10 text-slate-400 text-xs">No bookings recorded yet.</p>
                    )}
                </div>

                {/* Right 1 Col: Pending Studio Verifications */}
                <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 shadow-xl">
                    <div className="flex items-center justify-between mb-5">
                        <h2 className="font-bold text-base text-white flex items-center gap-2">
                            <Clock size={16} className="text-amber-400" />
                            Studio Audit Queue
                        </h2>
                        <Link href="/admin/photographers/pending" className="text-xs font-semibold text-amber-400 hover:text-amber-300">
                            Queue ({pendingPhotographers.length})
                        </Link>
                    </div>

                    {pendingPhotographers.length > 0 ? (
                        <div className="space-y-3">
                            {pendingPhotographers.slice(0, 5).map((p) => (
                                <div key={p.id} className="p-3.5 rounded-2xl bg-slate-800/70 border border-slate-800 flex items-center justify-between text-xs">
                                    <div>
                                        <h4 className="font-bold text-white">{p.business_name}</h4>
                                        <p className="text-[11px] text-slate-400">{p.city} • {p.experience_years}+ Yrs Exp</p>
                                    </div>
                                    <Link 
                                        href={`/admin/photographers/${p.id}/verification`}
                                        className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition"
                                    >
                                        Audit
                                    </Link>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-10 text-slate-400 text-xs">
                            <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2 opacity-60" />
                            <p>No studios currently pending verification.</p>
                        </div>
                    )}
                </div>

            </div>

        </AdminLayout>
    );
}
