import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getAnalytics, isSupported, Analytics } from 'firebase/analytics';

/**
 * Bhumisathi - Centralized Firebase Initialization Module
 * Project: landtech-e5773
 */

const getEnvVar = (key: string): string => {
  try {
    if (typeof import.meta !== 'undefined' && (import.meta as any).env?.[key]) {
      return (import.meta as any).env[key];
    }
  } catch (_) {}
  try {
    if (typeof process !== 'undefined' && process.env?.[key]) {
      return process.env[key] || '';
    }
  } catch (_) {}
  return '';
};

const firebaseConfig = {
  apiKey: getEnvVar('VITE_FIREBASE_API_KEY'),
  authDomain: getEnvVar('VITE_FIREBASE_AUTH_DOMAIN') || 'landtech-e5773.firebaseapp.com',
  projectId: getEnvVar('VITE_FIREBASE_PROJECT_ID') || 'landtech-e5773',
  storageBucket: getEnvVar('VITE_FIREBASE_STORAGE_BUCKET') || 'landtech-e5773.firebasestorage.app',
  messagingSenderId: getEnvVar('VITE_FIREBASE_MESSAGING_SENDER_ID'),
  appId: getEnvVar('VITE_FIREBASE_APP_ID'),
  measurementId: getEnvVar('VITE_FIREBASE_MEASUREMENT_ID'),
};

/**
 * Returns true if the client has supplied a non-empty Firebase Web API key
 */
export const isFirebaseConfigured = (): boolean => {
  return Boolean(
    firebaseConfig.apiKey &&
    firebaseConfig.apiKey.trim().length > 10 &&
    !firebaseConfig.apiKey.includes('your_firebase_api_key_here') &&
    !firebaseConfig.apiKey.includes('placeholder') &&
    firebaseConfig.projectId === 'landtech-e5773'
  );
};

// Singleton instances
let app: FirebaseApp | undefined;
let auth: Auth | undefined;
let db: Firestore | undefined;
let googleProvider: GoogleAuthProvider | undefined;
let analytics: Analytics | null = null;
let initError: string | null = null;

try {
  if (
    firebaseConfig.apiKey &&
    firebaseConfig.apiKey.trim().length > 10 &&
    !firebaseConfig.apiKey.includes('your_firebase_api_key_here')
  ) {
    if (!getApps().length) {
      app = initializeApp(firebaseConfig);
    } else {
      app = getApp();
    }

    auth = getAuth(app);
    db = getFirestore(app);

    googleProvider = new GoogleAuthProvider();
    googleProvider.setCustomParameters({
      prompt: 'select_account',
    });

    // Initialize analytics safely if in browser and supported
    if (typeof window !== 'undefined' && firebaseConfig.measurementId) {
      isSupported()
        .then((supported) => {
          if (supported && app) {
            analytics = getAnalytics(app);
          }
        })
        .catch((err) => {
          console.warn('[Firebase] Analytics initialization skipped:', err?.message || err);
        });
    }
  } else {
    initError = 'VITE_FIREBASE_API_KEY is not configured in .env';
  }
} catch (error: any) {
  initError = error?.message || 'Firebase initialization error';
  console.warn('[Firebase] Initialization note:', initError);
}

export { app, auth, db, googleProvider, analytics, firebaseConfig, initError };

export interface FirebaseStatus {
  isConfigured: boolean;
  projectId: string;
  hasApiKey: boolean;
  hasAppId: boolean;
  hasAuthDomain: boolean;
  initError: string | null;
}

export const getFirebaseStatus = (): FirebaseStatus => {
  return {
    isConfigured: isFirebaseConfigured(),
    projectId: firebaseConfig.projectId,
    hasApiKey: Boolean(firebaseConfig.apiKey),
    hasAppId: Boolean(firebaseConfig.appId),
    hasAuthDomain: Boolean(firebaseConfig.authDomain),
    initError,
  };
};
