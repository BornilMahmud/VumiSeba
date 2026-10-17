import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import {
  Menu,
  X,
  Search,
  ShieldCheck,
  ChevronDown,
  Building,
  HelpCircle,
  Compass,
  FileText,
  BadgeCheck,
  Landmark,
  Sun,
  Moon,
  LogOut,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [servicesDropdown, setServicesDropdown] = useState(false);
  const servicesRef = useRef<HTMLDivElement>(null);
  const { user, logout } = useAuth();
  const { language, toggleLanguage, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  // Close dropdown on outside click or clicking other navbar elements
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (servicesRef.current && !servicesRef.current.contains(event.target as Node)) {
        setServicesDropdown(false);
      }
    };

    if (servicesDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [servicesDropdown]);

  // Close dropdown on route change
  useEffect(() => {
    setServicesDropdown(false);
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Close dropdown on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setServicesDropdown(false);
      }
    };
    if (servicesDropdown) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [servicesDropdown]);

  const isActive = (path: string) => location.pathname === path;

  const handleHomeClick = (e: React.MouseEvent) => {
    if (location.pathname === '/') {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth',
      });
      if (document.documentElement) {
        document.documentElement.scrollTo({
          top: 0,
          left: 0,
          behavior: 'smooth',
        });
      }
    }
  };

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
    <header className="navbar bg-white/90 dark:bg-transparent backdrop-blur-md border-b border-slate-200/90 dark:border-slate-800/40 sticky top-0 z-40 transition-colors duration-200 shadow-none">
      {/* Top Ministry Banner */}
      <div className="gov-top-banner bg-slate-900/95 dark:bg-transparent text-slate-200 text-[10.5px] sm:text-[11px] py-1 px-3 sm:px-4 border-b border-slate-800/60 dark:border-slate-800/30">
        <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-10 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
            <span className="inline-block w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-emerald-400 shrink-0"></span>
            <span className="font-medium text-slate-300 truncate">
              <span className="sm:hidden">
                {language === 'bn'
                  ? 'বাংলাদেশ সরকার | ভূমি মন্ত্রণালয়'
                  : 'Govt. of Bangladesh | Ministry of Land'}
              </span>
              <span className="hidden sm:inline">
                {t('gov.title', 'গণপ্রজাতন্ত্রী বাংলাদেশ সরকার | ভূমি মন্ত্রণালয় ও নিবন্ধন পরিদপ্তর', 'Government of Bangladesh | Ministry of Land')}
              </span>
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 text-slate-300 shrink-0 whitespace-nowrap text-[10px] sm:text-[11px]">
            <span className="font-medium">
              <span className="text-slate-400">{language === 'bn' ? 'হেল্পলাইন: ' : 'Helpline: '}</span>
              <strong className="text-emerald-400 font-bold">{language === 'bn' ? '১৬১২২' : '16122'}</strong>
              <span className="hidden sm:inline text-slate-400"> ({language === 'bn' ? 'টোল ফ্রি' : 'Toll Free'})</span>
            </span>
            <span className="hidden md:inline text-slate-600">|</span>
            <span className="hidden md:inline text-slate-400">support@land.gov.bd</span>
          </div>
        </div>
      </div>

      {/* Main Navbar Bar */}
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-10">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Identity */}
          <Link to="/" onClick={handleHomeClick} className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white flex items-center justify-center font-bold text-xl border border-emerald-500/30 shrink-0">
              🏛️
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  {t('brand.name', 'ভূমিসেবা', 'VumiSeba')}
                </span>
                <span className="text-[10px] bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-semibold px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800/60">
                  {t('brand.subtitle', 'স্মার্ট ল্যান্ডটেক', 'Smart LandTech')}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:block font-medium whitespace-nowrap">
                {t('brand.tagline', 'স্মার্ট ডিজিটাল ভূমি সেবা ও ই-নামজারি', 'Smart Land Services & E-Mutation')}
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2 text-sm font-medium">
            <Link
              to="/"
              onClick={handleHomeClick}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
                isActive('/')
                  ? 'text-emerald-700 dark:text-emerald-400 font-bold bg-emerald-50/80 dark:bg-transparent'
                  : 'text-slate-700 dark:text-slate-200 hover:text-emerald-700 dark:hover:text-emerald-400 hover:bg-slate-100/70 dark:hover:bg-white/5 dark:bg-transparent'
              }`}
            >
              {t('nav.home', 'হোম', 'Home')}
            </Link>

            <Link
              to="/search-land"
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
                isActive('/search-land')
                  ? 'text-emerald-700 dark:text-emerald-400 font-bold bg-emerald-50/80 dark:bg-transparent'
                  : 'text-slate-700 dark:text-slate-200 hover:text-emerald-700 dark:hover:text-emerald-400 hover:bg-slate-100/70 dark:hover:bg-white/5 dark:bg-transparent'
              }`}
            >
              <span>{t('nav.searchLand', 'জমি খুঁজুন', 'Search Land')}</span>
            </Link>

            <Link
              to="/verify-land"
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
                isActive('/verify-land')
                  ? 'text-emerald-700 dark:text-emerald-400 font-bold bg-emerald-50/80 dark:bg-transparent'
                  : 'text-slate-700 dark:text-slate-200 hover:text-emerald-700 dark:hover:text-emerald-400 hover:bg-slate-100/70 dark:hover:bg-white/5 dark:bg-transparent'
              }`}
            >
              <span>{t('nav.verifyLand', 'কেনার আগে যাচাই', 'Verify Land')}</span>
            </Link>

            <Link
              to="/how-it-works"
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
                isActive('/how-it-works')
                  ? 'text-emerald-700 dark:text-emerald-400 font-bold bg-emerald-50/80 dark:bg-transparent'
                  : 'text-slate-700 dark:text-slate-200 hover:text-emerald-700 dark:hover:text-emerald-400 hover:bg-slate-100/70 dark:hover:bg-white/5 dark:bg-transparent'
              }`}
            >
              <span>{t('nav.howItWorks', 'কীভাবে কাজ করে', 'How It Works')}</span>
            </Link>

            {/* Services Dropdown */}
            <div className="relative" ref={servicesRef}>
              <button
                onClick={() => setServicesDropdown(!servicesDropdown)}
                className={`px-3 py-1.5 rounded-lg whitespace-nowrap text-slate-700 dark:text-slate-200 hover:text-emerald-700 dark:hover:text-emerald-400 hover:bg-slate-100/70 dark:hover:bg-white/5 dark:bg-transparent transition-colors flex items-center gap-1 ${
                  servicesDropdown ? 'bg-slate-100/80 dark:bg-slate-800/80 text-emerald-700 dark:text-emerald-400' : ''
                }`}
                aria-expanded={servicesDropdown}
                aria-haspopup="true"
              >
                <span>{t('nav.services', 'সেবাসমূহ', 'Services')}</span>
                <ChevronDown size={14} className={`text-slate-400 transition-transform duration-200 ${servicesDropdown ? 'rotate-180 text-emerald-600 dark:text-emerald-400' : ''}`} />
              </button>

              {servicesDropdown && (
                <div
                  className="absolute left-0 mt-1 w-64 bg-white dark:bg-slate-900 rounded-xl shadow-card-hover border border-slate-200 dark:border-slate-800 p-2 z-50 animate-in fade-in slide-in-from-top-1"
                >
                  <Link
                    to="/services"
                    onClick={() => setServicesDropdown(false)}
                    className="block px-3 py-2.5 rounded-lg text-xs font-bold text-slate-900 dark:text-slate-100 hover:bg-emerald-50 dark:hover:bg-emerald-950/60 hover:text-emerald-800 dark:hover:text-emerald-300 transition-colors border-b border-slate-100 dark:border-slate-800"
                  >
                    {language === 'en' ? 'All Land Services Directory' : 'সকল ভূমি সেবার তালিকা'}
                  </Link>
                  <Link
                    to="/citizen/sell"
                    onClick={() => setServicesDropdown(false)}
                    className="block px-3 py-2 rounded-lg text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors"
                  >
                    {language === 'en' ? 'Apply to Sell Land' : 'জমি বিক্রির আবেদন'}
                  </Link>
                  <Link
                    to="/citizen/tax"
                    onClick={() => setServicesDropdown(false)}
                    className="block px-3 py-2 rounded-lg text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors"
                  >
                    {language === 'en' ? 'Land Development Tax & Dakhila' : 'ভূমি উন্নয়ন কর ও দাখিলা'}
                  </Link>
                  <Link
                    to="/citizen/mutation"
                    onClick={() => setServicesDropdown(false)}
                    className="block px-3 py-2 rounded-lg text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors"
                  >
                    {language === 'en' ? 'E-Mutation Status Tracking' : 'ই-নামজারি ট্র্যাকিং'}
                  </Link>
                </div>
              )}
            </div>

            <Link
              to={user && user.role === 'citizen' ? '/citizen/help' : '/help'}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
                isActive('/help') || isActive('/citizen/help')
                  ? 'text-emerald-700 dark:text-emerald-400 font-bold bg-emerald-50/80 dark:bg-transparent'
                  : 'text-slate-700 dark:text-slate-200 hover:text-emerald-700 dark:hover:text-emerald-400 hover:bg-slate-100/70 dark:hover:bg-white/5 dark:bg-transparent'
              }`}
            >
              <span>{t('nav.help', 'সহায়তা ও এফএকিউ', 'Help & FAQ')}</span>
            </Link>
          </nav>

          {/* Right Action Menu: Theme & Lang Switchers + User Dashboard Shortcut / Login */}
          <div className="hidden lg:flex items-center gap-2.5">
            {/* Theme Toggle Button - Icons Only */}
            <button
              onClick={toggleTheme}
              className="h-9 w-9 inline-flex items-center justify-center rounded-lg text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 dark:bg-transparent transition active:scale-95 cursor-pointer"
              title={theme === 'dark' ? (language === 'en' ? 'Switch to Light Theme' : 'লাইট থিম চালু করুন') : (language === 'en' ? 'Switch to Dark Theme' : 'ডার্ক থিম চালু করুন')}
              aria-label="Toggle dark/light theme"
            >
              {theme === 'dark' ? (
                <Sun size={19} className="text-amber-400" />
              ) : (
                <Moon size={19} className="text-slate-600 dark:text-slate-300" />
              )}
            </button>

            {/* Language Switcher Button - Same height as other buttons */}
            <button
              onClick={toggleLanguage}
              className="h-9 px-3 text-xs font-bold rounded-lg border border-slate-300 dark:border-slate-700/60 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/10 dark:bg-transparent hover:text-emerald-600 dark:hover:text-emerald-400 inline-flex items-center justify-center transition active:scale-95 cursor-pointer"
              title={language === 'bn' ? 'Switch to English' : 'বাংলায় দেখুন'}
              aria-label="Toggle language"
            >
              <span>{language === 'bn' ? 'English' : 'বাংলা'}</span>
            </button>

            <div className="h-5 w-px bg-slate-200 dark:bg-slate-700 mx-0.5" />

            {user ? (
              <div className="flex items-center gap-2 sm:gap-2.5">
                {/* Dashboard Button */}
                <button
                  onClick={handleDashboardRedirect}
                  className="h-9 inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 rounded-lg text-xs font-bold shadow-xs hover:shadow transition transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
                >
                  <Building size={14} />
                  <span>{t('nav.dashboard', 'ড্যাশবোর্ড', 'Dashboard')}</span>
                </button>

                {/* Logout Button */}
                <button
                  onClick={async () => {
                    await logout();
                    navigate('/login');
                  }}
                  className="h-9 inline-flex items-center gap-1.5 px-3 rounded-lg text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 transition active:scale-95 cursor-pointer"
                  title={t('nav.logout', 'লগআউট', 'Logout')}
                >
                  <LogOut size={14} />
                  <span>{t('nav.logout', 'লগআউট', 'Logout')}</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="h-9 px-4 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 dark:bg-transparent rounded-lg inline-flex items-center justify-center transition"
                >
                  {t('nav.login', 'লগইন', 'Login')}
                </Link>
                <Link
                  to="/register"
                  className="h-9 px-4 text-sm font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg shadow-xs hover:shadow inline-flex items-center justify-center transition transform hover:-translate-y-0.5 active:translate-y-0"
                >
                  {t('nav.register', 'নিবন্ধন', 'Register')}
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Action Area */}
          <div className="flex lg:hidden items-center gap-1.5 sm:gap-2">
            {/* Theme Toggle Button - Icons Only */}
            <button
              onClick={toggleTheme}
              className="h-8 w-8 inline-flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 dark:bg-transparent rounded-lg transition active:scale-95 cursor-pointer"
              title="Toggle theme"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <Sun size={18} className="text-amber-400" />
              ) : (
                <Moon size={18} className="text-slate-600 dark:text-slate-300" />
              )}
            </button>

            {/* Language Switcher Button - Language Name Only, No Icons */}
            <button
              onClick={toggleLanguage}
              className="h-8 px-2.5 text-xs font-bold rounded-md border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/10 dark:bg-transparent inline-flex items-center justify-center transition active:scale-95 cursor-pointer"
              title="Toggle language"
              aria-label="Toggle language"
            >
              <span>{language === 'bn' ? 'English' : 'বাংলা'}</span>
            </button>

            {user && (
              <button
                onClick={handleDashboardRedirect}
                className="h-8 bg-emerald-600 text-white px-2.5 rounded-lg text-xs font-bold shadow-xs inline-flex items-center justify-center"
              >
                {t('nav.dashboard', 'ড্যাশবোর্ড', 'Dashboard')}
              </button>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="h-8 w-8 inline-flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 dark:bg-transparent rounded-lg transition"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 pt-3 pb-6 space-y-2 animate-in fade-in slide-in-from-top-2">
          <Link
            to="/"
            onClick={(e) => {
              handleHomeClick(e);
              setMobileMenuOpen(false);
            }}
            className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
          >
            {t('nav.home', 'হোম', 'Home')}
          </Link>
          <Link
            to="/search-land"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
          >
            {t('nav.searchLand', 'জমি খুঁজুন', 'Search Land')}
          </Link>
          <Link
            to="/verify-land"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
          >
            {t('nav.verifyLand', 'কেনার আগে যাচাই', 'Verify Land')}
          </Link>
          <Link
            to="/services"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
          >
            {t('nav.services', 'সেবাসমূহ', 'Services')}
          </Link>
          <Link
            to="/how-it-works"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
          >
            {t('nav.howItWorks', 'কীভাবে কাজ করে', 'How It Works')}
          </Link>
          <Link
            to={user && user.role === 'citizen' ? '/citizen/help' : '/help'}
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
          >
            {t('nav.help', 'সহায়তা', 'Help & FAQ')}
          </Link>

          <div className="border-t border-slate-200 dark:border-slate-800 pt-3 mt-2">
            {user ? (
              <div className="space-y-2">
                <button
                  onClick={() => {
                    handleDashboardRedirect();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 rounded-lg text-sm font-bold shadow-xs"
                >
                  <Building size={16} />
                  <span>{t('nav.dashboard', 'ড্যাশবোর্ড', 'Dashboard')}</span>
                </button>
                <button
                  onClick={async () => {
                    await logout();
                    setMobileMenuOpen(false);
                    navigate('/login');
                  }}
                  className="w-full inline-flex items-center justify-center gap-2 border border-rose-200 dark:border-rose-900/60 bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 py-2.5 rounded-lg text-xs font-bold"
                >
                  <LogOut size={15} />
                  <span>{t('nav.logout', 'লগআউট', 'Logout')}</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-2.5 border border-slate-300 dark:border-slate-700 rounded-lg text-sm font-semibold text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
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
