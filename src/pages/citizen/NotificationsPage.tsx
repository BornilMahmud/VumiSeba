import React from 'react';
import { useNotifications } from '../../context/NotificationContext';
import { Bell, CheckCheck, Clock, ArrowRight, AlertTriangle, CheckCircle, Info, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function NotificationsPage() {
  const { notifications, unreadCount, markAsRead } = useNotifications();

  const getIcon = (type: string) => {
    switch (type) {
      case 'SUCCESS':
        return <CheckCircle className="w-5 h-5 text-emerald-600" />;
      case 'WARNING':
        return <AlertTriangle className="w-5 h-5 text-amber-600" />;
      case 'ACTION_REQUIRED':
        return <AlertTriangle className="w-5 h-5 text-red-600" />;
      default:
        return <Info className="w-5 h-5 text-teal-600" />;
    }
  };

  const getBadgeStyle = (type: string) => {
    switch (type) {
      case 'SUCCESS':
        return 'bg-emerald-50 border-emerald-200 text-emerald-800';
      case 'WARNING':
        return 'bg-amber-50 border-amber-200 text-amber-800';
      case 'ACTION_REQUIRED':
        return 'bg-red-50 border-red-200 text-red-800';
      default:
        return 'bg-teal-50 border-teal-200 text-teal-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="p-1.5 bg-teal-50 text-teal-700 rounded-md">
                <Bell className="w-5 h-5" />
              </span>
              <h1 className="text-2xl font-bold text-slate-900">বিজ্ঞপ্তি ও বার্তা ইনবক্স</h1>
            </div>
            <p className="text-sm text-slate-500">
              ভূমি যাচাই, কর পরিশোধ, দলিল রেজিস্ট্রি এবং ই-নামজারি প্রক্রিয়ার সকল লাইভ আপডেট ও শুনানির নোটিশ।
            </p>
          </div>
          {unreadCount > 0 && (
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-full">
                {unreadCount} টি নতুন বার্তা
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Notifications List */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">
            সকল বিজ্ঞপ্তি ({notifications.length})
          </span>
          <span className="text-xs text-slate-400">
            স্বয়ংক্রিয় সিস্টেম বার্তা ও নোটিশ
          </span>
        </div>

        {notifications.length === 0 ? (
          <div className="p-12 text-center">
            <Bell className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h4 className="text-base font-semibold text-slate-700">কোনো বিজ্ঞপ্তি নেই</h4>
            <p className="text-xs text-slate-500 mt-1">আপনার অ্যাকাউন্টে নতুন কোনো নোটিশ আসেনি।</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {notifications.map((item) => (
              <div
                key={item.id}
                onClick={() => !item.read && markAsRead(item.id)}
                className={`p-5 transition-colors cursor-pointer flex items-start gap-4 ${
                  item.read ? 'bg-white hover:bg-slate-50/60' : 'bg-teal-50/30 hover:bg-teal-50/50'
                }`}
              >
                <div className="mt-0.5 flex-shrink-0">
                  {getIcon(item.type)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                    <h4 className={`text-sm font-bold ${item.read ? 'text-slate-800' : 'text-slate-950 font-extrabold'}`}>
                      {item.title}
                    </h4>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-400 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {item.createdAt}
                      </span>
                      {!item.read && (
                        <span className="w-2 h-2 rounded-full bg-teal-600"></span>
                      )}
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed mb-3">
                    {item.message}
                  </p>

                  <div className="flex items-center gap-3">
                    <span className={`text-[11px] px-2.5 py-0.5 rounded-full border font-semibold ${getBadgeStyle(item.type)}`}>
                      {item.type}
                    </span>

                    {item.relatedLink && (
                      <Link
                        to={item.relatedLink}
                        className="text-xs font-semibold text-teal-700 hover:text-teal-800 flex items-center gap-1 hover:underline"
                        onClick={(e) => e.stopPropagation()}
                      >
                        বিস্তারিত দেখুন <ArrowRight className="w-3 h-3" />
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
