import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../../services/api';
import { SaleApplication } from '../../../types';
import { StatusBadge } from '../../../components/common/StatusBadge';
import { History, Clock, ArrowRight, Stamp } from 'lucide-react';
import { useLanguage } from '../../../context/LanguageContext';
import { formatName, formatMouza, formatPlot, formatArea } from '../../../utils/bilingual';

export const RegistryHistoryPage: React.FC = () => {
  const [applications, setApplications] = useState<SaleApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const { language } = useLanguage();
  const isBn = language === 'bn';

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
    <div className={`space-y-6 ${isBn ? 'font-bengali' : 'font-sans'}`}>
      <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <History className="text-amber-700 dark:text-amber-400" size={20} />
          {isBn ? 'সাব-রেজিস্ট্রি কার্যালয়ের পূর্ণাঙ্গ নথি ও ইতিহাস' : 'Sub-Registry Office Complete Records & Archive'}
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          {isBn
            ? 'গুলশান সাব-রেজিস্ট্রি অফিসে গৃহীত, নির্ধারিত এবং নিষ্পত্তিকৃত সকল বিক্রয় ও দলিলের ইতিহাস'
            : 'Complete historical logs of applications received, scheduled, and registered at Gulshan Sub-Registry'}
        </p>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 font-bold">
                <th className="py-3 px-4">{isBn ? 'আবেদন নম্বর' : 'Application No'}</th>
                <th className="py-3 px-4">{isBn ? 'পক্ষগণ (বিক্রেতা ও ক্রেতা)' : 'Parties (Seller & Buyer)'}</th>
                <th className="py-3 px-4">{isBn ? 'মৌজা ও দাগ' : 'Mouza & Plot'}</th>
                <th className="py-3 px-4">{isBn ? 'পরিমাণ' : 'Area'}</th>
                <th className="py-3 px-4">{isBn ? 'বর্তমান পর্যায়' : 'Current Stage'}</th>
                <th className="py-3 px-4 text-right">{isBn ? 'কার্যক্রম' : 'Action'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500 dark:text-slate-400">
                    <Clock size={16} className="animate-spin inline-block mr-2" />
                    {isBn ? 'ইতিহাস লোড হচ্ছে...' : 'Loading history...'}
                  </td>
                </tr>
              ) : applications.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500 dark:text-slate-400">
                    {isBn ? 'কোন রেকর্ড পাওয়া যায়নি।' : 'No records found.'}
                  </td>
                </tr>
              ) : (
                applications.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition">
                    <td className="py-3 px-4 font-mono font-bold text-amber-950 dark:text-amber-300">
                      {app.application_no}
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-semibold text-slate-900 dark:text-white block">
                        {isBn ? 'বিক্রেতা:' : 'Seller:'} {formatName(app.seller, isBn, 'Md. Rafiqul Islam')}
                      </span>
                      <span className="text-slate-500 dark:text-slate-400 text-[11px]">
                        {isBn ? 'ক্রেতা:' : 'Buyer:'} {formatName(app.buyer, isBn, 'Farhan Ahmed')}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-700 dark:text-slate-300">
                      {formatMouza(app.parcel, isBn)}, {formatPlot(app.parcel?.dag_no, isBn)}
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-800 dark:text-slate-200">
                      {formatArea(app.proposed_area_decimal, isBn)}
                    </td>
                    <td className="py-3 px-4">
                      <StatusBadge status={app.stage} />
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Link
                        to={`/office/registry/applications/${app.id}`}
                        className="inline-flex items-center gap-1 text-amber-800 dark:text-amber-400 hover:text-amber-950 dark:hover:text-amber-300 font-semibold cursor-pointer"
                      >
                        {isBn ? 'বিস্তারিত' : 'Details'}
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
