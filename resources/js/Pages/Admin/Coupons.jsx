import React, { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import AdminPagination from '@/Components/AdminPagination';
import { Plus, Tag, Trash2, X, Percent, Check } from 'lucide-react';

export default function AdminCoupons({ coupons = [] }) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        code: '',
        discount_type: 'percentage',
        discount_value: 10,
        min_booking_amount: 5000,
        max_discount_amount: 2000,
        usage_limit: 100,
        valid_until: '',
        is_active: true,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/admin/coupons', {
            onSuccess: () => {
                setIsModalOpen(false);
                reset();
            },
        });
    };

    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this coupon?')) {
            router.delete(`/admin/coupons/${id}`);
        }
    };

    return (
        <AdminLayout title="Discount Coupons">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-extrabold text-white">Coupons & Promo Codes</h1>
                    <p className="text-xs text-slate-400 mt-0.5">Create discount promo codes for customer bookings.</p>
                </div>

                <button onClick={() => setIsModalOpen(true)} className="btn-primary btn-sm flex items-center gap-1.5 self-start">
                    <Plus size={14} /> Create Coupon
                </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {coupons.map((c) => (
                    <div key={c.id} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col justify-between">
                        <div>
                            <div className="flex items-center justify-between mb-3">
                                <span className="font-mono text-base font-black px-3 py-1 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 uppercase tracking-wider">
                                    {c.code}
                                </span>
                                <span className="text-xs font-bold text-amber-400">
                                    {c.discount_type === 'percentage' ? `${c.discount_value}% OFF` : `₹${c.discount_value} OFF`}
                                </span>
                            </div>

                            <div className="space-y-1.5 text-xs text-slate-400 my-4">
                                <p>Min Order: <strong className="text-slate-200">₹{Number(c.min_booking_amount).toLocaleString('en-IN')}</strong></p>
                                {c.max_discount_amount && (
                                    <p>Max Cap: <strong className="text-slate-200">₹{Number(c.max_discount_amount).toLocaleString('en-IN')}</strong></p>
                                )}
                                <p>Times Used: <strong className="text-slate-200">{c.used_count || 0} / {c.usage_limit || '∞'}</strong></p>
                                {c.valid_until && (
                                    <p>Expires: <strong className="text-slate-200">{new Date(c.valid_until).toLocaleDateString()}</strong></p>
                                )}
                            </div>
                        </div>

                        <div className="pt-4 border-t border-slate-800 flex justify-end">
                            <button onClick={() => handleDelete(c.id)} className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs flex items-center gap-1 font-bold">
                                <Trash2 size={13} /> Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* MODAL */}
            {isModalOpen && (
                <div className="fixed inset-0 z-200 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-bold text-white text-base">Create Discount Coupon</h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                                <X size={18} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                            <div>
                                <label className="block text-slate-300 font-semibold mb-1">Coupon Code *</label>
                                <input 
                                    type="text"
                                    placeholder="e.g. WEDDING10"
                                    value={data.code}
                                    onChange={(e) => setData('code', e.target.value.toUpperCase())}
                                    required
                                    className="form-control font-mono uppercase"
                                />
                                {errors.code && <div className="text-red-400 text-xs mt-1">{errors.code}</div>}
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-slate-300 font-semibold mb-1">Discount Type</label>
                                    <select 
                                        value={data.discount_type}
                                        onChange={(e) => setData('discount_type', e.target.value)}
                                        className="form-control"
                                    >
                                        <option value="percentage">Percentage (%)</option>
                                        <option value="fixed">Fixed Amount (₹)</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-slate-300 font-semibold mb-1">Value *</label>
                                    <input 
                                        type="number"
                                        min="1"
                                        placeholder="10"
                                        value={data.discount_value}
                                        onChange={(e) => setData('discount_value', e.target.value)}
                                        required
                                        className="form-control"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-slate-300 font-semibold mb-1">Min Order Amount (₹)</label>
                                    <input 
                                        type="number"
                                        value={data.min_booking_amount}
                                        onChange={(e) => setData('min_booking_amount', e.target.value)}
                                        className="form-control"
                                    />
                                </div>
                                <div>
                                    <label className="block text-slate-300 font-semibold mb-1">Max Discount (₹)</label>
                                    <input 
                                        type="number"
                                        value={data.max_discount_amount}
                                        onChange={(e) => setData('max_discount_amount', e.target.value)}
                                        className="form-control"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-slate-300 font-semibold mb-1">Expiry Date</label>
                                <input 
                                    type="date"
                                    value={data.valid_until}
                                    onChange={(e) => setData('valid_until', e.target.value)}
                                    className="form-control"
                                />
                            </div>

                            <button type="submit" disabled={processing} className="w-full btn-primary mt-2">
                                {processing ? 'Creating...' : 'Save & Activate Coupon'}
                            </button>
                        </form>
                    </div>
                </div>
            )}

        </AdminLayout>
    );
}
