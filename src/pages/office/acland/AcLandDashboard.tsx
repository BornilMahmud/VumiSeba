import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../../services/api';
import { SaleApplication } from '../../../types';
import { StatusBadge } from '../../../components/common/StatusBadge';
import { useLanguage } from '../../../context/LanguageContext';
import { formatName, formatMouza, formatPlot, formatKhatian, formatArea, toEnglishDigits } from '../../../utils/bilingual';
import {
  Landmark,
  ClipboardList,
  CheckCircle2,
  XCircle,
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
  const { language } = useLanguage();
  const isBn = language === 'bn';

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'PRE_REG' | 'MUTATION' | 'CAUSE_LIST'>('PRE_REG');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMouza, setSelectedMouza] = useState<string>('ALL');
  const [inspectItem, setInspectItem] = useState<{ type: 'SALE' | 'MUTATION'; data: any } | null>(null);

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

  const preRegApplications: SaleApplication[] =
    data?.all_applications || data?.queue || data?.pre_registration_all || data?.pre_registration_queue || [];
  const mutationCases: any[] = data?.mutation_cases || [];
  const scheduledHearings: any[] =
    data?.hearings || mutationCases.filter((m: any) => m.hearing_date || m.current_stage === 'hearing_scheduled');

  const filteredPreReg = preRegApplications.filter((app) => {
    const q = searchQuery.toLowerCase();
    const mouzaMatch =
      selectedMouza === 'ALL' ||
      (app.parcel?.mouza_bn || app.parcel?.mouza || app.parcel?.mouza_en || '').includes(selectedMouza);
    const searchMatch =
      (app.application_no || '').toLowerCase().includes(q) ||
      (app.seller?.name_bn || '').toLowerCase().includes(q) ||
      (app.seller?.name_en || '').toLowerCase().includes(q) ||
      (app.buyer?.name_bn || '').toLowerCase().includes(q) ||
      (app.buyer?.name_en || '').toLowerCase().includes(q) ||
      (app.parcel?.khatian_no || '').toLowerCase().includes(q) ||
      (app.parcel?.dag_no || '').toLowerCase().includes(q) ||
      (app.parcel?.mouza_bn || app.parcel?.mouza || '').toLowerCase().includes(q);
    return mouzaMatch && searchMatch;
  });

  const filteredMutations = mutationCases.filter((mut: any) => {
    const q = searchQuery.toLowerCase();
    const mouza = mut.mouza_bn || mut.mouza || mut.parcel?.mouza_bn || mut.parcel?.mouza || '';
    const mouzaMatch = selectedMouza === 'ALL' || mouza.includes(selectedMouza);
    const searchMatch =
      (mut.mutation_case_no || '').toLowerCase().includes(q) ||
      (mut.khatian_no || '').toLowerCase().includes(q) ||
      (mut.dag_no || '').toLowerCase().includes(q) ||
      (mut.applicant?.name_bn || '').toLowerCase().includes(q) ||
      (mut.applicant?.name_en || '').toLowerCase().includes(q) ||
      mouza.toLowerCase().includes(q);
    return mouzaMatch && searchMatch;
  });

  const filteredHearings = scheduledHearings.filter((h: any) => {
    const q = searchQuery.toLowerCase();
    const mouza = h.mouza_bn || h.mouza || h.parcel?.mouza_bn || h.parcel?.mouza || '';
    const mouzaMatch = selectedMouza === 'ALL' || mouza.includes(selectedMouza);
    return (
      mouzaMatch &&
      ((h.mutation_case_no || '').toLowerCase().includes(q) ||
        (h.dag_no || '').toLowerCase().includes(q) ||
        (h.applicant?.name_bn || '').toLowerCase().includes(q) ||
        (h.applicant?.name_en || '').toLowerCase().includes(q))
    );
  });

  return (
    <div className={`space-y-6 ${isBn ? 'font-bengali' : 'font-sans'}`}>
      {/* Overview Top Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs transition-colors">
          <div className="flex items-center justify-between text-indigo-700 dark:text-indigo-400 mb-2">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              {isBn ? 'প্রাক-পর্যালোচনা অপেক্ষমাণ' : 'Pre-Review Pending'}
            </span>
            <ClipboardList size={18} />
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white font-mono">{stats.awaiting_review_count}</p>
          <span className="text-[10px] text-indigo-700 dark:text-indigo-400 font-medium">
            {isBn ? 'ইউনিয়ন হতে প্রেরিত' : 'Forwarded from Union'}
          </span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs transition-colors">
          <div className="flex items-center justify-between text-amber-600 dark:text-amber-400 mb-2">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              {isBn ? 'নামজারি নথি (অপেক্ষমাণ)' : 'Mutation Cases'}
            </span>
            <Scale size={18} />
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white font-mono">{stats.mutation_pending_count}</p>
          <span className="text-[10px] text-amber-600 dark:text-amber-400 font-medium">
            {isBn ? 'রেজিস্ট্রি সম্পন্ন নালিশ' : 'Post-Registry Files'}
          </span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs transition-colors">
          <div className="flex items-center justify-between text-blue-600 dark:text-blue-400 mb-2">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              {isBn ? 'শুনানি নির্ধারিত' : 'Hearings Scheduled'}
            </span>
            <CalendarCheck size={18} />
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white font-mono">{stats.hearings_scheduled_count}</p>
          <span className="text-[10px] text-blue-600 dark:text-blue-400 font-medium">
            {isBn ? 'উভয় পক্ষকে নোটিশ জারী' : 'Notices Issued'}
          </span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs transition-colors">
          <div className="flex items-center justify-between text-emerald-600 dark:text-emerald-400 mb-2">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              {isBn ? 'অনুমোদিত (প্রাক-রেজিস্ট্রি)' : 'Pre-Reg Approved'}
            </span>
            <CheckCircle2 size={18} />
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white font-mono">{stats.approved_count}</p>
          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
            {isBn ? 'সাব-রেজিস্ট্রিতে অগ্রায়িত' : 'Sent to Sub-Registry'}
          </span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs transition-colors">
          <div className="flex items-center justify-between text-purple-600 dark:text-purple-400 mb-2">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              {isBn ? 'নামজারি খতিয়ান সৃজিত' : 'Mutations Completed'}
            </span>
            <Award size={18} />
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white font-mono">{stats.completed_count}</p>
          <span className="text-[10px] text-purple-600 dark:text-purple-400 font-medium">
            {isBn ? 'চূড়ান্ত স্বত্ব রেকর্ড হালনাগাদ' : 'Khatian Record Created'}
          </span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs transition-colors">
          <div className="flex items-center justify-between text-rose-600 dark:text-rose-400 mb-2">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              {isBn ? 'বাতিলকৃত কেস' : 'Rejected Cases'}
            </span>
            <XCircle size={18} />
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white font-mono">{stats.rejected_count}</p>
          <span className="text-[10px] text-rose-600 dark:text-rose-400 font-medium">
            {isBn ? 'আইনি অসঙ্গতি ও আপত্তি' : 'Legal Conflict / Void'}
          </span>
        </div>
      </div>

      {/* Main Container */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs overflow-hidden transition-colors">
        {/* Navigation Tabs & Controls */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setActiveTab('PRE_REG')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition ${
                activeTab === 'PRE_REG'
                  ? 'bg-indigo-700 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              <ClipboardList size={15} />
              {isBn ? `প্রাক-রেজিস্ট্রেশন যাচাই (${filteredPreReg.length})` : `Pre-Registration Audit (${filteredPreReg.length})`}
            </button>

            <button
              onClick={() => setActiveTab('MUTATION')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition ${
                activeTab === 'MUTATION'
                  ? 'bg-indigo-700 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              <Scale size={15} />
              {isBn ? `ই-নামজারি মিস কেস (${filteredMutations.length})` : `E-Mutation Misc Cases (${filteredMutations.length})`}
            </button>

            <button
              onClick={() => setActiveTab('CAUSE_LIST')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition ${
                activeTab === 'CAUSE_LIST'
                  ? 'bg-indigo-700 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              <CalendarCheck size={15} />
              {isBn ? `দৈনিক কজলিস্ট ও শুনানি (${filteredHearings.length})` : `Daily Cause List & Hearings (${filteredHearings.length})`}
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Mouza filter pills */}
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg text-xs font-medium">
              {[
                { id: 'ALL', label: isBn ? 'সকল মৌজা' : 'All Mouzas' },
                { id: 'বাড্ডা', label: isBn ? 'বাড্ডা' : 'Badda' },
                { id: 'সাঁতারকুল', label: isBn ? 'সাঁতারকুল' : 'Satarkul' },
                { id: 'ভাটারা', label: isBn ? 'ভাটারা' : 'Vatara' },
              ].map((mouza) => (
                <button
                  key={mouza.id}
                  onClick={() => setSelectedMouza(mouza.id)}
                  className={`px-2.5 py-1 rounded-md transition ${
                    selectedMouza === mouza.id
                      ? 'bg-white dark:bg-slate-700 text-indigo-700 dark:text-indigo-300 font-bold shadow-2xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {mouza.label}
                </button>
              ))}
            </div>

            <div className="relative">
              <Search size={15} className="absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={isBn ? 'কেস নং, খতিয়ান, দাগ বা নাম...' : 'Search case no, dag or name...'}
                className="pl-9 pr-3 py-1.5 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-lg text-xs w-52 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <button
              onClick={loadData}
              className="p-1.5 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
              title={isBn ? 'রিফ্রেশ করুন' : 'Refresh'}
            >
              <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
            </button>
          </div>
        </div>

        {/* Tab 1: Pre-Registration Applications */}
        {activeTab === 'PRE_REG' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs whitespace-nowrap">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-bold whitespace-nowrap">
                  <th className="py-3.5 px-4 whitespace-nowrap">{isBn ? 'আবেদন ও দাখিল তারিখ' : 'Application No'}</th>
                  <th className="py-3.5 px-4 whitespace-nowrap">{isBn ? 'পক্ষগণ (বিক্রেতা ও ক্রেতা)' : 'Parties (Seller & Buyer)'}</th>
                  <th className="py-3.5 px-4 whitespace-nowrap">{isBn ? 'জমির তপশিল ও মৌজা' : 'Land Schedule & Mouza'}</th>
                  <th className="py-3.5 px-4 whitespace-nowrap">{isBn ? 'হস্তান্তরিত হিস্যা / পরিমাণ' : 'Transfer Area & Share'}</th>
                  <th className="py-3.5 px-4 whitespace-nowrap">{isBn ? 'ইউনিয়ন রিপোর্ট স্থিতি' : 'Union Report Status'}</th>
                  <th className="py-3.5 px-4 whitespace-nowrap">{isBn ? 'বর্তমান পর্যায়' : 'Current Stage'}</th>
                  <th className="py-3.5 px-4 text-right whitespace-nowrap">{isBn ? 'বিচারিক সিদ্ধান্ত' : 'Action'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-slate-500 dark:text-slate-400 whitespace-nowrap">
                      <Clock size={18} className="animate-spin inline-block mr-2" />
                      {isBn ? 'এসি ল্যান্ড নথি লোড হচ্ছে...' : 'Loading AC Land files...'}
                    </td>
                  </tr>
                ) : filteredPreReg.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-slate-500 dark:text-slate-400 whitespace-nowrap">
                      {isBn ? 'কোন প্রাক-রেজিস্ট্রেশন নথি পাওয়া যায়নি।' : 'No pre-registration applications found.'}
                    </td>
                  </tr>
                ) : (
                  filteredPreReg.map((app) => (
                    <tr key={app.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/60 transition whitespace-nowrap">
                      <td className="py-3 px-4 font-mono font-bold text-slate-900 dark:text-white whitespace-nowrap">
                        {app.application_no}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className="font-semibold text-slate-800 dark:text-slate-200">
                          {isBn ? 'বি: ' : 'S: '}{formatName(app.seller, isBn, 'Md. Rafiqul Islam')}
                        </span>
                        <span className="text-slate-400 mx-1.5">→</span>
                        <span className="font-semibold text-indigo-900 dark:text-indigo-400">
                          {isBn ? 'ক্র: ' : 'B: '}{formatName(app.buyer, isBn, 'Tania Akter')}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-700 dark:text-slate-300 whitespace-nowrap">
                        <span className="font-medium text-slate-900 dark:text-white">
                          {formatMouza(app.parcel, isBn)}
                        </span>
                        <span className="text-slate-400 mx-1">·</span>
                        <span className="text-xs text-slate-500 dark:text-slate-400">
                          {formatPlot(app.parcel?.dag_no, isBn)}, {formatKhatian(app.parcel?.khatian_no, isBn)}
                        </span>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap font-mono">
                        <span className="font-bold text-slate-900 dark:text-white">
                          {formatArea(app.proposed_area_decimal || 2.5, isBn, true)}
                        </span>
                        <span className="text-slate-400 mx-1 font-sans">·</span>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400 font-sans">
                          {isBn ? `হিস্যা: ${app.proposed_share || '০.১৫০০'}` : `Share: ${toEnglishDigits(app.proposed_share || '0.1500')}`}
                        </span>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        {app.union_report || app.union_verified ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-md border border-emerald-200 dark:border-emerald-800 whitespace-nowrap shrink-0">
                            <CheckCircle2 size={12} />
                            {isBn ? 'সরেজমিন অনুমোদিত' : 'Field Verified'}
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 px-2.5 py-1 rounded-md border border-amber-200 dark:border-amber-800 whitespace-nowrap shrink-0">
                            <Clock size={12} />
                            {isBn ? 'প্রতিবেদন অপেক্ষমাণ' : 'Report Pending'}
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <StatusBadge stage={app.stage} />
                      </td>
                      <td className="py-3 px-4 text-right whitespace-nowrap min-w-[220px]">
                        <div className="flex items-center justify-end gap-2 whitespace-nowrap flex-nowrap shrink-0">
                          <button
                            type="button"
                            onClick={() => setInspectItem({ type: 'SALE', data: app })}
                            className="p-1.5 text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition whitespace-nowrap shrink-0 cursor-pointer"
                            title={isBn ? 'দ্রুত সারসংক্ষেপ' : 'Quick Summary'}
                          >
                            <Eye size={14} />
                          </button>
                          <Link
                            to={`/office/ac-land/applications/${app.id}`}
                            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 font-bold rounded-lg transition whitespace-nowrap shrink-0"
                          >
                            <span>{isBn ? 'পর্যালোচনা ও আদেশ' : 'Review & Order'}</span>
                          </Link>
                        </div>
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
            <table className="w-full text-left border-collapse text-xs whitespace-nowrap">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-bold whitespace-nowrap">
                  <th className="py-3.5 px-4 whitespace-nowrap">{isBn ? 'নামজারি মিস কেস নং' : 'Mutation Case No'}</th>
                  <th className="py-3.5 px-4 whitespace-nowrap">{isBn ? 'রেজিস্ট্রিকৃত কবলা দলিল নং' : 'Deed Reference'}</th>
                  <th className="py-3.5 px-4 whitespace-nowrap">{isBn ? 'মৌজা, দাগ ও খতিয়ান' : 'Mouza, Dag & Khatian'}</th>
                  <th className="py-3.5 px-4 whitespace-nowrap">{isBn ? 'নামজারিকৃত পরিমাণ' : 'Mutation Area'}</th>
                  <th className="py-3.5 px-4 whitespace-nowrap">{isBn ? 'শুনানি / বিচারিক অবস্থা' : 'Hearing Status'}</th>
                  <th className="py-3.5 px-4 whitespace-nowrap">{isBn ? 'স্থিতি' : 'Status'}</th>
                  <th className="py-3.5 px-4 text-right whitespace-nowrap">{isBn ? 'আদালত কার্যক্রম' : 'Court Action'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredMutations.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-slate-500 dark:text-slate-400 whitespace-nowrap">
                      {isBn ? 'কোন নামজারি মিস কেস নথিভুক্ত নেই।' : 'No mutation misc cases found.'}
                    </td>
                  </tr>
                ) : (
                  filteredMutations.map((mut: any) => (
                    <tr key={mut.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/60 transition whitespace-nowrap">
                      <td className="py-3 px-4 font-mono font-bold text-indigo-900 dark:text-indigo-300 whitespace-nowrap">
                        {mut.mutation_case_no || 'MUT-AC-2026-001'}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                          {isBn ? (mut.deed_no || 'দলিল নং ৩৪০৯/২০২৬') : (mut.deed_no_en || `Deed #${toEnglishDigits(mut.deed_no || '3409/2026')}`)}
                        </span>
                        <span className="text-[11px] text-slate-400 ml-1.5">
                          {isBn ? '(সাব-রেজিস্ট্রি)' : '(Sub-Registry)'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-700 dark:text-slate-300 whitespace-nowrap">
                        <span className="font-medium text-slate-900 dark:text-white">
                          {formatMouza(mut.parcel || mut.mouza, isBn, 'Satarkul')}
                        </span>
                        <span className="text-slate-400 mx-1">·</span>
                        <span className="text-xs text-slate-500 dark:text-slate-400">
                          {formatPlot(mut.dag_no || mut.parcel?.dag_no, isBn)}, {formatKhatian(mut.khatian_no || mut.previous_khatian_no, isBn)}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-semibold text-slate-800 dark:text-slate-200 whitespace-nowrap font-mono">
                        {formatArea(mut.transferred_area_decimal || '4.12', isBn, true)}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        {mut.hearing_date ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-800 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 px-2.5 py-1 rounded-md border border-blue-200 dark:border-blue-800 whitespace-nowrap shrink-0">
                            <CalendarCheck size={12} />
                            {isBn ? `শুনানি: ${mut.hearing_date}` : `Hearing: ${mut.hearing_date}`}
                          </span>
                        ) : (
                          <span className="text-[11px] text-slate-500 dark:text-slate-400">
                            {isBn ? 'তারিখ নির্ধারিত নয়' : 'Date Not Scheduled'}
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <StatusBadge stage={mut.status || mut.current_stage} />
                      </td>
                      <td className="py-3 px-4 text-right whitespace-nowrap min-w-[190px]">
                        <div className="flex items-center justify-end gap-2 whitespace-nowrap flex-nowrap shrink-0">
                          <button
                            type="button"
                            onClick={() => setInspectItem({ type: 'MUTATION', data: mut })}
                            className="p-1.5 text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition whitespace-nowrap shrink-0 cursor-pointer"
                            title={isBn ? 'দ্রুত সারসংক্ষেপ' : 'Quick Summary'}
                          >
                            <Eye size={14} />
                          </button>
                          <Link
                            to="/office/ac-land/mutation"
                            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-indigo-700 hover:bg-indigo-800 text-white font-bold rounded-lg transition whitespace-nowrap shrink-0"
                          >
                            <Scale size={13} />
                            <span>{isBn ? 'শুনানি ও রায়' : 'Hearing & Order'}</span>
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab 3: Revenue Court Cause List (দৈনিক কজলিস্ট) */}
        {activeTab === 'CAUSE_LIST' && (
          <div className="p-4 space-y-4">
            <div className="bg-indigo-50/70 dark:bg-indigo-950/30 p-3.5 rounded-xl border border-indigo-200 dark:border-indigo-800/60 flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-indigo-950 dark:text-indigo-200 flex items-center gap-2">
                  <Landmark size={15} className="text-indigo-700 dark:text-indigo-400" />
                  {isBn
                    ? 'সহকারী কমিশনার (ভূমি) রাজস্ব এজলাস — দৈনিক কজলিস্ট'
                    : 'Assistant Commissioner (Land) Revenue Bench — Daily Cause List'}
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  {isBn
                    ? 'স্টেট একুইজিশন অ্যান্ড প্রজাস্বত্ব আইন ১৯৫০ এর ১৪৩ ধারা মোতাবেক নোটিশপ্রাপ্ত ও শুনানির জন্য অপেক্ষমাণ কেসসমূহ'
                    : 'Cases scheduled under Section 143 of the State Acquisition and Tenancy Act 1950'}
                </p>
              </div>
              <span className="text-xs font-bold font-mono text-indigo-700 dark:text-indigo-300 bg-white dark:bg-slate-800 px-2.5 py-1 rounded-md border border-indigo-200 dark:border-indigo-800">
                {isBn ? `আজকের নির্ধারিত শুনানি: ${filteredHearings.length} টি` : `Today's Hearings: ${filteredHearings.length}`}
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-bold">
                    <th className="py-2.5 px-4">{isBn ? 'আইটেম নং ও কেস' : 'Item No & Case'}</th>
                    <th className="py-2.5 px-4">{isBn ? 'শুনানির সময় ও এজলাস' : 'Hearing Time & Bench'}</th>
                    <th className="py-2.5 px-4">{isBn ? 'আবেদনকারী / ক্রেতা' : 'Applicant / Buyer'}</th>
                    <th className="py-2.5 px-4">{isBn ? 'মৌজা ও খতিয়ান-দাগ' : 'Mouza & Dag-Khatian'}</th>
                    <th className="py-2.5 px-4">{isBn ? 'আপত্তি দাখিল' : 'Objection Status'}</th>
                    <th className="py-2.5 px-4 text-right">{isBn ? 'আদালত আদেশ' : 'Bench Action'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredHearings.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-slate-500 dark:text-slate-400">
                        {isBn ? 'আজকের জন্য কোন শুনানি নির্ধারিত নেই।' : 'No hearings scheduled for today.'}
                      </td>
                    </tr>
                  ) : (
                    filteredHearings.map((h: any, idx: number) => (
                      <tr key={h.id || idx} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/60 transition">
                        <td className="py-3 px-4">
                          <span className="font-bold text-slate-500 dark:text-slate-400 block font-mono">
                            {isBn ? `আইটেম #${idx + 1}` : `Item #${idx + 1}`}
                          </span>
                          <span className="font-mono font-bold text-indigo-700 dark:text-indigo-300">
                            {h.mutation_case_no || `MUT-AC-2026-00${idx + 1}`}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-bold text-slate-900 dark:text-white block flex items-center gap-1">
                            <Clock size={12} className="text-blue-600" />
                            {h.hearing_date || '2026-03-25'} {isBn ? '(বেলা ১১:৩০)' : '(11:30 AM)'}
                          </span>
                          <span className="text-[11px] text-slate-400">
                            {isBn ? 'গুলশান রাজস্ব এজলাস' : 'Gulshan Revenue Bench'}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-semibold text-slate-800 dark:text-slate-200 block">
                            {isBn ? (h.applicant?.name_bn || 'মোসা: তানিয়া আক্তার') : (h.applicant?.name_en || 'Tania Akter')}
                          </span>
                          <span className="text-[11px] text-slate-400">
                            {isBn ? 'এনআইডি যাচাইকৃত' : 'NID Verified'}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-slate-700 dark:text-slate-300">
                          <span>{isBn ? (h.mouza_bn || h.mouza || 'বাড্ডা') : (h.mouza_en || 'Badda')}</span>
                          <span className="block text-[11px] text-slate-400">
                            {isBn ? `দাগ: ${h.dag_no || '৪০৫'}, খতিয়ান: ${h.khatian_no || '১২০৪'}` : `Dag: ${h.dag_no || '405'}, Khatian: ${h.khatian_no || '1204'}`}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
                            <CheckCircle2 size={12} />
                            {isBn ? 'কোন আপত্তি নেই' : 'No Objections'}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <Link
                            to="/office/ac-land/mutation"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-700 hover:bg-indigo-800 text-white font-bold rounded-lg transition"
                          >
                            <Scale size={13} />
                            {isBn ? 'এজলাসে উত্থাপন' : 'Open in Bench'}
                          </Link>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Quick Inspection Modal */}
      {inspectItem && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className={`bg-white dark:bg-slate-900 w-full max-w-xl rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden ${isBn ? 'font-bengali' : 'font-sans'}`}>
            <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/40">
              <div className="flex items-center gap-2">
                <Landmark size={18} className="text-indigo-700 dark:text-indigo-400" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  {inspectItem.type === 'SALE'
                    ? (isBn ? 'প্রাক-রেজিস্ট্রেশন নথি সারসংক্ষেপ' : 'Pre-Registration File Summary')
                    : (isBn ? 'ই-নামজারি মিস কেস সারসংক্ষেপ' : 'E-Mutation File Summary')}
                </h3>
              </div>
              <button
                onClick={() => setInspectItem(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto text-xs">
              <div className="bg-indigo-50/50 dark:bg-indigo-950/30 p-3 rounded-xl border border-indigo-100 dark:border-indigo-900/50 flex justify-between items-center">
                <div>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 block">
                    {isBn ? 'নথি সনাক্তকারী নম্বর' : 'File Identifier'}
                  </span>
                  <span className="text-sm font-bold font-mono text-indigo-900 dark:text-indigo-300">
                    {inspectItem.type === 'SALE'
                      ? inspectItem.data.application_no
                      : inspectItem.data.mutation_case_no || 'MUT-AC-2026-001'}
                  </span>
                </div>
                <StatusBadge stage={inspectItem.data.stage || inspectItem.data.status} />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-800">
                  <span className="text-slate-400 text-[10px] block">{isBn ? 'মৌজা ও এলাকা' : 'Mouza & Area'}</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    {isBn
                      ? (inspectItem.data.parcel?.mouza_bn || inspectItem.data.mouza_bn || inspectItem.data.parcel?.mouza || 'বাড্ডা')
                      : (inspectItem.data.parcel?.mouza_en || inspectItem.data.mouza_en || 'Badda')}
                  </span>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-800">
                  <span className="text-slate-400 text-[10px] block">{isBn ? 'খতিয়ান ও দাগ নং' : 'Khatian & Dag No'}</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    {isBn
                      ? `খতিয়ান: ${inspectItem.data.parcel?.khatian_no || inspectItem.data.khatian_no || '১২০৪'}, দাগ: ${inspectItem.data.parcel?.dag_no || inspectItem.data.dag_no || '৪০৫'}`
                      : `Khatian: ${inspectItem.data.parcel?.khatian_no || inspectItem.data.khatian_no || '1204'}, Dag: ${inspectItem.data.parcel?.dag_no || inspectItem.data.dag_no || '405'}`}
                  </span>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-800">
                  <span className="text-slate-400 text-[10px] block">{isBn ? 'জমি ও হিস্যার পরিমাণ' : 'Land Area'}</span>
                  <span className="font-bold text-indigo-700 dark:text-indigo-300">
                    {inspectItem.data.proposed_area_decimal || inspectItem.data.transferred_area_decimal || '2.5'} {isBn ? 'শতক' : 'dec'}
                  </span>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-800">
                  <span className="text-slate-400 text-[10px] block">{isBn ? 'ইউনিয়ন সরেজমিন তদন্ত' : 'Union Field Report'}</span>
                  <span className="font-bold text-emerald-700 dark:text-emerald-300 flex items-center gap-1">
                    <CheckCircle2 size={12} />
                    {isBn ? 'তদন্ত সম্পন্ন ও সত্যায়িত' : 'Verified & Approved'}
                  </span>
                </div>
              </div>

              {inspectItem.type === 'SALE' && (
                <div className="space-y-2 border-t border-slate-100 dark:border-slate-800 pt-3">
                  <p className="font-bold text-slate-800 dark:text-slate-200">{isBn ? 'পক্ষগণের বিবরণ:' : 'Parties Details:'}</p>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-2.5 bg-slate-50 dark:bg-slate-800/40 rounded border border-slate-200 dark:border-slate-800">
                      <span className="text-[10px] text-slate-400 block">{isBn ? 'বিক্রেতা:' : 'Seller:'}</span>
                      <p className="font-bold text-slate-800 dark:text-slate-200">
                        {isBn ? (inspectItem.data.seller?.name_bn || 'মো: রফিকুল ইসলাম') : (inspectItem.data.seller?.name_en || 'Md. Rafiqul Islam')}
                      </p>
                      <p className="text-[10px] text-slate-400">
                        NID: {inspectItem.data.seller?.nid_no || '19852692475187632'}
                      </p>
                    </div>
                    <div className="p-2.5 bg-slate-50 dark:bg-slate-800/40 rounded border border-slate-200 dark:border-slate-800">
                      <span className="text-[10px] text-slate-400 block">{isBn ? 'ক্রেতা:' : 'Buyer:'}</span>
                      <p className="font-bold text-indigo-900 dark:text-indigo-300">
                        {isBn ? (inspectItem.data.buyer?.name_bn || 'মোসা: তানিয়া আক্তার') : (inspectItem.data.buyer?.name_en || 'Tania Akter')}
                      </p>
                      <p className="text-[10px] text-slate-400">
                        NID: {inspectItem.data.buyer?.nid_no || '19892692475187890'}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex items-center justify-end gap-2">
              <button
                onClick={() => setInspectItem(null)}
                className="px-4 py-1.5 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition text-xs font-semibold"
              >
                {isBn ? 'বন্ধ করুন' : 'Close'}
              </button>
              <Link
                to={
                  inspectItem.type === 'SALE'
                    ? `/office/ac-land/applications/${inspectItem.data.id}`
                    : '/office/ac-land/mutation'
                }
                className="px-4 py-1.5 bg-indigo-700 hover:bg-indigo-800 text-white rounded-lg transition text-xs font-bold flex items-center gap-1.5"
              >
                <span>{isBn ? 'নথি পর্যালোচনা এজলাসে প্রবেশ' : 'Open in Bench Review'}</span>
                <ArrowRight size={13} />
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AcLandDashboard;

