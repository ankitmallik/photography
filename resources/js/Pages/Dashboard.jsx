import React from 'react';
import AdminLayout from '../Layouts/AdminLayout';

export default function Dashboard({ stats, recent_bookings }) {
    return (
        <AdminLayout title="Dashboard" subtitle="Welcome back — here's what's happening today.">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '30px' }}>
                <div className="card">
                    <div className="card-body">
                        <span className="text-small-muted" style={{ textTransform: 'uppercase', letterSpacing: '1px' }}>Total Flats</span>
                        <div style={{ fontSize: '2.5rem', fontWeight: 'bold', marginTop: '10px' }}>{stats.total_flats}</div>
                        <span className="text-small-muted">{stats.available_flats} available</span>
                    </div>
                </div>
                <div className="card">
                    <div className="card-body">
                        <span className="text-small-muted" style={{ textTransform: 'uppercase', letterSpacing: '1px' }}>Total Leads</span>
                        <div style={{ fontSize: '2.5rem', fontWeight: 'bold', marginTop: '10px' }}>{stats.total_leads}</div>
                    </div>
                </div>
                <div className="card">
                    <div className="card-body">
                        <span className="text-small-muted" style={{ textTransform: 'uppercase', letterSpacing: '1px' }}>Total Bookings</span>
                        <div style={{ fontSize: '2.5rem', fontWeight: 'bold', marginTop: '10px' }}>{stats.total_bookings}</div>
                    </div>
                </div>
                <div className="card">
                    <div className="card-body">
                        <span className="text-small-muted" style={{ textTransform: 'uppercase', letterSpacing: '1px' }}>Total Revenue</span>
                        <div style={{ fontSize: '2.5rem', fontWeight: 'bold', marginTop: '10px', color: 'var(--accent)' }}>₹{stats.revenue.toLocaleString()}</div>
                    </div>
                </div>
            </div>

            <div className="card">
                <div className="card-head">
                    <h2 className="card-title">Recent Bookings</h2>
                </div>
                <div className="card-body p-0">
                    <div className="table-responsive">
                        <table>
                            <thead>
                                <tr>
                                    <th>Lead Name</th>
                                    <th>Flat Details</th>
                                    <th>Amount</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recent_bookings?.map(b => (
                                    <tr key={b.id}>
                                        <td style={{ fontWeight: '500' }}>{b.lead?.name}</td>
                                        <td>{b.flat?.block?.name} - {b.flat?.flat_no}</td>
                                        <td style={{ fontWeight: 'bold' }}>₹{Number(b.booking_amount).toLocaleString()}</td>
                                        <td>
                                            <span className="badge-success">{b.status}</span>
                                        </td>
                                    </tr>
                                ))}
                                {(!recent_bookings || recent_bookings.length === 0) && (
                                    <tr><td colSpan="4" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No recent bookings.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
