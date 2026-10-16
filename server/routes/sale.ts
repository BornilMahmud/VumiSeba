import { Router, Response } from 'express';
import { z } from 'zod';
import { dbStore } from '../db/store.js';
import { requireAuth, requireRole, AuthenticatedRequest } from '../middleware/auth.js';
import {
  SaleApplication,
  LandParcel,
  LandOwnership,
  KhajnaAccount,
  UserProfile,
  RegistrationAppointment,
  RegistrationRecord,
  MutationApplication,
} from '../db/types.js';
import { NotificationService } from '../services/notificationService.js';

const router = Router();

const createSaleAppSchema = z.object({
  parcel_id: z.string().min(1, 'জমি বা দাগ নির্বাচন করুন'),
  buyer_citizen_id: z.string().min(5, 'ক্রেতার সঠিক সিটিজেন আইডি প্রদান করুন'),
  proposed_share: z.number().positive('বিক্রির অংশ ০ এর চেয়ে বড় হতে হবে').max(1.0, 'অংশ সর্বোচ্চ ১.০০ হতে পারে'),
  proposed_area_decimal: z.number().positive('জমির পরিমাণ ০ এর চেয়ে বেশি হতে হবে'),
  agreed_price_bdt: z.number().positive('বিক্রয় মূল্য প্রদান করুন'),
  deed_type_bn: z.string().default('সাফ-কবলা'),
});

// 1. Pre-Check Seller Share & Tax Status Before Submission
router.post('/pre-check', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = req.user!;
    const { parcel_id, proposed_share, proposed_area_decimal } = req.body;

    const parcel = (await dbStore.findById('land_parcels', parcel_id)) as LandParcel | null;
    if (!parcel) {
      res.status(404).json({ success: false, message_bn: 'দাগ বা জমি খুঁজে পাওয়া যায়নি' });
      return;
    }

    const ownerships = (await dbStore.find('land_ownerships', (o: LandOwnership) => o.parcel_id === parcel_id && o.owner_id === user.id && o.status === 'active')) as LandOwnership[];
    const myOwnership = ownerships[0];

    if (!myOwnership) {
      res.status(403).json({
        success: false,
        message_bn: 'এই দাগে আপনার কোনো বৈধ সক্রিয় মালিকানা রেকর্ড খুঁজে পাওয়া যায়নি।',
      });
      return;
    }

    // Share limit check
    const shareExceeded = proposed_share > myOwnership.share_portion;
    const remainingShare = Number((myOwnership.share_portion - proposed_share).toFixed(4));
    const remainingArea = Number((myOwnership.area_decimal - proposed_area_decimal).toFixed(2));

    // Tax clearance check
    const khajnaAccounts = (await dbStore.find('khajna_accounts', (k: KhajnaAccount) => k.parcel_id === parcel_id)) as KhajnaAccount[];
    const khajna = khajnaAccounts[0];
    const isTaxCleared = khajna ? khajna.status === 'cleared' && khajna.total_payable_bdt === 0 : true;

    res.json({
      success: true,
      data: {
        seller_name_bn: myOwnership.owner_name_bn,
        recorded_share: myOwnership.share_portion,
        recorded_area_decimal: myOwnership.area_decimal,
        proposed_share,
        proposed_area_decimal,
        remaining_share: remainingShare,
        remaining_area_decimal: remainingArea,
        share_valid: !shareExceeded,
        share_error_bn: shareExceeded ? `প্রস্তাবিত অংশ (${proposed_share}) আপনার মোট মালিকানা হিস্যার (${myOwnership.share_portion}) চেয়ে বেশি!` : null,
        tax_cleared: isTaxCleared,
        tax_error_bn: !isTaxCleared ? `বকেয়া ভূমি উন্নয়ন কর ৳${khajna.total_payable_bdt} অপরিশোধিত রয়েছে।` : null,
        can_submit: !shareExceeded && isTaxCleared,
      },
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message_bn: 'যাচাইকরণে ত্রুটি হয়েছে', error: err.message });
  }
});

