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
} from 'lucide-react';
import {
  Link001,
  Link002,
  Link003,
  Link004,
  Link005,
} from '@/components/ui/skiper-ui/skiper40';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
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

  return (
    <div className="font-bengali text-slate-900 bg-slate-50">
      {/* 1. Hero Section */}
      <section className="relative bg-gradient-to-b from-gov-navy to-slate-900 text-white pt-12 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#1e3a8a_1px,transparent_1px)] [background-size:16px_16px] opacity-20"></div>

        <div className="relative max-w-5xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 bg-teal-500/20 text-teal-300 border border-teal-500/30 px-3.5 py-1 rounded-full text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-teal-400 animate-ping"></span>
            জাতীয় ল্যান্ডটেক প্ল্যাটফর্ম — P5 ও P4 এর ডিজিটাল মেলবন্ধন
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
            জমি কেনা থেকে নামজারি — <br className="hidden sm:inline" />
            <span className="text-teal-400">এক ক্লিকে নির্ভুল যাচাই</span> ও স্মার্ট রেজিস্ট্রি
          </h1>

          <p className="max-w-3xl mx-auto text-sm sm:text-base text-slate-300 leading-relaxed font-light">
            বায়না করার আগেই মালিকানার সত্যতা, খতিয়ান ও দাগের বৈধতা, বকেয়া খাজনা এবং আদালতের মোকদ্দমা যাচাই করুন।
            দলিল নিবন্ধনের পর স্বয়ংক্রিয়ভাবে শুরু হবে আপনার ই-নামজারি ও নতুন খতিয়ান জারির প্রক্রিয়া।
          </p>

          {/* Quick Action Pills */}
          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <Link
              to="/verify-land"
              className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-500 text-white px-5 py-2.5 rounded-lg font-semibold text-sm shadow-lg transition"
            >
              <ShieldCheck size={18} />
              <span>কেনার আগে জমি যাচাই করুন</span>
            </Link>
            <Link
              to="/citizen/sell"
              className="inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 px-5 py-2.5 rounded-lg font-semibold text-sm transition"
            >
              <FileText size={18} />
              <span>জমি বিক্রির আবেদন</span>
            </Link>
          </div>
        </div>

        {/* Quick Khatian & Dag Search Box */}
        <div className="relative max-w-4xl mx-auto mt-10 bg-white rounded-xl shadow-2xl p-6 border border-slate-200 text-slate-800">
          <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-100">
            <Search className="text-gov-blue" size={18} />
            <h2 className="text-sm font-bold text-slate-900">
              সরাসরি খতিয়ান ও দাগ অনুসন্ধান (Land Records Search)
            </h2>
          </div>

          <form onSubmit={handleSearchSubmit} className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
            <div>
              <label className="block text-slate-600 font-semibold mb-1">জেলা</label>
              <select
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-md p-2 focus:ring-1 focus:ring-gov-blue"
              >
                <option value="ঢাকা">ঢাকা</option>
                <option value="চট্টগ্রাম">চট্টগ্রাম</option>
                <option value="সিলেট">সিলেট</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-600 font-semibold mb-1">উপজেলা/সার্কেল</label>
              <select
                value={upazila}
                onChange={(e) => setUpazila(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-md p-2 focus:ring-1 focus:ring-gov-blue"
              >
                <option value="গুলশান">গুলশান রাজস্ব সার্কেল</option>
                <option value="তেজগাঁও">তেজগাঁও সার্কেল</option>
                <option value="ধানমন্ডি">ধানমন্ডি সার্কেল</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-600 font-semibold mb-1">মৌজা</label>
              <select
                value={mouza}
                onChange={(e) => setMouza(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-md p-2 focus:ring-1 focus:ring-gov-blue"
              >
                <option value="বাড্ডা">বাড্ডা (জে.এল ২৮)</option>
                <option value="সাঁতারকুল">সাঁতারকুল (জে.এল ৩১)</option>
                <option value="ভাটারা">ভাটারা (জে.এল ২৫)</option>
                <option value="রামপুরা">রামপুরা (জে.এল ২৩)</option>
                <option value="আফতাবনগর">আফতাবনগর (জে.এল ২৯)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-600 font-semibold mb-1">খতিয়ান নম্বর</label>
              <input
                type="text"
                placeholder="যেমন: ১২০৪"
                value={khatianNo}
                onChange={(e) => setKhatianNo(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-md p-2 focus:ring-1 focus:ring-gov-blue"
              />
            </div>

            <div>
              <label className="block text-slate-600 font-semibold mb-1">দাগ নম্বর</label>
              <input
                type="text"
                placeholder="যেমন: ৪০৫"
                value={dagNo}
                onChange={(e) => setDagNo(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-md p-2 focus:ring-1 focus:ring-gov-blue"
              />
            </div>

            <div className="col-span-2 sm:col-span-1 lg:col-span-1 flex items-end">
              <button
                type="submit"
                className="w-full bg-gov-blue hover:bg-slate-900 text-white font-semibold py-2 rounded-md shadow transition flex items-center justify-center gap-1.5"
              >
                <Search size={14} />
                <span>অনুসন্ধান</span>
              </button>
            </div>
          </form>

          <div className="mt-3 pt-2 text-[11px] text-slate-500 flex flex-wrap items-center justify-between gap-1 border-t border-slate-100">
            <span>পরীক্ষার জন্য নমুনা দাগ: <strong className="text-slate-800">৪০৫</strong> (নিরাপদ), <strong className="text-slate-800">৮৮২</strong> (কর বকেয়া), <strong className="text-slate-800">১০২</strong> (হিস্যা ঘাটতি), <strong className="text-slate-800">৭১০</strong> (মামলা/মর্টগেজ)</span>
            <Link to="/search-land" className="text-gov-blue font-semibold hover:underline">
              উন্নত অনুসন্ধান →
            </Link>
          </div>
        </div>
      </section>

      {/* 2. P5 Highlight: Check Before You Buy Banner */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="bg-gradient-to-r from-teal-900 via-slate-900 to-gov-navy text-white rounded-2xl p-8 shadow-xl border border-teal-800/50 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-teal-500/20 text-teal-300 px-3 py-1 rounded-md text-xs font-semibold">
              <ShieldCheck size={16} />
              সমস্যা ৫ (P5) — কেনার আগে যাচাই
            </div>
            <h3 className="text-2xl font-bold">
              প্রতারণা ও ভূমি বিরোধ এড়াতে বায়নার পূর্বেই স্বয়ংক্রিয় অডিট
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              বিক্রেতার নামে রেকর্ডীয় হিস্যা রয়েছে কি না, জমিটিতে কোনো গোপন ব্যাংক ঋণ, দেওয়ানি আদালতের মামলা,
              সরকারি খাস বা অধিগ্রহণ রয়েছে কি না তা তাৎক্ষণিক যাচাই করে সিদ্ধান্ত নিন।
            </p>
            <div className="flex flex-wrap gap-2 pt-2 text-xs">
              <span className="bg-slate-800 text-teal-300 px-2.5 py-1 rounded border border-slate-700">✓ হিস্যা অতিরিক্ত বিক্রি রোধ</span>
              <span className="bg-slate-800 text-teal-300 px-2.5 py-1 rounded border border-slate-700">✓ ডুপ্লিকেট সেল চেক</span>
              <span className="bg-slate-800 text-teal-300 px-2.5 py-1 rounded border border-slate-700">✓ বকেয়া খাজনা ব্লক</span>
              <span className="bg-slate-800 text-teal-300 px-2.5 py-1 rounded border border-slate-700">✓ মামলার লাল সতর্কতা</span>
            </div>
          </div>

          <div className="shrink-0 text-center">
            <Link
              to="/verify-land"
              className="inline-flex items-center gap-2 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold px-6 py-3.5 rounded-xl shadow-lg transition transform hover:-translate-y-0.5 text-sm"
            >
              <span>ঝুঁকি ক্যালকুলেটর চালু করুন</span>
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* 3. 9-Stage Visual Roadmap (P4 + P5 Unified Journey) */}
      <section className="py-12 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-2">
            <span className="text-teal-700 font-bold text-xs uppercase tracking-wider">
              সমন্বিত ডিজিটাল সেবা প্রণালী
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              ভূমি কেনা-বেচা থেকে ই-নামজারি: ৯টি সহজ ধাপ
            </h3>
            <p className="text-xs sm:text-sm text-slate-600">
              ভূমিসাথী প্ল্যাটফর্মের মাধ্যমে নাগরিক এবং সংশ্লিষ্ট সরকারি অফিসসমূহের একটি সুশৃঙ্খল টাইমলাইন
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Step 1-3 */}
            <div className="border border-slate-200 rounded-xl p-5 bg-slate-50/50 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold bg-gov-blue text-white w-6 h-6 rounded-full flex items-center justify-center">১</span>
                <span className="text-[11px] text-teal-700 font-semibold bg-teal-50 px-2 py-0.5 rounded border border-teal-200">নাগরিক পর্যায়</span>
              </div>
              <h4 className="font-bold text-slate-900 text-base">জমি অনুসন্ধান ও প্রাক-যাচাই</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                মৌজা, খতিয়ান ও দাগ নম্বর দিয়ে জমির অবস্থান, রেকর্ডীয় মালিকদের হিস্যা এবং মোট আয়তন যাচাই।
              </p>
            </div>

            <div className="border border-slate-200 rounded-xl p-5 bg-slate-50/50 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold bg-gov-blue text-white w-6 h-6 rounded-full flex items-center justify-center">২</span>
                <span className="text-[11px] text-teal-700 font-semibold bg-teal-50 px-2 py-0.5 rounded border border-teal-200">ঝুঁকি অডিট</span>
              </div>
              <h4 className="font-bold text-slate-900 text-base">ঝুঁকি ও আইনি বিরোধ নিরূপণ</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                বিক্রেতার এনআইডি মিল, অতিরিক্ত হিস্যা বিক্রির চেষ্টা, ব্যাংক দায়বদ্ধতা এবং আদালতের নিষেধাজ্ঞা শনাক্ত।
              </p>
            </div>

            <div className="border border-slate-200 rounded-xl p-5 bg-slate-50/50 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold bg-gov-blue text-white w-6 h-6 rounded-full flex items-center justify-center">৩</span>
                <span className="text-[11px] text-amber-700 font-semibold bg-amber-50 px-2 py-0.5 rounded border border-amber-200">সার্ভার গার্ড</span>
              </div>
              <h4 className="font-bold text-slate-900 text-base">ভূমি উন্নয়ন কর ও ছাড়পত্র</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                বকেয়া খাজনা পরিশোধ নিশ্চিতকরণ। কর বকেয়া থাকলে সিস্টেম স্বয়ংক্রিয়ভাবে বিক্রয় আবেদন দাখিল আটকে দেবে।
              </p>
            </div>

            {/* Step 4-6 */}
            <div className="border border-slate-200 rounded-xl p-5 bg-slate-50/50 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold bg-gov-navy text-white w-6 h-6 rounded-full flex items-center justify-center">৪</span>
                <span className="text-[11px] text-teal-700 font-semibold bg-teal-50 px-2 py-0.5 rounded border border-teal-200">আবেদন</span>
              </div>
              <h4 className="font-bold text-slate-900 text-base">জমি বিক্রির অনলাইন আবেদন</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                ক্রেতা ও বিক্রেতার সিটিজেন আইডি, বিক্রিত জমির পরিমাণ ও পণমূল্য উল্লেখ করে অনলাইন আবেদন দাখিল।
              </p>
            </div>

            <div className="border border-slate-200 rounded-xl p-5 bg-slate-50/50 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold bg-gov-navy text-white w-6 h-6 rounded-full flex items-center justify-center">৫</span>
                <span className="text-[11px] text-blue-700 font-semibold bg-blue-50 px-2 py-0.5 rounded border border-blue-200">প্রশাসন</span>
              </div>
              <h4 className="font-bold text-slate-900 text-base">প্রাথমিক প্রশাসনিক পর্যালোচনা</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                হিস্যা ও রেকর্ডীয় তথ্যের প্রাথমিক সঠিকতা যাচাই। কোনো ত্রুটি থাকলে কারণসহ সংশোধনের নির্দেশ।
              </p>
            </div>

            <div className="border border-slate-200 rounded-xl p-5 bg-slate-50/50 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold bg-gov-navy text-white w-6 h-6 rounded-full flex items-center justify-center">৬</span>
                <span className="text-[11px] text-indigo-700 font-semibold bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">তহশিল অফিস</span>
              </div>
              <h4 className="font-bold text-slate-900 text-base">ইউনিয়ন ভূমি অফিসের সরেজমিন তদন্ত</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                ইউনিয়ন ভূমি সহকারী কর্মকর্তা কর্তৃক সরেজমিন সীমানা, শারীরিক দখল ও সহ-শরিকদের সম্মতি সম্পর্কিত প্রতিবেদন।
              </p>
            </div>

            {/* Step 7-9 */}
            <div className="border border-slate-200 rounded-xl p-5 bg-slate-50/50 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold bg-emerald-700 text-white w-6 h-6 rounded-full flex items-center justify-center">৭</span>
                <span className="text-[11px] text-purple-700 font-semibold bg-purple-50 px-2 py-0.5 rounded border border-purple-200">সাব-রেজিস্ট্রি</span>
              </div>
              <h4 className="font-bold text-slate-900 text-base">দলিল সম্পাদন ও নিবন্ধন সম্পন্ন</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                সাব-রেজিস্ট্রি অফিসে অ্যাপয়েন্টমেন্ট ও বায়োমেট্রিক উপস্থিতিতে সাফ-কবলা দলিল নিবন্ধন ও সিরিয়াল নম্বর প্রদান।
              </p>
            </div>

            <div className="border border-slate-200 rounded-xl p-5 bg-slate-50/50 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold bg-emerald-700 text-white w-6 h-6 rounded-full flex items-center justify-center">৮</span>
                <span className="text-[11px] text-cyan-700 font-semibold bg-cyan-50 px-2 py-0.5 rounded border border-cyan-200">ই-নামজারি</span>
              </div>
              <h4 className="font-bold text-slate-900 text-base">স্বয়ংক্রিয় নামজারি কেস ও শুনানি</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                রেজিস্ট্রেশন সম্পন্ন হতেই সহকারী কমিশনার (ভূমি) অফিসে নামজারি কেস রুজু ও ডিজিটাল নোটিশ জারি।
              </p>
            </div>

            <div className="border border-slate-200 rounded-xl p-5 bg-slate-50/50 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold bg-emerald-700 text-white w-6 h-6 rounded-full flex items-center justify-center">৯</span>
                <span className="text-[11px] text-emerald-800 font-bold bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300">চূড়ান্ত ফলাফল</span>
              </div>
              <h4 className="font-bold text-slate-900 text-base">নতুন নামজারি খতিয়ান ও জোত জারি</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                এসি ল্যান্ডের আদেশে ক্রেতার নামে নতুন খতিয়ান সৃষ্টি এবং বিক্রেতার অবশিষ্ট অংশের সঠিক হিস্যা পুনঃনির্ধারণ।
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Citizen Land Services Gateway powered by Skiper UI (@skiper-ui/skiper40) */}
      <section className="py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white rounded-2xl p-6 sm:p-8 border border-slate-700/60 shadow-xl">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-700/60 pb-5">
            <div>
              <div className="flex items-center gap-2 text-teal-400 text-xs font-semibold uppercase tracking-wider mb-1">
                <Sparkles size={14} />
                <span>ইন্টারেক্টিভ সিটিজেন পোর্টাল গেটওয়ে</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white">জরুরি নাগরিক সেবা শর্টকাট</h3>
              <p className="text-xs text-slate-300 mt-1">
                এক ক্লিকে আপনার প্রয়োজনীয় ভূমিসেবা ও যাচাইকরণ মডিউলে সরাসরি প্রবেশ করুন।
              </p>
            </div>
            <div className="text-left md:text-right text-[11px] text-slate-400">
              <span className="block text-slate-400">ইন্টারেক্টিভ কম্পোনেন্ট:</span>
              <a
                href="https://skiper-ui.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-teal-400 hover:text-teal-300 font-medium transition"
              >
                Skiper UI (CssLink @skiper-ui/skiper40)
              </a>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-6 text-sm">
            <div className="p-4 rounded-xl bg-slate-800/70 border border-slate-700/50 hover:border-teal-500/60 transition group">
              <span className="text-[11px] font-semibold text-teal-400 block mb-1">যাচাইকরণ পোর্টাল</span>
              <Link001 to="/verify-land" className="text-white hover:text-teal-300 font-semibold text-base">
                মালিকানা ও খতিয়ান নির্ভুল যাচাই
              </Link001>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                বায়না করার পূর্বে জমির খতিয়ান, দাগ, খাজনা ও আইনি সত্যতা যাচাই করুন।
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-800/70 border border-slate-700/50 hover:border-blue-500/60 transition group">
              <span className="text-[11px] font-semibold text-blue-400 block mb-1">বিক্রয় ও রেজিস্ট্রেশন</span>
              <Link002 to="/citizen/sell" className="text-white hover:text-blue-300 font-semibold text-base">
                স্মার্ট রেজিস্ট্রেশন ও বিক্রয় আবেদন
              </Link002>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                ডিজিটাল সাব-রেজিস্ট্রি সমন্বয় ও ডিজিটাল খসড়া দলিল প্রস্তুতকরণ।
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-800/70 border border-slate-700/50 hover:border-emerald-500/60 transition group">
              <span className="text-[11px] font-semibold text-emerald-400 block mb-1">ট্র্যাকিং ও শুনানি</span>
              <Link003 to="/citizen/applications" className="text-white hover:text-emerald-300 font-semibold text-base">
                আবেদনের অগ্রগতি ও শুনানি ট্র্যাকিং
              </Link003>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                তহশিল অফিস, সাব-রেজিস্ট্রি এবং এসি ল্যান্ড নামজারি কেসের লাইভ অগ্রগতি।
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-800/70 border border-slate-700/50 hover:border-amber-500/60 transition group">
              <span className="text-[11px] font-semibold text-amber-400 block mb-1">খাজনা ও কর সেবা</span>
              <Link004 to="/citizen/tax" className="text-white hover:text-amber-300 font-semibold text-base">
                ভূমি উন্নয়ন কর ও অনলাইন দাখিলা
              </Link004>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                হাল সনের ভূমি উন্নয়ন কর পরিশোধ ও ডিজিটাল দাখিলা সংগ্রহ।
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-800/70 border border-slate-700/50 hover:border-purple-500/60 transition group">
              <span className="text-[11px] font-semibold text-purple-400 block mb-1">সেবা নির্দেশিকা</span>
              <Link005 to="/services" className="text-white hover:text-purple-300 font-semibold text-base">
                সকল নাগরিক ভূমিসেবার পূর্ণাঙ্গ তালিকা
              </Link005>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                ভূমি সেবা, ফি ক্যালকুলেটর, দলিল নমুনা এবং জরুরি নির্দেশনাসমূহ।
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-800/70 border border-slate-700/50 hover:border-cyan-500/60 transition group">
              <span className="text-[11px] font-semibold text-cyan-400 block mb-1">সহায়তা ডেস্ক</span>
              <Link001 to="/help" className="text-white hover:text-cyan-300 font-semibold text-base">
                হেল্পলাইন ও হটলাইন ১৬১২২ সহায়তা
              </Link001>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                ভূমি বিষয়ক যেকোনো জটিলতায় সরকারি সাপোর্ট সেন্টারের দিকনির্দেশনা।
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Transparency & Citizen Trust Statistics */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <p className="text-3xl font-extrabold text-gov-blue font-mono">১০০%</p>
            <p className="text-xs text-slate-600 mt-1 font-semibold">ডিজিটাল খতিয়ান যাচাই</p>
          </div>
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <p className="text-3xl font-extrabold text-teal-600 font-mono">২৪ ঘণ্টা</p>
            <p className="text-xs text-slate-600 mt-1 font-semibold">স্বয়ংক্রিয় কেস রুজু</p>
          </div>
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <p className="text-3xl font-extrabold text-indigo-600 font-mono">৪টি দপ্তর</p>
            <p className="text-xs text-slate-600 mt-1 font-semibold">একীভূত সমন্বিত সিস্টেম</p>
          </div>
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <p className="text-3xl font-extrabold text-emerald-600 font-mono">০%</p>
            <p className="text-xs text-slate-600 mt-1 font-semibold">অতিরিক্ত বিক্রির ঝুঁকি</p>
          </div>
        </div>
      </section>

      {/* 5. Citizen Call to Action */}
      <section className="py-12 bg-slate-900 text-white text-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto space-y-4">
          <h3 className="text-2xl font-bold">
            আপনার জমি সংক্রান্ত যেকোনো প্রয়োজনে আজই যুক্ত হোন
          </h3>
          <p className="text-xs sm:text-sm text-slate-300">
            খতিয়ান অনুসন্ধান, ঝুঁকি যাচাই কিংবা বিক্রির আবেদন — সম্পূর্ণ সুরক্ষিত ও ডিজিটাল উপায়ে শুরু করুন।
          </p>
          <div className="pt-2 flex justify-center gap-3">
            <Link
              to="/register"
              className="bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold px-6 py-2.5 rounded-lg text-sm transition"
            >
              বিনামূল্যে অ্যাকাউন্ট খুলুন
            </Link>
            <Link
              to="/login"
              className="bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 px-6 py-2.5 rounded-lg text-sm transition"
            >
              ডেমো লগইন করুন
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
