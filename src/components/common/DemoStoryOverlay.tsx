import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import {
  Sparkles,
  ChevronRight,
  ChevronLeft,
  X,
  Play,
  RotateCcw,
  CheckCircle2,
  ShieldAlert,
  Building2,
  Scale,
  FileCheck,
  UserCheck,
  Zap,
  Minimize2,
  Maximize2,
} from 'lucide-react';

export interface StoryStep {
  stepNumber: number;
  titleBn: string;
  titleEn: string;
  personaId: string;
  personaRole: string;
  personaNameBn: string;
  personaNameEn: string;
  icon: any;
  targetPath: string;
  problemSolvedBn: string;
  problemSolvedEn: string;
  howItWorksBn: string;
  howItWorksEn: string;
  whatJudgeSeesBn: string;
  whatJudgeSeesEn: string;
}

const STORY_STEPS: StoryStep[] = [
  {
    stepNumber: 1,
    titleBn: '১. কেনার আগে জমি যাচাই (Check Before You Buy)',
    titleEn: '1. Check Before You Buy (Pre-Purchase Audit)',
    personaId: 'buyer',
    personaRole: 'citizen',
    personaNameBn: 'ক্রেতা (ফারহান)',
    personaNameEn: 'Buyer (Farhan)',
    icon: UserCheck,
    targetPath: '/verify-land?parcel_id=pcl-clean-405',
    problemSolvedBn: 'বায়না করার পর জানতে পারা যে জমিতে মামলা, বকেয়া খাজনা বা বিক্রেতার হিস্যা নেই — বাংলাদেশে ভূমি জালিয়াতির প্রধান উৎস।',
    problemSolvedEn: 'Buyers often pay earnest money before discovering court disputes, unpaid taxes, or that seller owns less than offered.',
    howItWorksBn: 'স্বয়ংক্রিয় ঝুঁকি ইঞ্জিন খতিয়ানের হিস্যা, বকেয়া খাজনা, আদালতের স্থগিতাদেশ এবং ব্যাংক মর্টগেজ মিলিয়ে তাৎক্ষণিক ০-১০০ স্কোর ও স্বচ্ছ ফ্যাক্টর তালিকা প্রদান করে।',
    howItWorksEn: 'Transparent risk engine verifies seller share, land tax ledger, court dispute flags, and mortgage liens with clear factor breakdown.',
    whatJudgeSeesBn: '১-ক্লিক ডেমো দৃশ্যপটে "নিরাপদ জমি (দাগ ৪০৫)" বনাম "আদালত স্থগিতাদেশ (দাগ ৭১০)" তুলনা করুন। ক্রিটিক্যাল ওভাররাইড লক্ষ্য করুন।',
    whatJudgeSeesEn: 'Test Clean Plot 405 vs Court Injunction Plot 710. Notice how critical factors strictly override aggregate scores.',
  },
  {
    stepNumber: 2,
    titleBn: '২. এলডি ট্যাক্স বকেয়া ও দাখিলা ক্লিয়ারেন্স',
    titleEn: '2. Land Tax Dues & e-Dakhila Clearance',
    personaId: 'taxdue',
    personaRole: 'citizen',
    personaNameBn: 'কর বকেয়া বিক্রেতা (লতিফ)',
    personaNameEn: 'Tax-Due Seller (Latif)',
    icon: Zap,
    targetPath: '/citizen/tax-clearance',
    problemSolvedBn: 'বকেয়া খাজনা গোপন রেখে জমি বিক্রি করলে সরকারি রাজস্ব ক্ষতি হয় এবং পরবর্তীতে ক্রেতা নামজারি করতে পারেন না।',
    problemSolvedEn: 'Sellers conceal years of unpaid land taxes, trapping innocent buyers in stalled mutation proceedings.',
    howItWorksBn: 'সার্ভার-সাইড হার্ড ব্লক: হোল্ডিং লেজারে বকেয়া থাকলে বিক্রয় আবেদন সাবমিট করা যায় না। অনলাইন পেমেন্ট বা ক্লিয়ারেন্সের পর দাখিলা নম্বর জারি হয়।',
    howItWorksEn: 'Server-side hard guard blocks sale application until outstanding holding dues are fully cleared and clearance ID generated.',
    whatJudgeSeesBn: 'দাগ ৮৮২ এর ৪,৮৫০ টাকা বকেয়া প্রদর্শিত হয় এবং বিক্রয় আবেদনের পূর্বশর্ত হিসেবে ট্যাক্স ক্লিয়ারেন্স বাধ্যতামূলক করা হয়।',
    whatJudgeSeesEn: 'Plot 882 shows ৳4,850 dues. Sale submission is gated until tax clearance certificate is obtained.',
  },
  {
    stepNumber: 3,
    titleBn: '৩. বিক্রয় আবেদন ও হিস্যা লক (Over-Selling Guard)',
    titleEn: '3. Sale Application & Cryptographic Share Guard',
    personaId: 'seller',
    personaRole: 'citizen',
    personaNameBn: 'বিক্রেতা (রফিকুল)',
    personaNameEn: 'Seller (Rafiqul)',
    icon: FileCheck,
    targetPath: '/citizen/sell-land?parcel_id=pcl-clean-405',
    problemSolvedBn: 'ডাবল-সেল ও অতিরিক্ত বিক্রি: একজন বিক্রেতা তার অংশের চেয়ে বেশি জমি একই সাথে একাধিক জনের কাছে বায়না বা বিক্রি করার চেষ্টা করে।',
    problemSolvedEn: 'Double-selling and over-selling: sellers simultaneously contract to sell more than their recorded inheritance share.',
    howItWorksBn: 'ফিক্সড ইন্টিজার বেসিস পয়েন্ট (১০,০০০ BPS) এবং পেন্ডিং শেয়ার রিজার্ভেশন: আবেদন সাবমিট হতেই বিক্রেতার আনকমিটেড হিস্যা লক হয়ে যায়।',
    howItWorksEn: 'Basis-point integer arithmetic (10,000 BPS) with pending share reservation locks seller interest upon submission.',
    whatJudgeSeesBn: 'দাগ ১০২ তে নজরুল ০.১২৫ অংশের মালিক হয়ে ০.২৫ বিক্রির চেষ্টা করলে সার্ভার তাৎক্ষণিকভাবে "400 হিস্যা ঘাটতি" ত্রুটি দেয়।',
    whatJudgeSeesEn: 'Plot 102: Nazrul owns 0.125 but attempts to sell 0.25; the API strictly halts submission with a 400 Share Limit error.',
  },
  {
    stepNumber: 4,
    titleBn: '৪. ইউনিয়ন ভূমি সহকারী সরেজমিন তদন্ত ও প্রতিবেদন',
    titleEn: '4. Union Field Investigation & Report',
    personaId: 'union_officer',
    personaRole: 'union_land_officer',
    personaNameBn: 'তহশিলদার (নাজমা আক্তার)',
    personaNameEn: 'Union Land Officer',
    icon: Building2,
    targetPath: '/office/union/dashboard',
    problemSolvedBn: 'শারীরিক দখল ও স্থানীয় আইনি জটিলতা যা অনলাইনে থাকে না — সরেজমিন তদন্তের রিপোর্ট সমন্বিতভাবে সিস্টেমে যুক্ত হয়।',
    problemSolvedEn: 'Physical boundary disputes and on-ground tenancy claims are formally inspected and recorded on the ledger.',
    howItWorksBn: 'ইউনিয়ন কর্মকর্তা সরেজমিন সীমানা ও দখল পরীক্ষা করে অনলাইন প্রতিবেদনে সুপারিশ প্রদান বা শর্তযুক্ত মন্তব্য লিপিবদ্ধ করেন।',
    howItWorksEn: 'Union officer inspects on-ground boundaries and submits a structured recommendation with tenant verification notes.',
    whatJudgeSeesBn: 'ইউনিয়ন ড্যাশবোর্ডে অপেক্ষমাণ আবেদনের কিউ, পুরাতন আবেদন আগে সর্টিং এবং এক ক্লিকে তদন্ত প্রতিবেদন অনুমোদন।',
    whatJudgeSeesEn: 'Review queue sorted oldest-first, SLA age counter, and 1-click inspection report approval.',
  },
  {
    stepNumber: 5,
    titleBn: '৫. সহকারী কমিশনার (ভূমি) অনাপত্তি অনুমোদন (NOC)',
    titleEn: '5. AC (Land) Title Verification & NOC Approval',
    personaId: 'ac_land',
    personaRole: 'ac_land',
    personaNameBn: 'এসি ল্যান্ড (মাহমুদুল হাসান)',
    personaNameEn: 'AC Land (Court)',
    icon: Scale,
    targetPath: '/office/ac-land/dashboard',
    problemSolvedBn: 'ভুয়া দলিল বা খাস জমি ব্যক্তি মালিকানায় বিক্রির সুযোগ সম্পূর্ণ বন্ধ হয়। সাব-রেজিস্ট্রির আগেই রাজস্ব বিভাগের অনাপত্তি সম্পন্ন হয়।',
    problemSolvedEn: 'Prevents fraudulent alienation of government or vested property before reaching deed registration.',
    howItWorksBn: 'এসি ল্যান্ডের অনুমোদনে অটোমেটিক রি-ভ্যালিডেশন কাজ করে (সাবমিশনের পর কোনো মামলা বা লিয়েন এসেছে কিনা পুনরায় যাচাই)।',
    howItWorksEn: 'Downstream re-validation executes before AC Land signs off, ensuring no injunction emerged post-submission.',
    whatJudgeSeesBn: 'উপজেলা ড্যাশবোর্ডে আবেদন অনুমোদন হতেই আবেদনকারীর জন্য সাব-রেজিস্ট্রিতে স্লট বুকিং সক্রিয় হয়।',
    whatJudgeSeesEn: 'AC Land NOC approval automatically triggers registration readiness and appointment scheduling for buyer and seller.',
  },
  {
    stepNumber: 6,
    titleBn: '৬. সাব-রেজিস্ট্রি দলিল সম্পাদন ও বায়োমেট্রিক',
    titleEn: '6. Sub-Registry Deed Execution & Biometrics',
    personaId: 'sub_registrar',
    personaRole: 'sub_registrar',
    personaNameBn: 'সাব-রেজিস্ট্রার (আবুল কালাম আজাদ)',
    personaNameEn: 'Sub-Registrar',
    icon: FileCheck,
    targetPath: '/office/registry/dashboard',
    problemSolvedBn: 'রেজিস্ট্রেশনের পর নামজারি না করায় বছরের পর বছর হাজার হাজার দলিল ঝুলে থাকে এবং একই জমি বারবার বিক্রি হয়।',
    problemSolvedEn: 'Eliminates the decades-old gap between deed registration and e-mutation that enables subsequent land fraud.',
    howItWorksBn: 'বায়োমেট্রিক ও ই-দলিলে সাব-রেজিস্ট্রারের চূড়ান্ত স্বাক্ষরের সাথে সাথে একটি পারমাণবিক (Atomic) ট্রানজ্যাকশনে স্বত্ব আপডেট ও ই-নামজারি কেস স্পন হয়।',
    howItWorksEn: 'Sub-Registrar deed completion atomically commits deed record and spawns linked e-Mutation case in single mutex transaction.',
    whatJudgeSeesBn: '"দলিল সম্পাদন নিশ্চিত করুন" বাটনে ক্লিক করলে তাৎক্ষণিকভাবে নতুন দলিল নম্বর ও ই-নামজারি কেস নম্বর সৃষ্টি হয়।',
    whatJudgeSeesEn: 'Clicking "Complete Deed Registration" instantly generates official Deed # and initiates automated e-Mutation case.',
  },
  {
    stepNumber: 7,
    titleBn: '৭. স্বয়ংক্রিয় ই-নামজারি কেস সৃষ্টি ও ট্র্যাকিং',
    titleEn: '7. Automated e-Mutation Case Generation',
    personaId: 'buyer',
    personaRole: 'citizen',
    personaNameBn: 'ক্রেতা (ফারহান)',
    personaNameEn: 'Buyer (Farhan)',
    icon: Zap,
    targetPath: '/citizen/mutation-tracking',
    problemSolvedBn: 'নাগরিককে দলিলের নকল তোলার জন্য মাসব্যাপী অপেক্ষা ও দালালদের দ্বারে দ্বারে ঘুরে নতুন করে নামজারি আবেদন করার প্রয়োজন নেই।',
    problemSolvedEn: 'Citizens no longer wait months to retrieve deed copies or hire intermediaries to manually file mutation petitions.',
    howItWorksBn: 'সাব-রেজিস্ট্রির ডেটা সরাসরি এসি ল্যান্ড ও তহশিল সার্ভিসে পুশ হয়। কোনো নতুন আবেদন ফি বা ম্যানুয়াল ফর্ম পূরণ ছাড়াই কেস চলমান হয়।',
    howItWorksEn: 'Deed metadata is automatically pushed across inter-office bus directly into AC Land mutation docket.',
    whatJudgeSeesBn: 'নাগরিকের মিউটেশন ট্র্যাকিং পেজে তাৎক্ষণিকভাবে কেস স্ট্যাটাস, শুনানি সূচি এবং ৯-ধাপ টাইমলাইন দৃশ্যমান হয়।',
    whatJudgeSeesEn: 'Buyer sees the new e-Mutation docket, automated hearing appointment, and 9-stage live status tracker.',
  },
  {
    stepNumber: 8,
    titleBn: '৮. নতুন নামজারি খতিয়ান ও চূড়ান্ত ডিজিটাল রেকর্ড',
    titleEn: '8. Final Mutation Khatian & Land Ledger Update',
    personaId: 'buyer',
    personaRole: 'citizen',
    personaNameBn: 'ক্রেতা (ফারহান)',
    personaNameEn: 'Buyer (Farhan)',
    icon: CheckCircle2,
    targetPath: '/citizen/my-land',
    problemSolvedBn: 'অসম্পূর্ণ নামজারির অবসান — ক্রেতার নামে সম্পূর্ণ নতুন খতিয়ান ও ডিসিআর প্রস্তুত এবং বিক্রেতার খতিয়ানের হিস্যা স্বয়ংক্রিয়ভাবে হ্রাস।',
    problemSolvedEn: 'Full circle: buyer receives a new digital Khatian, seller interest is decremented, zero fractional leakage.',
    howItWorksBn: 'অনুমোদিত মিউটেশন কেস থেকে নতুন খতিয়ান রেকর্ড প্রস্তুত হয় যা কিউআর কোডযুক্ত এবং পাবলিক অনুসন্ধানে তাৎক্ষণিক দৃশ্যমান হয়।',
    howItWorksEn: 'Approved mutation issues official Khatian with verifiable QR token and updates public parcel registry immediately.',
    whatJudgeSeesBn: 'নাগরিকের ডিজিটাল ভল্টে সংরক্ষিত নতুন খতিয়ান, কিউআর কোড ভেরিফিকেশন এবং জমি কেনা থেকে নামজারি সম্পন্ন।',
    whatJudgeSeesEn: 'Buyer owns the newly registered plot in digital vault; seller share decremented from 0.50 to 0.45 without drift.',
  },
];

