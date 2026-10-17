import React, { useState } from 'react';
import { Eye, EyeOff, Sparkles, CreditCard, ShieldCheck } from 'lucide-react';

export interface BangladeshNidCardProps {
  cardType?: 'smart' | 'laminated' | 'auto';
  isSmartCard?: boolean;
  nameBn?: string;
  nameEn?: string;
  fatherNameBn?: string;
  motherNameBn?: string;
  dateOfBirth?: string;
  nidNo?: string;
  photoUrl?: string;
  signatureUrl?: string;
  signatureText?: string;
  showLaminationBorder?: boolean;
  showControls?: boolean;
  maskNid?: boolean;
  className?: string;
}

/**
 * Format date string into standard NID format (e.g. 01 Jun 2005 or 01 Jan 1987)
 */
export const formatNidDate = (dobString?: string): string => {
  if (!dobString) return '01 Jun 2005';
  
  const trimmed = dobString.trim();
  if (/^\d{2}\s+[A-Za-z]{3}\s+\d{4}$/.test(trimmed)) {
    return trimmed;
  }
  
  try {
    const parts = trimmed.split(/[-/]/);
    if (parts.length === 3) {
      let y = parseInt(parts[0], 10);
      let m = parseInt(parts[1], 10) - 1;
      let d = parseInt(parts[2], 10);
      
      // If input was DD-MM-YYYY
      if (parts[0].length <= 2 && parts[2].length === 4) {
        d = parseInt(parts[0], 10);
        m = parseInt(parts[1], 10) - 1;
        y = parseInt(parts[2], 10);
      }
      
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      if (!isNaN(y) && !isNaN(m) && !isNaN(d) && m >= 0 && m < 12) {
        const dd = d < 10 ? `0${d}` : `${d}`;
        return `${dd} ${months[m]} ${y}`;
      }
    }
  } catch {
    // ignore
  }
  return trimmed;
};

/**
 * Format masked NID number:
 * Displays * or not shown as requested by user.
 */
export const formatMaskedNid = (nid: string = '', isMasked: boolean = true): string => {
  if (!nid) return '*** *** ****';
  const clean = nid.replace(/\s+/g, '');
  
  if (!isMasked) {
    if (clean.length === 10) {
      return `${clean.slice(0, 3)} ${clean.slice(3, 6)} ${clean.slice(6)}`;
    }
    return clean;
  }
  
  // Masked formats
  if (clean.length === 10) {
    return '*** *** ****';
  } else if (clean.length === 17) {
    return '**** **** **** *****';
  } else if (clean.length === 13) {
    return '*** *** *** ****';
  }
  return '*** *** ****';
};

/**
 * Official Vector Emblem of Bangladesh (গণপ্রজাতন্ত্রী বাংলাদেশ সরকার সিলমোহর)
 */
export const BangladeshGovEmblemSvg: React.FC<{ className?: string }> = ({ className = 'w-11 h-11' }) => (
  <svg
    viewBox="0 0 100 100"
    className={`select-none shrink-0 ${className}`}
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Outer Green Ring */}
    <circle cx="50" cy="50" r="47" fill="#047857" stroke="#fbbf24" strokeWidth="2.5" />
    <circle cx="50" cy="50" r="43" fill="none" stroke="#fef08a" strokeWidth="1" strokeDasharray="2 1.5" />
    
    {/* Inner Red Circle */}
    <circle cx="50" cy="50" r="33" fill="#dc2626" stroke="#fbbf24" strokeWidth="1.5" />
    
    {/* Golden Map of Bangladesh inside red circle */}
    <path
      d="M 46 27 C 48 28, 52 28, 54 30 C 56 32, 54 35, 57 37 C 60 39, 63 38, 62 42 C 61 46, 57 47, 56 50 C 55 53, 58 56, 56 59 C 54 62, 50 63, 49 67 C 48 70, 44 68, 43 64 C 42 60, 46 58, 44 54 C 42 50, 39 49, 41 45 C 43 41, 41 37, 43 34 C 45 31, 44 28, 46 27 Z"
      fill="#fde047"
      stroke="#ca8a04"
      strokeWidth="0.8"
    />
    
    {/* 4 Golden Stars around the emblem */}
    <g fill="#fde047">
      <polygon points="17,45 19,41 21,45 17,42 21,42" />
      <polygon points="21,55 23,51 25,55 21,52 25,52" />
      <polygon points="79,45 81,41 83,45 79,42 83,42" />
      <polygon points="75,55 77,51 79,55 75,52 79,52" />
    </g>
    
    {/* Outer Wreath Paddy Ears */}
    <path
      d="M 20 76 C 30 85, 70 85, 80 76 C 72 80, 28 80, 20 76 Z"
      fill="#facc15"
      stroke="#ca8a04"
      strokeWidth="0.5"
    />
  </svg>
);

