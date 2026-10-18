import {
  findOfflineDemoUser,
  createOfflineDemoToken,
  getOfflineMyHoldings,
  getOfflineMyApplications,
  getOfflineMutations,
  getOfflineUnionQueue,
  getOfflineAcLandQueue,
  getOfflineRegistryQueue,
  getOfflineAdminQueue,
  getOfflineRiskAssessment,
  OFFLINE_DB,
  OFFLINE_DEMO_USERS,
} from '../data/offlineDemoData';

const getApiBase = (): string => {
  try {
    const envUrl = (import.meta as any).env?.VITE_API_BASE_URL;
    if (envUrl && typeof envUrl === 'string' && envUrl.trim() !== '') {
      let trimmed = envUrl.trim().replace(/\/+$/, '');
      if (!trimmed.endsWith('/api') && !trimmed.includes('/api')) {
        trimmed = `${trimmed}/api`;
      }
      return trimmed;
    }
  } catch {
    // browser fallback
  }
  return '/api';
};

const API_BASE = getApiBase();

function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem('vumiseba_token') || localStorage.getItem('bhumisathi_token');
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

function resolveOfflineFallback(endpoint: string, options: RequestInit = {}): any {
  let body: any = {};
  if (options.body && typeof options.body === 'string') {
    try {
      body = JSON.parse(options.body);
    } catch {
      body = {};
    }
  }

  // 1. Demo Login offline fallback
  if (endpoint === '/auth/demo-login') {
    const user = findOfflineDemoUser(body.persona, body.role);
    if (user) {
      const token = createOfflineDemoToken(user);
      return {
        success: true,
        message_bn: `ডেমো লগইন সফল হয়েছে (${user.name_bn})।`,
        token,
        user,
      };
    }
  }

  // 2. Standard Login offline fallback for demo emails
  if (endpoint === '/auth/login') {
    const user = findOfflineDemoUser(body.email);
    if (user) {
      const token = createOfflineDemoToken(user);
      return {
        success: true,
        message_bn: `লগইন সফল হয়েছে (${user.name_bn})।`,
        token,
        user,
      };
    }
  }

  // 3. Current User Profile
  if (endpoint === '/auth/me') {
    const isDemo = localStorage.getItem('bhumisathi_is_demo') === 'true';
    const cachedUser = localStorage.getItem('bhumisathi_demo_user');
    if (isDemo && cachedUser) {
      try {
        return {
          success: true,
          user: JSON.parse(cachedUser),
        };
      } catch {
        // fallback
      }
    }
    if (isDemo) {
      return {
        success: true,
        user: OFFLINE_DEMO_USERS.seller,
      };
    }
  }

  // 4. Update Profile
  if (endpoint === '/auth/profile') {
    try {
      const cached = JSON.parse(localStorage.getItem('bhumisathi_demo_user') || '{}');
      const updated = { ...cached, ...body };
      localStorage.setItem('bhumisathi_demo_user', JSON.stringify(updated));
      return {
        success: true,
        user: updated,
        message_bn: 'প্রোফাইল তথ্য ও ছবি সফলভাবে হালনাগাদ হয়েছে।',
      };
    } catch {
      return { success: true, message_bn: 'হালনাগাদ হয়েছে।' };
    }
  }

  // 5. Citizen Holdings
  if (endpoint === '/land/my/holdings') {
    let uid = 'usr-seller-01';
    try {
      const u = JSON.parse(localStorage.getItem('bhumisathi_demo_user') || '{}');
      if (u.id) uid = u.id;
    } catch {}
    const holdings = getOfflineMyHoldings(uid);
    return {
      success: true,
      count: holdings.length,
      data: holdings,
    };
  }

  // 6. Citizen Applications
  if (endpoint === '/sale/my') {
    let uid = 'usr-seller-01';
    try {
      const u = JSON.parse(localStorage.getItem('bhumisathi_demo_user') || '{}');
      if (u.id) uid = u.id;
    } catch {}
    const apps = getOfflineMyApplications(uid);
    return {
      success: true,
      count: apps.length,
      data: apps,
    };
  }

  // 7. Mutations
  if (endpoint === '/mutation' || endpoint === '/mutations') {
    const mutations = getOfflineMutations();
    return {
      success: true,
      count: mutations.length,
      data: mutations,
    };
  }

  // 8. Officer Queues
  if (endpoint === '/officer/union-queue') {
    return getOfflineUnionQueue();
  }
  if (endpoint === '/officer/acland-queue') {
    return getOfflineAcLandQueue();
  }
  if (endpoint === '/officer/registry-queue') {
    return getOfflineRegistryQueue();
  }
  if (endpoint === '/officer/admin-queue') {
    return getOfflineAdminQueue();
  }

  // 9. Audit Logs
  if (endpoint === '/audit') {
    return {
      success: true,
      count: (OFFLINE_DB.audit_logs || []).length,
      data: OFFLINE_DB.audit_logs || [],
    };
  }

  // 10. Notifications
  if (endpoint === '/notifications') {
    return {
      success: true,
      count: (OFFLINE_DB.notifications || []).length,
      data: OFFLINE_DB.notifications || [],
    };
  }

  // 11. Land Search & Details
  if (endpoint.startsWith('/land/search')) {
    return {
      success: true,
      count: (OFFLINE_DB.land_parcels || []).length,
      data: OFFLINE_DB.land_parcels || [],
    };
  }

  if (endpoint.startsWith('/land/pcl-')) {
    const id = endpoint.replace('/land/', '');
    const p = (OFFLINE_DB.land_parcels || []).find((x: any) => x.id === id);
    if (p) {
      return { success: true, data: p };
    }
  }

  // 12. Risk Assessment Evaluation
  if (endpoint === '/risk/evaluate') {
    return getOfflineRiskAssessment(body || {});
  }

  if (endpoint.startsWith('/risk/')) {
    const rskId = endpoint.replace('/risk/', '');
    const found = (OFFLINE_DB.risk_assessments || []).find((r: any) => r.id === rskId || r.parcel_id === rskId);
    if (found) return { success: true, data: found };
    return getOfflineRiskAssessment({ parcel_id: rskId });
  }

  // 13. Holding Tax Inquiries & Payments
  if (endpoint.startsWith('/tax/holding/')) {
    return {
      success: true,
      data: {
        fiscal_year: '১৪৩১ (২০২৪-২৫)',
        annual_tax_bdt: 1250,
        arrears_bdt: 0,
        total_due_bdt: 0,
        status: 'cleared',
        dakhila_no: 'DKH-2024-884920',
        last_payment_date: '15 Jan 2024',
      },
    };
  }

  if (endpoint === '/tax/pay') {
    return {
      success: true,
      dakhila_no: `DKH-${Date.now().toString().slice(-6)}`,
      receipt_url: '/dakhila-sample.pdf',
      message_bn: 'ভূমি উন্নয়ন কর সফলভাবে পরিশোধিত হয়েছে। দাখিলা রশিদ প্রস্তুত।',
    };
  }

  // 14. KYC Verification & Submissions
  if (endpoint === '/auth/kyc/verify' || endpoint === '/officer/verify-kyc') {
    try {
      const cached = JSON.parse(localStorage.getItem('bhumisathi_demo_user') || '{}');
      cached.kyc_status = 'verified';
      if (!cached.citizen_id) cached.citizen_id = 'BHM-CIT-882194';
      localStorage.setItem('bhumisathi_demo_user', JSON.stringify(cached));
      return {
        success: true,
        user: cached,
        citizen_id: cached.citizen_id,
        message_bn: 'কেওয়াইসি সফলভাবে অনুমোদিত ও সিটিজেন আইডি বরাদ্দ করা হয়েছে।',
      };
    } catch {
      return { success: true, citizen_id: 'BHM-CIT-882194', message_bn: 'কেওয়াইসি অনুমোদিত।' };
    }
  }

  // 15. Sale Application Workflow Fallbacks
  if (endpoint === '/sale/pre-check') {
    return {
      success: true,
      is_valid: true,
      message_bn: 'প্রস্তাবিত জমি বিক্রয়ের যোগ্য এবং কোনো আইনগত প্রতিবন্ধকতা নেই।',
    };
  }

  if (endpoint === '/sale/submit') {
    const newApp = {
      id: `app-sl-${Date.now().toString().slice(-6)}`,
      application_no: `APP-${Date.now().toString().slice(-6)}`,
      stage: 'UNION_LAND_OFFICE_VERIFICATION',
      status: 'pending',
      created_at: new Date().toISOString(),
      ...body,
    };
    return {
      success: true,
      data: newApp,
      message_bn: 'বায়না ও জমি বিক্রয় আবেদন সফলভাবে দাখিল হয়েছে।',
    };
  }

  if (endpoint.startsWith('/sale/') && endpoint.endsWith('/admin-review')) {
    return { success: true, message_bn: 'প্রাক-রেজিস্ট্রেশন অডিট সফলভাবে সম্পন্ন হয়েছে।' };
  }

  if (endpoint.startsWith('/sale/') && endpoint.endsWith('/union-review')) {
    return { success: true, message_bn: 'ইউনিয়ন ভূমি অফিস সরেজমিন তদন্ত রিপোর্ট দাখিল করা হয়েছে।' };
  }

  if (endpoint.startsWith('/sale/') && endpoint.endsWith('/acland-review')) {
    return { success: true, message_bn: 'সহকারী কমিশনার (ভূমি) কর্তৃক আবেদন অনুমোদিত হয়েছে।' };
  }

  if (endpoint.startsWith('/sale/') && endpoint.endsWith('/schedule-appointment')) {
    return { success: true, message_bn: 'সাব-রেজিস্ট্রি দলিলের অ্যাপয়েন্টমেন্ট সফলভাবে নির্ধারিত হয়েছে।' };
  }

  if (endpoint.startsWith('/sale/') && endpoint.endsWith('/complete-registration')) {
    return { success: true, message_bn: 'দলিল রেজিস্ট্রেশন সম্পন্ন হয়েছে এবং স্বয়ংক্রিয় ই-নামজারি চালু করা হয়েছে।' };
  }

  // 16. e-Mutation Hearing & Decision
  if (endpoint.includes('/mutation/') && endpoint.endsWith('/schedule-hearing')) {
    return { success: true, message_bn: 'শুনানির তারিখ ও সময় সফলভাবে নির্ধারিত হয়েছে।' };
  }

  if (endpoint.includes('/mutation/') && endpoint.endsWith('/decide')) {
    return { success: true, message_bn: 'নামজারি মামলার চূড়ান্ত আদেশ প্রদান করা হয়েছে।' };
  }

  // 17. Single Application Details
  if (endpoint.startsWith('/sale/') && !endpoint.includes('/admin-review') && !endpoint.includes('/union-review') && !endpoint.includes('/union-report') && !endpoint.includes('/acland-review') && !endpoint.includes('/schedule-appointment') && !endpoint.includes('/complete-registration') && !endpoint.includes('/pre-check')) {
    const appId = endpoint.replace('/sale/', '').trim();
    if (appId && appId !== 'my') {
      const app = (OFFLINE_DB.sale_applications || []).find((a: any) => a.id === appId || a.application_no === appId);
      return { success: true, data: app || OFFLINE_DB.sale_applications?.[0] };
    }
  }

  // 18. Single Parcel Details
  if (endpoint.startsWith('/land/') && !endpoint.startsWith('/land/search') && !endpoint.startsWith('/land/my')) {
    const pid = endpoint.replace('/land/', '').trim();
    const parcel = (OFFLINE_DB.land_parcels || []).find((p: any) => p.id === pid);
    return { success: true, data: parcel || OFFLINE_DB.land_parcels?.[0] };
  }

  // 19. Tax Payment History
  if (endpoint === '/tax/my/history') {
    return {
      success: true,
      data: (OFFLINE_DB.tax_payments || []).slice(0, 15),
    };
  }

  // 20. Officer Users & Management
  if (endpoint === '/officer/users') {
    return {
      success: true,
      count: (OFFLINE_DB.profiles || []).length,
      users: OFFLINE_DB.profiles || [],
    };
  }

  if (endpoint === '/auth/kyc/pending') {
    const pending = (OFFLINE_DB.profiles || []).filter((p: any) => p.kyc_status === 'pending');
    return {
      success: true,
      data: pending.length > 0 ? pending : (OFFLINE_DB.profiles || []).slice(0, 3),
    };
  }

  if (endpoint === '/officer/update-role') {
    return {
      success: true,
      message_bn: 'ব্যবহারকারীর ভূমিকা ও দপ্তর সফলভাবে হালনাগাদ করা হয়েছে।',
    };
  }

  // 21. AI Chatbot Message
  if (endpoint === '/chat/message') {
    return {
      success: true,
      reply_bn: 'ভূমিসেবায় আপনাকে স্বাগতম। আপনি জমির খতিয়ান যাচাই, ডিজিটাল নামজারি আবেদন এবং এনআইডি বায়োমেট্রিক তথ্য পরীক্ষা করতে পারবেন। আর কীভাবে সাহায্য করতে পারি?',
    };
  }

  // 22. Reset Demo
  if (endpoint === '/officer/reset-demo') {
    return {
      success: true,
      message_bn: 'ডেমো ডাটাবেজ সফলভাবে রিসেট হয়েছে!',
    };
  }

  return null;
}