export const DemoStoryOverlay: React.FC = () => {
  const isDemoMode = import.meta.env.VITE_DEMO_MODE !== 'false';
  if (!isDemoMode) return null;

  const { switchDemoPersona } = useAuth();
  const { language } = useLanguage();
  const isBn = language === 'bn';
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [isSwitching, setIsSwitching] = useState(false);

  const step = STORY_STEPS[currentStepIdx];

  const handleGoToStep = async (idx: number) => {
    if (idx < 0 || idx >= STORY_STEPS.length) return;
    setIsSwitching(true);
    setCurrentStepIdx(idx);
    const targetStep = STORY_STEPS[idx];

    try {
      await switchDemoPersona(targetStep.personaId, targetStep.personaRole);
      navigate(targetStep.targetPath);
    } catch (err) {
      console.error('Demo story persona switch error:', err);
    } finally {
      setIsSwitching(false);
    }
  };

  const handleNext = () => {
    if (currentStepIdx < STORY_STEPS.length - 1) {
      handleGoToStep(currentStepIdx + 1);
    }
  };

  const handlePrev = () => {
    if (currentStepIdx > 0) {
      handleGoToStep(currentStepIdx - 1);
    }
  };

  const StepIcon = step.icon;

  return (
    <>
      {/* Floating Demo Trigger Button (Fixed bottom-left when closed) */}
      {!isOpen && (
        <button
          onClick={() => {
            setIsOpen(true);
            setIsMinimized(false);
            handleGoToStep(currentStepIdx);
          }}
          className="no-print fixed bottom-6 left-6 z-50 flex items-center gap-2.5 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-bold px-4 py-3 rounded-full shadow-2xl border-2 border-emerald-300 hover:scale-105 active:scale-95 transition-all text-xs"
          title="বিচারকদের জন্য গাইড করা ৩ মিনিটের ডেমো উপস্থাপন"
        >
          <Sparkles size={16} className="text-yellow-300 animate-spin" />
          <span>{isBn ? '৩-মিনিট ডেমো গল্প (Judge Demo Story)' : '3-Min Judge Demo Story'}</span>
          <span className="bg-white/20 px-2 py-0.5 rounded-full text-[10px]">
            {currentStepIdx + 1}/৮
          </span>
        </button>
      )}

      {/* Floating Minimized Pill when docked on left */}
      {isOpen && isMinimized && (
        <div className="no-print fixed bottom-4 sm:bottom-6 left-3 sm:left-6 z-50 flex items-center gap-2 bg-gradient-to-r from-emerald-800 via-teal-800 to-slate-900 text-white p-2 sm:px-4 sm:py-2.5 rounded-2xl shadow-2xl border-2 border-emerald-400 font-bengali animate-in slide-in-from-bottom-2 duration-150">
          <div className="flex items-center gap-2">
            <Sparkles size={16} className="text-yellow-300 animate-spin" />
            <div className="text-xs">
              <span className="font-bold text-emerald-200">
                {isBn ? `ধাপ ${step.stepNumber}/৮:` : `Step ${step.stepNumber}/8:`}
              </span>{' '}
              <span className="font-semibold">{isBn ? step.personaNameBn : step.personaNameEn}</span>
            </div>
          </div>
          <div className="flex items-center gap-1.5 ml-2 border-l border-white/20 pl-2">
            {currentStepIdx < STORY_STEPS.length - 1 ? (
              <button
                onClick={handleNext}
                disabled={isSwitching}
                className="bg-emerald-500 hover:bg-emerald-600 text-white text-[11px] font-bold px-2 py-1 rounded-lg flex items-center gap-1 transition"
                title={isBn ? 'পরবর্তী ধাপ' : 'Next Step'}
              >
                <span>{isBn ? 'পরবর্তী' : 'Next'}</span>
                <ChevronRight size={13} />
              </button>
            ) : null}
            <button
              onClick={() => setIsMinimized(false)}
              className="bg-white/15 hover:bg-white/25 text-white text-[11px] font-bold px-2 py-1 rounded-lg flex items-center gap-1 transition"
              title={isBn ? 'বড় করুন' : 'Expand'}
            >
              <Maximize2 size={13} />
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="bg-white/15 hover:bg-rose-500/50 text-white p-1 rounded-lg transition"
              title={isBn ? 'বন্ধ করুন' : 'Close'}
            >
              <X size={14} />
            </button>
          </div>
        </div>
      )}

      {/* Guided Walkthrough Left-Sided Companion Panel (Non-blocking, website on right remains visible) */}
      {isOpen && !isMinimized && (
        <aside
          aria-label={isBn ? 'বিচারকদের ডেমো উপস্থাপনা' : 'Judge Demo Story'}
          className="no-print fixed left-3 sm:left-5 top-12 sm:top-14 bottom-3 sm:bottom-4 z-50 w-[calc(100vw-1.5rem)] sm:w-[410px] lg:w-[440px] max-w-full font-bengali flex flex-col pointer-events-auto"
        >
          <div className="bg-white/98 backdrop-blur-md w-full h-full rounded-2xl shadow-2xl border-2 border-emerald-500/40 ring-1 ring-slate-900/10 overflow-hidden flex flex-col animate-in slide-in-from-left-4 duration-200">
            {/* Header */}
            <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-slate-900 text-white px-4 py-3 flex items-center justify-between gap-2 shrink-0">
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-7 h-7 rounded-lg bg-emerald-500/30 border border-emerald-400 flex items-center justify-center shrink-0">
                  <Sparkles size={16} className="text-yellow-300" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-extrabold text-xs sm:text-sm leading-tight truncate">
                      {isBn ? 'বিচারকদের ৩-মিনিট ডেমো গল্প' : '3-Minute Judge Demo Story'}
                    </h3>
                    <span className="bg-white/20 text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                      {step.stepNumber}/৮
                    </span>
                  </div>
                  <p className="text-[10px] text-emerald-200 truncate">
                    {isBn
                      ? 'বায়না যাচাই থেকে স্বয়ংক্রিয় নামজারি — লাইভ সাইট ভিউ'
                      : 'From Pre-Purchase Audit to Auto-Mutation'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={() => setIsMinimized(true)}
                  className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition"
                  title={isBn ? 'মিনিমাইজ করুন' : 'Minimize'}
                >
                  <Minimize2 size={13} />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-7 h-7 rounded-lg bg-white/10 hover:bg-rose-500/40 text-white flex items-center justify-center transition"
                  title={isBn ? 'বন্ধ করুন' : 'Close'}
                >
                  <X size={15} />
                </button>
              </div>
            </div>

            {/* Step Progress Bar */}
            <div className="bg-slate-50 px-4 py-2 flex items-center justify-between text-xs border-b border-slate-200 shrink-0">
              <div className="flex items-center gap-1.5 min-w-0">
                <span className="text-[11px] font-bold text-slate-600 shrink-0">
                  {isBn ? `ধাপ ${step.stepNumber}/৮:` : `Step ${step.stepNumber}/8:`}
                </span>
                <span className="text-[11px] text-emerald-700 font-extrabold truncate">
                  {isBn ? step.personaNameBn : step.personaNameEn}
                </span>
              </div>

              <div className="flex gap-1 shrink-0">
                {STORY_STEPS.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => handleGoToStep(i)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      i === currentStepIdx
                        ? 'bg-emerald-600 scale-125'
                        : i < currentStepIdx
                        ? 'bg-teal-400'
                        : 'bg-slate-300'
                    }`}
                    title={`ধাপ ${i + 1}`}
                  />
                ))}
              </div>
            </div>

            {/* Main Content Area */}
            <div className="p-4 overflow-y-auto space-y-3 text-xs text-slate-800 flex-1">
              {/* Step Title & Persona Badge */}
              <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-slate-100">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="p-1.5 rounded-lg bg-teal-50 text-teal-700 border border-teal-200 shrink-0">
                    <StepIcon size={18} />
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-extrabold text-sm text-slate-900 leading-tight">
                      {isBn ? step.titleBn : step.titleEn}
                    </h4>
                    <span className="text-[11px] text-slate-500 font-medium block truncate">
                      {isBn ? 'সক্রিয় পারসোনা:' : 'Active Persona:'}{' '}
                      <strong className="text-teal-700">
                        {isBn ? step.personaNameBn : step.personaNameEn}
                      </strong>
                    </span>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-[10px] text-slate-500 block font-mono bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                    {step.targetPath}
                  </span>
                </div>
              </div>

              {/* 3 Pillars: Problem -> Tech Solution -> What to see */}
              <div className="space-y-2.5">
                {/* 1. Problem Solved */}
                <div className="bg-red-50/80 border border-red-200 rounded-xl p-3">
                  <span className="font-bold text-red-900 text-[11px] block mb-1 flex items-center gap-1.5">
                    <ShieldAlert size={14} className="text-red-600 shrink-0" />
                    <span>{isBn ? 'বাস্তব সমস্যা (Problem Solved):' : 'The Problem Solved:'}</span>
                  </span>
                  <p className="text-red-950 font-medium text-xs leading-relaxed">
                    {isBn ? step.problemSolvedBn : step.problemSolvedEn}
                  </p>
                </div>

                {/* 2. Technical Solution */}
                <div className="bg-emerald-50/80 border border-emerald-200 rounded-xl p-3">
                  <span className="font-bold text-emerald-900 text-[11px] block mb-1 flex items-center gap-1.5">
                    <Zap size={14} className="text-emerald-700 shrink-0" />
                    <span>{isBn ? 'প্রযুক্তিগত সমাধান (How It Works):' : 'Technical Solution:'}</span>
                  </span>
                  <p className="text-emerald-950 font-medium text-xs leading-relaxed">
                    {isBn ? step.howItWorksBn : step.howItWorksEn}
                  </p>
                </div>

                {/* 3. What to Observe */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
                  <span className="font-bold text-slate-800 text-[11px] block mb-1 flex items-center gap-1.5">
                    <Play size={13} className="text-teal-700 shrink-0" />
                    <span>{isBn ? 'স্ক্রিনে এখন যা দেখবেন (Observe on Right):' : 'What Judges Should Observe:'}</span>
                  </span>
                  <p className="text-slate-700 font-medium text-xs leading-relaxed">
                    {isBn ? step.whatJudgeSeesBn : step.whatJudgeSeesEn}
                  </p>
                </div>
              </div>
            </div>

            {/* Modal Footer Controls */}
            <div className="bg-slate-50 px-4 py-3 border-t border-slate-200 flex items-center justify-between gap-2 shrink-0">
              <button
                onClick={handlePrev}
                disabled={currentStepIdx === 0 || isSwitching}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold border border-slate-300 bg-white hover:bg-slate-100 disabled:opacity-40 transition"
              >
                <ChevronLeft size={15} />
                <span>{isBn ? 'পূর্ববর্তী' : 'Prev'}</span>
              </button>

              <button
                onClick={() => handleGoToStep(currentStepIdx)}
                disabled={isSwitching}
                className="inline-flex items-center gap-1 text-[11px] text-teal-700 font-semibold hover:underline"
                title={isBn ? 'এই পৃষ্ঠায় পুনরায় যান' : 'Reload Current Step'}
              >
                <RotateCcw size={12} className={isSwitching ? 'animate-spin' : ''} />
                <span className="hidden sm:inline">{isBn ? 'পুনরায় যান' : 'Reload'}</span>
              </button>

              {currentStepIdx < STORY_STEPS.length - 1 ? (
                <button
                  onClick={handleNext}
                  disabled={isSwitching}
                  className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition"
                >
                  <span>{isBn ? 'পরবর্তী ধাপ' : 'Next Step'}</span>
                  <ChevronRight size={15} />
                </button>
              ) : (
                <button
                  onClick={() => setIsOpen(false)}
                  className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-lg text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white shadow-sm transition"
                >
                  <CheckCircle2 size={14} />
                  <span>{isBn ? 'সম্পন্ন' : 'Finish'}</span>
                </button>
              )}
            </div>
          </div>
        </aside>
      )}
    </>
  );
};
