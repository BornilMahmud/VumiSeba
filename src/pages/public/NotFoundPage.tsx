import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import {
  Home,
  ArrowLeft,
  Search,
  Compass,
  FileCheck2,
  MapPin,
  FileText,
  LifeBuoy,
  Layers,
  Sparkles,
  PhoneCall,
  ExternalLink,
} from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  const { language } = useLanguage();
  const isBn = language === 'bn';
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search-land?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/search-land');
    }
  };

  const handleGoBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  const quickLinks = [
    {
      titleBn: 'জমি ও খতিয়ান অনুসন্ধান',
      titleEn: 'Land & Khatian Search',
      descBn: 'খতিয়ান, দাগ ও মৌজা নম্বর দিয়ে জমির রেকর্ড যাচাই করুন',
      descEn: 'Search land records by khatian, plot and mouza',
      path: '/search-land',
      icon: Search,
      color: 'from-blue-500/10 to-indigo-500/10 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-900/60',
    },
    {
      titleBn: 'কেনার আগে জমি যাচাই',
      titleEn: 'Verify Land Before Buying',
      descBn: 'ডাবল সেল, নিষেধাজ্ঞা ও মর্টগেজ ঝুঁকি প্রি-চেক করুন',
      descEn: 'Pre-check double-sale, injunctions and mortgage risks',
      path: '/verify-land',
      icon: FileCheck2,
      color: 'from-emerald-500/10 to-teal-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/60',
    },
    {
      titleBn: 'সকল ডিজিটাল সেবাসমূহ',
      titleEn: 'All Digital Services',
      descBn: 'নামজারি, খাজনা পরিশোধ ও ডিজিটাল দলিলের তালিকা',
      descEn: 'Explore e-mutation, land development tax & deeds',
      path: '/services',
      icon: Layers,
      color: 'from-purple-500/10 to-pink-500/10 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-900/60',
    },
    {
      titleBn: 'সহায়তা ও সাধারণ জিজ্ঞাসা',
      titleEn: 'Help & Knowledge Base',
      descBn: 'ভূমিসেবায় আবেদন ও সেবা গ্রহণ নির্দেশিকা',
      descEn: 'Guides and FAQs for citizen land workflows',
      path: '/help',
      icon: LifeBuoy,
      color: 'from-amber-500/10 to-orange-500/10 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-900/60',
    },
  ];

  return (
    <div className={`min-h-[calc(100vh-80px)] w-full py-10 sm:py-16 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center relative overflow-hidden ${isBn ? 'font-bengali' : 'font-sans'}`}>
      {/* Background Decorative Glow Gradients */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-gradient-to-tr from-emerald-500/15 via-teal-500/10 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-5xl w-full text-center space-y-8 relative">
        {/* Animated Digital Land Survey 404 Visual - Box removed, Big Hero Number */}
        <div className="relative inline-flex items-center justify-center mx-auto select-none my-2 sm:my-4">
          {/* Concentric Pulsing Radar Rings extending across */}
          <div className="absolute w-72 h-72 sm:w-96 sm:h-96 md:w-[30rem] md:h-[30rem] rounded-full border border-emerald-500/20 dark:border-emerald-500/20 animate-ping opacity-25 pointer-events-none" />
          <div className="absolute w-56 h-56 sm:w-72 sm:h-72 md:w-[22rem] md:h-[22rem] rounded-full border border-teal-500/25 dark:border-teal-500/30 animate-pulse pointer-events-none" />

          {/* Giant 404 Hero Number Display without enclosing box */}
          <div className="relative flex items-center justify-center font-mono font-black text-8xl sm:text-9xl md:text-[11rem] lg:text-[13rem] tracking-tighter leading-none">
            <span className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 dark:from-white dark:via-slate-100 dark:to-slate-300 bg-clip-text text-transparent drop-shadow-sm">
              4
            </span>

            {/* Glowing Center Zero with Integrated Compass */}
            <div className="relative inline-flex items-center justify-center mx-1 sm:mx-3">
              <span className="bg-gradient-to-r from-emerald-600 via-teal-500 to-cyan-600 bg-clip-text text-transparent">
                0
              </span>
              <Compass
                className="absolute inset-0 m-auto w-10 h-10 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 text-emerald-600/80 dark:text-emerald-400/90 animate-[spin_16s_linear_infinite]"
                strokeWidth={1.75}
              />
            </div>

            <span className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 dark:from-white dark:via-slate-100 dark:to-slate-300 bg-clip-text text-transparent drop-shadow-sm">
              4
            </span>
          </div>

          {/* Floating Context Badges */}
          <div className="absolute -top-2 -right-4 sm:-right-8 bg-emerald-600 text-white text-[11px] sm:text-xs font-mono font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1.5 border border-emerald-400/40 animate-bounce">
            <MapPin size={13} />
            <span>{isBn ? 'দাগ অপসারিত' : 'Plot Unmapped'}</span>
          </div>

          <div className="absolute -bottom-2 -left-4 sm:-left-8 bg-slate-900/90 dark:bg-slate-800/95 text-slate-200 text-[10px] sm:text-xs font-mono px-3 py-1.5 rounded-full shadow-lg border border-slate-700/60 backdrop-blur-md">
            <span>23.8103° N, 90.4125° E</span>
          </div>
        </div>

        {/* Heading & Friendly Explanations */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/80 text-emerald-700 dark:text-emerald-400 text-xs font-semibold">
            <Sparkles size={13} />
            <span>{isBn ? '৪০৪ ত্রুটি — পৃষ্ঠাটি পাওয়া যায়নি' : 'HTTP 404 — Route Not Found'}</span>
          </div>

          <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {isBn ? 'দুঃখিত! পৃষ্ঠাটি খুঁজে পাওয়া যায়নি' : 'Oops! Page Not Found'}
          </h1>

          <p className="max-w-2xl mx-auto text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
            {isBn
              ? 'আপনি যে পৃষ্ঠাটি খুঁজছেন তা স্থানান্তরিত হয়েছে, মুছে ফেলা হয়েছে অথবা ভুল ইউআরএল (URL) টাইপ করা হয়েছে।'
              : "The page you are looking for doesn't exist, may have been relocated, or the URL was mistyped."}
          </p>

          {location.pathname && location.pathname !== '/' && (
            <p className="text-xs font-mono text-slate-400 dark:text-slate-500">
              {isBn ? 'অনুরোধকৃত পথ:' : 'Requested path:'} <span className="bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-slate-700 dark:text-slate-300">{location.pathname}</span>
            </p>
          )}
        </div>

        {/* Search Field */}
        <div className="max-w-lg mx-auto">
          <form onSubmit={handleSearch} className="relative flex items-center">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isBn ? 'খতিয়ান, দাগ, মৌজা বা সেবা খুঁজুন...' : 'Search by Khatian, Dag, Mouza, or service...'}
              className="w-full pl-10 pr-24 py-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-xs sm:text-sm shadow-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400 transition"
            />
            <button
              type="submit"
              className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition shadow-xs cursor-pointer"
            >
              {isBn ? 'অনুসন্ধান' : 'Search'}
            </button>
          </form>
        </div>

        {/* Action Buttons: Home & Go Back */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-emerald-900/20 hover:shadow-emerald-900/30 transition active:scale-95 cursor-pointer"
          >
            <Home size={16} />
            <span>{isBn ? 'হোমপেজে ফিরে যান' : 'Go Back Home'}</span>
          </Link>

          <button
            type="button"
            onClick={handleGoBack}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 font-bold text-xs sm:text-sm shadow-xs transition active:scale-95 cursor-pointer"
          >
            <ArrowLeft size={16} />
            <span>{isBn ? 'পূর্ববর্তী পৃষ্ঠায় ফিরে যান' : 'Go Back'}</span>
          </button>
        </div>

        {/* Helpful Quick Navigation Cards */}
        <div className="pt-8 border-t border-slate-200 dark:border-slate-800">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
            {isBn ? 'জনপ্রিয় সেবা ও লিঙ্কসমূহ' : 'Popular Services & Quick Links'}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-left">
            {quickLinks.map((item, idx) => {
              const IconComp = item.icon;
              return (
                <Link
                  key={idx}
                  to={item.path}
                  className="group p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-300 dark:hover:border-emerald-700 shadow-2xs hover:shadow-md transition duration-200 flex flex-col justify-between"
                >
                  <div>
                    <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                      <IconComp size={18} />
                    </div>
                    <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors mb-1">
                      {isBn ? item.titleBn : item.titleEn}
                    </h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
                      {isBn ? item.descBn : item.descEn}
                    </p>
                  </div>
                  <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                    <span>{isBn ? 'প্রবেশ করুন' : 'Open'}</span>
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Support & Helpline Card */}
        <div className="bg-slate-100 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600 dark:text-slate-400">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <PhoneCall size={16} />
            </div>
            <div>
              <p className="font-bold text-slate-900 dark:text-white">
                {isBn ? 'ভূমি সেবা কল সেন্টার হেল্পলাইন' : 'Land Service Helpline'}
              </p>
              <p className="text-[11px]">
                {isBn ? 'যে কোনো ভূমি সংক্রান্ত তথ্যের জন্য কল করুন ১৬১২২ (টোল ফ্রি)' : 'Call 16122 toll-free for land assistance'}
              </p>
            </div>
          </div>
          <Link
            to="/help"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-xs hover:bg-slate-50 dark:hover:bg-slate-700 transition"
          >
            <span>{isBn ? 'হেল্প ডেস্ক' : 'Help Desk'}</span>
            <ExternalLink size={12} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
