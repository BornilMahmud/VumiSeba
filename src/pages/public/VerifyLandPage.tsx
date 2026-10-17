import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { api } from '../../services/api';
import { RiskAssessment, LandParcel, RiskFactorDetail } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
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
  ShieldAlert,
  HelpCircle,
  Database,
  Calendar,
  Lock,
} from 'lucide-react';
import { RiskBadge } from '../../components/common/RiskBadge';

export const VerifyLandPage: React.FC = () => {
  const { language } = useLanguage();
  const isBn = language === 'bn';

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

  const getScoreColor = (score: number, level: string) => {
    if (level === 'critical') return 'text-red-600 border-red-500 bg-red-50';
    if (level === 'high') return 'text-orange-600 border-orange-500 bg-orange-50';
    if (level === 'medium') return 'text-amber-600 border-amber-500 bg-amber-50';
    return 'text-emerald-600 border-emerald-500 bg-emerald-50';
  };

  const getFactorStatusBadge = (status: 'passed' | 'warning' | 'failed') => {
    if (status === 'passed') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300">
          <CheckCircle2 size={12} />
          {isBn ? 'সঠিক / নিরাপদ' : 'Passed'}
        </span>
      );
    }
    if (status === 'warning') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-300">
          <AlertTriangle size={12} />
          {isBn ? 'সতর্কতা / করণীয়' : 'Warning'}
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-800 border border-red-300">
        <AlertOctagon size={12} />
        {isBn ? 'ব্যর্থ / ঝুঁকিপূর্ণ' : 'Failed'}
      </span>
    );
  };

  return (
    <div className="font-bengali min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <Link to="/" className="hover:underline">
              {isBn ? 'হোম' : 'Home'}
            </Link>
            <span>/</span>
            <span className="text-slate-900 font-semibold">
              {isBn ? 'কেনার আগে জমি যাচাই' : 'Check Before You Buy'}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 flex items-center gap-2">
            <ShieldCheck className="text-teal-600" size={28} />
            {isBn ? 'কেনার আগে জমি যাচাই (Check Before You Buy)' : 'Check Before You Buy (Land Pre-Purchase Verification)'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            {isBn
              ? 'বায়নার পূর্বে প্রস্তাবিত বিক্রেতা, খতিয়ানের হিস্যা, বকেয়া খাজনা এবং আদালতের মামলা ও লিয়েন স্বয়ংক্রিয়ভাবে পরীক্ষা করুন'
              : 'Automated pre-purchase audit of seller ownership, khatian share sufficiency, land taxes, injunctions and mortgage liens.'}
          </p>
        </div>

        {assessment && (
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 px-4 py-2 rounded-lg text-xs font-semibold shadow-sm transition no-print"
          >
            <Printer size={15} />
            <span>{isBn ? 'প্রতিবেদন প্রিন্ট করুন' : 'Print Assessment'}</span>
          </button>
        )}
      </div>

      {/* Input Selector Card */}
      <div className="bg-white rounded-xl shadow-gov-sm border border-slate-200 p-6 mb-8 no-print">
        <h2 className="text-sm font-bold text-slate-900 mb-3 pb-2 border-b flex items-center justify-between">
          <span>{isBn ? 'যাচাইকরণের তথ্য নির্বাচন করুন' : 'Select Parcel & Evaluation Parameters'}</span>
          <span className="text-xs text-slate-500 font-normal">
            {isBn ? 'সিনথেটিক ডেমো ডেটাসেট' : 'Synthetic Demo Dataset'}
          </span>
        </h2>

        {/* Demo Fast Preset Buttons */}
        <div className="mb-4 bg-slate-50 p-3 rounded-lg border border-slate-200">
          <p className="text-xs text-slate-600 font-semibold mb-2">
            {isBn ? '১-ক্লিক ডেমো দৃশ্যপট (Judge Test Scenarios):' : '1-Click Judge Test Scenarios:'}
          </p>
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
              ✓ {isBn ? 'নিরাপদ জমি (দাগ ৪০৫, বাড্ডা)' : 'Clean Title (Plot 405, Badda)'}
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
              ⚠️ {isBn ? 'খাজনা বকেয়া (দাগ ৮৮২, সাঁতারকুল)' : 'Tax Overdue (Plot 882)'}
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
              ⚠️ {isBn ? 'হিস্যা ঘাটতি / অতিরিক্ত বিক্রি (দাগ ১০২)' : 'Over-Sale Share Limit (Plot 102)'}
            </button>
            <button
              onClick={() => {
                setSelectedParcelId('pcl-court-710');
                setSellerNid('');
                handleRunAssessment('pcl-court-710', '');
              }}
              className="px-3 py-1.5 rounded-md font-medium bg-red-100 text-red-900 border border-red-400 hover:bg-red-200 transition font-bold"
            >
              ⛔ {isBn ? 'আদালতের স্থগিতাদেশ ও মর্টগেজ (দাগ ৭১০)' : 'Court Injunction & Mortgage (Plot 710)'}
            </button>
            <button
              onClick={() => {
                setSelectedParcelId('pcl-khas-999');
                setSellerNid('');
                handleRunAssessment('pcl-khas-999', '');
              }}
              className="px-3 py-1.5 rounded-md font-medium bg-rose-100 text-rose-900 border border-rose-400 hover:bg-rose-200 transition font-bold"
            >
              🚫 {isBn ? '১০০% সরকারি খাস জমি (দাগ ৯৯৯)' : 'Government Khas Land (Plot 999)'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div>
            <label className="block text-slate-700 font-semibold mb-1">
              {isBn ? 'যাচাইযোগ্য দাগ ও মৌজা' : 'Select Parcel & Mouza'}
            </label>
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
            <label className="block text-slate-700 font-semibold mb-1">
              {isBn ? 'বিক্রেতার এনআইডি / পরিচিতি (ঐচ্ছিক)' : 'Seller NID (Optional)'}
            </label>
            <input
              type="text"
              placeholder={isBn ? 'যেমন: ১৯৮৫২৬৯১০২৯৩৮৪৭৫৬' : 'e.g. 19852691029384756'}
              value={sellerNid}
              onChange={(e) => setSellerNid(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-md p-2"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">
              {isBn ? 'প্রস্তাবিত বিক্রয় অংশ (Share 0.0 - 1.0)' : 'Proposed Sale Share (0.0 - 1.0)'}
            </label>
            <input
              type="number"
              step="0.01"
              max="1.0"
              placeholder={isBn ? 'যেমন: ০.০৫ (৫%)' : 'e.g. 0.05'}
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
              <span>{loading ? (isBn ? 'যাচাই হচ্ছে...' : 'Auditing...') : (isBn ? 'মূল্যায়ন পরিচালনা করুন' : 'Run Audit')}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Assessment Output Report Card */}
      {loading ? (
        <div className="bg-white rounded-xl p-16 text-center border border-slate-200">
          <div className="inline-block animate-spin w-10 h-10 border-4 border-teal-600 border-t-transparent rounded-full mb-3"></div>
          <p className="text-sm font-bold text-slate-800">
            {isBn ? 'ভূমি রেকর্ড, রাজস্ব ও আদালতের ডাটাবেজে অনুসন্ধান চলছে...' : 'Auditing land records, tax ledger & court dispute registries...'}
          </p>
          <p className="text-xs text-slate-500 mt-1">
            {isBn ? 'হিস্যা ও আইনগত দায়বদ্ধতা বিশ্লেষণ করা হচ্ছে' : 'Analyzing share validation and legal encumbrance factors...'}
          </p>
        </div>
      ) : assessment ? (
        <div id="printable-assessment" className="space-y-6">
          {/* Critical Override Alert Banner */}
          {assessment.critical_override_triggered && (
            <div className="p-4 sm:p-5 rounded-xl bg-red-600 text-white shadow-md flex items-start gap-3">
              <ShieldAlert size={28} className="shrink-0 mt-0.5 text-white" />
              <div>
                <div className="font-extrabold text-sm sm:text-base flex items-center gap-2">
                  <span>
                    {isBn
                      ? '⚠️ ক্রিটিক্যাল ফ্যাক্টর ওভাররাইড সক্রিয় (Critical Factor Override Triggered)'
                      : '⚠️ Critical Factor Override Triggered'}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-red-100 mt-1">
                  {isBn
                    ? 'মোট পয়েন্ট বা অন্যান্য রেকর্ড পরিষ্কার থাকা সত্ত্বেও এই জমিতে গুরুতর আইনি বা মালিকানা প্রতিবন্ধকতা রয়েছে। তাই সামগ্রিক ফলাফলকে কখনই "নিরাপদ" হিসেবে গণ্য করা যাবে না।'
                    : 'Severe legal or encumbrance blocks override standard scoring. This parcel cannot display a Low-Risk rating regardless of clean tax or other sub-scores.'}
                </p>
                {assessment.critical_override_reasons && assessment.critical_override_reasons.length > 0 && (
                  <ul className="mt-2 text-xs space-y-1 list-disc list-inside text-red-100 font-medium">
                    {assessment.critical_override_reasons.map((r, i) => (
                      <li key={i}>{r}</li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          )}

          {/* Top Score Gauge & Meta Card */}
          <div
            className={`p-6 rounded-2xl border shadow-sm ${
              assessment.overall_risk_level === 'low'
                ? 'bg-emerald-50/70 border-emerald-300'
                : assessment.overall_risk_level === 'medium'
                ? 'bg-amber-50/70 border-amber-300'
                : assessment.overall_risk_level === 'high'
                ? 'bg-orange-50/70 border-orange-400'
                : 'bg-red-50 border-red-500'
            }`}
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-current/10">
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-600 block">
                  {isBn ? 'স্বয়ংক্রিয় স্বচ্ছ ঝুঁকি অডিট প্রতিবেদন (Transparent Risk Engine Audit)' : 'Automated Transparent Risk Audit'}
                </span>
                <div className="flex flex-wrap items-center gap-3">
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                    {isBn
                      ? `দাগ নং ${selectedParcel?.dag_no || ''} — মৌজা ${selectedParcel?.mouza || ''}`
                      : `Plot #${selectedParcel?.dag_no || ''} — Mouza ${selectedParcel?.mouza || ''}`}
                  </h2>
                  <RiskBadge level={assessment.overall_risk_level} score={assessment.risk_score} />
                </div>
                <p className="text-xs text-slate-600">
                  {isBn ? 'জেলা' : 'District'}: <strong>{selectedParcel?.district || selectedParcel?.district_bn}</strong> | {isBn ? 'উপজেলা' : 'Upazila'}: <strong>{selectedParcel?.upazila || selectedParcel?.upazila_bn}</strong> | {isBn ? 'খতিয়ান নং' : 'Khatian'}: <strong>{selectedParcel?.khatian_no}</strong>
                </p>
              </div>

              {/* Score Gauge / Progress Ring */}
              <div className="flex items-center gap-4 bg-white/80 p-4 rounded-xl border border-slate-200">
                <div className="relative w-20 h-20 flex items-center justify-center">
                  <svg className="w-20 h-20 transform -rotate-90">
                    <circle
                      cx="40"
                      cy="40"
                      r="32"
                      stroke="#e2e8f0"
                      strokeWidth="8"
                      fill="transparent"
                    />
                    <circle
                      cx="40"
                      cy="40"
                      r="32"
                      stroke={
                        assessment.overall_risk_level === 'low'
                          ? '#10b981'
                          : assessment.overall_risk_level === 'medium'
                          ? '#f59e0b'
                          : assessment.overall_risk_level === 'high'
                          ? '#f97316'
                          : '#ef4444'
                      }
                      strokeWidth="8"
                      strokeDasharray={201}
                      strokeDashoffset={201 - (201 * assessment.risk_score) / 100}
                      strokeLinecap="round"
                      fill="transparent"
                      className="transition-all duration-700 ease-out"
                    />
                  </svg>
                  <div className="absolute text-center">
                    <span className="text-lg font-black text-slate-900 leading-none">
                      {assessment.risk_score}
                    </span>
                    <span className="text-[10px] text-slate-500 block">/১০০</span>
                  </div>
                </div>

                <div className="text-xs">
                  <span className="font-bold text-slate-700 block">
                    {isBn ? 'নিরাপত্তা সূচক (Safety Score)' : 'Safety Index Score'}
                  </span>
                  <span className="text-slate-500 block text-[11px] mt-0.5">
                    {assessment.overall_risk_level === 'low'
                      ? (isBn ? 'স্বত্ব ও রেকর্ড ঝুঁকিমুক্ত' : 'Low encumbrance risk')
                      : assessment.overall_risk_level === 'medium'
                      ? (isBn ? 'সতর্কতা / করণীয় চিহ্নিত' : 'Notice / Action required')
                      : assessment.overall_risk_level === 'high'
                      ? (isBn ? 'উচ্চ ঝুঁকি বিদ্যমান' : 'High transaction risk')
                      : (isBn ? 'সংকটাপন্ন / লেনদেন নিষিদ্ধ' : 'Critical / Blocked transaction')}
                  </span>
                  <div className="mt-1 flex items-center gap-1 text-[10px] text-slate-400">
                    <Database size={10} />
                    <span>{assessment.engine_version || 'v2.1.0-transparent'}</span>
                  </div>
                </div>
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
                <span>{isBn ? 'মালিকানা রেকর্ড:' : 'Owner Match:'} {assessment.seller_match ? (isBn ? 'সঠিক' : 'Valid') : (isBn ? 'অমিল' : 'Mismatch')}</span>
              </div>

              <div className="bg-white p-3 rounded-lg border flex items-center gap-2">
                {assessment.share_valid ? (
                  <CheckCircle2 size={16} className="text-emerald-600" />
                ) : (
                  <AlertTriangle size={16} className="text-red-600" />
                )}
                <span>{isBn ? 'হিস্যা প্রাপ্যতা:' : 'Share Valid:'} {assessment.share_valid ? (isBn ? 'পর্যাপ্ত' : 'Sufficient') : (isBn ? 'ঘাটতি' : 'Exceeded')}</span>
              </div>

              <div className="bg-white p-3 rounded-lg border flex items-center gap-2">
                {assessment.tax_cleared ? (
                  <CheckCircle2 size={16} className="text-emerald-600" />
                ) : (
                  <AlertTriangle size={16} className="text-amber-600" />
                )}
                <span>{isBn ? 'খাজনা স্থিতি:' : 'Land Tax:'} {assessment.tax_cleared ? (isBn ? 'পরিশোধিত' : 'Cleared') : (isBn ? 'বকেয়া' : 'Overdue')}</span>
              </div>

              <div className="bg-white p-3 rounded-lg border flex items-center gap-2">
                {!assessment.court_dispute && !assessment.mortgage_encumbrance ? (
                  <CheckCircle2 size={16} className="text-emerald-600" />
                ) : (
                  <AlertOctagon size={16} className="text-red-600" />
                )}
                <span>{isBn ? 'মামলা ও বন্ধক:' : 'Court/Mortgage:'} {assessment.court_dispute || assessment.mortgage_encumbrance ? (isBn ? 'আবদ্ধ' : 'Encumbered') : (isBn ? 'মুক্ত' : 'Clean')}</span>
              </div>
            </div>
          </div>

          {/* Section: Transparent Factor Breakdown */}
          {assessment.factors && assessment.factors.length > 0 && (
            <div className="bg-white rounded-xl shadow-gov-sm border border-slate-200 p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b pb-3 mb-4">
                <div>
                  <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                    <Scale className="text-teal-600" size={18} />
                    <span>
                      {isBn
                        ? '১. স্বচ্ছ ফ্যাক্টরভিত্তিক মূল্যায়ন তালিকা (Factor-by-Factor Breakdown)'
                        : '1. Transparent Factor-by-Factor Breakdown'}
                    </span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {isBn
                      ? 'প্রতিটি ঝুঁকির কারণ, নির্ধারিত গুরুত্ব (Weight), প্রাপ্ত পয়েন্ট এবং সহজবোধ্য ব্যাখ্যা'
                      : 'Weight allocation, awarded points, status and plain-language explanation for every legal criterion.'}
                  </p>
                </div>
                <div className="text-xs text-slate-500 flex items-center gap-2">
                  <span className="inline-block w-2 h-2 rounded-full bg-emerald-500"></span>
                  <span>{isBn ? 'মোট ১০০ পয়েন্ট ভিত্তি' : '100 Point Scale'}</span>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-slate-700 border-b border-slate-200">
                      <th className="py-2.5 px-3 font-semibold">{isBn ? 'মূল্যায়ন ফ্যাক্টর (Factor)' : 'Factor'}</th>
                      <th className="py-2.5 px-3 font-semibold text-center">{isBn ? 'মর্যাদা (Status)' : 'Status'}</th>
                      <th className="py-2.5 px-3 font-semibold text-center">{isBn ? 'পয়েন্ট কর্তন' : 'Deduction'}</th>
                      <th className="py-2.5 px-3 font-semibold">{isBn ? 'সহজবোধ্য ব্যাখ্যা ও তথ্যপ্রমাণ' : 'Plain Explanation & Evidence'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {assessment.factors.map((f: RiskFactorDetail, idx: number) => (
                      <tr
                        key={idx}
                        className={`hover:bg-slate-50/70 transition ${
                          f.is_critical && f.status === 'failed' ? 'bg-red-50/40' : ''
                        }`}
                      >
                        <td className="py-3 px-3 font-semibold text-slate-900 align-top">
                          <div className="flex items-center gap-1.5">
                            {f.is_critical && (
                              <span
                                title={isBn ? 'ক্রিটিক্যাল ফ্যাক্টর (আইনি বাধ্যবাধকতা)' : 'Critical Legal Factor'}
                                className="text-red-500 cursor-help"
                              >
                                ★
                              </span>
                            )}
                            <span>{isBn ? f.title_bn : f.title_en}</span>
                          </div>
                          <span className="text-[10px] text-slate-400 block font-normal">
                            {isBn ? `সর্বোচ্চ স্কোর: ${f.weight_max_points}` : `Max weight: ${f.weight_max_points} pts`}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-center align-top whitespace-nowrap">
                          {getFactorStatusBadge(f.status)}
                        </td>
                        <td className="py-3 px-3 text-center font-mono font-bold align-top">
                          {f.deducted_points > 0 ? (
                            <span className="text-red-600">-{f.deducted_points}</span>
                          ) : (
                            <span className="text-emerald-600">০</span>
                          )}
                        </td>
                        <td className="py-3 px-3 text-slate-700 leading-relaxed align-top">
                          <p className="font-medium text-slate-800">
                            {isBn ? f.explanation_bn : f.explanation_en}
                          </p>
                          {f.is_critical && f.status === 'failed' && (
                            <span className="inline-block mt-1 text-[11px] font-bold text-red-700 bg-red-100 px-2 py-0.5 rounded">
                              {isBn
                                ? 'গুরুত্বপূর্ণ সতর্কবার্তা: লেনদেন সম্পন্ন করার পূর্বে এই আইনি প্রতিবন্ধকতা অপসারণ আবশ্যক।'
                                : 'Critical: This legal defect must be formally settled before executing sale deed.'}
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Section 2: Summary */}
          <div className="bg-white rounded-xl shadow-gov-sm border border-slate-200 p-6">
            <h3 className="font-bold text-slate-900 text-sm mb-2 flex items-center gap-2 border-b pb-2">
              <Info className="text-gov-blue" size={16} />
              <span>{isBn ? '২. সামগ্রিক বিশ্লেষণ সারাংশ (Executive Summary)' : '2. Executive Summary'}</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-lg border border-slate-200">
              {isBn ? assessment.summary_bn : (assessment.summary_en || assessment.summary_bn)}
            </p>
          </div>

          {/* Section 3: Identified Issues */}
          <div className="bg-white rounded-xl shadow-gov-sm border border-slate-200 p-6">
            <h3 className="font-bold text-slate-900 text-sm mb-3 flex items-center gap-2 border-b pb-2">
              <AlertTriangle className="text-amber-600" size={16} />
              <span>{isBn ? '৩. শনাক্তকৃত অসঙ্গতি ও ঝুঁকি (Identified Issues)' : '3. Identified Discrepancies & Issues'}</span>
            </h3>
            {assessment.identified_issues_bn.length === 0 ? (
              <div className="p-3 bg-emerald-50 text-emerald-800 rounded-lg text-xs font-medium flex items-center gap-2">
                <CheckCircle2 size={16} />
                <span>{isBn ? 'কোনো প্রাথমিক স্বত্ব বিরোধ বা গুরুতর ত্রুটি শনাক্ত হয়নি।' : 'No primary title disputes or severe discrepancies identified.'}</span>
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

          {/* Section 4: Warning Basis */}
          <div className="bg-white rounded-xl shadow-gov-sm border border-slate-200 p-6">
            <h3 className="font-bold text-slate-900 text-sm mb-3 flex items-center gap-2 border-b pb-2">
              <Scale className="text-gov-blue" size={16} />
              <span>{isBn ? '৪. সতর্কতার তথ্যসূত্র ও প্রমাণপত্র (Warning Basis & Evidential Sources)' : '4. Evidential Sources & Grounds'}</span>
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

          {/* Section 5: Unverified Information */}
          <div className="bg-white rounded-xl shadow-gov-sm border border-slate-200 p-6">
            <h3 className="font-bold text-slate-900 text-sm mb-3 flex items-center gap-2 border-b pb-2 text-amber-900">
              <AlertTriangle className="text-amber-600" size={16} />
              <span>{isBn ? '৫. ডিজিটাল রেকর্ডের সীমাবদ্ধতা (Unverified Data / Limitations)' : '5. Unverified Attributes / Limitations'}</span>
            </h3>
            <div className="bg-amber-50/50 p-3 rounded-lg border border-amber-200 mb-3 text-xs text-amber-900">
              <strong>{isBn ? 'সতর্কতা:' : 'Notice:'}</strong> {isBn ? 'শুধুমাত্র অনলাইন ডেটাবেজের তথ্য পরিষ্কার থাকার অর্থ এই নয় যে জমিতে কোনো শারীরিক দখল বিরোধ বা পারিবারিক দ্বন্দ্ব নেই।' : 'Clean digital records do not guarantee absence of physical boundary encroachment or unregistered family disputes.'}
            </div>
            <ul className="space-y-2 text-xs">
              {assessment.unverified_data_bn.map((item, idx) => (
                <li key={idx} className="flex items-center gap-2 text-slate-600 bg-slate-50 p-2.5 rounded border">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                  <span>{item}</span>
                  <span className="ml-auto text-[10px] bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded font-semibold">
                    {isBn ? 'তথ্য অনুপস্থিত' : 'Data Missing'}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Section 6: Recommended Next Actions */}
          <div className="bg-white rounded-xl shadow-gov-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between border-b pb-2 mb-3">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <CheckCircle2 className="text-teal-600" size={16} />
                <span>{isBn ? '৬. পরবর্তী আইনি করণীয় (Recommended Next Steps)' : '6. Recommended Next Legal Actions'}</span>
              </h3>
              {assessment.overall_risk_level === 'low' && (
                <Link
                  to={`/citizen/new-application?parcel_id=${selectedParcel?.id}`}
                  className="no-print inline-flex items-center gap-1.5 text-xs font-bold text-teal-700 bg-teal-50 hover:bg-teal-100 px-3 py-1.5 rounded-md border border-teal-200 transition"
                >
                  <span>{isBn ? 'বিক্রয় আবেদন শুরু করুন' : 'Initiate Sale Application'}</span>
                  <ArrowRight size={14} />
                </Link>
              )}
            </div>
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
            <div className="flex items-center justify-between">
              <p className="font-bold text-slate-800 flex items-center gap-1.5">
                <Lock size={13} className="text-slate-500" />
                <span>{isBn ? 'আইনি ও প্রযুক্তিগত উপদেষ্টা বিজ্ঞপ্তি (Advisory Disclaimer):' : 'Advisory Disclaimer (Not a Legal Certificate):'}</span>
              </p>
              <span className="text-[11px] text-slate-500">
                {isBn ? 'রেকর্ড সংস্করণ:' : 'Engine Version:'} {assessment.engine_version || 'v2.1.0'} | {isBn ? 'উপাত্ত তারিখ:' : 'Data as of:'} {assessment.data_as_of || '2026-10-15'}
              </span>
            </div>
            <p>
              {isBn
                ? (assessment.disclaimer_bn ||
                    'অত্র ঝুঁকি মূল্যায়ন প্রতিবেদনটি ডিজিটাল ভূমি রেকর্ডসমূহের প্রাথমিক স্বয়ংক্রিয় পর্যবেক্ষণীয় বিশ্লেষণ, কোনো চূড়ান্ত আইনি দলিল, প্রত্যয়নপত্র বা টাইটেল গ্যারান্টি নয়। বায়না বা অর্থ লেনদেনের পূর্বে মূল বায়া দলিল, পর্চা এবং সরেজমিন দখল সরেজমিনে যাচাই করার পরামর্শ দেওয়া হচ্ছে।')
                : (assessment.disclaimer_en ||
                    'This risk assessment report is an automated pre-transaction advisory analysis based on available digitized records. It does not constitute a statutory title guarantee or legal opinion.')}
            </p>
          </div>
        </div>
      ) : null}
    </div>
  );
};
