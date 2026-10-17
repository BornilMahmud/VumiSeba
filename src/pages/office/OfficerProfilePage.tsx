import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { getUserAvatarUrl } from '../../utils/userUtils';
import {
  User,
  Mail,
  Phone,
  Building2,
  Shield,
  CheckCircle2,
  AlertCircle,
  Save,
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

  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

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
    };

    const res = await updateProfile(payload);
    setSaving(false);
    if (res.success) {
      setFeedback({
        type: 'success',
        message: isBn ? (res.message_bn || 'প্রোফাইল তথ্য সফলভাবে হালনাগাদ হয়েছে।') : (res.message_en || 'Profile information updated successfully.'),
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
          <div className="flex items-center gap-3.5">
            <div className="relative shrink-0">
              <img
                src={getUserAvatarUrl(user) || '/avatars/officer_kamal_union.jpg'}
                alt={user?.name_bn || 'Officer'}
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = '/avatars/officer_kamal_union.jpg';
                }}
                className="w-14 h-14 rounded-2xl object-cover ring-2 ring-emerald-500/40 shadow-sm"
              />
              <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                {isBn ? (user?.name_bn || 'কর্মকর্তা প্রোফাইল ও সেটিংস') : (user?.name_en || 'Officer Profile & Settings')}
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {isBn
                  ? 'আপনার যোগাযোগের বিবরণ ও অফিসিয়াল তথ্য হালনাগাদ করুন'
                  : 'Manage and update your contact credentials and official information'}
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
        {/* 1. Contact Information Card */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
            <Phone className="w-5 h-5 text-slate-600 dark:text-slate-400" />
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">
              {isBn ? '১. যোগাযোগের তথ্য হালনাগাদ' : '1. Contact Information'}
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

        {/* 2. Official Identity Credentials (Read-only System Verification) */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
            <IdCard className="w-5 h-5 text-slate-600 dark:text-slate-400" />
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">
              {isBn ? '২. পদবি ও প্রশাসনিক পরিচয় বিবরণ' : '2. Designation & Official Details'}
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
