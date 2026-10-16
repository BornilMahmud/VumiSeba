import { Router, Response } from 'express';
import { dbStore } from '../db/store.js';
import { requireAuth, requireRole, AuthenticatedRequest } from '../middleware/auth.js';
import {
  SaleApplication,
  MutationApplication,
  RegistrationAppointment,
  RegistrationRecord,
  LandParcel,
  UserProfile,
  OfficeReview,
  KhajnaAccount,
} from '../db/types.js';

const router = Router();

// Helper to generate unique Citizen ID
function generateCitizenId(): string {
  const randNum = Math.floor(100000 + Math.random() * 900000);
  return `BHM-CIT-${randNum}`;
}

// 1. Union Land Office Dashboard & Tasks
router.get('/union-queue', requireAuth, requireRole('union_officer', 'central_admin'), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const allSales = (await dbStore.get('sale_applications')) as SaleApplication[];
    const parcels = (await dbStore.get('land_parcels')) as LandParcel[];
    const profiles = (await dbStore.get('profiles')) as UserProfile[];
    const reviews = (await dbStore.get('office_reviews')) as OfficeReview[];
    const khajnaAccounts = (await dbStore.get('khajna_accounts')) as KhajnaAccount[];

    const pendingUnion = allSales.filter(
      (s) => s.stage === 'UNION_REVIEW_PENDING' || s.stage === 'UNION_REPORT_PENDING' || s.stage === 'UNDER_REVIEW'
    );
    const returnedUnion = allSales.filter(
      (s) => s.stage === 'RETURNED_FOR_CORRECTION' || s.stage === 'RETURNED_FOR_INFORMATION'
    );
    const approvedUnion = allSales.filter(
      (s) => s.union_verified || s.stage === 'AC_LAND_REVIEW_PENDING' || s.stage === 'UNION_APPROVED'
    );
    const rejectedUnion = allSales.filter((s) => s.stage === 'UNION_REJECTED' || (s.stage === 'REJECTED' && s.status === 'rejected'));

    // Count tax issues
    const taxIssueCount = allSales.filter((s) => {
      const khajna = khajnaAccounts.find((k) => k.parcel_id === s.parcel_id);
      return khajna && (khajna.status !== 'cleared' || khajna.total_payable_bdt > 0);
    }).length;

    const enrichSale = (s: SaleApplication) => {
      const khajna = khajnaAccounts.find((k) => k.parcel_id === s.parcel_id);
      return {
        ...s,
        parcel: parcels.find((p) => p.id === s.parcel_id) || null,
        seller: profiles.find((p) => p.id === s.seller_id) || null,
        buyer: profiles.find((p) => p.id === s.buyer_id) || null,
        khajna: khajna || null,
        tax_status: khajna?.status === 'cleared' ? 'পরিশোধিত' : 'বকেয়া বিদ্যমান',
        tax_arrears: khajna?.total_payable_bdt || 0,
      };
    };

    const unionReviews = reviews.filter((r) => r.office_type === 'union_land');

    res.json({
      success: true,
      stats: {
        new_applications_count: pendingUnion.length,
        pending_review_count: pendingUnion.length,
        returned_count: returnedUnion.length,
        approved_count: approvedUnion.length,
        rejected_count: rejectedUnion.length,
        tax_issue_count: taxIssueCount,
        total_handled: allSales.length,
        assigned_mouza: 'বাড্ডা, সাঁতারকুল ও ভাটারা',
      },
      queue: pendingUnion.map(enrichSale),
      all_applications: allSales.map(enrichSale),
      returned: returnedUnion.map(enrichSale),
      approved: approvedUnion.map(enrichSale),
      recent_reviews: unionReviews.slice(-10).reverse(),
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message_bn: 'ইউনিয়ন অফিসের তালিকা লোড করা যায়নি', error: err.message });
  }
});

