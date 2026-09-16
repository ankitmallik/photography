import React, { useState, useEffect } from 'react';
import { useForm, usePage, router } from '@inertiajs/react';
import { Calendar, Clock, MapPin, CheckCircle, X, ShieldAlert, Sparkles, Tag, Users } from 'lucide-react';
import axios from 'axios';

export default function BookingModal({ isOpen, onClose, photographer, initialPackage = null }) {
    const { props } = usePage();
    const { auth } = props;

    const [selectedPackageId, setSelectedPackageId] = useState(initialPackage?.id || (photographer.packages?.[0]?.id || ''));
    const [selectedAddons, setSelectedAddons] = useState([]);
    const [couponCode, setCouponCode] = useState('');
    const [couponDiscount, setCouponDiscount] = useState(0);
    const [couponMsg, setCouponMsg] = useState({ text: '', type: '' });
    const [isCheckingCoupon, setIsCheckingCoupon] = useState(false);

    const availableAddonsList = [
        { name: 'Extra 4K Drone Aerial Pilot', price: 8000 },
        { name: 'Additional Candid Photographer', price: 6000 },
        { name: 'Luxury Velvet Hardcover Album (30 Pages)', price: 7500 },
        { name: 'Same-Day 60s Instagram Reel Edit', price: 4000 },
        { name: 'Raw Photos on High-Speed USB Drive', price: 2500 },
    ];

    const { data, setData, post, processing, errors, reset } = useForm({
        photographer_profile_id: photographer.id,
        package_id: selectedPackageId,
        event_type: 'Wedding Photography',
        event_date: '',
        start_time: '10:00',
        end_time: '20:00',
        event_location: '',
        city: photographer.city || '',
        state: photographer.state || '',
        guest_count: 150,
        travel_charges: 0,
        coupon_code: '',
        special_instructions: '',
        addons: [],
    });

    useEffect(() => {
        if (initialPackage) {
            setSelectedPackageId(initialPackage.id);
            setData('package_id', initialPackage.id);
        }
    }, [initialPackage]);

    const activePackage = photographer.packages?.find(p => String(p.id) === String(selectedPackageId));
    const basePrice = activePackage ? Number(activePackage.price) : Number(photographer.starting_price);
    
    const addonsTotal = selectedAddons.reduce((acc, curr) => acc + curr.price, 0);
    const subtotal = basePrice + addonsTotal + Number(data.travel_charges || 0);
    const grossTotal = Math.max(0, subtotal - couponDiscount);
    const advanceAmount = Math.round(grossTotal * 0.25);
    const remainingAmount = grossTotal - advanceAmount;

    const handleAddonToggle = (addon) => {
        const exists = selectedAddons.some(a => a.name === addon.name);
        let updated;
        if (exists) {
            updated = selectedAddons.filter(a => a.name !== addon.name);
        } else {
            updated = [...selectedAddons, addon];
        }
        setSelectedAddons(updated);
        setData('addons', updated);
    };

    const handleApplyCoupon = async (e) => {
        e.preventDefault();
        if (!couponCode.trim()) return;

        setIsCheckingCoupon(true);
        setCouponMsg({ text: '', type: '' });

        try {
            const res = await axios.post('/api/coupons/validate', {
                code: couponCode,
                amount: subtotal,
            });
            if (res.data.valid) {
                setCouponDiscount(res.data.discount);
                setData('coupon_code', couponCode);
                setCouponMsg({ text: `Coupon applied! Saved ₹${res.data.discount}`, type: 'success' });
            }
        } catch (err) {
            setCouponDiscount(0);
            setCouponMsg({ text: err.response?.data?.message || 'Invalid coupon code', type: 'error' });
        } finally {
            setIsCheckingCoupon(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!auth?.user) {
            router.visit('/login');
            return;
        }

        post('/customer/bookings/request', {
            onSuccess: () => {
                reset();
                onClose();
            },
        });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-200 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-2xl max-h-[92vh] overflow-y-auto shadow-2xl flex flex-col my-auto">
                
                {/* Header */}
                <div className="p-6 border-b border-slate-800 flex items-center justify-between sticky top-0 bg-slate-900/95 backdrop-blur z-10">
                    <div>
                        <h2 className="text-lg font-bold text-white flex items-center gap-2">
                            <span>Request Booking</span>
                            <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-semibold">
                                {photographer.business_name}
                            </span>
                        </h2>
                        <p className="text-xs text-slate-400 mt-0.5">Send a booking request with customized packages & services.</p>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition">
                        <X size={18} />
                    </button>
                </div>

                {/* Form Body */}
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Event Type & Date Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Event Type *</label>
                            <select 
                                value={data.event_type}
                                onChange={(e) => setData('event_type', e.target.value)}
                                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                            >
                                <option value="Wedding Photography">Wedding Photography</option>
                                <option value="Pre-Wedding Shoot">Pre-Wedding Shoot</option>
                                <option value="Birthday & Private Event">Birthday & Private Event</option>
                                <option value="Maternity & Baby Shoot">Maternity & Baby Shoot</option>
                                <option value="Corporate / Brand Event">Corporate / Brand Event</option>
                                <option value="Fashion / Editorial Shoot">Fashion / Editorial Shoot</option>
                                <option value="Drone & Aerial Coverage">Drone & Aerial Coverage</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Event Date *</label>
                            <input 
                                type="date"
                                min={new Date().toISOString().split('T')[0]}
                                value={data.event_date}
                                onChange={(e) => setData('event_date', e.target.value)}
                                required
                                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                            />
                            {errors.event_date && <p className="text-red-400 text-xs mt-1">{errors.event_date}</p>}
                        </div>
                    </div>

                    {/* Time Slot & Guests */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Start Time</label>
                            <input 
                                type="time"
                                value={data.start_time}
                                onChange={(e) => setData('start_time', e.target.value)}
                                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-300 mb-1.5">End Time</label>
                            <input 
                                type="time"
                                value={data.end_time}
                                onChange={(e) => setData('end_time', e.target.value)}
                                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Guest Count (approx)</label>
                            <input 
                                type="number"
                                min="1"
                                value={data.guest_count}
                                onChange={(e) => setData('guest_count', e.target.value)}
                                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white"
                            />
                        </div>
                    </div>

                    {/* Venue Location & City */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="sm:col-span-2">
                            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Venue Address / Location *</label>
                            <input 
                                type="text"
                                placeholder="e.g. Grand Heritage Resort, Main Hall"
                                value={data.event_location}
                                onChange={(e) => setData('event_location', e.target.value)}
                                required
                                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-300 mb-1.5">City *</label>
                            <input 
                                type="text"
                                value={data.city}
                                onChange={(e) => setData('city', e.target.value)}
                                required
                                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white"
                            />
                        </div>
                    </div>

                    {/* Package Selector */}
                    {photographer.packages && photographer.packages.length > 0 && (
                        <div>
                            <label className="block text-xs font-semibold text-slate-300 mb-2">Select Photography Package</label>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {photographer.packages.map((pkg) => (
                                    <div 
                                        key={pkg.id}
                                        onClick={() => {
                                            setSelectedPackageId(pkg.id);
                                            setData('package_id', pkg.id);
                                        }}
                                        className={`p-3.5 rounded-2xl border cursor-pointer transition ${
                                            String(selectedPackageId) === String(pkg.id)
                                                ? 'bg-emerald-500/10 border-emerald-500 shadow-md shadow-emerald-500/10'
                                                : 'bg-slate-800/60 border-slate-700/80 hover:border-slate-600'
                                        }`}
                                    >
                                        <div className="flex items-center justify-between font-bold text-sm text-white">
                                            <span>{pkg.name}</span>
                                            <span className="text-emerald-400">₹{Number(pkg.price).toLocaleString('en-IN')}</span>
                                        </div>
                                        <p className="text-[11.5px] text-slate-400 mt-1 line-clamp-1">{pkg.description}</p>
                                        <div className="flex items-center gap-3 text-[10.5px] text-slate-400 mt-2">
                                            <span>⏱ {pkg.duration_hours} Hours</span>
                                            <span>📷 {pkg.photographer_count} Photographers</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Add-on Services Checklist */}
                    <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-2">Optional Add-ons & Equipment</label>
                        <div className="space-y-2 bg-slate-800/40 p-3.5 rounded-2xl border border-slate-800">
                            {availableAddonsList.map((addon) => {
                                const isChecked = selectedAddons.some(a => a.name === addon.name);
                                return (
                                    <label 
                                        key={addon.name} 
                                        className="flex items-center justify-between text-xs text-slate-300 p-2 rounded-xl hover:bg-slate-800 cursor-pointer transition"
                                    >
                                        <div className="flex items-center gap-2.5">
                                            <input 
                                                type="checkbox"
                                                checked={isChecked}
                                                onChange={() => handleAddonToggle(addon)}
                                                className="w-4 h-4 accent-emerald-500 rounded"
                                            />
                                            <span>{addon.name}</span>
                                        </div>
                                        <span className="font-semibold text-emerald-400">+₹{addon.price.toLocaleString('en-IN')}</span>
                                    </label>
                                );
                            })}
                        </div>
                    </div>

                    {/* Coupon Input */}
                    <div className="pt-2">
                        <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                            <Tag className="w-3.5 h-3.5 text-amber-400" />
                            Have a Promo Code?
                        </label>
                        <div className="flex gap-2">
                            <input 
                                type="text"
                                placeholder="Try 'WELCOME10'"
                                value={couponCode}
                                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                                className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-xs uppercase font-bold text-white focus:border-amber-400 focus:outline-none"
                            />
                            <button
                                type="button"
                                onClick={handleApplyCoupon}
                                disabled={isCheckingCoupon || !couponCode.trim()}
                                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-amber-500 hover:text-slate-950 font-bold text-xs text-slate-200 transition border border-slate-700"
                            >
                                {isCheckingCoupon ? 'Verifying...' : 'Apply'}
                            </button>
                        </div>
                        {couponMsg.text && (
                            <p className={`text-xs mt-1.5 ${couponMsg.type === 'success' ? 'text-emerald-400 font-semibold' : 'text-red-400'}`}>
                                {couponMsg.text}
                            </p>
                        )}
                    </div>

                    {/* Special Instructions */}
                    <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1.5">Special Instructions / Requirements</label>
                        <textarea 
                            rows="2"
                            placeholder="e.g. Specific shots required, drone clearance at venue, traditional ritual highlights..."
                            value={data.special_instructions}
                            onChange={(e) => setData('special_instructions', e.target.value)}
                            className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-emerald-500"
                        />
                    </div>

                    {/* Price Summary Breakdown */}
                    <div className="bg-slate-950/80 rounded-2xl p-4 border border-slate-800 space-y-2 text-xs">
                        <div className="flex justify-between text-slate-400">
                            <span>Package Base Price</span>
                            <span className="font-semibold text-slate-200">₹{basePrice.toLocaleString('en-IN')}</span>
                        </div>
                        {addonsTotal > 0 && (
                            <div className="flex justify-between text-slate-400">
                                <span>Add-ons ({selectedAddons.length})</span>
                                <span className="font-semibold text-slate-200">+₹{addonsTotal.toLocaleString('en-IN')}</span>
                            </div>
                        )}
                        {couponDiscount > 0 && (
                            <div className="flex justify-between text-emerald-400 font-semibold">
                                <span>Coupon Discount</span>
                                <span>-₹{couponDiscount.toLocaleString('en-IN')}</span>
                            </div>
                        )}
                        <hr className="border-slate-800 my-1" />
                        <div className="flex justify-between text-sm font-bold text-white">
                            <span>Total Estimated Amount</span>
                            <span className="text-emerald-400 text-base">₹{grossTotal.toLocaleString('en-IN')}</span>
                        </div>
                        <div className="flex justify-between text-[11px] text-slate-400 pt-1">
                            <span>Payable upon Acceptance (25% Advance)</span>
                            <span className="font-semibold text-slate-300">₹{advanceAmount.toLocaleString('en-IN')}</span>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm transition shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2"
                    >
                        <CheckCircle className="w-4 h-4" />
                        {processing ? 'Submitting Request...' : 'Send Booking Request'}
                    </button>
                </form>
            </div>
        </div>
    );
}
