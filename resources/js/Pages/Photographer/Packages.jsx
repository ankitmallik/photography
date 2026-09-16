import React, { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import PhotographerLayout from '@/Layouts/PhotographerLayout';
import { Plus, Edit2, Trash2, X, Check, Camera, Clock, Users, Video, Sparkles, Award } from 'lucide-react';

export default function PhotographerPackages({ packages = [] }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPackage, setEditingPackage] = useState(null);

    const { data, setData, post, put, processing, errors, reset } = useForm({
        name: '',
        description: '',
        price: '',
        duration_hours: 6,
        photographer_count: 1,
        videographer_count: 1,
        edited_photos_count: 150,
        raw_photos_included: true,
        video_duration_minutes: 30,
        cinematic_video: false,
        drone: false,
        album: false,
        album_pages: 0,
        travel_included: true,
        features: [],
        is_active: true,
    });

    const openCreateModal = () => {
        setEditingPackage(null);
        reset();
        setIsModalOpen(true);
    };

    const openEditModal = (pkg) => {
        setEditingPackage(pkg);
        setData({
            name: pkg.name,
            description: pkg.description || '',
            price: pkg.price,
            duration_hours: pkg.duration_hours,
            photographer_count: pkg.photographer_count,
            videographer_count: pkg.videographer_count,
            edited_photos_count: pkg.edited_photos_count,
            raw_photos_included: pkg.raw_photos_included,
            video_duration_minutes: pkg.video_duration_minutes,
            cinematic_video: pkg.cinematic_video,
            drone: pkg.drone,
            album: pkg.album,
            album_pages: pkg.album_pages,
            travel_included: pkg.travel_included,
            features: pkg.features || [],
            is_active: pkg.is_active,
        });
        setIsModalOpen(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editingPackage) {
            put(`/photographer/packages/${editingPackage.id}`, {
                onSuccess: () => {
                    setIsModalOpen(false);
                    reset();
                },
            });
        } else {
            post('/photographer/packages', {
                onSuccess: () => {
                    setIsModalOpen(false);
                    reset();
                },
            });
        }
    };

    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this package?')) {
            router.delete(`/photographer/packages/${id}`);
        }
    };

    return (
        <PhotographerLayout title="Manage Packages">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-extrabold text-white">Photography Packages</h1>
                    <p className="text-xs text-slate-400 mt-0.5">Bundle your services into high-converting tiered packages (Silver, Gold, Platinum).</p>
                </div>

                <button onClick={openCreateModal} className="btn-primary btn-sm flex items-center gap-1.5 self-start">
                    <Plus size={14} /> Create Package
                </button>
            </div>

            {packages.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {packages.map((pkg) => (
                        <div key={pkg.id} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col justify-between">
                            <div>
                                <div className="flex items-start justify-between gap-2 mb-2">
                                    <h3 className="font-bold text-lg text-white">{pkg.name}</h3>
                                    <span className="text-xl font-black text-emerald-400">
                                        ₹{Number(pkg.price).toLocaleString('en-IN')}
                                    </span>
                                </div>
                                <p className="text-xs text-slate-400 mb-4 line-clamp-2">{pkg.description}</p>

                                <div className="space-y-2 py-3 border-y border-slate-800 text-xs text-slate-300">
                                    <div className="flex items-center gap-2">
                                        <Clock size={14} className="text-emerald-400" />
                                        <span>{pkg.duration_hours} Hours Event Shoot</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Users size={14} className="text-emerald-400" />
                                        <span>{pkg.photographer_count} Photographer(s) + {pkg.videographer_count} Videographer(s)</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Camera size={14} className="text-emerald-400" />
                                        <span>{pkg.edited_photos_count} Edited High-Res Photos</span>
                                    </div>
                                    {pkg.drone && (
                                        <div className="flex items-center gap-2">
                                            <Sparkles size={14} className="text-amber-400" />
                                            <span>4K Aerial Drone Coverage</span>
                                        </div>
                                    )}
                                    {pkg.cinematic_video && (
                                        <div className="flex items-center gap-2">
                                            <Video size={14} className="text-purple-400" />
                                            <span>Cinematic Highlight Video</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center justify-end gap-2 pt-4 mt-4 border-t border-slate-800 text-xs">
                                <button onClick={() => openEditModal(pkg)} className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center gap-1">
                                    <Edit2 size={12} /> Edit
                                </button>
                                <button onClick={() => handleDelete(pkg.id)} className="px-3 py-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 flex items-center gap-1">
                                    <Trash2 size={12} /> Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-16 bg-slate-900/40 rounded-3xl border border-slate-800 p-8">
                    <Camera className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                    <h3 className="text-base font-bold text-white">No Packages Created</h3>
                    <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1 mb-6">
                        Create tiered packages to give customers clear options with hours and deliverables.
                    </p>
                    <button onClick={openCreateModal} className="btn-primary">
                        <Plus size={14} /> Create First Package
                    </button>
                </div>
            )}

            {/* MODAL */}
            {isModalOpen && (
                <div className="fixed inset-0 z-200 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
                    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-bold text-white text-base">
                                {editingPackage ? 'Edit Package' : 'Create Package'}
                            </h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                                <X size={18} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-slate-300 font-semibold mb-1">Package Name *</label>
                                    <input 
                                        type="text"
                                        placeholder="e.g. Royal Wedding Gold"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        required
                                        className="form-control"
                                    />
                                    {errors.name && <div className="text-red-400 text-xs mt-1">{errors.name}</div>}
                                </div>
                                <div>
                                    <label className="block text-slate-300 font-semibold mb-1">Package Price (₹) *</label>
                                    <input 
                                        type="number"
                                        min="0"
                                        placeholder="50000"
                                        value={data.price}
                                        onChange={(e) => setData('price', e.target.value)}
                                        required
                                        className="form-control"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-slate-300 font-semibold mb-1">Short Description</label>
                                <textarea 
                                    rows="2"
                                    placeholder="Ideal for full day wedding with multi-camera coverage..."
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    className="form-control"
                                />
                            </div>

                            <div className="grid grid-cols-3 gap-3">
                                <div>
                                    <label className="block text-slate-300 font-semibold mb-1">Duration (Hours)</label>
                                    <input 
                                        type="number"
                                        min="1"
                                        value={data.duration_hours}
                                        onChange={(e) => setData('duration_hours', e.target.value)}
                                        className="form-control"
                                    />
                                </div>
                                <div>
                                    <label className="block text-slate-300 font-semibold mb-1">Photographers</label>
                                    <input 
                                        type="number"
                                        min="1"
                                        value={data.photographer_count}
                                        onChange={(e) => setData('photographer_count', e.target.value)}
                                        className="form-control"
                                    />
                                </div>
                                <div>
                                    <label className="block text-slate-300 font-semibold mb-1">Videographers</label>
                                    <input 
                                        type="number"
                                        min="0"
                                        value={data.videographer_count}
                                        onChange={(e) => setData('videographer_count', e.target.value)}
                                        className="form-control"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-slate-300 font-semibold mb-1">Edited Photos Count</label>
                                    <input 
                                        type="number"
                                        min="0"
                                        value={data.edited_photos_count}
                                        onChange={(e) => setData('edited_photos_count', e.target.value)}
                                        className="form-control"
                                    />
                                </div>
                                <div>
                                    <label className="block text-slate-300 font-semibold mb-1">Video Duration (Mins)</label>
                                    <input 
                                        type="number"
                                        min="0"
                                        value={data.video_duration_minutes}
                                        onChange={(e) => setData('video_duration_minutes', e.target.value)}
                                        className="form-control"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2 pt-2 border-t border-slate-800">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input 
                                        type="checkbox"
                                        checked={data.drone}
                                        onChange={(e) => setData('drone', e.target.checked)}
                                        className="w-4 h-4 accent-emerald-500 rounded"
                                    />
                                    <span>Include 4K Aerial Drone Coverage</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input 
                                        type="checkbox"
                                        checked={data.cinematic_video}
                                        onChange={(e) => setData('cinematic_video', e.target.checked)}
                                        className="w-4 h-4 accent-emerald-500 rounded"
                                    />
                                    <span>Include Cinematic Teaser & Highlight Reel</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input 
                                        type="checkbox"
                                        checked={data.album}
                                        onChange={(e) => setData('album', e.target.checked)}
                                        className="w-4 h-4 accent-emerald-500 rounded"
                                    />
                                    <span>Include Premium Printed Album</span>
                                </label>
                            </div>

                            <button 
                                type="submit" 
                                disabled={processing}
                                className="w-full btn-primary mt-4"
                            >
                                {processing ? 'Saving...' : editingPackage ? 'Update Package' : 'Save Package'}
                            </button>
                        </form>
                    </div>
                </div>
            )}

        </PhotographerLayout>
    );
}