// 2. Submit Formal Sale Application (Guarded by Tax & Share limits on SERVER!)
router.post('/submit', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = req.user!;
    const validated = createSaleAppSchema.parse(req.body);

    // 1. Verify parcel exists
    const parcel = (await dbStore.findById('land_parcels', validated.parcel_id)) as LandParcel | null;
    if (!parcel) {
      res.status(404).json({ success: false, message_bn: 'ভূমি পার্সেল রেকর্ড পাওয়া যায়নি।' });
      return;
    }

    // 2. Verify seller ownership & share portion
    const ownerships = (await dbStore.find('land_ownerships', (o: LandOwnership) => o.parcel_id === validated.parcel_id && o.owner_id === user.id && o.status === 'active')) as LandOwnership[];
    const myOwnership = ownerships[0];

    if (!myOwnership) {
      res.status(403).json({
        success: false,
        message_bn: 'এই দাগে আপনার মালিকানার রেকর্ড পাওয়া যায়নি। আপনি বিক্রয় আবেদন করতে পারবেন না।',
      });
      return;
    }

    if (validated.proposed_share > myOwnership.share_portion) {
      res.status(400).json({
        success: false,
        message_bn: `অননুমোদিত বিক্রয় প্রস্তাব! আপনার রেকর্ডীয় হিস্যা ${myOwnership.share_portion}, কিন্তু আপনি ${validated.proposed_share} অংশ বিক্রির প্রস্তাব করেছেন।`,
      });
      return;
    }

    // 3. SERVER-SIDE TAX CLEARANCE ENFORCEMENT
    const khajnaAccounts = (await dbStore.find('khajna_accounts', (k: KhajnaAccount) => k.parcel_id === validated.parcel_id)) as KhajnaAccount[];
    const khajna = khajnaAccounts[0];
    if (khajna && (khajna.status !== 'cleared' || khajna.total_payable_bdt > 0)) {
      res.status(400).json({
        success: false,
        message_bn: `আবেদন গ্রহণ করা সম্ভব নয়! জমিটিতে ৳${khajna.total_payable_bdt} টাকা ভূমি উন্নয়ন কর বকেয়া রয়েছে। পূর্বে বকেয়া পরিশোধ করে দাখিলা গ্রহণ করুন।`,
      });
      return;
    }

    // 4. Resolve Buyer by Citizen ID
    const buyers = (await dbStore.find('profiles', (p: UserProfile) => p.citizen_id === validated.buyer_citizen_id)) as UserProfile[];
    const buyer = buyers[0];
    if (!buyer) {
      res.status(400).json({
        success: false,
        message_bn: `ক্রেতার সিটিজেন আইডি '${validated.buyer_citizen_id}' ডাটাবেজে খুঁজে পাওয়া যায়নি। ক্রেতাকে প্রথমে নিবন্ধিত হতে হবে।`,
      });
      return;
    }

    // 5. Prevent selling to oneself
    if (buyer.id === user.id) {
      res.status(400).json({
        success: false,
        message_bn: 'ক্রেতা এবং বিক্রেতা একই ব্যক্তি হতে পারে না।',
      });
      return;
    }

    // 6. Create Sale Application
    const appNo = `BHM-SA-${new Date().getFullYear()}-${Date.now().toString().slice(-4)}`;
    const newApp: SaleApplication = {
      id: `SA-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      application_no: appNo,
      parcel_id: validated.parcel_id,
      seller_id: user.id,
      buyer_id: buyer.id,
      buyer_citizen_id: buyer.citizen_id!,
      proposed_share: validated.proposed_share,
      proposed_area_decimal: validated.proposed_area_decimal,
      agreed_price_bdt: validated.agreed_price_bdt,
      deed_type_bn: validated.deed_type_bn,
      stage: 'UNDER_REVIEW',
      status: 'active',
      tax_cleared: true,
      admin_reviewed: false,
      union_verified: false,
      registry_completed: false,
      mutation_created: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    await dbStore.create('sale_applications', newApp);

    // 7. Audit log
    await dbStore.logAudit(
      user.id,
      user.name_bn,
      user.role,
      'SUBMIT_SALE_APPLICATION',
      'sale_applications',
      newApp.id,
      req.ip || '127.0.0.1',
      { application_no: appNo, parcel_id: validated.parcel_id, buyer_id: buyer.id }
    );

    // 8. Dispatch notifications
    await NotificationService.notify({
      userId: user.id,
      titleBn: 'বিক্রয় আবেদন সফলভাবে জমা হয়েছে',
      messageBn: `আপনার বিক্রয় আবেদন নং ${appNo} সফলভাবে সিস্টেমে গৃহীত হয়েছে। পর্যালোচনার জন্য অপেক্ষমাণ।`,
      type: 'success',
      link: `/citizen/applications`,
      recipientMobile: user.mobile,
    });

    await NotificationService.notify({
      userId: buyer.id,
      titleBn: 'নতুন জমি ক্রয় প্রস্তাব প্রাপ্তি',
      messageBn: `বিক্রেতা ${user.name_bn} আপনার বরাবরে দাগ নং ${parcel.dag_no} এ ${validated.proposed_area_decimal} শতক জমির একটি বিক্রয় প্রস্তাব দাখিল করেছেন।`,
      type: 'info',
      link: `/citizen/deals`,
      recipientMobile: buyer.mobile,
    });

    res.status(201).json({
      success: true,
      message_bn: `বিক্রয় আবেদন সফলভাবে জমা হয়েছে। আবেদন নম্বর: ${appNo}`,
      data: newApp,
    });
  } catch (err: any) {
    res.status(400).json({
      success: false,
      message_bn: err.errors?.[0]?.message || 'আবেদন জমাদানে ত্রুটি হয়েছে।',
      error: err.message,
    });
  }
});

// 3. Get Citizen's Applications (as Seller or Buyer)
router.get('/my', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = req.user!;
    const apps = (await dbStore.find('sale_applications', (s: SaleApplication) => s.seller_id === user.id || s.buyer_id === user.id)) as SaleApplication[];
    const parcels = (await dbStore.get('land_parcels')) as LandParcel[];
    const profiles = (await dbStore.get('profiles')) as UserProfile[];

    const result = apps.map((app) => {
      const parcel = parcels.find((p) => p.id === app.parcel_id);
      const seller = profiles.find((p) => p.id === app.seller_id);
      const buyer = profiles.find((p) => p.id === app.buyer_id);
      return {
        ...app,
        parcel: parcel || null,
        seller: seller ? { name_bn: seller.name_bn, citizen_id: seller.citizen_id, mobile: seller.mobile } : null,
        buyer: buyer ? { name_bn: buyer.name_bn, citizen_id: buyer.citizen_id, mobile: buyer.mobile } : null,
      };
    });

    res.json({
      success: true,
      count: result.length,
      data: result,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message_bn: 'আবেদনের তালিকা লোড করতে ত্রুটি হয়েছে', error: err.message });
  }
});

// 4. Get Application by ID with Full Dossier
router.get('/:id', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const app = (await dbStore.findById('sale_applications', req.params.id)) as SaleApplication | null;
    if (!app) {
      res.status(404).json({ success: false, message_bn: 'আবেদন পাওয়া যায়নি' });
      return;
    }

    const parcel = (await dbStore.findById('land_parcels', app.parcel_id)) as LandParcel | null;
    const seller = (await dbStore.findById('profiles', app.seller_id)) as UserProfile | null;
    const buyer = (await dbStore.findById('profiles', app.buyer_id)) as UserProfile | null;
    const reviews = await dbStore.find('office_reviews', (r) => r.application_id === app.id);
    const appointment = (await dbStore.find('registration_appointments', (a: RegistrationAppointment) => a.application_id === app.id))[0] || null;
    const registrationRecord = (await dbStore.find('registration_records', (r: RegistrationRecord) => r.application_id === app.id))[0] || null;
    const mutationApp = (await dbStore.find('mutation_applications', (m: MutationApplication) => m.sale_application_id === app.id))[0] || null;

    res.json({
      success: true,
      data: {
        application: app,
        parcel,
        seller: seller ? { id: seller.id, name_bn: seller.name_bn, citizen_id: seller.citizen_id, mobile: seller.mobile, nid_no: seller.nid_no } : null,
        buyer: buyer ? { id: buyer.id, name_bn: buyer.name_bn, citizen_id: buyer.citizen_id, mobile: buyer.mobile, nid_no: buyer.nid_no } : null,
        reviews,
        appointment,
        registration_record: registrationRecord,
        mutation: mutationApp,
      },
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message_bn: 'তথ্য লোড করতে সমস্যা হয়েছে', error: err.message });
  }
});

// 5. Central Admin / Reviewer Decision: Approve, Return for Info, or Reject
router.post('/:id/admin-review', requireAuth, requireRole('central_admin'), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = req.user!;
    const { action, notes_bn, reason_bn } = req.body; // action: 'approve' | 'return' | 'reject'

    const app = (await dbStore.findById('sale_applications', req.params.id)) as SaleApplication | null;
    if (!app) {
      res.status(404).json({ success: false, message_bn: 'আবেদন পাওয়া যায়নি' });
      return;
    }

    let nextStage = app.stage;
    let newStatus = app.status;

    if (action === 'approve') {
      nextStage = 'UNION_REPORT_PENDING';
    } else if (action === 'return') {
      nextStage = 'RETURNED_FOR_INFORMATION';
    } else if (action === 'reject') {
      nextStage = 'REJECTED';
      newStatus = 'rejected';
    } else {
      res.status(400).json({ success: false, message_bn: 'অকার্যকর পদক্ষেপ' });
      return;
    }

    await dbStore.update('sale_applications', app.id, {
      stage: nextStage,
      status: newStatus,
      admin_reviewed: action === 'approve',
      return_reason_bn: action === 'return' ? reason_bn : undefined,
      rejection_reason_bn: action === 'reject' ? reason_bn : undefined,
    });

    // Record Office Review
    await dbStore.create('office_reviews', {
      id: `REV-${Date.now()}`,
      application_id: app.id,
      office_type: 'central_admin',
      officer_id: user.id,
      officer_name_bn: user.name_bn,
      officer_designation_bn: user.designation_bn || 'ভূমি কর্মকর্তা',
      action: action === 'approve' ? 'approved' : action === 'return' ? 'returned' : 'rejected',
      notes_bn: notes_bn || reason_bn || 'পর্যালোচনা সম্পন্ন হয়েছে।',
      reviewed_at: new Date().toISOString(),
    });

    // Audit Log
    await dbStore.logAudit(
      user.id,
      user.name_bn,
      user.role,
      `ADMIN_REVIEW_${action.toUpperCase()}`,
      'sale_applications',
      app.id,
      req.ip || '127.0.0.1',
      { action, notes_bn, reason_bn }
    );

    // Notify citizens
    await NotificationService.notify({
      userId: app.seller_id,
      titleBn: `বিক্রয় আবেদন পর্যালোচনার ফলাফল (${action === 'approve' ? 'অনুমোদিত' : action === 'return' ? 'সংশোধন প্রয়োজন' : 'বাতিল'})`,
      messageBn: notes_bn || reason_bn || `আবেদন নং ${app.application_no} অবস্থা হালনাগাদ হয়েছে।`,
      type: action === 'approve' ? 'success' : action === 'return' ? 'warning' : 'alert',
      link: `/citizen/applications`,
    });

    res.json({
      success: true,
      message_bn: `আবেদনটি সফলভাবে ${action === 'approve' ? 'অনুমোদন' : action === 'return' ? 'সংশোধনের জন্য ফেরত' : 'বাতিল'} করা হয়েছে।`,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message_bn: 'পর্যালোচনা সংরক্ষণে ত্রুটি হয়েছে', error: err.message });
  }
});

// 6. Union Land Office: Submit Field Verification Report
router.post('/:id/union-report', requireAuth, requireRole('union_officer', 'central_admin'), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = req.user!;
    const { field_findings_bn, is_possession_verified, boundary_ok, recommendation } = req.body;

    const app = (await dbStore.findById('sale_applications', req.params.id)) as SaleApplication | null;
    if (!app) {
      res.status(404).json({ success: false, message_bn: 'আবেদন পাওয়া যায়নি' });
      return;
    }

    const nextStage = recommendation === 'recommend' ? 'REGISTRATION_SCHEDULED' : 'RETURNED_FOR_INFORMATION';

    await dbStore.update('sale_applications', app.id, {
      stage: nextStage,
      union_verified: recommendation === 'recommend',
    });

    await dbStore.create('office_reviews', {
      id: `REV-UNION-${Date.now()}`,
      application_id: app.id,
      office_type: 'union_land',
      officer_id: user.id,
      officer_name_bn: user.name_bn,
      officer_designation_bn: user.designation_bn || 'ইউনিয়ন ভূমি সহকারী কর্মকর্তা',
      action: 'investigated',
      notes_bn: `সরেজমিন সীমানা ও দখল: ${is_possession_verified ? 'যাচাইকৃত ও সঠিক' : 'অসঙ্গতিযুক্ত'}। প্রতিবেদন: ${field_findings_bn}`,
      field_findings_bn,
      reviewed_at: new Date().toISOString(),
    });

    // If recommended, automatically set up registration appointment slot & checklist
    if (recommendation === 'recommend') {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 3);

      const appointment: RegistrationAppointment = {
        id: `APT-${Date.now()}`,
        application_id: app.id,
        registry_office_name_bn: 'গুলশান সাব-রেজিস্ট্রি অফিস, ঢাকা',
        appointment_date: tomorrow.toISOString().split('T')[0],
        slot_time: 'বেলা ১১:০০ - দুপুর ১২:৩০',
        token_no: `TOK-${Math.floor(100 + Math.random() * 900)}`,
        status: 'scheduled',
        required_documents_bn: [
          'মূল আর.এস / বি.এস খতিয়ান ও পর্চা',
          'হালনাগাদ ভূমি উন্নয়ন কর (খাজনা) দাখিলা ও ক্লিয়ারেন্স সনদ',
          'ক্রেতা ও বিক্রেতার জাতীয় পরিচয়পত্র ও পাসপোর্ট সাইজ রঙিন ছবি (২ কপি)',
          'ওয়ারিশান সনদ বা মূল বায়া দলিল (প্রযোজ্য ক্ষেত্রে)',
          'প্রস্তাবিত খসড়া দলিল ও ই-রেজিস্ট্রেশন জমা স্লিপ',
        ],
        scheduled_by: user.name_bn,
        created_at: new Date().toISOString(),
      };
      await dbStore.create('registration_appointments', appointment);

      // Notify parties
      await NotificationService.notify({
        userId: app.seller_id,
        titleBn: 'রেজিস্ট্রেশন অ্যাপয়েন্টমেন্ট নির্ধারিত হয়েছে',
        messageBn: `গুলশান সাব-রেজিস্ট্রি অফিসে আগামী ${appointment.appointment_date} তারিখে দলিল নিবন্ধনের জন্য সময় ও টোকেন নং ${appointment.token_no} নির্ধারিত হয়েছে।`,
        type: 'info',
        link: `/citizen/registration-checklist`,
      });

      await NotificationService.notify({
        userId: app.buyer_id,
        titleBn: 'রেজিস্ট্রেশন অ্যাপয়েন্টমেন্ট ও নথি চেকলিস্ট প্রস্তুত',
        messageBn: `সাব-রেজিস্ট্রি অফিসে আগামী ${appointment.appointment_date} তারিখে উপস্থিত থাকার অনুরোধ করা হচ্ছে।`,
        type: 'info',
        link: `/citizen/registration-checklist`,
      });
    }

    await dbStore.logAudit(
      user.id,
      user.name_bn,
      user.role,
      'UNION_FIELD_VERIFICATION_SUBMITTED',
      'sale_applications',
      app.id,
      req.ip || '127.0.0.1',
      { recommendation, field_findings_bn }
    );

    res.json({
      success: true,
      message_bn: 'ইউনিয়ন ভূমি অফিসের সরেজমিন তদন্ত প্রতিবেদন সফলভাবে সংরক্ষণ ও দাখিল করা হয়েছে।',
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message_bn: 'তদন্ত প্রতিবেদন সংরক্ষণে ত্রুটি হয়েছে', error: err.message });
  }
});

// 7. Sub-Registry Office: Record Statutory Registration Completion & Spawn e-Mutation
router.post('/:id/complete-registration', requireAuth, requireRole('sub_registrar', 'central_admin'), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = req.user!;
    const { registration_serial_no, deed_no, deed_volume_no, deed_year, officer_remarks_bn } = req.body;

    const app = (await dbStore.findById('sale_applications', req.params.id)) as SaleApplication | null;
    if (!app) {
      res.status(404).json({ success: false, message_bn: 'আবেদন পাওয়া যায়নি' });
      return;
    }

    const regSerial = registration_serial_no || `REG-GLS-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const finalDeedNo = deed_no || `${Math.floor(10000 + Math.random() * 90000)}/2026`;
    const regRecord: RegistrationRecord = {
      id: `REG-REC-${Date.now()}`,
      application_id: app.id,
      registry_office_bn: 'গুলশান সাব-রেজিস্ট্রি অফিস, ঢাকা',
      registration_serial_no: regSerial,
      deed_no: finalDeedNo,
      deed_volume_no: deed_volume_no || 'খণ্ড ৪২, পাতা ১০৪-১১২',
      deed_year: deed_year || '২০২৬',
      completion_timestamp: new Date().toISOString(),
      officer_id: user.id,
      deed_draft_url: `/drafts/deed-${app.id}.pdf`,
      is_official_record: true,
      disclaimer_bn: 'ডেমো নিবন্ধন কার্য সম্পন্ন। সরকারি নিবন্ধন পরিদপ্তর নিয়মানুযায়ী পোস্ট-রেজিস্ট্রেশন নামজারি প্রক্রিয়া সূচিত হয়েছে।',
    };
    await dbStore.create('registration_records', regRecord);

    // Update appointment status to completed
    const appointments = (await dbStore.find('registration_appointments', (a: RegistrationAppointment) => a.application_id === app.id)) as RegistrationAppointment[];
    if (appointments[0]) {
      await dbStore.update('registration_appointments', appointments[0].id, { status: 'completed' });
    }

    // Update sale application stage
    await dbStore.update('sale_applications', app.id, {
      stage: 'MUTATION_SUBMITTED',
      registry_completed: true,
      mutation_created: true,
    });

    // AUTOMATICALLY SPAWN LINKED E-MUTATION APPLICATION
    const parcel = (await dbStore.findById('land_parcels', app.parcel_id)) as LandParcel;
    const mutationCaseNo = `MUT-AC-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const mutationApp: MutationApplication = {
      id: `MUT-${Date.now()}`,
      mutation_case_no: mutationCaseNo,
      sale_application_id: app.id,
      parcel_id: app.parcel_id,
      applicant_id: app.buyer_id,
      previous_khatian_no: parcel ? parcel.khatian_no : '১২০৪',
      proposed_khatian_no: `হাল-${Math.floor(2000 + Math.random() * 8000)}`,
      current_stage: 'application_submitted',
      status: 'active',
      order_summary_bn: `রেজিস্ট্রিকৃত সাফ-কবলা দলিল নং ${finalDeedNo} এর সূত্রে নামজারি মোকাদ্দমা স্বয়ংক্রিয়ভাবে রুজু করা হলো।`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    await dbStore.create('mutation_applications', mutationApp);

    // Office review log
    await dbStore.create('office_reviews', {
      id: `REV-REG-${Date.now()}`,
      application_id: app.id,
      office_type: 'sub_registry',
      officer_id: user.id,
      officer_name_bn: user.name_bn,
      officer_designation_bn: user.designation_bn || 'সাব-রেজিস্ট্রার',
      action: 'registered',
      notes_bn: `দলিল নিবন্ধন সম্পন্ন হয়েছে (দলিল নং ${finalDeedNo})। স্বয়ংক্রিয়ভাবে নামজারি কেস নং ${mutationCaseNo} সৃষ্টি হয়েছে। ${officer_remarks_bn || ''}`,
      reviewed_at: new Date().toISOString(),
    });

    // Audit Log
    await dbStore.logAudit(
      user.id,
      user.name_bn,
      user.role,
      'COMPLETE_DEED_REGISTRATION',
      'sale_applications',
      app.id,
      req.ip || '127.0.0.1',
      { deed_no: finalDeedNo, registration_serial_no: regSerial, mutation_case_no: mutationCaseNo }
    );

    // Notifications
    await NotificationService.notify({
      userId: app.buyer_id,
      titleBn: 'দলিল নিবন্ধন সম্পন্ন ও নামজারি কেস শুরু হয়েছে',
      messageBn: `আপনার দলিল নং ${finalDeedNo} নিবন্ধন সম্পন্ন হয়েছে এবং সহকারী কমিশনার (ভূমি) কার্যালয়ে নামজারি কেস নং ${mutationCaseNo} স্বয়ংক্রিয়ভাবে শুরু হয়েছে।`,
      type: 'success',
      link: `/citizen/mutation`,
    });

    await NotificationService.notify({
      userId: app.seller_id,
      titleBn: 'দলিল নিবন্ধন সমাপ্তি অবহিতকরণ',
      messageBn: `আপনার বিক্রয় আবেদন নং ${app.application_no} এর আওতায় দলিল নং ${finalDeedNo} সফলভাবে নিবন্ধিত হয়েছে।`,
      type: 'info',
      link: `/citizen/applications`,
    });

    res.json({
      success: true,
      message_bn: `দলিল নিবন্ধন সফলভাবে রেকর্ড করা হয়েছে (দলিল নং ${finalDeedNo})। পোস্ট-রেজিস্ট্রেশন নামজারি কেস নং ${mutationCaseNo} রুজু হয়েছে।`,
      registration: regRecord,
      mutation: mutationApp,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message_bn: 'রেজিস্ট্রেশন প্রক্রিয়াকরণে ত্রুটি হয়েছে', error: err.message });
  }
});

export default router;
