import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { Camera, Lock, Mail, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';

export default function Login() {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
        password: '',
        remember: true,
    });

    const submit = (e) => {
        e.preventDefault();
        post('/login');
    };

    const fillDemo = (email, password) => {
        setData({
            email: email,
            password: password,
            remember: true,
        });
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden font-sans">
            <Head title="Sign In — LensCraft" />

            {/* Ambient Background Glow */}
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

            {/* Main Auth Card */}
            <div className="w-full max-w-md bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 sm:p-10 shadow-2xl shadow-black/80">
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-extrabold text-white tracking-tight">Welcome Back</h1>
                    <p className="text-xs text-slate-400 mt-1.5">Sign in to your account to manage bookings & shoots</p>
                </div>

                <form onSubmit={submit} className="space-y-5">
                    {/* Email Input */}
                    <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1.5">Email Address</label>
                        <div className="relative flex items-center">
                            <Mail className="absolute left-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
                            <input
                                type="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                placeholder="name@example.com"
                                required
                                autoFocus
                                className="w-full bg-slate-800/90 border border-slate-700/80 rounded-2xl pl-10 pr-4 py-3 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition"
                            />
                        </div>
                        {errors.email && <div className="text-red-400 text-xs mt-1.5 font-medium">{errors.email}</div>}
                    </div>

                    {/* Password Input */}
                    <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1.5">Password</label>
                        <div className="relative flex items-center">
                            <Lock className="absolute left-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
                            <input
                                type="password"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                placeholder="••••••••"
                                required
                                className="w-full bg-slate-800/90 border border-slate-700/80 rounded-2xl pl-10 pr-4 py-3 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition"
                            />
                        </div>
                        {errors.password && <div className="text-red-400 text-xs mt-1.5 font-medium">{errors.password}</div>}
                    </div>

                    {/* Remember & Register Link */}
                    <div className="flex items-center justify-between text-xs pt-1">
                        <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                            <input
                                type="checkbox"
                                checked={data.remember}
                                onChange={(e) => setData('remember', e.target.checked)}
                                className="w-4 h-4 rounded border-slate-700 bg-slate-800 text-emerald-500 accent-emerald-500 focus:ring-emerald-500"
                            />
                            <span>Remember me</span>
                        </label>
                        <Link href="/register" className="text-emerald-400 hover:text-emerald-300 font-semibold transition">
                            Create Account
                        </Link>
                    </div>

                    {/* Submit Button */}
                    <button 
                        type="submit" 
                        disabled={processing} 
                        className="w-full py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm transition shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 group disabled:opacity-50 mt-2"
                    >
                        <span>{processing ? 'Signing In...' : 'Sign In'}</span>
                        <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                    </button>
                </form>

                {/* Quick Demo Access Pills */}
                <div className="mt-8 pt-6 border-t border-slate-800/80 text-center">
                    <p className="text-[10.5px] uppercase font-bold text-slate-400 tracking-wider mb-3">⚡ Quick Demo 1-Click Login</p>
                    <div className="grid grid-cols-3 gap-2">
                        <button 
                            type="button" 
                            onClick={() => fillDemo('admin@lenscraft.com', 'password')}
                            className="px-3 py-2 text-xs rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 font-bold transition flex flex-col items-center"
                        >
                            <span className="font-extrabold">Admin</span>
                            <span className="text-[10px] text-slate-400">Full Panel</span>
                        </button>
                        <button 
                            type="button" 
                            onClick={() => fillDemo('arjun@malhotrastudios.com', 'password')}
                            className="px-3 py-2 text-xs rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 hover:bg-purple-500/20 font-bold transition flex flex-col items-center"
                        >
                            <span className="font-extrabold">Studio</span>
                            <span className="text-[10px] text-slate-400">Photographer</span>
                        </button>
                        <button 
                            type="button" 
                            onClick={() => fillDemo('rahul@example.com', 'password')}
                            className="px-3 py-2 text-xs rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 hover:bg-blue-500/20 font-bold transition flex flex-col items-center"
                        >
                            <span className="font-extrabold">Customer</span>
                            <span className="text-[10px] text-slate-400">Bookings</span>
                        </button>
                    </div>
                </div>

                <div className="mt-6 pt-6 border-t border-slate-800 text-center text-xs text-slate-400">
                    Are you a photographer?{' '}
                    <Link href="/register/photographer" className="text-emerald-400 font-bold hover:underline">
                        Register your Studio
                    </Link>
                </div>
            </div>
        </div>
    );
}
