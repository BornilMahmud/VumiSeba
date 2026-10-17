import { Router, Response } from 'express';
import { z } from 'zod';
import { dbStore } from '../db/store.js';
import { requireAuth, requireRole, AuthenticatedRequest } from '../middleware/auth.js';
import {
  MutationApplication,
  SaleApplication,
  LandParcel,
  LandOwnership,
  KhatianRecord,
  UserProfile,
  KhajnaAccount,
} from '../db/types.js';
import { NotificationService } from '../services/notificationService.js';
import { ValidationService } from '../services/validationService.js';
import {
  toBasisPoints,
  fromBasisPoints,
  subtractShares,
  generateSequenceId,
} from '../utils/shareMath.js';

const router = Router();

const scheduleHearingSchema = z.object({
  hearing_date: z.string().min(5, 'শুনানির তারিখ নির্ধারণ আবশ্যক'),
  notes_bn: z.string().optional(),
});

const decideMutationSchema = z.object({
  decision: z.enum(['approve', 'reject']),
  order_notes_bn: z.string().optional(),
});

// 1. List Mutation Cases (Citizen or Officers)
router.get('/', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = req.user!;
    let mutations: MutationApplication[] = [];

    if (user.role === 'citizen') {
      mutations = (await dbStore.find('mutation_applications', (m: MutationApplication) => m.applicant_id === user.id)) as MutationApplication[];
    } else {
      mutations = (await dbStore.get('mutation_applications')) as MutationApplication[];
    }

    const parcels = (await dbStore.get('land_parcels')) as LandParcel[];
    const profiles = (await dbStore.get('profiles')) as UserProfile[];
    const sales = (await dbStore.get('sale_applications')) as SaleApplication[];

    const enriched = mutations.map((m) => {
      const parcel = parcels.find((p) => p.id === m.parcel_id);
      const applicant = profiles.find((p) => p.id === m.applicant_id);
      const sale = sales.find((s) => s.id === m.sale_application_id);
      const seller = sale ? profiles.find((p) => p.id === sale.seller_id) : null;

      return {
        ...m,
        parcel: parcel || null,
        applicant: applicant ? { name_bn: applicant.name_bn, citizen_id: applicant.citizen_id, mobile: applicant.mobile } : null,
        seller: seller ? { name_bn: seller.name_bn, citizen_id: seller.citizen_id } : null,
        sale_application_no: sale?.application_no,
        proposed_area_decimal: sale?.proposed_area_decimal,
      };
    });

    res.json({
      success: true,
      count: enriched.length,
      data: enriched,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message_bn: 'নামজারি তালিকা লোড করতে ত্রুটি হয়েছে', error: err.message });
  }
});

// 2. Schedule Mutation Hearing Date (AC Land only)
router.post('/:id/schedule-hearing', requireAuth, requireRole('ac_land', 'central_admin'), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = req.user!;
    const { hearing_date, notes_bn } = scheduleHearingSchema.parse(req.body);

    const mutation = (await dbStore.findById('mutation_applications', req.params.id)) as MutationApplication | null;
    if (!mutation) {
      res.status(404).json({ success: false, message_bn: 'নামজারি কেস পাওয়া যায়নি' });
      return;
    }

    await dbStore.update('mutation_applications', mutation.id, {
      hearing_date,
      current_stage: 'hearing_scheduled',
      order_summary_bn: `শুনানির তারিখ নির্ধারণ করা হলো: ${hearing_date}। মূল কাগজপত্রসহ উভয় পক্ষকে উপস্থিত থাকার নির্দেশ দেওয়া হলো।`,
    });

    const sale = (await dbStore.findById('sale_applications', mutation.sale_application_id)) as SaleApplication | null;
    if (sale) {
      await dbStore.update('sale_applications', sale.id, {
        stage: 'HEARING_SCHEDULED',
      });

      // Notify buyer and seller
      await NotificationService.notify({
        userId: mutation.applicant_id,
        titleBn: 'নামজারি শুনানির নোটিশ জারি',
        messageBn: `সহকারী কমিশনার (ভূমি) কার্যালয়ে আগামী ${hearing_date} তারিখে আপনার নামজারি কেস নং ${mutation.mutation_case_no} এর শুনানির তারিখ ধার্য করা হয়েছে।`,
        type: 'info',
        link: `/citizen/mutation`,
      });

      if (sale.seller_id) {
        await NotificationService.notify({
          userId: sale.seller_id,
          titleBn: 'নামজারি শুনানির নোটিশ',
          messageBn: `কেস নং ${mutation.mutation_case_no} শুনানির নোটিশ: শুনানির তারিখ ${hearing_date}।`,
          type: 'info',
          link: `/citizen/applications`,
        });
      }
    }

    await dbStore.logAudit(
      user.id,
      user.name_bn,
      user.role,
      'SCHEDULE_MUTATION_HEARING',
      'mutation_applications',
      mutation.id,
      req.ip || '127.0.0.1',
      { hearing_date, notes_bn }
    );

    res.json({
      success: true,
      message_bn: `নামজারি শুনানির তারিখ সফলভাবে নির্ধারিত হয়েছে (${hearing_date})।`,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message_bn: 'শুনানির তারিখ নির্ধারণে ত্রুটি হয়েছে', error: err.message });
  }
});

