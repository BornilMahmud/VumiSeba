import React, { useState } from 'react';
import { Link, useLocation, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { getUserAvatarUrl } from '../../utils/userUtils';

export const AdminOfficeLayout: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { language, toggleLanguage } = useLanguage();
  const isBn = language === 'bn';
  const location = useLocation();
  const navigate = useNavigate();

  const avatarUrl = getUserAvatarUrl(user);

  const isActive = (path: string) => location.pathname === path || location.pathname.startsWith(path + '/');

  const navItems = [
    { path: '/admin/dashboard', label: 'সিস্টেম ড্যাশবোর্ড', labelEn: 'System Dashboard', iconClass: 'bx bxs-dashboard' },
    { path: '/admin/users', label: 'নাগরিক ও কেওয়াইসি নিরীক্ষা', labelEn: 'Users & KYC Audit', iconClass: 'bx bx-user-check' },
    { path: '/admin/roles', label: 'কর্মকর্তা ও পদবি বরাদ্দ', labelEn: 'Officer & Role Assignment', iconClass: 'bx bx-id-card' },
    { path: '/admin/applications', label: 'সামগ্রিক আবেদন ট্র্যাকার', labelEn: 'Master App Tracker', iconClass: 'bx bx-spreadsheet' },
    { path: '/admin/audit-logs', label: 'অডিট ও ট্র্যাকিং লগ', labelEn: 'Audit Logs & Forensics', iconClass: 'bx bx-shield-quarter' },
    { path: '/admin/monitoring', label: 'সিস্টেম মনিটরিং ও ব্যাকআপ', labelEn: 'System Health & Metrics', iconClass: 'bx bx-pulse' },
    { path: '/admin/profile', label: 'অ্যাডমিন প্রোফাইল ও সেটিংস', labelEn: 'Admin Profile & Settings', iconClass: 'bx bx-user-circle' },
  ];

  const currentNav = navItems.find((item) => isActive(item.path));

  return (
    <div className={`min-h-screen bg-slate-50/70 dark:bg-slate-950 ${isBn ? 'font-bengali' : 'font-sans'} flex transition-colors duration-200`}>
      {/* Desktop Left-Sided Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 xl:w-72 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 shrink-0 h-screen sticky top-0 z-40 transition-colors">
        {/* Brand Header */}
        <div className="p-4 border-b border-slate-200/90 dark:border-slate-800 flex items-center justify-between">
          <Link to="/admin/dashboard" className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-600 to-cyan-800 text-white flex items-center justify-center font-bold text-xl shadow-md shrink-0 border border-cyan-500/40">
              <i className="bx bxs-shield-alt-2 text-2xl"></i>
            </div>
            <div className="min-w-0">
              <span className="text-sm font-extrabold text-slate-900 dark:text-white tracking-tight truncate block">
                {isBn ? 'ভূমি মন্ত্রণালয় প্রশাসন' : 'Ministry of Land'}
              </span>
              <span className="text-[10px] text-cyan-700 dark:text-cyan-400 font-semibold block truncate">
                {isBn ? 'সুপার অ্যাডমিন ও গভর্নেন্স' : 'Super Admin & Governance'}
              </span>
            </div>
          </Link>
        </div>

        {/* Admin Profile Card */}
        <div className="p-3 border-b border-slate-100 dark:border-slate-800">
          <Link
            to="/admin/profile"
            className="group block bg-cyan-50/60 hover:bg-cyan-100/70 dark:bg-cyan-950/30 dark:hover:bg-cyan-900/40 p-3 rounded-xl border border-cyan-200/80 dark:border-cyan-800/60 transition-all shadow-2xs hover:shadow-xs"
            title={isBn ? 'অ্যাডমিন প্রোফাইল ও সেটিংস' : 'Admin Profile & Settings'}
          >
            <div className="flex items-center gap-2.5 mb-2">
              <div className="relative shrink-0">
                <img
                  src={avatarUrl || '/avatars/officer_admin.jpg'}
                  alt={user?.name_bn || 'Admin'}
                  className="w-10 h-10 rounded-xl object-cover ring-2 ring-cyan-600/50 shadow-2xs group-hover:scale-105 transition-transform"
                />
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-cyan-600 border-2 border-white dark:border-slate-900 rounded-full" />
              </div>
              <div className="overflow-hidden min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <p className="font-bold text-slate-900 dark:text-white text-xs truncate group-hover:text-cyan-700 dark:group-hover:text-cyan-400 transition-colors">
                    {isBn ? (user?.name_bn || 'সিস্টেম অ্যাডমিনিস্ট্রেটর') : (user?.name_en || 'System Administrator')}
                  </p>
                  <i className="bx bx-cog text-slate-400 group-hover:text-cyan-600 transition-colors text-sm"></i>
                </div>
                <p className="text-[10px] text-cyan-700 dark:text-cyan-400 font-medium truncate">
                  {isBn ? (user?.designation_bn || 'ন্যাশনাল সুপার অ্যাডমিন') : (user?.designation_en || 'National Super Admin')}
                </p>
              </div>
            </div>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 pt-2 border-t border-cyan-200/60 dark:border-cyan-800/40 truncate flex items-center justify-between">
              <span className="truncate">
                {isBn ? 'ভূমিসেবা কেন্দ্রীয় গভর্নেন্স ও ট্রানজ্যাকশন কোর' : 'VumiSeba Central Governance Core'}
              </span>
              <span className="text-[9px] text-cyan-600 dark:text-cyan-400 font-bold shrink-0 ml-1">
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
                    ? 'bg-cyan-700 text-white shadow-xs font-bold'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-cyan-50/70 dark:hover:bg-slate-800 hover:text-cyan-800 dark:hover:text-cyan-300'
                }`}
              >
                <i className={`${item.iconClass} text-lg shrink-0 ${active ? 'text-white' : 'text-slate-400 dark:text-slate-500'}`}></i>
                <span>{isBn ? item.label : item.labelEn}</span>
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
              <i className="bx bx-globe text-cyan-600 text-base"></i>
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
                <div className="w-8 h-8 rounded-lg bg-cyan-700 text-white flex items-center justify-center font-bold shadow-2xs">
                  <i className="bx bxs-shield-alt-2 text-xl"></i>
                </div>
                <span className="font-extrabold text-slate-900 dark:text-white text-sm">
                  {isBn ? 'ভূমি প্রশাসন কনসোল' : 'Admin Console'}
                </span>
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-1.5 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg cursor-pointer"
              >
                <i className="bx bx-x text-2xl"></i>
              </button>
            </div>

            <div className="p-3 border-b border-slate-100 dark:border-slate-800">
              <Link
                to="/admin/profile"
                onClick={() => setSidebarOpen(false)}
                className="flex items-center gap-2.5 bg-cyan-50 dark:bg-slate-800/80 p-3 rounded-xl border border-cyan-200/80 dark:border-slate-700/80"
              >
                <img
                  src={avatarUrl || '/avatars/officer_admin.jpg'}
                  alt="Admin"
                  className="w-9 h-9 rounded-lg object-cover ring-1 ring-cyan-600 shrink-0"
                />
                <div className="overflow-hidden min-w-0">
                  <p className="font-bold text-slate-900 dark:text-white text-xs truncate">
                    {isBn ? (user?.name_bn || 'সিস্টেম অ্যাডমিনিস্ট্রেটর') : (user?.name_en || 'System Administrator')}
                  </p>
                  <p className="text-[10px] text-cyan-700 dark:text-cyan-400 truncate">
                    {isBn ? 'সুপার অ্যাডমিন' : 'Super Admin'}
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
                    isActive(item.path) ? 'bg-cyan-700 text-white font-bold' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <i className={`${item.iconClass} text-lg`}></i>
                  <span>{isBn ? item.label : item.labelEn}</span>
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
                className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition border border-rose-200/60 cursor-pointer"
              >
                <i className="bx bx-log-out text-base"></i>
                <span>{isBn ? 'লগআউট' : 'Logout'}</span>
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
              className="lg:hidden p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition cursor-pointer"
              title="Open Menu"
            >
              <i className="bx bx-menu text-2xl"></i>
            </button>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 dark:text-slate-400 hidden sm:inline">
                {isBn ? 'ভূমি মন্ত্রণালয়' : 'Ministry of Land'}
              </span>
              <span className="text-slate-300 dark:text-slate-700 hidden sm:inline">/</span>
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                {currentNav ? (isBn ? currentNav.label : currentNav.labelEn) : (isBn ? 'সিস্টেম ড্যাশবোর্ড' : 'System Dashboard')}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/admin/profile"
              className="flex items-center gap-2.5 p-1 sm:px-2.5 sm:py-1 rounded-xl hover:bg-cyan-50 dark:hover:bg-slate-800 transition border border-transparent hover:border-cyan-200/60 dark:hover:border-slate-700 group cursor-pointer"
              title={isBn ? 'অ্যাডমিন প্রোফাইল ও সেটিংস' : 'Admin Profile & Settings'}
            >
              <div className="text-right">
                <p className="text-xs font-bold text-slate-900 dark:text-white leading-tight group-hover:text-cyan-700 dark:group-hover:text-cyan-400 transition-colors">
                  {isBn ? (user?.name_bn || 'এ. কে. এম. রেজওয়ানুল হক') : (user?.name_en || 'A. K. M. Rezwanul Haque')}
                </p>
                <p className="text-[10px] text-cyan-700 dark:text-cyan-400 font-semibold leading-tight">
                  {isBn ? (user?.designation_bn || 'উপ-পরিচালক (আইসিটি ও অডিট)') : (user?.designation_en || 'Deputy Director (ICT & Audit)')}
                </p>
              </div>
              <div className="relative shrink-0">
                <img
                  src={avatarUrl || '/avatars/officer_admin.jpg'}
                  alt={user?.name_bn || 'Admin'}
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = '/avatars/officer_admin.jpg';
                  }}
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl object-cover ring-2 ring-cyan-600/50 shadow-2xs group-hover:scale-105 transition-transform"
                />
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-cyan-600 border-2 border-white dark:border-slate-900 rounded-full" />
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

export default AdminOfficeLayout;
