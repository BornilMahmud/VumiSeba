import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { MutationApplication, SaleApplication } from '../../types';
import StatusBadge from '../../components/common/StatusBadge';
import { 
  GitBranch, 
  Clock, 
  Calendar, 
  FileCheck2, 
  CheckCircle2, 
  AlertCircle, 
  FileText, 
  UserCheck, 
  ChevronRight,
  Printer,
  Sparkles
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function MutationTrackingPage() {
  const { user } = useAuth();
  const [mutations, setMutations] = useState<MutationApplication[]>([]);
  const [saleApps, setSaleApps] = useState<Record<string, SaleApplication>>({});
  const [loading, setLoading] = useState(true);
  const [selectedMutation, setSelectedMutation] = useState<MutationApplication | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await api.mutations.list();
        if (res.data) {
          setMutations(res.data);
          if (res.data.length > 0) {
            setSelectedMutation(res.data[0]);
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const timelineSteps = [
    { key: 'SUBMITTED', title: 'নামজারি আবেদন জমা', desc: 'সাব-রেজিস্ট্রি থেকে দলিল সম্পাদনের পর স্বয়ংক্রিয় আবেদন তৈরি' },
    { key: 'UNION_REPORT_PENDING', title: 'তহশিলদার তদন্ত রিপোর্ট', desc: 'ইউনিয়ন ভূমি সহকারী কর্মকর্তা কর্তৃক সরেজমিন দখল ও রেকর্ড যাচাই' },
    { key: 'HEARING_SCHEDULED', title: 'শুনানির তারিখ ধার্য', desc: 'সহকারী কমিশনার (ভূমি) কর্তৃক উভয় পক্ষের শুনানির নোটিশ' },
    { key: 'APPROVED', title: 'নামজারি অনুমোদন ও নতুন খতিয়ান', desc: 'খতিয়ান সংশোধন, নতুন জোত সৃজন ও প্রস্তাবিত রেকর্ড হালনাগাদ' }
  ];

  const getStepStatus = (stepKey: string, currentStatus: string) => {
    const order = ['SUBMITTED', 'UNION_REPORT_PENDING', 'HEARING_SCHEDULED', 'APPROVED'];
    const currentIndex = order.indexOf(currentStatus);
    const stepIndex = order.indexOf(stepKey);

    if (currentStatus === 'REJECTED') {
      return stepIndex === 0 ? 'completed' : 'rejected';
    }
    if (stepIndex < currentIndex) return 'completed';
    if (stepIndex === currentIndex) return 'current';
    return 'upcoming';
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="p-1.5 bg-emerald-50 text-emerald-700 rounded-md">
                <GitBranch className="w-5 h-5" />
              </span>
              <h1 className="text-2xl font-bold text-slate-900">স্মার্ট ই-নামজারি ট্র্যাকিং</h1>
            </div>
            <p className="text-sm text-slate-500">
              সাব-রেজিস্ট্রি অফিসে দলিল নিবন্ধনের পরপরই স্বয়ংক্রিয়ভাবে চালু হওয়া নামজারি ও রেকর্ড সংশোধনের লাইভ টাইমলাইন।
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg text-xs font-medium border border-slate-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              অটোমেটেড ইন্টিগ্রেশন চালু
            </span>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center text-slate-400">
          তথ্য লোড হচ্ছে...
        </div>
      ) : mutations.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
          <AlertCircle className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-800 mb-1">কোনো চলমান নামজারি আবেদন পাওয়া যায়নি</h3>
          <p className="text-sm text-slate-500 max-w-md mx-auto mb-5">
            সাব-রেজিস্ট্রি অফিসে জমি রেজিস্ট্রেশন সম্পন্ন হওয়ার সাথে সাথে আপনার নামে এখানে স্বয়ংক্রিয়ভাবে ই-নামজারি কেস তৈরি হবে।
          </p>
          <Link
            to="/citizen/my-applications"
            className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800"
          >
            আমার বিক্রয় ও রেজিস্ট্রি আবেদন দেখুন
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Applications list */}
          <div className="lg:col-span-1 space-y-3">
            <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wider px-1">
              নামজারি কেস তালিকা ({mutations.length})
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
                    খতিয়ান #{m.targetKhatianNo} • দাগ #{m.targetDagNo}
                  </div>
                  <div className={`text-xs ${isSelected ? 'text-slate-300' : 'text-slate-500'}`}>
                    আবেদনের তারিখ: {m.createdAt}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Selected application detail & timeline */}
          {selectedMutation && (
            <div className="lg:col-span-2 space-y-6">
              {/* Case Header Details */}
              <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100">
                  <div>
                    <span className="text-xs text-slate-500 block">ই-নামজারি কেস নম্বর</span>
                    <span className="text-xl font-bold font-mono text-slate-900">
                      {selectedMutation.mutationCaseNumber}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-slate-500 block">বর্তমান প্রশাসনিক অবস্থা</span>
                    <StatusBadge status={selectedMutation.status} />
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 text-xs">
                  <div>
                    <span className="text-slate-500 block">মূল দলিল নম্বর:</span>
                    <span className="font-semibold text-slate-800">{selectedMutation.saleAppId}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">খতিয়ান ও দাগ:</span>
                    <span className="font-semibold text-slate-800">
                      খতিয়ান {selectedMutation.targetKhatianNo}, দাগ {selectedMutation.targetDagNo}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">আবেদনকারী:</span>
                    <span className="font-semibold text-slate-800">{selectedMutation.buyerCitizenId}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">রেকর্ডের সাবেক মালিক:</span>
                    <span className="font-semibold text-slate-800">{selectedMutation.sellerCitizenId}</span>
                  </div>
                </div>
              </div>

              {/* Graphical Timeline */}
              <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                <h3 className="text-base font-bold text-slate-900 mb-6 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-slate-600" />
                  প্রশাসনিক অগ্রগতির টাইমলাইন (Workflow Timeline)
                </h3>

                <div className="relative pl-6 space-y-8 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                  {timelineSteps.map((step, idx) => {
                    const status = getStepStatus(step.key, selectedMutation.status);
                    return (
                      <div key={step.key} className="relative">
                        {/* Dot icon */}
                        <div
                          className={`absolute -left-[30px] top-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                            status === 'completed'
                              ? 'bg-emerald-600 text-white ring-4 ring-emerald-50'
                              : status === 'current'
                              ? 'bg-teal-600 text-white ring-4 ring-teal-50 animate-pulse'
                              : 'bg-slate-200 text-slate-600'
                          }`}
                        >
                          {status === 'completed' ? (
                            <CheckCircle2 className="w-4 h-4" />
                          ) : (
                            idx + 1
                          )}
                        </div>

                        <div>
                          <div className="flex items-center gap-2">
                            <h4
                              className={`text-sm font-bold ${
                                status === 'completed'
                                  ? 'text-emerald-900'
                                  : status === 'current'
                                  ? 'text-teal-900'
                                  : 'text-slate-500'
                              }`}
                            >
                              {step.title}
                            </h4>
                            {status === 'completed' && (
                              <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-medium">
                                সম্পন্ন
                              </span>
                            )}
                            {status === 'current' && (
                              <span className="text-[10px] bg-teal-100 text-teal-800 px-2 py-0.5 rounded font-medium">
                                প্রক্রিয়াধীন
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-500 mt-1">{step.desc}</p>

                          {/* Specific metadata for steps */}
                          {step.key === 'UNION_REPORT_PENDING' && selectedMutation.unionReport && (
                            <div className="mt-3 p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs">
                              <div className="flex items-center gap-1 font-semibold text-slate-800 mb-1">
                                <FileCheck2 className="w-3.5 h-3.5 text-emerald-600" />
                                তহশিলদার সরেজমিন রিপোর্ট:
                              </div>
                              <p className="text-slate-700">{selectedMutation.unionReport.recommendation}</p>
                              <div className="mt-2 text-slate-400 text-[11px]">
                                কর্মকর্তা ID: {selectedMutation.unionReport.officerId} • তারিখ: {selectedMutation.unionReport.submittedAt}
                              </div>
                            </div>
                          )}

                          {step.key === 'HEARING_SCHEDULED' && selectedMutation.hearingDate && (
                            <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs">
                              <div className="flex items-center gap-1 font-semibold text-amber-900 mb-1">
                                <Calendar className="w-3.5 h-3.5 text-amber-700" />
                                শুনানির তারিখ ও সময়:
                              </div>
                              <p className="text-amber-800 font-bold">
                                {selectedMutation.hearingDate} {selectedMutation.hearingTime ? `(${selectedMutation.hearingTime})` : ''}
                              </p>
                              <p className="text-amber-700 text-[11px] mt-1">
                                স্থান: সহকারী কমিশনার (ভূমি) এর কার্যালয়। প্রয়োজনীয় সকল মূল দলিল ও প্রমাণপত্র সঙ্গে আনুন।
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Approved Output & Resulting Khatian */}
              {selectedMutation.status === 'APPROVED' && selectedMutation.resultingKhatianNo && (
                <div className="bg-gradient-to-br from-emerald-900 to-slate-900 rounded-xl p-6 text-white shadow-lg border border-emerald-700">
                  <div className="flex items-center justify-between mb-4 pb-4 border-b border-emerald-800">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-6 h-6 text-emerald-400" />
                      <div>
                        <h4 className="text-lg font-bold text-white">নামজারি অনুমোদিত ও রেকর্ড হালনাগাদ সম্পন্ন!</h4>
                        <p className="text-xs text-emerald-200">
                          সরকারি ভূমি রেকর্ড সিস্টেমে ক্রেতার অনুকূলে নতুন খতিয়ান ও জোত নম্বর কার্যকর হয়েছে।
                        </p>
                      </div>
                    </div>
                    <button 
                      onClick={() => window.print()}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
                    >
                      <Printer className="w-4 h-4" />
                      প্রিন্ট খতিয়ান কপি
                    </button>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 bg-slate-800/80 p-4 rounded-lg border border-emerald-600/30 text-xs">
                    <div>
                      <span className="text-slate-400 block">নতুন সৃজিত খতিয়ান নম্বর</span>
                      <span className="text-lg font-bold font-mono text-emerald-300">
                        {selectedMutation.resultingKhatianNo}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">নতুন জোত / হোল্ডিং নম্বর</span>
                      <span className="text-lg font-bold font-mono text-emerald-300">
                        {selectedMutation.resultingHoldingNo || 'H-88219'}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">অনুমোদনকারী কর্তৃপক্ষ</span>
                      <span className="text-sm font-semibold text-white">
                        সহকারী কমিশনার (ভূমি)
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between text-xs text-emerald-300">
                    <span>
                      * এই খতিয়ানটি ডেমো ডাটাবেসে স্থায়ীভাবে সংযুক্ত করা হয়েছে এবং নাগরিক ড্যাশবোর্ডে যুক্ত হয়েছে।
                    </span>
                    <Link
                      to="/citizen/my-land"
                      className="text-white underline hover:text-emerald-200 font-medium"
                    >
                      আমার জমিতে দেখুন →
                    </Link>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
