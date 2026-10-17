import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../../services/api';
import { SaleApplication } from '../../../types';
import { Calendar, Clock, ArrowRight, Stamp, UserCheck, Search } from 'lucide-react';
import { useLanguage } from '../../../context/LanguageContext';
import { formatName, formatMouza, formatPlot, formatArea } from '../../../utils/bilingual';

export const RegistryAppointmentsPage: React.FC = () => {
  const [applications, setApplications] = useState<SaleApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const { language } = useLanguage();
  const isBn = language === 'bn';

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
    <div className={`space-y-6 ${isBn ? 'font-bengali' : 'font-sans'}`}>
      <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Calendar className="text-amber-700 dark:text-amber-400" size={20} />
          {isBn ? 'নির্ধারিত রেজিস্ট্রেশন অ্যাপয়েন্টমেন্ট সূচী ও দৈনিক হাজিরা তালিকা' : 'Scheduled Registration Appointments & Daily Roll'}
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          {isBn
            ? 'দলিল সম্পাদন ও স্বাক্ষরের জন্য ধার্যকৃত সময়সূচী এবং সেবাগ্রহীতাদের টোকেন তালিকা'
            : 'Scheduled appointment slots, citizen tokens, and biometric execution queues'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {loading ? (
          <div className="col-span-2 py-8 text-center text-slate-500 dark:text-slate-400 text-xs">
            <Clock size={16} className="animate-spin inline-block mr-2" />
            {isBn ? 'অ্যাপয়েন্টমেন্ট লোড হচ্ছে...' : 'Loading appointments...'}
          </div>
        ) : applications.length === 0 ? (
          <div className="col-span-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-8 text-center text-slate-500 dark:text-slate-400 text-xs">
            {isBn ? 'বর্তমানে কোন নির্ধারিত অ্যাপয়েন্টমেন্ট নেই।' : 'No scheduled appointments currently.'}
          </div>
        ) : (
          applications.map((app) => (
            <div key={app.id} className="bg-white dark:bg-[#0c1427] rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-5 space-y-3.5 hover:border-slate-300 dark:hover:border-slate-700 transition">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5">
                <span className="font-mono font-bold text-xs text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 px-2.5 py-0.5 rounded border border-amber-200 dark:border-amber-700/60">
                  {app.application_no}
                </span>
                <span className="text-xs font-bold text-blue-800 dark:text-blue-200 bg-blue-50 dark:bg-blue-950/60 px-2.5 py-0.5 rounded border border-blue-200 dark:border-blue-700/60 flex items-center gap-1 font-mono">
                  {isBn ? 'টোকেন:' : 'Token:'} {app.appointment_details?.token_no || 'TOK-8812'}
                </span>
              </div>

              {/* Appointment Date, Time & Venue Card */}
              <div className="bg-slate-50 dark:bg-[#111a30] p-3 rounded-lg border border-slate-200/80 dark:border-slate-700/70 text-xs space-y-1.5">
                <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
                  <span className="p-1 rounded bg-amber-100 dark:bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-300/60 dark:border-amber-500/30">
                    <Calendar size={13} />
                  </span>
                  <span className="text-amber-800 dark:text-amber-300">
                    {isBn ? 'তারিখ:' : 'Date:'}{' '}
                    <span className="text-slate-900 dark:text-slate-100 font-bold font-mono">
                      {app.appointment_details?.date || '2026-04-22'}
                    </span>
                  </span>
                  <span className="text-slate-400 dark:text-slate-500">·</span>
                  <span className="text-slate-700 dark:text-slate-200 font-medium">
                    ({app.appointment_details?.time || (isBn ? 'সকাল ১১:০০ - ১২:০০ মি.' : '11:00 AM - 12:00 PM')})
                  </span>
                </div>
                <div className="text-[11px] text-slate-600 dark:text-slate-300 pl-6 flex items-center gap-1.5">
                  <span className="text-slate-400 dark:text-slate-400">{isBn ? 'স্থান:' : 'Location:'}</span>
                  <span className="font-medium text-slate-800 dark:text-slate-200">
                    {isBn ? (app.appointment_details?.office_name_bn || 'গুলশান সাব-রেজিস্ট্রি কার্যালয় (বুথ-২)') : 'Gulshan Sub-Registry Office (Booth-2)'}
                  </span>
                </div>
              </div>

              {/* Parties & Land Details */}
              <div className="text-xs space-y-1.5 pt-1 text-slate-700 dark:text-slate-200">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 dark:text-slate-300 font-medium">{isBn ? 'বিক্রেতা:' : 'Seller:'}</span>
                  <span className="font-semibold text-slate-900 dark:text-white">
                    {formatName(app.seller, isBn, 'Md. Arman Hossen Ripon')}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 dark:text-slate-300 font-medium">{isBn ? 'ক্রেতা:' : 'Buyer:'}</span>
                  <span className="font-semibold text-slate-900 dark:text-white">
                    {formatName(app.buyer, isBn, 'Farhan Ahmed')}
                  </span>
                </div>
                <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800/80 pt-1.5">
                  <span className="text-slate-500 dark:text-slate-300 font-medium">{isBn ? 'জমি:' : 'Land:'}</span>
                  <span className="font-medium text-slate-800 dark:text-slate-200">
                    {formatMouza(app.parcel, isBn)}, {formatPlot(app.parcel?.dag_no, isBn)}{' '}
                    <span className="text-emerald-700 dark:text-emerald-400 font-mono font-semibold">
                      ({formatArea(app.proposed_area_decimal, isBn)})
                    </span>
                  </span>
                </div>
              </div>

              <div className="text-right pt-2.5 border-t border-slate-100 dark:border-slate-800">
                <Link
                  to={`/office/registry/applications/${app.id}`}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-lg text-xs transition shadow-sm cursor-pointer"
                >
                  <Stamp size={13} />
                  {isBn ? 'দলিল সম্পাদন রেকর্ড করুন' : 'Record Deed Execution'}
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
