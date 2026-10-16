import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import { ShoppingBag, ShieldCheck, FileText, CheckCircle2, Clock } from 'lucide-react';
import { StatusBadge } from '../../components/common/StatusBadge';
import { DeedDraftModal } from '../../components/common/DeedDraftModal';

export const DealsPage: React.FC = () => {
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
    <div className="font-bengali space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
          <ShoppingBag className="text-gov-blue" size={24} />
          আমার ক্রয়-বিক্রয় ও চুক্তিপত্র (Deals & Purchase Agreements)
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          ক্রেতা ও বিক্রেতা হিসেবে সম্পাদিত বিক্রয় চুক্তি, বায়না ও রেজিস্ট্রেশন নথিপত্র
        </p>
      </div>

      {loading ? (
        <p className="text-xs text-slate-500 py-6 text-center">তথ্য লোড হচ্ছে...</p>
      ) : deals.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center border space-y-2">
          <p className="text-sm font-semibold text-slate-700">কোনো ক্রয়-বিক্রয় চুক্তি নেই</p>
          <p className="text-xs text-slate-500">নতুন জমি কেনার প্রস্তাব আসলে তা এখানে প্রদর্শিত হবে।</p>
        </div>
      ) : (
        <div className="space-y-4">
          {deals.map((deal) => (
            <div
              key={deal.id}
              className="bg-white rounded-xl shadow-gov-sm border border-slate-200 p-6 space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b pb-3">
                <div>
                  <span className="text-xs text-slate-500">চুক্তি/আবেদন নং:</span>
                  <strong className="text-sm font-mono text-slate-900 ml-1">{deal.application_no}</strong>
                </div>
                <StatusBadge stage={deal.stage} />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-slate-50 p-3.5 rounded-lg border">
                <div>
                  <span className="text-slate-500 block">বিক্রেতা:</span>
                  <strong className="text-slate-900">{deal.seller?.name_bn || 'রফিকুল ইসলাম'}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block">ক্রেতা:</span>
                  <strong className="text-slate-900">{deal.buyer?.name_bn || 'ফারহান আহমেদ'}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block">জমির পরিমাণ:</span>
                  <strong className="text-gov-blue font-bold font-mono">{deal.proposed_area_decimal} শতক</strong>
                </div>
                <div>
                  <span className="text-slate-500 block">মোট মূল্য:</span>
                  <strong className="text-slate-900 font-mono font-bold">
                    ৳ {deal.agreed_price_bdt.toLocaleString('bn-BD')}
                  </strong>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs">
                <span className="text-slate-500">
                  দাগ নং {deal.parcel?.dag_no} ({deal.parcel?.mouza})
                </span>
                <div className="flex items-center gap-2">
                  <Link
                    to={`/verify-land?parcel_id=${deal.parcel?.id}`}
                    className="inline-flex items-center gap-1 text-teal-800 bg-teal-50 border border-teal-300 px-3 py-1.5 rounded font-semibold hover:bg-teal-100 transition"
                  >
                    <ShieldCheck size={14} />
                    <span>ঝুঁকি পুনঃযাচাই</span>
                  </Link>
                  <button
                    onClick={() => setSelectedDealForDeed(deal)}
                    className="inline-flex items-center gap-1 bg-gov-blue text-white px-3 py-1.5 rounded font-semibold hover:bg-slate-900 transition shadow-sm"
                  >
                    <FileText size={14} />
                    <span>খসড়া চুক্তিপত্র প্রিন্ট</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
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
