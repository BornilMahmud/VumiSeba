import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { HelpCircle, ChevronDown, BookOpen, Phone, Mail } from 'lucide-react';

export const HelpPage: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const { language } = useLanguage();
  const isBn = language === 'bn';

  const faqs = [
    {
      q: isBn ? 'কেনার আগে জমি যাচাই (P5) কেন জরুরি?' : 'Why is Pre-Purchase Land Audit (P5) critical?',
      a: isBn
        ? 'বাংলাদেশে জমি সংক্রান্ত অধিকাংশ মামলা ও প্রতারণার কারণ হলো—বিক্রেতার নিজের চেয়ে বেশি জমি বিক্রির চেষ্টা, অপ্রকাশিত ব্যাংক ঋণ/মর্টগেজ, কিংবা বিচারাধীন আদালতের নিষেধাজ্ঞা। ভূমিসাথীর মাধ্যমে বায়না করার পূর্বেই সরকারি রেকর্ডরুম ও রাজস্ব ডাটাবেজ তুলনা করে ঝুঁকি নিরূপণ করা যায়।'
        : 'Most land disputes in Bangladesh stem from excess-share sales, undisclosed bank mortgages, or pending civil court injunctions. VumiSeba audits official land and revenue databases in real-time before earnest money is committed.',
    },
    {
      q: isBn ? 'বকেয়া খাজনা থাকলে কি জমি বিক্রির আবেদন করা যাবে?' : 'Can a land sale proceed if holding taxes are unpaid?',
      a: isBn
        ? 'না। ভূমিসাথী প্ল্যাটফর্মের সার্ভার-সাইড নীতি অনুসারে যে জমিতে ভূমি উন্নয়ন কর বকেয়া রয়েছে, সেই জমির কোনো আনুষ্ঠানিক বিক্রয় আবেদন দাখিল করা যাবে না। বিক্রেতাকে অবশ্যই অনলাইনে বা সরাসরি কর পরিশোধ করে ই-দাখিলা গ্রহণ করতে হবে।'
        : 'No. Under statutory rules and VumiSeba server guards, holding tax arrears completely block application progression. The seller must clear land development taxes online and obtain a digital e-Dakhila before selling.',
    },
    {
      q: isBn ? 'দলিল রেজিস্ট্রির পর আলাদা করে কি নামজারির আবেদন করতে হবে?' : 'Do citizens need a separate mutation application after deed registration?',
      a: isBn
        ? 'না, এটিই ভূমিসাথী (P4) প্ল্যাটফর্মের মূল উদ্ভাবন। সাব-রেজিস্ট্রি অফিসে দলিল নিবন্ধিত হওয়ার সাথে সাথেই স্বয়ংক্রিয়ভাবে সহকারী কমিশনার (ভূমি) অফিসে একটি পোস্ট-রেজিস্ট্রেশন নামজারি কেস শুরু হয়ে যায়। নাগরিককে নতুন করে ফি দিয়ে আলাদা আবেদন করতে হয় না।'
        : 'No, this is the core breakthrough of the P4 smart registry integration. Deed registration at the Sub-Registry office automatically triggers a mutation case at the AC Land office, eliminating duplicate applications and fees.',
    },
    {
      q: isBn ? 'ইউনিক সিটিজেন আইডি (Unique Citizen ID) কী?' : 'What is the Unique Citizen ID?',
      a: isBn
        ? 'জাতীয় পরিচয়পত্র ও কেওয়াইসি (KYC) যাচাইয়ের পর সিস্টেমে প্রতিটি নাগরিকের জন্য একটি অনন্য সুরক্ষিত পরিচিতি নম্বর (যেমন: BHM-CIT-882194) তৈরি হয়। সরাসরি সংবেদনশীল এনআইডি পাবলিক পোর্টালে প্রকাশ না করে এই সুরক্ষিত আইডির মাধ্যমে লেনদেন পরিচালিত হয়।'
        : 'After NID and KYC authentication, the system generates a secure pseudonymized identifier (e.g. BHM-CIT-882194) to protect sensitive national IDs during land transactions.',
    },
    {
      q: isBn ? 'একটি কম-ঝুঁকি ফলাফল কি শতভাগ আইনি গ্যারান্টি?' : 'Is a low-risk audit result an absolute legal guarantee?',
      a: isBn
        ? 'না। কোনো বেসরকারি বা পাইলট প্ল্যাটফর্ম আদালতের বা সরকারি সিলমোহরের বিকল্প হতে পারে না। এটি একটি সিদ্ধান্ত-সহায়ক টুল। বায়না বা বড় অংকের অর্থ হস্তান্তরের পূর্বে মূল বায়া দলিল ও শারীরিক দখল সরেজমিনে বিজ্ঞ আইনজীবী দ্বারা যাচাই করা আবশ্যক।'
        : 'No. While VumiSeba automates cross-checks across government registries, physical boundary inspections and historic title deeds should always be cross-verified before transferring large funds.',
    },
  ];

  const glossary = [
    {
      term: isBn ? 'খতিয়ান (Porcha / Record of Rights)' : 'Khatian (Record of Rights)',
      def: isBn
        ? 'জমি জরিপের পর সরকার কর্তৃক প্রণীত ভূমির স্বত্ব ও মালিকানার আনুষ্ঠানিক রেকর্ড বিবরণী (CS, SA, RS, BS)।'
        : 'Official government record documenting land ownership, plot numbers, and title history (CS, SA, RS, BS).',
    },
    {
      term: isBn ? 'দাগ নম্বর (Dag / Plot No)' : 'Dag Number (Plot No)',
      def: isBn
        ? 'মৌজা নকশা বা মানচিত্রে প্রতিটি পৃথক ভূমি খণ্ডের জন্য নির্ধারিত অনন্য প্লট নম্বর।'
        : 'Unique plot number assigned to every distinct parcel of land on official mouza cadastral maps.',
    },
    {
      term: isBn ? 'বায়া দলিল (Baya / Chain Deed)' : 'Baya Deed (Chain Deed)',
      def: isBn
        ? 'বর্তমান বিক্রেতা কীভাবে পূর্বে জমির মালিকানা অর্জন করেছিলেন, সেই মূল ঐতিহাসিক দলিল বা ধারাবাহিক দলিলসমূহ।'
        : 'Historical chain of deeds showing how previous owners transferred title to the current seller.',
    },
    {
      term: isBn ? 'নামজারি / খারিজ (e-Mutation)' : 'E-Mutation (Namzari)',
      def: isBn
        ? 'পুরাতন মালিকের খতিয়ান হতে নাম কেটে নতুন ক্রেতা বা ওয়ারিশের নামে নতুন খতিয়ান খোলার সরকারি প্রক্রিয়া।'
        : 'Statutory process of updating the land register to record the new buyer and deduct seller acreage.',
    },
    {
      term: isBn ? 'জমাভাগ (Sub-division / Batowara)' : 'Sub-Division (Holding Split)',
      def: isBn
        ? 'যৌথ খতিয়ান থেকে কোনো শরিকের অংশ আলাদা করে নতুন জোত ও খাজনা নির্ধারণ করা।'
        : 'Separating an individual co-sharer parcel from a joint khatian into an independent holding.',
    },
    {
      term: isBn ? 'হোল্ডিং নম্বর (Holding No)' : 'Holding Number',
      def: isBn
        ? 'ভূমি উন্নয়ন কর (খাজনা) আদায়ের জন্য তহশিল অফিসে সংরক্ষিত নির্দিষ্ট জমা বা অ্যাকাউন্টের পরিচিতি নম্বর।'
        : 'Unique account identifier maintained at the Tahsil office for land revenue assessment and tax collection.',
    },
    {
      term: isBn ? '১৬ আনা হিস্যা (16 Anna Share)' : '16 Anna Share System',
      def: isBn
        ? 'পুরো জমির মালিকানাকে ১.০০ অংশ বা ষোলো আনা হিসেবে প্রকাশ করা।'
        : 'Traditional Bengal legal accounting system representing 100% total property ownership as 16 Annas (1.0000).',
    },
    {
      term: isBn ? 'তফশিল (Schedule of Land)' : 'Schedule of Land (Tafsil)',
      def: isBn
        ? 'দলিল বা খতিয়ানে উল্লিখিত জমির জেলা, উপজেলা, মৌজা, জে.এল, দাগ ও সীমানার সুনির্দিষ্ট বিবরণ।'
        : 'Precise geographic description specifying district, upazila, mouza, JL number, plot boundary, and area.',
    },
  ];

  return (
    <div className={`${isBn ? 'font-bengali' : 'font-sans'} min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 py-10 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto transition-colors`}>
      {/* Title */}
      <div className="text-center mb-10 space-y-2">
        <span className="text-teal-700 dark:text-teal-400 font-bold text-xs uppercase tracking-wider">
          {isBn ? 'নাগরিক তথ্য ও সচেতনতা' : 'Citizen Information & Awareness'}
        </span>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
          {isBn ? 'সহায়তা ও সচরাচর জিজ্ঞাসা (FAQ)' : 'Help & Frequently Asked Questions (FAQ)'}
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
          {isBn
            ? 'ভূমি সেবা, আইনগত প্রক্রিয়া ও ভূমিসাথী ব্যবহারের নির্দেশনাবলী'
            : 'Land governance, statutory regulations, and comprehensive guides for using VumiSeba'}
        </p>
      </div>

      {/* FAQs */}
      <div className="bg-white dark:bg-[#0c1427] rounded-2xl shadow-gov-sm border border-slate-200 dark:border-slate-800 p-6 mb-10 transition-colors">
        <h2 className="text-base font-bold text-slate-900 dark:text-white mb-4 pb-2 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
          <HelpCircle className="text-gov-blue dark:text-teal-400" size={18} />
          {isBn ? 'সচরাচর জিজ্ঞাসিত প্রশ্নাবলী (FAQ)' : 'Frequently Asked Questions'}
        </h2>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className={`border rounded-xl overflow-hidden transition-all duration-300 ease-in-out ${
                  isOpen
                    ? 'border-emerald-500/80 dark:border-emerald-500/70 shadow-xs ring-1 ring-emerald-500/20'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className={`w-full flex items-center justify-between p-4 text-left font-bold text-xs sm:text-sm transition-colors duration-200 cursor-pointer ${
                    isOpen
                      ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-900 dark:text-emerald-300'
                      : 'bg-slate-50 hover:bg-slate-100 dark:bg-[#111a30] dark:hover:bg-[#162244] text-slate-800 dark:text-slate-100'
                  }`}
                >
                  <span className="pr-4">{faq.q}</span>
                  <ChevronDown
                    size={18}
                    className={`shrink-0 transition-transform duration-300 ease-in-out ${
                      isOpen ? 'rotate-180 text-emerald-600 dark:text-emerald-400' : 'text-slate-400 dark:text-slate-400'
                    }`}
                  />
                </button>
                <div
                  className={`grid transition-all duration-300 ease-in-out ${
                    isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="p-4 bg-white dark:bg-[#0a0f1d] text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800/80">
                      {faq.a}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Land Law Glossary */}
      <div className="bg-white dark:bg-[#0c1427] rounded-2xl shadow-gov-sm border border-slate-200 dark:border-slate-800 p-6 mb-10 transition-colors">
        <h2 className="text-base font-bold text-slate-900 dark:text-white mb-4 pb-2 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
          <BookOpen className="text-teal-700 dark:text-teal-400" size={18} />
          {isBn ? 'ভূমি পরিভাষা কোষ (Land Term Glossary)' : 'Land Terminology & Legal Glossary'}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          {glossary.map((g, idx) => (
            <div key={idx} className="bg-slate-50 dark:bg-[#111a30] p-4 rounded-xl border border-slate-200 dark:border-slate-800/80 space-y-1.5 transition-colors">
              <span className="font-bold text-gov-blue dark:text-teal-300 text-sm block">
                {g.term}
              </span>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{g.def}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Hotlines */}
      <div className="bg-emerald-50 dark:bg-[#0a1628] bg-gradient-to-r from-emerald-50 via-teal-50/60 to-emerald-50/80 dark:from-[#0a1628] dark:via-[#0e2433] dark:to-[#07241c] text-slate-900 dark:text-slate-100 p-6 sm:p-8 rounded-2xl border border-emerald-300/80 dark:border-emerald-800/80 shadow-card flex flex-col sm:flex-row items-center justify-between gap-4 transition-colors">
        <div className="space-y-1">
          <h3 className="font-extrabold text-base sm:text-lg text-slate-900 dark:text-white">
            {isBn ? 'সরাসরি সহায়তা প্রয়োজন?' : 'Need Instant Assistance?'}
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-300">
            {isBn
              ? 'ভূমি মন্ত্রণালয়ের সরকারি সেবা হেল্পলাইনে সার্বক্ষণিক যোগাযোগ করুন'
              : 'Contact the Ministry of Land 24/7 Citizen Support Hotline'}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3 text-xs">
          <div className="flex items-center gap-2 bg-white dark:bg-[#111a30] px-4 py-2.5 rounded-xl border border-emerald-300 dark:border-emerald-700/70 font-mono text-sm shadow-2xs">
            <Phone size={16} className="text-emerald-600 dark:text-emerald-400" />
            <strong className="text-slate-900 dark:text-white">{isBn ? '১৬১২২' : '16122'}</strong>
          </div>
          <div className="flex items-center gap-2 bg-white dark:bg-[#111a30] px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700/70 shadow-2xs text-slate-700 dark:text-slate-300">
            <Mail size={16} className="text-emerald-600 dark:text-emerald-400" />
            <span>support@land.gov.bd</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpPage;
