import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Lock, Mail, ArrowRight, UserCheck, Shield, Building2, Scale, User, FileText } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { login, switchDemoPersona, user } = useAuth();
  const navigate = useNavigate();

  // If already logged in, redirect
  React.useEffect(() => {
    if (user) {
      if (user.role === 'citizen') navigate('/citizen');
      else if (user.role === 'union_officer') navigate('/officer/union-land');
      else if (user.role === 'ac_land') navigate('/officer/ac-land');
      else if (user.role === 'sub_registrar') navigate('/officer/registry');
      else if (user.role === 'central_admin') navigate('/admin');
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const res = await login({ email, password });
    if (!res.success) {
      setError(res.message_bn || 'লগইন ব্যর্থ হয়েছে। তথ্য যাচাই করুন।');
    }
    setLoading(false);
  };

  const handleDemoClick = async (persona: string, role?: string) => {
    setLoading(true);
    await switchDemoPersona(persona, role);
    setLoading(false);
  };

  return (
    <div className="font-bengali min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-md w-full space-y-6">
        {/* Header */}
        <div className="text-center">
          <div className="w-12 h-12 rounded-xl bg-gov-blue text-white flex items-center justify-center font-bold text-2xl mx-auto shadow-md mb-3">
            🏛️
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            ভূমিসাথী পোর্টালে প্রবেশ
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            নাগরিক ও কর্মকর্তা সমন্বিত প্রবেশদ্বার
          </p>
        </div>

        {/* 1-Click Fast Demo Login for Judges */}
        <div className="bg-teal-50 border border-teal-300 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-teal-900 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse"></span>
              হ্যাকাথন ১-ক্লিক ডেমো অ্যাকাউন্ট:
            </span>
            <span className="text-[10px] text-teal-700 font-semibold bg-white px-1.5 py-0.5 rounded border border-teal-200">
              পাসওয়ার্ড অটো-ফিল
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              type="button"
              onClick={() => handleDemoClick('seller')}
              className="p-2 rounded bg-white hover:bg-teal-100 text-slate-800 font-medium border border-teal-200 flex items-center gap-1.5 transition text-left"
            >
              <User size={14} className="text-teal-700" />
              <div>
                <span className="font-bold block">বিক্রেতা (রফিকুল)</span>
                <span className="text-[10px] text-slate-500">Citizen Seller</span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleDemoClick('buyer')}
              className="p-2 rounded bg-white hover:bg-teal-100 text-slate-800 font-medium border border-teal-200 flex items-center gap-1.5 transition text-left"
            >
              <UserCheck size={14} className="text-teal-700" />
              <div>
                <span className="font-bold block">ক্রেতা (ফারহান)</span>
                <span className="text-[10px] text-slate-500">Citizen Buyer</span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleDemoClick('union_officer', 'union_officer')}
              className="p-2 rounded bg-white hover:bg-teal-100 text-slate-800 font-medium border border-teal-200 flex items-center gap-1.5 transition text-left"
            >
              <Building2 size={14} className="text-indigo-700" />
              <div>
                <span className="font-bold block">ইউনিয়ন কর্মকর্তা</span>
                <span className="text-[10px] text-slate-500">ULAO বাড্ডা</span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleDemoClick('ac_land', 'ac_land')}
              className="p-2 rounded bg-white hover:bg-teal-100 text-slate-800 font-medium border border-teal-200 flex items-center gap-1.5 transition text-left"
            >
              <Scale size={14} className="text-purple-700" />
              <div>
                <span className="font-bold block">এসি ল্যান্ড</span>
                <span className="text-[10px] text-slate-500">সহকারী কমিশনার</span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleDemoClick('sub_registrar', 'sub_registrar')}
              className="p-2 rounded bg-white hover:bg-teal-100 text-slate-800 font-medium border border-teal-200 flex items-center gap-1.5 transition text-left"
            >
              <FileText size={14} className="text-emerald-700" />
              <div>
                <span className="font-bold block">সাব-রেজিস্ট্রার</span>
                <span className="text-[10px] text-slate-500">গুলশান অফিস</span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleDemoClick('central_admin', 'central_admin')}
              className="p-2 rounded bg-white hover:bg-teal-100 text-slate-800 font-medium border border-teal-200 flex items-center gap-1.5 transition text-left"
            >
              <Shield size={14} className="text-blue-700" />
              <div>
                <span className="font-bold block">সিস্টেম অ্যাডমিন</span>
                <span className="text-[10px] text-slate-500">ভূমি প্রশাসন</span>
              </div>
            </button>
          </div>
        </div>

        {/* Regular Login Form */}
        <div className="bg-white rounded-xl shadow-gov-sm border border-slate-200 p-6 space-y-4">
          {error && (
            <div className="bg-red-50 text-red-800 text-xs p-3 rounded-lg border border-red-200 font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">ইমেইল ঠিকানা</label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 text-slate-400" size={16} />
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-md pl-9 p-2 text-slate-800 focus:ring-1 focus:ring-gov-blue"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">পাসওয়ার্ড</label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 text-slate-400" size={16} />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-md pl-9 p-2 text-slate-800 focus:ring-1 focus:ring-gov-blue"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gov-blue hover:bg-slate-900 text-white font-semibold py-2.5 rounded-md shadow-sm transition flex items-center justify-center gap-1.5 text-sm"
            >
              <span>{loading ? 'প্রবেশ করা হচ্ছে...' : 'লগইন করুন'}</span>
              <ArrowRight size={15} />
            </button>
          </form>

          <div className="pt-2 text-center text-xs text-slate-500 border-t">
            অ্যাকাউন্ট নেই?{' '}
            <Link to="/register" className="text-gov-blue font-bold hover:underline">
              নতুন নাগরিক নিবন্ধন করুন
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
