import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import PhotographerLayout from '@/Layouts/PhotographerLayout';
import AdminBadge from '@/Components/AdminBadge';
import { 
    Calendar, 
    Clock, 
    MapPin, 
    CreditCard, 
    CheckCircle2, 
    XCircle, 
    MessageSquare, 
    ArrowLeft, 
    User, 
    Phone, 
    Mail,
    Play,
    Check
} from 'lucide-react';

export default function PhotographerBookingDetail({ booking }) {
    const [rejectReason, setRejectReason] = useState('');
    const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);

    const handleAction = (action, reason = null) => {
        router.post(`/photographer/bookings/${booking.id}/status`, {
            action: action,
            reason: reason,
        });
    };

    return (
        <PhotographerLayout title={`Order #${booking.booking_number}`}>
            
            <div className="mb-6">
                <Link href="/photographer/bookings" className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition">
                    <ArrowLeft size={14} /> Back to All Orders
                </Link>
            </div>

            {/* Top Order Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl mb-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2.5 flex-wrap">
                            <h1 className="text-2xl font-black text-white">{booking.booking_number}</h1>
                            <AdminBadge status={booking.booking_status} />
                            <AdminBadge status={booking.payment_status} />
                        </div>
                        <p className="text-xs text-slate-400 mt-1">
                            Client: <strong className="text-slate-200">{booking.customer?.name}</strong> • Received on {new Date(booking.created_at).toLocaleDateString()}
                        </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap items-center gap-2.5">
                        <Link 
                            href={`/photographer/messages?customer_id=${booking.customer_id}&booking_id=${booking.id}`}
                            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition flex items-center gap-2 border border-slate-700"
                        >
                            <MessageSquare size={14} className="text-emerald-400" />
                            <span>Chat with Client</span>
                        </Link>

                        {/* If Pending: Accept or Reject */}
                        {booking.booking_status === 'pending' && (
                            <>
                                <button
                                    onClick={() => handleAction('accept')}
                                    className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs transition shadow-lg shadow-emerald-500/25 flex items-center gap-2"
                                >
                                    <Check size={15} />
                                    <span>Accept Booking Request</span>
                                </button>
                                <button
                                    onClick={() => setIsRejectModalOpen(true)}
                                    className="px-4 py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 font-bold text-xs transition flex items-center gap-1.5"
                                >
                                    <XCircle size={15} />
                                    <span>Decline</span>
                                </button>
                            </>
                        )}

                        {/* If Confirmed: Start Shoot */}
                        {booking.booking_status === 'confirmed' && (
                            <button
                                onClick={() => handleAction('start')}
                                className="px-5 py-2.5 rounded-xl bg-blue-500 hover:bg-blue-400 text-white font-bold text-xs transition flex items-center gap-2 shadow-lg shadow-blue-500/20"
                            >
                                <Play size={15} />
                                <span>Mark Shoot In-Progress</span>
                            </button>
                        )}

                        {/* If In-Progress: Complete Event */}
                        {booking.booking_status === 'in_progress' && (
                            <button
                                onClick={() => handleAction('complete')}
                                className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs transition shadow-lg shadow-emerald-500/25 flex items-center gap-2"
                            >
                                <CheckCircle2 size={15} />
                                <span>Mark Event Completed</span>
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Left 2 Cols: Client & Event Specs */}
                <div className="lg:col-span-2 space-y-6">
                    
                    {/* Client Card */}
                    <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6">
                        <h2 className="text-base font-bold text-white mb-4">Client Contact & Details</h2>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                            <div className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-800">
                                <span className="text-slate-400 font-medium block mb-1">Customer Name</span>
                                <span className="font-bold text-white text-sm">{booking.customer?.name}</span>
                            </div>
                            <div className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-800">
                                <span className="text-slate-400 font-medium block mb-1">Phone Number</span>
                                <span className="font-bold text-emerald-400 text-sm">{booking.customer?.phone || 'N/A'}</span>
                            </div>
                            <div className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-800">
                                <span className="text-slate-400 font-medium block mb-1">Email Address</span>
                                <span className="font-bold text-white">{booking.customer?.email}</span>
                            </div>
                        </div>
                    </div>

                    {/* Event & Venue Info */}
                    <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6">
                        <h2 className="text-base font-bold text-white mb-4">Shoot Schedule & Venue</h2>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                            <div className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-800">
                                <span className="text-slate-400 font-medium block mb-1">Event Type</span>
                                <span className="font-bold text-white text-sm">{booking.event_type}</span>
                            </div>
                            <div className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-800">
                                <span className="text-slate-400 font-medium block mb-1">Event Date & Time</span>
                                <span className="font-bold text-white text-sm">
                                    {new Date(booking.event_date).toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' })}
                                    {booking.start_time && ` (${booking.start_time.slice(0, 5)} - ${booking.end_time?.slice(0, 5)})`}
                                </span>
                            </div>
                            <div className="sm:col-span-2 p-3.5 rounded-2xl bg-slate-800/60 border border-slate-800">
                                <span className="text-slate-400 font-medium block mb-1">Venue Address</span>
                                <span className="font-bold text-white">{booking.event_location}, {booking.city}, {booking.state}</span>
                            </div>
                        </div>
                    </div>

                    {/* Timeline History */}
                    <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6">
                        <h2 className="text-base font-bold text-white mb-4">Activity Timeline</h2>

                        <div className="space-y-3.5">
                            {booking.status_histories?.map((hist) => (
                                <div key={hist.id} className="flex items-start gap-3 text-xs">
                                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between">
                                            <span className="font-bold text-white capitalize">{hist.new_status.replace('_', ' ')}</span>
                                            <span className="text-slate-500 text-[11px]">{new Date(hist.created_at).toLocaleString()}</span>
                                        </div>
                                        {hist.notes && <p className="text-slate-400 mt-0.5">{hist.notes}</p>}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right 1 Col: Financials */}
                <div className="space-y-6">
                    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-3 text-xs">
                        <h3 className="text-sm font-bold text-white mb-3">Order Financials</h3>

                        <div className="flex justify-between text-slate-400">
                            <span>Package / Base Price</span>
                            <span className="font-semibold text-slate-200">₹{Number(booking.package_price).toLocaleString('en-IN')}</span>
                        </div>
                        {Number(booking.addons_total) > 0 && (
                            <div className="flex justify-between text-slate-400">
                                <span>Add-ons</span>
                                <span className="font-semibold text-slate-200">+₹{Number(booking.addons_total).toLocaleString('en-IN')}</span>
                            </div>
                        )}
                        <hr className="border-slate-800 my-2" />
                        <div className="flex justify-between text-sm font-bold text-white">
                            <span>Gross Booking Value</span>
                            <span className="text-emerald-400 text-base">₹{Number(booking.gross_amount).toLocaleString('en-IN')}</span>
                        </div>
                        <div className="flex justify-between text-xs pt-1">
                            <span className="text-slate-400">Client Paid Amount</span>
                            <span className="font-bold text-emerald-400">₹{Number(booking.paid_amount).toLocaleString('en-IN')}</span>
                        </div>
                    </div>
                </div>

            </div>

            {/* DECLINE MODAL */}
            {isRejectModalOpen && (
                <div className="fixed inset-0 z-200 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl">
                        <h3 className="font-bold text-white text-base mb-2">Decline Booking Request</h3>
                        <p className="text-xs text-slate-400 mb-4">Please provide a reason to notify the client (e.g. date conflict, out of station).</p>

                        <textarea
                            rows="3"
                            placeholder="Reason for declining..."
                            value={rejectReason}
                            onChange={(e) => setRejectReason(e.target.value)}
                            className="form-control mb-4 text-xs"
                        />

                        <div className="flex justify-end gap-2">
                            <button onClick={() => setIsRejectModalOpen(false)} className="btn-secondary">Cancel</button>
                            <button 
                                onClick={() => {
                                    handleAction('reject', rejectReason);
                                    setIsRejectModalOpen(false);
                                }}
                                className="btn-danger"
                            >
                                Confirm Decline
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </PhotographerLayout>
    );
}
