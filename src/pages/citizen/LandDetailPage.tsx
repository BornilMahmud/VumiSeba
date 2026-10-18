import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../../services/api';
import { LandParcel, LandOwnership, LandDocument, KhatianRecord, KhajnaAccount } from '../../types';
import {
  Landmark,
  ShieldCheck,
  FilePlus2,
  Receipt,
  FileText,
  AlertTriangle,
  CheckCircle2,
  Scale,
  MapPin,
  Calendar,
  ExternalLink,
} from 'lucide-react';
import { StatusBadge } from '../../components/common/StatusBadge';
import { useLanguage } from '../../context/LanguageContext';
import {
  formatName,
  formatMouza,
  formatPlot,
  formatKhatian,
  formatDistrict,
  formatUpazila,
  formatArea,
  formatLandClass,
  formatDigits,
} from '../../utils/bilingual';

export const LandDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { language } = useLanguage();
  const isBn = language === 'bn';

  const [parcel, setParcel] = useState<LandParcel | null>(null);
  const [ownerships, setOwnerships] = useState<LandOwnership[]>([]);
  const [khatian, setKhatian] = useState<KhatianRecord | null>(null);
  const [documents, setDocuments] = useState<LandDocument[]>([]);
  const [khajna, setKhajna] = useState<KhajnaAccount | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      if (!id) return;
      setLoading(true);
      const res = await api.getParcelDetails(id);
      if (res.success && res.data) {
        setParcel(res.data.parcel);
        setOwnerships(res.data.ownerships || []);
        setKhatian(res.data.khatian);
        setDocuments(res.data.documents || []);
        setKhajna(res.data.khajna);
      }
      setLoading(false);
    };
    fetchDetails();
  }, [id]);

  const getAcquiredType = (typeBn?: string) => {
    if (isBn) return typeBn || 'ক্রয়সূত্রে';
    switch (typeBn) {
      case 'ক্রয়সূত্রে':
      case 'ক্রয়সূত্রে (সাব-কবলা)':
        return 'By Purchase (Sub-Kabala)';
      case 'ওয়ারিশসূত্রে':
        return 'By Inheritance';
      case 'হেবাসূত্রে':
        return 'By Heba (Gift)';
      case 'দানপত্রসূত্রে':
        return 'By Deed of Gift';
      default:
        return 'By Purchase';
    }
  };

  if (loading) {
    return (
      <div className={`p-12 text-center bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 ${isBn ? 'font-bengali' : 'font-sans'}`}>
        <div className="inline-block animate-spin w-8 h-8 border-4 border-gov-blue border-t-transparent rounded-full mb-3"></div>
        <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
          {isBn ? 'জমির নথিপত্র ও খতিয়ান লোড হচ্ছে...' : 'Loading land documents and khatian...'}
        </p>
      </div>
    );
  }

  if (!parcel) {
    return (
      <div className={`p-12 text-center bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3 ${isBn ? 'font-bengali' : 'font-sans'}`}>
        <AlertTriangle size={32} className="text-amber-500 mx-auto" />
        <h3 className="font-bold text-slate-800 dark:text-white text-lg">
          {isBn ? 'ভূমি রেকর্ড পাওয়া যায়নি' : 'Land record not found'}
        </h3>
        <Link to="/citizen/search" className="text-gov-blue font-bold text-xs underline">
          {isBn ? 'অনুসন্ধান পৃষ্ঠায় ফিরে যান' : 'Back to search'}
        </Link>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${isBn ? 'font-bengali' : 'font-sans'}`}>
      {/* Top Breadcrumb & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-1">
            <Link to="/citizen" className="hover:underline">{isBn ? 'ড্যাশবোর্ড' : 'Dashboard'}</Link>
            <span>/</span>
            <Link to="/citizen/my-land" className="hover:underline">{isBn ? 'আমার জমি' : 'My Land'}</Link>
            <span>/</span>
            <span className="text-slate-900 dark:text-white font-bold">{formatPlot(parcel.dag_no, isBn)}</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            {formatPlot(parcel.dag_no, isBn)} ({formatKhatian(parcel.khatian_no, isBn)}) — {isBn ? 'বিস্তারিত রেকর্ড' : 'Detailed Record'}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {isBn ? 'মৌজা:' : 'Mouza:'} {formatMouza(parcel, isBn)}, {isBn ? 'জে.এল:' : 'JL:'} {formatDigits(parcel.jl_no, isBn)}, {formatUpazila(parcel.upazila, isBn)}, {formatDistrict(parcel.district, isBn)}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to={`/verify-land?parcel_id=${parcel.id}`}
            className="inline-flex items-center gap-1.5 bg-teal-50 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300 border border-teal-300 dark:border-teal-700 hover:bg-teal-100 dark:hover:bg-teal-900/60 px-3.5 py-2 rounded-lg text-xs font-bold transition shadow-sm"
          >
            <ShieldCheck size={16} />
            <span>{isBn ? 'ঝুঁকি যাচাই' : 'Risk Check'}</span>
          </Link>
          <Link
            to={`/citizen/sell?parcel_id=${parcel.id}`}
            className="inline-flex items-center gap-1.5 bg-gov-blue hover:bg-slate-900 text-white px-3.5 py-2 rounded-lg text-xs font-semibold transition shadow-sm"
          >
            <FilePlus2 size={16} />
            <span>{isBn ? 'বিক্রয় প্রস্তাব করুন' : 'Propose Sale'}</span>
          </Link>
        </div>
      </div>

      {/* Parcel Basic Specs Card */}
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-gov-sm border border-slate-200 dark:border-slate-800 p-6">
        <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100 dark:border-slate-800">
          <h3 className="font-bold text-slate-900 dark:text-white text-sm">
            {isBn ? 'তফশিল ও খতিয়ান বিবরণী' : 'Schedule & Khatian Statement'}
          </h3>
          <span className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded text-[11px] font-mono">
            {isBn ? 'পার্সেল আইডি:' : 'Parcel ID:'} {parcel.parcel_number}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-lg border border-slate-100 dark:border-slate-800">
            <span className="text-slate-500 dark:text-slate-400 block mb-1">{isBn ? 'দাগ নম্বর' : 'Plot (Dag) No'}</span>
            <strong className="text-slate-900 dark:text-white text-sm">{formatDigits(parcel.dag_no, isBn)}</strong>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-lg border border-slate-100 dark:border-slate-800">
            <span className="text-slate-500 dark:text-slate-400 block mb-1">{isBn ? 'খতিয়ান ও জরিপ টাইপ' : 'Khatian & Survey Type'}</span>
            <strong className="text-slate-900 dark:text-white text-sm">{formatDigits(parcel.khatian_no, isBn)} ({parcel.khatian_type})</strong>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-lg border border-slate-100 dark:border-slate-800">
            <span className="text-slate-500 dark:text-slate-400 block mb-1">{isBn ? 'জমির শ্রেণি' : 'Land Class'}</span>
            <strong className="text-slate-900 dark:text-white text-sm">{formatLandClass(parcel.land_class, isBn)}</strong>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-lg border border-slate-100 dark:border-slate-800">
            <span className="text-slate-500 dark:text-slate-400 block mb-1">{isBn ? 'মোট রেকর্ডীয় আয়তন' : 'Total Recorded Area'}</span>
            <strong className="text-gov-blue text-sm font-mono font-bold">{formatArea(parcel.total_area_decimal, isBn)}</strong>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-lg border border-slate-100 dark:border-slate-800">
            <span className="text-slate-500 dark:text-slate-400 block mb-1">{isBn ? 'মৌজা ও জে.এল' : 'Mouza & JL'}</span>
            <strong className="text-slate-900 dark:text-white">{formatMouza(parcel, isBn)} ({isBn ? 'জে.এল' : 'JL'} {formatDigits(parcel.jl_no, isBn)})</strong>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-lg border border-slate-100 dark:border-slate-800">
            <span className="text-slate-500 dark:text-slate-400 block mb-1">{isBn ? 'উপজেলা ও জেলা' : 'Upazila & District'}</span>
            <strong className="text-slate-900 dark:text-white">{formatUpazila(parcel.upazila, isBn)}, {formatDistrict(parcel.district, isBn)}</strong>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-lg border border-slate-100 dark:border-slate-800">
            <span className="text-slate-500 dark:text-slate-400 block mb-1">{isBn ? 'হোল্ডিং নম্বর' : 'Holding No'}</span>
            <strong className="text-slate-900 dark:text-white font-mono">{parcel.current_holding_no || 'HLD-BAD-8812'}</strong>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-lg border border-slate-100 dark:border-slate-800">
            <span className="text-slate-500 dark:text-slate-400 block mb-1">{isBn ? 'ভূমি উন্নয়ন কর স্থিতি' : 'Land Tax Status'}</span>
            <StatusBadge status={khajna?.status || 'cleared'} />
          </div>
        </div>

        <div className="mt-4 p-3 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-slate-100 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300">
          <strong>{isBn ? 'অবস্থান ও চৌহদ্দি:' : 'Location & Boundaries:'}</strong> {parcel.address_description_bn}
        </div>
      </div>

      {/* Ownership & Co-sharers Table */}
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-gov-sm border border-slate-200 dark:border-slate-800 p-6">
        <h3 className="font-bold text-slate-900 dark:text-white text-sm mb-4 pb-2 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <span>{isBn ? 'মালিকানা ও সহ-শরিকদের অংশীদারিত্ব' : 'Ownership & Co-sharer Portions'}</span>
          <span className="text-xs text-slate-500 dark:text-slate-400 font-normal">
            {isBn ? `মোট মালিক: ${formatDigits(ownerships.length, isBn)} জন` : `Total Owners: ${ownerships.length}`}
          </span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 font-semibold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-2.5 px-3">{isBn ? 'মালিকের নাম' : 'Owner Name'}</th>
                <th className="py-2.5 px-3">{isBn ? 'খতিয়ান রেফারেন্স' : 'Khatian Ref'}</th>
                <th className="py-2.5 px-3">{isBn ? 'অংশ (Share)' : 'Share Portion'}</th>
                <th className="py-2.5 px-3">{isBn ? 'আয়তন' : 'Area'}</th>
                <th className="py-2.5 px-3">{isBn ? 'অর্জনের মাধ্যম' : 'Acquisition Mode'}</th>
                <th className="py-2.5 px-3">{isBn ? 'স্থিতি' : 'Status'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {ownerships.map((own) => (
                <tr key={own.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <td className="py-3 px-3 font-bold text-slate-900 dark:text-white">
                    {formatName(own.owner_name_bn, isBn)}
                  </td>
                  <td className="py-3 px-3 text-slate-600 dark:text-slate-400">{formatDigits(own.khatian_ref, isBn)}</td>
                  <td className="py-3 px-3 font-mono font-bold text-slate-800 dark:text-slate-200">
                    {(own.share_portion * 100).toFixed(2)}% ({formatDigits(own.share_portion, isBn)})
                  </td>
                  <td className="py-3 px-3 font-bold text-gov-blue">{formatArea(own.area_decimal, isBn)}</td>
                  <td className="py-3 px-3 text-slate-600 dark:text-slate-400">{getAcquiredType(own.acquired_type_bn)}</td>
                  <td className="py-3 px-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                      own.status === 'active'
                        ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-400'
                    }`}>
                      {own.status === 'active' ? (isBn ? 'সক্রিয়' : 'Active') : (isBn ? 'হস্তান্তরিত' : 'Transferred')}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Attached Documents Vault */}
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-gov-sm border border-slate-200 dark:border-slate-800 p-6">
        <h3 className="font-bold text-slate-900 dark:text-white text-sm mb-4 pb-2 border-b border-slate-100 dark:border-slate-800">
          {isBn ? 'সংরক্ষিত সরকারি নথিপত্র ও ডিজিটাল প্রমাণক' : 'Archived Govt Documents & Digital Proofs'}
        </h3>

        {documents.length === 0 ? (
          <p className="text-xs text-slate-500 dark:text-slate-400 py-3 text-center bg-slate-50 dark:bg-slate-800/60 rounded">
            {isBn ? 'কোনো স্ক্যান কপি ডাটাবেজে যুক্ত নেই।' : 'No scanned copies linked in database.'}
          </p>
        ) : (
          <div className="space-y-3">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-start gap-3">
                  <FileText className="text-gov-blue shrink-0 mt-0.5" size={18} />
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white">{doc.doc_title_bn}</h4>
                    <p className="text-slate-500 dark:text-slate-400 text-[11px]">
                      {isBn ? 'নম্বর:' : 'No:'} {doc.doc_number} | {isBn ? 'প্রদানকারী কর্তৃপক্ষ:' : 'Issuing Authority:'} {doc.issuing_authority_bn}
                    </p>
                    {doc.discrepancy_note_bn && (
                      <p className="text-red-600 dark:text-red-400 font-semibold text-[11px] mt-1 bg-red-50 dark:bg-red-950/40 p-1 rounded border border-red-200 dark:border-red-800">
                        {isBn ? 'সতর্কতা:' : 'Notice:'} {doc.discrepancy_note_bn}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                    doc.is_verified
                      ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300'
                      : 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300'
                  }`}>
                    {doc.is_verified ? (isBn ? 'যাচাইকৃত' : 'Verified') : (isBn ? 'অযাচাইকৃত/অসঙ্গতি' : 'Unverified/Discrepancy')}
                  </span>
                  <a
                    href={doc.file_url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-gov-blue hover:underline font-semibold"
                  >
                    <span>{isBn ? 'অনুলিপি' : 'Copy'}</span>
                    <ExternalLink size={12} />
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LandDetailPage;
