import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import { ShoppingBag, ShieldCheck, FileText, Clock, MapPin } from 'lucide-react';
import { StatusBadge } from '../../components/common/StatusBadge';
import { DeedDraftModal } from '../../components/common/DeedDraftModal';
import { useLanguage } from '../../context/LanguageContext';
import {
  formatName,
  formatMouza,
  formatPlot,
  formatKhatian,
  formatArea,
  formatDigits,
} from '../../utils/bilingual';

export const DealsPage: React.FC = () => {
  const { language } = useLanguage();
  const isBn = language === 'bn';
  const [deals, setDeals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDealForDeed, setSelectedDealForDeed] = useState<any | null>(null);

  useEffect(() => {
    const fetchDeals = async () => {
      setLoading(true);
      const res = await api.getMyApplications();
      if (res.success && res.data) {
        setDeals(res.data);
      }
      setLoading(false);
    };
    fetchDeals();
  }, []);

  return (
    <div className={`${isBn ? 'font-bengali' : 'font-sans'} space-y-6`}>
      <div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
          <ShoppingBag className="text-emerald-700 dark:text-emerald-400" size={24} />
          {isBn
            ? 'আমার ক্রয়-বিক্রয় ও চুক্তিপত্র (Deals & Purchase Agreements)'
            : 'My Land Deals & Purchase Agreements'}
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          {isBn
            ? 'ক্রেতা ও বিক্রেতা হিসেবে সম্পাদিত বিক্রয় চুক্তি, বায়না ও রেজিস্ট্রেশন নথিপত্র'
            : 'Formal sales contracts, earnest deeds, and deed execution dockets as buyer or seller'}
        </p>
      </div>

      {loading ? (
        <div className="py-12 text-center text-slate-500 dark:text-slate-400 text-xs">
          <Clock size={18} className="animate-spin inline-block mr-2 text-emerald-600" />
          <span>{isBn ? 'চুক্তি ও লেনদেন লোড হচ্ছে...' : 'Loading deals and agreements...'}</span>
        </div>
      ) : deals.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-12 text-center border border-slate-200 dark:border-slate-800 space-y-2 shadow-2xs">
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
            {isBn ? 'কোনো ক্রয়-বিক্রয় চুক্তি নেই' : 'No active purchase agreements found'}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {isBn
              ? 'নতুন জমি কেনার প্রস্তাব আসলে তা এখানে প্রদর্শিত হবে।'
              : 'New purchase offers and signed agreements will appear here.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {deals.map((deal) => {
            const sellerName = formatName(deal.seller, isBn, 'Md. Rafiqul Islam');
            const buyerName = formatName(deal.buyer, isBn, 'Farhan Ahmed');
            const mouza = formatMouza(deal.parcel, isBn);

            return (
              <div
                key={deal.id}
                className="bg-white dark:bg-slate-900 rounded-2xl shadow-gov-sm border border-slate-200 dark:border-slate-800 p-5 sm:p-6 space-y-4 transition-colors"
              >
                {/* Header: App No + Status */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      {isBn ? 'চুক্তি/আবেদন নং:' : 'Agreement/App No:'}
                    </span>
                    <strong className="text-sm font-mono text-emerald-800 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-800/80 font-bold">
                      {deal.application_no}
                    </strong>
                  </div>
                  <StatusBadge stage={deal.stage} />
                </div>

                {/* Inner Particulars Box (Dark Theme Fixed) */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs bg-slate-50/80 dark:bg-slate-800/60 p-4 rounded-xl border border-slate-200/80 dark:border-slate-700/70 transition-colors">
                  <div>
                    <span className="text-slate-400 dark:text-slate-400 text-[11px] block">
                      {isBn ? 'বিক্রেতা:' : 'Seller:'}
                    </span>
                    <strong className="text-slate-900 dark:text-slate-100 font-semibold text-xs mt-0.5 block truncate">
                      {sellerName}
                    </strong>
                  </div>

                  <div>
                    <span className="text-slate-400 dark:text-slate-400 text-[11px] block">
                      {isBn ? 'ক্রেতা:' : 'Buyer:'}
                    </span>
                    <strong className="text-slate-900 dark:text-slate-100 font-semibold text-xs mt-0.5 block truncate">
                      {buyerName}
                    </strong>
                  </div>

                  <div>
                    <span className="text-slate-400 dark:text-slate-400 text-[11px] block">
                      {isBn ? 'জমির পরিমাণ:' : 'Land Area:'}
                    </span>
                    <strong className="text-emerald-700 dark:text-emerald-400 font-bold font-mono text-sm mt-0.5 block">
                      {formatArea(deal.proposed_area_decimal, isBn, true)}
                    </strong>
                  </div>

                  <div>
                    <span className="text-slate-400 dark:text-slate-400 text-[11px] block">
                      {isBn ? 'মোট মূল্য:' : 'Agreed Price:'}
                    </span>
                    <strong className="text-slate-900 dark:text-white font-mono font-bold text-sm mt-0.5 block">
                      ৳ {formatDigits(deal.agreed_price_bdt?.toLocaleString(isBn ? 'bn-BD' : 'en-US') || deal.agreed_price_bdt, isBn)}
                    </strong>
                  </div>
                </div>

                {/* Footer Strip & Actions */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-1 text-xs">
                  <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                    <MapPin size={14} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span>
                      {formatPlot(deal.parcel?.dag_no, isBn)} ({mouza})
                      {deal.parcel?.khatian_no && ` · ${formatKhatian(deal.parcel.khatian_no, isBn)}`}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 whitespace-nowrap">
                    <Link
                      to={`/verify-land?parcel_id=${deal.parcel?.id}`}
                      className="inline-flex items-center gap-1.5 text-teal-800 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/60 border border-teal-300 dark:border-teal-800/80 px-3 py-1.5 rounded-lg font-semibold hover:bg-teal-100 dark:hover:bg-teal-900/50 transition whitespace-nowrap shrink-0 text-xs cursor-pointer"
                    >
                      <ShieldCheck size={14} className="shrink-0 text-teal-600 dark:text-teal-400" />
                      <span>{isBn ? 'ঝুঁকি পুনঃযাচাই' : 'Re-verify Risk'}</span>
                    </Link>

                    <button
                      onClick={() => setSelectedDealForDeed(deal)}
                      className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white dark:bg-emerald-600 dark:hover:bg-emerald-500 px-3.5 py-1.5 rounded-lg font-bold transition shadow-2xs whitespace-nowrap shrink-0 text-xs cursor-pointer"
                    >
                      <FileText size={14} className="shrink-0" />
                      <span>{isBn ? 'খসড়া চুক্তিপত্র প্রিন্ট' : 'Print Draft Deed'}</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {selectedDealForDeed && (
        <DeedDraftModal
          application={selectedDealForDeed}
          onClose={() => setSelectedDealForDeed(null)}
        />
      )}
    </div>
  );
};

export default DealsPage;
