import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../../services/api';
import { SaleApplication } from '../../../types';
import { Calendar, Clock, ArrowRight, Stamp, UserCheck, Search } from 'lucide-react';

export const RegistryAppointmentsPage: React.FC = () => {
  const [applications, setApplications] = useState<SaleApplication[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const res = await api.officer.registryQueue();
        if (res.success && res.scheduled_queue) {
          setApplications(res.scheduled_queue);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();
  }, []);

  return (
    <div className="space-y-6 font-bengali">
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <Calendar className="text-amber-700" size={20} />
          নির্ধারিত রেজিস্ট্রেশন অ্যাপয়েন্টমেন্ট সূচী ও দৈনিক হাজিরা তালিকা
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          দলিল সম্পাদন ও স্বাক্ষরের জন্য ধার্যকৃত সময়সূচী এবং সেবাগ্রহীতাদের টোকেন তালিকা
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {loading ? (
          <div className="col-span-2 py-8 text-center text-slate-500 text-xs">
            <Clock size={16} className="animate-spin inline-block mr-2" />
            অ্যাপয়েন্টমেন্ট লোড হচ্ছে...
          </div>
        ) : applications.length === 0 ? (
          <div className="col-span-2 bg-white rounded-xl border border-slate-200 p-8 text-center text-slate-500 text-xs">
            বর্তমানে কোন নির্ধারিত অ্যাপয়েন্টমেন্ট নেই।
          </div>
        ) : (
          applications.map((app) => (
            <div key={app.id} className="bg-white rounded-xl border border-slate-200 shadow-2xs p-5 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                <span className="font-mono font-bold text-xs text-amber-900 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                  {app.application_no}
                </span>
                <span className="text-xs font-bold text-blue-800 bg-blue-50 px-2.5 py-0.5 rounded border border-blue-200 flex items-center gap-1 font-mono">
                  টোকেন: {app.appointment_details?.token_no || 'TOK-8812'}
                </span>
              </div>

              <div className="bg-amber-50/60 p-3 rounded-lg border border-amber-200 text-xs space-y-1">
                <p className="font-bold text-amber-950 flex items-center gap-1.5">
                  <Calendar size={13} className="text-amber-800" />
                  তারিখ: {app.appointment_details?.date || '২০২৬-০৩-২০'} ({app.appointment_details?.time || 'সকাল ১১:০০ মি.'})
                </p>
                <p className="text-slate-600 text-[11px]">
                  স্থান: {app.appointment_details?.office_name_bn || 'গুলশান সাব-রেজিস্ট্রি কার্যালয় (বুথ-২)'}
                </p>
              </div>

              <div className="text-xs space-y-1 text-slate-700">
                <p><span className="text-slate-400">বিক্রেতা:</span> <span className="font-semibold text-slate-900">{app.seller?.name_bn}</span></p>
                <p><span className="text-slate-400">ক্রেতা:</span> <span className="font-semibold text-slate-900">{app.buyer?.name_bn}</span></p>
                <p><span className="text-slate-400">জমি:</span> {app.parcel?.mouza_bn}, দাগ: {app.parcel?.dag_no} ({app.proposed_area_decimal} শতক)</p>
              </div>

              <div className="text-right pt-2 border-t border-slate-100">
                <Link
                  to={`/office/registry/applications/${app.id}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-lg text-xs transition"
                >
                  <Stamp size={13} />
                  দলিল সম্পাদন রেকর্ড করুন
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default RegistryAppointmentsPage;
