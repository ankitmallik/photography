import React from 'react';
import { Head, Link } from '@inertiajs/react';
import CustomerLayout from '@/Layouts/CustomerLayout';
import AdminBadge from '@/Components/AdminBadge';
import { CalendarCheck, Clock, CheckCircle2, Heart, Search, ArrowRight, Camera, MapPin } from 'lucide-react';

export default function CustomerDashboard({ metrics = {}, recentBookings = [], favorites = [] }) {
    return (
        <CustomerLayout title="My Dashboard">
            
            {/* Header Greeting */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Customer Dashboard</h1>
                    <p className="text-xs text-slate-400 mt-1">Manage your event bookings, payments, and saved photographers.</p>
                </div>
                <Link 
                    href="/photographers" 
                    className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition flex items-center gap-2 shrink-0 shadow-lg shadow-emerald-500/20"
                >
                    <Search size={15} />
                    Explore Photographers
                </Link>
            </div>

            {/* 4 Metric Cards */}
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
                        <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Upcoming Shoots</div>
                        <div className="text-2xl font-black text-amber-400 mt-1">{metrics.upcoming_bookings || 0}</div>
                    </div>
                    <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                        <Clock size={20} />
                    </div>
                </div>

                <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex items-center justify-between">
                    <div>
                        <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Completed Events</div>
                        <div className="text-2xl font-black text-teal-400 mt-1">{metrics.completed_bookings || 0}</div>
                    </div>
                    <div className="p-3 rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/20">
                        <CheckCircle2 size={20} />
                    </div>
                </div>

                <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex items-center justify-between">
                    <div>
                        <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Pending Requests</div>
                        <div className="text-2xl font-black text-blue-400 mt-1">{metrics.pending_requests || 0}</div>
                    </div>
                    <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
                        <Clock size={20} />
                    </div>
                </div>
            </div>

            {/* Recent Bookings & Favorites Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Recent Bookings */}
                <div className="lg:col-span-2 bg-slate-900/60 border border-slate-800 rounded-3xl p-6 shadow-xl">
                    <div className="flex items-center justify-between mb-5">
                        <h2 className="font-bold text-base text-white">Recent Event Bookings</h2>
                        <Link href="/customer/bookings" className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1">
                            View All <ArrowRight size={13} />
                        </Link>
                    </div>

                    {recentBookings.length > 0 ? (
                        <div className="space-y-3">
                            {recentBookings.map((b) => (
                                <Link 
                                    key={b.id}
                                    href={`/customer/bookings/${b.id}`}
                                    className="block p-4 rounded-2xl bg-slate-800/60 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 transition"
                                >
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                        <div className="flex items-center gap-3.5">
                                            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center font-bold">
                                                <Camera size={18} />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <span className="font-bold text-white text-sm">{b.booking_number}</span>
                                                    <AdminBadge status={b.booking_status} />
                                                </div>
                                                <p className="text-xs text-slate-400 mt-0.5">
                                                    {b.photographer?.business_name} • {b.event_type}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="text-right shrink-0">
                                            <div className="text-xs font-bold text-white">₹{Number(b.gross_amount).toLocaleString('en-IN')}</div>
                                            <div className="text-[11px] text-slate-400">{new Date(b.event_date).toLocaleDateString()}</div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-10 text-slate-400 text-xs">
                            No bookings yet.{' '}
                            <Link href="/photographers" className="text-emerald-400 underline font-semibold">
                                Search photographers to make a booking
                            </Link>
                        </div>
                    )}
                </div>

                {/* Saved Favorites */}
                <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 shadow-xl">
                    <div className="flex items-center justify-between mb-5">
                        <h2 className="font-bold text-base text-white flex items-center gap-2">
                            <Heart size={16} className="text-red-400 fill-red-400" />
                            Saved Studios
                        </h2>
                        <Link href="/customer/favorites" className="text-xs font-semibold text-emerald-400 hover:text-emerald-300">
                            All ({favorites.length})
                        </Link>
                    </div>

                    {favorites.length > 0 ? (
                        <div className="space-y-3">
                            {favorites.map((fav) => (
                                <Link 
                                    key={fav.id}
                                    href={`/photographers/${fav.photographer?.slug}`}
                                    className="flex items-center gap-3 p-3 rounded-2xl bg-slate-800/60 hover:bg-slate-800 border border-slate-800 transition"
                                >
                                    <div className="w-10 h-10 rounded-xl bg-slate-800 overflow-hidden shrink-0">
                                        {fav.photographer?.profile_image ? (
                                            <img src={fav.photographer.profile_image} alt={fav.photographer.business_name} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full bg-emerald-600 flex items-center justify-center font-bold text-xs text-white">
                                                {fav.photographer?.business_name?.charAt(0)}
                                            </div>
                                        )}
                                    </div>
                                    <div className="overflow-hidden flex-1">
                                        <h4 className="font-bold text-white text-xs truncate">{fav.photographer?.business_name}</h4>
                                        <p className="text-[11px] text-slate-400 truncate">{fav.photographer?.city || 'India'}</p>
                                    </div>
                                    <div className="text-xs font-bold text-emerald-400 shrink-0">
                                        ₹{Number(fav.photographer?.starting_price || 0).toLocaleString('en-IN')}
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <p className="text-center py-8 text-slate-400 text-xs">
                            No saved photographers yet.
                        </p>
                    )}
                </div>

            </div>

        </CustomerLayout>
    );
}
