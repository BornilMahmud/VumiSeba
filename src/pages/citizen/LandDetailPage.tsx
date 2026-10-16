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

export const LandDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
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

  if (loading) {
    return (
      <div className="font-bengali p-12 text-center bg-white rounded-xl border">
        <div className="inline-block animate-spin w-8 h-8 border-4 border-gov-blue border-t-transparent rounded-full mb-3"></div>
        <p className="text-sm font-semibold text-slate-700">জমির নথিপত্র ও খতিয়ান লোড হচ্ছে...</p>
      </div>
    );
  }

  if (!parcel) {
    return (
      <div className="font-bengali p-12 text-center bg-white rounded-xl border space-y-3">
        <AlertTriangle size={32} className="text-amber-500 mx-auto" />
        <h3 className="font-bold text-slate-800 text-lg">ভূমি রেকর্ড পাওয়া যায়নি</h3>
        <Link to="/citizen/search" className="text-gov-blue font-bold text-xs underline">
          অনুসন্ধান পৃষ্ঠায় ফিরে যান
        </Link>
      </div>
    );
  }

  return (
    <div className="font-bengali space-y-6">
      {/* Top Breadcrumb & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <Link to="/citizen" className="hover:underline">ড্যাশবোর্ড</Link>
            <span>/</span>
            <Link to="/citizen/my-land" className="hover:underline">আমার জমি</Link>
            <span>/</span>
            <span className="text-slate-900 font-bold">দাগ নং {parcel.dag_no}</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900">
            দাগ নং {parcel.dag_no} (খতিয়ান {parcel.khatian_no}) — বিস্তারিত রেকর্ড
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            মৌজা: {parcel.mouza}, জে.এল: {parcel.jl_no}, {parcel.upazila}, {parcel.district}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to={`/verify-land?parcel_id=${parcel.id}`}
            className="inline-flex items-center gap-1.5 bg-teal-50 text-teal-800 border border-teal-300 hover:bg-teal-100 px-3.5 py-2 rounded-lg text-xs font-bold transition shadow-sm"
          >
            <ShieldCheck size={16} />
            <span>ঝুঁকি যাচাই (P5)</span>
          </Link>
          <Link
            to={`/citizen/sell?parcel_id=${parcel.id}`}
            className="inline-flex items-center gap-1.5 bg-gov-blue hover:bg-slate-900 text-white px-3.5 py-2 rounded-lg text-xs font-semibold transition shadow-sm"
          >
            <FilePlus2 size={16} />
            <span>বিক্রয় প্রস্তাব করুন</span>
          </Link>
        </div>
      </div>

      {/* Parcel Basic Specs Card */}
      <div className="bg-white rounded-xl shadow-gov-sm border border-slate-200 p-6">
        <div className="flex items-center justify-between mb-4 pb-2 border-b">
          <h3 className="font-bold text-slate-900 text-sm">তফশিল ও খতিয়ান বিবরণী</h3>
          <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[11px] font-mono">
            পার্সেল আইডি: {parcel.parcel_number}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div className="bg-slate-50 p-3 rounded-lg border">
            <span className="text-slate-500 block mb-1">দাগ নম্বর</span>
            <strong className="text-slate-900 text-sm">{parcel.dag_no}</strong>
          </div>

          <div className="bg-slate-50 p-3 rounded-lg border">
            <span className="text-slate-500 block mb-1">খতিয়ান ও জরিপ টাইপ</span>
            <strong className="text-slate-900 text-sm">{parcel.khatian_no} ({parcel.khatian_type})</strong>
          </div>

          <div className="bg-slate-50 p-3 rounded-lg border">
            <span className="text-slate-500 block mb-1">জমির শ্রেণি</span>
            <strong className="text-slate-900 text-sm">{parcel.land_class}</strong>
          </div>

          <div className="bg-slate-50 p-3 rounded-lg border">
            <span className="text-slate-500 block mb-1">মোট রেকর্ডীয় আয়তন</span>
            <strong className="text-gov-blue text-sm font-mono font-bold">{parcel.total_area_decimal} শতক</strong>
          </div>

          <div className="bg-slate-50 p-3 rounded-lg border">
            <span className="text-slate-500 block mb-1">মৌজা ও জে.এল</span>
            <strong className="text-slate-900">{parcel.mouza} (জে.এল {parcel.jl_no})</strong>
          </div>

          <div className="bg-slate-50 p-3 rounded-lg border">
            <span className="text-slate-500 block mb-1">উপজেলা ও সার্কেল</span>
            <strong className="text-slate-900">{parcel.upazila}, {parcel.district}</strong>
          </div>

          <div className="bg-slate-50 p-3 rounded-lg border">
            <span className="text-slate-500 block mb-1">হোল্ডিং নম্বর</span>
            <strong className="text-slate-900 font-mono">{parcel.current_holding_no || 'HLD-BAD-8812'}</strong>
          </div>

          <div className="bg-slate-50 p-3 rounded-lg border">
            <span className="text-slate-500 block mb-1">ভূমি উন্নয়ন কর স্থিতি</span>
            <StatusBadge status={khajna?.status || 'cleared'} />
          </div>
        </div>

        <div className="mt-4 p-3 bg-slate-50 rounded-lg border text-xs text-slate-700">
          <strong>অবস্থান ও চৌহদ্দি:</strong> {parcel.address_description_bn}
        </div>
      </div>

      {/* Ownership & Co-sharers Table */}
      <div className="bg-white rounded-xl shadow-gov-sm border border-slate-200 p-6">
        <h3 className="font-bold text-slate-900 text-sm mb-4 pb-2 border-b flex items-center justify-between">
          <span>মালিকানা ও সহ-শরিকদের অংশীদারিত্ব (Ownership Shares)</span>
          <span className="text-xs text-slate-500 font-normal">মোট মালিক: {ownerships.length} জন</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-700 font-semibold border-b">
              <tr>
                <th className="py-2.5 px-3">মালিকের নাম</th>
                <th className="py-2.5 px-3">খতিয়ান রেফারেন্স</th>
                <th className="py-2.5 px-3">অংশ (Share)</th>
                <th className="py-2.5 px-3">শতক হিসেবে পরিমাণ</th>
                <th className="py-2.5 px-3">অর্জনের মাধ্যম</th>
                <th className="py-2.5 px-3">স্থিতি</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {ownerships.map((own) => (
                <tr key={own.id} className="hover:bg-slate-50">
                  <td className="py-3 px-3 font-bold text-slate-900">{own.owner_name_bn}</td>
                  <td className="py-3 px-3 text-slate-600">{own.khatian_ref}</td>
                  <td className="py-3 px-3 font-mono font-bold text-slate-800">
                    {(own.share_portion * 100).toFixed(2)}% ({own.share_portion})
                  </td>
                  <td className="py-3 px-3 font-bold text-gov-blue">{own.area_decimal} শতক</td>
                  <td className="py-3 px-3 text-slate-600">{own.acquired_type_bn}</td>
                  <td className="py-3 px-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${own.status === 'active' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-slate-100 text-slate-700'}`}>
                      {own.status === 'active' ? 'সক্রিয়' : 'হস্তান্তরিত'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Attached Documents Vault */}
      <div className="bg-white rounded-xl shadow-gov-sm border border-slate-200 p-6">
        <h3 className="font-bold text-slate-900 text-sm mb-4 pb-2 border-b">
          সংরক্ষিত সরকারি নথিপত্র ও ডিজিটাল প্রমাণক
        </h3>

        {documents.length === 0 ? (
          <p className="text-xs text-slate-500 py-3 text-center bg-slate-50 rounded">
            কোনো স্ক্যান কপি ডাটাবেজে যুক্ত নেই।
          </p>
        ) : (
          <div className="space-y-3">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-start gap-3">
                  <FileText className="text-gov-blue shrink-0 mt-0.5" size={18} />
                  <div>
                    <h4 className="font-bold text-slate-900">{doc.doc_title_bn}</h4>
                    <p className="text-slate-500 text-[11px]">
                      নম্বর: {doc.doc_number} | প্রদানকারী কর্তৃপক্ষ: {doc.issuing_authority_bn}
                    </p>
                    {doc.discrepancy_note_bn && (
                      <p className="text-red-600 font-semibold text-[11px] mt-1 bg-red-50 p-1 rounded border border-red-200">
                        সতর্কতা: {doc.discrepancy_note_bn}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${doc.is_verified ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                    {doc.is_verified ? 'যাচাইকৃত' : 'অযাচাইকৃত/অসঙ্গতি'}
                  </span>
                  <a
                    href={doc.file_url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-gov-blue hover:underline font-semibold"
                  >
                    <span>অনুলিপি</span>
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
