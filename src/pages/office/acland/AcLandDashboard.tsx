import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../../services/api';
import { SaleApplication, MutationApplication } from '../../../types';
import { StatusBadge } from '../../../components/common/StatusBadge';
import {
  Landmark,
  ClipboardList,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  FileText,
  Clock,
  ArrowRight,
  Search,
  Eye,
  RefreshCw,
  Scale,
  CalendarCheck,
  Award
} from 'lucide-react';

export const AcLandDashboard: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'PRE_REG' | 'MUTATION'>('PRE_REG');
  const [searchQuery, setSearchQuery] = useState('');

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await api.officer.acLandQueue();
      if (res.success && res.stats) {
        setData(res);
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

  const stats = data?.stats || {
    awaiting_review_count: 0,
    returned_count: 0,
    approved_count: 0,
    rejected_count: 0,
    mutation_pending_count: 0,
    hearings_scheduled_count: 0,
    completed_count: 0,
  };

  const preRegApplications: SaleApplication[] = data?.all_applications || data?.queue || [];
  const mutationCases: MutationApplication[] = data?.mutation_cases || [];

  const filteredPreReg = preRegApplications.filter((app) => {
    const q = searchQuery.toLowerCase();
    return (
      (app.application_no || '').toLowerCase().includes(q) ||
      (app.seller?.name_bn || '').toLowerCase().includes(q) ||
      (app.buyer?.name_bn || '').toLowerCase().includes(q) ||
      (app.parcel?.khatian_no || '').toLowerCase().includes(q) ||
      (app.parcel?.dag_no || '').toLowerCase().includes(q)
    );
  });

  const filteredMutations = mutationCases.filter((mut) => {
    const q = searchQuery.toLowerCase();
    return (
      (mut.mutation_case_no || '').toLowerCase().includes(q) ||
      (mut.khatian_no || '').toLowerCase().includes(q) ||
      (mut.dag_no || '').toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6 font-bengali">
      {/* Overview Top Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs transition-colors">
          <div className="flex items-center justify-between text-indigo-700 dark:text-indigo-400 mb-2">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">প্রাক-পর্যালোচনা অপেক্ষমাণ</span>
            <ClipboardList size={18} />
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white font-mono">{stats.awaiting_review_count}</p>
          <span className="text-[10px] text-indigo-700 dark:text-indigo-400 font-medium">ইউনিয়ন হতে প্রেরিত</span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs transition-colors">
          <div className="flex items-center justify-between text-amber-600 dark:text-amber-400 mb-2">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">নামজারি নথি (অপেক্ষমাণ)</span>
            <Scale size={18} />
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white font-mono">{stats.mutation_pending_count}</p>
          <span className="text-[10px] text-amber-600 dark:text-amber-400 font-medium">রেজিস্ট্রি সম্পন্ন নালিশ</span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs transition-colors">
          <div className="flex items-center justify-between text-blue-600 dark:text-blue-400 mb-2">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">শুনানি নির্ধারিত</span>
            <CalendarCheck size={18} />
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white font-mono">{stats.hearings_scheduled_count}</p>
          <span className="text-[10px] text-blue-600 dark:text-blue-400 font-medium">উভয় পক্ষকে নোটিশ জারী</span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs transition-colors">
          <div className="flex items-center justify-between text-emerald-600 dark:text-emerald-400 mb-2">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">অনুমোদিত (প্রাক-রেজিস্ট্রি)</span>
            <CheckCircle2 size={18} />
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white font-mono">{stats.approved_count}</p>
          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">সাব-রেজিস্ট্রিতে অগ্রায়িত</span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs transition-colors">
          <div className="flex items-center justify-between text-purple-600 dark:text-purple-400 mb-2">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">নামজারি খতিয়ান সৃজিত</span>
            <Award size={18} />
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white font-mono">{stats.completed_count}</p>
          <span className="text-[10px] text-purple-600 dark:text-purple-400 font-medium">চূড়ান্ত স্বত্ব রেকর্ড হালনাগাদ</span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs transition-colors">
          <div className="flex items-center justify-between text-rose-600 dark:text-rose-400 mb-2">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">বাতিলকৃত কেস</span>
            <XCircle size={18} />
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white font-mono">{stats.rejected_count}</p>
          <span className="text-[10px] text-rose-600 dark:text-rose-400 font-medium">আইনি অসঙ্গতি ও আপত্তি</span>
        </div>
      </div>

      {/* Main Container */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs overflow-hidden transition-colors">
        {/* Navigation Tabs & Controls */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('PRE_REG')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition ${
                activeTab === 'PRE_REG'
                  ? 'bg-indigo-700 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              <ClipboardList size={15} />
              প্রাক-রেজিস্ট্রেশন যাচাই কিউ ({preRegApplications.length})
            </button>

            <button
              onClick={() => setActiveTab('MUTATION')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition ${
                activeTab === 'MUTATION'
                  ? 'bg-indigo-700 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              <Scale size={15} />
              পোস্ট-রেজিস্ট্রেশন ই-নামজারি নথি ({mutationCases.length})
            </button>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <Search size={15} className="absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="কেস নং, খতিয়ান, দাগ বা নাম..."
                className="pl-9 pr-3 py-1.5 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-lg text-xs w-60 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <button
              onClick={loadData}
              className="p-1.5 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
              title="রিফ্রেশ করুন"
            >
              <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
            </button>
          </div>
        </div>

        {/* Tab 1: Pre-Registration Applications */}
        {activeTab === 'PRE_REG' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-bold">
                  <th className="py-3 px-4">আবেদন ও দাখিল তারিখ</th>
                  <th className="py-3 px-4">পক্ষগণ (বিক্রেতা ও ক্রেতা)</th>
                  <th className="py-3 px-4">জমির তপশিল ও মৌজা</th>
                  <th className="py-3 px-4">হস্তান্তরিত হিস্যা / পরিমাণ</th>
                  <th className="py-3 px-4">ইউনিয়ন রিপোর্ট স্থিতি</th>
                  <th className="py-3 px-4">বর্তমান পর্যায়</th>
                  <th className="py-3 px-4 text-right">বিচারিক সিদ্ধান্ত</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-slate-500 dark:text-slate-400">
                      <Clock size={18} className="animate-spin inline-block mr-2" />
                      এসি ল্যান্ড নথি লোড হচ্ছে...
                    </td>
                  </tr>
                ) : filteredPreReg.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-slate-500 dark:text-slate-400">
                      কোন প্রাক-রেজিস্ট্রেশন নথি পাওয়া যায়নি।
                    </td>
                  </tr>
                ) : (
                  filteredPreReg.map((app) => (
                    <tr key={app.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/60 transition">
                      <td className="py-3 px-4">
                        <span className="font-mono font-bold text-slate-900 dark:text-white block">{app.application_no}</span>
                        <span className="text-[11px] text-slate-400">{app.submission_date || '২০২৬-০৩-১৫'}</span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="space-y-0.5">
                          <p><span className="text-slate-400">বি:</span> <span className="font-semibold text-slate-800 dark:text-slate-200">{app.seller?.name_bn}</span></p>
                          <p><span className="text-slate-400">ক্র:</span> <span className="font-semibold text-indigo-900 dark:text-indigo-400">{app.buyer?.name_bn}</span></p>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-slate-700 dark:text-slate-300">
                        <span className="font-medium">{app.parcel?.mouza_bn}</span>
                        <span className="block text-[11px] text-slate-400">খতিয়ান: {app.parcel?.khatian_no}, দাগ: {app.parcel?.dag_no}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-bold text-slate-900 dark:text-white block">{app.proposed_area_decimal} শতক</span>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400">হিস্যা: {app.proposed_share}</span>
                      </td>
                      <td className="py-3 px-4">
                        {app.union_report ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
                            <CheckCircle2 size={12} />
                            সরেজমিন অনুমোদিত
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded border border-amber-200 dark:border-amber-800">
                            <Clock size={12} />
                            প্রতিবেদন অপেক্ষমাণ
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <StatusBadge status={app.stage} />
                      </td>
                      <td className="py-3 px-4 text-right">
                        <Link
                          to={`/office/ac-land/applications/${app.id}`}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 font-bold rounded-lg transition"
                        >
                          <Eye size={13} />
                          পর্যালোচনা ও আদেশ
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab 2: Post-Registration Mutation Cases */}
        {activeTab === 'MUTATION' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-bold">
                  <th className="py-3 px-4">নামজারি মিস কেস নং</th>
                  <th className="py-3 px-4">রেজিস্ট্রিকৃত কবলা দলিল নং</th>
                  <th className="py-3 px-4">মৌজা, দাগ ও খতিয়ান</th>
                  <th className="py-3 px-4">নামজারিকৃত পরিমাণ</th>
                  <th className="py-3 px-4">শুনানি / বিচারিক অবস্থা</th>
                  <th className="py-3 px-4">স্থিতি</th>
                  <th className="py-3 px-4 text-right">আদালত কার্যক্রম</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredMutations.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-slate-500 dark:text-slate-400">
                      কোন নামজারি মিস কেস নথিভুক্ত নেই।
                    </td>
                  </tr>
                ) : (
                  filteredMutations.map((mut) => (
                    <tr key={mut.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/60 transition">
                      <td className="py-3 px-4 font-mono font-bold text-indigo-900 dark:text-indigo-300">
                        {mut.mutation_case_no || 'MUT-AC-2026-001'}
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-mono font-bold text-slate-800 dark:text-slate-200 block">
                          দলিল নং {mut.deed_no || '৩৪০৯/২০২৬'}
                        </span>
                        <span className="text-[11px] text-slate-400">সাব-রেজিস্ট্রি কার্যালয়</span>
                      </td>
                      <td className="py-3 px-4 text-slate-700 dark:text-slate-300">
                        <span>{mut.mouza_bn || 'সাঁতারকুল'}</span>
                        <span className="block text-[11px] text-slate-400">দাগ: {mut.dag_no}, বায়া খতিয়ান: {mut.khatian_no}</span>
                      </td>
                      <td className="py-3 px-4 font-semibold text-slate-800 dark:text-slate-200">
                        {mut.transferred_area_decimal || '৪.১২'} শতক
                      </td>
                      <td className="py-3 px-4">
                        {mut.hearing_date ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-800 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded border border-blue-200 dark:border-blue-800">
                            <CalendarCheck size={12} />
                            শুনানি: {mut.hearing_date}
                          </span>
                        ) : (
                          <span className="text-[11px] text-slate-500 dark:text-slate-400">তারিখ নির্ধারিত নয়</span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <StatusBadge status={mut.status} />
                      </td>
                      <td className="py-3 px-4 text-right">
                        <Link
                          to="/office/ac-land/mutation"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-700 hover:bg-indigo-800 text-white font-bold rounded-lg transition"
                        >
                          <Scale size={13} />
                          শুনানি ও রায়
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AcLandDashboard;
