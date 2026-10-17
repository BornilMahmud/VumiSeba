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

  // 12. Reset Demo
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
