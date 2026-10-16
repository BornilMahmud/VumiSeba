import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Receipt, CheckCircle2, AlertTriangle, ShieldCheck, Printer, ArrowRight, Sparkles } from 'lucide-react';
import { StatusBadge } from '../../components/common/StatusBadge';

export const TaxClearancePage: React.FC = () => {
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
      setSuccessMessage(res.message_bn || 'ভূমি উন্নয়ন কর পরিশোধ সম্পন্ন হয়েছে এবং দাখিলা জারি করা হয়েছে!');
      await fetchHoldingTaxes();
    }
    setPaymentProcessing(false);
  };

  return (
    <div className="font-bengali space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
          <Receipt className="text-gov-blue" size={24} />
          ভূমি উন্নয়ন কর ও দাখিলা (Land Development Tax & Dakhila)
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          অনলাইন হোল্ডিং কর যাচাই, ই-পেমেন্ট এবং বিক্রয়-পূর্ব বাধ্যতামূলক কর ছাড়পত্র সনদ
        </p>
      </div>

      {successMessage && (
        <div className="p-4 bg-emerald-50 text-emerald-900 border border-emerald-300 rounded-xl text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Tax Guard Notice */}
      <div className="bg-amber-50 border border-amber-300 p-4 rounded-xl text-xs text-amber-900 leading-relaxed flex items-start gap-3">
        <AlertTriangle size={20} className="text-amber-600 shrink-0 mt-0.5" />
        <div>
          <strong className="block text-sm font-bold text-amber-950 mb-0.5">
            বাধ্যতামূলক রাজস্ব ছাড়পত্র নীতি (Server-side Tax Clearance Guard):
          </strong>
          ভূমি ক্রয়-বিক্রয় আবেদন দাখিলের পূর্বে সংশ্লিষ্ট দাগ ও জোতের হালনাগাদ ভূমি উন্নয়ন কর পরিশোধিত থাকতে হবে। 
          বকেয়া কর বিদ্যমান থাকলে স্বয়ংক্রিয়ভাবে বিক্রয় আবেদন দাখিল স্থগিত থাকবে।
        </div>
      </div>

      {/* Holdings Tax List */}
      <div className="bg-white rounded-xl shadow-gov-sm border border-slate-200 p-6 space-y-4">
        <h2 className="text-sm font-bold text-slate-900 border-b pb-2">
          আমার হোল্ডিং ও কর হিসাবসমূহ
        </h2>

        {loading ? (
          <p className="text-xs text-slate-500 py-4">কর রেকর্ড লোড হচ্ছে...</p>
        ) : holdings.length === 0 ? (
          <p className="text-xs text-slate-500 py-6 text-center bg-slate-50 rounded">
            কোনো হোল্ডিং অ্যাকাউন্ট যুক্ত নেই।
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
                    hasDues ? 'border-amber-300 bg-amber-50/30' : 'border-slate-200 bg-slate-50/50'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-sm">
                          হোল্ডিং নং {khajna?.holding_no || 'HLD-BAD-8812'}
                        </span>
                        <StatusBadge status={khajna?.status || 'cleared'} />
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        দাগ নং {item.parcel?.dag_no} ({item.parcel?.mouza}, জে.এল {item.parcel?.jl_no}) | আমার অংশ: {item.ownership?.area_decimal} শতক
                      </p>
                    </div>

                    <div className="text-right">
                      <span className="text-[11px] text-slate-500 block">অর্থবছর</span>
                      <strong className="text-xs text-slate-800 font-mono">
                        {khajna?.fiscal_year || '২০২৫-২০২৬'}
                      </strong>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-4 text-xs">
                    <div>
                      <span className="text-slate-500 block mb-0.5">বার্ষিক দাবি:</span>
                      <strong className="text-slate-800 font-mono">৳ {khajna?.annual_demand_bdt || 450}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block mb-0.5">বিগত বকেয়া (Arrears):</span>
                      <strong className={`font-mono font-bold ${khajna?.arrears_bdt ? 'text-red-600' : 'text-slate-800'}`}>
                        ৳ {khajna?.arrears_bdt || 0}
                      </strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block mb-0.5">মোট পরিশোধযোগ্য:</span>
                      <strong className={`font-mono text-base font-black ${hasDues ? 'text-red-700' : 'text-emerald-700'}`}>
                        ৳ {khajna?.total_payable_bdt || 0}
                      </strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block mb-0.5">সর্বশেষ পরিশোধের তারিখ:</span>
                      <strong className="text-slate-700 font-mono">
                        {khajna?.last_paid_date || 'তথ্য নেই'}
                      </strong>
                    </div>
                  </div>

                  {/* Actions / Clearance details */}
                  <div className="pt-3 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
                    {hasDues ? (
                      <div className="flex items-center gap-3 w-full sm:w-auto">
                        <span className="text-red-700 font-semibold text-[11px]">
                          ⚠️ বকেয়া করের কারণে এই দাগের জমি বিক্রির আবেদন ব্লক থাকবে।
                        </span>
                        <button
                          onClick={() => handlePayTax(khajna.id, item.parcel.id, khajna.total_payable_bdt)}
                          disabled={paymentProcessing}
                          className="bg-gov-blue hover:bg-slate-900 text-white font-bold px-4 py-2 rounded-lg transition shadow-sm flex items-center gap-1.5 ml-auto"
                        >
                          <Sparkles size={14} className="text-teal-300" />
                          <span>{paymentProcessing ? 'পরিশোধ হচ্ছে...' : '১-ক্লিকে বকেয়া পরিশোধ ও দাখিলা নিন (ডেমো)'}</span>
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between w-full">
                        <span className="text-emerald-800 font-medium flex items-center gap-1">
                          <CheckCircle2 size={15} className="text-emerald-600" />
                          ভূমি উন্নয়ন কর হালনাগাদ রয়েছে। বিক্রয়ের জন্য অনুমোদিত।
                        </span>
                        <div className="space-x-2">
                          <button
                            onClick={() => window.print()}
                            className="text-gov-blue hover:underline font-semibold"
                          >
                            দাখিলা প্রিন্ট করুন
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
