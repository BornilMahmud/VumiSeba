import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../../services/api';
import { SaleApplication } from '../../../types';
import { FileSearch, CheckCircle2, AlertTriangle, ArrowRight, Clock, Search, MapPin } from 'lucide-react';

export const UnionRecordVerificationPage: React.FC = () => {
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
    (app.parcel?.khatian_no || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (app.parcel?.dag_no || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (app.parcel?.mouza_bn || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 font-bengali">
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <FileSearch className="text-emerald-700" size={20} />
            রেকর্ড ও দাগ যাচাই (১নং রেজিস্টার নিরীক্ষা)
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            বিএস/আরএস খতিয়ানের স্বত্বাধিকারী তালিকা, দাগের মোট পরিমাণ ও বিক্রেতার অংশ যাচাই
          </p>
        </div>
        <div className="relative">
          <Search size={15} className="absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="খতিয়ান বা দাগ নম্বর..."
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
                <th className="py-3 px-4">মৌজা ও জেএল</th>
                <th className="py-3 px-4">খতিয়ান ও দাগ নং</th>
                <th className="py-3 px-4">দাগে মোট জমি</th>
                <th className="py-3 px-4">বিক্রেতার রেকর্ডকৃত হিস্যা</th>
                <th className="py-3 px-4">প্রস্তাবিত বিক্রয়</th>
                <th className="py-3 px-4">হিস্যা সামঞ্জস্যতা</th>
                <th className="py-3 px-4 text-right">কার্যক্রম</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500">
                    <Clock size={18} className="animate-spin inline-block mr-2" />
                    রেকর্ড ডাটাবেজ যাচাই হচ্ছে...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500">
                    কোন রেকর্ড যাচাই তালিকা পাওয়া যায়নি।
                  </td>
                </tr>
              ) : (
                filtered.map((app) => {
                  const isOversell = app.proposed_share > (app.seller_owned_share || 1.0);
                  return (
                    <tr key={app.id} className="hover:bg-slate-50/70 transition">
                      <td className="py-3 px-4">
                        <span className="font-semibold text-slate-800 block">{app.parcel?.mouza_bn || 'সাঁতারকুল'}</span>
                        <span className="text-[11px] text-slate-400">জেএল নং: {app.parcel?.jl_no || '০৭'}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-mono font-bold text-slate-900 block">খতিয়ান: {app.parcel?.khatian_no || '৪৫২০'}</span>
                        <span className="text-[11px] text-emerald-800 font-mono">দাগ: {app.parcel?.dag_no || '১০৮'}</span>
                      </td>
                      <td className="py-3 px-4 font-semibold text-slate-700">
                        {app.parcel?.total_area_decimal || '৩৩.০০'} শতক
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-bold text-slate-800 block">{app.seller_owned_share || '০.২৫০০'}</span>
                        <span className="text-[11px] text-slate-500">({app.seller_owned_area_decimal || '৮.২৫'} শতক)</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-bold text-emerald-800 block">{app.proposed_share}</span>
                        <span className="text-[11px] text-emerald-700">({app.proposed_area_decimal} শতক)</span>
                      </td>
                      <td className="py-3 px-4">
                        {isOversell ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-800 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                            <AlertTriangle size={12} />
                            হিস্যা অতিরিক্ত (অসমঞ্জস)
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                            <CheckCircle2 size={12} />
                            সঠিক ও বৈধ
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <Link
                          to={`/office/union/applications/${app.id}`}
                          className="inline-flex items-center gap-1 text-emerald-700 hover:text-emerald-900 font-semibold text-xs"
                        >
                          যাচাই করুন
                          <ArrowRight size={13} />
                        </Link>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UnionRecordVerificationPage;
