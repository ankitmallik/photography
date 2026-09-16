import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import PhotographerLayout from '@/Layouts/PhotographerLayout';
import AdminBadge from '@/Components/AdminBadge';
import AdminPagination from '@/Components/AdminPagination';
import { CreditCard, Building, CheckCircle2, ArrowRight } from 'lucide-react';

export default function PhotographerPayouts({ payouts, availableBalance = 0, bankAccount = null }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        amount: '',
        payout_method: 'bank_transfer',
    });

    const { data: bankData, setData: setBankData, post: postBank, processing: bankProcessing } = useForm({
        account_holder_name: bankAccount?.account_holder_name || '',
        account_number: bankAccount?.account_number || '',
        ifsc_code: bankAccount?.ifsc_code || '',
        bank_name: bankAccount?.bank_name || '',
        upi_id: bankAccount?.upi_id || '',
    });

    const handlePayoutSubmit = (e) => {
        e.preventDefault();
        post('/photographer/payouts/request', {
            onSuccess: () => reset(),
        });
    };

    const handleBankSubmit = (e) => {
        e.preventDefault();
        postBank('/photographer/bank-details');
    };

    return (
        <PhotographerLayout title="Payout Requests">
            
            <div className="mb-6">
                <h1 className="text-2xl font-extrabold text-white">Payout Requests & Bank Details</h1>
                <p className="text-xs text-slate-400 mt-0.5">Withdraw available earnings to your verified bank account or UPI ID.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start mb-8">
                
                {/* Request Payout Card */}
                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
                    <h3 className="font-bold text-base text-white mb-2 flex items-center gap-2">
                        <CreditCard size={16} className="text-emerald-400" />
                        Request Withdrawal
                    </h3>
                    <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700/80 mb-4 text-xs">
                        <span className="text-slate-400 block mb-0.5">Available Balance</span>
                        <span className="text-2xl font-black text-emerald-400">₹{Number(availableBalance).toLocaleString('en-IN')}</span>
                    </div>

                    <form onSubmit={handlePayoutSubmit} className="space-y-4 text-xs">
                        <div>
                            <label className="block text-slate-300 font-semibold mb-1">Withdrawal Amount (₹) *</label>
                            <input 
                                type="number"
                                min="500"
                                max={availableBalance}
                                placeholder="Min ₹500"
                                value={data.amount}
                                onChange={(e) => setData('amount', e.target.value)}
                                required
                                className="form-control"
                            />
                            {errors.amount && <div className="text-red-400 text-xs mt-1">{errors.amount}</div>}
                        </div>

                        <div>
                            <label className="block text-slate-300 font-semibold mb-1">Payout Method</label>
                            <select 
                                value={data.payout_method}
                                onChange={(e) => setData('payout_method', e.target.value)}
                                className="form-control"
                            >
                                <option value="bank_transfer">Direct Bank NEFT / IMPS</option>
                                <option value="upi">Instant UPI Transfer</option>
                            </select>
                        </div>

                        <button 
                            type="submit" 
                            disabled={processing || availableBalance < 500}
                            className="w-full btn-primary mt-2"
                        >
                            {processing ? 'Submitting...' : 'Submit Payout Request'}
                        </button>
                    </form>
                </div>

                {/* Bank / UPI Account Details Card */}
                <div className="lg:col-span-2 bg-slate-900/60 border border-slate-800 rounded-3xl p-6 shadow-xl">
                    <h3 className="font-bold text-base text-white mb-2 flex items-center gap-2">
                        <Building size={16} className="text-teal-400" />
                        Payout Destination Account
                    </h3>
                    <p className="text-xs text-slate-400 mb-4">Ensure your IFSC and account details are accurate for fast processing.</p>

                    <form onSubmit={handleBankSubmit} className="space-y-4 text-xs">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                                <label className="block text-slate-300 font-semibold mb-1">Account Holder Name *</label>
                                <input 
                                    type="text"
                                    placeholder="Name in Bank"
                                    value={bankData.account_holder_name}
                                    onChange={(e) => setBankData('account_holder_name', e.target.value)}
                                    required
                                    className="form-control"
                                />
                            </div>
                            <div>
                                <label className="block text-slate-300 font-semibold mb-1">Bank Name *</label>
                                <input 
                                    type="text"
                                    placeholder="e.g. HDFC Bank, ICICI Bank"
                                    value={bankData.bank_name}
                                    onChange={(e) => setBankData('bank_name', e.target.value)}
                                    required
                                    className="form-control"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                                <label className="block text-slate-300 font-semibold mb-1">Account Number *</label>
                                <input 
                                    type="text"
                                    placeholder="50100..."
                                    value={bankData.account_number}
                                    onChange={(e) => setBankData('account_number', e.target.value)}
                                    required
                                    className="form-control"
                                />
                            </div>
                            <div>
                                <label className="block text-slate-300 font-semibold mb-1">IFSC Code *</label>
                                <input 
                                    type="text"
                                    placeholder="HDFC0001234"
                                    value={bankData.ifsc_code}
                                    onChange={(e) => setBankData('ifsc_code', e.target.value.toUpperCase())}
                                    required
                                    className="form-control uppercase"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-slate-300 font-semibold mb-1">UPI ID (Optional)</label>
                            <input 
                                type="text"
                                placeholder="name@upi"
                                value={bankData.upi_id}
                                onChange={(e) => setBankData('upi_id', e.target.value)}
                                className="form-control"
                            />
                        </div>

                        <button 
                            type="submit" 
                            disabled={bankProcessing}
                            className="btn-secondary"
                        >
                            {bankProcessing ? 'Saving...' : 'Update Bank Information'}
                        </button>
                    </form>
                </div>

            </div>

            {/* Payouts History Table */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 shadow-xl">
                <h3 className="font-bold text-base text-white mb-4">Payout Request History</h3>

                {payouts.data && payouts.data.length > 0 ? (
                    <div className="table-responsive">
                        <table>
                            <thead>
                                <tr>
                                    <th>Amount</th>
                                    <th>Method</th>
                                    <th>Status</th>
                                    <th>Reference ID</th>
                                    <th>Date Requested</th>
                                </tr>
                            </thead>
                            <tbody>
                                {payouts.data.map((p) => (
                                    <tr key={p.id}>
                                        <td className="font-black text-emerald-400 text-sm">
                                            ₹{Number(p.amount).toLocaleString('en-IN')}
                                        </td>
                                        <td className="text-slate-300 capitalize text-xs">
                                            {p.payout_method.replace('_', ' ')}
                                        </td>
                                        <td>
                                            <AdminBadge status={p.status} />
                                        </td>
                                        <td className="text-slate-400 font-mono text-xs">
                                            {p.transaction_reference || 'Pending Approval'}
                                        </td>
                                        <td className="text-slate-400 text-xs">
                                            {new Date(p.requested_at).toLocaleDateString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        <AdminPagination links={payouts.links} />
                    </div>
                ) : (
                    <p className="text-center py-10 text-slate-400 text-xs italic">
                        No payout requests made yet.
                    </p>
                )}
            </div>

        </PhotographerLayout>
    );
}
