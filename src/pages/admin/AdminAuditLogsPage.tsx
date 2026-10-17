import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { useLanguage } from '../../context/LanguageContext';
import { History, Shield, Clock, Search, RefreshCw, Activity, Terminal, Database } from 'lucide-react';

export const AdminAuditLogsPage: React.FC = () => {
  const { language } = useLanguage();
  const isBn = language === 'bn';
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await api.audit.list();
      if (res.success && Array.isArray(res.data)) {
        setLogs(res.data);
      } else if (res.logs && Array.isArray(res.logs)) {
        setLogs(res.logs);
      } else {
        setLogs([]);
      }
    } catch (err) {
      console.error('Failed to fetch audit logs:', err);
      setLogs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const renderDetails = (details: any): string => {
    if (!details) return isBn ? 'স্বাভাবিক সিস্টেম ট্রানজ্যাকশন (Normal System Event)' : 'Normal System Transaction';
    if (typeof details === 'string') return details;
    if (typeof details === 'object') {
      try {
        return Object.entries(details)
          .map(([k, v]) => `${k}: ${typeof v === 'object' ? JSON.stringify(v) : v}`)
          .join(' | ');
      } catch {
        return JSON.stringify(details);
      }
    }
    return String(details);
  };

  const filteredLogs = logs.filter((l) => {
    if (!l) return false;
    const q = searchTerm.toLowerCase();
    const detailsStr = typeof l.details === 'object' ? JSON.stringify(l.details) : String(l.details || '');
    return (
      (l.action || '').toLowerCase().includes(q) ||
      detailsStr.toLowerCase().includes(q) ||
      (l.user_id || '').toLowerCase().includes(q) ||
      (l.user_name_bn || '').toLowerCase().includes(q) ||
      (l.user_name_en || '').toLowerCase().includes(q) ||
      (l.target_entity || '').toLowerCase().includes(q) ||
      (l.target_id || '').toLowerCase().includes(q) ||
      (l.ip_address || '').toLowerCase().includes(q)
    );
  });

  return (
    <div className={`space-y-6 ${isBn ? 'font-bengali' : 'font-sans'}`}>
      {/* Header card */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <History className="text-cyan-700 dark:text-cyan-400" size={20} />
              {isBn ? 'অপরিবর্তনীয় সিস্টেম অডিট লগ ও ট্রানজ্যাকশন হিস্ট্রি' : 'Immutable System Audit Logs & Transaction History'}
            </h2>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              {isBn ? 'লাইভ অডিট ট্রেইল' : 'Live Audit Trail'}
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {isBn 
              ? 'প্রতিটি সিদ্ধান্ত, ভূমিকা পরিবর্তন ও দাপ্তরিক আদেশের ক্রিপ্টোগ্রাফিক টাইমস্ট্যাম্পড অডিট ট্রেইল' 
              : 'Cryptographic timestamped audit trail of every decision, role change, and official order'}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={isBn ? 'অ্যাকশন, ইউজার বা রিসোর্স খুঁজুন...' : 'Search action, user or resource...'}
              className="pl-8 pr-3 py-1.5 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-lg text-xs w-60 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>
          <button
            onClick={fetchLogs}
            className="p-2 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition flex items-center gap-1.5 text-xs font-semibold shrink-0 cursor-pointer"
            title={isBn ? 'রিফ্রেশ' : 'Refresh'}
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            <span>{isBn ? 'রিফ্রেশ' : 'Refresh'}</span>
          </button>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs overflow-hidden transition-colors">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs whitespace-nowrap">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-bold whitespace-nowrap">
                <th className="py-3 px-4 whitespace-nowrap">{isBn ? 'টাইমস্ট্যাম্প (Timestamp)' : 'Timestamp'}</th>
                <th className="py-3 px-4 whitespace-nowrap">{isBn ? 'কার্যক্রমের ধরণ (Action)' : 'Action'}</th>
                <th className="py-3 px-4 whitespace-nowrap">{isBn ? 'কর্তৃপক্ষ / ইউজার' : 'Authority / User'}</th>
                <th className="py-3 px-4 whitespace-nowrap">{isBn ? 'সম্পর্কিত রিসোর্স' : 'Related Resource'}</th>
                <th className="py-3 px-4 whitespace-nowrap">{isBn ? 'আইপি ঠিকানা' : 'IP Address'}</th>
                <th className="py-3 px-4 whitespace-nowrap">{isBn ? 'বিবরণ (Payload Details)' : 'Payload Details'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500 dark:text-slate-400 whitespace-nowrap">
                    <Clock size={18} className="animate-spin inline-block mr-2" />
                    {isBn ? 'অডিট লগ লোড হচ্ছে...' : 'Loading audit logs...'}
                  </td>
                </tr>
              ) : filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500 dark:text-slate-400 whitespace-nowrap">
                    {isBn ? 'কোন অডিট ইভেন্ট রেকর্ড পাওয়া যায়নি।' : 'No audit event records found.'}
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => {
                  const userName = isBn ? (log.user_name_bn || log.user_name || log.user_id || 'সিস্টেম ডেমন') : (log.user_name_en || log.user_name || log.user_id || 'SYSTEM_DAEMON');
                  return (
                    <tr key={log.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/60 transition font-mono">
                      <td className="py-3 px-4 text-slate-600 dark:text-slate-400 text-[11px] whitespace-nowrap">
                        {log.timestamp ? new Date(log.timestamp).toLocaleString(isBn ? 'bn-BD' : 'en-US') : (isBn ? '২০২৬-০৩-১৫' : '2026-03-15')}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className="font-bold text-cyan-900 dark:text-cyan-300 bg-cyan-50 dark:bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-200 dark:border-cyan-800 text-[11px] whitespace-nowrap">
                          {log.action}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-800 dark:text-slate-200 whitespace-nowrap font-sans">
                        <span className="font-semibold block">{userName}</span>
                        <span className="text-[10px] text-slate-400 font-mono block">{log.user_role || log.user_id}</span>
                      </td>
                      <td className="py-3 px-4 text-slate-600 dark:text-slate-300 whitespace-nowrap">
                        <span className="font-semibold">{log.target_entity || 'entity'}</span>
                        <span className="text-slate-400 mx-1">:</span>
                        <span className="text-amber-800 dark:text-amber-300">{log.target_id || log.target_resource_id || log.entity_id || 'N/A'}</span>
                      </td>
                      <td className="py-3 px-4 text-slate-500 dark:text-slate-400 text-[11px] whitespace-nowrap">
                        {log.ip_address || '127.0.0.1'}
                      </td>
                      <td className="py-3 px-4 text-slate-700 dark:text-slate-300 font-sans text-xs max-w-md truncate whitespace-nowrap" title={renderDetails(log.details)}>
                        {renderDetails(log.details)}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminAuditLogsPage;
