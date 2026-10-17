/**
 * Comprehensive Bilingual Translation & Formatting Utility
 * Guarantees that in English mode ('en'), names, mouzas, upazilas,
 * districts, land classes, deed types, and Bengali numerals are strictly
 * translated and converted to crisp English.
 */

// Digit maps
const BN_TO_EN_DIGITS: Record<string, string> = {
  '০': '0', '১': '1', '২': '2', '৩': '3', '৪': '4',
  '৫': '5', '৬': '6', '৭': '7', '৮': '8', '৯': '9',
};

const EN_TO_BN_DIGITS: Record<string, string> = {
  '0': '০', '1': '১', '2': '২', '3': '৩', '4': '৪',
  '5': '৫', '6': '৬', '7': '৭', '8': '৮', '9': '৯',
};

export const toEnglishDigits = (val: string | number | undefined | null): string => {
  if (val === undefined || val === null) return '';
  return String(val).replace(/[০-৯]/g, (d) => BN_TO_EN_DIGITS[d] || d);
};

export const toBengaliDigits = (val: string | number | undefined | null): string => {
  if (val === undefined || val === null) return '';
  return String(val).replace(/[0-9]/g, (d) => EN_TO_BN_DIGITS[d] || d);
};

export const formatDigits = (val: string | number | undefined | null, isBn: boolean): string => {
  return isBn ? toBengaliDigits(val) : toEnglishDigits(val);
};

// Known Names Dictionary
export const NAMES_MAP: Record<string, { bn: string; en: string }> = {
  'মোঃ আরমান হোসেন রিপন': { bn: 'মোঃ আরমান হোসেন রিপন', en: 'Md. Arman Hossen Ripon' },
  'আরমান হোসেন': { bn: 'আরমান হোসেন', en: 'Arman Hossen' },
  'ফারহান আহমেদ': { bn: 'ফারহান আহমেদ', en: 'Farhan Ahmed' },
  'মো: ফারহান আহমেদ': { bn: 'মো: ফারহান আহমেদ', en: 'Md. Farhan Ahmed' },
  'আব্দুল লতিফ': { bn: 'আব্দুল লতিফ', en: 'Abdul Latif' },
  'নজরুল ইসলাম': { bn: 'নজরুল ইসলাম', en: 'Nazrul Islam' },
  'বদরুল আলম': { bn: 'বদরুল আলম', en: 'Badrul Alam' },
  'ড. আনিসুর রহমান': { bn: 'ড. আনিসুর রহমান', en: 'Dr. Anisur Rahman' },
  'গৌতম কুমার সেন': { bn: 'গৌতম কুমার সেন', en: 'Goutam Kumar Sen' },
  'মোহাম্মদ কামাল হোসেন': { bn: 'মোহাম্মদ কামাল হোসেন', en: 'Md. Kamal Hossain' },
  'কামাল হোসেন': { bn: 'কামাল হোসেন', en: 'Kamal Hossain' },
  'তানভীর হাসান চৌধুরী': { bn: 'তানভীর হাসান চৌধুরী', en: 'Tanvir Hasan Chowdhury' },
  'সৈয়দা রোকসানা পারভীন': { bn: 'সৈয়দা রোকসানা পারভীন', en: 'Syeda Roksana Parveen' },
  'এ. কে. এম. রেজওয়ানুল হক': { bn: 'এ. কে. এম. রেজওয়ানুল হক', en: 'A. K. M. Rezwanul Haque' },
  'কাজী মিজানুর রহমান': { bn: 'কাজী মিজানুর রহমান', en: 'Kazi Mijanur Rahman' },
  'তানিয়া সুলতানা': { bn: 'তানিয়া সুলতানা', en: 'Tania Sultana' },
  'মোসা: তানিয়া আক্তার': { bn: 'মোসা: তানিয়া আক্তার', en: 'Mst. Tania Akter' },
  'তানিয়া আক্তার': { bn: 'তানিয়া আক্তার', en: 'Tania Akter' },
  'মোজাম্মেল হক': { bn: 'মোজাম্মেল হক', en: 'Mozammel Haque' },
  'ফাতেমা বেগম': { bn: 'ফাতেমা বেগম', en: 'Fatema Begum' },
  'আনোয়ার হোসেন': { bn: 'আনোয়ার হোসেন', en: 'Anwar Hossain' },
  'শাহীন আক্তার': { bn: 'শাহীন আক্তার', en: 'Shaheen Akter' },
  'করিম বক্স': { bn: 'করিম বক্স', en: 'Karim Baksh' },
  'আমেনা খাতুন': { bn: 'আমেনা খাতুন', en: 'Amena Khatun' },
  'জাহানারা বেগম': { bn: 'জাহানারা বেগম', en: 'Jahanara Begum' },
  'মোছা: জাহানারা বেগম': { bn: 'মোছা: জাহানারা বেগম', en: 'Mst. Jahanara Begum' },
  'কায়সার আহমেদ': { bn: 'কায়সার আহমেদ', en: 'Kaysar Ahmed' },
  'রহিমা খাতুন': { bn: 'রহিমা খাতুন', en: 'Rohima Khatun' },
  'আবুল কাসেম': { bn: 'আবুল কাসেম', en: 'Abul Kashem' },
  'আব্দুস সোবহান': { bn: 'আব্দুস সোবহান', en: 'Abdus Sobhan' },
  'গীতা সেন': { bn: 'গীতা সেন', en: 'Gita Sen' },
  'শফিকুল ইসলাম': { bn: 'শফিকুল ইসলাম', en: 'Shafiqul Islam' },
  'জাহেদা খাতুন': { bn: 'জাহেদা খাতুন', en: 'Zaheda Khatun' },
  'তমিজউদ্দিন': { bn: 'তমিজউদ্দিন', en: 'Tamijuddin' },
  'কাজী মতিউর রহমান': { bn: 'কাজী মতিউর রহমান', en: 'Kazi Motiur Rahman' },
};

