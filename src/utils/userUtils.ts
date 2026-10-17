import { UserProfile } from '../types';

/**
 * Returns the verified profile/NID photo URL for any user role (Citizens, Officers, Admin).
 * Fallback provides a realistic official passport photo corresponding to their role.
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

  // Citizens
  if (
    user.email?.toLowerCase().includes('arman') ||
    user.name_bn?.includes('আরমান') ||
    user.name_en?.toLowerCase().includes('arman')
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
  { id: 'rafiqul', labelBn: 'নাগরিক পোর্ট্রেট ১ (রফিকুল ইসলাম)', labelEn: 'Citizen Portrait 1 (Rafiqul Islam)', url: '/avatars/nid_rafiqul_islam.jpg' },
  { id: 'farhan', labelBn: 'নাগরিক পোর্ট্রেট ২ (ফারহান আহমেদ)', labelEn: 'Citizen Portrait 2 (Farhan Ahmed)', url: '/avatars/nid_farhan_ahmed.jpg' },
  { id: 'kamal', labelBn: 'ইউনিয়ন কর্মকর্তা (মোহাম্মদ কামাল হোসেন)', labelEn: 'Union Land Officer (Mohammad Kamal Hossain)', url: '/avatars/officer_kamal_union.jpg' },
  { id: 'tanvir', labelBn: 'এসি ল্যান্ড / নির্বাহী ম্যাজিস্ট্রেট (তানভীর হাসান চৌধুরী)', labelEn: 'AC Land Magistrate (Tanvir Hasan Chowdhury)', url: '/avatars/officer_tanvir_acland.jpg' },
  { id: 'roksana', labelBn: 'সাব-রেজিস্ট্রার কর্মকর্তা (সৈয়দা রোকসানা পারভীন)', labelEn: 'Sub-Registrar Officer (Syeda Roksana Parveen)', url: '/avatars/officer_roksana_registry.jpg' },
  { id: 'admin', labelBn: 'মন্ত্রণালয় প্রধান অ্যাডমিন (জাহিদ হাসান)', labelEn: 'Ministry Lead Admin (Zahid Hasan)', url: '/avatars/officer_admin.jpg' },
];

