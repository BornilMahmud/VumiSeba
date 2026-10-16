import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../../services/api';
import { SaleApplication } from '../../../types';
import { FileCheck2, CheckCircle2, Clock, ArrowRight, Search, FileText } from 'lucide-react';

export const UnionReportsPage: React.FC = () => {
  const [applications, setApplications] = useState<SaleApplication[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await api.officer.unionQueue();
        if (res.success && (res.all_applications || res.queue)) {
          const apps: SaleApplication[] = res.all_applications || res.queue;
          setApplications(apps.filter((a) => a.union_report));
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  return (
    <div className="space-y-6 font-bengali">
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <FileCheck2 className="text-emerald-700" size={20} />
          ইউনিয়ন ভূমি সহকারী কর্মকর্তার সরেজমিন প্রতিবেদনসমূহ
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          অনুমোদনকৃত এবং এসি ল্যান্ড কার্যালয়ে প্রেরিত সরেজমিন পরিদর্শন ও সীমানা প্রতিবেদন
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {loading ? (
          <div className="col-span-2 py-8 text-center text-slate-500">
            <Clock size={18} className="animate-spin inline-block mr-2" />
            প্রতিবেদন লোড হচ্ছে...
          </div>
        ) : applications.length === 0 ? (
          <div className="col-span-2 bg-white rounded-xl border border-slate-200 p-8 text-center text-slate-500 text-xs">
            এখনও কোন আনুষ্ঠানিক ইউনিয়ন প্রতিবেদন দাখিল করা হয়নি।
          </div>
        ) : (
          applications.map((app) => (
            <div key={app.id} className="bg-white rounded-xl border border-slate-200 shadow-2xs p-5 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                <span className="font-mono font-bold text-xs text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  {app.application_no}
                </span>
                <span className="text-[11px] text-slate-400">
                  দাখিল: {app.union_report?.submitted_at || 'যাচাইকৃত'}
                </span>
              </div>
              <div className="text-xs space-y-1">
                <p><span className="text-slate-400">বিক্রেতা:</span> <span className="font-semibold text-slate-800">{app.seller?.name_bn}</span></p>
                <p><span className="text-slate-400">ক্রেতা:</span> <span className="font-semibold text-slate-800">{app.buyer?.name_bn}</span></p>
                <p><span className="text-slate-400">জমির তপশিল:</span> {app.parcel?.mouza_bn}, খতিয়ান: {app.parcel?.khatian_no}, দাগ: {app.parcel?.dag_no}</p>
              </div>
              <div className="bg-emerald-50/60 p-3 rounded-lg border border-emerald-200 text-xs text-slate-700">
                <p className="font-bold text-emerald-900 mb-1">সরেজমিন পর্যবেক্ষণ:</p>
                <p className="italic">"{app.union_report?.field_findings_bn || app.union_report?.recommendation_bn || 'দখল ও রেকর্ড যাচাই সম্পন্ন।'}"</p>
              </div>
              <div className="text-right pt-2">
                <Link
                  to={`/office/union/applications/${app.id}`}
                  className="inline-flex items-center gap-1 text-emerald-700 hover:text-emerald-900 font-semibold text-xs"
                >
                  সম্পূর্ণ নথি দেখুন
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

export default UnionReportsPage;