/**
 * Authentic Metallic Gold EMV Smart Card Chip
 */
export const SmartCardChipSvg: React.FC<{ className?: string }> = ({ className = 'w-14 h-11' }) => (
  <svg
    viewBox="0 0 100 80"
    className={`rounded-lg shadow-sm select-none shrink-0 ${className}`}
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="chipGoldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#fef08a" />
        <stop offset="25%" stopColor="#eab308" />
        <stop offset="50%" stopColor="#fef9c3" />
        <stop offset="75%" stopColor="#ca8a04" />
        <stop offset="100%" stopColor="#854d0e" />
      </linearGradient>
    </defs>
    
    {/* Metallic Chip Base */}
    <rect x="2" y="2" width="96" height="76" rx="8" fill="url(#chipGoldGradient)" stroke="#854d0e" strokeWidth="1.2" />
    
    {/* Micro-etched EMV Contact Segments */}
    {/* Center keyhole / contact hole */}
    <circle cx="50" cy="24" r="5" fill="none" stroke="#78350f" strokeWidth="1.2" opacity="0.8" />
    <circle cx="50" cy="24" r="2.5" fill="#b45309" opacity="0.9" />
    
    {/* Contact isolation grooves */}
    <path d="M 32 2 L 32 78" stroke="#78350f" strokeWidth="1" opacity="0.8" />
    <path d="M 68 2 L 68 78" stroke="#78350f" strokeWidth="1" opacity="0.8" />
    
    <path d="M 2 28 L 32 28" stroke="#78350f" strokeWidth="1" opacity="0.8" />
    <path d="M 68 28 L 98 28" stroke="#78350f" strokeWidth="1" opacity="0.8" />
    <path d="M 2 52 L 98 52" stroke="#78350f" strokeWidth="1" opacity="0.8" />
    
    <path d="M 32 38 L 68 38" stroke="#78350f" strokeWidth="1" opacity="0.8" />
    <path d="M 50 38 L 50 78" stroke="#78350f" strokeWidth="1" opacity="0.8" />
  </svg>
);

/**
 * Optical Security Hologram:
 * Iridescent Water Lily (Shapla) flower with miniature ghost secondary portrait in the center!
 */
export const SmartCardHologram: React.FC<{ photoUrl?: string }> = ({ photoUrl }) => (
  <div className="relative w-12 h-14 sm:w-14 sm:h-16 flex items-center justify-center select-none pointer-events-none">
    {/* Holographic Water Lily (Shapla) Petals */}
    <svg
      viewBox="0 0 100 100"
      className="absolute inset-0 w-full h-full opacity-70 animate-pulse duration-1000"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="holoShine" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.8" />
          <stop offset="35%" stopColor="#ec4899" stopOpacity="0.85" />
          <stop offset="70%" stopColor="#a855f7" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#facc15" stopOpacity="0.85" />
        </linearGradient>
      </defs>
      
      {/* Lotus / Shapla Hologram Petals */}
      <path d="M 50 10 C 40 28, 42 45, 50 60 C 58 45, 60 28, 50 10 Z" fill="url(#holoShine)" />
      <path d="M 50 60 C 30 45, 20 28, 30 18 C 38 30, 42 45, 50 60 Z" fill="url(#holoShine)" opacity="0.75" />
      <path d="M 50 60 C 70 45, 80 28, 70 18 C 62 30, 58 45, 50 60 Z" fill="url(#holoShine)" opacity="0.75" />
      <path d="M 50 60 C 15 50, 10 35, 20 25 C 28 38, 38 52, 50 60 Z" fill="url(#holoShine)" opacity="0.6" />
      <path d="M 50 60 C 85 50, 90 35, 80 25 C 72 38, 62 52, 50 60 Z" fill="url(#holoShine)" opacity="0.6" />
      
      {/* Base Waves */}
      <path d="M 20 75 Q 50 85, 80 75" stroke="url(#holoShine)" strokeWidth="2" fill="none" />
      <path d="M 25 82 Q 50 90, 75 82" stroke="url(#holoShine)" strokeWidth="1.5" fill="none" />
    </svg>

    {/* Secondary Ghost Miniature Portrait */}
    <div className="relative z-10 w-7 h-9 sm:w-8 sm:h-10 rounded-full overflow-hidden border border-cyan-300/50 shadow-inner bg-emerald-950/20 mix-blend-multiply opacity-65">
      <img
        src={photoUrl || '/avatars/default_nid.jpg'}
        alt="Ghost Portrait"
        className="w-full h-full object-cover filter grayscale contrast-125"
        onError={(e) => {
          (e.target as HTMLImageElement).src = '/avatars/default_nid.jpg';
        }}
      />
    </div>
  </div>
);

