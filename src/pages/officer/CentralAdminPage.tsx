import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { SaleApplication, AuditLog } from '../../types';
import { StatusBadge } from '../../components/common/StatusBadge';
import { 
  ShieldAlert, 
  Users, 
  FileText, 
  Scale, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Clock, 
  Activity, 
  UserCheck, 
  CornerDownLeft,
  ChevronRight,
  TrendingUp,
  Receipt
} from 'lucide-react';

interface KycItem {
  id: string;
  userId: string;
  fullName: string;
  nidNumber: string;
  status: string;
  citizenId?: string;
  createdAt: string;
}

export default function CentralAdminPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'KYC' | 'SALES' | 'AUDIT'>('OVERVIEW');

  // Stats
  const [stats, setStats] = useState<any>(null);
  const [kycList, setKycList] = useState<KycItem[]>([]);
  const [saleApps, setSaleApps] = useState<SaleApplication[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);

  // Sale Review modal/state
  const [selectedSale, setSelectedSale] = useState<SaleApplication | null>(null);
  const [reviewReason, setReviewReason] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const loadAll = async () => {
    setLoading(true);
    try {
      const [statsRes, kycRes, salesRes, auditRes] = await Promise.all([
        api.officer.adminStats(),
        api.officer.kycQueue(),
        api.sales.list(),
        api.audit.list()
      ]);

      if (statsRes.data) setStats(statsRes.data);
      if (kycRes.data) setKycList(kycRes.data);
      if (salesRes.data) setSaleApps(salesRes.data);
      if (auditRes.data) setAuditLogs(auditRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  const handleApproveKyc = async (userId: string) => {
    setActionLoading(true);
    setMessage(null);
    try {
      const res = await api.officer.approveKyc(userId);
      if (res.error) {
        setMessage({ text: res.error, type: 'error' });
      } else {
        setMessage({ 
          text: `নাগরিক KYC অনুমোদিত! ইউনিক Citizen ID প্রদান করা হয়েছে: ${res.data?.citizenId}`, 
          type: 'success' 
        });
        loadAll();
      }
    } catch (err) {
      setMessage({ text: 'KYC অনুমোদনে ত্রুটি হয়েছে', type: 'error' });
    } finally {
      setActionLoading(false);
    }
  };

  const handleSaleAction = async (action: 'APPROVE' | 'REJECT' | 'RETURN') => {
    if (!selectedSale) return;
    setActionLoading(true);
    setMessage(null);
    try {
      const res = await api.sales.adminReview(selectedSale.id, action, reviewReason);
      if (res.error) {
        setMessage({ text: res.error, type: 'error' });
      } else {
        setMessage({ 
          text: `বিক্রয় আবেদনটি সফলভাবে ${action === 'APPROVE' ? 'অনুমোদিত' : action === 'RETURN' ? 'সংশোধনের জন্য ফেরত' : 'বাতিল'} করা হয়েছে`, 
          type: 'success' 
        });
        setSelectedSale(null);
        setReviewReason('');
        loadAll();
      }
    } catch (err) {
      setMessage({ text: 'আবেদন পর্যালোচনায় সমস্যা হয়েছে', type: 'error' });
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="p-1.5 bg-slate-900 text-teal-400 rounded-md">
                <ShieldAlert className="w-5 h-5" />
              </span>
              <h1 className="text-2xl font-bold text-slate-900">কেন্দ্রীয় প্রশাসন ও সুপারভাইজরি কন্ট্রোল</h1>
            </div>
            <p className="text-sm text-slate-500">
              জাতীয় পর্যায়ে ভূমিসেবা পর্যবেক্ষণ, নাগরিক KYC যাচাই, বিক্রয় আবেদন অনুমোদন এবং সমগ্র সিস্টেমের অডিট লগ।
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-800 rounded-lg text-xs font-semibold border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              লাইভ প্ল্যাটফর্ম মনিটর
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

      {/* Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-3">
        <button
          onClick={() => setActiveTab('OVERVIEW')}
          className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition-all ${
            activeTab === 'OVERVIEW'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Activity className="w-4 h-4" />
          সিস্টেম ওভারভিউ
        </button>

        <button
          onClick={() => setActiveTab('KYC')}
          className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition-all ${
            activeTab === 'KYC'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <UserCheck className="w-4 h-4" />
          নাগরিক KYC কিউ ({kycList.filter(k => k.status === 'PENDING').length})
        </button>

        <button
          onClick={() => setActiveTab('SALES')}
          className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition-all ${
            activeTab === 'SALES'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <FileText className="w-4 h-4" />
          বিক্রয় আবেদন অডিট ({saleApps.length})
        </button>

        <button
          onClick={() => setActiveTab('AUDIT')}
          className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition-all ${
            activeTab === 'AUDIT'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Clock className="w-4 h-4" />
          নিরাপত্তা ও অডিট লগ ({auditLogs.length})
        </button>
      </div>

      {loading ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center text-slate-400">
          প্রশাসনিক তথ্য লোড হচ্ছে...
        </div>
      ) : (
        <>
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'OVERVIEW' && (
            <div className="space-y-6">
              {/* Metrics Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
                  <div className="flex items-center justify-between text-slate-500 mb-2">
                    <span className="text-xs font-semibold">নিবন্ধিত জমি ও খতিয়ান</span>
                    <FileText className="w-4 h-4 text-teal-600" />
                  </div>
                  <div className="text-2xl font-bold text-slate-900">
                    {stats?.totalParcels || 12} টি
                  </div>
                  <span className="text-[11px] text-emerald-600 font-medium">রেকর্ড যাচাইকৃত</span>
                </div>

                <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
                  <div className="flex items-center justify-between text-slate-500 mb-2">
                    <span className="text-xs font-semibold">চলমান বিক্রয় আবেদন</span>
                    <TrendingUp className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div className="text-2xl font-bold text-slate-900">
                    {stats?.totalSales || saleApps.length} টি
                  </div>
                  <span className="text-[11px] text-teal-600 font-medium">সাব-রেজিস্ট্রি সংযুক্ত</span>
                </div>

                <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
                  <div className="flex items-center justify-between text-slate-500 mb-2">
                    <span className="text-xs font-semibold">সক্রিয় ই-নামজারি কেস</span>
                    <Scale className="w-4 h-4 text-amber-600" />
                  </div>
                  <div className="text-2xl font-bold text-slate-900">
                    {stats?.totalMutations || 4} টি
                  </div>
                  <span className="text-[11px] text-amber-700 font-medium">এসি ল্যান্ড ট্র্যাকিং</span>
                </div>

                <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
                  <div className="flex items-center justify-between text-slate-500 mb-2">
                    <span className="text-xs font-semibold">নিবন্ধিত নাগরিক</span>
                    <Users className="w-4 h-4 text-slate-700" />
                  </div>
                  <div className="text-2xl font-bold text-slate-900">
                    {stats?.totalCitizens || 8} জন
                  </div>
                  <span className="text-[11px] text-emerald-600 font-medium">KYC ভেরিফায়েড</span>
                </div>
              </div>

              {/* Fraud and Risk Summary */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                  <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-red-600" />
                    ঝুঁকি মূল্যায়ন ও জালিয়াতি প্রতিরোধ মেট্রিক্স (Risk Engine)
                  </h3>
                  <div className="space-y-3 text-xs">
                    <div className="flex items-center justify-between p-3 bg-red-50 text-red-900 rounded-lg">
                      <span className="font-semibold">মক মোকদ্দমা ও কোর্ট নিষেধাজ্ঞা শনাক্ত:</span>
                      <span className="font-bold">১ টি পার্সেল</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-amber-50 text-amber-900 rounded-lg">
                      <span className="font-semibold">খাজনা বকেয়া বা দাখিলা পেন্ডিং:</span>
                      <span className="font-bold">২ টি আবেদন</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-slate-50 text-slate-800 rounded-lg">
                      <span className="font-semibold">অতিরিক্ত শেয়ার বিক্রয় প্রচেষ্টা ব্লকড:</span>
                      <span className="font-bold">সার্ভার-সাইড সিকিউরড</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                  <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <Receipt className="w-4 h-4 text-emerald-600" />
                    ভূমি উন্নয়ন কর ও রাজস্ব সারাংশ (Revenue Analytics)
                  </h3>
                  <div className="space-y-3 text-xs">
                    <div className="flex items-center justify-between p-3 bg-emerald-50 text-emerald-900 rounded-lg">
                      <span className="font-semibold">মোট ছাড়পত্রকৃত রাজস্ব আদায়:</span>
                      <span className="font-bold font-mono">৳ ২২,৪৫০ (ডেমো)</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-slate-50 text-slate-800 rounded-lg">
                      <span className="font-semibold">পেমেন্ট গেটওয়ে স্ট্যাটাস:</span>
                      <span className="text-emerald-700 font-bold">ডেমো অটোপে সচল</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-slate-50 text-slate-800 rounded-lg">
                      <span className="font-semibold">সার্ভার গার্ড সুরক্ষা:</span>
                      <span className="text-teal-700 font-bold">কর পরিশোধ ছাড়া আবেদন নিষিদ্ধ</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: KYC QUEUE */}
          {activeTab === 'KYC' && (
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
              <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  নাগরিক জাতীয় পরিচয়পত্র ও বায়োমেট্রিক KYC যাচাই কিউ
                </span>
                <span className="text-xs text-slate-500">অনুমোদনে ইউনিক Citizen ID তৈরি হয়</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
                    <tr>
                      <th className="p-3">নাগরিক নাম</th>
                      <th className="p-3">ইউজার আইডি</th>
                      <th className="p-3">জাতীয় পরিচয়পত্র (NID)</th>
                      <th className="p-3">বর্তমান অবস্থা</th>
                      <th className="p-3">প্রদত্ত Citizen ID</th>
                      <th className="p-3 text-right">পদক্ষেপ</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {kycList.map((k) => (
                      <tr key={k.id} className="hover:bg-slate-50">
                        <td className="p-3 font-bold text-slate-800">{k.fullName}</td>
                        <td className="p-3 font-mono text-slate-500">{k.userId}</td>
                        <td className="p-3 font-mono text-slate-700">{k.nidNumber}</td>
                        <td className="p-3">
                          <StatusBadge status={k.status} />
                        </td>
                        <td className="p-3 font-mono font-bold text-teal-700">
                          {k.citizenId || '—'}
                        </td>
                        <td className="p-3 text-right">
                          {k.status === 'PENDING' ? (
                            <button
                              onClick={() => handleApproveKyc(k.userId)}
                              disabled={actionLoading}
                              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-bold transition-colors disabled:opacity-50"
                            >
                              অনুমোদন করুন
                            </button>
                          ) : (
                            <span className="text-emerald-600 font-semibold flex items-center justify-end gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5" /> যাচাইকৃত
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: SALES AUDIT & REVIEW */}
          {activeTab === 'SALES' && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
                <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    বিক্রয় ও রেজিস্ট্রি আবেদন পর্যালোচনা
                  </span>
                  <span className="text-xs text-slate-500">
                    মোট আবেদন: {saleApps.length} টি
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
                      <tr>
                        <th className="p-3">আবেদন নং</th>
                        <th className="p-3">বিক্রেতা</th>
                        <th className="p-3">ক্রেতা</th>
                        <th className="p-3">খতিয়ান ও দাগ</th>
                        <th className="p-3">অংশ ও মূল্য</th>
                        <th className="p-3">অবস্থা</th>
                        <th className="p-3 text-right">পর্যালোচনা</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {saleApps.map((app) => {
                        const appNo = app.application_no || app.applicationNumber || app.id;
                        const sellerId = app.seller?.citizen_id || app.sellerCitizenId || app.seller_id;
                        const buyerId = app.buyer_citizen_id || app.buyerCitizenId || app.buyer_id;
                        const khatian = app.parcel?.khatian_no || app.khatianNo || '১২০৪';
                        const dag = app.parcel?.dag_no || app.dagNo || '৪০৫';
                        const share = app.proposed_share || app.proposedShare || 0;
                        const price = app.agreed_price_bdt || app.agreedPrice || 0;

                        return (
                          <tr key={app.id} className="hover:bg-slate-50">
                            <td className="p-3 font-mono font-bold text-slate-900">{appNo}</td>
                            <td className="p-3 font-mono text-slate-700">{sellerId}</td>
                            <td className="p-3 font-mono text-slate-700">{buyerId}</td>
                            <td className="p-3">খতিয়ান {khatian}, দাগ {dag}</td>
                            <td className="p-3">{share}% (৳ {price.toLocaleString()})</td>
                            <td className="p-3">
                              <StatusBadge stage={app.stage} status={app.status} />
                            </td>
                            <td className="p-3 text-right">
                              <button
                                onClick={() => setSelectedSale(app)}
                                className="px-3 py-1 bg-slate-900 hover:bg-slate-800 text-white rounded font-bold"
                              >
                                পরীক্ষা করুন
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Review Modal */}
              {selectedSale && (
                <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
                  <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-xl space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                      <h3 className="text-base font-bold text-slate-900">
                        আবেদন পর্যালোচনা: {selectedSale.application_no || selectedSale.applicationNumber || selectedSale.id}
                      </h3>
                      <button
                        onClick={() => setSelectedSale(null)}
                        className="text-slate-400 hover:text-slate-600 text-sm font-bold"
                      >
                        ✕
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 p-3 rounded-lg">
                      <div>
                        <span className="text-slate-500 block">বিক্রেতা Citizen ID:</span>
                        <span className="font-mono font-bold text-slate-800">
                          {selectedSale.seller?.citizen_id || selectedSale.sellerCitizenId || selectedSale.seller_id}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-500 block">ক্রেতা Citizen ID:</span>
                        <span className="font-mono font-bold text-slate-800">
                          {selectedSale.buyer_citizen_id || selectedSale.buyerCitizenId || selectedSale.buyer_id}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-500 block">খতিয়ান ও দাগ:</span>
                        <span className="font-bold text-slate-800">
                          খতিয়ান {selectedSale.parcel?.khatian_no || selectedSale.khatianNo}, দাগ {selectedSale.parcel?.dag_no || selectedSale.dagNo}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-500 block">বিক্রয় পরিমাণ ও অংশ:</span>
                        <span className="font-bold text-slate-800">
                          {selectedSale.proposed_area_decimal || selectedSale.proposedArea} শতক ({selectedSale.proposed_share || selectedSale.proposedShare}%)
                        </span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        পর্যালোচনা মন্তব্য বা সংশোধনের কারণ
                      </label>
                      <textarea
                        rows={3}
                        value={reviewReason}
                        onChange={(e) => setReviewReason(e.target.value)}
                        placeholder="যেমন: প্রাথমিক যাচাইয়ে খতিয়ান ও ওয়ারিশান স্বত্ব সঠিক..."
                        className="w-full text-xs p-2.5 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-teal-500"
                      ></textarea>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={() => handleSaleAction('RETURN')}
                        disabled={actionLoading}
                        className="px-3 py-2 border border-amber-300 text-amber-800 hover:bg-amber-50 rounded-lg text-xs font-bold flex items-center gap-1"
                      >
                        <CornerDownLeft className="w-3.5 h-3.5" />
                        সংশোধনে ফেরত পাঠান
                      </button>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleSaleAction('REJECT')}
                          disabled={actionLoading}
                          className="px-3 py-2 border border-red-300 text-red-700 hover:bg-red-50 rounded-lg text-xs font-bold"
                        >
                          বাতিল করুন
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSaleAction('APPROVE')}
                          disabled={actionLoading}
                          className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold"
                        >
                          অনুমোদন করুন
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: AUDIT LOGS */}
          {activeTab === 'AUDIT' && (
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
              <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  অপরিবর্তনযোগ্য অডিট ও নিরাপত্তা ট্রেইল (Audit Trail)
                </span>
                <span className="text-xs text-slate-500">আইনগত দায়বদ্ধতা ও সিস্টেম ইন্টিগ্রিটি</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
                    <tr>
                      <th className="p-3">সময়কাল</th>
                      <th className="p-3">অ্যাকশন ও বিভাগ</th>
                      <th className="p-3">অপারেটর / ইউজার</th>
                      <th className="p-3">সংশ্লিষ্ট রেকর্ড</th>
                      <th className="p-3">বিস্তারিত বিবরণ</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
                    {auditLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-slate-50">
                        <td className="p-3 text-slate-400 whitespace-nowrap">{log.timestamp}</td>
                        <td className="p-3">
                          <span className="px-2 py-0.5 bg-slate-100 text-slate-800 font-bold rounded">
                            {log.action}
                          </span>
                        </td>
                        <td className="p-3 text-teal-700 font-bold">{log.userId}</td>
                        <td className="p-3 text-slate-600">{log.entityType} ({log.entityId})</td>
                        <td className="p-3 text-slate-700 font-sans">{log.details}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
