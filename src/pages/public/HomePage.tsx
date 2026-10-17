import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  ShieldCheck,
  CheckCircle,
  FileText,
  Building2,
  Scale,
  ArrowRight,
  AlertTriangle,
  HelpCircle,
  Clock,
  Sparkles,
  Check,
  ChevronRight,
  Shield,
  FileCheck,
  BadgeCheck,
  Zap,
} from 'lucide-react';
import {
  Link001,
  Link002,
  Link003,
  Link004,
  Link005,
} from '@/components/ui/skiper-ui/skiper40';
import { useLanguage } from '../../context/LanguageContext';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { language, t } = useLanguage();

  const [district, setDistrict] = useState('ঢাকা');
  const [upazila, setUpazila] = useState('গুলশান');
  const [mouza, setMouza] = useState('বাড্ডা');
  const [dagNo, setDagNo] = useState('');
  const [khatianNo, setKhatianNo] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (district) params.append('district', district);
    if (upazila) params.append('upazila', upazila);
    if (mouza) params.append('mouza', mouza);
    if (dagNo) params.append('dag_no', dagNo);
    if (khatianNo) params.append('khatian_no', khatianNo);
    navigate(`/search-land?${params.toString()}`);
  };

  const handleQuickFill = (sampleDag: string, sampleKhatian: string, sampleMouza = 'বাড্ডা') => {
    setDistrict('ঢাকা');
    setUpazila('গুলশান');
    setMouza(sampleMouza);
    setDagNo(sampleDag);
    setKhatianNo(sampleKhatian);
  };

  return (
    <div className="font-sans text-slate-900 bg-white">
      {/* 1. Supahero.io Inspired Hero Section (White Theme + Crisp Accent Glow) */}
      <section className="relative pt-12 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden bg-dot-pattern">
        {/* Soft Ambient Radial Lights */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-emerald-50/70 via-teal-50/30 to-transparent pointer-events-none -z-10 rounded-full blur-3xl opacity-70"></div>

        <div className="relative max-w-5xl mx-auto text-center space-y-6">
          {/* Official Badge Pill */}
          <div className="inline-flex items-center gap-2 bg-emerald-50/90 text-emerald-800 border border-emerald-200/90 px-4 py-1.5 rounded-full text-xs font-semibold shadow-xs hover:border-emerald-300 transition-colors">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600"></span>
            </span>
            <span>{t('hero.badge', 'জাতীয় ল্যান্ডটেক প্ল্যাটফর্ম — সমন্বিত ডিজিটাল ভূমি সেবা', 'National LandTech Platform — Unified Digital Land Services')}</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.18]">
            {t('hero.title1', 'জমি কেনা থেকে নামজারি —', 'From Land Purchase to Mutation —')}{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700">
              {t('hero.titleHighlight', 'এক ক্লিকে নির্ভুল যাচাই', 'One-Click Accurate Verification')}
            </span>{' '}
            <br className="hidden sm:inline" />
            {t('hero.title2', 'ও স্মার্ট রেজিস্ট্রি', '& Smart Registry')}
          </h1>

          {/* Subtitle */}
          <p className="max-w-3xl mx-auto text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
            {t(
              'hero.desc',
              'বায়না করার আগেই মালিকানার সত্যতা, খতিয়ান ও দাগের বৈধতা, বকেয়া খাজনা এবং আদালতের মোকদ্দমা যাচাই করুন। দলিল নিবন্ধনের পর স্বয়ংক্রিয়ভাবে শুরু হবে আপনার ই-নামজারি ও নতুন খতিয়ান জারির প্রক্রিয়া।',
              'Verify ownership authenticity, khatian and dag plot validity, tax arrears, and court injunctions before earnest money. Automated e-mutation and new record of rights begin directly after deed registration.'
            )}
          </p>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <Link
              to="/verify-land"
              className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3.5 rounded-xl font-bold text-sm shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <ShieldCheck size={18} />
              <span>{t('hero.ctaVerify', 'কেনার আগে জমি যাচাই করুন', 'Verify Land Before Buying')}</span>
            </Link>

            <Link
              to="/verify-land?parcel_id=pcl-clean-405"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-teal-600 to-emerald-700 hover:from-teal-700 hover:to-emerald-800 text-white px-6 py-3.5 rounded-xl font-bold text-sm shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <Sparkles size={18} className="text-yellow-300" />
              <span>{t('hero.tryDemo', '৩-মিনিট লাইভ ডেমো শুরু করুন', 'Try 3-Min Live Demo')}</span>
            </Link>

            <Link
              to="/citizen/sell"
              className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300/80 px-6 py-3.5 rounded-xl font-semibold text-sm shadow-xs hover:shadow transition-all transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <FileText size={18} className="text-slate-500" />
              <span>{t('hero.ctaSell', 'জমি বিক্রির আবেদন', 'Apply to Sell Land')}</span>
            </Link>
          </div>
        </div>

        {/* Integrated Live Khatian & Dag Search Box (White Theme Elevation) */}
        <div className="relative max-w-4xl mx-auto mt-12 bg-white rounded-2xl shadow-card-hover p-6 sm:p-8 border border-slate-200/90 text-slate-800">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-5 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
                <Search size={18} />
              </div>
              <div>
                <h2 className="text-sm font-bold text-slate-900">
                  {t('hero.searchTitle', 'সরাসরি খতিয়ান ও দাগ অনুসন্ধান', 'Direct Khatian & Dag Plot Search')}
                </h2>
                <p className="text-[11px] text-slate-500">
                  {t('hero.searchSubtitle', 'বাংলাদেশের যেকোনো মৌজার জমি ও মালিকানা তাৎক্ষণিক অনুসন্ধান করুন', 'Instant lookup for land records across all mouzas')}
                </p>
              </div>
            </div>
            <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 self-start sm:self-auto">
              {language === 'en' ? 'Live Land Records Database' : 'লাইভ রেকর্ড ডাটাবেজ'}
            </span>
          </div>

          <form onSubmit={handleSearchSubmit} className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5 text-xs">
            <div>
              <label className="block text-slate-700 font-semibold mb-1.5">{t('search.district', 'জেলা', 'District')}</label>
              <select
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full bg-slate-50/80 hover:bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-900 font-medium focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition"
              >
                <option value="ঢাকা">{language === 'en' ? 'Dhaka' : 'ঢাকা'}</option>
                <option value="চট্টগ্রাম">{language === 'en' ? 'Chattogram' : 'চট্টগ্রাম'}</option>
                <option value="সিলেট">{language === 'en' ? 'Sylhet' : 'সিলেট'}</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1.5">{t('search.upazila', 'উপজেলা/সার্কেল', 'Upazila / Circle')}</label>
              <select
                value={upazila}
                onChange={(e) => setUpazila(e.target.value)}
                className="w-full bg-slate-50/80 hover:bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-900 font-medium focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition"
              >
                <option value="গুলশান">{language === 'en' ? 'Gulshan Circle' : 'গুলশান রাজস্ব সার্কেল'}</option>
                <option value="তেজগাঁও">{language === 'en' ? 'Tejgaon Circle' : 'তেজগাঁও সার্কেল'}</option>
                <option value="ধানমন্ডি">{language === 'en' ? 'Dhanmondi Circle' : 'ধানমন্ডি সার্কেল'}</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1.5">{t('search.mouza', 'মৌজা', 'Mouza')}</label>
              <select
                value={mouza}
                onChange={(e) => setMouza(e.target.value)}
                className="w-full bg-slate-50/80 hover:bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-900 font-medium focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition"
              >
                <option value="বাড্ডা">{language === 'en' ? 'Badda (JL 28)' : 'বাড্ডা (জে.এল ২৮)'}</option>
                <option value="সাঁতারকুল">{language === 'en' ? 'Satarkul (JL 31)' : 'সাঁতারকুল (জে.এল ৩১)'}</option>
                <option value="ভাটারা">{language === 'en' ? 'Vatara (JL 25)' : 'ভাটারা (জে.এল ২৫)'}</option>
                <option value="রামপুরা">{language === 'en' ? 'Rampura (JL 23)' : 'রামপুরা (জে.এল ২৩)'}</option>
                <option value="আফতাবনগর">{language === 'en' ? 'Aftabnagar (JL 29)' : 'আফতাবনগর (জে.এল ২৯)'}</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1.5">{t('search.khatian', 'খতিয়ান নম্বর', 'Khatian No.')}</label>
              <input
                type="text"
                placeholder={language === 'en' ? 'e.g., 1204' : 'যেমন: ১২০৪'}
                value={khatianNo}
                onChange={(e) => setKhatianNo(e.target.value)}
                className="w-full bg-slate-50/80 hover:bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-900 font-medium placeholder-slate-400 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1.5">{t('search.dag', 'দাগ নম্বর', 'Dag Plot No.')}</label>
              <input
                type="text"
                placeholder={language === 'en' ? 'e.g., 405' : 'যেমন: ৪০৫'}
                value={dagNo}
                onChange={(e) => setDagNo(e.target.value)}
                className="w-full bg-slate-50/80 hover:bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-900 font-medium placeholder-slate-400 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition"
              />
            </div>

            <div className="col-span-2 sm:col-span-1 lg:col-span-1 flex items-end">
              <button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-3 rounded-lg shadow-xs hover:shadow transition flex items-center justify-center gap-1.5"
              >
                <Search size={15} />
                <span>{t('search.btn', 'অনুসন্ধান করুন', 'Search')}</span>
              </button>
            </div>
          </form>

          {/* Interactive 1-Click Sample Tag Fillers */}
          <div className="mt-4 pt-3 text-[11px] text-slate-600 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="font-semibold text-slate-700">{t('search.sampleLabel', 'পরীক্ষার জন্য নমুনা দাগ:', 'Quick Test Plots:')}</span>
              <button
                type="button"
                onClick={() => handleQuickFill('৪০৫', '১২০৪')}
                className="px-2 py-0.5 rounded bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-semibold border border-emerald-200 transition"
                title="৪০৫ দাগ নির্বাচন করুন"
              >
                {t('search.sampleSafe', '৪০৫ (নিরাপদ)', '405 (Safe)')}
              </button>
              <button
                type="button"
                onClick={() => handleQuickFill('৮৮২', '১৩০৫')}
                className="px-2 py-0.5 rounded bg-amber-50 hover:bg-amber-100 text-amber-800 font-semibold border border-amber-200 transition"
                title="৮৮২ দাগ নির্বাচন করুন"
              >
                {t('search.sampleTax', '৮৮২ (কর বকেয়া)', '882 (Tax Due)')}
              </button>
              <button
                type="button"
                onClick={() => handleQuickFill('১০২', '১২০০')}
                className="px-2 py-0.5 rounded bg-blue-50 hover:bg-blue-100 text-blue-800 font-semibold border border-blue-200 transition"
                title="১০২ দাগ নির্বাচন করুন"
              >
                {t('search.sampleShare', '১০২ (হিস্যা ঘাটতি)', '102 (Share Deficit)')}
              </button>
              <button
                type="button"
                onClick={() => handleQuickFill('৭১০', '১৪১০')}
                className="px-2 py-0.5 rounded bg-rose-50 hover:bg-rose-100 text-rose-800 font-semibold border border-rose-200 transition"
                title="৭১০ দাগ নির্বাচন করুন"
              >
                {t('search.sampleCase', '৭১০ (মামলা/মর্টগেজ)', '710 (Case/Mortgage)')}
              </button>
            </div>

            <Link to="/search-land" className="text-emerald-700 font-bold hover:underline inline-flex items-center gap-1">
              <span>{t('search.advanced', 'উন্নত অনুসন্ধান →', 'Advanced Search →')}</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 2. P5 Highlight: Check Before You Buy (Clean White Card with Emerald Accent Border) */}
      <section className="py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="bg-gradient-to-br from-white via-slate-50/50 to-emerald-50/20 rounded-2xl p-7 sm:p-10 shadow-card border border-emerald-200/80 flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="space-y-3.5 max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-emerald-100/80 text-emerald-800 px-3 py-1 rounded-md text-xs font-bold border border-emerald-300">
              <ShieldCheck size={16} />
              <span>{t('p5.badge', 'সমস্যা ৫ — কেনার আগে যাচাই', 'Problem 5 — Pre-Purchase Verification')}</span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-snug">
              {t('p5.title', 'প্রতারণা ও ভূমি বিরোধ এড়াতে বায়নার পূর্বেই স্বয়ংক্রিয় অডিট', 'Automated Land Audit Before Purchase to Prevent Fraud & Disputes')}
            </h3>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {t(
                'p5.desc',
                'বিক্রেতার নামে রেকর্ডীয় হিস্যা রয়েছে কি না, জমিটিতে কোনো গোপন ব্যাংক ঋণ, দেওয়ানি আদালতের মামলা, সরকারি খাস বা অধিগ্রহণ রয়েছে কি না তা তাৎক্ষণিক যাচাই করে সিদ্ধান্ত নিন।',
                'Instantly verify recorded seller shares, undisclosed bank mortgages, civil litigation injunctions, vested property, or government acquisitions before committing funds.'
              )}
            </p>

            <div className="flex flex-wrap gap-2 pt-2 text-xs">
              <span className="bg-white text-emerald-800 px-3 py-1.5 rounded-lg border border-emerald-200 shadow-2xs font-semibold flex items-center gap-1.5">
                <Check size={14} className="text-emerald-600" />
                {t('p5.check1', 'হিস্যা অতিরিক্ত বিক্রি রোধ', 'Prevent Excess Share Sales')}
              </span>
              <span className="bg-white text-emerald-800 px-3 py-1.5 rounded-lg border border-emerald-200 shadow-2xs font-semibold flex items-center gap-1.5">
                <Check size={14} className="text-emerald-600" />
                {t('p5.check2', 'ডুপ্লিকেট সেল চেক', 'Duplicate Deed Check')}
              </span>
              <span className="bg-white text-emerald-800 px-3 py-1.5 rounded-lg border border-emerald-200 shadow-2xs font-semibold flex items-center gap-1.5">
                <Check size={14} className="text-emerald-600" />
                {t('p5.check3', 'বকেয়া খাজনা ব্লক', 'Tax Arrears Guard')}
              </span>
              <span className="bg-white text-rose-800 px-3 py-1.5 rounded-lg border border-rose-200 shadow-2xs font-semibold flex items-center gap-1.5">
                <AlertTriangle size={14} className="text-rose-600" />
                {t('p5.check4', 'মামলার লাল সতর্কতা', 'Court Litigation Red Alert')}
              </span>
            </div>
          </div>

          <div className="shrink-0 text-center w-full lg:w-auto">
            <Link
              to="/verify-land"
              className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-7 py-4 rounded-xl shadow-md hover:shadow-lg transition transform hover:-translate-y-0.5 text-sm w-full sm:w-auto"
            >
              <span>{t('p5.cta', 'ঝুঁকি ক্যালকুলেটর চালু করুন', 'Launch Risk Calculator')}</span>
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* 3. 9-Stage Visual Roadmap (P4 + P5 Unified Journey) */}
      <section className="py-14 bg-slate-50/60 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-2">
            <span className="text-emerald-700 font-bold text-xs uppercase tracking-wider bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 inline-block">
              {t('roadmap.subtitle', 'সমন্বিত ডিজিটাল সেবা প্রণালী', 'Unified Digital Service Workflow')}
            </span>
            <h3 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              {t('roadmap.title', 'ভূমি কেনা-বেচা থেকে ই-নামজারি: ৯টি সহজ ধাপ', 'From Land Deal to E-Mutation: 9 Clear Stages')}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600">
              {t(
                'roadmap.desc',
                'ভূমিসাথী প্ল্যাটফর্মের মাধ্যমে নাগরিক এবং সংশ্লিষ্ট সরকারি অফিসসমূহের একটি সুশৃঙ্খল টাইমলাইন',
                'A transparent, orderly timeline connecting citizens with all government land offices'
              )}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Step 1-3: Citizen & Pre-Verification */}
            <div className="card-interactive bg-white rounded-2xl p-6 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold bg-emerald-600 text-white w-7 h-7 rounded-full flex items-center justify-center shadow-xs">1</span>
                <span className="text-[11px] text-emerald-800 font-bold bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  {language === 'en' ? 'Citizen Pre-Audit' : 'নাগরিক পর্যায়'}
                </span>
              </div>
              <h4 className="font-bold text-slate-900 text-base">
                {language === 'en' ? 'Land Search & Pre-Verification' : 'জমি অনুসন্ধান ও প্রাক-যাচাই'}
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                {language === 'en'
                  ? 'Verify land location, recorded co-owners, share breakdown, and total plot area by Mouza, Khatian and Dag plot numbers.'
                  : 'মৌজা, খতিয়ান ও দাগ নম্বর দিয়ে জমির অবস্থান, রেকর্ডীয় মালিকদের হিস্যা এবং মোট আয়তন যাচাই।'}
              </p>
            </div>

            <div className="card-interactive bg-white rounded-2xl p-6 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold bg-emerald-600 text-white w-7 h-7 rounded-full flex items-center justify-center shadow-xs">2</span>
                <span className="text-[11px] text-emerald-800 font-bold bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  {language === 'en' ? 'Risk Audit' : 'ঝুঁকি অডিট'}
                </span>
              </div>
              <h4 className="font-bold text-slate-900 text-base">
                {language === 'en' ? 'Risk & Legal Dispute Audit' : 'ঝুঁকি ও আইনি বিরোধ নিরূপণ'}
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                {language === 'en'
                  ? 'Identify seller NID mismatches, excess share selling attempts, bank mortgages, and civil court injunctions.'
                  : 'বিক্রেতার এনআইডি মিল, অতিরিক্ত হিস্যা বিক্রির চেষ্টা, ব্যাংক দায়বদ্ধতা এবং আদালতের নিষেধাজ্ঞা শনাক্ত।'}
              </p>
            </div>

            <div className="card-interactive bg-white rounded-2xl p-6 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold bg-emerald-600 text-white w-7 h-7 rounded-full flex items-center justify-center shadow-xs">3</span>
                <span className="text-[11px] text-amber-800 font-bold bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                  {language === 'en' ? 'Tax Guard' : 'সার্ভার গার্ড'}
                </span>
              </div>
              <h4 className="font-bold text-slate-900 text-base">
                {language === 'en' ? 'Land Tax Clearance & Dakhila' : 'ভূমি উন্নয়ন কর ও ছাড়পত্র'}
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                {language === 'en'
                  ? 'Confirmation of up-to-date land tax payment. If arrears exist, the portal automatically halts the sale application.'
                  : 'বকেয়া খাজনা পরিশোধ নিশ্চিতকরণ। কর বকেয়া থাকলে সিস্টেম স্বয়ংক্রিয়ভাবে বিক্রয় আবেদন দাখিল আটকে দেবে।'}
              </p>
            </div>

            {/* Step 4-6: Office Review & Field Inquiry */}
            <div className="card-interactive bg-white rounded-2xl p-6 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold bg-slate-900 text-white w-7 h-7 rounded-full flex items-center justify-center shadow-xs">4</span>
                <span className="text-[11px] text-slate-800 font-bold bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-200">
                  {language === 'en' ? 'Application' : 'আবেদন'}
                </span>
              </div>
              <h4 className="font-bold text-slate-900 text-base">
                {language === 'en' ? 'Online Land Sale Submission' : 'জমি বিক্রির অনলাইন আবেদন'}
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                {language === 'en'
                  ? 'Submit digital application specifying buyer and seller citizen IDs, land acreage, consideration price, and draft deed.'
                  : 'ক্রেতা ও বিক্রেতার সিটিজেন আইডি, বিক্রিত জমির পরিমাণ ও পণমূল্য উল্লেখ করে অনলাইন আবেদন দাখিল।'}
              </p>
            </div>

            <div className="card-interactive bg-white rounded-2xl p-6 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold bg-slate-900 text-white w-7 h-7 rounded-full flex items-center justify-center shadow-xs">5</span>
                <span className="text-[11px] text-blue-800 font-bold bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                  {language === 'en' ? 'Review' : 'প্রশাসন'}
                </span>
              </div>
              <h4 className="font-bold text-slate-900 text-base">
                {language === 'en' ? 'Administrative Record Scrutiny' : 'প্রাথমিক প্রশাসনিক পর্যালোচনা'}
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                {language === 'en'
                  ? 'Preliminary verification of shares and record accuracy. If any discrepancies occur, actionable rectification is issued.'
                  : 'হিস্যা ও রেকর্ডীয় তথ্যের প্রাথমিক সঠিকতা যাচাই। কোনো ত্রুটি থাকলে কারণসহ সংশোধনের নির্দেশ।'}
              </p>
            </div>

            <div className="card-interactive bg-white rounded-2xl p-6 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold bg-slate-900 text-white w-7 h-7 rounded-full flex items-center justify-center shadow-xs">6</span>
                <span className="text-[11px] text-indigo-800 font-bold bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-200">
                  {language === 'en' ? 'Field Inquiry' : 'তহশিল অফিস'}
                </span>
              </div>
              <h4 className="font-bold text-slate-900 text-base">
                {language === 'en' ? 'Union Land Office Physical Inquiry' : 'ইউনিয়ন ভূমি অফিসের সরেজমিন তদন্ত'}
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                {language === 'en'
                  ? 'On-ground field inspection by the Union Land Assistant Officer regarding physical possession, boundaries, and co-sharer consent.'
                  : 'ইউনিয়ন ভূমি সহকারী কর্মকর্তা কর্তৃক সরেজমিন সীমানা, শারীরিক দখল ও সহ-শরিকদের সম্মতি সম্পর্কিত প্রতিবেদন।'}
              </p>
            </div>

            {/* Step 7-9: Sub-Registry & Mutation */}
            <div className="card-interactive bg-white rounded-2xl p-6 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold bg-teal-600 text-white w-7 h-7 rounded-full flex items-center justify-center shadow-xs">7</span>
                <span className="text-[11px] text-purple-800 font-bold bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-200">
                  {language === 'en' ? 'Sub-Registry' : 'সাব-রেজিস্ট্রি'}
                </span>
              </div>
              <h4 className="font-bold text-slate-900 text-base">
                {language === 'en' ? 'Deed Execution & Registration' : 'দলিল সম্পাদন ও নিবন্ধন সম্পন্ন'}
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                {language === 'en'
                  ? 'Biometric appointment at the Sub-Registry office, statutory deed execution, and instantaneous digital registration recording.'
                  : 'সাব-রেজিস্ট্রি অফিসে অ্যাপয়েন্টমেন্ট ও বায়োমেট্রিক উপস্থিতিতে সাফ-কবলা দলিল নিবন্ধন ও সিরিয়াল নম্বর প্রদান।'}
              </p>
            </div>

            <div className="card-interactive bg-white rounded-2xl p-6 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold bg-teal-600 text-white w-7 h-7 rounded-full flex items-center justify-center shadow-xs">8</span>
                <span className="text-[11px] text-cyan-800 font-bold bg-cyan-50 px-2.5 py-0.5 rounded-full border border-cyan-200">
                  {language === 'en' ? 'E-Mutation' : 'ই-নামজারি'}
                </span>
              </div>
              <h4 className="font-bold text-slate-900 text-base">
                {language === 'en' ? 'Automated Mutation Case Filing' : 'স্বয়ংক্রিয় নামজারি কেস ও শুনানি'}
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                {language === 'en'
                  ? 'Upon deed registration, a mutation case is automatically lodged at the AC Land office with automatic hearing notices.'
                  : 'রেজিস্ট্রেশন সম্পন্ন হতেই সহকারী কমিশনার (ভূমি) অফিসে নামজারি কেস রুজু ও ডিজিটাল নোটিশ জারি।'}
              </p>
            </div>

            <div className="card-interactive bg-white rounded-2xl p-6 space-y-3 border-emerald-300">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold bg-emerald-600 text-white w-7 h-7 rounded-full flex items-center justify-center shadow-xs">9</span>
                <span className="text-[11px] text-emerald-800 font-bold bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-300">
                  {language === 'en' ? 'Final Output' : 'চূড়ান্ত ফলাফল'}
                </span>
              </div>
              <h4 className="font-bold text-slate-900 text-base">
                {language === 'en' ? 'New Mutation Khatian & Holding' : 'নতুন নামজারি খতিয়ান ও জোত জারি'}
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                {language === 'en'
                  ? 'AC Land order issues new Record of Rights (Khatian) for the buyer and recalculates remaining seller share automatically.'
                  : 'এসি ল্যান্ডের আদেশে ক্রেতার নামে নতুন খতিয়ান সৃষ্টি এবং বিক্রেতার অবশিষ্ট অংশের সঠিক হিস্যা পুনঃনির্ধারণ।'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Interactive Citizen Land Services Gateway (Skiper UI @skiper-ui/skiper40) */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl p-6 sm:p-10 border border-slate-200 shadow-card">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-100 pb-6">
            <div>
              <div className="flex items-center gap-2 text-emerald-700 text-xs font-bold uppercase tracking-wider mb-1.5">
                <Sparkles size={15} />
                <span>{language === 'en' ? 'Interactive Citizen Portal Gateway' : 'ইন্টারেক্টিভ সিটিজেন পোর্টাল গেটওয়ে'}</span>
              </div>
              <h3 className="text-2xl font-extrabold text-slate-900">
                {language === 'en' ? 'Essential Citizen Service Shortcuts' : 'জরুরি নাগরিক সেবা শর্টকাট'}
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                {language === 'en'
                  ? 'One-click direct entry to all verified land governance modules.'
                  : 'এক ক্লিকে আপনার প্রয়োজনীয় ভূমিসেবা ও যাচাইকরণ মডিউলে সরাসরি প্রবেশ করুন।'}
              </p>
            </div>

            <div className="text-left md:text-right text-[11px] text-slate-400">
              <span className="block text-slate-500 font-medium">Design System:</span>
              <a
                href="https://skiper-ui.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-700 hover:text-emerald-800 font-semibold transition"
              >
                Skiper UI (CssLink @skiper-ui/skiper40)
              </a>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-8 text-sm">
            <div className="p-5 rounded-2xl bg-slate-50/70 border border-slate-200 hover:border-emerald-500 hover:bg-white hover:shadow-card transition-all group">
              <span className="text-[11px] font-bold text-emerald-700 block mb-1">
                {language === 'en' ? 'Verification Portal' : 'যাচাইকরণ পোর্টাল'}
              </span>
              <Link001 to="/verify-land" className="text-slate-900 group-hover:text-emerald-700 font-bold text-base">
                {language === 'en' ? 'Accurate Ownership & Plot Audit' : 'মালিকানা ও খতিয়ান নির্ভুল যাচাই'}
              </Link001>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                {language === 'en'
                  ? 'Audit khatian, dag plots, tax dues, and legal restrictions prior to contract signing.'
                  : 'বায়না করার পূর্বে জমির খতিয়ান, দাগ, খাজনা ও আইনি সত্যতা যাচাই করুন।'}
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50/70 border border-slate-200 hover:border-blue-500 hover:bg-white hover:shadow-card transition-all group">
              <span className="text-[11px] font-bold text-blue-700 block mb-1">
                {language === 'en' ? 'Sale & Registry' : 'বিক্রয় ও রেজিস্ট্রেশন'}
              </span>
              <Link002 to="/citizen/sell" className="text-slate-900 group-hover:text-blue-700 font-bold text-base">
                {language === 'en' ? 'Smart Sale Application & Deed Draft' : 'স্মার্ট রেজিস্ট্রেশন ও বিক্রয় আবেদন'}
              </Link002>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                {language === 'en'
                  ? 'Digital Sub-Registry coordination and automated deed drafting.'
                  : 'ডিজিটাল সাব-রেজিস্ট্রি সমন্বয় ও ডিজিটাল খসড়া দলিল প্রস্তুতকরণ।'}
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50/70 border border-slate-200 hover:border-teal-500 hover:bg-white hover:shadow-card transition-all group">
              <span className="text-[11px] font-bold text-teal-700 block mb-1">
                {language === 'en' ? 'Tracking & Hearings' : 'ট্র্যাকিং ও শুনানি'}
              </span>
              <Link003 to="/citizen/sale-applications" className="text-slate-900 group-hover:text-teal-700 font-bold text-base">
                {language === 'en' ? 'Application Progress & Hearing Status' : 'আবেদনের অগ্রগতি ও শুনানি ট্র্যাকিং'}
              </Link003>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                {language === 'en'
                  ? 'Live lifecycle status across Tahsil, Sub-Registry, and AC Land mutation cases.'
                  : 'তহশিল অফিস, সাব-রেজিস্ট্রি এবং এসি ল্যান্ড নামজারি কেসের লাইভ অগ্রগতি।'}
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50/70 border border-slate-200 hover:border-amber-500 hover:bg-white hover:shadow-card transition-all group">
              <span className="text-[11px] font-bold text-amber-700 block mb-1">
                {language === 'en' ? 'Land Tax & Dakhila' : 'খাজনা ও কর সেবা'}
              </span>
              <Link004 to="/citizen/tax" className="text-slate-900 group-hover:text-amber-700 font-bold text-base">
                {language === 'en' ? 'Land Development Tax & E-Dakhila' : 'ভূমি উন্নয়ন কর ও অনলাইন দাখিলা'}
              </Link004>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                {language === 'en'
                  ? 'Calculate annual land tax, pay instantly, and download official digital Dakhila.'
                  : 'হাল সনের ভূমি উন্নয়ন কর পরিশোধ ও ডিজিটাল দাখিলা সংগ্রহ।'}
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50/70 border border-slate-200 hover:border-purple-500 hover:bg-white hover:shadow-card transition-all group">
              <span className="text-[11px] font-bold text-purple-700 block mb-1">
                {language === 'en' ? 'Service Guide' : 'সেবা নির্দেশিকা'}
              </span>
              <Link005 to="/services" className="text-slate-900 group-hover:text-purple-700 font-bold text-base">
                {language === 'en' ? 'Complete Directory of Citizen Land Services' : 'সকল নাগরিক ভূমিসেবার পূর্ণাঙ্গ তালিকা'}
              </Link005>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                {language === 'en'
                  ? 'Detailed workflow, statutory fees calculator, required documents checklist.'
                  : 'ভূমি সেবা, ফি ক্যালকুলেটর, দলিল নমুনা এবং জরুরি নির্দেশনাসমূহ।'}
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50/70 border border-slate-200 hover:border-indigo-500 hover:bg-white hover:shadow-card transition-all group">
              <span className="text-[11px] font-bold text-indigo-700 block mb-1">
                {language === 'en' ? 'Helpdesk & Support' : 'সহায়তা ডেস্ক'}
              </span>
              <Link001 to="/help" className="text-slate-900 group-hover:text-indigo-700 font-bold text-base">
                {language === 'en' ? 'Toll-Free Helpline 16122 & Support' : 'হেল্পলাইন ও হটলাইন ১৬১২২ সহায়তা'}
              </Link001>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                {language === 'en'
                  ? 'Direct government support desk assistance for any land ownership dispute or confusion.'
                  : 'ভূমি বিষয়ক যেকোনো জটিলতায় সরকারি সাপোর্ট সেন্টারের দিকনির্দেশনা।'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Transparency & Citizen Trust Statistics */}
      <section className="py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-center">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-card card-interactive">
            <p className="text-4xl font-extrabold text-emerald-600 font-mono">100%</p>
            <p className="text-xs text-slate-700 mt-2 font-bold">{t('stats.khatian', 'ডিজিটাল খতিয়ান যাচাই', 'Digital Record Verification')}</p>
            <p className="text-[11px] text-slate-500 mt-1">{language === 'en' ? 'Instant OCR & ledger matching' : 'তাৎক্ষণিক খতিয়ান সত্যতা নিরূপণ'}</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-card card-interactive">
            <p className="text-4xl font-extrabold text-teal-600 font-mono">24h</p>
            <p className="text-xs text-slate-700 mt-2 font-bold">{t('stats.hours', 'স্বয়ংক্রিয় কেস রুজু', 'Automated Case Filing')}</p>
            <p className="text-[11px] text-slate-500 mt-1">{language === 'en' ? 'Post-registry auto e-mutation' : 'রেজিস্ট্রেশনের পর তাৎক্ষণিক কেস সৃষ্টি'}</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-card card-interactive">
            <p className="text-4xl font-extrabold text-blue-600 font-mono">4</p>
            <p className="text-xs text-slate-700 mt-2 font-bold">{t('stats.offices', 'একীভূত সমন্বিত সিস্টেম', 'Unified Inter-Office Grid')}</p>
            <p className="text-[11px] text-slate-500 mt-1">{language === 'en' ? 'Tahsil, AC Land, Registry, Admin' : 'তহশিল, এসি ল্যান্ড, সাব-রেজিস্ট্রি, প্রশাসন'}</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-card card-interactive">
            <p className="text-4xl font-extrabold text-emerald-700 font-mono">0%</p>
            <p className="text-xs text-slate-700 mt-2 font-bold">{t('stats.fraud', 'অতিরিক্ত বিক্রির ঝুঁকি', 'Risk of Duplicate Fraud')}</p>
            <p className="text-[11px] text-slate-500 mt-1">{language === 'en' ? 'Hard cryptographic ledger guard' : 'স্বয়ংক্রিয় হিস্যা লক নিরাপত্তা'}</p>
          </div>
        </div>
      </section>

      {/* 6. Citizen Call to Action (CTA.gallery inspired, clean white card with emerald gradient border) */}
      <section className="py-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="relative rounded-3xl bg-gradient-to-b from-white to-slate-50 p-8 sm:p-14 border border-emerald-300 shadow-card-hover text-center space-y-6 overflow-hidden">
          <div className="max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-800 border border-emerald-200 px-3.5 py-1 rounded-full text-xs font-bold">
              <Zap size={14} className="text-emerald-600" />
              <span>{language === 'en' ? 'Join the Digital Land Era' : 'স্মার্ট ল্যান্ড গভর্ন্যান্স'}</span>
            </div>

            <h3 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              {t('cta.title', 'আপনার জমি সংক্রান্ত যেকোনো প্রয়োজনে আজই যুক্ত হোন', 'Experience Seamless Digital Land Governance Today')}
            </h3>

            <p className="text-xs sm:text-sm text-slate-600 max-w-2xl mx-auto leading-relaxed">
              {t(
                'cta.desc',
                'খতিয়ান অনুসন্ধান, ঝুঁকি যাচাই কিংবা বিক্রির আবেদন — সম্পূর্ণ সুরক্ষিত ও ডিজিটাল উপায়ে শুরু করুন।',
                'From khatian lookups and pre-purchase audits to digital registry and automated e-mutation — all in one trusted portal.'
              )}
            </p>

            <div className="pt-3 flex flex-wrap justify-center gap-3">
              <Link
                to="/register"
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-7 py-3.5 rounded-xl text-sm shadow-md hover:shadow-lg transition transform hover:-translate-y-0.5 active:translate-y-0"
              >
                {t('cta.register', 'বিনামূল্যে অ্যাকাউন্ট খুলুন', 'Create Citizen Account')}
              </Link>

              <Link
                to="/login"
                className="bg-white hover:bg-slate-50 text-slate-800 font-semibold border border-slate-300 px-7 py-3.5 rounded-xl text-sm shadow-2xs hover:shadow transition transform hover:-translate-y-0.5 active:translate-y-0"
              >
                {t('cta.login', 'ডেমো লগইন করুন', 'Explore Demo Logins')}
              </Link>
            </div>

            <div className="pt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500 font-medium border-t border-slate-200/80 mt-6">
              <span className="flex items-center gap-1.5">
                <BadgeCheck size={16} className="text-emerald-600" />
                {language === 'en' ? '100% Government Verified' : '১০০% সরকারি ডেটা দ্বারা ভেরিফাইড'}
              </span>
              <span className="flex items-center gap-1.5">
                <Shield size={16} className="text-emerald-600" />
                {language === 'en' ? '256-Bit SSL Encryption' : '২৫৬-বিট এনক্রিপ্টেড নিরাপত্তা'}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock size={16} className="text-emerald-600" />
                {language === 'en' ? '24/7 Digital Processing' : '২৪/৭ সার্বক্ষণিক ডিজিটাল অ্যাক্সেস'}
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