/**
 * Guilloche Security Waves for Smart NID Card Background
 */
export const GuillocheWavesSvg: React.FC = () => (
  <svg
    viewBox="0 0 500 300"
    className="absolute inset-0 w-full h-full pointer-events-none select-none opacity-25"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Concentric / Intersecting Sine Wave Curves */}
    <path
      d="M -20 50 Q 80 120, 180 40 T 380 90 T 520 40"
      stroke="#059669"
      strokeWidth="0.8"
    />
    <path
      d="M -20 70 Q 80 140, 180 60 T 380 110 T 520 60"
      stroke="#10b981"
      strokeWidth="0.8"
    />
    <path
      d="M -20 90 Q 80 160, 180 80 T 380 130 T 520 80"
      stroke="#ef4444"
      strokeWidth="0.7"
      strokeDasharray="4 2"
    />
    <path
      d="M -20 120 Q 80 190, 180 110 T 380 160 T 520 110"
      stroke="#047857"
      strokeWidth="0.8"
    />
    <path
      d="M -20 150 Q 80 220, 180 140 T 380 190 T 520 140"
      stroke="#ef4444"
      strokeWidth="0.6"
    />
    <path
      d="M -20 180 Q 80 250, 180 170 T 380 220 T 520 170"
      stroke="#10b981"
      strokeWidth="0.8"
    />
    <path
      d="M -20 210 Q 80 280, 180 200 T 380 250 T 520 200"
      stroke="#059669"
      strokeWidth="0.8"
    />
    
    {/* Left Circular Guilloche rosette radiating around photo */}
    <circle cx="85" cy="140" r="50" stroke="#ef4444" strokeWidth="0.6" opacity="0.5" strokeDasharray="3 3" />
    <circle cx="85" cy="140" r="65" stroke="#059669" strokeWidth="0.6" opacity="0.5" />
    <circle cx="85" cy="140" r="80" stroke="#10b981" strokeWidth="0.5" opacity="0.4" strokeDasharray="4 2" />
  </svg>
);

/**
 * Bangladesh Shapla Watermark for Laminated Paper Card
 */
