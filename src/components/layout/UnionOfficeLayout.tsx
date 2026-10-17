import React, { useState } from 'react';
import { Link, useLocation, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { getUserAvatarUrl } from '../../utils/userUtils';

export const UnionOfficeLayout: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { language, toggleLanguage } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();

  const avatarUrl = getUserAvatarUrl(user);

  const isActive = (path: string) => location.pathname === path || location.pathname.startsWith(path + '/');

  const navItems = [
    { path: '/office/union/dashboard', label: 'ড্যাশবোর্ড', labelEn: 'Dashboard', iconClass: 'bx bxs-dashboard' },
    { path: '/office/union/applications', label: 'আবেদন যাচাই কিউ', labelEn: 'Verification Queue', iconClass: 'bx bx-list-check' },
    { path: '/office/union/tax-verification', label: 'কর ও দাখিলা যাচাই', labelEn: 'Tax Verification', iconClass: 'bx bx-receipt' },
    { path: '/office/union/record-verification', label: 'রেকর্ড ও দাগ যাচাই', labelEn: 'Record & Dag Audit', iconClass: 'bx bx-search-alt-2' },
    { path: '/office/union/reports', label: 'সরেজমিন প্রতিবেদন', labelEn: 'Field Reports', iconClass: 'bx bx-file' },
    { path: '/office/union/history', label: 'তদন্ত ইতিহাস', labelEn: 'Investigation History', iconClass: 'bx bx-history' },
    { path: '/office/union/profile', label: 'কর্মকর্তা প্রোফাইল ও সেটিংস', labelEn: 'Profile & Settings', iconClass: 'bx bx-user-circle' },
  ];

  const currentNav = navItems.find((item) => isActive(item.path));

  const isBn = language === 'bn';

  return (
    <div className={`min-h-screen bg-slate-50/70 dark:bg-slate-950 ${isBn ? 'font-bengali' : 'font-sans'} flex transition-colors duration-200`}>
      {/* Desktop Left-Sided Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 xl:w-72 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 shrink-0 h-screen sticky top-0 z-40 transition-colors">
        {/* Brand Header */}
        <div className="p-4 border-b border-slate-200/90 dark:border-slate-800 flex items-center justify-between">
          <Link to="/office/union/dashboard" className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-emerald-800 text-white flex items-center justify-center font-bold text-xl shadow-md shrink-0 border border-emerald-500/40">
              <i className="bx bxs-institution text-2xl"></i>
            </div>
            <div className="min-w-0">
              <span className="text-sm font-extrabold text-slate-900 dark:text-white tracking-tight truncate block">
                {isBn ? 'ইউনিয়ন ভূমি অফিস' : 'Union Land Office'}
              </span>
              <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-semibold block truncate">
                {isBn ? 'স্থানীয় তহশিল ও স্বত্ব নিরীক্ষা' : 'Local Tahsil & Title Audit'}
              </span>
            </div>
          </Link>
        </div>

        {/* Officer Profile Card */}
        <div className="p-3 border-b border-slate-100 dark:border-slate-800">
          <Link
            to="/office/union/profile"
            className="group block bg-emerald-50/60 hover:bg-emerald-100/70 dark:bg-emerald-950/30 dark:hover:bg-emerald-900/40 p-3 rounded-xl border border-emerald-200/80 dark:border-emerald-800/60 transition-all shadow-2xs hover:shadow-xs"
            title={isBn ? 'প্রোফাইল ও ছবি পরিবর্তন করুন' : 'Change Profile & Photo'}
          >
            <div className="flex items-center gap-2.5 mb-2">
              <div className="relative shrink-0">
                <img
                  src={avatarUrl || '/avatars/officer_kamal_union.jpg'}
                  alt={user?.name_bn || 'Officer'}
                  className="w-10 h-10 rounded-xl object-cover ring-2 ring-emerald-500/50 shadow-2xs group-hover:scale-105 transition-transform"
                />
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full" />
              </div>
              <div className="overflow-hidden min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <p className="font-bold text-slate-900 dark:text-white text-xs truncate group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
                    {isBn ? (user?.name_bn || 'মোহাম্মদ কামাল হোসেন') : (user?.name_en || 'Md. Kamal Hossain')}
                  </p>
                  <i className="bx bx-cog text-slate-400 group-hover:text-emerald-600 transition-colors text-sm"></i>
                </div>
                <p className="text-[10px] text-emerald-700 dark:text-emerald-400 font-medium truncate">
                  {isBn
                    ? (user?.designation_bn || 'ইউনিয়ন ভূমি সহকারী কর্মকর্তা (ULAO)')
                    : (user?.designation_en || 'Union Land Assistant Officer (ULAO)')}
                </p>
              </div>
            </div>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 pt-2 border-t border-emerald-200/60 dark:border-emerald-800/40 truncate flex items-center justify-between">
              <span className="truncate">
                {isBn
                  ? (user?.office_name_bn || 'বাড্ডা ও সাঁতারকুল ইউনিয়ন ভূমি অফিস')
                  : (user?.office_name_en || 'Badda & Satarkul Union Land Office')}
              </span>
              <span className="text-[9px] text-emerald-600 dark:text-emerald-400 font-bold shrink-0 ml-1">
                {isBn ? 'সেটিংস ›' : 'Edit ›'}
              </span>
            </p>
          </Link>
        </div>

        {/* Vertical Navigation Links */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-1 text-xs font-medium scrollbar-thin">
          {navItems.map((item) => {
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition-all whitespace-nowrap ${
                  active
                    ? 'bg-emerald-600 text-white shadow-xs font-bold'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-emerald-50/70 dark:hover:bg-slate-800 hover:text-emerald-800 dark:hover:text-emerald-300'
                }`}
              >
                <i className={`${item.iconClass} text-lg shrink-0 ${active ? 'text-white' : 'text-slate-400 dark:text-slate-500'}`}></i>
                <span>{language === 'en' ? item.labelEn : item.label}</span>
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
              <span>{theme === 'dark' ? (isBn ? 'লাইট মোড' : 'Light Mode') : (isBn ? 'ডার্ক মোড' : 'Dark Mode')}</span>
            </button>
            <button
              onClick={toggleLanguage}
              className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-700 dark:text-slate-300 px-2 py-1 rounded-lg hover:bg-slate-200/60 dark:hover:bg-slate-800 transition cursor-pointer"
              title="Switch Language"
            >
              <i className="bx bx-globe text-emerald-600 text-base"></i>
              <span>{isBn ? 'English' : 'বাংলা'}</span>
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
            <span>{isBn ? 'লগআউট' : 'Logout'}</span>
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
                <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold shadow-2xs">
                  <i className="bx bxs-institution text-xl"></i>
                </div>
                <span className="font-extrabold text-slate-900 dark:text-white text-sm">
                  {isBn ? 'ইউনিয়ন ভূমি অফিস' : 'Union Land Office'}
                </span>
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-1.5 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
              >
                <i className="bx bx-x text-2xl"></i>
              </button>
            </div>

            <div className="p-3 border-b border-slate-100 dark:border-slate-800">
              <Link
                to="/office/union/profile"
                onClick={() => setSidebarOpen(false)}
                className="flex items-center gap-2.5 bg-emerald-50 dark:bg-slate-800/80 p-3 rounded-xl border border-emerald-200/80 dark:border-slate-700/80"
              >
                <img
                  src={avatarUrl || '/avatars/officer_kamal_union.jpg'}
                  alt="Officer"
                  className="w-9 h-9 rounded-lg object-cover ring-1 ring-emerald-500 shrink-0"
                />
                <div className="overflow-hidden min-w-0">
                  <p className="font-bold text-slate-900 dark:text-white text-xs truncate">
                    {isBn ? (user?.name_bn || 'মোহাম্মদ কামাল হোসেন') : (user?.name_en || 'Md. Kamal Hossain')}
                  </p>
                  <p className="text-[10px] text-emerald-700 dark:text-emerald-400 truncate">
                    {isBn ? (user?.designation_bn || 'ইউনিয়ন ভূমি সহকারী কর্মকর্তা') : (user?.designation_en || 'Union Land Assistant Officer')}
                  </p>
                </div>
              </Link>
            </div>

            <nav className="flex-1 overflow-y-auto p-3 space-y-1 text-xs font-medium">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-lg ${
                    isActive(item.path) ? 'bg-emerald-600 text-white font-bold' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <i className={`${item.iconClass} text-lg`}></i>
                  <span>{language === 'en' ? item.labelEn : item.label}</span>
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
                <span>{isBn ? 'লগআউট' : 'Logout'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area (Full remaining width to the right of the sidebar) */}
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
              <span className="text-xs text-slate-500 hidden sm:inline">
                {isBn ? 'ইউনিয়ন ভূমি অফিস' : 'Union Land Office'}
              </span>
              <span className="text-slate-300 dark:text-slate-700 hidden sm:inline">/</span>
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                {currentNav ? (language === 'en' ? currentNav.labelEn : currentNav.label) : (isBn ? 'ড্যাশবোর্ড' : 'Dashboard')}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/office/union/profile"
              className="flex items-center gap-2.5 p-1 sm:px-2.5 sm:py-1 rounded-xl hover:bg-emerald-50 dark:hover:bg-slate-800 transition border border-transparent hover:border-emerald-200/60 dark:hover:border-slate-700 group cursor-pointer"
              title={isBn ? 'প্রোফাইল ও ছবি পরিবর্তন করুন' : 'Change Profile & Photo'}
            >
              <div className="text-right">
                <p className="text-xs font-bold text-slate-900 dark:text-white leading-tight group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
                  {isBn ? (user?.name_bn || 'মোহাম্মদ কামাল হোসেন') : (user?.name_en || 'Md. Kamal Hossain')}
                </p>
                <p className="text-[10px] text-emerald-700 dark:text-emerald-400 font-semibold leading-tight">
                  {isBn ? (user?.designation_bn || 'ইউনিয়ন ভূমি সহকারী কর্মকর্তা (ULAO)') : (user?.designation_en || 'Union Land Assistant Officer (ULAO)')}
                </p>
              </div>
              <div className="relative shrink-0">
                <img
                  src={avatarUrl || '/avatars/officer_kamal_union.jpg'}
                  alt={user?.name_bn || 'Officer'}
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = '/avatars/officer_kamal_union.jpg';
                  }}
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl object-cover ring-2 ring-emerald-500/50 shadow-2xs group-hover:scale-105 transition-transform"
                />
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full" />
              </div>
            </Link>

            {/* Direct Logout Option in Top Bar */}
            <button
              onClick={async () => {
                await logout();
                navigate('/login');
              }}
              className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 transition active:scale-95 cursor-pointer"
              title={isBn ? 'লগআউট' : 'Logout'}
            >
              <i className="bx bx-log-out text-base"></i>
              <span className="hidden sm:inline">{isBn ? 'লগআউট' : 'Logout'}</span>
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

export default UnionOfficeLayout;
