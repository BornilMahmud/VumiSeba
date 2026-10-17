import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { api } from '../../services/api';
import { UserCheck, Shield, Building2, Scale, FileText, User, Sparkles, LogOut, RotateCcw } from 'lucide-react';

export const DemoPersonaBar: React.FC = () => {
  const isDemoMode = import.meta.env.VITE_DEMO_MODE !== 'false';
  if (!isDemoMode) {
    return null;
  }

  const { user, switchDemoPersona, logout } = useAuth();
  const { language, t } = useLanguage();
  const navigate = useNavigate();
  const [resetting, setResetting] = useState(false);

  const personas = [
    { id: 'seller', labelBn: 'বিক্রেতা (আরমান)', labelEn: 'Seller (Arman)', role: 'citizen', icon: User, path: '/citizen/dashboard' },
    { id: 'buyer', labelBn: 'ক্রেতা (ফারহান)', labelEn: 'Buyer (Farhan)', role: 'citizen', icon: UserCheck, path: '/citizen/dashboard' },
    { id: 'taxdue', labelBn: 'কর বকেয়া (লতিফ)', labelEn: 'Tax Due (Latif)', role: 'citizen', icon: FileText, path: '/citizen/dashboard' },
    { id: 'oversell', labelBn: 'অতিরিক্ত হিস্যা (নজরুল)', labelEn: 'Excess Share (Nazrul)', role: 'citizen', icon: FileText, path: '/citizen/dashboard' },
    { id: 'union_officer', labelBn: 'ইউনিয়ন কর্মকর্তা', labelEn: 'Union Land Officer', role: 'union_land_officer', icon: Building2, path: '/office/union/dashboard' },
    { id: 'ac_land', labelBn: 'এসি ল্যান্ড', labelEn: 'AC Land (Court)', role: 'ac_land', icon: Scale, path: '/office/ac-land/dashboard' },
    { id: 'sub_registrar', labelBn: 'সাব-রেজিস্ট্রার', labelEn: 'Sub-Registrar', role: 'sub_registrar', icon: FileText, path: '/office/registry/dashboard' },
    { id: 'central_admin', labelBn: 'সিস্টেম অ্যাডমিন', labelEn: 'System Admin', role: 'central_admin', icon: Shield, path: '/admin/dashboard' },
  ];

  const handleSwitch = async (id: string, role: string, path: string) => {
    const res = await switchDemoPersona(id, role);
    if (res.success) {
      navigate(path);
    }
  };

  const handleResetDemo = async () => {
    if (!window.confirm(language === 'en' ? 'Reset database to clean demo state?' : 'সম্পূর্ণ ডাটাবেজ প্রাথমিক ডেমো অবস্থায় রিসেট করবেন?')) {
      return;
    }
    setResetting(true);
    try {
      const res = await api.officer.resetDemo();
      if (res.success) {
        alert(language === 'en' ? 'Demo database reset successfully!' : 'ডেমো ডাটাবেজ সফলভাবে রিসেট হয়েছে!');
        window.location.reload();
      } else {
        alert(res.message_bn || 'Reset failed');
      }
    } catch (err: any) {
      alert(err.message || 'Reset failed');
    } finally {
      setResetting(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="bg-slate-900 text-slate-200 text-[11px] border-b border-slate-800 py-1.5 px-3 sm:px-4 sticky top-0 z-50 shadow-xs backdrop-blur-md">
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-10 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 bg-emerald-500/15 text-emerald-400 px-2 py-0.5 rounded-full font-medium border border-emerald-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="font-semibold tracking-wide">{t('persona.demoMode', 'ডেমো মোড', 'DEMO MODE')}</span>
          </span>
          <span className="hidden md:inline text-slate-400 font-medium">
            {t('persona.switchPrompt', '১-ক্লিকে ভূমিকা পরিবর্তন:', '1-Click Role Switch:')}
          </span>
        </div>

        <div className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto py-0.5 scrollbar-none">
          {personas.map((p) => {
            const Icon = p.icon;
            const isActive =
              (p.role === 'citizen' && user?.id?.includes(p.id)) ||
              (p.role !== 'citizen' && (user?.role === p.role || (p.role === 'union_land_officer' && user?.role === 'union_officer')));
            const label = language === 'en' ? p.labelEn : p.labelBn;

            return (
              <button
                key={p.id}
                onClick={() => handleSwitch(p.id, p.role, p.path)}
                className={`inline-flex items-center gap-1 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-md transition-all whitespace-nowrap font-medium text-[11px] ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-xs ring-1 ring-emerald-400 font-semibold'
                    : 'bg-slate-800/90 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700/60'
                }`}
                title={`${label}`}
              >
                <Icon size={12} className={isActive ? 'text-white' : 'text-slate-400'} />
                <span>{label}</span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleResetDemo}
            disabled={resetting}
            className="inline-flex items-center gap-1 bg-rose-950/60 hover:bg-rose-900 text-rose-300 hover:text-white px-2 py-0.5 rounded border border-rose-800/80 transition-colors font-semibold text-[11px]"
            title={language === 'en' ? 'Reset database to clean demo state' : 'ডাটাবেজ প্রাথমিক ডেমো অবস্থায় রিসেট করুন'}
          >
            <RotateCcw size={11} className={resetting ? 'animate-spin' : ''} />
            <span>{resetting ? (language === 'en' ? 'Resetting...' : 'রিসেট হচ্ছে...') : (language === 'en' ? 'Reset Demo' : 'রিসেট ডেমো')}</span>
          </button>

          {user ? (
            <div className="flex items-center gap-2">
              <span className="text-slate-300 font-semibold bg-slate-800 px-2 py-0.5 rounded border border-slate-700/80">
                {user.name_bn || (user as any).name || user.email}
              </span>
              <button
                onClick={handleLogout}
                className="text-slate-400 hover:text-rose-400 flex items-center gap-1 transition-colors px-1"
                title={t('nav.logout', 'লগআউট', 'Logout')}
              >
                <LogOut size={12} />
                <span className="hidden sm:inline">{t('nav.logout', 'লগআউট', 'Logout')}</span>
              </button>
            </div>
          ) : (
            <span className="text-slate-400 italic text-[11px]">{t('persona.notLoggedIn', 'লগইন নেই', 'Not logged in')}</span>
          )}
        </div>
      </div>
    </div>
  );
};
