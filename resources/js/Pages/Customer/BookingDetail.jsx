import React, { useState } from 'react';
import { Head, Link, useForm, router } from '@inertiajs/react';
import CustomerLayout from '@/Layouts/CustomerLayout';
import AdminBadge from '@/Components/AdminBadge';
import StarRating from '@/Components/StarRating';
import { 
    Calendar, 
    Clock, 
    MapPin, 
    CreditCard, 
    CheckCircle2, 
    AlertCircle, 
    MessageSquare, 
    Star, 
    ArrowLeft, 
    ShieldCheck, 
    Camera, 
    X,
    FileText
} from 'lucide-react';

export default function CustomerBookingDetail({ booking }) {
    const [isPayModalOpen, setIsPayModalOpen] = useState(false);
    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
    const [selectedPaymentType, setSelectedPaymentType] = useState('advance');

    // Pay Form
    const payForm = useForm({
        payment_type: 'advance',
        amount: Number(booking.advance_amount),
    });

    // Review Form
    const reviewForm = useForm({
        rating: 5,
        review_text: '',
    });

    const handlePaySubmit = (e) => {
        e.preventDefault();
        payForm.post(`/customer/bookings/${booking.id}/pay`, {
            onSuccess: () => setIsPayModalOpen(false),
        });
    };

    const handleReviewSubmit = (e) => {
        e.preventDefault();
        reviewForm.post(`/customer/bookings/${booking.id}/reviews`, {
            onSuccess: () => setIsReviewModalOpen(false),
        });
    };

    const handleCancel = () => {
        if (confirm('Are you sure you want to cancel this booking request?')) {
            router.post(`/customer/bookings/${booking.id}/cancel`, {
                reason: 'Cancelled by customer',
            });
        }
    };

    const remainingToPay = Number(booking.gross_amount) - Number(booking.paid_amount);

    return (
        <CustomerLayout title={`Booking #${booking.booking_number}`}>
            
            {/* Top Return Link */}
            <div className="mb-6">
                <Link href="/customer/bookings" className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition">
                    <ArrowLeft size={14} /> Back to All Bookings
                </Link>
            </div>

            {/* Header Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl mb-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2.5 flex-wrap">
                            <h1 className="text-2xl font-black text-white">{booking.booking_number}</h1>
                            <AdminBadge status={booking.booking_status} />
                            <AdminBadge status={booking.payment_status} />
                        </div>
                        <p className="text-xs text-slate-400 mt-1">
                            Booked with <strong className="text-slate-200">{booking.photographer?.business_name}</strong> on {new Date(booking.created_at).toLocaleDateString()}
                        </p>
                    </div>

                    {/* Action Triggers */}
                    <div className="flex flex-wrap items-center gap-2.5">
                        {/* Chat Button */}
                        <Link 
                            href={`/customer/messages?photographer_id=${booking.photographer?.user_id}&booking_id=${booking.id}`}
                            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition flex items-center gap-2 border border-slate-700"
                        >
                            <MessageSquare size={14} className="text-emerald-400" />
                            <span>Chat with Studio</span>
                        </Link>

                        {/* Pay Advance Button if Accepted */}
                        {booking.booking_status === 'accepted' && booking.paid_amount == 0 && (
                            <button
                                onClick={() => {
                                    setSelectedPaymentType('advance');
                                    payForm.setData({
                                        payment_type: 'advance',
                                        amount: Number(booking.advance_amount),
                                    });
                                    setIsPayModalOpen(true);
                                }}
                                className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs transition shadow-lg shadow-emerald-500/25 flex items-center gap-2"
                            >
                                <CreditCard size={15} />
                                <span>Pay Advance (₹{Number(booking.advance_amount).toLocaleString('en-IN')})</span>
                            </button>
                        )}

                        {/* Pay Remaining Button if In-progress or completed and partial paid */}
                        {['confirmed', 'in_progress', 'completed'].includes(booking.booking_status) && remainingToPay > 0 && (
                            <button
                                onClick={() => {
                                    setSelectedPaymentType('remaining');
                                    payForm.setData({
                                        payment_type: 'remaining',
                                        amount: remainingToPay,
                                    });
                                    setIsPayModalOpen(true);
                                }}
                                className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition shadow-lg shadow-amber-500/25 flex items-center gap-2"
                            >
                                <CreditCard size={15} />
                                <span>Pay Remaining Balance (₹{remainingToPay.toLocaleString('en-IN')})</span>
                            </button>
                        )}

                        {/* Leave Review Button if completed and no review */}
                        {booking.booking_status === 'completed' && !booking.review && (
                            <button
                                onClick={() => setIsReviewModalOpen(true)}
                                className="px-5 py-2.5 rounded-xl bg-purple-500 hover:bg-purple-400 text-white font-bold text-xs transition flex items-center gap-2 shadow-lg shadow-purple-500/20"
                            >
                                <Star size={15} />
                                <span>Leave a Review</span>
                            </button>
                        )}

                        {/* Cancel Button if pending or accepted */}
                        {['pending', 'accepted'].includes(booking.booking_status) && (
                            <button
                                onClick={handleCancel}
                                className="px-4 py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 font-bold text-xs transition"
                            >
                                Cancel Request
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Left 2 Cols: Event Details & Timeline */}
                <div className="lg:col-span-2 space-y-6">
                    
                    {/* Event & Venue Info */}
                    <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6">
                        <h2 className="text-base font-bold text-white mb-4">Event & Venue Information</h2>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                            <div className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-800">
                                <span className="text-slate-400 font-medium block mb-1">Event Type</span>
                                <span className="font-bold text-white text-sm">{booking.event_type}</span>
                            </div>
                            <div className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-800">
                                <span className="text-slate-400 font-medium block mb-1">Event Date & Time</span>
                                <span className="font-bold text-white text-sm">
                                    {new Date(booking.event_date).toLocaleDateString('en-IN', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
                                    {booking.start_time && ` (${booking.start_time.slice(0, 5)} - ${booking.end_time?.slice(0, 5)})`}
                                </span>
                            </div>
                            <div className="sm:col-span-2 p-3.5 rounded-2xl bg-slate-800/60 border border-slate-800">
                                <span className="text-slate-400 font-medium block mb-1">Venue Location</span>
                                <span className="font-bold text-white">{booking.event_location}, {booking.city}, {booking.state}</span>
                            </div>
                            {booking.special_instructions && (
                                <div className="sm:col-span-2 p-3.5 rounded-2xl bg-slate-800/60 border border-slate-800">
                                    <span className="text-slate-400 font-medium block mb-1">Special Instructions</span>
                                    <p className="text-slate-300 italic">{booking.special_instructions}</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Package & Addons */}
                    <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6">
                        <h2 className="text-base font-bold text-white mb-4">Package & Deliverables</h2>
                        
                        {booking.package ? (
                            <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/80 mb-4">
                                <div className="flex items-center justify-between">
                                    <span className="font-extrabold text-sm text-white">{booking.package.name}</span>
                                    <span className="font-black text-emerald-400">₹{Number(booking.package_price).toLocaleString('en-IN')}</span>
                                </div>
                                <p className="text-xs text-slate-400 mt-1">{booking.package.description}</p>
                            </div>
                        ) : (
                            <div className="text-xs text-slate-400 mb-4">Custom Service Booking (₹{Number(booking.package_price).toLocaleString('en-IN')})</div>
                        )}

                        {booking.addons && booking.addons.length > 0 && (
                            <div>
                                <h4 className="text-xs uppercase font-bold text-slate-400 mb-2">Selected Add-ons</h4>
                                <div className="space-y-1.5">
                                    {booking.addons.map((add) => (
                                        <div key={add.id} className="flex justify-between p-2.5 rounded-xl bg-slate-800/40 text-xs">
                                            <span className="text-slate-300">{add.name}</span>
                                            <span className="font-semibold text-emerald-400">+₹{Number(add.price).toLocaleString('en-IN')}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Booking Status Timeline */}
                    <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6">
                        <h2 className="text-base font-bold text-white mb-4">Booking Activity History</h2>

                        <div className="space-y-4">
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

                    {/* Review Display if exists */}
                    {booking.review && (
                        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6">
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="text-base font-bold text-white">Your Submitted Review</h3>
                                <StarRating rating={booking.review.rating} showCount={false} />
                            </div>
                            <p className="text-xs text-slate-300 italic mb-3">"{booking.review.review_text}"</p>
                            {booking.review.photographer_reply && (
                                <div className="p-3 rounded-xl bg-slate-800 text-xs">
                                    <span className="font-bold text-emerald-400 block mb-1">Reply from Studio:</span>
                                    <p className="text-slate-300">{booking.review.photographer_reply}</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Right 1 Col: Financial Summary & Payments */}
                <div className="space-y-6">
                    
                    {/* Price Breakdown */}
                    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-3 text-xs">
                        <h3 className="text-sm font-bold text-white mb-3">Payment Summary</h3>

                        <div className="flex justify-between text-slate-400">
                            <span>Package / Base Price</span>
                            <span className="font-semibold text-slate-200">₹{Number(booking.package_price).toLocaleString('en-IN')}</span>
                        </div>
                        {Number(booking.addons_total) > 0 && (
                            <div className="flex justify-between text-slate-400">
                                <span>Add-on Equipment</span>
                                <span className="font-semibold text-slate-200">+₹{Number(booking.addons_total).toLocaleString('en-IN')}</span>
                            </div>
                        )}
                        {Number(booking.discount_amount) > 0 && (
                            <div className="flex justify-between text-emerald-400 font-semibold">
                                <span>Discount / Promo</span>
                                <span>-₹{Number(booking.discount_amount).toLocaleString('en-IN')}</span>
                            </div>
                        )}
                        <hr className="border-slate-800 my-2" />
                        <div className="flex justify-between text-sm font-bold text-white">
                            <span>Gross Booking Total</span>
                            <span className="text-emerald-400 text-base">₹{Number(booking.gross_amount).toLocaleString('en-IN')}</span>
                        </div>
                        <div className="flex justify-between text-xs pt-1">
                            <span className="text-slate-400">Total Paid Amount</span>
                            <span className="font-bold text-emerald-400">₹{Number(booking.paid_amount).toLocaleString('en-IN')}</span>
                        </div>
                        <div className="flex justify-between text-xs pt-1 border-t border-slate-800">
                            <span className="text-slate-400">Balance Remaining</span>
                            <span className="font-bold text-amber-400">₹{remainingToPay.toLocaleString('en-IN')}</span>
                        </div>
                    </div>

                    {/* Payment Transactions Ledger */}
                    <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6">
                        <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                            <CreditCard size={16} className="text-emerald-400" />
                            Payment Receipts
                        </h3>

                        {booking.payments && booking.payments.length > 0 ? (
                            <div className="space-y-2.5">
                                {booking.payments.map((p) => (
                                    <div key={p.id} className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700/80 text-xs">
                                        <div className="flex items-center justify-between font-bold text-white">
                                            <span>₹{Number(p.amount).toLocaleString('en-IN')}</span>
                                            <span className="text-emerald-400 text-[11px] uppercase font-bold">{p.status}</span>
                                        </div>
                                        <div className="text-slate-400 text-[11px] mt-1 flex justify-between">
                                            <span>{p.transaction_id}</span>
                                            <span>{p.payment_type}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-xs text-slate-400 italic">No payments recorded yet.</p>
                        )}
                    </div>
                </div>
            </div>

            {/* PAY ADVANCE / REMAINING MODAL */}
            {isPayModalOpen && (
                <div className="fixed inset-0 z-200 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-bold text-white text-base">Make Payment</h3>
                            <button onClick={() => setIsPayModalOpen(false)} className="text-slate-400 hover:text-white">
                                <X size={18} />
                            </button>
                        </div>

                        <form onSubmit={handlePaySubmit} className="space-y-4">
                            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-slate-300">
                                <div className="flex items-center justify-between font-bold text-white mb-1">
                                    <span>Payment Type: {selectedPaymentType === 'advance' ? '25% Advance Deposit' : 'Remaining Balance'}</span>
                                </div>
                                <div className="text-2xl font-black text-emerald-400 mt-2">
                                    ₹{Number(payForm.data.amount).toLocaleString('en-IN')}
                                </div>
                            </div>

                            <div className="field">
                                <label className="text-xs text-slate-400">Payment Gateway</label>
                                <div className="p-3 rounded-xl bg-slate-800 border border-slate-700 text-xs font-bold text-white flex items-center justify-between">
                                    <span>Razorpay Secure (UPI, Cards, NetBanking)</span>
                                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                                </div>
                            </div>

                            <button 
                                type="submit" 
                                disabled={payForm.processing}
                                className="w-full py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm transition shadow-lg shadow-emerald-500/25"
                            >
                                {payForm.processing ? 'Processing...' : `Confirm & Pay ₹${Number(payForm.data.amount).toLocaleString('en-IN')}`}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* REVIEW MODAL */}
            {isReviewModalOpen && (
                <div className="fixed inset-0 z-200 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-bold text-white text-base">Rate & Review Studio</h3>
                            <button onClick={() => setIsReviewModalOpen(false)} className="text-slate-400 hover:text-white">
                                <X size={18} />
                            </button>
                        </div>

                        <form onSubmit={handleReviewSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-slate-300 mb-2">Rating</label>
                                <div className="flex gap-2">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            type="button"
                                            onClick={() => reviewForm.setData('rating', star)}
                                            className={`p-2 rounded-xl border font-bold text-sm transition ${
                                                reviewForm.data.rating >= star
                                                    ? 'bg-amber-400 text-slate-950 border-amber-400'
                                                    : 'bg-slate-800 border-slate-700 text-slate-400'
                                            }`}
                                        >
                                            ★ {star}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Your Feedback</label>
                                <textarea
                                    rows="4"
                                    placeholder="How was your experience with the photography team, candid shots, delivery time, and overall service?"
                                    value={reviewForm.data.review_text}
                                    onChange={(e) => reviewForm.setData('review_text', e.target.value)}
                                    required
                                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-emerald-500"
                                />
                            </div>

                            <button 
                                type="submit" 
                                disabled={reviewForm.processing}
                                className="w-full py-3 rounded-xl bg-purple-500 hover:bg-purple-400 text-white font-bold text-xs transition"
                            >
                                {reviewForm.processing ? 'Submitting Review...' : 'Submit Verified Review'}
                            </button>
                        </form>
                    </div>
                </div>
            )}

        </CustomerLayout>
    );
}
