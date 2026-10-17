import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'bn' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (key: string, bnFallback?: string, enFallback?: string) => string;
}

const translations: Record<string, { bn: string; en: string }> = {
  // Navigation & Top bar
  'gov.title': {
    bn: 'গণপ্রজাতন্ত্রী বাংলাদেশ সরকার | ভূমি মন্ত্রণালয় ও নিবন্ধন পরিদপ্তর ডিজিটাল উদ্যোগ',
    en: 'Government of the People\'s Republic of Bangladesh | Ministry of Land & Directorate of Registration',
  },
  'gov.helpline': {
    bn: 'হেল্পলাইন: ১৬১২২ (টোল ফ্রি)',
    en: 'Helpline: 16122 (Toll Free)',
  },
  'gov.email': {
    bn: 'ই-মেইল: support@land.gov.bd',
    en: 'Email: support@land.gov.bd',
  },
  'brand.name': {
    bn: 'ভূমিসেবা',
    en: 'VumiSeba',
  },
  'brand.subtitle': {
    bn: 'স্মার্ট ল্যান্ডটেক',
    en: 'Smart LandTech',
  },
  'brand.tagline': {
    bn: 'স্মার্ট ডিজিটাল ভূমি সেবা ও ই-নামজারি',
    en: 'Smart Land Services & E-Mutation',
  },
  'nav.home': {
    bn: 'হোম',
    en: 'Home',
  },
  'nav.searchLand': {
    bn: 'জমি খুঁজুন',
    en: 'Search Land',
  },
  'nav.verifyLand': {
    bn: 'কেনার আগে যাচাই',
    en: 'Verify Land',
  },
  'nav.howItWorks': {
    bn: 'কীভাবে কাজ করে',
    en: 'How It Works',
  },
  'nav.services': {
    bn: 'সেবাসমূহ',
    en: 'Services',
  },
  'nav.help': {
    bn: 'সহায়তা ও প্রশ্নোত্তর',
    en: 'Help & FAQ',
  },
  'nav.login': {
    bn: 'লগইন',
    en: 'Login',
  },
  'nav.register': {
    bn: 'নিবন্ধন',
    en: 'Register',
  },
  'nav.dashboard': {
    bn: 'ড্যাশবোর্ড',
    en: 'Dashboard',
  },
  'nav.logout': {
    bn: 'লগআউট',
    en: 'Logout',
  },
  'nav.demoAccount': {
    bn: 'নমুনা অ্যাকাউন্ট',
    en: 'Demo Account',
  },

  // Hero Section
  'hero.badge': {
    bn: 'জাতীয় ল্যান্ডটেক প্ল্যাটফর্ম — সমন্বিত ডিজিটাল ভূমি সেবা',
    en: 'National LandTech Platform — Unified Digital Land Services',
  },
  'hero.title1': {
    bn: 'জমি কেনা থেকে নামজারি',
    en: 'From Land Purchase to Mutation',
  },
  'hero.titleHighlight': {
    bn: 'এক ক্লিকে নির্ভুল যাচাই',
    en: 'One-Click Accurate Verification',
  },
  'hero.title2': {
    bn: 'ও স্মার্ট রেজিস্ট্রি',
    en: '& Smart Registry',
  },
  'hero.desc': {
    bn: 'বায়না করার আগেই মালিকানার সত্যতা, খতিয়ান ও দাগের বৈধতা, বকেয়া খাজনা এবং আদালতের মোকদ্দমা যাচাই করুন। দলিল নিবন্ধনের পর স্বয়ংক্রিয়ভাবে শুরু হবে আপনার ই-নামজারি ও নতুন খতিয়ান জারির প্রক্রিয়া।',
    en: 'Verify ownership authenticity, khatian and dag validity, tax arrears, and court cases before earnest money. Automated e-mutation and new record of rights begin directly after deed registration.',
  },
  'hero.ctaVerify': {
    bn: 'কেনার আগে জমি যাচাই করুন',
    en: 'Verify Land Before Buying',
  },
  'hero.ctaSell': {
    bn: 'জমি বিক্রির আবেদন',
    en: 'Apply to Sell Land',
  },
  'hero.searchTitle': {
    bn: 'সরাসরি খতিয়ান ও দাগ অনুসন্ধান',
    en: 'Direct Khatian & Dag Plot Search',
  },
  'hero.searchSubtitle': {
    bn: 'বাংলাদেশের যেকোনো মৌজার জমি ও মালিকানা তাৎক্ষণিক অনুসন্ধান করুন',
    en: 'Instant search for land plots and ownership across any mouza in Bangladesh',
  },
  'search.district': {
    bn: 'জেলা',
    en: 'District',
  },
  'search.upazila': {
    bn: 'উপজেলা/সার্কেল',
    en: 'Upazila / Circle',
  },
  'search.mouza': {
    bn: 'মৌজা',
    en: 'Mouza',
  },
  'search.khatian': {
    bn: 'খতিয়ান নম্বর',
    en: 'Khatian No.',
  },
  'search.dag': {
    bn: 'দাগ নম্বর',
    en: 'Dag Plot No.',
  },
  'search.btn': {
    bn: 'অনুসন্ধান করুন',
    en: 'Records',
  },
  'search.sampleLabel': {
    bn: 'পরীক্ষার জন্য নমুনা দাগ:',
    en: 'Sample plots for testing:',
  },
  'search.sampleSafe': {
    bn: '৪০৫ (নিরাপদ)',
    en: '405 (Safe)',
  },
  'search.sampleTax': {
    bn: '৮৮২ (কর বকেয়া)',
    en: '882 (Tax Due)',
  },
  'search.sampleShare': {
    bn: '১০২ (হিস্যা ঘাটতি)',
    en: '102 (Share Deficit)',
  },
  'search.sampleCase': {
    bn: '৭১০ (মামলা/মর্টগেজ)',
    en: '710 (Case/Mortgage)',
  },
  'search.advanced': {
    bn: 'উন্নত অনুসন্ধান →',
    en: 'Advanced Search →',
  },

  // Problem 5 Banner
  'p5.badge': {
    bn: 'সমস্যা ৫ — কেনার আগে যাচাই',
    en: 'Problem 5 — Pre-Purchase Verification',
  },
  'p5.title': {
    bn: 'প্রতারণা ও ভূমি বিরোধ এড়াতে বায়নার পূর্বেই স্বয়ংক্রিয় অডিট',
    en: 'Automated Land Audit Before Purchase to Prevent Fraud & Disputes',
  },
  'p5.desc': {
    bn: 'বিক্রেতার নামে রেকর্ডীয় হিস্যা রয়েছে কি না, জমিটিতে কোনো গোপন ব্যাংক ঋণ, দেওয়ানি আদালতের মামলা, সরকারি খাস বা অধিগ্রহণ রয়েছে কি না তা তাৎক্ষণিক যাচাই করে সিদ্ধান্ত নিন।',
    en: 'Instantly verify recorded seller shares, undisclosed bank mortgages, civil litigation injunctions, vested property, or government acquisitions before committing funds.',
  },
  'p5.check1': {
    bn: 'হিস্যা অতিরিক্ত বিক্রি রোধ',
    en: 'Prevent Excess Share Sales',
  },
  'p5.check2': {
    bn: 'ডুপ্লিকেট সেল চেক',
    en: 'Duplicate Deed Check',
  },
  'p5.check3': {
    bn: 'বকেয়া খাজনা ব্লক',
    en: 'Tax Arrears Guard',
  },
  'p5.check4': {
    bn: 'মামলার লাল সতর্কতা',
    en: 'Court Litigation Red Alert',
  },
  'p5.cta': {
    bn: 'ঝুঁকি ক্যালকুলেটর চালু করুন',
    en: 'Launch Risk Calculator',
  },

  // 9 Stage Roadmap
  'roadmap.subtitle': {
    bn: 'সমন্বিত ডিজিটাল সেবা প্রণালী',
    en: 'Unified Digital Service Workflow',
  },
  'roadmap.title': {
    bn: 'ভূমি কেনা-বেচা থেকে ই-নামজারি: ৯টি সহজ ধাপ',
    en: 'From Land Deal to E-Mutation: 9 Clear Stages',
  },
  'roadmap.desc': {
    bn: 'ভূমিসাথী প্ল্যাটফর্মের মাধ্যমে নাগরিক এবং সংশ্লিষ্ট সরকারি দপ্তরসমূহের একটি সুশৃঙ্খল টাইমলাইন',
    en: 'A transparent, orderly timeline connecting citizens with all government land offices',
  },

  // Stats
  'stats.khatian': {
    bn: 'ডিজিটাল খতিয়ান যাচাই',
    en: 'Digital Record Verification',
  },
  'stats.hours': {
    bn: 'স্বয়ংক্রিয় কেস রুজু',
    en: 'Automated Case Filing',
  },
  'stats.offices': {
    bn: 'একীভূত সমন্বিত সিস্টেম',
    en: 'Unified Inter-Office Grid',
  },
  'stats.fraud': {
    bn: 'অতিরিক্ত বিক্রির ঝুঁকি',
    en: 'Risk of Duplicate Fraud',
  },

  // CTA
  'cta.title': {
    bn: 'আপনার জমি সংক্রান্ত যেকোনো প্রয়োজনে আজই যুক্ত হোন',
    en: 'Experience Seamless Digital Land Governance Today',
  },
  'cta.desc': {
    bn: 'খতিয়ান অনুসন্ধান, ঝুঁকি যাচাই কিংবা বিক্রির আবেদন — সম্পূর্ণ সুরক্ষিত ও ডিজিটাল উপায়ে শুরু করুন।',
    en: 'From khatian lookups and pre-purchase audits to digital registry and automated e-mutation — all in one trusted portal.',
  },
  'cta.register': {
    bn: 'বিনামূল্যে অ্যাকাউন্ট খুলুন',
    en: 'Create Citizen Account',
  },
  'cta.login': {
    bn: 'ডেমো লগইন করুন',
    en: 'Explore Demo Logins',
  },

  // Footer
  'footer.about': {
    bn: 'ভূমি মন্ত্রণালয় ও নিবন্ধন পরিদপ্তরের সমন্বিত সেবার আলোকে নাগরিক পর্যায়ে জমি কেনা-বেচা, যাচাইকরণ, রেজিস্ট্রি ও স্বয়ংক্রিয় ই-নামজারি ট্র্যাকিং সমাধান।',
    en: 'An integrated LandTech solution for citizen land transactions, risk audits, deed registrations, and automated e-mutation tracking.',
  },
  'footer.mvp': {
    bn: 'পাইলট সংস্করণ ১.০ (Smart LandTech MVP)',
    en: 'Pilot Release v1.0 (Smart LandTech MVP)',
  },
  'footer.status': {
    bn: 'সকল ডিজিটাল ভূমি সেবা সক্রিয়',
    en: 'All Digital Land Services Operational',
  },
  'footer.citizenServices': {
    bn: 'নাগরিক সেবাসমূহ',
    en: 'Citizen Services',
  },
  'footer.offices': {
    bn: 'সংশ্লিষ্ট দপ্তর ও সার্কেল',
    en: 'Associated Offices & Circles',
  },
  'footer.helpline': {
    bn: 'জরুরি হটলাইন ও সহায়তা',
    en: 'Emergency Hotline & Support',
  },
  'footer.disclaimer': {
    bn: 'আইনি বিজ্ঞপ্তি: ভূমিসেবা একটি পাইলট ডেমো ব্যবস্থা। এটি কোনো বেসরকারি প্ল্যাটফর্ম দ্বারা সরকারি সিলমোহর বা নিবন্ধিত দলিলের আইনগত বিকল্প নয়।',
    en: 'Legal Notice: VumiSeba is an interoperable GovTech demonstration prototype. Official deeds must be certified per statutory laws.',
  },
  'footer.copyright': {
    bn: '© ২০২৬ ভূমিসেবা (VumiSeba) ল্যান্ডটেক উদ্যোগ। সর্বস্বত্ব সংরক্ষিত।',
    en: '© 2026 VumiSeba LandTech Initiative. All rights reserved.',
  },
  'footer.privacy': {
    bn: 'গোপনীয়তা নীতিমালা',
    en: 'Privacy Policy',
  },
  'footer.terms': {
    bn: 'ব্যবহারের শর্তাবলী',
    en: 'Terms of Service',
  },
  'footer.faq': {
    bn: 'সচরাচর জিজ্ঞাসা',
    en: 'FAQ',
  },

  // Demo Persona Bar
  'persona.demoMode': {
    bn: 'ডেমো মোড',
    en: 'DEMO MODE',
  },
  'persona.switchPrompt': {
    bn: '১-ক্লিকে ভূমিকা পরিবর্তন:',
    en: '1-Click Role Switch:',
  },
  'persona.seller': {
    bn: 'বিক্রেতা (আরমান)',
    en: 'Seller (Arman)',
  },
  'persona.buyer': {
    bn: 'ক্রেতা (ফারহান)',
    en: 'Buyer (Farhan)',
  },
  'persona.taxdue': {
    bn: 'কর বকেয়া (লতিফ)',
    en: 'Tax Due (Latif)',
  },
  'persona.oversell': {
    bn: 'অতিরিক্ত হিস্যা (নজরুল)',
    en: 'Excess Share (Nazrul)',
  },
  'persona.union': {
    bn: 'ইউনিয়ন কর্মকর্তা',
    en: 'Union Land Officer',
  },
  'persona.acland': {
    bn: 'এসি ল্যান্ড',
    en: 'AC Land (Court)',
  },
  'persona.registry': {
    bn: 'সাব-রেজিস্ট্রার',
    en: 'Sub-Registrar',
  },
  'persona.admin': {
    bn: 'সিস্টেম অ্যাডমিন',
    en: 'System Admin',
  },
  'persona.notLoggedIn': {
    bn: 'লগইন নেই',
    en: 'Not Logged In',
  },
};

