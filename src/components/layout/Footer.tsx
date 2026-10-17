import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Phone, Mail, MapPin, ExternalLink, Activity, Sparkles, Building, Landmark } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export const Footer: React.FC = () => {
  const { language, t } = useLanguage();

  return (
    <footer className="bg-white text-slate-700 font-sans pt-14 pb-8 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12 pb-12 border-b border-slate-200/80">
          {/* Col 1: Brand & Ministry Context */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white flex items-center justify-center font-bold text-xl shadow-xs">
                🏛️
              </div>
              <div>
                <span className="text-xl font-extrabold text-slate-900 tracking-tight">
                  {t('brand.name', 'ভূমিসেবা', 'VumiSeba')}
                </span>
                <p className="text-[11px] text-emerald-700 font-semibold">
                  {t('brand.subtitle', 'স্মার্ট ল্যান্ডটেক প্ল্যাটফর্ম', 'Smart LandTech Platform')}
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              {t(
                'footer.about',
                'ভূমি মন্ত্রণালয় ও নিবন্ধন পরিদপ্তরের সমন্বিত সেবার আলোকে নাগরিক পর্যায়ে জমি কেনা-বেচা, যাচাইকরণ, রেজিস্ট্রি ও স্বয়ংক্রিয় ই-নামজারি ট্র্যাকিং সমাধান।',
                'An integrated GovTech platform enabling transparent land transactions, pre-purchase risk audits, automated deed registration, and smart e-mutation tracking.'
              )}
            </p>

            {/* Live System Status Pill (Inspired by footer.design) */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/80 text-[11px] text-emerald-800 font-medium">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>{t('footer.status', 'সকল ডিজিটাল ভূমি সেবা সক্রিয়', 'All Digital Services Operational')}</span>
            </div>
          </div>

          {/* Col 2: Citizen Services */}
          <div>
            <h4 className="text-slate-900 font-bold text-sm mb-4 flex items-center gap-2">
              <span className="w-1.5 h-4 bg-emerald-600 rounded-full"></span>
              <span>{t('footer.citizenServices', 'নাগরিক সেবাসমূহ', 'Citizen Services')}</span>
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link to="/search-land" className="text-slate-600 hover:text-emerald-700 hover:translate-x-0.5 transition-all inline-block">
                  {language === 'en' ? 'Search Khatian & Dag Plot' : 'খতিয়ান ও দাগ অনুসন্ধান'}
                </Link>
              </li>
              <li>
                <Link to="/verify-land" className="text-slate-600 hover:text-emerald-700 hover:translate-x-0.5 transition-all inline-block font-medium">
                  {language === 'en' ? 'Pre-Purchase Risk Audit (P5)' : 'কেনার আগে ঝুঁকি যাচাই (Risk Audit)'}
                </Link>
              </li>
              <li>
                <Link to="/citizen/sell" className="text-slate-600 hover:text-emerald-700 hover:translate-x-0.5 transition-all inline-block">
                  {language === 'en' ? 'Land Sale Online Application' : 'জমি বিক্রির আবেদন প্রণয়ন'}
                </Link>
              </li>
              <li>
                <Link to="/citizen/tax" className="text-slate-600 hover:text-emerald-700 hover:translate-x-0.5 transition-all inline-block">
                  {language === 'en' ? 'Land Development Tax & E-Dakhila' : 'ভূমি উন্নয়ন কর ও ই-দাখিলা'}
                </Link>
              </li>
              <li>
                <Link to="/citizen/mutation" className="text-slate-600 hover:text-emerald-700 hover:translate-x-0.5 transition-all inline-block">
                  {language === 'en' ? 'Post-Registration E-Mutation Tracking' : 'পোস্ট-রেজিস্ট্রেশন ই-নামজারি ট্র্যাকিং'}
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-slate-600 hover:text-emerald-700 hover:translate-x-0.5 transition-all inline-block">
                  {language === 'en' ? 'All Land Services Directory' : 'সকল ভূমিসেবার তালিকা'}
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Government Circles */}
          <div>
            <h4 className="text-slate-900 font-bold text-sm mb-4 flex items-center gap-2">
              <span className="w-1.5 h-4 bg-teal-600 rounded-full"></span>
              <span>{t('footer.offices', 'সংশ্লিষ্ট দপ্তর ও সার্কেল', 'Associated Offices')}</span>
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-600">
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
          <div>
            <h4 className="text-slate-900 font-bold text-sm mb-4 flex items-center gap-2">
              <span className="w-1.5 h-4 bg-amber-500 rounded-full"></span>
              <span>{t('footer.helpline', 'জরুরি হটলাইন ও সহায়তা', 'Helpline & Assistance')}</span>
            </h4>
            <div className="space-y-2.5 text-xs">
              <div className="flex items-center gap-2.5 text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                <Phone size={16} className="text-emerald-600 shrink-0" />
                <div>
                  <span className="text-[10px] text-slate-500 block uppercase font-semibold">Toll-Free Helpline</span>
                  <strong className="text-slate-900 font-mono text-base">১৬১২২</strong>
                </div>
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <Mail size={14} className="text-emerald-600 shrink-0" />
                <span>support@land.gov.bd</span>
              </div>
              <div className="flex items-start gap-2 text-slate-600">
                <MapPin size={14} className="text-emerald-600 shrink-0 mt-0.5" />
                <span>{language === 'en' ? 'Bhumi Bhaban, Tejgaon I/A, Dhaka-1208' : 'ভূমি ভবন, তেজগাঁও শিল্প এলাকা, ঢাকা-১২০৮'}</span>
              </div>
            </div>

            <div className="mt-4 p-3 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-500 leading-normal">
              <strong>{language === 'en' ? 'Legal Notice:' : 'আইনি বিজ্ঞপ্তি:'}</strong>{' '}
              {t(
                'footer.disclaimer',
                'ভূমিসেবা একটি পাইলট ডেমো ব্যবস্থা। এটি কোনো বেসরকারি প্ল্যাটফর্ম দ্বারা সরকারি সিলমোহর বা নিবন্ধিত দলিলের আইনগত বিকল্প নয়।',
                'VumiSeba is an interoperable GovTech prototype. Official deed certification is subject to relevant statutory land registration acts.'
              )}
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright and Policy Links */}
        <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
          <p>{t('footer.copyright', '© ২০২৬ ভূমিসেবা (VumiSeba) ল্যান্ডটেক উদ্যোগ। সর্বস্বত্ব সংরক্ষিত।', '© 2026 VumiSeba LandTech Initiative. All rights reserved.')}</p>
          <div className="flex items-center gap-4 text-xs font-medium">
            <Link to="/help" className="hover:text-emerald-700 transition">
              {t('footer.privacy', 'গোপনীয়তা নীতিমালা', 'Privacy Policy')}
            </Link>
            <span className="text-slate-300">·</span>
            <Link to="/help" className="hover:text-emerald-700 transition">
              {t('footer.terms', 'ব্যবহারের শর্তাবলী', 'Terms of Service')}
            </Link>
            <span className="text-slate-300">·</span>
            <Link to="/help" className="hover:text-emerald-700 transition">
              {t('footer.faq', 'সচরাচর জিজ্ঞাসা', 'FAQ')}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
