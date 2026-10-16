import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { SaleApplication } from '../../types';
import {
  CheckCircle2,
  Calendar,
  Building2,
  FileText,
  Printer,
  Clock,
  AlertTriangle,
  FolderCheck,
  Check,
} from 'lucide-react';
import { DeedDraftModal } from '../../components/common/DeedDraftModal';

export const RegistrationChecklistPage: React.FC = () => {
  const [applications, setApplications] = useState<SaleApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAppForDeed, setSelectedAppForDeed] = useState<SaleApplication | null>(null);

  useEffect(() => {
    const fetchApps = async () => {
      setLoading(true);
      const res = await api.getMyApplications();
      if (res.success && res.data) {
        setApplications(res.data);
      }
      setLoading(false);
    };
    fetchApps();
  }, []);

  const checklistItems = [
    { title: 'মূল আর.এস / বি.এস খতিয়ান ও পর্চা', note: 'মূল কপি এবং ২ সেট সার্টিফাইড অনুলিপি' },
    { title: 'হালনাগাদ ভূমি উন্নয়ন কর (খাজনা) দাখিলা ও ক্লিয়ারেন্স সনদ', note: 'চলতি অর্থবছরের পরিশোধিত দাখিলা' },
    { title: 'ক্রেতা ও বিক্রেতার জাতীয় পরিচয়পত্র (NID) ও ছবি', note: 'উভয় পক্ষের সদ্যতোলা ২ কপি পাসপোর্ট সাইজ সত্যায়িত ছবি' },
    { title: 'মূল বায়া দলিল বা ওয়ারিশান সনদ (প্রযোজ্য ক্ষেত্রে)', note: 'মালিকানা অর্জনের ধারাবাহিক ঐতিহাসিক দলিল' },
    { title: 'প্রস্তুতিমূলক খসড়া দলিল ও ই-রেজিস্ট্রেশন টোকেন স্লিপ', note: 'ভূমিসাথী পোর্টাল থেকে ডাউনলোডকৃত ৩ কপি' },
  ];

  return (
    <div className="font-bengali space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
          <Building2 className="text-gov-blue" size={24} />
          রেজিস্ট্রেশন অ্যাপয়েন্টমেন্ট ও নথি চেকলিস্ট
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          সাব-রেজিস্ট্রি অফিসে উপস্থিতির সময়সূচি, কাউন্টার টোকেন ও প্রয়োজনীয় নথির প্রস্তুতি
        </p>
      </div>

      {/* Appointment Information Card */}
      <div className="bg-white rounded-xl shadow-gov-sm border border-slate-200 p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-3">
          <div>
            <span className="text-xs font-semibold text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
              নির্ধারিত অ্যাপয়েন্টমেন্ট
            </span>
            <h2 className="text-lg font-bold text-slate-900 mt-1">গুলশান সাব-রেজিস্ট্রি অফিস, ঢাকা</h2>
          </div>
          <div className="text-right">
            <span className="text-[11px] text-slate-500 block">কাউন্টার টোকেন নম্বর</span>
            <span className="text-xl font-mono font-black text-gov-blue">TOK-418</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs bg-slate-50 p-4 rounded-lg border">
          <div className="flex items-center gap-3">
            <Calendar className="text-gov-blue" size={20} />
            <div>
              <span className="text-slate-500 block">তারিখ:</span>
              <strong className="text-slate-900 text-sm">২০ মার্চ, ২০২৬</strong>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Clock className="text-indigo-600" size={20} />
            <div>
              <span className="text-slate-500 block">সময় স্লট:</span>
              <strong className="text-slate-900 text-sm">সকাল ১১:০০ - দুপুর ১২:৩০</strong>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <FolderCheck className="text-emerald-600" size={20} />
            <div>
              <span className="text-slate-500 block">দায়িত্বপ্রাপ্ত বুথ:</span>
              <strong className="text-slate-900 text-sm">কাউন্টার নং ৩ (ই-রেজিস্ট্রি)</strong>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs">
          <span className="text-slate-600">
            * নির্ধারিত সময়ের ৩০ মিনিট পূর্বে উভয় পক্ষকে প্রয়োজনীয় মূল কাগজপত্রসহ উপস্থিত থাকার অনুরোধ করা হচ্ছে।
          </span>

          {applications.length > 0 && (
            <button
              onClick={() => setSelectedAppForDeed(applications[0])}
              className="inline-flex items-center gap-1.5 bg-gov-blue hover:bg-slate-900 text-white px-4 py-2 rounded-lg font-semibold shadow-sm transition"
            >
              <Printer size={15} />
              <span>প্রস্তুতিমূলক দলিল প্যাকেট প্রিন্ট করুন</span>
            </button>
          )}
        </div>
      </div>

      {/* Mandatory Document Checklist */}
      <div className="bg-white rounded-xl shadow-gov-sm border border-slate-200 p-6 space-y-4">
        <h3 className="font-bold text-slate-900 text-sm border-b pb-2 flex items-center gap-2">
          <CheckCircle2 className="text-teal-600" size={18} />
          সাব-রেজিস্ট্রি অফিসে দাখিলের প্রয়োজনীয় নথিপত্রের চেকলিস্ট
        </h3>

        <div className="space-y-3">
          {checklistItems.map((item, idx) => (
            <div
              key={idx}
              className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 flex items-start justify-between gap-3 text-xs"
            >
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center shrink-0 mt-0.5">
                  <Check size={13} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">{item.title}</h4>
                  <p className="text-slate-500 text-[11px] mt-0.5">{item.note}</p>
                </div>
              </div>

              <span className="bg-white text-slate-700 px-2.5 py-1 rounded border text-[10px] font-semibold shrink-0">
                বাধ্যতামূলক
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Statutory Disclaimer */}
      <div className="p-4 bg-slate-100 rounded-xl border border-slate-300 text-xs text-slate-600 leading-normal">
        <strong>আইনি নির্দেশনা:</strong> সাব-রেজিস্ট্রার কর্তৃক দাতার পরিচয় যাচাই, বায়োমেট্রিক ফিঙ্গারপ্রিন্ট গ্রহণ এবং রেজিস্ট্রেশন আইনের ৫৮ ধারা মতে নিবন্ধন সম্পন্ন না হওয়া পর্যন্ত কোনো মালিকানা হস্তান্তর আইনগতভাবে কার্যকর হয় না।
      </div>

      {selectedAppForDeed && (
        <DeedDraftModal
          application={selectedAppForDeed}
          onClose={() => setSelectedAppForDeed(null)}
        />
      )}
    </div>
  );
};
