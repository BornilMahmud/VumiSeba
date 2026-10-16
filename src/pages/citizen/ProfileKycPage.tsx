import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { UserCheck, Shield, CheckCircle2, AlertCircle, Sparkles, Copy, Check } from 'lucide-react';

export const ProfileKycPage: React.FC = () => {
  const { user, refreshProfile } = useAuth();
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleCopyCitizenId = () => {
    if (user?.citizen_id) {
      navigator.clipboard.writeText(user.citizen_id);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
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

  return (
    <div className="font-bengali space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900">নাগরিক প্রোফাইল ও কেওয়াইসি (KYC)</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          ইউনিক সিটিজেন আইডি ব্যবস্থাপনা ও জাতীয় পরিচয়পত্র যাচাইকরণ
        </p>
      </div>

      {message && (
        <div className="bg-emerald-50 text-emerald-900 border border-emerald-300 p-4 rounded-xl text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 size={16} />
          <span>{message}</span>
        </div>
      )}

      {/* Citizen ID Card */}
      <div className="bg-gradient-to-r from-gov-navy to-slate-900 text-white rounded-2xl p-6 shadow-md border border-slate-700">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <span className="text-xs font-bold text-teal-400 uppercase tracking-widest block mb-1">
              গণপ্রজাতন্ত্রী বাংলাদেশ সরকার | ডিজিটাল ভূমি সেবা
            </span>
            <h2 className="text-lg font-bold">ইউনিক সিটিজেন আইডি (Unique Citizen ID)</h2>
          </div>
          <span className={`px-2.5 py-1 rounded text-xs font-bold ${
            user?.kyc_status === 'verified'
              ? 'bg-teal-500/20 text-teal-300 border border-teal-400/40'
              : 'bg-amber-500/20 text-amber-300 border border-amber-400/40'
          }`}>
            {user?.kyc_status === 'verified' ? '✓ কেওয়াইসি অনুমোদিত' : 'অপেক্ষমাণ / অযাচাইকৃত'}
          </span>
        </div>

        <div className="py-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs text-slate-400 block mb-1 font-medium">নির্ধারিত সিটিজেন আইডি:</span>
            <div className="flex items-center gap-3">
              <span className="text-2xl sm:text-3xl font-mono font-extrabold text-teal-400 tracking-wider">
                {user?.citizen_id || 'ID বরাদ্দ হয়নি'}
              </span>
              {user?.citizen_id && (
                <button
                  onClick={handleCopyCitizenId}
                  className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                  title="কপি করুন"
                >
                  {copied ? <Check size={16} className="text-teal-400" /> : <Copy size={16} />}
                </button>
              )}
            </div>
          </div>

          {!user?.citizen_id || user?.kyc_status !== 'verified' ? (
            <button
              onClick={handleInstantKycVerify}
              disabled={loading}
              className="inline-flex items-center gap-2 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold px-4 py-2 rounded-lg text-xs shadow transition"
            >
              <Sparkles size={15} />
              <span>{loading ? 'যাচাই হচ্ছে...' : '১-ক্লিকে KYC অনুমোদন ও ID তৈরি করুন'}</span>
            </button>
          ) : null}
        </div>

        <p className="text-[11px] text-slate-400 pt-2 border-t border-slate-800">
          * ভূমি ক্রয়-বিক্রয় আবেদন ও নামজারি প্রক্রিয়ায় সরাসরি এনআইডি নম্বরের পরিবর্তে এই সুরক্ষিত সিটিজেন আইডি ব্যবহৃত হবে।
        </p>
      </div>

      {/* Citizen Personal Particulars Table */}
      <div className="bg-white rounded-xl shadow-gov-sm border border-slate-200 p-6 space-y-4">
        <h3 className="font-bold text-slate-900 text-sm border-b pb-2">নাগরিক পরিচয় তথ্যাবলী</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-3 bg-slate-50 rounded-lg border">
            <span className="text-slate-500 block">পূর্ণ নাম (বাংলায়):</span>
            <strong className="text-slate-900 text-sm">{user?.name_bn}</strong>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border">
            <span className="text-slate-500 block">Full Name (in English):</span>
            <strong className="text-slate-900 text-sm">{user?.name_en || 'Not provided'}</strong>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border">
            <span className="text-slate-500 block">জাতীয় পরিচয়পত্র নম্বর (NID):</span>
            <strong className="text-slate-900 font-mono text-sm">{user?.nid_no}</strong>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border">
            <span className="text-slate-500 block">নিবন্ধিত মোবাইল নম্বর:</span>
            <strong className="text-slate-900 font-mono text-sm">{user?.mobile}</strong>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border">
            <span className="text-slate-500 block">পিতার নাম:</span>
            <strong className="text-slate-900">{user?.father_name_bn}</strong>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border">
            <span className="text-slate-500 block">মাতার নাম:</span>
            <strong className="text-slate-900">{user?.mother_name_bn}</strong>
          </div>

          <div className="col-span-1 sm:col-span-2 p-3 bg-slate-50 rounded-lg border">
            <span className="text-slate-500 block">বর্তমান ঠিকানা:</span>
            <strong className="text-slate-900">{user?.address_bn}, {user?.upazila}, {user?.district}</strong>
          </div>
        </div>
      </div>
    </div>
  );
};
