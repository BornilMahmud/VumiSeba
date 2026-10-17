import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import {
  FilePlus2,
  AlertTriangle,
  CheckCircle2,
  ShieldCheck,
  Receipt,
  UserCheck,
  Sparkles,
  ArrowRight,
  Info,
} from 'lucide-react';

export const SellLandPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialParcelId = queryParams.get('parcel_id') || '';

  const [holdings, setHoldings] = useState<any[]>([]);
  const [selectedParcelId, setSelectedParcelId] = useState(initialParcelId);
  const [buyerCitizenId, setBuyerCitizenId] = useState('BHM-CIT-419203'); // Farhan Ahmed by default
  const [proposedShare, setProposedShare] = useState('0.05');
  const [proposedArea, setProposedArea] = useState('1.0');
  const [agreedPrice, setAgreedPrice] = useState('1800000');
  const [deedType, setDeedType] = useState('সাফ-কবলা');

  // Pre-check feedback
  const [preCheckData, setPreCheckData] = useState<any | null>(null);
  const [loadingCheck, setLoadingCheck] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchHoldings = async () => {
      const res = await api.getMyHoldings();
      if (res.success && res.data && res.data.length > 0) {
        setHoldings(res.data);
        if (!selectedParcelId) {
          setSelectedParcelId(res.data[0].parcel.id);
        }
      }
    };
    fetchHoldings();
  }, []);

  const runPreCheck = async (pid: string, share: string, area: string) => {
    if (!pid || !share || !area) return;
    setLoadingCheck(true);
    setErrorMessage(null);
    const res = await api.preCheckSale({
      parcel_id: pid,
      proposed_share: Number(share),
      proposed_area_decimal: Number(area),
    });

    if (res.success && res.data) {
      setPreCheckData(res.data);
    } else {
      setPreCheckData(null);
      setErrorMessage(res.message_bn || 'যাচাইকরণে ত্রুটি');
    }
    setLoadingCheck(false);
  };

  useEffect(() => {
    if (selectedParcelId && proposedShare && proposedArea) {
      runPreCheck(selectedParcelId, proposedShare, proposedArea);
    }
  }, [selectedParcelId, proposedShare, proposedArea]);

  const handleSelectParcel = (pid: string) => {
    setSelectedParcelId(pid);
    const chosen = holdings.find((h) => h.parcel.id === pid);
    if (chosen) {
      // Default half of their share for test
      const safeShare = Number((chosen.ownership.share_portion * 0.5).toFixed(4));
      const safeArea = Number((chosen.ownership.area_decimal * 0.5).toFixed(2));
      setProposedShare(safeShare.toString());
      setProposedArea(safeArea.toString());
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMessage(null);

    const res = await api.submitSaleApp({
      parcel_id: selectedParcelId,
      buyer_citizen_id: buyerCitizenId.trim(),
      proposed_share: Number(proposedShare),
      proposed_area_decimal: Number(proposedArea),
      agreed_price_bdt: Number(agreedPrice),
      deed_type_bn: deedType,
    });

    if (res.success) {
      navigate('/citizen/applications');
    } else {
      setErrorMessage(res.message_bn || 'আবেদন গ্রহণ করা সম্ভব হয়নি।');
    }
    setSubmitting(false);
  };

  const selectedHolding = holdings.find((h) => h.parcel?.id === selectedParcelId);

  return (
    <div className="font-bengali space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
          <FilePlus2 className="text-gov-blue" size={24} />
          জমি বিক্রির অনলাইন আবেদন (Create Sale Application)
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          মালিকানা হিস্যা পরীক্ষা, কর ক্লিয়ারেন্স ও সাব-রেজিস্ট্রির প্রাথমিক যাচাইকরণ ফর্ম
        </p>
      </div>

      {errorMessage && (
        <div className="p-4 bg-red-50 text-red-900 border border-red-300 rounded-xl text-xs font-semibold flex items-center gap-2">
          <AlertTriangle size={18} className="text-red-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Main Wizard Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Step 1: Select Land Parcel */}
        <div className="bg-white rounded-xl shadow-gov-sm border border-slate-200 p-6 space-y-4">
          <h2 className="text-sm font-bold text-slate-900 border-b pb-2 flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-gov-blue text-white text-xs flex items-center justify-center font-mono">১</span>
            বিক্রয়যোগ্য জমি নির্বাচন করুন
          </h2>

          {holdings.length === 0 ? (
            <p className="text-xs text-slate-500 py-3">আপনার মালিকানাধীন কোনো জমি খুঁজে পাওয়া যায়নি।</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {holdings.map((h, idx) => {
                const isSelected = h.parcel.id === selectedParcelId;
                return (
                  <div
                    key={idx}
                    onClick={() => handleSelectParcel(h.parcel.id)}
                    className={`p-3.5 rounded-lg border cursor-pointer transition ${
                      isSelected
                        ? 'border-indigo-600 dark:border-indigo-500 bg-indigo-50/80 dark:bg-[#0c1427] ring-1 ring-indigo-500/40 shadow-sm'
                        : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 hover:bg-slate-100 dark:hover:bg-slate-800/50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <strong className={`text-xs ${isSelected ? 'text-indigo-950 dark:text-white' : 'text-slate-900 dark:text-slate-100'}`}>
                        দাগ নং {h.parcel.dag_no}
                      </strong>
                      <span className={`text-[10px] px-2 py-0.5 rounded border font-mono ${
                        isSelected
                          ? 'bg-indigo-100 dark:bg-indigo-950/80 text-indigo-900 dark:text-indigo-300 border-indigo-300 dark:border-indigo-700'
                          : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                      }`}>
                        খতিয়ান: {h.ownership.khatian_ref || h.parcel.khatian_no}
                      </span>
                    </div>
                    <p className={`text-[11px] ${isSelected ? 'text-slate-700 dark:text-slate-300' : 'text-slate-600 dark:text-slate-400'}`}>
                      মৌজা: {h.parcel.mouza} | আমার মোট অংশ: {h.ownership.area_decimal} শতক ({(h.ownership.share_portion * 100).toFixed(1)}%)
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Step 2: Buyer Particulars */}
        <div className="bg-white rounded-xl shadow-gov-sm border border-slate-200 p-6 space-y-4">
          <h2 className="text-sm font-bold text-slate-900 border-b pb-2 flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-gov-blue text-white text-xs flex items-center justify-center font-mono">২</span>
            প্রস্তাবিত ক্রেতার বিবরণ
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                ক্রেতার ইউনিক সিটিজেন আইডি *
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  required
                  placeholder="যেমন: BHM-CIT-419203"
                  value={buyerCitizenId}
                  onChange={(e) => setBuyerCitizenId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-md p-2 font-mono font-bold text-slate-900"
                />
              </div>
              <span className="text-[11px] text-slate-500 mt-1 block">
                টেস্ট আইডি: <strong className="text-gov-blue">BHM-CIT-419203</strong> (ফারহান আহমেদ)
              </span>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">দলিলের ধরন (Deed Type)</label>
              <select
                value={deedType}
                onChange={(e) => setDeedType(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-md p-2 font-medium"
              >
                <option value="সাফ-কবলা">সাফ-কবলা (Sale Deed)</option>
                <option value="হেবা">হেবা (Gift to Relative)</option>
                <option value="দানপত্র">দানপত্র (Donation)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Step 3: Share, Area & Real-Time Balance Calculator */}
        <div className="bg-white rounded-xl shadow-gov-sm border border-slate-200 p-6 space-y-4">
          <h2 className="text-sm font-bold text-slate-900 border-b pb-2 flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-gov-blue text-white text-xs flex items-center justify-center font-mono">৩</span>
            বিক্রির হিস্যা ও অবশিষ্ট মালিকানা ক্যালকুলেটর
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                হস্তান্তরযোগ্য অংশ (Proposed Share) *
              </label>
              <input
                type="number"
                step="0.001"
                required
                max="1.0"
                placeholder="যেমন: ০.০৫ (৫%)"
                value={proposedShare}
                onChange={(e) => setProposedShare(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-md p-2 font-mono font-bold text-slate-900"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                জমির পরিমাণ (শতক হিসেবে) *
              </label>
              <input
                type="number"
                step="0.01"
                required
                placeholder="যেমন: ১.০০ শতক"
                value={proposedArea}
                onChange={(e) => setProposedArea(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-md p-2 font-mono font-bold text-gov-blue"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                নির্ধারিত বিক্রয়মূল্য (BDT) *
              </label>
              <input
                type="number"
                required
                placeholder="যেমন: ১৮০০০০০"
                value={agreedPrice}
                onChange={(e) => setAgreedPrice(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-md p-2 font-mono font-bold text-slate-900"
              />
            </div>
          </div>

          {/* Real-Time Balance Display */}
          {preCheckData && (
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3 text-xs">
              <div className="flex items-center justify-between border-b pb-2">
                <span className="font-bold text-slate-800">স্বত্ব ও অবশিষ্ট অংশ পর্যালোচনা:</span>
                <span className="text-[11px] text-slate-500">বিক্রেতা: {preCheckData.seller_name_bn}</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                <div className="p-2 bg-white rounded border">
                  <span className="text-slate-500 block text-[11px]">রেকর্ডীয় মোট অংশ</span>
                  <strong className="text-slate-900 font-mono font-bold">
                    {preCheckData.recorded_share} ({preCheckData.recorded_area_decimal} শতক)
                  </strong>
                </div>

                <div className="p-2 bg-white rounded border">
                  <span className="text-slate-500 block text-[11px]">প্রস্তাবিত বিক্রয়</span>
                  <strong className="text-gov-blue font-mono font-bold">
                    {preCheckData.proposed_share} ({preCheckData.proposed_area_decimal} শতক)
                  </strong>
                </div>

                <div className="p-2 bg-white rounded border">
                  <span className="text-slate-500 block text-[11px]">বিক্রয়ের পর অবশিষ্ট থাকবে</span>
                  <strong className={`font-mono font-bold ${preCheckData.remaining_share < 0 ? 'text-red-600' : 'text-emerald-700'}`}>
                    {preCheckData.remaining_share} ({preCheckData.remaining_area_decimal} শতক)
                  </strong>
                </div>

                <div className="p-2 bg-white rounded border">
                  <span className="text-slate-500 block text-[11px]">কর স্থিতি</span>
                  <strong className={preCheckData.tax_cleared ? 'text-emerald-700' : 'text-red-600'}>
                    {preCheckData.tax_cleared ? '✓ পরিশোধিত' : '⚠️ বকেয়া আছে'}
                  </strong>
                </div>
              </div>

              {/* Share Warning */}
              {!preCheckData.share_valid && (
                <div className="p-3 bg-red-100 text-red-900 rounded-lg font-semibold flex items-center gap-2">
                  <AlertTriangle size={16} className="text-red-600 shrink-0" />
                  <span>{preCheckData.share_error_bn}</span>
                </div>
              )}

              {/* Tax Warning & Guard */}
              {!preCheckData.tax_cleared && (
                <div className="p-3 bg-amber-100 text-amber-900 rounded-lg font-semibold flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <AlertTriangle size={16} className="text-amber-700 shrink-0" />
                    <span>{preCheckData.tax_error_bn} বকেয়া পরিশোধ না করা পর্যন্ত বিক্রয় আবেদন দাখিল স্থগিত থাকবে।</span>
                  </div>
                  <Link
                    to="/citizen/tax"
                    className="bg-gov-blue text-white px-3 py-1 rounded text-xs font-bold hover:bg-slate-900 shrink-0"
                  >
                    এখনই কর পরিশোধ করুন
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="flex items-center justify-between pt-2">
          <Link to="/citizen" className="text-xs text-slate-600 hover:underline">
            বাতিল করুন
          </Link>

          <button
            type="submit"
            disabled={submitting || (preCheckData && !preCheckData.can_submit)}
            className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold shadow-md transition ${
              preCheckData && !preCheckData.can_submit
                ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                : 'bg-gov-blue hover:bg-slate-900 text-white'
            }`}
          >
            <span>{submitting ? 'দাখিল হচ্ছে...' : 'বিক্রয় আবেদন দাখিল করুন'}</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </form>
    </div>
  );
};
