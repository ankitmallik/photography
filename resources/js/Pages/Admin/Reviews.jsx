import React from 'react';
import { Head, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import StarRating from '@/Components/StarRating';
import AdminPagination from '@/Components/AdminPagination';
import { Star, Trash2 } from 'lucide-react';

export default function AdminReviews({ reviews }) {
    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete / hide this review from public display?')) {
            router.delete(`/admin/reviews/${id}`);
        }
    };

    return (
        <AdminLayout title="Reviews Moderation">
            
            <div className="mb-6">
                <h1 className="text-2xl font-extrabold text-white">Client Reviews & Moderation</h1>
                <p className="text-xs text-slate-400 mt-0.5">Audit customer feedback and ratings across the marketplace.</p>
            </div>

            <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 shadow-xl">
                {reviews.data && reviews.data.length > 0 ? (
                    <div className="space-y-4">
                        {reviews.data.map((rev) => (
                            <div key={rev.id} className="p-4 rounded-2xl bg-slate-800/60 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
                                <div>
                                    <div className="flex items-center gap-3 mb-1">
                                        <span className="font-bold text-white text-sm">{rev.customer?.name}</span>
                                        <span className="text-slate-400">reviewed</span>
                                        <span className="text-emerald-400 font-semibold">{rev.photographer?.business_name}</span>
                                        <StarRating rating={rev.rating} showCount={false} />
                                    </div>
                                    <p className="text-slate-300 italic">"{rev.review_text}"</p>
                                </div>

                                <div className="flex items-center gap-3 shrink-0">
                                    <span className="text-[11px] text-slate-500">{new Date(rev.created_at).toLocaleDateString()}</span>
                                    <button 
                                        onClick={() => handleDelete(rev.id)}
                                        className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400"
                                        title="Delete Review"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </div>
                        ))}

                        <AdminPagination links={reviews.links} />
                    </div>
                ) : (
                    <p className="text-center py-10 text-slate-400 text-xs italic">No reviews found.</p>
                )}
            </div>

        </AdminLayout>
    );
}