export const ShaplaWatermarkSvg: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg
    viewBox="0 0 200 200"
    className={`w-44 h-44 sm:w-56 sm:h-56 select-none pointer-events-none ${className}`}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="100" cy="100" r="92" stroke="#eab308" strokeWidth="2.5" opacity="0.65" strokeDasharray="4 3" />
    <circle cx="100" cy="100" r="86" stroke="#ca8a04" strokeWidth="1.8" opacity="0.75" />
    <circle cx="100" cy="100" r="81" stroke="#eab308" strokeWidth="1" opacity="0.5" />
    
    <path
      d="M 45 145 C 30 110, 32 65, 80 40 C 65 65, 55 105, 75 145 Z"
      fill="#fde047"
      opacity="0.4"
      stroke="#ca8a04"
      strokeWidth="1.2"
    />
    <path
      d="M 155 145 C 170 110, 168 65, 120 40 C 135 65, 145 105, 125 145 Z"
      fill="#fde047"
      opacity="0.4"
      stroke="#ca8a04"
      strokeWidth="1.2"
    />
    <path d="M 100 22 C 95 32, 95 44, 100 52 C 105 44, 105 32, 100 22 Z" fill="#facc15" stroke="#ca8a04" strokeWidth="1" opacity="0.7" />
    
    <g fill="#ca8a04" opacity="0.8">
      <polygon points="68,36 70,32 72,36 68,33 72,33" />
      <polygon points="60,45 62,41 64,45 60,42 64,42" />
      <polygon points="132,36 130,32 128,36 132,33 128,33" />
      <polygon points="140,45 138,41 136,45 140,42 136,42" />
    </g>

    <g transform="translate(100, 105)">
      <path d="M -50 25 Q -25 18, 0 25 T 50 25" stroke="#ca8a04" strokeWidth="2" fill="none" opacity="0.8" />
      <path d="M -42 32 Q -21 27, 0 32 T 42 32" stroke="#ca8a04" strokeWidth="1.5" fill="none" opacity="0.6" />
      <path d="M 0 -42 C -8 -25, -10 -5, 0 16 C 10 -5, 8 -25, 0 -42 Z" fill="#fef08a" stroke="#ca8a04" strokeWidth="1.5" opacity="0.85" />
      <path d="M 0 16 C -18 -8, -25 -25, -16 -36 C -10 -25, -5 -5, 0 16 Z" fill="#fef08a" stroke="#ca8a04" strokeWidth="1.3" opacity="0.8" />
      <path d="M 0 16 C 18 -8, 25 -25, 16 -36 C 10 -25, 5 -5, 0 16 Z" fill="#fef08a" stroke="#ca8a04" strokeWidth="1.3" opacity="0.8" />
    </g>
  </svg>
);

/**
 * 1. PHOTOREALISTIC BANGLADESH SMART NATIONAL ID CARD
 * Faithfully matches the official Government Smart NID card uploaded in the user's reference image.
 */
