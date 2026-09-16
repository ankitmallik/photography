import React from 'react';
import { Head } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import AdminCard from '@/Components/AdminCard';
import { BarChart3, TrendingUp, CalendarCheck, Camera } from 'lucide-react';

export default function AdminReports({ metrics = {}, topPhotographers = [], topCategories = [] }) {
    return (
        <AdminLayout title="Marketplace Analytics">
            
            <div className="mb-6">
                <h1 className="text-2xl font-extrabold text-white">Platform Analytics & Reports</h1>
                <p className="text-xs text-slate-400 mt-0.5">Performance insights, top grossing studios, and category demand.</p>
            </div>

            {/* Top Summaries */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                <AdminCard 
                    title="Total Volume"
                    value={`₹${Number(metrics.total_volume || 0).toLocaleString('en-IN')}`}
                    subtitle="Gross marketplace bookings"
                    icon={TrendingUp}
                    color="emerald"
                />
                <AdminCard 
                    title="Net Platform Commission"
                    value={`₹${Number(metrics.total_commission || 0).toLocaleString('en-IN')}`}
                    subtitle="Marketplace commission earned"
                    icon={BarChart3}
                    color="purple"
                />
                <AdminCard 
                    title="Total Completed Shoots"
                    value={metrics.completed_bookings || 0}
                    subtitle="Events fulfilled successfully"
                    icon={CalendarCheck}
                    color="blue"
                />
            </div>

            {/* Grids: Top Photographers & Categories */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                
                {/* Top Studios */}
                <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 shadow-xl">
                    <h3 className="font-bold text-base text-white mb-4">Top Performing Studios</h3>

                    {topPhotographers.length > 0 ? (
                        <div className="space-y-3">
                            {topPhotographers.map((p, idx) => (
                                <div key={p.id} className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-800 flex items-center justify-between text-xs">
                                    <div className="flex items-center gap-3">
                                        <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-400 font-bold flex items-center justify-center text-xs">
                                            #{idx + 1}
                                        </div>
                                        <div>
                                            <span className="font-bold text-white block">{p.business_name}</span>
                                            <span className="text-slate-400 text-[11px]">{p.city} • {p.total_bookings} Bookings</span>
                                        </div>
                                    </div>
                                    <span className="font-bold text-emerald-400 text-sm">
                                        ₹{Number(p.total_earnings || 0).toLocaleString('en-IN')}
                                    </span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-center py-8 text-slate-400 text-xs italic">No data available yet.</p>
                    )}
                </div>

                {/* Popular Genres */}
                <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 shadow-xl">
                    <h3 className="font-bold text-base text-white mb-4">Photography Categories Breakdown</h3>

                    {topCategories.length > 0 ? (
                        <div className="space-y-3">
                            {topCategories.map((c) => (
                                <div key={c.id} className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-800 flex items-center justify-between text-xs">
                                    <div>
                                        <span className="font-bold text-white block">{c.name}</span>
                                        <span className="text-slate-400 text-[11px]">/{c.slug}</span>
                                    </div>
                                    <span className="font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full">
                                        {c.photographers_count || 0} Studios Active
                                    </span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-center py-8 text-slate-400 text-xs italic">No data available yet.</p>
                    )}
                </div>

            </div>

        </AdminLayout>
    );
}