// 2. AC Land Office Dashboard & Cases (Pre-Registration Reviews & Post-Registration Mutations)
router.get('/acland-queue', requireAuth, requireRole('ac_land', 'central_admin'), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const sales = (await dbStore.get('sale_applications')) as SaleApplication[];
    const mutations = (await dbStore.get('mutation_applications')) as MutationApplication[];
    const parcels = (await dbStore.get('land_parcels')) as LandParcel[];
    const profiles = (await dbStore.get('profiles')) as UserProfile[];
    const reviews = (await dbStore.get('office_reviews')) as OfficeReview[];

    // Pre-Registration Applications forwarded from Union
    const preRegPending = sales.filter(
      (s) => s.stage === 'AC_LAND_REVIEW_PENDING' || s.stage === 'UNION_APPROVED'
    );
    const preRegApproved = sales.filter(
      (s) => s.stage === 'REGISTRATION_READY' || s.stage === 'APPOINTMENT_SCHEDULED' || s.stage === 'REGISTRATION_COMPLETED' || s.stage === 'MUTATION_APPROVED'
    );
    const preRegReturned = sales.filter((s) => s.stage === 'RETURNED_FOR_CORRECTION');
    const preRegRejected = sales.filter((s) => s.stage === 'AC_LAND_REJECTED');

    // Post-Registration e-Mutation Cases
    const awaitingDecisionMutations = mutations.filter(
      (m) => m.current_stage === 'application_submitted' || m.current_stage === 'union_report_pending'
    );
    const pendingHearings = mutations.filter((m) => m.current_stage === 'hearing_scheduled');
    const approvedMutations = mutations.filter((m) => m.status === 'approved');
    const rejectedMutations = mutations.filter((m) => m.status === 'rejected');

    const enrichSale = (s: SaleApplication) => ({
      ...s,
      parcel: parcels.find((p) => p.id === s.parcel_id) || null,
      seller: profiles.find((p) => p.id === s.seller_id) || null,
      buyer: profiles.find((p) => p.id === s.buyer_id) || null,
      union_review: reviews.find((r) => r.application_id === s.id && r.office_type === 'union_land') || null,
    });

    const enrichMutation = (m: MutationApplication) => {
      const sale = sales.find((s) => s.id === m.sale_application_id);
      return {
        ...m,
        parcel: parcels.find((p) => p.id === m.parcel_id) || null,
        applicant: profiles.find((p) => p.id === m.applicant_id) || null,
        seller: sale ? profiles.find((p) => p.id === sale.seller_id) : null,
        sale_details: sale || null,
      };
    };

    res.json({
      success: true,
      stats: {
        // Pre-registration stats
        pre_registration_pending: preRegPending.length,
        pre_registration_approved: preRegApproved.length,
        pre_registration_returned: preRegReturned.length,
        pre_registration_rejected: preRegRejected.length,
        // Post-registration mutation stats
        total_mutation_cases: mutations.length,
        awaiting_mutation_decision: awaitingDecisionMutations.length,
        scheduled_hearings: pendingHearings.length,
        approved_khatians: approvedMutations.length,
        rejected_mutations: rejectedMutations.length,
      },
      pre_registration_queue: preRegPending.map(enrichSale),
      pre_registration_all: sales.map(enrichSale),
      mutation_cases: mutations.map(enrichMutation),
      hearings: pendingHearings.map(enrichMutation),
      decisions: [...approvedMutations, ...rejectedMutations].map(enrichMutation),
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message_bn: 'এসি ল্যান্ড কোর্ট তালিকা লোড করা যায়নি', error: err.message });
  }
});

