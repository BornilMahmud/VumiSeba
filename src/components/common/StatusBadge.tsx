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
      label = 'প্রাথমিক পর্যালোচনাধীন';
      colorClasses = 'bg-blue-50 text-blue-800 border-blue-300';
      break;
    case 'RETURNED_FOR_INFORMATION':
      label = 'সংশোধন প্রয়োজন / ফেরত';
      colorClasses = 'bg-amber-100 text-amber-900 border-amber-400 font-semibold';
      break;
    case 'REVIEW_APPROVED':
      label = 'প্রাথমিক যাচাই অনুমোদিত';
      colorClasses = 'bg-teal-50 text-teal-800 border-teal-300';
      break;
    case 'UNION_REPORT_PENDING':
      label = 'ইউনিয়ন সরেজমিন প্রতিবেদন অপেক্ষমাণ';
      colorClasses = 'bg-indigo-50 text-indigo-800 border-indigo-300';
      break;
    case 'UNION_REPORT_SUBMITTED':
      label = 'সরেজমিন প্রতিবেদন সম্পন্ন';
      colorClasses = 'bg-teal-50 text-teal-800 border-teal-300';
      break;
    case 'REGISTRATION_SCHEDULED':
      label = 'রেজিস্ট্রেশন তারিখ নির্ধারিত';
      colorClasses = 'bg-purple-50 text-purple-800 border-purple-300 font-medium';
      break;
    case 'REGISTRATION_COMPLETED':
      label = 'দলিল রেজিস্ট্রি সম্পন্ন';
      colorClasses = 'bg-emerald-50 text-emerald-800 border-emerald-300 font-semibold';
      break;
    case 'MUTATION_SUBMITTED':
      label = 'নামজারি আবেদন প্রক্রিয়াধীন';
      colorClasses = 'bg-cyan-50 text-cyan-800 border-cyan-300';
      break;
    case 'HEARING_SCHEDULED':
      label = 'নামজারি শুনানি নির্ধারিত';
      colorClasses = 'bg-amber-50 text-amber-800 border-amber-300';
      break;
    case 'MUTATION_APPROVED':
      label = 'নামজারি মঞ্জুর (নতুন খতিয়ান জারি)';
      colorClasses = 'bg-emerald-100 text-emerald-900 border-emerald-400 font-bold';
      break;
    case 'MUTATION_REJECTED':
    case 'REJECTED':
      label = 'বাতিল / নামঞ্জুর';
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
