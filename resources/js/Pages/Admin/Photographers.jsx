import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import AdminBadge from '@/Components/AdminBadge';
import AdminPagination from '@/Components/AdminPagination';
import { Search, Sparkles, ShieldCheck, Camera, Check, X, Filter } from 'lucide-react';

export default function AdminPhotographers({ photographers, filters = {} }) {
    const [search, setSearch] = useState(filters.q || '');
    const [statusFilter, setStatusFilter] = useState(filters.status || 'all');

    const handleSearch = (e) => {
        e.preventDefault();
        router.get('/admin/photographers', {
            q: search,
            status: statusFilter !== 'all' ? statusFilter : undefined,
        }, { preserveState: true });
    };

    const handleToggleFeatured = (id) => {
        router.post(`/admin/photographers/${id}/featured`, {}, { preserveScroll: true });
    };

    return (
        <AdminLayout title="Photographers Directory">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-extrabold text-white">Photographer Studios</h1>
                    <p className="text-xs text-slate-400 mt-0.5">Manage photographer approvals, commission overrides, and featured status.</p>
                </div>

                {/* Filter / Search Form */}
                <form onSubmit={handleSearch} className="flex items-center gap-2 max-w-md w-full">
                    <select
                        value={statusFilter}
                        onChange={(e) => {
                            setStatusFilter(e.target.value);
                            router.get('/admin/photographers', {
                                q: search,
                                status: e.target.value !== 'all' ? e.target.value : undefined,
                            });
                        }}
                        className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                    >
                        <option value="all">All Statuses</option>
                        <option value="approved">Approved & Live</option>
                        <option value="pending">Pending Audit</option>
                        <option value="rejected">Rejected</option>
                    </select>

                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
                        <input 
                            type="text"
                            placeholder="Search studios..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white"
                        />
                    </div>
                </form>
            </div>

            {/* Table */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 shadow-xl">
                {photographers.data && photographers.data.length > 0 ? (
                    <div className="table-responsive">
                        <table>
                            <thead>
                                <tr>
                                    <th>Studio & Owner</th>
                                    <th>City</th>
                                    <th>Starting Rate</th>
                                    <th>Audit Status</th>
                                    <th>Featured</th>
                                    <th>Rating</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {photographers.data.map((p) => (
                                    <tr key={p.id}>
                                        <td>
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-slate-800 overflow-hidden shrink-0">
                                                    {p.profile_image ? (
                                                        <img src={p.profile_image} alt={p.business_name} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full bg-emerald-600 flex items-center justify-center font-bold text-xs text-white">
                                                            {p.business_name.charAt(0)}
                                                        </div>
                                                    )}
                                                </div>
                                                <div>
                                                    <span className="font-bold text-white text-xs block">{p.business_name}</span>
                                                    <span className="text-slate-400 text-[11px]">{p.user?.name} ({p.user?.email})</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="text-xs text-slate-300">{p.city}, {p.state}</td>
                                        <td className="font-bold text-emerald-400 text-xs">
                                            ₹{Number(p.starting_price).toLocaleString('en-IN')}
                                        </td>
                                        <td>
                                            <AdminBadge status={p.verification_status} />
                                        </td>
                                        <td>
                                            <button
                                                onClick={() => handleToggleFeatured(p.id)}
                                                className={`px-2.5 py-1 rounded-full text-[10.5px] font-bold transition flex items-center gap-1 ${
                                                    p.is_featured 
                                                        ? 'bg-amber-400/15 text-amber-400 border border-amber-400/30' 
                                                        : 'bg-slate-800 text-slate-500 hover:text-slate-300'
                                                }`}
                                            >
                                                <Sparkles size={12} />
                                                {p.is_featured ? 'Featured' : 'Regular'}
                                            </button>
                                        </td>
                                        <td className="text-xs text-slate-300 font-semibold">
                                            {p.average_rating || 5} ★ ({p.review_count || 0})
                                        </td>
                                        <td>
                                            <div className="flex items-center gap-2">
                                                <Link 
                                                    href={`/admin/photographers/${p.id}/verification`}
                                                    className="px-3 py-1 rounded-xl bg-slate-800 hover:bg-emerald-500 hover:text-slate-950 text-xs font-bold text-slate-200 transition"
                                                >
                                                    Audit Studio
                                                </Link>
                                                {p.slug && (
                                                    <Link 
                                                        href={`/photographers/${p.slug}`}
                                                        target="_blank"
                                                        className="text-xs text-slate-400 hover:text-white"
                                                    >
                                                        Live
                                                    </Link>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        <AdminPagination links={photographers.links} />
                    </div>
                ) : (
                    <p className="text-center py-10 text-slate-400 text-xs italic">
                        No photographers matching criteria found.
                    </p>
                )}
            </div>

        </AdminLayout>
    );
}