// 3. Sub-Registry Office Dashboard & Docket
router.get('/registry-queue', requireAuth, requireRole('sub_registrar', 'central_admin'), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const sales = (await dbStore.get('sale_applications')) as SaleApplication[];
    const appointments = (await dbStore.get('registration_appointments')) as RegistrationAppointment[];
    const completedRecords = (await dbStore.get('registration_records')) as RegistrationRecord[];
    const parcels = (await dbStore.get('land_parcels')) as LandParcel[];
    const profiles = (await dbStore.get('profiles')) as UserProfile[];

    // 1. Ready for scheduling (approved by AC Land)
    const readyForScheduling = sales.filter((s) => s.stage === 'REGISTRATION_READY');

    // 2. Scheduled appointments awaiting execution
    const scheduledSales = sales.filter((s) => s.stage === 'APPOINTMENT_SCHEDULED' || s.stage === 'REGISTRATION_SCHEDULED');

    // 3. Completed registrations
    const completedSales = sales.filter(
      (s) => s.stage === 'REGISTRATION_COMPLETED' || s.stage === 'MUTATION_SUBMITTED' || s.stage === 'HEARING_SCHEDULED' || s.stage === 'MUTATION_APPROVED'
    );

    const enrichSale = (s: SaleApplication) => ({
      ...s,
      parcel: parcels.find((p) => p.id === s.parcel_id) || null,
      seller: profiles.find((p) => p.id === s.seller_id) || null,
      buyer: profiles.find((p) => p.id === s.buyer_id) || null,
      appointment: appointments.find((a) => a.application_id === s.id) || null,
      registration_record: completedRecords.find((r) => r.application_id === s.id) || null,
    });

    res.json({
      success: true,
      stats: {
        ready_for_scheduling_count: readyForScheduling.length,
        scheduled_appointments_count: scheduledSales.length,
        completed_registrations_count: completedRecords.length,
        today_appointments: scheduledSales.length,
      },
      ready_queue: readyForScheduling.map(enrichSale),
      scheduled_queue: scheduledSales.map(enrichSale),
      completed_queue: completedSales.map(enrichSale),
      completed_records: completedRecords,
      all_applications: sales.map(enrichSale),
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message_bn: 'সাব-রেজিস্ট্রি ডকেট লোড করা যায়নি', error: err.message });
  }
});

// 4. Central Administration Queue & System-Wide Analytics
router.get('/admin-queue', requireAuth, requireRole('central_admin'), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const profiles = (await dbStore.get('profiles')) as UserProfile[];
    const parcels = (await dbStore.get('land_parcels')) as LandParcel[];
    const sales = (await dbStore.get('sale_applications')) as SaleApplication[];
    const mutations = (await dbStore.get('mutation_applications')) as MutationApplication[];
    const appointments = (await dbStore.get('registration_appointments')) as RegistrationAppointment[];
    const auditLogs = (await dbStore.get('audit_logs')) as any[];

    const pendingKyc = profiles.filter((p) => p.kyc_status === 'pending');
    const verifiedCitizens = profiles.filter((p) => p.role === 'citizen' && p.kyc_status === 'verified');
    const unverifiedCitizens = profiles.filter((p) => p.role === 'citizen' && p.kyc_status !== 'verified');
    const officers = profiles.filter((p) => p.role !== 'citizen');

    const salesDetailed = sales.map((s) => ({
      ...s,
      parcel: parcels.find((p) => p.id === s.parcel_id) || null,
      seller: profiles.find((p) => p.id === s.seller_id) || null,
      buyer: profiles.find((p) => p.id === s.buyer_id) || null,
      appointment: appointments.find((a) => a.application_id === s.id) || null,
    }));

    res.json({
      success: true,
      stats: {
        total_users: profiles.length,
        total_citizens: profiles.filter((p) => p.role === 'citizen').length,
        verified_citizens_count: verifiedCitizens.length,
        unverified_citizens_count: unverifiedCitizens.length,
        total_officers: officers.length,
        total_parcels: parcels.length,
        total_sales: sales.length,
        pending_kyc_count: pendingKyc.length,
        total_mutations: mutations.length,
        approved_mutations: mutations.filter((m) => m.status === 'approved').length,
        by_stage: {
          submitted: sales.filter((s) => s.stage === 'UNION_REVIEW_PENDING' || s.stage === 'UNDER_REVIEW').length,
          returned: sales.filter((s) => s.stage === 'RETURNED_FOR_CORRECTION').length,
          ac_land_pending: sales.filter((s) => s.stage === 'AC_LAND_REVIEW_PENDING').length,
          registration_ready: sales.filter((s) => s.stage === 'REGISTRATION_READY').length,
          appointment_scheduled: sales.filter((s) => s.stage === 'APPOINTMENT_SCHEDULED' || s.stage === 'REGISTRATION_SCHEDULED').length,
          registered: sales.filter((s) => s.stage === 'REGISTRATION_COMPLETED').length,
          mutation_pending: sales.filter((s) => s.stage === 'MUTATION_SUBMITTED' || s.stage === 'HEARING_SCHEDULED').length,
          mutation_approved: sales.filter((s) => s.stage === 'MUTATION_APPROVED').length,
          rejected: sales.filter((s) => s.stage.includes('REJECTED') || s.status === 'rejected').length,
        },
      },
      pending_kyc: pendingKyc,
      users: profiles.map(({ password_hash, ...safe }) => safe),
      sales_queue: salesDetailed,
      mutations,
      recent_audits: auditLogs.slice(-25).reverse(),
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message_bn: 'প্রশাসনিক ড্যাশবোর্ড লোড করতে ত্রুটি হয়েছে', error: err.message });
  }
});

