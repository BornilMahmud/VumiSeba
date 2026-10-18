import React from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import {
  ShieldAlert,
  Lock,
  ServerCrash,
  WifiOff,
  AlertTriangle,
  Home,
  RefreshCw,
  ArrowLeft,
  LogIn,
  LifeBuoy,
  PhoneCall,
  UserCheck,
} from 'lucide-react';

export type ErrorStatusCode = '401' | '403' | '500' | 'network' | 'generic';

interface ErrorPageProps {
  status?: ErrorStatusCode;
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export const ErrorPage: React.FC<ErrorPageProps> = ({
  status: propStatus,
  title: propTitle,
  message: propMessage,
  onRetry,
}) => {
  const { language } = useLanguage();
  const isBn = language === 'bn';
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, switchDemoPersona } = useAuth();

  const queryStatus = (searchParams.get('status') || '').toLowerCase();
  const status: ErrorStatusCode =
    propStatus ||
    (queryStatus === '401'
      ? '401'
      : queryStatus === '403'
      ? '403'
      : queryStatus === '500'
      ? '500'
      : queryStatus === 'network'
      ? 'network'
      : 'generic');

  const handleRetry = () => {
    if (onRetry) {
      onRetry();
    } else {
      window.location.reload();
    }
  };

  const handleGoBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  // State configurations
  const config = {
    '401': {
      code: '401',
      badgeBn: 'লগইন প্রয়োজন',
      badgeEn: 'Authentication Required',
      titleBn: 'অননুমোদিত প্রবেশাধিকার',
      titleEn: 'Unauthorized Access',
      descBn:
        propMessage ||
        'এই পৃষ্ঠা বা সেবাটিতে প্রবেশ করার জন্য আপনাকে প্রথমে সিস্টেমে লগইন করতে হবে। আপনার অ্যাকাউন্ট না থাকলে দ্রুত নিবন্ধন করুন।',
      descEn:
        propMessage ||
        'You need to be logged in to access this page or service. Please log in or create an account to continue.',
      icon: Lock,
      color: 'from-amber-500/20 to-orange-500/20 text-amber-500 border-amber-300 dark:border-amber-700/60',
      iconBg: 'bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400',
    },
    '403': {
      code: '403',
      badgeBn: 'অনুমতি সংরক্ষিত',
      badgeEn: 'Access Forbidden',
      titleBn: 'কার্যক্রম পরিচালনার অনুমতি নেই',
      titleEn: 'Access Restricted',
      descBn:
        propMessage ||
        'আপনার বর্তমান ভূমিকার (Role) জন্য এই সরকারি মডিউল বা নথিপত্রে প্রবেশের অনুমোদন বরাদ্দ নেই। উপযুক্ত কর্মকর্তা একাউন্ট দিয়ে প্রবেশ করুন।',
      descEn:
        propMessage ||
        'Your user account does not possess the requisite administrative or departmental permissions for this resource.',
      icon: ShieldAlert,
      color: 'from-rose-500/20 to-red-500/20 text-rose-500 border-rose-300 dark:border-rose-700/60',
      iconBg: 'bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400',
    },
    '500': {
      code: '500',
      badgeBn: 'সার্ভার ত্রুটি',
      badgeEn: 'Internal Server Error',
      titleBn: 'অভ্যন্তরীণ সার্ভার সমস্যা দেখা দিয়েছে',
      titleEn: 'Internal Server Error',
      descBn:
        propMessage ||
        'আমাদের কেন্দ্রীয় ডেটাবেজ বা অ্যাপ্লিকেশন সার্ভারে একটি অপ্রত্যাশিত প্রযুক্তিগত ত্রুটি ঘটেছে। ইঞ্জিনিয়ারদের অবগত করা হয়েছে।',
      descEn:
        propMessage ||
        'An unexpected technical failure occurred on our application servers. Please try again in a few moments.',
      icon: ServerCrash,
      color: 'from-red-500/20 to-rose-500/20 text-red-500 border-red-300 dark:border-red-700/60',
      iconBg: 'bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400',
    },
    network: {
      code: 'NET',
      badgeBn: 'সংযোগ বিচ্ছিন্ন',
      badgeEn: 'Network Offline',
      titleBn: 'ইন্টারনেট বা সার্ভার সংযোগ অনুপস্থিত',
      titleEn: 'Connection Lost',
      descBn:
        propMessage ||
        'আপনার ডিভাইসের ইন্টারনেট সংযোগ বা আমাদের সার্ভারের সাথে যোগাযোগ স্থাপন করা যাচ্ছে না। অফলাইন ক্যাশে থেকে ডেমো ডেটা প্রদর্শিত হচ্ছে।',
      descEn:
        propMessage ||
        'Unable to communicate with the host servers. Please verify your internet connection or continue in offline demo mode.',
      icon: WifiOff,
      color: 'from-sky-500/20 to-blue-500/20 text-sky-500 border-sky-300 dark:border-sky-700/60',
      iconBg: 'bg-sky-100 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400',
    },
    generic: {
      code: 'ERR',
      badgeBn: 'ত্রুটি পরিলক্ষিত',
      badgeEn: 'Unexpected Error',
      titleBn: propTitle || 'কিছু একটা ঠিকমতো কাজ করছে না',
      titleEn: propTitle || 'Something Went Wrong',
      descBn:
        propMessage ||
        'অনুরোধটি সম্পন্ন করার সময় একটি অপ্রত্যাশিত ত্রুটি ঘটেছে। অনুগ্রহ করে পেজটি পুনরায় লোড করুন অথবা কিছুক্ষণ পর চেষ্টা করুন।',
      descEn:
        propMessage ||
        'An unexpected error occurred while processing your request. Please reload the page or try again shortly.',
      icon: AlertTriangle,
      color: 'from-amber-500/20 to-yellow-500/20 text-amber-500 border-amber-300 dark:border-amber-700/60',
      iconBg: 'bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400',
    },
  }[status];

