import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Phone, Mail, MapPin, ArrowUp } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export const Footer: React.FC = () => {
  const { language, t } = useLanguage();
  const location = useLocation();
  const [showFloatingTop, setShowFloatingTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowFloatingTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
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
  };

  const handleHomeClick = (e: React.MouseEvent) => {
    if (location.pathname === '/') {
      e.preventDefault();
      scrollToTop();
    }
  };

  return (
    <>
      <footer className="bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-300 font-sans pt-10 pb-6 border-t border-slate-200 dark:border-slate-800 transition-colors duration-200">
        {/* Centered and Compact Container */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-7 lg:gap-8 mb-8 pb-8 border-b border-slate-200/80 dark:border-slate-800 text-left">
            {/* Col 1: Brand & Ministry Context */}
            <div className="space-y-3.5 text-left">
              <Link to="/" onClick={handleHomeClick} className="inline-flex items-center gap-2.5 group cursor-pointer">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white flex items-center justify-center font-bold text-lg shadow-xs group-hover:scale-105 transition-transform shrink-0">
                  🏛️
                </div>
                <div>
                  <span className="text-lg font-extrabold text-slate-900 dark:text-white tracking-tight group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors block leading-tight">
                    {t('brand.name', 'ভূমিসেবা', 'VumiSeba')}
                  </span>
                  <p className="text-[10.5px] text-emerald-700 dark:text-emerald-400 font-semibold leading-tight">
                    {t('brand.subtitle', 'স্মার্ট ল্যান্ডটেক প্ল্যাটফর্ম', 'Smart LandTech Platform')}
                  </p>
                </div>
              </Link>

              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {t(
                  'footer.about',
                  'ভূমি মন্ত্রণালয় ও নিবন্ধন পরিদপ্তরের সমন্বিত সেবার আলোকে নাগরিক পর্যায়ে জমি কেনা-বেচা, যাচাইকরণ, রেজিস্ট্রি ও স্বয়ংক্রিয় ই-নামজারি ট্র্যাকিং সমাধান।',
                  'An integrated GovTech platform enabling transparent land transactions, pre-purchase risk audits, automated deed registration, and smart e-mutation tracking.'
                )}
              </p>

              {/* Live System Status Pill */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/80 dark:border-emerald-800 text-[10.5px] text-emerald-800 dark:text-emerald-300 font-medium">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span>{t('footer.status', 'সকল ডিজিটাল ভূমি সেবা সক্রিয়', 'All Digital Services Operational')}</span>
              </div>
            </div>

            {/* Col 2: Citizen Services */}
            <div className="text-left">
              <h4 className="text-slate-900 dark:text-white font-bold text-sm mb-3.5 flex items-center gap-2">
                <span className="w-1.5 h-3.5 bg-emerald-600 rounded-full"></span>
                <span>{t('footer.citizenServices', 'নাগরিক সেবাসমূহ', 'Citizen Services')}</span>
              </h4>
              <ul className="space-y-2 text-xs">
                <li>
                  <Link to="/search-land" className="text-slate-600 dark:text-slate-400 hover:text-emerald-700 dark:hover:text-emerald-400 hover:translate-x-0.5 transition-all inline-block">
                    {language === 'en' ? 'Search Khatian & Dag Plot' : 'খতিয়ান ও দাগ অনুসন্ধান'}
                  </Link>
                </li>
                <li>
                  <Link to="/verify-land" className="text-slate-600 dark:text-slate-400 hover:text-emerald-700 dark:hover:text-emerald-400 hover:translate-x-0.5 transition-all inline-block font-medium">
                    {language === 'en' ? 'Pre-Purchase Risk Audit (P5)' : 'কেনার আগে ঝুঁকি যাচাই (Risk Audit)'}
                  </Link>
                </li>
                <li>
                  <Link to="/citizen/sell" className="text-slate-600 dark:text-slate-400 hover:text-emerald-700 dark:hover:text-emerald-400 hover:translate-x-0.5 transition-all inline-block">
                    {language === 'en' ? 'Land Sale Online Application' : 'জমি বিক্রির আবেদন প্রণয়ন'}
                  </Link>
                </li>
                <li>
                  <Link to="/citizen/tax" className="text-slate-600 dark:text-slate-400 hover:text-emerald-700 dark:hover:text-emerald-400 hover:translate-x-0.5 transition-all inline-block">
                    {language === 'en' ? 'Land Development Tax & E-Dakhila' : 'ভূমি উন্নয়ন কর ও ই-দাখিলা'}
                  </Link>
                </li>
                <li>
                  <Link to="/citizen/mutation" className="text-slate-600 dark:text-slate-400 hover:text-emerald-700 dark:hover:text-emerald-400 hover:translate-x-0.5 transition-all inline-block">
                    {language === 'en' ? 'Post-Registration E-Mutation Tracking' : 'পোস্ট-রেজিস্ট্রেশন ই-নামজারি ট্র্যাকিং'}
                  </Link>
                </li>
                <li>
                  <Link to="/services" className="text-slate-600 dark:text-slate-400 hover:text-emerald-700 dark:hover:text-emerald-400 hover:translate-x-0.5 transition-all inline-block">
                    {language === 'en' ? 'All Land Services Directory' : 'সকল ভূমিসেবার তালিকা'}
                  </Link>
                </li>
              </ul>
            </div>

            {/* Col 3: Government Circles */}
            <div className="text-left">
              <h4 className="text-slate-900 dark:text-white font-bold text-sm mb-3.5 flex items-center gap-2">
                <span className="w-1.5 h-3.5 bg-teal-600 rounded-full"></span>
                <span>{t('footer.offices', 'সংশ্লিষ্ট দপ্তর ও সার্কেল', 'Associated Offices')}</span>
              </h4>
              <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
                <li className="flex items-center gap-1.5">
                  <span className="w-1 h-1 rounded-full bg-slate-400"></span>
                  <span>{language === 'en' ? 'Union Land Office (Tahsil)' : 'ইউনিয়ন ভূমি অফিস (তহশিল অফিস)'}</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="w-1 h-1 rounded-full bg-slate-400"></span>
                  <span>{language === 'en' ? 'AC Land Revenue Court & Office' : 'উপজেলা ভূমি অফিস / এসি ল্যান্ড কোর্ট'}</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="w-1 h-1 rounded-full bg-slate-400"></span>
                  <span>{language === 'en' ? 'Sub-Registry Office (Deed Registration)' : 'সাব-রেজিস্ট্রি অফিস (নিবন্ধন পরিদপ্তর)'}</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="w-1 h-1 rounded-full bg-slate-400"></span>
                  <span>{language === 'en' ? 'District Settlement & Record Room' : 'জেলা রেকর্ডরুম ও সেটেলমেন্ট শাখা'}</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="w-1 h-1 rounded-full bg-slate-400"></span>
                  <span>{language === 'en' ? 'Ministry Central Administration & Audit' : 'কেন্দ্রীয় ভূমি প্রশাসন ও অডিট সেল'}</span>
                </li>
              </ul>
            </div>

            {/* Col 4: Helpline & Legal Notice */}
            <div className="text-left">
              <h4 className="text-slate-900 dark:text-white font-bold text-sm mb-3.5 flex items-center gap-2">
                <span className="w-1.5 h-3.5 bg-amber-500 rounded-full"></span>
                <span>{t('footer.helpline', 'জরুরি হটলাইন ও সহায়তা', 'Helpline & Assistance')}</span>
              </h4>
              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-2.5 text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-900 p-2 rounded-lg border border-slate-200 dark:border-slate-800">
                  <Phone size={15} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <div>
                    <span className="text-[9.5px] text-slate-500 dark:text-slate-400 block uppercase font-semibold">Toll-Free Helpline</span>
                    <strong className="text-slate-900 dark:text-white font-mono text-sm">১৬১২২</strong>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                  <Mail size={13} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>support@land.gov.bd</span>
                </div>
                <div className="flex items-start gap-2 text-slate-600 dark:text-slate-400">
                  <MapPin size={13} className="text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <span>{language === 'en' ? 'Bhumi Bhaban, Tejgaon I/A, Dhaka-1208' : 'ভূমি ভবন, তেজগাঁও শিল্প এলাকা, ঢাকা-১২০৮'}</span>
                </div>
              </div>

              <div className="mt-3 p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[10.5px] text-slate-500 dark:text-slate-400 leading-normal">
                <strong className="text-slate-700 dark:text-slate-300">{language === 'en' ? 'Legal Notice:' : 'আইনি বিজ্ঞপ্তি:'}</strong>{' '}
                {t(
                  'footer.disclaimer',
                  'ভূমিসেবা একটি পাইলট ডেমো ব্যবস্থা। এটি কোনো বেসরকারি প্ল্যাটফর্ম দ্বারা সরকারি সিলমোহর বা নিবন্ধিত দলিলের আইনগত বিকল্প নয়।',
                  'VumiSeba is an interoperable GovTech prototype. Official deed certification is subject to relevant statutory land registration acts.'
                )}
              </div>
            </div>
          </div>

          {/* Bottom Bar: Copyright, Policy Links, and Circled To-The-Top Button */}
          <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 dark:text-slate-400 gap-3">
            <p className="text-left">
              {t('footer.copyright', '© ২০২৬ ভূমিসেবা (VumiSeba) ল্যান্ডটেক উদ্যোগ। সর্বস্বত্ব সংরক্ষিত।', '© 2026 VumiSeba LandTech Initiative. All rights reserved.')}
            </p>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-3 text-xs font-medium">
                <Link to="/help" className="hover:text-emerald-700 dark:hover:text-emerald-400 transition">
                  {t('footer.privacy', 'গোপনীয়তা নীতিমালা', 'Privacy Policy')}
                </Link>
                <span className="text-slate-300 dark:text-slate-700">·</span>
                <Link to="/help" className="hover:text-emerald-700 dark:hover:text-emerald-400 transition">
                  {t('footer.terms', 'ব্যবহারের শর্তাবলী', 'Terms of Service')}
                </Link>
                <span className="text-slate-300 dark:text-slate-700">·</span>
                <Link to="/help" className="hover:text-emerald-700 dark:hover:text-emerald-400 transition">
                  {t('footer.faq', 'সচরাচর জিজ্ঞাসা', 'FAQ')}
                </Link>
              </div>

              {/* Circled To-the-Top Button in Footer */}
              <button
                type="button"
                onClick={scrollToTop}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-emerald-600 dark:bg-slate-800 dark:hover:bg-emerald-600 text-slate-600 hover:text-white dark:text-slate-300 dark:hover:text-white border border-slate-200 dark:border-slate-700 hover:border-emerald-500 shadow-2xs hover:shadow transition-all duration-200 flex items-center justify-center cursor-pointer group active:scale-90 shrink-0 ml-1"
                title={language === 'bn' ? 'পৃষ্ঠার শীর্ষে যান' : 'Scroll to top'}
                aria-label={language === 'bn' ? 'পৃষ্ঠার শীর্ষে যান' : 'Scroll to top'}
              >
                <ArrowUp size={14} className="group-hover:-translate-y-0.5 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating Circled To-the-Top Button (Appears when scrolled down > 300px, positioned cleanly above Chatbot Bubble) */}
      {showFloatingTop && (
        <button
          type="button"
          onClick={scrollToTop}
          className="fixed bottom-[86px] right-[26px] sm:bottom-[92px] sm:right-[30px] z-40 w-11 h-11 rounded-full bg-white dark:bg-slate-900 hover:bg-emerald-600 dark:hover:bg-emerald-600 text-slate-700 hover:text-white dark:text-slate-200 dark:hover:text-white border border-slate-200 dark:border-slate-700 hover:border-emerald-500 shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center cursor-pointer group active:scale-95 animate-in fade-in zoom-in-75"
          title={language === 'bn' ? 'পৃষ্ঠার শীর্ষে যান' : 'Scroll to top'}
          aria-label={language === 'bn' ? 'পৃষ্ঠার শীর্ষে যান' : 'Scroll to top'}
        >
          <ArrowUp size={18} className="group-hover:-translate-y-0.5 transition-transform drop-shadow-xs" />
        </button>
      )}
    </>
  );
};
