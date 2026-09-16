import React, { useState, useEffect } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import { 
    LayoutDashboard, 
    Camera, 
    Users, 
    Layers, 
    CalendarCheck, 
    CreditCard, 
    Percent, 
    BadgeCheck, 
    Star, 
    AlertTriangle, 
    Ticket, 
    Settings, 
    LogOut, 
    Sun, 
    Moon, 
    Menu, 
    X,
    CheckCircle2
} from 'lucide-react';

export default function AdminLayout({ children, title = 'Admin Console', subtitle = '' }) {
    const { url, props } = usePage();
    const { auth, flash } = props;
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [theme, setTheme] = useState(() => {
        return localStorage.getItem('theme') || 'dark';
    });

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
    };

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    const navItems = [
        { label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard, exact: true },
        { label: 'Pending Verifications', href: '/admin/photographers/pending', icon: BadgeCheck, badge: 'Pending' },
        { label: 'Photographers', href: '/admin/photographers', icon: Camera },
        { label: 'Customers', href: '/admin/customers', icon: Users },
        { label: 'Categories', href: '/admin/categories', icon: Layers },
        { label: 'Bookings', href: '/admin/bookings', icon: CalendarCheck },
        { label: 'Payments', href: '/admin/payments', icon: CreditCard },
        { label: 'Commissions', href: '/admin/commissions', icon: Percent },
        { label: 'Payout Requests', href: '/admin/payouts', icon: CreditCard },
        { label: 'Reviews', href: '/admin/reviews', icon: Star },
        { label: 'Reports', href: '/admin/reports', icon: AlertTriangle },
        { label: 'Coupons', href: '/admin/coupons', icon: Ticket },
        { label: 'Settings', href: '/admin/settings', icon: Settings },
    ];

    const isActive = (item) => {
        if (item.exact) return url === item.href;
        return url.startsWith(item.href);
    };

    return (
        <>
            <Head title={`${title} — Admin Console`} />
            
            {/* Sidebar */}
            <aside className={`sidebar ${isSidebarOpen ? 'open' : ''}`} id="sidebar">
                <div className="sidebar-brand">
                    <div className="brand-mark">
                        <Camera className="w-5 h-5 text-white" />
                    </div>
                    <div className="brand-text">
                        Lens<span>Craft</span>
                        <small>Admin Console</small>
                    </div>
                </div>

                <p className="nav-section-label">Platform Overview</p>
                <ul className="space-y-1">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const active = isActive(item);
                        return (
                            <li key={item.href}>
                                <Link 
                                    href={item.href} 
                                    className={`nav-link ${active ? 'active' : ''}`}
                                    onClick={() => setIsSidebarOpen(false)}
                                >
                                    <Icon />
                                    <span className="flex-1">{item.label}</span>
                                    {item.badge && (
                                        <span className="text-[10px] bg-amber-500/20 text-amber-400 font-bold px-2 py-0.5 rounded-full">
                                            {item.badge}
                                        </span>
                                    )}
                                </Link>
                            </li>
                        );
                    })}
                </ul>

                <div className="sidebar-footer">
                    <Link href="/logout" method="post" as="button" className="logout-btn">
                        <LogOut />
                        Sign Out
                    </Link>
                </div>
            </aside>

            {isSidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black/60 backdrop-blur-xs z-150 md:hidden"
                    onClick={toggleSidebar}
                />
            )}

            {/* Main Wrapper */}
            <div className="main-wrapper">
                <header className="topbar">
                    <div className="topbar-left">
                        <button className="menu-toggle" onClick={toggleSidebar} aria-label="Toggle menu">
                            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
                        </button>
                        <div className="page-title">
                            <h1>{title}</h1>
                            {subtitle && <p>{subtitle}</p>}
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <button 
                            className="theme-toggle-btn" 
                            onClick={toggleTheme}
                            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
                        >
                            {theme === 'dark' ? (
                                <>
                                    <Sun className="theme-icon text-amber-400" />
                                    <span>Light</span>
                                </>
                            ) : (
                                <>
                                    <Moon className="theme-icon text-indigo-500" />
                                    <span>Dark</span>
                                </>
                            )}
                        </button>

                        <div className="admin-profile">
                            <div className="avatar">
                                {auth?.user?.avatar ? (
                                    <img src={auth.user.avatar} alt="Admin" />
                                ) : (
                                    'A'
                                )}
                            </div>
                            <div className="who">
                                <div className="name">{auth?.user?.name || 'Administrator'}</div>
                                <div className="role">Super Admin</div>
                            </div>
                        </div>
                    </div>
                </header>

                <main className="content">
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
                </main>
            </div>
        </>
    );
}
