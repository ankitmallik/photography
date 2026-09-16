import React, { useState } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import { 
    LayoutDashboard, 
    User, 
    Camera, 
    Layers, 
    Image as ImageIcon, 
    Calendar, 
    CalendarCheck, 
    TrendingUp, 
    CreditCard, 
    Star, 
    MessageSquare, 
    ExternalLink, 
    LogOut, 
    Menu, 
    X,
    CheckCircle2,
    AlertTriangle,
    Clock,
    Sparkles
} from 'lucide-react';

export default function PhotographerLayout({ children, title = 'Studio Console' }) {
    const { props, url } = usePage();
    const { auth, flash } = props;
    const photographer = auth?.photographer;
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const navItems = [
        { label: 'Overview', href: '/photographer/dashboard', icon: LayoutDashboard },
        { label: 'Studio Profile', href: '/photographer/profile', icon: User },
        { label: 'Services', href: '/photographer/services', icon: Layers },
        { label: 'Packages', href: '/photographer/packages', icon: Camera },
        { label: 'Portfolio Albums', href: '/photographer/portfolio', icon: ImageIcon },
        { label: 'Availability Calendar', href: '/photographer/availability', icon: Calendar },
        { label: 'Bookings & Orders', href: '/photographer/bookings', icon: CalendarCheck },
        { label: 'Earnings Ledger', href: '/photographer/earnings', icon: TrendingUp },
        { label: 'Payout Requests', href: '/photographer/payouts', icon: CreditCard },
        { label: 'Client Reviews', href: '/photographer/reviews', icon: Star },
        { label: 'Messages & Chat', href: '/photographer/messages', icon: MessageSquare, badge: auth?.unreadMessagesCount > 0 ? auth.unreadMessagesCount : null },
    ];

    const isActive = (path) => url === path || url.startsWith(path + '/');

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
            <Head title={`${title} — Photographer Dashboard`} />

            {/* Mobile Header */}
            <div className="md:hidden bg-slate-900 border-b border-slate-800 px-4 py-3 flex items-center justify-between sticky top-0 z-100">
                <Link href="/" className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-slate-950 font-bold">
                        <Camera className="w-4 h-4" />
                    </div>
                    <span className="font-extrabold text-white">Lens<span className="text-emerald-400">Craft</span> Studio</span>
                </Link>
                <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 text-slate-300">
                    {isSidebarOpen ? <X size={22} /> : <Menu size={22} />}
                </button>
            </div>

            <div className="flex-1 flex max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 gap-8">
                {/* Photographer Sidebar */}
                <aside className={`fixed inset-y-0 left-0 z-110 w-72 bg-slate-900 border-r border-slate-800 p-6 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 md:border-r-0 md:bg-slate-900/60 md:backdrop-blur-md md:rounded-2xl md:border md:border-slate-800/80 md:p-6 md:h-fit transition-transform`}>
                    
                    {/* Studio Brand Card */}
                    <div className="pb-6 border-b border-slate-800 mb-6">
                        <div className="flex items-center gap-3.5 mb-3">
                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 font-extrabold text-lg flex items-center justify-center shadow-lg shadow-emerald-500/20 overflow-hidden shrink-0">
                                {photographer?.profile_image ? (
                                    <img src={photographer.profile_image} alt={photographer.business_name} className="w-full h-full object-cover" />
                                ) : (
                                    photographer?.business_name?.charAt(0) || 'P'
                                )}
                            </div>
                            <div className="overflow-hidden">
                                <h3 className="font-bold text-white text-sm truncate">{photographer?.business_name || auth?.user?.name}</h3>
                                <p className="text-xs text-slate-400 truncate">{photographer?.city || 'Studio'}</p>
                            </div>
                        </div>

                        {/* Verification Status Pill */}
                        <div className="flex items-center justify-between text-xs">
                            {photographer?.verification_status === 'approved' ? (
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-400 font-semibold border border-emerald-500/30">
                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                    Verified Studio
                                </span>
                            ) : photographer?.verification_status === 'pending' ? (
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/15 text-amber-400 font-semibold border border-amber-500/30">
                                    <Clock className="w-3.5 h-3.5" />
                                    Pending Approval
                                </span>
                            ) : (
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-500/15 text-red-400 font-semibold border border-red-500/30">
                                    <AlertTriangle className="w-3.5 h-3.5" />
                                    {photographer?.verification_status || 'Unverified'}
                                </span>
                            )}

                            {photographer?.slug && photographer.verification_status === 'approved' && (
                                <Link 
                                    href={`/photographers/${photographer.slug}`} 
                                    target="_blank"
                                    className="text-slate-400 hover:text-emerald-400 flex items-center gap-1 transition"
                                    title="View Live Profile"
                                >
                                    <ExternalLink className="w-3.5 h-3.5" />
                                    Live
                                </Link>
                            )}
                        </div>

                        {/* Profile Completion Progress Bar */}
                        {photographer && (
                            <div className="mt-4 pt-3 border-t border-slate-800/80">
                                <div className="flex items-center justify-between text-xs mb-1.5">
                                    <span className="text-slate-400 font-medium">Profile Completion</span>
                                    <span className="font-bold text-emerald-400">{photographer.completion_percentage || 20}%</span>
                                </div>
                                <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                                    <div 
                                        className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-500" 
                                        style={{ width: `${photographer.completion_percentage || 20}%` }}
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    <nav className="space-y-1">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            const active = isActive(item.href);
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setIsSidebarOpen(false)}
                                    className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition ${
                                        active 
                                            ? 'bg-emerald-500/15 text-emerald-400 font-semibold border border-emerald-500/20' 
                                            : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                                    }`}
                                >
                                    <div className="flex items-center gap-2.5">
                                        <Icon className="w-4 h-4" />
                                        <span>{item.label}</span>
                                    </div>
                                    {item.badge && (
                                        <span className="px-2 py-0.2 text-[10.5px] font-bold rounded-full bg-emerald-500 text-slate-950">
                                            {item.badge}
                                        </span>
                                    )}
                                </Link>
                            );
                        })}
                    </nav>

                    <div className="pt-5 mt-5 border-t border-slate-800">
                        <Link 
                            href="/logout" 
                            method="post" 
                            as="button" 
                            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-red-400 hover:bg-red-500/10 transition text-left"
                        >
                            <LogOut className="w-4 h-4" />
                            Sign Out
                        </Link>
                    </div>
                </aside>

                {/* Main Content */}
                <div className="flex-1 min-w-0">
                    {/* Verification Notice Banner if Pending */}
                    {photographer?.verification_status === 'pending' && (
                        <div className="mb-6 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 flex items-start gap-3.5">
                            <Clock className="w-5 h-5 shrink-0 text-amber-400 mt-0.5" />
                            <div className="text-xs">
                                <h4 className="font-bold text-sm text-amber-200">Account Under Admin Verification</h4>
                                <p className="mt-1 text-amber-300/90 leading-relaxed">
                                    Your studio profile has been submitted and is currently under review by our admin moderation team. You can continue setting up your packages, services, portfolios and bank account. Once approved, your profile will be publicly visible to customers!
                                </p>
                            </div>
                        </div>
                    )}

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
