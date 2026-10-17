import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { UserPlus, ArrowRight, ShieldCheck, Sparkles, CheckCircle2, User, RefreshCw } from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name_bn: '',
    name_en: '',
    email: '',
    password: '',
    mobile: '',
    nid_no: '',
    father_name_bn: '',
    mother_name_bn: '',
    address_bn: '',
    district: 'ঢাকা',
    upazila: 'গুলশান',
  });

  const [error, setError] = useState<string | null>(null);
  const [autoFilledName, setAutoFilledName] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleQuickFill = (type: 'buyer' | 'seller' | 'random') => {
    setError(null);
    const randId = Math.floor(1000 + Math.random() * 9000);
    const randNid = `199${Math.floor(10000000000000 + Math.random() * 90000000000000)}`;
    const randMobile = `0171${Math.floor(1000000 + Math.random() * 9000000)}`;

    if (type === 'buyer') {
      setFormData({
        name_bn: 'তানিয়া সুলতানা',
        name_en: 'Tania Sultana',
        email: `tania.${randId}@bhumisathi.test`,
        password: 'password123',
        mobile: randMobile,
        nid_no: randNid,
        father_name_bn: 'শফিকুল ইসলাম',
        mother_name_bn: 'রোকসানা আক্তার',
        address_bn: 'বাড়ি ৪৫, ফ্ল্যাট ৩এ, রামপুরা, ঢাকা',
        district: 'ঢাকা',
        upazila: 'গুলশান',
      });
      setAutoFilledName('নমুনা ক্রেতা (তানিয়া সুলতানা)');
    } else if (type === 'seller') {
      setFormData({
        name_bn: 'কাজী মিজানুর রহমান',
        name_en: 'Kazi Mijanur Rahman',
        email: `mijanur.${randId}@bhumisathi.test`,
        password: 'password123',
        mobile: randMobile,
        nid_no: randNid,
        father_name_bn: 'কাজী মতিউর রহমান',
        mother_name_bn: 'মাজেদা বেগম',
        address_bn: 'বাড়ি ১৭, রোড ৮, ব্লক ডি, বাড্ডা, ঢাকা',
        district: 'ঢাকা',
        upazila: 'গুলশান',
      });
      setAutoFilledName('নমুনা বিক্রেতা (কাজী মিজানুর রহমান)');
    } else {
      const namesBn = ['আরিফুল ইসলাম', 'মাহমুদা আক্তার', 'সোহেল রানা', 'ফারজানা হক', 'জাকির হোসেন'];
      const namesEn = ['Ariful Islam', 'Mahmuda Akter', 'Sohel Rana', 'Farzana Haque', 'Zakir Hossain'];
      const idx = Math.floor(Math.random() * namesBn.length);

      setFormData({
        name_bn: namesBn[idx],
        name_en: namesEn[idx],
        email: `citizen.${randId}@bhumisathi.test`,
        password: 'password123',
        mobile: randMobile,
        nid_no: randNid,
        father_name_bn: 'আব্দুর রহিম',
        mother_name_bn: 'সাহানা বেগম',
        address_bn: 'বাড়ি ১২, ব্লক বি, গুলশান-১, ঢাকা',
        district: 'ঢাকা',
        upazila: 'গুলশান',
      });
      setAutoFilledName(`ইউনিক নাগরিক (${namesBn[idx]})`);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const res = await register(formData);
    if (res.success) {
      navigate('/citizen/profile');
    } else {
      setError(res.message_bn || 'নিবন্ধন সম্পন্ন করা যায়নি। তথ্য সঠিকভাবে পূরণ করুন।');
    }
    setLoading(false);
  };

  return (
    <div className="font-bengali min-h-screen bg-slate-50 dark:bg-slate-950 py-12 px-4 sm:px-6 lg:px-8 max-w-2xl mx-auto transition-colors">
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 sm:p-9 transition-colors">
        <div className="text-center mb-6">
          <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white flex items-center justify-center font-bold text-2xl mx-auto shadow-md mb-2.5 border border-emerald-500/40">
            🏛️
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            নতুন নাগরিক নিবন্ধন
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            ভূমিসেবা পোর্টালে সুরক্ষিত অ্যাকাউন্ট তৈরি করে ডিজিটাল ভূমি সেবা গ্রহণ করুন
          </p>
        </div>

        {/* Demo Auto-Fill Strip */}
        <div className="bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 dark:from-slate-900 dark:via-emerald-950/40 dark:to-slate-900 border border-emerald-300 dark:border-emerald-800/60 rounded-2xl p-4 mb-6 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-extrabold text-emerald-950 dark:text-emerald-300 flex items-center gap-1.5">
              <Sparkles size={14} className="text-emerald-600 dark:text-emerald-400" />
              ১-ক্লিক ডেমো অটো-ফিল (পরীক্ষক ও বিচারক):
            </span>
            {autoFilledName && (
              <span className="text-[10px] text-emerald-800 dark:text-emerald-300 font-bold bg-white dark:bg-slate-800 px-2 py-0.5 rounded-full border border-emerald-300 dark:border-emerald-700 flex items-center gap-1">
                <CheckCircle2 size={11} className="text-emerald-600" />
                {autoFilledName} পূরণ হয়েছে
              </span>
            )}
          </div>
          <p className="text-[11px] text-slate-600 dark:text-slate-400 mb-3 leading-relaxed">
            নিবন্ধনের ১১টি ঘর হাতে টাইপ না করে নিচের যেকোনো বাটনে ট্যাপ করুন। সঠিক এনআইডি ও মোবাইল নম্বর স্বয়ংক্রিয়ভাবে লোড হবে:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleQuickFill('buyer')}
              className="py-2 px-3 rounded-xl bg-white dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-emerald-200 dark:border-emerald-800 text-[11px] font-bold shadow-2xs hover:shadow transition flex items-center justify-center gap-1.5"
            >
              <span>🛒</span>
              <span>ক্রেতা তথ্য পূরণ</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickFill('seller')}
              className="py-2 px-3 rounded-xl bg-white dark:bg-slate-800 hover:bg-teal-50 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-teal-200 dark:border-teal-800 text-[11px] font-bold shadow-2xs hover:shadow transition flex items-center justify-center gap-1.5"
            >
              <span>📜</span>
              <span>বিক্রেতা তথ্য পূরণ</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickFill('random')}
              className="py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white border border-emerald-500 text-[11px] font-bold shadow-2xs hover:shadow transition flex items-center justify-center gap-1.5 active:scale-95"
            >
              <RefreshCw size={12} />
              <span>র‍্যান্ডম নতুন নাগরিক</span>
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-rose-50 dark:bg-rose-950/60 text-rose-800 dark:text-rose-200 text-xs p-3.5 rounded-xl border border-rose-200 dark:border-rose-900 font-medium mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">পূর্ণ নাম (বাংলায়) *</label>
              <input
                type="text"
                name="name_bn"
                required
                placeholder="যেমন: মোঃ আনিসুর রহমান"
                value={formData.name_bn}
                onChange={handleChange}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl p-2.5 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Full Name (in English) *</label>
              <input
                type="text"
                name="name_en"
                required
                placeholder="e.g. Md. Anisur Rahman"
                value={formData.name_en}
                onChange={handleChange}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl p-2.5 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">মোবাইল নম্বর (১১ ডিজিট) *</label>
              <input
                type="tel"
                name="mobile"
                required
                placeholder="01711XXXXXX"
                value={formData.mobile}
                onChange={handleChange}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl p-2.5 text-slate-900 dark:text-slate-100 placeholder-slate-400 font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">জাতীয় পরিচয়পত্র নম্বর (NID) *</label>
              <input
                type="text"
                name="nid_no"
                required
                placeholder="১০ বা ১৭ ডিজিট"
                value={formData.nid_no}
                onChange={handleChange}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl p-2.5 text-slate-900 dark:text-slate-100 placeholder-slate-400 font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">পিতার নাম (বাংলায়) *</label>
              <input
                type="text"
                name="father_name_bn"
                required
                placeholder="পিতার নাম"
                value={formData.father_name_bn}
                onChange={handleChange}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl p-2.5 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">মাতার নাম (বাংলায়) *</label>
              <input
                type="text"
                name="mother_name_bn"
                required
                placeholder="মাতার নাম"
                value={formData.mother_name_bn}
                onChange={handleChange}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl p-2.5 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">বর্তমান ঠিকানা *</label>
            <input
              type="text"
              name="address_bn"
              required
              placeholder="বাড়ি/গ্রাম, রোড, এলাকা, জেলা"
              value={formData.address_bn}
              onChange={handleChange}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl p-2.5 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">ইমেইল ঠিকানা *</label>
              <input
                type="email"
                name="email"
                required
                placeholder="example@domain.com"
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl p-2.5 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">পাসওয়ার্ড *</label>
              <input
                type="password"
                name="password"
                required
                placeholder="ন্যূনতম ৬ অক্ষর"
                value={formData.password}
                onChange={handleChange}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl p-2.5 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="pt-3">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold py-3 rounded-xl shadow-md hover:shadow-lg transition flex items-center justify-center gap-2 text-sm active:scale-98"
            >
              <UserPlus size={16} />
              <span>{loading ? 'নিবন্ধন হচ্ছে...' : 'নাগরিক অ্যাকাউন্ট তৈরি করুন'}</span>
            </button>
          </div>
        </form>

        <div className="mt-6 pt-4 text-center text-xs text-slate-500 dark:text-slate-400 border-t border-slate-200 dark:border-slate-800">
          ইতিমধ্যে নিবন্ধিত?{' '}
          <Link to="/login" className="text-emerald-700 dark:text-emerald-400 font-bold hover:underline">
            লগইন করুন
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
