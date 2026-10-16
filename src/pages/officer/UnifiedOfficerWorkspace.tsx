import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  Building2, 
  Stamp, 
  Scale, 
  ShieldAlert, 
  Layers, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  ChevronRight,
  ArrowRight
} from 'lucide-react';

import UnionLandPage from './UnionLandPage';
import SubRegistryPage from './SubRegistryPage';
import AcLandPage from './AcLandPage';
import CentralAdminPage from './CentralAdminPage';

export type OfficerWorkspaceTab = 'UNION' | 'REGISTRY' | 'AC_LAND' | 'ADMIN';

export default function UnifiedOfficerWorkspace() {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Determine initial tab based on role or URL
  const getInitialTab = (): OfficerWorkspaceTab => {
    if (location.pathname.includes('union-land')) return 'UNION';
    if (location.pathname.includes('registry')) return 'REGISTRY';
    if (location.pathname.includes('ac-land')) return 'AC_LAND';
    if (location.pathname.includes('admin')) return 'ADMIN';

    const role = (user?.role || '').toLowerCase();
    if (role === 'union_officer' || role === 'union_land_officer') return 'UNION';
    if (role === 'sub_registrar') return 'REGISTRY';
    if (role === 'ac_land') return 'AC_LAND';
    return 'ADMIN';
  };

  const [activeTab, setActiveTab] = useState<OfficerWorkspaceTab>(getInitialTab());

  useEffect(() => {
    setActiveTab(getInitialTab());
  }, [location.pathname, user?.role]);

  const userRole = (user?.role || '').toLowerCase();
  const isAdmin = userRole === 'admin' || userRole === 'central_admin';

  return (
    <div className="space-y-6">
      {/* Scope Correction Institutional Header Banner */}
      <div className="bg-slate-900 text-white rounded-xl p-6 shadow-md border border-slate-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="p-1.5 bg-teal-500/20 text-teal-300 rounded-lg border border-teal-500/30">
                <Layers className="w-5 h-5" />
              </span>
              <h1 className="text-xl sm:text-2xl font-bold">
                সমন্বিত সরকারি কর্মকর্তা ও প্রশাসন ওয়ার্কস্পেস (Unified Land Governance)
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              ইউনিয়ন ভূমি অফিসের সরেজমিন তদন্ত, সাব-রেজিস্ট্রারের দলিল সম্পাদন, এসি ল্যান্ডের বিচারিক শুনানি এবং কেন্দ্রীয় নিরীক্ষা — একই সমন্বিত প্রশাসনিক কাঠামোর আওতাধীন।
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 bg-slate-800 border border-slate-700 text-slate-200 rounded-lg text-xs font-mono">
              বর্তমান ভূমিকা: <strong className="text-teal-400">{user?.name_bn || 'কর্মকর্তা'}</strong> ({user?.role})
            </span>
          </div>
        </div>

        {/* Administrative Custody Chain Progress Bar */}
        <div className="mt-6 pt-4 border-t border-slate-800 hidden sm:block">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
            প্রশাসনিক চেইন অফ কাস্টডি (Administrative Flow):
          </span>
          <div className="grid grid-cols-4 gap-2 text-xs">
            <div className={`p-2.5 rounded-lg border transition-all ${
              activeTab === 'UNION' ? 'bg-teal-950/80 border-teal-500 text-teal-300 font-bold' : 'bg-slate-800/60 border-slate-700 text-slate-400'
            }`}>
              ১. ইউনিয়ন ভূমি অফিস
              <span className="block text-[10px] text-slate-400 font-normal mt-0.5">তহশিলদার তদন্ত ও রিপোর্ট</span>
            </div>
            <div className={`p-2.5 rounded-lg border transition-all ${
              activeTab === 'REGISTRY' ? 'bg-teal-950/80 border-teal-500 text-teal-300 font-bold' : 'bg-slate-800/60 border-slate-700 text-slate-400'
            }`}>
              ২. সাব-রেজিস্ট্রি অফিস
              <span className="block text-[10px] text-slate-400 font-normal mt-0.5">দলিল সম্পাদন ও রেজিস্ট্রেশন</span>
            </div>
            <div className={`p-2.5 rounded-lg border transition-all ${
              activeTab === 'AC_LAND' ? 'bg-teal-950/80 border-teal-500 text-teal-300 font-bold' : 'bg-slate-800/60 border-slate-700 text-slate-400'
            }`}>
              ৩. এসি ল্যান্ড কোর্ট
              <span className="block text-[10px] text-slate-400 font-normal mt-0.5">শুনানি ও নতুন খতিয়ান আদেশ</span>
            </div>
            <div className={`p-2.5 rounded-lg border transition-all ${
              activeTab === 'ADMIN' ? 'bg-teal-950/80 border-teal-500 text-teal-300 font-bold' : 'bg-slate-800/60 border-slate-700 text-slate-400'
            }`}>
              ৪. কেন্দ্রীয় প্রশাসন
              <span className="block text-[10px] text-slate-400 font-normal mt-0.5">KYC ও অডিট লগ মনিটরিং</span>
            </div>
          </div>
        </div>
      </div>

      {/* Unified Tab Switcher Navigation */}
      <div className="bg-white rounded-xl border border-slate-200 p-2 shadow-sm flex flex-wrap gap-2">
        <button
          onClick={() => setActiveTab('UNION')}
          className={`flex-1 min-w-[200px] px-4 py-2.5 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all ${
            activeTab === 'UNION'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <Building2 className="w-4 h-4 text-emerald-500" />
          <span>ইউনিয়ন ভূমি সহকারী কর্মকর্তা (ULAO)</span>
        </button>

        <button
          onClick={() => setActiveTab('REGISTRY')}
          className={`flex-1 min-w-[200px] px-4 py-2.5 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all ${
            activeTab === 'REGISTRY'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <Stamp className="w-4 h-4 text-teal-500" />
          <span>সাব-রেজিস্ট্রি অফিস (Sub-Registry)</span>
        </button>

        <button
          onClick={() => setActiveTab('AC_LAND')}
          className={`flex-1 min-w-[200px] px-4 py-2.5 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all ${
            activeTab === 'AC_LAND'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <Scale className="w-4 h-4 text-amber-500" />
          <span>সহকারী কমিশনার ভূমি (AC Land)</span>
        </button>

        <button
          onClick={() => setActiveTab('ADMIN')}
          className={`flex-1 min-w-[200px] px-4 py-2.5 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all ${
            activeTab === 'ADMIN'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <ShieldAlert className="w-4 h-4 text-blue-500" />
          <span>কেন্দ্রীয় প্রশাসন ও অডিট (Admin)</span>
        </button>
      </div>

      {/* Render Active Queue Component with Context */}
      <div className="transition-all duration-200">
        {activeTab === 'UNION' && <UnionLandPage />}
        {activeTab === 'REGISTRY' && <SubRegistryPage />}
        {activeTab === 'AC_LAND' && <AcLandPage />}
        {activeTab === 'ADMIN' && <CentralAdminPage />}
      </div>
    </div>
  );
}