  const IconComponent = config.icon;

  return (
    <div className={`min-h-[80vh] py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center relative overflow-hidden ${isBn ? 'font-bengali' : 'font-sans'}`}>
      {/* Background radial glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[480px] h-[480px] bg-gradient-to-tr from-slate-200/50 via-slate-100/30 to-transparent dark:from-slate-900/50 dark:via-slate-950/30 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-xl w-full text-center space-y-7 relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-10 shadow-xl">
        {/* Animated Status Icon */}
        <div className="relative inline-flex items-center justify-center mx-auto">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 border border-slate-200 dark:border-slate-700 flex items-center justify-center shadow-inner relative">
            <div className={`w-14 h-14 rounded-2xl ${config.iconBg} flex items-center justify-center shadow-md`}>
              <IconComponent className="w-8 h-8 animate-pulse" />
            </div>
            {/* Status Code Pill */}
            <span className="absolute -bottom-2 -right-2 px-2 py-0.5 rounded-md bg-slate-900 dark:bg-slate-800 text-white border border-slate-700 text-[10px] font-mono font-bold">
              {config.code}
            </span>
          </div>
        </div>

        {/* Headings & Descriptions */}
        <div className="space-y-2.5">
          <span className="inline-block px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold border border-slate-200 dark:border-slate-700">
            {isBn ? config.badgeBn : config.badgeEn}
          </span>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            {isBn ? config.titleBn : config.titleEn}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-md mx-auto">
            {isBn ? config.descBn : config.descEn}
          </p>
        </div>

        {/* 401 & 403 Special Demo Switcher Options */}
        {(status === '401' || status === '403') && (
          <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 text-left space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-slate-800 dark:text-slate-200">
              <span className="flex items-center gap-1.5">
                <UserCheck size={14} className="text-emerald-600 dark:text-emerald-400" />
                <span>{isBn ? 'ডেমো রোল নির্বাচন (১-ক্লিক সুইচ)' : 'Quick Demo Role Switch'}</span>
              </span>
              <span className="text-[10px] text-slate-400 font-normal">
                {user ? (isBn ? `বর্তমান: ${user.role}` : `Current: ${user.role}`) : (isBn ? 'লগইন নেই' : 'Not logged in')}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => switchDemoPersona('seller', 'citizen').then(() => navigate('/citizen/dashboard'))}
                className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-emerald-500 text-left transition cursor-pointer"
              >
                <div className="font-bold text-slate-900 dark:text-white text-[11px]">{isBn ? 'নাগরিক (Citizen)' : 'Citizen'}</div>
                <div className="text-[10px] text-slate-400">{isBn ? 'জমি বিক্রয় ও নামজারি' : 'Seller / Buyer'}</div>
              </button>

              <button
                type="button"
                onClick={() => switchDemoPersona('union_officer', 'union_land_officer').then(() => navigate('/office/union/dashboard'))}
                className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-emerald-500 text-left transition cursor-pointer"
              >
                <div className="font-bold text-slate-900 dark:text-white text-[11px]">{isBn ? 'ইউনিয়ন কর্মকর্তা' : 'Union Officer'}</div>
                <div className="text-[10px] text-slate-400">{isBn ? 'সরেজমিন তদন্ত' : 'Tahsil Review'}</div>
              </button>

              <button
                type="button"
                onClick={() => switchDemoPersona('ac_land', 'ac_land').then(() => navigate('/office/ac-land/dashboard'))}
                className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-emerald-500 text-left transition cursor-pointer"
              >
                <div className="font-bold text-slate-900 dark:text-white text-[11px]">{isBn ? 'এসি ল্যান্ড (AC Land)' : 'AC Land'}</div>
                <div className="text-[10px] text-slate-400">{isBn ? 'অনুমোদন ও শুনানি' : 'Review & Hearing'}</div>
              </button>

              <button
                type="button"
                onClick={() => switchDemoPersona('central_admin', 'central_admin').then(() => navigate('/admin/dashboard'))}
                className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-emerald-500 text-left transition cursor-pointer"
              >
                <div className="font-bold text-slate-900 dark:text-white text-[11px]">{isBn ? 'সুপার এডমিন' : 'Central Admin'}</div>
                <div className="text-[10px] text-slate-400">{isBn ? 'সকল অফিস নিয়ন্ত্রণ' : 'Full Access'}</div>
              </button>
            </div>
          </div>
        )}

