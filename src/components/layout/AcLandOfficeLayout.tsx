import React from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Landmark,
  ClipboardList,
  CalendarCheck,
  Scale,
  FileCheck,
  History,
  LayoutDashboard,
  Award
} from 'lucide-react';

export const AcLandOfficeLayout: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path || location.pathname.startsWith(path + '/');

  const navItems = [
    { path: '/office/ac-land/dashboard', label: 'ড্যাশবোর্ড', icon: LayoutDashboard },
    { path: '/office/ac-land/applications', label: 'প্রাক-রেজিস্ট্রেশন যাচাই', icon: ClipboardList },
    { path: '/office/ac-land/mutation', label: 'ই-নামজারি নথি (e-Mutation)', icon: Scale },
    { path: '/office/ac-land/hearings', label: 'শুনানি ব্যবস্থাপনা', icon: CalendarCheck },
    { path: '/office/ac-land/decisions', label: 'আদেশ ও সিদ্ধান্তসমূহ', icon: FileCheck },
    { path: '/office/ac-land/history', label: 'রেকর্ড ও সিদ্ধান্ত ইতিহাস', icon: History },
  ];

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 font-bengali flex flex-col transition-colors duration-200">
      {/* Top Banner */}
      <div className="bg-slate-900 text-white border-b border-indigo-950 py-4 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-xl shadow-md border border-indigo-500">
              <Landmark size={24} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-white tracking-tight">এসি ল্যান্ড অফিস (AC Land Office)</h1>
                <span className="bg-indigo-500/20 text-indigo-300 text-[10px] font-semibold px-2 py-0.5 rounded border border-indigo-500/30">
                  উপজেলা ভূমি প্রশাসন ও রাজস্ব আদালত
                </span>
              </div>
              <p className="text-xs text-indigo-200/80">
                {user?.office_name_bn || 'উপজেলা ভূমি অফিস, গুলশান রাজস্ব সার্কেল, ঢাকা'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs bg-slate-800/80 p-2.5 rounded-lg border border-slate-700">
            <div>
              <p className="text-indigo-300/70 text-[11px]">দায়িত্বরত বিচারক/কর্মকর্তা:</p>
              <p className="font-semibold text-white">{user?.name_bn || 'তানভীর আহমেদ'}</p>
            </div>
            <div className="border-l border-slate-700 pl-3">
              <p className="text-indigo-300/70 text-[11px]">পদবি:</p>
              <p className="font-semibold text-indigo-300">{user?.designation_bn || 'সহকারী কমিশনার (ভূমি) / AC Land'}</p>
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
                      ? 'bg-indigo-700 text-white shadow-2xs'
                      : 'text-slate-600 dark:text-slate-300 hover:text-indigo-800 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-slate-800'
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

export default AcLandOfficeLayout;
