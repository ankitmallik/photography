import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import PhotographerLayout from '@/Layouts/PhotographerLayout';
import StarRating from '@/Components/StarRating';
import AdminPagination from '@/Components/AdminPagination';
import { Star, MessageSquare, Send } from 'lucide-react';

export default function PhotographerReviews({ reviews }) {
    const [replyingReviewId, setReplyingReviewId] = useState(null);
    const { data, setData, post, processing, reset } = useForm({
        reply: '',
    });

    const handleReplySubmit = (reviewId) => {
        post(`/photographer/reviews/${reviewId}/reply`, {
            preserveScroll: true,
            onSuccess: () => {
                setReplyingReviewId(null);
                reset();
            },
        });
    };

    return (
        <PhotographerLayout title="Client Reviews">
            
            <div className="mb-6">
                <h1 className="text-2xl font-extrabold text-white">Client Reviews & Testimonials</h1>
                <p className="text-xs text-slate-400 mt-0.5">Read feedback from clients and post official studio responses.</p>
            </div>

            {reviews.data && reviews.data.length > 0 ? (
                <div className="space-y-4">
                    {reviews.data.map((rev) => (
                        <div key={rev.id} className="bg-slate-900/70 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <span className="font-bold text-white text-sm">{rev.customer?.name}</span>
                                        {rev.booking && (
                                            <span className="text-xs text-slate-400">
                                                (Order #{rev.booking.booking_number})
                                            </span>
                                        )}
                                    </div>
                                    <span className="text-[11px] text-slate-500">{new Date(rev.created_at).toLocaleDateString()}</span>
                                </div>
                                <StarRating rating={rev.rating} showCount={false} size="md" />
                            </div>

                            <p className="text-xs text-slate-300 leading-relaxed italic bg-slate-800/40 p-4 rounded-2xl border border-slate-800">
                                "{rev.review_text}"
                            </p>

                            {/* Existing Studio Reply */}
                            {rev.photographer_reply ? (
                                <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-xs">
                                    <span className="font-bold text-emerald-400 block mb-1">Your Studio Reply:</span>
                                    <p className="text-slate-200">{rev.photographer_reply}</p>
                                </div>
                            ) : replyingReviewId === rev.id ? (
                                <div className="space-y-2 pt-2">
                                    <textarea 
                                        rows="2"
                                        placeholder="Write a professional thank you or reply..."
                                        value={data.reply}
                                        onChange={(e) => setData('reply', e.target.value)}
                                        className="form-control text-xs"
                                    />
                                    <div className="flex justify-end gap-2">
                                        <button onClick={() => setReplyingReviewId(null)} className="btn-secondary btn-sm">Cancel</button>
                                        <button 
                                            onClick={() => handleReplySubmit(rev.id)} 
                                            disabled={processing || !data.reply.trim()} 
                                            className="btn-primary btn-sm"
                                        >
                                            {processing ? 'Posting...' : 'Post Reply'}
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <button 
                                    onClick={() => {
                                        setReplyingReviewId(rev.id);
                                        setData('reply', '');
                                    }}
                                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 flex items-center gap-1.5"
                                >
                                    <MessageSquare size={13} />
                                    <span>Reply to Client</span>
                                </button>
                            )}
                        </div>
                    ))}

                    <AdminPagination links={reviews.links} />
                </div>
            ) : (
                <div className="text-center py-16 bg-slate-900/40 rounded-3xl border border-slate-800 p-8">
                    <Star className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                    <h3 className="text-base font-bold text-white">No Reviews Yet</h3>
                    <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
                        Completed event bookings will invite clients to rate and review your studio.
                    </p>
                </div>
            )}

        </PhotographerLayout>
    );
}
