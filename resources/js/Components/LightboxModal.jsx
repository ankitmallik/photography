import React, { useEffect } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

export default function LightboxModal({ isOpen, onClose, items = [], currentIndex = 0, onNavigate }) {
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (!isOpen) return;
            if (e.key === 'Escape') onClose();
            if (e.key === 'ArrowRight' && currentIndex < items.length - 1) onNavigate(currentIndex + 1);
            if (e.key === 'ArrowLeft' && currentIndex > 0) onNavigate(currentIndex - 1);
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, currentIndex, items]);

    if (!isOpen || items.length === 0) return null;

    const currentItem = items[currentIndex];

    return (
        <div className="fixed inset-0 z-250 bg-black/95 backdrop-blur-md flex items-center justify-center p-4">
            {/* Close Button */}
            <button 
                onClick={onClose} 
                className="absolute top-5 right-5 z-20 w-10 h-10 rounded-full bg-slate-900/80 hover:bg-slate-800 text-white flex items-center justify-center transition border border-white/10"
            >
                <X size={20} />
            </button>

            {/* Prev Button */}
            {currentIndex > 0 && (
                <button 
                    onClick={() => onNavigate(currentIndex - 1)}
                    className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-slate-900/80 hover:bg-emerald-500 hover:text-slate-950 text-white flex items-center justify-center transition border border-white/10"
                >
                    <ChevronLeft size={24} />
                </button>
            )}

            {/* Next Button */}
            {currentIndex < items.length - 1 && (
                <button 
                    onClick={() => onNavigate(currentIndex + 1)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-slate-900/80 hover:bg-emerald-500 hover:text-slate-950 text-white flex items-center justify-center transition border border-white/10"
                >
                    <ChevronRight size={24} />
                </button>
            )}

            {/* Media Container */}
            <div className="max-w-5xl max-h-[85vh] flex flex-col items-center justify-center relative">
                <img 
                    src={currentItem.file_path || currentItem.url} 
                    alt={currentItem.title || 'Portfolio Item'} 
                    className="max-h-[80vh] max-w-full object-contain rounded-xl shadow-2xl"
                />
                
                {/* Caption / Counter */}
                <div className="mt-3 text-center text-xs text-slate-300">
                    <span className="font-semibold text-white">{currentItem.title || `Photo ${currentIndex + 1}`}</span>
                    <span className="text-slate-500 mx-2">•</span>
                    <span>{currentIndex + 1} of {items.length}</span>
                </div>
            </div>
        </div>
    );
}