export async function apiRequest<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<{ success: boolean; data?: T; message_bn?: string; error?: string; [key: string]: any }> {
  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers: {
        ...getAuthHeaders(),
        ...(options.headers || {}),
      },
    });

    // Check if the response is valid JSON (protects against SPA fallback serving index.html on Vercel)
    const contentType = res.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) {
      const fallback = resolveOfflineFallback(endpoint, options);
      if (fallback) {
        return fallback;
      }
      return {
        success: false,
        message_bn: 'সার্ভার সংযোগ উপলব্ধ নেই। অফলাইন ডেমো মোডে চলছে।',
      };
    }

    const data = await res.json();
    if (!res.ok) {
      const fallback = resolveOfflineFallback(endpoint, options);
      if (fallback) {
        return fallback;
      }
      return {
        success: false,
        message_bn: data.message_bn || 'অনুরোধ প্রক্রিয়াকরণে ব্যর্থ হয়েছে।',
        error: data.error,
      };
    }
    return data;
  } catch (err: any) {
    const fallback = resolveOfflineFallback(endpoint, options);
    if (fallback) {
      return fallback;
    }
    return {
      success: false,
      message_bn: 'সার্ভারের সাথে সংযোগ স্থাপন করা যায়নি।',
      error: err.message,
    };
  }
}

