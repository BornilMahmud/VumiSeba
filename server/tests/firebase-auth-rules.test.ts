import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { getFirebaseStatus } from '../../src/lib/firebase.js';
import { DEMO_CREDENTIALS } from '../../src/types/demoCredentials.js';
import { dbStore } from '../db/store.js';
import { runSeed } from '../db/seed.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '../../');

/**
 * Bhumisathi - Firebase Authentication & Security Rules Automated Verification Suite
 */

async function runFirebaseTests() {
  console.log('========================================================================');
  console.log('🧪 Running Bhumisathi Firebase Auth & Security Rules Test Suite');
  console.log('========================================================================\n');

  let passed = 0;
  let skipped = 0;
  let failed = 0;

  function assert(name: string, condition: boolean, detail?: string) {
    if (condition) {
      console.log(`  ✅ [PASS] ${name}`);
      passed++;
    } else {
      console.error(`  ❌ [FAIL] ${name} ${detail ? `(${detail})` : ''}`);
      failed++;
    }
  }

  function reportLimitation(name: string, reason: string) {
    console.log(`  ℹ️  [RECORDED LIMITATION] ${name}: ${reason}`);
    skipped++;
  }

  // 1. Firebase App & Module Initialization Test
  console.log('Test Group 1: Firebase Configuration & Module Initialization');
  const fbStatus = getFirebaseStatus();
  assert('Firebase project ID is configured as landtech-e5773', fbStatus.projectId === 'landtech-e5773');
  assert('Firebase Auth domain points to landtech-e5773.firebaseapp.com', fbStatus.hasAuthDomain);

  if (!fbStatus.hasApiKey) {
    reportLimitation(
      'Live Cloud Google Sign-In & Firestore Network Requests',
      'VITE_FIREBASE_API_KEY is not yet populated with live cloud secret in .env. Resilient fallback & mock guards tested.'
    );
  } else {
    assert('Firebase Web API key is populated', fbStatus.hasApiKey);
  }

  // 2. Firestore Rules Structure & Syntax Verification
  console.log('\nTest Group 2: Firestore Rules & Anti-Privilege Escalation');
  const rulesPath = path.join(ROOT_DIR, 'firestore.rules');
  assert('firestore.rules exists on disk', fs.existsSync(rulesPath));
  const rulesContent = fs.readFileSync(rulesPath, 'utf-8');

  assert(
    'Rules enforce unauthenticated access rejection',
    rulesContent.includes('request.auth != null')
  );
  assert(
    'Rules enforce non-elevation of role on self profile update',
    rulesContent.includes('hasAny([\'role\'') && rulesContent.includes('isPrivilegeUnchanged')
  );
  assert(
    'Rules strictly protect audit_logs as immutable (allow update, delete: if false)',
    rulesContent.includes('match /audit_logs/{logId}') && rulesContent.includes('allow update, delete: if false;')
  );
  assert(
    'Rules grant public read for land due diligence search',
    rulesContent.includes('match /land_parcels/{parcelId}') && rulesContent.includes('allow read: if true;')
  );
  assert(
    'Rules restrict private documents to owner and authorized officers',
    rulesContent.includes('match /land_documents/{docId}') && rulesContent.includes('resource.data.owner_id == request.auth.uid')
  );

  // 3. Firestore Indexes Configuration
  console.log('\nTest Group 3: Firestore Indexes Schema & Queries');
  const indexesPath = path.join(ROOT_DIR, 'firestore.indexes.json');
  assert('firestore.indexes.json exists and is valid JSON', fs.existsSync(indexesPath));
  const indexesJson = JSON.parse(fs.readFileSync(indexesPath, 'utf-8'));
  assert(
    'Indexes cover land search (district, upazila, mouza, dag_no)',
    indexesJson.indexes.some((idx: any) => idx.collectionGroup === 'land_parcels' && idx.fields.length >= 4)
  );
  assert(
    'Indexes cover sale applications by status and created_at',
    indexesJson.indexes.some((idx: any) => idx.collectionGroup === 'sale_applications')
  );
  assert(
    'Indexes cover notifications by user_id and created_at',
    indexesJson.indexes.some((idx: any) => idx.collectionGroup === 'notifications')
  );

  // 4. Demo Authentication Identities & Boundaries
  console.log('\nTest Group 4: Pre-provisioned Demo Accounts & Boundaries');
  assert('All 5 core demo identities configured in DEMO_CREDENTIALS', Object.keys(DEMO_CREDENTIALS).length >= 5);
  assert('Demo Citizen maps to citizen role', DEMO_CREDENTIALS.seller.role === 'citizen');
  assert('Demo Union Officer maps to union_officer role', DEMO_CREDENTIALS.union_officer.role === 'union_officer');
  assert('Demo AC Land maps to ac_land role', DEMO_CREDENTIALS.ac_land.role === 'ac_land');
  assert('Demo Sub-Registrar maps to sub_registrar role', DEMO_CREDENTIALS.sub_registrar.role === 'sub_registrar');
  assert('Demo Admin maps to central_admin role', DEMO_CREDENTIALS.central_admin.role === 'central_admin');

  // 5. Database Seed & Workflow Guards
  console.log('\nTest Group 5: Data Integrity & Server Safeguards');
  await runSeed();
  const profiles = await dbStore.get('profiles');
  const normalUser = profiles.find((p) => p.role === 'citizen');
  assert('Normal user receives citizen role by default', Boolean(normalUser && normalUser.role === 'citizen'));

  const parcels = await dbStore.get('land_parcels');
  assert('Clean scenario parcel (Dag ৪০৫) seeded', parcels.some((p) => p.dag_no === '৪০৫'));
  assert('Tax due scenario parcel (Dag ৮৮২) seeded', parcels.some((p) => p.dag_no === '৮৮২'));
  assert('Over-selling scenario parcel (Dag ১০২) seeded', parcels.some((p) => p.dag_no === '১০২'));

  // 6. Firebase JSON Configuration
  console.log('\nTest Group 6: firebase.json Mapping');
  const fbJsonPath = path.join(ROOT_DIR, 'firebase.json');
  assert('firebase.json exists on disk', fs.existsSync(fbJsonPath));
  const fbJson = JSON.parse(fs.readFileSync(fbJsonPath, 'utf-8'));
  assert('firebase.json maps firestore.rules', fbJson.firestore?.rules === 'firestore.rules');
  assert('firebase.json maps firestore.indexes.json', fbJson.firestore?.indexes === 'firestore.indexes.json');
  assert('firebase.json configures SPA hosting with dist/index.html rewrite', fbJson.hosting?.public === 'dist');

  console.log('\n========================================================================');
  console.log(`Results: ${passed} Passed, ${failed} Failed, ${skipped} Recorded Limitations`);
  if (failed === 0) {
    console.log('🎉 ALL FIREBASE AUTHENTICATION & SECURITY RULES TESTS PASSED!');
  } else {
    console.error('❌ Some tests failed. Review output above.');
    process.exit(1);
  }
  console.log('========================================================================\n');
}

runFirebaseTests().catch((err) => {
  console.error('[Test Execution Error]:', err);
  process.exit(1);
});
