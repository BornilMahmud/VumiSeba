import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import {
  ArrowRight,
  ArrowLeft,
  Home,
  CheckCircle2,
  ShieldCheck,
  ShieldAlert,
  Scale,
  FileText,
  Building2,
  User,
  UserCheck,
  Cpu,
  Receipt,
  Landmark,
  MapPin,
  Footprints,
  Zap,
  Award,
  Sparkles,
  Search,
  ChevronRight,
} from 'lucide-react';

export const HowItWorksPage: React.FC = () => {
  const { language } = useLanguage();
  const isBn = language === 'bn';
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState<'all' | 'phase1' | 'phase2' | 'phase3'>('all');

  const phases = [
    {
      id: 'phase1',
      title: isBn ? 'পর্যায় ১: অনুসন্ধান ও স্বয়ংক্রিয় ঝুঁকি নিরোধ' : 'Phase 1: Search & Automated Risk Audit',
      subtitle: isBn ? 'বায়নার আগেই খতিয়ানের সঠিকতা ও আইনি সতর্কতা নিশ্চিতকরণ' : 'Verify land records and legal caveats before earnest deposit',
      stepsCount: isBn ? 'ধাপ ১ - ৩' : 'Steps 1 - 3',
      color: 'emerald',
    },
    {
      id: 'phase2',
      title: isBn ? 'পর্যায় ২: ডিজিটাল আবেদন ও সরকারি মাঠ তদন্ত' : 'Phase 2: Digital Filing & Field Verification',
      subtitle: isBn ? 'সহ-শরিকদের সম্মতি, শারীরিক দখল ও সীমানা তদন্ত' : 'Validate co-sharer equity, physical possession, and boundary check',
      stepsCount: isBn ? 'ধাপ ৪ - ৬' : 'Steps 4 - 6',
      color: 'teal',
    },
    {
      id: 'phase3',
      title: isBn ? 'পর্যায় ৩: সাব-রেজিস্ট্রি দলিল ও অটো ই-নামজারি' : 'Phase 3: Deed Registry & Instant Auto-Mutation',
      subtitle: isBn ? 'বায়োমেট্রিক দলিল সম্পাদন ও সরাসরি নতুন খতিয়ান মঞ্জুর' : 'Biometric deed registration linked to automated AC Land e-mutation docket',
      stepsCount: isBn ? 'ধাপ ৭ - ৯' : 'Steps 7 - 9',
      color: 'cyan',
    },
  ];

  const steps = [
    {
      step: isBn ? '১' : '1',
      phaseId: 'phase1',
      phaseNum: 1,
      icon: Search,
      title: isBn ? 'খতিয়ান ও দাগ অনুসন্ধান' : 'Khatian & Dag Plot Search',
      actor: isBn ? 'নাগরিক (ক্রেতা/বিক্রেতা)' : 'Citizen (Buyer/Seller)',
      actorRole: 'citizen',
      actorIcon: User,
      desc: isBn
        ? 'নাগরিক পোর্টাল থেকে জেলা, উপজেলা, মৌজা ও দাগ নম্বর দিয়ে সরকারি রেকর্ডরুমের সংরক্ষিত আর.এস বা বি.এস খতিয়ানের তথ্য খুঁজে বের করেন।'
        : 'Citizens query the official land database by district, upazila, mouza, and plot number to locate verified R.S./B.S. Khatians directly from government archives.',
      highlights: isBn
        ? ['ডিজিটাল খতিয়ান রেকর্ড', 'দাগের অবস্থান নিশ্চিতকরণ', 'মৌজা ভিত্তিক অনুসন্ধান']
        : ['Digital Khatian Record', 'Plot Verification', 'Mouza-level Query'],
    },
    {
      step: isBn ? '২' : '2',
      phaseId: 'phase1',
      phaseNum: 1,
      icon: ShieldAlert,
      title: isBn ? 'প্রাক-বায়না ঝুঁকি পরীক্ষা (P5)' : 'Pre-Purchase Risk Audit (P5)',
      actor: isBn ? 'ভূমিসাথী অটোমেটেড ইঞ্জিন' : 'VumiSeba Automated Engine',
      actorRole: 'engine',
      actorIcon: Cpu,
      desc: isBn
        ? 'বিক্রেতার এনআইডি ও রেকর্ডীয় অংশ যাচাই করা হয়। বিক্রেতা নিজের হিস্যার বেশি বিক্রির চেষ্টা করছেন কি না, জমিতে কোনো মামলা বা ব্যাংক লিয়েন রয়েছে কি না তা তাৎক্ষণিক পরীক্ষা করা হয়।'
        : 'System automatically verifies seller ownership shares, duplicate sale flags, court litigation caveats, and undisclosed bank mortgages with instant 0-100 score.',
      highlights: isBn
        ? ['আদালতের নিষেধাজ্ঞা ফিল্টার', 'অতিরিক্ত বিক্রয় প্রতিরোধ (10,000 BPS)', 'খাস ও ভিপি জমি স্ক্রিনিং']
        : ['Court Injunction Alert', 'Over-share Protection (10,000 BPS)', 'Khas & VP Land Screening'],
    },
    {
      step: isBn ? '৩' : '3',
      phaseId: 'phase1',
      phaseNum: 1,
      icon: Receipt,
      title: isBn ? 'ভূমি উন্নয়ন কর (খাজনা) নিষ্পত্তি' : 'Land Tax (Khajna) Clearance',
      actor: isBn ? 'বিক্রেতা / ইউনিয়ন ভূমি অফিস' : 'Seller / Union Land Office',
      actorRole: 'tax',
      actorIcon: Landmark,
      desc: isBn
        ? 'জমির হোল্ডিংয়ের বকেয়া কর অনলাইনে পরিশোধ করতে হয়। কর বকেয়া থাকলে সিস্টেমটি পরবর্তী কোনো বিক্রয় আবেদন গ্রহণ করবে না (সার্ভার গার্ড)।'
        : 'Holding taxes must be cleared online. Server-side validation hard-blocks any transaction file submission if revenue dues remain unpaid.',
      highlights: isBn
        ? ['অনলাইন খাজনা দাখিলা', 'সার্ভার-সাইড হার্ড গার্ড', 'তাৎক্ষণিক ই-পেমেন্ট']
        : ['Online Dakhila Receipt', 'Server-Side Hard Guard', 'Instant e-Payment'],
    },
    {
      step: isBn ? '৪' : '4',
      phaseId: 'phase2',
      phaseNum: 2,
      icon: FileText,
      title: isBn ? 'জমি বিক্রির অনলাইন আবেদন দাখিল' : 'Online Land Sale Filing (P4)',
      actor: isBn ? 'বিক্রেতা' : 'Seller',
      actorRole: 'citizen',
      actorIcon: UserCheck,
      desc: isBn
        ? 'ক্রেতার ইউনিক সিটিজেন আইডি, হস্তান্তরযোগ্য জমির সঠিক হিস্যা ও পণমূল্য উল্লেখ করে সিস্টেমে আনুষ্ঠানিক ফাইল তৈরি করা হয়।'
        : 'The seller initiates an official deed application with buyer Unique Citizen ID, verified plot shares, and agreement consideration.',
      highlights: isBn
        ? ['স্মার্ট ফর্ম সাবমিশন', 'স্বয়ংক্রিয় হিস্যা রিজার্ভেশন', 'ডিজিটাল ড্রাফট']
        : ['Smart Deed Initiation', 'Automatic Share Reservation', 'Digital Draft'],
    },
    {
      step: isBn ? '৫' : '5',
      phaseId: 'phase2',
      phaseNum: 2,
      icon: Building2,
      title: isBn ? 'কেন্দ্রীয় ও সহকারী কমিশনার পর্যালোচনা' : 'Administrative Scrutiny & Cross-Check',
      actor: isBn ? 'ভূমি প্রশাসন কর্মকর্তা' : 'Land Revenue Officer',
      actorRole: 'admin',
      actorIcon: Building2,
      desc: isBn
        ? 'দাখিলকৃত ফাইলের প্রাথমিক বৈধতা, ডুপ্লিকেট বিক্রয়ের আশঙ্কা ও যৌথ শরিকের হিস্যা যাচাই করে পরবর্তী মাঠ তদন্তের জন্য প্রেরণ করা হয়।'
        : 'Preliminary validation ensures co-sharer equity and authenticity before forwarding the case for on-ground verification.',
      highlights: isBn
        ? ['সহ-শরিকদের অধিকার সুরক্ষা', 'ডুপ্লিকেট বিক্রয় স্ক্রিনিং', 'প্রশাসনিক ছাড়পত্র']
        : ['Co-sharer Equity Shield', 'Duplicate Sale Screening', 'Administrative Docket'],
    },
    {
      step: isBn ? '৬' : '6',
      phaseId: 'phase2',
      phaseNum: 2,
      icon: MapPin,
      title: isBn ? 'ইউনিয়ন ভূমি অফিসের সরেজমিন তদন্ত' : 'Union Field Verification & Report',
      actor: isBn ? 'ইউনিয়ন ভূমি সহকারী কর্মকর্তা (ULAO)' : 'Union Land Assistant Officer (ULAO)',
      actorRole: 'officer',
      actorIcon: Footprints,
      desc: isBn
        ? 'তহশিলদার সরেজমিনে গিয়ে শারীরিক দখল, সীমানা বিরোধ ও সহ-শরিকদের সম্মতি পর্যবেক্ষণ করে ডিজিটাল তদন্ত রিপোর্ট জমা দেন।'
        : 'The Tahsildar physically visits the plot to assess actual possession, boundary markers, and co-sharer status.',
      highlights: isBn
        ? ['শারীরিক দখল নিরীক্ষা', 'ডিজিটাল ফিল্ড রিপোর্ট', 'চৌহদ্দি নির্ধারণ']
        : ['Physical Possession Audit', 'Digital Field Report', 'Boundary Verification'],
    },
    {
      step: isBn ? '৭' : '7',
      phaseId: 'phase3',
      phaseNum: 3,
      icon: Scale,
      title: isBn ? 'সাব-রেজিস্ট্রি অফিসে দলিল নিবন্ধন (P4)' : 'Deed Registration at Sub-Registry (P4)',
      actor: isBn ? 'সাব-রেজিস্ট্রার ও উভয় পক্ষ' : 'Sub-Registrar & Parties',
      actorRole: 'registry',
      actorIcon: Scale,
      desc: isBn
        ? 'নির্ধারিত অ্যাপয়েন্টমেন্টে সাব-রেজিস্ট্রি অফিসে উপস্থিত হয়ে দলিল সম্পাদন করা হয়। কর্মকর্তা নিবন্ধন সম্পন্ন হিসেবে এন্ট্রি দিয়ে সিরিয়াল নং ইস্যু করেন।'
        : 'Parties attend booked appointment at Sub-Registry office; deed is verified, biometrics captured, and registration deed number issued.',
      highlights: isBn
        ? ['বায়োমেট্রিক উপস্থিতি', 'আইনি দলিল সম্পাদন', 'স্বত্ব হস্তান্তর লক']
        : ['Biometric Execution', 'Deed Serial Issuance', 'Ownership Lock'],
    },
    {
      step: isBn ? '৮' : '8',
      phaseId: 'phase3',
      phaseNum: 3,
      icon: Zap,
      title: isBn ? 'স্বয়ংক্রিয় ই-নামজারি কেস ও নোটিশ' : 'Automated e-Mutation Case & Notice',
      actor: isBn ? 'উপজেলা ভূমি অফিস / এসি ল্যান্ড' : 'Upazila Land Office / AC Land',
      actorRole: 'engine',
      actorIcon: Sparkles,
      desc: isBn
        ? 'দলিল নিবন্ধন হওয়া মাত্রই কোনো পৃথক আবেদন ছাড়াই সহকারী কমিশনার (ভূমি) অফিসে নামজারি মোকদ্দমা শুরু হয় এবং শুনানির নোটিশ জারি হয়।'
        : 'Deed registration immediately auto-triggers an e-mutation case at the AC Land office without requiring separate citizen application.',
      highlights: isBn
        ? ['জিরো-টাচ অটো-ট্রিগার', 'স্বয়ংক্রিয় শুনানি নোটিশ', 'আন্তঃদফতর ডেটা সিঙ্ক']
        : ['Zero-touch Auto Trigger', 'Automatic Hearing Notice', 'Inter-office Sync'],
    },
    {
      step: isBn ? '৯' : '9',
      phaseId: 'phase3',
      phaseNum: 3,
      icon: Award,
      title: isBn ? 'নতুন নামজারি খতিয়ান ও জোত সৃষ্টি' : 'New Mutation Record & Holding Issuance',
      actor: isBn ? 'এসি ল্যান্ড ও রেকর্ডরুম' : 'AC Land & Record Room',
      actorRole: 'admin',
      actorIcon: CheckCircle2,
      desc: isBn
        ? 'শুনানি ও নথি যাচাই শেষে এসি ল্যান্ডের আদেশে ক্রেতার নামে নতুন খতিয়ান মঞ্জুর হয় এবং বিক্রেতার অবশিষ্ট হিস্যা স্বয়ংক্রিয়ভাবে সমন্বয় করা হয়।'
        : 'AC Land approves mutation order; new Khatian is published in citizen portal, and seller record is automatically adjusted.',
      highlights: isBn
        ? ['ডিজিটাল রেকর্ড আপডেট', 'কিউআর খতিয়ান ডাউনলোড', 'চূড়ান্ত জোত সৃষ্টি']
        : ['Digital Ledger Adjustment', 'Instant QR Khatian', 'Final Holding Ledger'],
    },
  ];

  const getActorBadge = (role: string, actor: string, ActorIcon: React.ElementType) => {
    const styleMap: Record<string, { bg: string; text: string; border: string; dot: string; glow: string }> = {
      citizen: {
        bg: 'bg-emerald-500/10 dark:bg-emerald-500/15',
        text: 'text-emerald-700 dark:text-emerald-300',
        border: 'border-emerald-500/20 dark:border-emerald-400/30',
        dot: 'bg-emerald-500',
        glow: 'shadow-emerald-500/10',
      },
      engine: {
        bg: 'bg-indigo-500/10 dark:bg-indigo-500/15',
        text: 'text-indigo-700 dark:text-indigo-300',
        border: 'border-indigo-500/20 dark:border-indigo-400/30',
        dot: 'bg-indigo-500',
        glow: 'shadow-indigo-500/10',
      },
      tax: {
        bg: 'bg-amber-500/10 dark:bg-amber-500/15',
        text: 'text-amber-800 dark:text-amber-300',
        border: 'border-amber-500/20 dark:border-amber-400/30',
        dot: 'bg-amber-500',
        glow: 'shadow-amber-500/10',
      },
      admin: {
        bg: 'bg-blue-500/10 dark:bg-blue-500/15',
        text: 'text-blue-700 dark:text-blue-300',
        border: 'border-blue-500/20 dark:border-blue-400/30',
        dot: 'bg-blue-500',
        glow: 'shadow-blue-500/10',
      },
      officer: {
        bg: 'bg-teal-500/10 dark:bg-teal-500/15',
        text: 'text-teal-700 dark:text-teal-300',
        border: 'border-teal-500/20 dark:border-teal-400/30',
        dot: 'bg-teal-500',
        glow: 'shadow-teal-500/10',
      },
      registry: {
        bg: 'bg-purple-500/10 dark:bg-purple-500/15',
        text: 'text-purple-700 dark:text-purple-300',
        border: 'border-purple-500/20 dark:border-purple-400/30',
        dot: 'bg-purple-500',
        glow: 'shadow-purple-500/10',
      },
    };

    const s = styleMap[role] || styleMap.citizen;

    return (
      <div
        className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium ${s.bg} ${s.text} border ${s.border} shadow-sm ${s.glow} backdrop-blur-md transition-all duration-300 hover:scale-[1.02]`}
      >
        <span className="relative flex h-2 w-2 shrink-0">
          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${s.dot} opacity-75`} />
          <span className={`relative inline-flex rounded-full h-2 w-2 ${s.dot}`} />
        </span>
        <ActorIcon size={13} className="shrink-0 opacity-85" />
        <span className="font-semibold text-[11px] uppercase tracking-wider opacity-70">
          {isBn ? 'দায়িত্ব' : 'Role'}:
        </span>
        <span className="font-medium text-[11px] sm:text-xs">{actor}</span>
      </div>
    );
  };

  const filteredSteps = steps.filter((s) => {
    if (activeFilter === 'all') return true;
    return s.phaseId === activeFilter;
  });

  return (
    <div
      className={`${
        isBn ? 'font-bengali' : 'font-sans'
      } relative min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 py-8 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto transition-colors`}
    >
      {/* Ambient background glows for fluid, organic depth */}
      <div className="absolute top-12 left-1/4 w-80 h-80 bg-emerald-400/15 dark:bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-cyan-400/15 dark:bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-teal-400/15 dark:bg-teal-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Top Header & Breadcrumb Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-8">
        <button
          onClick={() => {
            if (window.history.length > 1) {
              navigate(-1);
            } else {
              navigate('/');
            }
          }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold bg-white/80 dark:bg-slate-900/80 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-slate-800/80 shadow-xs backdrop-blur-sm transition-all duration-200 hover:-translate-x-0.5 cursor-pointer"
        >
          <ArrowLeft size={14} className="text-emerald-700 dark:text-emerald-400" />
          <span>{isBn ? 'পূর্ববর্তী পৃষ্ঠায় ফিরে যান' : 'Back'}</span>
        </button>

        <div className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
          <Link
            to="/"
            className="inline-flex items-center gap-1 hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors"
          >
            <Home size={13} />
            <span>{isBn ? 'হোমপেজ' : 'Home'}</span>
          </Link>
          <ChevronRight size={12} className="opacity-60" />
          <span className="text-emerald-700 dark:text-emerald-400 font-semibold">
            {isBn ? 'কীভাবে কাজ করে' : 'How It Works'}
          </span>
        </div>
      </div>

      {/* Main Title Section */}
      <div className="text-center mb-10 space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-cyan-500/10 text-emerald-800 dark:text-emerald-300 border border-emerald-500/20 dark:border-emerald-500/30 shadow-xs backdrop-blur-sm">
          <Sparkles size={14} className="text-emerald-600 dark:text-emerald-400 animate-spin-slow" />
          <span>{isBn ? 'সমন্বিত ল্যান্ডটেক কর্মপরিকল্পনা' : 'Unified LandTech Workflow'}</span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          {isBn ? 'কীভাবে কাজ করে ভূমিসাথী?' : 'How Does VumiSeba Work?'}
        </h1>

        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
          {isBn
            ? 'জমি অনুসন্ধান থেকে শুরু করে প্রাক-ক্রয় ঝুঁকি নিরোধ, রাজস্ব কর পরিশোধ, আইনি দলিল নিবন্ধন এবং স্বয়ংক্রিয় ই-নামজারি—প্রতিটি ধাপের পূর্ণাঙ্গ রোডম্যাপ।'
            : 'From initial Khatian search and pre-purchase risk audit to online tax payment, biometric deed registration, and automated zero-touch e-mutation.'}
        </p>

        {/* Phase Filter Pills (Sleek, rounded-full, interactive) */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-3">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-4 py-2 rounded-full text-xs font-semibold transition-all duration-200 cursor-pointer ${
              activeFilter === 'all'
                ? 'bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow-md shadow-emerald-600/25 scale-105'
                : 'bg-white/80 dark:bg-slate-900/80 text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            {isBn ? 'সবগুলো ধাপ (৯টি ধাপ)' : 'All 9 Steps'}
          </button>

          {phases.map((p) => (
            <button
              key={p.id}
              onClick={() => setActiveFilter(p.id as any)}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition-all duration-200 cursor-pointer ${
                activeFilter === p.id
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow-md shadow-emerald-600/25 scale-105'
                  : 'bg-white/80 dark:bg-slate-900/80 text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <span>{p.stepsCount}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Flowing Connected Timeline with mathematically centered vertical spine */}
      <div className="relative space-y-8 before:absolute before:top-4 before:bottom-4 before:left-5 sm:before:left-6 before:-translate-x-1/2 before:w-0.5 before:bg-gradient-to-b before:from-emerald-500 before:via-teal-500 before:to-cyan-600">
        {filteredSteps.map((s, idx) => {
          const StepIcon = s.icon;
          const isPhaseStart = idx === 0 || filteredSteps[idx - 1].phaseId !== s.phaseId;
          const phaseMeta = phases.find((p) => p.id === s.phaseId);

          return (
            <div key={idx} className="relative space-y-4">
              {/* Phase Milestone Marker centered with timeline axis */}
              {isPhaseStart && phaseMeta && activeFilter === 'all' && (
                <div className="relative pt-4 pb-1">
                  <div className="inline-flex items-center gap-2 pl-4 sm:pl-5 pr-4 py-1.5 rounded-full text-xs font-bold bg-white/95 dark:bg-slate-900/95 text-emerald-800 dark:text-emerald-300 border border-emerald-500/30 backdrop-blur-md shadow-xs relative z-10">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                    <span>{phaseMeta.title}</span>
                    <span className="text-[10px] font-semibold opacity-70">({phaseMeta.stepsCount})</span>
                  </div>
                </div>
              )}

              {/* Step Card with Organic Curves (rounded-3xl, no boxy feel) */}
              <div className="relative flex items-start gap-4 sm:gap-6 group">
                {/* Timeline Step Orb (Strictly centered on the vertical line axis) */}
                <div className="relative z-10 flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-700 text-white font-extrabold text-sm sm:text-base shadow-lg shadow-emerald-600/30 ring-4 ring-slate-50 dark:ring-slate-950 shrink-0 group-hover:scale-110 transition-transform duration-300">
                  <span>{s.step}</span>
                </div>

                {/* Content Card */}
                <div className="flex-1 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-3xl p-6 sm:p-7 border border-slate-200/80 dark:border-slate-800/80 shadow-sm hover:shadow-xl hover:border-emerald-500/40 dark:hover:border-emerald-500/40 transition-all duration-300 group-hover:-translate-y-0.5 space-y-4">
                  {/* Top Bar: Title & Pill Badge */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-2xl bg-emerald-500/10 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/20">
                        <StepIcon size={18} />
                      </div>
                      <h3 className="font-extrabold text-slate-900 dark:text-white text-base sm:text-lg tracking-tight">
                        {s.title}
                      </h3>
                    </div>

                    {/* Smooth Pill Badge */}
                    <div className="shrink-0">
                      {getActorBadge(s.actorRole, s.actor, s.actorIcon)}
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                    {s.desc}
                  </p>

                  {/* Micro Highlight Chips (Pill shaped, non-boxy) */}
                  <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-100 dark:border-slate-800/80">
                    {s.highlights.map((h, hIdx) => (
                      <span
                        key={hIdx}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-medium bg-slate-100/80 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700/60 transition-colors hover:border-emerald-500/30"
                      >
                        <CheckCircle2 size={11} className="text-emerald-600 dark:text-emerald-400" />
                        <span>{h}</span>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom CTA Card with Ultra-smooth Curves */}
      <div className="mt-14 relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-600 via-teal-700 to-cyan-800 text-white p-8 sm:p-12 shadow-xl shadow-teal-900/20 text-center">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-400/15 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 max-w-xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold bg-white/20 backdrop-blur-md border border-white/30 text-white">
            <ShieldCheck size={14} className="text-yellow-300" />
            <span>{isBn ? 'শতভাগ নিরাপদ প্ল্যাটফর্ম' : '100% Verified Platform'}</span>
          </div>

          <h3 className="text-xl sm:text-3xl font-extrabold tracking-tight">
            {isBn ? 'আপনি কি জমি কেনার কথা ভাবছেন?' : 'Planning to Purchase Land in Bangladesh?'}
          </h3>

          <p className="text-xs sm:text-sm text-emerald-100 leading-relaxed font-normal">
            {isBn
              ? 'বায়না করার আগে নিশ্চিত হয়ে নিন জমিটির হিস্যা, খাজনা ও রেকর্ডীয় কাগজপত্র শতভাগ সঠিক কি না। ভূমিসাথী দিয়ে মুহূর্তেই যাচাই করুন।'
              : 'Audit recorded ownership shares, tax liabilities, and court dispute caveats in 60 seconds before paying earnest money.'}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              to="/verify-land"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white text-emerald-800 hover:bg-emerald-50 font-bold px-7 py-3.5 rounded-full text-sm shadow-md hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5 cursor-pointer"
            >
              <span>{isBn ? 'এখনই জমি যাচাই করুন' : 'Verify Land Now'}</span>
              <ArrowRight size={16} />
            </Link>

            <Link
              to="/"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold px-6 py-3.5 rounded-full text-sm border border-white/25 backdrop-blur-md transition-all duration-200 cursor-pointer"
            >
              <Home size={15} />
              <span>{isBn ? 'হোমপেজে ফিরে যান' : 'Back to Home'}</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowItWorksPage;

