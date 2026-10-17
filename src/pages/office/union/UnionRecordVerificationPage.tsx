import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../../services/api';
import { SaleApplication } from '../../../types';
import { FileSearch, CheckCircle2, AlertTriangle, ArrowRight, Clock, Search } from 'lucide-react';
import { useLanguage } from '../../../context/LanguageContext';
import {
  formatMouza,
  formatPlot,
  formatKhatian,
  formatArea,
  formatDigits,
} from '../../../utils/bilingual';

export const UnionRecordVerificationPage: React.FC = () => {
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
    (app.parcel?.khatian_no || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (app.parcel?.dag_no || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (app.parcel?.mouza_bn || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (app.parcel?.mouza_en || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={`space-y-6 ${isBn ? 'font-bengali' : 'font-sans'}`}>
      <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <FileSearch className="text-emerald-700 dark:text-emerald-400" size={20} />
            {isBn
              ? 'রেকর্ড ও দাগ যাচাই (১নং রেজিস্টার নিরীক্ষা)'
              : 'Record & Dag Verification (Register 1 Audit)'}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {isBn
              ? 'বিএস/আরএস খতিয়ানের স্বত্বাধিকারী তালিকা, দাগের মোট পরিমাণ ও বিক্রেতার অংশ যাচাই'
              : 'Audit BS/RS Khatian ownership ledger, total Dag parcel area, and seller recorded share limits'}
          </p>
        </div>
        <div className="relative">
          <Search size={15} className="absolute left-3 top-3 text-slate-400 dark:text-slate-500" />
          <input
            type="text"
            placeholder={isBn ? 'খতিয়ান বা দাগ নম্বর...' : 'Search khatian or dag no...'}
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
                <th className="py-3 px-4">{isBn ? 'মৌজা ও জেএল' : 'Mouza & JL'}</th>
                <th className="py-3 px-4">{isBn ? 'খতিয়ান ও দাগ নং' : 'Khatian & Dag No'}</th>
                <th className="py-3 px-4">{isBn ? 'দাগে মোট জমি' : 'Total Parcel Area'}</th>
                <th className="py-3 px-4">{isBn ? 'বিক্রেতার রেকর্ডকৃত হিস্যা' : 'Seller Recorded Share'}</th>
                <th className="py-3 px-4">{isBn ? 'প্রস্তাবিত বিক্রয়' : 'Proposed Sale'}</th>
                <th className="py-3 px-4">{isBn ? 'হিস্যা সামঞ্জস্যতা' : 'Share Consistency'}</th>
                <th className="py-3 px-4 text-right">{isBn ? 'কার্যক্রম' : 'Action'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500 dark:text-slate-400">
                    <Clock size={18} className="animate-spin inline-block mr-2" />
                    {isBn ? 'রেকর্ড ডাটাবেজ যাচাই হচ্ছে...' : 'Auditing record database...'}
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500 dark:text-slate-400">
                    {isBn ? 'কোন রেকর্ড যাচাই তালিকা পাওয়া যায়নি।' : 'No record verification items found.'}
                  </td>
                </tr>
              ) : (
                filtered.map((app) => {
                  const isOversell = app.proposed_share > (app.seller_owned_share || 1.0);
                  const mouzaName = formatMouza(app.parcel, isBn);

                  return (
                    <tr key={app.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/50 transition whitespace-nowrap">
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className="font-semibold text-slate-900 dark:text-white">{mouzaName}</span>
                        <span className="text-[11px] text-slate-400 ml-1.5">(JL: {formatDigits(app.parcel?.jl_no || '07', isBn)})</span>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className="font-mono font-bold text-slate-900 dark:text-white">
                          {formatKhatian(app.parcel?.khatian_no || '4520', isBn)}
                        </span>
                        <span className="text-slate-400 mx-1">·</span>
                        <span className="text-[11px] text-emerald-800 dark:text-emerald-400 font-mono">
                          {formatPlot(app.parcel?.dag_no || '108', isBn)}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-semibold text-slate-700 dark:text-slate-300 whitespace-nowrap font-mono">
                        {formatArea(app.parcel?.total_area_decimal || '33.00', isBn, true)}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap font-mono">
                        <span className="font-bold text-slate-800 dark:text-slate-200">{formatDigits(app.seller_owned_share || '0.2500', isBn)}</span>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400 ml-1">
                          ({formatArea(app.seller_owned_area_decimal || '8.25', isBn, true)})
                        </span>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap font-mono">
                        <span className="font-bold text-emerald-800 dark:text-emerald-400">{formatDigits(app.proposed_share, isBn)}</span>
                        <span className="text-[11px] text-emerald-700 dark:text-emerald-300 ml-1">
                          ({formatArea(app.proposed_area_decimal, isBn, true)})
                        </span>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        {isOversell ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-800 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/60 px-2 py-0.5 rounded border border-rose-200 dark:border-rose-800 whitespace-nowrap shrink-0">
                            <AlertTriangle size={12} />
                            {isBn ? 'হিস্যা অতিরিক্ত (অসমঞ্জস)' : 'Over-selling (Discrepancy)'}
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800 whitespace-nowrap shrink-0">
                            <CheckCircle2 size={12} />
                            {isBn ? 'সঠিক ও বৈধ' : 'Valid & Consistent'}
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right whitespace-nowrap min-w-[120px]">
                        <Link
                          to={`/office/union/applications/${app.id}`}
                          className="inline-flex items-center gap-1 text-emerald-700 dark:text-emerald-400 hover:text-emerald-900 dark:hover:text-emerald-300 font-bold text-xs"
                        >
                          <span>{isBn ? 'যাচাই করুন' : 'Verify'}</span>
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
