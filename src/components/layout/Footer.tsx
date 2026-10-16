import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Phone, Mail, MapPin, ExternalLink } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 font-bengali pt-12 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 pb-8 border-b border-slate-800">
          {/* Col 1: Brand & Purpose */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded bg-gov-blue text-white flex items-center justify-center font-bold text-lg">
                🏛️
              </div>
              <div>
                <span className="text-xl font-bold text-white tracking-tight">ভূমিসেবা</span>
                <p className="text-[11px] text-teal-400 font-medium">স্মার্ট ল্যান্ডটেক প্ল্যাটফর্ম</p>
              </div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              ভূমি মন্ত্রণালয় ও নিবন্ধন পরিদপ্তরের সমন্বিত সেবার আলোকে নাগরিক পর্যায়ে জমি কেনা-বেচা, যাচাইকরণ, রেজিস্ট্রি ও স্বয়ংক্রিয় ই-নামজারি ট্র্যাকিং সমাধান।
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>হ্যাকাথন এমভিপি সংস্করণ ১.০ (Hackathon MVP)</span>
            </div>
          </div>

          {/* Col 2: Citizen Services */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-3 border-l-2 border-teal-500 pl-2">
              নাগরিক সেবাসমূহ
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/search-land" className="hover:text-white transition">
                  খতিয়ান ও দাগ অনুসন্ধান
                </Link>
              </li>
              <li>
                <Link to="/verify-land" className="hover:text-white transition">
                  কেনার আগে ঝুঁকি যাচাই (Check Before You Buy)
                </Link>
              </li>
              <li>
                <Link to="/citizen/sell" className="hover:text-white transition">
                  জমি বিক্রির আবেদন প্রণয়ন
                </Link>
              </li>
              <li>
                <Link to="/citizen/tax" className="hover:text-white transition">
                  ভূমি উন্নয়ন কর ও ই-দাখিলা
                </Link>
              </li>
              <li>
                <Link to="/citizen/mutation" className="hover:text-white transition">
                  পোস্ট-রেজিস্ট্রেশন ই-নামজারি ট্র্যাকিং
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Government Offices */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-3 border-l-2 border-gov-blue pl-2">
              সংশ্লিষ্ট দপ্তর ও সার্কেল
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>ইউনিয়ন ভূমি অফিস (তহশিল অফিস)</li>
              <li>উপজেলা ভূমি অফিস / সহকারী কমিশনার (ভূমি)</li>
              <li>সাব-রেজিস্ট্রি অফিস (নিবন্ধন পরিদপ্তর)</li>
              <li>জেলা রেকর্ডরুম ও সেটেলমেন্ট অফিস</li>
              <li>কেন্দ্রীয় ভূমি প্রশাসন ও অডিট শাখা</li>
            </ul>
          </div>

          {/* Col 4: Helpline & Legal Disclaimer */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-3 border-l-2 border-amber-500 pl-2">
              জরুরি হটলাইন ও সহায়তা
            </h4>
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2 text-slate-300">
                <Phone size={14} className="text-teal-400 shrink-0" />
                <span>হটলাইন: <strong className="text-white font-mono text-sm">১৬১২২</strong> (ভূমি সেবা)</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <Mail size={14} className="text-teal-400 shrink-0" />
                <span>support@land.gov.bd</span>
              </div>
              <div className="flex items-center gap-2 text-slate-400">
                <MapPin size={14} className="text-teal-400 shrink-0" />
                <span>ভূমি ভবন, তেজগাঁও শিল্প এলাকা, ঢাকা-১২০৮</span>
              </div>
            </div>

            <div className="mt-4 p-2.5 rounded bg-slate-800/80 border border-slate-700 text-[11px] text-slate-400 leading-normal">
              <strong>আইনি বিজ্ঞপ্তি:</strong> ভূমিসেবা একটি পাইলট ডেমো ব্যবস্থা। এটি কোনো বেসরকারি অ্যাপ দ্বারা সরকারি সিলমোহর বা নিবন্ধিত দলিলের আইনগত বিকল্প নয়।
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-2">
          <p>© ২০২৬ ভূমিসেবা (VumiSeba) ল্যান্ডটেক উদ্যোগ। সর্বস্বত্ব সংরক্ষিত।</p>
          <div className="flex items-center gap-4 text-xs">
            <Link to="/help" className="hover:text-slate-300">গোপনীয়তা নীতিমালা</Link>
            <Link to="/help" className="hover:text-slate-300">ব্যবহারের শর্তাবলী</Link>
            <Link to="/help" className="hover:text-slate-300">সচরাচর জিজ্ঞাসা</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
