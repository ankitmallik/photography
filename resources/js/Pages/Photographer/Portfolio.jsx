import React, { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import PhotographerLayout from '@/Layouts/PhotographerLayout';
import { Plus, Trash2, X, Image as ImageIcon, Calendar, Layers } from 'lucide-react';

export default function PhotographerPortfolio({ portfolios = [], categories = [] }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [mediaUrlInput, setMediaUrlInput] = useState('');
    const [mediaUrlsList, setMediaUrlsList] = useState([]);

    const { data, setData, post, processing, errors, reset } = useForm({
        title: '',
        category_id: '',
        description: '',
        event_date: '',
        cover_image: '',
        media_urls: [],
    });

    const handleAddMediaUrl = () => {
        if (!mediaUrlInput.trim()) return;
        const updated = [...mediaUrlsList, mediaUrlInput.trim()];
        setMediaUrlsList(updated);
        setData('media_urls', updated);
        setMediaUrlInput('');
    };

    const handleRemoveMediaUrl = (idx) => {
        const updated = mediaUrlsList.filter((_, i) => i !== idx);
        setMediaUrlsList(updated);
        setData('media_urls', updated);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/photographer/portfolio', {
            onSuccess: () => {
                setIsModalOpen(false);
                reset();
                setMediaUrlsList([]);
            },
        });
    };

    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this portfolio album?')) {
            router.delete(`/photographer/portfolio/${id}`);
        }
    };

    return (
        <PhotographerLayout title="Portfolio Albums">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-extrabold text-white">Portfolio Albums</h1>
                    <p className="text-xs text-slate-400 mt-0.5">Showcase your finest weddings, portraits, and cinematography projects.</p>
                </div>

                <button onClick={() => setIsModalOpen(true)} className="btn-primary btn-sm flex items-center gap-1.5 self-start">
                    <Plus size={14} /> Create Album
                </button>
            </div>

            {portfolios.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {portfolios.map((p) => (
                        <div key={p.id} className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl flex flex-col justify-between">
                            <div>
                                <div className="h-48 bg-slate-800 relative overflow-hidden">
                                    {p.cover_image ? (
                                        <img src={p.cover_image} alt={p.title} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-slate-600">
                                            <ImageIcon size={32} />
                                        </div>
                                    )}
                                    <span className="absolute bottom-3 right-3 px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-950/80 text-emerald-400 backdrop-blur-sm border border-white/10">
                                        {p.media?.length || 0} Media items
                                    </span>
                                </div>

                                <div className="p-5">
                                    <h3 className="font-bold text-base text-white">{p.title}</h3>
                                    {p.category && (
                                        <span className="text-[10px] text-emerald-400 font-semibold block mt-0.5">
                                            {p.category.name}
                                        </span>
                                    )}
                                    <p className="text-xs text-slate-400 mt-2 line-clamp-2">{p.description}</p>
                                </div>
                            </div>

                            <div className="p-5 pt-0 flex justify-end">
                                <button onClick={() => handleDelete(p.id)} className="px-3 py-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 font-bold text-xs flex items-center gap-1.5">
                                    <Trash2 size={12} /> Delete Album
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-16 bg-slate-900/40 rounded-3xl border border-slate-800 p-8">
                    <ImageIcon className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                    <h3 className="text-base font-bold text-white">No Portfolio Albums Uploaded</h3>
                    <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1 mb-6">
                        Upload your real wedding and event photo albums to increase client bookings.
                    </p>
                    <button onClick={() => setIsModalOpen(true)} className="btn-primary">
                        <Plus size={14} /> Create Album
                    </button>
                </div>
            )}

            {/* MODAL */}
            {isModalOpen && (
                <div className="fixed inset-0 z-200 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
                    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-bold text-white text-base">Create Portfolio Album</h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                                <X size={18} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                            <div>
                                <label className="block text-slate-300 font-semibold mb-1">Album Title *</label>
                                <input 
                                    type="text"
                                    placeholder="e.g. Rahul & Priya Destination Wedding"
                                    value={data.title}
                                    onChange={(e) => setData('title', e.target.value)}
                                    required
                                    className="form-control"
                                />
                                {errors.title && <div className="text-red-400 text-xs mt-1">{errors.title}</div>}
                            </div>

                            <div className="grid grid-cols-2 gap-3">
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
                                <div>
                                    <label className="block text-slate-300 font-semibold mb-1">Cover Image URL</label>
                                    <input 
                                        type="text"
                                        placeholder="https://images.unsplash..."
                                        value={data.cover_image}
                                        onChange={(e) => setData('cover_image', e.target.value)}
                                        className="form-control"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-slate-300 font-semibold mb-1">Description</label>
                                <textarea 
                                    rows="2"
                                    placeholder="Story of the event, venue details, highlights..."
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    className="form-control"
                                />
                            </div>

                            {/* Media URLs Manager */}
                            <div>
                                <label className="block text-slate-300 font-semibold mb-1">Add High-Res Photo URLs</label>
                                <div className="flex gap-2 mb-2">
                                    <input 
                                        type="text"
                                        placeholder="Paste image URL (https://images.unsplash...)"
                                        value={mediaUrlInput}
                                        onChange={(e) => setMediaUrlInput(e.target.value)}
                                        className="flex-1 form-control"
                                    />
                                    <button 
                                        type="button" 
                                        onClick={handleAddMediaUrl}
                                        className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold border border-slate-700"
                                    >
                                        Add
                                    </button>
                                </div>

                                {mediaUrlsList.length > 0 && (
                                    <div className="space-y-1 max-h-36 overflow-y-auto p-2 bg-slate-800/50 rounded-xl">
                                        {mediaUrlsList.map((url, i) => (
                                            <div key={i} className="flex items-center justify-between text-[11px] text-slate-300 py-1 border-b border-slate-700/50">
                                                <span className="truncate flex-1 mr-2">{url}</span>
                                                <button type="button" onClick={() => handleRemoveMediaUrl(i)} className="text-red-400 hover:text-red-300">
                                                    <X size={12} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <button 
                                type="submit" 
                                disabled={processing}
                                className="w-full btn-primary mt-2"
                            >
                                {processing ? 'Creating Album...' : 'Save & Publish Album'}
                            </button>
                        </form>
                    </div>
                </div>
            )}

        </PhotographerLayout>
    );
}
