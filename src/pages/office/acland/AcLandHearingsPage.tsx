import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../../services/api';
import { MutationApplication } from '../../../types';
import { CalendarCheck, Clock, Scale, ArrowRight, User, MapPin } from 'lucide-react';

export const AcLandHearingsPage: React.FC = () => {
  const [mutations, setMutations] = useState<MutationApplication[]>([]);
  const [loading, setLoading] = useState(true);

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
    <div className="space-y-6 font-bengali">
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <CalendarCheck className="text-indigo-700" size={20} />
          নামজারি শুনানির সময়সূচী ও নোটিশ রেজিস্টার
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          উপজেলা রাজস্ব আদালতে নির্ধারিত শুনানির তারিখ, বাদী-বিবাদী নোটিশ ও শুনানির কার্যবিবরণী
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {loading ? (
          <div className="col-span-2 py-8 text-center text-slate-500 text-xs">
            <Clock size={16} className="animate-spin inline-block mr-2" />
            শুনানি সময়সূচী লোড হচ্ছে...
          </div>
        ) : mutations.length === 0 ? (
          <div className="col-span-2 bg-white rounded-xl border border-slate-200 p-8 text-center text-slate-500 text-xs">
            বর্তমানে কোন শুনানির তারিখ নির্ধারিত নেই।
          </div>
        ) : (
          mutations.map((mut) => (
            <div key={mut.id} className="bg-white rounded-xl border border-slate-200 shadow-2xs p-5 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                <span className="font-mono font-bold text-xs text-indigo-900 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                  {mut.mutation_case_no}
                </span>
                <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200 flex items-center gap-1">
                  <CalendarCheck size={12} />
                  শুনানি: {mut.hearing_date}
                </span>
              </div>
              <div className="text-xs space-y-1">
                <p><span className="text-slate-400">দলিল নম্বর:</span> <span className="font-mono font-semibold text-slate-800">{mut.deed_no || '৩৪০৯/২০২৬'}</span></p>
                <p><span className="text-slate-400">মৌজা ও দাগ:</span> {mut.mouza_bn}, দাগ: {mut.dag_no}, বায়া খতিয়ান: {mut.khatian_no}</p>
                <p><span className="text-slate-400">হস্তান্তরিত পরিমাণ:</span> <span className="font-bold text-emerald-800">{mut.transferred_area_decimal} শতক</span></p>
              </div>
              <div className="text-right pt-2 border-t border-slate-100">
                <Link
                  to="/office/ac-land/mutation"
                  className="inline-flex items-center gap-1 text-indigo-700 hover:text-indigo-900 font-semibold text-xs"
                >
                  এজলাসে প্রবেশ করুন
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
