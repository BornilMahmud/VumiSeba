import React from 'react';
import { SaleApplicationStage } from '../../types';

interface StatusBadgeProps {
  stage?: SaleApplicationStage | string;
  status?: string;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ stage, status, className = '' }) => {
  let label = stage || status || 'অজানা';
  let colorClasses = 'bg-slate-100 text-slate-800 border-slate-300';

  switch (stage) {
    case 'DRAFT':
      label = 'খসড়া';
      colorClasses = 'bg-slate-100 text-slate-700 border-slate-300';
      break;
    case 'TAX_CLEARANCE_PENDING':
      label = 'কর বকেয়া / ছাড়পত্র প্রয়োজন';
      colorClasses = 'bg-amber-50 text-amber-800 border-amber-300';
      break;
    case 'SUBMITTED':
    case 'UNDER_REVIEW':
      label = 'আবেদন জমা হয়েছে';
      colorClasses = 'bg-blue-50 text-blue-800 border-blue-300 font-semibold';
      break;
    case 'UNION_REVIEW_PENDING':
    case 'UNION_REPORT_PENDING':
      label = 'ইউনিয়ন ভূমি অফিসে যাচাই চলছে';
      colorClasses = 'bg-indigo-50 text-indigo-800 border-indigo-300 font-medium';
      break;
    case 'RETURNED_FOR_CORRECTION':
    case 'RETURNED_FOR_INFORMATION':
      label = 'সংশোধন প্রয়োজন';
      colorClasses = 'bg-amber-100 text-amber-900 border-amber-400 font-bold';
      break;
    case 'UNION_APPROVED':
    case 'AC_LAND_REVIEW_PENDING':
      label = 'এসি ল্যান্ড অফিসে পর্যালোচনা চলছে';
      colorClasses = 'bg-teal-50 text-teal-800 border-teal-300 font-semibold';
      break;
    case 'AC_LAND_APPROVED':
    case 'REGISTRATION_READY':
      label = 'রেজিস্ট্রেশনের জন্য প্রস্তুত';
      colorClasses = 'bg-purple-50 text-purple-800 border-purple-300 font-semibold';
      break;
    case 'APPOINTMENT_SCHEDULED':
    case 'REGISTRATION_SCHEDULED':
      label = 'অ্যাপয়েন্টমেন্ট নির্ধারিত';
      colorClasses = 'bg-violet-50 text-violet-800 border-violet-400 font-bold';
      break;
    case 'REGISTRATION_COMPLETED':
      label = 'রেজিস্ট্রেশন সম্পন্ন';
      colorClasses = 'bg-emerald-50 text-emerald-800 border-emerald-300 font-bold';
      break;
    case 'MUTATION_PENDING':
    case 'MUTATION_SUBMITTED':
      label = 'নামজারি পর্যালোচনা চলছে';
      colorClasses = 'bg-cyan-50 text-cyan-800 border-cyan-300 font-semibold';
      break;
    case 'HEARING_SCHEDULED':
      label = 'নামজারি শুনানি নির্ধারিত';
      colorClasses = 'bg-amber-50 text-amber-800 border-amber-300 font-semibold';
      break;
    case 'MUTATION_APPROVED':
      label = 'নামজারি অনুমোদিত (নতুন খতিয়ান জারি)';
      colorClasses = 'bg-emerald-100 text-emerald-900 border-emerald-400 font-bold';
      break;
    case 'UNION_REJECTED':
      label = 'ইউনিয়ন অফিস কর্তৃক বাতিল';
      colorClasses = 'bg-red-50 text-red-800 border-red-300 font-medium';
      break;
    case 'AC_LAND_REJECTED':
      label = 'এসি ল্যান্ড অফিস কর্তৃক বাতিল';
      colorClasses = 'bg-red-50 text-red-800 border-red-300 font-medium';
      break;
    case 'MUTATION_REJECTED':
    case 'REJECTED':
      label = 'নামজারি বাতিল / আবেদন বাতিল';
      colorClasses = 'bg-red-50 text-red-800 border-red-300 font-medium';
      break;
    default:
      if (status === 'cleared' || status === 'verified' || status === 'approved') {
        label = 'পরিশোধিত / অনুমোদিত';
        colorClasses = 'bg-emerald-50 text-emerald-800 border-emerald-300';
      } else if (status === 'dues_pending' || status === 'pending') {
        label = 'বকেয়া / অপেক্ষমাণ';
        colorClasses = 'bg-amber-50 text-amber-800 border-amber-300';
      }
      break;
  }

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs border font-medium ${colorClasses} ${className}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70 mr-1.5"></span>
      {label}
    </span>
  );
};

export default StatusBadge;
