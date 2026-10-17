import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { SaleApplication } from '../../types';
import { StatusBadge } from '../../components/common/StatusBadge';
import { 
  Building2, 
  Search, 
  FileCheck2, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Calendar, 
  MapPin, 
  ShieldCheck,
  ChevronRight,
  Send
} from 'lucide-react';

export default function UnionLandPage() {
  const { user } = useAuth();
  const [applications, setApplications] = useState<SaleApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState<SaleApplication | null>(null);

  // Form states for submitting investigation report
  const [fieldVerified, setFieldVerified] = useState(true);
  const [possessionClear, setPossessionClear] = useState(true);
  const [recommendation, setRecommendation] = useState('সরেজমিনে তদন্তে আবেদনকারী ও বিক্রেতার দখল সঠিক পাওয়া গেছে। দাগ ও সীমানা সংক্রান্ত কোনো আপত্তি নেই।');
  const [remarks, setRemarks] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await api.officer.unionQueue();
      if (res.data) {
        setApplications(res.data);
        if (res.data.length > 0 && !selectedApp) {
          setSelectedApp(res.data[0]);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSubmitReport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedApp) return;

    setSubmitting(true);
    setMessage(null);

    try {
      const fullRecommendation = `${recommendation}. দখল যাচাই: ${possessionClear ? 'সঠিক' : 'সন্দেহজনক'}, রেকর্ড যাচাই: ${fieldVerified ? 'ত্রুটিমুক্ত' : 'ত্রুটিযুক্ত'}। ${remarks}`;
      const res = await api.sales.submitUnionReport(selectedApp.id, fullRecommendation);
      if (res.error) {
        setMessage({ text: res.error, type: 'error' });
      } else {
        setMessage({ text: 'সরেজমিন তদন্ত প্রতিবেদন সফলভাবে এসি ল্যান্ড কার্যালয়ে প্রেরিত হয়েছে!', type: 'success' });
        loadData();
        setSelectedApp(null);
      }
    } catch (err) {
      setMessage({ text: 'প্রতিবেদন জমা দিতে সমস্যা হয়েছে', type: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="p-1.5 bg-emerald-50 text-emerald-700 rounded-md">
                <Building2 className="w-5 h-5" />
              </span>
              <h1 className="text-2xl font-bold text-slate-900">ইউনিয়ন ভূমি সহকারী কর্মকর্তার প্যানেল (ULAO)</h1>
            </div>
            <p className="text-sm text-slate-500">
              সরেজমিন দখল, সীমানা যাচাই, বকেয়া খাজনা রেকর্ড এবং প্রস্তাবিত হস্তান্তরের তদন্ত প্রতিবেদন তৈরি ও প্রেরণ।
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full">
              অপেক্ষমাণ তদন্ত: {applications.length} টি
            </span>
          </div>
        </div>
      </div>

      {message && (
        <div className={`p-4 rounded-xl text-xs font-medium flex items-center gap-2 ${
          message.type === 'success' ? 'bg-emerald-50 border border-emerald-200 text-emerald-800' : 'bg-red-50 border border-red-200 text-red-800'
        }`}>
          {message.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
          {message.text}
        </div>
      )}

      {loading ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center text-slate-400">
          তদন্ত তালিকা লোড হচ্ছে...
        </div>
      ) : applications.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
          <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-800 mb-1">কোনো তদন্ত অপেক্ষমাণ নেই</h3>
          <p className="text-xs text-slate-500">ইউনিয়ন ভূমি অফিসে বর্তমানে কোনো অমীমাংসিত সরেজমিন তদন্ত বা দাখিলা রিপোর্ট বাকি নেই।</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Applications list */}
          <div className="lg:col-span-1 space-y-3">
            <h2 className="text-xs font-bold text-slate-700 uppercase tracking-wider px-1">
              তদন্তের জন্য নির্ধারিত আবেদনসমূহ ({applications.length})
            </h2>
            {applications.map((app) => {
              const isSelected = selectedApp?.id === app.id;
              const appNo = app.application_no || app.applicationNumber || app.id;
              const khatian = app.parcel?.khatian_no || app.khatianNo || '১২০৪';
              const dag = app.parcel?.dag_no || app.dagNo || '৪০৫';
              const sellerId = app.seller?.citizen_id || app.sellerCitizenId || app.seller_id;
              const share = app.proposed_share || app.proposedShare || 0;

              return (
                <div
                  key={app.id}
                  onClick={() => setSelectedApp(app)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-slate-900 dark:bg-[#0c1427] text-white border-emerald-500 ring-1 ring-emerald-400/40 shadow-md'
                      : 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50/60 dark:hover:bg-slate-800/40'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                      isSelected ? 'bg-slate-800 dark:bg-slate-800 text-emerald-400 border border-emerald-500/30' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                    }`}>
                      {appNo}
                    </span>
                    <StatusBadge stage={app.stage} status={app.status} />
                  </div>
                  <div className="text-sm font-semibold mb-1">
                    খতিয়ান #{khatian} • দাগ #{dag}
                  </div>
                  <div className={`text-xs flex items-center justify-between ${isSelected ? 'text-slate-300' : 'text-slate-500 dark:text-slate-400'}`}>
                    <span>বিক্রেতা: {sellerId}</span>
                    <span className="font-bold">{share}% অংশ</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Form and inspection docket */}
          {selectedApp && (
            <div className="lg:col-span-2 space-y-6">
              {/* Parcel & Application Summary */}
              <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                <h3 className="text-base font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100 flex items-center justify-between">
                  <span>তদন্ত কেস ডকেট: {selectedApp.application_no || selectedApp.applicationNumber || selectedApp.id}</span>
                  <StatusBadge stage={selectedApp.stage} status={selectedApp.status} />
                </h3>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs mb-4">
                  <div>
                    <span className="text-slate-500 block">আবেদনকারী বিক্রেতা:</span>
                    <span className="font-semibold text-slate-800 font-mono">
                      {selectedApp.seller?.citizen_id || selectedApp.sellerCitizenId || selectedApp.seller_id}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">প্রস্তাবিত ক্রেতা:</span>
                    <span className="font-semibold text-slate-800 font-mono">
                      {selectedApp.buyer_citizen_id || selectedApp.buyerCitizenId || selectedApp.buyer_id}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">জমির পরিমাণ ও অংশ:</span>
                    <span className="font-semibold text-slate-800">
                      {selectedApp.proposed_area_decimal || selectedApp.proposedArea} শতক ({selectedApp.proposed_share || selectedApp.proposedShare}%)
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">খতিয়ান ও দাগ নম্বর:</span>
                    <span className="font-semibold text-slate-800">
                      খতিয়ান {selectedApp.parcel?.khatian_no || selectedApp.khatianNo}, দাগ {selectedApp.parcel?.dag_no || selectedApp.dagNo}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">খাজনা ছাড়পত্র স্ট্যাটাস:</span>
                    <span className="font-semibold text-emerald-700 font-mono">
                      {selectedApp.tax_cleared ? 'পরিশোধিত (ছাড়পত্র সংযুক্ত)' : 'বকেয়া'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">লেনদেন মূল্য:</span>
                    <span className="font-semibold text-slate-800">
                      ৳ {(selectedApp.agreed_price_bdt || selectedApp.agreedPrice || 0).toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs">
                  <div className="font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    স্বয়ংক্রিয় সিস্টেম প্রাথমিক যাচাই সম্পন্ন:
                  </div>
                  <p className="text-slate-600">
                    কেন্দ্রীয় প্রশাসন ও ঝুঁকি মূল্যায়ন ইঞ্জিন কর্তৃক প্রাথমিক দলিল পরীক্ষা অনুমোদিত হয়েছে। এখন সরেজমিন সীমানা ও দখল নিশ্চিতকরণ প্রয়োজন।
                  </p>
                </div>
              </div>

              {/* Investigation Report Submission Form */}
              <form onSubmit={handleSubmitReport} className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-5">
                <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                  <FileCheck2 className="w-5 h-5 text-emerald-600" />
                  <h3 className="text-base font-bold text-slate-900">
                    তহশিলদার সরেজমিন তদন্ত প্রতিবেদন (Field Verification Report)
                  </h3>
                </div>

                {/* Checklist toggles */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-slate-800 block">সরেজমিনে দখল যাচাই</span>
                      <span className="text-[11px] text-slate-500">বিক্রেতা বর্তমানে দখলে আছেন কিনা</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={possessionClear}
                      onChange={(e) => setPossessionClear(e.target.checked)}
                      className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500"
                    />
                  </div>

                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-slate-800 block">সীমানা ও খতিয়ান মিল</span>
                      <span className="text-[11px] text-slate-500">মৌজা নকশা অনুযায়ী দাগের মিল</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={fieldVerified}
                      onChange={(e) => setFieldVerified(e.target.checked)}
                      className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                {/* Recommendations */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    তদন্ত কর্মকর্তার সুপারিশ (Recommendation to AC Land)
                  </label>
                  <select
                    value={recommendation}
                    onChange={(e) => setRecommendation(e.target.value)}
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
                  >
                    <option value="সরেজমিনে তদন্তে আবেদনকারী ও বিক্রেতার দখল সঠিক পাওয়া গেছে। দাগ ও সীমানা সংক্রান্ত কোনো আপত্তি নেই।">
                      অনুমোদনযোগ্য: সরেজমিনে দখল ও দাগের সীমানা সঠিক পাওয়া গেছে
                    </option>
                    <option value="দখল সঠিক তবে অংশীদারদের সীমানা ভাগাভাগির মৌখিক সম্মতি নিশ্চিত করা প্রয়োজন।">
                      শর্তসাপেক্ষে: অংশীদারদের যৌথ দখল তবে সীমানা চিহ্নিত
                    </option>
                    <option value="সরেজমিনে দাগের সীমানায় বিরোধ দেখা গেছে, পক্ষগণের শুনানি গ্রহণ আবশ্যক।">
                      আপত্তিকর: সীমানা বিরোধ ও শুনানির সুপারিশ
                    </option>
                  </select>
                </div>

                {/* Detailed Remarks */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    অতিরিক্ত পর্যবেক্ষণ ও মন্তব্য
                  </label>
                  <textarea
                    rows={3}
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                    placeholder="মৌজা ম্যাপে দাগের অবস্থান, পার্শ্ববর্তী দাগের সীমানা বা স্থানীয় সাক্ষ্য..."
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                  ></textarea>
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold flex items-center gap-2 transition-colors disabled:opacity-50"
                  >
                    <Send className="w-4 h-4" />
                    {submitting ? 'প্রেরণ করা হচ্ছে...' : 'প্রতিবেদন প্রস্তুত ও এসি ল্যান্ডে প্রেরণ করুন'}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
