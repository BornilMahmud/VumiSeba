import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../../services/api';
import { SaleApplication } from '../../../types';
import { StatusBadge } from '../../../components/common/StatusBadge';
import { History, Clock, ArrowRight } from 'lucide-react';
import { useLanguage } from '../../../context/LanguageContext';
import { formatName, formatMouza, formatPlot, formatArea } from '../../../utils/bilingual';

export const UnionHistoryPage: React.FC = () => {
  const [applications, setApplications] = useState<SaleApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const { language } = useLanguage();
  const isBn = language === 'bn';

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
    <div className={`space-y-6 ${isBn ? 'font-bengali' : 'font-sans'}`}>
      <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs transition-colors">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <History className="text-emerald-700 dark:text-emerald-400" size={20} />
          {isBn
            ? 'ইউনিয়ন কার্যালয়ের নিষ্পত্তি ও তদন্ত ইতিহাস'
            : 'Union Office Resolution & Investigation History'}
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          {isBn
            ? 'ইউনিয়ন ভূমি সহকারী কর্মকর্তা কর্তৃক ইতিপূর্বে পর্যালোচিত, সংশোধনে প্রেরিত ও অনুমোদিত নথিসমূহ'
            : 'Records previously reviewed, returned for correction, or recommended/approved by the Union Land Assistant Officer'}
        </p>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs overflow-hidden transition-colors">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 font-bold">
                <th className="py-3 px-4">{isBn ? 'আবেদন নম্বর' : 'Application No'}</th>
                <th className="py-3 px-4">{isBn ? 'পক্ষগণ (ক্রেতা ও বিক্রেতা)' : 'Parties (Buyer & Seller)'}</th>
                <th className="py-3 px-4">{isBn ? 'মৌজা ও দাগ' : 'Mouza & Dag'}</th>
                <th className="py-3 px-4">{isBn ? 'পরিমাণ' : 'Area (Decimal)'}</th>
                <th className="py-3 px-4">{isBn ? 'বর্তমান অবস্থা' : 'Current Status'}</th>
                <th className="py-3 px-4 text-right">{isBn ? 'কার্যক্রম' : 'Action'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500 dark:text-slate-400">
                    <Clock size={18} className="animate-spin inline-block mr-2" />
                    {isBn ? 'ইতিহাস লোড হচ্ছে...' : 'Loading history...'}
                  </td>
                </tr>
              ) : applications.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500 dark:text-slate-400">
                    {isBn ? 'কোন নিষ্পত্তিকৃত আবেদন পাওয়া যায়নি।' : 'No resolved applications found.'}
                  </td>
                </tr>
              ) : (
                applications.map((app) => {
                  const sellerName = formatName(app.seller, isBn, 'Rafiqul Islam');
                  const buyerName = formatName(app.buyer, isBn, 'Farhan Ahmed');
                  const mouza = formatMouza(app.parcel, isBn);

                  return (
                    <tr key={app.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition">
                      <td className="py-3 px-4 font-mono font-bold text-slate-800 dark:text-slate-200">
                        {app.application_no}
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-semibold text-slate-900 dark:text-slate-100 block">
                          {isBn ? 'বিক্রেতা:' : 'Seller:'} {sellerName}
                        </span>
                        <span className="text-slate-500 dark:text-slate-400 text-[11px]">
                          {isBn ? 'ক্রেতা:' : 'Buyer:'} {buyerName}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-700 dark:text-slate-300">
                        {mouza}, {formatPlot(app.parcel?.dag_no, isBn)}
                      </td>
                      <td className="py-3 px-4 font-semibold text-slate-800 dark:text-slate-200">
                        {formatArea(app.proposed_area_decimal, isBn)}
                      </td>
                      <td className="py-3 px-4">
                        <StatusBadge status={app.stage} />
                      </td>
                      <td className="py-3 px-4 text-right">
                        <Link
                          to={`/office/union/applications/${app.id}`}
                          className="inline-flex items-center gap-1 text-emerald-700 dark:text-emerald-400 hover:text-emerald-900 dark:hover:text-emerald-300 font-semibold text-xs"
                        >
                          {isBn ? 'বিস্তারিত' : 'Details'}
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

export default UnionHistoryPage;
