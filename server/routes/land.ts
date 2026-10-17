import { Router, Request, Response } from 'express';
import { dbStore } from '../db/store.js';
import { AuthenticatedRequest, requireAuth } from '../middleware/auth.js';
import { LandParcel, LandOwnership, KhatianRecord, LandDocument } from '../db/types.js';

const router = Router();

function normalizeNumerals(str?: string): string[] {
  if (!str) return [];
  const bnToEnMap: Record<string, string> = {
    '০': '0', '১': '1', '২': '2', '৩': '3', '৪': '4',
    '৫': '5', '৬': '6', '৭': '7', '৮': '8', '৯': '9',
  };
  const enToBnMap: Record<string, string> = {
    '0': '০', '1': '১', '2': '২', '3': '৩', '4': '৪',
    '5': '৫', '6': '৬', '7': '৭', '8': '৮', '9': '৯',
  };

  const asEn = str.split('').map((c) => bnToEnMap[c] || c).join('');
  const asBn = str.split('').map((c) => enToBnMap[c] || c).join('');
  return Array.from(new Set([str, asEn, asBn]));
}

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

const enrichParcel = (p: LandParcel | undefined | null) => {
  if (!p) return null;
  const bnToEnMap: Record<string, string> = {
    '০': '0', '১': '1', '২': '2', '৩': '3', '৪': '4',
    '৫': '5', '৬': '6', '৭': '7', '৮': '8', '৯': '9',
  };
  const toEn = (v: any) => v !== undefined && v !== null ? String(v).replace(/[০-৯]/g, (d) => bnToEnMap[d] || d) : '';
  return {
    ...p,
    mouza_bn: p.mouza,
    mouza_en: MOUZA_MAP_EN[p.mouza] || p.mouza,
    upazila_bn: p.upazila,
    upazila_en: UPAZILA_MAP_EN[p.upazila] || p.upazila,
    district_bn: p.district,
    district_en: DISTRICT_MAP_EN[p.district] || p.district,
    dag_no_en: toEn(p.dag_no),
    khatian_no_en: toEn(p.khatian_no),
  };
};

// 1. Search Land Records (Public & Authenticated)
router.get('/search', async (req: Request, res: Response) => {
  try {
    const { district, upazila, mouza, jl_no, khatian_no, dag_no, query } = req.query as Record<string, string>;

    const parcels = (await dbStore.get('land_parcels')) as LandParcel[];
    const ownerships = (await dbStore.get('land_ownerships')) as LandOwnership[];

    let results = parcels;

    if (district) {
      results = results.filter((p) => p.district.includes(district));
    }
    if (upazila) {
      results = results.filter((p) => p.upazila.includes(upazila));
    }
    if (mouza) {
      results = results.filter((p) => p.mouza.includes(mouza));
    }
    if (jl_no) {
      const jlVariants = normalizeNumerals(jl_no);
      results = results.filter((p) => jlVariants.some((v) => p.jl_no === v || p.jl_no.includes(v)));
    }
    if (khatian_no) {
      const khatianVariants = normalizeNumerals(khatian_no);
      results = results.filter((p) => khatianVariants.some((v) => p.khatian_no === v || p.khatian_no.includes(v)));
    }
    if (dag_no) {
      const dagVariants = normalizeNumerals(dag_no);
      results = results.filter((p) => dagVariants.some((v) => p.dag_no === v || p.dag_no.includes(v)));
    }

    if (query) {
      const q = query.trim().toLowerCase();
      const qVariants = normalizeNumerals(q);
      results = results.filter(
        (p) =>
          qVariants.some((v) => p.dag_no.includes(v) || p.khatian_no.includes(v)) ||
          p.mouza.toLowerCase().includes(q) ||
          p.parcel_number.toLowerCase().includes(q) ||
          p.address_description_bn.toLowerCase().includes(q)
      );
    }

    // Attach sanitized ownership summaries
    const sanitizedResults = results.map((parcel) => {
      const parcelOwners = ownerships.filter((o) => o.parcel_id === parcel.id && o.status === 'active');
      return {
        ...parcel,
        owners_count: parcelOwners.length,
        recorded_owners_bn: parcelOwners.map((o) => `${o.owner_name_bn} (${o.share_portion * 100}%)`).join(', '),
        data_source: 'জাতীয় ডিজিটাল ভূমি রেকর্ডরুম ও খতিয়ান আর্কাইভ',
        is_demo_data: true,
      };
    });

    res.json({
      success: true,
      count: sanitizedResults.length,
      data: sanitizedResults,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message_bn: 'ভূমি অনুসন্ধান প্রক্রিয়াকরণে ত্রুটি হয়েছে।',
      error: err.message,
    });
  }
});

// 2. Citizen's Owned Land & Holdings (Authenticated)
router.get('/my/holdings', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = req.user!;
    const myOwnerships = (await dbStore.find(
      'land_ownerships',
      (o: LandOwnership) => o.owner_id === user.id && (o.status === 'active' || o.status === 'partial_transferred')
    )) as LandOwnership[];

    const parcels = (await dbStore.get('land_parcels')) as LandParcel[];
    const khajnaAccounts = await dbStore.get('khajna_accounts');

    const result = myOwnerships.map((own) => {
      const parcel = enrichParcel(parcels.find((p) => p.id === own.parcel_id));
      const khajna = khajnaAccounts.find((k) => k.parcel_id === own.parcel_id && k.owner_id === user.id);
      return {
        ownership: own,
        parcel: parcel || null,
        khajna: khajna || null,
      };
    });

    res.json({
      success: true,
      count: result.length,
      data: result,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message_bn: 'আমার জমির তালিকা লোড করা সম্ভব হয়নি।',
      error: err.message,
    });
  }
});

// 3. Get Parcel Full Details by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const parcelId = req.params.id;
    const parcel = (await dbStore.findById('land_parcels', parcelId)) as LandParcel | null;

    if (!parcel) {
      res.status(404).json({
        success: false,
        message_bn: 'নির্দিষ্ট ভূমি রেকর্ড বা দাগের তথ্য পাওয়া যায়নি।',
      });
      return;
    }

    const ownerships = (await dbStore.find(
      'land_ownerships',
      (o: LandOwnership) => o.parcel_id === parcelId && (o.status === 'active' || o.status === 'partial_transferred')
    )) as LandOwnership[];
    const khatians = (await dbStore.find('khatian_records', (k: KhatianRecord) => k.mouza === parcel.mouza && k.khatian_no === parcel.khatian_no)) as KhatianRecord[];
    const documents = (await dbStore.find('land_documents', (d: LandDocument) => d.parcel_id === parcelId)) as LandDocument[];
    const khajnaAccounts = await dbStore.find('khajna_accounts', (k) => k.parcel_id === parcelId);

    res.json({
      success: true,
      data: {
        parcel,
        ownerships,
        khatian: khatians[0] || null,
        documents,
        khajna: khajnaAccounts[0] || null,
        disclaimers: {
          data_nature: 'নমুনা ডেটা (Hackathon Demo)',
          legal_notice_bn: 'এই পোর্টালের তথ্যসমূহ ডেমো ডেটাসেটের ভিত্তিতে প্রদর্শিত। কোনো সরকারি প্রত্যয়িত দলিলের বিকল্প হিসেবে এটি প্রযোজ্য নয়।',
        },
      },
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message_bn: 'ভূমি বিস্তারিত তথ্য লোড করতে সমস্যা হয়েছে।',
      error: err.message,
    });
  }
});

export default router;
