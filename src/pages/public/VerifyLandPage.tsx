import React, { useState, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
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
  ArrowLeft,
  Home,
  RefreshCw,
  ShieldAlert,
  HelpCircle,
  Database,
  Calendar,
  Lock,
} from 'lucide-react';
import { RiskBadge } from '../../components/common/RiskBadge';

const DEFAULT_DEMO_PARCELS: LandParcel[] = [
  {
    id: 'pcl-clean-405',
    parcel_number: 'DH-GL-BAD-405',
    district: 'ঢাকা',
    upazila: 'গুলশান',
    mouza: 'বাড্ডা',
    jl_no: '২৮',
    khatian_no: '১২০৪',
    khatian_type: 'RS',
    dag_no: '৪০৫',
    land_class: 'বাস্তু (ভিটি)',
    total_area_decimal: 20,
    available_area_decimal: 10,
    current_holding_no: 'HLD-BAD-8812',
    address_description_bn: 'মৌজা বাড্ডা, দাগ ৪০৫, খতিয়ান ১২০৪, মধ্য বাড্ডা বাজার সংলগ্ন',
    is_khas_land: false,
    is_acquired: false,
    is_vested: false,
    court_case_flag: false,
    bank_mortgage_flag: false,
    data_as_of: '2026-10-15',
    data_source: 'Synthetic demo dataset',
    created_at: '2024-01-10T00:00:00Z',
    updated_at: '2024-01-10T00:00:00Z',
  },
  {
    id: 'pcl-taxdue-882',
    parcel_number: 'DH-GL-SAT-882',
    district: 'ঢাকা',
    upazila: 'গুলশান',
    mouza: 'সাঁতারকুল',
    jl_no: '৩১',
    khatian_no: '৫৫১',
    khatian_type: 'BS',
    dag_no: '৮৮২',
    land_class: 'নাল',
    total_area_decimal: 15,
    available_area_decimal: 15,
    current_holding_no: 'HLD-SAT-4190',
    address_description_bn: 'মৌজা সাঁতারকুল, দাগ ৮৮২, বেরাইদ সংযোগ সড়ক সংলগ্ন',
    is_khas_land: false,
    is_acquired: false,
    is_vested: false,
    court_case_flag: false,
    bank_mortgage_flag: false,
    data_as_of: '2026-10-15',
    data_source: 'Synthetic demo dataset',
    created_at: '2024-02-15T00:00:00Z',
    updated_at: '2024-02-15T00:00:00Z',
  },
  {
    id: 'pcl-oversell-102',
    parcel_number: 'DH-GL-VAT-102',
    district: 'ঢাকা',
    upazila: 'গুলশান',
    mouza: 'ভাটারা',
    jl_no: '২৫',
    khatian_no: '৯৯০',
    khatian_type: 'RS',
    dag_no: '১০২',
    land_class: 'ধানী',
    total_area_decimal: 12,
    available_area_decimal: 1.5,
    current_holding_no: 'HLD-VAT-1102',
    address_description_bn: 'মৌজা ভাটারা, দাগ ১০২, কুড়িল সংলগ্ন মাঠের জমি',
    is_khas_land: false,
    is_acquired: false,
    is_vested: false,
    court_case_flag: false,
    bank_mortgage_flag: false,
    data_as_of: '2026-10-15',
    data_source: 'Synthetic demo dataset',
    created_at: '2024-03-01T00:00:00Z',
    updated_at: '2024-03-01T00:00:00Z',
  },
  {
    id: 'pcl-court-710',
    parcel_number: 'DH-GL-AFT-710',
    district: 'ঢাকা',
    upazila: 'গুলশান',
    mouza: 'আফতাবনগর',
    jl_no: '২৯',
    khatian_no: '১০৯',
    khatian_type: 'BS',
    dag_no: '৭১০',
    land_class: 'ভিটি',
    total_area_decimal: 25,
    available_area_decimal: 25,
    current_holding_no: 'HLD-AFT-9912',
    address_description_bn: 'মৌজা আফতাবনগর, দাগ ৭১০, ব্লক এফ সংলগ্ন ভূমি',
    is_khas_land: false,
    is_acquired: true,
    is_vested: false,
    court_case_flag: true,
    bank_mortgage_flag: true,
    data_as_of: '2026-10-15',
    data_source: 'Synthetic demo dataset',
    created_at: '2024-03-15T00:00:00Z',
    updated_at: '2024-03-15T00:00:00Z',
  },
  {
    id: 'pcl-khas-999',
    parcel_number: 'DH-SV-SAV-999',
    district: 'ঢাকা',
    upazila: 'সাভার',
    mouza: 'সাভার',
    jl_no: '১২',
    khatian_no: '০১',
    khatian_type: 'BS',
    dag_no: '৯৯৯',
    land_class: 'সরকারি খাস ও জলাভূমি',
    total_area_decimal: 60,
    available_area_decimal: 0,
    current_holding_no: 'HLD-KHAS-9999',
    address_description_bn: 'মৌজা সাভার, দাগ ৯৯৯, বংশী নদী তীরবর্তী ১০০% সরকারি খাস জমি',
    is_khas_land: true,
    is_acquired: false,
    is_vested: false,
    court_case_flag: false,
    bank_mortgage_flag: false,
    data_as_of: '2026-10-15',
    data_source: 'Synthetic demo dataset',
    created_at: '2024-06-01T00:00:00Z',
    updated_at: '2024-06-01T00:00:00Z',
  },
  {
    id: 'pcl-returned-502',
    parcel_number: 'DH-GL-BAD-502',
    district: 'ঢাকা',
    upazila: 'গুলশান',
    mouza: 'বাড্ডা',
    jl_no: '২৮',
    khatian_no: '১২০৫',
    khatian_type: 'RS',
    dag_no: '৫০২',
    land_class: 'বাস্তু (ভিটি)',
    total_area_decimal: 18,
    available_area_decimal: 9,
    current_holding_no: 'HLD-BAD-5021',
    address_description_bn: 'মৌজা বাড্ডা, দাগ ৫০২, খতিয়ান ১২০৫, পূর্ব বাড্ডা আবাসিক এলাকা',
    is_khas_land: false,
    is_acquired: false,
    is_vested: false,
    court_case_flag: false,
    bank_mortgage_flag: false,
    data_as_of: '2026-10-15',
    data_source: 'Synthetic demo dataset',
    created_at: '2024-01-12T00:00:00Z',
    updated_at: '2024-01-12T00:00:00Z',
  },
  {
    id: 'pcl-union-appr-603',
    parcel_number: 'DH-GL-BAD-603',
    district: 'ঢাকা',
    upazila: 'গুলশান',
    mouza: 'বাড্ডা',
    jl_no: '২৮',
    khatian_no: '১২০৬',
    khatian_type: 'RS',
    dag_no: '৬০৩',
    land_class: 'বাস্তু (ভিটি)',
    total_area_decimal: 12,
    available_area_decimal: 6,
    current_holding_no: 'HLD-BAD-6031',
    address_description_bn: 'মৌজা বাড্ডা, দাগ ৬০৩, খতিয়ান ১২০৬, উত্তর বাড্ডা সংযোগ সড়ক',
    is_khas_land: false,
    is_acquired: false,
    is_vested: false,
    court_case_flag: false,
    bank_mortgage_flag: false,
    data_as_of: '2026-10-15',
    data_source: 'Synthetic demo dataset',
    created_at: '2024-01-14T00:00:00Z',
    updated_at: '2024-01-14T00:00:00Z',
  },
];

