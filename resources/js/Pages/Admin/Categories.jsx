import React, { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Plus, Edit2, Trash2, X, Camera } from 'lucide-react';

export default function AdminCategories({ categories = [] }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);

    const { data, setData, post, put, processing, errors, reset } = useForm({
        name: '',
        slug: '',
        description: '',
        icon: '',
        image: '',
        is_active: true,
        sort_order: 0,
    });

    const openCreateModal = () => {
        setEditingCategory(null);
        reset();
        setIsModalOpen(true);
    };

    const openEditModal = (cat) => {
        setEditingCategory(cat);
        setData({
            name: cat.name,
            slug: cat.slug,
            description: cat.description || '',
            icon: cat.icon || '',
            image: cat.image || '',
            is_active: cat.is_active,
            sort_order: cat.sort_order || 0,
        });
        setIsModalOpen(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editingCategory) {
            put(`/admin/categories/${editingCategory.id}`, {
                onSuccess: () => {
                    setIsModalOpen(false);
                    reset();
                },
            });
        } else {
            post('/admin/categories', {
                onSuccess: () => {
                    setIsModalOpen(false);
                    reset();
                },
            });
        }
    };

    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this category?')) {
            router.delete(`/admin/categories/${id}`);
        }
    };

    return (
        <AdminLayout title="Photography Categories">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-extrabold text-white">Photography Categories</h1>
                    <p className="text-xs text-slate-400 mt-0.5">Manage market genres (Wedding, Pre-wedding, Candid, Drone, etc.).</p>
                </div>

                <button onClick={openCreateModal} className="btn-primary btn-sm flex items-center gap-1.5 self-start">
                    <Plus size={14} /> Add Category
                </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {categories.map((cat) => (
                    <div key={cat.id} className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl flex flex-col justify-between">
                        <div>
                            <div className="h-36 bg-slate-800 relative overflow-hidden">
                                {cat.image ? (
                                    <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-slate-600">
                                        <Camera size={32} />
                                    </div>
                                )}
                            </div>
                            <div className="p-5">
                                <h3 className="font-bold text-base text-white">{cat.name}</h3>
                                <p className="text-[11px] text-emerald-400 font-mono mt-0.5">/{cat.slug}</p>
                                <p className="text-xs text-slate-400 mt-2 line-clamp-2">{cat.description || 'No description'}</p>
                            </div>
                        </div>

                        <div className="p-5 pt-0 flex items-center justify-between border-t border-slate-800 text-xs">
                            <span className="text-slate-500 font-semibold">{cat.photographers_count || 0} Studios</span>
                            <div className="flex items-center gap-2">
                                <button onClick={() => openEditModal(cat)} className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300">
                                    <Edit2 size={13} />
                                </button>
                                <button onClick={() => handleDelete(cat.id)} className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400">
                                    <Trash2 size={13} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* MODAL */}
            {isModalOpen && (
                <div className="fixed inset-0 z-200 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-bold text-white text-base">
                                {editingCategory ? 'Edit Category' : 'Add Category'}
                            </h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                                <X size={18} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                            <div>
                                <label className="block text-slate-300 font-semibold mb-1">Category Name *</label>
                                <input 
                                    type="text"
                                    placeholder="e.g. Wedding Photography"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    required
                                    className="form-control"
                                />
                                {errors.name && <div className="text-red-400 text-xs mt-1">{errors.name}</div>}
                            </div>

                            <div>
                                <label className="block text-slate-300 font-semibold mb-1">Slug (Optional)</label>
                                <input 
                                    type="text"
                                    placeholder="wedding-photography"
                                    value={data.slug}
                                    onChange={(e) => setData('slug', e.target.value)}
                                    className="form-control"
                                />
                            </div>

                            <div>
                                <label className="block text-slate-300 font-semibold mb-1">Cover Image URL</label>
                                <input 
                                    type="text"
                                    placeholder="https://images.unsplash..."
                                    value={data.image}
                                    onChange={(e) => setData('image', e.target.value)}
                                    className="form-control"
                                />
                            </div>

                            <div>
                                <label className="block text-slate-300 font-semibold mb-1">Description</label>
                                <textarea 
                                    rows="3"
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
                                {processing ? 'Saving...' : editingCategory ? 'Update Category' : 'Create Category'}
                            </button>
                        </form>
                    </div>
                </div>
            )}

        </AdminLayout>
    );
}
