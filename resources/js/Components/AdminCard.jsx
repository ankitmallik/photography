import React from 'react';

export default function AdminCard({ title, value, subtitle, icon: Icon, trend, color = 'emerald' }) {
    const colorClasses = {
        emerald: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
        amber: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
        blue: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
        purple: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
        red: 'bg-red-500/10 text-red-400 border-red-500/20',
    }[color] || 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';

    return (
        <div className="card p-5 flex items-start justify-between">
            <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{title}</p>
                <h3 className="text-2xl font-extrabold text-white mt-1.5">{value}</h3>
                {subtitle && <p className="text-xs text-slate-400 mt-1">{subtitle}</p>}
                {trend && (
                    <span className="inline-block mt-2 text-[11px] font-semibold text-emerald-400">
                        {trend}
                    </span>
                )}
            </div>
            {Icon && (
                <div className={`p-3 rounded-2xl border ${colorClasses}`}>
                    <Icon className="w-5 h-5" />
                </div>
            )}
        </div>
    );
}
