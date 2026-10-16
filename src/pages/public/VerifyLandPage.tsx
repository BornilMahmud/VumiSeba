import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { api } from '../../services/api';
import { RiskAssessment, LandParcel } from '../../types';
import {
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  AlertOctagon,
  Printer,
  Info,
  Scale,
  Receipt,
  FileText,
  UserCheck,
  Search,
  ArrowRight,
} from 'lucide-react';
import { RiskBadge } from '../../components/common/RiskBadge';

export const VerifyLandPage: React.FC = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialParcelId = queryParams.get('parcel_id') || 'pcl-clean-405';

  const [parcels, setParcels] = useState<LandParcel[]>([]);
  const [selectedParcelId, setSelectedParcelId] = useState(initialParcelId);
  const [sellerNid, setSellerNid] = useState('19852691029384756');
  const [proposedShare, setProposedShare] = useState('0.05');
  const [proposedArea, setProposedArea] = useState('1.0');

  const [assessment, setAssessment] = useState<RiskAssessment | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedParcel, setSelectedParcel] = useState<LandParcel | null>(null);

  // Load available demo parcels for quick selection
  useEffect(() => {
    const fetchParcels = async () => {
      const res = await api.searchLand({});
      if (res.success && res.data) {
        setParcels(res.data);
        const current = res.data.find((p: LandParcel) => p.id === selectedParcelId);
        if (current) setSelectedParcel(current);
      }
    };
    fetchParcels();
  }, []);

  const handleRunAssessment = async (overrideParcelId?: string, overrideNid?: string) => {
    setLoading(true);
    const pid = overrideParcelId || selectedParcelId;
    const nid = overrideNid !== undefined ? overrideNid : sellerNid;

    const res = await api.evaluateRisk({
      parcel_id: pid,
      seller_identifier: nid,
      proposed_share: proposedShare ? Number(proposedShare) : undefined,
      proposed_area_decimal: proposedArea ? Number(proposedArea) : undefined,
    });

    if (res.success && res.data) {
      setAssessment(res.data);
      const matched = parcels.find((p) => p.id === pid);
      if (matched) setSelectedParcel(matched);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (selectedParcelId) {
      handleRunAssessment(selectedParcelId);
    }
  }, [selectedParcelId]);

  return (
    <div className="font-bengali min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <Link to="/" className="hover:underline">হোম</Link>
            <span>/</span>
            <span className="text-slate-900 font-semibold">কেনার আগে জমি যাচাই</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 flex items-center gap-2">
            <ShieldCheck className="text-teal-600" size={28} />
            কেনার আগে জমি যাচাই (Check Before You Buy)
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            বায়নার পূর্বে প্রস্তাবিত বিক্রেতা, খতিয়ানের হিস্যা, বকেয়া খাজনা এবং আদালতের মামলা ও লিয়েন স্বয়ংক্রিয়ভাবে পরীক্ষা করুন
          </p>
        </div>

        {assessment && (
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 px-4 py-2 rounded-lg text-xs font-semibold shadow-sm transition no-print"
          >
            <Printer size={15} />
            <span>প্রতিবেদন প্রিন্ট করুন</span>
          </button>
        )}
      </div>

      {/* Input Selector Card */}
      <div className="bg-white rounded-xl shadow-gov-sm border border-slate-200 p-6 mb-8 no-print">
        <h2 className="text-sm font-bold text-slate-900 mb-4 pb-2 border-b">
          যাচাইকরণের তথ্য নির্বাচন করুন
        </h2>

        {/* Demo Fast Preset Buttons */}
        <div className="mb-4 bg-slate-50 p-3 rounded-lg border border-slate-200">
          <p className="text-xs text-slate-600 font-semibold mb-2">দ্রুত টেস্ট দৃশ্যপট (১-ক্লিক ডেমো নির্বাচন):</p>
          <div className="flex flex-wrap gap-2 text-xs">
            <button
              onClick={() => {
                setSelectedParcelId('pcl-clean-405');
                setSellerNid('19852691029384756');
                setProposedShare('0.05');
                setProposedArea('1.0');
                handleRunAssessment('pcl-clean-405', '19852691029384756');
              }}
              className="px-3 py-1.5 rounded-md font-medium bg-emerald-50 text-emerald-800 border border-emerald-300 hover:bg-emerald-100 transition"
            >
              ✓ নিরাপদ জমি (দাগ ৪০৫, বাড্ডা)
            </button>
            <button
              onClick={() => {
                setSelectedParcelId('pcl-taxdue-882');
                setSellerNid('19782691099381726');
                setProposedShare('1.0');
                setProposedArea('15.0');
                handleRunAssessment('pcl-taxdue-882', '19782691099381726');
              }}
              className="px-3 py-1.5 rounded-md font-medium bg-amber-50 text-amber-800 border border-amber-300 hover:bg-amber-100 transition"
            >
              ⚠️ কর বকেয়া কেস (দাগ ৮৮২, সাঁতারকুল)
            </button>
            <button
              onClick={() => {
                setSelectedParcelId('pcl-oversell-102');
                setSellerNid('19822695028371948');
                setProposedShare('0.25'); // Only owns 0.125
                setProposedArea('3.0');
                handleRunAssessment('pcl-oversell-102', '19822695028371948');
              }}
              className="px-3 py-1.5 rounded-md font-medium bg-orange-50 text-orange-900 border border-orange-300 hover:bg-orange-100 transition"
            >
              ⚠️ হিস্যা ঘাটতি / অতিরিক্ত বিক্রির চেষ্টা (দাগ ১০২)
            </button>
            <button
              onClick={() => {
                setSelectedParcelId('pcl-court-710');
                setSellerNid('');
                handleRunAssessment('pcl-court-710', '');
              }}
              className="px-3 py-1.5 rounded-md font-medium bg-red-100 text-red-900 border border-red-400 hover:bg-red-200 transition font-bold"
            >
              ⛔ আদালত মামলা ও মর্টগেজ (দাগ ৭১০, আফতাবনগর)
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div>
            <label className="block text-slate-700 font-semibold mb-1">যাচাইযোগ্য দাগ ও মৌজা</label>
            <select
              value={selectedParcelId}
              onChange={(e) => setSelectedParcelId(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-md p-2.5 font-medium"
            >
              {parcels.map((p) => (
                <option key={p.id} value={p.id}>
                  দাগ {p.dag_no} — খতিয়ান {p.khatian_no} ({p.mouza}, {p.total_area_decimal} শতক)
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">বিক্রেতার এনআইডি / পরিচিতি (ঐচ্ছিক)</label>
            <input
              type="text"
              placeholder="যেমন: ১৯৮৫২৬৯১০২৯৩৮৪৭৫৬"
              value={sellerNid}
              onChange={(e) => setSellerNid(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-md p-2"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">প্রস্তাবিত বিক্রয় অংশ (Share)</label>
            <input
              type="number"
              step="0.01"
              max="1.0"
              placeholder="যেমন: ০.০৫ (৫%)"
              value={proposedShare}
              onChange={(e) => setProposedShare(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-md p-2"
            />
          </div>

          <div className="flex items-end">
            <button
              onClick={() => handleRunAssessment()}
              disabled={loading}
              className="w-full bg-gov-blue hover:bg-slate-900 text-white font-semibold py-2.5 rounded-md shadow transition flex items-center justify-center gap-1.5"
            >
              <ShieldCheck size={16} />
              <span>{loading ? 'যাচাই হচ্ছে...' : 'পুনরায় মূল্যায়ন করুন'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Assessment Output Report Card */}
      {loading ? (
        <div className="bg-white rounded-xl p-16 text-center border border-slate-200">
          <div className="inline-block animate-spin w-10 h-10 border-4 border-teal-600 border-t-transparent rounded-full mb-3"></div>
          <p className="text-sm font-bold text-slate-800">ভূমি রেকর্ড, রাজস্ব ও আদালতের ডাটাবেজে অনুসন্ধান চলছে...</p>
          <p className="text-xs text-slate-500 mt-1">দাগ ও খতিয়ানের হিস্যা তুলনামূলক বিশ্লেষণ করা হচ্ছে</p>
        </div>
      ) : assessment ? (
        <div className="space-y-6">
          {/* Top Banner: Score & Risk Level */}
          <div className={`p-6 rounded-2xl border shadow-sm ${
            assessment.overall_risk_level === 'low'
              ? 'bg-emerald-50/70 border-emerald-300'
              : assessment.overall_risk_level === 'medium'
              ? 'bg-amber-50/70 border-amber-300'
              : assessment.overall_risk_level === 'high'
              ? 'bg-orange-50/70 border-orange-400'
              : 'bg-red-50 border-red-500'
          }`}>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-current/10">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-1">
                  স্বয়ংক্রিয় প্রাক-বায়না বিশ্লেষণ প্রতিবেদন (Automated Pre-Purchase Audit)
                </span>
                <div className="flex items-center gap-3">
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                    দাগ নং {selectedParcel?.dag_no} — মৌজা {selectedParcel?.mouza}
                  </h2>
                  <RiskBadge level={assessment.overall_risk_level} score={assessment.risk_score} />
                </div>
              </div>

              <div className="text-right">
                <span className="text-xs text-slate-500">মূল্যায়ন তারিখ:</span>
                <p className="text-xs font-mono font-semibold text-slate-800">
                  {new Date(assessment.generated_at).toLocaleString('bn-BD')}
                </p>
              </div>
            </div>

            {/* Quick Status Pill Matrix */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 text-xs font-medium">
              <div className="bg-white p-3 rounded-lg border flex items-center gap-2">
                {assessment.seller_match ? (
                  <CheckCircle2 size={16} className="text-emerald-600" />
                ) : (
                  <AlertTriangle size={16} className="text-red-600" />
                )}
                <span>মালিকানা রেকর্ড মিল: {assessment.seller_match ? 'সঠিক' : 'অমিল'}</span>
              </div>

              <div className="bg-white p-3 rounded-lg border flex items-center gap-2">
                {assessment.share_valid ? (
                  <CheckCircle2 size={16} className="text-emerald-600" />
                ) : (
                  <AlertTriangle size={16} className="text-red-600" />
                )}
                <span>বিক্রয় হিস্যা বৈধতা: {assessment.share_valid ? 'বৈধ' : 'ঘাটতি'}</span>
              </div>

              <div className="bg-white p-3 rounded-lg border flex items-center gap-2">
                {assessment.tax_cleared ? (
                  <CheckCircle2 size={16} className="text-emerald-600" />
                ) : (
                  <AlertTriangle size={16} className="text-amber-600" />
                )}
                <span>খাজনা/কর স্থিতি: {assessment.tax_cleared ? 'পরিশোধিত' : 'বকেয়া'}</span>
              </div>

              <div className="bg-white p-3 rounded-lg border flex items-center gap-2">
                {!assessment.court_dispute && !assessment.mortgage_encumbrance ? (
                  <CheckCircle2 size={16} className="text-emerald-600" />
                ) : (
                  <AlertOctagon size={16} className="text-red-600" />
                )}
                <span>মামলা ও দায়বদ্ধতা: {assessment.court_dispute || assessment.mortgage_encumbrance ? 'শনাক্ত' : 'মুক্ত'}</span>
              </div>
            </div>
          </div>

          {/* Section 1: Summary */}
          <div className="bg-white rounded-xl shadow-gov-sm border border-slate-200 p-6">
            <h3 className="font-bold text-slate-900 text-sm mb-2 flex items-center gap-2 border-b pb-2">
              <Info className="text-gov-blue" size={16} />
              ১. ঝুঁকির সারাংশ (Risk Summary)
            </h3>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-lg border border-slate-200">
              {assessment.summary_bn}
            </p>
          </div>

          {/* Section 2: Identified Issues */}
          <div className="bg-white rounded-xl shadow-gov-sm border border-slate-200 p-6">
            <h3 className="font-bold text-slate-900 text-sm mb-3 flex items-center gap-2 border-b pb-2">
              <AlertTriangle className="text-amber-600" size={16} />
              ২. শনাক্ত সমস্যা ও অসঙ্গতি (Identified Issues & Discrepancies)
            </h3>
            {assessment.identified_issues_bn.length === 0 ? (
              <div className="p-3 bg-emerald-50 text-emerald-800 rounded-lg text-xs font-medium flex items-center gap-2">
                <CheckCircle2 size={16} />
                <span>কোনো প্রাথমিক স্বত্ব বিরোধ বা গুরুতর ত্রুটি শনাক্ত হয়নি।</span>
              </div>
            ) : (
              <ul className="space-y-2 text-xs">
                {assessment.identified_issues_bn.map((issue, idx) => (
                  <li key={idx} className="flex items-start gap-2 bg-red-50 text-red-900 p-3 rounded-md border border-red-200">
                    <AlertTriangle size={15} className="text-red-600 shrink-0 mt-0.5" />
                    <span className="font-medium">{issue}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Section 3: Warning Basis */}
          <div className="bg-white rounded-xl shadow-gov-sm border border-slate-200 p-6">
            <h3 className="font-bold text-slate-900 text-sm mb-3 flex items-center gap-2 border-b pb-2">
              <Scale className="text-gov-blue" size={16} />
              ৩. কোন তথ্যের ভিত্তিতে সতর্কতা এসেছে (Warning Basis & Evidential Sources)
            </h3>
            <ul className="space-y-2 text-xs">
              {assessment.warning_basis_bn.map((basis, idx) => (
                <li key={idx} className="flex items-center gap-2 text-slate-700 bg-slate-50 p-2.5 rounded border">
                  <span className="w-1.5 h-1.5 rounded-full bg-gov-blue"></span>
                  <span>{basis}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Section 4: Unverified Information */}
          <div className="bg-white rounded-xl shadow-gov-sm border border-slate-200 p-6">
            <h3 className="font-bold text-slate-900 text-sm mb-3 flex items-center gap-2 border-b pb-2 text-amber-900">
              <AlertTriangle className="text-amber-600" size={16} />
              ৪. কোন তথ্য যাচাই করা যায়নি (Unverified Data / Limitations)
            </h3>
            <div className="bg-amber-50/50 p-3 rounded-lg border border-amber-200 mb-3 text-xs text-amber-900">
              <strong>সতর্কতা:</strong> শুধুমাত্র অনলাইন ডেটাবেজের তথ্য পরিষ্কার থাকার অর্থ এই নয় যে জমিতে কোনো শারীরিক বিরোধ নেই।
            </div>
            <ul className="space-y-2 text-xs">
              {assessment.unverified_data_bn.map((item, idx) => (
                <li key={idx} className="flex items-center gap-2 text-slate-600 bg-slate-50 p-2.5 rounded border">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                  <span>{item}</span>
                  <span className="ml-auto text-[10px] bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded font-semibold">
                    তথ্য অনুপস্থিত
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Section 5: Recommended Next Actions */}
          <div className="bg-white rounded-xl shadow-gov-sm border border-slate-200 p-6">
            <h3 className="font-bold text-slate-900 text-sm mb-3 flex items-center gap-2 border-b pb-2">
              <CheckCircle2 className="text-teal-600" size={16} />
              ৫. পরবর্তী করণীয় (Recommended Next Steps)
            </h3>
            <ol className="list-decimal list-inside space-y-2 text-xs text-slate-800">
              {assessment.recommended_actions_bn.map((action, idx) => (
                <li key={idx} className="p-2.5 bg-teal-50/60 rounded border border-teal-200">
                  <span className="font-medium">{action}</span>
                </li>
              ))}
            </ol>
          </div>

          {/* Statutory Hackathon Legal Disclaimer Banner */}
          <div className="p-4 bg-slate-100 rounded-xl border border-slate-300 text-xs text-slate-600 leading-normal space-y-1">
            <p className="font-bold text-slate-800">আইনি ও প্রযুক্তিগত বিজ্ঞপ্তি (Disclaimer):</p>
            <p>
              এই প্রাক-বায়না মূল্যায়নটি শুধুমাত্র সংরক্ষিত ডিজিটাল নমুনা রেকর্ডের ভিত্তিতে প্রস্তুত করা হয়েছে। 
              কোনো অবস্থাতেই এটি বাংলাদেশ সরকার, আইন মন্ত্রণালয়, সাব-রেজিস্ট্রার কিংবা বিজ্ঞ আদালতের আনুষ্ঠানিক সার্টিফিকেটের বিকল্প নয়।
              বায়না বা অর্থ লেনদেনের পূর্বে মূল বায়া দলিল, পর্চা এবং সরেজমিন দখল আইনজীবী দ্বারা যাচাই করার পরামর্শ দেওয়া হচ্ছে।
            </p>
          </div>
        </div>
      ) : null}
    </div>
  );
};
