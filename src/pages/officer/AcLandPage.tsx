import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { MutationApplication } from '../../types';
import StatusBadge from '../../components/common/StatusBadge';
import { 
  Scale, 
  Calendar, 
  Clock, 
  FileCheck2, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  FileText, 
  Sparkles, 
  Building,
  UserCheck,
  ChevronRight
} from 'lucide-react';

export default function AcLandPage() {
  const { user } = useAuth();
  const [mutations, setMutations] = useState<MutationApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMutation, setSelectedMutation] = useState<MutationApplication | null>(null);

  // Hearing scheduling state
  const [hearingDate, setHearingDate] = useState('২০২৪-০৪-২৫');
  const [hearingTime, setHearingTime] = useState('সকাল ১১:০০ টা');
  const [schedulingHearing, setSchedulingHearing] = useState(false);

  // Approval / Rejection states
  const [approvalNotes, setApprovalNotes] = useState('যাবতীয় মূল দলিল, ইউনিয়ন ভূমি অফিসের তদন্ত প্রতিবেদন ও রেজিস্ট্রি রেকর্ড পুঙ্খানুপুঙ্খ পরীক্ষা করে সন্তুষ্ট হওয়ায় প্রস্তাবিত নামজারি ও জমাভাগ অনুমোদন করা হলো।');
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await api.officer.acLandQueue();
      if (res.data) {
        setMutations(res.data);
        if (res.data.length > 0 && !selectedMutation) {
          setSelectedMutation(res.data[0]);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleScheduleHearing = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMutation) return;

    setSchedulingHearing(true);
    setMessage(null);

    try {
      const res = await api.mutations.scheduleHearing(selectedMutation.id, hearingDate, hearingTime);
      if (res.error) {
        setMessage({ text: res.error, type: 'error' });
      } else {
        setMessage({ text: 'উভয় পক্ষের জন্য শুনানির নোটিশ ও তারিখ সফলভাবে ধার্য করা হয়েছে!', type: 'success' });
        loadData();
      }
    } catch (err) {
      setMessage({ text: 'শুনানি ধার্য করতে সমস্যা হয়েছে', type: 'error' });
    } finally {
      setSchedulingHearing(false);
    }
  };

  const handleApprove = async () => {
    if (!selectedMutation) return;
    if (!window.confirm('আপনি কি নিশ্চিত যে এই নামজারি আবেদনটি অনুমোদন করে নতুন খতিয়ান ও জোত সৃজন করতে চান?')) return;

    setActionLoading(true);
    setMessage(null);

    try {
      const res = await api.mutations.approve(selectedMutation.id, approvalNotes);
      if (res.error) {
        setMessage({ text: res.error, type: 'error' });
      } else {
        setMessage({ 
          text: `নামজারি সফলভাবে অনুমোদিত! নতুন খতিয়ান নম্বর: ${res.data?.resultingKhatianNo}`, 
          type: 'success' 
        });
        loadData();
      }
    } catch (err) {
      setMessage({ text: 'অনুমোদনে সমস্যা হয়েছে', type: 'error' });
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMutation || !rejectReason) return;

    setActionLoading(true);
    setMessage(null);

    try {
      const res = await api.mutations.reject(selectedMutation.id, rejectReason);
      if (res.error) {
        setMessage({ text: res.error, type: 'error' });
      } else {
        setMessage({ text: 'নামজারি আবেদন বাতিল ও কারণ রেকর্ড করা হয়েছে', type: 'success' });
        setShowRejectModal(false);
        loadData();
      }
    } catch (err) {
      setMessage({ text: 'বাতিল করতে সমস্যা হয়েছে', type: 'error' });
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="p-1.5 bg-teal-50 text-teal-700 rounded-md">
                <Scale className="w-5 h-5" />
              </span>
              <h1 className="text-2xl font-bold text-slate-900">সহকারী কমিশনার (ভূমি) এর বিচারিক প্যানেল</h1>
            </div>
            <p className="text-sm text-slate-500">
              ই-নামজারি মামলার বিচারিক শুনানি, তহশিলদার তদন্ত রিপোর্ট পর্যালোচনা এবং চূড়ান্ত নামজারি খতিয়ান অনুমোদন।
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-teal-100 text-teal-800 text-xs font-bold rounded-full">
              অপেক্ষমাণ মামলা: {mutations.length} টি
            </span>
          </div>
        </div>
      </div>

      {message && (
        <div className={`p-4 rounded-xl text-xs font-medium flex items-center gap-2 ${
          message.type === 'success' ? 'bg-emerald-50 border border-emerald-200 text-emerald-800' : 'bg-red-50 border border-red-200 text-red-800'
        }`}>
          {message.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
          {message.text}
        </div>
      )}

      {loading ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center text-slate-400">
          মামলার তালিকা লোড হচ্ছে...
        </div>
      ) : mutations.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
          <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-800 mb-1">বর্তমানে কোনো নামজারি মামলা পেন্ডিং নেই</h3>
          <p className="text-xs text-slate-500">সাব-রেজিস্ট্রি থেকে দলিল সম্পাদনের পর নতুন মামলা আসলে এখানে প্রদর্শিত হবে।</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Case list */}
          <div className="lg:col-span-1 space-y-3">
            <h2 className="text-xs font-bold text-slate-700 uppercase tracking-wider px-1">
              ই-নামজারি কেস তালিকা ({mutations.length})
            </h2>
            {mutations.map((m) => {
              const isSelected = selectedMutation?.id === m.id;
              return (
                <div
                  key={m.id}
                  onClick={() => setSelectedMutation(m)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-slate-900 text-white border-slate-900 shadow-md'
                      : 'bg-white text-slate-800 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                      isSelected ? 'bg-slate-800 text-teal-400' : 'bg-slate-100 text-slate-700'
                    }`}>
                      {m.mutationCaseNumber}
                    </span>
                    <StatusBadge status={m.status} />
                  </div>
                  <div className="text-sm font-semibold mb-1">
                    খতিয়ান #{m.targetKhatianNo} • দাগ #{m.targetDagNo}
                  </div>
                  <div className={`text-xs ${isSelected ? 'text-slate-300' : 'text-slate-500'}`}>
                    ক্রেতা: {m.buyerCitizenId}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Case Dossier & Judicial Decision Area */}
          {selectedMutation && (
            <div className="lg:col-span-2 space-y-6">
              {/* Dossier Header */}
              <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100">
                  <div>
                    <span className="text-xs text-slate-500 block">বিচারিক নামজারি কেস ডকেট</span>
                    <span className="text-xl font-bold font-mono text-slate-900">
                      {selectedMutation.mutationCaseNumber}
                    </span>
                  </div>
                  <StatusBadge status={selectedMutation.status} />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs pt-4">
                  <div>
                    <span className="text-slate-500 block">আবেদনকারী (ক্রেতা):</span>
                    <span className="font-semibold text-slate-800 font-mono">{selectedMutation.buyerCitizenId}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">প্রতিপক্ষ (সাবেক মালিক):</span>
                    <span className="font-semibold text-slate-800 font-mono">{selectedMutation.sellerCitizenId}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">খতিয়ান ও দাগ:</span>
                    <span className="font-semibold text-slate-800">
                      খতিয়ান {selectedMutation.targetKhatianNo}, দাগ {selectedMutation.targetDagNo}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">সাব-রেজিস্ট্রি দলিল নং:</span>
                    <span className="font-semibold text-slate-800 font-mono">{selectedMutation.saleAppId}</span>
                  </div>
                </div>

                {/* Union Land Office report preview */}
                <div className="mt-4 p-4 bg-slate-50 border border-slate-200 rounded-lg text-xs">
                  <div className="flex items-center gap-2 font-bold text-slate-800 mb-1">
                    <FileCheck2 className="w-4 h-4 text-emerald-600" />
                    ইউনিয়ন ভূমি সহকারী কর্মকর্তার সরেজমিন তদন্ত প্রতিবেদন:
                  </div>
                  {selectedMutation.unionReport ? (
                    <div>
                      <p className="text-slate-700 leading-relaxed font-medium">
                        "{selectedMutation.unionReport.recommendation}"
                      </p>
                      <div className="mt-2 text-slate-400 text-[11px]">
                        তদন্ত কর্মকর্তা: {selectedMutation.unionReport.officerId} • তারিখ: {selectedMutation.unionReport.submittedAt}
                      </div>
                    </div>
                  ) : (
                    <p className="text-amber-700">ইউনিয়ন ভূমি অফিস থেকে সরেজমিন প্রতিবেদন এখনও আসেনি (প্রক্রিয়াধীন)।</p>
                  )}
                </div>
              </div>

              {/* Hearing Date Scheduling */}
              <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
                <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                  <Calendar className="w-5 h-5 text-teal-600" />
                  <h3 className="text-base font-bold text-slate-900">
                    শুনানির তারিখ ও সময় নির্ধারণ (Notice of Hearing)
                  </h3>
                </div>

                {selectedMutation.hearingDate ? (
                  <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg text-xs flex items-center justify-between">
                    <div>
                      <span className="font-bold text-amber-900 block">শুনানির তারিখ নির্ধারিত আছে:</span>
                      <span className="text-amber-800 font-semibold">{selectedMutation.hearingDate} ({selectedMutation.hearingTime})</span>
                    </div>
                    <span className="px-2.5 py-1 bg-amber-200 text-amber-900 font-bold rounded text-[11px]">
                      নোটিশ জারি সম্পন্ন
                    </span>
                  </div>
                ) : (
                  <form onSubmit={handleScheduleHearing} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">শুনানির তারিখ</label>
                      <input
                        type="date"
                        value={hearingDate}
                        onChange={(e) => setHearingDate(e.target.value)}
                        className="w-full text-xs p-2.5 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-teal-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">শুনানির সময়</label>
                      <input
                        type="text"
                        value={hearingTime}
                        onChange={(e) => setHearingTime(e.target.value)}
                        placeholder="যেমন: সকাল ১১:০০ টা"
                        className="w-full text-xs p-2.5 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-teal-500"
                        required
                      />
                    </div>
                    <div className="flex items-end">
                      <button
                        type="submit"
                        disabled={schedulingHearing}
                        className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition-colors disabled:opacity-50"
                      >
                        {schedulingHearing ? 'নোটিশ হচ্ছে...' : 'শুনানির নোটিশ জারি করুন'}
                      </button>
                    </div>
                  </form>
                )}
              </div>

              {/* Final Judicial Decision & Khatian Issuance */}
              <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
                <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                  <Sparkles className="w-5 h-5 text-emerald-600" />
                  <h3 className="text-base font-bold text-slate-900">
                    চূড়ান্ত নামজারি আদেশ ও নতুন খতিয়ান সৃজন
                  </h3>
                </div>

                {selectedMutation.status === 'APPROVED' ? (
                  <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg text-xs">
                    <div className="font-bold text-emerald-900 text-sm mb-1">
                      নামজারি অনুমোদিত হয়েছে এবং নতুন খতিয়ান কার্যকর!
                    </div>
                    <div className="text-emerald-800">
                      সৃজিত খতিয়ান নং: <span className="font-mono font-bold">{selectedMutation.resultingKhatianNo}</span> | 
                      নতুন জোত নং: <span className="font-mono font-bold">{selectedMutation.resultingHoldingNo}</span>
                    </div>
                  </div>
                ) : (
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      আদেশের কারণ ও বিচারিক নোট (Judicial Order Note)
                    </label>
                    <textarea
                      rows={3}
                      value={approvalNotes}
                      onChange={(e) => setApprovalNotes(e.target.value)}
                      className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none mb-4"
                    ></textarea>

                    <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => setShowRejectModal(true)}
                        disabled={actionLoading}
                        className="px-4 py-2 border border-red-300 text-red-700 hover:bg-red-50 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors disabled:opacity-50"
                      >
                        <XCircle className="w-4 h-4" />
                        নামজারি বাতিল করুন
                      </button>

                      <button
                        type="button"
                        onClick={handleApprove}
                        disabled={actionLoading}
                        className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold flex items-center gap-2 transition-colors shadow-sm disabled:opacity-50"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        {actionLoading ? 'অনুমোদন হচ্ছে...' : 'অনুমোদন ও নতুন খতিয়ান সৃজন করুন'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Rejection Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleReject} className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 text-red-600">
              <XCircle className="w-5 h-5" />
              নামজারি আবেদন বাতিলের কারণ লিপিবদ্ধ করুন
            </h3>
            <p className="text-xs text-slate-500">
              বাতিলের সুনির্দিষ্ট আইনানুগ কারণ উল্লেখ করুন। এই কারণটি আবেদনকারীর ড্যাশবোর্ডে ও আদেশের নথিতে স্থায়ীভাবে রেকর্ড হবে।
            </p>
            <textarea
              rows={4}
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="যেমন: শুনানিতে বিক্রেতার বৈধ স্বত্ব প্রমাণিত হয়নি / দেওয়ানি আদালতের নিষেধাজ্ঞা বিদ্যমান..."
              className="w-full text-xs p-2.5 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-red-500"
              required
            ></textarea>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowRejectModal(false)}
                className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                ফিরে যান
              </button>
              <button
                type="submit"
                disabled={actionLoading}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold"
              >
                চূড়ান্ত বাতিল নিশ্চিত করুন
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
