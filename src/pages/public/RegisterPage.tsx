import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { UserPlus, ArrowRight, ShieldCheck } from 'lucide-react';

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
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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
    <div className="font-bengali min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 max-w-2xl mx-auto">
      <div className="bg-white rounded-2xl shadow-gov-sm border border-slate-200 p-8">
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-xl bg-teal-700 text-white flex items-center justify-center font-bold text-2xl mx-auto shadow-md mb-2">
            🏛️
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900">
            নতুন নাগরিক নিবন্ধন
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            ভূমিসেবা পোর্টালে সুরক্ষিত অ্যাকাউন্ট তৈরি করে ডিজিটাল ভূমি সেবা গ্রহণ করুন
          </p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-800 text-xs p-3 rounded-lg border border-red-200 font-medium mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">পূর্ণ নাম (বাংলায়) *</label>
              <input
                type="text"
                name="name_bn"
                required
                placeholder="যেমন: মোঃ আনিসুর রহমান"
                value={formData.name_bn}
                onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-300 rounded-md p-2 text-slate-800"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Full Name (in English) *</label>
              <input
                type="text"
                name="name_en"
                required
                placeholder="e.g. Md. Anisur Rahman"
                value={formData.name_en}
                onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-300 rounded-md p-2 text-slate-800"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">মোবাইল নম্বর (১১ ডিজিট) *</label>
              <input
                type="tel"
                name="mobile"
                required
                placeholder="01711XXXXXX"
                value={formData.mobile}
                onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-300 rounded-md p-2 text-slate-800"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">জাতীয় পরিচয়পত্র নম্বর (NID) *</label>
              <input
                type="text"
                name="nid_no"
                required
                placeholder="১০ বা ১৭ ডিজিট"
                value={formData.nid_no}
                onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-300 rounded-md p-2 text-slate-800 font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">পিতার নাম (বাংলায়) *</label>
              <input
                type="text"
                name="father_name_bn"
                required
                placeholder="পিতার নাম"
                value={formData.father_name_bn}
                onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-300 rounded-md p-2 text-slate-800"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">মাতার নাম (বাংলায়) *</label>
              <input
                type="text"
                name="mother_name_bn"
                required
                placeholder="মাতার নাম"
                value={formData.mother_name_bn}
                onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-300 rounded-md p-2 text-slate-800"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">বর্তমান ঠিকানা *</label>
            <input
              type="text"
              name="address_bn"
              required
              placeholder="বাড়ি/গ্রাম, রোড, এলাকা, জেলা"
              value={formData.address_bn}
              onChange={handleChange}
              className="w-full bg-slate-50 border border-slate-300 rounded-md p-2 text-slate-800"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">ইমেইল ঠিকানা *</label>
              <input
                type="email"
                name="email"
                required
                placeholder="example@domain.com"
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-300 rounded-md p-2 text-slate-800"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">পাসওয়ার্ড *</label>
              <input
                type="password"
                name="password"
                required
                placeholder="ন্যূনতম ৬ অক্ষর"
                value={formData.password}
                onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-300 rounded-md p-2 text-slate-800"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gov-blue hover:bg-slate-900 text-white font-semibold py-2.5 rounded-md shadow transition flex items-center justify-center gap-1.5 text-sm"
            >
              <UserPlus size={16} />
              <span>{loading ? 'নিবন্ধন হচ্ছে...' : 'নাগরিক অ্যাকাউন্ট তৈরি করুন'}</span>
            </button>
          </div>
        </form>

        <div className="mt-6 pt-4 text-center text-xs text-slate-500 border-t">
          ইতিমধ্যে নিবন্ধিত?{' '}
          <Link to="/login" className="text-gov-blue font-bold hover:underline">
            লগইন করুন
          </Link>
        </div>
      </div>
    </div>
  );
};