export const VerifyLandPage: React.FC = () => {
  const { language } = useLanguage();
  const isBn = language === 'bn';

  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialParcelId = queryParams.get('parcel_id') || 'pcl-clean-405';

  const handleGoBack = () => {
    try {
      if (window.history.length > 1 && window.history.state && (window.history.state as any).idx > 0) {
        navigate(-1);
      } else {
        navigate('/');
      }
    } catch {
      navigate('/');
    }
  };

  const [parcels, setParcels] = useState<LandParcel[]>(DEFAULT_DEMO_PARCELS);
  const [selectedParcelId, setSelectedParcelId] = useState(initialParcelId);
  const [sellerNid, setSellerNid] = useState('19852691029384756');
  const [proposedShare, setProposedShare] = useState('0.05');
  const [proposedArea, setProposedArea] = useState('1.0');

  const [assessment, setAssessment] = useState<RiskAssessment | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedParcel, setSelectedParcel] = useState<LandParcel | null>(
    DEFAULT_DEMO_PARCELS.find((p) => p.id === initialParcelId) || DEFAULT_DEMO_PARCELS[0]
  );

  // Load available demo parcels for quick selection
  useEffect(() => {
    const fetchParcels = async () => {
      const res = await api.searchLand({});
      if (res.success && res.data && res.data.length > 0) {
        setParcels(res.data);
        const current = res.data.find((p: LandParcel) => p.id === selectedParcelId);
        if (current) setSelectedParcel(current);
      } else {
        const current = DEFAULT_DEMO_PARCELS.find((p: LandParcel) => p.id === selectedParcelId);
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
    if (level === 'critical') return 'text-red-600 dark:text-red-400 border-red-500 dark:border-red-800 bg-red-50 dark:bg-red-950/40';
    if (level === 'high') return 'text-orange-600 dark:text-orange-400 border-orange-500 dark:border-orange-800 bg-orange-50 dark:bg-orange-950/40';
    if (level === 'medium') return 'text-amber-600 dark:text-amber-400 border-amber-500 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/40';
    return 'text-emerald-600 dark:text-emerald-400 border-emerald-500 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/40';
  };

  const getFactorStatusBadge = (status: 'passed' | 'warning' | 'failed') => {
    if (status === 'passed') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
          <CheckCircle2 size={12} />
          {isBn ? 'সঠিক / নিরাপদ' : 'Passed'}
        </span>
      );
    }
    if (status === 'warning') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
          <AlertTriangle size={12} />
          {isBn ? 'সতর্কতা / করণীয়' : 'Warning'}
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-100 dark:bg-red-950/60 text-red-800 dark:text-red-300 border border-red-300 dark:border-red-800">
        <AlertOctagon size={12} />
        {isBn ? 'ব্যর্থ / ঝুঁকিপূর্ণ' : 'Failed'}
      </span>
    );
  };

  return (
    <div className={`${isBn ? 'font-bengali' : 'font-sans'} min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 py-8 px-4 sm:px-6 lg:px-8 xl:px-10 w-full transition-colors`}>
      {/* Header with Back Navigation */}
      <div className="mb-6 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={handleGoBack}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-emerald-700 dark:hover:text-emerald-400 transition-all shadow-sm cursor-pointer group active:scale-95"
              title={isBn ? 'হোমপেজে ফিরে যান' : 'Go back to Home'}
            >
              <ArrowLeft size={15} className="text-emerald-600 dark:text-emerald-400 transition-transform group-hover:-translate-x-1" />
              <span>{isBn ? 'হোমপেজে ফিরে যান' : 'Back to Home'}</span>
            </button>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <Link to="/" className="hover:underline flex items-center gap-1 hover:text-emerald-700 dark:hover:text-emerald-400">
              <Home size={13} />
              <span>{isBn ? 'হোম' : 'Home'}</span>
            </Link>
            <span>/</span>
            <span className="text-slate-900 dark:text-slate-200 font-semibold">
              {isBn ? 'কেনার আগে জমি যাচাই' : 'Check Before You Buy'}
            </span>
          </div>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-1">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <ShieldCheck className="text-teal-600 dark:text-teal-400 shrink-0" size={30} />
              <span>{isBn ? 'কেনার আগে জমি যাচাই (Check Before You Buy)' : 'Check Before You Buy (Land Pre-Purchase Verification)'}</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
              {isBn
                ? 'বায়নার পূর্বে প্রস্তাবিত বিক্রেতা, খতিয়ানের হিস্যা, বকেয়া খাজনা এবং আদালতের মামলা ও লিয়েন স্বয়ংক্রিয়ভাবে পরীক্ষা করুন'
                : 'Automated pre-purchase audit of seller ownership, khatian share sufficiency, land taxes, injunctions and mortgage liens.'}
            </p>
          </div>

          <div className="flex items-center gap-2 no-print shrink-0">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 px-3.5 py-2 rounded-lg text-xs font-semibold shadow-sm transition"
            >
              <Home size={14} className="text-emerald-600 dark:text-emerald-400" />
              <span>{isBn ? 'হোমপেজ' : 'Home Page'}</span>
            </Link>
            {assessment && (
              <button
                onClick={() => window.print()}
                className="inline-flex items-center gap-1.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 px-3.5 py-2 rounded-lg text-xs font-semibold shadow-sm transition"
              >
                <Printer size={14} />
                <span>{isBn ? 'প্রতিবেদন প্রিন্ট করুন' : 'Print Assessment'}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Input Selector Card */}
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-gov-sm border border-slate-200 dark:border-slate-800 p-6 mb-8 no-print">
        <h2 className="text-sm font-bold text-slate-900 dark:text-white mb-3 pb-2 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <span>{isBn ? 'যাচাইকরণের তথ্য নির্বাচন করুন' : 'Select Parcel & Evaluation Parameters'}</span>
          <span className="text-xs text-slate-500 dark:text-slate-400 font-normal">
            {isBn ? 'সিনথেটিক ডেমো ডেটাসেট' : 'Synthetic Demo Dataset'}
          </span>
        </h2>

        {/* Demo Fast Preset Buttons */}
        <div className="mb-5 bg-slate-50 dark:bg-slate-800/50 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700/60">
          <p className="text-xs text-slate-600 dark:text-slate-300 font-semibold mb-2">
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
              className="px-3.5 py-1.5 rounded-full font-medium bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 transition shadow-xs cursor-pointer"
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
              className="px-3.5 py-1.5 rounded-full font-medium bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700 hover:bg-amber-100 dark:hover:bg-amber-900/60 transition shadow-xs cursor-pointer"
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
              className="px-3.5 py-1.5 rounded-full font-medium bg-orange-50 dark:bg-orange-950/40 text-orange-900 dark:text-orange-300 border border-orange-300 dark:border-orange-700 hover:bg-orange-100 dark:hover:bg-orange-900/60 transition shadow-xs cursor-pointer"
            >
              ⚠️ {isBn ? 'হিস্যা ঘাটতি / অতিরিক্ত বিক্রি (দাগ ১০২)' : 'Over-Sale Share Limit (Plot 102)'}
            </button>
            <button
              onClick={() => {
                setSelectedParcelId('pcl-court-710');
                setSellerNid('');
                handleRunAssessment('pcl-court-710', '');
              }}
              className="px-3.5 py-1.5 rounded-full font-bold bg-red-100 dark:bg-red-950/40 text-red-900 dark:text-red-300 border border-red-400 dark:border-red-700 hover:bg-red-200 dark:hover:bg-red-900/60 transition shadow-xs cursor-pointer"
            >
              ⛔ {isBn ? 'আদালতের স্থগিতাদেশ ও মর্টগেজ (দাগ ৭১০)' : 'Court Injunction & Mortgage (Plot 710)'}
            </button>
            <button
              onClick={() => {
                setSelectedParcelId('pcl-khas-999');
                setSellerNid('');
                handleRunAssessment('pcl-khas-999', '');
              }}
              className="px-3.5 py-1.5 rounded-full font-bold bg-rose-100 dark:bg-rose-950/40 text-rose-900 dark:text-rose-300 border border-rose-400 dark:border-rose-700 hover:bg-rose-200 dark:hover:bg-rose-900/60 transition shadow-xs cursor-pointer"
            >
              🚫 {isBn ? '১০০% সরকারি খাস জমি (দাগ ৯৯৯)' : 'Government Khas Land (Plot 999)'}
            </button>
          </div>
        </div>

        {/* Unified 1-Line Input & Audit Bar */}
        <div className="flex flex-col md:flex-row items-stretch gap-2.5 text-xs w-full">
          {/* Box 1: Parcel & Mouza */}
          <div className="flex-[1.4] min-w-0 bg-slate-50 dark:bg-slate-800/90 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2 min-h-[52px] flex flex-col justify-center focus-within:ring-2 focus-within:ring-emerald-500 focus-within:border-emerald-500 transition shadow-xs">
            <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider truncate mb-0.5">
              {isBn ? 'যাচাইযোগ্য দাগ ও মৌজা' : 'Select Parcel & Mouza'}
            </label>
            <select
              value={selectedParcelId}
              onChange={(e) => setSelectedParcelId(e.target.value)}
              className="w-full bg-transparent text-slate-900 dark:text-slate-100 font-semibold text-xs border-0 p-0 focus:ring-0 outline-none cursor-pointer truncate"
            >
              {parcels.map((p) => (
                <option key={p.id} value={p.id} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">
                  {isBn
                    ? `দাগ ${p.dag_no} — খতিয়ান ${p.khatian_no} (${p.mouza}, ${p.total_area_decimal} শতক)`
                    : `Plot ${p.dag_no} — Khatian ${p.khatian_no} (${p.mouza}, ${p.total_area_decimal} Dec)`}
                </option>
              ))}
            </select>
          </div>

          {/* Box 2: Seller NID */}
          <div className="flex-1 min-w-0 bg-slate-50 dark:bg-slate-800/90 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2 min-h-[52px] flex flex-col justify-center focus-within:ring-2 focus-within:ring-emerald-500 focus-within:border-emerald-500 transition shadow-xs">
            <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider truncate mb-0.5">
              {isBn ? 'বিক্রেতার এনআইডি / পরিচিতি (ঐচ্ছিক)' : 'Seller NID (Optional)'}
            </label>
            <input
              type="text"
              placeholder={isBn ? 'যেমন: ১৯৮৫২৬৯১০২৯৩৮৪৭৫৬' : 'e.g. 19852691029384756'}
              value={sellerNid}
              onChange={(e) => setSellerNid(e.target.value)}
              className="w-full bg-transparent text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 font-semibold text-xs border-0 p-0 focus:ring-0 outline-none"
            />
          </div>

          {/* Box 3: Proposed Sale Share */}
          <div className="w-full md:w-56 min-w-0 bg-slate-50 dark:bg-slate-800/90 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2 min-h-[52px] flex flex-col justify-center focus-within:ring-2 focus-within:ring-emerald-500 focus-within:border-emerald-500 transition shadow-xs">
            <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider truncate mb-0.5">
              {isBn ? 'প্রস্তাবিত বিক্রয় অংশ (0.0 - 1.0)' : 'Proposed Share (0.0 - 1.0)'}
            </label>
            <input
              type="number"
              step="0.01"
              max="1.0"
              placeholder={isBn ? 'যেমন: ০.০৫ (৫%)' : 'e.g. 0.05'}
              value={proposedShare}
              onChange={(e) => setProposedShare(e.target.value)}
              className="w-full bg-transparent text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 font-semibold text-xs border-0 p-0 focus:ring-0 outline-none"
            />
          </div>

          {/* Box 4: Action Button */}
          <div className="w-full md:w-auto shrink-0 flex items-stretch">
            <button
              onClick={() => handleRunAssessment()}
              disabled={loading}
              className="w-full md:w-auto px-6 py-2.5 min-h-[52px] rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-700 hover:from-emerald-700 hover:to-cyan-800 text-white font-bold text-xs shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <ShieldCheck size={18} className="shrink-0 text-emerald-200" />
              <span className="whitespace-nowrap">
                {loading ? (isBn ? 'যাচাই হচ্ছে...' : 'Auditing...') : (isBn ? 'মূল্যায়ন পরিচালনা করুন' : 'Run Audit')}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Assessment Output Report Card */}
      {loading ? (
        <div className="bg-white dark:bg-slate-900 rounded-xl p-16 text-center border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="inline-block animate-spin w-10 h-10 border-4 border-teal-600 dark:border-teal-400 border-t-transparent rounded-full mb-3"></div>
          <p className="text-sm font-bold text-slate-800 dark:text-slate-100">
            {isBn ? 'ভূমি রেকর্ড, রাজস্ব ও আদালতের ডাটাবেজে অনুসন্ধান চলছে...' : 'Auditing land records, tax ledger & court dispute registries...'}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {isBn ? 'হিস্যা ও আইনগত দায়বদ্ধতা বিশ্লেষণ করা হচ্ছে' : 'Analyzing share validation and legal encumbrance factors...'}
          </p>
        </div>
      ) : assessment ? (
        <div id="printable-assessment" className="space-y-6">
          {/* Critical Override Alert Banner */}
          {assessment.critical_override_triggered && (
            <div className="p-4 sm:p-5 rounded-xl bg-red-600 dark:bg-red-950/80 dark:border dark:border-red-800/80 text-white shadow-md flex items-start gap-3">
              <ShieldAlert size={28} className="shrink-0 mt-0.5 text-white" />
              <div>
                <div className="font-extrabold text-sm sm:text-base flex items-center gap-2">
                  <span>
                    {isBn
                      ? '⚠️ ক্রিটিক্যাল ফ্যাক্টর ওভাররাইড সক্রিয় (Critical Factor Override Triggered)'
                      : '⚠️ Critical Factor Override Triggered'}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-red-100 dark:text-red-200 mt-1">
                  {isBn
                    ? 'মোট পয়েন্ট বা অন্যান্য রেকর্ড পরিষ্কার থাকা সত্ত্বেও এই জমিতে গুরুতর আইনি বা মালিকানা প্রতিবন্ধকতা রয়েছে। তাই সামগ্রিক ফলাফলকে কখনই "নিরাপদ" হিসেবে গণ্য করা যাবে না।'
                    : 'Severe legal or encumbrance blocks override standard scoring. This parcel cannot display a Low-Risk rating regardless of clean tax or other sub-scores.'}
                </p>
                {assessment.critical_override_reasons && assessment.critical_override_reasons.length > 0 && (
                  <ul className="mt-2 text-xs space-y-1 list-disc list-inside text-red-100 dark:text-red-200 font-medium">
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
            className={`p-6 rounded-2xl border shadow-sm transition-colors ${
              assessment.overall_risk_level === 'low'
                ? 'bg-emerald-50/70 border-emerald-300 dark:bg-slate-900 dark:border-emerald-800/80 dark:shadow-[0_4px_24px_rgba(16,185,129,0.06)]'
                : assessment.overall_risk_level === 'medium'
                ? 'bg-amber-50/70 border-amber-300 dark:bg-slate-900 dark:border-amber-800/80 dark:shadow-[0_4px_24px_rgba(245,158,11,0.06)]'
                : assessment.overall_risk_level === 'high'
                ? 'bg-orange-50/70 border-orange-400 dark:bg-slate-900 dark:border-orange-800/80 dark:shadow-[0_4px_24px_rgba(249,115,22,0.06)]'
                : 'bg-red-50 border-red-500 dark:bg-slate-900 dark:border-red-800/80 dark:shadow-[0_4px_24px_rgba(239,68,68,0.08)]'
            }`}
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-200/60 dark:border-slate-800">
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-emerald-400 block">
                  {isBn ? 'স্বয়ংক্রিয় স্বচ্ছ ঝুঁকি অডিট প্রতিবেদন (Transparent Risk Engine Audit)' : 'Automated Transparent Risk Audit'}
                </span>
                <div className="flex flex-wrap items-center gap-3">
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                    {isBn
                      ? `দাগ নং ${selectedParcel?.dag_no || ''} — মৌজা ${selectedParcel?.mouza || ''}`
                      : `Plot #${selectedParcel?.dag_no || ''} — Mouza ${selectedParcel?.mouza || ''}`}
                  </h2>
                  <RiskBadge level={assessment.overall_risk_level} score={assessment.risk_score} />
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  {isBn ? 'জেলা' : 'District'}: <strong className="text-slate-800 dark:text-slate-200">{selectedParcel?.district || selectedParcel?.district_bn}</strong> | {isBn ? 'উপজেলা' : 'Upazila'}: <strong className="text-slate-800 dark:text-slate-200">{selectedParcel?.upazila || selectedParcel?.upazila_bn}</strong> | {isBn ? 'খতিয়ান নং' : 'Khatian'}: <strong className="text-slate-800 dark:text-slate-200">{selectedParcel?.khatian_no}</strong>
                </p>
              </div>

              {/* Score Gauge / Progress Ring */}
              <div className="flex items-center gap-4 bg-white/90 dark:bg-slate-950/80 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="relative w-20 h-20 flex items-center justify-center">
                  <svg className="w-20 h-20 transform -rotate-90">
                    <circle
                      cx="40"
                      cy="40"
                      r="32"
                      stroke="currentColor"
                      className="text-slate-200 dark:text-slate-800"
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
                    <span className="text-lg font-black text-slate-900 dark:text-white leading-none">
                      {assessment.risk_score}
                    </span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 block">/১০০</span>
                  </div>
                </div>

                <div className="text-xs">
                  <span className="font-bold text-slate-700 dark:text-slate-200 block">
                    {isBn ? 'নিরাপত্তা সূচক (Safety Score)' : 'Safety Index Score'}
                  </span>
                  <span className="text-slate-500 dark:text-slate-400 block text-[11px] mt-0.5">
                    {assessment.overall_risk_level === 'low'
                      ? (isBn ? 'স্বত্ব ও রেকর্ড ঝুঁকিমুক্ত' : 'Low encumbrance risk')
                      : assessment.overall_risk_level === 'medium'
                      ? (isBn ? 'সতর্কতা / করণীয় চিহ্নিত' : 'Notice / Action required')
                      : assessment.overall_risk_level === 'high'
                      ? (isBn ? 'উচ্চ ঝুঁকি বিদ্যমান' : 'High transaction risk')
                      : (isBn ? 'সংকটাপন্ন / লেনদেন নিষিদ্ধ' : 'Critical / Blocked transaction')}
                  </span>
                  <div className="mt-1 flex items-center gap-1 text-[10px] text-slate-400 dark:text-slate-500">
                    <Database size={10} />
                    <span>{assessment.engine_version || 'v2.1.0-transparent'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Status Pill Matrix */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 text-xs font-medium">
              <div className="bg-white dark:bg-slate-950/80 p-3 rounded-lg border border-slate-200/80 dark:border-slate-800 text-slate-800 dark:text-slate-200 flex items-center gap-2 shadow-sm">
                {assessment.seller_match ? (
                  <CheckCircle2 size={16} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
                ) : (
                  <AlertTriangle size={16} className="text-red-600 dark:text-red-400 shrink-0" />
                )}
                <span>{isBn ? 'মালিকানা রেকর্ড:' : 'Owner Match:'} <strong className="text-slate-900 dark:text-white font-semibold">{assessment.seller_match ? (isBn ? 'সঠিক' : 'Valid') : (isBn ? 'অমিল' : 'Mismatch')}</strong></span>
              </div>

              <div className="bg-white dark:bg-slate-950/80 p-3 rounded-lg border border-slate-200/80 dark:border-slate-800 text-slate-800 dark:text-slate-200 flex items-center gap-2 shadow-sm">
                {assessment.share_valid ? (
                  <CheckCircle2 size={16} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
                ) : (
                  <AlertTriangle size={16} className="text-red-600 dark:text-red-400 shrink-0" />
                )}
                <span>{isBn ? 'হিস্যা প্রাপ্যতা:' : 'Share Valid:'} <strong className="text-slate-900 dark:text-white font-semibold">{assessment.share_valid ? (isBn ? 'পর্যাপ্ত' : 'Sufficient') : (isBn ? 'ঘাটতি' : 'Exceeded')}</strong></span>
              </div>

              <div className="bg-white dark:bg-slate-950/80 p-3 rounded-lg border border-slate-200/80 dark:border-slate-800 text-slate-800 dark:text-slate-200 flex items-center gap-2 shadow-sm">
                {assessment.tax_cleared ? (
                  <CheckCircle2 size={16} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
                ) : (
                  <AlertTriangle size={16} className="text-amber-600 dark:text-amber-400 shrink-0" />
                )}
                <span>{isBn ? 'খাজনা স্থিতি:' : 'Land Tax:'} <strong className="text-slate-900 dark:text-white font-semibold">{assessment.tax_cleared ? (isBn ? 'পরিশোধিত' : 'Cleared') : (isBn ? 'বকেয়া' : 'Overdue')}</strong></span>
              </div>

              <div className="bg-white dark:bg-slate-950/80 p-3 rounded-lg border border-slate-200/80 dark:border-slate-800 text-slate-800 dark:text-slate-200 flex items-center gap-2 shadow-sm">
                {!assessment.court_dispute && !assessment.mortgage_encumbrance ? (
                  <CheckCircle2 size={16} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
                ) : (
                  <AlertOctagon size={16} className="text-red-600 dark:text-red-400 shrink-0" />
                )}
                <span>{isBn ? 'মামলা ও বন্ধক:' : 'Court/Mortgage:'} <strong className="text-slate-900 dark:text-white font-semibold">{assessment.court_dispute || assessment.mortgage_encumbrance ? (isBn ? 'আবদ্ধ' : 'Encumbered') : (isBn ? 'মুক্ত' : 'Clean')}</strong></span>
              </div>
            </div>
          </div>

          {/* Section: Transparent Factor Breakdown */}
          {assessment.factors && assessment.factors.length > 0 && (
            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-gov-sm border border-slate-200 dark:border-slate-800 p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-3 mb-4">
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
                    <Scale className="text-teal-600 dark:text-teal-400" size={18} />
                    <span>
                      {isBn
                        ? '১. স্বচ্ছ ফ্যাক্টরভিত্তিক মূল্যায়ন তালিকা (Factor-by-Factor Breakdown)'
                        : '1. Transparent Factor-by-Factor Breakdown'}
                    </span>
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {isBn
                      ? 'প্রতিটি ঝুঁকির কারণ, নির্ধারিত গুরুত্ব (Weight), প্রাপ্ত পয়েন্ট এবং সহজবোধ্য ব্যাখ্যা'
                      : 'Weight allocation, awarded points, status and plain-language explanation for every legal criterion.'}
                  </p>
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2">
                  <span className="inline-block w-2 h-2 rounded-full bg-emerald-500"></span>
                  <span>{isBn ? 'মোট ১০০ পয়েন্ট ভিত্তি' : '100 Point Scale'}</span>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-800/70 text-slate-700 dark:text-slate-300 border-b border-slate-200 dark:border-slate-700">
                      <th className="py-2.5 px-3 font-semibold">{isBn ? 'মূল্যায়ন ফ্যাক্টর (Factor)' : 'Factor'}</th>
                      <th className="py-2.5 px-3 font-semibold text-center">{isBn ? 'মর্যাদা (Status)' : 'Status'}</th>
                      <th className="py-2.5 px-3 font-semibold text-center">{isBn ? 'পয়েন্ট কর্তন' : 'Deduction'}</th>
                      <th className="py-2.5 px-3 font-semibold">{isBn ? 'সহজবোধ্য ব্যাখ্যা ও তথ্যপ্রমাণ' : 'Plain Explanation & Evidence'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {assessment.factors.map((f: RiskFactorDetail, idx: number) => (
                      <tr
                        key={idx}
                        className={`hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition ${
                          f.is_critical && f.status === 'failed' ? 'bg-red-50/40 dark:bg-red-950/20' : ''
                        }`}
                      >
                        <td className="py-3 px-3 font-semibold text-slate-900 dark:text-white align-top">
                          <div className="flex items-center gap-1.5">
                            {f.is_critical && (
                              <span
                                title={isBn ? 'ক্রিটিক্যাল ফ্যাক্টর (আইনি বাধ্যবাধকতা)' : 'Critical Legal Factor'}
                                className="text-red-500 dark:text-red-400 cursor-help"
                              >
                                ★
                              </span>
                            )}
                            <span>{isBn ? f.title_bn : f.title_en}</span>
                          </div>
                          <span className="text-[10px] text-slate-400 dark:text-slate-500 block font-normal">
                            {isBn ? `সর্বোচ্চ স্কোর: ${f.weight_max_points}` : `Max weight: ${f.weight_max_points} pts`}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-center align-top whitespace-nowrap">
                          {getFactorStatusBadge(f.status)}
                        </td>
                        <td className="py-3 px-3 text-center font-mono font-bold align-top">
                          {f.deducted_points > 0 ? (
                            <span className="text-red-600 dark:text-red-400">-{f.deducted_points}</span>
                          ) : (
                            <span className="text-emerald-600 dark:text-emerald-400">০</span>
                          )}
                        </td>
                        <td className="py-3 px-3 text-slate-700 dark:text-slate-300 leading-relaxed align-top">
                          <p className="font-medium text-slate-800 dark:text-slate-200">
                            {isBn ? f.explanation_bn : f.explanation_en}
                          </p>
                          {f.is_critical && f.status === 'failed' && (
                            <span className="inline-block mt-1 text-[11px] font-bold text-red-700 dark:text-red-400 bg-red-100 dark:bg-red-950/60 px-2 py-0.5 rounded border border-red-200 dark:border-red-800">
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
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-gov-sm border border-slate-200 dark:border-slate-800 p-6">
            <h3 className="font-bold text-slate-900 dark:text-white text-sm mb-2 flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
              <Info className="text-gov-blue dark:text-blue-400" size={16} />
              <span>{isBn ? '২. সামগ্রিক বিশ্লেষণ সারাংশ (Executive Summary)' : '2. Executive Summary'}</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed bg-slate-50 dark:bg-slate-800/60 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
              {isBn ? assessment.summary_bn : (assessment.summary_en || assessment.summary_bn)}
            </p>
          </div>

          {/* Section 3: Identified Issues */}
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-gov-sm border border-slate-200 dark:border-slate-800 p-6">
            <h3 className="font-bold text-slate-900 dark:text-white text-sm mb-3 flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
              <AlertTriangle className="text-amber-600 dark:text-amber-400" size={16} />
              <span>{isBn ? '৩. শনাক্তকৃত অসঙ্গতি ও ঝুঁকি (Identified Issues)' : '3. Identified Discrepancies & Issues'}</span>
            </h3>
            {(assessment.identified_issues_bn || []).length === 0 ? (
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 rounded-lg text-xs font-medium flex items-center gap-2 border border-emerald-200 dark:border-emerald-800/60">
                <CheckCircle2 size={16} />
                <span>{isBn ? 'কোনো প্রাথমিক স্বত্ব বিরোধ বা গুরুতর ত্রুটি শনাক্ত হয়নি।' : 'No primary title disputes or severe discrepancies identified.'}</span>
              </div>
            ) : (
              <ul className="space-y-2 text-xs">
                {(assessment.identified_issues_bn || []).map((issue, idx) => (
                  <li key={idx} className="flex items-start gap-2 bg-red-50 dark:bg-red-950/40 text-red-900 dark:text-red-200 p-3 rounded-md border border-red-200 dark:border-red-800/60">
                    <AlertTriangle size={15} className="text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
                    <span className="font-medium">{issue}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Section 4: Warning Basis */}
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-gov-sm border border-slate-200 dark:border-slate-800 p-6">
            <h3 className="font-bold text-slate-900 dark:text-white text-sm mb-3 flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
              <Scale className="text-gov-blue dark:text-blue-400" size={16} />
              <span>{isBn ? '৪. সতর্কতার তথ্যসূত্র ও প্রমাণপত্র (Warning Basis & Evidential Sources)' : '4. Evidential Sources & Grounds'}</span>
            </h3>
            <ul className="space-y-2 text-xs">
              {(assessment.warning_basis_bn || []).map((basis, idx) => (
                <li key={idx} className="flex items-center gap-2 text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded border border-slate-200 dark:border-slate-700">
                  <span className="w-1.5 h-1.5 rounded-full bg-gov-blue dark:bg-blue-400"></span>
                  <span>{basis}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Section 5: Unverified Information */}
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-gov-sm border border-slate-200 dark:border-slate-800 p-6">
            <h3 className="font-bold text-slate-900 dark:text-white text-sm mb-3 flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 text-amber-900 dark:text-amber-400">
              <AlertTriangle className="text-amber-600 dark:text-amber-400" size={16} />
              <span>{isBn ? '৫. ডিজিটাল রেকর্ডের সীমাবদ্ধতা (Unverified Data / Limitations)' : '5. Unverified Attributes / Limitations'}</span>
            </h3>
            <div className="bg-amber-50/50 dark:bg-amber-950/30 p-3 rounded-lg border border-amber-200 dark:border-amber-800/60 mb-3 text-xs text-amber-900 dark:text-amber-300">
              <strong>{isBn ? 'সতর্কতা:' : 'Notice:'}</strong> {isBn ? 'শুধুমাত্র অনলাইন ডেটাবেজের তথ্য পরিষ্কার থাকার অর্থ এই নয় যে জমিতে কোনো শারীরিক দখল বিরোধ বা পারিবারিক দ্বন্দ্ব নেই।' : 'Clean digital records do not guarantee absence of physical boundary encroachment or unregistered family disputes.'}
            </div>
            <ul className="space-y-2 text-xs">
              {(assessment.unverified_data_bn || []).map((item, idx) => (
                <li key={idx} className="flex items-center gap-2 text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded border border-slate-200 dark:border-slate-700">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                  <span>{item}</span>
                  <span className="ml-auto text-[10px] bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 px-1.5 py-0.5 rounded font-semibold">
                    {isBn ? 'তথ্য অনুপস্থিত' : 'Data Missing'}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Section 6: Recommended Next Actions */}
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-gov-sm border border-slate-200 dark:border-slate-800 p-6">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2 mb-3">
              <h3 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
                <CheckCircle2 className="text-teal-600 dark:text-teal-400" size={16} />
                <span>{isBn ? '৬. পরবর্তী আইনি করণীয় (Recommended Next Steps)' : '6. Recommended Next Legal Actions'}</span>
              </h3>
              {assessment.overall_risk_level === 'low' && (
                <Link
                  to={`/citizen/new-application?parcel_id=${selectedParcel?.id}`}
                  className="no-print inline-flex items-center gap-1.5 text-xs font-bold text-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/50 hover:bg-teal-100 dark:hover:bg-teal-900/60 px-3 py-1.5 rounded-md border border-teal-200 dark:border-teal-700/60 transition"
                >
                  <span>{isBn ? 'বিক্রয় আবেদন শুরু করুন' : 'Initiate Sale Application'}</span>
                  <ArrowRight size={14} />
                </Link>
              )}
            </div>
            <ol className="list-decimal list-inside space-y-2 text-xs text-slate-800 dark:text-slate-200">
              {(assessment.recommended_actions_bn || []).map((action, idx) => (
                <li key={idx} className="p-2.5 bg-teal-50/60 dark:bg-teal-950/30 rounded border border-teal-200 dark:border-teal-800/60">
                  <span className="font-medium">{action}</span>
                </li>
              ))}
            </ol>
          </div>

          {/* Statutory Hackathon Legal Disclaimer Banner */}
          <div className="p-4 bg-slate-100 dark:bg-slate-900/80 rounded-xl border border-slate-300 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 leading-normal space-y-1">
            <div className="flex items-center justify-between">
              <p className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <Lock size={13} className="text-slate-500 dark:text-slate-400" />
                <span>{isBn ? 'আইনি ও প্রযুক্তিগত উপদেষ্টা বিজ্ঞপ্তি (Advisory Disclaimer):' : 'Advisory Disclaimer (Not a Legal Certificate):'}</span>
              </p>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">
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
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-xl p-12 text-center border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="w-14 h-14 bg-emerald-50 dark:bg-emerald-950/50 rounded-full flex items-center justify-center mx-auto text-emerald-600 dark:text-emerald-400">
            <ShieldCheck size={28} />
          </div>
          <div className="max-w-md mx-auto space-y-2">
            <h3 className="font-bold text-slate-800 dark:text-slate-100 text-base">
              {isBn ? 'স্বয়ংক্রিয় ঝুঁকি অডিট প্রস্তুত' : 'Automated Risk Audit Ready'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {isBn
                ? 'উপরের তালিকা থেকে যেকোনো জমি নির্বাচন করুন অথবা "মূল্যায়ন পরিচালনা করুন" বাটনে ক্লিক করুন।'
                : 'Select any test parcel above or click "Run Audit" to generate the transparent legal risk audit report.'}
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => handleRunAssessment()}
              className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-xs font-semibold shadow transition cursor-pointer"
            >
              <RefreshCw size={14} />
              <span>{isBn ? 'পুনরায় মূল্যায়ন করুন' : 'Run Audit'}</span>
            </button>
            <button
              onClick={handleGoBack}
              className="inline-flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 px-4 py-2 rounded-lg text-xs font-semibold transition cursor-pointer"
            >
              <ArrowLeft size={14} />
              <span>{isBn ? 'হোমপেজে ফিরে যান' : 'Back to Home'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
