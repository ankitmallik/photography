import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { 
    Camera, 
    CheckCircle, 
    ArrowRight, 
    ArrowLeft, 
    User, 
    Mail, 
    Phone, 
    Lock, 
    Building, 
    MapPin, 
    Sparkles, 
    CreditCard, 
    ShieldCheck 
} from 'lucide-react';

export default function RegisterPhotographer({ categories = [] }) {
    const [currentStep, setCurrentStep] = useState(1);

    const { data, setData, post, processing, errors } = useForm({
        // Step 1: Basic
        name: '',
        email: '',
        phone: '',
        password: '',
        password_confirmation: '',
        // Step 2: Business Profile
        business_name: '',
        display_name: '',
        tagline: '',
        bio: '',
        experience_years: 3,
        profile_image: '',
        cover_image: '',
        // Step 3: Location
        address: '',
        city: '',
        state: '',
        pincode: '',
        // Step 4: Categories
        category_ids: [],
        // Step 5: Pricing
        starting_price: 25000,
        // Step 6: Bank/Payout Details
        account_holder_name: '',
        account_number: '',
        ifsc_code: '',
        bank_name: '',
        upi_id: '',
    });

    const handleCategoryToggle = (id) => {
        if (data.category_ids.includes(id)) {
            setData('category_ids', data.category_ids.filter(cId => cId !== id));
        } else {
            setData('category_ids', [...data.category_ids, id]);
        }
    };

    const nextStep = () => {
        setCurrentStep(prev => Math.min(prev + 1, 6));
    };

    const prevStep = () => {
        setCurrentStep(prev => Math.max(prev - 1, 1));
    };

    const submit = (e) => {
        e.preventDefault();
        post('/register/photographer');
    };

    const steps = [
        { num: 1, title: 'Account' },
        { num: 2, title: 'Studio' },
        { num: 3, title: 'Location' },
        { num: 4, title: 'Expertise' },
        { num: 5, title: 'Pricing' },
        { num: 6, title: 'Payout' },
    ];

    const inputClasses = "w-full bg-slate-800/90 border border-slate-700/80 rounded-2xl px-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition";

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden font-sans">
            <Head title="Photographer Studio Onboarding — LensCraft" />

            {/* Ambient Background Glow */}
            <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-gradient-to-tr from-emerald-500/15 via-teal-500/10 to-transparent blur-3xl pointer-events-none -z-10" />

            {/* Brand Header */}
            <Link href="/" className="flex items-center gap-3 mb-8 group">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-emerald-500/25 group-hover:scale-105 transition-transform">
                    <Camera className="w-6 h-6" />
                </div>
                <div className="text-2xl font-black tracking-tight text-white">
                    Lens<span className="text-emerald-400">Craft</span> Studio
                </div>
            </Link>

            <div className="w-full max-w-2xl bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 sm:p-10 shadow-2xl shadow-black/80">
                
                {/* Step Progress Bar */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-2">
                        {steps.map((s) => (
                            <div key={s.num} className="flex flex-col items-center flex-1">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition ${
                                    currentStep === s.num 
                                        ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/30 ring-4 ring-emerald-500/20' 
                                        : currentStep > s.num
                                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                                        : 'bg-slate-800 text-slate-500'
                                }`}>
                                    {currentStep > s.num ? <CheckCircle size={14} /> : s.num}
                                </div>
                                <span className={`text-[10px] mt-1.5 font-medium hidden sm:block ${currentStep >= s.num ? 'text-slate-200 font-semibold' : 'text-slate-500'}`}>
                                    {s.title}
                                </span>
                            </div>
                        ))}
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-1.5 mt-2 overflow-hidden">
                        <div 
                            className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-300"
                            style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
                        />
                    </div>
                </div>

                <form onSubmit={submit}>
                    {/* STEP 1: Basic Info */}
                    {currentStep === 1 && (
                        <div className="space-y-4 text-xs">
                            <div>
                                <h2 className="text-lg font-bold text-white mb-0.5">Step 1: Account Credentials</h2>
                                <p className="text-slate-400">Create your login credentials for managing your studio.</p>
                            </div>

                            <div>
                                <label className="block font-semibold text-slate-300 mb-1.5">Your Full Name *</label>
                                <div className="relative flex items-center">
                                    <User className="absolute left-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
                                    <input 
                                        type="text"
                                        placeholder="e.g. Arjun Malhotra"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        required
                                        className={`${inputClasses} pl-10`}
                                    />
                                </div>
                                {errors.name && <div className="text-red-400 text-[11px] mt-1">{errors.name}</div>}
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                    <label className="block font-semibold text-slate-300 mb-1.5">Email Address *</label>
                                    <div className="relative flex items-center">
                                        <Mail className="absolute left-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
                                        <input 
                                            type="email"
                                            placeholder="arjun@example.com"
                                            value={data.email}
                                            onChange={(e) => setData('email', e.target.value)}
                                            required
                                            className={`${inputClasses} pl-10`}
                                        />
                                    </div>
                                    {errors.email && <div className="text-red-400 text-[11px] mt-1">{errors.email}</div>}
                                </div>

                                <div>
                                    <label className="block font-semibold text-slate-300 mb-1.5">Phone Number *</label>
                                    <div className="relative flex items-center">
                                        <Phone className="absolute left-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
                                        <input 
                                            type="text"
                                            placeholder="+91 98765 43210"
                                            value={data.phone}
                                            onChange={(e) => setData('phone', e.target.value)}
                                            required
                                            className={`${inputClasses} pl-10`}
                                        />
                                    </div>
                                    {errors.phone && <div className="text-red-400 text-[11px] mt-1">{errors.phone}</div>}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                    <label className="block font-semibold text-slate-300 mb-1.5">Password *</label>
                                    <div className="relative flex items-center">
                                        <Lock className="absolute left-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
                                        <input 
                                            type="password"
                                            placeholder="Min 6 characters"
                                            value={data.password}
                                            onChange={(e) => setData('password', e.target.value)}
                                            required
                                            className={`${inputClasses} pl-10`}
                                        />
                                    </div>
                                    {errors.password && <div className="text-red-400 text-[11px] mt-1">{errors.password}</div>}
                                </div>
                                <div>
                                    <label className="block font-semibold text-slate-300 mb-1.5">Confirm Password *</label>
                                    <div className="relative flex items-center">
                                        <Lock className="absolute left-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
                                        <input 
                                            type="password"
                                            placeholder="Confirm password"
                                            value={data.password_confirmation}
                                            onChange={(e) => setData('password_confirmation', e.target.value)}
                                            required
                                            className={`${inputClasses} pl-10`}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* STEP 2: Business Profile */}
                    {currentStep === 2 && (
                        <div className="space-y-4 text-xs">
                            <div>
                                <h2 className="text-lg font-bold text-white mb-0.5">Step 2: Studio Profile</h2>
                                <p className="text-slate-400">Tell customers about your photography brand & experience.</p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                    <label className="block font-semibold text-slate-300 mb-1.5">Studio / Business Name *</label>
                                    <div className="relative flex items-center">
                                        <Building className="absolute left-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
                                        <input 
                                            type="text"
                                            placeholder="e.g. Royal Heritage Frames"
                                            value={data.business_name}
                                            onChange={(e) => setData('business_name', e.target.value)}
                                            required
                                            className={`${inputClasses} pl-10`}
                                        />
                                    </div>
                                    {errors.business_name && <div className="text-red-400 text-[11px] mt-1">{errors.business_name}</div>}
                                </div>

                                <div>
                                    <label className="block font-semibold text-slate-300 mb-1.5">Years of Professional Experience *</label>
                                    <input 
                                        type="number"
                                        min="0"
                                        className={inputClasses}
                                        value={data.experience_years}
                                        onChange={(e) => setData('experience_years', e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block font-semibold text-slate-300 mb-1.5">Tagline / Headline</label>
                                <input 
                                    type="text"
                                    placeholder="e.g. Award-winning Luxury Wedding Cinematography"
                                    className={inputClasses}
                                    value={data.tagline}
                                    onChange={(e) => setData('tagline', e.target.value)}
                                />
                            </div>

                            <div>
                                <label className="block font-semibold text-slate-300 mb-1.5">Studio Bio & About</label>
                                <textarea 
                                    rows="3"
                                    placeholder="Describe your style, storytelling approach, team size, equipment, and achievements..."
                                    className={inputClasses}
                                    value={data.bio}
                                    onChange={(e) => setData('bio', e.target.value)}
                                />
                            </div>
                        </div>
                    )}

                    {/* STEP 3: Location */}
                    {currentStep === 3 && (
                        <div className="space-y-4 text-xs">
                            <div>
                                <h2 className="text-lg font-bold text-white mb-0.5">Step 3: Studio Location</h2>
                                <p className="text-slate-400">Set your primary operational base for location-based search.</p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                    <label className="block font-semibold text-slate-300 mb-1.5">Primary City *</label>
                                    <div className="relative flex items-center">
                                        <MapPin className="absolute left-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
                                        <input 
                                            type="text"
                                            placeholder="e.g. Delhi, Mumbai, Jaipur, Purnea"
                                            value={data.city}
                                            onChange={(e) => setData('city', e.target.value)}
                                            required
                                            className={`${inputClasses} pl-10`}
                                        />
                                    </div>
                                    {errors.city && <div className="text-red-400 text-[11px] mt-1">{errors.city}</div>}
                                </div>

                                <div>
                                    <label className="block font-semibold text-slate-300 mb-1.5">State *</label>
                                    <input 
                                        type="text"
                                        placeholder="e.g. Delhi NCR, Maharashtra, Rajasthan"
                                        className={inputClasses}
                                        value={data.state}
                                        onChange={(e) => setData('state', e.target.value)}
                                        required
                                    />
                                    {errors.state && <div className="text-red-400 text-[11px] mt-1">{errors.state}</div>}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                    <label className="block font-semibold text-slate-300 mb-1.5">Studio Street Address</label>
                                    <input 
                                        type="text"
                                        placeholder="Main Road, Sector / Area"
                                        className={inputClasses}
                                        value={data.address}
                                        onChange={(e) => setData('address', e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="block font-semibold text-slate-300 mb-1.5">Pincode</label>
                                    <input 
                                        type="text"
                                        placeholder="110001"
                                        className={inputClasses}
                                        value={data.pincode}
                                        onChange={(e) => setData('pincode', e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* STEP 4: Categories */}
                    {currentStep === 4 && (
                        <div className="space-y-4 text-xs">
                            <div>
                                <h2 className="text-lg font-bold text-white mb-0.5">Step 4: Speciality Categories</h2>
                                <p className="text-slate-400">Select all photography genres you specialize in (Select at least 1).</p>
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                                {categories.map((cat) => {
                                    const selected = data.category_ids.includes(cat.id);
                                    return (
                                        <div 
                                            key={cat.id}
                                            onClick={() => handleCategoryToggle(cat.id)}
                                            className={`p-3 rounded-2xl border font-semibold cursor-pointer transition flex items-center justify-between ${
                                                selected 
                                                    ? 'bg-emerald-500/15 border-emerald-500 text-emerald-300 shadow-md shadow-emerald-500/10' 
                                                    : 'bg-slate-800/60 border-slate-700/80 text-slate-300 hover:border-slate-600'
                                            }`}
                                        >
                                            <span>{cat.name}</span>
                                            {selected && <CheckCircle size={14} className="text-emerald-400 shrink-0" />}
                                        </div>
                                    );
                                })}
                            </div>
                            {errors.category_ids && <div className="text-red-400 text-[11px] mt-1">{errors.category_ids}</div>}
                        </div>
                    )}

                    {/* STEP 5: Pricing */}
                    {currentStep === 5 && (
                        <div className="space-y-4 text-xs">
                            <div>
                                <h2 className="text-lg font-bold text-white mb-0.5">Step 5: Base Pricing</h2>
                                <p className="text-slate-400">Set your starting package price shown on search cards.</p>
                            </div>

                            <div>
                                <label className="block font-semibold text-slate-300 mb-1.5">Starting Price (₹ INR) *</label>
                                <div className="relative flex items-center">
                                    <span className="absolute left-3.5 font-bold text-slate-400">₹</span>
                                    <input 
                                        type="number"
                                        min="1000"
                                        step="500"
                                        placeholder="25000"
                                        className={`${inputClasses} pl-8`}
                                        value={data.starting_price}
                                        onChange={(e) => setData('starting_price', e.target.value)}
                                        required
                                    />
                                </div>
                                <p className="text-[11px] text-slate-400 mt-2 leading-relaxed">
                                    You will be able to add detailed customized packages (Silver, Gold, Platinum) with hours and deliverables after login.
                                </p>
                            </div>
                        </div>
                    )}

                    {/* STEP 6: Payout & Verification Submission */}
                    {currentStep === 6 && (
                        <div className="space-y-4 text-xs">
                            <div>
                                <h2 className="text-lg font-bold text-white mb-0.5">Step 6: Payout & Verification</h2>
                                <p className="text-slate-400">Where should LensCraft deposit your booking payments & earnings?</p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                    <label className="block font-semibold text-slate-300 mb-1.5">Account Holder Name</label>
                                    <input 
                                        type="text"
                                        placeholder="Full Name as in Bank"
                                        className={inputClasses}
                                        value={data.account_holder_name}
                                        onChange={(e) => setData('account_holder_name', e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="block font-semibold text-slate-300 mb-1.5">Bank Name</label>
                                    <input 
                                        type="text"
                                        placeholder="e.g. HDFC Bank, ICICI Bank"
                                        className={inputClasses}
                                        value={data.bank_name}
                                        onChange={(e) => setData('bank_name', e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                    <label className="block font-semibold text-slate-300 mb-1.5">Bank Account Number</label>
                                    <input 
                                        type="text"
                                        placeholder="50100..."
                                        className={inputClasses}
                                        value={data.account_number}
                                        onChange={(e) => setData('account_number', e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="block font-semibold text-slate-300 mb-1.5">IFSC Code</label>
                                    <input 
                                        type="text"
                                        placeholder="HDFC0001234"
                                        className={`${inputClasses} uppercase`}
                                        value={data.ifsc_code}
                                        onChange={(e) => setData('ifsc_code', e.target.value.toUpperCase())}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block font-semibold text-slate-300 mb-1.5">UPI ID (Optional)</label>
                                <input 
                                    type="text"
                                    placeholder="username@upi"
                                    className={inputClasses}
                                    value={data.upi_id}
                                    onChange={(e) => setData('upi_id', e.target.value)}
                                />
                            </div>

                            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-slate-300 flex items-start gap-3 mt-2">
                                <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                                <div>
                                    <span className="font-bold text-white">Admin Verification Guarantee</span>
                                    <p className="mt-0.5 text-slate-400 leading-relaxed">
                                        Upon submission, your studio details will be sent to the LensCraft moderation team. Once approved, you will be publicly featured and can receive client bookings directly!
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Navigation Buttons */}
                    <div className="flex items-center justify-between pt-6 mt-6 border-t border-slate-800">
                        {currentStep > 1 ? (
                            <button 
                                type="button" 
                                onClick={prevStep}
                                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition flex items-center gap-1.5"
                            >
                                <ArrowLeft size={14} />
                                Back
                            </button>
                        ) : (
                            <Link href="/login" className="text-xs text-slate-400 hover:text-white transition font-medium">
                                Back to Login
                            </Link>
                        )}

                        {currentStep < 6 ? (
                            <button 
                                type="button" 
                                onClick={nextStep}
                                className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs transition shadow-lg shadow-emerald-500/20 flex items-center gap-1.5 ml-auto"
                            >
                                <span>Next Step</span>
                                <ArrowRight size={14} />
                            </button>
                        ) : (
                            <button 
                                type="submit" 
                                disabled={processing}
                                className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs transition shadow-lg shadow-emerald-500/25 flex items-center gap-1.5 ml-auto disabled:opacity-50"
                            >
                                <CheckCircle size={15} />
                                <span>{processing ? 'Submitting Studio...' : 'Submit for Verification'}</span>
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
}
