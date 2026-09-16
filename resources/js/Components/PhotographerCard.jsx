import React, { useState } from 'react';
import { Link, usePage, router } from '@inertiajs/react';
import { Heart, MapPin, BadgeCheck, Camera, Sparkles, Star } from 'lucide-react';
import StarRating from './StarRating';

export default function PhotographerCard({ photographer }) {
    const { props } = usePage();
    const { auth } = props;
    const [isFavorited, setIsFavorited] = useState(photographer.is_favorited || false);
    const [isHovered, setIsHovered] = useState(false);

    const handleFavorite = (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (!auth?.user) {
            router.visit('/login');
            return;
        }

        router.post('/customer/favorites/toggle', {
            photographer_profile_id: photographer.id,
        }, {
            preserveScroll: true,
            onSuccess: () => setIsFavorited(!isFavorited),
        });
    };

    return (
        <div 
            className="group relative bg-slate-900/80 rounded-2xl border border-slate-800/80 hover:border-emerald-500/40 shadow-lg shadow-black/40 overflow-hidden transition-all duration-300 hover:-translate-y-1.5 flex flex-col"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Top Cover Media */}
            <div className="relative h-48 w-full bg-slate-800 overflow-hidden">
                {photographer.cover_image ? (
                    <img 
                        src={photographer.cover_image} 
                        alt={photographer.business_name} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                        loading="lazy"
                    />
                ) : (
                    <div className="w-full h-full bg-gradient-to-tr from-slate-800 to-slate-700 flex items-center justify-center">
                        <Camera className="w-8 h-8 text-slate-600" />
                    </div>
                )}
                
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-black/40" />

                {/* Featured Badge */}
                {photographer.is_featured && (
                    <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10.5px] font-bold bg-amber-400 text-slate-950 flex items-center gap-1 shadow-md">
                        <Sparkles className="w-3 h-3 fill-slate-950" />
                        Featured
                    </span>
                )}

                {/* Favorite Button */}
                <button
                    onClick={handleFavorite}
                    className="absolute top-3 right-3 w-8 h-8 rounded-full bg-slate-950/60 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:bg-slate-950 transition group/btn"
                    title={isFavorited ? "Remove from favorites" : "Save photographer"}
                >
                    <Heart className={`w-4 h-4 transition-colors ${isFavorited ? 'fill-red-500 text-red-500' : 'text-slate-300 group-hover/btn:text-red-400'}`} />
                </button>

                {/* Avatar Badge */}
                <div className="absolute -bottom-5 left-4">
                    <div className="w-14 h-14 rounded-2xl border-2 border-slate-900 bg-slate-800 overflow-hidden shadow-xl">
                        {photographer.profile_image ? (
                            <img src={photographer.profile_image} alt={photographer.business_name} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full bg-emerald-600 text-white font-extrabold flex items-center justify-center text-lg">
                                {photographer.business_name.charAt(0)}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Content Body */}
            <div className="p-5 pt-7 flex-1 flex flex-col justify-between">
                <div>
                    {/* Location & Experience */}
                    <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
                        <span className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                            {photographer.city || 'India'}
                        </span>
                        <span className="text-[11px] font-medium bg-slate-800 px-2 py-0.5 rounded-md">
                            {photographer.experience_years}+ Yrs Exp
                        </span>
                    </div>

                    {/* Business Title */}
                    <Link href={`/photographers/${photographer.slug}`} className="block group-hover:text-emerald-400 transition-colors">
                        <h3 className="font-bold text-base text-white line-clamp-1 flex items-center gap-1.5">
                            <span>{photographer.business_name}</span>
                            {photographer.verification_status === 'approved' && (
                                <BadgeCheck className="w-4 h-4 text-emerald-400 shrink-0" title="Verified Photographer" />
                            )}
                        </h3>
                    </Link>

                    {/* Tagline */}
                    <p className="text-xs text-slate-400 line-clamp-2 mt-1 min-h-[32px] leading-relaxed">
                        {photographer.tagline || photographer.bio || 'Professional Photography & Cinematography Services.'}
                    </p>

                    {/* Categories Badges */}
                    {photographer.categories && photographer.categories.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-3">
                            {photographer.categories.slice(0, 3).map((cat) => (
                                <span key={cat.id} className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-800/80 text-slate-300 border border-slate-700/50">
                                    {cat.name}
                                </span>
                            ))}
                            {photographer.categories.length > 3 && (
                                <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-slate-800 text-slate-400">
                                    +{photographer.categories.length - 3}
                                </span>
                            )}
                        </div>
                    )}
                </div>

                {/* Footer / Price & Actions */}
                <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center justify-between">
                    <div>
                        <div className="text-[10.5px] uppercase font-bold tracking-wider text-slate-400">Starting from</div>
                        <div className="text-base font-extrabold text-emerald-400">
                            ₹{Number(photographer.starting_price).toLocaleString('en-IN')}
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <Link 
                            href={`/photographers/${photographer.slug}`}
                            className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-emerald-500 hover:text-slate-950 font-bold text-xs text-slate-200 transition shadow-sm"
                        >
                            View Profile
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
