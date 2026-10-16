import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import { StatusBadge } from '../../components/common/StatusBadge';
import {
  ShieldAlert,
  Users,
  UserCheck,
  FileSpreadsheet,
  CheckCircle2,
  Clock,
  ArrowRight,
  Activity,
  Building2,
  Landmark,
  Stamp,
  Scale,
  RefreshCw,
  AlertTriangle
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await api.officer.adminStats();
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
    total_citizens: 0,
    pending_kyc_count: 0,
    total_applications: 0,
    union_pending_count: 0,
    acland_pending_count: 0,
    registry_pending_count: 0,
    completed_registrations: 0,
    mutation_approved_count: 0,
    rejected_count: 0,
    returned_count: 0,
    system_status: 'HEALTHY',
  };

  const applications = data?.applications || [];
  const kycQueue = data?.kyc_queue || [];
  const auditLogs = data?.audit_logs || [];

  return (
    <div className="space-y-6 font-bengali">
      {/* Platform Health & Overview */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-slate-900">জাতীয় ভূমিসেবা সিস্টেম অপারেশনাল স্টেটাস</h2>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              সিস্টেম সচল ও সুরক্ষিত
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            সারাদেশের ভূমি অফিসসমূহের রিয়েল-টাইম ট্রানজ্যাকশন ও এনআইডি কেওয়াইসি পর্যবেক্ষণ
          </p>
        </div>

        <button
          onClick={loadData}
          className="p-2 border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-50 transition self-start sm:self-auto flex items-center gap-1.5 text-xs font-semibold"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          রিফ্রেশ
        </button>
      </div>

      {/* Stats Tiles */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-cyan-700 mb-2">
            <span className="text-xs font-semibold text-slate-500">নিবন্ধিত নাগরিক</span>
            <Users size={18} />
          </div>
          <p className="text-2xl font-bold text-slate-900 font-mono">{stats.total_citizens}</p>
          <span className="text-[10px] text-cyan-700 font-medium">স্মার্ট ভূমিসেবা গ্রাহক</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-amber-600 mb-2">
            <span className="text-xs font-semibold text-slate-500">অপেক্ষমাণ কেওয়াইসি</span>
            <UserCheck size={18} />
          </div>
          <p className="text-2xl font-bold text-slate-900 font-mono">{stats.pending_kyc_count}</p>
          <Link to="/admin/users" className="text-[10px] text-amber-600 font-bold hover:underline">
            যাচাই ও অনুমোদন করুন →
          </Link>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-indigo-700 mb-2">
            <span className="text-xs font-semibold text-slate-500">মোট বিক্রয় আবেদন</span>
            <FileSpreadsheet size={18} />
          </div>
          <p className="text-2xl font-bold text-slate-900 font-mono">{stats.total_applications}</p>
          <span className="text-[10px] text-indigo-700 font-medium">সার্বজনীন পাইপলাইন</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-emerald-700 mb-2">
            <span className="text-xs font-semibold text-slate-500">সম্পন্ন নামজারি খতিয়ান</span>
            <CheckCircle2 size={18} />
          </div>
          <p className="text-2xl font-bold text-slate-900 font-mono">{stats.mutation_approved_count}</p>
          <span className="text-[10px] text-emerald-700 font-medium">স্বত্ব চূড়ান্তভাবে নামান্তরিত</span>
        </div>
      </div>

      {/* Office Funnel Breakdown */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-5">
        <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
          <Building2 size={16} className="text-cyan-700" />
          দপ্তরভিত্তিক আবেদন বণ্টন ও প্রবাহ (Office Workflow Pipeline)
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200">
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-emerald-950">১. ইউনিয়ন ভূমি অফিস</span>
              <Building2 size={16} className="text-emerald-700" />
            </div>
            <p className="text-2xl font-bold font-mono text-emerald-900">{stats.union_pending_count}</p>
            <p className="text-[11px] text-slate-500 mt-1">স্থানীয় দখল ও খাজনা যাচাই অপেক্ষমাণ</p>
          </div>

          <div className="p-4 rounded-xl bg-indigo-50/70 border border-indigo-200">
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-indigo-950">২. এসি ল্যান্ড (প্রাক-রেজিস্ট্রি)</span>
              <Landmark size={16} className="text-indigo-700" />
            </div>
            <p className="text-2xl font-bold font-mono text-indigo-900">{stats.acland_pending_count}</p>
            <p className="text-[11px] text-slate-500 mt-1">হিস্যা ও আইনি ছাড়পত্র প্রক্রিয়াধীন</p>
          </div>

          <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200">
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-amber-950">৩. সাব-রেজিস্ট্রি অফিস</span>
              <Stamp size={16} className="text-amber-700" />
            </div>
            <p className="text-2xl font-bold font-mono text-amber-900">{stats.registry_pending_count}</p>
            <p className="text-[11px] text-slate-500 mt-1">অ্যাপয়েন্টমেন্ট ও দলিল সম্পাদন কিউ</p>
          </div>

          <div className="p-4 rounded-xl bg-purple-50/70 border border-purple-200">
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-purple-950">৪. এসি ল্যান্ড (ই-নামজারি)</span>
              <Scale size={16} className="text-purple-700" />
            </div>
            <p className="text-2xl font-bold font-mono text-purple-900">{stats.mutation_approved_count}</p>
            <p className="text-[11px] text-slate-500 mt-1">শুনানি ও চূড়ান্ত খতিয়ান সৃজন</p>
          </div>
        </div>
      </div>

      {/* Split: Recent Applications Oversight & Pending KYC */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Applications Oversight (2 cols) */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-2xs p-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <FileSpreadsheet size={16} className="text-cyan-700" />
              সাম্প্রতিক লেনদেন আবেদন ও দায়িত্বশীল দপ্তর
            </h3>
            <Link to="/admin/applications" className="text-xs text-cyan-700 hover:text-cyan-900 font-bold">
              সব দেখুন →
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
                  <th className="py-2.5 px-3">আবেদন নং</th>
                  <th className="py-2.5 px-3">পক্ষগণ</th>
                  <th className="py-2.5 px-3">তপশিল ও পরিমাণ</th>
                  <th className="py-2.5 px-3">বর্তমান অবস্থা</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {applications.slice(0, 5).map((app: any) => (
                  <tr key={app.id} className="hover:bg-slate-50/70">
                    <td className="py-2.5 px-3 font-mono font-bold text-slate-900">
                      {app.application_no}
                    </td>
                    <td className="py-2.5 px-3">
                      {app.seller?.name_bn} → {app.buyer?.name_bn}
                    </td>
                    <td className="py-2.5 px-3 text-slate-600">
                      {app.parcel?.mouza_bn}, দাগ: {app.parcel?.dag_no} ({app.proposed_area_decimal} শতক)
                    </td>
                    <td className="py-2.5 px-3">
                      <StatusBadge status={app.stage} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pending KYC Approval (1 col) */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <UserCheck size={16} className="text-amber-600" />
              কেওয়াইসি ভেরিফিকেশন কিউ ({kycQueue.length})
            </h3>
            <Link to="/admin/users" className="text-xs text-amber-600 hover:text-amber-800 font-bold">
              সম্পূর্ণ তালিকা →
            </Link>
          </div>

          <div className="space-y-3">
            {kycQueue.length === 0 ? (
              <p className="text-xs text-slate-500 py-4 text-center">কোন অপেক্ষমাণ কেওয়াইসি নেই।</p>
            ) : (
              kycQueue.slice(0, 4).map((user: any) => (
                <div key={user.id} className="p-3 rounded-lg border border-slate-200 bg-slate-50/60 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">{user.name_bn || user.name}</span>
                    <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded">
                      যাচাই অপেক্ষমাণ
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500">এনআইডি: {user.nid || 'যাচাইযোগ্য'}</p>
                  <p className="text-[11px] text-slate-500">ইমেইল: {user.email}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
