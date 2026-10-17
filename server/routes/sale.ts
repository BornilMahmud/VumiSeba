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
import { ValidationService } from '../services/validationService.js';
import { generateSequenceId, toBasisPoints, fromBasisPoints, subtractShares } from '../utils/shareMath.js';

const router = Router();

const BN_TO_EN_DIGITS: Record<string, string> = {
  '০': '0', '১': '1', '২': '2', '৩': '3', '৪': '4',
  '৫': '5', '৬': '6', '৭': '7', '৮': '8', '৯': '9',
};
const toEnDigits = (v: any) => (v !== undefined && v !== null ? String(v).replace(/[০-৯]/g, (d) => BN_TO_EN_DIGITS[d] || d) : '');

const MOUZA_MAP_EN: Record<string, string> = {
  'বাড্ডা': 'Badda', 'সাঁতারকুল': 'Satarkul', 'ভাটারা': 'Bhatara', 'রামপুরা': 'Rampura',
  'আফতাবনগর': 'Aftabnagar', 'আম্বরখানা': 'Ambarkhana', 'নওদাপাড়া': 'Nawdapara',
  'নৈহাটী': 'Naihati', 'আলেকান্দা': 'Alekanda', 'ধাপ': 'Dhap', 'আকুয়া': 'Akua', 'আকুয়া': 'Akua',
  'কান্দিরপাড়': 'Kandirpar', 'কান্দিরপাড়': 'Kandirpar', 'জয়দেবপুর': 'Joydebpur',
  'ঝিলংজা': 'Jhilongja', 'রাজবাটী': 'Rajbati', 'গুলশান': 'Gulshan', 'মতিঝিল': 'Motijheel',
  'ধানমন্ডি': 'Dhanmondi', 'মিরপুর': 'Mirpur', 'উত্তরা': 'Uttara', 'তেজগাঁও': 'Tejgaon',
};

const DISTRICT_MAP_EN: Record<string, string> = {
  'ঢাকা': 'Dhaka', 'সিলেট': 'Sylhet', 'রাজশাহী': 'Rajshahi', 'খুলনা': 'Khulna',
  'বরিশাল': 'Barishal', 'রংপুর': 'Rangpur', 'ময়মনসিংহ': 'Mymensingh', 'কুমিল্লা': 'Cumilla',
  'গাজীপুর': 'Gazipur', 'কক্সবাজার': "Cox's Bazar", 'দিনাজপুর': 'Dinajpur', 'চট্টগ্রাম': 'Chattogram',
};

const UPAZILA_MAP_EN: Record<string, string> = {
  'গুলশান': 'Gulshan', 'সিলেট সদর': 'Sylhet Sadar', 'পবা': 'Paba', 'রূপসা': 'Rupsha',
  'কোতোয়ালী': 'Kotwali', 'রংপুর সদর': 'Rangpur Sadar', 'ময়মনসিংহ সদর': 'Mymensingh Sadar',
  'আদর্শ সদর': 'Adarsha Sadar', 'গাজীপুর সদর': 'Gazipur Sadar', 'কক্সবাজার সদর': "Cox's Bazar Sadar",
  'দিনাজপুর সদর': 'Dinajpur Sadar',
};

const NAME_MAP_EN: Record<string, string> = {
  'মোঃ আরমান হোসেন রিপন': 'Md. Arman Hossen Ripon',
  'আরমান হোসেন': 'Arman Hossen',
  'ফারহান আহমেদ': 'Farhan Ahmed',
  'মো: ফারহান আহমেদ': 'Md. Farhan Ahmed',
  'আব্দুল লতিফ': 'Abdul Latif',
  'নজরুল ইসলাম': 'Nazrul Islam',
  'বদরুল আলম': 'Badrul Alam',
  'ড. আনিসুর রহমান': 'Dr. Anisur Rahman',
  'গৌতম কুমার সেন': 'Goutam Kumar Sen',
  'মোহাম্মদ কামাল হোসেন': 'Md. Kamal Hossain',
  'তানভীর হাসান চৌধুরী': 'Tanvir Hasan Chowdhury',
  'সৈয়দা রোকসানা পারভীন': 'Syeda Roksana Parveen',
  'এ. কে. এম. রেজওয়ানুল হক': 'A. K. M. Rezwanul Haque',
  'কাজী মিজানুর রহমান': 'Kazi Mijanur Rahman',
  'তানিয়া সুলতানা': 'Tania Sultana',
  'মোসা: তানিয়া আক্তার': 'Mst. Tania Akter',
  'তানিয়া আক্তার': 'Tania Akter',
};

const enrichParcel = (p: LandParcel | undefined | null) => {
  if (!p) return null;
  return {
    ...p,
    mouza_bn: p.mouza,
    mouza_en: MOUZA_MAP_EN[p.mouza] || p.mouza,
    upazila_bn: p.upazila,
    upazila_en: UPAZILA_MAP_EN[p.upazila] || p.upazila,
    district_bn: p.district,
    district_en: DISTRICT_MAP_EN[p.district] || p.district,
    dag_no_en: toEnDigits(p.dag_no),
    khatian_no_en: toEnDigits(p.khatian_no),
  };
};

