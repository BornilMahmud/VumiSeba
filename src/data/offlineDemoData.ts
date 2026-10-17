import rawDb from './offlineSnapshot.json';
import { UserProfile } from '../types';

export const OFFLINE_DB = rawDb;

export const OFFLINE_DEMO_USERS: Record<string, UserProfile> = {
  seller: {
    id: 'usr-seller-01',
    citizen_id: 'BHM-CIT-882194',
    email: 'seller@bhumisathi.gov.bd',
    name_bn: 'মোঃ আরমান হোসেন রিপন',
    name_en: 'MD. ARMAN HOSSEN RIPON',
    mobile: '01711000001',
    nid_no: '6847057587',
    date_of_birth: '2005-06-01',
    father_name_bn: 'মোঃ ফেরদৌস হাসান খান',
    mother_name_bn: 'মোছাঃ মহসিনা আকতার শান্তনা',
    address_bn: 'বাড়ি ১২, রোড ৪, ব্লক সি, বাড্ডা, ঢাকা',
    district: 'ঢাকা',
    upazila: 'গুলশান',
    role: 'citizen',
    kyc_status: 'verified',
    kyc_verified_at: '2025-01-15T10:00:00Z',
    nid_photo_url: '/avatars/default_nid.jpg',
    photo_url: '/avatars/default_nid.jpg',
    created_at: '2025-01-10T08:00:00Z',
  },
  buyer: {
    id: 'usr-buyer-01',
    citizen_id: 'BHM-CIT-419203',
    email: 'buyer@bhumisathi.gov.bd',
    name_bn: 'ফারহান আহমেদ',
    name_en: 'Farhan Ahmed',
    mobile: '01811000002',
    nid_no: '19922694018274619',
    date_of_birth: '1992-09-20',
    father_name_bn: 'আনোয়ার হোসেন',
    mother_name_bn: 'শাহীন আক্তার',
    address_bn: 'ফ্ল্যাট ৪বি, বাড়ি ৯, বনশ্রী, রামপুরা, ঢাকা',
    district: 'ঢাকা',
    upazila: 'গুলশান',
    role: 'citizen',
    kyc_status: 'verified',
    kyc_verified_at: '2025-02-01T11:30:00Z',
    nid_photo_url: '/avatars/nid_farhan_ahmed.jpg',
    photo_url: '/avatars/nid_farhan_ahmed.jpg',
    created_at: '2025-01-20T09:00:00Z',
  },
  taxdue: {
    id: 'usr-seller-taxdue',
    citizen_id: 'BHM-CIT-339102',
    email: 'latif.taxdue@bhumisathi.gov.bd',
    name_bn: 'আব্দুল লতিফ',
    name_en: 'Abdul Latif',
    mobile: '01911000003',
    nid_no: '19782691099381726',
    date_of_birth: '1978-03-14',
    father_name_bn: 'করিম বক্স',
    mother_name_bn: 'আমেনা খাতুন',
    address_bn: 'সাঁতারকুল পূর্ব পাড়া, গুলশান, ঢাকা',
    district: 'ঢাকা',
    upazila: 'গুলশান',
    role: 'citizen',
    kyc_status: 'verified',
    kyc_verified_at: '2025-01-18T09:00:00Z',
    nid_photo_url: '/avatars/default_nid.jpg',
    photo_url: '/avatars/default_nid.jpg',
    created_at: '2025-01-12T07:00:00Z',
  },
  oversell: {
    id: 'usr-seller-oversell',
    citizen_id: 'BHM-CIT-771920',
    email: 'nazrul.share@bhumisathi.gov.bd',
    name_bn: 'নজরুল ইসলাম',
    name_en: 'Nazrul Islam',
    mobile: '01611000004',
    nid_no: '19822695028371948',
    date_of_birth: '1982-11-05',
    father_name_bn: 'হায়দার আলী',
    mother_name_bn: 'জাহানারা বেগম',
    address_bn: 'নতুন বাজার, ভাটারা, ঢাকা',
    district: 'ঢাকা',
    upazila: 'গুলশান',
    role: 'citizen',
    kyc_status: 'verified',
    kyc_verified_at: '2025-02-10T12:00:00Z',
    nid_photo_url: '/avatars/default_nid.jpg',
    photo_url: '/avatars/default_nid.jpg',
    created_at: '2025-01-25T10:00:00Z',
  },
  union_officer: {
    id: 'usr-officer-union',
    citizen_id: 'BHM-CIT-100002',
    email: 'union.officer@land.gov.bd',
    name_bn: 'মোহাম্মদ কামাল হোসেন',
    name_en: 'Md. Kamal Hossain',
    mobile: '01711223344',
    nid_no: '19752693019284751',
    father_name_bn: 'আব্দুস সোবহান',
    mother_name_bn: 'রাশেদা বেগম',
    address_bn: 'ইউনিয়ন ভূমি অফিস, বাড্ডা, ঢাকা',
    district: 'ঢাকা',
    upazila: 'গুলশান',
    role: 'union_officer',
    designation_bn: 'ইউনিয়ন ভূমি সহকারী কর্মকর্তা (ULAO)',
    office_name_bn: 'বাড্ডা ও সাঁতারকুল ইউনিয়ন ভূমি অফিস',
    photo_url: '/avatars/officer_kamal_union.jpg',
    nid_photo_url: '/avatars/officer_kamal_union.jpg',
    kyc_status: 'verified',
    created_at: '2024-12-01T08:00:00Z',
  },
  ac_land: {
    id: 'usr-officer-acland',
    citizen_id: 'BHM-CIT-100003',
    email: 'ac.land@land.gov.bd',
    name_bn: 'তানভীর হাসান চৌধুরী',
    name_en: 'Tanvir Hasan Chowdhury',
    mobile: '01711334455',
    nid_no: '19812692019384752',
    father_name_bn: 'সৈয়দ হাসান চৌধুরী',
    mother_name_bn: 'লায়লা বেগম',
    address_bn: 'উপজেলা ভূমি অফিস, গুলশান রাজস্ব সার্কেল, ঢাকা',
    district: 'ঢাকা',
    upazila: 'গুলশান',
    role: 'ac_land',
    designation_bn: 'সহকারী কমিশনার (ভূমি) ও এক্সিকিউটিভ ম্যাজিস্ট্রেট',
    office_name_bn: 'গুলশান রাজস্ব সার্কেল ও উপজেলা ভূমি অফিস',
    photo_url: '/avatars/officer_tanvir_acland.jpg',
    nid_photo_url: '/avatars/officer_tanvir_acland.jpg',
    kyc_status: 'verified',
    created_at: '2024-12-01T08:00:00Z',
  },
  sub_registrar: {
    id: 'usr-officer-registry',
    citizen_id: 'BHM-CIT-100004',
    email: 'sub.registrar@land.gov.bd',
    name_bn: 'সৈয়দা রোকসানা পারভীন',
    name_en: 'Syeda Roksana Parveen',
    mobile: '01711445566',
    nid_no: '19832694029485718',
    father_name_bn: 'সৈয়দ আশরাফ আলী',
    mother_name_bn: 'মমতাজ বেগম',
    address_bn: 'সাব-রেজিস্ট্রি অফিস, গুলশান, ঢাকা',
    district: 'ঢাকা',
    upazila: 'গুলশান',
    role: 'sub_registrar',
    designation_bn: 'সাব-রেজিস্ট্রার',
    office_name_bn: 'গুলশান সাব-রেজিস্ট্রি অফিস, ঢাকা',
    photo_url: '/avatars/officer_roksana_registry.jpg',
    nid_photo_url: '/avatars/officer_roksana_registry.jpg',
    kyc_status: 'verified',
    created_at: '2024-12-01T08:00:00Z',
  },
  central_admin: {
    id: 'usr-admin-central',
    citizen_id: 'BHM-CIT-100001',
    email: 'admin@landtech.gov.bd',
    name_bn: 'এ. কে. এম. রেজওয়ানুল হক',
    name_en: 'A. K. M. Rezwanul Haque',
    mobile: '01711556677',
    nid_no: '19792691094827103',
    father_name_bn: 'সামসুল হক',
    mother_name_bn: 'জাহেদা খাতুন',
    address_bn: 'ভূমি ভবন, তেজগাঁও, ঢাকা',
    district: 'ঢাকা',
    upazila: 'তেজগাঁও',
    role: 'central_admin',
    designation_bn: 'উপ-পরিচালক (আইসিটি ও অডিট)',
    office_name_bn: 'ভূমি রেকর্ড ও জরিপ অধিদপ্তর, ভূমি মন্ত্রণালয়',
    photo_url: '/avatars/officer_admin.jpg',
    nid_photo_url: '/avatars/officer_admin.jpg',
    kyc_status: 'verified',
    created_at: '2024-12-01T08:00:00Z',
  },
};

