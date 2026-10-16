import React from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  ShieldAlert,
  Users,
  UserCog,
  FileSpreadsheet,
  Activity,
  History,
  LayoutDashboard,
  Building,
  Settings
} from 'lucide-react';

export const AdminOfficeLayout: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path || location.pathname.startsWith(path + '/');

  const navItems = [
    { path: '/admin/dashboard', label: 'সিস্টেম ড্যাশবোর্ড', icon: LayoutDashboard },
    { path: '/admin/users', label: 'নাগরিক ও কেওয়াইসি নিরীক্ষা', icon: Users },
    { path: '/admin/roles', label: 'কর্মকর্তা ও পদবি বরাদ্দ', icon: UserCog },
    { path: '/admin/applications', label: 'সামগ্রিক আবেদন ট্র্যাকার', icon: FileSpreadsheet },
    { path: '/admin/audit-logs', label: 'অডিট ও ট্র্যাকিং লগ', icon: History },
    { path: '/admin/monitoring', label: 'সিস্টেম মনিটরিং ও ব্যাকআপ', icon: Activity },
  ];

  return (
    <div className="min-h-screen bg-slate-100 font-bengali flex flex-col">
      {/* Top Banner */}
      <div className="bg-slate-950 text-white border-b border-slate-800 py-4 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-cyan-700 text-white flex items-center justify-center font-bold text-xl shadow-md border border-cyan-500">
              <ShieldAlert size={24} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-white tracking-tight">ভূমি মন্ত্রণালয় — কেন্দ্রীয় প্রশাসনিক কনসোল</h1>
                <span className="bg-cyan-500/20 text-cyan-300 text-[10px] font-semibold px-2 py-0.5 rounded border border-cyan-500/30">
                  সুপার অ্যাডমিন প্ল্যাটফর্ম
                </span>
              </div>
              <p className="text-xs text-slate-300">
                ভূমিসেবা সিস্টেম গভর্নেন্স, রোল ম্যানেজমেন্ট ও ন্যাশনাল ট্রানজ্যাকশন অডিট
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs bg-slate-900/90 p-2.5 rounded-lg border border-slate-800">
            <div>
              <p className="text-slate-400 text-[11px]">প্রশাসক:</p>
              <p className="font-semibold text-white">{user?.name_bn || 'সিস্টেম অ্যাডমিনিস্ট্রেটর'}</p>
            </div>
            <div className="border-l border-slate-800 pl-3">
              <p className="text-slate-400 text-[11px]">কর্তৃত্ব স্তর:</p>
              <p className="font-semibold text-cyan-400">সেন্ট্রাল অ্যাডমিন (পূর্ণ নিয়ন্ত্রণ)</p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Bar */}
      <div className="bg-white border-b border-slate-200 sticky top-[73px] z-30 shadow-xs">
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
                      ? 'bg-cyan-800 text-white shadow-2xs'
                      : 'text-slate-600 hover:text-cyan-900 hover:bg-cyan-50'
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

export default AdminOfficeLayout;
