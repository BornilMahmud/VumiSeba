import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, ArrowRight, ShieldCheck, Scale, FileText, Building2 } from 'lucide-react';

export const HowItWorksPage: React.FC = () => {
  const steps = [
    {
      step: '১',
      title: 'খতিয়ান ও দাগ অনুসন্ধান',
      actor: 'নাগরিক (ক্রেতা/বিক্রেতা)',
      desc: 'নাগরিক পোর্টাল থেকে জেলা, উপজেলা, মৌজা ও দাগ নম্বর দিয়ে সরকারি রেকর্ডরুমের সংরক্ষিত আর.এস বা বি.এস খতিয়ানের তথ্য খুঁজে বের করেন।',
    },
    {
      step: '২',
      title: 'প্রাক-বায়না ঝুঁকি পরীক্ষা (P5)',
      actor: 'ভূমিসাথী অটোমেটেড ইঞ্জিন',
      desc: 'বিক্রেতার এনআইডি ও রেকর্ডীয় অংশ যাচাই করা হয়। বিক্রেতা নিজের হিস্যার বেশি বিক্রির চেষ্টা করছেন কি না, জমিতে কোনো মামলা বা ব্যাংক লিয়েন রয়েছে কি না তা তাৎক্ষণিক পরীক্ষা করা হয়।',
    },
    {
      step: '৩',
      title: 'ভূমি উন্নয়ন কর (খাজনা) নিষ্পত্তি',
      actor: 'বিক্রেতা / ইউনিয়ন ভূমি অফিস',
      desc: 'জমির হোল্ডিংয়ের বকেয়া কর অনলাইনে পরিশোধ করতে হয়। কর বকেয়া থাকলে সিস্টেমটি পরবর্তী কোনো বিক্রয় আবেদন গ্রহণ করবে না (সার্ভার গার্ড)।',
    },
    {
      step: '৪',
      title: 'জমি বিক্রির অনলাইন আবেদন দাখিল',
      actor: 'বিক্রেতা',
      desc: 'ক্রেতার ইউনিক সিটিজেন আইডি, হস্তান্তরযোগ্য জমির সঠিক হিস্যা ও পণমূল্য উল্লেখ করে সিস্টেমে আনুষ্ঠানিক ফাইল তৈরি করা হয়।',
    },
    {
      step: '৫',
      title: 'কেন্দ্রীয় ও সহকারী কমিশনার পর্যালোচনা',
      actor: 'ভূমি প্রশাসন কর্মকর্তা',
      desc: 'দাখিলকৃত ফাইলের প্রাথমিক বৈধতা, ডুপ্লিকেট বিক্রয়ের আশঙ্কা ও যৌথ শরিকের হিস্যা যাচাই করে পরবর্তী মাঠ তদন্তের জন্য প্রেরণ করা হয়।',
    },
    {
      step: '৬',
      title: 'ইউনিয়ন ভূমি অফিসের সরেজমিন তদন্ত',
      actor: 'ইউনিয়ন ভূমি সহকারী কর্মকর্তা (ULAO)',
      desc: 'তহশিলদার সরেজমিনে গিয়ে শারীরিক দখল, সীমানা বিরোধ ও সহ-শরিকদের সম্মতি পর্যবেক্ষণ করে ডিজিটাল তদন্ত রিপোর্ট জমা দেন।',
    },
    {
      step: '৭',
      title: 'সাব-রেজিস্ট্রি অফিসে দলিল নিবন্ধন (P4)',
      actor: 'সাব-রেজিস্ট্রার ও উভয় পক্ষ',
      desc: 'নির্ধারিত অ্যাপয়েন্টমেন্টে সাব-রেজিস্ট্রি অফিসে উপস্থিত হয়ে দলিল সম্পাদন করা হয়। কর্মকর্তা নিবন্ধন সম্পন্ন হিসেবে এন্ট্রি দিয়ে সিরিয়াল নং ইস্যু করেন।',
    },
    {
      step: '৮',
      title: 'স্বয়ংক্রিয় ই-নামজারি কেস ও নোটিশ',
      actor: 'উপজেলা ভূমি অফিস / এসি ল্যান্ড',
      desc: 'দলিল নিবন্ধন হওয়া মাত্রই কোনো পৃথক আবেদন ছাড়াই সহকারী কমিশনার (ভূমি) অফিসে নামজারি মোকদ্দমা শুরু হয় এবং শুনানির নোটিশ জারি হয়।',
    },
    {
      step: '৯',
      title: 'নতুন নামজারি খতিয়ান ও জোত সৃষ্টি',
      actor: 'এসি ল্যান্ড ও রেকর্ডরুম',
      desc: 'শুনানি ও নথি যাচাই শেষে এসি ল্যান্ডের আদেশে ক্রেতার নামে নতুন খতিয়ান মঞ্জুর হয় এবং বিক্রেতার অবশিষ্ট হিস্যা স্বয়ংক্রিয়ভাবে সমন্বয় করা হয়।',
    },
  ];

  return (
    <div className="font-bengali min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      <div className="text-center mb-12 space-y-2">
        <span className="text-teal-700 font-bold text-xs uppercase tracking-wider">
          কার্যপ্রক্রিয়া ও নির্দেশিকা
        </span>
        <h1 className="text-3xl font-extrabold text-slate-900">
          কীভাবে কাজ করে ভূমিসাথী?
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 max-w-2xl mx-auto">
          একটি নিরাপদ, বিরোধমুক্ত ও আধুনিক ভূমি কেনা-বেচা এবং ই-নামজারি কার্যক্রমের পূর্ণাঙ্গ কর্মপরিকল্পনা
        </p>
      </div>

      {/* Visual Timeline Steps */}
      <div className="space-y-6">
        {steps.map((s, idx) => (
          <div
            key={idx}
            className="bg-white rounded-xl shadow-gov-sm border border-slate-200 p-6 flex flex-col sm:flex-row items-start gap-5 hover:border-gov-blue transition"
          >
            <div className="w-10 h-10 rounded-full bg-gov-blue text-white font-bold flex items-center justify-center shrink-0 text-base shadow">
              {s.step}
            </div>

            <div className="flex-1 space-y-1">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="font-bold text-slate-900 text-base">{s.title}</h3>
                <span className="text-[11px] bg-slate-100 text-slate-700 font-semibold px-2 py-0.5 rounded border">
                  দায়িত্ব: {s.actor}
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed pt-1">{s.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 text-center bg-gov-navy text-white p-8 rounded-2xl">
        <h3 className="text-xl font-bold mb-2">আপনি কি জমি কেনার কথা ভাবছেন?</h3>
        <p className="text-xs text-slate-300 mb-6 max-w-xl mx-auto">
          বায়না করার আগে নিশ্চিত হয়ে নিন জমিটির হিস্যা ও কাগজপত্র সঠিক কি না।
        </p>
        <Link
          to="/verify-land"
          className="inline-flex items-center gap-2 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold px-6 py-2.5 rounded-lg text-sm transition"
        >
          <span>এখনই যাচাই করুন</span>
          <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
};