// Validation Schemas
const createSaleAppSchema = z.object({
  parcel_id: z.string().min(1, 'জমি বা দাগ নির্বাচন করুন'),
  buyer_citizen_id: z.string().min(5, 'ক্রেতার সঠিক সিটিজেন আইডি প্রদান করুন'),
  proposed_share: z.number().positive('বিক্রির অংশ ০ এর চেয়ে বড় হতে হবে').max(1.0, 'অংশ সর্বোচ্চ ১.০০ হতে পারে'),
  proposed_area_decimal: z.number().positive('জমির পরিমাণ ০ এর চেয়ে বেশি হতে হবে'),
  agreed_price_bdt: z.number().positive('বিক্রয় মূল্য প্রদান করুন'),
  deed_type_bn: z.string().default('সাফ-কবলা'),
});

const adminReviewSchema = z.object({
  action: z.enum(['approve', 'return', 'reject']),
  notes_bn: z.string().optional(),
  reason_bn: z.string().optional(),
});

const unionReviewSchema = z.object({
  action: z.enum(['approve', 'return', 'reject']),
  field_findings_bn: z.string().optional(),
  is_possession_verified: z.boolean().optional(),
  boundary_ok: z.boolean().optional(),
  reason_bn: z.string().optional(),
  notes_bn: z.string().optional(),
});

const aclandReviewSchema = z.object({
  action: z.enum(['approve', 'return', 'reject']),
  notes_bn: z.string().optional(),
  reason_bn: z.string().optional(),
});

const scheduleAppointmentSchema = z.object({
  appointment_date: z.string().min(5, 'অ্যাপয়েন্টমেন্টের তারিখ প্রদান করুন'),
  slot_time: z.string().min(2, 'সময় স্লট প্রদান করুন'),
  registry_office_name_bn: z.string().optional(),
  required_documents_bn: z.array(z.string()).optional(),
  notes_bn: z.string().optional(),
});

const completeRegistrationSchema = z.object({
  registration_serial_no: z.string().optional(),
  deed_no: z.string().optional(),
  deed_volume_no: z.string().optional(),
  deed_year: z.string().optional(),
  officer_remarks_bn: z.string().optional(),
});

const resubmitSchema = z.object({
  correction_notes_bn: z.string().optional(),
});

// 1. Pre-Check Seller Share & Tax Status Before Submission (accounting for pending reservations)
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

    // Reservation & available share calculation using fixed integer basis points
    const shareInfo = await ValidationService.getSellerShareReservation(parcel_id, user.id);
    const proposedBps = toBasisPoints(proposed_share);
    const shareExceeded = proposedBps > shareInfo.availableShareBps;
    const remainingBps = Math.max(0, shareInfo.availableShareBps - proposedBps);
    const remainingShare = fromBasisPoints(remainingBps);
    const remainingArea = Number((myOwnership.area_decimal - proposed_area_decimal).toFixed(2));

    // Tax clearance check
    const khajnaAccounts = (await dbStore.find('khajna_accounts', (k: KhajnaAccount) => k.parcel_id === parcel_id)) as KhajnaAccount[];
    const khajna = khajnaAccounts[0];
    const isTaxCleared = khajna ? khajna.status === 'cleared' && khajna.total_payable_bdt === 0 : true;

    // Injunction & mortgage check
    const hasInjunction = !!parcel.court_case_flag;
    const hasMortgage = !!parcel.bank_mortgage_flag;
    const isGovLand = !!(parcel.is_khas_land || parcel.is_acquired || parcel.is_vested);

    let blockerMessageBn: string | null = null;
    if (hasInjunction) {
      blockerMessageBn = `জমিটিতে দেওয়ানি মামলা বা আদালতের স্থগিতাদেশ বলবৎ রয়েছে (${parcel.court_case_details_bn || 'মামলা বিচারাধীন'})।`;
    } else if (hasMortgage) {
      blockerMessageBn = `জমিটি ব্যাংক বা আর্থিক প্রতিষ্ঠানে মর্টগেজ দায়বদ্ধ (${parcel.bank_mortgage_details_bn || 'দায়বদ্ধতা বিদ্যমান'})।`;
    } else if (isGovLand) {
      blockerMessageBn = 'জমিটি সরকারি খাস/অধিগ্রহণকৃত/অর্পিত সম্পত্তি হওয়ায় হস্তান্তরযোগ্য নয়।';
    } else if (shareExceeded) {
      blockerMessageBn = `প্রস্তাবিত অংশ (${proposed_share}) আপনার অবশিষ্ট অবিক্রীত অংশের (${shareInfo.availableShare}) চেয়ে বেশি! (অন্যান্য পেন্ডিং আবেদনে ${shareInfo.reservedShare} অংশ সংরক্ষিত)`;
    } else if (!isTaxCleared) {
      blockerMessageBn = `বকেয়া ভূমি উন্নয়ন কর ৳${khajna.total_payable_bdt} অপরিশোধিত রয়েছে।`;
    }

    const canSubmit = !shareExceeded && isTaxCleared && !hasInjunction && !hasMortgage && !isGovLand;

    res.json({
      success: true,
      data: {
        seller_name_bn: myOwnership.owner_name_bn,
        recorded_share: shareInfo.recordedShare,
        reserved_share: shareInfo.reservedShare,
        available_share: shareInfo.availableShare,
        active_pending_count: shareInfo.activeApplicationsCount,
        recorded_area_decimal: myOwnership.area_decimal,
        proposed_share,
        proposed_area_decimal,
        remaining_share: remainingShare,
        remaining_area_decimal: remainingArea,
        share_valid: !shareExceeded,
        share_error_bn: shareExceeded ? blockerMessageBn : null,
        tax_cleared: isTaxCleared,
        tax_error_bn: !isTaxCleared ? `বকেয়া ভূমি উন্নয়ন কর ৳${khajna.total_payable_bdt} অপরিশোধিত রয়েছে।` : null,
        has_injunction: hasInjunction,
        has_mortgage: hasMortgage,
        can_submit: canSubmit,
        blocker_reason_bn: blockerMessageBn,
      },
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message_bn: 'যাচাইকরণে ত্রুটি হয়েছে', error: err.message });
  }
});

