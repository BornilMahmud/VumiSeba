import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../../services/api';
import { SaleApplication } from '../../../types';
import { StatusBadge } from '../../../components/common/StatusBadge';
import { History, Clock, ArrowRight, Search, FileText } from 'lucide-react';

export const UnionHistoryPage: React.FC = () => {
  const [applications, setApplications] = useState<SaleApplication[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await api.officer.unionQueue();
        if (res.success && (res.all_applications || res.queue)) {
          const apps: SaleApplication[] = res.all_applications || res.queue;
          setApplications(apps.filter((a) => a.stage !== 'UNION_REVIEW_PENDING' && a.stage !== 'SUBMITTED'));
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  return (
    <div className="space-y-6 font-bengali">
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <History className="text-emerald-700" size={20} />
          ইউনিয়ন কার্যালয়ের নিষ্পত্তি ও তদন্ত ইতিহাস
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          ইউনিয়ন ভূমি সহকারী কর্মকর্তা কর্তৃক ইতিপূর্বে পর্যালোচিত, সংশোধনে প্রেরিত ও অনুমোদিত নথিসমূহ
        </p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
                <th className="py-3 px-4">আবেদন নম্বর</th>
                <th className="py-3 px-4">পক্ষগণ (ক্রেতা ও বিক্রেতা)</th>
                <th className="py-3 px-4">মৌজা ও দাগ</th>
                <th className="py-3 px-4">পরিমাণ</th>
                <th className="py-3 px-4">বর্তমান অবস্থা</th>
                <th className="py-3 px-4 text-right">কার্যক্রম</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500">
                    <Clock size={18} className="animate-spin inline-block mr-2" />
                    ইতিহাস লোড হচ্ছে...
                  </td>
                </tr>
              ) : applications.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500">
                    কোন নিষ্পত্তিকৃত আবেদন পাওয়া যায়নি।
                  </td>
                </tr>
              ) : (
                applications.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-50/70 transition">
                    <td className="py-3 px-4 font-mono font-bold text-slate-800">
                      {app.application_no}
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-semibold text-slate-900 block">বিক্রেতা: {app.seller?.name_bn}</span>
                      <span className="text-slate-500 text-[11px]">ক্রেতা: {app.buyer?.name_bn}</span>
                    </td>
                    <td className="py-3 px-4 text-slate-700">
                      {app.parcel?.mouza_bn}, দাগ: {app.parcel?.dag_no}
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-800">
                      {app.proposed_area_decimal} শতক
                    </td>
                    <td className="py-3 px-4">
                      <StatusBadge status={app.stage} />
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Link
                        to={`/office/union/applications/${app.id}`}
                        className="inline-flex items-center gap-1 text-emerald-700 hover:text-emerald-900 font-semibold text-xs"
                      >
                        বিস্তারিত
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

export default UnionHistoryPage;
