import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import { SaleApplication } from '../../types';
import { Clock, Eye, FileText, CheckCircle2, AlertTriangle, ArrowRight, Printer } from 'lucide-react';
import { StatusBadge } from '../../components/common/StatusBadge';
import { DeedDraftModal } from '../../components/common/DeedDraftModal';

export const MyApplicationsPage: React.FC = () => {
  const [applications, setApplications] = useState<SaleApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAppForDeed, setSelectedAppForDeed] = useState<SaleApplication | null>(null);

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

  return (
    <div className="font-bengali space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
            <Clock className="text-gov-blue" size={24} />
            আমার আবেদনসমূহ ও ট্র্যাকিং (My Applications & Tracking)
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            বিক্রয় আবেদন, প্রশাসনিক পর্যালোচনা, সাব-রেজিস্ট্রি অগ্রগতি ও নামজারির বর্তমান স্থিতি
          </p>
        </div>

        <Link
          to="/citizen/sell"
          className="bg-gov-blue hover:bg-slate-900 text-white px-4 py-2 rounded-lg text-xs font-semibold shadow-sm transition inline-flex items-center gap-1.5"
        >
          <span>নতুন আবেদন দাখিল করুন</span>
        </Link>
      </div>

      {loading ? (
        <div className="bg-white rounded-xl p-12 text-center border">
          <div className="inline-block animate-spin w-8 h-8 border-4 border-gov-blue border-t-transparent rounded-full mb-3"></div>
          <p className="text-xs font-semibold text-slate-700">আবেদনের তালিকা লোড হচ্ছে...</p>
        </div>
      ) : applications.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center border space-y-3">
          <Clock size={32} className="text-slate-300 mx-auto" />
          <h3 className="font-bold text-slate-800 text-base">কোনো আবেদন পাওয়া যায়নি</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            আপনি এখনও কোনো জমি বিক্রির আবেদন দাখিল করেননি।
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {applications.map((app) => (
            <div
              key={app.id}
              className="bg-white rounded-xl shadow-gov-sm border border-slate-200 p-6 space-y-4 hover:border-gov-blue transition"
            >
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-base font-bold text-slate-900 font-mono">
                      আবেদন নং: {app.application_no}
                    </span>
                    <StatusBadge stage={app.stage} />
                  </div>
                  <span className="text-xs text-slate-500">
                    দাখিলের তারিখ: {new Date(app.created_at).toLocaleDateString('bn-BD')}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedAppForDeed(app)}
                    className="inline-flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 px-3 py-1.5 rounded text-xs font-semibold transition border border-slate-300"
                  >
                    <FileText size={14} />
                    <span>খসড়া দলিল প্রিভিউ</span>
                  </button>

                  <Link
                    to="/citizen/registration-checklist"
                    className="inline-flex items-center gap-1.5 bg-gov-blue hover:bg-slate-900 text-white px-3 py-1.5 rounded text-xs font-semibold transition"
                  >
                    <span>রেজিস্ট্রেশন স্লট</span>
                  </Link>
                </div>
              </div>

              {/* Application Details Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs bg-slate-50 p-4 rounded-lg border">
                <div>
                  <span className="text-slate-500 block mb-0.5">জমি ও দাগ নম্বর:</span>
                  <strong className="text-slate-900 font-semibold">
                    দাগ {app.parcel?.dag_no} ({app.parcel?.mouza})
                  </strong>
                </div>

                <div>
                  <span className="text-slate-500 block mb-0.5">বিক্রিত জমির পরিমাণ:</span>
                  <strong className="text-gov-blue font-bold font-mono">
                    {app.proposed_area_decimal} শতক (অংশ: {app.proposed_share})
                  </strong>
                </div>

                <div>
                  <span className="text-slate-500 block mb-0.5">নির্ধারিত বিক্রয়মূল্য:</span>
                  <strong className="text-slate-900 font-mono font-bold">
                    ৳ {app.agreed_price_bdt.toLocaleString('bn-BD')}
                  </strong>
                </div>

                <div>
                  <span className="text-slate-500 block mb-0.5">ক্রেতার সিটিজেন আইডি:</span>
                  <strong className="text-slate-800 font-mono">
                    {app.buyer_citizen_id}
                  </strong>
                </div>
              </div>

              {/* Return / Correction Notice (if applicable) */}
              {app.stage === 'RETURNED_FOR_INFORMATION' && app.return_reason_bn && (
                <div className="p-3 bg-amber-50 text-amber-900 border border-amber-300 rounded-lg text-xs flex items-start gap-2">
                  <AlertTriangle size={16} className="text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block font-bold">কর্মকর্তার মন্তব্য (সংশোধন প্রয়োজন):</strong>
                    <span>{app.return_reason_bn}</span>
                  </div>
                </div>
              )}

              {/* 5-Step Visual Status Tracker */}
              <div className="pt-2">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
                  অগ্রগতি টাইমলাইন:
                </span>
                <div className="grid grid-cols-5 gap-2 text-center text-[10px]">
                  <div className={`p-2 rounded border ${app.stage !== 'DRAFT' ? 'bg-emerald-50 border-emerald-300 text-emerald-800 font-bold' : 'bg-slate-100 text-slate-500'}`}>
                    ১. আবেদন দাখিল
                  </div>
                  <div className={`p-2 rounded border ${app.admin_reviewed ? 'bg-emerald-50 border-emerald-300 text-emerald-800 font-bold' : app.stage === 'UNDER_REVIEW' ? 'bg-blue-50 border-blue-300 text-blue-800 font-bold animate-pulse' : 'bg-slate-100 text-slate-500'}`}>
                    ২. প্রাথমিক অডিট
                  </div>
                  <div className={`p-2 rounded border ${app.union_verified ? 'bg-emerald-50 border-emerald-300 text-emerald-800 font-bold' : app.stage === 'UNION_REPORT_PENDING' ? 'bg-indigo-50 border-indigo-300 text-indigo-800 font-bold animate-pulse' : 'bg-slate-100 text-slate-500'}`}>
                    ৩. তহশিল তদন্ত
                  </div>
                  <div className={`p-2 rounded border ${app.registry_completed ? 'bg-emerald-50 border-emerald-300 text-emerald-800 font-bold' : app.stage === 'REGISTRATION_SCHEDULED' ? 'bg-purple-50 border-purple-300 text-purple-800 font-bold animate-pulse' : 'bg-slate-100 text-slate-500'}`}>
                    ৪. দলিল রেজিস্ট্রি
                  </div>
                  <div className={`p-2 rounded border ${app.stage === 'MUTATION_APPROVED' ? 'bg-emerald-100 border-emerald-400 text-emerald-900 font-bold' : app.mutation_created ? 'bg-cyan-50 border-cyan-300 text-cyan-800 font-bold animate-pulse' : 'bg-slate-100 text-slate-500'}`}>
                    ৫. ই-নামজারি
                  </div>
                </div>
              </div>
            </div>
          ))}
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