/**
 * Creates an offline mock JWT for immediate client authentication
 */
export const createOfflineDemoToken = (user: UserProfile): string => {
  try {
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const payload = btoa(
      unescape(
        encodeURIComponent(
          JSON.stringify({
            id: user.id,
            email: user.email,
            role: user.role,
            name_bn: user.name_bn,
            name_en: user.name_en,
            is_demo: true,
            exp: Math.floor(Date.now() / 1000) + 86400 * 30,
          })
        )
      )
    );
    return `${header}.${payload}.offline_demo_signature`;
  } catch {
    return `offline_demo_token_${user.id}_${Date.now()}`;
  }
};

/**
 * Matches an identifier (persona key, email, or role) to an offline demo profile
 */
export const findOfflineDemoUser = (identifier?: string, role?: string): UserProfile | null => {
  const cleanId = (identifier || '').trim().toLowerCase();
  const cleanRole = (role || '').trim().toLowerCase();

  // 1. Exact or partial match on persona keys
  if (cleanId === 'seller' || cleanId === 'arman') return OFFLINE_DEMO_USERS.seller;
  if (cleanId === 'buyer' || cleanId === 'farhan') return OFFLINE_DEMO_USERS.buyer;
  if (cleanId === 'taxdue' || cleanId === 'latif') return OFFLINE_DEMO_USERS.taxdue;
  if (cleanId === 'oversell' || cleanId === 'nazrul') return OFFLINE_DEMO_USERS.oversell;
  if (cleanId.includes('union')) return OFFLINE_DEMO_USERS.union_officer;
  if (cleanId.includes('ac_land') || cleanId.includes('acland')) return OFFLINE_DEMO_USERS.ac_land;
  if (cleanId.includes('registr')) return OFFLINE_DEMO_USERS.sub_registrar;
  if (cleanId.includes('admin')) return OFFLINE_DEMO_USERS.central_admin;

  // 2. Email matching
  if (cleanId.includes('seller@') || cleanId === 'demo-citizen@bhumisathi.gov.bd') {
    return cleanId.includes('buyer') ? OFFLINE_DEMO_USERS.buyer : OFFLINE_DEMO_USERS.seller;
  }
  if (cleanId.includes('buyer@')) return OFFLINE_DEMO_USERS.buyer;
  if (cleanId.includes('latif') || cleanId.includes('taxdue')) return OFFLINE_DEMO_USERS.taxdue;
  if (cleanId.includes('nazrul') || cleanId.includes('share')) return OFFLINE_DEMO_USERS.oversell;
  if (cleanId.includes('union.officer') || cleanId === 'demo-union@bhumisathi.gov.bd') {
    return OFFLINE_DEMO_USERS.union_officer;
  }
  if (cleanId.includes('ac.land') || cleanId === 'demo-acland@bhumisathi.gov.bd') {
    return OFFLINE_DEMO_USERS.ac_land;
  }
  if (cleanId.includes('sub.registrar') || cleanId === 'demo-subreg@bhumisathi.gov.bd') {
    return OFFLINE_DEMO_USERS.sub_registrar;
  }
  if (cleanId.includes('admin@') || cleanId === 'demo-admin@bhumisathi.gov.bd') {
    return OFFLINE_DEMO_USERS.central_admin;
  }

  // 3. Role matching
  if (cleanRole.includes('union')) return OFFLINE_DEMO_USERS.union_officer;
  if (cleanRole.includes('ac_land') || cleanRole.includes('acland')) return OFFLINE_DEMO_USERS.ac_land;
  if (cleanRole.includes('registr')) return OFFLINE_DEMO_USERS.sub_registrar;
  if (cleanRole.includes('admin')) return OFFLINE_DEMO_USERS.central_admin;
  if (cleanRole === 'citizen') return OFFLINE_DEMO_USERS.seller;

  // 4. Default fallback to primary demo citizen
  return OFFLINE_DEMO_USERS.seller;
};

