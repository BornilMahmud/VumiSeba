import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../../services/api';
import { SaleApplication } from '../../../types';
import { StatusBadge } from '../../../components/common/StatusBadge';
import { History, Clock, ArrowRight, Stamp } from 'lucide-react';

export const RegistryHistoryPage: React.FC = () => {
  const [applications, setApplications] = useState<SaleApplication[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await api.officer.registryQueue();
        if (res.success && res.all_applications) {
          setApplications(res.all_applications);
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
          <History className="text-amber-700" size={20} />
          সাব-রেজিস্ট্রি কার্যালয়ের পূর্ণাঙ্গ নথি ও ইতিহাস
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          গুলশান সাব-রেজিস্ট্রি অফিসে গৃহীত, নির্ধারিত এবং নিষ্পত্তিকৃত সকল বিক্রয় ও দলিলের ইতিহাস
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
                <th className="py-3 px-4">বর্তমান পর্যায়</th>
                <th className="py-3 px-4 text-right">কার্যক্রম</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500">
                    <Clock size={16} className="animate-spin inline-block mr-2" />
                    ইতিহাস লোড হচ্ছে...
                  </td>
                </tr>
              ) : applications.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500">
                    কোন রেকর্ড পাওয়া যায়নি।
                  </td>
                </tr>
              ) : (
                applications.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-50/70 transition">
                    <td className="py-3 px-4 font-mono font-bold text-amber-950">
                      {app.application_no}
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-semibold text-slate-900 block">{app.seller?.name_bn}</span>
                      <span className="text-slate-500 text-[11px]">{app.buyer?.name_bn}</span>
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
                        to={`/office/registry/applications/${app.id}`}
                        className="inline-flex items-center gap-1 text-amber-800 hover:text-amber-950 font-semibold"
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

export default RegistryHistoryPage;
