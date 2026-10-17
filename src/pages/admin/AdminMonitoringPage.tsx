import React from 'react';
import { Activity, Server, Database, ShieldCheck } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export const AdminMonitoringPage: React.FC = () => {
  const { language } = useLanguage();
  const isBn = language === 'bn';

  return (
    <div className={`space-y-6 ${isBn ? 'font-bengali' : 'font-sans'}`}>
      <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs transition-colors">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Activity className="text-cyan-700 dark:text-cyan-400" size={20} />
          {isBn ? 'সিস্টেম স্বাস্থ্য, অবকাঠামো ও ডাটাবেজ মনিটরিং' : 'System Health, Infrastructure & Database Monitoring'}
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          {isBn 
            ? 'সার্ভার কর্মক্ষমতা, ফায়ারবেস স্টোরেজ সিঙ্ক ও ব্যাকআপ স্থিতি' 
            : 'Server performance, Firebase storage sync & backup health'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 space-y-3 transition-colors">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
            <span className="font-bold text-slate-800 dark:text-slate-200 text-sm flex items-center gap-2">
              <Server size={16} className="text-cyan-700 dark:text-cyan-400" />
              {isBn ? 'এপিআই ব্যাকএন্ড সার্ভার' : 'API Backend Server'}
            </span>
            <span className="text-[10px] font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
              {isBn ? 'সক্রিয় (ONLINE)' : 'ONLINE'}
            </span>
          </div>
          <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
            <p>{isBn ? 'পোর্ট:' : 'Port:'} <span className="font-mono text-slate-800 dark:text-slate-200 font-bold">5000</span></p>
            <p>{isBn ? 'সার্ভার আর্কিটেকচার:' : 'Architecture:'} <span className="font-mono text-slate-800 dark:text-slate-200">Node.js Express TypeScript</span></p>
            <p>{isBn ? 'লেটেন্সি:' : 'Latency:'} <span className="font-mono text-emerald-700 dark:text-emerald-400 font-bold">~14ms</span></p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 space-y-3 transition-colors">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
            <span className="font-bold text-slate-800 dark:text-slate-200 text-sm flex items-center gap-2">
              <Database size={16} className="text-cyan-700 dark:text-cyan-400" />
              {isBn ? 'ডাটাবেজ ও পারসিস্টেন্স' : 'Database & Persistence'}
            </span>
            <span className="text-[10px] font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
              {isBn ? 'সিঙ্ককৃত (SYNCED)' : 'SYNCED'}
            </span>
          </div>
          <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
            <p>{isBn ? 'ক্লাউড ব্যাকএন্ড:' : 'Cloud Backend:'} <span className="font-mono text-slate-800 dark:text-slate-200">Firebase Firestore</span></p>
            <p>{isBn ? 'স্থানীয় ডেমো ক্যাশ:' : 'Local Demo Cache:'} <span className="font-mono text-slate-800 dark:text-slate-200 font-bold">data/db.json</span></p>
            <p>{isBn ? 'অবস্থা:' : 'State:'} <span className="font-bold text-emerald-700 dark:text-emerald-400">{isBn ? 'অটোনোমাস লোড সচল' : 'Autonomous Active'}</span></p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 space-y-3 transition-colors">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
            <span className="font-bold text-slate-800 dark:text-slate-200 text-sm flex items-center gap-2">
              <ShieldCheck size={16} className="text-cyan-700 dark:text-cyan-400" />
              {isBn ? 'রোল সিকিউরিটি গার্ড' : 'Role Security Guard'}
            </span>
            <span className="text-[10px] font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
              {isBn ? 'সুরক্ষিত (ENFORCED)' : 'ENFORCED'}
            </span>
          </div>
          <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
            <p>{isBn ? 'আরবিক রুলস:' : 'RBAC Rules:'} <span className="font-semibold text-slate-800 dark:text-slate-200">{isBn ? 'সেন্ট্রাল টোকেন যাচাইকৃত' : 'Central Token Verified'}</span></p>
            <p>{isBn ? 'অফিস বাউন্ডারি:' : 'Office Boundary:'} <span className="font-semibold text-emerald-700 dark:text-emerald-400">{isBn ? 'কঠোরভাবে পৃথকীকৃত' : 'Strictly Segregated'}</span></p>
            <p>{isBn ? 'নাগরিক প্রটেকশন:' : 'Citizen Protection:'} <span className="font-semibold text-slate-800 dark:text-slate-200">{isBn ? 'অফিস কিউ সুরক্ষিত' : 'Office Queues Secured'}</span></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminMonitoringPage;
