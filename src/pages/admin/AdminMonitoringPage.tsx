import React from 'react';
import { Activity, Server, Database, ShieldCheck, CheckCircle2, Cpu } from 'lucide-react';

export const AdminMonitoringPage: React.FC = () => {
  return (
    <div className="space-y-6 font-bengali">
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <Activity className="text-cyan-700" size={20} />
          সিস্টেম স্বাস্থ্য, অবকাঠামো ও ডাটাবেজ মনিটরিং
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          সার্ভার কর্মক্ষমতা, ফায়ারবেস স্টোরেজ সিঙ্ক ও ব্যাকআপ স্থিতি
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <span className="font-bold text-slate-800 text-sm flex items-center gap-2">
              <Server size={16} className="text-cyan-700" />
              এপিআই ব্যাকএন্ড সার্ভার
            </span>
            <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              সক্রিয় (ONLINE)
            </span>
          </div>
          <div className="space-y-1.5 text-xs text-slate-600">
            <p>পোর্ট: <span className="font-mono text-slate-800 font-bold">5000</span></p>
            <p>সার্ভার আর্কিটেকচার: <span className="font-mono text-slate-800">Node.js Express TypeScript</span></p>
            <p>লেটেন্সি: <span className="font-mono text-emerald-700 font-bold">~14ms</span></p>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <span className="font-bold text-slate-800 text-sm flex items-center gap-2">
              <Database size={16} className="text-cyan-700" />
              ডাটাবেজ ও পারসিস্টেন্স
            </span>
            <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              সিঙ্ককৃত (SYNCED)
            </span>
          </div>
          <div className="space-y-1.5 text-xs text-slate-600">
            <p>ক্লাউড ব্যাকএন্ড: <span className="font-mono text-slate-800">Firebase Firestore</span></p>
            <p>স্থানীয় ডেমো ক্যাশ: <span className="font-mono text-slate-800 font-bold">data/db.json</span></p>
            <p>অবস্থা: <span className="font-bold text-emerald-700">অটোনোমাস লোড সচল</span></p>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <span className="font-bold text-slate-800 text-sm flex items-center gap-2">
              <ShieldCheck size={16} className="text-cyan-700" />
              রোল সিকিউরিটি গার্ড
            </span>
            <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              সুরক্ষিত (ENFORCED)
            </span>
          </div>
          <div className="space-y-1.5 text-xs text-slate-600">
            <p>আরবিক রুলস: <span className="font-semibold text-slate-800">সেন্ট্রাল টোকেন যাচাইকৃত</span></p>
            <p>অফিস বাউন্ডারি: <span className="font-semibold text-emerald-700">কঠোরভাবে পৃথকীকৃত</span></p>
            <p>নাগরিক প্রটেকশন: <span className="font-semibold text-slate-800">অফিস কিউ সুরক্ষিত</span></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminMonitoringPage;
