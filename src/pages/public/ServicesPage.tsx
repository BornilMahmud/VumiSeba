import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import {
  ShieldCheck,
  Search,
  FilePlus2,
  Receipt,
  GitBranch,
  Building2,
  ArrowRight,
} from 'lucide-react';

export const ServicesPage: React.FC = () => {
  const { language } = useLanguage();
  const isBn = language === 'bn';

  const services = [
    {
      title: isBn ? 'কেনার আগে জমি যাচাই (P5)' : 'Pre-Purchase Land Audit (P5)',
      desc: isBn
        ? 'বায়নার পূর্বে বিক্রেতার বৈধ হিস্যা, খতিয়ান ও দাগের সত্যতা, বকেয়া খাজনা, আদালতের স্থগিতাদেশ ও ব্যাংক লিয়েন পরীক্ষা।'
        : 'Instant audit of recorded shares, tax liabilities, bank mortgages, and civil court injunctions before paying earnest money.',
      link: '/verify-land',
      badge: isBn ? 'অগ্রাধিকার সেবা' : 'Priority Service',
      icon: ShieldCheck,
      color: 'bg-teal-50 text-teal-800 border-teal-200',
    },
    {
      title: isBn ? 'খতিয়ান ও দাগ রেকর্ড অনুসন্ধান' : 'Khatian & Dag Records Lookup',
      desc: isBn
        ? 'অনলাইনে মৌজা, জে.এল নম্বর, আর.এস/বি.এস খতিয়ান ও দাগ নম্বরের রেকর্ডীয় হিস্যা ও তফশিল যাচাই।'
        : 'Direct digital query of land records, mouza boundaries, plot shares, and official land schedule.',
      link: '/search-land',
      badge: isBn ? 'উন্মুক্ত সেবা' : 'Open Public Access',
      icon: Search,
      color: 'bg-blue-50 text-blue-800 border-blue-200',
    },
    {
      title: isBn ? 'জমি বিক্রির অনলাইন আবেদন (P4)' : 'Online Land Sale Filing (P4)',
      desc: isBn
        ? 'ক্রেতা-বিক্রেতা নির্ধারণ, হিস্যা সমন্বয় এবং স্বত্ব যাচাইপূর্বক দলিল প্রস্তুতির আনুষ্ঠানিক আবেদন।'
        : 'Formal digital application for deed preparation with authenticated buyer ID, share checks, and valuation.',
      link: '/citizen/sell',
      badge: isBn ? 'সিটিজেন পোর্টাল' : 'Citizen Portal',
      icon: FilePlus2,
      color: 'bg-indigo-50 text-indigo-800 border-indigo-200',
    },
    {
      title: isBn ? 'ভূমি উন্নয়ন কর ও ই-দাখিলা পরিশোধ' : 'Land Development Tax & E-Dakhila',
      desc: isBn
        ? 'হোল্ডিংভিত্তিক বকেয়া কর নিরূপণ, অনলাইনে কর পরিশোধ এবং তাত্ক্ষণিক ডিজিটাল দাখিলা ও ক্লিয়ারেন্স সনদ গ্রহণ।'
        : 'Automated calculation of land taxes, online clearing, instant digital e-dakhila receipts and clearance certificates.',
      link: '/citizen/tax',
      badge: isBn ? 'সার্ভার গার্ড' : 'Server Guard',
      icon: Receipt,
      color: 'bg-amber-50 text-amber-800 border-amber-200',
    },
    {
      title: isBn ? 'স্বয়ংক্রিয় ই-নামজারি ট্র্যাকিং (Smart e-Mutation)' : 'Automated e-Mutation Tracking',
      desc: isBn
        ? 'সাব-রেজিস্ট্রি অফিসে দলিল নিবন্ধনের পর স্বয়ংক্রিয়ভাবে নামজারি কেস রুজু, শুনানি ট্র্যাকিং ও নতুন খতিয়ান প্রাপ্তি।'
        : 'Automatic case filing right after deed registration, live hearing notices, and issuance of new record of rights.',
      link: '/citizen/mutation',
      badge: isBn ? 'P4 অটোমেশন' : 'P4 Automated',
      icon: GitBranch,
      color: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    },
    {
      title: isBn ? 'রেজিস্ট্রেশন অ্যাপয়েন্টমেন্ট ও খসড়া দলিল' : 'Deed Registry Appointment & Drafts',
      desc: isBn
        ? 'সাব-রেজিস্ট্রি অফিসের কাউন্টার স্লট সংরক্ষণ, চেকলিস্ট যাচাই এবং প্রস্তুতিমূলক খসড়া দলিল প্রিন্ট।'
        : 'Reserve counter slots at the Sub-Registry office, verify statutory document checklists, and generate draft deeds.',
      link: '/citizen/registration-checklist',
      badge: isBn ? 'নিবন্ধন প্রস্তুতি' : 'Registry Preparation',
      icon: Building2,
      color: 'bg-purple-50 text-purple-800 border-purple-200',
    },
  ];

  return (
    <div className={`${isBn ? 'font-bengali' : 'font-sans'} min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 py-10 px-4 sm:px-6 lg:px-8 xl:px-10 w-full transition-colors`}>
      <div className="text-center max-w-3xl mx-auto mb-10 space-y-2">
        <span className="text-teal-700 font-bold text-xs uppercase tracking-wider">
          {isBn ? 'নাগরিক সেবা নির্দেশিকা' : 'Citizen Services Directory'}
        </span>
        <h1 className="text-3xl font-extrabold text-slate-900">
          {isBn ? 'ভূমিসাথী সকল ডিজিটাল ভূমি সেবা' : 'All Digital Land Governance Services'}
        </h1>
        <p className="text-xs sm:text-sm text-slate-600">
          {isBn
            ? 'জমি অনুসন্ধান, স্বত্ব যাচাইকরণ, কর পরিশোধ, দলিল রেজিস্ট্রি এবং স্বয়ংক্রিয় ই-নামজারি কার্যক্রমসমূহ'
            : 'Land record lookups, pre-purchase risk audits, tax clearance, smart registration, and automated e-mutation'}
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
                <span>{isBn ? 'সেবা গ্রহণ করুন' : 'Access Service'}</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ServicesPage;
