import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import AdminBadge from '@/Components/AdminBadge';
import AdminPagination from '@/Components/AdminPagination';
import { Search, User, Mail, Phone, Calendar } from 'lucide-react';

export default function AdminCustomers({ customers, filters = {} }) {
    const [search, setSearch] = useState(filters.q || '');

    const handleSearch = (e) => {
        e.preventDefault();
        router.get('/admin/customers', { q: search }, { preserveState: true });
    };

    const handleToggleStatus = (id) => {
        router.post(`/admin/customers/${id}/toggle-status`, {}, { preserveScroll: true });
    };

    return (
        <AdminLayout title="Customers Directory">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-extrabold text-white">Registered Customers</h1>
                    <p className="text-xs text-slate-400 mt-0.5">Manage customer accounts, bookings history, and account activity.</p>
                </div>

                <form onSubmit={handleSearch} className="relative max-w-xs w-full">
                    <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
                    <input 
                        type="text"
                        placeholder="Search customers..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white"
                    />
                </form>
            </div>

            <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 shadow-xl">
                {customers.data && customers.data.length > 0 ? (
                    <div className="table-responsive">
                        <table>
                            <thead>
                                <tr>
                                    <th>Customer</th>
                                    <th>Phone</th>
                                    <th>City</th>
                                    <th>Bookings</th>
                                    <th>Status</th>
                                    <th>Joined</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {customers.data.map((c) => (
                                    <tr key={c.id}>
                                        <td>
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 font-bold flex items-center justify-center text-xs">
                                                    {c.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <span className="font-bold text-white text-xs block">{c.name}</span>
                                                    <span className="text-slate-400 text-[11px]">{c.email}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="text-xs text-slate-300">{c.phone || 'N/A'}</td>
                                        <td className="text-xs text-slate-300">{c.customer_profile?.city || 'N/A'}</td>
                                        <td className="font-bold text-white text-xs">{c.bookings_count || 0}</td>
                                        <td>
                                            <AdminBadge status={c.status} />
                                        </td>
                                        <td className="text-slate-400 text-xs">{new Date(c.created_at).toLocaleDateString()}</td>
                                        <td>
                                            <button
                                                onClick={() => handleToggleStatus(c.id)}
                                                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
                                                    c.status === 'active'
                                                        ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20'
                                                        : 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20'
                                                }`}
                                            >
                                                {c.status === 'active' ? 'Suspend' : 'Activate'}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        <AdminPagination links={customers.links} />
                    </div>
                ) : (
                    <p className="text-center py-10 text-slate-400 text-xs italic">No customers found.</p>
                )}
            </div>

        </AdminLayout>
    );
}
