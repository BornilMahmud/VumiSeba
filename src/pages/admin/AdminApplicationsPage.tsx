import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import { SaleApplication } from '../../types';
import { StatusBadge } from '../../components/common/StatusBadge';
import { useLanguage } from '../../context/LanguageContext';
import { formatName, formatMouza, formatPlot, formatArea } from '../../utils/bilingual';
import { FileSpreadsheet, Search, Clock, ArrowRight, Building2, Landmark, Stamp, Scale, RefreshCw } from 'lucide-react';

export const AdminApplicationsPage: React.FC = () => {
  const { language } = useLanguage();
  const isBn = language === 'bn';
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
      return { 
        name: isBn ? 'ইউনিয়ন ভূমি অফিস' : 'Union Land Office', 
        color: 'text-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800' 
      };
    }
    if (stage === 'RETURNED_FOR_CORRECTION') {
      return { 
        name: isBn ? 'নাগরিক সংশোধন কিউ' : 'Citizen Correction Queue', 
        color: 'text-amber-700 bg-amber-50 dark:bg-amber-950/40 dark:text-amber-300 border-amber-200 dark:border-amber-800' 
      };
    }
    if (stage === 'AC_LAND_REVIEW_PENDING' || stage === 'UNION_APPROVED') {
      return { 
        name: isBn ? 'এসি ল্যান্ড অফিস' : 'AC Land Office', 
        color: 'text-indigo-700 bg-indigo-50 dark:bg-indigo-950/40 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800' 
      };
    }
    if (stage === 'REGISTRATION_READY' || stage === 'APPOINTMENT_SCHEDULED') {
      return { 
        name: isBn ? 'সাব-রেজিস্ট্রি অফিস' : 'Sub-Registry Office', 
        color: 'text-amber-900 bg-amber-50 dark:bg-amber-950/40 dark:text-amber-300 border-amber-200 dark:border-amber-800' 
      };
    }
    if (stage === 'REGISTRATION_COMPLETED' || stage === 'MUTATION_PENDING' || stage === 'HEARING_SCHEDULED') {
      return { 
        name: isBn ? 'এসি ল্যান্ড নামজারি আদালত' : 'AC Land Mutation Court', 
        color: 'text-purple-700 bg-purple-50 dark:bg-purple-950/40 dark:text-purple-300 border-purple-200 dark:border-purple-800' 
      };
    }
    if (stage === 'MUTATION_APPROVED') {
      return { 
        name: isBn ? 'চূড়ান্ত রেকর্ড নিষ্পত্তিকৃত' : 'Final Record Settled', 
        color: 'text-emerald-900 bg-emerald-100 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700' 
      };
    }
    return { 
      name: isBn ? 'নিষ্পত্তিকৃত / বাতিল' : 'Settled / Cancelled', 
      color: 'text-rose-700 bg-rose-50 dark:bg-rose-950/40 dark:text-rose-300 border-rose-200 dark:border-rose-800' 
    };
  };

  const filtered = applications.filter((app) => {
    const matchesSearch =
      (app.application_no || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (app.seller?.name_bn || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (app.seller?.name_en || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (app.buyer?.name_bn || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (app.buyer?.name_en || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (app.parcel?.khatian_no || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (app.parcel?.dag_no || '').toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;
    if (stageFilter === 'ALL') return true;
    return app.stage === stageFilter;
  });

  return (
    <div className={`space-y-6 ${isBn ? 'font-bengali' : 'font-sans'}`}>
      <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <FileSpreadsheet className="text-cyan-700 dark:text-cyan-400" size={20} />
            {isBn ? 'জাতীয় ভূমি লেনদেন আবেদন তদারকি ও নিরীক্ষা' : 'National Land Transfer Applications Oversight & Audit'}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {isBn 
              ? 'ইউনিয়ন তহশিল, এসি ল্যান্ড আদালত ও সাব-রেজিস্ট্রিতে চলমান সকল ফাইলের সার্বিক ট্র্যাকিং' 
              : 'End-to-end tracking of all files across Union Tehsil, AC Land Court, and Sub-Registry'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search size={15} className="absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={isBn ? 'আবেদন নং, নাম বা দাগ...' : 'App no, name or plot...'}
              className="pl-9 pr-3 py-1.5 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-lg text-xs w-56 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>
          <button
            onClick={fetchApplications}
            className="p-1.5 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
            title={isBn ? 'রিফ্রেশ' : 'Refresh'}
          >
            <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs overflow-hidden transition-colors">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-bold">
                <th className="py-3 px-4">{isBn ? 'আবেদন নম্বর' : 'Application No'}</th>
                <th className="py-3 px-4">{isBn ? 'পক্ষগণ (বিক্রেতা → ক্রেতা)' : 'Parties (Seller → Buyer)'}</th>
                <th className="py-3 px-4">{isBn ? 'জমির তপশিল' : 'Land Schedule'}</th>
                <th className="py-3 px-4">{isBn ? 'হস্তান্তরিত পরিমাণ' : 'Transferred Area'}</th>
                <th className="py-3 px-4">{isBn ? 'দায়িত্বশীল দপ্তর' : 'Responsible Office'}</th>
                <th className="py-3 px-4">{isBn ? 'বর্তমান অবস্থা' : 'Current Status'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500 dark:text-slate-400">
                    <Clock size={16} className="animate-spin inline-block mr-2" />
                    {isBn ? 'আবেদন তালিকা লোড হচ্ছে...' : 'Loading applications list...'}
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500 dark:text-slate-400">
                    {isBn ? 'কোন আবেদন পাওয়া যায়নি।' : 'No applications found.'}
                  </td>
                </tr>
              ) : (
                filtered.map((app) => {
                  const office = getResponsibleOffice(app.stage);
                  const sellerName = formatName(app.seller, isBn, 'Md. Rafiqul Islam');
                  const buyerName = formatName(app.buyer, isBn, 'Farhan Ahmed');
                  const mouzaName = formatMouza(app.parcel, isBn);
                  const dagLabel = formatPlot(app.parcel?.dag_no, isBn);
                  const areaLabel = formatArea(app.proposed_area_decimal, isBn, true);

                  return (
                    <tr key={app.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/60 transition whitespace-nowrap">
                      <td className="py-3 px-4 font-mono font-bold text-slate-900 dark:text-white whitespace-nowrap">
                        {app.application_no}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className="font-semibold text-slate-800 dark:text-slate-200">{sellerName}</span>
                        <span className="text-slate-400 mx-1.5">→</span>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400">
                          {isBn ? 'ক্রেতা: ' : 'Buyer: '}
                          {buyerName}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-700 dark:text-slate-300 whitespace-nowrap">
                        <span>{mouzaName}, {dagLabel}</span>
                      </td>
                      <td className="py-3 px-4 font-semibold text-slate-800 dark:text-slate-200 font-mono whitespace-nowrap">
                        {areaLabel}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-semibold border ${office.color}`}>
                          {office.name}
                        </span>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
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