export const BangladeshSmartNidCard: React.FC<{
  nameBn?: string;
  nameEn?: string;
  fatherNameBn?: string;
  motherNameBn?: string;
  dateOfBirth?: string;
  nidNo?: string;
  photoUrl?: string;
  signatureUrl?: string;
  signatureText?: string;
  isMasked?: boolean;
}> = ({
  nameBn = 'মারজাহান আক্তার',
  nameEn = 'MARJAHAN AKTER',
  fatherNameBn = 'ছাদেক মিয়া',
  motherNameBn = 'হাবিছা খাতুন',
  dateOfBirth = '01 Jan 1987',
  nidNo = '687 637 6994',
  photoUrl = '/avatars/default_nid.jpg',
  signatureUrl,
  signatureText = 'মারজাহান',
  isMasked = true,
}) => {
  const formattedDob = formatNidDate(dateOfBirth);
  const displayNid = formatMaskedNid(nidNo, isMasked);

  return (
    <div className="relative w-full aspect-[1.586/1] min-h-[240px] sm:min-h-[290px] rounded-2xl bg-gradient-to-tr from-[#eef9f2] via-[#e5f5ea] to-[#effaf3] border-2 border-slate-200/90 dark:border-slate-700/80 shadow-xl overflow-hidden select-none text-slate-900 font-sans">
      {/* 1. Fine Security Guilloche Background */}
      <GuillocheWavesSvg />

      {/* 2. Bangladesh Flag Circular Red Sun Watermark in center-right */}
      <div className="absolute top-[48%] right-[16%] -translate-y-1/2 w-36 h-36 sm:w-48 sm:h-48 rounded-full bg-red-500/30 blur-[0.6px] border border-red-500/20 pointer-events-none select-none z-0 shadow-inner" />

      {/* 3. Card Header Bar */}
      <div className="relative z-10 px-3 sm:px-4 pt-2.5 pb-1 flex items-center justify-between">
        {/* Left: Bangladesh Government Emblem */}
        <div className="shrink-0 flex items-center justify-center">
          <BangladeshGovEmblemSvg className="w-9 h-9 sm:w-11 sm:h-11 drop-shadow-xs" />
        </div>

        {/* Center: Official Title Text */}
        <div className="flex-1 text-center px-1">
          <h2 className="text-[12px] sm:text-[15px] font-extrabold text-[#064e3b] tracking-tight leading-tight">
            গণপ্রজাতন্ত্রী বাংলাদেশ সরকার
          </h2>
          <p className="text-[8.5px] sm:text-[10.5px] font-semibold text-[#047857] tracking-tight leading-tight pt-0.5">
            Government of the People's Republic of Bangladesh
          </p>
          <div className="pt-0.5 border-b border-red-500/80 pb-0.5 inline-block">
            <span className="text-red-600 font-extrabold text-[9px] sm:text-[11.5px] tracking-tight">
              জাতীয় পরিচয়পত্র / National ID Card
            </span>
          </div>
        </div>

        {/* Right: Security Water Lily (Shapla) Hologram with Ghost Portrait */}
        <div className="shrink-0">
          <SmartCardHologram photoUrl={photoUrl} />
        </div>
      </div>

      {/* 4. Main Card Body */}
      <div className="relative z-10 px-3 sm:px-4 pt-1 pb-2 flex items-start gap-3 sm:gap-4">
        {/* Left Column: Portrait Photo & Signature */}
        <div className="w-[28%] sm:w-[26%] shrink-0 flex flex-col items-center">
          {/* Portrait Photo with authentic curved corners and guilloche edge */}
          <div className="relative w-20 h-24 sm:w-26 sm:h-32 rounded-xl overflow-hidden border border-emerald-900/30 shadow-md bg-white">
            <img
              src={photoUrl || '/avatars/default_nid.jpg'}
              alt={nameEn}
              className="w-full h-full object-cover filter contrast-105"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/avatars/default_nid.jpg';
              }}
            />
          </div>

          {/* Citizen Signature */}
          <div className="w-full text-center pt-1.5 pb-0.5">
            {signatureUrl ? (
              <img
                src={signatureUrl}
                alt="Signature"
                className="h-4 sm:h-5 max-w-[85%] mx-auto object-contain filter contrast-150"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            ) : (
              <span className="font-serif italic text-xs sm:text-sm text-slate-900 font-bold tracking-wider">
                {signatureText || nameBn?.split(' ')[0] || 'মারজাহান'}
              </span>
            )}
          </div>
        </div>

        {/* Center & Right Column: Details & Golden Chip */}
        <div className="flex-1 min-w-0 flex flex-col justify-between h-[125px] sm:h-[155px]">
          {/* Info Rows with Chip floating on the right */}
          <div className="flex items-start justify-between gap-1">
            {/* Information Labels & Values */}
            <div className="space-y-0.5 sm:space-y-1 min-w-0 flex-1">
              {/* নাম */}
              <div>
                <span className="text-[9.5px] sm:text-[11px] text-slate-700 font-medium block leading-none">নাম</span>
                <span className="font-bold text-slate-950 text-xs sm:text-[15px] leading-tight block">
                  {nameBn}
                </span>
              </div>

              {/* Name */}
              <div>
                <span className="text-[8.5px] sm:text-[10px] text-slate-700 font-medium block leading-none">Name</span>
                <span className="font-bold text-slate-950 text-[11px] sm:text-[13.5px] uppercase tracking-wide leading-tight block">
                  {nameEn}
                </span>
              </div>

              {/* পিতা */}
              <div>
                <span className="text-[9.5px] sm:text-[11px] text-slate-700 font-medium block leading-none">পিতা</span>
                <span className="font-semibold text-slate-900 text-xs sm:text-[13.5px] leading-tight block">
                  {fatherNameBn}
                </span>
              </div>

              {/* মাতা */}
              <div>
                <span className="text-[9.5px] sm:text-[11px] text-slate-700 font-medium block leading-none">মাতা</span>
                <span className="font-semibold text-slate-900 text-xs sm:text-[13.5px] leading-tight block">
                  {motherNameBn}
                </span>
              </div>
            </div>

            {/* Authentic Golden EMV Contact Chip on middle-right */}
            <div className="shrink-0 pl-1 pt-2">
              <SmartCardChipSvg className="w-12 h-9 sm:w-15 sm:h-11" />
            </div>
          </div>

          {/* Bottom Row: Date of Birth & NID No. */}
          <div className="pt-1.5 border-t border-emerald-900/10 space-y-0.5 text-[10.5px] sm:text-xs">
            <div className="flex items-baseline gap-2">
              <span className="text-slate-800 font-medium">Date of Birth</span>
              <span className="font-bold text-slate-900 font-mono text-xs sm:text-[14.5px]">
                {formattedDob}
              </span>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-slate-900 font-bold">NID No.</span>
              <span className="font-extrabold text-slate-950 font-mono text-xs sm:text-[15.5px] tracking-wider">
                {displayNid}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * 2. AUTHENTIC LAMINATED PAPER NID CARD
 * Matches original paper laminated card with masked ID NO as requested.
 */
