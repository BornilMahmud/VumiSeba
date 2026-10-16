import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  writeBatch,
  DocumentData,
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../lib/firebase';
import {
  UserProfile,
  LandParcel,
  KhatianRecord,
  KhajnaAccount,
  SaleApplication,
  MutationApplication,
  NotificationItem,
  RiskAssessment,
} from '../types';
import { api } from './api';

/**
 * Bhumisathi - Cloud Firestore Data Service
 * Connects directly to Cloud Firestore in project landtech-e5773,
 * with seamless fallback to backend API if Firebase credentials are pending.
 */

export const firestoreService = {
  // =========================================================================
  // 1. User Profiles & Role Verification
  // =========================================================================
  async getProfile(uid: string): Promise<UserProfile | null> {
    if (!isFirebaseConfigured() || !db) {
      const res = await api.getProfile();
      return res.success ? res.user : null;
    }

    try {
      const profileRef = doc(db, 'profiles', uid);
      const snap = await getDoc(profileRef);
      if (snap.exists()) {
        const data = snap.data();
        return {
          id: snap.id,
          citizen_id: data.citizen_id || data.citizenId,
          email: data.email,
          name_bn: data.name_bn || data.displayName || 'নাগরিক',
          name_en: data.name_en || data.displayName || 'Citizen',
          mobile: data.mobile || '',
          nid_no: data.nid_no || '',
          date_of_birth: data.date_of_birth,
          father_name_bn: data.father_name_bn || '',
          mother_name_bn: data.mother_name_bn || '',
          address_bn: data.address_bn || '',
          district: data.district || 'ঢাকা',
          upazila: data.upazila || 'গুলশান',
          role: data.role || 'citizen',
          designation_bn: data.designation_bn,
          office_name_bn: data.office_name_bn,
          kyc_status: data.kyc_status || data.kycStatus || 'unverified',
          kyc_verified_at: data.kyc_verified_at,
          created_at: data.created_at || (data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : new Date().toISOString()),
        } as UserProfile;
      }
      return null;
    } catch (err) {
      console.warn('[Firestore] Error getting profile, falling back to API:', err);
      const res = await api.getProfile();
      return res.success ? res.user : null;
    }
  },

  async createProfileIfMissing(user: {
    uid: string;
    email: string | null;
    displayName: string | null;
    photoURL?: string | null;
  }): Promise<UserProfile> {
    if (!isFirebaseConfigured() || !db) {
      // Sync with backend API
      const res = await api.getProfile();
      if (res.success && res.user) return res.user;
      throw new Error('API unavailable');
    }

    const profileRef = doc(db, 'profiles', user.uid);
    const snap = await getDoc(profileRef);

    if (snap.exists()) {
      return (await this.getProfile(user.uid))!;
    }

    // Default new profile: always citizen, unverified KYC
    const newProfileData = {
      uid: user.uid,
      email: user.email || '',
      name_bn: user.displayName || 'নাগরিক',
      name_en: user.displayName || 'Citizen',
      photoURL: user.photoURL || '',
      role: 'citizen',
      kyc_status: 'unverified',
      citizen_id: '',
      mobile: '',
      nid_no: '',
      father_name_bn: '',
      mother_name_bn: '',
      address_bn: '',
      district: 'ঢাকা',
      upazila: 'গুলশান',
      isDemo: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      server_created_at: serverTimestamp(),
    };

    await setDoc(profileRef, newProfileData);
    return (await this.getProfile(user.uid))!;
  },

  async updateProfile(uid: string, updates: Partial<UserProfile>): Promise<void> {
    if (!isFirebaseConfigured() || !db) {
      return;
    }

    // Strictly strip privileged fields from client update
    const safeUpdates: Record<string, any> = { ...updates };
    delete safeUpdates.role;
    delete safeUpdates.citizen_id;
    delete safeUpdates.citizenId;
    delete safeUpdates.kyc_status;
    delete safeUpdates.kycStatus;
    delete safeUpdates.isDemo;
    safeUpdates.updated_at = new Date().toISOString();

    const profileRef = doc(db, 'profiles', uid);
    await updateDoc(profileRef, safeUpdates);
  },

  // =========================================================================
  // 2. Land Search & Parcels
  // =========================================================================
  async searchLand(params: Record<string, string>): Promise<{ success: boolean; data: LandParcel[]; count: number }> {
    if (!isFirebaseConfigured() || !db) {
      const res = await api.land.search(params);
      return { success: res.success, data: res.data || [], count: res.count || 0 };
    }

    try {
      const parcelsRef = collection(db, 'land_parcels');
      const constraints: any[] = [];

      if (params.district) constraints.push(where('district', '==', params.district));
      if (params.upazila) constraints.push(where('upazila', '==', params.upazila));
      if (params.mouza) constraints.push(where('mouza', '==', params.mouza));

      const q = constraints.length ? query(parcelsRef, ...constraints) : parcelsRef;
      const snap = await getDocs(q);

      let list = snap.docs.map((d) => ({ id: d.id, ...d.data() } as LandParcel));

      // Filter by dag_no or khatian_no in memory to support English/Bengali numeral variations
      if (params.dag_no) {
        const queryDag = params.dag_no.trim();
        list = list.filter((p) => p.dag_no === queryDag || p.dag_no.includes(queryDag));
      }
      if (params.khatian_no) {
        const queryKhatian = params.khatian_no.trim();
        list = list.filter((p) => p.khatian_no === queryKhatian || p.khatian_no.includes(queryKhatian));
      }

      return { success: true, data: list, count: list.length };
    } catch (err) {
      console.warn('[Firestore] Falling back to backend searchLand:', err);
      const res = await api.land.search(params);
      return { success: res.success, data: res.data || [], count: res.count || 0 };
    }
  },

  async getParcelById(id: string): Promise<LandParcel | null> {
    if (!isFirebaseConfigured() || !db) {
      const res = await api.land.getById(id);
      return res.success ? res.data : null;
    }

    try {
      const snap = await getDoc(doc(db, 'land_parcels', id));
      if (snap.exists()) {
        return { id: snap.id, ...snap.data() } as LandParcel;
      }
      return null;
    } catch (err) {
      const res = await api.land.getById(id);
      return res.success ? res.data : null;
    }
  },

  // =========================================================================
  // 3. Tax & Clearance Verification
  // =========================================================================
  async getHoldingTax(parcelId: string): Promise<{ success: boolean; account?: KhajnaAccount; clearance?: any }> {
    if (!isFirebaseConfigured() || !db) {
      return await api.tax.getHoldingTax(parcelId);
    }

    try {
      const q = query(collection(db, 'khajna_accounts'), where('parcel_id', '==', parcelId));
      const snap = await getDocs(q);
      if (!snap.empty) {
        const account = { id: snap.docs[0].id, ...snap.docs[0].data() } as KhajnaAccount;
        return { success: true, account };
      }
      // Fallback to API if parcel not populated in firestore
      return await api.tax.getHoldingTax(parcelId);
    } catch (err) {
      return await api.tax.getHoldingTax(parcelId);
    }
  },

  // =========================================================================
  // 4. Sale Applications
  // =========================================================================
  async getSaleApplications(userId?: string, role?: string): Promise<SaleApplication[]> {
    if (!isFirebaseConfigured() || !db) {
      const res = await api.sales.list();
      return res.success ? res.data || [] : [];
    }

    try {
      const appsRef = collection(db, 'sale_applications');
      let snap;

      if (role && ['union_officer', 'ac_land', 'sub_registrar', 'central_admin'].includes(role)) {
        // Officers see all applications in the pipeline
        const q = query(appsRef, orderBy('created_at', 'desc'));
        snap = await getDocs(q);
      } else if (userId) {
        // Citizens see applications where they are seller or buyer
        const qSeller = query(appsRef, where('seller_id', '==', userId));
        snap = await getDocs(qSeller);
      } else {
        snap = await getDocs(appsRef);
      }

      return snap.docs.map((d) => ({ id: d.id, ...d.data() } as SaleApplication));
    } catch (err) {
      console.warn('[Firestore] Falling back to backend sale applications:', err);
      const res = await api.sales.list();
      return res.success ? res.data || [] : [];
    }
  },

  async submitSaleApplication(payload: any): Promise<{ success: boolean; application?: SaleApplication; message_bn?: string }> {
    // We always submit through the server pre-check & validation endpoint
    // to strictly enforce the Tax Clearance Guard and Over-Selling Share Guard!
    return await api.sales.submit(payload);
  },

  // =========================================================================
  // 5. e-Mutations
  // =========================================================================
  async getMutations(): Promise<MutationApplication[]> {
    if (!isFirebaseConfigured() || !db) {
      const res = await api.mutations.list();
      return res.success ? res.data || [] : [];
    }

    try {
      const q = query(collection(db, 'mutation_applications'), orderBy('created_at', 'desc'));
      const snap = await getDocs(q);
      return snap.docs.map((d) => ({ id: d.id, ...d.data() } as MutationApplication));
    } catch (err) {
      const res = await api.mutations.list();
      return res.success ? res.data || [] : [];
    }
  },

  // =========================================================================
  // 6. Notifications
  // =========================================================================
  async getNotifications(userId?: string): Promise<NotificationItem[]> {
    if (!isFirebaseConfigured() || !db) {
      const res = await api.notifications.list();
      return res.success ? res.data || [] : [];
    }

    try {
      if (!userId) return [];
      const q = query(
        collection(db, 'notifications'),
        where('user_id', '==', userId),
        orderBy('created_at', 'desc')
      );
      const snap = await getDocs(q);
      return snap.docs.map((d) => ({ id: d.id, ...d.data() } as NotificationItem));
    } catch (err) {
      const res = await api.notifications.list();
      return res.success ? res.data || [] : [];
    }
  },
};
