import React from 'react';
import { Link, useLocation, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Building2,
  Scale,
  FileCheck2,
  ShieldAlert,
  LogOut,
  FolderKanban,
  ClipboardList,
  Users,
  History,
  CheckCircle,
} from 'lucide-react';

export const OfficerLayout: React.FC<{ children?: React.ReactNode; title?: string }> = ({ children, title }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path: string) => location.pathname === path;

  let panelTitle = title || 'সরকারি কর্মকর্তা প্যানেল';
  let officeDescription = 'ভূমি ব্যবস্থাপনা ও প্রশাসন';
  let menuItems: { path: string; label: string; icon: any }[] = [];

  if (user?.role === 'union_officer') {
    panelTitle = 'ইউনিয়ন ভূমি অফিস (তহশিল)';
    officeDescription = user.office_name_bn || 'বাড্ডা ও সাঁতারকুল ইউনিয়ন ভূমি অফিস';
    menuItems = [
      { path: '/officer/union-land', label: 'সরেজমিন তদন্ত ড্যাশবোর্ড', icon: ClipboardList },
      { path: '/search-land', label: 'খতিয়ান ও দাগ রেকর্ড', icon: FolderKanban },
      { path: '/citizen/tax', label: 'ভূমি উন্নয়ন কর ও দাখিলা অডিট', icon: CheckCircle },
    ];
  } else if (user?.role === 'ac_land') {
    panelTitle = 'সহকারী কমিশনার (ভূমি) এজলাস';
    officeDescription = user.office_name_bn || 'গুলশান রাজস্ব সার্কেল, ঢাকা';
    menuItems = [
      { path: '/officer/ac-land', label: 'ই-নামজারি কেস ও শুনানি ডকেট', icon: Scale },
      { path: '/search-land', label: 'রেকর্ডরুম ও দাগ সংরক্ষণ', icon: FolderKanban },
      { path: '/officer/union-land', label: 'তহশিল রিপোর্ট পর্যবেক্ষণ', icon: ClipboardList },
    ];
  } else if (user?.role === 'sub_registrar') {
    panelTitle = 'সাব-রেজিস্ট্রি অফিস ডকেট';
    officeDescription = user.office_name_bn || 'গুলশান সাব-রেজিস্ট্রি অফিস, নিবন্ধন পরিদপ্তর';
    menuItems = [
      { path: '/officer/registry', label: 'রেজিস্ট্রেশন অ্যাপয়েন্টমেন্ট ও দলিল ডকেট', icon: FileCheck2 },
      { path: '/search-land', label: 'মৌজা ও খতিয়ান ইনডেক্স', icon: FolderKanban },
    ];
  } else if (user?.role === 'central_admin') {
    panelTitle = 'কেন্দ্রীয় ভূমি প্রশাসন ও অডিট';
    officeDescription = 'ভূমি রেকর্ড ও জরিপ অধিদপ্তর, ভূমি মন্ত্রণালয়';
    menuItems = [
      { path: '/admin', label: 'সার্বিক অপারেশন ও ড্যাশবোর্ড', icon: FolderKanban },
      { path: '/officer/union-land', label: 'ইউনিয়ন পরিদর্শন ভিউ', icon: ClipboardList },
      { path: '/officer/ac-land', label: 'এসি ল্যান্ড নামজারি ভিউ', icon: Scale },
      { path: '/officer/registry', label: 'সাব-রেজিস্ট্রি ডকেট ভিউ', icon: FileCheck2 },
    ];
  }

  return (
    <div className="min-h-screen bg-slate-100 font-bengali flex flex-col">
      {/* Officer Office Identification Banner */}
      <div className="bg-slate-800 text-white border-b border-slate-700 py-4 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-teal-600 text-white flex items-center justify-center font-bold text-lg shadow">
              🏛️
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold text-white">{panelTitle}</h1>
                <span className="bg-teal-400/20 text-teal-300 text-[10px] font-semibold px-2 py-0.5 rounded border border-teal-500/30">
                  অফিসিয়াল পোর্টাল
                </span>
              </div>
              <p className="text-xs text-slate-300">{officeDescription}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs bg-slate-900/60 p-2.5 rounded-lg border border-slate-700">
            <div>
              <p className="text-slate-400">দায়িত্বরত কর্মকর্তা:</p>
              <p className="font-semibold text-white">{user?.name_bn || 'কর্মকর্তা'}</p>
            </div>
            <div className="border-l border-slate-700 pl-3">
              <p className="text-slate-400">পদবি:</p>
              <p className="font-semibold text-teal-300">{user?.designation_bn || user?.role}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Officer Secondary Tab Bar */}
        <div className="bg-white rounded-lg p-1.5 shadow-sm border border-slate-200 mb-6 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-1 overflow-x-auto">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-md text-xs font-semibold transition ${
                    active
                      ? 'bg-gov-navy text-white shadow-sm'
                      : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <Icon size={15} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          <div className="flex items-center gap-2 pr-2">
            <Link
              to="/citizen"
              className="text-xs text-slate-600 hover:text-gov-blue hover:underline font-medium"
            >
              নাগরিক কর্নার দেখুন
            </Link>
            <span className="text-slate-300">|</span>
            <button
              onClick={() => {
                logout();
                navigate('/login');
              }}
              className="inline-flex items-center gap-1 text-xs text-red-600 hover:text-red-800 font-semibold"
            >
              <LogOut size={13} />
              <span>লগআউট</span>
            </button>
          </div>
        </div>

        {/* Officer Main Body */}
        <main>
          {children || <Outlet />}
        </main>
      </div>
    </div>
  );
};
