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
export { DEMO_CREDENTIALS };

interface AuthContextType {
  user: UserProfile | null;
  firebaseUser: FirebaseUser | null;
  token: string | null;
  isLoading: boolean;
  loading: boolean;
  isDemoSession: boolean;
  isFirebaseActive: boolean;
  login: (credentials: any) => Promise<{ success: boolean; message_bn?: string }>;
  loginWithGoogle: () => Promise<{ success: boolean; message_bn?: string }>;
  register: (userData: any) => Promise<{ success: boolean; message_bn?: string }>;
  switchDemoPersona: (persona: string, role?: string) => Promise<{ success: boolean; message_bn?: string }>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('bhumisathi_token'));
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isDemoSession, setIsDemoSession] = useState<boolean>(
    localStorage.getItem('bhumisathi_is_demo') === 'true'
  );

  const isFirebaseActive = isFirebaseConfigured();

  // Sync profile from backend or Firestore
  const refreshProfile = async () => {
    if (!token && !firebaseUser) {
      setUser(null);
      setIsLoading(false);
      return;
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
      } else {
        setUser(null);
        localStorage.removeItem('bhumisathi_token');
        localStorage.removeItem('bhumisathi_is_demo');
        setToken(null);
        setIsDemoSession(false);
      }
    } catch (err) {
      console.warn('[AuthContext] Error refreshing profile:', err);
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
      } else if (!localStorage.getItem('bhumisathi_token')) {
        setUser(null);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [isFirebaseActive]);

  // Standard email/password login
  const login = async (credentials: any) => {
    setIsLoading(true);
    const res = await api.login(credentials);
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
    return { success: false, message_bn: res.message_bn };
  };

  // Google Sign-In with Firebase Auth
  const loginWithGoogle = async (): Promise<{ success: boolean; message_bn?: string }> => {
    if (!isFirebaseActive || !auth || !googleProvider) {
      return {
        success: false,
        message_bn: 'ফায়ারবেস ক্লাউড প্রজেক্ট কনফিগার করা হয়নি। অনুগ্রহ করে .env ফাইলে VITE_FIREBASE_API_KEY প্রদান করুন।',
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
          return { success: false, message_bn: 'লগইন প্রক্রিয়া বাতিল করা হয়েছে।' };
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
      if (err.code === 'auth/network-request-failed') {
        message_bn = 'নেটওয়ার্ক সংযোগে সমস্যা হয়েছে। ইন্টারনেট সংযোগ পরীক্ষা করুন।';
      } else if (err.code === 'auth/unauthorized-domain') {
        message_bn = 'এই ডোমেইনটি ফায়ারবেস কনসোলে অথরাইজড নয়। কনসোল থেকে ডোমেইন যোগ করুন।';
      }
      return { success: false, message_bn };
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
    return { success: false, message_bn: res.message_bn };
  };

  // Fast 1-Click Demo Persona Switcher (Genuine Firebase Auth or resilient fallback)
  const switchDemoPersona = async (persona: string, role?: string): Promise<{ success: boolean; message_bn?: string }> => {
    setIsLoading(true);
    const demoKey = (persona in DEMO_CREDENTIALS ? persona : role || 'seller') as keyof typeof DEMO_CREDENTIALS;
    const demoCreds = DEMO_CREDENTIALS[demoKey];

    // 1. Attempt genuine Firebase Authentication if configured
    if (isFirebaseActive && auth && demoCreds) {
      try {
        const userCred = await signInWithEmailAndPassword(auth, demoCreds.email, demoCreds.pass);
        setFirebaseUser(userCred.user);
        const profile = await firestoreService.getProfile(userCred.user.uid);

        // Sync with backend session
        const syncRes = await api.firebaseSync({
          uid: userCred.user.uid,
          email: userCred.user.email,
          displayName: profile?.name_bn || demoCreds.label,
        });

        if (syncRes.success && syncRes.token) {
          localStorage.setItem('bhumisathi_token', syncRes.token);
          localStorage.setItem('bhumisathi_is_demo', 'true');
          setIsDemoSession(true);
          setToken(syncRes.token);
          setUser(syncRes.user);
        } else if (profile) {
          setUser(profile);
          localStorage.setItem('bhumisathi_is_demo', 'true');
          setIsDemoSession(true);
        }

        setIsLoading(false);
        return { success: true, message_bn: `ডেমো অ্যাকাউন্টে প্রবেশ সফল হয়েছে (${demoCreds.label})।` };
      } catch (fbErr: any) {
        console.warn('[Firebase Demo Auth Note] Cloud demo user not provisioned yet; falling back to local demo runner:', fbErr.message);
      }
    }

    // 2. Resilient server-validated demo login
    const res = await api.demoLogin(persona, role);
    if (res.success && res.token) {
      localStorage.setItem('bhumisathi_token', res.token);
      localStorage.setItem('bhumisathi_is_demo', 'true');
      setIsDemoSession(true);
      setToken(res.token);
      setUser(res.user);
      setIsLoading(false);
      return { success: true, message_bn: res.message_bn };
    }

    setIsLoading(false);
    return { success: false, message_bn: res.message_bn || 'ডেমো লগইন ব্যর্থ হয়েছে।' };
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
    localStorage.removeItem('bhumisathi_is_demo');
    setToken(null);
    setFirebaseUser(null);
    setUser(null);
    setIsDemoSession(false);
    setIsLoading(false);
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
