import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../../services/api';
import { SaleApplication } from '../../../types';
import { Coins, CheckCircle2, AlertTriangle, ArrowRight, Clock, Search, ShieldCheck } from 'lucide-react';

export const UnionTaxVerificationPage: React.FC = () => {
  const [applications, setApplications] = useState<SaleApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchQueue = async () => {
      try {
        const res = await api.officer.unionQueue();
        if (res.success && (res.all_applications || res.queue)) {
          setApplications(res.all_applications || res.queue);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchQueue();
  }, []);

  const filtered = applications.filter((app) =>
    (app.holding_no || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (app.application_no || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (app.seller?.name_bn || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 font-bengali">
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Coins className="text-emerald-700" size={20} />
            ভূমি উন্নয়ন কর ও দাখিলা সত্যতা নিরীক্ষা
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            স্থানীয় হোল্ডিং নম্বর, সর্বশেষ খাজনা পরিশোধিত অর্থবছর ও দাখিলা সত্যতা যাচাই
          </p>
        </div>
        <div className="relative">
          <Search size={15} className="absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="হোল্ডিং বা আবেদন নং..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 pr-4 py-2 border border-slate-300 rounded-lg text-xs w-64 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
                <th className="py-3 px-4">আবেদন ও হোল্ডিং নং</th>
                <th className="py-3 px-4">জমির মালিক (বিক্রেতা)</th>
                <th className="py-3 px-4">মৌজা ও দাগ নং</th>
                <th className="py-3 px-4">কর পরিশোধের স্থিতি</th>
                <th className="py-3 px-4">বকেয়া করের পরিমাণ</th>
                <th className="py-3 px-4 text-right">কার্যক্রম</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500">
                    <Clock size={18} className="animate-spin inline-block mr-2" />
                    কর ডাটাবেজ যাচাই হচ্ছে...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500">
                    কোন হোল্ডিং তথ্য পাওয়া যায়নি।
                  </td>
                </tr>
              ) : (
                filtered.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-50/70 transition">
                    <td className="py-3 px-4">
                      <span className="font-mono font-bold text-slate-800 block">{app.application_no}</span>
                      <span className="text-[11px] text-emerald-800 font-mono">হোল্ডিং: {app.holding_no || 'HLD-2026-8812'}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-semibold text-slate-900 block">{app.seller?.name_bn || 'মো: রফিকুল ইসলাম'}</span>
                      <span className="text-[11px] text-slate-500">আইডি: {app.seller_citizen_id || 'BHM-CIT-104928'}</span>
                    </td>
                    <td className="py-3 px-4 text-slate-700">
                      {app.parcel?.mouza_bn || 'সাঁতারকুল'}, দাগ: {app.parcel?.dag_no || '১০৮'}
                    </td>
                    <td className="py-3 px-4">
                      {app.tax_clearance_status === 'CLEARED' ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          <CheckCircle2 size={12} />
                          পরিশোধিত (১৪৩০ সন)
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-800 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                          <AlertTriangle size={12} />
                          বকেয়া বিদ্যমান
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 font-mono font-semibold">
                      {app.tax_clearance_status === 'CLEARED' ? '৳০.০০' : '৳৪৫০.০০'}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Link
                        to={`/office/union/applications/${app.id}`}
                        className="inline-flex items-center gap-1 text-emerald-700 hover:text-emerald-900 font-semibold text-xs"
                      >
                        বিস্তারিত নিরীক্ষা
                        <ArrowRight size={13} />
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

export default UnionTaxVerificationPage;
