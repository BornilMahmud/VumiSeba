import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../../services/api';
import { SaleApplication } from '../../../types';
import { StatusBadge } from '../../../components/common/StatusBadge';
import { useLanguage } from '../../../context/LanguageContext';
import { formatName, formatMouza, formatPlot, formatKhatian, formatArea, toEnglishDigits } from '../../../utils/bilingual';
import {
  Stamp,
  Calendar,
  CheckCircle2,
  Clock,
  ArrowRight,
  Search,
  Eye,
  RefreshCw,
  UserCheck
} from 'lucide-react';

export const RegistryDashboard: React.FC = () => {
  const { language } = useLanguage();
  const isBn = language === 'bn';

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'READY' | 'SCHEDULED' | 'COMPLETED'>('READY');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMouza, setSelectedMouza] = useState<string>('ALL');
  const [inspectItem, setInspectItem] = useState<SaleApplication | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await api.officer.registryQueue();
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
    ready_for_scheduling_count: 0,
    appointments_scheduled_count: 0,
    awaiting_completion_count: 0,
    completed_registrations_count: 0,
    total_cases: 0,
  };

  const readyQueue: SaleApplication[] = data?.ready_queue || [];
  const scheduledQueue: SaleApplication[] = data?.scheduled_queue || [];
  const completedRecords: SaleApplication[] = data?.completed_queue || data?.completed_records || [];

  const filterList = (list: SaleApplication[]) => {
    const q = searchQuery.toLowerCase();
    return list.filter((app) => {
      const mouza = app.parcel?.mouza_bn || app.parcel?.mouza || app.parcel?.mouza_en || '';
      const mouzaMatch = selectedMouza === 'ALL' || mouza.includes(selectedMouza);
      const searchMatch =
        (app.application_no || '').toLowerCase().includes(q) ||
        (app.seller?.name_bn || '').toLowerCase().includes(q) ||
        (app.seller?.name_en || '').toLowerCase().includes(q) ||
        (app.buyer?.name_bn || '').toLowerCase().includes(q) ||
        (app.buyer?.name_en || '').toLowerCase().includes(q) ||
        (app.parcel?.khatian_no || '').toLowerCase().includes(q) ||
        (app.parcel?.dag_no || '').toLowerCase().includes(q) ||
        (app.appointment_details?.token_no || '').toLowerCase().includes(q) ||
        (app.registration_details?.deed_no || '').toLowerCase().includes(q) ||
        mouza.toLowerCase().includes(q);
      return mouzaMatch && searchMatch;
    });
  };

  return (
    <div className={`space-y-6 ${isBn ? 'font-bengali' : 'font-sans'}`}>
      {/* Top Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs transition-colors">
          <div className="flex items-center justify-between text-amber-700 dark:text-amber-400 mb-2">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              {isBn ? 'শিডিউলিং অপেক্ষমাণ' : 'Pending Scheduling'}
            </span>
            <Clock size={18} />
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white font-mono">{stats.ready_for_scheduling_count}</p>
          <span className="text-[10px] text-amber-700 dark:text-amber-400 font-medium">
            {isBn ? 'এসি ল্যান্ড অনুমোদিত ফাইল' : 'Approved by AC Land'}
          </span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs transition-colors">
          <div className="flex items-center justify-between text-blue-700 dark:text-blue-400 mb-2">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              {isBn ? 'অ্যাপয়েন্টমেন্ট নির্ধারিত' : 'Appointments Scheduled'}
            </span>
            <Calendar size={18} />
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white font-mono">{stats.appointments_scheduled_count}</p>
          <span className="text-[10px] text-blue-700 dark:text-blue-400 font-medium">
            {isBn ? 'দলিল সম্পাদন তারিখ ধার্য' : 'Execution Date Set'}
          </span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs transition-colors">
          <div className="flex items-center justify-between text-emerald-700 dark:text-emerald-400 mb-2">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              {isBn ? 'নিবন্ধিত কবলা দলিল' : 'Registered Deeds'}
            </span>
            <CheckCircle2 size={18} />
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white font-mono">{stats.completed_registrations_count}</p>
          <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-medium">
            {isBn ? 'বালামভুক্ত ও নামজারিতে প্রেরিত' : 'Enrolled & Sent to Mutation'}
          </span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs transition-colors">
          <div className="flex items-center justify-between text-slate-700 dark:text-slate-400 mb-2">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              {isBn ? 'মোট নিবন্ধিত নথি' : 'Total Registered Files'}
            </span>
            <Stamp size={18} />
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white font-mono">{stats.total_cases}</p>
          <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
            {isBn ? 'নিবন্ধন কমপ্লেক্স গুলশান' : 'Gulshan Registry Office'}
          </span>
        </div>
      </div>

      {/* Main Table Container */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs overflow-hidden transition-colors">
        {/* Navigation Tabs & Search */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setActiveTab('READY')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition ${
                activeTab === 'READY'
                  ? 'bg-amber-700 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              <Clock size={14} />
              {isBn ? `তারিখ নির্ধারণের অপেক্ষমাণ (${filterList(readyQueue).length})` : `Pending Schedule (${filterList(readyQueue).length})`}
            </button>

            <button
              onClick={() => setActiveTab('SCHEDULED')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition ${
                activeTab === 'SCHEDULED'
                  ? 'bg-amber-700 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              <Calendar size={14} />
              {isBn ? `নির্ধারিত অ্যাপয়েন্টমেন্ট (${filterList(scheduledQueue).length})` : `Scheduled Appointments (${filterList(scheduledQueue).length})`}
            </button>

            <button
              onClick={() => setActiveTab('COMPLETED')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition ${
                activeTab === 'COMPLETED'
                  ? 'bg-amber-700 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              <CheckCircle2 size={14} />
              {isBn ? `নিবন্ধিত বালাম (${filterList(completedRecords).length})` : `Completed Deeds (${filterList(completedRecords).length})`}
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
                      ? 'bg-white dark:bg-slate-700 text-amber-700 dark:text-amber-300 font-bold shadow-2xs'
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
                placeholder={isBn ? 'আবেদন নং, নাম বা দাগ...' : 'Search application no, name or dag...'}
                className="pl-9 pr-3 py-1.5 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-lg text-xs w-52 focus:outline-none focus:ring-2 focus:ring-amber-500"
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

        {/* Tab 1: Ready for Scheduling */}
        {activeTab === 'READY' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs whitespace-nowrap">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-bold whitespace-nowrap">
                  <th className="py-3.5 px-4 whitespace-nowrap">{isBn ? 'আবেদন নম্বর' : 'Application No'}</th>
                  <th className="py-3.5 px-4 whitespace-nowrap">{isBn ? 'পক্ষগণ (বিক্রেতা ও ক্রেতা)' : 'Parties (Seller & Buyer)'}</th>
                  <th className="py-3.5 px-4 whitespace-nowrap">{isBn ? 'জমির তপশিল ও মৌজা' : 'Land Schedule & Mouza'}</th>
                  <th className="py-3.5 px-4 whitespace-nowrap">{isBn ? 'বিক্রয়কৃত পরিমাণ' : 'Sold Area'}</th>
                  <th className="py-3.5 px-4 whitespace-nowrap">{isBn ? 'এসি ল্যান্ড ছাড়পত্র স্থিতি' : 'AC Land Clearance'}</th>
                  <th className="py-3.5 px-4 text-right whitespace-nowrap">{isBn ? 'কার্যক্রম' : 'Action'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-500 dark:text-slate-400 whitespace-nowrap">
                      <Clock size={18} className="animate-spin inline-block mr-2" />
                      {isBn ? 'নথি লোড হচ্ছে...' : 'Loading records...'}
                    </td>
                  </tr>
                ) : filterList(readyQueue).length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-500 dark:text-slate-400 whitespace-nowrap">
                      {isBn ? 'বর্তমানে শিডিউলিং এর জন্য কোন অপেক্ষমাণ নথি নেই।' : 'No files awaiting scheduling.'}
                    </td>
                  </tr>
                ) : (
                  filterList(readyQueue).map((app) => (
                    <tr key={app.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/60 transition whitespace-nowrap">
                      <td className="py-3 px-4 font-mono font-bold text-amber-900 dark:text-amber-300 whitespace-nowrap">
                        {app.application_no}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className="font-semibold text-slate-800 dark:text-slate-200">
                          {isBn ? 'বি: ' : 'S: '}{formatName(app.seller, isBn, 'Md. Rafiqul Islam')}
                        </span>
                        <span className="text-slate-400 mx-1.5">→</span>
                        <span className="font-semibold text-amber-950 dark:text-amber-400">
                          {isBn ? 'ক্র: ' : 'B: '}{formatName(app.buyer, isBn, 'Tania Akter')}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-700 dark:text-slate-300 whitespace-nowrap">
                        <span className="font-medium text-slate-900 dark:text-white">
                          {formatMouza(app.parcel, isBn)}
                        </span>
                        <span className="text-slate-400 mx-1">·</span>
                        <span className="text-xs text-slate-500 dark:text-slate-400">
                          {formatKhatian(app.parcel?.khatian_no, isBn)}, {formatPlot(app.parcel?.dag_no, isBn)}
                        </span>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap font-mono">
                        <span className="font-bold text-slate-900 dark:text-white">{formatArea(app.proposed_area_decimal || '2.5', isBn, true)}</span>
                        <span className="text-slate-400 mx-1 font-sans">·</span>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400 font-sans">
                          {isBn ? `হিস্যা: ${app.proposed_share || '০.১৫০০'}` : `Share: ${toEnglishDigits(app.proposed_share || '0.1500')}`}
                        </span>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-md border border-emerald-200 dark:border-emerald-800 whitespace-nowrap shrink-0">
                          <CheckCircle2 size={12} />
                          {isBn ? 'এসি ল্যান্ড অনুমোদিত' : 'AC Land Cleared'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right whitespace-nowrap min-w-[200px]">
                        <div className="flex items-center justify-end gap-2 whitespace-nowrap flex-nowrap shrink-0">
                          <button
                            type="button"
                            onClick={() => setInspectItem(app)}
                            className="p-1.5 text-slate-600 dark:text-slate-300 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition whitespace-nowrap shrink-0 cursor-pointer"
                            title={isBn ? 'সারসংক্ষেপ ও বায়োমেট্রিক' : 'Preview & Biometric'}
                          >
                            <Eye size={14} />
                          </button>
                          <Link
                            to={`/office/registry/applications/${app.id}`}
                            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-amber-700 hover:bg-amber-800 text-white font-bold rounded-lg transition whitespace-nowrap shrink-0"
                          >
                            <Calendar size={13} />
                            <span>{isBn ? 'তারিখ নির্ধারণ' : 'Set Date'}</span>
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

        {/* Tab 2: Scheduled Appointments */}
        {activeTab === 'SCHEDULED' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs whitespace-nowrap">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-bold whitespace-nowrap">
                  <th className="py-3 px-4 whitespace-nowrap">{isBn ? 'আবেদন ও টোকেন নং' : 'Application & Token No'}</th>
                  <th className="py-3 px-4 whitespace-nowrap">{isBn ? 'নির্ধারিত তারিখ ও সময়' : 'Scheduled Date & Time'}</th>
                  <th className="py-3 px-4 whitespace-nowrap">{isBn ? 'পক্ষগণ (হাজিরা)' : 'Parties (Attendance)'}</th>
                  <th className="py-3 px-4 whitespace-nowrap">{isBn ? 'তপশিল ও পরিমাণ' : 'Land Schedule & Area'}</th>
                  <th className="py-3 px-4 whitespace-nowrap">{isBn ? 'সাব-রেজিস্ট্রি বুথ' : 'Registry Booth'}</th>
                  <th className="py-3 px-4 text-right whitespace-nowrap">{isBn ? 'দলিল সম্পাদন' : 'Deed Execution'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filterList(scheduledQueue).length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-500 dark:text-slate-400 whitespace-nowrap">
                      {isBn ? 'কোন নির্ধারিত অ্যাপয়েন্টমেন্ট পাওয়া যায়নি।' : 'No scheduled appointments found.'}
                    </td>
                  </tr>
                ) : (
                  filterList(scheduledQueue).map((app) => (
                    <tr key={app.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/60 transition whitespace-nowrap">
                      <td className="py-3 px-4 font-mono font-bold text-slate-900 dark:text-white whitespace-nowrap">
                        {app.application_no}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className="font-bold text-blue-900 dark:text-blue-300 inline-flex items-center gap-1 whitespace-nowrap">
                          <Calendar size={13} className="shrink-0" />
                          {app.appointment_details?.date || '2026-03-20'}
                        </span>
                        <span className="text-slate-400 mx-1">·</span>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400 whitespace-nowrap">
                          {app.appointment_details?.time || (isBn ? 'সকাল ১১:০০ মি.' : '11:00 AM')}
                        </span>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className="font-semibold text-slate-800 dark:text-slate-200">
                          {isBn ? 'বি: ' : 'S: '}{isBn ? (app.seller?.name_bn || 'মোঃ রফিকুল ইসলাম') : (app.seller?.name_en || 'Md. Rafiqul Islam')}
                        </span>
                        <span className="text-slate-400 mx-1.5">→</span>
                        <span className="font-semibold text-amber-950 dark:text-amber-400">
                          {isBn ? 'ক্র: ' : 'B: '}{isBn ? (app.buyer?.name_bn || 'মোসা: তানিয়া আক্তার') : (app.buyer?.name_en || 'Tania Akter')}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-700 dark:text-slate-300 whitespace-nowrap">
                        <span>
                          {isBn ? (app.parcel?.mouza_bn || app.parcel?.mouza || 'বাড্ডা') : (app.parcel?.mouza_en || 'Badda')},{' '}
                          {isBn ? `দাগ ${app.parcel?.dag_no || '৪০৫'}` : `Dag ${app.parcel?.dag_no || '405'}`}
                        </span>
                        <span className="text-slate-400 mx-1">·</span>
                        <span className="font-semibold text-emerald-800 dark:text-emerald-400 font-mono">
                          {app.proposed_area_decimal || '2.5'} {isBn ? 'শতক' : 'dec'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-600 dark:text-slate-400 whitespace-nowrap">
                        {isBn
                          ? (app.appointment_details?.office_name_bn || 'গুলশান সাব-রেজিস্ট্রি কার্যালয় (বুথ-২)')
                          : (app.appointment_details?.office_name_en || 'Gulshan Sub-Registry Office (Booth-2)')}
                      </td>
                      <td className="py-3 px-4 text-right whitespace-nowrap min-w-[190px]">
                        <div className="flex items-center justify-end gap-2 whitespace-nowrap flex-nowrap shrink-0">
                          <button
                            onClick={() => setInspectItem(app)}
                            className="p-1.5 text-slate-600 dark:text-slate-300 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition whitespace-nowrap shrink-0 cursor-pointer"
                            title={isBn ? 'বায়োমেট্রিক ও ই-স্ট্যাম্প প্রিভিউ' : 'Biometric & E-Stamp Preview'}
                          >
                            <Eye size={14} />
                          </button>
                          <Link
                            to={`/office/registry/applications/${app.id}`}
                            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-lg transition whitespace-nowrap shrink-0"
                          >
                            <Stamp size={13} className="shrink-0" />
                            <span>{isBn ? 'রেজিস্ট্রি সম্পন্ন' : 'Complete Registry'}</span>
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

        {/* Tab 3: Completed Records */}
        {activeTab === 'COMPLETED' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs whitespace-nowrap">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-bold whitespace-nowrap">
                  <th className="py-3 px-4 whitespace-nowrap">{isBn ? 'আবেদন ও দলিল নম্বর' : 'Application & Deed No'}</th>
                  <th className="py-3 px-4 whitespace-nowrap">{isBn ? 'পক্ষগণ' : 'Parties'}</th>
                  <th className="py-3 px-4 whitespace-nowrap">{isBn ? 'তপশিল ও পরিমাণ' : 'Land Schedule & Area'}</th>
                  <th className="py-3 px-4 whitespace-nowrap">{isBn ? 'সম্পাদনের তারিখ' : 'Registration Date'}</th>
                  <th className="py-3 px-4 whitespace-nowrap">{isBn ? 'ই-নামজারি স্থিতি' : 'E-Mutation Status'}</th>
                  <th className="py-3 px-4 text-right whitespace-nowrap">{isBn ? 'বালাম রেকর্ড' : 'Balam Record'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filterList(completedRecords).length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-500 dark:text-slate-400 whitespace-nowrap">
                      {isBn ? 'কোন নিবন্ধিত দলিল বালাম রেকর্ড পাওয়া যায়নি।' : 'No registered deeds found in balam.'}
                    </td>
                  </tr>
                ) : (
                  filterList(completedRecords).map((app) => (
                    <tr key={app.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/60 transition">
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className="font-mono font-bold text-emerald-900 dark:text-emerald-300 block">{app.application_no}</span>
                        <span className="text-[11px] font-mono text-slate-800 dark:text-slate-200 font-bold">
                          {isBn ? 'দলিল নং: ' : 'Deed No: '}{app.registration_details?.deed_no || '3409/2026'}
                        </span>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <p className="font-semibold text-slate-800 dark:text-slate-200">
                          {isBn ? (app.seller?.name_bn || 'মোঃ রফিকুল ইসলাম') : (app.seller?.name_en || 'Md. Rafiqul Islam')} →{' '}
                          {isBn ? (app.buyer?.name_bn || 'মোসা: তানিয়া আক্তার') : (app.buyer?.name_en || 'Tania Akter')}
                        </p>
                      </td>
                      <td className="py-3 px-4 text-slate-700 dark:text-slate-300 whitespace-nowrap">
                        {isBn ? (app.parcel?.mouza_bn || app.parcel?.mouza || 'বাড্ডা') : (app.parcel?.mouza_en || 'Badda')},{' '}
                        {isBn ? `দাগ: ${app.parcel?.dag_no || '৪০৫'}` : `Dag: ${app.parcel?.dag_no || '405'}`} ({app.proposed_area_decimal || '2.5'} {isBn ? 'শতক' : 'dec'})
                      </td>
                      <td className="py-3 px-4 text-slate-600 dark:text-slate-400 whitespace-nowrap">
                        {app.registration_details?.registration_date || '2026-03-20'}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-purple-800 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/60 px-2 py-0.5 rounded border border-purple-200 dark:border-purple-800 whitespace-nowrap shrink-0">
                          <CheckCircle2 size={12} className="shrink-0" />
                          {isBn ? 'নামজারিতে প্রেরিত' : 'Sent to Mutation'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <div className="inline-flex items-center justify-end gap-2 whitespace-nowrap">
                          <button
                            onClick={() => setInspectItem(app)}
                            className="p-1.5 text-slate-600 dark:text-slate-300 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition whitespace-nowrap shrink-0 cursor-pointer"
                            title={isBn ? 'বালাম কপি প্রিভিউ' : 'Balam Copy Preview'}
                          >
                            <Eye size={14} />
                          </button>
                          <Link
                            to={`/office/registry/applications/${app.id}`}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-amber-800 dark:text-amber-400 hover:text-amber-950 dark:hover:text-amber-300 font-bold whitespace-nowrap shrink-0"
                          >
                            <span>{isBn ? 'বিস্তারিত বালাম' : 'View Record'}</span>
                            <ArrowRight size={13} className="shrink-0" />
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
      </div>

      {/* Quick Biometric & Deed Preview Modal */}
      {inspectItem && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className={`bg-white dark:bg-slate-900 w-full max-w-xl rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden ${isBn ? 'font-bengali' : 'font-sans'}`}>
            <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/40">
              <div className="flex items-center gap-2">
                <Stamp size={18} className="text-amber-700 dark:text-amber-400" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  {isBn ? 'সাব-রেজিস্ট্রি দলিল ও সম্পাদন সারসংক্ষেপ' : 'Sub-Registry Deed & Execution Summary'}
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
              <div className="bg-slate-50 dark:bg-[#111a30] p-3 rounded-xl border border-slate-200 dark:border-slate-700/70 flex justify-between items-center">
                <div>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 block">{isBn ? 'আবেদন ও টোকেন নং' : 'Application & Token'}</span>
                  <span className="text-sm font-bold font-mono text-amber-800 dark:text-amber-300">
                    {inspectItem.application_no} {inspectItem.appointment_details?.token_no ? `(${isBn ? 'টোকেন' : 'Token'}: ${inspectItem.appointment_details.token_no})` : ''}
                  </span>
                </div>
                <StatusBadge stage={inspectItem.stage} />
              </div>

              {/* Parties & Biometric verification */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-800 space-y-1">
                  <span className="text-slate-400 text-[10px] block">{isBn ? 'বিক্রেতা (উপস্থিতি ও বায়োমেট্রিক):' : 'Seller (Biometrics):'}</span>
                  <p className="font-bold text-slate-800 dark:text-slate-200">
                    {isBn ? (inspectItem.seller?.name_bn || 'মোঃ রফিকুল ইসলাম') : (inspectItem.seller?.name_en || 'Md. Rafiqul Islam')}
                  </p>
                  <p className="text-[10px] text-slate-400">NID: {inspectItem.seller?.nid_no || '19852692475187632'}</p>
                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-1.5 py-0.5 rounded">
                    <UserCheck size={11} />
                    {isBn ? 'ফিঙ্গারপ্রিন্ট ম্যাচড' : 'Fingerprint Matched'}
                  </span>
                </div>

                <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-800 space-y-1">
                  <span className="text-slate-400 text-[10px] block">{isBn ? 'ক্রেতা (উপস্থিতি ও বায়োমেট্রিক):' : 'Buyer (Biometrics):'}</span>
                  <p className="font-bold text-amber-950 dark:text-amber-400">
                    {isBn ? (inspectItem.buyer?.name_bn || 'মোসা: তানিয়া আক্তার') : (inspectItem.buyer?.name_en || 'Tania Akter')}
                  </p>
                  <p className="text-[10px] text-slate-400">NID: {inspectItem.buyer?.nid_no || '19892692475187890'}</p>
                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-1.5 py-0.5 rounded">
                    <UserCheck size={11} />
                    {isBn ? 'এনআইডি লাইভ ভেরিফাইড' : 'Live Verified'}
                  </span>
                </div>
              </div>

              {/* Property Details */}
              <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-800 space-y-2">
                <span className="text-slate-400 text-[10px] block font-bold">{isBn ? 'তপশিল ও রাজস্ব শুল্ক পরিশোধ:' : 'Land Schedule & Stamp Duty:'}</span>
                <div className="grid grid-cols-3 gap-2 text-[11px]">
                  <div>
                    <span className="text-slate-400 block text-[10px]">{isBn ? 'মৌজা:' : 'Mouza:'}</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">
                      {isBn ? (inspectItem.parcel?.mouza_bn || inspectItem.parcel?.mouza || 'বাড্ডা') : (inspectItem.parcel?.mouza_en || 'Badda')}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">{isBn ? 'দাগ ও খতিয়ান:' : 'Dag & Khatian:'}</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">
                      {isBn ? `দাগ ${inspectItem.parcel?.dag_no || '৪০৫'}, খতিয়ান ${inspectItem.parcel?.khatian_no || '১২০৪'}` : `Dag ${inspectItem.parcel?.dag_no || '405'}, Khatian ${inspectItem.parcel?.khatian_no || '1204'}`}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">{isBn ? 'জমির পরিমাণ:' : 'Land Area:'}</span>
                    <span className="font-bold text-amber-700 dark:text-amber-300">{inspectItem.proposed_area_decimal || '2.5'} {isBn ? 'শতক' : 'dec'}</span>
                  </div>
                </div>

                <div className="border-t border-slate-200 dark:border-slate-700 pt-2 flex items-center justify-between text-[11px]">
                  <span className="text-slate-600 dark:text-slate-400">{isBn ? 'ই-স্ট্যাম্প ও রেজিস্ট্রেশন ফি চালান:' : 'E-Stamp & Registration Fee Challan:'}</span>
                  <span className="font-mono font-bold text-emerald-700 dark:text-emerald-300 flex items-center gap-1">
                    <CheckCircle2 size={12} />
                    {isBn ? 'ই-চালান পরিশোধিত (পরিশোধ নং: CH-90821)' : 'E-Challan Paid (Challan #CH-90821)'}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex items-center justify-end gap-2">
              <button
                onClick={() => setInspectItem(null)}
                className="px-4 py-1.5 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition text-xs font-semibold"
              >
                {isBn ? 'বন্ধ করুন' : 'Close'}
              </button>
              <Link
                to={`/office/registry/applications/${inspectItem.id}`}
                className="px-4 py-1.5 bg-amber-700 hover:bg-amber-800 text-white rounded-lg transition text-xs font-bold flex items-center gap-1.5"
              >
                <span>{isBn ? 'রেজিস্ট্রি ডকেটে প্রবেশ' : 'Open in Registry Docket'}</span>
                <ArrowRight size={13} />
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RegistryDashboard;

