import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { UserCheck, Shield, Building2, Scale, FileText, User } from 'lucide-react';

export const DemoPersonaBar: React.FC = () => {
  const { user, switchDemoPersona, logout } = useAuth();

  const personas = [
    { id: 'seller', label: 'বিক্রেতা (রফিকুল)', role: 'citizen', icon: User },
    { id: 'buyer', label: 'ক্রেতা (ফারহান)', role: 'citizen', icon: UserCheck },
    { id: 'taxdue', label: 'কর বকেয়া (লতিফ)', role: 'citizen', icon: FileText },
    { id: 'oversell', label: 'অতিরিক্ত হিস্যা (নজরুল)', role: 'citizen', icon: FileText },
    { id: 'union_officer', label: 'ইউনিয়ন কর্মকর্তা', role: 'union_officer', icon: Building2 },
    { id: 'ac_land', label: 'এসি ল্যান্ড', role: 'ac_land', icon: Scale },
    { id: 'sub_registrar', label: 'সাব-রেজিস্ট্রার', role: 'sub_registrar', icon: FileText },
    { id: 'central_admin', label: 'সিস্টেম অ্যাডমিন', role: 'central_admin', icon: Shield },
  ];

  return (
    <div className="bg-slate-900 text-slate-200 text-xs border-b border-slate-800 py-1.5 px-4 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 bg-teal-500/20 text-teal-300 px-2 py-0.5 rounded font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse"></span>
            ডেমো মোড
          </span>
          <span className="hidden sm:inline text-slate-400">
            ১-ক্লিকে ভূমিকা পরিবর্তন করুন:
          </span>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto py-0.5 scrollbar-none">
          {personas.map((p) => {
            const Icon = p.icon;
            const isActive =
              (p.role === 'citizen' && user?.id?.includes(p.id)) ||
              (p.role !== 'citizen' && user?.role === p.role);

            return (
              <button
                key={p.id}
                onClick={() => switchDemoPersona(p.id, p.role)}
                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded transition-colors whitespace-nowrap font-medium ${
                  isActive
                    ? 'bg-teal-600 text-white shadow-sm ring-1 ring-teal-400'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
                }`}
                title={`${p.label} হিসেবে সুইচ করুন`}
              >
                <Icon size={12} />
                <span>{p.label}</span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          {user ? (
            <div className="flex items-center gap-2">
              <span className="text-slate-300 font-semibold bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
                {user.name_bn} ({user.role})
              </span>
              <button
                onClick={logout}
                className="text-slate-400 hover:text-red-400 underline transition-colors"
              >
                লগআউট
              </button>
            </div>
          ) : (
            <span className="text-slate-400 italic">লগইন নেই</span>
          )}
        </div>
      </div>
    </div>
  );
};
