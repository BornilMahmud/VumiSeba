import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
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

  const { login, loginWithGoogle, switchDemoPersona, user, isFirebaseActive } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Detect which login route was accessed
  const isOfficeLogin = location.pathname.includes('/office');
  const isAdminLogin = location.pathname.includes('/admin');
  const isCitizenLogin = location.pathname.includes('/citizen') || (!isOfficeLogin && !isAdminLogin);

  // Role-based routing after authentication
  useEffect(() => {
    if (user) {
      const role = (user.role || '').toLowerCase();
      if (role === 'citizen') {
        if (isOfficeLogin || isAdminLogin) {
          setError('আপনার অ্যাকাউন্টে সরকারি কর্মকর্তা বা প্রশাসক রোল বরাদ্দ নেই। সাধারণ নাগরিক প্যানেলে নির্দেশিত করা হচ্ছে...');
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
  }, [user, navigate, isOfficeLogin, isAdminLogin]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const res = await login({ email, password });
    if (!res.success) {
      setError(res.message_bn || 'লগইন ব্যর্থ হয়েছে। তথ্য যাচাই করুন।');
    }
    setLoading(false);
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    setGoogleLoading(true);
    const res = await loginWithGoogle();
    if (!res.success) {
      setError(res.message_bn || 'গুগল সাইন-ইন সম্পন্ন করা সম্ভব হয়নি।');
    }
    setGoogleLoading(false);
  };

  const handleDemoClick = async (persona: string, role?: string) => {
    setError(null);
    setLoading(true);
    const res = await switchDemoPersona(persona, role);
    if (!res.success && res.message_bn) {
      setError(res.message_bn);
    }
    setLoading(false);
  };

  return (
    <div className="font-bengali min-h-screen bg-slate-50 dark:bg-slate-950 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center transition-colors">
      <div className="max-w-md w-full space-y-6">
        {/* Portal Switching Tabs */}
        <div className="flex items-center justify-center p-1 bg-slate-200/80 dark:bg-slate-800 rounded-xl text-xs font-bold gap-1 border border-slate-300/50 dark:border-slate-700">
          <Link
            to="/login/citizen"
            className={`flex-1 text-center py-2 rounded-lg transition ${
              isCitizenLogin ? 'bg-white dark:bg-slate-700 text-emerald-800 dark:text-emerald-300 shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            নাগরিক প্রবেশদ্বার
          </Link>
          <Link
            to="/login/office"
            className={`flex-1 text-center py-2 rounded-lg transition ${
              isOfficeLogin ? 'bg-white dark:bg-slate-700 text-indigo-900 dark:text-indigo-300 shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            ভূমি কর্মকর্তা
          </Link>
          <Link
            to="/login/admin"
            className={`flex-1 text-center py-2 rounded-lg transition ${
              isAdminLogin ? 'bg-white dark:bg-slate-700 text-cyan-900 dark:text-cyan-300 shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            কেন্দ্রীয় প্রশাসন
          </Link>
        </div>

        {/* Header */}
        <div className="text-center">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white flex items-center justify-center font-bold text-3xl mx-auto shadow-md mb-3 border border-emerald-500/40">
            {isCitizenLogin ? '👤' : isOfficeLogin ? '🏛️' : '🛡️'}
          </div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            {isCitizenLogin && 'ভূমিসেবা নাগরিক পোর্টালে প্রবেশ'}
            {isOfficeLogin && 'সরকারি ভূমি কর্মকর্তা লগইন'}
            {isAdminLogin && 'ভূমি মন্ত্রণালয় — সুপার অ্যাডমিন লগইন'}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {isCitizenLogin && 'বাংলাদেশ ডিজিটাল ভূমি সেবা, সত্যতা যাচাই ও স্মার্ট ই-নামজারি'}
            {isOfficeLogin && 'ইউনিয়ন তহশিল, এসি ল্যান্ড ও সাব-রেজিস্ট্রি সরকারি অফিস প্যানেল'}
            {isAdminLogin && 'সিস্টেম গভর্নেন্স, রোল অ্যাসাইনমেন্ট ও জাতীয় অডিট কনসোল'}
          </p>
        </div>

        {/* 1. Working Demo Logins & Auto-Fill Center */}
        <div className="bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 dark:from-slate-900 dark:via-emerald-950/40 dark:to-slate-900 border border-emerald-300 dark:border-emerald-800/60 rounded-2xl p-5 shadow-sm transition-colors">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-xs font-extrabold text-emerald-950 dark:text-emerald-300">
                ডেমো অ্যাকাউন্ট ও অটো-ফিল প্যানেল (বিচারক ও পরীক্ষক)
              </span>
            </div>
            <span className="text-[10px] text-emerald-800 dark:text-emerald-300 font-bold bg-white dark:bg-slate-800 px-2.5 py-0.5 rounded-full border border-emerald-300 dark:border-emerald-700 shadow-2xs">
              ৮টি অফিসিয়াল ডেমো
            </span>
          </div>

          <p className="text-[11px] text-slate-600 dark:text-slate-400 mb-3.5 leading-relaxed">
            যেকোনো ভূমিকায় <strong>‘১-ক্লিক লগইন’</strong> করে সরাসরি সংশ্লিষ্ট ড্যাশবোর্ডে প্রবেশ করুন, অথবা <strong>‘ফর্ম পূরণ’</strong> চেপে নিচে তথ্য লোড করে দেখুন।
          </p>

          {/* Group 1: Citizen Personas */}
          <div className="space-y-1.5 mb-3.5">
            <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
              নাগরিক ভূমিসমূহ (Citizen Personas):
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {/* 1. Seller Rafiqul */}
              <div className="p-2.5 rounded-xl bg-white dark:bg-slate-800/90 border border-emerald-200 dark:border-emerald-900/60 shadow-2xs hover:shadow-xs transition">
                <div className="flex items-start justify-between gap-1 mb-1.5">
                  <div className="flex items-center gap-1.5">
                    <div className="w-6 h-6 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 flex items-center justify-center shrink-0">
                      <User size={13} />
                    </div>
                    <div>
                      <span className="font-bold text-slate-900 dark:text-white block text-[11px] leading-tight">১. রফিকুল ইসলাম (বিক্রেতা)</span>
                      <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-mono">seller@bhumisathi.gov.bd</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 pt-1 border-t border-slate-100 dark:border-slate-700">
                  <button
                    type="button"
                    onClick={() => {
                      setEmail('seller@bhumisathi.gov.bd');
                      setPassword('demo123456');
                    }}
                    className="flex-1 py-1 px-1.5 rounded bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 text-[10px] font-semibold text-center transition"
                    title="ফর্ম পূরণ করুন"
                  >
                    ফর্ম পূরণ
                  </button>
                  <button
                    type="button"
                    disabled={loading || googleLoading}
                    onClick={() => handleDemoClick('seller', 'citizen')}
                    className="flex-1 py-1 px-1.5 rounded bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-[10px] font-bold text-center transition shadow-2xs"
                    title="১-ক্লিকে লগইন"
                  >
                    ১-ক্লিক লগইন →
                  </button>
                </div>
              </div>

              {/* 2. Buyer Farhan */}
              <div className="p-2.5 rounded-xl bg-white dark:bg-slate-800/90 border border-teal-200 dark:border-teal-900/60 shadow-2xs hover:shadow-xs transition">
                <div className="flex items-start justify-between gap-1 mb-1.5">
                  <div className="flex items-center gap-1.5">
                    <div className="w-6 h-6 rounded-md bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300 flex items-center justify-center shrink-0">
                      <UserCheck size={13} />
                    </div>
                    <div>
                      <span className="font-bold text-slate-900 dark:text-white block text-[11px] leading-tight">২. ফারহান আহমেদ (ক্রেতা)</span>
                      <span className="text-[10px] text-teal-700 dark:text-teal-400 font-mono">buyer@bhumisathi.gov.bd</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 pt-1 border-t border-slate-100 dark:border-slate-700">
                  <button
                    type="button"
                    onClick={() => {
                      setEmail('buyer@bhumisathi.gov.bd');
                      setPassword('demo123456');
                    }}
                    className="flex-1 py-1 px-1.5 rounded bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 text-[10px] font-semibold text-center transition"
                    title="ফর্ম পূরণ করুন"
                  >
                    ফর্ম পূরণ
                  </button>
                  <button
                    type="button"
                    disabled={loading || googleLoading}
                    onClick={() => handleDemoClick('buyer', 'citizen')}
                    className="flex-1 py-1 px-1.5 rounded bg-teal-600 hover:bg-teal-700 active:scale-95 text-white text-[10px] font-bold text-center transition shadow-2xs"
                    title="১-ক্লিকে লগইন"
                  >
                    ১-ক্লিক লগইন →
                  </button>
                </div>
              </div>

              {/* 3. Tax Due Latif */}
              <div className="p-2.5 rounded-xl bg-white dark:bg-slate-800/90 border border-amber-200 dark:border-amber-900/60 shadow-2xs hover:shadow-xs transition">
                <div className="flex items-start justify-between gap-1 mb-1.5">
                  <div className="flex items-center gap-1.5">
                    <div className="w-6 h-6 rounded-md bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 flex items-center justify-center shrink-0">
                      <FileText size={13} />
                    </div>
                    <div>
                      <span className="font-bold text-slate-900 dark:text-white block text-[11px] leading-tight">৩. আব্দুল লতিফ (কর বকেয়া)</span>
                      <span className="text-[10px] text-amber-700 dark:text-amber-400 font-mono">latif.taxdue@bhumisathi.gov.bd</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 pt-1 border-t border-slate-100 dark:border-slate-700">
                  <button
                    type="button"
                    onClick={() => {
                      setEmail('latif.taxdue@bhumisathi.gov.bd');
                      setPassword('demo123456');
                    }}
                    className="flex-1 py-1 px-1.5 rounded bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 text-[10px] font-semibold text-center transition"
                    title="ফর্ম পূরণ করুন"
                  >
                    ফর্ম পূরণ
                  </button>
                  <button
                    type="button"
                    disabled={loading || googleLoading}
                    onClick={() => handleDemoClick('taxdue', 'citizen')}
                    className="flex-1 py-1 px-1.5 rounded bg-amber-600 hover:bg-amber-700 active:scale-95 text-white text-[10px] font-bold text-center transition shadow-2xs"
                    title="১-ক্লিকে লগইন"
                  >
                    ১-ক্লিক লগইন →
                  </button>
                </div>
              </div>

              {/* 4. Excess Share Nazrul */}
              <div className="p-2.5 rounded-xl bg-white dark:bg-slate-800/90 border border-indigo-200 dark:border-indigo-900/60 shadow-2xs hover:shadow-xs transition">
                <div className="flex items-start justify-between gap-1 mb-1.5">
                  <div className="flex items-center gap-1.5">
                    <div className="w-6 h-6 rounded-md bg-indigo-100 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-300 flex items-center justify-center shrink-0">
                      <AlertCircle size={13} />
                    </div>
                    <div>
                      <span className="font-bold text-slate-900 dark:text-white block text-[11px] leading-tight">৪. নজরুল ইসলাম (হিস্যা ঘাটতি)</span>
                      <span className="text-[10px] text-indigo-700 dark:text-indigo-400 font-mono">nazrul.share@bhumisathi.gov.bd</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 pt-1 border-t border-slate-100 dark:border-slate-700">
                  <button
                    type="button"
                    onClick={() => {
                      setEmail('nazrul.share@bhumisathi.gov.bd');
                      setPassword('demo123456');
                    }}
                    className="flex-1 py-1 px-1.5 rounded bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 text-[10px] font-semibold text-center transition"
                    title="ফর্ম পূরণ করুন"
                  >
                    ফর্ম পূরণ
                  </button>
                  <button
                    type="button"
                    disabled={loading || googleLoading}
                    onClick={() => handleDemoClick('oversell', 'citizen')}
                    className="flex-1 py-1 px-1.5 rounded bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white text-[10px] font-bold text-center transition shadow-2xs"
                    title="১-ক্লিকে লগইন"
                  >
                    ১-ক্লিক লগইন →
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Group 2: Government Officers & Super Admin */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
              সরকারি কর্মকর্তা ও প্রশাসন প্যানেল (Officer & Admin Personas):
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {/* 5. Union Land Officer */}
              <div className="p-2.5 rounded-xl bg-white dark:bg-slate-800/90 border border-emerald-300 dark:border-emerald-800 shadow-2xs hover:shadow-xs transition">
                <div className="flex items-start justify-between gap-1 mb-1.5">
                  <div className="flex items-center gap-1.5">
                    <div className="w-6 h-6 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 flex items-center justify-center shrink-0">
                      <Building2 size={13} />
                    </div>
                    <div>
                      <span className="font-bold text-slate-900 dark:text-white block text-[11px] leading-tight">৫. তহশিলদার (ইউনিয়ন ভূমি সহকারী)</span>
                      <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-mono">union.officer@land.gov.bd</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 pt-1 border-t border-slate-100 dark:border-slate-700">
                  <button
                    type="button"
                    onClick={() => {
                      setEmail('union.officer@land.gov.bd');
                      setPassword('demo123456');
                    }}
                    className="flex-1 py-1 px-1.5 rounded bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 text-[10px] font-semibold text-center transition"
                    title="ফর্ম পূরণ করুন"
                  >
                    ফর্ম পূরণ
                  </button>
                  <button
                    type="button"
                    disabled={loading || googleLoading}
                    onClick={() => handleDemoClick('union_officer', 'union_land_officer')}
                    className="flex-1 py-1 px-1.5 rounded bg-emerald-700 hover:bg-emerald-800 active:scale-95 text-white text-[10px] font-bold text-center transition shadow-2xs"
                    title="১-ক্লিকে লগইন"
                  >
                    ১-ক্লিক লগইন →
                  </button>
                </div>
              </div>

              {/* 6. AC Land */}
              <div className="p-2.5 rounded-xl bg-white dark:bg-slate-800/90 border border-indigo-300 dark:border-indigo-800 shadow-2xs hover:shadow-xs transition">
                <div className="flex items-start justify-between gap-1 mb-1.5">
                  <div className="flex items-center gap-1.5">
                    <div className="w-6 h-6 rounded-md bg-indigo-100 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-300 flex items-center justify-center shrink-0">
                      <Scale size={13} />
                    </div>
                    <div>
                      <span className="font-bold text-slate-900 dark:text-white block text-[11px] leading-tight">৬. এসি ল্যান্ড (নামজারি আদালত)</span>
                      <span className="text-[10px] text-indigo-700 dark:text-indigo-400 font-mono">ac.land@land.gov.bd</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 pt-1 border-t border-slate-100 dark:border-slate-700">
                  <button
                    type="button"
                    onClick={() => {
                      setEmail('ac.land@land.gov.bd');
                      setPassword('demo123456');
                    }}
                    className="flex-1 py-1 px-1.5 rounded bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 text-[10px] font-semibold text-center transition"
                    title="ফর্ম পূরণ করুন"
                  >
                    ফর্ম পূরণ
                  </button>
                  <button
                    type="button"
                    disabled={loading || googleLoading}
                    onClick={() => handleDemoClick('ac_land', 'ac_land')}
                    className="flex-1 py-1 px-1.5 rounded bg-indigo-700 hover:bg-indigo-800 active:scale-95 text-white text-[10px] font-bold text-center transition shadow-2xs"
                    title="১-ক্লিকে লগইন"
                  >
                    ১-ক্লিক লগইন →
                  </button>
                </div>
              </div>

              {/* 7. Sub-Registrar */}
              <div className="p-2.5 rounded-xl bg-white dark:bg-slate-800/90 border border-amber-300 dark:border-amber-800 shadow-2xs hover:shadow-xs transition">
                <div className="flex items-start justify-between gap-1 mb-1.5">
                  <div className="flex items-center gap-1.5">
                    <div className="w-6 h-6 rounded-md bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 flex items-center justify-center shrink-0">
                      <Stamp size={13} />
                    </div>
                    <div>
                      <span className="font-bold text-slate-900 dark:text-white block text-[11px] leading-tight">৭. সাব-রেজিস্ট্রার (দলিল নিবন্ধন)</span>
                      <span className="text-[10px] text-amber-700 dark:text-amber-400 font-mono">sub.registrar@land.gov.bd</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 pt-1 border-t border-slate-100 dark:border-slate-700">
                  <button
                    type="button"
                    onClick={() => {
                      setEmail('sub.registrar@land.gov.bd');
                      setPassword('demo123456');
                    }}
                    className="flex-1 py-1 px-1.5 rounded bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 text-[10px] font-semibold text-center transition"
                    title="ফর্ম পূরণ করুন"
                  >
                    ফর্ম পূরণ
                  </button>
                  <button
                    type="button"
                    disabled={loading || googleLoading}
                    onClick={() => handleDemoClick('sub_registrar', 'sub_registrar')}
                    className="flex-1 py-1 px-1.5 rounded bg-amber-700 hover:bg-amber-800 active:scale-95 text-white text-[10px] font-bold text-center transition shadow-2xs"
                    title="১-ক্লিকে লগইন"
                  >
                    ১-ক্লিক লগইন →
                  </button>
                </div>
              </div>

              {/* 8. Super Admin */}
              <div className="p-2.5 rounded-xl bg-white dark:bg-slate-800/90 border border-cyan-300 dark:border-cyan-800 shadow-2xs hover:shadow-xs transition">
                <div className="flex items-start justify-between gap-1 mb-1.5">
                  <div className="flex items-center gap-1.5">
                    <div className="w-6 h-6 rounded-md bg-cyan-100 dark:bg-cyan-950 text-cyan-800 dark:text-cyan-300 flex items-center justify-center shrink-0">
                      <Shield size={13} />
                    </div>
                    <div>
                      <span className="font-bold text-slate-900 dark:text-white block text-[11px] leading-tight">৮. সুপার অ্যাডমিন (ভূমি মন্ত্রণালয়)</span>
                      <span className="text-[10px] text-cyan-700 dark:text-cyan-400 font-mono">admin@landtech.gov.bd</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 pt-1 border-t border-slate-100 dark:border-slate-700">
                  <button
                    type="button"
                    onClick={() => {
                      setEmail('admin@landtech.gov.bd');
                      setPassword('demo123456');
                    }}
                    className="flex-1 py-1 px-1.5 rounded bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 text-[10px] font-semibold text-center transition"
                    title="ফর্ম পূরণ করুন"
                  >
                    ফর্ম পূরণ
                  </button>
                  <button
                    type="button"
                    disabled={loading || googleLoading}
                    onClick={() => handleDemoClick('central_admin', 'central_admin')}
                    className="flex-1 py-1 px-1.5 rounded bg-cyan-700 hover:bg-cyan-800 active:scale-95 text-white text-[10px] font-bold text-center transition shadow-2xs"
                    title="১-ক্লিক লগইন"
                  >
                    ১-ক্লিক লগইন →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 2. Credentials Form */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 space-y-4 transition-colors">
          {error && (
            <div className="bg-rose-50 dark:bg-rose-950/60 text-rose-800 dark:text-rose-200 text-xs p-3.5 rounded-xl border border-rose-200 dark:border-rose-900 font-medium flex items-start gap-2">
              <AlertCircle size={16} className="text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
              <span>{error}</span>
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
              <span>গুগল অ্যাকাউন্ট দিয়ে সরাসরি সাইন-ইন</span>
            </button>
          </div>

          <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
            <span className="flex-shrink mx-3 text-slate-400 dark:text-slate-500 text-xs font-medium">অথবা ইমেইল ও পাসওয়ার্ড</span>
            <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">ইমেইল ঠিকানা</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 text-slate-400 dark:text-slate-500" size={16} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">পাসওয়ার্ড</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 text-slate-400 dark:text-slate-500" size={16} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl transition shadow-md hover:shadow-lg flex items-center justify-center gap-2 mt-4 active:scale-98"
            >
              {loading ? 'যাচাই হচ্ছে...' : 'লগইন করুন'}
              <ArrowRight size={16} />
            </button>
          </form>
        </div>

        <div className="text-center text-xs text-slate-500 dark:text-slate-400">
          নতুন নাগরিক?{' '}
          <Link to="/register" className="text-emerald-700 dark:text-emerald-400 font-bold hover:underline">
            বিনামূল্যে অ্যাকাউন্ট নিবন্ধন করুন
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
