import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../../services/api';
import { SaleApplication } from '../../../types';
import { StatusBadge } from '../../../components/common/StatusBadge';
import { useLanguage } from '../../../context/LanguageContext';
import { formatName, formatMouza, formatPlot, formatKhatian, formatArea, toEnglishDigits } from '../../../utils/bilingual';
import {
  Building2,
  ClipboardList,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowRight,
  Search,
  Eye,
  RefreshCw,
  Coins,
  X
} from 'lucide-react';

export const UnionDashboard: React.FC = () => {
  const { language } = useLanguage();
  const isBn = language === 'bn';

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [mouzaFilter, setMouzaFilter] = useState('ALL');
  const [previewApp, setPreviewApp] = useState<any | null>(null);

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

  const filteredApps = applications.filter((app: any) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      (app.application_no || '').toLowerCase().includes(q) ||
      (app.seller?.name_bn || '').toLowerCase().includes(q) ||
      (app.seller?.name_en || '').toLowerCase().includes(q) ||
      (app.buyer?.name_bn || '').toLowerCase().includes(q) ||
      (app.buyer?.name_en || '').toLowerCase().includes(q) ||
      (app.parcel?.dag_no || '').includes(q) ||
      (app.parcel?.mouza || '').includes(q) ||
      (app.parcel?.mouza_bn || '').includes(q) ||
      (app.parcel?.mouza_en || '').toLowerCase().includes(q);

    const appMouza = app.parcel?.mouza_bn || app.parcel?.mouza || '';
    const matchesMouza = mouzaFilter === 'ALL' || appMouza.includes(mouzaFilter);

    if (!matchesMouza) return false;

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
    <div className={`space-y-6 ${isBn ? 'font-bengali' : 'font-sans'}`}>
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 rounded-lg">
              <Building2 className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              {isBn ? 'ইউনিয়ন ভূমি অফিস ড্যাশবোর্ড' : 'Union Land Office Dashboard'}
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            {isBn
              ? 'বাড্ডা ও সাঁতারকুল ইউনিয়ন রাজস্ব সার্কেল | মৌজাভিত্তিক সরেজমিন দখল, সীমানা ও ভূমি উন্নয়ন কর নিরীক্ষা।'
              : 'Badda & Satarkul Union Revenue Circle | Mouza-wise physical possession, boundary & land development tax audit.'}
          </p>
        </div>

        <div className="flex items-center gap-3 self-start md:self-auto">
          <Link
            to="/office/union/tax-verification"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold transition"
          >
            <Coins size={14} className="text-emerald-600 dark:text-emerald-400" />
            <span>{isBn ? 'কর যাচাই খাতা' : 'Tax Register'}</span>
          </Link>
          <button
            onClick={loadData}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 border border-emerald-200 dark:border-emerald-800 text-xs font-bold transition shadow-2xs"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            <span>{isBn ? 'ডাটা রিফ্রেশ' : 'Refresh Data'}</span>
          </button>
        </div>
      </div>

      {/* Real Statistics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800 shadow-2xs transition-colors">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-semibold">{isBn ? 'নতুন আবেদন' : 'New Applications'}</span>
            <Clock size={16} className="text-blue-500 dark:text-blue-400" />
          </div>
          <p className="text-2xl font-black text-blue-900 dark:text-blue-300 font-mono">{stats.new_applications_count}</p>
          <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 block">
            {isBn ? 'যাচাইয়ের অপেক্ষায়' : 'Awaiting Review'}
          </span>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800 shadow-2xs transition-colors">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-semibold">{isBn ? 'তদন্ত প্রক্রিয়াধীন' : 'In Progress'}</span>
            <ClipboardList size={16} className="text-amber-500 dark:text-amber-400" />
          </div>
          <p className="text-2xl font-black text-amber-900 dark:text-amber-300 font-mono">{stats.pending_review_count}</p>
          <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 block">
            {isBn ? 'সরেজমিন পর্যবেক্ষণ' : 'Field Inspection'}
          </span>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800 shadow-2xs transition-colors">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-semibold">{isBn ? 'সংশোধন প্রয়োজন' : 'Needs Correction'}</span>
            <AlertTriangle size={16} className="text-amber-600 dark:text-amber-400" />
          </div>
          <p className="text-2xl font-black text-amber-950 dark:text-amber-200 font-mono">{stats.returned_count}</p>
          <span className="text-[10px] text-amber-700 dark:text-amber-400 mt-1 block">
            {isBn ? 'নাগরিককে ফেরত' : 'Returned to Citizen'}
          </span>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800 shadow-2xs transition-colors">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-semibold">{isBn ? 'অনুমোদিত ও প্রেরিত' : 'Approved & Sent'}</span>
            <CheckCircle2 size={16} className="text-emerald-500 dark:text-emerald-400" />
          </div>
          <p className="text-2xl font-black text-emerald-900 dark:text-emerald-300 font-mono">{stats.approved_count}</p>
          <span className="text-[10px] text-emerald-700 dark:text-emerald-400 mt-1 block">
            {isBn ? 'এসি ল্যান্ডে অগ্রসর' : 'Forwarded to AC Land'}
          </span>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800 shadow-2xs transition-colors">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-semibold">{isBn ? 'নামঞ্জুর / বাতিল' : 'Rejected / Cancelled'}</span>
            <XCircle size={16} className="text-red-500 dark:text-red-400" />
          </div>
          <p className="text-2xl font-black text-red-900 dark:text-red-300 font-mono">{stats.rejected_count}</p>
          <span className="text-[10px] text-red-700 dark:text-red-400 mt-1 block">
            {isBn ? 'কারণসহ বাতিল' : 'Rejected with Cause'}
          </span>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800 shadow-2xs transition-colors">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-semibold">{isBn ? 'খাজনা বকেয়া কেস' : 'Tax Due Cases'}</span>
            <Coins size={16} className="text-purple-500 dark:text-purple-400" />
          </div>
          <p className="text-2xl font-black text-purple-900 dark:text-purple-300 font-mono">{stats.tax_issue_count}</p>
          <span className="text-[10px] text-purple-700 dark:text-purple-400 mt-1 block">
            {isBn ? 'কর অপরিশোধিত' : 'Tax Unpaid'}
          </span>
        </div>
      </div>

      {/* Application Queue Section */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden transition-colors">
        {/* Table Controls */}
        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: 'ALL', label: isBn ? 'সকল আবেদন' : 'All Applications' },
              { id: 'PENDING', label: isBn ? 'অপেক্ষমাণ' : 'Pending' },
              { id: 'RETURNED', label: isBn ? 'সংশোধনে ফেরত' : 'Returned' },
              { id: 'APPROVED', label: isBn ? 'অনুমোদিত' : 'Approved' },
              { id: 'REJECTED', label: isBn ? 'বাতিলকৃত' : 'Rejected' },
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

            <span className="text-slate-300 dark:text-slate-700 hidden sm:inline">|</span>

            {/* Mouza Filter */}
            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-slate-400 text-[11px] font-semibold">{isBn ? 'মৌজা:' : 'Mouza:'}</span>
              {[
                { id: 'ALL', label: isBn ? 'সকল' : 'All' },
                { id: 'বাড্ডা', label: isBn ? 'বাড্ডা' : 'Badda' },
                { id: 'সাঁতারকুল', label: isBn ? 'সাঁতারকুল' : 'Satarkul' },
                { id: 'ভাটারা', label: isBn ? 'ভাটারা' : 'Vatara' },
              ].map((m) => (
                <button
                  key={m.id}
                  onClick={() => setMouzaFilter(m.id)}
                  className={`px-2.5 py-1 rounded text-[11px] font-semibold transition ${
                    mouzaFilter === m.id
                      ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-900 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700'
                      : 'bg-slate-50 dark:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          <div className="relative min-w-[220px]">
            <Search size={15} className="absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder={isBn ? 'আবেদন নং, দাগ বা নাম খুঁজুন...' : 'Search application no, dag or name...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        {/* Queue Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700 dark:text-slate-200">
            <thead className="bg-slate-50 dark:bg-slate-800/80 text-[10px] font-bold text-slate-600 dark:text-slate-300 uppercase border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="py-2 px-2.5">{isBn ? 'আবেদন নং' : 'Application No'}</th>
                <th className="py-2 px-2.5">{isBn ? 'পক্ষগণ' : 'Parties (Seller & Buyer)'}</th>
                <th className="py-2 px-2.5">{isBn ? 'মৌজা ও দাগ' : 'Mouza & Dag No'}</th>
                <th className="py-2 px-2.5">{isBn ? 'জমির পরিমাণ' : 'Transfer Area'}</th>
                <th className="py-2 px-2.5">{isBn ? 'খাজনা' : 'Tax Status'}</th>
                <th className="py-2 px-2.5">{isBn ? 'দাখিল তারিখ' : 'Submission Date'}</th>
                <th className="py-2 px-2.5">{isBn ? 'অবস্থা' : 'Current Status'}</th>
                <th className="py-2 px-2.5 text-right">{isBn ? 'কার্যক্রম' : 'Action'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-6 text-center text-slate-500 dark:text-slate-400">
                    <RefreshCw size={16} className="animate-spin inline mr-2 text-emerald-600" />
                    {isBn ? 'ইউনিয়ন ভূমি রেকর্ড লোড হচ্ছে...' : 'Loading union land records...'}
                  </td>
                </tr>
              ) : filteredApps.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-6 text-center text-slate-500 dark:text-slate-400">
                    {isBn ? 'কোনো আবেদন পাওয়া যায়নি।' : 'No applications found.'}
                  </td>
                </tr>
              ) : (
                filteredApps.map((app: any) => (
                  <tr key={app.id} className="hover:bg-emerald-50/40 dark:hover:bg-slate-800/60 transition">
                    <td className="py-2 px-2.5 font-mono font-bold text-[11px] text-slate-900 dark:text-white whitespace-nowrap">
                      {app.application_no}
                    </td>
                    <td className="py-2 px-2.5">
                      <div className="leading-tight max-w-[150px]">
                        <div className="font-semibold text-slate-900 dark:text-white truncate" title={formatName(app.seller, isBn, 'Rafiqul Islam')}>
                          {formatName(app.seller, isBn, 'Rafiqul Islam')}
                        </div>
                        <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate flex items-center gap-0.5" title={formatName(app.buyer, isBn, 'Farhan Ahmed')}>
                          <span className="text-slate-400">→</span>
                          <span>{formatName(app.buyer, isBn, 'Farhan Ahmed')}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-2 px-2.5">
                      <div className="leading-tight max-w-[145px]">
                        <div className="font-semibold text-slate-900 dark:text-white truncate">
                          {formatPlot(app.parcel?.dag_no, isBn)}
                        </div>
                        <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                          {formatMouza(app.parcel, isBn)} ({formatKhatian(app.parcel?.khatian_no, isBn)})
                        </div>
                      </div>
                    </td>
                    <td className="py-2 px-2.5">
                      <div className="leading-tight">
                        <span className="font-bold text-emerald-700 dark:text-emerald-400 font-mono text-[11px]">
                          {formatArea(app.proposed_area_decimal, isBn, true)}
                        </span>
                        <div className="text-[10px] text-slate-400 font-sans">
                          {isBn ? `হিস্যা ${app.proposed_share}` : `Share ${toEnglishDigits(app.proposed_share)}`}
                        </div>
                      </div>
                    </td>
                    <td className="py-2 px-2.5 whitespace-nowrap">
                      <span className={`inline-flex px-1.5 py-0.5 rounded text-[10px] font-bold ${
                        app.tax_cleared || app.tax_status === 'পরিশোধিত'
                          ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300'
                          : 'bg-red-100 dark:bg-red-950/80 text-red-800 dark:text-red-300'
                      }`}>
                        {app.tax_cleared || app.tax_status === 'পরিশোধিত'
                          ? (isBn ? 'পরিশোধিত' : 'Paid / Cleared')
                          : (isBn ? 'বকেয়া' : 'Dues Pending')}
                      </span>
                    </td>
                    <td className="py-2 px-2.5 text-slate-500 dark:text-slate-400 text-[11px] font-mono whitespace-nowrap">
                      {app.created_at
                        ? new Date(app.created_at).toLocaleDateString(isBn ? 'bn-BD' : 'en-US')
                        : (isBn ? '২০২৬-০৩-০১' : '2026-03-01')}
                    </td>
                    <td className="py-2 px-2.5 whitespace-nowrap">
                      <StatusBadge stage={app.stage} />
                    </td>
                    <td className="py-2 px-2.5 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => setPreviewApp(app)}
                          className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-[11px] font-semibold transition cursor-pointer"
                          title={isBn ? 'সারসংক্ষেপ' : 'Preview'}
                        >
                          <Eye size={12} />
                          <span>{isBn ? 'প্রিভিউ' : 'Preview'}</span>
                        </button>
                        <Link
                          to={`/office/union/applications/${app.id}`}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold shadow-2xs transition"
                        >
                          <span>{isBn ? 'তদন্ত' : 'Inspect & Report'}</span>
                          <ArrowRight size={12} />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick View Inspection Modal */}
      {previewApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl max-w-lg w-full p-6 text-xs text-slate-800 dark:text-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Building2 size={18} className="text-emerald-600 dark:text-emerald-400" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {isBn ? `তদন্ত সারসংক্ষেপ: ${previewApp.application_no}` : `Inspection Summary: ${previewApp.application_no}`}
                </h3>
              </div>
              <button
                onClick={() => setPreviewApp(null)}
                className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500"
              >
                <X size={16} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-xl border border-slate-200 dark:border-slate-700">
              <div>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 block">{isBn ? 'বিক্রেতা' : 'Seller'}</span>
                <span className="font-semibold text-slate-900 dark:text-white">
                  {isBn ? (previewApp.seller?.name_bn || 'রফিকুল ইসলাম') : (previewApp.seller?.name_en || 'Rafiqul Islam')}
                </span>
                <span className="text-[10px] text-slate-400 block font-mono">
                  NID: {previewApp.seller?.nid_no || '19852691029384756'}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 block">{isBn ? 'ক্রেতা' : 'Buyer'}</span>
                <span className="font-semibold text-slate-900 dark:text-white">
                  {isBn ? (previewApp.buyer?.name_bn || 'ফারহান আহমেদ') : (previewApp.buyer?.name_en || 'Farhan Ahmed')}
                </span>
                <span className="text-[10px] text-slate-400 block font-mono">
                  ID: {previewApp.buyer_citizen_id || 'BHM-CIT-419203'}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 block">{isBn ? 'দাগ ও খতিয়ান' : 'Dag & Khatian'}</span>
                <span className="font-semibold text-slate-900 dark:text-white">
                  {isBn
                    ? `দাগ ${previewApp.parcel?.dag_no}, খতিয়ান ${previewApp.parcel?.khatian_no} (${previewApp.parcel?.mouza_bn || previewApp.parcel?.mouza})`
                    : `Dag ${previewApp.parcel?.dag_no}, Khatian ${previewApp.parcel?.khatian_no} (${previewApp.parcel?.mouza_en || previewApp.parcel?.mouza})`}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 block">{isBn ? 'বিক্রিত পরিমাণ' : 'Sold Area'}</span>
                <span className="font-semibold text-emerald-700 dark:text-emerald-400 font-mono">
                  {previewApp.proposed_area_decimal} {isBn ? 'শতক' : 'dec'} ({isBn ? `হিস্যা ${previewApp.proposed_share}` : `Share ${previewApp.proposed_share}`})
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 block">{isBn ? 'পণমূল্য' : 'Agreed Price'}</span>
                <span className="font-semibold text-slate-900 dark:text-white font-mono">
                  ৳ {Number(previewApp.agreed_price_bdt || 0).toLocaleString(isBn ? 'bn-BD' : 'en-US')}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 block">{isBn ? 'খাজনা স্থিতি' : 'Tax Status'}</span>
                <span className="font-semibold text-emerald-700 dark:text-emerald-400">
                  {previewApp.tax_cleared
                    ? (isBn ? 'হালনাগাদ পরিশোধিত' : 'Up-to-date Paid')
                    : (isBn ? 'বকেয়া বিদ্যমান' : 'Dues Pending')}
                </span>
              </div>
            </div>

            <div className="space-y-1 text-[11px] text-slate-600 dark:text-slate-400 bg-emerald-50/50 dark:bg-emerald-950/30 p-3 rounded-lg border border-emerald-200 dark:border-emerald-800/60">
              <span className="font-bold text-emerald-900 dark:text-emerald-300 block mb-0.5">
                {isBn ? 'তহশিলদার প্রাথমিক নোট:' : 'Tehsildar Initial Note:'}
              </span>
              <p>
                {isBn
                  ? 'দাগের উত্তর সীমানায় বিক্রেতার দখল শান্তিপূর্ণ। সীমানা বিরোধ বা কোনো দেওয়ানি নিষেধাজ্ঞা পরিলক্ষিত হয়নি।'
                  : "Seller has peaceful physical possession on the northern boundary. No dispute or injunction observed."}
              </p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t dark:border-slate-800">
              <Link
                to={`/office/union/applications/${previewApp.id}`}
                className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
              >
                {isBn ? 'সরেজমিন প্রতিবেদন ও অনুমোদন ফর্ম →' : 'Field Report & Approval Form →'}
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UnionDashboard;

