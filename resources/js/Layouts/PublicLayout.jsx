import React, { useState } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import { Camera, Search, Heart, MessageSquare, User, LogOut, Menu, X, ChevronDown, Sparkles } from 'lucide-react';

export default function PublicLayout({ children, title = 'Discover Top Photographers' }) {
    const { props, url } = usePage();
    const { auth, globalCategories, flash } = props;
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-white">
            <Head title={`${title} — LensCraft Marketplace`} />

            {/* Top Navigation */}
            <header className="sticky top-0 z-100 bg-slate-900/90 backdrop-blur-md border-b border-slate-800/80">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
                    
                    {/* Brand */}
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
                            <Camera className="w-5 h-5 text-slate-950 stroke-[2.5]" />
                        </div>
                        <div className="leading-tight">
                            <span className="text-xl font-extrabold tracking-tight text-white flex items-center gap-1">
                                Lens<span className="text-emerald-400">Craft</span>
                            </span>
                            <span className="text-[10.5px] uppercase font-semibold tracking-wider text-slate-400 block">
                                Marketplace
                            </span>
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
                        <Link 
                            href="/photographers" 
                            className={`transition-colors flex items-center gap-1.5 ${url.startsWith('/photographers') ? 'text-emerald-400 font-semibold' : 'text-slate-300 hover:text-white'}`}
                        >
                            <Search className="w-4 h-4" />
                            Explore Photographers
                        </Link>
                        <Link 
                            href="/photographers?category=wedding-photography" 
                            className="text-slate-300 hover:text-white transition-colors"
                        >
                            Weddings
                        </Link>
                        <Link 
                            href="/photographers?category=pre-wedding-shoot" 
                            className="text-slate-300 hover:text-white transition-colors"
                        >
                            Pre-Wedding
                        </Link>
                        <Link 
                            href="/photographers?category=cinematic-drone-films" 
                            className="text-slate-300 hover:text-white transition-colors"
                        >
                            Cinematic Films
                        </Link>
                    </nav>

                    {/* Right User Area */}
                    <div className="hidden md:flex items-center gap-4">
                        {auth?.user ? (
                            <div className="relative">
                                <button 
                                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                                    className="flex items-center gap-3 p-1.5 pr-3 rounded-full bg-slate-800 hover:bg-slate-750 border border-slate-700 transition"
                                >
                                    <div className="w-8 h-8 rounded-full bg-emerald-500 text-slate-950 font-bold flex items-center justify-center overflow-hidden text-xs">
                                        {auth.user.avatar ? (
                                            <img src={auth.user.avatar} alt={auth.user.name} className="w-full h-full object-cover" />
                                        ) : (
                                            auth.user.name.charAt(0)
                                        )}
                                    </div>
                                    <div className="text-left text-xs">
                                        <div className="font-semibold text-slate-200">{auth.user.name.split(' ')[0]}</div>
                                        <div className="text-[10px] text-emerald-400 capitalize">{auth.user.role}</div>
                                    </div>
                                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                                </button>

                                {isUserMenuOpen && (
                                    <div className="absolute right-0 mt-2 w-56 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl py-2 z-110 text-sm">
                                        {auth.user.role === 'admin' && (
                                            <Link href="/admin/dashboard" className="block px-4 py-2 hover:bg-slate-700/80 text-emerald-400 font-semibold">
                                                Admin Console
                                            </Link>
                                        )}
                                        {auth.user.role === 'photographer' && (
                                            <>
                                                <Link href="/photographer/dashboard" className="block px-4 py-2 hover:bg-slate-700/80 text-emerald-400 font-semibold">
                                                    Photographer Dashboard
                                                </Link>
                                                <Link href="/photographer/bookings" className="block px-4 py-2 hover:bg-slate-700/80 text-slate-200">
                                                    My Bookings
                                                </Link>
                                                <Link href="/photographer/earnings" className="block px-4 py-2 hover:bg-slate-700/80 text-slate-200">
                                                    Earnings & Payouts
                                                </Link>
                                            </>
                                        )}
                                        {auth.user.role === 'customer' && (
                                            <>
                                                <Link href="/customer/dashboard" className="block px-4 py-2 hover:bg-slate-700/80 text-emerald-400 font-semibold">
                                                    Customer Dashboard
                                                </Link>
                                                <Link href="/customer/bookings" className="block px-4 py-2 hover:bg-slate-700/80 text-slate-200">
                                                    My Bookings
                                                </Link>
                                                <Link href="/customer/favorites" className="block px-4 py-2 hover:bg-slate-700/80 text-slate-200">
                                                    Saved Photographers
                                                </Link>
                                                <Link href="/customer/messages" className="block px-4 py-2 hover:bg-slate-700/80 text-slate-200">
                                                    Messages
                                                </Link>
                                            </>
                                        )}
                                        <hr className="my-1.5 border-slate-700" />
                                        <Link href="/logout" method="post" as="button" className="w-full text-left px-4 py-2 text-red-400 hover:bg-red-500/10 flex items-center gap-2">
                                            <LogOut className="w-4 h-4" />
                                            Sign Out
                                        </Link>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="flex items-center gap-3">
                                <Link 
                                    href="/login" 
                                    className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition"
                                >
                                    Log In
                                </Link>
                                <Link 
                                    href="/register" 
                                    className="px-4 py-2 text-sm font-semibold text-slate-900 bg-emerald-400 hover:bg-emerald-300 rounded-xl transition shadow-lg shadow-emerald-500/20"
                                >
                                    Sign Up
                                </Link>
                                <Link 
                                    href="/register/photographer" 
                                    className="px-3.5 py-2 text-xs font-semibold text-emerald-400 hover:text-emerald-300 border border-emerald-500/30 hover:border-emerald-400/60 rounded-xl transition flex items-center gap-1.5"
                                >
                                    <Sparkles className="w-3.5 h-3.5" />
                                    Join as Photographer
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button 
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="md:hidden p-2 rounded-lg bg-slate-800 text-slate-300"
                    >
                        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>

                {/* Mobile Drawer */}
                {isMobileMenuOpen && (
                    <div className="md:hidden bg-slate-900 border-b border-slate-800 px-4 pt-2 pb-6 space-y-3">
                        <Link href="/photographers" className="block py-2 text-slate-200 font-medium">Explore Photographers</Link>
                        <Link href="/photographers?category=wedding-photography" className="block py-2 text-slate-300">Wedding Photography</Link>
                        <Link href="/photographers?category=pre-wedding-shoot" className="block py-2 text-slate-300">Pre-Wedding Shoots</Link>
                        <Link href="/photographers?category=cinematic-drone-films" className="block py-2 text-slate-300">Drone & Cinematic</Link>
                        
                        <div className="pt-4 border-t border-slate-800 flex flex-col gap-2">
                            {auth?.user ? (
                                <>
                                    <div className="text-xs text-slate-400 mb-1">Signed in as <span className="text-white font-semibold">{auth.user.name}</span></div>
                                    {auth.user.role === 'customer' && (
                                        <Link href="/customer/dashboard" className="block py-2 text-emerald-400 font-semibold">Customer Dashboard</Link>
                                    )}
                                    {auth.user.role === 'photographer' && (
                                        <Link href="/photographer/dashboard" className="block py-2 text-emerald-400 font-semibold">Photographer Dashboard</Link>
                                    )}
                                    {auth.user.role === 'admin' && (
                                        <Link href="/admin/dashboard" className="block py-2 text-emerald-400 font-semibold">Admin Panel</Link>
                                    )}
                                    <Link href="/logout" method="post" as="button" className="text-left py-2 text-red-400 font-medium">Log Out</Link>
                                </>
                            ) : (
                                <>
                                    <Link href="/login" className="block w-full text-center py-2.5 rounded-lg bg-slate-800 text-white font-semibold">Log In</Link>
                                    <Link href="/register" className="block w-full text-center py-2.5 rounded-lg bg-emerald-400 text-slate-950 font-bold">Sign Up as Customer</Link>
                                    <Link href="/register/photographer" className="block w-full text-center py-2.5 rounded-lg border border-emerald-500/40 text-emerald-400 font-semibold">Join as Photographer</Link>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </header>

            {/* Flash Messages */}
            {flash?.success && (
                <div className="bg-emerald-500 text-slate-950 font-semibold py-2.5 px-4 text-center text-sm shadow-md flex items-center justify-center gap-2">
                    <span>✨</span> {flash.success}
                </div>
            )}
            {flash?.error && (
                <div className="bg-red-500 text-white font-semibold py-2.5 px-4 text-center text-sm shadow-md">
                    {flash.error}
                </div>
            )}

            {/* Main Content */}
            <main className="flex-1">
                {children}
            </main>

            {/* Marketplace Footer */}
            <footer className="bg-slate-900 border-t border-slate-800/80 pt-16 pb-12 mt-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-10">
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center">
                                <Camera className="w-5 h-5 text-slate-950" />
                            </div>
                            <span className="text-xl font-extrabold text-white">Lens<span className="text-emerald-400">Craft</span></span>
                        </div>
                        <p className="text-xs text-slate-400 leading-relaxed">
                            India's leading marketplace connecting you with certified candid photographers, drone pilots, and cinematic wedding storytellers.
                        </p>
                    </div>

                    <div>
                        <h4 className="text-xs uppercase font-bold tracking-wider text-slate-300 mb-4">Categories</h4>
                        <ul className="space-y-2 text-xs text-slate-400">
                            <li><Link href="/photographers?category=wedding-photography" className="hover:text-emerald-400 transition">Wedding Photography</Link></li>
                            <li><Link href="/photographers?category=pre-wedding-shoot" className="hover:text-emerald-400 transition">Pre-Wedding Shoots</Link></li>
                            <li><Link href="/photographers?category=birthday-and-events" className="hover:text-emerald-400 transition">Birthdays & Anniversaries</Link></li>
                            <li><Link href="/photographers?category=maternity-baby-shoot" className="hover:text-emerald-400 transition">Maternity & Baby Shoots</Link></li>
                            <li><Link href="/photographers?category=corporate-brand-events" className="hover:text-emerald-400 transition">Corporate & Brands</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-xs uppercase font-bold tracking-wider text-slate-300 mb-4">Top Cities</h4>
                        <ul className="space-y-2 text-xs text-slate-400">
                            <li><Link href="/photographers?location=Delhi" className="hover:text-emerald-400 transition">Delhi NCR</Link></li>
                            <li><Link href="/photographers?location=Mumbai" className="hover:text-emerald-400 transition">Mumbai & Goa</Link></li>
                            <li><Link href="/photographers?location=Bengaluru" className="hover:text-emerald-400 transition">Bengaluru</Link></li>
                            <li><Link href="/photographers?location=Jaipur" className="hover:text-emerald-400 transition">Jaipur & Udaipur</Link></li>
                            <li><Link href="/photographers?location=Purnea" className="hover:text-emerald-400 transition">Purnea & Bihar</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-xs uppercase font-bold tracking-wider text-slate-300 mb-4">For Professionals</h4>
                        <p className="text-xs text-slate-400 mb-4">Are you a professional photographer or studio? Join LensCraft to grow your clients and bookings.</p>
                        <Link 
                            href="/register/photographer"
                            className="inline-block px-4 py-2 text-xs font-bold rounded-xl bg-emerald-500 text-slate-950 hover:bg-emerald-400 transition"
                        >
                            Register as Studio
                        </Link>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-6 border-t border-slate-800 text-center text-xs text-slate-500">
                    © {new Date().getFullYear()} LensCraft Marketplace. All rights reserved. Built with Laravel, React & Inertia.
                </div>
            </footer>
        </div>
    );
}
