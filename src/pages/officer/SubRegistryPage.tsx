import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { SaleApplication } from '../../types';
import { StatusBadge } from '../../components/common/StatusBadge';
import { DeedDraftModal } from '../../components/common/DeedDraftModal';
import { 
  FileSignature, 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  Printer, 
  Calendar, 
  Stamp, 
  ChevronRight,
  ShieldCheck,
  UserCheck,
  Building,
  Sparkles
} from 'lucide-react';

export default function SubRegistryPage() {
  const { user } = useAuth();
  const [applications, setApplications] = useState<SaleApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState<SaleApplication | null>(null);

  // Registration execution states
  const [regSerialNo, setRegSerialNo] = useState(`REG-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`);
  const [regNotes, setRegNotes] = useState('উভয় পক্ষের জাতীয় পরিচয়পত্র ও উপস্থিতি যাচাইক্রমে দলিল আইন ১৯০৮ অনুযায়ী রেজিস্ট্রি কার্যক্রম সম্পন্ন করা হলো।');
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Modal for viewing printable deed
  const [showDeedModal, setShowDeedModal] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await api.officer.registryQueue();
      if (res.data) {
        setApplications(res.data);
        if (res.data.length > 0 && !selectedApp) {
          setSelectedApp(res.data[0]);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCompleteRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedApp) return;

    if (!window.confirm('আপনি কি নিশ্চিত যে সাব-রেজিস্ট্রার হিসেবে এই দলিলের রেজিস্ট্রি সম্পাদন নিশ্চিত করতে চান? এর সাথে সাথে স্বয়ংক্রিয়ভাবে ই-নামজারি কেস শুরু হবে।')) {
      return;
    }

    setSubmitting(true);
    setMessage(null);

    try {
      const res = await api.sales.completeRegistration(selectedApp.id, regSerialNo, regNotes);
      if (res.error) {
        setMessage({ text: res.error, type: 'error' });
      } else {
        setMessage({ 
          text: `দলিল রেজিস্ট্রি সফলভাবে সম্পন্ন! দলিল নং: ${regSerialNo}। স্বয়ংক্রিয় ই-নামজারি কেস এসি ল্যান্ড কার্যালয়ে প্রেরিত হয়েছে।`, 
          type: 'success' 
        });
        loadData();
      }
    } catch (err) {
      setMessage({ text: 'রেজিস্ট্রি সম্পন্ন করতে সমস্যা হয়েছে', type: 'error' });
    } finally {
      setSubmitting(false);
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
                <Stamp className="w-5 h-5" />
              </span>
              <h1 className="text-2xl font-bold text-slate-900">সাব-রেজিস্ট্রি অফিস এক্সিকিউশন প্যানেল</h1>
            </div>
            <p className="text-sm text-slate-500">
              বিক্রয় আবেদনের দলিল যাচাই, দলিলের খসড়া অনুমোদন, রেজিস্ট্রি সম্পাদন এবং স্বয়ংক্রিয় ই-নামজারি কেস সৃষ্টি।
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-teal-100 text-teal-800 text-xs font-bold rounded-full">
              রেজিস্ট্রির জন্য অপেক্ষমাণ: {applications.length} টি
            </span>
          </div>
        </div>
      </div>

      {message && (
        <div className={`p-4 rounded-xl text-xs font-medium flex items-center gap-2 ${
          message.type === 'success' ? 'bg-emerald-50 border border-emerald-200 text-emerald-800' : 'bg-red-50 border border-red-200 text-red-800'
        }`}>
          {message.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
          {message.text}
        </div>
      )}

      {loading ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center text-slate-400">
          রেজিস্ট্রি তালিকা লোড হচ্ছে...
        </div>
      ) : applications.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
          <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-800 mb-1">কোনো রেজিস্ট্রি অপেক্ষমাণ নেই</h3>
          <p className="text-xs text-slate-500">কেন্দ্রীয় রিভিউ ও খাজনা পরিশোধ সম্পন্ন আবেদন এখানে পৌঁছাবে।</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Applications list */}
          <div className="lg:col-span-1 space-y-3">
            <h2 className="text-xs font-bold text-slate-700 uppercase tracking-wider px-1">
              রেজিস্ট্রি আবেদন তালিকা ({applications.length})
            </h2>
            {applications.map((app) => {
              const isSelected = selectedApp?.id === app.id;
              const appNo = app.application_no || app.applicationNumber || app.id;
              const khatian = app.parcel?.khatian_no || app.khatianNo || '১২০৪';
              const dag = app.parcel?.dag_no || app.dagNo || '৪০৫';
              const buyerId = app.buyer_citizen_id || app.buyerCitizenId || 'BHM-CIT-102938';
              const price = app.agreed_price_bdt || app.agreedPrice || 0;

              return (
                <div
                  key={app.id}
                  onClick={() => setSelectedApp(app)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-slate-900 text-white border-slate-900 shadow-md'
                      : 'bg-white text-slate-800 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                      isSelected ? 'bg-slate-800 text-teal-400' : 'bg-slate-100 text-slate-700'
                    }`}>
                      {appNo}
                    </span>
                    <StatusBadge stage={app.stage} status={app.status} />
                  </div>
                  <div className="text-sm font-semibold mb-1">
                    খতিয়ান #{khatian} • দাগ #{dag}
                  </div>
                  <div className={`text-xs flex items-center justify-between ${isSelected ? 'text-slate-300' : 'text-slate-500'}`}>
                    <span>ক্রেতা: {buyerId}</span>
                    <span>৳ {price.toLocaleString()}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Execution details */}
          {selectedApp && (
            <div className="lg:col-span-2 space-y-6">
              {/* Dossier Header */}
              <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100">
                  <div>
                    <span className="text-xs text-slate-500 block">সাব-রেজিস্ট্রি কেস ডকেট</span>
                    <span className="text-xl font-bold font-mono text-slate-900">
                      {selectedApp.application_no || selectedApp.applicationNumber || selectedApp.id}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setShowDeedModal(true)}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
                    >
                      <Printer className="w-4 h-4" />
                      দলিলের ড্রাফট দেখুন
                    </button>
                    <StatusBadge stage={selectedApp.stage} status={selectedApp.status} />
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs pt-4">
                  <div>
                    <span className="text-slate-500 block">বিক্রেতা (দাতা):</span>
                    <span className="font-semibold text-slate-800 font-mono">
                      {selectedApp.seller?.citizen_id || selectedApp.sellerCitizenId || selectedApp.seller_id}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">ক্রেতা (গ্রহীতা):</span>
                    <span className="font-semibold text-slate-800 font-mono">
                      {selectedApp.buyer_citizen_id || selectedApp.buyerCitizenId || selectedApp.buyer_id}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">জমির বিবরণ:</span>
                    <span className="font-semibold text-slate-800">
                      খতিয়ান {selectedApp.parcel?.khatian_no || selectedApp.khatianNo}, দাগ {selectedApp.parcel?.dag_no || selectedApp.dagNo} ({selectedApp.proposed_area_decimal || selectedApp.proposedArea} শতক)
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">ঘোষিত পণমূল্য:</span>
                    <span className="font-semibold text-slate-800">
                      ৳ {(selectedApp.agreed_price_bdt || selectedApp.agreedPrice || 0).toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Checklist Review */}
                <div className="mt-5 p-4 bg-slate-50 border border-slate-200 rounded-lg text-xs space-y-2">
                  <span className="font-bold text-slate-800 block mb-1">
                    সাব-রেজিস্ট্রি আইনানুগ চেকলিস্ট নিশ্চিতকরণ:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-600">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      বায়োমেট্রিক KYC ও পরিচয়পত্র মেলানো হয়েছে
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      ভূমি উন্নয়ন কর দাখিলা ছাড়পত্র বৈধ
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      ওয়ারিশান বা স্বত্ব দলিলের মূল কপি প্রদর্শিত
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      দাগ ও সীমানা সংক্রান্ত কোনো দেওয়ানি স্থগিতাদেশ নেই
                    </div>
                  </div>
                </div>
              </div>

              {/* Complete Registration Action Form */}
              <form onSubmit={handleCompleteRegistration} className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
                <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                  <Stamp className="w-5 h-5 text-teal-600" />
                  <h3 className="text-base font-bold text-slate-900">
                    রেজিস্ট্রি অনুমোদন ও সম্পাদন রেকর্ড (Record Deed Execution)
                  </h3>
                </div>

                {selectedApp.stage === 'REGISTRATION_COMPLETED' ? (
                  <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg text-xs space-y-1">
                    <div className="font-bold text-emerald-900 text-sm flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      এই দলিলের রেজিস্ট্রেশন সম্পন্ন হয়েছে!
                    </div>
                    <div className="text-emerald-800">
                      রেজিস্ট্রি ক্রমিক নম্বর: <span className="font-mono font-bold">{selectedApp.registrationNumber || 'REG-DONE'}</span>
                    </div>
                    <div className="text-[11px] text-emerald-700">
                      * সংযুক্ত ই-নামজারি কেস স্বয়ংক্রিয়ভাবে সৃষ্টি হয়ে সহকারী কমিশনার (ভূমি) এর ডকেটে জমা হয়েছে।
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          সাব-রেজিস্ট্রি ক্রমিক / বালাম নম্বর (Official Registration Reference)
                        </label>
                        <input
                          type="text"
                          value={regSerialNo}
                          onChange={(e) => setRegSerialNo(e.target.value)}
                          className="w-full text-xs p-2.5 border border-slate-300 rounded-lg font-mono font-bold bg-white focus:ring-2 focus:ring-teal-500 outline-none"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          সম্পাদন তারিখ ও অফিস
                        </label>
                        <input
                          type="text"
                          disabled
                          value="আজকের তারিখ • সাব-রেজিস্ট্রি অফিস, মিরপুর"
                          className="w-full text-xs p-2.5 border border-slate-200 rounded-lg bg-slate-50 text-slate-500 font-medium"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        সাব-রেজিস্ট্রারের আনুষ্ঠানিক মন্তব্য ও আদেশ
                      </label>
                      <textarea
                        rows={3}
                        value={regNotes}
                        onChange={(e) => setRegNotes(e.target.value)}
                        className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                      ></textarea>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                      <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                        রেজিস্ট্রি সম্পন্ন করলে মুহূর্তেই সহকারী কমিশনার (ভূমি) এসি ল্যান্ডের কাছে ই-নামজারি নথি চলে যাবে।
                      </div>

                      <button
                        type="submit"
                        disabled={submitting}
                        className="px-5 py-2.5 bg-teal-800 hover:bg-teal-900 text-white rounded-lg text-xs font-bold flex items-center gap-2 transition-colors shadow-sm disabled:opacity-50"
                      >
                        <Stamp className="w-4 h-4" />
                        {submitting ? 'রেজিস্ট্রি হচ্ছে...' : 'রেজিস্ট্রি সম্পন্ন করুন ও ই-নামজারি শুরু করুন'}
                      </button>
                    </div>
                  </>
                )}
              </form>
            </div>
          )}
        </div>
      )}

      {/* Printable Deed Draft Modal */}
      {selectedApp && showDeedModal && (
        <DeedDraftModal
          application={selectedApp}
          onClose={() => setShowDeedModal(false)}
        />
      )}
    </div>
  );
}