const LanguageContext = createContext<LanguageContextType>({
  language: 'bn',
  setLanguage: () => {},
  toggleLanguage: () => {},
  t: (key: string, bnFallback?: string, enFallback?: string) => bnFallback || key,
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      // Per specification: when website is first opened in a tab, strictly open in Bangla ('bn').
      // Tab-specific language toggles during the active session are preserved in sessionStorage.
      const saved = sessionStorage.getItem('vumiseba_lang');
      return (saved === 'en' || saved === 'bn') ? saved : 'bn';
    } catch {
      return 'bn';
    }
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      sessionStorage.setItem('vumiseba_lang', lang);
    } catch {
      // ignore
    }
    document.documentElement.lang = lang;
  };

  const toggleLanguage = () => {
    const nextLang = language === 'bn' ? 'en' : 'bn';
    setLanguage(nextLang);
  };

  useEffect(() => {
    document.documentElement.lang = language;
    try {
      sessionStorage.setItem('vumiseba_lang', language);
    } catch {
      // ignore
    }
  }, [language]);

  const t = (key: string, bnFallback?: string, enFallback?: string): string => {
    const item = translations[key];
    if (item) {
      return language === 'en' ? item.en : item.bn;
    }
    if (language === 'en' && enFallback) return enFallback;
    if (bnFallback) return bnFallback;
    return key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
