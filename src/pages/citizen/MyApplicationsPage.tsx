import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import { SaleApplication } from '../../types';
import { 
  Clock, 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Calendar, 
  MapPin, 
  Send, 
  ArrowRight,
  RefreshCw,
  Sparkles
} from 'lucide-react';
import { StatusBadge } from '../../components/common/StatusBadge';
import { DeedDraftModal } from '../../components/common/DeedDraftModal';
import { useLanguage } from '../../context/LanguageContext';
import {
  formatName,
  formatMouza,
  formatPlot,
  formatArea,
  formatDigits,
} from '../../utils/bilingual';

export const MyApplicationsPage: React.FC = () => {
  const { language } = useLanguage();
  const isBn = language === 'bn';
  const [applications, setApplications] = useState<SaleApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAppForDeed, setSelectedAppForDeed] = useState<SaleApplication | null>(null);

  // Resubmit modal
  const [resubmitApp, setResubmitApp] = useState<SaleApplication | null>(null);
  const [correctionNotes, setCorrectionNotes] = useState('');
  const [resubmitting, setResubmitting] = useState(false);
  const [actionMessage, setActionMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const fetchApps = async () => {
    setLoading(true);
    const res = await api.getMyApplications();
    if (res.success && res.data) {
      setApplications(res.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchApps();
  }, []);

  const handleResubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resubmitApp) return;

    setResubmitting(true);
    setActionMessage(null);

    try {
      const res = await api.sales.resubmit(resubmitApp.id, {
        correction_notes_bn: correctionNotes,
      });

      if (res.success) {
        setActionMessage({ text: 'আবেদনটি সফলভাবে পুনরায় জমা হয়েছে। এটি এখন ইউনিয়ন অফিসে পর্যালোচিত হবে।', type: 'success' });
        setResubmitApp(null);
        setCorrectionNotes('');
        fetchApps();
      } else {
        setActionMessage({ text: res.message_bn || 'পুনরায় দাখিলে সমস্যা হয়েছে', type: 'error' });
      }
    } catch (err: any) {
      setActionMessage({ text: err.message || 'নেটওয়ার্ক ত্রুটি', type: 'error' });
    } finally {
      setResubmitting(false);
    }
  };

  // Helper to determine step status
  const getStepState = (app: SaleApplication, stepNumber: number): 'completed' | 'current' | 'upcoming' | 'rejected' => {
    const s = app.stage;
    const isRejected = s.includes('REJECTED') || app.status === 'rejected';

    if (isRejected) {
      if (stepNumber === 1) return 'completed';
      return 'rejected';
    }

    if (s === 'RETURNED_FOR_CORRECTION' || s === 'RETURNED_FOR_INFORMATION') {
      if (stepNumber === 1) return 'completed';
      if (stepNumber === 2) return 'current'; // Returned at review
      return 'upcoming';
    }

    switch (stepNumber) {
      case 1: // আবেদন জমা
        return 'completed';
      case 2: // ইউনিয়ন যাচাই
        if (s === 'UNION_REVIEW_PENDING' || s === 'UNDER_REVIEW' || s === 'UNION_REPORT_PENDING') return 'current';
        return 'completed';
      case 3: // এসি ল্যান্ড প্রাক-পর্যালোচনা
        if (s === 'UNION_REVIEW_PENDING' || s === 'UNDER_REVIEW' || s === 'UNION_REPORT_PENDING') return 'upcoming';
        if (s === 'AC_LAND_REVIEW_PENDING' || s === 'UNION_APPROVED') return 'current';
        return 'completed';
      case 4: // রেজিস্ট্রেশনের জন্য প্রস্তুত
        if (['UNION_REVIEW_PENDING', 'UNDER_REVIEW', 'UNION_REPORT_PENDING', 'AC_LAND_REVIEW_PENDING'].includes(s)) return 'upcoming';
        if (s === 'REGISTRATION_READY') return 'current';
        return 'completed';
      case 5: // অ্যাপয়েন্টমেন্ট নির্ধারিত
        if (['UNION_REVIEW_PENDING', 'UNDER_REVIEW', 'UNION_REPORT_PENDING', 'AC_LAND_REVIEW_PENDING', 'REGISTRATION_READY'].includes(s)) return 'upcoming';
        if (s === 'APPOINTMENT_SCHEDULED' || s === 'REGISTRATION_SCHEDULED') return 'current';
        return 'completed';
      case 6: // রেজিস্ট্রেশন সম্পন্ন
        if (['REGISTRATION_COMPLETED', 'MUTATION_PENDING', 'MUTATION_SUBMITTED', 'HEARING_SCHEDULED', 'MUTATION_APPROVED'].includes(s)) return 'completed';
        return 'upcoming';
      case 7: // নামজারি পর্যালোচনা
        if (['MUTATION_PENDING', 'MUTATION_SUBMITTED', 'HEARING_SCHEDULED'].includes(s)) return 'current';
        if (s === 'MUTATION_APPROVED') return 'completed';
        return 'upcoming';
      case 8: // নামজারি অনুমোদন
        if (s === 'MUTATION_APPROVED') return 'completed';
        return 'upcoming';
      default:
        return 'upcoming';
    }
  };

  return (
    <div className={`space-y-6 ${isBn ? 'font-bengali' : 'font-sans'}`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Clock className="text-gov-blue" size={24} />
            {isBn ? 'আমার আবেদনসমূহ ও পূর্ণাঙ্গ ট্র্যাকিং' : 'My Applications & End-to-End Tracking'}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {isBn
              ? 'নাগরিক বিক্রয় আবেদন, ইউনিয়ন ভূমি অফিস, এসি ল্যান্ড কোর্ট, সাব-রেজিস্ট্রি অ্যাপয়েন্টমেন্ট ও নামজারি স্থিতি'
              : 'Citizen sale applications, Union Land Office, AC Land Court, Sub-Registry appointment & Mutation status'}
          </p>
        </div>

        <Link
          to="/citizen/sell"
          className="bg-gov-blue hover:bg-slate-900 text-white px-4 py-2 rounded-lg text-xs font-semibold shadow-sm transition inline-flex items-center gap-1.5"
        >
          <span>{isBn ? 'নতুন বিক্রয় আবেদন দাখিল' : 'Submit New Sale Application'}</span>
        </Link>
      </div>

      {actionMessage && (
        <div className={`p-4 rounded-xl border text-xs font-semibold flex items-center justify-between ${
          actionMessage.type === 'success' ? 'bg-emerald-50 text-emerald-800 border-emerald-300' : 'bg-red-50 text-red-800 border-red-300'
        }`}>
          <span>{actionMessage.text}</span>
          <button onClick={() => setActionMessage(null)} className="text-slate-500 hover:text-slate-800">✕</button>
        </div>
      )}

      {loading ? (
        <div className="bg-white dark:bg-slate-900 rounded-xl p-12 text-center border border-slate-200 dark:border-slate-800">
          <div className="inline-block animate-spin w-8 h-8 border-4 border-gov-blue border-t-transparent rounded-full mb-3"></div>
          <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            {isBn ? 'আবেদনের তথ্য লোড হচ্ছে...' : 'Loading application details...'}
          </p>
        </div>
      ) : applications.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-xl p-12 text-center border border-slate-200 dark:border-slate-800 space-y-3">
          <Clock size={32} className="text-slate-300 mx-auto" />
          <h3 className="font-bold text-slate-800 dark:text-white text-base">
            {isBn ? 'কোনো আবেদন পাওয়া যায়নি' : 'No applications found'}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
            {isBn ? 'আপনি এখনও কোনো জমি বিক্রির আবেদন দাখিল করেননি।' : 'You have not submitted any land sale applications yet.'}
          </p>
          <Link
            to="/citizen/sell"
            className="inline-block bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg text-xs font-semibold mt-2"
          >
            {isBn ? 'প্রথম আবেদন করুন' : 'Submit First Application'}
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {applications.map((app) => (
            <div
              key={app.id}
              className="bg-white dark:bg-slate-900 rounded-xl shadow-gov-sm border border-slate-200 dark:border-slate-800 p-6 space-y-5 hover:border-gov-blue/50 transition"
            >
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-base font-bold text-slate-900 dark:text-white font-mono">
                      {isBn ? 'আবেদন নং:' : 'Application No:'} {app.application_no}
                    </span>
                    <StatusBadge stage={app.stage} />
                  </div>
                  <span className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 block">
                    {isBn ? 'দাখিলের সময়:' : 'Submission Date:'} {new Date(app.created_at).toLocaleString(isBn ? 'bn-BD' : 'en-US')}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-2 whitespace-nowrap">
                  <button
                    onClick={() => setSelectedAppForDeed(app)}
                    className="inline-flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 px-3 py-1.5 rounded-lg text-xs font-semibold transition border border-slate-300 dark:border-slate-700 whitespace-nowrap shrink-0"
                  >
                    <FileText size={14} className="shrink-0" />
                    <span>{isBn ? 'খসড়া দলিল প্রিভিউ' : 'Deed Draft Preview'}</span>
                  </button>

                  {(app.stage === 'RETURNED_FOR_CORRECTION' || app.stage === 'RETURNED_FOR_INFORMATION') && (
                    <button
                      onClick={() => setResubmitApp(app)}
                      className="inline-flex items-center gap-1.5 bg-amber-600 hover:bg-amber-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition shadow-sm whitespace-nowrap shrink-0"
                    >
                      <RefreshCw size={14} className="shrink-0" />
                      <span>{isBn ? 'সংশোধন জমা দিন' : 'Submit Correction'}</span>
                    </button>
                  )}

                  {(app.stage === 'APPOINTMENT_SCHEDULED' || app.stage === 'REGISTRATION_SCHEDULED') && (
                    <Link
                      to="/citizen/registration-checklist"
                      className="inline-flex items-center gap-1.5 bg-purple-600 hover:bg-purple-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition shadow-sm whitespace-nowrap shrink-0"
                    >
                      <Calendar size={14} className="shrink-0" />
                      <span>{isBn ? 'অ্যাপয়েন্টমেন্ট ও স্লট' : 'Appointment & Slot'}</span>
                    </Link>
                  )}

                  {(app.stage === 'REGISTRATION_COMPLETED' || app.mutation_created) && (
                    <Link
                      to="/citizen/mutation"
                      className="inline-flex items-center gap-1.5 bg-teal-600 hover:bg-teal-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition shadow-sm whitespace-nowrap shrink-0"
                    >
                      <Sparkles size={14} className="shrink-0" />
                      <span>{isBn ? 'নামজারি ট্র্যাক' : 'Track Mutation'}</span>
                    </Link>
                  )}
                </div>
              </div>

              {/* Application Details Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs bg-slate-50 dark:bg-slate-800/60 p-4 rounded-lg border border-slate-100 dark:border-slate-800">
                <div>
                  <span className="text-slate-500 dark:text-slate-400 block mb-0.5">
                    {isBn ? 'মৌজা ও দাগ নং:' : 'Mouza & Plot No:'}
                  </span>
                  <strong className="text-slate-900 dark:text-white font-semibold">
                    {formatPlot(app.parcel?.dag_no, isBn)} ({formatMouza(app.parcel, isBn)})
                  </strong>
                </div>

                <div>
                  <span className="text-slate-500 dark:text-slate-400 block mb-0.5">
                    {isBn ? 'বিক্রিত জমির পরিমাণ:' : 'Transferred Area:'}
                  </span>
                  <strong className="text-gov-blue font-bold font-mono">
                    {formatArea(app.proposed_area_decimal, isBn)} ({isBn ? 'হিস্যা:' : 'Share:'} {formatDigits(app.proposed_share, isBn)})
                  </strong>
                </div>

                <div>
                  <span className="text-slate-500 dark:text-slate-400 block mb-0.5">
                    {isBn ? 'ধার্যকৃত মূল্য:' : 'Agreed Price:'}
                  </span>
                  <strong className="text-slate-900 dark:text-white font-mono font-bold">
                    ৳ {isBn ? app.agreed_price_bdt?.toLocaleString('bn-BD') : app.agreed_price_bdt?.toLocaleString('en-US')}
                  </strong>
                </div>

                <div>
                  <span className="text-slate-500 dark:text-slate-400 block mb-0.5">
                    {isBn ? 'ক্রেতার সিটিজেন আইডি:' : 'Buyer & Citizen ID:'}
                  </span>
                  <strong className="text-teal-700 dark:text-teal-400 font-semibold block">
                    {formatName(app.buyer, isBn)}
                  </strong>
                  <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                    {app.buyer_citizen_id || 'BHM-CIT-419203'}
                  </span>
                </div>
              </div>

              {/* Return / Correction Notice (when returned) */}
              {(app.stage === 'RETURNED_FOR_CORRECTION' || app.stage === 'RETURNED_FOR_INFORMATION') && app.return_reason_bn && (
                <div className="p-4 bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 border border-amber-300 dark:border-amber-800 rounded-xl text-xs flex items-start gap-3 shadow-xs">
                  <AlertTriangle size={18} className="text-amber-600 shrink-0 mt-0.5" />
                  <div className="flex-1 space-y-1">
                    <strong className="block font-bold text-amber-950 dark:text-amber-100">
                      {isBn ? 'সংশোধন নোটিশ (কর্মকর্তার পর্যবেক্ষণ):' : 'Correction Notice (Officer Review):'}
                    </strong>
                    <p className="leading-relaxed">{isBn ? app.return_reason_bn : (app.return_reason_en || app.return_reason_bn)}</p>
                    <div className="pt-2">
                      <button
                        onClick={() => setResubmitApp(app)}
                        className="bg-amber-600 hover:bg-amber-700 text-white px-3 py-1.5 rounded-md text-xs font-bold inline-flex items-center gap-1.5 shadow-2xs"
                      >
                        <RefreshCw size={13} />
                        <span>{isBn ? 'সংশোধিত তথ্য দিয়ে পুনরায় দাখিল করুন' : 'Resubmit with Corrected Details'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Rejection Notice */}
              {(app.stage.includes('REJECTED') || app.status === 'rejected') && app.rejection_reason_bn && (
                <div className="p-4 bg-red-50 dark:bg-red-950/40 text-red-900 dark:text-red-200 border border-red-300 dark:border-red-800 rounded-xl text-xs flex items-start gap-3 shadow-xs">
                  <XCircle size={18} className="text-red-600 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <strong className="block font-bold text-red-950 dark:text-red-100">
                      {isBn ? 'আবেদন বাতিলের কারণ:' : 'Application Rejection Reason:'}
                    </strong>
                    <p className="leading-relaxed mt-1">{isBn ? app.rejection_reason_bn : (app.rejection_reason_en || app.rejection_reason_bn)}</p>
                  </div>
                </div>
              )}

              {/* 8-Stage Visual Progress Timeline */}
              <div className="pt-2">
                <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-2.5">
                  {isBn ? '৮-ধাপের ডিজিটাল ভূমি সেবা টাইমলাইন:' : '8-Stage Digital Land Service Timeline:'}
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-2 text-center text-[10px]">
                  {[
                    { num: 1, title: isBn ? '১. আবেদন জমা' : '1. Submitted' },
                    { num: 2, title: isBn ? '২. ইউনিয়ন যাচাই' : '2. Union Review' },
                    { num: 3, title: isBn ? '৩. এসি ল্যান্ড প্রাক-রিভিউ' : '3. AC Land Audit' },
                    { num: 4, title: isBn ? '৪. রেজিস্ট্রি প্রস্তুতি' : '4. Registry Prep' },
                    { num: 5, title: isBn ? '৫. অ্যাপয়েন্টমেন্ট' : '5. Appointment' },
                    { num: 6, title: isBn ? '৬. দলিল সম্পাদন' : '6. Execution' },
                    { num: 7, title: isBn ? '৭. নামজারি কোর্ট' : '7. Mutation Court' },
                    { num: 8, title: isBn ? '৮. নতুন খতিয়ান' : '8. New Khatian' },
                  ].map((step) => {
                    const st = getStepState(app, step.num);
                    let color = 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700';
                    if (st === 'completed') color = 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-700 text-emerald-800 dark:text-emerald-300 font-bold';
                    else if (st === 'current') color = 'bg-blue-50 dark:bg-blue-950/60 border-blue-400 dark:border-blue-600 text-blue-900 dark:text-blue-200 font-bold ring-2 ring-blue-300/50 animate-pulse';
                    else if (st === 'rejected') color = 'bg-red-50 dark:bg-red-950/60 border-red-300 dark:border-red-800 text-red-800 dark:text-red-300 font-medium opacity-60';

                    return (
                      <div key={step.num} className={`p-2 rounded-lg border transition-all ${color}`}>
                        <div className="flex items-center justify-center gap-1 mb-0.5">
                          {st === 'completed' && <CheckCircle2 size={12} className="text-emerald-600" />}
                          {st === 'current' && <Clock size={12} className="text-blue-600" />}
                          {st === 'rejected' && <XCircle size={12} className="text-red-500" />}
                          <span>{step.title}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Resubmit Modal */}
      {resubmitApp && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <RefreshCw className="text-amber-600" size={20} />
                {isBn ? 'সংশোধিত আবেদন পুনরায় দাখিল' : 'Resubmit Corrected Application'}
              </h3>
              <button
                onClick={() => setResubmitApp(null)}
                className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700"
              >
                ✕
              </button>
            </div>

            <div className="p-3 bg-amber-50 dark:bg-amber-950/40 rounded-lg border border-amber-200 dark:border-amber-800 text-xs text-amber-900 dark:text-amber-200">
              <strong className="block mb-1 font-bold">
                {isBn ? 'কর্মকর্তার মন্তব্য:' : 'Officer Observation:'}
              </strong>
              <p>{isBn ? resubmitApp.return_reason_bn : (resubmitApp.return_reason_en || resubmitApp.return_reason_bn)}</p>
            </div>

            <form onSubmit={handleResubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {isBn ? 'সংশোধনী বিবরণ ও সংযুক্ত নথির বিবরণ লিখুন:' : 'Correction details & supporting documents note:'}
                </label>
                <textarea
                  required
                  rows={4}
                  value={correctionNotes}
                  onChange={(e) => setCorrectionNotes(e.target.value)}
                  placeholder={isBn ? 'যেমন: আর.এস পর্চার স্পষ্ট কপি সংযুক্ত করা হলো এবং খাজনা দাখিলা হালনাগাদ করা হলো...' : 'E.g., Clear RS khatian copy attached and tax dakhila updated...'}
                  className="w-full text-xs p-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setResubmitApp(null)}
                  className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  {isBn ? 'বাতিল' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  disabled={resubmitting || !correctionNotes.trim()}
                  className="px-5 py-2 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow transition flex items-center gap-1.5 disabled:opacity-50"
                >
                  <Send size={14} />
                  <span>{resubmitting ? (isBn ? 'দাখিল হচ্ছে...' : 'Submitting...') : (isBn ? 'পুনরায় জমা দিন' : 'Resubmit Now')}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Deed Draft Preview Modal */}
      {selectedAppForDeed && (
        <DeedDraftModal
          application={selectedAppForDeed}
          onClose={() => setSelectedAppForDeed(null)}
        />
      )}
    </div>
  );
};

export default MyApplicationsPage;