// 2. Submit Formal Sale Application (Guarded by Tax, Injunction, Mortgage & Share limits on SERVER!)
router.post('/submit', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = req.user!;
    const validated = createSaleAppSchema.parse(req.body);

    // 1. Comprehensive Parcel & Share Validation
    const validation = await ValidationService.validateParcelForStage(
      validated.parcel_id,
      user.id,
      validated.proposed_share
    );

    if (!validation.valid) {
      await dbStore.logAudit(
        user.id,
        user.name_bn,
        user.role,
        'FRAUD_ATTEMPT_BLOCKED',
        'sale_applications',
        validated.parcel_id,
        req.ip || '127.0.0.1',
        {
          reason_code: validation.reasonCode,
          reason_bn: validation.reasonBn,
          reason_en: validation.reasonEn,
          proposed_share: validated.proposed_share,
        }
      );
      res.status(400).json({
        success: false,
        message_bn: validation.reasonBn,
        error: validation.reasonEn,
      });
      return;
    }

    // 2. Verify seller ownership
    const parcel = (await dbStore.findById('land_parcels', validated.parcel_id)) as LandParcel;
    const ownerships = (await dbStore.find('land_ownerships', (o: LandOwnership) => o.parcel_id === validated.parcel_id && o.owner_id === user.id && o.status === 'active')) as LandOwnership[];
    const myOwnership = ownerships[0];

    if (!myOwnership) {
      res.status(403).json({
        success: false,
        message_bn: 'এই দাগে আপনার মালিকানার রেকর্ড পাওয়া যায়নি। আপনি বিক্রয় আবেদন করতে পারবেন না।',
      });
      return;
    }

    // 3. Resolve Buyer by Citizen ID
    const buyers = (await dbStore.find('profiles', (p: UserProfile) => p.citizen_id === validated.buyer_citizen_id)) as UserProfile[];
    const buyer = buyers[0];
    if (!buyer) {
      res.status(400).json({
        success: false,
        message_bn: `ক্রেতার সিটিজেন আইডি '${validated.buyer_citizen_id}' ডাটাবেজে খুঁজে পাওয়া যায়নি। ক্রেতাকে প্রথমে নিবন্ধিত হতে হবে।`,
      });
      return;
    }

    // 4. Prevent selling to oneself
    if (buyer.id === user.id) {
      res.status(400).json({
        success: false,
        message_bn: 'ক্রেতা এবং বিক্রেতা একই ব্যক্তি হতে পারে না।',
      });
      return;
    }

    // 5. Create Sale Application with Collision-Safe Sequence IDs
    const appNo = generateSequenceId('BHM-SA');
    const newAppId = generateSequenceId('SA', false);
    const newApp: SaleApplication = {
      id: newAppId,
      application_no: appNo,
      parcel_id: validated.parcel_id,
      seller_id: user.id,
      buyer_id: buyer.id,
      buyer_citizen_id: buyer.citizen_id!,
      proposed_share: validated.proposed_share,
      proposed_area_decimal: validated.proposed_area_decimal,
      agreed_price_bdt: validated.agreed_price_bdt,
      deed_type_bn: validated.deed_type_bn,
      stage: 'UNION_REVIEW_PENDING',
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

    // 6. Audit log
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
        parcel: enrichParcel(parcel),
        seller: seller ? {
          name_bn: seller.name_bn,
          name_en: seller.name_en || NAME_MAP_EN[seller.name_bn] || seller.name_bn,
          citizen_id: seller.citizen_id,
          mobile: seller.mobile,
        } : null,
        buyer: buyer ? {
          name_bn: buyer.name_bn,
          name_en: buyer.name_en || NAME_MAP_EN[buyer.name_bn] || buyer.name_bn,
          citizen_id: buyer.citizen_id,
          mobile: buyer.mobile,
        } : null,
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

// 4. Get Application by ID with Full Dossier (Citizen Privacy Protected)
router.get('/:id', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = req.user!;
    const app = (await dbStore.findById('sale_applications', req.params.id)) as SaleApplication | null;
    if (!app) {
      res.status(404).json({ success: false, message_bn: 'আবেদন পাওয়া যায়নি' });
      return;
    }

    // Role-based privacy isolation: citizens may only view their own sales or purchases
    if (user.role === 'citizen' && app.seller_id !== user.id && app.buyer_id !== user.id) {
      res.status(403).json({
        success: false,
        message_bn: 'অননুমোদিত প্রবেশাধিকার। আপনি শুধুমাত্র আপনার নিজের আবেদন বা ক্রয় প্রস্তাব দেখতে পারেন।',
        error: 'Forbidden: Insufficient access to private citizen dossier',
      });
      return;
    }

    const parcel = (await dbStore.findById('land_parcels', app.parcel_id)) as LandParcel | null;
    const seller = (await dbStore.findById('profiles', app.seller_id)) as UserProfile | null;
    const buyer = (await dbStore.findById('profiles', app.buyer_id)) as UserProfile | null;
    const reviews = await dbStore.find('office_reviews', (r) => r.application_id === app.id);
    const appointment = (await dbStore.find('registration_appointments', (a: RegistrationAppointment) => a.application_id === app.id))[0] || null;
    const registrationRecord = (await dbStore.find('registration_records', (r: RegistrationRecord) => r.application_id === app.id))[0] || null;
    const mutationApp = (await dbStore.find('mutation_applications', (m: MutationApplication) => m.sale_application_id === app.id))[0] || null;

    const sellerSafe = seller ? {
      id: seller.id,
      name_bn: seller.name_bn,
      name_en: seller.name_en,
      citizen_id: seller.citizen_id,
      mobile: seller.mobile,
      nid_no: seller.nid_no,
      father_name_bn: seller.father_name_bn,
      mother_name_bn: seller.mother_name_bn,
      address_bn: seller.address_bn,
    } : null;

    const buyerSafe = buyer ? {
      id: buyer.id,
      name_bn: buyer.name_bn,
      name_en: buyer.name_en,
      citizen_id: buyer.citizen_id,
      mobile: buyer.mobile,
      nid_no: buyer.nid_no,
      father_name_bn: buyer.father_name_bn,
      mother_name_bn: buyer.mother_name_bn,
      address_bn: buyer.address_bn,
    } : null;

    const parcelEnhanced = parcel ? {
      ...parcel,
      mouza_bn: parcel.mouza,
      upazila_bn: parcel.upazila,
      district_bn: parcel.district,
    } : null;

    const appointmentDetails = appointment ? {
      id: appointment.id,
      token_no: appointment.token_no,
      date: appointment.appointment_date,
      time: appointment.slot_time,
      office_name_bn: appointment.registry_office_name_bn,
      required_documents_bn: appointment.required_documents_bn,
      status: appointment.status,
    } : null;

    const registrationDetails = registrationRecord ? {
      id: registrationRecord.id,
      deed_no: registrationRecord.deed_no,
      volume_no: registrationRecord.deed_volume_no,
      serial_no: registrationRecord.registration_serial_no,
      year: registrationRecord.deed_year,
      registration_date: registrationRecord.completion_timestamp ? registrationRecord.completion_timestamp.split('T')[0] : '২০২৬-০৩-০২',
      deed_draft_url: registrationRecord.deed_draft_url,
      office_name_bn: registrationRecord.registry_office_bn,
    } : null;

    res.json({
      success: true,
      data: {
        ...app,
        application: app,
        parcel: parcelEnhanced,
        seller: sellerSafe,
        buyer: buyerSafe,
        reviews,
        appointment,
        appointment_details: appointmentDetails,
        registration_record: registrationRecord,
        registration_details: registrationDetails,
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
    const { action, notes_bn, reason_bn } = adminReviewSchema.parse(req.body);

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

// 6. Union Land Office: Comprehensive Review (Approve to AC Land, Return, or Reject)
router.post('/:id/union-review', requireAuth, requireRole('union_officer', 'central_admin'), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = req.user!;
    const { action, field_findings_bn, is_possession_verified, boundary_ok, reason_bn, notes_bn } = unionReviewSchema.parse(req.body);

    const app = (await dbStore.findById('sale_applications', req.params.id)) as SaleApplication | null;
    if (!app) {
      res.status(404).json({ success: false, message_bn: 'আবেদন পাওয়া যায়নি' });
      return;
    }

    if (action === 'return' && !reason_bn) {
      res.status(400).json({ success: false, message_bn: 'সংশোধনের কারণ উল্লেখ করা বাধ্যতামূলক।' });
      return;
    }

    if (action === 'reject' && !reason_bn) {
      res.status(400).json({ success: false, message_bn: 'আবেদন বাতিলের কারণ উল্লেখ করা বাধ্যতামূলক।' });
      return;
    }

    let nextStage: any = app.stage;
    let nextStatus: any = app.status;

    if (action === 'approve') {
      nextStage = 'AC_LAND_REVIEW_PENDING';
    } else if (action === 'return') {
      nextStage = 'RETURNED_FOR_CORRECTION';
    } else if (action === 'reject') {
      nextStage = 'UNION_REJECTED';
      nextStatus = 'rejected';
    }

    await dbStore.update('sale_applications', app.id, {
      stage: nextStage,
      status: nextStatus,
      union_verified: action === 'approve',
      return_reason_bn: action === 'return' ? reason_bn : undefined,
      rejection_reason_bn: action === 'reject' ? reason_bn : undefined,
      updated_at: new Date().toISOString(),
    });

    // Record review log
    const reviewNote = notes_bn || reason_bn || (action === 'approve'
      ? `সরেজমিন সীমানা ও দখল: ${is_possession_verified ? 'যাচাইকৃত ও সঠিক' : 'অসঙ্গতিহীন'}। প্রতিবেদন: ${field_findings_bn || 'রেকর্ড সঠিক পাওয়া গেছে।'}`
      : reason_bn);

    await dbStore.create('office_reviews', {
      id: generateSequenceId('REV-UNION', false),
      application_id: app.id,
      office_type: 'union_land',
      officer_id: user.id,
      officer_name_bn: user.name_bn,
      officer_designation_bn: user.designation_bn || 'ইউনিয়ন ভূমি সহকারী কর্মকর্তা',
      action: action === 'approve' ? 'approved' : action === 'return' ? 'returned' : 'rejected',
      notes_bn: reviewNote,
      field_findings_bn: field_findings_bn || '',
      reviewed_at: new Date().toISOString(),
    });

    await dbStore.logAudit(
      user.id,
      user.name_bn,
      user.role,
      `UNION_REVIEW_${action.toUpperCase()}`,
      'sale_applications',
      app.id,
      req.ip || '127.0.0.1',
      { action, reason_bn, field_findings_bn }
    );

    // Notifications to Seller & Buyer
    if (action === 'approve') {
      await NotificationService.notify({
        userId: app.seller_id,
        titleBn: 'ইউনিয়ন ভূমি অফিস যাচাই সম্পন্ন ও এসি ল্যান্ডে প্রেরিত',
        messageBn: `আবেদন নং ${app.application_no} এর সরেজমিন ও দাখিলা রেকর্ড ইউনিয়ন ভূমি অফিস কর্তৃক অনুমোদিত হয়ে সহকারী কমিশনার (ভূমি) এর এজলাসে প্রেরিত হয়েছে।`,
        type: 'success',
        link: `/citizen/my-applications`,
      });
      await NotificationService.notify({
        userId: app.buyer_id,
        titleBn: 'জমি ক্রয় আবেদন অগ্রগতি (ইউনিয়ন যাচাই সম্পন্ন)',
        messageBn: `আবেদন নং ${app.application_no} ইউনিয়ন ভূমি অফিস কর্তৃক অনুমোদিত হয়ে এসি ল্যান্ড অফিসে প্রেরিত হয়েছে।`,
        type: 'info',
        link: `/citizen/deals`,
      });
    } else if (action === 'return') {
      await NotificationService.notify({
        userId: app.seller_id,
        titleBn: 'ইউনিয়ন ভূমি অফিস: আবেদন সংশোধন প্রয়োজন',
        messageBn: `আবেদন নং ${app.application_no} সংশোধনের জন্য ফেরত পাঠানো হয়েছে। কারণ: ${reason_bn}`,
        type: 'warning',
        link: `/citizen/my-applications`,
      });
    } else if (action === 'reject') {
      await NotificationService.notify({
        userId: app.seller_id,
        titleBn: 'ইউনিয়ন ভূমি অফিস: বিক্রয় আবেদন বাতিল',
        messageBn: `আবেদন নং ${app.application_no} নামঞ্জুর করা হয়েছে। কারণ: ${reason_bn}`,
        type: 'alert',
        link: `/citizen/my-applications`,
      });
    }

    res.json({
      success: true,
      message_bn: action === 'approve'
        ? 'ইউনিয়ন ভূমি অফিসের সরেজমিন ও রেকর্ড প্রতিবেদন সফলভাবে অনুমোদিত এবং এসি ল্যান্ড কার্যালয়ে প্রেরিত হয়েছে।'
        : action === 'return'
        ? 'আবেদনটি সংশোধনের জন্য নাগরিকের কাছে ফেরত পাঠানো হয়েছে।'
        : 'আবেদনটি বাতিল হিসেবে রেকর্ডভুক্ত হয়েছে।',
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message_bn: 'ইউনিয়ন অফিস পর্যালোচনা সংরক্ষণে ত্রুটি হয়েছে', error: err.message });
  }
});

// Alias for backwards compatibility
router.post('/:id/union-report', requireAuth, requireRole('union_officer', 'central_admin'), async (req: AuthenticatedRequest, res: Response) => {
  const { recommendation } = req.body;
  req.body.action = recommendation === 'recommend' || recommendation === 'approve' ? 'approve' : 'return';
  return (router as any).handle(req, res);
});

// 6.5 AC Land Pre-Registration Review (Forward to Sub-Registry, Return, or Reject)
// RE-VALIDATES tax, share, injunction, and mortgage status before granting approval!
router.post('/:id/acland-review', requireAuth, requireRole('ac_land', 'central_admin'), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = req.user!;
    const { action, notes_bn, reason_bn } = aclandReviewSchema.parse(req.body);

    const app = (await dbStore.findById('sale_applications', req.params.id)) as SaleApplication | null;
    if (!app) {
      res.status(404).json({ success: false, message_bn: 'আবেদন পাওয়া যায়নি' });
      return;
    }

    if (action === 'return' && !reason_bn) {
      res.status(400).json({ success: false, message_bn: 'সংশোধনের কারণ উল্লেখ করা আবশ্যক।' });
      return;
    }

    if (action === 'reject' && !reason_bn) {
      res.status(400).json({ success: false, message_bn: 'বাতিলের কারণ উল্লেখ করা আবশ্যক।' });
      return;
    }

    let nextStage: any = app.stage;
    let nextStatus: any = app.status;

    if (action === 'approve') {
      // Re-validate parcel state
      const revalidation = await ValidationService.validateParcelForStage(
        app.parcel_id,
        app.seller_id,
        app.proposed_share,
        app.id
      );
      if (!revalidation.valid) {
        await dbStore.logAudit(
          user.id,
          user.name_bn,
          user.role,
          'FRAUD_ATTEMPT_BLOCKED',
          'sale_applications',
          app.id,
          req.ip || '127.0.0.1',
          {
            stage: 'AC_LAND_REVIEW',
            reason_code: revalidation.reasonCode,
            reason_bn: revalidation.reasonBn,
            reason_en: revalidation.reasonEn,
          }
        );
        res.status(400).json({
          success: false,
          message_bn: `এসি ল্যান্ড অনুমোদন স্থগিত! জমিটিতে পরবর্তী জটিলতা পরিলক্ষিত হয়েছে: ${revalidation.reasonBn}`,
          error: revalidation.reasonEn,
        });
        return;
      }
      nextStage = 'REGISTRATION_READY';
    } else if (action === 'return') {
      nextStage = 'RETURNED_FOR_CORRECTION';
    } else if (action === 'reject') {
      nextStage = 'AC_LAND_REJECTED';
      nextStatus = 'rejected';
    }

    await dbStore.update('sale_applications', app.id, {
      stage: nextStage,
      status: nextStatus,
      return_reason_bn: action === 'return' ? reason_bn : undefined,
      rejection_reason_bn: action === 'reject' ? reason_bn : undefined,
      updated_at: new Date().toISOString(),
    });

    await dbStore.create('office_reviews', {
      id: generateSequenceId('REV-ACLAND', false),
      application_id: app.id,
      office_type: 'ac_land',
      officer_id: user.id,
      officer_name_bn: user.name_bn,
      officer_designation_bn: user.designation_bn || 'সহকারী কমিশনার (ভূমি)',
      action: action === 'approve' ? 'approved' : action === 'return' ? 'returned' : 'rejected',
      notes_bn: notes_bn || reason_bn || 'এসি ল্যান্ড প্রাক-রেজিস্ট্রেশন পর্যালোচনা সম্পন্ন।',
      reviewed_at: new Date().toISOString(),
    });

    await dbStore.logAudit(
      user.id,
      user.name_bn,
      user.role,
      `ACLAND_PRE_REVIEW_${action.toUpperCase()}`,
      'sale_applications',
      app.id,
      req.ip || '127.0.0.1',
      { action, reason_bn, notes_bn }
    );

    if (action === 'approve') {
      await NotificationService.notify({
        userId: app.seller_id,
        titleBn: 'এসি ল্যান্ড প্রাক-রেজিস্ট্রেশন পর্যালোচনা অনুমোদিত',
        messageBn: `আবেদন নং ${app.application_no} এসি ল্যান্ড অফিস কর্তৃক অনুমোদিত হয়েছে এবং সাব-রেজিস্ট্রি অফিসে রেজিস্ট্রেশনের জন্য প্রস্তুত।`,
        type: 'success',
        link: `/citizen/my-applications`,
      });
      await NotificationService.notify({
        userId: app.buyer_id,
        titleBn: 'এসি ল্যান্ড অনুমোদন: দলিল নিবন্ধনের জন্য প্রস্তুত',
        messageBn: `আবেদন নং ${app.application_no} এর প্রাক-রেজিস্ট্রেশন অনুমোদন সম্পন্ন। সাব-রেজিস্ট্রি অফিস কর্তৃক শিডিউল প্রদানের অপেক্ষায়।`,
        type: 'info',
        link: `/citizen/deals`,
      });
    } else if (action === 'return') {
      await NotificationService.notify({
        userId: app.seller_id,
        titleBn: 'এসি ল্যান্ড অফিস: আবেদন সংশোধন প্রয়োজন',
        messageBn: `আবেদন নং ${app.application_no} এসি ল্যান্ড কর্তৃক সংশোধনের জন্য ফেরত দেওয়া হয়েছে: ${reason_bn}`,
        type: 'warning',
        link: `/citizen/my-applications`,
      });
    } else if (action === 'reject') {
      await NotificationService.notify({
        userId: app.seller_id,
        titleBn: 'এসি ল্যান্ড অফিস: আবেদন নামঞ্জুর',
        messageBn: `আবেদন নং ${app.application_no} নামঞ্জুর করা হয়েছে: ${reason_bn}`,
        type: 'alert',
        link: `/citizen/my-applications`,
      });
    }

    res.json({
      success: true,
      message_bn: action === 'approve'
        ? 'এসি ল্যান্ড প্রাক-নিবন্ধন পর্যালোচনা সফলভাবে অনুমোদিত এবং সাব-রেজিস্ট্রি অফিসে প্রেরিত হয়েছে।'
        : action === 'return'
        ? 'আবেদনটি সংশোধনের জন্য নাগরিকের কাছে ফেরত পাঠানো হয়েছে।'
        : 'আবেদনটি নামঞ্জুর করা হয়েছে।',
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message_bn: 'এসি ল্যান্ড পর্যালোচনা সংরক্ষণে ত্রুটি হয়েছে', error: err.message });
  }
});

// 6.7 Sub-Registry Office: Schedule Registration Appointment & Generate Checklist
// RE-VALIDATES tax, share, injunction, and mortgage status before scheduling!
router.post('/:id/schedule-appointment', requireAuth, requireRole('sub_registrar', 'central_admin'), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = req.user!;
    const { appointment_date, slot_time, registry_office_name_bn, required_documents_bn, notes_bn } = scheduleAppointmentSchema.parse(req.body);

    const app = (await dbStore.findById('sale_applications', req.params.id)) as SaleApplication | null;
    if (!app) {
      res.status(404).json({ success: false, message_bn: 'আবেদন পাওয়া যায়নি' });
      return;
    }

    // Downstream parcel re-validation
    const revalidation = await ValidationService.validateParcelForStage(
      app.parcel_id,
      app.seller_id,
      app.proposed_share,
      app.id
    );
    if (!revalidation.valid) {
      await dbStore.logAudit(
        user.id,
        user.name_bn,
        user.role,
        'FRAUD_ATTEMPT_BLOCKED',
        'sale_applications',
        app.id,
        req.ip || '127.0.0.1',
        {
          stage: 'REGISTRATION_SCHEDULE',
          reason_code: revalidation.reasonCode,
          reason_bn: revalidation.reasonBn,
          reason_en: revalidation.reasonEn,
        }
      );
      res.status(400).json({
        success: false,
        message_bn: `অ্যাপয়েন্টমেন্ট নির্ধারণ স্থগিত! জমিটিতে পরবর্তী জটিলতা পরিলক্ষিত হয়েছে: ${revalidation.reasonBn}`,
        error: revalidation.reasonEn,
      });
      return;
    }

    const tokenNo = generateSequenceId('TOK', false);
    const officeName = registry_office_name_bn || user.office_name_bn || 'গুলশান সাব-রেজিস্ট্রি অফিস, ঢাকা';
    const docChecklist = required_documents_bn && required_documents_bn.length > 0
      ? required_documents_bn
      : [
          'মূল আর.এস / বি.এস খতিয়ান ও পর্চা',
          'হালনাগাদ ভূমি উন্নয়ন কর (খাজনা) দাখিলা ও ক্লিয়ারেন্স সনদ',
          'ক্রেতা ও বিক্রেতার জাতীয় পরিচয়পত্র ও পাসপোর্ট সাইজ রঙিন ছবি (২ কপি)',
          'ওয়ারিশান সনদ বা মূল বায়া দলিল (প্রযোজ্য ক্ষেত্রে)',
          'প্রস্তাবিত খসড়া দলিল ও ই-রেজিস্ট্রেশন জমা স্লিপ',
        ];

    // Check if appointment already exists
    const existingApts = (await dbStore.find('registration_appointments', (a: RegistrationAppointment) => a.application_id === app.id)) as RegistrationAppointment[];
    let appointment: RegistrationAppointment;

    if (existingApts.length > 0) {
      appointment = (await dbStore.update('registration_appointments', existingApts[0].id, {
        appointment_date,
        slot_time,
        registry_office_name_bn: officeName,
        required_documents_bn: docChecklist,
        status: 'scheduled',
        token_no: tokenNo,
        scheduled_by: user.name_bn,
      })) as RegistrationAppointment;
    } else {
      appointment = {
        id: generateSequenceId('APT', false),
        application_id: app.id,
        registry_office_name_bn: officeName,
        appointment_date,
        slot_time,
        token_no: tokenNo,
        status: 'scheduled',
        required_documents_bn: docChecklist,
        scheduled_by: user.name_bn,
        created_at: new Date().toISOString(),
      };
      await dbStore.create('registration_appointments', appointment);
    }

    // Update sale application stage
    await dbStore.update('sale_applications', app.id, {
      stage: 'APPOINTMENT_SCHEDULED',
      updated_at: new Date().toISOString(),
    });

    await dbStore.create('office_reviews', {
      id: generateSequenceId('REV-REG-SCHED', false),
      application_id: app.id,
      office_type: 'sub_registry',
      officer_id: user.id,
      officer_name_bn: user.name_bn,
      officer_designation_bn: user.designation_bn || 'সাব-রেজিস্ট্রার',
      action: 'scheduled',
      notes_bn: `রেজিস্ট্রেশন অ্যাপয়েন্টমেন্ট নির্ধারিত: ${appointment_date} (${slot_time}), টোকেন নং ${tokenNo}। ${notes_bn || ''}`,
      reviewed_at: new Date().toISOString(),
    });

    await dbStore.logAudit(
      user.id,
      user.name_bn,
      user.role,
      'SCHEDULE_REGISTRATION_APPOINTMENT',
      'sale_applications',
      app.id,
      req.ip || '127.0.0.1',
      { appointment_date, slot_time, token_no: tokenNo, office: officeName }
    );

    // In-app notifications to BOTH Seller and Buyer
    await NotificationService.notify({
      userId: app.seller_id,
      titleBn: 'রেজিস্ট্রেশন অ্যাপয়েন্টমেন্ট নির্ধারিত হয়েছে',
      messageBn: `${officeName}-এ আগামী ${appointment_date} তারিখে (${slot_time}) দলিল নিবন্ধনের জন্য সময় ও টোকেন নং ${tokenNo} নির্ধারিত হয়েছে। প্রয়োজনীয় মূল কাগজপত্র সঙ্গে আনুন।`,
      type: 'info',
      link: `/citizen/registration-checklist`,
    });

    await NotificationService.notify({
      userId: app.buyer_id,
      titleBn: 'রেজিস্ট্রেশন অ্যাপয়েন্টমেন্ট ও নথি চেকলিস্ট প্রস্তুত',
      messageBn: `${officeName}-এ আগামী ${appointment_date} তারিখে (${slot_time}) দলিল নিবন্ধনের জন্য সময় ও টোকেন নং ${tokenNo} নির্ধারিত হয়েছে। উপস্থিত থাকার অনুরোধ করা হচ্ছে।`,
      type: 'info',
      link: `/citizen/registration-checklist`,
    });

    res.json({
      success: true,
      message_bn: `সাব-রেজিস্ট্রি অফিসে দলিল নিবন্ধনের অ্যাপয়েন্টমেন্ট সফলভাবে নির্ধারিত হয়েছে। টোকেন নং: ${tokenNo}`,
      appointment,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message_bn: 'অ্যাপয়েন্টমেন্ট নির্ধারণে ত্রুটি হয়েছে', error: err.message });
  }
});

