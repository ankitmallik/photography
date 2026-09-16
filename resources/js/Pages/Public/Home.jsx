import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';
import PhotographerCard from '@/Components/PhotographerCard';
import StarRating from '@/Components/StarRating';
import { 
    Search, 
    MapPin, 
    Calendar, 
    Camera, 
    Sparkles, 
    ShieldCheck, 
    CheckCircle2, 
    Star, 
    ArrowRight, 
    Heart, 
    Video, 
    Award,
    CreditCard
} from 'lucide-react';

export default function Home({ categories = [], featuredPhotographers = [], recentReviews = [], topCities = [] }) {
    const [searchLocation, setSearchLocation] = useState('');
    const [searchCategory, setSearchCategory] = useState('');
    const [searchDate, setSearchDate] = useState('');
    const [searchBudget, setSearchBudget] = useState('');

    const handleSearch = (e) => {
        e.preventDefault();
        const params = {};
        if (searchLocation) params.location = searchLocation;
        if (searchCategory) params.category = searchCategory;
        if (searchDate) params.date = searchDate;
        if (searchBudget) params.max_price = searchBudget;

        router.get('/photographers', params);
    };

    return (
        <PublicLayout title="Find the Perfect Photographer for Your Special Moments">
            
            {/* HERO SECTION */}
            <section className="relative pt-12 pb-24 overflow-hidden">
                {/* Background glow & gradients */}
                <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-gradient-to-tr from-emerald-500/15 via-teal-500/10 to-transparent blur-3xl pointer-events-none -z-10" />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    
                    {/* Pill Announcement */}
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs font-bold mb-6">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Verified Indian Photographers & Drone Cinematographers</span>
                    </div>

                    <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight max-w-4xl mx-auto leading-tight sm:leading-none mb-6">
                        Find the <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">Perfect Photographer</span> for Your Special Moments
                    </h1>

                    <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed">
                        Discover top-rated wedding, pre-wedding, candid, and commercial photographers across India. Compare packages, check live availability, and book securely.
                    </p>

                    {/* SEARCH BOX */}
                    <div className="max-w-5xl mx-auto bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-3xl p-4 sm:p-5 shadow-2xl shadow-black/80">
                        <form onSubmit={handleSearch} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                            
                            {/* Location */}
                            <div className="relative text-left bg-slate-800/80 rounded-2xl p-3 border border-slate-700/60 focus-within:border-emerald-500 transition">
                                <label className="text-[10.5px] uppercase font-bold text-slate-400 tracking-wider flex items-center gap-1 mb-1">
                                    <MapPin className="w-3 h-3 text-emerald-400" />
                                    Location / City
                                </label>
                                <input 
                                    type="text" 
                                    placeholder="e.g. Delhi, Mumbai, Jaipur"
                                    value={searchLocation}
                                    onChange={(e) => setSearchLocation(e.target.value)}
                                    className="w-full bg-transparent text-sm text-white font-medium focus:outline-none placeholder:text-slate-500"
                                />
                            </div>

                            {/* Event Type / Category */}
                            <div className="relative text-left bg-slate-800/80 rounded-2xl p-3 border border-slate-700/60 focus-within:border-emerald-500 transition">
                                <label className="text-[10.5px] uppercase font-bold text-slate-400 tracking-wider flex items-center gap-1 mb-1">
                                    <Camera className="w-3 h-3 text-emerald-400" />
                                    Event Type
                                </label>
                                <select 
                                    value={searchCategory}
                                    onChange={(e) => setSearchCategory(e.target.value)}
                                    className="w-full bg-transparent text-sm text-white font-medium focus:outline-none cursor-pointer"
                                >
                                    <option value="" className="bg-slate-900 text-slate-300">All Categories</option>
                                    {categories.map((cat) => (
                                        <option key={cat.id} value={cat.slug} className="bg-slate-900 text-white">
                                            {cat.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Event Date */}
                            <div className="relative text-left bg-slate-800/80 rounded-2xl p-3 border border-slate-700/60 focus-within:border-emerald-500 transition">
                                <label className="text-[10.5px] uppercase font-bold text-slate-400 tracking-wider flex items-center gap-1 mb-1">
                                    <Calendar className="w-3 h-3 text-emerald-400" />
                                    Event Date
                                </label>
                                <input 
                                    type="date" 
                                    min={new Date().toISOString().split('T')[0]}
                                    value={searchDate}
                                    onChange={(e) => setSearchDate(e.target.value)}
                                    className="w-full bg-transparent text-sm text-white font-medium focus:outline-none"
                                />
                            </div>

                            {/* Search Button */}
                            <div className="flex items-center">
                                <button
                                    type="submit"
                                    className="w-full h-full min-h-[52px] rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-sm transition shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 group"
                                >
                                    <Search className="w-4 h-4 transition-transform group-hover:scale-110" />
                                    Search Photographers
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Quick Stats Banner */}
                    <div className="max-w-4xl mx-auto mt-12 grid grid-cols-2 md:grid-cols-4 gap-6 pt-8 border-t border-slate-800/80 text-center">
                        <div>
                            <div className="text-2xl sm:text-3xl font-extrabold text-white">100%</div>
                            <div className="text-xs text-slate-400 mt-1">Verified Studios</div>
                        </div>
                        <div>
                            <div className="text-2xl sm:text-3xl font-extrabold text-white">500+</div>
                            <div className="text-xs text-slate-400 mt-1">Portfolio Albums</div>
                        </div>
                        <div>
                            <div className="text-2xl sm:text-3xl font-extrabold text-white">4.9 ★</div>
                            <div className="text-xs text-slate-400 mt-1">Average Client Rating</div>
                        </div>
                        <div>
                            <div className="text-2xl sm:text-3xl font-extrabold text-white">₹0 Fee</div>
                            <div className="text-xs text-slate-400 mt-1">Free for Customers</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* POPULAR CATEGORIES */}
            <section className="py-16 bg-slate-900/40 border-y border-slate-800/80">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
                        <div>
                            <span className="text-xs uppercase font-bold text-emerald-400 tracking-wider">Explore By Speciality</span>
                            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">Popular Photography Categories</h2>
                        </div>
                        <Link href="/photographers" className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 mt-2 md:mt-0 transition">
                            View All Categories <ArrowRight size={14} />
                        </Link>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                        {categories.map((cat) => (
                            <Link 
                                key={cat.id} 
                                href={`/photographers?category=${cat.slug}`}
                                className="group relative rounded-2xl overflow-hidden h-44 bg-slate-800 border border-slate-800 hover:border-emerald-500/50 transition duration-300 shadow-md"
                            >
                                <img 
                                    src={cat.image || 'https://images.unsplash.com/photo-1519741497674-611481863552?w=500'} 
                                    alt={cat.name}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 opacity-60 group-hover:opacity-75"
                                    loading="lazy"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent p-4 flex flex-col justify-end">
                                    <h3 className="font-bold text-sm text-white group-hover:text-emerald-300 transition">
                                        {cat.name}
                                    </h3>
                                    <p className="text-[11px] text-slate-400 mt-0.5">
                                        {cat.photographers_count || '10+'} Studios
                                    </p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* FEATURED PHOTOGRAPHERS */}
            <section className="py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
                        <div>
                            <span className="text-xs uppercase font-bold text-amber-400 tracking-wider flex items-center gap-1">
                                <Sparkles className="w-3.5 h-3.5" /> Spotlight Artists
                            </span>
                            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">Featured & Top Rated Photographers</h2>
                        </div>
                        <Link href="/photographers" className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 mt-2 md:mt-0 transition">
                            Explore All Photographers <ArrowRight size={14} />
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {featuredPhotographers.map((photographer) => (
                            <PhotographerCard key={photographer.id} photographer={photographer} />
                        ))}
                    </div>
                </div>
            </section>

            {/* HOW IT WORKS */}
            <section className="py-20 bg-slate-900/40 border-y border-slate-800/80">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <span className="text-xs uppercase font-bold text-emerald-400 tracking-wider">Simple 4-Step Process</span>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1 mb-12">How LensCraft Marketplace Works</h2>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 relative flex flex-col items-center">
                            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center font-bold text-lg mb-4">
                                1
                            </div>
                            <h3 className="font-bold text-base text-white mb-2">Search & Filter</h3>
                            <p className="text-xs text-slate-400 leading-relaxed">
                                Enter your city, event date, and budget to find verified photography professionals.
                            </p>
                        </div>

                        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 relative flex flex-col items-center">
                            <div className="w-12 h-12 rounded-2xl bg-teal-500/10 text-teal-400 border border-teal-500/20 flex items-center justify-center font-bold text-lg mb-4">
                                2
                            </div>
                            <h3 className="font-bold text-base text-white mb-2">Inspect Portfolios</h3>
                            <p className="text-xs text-slate-400 leading-relaxed">
                                View full-resolution photo albums, 4K teasers, packages, equipment lists, and genuine client reviews.
                            </p>
                        </div>

                        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 relative flex flex-col items-center">
                            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center justify-center font-bold text-lg mb-4">
                                3
                            </div>
                            <h3 className="font-bold text-base text-white mb-2">Book with Advance</h3>
                            <p className="text-xs text-slate-400 leading-relaxed">
                                Send custom requests. Once accepted, secure your date with a safe advance deposit.
                            </p>
                        </div>

                        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 relative flex flex-col items-center">
                            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-400 border border-purple-500/20 flex items-center justify-center font-bold text-lg mb-4">
                                4
                            </div>
                            <h3 className="font-bold text-base text-white mb-2">Capture Memories</h3>
                            <p className="text-xs text-slate-400 leading-relaxed">
                                Receive professional deliverables on time and share your feedback with a review.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* TESTIMONIALS & REVIEWS */}
            {recentReviews.length > 0 && (
                <section className="py-20">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center max-w-2xl mx-auto mb-14">
                            <span className="text-xs uppercase font-bold text-emerald-400 tracking-wider">Happy Couples & Clients</span>
                            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">What Our Customers Say</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {recentReviews.map((rev) => (
                                <div key={rev.id} className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-lg">
                                    <div className="flex items-center justify-between mb-4">
                                        <StarRating rating={rev.rating} showCount={false} size="md" />
                                        <span className="text-[11px] text-slate-500 font-medium">{new Date(rev.created_at).toLocaleDateString()}</span>
                                    </div>
                                    <p className="text-sm text-slate-300 italic mb-4 leading-relaxed">
                                        "{rev.review_text}"
                                    </p>
                                    <div className="flex items-center justify-between pt-4 border-t border-slate-800/80">
                                        <div className="text-xs font-bold text-white">
                                            {rev.customer?.name || 'Happy Client'}
                                        </div>
                                        {rev.photographer && (
                                            <span className="text-xs text-emerald-400 font-medium">
                                                Booked {rev.photographer.business_name}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* CALL TO ACTION */}
            <section className="py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-gradient-to-tr from-emerald-600 to-teal-500 rounded-3xl p-8 sm:p-12 text-slate-950 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-8 shadow-2xl">
                        <div className="max-w-xl">
                            <h2 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight">
                                Are You a Professional Photographer or Studio?
                            </h2>
                            <p className="mt-2 text-sm sm:text-base font-semibold text-slate-900/80 leading-relaxed">
                                Join hundreds of photographers expanding their business with high-value wedding and event bookings on LensCraft.
                            </p>
                        </div>
                        <div className="shrink-0 flex flex-col sm:flex-row gap-3">
                            <Link 
                                href="/register/photographer"
                                className="px-6 py-3.5 rounded-2xl bg-slate-950 hover:bg-slate-900 text-white font-extrabold text-sm transition shadow-lg"
                            >
                                Register Your Studio
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

        </PublicLayout>
    );
}
