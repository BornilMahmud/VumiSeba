import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import { SaleApplication } from '../../types';
import { StatusBadge } from '../../components/common/StatusBadge';
import { FileSpreadsheet, Search, Clock, ArrowRight, Building2, Landmark, Stamp, Scale, RefreshCw } from 'lucide-react';

export const AdminApplicationsPage: React.FC = () => {
  const [applications, setApplications] = useState<SaleApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [stageFilter, setStageFilter] = useState('ALL');

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const res = await api.officer.adminStats();
      if (res.success && res.applications) {
        setApplications(res.applications);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const getResponsibleOffice = (stage: string) => {
    if (stage === 'UNION_REVIEW_PENDING' || stage === 'SUBMITTED' || stage === 'draft') {
      return { name: 'ইউনিয়ন ভূমি অফিস', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' };
    }
    if (stage === 'RETURNED_FOR_CORRECTION') {
      return { name: 'নাগরিক সংশোধন কিউ', color: 'text-amber-700 bg-amber-50 border-amber-200' };
    }
    if (stage === 'AC_LAND_REVIEW_PENDING' || stage === 'UNION_APPROVED') {
      return { name: 'এসি ল্যান্ড অফিস', color: 'text-indigo-700 bg-indigo-50 border-indigo-200' };
    }
    if (stage === 'REGISTRATION_READY' || stage === 'APPOINTMENT_SCHEDULED') {
      return { name: 'সাব-রেজিস্ট্রি অফিস', color: 'text-amber-900 bg-amber-50 border-amber-200' };
    }
    if (stage === 'REGISTRATION_COMPLETED' || stage === 'MUTATION_PENDING' || stage === 'HEARING_SCHEDULED') {
      return { name: 'এসি ল্যান্ড নামজারি আদালত', color: 'text-purple-700 bg-purple-50 border-purple-200' };
    }
    if (stage === 'MUTATION_APPROVED') {
      return { name: 'চূড়ান্ত রেকর্ড নিষ্পত্তিকৃত', color: 'text-emerald-900 bg-emerald-100 border-emerald-300' };
    }
    return { name: 'নিষ্পত্তিকৃত / বাতিল', color: 'text-rose-700 bg-rose-50 border-rose-200' };
  };

  const filtered = applications.filter((app) => {
    const matchesSearch =
      (app.application_no || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (app.seller?.name_bn || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (app.buyer?.name_bn || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (app.parcel?.khatian_no || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (app.parcel?.dag_no || '').toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;
    if (stageFilter === 'ALL') return true;
    return app.stage === stageFilter;
  });

  return (
    <div className="space-y-6 font-bengali">
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <FileSpreadsheet className="text-cyan-700" size={20} />
            জাতীয় ভূমি লেনদেন আবেদন তদারকি ও নিরীক্ষা
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            ইউনিয়ন তহশিল, এসি ল্যান্ড আদালত ও সাব-রেজিস্ট্রিতে চলমান সকল ফাইলের সার্বিক ট্র্যাকিং
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search size={15} className="absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="আবেদন নং, নাম বা দাগ..."
              className="pl-9 pr-3 py-1.5 border border-slate-300 rounded-lg text-xs w-56 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>
          <button
            onClick={fetchApplications}
            className="p-1.5 border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-50"
            title="রিফ্রেশ"
          >
            <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
                <th className="py-3 px-4">আবেদন নম্বর</th>
                <th className="py-3 px-4">পক্ষগণ (বিক্রেতা → ক্রেতা)</th>
                <th className="py-3 px-4">জমির তপশিল</th>
                <th className="py-3 px-4">হস্তান্তরিত পরিমাণ</th>
                <th className="py-3 px-4">দায়িত্বশীল দপ্তর</th>
                <th className="py-3 px-4">বর্তমান অবস্থা</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500">
                    <Clock size={16} className="animate-spin inline-block mr-2" />
                    আবেদন তালিকা লোড হচ্ছে...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500">
                    কোন আবেদন পাওয়া যায়নি।
                  </td>
                </tr>
              ) : (
                filtered.map((app) => {
                  const office = getResponsibleOffice(app.stage);
                  return (
                    <tr key={app.id} className="hover:bg-slate-50/70 transition">
                      <td className="py-3 px-4">
                        <span className="font-mono font-bold text-slate-900 block">{app.application_no}</span>
                        <span className="text-[11px] text-slate-400">{app.submission_date || '২০২৬-০৩-১৫'}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-semibold text-slate-800 block">{app.seller?.name_bn}</span>
                        <span className="text-[11px] text-slate-500">ক্রেতা: {app.buyer?.name_bn}</span>
                      </td>
                      <td className="py-3 px-4 text-slate-700">
                        {app.parcel?.mouza_bn}, দাগ: {app.parcel?.dag_no}
                      </td>
                      <td className="py-3 px-4 font-semibold text-slate-800">
                        {app.proposed_area_decimal} শতক
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-semibold border ${office.color}`}>
                          {office.name}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <StatusBadge status={app.stage} />
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

export default AdminApplicationsPage;
