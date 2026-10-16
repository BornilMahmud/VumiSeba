import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { api } from '../../../services/api';
import { SaleApplication } from '../../../types';
import { StatusBadge } from '../../../components/common/StatusBadge';
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

export const AcLandApplicationDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

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
      alert('সংশোধন বা বাতিলের সুস্পষ্ট কারণ উল্লেখ করা বাধ্যতামূলক।');
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
        setActionSuccessMessage(res.message_bn || 'সহকারী কমিশনার (ভূমি) এর আদেশ সফলভাবে জারি ও সংরক্ষিত হয়েছে।');
        setActionType(null);
        await fetchApplication();
      } else {
        alert(res.message_bn || 'আদেশ কার্যকর করা যায়নি।');
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
        <Clock className="w-8 h-8 animate-spin text-indigo-600 mb-3" />
        <p className="text-sm">এসি ল্যান্ড কার্যালয়ের মিস নথি লোড হচ্ছে...</p>
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
          to="/office/ac-land/applications"
          className="inline-flex items-center gap-2 bg-indigo-700 text-white px-4 py-2 rounded-lg text-xs font-semibold hover:bg-indigo-800 transition"
        >
          <ArrowLeft size={14} />
          এসি ল্যান্ড তালিকায় ফিরে যান
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
    <div className="space-y-6 font-bengali pb-12">
      {/* Top Breadcrumb & Action bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
        <div className="flex items-center gap-3">
          <Link
            to="/office/ac-land/applications"
            className="p-2 rounded-lg hover:bg-slate-100 text-slate-600 transition"
            title="তালিকায় ফিরুন"
          >
            <ArrowLeft size={18} />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-indigo-900 bg-indigo-50 px-2.5 py-0.5 rounded border border-indigo-200">
                {application.application_no}
              </span>
              <StatusBadge status={application.stage} />
            </div>
            <p className="text-xs text-slate-500 mt-1">
              দাখিল: {application.submission_date || '২০২৬-০৩-১৫'} | উপজেলা: {application.parcel?.upazila_bn || 'গুলশান'} | মৌজা: {application.parcel?.mouza_bn || 'সাঁতারকুল'}
            </p>
          </div>
        </div>

        {isPendingAcLandReview && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setActionType('approve');
                setReasonBn('');
              }}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-indigo-700 text-white rounded-lg text-xs font-bold hover:bg-indigo-800 transition shadow-xs"
            >
              <Send size={15} />
              প্রাক-রেজিস্ট্রি অনুমোদন (সাব-রেজিস্ট্রিতে প্রেরণ)
            </button>
            <button
              onClick={() => {
                setActionType('return');
                setReasonBn('');
              }}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-amber-500 text-white rounded-lg text-xs font-bold hover:bg-amber-600 transition shadow-xs"
            >
              <RotateCcw size={15} />
              সংশোধনের নির্দেশ
            </button>
            <button
              onClick={() => {
                setActionType('reject');
                setReasonBn('');
              }}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-rose-600 text-white rounded-lg text-xs font-bold hover:bg-rose-700 transition shadow-xs"
            >
              <XCircle size={15} />
              খারিজ ও বাতিল
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

      {/* Discrepancy Alert */}
      {isShareMismatch && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-300 text-rose-900 flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div className="text-xs">
            <p className="font-bold text-sm">আইনি সতর্কতা: অতিরিক্ত হিস্যা বিক্রির অসঙ্গতি (Discrepancy Detected)</p>
            <p className="mt-1 text-rose-800">
              রেকর্ড অনুযায়ী বিক্রেতার স্বত্বাধীন অংশ {application.seller_owned_share || '০.২৫০০'} ({application.seller_owned_area_decimal || '৮.২৫'} শতাংশ), কিন্তু বিক্রির আবেদন করা হয়েছে {application.proposed_share} অংশ ({application.proposed_area_decimal} শতাংশ)। সহকারী কমিশনার (ভূমি) কর্তৃক সংশোধনের আদেশ অথবা খারিজ প্রযোজ্য।
            </p>
          </div>
        </div>
      )}

      {/* Main 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 span) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Union Land Office Inspection Report Box */}
          <div className="bg-emerald-50/60 rounded-xl border border-emerald-200 p-5 shadow-2xs">
            <h3 className="text-sm font-bold text-emerald-950 flex items-center justify-between border-b border-emerald-200/80 pb-3 mb-4">
              <span className="flex items-center gap-2">
                <FileCheck size={17} className="text-emerald-700" />
                ইউনিয়ন ভূমি সহকারী কর্মকর্তার (ULAO) সরেজমিন তদন্ত প্রতিবেদন
              </span>
              <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300">
                অগ্রায়িত রিপোর্ট
              </span>
            </h3>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-white rounded-lg border border-emerald-200/70">
                <p className="text-slate-500 text-[11px] font-semibold mb-1">সরেজমিন দখল ও সীমানা পর্যবেক্ষণ:</p>
                <p className="text-slate-800 font-medium italic">
                  "{application.union_report?.field_findings_bn || application.union_report?.recommendation_bn || 'সরেজমিন পরিদর্শন ও স্থানীয় অনুসন্ধানে দেখা যায় যে, প্রস্তাবিত বিক্রিত জমি বিক্রেতার ভোগদখলে রহিয়াছে। বিএস রেকর্ড ও ১নং খতিয়ান অনুযায়ী হিস্যা সঠিক আছে।'}"
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-[11px]">
                <div className="bg-white p-2.5 rounded border border-emerald-100">
                  <span className="text-slate-400 block">দখল যাচাই:</span>
                  <span className="font-bold text-emerald-800">✓ ভোগদখলে বহাল</span>
                </div>
                <div className="bg-white p-2.5 rounded border border-emerald-100">
                  <span className="text-slate-400 block">সীমানা ও বিরোধ:</span>
                  <span className="font-bold text-emerald-800">✓ বিরোধমুক্ত</span>
                </div>
                <div className="bg-white p-2.5 rounded border border-emerald-100">
                  <span className="text-slate-400 block">ভূমি উন্নয়ন কর:</span>
                  <span className={`font-bold ${application.tax_clearance_status === 'CLEARED' ? 'text-emerald-800' : 'text-rose-700'}`}>
                    {application.tax_clearance_status === 'CLEARED' ? '✓ ১৪৩০ সন পর্যন্ত পরিশোধিত' : '⚠ কর বকেয়া বিদ্যমান'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Citizen Parties Card */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-5">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-3 mb-4">
              <User size={16} className="text-indigo-700" />
              পক্ষগণের বিবরণ ও জাতীয় পরিচয়পত্র নিরীক্ষা
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-bold uppercase text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                  বিক্রেতা
                </span>
                <h4 className="font-bold text-slate-900 mt-2 text-sm">{application.seller?.name_bn || 'মো: রফিকুল ইসলাম'}</h4>
                <div className="mt-2 space-y-1 text-slate-600">
                  <p><span className="text-slate-400">সিটিজেন আইডি:</span> <span className="font-mono font-semibold text-slate-800">{application.seller_citizen_id || 'BHM-CIT-104928'}</span></p>
                  <p><span className="text-slate-400">এনআইডি:</span> {application.seller?.nid || '১৯৮৫০৯১৯৭৪৫৬১০০০১'}</p>
                </div>
              </div>

              <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-bold uppercase text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded">
                  ক্রেতা
                </span>
                <h4 className="font-bold text-slate-900 mt-2 text-sm">{application.buyer?.name_bn || 'মিসেস তাসলিমা বেগম'}</h4>
                <div className="mt-2 space-y-1 text-slate-600">
                  <p><span className="text-slate-400">সিটিজেন আইডি:</span> <span className="font-mono font-semibold text-slate-800">{application.buyer_citizen_id || 'BHM-CIT-928471'}</span></p>
                  <p><span className="text-slate-400">এনআইডি:</span> {application.buyer?.nid || '১৯৯২০৯১৯৮৪১২৩০০৯'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Land Schedule & Share Discrepancy Check */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-5">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-3 mb-4">
              <MapPin size={16} className="text-indigo-700" />
              আইনি তপশিল ও মালিকানার হিস্যা বন্টন
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs mb-4">
              <div className="p-2.5 rounded bg-slate-50 border border-slate-100">
                <span className="text-slate-400 block text-[11px]">জেলা ও উপজেলা</span>
                <span className="font-semibold text-slate-800">{application.parcel?.district_bn}, {application.parcel?.upazila_bn}</span>
              </div>
              <div className="p-2.5 rounded bg-slate-50 border border-slate-100">
                <span className="text-slate-400 block text-[11px]">মৌজা ও জেএল</span>
                <span className="font-semibold text-slate-800">{application.parcel?.mouza_bn}, জেএল-{application.parcel?.jl_no}</span>
              </div>
              <div className="p-2.5 rounded bg-slate-50 border border-slate-100">
                <span className="text-slate-400 block text-[11px]">খতিয়ান নম্বর</span>
                <span className="font-mono font-bold text-slate-900">{application.parcel?.khatian_no}</span>
              </div>
              <div className="p-2.5 rounded bg-slate-50 border border-slate-100">
                <span className="text-slate-400 block text-[11px]">দাগ নম্বর</span>
                <span className="font-mono font-bold text-slate-900">{application.parcel?.dag_no}</span>
              </div>
            </div>

            <div className="p-3.5 rounded-lg bg-indigo-50/70 border border-indigo-200 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <span className="text-slate-500 block text-[11px]">দাগে মোট জমির পরিমাণ:</span>
                  <span className="font-bold text-slate-900">{application.parcel?.total_area_decimal || '৩৩.০০'} শতক</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">বিক্রেতার প্রাপ্ত হিস্যা:</span>
                  <span className="font-bold text-slate-900">{application.seller_owned_share || '০.২৫০০'} ({application.seller_owned_area_decimal || '৮.২৫'} শতক)</span>
                </div>
                <div>
                  <span className="text-indigo-900 block text-[11px] font-bold">প্রস্তাবিত বিক্রয় হিস্যা:</span>
                  <span className="font-bold text-indigo-800 text-sm">{application.proposed_share} ({application.proposed_area_decimal} শতক)</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (1 span): Procedural & Legal Decision */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-5">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-3 mb-4">
              <Scale size={16} className="text-indigo-700" />
              রাজস্ব আদালত ও আইনি কার্যবিবরণী
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">কার্যধারা:</span>
                <span className="font-bold text-slate-800">প্রাক-রেজিস্ট্রেশন ছাড়পত্র</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">বর্তমান পর্যায়:</span>
                <span className="font-bold text-slate-800"><StatusBadge status={application.stage} /></span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">আদালত:</span>
                <span className="font-semibold text-slate-800">গুলশান রাজস্ব সার্কেল, ঢাকা</span>
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
          </div>

          <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 text-xs text-slate-600">
            <h4 className="font-bold text-slate-800 flex items-center gap-1.5 mb-2">
              <FileCheck size={14} className="text-indigo-700" />
              এসি ল্যান্ডের কার্যপ্রণালী
            </h4>
            <p className="text-[11px] text-slate-600 leading-relaxed mb-2">
              ১. তহশিলদারের প্রতিবেদন ও সরেজমিন সীমানা পর্যবেক্ষণ যাচাই করুন।
            </p>
            <p className="text-[11px] text-slate-600 leading-relaxed mb-2">
              ২. আইনগত হিস্যা সঠিক থাকলে অনুমোদন দিন। অনুমোদনের সাথে সাথে নথিটি সাব-রেজিস্ট্রার কার্যালয়ের শিডিউলিং কিউতে চলে যাবে।
            </p>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              ৩. দলিল রেজিস্ট্রেশন সম্পন্ন হবার পর স্বয়ংক্রিয়ভাবে ই-নামজারি কেস এসি ল্যান্ড কোর্টে দাখিল হবে।
            </p>
          </div>
        </div>
      </div>

      {/* Review Action Modal */}
      {actionType && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 font-bengali">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                {actionType === 'approve' && <CheckCircle2 className="w-5 h-5 text-indigo-600" />}
                {actionType === 'return' && <RotateCcw className="w-5 h-5 text-amber-500" />}
                {actionType === 'reject' && <XCircle className="w-5 h-5 text-rose-600" />}
                {actionType === 'approve' && 'প্রাক-রেজিস্ট্রি অনুমোদন ও সাব-রেজিস্ট্রিতে প্রেরণ'}
                {actionType === 'return' && 'আবেদন সংশোধনের জন্য ফেরত প্রেরণ'}
                {actionType === 'reject' && 'আবেদন সরাসরি খারিজ ও বাতিলকরণ'}
              </h3>
              <button
                onClick={() => setActionType(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleReviewSubmit} className="space-y-4 text-xs">
              <div className="space-y-2">
                <label className="font-bold text-slate-700 block">
                  {actionType === 'approve' ? 'অনুমোদন আদেশ ও নির্দেশনামা (Order Notes)' : 'সংশোধন বা বাতিলের সুস্পষ্ট আইনি কারণ *'}
                </label>
                <textarea
                  rows={4}
                  value={reasonBn}
                  onChange={(e) => setReasonBn(e.target.value)}
                  placeholder={
                    actionType === 'approve'
                      ? 'ইউনিয়ন রিপোর্ট ও রেকর্ড পর্যালোচনায় বিক্রেতার স্বত্ব সঠিক পাওয়া গেল। সাব-রেজিস্ট্রি অফিসে হস্তান্তরের অনুমোদন দেয়া হলো।'
                      : actionType === 'return'
                      ? 'বিক্রেতার খতিয়ানের মোট হিস্যা সংশোধনপূর্বক পুনঃদাখিলের নির্দেশ দেয়া হলো।'
                      : 'খতিয়ানে বিক্রেতার কোন হস্তান্তরযোগ্য অবশিষ্ট অংশ না থাকায় আবেদনটি খারিজ করা হলো।'
                  }
                  className="w-full p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs"
                  required={actionType !== 'approve'}
                />
              </div>

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
                      ? 'bg-indigo-700 hover:bg-indigo-800'
                      : actionType === 'return'
                      ? 'bg-amber-600 hover:bg-amber-700'
                      : 'bg-rose-600 hover:bg-rose-700'
                  }`}
                >
                  {submitting ? (
                    <>
                      <Clock size={14} className="animate-spin" />
                      আদেশ জারি হচ্ছে...
                    </>
                  ) : (
                    <>
                      {actionType === 'approve' && 'অনুমোদন ও সাব-রেজিস্ট্রিতে প্রেরণ'}
                      {actionType === 'return' && 'নাগরিককে ফেরত পাঠান'}
                      {actionType === 'reject' && 'খারিজ নিশ্চিত করুন'}
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
