import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { History, Shield, Clock, Search, RefreshCw, Activity } from 'lucide-react';

export const AdminAuditLogsPage: React.FC = () => {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await api.audit.list();
      if (res.success && res.data) {
        setLogs(res.data);
      } else if (res.logs) {
        setLogs(res.logs);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const filteredLogs = logs.filter((l) => {
    const q = searchTerm.toLowerCase();
    return (
      (l.action || '').toLowerCase().includes(q) ||
      (l.details || '').toLowerCase().includes(q) ||
      (l.user_id || '').toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6 font-bengali">
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <History className="text-cyan-700" size={20} />
            অপরিবর্তনীয় সিস্টেম অডিট লগ ও ট্রানজ্যাকশন হিস্ট্রি
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            প্রতিটি সিদ্ধান্ত, ভূমিকা পরিবর্তন ও দাপ্তরিক আদেশের ক্রিপ্টোগ্রাফিক টাইমস্ট্যাম্পড অডিট ট্রেইল
          </p>
        </div>

        <button
          onClick={fetchLogs}
          className="p-1.5 border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-50 flex items-center gap-1.5 text-xs font-semibold"
          title="রিফ্রেশ"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          রিফ্রেশ
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
                <th className="py-3 px-4">টাইমস্ট্যাম্প (Timestamp)</th>
                <th className="py-3 px-4">কার্যক্রমের ধরণ (Action)</th>
                <th className="py-3 px-4">কর্তৃপক্ষ / ইউজার আইডি</th>
                <th className="py-3 px-4">সম্পর্কিত রিসোর্স</th>
                <th className="py-3 px-4">বিবরণ ও আইপি তথ্য</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-500 font-bengali">
                    <Clock size={16} className="animate-spin inline-block mr-2" />
                    অডিট লগ লোড হচ্ছে...
                  </td>
                </tr>
              ) : filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-500 font-bengali">
                    কোন অডিট ইভেন্ট রেকর্ড পাওয়া যায়নি।
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/70 transition">
                    <td className="py-3 px-4 text-slate-500 text-[11px]">
                      {log.timestamp ? new Date(log.timestamp).toLocaleString('bn-BD') : '২০২৬-০৩-১৫'}
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-bold text-cyan-900 bg-cyan-50 px-2 py-0.5 rounded border border-cyan-200 text-[11px]">
                        {log.action}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-700">
                      {log.user_id || 'SYSTEM_DAEMON'}
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      {log.target_resource_id || log.entity_id || 'N/A'}
                    </td>
                    <td className="py-3 px-4 font-bengali text-slate-700">
                      {log.details || 'স্বাভাবিক সিস্টেম ট্রানজ্যাকশন'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminAuditLogsPage;
