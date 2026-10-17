import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../../services/api';
import { MutationApplication } from '../../../types';
import { StatusBadge } from '../../../components/common/StatusBadge';
import { useLanguage } from '../../../context/LanguageContext';
import {
  formatMouza,
  formatPlot,
  formatKhatian,
  formatArea,
  formatDigits,
} from '../../../utils/bilingual';
import {
  Scale,
  CalendarCheck,
  CheckCircle2,
  XCircle,
  Clock,
  Search,
  FileText,
  User,
  MapPin,
  Award,
  AlertTriangle,
  Building2,
  RefreshCw,
  FolderOpen
} from 'lucide-react';

export const AcLandMutationPage: React.FC = () => {
  const [mutations, setMutations] = useState<MutationApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCase, setSelectedCase] = useState<MutationApplication | null>(null);
  const { language } = useLanguage();
  const isBn = language === 'bn';

  // Hearing Modal
  const [showHearingModal, setShowHearingModal] = useState(false);
  const [hearingDate, setHearingDate] = useState('');
  const [hearingTime, setHearingTime] = useState(isBn ? 'সকাল ১০:৩০ মি.' : '10:30 AM');
  const [hearingNotes, setHearingNotes] = useState('');

  // Decision Modal
  const [decisionModal, setDecisionModal] = useState<'approve' | 'reject' | null>(null);
  const [orderNotes, setOrderNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [actionSuccessMessage, setActionSuccessMessage] = useState<string | null>(null);

  const fetchMutations = async () => {
    setLoading(true);
    try {
      const res = await api.mutations.list();
      if (res.success && res.data) {
        setMutations(res.data);
        if (selectedCase) {
          const updated = res.data.find((m: any) => m.id === selectedCase.id);
          if (updated) setSelectedCase(updated);
        } else if (res.data.length > 0) {
          setSelectedCase(res.data[0]);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMutations();
  }, []);

  const handleScheduleHearing = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCase || !hearingDate) return;

    setSubmitting(true);
    try {
      const res = await api.mutations.scheduleHearing(selectedCase.id, hearingDate, hearingTime);
      if (res.success) {
        setActionSuccessMessage(
          isBn
            ? (res.message_bn || 'শুনানির তারিখ সফলভাবে নির্ধারিত ও নোটিশ জারি হয়েছে।')
            : 'Hearing date scheduled and notice issued successfully.'
        );
        setShowHearingModal(false);
        await fetchMutations();
      } else {
        alert(res.message_bn || (isBn ? 'শুনানি নির্ধারণ ব্যর্থ হয়েছে।' : 'Failed to schedule hearing.'));
      }
    } catch (err: any) {
      alert(err.message || (isBn ? 'সার্ভার ত্রুটি।' : 'Server error.'));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDecision = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCase || !decisionModal) return;

    if (decisionModal === 'reject' && !orderNotes.trim()) {
      alert(isBn ? 'খারিজের কারণ উল্লেখ করা আবশ্যক।' : 'Rejection reason is required.');
      return;
    }

    setSubmitting(true);
    try {
      let res;
      if (decisionModal === 'approve') {
        res = await api.mutations.approve(
          selectedCase.id,
          orderNotes.trim() ||
            (isBn
              ? 'সাব-রেজিস্ট্রি দলিল ও সরেজমিন তদন্ত সাপেক্ষে নামজারি অনুমোদন করা হলো এবং নতুন নামজারি খতিয়ান সৃজন করা হলো।'
              : 'Mutation approved subject to registered deed and field investigation. New mutation khatian generated.')
        );
      } else {
        res = await api.mutations.reject(selectedCase.id, orderNotes.trim());
      }

      if (res.success) {
        setActionSuccessMessage(
          isBn
            ? (res.message_bn || 'আদেশ কার্যকর ও রেকর্ড হালনাগাদ হয়েছে।')
            : 'Order executed and land records updated successfully.'
        );
        setDecisionModal(null);
        await fetchMutations();
      } else {
        alert(res.message_bn || (isBn ? 'আদেশ কার্যকর করা যায়নি।' : 'Failed to execute order.'));
      }
    } catch (err: any) {
      alert(err.message || (isBn ? 'সার্ভার ত্রুটি।' : 'Server error.'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={`space-y-6 ${isBn ? 'font-bengali' : 'font-sans'}`}>
      {/* Top Banner */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Scale className="text-indigo-700 dark:text-indigo-400" size={20} />
            {isBn ? 'ই-নামজারি রাজস্ব আদালত ও খতিয়ান সৃজন (e-Mutation Docket)' : 'e-Mutation Revenue Court & Khatian Generation Docket'}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {isBn
              ? 'সাব-রেজিস্ট্রি দলিল সম্পন্নের পর স্বয়ংক্রিয়ভাবে দাখিলকৃত নামজারি মিস কেস, শুনানি ও নতুন খতিয়ান জারী'
              : 'Auto-docketed mutation misc cases after deed registration, judicial hearings, and new khatian issuance'}
          </p>
        </div>
        <button
          onClick={fetchMutations}
          className="p-2 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition self-start sm:self-auto flex items-center gap-1.5 text-xs font-semibold cursor-pointer"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          {isBn ? 'রিফ্রেশ' : 'Refresh'}
        </button>
      </div>

      {actionSuccessMessage && (
        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-300 text-sm flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={18} className="text-emerald-700 dark:text-emerald-400" />
            <span className="font-semibold">{actionSuccessMessage}</span>
          </div>
          <button
            onClick={() => setActionSuccessMessage(null)}
            className="text-xs text-emerald-800 dark:text-emerald-300 underline hover:text-emerald-950 cursor-pointer"
          >
            {isBn ? 'বন্ধ করুন' : 'Dismiss'}
          </button>
        </div>
      )}

      {/* 2-Column Split: Case List on Left, Active Docket on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Cases List (5 cols) */}
        <div className="lg:col-span-5 space-y-3">
          <h3 className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400 tracking-wider">
            {isBn ? `নামজারি মিস কেস তালিকা (${mutations.length})` : `Mutation Misc Cases (${mutations.length})`}
          </h3>

          <div className="space-y-2.5 max-h-[700px] overflow-y-auto pr-1">
            {loading ? (
              <div className="bg-white dark:bg-slate-900 p-8 text-center text-slate-500 dark:text-slate-400 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
                <Clock size={16} className="animate-spin inline-block mr-2 text-indigo-600 dark:text-indigo-400" />
                {isBn ? 'কেস তালিকা লোড হচ্ছে...' : 'Loading cases...'}
              </div>
            ) : mutations.length === 0 ? (
              <div className="bg-white dark:bg-slate-900 p-8 text-center text-slate-500 dark:text-slate-400 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
                {isBn ? 'কোন নামজারি কেস বিদ্যমান নেই।' : 'No mutation cases found.'}
              </div>
            ) : (
              mutations.map((mut) => {
                const isSelected = selectedCase?.id === mut.id;
                return (
                  <div
                    key={mut.id}
                    onClick={() => setSelectedCase(mut)}
                    className={`p-4 rounded-xl border transition cursor-pointer text-xs ${
                      isSelected
                        ? 'bg-indigo-50/90 dark:bg-[#0c1427] border-indigo-600 dark:border-indigo-500 shadow-md ring-1 ring-indigo-500/40 dark:ring-indigo-400/50'
                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50/60 dark:hover:bg-slate-800/40'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className={`font-mono font-bold px-2 py-0.5 rounded text-xs border ${
                        isSelected
                          ? 'text-indigo-800 dark:text-indigo-300 bg-white dark:bg-indigo-950/80 border-indigo-300 dark:border-indigo-700'
                          : 'text-indigo-900 dark:text-indigo-300 bg-white dark:bg-slate-800 border-indigo-200 dark:border-indigo-800'
                      }`}>
                        {mut.mutation_case_no || 'MUT-AC-2026-001'}
                      </span>
                      <StatusBadge status={mut.status || mut.current_stage} />
                    </div>

                    <p className={`font-semibold ${isSelected ? 'text-indigo-950 dark:text-white' : 'text-slate-800 dark:text-slate-200'}`}>
                      {isBn ? 'দলিল নং:' : 'Deed No:'}{' '}
                      <span className={`font-mono ${isSelected ? 'text-indigo-900 dark:text-indigo-200 font-bold' : 'text-slate-700 dark:text-slate-300'}`}>
                        {mut.deed_no || '3409/2026'}
                      </span>
                    </p>

                    <div className={`flex items-center justify-between text-[11px] mt-2 pt-2 border-t ${
                      isSelected
                        ? 'border-indigo-200/70 dark:border-indigo-800/60 text-slate-600 dark:text-slate-300'
                        : 'border-slate-100 dark:border-slate-800 text-slate-500 dark:text-slate-400'
                    }`}>
                      <span>{isBn ? 'মৌজা:' : 'Mouza:'} {formatMouza(mut, isBn)} | {formatPlot(mut.dag_no, isBn)}</span>
                      <span className={`font-bold ${isSelected ? 'text-indigo-900 dark:text-indigo-200' : 'text-slate-800 dark:text-slate-200'}`}>{formatArea(mut.transferred_area_decimal, isBn)}</span>
                    </div>

                    {mut.hearing_date && (
                      <div className={`mt-2 text-[11px] font-semibold flex items-center gap-1 ${
                        isSelected ? 'text-indigo-700 dark:text-indigo-300' : 'text-blue-700 dark:text-blue-400'
                      }`}>
                        <CalendarCheck size={12} />
                        {isBn ? 'শুনানি:' : 'Hearing:'} {mut.hearing_date}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right: Active Docket Inspection & Orders (7 cols) */}
        <div className="lg:col-span-7">
          {selectedCase ? (
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs p-6 space-y-6">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-base font-mono font-bold text-indigo-900 dark:text-indigo-300">
                      {selectedCase.mutation_case_no}
                    </span>
                    <StatusBadge status={selectedCase.status || selectedCase.current_stage} />
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    {isBn ? 'রেজিস্ট্রিকৃত কবলা দলিল নং:' : 'Registered Deed No:'} <strong className="font-mono text-slate-800 dark:text-slate-200">{selectedCase.deed_no || '3409/2026'}</strong>
                  </p>
                </div>

                {/* Hearing & Decision Action Buttons */}
                <div className="flex items-center gap-2 flex-wrap">
                  {selectedCase.status !== 'approved' && selectedCase.status !== 'rejected' && (
                    <>
                      <button
                        onClick={() => {
                          setShowHearingModal(true);
                          setHearingDate(new Date(Date.now() + 86400000 * 5).toISOString().split('T')[0]);
                        }}
                        className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition shadow-2xs cursor-pointer"
                      >
                        <CalendarCheck size={13} />
                        {isBn ? 'শুনানি নির্ধারণ' : 'Schedule Hearing'}
                      </button>

                      <button
                        onClick={() => {
                          setDecisionModal('approve');
                          setOrderNotes(isBn ? 'দলিল ও রেকর্ড যাচাই সম্পন্ন। নামজারি অনুমোদন এবং নতুন নামজারি খতিয়ান জারি করা হলো।' : 'Deed and records verified. Mutation approved and new khatian issued.');
                        }}
                        className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition shadow-2xs cursor-pointer"
                      >
                        <Award size={13} />
                        {isBn ? 'নামজারি অনুমোদন' : 'Approve Mutation'}
                      </button>

                      <button
                        onClick={() => {
                          setDecisionModal('reject');
                          setOrderNotes('');
                        }}
                        className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition shadow-2xs cursor-pointer"
                      >
                        <XCircle size={13} />
                        {isBn ? 'খারিজ' : 'Dismiss'}
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Created Khatian Banner (if approved) */}
              {selectedCase.approved_khatian_no && (
                <div className="p-4 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 text-purple-900 dark:text-purple-300 flex items-center gap-3">
                  <Award className="w-6 h-6 text-purple-700 dark:text-purple-400 shrink-0" />
                  <div>
                    <p className="font-bold text-sm">
                      {isBn ? 'সৃজিত নতুন নামজারি খতিয়ান নম্বর:' : 'Newly Generated Mutation Khatian No:'} <span className="font-mono text-base ml-1">{formatDigits(selectedCase.approved_khatian_no, isBn)}</span>
                    </p>
                    <p className="text-xs text-purple-800 dark:text-purple-300 mt-0.5">
                      {isBn
                        ? 'ক্রেতার নামে স্বতন্ত্র ১নং রেজিস্টার ভলিউম তৈরি হয়েছে এবং বিক্রেতার বায়া রেকর্ড কর্তন করা হয়েছে।'
                        : 'Independent 1 No. Register volume created for buyer and seller historical record debited.'}
                    </p>
                  </div>
                </div>
              )}

              {/* Deed & Parcel Info */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                  <span className="text-slate-400 block text-[11px]">{isBn ? 'মৌজা ও জেএল' : 'Mouza & JL'}</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {formatMouza(selectedCase, isBn)}, {isBn ? 'জেএল-' : 'JL-'}{formatDigits(selectedCase.jl_no || '07', isBn)}
                  </span>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                  <span className="text-slate-400 block text-[11px]">{isBn ? 'বায়া খতিয়ান নং' : 'Baya Khatian No'}</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white">{formatDigits(selectedCase.khatian_no || '4520', isBn)}</span>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                  <span className="text-slate-400 block text-[11px]">{isBn ? 'দাগ নম্বর' : 'Plot (Dag) No'}</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white">{formatDigits(selectedCase.dag_no || '108', isBn)}</span>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                  <span className="text-slate-400 block text-[11px]">{isBn ? 'হস্তান্তরিত পরিমাণ' : 'Transferred Area'}</span>
                  <span className="font-bold text-emerald-800 dark:text-emerald-400">{formatArea(selectedCase.transferred_area_decimal || '4.12', isBn)}</span>
                </div>
              </div>

              {/* Hearing Info Box */}
              {selectedCase.hearing_date && (
                <div className="p-4 rounded-xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 text-xs">
                  <h4 className="font-bold text-blue-950 dark:text-blue-300 flex items-center gap-1.5 mb-2">
                    <CalendarCheck size={14} className="text-blue-700 dark:text-blue-400" />
                    {isBn ? 'ধার্যকৃত শুনানির নোটিশ' : 'Scheduled Hearing Notice'}
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-slate-700 dark:text-slate-300">
                    <div>
                      <span className="text-slate-500 dark:text-slate-400">{isBn ? 'শুনানির তারিখ:' : 'Hearing Date:'}</span> <strong className="text-slate-900 dark:text-white ml-1">{selectedCase.hearing_date}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 dark:text-slate-400">{isBn ? 'আদালত কক্ষ:' : 'Court Room:'}</span> <strong className="text-slate-900 dark:text-white ml-1">{isBn ? 'সহকারী কমিশনার (ভূমি) এর এজলাস' : 'Assistant Commissioner (Land) Court'}</strong>
                    </div>
                  </div>
                </div>
              )}

              {/* Judicial Orders History */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400 tracking-wider">
                  {isBn ? 'বিচারিক আদেশ ও রায়ের সংক্ষিপ্তসার' : 'Judicial Order & Judgment Summary'}
                </h4>
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300 space-y-2">
                  <p className="font-medium leading-relaxed">
                    {isBn
                      ? (selectedCase.order_summary_bn || 'উপজেলা রাজস্ব আদালতে নামজারি মিস কেস দাখিল হয়েছে। দলিল ও মাঠ জরিপ যাচাই প্রক্রিয়াধীন।')
                      : 'e-Mutation misc case docketed in Upazila Revenue Court. Registered deed and field inspection verification in progress.'}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-12 text-center text-slate-500 dark:text-slate-400 text-xs">
              {isBn ? 'বাম পাশ থেকে একটি নামজারি মিস কেস নির্বাচন করুন।' : 'Select a mutation misc case from the left list.'}
            </div>
          )}
        </div>
      </div>

      {/* Hearing Schedule Modal */}
      {showHearingModal && selectedCase && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className={`bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 ${isBn ? 'font-bengali' : 'font-sans'}`}>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
              <CalendarCheck className="w-5 h-5 text-blue-600" />
              {isBn ? 'ই-নামজারি শুনানির তারিখ ও নোটিশ জারী' : 'Schedule Hearing & Issue Notice'}
            </h3>

            <form onSubmit={handleScheduleHearing} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300 block">
                  {isBn ? 'শুনানির তারিখ *' : 'Hearing Date *'}
                </label>
                <input
                  type="date"
                  value={hearingDate}
                  onChange={(e) => setHearingDate(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300 block">
                  {isBn ? 'শুনানির সময় ও কক্ষ' : 'Hearing Time & Chamber'}
                </label>
                <input
                  type="text"
                  value={hearingTime}
                  onChange={(e) => setHearingTime(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs"
                />
              </div>

              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                {isBn
                  ? '* তারিখ নির্ধারণের সাথে সাথে উভয় পক্ষের (ক্রেতা ও বিক্রেতা) ইন-অ্যাপ নোটিফিকেশনে শুনানির নোটিশ পৌঁছে যাবে।'
                  : '* Both parties (buyer and seller) will receive automated in-app notifications and notices upon scheduling.'}
              </p>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowHearingModal(false)}
                  className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
                  disabled={submitting}
                >
                  {isBn ? 'বাতিল' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition flex items-center gap-1.5 cursor-pointer"
                >
                  {submitting ? (isBn ? 'সংরক্ষণ হচ্ছে...' : 'Saving...') : (isBn ? 'নোটিশ জারী করুন' : 'Issue Notice')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Decision Modal */}
      {decisionModal && selectedCase && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className={`bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 ${isBn ? 'font-bengali' : 'font-sans'}`}>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
              {decisionModal === 'approve' ? (
                <>
                  <Award className="w-5 h-5 text-emerald-600" />
                  {isBn ? 'চূড়ান্ত নামজারি অনুমোদন ও খতিয়ান সৃজন' : 'Final Mutation Approval & Khatian Creation'}
                </>
              ) : (
                <>
                  <XCircle className="w-5 h-5 text-rose-600" />
                  {isBn ? 'নামজারি আবেদন খারিজকরণ' : 'Dismiss Mutation Case'}
                </>
              )}
            </h3>

            <form onSubmit={handleDecision} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300 block">
                  {decisionModal === 'approve'
                    ? (isBn ? 'বিচারিক আদেশের অনুলিপি ও রায়' : 'Judicial Order Transcript & Verdict')
                    : (isBn ? 'খারিজের সুনির্দিষ্ট কারণ *' : 'Specific Grounds for Dismissal *')}
                </label>
                <textarea
                  rows={4}
                  value={orderNotes}
                  onChange={(e) => setOrderNotes(e.target.value)}
                  placeholder={
                    decisionModal === 'approve'
                      ? (isBn ? 'সাব-রেজিস্ট্রি কবলা দলিল ও সরেজমিন তদন্ত সঠিক হওয়ায় নামজারি মঞ্জুর করা হলো।' : 'Mutation granted upon verification of deed and field inspection.')
                      : (isBn ? 'উপযুক্ত বায়া দলিল ও ওয়ারিশান সনদের অনুপস্থিতিতে আবেদনটি খারিজ করা হলো।' : 'Application dismissed due to lack of chain deeds / succession certificate.')
                  }
                  className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs"
                  required={decisionModal === 'reject'}
                />
              </div>

              {decisionModal === 'approve' && (
                <div className="p-3 bg-purple-50 dark:bg-purple-950/40 rounded-lg border border-purple-200 dark:border-purple-800 text-purple-900 dark:text-purple-300 text-[11px]">
                  <strong>{isBn ? 'স্বয়ংক্রিয় কার্যক্রম:' : 'Automated Action:'}</strong>{' '}
                  {isBn
                    ? 'অনুমোদনের সাথে সাথে সিস্টেমে ক্রেতার নামে নতুন একটি অনলাইন নামজারি খতিয়ান তৈরি হবে এবং জমির হিস্যা হালনাগাদ হবে।'
                    : 'Upon approval, a new online mutation khatian is created in the buyer’s name and land shares are updated.'}
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setDecisionModal(null)}
                  className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
                  disabled={submitting}
                >
                  {isBn ? 'বাতিল' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className={`px-4 py-2 rounded-lg text-white font-bold transition flex items-center gap-1.5 cursor-pointer ${
                    decisionModal === 'approve' ? 'bg-emerald-700 hover:bg-emerald-800' : 'bg-rose-600 hover:bg-rose-700'
                  }`}
                >
                  {submitting
                    ? (isBn ? 'কার্যকর হচ্ছে...' : 'Executing...')
                    : decisionModal === 'approve'
                    ? (isBn ? 'অনুমোদন ও খতিয়ান সৃজন' : 'Approve & Issue Khatian')
                    : (isBn ? 'খারিজ নিশ্চিত করুন' : 'Confirm Dismissal')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AcLandMutationPage;