export const BangladeshLaminatedNidCard: React.FC<{
  nameBn?: string;
  nameEn?: string;
  fatherNameBn?: string;
  motherNameBn?: string;
  dateOfBirth?: string;
  nidNo?: string;
  photoUrl?: string;
  signatureUrl?: string;
  signatureText?: string;
  isMasked?: boolean;
}> = ({
  nameBn = 'মোঃ আরমান হোসেন রিপন',
  nameEn = 'MD. ARMAN HOSSEN RIPON',
  fatherNameBn = 'মোঃ ফেরদৌস হাসান খান',
  motherNameBn = 'মোছাঃ মহসিনা আকতার শান্তনা',
  dateOfBirth = '01 Jun 2005',
  nidNo = '6847057587',
  photoUrl = '/avatars/default_nid.jpg',
  signatureUrl = '',
  signatureText = 'স্বাক্ষর',
  isMasked = true,
}) => {
  const formattedDob = formatNidDate(dateOfBirth);
  const displayNid = formatMaskedNid(nidNo, isMasked);

  return (
    <div className="relative bg-[#fcfdfd] text-slate-900 border-2 border-slate-950 rounded-[2px] shadow-sm overflow-hidden select-none w-full">
      {/* 1. Header Section */}
      <div className="border-b-2 border-slate-950 px-2 sm:px-3 py-1.5 sm:py-2 flex items-center gap-2 sm:gap-3 bg-[#fbfdfc]">
        <div className="relative shrink-0">
          <BangladeshGovEmblemSvg className="w-10 h-10 sm:w-11 sm:h-11" />
        </div>

        <div className="flex-1 text-center pr-2">
          <h2 className="text-xs sm:text-[15px] font-bold text-slate-900 tracking-tight leading-tight">
            গণপ্রজাতন্ত্রী বাংলাদেশ সরকার
          </h2>
          <p className="text-[9px] sm:text-[11px] font-medium text-emerald-800 tracking-tight leading-tight pt-0.5">
            Government of the People's Republic of Bangladesh
          </p>
          <div className="text-[9px] sm:text-[11px] font-bold leading-tight pt-0.5">
            <span className="text-red-600">National ID Card</span>
            <span className="text-slate-900"> / জাতীয় পরিচয় পত্র</span>
          </div>
        </div>
      </div>

      {/* 2. Main Body Section: Left Photo & Right Details */}
      <div className="flex relative min-h-[160px] sm:min-h-[190px]">
        {/* Left Column: Portrait Photo & Signature */}
        <div className="w-[28%] sm:w-[26%] border-r-2 border-slate-950 p-2 sm:p-2.5 flex flex-col items-center justify-between bg-white/70">
          <div className="w-full flex justify-center pt-1">
            <div className="border border-slate-950 p-0.5 bg-white shadow-2xs">
              <img
                src={photoUrl || '/avatars/default_nid.jpg'}
                alt={nameEn || 'Citizen'}
                className="w-16 h-20 sm:w-20 sm:h-26 object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/avatars/default_nid.jpg';
                }}
              />
            </div>
          </div>

          <div className="w-full text-center pt-2 pb-1">
            {signatureUrl ? (
              <img
                src={signatureUrl}
                alt="Signature"
                className="h-4 sm:h-5 max-w-[85%] mx-auto object-contain filter contrast-125"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            ) : (
              <span className="font-serif italic text-xs sm:text-sm text-slate-800 font-semibold tracking-wide">
                {signatureText || nameEn?.split(' ')[0] || 'Signature'}
              </span>
            )}
          </div>
        </div>

        {/* Right Column: Citizen Details & Golden Watermark */}
        <div className="w-[72%] sm:w-[74%] p-3 sm:p-4 relative flex flex-col justify-between overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-40 select-none z-0">
            <ShaplaWatermarkSvg />
          </div>

          <div className="relative z-10 space-y-1.5 sm:space-y-2 text-left">
            {/* নাম */}
            <div className="flex items-baseline gap-2">
              <span className="text-slate-800 font-bold text-xs sm:text-sm shrink-0">নাম:</span>
              <span className="font-black text-slate-950 text-sm sm:text-base md:text-[17px] tracking-tight leading-tight">
                {nameBn}
              </span>
            </div>

            {/* Name */}
            <div className="flex items-baseline gap-2">
              <span className="text-slate-800 font-bold text-xs sm:text-sm shrink-0">Name:</span>
              <span className="font-extrabold text-slate-950 text-xs sm:text-[14.5px] md:text-base uppercase tracking-wider leading-tight">
                {nameEn}
              </span>
            </div>

            {/* পিতা */}
            <div className="flex items-baseline gap-2">
              <span className="text-slate-800 font-semibold text-xs sm:text-sm shrink-0">পিতা:</span>
              <span className="font-bold text-slate-900 text-xs sm:text-sm md:text-[15px] leading-tight">
                {fatherNameBn}
              </span>
            </div>

            {/* মাতা */}
            <div className="flex items-baseline gap-2">
              <span className="text-slate-800 font-semibold text-xs sm:text-sm shrink-0">মাতা:</span>
              <span className="font-bold text-slate-900 text-xs sm:text-sm md:text-[15px] leading-tight">
                {motherNameBn}
              </span>
            </div>

            {/* Date of Birth - RED FONT */}
            <div className="flex items-baseline gap-2 pt-0.5">
              <span className="text-slate-900 font-bold text-xs sm:text-sm shrink-0">Date of Birth:</span>
              <span className="font-bold text-red-600 font-mono text-sm sm:text-base md:text-[17px] tracking-wide">
                {formattedDob}
              </span>
            </div>

            {/* ID NO - Masked with * by default */}
            <div className="flex items-baseline gap-2 pt-0.5">
              <span className="text-slate-950 font-black text-xs sm:text-sm shrink-0">ID NO:</span>
              <span className="font-black text-red-600 font-mono text-sm sm:text-[16.5px] md:text-[19px] tracking-widest">
                {displayNid}
              </span>
            </div>
          </div>

          <div className="relative z-10 pt-1 text-right">
            <span className="text-[8px] sm:text-[9.5px] text-slate-400 font-mono tracking-tighter">
              নির্বাচন কমিশন বাংলাদেশ • EC-BD
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * 3. UNIFIED BANGLADESH NATIONAL ID CARD COMPONENT
 * - Auto-detects or switches between Smart NID Card and Laminated Paper NID Card
 * - Masks NID number with * or not shown by default on BOTH cards
 * - Provides interactive toggles for Card Type and Masking
 */