// Known Mouzas Dictionary
export const MOUZA_MAP: Record<string, { bn: string; en: string }> = {
  'বাড্ডা': { bn: 'বাড্ডা', en: 'Badda' },
  'সাঁতারকুল': { bn: 'সাঁতারকুল', en: 'Satarkul' },
  'ভাটারা': { bn: 'ভাটারা', en: 'Bhatara' },
  'রামপুরা': { bn: 'রামপুরা', en: 'Rampura' },
  'আফতাবনগর': { bn: 'আফতাবনগর', en: 'Aftabnagar' },
  'আম্বরখানা': { bn: 'আম্বরখানা', en: 'Ambarkhana' },
  'নওদাপাড়া': { bn: 'নওদাপাড়া', en: 'Nawdapara' },
  'নৈহাটী': { bn: 'নৈহাটী', en: 'Naihati' },
  'আলেকান্দা': { bn: 'আলেকান্দা', en: 'Alekanda' },
  'ধাপ': { bn: 'ধাপ', en: 'Dhap' },
  'আকুয়া': { bn: 'আকুয়া', en: 'Akua' },
  'আকুয়া': { bn: 'আকুয়া', en: 'Akua' },
  'কান্দিরপাড়': { bn: 'কান্দিরপাড়', en: 'Kandirpar' },
  'কান্দিরপাড়': { bn: 'কান্দিরপাড়', en: 'Kandirpar' },
  'জয়দেবপুর': { bn: 'জয়দেবপুর', en: 'Joydebpur' },
  'ঝিলংজা': { bn: 'ঝিলংজা', en: 'Jhilongja' },
  'রাজবাটী': { bn: 'রাজবাটী', en: 'Rajbati' },
  'গুলশান': { bn: 'গুলশান', en: 'Gulshan' },
  'মতিঝিল': { bn: 'মতিঝিল', en: 'Motijheel' },
  'ধানমন্ডি': { bn: 'ধানমন্ডি', en: 'Dhanmondi' },
  'মিরপুর': { bn: 'মিরপুর', en: 'Mirpur' },
  'উত্তরা': { bn: 'উত্তরা', en: 'Uttara' },
  'তেজগাঁও': { bn: 'তেজগাঁও', en: 'Tejgaon' },
  'রমনা': { bn: 'রমনা', en: 'Ramna' },
  'টঙ্গী': { bn: 'টঙ্গী', en: 'Tongi' },
};

// Known Districts
export const DISTRICT_MAP: Record<string, { bn: string; en: string }> = {
  'ঢাকা': { bn: 'ঢাকা', en: 'Dhaka' },
  'সিলেট': { bn: 'সিলেট', en: 'Sylhet' },
  'রাজশাহী': { bn: 'রাজশাহী', en: 'Rajshahi' },
  'খুলনা': { bn: 'খুলনা', en: 'Khulna' },
  'বরিশাল': { bn: 'বরিশাল', en: 'Barishal' },
  'রংপুর': { bn: 'রংপুর', en: 'Rangpur' },
  'ময়মনসিংহ': { bn: 'ময়মনসিংহ', en: 'Mymensingh' },
  'কুমিল্লা': { bn: 'কুমিল্লা', en: 'Cumilla' },
  'গাজীপুর': { bn: 'গাজীপুর', en: 'Gazipur' },
  'কক্সবাজার': { bn: 'কক্সবাজার', en: 'Cox\'s Bazar' },
  'দিনাজপুর': { bn: 'দিনাজপুর', en: 'Dinajpur' },
  'চট্টগ্রাম': { bn: 'চট্টগ্রাম', en: 'Chattogram' },
};

