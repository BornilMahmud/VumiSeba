import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../../services/api';
import { MutationApplication } from '../../../types';
import { StatusBadge } from '../../../components/common/StatusBadge';
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

  // Hearing Modal
  const [showHearingModal, setShowHearingModal] = useState(false);
  const [hearingDate, setHearingDate] = useState('');
  const [hearingTime, setHearingTime] = useState('সকাল ১০:৩০ মি.');
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
        setActionSuccessMessage(res.message_bn || 'শুনানির তারিখ সফলভাবে নির্ধারিত ও নোটিশ জারি হয়েছে।');
        setShowHearingModal(false);
        await fetchMutations();
      } else {
        alert(res.message_bn || 'শুনানি নির্ধারণ ব্যর্থ হয়েছে।');
      }
    } catch (err: any) {
      alert(err.message || 'সার্ভার ত্রুটি।');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDecision = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCase || !decisionModal) return;

    if (decisionModal === 'reject' && !orderNotes.trim()) {
      alert('খারিজের কারণ উল্লেখ করা আবশ্যক।');
      return;
    }

    setSubmitting(true);
    try {
      let res;
      if (decisionModal === 'approve') {
        res = await api.mutations.approve(selectedCase.id, orderNotes.trim() || 'সাব-রেজিস্ট্রি দলিল ও সরেজমিন তদন্ত সাপেক্ষে নামজারি অনুমোদন করা হলো এবং নতুন নামজারি খতিয়ান সৃজন করা হলো।');
      } else {
        res = await api.mutations.reject(selectedCase.id, orderNotes.trim());
      }

      if (res.success) {
        setActionSuccessMessage(res.message_bn || 'আদেশ কার্যকর ও রেকর্ড হালনাগাদ হয়েছে।');
        setDecisionModal(null);
        await fetchMutations();
      } else {
        alert(res.message_bn || 'আদেশ কার্যকর করা যায়নি।');
      }
    } catch (err: any) {
      alert(err.message || 'সার্ভার ত্রুটি।');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 font-bengali">
      {/* Top Banner */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Scale className="text-indigo-700" size={20} />
            ই-নামজারি রাজস্ব আদালত ও খতিয়ান সৃজন (e-Mutation Docket)
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            সাব-রেজিস্ট্রি দলিল সম্পন্নের পর স্বয়ংক্রিয়ভাবে দাখিলকৃত নামজারি মিস কেস, শুনানি ও নতুন খতিয়ান জারী
          </p>
        </div>
        <button
          onClick={fetchMutations}
          className="p-2 border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-50 transition self-start sm:self-auto flex items-center gap-1.5 text-xs font-semibold"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          রিফ্রেশ
        </button>
      </div>

      {actionSuccessMessage && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-sm flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={18} className="text-emerald-700" />
            <span className="font-semibold">{actionSuccessMessage}</span>
          </div>
          <button
            onClick={() => setActionSuccessMessage(null)}
            className="text-xs text-emerald-800 underline hover:text-emerald-950"
          >
            বন্ধ করুন
          </button>
        </div>
      )}

      {/* 2-Column Split: Case List on Left, Active Docket on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Cases List (5 cols) */}
        <div className="lg:col-span-5 space-y-3">
          <h3 className="text-xs font-bold uppercase text-slate-500 tracking-wider">
            নামজারি মিস কেস তালিকা ({mutations.length})
          </h3>

          <div className="space-y-2.5 max-h-[700px] overflow-y-auto pr-1">
            {loading ? (
              <div className="bg-white p-8 text-center text-slate-500 rounded-xl border border-slate-200 text-xs">
                <Clock size={16} className="animate-spin inline-block mr-2 text-indigo-600" />
                কেস তালিকা লোড হচ্ছে...
              </div>
            ) : mutations.length === 0 ? (
              <div className="bg-white p-8 text-center text-slate-500 rounded-xl border border-slate-200 text-xs">
                কোন নামজারি কেস বিদ্যমান নেই।
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
                        ? 'bg-indigo-50/80 border-indigo-500 shadow-xs'
                        : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/60'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono font-bold text-indigo-900 bg-white px-2 py-0.5 rounded border border-indigo-200">
                        {mut.mutation_case_no || 'MUT-AC-2026-001'}
                      </span>
                      <StatusBadge status={mut.status || mut.current_stage} />
                    </div>

                    <p className="font-semibold text-slate-800">
                      দলিল নং: <span className="font-mono">{mut.deed_no || '৩৪০৯/২০২৬'}</span>
                    </p>

                    <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2 pt-2 border-t border-slate-100">
                      <span>মৌজা: {mut.mouza_bn || 'সাঁতারকুল'} | দাগ: {mut.dag_no}</span>
                      <span className="font-bold text-slate-800">{mut.transferred_area_decimal} শতক</span>
                    </div>

                    {mut.hearing_date && (
                      <div className="mt-2 text-[11px] font-semibold text-blue-700 flex items-center gap-1">
                        <CalendarCheck size={12} />
                        শুনানি: {mut.hearing_date}
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
            <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-6 space-y-6">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-base font-mono font-bold text-indigo-900">
                      {selectedCase.mutation_case_no}
                    </span>
                    <StatusBadge status={selectedCase.status || selectedCase.current_stage} />
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    রেজিস্ট্রিকৃত কবলা দলিল নং: <strong className="font-mono text-slate-800">{selectedCase.deed_no || '৩৪০৯/২০২৬'}</strong>
                  </p>
                </div>

                {/* Hearing & Decision Action Buttons */}
                <div className="flex items-center gap-2">
                  {selectedCase.status !== 'approved' && selectedCase.status !== 'rejected' && (
                    <>
                      <button
                        onClick={() => {
                          setShowHearingModal(true);
                          setHearingDate(new Date(Date.now() + 86400000 * 5).toISOString().split('T')[0]);
                        }}
                        className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition shadow-2xs"
                      >
                        <CalendarCheck size={13} />
                        শুনানি নির্ধারণ
                      </button>

                      <button
                        onClick={() => {
                          setDecisionModal('approve');
                          setOrderNotes('দলিল ও রেকর্ড যাচাই সম্পন্ন। নামজারি অনুমোদন এবং নতুন নামজারি খতিয়ান জারি করা হলো।');
                        }}
                        className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition shadow-2xs"
                      >
                        <Award size={13} />
                        নামজারি অনুমোদন
                      </button>

                      <button
                        onClick={() => {
                          setDecisionModal('reject');
                          setOrderNotes('');
                        }}
                        className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition shadow-2xs"
                      >
                        <XCircle size={13} />
                        খারিজ
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Created Khatian Banner (if approved) */}
              {selectedCase.approved_khatian_no && (
                <div className="p-4 rounded-xl bg-purple-50 border border-purple-200 text-purple-900 flex items-center gap-3">
                  <Award className="w-6 h-6 text-purple-700 shrink-0" />
                  <div>
                    <p className="font-bold text-sm">সৃজিত নতুন নামজারি খতিয়ান নম্বর: <span className="font-mono text-base ml-1">{selectedCase.approved_khatian_no}</span></p>
                    <p className="text-xs text-purple-800 mt-0.5">ক্রেতার নামে স্বতন্ত্র ১নং রেজিস্টার ভলিউম তৈরি হয়েছে এবং বিক্রেতার বায়া রেকর্ড কর্তন করা হয়েছে।</p>
                  </div>
                </div>
              )}

              {/* Deed & Parcel Info */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="text-slate-400 block text-[11px]">মৌজা ও জেএল</span>
                  <span className="font-semibold text-slate-800">{selectedCase.mouza_bn || 'সাঁতারকুল'}, জেএল-{selectedCase.jl_no || '০৭'}</span>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="text-slate-400 block text-[11px]">বায়া খতিয়ান নং</span>
                  <span className="font-mono font-bold text-slate-900">{selectedCase.khatian_no || '৪৫২০'}</span>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="text-slate-400 block text-[11px]">দাগ নম্বর</span>
                  <span className="font-mono font-bold text-slate-900">{selectedCase.dag_no || '১০৮'}</span>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="text-slate-400 block text-[11px]">হস্তান্তরিত পরিমাণ</span>
                  <span className="font-bold text-emerald-800">{selectedCase.transferred_area_decimal || '৪.১২'} শতক</span>
                </div>
              </div>

              {/* Hearing Info Box */}
              {selectedCase.hearing_date && (
                <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200 text-xs">
                  <h4 className="font-bold text-blue-950 flex items-center gap-1.5 mb-2">
                    <CalendarCheck size={14} className="text-blue-700" />
                    ধার্যকৃত শুনানির নোটিশ
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-slate-700">
                    <div>
                      <span className="text-slate-500">শুনানির তারিখ:</span> <strong className="text-slate-900 ml-1">{selectedCase.hearing_date}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500">আদালত কক্ষ:</span> <strong className="text-slate-900 ml-1">সহকারী কমিশনার (ভূমি) এর এজলাস</strong>
                    </div>
                  </div>
                </div>
              )}

              {/* Judicial Orders History */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase text-slate-500 tracking-wider">
                  বিচারিক আদেশ ও রায়ের সংক্ষিপ্তসার
                </h4>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-2">
                  <p className="font-medium">
                    {selectedCase.order_summary_bn || 'উপজেলা রাজস্ব আদালতে নামজারি মিস কেস দাখিল হয়েছে। দলিল ও মাঠ জরিপ যাচাই প্রক্রিয়াধীন।'}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-slate-200 p-12 text-center text-slate-500 text-xs font-bengali">
              বাম পাশ থেকে একটি নামজারি মিস কেস নির্বাচন করুন।
            </div>
          )}
        </div>
      </div>

      {/* Hearing Schedule Modal */}
      {showHearingModal && selectedCase && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 font-bengali">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
              <CalendarCheck className="w-5 h-5 text-blue-600" />
              ই-নামজারি শুনানির তারিখ ও নোটিশ জারী
            </h3>

            <form onSubmit={handleScheduleHearing} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-700 block">শুনানির তারিখ *</label>
                <input
                  type="date"
                  value={hearingDate}
                  onChange={(e) => setHearingDate(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 block">শুনানির সময় ও কক্ষ</label>
                <input
                  type="text"
                  value={hearingTime}
                  onChange={(e) => setHearingTime(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs"
                />
              </div>

              <p className="text-[11px] text-slate-500">
                * তারিখ নির্ধারণের সাথে সাথে উভয় পক্ষের (ক্রেতা ও বিক্রেতা) ইন-অ্যাপ নোটিফিকেশনে শুনানির নোটিশ পৌঁছে যাবে।
              </p>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowHearingModal(false)}
                  className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 font-semibold hover:bg-slate-50"
                  disabled={submitting}
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition flex items-center gap-1.5"
                >
                  {submitting ? 'সংরক্ষণ হচ্ছে...' : 'নোটিশ জারী করুন'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Decision Modal */}
      {decisionModal && selectedCase && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 font-bengali">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
              {decisionModal === 'approve' ? (
                <>
                  <Award className="w-5 h-5 text-emerald-600" />
                  চূড়ান্ত নামজারি অনুমোদন ও খতিয়ান সৃজন
                </>
              ) : (
                <>
                  <XCircle className="w-5 h-5 text-rose-600" />
                  নামজারি আবেদন খারিজকরণ
                </>
              )}
            </h3>

            <form onSubmit={handleDecision} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-700 block">
                  {decisionModal === 'approve' ? 'বিচারিক আদেশের অনুলিপি ও রায়' : 'খারিজের সুনির্দিষ্ট কারণ *'}
                </label>
                <textarea
                  rows={4}
                  value={orderNotes}
                  onChange={(e) => setOrderNotes(e.target.value)}
                  placeholder={
                    decisionModal === 'approve'
                      ? 'সাব-রেজিস্ট্রি কবলা দলিল ও সরেজমিন তদন্ত সঠিক হওয়ায় নামজারি মঞ্জুর করা হলো।'
                      : 'উপযুক্ত বায়া দলিল ও ওয়ারিশান সনদের অনুপস্থিতিতে আবেদনটি খারিজ করা হলো।'
                  }
                  className="w-full p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs"
                  required={decisionModal === 'reject'}
                />
              </div>

              {decisionModal === 'approve' && (
                <div className="p-3 bg-purple-50 rounded-lg border border-purple-200 text-purple-900 text-[11px]">
                  <strong>স্বয়ংক্রিয় কার্যক্রম:</strong> অনুমোদনের সাথে সাথে সিস্টেমে ক্রেতার নামে নতুন একটি অনলাইন নামজারি খতিয়ান (যেমন: নামজারি-৫xxx) তৈরি হবে এবং জমির হিস্যা হালনাগাদ হবে।
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setDecisionModal(null)}
                  className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 font-semibold hover:bg-slate-50"
                  disabled={submitting}
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className={`px-4 py-2 rounded-lg text-white font-bold transition flex items-center gap-1.5 ${
                    decisionModal === 'approve' ? 'bg-emerald-700 hover:bg-emerald-800' : 'bg-rose-600 hover:bg-rose-700'
                  }`}
                >
                  {submitting ? 'কার্যকর হচ্ছে...' : decisionModal === 'approve' ? 'অনুমোদন ও খতিয়ান সৃজন' : 'খারিজ নিশ্চিত করুন'}
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
