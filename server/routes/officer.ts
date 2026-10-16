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
} from '../db/types.js';

const router = Router();

// 1. Union Land Office Dashboard & Tasks
router.get('/union-queue', requireAuth, requireRole('union_officer', 'central_admin'), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const allSales = (await dbStore.get('sale_applications')) as SaleApplication[];
    const pendingInspection = allSales.filter((s) => s.stage === 'UNION_REPORT_PENDING');
    const inspected = allSales.filter((s) => s.union_verified);

    const parcels = (await dbStore.get('land_parcels')) as LandParcel[];
    const profiles = (await dbStore.get('profiles')) as UserProfile[];

    const pendingDetailed = pendingInspection.map((s) => ({
      ...s,
      parcel: parcels.find((p) => p.id === s.parcel_id) || null,
      seller: profiles.find((p) => p.id === s.seller_id) || null,
      buyer: profiles.find((p) => p.id === s.buyer_id) || null,
    }));

    res.json({
      success: true,
      stats: {
        pending_inspection_count: pendingInspection.length,
        completed_inspection_count: inspected.length,
        assigned_mouza: 'বাড্ডা ও সাঁতারকুল',
      },
      queue: pendingDetailed,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message_bn: 'ইউনিয়ন অফিসের তালিকা লোড করা যায়নি', error: err.message });
  }
});

// 2. AC Land Office Dashboard & Cases
router.get('/acland-queue', requireAuth, requireRole('ac_land', 'central_admin'), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const mutations = (await dbStore.get('mutation_applications')) as MutationApplication[];
    const parcels = (await dbStore.get('land_parcels')) as LandParcel[];
    const profiles = (await dbStore.get('profiles')) as UserProfile[];
    const sales = (await dbStore.get('sale_applications')) as SaleApplication[];

    const pendingHearings = mutations.filter((m) => m.current_stage === 'hearing_scheduled');
    const awaitingDecision = mutations.filter((m) => m.current_stage === 'application_submitted');
    const approvedMutations = mutations.filter((m) => m.status === 'approved');

    const enrichedMutations = mutations.map((m) => {
      const sale = sales.find((s) => s.id === m.sale_application_id);
      return {
        ...m,
        parcel: parcels.find((p) => p.id === m.parcel_id) || null,
        applicant: profiles.find((p) => p.id === m.applicant_id) || null,
        seller: sale ? profiles.find((p) => p.id === sale.seller_id) : null,
        sale_details: sale || null,
      };
    });

    res.json({
      success: true,
      stats: {
        total_mutation_cases: mutations.length,
        awaiting_action: awaitingDecision.length,
        scheduled_hearings: pendingHearings.length,
        approved_khatians: approvedMutations.length,
      },
      cases: enrichedMutations,
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

    const scheduledSales = sales.filter((s) => s.stage === 'REGISTRATION_SCHEDULED');

    const scheduledDetailed = scheduledSales.map((s) => ({
      ...s,
      parcel: parcels.find((p) => p.id === s.parcel_id) || null,
      seller: profiles.find((p) => p.id === s.seller_id) || null,
      buyer: profiles.find((p) => p.id === s.buyer_id) || null,
      appointment: appointments.find((a) => a.application_id === s.id) || null,
    }));

    res.json({
      success: true,
      stats: {
        scheduled_appointments_count: scheduledSales.length,
        completed_registrations_count: completedRecords.length,
        today_appointments: scheduledSales.length,
      },
      queue: scheduledDetailed,
      completed: completedRecords,
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
    const auditLogs = (await dbStore.get('audit_logs')) as any[];

    const pendingKyc = profiles.filter((p) => p.kyc_status === 'pending');
    const underReviewSales = sales.filter((s) => s.stage === 'UNDER_REVIEW');

    const salesDetailed = sales.map((s) => ({
      ...s,
      parcel: parcels.find((p) => p.id === s.parcel_id) || null,
      seller: profiles.find((p) => p.id === s.seller_id) || null,
      buyer: profiles.find((p) => p.id === s.buyer_id) || null,
    }));

    res.json({
      success: true,
      stats: {
        total_citizens: profiles.filter((p) => p.role === 'citizen').length,
        total_officers: profiles.filter((p) => p.role !== 'citizen').length,
        total_parcels: parcels.length,
        total_sales: sales.length,
        pending_review_count: underReviewSales.length,
        pending_kyc_count: pendingKyc.length,
        total_mutations: mutations.length,
        approved_mutations: mutations.filter((m) => m.status === 'approved').length,
      },
      pending_kyc: pendingKyc,
      sales_queue: salesDetailed,
      recent_audits: auditLogs.slice(-15).reverse(),
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message_bn: 'প্রশাসনিক ড্যাশবোর্ড লোড করতে ত্রুটি হয়েছে', error: err.message });
  }
});

export default router;
