import React from 'react';
import { useNotifications } from '../../context/NotificationContext';
import { useLanguage } from '../../context/LanguageContext';
import { Bell, CheckCheck, Clock, ArrowRight, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function NotificationsPage() {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const { language } = useLanguage();
  const isBn = language === 'bn';

  const getIcon = (type: string) => {
    const t = (type || 'info').toUpperCase();
    switch (t) {
      case 'SUCCESS':
        return <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />;
      case 'WARNING':
        return <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400" />;
      case 'ALERT':
      case 'ACTION_REQUIRED':
        return <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />;
      default:
        return <Info className="w-5 h-5 text-teal-600 dark:text-teal-400" />;
    }
  };

  const getBadgeStyle = (type: string) => {
    const t = (type || 'info').toUpperCase();
    switch (t) {
      case 'SUCCESS':
        return 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300';
      case 'WARNING':
        return 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300';
      case 'ALERT':
      case 'ACTION_REQUIRED':
        return 'bg-red-50 dark:bg-red-950/40 border-red-200 dark:border-red-800 text-red-800 dark:text-red-300';
      default:
        return 'bg-teal-50 dark:bg-teal-950/40 border-teal-200 dark:border-teal-800 text-teal-800 dark:text-teal-300';
    }
  };

  const getBadgeLabel = (type: string) => {
    const t = (type || 'info').toUpperCase();
    if (isBn) {
      switch (t) {
        case 'SUCCESS':
          return 'সফল';
        case 'WARNING':
          return 'সতর্কতা';
        case 'ALERT':
        case 'ACTION_REQUIRED':
          return 'জরুরি করণীয়';
        default:
          return 'তথ্য';
      }
    }
    switch (t) {
      case 'SUCCESS':
        return 'Success';
      case 'WARNING':
        return 'Warning';
      case 'ALERT':
      case 'ACTION_REQUIRED':
        return 'Action Required';
      default:
        return 'Info';
    }
  };

  const formatTimestamp = (dateString?: string) => {
    if (!dateString) return '';
    try {
      const d = new Date(dateString);
      if (isNaN(d.getTime())) return dateString;
      return d.toLocaleString(isBn ? 'bn-BD' : 'en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="p-1.5 bg-teal-50 dark:bg-teal-950/50 text-teal-700 dark:text-teal-400 rounded-md">
                <Bell className="w-5 h-5" />
              </span>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                {isBn ? 'বিজ্ঞপ্তি ও বার্তা ইনবক্স' : 'Notifications & Messages'}
              </h1>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {isBn
                ? 'ভূমি যাচাই, কর পরিশোধ, দলিল রেজিস্ট্রি এবং ই-নামজারি প্রক্রিয়ার সকল লাইভ আপডেট ও নোটিশ।'
                : 'All live updates, notices, and action alerts for your land verification, taxes, and deeds.'}
            </p>
          </div>
          {unreadCount > 0 && (
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-300 text-xs font-bold rounded-full">
                {isBn ? `${unreadCount} টি নতুন বার্তা` : `${unreadCount} unread`}
              </span>
              <button
                type="button"
                onClick={() => markAllAsRead()}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 hover:underline"
              >
                <CheckCheck className="w-4 h-4" />
                {isBn ? 'সবগুলো পঠিত চিহ্নিত করুন' : 'Mark all as read'}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Notifications List */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        <div className="p-4 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <span className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
            {isBn ? `সকল বিজ্ঞপ্তি (${notifications.length})` : `All Notifications (${notifications.length})`}
          </span>
          <span className="text-xs text-slate-400 dark:text-slate-500">
            {isBn ? 'স্বয়ংক্রিয় সিস্টেম বার্তা ও নোটিশ' : 'Automated system notices and updates'}
          </span>
        </div>

        {notifications.length === 0 ? (
          <div className="p-12 text-center">
            <Bell className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
            <h4 className="text-base font-semibold text-slate-700 dark:text-slate-300">
              {isBn ? 'কোনো বিজ্ঞপ্তি নেই' : 'No notifications'}
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {isBn ? 'আপনার অ্যাকাউন্টে নতুন কোনো নোটিশ আসেনি।' : 'There are no active notices for your account.'}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {notifications.map((item) => {
              const isRead = item.is_read ?? item.read ?? false;
              const title = item.title_bn || item.title || (isBn ? 'বিজ্ঞপ্তি' : 'Notification');
              const message = item.message_bn || item.message || '';
              const linkUrl = item.link || item.relatedLink;
              const timestamp = item.created_at || item.createdAt;

              return (
                <div
                  key={item.id}
                  onClick={() => !isRead && markAsRead(item.id)}
                  className={`p-5 transition-colors cursor-pointer flex items-start gap-4 ${
                    isRead
                      ? 'bg-white dark:bg-slate-900 hover:bg-slate-50/60 dark:hover:bg-slate-800/40'
                      : 'bg-teal-50/30 dark:bg-teal-950/20 hover:bg-teal-50/50 dark:hover:bg-teal-950/30'
                  }`}
                >
                  <div className="mt-0.5 flex-shrink-0">
                    {getIcon(item.type)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                      <h4
                        className={`text-sm ${
                          isRead
                            ? 'font-medium text-slate-800 dark:text-slate-200'
                            : 'font-bold text-slate-950 dark:text-white'
                        }`}
                      >
                        {title}
                      </h4>
                      <div className="flex items-center gap-2">
                        {timestamp && (
                          <span className="text-xs text-slate-400 dark:text-slate-500 flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            {formatTimestamp(timestamp)}
                          </span>
                        )}
                        {!isRead && (
                          <span
                            className="w-2.5 h-2.5 rounded-full bg-teal-600 dark:bg-teal-400 ring-4 ring-teal-100 dark:ring-teal-950"
                            title={isBn ? 'নতুন বার্তা' : 'Unread'}
                          />
                        )}
                      </div>
                    </div>

                    {message && (
                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
                        {message}
                      </p>
                    )}

                    <div className="flex items-center gap-3">
                      <span className={`text-[11px] px-2.5 py-0.5 rounded-full border font-semibold ${getBadgeStyle(item.type)}`}>
                        {getBadgeLabel(item.type)}
                      </span>

                      {linkUrl && (
                        <Link
                          to={linkUrl}
                          className="text-xs font-semibold text-teal-700 dark:text-teal-400 hover:text-teal-800 dark:hover:text-teal-300 flex items-center gap-1 hover:underline"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {isBn ? 'বিস্তারিত দেখুন' : 'View Details'} <ArrowRight className="w-3 h-3" />
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
