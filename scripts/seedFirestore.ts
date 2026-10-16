import dotenv from 'dotenv';
dotenv.config();

import { initializeApp as initializeClientApp } from 'firebase/app';
import { getFirestore, doc, setDoc, writeBatch } from 'firebase/firestore';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { dbStore } from '../server/db/store.js';
import { runSeed } from '../server/db/seed.js';
import { DEMO_CREDENTIALS } from '../src/types/demoCredentials.js';

/**
 * Bhumisathi - Cloud Firestore Synthetic Data & Demo Accounts Seeder
 * Target Firebase Project: landtech-e5773
 * 
 * Run with: npm run seed:firestore
 */

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY || '',
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN || 'landtech-e5773.firebaseapp.com',
  projectId: process.env.VITE_FIREBASE_PROJECT_ID || process.env.FIREBASE_PROJECT_ID || 'landtech-e5773',
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET || 'landtech-e5773.firebasestorage.app',
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: process.env.VITE_FIREBASE_APP_ID || '',
};

async function main() {
  console.log('========================================================================');
  console.log('  Bhumisathi (ভূমিসাথী) - Cloud Firestore Synthetic Seeder');
  console.log(`  Target Project: ${firebaseConfig.projectId}`);
  console.log('========================================================================\n');

  if (!firebaseConfig.apiKey || firebaseConfig.apiKey.trim().length === 0) {
    console.warn('⚠️  VITE_FIREBASE_API_KEY is not set in .env.');
    console.warn('   Ensure you add the Firebase Web SDK credentials to .env to upload data to Cloud Firestore.');
    console.warn('   Seeding local persistent store (data/db.json) to ensure seamless local operation...\n');
    await runSeed();
    console.log('✅ Local persistent JSON store seeded with all 6 core scenarios.');
    return;
  }

  // Initialize client Firebase app
  console.log('1. Connecting to Cloud Firestore for project landtech-e5773...');
  const app = initializeClientApp(firebaseConfig);
  const db = getFirestore(app);
  const auth = getAuth(app);

  // 1. Seed Demo Auth Accounts
  console.log('\n2. Provisioning 5 disposable demo accounts in Firebase Authentication...');
  for (const [key, demo] of Object.entries(DEMO_CREDENTIALS)) {
    try {
      let userCredential;
      try {
        userCredential = await createUserWithEmailAndPassword(auth, demo.email, demo.pass);
        console.log(`   ✨ Created new Firebase Auth demo user: ${demo.email} (${demo.label})`);
      } catch (err: any) {
        if (err.code === 'auth/email-already-in-use') {
          userCredential = await signInWithEmailAndPassword(auth, demo.email, demo.pass);
          console.log(`   ℹ️  Existing Firebase Auth demo user verified: ${demo.email}`);
        } else {
          throw err;
        }
      }

      if (userCredential?.user) {
        await updateProfile(userCredential.user, { displayName: demo.label });
        // Create corresponding Firestore profile document
        const profileRef = doc(db, 'profiles', userCredential.user.uid);
        await setDoc(
          profileRef,
          {
            uid: userCredential.user.uid,
            email: demo.email,
            name_bn: demo.label,
            name_en: key,
            role: demo.role,
            kyc_status: 'verified',
            citizen_id: `BHM-DEMO-${Math.floor(100000 + Math.random() * 900000)}`,
            isDemo: true,
            synthetic: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
          { merge: true }
        );
      }
    } catch (authErr: any) {
      console.warn(`   ⚠️  Could not provision ${demo.email}:`, authErr.message);
    }
  }

  // 2. Ensure raw seed data is generated
  console.log('\n3. Loading comprehensive synthetic land datasets and 6 core test scenarios...');
  await runSeed();
  const rawDb = await dbStore.getRaw();

  // 3. Batch upload collections to Cloud Firestore
  const collections: (keyof typeof rawDb)[] = [
    'land_parcels',
    'land_ownerships',
    'khatian_records',
    'land_documents',
    'khajna_accounts',
    'tax_clearances',
    'tax_payments',
    'sale_applications',
    'risk_assessments',
    'office_reviews',
    'registration_appointments',
    'registration_records',
    'mutation_applications',
    'notifications',
    'audit_logs',
  ];

  console.log('\n4. Synchronizing collections to Cloud Firestore (idempotent write)...');
  for (const collName of collections) {
    const items = (rawDb[collName] as any[]) || [];
    if (items.length === 0) continue;

    console.log(`   Uploading ${items.length} records to collection: ${collName}`);
    // Firestore batch supports up to 500 operations
    const chunks = [];
    for (let i = 0; i < items.length; i += 400) {
      chunks.push(items.slice(i, i + 400));
    }

    for (const chunk of chunks) {
      const batch = writeBatch(db);
      for (const item of chunk) {
        const docRef = doc(db, collName, item.id);
        batch.set(
          docRef,
          {
            ...item,
            isDemo: true,
            synthetic: true,
          },
          { merge: true }
        );
      }
      await batch.commit();
    }
  }

  console.log('\n========================================================================');
  console.log('🎉 Cloud Firestore seeding completed successfully for landtech-e5773!');
  console.log('   All 6 core scenarios and demo profiles are live in Firestore.');
  console.log('========================================================================\n');
}

main().catch((err) => {
  console.error('[Seeder Error]:', err);
  process.exit(1);
});
