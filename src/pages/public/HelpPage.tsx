import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, BookOpen, Phone, Mail, ShieldAlert } from 'lucide-react';

export const HelpPage: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: 'কেনার আগে জমি যাচাই (P5) কেন জরুরি?',
      a: 'বাংলাদেশে জমি সংক্রান্ত অধিকাংশ মামলা ও প্রতারণার কারণ হলো—বিক্রেতার নিজের চেয়ে বেশি জমি বিক্রির চেষ্টা, অপ্রকাশিত ব্যাংক ঋণ/মর্টগেজ, কিংবা বিচারাধীন আদালতের নিষেধাজ্ঞা। ভূমিসাথীর মাধ্যমে বায়না করার পূর্বেই সরকারি রেকর্ডরুম ও রাজস্ব ডাটাবেজ তুলনা করে ঝুঁকি নিরূপণ করা যায়।',
    },
    {
      q: 'বকেয়া খাজনা থাকলে কি জমি বিক্রির আবেদন করা যাবে?',
      a: 'না। ভূমিসাথী প্ল্যাটফর্মের সার্ভার-সাইড নীতি অনুসারে যে জমিতে ভূমি উন্নয়ন কর বকেয়া রয়েছে, সেই জমির কোনো আনুষ্ঠানিক বিক্রয় আবেদন দাখিল করা যাবে না। বিক্রেতাকে অবশ্যই অনলাইনে বা সরাসরি কর পরিশোধ করে ই-দাখিলা গ্রহণ করতে হবে।',
    },
    {
      q: 'দলিল রেজিস্ট্রির পর আলাদা করে কি নামজারির আবেদন করতে হবে?',
      a: 'না, এটিই ভূমিসাথী (P4) প্ল্যাটফর্মের মূল উদ্ভাবন। সাব-রেজিস্ট্রি অফিসে দলিল নিবন্ধিত হওয়ার সাথে সাথেই স্বয়ংক্রিয়ভাবে সহকারী কমিশনার (ভূমি) অফিসে একটি পোস্ট-রেজিস্ট্রেশন নামজারি কেস শুরু হয়ে যায়। নাগরিককে নতুন করে ফি দিয়ে আলাদা আবেদন করতে হয় না।',
    },
    {
      q: 'ইউনিক সিটিজেন আইডি (Unique Citizen ID) কী?',
      a: 'জাতীয় পরিচয়পত্র ও কেওয়াইসি (KYC) যাচাইয়ের পর সিস্টেমে প্রতিটি নাগরিকের জন্য একটি অনন্য সুরক্ষিত পরিচিতি নম্বর (যেমন: BHM-CIT-882194) তৈরি হয়। সরাসরি সংবেদনশীল এনআইডি পাবলিক পোর্টালে প্রকাশ না করে এই সুরক্ষিত আইডির মাধ্যমে লেনদেন পরিচালিত হয়।',
    },
    {
      q: 'একটি কম-ঝুঁকি ফলাফল কি শতভাগ আইনি গ্যারান্টি?',
      a: 'না। কোনো বেসরকারি বা পাইলট প্ল্যাটফর্ম আদালতের বা সরকারি সিলমোহরের বিকল্প হতে পারে না। এটি একটি সিদ্ধান্ত-সহায়ক টুল। বায়না বা বড় অংকের অর্থ হস্তান্তরের পূর্বে মূল বায়া দলিল ও শারীরিক দখল সরেজমিনে বিজ্ঞ আইনজীবী দ্বারা যাচাই করা আবশ্যক।',
    },
  ];

  const glossary = [
    { term: 'খতিয়ান (Porcha)', def: 'জমি জরিপের পর সরকার কর্তৃক প্রণীত ভূমির স্বত্ব ও মালিকানার আনুষ্ঠানিক রেকর্ড বিবরণী (CS, SA, RS, BS)।' },
    { term: 'দাগ নম্বর (Dag No)', def: 'মৌজা নকশা বা মানচিত্রে প্রতিটি পৃথক ভূমি খণ্ডের জন্য নির্ধারিত অনন্য প্লট নম্বর।' },
    { term: 'বায়া দলিল (Baya Deed)', def: 'বর্তমান বিক্রেতা কীভাবে পূর্বে জমির মালিকানা অর্জন করেছিলেন, সেই মূল ঐতিহাসিক দলিল বা ধারাবাহিক দলিলসমূহ।' },
    { term: 'নামজারি / খারিজ (e-Mutation)', def: 'পুরাতন মালিকের খতিয়ান হতে নাম কেটে নতুন ক্রেতা বা ওয়ারিশের নামে নতুন খতিয়ান খোলার সরকারি প্রক্রিয়া।' },
    { term: 'জমাভাগ (Sub-division)', def: 'যৌথ খতিয়ান থেকে কোনো শরিকের অংশ আলাদা করে নতুন জোত ও খাজনা নির্ধারণ করা।' },
    { term: 'হোল্ডিং নম্বর (Holding No)', def: 'ভূমি উন্নয়ন কর (খাজনা) আদায়ের জন্য তহশিল অফিসে সংরক্ষিত নির্দিষ্ট জমা বা অ্যাকাউন্টের পরিচিতি নম্বর।' },
    { term: '১৬ আনা হিস্যা (16 Anna Share)', def: 'পুরো জমির মালিকানাকে ১.০০ অংশ বা ষোলো আনা হিসেবে প্রকাশ করা।' },
    { term: 'তফশিল (Schedule of Land)', def: 'দলিল বা খতিয়ানে উল্লিখিত জমির জেলা, উপজেলা, মৌজা, জে.এল, দাগ ও সীমানার সুনির্দিষ্ট বিবরণ।' },
  ];

  return (
    <div className="font-bengali min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      {/* Title */}
      <div className="text-center mb-10 space-y-2">
        <span className="text-teal-700 font-bold text-xs uppercase tracking-wider">
          নাগরিক তথ্য ও সচেতনতা
        </span>
        <h1 className="text-3xl font-extrabold text-slate-900">
          সহায়তা ও সচরাচর জিজ্ঞাসা (FAQ)
        </h1>
        <p className="text-xs sm:text-sm text-slate-600">
          ভূমি সেবা, আইনগত প্রক্রিয়া ও ভূমিসাথী ব্যবহারের নির্দেশনাবলী
        </p>
      </div>

      {/* FAQs */}
      <div className="bg-white rounded-xl shadow-gov-sm border border-slate-200 p-6 mb-10">
        <h2 className="text-base font-bold text-slate-900 mb-4 pb-2 border-b flex items-center gap-2">
          <HelpCircle className="text-gov-blue" size={18} />
          সচরাচর জিজ্ঞাসিত প্রশ্নাবলী (FAQ)
        </h2>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div key={idx} className="border border-slate-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full flex items-center justify-between p-4 text-left font-bold text-xs sm:text-sm text-slate-800 bg-slate-50 hover:bg-slate-100 transition"
                >
                  <span>{faq.q}</span>
                  {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
                {isOpen && (
                  <div className="p-4 bg-white text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-200">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Land Law Glossary */}
      <div className="bg-white rounded-xl shadow-gov-sm border border-slate-200 p-6 mb-10">
        <h2 className="text-base font-bold text-slate-900 mb-4 pb-2 border-b flex items-center gap-2">
          <BookOpen className="text-teal-700" size={18} />
          ভূমি পরিভাষা কোষ (Land Term Glossary)
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          {glossary.map((g, idx) => (
            <div key={idx} className="bg-slate-50 p-3.5 rounded-lg border border-slate-200 space-y-1">
              <span className="font-bold text-slate-900 text-sm block text-gov-blue">
                {g.term}
              </span>
              <p className="text-slate-600 leading-relaxed">{g.def}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Hotlines */}
      <div className="bg-gradient-to-r from-emerald-50/80 via-teal-50/50 to-white text-slate-900 p-6 sm:p-8 rounded-2xl border border-emerald-300 shadow-card flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1">
          <h3 className="font-extrabold text-base sm:text-lg text-slate-900">সরাসরি সহায়তা প্রয়োজন?</h3>
          <p className="text-xs text-slate-600">
            ভূমি মন্ত্রণালয়ের সরকারি সেবা হেল্পলাইনে সার্বক্ষণিক যোগাযোগ করুন
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3 text-xs">
          <div className="flex items-center gap-2 bg-white px-4 py-2.5 rounded-xl border border-emerald-300 font-mono text-sm shadow-2xs">
            <Phone size={16} className="text-emerald-600" />
            <strong className="text-slate-900">১৬১২২</strong>
          </div>
          <div className="flex items-center gap-2 bg-white px-4 py-2.5 rounded-xl border border-slate-300 shadow-2xs text-slate-700">
            <Mail size={16} className="text-emerald-600" />
            <span>support@land.gov.bd</span>
          </div>
        </div>
      </div>
    </div>
  );
};
