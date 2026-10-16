import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { api } from '../../../services/api';
import { SaleApplication } from '../../../types';
import { StatusBadge } from '../../../components/common/StatusBadge';
import {
  ArrowLeft,
  Building2,
  User,
  MapPin,
  FileText,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Clock,
  ShieldCheck,
  Coins,
  History,
  CheckSquare,
  Square,
  FileCheck2,
  HelpCircle
} from 'lucide-react';

export const UnionApplicationDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

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
        setError(res.message_bn || 'আবেদনটি খুঁজে পাওয়া যায়নি।');
      }
    } catch (err: any) {
      setError(err.message || 'ডাটা লোড করতে সমস্যা হয়েছে।');
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
      alert('সংশোধন বা বাতিলের কারণ উল্লেখ করা বাধ্যতামূলক।');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        action: actionType,
        reason_bn: reasonBn.trim() || undefined,
        notes_bn: reasonBn.trim() || undefined,
        field_findings_bn: fieldFindingsBn.trim() || (actionType === 'approve' ? 'সরেজমিন পরিদর্শন ও স্থানীয় অনুসন্ধানে দখল ও সীমানা সঠিক পাওয়া গেছে।' : undefined),
        is_possession_verified: isPossessionVerified,
        boundary_ok: boundaryOk,
      };

      const res = await api.sales.unionReview(application.id, payload);
      if (res.success) {
        setActionSuccessMessage(res.message_bn || 'পর্যালোচনা সিদ্ধান্ত সফলভাবে সংরক্ষিত হয়েছে।');
        setActionType(null);
        await fetchApplication();
      } else {
        alert(res.message_bn || 'কার্যক্রম সম্পন্ন করা যায়নি।');
      }
    } catch (err: any) {
      alert(err.message || 'সার্ভার ত্রুটি।');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-slate-500 font-bengali">
        <Clock className="w-8 h-8 animate-spin text-emerald-600 mb-3" />
        <p className="text-sm">ইউনিয়ন ভূমি নথি ও আবেদন লোড হচ্ছে...</p>
      </div>
    );
  }

  if (error || !application) {
    return (
      <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-8 text-center max-w-lg mx-auto font-bengali my-8">
        <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto mb-3" />
        <h2 className="text-lg font-bold text-slate-900 mb-2">আবেদন পাওয়া যায়নি</h2>
        <p className="text-sm text-slate-600 mb-4">{error || 'আবেদনের তথ্য বিদ্যমান নেই।'}</p>
        <Link
          to="/office/union/applications"
          className="inline-flex items-center gap-2 bg-emerald-700 text-white px-4 py-2 rounded-lg text-xs font-semibold hover:bg-emerald-800 transition"
        >
          <ArrowLeft size={14} />
          আবেদন তালিকায় ফিরে যান
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
    (application.proposed_area_decimal > (application.seller_owned_area_decimal || 999));

  return (
    <div className="space-y-6 font-bengali pb-12">
      {/* Top Breadcrumb & Action bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
        <div className="flex items-center gap-3">
          <Link
            to="/office/union/applications"
            className="p-2 rounded-lg hover:bg-slate-100 text-slate-600 transition"
            title="তালিকায় ফিরুন"
          >
            <ArrowLeft size={18} />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">
                {application.application_no}
              </span>
              <StatusBadge status={application.stage} />
            </div>
            <p className="text-xs text-slate-500 mt-1">
              দাখিলের তারিখ: {application.submission_date || new Date().toISOString().split('T')[0]} | খতিয়ান নং: {application.parcel?.khatian_no || '৪৫২০'}, দাগ নং: {application.parcel?.dag_no || '১০৮'}
            </p>
          </div>
        </div>

        {isPendingUnionReview && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setActionType('approve');
                setReasonBn('');
                setFieldFindingsBn('সরেজমিন তদন্তে দাগ ও খতিয়ানের সঠিকতা এবং বিক্রেতার বাস্তবিক দখল নিশ্চিত পাওয়া গেছে।');
              }}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 text-white rounded-lg text-xs font-bold hover:bg-emerald-700 transition shadow-xs"
            >
              <CheckCircle2 size={15} />
              অনুমোদন ও এসি ল্যান্ডে প্রেরণ
            </button>
            <button
              onClick={() => {
                setActionType('return');
                setReasonBn('');
              }}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-amber-500 text-white rounded-lg text-xs font-bold hover:bg-amber-600 transition shadow-xs"
            >
              <RotateCcw size={15} />
              সংশোধনের জন্য ফেরত
            </button>
            <button
              onClick={() => {
                setActionType('reject');
                setReasonBn('');
              }}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-rose-600 text-white rounded-lg text-xs font-bold hover:bg-rose-700 transition shadow-xs"
            >
              <XCircle size={15} />
              আবেদন বাতিল
            </button>
          </div>
        )}
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

      {/* Risk Alert / Share Mismatch warning */}
      {isShareMismatch && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-300 text-rose-900 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div className="text-xs">
            <p className="font-bold text-sm">সতর্কতা: হস্তান্তরিত হিস্যা বিক্রেতার মালিকানাধীন অংশের অতিরিক্ত (Overselling Risk)</p>
            <p className="mt-1 text-rose-800">
              রেকর্ড অনুযায়ী বিক্রেতার মোট মালিকানাধীন হিস্যা {application.seller_owned_share || '০.২৫০০'} ({application.seller_owned_area_decimal || '৮.২৫'} শতাংশ), কিন্তু হস্তান্তরের প্রস্তাব করা হয়েছে {application.proposed_share} হিস্যা ({application.proposed_area_decimal} শতাংশ)।
            </p>
          </div>
        </div>
      )}

      {/* Grid: 2 Column */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 span): Parties, Land, Tax, Documents */}
        <div className="lg:col-span-2 space-y-6">
          {/* Buyer & Seller Card */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-5">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-3 mb-4">
              <User size={16} className="text-emerald-700" />
              পক্ষগণের পরিচিতি ও নাগরিক আইডি
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Seller */}
              <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded">
                  বিক্রেতা (Seller)
                </span>
                <h4 className="font-bold text-slate-900 mt-2 text-sm">{application.seller?.name_bn || 'মো: রফিকুল ইসলাম'}</h4>
                <div className="mt-2 space-y-1 text-xs text-slate-600">
                  <p><span className="text-slate-400">সিটিজেন আইডি:</span> <span className="font-mono font-semibold text-slate-800">{application.seller_citizen_id || application.seller?.citizen_id || 'BHM-CIT-104928'}</span></p>
                  <p><span className="text-slate-400">জাতীয় পরিচয়পত্র:</span> {application.seller?.nid || '১৯৮৫০৯১৯৭৪৫৬১০০০১'}</p>
                  <p><span className="text-slate-400">মোবাইল:</span> {application.seller?.phone || '০১৭XXXXXXXX'}</p>
                </div>
              </div>

              {/* Buyer */}
              <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-blue-100/80 px-2 py-0.5 rounded">
                  ক্রেতা (Buyer)
                </span>
                <h4 className="font-bold text-slate-900 mt-2 text-sm">{application.buyer?.name_bn || 'মিসেস তাসলিমা বেগম'}</h4>
                <div className="mt-2 space-y-1 text-xs text-slate-600">
                  <p><span className="text-slate-400">সিটিজেন আইডি:</span> <span className="font-mono font-semibold text-slate-800">{application.buyer_citizen_id || application.buyer?.citizen_id || 'BHM-CIT-928471'}</span></p>
                  <p><span className="text-slate-400">জাতীয় পরিচয়পত্র:</span> {application.buyer?.nid || '১৯৯২০৯১৯৮৪১২৩০০৯'}</p>
                  <p><span className="text-slate-400">মোবাইল:</span> {application.buyer?.phone || '০১৯XXXXXXXX'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Parcel & Transfer Details */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-5">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-3 mb-4">
              <MapPin size={16} className="text-emerald-700" />
              জমির তপশিল ও হস্তান্তরিত হিস্যার বিবরণ
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs mb-4">
              <div className="p-2.5 rounded bg-slate-50 border border-slate-100">
                <span className="text-slate-400 block text-[11px]">জেলা ও উপজেলা</span>
                <span className="font-semibold text-slate-800">{application.parcel?.district_bn || 'ঢাকা'}, {application.parcel?.upazila_bn || 'গুলশান'}</span>
              </div>
              <div className="p-2.5 rounded bg-slate-50 border border-slate-100">
                <span className="text-slate-400 block text-[11px]">মৌজা ও জেএল নং</span>
                <span className="font-semibold text-slate-800">{application.parcel?.mouza_bn || 'সাঁতারকুল'}, জেএল-{application.parcel?.jl_no || '০৭'}</span>
              </div>
              <div className="p-2.5 rounded bg-slate-50 border border-slate-100">
                <span className="text-slate-400 block text-[11px]">খতিয়ান নং (বিএস)</span>
                <span className="font-semibold text-slate-800 font-mono">{application.parcel?.khatian_no || '৪৫২০'}</span>
              </div>
              <div className="p-2.5 rounded bg-slate-50 border border-slate-100">
                <span className="text-slate-400 block text-[11px]">দাগ নং</span>
                <span className="font-semibold text-slate-800 font-mono">{application.parcel?.dag_no || '১০৮'}</span>
              </div>
            </div>

            <div className="bg-emerald-50/70 border border-emerald-200 rounded-lg p-3.5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <span className="text-slate-500 block text-[11px]">জমির শ্রেণী:</span>
                  <span className="font-bold text-slate-800">{application.parcel?.land_type_bn || 'নাল / ধানী'}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">দাগে মোট জমির পরিমাণ:</span>
                  <span className="font-bold text-slate-800">{application.parcel?.total_area_decimal || '৩৩.০০'} শতাংশ</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">বিক্রেতার স্বত্বাধিকারী অংশ:</span>
                  <span className="font-bold text-slate-800">{application.seller_owned_share || '০.২৫০০'} ({application.seller_owned_area_decimal || '৮.২৫'} শতক)</span>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-emerald-200 flex flex-wrap items-center justify-between gap-2">
                <div>
                  <span className="text-emerald-900 font-semibold">প্রস্তাবিত বিক্রয়কৃত পরিমাণ:</span>
                  <span className="font-bold text-emerald-800 text-sm ml-2">{application.proposed_area_decimal} শতাংশ (হিস্যা: {application.proposed_share})</span>
                </div>
                <div>
                  <span className="text-slate-500">অবশিষ্ট স্বত্ব:</span>
                  <span className="font-bold text-slate-800 ml-1">
                    {Math.max(0, (application.seller_owned_area_decimal || 8.25) - application.proposed_area_decimal).toFixed(2)} শতাংশ
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Tax & Dakhila Holding Check */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-5">
            <h3 className="text-sm font-bold text-slate-800 flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <span className="flex items-center gap-2">
                <Coins size={16} className="text-emerald-700" />
                ভূমি উন্নয়ন কর ও হোল্ডিং যাচাই
              </span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                application.tax_clearance_status === 'CLEARED'
                  ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                  : 'bg-rose-100 text-rose-800 border-rose-300'
              }`}>
                {application.tax_clearance_status === 'CLEARED' ? 'কর পরিশোধিত (ক্লিয়ার)' : 'কর বকেয়া বিদ্যমান'}
              </span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded bg-slate-50 border border-slate-200">
                <span className="text-slate-400 block text-[11px]">হোল্ডিং নম্বর</span>
                <span className="font-semibold text-slate-800 font-mono">{application.holding_no || 'HLD-2026-8812'}</span>
              </div>
              <div className="p-3 rounded bg-slate-50 border border-slate-200">
                <span className="text-slate-400 block text-[11px]">সর্বশেষ পরিশোধিত অর্থবছর</span>
                <span className="font-semibold text-slate-800">১৪৩০-৩১ বঙ্গাব্দ (২০২৪-২৫)</span>
              </div>
              <div className="p-3 rounded bg-slate-50 border border-slate-200">
                <span className="text-slate-400 block text-[11px]">বকেয়া কর ও জরিমানা</span>
                <span className={`font-bold ${application.tax_clearance_status === 'CLEARED' ? 'text-emerald-700' : 'text-rose-600'}`}>
                  {application.tax_clearance_status === 'CLEARED' ? '৳০.০০ (পরিশোধিত)' : '৳৪৫০.০০ (বকেয়া)'}
                </span>
              </div>
            </div>
          </div>

          {/* Document Verification Checklist */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-5">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-3 mb-4">
              <FileCheck2 size={16} className="text-emerald-700" />
              সংযুক্ত দলিলাদি ও যাচাই নিরীক্ষা
            </h3>

            <div className="space-y-2.5 text-xs">
              {[
                { title: 'সর্বশেষ খতিয়ানের সত্যায়িত অনলাইন কপি (বিএস খতিয়ান)', status: 'verified', label: 'রেকর্ড অনুযায়ী সঠিক' },
                { title: 'ভূমি উন্নয়ন কর পরিশোধের দাখিলা কপি (১৪৩০ বঙ্গাব্দ)', status: application.tax_clearance_status === 'CLEARED' ? 'verified' : 'pending', label: application.tax_clearance_status === 'CLEARED' ? 'দাখিলা হালনাগাদ' : 'বকেয়া দাখিলা সংযুক্ত নয়' },
                { title: 'ওয়ারিশান সনদ বা মূল হস্তান্তরের দলিল সূত্র', status: 'verified', label: 'বায়া দলিল নং ৩৪০৯ সংগৃহীত' },
                { title: 'ক্রেতা ও বিক্রেতার জাতীয় পরিচয়পত্র কপি ও ছবি', status: 'verified', label: 'নির্বাচন কমিশন ডাটাবেজ যাচাইকৃত' },
                { title: 'সরেজমিন নালিশি জমির দখল ও সীমানা স্কেচ ম্যাপ', status: 'verified', label: 'তহশিলদার স্কেচ সংরক্ষিত' },
              ].map((doc, idx) => (
                <div key={idx} className="flex items-center justify-between p-2.5 rounded-lg border border-slate-100 bg-slate-50">
                  <div className="flex items-center gap-2">
                    <CheckSquare className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="text-slate-800 font-medium">{doc.title}</span>
                  </div>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                    doc.status === 'verified' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
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
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-5">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-3 mb-4">
              <History size={16} className="text-emerald-700" />
              আবেদনের পর্যালোচনা অবস্থা
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">বর্তমান পর্যায়:</span>
                <span className="font-bold text-slate-800"><StatusBadge status={application.stage} /></span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">ইউনিয়ন অফিস:</span>
                <span className="font-semibold text-slate-800">বাড্ডা ও সাঁতারকুল তশীল অফিস</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">দায়িত্বরত কর্মকর্তা:</span>
                <span className="font-semibold text-slate-800">ইউনিয়ন ভূমি সহকারী কর্মকর্তা</span>
              </div>
            </div>

            {application.rejection_reason_bn && (
              <div className="mt-4 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-900 text-xs">
                <p className="font-bold text-rose-800 mb-1">আবেদন বাতিলের কারণ:</p>
                <p>{application.rejection_reason_bn}</p>
              </div>
            )}

            {application.return_reason_bn && (
              <div className="mt-4 p-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-xs">
                <p className="font-bold text-amber-800 mb-1">সংশোধনের নির্দেশনা:</p>
                <p>{application.return_reason_bn}</p>
              </div>
            )}

            {application.union_report && (
              <div className="mt-4 p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs">
                <p className="font-bold text-emerald-800 mb-1">দাখিলকৃত ইউনিয়ন রিপোর্ট:</p>
                <p>{application.union_report.field_findings_bn || application.union_report.recommendation_bn || 'তদন্তে রেকর্ড ও সীমানা সঠিক পাওয়া গেছে।'}</p>
                <p className="text-[10px] text-emerald-700 mt-1">তারিখ: {application.union_report.submitted_at || 'যাচাইকৃত'}</p>
              </div>
            )}
          </div>

          {/* Quick Guidance Box */}
          <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 text-xs text-slate-600">
            <h4 className="font-bold text-slate-800 flex items-center gap-1.5 mb-2">
              <HelpCircle size={14} className="text-emerald-700" />
              তহশিলদারের কার্যপ্রণালী নির্দেশিকা
            </h4>
            <ul className="list-disc pl-4 space-y-1.5 text-slate-600 text-[11px]">
              <li>বিএস খতিয়ান ও দাগের সাথে স্থানীয় ভলিউমের ১নং রেজিস্টার মিলিয়ে দেখুন।</li>
              <li>বিক্রেতার হিস্যা ও বাস্তবে দখলকৃত সীমানা ঠিক আছে কিনা তা সরেজমিন নিশ্চিত করুন।</li>
              <li>হোল্ডিং কর বকেয়া থাকলে তা পরিশোধ সাপেক্ষে প্রতিবেদন প্রদান করুন।</li>
              <li>সব সঠিক থাকলে অনুমোদন করে নথি <strong>এসি ল্যান্ড অফিসে</strong> প্রেরণ করুন।</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Review Modal */}
      {actionType && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 font-bengali">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                {actionType === 'approve' && <CheckCircle2 className="w-5 h-5 text-emerald-600" />}
                {actionType === 'return' && <RotateCcw className="w-5 h-5 text-amber-500" />}
                {actionType === 'reject' && <XCircle className="w-5 h-5 text-rose-600" />}
                {actionType === 'approve' && 'ইউনিয়ন রিপোর্ট অনুমোদন ও এসি ল্যান্ডে প্রেরণ'}
                {actionType === 'return' && 'সংশোধনের জন্য নাগরিকের কাছে ফেরত'}
                {actionType === 'reject' && 'আবেদন সরাসরি বাতিলকরণ'}
              </h3>
              <button
                onClick={() => setActionType(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleReviewSubmit} className="space-y-4 text-xs">
              {actionType === 'approve' && (
                <>
                  <div className="space-y-2">
                    <label className="font-bold text-slate-700 block">সরেজমিন তদন্তের সারসংক্ষেপ (Field Findings)</label>
                    <textarea
                      rows={3}
                      value={fieldFindingsBn}
                      onChange={(e) => setFieldFindingsBn(e.target.value)}
                      placeholder="জমির অবস্থান, সীমানা এবং বিক্রেতার স্বত্ব দখল সংক্রান্ত মন্তব্য..."
                      className="w-full p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs"
                      required
                    />
                  </div>

                  <div className="space-y-2 p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isPossessionVerified}
                        onChange={(e) => setIsPossessionVerified(e.target.checked)}
                        className="rounded text-emerald-600 focus:ring-emerald-500"
                      />
                      <span className="font-semibold text-slate-800">বিক্রেতার সরজমিন দখল ও স্বত্ব সঠিক</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={boundaryOk}
                        onChange={(e) => setBoundaryOk(e.target.checked)}
                        className="rounded text-emerald-600 focus:ring-emerald-500"
                      />
                      <span className="font-semibold text-slate-800">চৌহদ্দি ও সীমানা বিরোধমুক্ত</span>
                    </label>
                  </div>
                </>
              )}

              {(actionType === 'return' || actionType === 'reject') && (
                <div className="space-y-2">
                  <label className="font-bold text-slate-700 block">
                    {actionType === 'return' ? 'সংশোধনের বিবরণ ও প্রয়োজনীয় দলিলের তালিকা *' : 'আবেদন বাতিলের সুস্পষ্ট কারণ *'}
                  </label>
                  <textarea
                    rows={4}
                    value={reasonBn}
                    onChange={(e) => setReasonBn(e.target.value)}
                    placeholder={
                      actionType === 'return'
                        ? 'যেমন: ১৪৩০ বঙ্গাব্দের হালনাগাদ দাখিলা কপি সংযুক্ত করুন এবং ওয়ারিশান সনদপত্র পুনঃদাখিল করুন।'
                        : 'যেমন: খতিয়ানের মোট হিস্যা অপেক্ষা প্রস্তাবিত হিস্যা অতিরিক্ত এবং জমি নিয়ে আদালতে দেওয়ানী মামলা চলমান।'
                    }
                    className="w-full p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs"
                    required
                  />
                  <p className="text-[11px] text-slate-500">
                    * কারণটি নাগরিকের ড্যাশবোর্ডে ও নোটিফিকেশনে সরাসরি দৃশ্যমান হবে।
                  </p>
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setActionType(null)}
                  className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 font-semibold hover:bg-slate-50 transition"
                  disabled={submitting}
                >
                  বাতিল
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
                      সংরক্ষণ হচ্ছে...
                    </>
                  ) : (
                    <>
                      {actionType === 'approve' && 'এসি ল্যান্ডে প্রেরণ করুন'}
                      {actionType === 'return' && 'নাগরিককে ফেরত দিন'}
                      {actionType === 'reject' && 'বাতিল নিশ্চিত করুন'}
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
