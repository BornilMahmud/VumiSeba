import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../../services/api';
import { SaleApplication } from '../../../types';
import {
  FileCheck2,
  Clock,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  MapPin,
  Calendar,
  FileText,
  Search,
  Filter,
} from 'lucide-react';
import { useLanguage } from '../../../context/LanguageContext';
import {
  formatName,
  formatMouza,
  formatPlot,
  formatKhatian,
  formatArea,
} from '../../../utils/bilingual';

export const UnionReportsPage: React.FC = () => {
  const [applications, setApplications] = useState<SaleApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const { language } = useLanguage();
  const isBn = language === 'bn';

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

  const filteredApps = applications.filter((app) => {
    const q = searchQuery.toLowerCase();
    const appNo = (app.application_no || '').toLowerCase();
    const seller = (app.seller?.name_bn || app.seller?.name_en || '').toLowerCase();
    const buyer = (app.buyer?.name_bn || app.buyer?.name_en || '').toLowerCase();
    const dag = (app.parcel?.dag_no || '').toLowerCase();
    const mouza = (app.parcel?.mouza || app.parcel?.mouza_bn || app.parcel?.mouza_en || '').toLowerCase();
    return appNo.includes(q) || seller.includes(q) || buyer.includes(q) || dag.includes(q) || mouza.includes(q);
  });

  return (
    <div className={`space-y-6 ${isBn ? 'font-bengali' : 'font-sans'}`}>
      {/* Page Header */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-gov-sm transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400 flex items-center justify-center border border-emerald-300 dark:border-emerald-500/30">
              <FileCheck2 size={18} />
            </div>
            {isBn
              ? 'ইউনিয়ন ভূমি সহকারী কর্মকর্তার সরেজমিন প্রতিবেদনসমূহ'
              : 'Union Land Assistant Officer (ULAO) Field Reports'}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {isBn
              ? 'অনুমোদনকৃত এবং এসি ল্যান্ড কার্যালয়ে প্রেরিত সরেজমিন পরিদর্শন, সীমানা ও দখল প্রতিবেদন'
              : 'Approved and submitted ground inspection, physical boundary, and possession reports transmitted to AC Land Office'}
          </p>
        </div>

        {/* Quick Stats Badges */}
        <div className="flex items-center gap-2 self-start sm:self-auto text-xs">
          <span className="font-mono text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/80 px-3 py-1.5 rounded-lg border border-emerald-200 dark:border-emerald-800/80 flex items-center gap-1.5 font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
            {applications.length} {isBn ? 'টি দাখিলকৃত প্রতিবেদন' : 'Reports Filed'}
          </span>
        </div>
      </div>

      {/* Search / Filter Bar */}
      <div className="bg-white dark:bg-slate-900 p-3 sm:p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors">
        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
          <Filter size={14} className="text-emerald-600 dark:text-emerald-400" />
          <span className="font-semibold text-slate-700 dark:text-slate-300">
            {isBn ? 'সরেজমিন অনুমোদিত ডকেট তালিকা' : 'Inspected & Approved Dockets'}
          </span>
          <span className="text-slate-400">({filteredApps.length})</span>
        </div>

        <div className="relative min-w-[240px]">
          <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder={isBn ? 'আবেদন নং, নাম বা দাগ দিয়ে খুঁজুন...' : 'Search app no, name or plot...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-1 focus:ring-emerald-500 transition-colors"
          />
        </div>
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {loading ? (
          <div className="col-span-1 md:col-span-2 py-12 text-center text-slate-500 dark:text-slate-400">
            <Clock size={20} className="animate-spin inline-block mr-2 text-emerald-600" />
            <span className="text-xs">{isBn ? 'সরেজমিন প্রতিবেদনসমূহ লোড হচ্ছে...' : 'Loading field reports...'}</span>
          </div>
        ) : filteredApps.length === 0 ? (
          <div className="col-span-1 md:col-span-2 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-10 text-center text-slate-500 dark:text-slate-400 text-xs shadow-2xs">
            <FileText size={24} className="mx-auto mb-2 text-slate-400" />
            <p className="font-semibold text-slate-700 dark:text-slate-300">
              {isBn ? 'কোনো সরেজমিন প্রতিবেদন পাওয়া যায়নি।' : 'No field reports found matching your search.'}
            </p>
            <p className="text-[11px] mt-1 text-slate-400">
              {isBn ? 'ইউনিয়ন ড্যাশবোর্ড থেকে তদন্ত সম্পন্ন করে প্রতিবেদন দাখিল করুন।' : 'Inspect pending cases and submit reports from Union Dashboard.'}
            </p>
          </div>
        ) : (
          filteredApps.map((app) => {
            const sellerName = formatName(app.seller, isBn, 'Md. Rafiqul Islam');
            const buyerName = formatName(app.buyer, isBn, 'Farhan Ahmed');
            const mouza = formatMouza(app.parcel, isBn);

            const findings = isBn
              ? app.union_report?.field_findings_bn || app.union_report?.recommendation_bn || 'দখল ও রেকর্ড সরেজমিনে যাচাই সম্পন্ন।'
              : app.union_report?.field_findings_en || app.union_report?.recommendation_en || 'Physical possession and record verified on-site.';

            const submittedDate = app.union_report?.submitted_at
              ? (isBn
                  ? app.union_report.submitted_at
                  : new Date(app.union_report.submitted_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    }))
              : (isBn ? '২০২৬-০৩-০১' : 'Mar 1, 2026');

            return (
              <div
                key={app.id}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-gov-sm hover:shadow-gov-md hover:border-emerald-300 dark:hover:border-emerald-700/60 transition-all p-5 flex flex-col justify-between space-y-4"
              >
                {/* Header: Application Badge + Status + Date */}
                <div className="flex items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800/80 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-xs text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-200 dark:border-emerald-800/80 px-2.5 py-1 rounded-lg">
                      {app.application_no}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-100/80 dark:bg-emerald-900/40 px-2 py-0.5 rounded-full border border-emerald-300/80 dark:border-emerald-800/60">
                      <CheckCircle2 size={11} className="text-emerald-600 dark:text-emerald-400" />
                      {isBn ? 'যাচাইকৃত' : 'Filed: Verified'}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                    <Calendar size={12} className="text-slate-400" />
                    <span>{submittedDate}</span>
                  </div>
                </div>

                {/* Parties Bento Box */}
                <div className="bg-slate-50/80 dark:bg-slate-800/50 rounded-xl p-3 border border-slate-200/70 dark:border-slate-700/60 space-y-2.5">
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="space-y-0.5 min-w-0">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block">
                        {isBn ? 'বিক্রেতা' : 'Seller'}
                      </span>
                      <p className="font-bold text-slate-900 dark:text-white truncate" title={sellerName}>
                        {sellerName}
                      </p>
                    </div>

                    <div className="space-y-0.5 min-w-0 border-l border-slate-200 dark:border-slate-700/80 pl-3">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block">
                        {isBn ? 'ক্রেতা' : 'Buyer'}
                      </span>
                      <p className="font-bold text-emerald-700 dark:text-emerald-400 truncate" title={buyerName}>
                        {buyerName}
                      </p>
                    </div>
                  </div>

                  {/* Land Schedule Strip */}
                  <div className="border-t border-slate-200/60 dark:border-slate-700/60 pt-2 flex items-center justify-between text-[11px] text-slate-600 dark:text-slate-300">
                    <div className="flex items-center gap-1.5 truncate">
                      <MapPin size={13} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
                      <span className="font-semibold text-slate-800 dark:text-slate-200">{mouza}</span>
                      <span className="text-slate-400">·</span>
                      <span className="font-mono">{formatKhatian(app.parcel?.khatian_no, isBn)}</span>
                      <span className="text-slate-400">·</span>
                      <span className="font-mono">{formatPlot(app.parcel?.dag_no, isBn)}</span>
                    </div>
                    {app.proposed_area_decimal && (
                      <span className="font-mono font-bold text-emerald-700 dark:text-emerald-400 text-[11px] shrink-0 ml-2">
                        {formatArea(app.proposed_area_decimal, isBn, true)}
                      </span>
                    )}
                  </div>
                </div>

                {/* Field Findings Callout */}
                <div className="bg-gradient-to-br from-emerald-50/70 via-teal-50/30 to-white dark:from-emerald-950/40 dark:via-slate-900 dark:to-slate-900 border border-emerald-200/90 dark:border-emerald-800/60 rounded-xl p-3.5 space-y-1.5 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-emerald-900 dark:text-emerald-300 flex items-center gap-1.5">
                      <ShieldCheck size={14} className="text-emerald-600 dark:text-emerald-400" />
                      {isBn ? 'সরেজমিন পর্যবেক্ষণ ও মতামত:' : 'Field Findings:'}
                    </span>
                    <span className="text-[10px] font-semibold text-emerald-800 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-900/60 px-2 py-0.5 rounded-full border border-emerald-300/80 dark:border-emerald-700/60">
                      {isBn ? 'দখল নিশ্চিত' : 'Possession Verified'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-700 dark:text-slate-300 italic leading-relaxed pl-2.5 border-l-2 border-emerald-500 dark:border-emerald-500/80">
                    "{findings}"
                  </p>
                </div>

                {/* Footer Action Bar */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800/80">
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
                    <FileText size={13} className="text-slate-400" />
                    <span>{isBn ? 'এসি ল্যান্ড দপ্তরে প্রেরিত' : 'Transmitted to AC Land'}</span>
                  </div>

                  <Link
                    to={`/office/union/applications/${app.id}`}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-2xs hover:shadow-xs transition group cursor-pointer"
                  >
                    <span>{isBn ? 'সম্পূর্ণ নথি দেখুন' : 'View Full File'}</span>
                    <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default UnionReportsPage;
