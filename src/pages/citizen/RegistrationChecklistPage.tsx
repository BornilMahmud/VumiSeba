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
  FolderCheck,
  Check,
  ShieldAlert,
} from 'lucide-react';
import { DeedDraftModal } from '../../components/common/DeedDraftModal';
import { useLanguage } from '../../context/LanguageContext';

export const RegistrationChecklistPage: React.FC = () => {
  const { language } = useLanguage();
  const isBn = language === 'bn';
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
    {
      title: isBn ? 'মূল আর.এস / বি.এস খতিয়ান ও পর্চা' : 'Original R.S / B.S Khatian & Porcha',
      note: isBn ? 'মূল কপি এবং ২ সেট সার্টিফাইড অনুলিপি' : 'Original copy and 2 sets of certified copies',
    },
    {
      title: isBn ? 'হালনাগাদ ভূমি উন্নয়ন কর (খাজনা) দাখিলা ও ক্লিয়ারেন্স সনদ' : 'Up-to-date Land Development Tax Receipt (Dakhila) & Clearance',
      note: isBn ? 'চলতি অর্থবছরের পরিশোধিত দাখিলা' : 'Current fiscal year tax payment receipt',
    },
    {
      title: isBn ? 'ক্রেতা ও বিক্রেতার জাতীয় পরিচয়পত্র (NID) ও ছবি' : 'Buyer & Seller National ID (NID) & Photographs',
      note: isBn ? 'উভয় পক্ষের সদ্যতোলা ২ কপি পাসপোর্ট সাইজ সত্যায়িত ছবি' : '2 passport-size attested photos for both parties',
    },
    {
      title: isBn ? 'মূল বায়া দলিল বা ওয়ারিশান সনদ (প্রযোজ্য ক্ষেত্রে)' : 'Original Parent Deed (Baya Deed) or Succession Certificate',
      note: isBn ? 'মালিকানা অর্জনের ধারাবাহিক ঐতিহাসিক দলিল' : 'Chain of title succession and inheritance documents',
    },
    {
      title: isBn ? 'প্রস্তুতিমূলক খসড়া দলিল ও ই-রেজিস্ট্রেশন টোকেন স্লিপ' : 'Draft Deed & e-Registration Token Slip',
      note: isBn ? 'ভূমিসাথী পোর্টাল থেকে ডাউনলোডকৃত ৩ কপি' : '3 copies downloaded from the digital portal',
    },
  ];

  return (
    <div className={`${isBn ? 'font-bengali' : 'font-sans'} space-y-6 max-w-4xl mx-auto`}>
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
          <Building2 className="text-emerald-700 dark:text-emerald-400" size={24} />
          {isBn ? 'রেজিস্ট্রেশন অ্যাপয়েন্টমেন্ট ও নথি চেকলিস্ট' : 'Registration Appointment & Document Checklist'}
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          {isBn
            ? 'সাব-রেজিস্ট্রি অফিসে উপস্থিতির সময়সূচি, কাউন্টার টোকেন ও প্রয়োজনীয় নথির প্রস্তুতি'
            : 'Sub-Registry appearance schedule, counter tokens, and statutory document preparation'}
        </p>
      </div>

      {/* Appointment Information Card */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-gov-sm border border-slate-200 dark:border-slate-800 p-6 space-y-4 transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
          <div>
            <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/80 px-2.5 py-1 rounded-lg border border-emerald-200 dark:border-emerald-800/80">
              {isBn ? 'নির্ধারিত অ্যাপয়েন্টমেন্ট' : 'Confirmed Appointment'}
            </span>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mt-1.5">
              {isBn ? 'গুলশান সাব-রেজিস্ট্রি অফিস, ঢাকা' : 'Gulshan Sub-Registry Office, Dhaka'}
            </h2>
          </div>
          <div className="text-left sm:text-right">
            <span className="text-[11px] text-slate-500 dark:text-slate-400 block">
              {isBn ? 'কাউন্টার টোকেন নম্বর' : 'Counter Token No'}
            </span>
            <span className="text-xl font-mono font-black text-emerald-700 dark:text-emerald-400">
              TOK-418
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs bg-slate-50/80 dark:bg-slate-800/60 p-4 rounded-xl border border-slate-200/80 dark:border-slate-700/70 transition-colors">
          <div className="flex items-center gap-3">
            <Calendar className="text-emerald-600 dark:text-emerald-400 shrink-0" size={20} />
            <div>
              <span className="text-slate-400 dark:text-slate-400 text-[11px] block">{isBn ? 'তারিখ:' : 'Date:'}</span>
              <strong className="text-slate-900 dark:text-slate-100 text-sm">{isBn ? '২০ মার্চ, ২০২৬' : 'March 20, 2026'}</strong>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Clock className="text-indigo-600 dark:text-indigo-400 shrink-0" size={20} />
            <div>
              <span className="text-slate-400 dark:text-slate-400 text-[11px] block">{isBn ? 'সময় স্লট:' : 'Time Slot:'}</span>
              <strong className="text-slate-900 dark:text-slate-100 text-sm">{isBn ? 'সকাল ১১:০০ - দুপুর ১২:৩০' : '11:00 AM - 12:30 PM'}</strong>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <FolderCheck className="text-emerald-600 dark:text-emerald-400 shrink-0" size={20} />
            <div>
              <span className="text-slate-400 dark:text-slate-400 text-[11px] block">{isBn ? 'দায়িত্বপ্রাপ্ত বুথ:' : 'Assigned Booth:'}</span>
              <strong className="text-slate-900 dark:text-slate-100 text-sm">{isBn ? 'কাউন্টার নং ৩ (ই-রেজিস্ট্রি)' : 'Counter #3 (e-Registry)'}</strong>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs">
          <span className="text-slate-500 dark:text-slate-400">
            {isBn
              ? '* নির্ধারিত সময়ের ৩০ মিনিট পূর্বে উভয় পক্ষকে প্রয়োজনীয় মূল কাগজপত্রসহ উপস্থিত থাকার অনুরোধ করা হচ্ছে।'
              : '* Both parties are requested to arrive 30 minutes before the scheduled slot with all original documents.'}
          </span>

          {applications.length > 0 && (
            <button
              onClick={() => setSelectedAppForDeed(applications[0])}
              className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white dark:bg-emerald-600 dark:hover:bg-emerald-500 px-4 py-2 rounded-xl font-bold shadow-2xs transition cursor-pointer"
            >
              <Printer size={15} />
              <span>{isBn ? 'প্রস্তুতিমূলক দলিল প্যাকেট প্রিন্ট করুন' : 'Print Preparatory Deed Packet'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Mandatory Document Checklist (Dark Theme Color Balanced & Rounded) */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-gov-sm border border-slate-200 dark:border-slate-800 p-6 space-y-4 transition-colors">
        <h3 className="font-bold text-slate-900 dark:text-white text-sm border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center gap-2">
          <CheckCircle2 className="text-emerald-600 dark:text-emerald-400" size={18} />
          <span>
            {isBn
              ? 'সাব-রেজিস্ট্রি অফিসে দাখিলের প্রয়োজনীয় নথিপত্রের চেকলিস্ট'
              : 'Mandatory Document Checklist for Sub-Registry Submission'}
          </span>
        </h3>

        <div className="space-y-3">
          {checklistItems.map((item, idx) => (
            <div
              key={idx}
              className="p-4 bg-slate-50/90 dark:bg-slate-800/70 hover:bg-slate-100/90 dark:hover:bg-slate-800/95 rounded-2xl border border-slate-200/80 dark:border-slate-700/60 flex items-start justify-between gap-3 text-xs transition-colors shadow-2xs"
            >
              <div className="flex items-start gap-3.5">
                <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-400 dark:border dark:border-emerald-700/60 flex items-center justify-center shrink-0 mt-0.5">
                  <Check size={14} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-slate-100 text-xs">{item.title}</h4>
                  <p className="text-slate-500 dark:text-slate-400 text-[11px] mt-0.5 leading-relaxed">{item.note}</p>
                </div>
              </div>

              <span className="bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/70 dark:text-emerald-300 dark:border-emerald-800/80 px-2.5 py-1 rounded-xl border text-[10px] font-bold shrink-0">
                {isBn ? 'বাধ্যতামূলক' : 'Mandatory'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Statutory Disclaimer */}
      <div className="p-4.5 bg-slate-100 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 leading-relaxed space-y-1">
        <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-slate-200">
          <ShieldAlert size={14} className="text-amber-600 dark:text-amber-400" />
          <span>{isBn ? 'আইনি নির্দেশনা:' : 'Statutory Notice:'}</span>
        </div>
        <p className="text-slate-600 dark:text-slate-400 text-[11px]">
          {isBn
            ? 'সাব-রেজিস্ট্রার কর্তৃক দাতার পরিচয় যাচাই, বায়োমেট্রিক ফিঙ্গারপ্রিন্ট গ্রহণ এবং রেজিস্ট্রেশন আইনের ৫৮ ধারা মতে নিবন্ধন সম্পন্ন না হওয়া পর্যন্ত কোনো মালিকানা হস্তান্তর আইনগতভাবে কার্যকর হয় না।'
            : 'Transfer of title becomes legally effective only after verification of executant identity, biometric fingerprint capture, and formal statutory endorsement under Section 58 of the Registration Act by the Sub-Registrar.'}
        </p>
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

export default RegistrationChecklistPage;
