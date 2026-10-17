import React from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Building2,
  ClipboardList,
  CheckCircle2,
  FileSearch,
  FileCheck2,
  History,
  LayoutDashboard,
  ShieldAlert,
  FolderOpen
} from 'lucide-react';

export const UnionOfficeLayout: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path || location.pathname.startsWith(path + '/');

  const navItems = [
    { path: '/office/union/dashboard', label: 'ড্যাশবোর্ড', icon: LayoutDashboard },
    { path: '/office/union/applications', label: 'আবেদন যাচাই কিউ', icon: ClipboardList },
    { path: '/office/union/tax-verification', label: 'কর ও দাখিলা যাচাই', icon: CheckCircle2 },
    { path: '/office/union/record-verification', label: 'রেকর্ড ও দাগ যাচাই', icon: FileSearch },
    { path: '/office/union/reports', label: 'সরেজমিন প্রতিবেদন', icon: FileCheck2 },
    { path: '/office/union/history', label: 'তদন্ত ইতিহাস', icon: History },
  ];

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 font-bengali flex flex-col transition-colors duration-200">
      {/* Top Banner */}
      <div className="bg-emerald-950 text-white border-b border-emerald-900 py-4 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-xl shadow-md border border-emerald-500">
              <Building2 size={24} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-white tracking-tight">ইউনিয়ন ভূমি অফিস (তহশিল)</h1>
                <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-semibold px-2 py-0.5 rounded border border-emerald-500/30">
                  স্থানীয় স্বত্ব নিরীক্ষা
                </span>
              </div>
              <p className="text-xs text-emerald-200/80">
                {user?.office_name_bn || 'বাড্ডা ও সাঁতারকুল ইউনিয়ন ভূমি অফিস, গুলশান রাজস্ব সার্কেল'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs bg-emerald-900/60 p-2.5 rounded-lg border border-emerald-800">
            <div>
              <p className="text-emerald-300/70 text-[11px]">দায়িত্বরত কর্মকর্তা:</p>
              <p className="font-semibold text-white">{user?.name_bn || 'মোহাম্মদ কামাল হোসেন'}</p>
            </div>
            <div className="border-l border-emerald-800 pl-3">
              <p className="text-emerald-300/70 text-[11px]">পদবি:</p>
              <p className="font-semibold text-emerald-300">{user?.designation_bn || 'ইউনিয়ন ভূমি সহকারী কর্মকর্তা (ULAO)'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Bar */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-30 shadow-xs transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-1 overflow-x-auto py-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                    active
                      ? 'bg-emerald-600 text-white shadow-2xs'
                      : 'text-slate-600 dark:text-slate-300 hover:text-emerald-800 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <Icon size={15} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Page Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {children || <Outlet />}
      </main>
    </div>
  );
};

export default UnionOfficeLayout;