// 5. Admin: List all Users
router.get('/users', requireAuth, requireRole('central_admin'), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const profiles = (await dbStore.get('profiles')) as UserProfile[];
    const safeProfiles = profiles.map(({ password_hash, ...p }) => p);
    res.json({ success: true, data: safeProfiles });
  } catch (err: any) {
    res.status(500).json({ success: false, message_bn: 'ব্যবহারকারী তালিকা লোড করা যায়নি', error: err.message });
  }
});

// 6. Admin: Update User Role & Office Assignment
router.post('/update-role', requireAuth, requireRole('central_admin'), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = req.user!;
    const { userId, role, designation_bn, office_name_bn } = req.body;

    if (!userId || !role) {
      res.status(400).json({ success: false, message_bn: 'ব্যবহারকারী এবং ভূমিকা নির্ধারণ করুন।' });
      return;
    }

    const validRoles = ['citizen', 'union_officer', 'ac_land', 'sub_registrar', 'central_admin'];
    if (!validRoles.includes(role)) {
      res.status(400).json({ success: false, message_bn: 'অবৈধ ভূমিকা।' });
      return;
    }

    const targetUser = (await dbStore.findById('profiles', userId)) as UserProfile | null;
    if (!targetUser) {
      res.status(404).json({ success: false, message_bn: 'ব্যবহারকারী খুঁজে পাওয়া যায়নি।' });
      return;
    }

    const updated = await dbStore.update('profiles', userId, {
      role,
      designation_bn: designation_bn || targetUser.designation_bn,
      office_name_bn: office_name_bn || targetUser.office_name_bn,
      updated_at: new Date().toISOString(),
    });

    await dbStore.logAudit(
      user.id,
      user.name_bn,
      user.role,
      'ADMIN_UPDATE_USER_ROLE',
      'profiles',
      userId,
      req.ip || '127.0.0.1',
      { previous_role: targetUser.role, new_role: role, target_user: targetUser.name_bn }
    );

    res.json({
      success: true,
      message_bn: `ব্যবহারকারী '${targetUser.name_bn}' এর ভূমিকা সফলভাবে হালনাগাদ করা হয়েছে (${role})।`,
      user: updated,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message_bn: 'ভূমিকা পরিবর্তন ব্যর্থ হয়েছে', error: err.message });
  }
});

// 7. Admin: Approve KYC & Issue Citizen ID
router.post('/verify-kyc', requireAuth, requireRole('central_admin'), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = req.user!;
    const { userId } = req.body;

    if (!userId) {
      res.status(400).json({ success: false, message_bn: 'ব্যবহারকারী আইডি প্রদান করুন।' });
      return;
    }

    const targetProfile = (await dbStore.findById('profiles', userId)) as UserProfile | null;
    if (!targetProfile) {
      res.status(404).json({ success: false, message_bn: 'ব্যবহারকারী খুঁজে পাওয়া যায়নি।' });
      return;
    }

    let citizenId = targetProfile.citizen_id;
    if (!citizenId) {
      let candidate = generateCitizenId();
      const existing = await dbStore.find('profiles', (p) => p.citizen_id === candidate);
      while (existing.length > 0) {
        candidate = generateCitizenId();
      }
      citizenId = candidate;
    }

    const updated = await dbStore.update('profiles', userId, {
      kyc_status: 'verified',
      citizen_id: citizenId,
      kyc_verified_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    await dbStore.logAudit(
      user.id,
      user.name_bn,
      user.role,
      'ADMIN_APPROVE_KYC',
      'profiles',
      userId,
      req.ip || '127.0.0.1',
      { citizen_id: citizenId }
    );

    res.json({
      success: true,
      message_bn: `নাগরিক '${targetProfile.name_bn}' এর KYC সফলভাবে অনুমোদিত! ইউনিক Citizen ID: ${citizenId}`,
      user: updated,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message_bn: 'KYC অনুমোদনে ত্রুটি হয়েছে', error: err.message });
  }
});

export default router;
