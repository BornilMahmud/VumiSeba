import { Router, Response } from 'express';
import { dbStore } from '../db/store.js';
import { requireAuth, requireRole, AuthenticatedRequest } from '../middleware/auth.js';

const router = Router();

router.get(
  '/',
  requireAuth,
  (req: AuthenticatedRequest, res: Response, next) => {
    const role = (req.user?.role || '').toLowerCase();
    if (role === 'central_admin' || role === 'admin') {
      return next();
    }
    return res.status(403).json({
      success: false,
      message_bn: 'এই কার্যক্রম পরিচালনার জন্য কেন্দ্রীয় প্রশাসনিক অনুমোদন প্রয়োজন।',
      error: 'Forbidden: Insufficient permissions',
    });
  },
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const logs = (await dbStore.get('audit_logs')) || [];
      const sorted = Array.isArray(logs) ? [...logs].reverse() : [];
      res.json({
        success: true,
        count: sorted.length,
        data: sorted,
      });
    } catch (err: any) {
      res.status(500).json({ success: false, message_bn: 'অডিট লগ লোড করতে ত্রুটি হয়েছে', error: err.message });
    }
  }
);

export default router;
