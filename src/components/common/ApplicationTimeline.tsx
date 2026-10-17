import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { OfficeReview, SaleApplicationStage } from '../../types';
import {
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
  User,
  ShieldCheck,
  Building2,
  Calendar,
  ArrowRight,
  RotateCcw,
  XCircle,
} from 'lucide-react';

export interface TimelineEvent {
  id?: string;
  stage_name_bn: string;
  stage_name_en: string;
  status: 'completed' | 'current' | 'pending' | 'returned' | 'rejected';
  actor_name?: string;
  actor_role?: string;
  timestamp?: string;
  notes_bn?: string;
  notes_en?: string;
}

interface ApplicationTimelineProps {
  currentStage: SaleApplicationStage;
  reviews?: OfficeReview[];
  returnReason?: string;
  rejectionReason?: string;
  createdAt?: string;
  completionDate?: string;
}

const LIFECYCLE_STAGES = [
  {
    key: 'TAX_CLEARANCE',
    title_bn: '১. কর ও এলডি ট্যাক্স ছাড়পত্র',
    title_en: '1. Land Tax Clearance',
    office_bn: 'তহশিল / রাজস্ব পোর্টাল',
    office_en: 'Revenue Ledger / e-Khajna',
  },
  {
    key: 'SUBMITTED',
    title_bn: '২. নাগরিক আবেদন দাখিল ও হিস্যা যাচাই',
    title_en: '2. Application Submission & Share Guard',
    office_bn: 'নাগরিক ও ডিজিটাল ভেরিফায়ার',
    office_en: 'Citizen & Cryptographic Ledger',
  },
  {
    key: 'UNION_REPORT',
    title_bn: '৩. ইউনিয়ন ভূমি সহকারী পর্যালোচনা ও প্রতিবেদন',
    title_en: '3. Union Field Review & Report',
    office_bn: 'ইউনিয়ন ভূমি অফিস',
    office_en: 'Union Land Office',
  },
  {
    key: 'AC_LAND_APPROVAL',
    title_bn: '৪. এসি (ল্যান্ড) স্বত্ব অনাপত্তি অনুমোদন',
    title_en: '4. AC (Land) Title NOC Approval',
    office_bn: 'উপজেলা ভূমি অফিস',
    office_en: 'Upazila Land Office',
  },
  {
    key: 'DEED_REGISTRATION',
    title_bn: '৫. সাব-রেজিস্ট্রি দলিল সম্পাদন ও বায়োমেট্রিক',
    title_en: '5. Deed Execution & Biometric Registry',
    office_bn: 'সাব-রেজিস্ট্রি অফিস',
    office_en: 'Sub-Registry Office',
  },
  {
    key: 'AUTO_MUTATION',
    title_bn: '৬. তাৎক্ষণিক স্বয়ংক্রিয় ই-নামজারি কেস সৃষ্টি',
    title_en: '6. Automated e-Mutation Trigger',
    office_bn: 'সমন্বিত ইন্টার-অফিস সার্ভিস বাস',
    office_en: 'Unified Inter-Office Service Bus',
  },
  {
    key: 'TAHSIL_REPORT',
    title_bn: '৭. ইউনিয়ন তহশিলদারের প্রস্তাবনা',
    title_en: '7. Tahsil Verification & Proposal',
    office_bn: 'ইউনিয়ন ভূমি অফিস',
    office_en: 'Union Land Office',
  },
  {
    key: 'MUTATION_HEARING',
    title_bn: '৮. এসি (ল্যান্ড) শুনানী ও অনুমোদন আদেশ',
    title_en: '8. AC (Land) Hearing & Order',
    office_bn: 'উপজেলা ভূমি অফিস',
    office_en: 'Upazila Land Office',
  },
  {
    key: 'KHATIAN_ISSUED',
    title_bn: '৯. চূড়ান্ত নামজারি খতিয়ান ও দাগ সংশোধন',
    title_en: '9. Final Mutation Khatian & Record Updated',
    office_bn: 'ভূমি রেকর্ডরুম ও খতিয়ান আর্কাইভ',
    office_en: 'Land Record Archive & DCR',
  },
];

