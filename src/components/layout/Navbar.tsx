import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import {
  Menu,
  X,
  Bell,
  Search,
  ShieldCheck,
  ChevronDown,
  User,
  LogOut,
  Building,
  HelpCircle,
  FileCheck,
  Compass,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [servicesDropdown, setServicesDropdown] = useState(false);
  const { user, logout } = useAuth();
  const { unreadCount } = useNotifications();
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path: string) => location.pathname === path;

  const handleDashboardRedirect = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (user.role === 'citizen') navigate('/citizen');
    else if (user.role === 'union_officer') navigate('/officer/union-land');
    else if (user.role === 'ac_land') navigate('/officer/ac-land');
    else if (user.role === 'sub_registrar') navigate('/officer/registry');
    else if (user.role === 'central_admin') navigate('/admin');
  };

  return (
    <header className="bg-white border-b border-slate-200 sticky top-[33px] z-40 shadow-gov-sm font-bengali">
      {/* Top Ministry Banner */}
      <div className="bg-gov-navy text-white text-[11px] py-1 px-4 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>গণপ্রজাতন্ত্রী বাংলাদেশ সরকার | ভূমি মন্ত্রণালয় ও নিবন্ধন পরিদপ্তর ডিজিটাল উদ্যোগ</span>
          </div>
          <div className="flex items-center gap-4 text-slate-300">
            <span>হেল্পলাইন: <strong className="text-white font-mono">১৬১২২</strong> (টোল ফ্রি)</span>
            <span className="hidden md:inline">ই-মেইল: support@land.gov.bd</span>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Portal Identity */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-lg bg-gov-blue text-white flex items-center justify-center font-bold text-xl shadow-md group-hover:bg-slate-900 transition">
              🏛️
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-bold text-slate-900 tracking-tight">ভূমিসাথী</span>
                <span className="text-[10px] bg-teal-100 text-teal-800 font-semibold px-1.5 py-0.5 rounded border border-teal-300">
                  স্মার্ট ল্যান্ডটেক
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block">
                নাগরিক ভূমি সেবা, রেকর্ড যাচাই ও ই-নামজারি
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            <Link
              to="/"
              className={`px-3 py-2 rounded-md text-sm font-medium transition ${
                isActive('/') ? 'text-gov-blue font-bold bg-blue-50' : 'text-slate-700 hover:text-gov-blue hover:bg-slate-50'
              }`}
            >
              হোম
            </Link>

            <Link
              to="/search-land"
              className={`px-3 py-2 rounded-md text-sm font-medium transition flex items-center gap-1 ${
                isActive('/search-land') ? 'text-gov-blue font-bold bg-blue-50' : 'text-slate-700 hover:text-gov-blue hover:bg-slate-50'
              }`}
            >
              <Search size={15} />
              জমি খুঁজুন
            </Link>

            <Link
              to="/verify-land"
              className={`px-3 py-2 rounded-md text-sm font-medium transition flex items-center gap-1 ${
                isActive('/verify-land')
                  ? 'text-gov-blue font-bold bg-blue-50'
                  : 'text-slate-700 hover:text-gov-blue hover:bg-slate-50'
              }`}
            >
              <ShieldCheck size={15} className="text-teal-600" />
              কেনার আগে যাচাই
            </Link>

            <Link
              to="/how-it-works"
              className={`px-3 py-2 rounded-md text-sm font-medium transition flex items-center gap-1 ${
                isActive('/how-it-works') ? 'text-gov-blue font-bold bg-blue-50' : 'text-slate-700 hover:text-gov-blue hover:bg-slate-50'
              }`}
            >
              <Compass size={15} />
              কীভাবে কাজ করে
            </Link>

            {/* Services Dropdown */}
            <div className="relative">
              <button
                onClick={() => setServicesDropdown(!servicesDropdown)}
                className="px-3 py-2 rounded-md text-sm font-medium text-slate-700 hover:text-gov-blue hover:bg-slate-50 transition flex items-center gap-1"
              >
                <span>সেবাসমূহ</span>
                <ChevronDown size={14} />
              </button>

              {servicesDropdown && (
                <div
                  onMouseLeave={() => setServicesDropdown(false)}
                  className="absolute left-0 mt-1 w-56 bg-white rounded-lg shadow-gov-lg border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-1"
                >
                  <Link
                    to="/services"
                    onClick={() => setServicesDropdown(false)}
                    className="block px-4 py-2 text-xs font-semibold text-slate-800 hover:bg-slate-50 border-b"
                  >
                    সকল ভূমি সেবার তালিকা
                  </Link>
                  <Link
                    to="/citizen/sell"
                    onClick={() => setServicesDropdown(false)}
                    className="block px-4 py-2 text-xs text-slate-700 hover:bg-slate-50"
                  >
                    জমি বিক্রির আবেদন
                  </Link>
                  <Link
                    to="/citizen/tax"
                    onClick={() => setServicesDropdown(false)}
                    className="block px-4 py-2 text-xs text-slate-700 hover:bg-slate-50"
                  >
                    ভূমি উন্নয়ন কর ও দাখিলা
                  </Link>
                  <Link
                    to="/citizen/mutation"
                    onClick={() => setServicesDropdown(false)}
                    className="block px-4 py-2 text-xs text-slate-700 hover:bg-slate-50"
                  >
                    ই-নামজারি ট্র্যাকিং
                  </Link>
                </div>
              )}
            </div>

            <Link
              to="/help"
              className={`px-3 py-2 rounded-md text-sm font-medium transition flex items-center gap-1 ${
                isActive('/help') ? 'text-gov-blue font-bold bg-blue-50' : 'text-slate-700 hover:text-gov-blue hover:bg-slate-50'
              }`}
            >
              <HelpCircle size={15} />
              সহায়তা ও প্রশ্নোত্তর
            </Link>
          </nav>

          {/* Right Action Menu: User Dashboard Shortcut / Login */}
          <div className="hidden lg:flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-2">
                {/* Notification Bell */}
                <Link
                  to={user.role === 'citizen' ? '/citizen/notifications' : '#'}
                  className="relative p-2 text-slate-600 hover:text-gov-blue rounded-full hover:bg-slate-100 transition"
                  title="বিজ্ঞপ্তি"
                >
                  <Bell size={18} />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-red-600 text-white text-[10px] flex items-center justify-center font-bold font-mono">
                      {unreadCount}
                    </span>
                  )}
                </Link>

                {/* Dashboard Button */}
                <button
                  onClick={handleDashboardRedirect}
                  className="inline-flex items-center gap-2 bg-gov-blue hover:bg-slate-900 text-white px-4 py-2 rounded-md text-sm font-medium shadow-sm transition"
                >
                  <Building size={16} />
                  <span>
                    {user.role === 'citizen'
                      ? 'নাগরিক ড্যাশবোর্ড'
                      : user.role === 'union_officer'
                      ? 'ইউনিয়ন অফিস'
                      : user.role === 'ac_land'
                      ? 'এসি ল্যান্ড কোর্ট'
                      : user.role === 'sub_registrar'
                      ? 'সাব-রেজিস্ট্রি'
                      : 'প্রশাসনিক প্যানেল'}
                  </span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-3.5 py-1.5 text-sm font-medium text-gov-blue hover:bg-blue-50 rounded-md transition"
                >
                  লগইন
                </Link>
                <Link
                  to="/register"
                  className="px-3.5 py-1.5 text-sm font-medium bg-gov-blue hover:bg-slate-900 text-white rounded-md shadow-sm transition"
                >
                  নিবন্ধন
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden items-center gap-2">
            {user && (
              <button
                onClick={handleDashboardRedirect}
                className="bg-gov-blue text-white px-3 py-1.5 rounded text-xs font-semibold"
              >
                ড্যাশবোর্ড
              </button>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-md"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-2 animate-in fade-in slide-in-from-top-2">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-sm font-medium text-slate-800 hover:bg-slate-100"
          >
            হোম
          </Link>
          <Link
            to="/search-land"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-sm font-medium text-slate-800 hover:bg-slate-100"
          >
            জমি খুঁজুন
          </Link>
          <Link
            to="/verify-land"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-sm font-medium text-slate-800 hover:bg-slate-100"
          >
            কেনার আগে যাচাই
          </Link>
          <Link
            to="/services"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-sm font-medium text-slate-800 hover:bg-slate-100"
          >
            সেবাসমূহ
          </Link>
          <Link
            to="/how-it-works"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-sm font-medium text-slate-800 hover:bg-slate-100"
          >
            কীভাবে কাজ করে
          </Link>
          <Link
            to="/help"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-sm font-medium text-slate-800 hover:bg-slate-100"
          >
            সহায়তা
          </Link>

          <div className="border-t pt-3 mt-2">
            {user ? (
              <div className="space-y-2">
                <button
                  onClick={() => {
                    handleDashboardRedirect();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-center bg-gov-blue text-white py-2 rounded-md text-sm font-semibold"
                >
                  আমার ড্যাশবোর্ড
                </button>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-center text-red-600 py-1.5 text-xs font-semibold"
                >
                  লগআউট
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-2 border rounded-md text-sm font-medium text-slate-800"
                >
                  লগইন
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-2 bg-gov-blue text-white rounded-md text-sm font-medium"
                >
                  নিবন্ধন
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
