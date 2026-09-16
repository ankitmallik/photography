import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import PhotographerLayout from '@/Layouts/PhotographerLayout';
import { Calendar, Plus, CheckCircle, Clock, ShieldAlert } from 'lucide-react';

export default function PhotographerAvailabilityPage({ availabilities = [] }) {
    const { data, setData, post, processing } = useForm({
        date: new Date().toISOString().split('T')[0],
        status: 'blocked',
        notes: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post('/photographer/availability', {
            preserveScroll: true,
        });
    };

    return (
        <PhotographerLayout title="Availability Calendar">
            
            <div className="mb-6">
                <h1 className="text-2xl font-extrabold text-white">Availability Calendar</h1>
                <p className="text-xs text-slate-400 mt-0.5">Control which dates are open for client bookings vs reserved or blocked.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                
                {/* Left Col: Set Status Form */}
                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
                    <h3 className="font-bold text-base text-white mb-4 flex items-center gap-2">
                        <Calendar size={16} className="text-emerald-400" />
                        Update Date Status
                    </h3>

                    <form onSubmit={submit} className="space-y-4 text-xs">
                        <div>
                            <label className="block text-slate-300 font-semibold mb-1">Select Date *</label>
                            <input 
                                type="date"
                                value={data.date}
                                onChange={(e) => setData('date', e.target.value)}
                                required
                                className="form-control"
                            />
                        </div>

                        <div>
                            <label className="block text-slate-300 font-semibold mb-1">Status on this Date *</label>
                            <select 
                                value={data.status}
                                onChange={(e) => setData('status', e.target.value)}
                                className="form-control"
                            >
                                <option value="available">Available (Open for bookings)</option>
                                <option value="booked">Booked (Confirmed Shoot)</option>
                                <option value="blocked">Blocked (Unavailable / Holiday)</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-slate-300 font-semibold mb-1">Notes / Reason</label>
                            <input 
                                type="text"
                                placeholder="e.g. Destination wedding shoot in Goa"
                                value={data.notes}
                                onChange={(e) => setData('notes', e.target.value)}
                                className="form-control"
                            />
                        </div>

                        <button 
                            type="submit" 
                            disabled={processing}
                            className="w-full btn-primary"
                        >
                            {processing ? 'Saving...' : 'Set Date Status'}
                        </button>
                    </form>
                </div>

                {/* Right 2 Cols: Schedule List */}
                <div className="lg:col-span-2 bg-slate-900/60 border border-slate-800 rounded-3xl p-6 shadow-xl">
                    <h3 className="font-bold text-base text-white mb-4">Active Date Blocks & Bookings</h3>

                    {availabilities.length > 0 ? (
                        <div className="space-y-2.5">
                            {availabilities.map((avail) => (
                                <div key={avail.id} className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 flex items-center justify-between text-xs">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-3 h-3 rounded-full ${
                                            avail.status === 'available' ? 'bg-emerald-400' : avail.status === 'booked' ? 'bg-amber-400' : 'bg-red-400'
                                        }`} />
                                        <div>
                                            <div className="font-bold text-white text-sm">
                                                {new Date(avail.date).toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' })}
                                            </div>
                                            {avail.notes && <p className="text-slate-400 text-[11px] mt-0.5">{avail.notes}</p>}
                                        </div>
                                    </div>

                                    <span className={`px-3 py-1 rounded-full font-bold text-[11px] uppercase ${
                                        avail.status === 'available' ? 'bg-emerald-500/15 text-emerald-400' : avail.status === 'booked' ? 'bg-amber-500/15 text-amber-400' : 'bg-red-500/15 text-red-400'
                                    }`}>
                                        {avail.status}
                                    </span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-center py-10 text-slate-400 text-xs italic">
                            No dates blocked or custom scheduled yet.
                        </p>
                    )}
                </div>

            </div>

        </PhotographerLayout>
    );
}
