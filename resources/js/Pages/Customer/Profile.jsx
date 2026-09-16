import React from 'react';
import { Head, useForm } from '@inertiajs/react';
import CustomerLayout from '@/Layouts/CustomerLayout';
import { User, Phone, Mail, MapPin, CheckCircle, Save } from 'lucide-react';

export default function CustomerProfile({ user, profile = {} }) {
    const { data, setData, post, processing, errors } = useForm({
        name: user.name || '',
        phone: user.phone || '',
        city: profile?.city || '',
        state: profile?.state || '',
        address: profile?.address || '',
        bio: profile?.bio || '',
    });

    const submit = (e) => {
        e.preventDefault();
        post('/customer/profile');
    };

    return (
        <CustomerLayout title="My Profile Settings">
            
            <div className="mb-6">
                <h1 className="text-2xl font-extrabold text-white">Customer Profile</h1>
                <p className="text-xs text-slate-400 mt-0.5">Manage your contact information and booking details.</p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-2xl shadow-xl">
                <form onSubmit={submit} className="space-y-4">
                    <div className="field">
                        <label>Full Name *</label>
                        <div className="input-shell">
                            <User />
                            <input 
                                type="text"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                required
                            />
                        </div>
                        {errors.name && <div className="text-red-400 text-xs mt-1">{errors.name}</div>}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="field">
                            <label>Email Address</label>
                            <div className="input-shell opacity-75">
                                <Mail />
                                <input 
                                    type="email"
                                    value={user.email}
                                    disabled
                                    className="cursor-not-allowed bg-slate-800/50"
                                />
                            </div>
                        </div>

                        <div className="field">
                            <label>Phone Number *</label>
                            <div className="input-shell">
                                <Phone />
                                <input 
                                    type="text"
                                    value={data.phone}
                                    onChange={(e) => setData('phone', e.target.value)}
                                    required
                                />
                            </div>
                            {errors.phone && <div className="text-red-400 text-xs mt-1">{errors.phone}</div>}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="field">
                            <label>City</label>
                            <div className="input-shell">
                                <MapPin />
                                <input 
                                    type="text"
                                    placeholder="Delhi, Mumbai..."
                                    value={data.city}
                                    onChange={(e) => setData('city', e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="field">
                            <label>State</label>
                            <input 
                                type="text"
                                placeholder="State"
                                className="form-control"
                                value={data.state}
                                onChange={(e) => setData('state', e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="field">
                        <label>Delivery Address</label>
                        <textarea 
                            rows="2"
                            placeholder="Physical address for receiving photo albums or deliverables"
                            className="form-control"
                            value={data.address}
                            onChange={(e) => setData('address', e.target.value)}
                        />
                    </div>

                    <div className="field">
                        <label>About You / Event Preferences</label>
                        <textarea 
                            rows="3"
                            placeholder="e.g. Planning a destination wedding in Rajasthan next winter..."
                            className="form-control"
                            value={data.bio}
                            onChange={(e) => setData('bio', e.target.value)}
                        />
                    </div>

                    <div className="pt-4 border-t border-slate-800">
                        <button
                            type="submit"
                            disabled={processing}
                            className="btn-primary"
                        >
                            <Save size={16} />
                            {processing ? 'Saving Changes...' : 'Save Profile'}
                        </button>
                    </div>
                </form>
            </div>

        </CustomerLayout>
    );
}
