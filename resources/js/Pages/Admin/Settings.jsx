import React from 'react';
import { Head, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Settings as SettingsIcon, Save, Percent, DollarSign, Mail, ShieldCheck } from 'lucide-react';

export default function AdminSettings({ settings = {} }) {
    const { data, setData, post, processing } = useForm({
        site_name: settings.site_name || 'LensCraft Marketplace',
        site_email: settings.site_email || 'admin@lenscraft.com',
        site_phone: settings.site_phone || '+91 98765 43210',
        currency_symbol: settings.currency_symbol || '₹',
        commission_percentage: settings.commission_percentage || 10,
        advance_percentage: settings.advance_percentage || 25,
        razorpay_key: settings.razorpay_key || 'rzp_test_mockkey123',
    });

    const submit = (e) => {
        e.preventDefault();
        post('/admin/settings');
    };

    return (
        <AdminLayout title="Platform Settings">
            
            <div className="mb-6">
                <h1 className="text-2xl font-extrabold text-white">Platform Settings</h1>
                <p className="text-xs text-slate-400 mt-0.5">Configure global commissions, advance percentage, and payment gateway keys.</p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-2xl shadow-xl">
                <form onSubmit={submit} className="space-y-4 text-xs">
                    
                    <div className="field">
                        <label className="block text-slate-300 font-semibold mb-1">Platform Brand Name *</label>
                        <input 
                            type="text"
                            value={data.site_name}
                            onChange={(e) => setData('site_name', e.target.value)}
                            required
                            className="form-control"
                        />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                            <label className="block text-slate-300 font-semibold mb-1">Support Email *</label>
                            <input 
                                type="email"
                                value={data.site_email}
                                onChange={(e) => setData('site_email', e.target.value)}
                                required
                                className="form-control"
                            />
                        </div>
                        <div>
                            <label className="block text-slate-300 font-semibold mb-1">Support Phone</label>
                            <input 
                                type="text"
                                value={data.site_phone}
                                onChange={(e) => setData('site_phone', e.target.value)}
                                className="form-control"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                        <div>
                            <label className="block text-slate-300 font-semibold mb-1">Commission Rate (%) *</label>
                            <input 
                                type="number"
                                min="0"
                                max="50"
                                value={data.commission_percentage}
                                onChange={(e) => setData('commission_percentage', e.target.value)}
                                required
                                className="form-control"
                            />
                        </div>
                        <div>
                            <label className="block text-slate-300 font-semibold mb-1">Advance Deposit (%) *</label>
                            <input 
                                type="number"
                                min="10"
                                max="100"
                                value={data.advance_percentage}
                                onChange={(e) => setData('advance_percentage', e.target.value)}
                                required
                                className="form-control"
                            />
                        </div>
                        <div>
                            <label className="block text-slate-300 font-semibold mb-1">Currency Symbol</label>
                            <input 
                                type="text"
                                value={data.currency_symbol}
                                onChange={(e) => setData('currency_symbol', e.target.value)}
                                className="form-control"
                            />
                        </div>
                    </div>

                    <div className="pt-2">
                        <label className="block text-slate-300 font-semibold mb-1">Razorpay Key ID</label>
                        <input 
                            type="text"
                            value={data.razorpay_key}
                            onChange={(e) => setData('razorpay_key', e.target.value)}
                            className="form-control font-mono"
                        />
                    </div>

                    <div className="pt-4 border-t border-slate-800">
                        <button type="submit" disabled={processing} className="btn-primary">
                            <Save size={16} />
                            {processing ? 'Saving...' : 'Save Settings'}
                        </button>
                    </div>
                </form>
            </div>

        </AdminLayout>
    );
}