// 3. Final AC Land Decision: Approve Mutation & Form New Land Records (Stage 9)
// SERIALIZED TRANSACTION: Mutex-locked commit guarantees atomicity of Khatian + Ownership + Khajna + Audit
router.post('/:id/decide', requireAuth, requireRole('ac_land', 'central_admin'), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = req.user!;
    const { decision, order_notes_bn } = decideMutationSchema.parse(req.body);

    const mutation = (await dbStore.findById('mutation_applications', req.params.id)) as MutationApplication | null;
    if (!mutation) {
      res.status(404).json({ success: false, message_bn: 'নামজারি কেস পাওয়া যায়নি' });
      return;
    }

    const sale = (await dbStore.findById('sale_applications', mutation.sale_application_id)) as SaleApplication | null;
    if (!sale) {
      res.status(404).json({ success: false, message_bn: 'সম্পর্কিত বিক্রয় আবেদন পাওয়া যায়নি' });
      return;
    }

    const parcel = (await dbStore.findById('land_parcels', mutation.parcel_id)) as LandParcel | null;
    if (!parcel) {
      res.status(404).json({ success: false, message_bn: 'ভূমি পার্সেল পাওয়া যায়নি' });
      return;
    }

    const buyer = (await dbStore.findById('profiles', mutation.applicant_id)) as UserProfile | null;
    const seller = (await dbStore.findById('profiles', sale.seller_id)) as UserProfile | null;

    if (decision === 'reject') {
      await dbStore.update('mutation_applications', mutation.id, {
        current_stage: 'rejected',
        status: 'rejected',
        order_summary_bn: `নামজারি আবেদন নামঞ্জুর/বাতিল করা হলো। কারণ: ${order_notes_bn || 'উপযুক্ত প্রমাণক নথির অভাব'}`,
      });

      await dbStore.update('sale_applications', sale.id, {
        stage: 'MUTATION_REJECTED',
      });

      await NotificationService.notify({
        userId: mutation.applicant_id,
        titleBn: 'নামজারি আবেদন বাতিলের আদেশ',
        messageBn: `আপনার নামজারি কেস নং ${mutation.mutation_case_no} নামঞ্জুর করা হয়েছে। কারণ: ${order_notes_bn || 'উপযুক্ত নথির অভাব'}`,
        type: 'alert',
        link: `/citizen/mutation`,
      });

      res.json({
        success: true,
        message_bn: 'নামজারি আবেদন নামঞ্জুর করা হয়েছে।',
      });
      return;
    }

    // Downstream parcel re-validation prior to approving mutation
    const revalidation = await ValidationService.validateParcelForStage(
      mutation.parcel_id,
      sale.seller_id,
      sale.proposed_share,
      sale.id
    );

    if (!revalidation.valid) {
      await dbStore.logAudit(
        user.id,
        user.name_bn,
        user.role,
        'FRAUD_ATTEMPT_BLOCKED',
        'mutation_applications',
        mutation.id,
        req.ip || '127.0.0.1',
        {
          stage: 'MUTATION_APPROVAL',
          reason_code: revalidation.reasonCode,
          reason_bn: revalidation.reasonBn,
          reason_en: revalidation.reasonEn,
        }
      );
      res.status(400).json({
        success: false,
        message_bn: `নামজারি অনুমোদন স্থগিত! জমিটিতে পরবর্তী বিরোধ বা জটিলতা রয়েছে: ${revalidation.reasonBn}`,
        error: revalidation.reasonEn,
      });
      return;
    }

    // STAGE 9: CRITICAL RESULTING LAND RECORD CREATION & SHARE REDISTRIBUTION
    let newKhatianRecord: KhatianRecord;
    let newBuyerOwnership: LandOwnership;
    let newKhajnaAccount: KhajnaAccount;
    const newKhatianNo = generateSequenceId('নামজারি');
    const newHoldingNo = generateSequenceId(`HLD-${parcel.mouza.slice(0, 3)}`, false);

    // ATOMIC TRANSACTION: Mutex-locked multi-collection commit
    await dbStore.runTransaction(async () => {
      // 1. Generate new Approved Mutation Khatian
      newKhatianRecord = {
        id: generateSequenceId('KHT-MUT', false),
        khatian_no: newKhatianNo,
        khatian_type: 'Mutation',
        mouza: parcel.mouza,
        jl_no: parcel.jl_no,
        upazila: parcel.upazila,
        district: parcel.district,
        recorded_owner_bn: buyer ? buyer.name_bn : 'নামজারি গ্রহীতা',
        recorded_father_bn: buyer ? buyer.father_name_bn : '',
        shares_summary_bn: `${buyer?.name_bn || 'ক্রেতা'} (১.০০০০ অংশ - খারিজকৃত)`,
        dags_summary_bn: `দাগ ${parcel.dag_no} (${parcel.land_class}, ${sale.proposed_area_decimal} শতক)`,
        total_area_decimal: sale.proposed_area_decimal,
        is_archived: false,
        created_at: new Date().toISOString(),
      };
      await dbStore.create('khatian_records', newKhatianRecord);

      // 2. Adjust Seller's Ownership Record using Fixed Basis Points Math (0 drift)
      const sellerOwnerships = (await dbStore.find('land_ownerships', (o: LandOwnership) => o.parcel_id === parcel.id && o.owner_id === sale.seller_id && o.status === 'active')) as LandOwnership[];
      const originalSellerOwnership = sellerOwnerships[0];

      if (originalSellerOwnership) {
        const origBps = toBasisPoints(originalSellerOwnership.share_portion);
        const soldBps = toBasisPoints(sale.proposed_share);
        const remainingBps = subtractShares(origBps, soldBps);
        const remainingShare = fromBasisPoints(remainingBps);
        const remainingArea = Number((originalSellerOwnership.area_decimal - sale.proposed_area_decimal).toFixed(2));

        if (remainingBps <= 0) {
          // Seller transferred full interest
          await dbStore.update('land_ownerships', originalSellerOwnership.id, {
            status: 'transferred',
            share_portion: 0,
            area_decimal: 0,
          });
        } else {
          // Seller retains remaining partial interest
          await dbStore.update('land_ownerships', originalSellerOwnership.id, {
            status: 'partial_transferred',
            share_portion: remainingShare,
            area_decimal: remainingArea,
          });
        }
      }

      // 3. Create NEW Land Ownership Record for Buyer
      newBuyerOwnership = {
        id: generateSequenceId('OWN-MUT', false),
        parcel_id: parcel.id,
        owner_id: buyer?.id,
        owner_name_bn: buyer ? buyer.name_bn : 'ক্রেতা',
        owner_nid: buyer?.nid_no,
        share_portion: sale.proposed_share,
        area_decimal: sale.proposed_area_decimal,
        khatian_ref: newKhatianNo,
        status: 'active',
        acquired_type_bn: `খরিদসূত্রে (নামজারি কেস নং ${mutation.mutation_case_no})`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      await dbStore.create('land_ownerships', newBuyerOwnership);

      // 4. Create New Land Development Tax / Khajna Holding Account for Buyer
      newKhajnaAccount = {
        id: generateSequenceId('KHJ-MUT', false),
        parcel_id: parcel.id,
        owner_id: buyer ? buyer.id : 'unknown',
        holding_no: newHoldingNo,
        fiscal_year: '২০২৫-২০২৬',
        annual_demand_bdt: Math.round(sale.proposed_area_decimal * 50),
        arrears_bdt: 0,
        total_payable_bdt: 0,
        status: 'cleared',
        last_paid_date: new Date().toISOString().split('T')[0],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      await dbStore.create('khajna_accounts', newKhajnaAccount);

      // 5. Update Mutation Application Status to Approved
      await dbStore.update('mutation_applications', mutation.id, {
        current_stage: 'approved',
        status: 'approved',
        order_summary_bn: `বিজ্ঞ আদালতের আদেশ: নামজারি মোকাদ্দমা মঞ্জুর করা হলো। ক্রেতা ${buyer?.name_bn} এর বরাবরে নতুন নামজারি খতিয়ান নং ${newKhatianNo} এবং হোল্ডিং নং ${newHoldingNo} খোলা হলো। পূর্বতন জোতের হিস্যা সমন্বয় করা হলো।`,
        approved_khatian_id: newKhatianRecord.id,
        approved_by_officer_id: user.id,
        approved_at: new Date().toISOString(),
      });

      // 6. Update Sale Application to MUTATION_APPROVED & completed
      await dbStore.update('sale_applications', sale.id, {
        stage: 'MUTATION_APPROVED',
        status: 'completed',
      });

      // 7. Audit Log inside transaction
      await dbStore.logAudit(
        user.id,
        user.name_bn,
        user.role,
        'APPROVE_MUTATION_ORDER_ISSUED',
        'mutation_applications',
        mutation.id,
        req.ip || '127.0.0.1',
        {
          khatian_no: newKhatianNo,
          holding_no: newHoldingNo,
          buyer_id: buyer?.id,
          seller_id: seller?.id,
          area_decimal: sale.proposed_area_decimal,
        }
      );
    });

    // 8. Notifications post-commit
    await NotificationService.notify({
      userId: mutation.applicant_id,
      titleBn: 'অভিনন্দন! আপনার নামজারি আবেদন অনুমোদিত হয়েছে',
      messageBn: `আপনার বরাবরে নতুন নামজারি খতিয়ান নং '${newKhatianNo}' এবং হোল্ডিং নং '${newHoldingNo}' জারি করা হয়েছে। 'আমার জমি' মেন্যুতে আপনার রেকর্ড প্রদর্শিত হচ্ছে।`,
      type: 'success',
      link: `/citizen/my-land`,
    });

    await NotificationService.notify({
      userId: sale.seller_id,
      titleBn: 'নামজারি নিষ্পত্তি ও মালিকানা রেকর্ড সমন্বয়',
      messageBn: `দাগ নং ${parcel.dag_no} এ ক্রেতা ${buyer?.name_bn} এর নামজারি মঞ্জুর হয়েছে। আপনার অবশিষ্ট হিস্যা যথাযথভাবে রেকর্ডভুক্ত আছে।`,
      type: 'info',
      link: `/citizen/my-land`,
    });

    res.json({
      success: true,
      message_bn: `নামজারি আদেশ সফলভাবে সম্পন্ন হয়েছে! নতুন খতিয়ান নং ${newKhatianNo} এবং নতুন হোল্ডিং নং ${newHoldingNo} জারি করা হয়েছে।`,
      new_khatian: newKhatianRecord!,
      new_ownership: newBuyerOwnership!,
      new_holding: newKhajnaAccount!,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message_bn: 'নামজারি অনুমোদনে ত্রুটি হয়েছে', error: err.message });
  }
});

export default router;
