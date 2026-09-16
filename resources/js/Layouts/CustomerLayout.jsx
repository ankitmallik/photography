import React, { useState } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import { 
    LayoutDashboard, 
    CalendarCheck, 
    Heart, 
    MessageSquare, 
    User, 
    Search, 
    LogOut, 
    Menu, 
    X,
    CheckCircle2,
    AlertTriangle,
    Camera
} from 'lucide-react';

export default function CustomerLayout({ children, title = 'Customer Portal' }) {
    const { props, url } = usePage();
    const { auth, flash } = props;
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const navItems = [
        { label: 'Overview', href: '/customer/dashboard', icon: LayoutDashboard },
        { label: 'My Bookings', href: '/customer/bookings', icon: CalendarCheck },
        { label: 'Saved Photographers', href: '/customer/favorites', icon: Heart },
        { label: 'Messages', href: '/customer/messages', icon: MessageSquare, badge: auth?.unreadMessagesCount > 0 ? auth.unreadMessagesCount : null },
        { label: 'My Profile', href: '/customer/profile', icon: User },
    ];

    const isActive = (path) => url === path || url.startsWith(path + '/');

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
            <Head title={`${title} — Customer Portal`} />

            {/* Mobile Header */}
            <div className="md:hidden bg-slate-900 border-b border-slate-800 px-4 py-3 flex items-center justify-between sticky top-0 z-100">
                <Link href="/" className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-slate-950 font-bold">
                        <Camera className="w-4 h-4" />
                    </div>
                    <span className="font-extrabold text-white">Lens<span className="text-emerald-400">Craft</span></span>
                </Link>
                <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 text-slate-300">
                    {isSidebarOpen ? <X size={22} /> : <Menu size={22} />}
                </button>
            </div>

            <div className="flex-1 flex max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 gap-8">
                {/* Customer Sidebar */}
                <aside className={`fixed inset-y-0 left-0 z-110 w-64 bg-slate-900 border-r border-slate-800 p-6 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 md:border-r-0 md:bg-slate-900/60 md:backdrop-blur-md md:rounded-2xl md:border md:border-slate-800/80 md:p-6 md:h-fit transition-transform`}>
                    
                    {/* User Card */}
                    <div className="flex items-center gap-3.5 pb-6 border-b border-slate-800 mb-6">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 font-extrabold text-lg flex items-center justify-center shadow-lg shadow-emerald-500/20 overflow-hidden">
                            {auth?.user?.avatar ? (
                                <img src={auth.user.avatar} alt={auth.user.name} className="w-full h-full object-cover" />
                            ) : (
                                auth?.user?.name?.charAt(0) || 'C'
                            )}
                        </div>
                        <div className="overflow-hidden">
                            <h3 className="font-bold text-white text-sm truncate">{auth?.user?.name}</h3>
                            <p className="text-xs text-slate-400 truncate">{auth?.user?.email}</p>
                            <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/15 text-emerald-400">Customer</span>
                        </div>
                    </div>

                    <nav className="space-y-1.5">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            const active = isActive(item.href);
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setIsSidebarOpen(false)}
                                    className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition ${
                                        active 
                                            ? 'bg-emerald-500/15 text-emerald-400 font-semibold border border-emerald-500/20' 
                                            : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                                    }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <Icon className="w-4 h-4" />
                                        <span>{item.label}</span>
                                    </div>
                                    {item.badge && (
                                        <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500 text-slate-950">
                                            {item.badge}
                                        </span>
                                    )}
                                </Link>
                            );
                        })}
                    </nav>

                    <div className="pt-6 mt-6 border-t border-slate-800 space-y-2">
                        <Link 
                            href="/photographers" 
                            className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-emerald-400 hover:bg-emerald-500/10 transition"
                        >
                            <Search className="w-4 h-4" />
                            Search Marketplace
                        </Link>
                        <Link 
                            href="/logout" 
                            method="post" 
                            as="button" 
                            className="w-full flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-red-400 hover:bg-red-500/10 transition text-left"
                        >
                            <LogOut className="w-4 h-4" />
                            Sign Out
                        </Link>
                    </div>
                </aside>

                {/* Main Customer Area */}
                <div className="flex-1 min-w-0">
                    {/* Flash messages */}
                    {flash?.success && (
                        <div className="mb-6 p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center gap-3">
                            <CheckCircle2 className="w-5 h-5 shrink-0" />
                            <span>{flash.success}</span>
                        </div>
                    )}
                    {flash?.error && (
                        <div className="mb-6 p-4 rounded-xl bg-red-500/15 border border-red-500/30 text-red-400 flex items-center gap-3">
                            <AlertTriangle className="w-5 h-5 shrink-0" />
                            <span>{flash.error}</span>
                        </div>
                    )}

                    {children}
                </div>
            </div>
        </div>
    );
}
