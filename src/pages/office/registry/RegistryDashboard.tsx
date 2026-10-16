import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../../services/api';
import { SaleApplication } from '../../../types';
import { StatusBadge } from '../../../components/common/StatusBadge';
import {
  Stamp,
  Calendar,
  CheckCircle2,
  Clock,
  ArrowRight,
  Search,
  Eye,
  RefreshCw,
  FolderCheck,
  FileText,
  AlertTriangle,
  UserCheck
} from 'lucide-react';

export const RegistryDashboard: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'READY' | 'SCHEDULED' | 'COMPLETED'>('READY');
  const [searchQuery, setSearchQuery] = useState('');

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
  const completedRecords: SaleApplication[] = data?.completed_records || [];

  const filterList = (list: SaleApplication[]) => {
    const q = searchQuery.toLowerCase();
    return list.filter((app) =>
      (app.application_no || '').toLowerCase().includes(q) ||
      (app.seller?.name_bn || '').toLowerCase().includes(q) ||
      (app.buyer?.name_bn || '').toLowerCase().includes(q) ||
      (app.parcel?.khatian_no || '').toLowerCase().includes(q) ||
      (app.parcel?.dag_no || '').toLowerCase().includes(q)
    );
  };

  return (
    <div className="space-y-6 font-bengali">
      {/* Top Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-amber-700 mb-2">
            <span className="text-xs font-semibold text-slate-500">শিডিউলিং অপেক্ষমাণ</span>
            <Clock size={18} />
          </div>
          <p className="text-2xl font-bold text-slate-900 font-mono">{stats.ready_for_scheduling_count}</p>
          <span className="text-[10px] text-amber-700 font-medium">এসি ল্যান্ড অনুমোদিত ফাইল</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-blue-700 mb-2">
            <span className="text-xs font-semibold text-slate-500">অ্যাপয়েন্টমেন্ট নির্ধারিত</span>
            <Calendar size={18} />
          </div>
          <p className="text-2xl font-bold text-slate-900 font-mono">{stats.appointments_scheduled_count}</p>
          <span className="text-[10px] text-blue-700 font-medium">দলিল সম্পাদন তারিখ ধার্য</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-emerald-700 mb-2">
            <span className="text-xs font-semibold text-slate-500">নিবন্ধিত কবলা দলিল</span>
            <CheckCircle2 size={18} />
          </div>
          <p className="text-2xl font-bold text-slate-900 font-mono">{stats.completed_registrations_count}</p>
          <span className="text-[10px] text-emerald-700 font-medium">বালামভুক্ত ও নামজারিতে প্রেরিত</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-700 mb-2">
            <span className="text-xs font-semibold text-slate-500">মোট নিবন্ধিত নথি</span>
            <Stamp size={18} />
          </div>
          <p className="text-2xl font-bold text-slate-900 font-mono">{stats.total_cases}</p>
          <span className="text-[10px] text-slate-500 font-medium">নিবন্ধন কমপ্লেক্স গুলশান</span>
        </div>
      </div>

      {/* Main Table Container */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        {/* Navigation Tabs & Search */}
        <div className="p-4 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('READY')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition ${
                activeTab === 'READY'
                  ? 'bg-amber-700 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <Clock size={14} />
              তারিখ নির্ধারণের অপেক্ষমাণ ({readyQueue.length})
            </button>

            <button
              onClick={() => setActiveTab('SCHEDULED')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition ${
                activeTab === 'SCHEDULED'
                  ? 'bg-amber-700 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <Calendar size={14} />
              নির্ধারিত অ্যাপয়েন্টমেন্ট ({scheduledQueue.length})
            </button>

            <button
              onClick={() => setActiveTab('COMPLETED')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition ${
                activeTab === 'COMPLETED'
                  ? 'bg-amber-700 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <CheckCircle2 size={14} />
              নিবন্ধিত বালাম ({completedRecords.length})
            </button>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <Search size={15} className="absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="আবেদন নং, নাম বা দাগ..."
                className="pl-9 pr-3 py-1.5 border border-slate-300 rounded-lg text-xs w-56 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
            <button
              onClick={loadData}
              className="p-1.5 border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-50 transition"
              title="রিফ্রেশ করুন"
            >
              <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
            </button>
          </div>
        </div>

        {/* Tab 1: Ready for Scheduling */}
        {activeTab === 'READY' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
                  <th className="py-3 px-4">আবেদন নম্বর</th>
                  <th className="py-3 px-4">পক্ষগণ (বিক্রেতা ও ক্রেতা)</th>
                  <th className="py-3 px-4">জমির তপশিল ও মৌজা</th>
                  <th className="py-3 px-4">বিক্রয়কৃত পরিমাণ</th>
                  <th className="py-3 px-4">এসি ল্যান্ড ছাড়পত্র স্থিতি</th>
                  <th className="py-3 px-4 text-right">কার্যক্রম</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-500">
                      <Clock size={18} className="animate-spin inline-block mr-2" />
                      নথি লোড হচ্ছে...
                    </td>
                  </tr>
                ) : filterList(readyQueue).length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-500">
                      বর্তমানে শিডিউলিং এর জন্য কোন অপেক্ষমাণ নথি নেই।
                    </td>
                  </tr>
                ) : (
                  filterList(readyQueue).map((app) => (
                    <tr key={app.id} className="hover:bg-slate-50/70 transition">
                      <td className="py-3 px-4">
                        <span className="font-mono font-bold text-amber-900 block">{app.application_no}</span>
                        <span className="text-[11px] text-slate-400">{app.submission_date || '২০২৬-০৩-১৫'}</span>
                      </td>
                      <td className="py-3 px-4">
                        <p><span className="text-slate-400">বি:</span> <span className="font-semibold text-slate-800">{app.seller?.name_bn}</span></p>
                        <p><span className="text-slate-400">ক্র:</span> <span className="font-semibold text-amber-950">{app.buyer?.name_bn}</span></p>
                      </td>
                      <td className="py-3 px-4 text-slate-700">
                        <span>{app.parcel?.mouza_bn}</span>
                        <span className="block text-[11px] text-slate-400">খতিয়ান: {app.parcel?.khatian_no}, দাগ: {app.parcel?.dag_no}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-bold text-slate-900 block">{app.proposed_area_decimal} শতক</span>
                        <span className="text-[11px] text-slate-500">হিস্যা: {app.proposed_share}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          <CheckCircle2 size={12} />
                          এসি ল্যান্ড অনুমোদিত
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <Link
                          to={`/office/registry/applications/${app.id}`}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-700 hover:bg-amber-800 text-white font-bold rounded-lg transition"
                        >
                          <Calendar size={13} />
                          তারিখ নির্ধারণ করুন
                        </Link>
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
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
                  <th className="py-3 px-4">আবেদন ও টোকেন নং</th>
                  <th className="py-3 px-4">নির্ধারিত তারিখ ও সময়</th>
                  <th className="py-3 px-4">পক্ষগণ (হাজিরা)</th>
                  <th className="py-3 px-4">তপশিল ও পরিমাণ</th>
                  <th className="py-3 px-4">সাব-রেজিস্ট্রি বুথ</th>
                  <th className="py-3 px-4 text-right">দলিল সম্পাদন</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filterList(scheduledQueue).length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-500">
                      কোন নির্ধারিত অ্যাপয়েন্টমেন্ট পাওয়া যায়নি।
                    </td>
                  </tr>
                ) : (
                  filterList(scheduledQueue).map((app) => (
                    <tr key={app.id} className="hover:bg-slate-50/70 transition">
                      <td className="py-3 px-4">
                        <span className="font-mono font-bold text-slate-900 block">{app.application_no}</span>
                        <span className="text-[11px] font-mono text-blue-700 font-semibold bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200">
                          টোকেন: {app.appointment_details?.token_no || 'TOK-8812'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-bold text-blue-900 block flex items-center gap-1">
                          <Calendar size={13} />
                          {app.appointment_details?.date || '২০২৬-০৩-২০'}
                        </span>
                        <span className="text-[11px] text-slate-500">
                          সময়: {app.appointment_details?.time || 'সকাল ১১:০০ মি.'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <p><span className="text-slate-400">বি:</span> <span className="font-semibold text-slate-800">{app.seller?.name_bn}</span></p>
                        <p><span className="text-slate-400">ক্র:</span> <span className="font-semibold text-amber-950">{app.buyer?.name_bn}</span></p>
                      </td>
                      <td className="py-3 px-4 text-slate-700">
                        <span>{app.parcel?.mouza_bn}, দাগ: {app.parcel?.dag_no}</span>
                        <span className="block text-[11px] font-semibold text-emerald-800">{app.proposed_area_decimal} শতক</span>
                      </td>
                      <td className="py-3 px-4 text-slate-600">
                        {app.appointment_details?.office_name_bn || 'গুলশান সাব-রেজিস্ট্রি কার্যালয় (বুথ-২)'}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <Link
                          to={`/office/registry/applications/${app.id}`}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-lg transition"
                        >
                          <Stamp size={13} />
                          রেজিস্ট্রি সম্পন্ন করুন
                        </Link>
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
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
                  <th className="py-3 px-4">আবেদন ও দলিল নম্বর</th>
                  <th className="py-3 px-4">পক্ষগণ</th>
                  <th className="py-3 px-4">তপশিল ও পরিমাণ</th>
                  <th className="py-3 px-4">সম্পাদনের তারিখ</th>
                  <th className="py-3 px-4">ই-নামজারি স্থিতি</th>
                  <th className="py-3 px-4 text-right">বালাম রেকর্ড</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filterList(completedRecords).length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-500">
                      কোন নিবন্ধিত দলিল বালাম রেকর্ড পাওয়া যায়নি।
                    </td>
                  </tr>
                ) : (
                  filterList(completedRecords).map((app) => (
                    <tr key={app.id} className="hover:bg-slate-50/70 transition">
                      <td className="py-3 px-4">
                        <span className="font-mono font-bold text-emerald-900 block">{app.application_no}</span>
                        <span className="text-[11px] font-mono text-slate-800 font-bold">
                          দলিল নং: {app.registration_details?.deed_no || '৩৪০৯/২০২৬'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <p className="font-semibold text-slate-800">{app.seller?.name_bn} → {app.buyer?.name_bn}</p>
                      </td>
                      <td className="py-3 px-4 text-slate-700">
                        {app.parcel?.mouza_bn}, দাগ: {app.parcel?.dag_no} ({app.proposed_area_decimal} শতক)
                      </td>
                      <td className="py-3 px-4 text-slate-600">
                        {app.registration_details?.registration_date || '২০২৬-০৩-২০'}
                      </td>
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-purple-800 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                          <CheckCircle2 size={12} />
                          নামজারিতে প্রেরিত
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <Link
                          to={`/office/registry/applications/${app.id}`}
                          className="inline-flex items-center gap-1 text-amber-800 hover:text-amber-950 font-semibold"
                        >
                          বিস্তারিত বালাম
                          <ArrowRight size={13} />
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

export default RegistryDashboard;
