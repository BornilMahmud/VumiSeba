import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import { Landmark, Eye, FilePlus2, Receipt, ShieldCheck } from 'lucide-react';
import { StatusBadge } from '../../components/common/StatusBadge';

export const MyLandPage: React.FC = () => {
  const [holdings, setHoldings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHoldings = async () => {
      setLoading(true);
      const res = await api.getMyHoldings();
      if (res.success && res.data) {
        setHoldings(res.data);
      }
      setLoading(false);
    };
    fetchHoldings();
  }, []);

  return (
    <div className="font-bengali space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
            <Landmark className="text-gov-blue" size={24} />
            আমার জমি ও খতিয়ান রেকর্ড (My Land Holdings)
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            সরকারি রেকর্ডরুম ও নামজারি সূত্রে আপনার নামে নথিভুক্ত সক্রিয় ভূমির তালিকা
          </p>
        </div>

        <Link
          to="/citizen/search"
          className="inline-flex items-center gap-2 bg-gov-blue hover:bg-slate-900 text-white px-4 py-2 rounded-lg text-xs font-semibold shadow-sm transition"
        >
          <span>নতুন খতিয়ান বা দাগ অনুসন্ধান</span>
        </Link>
      </div>

      {loading ? (
        <div className="bg-white rounded-xl p-12 text-center border border-slate-200">
          <div className="inline-block animate-spin w-8 h-8 border-4 border-gov-blue border-t-transparent rounded-full mb-3"></div>
          <p className="text-xs font-semibold text-slate-700">জমির রেকর্ড লোড হচ্ছে...</p>
        </div>
      ) : holdings.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center border border-slate-200 space-y-3">
          <div className="w-12 h-12 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto">
            <Landmark size={24} />
          </div>
          <h4 className="font-bold text-slate-800 text-base">কোনো জমির রেকর্ড সংযুক্ত নেই</h4>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            আপনার জাতীয় পরিচয়পত্রের বিপরীতে কোনো রেকর্ডীয় মালিকানা পাওয়া যায়নি।
            যদি আপনি সম্প্রতি জমি কিনে থাকেন, তবে ই-নামজারি সম্পন্ন হওয়ার পর এখানে রেকর্ডটি প্রদর্শিত হবে।
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {holdings.map((item, idx) => (
            <div
              key={idx}
              className="bg-white rounded-xl shadow-gov-sm border border-slate-200 p-6 flex flex-col justify-between hover:border-gov-blue transition"
            >
              <div>
                <div className="flex items-center justify-between mb-3 border-b pb-2">
                  <div>
                    <span className="text-xs text-slate-500">মৌজা: {item.parcel?.mouza}</span>
                    <h3 className="font-bold text-slate-900 text-base">দাগ নম্বর: {item.parcel?.dag_no}</h3>
                  </div>
                  <span className="text-xs bg-slate-100 text-slate-800 px-2 py-0.5 rounded font-mono font-bold">
                    খতিয়ান: {item.ownership?.khatian_ref || item.parcel?.khatian_no}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs mb-4 bg-slate-50 p-3 rounded-lg border">
                  <div>
                    <span className="text-slate-500 block">জমির শ্রেণি:</span>
                    <strong className="text-slate-900">{item.parcel?.land_class}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block">আমার মালিকানা হিস্যা:</span>
                    <strong className="text-gov-blue font-mono font-bold">
                      {(item.ownership?.share_portion * 100).toFixed(1)}% ({item.ownership?.share_portion})
                    </strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block">রেকর্ডীয় আয়তন:</span>
                    <strong className="text-slate-900 font-mono">{item.ownership?.area_decimal} শতক</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block">মালিকানা অর্জন সূত্র:</span>
                    <strong className="text-slate-900">{item.ownership?.acquired_type_bn}</strong>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs pt-1 mb-4">
                  <span className="text-slate-600">খাজনা / ভূমি উন্নয়ন কর:</span>
                  <StatusBadge status={item.khajna?.status || 'cleared'} />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-3 gap-2 pt-3 border-t text-xs font-semibold">
                <Link
                  to={`/citizen/land-details/${item.parcel?.id}`}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-800 py-2 rounded text-center transition flex items-center justify-center gap-1"
                >
                  <Eye size={13} />
                  <span>বিস্তারিত</span>
                </Link>
                <Link
                  to={`/verify-land?parcel_id=${item.parcel?.id}`}
                  className="bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-300 py-2 rounded text-center transition flex items-center justify-center gap-1"
                >
                  <ShieldCheck size={13} />
                  <span>যাচাই</span>
                </Link>
                <Link
                  to={`/citizen/sell?parcel_id=${item.parcel?.id}`}
                  className="bg-gov-blue hover:bg-slate-900 text-white py-2 rounded text-center transition flex items-center justify-center gap-1 shadow-sm"
                >
                  <FilePlus2 size={13} />
                  <span>বিক্রি করুন</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
