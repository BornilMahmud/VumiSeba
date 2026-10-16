import React, { useState } from 'react';
import { Link, useLocation, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
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
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path: string) => location.pathname === path;

  const menuItems = [
    { path: '/citizen', label: 'ড্যাশবোর্ড', icon: LayoutDashboard },
    { path: '/citizen/profile', label: 'আমার প্রোফাইল ও KYC', icon: User },
    { path: '/citizen/my-land', label: 'আমার জমি ও খতিয়ান', icon: Landmark },
    { path: '/citizen/search', label: 'খতিয়ান ও দাগ অনুসন্ধান', icon: Search },
    { path: '/citizen/verify-land', label: 'কেনার আগে জমি যাচাই', icon: ShieldCheck },
    { path: '/citizen/tax', label: 'খাজনা ও দাখিলা', icon: Receipt },
    { path: '/citizen/sell', label: 'জমি বিক্রির আবেদন', icon: FilePlus2 },
    { path: '/citizen/deals', label: 'আমার ক্রয়-বিক্রয়', icon: ShoppingBag },
    { path: '/citizen/applications', label: 'আমার আবেদনসমূহ', icon: Clock },
    { path: '/citizen/registration-checklist', label: 'রেজিস্ট্রেশন অ্যাপয়েন্টমেন্ট', icon: CheckCircle2 },
    { path: '/citizen/mutation', label: 'নামজারি ট্র্যাকিং', icon: GitBranch },
    { path: '/citizen/documents', label: 'নথিপত্র ও আর্কাইভ', icon: FolderOpen },
    { path: '/citizen/notifications', label: 'বিজ্ঞপ্তি', icon: Bell, badge: unreadCount },
    { path: '/help', label: 'সহায়তা ও গাইড', icon: HelpCircle },
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-bengali flex flex-col">
      <div className="flex-1 flex max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 gap-6">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block w-64 bg-white rounded-xl shadow-gov-sm border border-slate-200 p-4 shrink-0 h-fit sticky top-28">
          {/* User Profile Snippet */}
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 mb-4">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-8 h-8 rounded-full bg-gov-blue text-white flex items-center justify-center font-bold text-xs">
                {user?.name_bn?.slice(0, 1) || 'না'}
              </div>
              <div className="overflow-hidden">
                <p className="font-semibold text-slate-900 text-xs truncate">{user?.name_bn || 'নাগরিক'}</p>
                <p className="text-[10px] text-teal-700 font-mono font-medium truncate">
                  {user?.citizen_id || 'কেওয়াইসি অপেক্ষমাণ'}
                </p>
              </div>
            </div>
            <div className="text-[10px] text-slate-500 flex items-center justify-between pt-1 border-t border-slate-200">
              <span>ভূমিকা: নাগরিক</span>
              <span className={`px-1.5 py-0.2 rounded font-semibold ${user?.kyc_status === 'verified' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                {user?.kyc_status === 'verified' ? 'যাচাইকৃত' : 'অযাচাইকৃত'}
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-0.5 text-xs">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center justify-between px-3 py-2 rounded-lg font-medium transition ${
                    active
                      ? 'bg-gov-blue text-white shadow-sm'
                      : 'text-slate-700 hover:bg-slate-100 hover:text-gov-blue'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon size={16} className={active ? 'text-white' : 'text-slate-500'} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && item.badge > 0 ? (
                    <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-mono font-bold">
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
              className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50 rounded-lg transition mt-4 pt-3 border-t border-slate-100"
            >
              <LogOut size={16} />
              <span>লগআউট</span>
            </button>
          </nav>
        </aside>

        {/* Mobile Toggle Button */}
        <div className="lg:hidden w-full mb-4">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="w-full flex items-center justify-between bg-white p-3 rounded-lg border border-slate-200 text-sm font-semibold text-slate-800 shadow-sm"
          >
            <span>নাগরিক মেন্যু ওপেন করুন</span>
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          {sidebarOpen && (
            <div className="bg-white p-4 rounded-lg border mt-2 shadow-md space-y-1 text-xs">
              {menuItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`block px-3 py-2 rounded-md ${
                    isActive(item.path) ? 'bg-gov-blue text-white font-semibold' : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {item.label}
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
