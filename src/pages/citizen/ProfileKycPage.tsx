import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import {
  UserCheck,
  Shield,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Copy,
  Check,
  LogOut,
  CreditCard,
  ShieldCheck,
  BadgeCheck,
  Camera,
  Upload,
  Phone,
  Mail,
  MapPin,
  Save,
  RotateCcw,
  Edit3,
  Eye,
  EyeOff,
} from 'lucide-react';
import { getUserAvatarUrl } from '../../utils/userUtils';
import { BangladeshNidCard, formatMaskedNid } from '../../components/common/BangladeshNidCard';

export const ProfileKycPage: React.FC = () => {
  const { user, refreshProfile, logout, updateProfile } = useAuth();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  // Profile & NID Information State (defaults to authentic NID card data)
  const [nameBn, setNameBn] = useState(user?.name_bn || 'মোঃ আরমান হোসেন রিপন');
  const [nameEn, setNameEn] = useState(user?.name_en || 'MD. ARMAN HOSSEN RIPON');
  const [fatherNameBn, setFatherNameBn] = useState(user?.father_name_bn || 'মোঃ ফেরদৌস হাসান খান');
  const [motherNameBn, setMotherNameBn] = useState(user?.mother_name_bn || 'মোছাঃ মহসিনা আকতার শান্তনা');
  const [dateOfBirth, setDateOfBirth] = useState(user?.date_of_birth || '2005-06-01');
  const [nidNo, setNidNo] = useState(user?.nid_no || '6847057587');
  const [signatureUrl, setSignatureUrl] = useState<string>('');
  const [signatureText, setSignatureText] = useState<string>(() => (user?.name_bn ? (user.name_bn.split(' ').slice(-1)[0] || 'আরমান') : 'আরমান'));
  const [tableNidMasked, setTableNidMasked] = useState(true);
  const [cardType, setCardType] = useState<'smart' | 'laminated'>(() => {
    const rawNid = (user?.nid_no || '6847057587').replace(/\D/g, '');
    return rawNid.length === 10 ? 'smart' : 'laminated';
  });

  // Contact Edit State
  const [mobile, setMobile] = useState(user?.mobile || '');
  const [email, setEmail] = useState(user?.email || '');
  const [addressBn, setAddressBn] = useState(user?.address_bn || '');
  const [district, setDistrict] = useState(user?.district || 'ঢাকা');
  const [upazila, setUpazila] = useState(user?.upazila || 'গুলশান');
  const [customPhotoUrl, setCustomPhotoUrl] = useState<string>(getUserAvatarUrl(user) || '/avatars/default_nid.jpg');
  const [saving, setSaving] = useState(false);
  const [photoSaving, setPhotoSaving] = useState(false);
  const [editFeedback, setEditFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    if (user) {
      setNameBn(user.name_bn || 'মোঃ আরমান হোসেন রিপন');
      setNameEn(user.name_en || 'MD. ARMAN HOSSEN RIPON');
      setFatherNameBn(user.father_name_bn || 'মোঃ ফেরদৌস হাসান খান');
      setMotherNameBn(user.mother_name_bn || 'মোছাঃ মহসিনা আকতার শান্তনা');
      setDateOfBirth(user.date_of_birth || '2005-06-01');
      setNidNo(user.nid_no || '6847057587');
      const clean = (user.nid_no || '').replace(/\D/g, '');
      if (clean.length === 10) setCardType('smart');
      else if (clean.length > 10) setCardType('laminated');
      setMobile(user.mobile || '');
      setEmail(user.email || '');
      setAddressBn(user.address_bn || '');
      setDistrict(user.district || 'ঢাকা');
      setUpazila(user.upazila || 'গুলশান');
      setCustomPhotoUrl(getUserAvatarUrl(user) || '/avatars/default_nid.jpg');
      const parts = (user.name_bn || '').trim().split(/\s+/);
      const shortSig = parts.length > 1 ? parts[parts.length - 1] : (user.name_bn || 'আরমান');
      setSignatureText(shortSig);
    }
  }, [user]);

  const avatarUrl = customPhotoUrl || getUserAvatarUrl(user) || '/avatars/default_nid.jpg';

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setEditFeedback({
          type: 'error',
          message: 'ছবির সাইজ ৫ মেগাবাইটের কম হতে হবে।',
        });
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          const resStr = event.target.result as string;
          setCustomPhotoUrl(resStr);
          setEditFeedback({
            type: 'success',
            message: 'ডিভাইস থেকে নতুন ছবি নির্বাচন করা হয়েছে। এটি শীর্ষে প্রদর্শন করতে "ছবি এখনই সংরক্ষণ করুন" চাপুন।',
          });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // 1-Click Save for Photo Only
  const handleSavePhotoOnly = async () => {
    setPhotoSaving(true);
    setEditFeedback(null);
    try {
      const res = await updateProfile({
        photo_url: customPhotoUrl,
        nid_photo_url: customPhotoUrl,
      });
      setPhotoSaving(false);
      if (res.success) {
        setEditFeedback({
          type: 'success',
          message: 'প্রোফাইল ছবি সফলভাবে সংরক্ষিত হয়েছে! ড্যাশবোর্ডের উপরে ডানপাশে এবং সাইডবারে আপনার ছবি এখন দৃশ্যমান।',
        });
      } else {
        setEditFeedback({
          type: 'error',
          message: res.message_bn || 'ছবি সংরক্ষণ ব্যর্থ হয়েছে।',
        });
      }
    } catch (err: any) {
      setPhotoSaving(false);
      setEditFeedback({
        type: 'error',
        message: err.message || 'Error saving photo',
      });
    }
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setEditFeedback(null);

    const payload: any = {
      name_bn: nameBn,
      name_en: nameEn,
      father_name_bn: fatherNameBn,
      mother_name_bn: motherNameBn,
      date_of_birth: dateOfBirth,
      nid_no: nidNo,
      mobile,
      email,
      address_bn: addressBn,
      district,
      upazila,
      photo_url: customPhotoUrl,
      nid_photo_url: customPhotoUrl,
    };

    const res = await updateProfile(payload);
    setSaving(false);
    if (res.success) {
      setEditFeedback({
        type: 'success',
        message: res.message_bn || 'আপনার প্রোফাইল তথ্য ও ছবি সফলভাবে হালনাগাদ হয়েছে।',
      });
    } else {
      setEditFeedback({
        type: 'error',
        message: res.message_bn || 'হালনাগাদ ব্যর্থ হয়েছে। আবার চেষ্টা করুন।',
      });
    }
  };

  const handleCopyCitizenId = () => {
    if (user?.citizen_id) {
      navigator.clipboard.writeText(user.citizen_id);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const handleInstantKycVerify = async () => {
    setLoading(true);
    setMessage(null);
    const res = await api.verifyKyc();
    if (res.success) {
      await refreshProfile();
      setMessage(res.message_bn || 'কেওয়াইসি সফলভাবে অনুমোদিত ও সিটিজেন আইডি তৈরি হয়েছে!');
    } else {
      setMessage(res.message_bn || 'ত্রুটি হয়েছে');
    }
    setLoading(false);
  };

  const isVerified = user?.kyc_status === 'verified';

  return (
    <div className="font-bengali space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">নাগরিক প্রোফাইল ও কেওয়াইসি (KYC)</h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          ইউনিক সিটিজেন আইডি ব্যবস্থাপনা ও জাতীয় পরিচয়পত্র যাচাইকরণ
        </p>
      </div>

      {message && (
        <div className="bg-emerald-50 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-800 p-4 rounded-xl text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 size={16} />
          <span>{message}</span>
        </div>
      )}

      {/* 1. Citizen ID Card with Official Photo */}
      <div className="bg-gradient-to-r from-emerald-50/90 via-teal-50/50 to-white dark:from-[#0b1329] dark:to-[#071d24] text-slate-900 dark:text-white rounded-2xl p-6 shadow-gov-sm border border-emerald-200/90 dark:border-slate-800 transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-emerald-100 dark:border-slate-800">
          <div>
            <span className="text-xs font-bold text-teal-700 dark:text-teal-400 uppercase tracking-widest block mb-1">
              গণপ্রজাতন্ত্রী বাংলাদেশ সরকার | ডিজিটাল ভূমি সেবা
            </span>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">ইউনিক সিটিজেন আইডি (Unique Citizen ID)</h2>
          </div>
          <span className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 ${
            isVerified
              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300 dark:bg-teal-500/20 dark:text-teal-300 dark:border-teal-400/40'
              : 'bg-amber-100 text-amber-800 border border-amber-300 dark:bg-amber-500/20 dark:text-amber-300 dark:border-amber-400/40'
          }`}>
            {isVerified ? (
              <>
                <BadgeCheck size={14} className="text-emerald-600 dark:text-teal-400" />
                <span>কেওয়াইসি অনুমোদিত</span>
              </>
            ) : (
              'অপেক্ষমাণ / অযাচাইকৃত'
            )}
          </span>
        </div>

        <div className="py-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            {avatarUrl ? (
              <div className="relative shrink-0">
                <img
                  src={avatarUrl}
                  alt={user?.name_bn || 'নাগরিক'}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover ring-3 ring-emerald-500/40 shadow-md bg-white dark:bg-slate-800"
                />
                <span
                  className="absolute -bottom-1 -right-1 bg-emerald-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full border-2 border-white dark:border-slate-800 flex items-center gap-0.5 shadow-2xs"
                  title="এনআইডি ডাটাবেজ ভেরিফায়েড ফটো"
                >
                  <CheckCircle2 size={10} /> NID
                </span>
              </div>
            ) : null}
            <div>
              <span className="text-xs text-slate-600 dark:text-slate-400 block mb-1 font-medium">নির্ধারিত সিটিজেন আইডি:</span>
              <div className="flex items-center gap-3">
                <span className="text-2xl sm:text-3xl font-mono font-extrabold text-emerald-700 dark:text-teal-400 tracking-wider">
                  {user?.citizen_id || 'ID বরাদ্দ হয়নি'}
                </span>
                {user?.citizen_id && (
                  <button
                    onClick={handleCopyCitizenId}
                    className="p-1.5 rounded-lg bg-emerald-100 hover:bg-emerald-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-emerald-800 dark:text-slate-300 transition cursor-pointer"
                    title="কপি করুন"
                  >
                    {copied ? <Check size={16} className="text-emerald-600 dark:text-teal-400" /> : <Copy size={16} />}
                  </button>
                )}
              </div>
              <p className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-1">
                {user?.name_bn} {user?.name_en ? `(${user?.name_en})` : ''}
              </p>
            </div>
          </div>

          {!user?.citizen_id || !isVerified ? (
            <button
              onClick={handleInstantKycVerify}
              disabled={loading}
              className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white dark:bg-teal-500 dark:hover:bg-teal-400 dark:text-slate-950 font-bold px-4 py-2.5 rounded-xl text-xs shadow-sm transition cursor-pointer shrink-0"
            >
              <Sparkles size={15} />
              <span>{loading ? 'যাচাই হচ্ছে...' : '১-ক্লিকে KYC অনুমোদন ও ID তৈরি করুন'}</span>
            </button>
          ) : (
            <div className="bg-white/80 dark:bg-slate-800/80 px-4 py-2.5 rounded-xl border border-emerald-200/80 dark:border-slate-700 text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2 shrink-0">
              <ShieldCheck size={16} className="text-emerald-600 dark:text-teal-400 shrink-0" />
              <span>এনআইডি ছবি ও বায়োমেট্রিক সফলভাবে সংযুক্ত</span>
            </div>
          )}
        </div>

        <p className="text-[11px] text-slate-500 dark:text-slate-400 pt-3 border-t border-emerald-100 dark:border-slate-800">
          * ভূমি ক্রয়-বিক্রয় আবেদন ও নামজারি প্রক্রিয়ায় সরাসরি এনআইডি নম্বরের পরিবর্তে এই সুরক্ষিত সিটিজেন আইডি ও বায়োমেট্রিক ছবি ব্যবহৃত হবে।
        </p>
      </div>

      {/* 2. Official Bangladesh National ID Card (Smart & Laminated) */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-gov-sm border border-slate-200 dark:border-slate-800 p-4 sm:p-6 space-y-4 transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <span className="p-1.5 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 rounded-lg">
              <CreditCard size={18} />
            </span>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                জাতীয় পরিচয়পত্র (National ID Card)
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                স্মার্ট জাতীয় পরিচয়পত্র ও লেমিনেটেড পেপার এনআইডি (নম্বর সুরক্ষার্থে পূর্বনির্ধারিতভাবে * দ্বারা গোপন)
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60">
              <ShieldCheck size={14} />
              <span>ভেরিফায়েড নাগরিক এনআইডি</span>
            </span>
          </div>
        </div>

        {/* Photorealistic Bangladesh NID Card Display (Smart or Laminated) */}
        <div className="py-2">
          <BangladeshNidCard
            cardType={cardType}
            nameBn={nameBn}
            nameEn={nameEn}
            fatherNameBn={fatherNameBn}
            motherNameBn={motherNameBn}
            dateOfBirth={dateOfBirth}
            nidNo={nidNo}
            photoUrl={customPhotoUrl || avatarUrl}
            signatureUrl={signatureUrl}
            signatureText={signatureText}
            showLaminationBorder={true}
            maskNid={true}
            showControls={true}
          />
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400">
          <span className="flex items-center gap-1.5 font-medium text-emerald-700 dark:text-teal-400">
            <CheckCircle2 size={13} className="shrink-0" />
            <span>ইলেকশন কমিশন বাংলাদেশ ডাটাবেজ ভেরিফায়েড জাতীয় পরিচয়পত্র</span>
          </span>
          <span className="text-[10px] font-mono text-slate-400">
            * এনআইডি নম্বর সুরক্ষার স্বার্থে প্রদর্শনীতে গোপন (*) রাখা হয়েছে
          </span>
        </div>
      </div>

      {/* 3. Interactive Profile Photo & Contact Information Editor */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-gov-sm border border-slate-200 dark:border-slate-800 p-6 space-y-5 transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <span className="p-2 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 rounded-xl">
              <Edit3 size={18} />
            </span>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                জাতীয় পরিচয়পত্র ও প্রোফাইল বিবরণী পরিবর্তন
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                এনআইডি কার্ডের বিবরণ, প্রোফাইল ছবি এবং যোগাযোগ তথ্য হালনাগাদ করুন (কার্ডে সরাসরি প্রভাব পড়বে)
              </p>
            </div>
          </div>
        </div>

        {editFeedback && (
          <div
            className={`p-3.5 rounded-xl border flex items-center gap-2.5 text-xs font-semibold ${
              editFeedback.type === 'success'
                ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
                : 'bg-rose-50 dark:bg-rose-950/60 border-rose-300 dark:border-rose-800 text-rose-900 dark:text-rose-200'
            }`}
          >
            {editFeedback.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 dark:text-rose-400" />
            )}
            <span>{editFeedback.message}</span>
          </div>
        )}

        <form onSubmit={handleProfileSubmit} className="space-y-6">
          {/* NID Card Information Section */}
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-50/80 dark:bg-slate-850/60 border border-slate-200/90 dark:border-slate-800 space-y-4">
            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 uppercase tracking-wide">
              <CreditCard size={14} className="text-emerald-600" />
              <span>১. জাতীয় পরিচয়পত্র বিবরণী (NID Details)</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  নাম (বাংলায়) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={nameBn}
                  onChange={(e) => setNameBn(e.target.value)}
                  placeholder="মোঃ আরমান হোসেন রিপন"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Name (in English) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={nameEn}
                  onChange={(e) => setNameEn(e.target.value.toUpperCase())}
                  placeholder="MD. ARMAN HOSSEN RIPON"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 font-mono uppercase"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  পিতার নাম (বাংলায়)
                </label>
                <input
                  type="text"
                  value={fatherNameBn}
                  onChange={(e) => setFatherNameBn(e.target.value)}
                  placeholder="মোঃ ফেরদৌস হাসান খান"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  মাতার নাম (বাংলায়)
                </label>
                <input
                  type="text"
                  value={motherNameBn}
                  onChange={(e) => setMotherNameBn(e.target.value)}
                  placeholder="মোছাঃ মহসিনা আকতার শান্তনা"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Date of Birth (জন্ম তারিখ) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                  placeholder="01 Jun 2005 অথবা 2005-06-01"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 font-mono"
                />
                <span className="text-[10px] text-slate-400 mt-0.5 block">ফরম্যাট: 01 Jun 2005 অথবা YYYY-MM-DD</span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  জাতীয় পরিচয়পত্র নম্বর (ID NO) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={nidNo}
                  onChange={(e) => setNidNo(e.target.value)}
                  placeholder="6847057587"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 font-mono"
                />
                <span className="text-[10px] text-slate-400 mt-0.5 block">১০, ১৩ বা ১৭ ডিজিট</span>
              </div>
            </div>
          </div>

          {/* Photo Management Section */}
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-50/80 dark:bg-slate-850/60 border border-slate-200/90 dark:border-slate-800 space-y-4">
            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 uppercase tracking-wide">
              <Camera size={14} className="text-emerald-600" />
              <span>২. প্রোফাইল ও এনআইডি ছবি পরিবর্তন</span>
            </h4>

            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
              {/* Photo Preview */}
              <div className="relative group shrink-0">
                <img
                  src={avatarUrl || '/avatars/default_nid.jpg'}
                  alt="Avatar Preview"
                  className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover ring-4 ring-emerald-500/30 dark:ring-emerald-500/20 shadow-md bg-white dark:bg-slate-800"
                />
                <label
                  htmlFor="citizen-photo-upload"
                  className="absolute inset-0 bg-black/40 hover:bg-black/60 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white cursor-pointer"
                  title="ছবি আপলোড করতে ক্লিক করুন"
                >
                  <Upload size={18} />
                  <span className="text-[10px] font-bold mt-1">আপলোড</span>
                </label>
              </div>

              {/* Upload Input & Photo Controls */}
              <div className="flex-1 w-full space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <label
                    htmlFor="citizen-photo-upload"
                    className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-2xs transition cursor-pointer active:scale-95"
                  >
                    <Upload size={14} />
                    <span>ডিভাইস থেকে নতুন ছবি আপলোড করুন</span>
                  </label>
                  <input
                    id="citizen-photo-upload"
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />

                  {/* 1-Click Save Photo */}
                  <button
                    type="button"
                    onClick={handleSavePhotoOnly}
                    disabled={photoSaving}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-900 hover:bg-black dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 shadow-2xs transition cursor-pointer active:scale-95 disabled:opacity-50"
                  >
                    {photoSaving ? (
                      <div className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <CheckCircle2 size={14} className="text-emerald-400 dark:text-emerald-600" />
                    )}
                    <span>{photoSaving ? 'সংরক্ষণ হচ্ছে...' : 'ছবি এখনই সংরক্ষণ করুন'}</span>
                  </button>

                  {customPhotoUrl !== getUserAvatarUrl(user) && (
                    <button
                      type="button"
                      onClick={() => setCustomPhotoUrl(getUserAvatarUrl(user) || '/avatars/default_nid.jpg')}
                      className="inline-flex items-center gap-1 px-3 py-2 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 text-xs font-medium cursor-pointer rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                    >
                      <RotateCcw size={13} />
                      <span>রিসেট</span>
                    </button>
                  )}
                  <span className="text-[10px] text-slate-500 dark:text-slate-400">
                    সর্বোচ্চ ৫ মেগাবাইট (JPG, PNG)
                  </span>
                </div>

                {/* Top-Right Header Live Preview */}
                <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                  <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 block mb-1.5">
                    শীর্ষ ড্যাশবোর্ড হেডার প্রিভিউ (Top-Right Live Preview):
                  </span>
                  <div className="inline-flex items-center gap-2.5 p-1.5 px-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
                    <div className="text-right">
                      <p className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                        {nameBn || user?.name_bn || 'নাগরিক'}
                      </p>
                      <p className="text-[10px] text-emerald-700 dark:text-emerald-400 font-mono font-semibold leading-tight">
                        {user?.citizen_id || 'BHM-CIT-882194'}
                      </p>
                    </div>
                    <div className="relative shrink-0">
                      <img
                        src={avatarUrl || '/avatars/default_nid.jpg'}
                        alt="Header Preview"
                        className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl object-cover ring-2 ring-emerald-500/50 shadow-2xs"
                      />
                      <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Details Section */}
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-50/80 dark:bg-slate-850/60 border border-slate-200/90 dark:border-slate-800 space-y-4">
            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 uppercase tracking-wide">
              <Phone size={14} className="text-emerald-600" />
              <span>২. যোগাযোগ ও ঠিকানা বিবরণ</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  মোবাইল নম্বর <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Phone size={14} />
                  </div>
                  <input
                    type="tel"
                    required
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    placeholder="017XXXXXXXX"
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  ইমেইল ঠিকানা <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Mail size={14} />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="citizen@example.com"
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 font-sans"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  জেলা (District)
                </label>
                <input
                  type="text"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  placeholder="ঢাকা"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  উপজেলা / সার্কেল (Upazila)
                </label>
                <input
                  type="text"
                  value={upazila}
                  onChange={(e) => setUpazila(e.target.value)}
                  placeholder="গুলশান"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  বর্তমান ঠিকানা (বাংলায়)
                </label>
                <div className="relative">
                  <div className="absolute top-2.5 left-3 pointer-events-none text-slate-400">
                    <MapPin size={14} />
                  </div>
                  <textarea
                    rows={2}
                    value={addressBn}
                    onChange={(e) => setAddressBn(e.target.value)}
                    placeholder="বাড়ি নং, রোড নং, এলাকা/গ্রাম..."
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => {
                if (user) {
                  setMobile(user.mobile || '');
                  setEmail(user.email || '');
                  setAddressBn(user.address_bn || '');
                  setDistrict(user.district || 'ঢাকা');
                  setUpazila(user.upazila || 'গুলশান');
                  setCustomPhotoUrl(getUserAvatarUrl(user) || '');
                  setEditFeedback(null);
                }
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
            >
              <RotateCcw size={14} />
              <span>পূর্বাবস্থায় ফেরান</span>
            </button>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white dark:bg-teal-600 dark:hover:bg-teal-500 transition shadow-sm cursor-pointer disabled:opacity-50 active:scale-95"
            >
              <Save size={14} />
              <span>{saving ? 'সংরক্ষণ হচ্ছে...' : 'তথ্য ও ছবি সংরক্ষণ করুন'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* 4. Citizen Personal Particulars Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-gov-sm border border-slate-200 dark:border-slate-800 p-6 space-y-4 transition-colors">
        <h3 className="font-bold text-slate-900 dark:text-white text-sm border-b border-slate-100 dark:border-slate-800 pb-2">নাগরিক পরিচয় তথ্যাবলী</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700/80">
            <span className="text-slate-500 dark:text-slate-400 block">পূর্ণ নাম (বাংলায়):</span>
            <strong className="text-slate-900 dark:text-white text-sm">{user?.name_bn || nameBn}</strong>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700/80">
            <span className="text-slate-500 dark:text-slate-400 block">Full Name (in English):</span>
            <strong className="text-slate-900 dark:text-white text-sm uppercase">{user?.name_en || nameEn}</strong>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700/80 flex items-center justify-between">
            <div>
              <span className="text-slate-500 dark:text-slate-400 block">জাতীয় পরিচয়পত্র নম্বর (ID NO):</span>
              <strong className="text-red-600 dark:text-red-400 font-mono text-sm">
                {tableNidMasked ? formatMaskedNid(user?.nid_no || nidNo, true) : (user?.nid_no || nidNo)}
              </strong>
            </div>
            <button
              type="button"
              onClick={() => setTableNidMasked(!tableNidMasked)}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition cursor-pointer"
              title={tableNidMasked ? 'নম্বর উন্মোচন করুন' : 'নম্বর লুকান (*)'}
            >
              {tableNidMasked ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700/80">
            <span className="text-slate-500 dark:text-slate-400 block">জন্ম তারিখ (Date of Birth):</span>
            <strong className="text-red-600 dark:text-red-400 font-mono text-sm">{user?.date_of_birth || dateOfBirth}</strong>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700/80">
            <span className="text-slate-500 dark:text-slate-400 block">পিতার নাম:</span>
            <strong className="text-slate-900 dark:text-white">{user?.father_name_bn || fatherNameBn}</strong>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700/80">
            <span className="text-slate-500 dark:text-slate-400 block">মাতার নাম:</span>
            <strong className="text-slate-900 dark:text-white">{user?.mother_name_bn || motherNameBn}</strong>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700/80">
            <span className="text-slate-500 dark:text-slate-400 block">নিবন্ধিত মোবাইল নম্বর:</span>
            <strong className="text-slate-900 dark:text-white font-mono text-sm">{user?.mobile || mobile}</strong>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700/80">
            <span className="text-slate-500 dark:text-slate-400 block">ইমেইল ঠিকানা:</span>
            <strong className="text-slate-900 dark:text-white font-mono text-sm">{user?.email || email}</strong>
          </div>

          <div className="col-span-1 sm:col-span-2 p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700/80">
            <span className="text-slate-500 dark:text-slate-400 block">বর্তমান ঠিকানা:</span>
            <strong className="text-slate-900 dark:text-slate-100">{user?.address_bn || addressBn}, {user?.upazila || upazila}, {user?.district || district}</strong>
          </div>
        </div>

        {/* Account Session & Logout */}
        <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <p className="text-xs font-bold text-slate-800 dark:text-slate-200">নিরাপদ সেশন সমাপ্তি</p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">আপনার ডিভাইস থেকে সুরক্ষিতভাবে অ্যাকাউন্টটি লগআউট করুন</p>
          </div>
          <button
            onClick={handleLogout}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold transition shadow-xs cursor-pointer active:scale-95"
          >
            <LogOut size={14} />
            <span>অ্যাকাউন্ট থেকে লগআউট</span>
          </button>
        </div>
      </div>
    </div>
  );
};
