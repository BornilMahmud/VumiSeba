import rawDb from './offlineSnapshot.json';
import { UserProfile, RiskAssessment, RiskFactorDetail } from '../types';

export const OFFLINE_DB = rawDb;

export const OFFLINE_DEMO_USERS: Record<string, UserProfile> = {
  seller: {
    id: 'usr-seller-01',
    citizen_id: 'BHM-CIT-882194',
    email: 'seller@bhumisathi.gov.bd',
    name_bn: 'মোঃ রফিকুল ইসলাম',
    name_en: 'MD. RAFIQUL ISLAM',
    mobile: '01711000001',
    nid_no: '19852691029384756',
    date_of_birth: '1985-04-12',
    father_name_bn: 'মোঃ আবুল কাসেম',
    mother_name_bn: 'মোছাঃ রহিমা খাতুন',
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
  tania: {
    id: 'usr-buyer-tania',
    citizen_id: 'BHM-CIT-691823',
    email: 'tania.sultana@bhumisathi.gov.bd',
    name_bn: 'তানিয়া সুলতানা',
    name_en: 'Tania Sultana',
    mobile: '01717507705',
    nid_no: '19983918291432601',
    date_of_birth: '1998-05-14',
    father_name_bn: 'শফিকুল ইসলাম',
    mother_name_bn: 'রোকসানা আক্তার',
    address_bn: 'বাড়ি ৪৫, ফ্ল্যাট ৩এ, রামপুরা, গুলশান, ঢাকা',
    district: 'ঢাকা',
    upazila: 'গুলশান',
    role: 'citizen',
    kyc_status: 'verified',
    kyc_verified_at: '2025-02-10T10:00:00Z',
    nid_photo_url: '/avatars/nid_female_tania.jpg',
    photo_url: '/avatars/nid_female_tania.jpg',
    created_at: '2025-01-25T09:00:00Z',
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
  if (cleanId === 'seller' || cleanId === 'rafiq') return OFFLINE_DEMO_USERS.seller;
  if (cleanId === 'tania' || cleanId.includes('tania') || cleanId.includes('তানিয়া')) return OFFLINE_DEMO_USERS.tania;
  if (cleanId === 'buyer' || cleanId === 'farhan') return OFFLINE_DEMO_USERS.buyer;
  if (cleanId === 'taxdue' || cleanId === 'latif') return OFFLINE_DEMO_USERS.taxdue;
  if (cleanId === 'oversell' || cleanId === 'nazrul') return OFFLINE_DEMO_USERS.oversell;
  if (cleanId.includes('union')) return OFFLINE_DEMO_USERS.union_officer;
  if (cleanId.includes('ac_land') || cleanId.includes('acland')) return OFFLINE_DEMO_USERS.ac_land;
  if (cleanId.includes('registr')) return OFFLINE_DEMO_USERS.sub_registrar;
  if (cleanId.includes('admin')) return OFFLINE_DEMO_USERS.central_admin;

  // 2. Email matching
  if (cleanId.includes('seller') || cleanId === 'demo-citizen@bhumisathi.gov.bd') {
    return cleanId.includes('buyer') ? OFFLINE_DEMO_USERS.buyer : OFFLINE_DEMO_USERS.seller;
  }
  if (cleanId.includes('buyer')) return OFFLINE_DEMO_USERS.buyer;
  if (cleanId.includes('latif') || cleanId.includes('taxdue')) return OFFLINE_DEMO_USERS.taxdue;
  if (cleanId.includes('nazrul') || cleanId.includes('share') || cleanId.includes('oversell')) return OFFLINE_DEMO_USERS.oversell;
  if (cleanId.includes('union') || cleanId.includes('kamal') || cleanId === 'demo-union@bhumisathi.gov.bd') {
    return OFFLINE_DEMO_USERS.union_officer;
  }
  if (cleanId.includes('ac.land') || cleanId.includes('acland') || cleanId.includes('tanvir') || cleanId === 'demo-acland@bhumisathi.gov.bd') {
    return OFFLINE_DEMO_USERS.ac_land;
  }
  if (cleanId.includes('registrar') || cleanId.includes('registry') || cleanId.includes('roksana') || cleanId === 'demo-subreg@bhumisathi.gov.bd') {
    return OFFLINE_DEMO_USERS.sub_registrar;
  }
  if (cleanId.includes('admin') || cleanId === 'demo-admin@bhumisathi.gov.bd') {
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
  let ownerships = (rawDb.land_ownerships || []).filter(
    (o: any) => (o.owner_id === targetId || (targetId === 'usr-seller-01' && typeof o.owner_id === 'string' && o.owner_id.includes('seller'))) && (o.status === 'active' || o.status === 'partial_transferred')
  );

  if (ownerships.length === 0) {
    ownerships = (rawDb.land_ownerships || []).slice(0, 3);
  }

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
    (a: any) => a.seller_id === targetId || a.buyer_id === targetId || a.applicant_id === targetId
  );
  if (myApps.length > 0) return myApps;
  return (rawDb.sale_applications || []).slice(0, 8);
};

export const getOfflineMutations = (userId?: string) => {
  if (userId) {
    const userMutations = (rawDb.mutation_applications || []).filter(
      (m: any) => m.applicant_id === userId || m.buyer_id === userId || m.seller_id === userId
    );
    if (userMutations.length > 0) return userMutations;
  }
  return rawDb.mutation_applications || [];
};

export const getOfflineUnionQueue = () => {
  const apps = rawDb.sale_applications || [];
  return {
    success: true,
    stats: {
      new_applications_count: apps.filter((a: any) => a.stage === 'UNION_LAND_OFFICE_VERIFICATION').length || 3,
      pending_review_count: 5,
      returned_count: 1,
      approved_count: 12,
      rejected_count: 1,
      tax_issue_count: 2,
    },
    all_applications: apps,
    queue: apps,
    applications: apps,
  };
};

export const getOfflineAcLandQueue = () => {
  const apps = rawDb.sale_applications || [];
  const mutations = rawDb.mutation_applications || [];
  return {
    success: true,
    stats: {
      awaiting_review_count: apps.filter((a: any) => a.stage === 'AC_LAND_PRE_REGISTRATION_AUDIT').length || 4,
      returned_count: 1,
      approved_count: 18,
      rejected_count: 1,
      mutation_pending_count: mutations.length || 6,
      hearings_scheduled_count: 2,
      completed_count: 12,
    },
    all_applications: apps,
    applications: apps,
    queue: apps,
    pre_registration_all: apps,
    pre_registration_queue: apps,
    mutation_cases: mutations,
    mutations: mutations,
    hearings: mutations.filter((m: any) => m.hearing_date || m.current_stage === 'hearing_scheduled'),
  };
};

export const getOfflineRegistryQueue = () => {
  const apps = rawDb.sale_applications || [];
  const appointments = rawDb.registration_appointments || [];
  return {
    success: true,
    stats: {
      ready_for_scheduling_count: apps.filter((a: any) => a.stage === 'SUB_REGISTRY_SCHEDULING').length || 3,
      appointments_scheduled_count: appointments.length || 4,
      awaiting_completion_count: 2,
      completed_registrations_count: 26,
      total_cases: apps.length,
      today_appointments: 3,
      pending_verification: 4,
      registered_this_month: 26,
      stamp_duty_collected_bdt: 450000,
    },
    ready_queue: apps.filter((a: any) => a.stage === 'SUB_REGISTRY_SCHEDULING' || a.stage === 'SUB_REGISTRY_VERIFICATION'),
    scheduled_queue: apps.filter((a: any) => a.appointment_details || a.stage === 'DEED_REGISTRATION_IN_PROGRESS'),
    completed_queue: apps.filter((a: any) => a.stage === 'REGISTRATION_COMPLETE' || a.stage === 'MUTATION_APPROVED'),
    completed_records: apps.filter((a: any) => a.stage === 'REGISTRATION_COMPLETE' || a.stage === 'MUTATION_APPROVED'),
    appointments: appointments,
    all_applications: apps,
    applications: apps,
  };
};

export const getOfflineAdminQueue = () => {
  const apps = rawDb.sale_applications || [];
  const profiles = rawDb.profiles || [];
  const logs = rawDb.audit_logs || [];
  return {
    success: true,
    stats: {
      total_citizens: profiles.filter((p: any) => p.role === 'citizen').length || 1240,
      pending_kyc_count: 2,
      total_applications: apps.length || 42,
      union_pending_count: apps.filter((a: any) => a.stage === 'UNION_LAND_OFFICE_VERIFICATION').length || 5,
      acland_pending_count: apps.filter((a: any) => a.stage === 'AC_LAND_PRE_REGISTRATION_AUDIT').length || 4,
      registry_pending_count: apps.filter((a: any) => a.stage === 'SUB_REGISTRY_SCHEDULING').length || 3,
      completed_registrations: 26,
      mutation_approved_count: 14,
      returned_count: 2,
      rejected_count: 1,
      applications_by_stage: [
        { stage: 'UNION_LAND_OFFICE_VERIFICATION', count: 5, label_bn: 'ইউনিয়ন যাচাই' },
        { stage: 'AC_LAND_PRE_REGISTRATION_AUDIT', count: 4, label_bn: 'এসি ল্যান্ড অডিট' },
        { stage: 'SUB_REGISTRY_SCHEDULING', count: 3, label_bn: 'সাব-রেজিস্ট্রি' },
        { stage: 'MUTATION_APPROVED', count: 14, label_bn: 'নামজারি সম্পন্ন' },
      ],
      blocked_fraud_attempts: { total_blocked: 12, by_reason: [{ reason_bn: 'ভুয়া খতিয়ান রেকর্ড', count: 6 }, { reason_bn: 'আদালতের নিষেধাজ্ঞা গোপন', count: 4 }, { reason_bn: 'কর বকেয়া', count: 2 }] },
      average_days_per_stage: [
        { stage_bn: 'ইউনিয়ন প্রতিবেদন', avg_days: 1.8 },
        { stage_bn: 'এসি ল্যান্ড অডিট', avg_days: 1.2 },
        { stage_bn: 'সাব-রেজিস্ট্রি', avg_days: 2.1 },
      ],
    },
    sales_queue: apps,
    applications: apps,
    pending_kyc: profiles.filter((p: any) => p.kyc_status === 'pending' || !p.kyc_status),
    users: profiles,
    audit_logs: logs,
  };
};

export const getOfflineRiskAssessment = (payload: {
  parcel_id?: string;
  seller_identifier?: string;
  proposed_share?: number;
  proposed_area_decimal?: number;
}): { success: boolean; data: RiskAssessment } => {
  const parcelId = payload?.parcel_id || 'pcl-clean-405';
  let parcel: any = (rawDb.land_parcels || []).find((p: any) => p.id === parcelId);
  if (!parcel) {
    if (parcelId === 'pcl-khas-999') {
      parcel = {
        id: 'pcl-khas-999',
        dag_no: '৯৯৯',
        khatian_no: '০১',
        mouza: 'সাভার',
        total_area_decimal: 60,
        is_khas_land: true,
        is_acquired: false,
        is_vested: false,
        court_case_flag: false,
        bank_mortgage_flag: false,
        address_description_bn: 'মৌজা সাভার, দাগ ৯৯৯, বংশী নদী তীরবর্তী ১০০% সরকারি খাস জমি'
      };
    } else {
      parcel = (rawDb.land_parcels || [])[0] || {};
    }
  }

  const ownerships = (rawDb.land_ownerships || []).filter((o: any) => o.parcel_id === parcelId);
  const khajna = (rawDb.khajna_accounts || []).find((k: any) => k.parcel_id === parcelId);
  const activeApps = (rawDb.sale_applications || []).filter(
    (s: any) => s.parcel_id === parcelId && s.status === 'active' && s.stage !== 'REJECTED' && s.stage !== 'MUTATION_APPROVED'
  );

  const identified_issues_bn: string[] = [];
  const warning_basis_bn: string[] = [];
  const unverified_data_bn: string[] = [
    'সরেজমিন শারীরিক সীমানা ও তৃতীয় পক্ষের অননুমোদিত দখল (মাঠ তদন্ত সাপেক্ষ)',
    'ওয়ারিশগণের মধ্যে অপ্রকাশিত পারিবারিক বিরোধ বা গোপন বণ্টননামা'
  ];
  const recommended_actions_bn: string[] = [];
  const critical_override_reasons: string[] = [];
  const factors: RiskFactorDetail[] = [];

  let score = 100;
  let hasCritical = false;

  // 1. Court Injunction & Litigation (Critical Factor)
  const isCourtDisputed = Boolean(parcel.court_case_flag);
  if (isCourtDisputed) {
    score -= 35;
    hasCritical = true;
    critical_override_reasons.push('আদালতের দেওয়ানি মোকদ্দমা বা স্থগিতাদেশ বলবৎ');
    identified_issues_bn.push(`আদালতে দেওয়ানি মামলা বিচারাধীন রয়েছে: ${parcel.court_case_details_bn || 'বিজ্ঞ আদালতের স্থগিতাদেশ বলবৎ'}`);
    warning_basis_bn.push('জেলা জজ আদালত মোকদ্দমা রেজিস্টার ও ডিজিটাল মামলা ট্র্যাকিং ডাটাবেজ');
    recommended_actions_bn.push('কোনো অবস্থাতেই এই জমিতে আর্থিক লেনদেন বা বায়না করবেন না। আদালতের চূড়ান্ত নিষ্পত্তি পর্যন্ত অপেক্ষা করুন।');
    factors.push({
      factor_key: 'court_injunction',
      title_bn: 'আদালতের নিষেধাজ্ঞা ও দেওয়ানি বিরোধ',
      title_en: 'Court Injunction & Civil Litigation',
      status: 'failed',
      is_critical: true,
      weight_max_points: 35,
      deducted_points: 35,
      explanation_bn: `বিজ্ঞ আদালতে দেওয়ানি মোকদ্দমা বা স্থগিতাদেশ বলবৎ রয়েছে (${parcel.court_case_details_bn || 'মামলা বিচারাধীন'})।`,
      explanation_en: `Active court injunction or litigation exists (${parcel.court_case_details_bn || 'Case pending'}). Transactions strictly prohibited.`
    });
  } else {
    warning_basis_bn.push('বাংলাদেশ জাতীয় বিচার বিভাগীয় মামলার কেন্দ্রীয় ডেটাবেজ');
    factors.push({
      factor_key: 'court_injunction',
      title_bn: 'আদালতের নিষেধাজ্ঞা ও দেওয়ানি বিরোধ',
      title_en: 'Court Injunction & Civil Litigation',
      status: 'passed',
      is_critical: true,
      weight_max_points: 35,
      deducted_points: 0,
      explanation_bn: 'জাতীয় বিচার বিভাগীয় ডাটাবেজ মোতাবেক এই জমিতে কোনো সক্রিয় দেওয়ানি মোকদ্দমা বা আদালতের স্থগিতাদেশ নেই।',
      explanation_en: 'No active court dispute or civil injunction found in national judicial databases.'
    });
  }

  // 2. Government Khas / Acquired / Vested Land (Critical Factor)
  const isGovLand = Boolean(parcel.is_khas_land || parcel.is_acquired || parcel.is_vested);
  if (isGovLand) {
    score -= 35;
    hasCritical = true;
    const govReason = parcel.is_khas_land
      ? '১০০% সরকারি খাস জমি'
      : parcel.is_acquired
      ? 'সরকারি উন্নয়ন প্রকল্পে অধিগ্রহণকৃত ভূমি'
      : 'অর্পিত/পরিত্যক্ত সম্পত্তি';
    critical_override_reasons.push(govReason);
    identified_issues_bn.push(`জমিটি ${govReason} হিসেবে সংরক্ষিত। ব্যক্তিগত হস্তান্তর আইনত বাতিল ও দণ্ডনীয়।`);
    warning_basis_bn.push('জেলা প্রশাসন ও ভূমি রেকর্ড ও জরিপ অধিদপ্তর (ডিএলআরএস) খাস খতিয়ান ইনডেক্স');
    recommended_actions_bn.push('এটি সরকারি সম্পত্তি। যেকোনো প্রকার বিক্রয় প্রস্তাব প্রতারণামূলক; স্থানীয় ভূমি অফিসে অবহিত করুন।');
    factors.push({
      factor_key: 'government_land',
      title_bn: 'সরকারি খাস, অধিগ্রহণ বা অর্পিত সম্পত্তি সংরক্ষণ',
      title_en: 'Government Khas / Acquired / Vested Property',
      status: 'failed',
      is_critical: true,
      weight_max_points: 35,
      deducted_points: 35,
      explanation_bn: `জমিটি ${govReason} হিসেবে সরকারি গেজেটভুক্ত। ব্যক্তিগত মালিকানায় হস্তান্তর দণ্ডনীয় অপরাধ।`,
      explanation_en: `Parcel is designated as ${govReason}. Private conveyance is illegal and void ab initio.`
    });
  } else {
    warning_basis_bn.push('ভূমি রেকর্ড ও জরিপ অধিদপ্তর (DLRS) সরকারি খাস খতিয়ান গেজেট');
    factors.push({
      factor_key: 'government_land',
      title_bn: 'সরকারি খাস, অধিগ্রহণ বা অর্পিত সম্পত্তি সংরক্ষণ',
      title_en: 'Government Khas / Acquired / Vested Property',
      status: 'passed',
      is_critical: true,
      weight_max_points: 35,
      deducted_points: 0,
      explanation_bn: 'জমিটি সম্পূর্ণ ব্যক্তিগত খতিয়ানভুক্ত; সরকারি খাস, অধিগ্রহণ বা অর্পিত সম্পত্তির আওতামুক্ত।',
      explanation_en: 'Property is verified private land, cleared of government khas, acquisition, or vested encumbrance.'
    });
  }

  // 3. Bank Mortgage & Financial Liens (Critical Factor)
  const isMortgaged = Boolean(parcel.bank_mortgage_flag);
  if (isMortgaged) {
    score -= 25;
    hasCritical = true;
    critical_override_reasons.push('ব্যাংক মর্টগেজ ও আর্থিক দায়বদ্ধতা বিদ্যমান');
    identified_issues_bn.push(`তফসিলি ব্যাংকে জমিটি বন্ধক রেখে ঋণ গ্রহণ করা হয়েছে: ${parcel.bank_mortgage_details_bn || 'মর্টগেজ বহাল'}`);
    warning_basis_bn.push('বাংলাদেশ ব্যাংক সিআইবি ও সাব-রেজিস্ট্রি মর্টগেজ নিবন্ধন রেজিস্টার');
    recommended_actions_bn.push('সংশ্লিষ্ট ঋণদাতা ব্যাংক থেকে মূল নো-অবজেকশন সার্টিফিকেট (NOC) ও দায়মুক্তি সনদ সংগ্রহ না করা পর্যন্ত কোনো লেনদেন করবেন না।');
    factors.push({
      factor_key: 'bank_mortgage',
      title_bn: 'ব্যাংক মর্টগেজ ও আর্থিক দায়বদ্ধতা',
      title_en: 'Bank Mortgage & Lien Encumbrance',
      status: 'failed',
      is_critical: true,
      weight_max_points: 25,
      deducted_points: 25,
      explanation_bn: `জমিটিতে ঋণ গ্রহণের বিপরীতে ব্যাংকে রেজিস্টার্ড মর্টগেজ বা লিয়েন রয়েছে (${parcel.bank_mortgage_details_bn || 'ব্যাংক দায় বহাল'})।`,
      explanation_en: `Registered mortgage/lien encumbrance found (${parcel.bank_mortgage_details_bn || 'Bank lien active'}).`
    });
  } else {
    warning_basis_bn.push('সাব-রেজিস্ট্রি ইনডেক্স ও তফসিলি ব্যাংক বন্ধক রেজিস্টার');
    factors.push({
      factor_key: 'bank_mortgage',
      title_bn: 'ব্যাংক মর্টগেজ ও আর্থিক দায়বদ্ধতা',
      title_en: 'Bank Mortgage & Lien Encumbrance',
      status: 'passed',
      is_critical: true,
      weight_max_points: 25,
      deducted_points: 0,
      explanation_bn: 'সাব-রেজিস্ট্রি ইনডেক্স ও তফসিলি ব্যাংক ডাটাবেজ অনুযায়ী জমিটিতে কোনো মর্টগেজ বা আর্থিক লিয়েন নেই।',
      explanation_en: 'No registered mortgage lien or charge found in Sub-Registry or bank encumbrance indices.'
    });
  }

  // 4. Seller Ownership Match & Share Validation (Critical Factor)
  let sellerMatch = false;
  let shareValid = true;
  let matchingOwner: any = null;

  if (payload.seller_identifier && payload.seller_identifier.trim()) {
    const ident = payload.seller_identifier.trim();
    matchingOwner = ownerships.find(
      (o: any) =>
        o.owner_nid === ident ||
        o.owner_id === ident ||
        (o.owner_name_bn && o.owner_name_bn.includes(ident))
    );
    if (!matchingOwner && ownerships.length > 0) {
      if (ident === '19852691029384756' && parcelId === 'pcl-clean-405') {
        matchingOwner = ownerships[0];
      } else if (ident === '19782691099381726' && parcelId === 'pcl-taxdue-882') {
        matchingOwner = ownerships[0];
      } else if (ident === '19822695028371948' && parcelId === 'pcl-oversell-102') {
        matchingOwner = ownerships[0];
      }
    }
  } else if (!isGovLand && ownerships.length > 0) {
    matchingOwner = ownerships[0];
  }

  if (matchingOwner) {
    sellerMatch = true;
    warning_basis_bn.push(`খতিয়ান নং ${parcel.khatian_no || 'রেকর্ড'} মালিকানা ভলিউম (রেকর্ডকৃত মালিক: ${matchingOwner.owner_name_bn})`);

    const proposedShare = payload.proposed_share !== undefined ? Number(payload.proposed_share) : 0.05;
    const recordedShare = Number(matchingOwner.share_portion || 0.5);

    if (proposedShare > recordedShare) {
      shareValid = false;
      score -= 30;
      hasCritical = true;
      critical_override_reasons.push('বিক্রেতার রেকর্ডকৃত হিস্যা অতিক্রমণ (হিস্যা ঘাটতি)');
      identified_issues_bn.push(
        `বিক্রেতার সরকারি খতিয়ানে মালিকানা অংশ ${(recordedShare * 100).toFixed(1)}%, কিন্তু বিক্রির প্রস্তাব করা হয়েছে ${(proposedShare * 100).toFixed(1)}%।`
      );
      recommended_actions_bn.push(`প্রস্তাবিত বিক্রয় অংশ সংশোধন করে সর্বোচ্চ ${(recordedShare * 100).toFixed(1)}% এর মধ্যে সীমাবদ্ধ করুন।`);
      factors.push({
        factor_key: 'share_validation',
        title_bn: 'বিক্রেতার মালিকানা হিস্যা ও বৈধতা',
        title_en: 'Seller Share Verification & Over-Sale Guard',
        status: 'failed',
        is_critical: true,
        weight_max_points: 30,
        deducted_points: 30,
        explanation_bn: `বিক্রেতার রেকর্ডকৃত হিস্যা ${(recordedShare * 100).toFixed(1)}% এর চেয়ে প্রস্তাবিত বিক্রয় হিস্যা ${(proposedShare * 100).toFixed(1)}% বেশি। অতিরিক্ত বিক্রি আইনত অবৈধ।`,
        explanation_en: `Proposed share ${(proposedShare * 100).toFixed(1)}% exceeds recorded share ${(recordedShare * 100).toFixed(1)}%. Over-selling is legally prohibited.`
      });
    } else {
      factors.push({
        factor_key: 'share_validation',
        title_bn: 'বিক্রেতার মালিকানা হিস্যা ও বৈধতা',
        title_en: 'Seller Share Verification & Over-Sale Guard',
        status: 'passed',
        is_critical: true,
        weight_max_points: 30,
        deducted_points: 0,
        explanation_bn: `বিক্রেতার মালিকানা নিশ্চিত। রেকর্ডকৃত হিস্যা ${(recordedShare * 100).toFixed(1)}% এর মধ্যে প্রস্তাবিত ${(proposedShare * 100).toFixed(1)}% অংশ বিদ্যমান।`,
        explanation_en: `Seller is verified owner with sufficient recorded share (${(recordedShare * 100).toFixed(1)}% >= ${(proposedShare * 100).toFixed(1)}%).`
      });
    }
  } else {
    if (payload.seller_identifier && payload.seller_identifier.trim()) {
      score -= 30;
      hasCritical = true;
      critical_override_reasons.push('প্রস্তাবিত বিক্রেতার মালিকানা রেকর্ড অনুপস্থিত');
      identified_issues_bn.push('প্রস্তাবিত বিক্রেতার এনআইডি বা পরিচিতি সরকারি মালিকানা রেকর্ডের সাথে মিলছে না।');
      recommended_actions_bn.push('বিক্রেতার হালনাগাদ ওয়ারিশান সনদ বা নামজারি খতিয়ান যাচাই করুন।');
      factors.push({
        factor_key: 'share_validation',
        title_bn: 'বিক্রেতার মালিকানা হিস্যা ও বৈধতা',
        title_en: 'Seller Share Verification & Over-Sale Guard',
        status: 'failed',
        is_critical: true,
        weight_max_points: 30,
        deducted_points: 30,
        explanation_bn: 'প্রস্তাবিত বিক্রেতার এনআইডি সরকারি খতিয়ান রেকর্ডের সাথে মিলছে না।',
        explanation_en: 'Proposed seller ID does not match any active ownership record in the official khatian.'
      });
    } else {
      score -= 10;
      factors.push({
        factor_key: 'share_validation',
        title_bn: 'বিক্রেতার মালিকানা হিস্যা ও বৈধতা',
        title_en: 'Seller Share Verification & Over-Sale Guard',
        status: 'warning',
        is_critical: false,
        weight_max_points: 30,
        deducted_points: 10,
        explanation_bn: 'নির্দিষ্ট কোনো বিক্রেতার এনআইডি প্রদান করা হয়নি। পার্সেলটির সামগ্রিক খতিয়ান রেকর্ড যাচাই করা হয়েছে।',
        explanation_en: 'No seller NID specified. General plot record evaluated.'
      });
    }
  }

  // 5. Land Development Tax (Khajna)
  let taxCleared = true;
  if (khajna && khajna.status === 'dues_pending' && khajna.arrears_bdt > 0) {
    taxCleared = false;
    score -= 20;
    identified_issues_bn.push(`বকেয়া ভূমি উন্নয়ন কর ${khajna.arrears_bdt} টাকা অপরিশোধিত রয়েছে।`);
    warning_basis_bn.push(`ইউনিয়ন ভূমি অফিস হোল্ডিং নং ${khajna.holding_no || parcel.current_holding_no || 'হোল্ডিং'} খাজনা রেজিস্টার`);
    recommended_actions_bn.push('বিক্রেতাকে অবিলম্বে বকেয়া খাজনা পরিশোধ করে হালনাগাদ দাখিলা গ্রহণের অনুরোধ করুন।');
    factors.push({
      factor_key: 'tax_clearance',
      title_bn: 'ভূমি উন্নয়ন কর (খাজনা) হালনাগাদ স্থিতি',
      title_en: 'Land Development Tax (LD Tax) Status',
      status: 'warning',
      is_critical: false,
      weight_max_points: 20,
      deducted_points: 20,
      explanation_bn: `জমিটিতে ${khajna.arrears_bdt} টাকা বকেয়া খাজনা অপরিশোধিত রয়েছে। কর পরিশোধ সনদ ব্যতিরেকে জমি বিক্রি নিষিদ্ধ।`,
      explanation_en: `Outstanding land development tax of BDT ${khajna.arrears_bdt}. Tax clearance required prior to registration.`
    });
  } else {
    warning_basis_bn.push(`হোল্ডিং নং ${parcel.current_holding_no || 'হোল্ডিং'} ভূমি উন্নয়ন কর পরিশোধিত দাখিলা`);
    factors.push({
      factor_key: 'tax_clearance',
      title_bn: 'ভূমি উন্নয়ন কর (খাজনা) হালনাগাদ স্থিতি',
      title_en: 'Land Development Tax (LD Tax) Status',
      status: 'passed',
      is_critical: false,
      weight_max_points: 20,
      deducted_points: 0,
      explanation_bn: 'ভূমি উন্নয়ন কর হালনাগাদ পরিশোধিত রয়েছে এবং কর আদায় দাখিলা সংরক্ষিত।',
      explanation_en: 'Land development tax is fully cleared with verified dakhila certificate.'
    });
  }

  // 6. Conflicting Sales / Double Sale Guard
  const duplicateSaleRisk = activeApps.length > 0;
  if (duplicateSaleRisk) {
    score -= 15;
    identified_issues_bn.push(`এই দাগে ইতিমধ্যে ${activeApps.length}টি সক্রিয় বিক্রয় আবেদন প্রক্রিয়াধীন রয়েছে।`);
    warning_basis_bn.push('ভূমি সেবা পোর্টাল চলমান আবেদন রেজিস্টার');
    recommended_actions_bn.push('পূর্বে চলমান কোনো বায়না বা চুক্তি আছে কি না সংশ্লিষ্ট সাব-রেজিস্ট্রারের মাধ্যমে যাচাই করুন।');
    factors.push({
      factor_key: 'duplicate_sale',
      title_bn: 'দ্বৈত বা সমকালীন বিক্রয় বিরোধ প্রতিরোধ',
      title_en: 'Concurrent Conflicting Sales',
      status: 'failed',
      is_critical: false,
      weight_max_points: 15,
      deducted_points: 15,
      explanation_bn: `এই দাগে ইতিমধ্যে ${activeApps.length}টি সক্রিয় বিক্রয় আবেদন চলমান রয়েছে। দ্বৈত বিক্রির ঝুঁকি বিদ্যমান।`,
      explanation_en: `Multiple (${activeApps.length}) concurrent pending sale applications detected on this parcel.`
    });
  } else {
    factors.push({
      factor_key: 'duplicate_sale',
      title_bn: 'দ্বৈত বা সমকালীন বিক্রয় বিরোধ প্রতিরোধ',
      title_en: 'Concurrent Conflicting Sales',
      status: 'passed',
      is_critical: false,
      weight_max_points: 15,
      deducted_points: 0,
      explanation_bn: 'এই দাগে কোনো সমকালীন বিরোধপূর্ণ বা ডুপ্লিকেট বিক্রয় আবেদন নেই।',
      explanation_en: 'No conflicting concurrent sale applications found.'
    });
  }

  // 7. Document Harmony & Consistency
  factors.push({
    factor_key: 'document_consistency',
    title_bn: 'নথিপত্রের সঙ্গতি ও পর্চা যাচাই',
    title_en: 'Document Consistency & Boundary Harmony',
    status: isCourtDisputed || isGovLand ? 'warning' : 'passed',
    is_critical: false,
    weight_max_points: 10,
    deducted_points: isCourtDisputed || isGovLand ? 5 : 0,
    explanation_bn:
      isCourtDisputed || isGovLand
        ? 'নথিপত্রের রেকর্ডে বিশেষ আইনি পর্যবেক্ষণ বা নোট অন্তর্ভুক্ত রয়েছে।'
        : 'সংযুক্ত সকল খতিয়ান ও দলিলের রেকর্ড পরস্পর সামঞ্জস্যপূর্ণ।',
    explanation_en:
      isCourtDisputed || isGovLand
        ? 'Documentary records contain statutory caveat notices.'
        : 'All uploaded deeds, porcha maps, and khatian schedules are internally consistent.'
  });
  if (isCourtDisputed || isGovLand) score -= 5;

  score = Math.max(0, Math.min(100, score));
  let overallRiskLevel: 'low' | 'medium' | 'high' | 'critical' = 'low';

  if (hasCritical) {
    overallRiskLevel = isCourtDisputed || isGovLand ? 'critical' : 'high';
    score = Math.min(score, 48);
  } else if (score >= 85) {
    overallRiskLevel = 'low';
  } else if (score >= 60) {
    overallRiskLevel = 'medium';
  } else if (score >= 35) {
    overallRiskLevel = 'high';
  } else {
    overallRiskLevel = 'critical';
  }

  let summaryBn =
    'জমিটির আর.এস/বি.এস খতিয়ান, খাজনা দাখিলা এবং মালিকানার ইতিহাস নির্ভরযোগ্য। কোনো মামলা বা ব্যাংক দায় পরিলক্ষিত হয়নি। বায়না ও রেজিস্ট্রেশন প্রক্রিয়া নিরাপদে শুরু করতে পারেন।';
  let summaryEn =
    'Clean title parcel verified with reliable khatian, cleared tax dakhila, and unencumbered ownership history.';

  if (overallRiskLevel === 'critical') {
    summaryBn =
      'সর্বোচ্চ ঝুঁকিপূর্ণ জমি! এই জমিতে আদালতের মোকদ্দমা বা সরকারি খাস/অধিগ্রহণকৃত সম্পত্তির প্রমাণ রয়েছে। এই জমিতে কোনো প্রকার অর্থ লেনদেন বা বায়না করা সম্পূর্ণ বেআইনি ও দণ্ডনীয়।';
    summaryEn =
      'Critical risk detected! Active litigation or government khas encumbrance found. Transactions are strictly prohibited.';
  } else if (overallRiskLevel === 'high') {
    summaryBn =
      'উচ্চ ঝুঁকি শনাক্ত হয়েছে! বিক্রেতার মালিকানা হিস্যা অতিক্রমণ বা ব্যাংক মর্টগেজ দায়বদ্ধতার প্রমাণ রয়েছে। যথাযথ দায়মুক্তি সনদ ব্যতিরেকে কোনো আর্থিক লেনদেন করবেন না।';
    summaryEn =
      'High risk detected! Share quota discrepancy or active bank mortgage identified. Do not disburse funds without clearance.';
  } else if (overallRiskLevel === 'medium') {
    summaryBn =
      'মাঝারি সতর্কতা! জমিটির মালিকানা সঠিক থাকলেও বকেয়া খাজনা বা সহ-শরিকের হিস্যা সংক্রান্ত সতর্কতা রয়েছে। বিক্রির পূর্বে বকেয়া কর পরিশোধ নিশ্চিত করুন।';
    summaryEn =
      'Medium risk notice. Ownership is verified but pending tax arrears require clearance before deed registration.';
  }

  if (recommended_actions_bn.length === 0) {
    recommended_actions_bn.push('সহ-শরিকদের সাথে সীমানা বণ্টননামা দলিল থাকলে তা সংগ্রহ করুন।');
    recommended_actions_bn.push('সরেজমিনে গিয়ে দাগের নির্দিষ্ট অংশে বিক্রেতার দখল নিশ্চিত করুন।');
    recommended_actions_bn.push('অনলাইনে নিরাপদ বিক্রয় আবেদন ও ই-নামজারি প্রক্রিয়া শুরু করতে পারেন।');
  }

  return {
    success: true,
    data: {
      id: `RISK-${Date.now()}-${Math.floor(Math.random() * 900 + 100)}`,
      parcel_id: parcelId,
      overall_risk_level: overallRiskLevel,
      risk_score: score,
      engine_version: 'v2.2-transparency',
      data_as_of: '2026-10-15',
      disclaimer_bn:
        'অত্র ঝুঁকি মূল্যায়ন প্রতিবেদনটি ডিজিটাল ভূমি রেকর্ডসমূহের প্রাথমিক স্বয়ংক্রিয় পর্যবেক্ষণীয় বিশ্লেষণ, কোনো চূড়ান্ত আইনি দলিল, প্রত্যয়নপত্র বা টাইটেল গ্যারান্টি নয়। যেকোনো জমি ক্রয়ের পূর্বে উপযুক্ত বিজ্ঞ আইনজীবী দ্বারা সরেজমিন দলিল ও শারীরিক দখল যাচাইকরণ আবশ্যক।',
      disclaimer_en:
        'This advisory risk assessment is an automated analytical check against digital public land records, not a formal legal certificate or title guarantee. Physical due diligence and formal legal counsel are strongly advised before purchase.',
      critical_override_triggered: hasCritical,
      critical_override_reasons: critical_override_reasons,
      factors: factors,
      summary_bn: summaryBn,
      summary_en: summaryEn,
      identified_issues_bn: identified_issues_bn,
      warning_basis_bn: warning_basis_bn,
      unverified_data_bn: unverified_data_bn,
      recommended_actions_bn: recommended_actions_bn,
      seller_match: sellerMatch,
      share_valid: shareValid,
      tax_cleared: taxCleared,
      court_dispute: isCourtDisputed,
      mortgage_encumbrance: isMortgaged,
      duplicate_sale_risk: duplicateSaleRisk,
      acquisition_risk: Boolean(parcel.is_acquired),
      document_discrepancy: false,
      generated_at: new Date().toISOString()
    }
  };
};

