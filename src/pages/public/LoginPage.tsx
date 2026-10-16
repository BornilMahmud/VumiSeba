import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Lock, Mail, ArrowRight, UserCheck, Shield, Building2, Scale, User, FileText, AlertCircle } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const { login, loginWithGoogle, switchDemoPersona, user, isFirebaseActive } = useAuth();
  const navigate = useNavigate();

  // Role-based routing after authentication
  React.useEffect(() => {
    if (user) {
      if (user.role === 'citizen') navigate('/citizen');
      else if (user.role === 'union_officer' || (user.role as string) === 'union_land_officer') navigate('/officer/union-land');
      else if (user.role === 'ac_land' || (user.role as string) === 'ac_land_officer') navigate('/officer/ac-land');
      else if (user.role === 'sub_registrar' || (user.role as string) === 'sub_registry_officer') navigate('/officer/registry');
      else if (user.role === 'central_admin' || (user.role as string) === 'admin') navigate('/officer');
      else navigate('/citizen');
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

  const handleGoogleSignIn = async () => {
    setError(null);
    setGoogleLoading(true);
    const res = await loginWithGoogle();
    if (!res.success) {
      setError(res.message_bn || 'গুগল সাইন-ইন সম্পন্ন করা সম্ভব হয়নি।');
    }
    setGoogleLoading(false);
  };

  const handleDemoClick = async (persona: string, role?: string) => {
    setError(null);
    setLoading(true);
    const res = await switchDemoPersona(persona, role);
    if (!res.success && res.message_bn) {
      setError(res.message_bn);
    }
    setLoading(false);
  };

  return (
    <div className="font-bengali min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-md w-full space-y-6">
        {/* Header */}
        <div className="text-center">
          <div className="w-14 h-14 rounded-2xl bg-gov-blue text-white flex items-center justify-center font-bold text-3xl mx-auto shadow-md mb-3 border border-slate-700">
            🏛️
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            ভূমিসাথী পোর্টালে প্রবেশ
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            বাংলাদেশ ডিজিটাল ভূমি সেবা, সত্যতা যাচাই ও স্মার্ট ই-নামজারি
          </p>
        </div>

        {/* 1. Working Demo Logins - MUST BE ABOVE GOOGLE SIGN-IN */}
        <div className="bg-gradient-to-br from-teal-50 to-emerald-50 border border-teal-200 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-xs font-bold text-teal-900 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-teal-600 animate-ping"></span>
              ১-ক্লিক ডেমো অ্যাকাউন্ট (পরীক্ষক ও বিচারকদের জন্য):
            </span>
            <span className="text-[10px] text-teal-800 font-semibold bg-white px-2 py-0.5 rounded-full border border-teal-300">
              নমুনা পরিচয়
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            {/* 1. Demo Citizen */}
            <button
              type="button"
              disabled={loading || googleLoading}
              onClick={() => handleDemoClick('seller')}
              className="p-2.5 rounded-lg bg-white hover:bg-teal-100/70 text-slate-800 font-medium border border-teal-200 flex items-center gap-2 transition text-left shadow-2xs hover:shadow-sm disabled:opacity-50"
            >
              <div className="w-7 h-7 rounded-md bg-teal-100 flex items-center justify-center text-teal-800 shrink-0">
                <User size={15} />
              </div>
              <div>
                <span className="font-bold block text-slate-900 leading-tight">১. ডেমো নাগরিক</span>
                <span className="text-[10px] text-teal-700 font-medium">বিক্রেতা রফিকুল / ফারহান</span>
              </div>
            </button>

            {/* 2. Demo Union Land Officer */}
            <button
              type="button"
              disabled={loading || googleLoading}
              onClick={() => handleDemoClick('union_officer', 'union_officer')}
              className="p-2.5 rounded-lg bg-white hover:bg-indigo-50 text-slate-800 font-medium border border-indigo-200 flex items-center gap-2 transition text-left shadow-2xs hover:shadow-sm disabled:opacity-50"
            >
              <div className="w-7 h-7 rounded-md bg-indigo-100 flex items-center justify-center text-indigo-800 shrink-0">
                <Building2 size={15} />
              </div>
              <div>
                <span className="font-bold block text-slate-900 leading-tight">২. ইউনিয়ন কর্মকর্তা</span>
                <span className="text-[10px] text-indigo-700 font-medium">ULAO বাড্ডা অফিস</span>
              </div>
            </button>

            {/* 3. Demo AC Land Officer */}
            <button
              type="button"
              disabled={loading || googleLoading}
              onClick={() => handleDemoClick('ac_land', 'ac_land')}
              className="p-2.5 rounded-lg bg-white hover:bg-purple-50 text-slate-800 font-medium border border-purple-200 flex items-center gap-2 transition text-left shadow-2xs hover:shadow-sm disabled:opacity-50"
            >
              <div className="w-7 h-7 rounded-md bg-purple-100 flex items-center justify-center text-purple-800 shrink-0">
                <Scale size={15} />
              </div>
              <div>
                <span className="font-bold block text-slate-900 leading-tight">৩. এসি ল্যান্ড</span>
                <span className="text-[10px] text-purple-700 font-medium">গুলশান রাজস্ব সার্কেল</span>
              </div>
            </button>

            {/* 4. Demo Sub-Registry Officer */}
            <button
              type="button"
              disabled={loading || googleLoading}
              onClick={() => handleDemoClick('sub_registrar', 'sub_registrar')}
              className="p-2.5 rounded-lg bg-white hover:bg-emerald-50 text-slate-800 font-medium border border-emerald-200 flex items-center gap-2 transition text-left shadow-2xs hover:shadow-sm disabled:opacity-50"
            >
              <div className="w-7 h-7 rounded-md bg-emerald-100 flex items-center justify-center text-emerald-800 shrink-0">
                <FileText size={15} />
              </div>
              <div>
                <span className="font-bold block text-slate-900 leading-tight">৪. সাব-রেজিস্ট্রার</span>
                <span className="text-[10px] text-emerald-700 font-medium">গুলশান সাব-রেজিস্ট্রি</span>
              </div>
            </button>

            {/* 5. Demo Admin / Review Officer */}
            <button
              type="button"
              disabled={loading || googleLoading}
              onClick={() => handleDemoClick('central_admin', 'central_admin')}
              className="p-2.5 rounded-lg bg-white hover:bg-blue-50 text-slate-800 font-medium border border-blue-200 flex items-center gap-2 transition text-left shadow-2xs hover:shadow-sm disabled:opacity-50 col-span-2"
            >
              <div className="w-7 h-7 rounded-md bg-blue-100 flex items-center justify-center text-blue-800 shrink-0">
                <Shield size={15} />
              </div>
              <div>
                <span className="font-bold block text-slate-900 leading-tight">৫. ভূমি প্রশাসন ও নিবন্ধন সুপারভাইজার (অ্যাডমিন)</span>
                <span className="text-[10px] text-blue-700 font-medium">কেন্দ্রীক পর্যালোচনা, কেওয়াইসি অনুমোদন ও সার্বিক অডিট</span>
              </div>
            </button>
          </div>
        </div>

        {/* 2. Google Sign-In Section */}
        <div className="bg-white rounded-xl shadow-gov-sm border border-slate-200 p-6 space-y-4">
          {error && (
            <div className="bg-red-50 text-red-800 text-xs p-3 rounded-lg border border-red-200 font-medium flex items-start gap-2">
              <AlertCircle size={16} className="text-red-600 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Prominent Google Sign-In Button */}
          <div>
            <button
              type="button"
              id="google-signin-btn"
              disabled={googleLoading || loading}
              onClick={handleGoogleSignIn}
              className="w-full bg-white hover:bg-slate-50 text-slate-700 font-bold py-2.5 px-4 rounded-lg border border-slate-300 shadow-xs transition flex items-center justify-center gap-3 text-sm disabled:opacity-60 disabled:cursor-not-allowed group"
            >
              {googleLoading ? (
                <div className="w-5 h-5 border-2 border-slate-400 border-t-gov-blue rounded-full animate-spin"></div>
              ) : (
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
              )}
              <span className="group-hover:text-slate-900">
                {googleLoading ? 'গুগলে সংযোগ করা হচ্ছে...' : 'Google দিয়ে প্রবেশ করুন'}
              </span>
            </button>
            <p className="text-[11px] text-slate-500 text-center mt-1.5">
              স্বয়ংক্রিয়ভাবে সাধারণ নাগরিক হিসেবে প্রোফাইল তৈরি হবে
            </p>
          </div>

          <div className="relative flex items-center justify-center">
            <div className="border-t border-slate-200 w-full"></div>
            <span className="bg-white px-3 text-[11px] text-slate-400 font-semibold absolute">
              অথবা ইমেইল দিয়ে প্রবেশ
            </span>
          </div>

          {/* Regular Login Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
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
              disabled={loading || googleLoading}
              className="w-full bg-gov-blue hover:bg-slate-900 text-white font-semibold py-2.5 rounded-md shadow-sm transition flex items-center justify-center gap-1.5 text-sm disabled:opacity-50"
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
