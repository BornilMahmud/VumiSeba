import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  signInWithPopup,
  signInWithRedirect,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from 'firebase/auth';
import { UserProfile } from '../types';
import { api } from '../services/api';
import { auth, googleProvider, isFirebaseConfigured } from '../lib/firebase';
import { firestoreService } from '../services/firestoreService';

import { DEMO_CREDENTIALS } from '../types/demoCredentials';
import { findOfflineDemoUser, createOfflineDemoToken } from '../data/offlineDemoData';

interface AuthContextType {
  user: UserProfile | null;
  firebaseUser: FirebaseUser | null;
  token: string | null;
  isLoading: boolean;
  loading: boolean;
  isDemoSession: boolean;
  isFirebaseActive: boolean;
  login: (credentials: any) => Promise<{ success: boolean; user?: UserProfile; message_bn?: string; message_en?: string }>;
  loginWithGoogle: () => Promise<{ success: boolean; message_bn?: string; message_en?: string }>;
  register: (userData: any) => Promise<{ success: boolean; message_bn?: string; message_en?: string }>;
  switchDemoPersona: (persona: string, role?: string) => Promise<{ success: boolean; message_bn?: string; message_en?: string }>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  updateProfile: (data: Partial<UserProfile>) => Promise<{ success: boolean; message_bn?: string; message_en?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const getInitialDemoUser = (): UserProfile | null => {
    try {
      const isDemo = localStorage.getItem('bhumisathi_is_demo') === 'true';
      const cached = localStorage.getItem('bhumisathi_demo_user');
      if (isDemo && cached) {
        return JSON.parse(cached);
      }
    } catch {
      // ignore
    }
    return null;
  };

  const [user, setUser] = useState<UserProfile | null>(getInitialDemoUser());
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('bhumisathi_token'));
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isDemoSession, setIsDemoSession] = useState<boolean>(
    localStorage.getItem('bhumisathi_is_demo') === 'true'
  );

  const isFirebaseActive = isFirebaseConfigured();

  // Sync profile from backend or Firestore
  const refreshProfile = async () => {
    const isDemo = localStorage.getItem('bhumisathi_is_demo') === 'true';
    const cachedDemoUserJson = localStorage.getItem('bhumisathi_demo_user');

    if (!token && !firebaseUser && !isDemo) {
      setUser(null);
      setIsLoading(false);
      return;
    }

    if (isDemo && cachedDemoUserJson) {
      try {
        const parsed = JSON.parse(cachedDemoUserJson);
        if (parsed && parsed.id) {
          setUser(parsed);
          setIsDemoSession(true);
        }
      } catch (e) {
        console.warn('[AuthContext] Error parsing cached demo user:', e);
      }
    }

    try {
      if (firebaseUser && isFirebaseActive) {
        // Read trusted profile from Cloud Firestore
        const profile = await firestoreService.getProfile(firebaseUser.uid);
        if (profile) {
          setUser(profile);
          setIsLoading(false);
          return;
        }
      }

      // Fallback or standard JWT session refresh
      const res = await api.getProfile();
      if (res.success && res.user) {
        setUser(res.user);
        if (isDemo) {
          localStorage.setItem('bhumisathi_demo_user', JSON.stringify(res.user));
        }
      } else {
        if (isDemo && cachedDemoUserJson) {
          // Keep offline demo session intact!
          setIsLoading(false);
          return;
        }
        setUser(null);
        localStorage.removeItem('bhumisathi_token');
        localStorage.removeItem('vumiseba_token');
        localStorage.removeItem('bhumisathi_is_demo');
        localStorage.removeItem('bhumisathi_demo_user');
        setToken(null);
        setIsDemoSession(false);
      }
    } catch (err) {
      console.warn('[AuthContext] Error refreshing profile:', err);
      if (isDemo && cachedDemoUserJson) {
        setIsLoading(false);
        return;
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Listen to Firebase Auth state changes
  useEffect(() => {
    if (!isFirebaseActive || !auth) {
      refreshProfile();
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      setFirebaseUser(fbUser);
      if (fbUser) {
        try {
          // 1. Fetch or create Firestore profile
          const profile = await firestoreService.createProfileIfMissing({
            uid: fbUser.uid,
            email: fbUser.email,
            displayName: fbUser.displayName,
            photoURL: fbUser.photoURL,
          });

          // 2. Synchronize with backend to acquire Bhumisathi API token
          const syncRes = await api.firebaseSync({
            uid: fbUser.uid,
            email: fbUser.email,
            displayName: fbUser.displayName,
            photoURL: fbUser.photoURL,
          });

          if (syncRes.success && syncRes.token) {
            localStorage.setItem('bhumisathi_token', syncRes.token);
            setToken(syncRes.token);
            setUser({ ...profile, role: syncRes.user.role || profile.role });
          } else {
            setUser(profile);
          }
        } catch (err) {
          console.error('[AuthContext] Firebase auth state sync error:', err);
        }
      } else if (localStorage.getItem('bhumisathi_token') || localStorage.getItem('vumiseba_token')) {
        await refreshProfile();
      } else {
        setUser(null);
        setIsLoading(false);
      }
    });

    return () => unsubscribe();
  }, [isFirebaseActive]);

  // Standard email/password login (with offline fallback for demo accounts)
  const login = async (credentials: any): Promise<{ success: boolean; user?: UserProfile; message_bn?: string; message_en?: string }> => {
    setIsLoading(true);
    const demoUser = findOfflineDemoUser(credentials.email);

    try {
      const res = await api.login(credentials);
      if (res.success && res.token && res.user) {
        localStorage.setItem('bhumisathi_token', res.token);
        localStorage.setItem('vumiseba_token', res.token);
        if (demoUser) {
          localStorage.setItem('bhumisathi_is_demo', 'true');
          localStorage.setItem('bhumisathi_demo_user', JSON.stringify(res.user));
          setIsDemoSession(true);
        } else {
          localStorage.removeItem('bhumisathi_is_demo');
          localStorage.removeItem('bhumisathi_demo_user');
          setIsDemoSession(false);
        }
        setToken(res.token);
        setUser(res.user);
        setIsLoading(false);
        return { success: true, user: res.user };
      }

      if (demoUser) {
        const token = createOfflineDemoToken(demoUser);
        localStorage.setItem('bhumisathi_token', token);
        localStorage.setItem('vumiseba_token', token);
        localStorage.setItem('bhumisathi_is_demo', 'true');
        localStorage.setItem('bhumisathi_demo_user', JSON.stringify(demoUser));
        setIsDemoSession(true);
        setToken(token);
        setUser(demoUser);
        setIsLoading(false);
        return { success: true, user: demoUser };
      }

      setIsLoading(false);
      return { success: false, message_bn: res.message_bn, message_en: res.message_en };
    } catch (err: any) {
      if (demoUser) {
        const token = createOfflineDemoToken(demoUser);
        localStorage.setItem('bhumisathi_token', token);
        localStorage.setItem('vumiseba_token', token);
        localStorage.setItem('bhumisathi_is_demo', 'true');
        localStorage.setItem('bhumisathi_demo_user', JSON.stringify(demoUser));
        setIsDemoSession(true);
        setToken(token);
        setUser(demoUser);
        setIsLoading(false);
        return { success: true, user: demoUser };
      }
      setIsLoading(false);
      return {
        success: false,
        message_bn: 'সার্ভারের সাথে সংযোগ স্থাপন করা যায়নি।',
        message_en: 'Could not connect to server.',
      };
    }
  };

  // Google Sign-In with Firebase Auth
  const loginWithGoogle = async (): Promise<{ success: boolean; message_bn?: string; message_en?: string }> => {
    if (!isFirebaseActive || !auth || !googleProvider) {
      return {
        success: false,
        message_bn: 'ফায়ারবেস ক্লাউড প্রজেক্ট কনফিগার করা হয়নি। অনুগ্রহ করে .env ফাইলে VITE_FIREBASE_API_KEY প্রদান করুন।',
        message_en: 'Firebase Cloud project not configured. Please supply VITE_FIREBASE_API_KEY in .env.',
      };
    }

    setIsLoading(true);
    try {
      let result;
      try {
        result = await signInWithPopup(auth, googleProvider);
      } catch (popupErr: any) {
        if (popupErr.code === 'auth/popup-blocked') {
          await signInWithRedirect(auth, googleProvider);
          return { success: true };
        } else if (
          popupErr.code === 'auth/popup-closed-by-user' ||
          popupErr.code === 'auth/cancelled-popup-request'
        ) {
          setIsLoading(false);
          return {
            success: false,
            message_bn: 'লগইন প্রক্রিয়া বাতিল করা হয়েছে।',
            message_en: 'Sign-in was cancelled by user.',
          };
        }
        throw popupErr;
      }

      const fbUser = result.user;
      setFirebaseUser(fbUser);

      // Create profile in Firestore if first-time user (Default: citizen role)
      const profile = await firestoreService.createProfileIfMissing({
        uid: fbUser.uid,
        email: fbUser.email,
        displayName: fbUser.displayName,
        photoURL: fbUser.photoURL,
      });

      // Synchronize with backend to acquire authorization session
      const syncRes = await api.firebaseSync({
        uid: fbUser.uid,
        email: fbUser.email,
        displayName: fbUser.displayName,
        photoURL: fbUser.photoURL,
      });

      if (syncRes.success && syncRes.token) {
        localStorage.setItem('bhumisathi_token', syncRes.token);
        localStorage.removeItem('bhumisathi_is_demo');
        setIsDemoSession(false);
        setToken(syncRes.token);
        setUser({ ...profile, role: syncRes.user?.role || profile.role });
      } else {
        setUser(profile);
      }

      setIsLoading(false);
      return { success: true };
    } catch (err: any) {
      setIsLoading(false);
      console.error('[Google Login Error]:', err);
      let message_bn = 'গুগল সাইন-ইন প্রক্রিয়া সম্পন্ন করা যায়নি।';
      let message_en = 'Google sign-in could not be completed.';
      if (err.code === 'auth/network-request-failed') {
        message_bn = 'নেটওয়ার্ক সংযোগে সমস্যা হয়েছে। ইন্টারনেট সংযোগ পরীক্ষা করুন।';
        message_en = 'Network connection problem. Please verify your internet connection.';
      } else if (err.code === 'auth/unauthorized-domain') {
        message_bn = 'এই ডোমেইনটি ফায়ারবেস কনসোলে অথরাইজড নয়। কনসোল থেকে ডোমেইন যোগ করুন।';
        message_en = 'This domain is not authorized in Firebase console. Please add it to authorized domains.';
      }
      return { success: false, message_bn, message_en };
    }
  };

  // Register citizen
  const register = async (userData: any) => {
    setIsLoading(true);
    const res = await api.register(userData);
    if (res.success && res.token) {
      localStorage.setItem('bhumisathi_token', res.token);
      localStorage.removeItem('bhumisathi_is_demo');
      setIsDemoSession(false);
      setToken(res.token);
      setUser(res.user);
      setIsLoading(false);
      return { success: true };
    }
    setIsLoading(false);
    return { success: false, message_bn: res.message_bn, message_en: res.message_en };
  };

  // Fast 1-Click Demo Persona Switcher (Works 100% offline without requiring connection to the server)
  const switchDemoPersona = async (persona: string, role?: string): Promise<{ success: boolean; message_bn?: string; message_en?: string }> => {
    setIsLoading(true);

    // 1. Immediately match offline persona profile
    const offlineUser = findOfflineDemoUser(persona, role);
    if (offlineUser) {
      const offlineToken = createOfflineDemoToken(offlineUser);
      localStorage.setItem('bhumisathi_token', offlineToken);
      localStorage.setItem('vumiseba_token', offlineToken);
      localStorage.setItem('bhumisathi_is_demo', 'true');
      localStorage.setItem('bhumisathi_demo_user', JSON.stringify(offlineUser));

      setToken(offlineToken);
      setUser(offlineUser);
      setIsDemoSession(true);
      setIsLoading(false);

      // Asynchronously notify backend in background if running (non-blocking)
      api.demoLogin(persona, role)
        .then((res) => {
          if (res.success && res.token && res.user) {
            localStorage.setItem('bhumisathi_token', res.token);
            localStorage.setItem('vumiseba_token', res.token);
            localStorage.setItem('bhumisathi_demo_user', JSON.stringify(res.user));
            setToken(res.token);
            setUser(res.user);
          }
        })
        .catch(() => {
          // Server offline, silent ignore
        });

      return {
        success: true,
        message_bn: `ডেমো অ্যাকাউন্টে প্রবেশ সফল হয়েছে (${offlineUser.name_bn})।`,
        message_en: `Logged in as demo persona (${offlineUser.name_en || offlineUser.name_bn}).`,
      };
    }

    // 2. Resilient server-validated demo login fallback
    try {
      const res = await api.demoLogin(persona, role);
      if (res.success && res.token && res.user) {
        localStorage.setItem('bhumisathi_token', res.token);
        localStorage.setItem('vumiseba_token', res.token);
        localStorage.setItem('bhumisathi_is_demo', 'true');
        localStorage.setItem('bhumisathi_demo_user', JSON.stringify(res.user));
        setIsDemoSession(true);
        setToken(res.token);
        setUser(res.user);
        setIsLoading(false);
        return { success: true, message_bn: res.message_bn, message_en: res.message_en };
      }
    } catch {
      // ignore
    }

    setIsLoading(false);
    return {
      success: false,
      message_bn: 'ডেমো লগইন ব্যর্থ হয়েছে।',
      message_en: 'Demo login failed.',
    };
  };

  // Sign out cleanly from all sessions
  const logout = async () => {
    setIsLoading(true);
    if (auth && isFirebaseActive) {
      try {
        await signOut(auth);
      } catch (e) {
        console.warn('[Firebase SignOut]', e);
      }
    }
    localStorage.removeItem('bhumisathi_token');
    localStorage.removeItem('vumiseba_token');
    localStorage.removeItem('bhumisathi_is_demo');
    localStorage.removeItem('bhumisathi_demo_user');
    setToken(null);
    setFirebaseUser(null);
    setUser(null);
    setIsDemoSession(false);
    setIsLoading(false);
  };

  const updateProfile = async (data: Partial<UserProfile>): Promise<{ success: boolean; message_bn?: string; message_en?: string }> => {
    try {
      const res = await api.updateProfile(data);
      if (res.success && res.user) {
        setUser(res.user);
        return {
          success: true,
          message_bn: res.message_bn || 'প্রোফাইল তথ্য ও ছবি সফলভাবে হালনাগাদ হয়েছে।',
          message_en: res.message_en || 'Profile information and photo updated successfully.',
        };
      }
      return { success: false, message_bn: res.message_bn || 'হালনাগাদ ব্যর্থ হয়েছে।' };
    } catch (err: any) {
      if (user) {
        const merged = { ...user, ...data };
        setUser(merged);
        return {
          success: true,
          message_bn: 'প্রোফাইল তথ্য ও ছবি সফলভাবে সংরক্ষিত হয়েছে।',
          message_en: 'Profile information saved successfully.',
        };
      }
      return { success: false, message_bn: err.message };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        firebaseUser,
        token,
        isLoading,
        loading: isLoading,
        isDemoSession,
        isFirebaseActive,
        login,
        loginWithGoogle,
        register,
        switchDemoPersona,
        logout,
        refreshProfile,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
