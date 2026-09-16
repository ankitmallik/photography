import React from 'react';
import { Link } from '@inertiajs/react';

export default function AdminPagination({ links = [] }) {
    if (links.length <= 3) return null;

    return (
        <div className="flex items-center justify-between border-t border-slate-800/80 px-4 py-3 sm:px-6 mt-4">
            <div className="flex flex-1 justify-between sm:hidden">
                {links[0]?.url ? (
                    <Link href={links[0].url} className="btn-secondary btn-sm">Previous</Link>
                ) : <span />}
                {links[links.length - 1]?.url ? (
                    <Link href={links[links.length - 1].url} className="btn-secondary btn-sm">Next</Link>
                ) : <span />}
            </div>

            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-end">
                <nav className="inline-flex -space-x-px rounded-xl shadow-sm gap-1">
                    {links.map((link, idx) => {
                        if (!link.url) {
                            return (
                                <span
                                    key={idx}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                    className="px-3 py-1.5 text-xs font-semibold text-slate-500 rounded-lg cursor-not-allowed opacity-50"
                                />
                            );
                        }
                        return (
                            <Link
                                key={idx}
                                href={link.url}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
                                    link.active
                                        ? 'bg-emerald-500 text-slate-950 font-bold'
                                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                                }`}
                            />
                        );
                    })}
                </nav>
            </div>
        </div>
    );
}
