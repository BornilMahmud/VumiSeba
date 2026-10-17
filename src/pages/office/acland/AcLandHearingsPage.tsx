import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../../services/api';
import { MutationApplication } from '../../../types';
import { CalendarCheck, Clock, ArrowRight } from 'lucide-react';
import { useLanguage } from '../../../context/LanguageContext';
import {
  formatMouza,
  formatPlot,
  formatKhatian,
  formatArea,
} from '../../../utils/bilingual';

export const AcLandHearingsPage: React.FC = () => {
  const [mutations, setMutations] = useState<MutationApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const { language } = useLanguage();
  const isBn = language === 'bn';

  useEffect(() => {
    const fetchMutations = async () => {
      try {
        const res = await api.mutations.list();
        if (res.success && res.data) {
          setMutations(res.data.filter((m: any) => m.hearing_date));
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchMutations();
  }, []);

  return (
    <div className={`space-y-6 ${isBn ? 'font-bengali' : 'font-sans'}`}>
      <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <CalendarCheck className="text-indigo-700 dark:text-indigo-400" size={20} />
          {isBn ? 'নামজারি শুনানির সময়সূচী ও নোটিশ রেজিস্টার' : 'Mutation Hearing Schedule & Notice Register'}
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          {isBn
            ? 'উপজেলা রাজস্ব আদালতে নির্ধারিত শুনানির তারিখ, বাদী-বিবাদী নোটিশ ও শুনানির কার্যবিবরণী'
            : 'Scheduled hearing dates, party notices, and proceedings in Upazila Revenue Court'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {loading ? (
          <div className="col-span-2 py-8 text-center text-slate-500 dark:text-slate-400 text-xs">
            <Clock size={16} className="animate-spin inline-block mr-2" />
            {isBn ? 'শুনানি সময়সূচী লোড হচ্ছে...' : 'Loading hearing schedule...'}
          </div>
        ) : mutations.length === 0 ? (
          <div className="col-span-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-8 text-center text-slate-500 dark:text-slate-400 text-xs">
            {isBn ? 'বর্তমানে কোন শুনানির তারিখ নির্ধারিত নেই।' : 'No hearings currently scheduled.'}
          </div>
        ) : (
          mutations.map((mut) => (
            <div key={mut.id} className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs p-5 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5">
                <span className="font-mono font-bold text-xs text-indigo-900 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded border border-indigo-200 dark:border-indigo-800">
                  {mut.mutation_case_no}
                </span>
                <span className="text-xs font-bold text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded border border-blue-200 dark:border-blue-800 flex items-center gap-1">
                  <CalendarCheck size={12} />
                  {isBn ? 'শুনানি:' : 'Hearing:'} {mut.hearing_date}
                </span>
              </div>
              <div className="text-xs space-y-1 text-slate-600 dark:text-slate-400">
                <p><span className="text-slate-400">{isBn ? 'দলিল নম্বর:' : 'Deed No:'}</span> <span className="font-mono font-semibold text-slate-800 dark:text-slate-200">{mut.deed_no || '3409/2026'}</span></p>
                <p>
                  <span className="text-slate-400">{isBn ? 'মৌজা ও দাগ:' : 'Mouza & Plot:'}</span> {formatMouza(mut, isBn)}, {formatPlot(mut.dag_no, isBn)}, {formatKhatian(mut.khatian_no, isBn)}
                </p>
                <p><span className="text-slate-400">{isBn ? 'হস্তান্তরিত পরিমাণ:' : 'Transferred Area:'}</span> <span className="font-bold text-emerald-800 dark:text-emerald-400">{formatArea(mut.transferred_area_decimal, isBn)}</span></p>
              </div>
              <div className="text-right pt-2 border-t border-slate-100 dark:border-slate-800">
                <Link
                  to="/office/ac-land/mutation"
                  className="inline-flex items-center gap-1 text-indigo-700 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300 font-semibold text-xs"
                >
                  {isBn ? 'এজলাসে প্রবেশ করুন' : 'Enter Hearing Court'}
                  <ArrowRight size={13} />
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AcLandHearingsPage;
