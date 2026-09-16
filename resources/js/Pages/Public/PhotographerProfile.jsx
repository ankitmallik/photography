import React, { useState } from 'react';
import { Head, Link, usePage, router } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';
import StarRating from '@/Components/StarRating';
import BookingModal from '@/Components/BookingModal';
import LightboxModal from '@/Components/LightboxModal';
import { 
    MapPin, 
    Calendar, 
    BadgeCheck, 
    Heart, 
    MessageSquare, 
    Camera, 
    Share2, 
    Check, 
    Clock, 
    ShieldCheck, 
    Sparkles, 
    Play, 
    Image as ImageIcon,
    ChevronRight,
    Users,
    Video,
    Award
} from 'lucide-react';

export default function PhotographerProfile({ photographer, isFavorited = false }) {
    const { props } = usePage();
    const { auth } = props;

    const [activeTab, setActiveTab] = useState('portfolio');
    const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('all');
    const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
    const [selectedPackageForModal, setSelectedPackageForModal] = useState(null);
    const [lightboxState, setLightboxState] = useState({ isOpen: false, index: 0, items: [] });
    const [favorited, setFavorited] = useState(isFavorited);

    // Flatten all portfolio media for lightbox
    const allMedia = photographer.portfolios?.flatMap(p => p.media || []) || [];
    
    // Filter media by portfolio category
    const filteredPortfolios = selectedCategoryFilter === 'all' 
        ? photographer.portfolios || []
        : (photographer.portfolios || []).filter(p => String(p.category_id) === String(selectedCategoryFilter));

    const openLightbox = (items, index) => {
        setLightboxState({
            isOpen: true,
            items: items,
            index: index,
        });
    };

    const handleToggleFavorite = () => {
        if (!auth?.user) {
            router.visit('/login');
            return;
        }

        router.post('/customer/favorites/toggle', {
            photographer_profile_id: photographer.id,
        }, {
            preserveScroll: true,
            onSuccess: () => setFavorited(!favorited),
        });
    };

    const handleStartChat = () => {
        if (!auth?.user) {
            router.visit('/login');
            return;
        }

        router.post('/customer/messages/send', {
            photographer_id: photographer.user_id,
            message_text: `Hi ${photographer.business_name}! I came across your portfolio on LensCraft and would like to inquire about booking photography for my event.`,
        });
    };

    const handlePackageBook = (pkg) => {
        setSelectedPackageForModal(pkg);
        setIsBookingModalOpen(true);
    };

    const tabs = [
        { id: 'portfolio', label: 'Portfolio Gallery', count: allMedia.length },
        { id: 'packages', label: 'Packages & Pricing', count: photographer.packages?.length },
        { id: 'services', label: 'Services', count: photographer.services?.length },
        { id: 'availability', label: 'Availability Calendar' },
        { id: 'about', label: 'About Studio' },
        { id: 'reviews', label: 'Client Reviews', count: photographer.review_count },
    ];

    return (
        <PublicLayout title={`${photographer.business_name} — Certified Photographer`}>
            
            {/* PROFILE HEADER HERO */}
            <div className="relative bg-slate-900 border-b border-slate-800">
                {/* Cover Banner */}
                <div className="h-64 sm:h-80 w-full bg-slate-800 relative overflow-hidden">
                    {photographer.cover_image ? (
                        <img 
                            src={photographer.cover_image} 
                            alt={photographer.business_name} 
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full bg-gradient-to-tr from-slate-900 via-slate-800 to-emerald-950" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                </div>

                {/* Profile Identity Bar */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative -mt-20 pb-8">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        
                        {/* Avatar & Title Info */}
                        <div className="flex items-end gap-5">
                            <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-3xl bg-slate-800 border-4 border-slate-950 overflow-hidden shadow-2xl shrink-0 relative">
                                {photographer.profile_image ? (
                                    <img src={photographer.profile_image} alt={photographer.business_name} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full bg-emerald-600 text-white font-extrabold flex items-center justify-center text-3xl">
                                        {photographer.business_name.charAt(0)}
                                    </div>
                                )}
                            </div>

                            <div className="mb-1">
                                <div className="flex items-center gap-2 flex-wrap">
                                    <h1 className="text-2xl sm:text-3xl font-black text-white">
                                        {photographer.business_name}
                                    </h1>
                                    {photographer.verification_status === 'approved' && (
                                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold border border-emerald-500/30">
                                            <BadgeCheck className="w-3.5 h-3.5" />
                                            Verified Studio
                                        </span>
                                    )}
                                </div>

                                <p className="text-sm text-slate-300 mt-1 max-w-xl font-medium">
                                    {photographer.tagline || photographer.bio}
                                </p>

                                <div className="flex flex-wrap items-center gap-4 mt-2.5 text-xs text-slate-400">
                                    <span className="flex items-center gap-1 text-slate-300">
                                        <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                                        {photographer.city}, {photographer.state}
                                    </span>
                                    <span>•</span>
                                    <span>{photographer.experience_years}+ Years Experience</span>
                                    <span>•</span>
                                    <StarRating rating={photographer.average_rating} reviewCount={photographer.review_count} />
                                </div>
                            </div>
                        </div>

                        {/* Top Action Buttons */}
                        <div className="flex items-center gap-3 shrink-0">
                            <button
                                onClick={handleToggleFavorite}
                                className={`p-3 rounded-2xl border transition flex items-center gap-2 text-xs font-bold ${
                                    favorited 
                                        ? 'bg-red-500/15 border-red-500/30 text-red-400' 
                                        : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-800'
                                }`}
                                title="Save Photographer"
                            >
                                <Heart className={`w-4 h-4 ${favorited ? 'fill-red-500 text-red-500' : ''}`} />
                                <span className="hidden sm:inline">{favorited ? 'Saved' : 'Save'}</span>
                            </button>

                            <button
                                onClick={handleStartChat}
                                className="px-4 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs transition flex items-center gap-2"
                            >
                                <MessageSquare className="w-4 h-4 text-emerald-400" />
                                <span>Message Studio</span>
                            </button>

                            <button
                                onClick={() => {
                                    setSelectedPackageForModal(photographer.packages?.[0] || null);
                                    setIsBookingModalOpen(true);
                                }}
                                className="px-6 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs transition shadow-lg shadow-emerald-500/25 flex items-center gap-2"
                            >
                                <Calendar className="w-4 h-4" />
                                <span>Request Booking</span>
                            </button>
                        </div>
                    </div>

                    {/* Navigation Tabs */}
                    <div className="flex items-center gap-2 overflow-x-auto border-t border-slate-800/80 pt-6 mt-6 no-scrollbar">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition flex items-center gap-2 ${
                                    activeTab === tab.id
                                        ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                                        : 'bg-slate-800/60 text-slate-400 hover:text-white hover:bg-slate-800'
                                }`}
                            >
                                <span>{tab.label}</span>
                                {tab.count !== undefined && (
                                    <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                                        activeTab === tab.id ? 'bg-slate-950/20 text-slate-950 font-extrabold' : 'bg-slate-700 text-slate-300'
                                    }`}>
                                        {tab.count}
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* TAB CONTENT AREA */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                    
                    {/* LEFT 2 COLS: ACTIVE TAB CONTENT */}
                    <div className="lg:col-span-2 space-y-8">
                        
                        {/* TAB 1: PORTFOLIO */}
                        {activeTab === 'portfolio' && (
                            <div>
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                                    <div>
                                        <h2 className="text-xl font-bold text-white">Portfolio Albums & Works</h2>
                                        <p className="text-xs text-slate-400 mt-0.5">Click any photo to view in high-resolution lightbox.</p>
                                    </div>

                                    {/* Category Filter Pills */}
                                    {photographer.categories && (
                                        <div className="flex flex-wrap gap-1.5">
                                            <button
                                                onClick={() => setSelectedCategoryFilter('all')}
                                                className={`px-3 py-1 text-xs rounded-full font-medium transition ${
                                                    selectedCategoryFilter === 'all'
                                                        ? 'bg-emerald-500 text-slate-950 font-bold'
                                                        : 'bg-slate-800 text-slate-400 hover:text-white'
                                                }`}
                                            >
                                                All Works
                                            </button>
                                            {photographer.categories.map((cat) => (
                                                <button
                                                    key={cat.id}
                                                    onClick={() => setSelectedCategoryFilter(cat.id)}
                                                    className={`px-3 py-1 text-xs rounded-full font-medium transition ${
                                                        String(selectedCategoryFilter) === String(cat.id)
                                                            ? 'bg-emerald-500 text-slate-950 font-bold'
                                                            : 'bg-slate-800 text-slate-400 hover:text-white'
                                                    }`}
                                                >
                                                    {cat.name}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {filteredPortfolios.length > 0 ? (
                                    <div className="space-y-8">
                                        {filteredPortfolios.map((portfolio) => (
                                            <div key={portfolio.id} className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 shadow-lg">
                                                <div className="flex items-center justify-between mb-4">
                                                    <div>
                                                        <h3 className="text-base font-bold text-white">{portfolio.title}</h3>
                                                        {portfolio.description && (
                                                            <p className="text-xs text-slate-400 mt-1">{portfolio.description}</p>
                                                        )}
                                                    </div>
                                                    <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full">
                                                        {portfolio.media?.length || 0} Photos
                                                    </span>
                                                </div>

                                                {/* Masonry / Grid for this Album */}
                                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                                    {portfolio.media?.map((media, idx) => (
                                                        <div 
                                                            key={media.id}
                                                            onClick={() => openLightbox(portfolio.media, idx)}
                                                            className="group relative h-40 sm:h-48 rounded-2xl overflow-hidden bg-slate-800 cursor-pointer shadow-sm hover:shadow-xl transition"
                                                        >
                                                            <img 
                                                                src={media.file_path} 
                                                                alt={media.title || 'Photo'} 
                                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                                loading="lazy"
                                                            />
                                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                                <ImageIcon className="w-6 h-6 text-white" />
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-12 bg-slate-900/40 rounded-3xl border border-slate-800 p-6 text-slate-400 text-xs">
                                        No portfolios found in this category.
                                    </div>
                                )}
                            </div>
                        )}

                        {/* TAB 2: PACKAGES */}
                        {activeTab === 'packages' && (
                            <div className="space-y-6">
                                <div>
                                    <h2 className="text-xl font-bold text-white">Photography Packages</h2>
                                    <p className="text-xs text-slate-400 mt-0.5">Choose a transparent package or request a customized quote.</p>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    {photographer.packages?.map((pkg) => (
                                        <div key={pkg.id} className="bg-slate-900 border border-slate-800 hover:border-emerald-500/50 rounded-3xl p-6 flex flex-col justify-between shadow-xl transition">
                                            <div>
                                                <div className="flex items-center justify-between">
                                                    <h3 className="font-extrabold text-lg text-white">{pkg.name}</h3>
                                                    <span className="text-xl font-black text-emerald-400">₹{Number(pkg.price).toLocaleString('en-IN')}</span>
                                                </div>
                                                <p className="text-xs text-slate-400 mt-1 mb-4">{pkg.description}</p>

                                                <div className="space-y-2 py-3 border-y border-slate-800 text-xs text-slate-300">
                                                    <div className="flex items-center gap-2">
                                                        <Clock className="w-4 h-4 text-emerald-400 shrink-0" />
                                                        <span><strong>{pkg.duration_hours} Hours</strong> Total Shoot Duration</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Users className="w-4 h-4 text-emerald-400 shrink-0" />
                                                        <span><strong>{pkg.photographer_count} Photographer(s)</strong> + {pkg.videographer_count} Videographer(s)</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Camera className="w-4 h-4 text-emerald-400 shrink-0" />
                                                        <span><strong>{pkg.edited_photos_count} Edited Photos</strong> (All RAW included)</span>
                                                    </div>
                                                    {pkg.drone && (
                                                        <div className="flex items-center gap-2">
                                                            <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
                                                            <span>4K Aerial Drone Coverage Included</span>
                                                        </div>
                                                    )}
                                                    {pkg.cinematic_video && (
                                                        <div className="flex items-center gap-2">
                                                            <Video className="w-4 h-4 text-emerald-400 shrink-0" />
                                                            <span>Cinematic 4K Teaser & Music Video</span>
                                                        </div>
                                                    )}
                                                    {pkg.album && (
                                                        <div className="flex items-center gap-2">
                                                            <Award className="w-4 h-4 text-emerald-400 shrink-0" />
                                                            <span>Premium Coffee Table Album ({pkg.album_pages} Pages)</span>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Custom Feature Items */}
                                                {pkg.features && Array.isArray(pkg.features) && (
                                                    <ul className="mt-3 space-y-1.5 text-xs text-slate-400">
                                                        {pkg.features.map((feat, i) => (
                                                            <li key={i} className="flex items-center gap-2">
                                                                <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                                                                <span>{feat}</span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                )}
                                            </div>

                                            <button
                                                onClick={() => handlePackageBook(pkg)}
                                                className="mt-6 w-full py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition shadow-md flex items-center justify-center gap-2"
                                            >
                                                <span>Book This Package</span>
                                                <ChevronRight size={16} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* TAB 3: SERVICES */}
                        {activeTab === 'services' && (
                            <div className="space-y-4">
                                <h2 className="text-xl font-bold text-white mb-2">Individual Services</h2>
                                <div className="space-y-3">
                                    {photographer.services?.map((serv) => (
                                        <div key={serv.id} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 flex items-center justify-between">
                                            <div>
                                                <h3 className="font-bold text-base text-white">{serv.name}</h3>
                                                <p className="text-xs text-slate-400 mt-1 max-w-xl">{serv.description}</p>
                                                {serv.category && (
                                                    <span className="inline-block mt-2 text-[10.5px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                                                        {serv.category.name}
                                                    </span>
                                                )}
                                            </div>
                                            <div className="text-right shrink-0">
                                                <span className="text-xs text-slate-400 block capitalize">{serv.price_type.replace('_', ' ')}</span>
                                                <span className="text-lg font-bold text-emerald-400">₹{Number(serv.price).toLocaleString('en-IN')}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* TAB 4: AVAILABILITY CALENDAR */}
                        {activeTab === 'availability' && (
                            <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6">
                                <h2 className="text-xl font-bold text-white mb-1">Availability Schedule</h2>
                                <p className="text-xs text-slate-400 mb-6">Upcoming booked or blocked dates for this studio.</p>

                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                                    <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 flex items-center gap-3">
                                        <div className="w-3 h-3 rounded-full bg-emerald-400" />
                                        <div className="text-xs">
                                            <div className="font-bold text-white">Available Dates</div>
                                            <div className="text-slate-400">Ready for instant booking</div>
                                        </div>
                                    </div>
                                    <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 flex items-center gap-3">
                                        <div className="w-3 h-3 rounded-full bg-amber-400" />
                                        <div className="text-xs">
                                            <div className="font-bold text-white">Booked Dates</div>
                                            <div className="text-slate-400">Confirmed shoots</div>
                                        </div>
                                    </div>
                                    <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 flex items-center gap-3">
                                        <div className="w-3 h-3 rounded-full bg-red-400" />
                                        <div className="text-xs">
                                            <div className="font-bold text-white">Blocked</div>
                                            <div className="text-slate-400">Unavailable / Personal</div>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <h3 className="text-xs uppercase font-bold text-slate-400 tracking-wider mb-2">Upcoming Reserved Dates</h3>
                                    {photographer.availabilities && photographer.availabilities.length > 0 ? (
                                        photographer.availabilities.map((avail) => (
                                            <div key={avail.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-800/60 border border-slate-800 text-xs">
                                                <div className="flex items-center gap-2.5">
                                                    <Calendar className="w-4 h-4 text-slate-400" />
                                                    <span className="font-bold text-white">{new Date(avail.date).toLocaleDateString('en-IN', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}</span>
                                                </div>
                                                <span className={`px-2.5 py-0.5 rounded-full font-semibold capitalize ${
                                                    avail.status === 'booked' ? 'bg-amber-500/15 text-amber-400' : 'bg-red-500/15 text-red-400'
                                                }`}>
                                                    {avail.status}
                                                </span>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-xs text-slate-400 italic">No dates currently blocked. All dates open for booking!</p>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* TAB 5: ABOUT */}
                        {activeTab === 'about' && (
                            <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 space-y-6">
                                <div>
                                    <h2 className="text-xl font-bold text-white mb-2">About {photographer.business_name}</h2>
                                    <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">
                                        {photographer.bio || 'Professional photography & cinematography studio dedicated to crafting visual masterpieces for weddings and private milestones.'}
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-800 text-xs">
                                    <div>
                                        <span className="font-bold text-slate-400 block mb-1">Primary Base</span>
                                        <span className="text-white font-medium">{photographer.address || photographer.city}, {photographer.state} ({photographer.pincode})</span>
                                    </div>
                                    <div>
                                        <span className="font-bold text-slate-400 block mb-1">Total Bookings Completed</span>
                                        <span className="text-emerald-400 font-extrabold text-sm">{photographer.total_bookings} Events</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* TAB 6: REVIEWS */}
                        {activeTab === 'reviews' && (
                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h2 className="text-xl font-bold text-white">Client Reviews & Ratings</h2>
                                        <p className="text-xs text-slate-400 mt-0.5">Authentic reviews from verified completed bookings.</p>
                                    </div>
                                    <StarRating rating={photographer.average_rating} reviewCount={photographer.review_count} size="lg" />
                                </div>

                                <div className="space-y-4">
                                    {photographer.reviews && photographer.reviews.length > 0 ? (
                                        photographer.reviews.map((rev) => (
                                            <div key={rev.id} className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6">
                                                <div className="flex items-center justify-between mb-3">
                                                    <div>
                                                        <div className="font-bold text-white text-sm">{rev.customer?.name || 'Verified Customer'}</div>
                                                        <div className="text-[11px] text-slate-400">{new Date(rev.created_at).toLocaleDateString()}</div>
                                                    </div>
                                                    <StarRating rating={rev.rating} showCount={false} />
                                                </div>

                                                <p className="text-xs text-slate-300 leading-relaxed mb-3">
                                                    "{rev.review_text}"
                                                </p>

                                                {rev.photographer_reply && (
                                                    <div className="mt-3 p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700/60 text-xs">
                                                        <div className="font-bold text-emerald-400 mb-1 flex items-center gap-1.5">
                                                            <span>Response from {photographer.business_name}</span>
                                                        </div>
                                                        <p className="text-slate-300">{rev.photographer_reply}</p>
                                                    </div>
                                                )}
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center py-12 bg-slate-900/40 rounded-3xl border border-slate-800 text-xs text-slate-400">
                                            No reviews yet for this studio.
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* RIGHT 1 COL: STICKY BOOKING CARD */}
                    <div className="sticky top-28 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6">
                        <div>
                            <span className="text-[11px] uppercase font-bold text-slate-400 tracking-wider block mb-1">Starting Investment</span>
                            <div className="flex items-baseline gap-2">
                                <span className="text-3xl font-black text-white">₹{Number(photographer.starting_price).toLocaleString('en-IN')}</span>
                                <span className="text-xs text-slate-400">/ event</span>
                            </div>
                        </div>

                        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-slate-300 space-y-2">
                            <div className="flex items-center gap-2 font-bold text-emerald-400">
                                <ShieldCheck className="w-4 h-4" />
                                <span>LensCraft Booking Guarantee</span>
                            </div>
                            <p className="text-[11.5px] text-slate-400 leading-relaxed">
                                Pay only 25% advance after studio accepts. Remaining payment after the shoot is done.
                            </p>
                        </div>

                        <button
                            onClick={() => {
                                setSelectedPackageForModal(photographer.packages?.[0] || null);
                                setIsBookingModalOpen(true);
                            }}
                            className="w-full py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-sm transition shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2"
                        >
                            <Calendar className="w-4 h-4" />
                            Request Booking
                        </button>

                        <button
                            onClick={handleStartChat}
                            className="w-full py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs transition flex items-center justify-center gap-2"
                        >
                            <MessageSquare className="w-4 h-4 text-emerald-400" />
                            Direct Chat with Studio
                        </button>
                    </div>

                </div>
            </div>

            {/* LIGHTBOX MODAL */}
            <LightboxModal 
                isOpen={lightboxState.isOpen}
                onClose={() => setLightboxState({ ...lightboxState, isOpen: false })}
                items={lightboxState.items}
                currentIndex={lightboxState.index}
                onNavigate={(idx) => setLightboxState({ ...lightboxState, index: idx })}
            />

            {/* REQUEST BOOKING MODAL */}
            <BookingModal 
                isOpen={isBookingModalOpen}
                onClose={() => setIsBookingModalOpen(false)}
                photographer={photographer}
                initialPackage={selectedPackageForModal}
            />

        </PublicLayout>
    );
}
