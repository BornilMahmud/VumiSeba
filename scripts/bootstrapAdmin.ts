import dotenv from 'dotenv';
dotenv.config();

import { dbStore } from '../server/db/store.js';

/**
 * Bhumisathi - Trusted Administrator Role Bootstrap Tool
 * 
 * Usage:
 *   npx tsx scripts/bootstrapAdmin.ts <user-email-or-uid>
 * 
 * Requirements:
 *   - Only runs in trusted CLI / server-side environments.
 *   - Never bundled into client code.
 *   - Strictly logs every promotion to audit_logs.
 */

async function bootstrapAdmin() {
  const target = process.argv[2];

  console.log('========================================================================');
  console.log('  Bhumisathi (ভূমিসাথী) - Administrator Bootstrap Utility');
  console.log('========================================================================\n');

  if (!target) {
    console.error('❌ Error: Target user email or user ID must be provided.');
    console.log('Usage: npx tsx scripts/bootstrapAdmin.ts <user-email-or-id>\n');
    process.exit(1);
  }

  console.log(`Target identifier: ${target}`);
  const profiles = await dbStore.get('profiles');
  const user = profiles.find((p) => p.email.toLowerCase() === target.toLowerCase() || p.id === target);

  if (!user) {
    console.error(`❌ User not found with email or ID: ${target}`);
    console.log('Available users in local store:');
    profiles.forEach((p) => console.log(` - ${p.email} (${p.id}) [${p.role}]`));
    process.exit(1);
  }

  const previousRole = user.role;
  const updated = await dbStore.update('profiles', user.id, {
    role: 'central_admin',
    updated_at: new Date().toISOString(),
  });

  await dbStore.logAudit(
    'BOOTSTRAP_CLI',
    'System Bootstrap Tool',
    'system_admin',
    'ADMIN_ROLE_PROMOTION',
    'profiles',
    user.id,
    '127.0.0.1',
    {
      target_user_id: user.id,
      target_email: user.email,
      previous_role: previousRole,
      new_role: 'central_admin',
      promoted_at: new Date().toISOString(),
    }
  );

  console.log(`✅ Success: User ${user.email} (${user.id}) elevated from '${previousRole}' to 'central_admin'!`);
  console.log('   Audit log recorded in database.');
  console.log('\n========================================================================\n');
}

bootstrapAdmin().catch((err) => {
  console.error('[Bootstrap Error]:', err);
  process.exit(1);
});
