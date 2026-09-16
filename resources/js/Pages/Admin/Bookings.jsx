import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import AdminBadge from '@/Components/AdminBadge';
import AdminPagination from '@/Components/AdminPagination';
import { Search, CalendarCheck, ChevronRight, Filter } from 'lucide-react';

export default function AdminBookings({ bookings, filters = {} }) {
    const [search, setSearch] = useState(filters.q || '');
    const [statusFilter, setStatusFilter] = useState(filters.status || 'all');

    const handleFilter = (newStatus) => {
        setStatusFilter(newStatus);
        router.get('/admin/bookings', {
            q: search,
            status: newStatus !== 'all' ? newStatus : undefined,
        }, { preserveState: true });
    };

    return (
        <AdminLayout title="Bookings & Orders">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-extrabold text-white">Marketplace Orders</h1>
                    <p className="text-xs text-slate-400 mt-0.5">Platform-wide booking requests, statuses, and revenue records.</p>
                </div>

                <div className="flex items-center gap-2 max-w-md w-full">
                    <select
                        value={statusFilter}
                        onChange={(e) => handleFilter(e.target.value)}
                        className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                    >
                        <option value="all">All Statuses</option>
                        <option value="pending">Pending</option>
                        <option value="accepted">Accepted</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="in_progress">In Progress</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                    </select>

                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
                        <input 
                            type="text"
                            placeholder="Order # or name..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleFilter(statusFilter)}
                            className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white"
                        />
                    </div>
                </div>
            </div>

            <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 shadow-xl">
                {bookings.data && bookings.data.length > 0 ? (
                    <div className="table-responsive">
                        <table>
                            <thead>
                                <tr>
                                    <th>Order #</th>
                                    <th>Customer</th>
                                    <th>Photographer</th>
                                    <th>Event Date</th>
                                    <th>Gross (₹)</th>
                                    <th>Paid (₹)</th>
                                    <th>Status</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {bookings.data.map((b) => (
                                    <tr key={b.id}>
                                        <td className="font-bold text-white text-xs">{b.booking_number}</td>
                                        <td className="text-slate-300 text-xs">{b.customer?.name}</td>
                                        <td className="text-emerald-400 text-xs font-semibold">{b.photographer?.business_name}</td>
                                        <td className="text-slate-400 text-xs">{new Date(b.event_date).toLocaleDateString()}</td>
                                        <td className="font-bold text-white text-xs">₹{Number(b.gross_amount).toLocaleString('en-IN')}</td>
                                        <td className="font-bold text-emerald-400 text-xs">₹{Number(b.paid_amount).toLocaleString('en-IN')}</td>
                                        <td>
                                            <AdminBadge status={b.booking_status} />
                                        </td>
                                        <td>
                                            <Link 
                                                href={`/admin/bookings/${b.id}`}
                                                className="px-3 py-1 rounded-xl bg-slate-800 hover:bg-emerald-500 hover:text-slate-950 text-xs font-bold text-slate-200 transition"
                                            >
                                                Inspect
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        <AdminPagination links={bookings.links} />
                    </div>
                ) : (
                    <p className="text-center py-10 text-slate-400 text-xs italic">No orders found.</p>
                )}
            </div>

        </AdminLayout>
    );
}
