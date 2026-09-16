import React, { useState } from 'react';
import { Head, Link, useForm, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import AdminBadge from '@/Components/AdminBadge';
import { 
    CheckCircle2, 
    XCircle, 
    ArrowLeft, 
    Camera, 
    Building, 
    MapPin, 
    CreditCard, 
    ShieldCheck, 
    Percent, 
    Sparkles, 
    Layers, 
    Image as ImageIcon 
} from 'lucide-react';

export default function PhotographerVerification({ photographer }) {
    const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
    const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);

    // Approval Form
    const approveForm = useForm({
        custom_commission_percentage: photographer.custom_commission_percentage || '',
        is_featured: photographer.is_featured || false,
    });

    // Rejection Form
    const rejectForm = useForm({
        rejection_reason: '',
    });

    const handleApprove = (e) => {
        e.preventDefault();
        approveForm.post(`/admin/photographers/${photographer.id}/approve`, {
            onSuccess: () => setIsApproveModalOpen(false),
        });
    };

    const handleReject = (e) => {
        e.preventDefault();
        rejectForm.post(`/admin/photographers/${photographer.id}/reject`, {
            onSuccess: () => setIsRejectModalOpen(false),
        });
    };

    return (
        <AdminLayout title={`Audit: ${photographer.business_name}`}>
            
            <div className="mb-6">
                <Link href="/admin/photographers" className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition">
                    <ArrowLeft size={14} /> Back to Photographers Directory
                </Link>
            </div>

            {/* Header Audit Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl mb-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-2xl bg-slate-800 border border-slate-700 overflow-hidden shrink-0">
                            {photographer.profile_image ? (
                                <img src={photographer.profile_image} alt={photographer.business_name} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full bg-emerald-600 flex items-center justify-center font-bold text-xl text-white">
                                    {photographer.business_name.charAt(0)}
                                </div>
                            )}
                        </div>
                        <div>
                            <div className="flex items-center gap-2.5 flex-wrap">
                                <h1 className="text-2xl font-black text-white">{photographer.business_name}</h1>
                                <AdminBadge status={photographer.verification_status} />
                            </div>
                            <p className="text-xs text-slate-400 mt-1">
                                Registered User: <strong className="text-slate-200">{photographer.user?.name}</strong> ({photographer.user?.email} • {photographer.user?.phone})
                            </p>
                        </div>
                    </div>

                    {/* Audit Decision Triggers */}
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setIsApproveModalOpen(true)}
                            className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs transition shadow-lg shadow-emerald-500/25 flex items-center gap-2"
                        >
                            <CheckCircle2 size={16} />
                            <span>Approve & Verify Studio</span>
                        </button>
                        <button
                            onClick={() => setIsRejectModalOpen(true)}
                            className="px-4 py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 font-bold text-xs transition flex items-center gap-1.5"
                        >
                            <XCircle size={16} />
                            <span>Reject</span>
                        </button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Left 2 Cols: Profile & Portfolios & Packages */}
                <div className="lg:col-span-2 space-y-6">
                    
                    {/* Studio Bio & Address */}
                    <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6">
                        <h2 className="text-base font-bold text-white mb-4">Studio Information</h2>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                            <div className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-800">
                                <span className="text-slate-400 font-medium block mb-1">Tagline</span>
                                <span className="font-bold text-white">{photographer.tagline || 'N/A'}</span>
                            </div>
                            <div className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-800">
                                <span className="text-slate-400 font-medium block mb-1">Experience & Rate</span>
                                <span className="font-bold text-emerald-400">{photographer.experience_years}+ Years • Starting ₹{Number(photographer.starting_price).toLocaleString('en-IN')}</span>
                            </div>
                            <div className="sm:col-span-2 p-3.5 rounded-2xl bg-slate-800/60 border border-slate-800">
                                <span className="text-slate-400 font-medium block mb-1">Address & Location</span>
                                <span className="font-bold text-white">{photographer.address || 'Studio Address'}, {photographer.city}, {photographer.state} ({photographer.pincode})</span>
                            </div>
                            <div className="sm:col-span-2 p-3.5 rounded-2xl bg-slate-800/60 border border-slate-800">
                                <span className="text-slate-400 font-medium block mb-1">Studio Bio</span>
                                <p className="text-slate-300 whitespace-pre-line">{photographer.bio}</p>
                            </div>
                        </div>
                    </div>

                    {/* Portfolios Preview */}
                    <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6">
                        <h2 className="text-base font-bold text-white mb-4">Uploaded Portfolio Albums ({photographer.portfolios?.length || 0})</h2>

                        {photographer.portfolios && photographer.portfolios.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {photographer.portfolios.map((p) => (
                                    <div key={p.id} className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-800 text-xs">
                                        <div className="h-32 bg-slate-900 rounded-xl overflow-hidden mb-2">
                                            {p.cover_image && <img src={p.cover_image} alt={p.title} className="w-full h-full object-cover" />}
                                        </div>
                                        <h4 className="font-bold text-white">{p.title}</h4>
                                        <p className="text-slate-400 text-[11px] mt-0.5">{p.media?.length || 0} Photos included</p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-xs text-slate-400 italic">No portfolios uploaded yet.</p>
                        )}
                    </div>

                    {/* Packages Preview */}
                    <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6">
                        <h2 className="text-base font-bold text-white mb-4">Configured Packages ({photographer.packages?.length || 0})</h2>

                        {photographer.packages && photographer.packages.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {photographer.packages.map((pkg) => (
                                    <div key={pkg.id} className="p-4 rounded-2xl bg-slate-800/60 border border-slate-800 text-xs">
                                        <div className="flex justify-between font-bold text-white mb-1">
                                            <span>{pkg.name}</span>
                                            <span className="text-emerald-400">₹{Number(pkg.price).toLocaleString('en-IN')}</span>
                                        </div>
                                        <p className="text-slate-400 text-[11px] mb-2">{pkg.description}</p>
                                        <div className="text-[10.5px] text-slate-300">
                                            ⏱ {pkg.duration_hours}h • 📷 {pkg.photographer_count} Photographers • 🖼 {pkg.edited_photos_count} Photos
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-xs text-slate-400 italic">No packages configured yet.</p>
                        )}
                    </div>
                </div>

                {/* Right 1 Col: Payout Bank Account Details */}
                <div className="space-y-6">
                    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4 text-xs">
                        <h3 className="text-sm font-bold text-white flex items-center gap-2">
                            <Building size={16} className="text-teal-400" />
                            Submitted Bank Account
                        </h3>

                        {photographer.bank_accounts && photographer.bank_accounts.length > 0 ? (
                            photographer.bank_accounts.map((b) => (
                                <div key={b.id} className="space-y-2.5 p-4 rounded-2xl bg-slate-800/60 border border-slate-700/80">
                                    <div>
                                        <span className="text-slate-400 block text-[11px]">Account Holder</span>
                                        <span className="font-bold text-white">{b.account_holder_name}</span>
                                    </div>
                                    <div>
                                        <span className="text-slate-400 block text-[11px]">Bank Name</span>
                                        <span className="font-bold text-white">{b.bank_name}</span>
                                    </div>
                                    <div>
                                        <span className="text-slate-400 block text-[11px]">Account Number</span>
                                        <span className="font-mono text-white font-bold">{b.account_number}</span>
                                    </div>
                                    <div>
                                        <span className="text-slate-400 block text-[11px]">IFSC Code</span>
                                        <span className="font-mono text-emerald-400 font-bold uppercase">{b.ifsc_code}</span>
                                    </div>
                                    {b.upi_id && (
                                        <div>
                                            <span className="text-slate-400 block text-[11px]">UPI ID</span>
                                            <span className="font-mono text-amber-400">{b.upi_id}</span>
                                        </div>
                                    )}
                                </div>
                            ))
                        ) : (
                            <p className="text-slate-400 italic">No bank account submitted yet.</p>
                        )}
                    </div>
                </div>

            </div>

            {/* APPROVE MODAL */}
            {isApproveModalOpen && (
                <div className="fixed inset-0 z-200 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl">
                        <h3 className="font-bold text-white text-base mb-2">Approve & Verify Studio</h3>
                        <p className="text-xs text-slate-400 mb-4">Approving will make this studio publicly visible on search and allow them to take client bookings.</p>

                        <form onSubmit={handleApprove} className="space-y-4 text-xs">
                            <div>
                                <label className="block text-slate-300 font-semibold mb-1">Custom Commission % (Leave blank for default 10%)</label>
                                <input 
                                    type="number"
                                    min="0"
                                    max="50"
                                    placeholder="10"
                                    value={approveForm.data.custom_commission_percentage}
                                    onChange={(e) => approveForm.setData('custom_commission_percentage', e.target.value)}
                                    className="form-control"
                                />
                            </div>

                            <label className="flex items-center gap-2 cursor-pointer pt-2">
                                <input 
                                    type="checkbox"
                                    checked={approveForm.data.is_featured}
                                    onChange={(e) => approveForm.setData('is_featured', e.target.checked)}
                                    className="w-4 h-4 accent-amber-400 rounded"
                                />
                                <span className="font-semibold text-slate-200">Also feature on homepage spotlight</span>
                            </label>

                            <div className="flex justify-end gap-2 pt-2">
                                <button type="button" onClick={() => setIsApproveModalOpen(false)} className="btn-secondary">Cancel</button>
                                <button type="submit" disabled={approveForm.processing} className="btn-primary">
                                    {approveForm.processing ? 'Approving...' : 'Confirm Approval'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* REJECT MODAL */}
            {isRejectModalOpen && (
                <div className="fixed inset-0 z-200 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl">
                        <h3 className="font-bold text-white text-base mb-2">Reject Studio Application</h3>
                        <p className="text-xs text-slate-400 mb-4">Please provide a reason so the photographer can rectify their application.</p>

                        <form onSubmit={handleReject} className="space-y-4 text-xs">
                            <div>
                                <label className="block text-slate-300 font-semibold mb-1">Reason for Rejection *</label>
                                <textarea 
                                    rows="3"
                                    placeholder="e.g. Incomplete portfolio photos, invalid bank IFSC code..."
                                    value={rejectForm.data.rejection_reason}
                                    onChange={(e) => rejectForm.setData('rejection_reason', e.target.value)}
                                    required
                                    className="form-control"
                                />
                            </div>

                            <div className="flex justify-end gap-2 pt-2">
                                <button type="button" onClick={() => setIsRejectModalOpen(false)} className="btn-secondary">Cancel</button>
                                <button type="submit" disabled={rejectForm.processing} className="btn-danger">
                                    {rejectForm.processing ? 'Rejecting...' : 'Confirm Rejection'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

        </AdminLayout>
    );
}
