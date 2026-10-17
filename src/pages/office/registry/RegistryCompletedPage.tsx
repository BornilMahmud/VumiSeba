import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../../services/api';
import { SaleApplication } from '../../../types';
import { CheckCircle2, Clock, Stamp, ArrowRight, FileText } from 'lucide-react';
import { useLanguage } from '../../../context/LanguageContext';
import {
  formatName,
  formatMouza,
  formatPlot,
  formatArea,
} from '../../../utils/bilingual';

export const RegistryCompletedPage: React.FC = () => {
  const [applications, setApplications] = useState<SaleApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const { language } = useLanguage();
  const isBn = language === 'bn';

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
    <div className={`space-y-6 ${isBn ? 'font-bengali' : 'font-sans'}`}>
      <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <CheckCircle2 className="text-emerald-700 dark:text-emerald-400" size={20} />
          {isBn ? 'নিবন্ধিত কবলা দলিল বালাম ও মহাফেজখানা রেজিস্টার' : 'Registered Deeds Volume & Archive Register'}
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          {isBn
            ? 'গুলশান সাব-রেজিস্ট্রি কার্যালয়ে সম্পাদনকৃত কবলা দলিল এবং নামজারিতে প্রেরিত রেজিস্ট্রি খতিয়ান'
            : 'Deeds executed at Gulshan Sub-Registry Office and automatically forwarded for e-Mutation'}
        </p>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 font-bold">
                <th className="py-3 px-4">{isBn ? 'দলিল নম্বর ও বালাম' : 'Deed No & Volume'}</th>
                <th className="py-3 px-4">{isBn ? 'পক্ষগণ (বিক্রেতা ও ক্রেতা)' : 'Parties (Seller & Buyer)'}</th>
                <th className="py-3 px-4">{isBn ? 'মৌজা ও দাগ নং' : 'Mouza & Plot No'}</th>
                <th className="py-3 px-4">{isBn ? 'হস্তান্তরিত পরিমাণ' : 'Transferred Area'}</th>
                <th className="py-3 px-4">{isBn ? 'সম্পাদনের তারিখ' : 'Registration Date'}</th>
                <th className="py-3 px-4 text-right">{isBn ? 'কার্যক্রম' : 'Action'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500 dark:text-slate-400">
                    <Clock size={16} className="animate-spin inline-block mr-2" />
                    {isBn ? 'বালাম ডাটাবেজ লোড হচ্ছে...' : 'Loading volume records...'}
                  </td>
                </tr>
              ) : applications.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500 dark:text-slate-400">
                    {isBn ? 'কোন নিবন্ধিত দলিল রেকর্ড পাওয়া যায়নি।' : 'No registered deed records found.'}
                  </td>
                </tr>
              ) : (
                applications.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition">
                    <td className="py-3 px-4">
                      <span className="font-mono font-bold text-amber-950 dark:text-amber-300 block">
                        {isBn ? `দলিল নং ${app.registration_details?.deed_no || '৩৪০৯/২০২৬'}` : `Deed No. ${app.registration_details?.deed_no || '3409/2026'}`}
                      </span>
                      <span className="text-[11px] text-slate-400 dark:text-slate-500">
                        {isBn ? (app.registration_details?.volume_no || 'বালাম নং ৪২, পৃষ্ঠা ১৮-২৫') : (app.registration_details?.volume_no ? app.registration_details.volume_no.replace('বালাম নং', 'Volume').replace('পৃষ্ঠা', 'Page') : 'Volume 42, Pages 18-25')}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <p className="font-semibold text-slate-800 dark:text-slate-200">
                        {formatName(app.seller, isBn)} → {formatName(app.buyer, isBn)}
                      </p>
                    </td>
                    <td className="py-3 px-4 text-slate-700 dark:text-slate-300">
                      {formatMouza(app.parcel, isBn)}, {formatPlot(app.parcel?.dag_no, isBn)}
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-800 dark:text-slate-200">
                      {formatArea(app.proposed_area_decimal, isBn)}
                    </td>
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-400">
                      {app.registration_details?.registration_date || '2026-03-20'}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Link
                        to={`/office/registry/applications/${app.id}`}
                        className="inline-flex items-center gap-1 text-amber-800 dark:text-amber-400 hover:text-amber-950 dark:hover:text-amber-300 font-semibold cursor-pointer"
                      >
                        {isBn ? 'বালাম বিবরণ' : 'Volume Details'}
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
