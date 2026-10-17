import React from 'react';
import { SaleApplicationStage } from '../../types';
import { useLanguage } from '../../context/LanguageContext';

interface StatusBadgeProps {
  stage?: SaleApplicationStage | string;
  status?: string;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ stage, status, className = '' }) => {
  const { language } = useLanguage();
  const isBn = language === 'bn';

  let label = stage || status || (isBn ? 'অজানা' : 'Unknown');
  let colorClasses = 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-slate-300 dark:border-slate-700';

  const normalizedKey = (stage || status || '').toString().trim().toUpperCase();

  switch (normalizedKey) {
    case 'ACTIVE':
    case 'IN_PROGRESS':
      label = isBn ? 'চলমান কেস' : 'Active Case';
      colorClasses = 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-800 font-medium';
      break;
    case 'DRAFT':
      label = isBn ? 'খসড়া' : 'Draft';
      colorClasses = 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700';
      break;
    case 'TAX_CLEARANCE_PENDING':
      label = isBn ? 'কর বকেয়া / ছাড়পত্র প্রয়োজন' : 'Tax Dues / Clearance Required';
      colorClasses = 'bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-800';
      break;
    case 'APPLICATION_SUBMITTED':
    case 'SUBMITTED':
    case 'UNDER_REVIEW':
      label = isBn ? 'আবেদন জমা হয়েছে' : 'Application Submitted';
      colorClasses = 'bg-blue-50 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 border-blue-300 dark:border-blue-800 font-semibold';
      break;
    case 'UNION_REVIEW_PENDING':
    case 'UNION_REPORT_PENDING':
      label = isBn ? 'ইউনিয়ন ভূমি অফিসে যাচাই চলছে' : 'Union Land Office Verification';
      colorClasses = 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-800 dark:text-indigo-300 border-indigo-300 dark:border-indigo-800 font-medium';
      break;
    case 'RETURNED_FOR_CORRECTION':
    case 'RETURNED_FOR_INFORMATION':
      label = isBn ? 'সংশোধন প্রয়োজন' : 'Correction Required';
      colorClasses = 'bg-amber-100 dark:bg-amber-950/80 text-amber-900 dark:text-amber-200 border-amber-400 dark:border-amber-700 font-bold';
      break;
    case 'UNION_APPROVED':
    case 'AC_LAND_REVIEW_PENDING':
      label = isBn ? 'এসি ল্যান্ড অফিসে পর্যালোচনা চলছে' : 'AC Land Review In Progress';
      colorClasses = 'bg-teal-50 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300 border-teal-300 dark:border-teal-800 font-semibold';
      break;
    case 'AC_LAND_APPROVED':
    case 'REGISTRATION_READY':
      label = isBn ? 'রেজিস্ট্রেশনের জন্য প্রস্তুত' : 'Ready for Deed Registration';
      colorClasses = 'bg-purple-50 dark:bg-purple-950/60 text-purple-800 dark:text-purple-300 border-purple-300 dark:border-purple-800 font-semibold';
      break;
    case 'APPOINTMENT_SCHEDULED':
    case 'REGISTRATION_SCHEDULED':
      label = isBn ? 'অ্যাপয়েন্টমেন্ট নির্ধারিত' : 'Registry Appointment Scheduled';
      colorClasses = 'bg-violet-50 dark:bg-violet-950/60 text-violet-800 dark:text-violet-300 border-violet-400 dark:border-violet-700 font-bold';
      break;
    case 'REGISTRATION_COMPLETED':
      label = isBn ? 'রেজিস্ট্রেশন সম্পন্ন' : 'Registration Completed';
      colorClasses = 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800 font-bold';
      break;
    case 'MUTATION_PENDING':
    case 'MUTATION_SUBMITTED':
      label = isBn ? 'নামজারি পর্যালোচনা চলছে' : 'Mutation Under Review';
      colorClasses = 'bg-cyan-50 dark:bg-cyan-950/60 text-cyan-800 dark:text-cyan-300 border-cyan-300 dark:border-cyan-800 font-semibold';
      break;
    case 'HEARING_SCHEDULED':
      label = isBn ? 'নামজারি শুনানি নির্ধারিত' : 'Mutation Hearing Scheduled';
      colorClasses = 'bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-800 font-semibold';
      break;
    case 'MUTATION_APPROVED':
      label = isBn ? 'নামজারি অনুমোদিত (নতুন খতিয়ান জারি)' : 'Mutation Approved (New Khatian Issued)';
      colorClasses = 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-900 dark:text-emerald-200 border-emerald-400 dark:border-emerald-700 font-bold';
      break;
    case 'UNION_REJECTED':
      label = isBn ? 'ইউনিয়ন অফিস কর্তৃক বাতিল' : 'Rejected by Union Office';
      colorClasses = 'bg-red-50 dark:bg-red-950/60 text-red-800 dark:text-red-300 border-red-300 dark:border-red-800 font-medium';
      break;
    case 'AC_LAND_REJECTED':
      label = isBn ? 'এসি ল্যান্ড অফিস কর্তৃক বাতিল' : 'Rejected by AC Land Office';
      colorClasses = 'bg-red-50 dark:bg-red-950/60 text-red-800 dark:text-red-300 border-red-300 dark:border-red-800 font-medium';
      break;
    case 'MUTATION_REJECTED':
    case 'REJECTED':
      label = isBn ? 'নামজারি বাতিল / আবেদন বাতিল' : 'Application / Mutation Rejected';
      colorClasses = 'bg-red-50 dark:bg-red-950/60 text-red-800 dark:text-red-300 border-red-300 dark:border-red-800 font-medium';
      break;
    case 'CLEARED':
    case 'VERIFIED':
    case 'APPROVED':
      label = isBn ? 'পরিশোধিত / অনুমোদিত' : 'Cleared / Approved';
      colorClasses = 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800';
      break;
    case 'DUES_PENDING':
    case 'PENDING':
      label = isBn ? 'বকেয়া / অপেক্ষমাণ' : 'Pending / Dues Outstanding';
      colorClasses = 'bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-800';
      break;
    default:
      label = stage || status || (isBn ? 'অজানা' : 'Unknown');
      colorClasses = 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700';
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
