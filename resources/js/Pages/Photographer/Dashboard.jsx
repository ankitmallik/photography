import React from 'react';
import { Head, Link } from '@inertiajs/react';
import PhotographerLayout from '@/Layouts/PhotographerLayout';
import AdminBadge from '@/Components/AdminBadge';
import StarRating from '@/Components/StarRating';
import { 
    CalendarCheck, 
    TrendingUp, 
    CreditCard, 
    Star, 
    Clock, 
    ArrowRight, 
    Camera, 
    CheckCircle2, 
    Plus,
    Calendar,
    Users
} from 'lucide-react';

export default function PhotographerDashboard({ profile, metrics = {}, recentBookings = [], recentReviews = [] }) {
    return (
        <PhotographerLayout title="Studio Dashboard">
            
            {/* Header Greeting */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Studio Console</h1>
                    <p className="text-xs text-slate-400 mt-1">Manage your event bookings, client communications, and earnings.</p>
                </div>

                <div className="flex items-center gap-2.5">
                    <Link href="/photographer/packages" className="btn-secondary btn-sm flex items-center gap-1.5">
                        <Plus size={14} /> New Package
                    </Link>
                    <Link href="/photographer/availability" className="btn-primary btn-sm flex items-center gap-1.5">
                        <Calendar size={14} /> Calendar
                    </Link>
                </div>
            </div>

            {/* Top Metric Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex items-center justify-between">
                    <div>
                        <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Total Bookings</div>
                        <div className="text-2xl font-black text-white mt-1">{metrics.total_bookings || 0}</div>
                    </div>
                    <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        <CalendarCheck size={20} />
                    </div>
                </div>

                <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex items-center justify-between">
                    <div>
                        <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Total Earnings</div>
                        <div className="text-2xl font-black text-emerald-400 mt-1">
                            ₹{Number(metrics.total_earnings || 0).toLocaleString('en-IN')}
                        </div>
                    </div>
                    <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        <TrendingUp size={20} />
                    </div>
                </div>

                <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex items-center justify-between">
                    <div>
                        <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Available Balance</div>
                        <div className="text-2xl font-black text-amber-400 mt-1">
                            ₹{Number(metrics.available_balance || 0).toLocaleString('en-IN')}
                        </div>
                    </div>
                    <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                        <CreditCard size={20} />
                    </div>
                </div>

                <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex items-center justify-between">
                    <div>
                        <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Client Rating</div>
                        <div className="text-2xl font-black text-teal-400 mt-1 flex items-center gap-1">
                            {metrics.average_rating || '5.0'} ★
                        </div>
                    </div>
                    <div className="p-3 rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/20">
                        <Star size={20} />
                    </div>
                </div>
            </div>

            {/* Bookings & Reviews Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Recent Bookings Queue */}
                <div className="lg:col-span-2 bg-slate-900/60 border border-slate-800 rounded-3xl p-6 shadow-xl">
                    <div className="flex items-center justify-between mb-5">
                        <h2 className="font-bold text-base text-white">Recent Booking Requests</h2>
                        <Link href="/photographer/bookings" className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1">
                            View All <ArrowRight size={13} />
                        </Link>
                    </div>

                    {recentBookings.length > 0 ? (
                        <div className="space-y-3">
                            {recentBookings.map((b) => (
                                <Link 
                                    key={b.id}
                                    href={`/photographer/bookings/${b.id}`}
                                    className="block p-4 rounded-2xl bg-slate-800/60 hover:bg-slate-800 border border-slate-800 transition"
                                >
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center font-bold">
                                                <Camera size={18} />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <span className="font-bold text-white text-sm">{b.booking_number}</span>
                                                    <AdminBadge status={b.booking_status} />
                                                </div>
                                                <p className="text-xs text-slate-400 mt-0.5">
                                                    Client: <strong className="text-slate-200">{b.customer?.name}</strong> • {b.event_type}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="text-right shrink-0">
                                            <div className="text-xs font-bold text-emerald-400">
                                                ₹{Number(b.gross_amount).toLocaleString('en-IN')}
                                            </div>
                                            <div className="text-[11px] text-slate-400">
                                                📅 {new Date(b.event_date).toLocaleDateString()}
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-10 text-slate-400 text-xs">
                            No booking requests received yet.
                        </div>
                    )}
                </div>

                {/* Recent Reviews & Ratings */}
                <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 shadow-xl">
                    <div className="flex items-center justify-between mb-5">
                        <h2 className="font-bold text-base text-white">Client Feedback</h2>
                        <Link href="/photographer/reviews" className="text-xs font-semibold text-emerald-400 hover:text-emerald-300">
                            All Reviews
                        </Link>
                    </div>

                    {recentReviews.length > 0 ? (
                        <div className="space-y-3.5">
                            {recentReviews.map((rev) => (
                                <div key={rev.id} className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-800 text-xs">
                                    <div className="flex items-center justify-between mb-1.5">
                                        <span className="font-bold text-white">{rev.customer?.name}</span>
                                        <StarRating rating={rev.rating} showCount={false} size="sm" />
                                    </div>
                                    <p className="text-slate-300 italic line-clamp-2">"{rev.review_text}"</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-center py-8 text-slate-400 text-xs">
                            No client reviews yet.
                        </p>
                    )}
                </div>

            </div>

        </PhotographerLayout>
    );
}
