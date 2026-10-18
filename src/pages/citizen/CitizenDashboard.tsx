import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { formatName, formatMouza, formatPlot, formatKhatian, formatArea, formatLandClass, toEnglishDigits } from '../../utils/bilingual';
import { api } from '../../services/api';
import {
  Landmark,
  ShieldCheck,
  FilePlus2,
  Receipt,
  GitBranch,
  Clock,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Eye,
  X,
  Scale,
  CalendarCheck,
  FileText,
  MapPin,
  RefreshCw,
  Phone,
  CreditCard,
  Copy,
  Check,
  Sparkles,
} from 'lucide-react';
import { StatusBadge } from '../../components/common/StatusBadge';
import { getUserAvatarUrl } from '../../utils/userUtils';

export const CitizenDashboard: React.FC = () => {
  const { user } = useAuth();
  const { language } = useLanguage();
  const isBn = language === 'bn';
  const [holdings, setHoldings] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [mutations, setMutations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedCitizenId, setCopiedCitizenId] = useState(false);
  const [lastRefreshedAt, setLastRefreshedAt] = useState<string>(() => {
    return new Date().toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' });
  });
  const [refreshSuccess, setRefreshSuccess] = useState(false);

  const handleCopyCitizenId = () => {
    const cid = user?.citizen_id || 'BHM-CIT-882194';
    navigator.clipboard.writeText(cid);
    setCopiedCitizenId(true);
    setTimeout(() => setCopiedCitizenId(false), 2000);
  };

  // Quick View Modal State
  const [selectedHolding, setSelectedHolding] = useState<any | null>(null);
  const [selectedApp, setSelectedApp] = useState<any | null>(null);

  const loadDashboardData = async () => {
    setLoading(true);
    setRefreshSuccess(false);
    try {
      const [hRes, aRes, mRes] = await Promise.all([
        api.getMyHoldings(),
        api.getMyApplications(),
        api.mutations.list(),
      ]);
      if (hRes.success && hRes.data) setHoldings(hRes.data);
      if (aRes.success && aRes.data) setApplications(aRes.data);
      if (mRes.success && mRes.data) setMutations(mRes.data);
      const now = new Date();
      setLastRefreshedAt(
        now.toLocaleTimeString(isBn ? 'bn-BD' : 'en-US', { hour: '2-digit', minute: '2-digit' })
      );
      setRefreshSuccess(true);
      setTimeout(() => setRefreshSuccess(false), 2500);
    } catch (err) {
      console.error('Failed loading citizen dashboard data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const totalAreaDecimal = holdings.reduce(
    (sum, item) => sum + (item.ownership?.area_decimal || 0),
    0
  );

  const pendingApps = applications.filter(
    (a) => a.stage !== 'MUTATION_APPROVED' && a.stage !== 'REJECTED'
  );

  const activeMutations = mutations.filter(
    (m) => m.status !== 'rejected'
  );

  const userName = isBn 
    ? (user?.name_bn || 'সম্মানিত নাগরিক') 
    : formatName(user, false, 'Honorable Citizen');

  return (
    <div className={`${isBn ? 'font-bengali' : 'font-sans'} space-y-6`}>
      {/* 1. Welcome & Citizen ID Header Card - Fully Responsive for Mobile & Desktop with New Refresh Button */}
      <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-emerald-500/20 dark:border-teal-500/20 bg-gradient-to-br from-white via-emerald-50/30 to-teal-50/20 dark:from-[#081020] dark:via-[#0c182b] dark:to-[#071d24] p-4 sm:p-6 lg:p-7 shadow-lg shadow-emerald-950/5 dark:shadow-2xl dark:shadow-black/50 transition-all">
        {/* Subtle Ambient Decorative Glows */}
        <div className="absolute -top-16 -right-16 w-64 h-64 bg-teal-500/10 dark:bg-teal-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-emerald-500/10 dark:bg-emerald-400/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-5 sm:gap-6">
          {/* Left: Citizen Profile Details */}
          <div className="flex items-start sm:items-center gap-3.5 sm:gap-5 min-w-0 pr-28 sm:pr-32 lg:pr-0">
            {getUserAvatarUrl(user) ? (
              <div className="relative shrink-0">
                <div className="p-0.5 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-emerald-500 via-teal-400 to-cyan-500 shadow-md">
                  <img
                    src={getUserAvatarUrl(user)!}
                    alt={userName}
                    className="w-14 h-14 sm:w-20 sm:h-20 rounded-[14px] sm:rounded-[22px] object-cover bg-white dark:bg-slate-900"
                  />
                </div>
                <span
                  className="absolute -bottom-1 -right-1 bg-emerald-600 dark:bg-teal-500 text-white dark:text-slate-950 text-[9px] sm:text-[10px] font-black px-1.5 sm:px-2 py-0.5 rounded-full border-2 border-white dark:border-slate-900 flex items-center gap-0.5 shadow-sm"
                  title="জাতীয় পরিচয়পত্র ডাটাবেজ ভেরিফায়েড ছবি"
                >
                  <CheckCircle2 size={10} className="shrink-0" />
                  <span>NID</span>
                </span>
              </div>
            ) : null}

            <div className="min-w-0 flex-1">
              {/* Header Badge Row */}
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-1 sm:mb-1.5">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 dark:bg-teal-500/15 text-emerald-800 dark:text-teal-300 border border-emerald-500/20 dark:border-teal-500/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-teal-400 animate-pulse" />
                  {isBn ? 'স্বাগতম, নাগরিক' : 'Welcome, Citizen'}
                </span>

                {user?.kyc_status === 'verified' && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700/60 shadow-2xs">
                    <ShieldCheck size={12} className="text-emerald-600 dark:text-teal-400 shrink-0" />
                    <span>{isBn ? 'স্মার্ট কেওয়াইসি ভেরিফায়েড' : 'Smart KYC Verified'}</span>
                  </span>
                )}
              </div>

              {/* Citizen Name */}
              <h1 className="text-lg sm:text-2xl lg:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex flex-wrap items-baseline gap-1.5 sm:gap-2 leading-snug">
                <span>{userName}</span>
                {user?.name_en && user?.name_bn && (
                  <span className="text-xs sm:text-sm font-semibold text-slate-500 dark:text-slate-400 font-sans tracking-normal">
                    ({user.name_en})
                  </span>
                )}
              </h1>

              {/* Metadata Badges Row - Clean and Responsive for Mobile */}
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 pt-2 text-xs text-slate-600 dark:text-slate-300">
                {/* Mobile Chip */}
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white/90 dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800 font-mono text-[11px] shadow-2xs">
                  <Phone size={12} className="text-emerald-600 dark:text-teal-400 shrink-0" />
                  <span>{user?.mobile || '017XXXXXXXX'}</span>
                </div>

                {/* NID Chip */}
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white/90 dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800 font-mono text-[11px] shadow-2xs">
                  <CreditCard size={12} className="text-emerald-600 dark:text-teal-400 shrink-0" />
                  <span className="text-slate-500 dark:text-slate-400">{isBn ? 'এনআইডি: ' : 'NID: '}</span>
                  <span className="font-bold text-slate-900 dark:text-white">
                    {user?.nid_no
                      ? user.nid_no.length > 8
                        ? `${user.nid_no.slice(0, 4)}••••${user.nid_no.slice(-4)}`
                        : user.nid_no
                      : (isBn ? 'স্মার্ট কার্ড ভেরিফাইড' : 'Smart Card')}
                  </span>
                </div>

                {/* Location Chip */}
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white/90 dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800 text-[11px] shadow-2xs">
                  <MapPin size={12} className="text-emerald-600 dark:text-teal-400 shrink-0" />
                  <span className="font-medium text-slate-700 dark:text-slate-200">
                    {user?.upazila ? `${user.upazila}, ` : ''}
                    {isBn ? (user?.district || 'ঢাকা') : (user?.district_en || 'Dhaka')}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Smart Citizen ID Card Widget & Redesigned Refresh Button */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto shrink-0">
            {/* Holographic Digital Citizen ID Mini-Card */}
            <div className="group relative w-full sm:w-auto sm:min-w-[270px] overflow-hidden rounded-2xl p-4 bg-gradient-to-b from-white via-slate-50/80 to-emerald-50/40 dark:from-slate-900/95 dark:via-[#0c192d] dark:to-[#072421] border border-emerald-300/60 dark:border-teal-500/30 shadow-md shadow-emerald-950/5 dark:shadow-xl dark:shadow-teal-950/20 transition-all hover:border-emerald-400 dark:hover:border-teal-400/50">
              {/* Top Accent Gradient Bar */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-500" />

              {/* Card Header */}
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-200/80 dark:border-slate-800/80">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 dark:bg-teal-400 animate-pulse" />
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    {isBn ? 'ইউনিক সিটিজেন আইডি' : 'Unique Citizen ID'}
                  </span>
                </div>

                {/* Instant Copy Button */}
                <button
                  type="button"
                  onClick={handleCopyCitizenId}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold text-slate-600 dark:text-slate-300 hover:text-emerald-700 dark:hover:text-teal-300 hover:bg-emerald-100/60 dark:hover:bg-slate-800 transition cursor-pointer"
                  title={isBn ? 'আইডি কপি করুন' : 'Copy ID'}
                >
                  {copiedCitizenId ? (
                    <>
                      <Check size={11} className="text-emerald-600 dark:text-teal-400" />
                      <span className="text-emerald-600 dark:text-teal-400 font-bold">{isBn ? 'কপি হয়েছে' : 'Copied'}</span>
                    </>
                  ) : (
                    <>
                      <Copy size={11} />
                      <span>{isBn ? 'কপি' : 'Copy'}</span>
                    </>
                  )}
                </button>
              </div>

              {/* Citizen ID Monospace Display */}
              <div className="my-1.5 flex items-baseline justify-between">
                <span className="text-lg sm:text-xl font-mono font-extrabold tracking-wider text-emerald-700 dark:text-teal-300 drop-shadow-2xs">
                  {user?.citizen_id || 'BHM-CIT-882194'}
                </span>
              </div>

              {/* Card Footer Link */}
              <div className="pt-2 mt-1 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px]">
                <span className="text-[10px] text-slate-400 font-mono tracking-wider">SECURE • BHM-ID</span>
                <Link
                  to="/citizen/profile"
                  className="inline-flex items-center gap-1 font-bold text-emerald-700 hover:text-emerald-800 dark:text-teal-300 dark:hover:text-teal-200 group-hover:translate-x-0.5 transition"
                >
                  <span>{isBn ? 'প্রোফাইল ও কেওয়াইসি' : 'Profile & KYC'}</span>
                  <ArrowRight size={12} />
                </Link>
              </div>
            </div>

            {/* New Redesigned Refresh & Live Sync Button (Responsive: Top-Right on Mobile, Aligned on Tablet/Desktop) */}
            <button
              type="button"
              onClick={loadDashboardData}
              disabled={loading}
              className={`group inline-flex items-center gap-2 px-3 py-2 sm:px-3.5 sm:py-2.5 rounded-xl sm:rounded-2xl transition-all duration-300 cursor-pointer shadow-xs hover:shadow-md active:scale-95 disabled:opacity-60 border shrink-0 absolute top-3.5 right-3.5 sm:top-5 sm:right-5 lg:static ${
                refreshSuccess
                  ? 'bg-emerald-50 dark:bg-emerald-950/70 border-emerald-400 text-emerald-800 dark:text-emerald-300 ring-2 ring-emerald-400/20'
                  : 'bg-white/95 dark:bg-slate-900/95 hover:bg-emerald-50/80 dark:hover:bg-teal-950/60 border-slate-200/90 dark:border-slate-800 hover:border-emerald-400 dark:hover:border-teal-500/50 text-slate-700 dark:text-slate-200'
              }`}
              title={isBn ? 'তথ্য রিফ্রেশ করুন' : 'Refresh dashboard data'}
            >
              <RefreshCw
                size={15}
                className={`transition-transform duration-700 shrink-0 ${
                  loading
                    ? 'animate-spin text-emerald-600 dark:text-teal-400'
                    : refreshSuccess
                    ? 'text-emerald-600 dark:text-teal-400 scale-110'
                    : 'text-emerald-600 dark:text-teal-400 group-hover:rotate-180'
                }`}
              />
              <div className="flex flex-col text-left">
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] sm:text-xs font-bold leading-tight">
                    {loading
                      ? (isBn ? 'সিঙ্ক হচ্ছে...' : 'Syncing...')
                      : refreshSuccess
                      ? (isBn ? 'হালনাগাদ সম্পন্ন' : 'Synced!')
                      : (isBn ? 'তথ্য রিফ্রেশ' : 'Refresh')}
                  </span>
                  <span className="relative flex h-2 w-2">
                    <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${refreshSuccess ? 'bg-emerald-400' : 'bg-teal-400'}`}></span>
                    <span className={`relative inline-flex rounded-full h-2 w-2 ${refreshSuccess ? 'bg-emerald-500' : 'bg-teal-500'}`}></span>
                  </span>
                </div>
                <span className="text-[9px] text-slate-400 dark:text-slate-500 font-mono hidden sm:block">
                  {isBn ? `সিঙ্ক: ${lastRefreshedAt}` : `Sync: ${lastRefreshedAt}`}
                </span>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Key Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-gov-sm transition-colors">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
              {isBn ? 'মালিকানাধীন জমি' : 'Owned Land'}
            </span>
            <Landmark size={18} className="text-gov-blue dark:text-teal-400" />
          </div>
          <p className="text-2xl font-extrabold text-slate-900 dark:text-white font-mono">
            {totalAreaDecimal.toFixed(2)} <span className="text-xs font-normal text-slate-500 dark:text-slate-400">{isBn ? 'শতক' : 'dec'}</span>
          </p>
          <span className="text-[11px] text-slate-500 dark:text-slate-400">
            {isBn ? `${holdings.length}টি হোল্ডিং রেকর্ড সংযুক্ত` : `${holdings.length} holding records linked`}
          </span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-gov-sm transition-colors">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
              {isBn ? 'চলমান আবেদনসমূহ' : 'Active Applications'}
            </span>
            <Clock size={18} className="text-indigo-600 dark:text-indigo-400" />
          </div>
          <p className="text-2xl font-extrabold text-slate-900 dark:text-white font-mono">
            {pendingApps.length} <span className="text-xs font-normal text-slate-500 dark:text-slate-400">{isBn ? 'টি' : ''}</span>
          </p>
          <span className="text-[11px] text-slate-500 dark:text-slate-400">
            {isBn ? 'ইউনিয়ন, এসি ল্যান্ড ও সাব-রেজিস্ট্রি' : 'Union, AC Land & Sub-Registry'}
          </span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-gov-sm transition-colors">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
              {isBn ? 'ভূমি উন্নয়ন কর' : 'Land Tax (Khajna)'}
            </span>
            <Receipt size={18} className="text-emerald-600 dark:text-emerald-400" />
          </div>
          <p className="text-xl font-bold text-emerald-800 dark:text-emerald-400">
            {holdings.some((h) => h.khajna?.status === 'dues_pending') 
              ? (isBn ? 'বকেয়া বিদ্যমান' : 'Dues Pending') 
              : (isBn ? 'পরিশোধিত (হালনাগাদ)' : 'Cleared (Up to Date)')}
          </p>
          <Link to="/citizen/tax" className="text-[11px] text-teal-700 dark:text-teal-300 hover:underline font-semibold">
            {isBn ? 'দাখিলা সনদ দেখুন →' : 'View Dakhila Certificate →'}
          </Link>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-gov-sm transition-colors">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
              {isBn ? 'ই-নামজারি ট্র্যাকিং' : 'E-Mutation Tracking'}
            </span>
            <GitBranch size={18} className="text-teal-600 dark:text-teal-400" />
          </div>
          <p className="text-xl font-bold text-slate-900 dark:text-white font-mono">
            {activeMutations.length} <span className="text-xs font-normal font-sans text-slate-500 dark:text-slate-400">{isBn ? 'টি কেস' : 'Cases'}</span>
          </p>
          <Link to="/citizen/mutation" className="text-[11px] text-gov-blue dark:text-teal-300 hover:underline font-semibold">
            {isBn ? 'শুনানি ও অর্ডারশিট →' : 'Hearing & Orders →'}
          </Link>
        </div>
      </div>

      {/* 3. Fast Action Cards - Completely Redesigned (No P4/P5, Premium Aesthetics, Smartphone Responsive) */}
      <div className="space-y-3.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-2.5 h-6 rounded-full bg-gradient-to-b from-teal-500 to-emerald-600 shadow-sm" />
            <div>
              <h2 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white tracking-tight">
                {isBn ? 'নাগরিক দ্রুত সেবা ও যাচাইকরণ' : 'Quick Citizen Services & Verification'}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
                {isBn ? 'বায়না ও জমি লেনদেনের পূর্বে স্বত্ব অডিট ও অনলাইন সরকারি সেবাসমূহ' : 'Official digital registry services & pre-purchase due diligence'}
              </p>
            </div>
          </div>
          <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-700 dark:text-teal-300 bg-emerald-50 dark:bg-teal-950/50 px-2.5 py-1 rounded-full border border-emerald-200 dark:border-teal-800/60 shadow-2xs">
            <Sparkles size={12} className="text-emerald-600 dark:text-teal-400 animate-pulse" />
            <span>{isBn ? 'স্মার্ট সেবা পোর্টাল' : 'Smart Portal'}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {/* Card 1: Check Before You Buy (Pre-Purchase Land Audit) - NO P5 */}
          <Link
            to="/citizen/verify-land"
            className="group relative flex flex-col justify-between overflow-hidden rounded-2xl bg-white dark:bg-slate-900 p-5 sm:p-6 border border-slate-200/90 dark:border-slate-800/90 hover:border-emerald-400 dark:hover:border-teal-400/60 shadow-sm hover:shadow-xl hover:shadow-emerald-950/5 dark:hover:shadow-black/40 hover:-translate-y-1 transition-all duration-300"
          >
            {/* Top Hover Accent Bar */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-400 group-hover:h-1.5 transition-all duration-300" />
            
            {/* Ambient Background Glow */}
            <div className="absolute -top-12 -right-12 w-28 h-28 bg-emerald-500/5 dark:bg-emerald-400/5 rounded-full blur-2xl group-hover:bg-emerald-500/10 transition-all pointer-events-none" />

            <div>
              {/* Header: Icon + Category Badge */}
              <div className="flex items-center justify-between gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center shadow-md shadow-emerald-500/20 group-hover:scale-105 group-hover:rotate-2 transition-all duration-300">
                  <ShieldCheck size={24} />
                </div>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-teal-300 border border-emerald-200 dark:border-teal-800/60">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-teal-400 animate-pulse" />
                  {isBn ? 'ঝুঁকি যাচাই অডিট' : 'Due Diligence'}
                </span>
              </div>

              {/* Title & Description */}
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-2 group-hover:text-emerald-700 dark:group-hover:text-teal-300 transition-colors leading-snug">
                {isBn ? 'কেনার আগে জমি যাচাই' : 'Pre-Purchase Risk Audit'}
              </h3>
              <p className="text-xs sm:text-[13px] text-slate-600 dark:text-slate-400 leading-relaxed">
                {isBn 
                  ? 'বায়নার পূর্বে বিক্রেতার সঠিক হিস্যা, বকেয়া খাজনা এবং ব্যাংক লিয়েন বা দেওয়ানি মামলা পরীক্ষা করুন।' 
                  : 'Verify seller legitimate share portion, pending tax dues, and bank liens or court injunctions.'}
              </p>
            </div>

            {/* Action Footer */}
            <div className="pt-4 mt-5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs font-bold text-emerald-700 dark:text-teal-300">
              <span className="group-hover:underline">{isBn ? 'যাচাই শুরু করুন' : 'Start Verification'}</span>
              <div className="w-7 h-7 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-teal-300 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300">
                <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
          </Link>

          {/* Card 2: Apply to Sell Land (Smart Registry) - NO P4 */}
          <Link
            to="/citizen/sell"
            className="group relative flex flex-col justify-between overflow-hidden rounded-2xl bg-white dark:bg-slate-900 p-5 sm:p-6 border border-slate-200/90 dark:border-slate-800/90 hover:border-indigo-400 dark:hover:border-indigo-400/60 shadow-sm hover:shadow-xl hover:shadow-indigo-950/5 dark:hover:shadow-black/40 hover:-translate-y-1 transition-all duration-300"
          >
            {/* Top Hover Accent Bar */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 to-blue-500 group-hover:h-1.5 transition-all duration-300" />
            
            {/* Ambient Background Glow */}
            <div className="absolute -top-12 -right-12 w-28 h-28 bg-indigo-500/5 dark:bg-indigo-400/5 rounded-full blur-2xl group-hover:bg-indigo-500/10 transition-all pointer-events-none" />

            <div>
              {/* Header: Icon + Category Badge */}
              <div className="flex items-center justify-between gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 text-white flex items-center justify-center shadow-md shadow-indigo-500/20 group-hover:scale-105 group-hover:rotate-2 transition-all duration-300">
                  <FilePlus2 size={24} />
                </div>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-indigo-50 dark:bg-indigo-950/60 text-indigo-800 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/60">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 dark:bg-indigo-400 animate-pulse" />
                  {isBn ? 'স্মার্ট রেজিস্ট্রি' : 'Smart Registry'}
                </span>
              </div>

              {/* Title & Description */}
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-2 group-hover:text-indigo-700 dark:group-hover:text-indigo-300 transition-colors leading-snug">
                {isBn ? 'জমি বিক্রির আবেদন প্রণয়ন' : 'Apply to Sell Land'}
              </h3>
              <p className="text-xs sm:text-[13px] text-slate-600 dark:text-slate-400 leading-relaxed">
                {isBn 
                  ? 'মালিকানা হিস্যা ও দাগ সিলেক্ট করে ক্রেতার বরাবরে অনলাইন বিক্রয় আবেদন দাখিল করুন।' 
                  : 'Select ownership share and plot to submit a digital sale application to your verified buyer.'}
              </p>
            </div>

            {/* Action Footer */}
            <div className="pt-4 mt-5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs font-bold text-indigo-700 dark:text-indigo-300">
              <span className="group-hover:underline">{isBn ? 'আবেদন শুরু করুন' : 'Draft Sale Application'}</span>
              <div className="w-7 h-7 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
                <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
          </Link>

          {/* Card 3: Land Tax & Dakhila */}
          <Link
            to="/citizen/tax"
            className="group relative flex flex-col justify-between overflow-hidden rounded-2xl bg-white dark:bg-slate-900 p-5 sm:p-6 border border-slate-200/90 dark:border-slate-800/90 hover:border-teal-400 dark:hover:border-teal-400/60 shadow-sm hover:shadow-xl hover:shadow-teal-950/5 dark:hover:shadow-black/40 hover:-translate-y-1 transition-all duration-300"
          >
            {/* Top Hover Accent Bar */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-teal-500 to-cyan-500 group-hover:h-1.5 transition-all duration-300" />
            
            {/* Ambient Background Glow */}
            <div className="absolute -top-12 -right-12 w-28 h-28 bg-teal-500/5 dark:bg-teal-400/5 rounded-full blur-2xl group-hover:bg-teal-500/10 transition-all pointer-events-none" />

            <div>
              {/* Header: Icon + Category Badge */}
              <div className="flex items-center justify-between gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-600 text-white flex items-center justify-center shadow-md shadow-teal-500/20 group-hover:scale-105 group-hover:rotate-2 transition-all duration-300">
                  <Receipt size={24} />
                </div>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-teal-50 dark:bg-teal-950/60 text-teal-800 dark:text-cyan-300 border border-teal-200 dark:border-teal-800/60">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-500 dark:bg-cyan-400 animate-pulse" />
                  {isBn ? 'ই-পেমেন্ট ও সনদ' : 'e-Payment & QR'}
                </span>
              </div>

              {/* Title & Description */}
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-2 group-hover:text-teal-700 dark:group-hover:text-teal-300 transition-colors leading-snug">
                {isBn ? 'ভূমি উন্নয়ন কর ও দাখিলা' : 'Land Tax & Dakhila'}
              </h3>
              <p className="text-xs sm:text-[13px] text-slate-600 dark:text-slate-400 leading-relaxed">
                {isBn 
                  ? '১-ক্লিকে বকেয়া খাজনা পরিশোধ করুন ও বিক্রয় ছাড়পত্র সনদ সংগ্রহ করুন।' 
                  : 'Pay tax dues instantly and obtain a tamper-proof digital tax clearance certificate.'}
              </p>
            </div>

            {/* Action Footer */}
            <div className="pt-4 mt-5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs font-bold text-teal-700 dark:text-cyan-300">
              <span className="group-hover:underline">{isBn ? 'কর পরিশোধ ও দাখিলা দেখুন' : 'Pay Tax & View Dakhila'}</span>
              <div className="w-7 h-7 rounded-full bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-cyan-300 flex items-center justify-center group-hover:bg-teal-600 group-hover:text-white transition-all duration-300">
                <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* 4. My Holdings Table */}
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-gov-sm border border-slate-200 dark:border-slate-800 p-6 transition-colors">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Landmark size={18} className="text-gov-blue dark:text-teal-400" />
            <h3 className="font-bold text-slate-900 dark:text-white text-base">
              {isBn ? 'আমার জমির মালিকানা ও খতিয়ান' : 'My Land Ownership & Khatians'}
            </h3>
          </div>
          <Link to="/citizen/my-land" className="text-xs text-gov-blue dark:text-teal-300 font-bold hover:underline">
            {isBn ? 'সকল খতিয়ান দেখুন →' : 'View All Khatians →'}
          </Link>
        </div>

        {loading ? (
          <p className="text-xs text-slate-500 dark:text-slate-400 py-6 text-center">
            {isBn ? 'তথ্য লোড হচ্ছে...' : 'Loading land records...'}
          </p>
        ) : holdings.length === 0 ? (
          <div className="text-center py-8 text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-dashed dark:border-slate-700">
            {isBn ? 'আপনার অ্যাকাউন্টে এখনও কোনো ভূমি রেকর্ড সংযুক্ত নেই।' : 'No land records linked to your account yet.'}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs whitespace-nowrap">
              <thead className="bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-b dark:border-slate-700 font-semibold whitespace-nowrap">
                <tr>
                  <th className="py-3 px-4 whitespace-nowrap">{isBn ? 'দাগ ও মৌজা' : 'Plot & Mouza'}</th>
                  <th className="py-3 px-4 whitespace-nowrap">{isBn ? 'খতিয়ান রেফারেন্স' : 'Khatian Reference'}</th>
                  <th className="py-3 px-4 whitespace-nowrap">{isBn ? 'জমির শ্রেণি' : 'Land Class'}</th>
                  <th className="py-3 px-4 whitespace-nowrap">{isBn ? 'মালিকানা হিস্যা' : 'Ownership Share'}</th>
                  <th className="py-3 px-4 whitespace-nowrap">{isBn ? 'জমির পরিমাণ' : 'Land Area'}</th>
                  <th className="py-3 px-4 whitespace-nowrap">{isBn ? 'খাজনা স্থিতি' : 'Tax Status'}</th>
                  <th className="py-3 px-4 text-right whitespace-nowrap">{isBn ? 'কার্যক্রম' : 'Actions'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {holdings.map((item, idx) => {
                  const mouzaName = formatMouza(item.parcel, isBn);
                  const plotLabel = formatPlot(item.parcel?.dag_no, isBn);
                  const areaText = formatArea(item.ownership?.area_decimal, isBn, true);
                  const landClass = formatLandClass(item.parcel?.land_class, isBn);

                  return (
                    <tr key={idx} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition">
                      <td className="py-3.5 px-4 font-semibold text-slate-900 dark:text-white whitespace-nowrap">
                        {plotLabel} ({mouzaName})
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 dark:text-slate-400 whitespace-nowrap font-medium">
                        {item.ownership?.khatian_ref || item.parcel?.khatian_no} ({item.parcel?.khatian_type || 'RS'})
                      </td>
                      <td className="py-3.5 px-4 text-slate-700 dark:text-slate-300 whitespace-nowrap">
                        {landClass}
                      </td>
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-800 dark:text-slate-200 whitespace-nowrap">
                        {(item.ownership?.share_portion * 100).toFixed(1)}% ({item.ownership?.share_portion})
                      </td>
                      <td className="py-3.5 px-4 font-bold text-gov-blue dark:text-teal-400 whitespace-nowrap font-mono">
                        {areaText}
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <StatusBadge status={item.khajna?.status || 'cleared'} />
                      </td>
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="inline-flex items-center justify-end gap-2.5 whitespace-nowrap">
                          <button
                            type="button"
                            onClick={() => setSelectedHolding(item)}
                            className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 px-3 py-1.5 rounded-lg font-semibold inline-flex items-center gap-1.5 transition whitespace-nowrap shrink-0 cursor-pointer"
                          >
                            <Eye size={13} />
                            <span>{isBn ? 'দ্রুত বিবরণী' : 'Quick View'}</span>
                          </button>
                          <Link
                            to={`/citizen/land/${item.parcel?.id}`}
                            className="text-xs text-gov-blue dark:text-teal-300 hover:underline font-semibold whitespace-nowrap shrink-0 px-1"
                          >
                            {isBn ? 'পূর্ণাঙ্গ রেকর্ড' : 'Full Record'}
                          </Link>
                          <Link
                            to={`/citizen/sell?parcel_id=${item.parcel?.id}`}
                            className="text-xs bg-slate-800 dark:bg-slate-700 hover:bg-slate-950 dark:hover:bg-slate-600 text-white px-3.5 py-1.5 rounded-lg font-bold transition whitespace-nowrap shrink-0 inline-flex items-center justify-center text-center shadow-2xs"
                          >
                            {isBn ? 'বিক্রি করুন' : 'Sell Land'}
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 5. Active Applications Tracker */}
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-gov-sm border border-slate-200 dark:border-slate-800 p-6 transition-colors">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Clock size={18} className="text-gov-blue dark:text-teal-400" />
            <h3 className="font-bold text-slate-900 dark:text-white text-base">
              {isBn ? 'আমার সক্রিয় বিক্রয় ও ক্রয় আবেদনসমূহ' : 'My Active Sale & Purchase Applications'}
            </h3>
          </div>
          <Link to="/citizen/my-applications" className="text-xs text-gov-blue dark:text-teal-300 font-bold hover:underline">
            {isBn ? 'সকল আবেদন দেখুন →' : 'View All Applications →'}
          </Link>
        </div>

        {applications.length === 0 ? (
          <p className="text-xs text-slate-500 dark:text-slate-400 py-6 text-center bg-slate-50 dark:bg-slate-800/50 rounded-lg">
            {isBn ? 'কোনো চলমান আবেদন নেই।' : 'No active applications found.'}
          </p>
        ) : (
          <div className="space-y-3">
            {applications.map((app) => {
              const sellerName = formatName(app.seller, isBn, 'Md. Rafiqul Islam');
              const buyerName = formatName(app.buyer, isBn, 'Farhan Ahmed');
              const mouzaName = formatMouza(app.parcel, isBn);
              const plotLabel = formatPlot(app.parcel?.dag_no, isBn);

              return (
                <div
                  key={app.id}
                  className="p-4 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-slate-900 dark:text-white text-sm font-mono">
                        {isBn ? 'আবেদন নং: ' : 'App No: '}{app.application_no}
                      </span>
                      <StatusBadge status={app.stage} />
                    </div>
                    <p className="text-slate-600 dark:text-slate-300">
                      {plotLabel} ({mouzaName}) | {isBn ? 'বিক্রিত জমি: ' : 'Sold Area: '}
                      <strong>{app.proposed_area_decimal} {isBn ? 'শতক' : 'dec'}</strong> | {isBn ? 'পণমূল্য: ৳ ' : 'Price: ৳ '}
                      {Number(app.agreed_price_bdt || 0).toLocaleString(isBn ? 'bn-BD' : 'en-US')}
                    </p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      {isBn ? 'বিক্রেতা: ' : 'Seller: '}{sellerName} → {isBn ? 'ক্রেতা: ' : 'Buyer: '}{buyerName}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 whitespace-nowrap">
                    <button
                      type="button"
                      onClick={() => setSelectedApp(app)}
                      className="bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-slate-300 dark:hover:bg-slate-600 transition inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
                    >
                      <Eye size={12} />
                      <span>{isBn ? 'সারসংক্ষেপ' : 'Summary'}</span>
                    </button>
                    <Link
                      to="/citizen/my-applications"
                      className="bg-gov-blue dark:bg-teal-600 text-white px-3.5 py-1.5 rounded-lg text-xs font-bold hover:bg-slate-900 dark:hover:bg-teal-500 transition whitespace-nowrap shrink-0 inline-flex items-center"
                    >
                      {isBn ? 'ট্র্যাকিং দেখুন' : 'Track Status'}
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 6. Active e-Mutation Cases Section */}
      {activeMutations.length > 0 && (
        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-gov-sm border border-slate-200 dark:border-slate-800 p-6 transition-colors">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Scale size={18} className="text-purple-600 dark:text-purple-400" />
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                {isBn ? 'চলমান ই-নামজারি মোকাদ্দমা (e-Mutation)' : 'Ongoing E-Mutation Cases (e-Mutation)'}
              </h3>
            </div>
            <Link to="/citizen/mutation" className="text-xs text-purple-600 dark:text-purple-400 font-bold hover:underline">
              {isBn ? 'সম্পূর্ণ শুনানিপত্র দেখুন →' : 'View Full Hearing Sheet →'}
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {activeMutations.map((mut: any) => (
              <div
                key={mut.id}
                className="p-4 rounded-xl border border-purple-100 dark:border-purple-950/60 bg-purple-50/40 dark:bg-purple-950/20 text-xs space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-purple-950 dark:text-purple-300">
                    {mut.mutation_case_no}
                  </span>
                  <StatusBadge status={mut.status || mut.current_stage} />
                </div>
                <p className="text-slate-700 dark:text-slate-300">
                  {isBn ? 'বায়া খতিয়ান: ' : 'Parent Khatian: '}
                  <strong>{mut.previous_khatian_no || '1208'}</strong>
                  {isBn ? ' → প্রস্তাবিত নতুন খতিয়ান: ' : ' → Proposed Khatian: '}
                  <strong>{mut.proposed_khatian_no || 'Hal-8873'}</strong>
                </p>
                <div className="flex items-center justify-between pt-1 border-t border-purple-200/50 dark:border-purple-900/40">
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
                    <CalendarCheck size={12} className="text-purple-600 dark:text-purple-400" />
                    {mut.hearing_date 
                      ? `${isBn ? 'শুনানি: ' : 'Hearing: '}${mut.hearing_date}` 
                      : (isBn ? 'ইউনিয়ন প্রতিবেদন অপেক্ষমাণ' : 'Awaiting Union Report')}
                  </span>
                  <Link
                    to="/citizen/mutation"
                    className="text-[11px] font-bold text-purple-700 dark:text-purple-300 hover:underline"
                  >
                    {isBn ? 'আদেশনামা →' : 'Order Sheet →'}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick View Holding Modal */}
      {selectedHolding && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl max-w-lg w-full p-6 text-xs text-slate-800 dark:text-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Landmark size={18} className="text-teal-600 dark:text-teal-400" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {isBn 
                    ? `দাগ নং ${selectedHolding.parcel?.dag_no} এর রেকর্ড বিবরণী` 
                    : `Record Details for Plot No. ${selectedHolding.parcel?.dag_no}`}
                </h3>
              </div>
              <button
                onClick={() => setSelectedHolding(null)}
                className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-xl border border-slate-200 dark:border-slate-700">
              <div>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 block">
                  {isBn ? 'মৌজা ও জে.এল নং' : 'Mouza & JL No'}
                </span>
                <span className="font-semibold text-slate-900 dark:text-white">
                  {isBn 
                    ? (selectedHolding.parcel?.mouza_bn || selectedHolding.parcel?.mouza) 
                    : (selectedHolding.parcel?.mouza_en || selectedHolding.parcel?.mouza)} (JL {selectedHolding.parcel?.jl_no || '28'})
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 block">
                  {isBn ? 'উপজেলা ও জেলা' : 'Upazila & District'}
                </span>
                <span className="font-semibold text-slate-900 dark:text-white">
                  {isBn 
                    ? `${selectedHolding.parcel?.upazila || 'গুলশান'}, ${selectedHolding.parcel?.district || 'ঢাকা'}`
                    : `${selectedHolding.parcel?.upazila_en || 'Gulshan'}, ${selectedHolding.parcel?.district_en || 'Dhaka'}`}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 block">
                  {isBn ? 'খতিয়ান রেফারেন্স' : 'Khatian Reference'}
                </span>
                <span className="font-semibold text-slate-900 dark:text-white">
                  {selectedHolding.ownership?.khatian_ref || selectedHolding.parcel?.khatian_no} ({selectedHolding.parcel?.khatian_type || 'RS'})
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 block">
                  {isBn ? 'জমির শ্রেণি' : 'Land Class'}
                </span>
                <span className="font-semibold text-slate-900 dark:text-white">
                  {isBn ? (selectedHolding.parcel?.land_class || 'বাস্তু (ভিটি)') : (selectedHolding.parcel?.land_type_en || selectedHolding.parcel?.land_class || 'Homestead')}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 block">
                  {isBn ? 'মোট ও অবশিষ্ট জমি' : 'Total & Linked Area'}
                </span>
                <span className="font-semibold text-teal-700 dark:text-teal-300 font-mono">
                  {selectedHolding.ownership?.area_decimal} {isBn ? 'শতক' : 'dec'} ({isBn ? 'মোট দাগে ' : 'Total plot: '}{selectedHolding.parcel?.total_area_decimal} {isBn ? 'শতক' : 'dec'})
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 block">
                  {isBn ? 'ভূমি উন্নয়ন কর' : 'Land Tax'}
                </span>
                <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                  selectedHolding.khajna?.status === 'cleared'
                    ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300'
                    : 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300'
                }`}>
                  {selectedHolding.khajna?.status === 'cleared' 
                    ? (isBn ? 'পরিশোধিত (ছাড়পত্র আছে)' : 'Cleared (No Dues)') 
                    : (isBn ? 'বকেয়া বিদ্যমান' : 'Dues Pending')}
                </span>
              </div>
            </div>

            <div className="space-y-1.5 text-[11px] text-slate-600 dark:text-slate-400">
              <p>• <strong>{isBn ? 'দখল বিবরণ:' : 'Possession:'}</strong> {isBn ? (selectedHolding.parcel?.address_description_bn || 'মৌজা সংলগ্ন নিজস্ব দখলীয় ভিটি জমি।') : 'Registered possession plot with peaceful ownership.'}</p>
              <p>• <strong>{isBn ? 'আইনি স্থিতি:' : 'Legal Status:'}</strong> {isBn ? 'কোনো দেওয়ানি স্থগিতাদেশ বা ব্যাংক দায়বদ্ধতা নেই। সম্পত্তিটি হস্তান্তরযোগ্য ও নির্ভেজাল।' : 'No civil stay orders or bank liens. Property is verified and transferable.'}</p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t dark:border-slate-800">
              <Link
                to={`/citizen/land/${selectedHolding.parcel?.id}`}
                className="px-3.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold cursor-pointer"
              >
                {isBn ? 'পূর্ণাঙ্গ বিবরণ দেখুন' : 'View Full Details'}
              </Link>
              <Link
                to={`/citizen/sell?parcel_id=${selectedHolding.parcel?.id}`}
                className="px-4 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-bold cursor-pointer"
              >
                {isBn ? 'বিক্রির আবেদন দাখিল' : 'Submit Sale Application'}
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Quick View Application Modal */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl max-w-lg w-full p-6 text-xs text-slate-800 dark:text-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <FileText size={18} className="text-indigo-600 dark:text-indigo-400" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {isBn ? 'আবেদন নং: ' : 'Application No: '}{selectedApp.application_no}
                </h3>
              </div>
              <button
                onClick={() => setSelectedApp(null)}
                className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <div className="space-y-3 bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 dark:text-slate-400">{isBn ? 'বর্তমান পর্যায়:' : 'Current Stage:'}</span>
                <StatusBadge status={selectedApp.stage} />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 dark:text-slate-400">{isBn ? 'দলিলের ধরন:' : 'Deed Type:'}</span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {isBn ? (selectedApp.deed_type_bn || 'সাফ-কবলা') : 'Outright Sale (Saf-Kabala)'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 dark:text-slate-400">{isBn ? 'জমির তপশিল:' : 'Land Schedule:'}</span>
                <span className="font-semibold text-slate-900 dark:text-white">
                  {isBn 
                    ? `দাগ নং ${selectedApp.parcel?.dag_no}, খতিয়ান ${selectedApp.parcel?.khatian_no} (${selectedApp.parcel?.mouza_bn || selectedApp.parcel?.mouza})`
                    : `Plot No. ${selectedApp.parcel?.dag_no}, Khatian ${selectedApp.parcel?.khatian_no} (${selectedApp.parcel?.mouza_en || selectedApp.parcel?.mouza})`}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 dark:text-slate-400">{isBn ? 'বিক্রিত জমির পরিমাণ:' : 'Transferred Area:'}</span>
                <span className="font-bold text-indigo-700 dark:text-indigo-300 font-mono">
                  {selectedApp.proposed_area_decimal} {isBn ? 'শতক' : 'dec'} ({isBn ? 'হিস্যা: ' : 'Share: '}{selectedApp.proposed_share})
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 dark:text-slate-400">{isBn ? 'ধার্যকৃত পণমূল্য:' : 'Agreed Price:'}</span>
                <span className="font-bold text-emerald-700 dark:text-emerald-400 font-mono">
                  ৳ {Number(selectedApp.agreed_price_bdt || 0).toLocaleString(isBn ? 'bn-BD' : 'en-US')}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t dark:border-slate-800">
              <Link
                to="/citizen/my-applications"
                className="px-4 py-2 rounded-lg bg-indigo-700 hover:bg-indigo-800 text-white font-bold cursor-pointer"
              >
                {isBn ? 'আবেদনের লাইভ টাইমলাইন দেখুন' : 'View Live Timeline'}
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CitizenDashboard;