export const api = {
  // Auth
  login: (credentials: any) => apiRequest('/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),
  register: (userData: any) => apiRequest('/auth/register', { method: 'POST', body: JSON.stringify(userData) }),
  demoLogin: (persona: string, role?: string) => apiRequest('/auth/demo-login', { method: 'POST', body: JSON.stringify({ persona, role }) }),
  firebaseSync: (payload: { uid: string; email: string | null; displayName: string | null; photoURL?: string | null }) =>
    apiRequest('/auth/firebase-sync', { method: 'POST', body: JSON.stringify(payload) }),
  getProfile: () => apiRequest('/auth/me'),
  updateProfile: (profileData: any) => apiRequest('/auth/profile', { method: 'PUT', body: JSON.stringify(profileData) }),
  submitKyc: (kycData: any) => apiRequest('/auth/kyc/submit', { method: 'POST', body: JSON.stringify(kycData) }),
  verifyKyc: (userId?: string) => apiRequest('/auth/kyc/verify', { method: 'POST', body: JSON.stringify({ userId }) }),

  // Land Records & Search
  searchLand: (params: Record<string, string>) => {
    const query = new URLSearchParams(params).toString();
    return apiRequest(`/land/search?${query}`);
  },
  getParcelDetails: (id: string) => apiRequest(`/land/${id}`),
  getMyHoldings: () => apiRequest('/land/my/holdings'),

  // Risk Assessment (Check Before You Buy)
  evaluateRisk: (payload: { parcel_id: string; seller_identifier?: string; proposed_share?: number; proposed_area_decimal?: number }) =>
    apiRequest('/risk/evaluate', { method: 'POST', body: JSON.stringify(payload) }),
  getRiskAssessment: (id: string) => apiRequest(`/risk/${id}`),

  // Tax & Dakhila
  getHoldingTax: (parcelId: string) => apiRequest(`/tax/holding/${parcelId}`),
  payTaxDemo: (payload: { holding_id: string; parcel_id: string; amount_bdt?: number; payment_method?: string }) =>
    apiRequest('/tax/pay', { method: 'POST', body: JSON.stringify(payload) }),
  getTaxHistory: () => apiRequest('/tax/my/history'),

  // Sale Applications
  preCheckSale: (payload: { parcel_id: string; proposed_share: number; proposed_area_decimal: number }) =>
    apiRequest('/sale/pre-check', { method: 'POST', body: JSON.stringify(payload) }),
  submitSaleApp: (payload: any) => apiRequest('/sale/submit', { method: 'POST', body: JSON.stringify(payload) }),
  getMyApplications: () => apiRequest('/sale/my'),
  getApplicationById: (id: string) => apiRequest(`/sale/${id}`),
  adminReviewSale: (id: string, payload: { action: 'approve' | 'return' | 'reject'; notes_bn?: string; reason_bn?: string }) =>
    apiRequest(`/sale/${id}/admin-review`, { method: 'POST', body: JSON.stringify(payload) }),
  unionReportSale: (id: string, payload: any) => apiRequest(`/sale/${id}/union-report`, { method: 'POST', body: JSON.stringify(payload) }),
  completeRegistration: (id: string, payload: any) =>
    apiRequest(`/sale/${id}/complete-registration`, { method: 'POST', body: JSON.stringify(payload) }),

  // e-Mutation
  getMutations: () => apiRequest('/mutation'),
  scheduleHearing: (id: string, payload: { hearing_date: string; notes_bn?: string }) =>
    apiRequest(`/mutation/${id}/schedule-hearing`, { method: 'POST', body: JSON.stringify(payload) }),
  decideMutation: (id: string, payload: { decision: 'approve' | 'reject'; order_notes_bn?: string }) =>
    apiRequest(`/mutation/${id}/decide`, { method: 'POST', body: JSON.stringify(payload) }),

  // Officer Queues
  getUnionQueue: () => apiRequest('/officer/union-queue'),
  getAcLandQueue: () => apiRequest('/officer/acland-queue'),
  getRegistryQueue: () => apiRequest('/officer/registry-queue'),
  getAdminQueue: () => apiRequest('/officer/admin-queue'),

  // Notifications & Audit
  getNotifications: () => apiRequest('/notifications'),
  markNotificationRead: (id: string) => apiRequest(`/notifications/${id}/read`, { method: 'PUT' }),
  markAllNotificationsRead: () => apiRequest('/notifications/read-all', { method: 'PUT' }),
  getAuditLogs: () => apiRequest('/audit'),

  // Grouped namespaces
  auth: {
    login: (credentials: any) => apiRequest('/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),
    register: (userData: any) => apiRequest('/auth/register', { method: 'POST', body: JSON.stringify(userData) }),
    demoLogin: (persona: string, role?: string) => apiRequest('/auth/demo-login', { method: 'POST', body: JSON.stringify({ persona, role }) }),
    me: () => apiRequest('/auth/me'),
    submitKyc: (kycData: any) => apiRequest('/auth/kyc/submit', { method: 'POST', body: JSON.stringify(kycData) }),
    verifyKyc: (userId?: string) => apiRequest('/auth/kyc/verify', { method: 'POST', body: JSON.stringify({ userId }) }),
    approveKyc: (userId: string) => apiRequest('/auth/kyc/verify', { method: 'POST', body: JSON.stringify({ userId }) }),
  },

  land: {
    search: (params: Record<string, string>) => {
      const query = new URLSearchParams(params).toString();
      return apiRequest(`/land/search?${query}`);
    },
    getById: (id: string) => apiRequest(`/land/${id}`),
    myHoldings: () => apiRequest('/land/my/holdings'),
  },

  tax: {
    getHoldingTax: (parcelId: string) => apiRequest(`/tax/holding/${parcelId}`),
    pay: (payload: any) => apiRequest('/tax/pay', { method: 'POST', body: JSON.stringify(payload) }),
    history: () => apiRequest('/tax/my/history'),
  },

  risk: {
    evaluate: (payload: any) => apiRequest('/risk/evaluate', { method: 'POST', body: JSON.stringify(payload) }),
    getById: (id: string) => apiRequest(`/risk/${id}`),
  },

  sales: {
    preCheck: (payload: any) => apiRequest('/sale/pre-check', { method: 'POST', body: JSON.stringify(payload) }),
    submit: (payload: any) => apiRequest('/sale/submit', { method: 'POST', body: JSON.stringify(payload) }),
    list: () => apiRequest('/sale/my'),
    my: () => apiRequest('/sale/my'),
    getById: (id: string) => apiRequest(`/sale/${id}`),
    adminReview: (id: string, action: string, reason?: string) =>
      apiRequest(`/sale/${id}/admin-review`, {
        method: 'POST',
        body: JSON.stringify({ action: action.toLowerCase(), reason_bn: reason, notes_bn: reason }),
      }),
    submitUnionReport: (id: string, recommendation: string) =>
      apiRequest(`/sale/${id}/union-report`, {
        method: 'POST',
        body: JSON.stringify({ recommendation_bn: recommendation }),
      }),
    unionReview: (id: string, payload: { action: 'approve' | 'return' | 'reject'; field_findings_bn?: string; is_possession_verified?: boolean; boundary_ok?: boolean; reason_bn?: string; notes_bn?: string }) =>
      apiRequest(`/sale/${id}/union-review`, {
        method: 'POST',
        body: JSON.stringify(payload),
      }),
    acLandReview: (id: string, payload: { action: 'approve' | 'return' | 'reject'; reason_bn?: string; notes_bn?: string }) =>
      apiRequest(`/sale/${id}/acland-review`, {
        method: 'POST',
        body: JSON.stringify(payload),
      }),
    scheduleAppointment: (id: string, payload: { appointment_date: string; slot_time: string; registry_office_name_bn?: string; required_documents_bn?: string[]; notes_bn?: string }) =>
      apiRequest(`/sale/${id}/schedule-appointment`, {
        method: 'POST',
        body: JSON.stringify(payload),
      }),
    resubmit: (id: string, payload: { correction_notes_bn?: string }) =>
      apiRequest(`/sale/${id}/resubmit`, {
        method: 'POST',
        body: JSON.stringify(payload),
      }),
    completeRegistration: (id: string, regNo: string, notes?: string, payload?: any) =>
      apiRequest(`/sale/${id}/complete-registration`, {
        method: 'POST',
        body: JSON.stringify({ registration_serial_no: regNo, notes_bn: notes, ...(payload || {}) }),
      }),
  },

  mutations: {
    list: () => apiRequest('/mutation'),
    scheduleHearing: (id: string, date: string, time?: string) =>
      apiRequest(`/mutation/${id}/schedule-hearing`, {
        method: 'POST',
        body: JSON.stringify({ hearing_date: `${date} ${time || ''}`.trim() }),
      }),
    approve: (id: string, notes?: string) =>
      apiRequest(`/mutation/${id}/decide`, {
        method: 'POST',
        body: JSON.stringify({ decision: 'approve', order_notes_bn: notes }),
      }),
    reject: (id: string, reason?: string) =>
      apiRequest(`/mutation/${id}/decide`, {
        method: 'POST',
        body: JSON.stringify({ decision: 'reject', order_notes_bn: reason }),
      }),
  },

  officer: {
    unionQueue: () => apiRequest('/officer/union-queue'),
    acLandQueue: () => apiRequest('/officer/acland-queue'),
    registryQueue: () => apiRequest('/officer/registry-queue'),
    adminStats: () => apiRequest('/officer/admin-queue'),
    kycQueue: () => apiRequest('/auth/kyc/pending'),
    users: () => apiRequest('/officer/users'),
    approveKyc: (userId: string) => apiRequest('/officer/verify-kyc', { method: 'POST', body: JSON.stringify({ userId }) }),
    updateRole: (payload: { userId: string; role: string; designation_bn?: string; office_name_bn?: string }) =>
      apiRequest('/officer/update-role', { method: 'POST', body: JSON.stringify(payload) }),
    resetDemo: () => apiRequest('/officer/reset-demo', { method: 'POST' }),
  },

  notifications: {
    list: () => apiRequest('/notifications'),
    markRead: (id: string) => apiRequest(`/notifications/${id}/read`, { method: 'PUT' }),
    markAllRead: () => apiRequest('/notifications/read-all', { method: 'PUT' }),
  },

  audit: {
    list: () => apiRequest('/audit'),
  },
};
