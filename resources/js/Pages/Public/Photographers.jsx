import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';
import PhotographerCard from '@/Components/PhotographerCard';
import AdminPagination from '@/Components/AdminPagination';
import { 
    Search, 
    Filter, 
    X, 
    SlidersHorizontal, 
    MapPin, 
    Calendar, 
    Star, 
    Camera, 
    Sparkles, 
    ArrowUpDown, 
    RotateCcw 
} from 'lucide-react';

export default function Photographers({ photographers = {}, categories = [], filters = {} }) {
    const [search, setSearch] = useState(filters.q || '');
    const [selectedCategory, setSelectedCategory] = useState(filters.category || '');
    const [location, setLocation] = useState(filters.location || '');
    const [minPrice, setMinPrice] = useState(filters.min_price || '');
    const [maxPrice, setMaxPrice] = useState(filters.max_price || '');
    const [minRating, setMinRating] = useState(filters.min_rating || '');
    const [experience, setExperience] = useState(filters.experience || '');
    const [date, setDate] = useState(filters.date || '');
    const [sort, setSort] = useState(filters.sort || 'recommended');
    const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

    const applyFilters = (overrides = {}) => {
        const query = {
            q: search,
            category: selectedCategory,
            location: location,
            min_price: minPrice,
            max_price: maxPrice,
            min_rating: minRating,
            experience: experience,
            date: date,
            sort: sort,
            ...overrides,
        };

        // Filter out empty params
        Object.keys(query).forEach(key => {
            if (!query[key]) delete query[key];
        });

        router.get('/photographers', query, { preserveState: true });
    };

    const handleReset = () => {
        setSearch('');
        setSelectedCategory('');
        setLocation('');
        setMinPrice('');
        setMaxPrice('');
        setMinRating('');
        setExperience('');
        setDate('');
        setSort('recommended');
        router.get('/photographers');
    };

    const handleSortChange = (newSort) => {
        setSort(newSort);
        applyFilters({ sort: newSort });
    };

    return (
        <PublicLayout title="Find & Book Photographers">
            
            {/* Top Search Bar & Header */}
            <div className="bg-slate-900/60 border-b border-slate-800/80 py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
                                Verified Photographers in India
                            </h1>
                            <p className="text-xs text-slate-400 mt-1">
                                Showing {photographers.total || photographers.data?.length || 0} top rated photographers ready for booking
                            </p>
                        </div>

                        {/* Search Input */}
                        <div className="flex items-center gap-2 max-w-md w-full">
                            <div className="relative flex-1">
                                <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                                <input 
                                    type="text"
                                    placeholder="Search by name, city, style..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
                                    className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
                                />
                            </div>
                            <button 
                                onClick={() => applyFilters()}
                                className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition shrink-0"
                            >
                                Search
                            </button>
                            <button
                                onClick={() => setIsMobileFilterOpen(true)}
                                className="lg:hidden p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 shrink-0"
                                title="Open Filters"
                            >
                                <SlidersHorizontal size={18} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Listing Layout */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col lg:flex-row gap-8 items-start">
                    
                    {/* DESKTOP FILTERS SIDEBAR */}
                    <aside className="hidden lg:block w-72 bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 sticky top-28 shrink-0">
                        <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-5">
                            <span className="text-xs uppercase font-extrabold text-white flex items-center gap-1.5">
                                <Filter className="w-3.5 h-3.5 text-emerald-400" />
                                Filter Results
                            </span>
                            <button 
                                onClick={handleReset}
                                className="text-[11px] text-slate-400 hover:text-emerald-400 flex items-center gap-1 transition"
                            >
                                <RotateCcw size={11} /> Reset
                            </button>
                        </div>

                        <div className="space-y-5 text-xs">
                            {/* Category Filter */}
                            <div>
                                <label className="block font-bold text-slate-300 mb-2">Category</label>
                                <select 
                                    value={selectedCategory}
                                    onChange={(e) => {
                                        setSelectedCategory(e.target.value);
                                        applyFilters({ category: e.target.value });
                                    }}
                                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs text-white"
                                >
                                    <option value="">All Categories</option>
                                    {categories.map((cat) => (
                                        <option key={cat.id} value={cat.slug}>{cat.name}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Location Filter */}
                            <div>
                                <label className="block font-bold text-slate-300 mb-2">City / Location</label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
                                    <input 
                                        type="text"
                                        placeholder="e.g. Delhi, Jaipur, Mumbai"
                                        value={location}
                                        onChange={(e) => setLocation(e.target.value)}
                                        onBlur={() => applyFilters()}
                                        onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
                                        className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white"
                                    />
                                </div>
                            </div>

                            {/* Date Availability */}
                            <div>
                                <label className="block font-bold text-slate-300 mb-2">Available On Date</label>
                                <input 
                                    type="date"
                                    min={new Date().toISOString().split('T')[0]}
                                    value={date}
                                    onChange={(e) => {
                                        setDate(e.target.value);
                                        applyFilters({ date: e.target.value });
                                    }}
                                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2 text-xs text-white"
                                />
                            </div>

                            {/* Budget Range */}
                            <div>
                                <label className="block font-bold text-slate-300 mb-2">Budget Range (₹)</label>
                                <div className="grid grid-cols-2 gap-2">
                                    <input 
                                        type="number"
                                        placeholder="Min ₹"
                                        value={minPrice}
                                        onChange={(e) => setMinPrice(e.target.value)}
                                        onBlur={() => applyFilters()}
                                        className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2 text-xs text-white"
                                    />
                                    <input 
                                        type="number"
                                        placeholder="Max ₹"
                                        value={maxPrice}
                                        onChange={(e) => setMaxPrice(e.target.value)}
                                        onBlur={() => applyFilters()}
                                        className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2 text-xs text-white"
                                    />
                                </div>
                            </div>

                            {/* Min Rating */}
                            <div>
                                <label className="block font-bold text-slate-300 mb-2">Minimum Rating</label>
                                <div className="grid grid-cols-4 gap-1.5">
                                    {[4.5, 4.0, 3.5, 3.0].map((rating) => (
                                        <button
                                            key={rating}
                                            type="button"
                                            onClick={() => {
                                                const newVal = String(minRating) === String(rating) ? '' : String(rating);
                                                setMinRating(newVal);
                                                applyFilters({ min_rating: newVal });
                                            }}
                                            className={`p-2 rounded-xl border text-center font-bold transition ${
                                                String(minRating) === String(rating)
                                                    ? 'bg-amber-500 text-slate-950 border-amber-500'
                                                    : 'bg-slate-800 border-slate-700 text-slate-300 hover:border-slate-600'
                                            }`}
                                        >
                                            {rating}★
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Experience */}
                            <div>
                                <label className="block font-bold text-slate-300 mb-2">Minimum Experience</label>
                                <select
                                    value={experience}
                                    onChange={(e) => {
                                        setExperience(e.target.value);
                                        applyFilters({ experience: e.target.value });
                                    }}
                                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2 text-xs text-white"
                                >
                                    <option value="">Any Experience</option>
                                    <option value="3">3+ Years Experience</option>
                                    <option value="5">5+ Years Experience</option>
                                    <option value="8">8+ Years Experience</option>
                                    <option value="10">10+ Years Experience</option>
                                </select>
                            </div>

                            <button 
                                onClick={() => applyFilters()}
                                className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold transition"
                            >
                                Apply Filters
                            </button>
                        </div>
                    </aside>

                    {/* RIGHT RESULTS CONTENT */}
                    <div className="flex-1 w-full">
                        
                        {/* Sort & Controls Bar */}
                        <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-800/80">
                            <div className="text-xs text-slate-400">
                                Showing <span className="text-white font-bold">{photographers.data?.length || 0}</span> results
                            </div>

                            <div className="flex items-center gap-2">
                                <span className="text-xs text-slate-400 hidden sm:inline">Sort by:</span>
                                <select 
                                    value={sort}
                                    onChange={(e) => handleSortChange(e.target.value)}
                                    className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white font-medium focus:outline-none"
                                >
                                    <option value="recommended">Recommended & Featured</option>
                                    <option value="rating">Highest Rated</option>
                                    <option value="price_low">Price: Low to High</option>
                                    <option value="price_high">Price: High to Low</option>
                                    <option value="most_reviewed">Most Reviewed</option>
                                    <option value="most_booked">Most Booked</option>
                                </select>
                            </div>
                        </div>

                        {/* Photographers Grid */}
                        {photographers.data && photographers.data.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                                {photographers.data.map((photographer) => (
                                    <PhotographerCard key={photographer.id} photographer={photographer} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-16 bg-slate-900/40 rounded-3xl border border-slate-800 p-8">
                                <Camera className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                                <h3 className="text-lg font-bold text-white">No Photographers Found</h3>
                                <p className="text-xs text-slate-400 max-w-md mx-auto mt-1 mb-6">
                                    We couldn't find any photographers matching your current search filters. Try clearing some filters or searching for another city.
                                </p>
                                <button onClick={handleReset} className="btn-secondary">
                                    <RotateCcw size={14} /> Clear All Filters
                                </button>
                            </div>
                        )}

                        {/* Pagination */}
                        {photographers.links && (
                            <AdminPagination links={photographers.links} />
                        )}
                    </div>
                </div>
            </div>

            {/* MOBILE FILTER DRAWER */}
            {isMobileFilterOpen && (
                <div className="fixed inset-0 z-200 bg-black/80 backdrop-blur-sm flex justify-end lg:hidden">
                    <div className="w-80 bg-slate-900 h-full p-6 overflow-y-auto flex flex-col justify-between">
                        <div>
                            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
                                <h3 className="font-bold text-white text-sm">Filters</h3>
                                <button onClick={() => setIsMobileFilterOpen(false)} className="p-1 text-slate-400">
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="space-y-4 text-xs">
                                <div>
                                    <label className="block font-bold text-slate-300 mb-1.5">Category</label>
                                    <select 
                                        value={selectedCategory}
                                        onChange={(e) => setSelectedCategory(e.target.value)}
                                        className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2 text-white"
                                    >
                                        <option value="">All Categories</option>
                                        {categories.map((cat) => (
                                            <option key={cat.id} value={cat.slug}>{cat.name}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block font-bold text-slate-300 mb-1.5">City</label>
                                    <input 
                                        type="text"
                                        placeholder="City name"
                                        value={location}
                                        onChange={(e) => setLocation(e.target.value)}
                                        className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2 text-white"
                                    />
                                </div>

                                <div>
                                    <label className="block font-bold text-slate-300 mb-1.5">Date</label>
                                    <input 
                                        type="date"
                                        value={date}
                                        onChange={(e) => setDate(e.target.value)}
                                        className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2 text-white"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="pt-6 border-t border-slate-800 flex gap-2">
                            <button onClick={handleReset} className="flex-1 btn-secondary text-center justify-center">Reset</button>
                            <button 
                                onClick={() => {
                                    applyFilters();
                                    setIsMobileFilterOpen(false);
                                }} 
                                className="flex-1 btn-primary text-center justify-center"
                            >
                                Apply
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </PublicLayout>
    );
}
