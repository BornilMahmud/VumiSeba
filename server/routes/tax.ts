import { Router, Response } from 'express';
import { dbStore } from '../db/store.js';
import { requireAuth, AuthenticatedRequest } from '../middleware/auth.js';
import { KhajnaAccount, TaxPayment, TaxClearance } from '../db/types.js';

const router = Router();

// 1. Get Holding Tax Status for a Parcel
router.get('/holding/:parcelId', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { parcelId } = req.params;
    const user = req.user!;

    const accounts = (await dbStore.find('khajna_accounts', (k: KhajnaAccount) => k.parcel_id === parcelId)) as KhajnaAccount[];
    const account = accounts[0];

    if (!account) {
      res.status(404).json({
        success: false,
        message_bn: 'এই দাগের জন্য কোনো ভূমি উন্নয়ন কর হোল্ডিং রেকর্ড পাওয়া যায়নি।',
      });
      return;
    }

    const clearances = (await dbStore.find('tax_clearances', (c: TaxClearance) => c.parcel_id === parcelId && c.is_cleared)) as TaxClearance[];

    res.json({
      success: true,
      data: {
        account,
        is_cleared: account.status === 'cleared' && account.total_payable_bdt === 0,
        active_clearance: clearances[0] || null,
      },
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message_bn: 'খাজনা ও করের তথ্য লোড করতে সমস্যা হয়েছে।',
      error: err.message,
    });
  }
});

// 2. Process Demo Tax Payment & Issue Clearance Certificate
router.post('/pay', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = req.user!;
    const { holding_id, parcel_id, amount_bdt, payment_method } = req.body;

    const account = (await dbStore.findById('khajna_accounts', holding_id)) as KhajnaAccount | null;
    if (!account) {
      res.status(404).json({
        success: false,
        message_bn: 'হোল্ডিং অ্যাকাউন্ট পাওয়া যায়নি।',
      });
      return;
    }

    const dakhilaNo = `DAK-GLS-${Date.now().toString().slice(-6)}`;
    const trxId = `TXN-DEMO-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;

    // 1. Create Tax Payment Record
    const payment: TaxPayment = {
      id: `PAY-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      holding_id: account.id,
      parcel_id: parcel_id || account.parcel_id,
      user_id: user.id,
      amount_bdt: amount_bdt || account.total_payable_bdt,
      payment_method: payment_method || 'Nagad',
      trx_id: trxId,
      dakhila_no: dakhilaNo,
      payment_status: 'success',
      is_demo_payment: true, // EXPLICITLY LABELED DEMO PAYMENT
      paid_at: new Date().toISOString(),
    };
    await dbStore.create('tax_payments', payment);

    // 2. Update Khajna Account to Cleared
    await dbStore.update('khajna_accounts', account.id, {
      status: 'cleared',
      arrears_bdt: 0,
      total_payable_bdt: 0,
      last_paid_date: new Date().toISOString().split('T')[0],
      updated_at: new Date().toISOString(),
    });

    // 3. Issue Formal Tax Clearance Certificate
    const clearanceCertNo = `LDT-CLR-${Date.now().toString().slice(-6)}`;
    const clearance: TaxClearance = {
      id: `CLR-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      parcel_id: parcel_id || account.parcel_id,
      user_id: user.id,
      holding_no: account.holding_no,
      dakhila_no: dakhilaNo,
      clearance_certificate_no: clearanceCertNo,
      is_cleared: true,
      valid_until: '2026-06-30',
      issued_at: new Date().toISOString(),
    };
    await dbStore.create('tax_clearances', clearance);

    // 4. Audit Log
    await dbStore.logAudit(
      user.id,
      user.name_bn,
      user.role,
      'PAY_LAND_TAX_CLEARANCE',
      'khajna_accounts',
      account.id,
      req.ip || '127.0.0.1',
      { amount_bdt: payment.amount_bdt, dakhila_no: dakhilaNo, certificate_no: clearanceCertNo }
    );

    res.json({
      success: true,
      message_bn: 'ভূমি উন্নয়ন কর সফলভাবে পরিশোধিত হয়েছে (ডেমো লেনদেন)। কর পরিশোধের দাখিলা ও ছাড়পত্র ইস্যু করা হয়েছে।',
      payment,
      clearance,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message_bn: 'ভূমি উন্নয়ন কর পরিশোধে ত্রুটি হয়েছে।',
      error: err.message,
    });
  }
});

// 3. Get Citizen's Dakhilas & Payment History
router.get('/my/history', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = req.user!;
    const payments = await dbStore.find('tax_payments', (p: TaxPayment) => p.user_id === user.id);
    const clearances = await dbStore.find('tax_clearances', (c: TaxClearance) => c.user_id === user.id);

    res.json({
      success: true,
      data: {
        payments,
        clearances,
      },
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message_bn: 'করের ইতিহাস লোড করতে সমস্যা হয়েছে।',
      error: err.message,
    });
  }
});

export default router;
