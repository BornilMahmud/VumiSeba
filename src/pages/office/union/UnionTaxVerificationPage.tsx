import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../../services/api';
import { SaleApplication } from '../../../types';
import { Coins, CheckCircle2, AlertTriangle, ArrowRight, Clock, Search } from 'lucide-react';
import { useLanguage } from '../../../context/LanguageContext';
import {
  formatName,
  formatMouza,
  formatPlot,
} from '../../../utils/bilingual';

export const UnionTaxVerificationPage: React.FC = () => {
  const [applications, setApplications] = useState<SaleApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { language } = useLanguage();
  const isBn = language === 'bn';

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
    (app.seller?.name_bn || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (app.seller?.name_en || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={`space-y-6 ${isBn ? 'font-bengali' : 'font-sans'}`}>
      <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Coins className="text-emerald-700 dark:text-emerald-400" size={20} />
            {isBn
              ? 'ভূমি উন্নয়ন কর ও দাখিলা সত্যতা নিরীক্ষা'
              : 'Land Development Tax & Dakhila Audit'}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {isBn
              ? 'স্থানীয় হোল্ডিং নম্বর, সর্বশেষ খাজনা পরিশোধিত অর্থবছর ও দাখিলা সত্যতা যাচাই'
              : 'Audit local holding numbers, latest tax clearance fiscal years, and dakhila receipt authenticity'}
          </p>
        </div>
        <div className="relative">
          <Search size={15} className="absolute left-3 top-3 text-slate-400 dark:text-slate-500" />
          <input
            type="text"
            placeholder={isBn ? 'হোল্ডিং বা আবেদন নং...' : 'Search holding or application no...'}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-400 rounded-lg text-xs w-64 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs overflow-hidden transition-colors">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 font-bold">
                <th className="py-3 px-4">{isBn ? 'আবেদন ও হোল্ডিং নং' : 'App & Holding No'}</th>
                <th className="py-3 px-4">{isBn ? 'জমির মালিক (বিক্রেতা)' : 'Landowner (Seller)'}</th>
                <th className="py-3 px-4">{isBn ? 'মৌজা ও দাগ নং' : 'Mouza & Dag No'}</th>
                <th className="py-3 px-4">{isBn ? 'কর পরিশোধের স্থিতি' : 'Tax Clearance Status'}</th>
                <th className="py-3 px-4">{isBn ? 'বকেয়া করের পরিমাণ' : 'Outstanding Dues'}</th>
                <th className="py-3 px-4 text-right">{isBn ? 'কার্যক্রম' : 'Action'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500 dark:text-slate-400">
                    <Clock size={18} className="animate-spin inline-block mr-2" />
                    {isBn ? 'কর ডাটাবেজ যাচাই হচ্ছে...' : 'Auditing tax database...'}
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500 dark:text-slate-400">
                    {isBn ? 'কোন হোল্ডিং তথ্য পাওয়া যায়নি।' : 'No holding records found.'}
                  </td>
                </tr>
              ) : (
                filtered.map((app) => {
                  const sellerName = formatName(app.seller, isBn);
                  const mouzaName = formatMouza(app.parcel, isBn);

                  return (
                    <tr key={app.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/50 transition whitespace-nowrap">
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{app.application_no}</span>
                        <span className="text-slate-400 mx-1">·</span>
                        <span className="text-[11px] text-emerald-800 dark:text-emerald-400 font-mono">
                          {isBn ? 'হোল্ডিং:' : 'Holding:'} {app.holding_no || 'HLD-2026-8812'}
                        </span>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className="font-semibold text-slate-900 dark:text-white">{sellerName}</span>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400 ml-1.5">(ID: {app.seller_citizen_id || 'BHM-CIT-104928'})</span>
                      </td>
                      <td className="py-3 px-4 text-slate-700 dark:text-slate-300 whitespace-nowrap">
                        {mouzaName}, {formatPlot(app.parcel?.dag_no || '১০৮', isBn)}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        {app.tax_clearance_status === 'CLEARED' ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800 whitespace-nowrap shrink-0">
                            <CheckCircle2 size={12} />
                            {isBn ? 'পরিশোধিত (১৪৩০ সন)' : 'Cleared (FY 2025-26)'}
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-800 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/60 px-2 py-0.5 rounded border border-rose-200 dark:border-rose-800 whitespace-nowrap shrink-0">
                            <AlertTriangle size={12} />
                            {isBn ? 'বকেয়া বিদ্যমান' : 'Dues Pending'}
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 font-mono font-semibold whitespace-nowrap text-slate-800 dark:text-slate-200">
                        {app.tax_clearance_status === 'CLEARED' ? '৳0.00' : '৳450.00'}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <Link
                          to={`/office/union/applications/${app.id}`}
                          className="inline-flex items-center gap-1 text-emerald-700 dark:text-emerald-400 hover:text-emerald-900 dark:hover:text-emerald-300 font-semibold text-xs"
                        >
                          {isBn ? 'বিস্তারিত নিরীক্ষা' : 'Audit Details'}
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

export default UnionTaxVerificationPage;
