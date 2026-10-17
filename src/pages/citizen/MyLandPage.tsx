import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import { Landmark, Eye, FilePlus2, Receipt, ShieldCheck } from 'lucide-react';
import { StatusBadge } from '../../components/common/StatusBadge';
import { useLanguage } from '../../context/LanguageContext';
import {
  formatMouza,
  formatPlot,
  formatKhatian,
  formatArea,
  formatLandClass,
  formatDigits,
} from '../../utils/bilingual';

export const MyLandPage: React.FC = () => {
  const { language } = useLanguage();
  const isBn = language === 'bn';
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

  return (
    <div className={`space-y-6 ${isBn ? 'font-bengali' : 'font-sans'}`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Landmark className="text-gov-blue" size={24} />
            {isBn ? 'আমার জমি ও খতিয়ান রেকর্ড' : 'My Land Holdings & Khatian Records'}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {isBn
              ? 'সরকারি রেকর্ডরুম ও নামজারি সূত্রে আপনার নামে নথিভুক্ত সক্রিয় ভূমির তালিকা'
              : 'Active land records registered under your citizen identity in land records and e-mutation'}
          </p>
        </div>

        <Link
          to="/citizen/search"
          className="inline-flex items-center gap-2 bg-gov-blue hover:bg-slate-900 text-white px-4 py-2 rounded-lg text-xs font-semibold shadow-sm transition"
        >
          <span>{isBn ? 'নতুন খতিয়ান বা দাগ অনুসন্ধান' : 'Search New Khatian or Plot'}</span>
        </Link>
      </div>

      {loading ? (
        <div className="bg-white dark:bg-slate-900 rounded-xl p-12 text-center border border-slate-200 dark:border-slate-800">
          <div className="inline-block animate-spin w-8 h-8 border-4 border-gov-blue border-t-transparent rounded-full mb-3"></div>
          <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            {isBn ? 'জমির রেকর্ড লোড হচ্ছে...' : 'Loading land records...'}
          </p>
        </div>
      ) : holdings.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-xl p-12 text-center border border-slate-200 dark:border-slate-800 space-y-3">
          <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 text-slate-400 rounded-full flex items-center justify-center mx-auto">
            <Landmark size={24} />
          </div>
          <h4 className="font-bold text-slate-800 dark:text-white text-base">
            {isBn ? 'কোনো জমির রেকর্ড সংযুক্ত নেই' : 'No Land Records Found'}
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
            {isBn
              ? 'আপনার জাতীয় পরিচয়পত্রের বিপরীতে কোনো রেকর্ডীয় মালিকানা পাওয়া যায়নি। যদি আপনি সম্প্রতি জমি কিনে থাকেন, তবে ই-নামজারি সম্পন্ন হওয়ার পর এখানে রেকর্ডটি প্রদর্শিত হবে।'
              : 'No recorded ownership found against your National ID. If you recently purchased land, the record will appear here after e-mutation is approved.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {holdings.map((item, idx) => (
            <div
              key={idx}
              className="bg-white dark:bg-slate-900 rounded-xl shadow-gov-sm border border-slate-200 dark:border-slate-800 p-6 flex flex-col justify-between hover:border-gov-blue transition"
            >
              <div>
                <div className="flex items-center justify-between mb-3 border-b border-slate-100 dark:border-slate-800 pb-2">
                  <div>
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      {isBn ? 'মৌজা:' : 'Mouza:'} {formatMouza(item.parcel, isBn)}
                    </span>
                    <h3 className="font-bold text-slate-900 dark:text-white text-base">
                      {formatPlot(item.parcel?.dag_no, isBn)}
                    </h3>
                  </div>
                  <span className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 px-2 py-0.5 rounded font-mono font-bold">
                    {formatKhatian(item.ownership?.khatian_ref || item.parcel?.khatian_no, isBn)}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs mb-4 bg-slate-50 dark:bg-slate-800/60 p-3 rounded-lg border border-slate-100 dark:border-slate-800">
                  <div>
                    <span className="text-slate-500 dark:text-slate-400 block">{isBn ? 'জমির শ্রেণি:' : 'Land Class:'}</span>
                    <strong className="text-slate-900 dark:text-white">
                      {formatLandClass(item.parcel?.land_class, isBn)}
                    </strong>
                  </div>
                  <div>
                    <span className="text-slate-500 dark:text-slate-400 block">{isBn ? 'আমার মালিকানা হিস্যা:' : 'Ownership Share:'}</span>
                    <strong className="text-gov-blue font-mono font-bold">
                      {((item.ownership?.share_portion || 0) * 100).toFixed(1)}% ({formatDigits(item.ownership?.share_portion, isBn)})
                    </strong>
                  </div>
                  <div>
                    <span className="text-slate-500 dark:text-slate-400 block">{isBn ? 'রেকর্ডীয় আয়তন:' : 'Recorded Area:'}</span>
                    <strong className="text-slate-900 dark:text-white font-mono">
                      {formatArea(item.ownership?.area_decimal, isBn)}
                    </strong>
                  </div>
                  <div>
                    <span className="text-slate-500 dark:text-slate-400 block">{isBn ? 'মালিকানা অর্জন সূত্র:' : 'Title Origin:'}</span>
                    <strong className="text-slate-900 dark:text-white">
                      {getAcquiredType(item.ownership?.acquired_type_bn)}
                    </strong>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs pt-1 mb-4">
                  <span className="text-slate-600 dark:text-slate-400">
                    {isBn ? 'খাজনা / ভূমি উন্নয়ন কর:' : 'Land Development Tax:'}
                  </span>
                  <StatusBadge status={item.khajna?.status || 'cleared'} />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs font-semibold whitespace-nowrap">
                <Link
                  to={`/citizen/land-details/${item.parcel?.id}`}
                  className="bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 py-2 rounded text-center transition flex items-center justify-center gap-1 whitespace-nowrap shrink-0"
                >
                  <Eye size={13} className="shrink-0" />
                  <span className="whitespace-nowrap">{isBn ? 'বিস্তারিত' : 'Details'}</span>
                </Link>
                <Link
                  to={`/verify-land?parcel_id=${item.parcel?.id}`}
                  className="bg-teal-50 dark:bg-teal-950/60 hover:bg-teal-100 dark:hover:bg-teal-900/60 text-teal-800 dark:text-teal-300 border border-teal-300 dark:border-teal-700 py-2 rounded text-center transition flex items-center justify-center gap-1 whitespace-nowrap shrink-0"
                >
                  <ShieldCheck size={13} className="shrink-0" />
                  <span className="whitespace-nowrap">{isBn ? 'যাচাই' : 'Verify'}</span>
                </Link>
                <Link
                  to={`/citizen/sell?parcel_id=${item.parcel?.id}`}
                  className="bg-gov-blue hover:bg-slate-900 text-white py-2 rounded text-center transition flex items-center justify-center gap-1 shadow-sm whitespace-nowrap shrink-0"
                >
                  <FilePlus2 size={13} className="shrink-0" />
                  <span className="whitespace-nowrap">{isBn ? 'বিক্রি করুন' : 'Sell Land'}</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyLandPage;
