import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../../services/api';
import { SaleApplication } from '../../../types';
import { StatusBadge } from '../../../components/common/StatusBadge';
import { History, Clock, ArrowRight, Landmark } from 'lucide-react';

export const AcLandHistoryPage: React.FC = () => {
  const [applications, setApplications] = useState<SaleApplication[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await api.officer.acLandQueue();
        if (res.success && (res.all_applications || res.queue)) {
          const apps: SaleApplication[] = res.all_applications || res.queue;
          setApplications(apps.filter((a) => a.stage !== 'AC_LAND_REVIEW_PENDING'));
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
          <History className="text-indigo-700" size={20} />
          এসি ল্যান্ড কার্যালয়ের পূর্ববর্তী কার্যক্রম ও সিদ্ধান্তের ইতিহাস
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          উপজেলা ভূমি অফিসে ইতিপূর্বে নিষ্পত্তিকৃত প্রাক-রেজিস্ট্রেশন ছাড়পত্র ও আদেশের স্থায়ী রেকর্ড
        </p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
                <th className="py-3 px-4">আবেদন নম্বর</th>
                <th className="py-3 px-4">পক্ষগণ (বিক্রেতা ও ক্রেতা)</th>
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
                    <Clock size={16} className="animate-spin inline-block mr-2" />
                    রেকর্ড লোড হচ্ছে...
                  </td>
                </tr>
              ) : applications.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500">
                    কোন নিষ্পত্তিকৃত রেকর্ড পাওয়া যায়নি।
                  </td>
                </tr>
              ) : (
                applications.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-50/70 transition">
                    <td className="py-3 px-4 font-mono font-bold text-indigo-900">
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
                        to={`/office/ac-land/applications/${app.id}`}
                        className="inline-flex items-center gap-1 text-indigo-700 hover:text-indigo-900 font-semibold"
                      >
                        নথি দেখুন
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

export default AcLandHistoryPage;
