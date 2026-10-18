import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { api } from '../../../services/api';
import { SaleApplication } from '../../../types';
import { StatusBadge } from '../../../components/common/StatusBadge';
import { useLanguage } from '../../../context/LanguageContext';
import {
  ArrowLeft,
  Landmark,
  User,
  MapPin,
  FileText,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Clock,
  ShieldAlert,
  Coins,
  History,
  CheckSquare,
  FileCheck,
  Scale,
  Send
} from 'lucide-react';
import { ApplicationTimeline } from '../../../components/common/ApplicationTimeline';
import {
  formatName,
  formatMouza,
  formatPlot,
  formatKhatian,
  formatDistrict,
  formatUpazila,
  formatArea,
  formatDigits,
} from '../../../utils/bilingual';

export const AcLandApplicationDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const isBn = language === 'bn';

  const [application, setApplication] = useState<SaleApplication | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Review modal state
  const [actionType, setActionType] = useState<'approve' | 'return' | 'reject' | null>(null);
  const [reasonBn, setReasonBn] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [actionSuccessMessage, setActionSuccessMessage] = useState<string | null>(null);

  const fetchApplication = async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const res = await api.sales.getById(id);
      if (res.success && res.data) {
        setApplication(res.data);
      } else {
        setError(res.message_bn || (isBn ? 'আবেদনটি খুঁজে পাওয়া যায়নি।' : 'Application not found.'));
      }
    } catch (err: any) {
      setError(err.message || (isBn ? 'ডাটা লোড করতে সমস্যা হয়েছে।' : 'Failed to load data.'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplication();
  }, [id]);

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!application || !actionType) return;

    if ((actionType === 'return' || actionType === 'reject') && !reasonBn.trim()) {
      alert(isBn ? 'সংশোধন বা বাতিলের সুস্পষ্ট কারণ উল্লেখ করা বাধ্যতামূলক।' : 'Specific grounds for return or rejection are required.');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        action: actionType,
        reason_bn: reasonBn.trim() || undefined,
        notes_bn: reasonBn.trim() || (actionType === 'approve' ? 'ইউনিয়ন রিপোর্ট ও নথি নিরীক্ষান্তে প্রস্তাবিত হস্তান্তর আইনগতভাবে সঠিক পাওয়া যাওয়ায় সাব-রেজিস্ট্রি অফিসে হস্তান্তরের অনুমোদন প্রদান করা হলো।' : undefined),
      };

      const res = await api.sales.acLandReview(application.id, payload);
      if (res.success) {
        setActionSuccessMessage(
          isBn
            ? (res.message_bn || 'সহকারী কমিশনার (ভূমি) এর আদেশ সফলভাবে জারি ও সংরক্ষিত হয়েছে।')
            : 'AC Land order has been successfully recorded and processed.'
        );
        setActionType(null);
        await fetchApplication();
      } else {
        alert(res.message_bn || (isBn ? 'আদেশ কার্যকর করা যায়নি।' : 'Failed to execute order.'));
      }
    } catch (err: any) {
      alert(err.message || (isBn ? 'সার্ভার ত্রুটি।' : 'Server error.'));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className={`flex flex-col items-center justify-center min-h-[400px] text-slate-500 ${isBn ? 'font-bengali' : 'font-sans'}`}>
        <Clock className="w-8 h-8 animate-spin text-indigo-600 mb-3" />
        <p className="text-sm">{isBn ? 'এসি ল্যান্ড কার্যালয়ের মিস নথি লোড হচ্ছে...' : 'Loading AC Land case file...'}</p>
      </div>
    );
  }

  if (error || !application) {
    return (
      <div className={`bg-white dark:bg-slate-900 rounded-xl shadow-xs border border-slate-200 dark:border-slate-800 p-8 text-center max-w-lg mx-auto ${isBn ? 'font-bengali' : 'font-sans'} my-8`}>
        <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto mb-3" />
        <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
          {isBn ? 'আবেদন পাওয়া যায়নি' : 'Application Not Found'}
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">{error || (isBn ? 'আবেদনের তথ্য বিদ্যমান নেই।' : 'Application record does not exist.')}</p>
        <Link
          to="/office/ac-land/dashboard"
          className="inline-flex items-center gap-2 bg-indigo-700 text-white px-4 py-2 rounded-lg text-xs font-semibold hover:bg-indigo-800 transition"
        >
          <ArrowLeft size={14} />
          {isBn ? 'এসি ল্যান্ড তালিকায় ফিরে যান' : 'Back to AC Land List'}
        </Link>
      </div>
    );
  }

  const isPendingAcLandReview =
    application.stage === 'AC_LAND_REVIEW_PENDING' ||
    application.stage === 'UNION_APPROVED' ||
    application.stage === 'union_approved';

  const isShareMismatch =
    application.proposed_share > (application.seller_owned_share || 1.0) ||
    (application.proposed_area_decimal > (application.seller_owned_area_decimal || 999));

  return (
    <div className={`space-y-6 ${isBn ? 'font-bengali' : 'font-sans'} pb-12`}>
      {/* Top Breadcrumb & Action bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs">
        <div className="flex items-center gap-3">
          <Link
            to="/office/ac-land/dashboard"
            className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 transition"
            title={isBn ? 'তালিকায় ফিরুন' : 'Back to list'}
          >
            <ArrowLeft size={18} />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-indigo-900 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/60 px-2.5 py-0.5 rounded border border-indigo-200 dark:border-indigo-800">
                {application.application_no}
              </span>
              <StatusBadge status={application.stage} />
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {isBn ? 'দাখিল:' : 'Filed:'} {application.submission_date || '2026-03-15'} | {isBn ? 'উপজেলা:' : 'Upazila:'} {formatUpazila(application.parcel?.upazila, isBn)} | {isBn ? 'মৌজা:' : 'Mouza:'} {formatMouza(application.parcel, isBn)}
            </p>
          </div>
        </div>

        {isPendingAcLandReview && (
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => {
                setActionType('approve');
                setReasonBn('');
              }}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-indigo-700 text-white rounded-lg text-xs font-bold hover:bg-indigo-800 transition shadow-xs cursor-pointer"
            >
              <Send size={15} />
              {isBn ? 'প্রাক-রেজিস্ট্রি অনুমোদন (সাব-রেজিস্ট্রিতে প্রেরণ)' : 'Pre-Registration Approval (Forward to Registry)'}
            </button>
            <button
              onClick={() => {
                setActionType('return');
                setReasonBn('');
              }}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-amber-500 text-white rounded-lg text-xs font-bold hover:bg-amber-600 transition shadow-xs cursor-pointer"
            >
              <RotateCcw size={15} />
              {isBn ? 'সংশোধনের নির্দেশ' : 'Order Correction'}
            </button>
            <button
              onClick={() => {
                setActionType('reject');
                setReasonBn('');
              }}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-rose-600 text-white rounded-lg text-xs font-bold hover:bg-rose-700 transition shadow-xs cursor-pointer"
            >
              <XCircle size={15} />
              {isBn ? 'খারিজ ও বাতিল' : 'Reject & Dismiss'}
            </button>
          </div>
        )}
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

      {/* Discrepancy Alert */}
      {isShareMismatch && (
        <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-800 text-rose-900 dark:text-rose-300 flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
          <div className="text-xs">
            <p className="font-bold text-sm">
              {isBn ? 'আইনি সতর্কতা: অতিরিক্ত হিস্যা বিক্রির অসঙ্গতি (Discrepancy Detected)' : 'Legal Alert: Excess Share Selling Discrepancy Detected'}
            </p>
            <p className="mt-1 text-rose-800 dark:text-rose-300 leading-relaxed">
              {isBn
                ? `রেকর্ড অনুযায়ী বিক্রেতার স্বত্বাধীন অংশ ${application.seller_owned_share || '০.২৫০০'} (${application.seller_owned_area_decimal || '৮.২৫'} শতাংশ), কিন্তু বিক্রির আবেদন করা হয়েছে ${application.proposed_share} অংশ (${application.proposed_area_decimal} শতাংশ)। সহকারী কমিশনার (ভূমি) কর্তৃক সংশোধনের আদেশ অথবা খারিজ প্রযোজ্য।`
                : `Seller owned share per record is ${application.seller_owned_share || '0.2500'} (${application.seller_owned_area_decimal || '8.25'} decimals), but proposed sale share is ${application.proposed_share} (${application.proposed_area_decimal} decimals). Correction order or dismissal by Assistant Commissioner (Land) applies.`}
            </p>
          </div>
        </div>
      )}

      {/* Main 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 span) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Union Land Office Inspection Report Box */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-emerald-300/80 dark:border-emerald-700/60 p-5 shadow-2xs">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center justify-between border-b border-emerald-100 dark:border-emerald-900/40 pb-3 mb-4">
              <span className="flex items-center gap-2">
                <FileCheck size={17} className="text-emerald-600 dark:text-emerald-400" />
                {isBn ? 'ইউনিয়ন ভূমি সহকারী কর্মকর্তার (ULAO) সরেজমিন তদন্ত প্রতিবেদন' : 'Union Land Assistant Officer (ULAO) Field Investigation Report'}
              </span>
              <span className="text-[10px] font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-100/80 dark:bg-emerald-950/80 px-2.5 py-0.5 rounded-full border border-emerald-300 dark:border-emerald-700 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                {isBn ? 'অগ্রায়িত রিপোর্ট' : 'Forwarded Report'}
              </span>
            </h3>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 bg-slate-50 dark:bg-slate-800/70 rounded-xl border border-emerald-100 dark:border-emerald-900/40">
                <p className="text-slate-500 dark:text-slate-400 text-[11px] font-semibold mb-1">
                  {isBn ? 'সরেজমিন দখল ও সীমানা পর্যবেক্ষণ:' : 'Field Possession & Boundary Observation:'}
                </p>
                <p className="text-slate-800 dark:text-slate-100 font-medium italic leading-relaxed">
                  "{isBn
                    ? (application.union_report?.field_findings_bn || application.union_report?.recommendation_bn || 'সরেজমিন পরিদর্শন ও স্থানীয় অনুসন্ধানে দেখা যায় যে, প্রস্তাবিত বিক্রিত জমি বিক্রেতার ভোগদখলে রহিয়াছে। বিএস রেকর্ড ও ১নং খতিয়ান অনুযায়ী হিস্যা সঠিক আছে।')
                    : 'Field inspection and inquiries confirm that the proposed land parcel is in continuous peaceful possession of the seller. BS record and 1 No. khatian share are valid and consistent.'}"
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-[11px]">
                <div className="bg-slate-50 dark:bg-slate-800/70 p-3 rounded-xl border border-emerald-100 dark:border-emerald-900/40">
                  <span className="text-slate-500 dark:text-slate-400 block mb-1 font-medium">{isBn ? 'দখল যাচাই:' : 'Possession:'}</span>
                  <span className="font-bold text-emerald-700 dark:text-emerald-400">{isBn ? '✓ ভোগদখলে বহাল' : '✓ In Active Possession'}</span>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800/70 p-3 rounded-xl border border-emerald-100 dark:border-emerald-900/40">
                  <span className="text-slate-500 dark:text-slate-400 block mb-1 font-medium">{isBn ? 'সীমানা ও বিরোধ:' : 'Boundary & Title:'}</span>
                  <span className="font-bold text-emerald-700 dark:text-emerald-400">{isBn ? '✓ বিরোধমুক্ত' : '✓ Dispute Free'}</span>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800/70 p-3 rounded-xl border border-emerald-100 dark:border-emerald-900/40">
                  <span className="text-slate-500 dark:text-slate-400 block mb-1 font-medium">{isBn ? 'ভূমি উন্নয়ন কর:' : 'Land Tax (Khajna):'}</span>
                  <span className={`font-bold ${application.tax_clearance_status === 'CLEARED' ? 'text-emerald-700 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                    {application.tax_clearance_status === 'CLEARED'
                      ? (isBn ? '✓ ১৪৩০ সন পর্যন্ত পরিশোধিত' : '✓ Paid up to FY 1430')
                      : (isBn ? '⚠ কর বকেয়া বিদ্যমান' : '⚠ Dues Pending')}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Citizen Parties Card */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs p-5">
            <h3 className="text-sm font-bold text-slate-800 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3 mb-4">
              <User size={16} className="text-indigo-700 dark:text-indigo-400" />
              {isBn ? 'পক্ষগণের বিবরণ ও জাতীয় পরিচয়পত্র নিরীক্ষা' : 'Parties Information & NID Verification'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <span className="text-[10px] font-bold uppercase text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/80 px-2 py-0.5 rounded">
                  {isBn ? 'বিক্রেতা' : 'Seller'}
                </span>
                <h4 className="font-bold text-slate-900 dark:text-white mt-2 text-sm">
                  {formatName(application.seller, isBn)}
                </h4>
                <div className="mt-2 space-y-1 text-slate-600 dark:text-slate-400">
                  <p><span className="text-slate-400">{isBn ? 'সিটিজেন আইডি:' : 'Citizen ID:'}</span> <span className="font-mono font-semibold text-slate-800 dark:text-slate-200">{application.seller_citizen_id || 'BHM-CIT-104928'}</span></p>
                  <p><span className="text-slate-400">{isBn ? 'এনআইডি:' : 'NID:'}</span> {application.seller?.nid || '19850919745610001'}</p>
                </div>
              </div>

              <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <span className="text-[10px] font-bold uppercase text-indigo-700 dark:text-indigo-400 bg-indigo-100 dark:bg-indigo-950/80 px-2 py-0.5 rounded">
                  {isBn ? 'ক্রেতা' : 'Buyer'}
                </span>
                <h4 className="font-bold text-slate-900 dark:text-white mt-2 text-sm">
                  {formatName(application.buyer, isBn)}
                </h4>
                <div className="mt-2 space-y-1 text-slate-600 dark:text-slate-400">
                  <p><span className="text-slate-400">{isBn ? 'সিটিজেন আইডি:' : 'Citizen ID:'}</span> <span className="font-mono font-semibold text-slate-800 dark:text-slate-200">{application.buyer_citizen_id || 'BHM-CIT-928471'}</span></p>
                  <p><span className="text-slate-400">{isBn ? 'এনআইডি:' : 'NID:'}</span> {application.buyer?.nid || '19920919841230009'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Land Schedule & Share Discrepancy Check */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs p-5">
            <h3 className="text-sm font-bold text-slate-800 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3 mb-4">
              <MapPin size={16} className="text-indigo-700 dark:text-indigo-400" />
              {isBn ? 'আইনি তপশিল ও মালিকানার হিস্যা বন্টন' : 'Legal Schedule & Share Apportionment'}
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs mb-4">
              <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700">
                <span className="text-slate-400 block text-[11px]">{isBn ? 'জেলা ও উপজেলা' : 'District & Upazila'}</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {formatDistrict(application.parcel?.district, isBn)}, {formatUpazila(application.parcel?.upazila, isBn)}
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700">
                <span className="text-slate-400 block text-[11px]">{isBn ? 'মৌজা ও জেএল' : 'Mouza & JL'}</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {formatMouza(application.parcel, isBn)}, {isBn ? 'জেএল-' : 'JL-'}{formatDigits(application.parcel?.jl_no || '07', isBn)}
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700">
                <span className="text-slate-400 block text-[11px]">{isBn ? 'খতিয়ান নম্বর' : 'Khatian No'}</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">{formatDigits(application.parcel?.khatian_no, isBn)}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700">
                <span className="text-slate-400 block text-[11px]">{isBn ? 'দাগ নম্বর' : 'Dag (Plot) No'}</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">{formatDigits(application.parcel?.dag_no, isBn)}</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#0c1427] border border-indigo-200/90 dark:border-indigo-800/80 text-xs shadow-2xs ring-1 ring-indigo-400/20 dark:ring-indigo-500/30">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <span className="text-slate-500 dark:text-slate-400 block text-[11px] font-medium">{isBn ? 'দাগে মোট জমির পরিমাণ:' : 'Total Plot Area:'}</span>
                  <span className="font-bold text-slate-900 dark:text-white text-sm">{formatArea(application.parcel?.total_area_decimal || '33.00', isBn)}</span>
                </div>
                <div>
                  <span className="text-slate-500 dark:text-slate-400 block text-[11px] font-medium">{isBn ? 'বিক্রেতার প্রাপ্ত হিস্যা:' : 'Seller Owned Share:'}</span>
                  <span className="font-bold text-slate-900 dark:text-white text-sm">{formatDigits(application.seller_owned_share || '0.2500', isBn)} ({formatArea(application.seller_owned_area_decimal || '8.25', isBn)})</span>
                </div>
                <div>
                  <span className="text-indigo-900 dark:text-indigo-300 block text-[11px] font-bold">{isBn ? 'প্রস্তাবিত বিক্রয় হিস্যা:' : 'Proposed Sale Share:'}</span>
                  <span className="font-mono font-bold text-indigo-700 dark:text-indigo-300 text-sm">{formatDigits(application.proposed_share, isBn)} ({formatArea(application.proposed_area_decimal, isBn)})</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (1 span): Procedural & Legal Decision */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs p-5">
            <h3 className="text-sm font-bold text-slate-800 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3 mb-4">
              <Scale size={16} className="text-indigo-700 dark:text-indigo-400" />
              {isBn ? 'রাজস্ব আদালত ও আইনি কার্যবিবরণী' : 'Revenue Court & Proceedings'}
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500 dark:text-slate-400">{isBn ? 'কার্যধারা:' : 'Proceedings:'}</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{isBn ? 'প্রাক-রেজিস্ট্রেশন ছাড়পত্র' : 'Pre-Registration Clearance'}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500 dark:text-slate-400">{isBn ? 'বর্তমান পর্যায়:' : 'Current Stage:'}</span>
                <span className="font-bold text-slate-800 dark:text-slate-200"><StatusBadge status={application.stage} /></span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500 dark:text-slate-400">{isBn ? 'আদালত:' : 'Court Jurisdiction:'}</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{isBn ? 'গুলশান রাজস্ব সার্কেল, ঢাকা' : 'Gulshan Revenue Circle, Dhaka'}</span>
              </div>
            </div>

            {application.rejection_reason_bn && (
              <div className="mt-4 p-3 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-900 dark:text-rose-300 text-xs">
                <p className="font-bold text-rose-800 dark:text-rose-400 mb-1">{isBn ? 'আবেদন বাতিলের কারণ:' : 'Rejection Reason:'}</p>
                <p>{application.rejection_reason_bn}</p>
              </div>
            )}

            {application.return_reason_bn && (
              <div className="mt-4 p-3 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-300 text-xs">
                <p className="font-bold text-amber-800 dark:text-amber-400 mb-1">{isBn ? 'সংশোধনের নির্দেশনা:' : 'Correction Instruction:'}</p>
                <p>{application.return_reason_bn}</p>
              </div>
            )}
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 p-4 text-xs text-slate-600 dark:text-slate-400">
            <h4 className="font-bold text-slate-800 dark:text-white flex items-center gap-1.5 mb-2">
              <FileCheck size={14} className="text-indigo-700 dark:text-indigo-400" />
              {isBn ? 'এসি ল্যান্ডের কার্যপ্রণালী' : 'AC Land Standard Process'}
            </h4>
            <p className="text-[11px] leading-relaxed mb-2">
              {isBn ? '১. তহশিলদারের প্রতিবেদন ও সরেজমিন সীমানা পর্যবেক্ষণ যাচাই করুন।' : '1. Verify Union Tahsildar report and on-site boundary inspection.'}
            </p>
            <p className="text-[11px] leading-relaxed mb-2">
              {isBn ? '২. আইনগত হিস্যা সঠিক থাকলে অনুমোদন দিন। অনুমোদনের সাথে সাথে নথিটি সাব-রেজিস্ট্রার কার্যালয়ের শিডিউলিং কিউতে চলে যাবে।' : '2. Approve if legal shares are verified. Once approved, file enters the Sub-Registry scheduling queue.'}
            </p>
            <p className="text-[11px] leading-relaxed">
              {isBn ? '৩. দলিল রেজিস্ট্রেশন সম্পন্ন হবার পর স্বয়ংক্রিয়ভাবে ই-নামজারি কেস এসি ল্যান্ড কোর্টে দাখিল হবে।' : '3. After deed registration, an e-Mutation case is automatically docketed in the AC Land Court.'}
            </p>
          </div>
        </div>
      </div>

      {/* 9-Stage Application Timeline */}
      <ApplicationTimeline
        currentStage={application.stage}
        returnReason={application.return_reason_bn}
        rejectionReason={application.rejection_reason_bn}
        createdAt={application.created_at}
      />

      {/* Review Action Modal */}
      {actionType && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className={`bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 ${isBn ? 'font-bengali' : 'font-sans'}`}>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                {actionType === 'approve' && <CheckCircle2 className="w-5 h-5 text-indigo-600" />}
                {actionType === 'return' && <RotateCcw className="w-5 h-5 text-amber-500" />}
                {actionType === 'reject' && <XCircle className="w-5 h-5 text-rose-600" />}
                {actionType === 'approve' && (isBn ? 'প্রাক-রেজিস্ট্রি অনুমোদন ও সাব-রেজিস্ট্রিতে প্রেরণ' : 'Pre-Registration Approval & Forward to Registry')}
                {actionType === 'return' && (isBn ? 'আবেদন সংশোধনের জন্য ফেরত প্রেরণ' : 'Return Application for Correction')}
                {actionType === 'reject' && (isBn ? 'আবেদন সরাসরি খারিজ ও বাতিলকরণ' : 'Reject & Dismiss Application')}
              </h3>
              <button
                onClick={() => setActionType(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 p-1 rounded-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleReviewSubmit} className="space-y-4 text-xs">
              <div className="space-y-2">
                <label className="font-bold text-slate-700 dark:text-slate-300 block">
                  {actionType === 'approve'
                    ? (isBn ? 'অনুমোদন আদেশ ও নির্দেশনামা (Order Notes)' : 'Order Notes & Instructions')
                    : (isBn ? 'সংশোধন বা বাতিলের সুস্পষ্ট আইনি কারণ *' : 'Specific Grounds for Return / Dismissal *')}
                </label>
                <textarea
                  rows={4}
                  value={reasonBn}
                  onChange={(e) => setReasonBn(e.target.value)}
                  placeholder={
                    actionType === 'approve'
                      ? (isBn ? 'ইউনিয়ন রিপোর্ট ও রেকর্ড পর্যালোচনায় বিক্রেতার স্বত্ব সঠিক পাওয়া গেল। সাব-রেজিস্ট্রি অফিসে হস্তান্তরের অনুমোদন দেয়া হলো।' : 'Union report and record review verify seller ownership share. Approved for deed execution at Sub-Registry office.')
                      : actionType === 'return'
                      ? (isBn ? 'বিক্রেতার খতিয়ানের মোট হিস্যা সংশোধনপূর্বক পুনঃদাখিলের নির্দেশ দেয়া হলো।' : 'Instructed to correct seller total share in khatian before resubmission.')
                      : (isBn ? 'খতিয়ানে বিক্রেতার কোন হস্তান্তরযোগ্য অবশিষ্ট অংশ না থাকায় আবেদনটি খারিজ করা হলো।' : 'Dismissed due to absence of transferable remaining share in the khatian.')
                  }
                  className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs"
                  required={actionType !== 'approve'}
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setActionType(null)}
                  className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition cursor-pointer"
                  disabled={submitting}
                >
                  {isBn ? 'বাতিল' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className={`px-4 py-2 rounded-lg text-white font-bold transition flex items-center gap-1.5 cursor-pointer ${
                    actionType === 'approve'
                      ? 'bg-indigo-700 hover:bg-indigo-800'
                      : actionType === 'return'
                      ? 'bg-amber-600 hover:bg-amber-700'
                      : 'bg-rose-600 hover:bg-rose-700'
                  }`}
                >
                  {submitting ? (
                    <>
                      <Clock size={14} className="animate-spin" />
                      {isBn ? 'আদেশ জারি হচ্ছে...' : 'Executing order...'}
                    </>
                  ) : (
                    <>
                      {actionType === 'approve' && (isBn ? 'অনুমোদন ও সাব-রেজিস্ট্রিতে প্রেরণ' : 'Approve & Forward')}
                      {actionType === 'return' && (isBn ? 'নাগরিককে ফেরত পাঠান' : 'Return to Citizen')}
                      {actionType === 'reject' && (isBn ? 'খারিজ নিশ্চিত করুন' : 'Confirm Dismissal')}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AcLandApplicationDetailPage;
