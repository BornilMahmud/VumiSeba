import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { CheckCircle2, ArrowRight, ShieldCheck, Scale, FileText, Building2 } from 'lucide-react';

export const HowItWorksPage: React.FC = () => {
  const { language } = useLanguage();
  const isBn = language === 'bn';

  const steps = [
    {
      step: isBn ? '১' : '1',
      title: isBn ? 'খতিয়ান ও দাগ অনুসন্ধান' : 'Khatian & Dag Plot Search',
      actor: isBn ? 'নাগরিক (ক্রেতা/বিক্রেতা)' : 'Citizen (Buyer/Seller)',
      desc: isBn
        ? 'নাগরিক পোর্টাল থেকে জেলা, উপজেলা, মৌজা ও দাগ নম্বর দিয়ে সরকারি রেকর্ডরুমের সংরক্ষিত আর.এস বা বি.এস খতিয়ানের তথ্য খুঁজে বের করেন।'
        : 'Citizens query official land database by district, upazila, mouza, and plot number to locate verified R.S./B.S. Khatians.',
    },
    {
      step: isBn ? '২' : '2',
      title: isBn ? 'প্রাক-বায়না ঝুঁকি পরীক্ষা (P5)' : 'Pre-Purchase Risk Audit (P5)',
      actor: isBn ? 'ভূমিসাথী অটোমেটেড ইঞ্জিন' : 'VumiSeba Automated Engine',
      desc: isBn
        ? 'বিক্রেতার এনআইডি ও রেকর্ডীয় অংশ যাচাই করা হয়। বিক্রেতা নিজের হিস্যার বেশি বিক্রির চেষ্টা করছেন কি না, জমিতে কোনো মামলা বা ব্যাংক লিয়েন রয়েছে কি না তা তাৎক্ষণিক পরীক্ষা করা হয়।'
        : 'System automatically verifies seller ownership shares, duplicate sale flags, court litigation caveats, and undisclosed bank mortgages.',
    },
    {
      step: isBn ? '৩' : '3',
      title: isBn ? 'ভূমি উন্নয়ন কর (খাজনা) নিষ্পত্তি' : 'Land Tax (Khajna) Clearance',
      actor: isBn ? 'বিক্রেতা / ইউনিয়ন ভূমি অফিস' : 'Seller / Union Land Office',
      desc: isBn
        ? 'জমির হোল্ডিংয়ের বকেয়া কর অনলাইনে পরিশোধ করতে হয়। কর বকেয়া থাকলে সিস্টেমটি পরবর্তী কোনো বিক্রয় আবেদন গ্রহণ করবে না (সার্ভার গার্ড)।'
        : 'Holding taxes must be cleared online. Server-side validation prevents any transaction file submission if arrears remain unpaid.',
    },
    {
      step: isBn ? '৪' : '4',
      title: isBn ? 'জমি বিক্রির অনলাইন আবেদন দাখিল' : 'Online Land Sale Filing (P4)',
      actor: isBn ? 'বিক্রেতা' : 'Seller',
      desc: isBn
        ? 'ক্রেতার ইউনিক সিটিজেন আইডি, হস্তান্তরযোগ্য জমির সঠিক হিস্যা ও পণমূল্য উল্লেখ করে সিস্টেমে আনুষ্ঠানিক ফাইল তৈরি করা হয়।'
        : 'The seller initiates an official deed application with buyer Unique Citizen ID, verified plot shares, and agreement consideration.',
    },
    {
      step: isBn ? '৫' : '5',
      title: isBn ? 'কেন্দ্রীয় ও সহকারী কমিশনার পর্যালোচনা' : 'Administrative Scrutiny & Cross-Check',
      actor: isBn ? 'ভূমি প্রশাসন কর্মকর্তা' : 'Land Revenue Officer',
      desc: isBn
        ? 'দাখিলকৃত ফাইলের প্রাথমিক বৈধতা, ডুপ্লিকেট বিক্রয়ের আশঙ্কা ও যৌথ শরিকের হিস্যা যাচাই করে পরবর্তী মাঠ তদন্তের জন্য প্রেরণ করা হয়।'
        : 'Preliminary validation ensures co-sharer equity and authenticity before forwarding the case for on-ground verification.',
    },
    {
      step: isBn ? '৬' : '6',
      title: isBn ? 'ইউনিয়ন ভূমি অফিসের সরেজমিন তদন্ত' : 'Union Field Verification & Report',
      actor: isBn ? 'ইউনিয়ন ভূমি সহকারী কর্মকর্তা (ULAO)' : 'Union Land Assistant Officer (ULAO)',
      desc: isBn
        ? 'তহশিলদার সরেজমিনে গিয়ে শারীরিক দখল, সীমানা বিরোধ ও সহ-শরিকদের সম্মতি পর্যবেক্ষণ করে ডিজিটাল তদন্ত রিপোর্ট জমা দেন।'
        : 'The Tahsildar physically visits the plot to assess actual possession, boundary markers, and co-sharer status.',
    },
    {
      step: isBn ? '৭' : '7',
      title: isBn ? 'সাব-রেজিস্ট্রি অফিসে দলিল নিবন্ধন (P4)' : 'Deed Registration at Sub-Registry (P4)',
      actor: isBn ? 'সাব-রেজিস্ট্রার ও উভয় পক্ষ' : 'Sub-Registrar & Parties',
      desc: isBn
        ? 'নির্ধারিত অ্যাপয়েন্টমেন্টে সাব-রেজিস্ট্রি অফিসে উপস্থিত হয়ে দলিল সম্পাদন করা হয়। কর্মকর্তা নিবন্ধন সম্পন্ন হিসেবে এন্ট্রি দিয়ে সিরিয়াল নং ইস্যু করেন।'
        : 'Parties attend booked appointment at Sub-Registry office; deed is verified, biometrics captured, and registration deed number issued.',
    },
    {
      step: isBn ? '৮' : '8',
      title: isBn ? 'স্বয়ংক্রিয় ই-নামজারি কেস ও নোটিশ' : 'Automated e-Mutation Case & Notice',
      actor: isBn ? 'উপজেলা ভূমি অফিস / এসি ল্যান্ড' : 'Upazila Land Office / AC Land',
      desc: isBn
        ? 'দলিল নিবন্ধন হওয়া মাত্রই কোনো পৃথক আবেদন ছাড়াই সহকারী কমিশনার (ভূমি) অফিসে নামজারি মোকদ্দমা শুরু হয় এবং শুনানির নোটিশ জারি হয়।'
        : 'Deed registration immediately auto-triggers an e-mutation case at the AC Land office without requiring separate citizen application.',
    },
    {
      step: isBn ? '৯' : '9',
      title: isBn ? 'নতুন নামজারি খতিয়ান ও জোত সৃষ্টি' : 'New Mutation Record & Holding Issuance',
      actor: isBn ? 'এসি ল্যান্ড ও রেকর্ডরুম' : 'AC Land & Record Room',
      desc: isBn
        ? 'শুনানি ও নথি যাচাই শেষে এসি ল্যান্ডের আদেশে ক্রেতার নামে নতুন খতিয়ান মঞ্জুর হয় এবং বিক্রেতার অবশিষ্ট হিস্যা স্বয়ংক্রিয়ভাবে সমন্বয় করা হয়।'
        : 'AC Land approves mutation order; new Khatian is published in citizen portal, and seller record is automatically adjusted.',
    },
  ];

  return (
    <div className={`${isBn ? 'font-bengali' : 'font-sans'} min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto transition-colors`}>
      <div className="text-center mb-12 space-y-2">
        <span className="text-teal-700 font-bold text-xs uppercase tracking-wider">
          {isBn ? 'কার্যপ্রক্রিয়া ও নির্দেশিকা' : 'Workflow & Guide'}
        </span>
        <h1 className="text-3xl font-extrabold text-slate-900">
          {isBn ? 'কীভাবে কাজ করে ভূমিসাথী?' : 'How Does VumiSeba Work?'}
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 max-w-2xl mx-auto">
          {isBn
            ? 'একটি নিরাপদ, বিরোধমুক্ত ও আধুনিক ভূমি কেনা-বেচা এবং ই-নামজারি কার্যক্রমের পূর্ণাঙ্গ কর্মপরিকল্পনা'
            : 'End-to-end blueprint for dispute-free land purchase, transparent deed registry, and automated e-mutation'}
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
                  {isBn ? 'দায়িত্ব: ' : 'Actor: '}{s.actor}
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed pt-1">{s.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 text-center bg-gradient-to-b from-white to-slate-50 border border-emerald-300 p-8 sm:p-10 rounded-3xl shadow-card">
        <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 mb-2">
          {isBn ? 'আপনি কি জমি কেনার কথা ভাবছেন?' : 'Planning to Purchase Land in Bangladesh?'}
        </h3>
        <p className="text-xs sm:text-sm text-slate-600 mb-6 max-w-xl mx-auto">
          {isBn
            ? 'বায়না করার আগে নিশ্চিত হয়ে নিন জমিটির হিস্যা, খাজনা ও রেকর্ডীয় কাগজপত্র শতভাগ সঠিক কি না।'
            : 'Audit recorded shares, tax liabilities, and court disputes in 60 seconds before paying earnest money.'}
        </p>
        <Link
          to="/verify-land"
          className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-7 py-3 rounded-xl text-sm shadow-md hover:shadow-lg transition transform hover:-translate-y-0.5"
        >
          <span>{isBn ? 'এখনই জমি যাচাই করুন' : 'Verify Land Now'}</span>
          <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
};

export default HowItWorksPage;
