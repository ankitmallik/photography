import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import CustomerLayout from '@/Layouts/CustomerLayout';
import AdminBadge from '@/Components/AdminBadge';
import AdminPagination from '@/Components/AdminPagination';
import { CalendarCheck, ChevronRight, Camera, Search, Filter } from 'lucide-react';

export default function CustomerBookings({ bookings, currentStatus = 'all' }) {
    const statuses = [
        { id: 'all', label: 'All Bookings' },
        { id: 'pending', label: 'Pending Requests' },
        { id: 'accepted', label: 'Accepted (Pay Advance)' },
        { id: 'confirmed', label: 'Confirmed' },
        { id: 'in_progress', label: 'In Progress' },
        { id: 'completed', label: 'Completed' },
        { id: 'cancelled', label: 'Cancelled / Rejected' },
    ];

    const filterStatus = (status) => {
        if (status === 'all') {
            router.get('/customer/bookings');
        } else {
            router.get('/customer/bookings', { status: status });
        }
    };

    return (
        <CustomerLayout title="My Bookings">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-extrabold text-white">Event Bookings</h1>
                    <p className="text-xs text-slate-400 mt-0.5">Track your photography appointments, payments, and invoices.</p>
                </div>

                <Link href="/photographers" className="btn-primary btn-sm flex items-center gap-1.5 self-start">
                    <Search size={14} /> New Booking
                </Link>
            </div>

            {/* Status Filter Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-6 no-scrollbar">
                {statuses.map((s) => (
                    <button
                        key={s.id}
                        onClick={() => filterStatus(s.id)}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                            currentStatus === s.id
                                ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
                        }`}
                    >
                        {s.label}
                    </button>
                ))}
            </div>

            {/* Bookings List */}
            {bookings.data && bookings.data.length > 0 ? (
                <div className="space-y-4">
                    {bookings.data.map((b) => (
                        <div 
                            key={b.id}
                            className="bg-slate-900/70 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-slate-700 transition"
                        >
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center font-bold shrink-0">
                                    <Camera size={22} />
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <span className="font-extrabold text-white text-base">{b.booking_number}</span>
                                        <AdminBadge status={b.booking_status} />
                                        <AdminBadge status={b.payment_status} />
                                    </div>
                                    <h3 className="font-bold text-sm text-slate-200 mt-1">
                                        {b.photographer?.business_name || 'Studio'}
                                    </h3>
                                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 mt-1.5">
                                        <span>📅 {new Date(b.event_date).toLocaleDateString('en-IN', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}</span>
                                        <span>•</span>
                                        <span>📍 {b.city}</span>
                                        <span>•</span>
                                        <span>📦 {b.package?.name || b.event_type}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex sm:flex-col items-center sm:items-end justify-between border-t sm:border-t-0 border-slate-800 pt-3 sm:pt-0 gap-2 shrink-0">
                                <div className="text-left sm:text-right">
                                    <div className="text-xs text-slate-400">Total Booking Price</div>
                                    <div className="text-base font-black text-emerald-400">
                                        ₹{Number(b.gross_amount).toLocaleString('en-IN')}
                                    </div>
                                    {b.booking_status === 'accepted' && b.paid_amount == 0 && (
                                        <span className="text-[10px] text-amber-400 font-bold block">
                                            Pay ₹{Number(b.advance_amount).toLocaleString('en-IN')} Advance
                                        </span>
                                    )}
                                </div>

                                <Link 
                                    href={`/customer/bookings/${b.id}`}
                                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-emerald-500 hover:text-slate-950 font-bold text-xs text-slate-200 transition flex items-center gap-1.5"
                                >
                                    <span>View Details</span>
                                    <ChevronRight size={14} />
                                </Link>
                            </div>
                        </div>
                    ))}

                    <AdminPagination links={bookings.links} />
                </div>
            ) : (
                <div className="text-center py-16 bg-slate-900/40 rounded-3xl border border-slate-800 p-8">
                    <CalendarCheck className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                    <h3 className="text-base font-bold text-white">No Bookings Found</h3>
                    <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1 mb-6">
                        You don't have any bookings in this status category.
                    </p>
                    <Link href="/photographers" className="btn-primary">
                        Find & Book Photographers
                    </Link>
                </div>
            )}

        </CustomerLayout>
    );
}
