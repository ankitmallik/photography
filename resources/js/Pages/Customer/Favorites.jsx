import React from 'react';
import { Head, Link } from '@inertiajs/react';
import CustomerLayout from '@/Layouts/CustomerLayout';
import PhotographerCard from '@/Components/PhotographerCard';
import AdminPagination from '@/Components/AdminPagination';
import { Heart, Search } from 'lucide-react';

export default function CustomerFavorites({ favorites }) {
    return (
        <CustomerLayout title="Saved Photographers">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-extrabold text-white flex items-center gap-2.5">
                        <Heart className="w-6 h-6 text-red-500 fill-red-500" />
                        Saved Photographers
                    </h1>
                    <p className="text-xs text-slate-400 mt-1">Quick access to your bookmarked studios and favorite artists.</p>
                </div>

                <Link href="/photographers" className="btn-primary btn-sm flex items-center gap-1.5 self-start">
                    <Search size={14} /> Find More Photographers
                </Link>
            </div>

            {favorites.data && favorites.data.length > 0 ? (
                <div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {favorites.data.map((fav) => (
                            <PhotographerCard 
                                key={fav.id} 
                                photographer={{ ...fav.photographer, is_favorited: true }} 
                            />
                        ))}
                    </div>

                    <AdminPagination links={favorites.links} />
                </div>
            ) : (
                <div className="text-center py-16 bg-slate-900/40 rounded-3xl border border-slate-800 p-8">
                    <Heart className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                    <h3 className="text-base font-bold text-white">No Saved Photographers</h3>
                    <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1 mb-6">
                        Tap the heart icon on any photographer's card to save them here for quick comparison.
                    </p>
                    <Link href="/photographers" className="btn-primary">
                        Browse Photographers
                    </Link>
                </div>
            )}

        </CustomerLayout>
    );
}
