import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { api } from '../../services/api';
import { LandParcel } from '../../types';
import { Search, MapPin, Eye, ShieldCheck, ArrowRight, Filter, AlertCircle } from 'lucide-react';
import { StatusBadge } from '../../components/common/StatusBadge';

export const SearchLandPage: React.FC = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  const [district, setDistrict] = useState(queryParams.get('district') || 'ঢাকা');
  const [upazila, setUpazila] = useState(queryParams.get('upazila') || 'গুলশান');
  const [mouza, setMouza] = useState(queryParams.get('mouza') || 'বাড্ডা');
  const [dagNo, setDagNo] = useState(queryParams.get('dag_no') || '');
  const [khatianNo, setKhatianNo] = useState(queryParams.get('khatian_no') || '');
  const [freeText, setFreeText] = useState(queryParams.get('query') || '');

  const [parcels, setParcels] = useState<LandParcel[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const fetchResults = async () => {
    setLoading(true);
    setSearched(true);
    const params: Record<string, string> = {};
    if (district) params.district = district;
    if (upazila) params.upazila = upazila;
    if (mouza) params.mouza = mouza;
    if (dagNo) params.dag_no = dagNo;
    if (khatianNo) params.khatian_no = khatianNo;
    if (freeText) params.query = freeText;

    const res = await api.searchLand(params);
    if (res.success && res.data) {
      setParcels(res.data);
    } else {
      setParcels([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchResults();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchResults();
  };

  return (
    <div className="font-bengali min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Page Title */}
      <div className="mb-6">
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
          <Link to="/" className="hover:underline">হোম</Link>
          <span>/</span>
          <span className="text-slate-900 font-semibold">খতিয়ান ও দাগ অনুসন্ধান</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
          ভূমি রেকর্ড, খতিয়ান ও দাগ অনুসন্ধান
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-1">
          অনলাইন জেলা রেকর্ডরুম ও ভূমি সার্কেলের সংরক্ষিত মৌজা, খতিয়ান ও দাগভিত্তিক তথ্য যাচাই করুন
        </p>
      </div>

      {/* Search Filter Box */}
      <div className="bg-white rounded-xl shadow-gov-sm border border-slate-200 p-6 mb-8">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-6 gap-3.5 text-xs items-start">
            <div className="flex flex-col">
              <label className="block text-slate-700 font-semibold mb-1.5 h-4 leading-4 truncate">জেলা</label>
              <div className="relative">
                <select
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full h-11 box-border appearance-none bg-slate-50 border border-slate-300 rounded-lg px-3 pr-8 text-slate-900 font-medium cursor-pointer truncate focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition"
                >
                  <option value="ঢাকা">ঢাকা</option>
                  <option value="চট্টগ্রাম">চট্টগ্রাম</option>
                  <option value="সিলেট">সিলেট</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2.5 text-slate-400">
                  <i className="bx bx-chevron-down text-lg"></i>
                </div>
              </div>
            </div>

            <div className="flex flex-col">
              <label className="block text-slate-700 font-semibold mb-1.5 h-4 leading-4 truncate">উপজেলা / রাজস্ব সার্কেল</label>
              <div className="relative">
                <select
                  value={upazila}
                  onChange={(e) => setUpazila(e.target.value)}
                  className="w-full h-11 box-border appearance-none bg-slate-50 border border-slate-300 rounded-lg px-3 pr-8 text-slate-900 font-medium cursor-pointer truncate focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition"
                >
                  <option value="গুলশান">গুলশান সার্কেল</option>
                  <option value="তেজগাঁও">তেজগাঁও সার্কেল</option>
                  <option value="মিরপুর">মিরপুর সার্কেল</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2.5 text-slate-400">
                  <i className="bx bx-chevron-down text-lg"></i>
                </div>
              </div>
            </div>

            <div className="flex flex-col">
              <label className="block text-slate-700 font-semibold mb-1.5 h-4 leading-4 truncate">মৌজা</label>
              <div className="relative">
                <select
                  value={mouza}
                  onChange={(e) => setMouza(e.target.value)}
                  className="w-full h-11 box-border appearance-none bg-slate-50 border border-slate-300 rounded-lg px-3 pr-8 text-slate-900 font-medium cursor-pointer truncate focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition"
                >
                  <option value="">সকল মৌজা</option>
                  <option value="বাড্ডা">বাড্ডা (জে.এল ২৮)</option>
                  <option value="সাঁতারকুল">সাঁতারকুল (জে.এল ৩১)</option>
                  <option value="ভাটারা">ভাটারা (জে.এল ২৫)</option>
                  <option value="রামপুরা">রামপুরা (জে.এল ২৩)</option>
                  <option value="আফতাবনগর">আফতাবনগর (জে.এল ২৯)</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2.5 text-slate-400">
                  <i className="bx bx-chevron-down text-lg"></i>
                </div>
              </div>
            </div>

            <div className="flex flex-col">
              <label className="block text-slate-700 font-semibold mb-1.5 h-4 leading-4 truncate">খতিয়ান নম্বর</label>
              <input
                type="text"
                placeholder="যেমন: ১২০৪"
                value={khatianNo}
                onChange={(e) => setKhatianNo(e.target.value)}
                className="w-full h-11 box-border bg-slate-50 border border-slate-300 rounded-lg px-3 text-slate-900 font-medium placeholder-slate-400 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition"
              />
            </div>

            <div className="flex flex-col">
              <label className="block text-slate-700 font-semibold mb-1.5 h-4 leading-4 truncate">দাগ নম্বর</label>
              <input
                type="text"
                placeholder="যেমন: ৪০৫"
                value={dagNo}
                onChange={(e) => setDagNo(e.target.value)}
                className="w-full h-11 box-border bg-slate-50 border border-slate-300 rounded-lg px-3 text-slate-900 font-medium placeholder-slate-400 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition"
              />
            </div>

            <div className="flex flex-col">
              <span className="hidden sm:block mb-1.5 h-4 leading-4 invisible select-none" aria-hidden="true">&nbsp;</span>
              <button
                type="submit"
                className="w-full h-11 box-border bg-gov-blue hover:bg-slate-900 text-white font-semibold px-3 rounded-lg shadow-xs hover:shadow transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Search size={14} />
                <span className="truncate">অনুসন্ধান</span>
              </button>
            </div>
          </div>
        </form>

        <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between text-xs text-slate-500 gap-2">
          <div className="flex items-center gap-2">
            <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-mono text-[11px]">
              উৎস: জাতীয় ডিজিটাল ভূমি রেকর্ডরুম (ডেমো ডেটাসেট)
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span>দ্রুত টেস্ট বাটন:</span>
            <button
              type="button"
              onClick={() => {
                setMouza('বাড্ডা');
                setDagNo('৪০৫');
                setKhatianNo('১২০৪');
              }}
              className="text-gov-blue hover:underline font-semibold"
            >
              দাগ ৪০৫
            </button>
            <span>•</span>
            <button
              type="button"
              onClick={() => {
                setMouza('সাঁতারকুল');
                setDagNo('৮৮২');
                setKhatianNo('৫৫১');
              }}
              className="text-amber-700 hover:underline font-semibold"
            >
              দাগ ৮৮২ (কর বকেয়া)
            </button>
            <span>•</span>
            <button
              type="button"
              onClick={() => {
                setMouza('আফতাবনগর');
                setDagNo('৭১০');
                setKhatianNo('১০৯');
              }}
              className="text-red-700 hover:underline font-semibold"
            >
              দাগ ৭১০ (মামলা/মর্টগেজ)
            </button>
          </div>
        </div>
      </div>

      {/* Results Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-slate-900 text-base">
            অনুসন্ধান ফলাফল {searched && `(${parcels.length}টি রেকর্ড পাওয়া গেছে)`}
          </h3>
          <span className="text-xs text-slate-500">
            সরকারি প্রোটোকল অনুযায়ী গোপনীয় এনআইডি তথ্য লুকায়িত
          </span>
        </div>

        {loading ? (
          <div className="bg-white rounded-xl p-12 text-center border border-slate-200">
            <div className="inline-block animate-spin w-8 h-8 border-4 border-gov-blue border-t-transparent rounded-full mb-3"></div>
            <p className="text-sm font-semibold text-slate-700">ডিজিটাল রেকর্ডরুম থেকে তথ্য লোড হচ্ছে...</p>
          </div>
        ) : parcels.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center border border-slate-200 space-y-3">
            <div className="w-12 h-12 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto">
              <Search size={24} />
            </div>
            <h4 className="font-bold text-slate-800 text-base">কোনো খতিয়ান বা দাগ রেকর্ড মেলেনি</h4>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              আপনার প্রদত্ত মৌজা বা দাগ নম্বরের তথ্য এই মুহূর্তে ডাটাবেজে নেই অথবা ভুল বানান প্রদান করা হয়েছে।
              উপরের ফিল্টারে সঠিক মৌজা ও দাগ নির্বাচন করুন।
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-gov-sm border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200 uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-4">দাগ ও খতিয়ান</th>
                    <th className="py-3 px-4">মৌজা ও জে.এল</th>
                    <th className="py-3 px-4">জমির শ্রেণি</th>
                    <th className="py-3 px-4">মোট আয়তন</th>
                    <th className="py-3 px-4">রেকর্ডীয় মালিকানা বিবরণ</th>
                    <th className="py-3 px-4">আইনি ও সরকারি ফ্ল্যাগ</th>
                    <th className="py-3 px-4 text-right">কার্যক্রম</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-slate-800">
                  {parcels.map((parcel) => (
                    <tr key={parcel.id} className="hover:bg-slate-50 transition">
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900 text-sm">দাগ নং {parcel.dag_no}</div>
                        <div className="text-slate-500 text-[11px]">
                          খতিয়ান: {parcel.khatian_no} ({parcel.khatian_type})
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-medium text-slate-800">{parcel.mouza}</div>
                        <div className="text-slate-500 text-[11px]">জে.এল নং {parcel.jl_no}, {parcel.upazila}</div>
                      </td>

                      <td className="py-3.5 px-4 font-medium">
                        <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200">
                          {parcel.land_class}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                        {parcel.total_area_decimal} শতক
                      </td>

                      <td className="py-3.5 px-4 max-w-xs truncate text-[11px]">
                        <span className="text-slate-800 font-medium">
                          {parcel.recorded_owners_bn || 'মালিক তথ্য সংরক্ষিত'}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        {parcel.court_case_flag || parcel.bank_mortgage_flag || parcel.is_acquired ? (
                          <span className="inline-flex items-center gap-1 bg-red-100 text-red-900 font-semibold px-2 py-0.5 rounded text-[11px] border border-red-300">
                            <AlertCircle size={12} />
                            সতর্কতা বিদ্যমান
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-800 font-medium px-2 py-0.5 rounded text-[11px] border border-emerald-200">
                            স্বাভাবিক
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-right space-x-2 whitespace-nowrap">
                        <Link
                          to={`/verify-land?parcel_id=${parcel.id}`}
                          className="inline-flex items-center gap-1 bg-teal-50 text-teal-800 border border-teal-300 hover:bg-teal-100 px-2.5 py-1 rounded text-xs font-semibold transition"
                          title="ঝুঁকি পরীক্ষা"
                        >
                          <ShieldCheck size={13} />
                          <span>যাচাই</span>
                        </Link>
                        <Link
                          to={`/citizen/land-details/${parcel.id}`}
                          className="inline-flex items-center gap-1 bg-gov-blue text-white hover:bg-slate-900 px-2.5 py-1 rounded text-xs font-medium transition"
                        >
                          <Eye size={13} />
                          <span>বিস্তারিত</span>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
