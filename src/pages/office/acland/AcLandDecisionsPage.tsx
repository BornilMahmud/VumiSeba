import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../../services/api';
import { MutationApplication } from '../../../types';
import { StatusBadge } from '../../../components/common/StatusBadge';
import { FileCheck, Award, Clock, ArrowRight, Scale, XCircle } from 'lucide-react';
import { useLanguage } from '../../../context/LanguageContext';
import { formatMouza, formatPlot, formatKhatian, formatArea, toEnglishDigits } from '../../../utils/bilingual';

export const AcLandDecisionsPage: React.FC = () => {
  const [mutations, setMutations] = useState<MutationApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const { language } = useLanguage();
  const isBn = language === 'bn';

  useEffect(() => {
    const fetchDecisions = async () => {
      try {
        const res = await api.mutations.list();
        if (res.success && res.data) {
          setMutations(res.data.filter((m: any) => m.status === 'approved' || m.status === 'rejected'));
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDecisions();
  }, []);

  return (
    <div className={`space-y-6 ${isBn ? 'font-bengali' : 'font-sans'}`}>
      <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <FileCheck className="text-indigo-700 dark:text-indigo-400" size={20} />
          {isBn ? 'রাজস্ব আদালতের চূড়ান্ত আদেশ ও রায় রেজিস্টার' : 'Revenue Court Final Orders & Judgments Register'}
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          {isBn
            ? 'সহকারী কমিশনার (ভূমি) কর্তৃক অনুমোদিত নতুন নামজারি খতিয়ানসমূহ এবং খারিজকৃত আদেশের মহাফেজখানা রেকর্ড'
            : 'Archive of approved e-Mutation khatians and rejected orders by the Assistant Commissioner (Land)'}
        </p>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 font-bold">
                <th className="py-3 px-4">{isBn ? 'নামজারি কেস ও দলিল নং' : 'Case & Deed No'}</th>
                <th className="py-3 px-4">{isBn ? 'মৌজা ও দাগ নং' : 'Mouza & Plot No'}</th>
                <th className="py-3 px-4">{isBn ? 'জমির পরিমাণ' : 'Land Area'}</th>
                <th className="py-3 px-4">{isBn ? 'রায় ও সৃজিত খতিয়ান নং' : 'Judgment & Created Khatian'}</th>
                <th className="py-3 px-4">{isBn ? 'স্থিতি' : 'Status'}</th>
                <th className="py-3 px-4 text-right">{isBn ? 'নথি' : 'File'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500 dark:text-slate-400">
                    <Clock size={16} className="animate-spin inline-block mr-2" />
                    {isBn ? 'আদেশ তালিকা লোড হচ্ছে...' : 'Loading orders...'}
                  </td>
                </tr>
              ) : mutations.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500 dark:text-slate-400">
                    {isBn ? 'কোন চূড়ান্ত আদেশ পাওয়া যায়নি।' : 'No final orders found.'}
                  </td>
                </tr>
              ) : (
                mutations.map((mut) => (
                  <tr key={mut.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition">
                    <td className="py-3 px-4">
                      <span className="font-mono font-bold text-indigo-900 dark:text-indigo-300 block">{mut.mutation_case_no}</span>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400">{isBn ? 'দলিল নং:' : 'Deed No:'} {isBn ? (mut.deed_no || '৩৪MD/২০২৬') : (mut.deed_no_en || toEnglishDigits(mut.deed_no) || '3409/2026')}</span>
                    </td>
                    <td className="py-3 px-4 text-slate-700 dark:text-slate-300">
                      {formatMouza(mut.mouza_en || mut.mouza_bn || mut.mouza, isBn)}, {formatPlot(mut.dag_no, isBn)}
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-800 dark:text-slate-200">
                      {formatArea(mut.transferred_area_decimal, isBn)}
                    </td>
                    <td className="py-3 px-4">
                      {mut.approved_khatian_no ? (
                        <span className="font-mono font-bold text-purple-900 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/60 px-2 py-0.5 rounded border border-purple-200 dark:border-purple-800">
                          {formatKhatian(mut.approved_khatian_no, isBn)}
                        </span>
                      ) : (
                        <span className="text-slate-400">{isBn ? 'খতিয়ান প্রযোজ্য নয় (খারিজ)' : 'Khatian N/A (Dismissed)'}</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <StatusBadge status={mut.status} />
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Link
                        to="/office/ac-land/mutation"
                        className="inline-flex items-center gap-1 text-indigo-700 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300 font-semibold"
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

export default AcLandDecisionsPage;
