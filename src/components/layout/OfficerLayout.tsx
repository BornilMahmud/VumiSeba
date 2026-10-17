import React, { useState } from 'react';
import { Link, useLocation, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { getUserAvatarUrl } from '../../utils/userUtils';

export const OfficerLayout: React.FC<{ children?: React.ReactNode; title?: string }> = ({ children, title }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { language, toggleLanguage } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();

  const avatarUrl = getUserAvatarUrl(user);

  const isActive = (path: string) => location.pathname === path;

  const userRole = (user?.role || '').toLowerCase();

  const profileLink =
    userRole === 'citizen'
      ? '/citizen/profile'
      : userRole === 'union_officer' || userRole === 'union_land_officer'
      ? '/office/union/profile'
      : userRole === 'ac_land' || userRole === 'ac_land_officer'
      ? '/office/ac-land/profile'
      : userRole === 'sub_registrar' || userRole === 'sub_registry_officer'
      ? '/office/registry/profile'
      : '/admin/profile';

  let panelTitle = title || 'সরকারি কর্মকর্তা প্যানেল';
  let officeDescription = 'ভূমি ব্যবস্থাপনা ও প্রশাসন';
  let menuItems: { path: string; label: string; iconClass: string }[] = [];

  if (userRole === 'union_officer' || userRole === 'union_land_officer') {
    panelTitle = 'ইউনিয়ন ভূমি অফিস (তহশিল)';
    officeDescription = user?.office_name_bn || 'বাড্ডা ও সাঁতারকুল ইউনিয়ন ভূমি অফিস';
    menuItems = [
      { path: '/office/union/dashboard', label: 'সরেজমিন তদন্ত ড্যাশবোর্ড', iconClass: 'bx bxs-dashboard' },
      { path: '/office/union/applications', label: 'আবেদন যাচাই কিউ', iconClass: 'bx bx-list-check' },
      { path: '/office/union/tax-verification', label: 'ভূমি উন্নয়ন কর ও দাখিলা অডিট', iconClass: 'bx bx-receipt' },
      { path: '/office/union/record-verification', label: 'রেকর্ড ও দাগ যাচাই', iconClass: 'bx bx-search-alt-2' },
      { path: '/office/union/reports', label: 'সরেজমিন প্রতিবেদন', iconClass: 'bx bx-file' },
      { path: '/office/union/history', label: 'তদন্ত ইতিহাস', iconClass: 'bx bx-history' },
    ];
  } else if (userRole === 'ac_land' || userRole === 'ac_land_officer') {
    panelTitle = 'সহকারী কমিশনার (ভূমি) এজলাস';
    officeDescription = user?.office_name_bn || 'গুলশান রাজস্ব সার্কেল, ঢাকা';
    menuItems = [
      { path: '/office/ac-land/dashboard', label: 'ই-নামজারি কেস ও শুনানি ডকেট', iconClass: 'bx bxs-dashboard' },
      { path: '/office/ac-land/applications', label: 'প্রাক-রেজিস্ট্রেশন যাচাই', iconClass: 'bx bx-task' },
      { path: '/office/ac-land/mutation', label: 'ই-নামজারি নথি', iconClass: 'bx bx-git-branch' },
      { path: '/office/ac-land/hearings', label: 'শুনানি ব্যবস্থাপনা', iconClass: 'bx bx-calendar-event' },
      { path: '/office/ac-land/decisions', label: 'আদেশ ও সিদ্ধান্তসমূহ', iconClass: 'bx bx-badge-check' },
    ];
  } else if (userRole === 'sub_registrar' || userRole === 'sub_registry_officer') {
    panelTitle = 'সাব-রেজিস্ট্রি অফিস ডকেট';
    officeDescription = user?.office_name_bn || 'গুলশান সাব-রেজিস্ট্রি অফিস, নিবন্ধন পরিদপ্তর';
    menuItems = [
      { path: '/office/registry/dashboard', label: 'রেজিস্ট্রেশন অ্যাপয়েন্টমেন্ট ও দলিল ডকেট', iconClass: 'bx bxs-dashboard' },
      { path: '/office/registry/applications', label: 'রেজিস্ট্রেশন শিডিউলিং কিউ', iconClass: 'bx bx-list-check' },
      { path: '/office/registry/appointments', label: 'নির্ধারিত অ্যাপয়েন্টমেন্ট', iconClass: 'bx bx-calendar' },
      { path: '/office/registry/documents', label: 'দলিল ও স্ট্যাম্প নিরীক্ষা', iconClass: 'bx bx-certification' },
    ];
  } else {
    panelTitle = 'কেন্দ্রীয় ভূমি প্রশাসন ও অডিট';
    officeDescription = 'ভূমি রেকর্ড ও জরিপ অধিদপ্তর, ভূমি মন্ত্রণালয়';
    menuItems = [
      { path: '/admin/dashboard', label: 'সার্বিক অপারেশন ও ড্যাশবোর্ড', iconClass: 'bx bxs-dashboard' },
      { path: '/admin/users', label: 'নাগরিক ও কেওয়াইসি নিরীক্ষা', iconClass: 'bx bx-user-check' },
      { path: '/admin/roles', label: 'কর্মকর্তা ও পদবি বরাদ্দ', iconClass: 'bx bx-id-card' },
      { path: '/admin/applications', label: 'আবেদন ট্র্যাকার', iconClass: 'bx bx-spreadsheet' },
      { path: '/admin/audit-logs', label: 'অডিট লগ', iconClass: 'bx bx-shield-quarter' },
    ];
  }

  const currentNav = menuItems.find((m) => isActive(m.path));

  return (
    <div className="min-h-screen bg-slate-50/70 dark:bg-slate-950 font-bengali flex transition-colors duration-200">
      {/* Desktop Left-Sided Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 xl:w-72 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 shrink-0 h-screen sticky top-0 z-40 transition-colors">
        {/* Brand Header */}
        <div className="p-4 border-b border-slate-200/90 dark:border-slate-800 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-600 to-teal-800 text-white flex items-center justify-center font-bold text-xl shadow-md shrink-0 border border-teal-500/40">
              <i className="bx bxs-institution text-2xl"></i>
            </div>
            <div className="min-w-0">
              <span className="text-sm font-extrabold text-slate-900 dark:text-white tracking-tight truncate block">
                {panelTitle}
              </span>
              <span className="text-[10px] text-teal-700 dark:text-teal-400 font-semibold block truncate">
                সরকারি ভূমি প্রশাসন
              </span>
            </div>
          </Link>
        </div>

        {/* Officer Profile Card */}
        <div className="p-3 border-b border-slate-100 dark:border-slate-800">
          <Link
            to={profileLink}
            className="block bg-teal-50/50 dark:bg-teal-950/30 p-3 rounded-xl border border-teal-200/70 dark:border-teal-800/60 hover:border-teal-400 dark:hover:border-teal-700 transition group"
            title="প্রোফাইল ও ছবি পরিবর্তন"
          >
            <div className="flex items-center gap-2.5 mb-2">
              <div className="relative shrink-0">
                <img
                  src={avatarUrl || '/avatars/officer_kamal_union.jpg'}
                  alt="Officer"
                  className="w-9 h-9 rounded-xl object-cover ring-2 ring-teal-500/40 shadow-2xs group-hover:scale-105 transition-transform"
                />
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-teal-500 border-2 border-white dark:border-slate-900 rounded-full" />
              </div>
              <div className="overflow-hidden min-w-0">
                <p className="font-bold text-slate-900 dark:text-white text-xs truncate group-hover:text-teal-700 dark:group-hover:text-teal-400 transition-colors">
                  {user?.name_bn || 'কর্মকর্তা'}
                </p>
                <p className="text-[10px] text-teal-700 dark:text-teal-400 font-medium truncate">
                  {user?.designation_bn || user?.role || 'কর্মকর্তা'}
                </p>
              </div>
            </div>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 pt-2 border-t border-teal-200/60 dark:border-teal-800/40 truncate">
              {officeDescription}
            </p>
          </Link>
        </div>

        {/* Vertical Navigation Links */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-1 text-xs font-medium scrollbar-thin">
          {menuItems.map((item) => {
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition-all whitespace-nowrap ${
                  active
                    ? 'bg-teal-600 text-white shadow-xs font-bold'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-teal-50/70 dark:hover:bg-slate-800 hover:text-teal-800 dark:hover:text-teal-300'
                }`}
              >
                <i className={`${item.iconClass} text-lg shrink-0 ${active ? 'text-white' : 'text-slate-400 dark:text-slate-500'}`}></i>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer Controls & Logout */}
        <div className="p-3 border-t border-slate-200/90 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 space-y-2 shrink-0">
          <div className="flex items-center justify-between px-1">
            <button
              onClick={toggleTheme}
              className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white px-2 py-1 rounded-lg hover:bg-slate-200/60 dark:hover:bg-slate-800 transition cursor-pointer"
              title="Toggle Dark/Light Mode"
            >
              <i className={`bx ${theme === 'dark' ? 'bx-sun text-amber-400' : 'bx-moon'} text-base`}></i>
              <span>{theme === 'dark' ? 'লাইট মোড' : 'ডার্ক মোড'}</span>
            </button>
            <button
              onClick={toggleLanguage}
              className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-700 dark:text-slate-300 px-2 py-1 rounded-lg hover:bg-slate-200/60 dark:hover:bg-slate-800 transition cursor-pointer"
              title="Switch Language"
            >
              <i className="bx bx-globe text-teal-600 text-base"></i>
              <span>{language === 'bn' ? 'English' : 'বাংলা'}</span>
            </button>
          </div>
          <button
            onClick={async () => {
              await logout();
              navigate('/login');
            }}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition border border-rose-200/60 dark:border-rose-900/40 cursor-pointer active:scale-95"
          >
            <i className="bx bx-log-out text-base"></i>
            <span>লগআউট</span>
          </button>
        </div>
      </aside>

      {/* Mobile Slide-Over Drawer */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="relative flex flex-col w-72 max-w-[85vw] bg-white dark:bg-slate-900 h-full shadow-2xl z-10 border-r border-slate-200 dark:border-slate-800">
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-teal-600 text-white flex items-center justify-center font-bold shadow-2xs">
                  <i className="bx bxs-institution text-xl"></i>
                </div>
                <span className="font-extrabold text-slate-900 dark:text-white text-sm">{panelTitle}</span>
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-1.5 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
              >
                <i className="bx bx-x text-2xl"></i>
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto p-3 space-y-1 text-xs font-medium">
              {menuItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-lg ${
                    isActive(item.path) ? 'bg-teal-600 text-white font-bold' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <i className={`${item.iconClass} text-lg`}></i>
                  <span>{item.label}</span>
                </Link>
              ))}
            </nav>

            <div className="p-3 border-t border-slate-200 dark:border-slate-800">
              <button
                onClick={async () => {
                  setSidebarOpen(false);
                  await logout();
                  navigate('/login');
                }}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition border border-rose-200/60"
              >
                <i className="bx bx-log-out text-base"></i>
                <span>লগআউট</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header Bar */}
        <header className="h-14 sm:h-16 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/90 dark:border-slate-800 sticky top-0 z-30 px-4 sm:px-6 lg:px-8 xl:px-10 flex items-center justify-between gap-4 transition-colors">
          <div className="flex items-center gap-3">
            {/* Mobile Hamburger Trigger */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition"
              title="Open Menu"
            >
              <i className="bx bx-menu text-2xl"></i>
            </button>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 hidden sm:inline">{panelTitle}</span>
              <span className="text-slate-300 dark:text-slate-700 hidden sm:inline">/</span>
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                {currentNav ? currentNav.label : 'ড্যাশবোর্ড'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to={profileLink}
              className="flex items-center gap-2.5 p-1 sm:px-2.5 sm:py-1 rounded-xl hover:bg-teal-50 dark:hover:bg-slate-800 transition border border-transparent hover:border-teal-200/60 dark:hover:border-slate-700 group cursor-pointer"
              title="প্রোফাইল ও ছবি পরিবর্তন"
            >
              <div className="hidden sm:block text-right">
                <p className="text-xs font-bold text-slate-900 dark:text-white leading-tight group-hover:text-teal-700 dark:group-hover:text-teal-400 transition-colors">
                  {user?.name_bn || 'কর্মকর্তা'}
                </p>
                <p className="text-[10px] text-teal-700 dark:text-teal-400 font-semibold leading-tight">
                  {user?.designation_bn || user?.role}
                </p>
              </div>
              <div className="relative shrink-0">
                <img
                  src={avatarUrl || '/avatars/officer_kamal_union.jpg'}
                  alt="Officer"
                  className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl object-cover ring-2 ring-teal-500/40 shadow-2xs group-hover:scale-105 transition-transform"
                />
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-teal-500 border-2 border-white dark:border-slate-900 rounded-full" />
              </div>
            </Link>

            {/* Direct Logout Option in Top Bar */}
            <button
              onClick={async () => {
                await logout();
                navigate('/login');
              }}
              className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 transition active:scale-95 cursor-pointer"
              title="লগআউট"
            >
              <i className="bx bx-log-out text-base"></i>
              <span className="hidden sm:inline">লগআউট</span>
            </button>
          </div>
        </header>

        {/* Content Outlet */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 xl:p-10 w-full min-w-0">
          {children || <Outlet />}
        </main>
      </div>
    </div>
  );
};

export default OfficerLayout;
