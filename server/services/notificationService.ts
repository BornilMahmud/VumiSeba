import { dbStore } from '../db/store.js';
import { NotificationItem } from '../db/types.js';

export interface DispatchNotificationParams {
  userId: string;
  titleBn: string;
  messageBn: string;
  type?: 'info' | 'success' | 'warning' | 'alert';
  link?: string;
  recipientMobile?: string;
  recipientEmail?: string;
}

export class NotificationService {
  public static async notify(params: DispatchNotificationParams): Promise<NotificationItem> {
    const notification: NotificationItem = {
      id: `NOTIF-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      user_id: params.userId,
      title_bn: params.titleBn,
      message_bn: params.messageBn,
      type: params.type || 'info',
      link: params.link,
      is_read: false,
      created_at: new Date().toISOString(),
    };

    await dbStore.create('notifications', notification);

    // Mock SMS / Email Adapter (explicitly simulated)
    if (params.recipientMobile) {
      console.log(`[SMS Gateway Simulated] To: ${params.recipientMobile} | Message: ${params.titleBn} - ${params.messageBn}`);
    }
    if (params.recipientEmail) {
      console.log(`[Email Gateway Simulated] To: ${params.recipientEmail} | Subject: ${params.titleBn}`);
    }

    return notification;
  }
}
