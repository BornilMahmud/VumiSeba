import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import { useLanguage } from '../../context/LanguageContext';
import {
  Menu,
  X,
  Bell,
  Search,
  ShieldCheck,
  ChevronDown,
  Building,
  HelpCircle,
  Compass,
  Globe,
  FileText,
  BadgeCheck,
  Landmark,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [servicesDropdown, setServicesDropdown] = useState(false);
  const { user, logout, isDemoSession } = useAuth();
  const { unreadCount } = useNotifications();
  const { language, toggleLanguage, t } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path: string) => location.pathname === path;

  const handleDashboardRedirect = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    const role = (user.role || '').toLowerCase();
    if (role === 'citizen') navigate('/citizen/dashboard');
    else if (role === 'union_officer' || role === 'union_land_officer') navigate('/office/union/dashboard');
    else if (role === 'ac_land' || role === 'ac_land_officer') navigate('/office/ac-land/dashboard');
    else if (role === 'sub_registrar' || role === 'sub_registry_officer') navigate('/office/registry/dashboard');
    else if (role === 'central_admin' || role === 'admin') navigate('/admin/dashboard');
    else navigate('/citizen/dashboard');
  };

  return (
    <header className="bg-white/95 backdrop-blur-md border-b border-slate-200/90 sticky top-[33px] z-40 shadow-xs">
      {/* Top Ministry Banner & Language Switcher Strip */}
      <div className="bg-slate-900 text-slate-200 text-[11px] py-1 px-4 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400"></span>
            <span className="font-medium text-slate-300">
              {t('gov.title', 'গণপ্রজাতন্ত্রী বাংলাদেশ সরকার | ভূমি মন্ত্রণালয় ও নিবন্ধন পরিদপ্তর', 'Government of Bangladesh | Ministry of Land')}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-3 text-slate-300">
              <span>{t('gov.helpline', 'হেল্পলাইন: ১৬১২২ (টোল ফ্রি)', 'Helpline: 16122 (Toll-Free)')}</span>
              <span className="text-slate-600">|</span>
              <span className="hidden md:inline">support@land.gov.bd</span>
            </div>

            {/* Single Button Tap Language Switcher */}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-200 hover:text-white px-2.5 py-0.5 rounded-full text-[11px] font-bold border border-slate-700 shadow-xs transition-all cursor-pointer"
              title={language === 'bn' ? 'Switch to English (এক ক্লিকে ভাষা পরিবর্তন)' : 'বাংলায় পরিবর্তন করুন (Single tap to switch)'}
              aria-label="Toggle language"
            >
              <Globe size={12} className="text-emerald-400" />
              <span>{language === 'bn' ? 'English' : 'বাংলা'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navbar Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Identity */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white flex items-center justify-center font-bold text-xl shadow-md group-hover:scale-105 transition-transform duration-200">
              🏛️
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-extrabold text-slate-900 tracking-tight">
                  {t('brand.name', 'ভূমিসেবা', 'VumiSeba')}
                </span>
                <span className="text-[10px] bg-emerald-50 text-emerald-700 font-semibold px-2 py-0.5 rounded-full border border-emerald-200">
                  {t('brand.subtitle', 'স্মার্ট ল্যান্ডটেক', 'Smart LandTech')}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block font-medium">
                {t('brand.tagline', 'নাগরিক ভূমি সেবা, রেকর্ড যাচাই ও ই-নামজারি', 'Digital Citizen Land Services & Automated Mutation')}
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 text-sm font-medium">
            <Link
              to="/"
              className={`px-3.5 py-2 rounded-lg transition-colors ${
                isActive('/')
                  ? 'text-emerald-700 font-bold bg-emerald-50/80'
                  : 'text-slate-700 hover:text-emerald-700 hover:bg-slate-50'
              }`}
            >
              {t('nav.home', 'হোম', 'Home')}
            </Link>

            <Link
              to="/search-land"
              className={`px-3.5 py-2 rounded-lg transition-colors flex items-center gap-1.5 ${
                isActive('/search-land')
                  ? 'text-emerald-700 font-bold bg-emerald-50/80'
                  : 'text-slate-700 hover:text-emerald-700 hover:bg-slate-50'
              }`}
            >
              <Search size={15} className="text-slate-400 group-hover:text-emerald-600" />
              <span>{t('nav.searchLand', 'জমি খুঁজুন', 'Search Land')}</span>
            </Link>

            <Link
              to="/verify-land"
              className={`px-3.5 py-2 rounded-lg transition-colors flex items-center gap-1.5 ${
                isActive('/verify-land')
                  ? 'text-emerald-700 font-bold bg-emerald-50/80'
                  : 'text-slate-700 hover:text-emerald-700 hover:bg-slate-50'
              }`}
            >
              <ShieldCheck size={15} className="text-emerald-600" />
              <span>{t('nav.verifyLand', 'কেনার আগে যাচাই', 'Verify Land')}</span>
            </Link>

            <Link
              to="/how-it-works"
              className={`px-3.5 py-2 rounded-lg transition-colors flex items-center gap-1.5 ${
                isActive('/how-it-works')
                  ? 'text-emerald-700 font-bold bg-emerald-50/80'
                  : 'text-slate-700 hover:text-emerald-700 hover:bg-slate-50'
              }`}
            >
              <Compass size={15} className="text-slate-400" />
              <span>{t('nav.howItWorks', 'কীভাবে কাজ করে', 'How It Works')}</span>
            </Link>

            {/* Services Dropdown */}
            <div className="relative">
              <button
                onClick={() => setServicesDropdown(!servicesDropdown)}
                className="px-3.5 py-2 rounded-lg text-slate-700 hover:text-emerald-700 hover:bg-slate-50 transition-colors flex items-center gap-1"
              >
                <span>{t('nav.services', 'সেবাসমূহ', 'Services')}</span>
                <ChevronDown size={14} className="text-slate-400" />
              </button>

              {servicesDropdown && (
                <div
                  onMouseLeave={() => setServicesDropdown(false)}
                  className="absolute left-0 mt-1 w-64 bg-white rounded-xl shadow-card-hover border border-slate-200 p-2 z-50 animate-in fade-in slide-in-from-top-1"
                >
                  <Link
                    to="/services"
                    onClick={() => setServicesDropdown(false)}
                    className="block px-3 py-2.5 rounded-lg text-xs font-bold text-slate-900 hover:bg-emerald-50 hover:text-emerald-800 transition-colors border-b border-slate-100"
                  >
                    {language === 'en' ? 'All Land Services Directory' : 'সকল ভূমি সেবার তালিকা'}
                  </Link>
                  <Link
                    to="/citizen/sell"
                    onClick={() => setServicesDropdown(false)}
                    className="block px-3 py-2 rounded-lg text-xs text-slate-700 hover:bg-slate-50 hover:text-emerald-700 transition-colors"
                  >
                    {language === 'en' ? 'Apply to Sell Land' : 'জমি বিক্রির আবেদন'}
                  </Link>
                  <Link
                    to="/citizen/tax"
                    onClick={() => setServicesDropdown(false)}
                    className="block px-3 py-2 rounded-lg text-xs text-slate-700 hover:bg-slate-50 hover:text-emerald-700 transition-colors"
                  >
                    {language === 'en' ? 'Land Development Tax & Dakhila' : 'ভূমি উন্নয়ন কর ও দাখিলা'}
                  </Link>
                  <Link
                    to="/citizen/mutation"
                    onClick={() => setServicesDropdown(false)}
                    className="block px-3 py-2 rounded-lg text-xs text-slate-700 hover:bg-slate-50 hover:text-emerald-700 transition-colors"
                  >
                    {language === 'en' ? 'E-Mutation Status Tracking' : 'ই-নামজারি ট্র্যাকিং'}
                  </Link>
                </div>
              )}
            </div>

            <Link
              to="/help"
              className={`px-3.5 py-2 rounded-lg transition-colors flex items-center gap-1.5 ${
                isActive('/help')
                  ? 'text-emerald-700 font-bold bg-emerald-50/80'
                  : 'text-slate-700 hover:text-emerald-700 hover:bg-slate-50'
              }`}
            >
              <HelpCircle size={15} className="text-slate-400" />
              <span>{t('nav.help', 'সহায়তা ও প্রশ্নোত্তর', 'Help & FAQ')}</span>
            </Link>
          </nav>

          {/* Right Action Menu: User Dashboard Shortcut / Login */}
          <div className="hidden lg:flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-2">
                {/* Notification Bell */}
                <Link
                  to={user.role === 'citizen' ? '/citizen/notifications' : '#'}
                  className="relative p-2 text-slate-600 hover:text-emerald-700 rounded-lg hover:bg-slate-100 transition"
                  title="বিজ্ঞপ্তি"
                >
                  <Bell size={18} />
                  {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-rose-600 text-white text-[10px] flex items-center justify-center font-bold font-mono">
                      {unreadCount}
                    </span>
                  )}
                </Link>

                {isDemoSession && (
                  <span className="bg-amber-50 text-amber-900 border border-amber-300 text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                    <span>⚠️</span>
                    <span>{t('nav.demoAccount', 'নমুনা অ্যাকাউন্ট', 'Demo Account')}</span>
                  </span>
                )}

                {/* Dashboard Button */}
                <button
                  onClick={handleDashboardRedirect}
                  className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-xs hover:shadow transition transform hover:-translate-y-0.5 active:translate-y-0"
                >
                  <Building size={16} />
                  <span>
                    {user.role === 'citizen'
                      ? (language === 'en' ? 'Citizen Dashboard' : 'নাগরিক ড্যাশবোর্ড')
                      : user.role === 'union_officer'
                      ? (language === 'en' ? 'Union Office' : 'ইউনিয়ন অফিস')
                      : user.role === 'ac_land'
                      ? (language === 'en' ? 'AC Land Court' : 'এসি ল্যান্ড কোর্ট')
                      : user.role === 'sub_registrar'
                      ? (language === 'en' ? 'Sub-Registry' : 'সাব-রেজিস্ট্রি')
                      : (language === 'en' ? 'Admin Panel' : 'প্রশাসনিক প্যানেল')}
                  </span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition"
                >
                  {t('nav.login', 'লগইন', 'Login')}
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg shadow-xs hover:shadow transition transform hover:-translate-y-0.5 active:translate-y-0"
                >
                  {t('nav.register', 'নিবন্ধন', 'Register')}
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button & Language Switch */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1 px-2.5 py-1 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 active:scale-95 rounded-md border border-slate-200 transition"
              title={language === 'bn' ? 'Switch to English' : 'বাংলায় পরিবর্তন করুন'}
              aria-label="Toggle language"
            >
              <Globe size={13} className="text-emerald-600" />
              <span>{language === 'bn' ? 'EN' : 'বাং'}</span>
            </button>
            {user && (
              <button
                onClick={handleDashboardRedirect}
                className="bg-emerald-600 text-white px-3 py-1.5 rounded-md text-xs font-bold"
              >
                {t('nav.dashboard', 'ড্যাশবোর্ড', 'Dashboard')}
              </button>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
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
            className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-800 hover:bg-slate-50"
          >
            {t('nav.home', 'হোম', 'Home')}
          </Link>
          <Link
            to="/search-land"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-800 hover:bg-slate-50"
          >
            {t('nav.searchLand', 'জমি খুঁজুন', 'Search Land')}
          </Link>
          <Link
            to="/verify-land"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-800 hover:bg-slate-50"
          >
            {t('nav.verifyLand', 'কেনার আগে যাচাই', 'Verify Land')}
          </Link>
          <Link
            to="/services"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-800 hover:bg-slate-50"
          >
            {t('nav.services', 'সেবাসমূহ', 'Services')}
          </Link>
          <Link
            to="/how-it-works"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-800 hover:bg-slate-50"
          >
            {t('nav.howItWorks', 'কীভাবে কাজ করে', 'How It Works')}
          </Link>
          <Link
            to="/help"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-800 hover:bg-slate-50"
          >
            {t('nav.help', 'সহায়তা', 'Help & FAQ')}
          </Link>

          <div className="border-t pt-3 mt-2">
            {user ? (
              <div className="space-y-2">
                <button
                  onClick={() => {
                    handleDashboardRedirect();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-center bg-emerald-600 text-white py-2.5 rounded-lg text-sm font-bold shadow-xs"
                >
                  {t('nav.dashboard', 'আমার ড্যাশবোর্ড', 'My Dashboard')}
                </button>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-center text-rose-600 py-2 text-xs font-semibold"
                >
                  {t('nav.logout', 'লগআউট', 'Logout')}
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-2.5 border border-slate-300 rounded-lg text-sm font-semibold text-slate-800 hover:bg-slate-50"
                >
                  {t('nav.login', 'লগইন', 'Login')}
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-2.5 bg-emerald-600 text-white rounded-lg text-sm font-semibold shadow-xs"
                >
                  {t('nav.register', 'নিবন্ধন', 'Register')}
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
