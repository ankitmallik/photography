import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import AdminBadge from '@/Components/AdminBadge';
import { ArrowLeft, Calendar, MapPin, CreditCard, ShieldAlert } from 'lucide-react';

export default function AdminBookingDetail({ booking }) {
    const [statusOverride, setStatusOverride] = useState(booking.booking_status);
    const [overrideNotes, setOverrideNotes] = useState('');
    const [isUpdating, setIsUpdating] = useState(false);

    const handleUpdateStatus = (e) => {
        e.preventDefault();
        setIsUpdating(true);
        router.post(`/admin/bookings/${booking.id}/status`, {
            booking_status: statusOverride,
            notes: overrideNotes,
        }, {
            onFinish: () => setIsUpdating(false),
        });
    };

    return (
        <AdminLayout title={`Order #${booking.booking_number}`}>
            
            <div className="mb-6">
                <Link href="/admin/bookings" className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition">
                    <ArrowLeft size={14} /> Back to Orders
                </Link>
            </div>

            {/* Header */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl mb-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2.5 flex-wrap">
                            <h1 className="text-2xl font-black text-white">{booking.booking_number}</h1>
                            <AdminBadge status={booking.booking_status} />
                            <AdminBadge status={booking.payment_status} />
                        </div>
                        <p className="text-xs text-slate-400 mt-1">
                            Placed on {new Date(booking.created_at).toLocaleString()}
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Left 2 Cols: Order & Party Details */}
                <div className="lg:col-span-2 space-y-6">
                    
                    {/* Parties Involved */}
                    <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6">
                        <h2 className="text-base font-bold text-white mb-4">Parties Involved</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                            <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-800">
                                <span className="text-slate-400 font-semibold block mb-1">Customer Details</span>
                                <h4 className="font-bold text-white text-sm">{booking.customer?.name}</h4>
                                <p className="text-slate-300 mt-1">{booking.customer?.email}</p>
                                <p className="text-emerald-400">{booking.customer?.phone || 'No phone'}</p>
                            </div>
                            <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-800">
                                <span className="text-slate-400 font-semibold block mb-1">Photographer Studio</span>
                                <h4 className="font-bold text-white text-sm">{booking.photographer?.business_name}</h4>
                                <p className="text-slate-300 mt-1">{booking.photographer?.user?.name} ({booking.photographer?.user?.email})</p>
                                <p className="text-emerald-400">{booking.photographer?.city}, {booking.photographer?.state}</p>
                            </div>
                        </div>
                    </div>

                    {/* Shoot Specs */}
                    <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 text-xs space-y-3">
                        <h2 className="text-base font-bold text-white mb-2">Shoot & Package Specifications</h2>
                        <div className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-800">
                            <span className="text-slate-400 block mb-1 font-medium">Event Type & Date</span>
                            <span className="font-bold text-white text-sm">{booking.event_type} • {new Date(booking.event_date).toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' })}</span>
                        </div>
                        <div className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-800">
                            <span className="text-slate-400 block mb-1 font-medium">Venue Address</span>
                            <span className="font-bold text-white">{booking.event_location}, {booking.city}, {booking.state}</span>
                        </div>
                    </div>

                    {/* Timeline */}
                    <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6">
                        <h2 className="text-base font-bold text-white mb-4">Status Change Timeline</h2>
                        <div className="space-y-3">
                            {booking.status_histories?.map((hist) => (
                                <div key={hist.id} className="flex items-start gap-3 text-xs">
                                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                                    <div>
                                        <span className="font-bold text-white capitalize">{hist.new_status.replace('_', ' ')}</span>
                                        <span className="text-slate-500 text-[11px] ml-2">{new Date(hist.created_at).toLocaleString()}</span>
                                        {hist.notes && <p className="text-slate-400 text-[11px] mt-0.5">{hist.notes}</p>}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right 1 Col: Status Override & Financials */}
                <div className="space-y-6">
                    
                    {/* Admin Status Override Card */}
                    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
                        <h3 className="font-bold text-base text-white mb-3 flex items-center gap-2">
                            <ShieldAlert size={16} className="text-amber-400" />
                            Admin Status Override
                        </h3>

                        <form onSubmit={handleUpdateStatus} className="space-y-3 text-xs">
                            <div>
                                <label className="block text-slate-300 font-semibold mb-1">Set Booking Status</label>
                                <select 
                                    value={statusOverride}
                                    onChange={(e) => setStatusOverride(e.target.value)}
                                    className="form-control"
                                >
                                    <option value="pending">Pending</option>
                                    <option value="accepted">Accepted</option>
                                    <option value="confirmed">Confirmed</option>
                                    <option value="in_progress">In Progress</option>
                                    <option value="completed">Completed</option>
                                    <option value="cancelled">Cancelled</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-slate-300 font-semibold mb-1">Audit Notes</label>
                                <textarea 
                                    rows="2"
                                    placeholder="Reason for manual override..."
                                    value={overrideNotes}
                                    onChange={(e) => setOverrideNotes(e.target.value)}
                                    className="form-control"
                                />
                            </div>

                            <button type="submit" disabled={isUpdating} className="w-full btn-primary">
                                {isUpdating ? 'Updating...' : 'Update Status'}
                            </button>
                        </form>
                    </div>

                    {/* Financial Summary */}
                    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-2 text-xs">
                        <h3 className="text-sm font-bold text-white mb-2">Order Breakdown</h3>
                        <div className="flex justify-between text-slate-400">
                            <span>Base / Package</span>
                            <span className="font-semibold text-slate-200">₹{Number(booking.package_price).toLocaleString('en-IN')}</span>
                        </div>
                        <div className="flex justify-between text-slate-400">
                            <span>Add-ons</span>
                            <span className="font-semibold text-slate-200">+₹{Number(booking.addons_total).toLocaleString('en-IN')}</span>
                        </div>
                        <hr className="border-slate-800 my-2" />
                        <div className="flex justify-between text-sm font-bold text-white">
                            <span>Gross Total</span>
                            <span className="text-emerald-400 text-base">₹{Number(booking.gross_amount).toLocaleString('en-IN')}</span>
                        </div>
                        <div className="flex justify-between text-xs pt-1">
                            <span className="text-slate-400">Paid by Customer</span>
                            <span className="font-bold text-emerald-400">₹{Number(booking.paid_amount).toLocaleString('en-IN')}</span>
                        </div>
                    </div>
                </div>

            </div>

        </AdminLayout>
    );
}
