import React from 'react';
import { FolderCheck, FileText, CheckCircle2, ShieldCheck, AlertCircle } from 'lucide-react';

export const RegistryDocumentsPage: React.FC = () => {
  return (
    <div className="space-y-6 font-bengali">
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <FolderCheck className="text-amber-700" size={20} />
          দলিল মুসাবিদা ও সরকারি স্ট্যাম্প শুল্ক যাচাই
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          রেজিস্ট্রেশন আইনের বিধিমালা অনুযায়ী নন-জুডিশিয়াল স্ট্যাম্প ও প্রয়োজনীয় সনদের তালিকা
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-3">
          <h3 className="font-bold text-sm text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-2">
            <FileText size={16} className="text-amber-700" />
            স্ট্যাম্প শুল্ক ও সরকারি ফি হার (সিটি কর্পোরেশন এলাকা)
          </h3>
          <div className="space-y-2 text-xs text-slate-700">
            <div className="flex justify-between p-2 rounded bg-slate-50">
              <span>স্ট্যাম্প শুল্ক (Stamp Duty):</span>
              <strong className="text-slate-900">১.৫%</strong>
            </div>
            <div className="flex justify-between p-2 rounded bg-slate-50">
              <span>রেজিস্ট্রেশন ফি (Registration Fee):</span>
              <strong className="text-slate-900">১.০%</strong>
            </div>
            <div className="flex justify-between p-2 rounded bg-slate-50">
              <span>স্থানীয় সরকার কর (LGI Tax):</span>
              <strong className="text-slate-900">২.০% - ৩.০%</strong>
            </div>
            <div className="flex justify-between p-2 rounded bg-slate-50">
              <span>উৎস কর (TDS - ধারা ৫৩এইচ):</span>
              <strong className="text-slate-900">এলাকাভিত্তিক নির্ধারিত হার</strong>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-3">
          <h3 className="font-bold text-sm text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-2">
            <ShieldCheck size={16} className="text-emerald-700" />
            দলিল নিবন্ধনের পূর্বে আবশ্যকীয় শর্তাবলী
          </h3>
          <ul className="list-disc pl-4 space-y-2 text-xs text-slate-600">
            <li>বিক্রেতার নামে বিএস খতিয়ান থাকা বাধ্যতামূলক।</li>
            <li>সর্বশেষ অর্থবছরের ভূমি উন্নয়ন কর (খাজনা) পরিশোধিত দাখিলা সংযুক্ত থাকিতে হইবে।</li>
            <li>জমির চৌহদ্দি স্কেচ ম্যাপ ও হাতনকশা দলিলের সহিত সংযুক্ত করিতে হইবে।</li>
            <li>ক্রেতা ও বিক্রেতার জাতীয় পরিচয়পত্র এবং টিপসহি ডিজিটাল ডিভাইসে ধারণ করিতে হইবে।</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default RegistryDocumentsPage;
