import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../../services/api';
import { MutationApplication } from '../../../types';
import { StatusBadge } from '../../../components/common/StatusBadge';
import { FileCheck, Award, Clock, ArrowRight, Scale, XCircle } from 'lucide-react';

export const AcLandDecisionsPage: React.FC = () => {
  const [mutations, setMutations] = useState<MutationApplication[]>([]);
  const [loading, setLoading] = useState(true);

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
    <div className="space-y-6 font-bengali">
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <FileCheck className="text-indigo-700" size={20} />
          রাজস্ব আদালতের চূড়ান্ত আদেশ ও রায় রেজিস্টার
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          সহকারী কমিশনার (ভূমি) কর্তৃক অনুমোদিত নতুন নামজারি খতিয়ানসমূহ এবং খারিজকৃত আদেশের মহাফেজখানা রেকর্ড
        </p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
                <th className="py-3 px-4">নামজারি কেস ও দলিল নং</th>
                <th className="py-3 px-4">মৌজা ও দাগ নং</th>
                <th className="py-3 px-4">জমির পরিমাণ</th>
                <th className="py-3 px-4">রায় ও সৃজিত খতিয়ান নং</th>
                <th className="py-3 px-4">স্থিতি</th>
                <th className="py-3 px-4 text-right">নথি</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500">
                    <Clock size={16} className="animate-spin inline-block mr-2" />
                    আদেশ তালিকা লোড হচ্ছে...
                  </td>
                </tr>
              ) : mutations.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500">
                    কোন চূড়ান্ত আদেশ পাওয়া যায়নি।
                  </td>
                </tr>
              ) : (
                mutations.map((mut) => (
                  <tr key={mut.id} className="hover:bg-slate-50/70 transition">
                    <td className="py-3 px-4">
                      <span className="font-mono font-bold text-indigo-900 block">{mut.mutation_case_no}</span>
                      <span className="text-[11px] text-slate-500">দলিল নং: {mut.deed_no || '৩৪০৯/২০২৬'}</span>
                    </td>
                    <td className="py-3 px-4 text-slate-700">
                      {mut.mouza_bn}, দাগ: {mut.dag_no}
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-800">
                      {mut.transferred_area_decimal} শতক
                    </td>
                    <td className="py-3 px-4">
                      {mut.approved_khatian_no ? (
                        <span className="font-mono font-bold text-purple-900 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                          {mut.approved_khatian_no}
                        </span>
                      ) : (
                        <span className="text-slate-400">খতিয়ান প্রযোজ্য নয় (খারিজ)</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <StatusBadge status={mut.status} />
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Link
                        to="/office/ac-land/mutation"
                        className="inline-flex items-center gap-1 text-indigo-700 hover:text-indigo-900 font-semibold"
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

export default AcLandDecisionsPage;
