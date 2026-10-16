import { Router, Response } from 'express';
import { dbStore } from '../db/store.js';
import { requireAuth, requireRole, AuthenticatedRequest } from '../middleware/auth.js';

const router = Router();

router.get('/', requireAuth, requireRole('central_admin'), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const logs = await dbStore.get('audit_logs');
    const sorted = [...logs].reverse();
    res.json({
      success: true,
      count: sorted.length,
      data: sorted,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message_bn: 'অডিট লগ লোড করতে ত্রুটি হয়েছে', error: err.message });
  }
});

export default router;
