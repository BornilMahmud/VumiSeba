import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { getUserAvatarUrl, AVAILABLE_AVATAR_PRESETS } from '../../utils/userUtils';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Building2,
  Shield,
  Camera,
  Upload,
  CheckCircle2,
  AlertCircle,
  Save,
  RotateCcw,
  Sparkles,
  Briefcase,
  IdCard,
} from 'lucide-react';

export const OfficerProfilePage: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const { language } = useLanguage();
  const isBn = language === 'bn';

  const [mobile, setMobile] = useState(user?.mobile || '');
  const [email, setEmail] = useState(user?.email || '');
  const [addressBn, setAddressBn] = useState(user?.address_bn || '');
  const [district, setDistrict] = useState(user?.district || 'ঢাকা');
  const [upazila, setUpazila] = useState(user?.upazila || 'গুলশান');
  const [customPhotoUrl, setCustomPhotoUrl] = useState<string>(getUserAvatarUrl(user) || '');

  const [photoSaving, setPhotoSaving] = useState(false);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Handle local image file upload from device
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setFeedback({
          type: 'error',
          message: isBn ? 'ছবির সাইজ ৫ মেগাবাইটের কম হতে হবে।' : 'Image size must be less than 5MB.',
        });
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          const resultStr = event.target.result as string;
          setCustomPhotoUrl(resultStr);
          setFeedback({
            type: 'success',
            message: isBn
              ? 'ডিভাইস থেকে নতুন ছবি লোড হয়েছে! এটি স্থায়ী করতে নিচের "ছবি এখনই সংরক্ষণ করুন" বাটন চাপুন।'
              : 'New photo selected from device! Click "Save Photo Now" to apply.',
          });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSelectPreset = (url: string) => {
    setCustomPhotoUrl(url);
    setFeedback({
      type: 'success',
      message: isBn
        ? 'অফিসিয়াল পোর্ট্রেট নির্বাচন করা হয়েছে। স্থায়ী করতে "ছবি এখনই সংরক্ষণ করুন" চাপুন।'
        : 'Official portrait selected. Click "Save Photo Now" to apply.',
    });
  };

  // Instant 1-Click Save for Photo Only
  const handleSavePhotoOnly = async () => {
    setPhotoSaving(true);
    setFeedback(null);
    try {
      const res = await updateProfile({
        photo_url: customPhotoUrl,
        nid_photo_url: customPhotoUrl,
      });
      setPhotoSaving(false);
      if (res.success) {
        setFeedback({
          type: 'success',
          message: isBn
            ? 'প্রোফাইল ছবি সফলভাবে হালনাগাদ হয়েছে! ড্যাশবোর্ডের উপরে ডানপাশে এবং সাইডবারে নতুন ছবি প্রদর্শিত হচ্ছে।'
            : 'Profile photo updated successfully! New photo is now displayed in the top-right header and sidebar.',
        });
      } else {
        setFeedback({
          type: 'error',
          message: isBn ? (res.message_bn || 'ছবি সংরক্ষণ ব্যর্থ হয়েছে।') : (res.message_en || 'Failed to save photo.'),
        });
      }
    } catch (err: any) {
      setPhotoSaving(false);
      setFeedback({
        type: 'error',
        message: err.message || 'Error saving photo',
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setFeedback(null);

    const payload: any = {
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
      setFeedback({
        type: 'success',
        message: isBn ? (res.message_bn || 'প্রোফাইল তথ্য ও ছবি সফলভাবে হালনাগাদ হয়েছে।') : (res.message_en || 'Profile and photo updated successfully.'),
      });
    } else {
      setFeedback({
        type: 'error',
        message: isBn ? (res.message_bn || 'হালনাগাদ ব্যর্থ হয়েছে।') : (res.message_en || 'Failed to update profile.'),
      });
    }
  };

  const roleBadge = () => {
    const r = (user?.role || '').toLowerCase();
    if (r === 'union_officer') {
      return {
        labelBn: 'ইউনিয়ন ভূমি সহকারী কর্মকর্তা',
        labelEn: 'Union Land Assistant Officer',
        theme: 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950/70 dark:text-emerald-300',
      };
    }
    if (r === 'ac_land') {
      return {
        labelBn: 'সহকারী কমিশনার (ভূমি) / AC Land',
        labelEn: 'Assistant Commissioner (Land)',
        theme: 'bg-indigo-100 text-indigo-800 border-indigo-300 dark:bg-indigo-950/70 dark:text-indigo-300',
      };
    }
    if (r === 'sub_registrar') {
      return {
        labelBn: 'সাব-রেজিস্ট্রার / Sub-Registrar',
        labelEn: 'Sub-Registrar',
        theme: 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950/70 dark:text-amber-300',
      };
    }
    return {
      labelBn: 'কেন্দ্রীয় সুপার অ্যাডমিন',
      labelEn: 'Central Super Admin',
      theme: 'bg-cyan-100 text-cyan-800 border-cyan-300 dark:bg-cyan-950/70 dark:text-cyan-300',
    };
  };

  const badge = roleBadge();

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Top Banner */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="p-2.5 bg-slate-100 dark:bg-slate-800 rounded-xl text-slate-700 dark:text-slate-300">
              <User className="w-6 h-6" />
            </span>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                {isBn ? 'কর্মকর্তা প্রোফাইল ও সেটিংস' : 'Officer Profile & Settings'}
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {isBn
                  ? 'আপনার যোগাযোগের বিবরণ ও অফিসিয়াল পরিচয় ছবি হালনাগাদ করুন'
                  : 'Manage and update your contact credentials and official identification photo'}
              </p>
            </div>
          </div>
          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${badge.theme}`}>
            <Shield className="w-3.5 h-3.5" />
            <span>{isBn ? badge.labelBn : badge.labelEn}</span>
          </span>
        </div>
      </div>

      {feedback && (
        <div
          className={`p-4 rounded-xl text-xs font-semibold flex items-center gap-2 border ${
            feedback.type === 'success'
              ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-200 border-emerald-300 dark:border-emerald-800'
              : 'bg-rose-50 dark:bg-rose-950/60 text-rose-900 dark:text-rose-200 border-rose-300 dark:border-rose-800'
          }`}
        >
          {feedback.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
          <span>{feedback.message}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 1. Official Photo Management Card */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Camera className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                {isBn ? 'অফিসিয়াল প্রোফাইল ছবি পরিবর্তন ও ডিভাইস থেকে আপলোড' : 'Official Profile Photo & Device Upload'}
              </h2>
            </div>
            <span className="text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-800 inline-flex items-center gap-1.5 self-start sm:self-auto">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              {isBn ? 'শীর্ষ ডানপাশে ও সাইডবারে সরাসরি দৃশ্যমান' : 'Live in Top-Right Header & Sidebar'}
            </span>
          </div>

          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            {/* Current Photo Frame with Overlay */}
            <div className="relative group shrink-0">
              <div className="w-32 h-32 sm:w-36 sm:h-36 rounded-2xl overflow-hidden ring-4 ring-emerald-500/30 dark:ring-emerald-500/20 shadow-lg bg-slate-50 dark:bg-slate-800">
                <img
                  src={customPhotoUrl || getUserAvatarUrl(user) || '/avatars/officer_kamal_union.jpg'}
                  alt={user?.name_bn || 'Officer'}
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = '/avatars/officer_kamal_union.jpg';
                  }}
                  className="w-full h-full object-cover transition-transform group-hover:scale-105"
                />
              </div>
              <label
                htmlFor="photo-upload-input"
                className="absolute inset-0 bg-black/40 hover:bg-black/60 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white cursor-pointer"
                title={isBn ? 'ডিভাইস থেকে নতুন ছবি আপলোড করুন' : 'Upload photo from device'}
              >
                <Upload size={22} />
                <span className="text-[11px] font-bold mt-1.5">{isBn ? 'ছবি পরিবর্তন' : 'Change Photo'}</span>
              </label>
              <input
                id="photo-upload-input"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handlePhotoUpload}
              />
              <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full" />
            </div>

            {/* Photo Upload Controls & Presets */}
            <div className="flex-1 w-full space-y-4">
              <div>
                <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 mb-1 flex items-center gap-1.5">
                  <Upload size={14} className="text-emerald-600" />
                  <span>{isBn ? 'ডিভাইস থেকে ফাইল আপলোড করুন (Device Photo Reupload)' : 'Upload From Your Device'}</span>
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                  {isBn
                    ? 'আপনার মোবাইল, কম্পিউটার বা ল্যাপটপ থেকে সরাসরি পাসপোর্ট সাইজের ছবি (JPG, PNG, WebP) নির্বাচন করুন। সাইজ সর্বোচ্চ ৫ মেগাবাইট।'
                    : 'Select a clear passport portrait photograph (JPG, PNG, WebP) directly from your device. Max 5MB.'}
                </p>

                <div className="mt-3 flex flex-wrap items-center gap-2.5">
                  <label
                    htmlFor="photo-upload-input"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold cursor-pointer transition shadow-sm active:scale-95"
                  >
                    <Upload size={15} />
                    <span>{isBn ? 'ডিভাইস থেকে ছবি বেছে নিন' : 'Browse from Device'}</span>
                  </label>

                  {/* 1-Click Save Photo Button */}
                  <button
                    type="button"
                    onClick={handleSavePhotoOnly}
                    disabled={photoSaving}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-black dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 rounded-xl text-xs font-bold cursor-pointer transition shadow-sm active:scale-95 disabled:opacity-50"
                  >
                    {photoSaving ? (
                      <div className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <CheckCircle2 size={15} className="text-emerald-400 dark:text-emerald-600" />
                    )}
                    <span>{photoSaving ? (isBn ? 'সংরক্ষণ হচ্ছে...' : 'Saving...') : (isBn ? 'ছবি এখনই সংরক্ষণ করুন' : 'Save Photo Now')}</span>
                  </button>

                  {customPhotoUrl !== getUserAvatarUrl(user) && (
                    <button
                      type="button"
                      onClick={() => setCustomPhotoUrl(getUserAvatarUrl(user) || '')}
                      className="inline-flex items-center gap-1 px-3 py-2 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 text-xs font-semibold cursor-pointer rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                    >
                      <RotateCcw size={13} />
                      <span>{isBn ? 'রিসেট' : 'Reset'}</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Top-Right Header Live Preview Card */}
              <div className="p-3.5 bg-slate-50 dark:bg-slate-850/80 rounded-xl border border-slate-200 dark:border-slate-800">
                <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-2">
                  {isBn ? 'ড্যাশবোর্ড হেডার প্রিভিউ (Top-Right Live Preview):' : 'Header Live Preview (Top-Right):'}
                </span>
                <div className="inline-flex items-center gap-3 p-2 px-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-2xs">
                  <div className="text-right">
                    <p className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                      {isBn ? (user?.name_bn || 'কর্মকর্তা') : (user?.name_en || 'Officer')}
                    </p>
                    <p className="text-[10px] text-emerald-700 dark:text-emerald-400 font-semibold leading-tight">
                      {isBn ? (user?.designation_bn || badge.labelBn) : (user?.designation_en || badge.labelEn)}
                    </p>
                  </div>
                  <div className="relative shrink-0">
                    <img
                      src={customPhotoUrl || getUserAvatarUrl(user) || '/avatars/officer_kamal_union.jpg'}
                      alt="Header Preview"
                      className="w-9 h-9 rounded-xl object-cover ring-2 ring-emerald-500/50 shadow-2xs"
                    />
                    <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full" />
                  </div>
                </div>
              </div>

              {/* Ready Official Presets */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
                <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-2">
                  {isBn ? 'অথবা সরকারি অফিসিয়াল পোর্ট্রেট প্রিসেট থেকে নির্বাচন করুন:' : 'Or Select From Ready Officer Presets:'}
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {AVAILABLE_AVATAR_PRESETS.map((preset) => {
                    const isSelected = customPhotoUrl === preset.url;
                    return (
                      <button
                        type="button"
                        key={preset.id}
                        onClick={() => handleSelectPreset(preset.url)}
                        className={`p-2 rounded-xl border flex flex-col items-center gap-1.5 text-center transition cursor-pointer ${
                          isSelected
                            ? 'border-emerald-500 bg-emerald-50/70 dark:bg-emerald-950/40 ring-1 ring-emerald-500'
                            : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
                        }`}
                      >
                        <img
                          src={preset.url}
                          alt={preset.labelBn}
                          className="w-12 h-12 rounded-lg object-cover ring-1 ring-slate-200 dark:ring-slate-700"
                        />
                        <span className="text-[10px] font-medium text-slate-700 dark:text-slate-300 line-clamp-1">
                          {isBn ? preset.labelBn : preset.labelEn}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 2. Contact Information Card */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
            <Phone className="w-5 h-5 text-slate-600 dark:text-slate-400" />
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">
              {isBn ? 'যোগাযোগের তথ্য হালনাগাদ' : 'Contact Information'}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">
                {isBn ? 'মোবাইল নম্বর (১১ ডিজিট):' : 'Mobile Number (11 digits):'}
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  placeholder="017xxxxxxxx"
                  required
                />
                <Phone size={14} className="absolute right-3 top-3 text-slate-400" />
              </div>
            </div>

            <div>
              <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">
                {isBn ? 'অফিসিয়াল ইমেইল ঠিকানা:' : 'Official Email Address:'}
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  placeholder="officer@bhumisathi.gov.bd"
                  required
                />
                <Mail size={14} className="absolute right-3 top-3 text-slate-400" />
              </div>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">
                {isBn ? 'অফিস / বর্তমান ঠিকানা:' : 'Official / Residential Address:'}
              </label>
              <div className="relative">
                <textarea
                  rows={2}
                  value={addressBn}
                  onChange={(e) => setAddressBn(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  placeholder="বাড়ি / ব্লক / রোড / এরিয়া"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">
                {isBn ? 'কর্মস্থল জেলা:' : 'Duty District:'}
              </label>
              <input
                type="text"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">
                {isBn ? 'উপজেলা / সার্কেল:' : 'Upazila / Revenue Circle:'}
              </label>
              <input
                type="text"
                value={upazila}
                onChange={(e) => setUpazila(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>
          </div>
        </div>

        {/* 3. Official Identity Credentials (Read-only System Verification) */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
            <IdCard className="w-5 h-5 text-slate-600 dark:text-slate-400" />
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">
              {isBn ? 'পদবি ও প্রশাসনিক পরিচয় বিবরণ' : 'Designation & Official Details'}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700/80">
              <span className="text-slate-500 dark:text-slate-400 block">{isBn ? 'পূর্ণ নাম:' : 'Full Name:'}</span>
              <strong className="text-slate-900 dark:text-white text-sm">{user?.name_bn || 'নাম অপ্রাপ্ত'}</strong>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700/80">
              <span className="text-slate-500 dark:text-slate-400 block">{isBn ? 'দাপ্তরিক পদবি:' : 'Designation:'}</span>
              <strong className="text-slate-900 dark:text-white text-sm">{user?.designation_bn || badge.labelBn}</strong>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700/80">
              <span className="text-slate-500 dark:text-slate-400 block">{isBn ? 'কর্মকর্তা আইডি:' : 'Employee/System ID:'}</span>
              <strong className="text-slate-900 dark:text-white font-mono text-sm">{user?.citizen_id || user?.id}</strong>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700/80">
              <span className="text-slate-500 dark:text-slate-400 block">{isBn ? 'জাতীয় পরিচয়পত্র (NID):' : 'National ID:'}</span>
              <strong className="text-slate-900 dark:text-white font-mono text-sm">{user?.nid_no || '১৯৮৫২৬৯১০২৯৩৮৪৭৫৬'}</strong>
            </div>

            <div className="sm:col-span-2 p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700/80">
              <span className="text-slate-500 dark:text-slate-400 block">{isBn ? 'কার্যালয় / বিচারিক অধিক্ষেত্র:' : 'Office / Jurisdiction:'}</span>
              <strong className="text-slate-900 dark:text-white">
                {user?.office_name_bn || (isBn ? 'ভূমি মন্ত্রণালয় কেন্দ্রীয় দপ্তর' : 'Ministry of Land Central Core')}
              </strong>
            </div>
          </div>
        </div>

        {/* Action Save Button */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm transition transform active:scale-95 disabled:opacity-50 cursor-pointer"
          >
            {saving ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Save size={16} />}
            <span>{saving ? (isBn ? 'সংরক্ষণ হচ্ছে...' : 'Saving...') : (isBn ? 'পরিবর্তন সংরক্ষণ করুন' : 'Save Changes')}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default OfficerProfilePage;
