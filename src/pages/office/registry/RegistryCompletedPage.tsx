import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../../services/api';
import { SaleApplication } from '../../../types';
import { CheckCircle2, Clock, Stamp, ArrowRight, FileText } from 'lucide-react';

export const RegistryCompletedPage: React.FC = () => {
  const [applications, setApplications] = useState<SaleApplication[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompleted = async () => {
      try {
        const res = await api.officer.registryQueue();
        if (res.success && res.completed_records) {
          setApplications(res.completed_records);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCompleted();
  }, []);

  return (
    <div className="space-y-6 font-bengali">
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <CheckCircle2 className="text-emerald-700" size={20} />
          নিবন্ধিত কবলা দলিল বালাম ও মহাফেজখানা রেজিস্টার
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          গুলশান সাব-রেজিস্ট্রি কার্যালয়ে সম্পাদনকৃত কবলা দলিল এবং নামজারিতে প্রেরিত রেজিস্ট্রি খতিয়ান
        </p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
                <th className="py-3 px-4">দলিল নম্বর ও বালাম</th>
                <th className="py-3 px-4">পক্ষগণ (বিক্রেতা ও ক্রেতা)</th>
                <th className="py-3 px-4">মৌজা ও দাগ নং</th>
                <th className="py-3 px-4">হস্তান্তরিত পরিমাণ</th>
                <th className="py-3 px-4">সম্পাদনের তারিখ</th>
                <th className="py-3 px-4 text-right">কার্যক্রম</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500">
                    <Clock size={16} className="animate-spin inline-block mr-2" />
                    বালাম ডাটাবেজ লোড হচ্ছে...
                  </td>
                </tr>
              ) : applications.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500">
                    কোন নিবন্ধিত দলিল রেকর্ড পাওয়া যায়নি।
                  </td>
                </tr>
              ) : (
                applications.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-50/70 transition">
                    <td className="py-3 px-4">
                      <span className="font-mono font-bold text-amber-950 block">
                        দলিল নং {app.registration_details?.deed_no || '৩৪০৯/২০২৬'}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        {app.registration_details?.volume_no || 'বালাম নং ৪২, পৃষ্ঠা ১৮-২৫'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <p className="font-semibold text-slate-800">{app.seller?.name_bn} → {app.buyer?.name_bn}</p>
                    </td>
                    <td className="py-3 px-4 text-slate-700">
                      {app.parcel?.mouza_bn}, দাগ: {app.parcel?.dag_no}
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-800">
                      {app.proposed_area_decimal} শতক
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      {app.registration_details?.registration_date || '২০২৬-০৩-২০'}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Link
                        to={`/office/registry/applications/${app.id}`}
                        className="inline-flex items-center gap-1 text-amber-800 hover:text-amber-950 font-semibold"
                      >
                        বালাম বিবরণ
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

export default RegistryCompletedPage;
