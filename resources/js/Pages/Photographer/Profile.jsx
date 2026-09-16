import React from 'react';
import { Head, useForm } from '@inertiajs/react';
import PhotographerLayout from '@/Layouts/PhotographerLayout';
import { Building, MapPin, Camera, Save, CheckCircle } from 'lucide-react';

export default function PhotographerProfilePage({ profile, allCategories = [] }) {
    const { data, setData, post, processing, errors } = useForm({
        business_name: profile.business_name || '',
        display_name: profile.display_name || '',
        tagline: profile.tagline || '',
        bio: profile.bio || '',
        experience_years: profile.experience_years || 1,
        profile_image: profile.profile_image || '',
        cover_image: profile.cover_image || '',
        address: profile.address || '',
        city: profile.city || '',
        state: profile.state || '',
        pincode: profile.pincode || '',
        starting_price: profile.starting_price || 10000,
        category_ids: profile.categories?.map(c => c.id) || [],
    });

    const handleCategoryToggle = (id) => {
        if (data.category_ids.includes(id)) {
            setData('category_ids', data.category_ids.filter(cId => cId !== id));
        } else {
            setData('category_ids', [...data.category_ids, id]);
        }
    };

    const submit = (e) => {
        e.preventDefault();
        post('/photographer/profile');
    };

    return (
        <PhotographerLayout title="Studio Profile Settings">
            
            <div className="mb-6">
                <h1 className="text-2xl font-extrabold text-white">Studio Profile & Branding</h1>
                <p className="text-xs text-slate-400 mt-0.5">Customize your public studio presentation, specialties and media.</p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-3xl shadow-xl">
                <form onSubmit={submit} className="space-y-5">
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="field">
                            <label>Studio Business Name *</label>
                            <input 
                                type="text"
                                className="form-control"
                                value={data.business_name}
                                onChange={(e) => setData('business_name', e.target.value)}
                                required
                            />
                            {errors.business_name && <div className="text-red-400 text-xs mt-1">{errors.business_name}</div>}
                        </div>

                        <div className="field">
                            <label>Years of Experience *</label>
                            <input 
                                type="number"
                                min="0"
                                className="form-control"
                                value={data.experience_years}
                                onChange={(e) => setData('experience_years', e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="field">
                        <label>Tagline / Headline</label>
                        <input 
                            type="text"
                            placeholder="e.g. Award-winning Luxury Wedding Cinematography"
                            className="form-control"
                            value={data.tagline}
                            onChange={(e) => setData('tagline', e.target.value)}
                        />
                    </div>

                    <div className="field">
                        <label>Studio Bio & Story</label>
                        <textarea 
                            rows="4"
                            className="form-control"
                            value={data.bio}
                            onChange={(e) => setData('bio', e.target.value)}
                        />
                    </div>

                    {/* Image URLs */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="field">
                            <label>Avatar Image URL</label>
                            <input 
                                type="text"
                                placeholder="https://images.unsplash.com/..."
                                className="form-control"
                                value={data.profile_image}
                                onChange={(e) => setData('profile_image', e.target.value)}
                            />
                        </div>
                        <div className="field">
                            <label>Cover Banner Image URL</label>
                            <input 
                                type="text"
                                placeholder="https://images.unsplash.com/..."
                                className="form-control"
                                value={data.cover_image}
                                onChange={(e) => setData('cover_image', e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Location */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="field">
                            <label>City *</label>
                            <input 
                                type="text"
                                className="form-control"
                                value={data.city}
                                onChange={(e) => setData('city', e.target.value)}
                                required
                            />
                        </div>
                        <div className="field">
                            <label>State *</label>
                            <input 
                                type="text"
                                className="form-control"
                                value={data.state}
                                onChange={(e) => setData('state', e.target.value)}
                                required
                            />
                        </div>
                        <div className="field">
                            <label>Starting Price (₹) *</label>
                            <input 
                                type="number"
                                className="form-control"
                                value={data.starting_price}
                                onChange={(e) => setData('starting_price', e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    {/* Category Selection */}
                    <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-2">Speciality Categories</label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                            {allCategories.map((cat) => {
                                const selected = data.category_ids.includes(cat.id);
                                return (
                                    <div 
                                        key={cat.id}
                                        onClick={() => handleCategoryToggle(cat.id)}
                                        className={`p-2.5 rounded-xl border text-xs font-semibold cursor-pointer transition flex items-center justify-between ${
                                            selected 
                                                ? 'bg-emerald-500/15 border-emerald-500 text-emerald-300' 
                                                : 'bg-slate-800/60 border-slate-700/80 text-slate-400 hover:border-slate-600'
                                        }`}
                                    >
                                        <span>{cat.name}</span>
                                        {selected && <CheckCircle size={13} className="text-emerald-400" />}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className="pt-4 border-t border-slate-800">
                        <button
                            type="submit"
                            disabled={processing}
                            className="btn-primary"
                        >
                            <Save size={16} />
                            {processing ? 'Saving Changes...' : 'Save Studio Profile'}
                        </button>
                    </div>
                </form>
            </div>

        </PhotographerLayout>
    );
}
