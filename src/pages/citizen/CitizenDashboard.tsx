import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import {
  Landmark,
  ShieldCheck,
  FilePlus2,
  Receipt,
  GitBranch,
  Bell,
  Clock,
  ArrowRight,
  UserCheck,
  AlertTriangle,
  Building,
  CheckCircle2,
} from 'lucide-react';
import { StatusBadge } from '../../components/common/StatusBadge';

export const CitizenDashboard: React.FC = () => {
  const { user } = useAuth();
  const [holdings, setHoldings] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      setLoading(true);
      const [hRes, aRes] = await Promise.all([
        api.getMyHoldings(),
        api.getMyApplications(),
      ]);
      if (hRes.success && hRes.data) setHoldings(hRes.data);
      if (aRes.success && aRes.data) setApplications(aRes.data);
      setLoading(false);
    };
    loadDashboardData();
  }, []);

  const totalAreaDecimal = holdings.reduce(
    (sum, item) => sum + (item.ownership?.area_decimal || 0),
    0
  );

  const pendingApps = applications.filter(
    (a) => a.stage !== 'MUTATION_APPROVED' && a.stage !== 'REJECTED'
  );

  return (
    <div className="font-bengali space-y-6">
      {/* 1. Welcome & Citizen ID Header Card */}
      <div className="bg-gradient-to-r from-gov-navy to-slate-900 text-white rounded-2xl p-6 shadow-md border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs text-teal-400 font-semibold uppercase tracking-wider">
              স্বাগতম, নাগরিক
            </span>
            {user?.kyc_status === 'verified' && (
              <span className="inline-flex items-center gap-1 bg-teal-500/20 text-teal-300 text-[10px] font-bold px-2 py-0.5 rounded border border-teal-400/30">
                <CheckCircle2 size={11} />
                কেওয়াইসি ভেরিফায়েড
              </span>
            )}
          </div>
          <h1 className="text-xl sm:text-2xl font-bold">{user?.name_bn || 'সম্মানিত নাগরিক'}</h1>
          <p className="text-xs text-slate-300 mt-0.5">
            মোবাইল: {user?.mobile} | এনআইডি: {user?.nid_no}
          </p>
        </div>

        <div className="bg-slate-800/80 border border-slate-700 p-3.5 rounded-xl text-left md:text-right">
          <span className="text-[11px] text-slate-400 block font-medium">ইউনিক সিটিজেন আইডি</span>
          <span className="text-base sm:text-lg font-mono font-bold text-teal-400 block">
            {user?.citizen_id || 'কেওয়াইসি সম্পন্ন করুন'}
          </span>
          <Link
            to="/citizen/profile"
            className="text-[11px] text-teal-300 hover:underline inline-flex items-center gap-1 mt-1 font-semibold"
          >
            <span>প্রোফাইল বিবরণী</span>
            <ArrowRight size={12} />
          </Link>
        </div>
      </div>

      {/* 2. Key Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-gov-sm transition-colors">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold">মালিকানাধীন জমি</span>
            <Landmark size={18} className="text-gov-blue dark:text-teal-400" />
          </div>
          <p className="text-2xl font-extrabold text-slate-900 dark:text-white font-mono">
            {totalAreaDecimal.toFixed(2)} <span className="text-xs font-normal text-slate-500 dark:text-slate-400">শতক</span>
          </p>
          <span className="text-[11px] text-slate-500 dark:text-slate-400">{holdings.length}টি হোল্ডিং রেকর্ড</span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-gov-sm transition-colors">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold">চলমান আবেদনসমূহ</span>
            <Clock size={18} className="text-indigo-600 dark:text-indigo-400" />
          </div>
          <p className="text-2xl font-extrabold text-slate-900 dark:text-white font-mono">
            {pendingApps.length} <span className="text-xs font-normal text-slate-500 dark:text-slate-400">টি</span>
          </p>
          <span className="text-[11px] text-slate-500 dark:text-slate-400">পর্যালোচনা ও শুনানিকৃত</span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-gov-sm transition-colors">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold">ভূমি উন্নয়ন কর</span>
            <Receipt size={18} className="text-emerald-600 dark:text-emerald-400" />
          </div>
          <p className="text-xl font-bold text-emerald-800 dark:text-emerald-400">
            {holdings.some((h) => h.khajna?.status === 'dues_pending') ? 'বকেয়া আছে' : 'হালনাগাদ'}
          </p>
          <Link to="/citizen/tax" className="text-[11px] text-teal-700 dark:text-teal-300 hover:underline font-semibold">
            দাখিলা দেখুন →
          </Link>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-gov-sm transition-colors">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold">ই-নামজারি ট্র্যাকিং</span>
            <GitBranch size={18} className="text-teal-600 dark:text-teal-400" />
          </div>
          <p className="text-xl font-bold text-slate-900 dark:text-white">
            সক্রিয়
          </p>
          <Link to="/citizen/mutation" className="text-[11px] text-gov-blue dark:text-teal-300 hover:underline font-semibold">
            টাইমলাইন চেক করুন →
          </Link>
        </div>
      </div>

      {/* 3. Fast Action Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link
          to="/verify-land"
          className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-teal-200 dark:border-teal-900/60 shadow-gov-sm hover:border-teal-400 dark:hover:border-teal-500 hover:shadow-md transition group"
        >
          <div className="w-10 h-10 rounded-lg bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 flex items-center justify-center mb-3 group-hover:scale-105 transition">
            <ShieldCheck size={22} />
          </div>
          <h3 className="font-bold text-slate-900 dark:text-white text-sm mb-1">কেনার আগে জমি যাচাই (P5)</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            বায়নার পূর্বে বিক্রেতার সঠিক হিস্যা, বকেয়া খাজনা এবং ব্যাংক লিয়েন পরীক্ষা করুন।
          </p>
        </Link>

        <Link
          to="/citizen/sell"
          className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-indigo-200 dark:border-indigo-900/60 shadow-gov-sm hover:border-indigo-400 dark:hover:border-indigo-500 hover:shadow-md transition group"
        >
          <div className="w-10 h-10 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 flex items-center justify-center mb-3 group-hover:scale-105 transition">
            <FilePlus2 size={22} />
          </div>
          <h3 className="font-bold text-slate-900 dark:text-white text-sm mb-1">জমি বিক্রির আবেদন প্রণয়ন (P4)</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            মালিকানা হিস্যা নির্ধারণ করে ক্রেতার বরাবরে অনলাইন বিক্রয় আবেদন দাখিল করুন।
          </p>
        </Link>

        <Link
          to="/citizen/tax"
          className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-emerald-200 dark:border-emerald-900/60 shadow-gov-sm hover:border-emerald-400 dark:hover:border-emerald-500 hover:shadow-md transition group"
        >
          <div className="w-10 h-10 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 flex items-center justify-center mb-3 group-hover:scale-105 transition">
            <Receipt size={22} />
          </div>
          <h3 className="font-bold text-slate-900 dark:text-white text-sm mb-1">ভূমি উন্নয়ন কর ও দাখিলা</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            ১-ক্লিকে বকেয়া খাজনা পরিশোধ করুন ও বিক্রয় ছাড়পত্র সনদ সংগ্রহ করুন।
          </p>
        </Link>
      </div>

      {/* 4. My Holdings Table */}
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-gov-sm border border-slate-200 dark:border-slate-800 p-6 transition-colors">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Landmark size={18} className="text-gov-blue dark:text-teal-400" />
            <h3 className="font-bold text-slate-900 dark:text-white text-base">আমার জমির মালিকানা ও খতিয়ান</h3>
          </div>
          <Link to="/citizen/my-land" className="text-xs text-gov-blue dark:text-teal-300 font-bold hover:underline">
            সকল খতিয়ান দেখুন →
          </Link>
        </div>

        {loading ? (
          <p className="text-xs text-slate-500 dark:text-slate-400 py-4">তথ্য লোড হচ্ছে...</p>
        ) : holdings.length === 0 ? (
          <div className="text-center py-8 text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-dashed dark:border-slate-700">
            আপনার অ্যাকাউন্টে এখনও কোনো ভূমি রেকর্ড সংযুক্ত নেই।
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-b dark:border-slate-700 font-semibold">
                <tr>
                  <th className="py-2.5 px-3">দাগ ও মৌজা</th>
                  <th className="py-2.5 px-3">খতিয়ান রেফারেন্স</th>
                  <th className="py-2.5 px-3">জমির শ্রেণি</th>
                  <th className="py-2.5 px-3">আমার মালিকানা অংশ</th>
                  <th className="py-2.5 px-3">জমির পরিমাণ</th>
                  <th className="py-2.5 px-3">খাজনা স্থিতি</th>
                  <th className="py-2.5 px-3 text-right">কার্যক্রম</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {holdings.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="py-3 px-3 font-semibold text-slate-900 dark:text-white">
                      দাগ নং {item.parcel?.dag_no} ({item.parcel?.mouza})
                    </td>
                    <td className="py-3 px-3 text-slate-600 dark:text-slate-400">
                      {item.ownership?.khatian_ref || item.parcel?.khatian_no} ({item.parcel?.khatian_type})
                    </td>
                    <td className="py-3 px-3 text-slate-700 dark:text-slate-300">{item.parcel?.land_class}</td>
                    <td className="py-3 px-3 font-mono font-bold text-slate-800 dark:text-slate-200">
                      {(item.ownership?.share_portion * 100).toFixed(1)}% ({item.ownership?.share_portion})
                    </td>
                    <td className="py-3 px-3 font-bold text-gov-blue dark:text-teal-400">
                      {item.ownership?.area_decimal} শতক
                    </td>
                    <td className="py-3 px-3">
                      <StatusBadge status={item.khajna?.status || 'cleared'} />
                    </td>
                    <td className="py-3 px-3 text-right space-x-2">
                      <Link
                        to={`/citizen/land-details/${item.parcel?.id}`}
                        className="text-xs text-gov-blue dark:text-teal-300 hover:underline font-semibold"
                      >
                        বিস্তারিত
                      </Link>
                      <Link
                        to={`/citizen/sell?parcel_id=${item.parcel?.id}`}
                        className="text-xs bg-slate-800 dark:bg-slate-700 text-white px-2.5 py-1 rounded hover:bg-slate-950 dark:hover:bg-slate-600 font-medium"
                      >
                        বিক্রি করুন
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 5. Active Applications Tracker */}
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-gov-sm border border-slate-200 dark:border-slate-800 p-6 transition-colors">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Clock size={18} className="text-gov-blue dark:text-teal-400" />
            <h3 className="font-bold text-slate-900 dark:text-white text-base">আমার সক্রিয় আবেদনসমূহ</h3>
          </div>
          <Link to="/citizen/applications" className="text-xs text-gov-blue dark:text-teal-300 font-bold hover:underline">
            সকল আবেদন দেখুন →
          </Link>
        </div>

        {applications.length === 0 ? (
          <p className="text-xs text-slate-500 dark:text-slate-400 py-4 text-center bg-slate-50 dark:bg-slate-800/50 rounded-lg">
            কোনো চলমান আবেদন নেই।
          </p>
        ) : (
          <div className="space-y-3">
            {applications.map((app) => (
              <div
                key={app.id}
                className="p-4 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-slate-900 dark:text-white text-sm font-mono">
                      আবেদন নং: {app.application_no}
                    </span>
                    <StatusBadge stage={app.stage} />
                  </div>
                  <p className="text-slate-600 dark:text-slate-300">
                    দাগ নং {app.parcel?.dag_no} ({app.parcel?.mouza}) | বিক্রিত জমি: <strong>{app.proposed_area_decimal} শতক</strong> | পণমূল্য: ৳ {app.agreed_price_bdt.toLocaleString('bn-BD')}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Link
                    to="/citizen/applications"
                    className="bg-gov-blue dark:bg-teal-600 text-white px-3 py-1.5 rounded text-xs font-semibold hover:bg-slate-900 dark:hover:bg-teal-500 transition"
                  >
                    ট্র্যাকিং দেখুন
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
