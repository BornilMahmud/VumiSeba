import React from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  Search,
  FilePlus2,
  Receipt,
  GitBranch,
  FolderOpen,
  Scale,
  Building2,
  ArrowRight,
} from 'lucide-react';

export const ServicesPage: React.FC = () => {
  const services = [
    {
      title: 'কেনার আগে জমি যাচাই (P5: Check Before You Buy)',
      desc: 'বায়নার পূর্বে বিক্রেতার বৈধ হিস্যা, খতিয়ান ও দাগের সত্যতা, বকেয়া খাজনা, আদালতের স্থগিতাদেশ ও ব্যাংক লিয়েন পরীক্ষা।',
      link: '/verify-land',
      badge: 'অগ্রাধিকার সেবা',
      icon: ShieldCheck,
      color: 'bg-teal-50 text-teal-800 border-teal-200',
    },
    {
      title: 'খতিয়ান ও দাগ রেকর্ড অনুসন্ধান',
      desc: 'অনলাইনে মৌজা, জে.এল নম্বর, আর.এস/বি.এস খতিয়ান ও দাগ নম্বরের রেকর্ডীয় হিস্যা ও তফশিল যাচাই।',
      link: '/search-land',
      badge: 'উন্মুক্ত সেবা',
      icon: Search,
      color: 'bg-blue-50 text-blue-800 border-blue-200',
    },
    {
      title: 'জমি বিক্রির অনলাইন আবেদন (P4)',
      desc: 'ক্রেতা-বিক্রেতা নির্ধারণ, হিস্যা সমন্বয় এবং স্বত্ব যাচাইপূর্বক দলিল প্রস্তুতির আনুষ্ঠানিক আবেদন।',
      link: '/citizen/sell',
      badge: 'সিটিজেন পোর্টাল',
      icon: FilePlus2,
      color: 'bg-indigo-50 text-indigo-800 border-indigo-200',
    },
    {
      title: 'ভূমি উন্নয়ন কর ও ই-দাখিলা পরিশোধ',
      desc: 'হোল্ডিংভিত্তিক বকেয়া কর নিরূপণ, অনলাইনে কর পরিশোধ এবং তাত্ক্ষণিক ডিজিটাল দাখিলা ও ক্লিয়ারেন্স সনদ গ্রহণ।',
      link: '/citizen/tax',
      badge: 'সার্ভার গার্ড',
      icon: Receipt,
      color: 'bg-amber-50 text-amber-800 border-amber-200',
    },
    {
      title: 'স্বয়ংক্রিয় ই-নামজারি ট্র্যাকিং (Smart e-Mutation)',
      desc: 'সাব-রেজিস্ট্রি অফিসে দলিল নিবন্ধনের পর স্বয়ংক্রিয়ভাবে নামজারি কেস রুজু, শুনানি ট্র্যাকিং ও নতুন খতিয়ান প্রাপ্তি।',
      link: '/citizen/mutation',
      badge: 'P4 অটোমেশন',
      icon: GitBranch,
      color: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    },
    {
      title: 'রেজিস্ট্রেশন অ্যাপয়েন্টমেন্ট ও খসড়া দলিল',
      desc: 'সাব-রেজিস্ট্রি অফিসের কাউন্টার স্লট সংরক্ষণ, চেকলিস্ট যাচাই এবং প্রস্তুতিমূলক খসড়া দলিল প্রিন্ট।',
      link: '/citizen/registration-checklist',
      badge: 'নিবন্ধন প্রস্তুতি',
      icon: Building2,
      color: 'bg-purple-50 text-purple-800 border-purple-200',
    },
  ];

  return (
    <div className="font-bengali min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center max-w-3xl mx-auto mb-10 space-y-2">
        <span className="text-teal-700 font-bold text-xs uppercase tracking-wider">
          নাগরিক সেবা নির্দেশিকা
        </span>
        <h1 className="text-3xl font-extrabold text-slate-900">
          ভূমিসাথী সকল ডিজিটাল ভূমি সেবা
        </h1>
        <p className="text-xs sm:text-sm text-slate-600">
          জমি অনুসন্ধান, স্বত্ব যাচাইকরণ, কর পরিশোধ, দলিল রেজিস্ট্রি এবং স্বয়ংক্রিয় ই-নামজারি কার্যক্রমসমূহ
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((s, idx) => {
          const Icon = s.icon;
          return (
            <div
              key={idx}
              className="bg-white rounded-xl shadow-gov-sm border border-slate-200 p-6 flex flex-col justify-between hover:shadow-md transition"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-lg bg-gov-blue/10 text-gov-blue flex items-center justify-center">
                    <Icon size={20} />
                  </div>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${s.color}`}>
                    {s.badge}
                  </span>
                </div>
                <h3 className="font-bold text-slate-900 text-base mb-2">{s.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed mb-6">{s.desc}</p>
              </div>

              <Link
                to={s.link}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-gov-blue hover:text-slate-950 transition border-t pt-3"
              >
                <span>সেবা গ্রহণ করুন</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
};
