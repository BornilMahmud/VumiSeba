import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import {
  Lock,
  Mail,
  ArrowRight,
  UserCheck,
  Shield,
  Building2,
  Scale,
  User,
  FileText,
  AlertCircle,
  Stamp,
  CheckCircle2
} from 'lucide-react';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const [selectedPersona, setSelectedPersona] = useState<string | null>(null);
  const [autoFilledNotice, setAutoFilledNotice] = useState<string | null>(null);
  const [highlightInputs, setHighlightInputs] = useState(false);
  const [activeCitizenType, setActiveCitizenType] = useState<'seller' | 'buyer'>('seller');
  const [showExtraPersonas, setShowExtraPersonas] = useState(false);

  const { login, loginWithGoogle, switchDemoPersona, user, isFirebaseActive } = useAuth();
  const { language } = useLanguage();
  const isBn = language === 'bn';
  const navigate = useNavigate();
  const location = useLocation();

  // Detect which login route was accessed
  const isOfficeLogin = location.pathname.includes('/office');
  const isAdminLogin = location.pathname.includes('/admin');
  const isCitizenLogin = location.pathname.includes('/citizen') || (!isOfficeLogin && !isAdminLogin);

  // Ensure the page always starts scrolled at the very top
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [location.pathname]);

  // Role-based routing after authentication
  useEffect(() => {
    if (user) {
      const role = (user.role || '').toLowerCase();
      if (role === 'citizen') {
        if (isOfficeLogin || isAdminLogin) {
          setError(
            isBn
              ? 'আপনার অ্যাকাউন্টে সরকারি কর্মকর্তা বা প্রশাসক রোল বরাদ্দ নেই। সাধারণ নাগরিক প্যানেলে নির্দেশিত করা হচ্ছে...'
              : 'Your account does not have officer or administrator roles. Redirecting to citizen panel...'
          );
          setTimeout(() => navigate('/citizen/dashboard'), 1500);
        } else {
          navigate('/citizen/dashboard');
        }
      } else if (role === 'union_officer' || role === 'union_land_officer') {
        navigate('/office/union/dashboard');
      } else if (role === 'ac_land' || role === 'ac_land_officer') {
        navigate('/office/ac-land/dashboard');
      } else if (role === 'sub_registrar' || role === 'sub_registry_officer') {
        navigate('/office/registry/dashboard');
      } else if (role === 'central_admin' || role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/citizen/dashboard');
      }
    }
  }, [user, navigate, isOfficeLogin, isAdminLogin, isBn]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const res = await login({ email, password });
    if (res.success && res.user) {
      const role = (res.user.role || '').toLowerCase();
      if (role === 'citizen') {
        navigate('/citizen/dashboard');
      } else if (role === 'union_officer' || role === 'union_land_officer') {
        navigate('/office/union/dashboard');
      } else if (role === 'ac_land' || role === 'ac_land_officer') {
        navigate('/office/ac-land/dashboard');
      } else if (role === 'sub_registrar' || role === 'sub_registry_officer') {
        navigate('/office/registry/dashboard');
      } else if (role === 'central_admin' || role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/citizen/dashboard');
      }
      return;
    }
    if (!res.success) {
      setError(
        isBn
          ? (res.message_bn || 'লগইন ব্যর্থ হয়েছে। তথ্য যাচাই করুন।')
          : (res.message_en || 'Login failed. Please verify credentials.')
      );
    }
    setLoading(false);
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    setGoogleLoading(true);
    const res = await loginWithGoogle();
    if (!res.success) {
      setError(
        isBn
          ? (res.message_bn || 'গুগল সাইন-ইন সম্পন্ন করা সম্ভব হয়নি।')
          : (res.message_en || 'Unable to complete Google sign-in.')
      );
    }
    setGoogleLoading(false);
  };

  const handleDemoClick = async (persona: string, role?: string) => {
    setError(null);
    setLoading(true);
    const res = await switchDemoPersona(persona, role);
    if (!res.success && res.message_bn) {
      setError(isBn ? res.message_bn : (res.message_en || res.message_bn));
    }
    setLoading(false);
  };

  return (
    <div className={`${isBn ? 'font-bengali' : 'font-sans'} min-h-screen bg-slate-50 dark:bg-slate-950 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center transition-colors`}>
      <div className="max-w-md w-full space-y-6">
        {/* Header */}
        <div className="text-center">
          <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            {isOfficeLogin
              ? (isBn ? 'সরকারি ভূমি কর্মকর্তা লগইন' : 'Government Land Officer Login')
              : isAdminLogin
              ? (isBn ? 'ভূমি মন্ত্রণালয় — সুপার অ্যাডমিন লগইন' : 'Ministry of Land — Super Admin')
              : (isBn ? 'ভূমিসেবা পোর্টালে প্রবেশ' : 'Sign in to VumiSeba')}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {isOfficeLogin
              ? (isBn ? 'ইউনিয়ন তহশিল, এসি ল্যান্ড ও সাব-রেজিস্ট্রি সরকারি অফিস প্যানেল' : 'Union Tahsil, AC Land & Sub-Registry Office Panels')
              : isAdminLogin
              ? (isBn ? 'সিস্টেম গভর্নেন্স, রোল অ্যাসাইনমেন্ট ও জাতীয় অডিট' : 'System Governance, Role Assignment & National Audit')
              : (isBn ? 'বাংলাদেশ ডিজিটাল ভূমি সেবা, সত্যতা যাচাই ও স্মার্ট ই-নামজারি' : 'Bangladesh Digital Land Services, Audit & Smart e-Mutation')}
          </p>
        </div>

        {/* 1. Credentials Form */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 space-y-4 transition-colors">
          {error && (
            <div className="bg-rose-50 dark:bg-rose-950/60 text-rose-800 dark:text-rose-200 text-xs p-3.5 rounded-xl border border-rose-200 dark:border-rose-900 font-medium flex items-start gap-2">
              <AlertCircle size={16} className="text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Real-time Auto-Fill Feedback Notice Banner */}
          {autoFilledNotice && (
            <div className="bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-700 rounded-xl p-3 text-xs flex items-center justify-between gap-2 text-emerald-900 dark:text-emerald-200 animate-in fade-in slide-in-from-top-1 duration-200">
              <div className="flex items-center gap-2 min-w-0">
                <CheckCircle2 size={16} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span className="font-medium truncate">
                  {isBn
                    ? `${autoFilledNotice} এর তথ্য ইনপুট বক্সে পূরণ করা হয়েছে।`
                    : `Credentials for ${autoFilledNotice} filled into form.`}
                </span>
              </div>
              <span className="shrink-0 text-[10px] bg-emerald-600 text-white font-bold px-2 py-0.5 rounded-full">
                {isBn ? '✓ পূরণকৃত' : '✓ Auto-Filled'}
              </span>
            </div>
          )}

          {/* Google Sign-In */}
          <div>
            <button
              type="button"
              id="google-signin-btn"
              disabled={googleLoading || loading}
              onClick={handleGoogleSignIn}
              className="w-full bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold py-2.5 px-4 rounded-xl border border-slate-300 dark:border-slate-700 shadow-2xs transition flex items-center justify-center gap-3 text-sm disabled:opacity-60 disabled:cursor-not-allowed group"
            >
              {googleLoading ? (
                <div className="w-5 h-5 border-2 border-slate-400 border-t-slate-800 dark:border-t-white rounded-full animate-spin"></div>
              ) : (
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
              )}
              <span>{isBn ? 'গুগল অ্যাকাউন্ট দিয়ে সরাসরি সাইন-ইন' : 'Sign in directly with Google'}</span>
            </button>
          </div>

          <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
            <span className="flex-shrink mx-3 text-slate-400 dark:text-slate-500 text-xs font-medium">
              {isBn ? 'অথবা ইমেইল ও পাসওয়ার্ড' : 'Or email and password'}
            </span>
            <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                {isBn ? 'ইমেইল ঠিকানা' : 'Email Address'}
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 text-slate-400 dark:text-slate-500" size={16} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className={`w-full pl-9 pr-3 py-2.5 bg-slate-50 dark:bg-slate-800 border ${
                    highlightInputs
                      ? 'border-emerald-500 ring-2 ring-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/30'
                      : 'border-slate-300 dark:border-slate-700'
                  } text-slate-900 dark:text-slate-100 placeholder-slate-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all duration-300`}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                {isBn ? 'পাসওয়ার্ড' : 'Password'}
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 text-slate-400 dark:text-slate-500" size={16} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className={`w-full pl-9 pr-3 py-2.5 bg-slate-50 dark:bg-slate-800 border ${
                    highlightInputs
                      ? 'border-emerald-500 ring-2 ring-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/30'
                      : 'border-slate-300 dark:border-slate-700'
                  } text-slate-900 dark:text-slate-100 placeholder-slate-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all duration-300`}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl transition shadow-md hover:shadow-lg flex items-center justify-center gap-2 mt-4 active:scale-98"
            >
              {loading ? (isBn ? 'যাচাই হচ্ছে...' : 'Verifying...') : (isBn ? 'লগইন করুন' : 'Sign In')}
              <ArrowRight size={16} />
            </button>
          </form>
        </div>

        {/* Minimal Register Prompt */}
        <div className="text-center text-xs text-slate-500 dark:text-slate-400 py-0.5">
          {isBn ? 'নতুন নাগরিক? ' : 'New citizen? '}
          <Link
            to="/register"
            className="font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 hover:underline transition-colors"
          >
            {isBn ? 'বিনামূল্যে অ্যাকাউন্ট নিবন্ধন করুন' : 'Register for a free account'}
          </Link>
        </div>

        {/* 2. Sleek & Minimal 1-Click Demo Accounts (For Judges & Evaluators) */}
        <div className="bg-white/90 dark:bg-slate-900/90 border border-emerald-200/90 dark:border-emerald-900/50 rounded-2xl p-3.5 shadow-2xs space-y-2.5 transition-all">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0"></span>
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                {isBn ? '১-ক্লিক ডেমো অ্যাকাউন্ট' : '1-Click Demo Accounts'}
              </span>
              <span className="hidden sm:inline text-[10px] text-slate-400 dark:text-slate-500">
                {isBn ? '(মূল্যায়নকারীদের জন্য)' : '(For Judges & Evaluators)'}
              </span>
            </div>
            <span className="shrink-0 text-[10px] text-emerald-700 dark:text-emerald-400 font-semibold bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800/60">
              {isBn ? 'নমুনা পরিচয়' : 'Sample Personas'}
            </span>
          </div>

          <p className="text-[10.5px] text-slate-500 dark:text-slate-400">
            {isBn
              ? 'নিচের প্রোফাইলে ক্লিক করে ইনপুট পূরণ করুন অথবা সরাসরি প্রবেশ করুন:'
              : 'Click any persona to auto-fill inputs or enter via 1-Click login:'}
          </p>

          {/* Minimal 5 Personas Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-left">
            {/* 1: Demo Citizen */}
            <div
              onClick={() => {
                const targetEmail = activeCitizenType === 'buyer' ? 'buyer@bhumisathi.gov.bd' : 'seller@bhumisathi.gov.bd';
                const labelBn = activeCitizenType === 'buyer' ? '১. ডেমো নাগরিক (ক্রেতা ফারহান)' : '১. ডেমো নাগরিক (বিক্রেতা আরমান)';
                const labelEn = activeCitizenType === 'buyer' ? '1. Demo Citizen (Buyer Farhan)' : '1. Demo Citizen (Seller Arman)';
                setEmail(targetEmail);
                setPassword('demo123456');
                setSelectedPersona('citizen');
                setAutoFilledNotice(isBn ? labelBn : labelEn);
                setHighlightInputs(true);
                setError(null);
                setTimeout(() => setHighlightInputs(false), 2200);
              }}
              className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                selectedPersona === 'citizen'
                  ? 'border-emerald-500 bg-emerald-50/80 dark:bg-emerald-950/40 ring-1 ring-emerald-400/50'
                  : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 hover:border-emerald-300 dark:hover:border-emerald-700'
              }`}
            >
              <div className="flex items-center justify-between gap-1.5">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 flex items-center justify-center shrink-0">
                    <User size={14} />
                  </div>
                  <div className="min-w-0">
                    <span className="font-bold text-slate-900 dark:text-white block text-xs leading-tight truncate">
                      {isBn ? '১. ডেমো নাগরিক' : '1. Demo Citizen'}
                    </span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 block leading-tight truncate">
                      {activeCitizenType === 'seller' ? (isBn ? 'বিক্রেতা আরমান' : 'Seller Arman') : (isBn ? 'ক্রেতা ফারহান' : 'Buyer Farhan')}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  disabled={loading || googleLoading}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDemoClick(activeCitizenType, 'citizen');
                  }}
                  className="text-[10px] text-emerald-700 dark:text-emerald-400 hover:underline font-bold shrink-0"
                >
                  {isBn ? '১-ক্লিক →' : '1-Click →'}
                </button>
              </div>

              {/* Citizen Seller vs Buyer Sub-Selector */}
              <div className="mt-2 pt-1.5 border-t border-slate-100 dark:border-slate-700/60 flex items-center gap-1 text-[10px]" onClick={(e) => e.stopPropagation()}>
                <span className="text-slate-400 dark:text-slate-500 mr-1">{isBn ? 'টাইপ:' : 'Type:'}</span>
                <button
                  type="button"
                  onClick={() => {
                    setActiveCitizenType('seller');
                    setEmail('seller@bhumisathi.gov.bd');
                    setPassword('demo123456');
                    setSelectedPersona('citizen');
                    setAutoFilledNotice(isBn ? '১. ডেমো নাগরিক (বিক্রেতা আরমান)' : '1. Demo Citizen (Seller Arman)');
                    setHighlightInputs(true);
                    setTimeout(() => setHighlightInputs(false), 2200);
                  }}
                  className={`px-1.5 py-0.5 rounded text-[10px] font-medium transition ${
                    activeCitizenType === 'seller'
                      ? 'bg-emerald-600 text-white font-bold'
                      : 'bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-600'
                  }`}
                >
                  {isBn ? 'আরমান' : 'Arman'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveCitizenType('buyer');
                    setEmail('buyer@bhumisathi.gov.bd');
                    setPassword('demo123456');
                    setSelectedPersona('citizen');
                    setAutoFilledNotice(isBn ? '১. ডেমো নাগরিক (ক্রেতা ফারহান)' : '1. Demo Citizen (Buyer Farhan)');
                    setHighlightInputs(true);
                    setTimeout(() => setHighlightInputs(false), 2200);
                  }}
                  className={`px-1.5 py-0.5 rounded text-[10px] font-medium transition ${
                    activeCitizenType === 'buyer'
                      ? 'bg-emerald-600 text-white font-bold'
                      : 'bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-600'
                  }`}
                >
                  {isBn ? 'ফারহান' : 'Farhan'}
                </button>
              </div>
            </div>

            {/* 2: Union Officer */}
            <div
              onClick={() => {
                setEmail('union.officer@land.gov.bd');
                setPassword('demo123456');
                setSelectedPersona('union_officer');
                setAutoFilledNotice(isBn ? '২. ইউনিয়ন কর্মকর্তা (ULAO)' : '2. Union Land Officer (ULAO)');
                setHighlightInputs(true);
                setError(null);
                setTimeout(() => setHighlightInputs(false), 2200);
              }}
              className={`p-2.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                selectedPersona === 'union_officer'
                  ? 'border-emerald-500 bg-emerald-50/80 dark:bg-emerald-950/40 ring-1 ring-emerald-400/50'
                  : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 hover:border-emerald-300 dark:hover:border-emerald-700'
              }`}
            >
              <div className="flex items-center justify-between gap-1.5">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-7 h-7 rounded-lg bg-teal-100 dark:bg-teal-950/80 text-teal-700 dark:text-teal-300 flex items-center justify-center shrink-0">
                    <Building2 size={14} />
                  </div>
                  <div className="min-w-0">
                    <span className="font-bold text-slate-900 dark:text-white block text-xs leading-tight truncate">
                      {isBn ? '২. ইউনিয়ন কর্মকর্তা' : '2. Union Officer'}
                    </span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 block leading-tight truncate">
                      {isBn ? 'ULAO তহশিলদার' : 'ULAO Tahsildar'}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  disabled={loading || googleLoading}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDemoClick('union_officer', 'union_land_officer');
                  }}
                  className="text-[10px] text-teal-700 dark:text-teal-300 hover:underline font-bold shrink-0"
                >
                  {isBn ? '১-ক্লিক →' : '1-Click →'}
                </button>
              </div>
              <div className="mt-2 pt-1.5 border-t border-slate-100 dark:border-slate-700/60">
                <span className="text-[9.5px] text-slate-400 font-mono block truncate">union.officer@land.gov.bd</span>
              </div>
            </div>

            {/* 3: AC Land */}
            <div
              onClick={() => {
                setEmail('ac.land@land.gov.bd');
                setPassword('demo123456');
                setSelectedPersona('ac_land');
                setAutoFilledNotice(isBn ? '৩. এসি ল্যান্ড (উপজেলা ভূমি অফিস)' : '3. AC Land (Upazila Land Office)');
                setHighlightInputs(true);
                setError(null);
                setTimeout(() => setHighlightInputs(false), 2200);
              }}
              className={`p-2.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                selectedPersona === 'ac_land'
                  ? 'border-indigo-500 bg-indigo-50/80 dark:bg-indigo-950/40 ring-1 ring-indigo-400/50'
                  : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 hover:border-indigo-300 dark:hover:border-indigo-700'
              }`}
            >
              <div className="flex items-center justify-between gap-1.5">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-7 h-7 rounded-lg bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 flex items-center justify-center shrink-0">
                    <Scale size={14} />
                  </div>
                  <div className="min-w-0">
                    <span className="font-bold text-slate-900 dark:text-white block text-xs leading-tight truncate">
                      {isBn ? '৩. এসি ল্যান্ড' : '3. AC Land'}
                    </span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 block leading-tight truncate">
                      {isBn ? 'উপজেলা ভূমি অফিস' : 'Upazila Land Office'}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  disabled={loading || googleLoading}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDemoClick('ac_land', 'ac_land');
                  }}
                  className="text-[10px] text-indigo-700 dark:text-indigo-300 hover:underline font-bold shrink-0"
                >
                  {isBn ? '১-ক্লিক →' : '1-Click →'}
                </button>
              </div>
              <div className="mt-2 pt-1.5 border-t border-slate-100 dark:border-slate-700/60">
                <span className="text-[9.5px] text-slate-400 font-mono block truncate">ac.land@land.gov.bd</span>
              </div>
            </div>

            {/* 4: Sub-Registrar */}
            <div
              onClick={() => {
                setEmail('sub.registrar@land.gov.bd');
                setPassword('demo123456');
                setSelectedPersona('sub_registrar');
                setAutoFilledNotice(isBn ? '৪. সাব-রেজিস্ট্রার (দলিল নিবন্ধন কার্যালয়)' : '4. Sub-Registrar (Deed Registration)');
                setHighlightInputs(true);
                setError(null);
                setTimeout(() => setHighlightInputs(false), 2200);
              }}
              className={`p-2.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                selectedPersona === 'sub_registrar'
                  ? 'border-amber-500 bg-amber-50/80 dark:bg-amber-950/40 ring-1 ring-amber-400/50'
                  : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 hover:border-amber-300 dark:hover:border-amber-700'
              }`}
            >
              <div className="flex items-center justify-between gap-1.5">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-7 h-7 rounded-lg bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 flex items-center justify-center shrink-0">
                    <Stamp size={14} />
                  </div>
                  <div className="min-w-0">
                    <span className="font-bold text-slate-900 dark:text-white block text-xs leading-tight truncate">
                      {isBn ? '৪. সাব-রেজিস্ট্রার' : '4. Sub-Registrar'}
                    </span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 block leading-tight truncate">
                      {isBn ? 'দলিল নিবন্ধন কার্যালয়' : 'Deed Registration Office'}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  disabled={loading || googleLoading}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDemoClick('sub_registrar', 'sub_registrar');
                  }}
                  className="text-[10px] text-amber-700 dark:text-amber-300 hover:underline font-bold shrink-0"
                >
                  {isBn ? '১-ক্লিক →' : '1-Click →'}
                </button>
              </div>
              <div className="mt-2 pt-1.5 border-t border-slate-100 dark:border-slate-700/60">
                <span className="text-[9.5px] text-slate-400 font-mono block truncate">sub.registrar@land.gov.bd</span>
              </div>
            </div>

            {/* 5: Central Land Administration (Super Admin) - Spans 2 cols */}
            <div
              onClick={() => {
                setEmail('admin@landtech.gov.bd');
                setPassword('demo123456');
                setSelectedPersona('central_admin');
                setAutoFilledNotice(isBn ? '৫. কেন্দ্রীয় প্রশাসন (সুপার অ্যাডমিন)' : '5. Central Admin (Super Admin)');
                setHighlightInputs(true);
                setError(null);
                setTimeout(() => setHighlightInputs(false), 2200);
              }}
              className={`col-span-1 sm:col-span-2 p-2.5 rounded-xl border transition-all cursor-pointer ${
                selectedPersona === 'central_admin'
                  ? 'border-cyan-500 bg-cyan-50/80 dark:bg-cyan-950/40 ring-1 ring-cyan-400/50'
                  : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 hover:border-cyan-300 dark:hover:border-cyan-700'
              }`}
            >
              <div className="flex items-center justify-between gap-1.5">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-7 h-7 rounded-lg bg-cyan-100 dark:bg-cyan-950/80 text-cyan-700 dark:text-cyan-300 flex items-center justify-center shrink-0">
                    <Shield size={14} />
                  </div>
                  <div className="min-w-0">
                    <span className="font-bold text-slate-900 dark:text-white block text-xs leading-tight truncate">
                      {isBn ? '৫. কেন্দ্রীয় প্রশাসন (সুপার অ্যাডমিন)' : '5. Central Land Administration (Super Admin)'}
                    </span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 block leading-tight truncate">
                      {isBn ? 'সার্বিক গভর্নেন্স, রোল অ্যাসাইনমেন্ট ও অডিট লগ' : 'System Oversight, Role Assignment & Audit Log'}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="hidden sm:inline text-[9.5px] text-slate-400 font-mono">admin@landtech.gov.bd</span>
                  <button
                    type="button"
                    disabled={loading || googleLoading}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDemoClick('central_admin', 'central_admin');
                    }}
                    className="text-[10px] text-cyan-700 dark:text-cyan-300 hover:underline font-bold"
                  >
                    {isBn ? '১-ক্লিক →' : '1-Click →'}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Minimal Expandable for Extra Test Citizens */}
          <div className="pt-1 text-center">
            <button
              type="button"
              onClick={() => setShowExtraPersonas(!showExtraPersonas)}
              className="text-[10.5px] text-slate-500 dark:text-slate-400 hover:text-emerald-700 dark:hover:text-emerald-400 transition font-medium"
            >
              {showExtraPersonas
                ? (isBn ? '▲ অতিরিক্ত টেস্ট নাগরিক আড়াল করুন' : '▲ Hide Extra Test Citizens')
                : (isBn ? '▼ অতিরিক্ত টেস্ট নাগরিক (কর বকেয়া, হিস্যা সমস্যা)' : '▼ Extra Test Citizens (Tax Due, Share Dispute)')}
            </button>

            <div
              className={`grid transition-all duration-300 ease-in-out ${
                showExtraPersonas ? 'grid-rows-[1fr] opacity-100 mt-2' : 'grid-rows-[0fr] opacity-0'
              }`}
            >
              <div className="overflow-hidden">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-2 border-t border-slate-100 dark:border-slate-800 text-left">
                  {/* Abdul Latif - Tax Due */}
                  <div
                    onClick={() => {
                      setEmail('latif.taxdue@bhumisathi.gov.bd');
                      setPassword('demo123456');
                      setSelectedPersona('taxdue');
                      setAutoFilledNotice(isBn ? 'আব্দুল লতিফ (কর বকেয়া নাগরিক)' : 'Abdul Latif (Tax Due Citizen)');
                      setHighlightInputs(true);
                      setTimeout(() => setHighlightInputs(false), 2200);
                    }}
                    className="p-2 rounded-lg bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/60 cursor-pointer hover:border-amber-400 transition"
                  >
                    <span className="font-bold text-[11px] block text-slate-900 dark:text-white">
                      {isBn ? 'আব্দুল লতিফ (কর বকেয়া)' : 'Abdul Latif (Tax Due)'}
                    </span>
                    <span className="text-[9.5px] text-amber-700 dark:text-amber-400 font-mono block">latif.taxdue@bhumisathi.gov.bd</span>
                  </div>

                  {/* Nazrul Islam - Excess Share */}
                  <div
                    onClick={() => {
                      setEmail('nazrul.share@bhumisathi.gov.bd');
                      setPassword('demo123456');
                      setSelectedPersona('oversell');
                      setAutoFilledNotice(isBn ? 'নজরুল ইসলাম (হিস্যা ঘাটতি নাগরিক)' : 'Nazrul Islam (Excess Share Citizen)');
                      setHighlightInputs(true);
                      setTimeout(() => setHighlightInputs(false), 2200);
                    }}
                    className="p-2 rounded-lg bg-indigo-50/60 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-800/60 cursor-pointer hover:border-indigo-400 transition"
                  >
                    <span className="font-bold text-[11px] block text-slate-900 dark:text-white">
                      {isBn ? 'নজরুল ইসলাম (হিস্যা ঘাটতি)' : 'Nazrul Islam (Excess Share)'}
                    </span>
                    <span className="text-[9.5px] text-indigo-700 dark:text-indigo-400 font-mono block">nazrul.share@bhumisathi.gov.bd</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
