import { Router, Request, Response } from 'express';
import { RiskEngine } from '../services/riskEngine.js';
import { dbStore } from '../db/store.js';

const router = Router();

// Evaluate Land Risk (Check Before You Buy)
router.post('/evaluate', async (req: Request, res: Response) => {
  try {
    const { parcel_id, seller_identifier, proposed_share, proposed_area_decimal, exclude_application_id } = req.body;

    if (!parcel_id) {
      res.status(400).json({
        success: false,
        message_bn: 'দাগ বা জমি নির্বাচন করুন।',
      });
      return;
    }

    const assessment = await RiskEngine.assessParcel({
      parcelId: parcel_id,
      sellerNidOrCitizenId: seller_identifier,
      proposedShare: proposed_share ? Number(proposed_share) : undefined,
      proposedAreaDecimal: proposed_area_decimal ? Number(proposed_area_decimal) : undefined,
      excludeApplicationId: exclude_application_id,
    });

    res.json({
      success: true,
      message_bn: 'ভূমি ঝুঁকি ও রেকর্ড যাচাই প্রতিবেদন প্রস্তুত হয়েছে।',
      data: assessment,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message_bn: 'ঝুঁকি বিশ্লেষণে ত্রুটি হয়েছে।',
      error: err.message,
    });
  }
});

// Retrieve Assessment by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const assessment = await dbStore.findById('risk_assessments', req.params.id);
    if (!assessment) {
      res.status(404).json({ success: false, message_bn: 'ঝুঁকি প্রতিবেদন পাওয়া যায়নি' });
      return;
    }
    res.json({ success: true, data: assessment });
  } catch (err: any) {
    res.status(500).json({ success: false, message_bn: 'প্রতিবেদন লোড করতে ব্যর্থ', error: err.message });
  }
});

export default router;
