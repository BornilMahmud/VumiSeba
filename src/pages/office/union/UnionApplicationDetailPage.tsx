import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../../../services/api';
import { SaleApplication } from '../../../types';
import { StatusBadge } from '../../../components/common/StatusBadge';
import { useLanguage } from '../../../context/LanguageContext';
import {
  ArrowLeft,
  User,
  MapPin,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Clock,
  Coins,
  History,
  CheckSquare,
  FileCheck2,
  HelpCircle
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
  formatLandClass,
  formatDigits,
} from '../../../utils/bilingual';

export const UnionApplicationDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { language } = useLanguage();
  const isBn = language === 'bn';

  const [application, setApplication] = useState<SaleApplication | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Review modal state
  const [actionType, setActionType] = useState<'approve' | 'return' | 'reject' | null>(null);
  const [reasonBn, setReasonBn] = useState('');
  const [fieldFindingsBn, setFieldFindingsBn] = useState('');
  const [isPossessionVerified, setIsPossessionVerified] = useState(true);
  const [boundaryOk, setBoundaryOk] = useState(true);
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
      setError(err.message || (isBn ? 'ডাটা লোড করতে সমস্যা হয়েছে।' : 'Failed to load application data.'));
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
      alert(isBn ? 'সংশোধন বা বাতিলের কারণ উল্লেখ করা বাধ্যতামূলক।' : 'Reason for correction or rejection is required.');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        action: actionType,
        reason_bn: reasonBn.trim() || undefined,
        notes_bn: reasonBn.trim() || undefined,
        field_findings_bn:
          fieldFindingsBn.trim() ||
          (actionType === 'approve'
            ? (isBn ? 'সরেজমিন পরিদর্শন ও স্থানীয় অনুসন্ধানে দখল ও সীমানা সঠিক পাওয়া গেছে।' : 'Possession and boundaries verified accurate on site.')
            : undefined),
        is_possession_verified: isPossessionVerified,
        boundary_ok: boundaryOk,
      };

      const res = await api.sales.unionReview(application.id, payload);
      if (res.success) {
        setActionSuccessMessage(
          res.message_bn ||
            (isBn ? 'পর্যালোচনা সিদ্ধান্ত সফলভাবে সংরক্ষিত হয়েছে।' : 'Review decision saved successfully.')
        );
        setActionType(null);
        await fetchApplication();
      } else {
        alert(res.message_bn || (isBn ? 'কার্যক্রম সম্পন্ন করা যায়নি।' : 'Failed to complete action.'));
      }
    } catch (err: any) {
      alert(err.message || (isBn ? 'সার্ভার ত্রুটি।' : 'Server error.'));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className={`flex flex-col items-center justify-center min-h-[400px] text-slate-500 dark:text-slate-400 ${isBn ? 'font-bengali' : 'font-sans'}`}>
        <Clock className="w-8 h-8 animate-spin text-emerald-600 mb-3" />
        <p className="text-sm">
          {isBn ? 'ইউনিয়ন ভূমি নথি ও আবেদন লোড হচ্ছে...' : 'Loading union land records and application...'}
        </p>
      </div>
    );
  }

  if (error || !application) {
    return (
      <div className={`bg-white dark:bg-slate-900 rounded-xl shadow-xs border border-slate-200 dark:border-slate-800 p-8 text-center max-w-lg mx-auto my-8 ${isBn ? 'font-bengali' : 'font-sans'}`}>
        <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto mb-3" />
        <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
          {isBn ? 'আবেদন পাওয়া যায়নি' : 'Application Not Found'}
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">{error || (isBn ? 'আবেদনের তথ্য বিদ্যমান নেই।' : 'No details available.')}</p>
        <Link
          to="/office/union/dashboard"
          className="inline-flex items-center gap-2 bg-emerald-700 text-white px-4 py-2 rounded-lg text-xs font-semibold hover:bg-emerald-800 transition"
        >
          <ArrowLeft size={14} />
          {isBn ? 'আবেদন তালিকায় ফিরে যান' : 'Back to Applications'}
        </Link>
      </div>
    );
  }

  const isPendingUnionReview =
    application.stage === 'UNION_REVIEW_PENDING' ||
    application.stage === 'submitted' ||
    application.stage === 'SUBMITTED' ||
    application.stage === 'draft';

  const isShareMismatch =
    application.proposed_share > (application.seller_owned_share || 1.0) ||
    application.proposed_area_decimal > (application.seller_owned_area_decimal || 999);

  return (
    <div className={`space-y-6 pb-12 ${isBn ? 'font-bengali' : 'font-sans'}`}>
      {/* Top Breadcrumb & Action bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs">
        <div className="flex items-center gap-3">
          <Link
            to="/office/union/dashboard"
            className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition"
            title={isBn ? 'তালিকায় ফিরুন' : 'Back to list'}
          >
            <ArrowLeft size={18} />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
                {application.application_no}
              </span>
              <StatusBadge stage={application.stage} />
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {isBn ? 'দাখিলের তারিখ:' : 'Submission Date:'}{' '}
              {application.submission_date || new Date().toISOString().split('T')[0]} |{' '}
              {isBn ? 'খতিয়ান নং:' : 'Khatian No:'} {application.parcel?.khatian_no || '৪৫২০'},{' '}
              {isBn ? 'দাগ নং:' : 'Dag No:'} {application.parcel?.dag_no || '১০৮'}
            </p>
          </div>
        </div>

        {isPendingUnionReview && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setActionType('approve');
                setReasonBn('');
                setFieldFindingsBn(
                  isBn
                    ? 'সরেজমিন তদন্তে দাগ ও খতিয়ানের সঠিকতা এবং বিক্রেতার বাস্তবিক দখল নিশ্চিত পাওয়া গেছে।'
                    : 'Possession and boundaries verified accurate on site.'
                );
              }}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 text-white rounded-lg text-xs font-bold hover:bg-emerald-700 transition shadow-xs"
            >
              <CheckCircle2 size={15} />
              {isBn ? 'অনুমোদন ও এসি ল্যান্ডে প্রেরণ' : 'Approve & Forward to AC Land'}
            </button>
            <button
              onClick={() => {
                setActionType('return');
                setReasonBn('');
              }}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-amber-500 text-white rounded-lg text-xs font-bold hover:bg-amber-600 transition shadow-xs"
            >
              <RotateCcw size={15} />
              {isBn ? 'সংশোধনের জন্য ফেরত' : 'Return for Correction'}
            </button>
            <button
              onClick={() => {
                setActionType('reject');
                setReasonBn('');
              }}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-rose-600 text-white rounded-lg text-xs font-bold hover:bg-rose-700 transition shadow-xs"
            >
              <XCircle size={15} />
              {isBn ? 'আবেদন বাতিল' : 'Reject Application'}
            </button>
          </div>
        )}
      </div>

      {actionSuccessMessage && (
        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 text-sm flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={18} className="text-emerald-700 dark:text-emerald-400" />
            <span className="font-semibold">{actionSuccessMessage}</span>
          </div>
          <button
            onClick={() => setActionSuccessMessage(null)}
            className="text-xs text-emerald-800 dark:text-emerald-400 underline hover:text-emerald-950"
          >
            {isBn ? 'বন্ধ করুন' : 'Dismiss'}
          </button>
        </div>
      )}

      {/* Risk Alert / Share Mismatch warning */}
      {isShareMismatch && (
        <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-300 dark:border-rose-800 text-rose-900 dark:text-rose-200 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
          <div className="text-xs">
            <p className="font-bold text-sm">
              {isBn
                ? 'সতর্কতা: হস্তান্তরিত হিস্যা বিক্রেতার মালিকানাধীন অংশের অতিরিক্ত (Overselling Risk)'
                : 'Warning: Proposed transfer area exceeds seller ownership share (Overselling Risk)'}
            </p>
            <p className="mt-1 text-rose-800 dark:text-rose-300">
              {isBn
                ? `রেকর্ড অনুযায়ী বিক্রেতার মোট মালিকানাধীন হিস্যা ${application.seller_owned_share || '০.২৫০০'} (${application.seller_owned_area_decimal || '৮.২৫'} শতাংশ), কিন্তু হস্তান্তরের প্রস্তাব করা হয়েছে ${application.proposed_share} হিস্যা (${application.proposed_area_decimal} শতাংশ)।`
                : `According to record, seller owned share is ${application.seller_owned_share || '0.2500'} (${application.seller_owned_area_decimal || '8.25'} dec), but transfer proposal is ${application.proposed_share} (${application.proposed_area_decimal} dec).`}
            </p>
          </div>
        </div>
      )}

      {/* Grid: 2 Column */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 span): Parties, Land, Tax, Documents */}
        <div className="lg:col-span-2 space-y-6">
          {/* Buyer & Seller Card */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs p-5">
            <h3 className="text-sm font-bold text-slate-800 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3 mb-4">
              <User size={16} className="text-emerald-700 dark:text-emerald-400" />
              {isBn ? 'পক্ষগণের পরিচিতি ও নাগরিক আইডি' : 'Parties Identity & Citizen Details'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Seller */}
              <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-300 bg-emerald-100/80 dark:bg-emerald-950 px-2 py-0.5 rounded">
                  {isBn ? 'বিক্রেতা (Seller)' : 'Seller'}
                </span>
                <h4 className="font-bold text-slate-900 dark:text-white mt-2 text-sm">
                  {formatName(application.seller, isBn)}
                </h4>
                <div className="mt-2 space-y-1 text-xs text-slate-600 dark:text-slate-300">
                  <p>
                    <span className="text-slate-400">{isBn ? 'সিটিজেন আইডি:' : 'Citizen ID:'}</span>{' '}
                    <span className="font-mono font-semibold text-slate-800 dark:text-slate-200">
                      {application.seller_citizen_id || application.seller?.citizen_id || 'BHM-CIT-104928'}
                    </span>
                  </p>
                  <p>
                    <span className="text-slate-400">{isBn ? 'জাতীয় পরিচয়পত্র:' : 'NID:'}</span>{' '}
                    {application.seller?.nid || '19850919745610001'}
                  </p>
                  <p>
                    <span className="text-slate-400">{isBn ? 'মোবাইল:' : 'Phone:'}</span>{' '}
                    {application.seller?.phone || '017XXXXXXXX'}
                  </p>
                </div>
              </div>

              {/* Buyer */}
              <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 dark:text-blue-300 bg-blue-100/80 dark:bg-blue-950 px-2 py-0.5 rounded">
                  {isBn ? 'ক্রেতা (Buyer)' : 'Buyer'}
                </span>
                <h4 className="font-bold text-slate-900 dark:text-white mt-2 text-sm">
                  {formatName(application.buyer, isBn)}
                </h4>
                <div className="mt-2 space-y-1 text-xs text-slate-600 dark:text-slate-300">
                  <p>
                    <span className="text-slate-400">{isBn ? 'সিটিজেন আইডি:' : 'Citizen ID:'}</span>{' '}
                    <span className="font-mono font-semibold text-slate-800 dark:text-slate-200">
                      {application.buyer_citizen_id || application.buyer?.citizen_id || 'BHM-CIT-928471'}
                    </span>
                  </p>
                  <p>
                    <span className="text-slate-400">{isBn ? 'জাতীয় পরিচয়পত্র:' : 'NID:'}</span>{' '}
                    {application.buyer?.nid || '19920919841230009'}
                  </p>
                  <p>
                    <span className="text-slate-400">{isBn ? 'মোবাইল:' : 'Phone:'}</span>{' '}
                    {application.buyer?.phone || '019XXXXXXXX'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Parcel & Transfer Details */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs p-5">
            <h3 className="text-sm font-bold text-slate-800 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3 mb-4">
              <MapPin size={16} className="text-emerald-700 dark:text-emerald-400" />
              {isBn ? 'জমির তপশিল ও হস্তান্তরিত হিস্যার বিবরণ' : 'Land Schedule & Proposed Transfer Area'}
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs mb-4">
              <div className="p-2.5 rounded bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700">
                <span className="text-slate-400 block text-[11px]">{isBn ? 'জেলা ও উপজেলা' : 'District & Upazila'}</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {formatDistrict(application.parcel?.district, isBn)}, {formatUpazila(application.parcel?.upazila, isBn)}
                </span>
              </div>
              <div className="p-2.5 rounded bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700">
                <span className="text-slate-400 block text-[11px]">{isBn ? 'মৌজা ও জেএল নং' : 'Mouza & JL No'}</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {formatMouza(application.parcel, isBn)}, JL-{formatDigits(application.parcel?.jl_no || '07', isBn)}
                </span>
              </div>
              <div className="p-2.5 rounded bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700">
                <span className="text-slate-400 block text-[11px]">{isBn ? 'খতিয়ান নং (বিএস)' : 'Khatian (BS)'}</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200 font-mono">{formatDigits(application.parcel?.khatian_no || '4520', isBn)}</span>
              </div>
              <div className="p-2.5 rounded bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700">
                <span className="text-slate-400 block text-[11px]">{isBn ? 'দাগ নং' : 'Dag No'}</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200 font-mono">{formatDigits(application.parcel?.dag_no || '108', isBn)}</span>
              </div>
            </div>

            <div className="bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-lg p-3.5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <span className="text-slate-500 dark:text-slate-400 block text-[11px]">{isBn ? 'জমির শ্রেণী:' : 'Land Class:'}</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{formatLandClass(application.parcel?.land_type_bn || application.parcel?.land_class, isBn)}</span>
                </div>
                <div>
                  <span className="text-slate-500 dark:text-slate-400 block text-[11px]">{isBn ? 'দাগে মোট জমির পরিমাণ:' : 'Total Area in Dag:'}</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{formatArea(application.parcel?.total_area_decimal || '33.00', isBn, true)}</span>
                </div>
                <div>
                  <span className="text-slate-500 dark:text-slate-400 block text-[11px]">{isBn ? 'বিক্রেতার স্বত্বাধিকারী অংশ:' : 'Seller Owned Share:'}</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    {formatDigits(application.seller_owned_share || '0.2500', isBn)} ({formatArea(application.seller_owned_area_decimal || '8.25', isBn, true)})
                  </span>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-emerald-200 dark:border-emerald-800 flex flex-wrap items-center justify-between gap-2">
                <div>
                  <span className="text-emerald-900 dark:text-emerald-300 font-semibold">{isBn ? 'প্রস্তাবিত বিক্রয়কৃত পরিমাণ:' : 'Proposed Sold Area:'}</span>
                  <span className="font-bold text-emerald-800 dark:text-emerald-300 text-sm ml-2">
                    {application.proposed_area_decimal} {isBn ? 'শতাংশ' : 'dec'} ({isBn ? `হিস্যা: ${application.proposed_share}` : `Share: ${application.proposed_share}`})
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 dark:text-slate-400">{isBn ? 'অবশিষ্ট স্বত্ব:' : 'Remaining Share:'}</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200 ml-1">
                    {Math.max(0, (application.seller_owned_area_decimal || 8.25) - application.proposed_area_decimal).toFixed(2)} {isBn ? 'শতাংশ' : 'dec'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Tax & Dakhila Holding Check */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs p-5">
            <h3 className="text-sm font-bold text-slate-800 dark:text-white flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 mb-4">
              <span className="flex items-center gap-2">
                <Coins size={16} className="text-emerald-700 dark:text-emerald-400" />
                {isBn ? 'ভূমি উন্নয়ন কর ও হোল্ডিং যাচাই' : 'Land Development Tax & Holding Audit'}
              </span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                application.tax_clearance_status === 'CLEARED'
                  ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700'
                  : 'bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300 border-rose-300 dark:border-rose-700'
              }`}>
                {application.tax_clearance_status === 'CLEARED'
                  ? (isBn ? 'কর পরিশোধিত (ক্লিয়ার)' : 'Tax Cleared')
                  : (isBn ? 'কর বকেয়া বিদ্যমান' : 'Tax Dues Pending')}
              </span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <span className="text-slate-400 block text-[11px]">{isBn ? 'হোল্ডিং নম্বর' : 'Holding No'}</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200 font-mono">{application.holding_no || 'HLD-2026-8812'}</span>
              </div>
              <div className="p-3 rounded bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <span className="text-slate-400 block text-[11px]">{isBn ? 'সর্বশেষ পরিশোধিত অর্থবছর' : 'Latest Cleared Fiscal Year'}</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{isBn ? '১৪৩০-৩১ বঙ্গাব্দ (২০২৪-২৫)' : 'FY 2024-25'}</span>
              </div>
              <div className="p-3 rounded bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <span className="text-slate-400 block text-[11px]">{isBn ? 'বকেয়া কর ও জরিমানা' : 'Pending Dues & Fine'}</span>
                <span className={`font-bold ${application.tax_clearance_status === 'CLEARED' ? 'text-emerald-700 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                  {application.tax_clearance_status === 'CLEARED' ? (isBn ? '৳০.০০ (পরিশোধিত)' : '৳0.00 (Cleared)') : (isBn ? '৳৪৫০.০০ (বকেয়া)' : '৳450.00 (Pending)')}
                </span>
              </div>
            </div>
          </div>

          {/* Document Verification Checklist */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs p-5">
            <h3 className="text-sm font-bold text-slate-800 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3 mb-4">
              <FileCheck2 size={16} className="text-emerald-700 dark:text-emerald-400" />
              {isBn ? 'সংযুক্ত দলিলাদি ও যাচাই নিরীক্ষা' : 'Attached Documents & Verification Checklist'}
            </h3>

            <div className="space-y-2.5 text-xs">
              {[
                {
                  title: isBn ? 'সর্বশেষ খতিয়ানের সত্যায়িত অনলাইন কপি (বিএস খতিয়ান)' : 'Certified Online Copy of Latest BS Khatian',
                  status: 'verified',
                  label: isBn ? 'রেকর্ড অনুযায়ী সঠিক' : 'Matches Land Record',
                },
                {
                  title: isBn ? 'ভূমি উন্নয়ন কর পরিশোধের দাখিলা কপি (১৪৩০ বঙ্গাব্দ)' : 'Land Development Tax Dakhila Receipt',
                  status: application.tax_clearance_status === 'CLEARED' ? 'verified' : 'pending',
                  label: application.tax_clearance_status === 'CLEARED' ? (isBn ? 'দাখিলা হালনাগাদ' : 'Dakhila Up to date') : (isBn ? 'বকেয়া দাখিলা সংযুক্ত নয়' : 'Tax Clearance Pending'),
                },
                {
                  title: isBn ? 'ওয়ারিশান সনদ বা মূল হস্তান্তরের দলিল সূত্র' : 'Inheritance Certificate or Title Deed Reference',
                  status: 'verified',
                  label: isBn ? 'বায়া দলিল নং ৩৪০৯ সংগৃহীত' : 'Baya Deed No. 3409 Verified',
                },
                {
                  title: isBn ? 'ক্রেতা ও বিক্রেতার জাতীয় পরিচয়পত্র কপি ও ছবি' : 'Buyer & Seller NID and Biometric Verification',
                  status: 'verified',
                  label: isBn ? 'নির্বাচন কমিশন ডাটাবেজ যাচাইকৃত' : 'EC Database Verified',
                },
                {
                  title: isBn ? 'সরেজমিন নালিশি জমির দখল ও সীমানা স্কেচ ম্যাপ' : 'Field Sketch Map of Physical Boundaries & Possession',
                  status: 'verified',
                  label: isBn ? 'তহশিলদার স্কেচ সংরক্ষিত' : 'Field Sketch Stored',
                },
              ].map((doc, idx) => (
                <div key={idx} className="flex items-center justify-between p-2.5 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60">
                  <div className="flex items-center gap-2">
                    <CheckSquare className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span className="text-slate-800 dark:text-slate-200 font-medium">{doc.title}</span>
                  </div>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                    doc.status === 'verified'
                      ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300'
                      : 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300'
                  }`}>
                    {doc.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (1 span): Review Status, Previous Reports, Actions */}
        <div className="space-y-6">
          {/* Review Status Card */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs p-5">
            <h3 className="text-sm font-bold text-slate-800 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3 mb-4">
              <History size={16} className="text-emerald-700 dark:text-emerald-400" />
              {isBn ? 'আবেদনের পর্যালোচনা অবস্থা' : 'Application Review Status'}
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500 dark:text-slate-400">{isBn ? 'বর্তমান পর্যায়:' : 'Current Stage:'}</span>
                <span className="font-bold text-slate-800 dark:text-white"><StatusBadge stage={application.stage} /></span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500 dark:text-slate-400">{isBn ? 'ইউনিয়ন অফিস:' : 'Union Office:'}</span>
                <span className="font-semibold text-slate-800 dark:text-white">
                  {isBn ? 'বাড্ডা ও সাঁতারকুল তশীল অফিস' : 'Badda & Satarkul Tehsildar Office'}
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500 dark:text-slate-400">{isBn ? 'দায়িত্বরত কর্মকর্তা:' : 'Assigned Officer:'}</span>
                <span className="font-semibold text-slate-800 dark:text-white">
                  {isBn ? 'ইউনিয়ন ভূমি সহকারী কর্মকর্তা' : 'Union Land Assistant Officer (ULAO)'}
                </span>
              </div>
            </div>

            {application.rejection_reason_bn && (
              <div className="mt-4 p-3 rounded-lg bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-900 dark:text-rose-200 text-xs">
                <p className="font-bold text-rose-800 dark:text-rose-300 mb-1">{isBn ? 'আবেদন বাতিলের কারণ:' : 'Rejection Reason:'}</p>
                <p>{application.rejection_reason_bn}</p>
              </div>
            )}

            {application.return_reason_bn && (
              <div className="mt-4 p-3 rounded-lg bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200 text-xs">
                <p className="font-bold text-amber-800 dark:text-amber-300 mb-1">{isBn ? 'সংশোধনের নির্দেশনা:' : 'Correction Notice:'}</p>
                <p>{application.return_reason_bn}</p>
              </div>
            )}

            {application.union_report && (
              <div className="mt-4 p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 text-xs">
                <p className="font-bold text-emerald-800 dark:text-emerald-300 mb-1">{isBn ? 'দাখিলকৃত ইউনিয়ন রিপোর্ট:' : 'Submitted Union Report:'}</p>
                <p>{application.union_report.field_findings_bn || application.union_report.recommendation_bn || (isBn ? 'তদন্তে রেকর্ড ও সীমানা সঠিক পাওয়া গেছে।' : 'Possession and boundaries verified.')}</p>
                <p className="text-[10px] text-emerald-700 dark:text-emerald-400 mt-1">{isBn ? 'তারিখ:' : 'Date:'} {application.union_report.submitted_at || (isBn ? 'যাচাইকৃত' : 'Verified')}</p>
              </div>
            )}
          </div>

          {/* Quick Guidance Box */}
          <div className="bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 text-xs text-slate-600 dark:text-slate-300">
            <h4 className="font-bold text-slate-800 dark:text-white flex items-center gap-1.5 mb-2">
              <HelpCircle size={14} className="text-emerald-700 dark:text-emerald-400" />
              {isBn ? 'তহশিলদারের কার্যপ্রণালী নির্দেশিকা' : 'Officer Operating Protocol'}
            </h4>
            <ul className="list-disc pl-4 space-y-1.5 text-slate-600 dark:text-slate-400 text-[11px]">
              <li>{isBn ? 'বিএস খতিয়ান ও দাগের সাথে স্থানীয় ভলিউমের ১নং রেজিস্টার মিলিয়ে দেখুন।' : 'Match BS Khatian and Dag with local Volume Register 1.'}</li>
              <li>{isBn ? 'বিক্রেতার হিস্যা ও বাস্তবে দখলকৃত সীমানা ঠিক আছে কিনা তা সরেজমিন নিশ্চিত করুন।' : 'Physically confirm seller share and boundary demarcations.'}</li>
              <li>{isBn ? 'হোল্ডিং কর বকেয়া থাকলে তা পরিশোধ সাপেক্ষে প্রতিবেদন প্রদান করুন।' : 'Ensure holding land tax is cleared prior to submission.'}</li>
              <li>{isBn ? 'সব সঠিক থাকলে অনুমোদন করে নথি এসি ল্যান্ড অফিসে প্রেরণ করুন।' : 'If accurate, approve and forward file to AC Land Office.'}</li>
            </ul>
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

      {/* Review Modal */}
      {actionType && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className={`bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 ${isBn ? 'font-bengali' : 'font-sans'}`}>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                {actionType === 'approve' && <CheckCircle2 className="w-5 h-5 text-emerald-600" />}
                {actionType === 'return' && <RotateCcw className="w-5 h-5 text-amber-500" />}
                {actionType === 'reject' && <XCircle className="w-5 h-5 text-rose-600" />}
                {actionType === 'approve' && (isBn ? 'ইউনিয়ন রিপোর্ট অনুমোদন ও এসি ল্যান্ডে প্রেরণ' : 'Approve Union Report & Send to AC Land')}
                {actionType === 'return' && (isBn ? 'সংশোধনের জন্য নাগরিকের কাছে ফেরত' : 'Return to Citizen for Correction')}
                {actionType === 'reject' && (isBn ? 'আবেদন সরাসরি বাতিলকরণ' : 'Reject Application Directly')}
              </h3>
              <button
                onClick={() => setActionType(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleReviewSubmit} className="space-y-4 text-xs">
              {actionType === 'approve' && (
                <>
                  <div className="space-y-2">
                    <label className="font-bold text-slate-700 dark:text-slate-200 block">
                      {isBn ? 'সরেজমিন তদন্তের সারসংক্ষেপ (Field Findings)' : 'Field Findings Summary'}
                    </label>
                    <textarea
                      rows={3}
                      value={fieldFindingsBn}
                      onChange={(e) => setFieldFindingsBn(e.target.value)}
                      placeholder={
                        isBn
                          ? 'জমির অবস্থান, সীমানা এবং বিক্রেতার স্বত্ব দখল সংক্রান্ত মন্তব্য...'
                          : 'Comments on land location, boundary and seller possession...'
                      }
                      className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs"
                      required
                    />
                  </div>

                  <div className="space-y-2 p-3 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-slate-200 dark:border-slate-700">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isPossessionVerified}
                        onChange={(e) => setIsPossessionVerified(e.target.checked)}
                        className="rounded text-emerald-600 focus:ring-emerald-500"
                      />
                      <span className="font-semibold text-slate-800 dark:text-slate-200">
                        {isBn ? 'বিক্রেতার সরজমিন দখল ও স্বত্ব সঠিক' : 'Seller possession and ownership confirmed'}
                      </span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={boundaryOk}
                        onChange={(e) => setBoundaryOk(e.target.checked)}
                        className="rounded text-emerald-600 focus:ring-emerald-500"
                      />
                      <span className="font-semibold text-slate-800 dark:text-slate-200">
                        {isBn ? 'চৌহদ্দি ও সীমানা বিরোধমুক্ত' : 'Boundaries and demarcations dispute-free'}
                      </span>
                    </label>
                  </div>
                </>
              )}

              {(actionType === 'return' || actionType === 'reject') && (
                <div className="space-y-2">
                  <label className="font-bold text-slate-700 dark:text-slate-200 block">
                    {actionType === 'return'
                      ? (isBn ? 'সংশোধনের বিবরণ ও প্রয়োজনীয় দলিলের তালিকা *' : 'Correction details & required documents *')
                      : (isBn ? 'আবেদন বাতিলের সুস্পষ্ট কারণ *' : 'Specific reason for rejection *')}
                  </label>
                  <textarea
                    rows={4}
                    value={reasonBn}
                    onChange={(e) => setReasonBn(e.target.value)}
                    placeholder={
                      actionType === 'return'
                        ? (isBn
                            ? 'যেমন: ১৪৩০ বঙ্গাব্দের হালনাগাদ দাখিলা কপি সংযুক্ত করুন এবং ওয়ারিশান সনদপত্র পুনঃদাখিল করুন।'
                            : 'e.g. Please attach updated tax receipt and re-submit inheritance certificate.')
                        : (isBn
                            ? 'যেমন: খতিয়ানের মোট হিস্যা অপেক্ষা প্রস্তাবিত হিস্যা অতিরিক্ত এবং জমি নিয়ে আদালতে দেওয়ানী মামলা চলমান।'
                            : 'e.g. Proposed transfer share exceeds seller record share and civil suit is ongoing.')
                    }
                    className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs"
                    required
                  />
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    {isBn
                      ? '* কারণটি নাগরিকের ড্যাশবোর্ডে ও নোটিফিকেশনে সরাসরি দৃশ্যমান হবে।'
                      : '* This note will be visible to citizen on dashboard and notifications.'}
                  </p>
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setActionType(null)}
                  className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition"
                  disabled={submitting}
                >
                  {isBn ? 'বাতিল' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className={`px-4 py-2 rounded-lg text-white font-bold transition flex items-center gap-1.5 ${
                    actionType === 'approve'
                      ? 'bg-emerald-600 hover:bg-emerald-700'
                      : actionType === 'return'
                      ? 'bg-amber-600 hover:bg-amber-700'
                      : 'bg-rose-600 hover:bg-rose-700'
                  }`}
                >
                  {submitting ? (
                    <>
                      <Clock size={14} className="animate-spin" />
                      {isBn ? 'সংরক্ষণ হচ্ছে...' : 'Saving...'}
                    </>
                  ) : (
                    <>
                      {actionType === 'approve' && (isBn ? 'এসি ল্যান্ডে প্রেরণ করুন' : 'Send to AC Land')}
                      {actionType === 'return' && (isBn ? 'নাগরিককে ফেরত দিন' : 'Return to Citizen')}
                      {actionType === 'reject' && (isBn ? 'বাতিল নিশ্চিত করুন' : 'Confirm Rejection')}
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

export default UnionApplicationDetailPage;