// 6.8 Citizen: Resubmit Returned Application after Correction
router.post('/:id/resubmit', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = req.user!;
    const { correction_notes_bn } = resubmitSchema.parse(req.body);

    const app = (await dbStore.findById('sale_applications', req.params.id)) as SaleApplication | null;
    if (!app) {
      res.status(404).json({ success: false, message_bn: 'আবেদন পাওয়া যায়নি' });
      return;
    }

    if (app.seller_id !== user.id && user.role !== 'central_admin') {
      res.status(403).json({ success: false, message_bn: 'শুধুমাত্র বিক্রেতা বা আবেদনকারী সংশোধন জমা দিতে পারেন।' });
      return;
    }

    if (app.stage !== 'RETURNED_FOR_CORRECTION' && app.stage !== 'RETURNED_FOR_INFORMATION') {
      res.status(400).json({ success: false, message_bn: 'আবেদনটি সংশোধনের জন্য ফেরত অবস্থায় নেই।' });
      return;
    }

    await dbStore.update('sale_applications', app.id, {
      stage: 'UNION_REVIEW_PENDING',
      return_reason_bn: undefined,
      updated_at: new Date().toISOString(),
    });

    await dbStore.logAudit(
      user.id,
      user.name_bn,
      user.role,
      'RESUBMIT_SALE_APPLICATION',
      'sale_applications',
      app.id,
      req.ip || '127.0.0.1',
      { correction_notes_bn }
    );

    // Notify citizen
    await NotificationService.notify({
      userId: user.id,
      titleBn: 'সংশোধিত আবেদন সফলভাবে দাখিল হয়েছে',
      messageBn: `আপনার বিক্রয় আবেদন নং ${app.application_no} সংশোধনের পর পুনরায় ইউনিয়ন ভূমি অফিসে পর্যালোচনার জন্য জমা হয়েছে।`,
      type: 'success',
      link: `/citizen/my-applications`,
    });

    res.json({
      success: true,
      message_bn: 'আবেদনটি সফলভাবে পুনরায় জমা হয়েছে। এটি এখন ইউনিয়ন ভূমি অফিসে পর্যালোচিত হবে।',
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message_bn: 'আবেদন পুনরায় জমাদানে ত্রুটি হয়েছে', error: err.message });
  }
});