// ================= Offline Dashboard Mock Resolvers =================

export const getOfflineMyHoldings = (userId: string = 'usr-seller-01') => {
  const targetId = userId || 'usr-seller-01';
  const ownerships = (rawDb.land_ownerships || []).filter(
    (o: any) => (o.owner_id === targetId || o.owner_id === 'usr-seller-01') && (o.status === 'active' || o.status === 'partial_transferred')
  );

  return ownerships.map((own: any) => {
    const parcel = (rawDb.land_parcels || []).find((p: any) => p.id === own.parcel_id);
    const khajna = (rawDb.khajna_accounts || []).find((k: any) => k.parcel_id === own.parcel_id);
    return {
      ownership: own,
      parcel: parcel || null,
      khajna: khajna || null,
    };
  });
};

export const getOfflineMyApplications = (userId: string = 'usr-seller-01') => {
  const targetId = userId || 'usr-seller-01';
  const myApps = (rawDb.sale_applications || []).filter(
    (a: any) => a.seller_id === targetId || a.buyer_id === targetId
  );
  if (myApps.length > 0) return myApps;
  return (rawDb.sale_applications || []).slice(0, 5);
};

export const getOfflineMutations = (userId?: string) => {
  return rawDb.mutation_applications || [];
};

export const getOfflineUnionQueue = () => {
  return {
    success: true,
    stats: {
      new_applications_count: 3,
      pending_review_count: 5,
      returned_count: 1,
      approved_count: 12,
      rejected_count: 1,
      tax_issue_count: 2,
    },
    applications: (rawDb.sale_applications || []).slice(0, 10),
  };
};

export const getOfflineAcLandQueue = () => {
  return {
    success: true,
    stats: {
      pending_hearings_count: 4,
      today_hearings_count: 2,
      completed_this_month: 18,
      appeal_cases_count: 1,
    },
    applications: (rawDb.sale_applications || []).slice(0, 10),
    mutations: rawDb.mutation_applications || [],
  };
};

export const getOfflineRegistryQueue = () => {
  return {
    success: true,
    stats: {
      today_appointments: 3,
      pending_verification: 4,
      registered_this_month: 26,
      stamp_duty_collected_bdt: 450000,
    },
    appointments: rawDb.registration_appointments || [],
    applications: (rawDb.sale_applications || []).slice(0, 10),
  };
};

export const getOfflineAdminQueue = () => {
  return {
    success: true,
    stats: {
      total_users: (rawDb.profiles || []).length || 1240,
      active_cases: (rawDb.sale_applications || []).length || 42,
      system_health: 'optimal',
      audit_alerts: 0,
    },
    users: rawDb.profiles || [],
    audit_logs: (rawDb.audit_logs || []).slice(0, 20),
  };
};
