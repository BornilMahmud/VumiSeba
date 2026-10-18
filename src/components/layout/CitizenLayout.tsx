import React, { useState } from 'react';
import { Link, useLocation, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { getUserAvatarUrl } from '../../utils/userUtils';

export const CitizenLayout: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const { unreadCount } = useNotifications();
  const { language, toggleLanguage, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    setSidebarOpen(false);
    await logout();
    navigate('/login', { replace: true });
  };

  const avatarUrl = getUserAvatarUrl(user);
  const isActive = (path: string) => {
    if (location.pathname === path) return true;
    if (path === '/citizen/tax' && (location.pathname === '/citizen/tax-clearance' || location.pathname.startsWith('/citizen/tax'))) return true;
    if (path === '/citizen/sell' && (location.pathname === '/citizen/sell-land' || location.pathname.startsWith('/citizen/sell'))) return true;
    if (path === '/citizen/mutation' && (location.pathname.startsWith('/citizen/mutation') || location.pathname === '/citizen/mutation-tracking')) return true;
    if (path === '/citizen/my-applications' && (location.pathname === '/citizen/applications' || location.pathname === '/citizen/sale-applications')) return true;
    return false;
  };

  const menuItems = [
    { path: '/citizen/dashboard', labelBn: 'ড্যাশবোর্ড', labelEn: 'Dashboard', iconClass: 'bx bxs-dashboard' },
    { path: '/citizen/profile', labelBn: 'আমার প্রোফাইল ও KYC', labelEn: 'Profile & KYC', iconClass: 'bx bx-user' },
    { path: '/citizen/my-land', labelBn: 'আমার জমি ও খতিয়ান', labelEn: 'My Land & Khatians', iconClass: 'bx bx-landscape' },
    { path: '/citizen/search-land', labelBn: 'খতিয়ান ও দাগ অনুসন্ধান', labelEn: 'Search Land Records', iconClass: 'bx bx-search-alt-2' },
    { path: '/citizen/verify-land', labelBn: 'কেনার আগে জমি যাচাই', labelEn: 'Pre-Purchase Risk Audit', iconClass: 'bx bx-check-shield' },
    { path: '/citizen/tax', labelBn: 'খাজনা ও দাখিলা', labelEn: 'Land Tax & Dakhila', iconClass: 'bx bx-receipt' },
    { path: '/citizen/sell', labelBn: 'জমি বিক্রির আবেদন', labelEn: 'Apply to Sell Land', iconClass: 'bx bx-plus-circle' },
    { path: '/citizen/deals', labelBn: 'আমার ক্রয়-বিক্রয়', labelEn: 'My Deals & Contracts', iconClass: 'bx bx-shopping-bag' },
    { path: '/citizen/my-applications', labelBn: 'আমার আবেদনসমূহ', labelEn: 'My Applications', iconClass: 'bx bx-time-five' },
    { path: '/citizen/registration-checklist', labelBn: 'রেজিস্ট্রেশন অ্যাপয়েন্টমেন্ট', labelEn: 'Registry Appointment', iconClass: 'bx bx-calendar-check' },
    { path: '/citizen/mutation', labelBn: 'নামজারি ট্র্যাকিং', labelEn: 'E-Mutation Tracking', iconClass: 'bx bx-git-branch' },
    { path: '/citizen/documents', labelBn: 'নথিপত্র ও আর্কাইভ', labelEn: 'Documents Vault', iconClass: 'bx bx-folder' },
    { path: '/citizen/notifications', labelBn: 'বিজ্ঞপ্তি', labelEn: 'Notifications', iconClass: 'bx bx-bell', badge: unreadCount },
    { path: '/citizen/help', labelBn: 'সহায়তা ও প্রশ্নোত্তর', labelEn: 'Help & FAQ Guide', iconClass: 'bx bx-help-circle' },
  ];

  return (
    <div className="min-h-screen bg-slate-50/70 dark:bg-slate-950 font-sans flex transition-colors duration-200">
      {/* Desktop Left Sidebar (Docked to left edge, full height) */}
      <aside className="hidden lg:flex flex-col w-64 xl:w-72 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 shrink-0 h-screen sticky top-0 z-40 transition-colors">
        {/* Sidebar Brand Header */}
        <div className="p-4 border-b border-slate-200/90 dark:border-slate-800 flex items-center justify-between">
          <Link to="/citizen/dashboard" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white flex items-center justify-center font-bold text-lg shadow-2xs shrink-0">
              🏛️
            </div>
            <div>
              <span className="text-base font-extrabold text-slate-900 dark:text-white tracking-tight">
                {t('brand.name', 'ভূমিসেবা', 'VumiSeba')}
              </span>
              <span className="block text-[10px] text-emerald-700 dark:text-emerald-400 font-semibold">
                {t('citizen.portalTitle', 'নাগরিক সেবা পোর্টাল', 'Citizen Service Portal')}
              </span>
            </div>
          </Link>
        </div>

        {/* User Profile Snippet */}
        <div className="p-3 border-b border-slate-100 dark:border-slate-800">
          <Link
            to="/citizen/profile"
            className="block group bg-slate-50 dark:bg-slate-800/80 hover:bg-emerald-50/60 dark:hover:bg-slate-800 p-3 rounded-xl border border-slate-200/80 dark:border-slate-700/80 transition shadow-2xs hover:shadow-xs cursor-pointer"
            title="নাগরিক প্রোফাইল ও কেওয়াইসি"
          >
            <div className="flex items-center gap-2.5 mb-2">
              <div className="relative shrink-0">
                <img
                  src={avatarUrl || '/avatars/default_nid.jpg'}
                  alt={user?.name_bn || 'নাগরিক'}
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = '/avatars/default_nid.jpg';
                  }}
                  className="w-10 h-10 rounded-xl object-cover ring-2 ring-emerald-500/50 shadow-xs group-hover:scale-105 transition-transform"
                />
                <span
                  className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-600 text-white rounded-full flex items-center justify-center text-[8px] font-bold border-2 border-white dark:border-slate-800"
                  title="এনআইডি ভেরিফায়েড"
                >
                  ✓
                </span>
              </div>
              <div className="overflow-hidden min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <p className="font-bold text-slate-900 dark:text-white text-xs truncate group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
                    {user?.name_bn || 'মোঃ রফিকুল ইসলাম'}
                  </p>
                  <i className="bx bx-cog text-slate-400 group-hover:text-emerald-600 transition-colors text-sm"></i>
                </div>
                <p className="text-[10px] text-emerald-700 dark:text-emerald-400 font-mono font-medium truncate">
                  {user?.citizen_id || 'BHM-CIT-882194'}
                </p>
              </div>
            </div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400 flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-700">
              <span className="font-medium">{language === 'en' ? 'Role: Citizen' : 'ভূমিকা: নাগরিক'}</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${user?.kyc_status === 'verified' || !user?.kyc_status ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300' : 'bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300'}`}>
                {user?.kyc_status === 'verified' || !user?.kyc_status ? (language === 'en' ? 'Verified' : 'যাচাইকৃত') : (language === 'en' ? 'Pending' : 'অযাচাইকৃত')}
              </span>
            </div>
          </Link>
        </div>

        {/* Navigation Links (Scrollable area) */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-1 text-xs font-medium scrollbar-thin">
          {menuItems.map((item) => {
            const active = isActive(item.path);
            const label = language === 'en' ? item.labelEn : item.labelBn;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center justify-between px-3 py-2 rounded-xl transition-all whitespace-nowrap ${
                  active
                    ? 'bg-emerald-600 text-white shadow-xs font-bold'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100/80 dark:hover:bg-slate-800 hover:text-emerald-800 dark:hover:text-emerald-400'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <i className={`${item.iconClass} text-lg shrink-0 ${active ? 'text-white' : 'text-slate-400 dark:text-slate-500'}`}></i>
                  <span>{label}</span>
                </div>
                {item.badge && item.badge > 0 ? (
                  <span className="bg-rose-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-mono font-bold">
                    {item.badge}
                  </span>
                ) : null}
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
              <i className="bx bx-globe text-emerald-600 text-base"></i>
              <span>{language === 'bn' ? 'English' : 'বাংলা'}</span>
            </button>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition border border-rose-200/60 dark:border-rose-900/40 cursor-pointer active:scale-95"
          >
            <i className="bx bx-log-out text-base"></i>
            <span>{t('nav.logout', 'লগআউট', 'Logout')}</span>
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
                <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-base shadow-2xs">
                  🏛️
                </div>
                <span className="font-extrabold text-slate-900 dark:text-white text-sm">ভূমিসেবা পোর্টাল</span>
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-1.5 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg cursor-pointer"
              >
                <i className="bx bx-x text-2xl"></i>
              </button>
            </div>

            <div className="p-3 border-b border-slate-100 dark:border-slate-800">
              <div className="bg-slate-50 dark:bg-slate-800/80 p-3 rounded-xl border border-slate-200/80 dark:border-slate-700/80 flex items-center gap-2.5">
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt={user?.name_bn || 'নাগরিক'}
                    className="w-10 h-10 rounded-xl object-cover ring-2 ring-emerald-500/50 shrink-0"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white flex items-center justify-center font-bold text-sm shadow-2xs shrink-0">
                    {user?.name_bn?.slice(0, 1) || 'র'}
                  </div>
                )}
                <div className="overflow-hidden min-w-0">
                  <p className="font-bold text-slate-900 dark:text-white text-xs truncate">{user?.name_bn || 'মোঃ রফিকুল ইসলাম'}</p>
                  <p className="text-[10px] text-emerald-700 dark:text-emerald-400 font-mono font-medium truncate">{user?.citizen_id || 'BHM-CIT-882194'}</p>
                </div>
              </div>
            </div>

            <nav className="flex-1 overflow-y-auto p-3 space-y-1 text-xs font-medium">
              {menuItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center justify-between px-3 py-2 rounded-lg ${
                    isActive(item.path) ? 'bg-emerald-600 text-white font-bold' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <i className={`${item.iconClass} text-lg`}></i>
                    <span>{language === 'en' ? item.labelEn : item.labelBn}</span>
                  </div>
                  {item.badge && item.badge > 0 ? (
                    <span className="bg-rose-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-mono font-bold">
                      {item.badge}
                    </span>
                  ) : null}
                </Link>
              ))}
            </nav>

            <div className="p-3 border-t border-slate-200 dark:border-slate-800">
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition border border-rose-200/60 cursor-pointer"
              >
                <i className="bx bx-log-out text-base"></i>
                <span>লগআউট</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area (Full remaining width to the right of the sidebar) */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header Bar for Citizen */}
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
              <Link to="/" className="text-xs text-slate-500 hover:text-emerald-600 hidden sm:inline">
                {language === 'en' ? 'Home' : 'ভূমিসেবা হোম'}
              </Link>
              <span className="text-slate-300 dark:text-slate-700 hidden sm:inline">/</span>
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                {menuItems.find((m) => isActive(m.path))?.[language === 'en' ? 'labelEn' : 'labelBn'] || (language === 'en' ? 'Citizen Dashboard' : 'নাগরিক ড্যাশবোর্ড')}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/citizen/notifications"
              className="relative p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition"
              title="বিজ্ঞপ্তি"
            >
              <i className="bx bx-bell text-xl"></i>
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white dark:ring-slate-900"></span>
              )}
            </Link>
            <Link
              to="/citizen/profile"
              className="flex items-center gap-2.5 p-1 sm:px-2.5 sm:py-1 rounded-xl hover:bg-emerald-50 dark:hover:bg-slate-800 transition border border-transparent hover:border-emerald-200/60 dark:hover:border-slate-700 group cursor-pointer"
              title="নাগরিক প্রোফাইল ও কেওয়াইসি"
            >
              <div className="text-right">
                <p className="text-xs font-bold text-slate-900 dark:text-white leading-tight group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
                  {user?.name_bn || 'মোঃ রফিকুল ইসলাম'}
                </p>
                <p className="text-[10px] text-emerald-700 dark:text-emerald-400 font-mono font-semibold leading-tight">
                  {user?.citizen_id || 'BHM-CIT-882194'}
                </p>
              </div>
              <div className="relative shrink-0">
                <img
                  src={avatarUrl || '/avatars/default_nid.jpg'}
                  alt={user?.name_bn || 'নাগরিক'}
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = '/avatars/default_nid.jpg';
                  }}
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl object-cover ring-2 ring-emerald-500/50 shadow-2xs group-hover:scale-105 transition-transform"
                />
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full" />
              </div>
            </Link>

            {/* Direct Logout Option in Top Bar */}
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 transition active:scale-95 cursor-pointer"
              title={t('nav.logout', 'লগআউট', 'Logout')}
            >
              <i className="bx bx-log-out text-base"></i>
              <span className="hidden sm:inline">{t('nav.logout', 'লগআউট', 'Logout')}</span>
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

export default CitizenLayout;
