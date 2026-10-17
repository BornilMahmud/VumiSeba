import React from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  FileText,
  Calendar,
  CheckCircle2,
  FolderCheck,
  History,
  LayoutDashboard,
  Stamp,
  ClipboardList
} from 'lucide-react';

export const RegistryOfficeLayout: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path || location.pathname.startsWith(path + '/');

  const navItems = [
    { path: '/office/registry/dashboard', label: 'ড্যাশবোর্ড', icon: LayoutDashboard },
    { path: '/office/registry/applications', label: 'রেজিস্ট্রেশন শিডিউলিং কিউ', icon: ClipboardList },
    { path: '/office/registry/appointments', label: 'নির্ধারিত অ্যাপয়েন্টমেন্ট', icon: Calendar },
    { path: '/office/registry/documents', label: 'দলিল ও স্ট্যাম্প নিরীক্ষা', icon: FolderCheck },
    { path: '/office/registry/completed', label: 'রেজিস্ট্রিকৃত কবলা বালাম', icon: CheckCircle2 },
    { path: '/office/registry/history', label: 'রেজিস্ট্রি ইতিহাস', icon: History },
  ];

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 font-bengali flex flex-col transition-colors duration-200">
      {/* Top Banner */}
      <div className="bg-amber-950 text-white border-b border-amber-900 py-4 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-amber-600 text-white flex items-center justify-center font-bold text-xl shadow-md border border-amber-500">
              <Stamp size={24} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-white tracking-tight">সাব-রেজিস্ট্রি কার্যালয় (Sub-Registry Office)</h1>
                <span className="bg-amber-500/20 text-amber-300 text-[10px] font-semibold px-2 py-0.5 rounded border border-amber-500/30">
                  দলিল সম্পাদন, বালাম ও নিবন্ধন অধিদপ্তর
                </span>
              </div>
              <p className="text-xs text-amber-200/80">
                {user?.office_name_bn || 'গুলশান সাব-রেজিস্ট্রার কার্যালয়, ঢাকা নিবন্ধন কমপ্লেক্স'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs bg-amber-900/60 p-2.5 rounded-lg border border-amber-800">
            <div>
              <p className="text-amber-300/70 text-[11px]">দায়িত্বরত নিবন্ধক:</p>
              <p className="font-semibold text-white">{user?.name_bn || 'মো: আব্দুর রশিদ'}</p>
            </div>
            <div className="border-l border-amber-800 pl-3">
              <p className="text-amber-300/70 text-[11px]">পদবি:</p>
              <p className="font-semibold text-amber-300">{user?.designation_bn || 'সাব-রেজিস্ট্রার (Sub-Registrar)'}</p>
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
                      ? 'bg-amber-700 text-white shadow-2xs'
                      : 'text-slate-600 dark:text-slate-300 hover:text-amber-900 dark:hover:text-amber-400 hover:bg-amber-50 dark:hover:bg-slate-800'
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

export default RegistryOfficeLayout;
