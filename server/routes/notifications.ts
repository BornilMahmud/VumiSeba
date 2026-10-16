import { Router, Response } from 'express';
import { dbStore } from '../db/store.js';
import { requireAuth, AuthenticatedRequest } from '../middleware/auth.js';
import { NotificationItem } from '../db/types.js';

const router = Router();

router.get('/', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = req.user!;
    const notifs = (await dbStore.find('notifications', (n: NotificationItem) => n.user_id === user.id)) as NotificationItem[];
    const sorted = notifs.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    res.json({
      success: true,
      unread_count: sorted.filter((n) => !n.is_read).length,
      data: sorted,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message_bn: 'বিজ্ঞপ্তি লোড করতে ত্রুটি হয়েছে', error: err.message });
  }
});

router.put('/:id/read', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const updated = await dbStore.update('notifications', req.params.id, { is_read: true });
    res.json({ success: true, data: updated });
  } catch (err: any) {
    res.status(500).json({ success: false, message_bn: 'আপডেট ত্রুটি', error: err.message });
  }
});

router.put('/read-all', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = req.user!;
    const notifs = (await dbStore.find('notifications', (n: NotificationItem) => n.user_id === user.id)) as NotificationItem[];
    for (const n of notifs) {
      if (!n.is_read) {
        await dbStore.update('notifications', n.id, { is_read: true });
      }
    }
    res.json({ success: true, message_bn: 'সকল বিজ্ঞপ্তি পঠিত চিহ্নিত করা হয়েছে।' });
  } catch (err: any) {
    res.status(500).json({ success: false, message_bn: 'আপডেট ত্রুটি', error: err.message });
  }
});

export default router;
