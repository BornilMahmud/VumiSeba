import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { UserPlus, ArrowRight, ShieldCheck, Sparkles, CheckCircle2, User, RefreshCw } from 'lucide-react';

import { isFemaleName } from '../../utils/userUtils';

export const RegisterPage: React.FC = () => {
  const { language } = useLanguage();
  const isBn = language === 'bn';

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
    photo_url: '',
    nid_photo_url: '',
  });

  const [error, setError] = useState<string | null>(null);
  const [autoFilledName, setAutoFilledName] = useState<string | null>(null);
  const [currentAvatarPreview, setCurrentAvatarPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const nextForm = { ...formData, [name]: value };
    setFormData(nextForm);

    if (name === 'name_bn' || name === 'name_en') {
      const isFemale = isFemaleName(`${name === 'name_bn' ? value : nextForm.name_bn} ${name === 'name_en' ? value : nextForm.name_en}`);
      const preview = isFemale
        ? ((value.toLowerCase().includes('tania') || value.includes('তানিয়া') || nextForm.name_en.toLowerCase().includes('tania'))
            ? '/avatars/nid_female_tania.jpg'
            : '/avatars/nid_female_citizen.jpg')
        : '/avatars/default_nid.jpg';
      setCurrentAvatarPreview(preview);
    }
  };

  const generateCleanDemoData = (type: 'buyer' | 'seller' | 'random') => {
    const randId = Math.floor(1000 + Math.random() * 9000);
    const randNid = `199${Math.floor(10000000000000 + Math.random() * 90000000000000)}`;
    const randMobile = `0171${Math.floor(1000000 + Math.random() * 9000000)}`;

    if (type === 'buyer') {
      return {
        data: {
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
          photo_url: '/avatars/nid_female_tania.jpg',
          nid_photo_url: '/avatars/nid_female_tania.jpg',
        },
        label: isBn ? 'নমুনা নারী ক্রেতা (তানিয়া সুলতানা)' : 'Demo Buyer (Tania Sultana)',
        avatar: '/avatars/nid_female_tania.jpg',
      };
    } else if (type === 'seller') {
      return {
        data: {
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
          photo_url: '/avatars/default_nid.jpg',
          nid_photo_url: '/avatars/default_nid.jpg',
        },
        label: isBn ? 'নমুনা পুরুষ বিক্রেতা (কাজী মিজানুর রহমান)' : 'Demo Seller (Kazi Mijanur Rahman)',
        avatar: '/avatars/default_nid.jpg',
      };
    } else {
      const randomPersonas = [
        {
          name_bn: 'তানিয়া সুলতানা',
          name_en: 'Tania Sultana',
          photo_url: '/avatars/nid_female_tania.jpg',
          father_name_bn: 'শফিকুল ইসলাম',
          mother_name_bn: 'রোকসানা আক্তার',
          address_bn: 'বাড়ি ৪৫, ফ্ল্যাট ৩এ, রামপুরা, ঢাকা',
        },
        {
          name_bn: 'মাহমুদা আক্তার',
          name_en: 'Mahmuda Akter',
          photo_url: '/avatars/nid_female_citizen.jpg',
          father_name_bn: 'আব্দুর রহিম',
          mother_name_bn: 'সাহানা বেগম',
          address_bn: 'বাড়ি ১২, ব্লক বি, গুলশান-১, ঢাকা',
        },
        {
          name_bn: 'ফারজানা হক',
          name_en: 'Farzana Haque',
          photo_url: '/avatars/nid_female_citizen.jpg',
          father_name_bn: 'মোফাজ্জল হোসেন',
          mother_name_bn: 'আমেনা খাতুন',
          address_bn: 'ফ্ল্যাট ৪বি, রোড ৬, ধানমন্ডি, ঢাকা',
        },
        {
          name_bn: 'নুসরাত জাহান',
          name_en: 'Nusrat Jahan',
          photo_url: '/avatars/nid_female_citizen.jpg',
          father_name_bn: 'সাইফুল ইসলাম',
          mother_name_bn: 'ফরিদা বেগম',
          address_bn: 'বাড়ি ৯, রোড ২, বনানী, ঢাকা',
        },
        {
          name_bn: 'ফারহান আহমেদ',
          name_en: 'Farhan Ahmed',
          photo_url: '/avatars/nid_farhan_ahmed.jpg',
          father_name_bn: 'মোঃ আসাদুজ্জামান',
          mother_name_bn: 'নাসরিন সুলতানা',
          address_bn: 'বাড়ি ২২, সেক্টর ৪, উত্তরা, ঢাকা',
        },
        {
          name_bn: 'আরিফুল ইসলাম',
          name_en: 'Ariful Islam',
          photo_url: '/avatars/nid_farhan_ahmed.jpg',
          father_name_bn: 'মোহাম্মদ রফিক',
          mother_name_bn: 'রোকেয়া বেগম',
          address_bn: 'বাড়ি ১৫, ব্লক সি, মিরপুর, ঢাকা',
        },
        {
          name_bn: 'সোহেল রানা',
          name_en: 'Sohel Rana',
          photo_url: '/avatars/default_nid.jpg',
          father_name_bn: 'আমজাদ হোসেন',
          mother_name_bn: 'মনিরা আক্তার',
          address_bn: 'বাড়ি ৭, রোড ১, শান্তিনগর, ঢাকা',
        },
      ];

      const p = randomPersonas[Math.floor(Math.random() * randomPersonas.length)];
      return {
        data: {
          name_bn: p.name_bn,
          name_en: p.name_en,
          email: `${p.name_en.toLowerCase().replace(/[^a-z]/g, '')}.${randId}@bhumisathi.test`,
          password: 'password123',
          mobile: randMobile,
          nid_no: randNid,
          father_name_bn: p.father_name_bn,
          mother_name_bn: p.mother_name_bn,
          address_bn: p.address_bn,
          district: 'ঢাকা',
          upazila: 'গুলশান',
          photo_url: p.photo_url,
          nid_photo_url: p.photo_url,
        },
        label: isBn ? `নাগরিক (${p.name_bn})` : `Citizen (${p.name_en})`,
        avatar: p.photo_url,
      };
    }
  };

  const handleQuickFill = (type: 'buyer' | 'seller' | 'random') => {
    setError(null);
    const { data, label, avatar } = generateCleanDemoData(type);
    setFormData(data);
    setAutoFilledName(label);
    setCurrentAvatarPreview(avatar);
  };

  const handleInstantRegister = async (type: 'buyer' | 'seller' | 'random' = 'buyer') => {
    if (loading) return;
    setError(null);
    setLoading(true);
    const { data, label, avatar } = generateCleanDemoData(type);
    setFormData(data);
    setAutoFilledName(label);
    setCurrentAvatarPreview(avatar);

    const res = await register(data);
    if (res.success) {
      navigate('/citizen/dashboard');
    } else {
      setError(
        isBn
          ? (res.message_bn || 'নিবন্ধন সম্পন্ন করা যায়নি। তথ্য সঠিকভাবে পূরণ করুন।')
          : (res.message_en || 'Registration failed. Please check the entered data.')
      );
    }
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const cleanMobile = (formData.mobile || '')
      .replace(/[০-৯]/g, (d) => ({ '০': '0', '১': '1', '২': '2', '৩': '3', '৪': '4', '৫': '5', '৬': '6', '৭': '7', '৮': '8', '৯': '9' }[d] || d))
      .replace(/[\s\-]/g, '')
      .replace(/^\+?88/, '');
    const cleanNid = (formData.nid_no || '')
      .replace(/[০-৯]/g, (d) => ({ '০': '0', '১': '1', '২': '2', '৩': '3', '৪': '4', '৫': '5', '৬': '6', '৭': '7', '৮': '8', '৯': '9' }[d] || d))
      .replace(/[\s\-]/g, '');

    if (!formData.name_bn.trim() || !formData.name_en.trim()) {
      setError(isBn ? 'বাংলা এবং ইংরেজিতে পুরো নাম প্রদান করুন।' : 'Please provide full name in both Bengali and English.');
      setLoading(false);
      return;
    }
    if (!/^01[3-9]\d{8}$/.test(cleanMobile)) {
      setError(isBn ? 'সঠিক ১১ ডিজিটের মোবাইল নম্বর দিন (যেমন: 017XXXXXXXX)।' : 'Please provide a valid 11-digit mobile number (e.g. 017XXXXXXXX).');
      setLoading(false);
      return;
    }
    if (cleanNid.length < 10) {
      setError(isBn ? 'জাতীয় পরিচয়পত্র নম্বর (NID) ন্যূনতম ১০ বা ১৭ ডিজিট হতে হবে।' : 'National ID (NID) must be at least 10 or 17 digits.');
      setLoading(false);
      return;
    }
    if (formData.password.length < 6) {
      setError(isBn ? 'পাসওয়ার্ড ন্যূনতম ৬ অক্ষরের হতে হবে।' : 'Password must be at least 6 characters.');
      setLoading(false);
      return;
    }

    const isFemale = isFemaleName(`${formData.name_bn} ${formData.name_en}`);
    const assignedPhotoUrl =
      formData.photo_url ||
      (isFemale
        ? formData.name_en.toLowerCase().includes('tania') || formData.name_bn.includes('তানিয়া')
          ? '/avatars/nid_female_tania.jpg'
          : '/avatars/nid_female_citizen.jpg'
        : '/avatars/default_nid.jpg');

    const submissionData = {
      ...formData,
      mobile: cleanMobile,
      nid_no: cleanNid,
      email: formData.email.trim(),
      photo_url: assignedPhotoUrl,
      nid_photo_url: assignedPhotoUrl,
    };

    const res = await register(submissionData);
    if (res.success) {
      navigate('/citizen/dashboard');
    } else {
      setError(
        isBn
          ? (res.message_bn || 'নিবন্ধন সম্পন্ন করা যায়নি। তথ্য সঠিকভাবে পূরণ করুন।')
          : (res.message_en || 'Registration failed. Please check the entered data.')
      );
    }
    setLoading(false);
  };

  return (
    <div className={`${isBn ? 'font-bengali' : 'font-sans'} min-h-screen bg-slate-50 dark:bg-slate-950 py-12 px-4 sm:px-6 lg:px-8 max-w-2xl mx-auto transition-colors`}>
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 sm:p-9 transition-colors">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            {isBn ? 'নতুন নাগরিক নিবন্ধন' : 'Citizen Registration'}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {isBn
              ? 'ভূমিসেবা পোর্টালে সুরক্ষিত অ্যাকাউন্ট তৈরি করে ডিজিটাল ভূমি সেবা গ্রহণ করুন'
              : 'Create a verified account on VumiSeba to access digital land governance and services'}
          </p>
        </div>

        {/* Demo Auto-Fill Strip */}
        <div className="bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 dark:from-slate-900 dark:via-emerald-950/40 dark:to-slate-900 border border-emerald-300 dark:border-emerald-800/60 rounded-2xl p-4 mb-6 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-extrabold text-emerald-950 dark:text-emerald-300 flex items-center gap-1.5">
              <Sparkles size={14} className="text-emerald-600 dark:text-emerald-400" />
              {isBn ? '১-ক্লিক ডেমো অটো-ফিল (পরীক্ষক ও বিচারক):' : '1-Click Demo Auto-Fill (Evaluators & Judges):'}
            </span>
            {autoFilledName && (
              <span className="text-[10px] text-emerald-800 dark:text-emerald-300 font-bold bg-white dark:bg-slate-800 pl-1 pr-2 py-0.5 rounded-full border border-emerald-300 dark:border-emerald-700 flex items-center gap-1.5 shadow-2xs">
                {currentAvatarPreview && (
                  <img
                    src={currentAvatarPreview}
                    alt="avatar"
                    className="w-5 h-5 rounded-full object-cover ring-1 ring-emerald-500 shrink-0"
                  />
                )}
                <CheckCircle2 size={11} className="text-emerald-600" />
                <span>{autoFilledName} {isBn ? 'পূরণ হয়েছে' : 'Loaded'}</span>
              </span>
            )}
          </div>
          <p className="text-[11px] text-slate-600 dark:text-slate-400 mb-3 leading-relaxed">
            {isBn
              ? 'নিবন্ধনের ১১টি ঘর হাতে টাইপ না করে নিচের যেকোনো বাটনে ট্যাপ করুন। সঠিক এনআইডি, মোবাইল ও জেন্ডার-অনুযায়ী ছবি স্বয়ংক্রিয়ভাবে লোড হবে:'
              : 'Skip manual typing by tapping any button below. Verified demo citizen credentials, NID & gender-accurate photo will load instantly:'}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
            <button
              type="button"
              onClick={() => handleQuickFill('buyer')}
              className="py-2 px-2.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-emerald-200 dark:border-emerald-800 text-[11px] font-bold shadow-2xs hover:shadow transition flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>🛒</span>
              <span>{isBn ? 'নারী ক্রেতা (তানিয়া)' : 'Female Buyer (Tania)'}</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickFill('seller')}
              className="py-2 px-2.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-teal-50 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-teal-200 dark:border-teal-800 text-[11px] font-bold shadow-2xs hover:shadow transition flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>📜</span>
              <span>{isBn ? 'পুরুষ বিক্রেতা (মিজানুর)' : 'Male Seller (Mijanur)'}</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickFill('random')}
              className="py-2 px-2.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 text-[11px] font-bold shadow-2xs hover:shadow transition flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <RefreshCw size={12} className="text-emerald-600 dark:text-emerald-400" />
              <span>{isBn ? 'র‍্যান্ডম নারী/পুরুষ' : 'Random Citizen'}</span>
            </button>
            <button
              type="button"
              disabled={loading}
              onClick={() => handleInstantRegister('buyer')}
              className="py-2 px-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white border border-emerald-500 text-[11px] font-bold shadow-2xs hover:shadow transition flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer"
            >
              <span>⚡</span>
              <span>{isBn ? '১-ক্লিকে তাৎক্ষণিক নিবন্ধন' : '1-Click Register'}</span>
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
              <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                {isBn ? 'পূর্ণ নাম (বাংলায়) *' : 'Full Name (in Bengali) *'}
              </label>
              <input
                type="text"
                name="name_bn"
                required
                placeholder={isBn ? 'যেমন: মোঃ আনিসুর রহমান' : 'e.g. মোঃ আনিসুর রহমান'}
                value={formData.name_bn}
                onChange={handleChange}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl p-2.5 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                {isBn ? 'পূর্ণ নাম (ইংরেজিতে) *' : 'Full Name (in English) *'}
              </label>
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
              <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                {isBn ? 'মোবাইল নম্বর (১১ ডিজিট) *' : 'Mobile Number (11 Digits) *'}
              </label>
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
              <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                {isBn ? 'জাতীয় পরিচয়পত্র নম্বর (NID) *' : 'National ID (NID) *'}
              </label>
              <input
                type="text"
                name="nid_no"
                required
                placeholder={isBn ? '১০ বা ১৭ ডিজিট' : '10 or 17 digits'}
                value={formData.nid_no}
                onChange={handleChange}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl p-2.5 text-slate-900 dark:text-slate-100 placeholder-slate-400 font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                {isBn ? 'পিতার নাম *' : "Father's Name *"}
              </label>
              <input
                type="text"
                name="father_name_bn"
                required
                placeholder={isBn ? 'পিতার নাম' : "Father's Name"}
                value={formData.father_name_bn}
                onChange={handleChange}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl p-2.5 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                {isBn ? 'মাতার নাম *' : "Mother's Name *"}
              </label>
              <input
                type="text"
                name="mother_name_bn"
                required
                placeholder={isBn ? 'মাতার নাম' : "Mother's Name"}
                value={formData.mother_name_bn}
                onChange={handleChange}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl p-2.5 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
              {isBn ? 'বর্তমান ঠিকানা *' : 'Present Address *'}
            </label>
            <input
              type="text"
              name="address_bn"
              required
              placeholder={isBn ? 'বাড়ি/গ্রাম, রোড, এলাকা, জেলা' : 'House/Village, Road, Area, District'}
              value={formData.address_bn}
              onChange={handleChange}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl p-2.5 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                {isBn ? 'ইমেইল ঠিকানা *' : 'Email Address *'}
              </label>
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
              <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                {isBn ? 'পাসওয়ার্ড *' : 'Password *'}
              </label>
              <input
                type="password"
                name="password"
                required
                placeholder={isBn ? 'ন্যূনতম ৬ অক্ষর' : 'Min 6 characters'}
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
              <span>{loading ? (isBn ? 'নিবন্ধন হচ্ছে...' : 'Registering...') : (isBn ? 'নাগরিক অ্যাকাউন্ট তৈরি করুন' : 'Create Citizen Account')}</span>
            </button>
          </div>
        </form>

        <div className="mt-6 pt-4 text-center text-xs text-slate-500 dark:text-slate-400 border-t border-slate-200 dark:border-slate-800">
          {isBn ? 'ইতিমধ্যে নিবন্ধিত? ' : 'Already registered? '}
          <Link to="/login" className="text-emerald-700 dark:text-emerald-400 font-bold hover:underline">
            {isBn ? 'লগইন করুন' : 'Sign In'}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