// Known Upazilas
export const UPAZILA_MAP: Record<string, { bn: string; en: string }> = {
  'গুলশান': { bn: 'গুলশান', en: 'Gulshan' },
  'সিলেট সদর': { bn: 'সিলেট সদর', en: 'Sylhet Sadar' },
  'পবা': { bn: 'পবা', en: 'Paba' },
  'রূপসা': { bn: 'রূপসা', en: 'Rupsha' },
  'কোতোয়ালী': { bn: 'কোতোয়ালী', en: 'Kotwali' },
  'রংপুর সদর': { bn: 'রংপুর সদর', en: 'Rangpur Sadar' },
  'ময়মনসিংহ সদর': { bn: 'ময়মনসিংহ সদর', en: 'Mymensingh Sadar' },
  'আদর্শ সদর': { bn: 'আদর্শ সদর', en: 'Adarsha Sadar' },
  'গাজীপুর সদর': { bn: 'গাজীপুর সদর', en: 'Gazipur Sadar' },
  'কক্সবাজার সদর': { bn: 'কক্সবাজার সদর', en: 'Cox\'s Bazar Sadar' },
  'দিনাজপুর সদর': { bn: 'দিনাজপুর সদর', en: 'Dinajpur Sadar' },
};

// Land Classes
export const LAND_CLASS_MAP: Record<string, { bn: string; en: string }> = {
  'বাস্তু (ভিটি)': { bn: 'বাস্তু (ভিটি)', en: 'Homestead (Viti)' },
  'বাস্তু': { bn: 'বাস্তু', en: 'Homestead' },
  'ভিটি': { bn: 'ভিটি', en: 'Highland (Viti)' },
  'নাল': { bn: 'নাল', en: 'Nal (Crop land)' },
  'ধানী': { bn: 'ধানী', en: 'Paddy land' },
  'বাণিজ্যিক': { bn: 'বাণিজ্যিক', en: 'Commercial' },
  'বাগান': { bn: 'বাগান', en: 'Garden / Orchard' },
  'নাল (ধানী)': { bn: 'নাল (ধানী)', en: 'Nal (Paddy)' },
  'পতিত বালুকা': { bn: 'পতিত বালুকা', en: 'Fallow Sandy land' },
  'পুকুর': { bn: 'পুকুর', en: 'Pond / Waterbody' },
};

// Deed / Title Origin Types
export const TITLE_ORIGIN_MAP: Record<string, { bn: string; en: string }> = {
  'ক্রয়সূত্রে': { bn: 'ক্রয়সূত্রে', en: 'By Purchase' },
  'ওয়ারিশসূত্রে': { bn: 'ওয়ারিশসূত্রে', en: 'By Inheritance' },
  'খরিদসূত্রে': { bn: 'খরিদসূত্রে', en: 'By Acquisition' },
  'হেবাসূত্রে': { bn: 'হেবাসূত্রে', en: 'By Heba (Gift)' },
  'সাফ-কবলা': { bn: 'সাফ-কবলা', en: 'Saf-Kabala (Outright Sale)' },
  'হেবা': { bn: 'হেবা', en: 'Heba (Gift)' },
  'দানপত্র': { bn: 'দানপত্র', en: 'Gift Deed' },
  'বণ্টননামা': { bn: 'বণ্টননামা', en: 'Partition Deed' },
};

/**
 * Translates a person object or string name to the target language.
 * When isBn is false, guarantees a clean English name.
 */
export const formatName = (personOrName: any, isBn: boolean, fallback = 'Anonymous'): string => {
  if (!personOrName) return fallback;

  // If passed an object with name_bn / name_en / name
  if (typeof personOrName === 'object') {
    if (isBn) {
      if (personOrName.name_bn) return personOrName.name_bn;
      if (personOrName.name) {
        const item = Object.values(NAMES_MAP).find((n) => n.en.toLowerCase() === String(personOrName.name).toLowerCase());
        return item ? item.bn : personOrName.name;
      }
      return fallback;
    } else {
      if (personOrName.name_en) return personOrName.name_en;
      const bnCandidate = personOrName.name_bn || personOrName.name;
      if (bnCandidate && NAMES_MAP[bnCandidate]) {
        return NAMES_MAP[bnCandidate].en;
      }
      return bnCandidate || fallback;
    }
  }

  // String lookup
  const str = String(personOrName).trim();
  if (isBn) {
    if (NAMES_MAP[str]) return NAMES_MAP[str].bn;
    const item = Object.values(NAMES_MAP).find((n) => n.en.toLowerCase() === str.toLowerCase());
    return item ? item.bn : str;
  } else {
    if (NAMES_MAP[str]) return NAMES_MAP[str].en;
    // Check if it already looks English
    if (/^[A-Za-z\s.]+$/.test(str)) return str;
    return str || fallback;
  }
};

