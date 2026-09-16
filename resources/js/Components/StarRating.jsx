import React from 'react';
import { Star } from 'lucide-react';

export default function StarRating({ rating = 5, reviewCount = null, size = 'sm', showCount = true }) {
    const numRating = Number(rating) || 0;
    const starSize = size === 'lg' ? 'w-5 h-5' : size === 'md' ? 'w-4 h-4' : 'w-3.5 h-3.5';

    return (
        <div className="flex items-center gap-1.5">
            <div className="flex items-center text-amber-400">
                {[1, 2, 3, 4, 5].map((star) => (
                    <Star 
                        key={star} 
                        className={`${starSize} ${star <= Math.round(numRating) ? 'fill-amber-400 text-amber-400' : 'text-slate-600'}`} 
                    />
                ))}
            </div>
            <span className="font-bold text-xs text-slate-200">
                {numRating.toFixed(1)}
            </span>
            {showCount && reviewCount !== null && (
                <span className="text-slate-400 text-xs">
                    ({reviewCount} {reviewCount === 1 ? 'review' : 'reviews'})
                </span>
            )}
        </div>
    );
}
