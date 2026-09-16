import React, { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import PhotographerLayout from '@/Layouts/PhotographerLayout';
import { Plus, Edit2, Trash2, X, Check, Layers } from 'lucide-react';

export default function PhotographerServices({ services = [], categories = [] }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingService, setEditingService] = useState(null);

    const { data, setData, post, put, processing, errors, reset } = useForm({
        category_id: '',
        name: '',
        description: '',
        price_type: 'starting_from',
        price: '',
        max_price: '',
        is_active: true,
    });

    const openCreateModal = () => {
        setEditingService(null);
        reset();
        setIsModalOpen(true);
    };

    const openEditModal = (service) => {
        setEditingService(service);
        setData({
            category_id: service.category_id || '',
            name: service.name,
            description: service.description || '',
            price_type: service.price_type,
            price: service.price,
            max_price: service.max_price || '',
            is_active: service.is_active,
        });
        setIsModalOpen(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editingService) {
            put(`/photographer/services/${editingService.id}`, {
                onSuccess: () => {
                    setIsModalOpen(false);
                    reset();
                },
            });
        } else {
            post('/photographer/services', {
                onSuccess: () => {
                    setIsModalOpen(false);
                    reset();
                },
            });
        }
    };

    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this service?')) {
            router.delete(`/photographer/services/${id}`);
        }
    };

    return (
        <PhotographerLayout title="Manage Services">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-extrabold text-white">Photography Services</h1>
                    <p className="text-xs text-slate-400 mt-0.5">Define your individual offerings, photo/video services, and rates.</p>
                </div>

                <button onClick={openCreateModal} className="btn-primary btn-sm flex items-center gap-1.5 self-start">
                    <Plus size={14} /> Add New Service
                </button>
            </div>

            {services.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {services.map((s) => (
                        <div key={s.id} className="bg-slate-900/70 border border-slate-800 rounded-3xl p-5 shadow-lg flex flex-col justify-between">
                            <div>
                                <div className="flex items-start justify-between gap-2 mb-2">
                                    <h3 className="font-bold text-base text-white">{s.name}</h3>
                                    <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full shrink-0">
                                        ₹{Number(s.price).toLocaleString('en-IN')}
                                    </span>
                                </div>
                                <p className="text-xs text-slate-400 line-clamp-2 mb-3">{s.description || 'No description provided.'}</p>
                                
                                {s.category && (
                                    <span className="inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                                        {s.category.name}
                                    </span>
                                )}
                            </div>

                            <div className="flex items-center justify-between pt-4 mt-4 border-t border-slate-800 text-xs">
                                <span className="text-slate-400 capitalize">{s.price_type.replace('_', ' ')}</span>
                                <div className="flex items-center gap-2">
                                    <button onClick={() => openEditModal(s)} className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300">
                                        <Edit2 size={13} />
                                    </button>
                                    <button onClick={() => handleDelete(s.id)} className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400">
                                        <Trash2 size={13} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-16 bg-slate-900/40 rounded-3xl border border-slate-800 p-8">
                    <Layers className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                    <h3 className="text-base font-bold text-white">No Services Added</h3>
                    <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1 mb-6">
                        Add individual services like Wedding Candid Shoot, Drone Reel, Pre-Wedding Portraits, etc.
                    </p>
                    <button onClick={openCreateModal} className="btn-primary">
                        <Plus size={14} /> Add First Service
                    </button>
                </div>
            )}

            {/* MODAL */}
            {isModalOpen && (
                <div className="fixed inset-0 z-200 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-bold text-white text-base">
                                {editingService ? 'Edit Service' : 'Add New Service'}
                            </h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                                <X size={18} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                            <div>
                                <label className="block text-slate-300 font-semibold mb-1">Service Name *</label>
                                <input 
                                    type="text"
                                    placeholder="e.g. Traditional Wedding Videography"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    required
                                    className="form-control"
                                />
                                {errors.name && <div className="text-red-400 text-xs mt-1">{errors.name}</div>}
                            </div>

                            <div>
                                <label className="block text-slate-300 font-semibold mb-1">Category</label>
                                <select 
                                    value={data.category_id}
                                    onChange={(e) => setData('category_id', e.target.value)}
                                    className="form-control"
                                >
                                    <option value="">Select Category</option>
                                    {categories.map((c) => (
                                        <option key={c.id} value={c.id}>{c.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-slate-300 font-semibold mb-1">Pricing Type</label>
                                    <select 
                                        value={data.price_type}
                                        onChange={(e) => setData('price_type', e.target.value)}
                                        className="form-control"
                                    >
                                        <option value="starting_from">Starting From</option>
                                        <option value="fixed">Fixed Price</option>
                                        <option value="custom_quote">Custom Quote</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-slate-300 font-semibold mb-1">Base Price (₹) *</label>
                                    <input 
                                        type="number"
                                        min="0"
                                        placeholder="15000"
                                        value={data.price}
                                        onChange={(e) => setData('price', e.target.value)}
                                        required
                                        className="form-control"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-slate-300 font-semibold mb-1">Description</label>
                                <textarea 
                                    rows="3"
                                    placeholder="Deliverables, camera equipment used, hours included..."
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    className="form-control"
                                />
                            </div>

                            <button 
                                type="submit" 
                                disabled={processing}
                                className="w-full btn-primary mt-2"
                            >
                                {processing ? 'Saving...' : editingService ? 'Update Service' : 'Create Service'}
                            </button>
                        </form>
                    </div>
                </div>
            )}

        </PhotographerLayout>
    );
}