export const ApplicationTimeline: React.FC<ApplicationTimelineProps> = ({
  currentStage,
  reviews = [],
  returnReason,
  rejectionReason,
  createdAt,
  completionDate,
}) => {
  const { language } = useLanguage();
  const isBn = language === 'bn';

  // Map stage to index 0-8
  const getStageIndex = (stage: string): number => {
    const s = stage.toUpperCase();
    if (s.includes('TAX') || s.includes('DRAFT')) return 0;
    if (s === 'SUBMITTED' || s.includes('UNDER_REVIEW')) return 1;
    if (s.includes('UNION_REVIEW') || s.includes('UNION_REPORT') || s === 'UNION_APPROVED') return 2;
    if (s.includes('AC_LAND_REVIEW') || s === 'AC_LAND_APPROVED') return 3;
    if (s.includes('REGISTRATION') || s.includes('APPOINTMENT')) return 4;
    if (s === 'MUTATION_PENDING' || s === 'MUTATION_SUBMITTED') return 5;
    if (s.includes('UNION_REPORT_PENDING') || s.includes('TAHSIL')) return 6;
    if (s.includes('HEARING') || s === 'MUTATION_APPROVED') return 7;
    if (s.includes('COMPLETED') || s.includes('KHATIAN')) return 8;
    return 1;
  };

  const activeIdx = getStageIndex(currentStage);
  const isReturned = currentStage.includes('RETURNED') || !!returnReason;
  const isRejected = currentStage.includes('REJECTED') || !!rejectionReason;

  return (
    <div className="bg-white rounded-xl shadow-gov-sm border border-slate-200 p-6 font-bengali">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 mb-6 gap-2">
        <div>
          <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
            <Building2 className="text-teal-600" size={18} />
            <span>
              {isBn
                ? 'আবেদনের সমন্বিত ৯-ধাপ লাইফসাইকেল টাইমলাইন'
                : 'Unified 9-Stage Application Lifecycle Timeline'}
            </span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            {isBn
              ? 'বিক্রয় অনুমতি থেকে দলিল রেজিস্ট্রি এবং স্বয়ংক্রিয় ই-নামজারি সমাপ্তি পর্যন্ত সরকারি ট্র্যাকিং'
              : 'Inter-office governance timeline from pre-deed NOC to deed registration and automated e-mutation.'}
          </p>
        </div>

        {createdAt && (
          <div className="text-xs text-slate-500 flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-lg border">
            <Calendar size={13} className="text-slate-400" />
            <span>
              {isBn ? 'আবেদন সৃষ্টি:' : 'Initiated:'}{' '}
              <strong className="text-slate-700">
                {new Date(createdAt).toLocaleDateString(isBn ? 'bn-BD' : 'en-US')}
              </strong>
            </span>
          </div>
        )}
      </div>

      {/* Return or Rejection Alert Box */}
      {isReturned && returnReason && (
        <div className="mb-6 p-4 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 flex items-start gap-3">
          <RotateCcw className="text-amber-600 shrink-0 mt-0.5" size={18} />
          <div className="text-xs">
            <span className="font-bold block text-sm">
              {isBn ? 'আবেদনটি সংশোধনের জন্য ফেরত পাঠানো হয়েছে' : 'Application Returned for Correction'}
            </span>
            <p className="mt-1 text-slate-800 leading-relaxed font-medium bg-white p-2.5 rounded border border-amber-200">
              {returnReason}
            </p>
            <span className="text-[11px] text-amber-800 mt-2 block">
              {isBn
                ? 'অনুগ্রহ করে নির্দেশিত ত্রুটি সংশোধন করে পুনঃদাখিল করুন।'
                : 'Please amend the requested information and re-submit.'}
            </span>
          </div>
        </div>
      )}

      {isRejected && rejectionReason && (
        <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-300 text-red-900 flex items-start gap-3">
          <XCircle className="text-red-600 shrink-0 mt-0.5" size={18} />
          <div className="text-xs">
            <span className="font-bold block text-sm">
              {isBn ? 'আবেদনটি বাতিল/প্রত্যাখ্যাত করা হয়েছে' : 'Application Rejected'}
            </span>
            <p className="mt-1 text-red-900 leading-relaxed font-medium bg-white p-2.5 rounded border border-red-200">
              {rejectionReason}
            </p>
          </div>
        </div>
      )}

      {/* 9-Stage Visual Stepper */}
      <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-3 sm:before:left-4 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
        {LIFECYCLE_STAGES.map((st, idx) => {
          const isDone = idx < activeIdx;
          const isCurrent = idx === activeIdx;
          const isPending = idx > activeIdx;

          // Find if there is an office review for this stage
          const matchingReview = reviews.find((r) => {
            if (st.key === 'UNION_REPORT' && r.office_type === 'union_land') return true;
            if (st.key === 'AC_LAND_APPROVAL' && r.office_type === 'ac_land' && !r.action.includes('mutation')) return true;
            if (st.key === 'DEED_REGISTRATION' && r.office_type === 'sub_registry') return true;
            if (st.key === 'MUTATION_HEARING' && r.office_type === 'ac_land' && r.action.includes('mutation')) return true;
            return false;
          });

          return (
            <div key={st.key} className="relative group">
              {/* Stepper Dot / Icon */}
              <div
                className={`absolute -left-6 sm:-left-8 top-0.5 w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all shadow-xs ${
                  isDone
                    ? 'bg-emerald-600 text-white ring-4 ring-emerald-50'
                    : isCurrent
                    ? isReturned
                      ? 'bg-amber-500 text-white ring-4 ring-amber-100 animate-pulse'
                      : isRejected
                      ? 'bg-red-600 text-white ring-4 ring-red-100'
                      : 'bg-gov-blue text-white ring-4 ring-blue-100 animate-pulse'
                    : 'bg-white border-2 border-slate-300 text-slate-400'
                }`}
              >
                {isDone ? (
                  <CheckCircle2 size={14} />
                ) : isCurrent ? (
                  isReturned ? (
                    <RotateCcw size={12} />
                  ) : isRejected ? (
                    <XCircle size={12} />
                  ) : (
                    <span>{idx + 1}</span>
                  )
                ) : (
                  <span>{idx + 1}</span>
                )}
              </div>

              {/* Step Card Content */}
              <div
                className={`p-3.5 sm:p-4 rounded-xl border transition-all ${
                  isCurrent
                    ? 'bg-slate-50 border-teal-500 shadow-sm'
                    : isDone
                    ? 'bg-white border-slate-200'
                    : 'bg-white border-slate-100 opacity-60'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs sm:text-sm font-extrabold text-slate-900">
                      {isBn ? st.title_bn : st.title_en}
                    </span>
                    {isCurrent && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-100 text-teal-800 border border-teal-300 animate-pulse">
                        {isBn ? 'চলমান ধাপ' : 'Active Stage'}
                      </span>
                    )}
                    {isDone && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        {isBn ? 'সম্পন্ন' : 'Completed'}
                      </span>
                    )}
                  </div>

                  <span className="text-[11px] text-slate-500 font-medium">
                    {isBn ? st.office_bn : st.office_en}
                  </span>
                </div>

                {/* If there is a matching official review note */}
                {matchingReview && (
                  <div className="mt-3 pt-2.5 border-t border-slate-200/80 text-xs text-slate-700 bg-white p-2.5 rounded-lg border">
                    <div className="flex items-center justify-between mb-1 text-[11px] text-slate-500">
                      <span className="font-semibold text-slate-800 flex items-center gap-1">
                        <User size={12} className="text-teal-600" />
                        {matchingReview.officer_name_bn} ({matchingReview.officer_designation_bn})
                      </span>
                      <span>
                        {new Date(matchingReview.created_at).toLocaleString(isBn ? 'bn-BD' : 'en-US')}
                      </span>
                    </div>
                    <p className="font-medium text-slate-900">{matchingReview.notes_bn}</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