export const BangladeshNidCard: React.FC<BangladeshNidCardProps> = ({
  cardType = 'auto',
  isSmartCard,
  nameBn = 'মোঃ আরমান হোসেন রিপন',
  nameEn = 'MD. ARMAN HOSSEN RIPON',
  fatherNameBn = 'মোঃ ফেরদৌস হাসান খান',
  motherNameBn = 'মোছাঃ মহসিনা আকতার শান্তনা',
  dateOfBirth = '01 Jun 2005',
  nidNo = '6847057587',
  photoUrl = '/avatars/default_nid.jpg',
  signatureUrl = '',
  signatureText = 'মারজাহান',
  showLaminationBorder = true,
  showControls = true,
  maskNid = true,
  className = '',
}) => {
  // Determine if card is smart card:
  // 10 digits = Smart Card, 13/17 digits = Laminated Card
  const detectedIsSmart = (): boolean => {
    if (isSmartCard !== undefined) return isSmartCard;
    if (cardType === 'smart') return true;
    if (cardType === 'laminated') return false;
    const cleanNid = (nidNo || '').replace(/\D/g, '');
    return cleanNid.length === 10;
  };

  const [activeIsSmart, setActiveIsSmart] = useState<boolean>(detectedIsSmart);
  const [isMasked, setIsMasked] = useState<boolean>(maskNid);

  // Keep state synchronized if props change
  React.useEffect(() => {
    setActiveIsSmart(detectedIsSmart());
  }, [cardType, isSmartCard, nidNo]);

  React.useEffect(() => {
    setIsMasked(maskNid);
  }, [maskNid]);

  return (
    <div className={`w-full max-w-xl mx-auto space-y-2.5 ${className}`}>
      {/* Interactive Controls Bar: Switch Card Type & Mask / Unmask Toggle */}
      {showControls && (
        <div className="flex flex-wrap items-center justify-between gap-2 px-1">
          {/* Card Type Selector Buttons */}
          <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
            <button
              type="button"
              onClick={() => setActiveIsSmart(true)}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                activeIsSmart
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Sparkles size={13} className={activeIsSmart ? 'text-yellow-300' : ''} />
              <span>স্মার্ট কার্ড (Smart NID)</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveIsSmart(false)}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                !activeIsSmart
                  ? 'bg-slate-900 dark:bg-slate-700 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <CreditCard size={13} />
              <span>লেমিনেটেড এনআইডি</span>
            </button>
          </div>

          {/* Mask / Unmask Toggle Button (* or not shown) */}
          <button
            type="button"
            onClick={() => setIsMasked(!isMasked)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-750 shadow-2xs transition cursor-pointer"
            title={isMasked ? 'নম্বর উন্মোচন করুন' : 'নম্বর লুকান (*)'}
          >
            {isMasked ? (
              <>
                <EyeOff size={13} className="text-rose-500" />
                <span>নম্বর গোপন (*)</span>
              </>
            ) : (
              <>
                <Eye size={13} className="text-emerald-600" />
                <span>নম্বর প্রদর্শিত</span>
              </>
            )}
          </button>
        </div>
      )}

      {/* Outer Card Surround Container */}
      {activeIsSmart ? (
        // Smart NID Card with authentic red framing surround (matching reference photo)
        <div
          className={`relative p-2.5 sm:p-4 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-red-600 via-rose-600 to-red-700 shadow-xl border-2 border-red-500/80 transition-all ${
            showLaminationBorder ? '' : 'p-0 bg-transparent border-none'
          }`}
          title="গণপ্রজাতন্ত্রী বাংলাদেশ স্মার্ট জাতীয় পরিচয়পত্র (Smart National ID Card)"
        >
          <BangladeshSmartNidCard
            nameBn={nameBn}
            nameEn={nameEn}
            fatherNameBn={fatherNameBn}
            motherNameBn={motherNameBn}
            dateOfBirth={dateOfBirth}
            nidNo={nidNo}
            photoUrl={photoUrl}
            signatureUrl={signatureUrl}
            signatureText={signatureText}
            isMasked={isMasked}
          />
        </div>
      ) : (
        // Laminated Paper NID Card
        <div
          className={`relative p-3 sm:p-5 rounded-2xl sm:rounded-3xl bg-gradient-to-b from-slate-200/90 via-slate-150/80 to-slate-300/90 dark:from-slate-800/80 dark:via-slate-850/80 dark:to-slate-900/90 border border-slate-300/90 dark:border-slate-700/80 shadow-xl transition-all ${
            showLaminationBorder ? '' : 'p-0 bg-transparent border-none'
          }`}
          title="গণপ্রজাতন্ত্রী বাংলাদেশ লেমিনেটেড জাতীয় পরিচয়পত্র"
        >
          <div className="absolute top-1.5 left-3 w-20 h-6 bg-white/40 dark:bg-white/10 rounded-full blur-xs pointer-events-none transform -rotate-6" />
          <div className="absolute bottom-2 right-4 w-28 h-6 bg-white/25 dark:bg-white/5 rounded-full blur-xs pointer-events-none" />

          <BangladeshLaminatedNidCard
            nameBn={nameBn}
            nameEn={nameEn}
            fatherNameBn={fatherNameBn}
            motherNameBn={motherNameBn}
            dateOfBirth={dateOfBirth}
            nidNo={nidNo}
            photoUrl={photoUrl}
            signatureUrl={signatureUrl}
            signatureText={signatureText}
            isMasked={isMasked}
          />
        </div>
      )}
    </div>
  );
};

export default BangladeshNidCard;
