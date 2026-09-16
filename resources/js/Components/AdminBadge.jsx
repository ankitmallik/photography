import React from 'react';

export default function AdminBadge({ status }) {
    const statusLower = String(status || '').toLowerCase();

    let style = 'bg-slate-700/50 text-slate-300 border-slate-600';

    if (['approved', 'confirmed', 'completed', 'paid', 'active', 'successful'].includes(statusLower)) {
        style = 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30';
    } else if (['pending', 'in_progress', 'partial', 'processing'].includes(statusLower)) {
        style = 'bg-amber-500/15 text-amber-400 border-amber-500/30';
    } else if (['rejected', 'cancelled', 'failed', 'suspended'].includes(statusLower)) {
        style = 'bg-red-500/15 text-red-400 border-red-500/30';
    } else if (['accepted'].includes(statusLower)) {
        style = 'bg-blue-500/15 text-blue-400 border-blue-500/30';
    }

    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${style} capitalize`}>
            {statusLower.replace('_', ' ')}
        </span>
    );
}
