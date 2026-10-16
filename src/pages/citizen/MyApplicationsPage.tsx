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

export const MyApplicationsPage: React.FC = () => {
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
    <div className="font-bengali space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
            <Clock className="text-gov-blue" size={24} />
            আমার আবেদনসমূহ ও পূর্ণাঙ্গ ট্র্যাকিং
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            নাগরিক বিক্রয় আবেদন, ইউনিয়ন ভূমি অফিস, এসি ল্যান্ড কোর্ট, সাব-রেজিস্ট্রি অ্যাপয়েন্টমেন্ট ও নামজারি স্থিতি
          </p>
        </div>

        <Link
          to="/citizen/sell"
          className="bg-gov-blue hover:bg-slate-900 text-white px-4 py-2 rounded-lg text-xs font-semibold shadow-sm transition inline-flex items-center gap-1.5"
        >
          <span>নতুন বিক্রয় আবেদন দাখিল</span>
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
        <div className="bg-white rounded-xl p-12 text-center border">
          <div className="inline-block animate-spin w-8 h-8 border-4 border-gov-blue border-t-transparent rounded-full mb-3"></div>
          <p className="text-xs font-semibold text-slate-700">আবেদনের তথ্য লোড হচ্ছে...</p>
        </div>
      ) : applications.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center border space-y-3">
          <Clock size={32} className="text-slate-300 mx-auto" />
          <h3 className="font-bold text-slate-800 text-base">কোনো আবেদন পাওয়া যায়নি</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            আপনি এখনও কোনো জমি বিক্রির আবেদন দাখিল করেননি।
          </p>
          <Link
            to="/citizen/sell"
            className="inline-block bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg text-xs font-semibold mt-2"
          >
            প্রথম আবেদন করুন
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {applications.map((app) => (
            <div
              key={app.id}
              className="bg-white rounded-xl shadow-gov-sm border border-slate-200 p-6 space-y-5 hover:border-gov-blue/50 transition"
            >
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-base font-bold text-slate-900 font-mono">
                      আবেদন নং: {app.application_no}
                    </span>
                    <StatusBadge stage={app.stage} />
                  </div>
                  <span className="text-xs text-slate-500 mt-0.5 block">
                    দাখিলের সময়: {new Date(app.created_at).toLocaleString('bn-BD')}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => setSelectedAppForDeed(app)}
                    className="inline-flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 px-3 py-1.5 rounded-lg text-xs font-semibold transition border border-slate-300"
                  >
                    <FileText size={14} />
                    <span>খসড়া দলিল প্রিভিউ</span>
                  </button>

                  {(app.stage === 'RETURNED_FOR_CORRECTION' || app.stage === 'RETURNED_FOR_INFORMATION') && (
                    <button
                      onClick={() => setResubmitApp(app)}
                      className="inline-flex items-center gap-1.5 bg-amber-600 hover:bg-amber-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition shadow-sm"
                    >
                      <RefreshCw size={14} />
                      <span>সংশোধন জমা দিন</span>
                    </button>
                  )}

                  {(app.stage === 'APPOINTMENT_SCHEDULED' || app.stage === 'REGISTRATION_SCHEDULED') && (
                    <Link
                      to="/citizen/registration-checklist"
                      className="inline-flex items-center gap-1.5 bg-purple-600 hover:bg-purple-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition shadow-sm"
                    >
                      <Calendar size={14} />
                      <span>অ্যাপয়েন্টমেন্ট ও স্লট</span>
                    </Link>
                  )}

                  {(app.stage === 'REGISTRATION_COMPLETED' || app.mutation_created) && (
                    <Link
                      to="/citizen/mutation"
                      className="inline-flex items-center gap-1.5 bg-teal-600 hover:bg-teal-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition shadow-sm"
                    >
                      <Sparkles size={14} />
                      <span>নামজারি ট্র্যাক</span>
                    </Link>
                  )}
                </div>
              </div>

              {/* Application Details Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs bg-slate-50 p-4 rounded-lg border border-slate-100">
                <div>
                  <span className="text-slate-500 block mb-0.5">মৌজা ও দাগ নং:</span>
                  <strong className="text-slate-900 font-semibold">
                    দাগ {app.parcel?.dag_no || '৪১৫'} ({app.parcel?.mouza || 'বাড্ডা'})
                  </strong>
                </div>

                <div>
                  <span className="text-slate-500 block mb-0.5">বিক্রিত জমির পরিমাণ:</span>
                  <strong className="text-gov-blue font-bold font-mono">
                    {app.proposed_area_decimal} শতক (হিস্যা: {app.proposed_share})
                  </strong>
                </div>

                <div>
                  <span className="text-slate-500 block mb-0.5">ধার্যকৃত মূল্য:</span>
                  <strong className="text-slate-900 font-mono font-bold">
                    ৳ {app.agreed_price_bdt?.toLocaleString('bn-BD')}
                  </strong>
                </div>

                <div>
                  <span className="text-slate-500 block mb-0.5">ক্রেতার সিটিজেন আইডি:</span>
                  <strong className="text-teal-700 font-mono font-bold">
                    {app.buyer_citizen_id || 'BHM-CIT-419203'}
                  </strong>
                </div>
              </div>

              {/* Return / Correction Notice (when returned) */}
              {(app.stage === 'RETURNED_FOR_CORRECTION' || app.stage === 'RETURNED_FOR_INFORMATION') && app.return_reason_bn && (
                <div className="p-4 bg-amber-50 text-amber-900 border border-amber-300 rounded-xl text-xs flex items-start gap-3 shadow-xs">
                  <AlertTriangle size={18} className="text-amber-600 shrink-0 mt-0.5" />
                  <div className="flex-1 space-y-1">
                    <strong className="block font-bold text-amber-950">
                      সংশোধন নোটিশ (কর্মকর্তার পর্যবেক্ষণ):
                    </strong>
                    <p className="leading-relaxed">{app.return_reason_bn}</p>
                    <div className="pt-2">
                      <button
                        onClick={() => setResubmitApp(app)}
                        className="bg-amber-600 hover:bg-amber-700 text-white px-3 py-1.5 rounded-md text-xs font-bold inline-flex items-center gap-1.5 shadow-2xs"
                      >
                        <RefreshCw size={13} />
                        <span>সংশোধিত তথ্য দিয়ে পুনরায় দাখিল করুন</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Rejection Notice */}
              {(app.stage.includes('REJECTED') || app.status === 'rejected') && app.rejection_reason_bn && (
                <div className="p-4 bg-red-50 text-red-900 border border-red-300 rounded-xl text-xs flex items-start gap-3 shadow-xs">
                  <XCircle size={18} className="text-red-600 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <strong className="block font-bold text-red-950">
                      আবেদন বাতিলের কারণ:
                    </strong>
                    <p className="leading-relaxed mt-1">{app.rejection_reason_bn}</p>
                  </div>
                </div>
              )}

              {/* 8-Stage Visual Progress Timeline */}
              <div className="pt-2">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2.5">
                  ৮-ধাপের ডিজিটাল ভূমি সেবা টাইমলাইন:
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-2 text-center text-[10px]">
                  {[
                    { num: 1, title: '১. আবেদন জমা' },
                    { num: 2, title: '২. ইউনিয়ন যাচাই' },
                    { num: 3, title: '৩. এসি ল্যান্ড প্রাক-রিভিউ' },
                    { num: 4, title: '৪. রেজিস্ট্রি প্রস্তুতি' },
                    { num: 5, title: '৫. অ্যাপয়েন্টমেন্ট' },
                    { num: 6, title: '৬. দলিল সম্পাদন' },
                    { num: 7, title: '৭. নামজারি কোর্ট' },
                    { num: 8, title: '৮. নতুন খতিয়ান' },
                  ].map((step) => {
                    const st = getStepState(app, step.num);
                    let color = 'bg-slate-100 text-slate-500 border-slate-200';
                    if (st === 'completed') color = 'bg-emerald-50 border-emerald-300 text-emerald-800 font-bold';
                    else if (st === 'current') color = 'bg-blue-50 border-blue-400 text-blue-900 font-bold ring-2 ring-blue-300/50 animate-pulse';
                    else if (st === 'rejected') color = 'bg-red-50 border-red-300 text-red-800 font-medium opacity-60';

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
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <RefreshCw className="text-amber-600" size={20} />
                সংশোধিত আবেদন পুনরায় দাখিল
              </h3>
              <button
                onClick={() => setResubmitApp(null)}
                className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200"
              >
                ✕
              </button>
            </div>

            <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 text-xs text-amber-900">
              <strong className="block mb-1 font-bold">কর্মকর্তার মন্তব্য:</strong>
              <p>{resubmitApp.return_reason_bn}</p>
            </div>

            <form onSubmit={handleResubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  সংশোধনী বিবরণ ও সংযুক্ত নথির বিবরণ লিখুন:
                </label>
                <textarea
                  required
                  rows={4}
                  value={correctionNotes}
                  onChange={(e) => setCorrectionNotes(e.target.value)}
                  placeholder="যেমন: আর.এস পর্চার স্পষ্ট কপি সংযুক্ত করা হলো এবং খাজনা দাখিলা হালনাগাদ করা হলো..."
                  className="w-full text-xs p-3 rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2 border-t">
                <button
                  type="button"
                  onClick={() => setResubmitApp(null)}
                  className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  disabled={resubmitting || !correctionNotes.trim()}
                  className="px-5 py-2 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow transition flex items-center gap-1.5 disabled:opacity-50"
                >
                  <Send size={14} />
                  <span>{resubmitting ? 'দাখিল হচ্ছে...' : 'পুনরায় জমা দিন'}</span>
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