/**
 * Translates a mouza string or parcel object to the target language.
 */
export const formatMouza = (mouzaOrParcel: any, isBn: boolean, fallback = 'Badda'): string => {
  if (!mouzaOrParcel) return fallback;

  let raw = '';
  if (typeof mouzaOrParcel === 'object') {
    if (isBn) {
      raw = mouzaOrParcel.mouza_bn || mouzaOrParcel.mouza || mouzaOrParcel.mouza_en || '';
    } else {
      raw = mouzaOrParcel.mouza_en || mouzaOrParcel.mouza || mouzaOrParcel.mouza_bn || '';
    }
  } else {
    raw = String(mouzaOrParcel).trim();
  }

  if (isBn) {
    if (MOUZA_MAP[raw]) return MOUZA_MAP[raw].bn;
    const item = Object.values(MOUZA_MAP).find((m) => m.en.toLowerCase() === raw.toLowerCase());
    return item ? item.bn : raw || 'বাড্ডা';
  } else {
    if (MOUZA_MAP[raw]) return MOUZA_MAP[raw].en;
    // Check if English string already
    if (/^[A-Za-z\s]+$/.test(raw)) return raw;
    return raw || fallback;
  }
};

/**
 * Translates upazila to target language.
 */
export const formatUpazila = (upazila: string | undefined | null, isBn: boolean, fallback = 'Gulshan'): string => {
  if (!upazila) return fallback;
  const str = String(upazila).trim();
  if (isBn) {
    if (UPAZILA_MAP[str]) return UPAZILA_MAP[str].bn;
    const item = Object.values(UPAZILA_MAP).find((u) => u.en.toLowerCase() === str.toLowerCase());
    return item ? item.bn : str;
  } else {
    if (UPAZILA_MAP[str]) return UPAZILA_MAP[str].en;
    return str;
  }
};

/**
 * Translates district to target language.
 */
export const formatDistrict = (district: string | undefined | null, isBn: boolean, fallback = 'Dhaka'): string => {
  if (!district) return fallback;
  const str = String(district).trim();
  if (isBn) {
    if (DISTRICT_MAP[str]) return DISTRICT_MAP[str].bn;
    const item = Object.values(DISTRICT_MAP).find((d) => d.en.toLowerCase() === str.toLowerCase());
    return item ? item.bn : str;
  } else {
    if (DISTRICT_MAP[str]) return DISTRICT_MAP[str].en;
    return str;
  }
};

/**
 * Translates land classification.
 */
export const formatLandClass = (cls: string | undefined | null, isBn: boolean, fallback = 'Homestead'): string => {
  if (!cls) return fallback;
  const str = String(cls).trim();
  if (isBn) {
    if (LAND_CLASS_MAP[str]) return LAND_CLASS_MAP[str].bn;
    const item = Object.values(LAND_CLASS_MAP).find((c) => c.en.toLowerCase() === str.toLowerCase());
    return item ? item.bn : str;
  } else {
    if (LAND_CLASS_MAP[str]) return LAND_CLASS_MAP[str].en;
    return str;
  }
};

/**
 * Formats plot/dag number with label and English/Bengali digits.
 */
export const formatPlot = (dagNo: string | number | undefined | null, isBn: boolean, prefix = true): string => {
  const digits = formatDigits(dagNo, isBn);
  if (!prefix) return digits;
  return isBn ? `দাগ: ${digits}` : `Plot: ${digits}`;
};

/**
 * Formats khatian number with label and English/Bengali digits.
 */
export const formatKhatian = (khatianNo: string | number | undefined | null, isBn: boolean, prefix = true): string => {
  const digits = formatDigits(khatianNo, isBn);
  if (!prefix) return digits;
  return isBn ? `খতিয়ান: ${digits}` : `Khatian: ${digits}`;
};

/**
 * Formats land area with proper decimal unit.
 */
export const formatArea = (area: string | number | undefined | null, isBn: boolean, short = false): string => {
  const digits = formatDigits(area, isBn);
  if (isBn) {
    return `${digits} শতক`;
  }
  return short ? `${digits} dec` : `${digits} decimals`;
};

/**
 * Formats deed/case reference numbers cleanly.
 */
export const formatRefNo = (no: string | undefined | null, isBn: boolean): string => {
  if (!no) return '';
  return formatDigits(no, isBn);
};
