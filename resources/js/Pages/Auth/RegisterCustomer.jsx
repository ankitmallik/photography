import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { Camera, Lock, Mail, User, Phone, MapPin, ArrowRight } from 'lucide-react';

export default function RegisterCustomer() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        phone: '',
        password: '',
        password_confirmation: '',
        city: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post('/register');
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden font-sans">
            <Head title="Customer Registration — LensCraft" />

            {/* Ambient Glow */}
            <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-gradient-to-tr from-emerald-500/15 via-teal-500/10 to-transparent blur-3xl pointer-events-none -z-10" />

            {/* Brand Header */}
            <Link href="/" className="flex items-center gap-3 mb-8 group">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-emerald-500/25 group-hover:scale-105 transition-transform">
                    <Camera className="w-6 h-6" />
                </div>
                <div className="text-2xl font-black tracking-tight text-white">
                    Lens<span className="text-emerald-400">Craft</span>
                </div>
            </Link>

            <div className="w-full max-w-lg bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 sm:p-10 shadow-2xl shadow-black/80">
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-extrabold text-white tracking-tight">Create Customer Account</h1>
                    <p className="text-xs text-slate-400 mt-1.5">Discover, book and chat with top verified photographers</p>
                </div>

                <form onSubmit={submit} className="space-y-4 text-xs">
                    <div>
                        <label className="block font-semibold text-slate-300 mb-1.5">Full Name *</label>
                        <div className="relative flex items-center">
                            <User className="absolute left-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
                            <input
                                type="text"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                placeholder="Priya Sharma"
                                required
                                className="w-full bg-slate-800/90 border border-slate-700/80 rounded-2xl pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition"
                            />
                        </div>
                        {errors.name && <div className="text-red-400 text-[11px] mt-1">{errors.name}</div>}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                            <label className="block font-semibold text-slate-300 mb-1.5">Email Address *</label>
                            <div className="relative flex items-center">
                                <Mail className="absolute left-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
                                <input
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    placeholder="priya@example.com"
                                    required
                                    className="w-full bg-slate-800/90 border border-slate-700/80 rounded-2xl pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition"
                                />
                            </div>
                            {errors.email && <div className="text-red-400 text-[11px] mt-1">{errors.email}</div>}
                        </div>

                        <div>
                            <label className="block font-semibold text-slate-300 mb-1.5">Phone Number *</label>
                            <div className="relative flex items-center">
                                <Phone className="absolute left-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
                                <input
                                    type="text"
                                    value={data.phone}
                                    onChange={(e) => setData('phone', e.target.value)}
                                    placeholder="+91 98765 43210"
                                    required
                                    className="w-full bg-slate-800/90 border border-slate-700/80 rounded-2xl pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition"
                                />
                            </div>
                            {errors.phone && <div className="text-red-400 text-[11px] mt-1">{errors.phone}</div>}
                        </div>
                    </div>

                    <div>
                        <label className="block font-semibold text-slate-300 mb-1.5">City (Optional)</label>
                        <div className="relative flex items-center">
                            <MapPin className="absolute left-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
                            <input
                                type="text"
                                value={data.city}
                                onChange={(e) => setData('city', e.target.value)}
                                placeholder="e.g. Delhi, Mumbai, Jaipur"
                                className="w-full bg-slate-800/90 border border-slate-700/80 rounded-2xl pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                            <label className="block font-semibold text-slate-300 mb-1.5">Password *</label>
                            <div className="relative flex items-center">
                                <Lock className="absolute left-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
                                <input
                                    type="password"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    placeholder="Min 6 chars"
                                    required
                                    className="w-full bg-slate-800/90 border border-slate-700/80 rounded-2xl pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition"
                                />
                            </div>
                            {errors.password && <div className="text-red-400 text-[11px] mt-1">{errors.password}</div>}
                        </div>

                        <div>
                            <label className="block font-semibold text-slate-300 mb-1.5">Confirm Password *</label>
                            <div className="relative flex items-center">
                                <Lock className="absolute left-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
                                <input
                                    type="password"
                                    value={data.password_confirmation}
                                    onChange={(e) => setData('password_confirmation', e.target.value)}
                                    placeholder="Confirm password"
                                    required
                                    className="w-full bg-slate-800/90 border border-slate-700/80 rounded-2xl pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition"
                                />
                            </div>
                        </div>
                    </div>

                    <button 
                        type="submit" 
                        disabled={processing} 
                        className="w-full py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm transition shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 group mt-4 disabled:opacity-50"
                    >
                        <span>{processing ? 'Creating Account...' : 'Complete Registration'}</span>
                        <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                    </button>
                </form>

                <div className="mt-8 pt-6 border-t border-slate-800 text-center text-xs text-slate-400">
                    Already have an account?{' '}
                    <Link href="/login" className="text-emerald-400 font-bold hover:underline">Sign In</Link>
                    {' • '}
                    <Link href="/register/photographer" className="text-purple-400 font-bold hover:underline">Join as Studio</Link>
                </div>
            </div>
        </div>
    );
}
