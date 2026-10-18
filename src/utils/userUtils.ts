import { UserProfile } from '../types';

export const isFemaleName = (text?: string | null): boolean => {
  if (!text) return false;
  const lower = text.toLowerCase();

  const bnKeywords = [
    'তানিয়া', 'সুলতানা', 'আক্তার', 'বেগম', 'খাতুন', 'ফারজানা', 'মাহমুদা',
    'রোকসানা', 'নাসরিন', 'নাসরীন', 'পারভীন', 'ফাতেমা', 'মারিয়া', 'আয়েশা',
    'সাদিয়া', 'জান্নাত', 'ফারহানা', 'নুসরাত', 'তাসনিম', 'তাসলিমা', 'রুমানা',
    'শিরিন', 'শারমিন', 'সাবরিনা', 'মোসাঃ', 'মোছাঃ', 'সাহানা', 'মাজেদা', 'রহিমা',
    'হালিমা', 'নাজমা', 'শাহানাজ', 'জেসমিন', 'শামীমা', 'লতিফা'
  ];
  if (bnKeywords.some((k) => text.includes(k))) return true;

  const enKeywords = [
    'tania', 'sultana', 'akter', 'aktar', 'begum', 'khatun', 'farzana', 'mahmuda',
    'roksana', 'rokhsana', 'nasreen', 'nasrin', 'parveen', 'parvin', 'fatema',
    'maria', 'ayesha', 'sadia', 'jannat', 'farhana', 'nusrat', 'tasnim', 'taslima',
    'rumana', 'shirin', 'sharmin', 'sabrina', 'mst', 'mrs', 'miss', 'samia', 'nazmin',
    'afroza', 'halima', 'nazma', 'jesmin', 'shamima'
  ];
  return enKeywords.some((k) => lower.includes(k));
};

/**
 * Returns the verified profile/NID photo URL for any user role (Citizens, Officers, Admin).
 * Fallback provides a realistic official passport photo corresponding to their role & gender.
 */
export const getUserAvatarUrl = (user: UserProfile | null | undefined): string | null => {
  if (!user) return null;
  if (user.photo_url) return user.photo_url;
  if (user.nid_photo_url) return user.nid_photo_url;
  if ((user as any).photoURL) return (user as any).photoURL;

  const role = (user.role || '').toLowerCase();
  if (role === 'union_officer' || role === 'union_land_officer') {
    return '/avatars/officer_kamal_union.jpg';
  }
  if (role === 'ac_land' || role === 'ac_land_officer' || role === 'assistant_commissioner') {
    return '/avatars/officer_tanvir_acland.jpg';
  }
  if (role === 'sub_registrar' || role === 'sub_registry_officer') {
    return '/avatars/officer_roksana_registry.jpg';
  }
  if (role === 'central_admin' || role === 'admin' || role === 'super_admin') {
    return '/avatars/officer_admin.jpg';
  }

  // Check name/email matches
  if (user.email?.toLowerCase().includes('roksana') || user.name_bn?.includes('রোকসানা')) {
    return '/avatars/officer_roksana_registry.jpg';
  }
  if (user.email?.toLowerCase().includes('kamal') || user.name_bn?.includes('কামাল')) {
    return '/avatars/officer_kamal_union.jpg';
  }
  if (user.email?.toLowerCase().includes('tanvir') || user.name_bn?.includes('তানভীর')) {
    return '/avatars/officer_tanvir_acland.jpg';
  }

  // Check Female Citizens
  const nameCombined = `${user.name_bn || ''} ${user.name_en || ''} ${user.email || ''}`;
  if (isFemaleName(nameCombined)) {
    if (nameCombined.toLowerCase().includes('tania') || nameCombined.includes('তানিয়া')) {
      return '/avatars/nid_female_tania.jpg';
    }
    return '/avatars/nid_female_citizen.jpg';
  }

  // Male Citizens
  if (
    user.email?.toLowerCase().includes('seller') ||
    user.name_bn?.includes('রফিক') ||
    user.name_en?.toLowerCase().includes('rafiq')
  ) {
    return '/avatars/default_nid.jpg';
  }
  if (
    user.email?.toLowerCase().includes('buyer') ||
    user.name_bn?.includes('ফারহান') ||
    user.name_en?.toLowerCase().includes('farhan')
  ) {
    return '/avatars/nid_farhan_ahmed.jpg';
  }
  return '/avatars/default_nid.jpg';
};

export const AVAILABLE_AVATAR_PRESETS = [
  { id: 'default', labelBn: 'ডিফল্ট নাগরিক পোর্ট্রেট', labelEn: 'Default Citizen Portrait', url: '/avatars/default_nid.jpg' },
  { id: 'tania', labelBn: 'নারী নাগরিক ১ (তানিয়া সুলতানা)', labelEn: 'Female Citizen 1 (Tania Sultana)', url: '/avatars/nid_female_tania.jpg' },
  { id: 'female_citizen', labelBn: 'নারী নাগরিক ২ (ফারজানা/মাহমুদা)', labelEn: 'Female Citizen 2 (Farzana/Mahmuda)', url: '/avatars/nid_female_citizen.jpg' },
  { id: 'rafiq', labelBn: 'পুরুষ নাগরিক ১ (মোঃ রফিকুল ইসলাম)', labelEn: 'Male Citizen 1 (Md. Rafiqul Islam)', url: '/avatars/default_nid.jpg' },
  { id: 'farhan', labelBn: 'পুরুষ নাগরিক ২ (ফারহান আহমেদ)', labelEn: 'Male Citizen 2 (Farhan Ahmed)', url: '/avatars/nid_farhan_ahmed.jpg' },
  { id: 'kamal', labelBn: 'ইউনিয়ন কর্মকর্তা (মোহাম্মদ কামাল হোসেন)', labelEn: 'Union Land Officer (Mohammad Kamal Hossain)', url: '/avatars/officer_kamal_union.jpg' },
  { id: 'tanvir', labelBn: 'এসি ল্যান্ড / নির্বাহী ম্যাজিস্ট্রেট (তানভীর হাসান চৌধুরী)', labelEn: 'AC Land Magistrate (Tanvir Hasan Chowdhury)', url: '/avatars/officer_tanvir_acland.jpg' },
  { id: 'roksana', labelBn: 'সাব-রেজিস্ট্রার কর্মকর্তা (সৈয়দা রোকসানা পারভীন)', labelEn: 'Sub-Registrar Officer (Syeda Roksana Parveen)', url: '/avatars/officer_roksana_registry.jpg' },
  { id: 'admin', labelBn: 'মন্ত্রণালয় প্রধান অ্যাডমিন (জাহিদ হাসান)', labelEn: 'Ministry Lead Admin (Zahid Hasan)', url: '/avatars/officer_admin.jpg' },
];