        {/* Primary Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          {status === '401' ? (
            <Link
              to="/login"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition active:scale-95 cursor-pointer"
            >
              <LogIn size={15} />
              <span>{isBn ? 'লগইন পেইজে যান' : 'Go to Login'}</span>
            </Link>
          ) : (
            <button
              type="button"
              onClick={handleRetry}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition active:scale-95 cursor-pointer"
            >
              <RefreshCw size={15} />
              <span>{isBn ? 'পুনরায় চেষ্টা করুন' : 'Try Again'}</span>
            </button>
          )}

          <Link
            to="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 font-bold text-xs shadow-xs transition active:scale-95 cursor-pointer"
          >
            <Home size={15} />
            <span>{isBn ? 'হোমপেজে ফিরে যান' : 'Go to Home'}</span>
          </Link>

          <button
            type="button"
            onClick={handleGoBack}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 font-semibold text-xs transition cursor-pointer"
          >
            <ArrowLeft size={15} />
            <span>{isBn ? 'পূর্ববর্তী পৃষ্ঠা' : 'Back'}</span>
          </button>
        </div>

        {/* Helpline Footer */}
        <div className="border-t border-slate-200 dark:border-slate-800 pt-4 flex items-center justify-center gap-2 text-xs text-slate-500 dark:text-slate-400">
          <PhoneCall size={14} className="text-emerald-600 dark:text-emerald-400" />
          <span>{isBn ? 'জরুরি কারিগরি সহায়তায় হেল্পলাইন: ১৬১২২' : 'Technical Support Helpline: 16122'}</span>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;
