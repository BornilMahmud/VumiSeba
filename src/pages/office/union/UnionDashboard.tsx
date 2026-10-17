import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../../services/api';
import { SaleApplication } from '../../../types';
import { StatusBadge } from '../../../components/common/StatusBadge';
import {
  Building2,
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
  Coins
} from 'lucide-react';

export const UnionDashboard: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await api.officer.unionQueue();
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
    new_applications_count: 0,
    pending_review_count: 0,
    returned_count: 0,
    approved_count: 0,
    rejected_count: 0,
    tax_issue_count: 0,
  };

  const applications: SaleApplication[] = data?.all_applications || data?.queue || [];

  const filteredApps = applications.filter((app) => {
    const matchesSearch =
      (app.application_no || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (app.seller?.name_bn || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (app.buyer?.name_bn || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (app.parcel?.dag_no || '').includes(searchQuery) ||
      (app.parcel?.mouza || '').includes(searchQuery);

    if (statusFilter === 'PENDING') {
      return matchesSearch && (app.stage === 'UNION_REVIEW_PENDING' || app.stage === 'UNDER_REVIEW' || app.stage === 'UNION_REPORT_PENDING');
    }
    if (statusFilter === 'RETURNED') {
      return matchesSearch && (app.stage === 'RETURNED_FOR_CORRECTION' || app.stage === 'RETURNED_FOR_INFORMATION');
    }
    if (statusFilter === 'APPROVED') {
      return matchesSearch && (app.union_verified || app.stage === 'AC_LAND_REVIEW_PENDING' || app.stage === 'REGISTRATION_READY');
    }
    if (statusFilter === 'REJECTED') {
      return matchesSearch && (app.stage === 'UNION_REJECTED' || app.status === 'rejected');
    }
    return matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 rounded-lg">
              <Building2 className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">ইউনিয়ন ভূমি অফিস ড্যাশবোর্ড</h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            মৌজাভিত্তিক ভূমি হস্তান্তর প্রস্তাবনা, সরেজমিন দখল ও দাগ সীমানা যাচাই এবং প্রাথমিক কর পরিশোধ সনদ নিরীক্ষা।
          </p>
        </div>

        <button
          onClick={loadData}
          className="self-start md:self-auto inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 border border-emerald-200 dark:border-emerald-800 text-xs font-bold transition shadow-2xs"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          <span>ডাটা রিফ্রেশ</span>
        </button>
      </div>

      {/* Real Statistics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800 shadow-2xs transition-colors">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-semibold">নতুন আবেদন</span>
            <Clock size={16} className="text-blue-500 dark:text-blue-400" />
          </div>
          <p className="text-2xl font-black text-blue-900 dark:text-blue-300 font-mono">{stats.new_applications_count}</p>
          <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 block">যাচাইয়ের অপেক্ষায়</span>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800 shadow-2xs transition-colors">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-semibold">তদন্ত প্রক্রিয়াধীন</span>
            <ClipboardList size={16} className="text-amber-500 dark:text-amber-400" />
          </div>
          <p className="text-2xl font-black text-amber-900 dark:text-amber-300 font-mono">{stats.pending_review_count}</p>
          <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 block">সরেজমিন পর্যবেক্ষণ</span>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800 shadow-2xs transition-colors">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-semibold">সংশোধন প্রয়োজন</span>
            <AlertTriangle size={16} className="text-amber-600 dark:text-amber-400" />
          </div>
          <p className="text-2xl font-black text-amber-950 dark:text-amber-200 font-mono">{stats.returned_count}</p>
          <span className="text-[10px] text-amber-700 dark:text-amber-400 mt-1 block">নাগরিককে ফেরত</span>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800 shadow-2xs transition-colors">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-semibold">অনুমোদিত ও প্রেরিত</span>
            <CheckCircle2 size={16} className="text-emerald-500 dark:text-emerald-400" />
          </div>
          <p className="text-2xl font-black text-emerald-900 dark:text-emerald-300 font-mono">{stats.approved_count}</p>
          <span className="text-[10px] text-emerald-700 dark:text-emerald-400 mt-1 block">এসি ল্যান্ডে অগ্রসর</span>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800 shadow-2xs transition-colors">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-semibold">নামঞ্জুর / বাতিল</span>
            <XCircle size={16} className="text-red-500 dark:text-red-400" />
          </div>
          <p className="text-2xl font-black text-red-900 dark:text-red-300 font-mono">{stats.rejected_count}</p>
          <span className="text-[10px] text-red-700 dark:text-red-400 mt-1 block">কারণসহ বাতিল</span>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800 shadow-2xs transition-colors">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-semibold">খাজনা বকেয়া কেস</span>
            <Coins size={16} className="text-purple-500 dark:text-purple-400" />
          </div>
          <p className="text-2xl font-black text-purple-900 dark:text-purple-300 font-mono">{stats.tax_issue_count}</p>
          <span className="text-[10px] text-purple-700 dark:text-purple-400 mt-1 block">কর অপরিশোধিত</span>
        </div>
      </div>

      {/* Application Queue Section */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden transition-colors">
        {/* Table Controls */}
        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: 'ALL', label: 'সকল আবেদন' },
              { id: 'PENDING', label: 'অপেক্ষমাণ' },
              { id: 'RETURNED', label: 'সংশোধনে ফেরত' },
              { id: 'APPROVED', label: 'অনুমোদিত' },
              { id: 'REJECTED', label: 'বাতিলকৃত' },
            ].map((btn) => (
              <button
                key={btn.id}
                onClick={() => setStatusFilter(btn.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                  statusFilter === btn.id
                    ? 'bg-emerald-600 text-white shadow-2xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {btn.label}
              </button>
            ))}
          </div>

          <div className="relative min-w-[220px]">
            <Search size={15} className="absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="আবেদন নং, দাগ বা নাম খুঁজুন..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        {/* Queue Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700 dark:text-slate-200">
            <thead className="bg-slate-50 dark:bg-slate-800/80 text-[11px] font-bold text-slate-600 dark:text-slate-300 uppercase border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="py-3 px-4">আবেদন নম্বর</th>
                <th className="py-3 px-4">বিক্রেতা ও ক্রেতা</th>
                <th className="py-3 px-4">মৌজা ও দাগ নং</th>
                <th className="py-3 px-4">হস্তান্তর পরিমাণ</th>
                <th className="py-3 px-4">খাজনা স্থিতি</th>
                <th className="py-3 px-4">দাখিলের তারিখ</th>
                <th className="py-3 px-4">বর্তমান অবস্থা</th>
                <th className="py-3 px-4 text-right">কার্যক্রম</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-500 dark:text-slate-400">
                    লোড হচ্ছে...
                  </td>
                </tr>
              ) : filteredApps.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-500 dark:text-slate-400">
                    কোনো আবেদন পাওয়া যায়নি।
                  </td>
                </tr>
              ) : (
                filteredApps.map((app: any) => (
                  <tr key={app.id} className="hover:bg-emerald-50/40 dark:hover:bg-slate-800/60 transition">
                    <td className="py-3 px-4 font-mono font-bold text-slate-900 dark:text-white">
                      {app.application_no}
                    </td>
                    <td className="py-3 px-4">
                      <div>
                        <span className="font-semibold text-slate-900 dark:text-white block">{app.seller?.name_bn || 'বিক্রেতা'}</span>
                        <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">ক্রেতা ID: {app.buyer_citizen_id}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-semibold text-slate-900 dark:text-white block">দাগ নং {app.parcel?.dag_no || '৪১৫'}</span>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400">{app.parcel?.mouza || 'বাড্ডা'} (খতিয়ান {app.parcel?.khatian_no || '১২০৪'})</span>
                    </td>
                    <td className="py-3 px-4 font-mono">
                      <span className="font-bold text-emerald-800 dark:text-emerald-400">{app.proposed_area_decimal} শতক</span>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 block">হিস্যা: {app.proposed_share}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold ${
                        app.tax_cleared || app.tax_status === 'পরিশোধিত'
                          ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300'
                          : 'bg-red-100 dark:bg-red-950/80 text-red-800 dark:text-red-300'
                      }`}>
                        {app.tax_cleared || app.tax_status === 'পরিশোধিত' ? 'পরিশোধিত' : 'বকেয়া বিদ্যমান'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-500 dark:text-slate-400">
                      {new Date(app.created_at).toLocaleDateString('bn-BD')}
                    </td>
                    <td className="py-3 px-4">
                      <StatusBadge stage={app.stage} />
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Link
                        to={`/office/union/applications/${app.id}`}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-2xs transition"
                      >
                        <Eye size={13} />
                        <span>যাচাই ও রিভিউ</span>
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UnionDashboard;
