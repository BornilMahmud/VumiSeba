import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
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
import {
  formatName,
  formatPlot,
  formatKhatian,
  formatDigits,
  formatRefNo
} from '../../utils/bilingual';

export default function MutationTrackingPage() {
  const { user } = useAuth();
  const { language } = useLanguage();
  const isBn = language === 'bn';

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
    {
      key: 'SUBMITTED',
      title: isBn ? 'নামজারি আবেদন জমা' : 'Mutation Application Submitted',
      desc: isBn
        ? 'সাব-রেজিস্ট্রি থেকে দলিল সম্পাদনের পর স্বয়ংক্রিয় আবেদন তৈরি'
        : 'Automated application initiated after deed registration at Sub-Registry'
    },
    {
      key: 'UNION_REPORT_PENDING',
      title: isBn ? 'তহশিলদার তদন্ত রিপোর্ট' : 'Tahsildar Field Verification Report',
      desc: isBn
        ? 'ইউনিয়ন ভূমি সহকারী কর্মকর্তা কর্তৃক সরেজমিন দখল ও রেকর্ড যাচাই'
        : 'Physical possession and record inspection by Union Land Assistant Officer'
    },
    {
      key: 'HEARING_SCHEDULED',
      title: isBn ? 'শুনানির তারিখ ধার্য' : 'Hearing Scheduled',
      desc: isBn
        ? 'সহকারী কমিশনার (ভূমি) কর্তৃক উভয় পক্ষের শুনানির নোটিশ'
        : 'Hearing notice issued to all parties by Assistant Commissioner (Land)'
    },
    {
      key: 'APPROVED',
      title: isBn ? 'নামজারি অনুমোদন ও নতুন খতিয়ান' : 'Mutation Approved & New Khatian Issued',
      desc: isBn
        ? 'খতিয়ান সংশোধন, নতুন জোত সৃজন ও প্রস্তাবিত রেকর্ড হালনাগাদ'
        : 'Khatian updated, new holding record created, and land registry synchronized'
    }
  ];

  // Helper getters to support both snake_case API data and legacy camelCase properties
  const getCaseNo = (m: any) => m?.mutation_case_no || m?.mutationCaseNumber || m?.id || '';
  const getKhatianNo = (m: any) => m?.proposed_khatian_no || m?.parcel?.khatian_no || m?.previous_khatian_no || m?.targetKhatianNo || '';
  const getDagNo = (m: any) => m?.parcel?.dag_no || m?.targetDagNo || m?.dag_no || '';
  const getDeedNo = (m: any) => m?.sale_application_no || m?.sale_application_id || m?.saleAppId || '';
  const getDate = (m: any) => m?.created_at || m?.createdAt || '';
  const getApplicantName = (m: any) => m?.applicant?.name_bn || m?.applicant?.name_en || m?.applicant?.citizen_id || m?.buyerCitizenId || '';
  const getSellerName = (m: any) => m?.seller?.name_bn || m?.seller?.name_en || m?.seller?.citizen_id || m?.sellerCitizenId || '';
  const getStageKey = (m: any) => {
    const stage = (m?.current_stage || m?.stage || m?.status || '').toUpperCase();
    if (stage.includes('APPROV')) return 'APPROVED';
    if (stage.includes('HEAR')) return 'HEARING_SCHEDULED';
    if (stage.includes('UNION') || stage.includes('REPORT') || stage.includes('TAHSIL')) return 'UNION_REPORT_PENDING';
    if (stage.includes('SUBMIT') || stage.includes('APPLICATION') || stage.includes('ACTIVE')) return 'SUBMITTED';
    return 'SUBMITTED';
  };

  const getStepStatus = (stepKey: string, currentStageKey: string) => {
    const order = ['SUBMITTED', 'UNION_REPORT_PENDING', 'HEARING_SCHEDULED', 'APPROVED'];
    const currentIndex = order.indexOf(currentStageKey);
    const stepIndex = order.indexOf(stepKey);

    if (currentStageKey === 'REJECTED') {
      return stepIndex === 0 ? 'completed' : 'rejected';
    }
    if (stepIndex < currentIndex) return 'completed';
    if (stepIndex === currentIndex) return 'current';
    return 'upcoming';
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="p-1.5 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 rounded-md">
                <GitBranch className="w-5 h-5" />
              </span>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                {isBn ? 'স্মার্ট ই-নামজারি ট্র্যাকিং' : 'Smart e-Mutation Tracking'}
              </h1>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {isBn
                ? 'সাব-রেজিস্ট্রি অফিসে দলিল নিবন্ধনের পরপরই স্বয়ংক্রিয়ভাবে চালু হওয়া নামজারি ও রেকর্ড সংশোধনের লাইভ টাইমলাইন।'
                : 'Live tracking timeline for automated mutation and record correction immediately after deed registration.'}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-medium border border-slate-200 dark:border-slate-700">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              {isBn ? 'অটোমেটেড ইন্টিগ্রেশন চালু' : 'Automated Integration Active'}
            </span>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-12 text-center text-slate-400">
          {isBn ? 'তথ্য লোড হচ্ছে...' : 'Loading mutation data...'}
        </div>
      ) : mutations.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-12 text-center">
          <AlertCircle className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-1">
            {isBn ? 'কোনো চলমান নামজারি আবেদন পাওয়া যায়নি' : 'No Active Mutation Applications Found'}
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-5">
            {isBn
              ? 'সাব-রেজিস্ট্রি অফিসে জমি রেজিস্ট্রেশন সম্পন্ন হওয়ার সাথে সাথে আপনার নামে এখানে স্বয়ংক্রিয়ভাবে ই-নামজারি কেস তৈরি হবে।'
              : 'Once deed registration is completed at the Sub-Registry office, your e-Mutation case will automatically appear here.'}
          </p>
          <Link
            to="/citizen/my-applications"
            className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-medium transition-colors shadow-xs"
          >
            {isBn ? 'আমার বিক্রয় ও রেজিস্ট্রি আবেদন দেখুন' : 'View My Sale & Registry Applications'}
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Applications list */}
          <div className="lg:col-span-1 space-y-3">
            <h2 className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider px-1">
              {isBn ? 'নামজারি কেস তালিকা' : 'Mutation Cases'} ({formatDigits(mutations.length, isBn)})
            </h2>
            {mutations.map((m) => {
              const isSelected = selectedMutation?.id === m.id;
              const caseNo = getCaseNo(m);
              const khatianNo = getKhatianNo(m);
              const dagNo = getDagNo(m);
              const dateVal = getDate(m);

              return (
                <div
                  key={m.id}
                  onClick={() => setSelectedMutation(m)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-emerald-50/80 dark:bg-emerald-950/30 text-slate-900 dark:text-white border-emerald-500 dark:border-emerald-500 ring-2 ring-emerald-500/20 shadow-sm'
                      : 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50/60 dark:hover:bg-slate-800/40'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                      isSelected
                        ? 'bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                    }`}>
                      {formatRefNo(caseNo, isBn)}
                    </span>
                    <StatusBadge stage={m.current_stage || m.status} status={m.status} />
                  </div>
                  <div className={`text-sm mb-1 ${isSelected ? 'font-bold text-slate-900 dark:text-white' : 'font-semibold text-slate-800 dark:text-slate-200'}`}>
                    {formatKhatian(khatianNo, isBn)} • {formatPlot(dagNo, isBn)}
                  </div>
                  <div className={`text-xs ${isSelected ? 'text-emerald-800 dark:text-emerald-300/80 font-medium' : 'text-slate-500 dark:text-slate-400'}`}>
                    {isBn ? 'আবেদনের তারিখ' : 'Date'}: {dateVal ? formatDigits(new Date(dateVal).toLocaleDateString(isBn ? 'bn-BD' : 'en-US'), isBn) : (isBn ? 'সাম্প্রতিক' : 'Recent')}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Selected application detail & timeline */}
          {selectedMutation && (
            <div className="lg:col-span-2 space-y-6">
              {/* Case Header Details */}
              <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
                  <div>
                    <span className="text-xs text-slate-500 dark:text-slate-400 block">
                      {isBn ? 'ই-নামজারি কেস নম্বর' : 'e-Mutation Case Number'}
                    </span>
                    <span className="text-xl font-bold font-mono text-slate-900 dark:text-white">
                      {formatRefNo(getCaseNo(selectedMutation), isBn)}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-slate-500 dark:text-slate-400 block mb-1">
                      {isBn ? 'বর্তমান প্রশাসনিক অবস্থা' : 'Current Workflow Status'}
                    </span>
                    <StatusBadge stage={selectedMutation.current_stage || selectedMutation.status} status={selectedMutation.status} />
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 text-xs">
                  <div>
                    <span className="text-slate-500 dark:text-slate-400 block">
                      {isBn ? 'মূল দলিল নম্বর:' : 'Primary Deed No:'}
                    </span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200 font-mono">
                      {formatRefNo(getDeedNo(selectedMutation), isBn)}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 dark:text-slate-400 block">
                      {isBn ? 'খতিয়ান ও দাগ:' : 'Khatian & Plot:'}
                    </span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {formatKhatian(getKhatianNo(selectedMutation), isBn)}, {formatPlot(getDagNo(selectedMutation), isBn)}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 dark:text-slate-400 block">
                      {isBn ? 'আবেদনকারী (ক্রেতা):' : 'Applicant (Buyer):'}
                    </span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {getApplicantName(selectedMutation) || (isBn ? 'নাগরিক ব্যবহারকারী' : 'Citizen User')}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 dark:text-slate-400 block">
                      {isBn ? 'রেকর্ডের সাবেক মালিক:' : 'Recorded Former Owner:'}
                    </span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {getSellerName(selectedMutation) || (isBn ? 'সাবেক খতিয়ানধারী' : 'Former Landholder')}
                    </span>
                  </div>
                </div>

                {selectedMutation.order_summary_bn && (
                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300">
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {isBn ? 'আদালতের সর্বশেষ আদেশ/মন্তব্য: ' : 'Official Order / Remarks: '}
                    </span>
                    <span>{selectedMutation.order_summary_bn}</span>
                  </div>
                )}
              </div>

              {/* Graphical Timeline */}
              <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
                <h3 className="text-base font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                  {isBn ? 'প্রশাসনিক অগ্রগতির টাইমলাইন (Workflow Timeline)' : 'Administrative Workflow Timeline'}
                </h3>

                <div className="space-y-0">
                  {timelineSteps.map((step, idx) => {
                    const status = getStepStatus(step.key, getStageKey(selectedMutation));
                    const isFirst = idx === 0;
                    const isLast = idx === timelineSteps.length - 1;

                    return (
                      <div key={step.key} className="relative flex items-start gap-4">
                        {/* Circle column with centered connecting line */}
                        <div className="relative self-stretch w-6 flex flex-col items-center shrink-0">
                          {/* Top line segment (connects from top of row into the circle center) */}
                          {!isFirst && (
                            <div className="absolute top-0 h-3 w-0.5 bg-slate-200 dark:bg-slate-700 pointer-events-none" />
                          )}

                          {/* Bottom line segment (connects from circle center down through the row) */}
                          {!isLast && (
                            <div className="absolute top-3 bottom-0 w-0.5 bg-slate-200 dark:bg-slate-700 pointer-events-none" />
                          )}

                          {/* Numbered circle badge - centered at x=12px, y=12px */}
                          <div
                            className={`relative z-10 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 shadow-xs ${
                              status === 'completed'
                                ? 'bg-emerald-600 text-white ring-4 ring-emerald-50 dark:ring-emerald-950/40'
                                : status === 'current'
                                ? 'bg-teal-600 text-white ring-4 ring-teal-50 dark:ring-teal-950/40 animate-pulse'
                                : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                            }`}
                          >
                            {status === 'completed' ? (
                              <CheckCircle2 className="w-4 h-4" />
                            ) : (
                              formatDigits(idx + 1, isBn)
                            )}
                          </div>
                        </div>

                        {/* Step details content */}
                        <div className={`grow min-w-0 ${!isLast ? 'pb-7' : 'pb-1'}`}>
                          <div className="flex items-center gap-2">
                            <h4
                              className={`text-sm font-bold ${
                                status === 'completed'
                                  ? 'text-emerald-700 dark:text-emerald-400'
                                  : status === 'current'
                                  ? 'text-teal-700 dark:text-teal-400'
                                  : 'text-slate-500 dark:text-slate-400'
                              }`}
                            >
                              {step.title}
                            </h4>
                            {status === 'completed' && (
                              <span className="text-[10px] bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 px-2 py-0.5 rounded font-medium">
                                {isBn ? 'সম্পন্ন' : 'Completed'}
                              </span>
                            )}
                            {status === 'current' && (
                              <span className="text-[10px] bg-teal-100 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300 px-2 py-0.5 rounded font-medium">
                                {isBn ? 'প্রক্রিয়াধীন' : 'In Progress'}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{step.desc}</p>

                          {/* Specific metadata for steps */}
                          {step.key === 'UNION_REPORT_PENDING' && (selectedMutation.unionReport || selectedMutation.current_stage === 'union_report_pending') && (
                            <div className="mt-3 p-3 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-lg text-xs">
                              <div className="flex items-center gap-1 font-semibold text-slate-800 dark:text-slate-200 mb-1">
                                <FileCheck2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                                {isBn ? 'তহশিলদার সরেজমিন রিপোর্ট:' : 'Tahsildar Field Inspection Report:'}
                              </div>
                              <p className="text-slate-700 dark:text-slate-300">
                                {selectedMutation.unionReport?.recommendation || selectedMutation.order_summary_bn || (isBn ? 'সরেজমিন পরিদর্শন ও সীমানা নির্ধারণ প্রক্রিয়াধীন রয়েছে।' : 'Field inspection and boundary verification are in progress.')}
                              </p>
                              {selectedMutation.unionReport?.officerId && (
                                <div className="mt-2 text-slate-400 dark:text-slate-400 text-[11px]">
                                  {isBn ? 'কর্মকর্তা' : 'Officer'} ID: {selectedMutation.unionReport.officerId}
                                </div>
                              )}
                            </div>
                          )}

                          {step.key === 'HEARING_SCHEDULED' && (selectedMutation.hearing_date || selectedMutation.hearingDate) && (
                            <div className="mt-3 p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/40 rounded-lg text-xs">
                              <div className="flex items-center gap-1 font-semibold text-amber-900 dark:text-amber-200 mb-1">
                                <Calendar className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400" />
                                {isBn ? 'শুনানির তারিখ ও সময়:' : 'Hearing Date & Time:'}
                              </div>
                              <p className="text-amber-800 dark:text-amber-200 font-bold">
                                {formatDigits(selectedMutation.hearing_date || selectedMutation.hearingDate || '', isBn)} {selectedMutation.hearingTime ? `(${selectedMutation.hearingTime})` : ''}
                              </p>
                              <p className="text-amber-700 dark:text-amber-300/80 text-[11px] mt-1">
                                {selectedMutation.order_summary_bn || (isBn
                                  ? 'স্থান: সহকারী কমিশনার (ভূমি) এর কার্যালয়। প্রয়োজনীয় সকল মূল দলিল ও প্রমাণপত্র সঙ্গে আনুন।'
                                  : 'Venue: Office of the Assistant Commissioner (Land). Please bring all original deeds and supporting documents.')}
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
              {(getStageKey(selectedMutation) === 'APPROVED' || selectedMutation.status?.toLowerCase() === 'approved') && (
                <div className="bg-gradient-to-br from-emerald-50 via-teal-50/60 to-white dark:from-emerald-950/60 dark:to-slate-900 rounded-xl p-6 text-slate-900 dark:text-white shadow-lg border border-emerald-200 dark:border-emerald-700">
                  <div className="flex items-center justify-between mb-4 pb-4 border-b border-emerald-200 dark:border-emerald-800">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                      <div>
                        <h4 className="text-lg font-bold text-slate-900 dark:text-white">
                          {isBn ? 'নামজারি অনুমোদিত ও রেকর্ড হালনাগাদ সম্পন্ন!' : 'Mutation Approved & Official Records Synchronized!'}
                        </h4>
                        <p className="text-xs text-emerald-800 dark:text-emerald-200">
                          {isBn
                            ? 'সরকারি ভূমি রেকর্ড সিস্টেমে ক্রেতার অনুকূলে নতুন খতিয়ান ও জোত নম্বর কার্যকর হয়েছে।'
                            : 'New Khatian and holding number have been officially recorded in government land records under buyer ownership.'}
                        </p>
                      </div>
                    </div>
                    <button 
                      onClick={() => window.print()}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
                    >
                      <Printer className="w-4 h-4" />
                      {isBn ? 'প্রিন্ট খতিয়ান কপি' : 'Print Khatian Certificate'}
                    </button>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 bg-white/90 dark:bg-slate-800/80 p-4 rounded-lg border border-emerald-200 dark:border-emerald-600/30 text-xs">
                    <div>
                      <span className="text-slate-500 dark:text-slate-400 block">
                        {isBn ? 'নতুন সৃজিত খতিয়ান নম্বর' : 'New Khatian Number'}
                      </span>
                      <span className="text-lg font-bold font-mono text-emerald-700 dark:text-emerald-300">
                        {formatDigits(getKhatianNo(selectedMutation), isBn)}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500 dark:text-slate-400 block">
                        {isBn ? 'নতুন জোত / হোল্ডিং নম্বর' : 'New Holding / Jote No'}
                      </span>
                      <span className="text-lg font-bold font-mono text-emerald-700 dark:text-emerald-300">
                        {formatDigits(selectedMutation.resultingHoldingNo || 'H-88219', isBn)}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500 dark:text-slate-400 block">
                        {isBn ? 'অনুমোদনকারী কর্তৃপক্ষ' : 'Approving Authority'}
                      </span>
                      <span className="text-sm font-semibold text-slate-900 dark:text-white">
                        {isBn ? 'সহকারী কমিশনার (ভূমি)' : 'Assistant Commissioner (Land)'}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between text-xs text-emerald-800 dark:text-emerald-300">
                    <span>
                      {isBn
                        ? '* এই খতিয়ানটি সিস্টেমে স্থায়ীভাবে সংযুক্ত করা হয়েছে এবং নাগরিক ড্যাশবোর্ডে যুক্ত হয়েছে।'
                        : '* This Khatian has been recorded and synchronized with your citizen holdings.'}
                    </span>
                    <Link
                      to="/citizen/my-land"
                      className="text-emerald-700 dark:text-white underline hover:text-emerald-900 dark:hover:text-emerald-200 font-medium"
                    >
                      {isBn ? 'আমার জমিতে দেখুন →' : 'View in My Land →'}
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
