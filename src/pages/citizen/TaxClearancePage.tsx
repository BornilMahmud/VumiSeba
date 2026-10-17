import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Receipt, CheckCircle2, AlertTriangle, ShieldCheck, Printer, ArrowRight, Sparkles } from 'lucide-react';
import { StatusBadge } from '../../components/common/StatusBadge';
import { useLanguage } from '../../context/LanguageContext';
import {
  formatMouza,
  formatPlot,
  formatArea,
  formatDigits,
} from '../../utils/bilingual';

export const TaxClearancePage: React.FC = () => {
  const { language } = useLanguage();
  const isBn = language === 'bn';
  const [holdings, setHoldings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const fetchHoldingTaxes = async () => {
    setLoading(true);
    const res = await api.getMyHoldings();
    if (res.success && res.data) {
      setHoldings(res.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchHoldingTaxes();
  }, []);

  const handlePayTax = async (holdingId: string, parcelId: string, totalPayable: number) => {
    setPaymentProcessing(true);
    setSuccessMessage(null);
    const res = await api.payTaxDemo({
      holding_id: holdingId,
      parcel_id: parcelId,
      amount_bdt: totalPayable,
      payment_method: 'Nagad',
    });

    if (res.success) {
      setSuccessMessage(
        isBn
          ? (res.message_bn || 'ভূমি উন্নয়ন কর পরিশোধ সম্পন্ন হয়েছে এবং দাখিলা জারি করা হয়েছে!')
          : 'Land development tax payment completed and Dakhila receipt issued!'
      );
      await fetchHoldingTaxes();
    }
    setPaymentProcessing(false);
  };

  return (
    <div className={`space-y-6 ${isBn ? 'font-bengali' : 'font-sans'}`}>
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
          <Receipt className="text-gov-blue" size={24} />
          {isBn ? 'ভূমি উন্নয়ন কর ও দাখিলা' : 'Land Development Tax & Dakhila'}
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          {isBn
            ? 'অনলাইন হোল্ডিং কর যাচাই, ই-পেমেন্ট এবং বিক্রয়-পূর্ব বাধ্যতামূলক কর ছাড়পত্র সনদ'
            : 'Online holding tax verification, e-payment, and mandatory pre-sale tax clearance certificate'}
        </p>
      </div>

      {successMessage && (
        <div className="p-4 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-800 rounded-xl text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Tax Guard Notice */}
      <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 p-4 rounded-xl text-xs text-amber-900 dark:text-amber-200 leading-relaxed flex items-start gap-3">
        <AlertTriangle size={20} className="text-amber-600 shrink-0 mt-0.5" />
        <div>
          <strong className="block text-sm font-bold text-amber-950 dark:text-amber-100 mb-0.5">
            {isBn
              ? 'বাধ্যতামূলক রাজস্ব ছাড়পত্র নীতি (Server-side Tax Clearance Guard):'
              : 'Mandatory Revenue Clearance Guard (Server-side Validation):'}
          </strong>
          {isBn
            ? 'ভূমি ক্রয়-বিক্রয় আবেদন দাখিলের পূর্বে সংশ্লিষ্ট দাগ ও জোতের হালনাগাদ ভূমি উন্নয়ন কর পরিশোধিত থাকতে হবে। বকেয়া কর বিদ্যমান থাকলে স্বয়ংক্রিয়ভাবে বিক্রয় আবেদন দাখিল স্থগিত থাকবে।'
            : 'Up-to-date land development tax must be cleared for the relevant plot and holding before submitting a land sale application. Any arrears will automatically halt the application submission.'}
        </div>
      </div>

      {/* Holdings Tax List */}
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-gov-sm border border-slate-200 dark:border-slate-800 p-6 space-y-4">
        <h2 className="text-sm font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2">
          {isBn ? 'আমার হোল্ডিং ও কর হিসাবসমূহ' : 'My Holding & Tax Ledgers'}
        </h2>

        {loading ? (
          <p className="text-xs text-slate-500 dark:text-slate-400 py-4">
            {isBn ? 'কর রেকর্ড লোড হচ্ছে...' : 'Loading tax records...'}
          </p>
        ) : holdings.length === 0 ? (
          <p className="text-xs text-slate-500 dark:text-slate-400 py-6 text-center bg-slate-50 dark:bg-slate-800/60 rounded">
            {isBn ? 'কোনো হোল্ডিং অ্যাকাউন্ট যুক্ত নেই।' : 'No holding accounts linked.'}
          </p>
        ) : (
          <div className="space-y-4">
            {holdings.map((item, idx) => {
              const khajna = item.khajna;
              const hasDues = khajna && khajna.status === 'dues_pending' && khajna.total_payable_bdt > 0;

              return (
                <div
                  key={idx}
                  className={`p-5 rounded-xl border transition ${
                    hasDues
                      ? 'border-amber-300 dark:border-amber-800 bg-amber-50/40 dark:bg-amber-950/20'
                      : 'border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 dark:text-white text-sm">
                          {isBn ? 'হোল্ডিং নং' : 'Holding No.'} {khajna?.holding_no || 'HLD-BAD-8812'}
                        </span>
                        <StatusBadge status={khajna?.status || 'cleared'} />
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        {formatPlot(item.parcel?.dag_no, isBn)} ({formatMouza(item.parcel, isBn)}, {isBn ? 'জে.এল' : 'JL'} {formatDigits(item.parcel?.jl_no, isBn)}) | {isBn ? 'আমার অংশ:' : 'My Share:'} {formatArea(item.ownership?.area_decimal, isBn)}
                      </p>
                    </div>

                    <div className="text-left sm:text-right">
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 block">{isBn ? 'অর্থবছর' : 'Fiscal Year'}</span>
                      <strong className="text-xs text-slate-800 dark:text-slate-200 font-mono">
                        {isBn ? (khajna?.fiscal_year || '২০২৫-২০২৬') : formatDigits(khajna?.fiscal_year || '2025-2026', false)}
                      </strong>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-4 text-xs">
                    <div>
                      <span className="text-slate-500 dark:text-slate-400 block mb-0.5">{isBn ? 'বার্ষিক দাবি:' : 'Annual Demand:'}</span>
                      <strong className="text-slate-800 dark:text-slate-200 font-mono">
                        ৳ {isBn ? (khajna?.annual_demand_bdt || 450).toLocaleString('bn-BD') : (khajna?.annual_demand_bdt || 450).toLocaleString('en-US')}
                      </strong>
                    </div>
                    <div>
                      <span className="text-slate-500 dark:text-slate-400 block mb-0.5">{isBn ? 'বিগত বকেয়া (Arrears):' : 'Arrears (Previous):'}</span>
                      <strong className={`font-mono font-bold ${khajna?.arrears_bdt ? 'text-red-600 dark:text-red-400' : 'text-slate-800 dark:text-slate-200'}`}>
                        ৳ {isBn ? (khajna?.arrears_bdt || 0).toLocaleString('bn-BD') : (khajna?.arrears_bdt || 0).toLocaleString('en-US')}
                      </strong>
                    </div>
                    <div>
                      <span className="text-slate-500 dark:text-slate-400 block mb-0.5">{isBn ? 'মোট পরিশোধযোগ্য:' : 'Total Payable:'}</span>
                      <strong className={`font-mono text-base font-black ${hasDues ? 'text-red-700 dark:text-red-400' : 'text-emerald-700 dark:text-emerald-400'}`}>
                        ৳ {isBn ? (khajna?.total_payable_bdt || 0).toLocaleString('bn-BD') : (khajna?.total_payable_bdt || 0).toLocaleString('en-US')}
                      </strong>
                    </div>
                    <div>
                      <span className="text-slate-500 dark:text-slate-400 block mb-0.5">{isBn ? 'সর্বশেষ পরিশোধের তারিখ:' : 'Last Paid Date:'}</span>
                      <strong className="text-slate-700 dark:text-slate-300 font-mono">
                        {khajna?.last_paid_date || (isBn ? 'তথ্য নেই' : 'No record')}
                      </strong>
                    </div>
                  </div>

                  {/* Actions / Clearance details */}
                  <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
                    {hasDues ? (
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 w-full">
                        <span className="text-red-700 dark:text-red-400 font-semibold text-[11px]">
                          {isBn ? '⚠️ বকেয়া করের কারণে এই দাগের জমি বিক্রির আবেদন ব্লক থাকবে।' : '⚠️ Outstanding tax arrears block sale applications for this plot.'}
                        </span>
                        <button
                          onClick={() => handlePayTax(khajna.id, item.parcel.id, khajna.total_payable_bdt)}
                          disabled={paymentProcessing}
                          className="bg-gov-blue hover:bg-slate-900 text-white font-bold px-4 py-2 rounded-lg transition shadow-sm flex items-center gap-1.5 ml-auto cursor-pointer"
                        >
                          <Sparkles size={14} className="text-teal-300" />
                          <span>
                            {paymentProcessing
                              ? (isBn ? 'পরিশোধ হচ্ছে...' : 'Processing Payment...')
                              : (isBn ? '১-ক্লিকে বকেয়া পরিশোধ ও দাখিলা নিন (ডেমো)' : '1-Click Pay & Issue Dakhila (Demo)')}
                          </span>
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between w-full">
                        <span className="text-emerald-800 dark:text-emerald-300 font-medium flex items-center gap-1">
                          <CheckCircle2 size={15} className="text-emerald-600 dark:text-emerald-400" />
                          {isBn ? 'ভূমি উন্নয়ন কর হালনাগাদ রয়েছে। বিক্রয়ের জন্য অনুমোদিত।' : 'Land development tax is up to date. Approved for sale application.'}
                        </span>
                        <div className="space-x-2">
                          <button
                            onClick={() => window.print()}
                            className="text-gov-blue hover:underline font-semibold cursor-pointer"
                          >
                            {isBn ? 'দাখিলা প্রিন্ট করুন' : 'Print Dakhila Receipt'}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default TaxClearancePage;