// 7. Sub-Registry Office: Record Statutory Registration Completion & Spawn e-Mutation
// SERIALIZED UNIT OF WORK: Mutex-locked transaction commits registration + appointment + mutation spawn + audit atomically.
router.post('/:id/complete-registration', requireAuth, requireRole('sub_registrar', 'central_admin'), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = req.user!;
    const { registration_serial_no, deed_no, deed_volume_no, deed_year, officer_remarks_bn } = completeRegistrationSchema.parse(req.body);

    const app = (await dbStore.findById('sale_applications', req.params.id)) as SaleApplication | null;
    if (!app) {
      res.status(404).json({ success: false, message_bn: 'আবেদন পাওয়া যায়নি' });
      return;
    }

    // Downstream parcel re-validation
    const revalidation = await ValidationService.validateParcelForStage(
      app.parcel_id,
      app.seller_id,
      app.proposed_share,
      app.id
    );
    if (!revalidation.valid) {
      await dbStore.logAudit(
        user.id,
        user.name_bn,
        user.role,
        'FRAUD_ATTEMPT_BLOCKED',
        'sale_applications',
        app.id,
        req.ip || '127.0.0.1',
        {
          stage: 'REGISTRATION_COMPLETION',
          reason_code: revalidation.reasonCode,
          reason_bn: revalidation.reasonBn,
          reason_en: revalidation.reasonEn,
        }
      );
      res.status(400).json({
        success: false,
        message_bn: `দলিল নিবন্ধন স্থগিত! জমিটিতে জটিলতা শনাক্ত হয়েছে: ${revalidation.reasonBn}`,
        error: revalidation.reasonEn,
      });
      return;
    }

    const regSerial = registration_serial_no || generateSequenceId('REG-GLS');
    const finalDeedNo = deed_no || `${Math.floor(10000 + Math.random() * 90000)}/2026`;
    const parcel = (await dbStore.findById('land_parcels', app.parcel_id)) as LandParcel;
    const mutationCaseNo = generateSequenceId('MUT-AC');

    let regRecord: RegistrationRecord;
    let mutationApp: MutationApplication;

    // RUN ATOMIC TRANSACTION VIA STORE MUTEX
    await dbStore.runTransaction(async () => {
      regRecord = {
        id: generateSequenceId('REG-REC', false),
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
        updated_at: new Date().toISOString(),
      });

      // Spawn Linked e-Mutation Application
      mutationApp = {
        id: generateSequenceId('MUT', false),
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

      // Record Office Review
      await dbStore.create('office_reviews', {
        id: generateSequenceId('REV-REG', false),
        application_id: app.id,
        office_type: 'sub_registry',
        officer_id: user.id,
        officer_name_bn: user.name_bn,
        officer_designation_bn: user.designation_bn || 'সাব-রেজিস্ট্রার',
        action: 'registered',
        notes_bn: `দলিল নিবন্ধন সম্পন্ন হয়েছে (দলিল নং ${finalDeedNo})। স্বয়ংক্রিয়ভাবে নামজারি কেস নং ${mutationCaseNo} সৃষ্টি হয়েছে। ${officer_remarks_bn || ''}`,
        reviewed_at: new Date().toISOString(),
      });

      // Record Audit Log inside transaction
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
    });

    // Post-commit Notifications
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
      registration: regRecord!,
      mutation: mutationApp!,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message_bn: 'রেজিস্ট্রেশন প্রক্রিয়াকরণে ত্রুটি হয়েছে', error: err.message });
  }
});

export default router;
