import React, { useState } from 'react';
import { Link, useLocation, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import { useLanguage } from '../../context/LanguageContext';
import {
  LayoutDashboard,
  User,
  ShieldCheck,
  Landmark,
  Search,
  CheckCircle2,
  Receipt,
  FilePlus2,
  ShoppingBag,
  Clock,
  GitBranch,
  FolderOpen,
  Bell,
  HelpCircle,
  LogOut,
  Menu,
  X,
} from 'lucide-react';

export const CitizenLayout: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const { unreadCount } = useNotifications();
  const { language, t } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path: string) => location.pathname === path;

  const menuItems = [
    { path: '/citizen/dashboard', labelBn: 'ড্যাশবোর্ড', labelEn: 'Dashboard', icon: LayoutDashboard },
    { path: '/citizen/profile', labelBn: 'আমার প্রোফাইল ও KYC', labelEn: 'Profile & KYC', icon: User },
    { path: '/citizen/my-land', labelBn: 'আমার জমি ও খতিয়ান', labelEn: 'My Land & Khatians', icon: Landmark },
    { path: '/citizen/search-land', labelBn: 'খতিয়ান ও দাগ অনুসন্ধান', labelEn: 'Search Land Records', icon: Search },
    { path: '/citizen/verify-land', labelBn: 'কেনার আগে জমি যাচাই', labelEn: 'Pre-Purchase Risk Audit', icon: ShieldCheck },
    { path: '/citizen/tax', labelBn: 'খাজনা ও দাখিলা', labelEn: 'Land Tax & Dakhila', icon: Receipt },
    { path: '/citizen/sell', labelBn: 'জমি বিক্রির আবেদন', labelEn: 'Apply to Sell Land', icon: FilePlus2 },
    { path: '/citizen/deals', labelBn: 'আমার ক্রয়-বিক্রয়', labelEn: 'My Deals & Contracts', icon: ShoppingBag },
    { path: '/citizen/my-applications', labelBn: 'আমার আবেদনসমূহ', labelEn: 'My Applications', icon: Clock },
    { path: '/citizen/registration-checklist', labelBn: 'রেজিস্ট্রেশন অ্যাপয়েন্টমেন্ট', labelEn: 'Registry Appointment', icon: CheckCircle2 },
    { path: '/citizen/mutation', labelBn: 'নামজারি ট্র্যাকিং', labelEn: 'E-Mutation Tracking', icon: GitBranch },
    { path: '/citizen/documents', labelBn: 'নথিপত্র ও আর্কাইভ', labelEn: 'Documents Vault', icon: FolderOpen },
    { path: '/citizen/notifications', labelBn: 'বিজ্ঞপ্তি', labelEn: 'Notifications', icon: Bell, badge: unreadCount },
    { path: '/help', labelBn: 'সহায়তা ও গাইড', labelEn: 'Help & User Guide', icon: HelpCircle },
  ];

  return (
    <div className="min-h-screen bg-slate-50/70 font-sans flex flex-col">
      <div className="flex-1 flex max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 gap-6">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block w-64 bg-white rounded-2xl shadow-card border border-slate-200/90 p-4 shrink-0 h-fit sticky top-28">
          {/* User Profile Snippet */}
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80 mb-4">
            <div className="flex items-center gap-2.5 mb-2">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white flex items-center justify-center font-bold text-sm shadow-2xs">
                {user?.name_bn?.slice(0, 1) || 'না'}
              </div>
              <div className="overflow-hidden">
                <p className="font-bold text-slate-900 text-xs truncate">{user?.name_bn || 'নাগরিক'}</p>
                <p className="text-[10px] text-emerald-700 font-mono font-medium truncate">
                  {user?.citizen_id || 'কেওয়াইসি অপেক্ষমাণ'}
                </p>
              </div>
            </div>
            <div className="text-[10px] text-slate-500 flex items-center justify-between pt-2 border-t border-slate-200">
              <span className="font-medium">{language === 'en' ? 'Role: Citizen' : 'ভূমিকা: নাগরিক'}</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${user?.kyc_status === 'verified' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                {user?.kyc_status === 'verified' ? (language === 'en' ? 'Verified' : 'যাচাইকৃত') : (language === 'en' ? 'Pending' : 'অযাচাইকৃত')}
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1 text-xs font-medium">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              const label = language === 'en' ? item.labelEn : item.labelBn;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center justify-between px-3 py-2 rounded-xl transition-all ${
                    active
                      ? 'bg-emerald-600 text-white shadow-xs font-bold'
                      : 'text-slate-700 hover:bg-slate-100/80 hover:text-emerald-800'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon size={16} className={active ? 'text-white' : 'text-slate-400'} />
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

            <button
              onClick={() => {
                logout();
                navigate('/login');
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-xl transition mt-4 pt-3 border-t border-slate-100"
            >
              <LogOut size={16} />
              <span>{t('nav.logout', 'লগআউট', 'Logout')}</span>
            </button>
          </nav>
        </aside>

        {/* Mobile Toggle Button */}
        <div className="lg:hidden w-full mb-4">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="w-full flex items-center justify-between bg-white p-3.5 rounded-xl border border-slate-200 text-sm font-bold text-slate-800 shadow-xs"
          >
            <span>{language === 'en' ? 'Open Citizen Menu' : 'নাগরিক মেন্যু ওপেন করুন'}</span>
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          {sidebarOpen && (
            <div className="bg-white p-4 rounded-xl border border-slate-200 mt-2 shadow-card space-y-1 text-xs">
              {menuItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`block px-3 py-2 rounded-lg font-medium ${
                    isActive(item.path) ? 'bg-emerald-600 text-white font-bold' : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {language === 'en' ? item.labelEn : item.labelBn}
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Content Outlet */}
        <main className="flex-1 min-w-0">
          {children || <Outlet />}
        </main>
      </div>
    </div>
  );
};
