import React from 'react';
import { FolderCheck, FileText, CheckCircle2, ShieldCheck, AlertCircle } from 'lucide-react';
import { useLanguage } from '../../../context/LanguageContext';

export const RegistryDocumentsPage: React.FC = () => {
  const { language } = useLanguage();
  const isBn = language === 'bn';

  return (
    <div className={`space-y-6 ${isBn ? 'font-bengali' : 'font-sans'}`}>
      <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <FolderCheck className="text-amber-700 dark:text-amber-400" size={20} />
          {isBn ? 'দলিল মুসাবিদা ও সরকারি স্ট্যাম্প শুল্ক যাচাই' : 'Deed Drafting & Stamp Duty Verification'}
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          {isBn
            ? 'রেজিস্ট্রেশন আইনের বিধিমালা অনুযায়ী নন-জুডিশিয়াল স্ট্যাম্প ও প্রয়োজনীয় সনদের তালিকা'
            : 'Statutory non-judicial stamp duty fees and mandatory documentation per the Registration Act'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 space-y-3">
          <h3 className="font-bold text-sm text-slate-800 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
            <FileText size={16} className="text-amber-700 dark:text-amber-400" />
            {isBn ? 'স্ট্যাম্প শুল্ক ও সরকারি ফি হার (সিটি কর্পোরেশন এলাকা)' : 'Stamp Duty & Govt Fees (City Corporation Area)'}
          </h3>
          <div className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
            <div className="flex justify-between p-2 rounded bg-slate-50 dark:bg-slate-800/60">
              <span>{isBn ? 'স্ট্যাম্প শুল্ক (Stamp Duty):' : 'Stamp Duty:'}</span>
              <strong className="text-slate-900 dark:text-white">1.5%</strong>
            </div>
            <div className="flex justify-between p-2 rounded bg-slate-50 dark:bg-slate-800/60">
              <span>{isBn ? 'রেজিস্ট্রেশন ফি (Registration Fee):' : 'Registration Fee:'}</span>
              <strong className="text-slate-900 dark:text-white">1.0%</strong>
            </div>
            <div className="flex justify-between p-2 rounded bg-slate-50 dark:bg-slate-800/60">
              <span>{isBn ? 'স্থানীয় সরকার কর (LGI Tax):' : 'Local Govt Tax (LGI):'}</span>
              <strong className="text-slate-900 dark:text-white">2.0% - 3.0%</strong>
            </div>
            <div className="flex justify-between p-2 rounded bg-slate-50 dark:bg-slate-800/60">
              <span>{isBn ? 'উৎস কর (TDS - ধারা ৫৩এইচ):' : 'Tax Deducted at Source (TDS - Sec 53H):'}</span>
              <strong className="text-slate-900 dark:text-white">{isBn ? 'এলাকাভিত্তিক নির্ধারিত হার' : 'Area Zonal Fixed Rate'}</strong>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 space-y-3">
          <h3 className="font-bold text-sm text-slate-800 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
            <ShieldCheck size={16} className="text-emerald-700 dark:text-emerald-400" />
            {isBn ? 'দলিল নিবন্ধনের পূর্বে আবশ্যকীয় শর্তাবলী' : 'Mandatory Pre-requisites Before Registration'}
          </h3>
          <ul className="list-disc pl-4 space-y-2 text-xs text-slate-600 dark:text-slate-400">
            <li>{isBn ? 'বিক্রেতার নামে বিএস খতিয়ান থাকা বাধ্যতামূলক।' : 'BS record in seller’s name is mandatory.'}</li>
            <li>{isBn ? 'সর্বশেষ অর্থবছরের ভূমি উন্নয়ন কর (খাজনা) পরিশোধিত দাখিলা সংযুক্ত থাকিতে হইবে।' : 'Up-to-date Land Development Tax (Dakhila) receipt for current fiscal year.'}</li>
            <li>{isBn ? 'জমির চৌহদ্দি স্কেচ ম্যাপ ও হাতনকশা দলিলের সহিত সংযুক্ত করিতে হইবে।' : 'Boundary sketch map and layout plan attached to deed.'}</li>
            <li>{isBn ? 'ক্রেতা ও বিক্রেতার জাতীয় পরিচয়পত্র এবং টিপসহি ডিজিটাল ডিভাইসে ধারণ করিতে হইবে।' : 'Digital biometric fingerprint capture and NID biometric verification.'}</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default RegistryDocumentsPage;
