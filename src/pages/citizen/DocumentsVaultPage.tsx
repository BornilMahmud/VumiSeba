import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  FolderLock, 
  FileText, 
  Download, 
  Eye, 
  Upload, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  ShieldCheck,
  FileCheck
} from 'lucide-react';

interface MockDoc {
  id: string;
  title: string;
  category: 'খতিয়ান' | 'দাখিলা' | 'দলিল' | 'নাগরিক প্রমাণপত্র';
  date: string;
  size: string;
  verified: boolean;
}

export default function DocumentsVaultPage() {
  const { user } = useAuth();
  const [activeFilter, setActiveFilter] = useState('ALL');
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const initialDocs: MockDoc[] = [
    {
      id: 'DOC-01',
      title: 'বিএস খতিয়ান নং ৪২০ (মৌজা: মিরপুর)',
      category: 'খতিয়ান',
      date: '২০২৪-০১-১০',
      size: '১.২ মেগাবাইট',
      verified: true
    },
    {
      id: 'DOC-02',
      title: 'ভূমি উন্নয়ন কর দাখিলা (২০২৩-২৪ অর্থবছর)',
      category: 'দাখিলা',
      date: '২০২৪-০২-১২',
      size: '৭৫০ কিলোবাইট',
      verified: true
    },
    {
      id: 'DOC-03',
      title: 'সাফ-কবলা বিক্রয় দলিল খসড়া (অ্যাপ নং SA-2024-001)',
      category: 'দলিল',
      date: '২০২৪-০৩-১৫',
      size: '২.১ মেগাবাইট',
      verified: true
    },
    {
      id: 'DOC-04',
      title: 'জাতীয় পরিচয়পত্র ও বায়োমেট্রিক KYC প্রত্যয়ন',
      category: 'নাগরিক প্রমাণপত্র',
      date: '২০২৩-১২-০৫',
      size: '৯৮০ কিলোবাইট',
      verified: true
    }
  ];

  const [docs, setDocs] = useState<MockDoc[]>(initialDocs);

  const filteredDocs = activeFilter === 'ALL' 
    ? docs 
    : docs.filter(d => d.category === activeFilter);

  const handleMockUpload = (e: React.FormEvent) => {
    e.preventDefault();
    setUploadSuccess(true);
    setTimeout(() => setUploadSuccess(false), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="p-1.5 bg-teal-50 text-teal-700 rounded-md">
                <FolderLock className="w-5 h-5" />
              </span>
              <h1 className="text-2xl font-bold text-slate-900">ডিজিটাল নথিপত্র ভল্ট</h1>
            </div>
            <p className="text-sm text-slate-500">
              আপনার জমির খতিয়ান, দাখিলা, দলিলের কপি এবং নাগরিক পরিচয়পত্র নিরাপদে সংরক্ষিত ও যাচাইকৃত।
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-800 rounded-lg text-xs font-semibold border border-emerald-200">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              ইনক্রিপ্টেড ডিজিটাল স্টোরেজ
            </span>
          </div>
        </div>
      </div>

      {/* Upload & Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {['ALL', 'খতিয়ান', 'দাখিলা', 'দলিল', 'নাগরিক প্রমাণপত্র'].map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeFilter === cat
                  ? 'bg-slate-900 text-white'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {cat === 'ALL' ? 'সকল নথি' : cat}
            </button>
          ))}
        </div>

        {/* Upload Button Trigger */}
        <label className="inline-flex items-center gap-2 px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-lg text-xs font-bold cursor-pointer transition-colors shadow-sm">
          <Upload className="w-4 h-4" />
          নতুন নথি আপলোড করুন
          <input type="file" className="hidden" onChange={handleMockUpload} />
        </label>
      </div>

      {uploadSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl flex items-center gap-3 text-xs animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <div>
            <span className="font-bold">নথি সফলভাবে আপলোড হয়েছে!</span> ডেমো ভল্টে সংরক্ষণ করা হলো।
          </div>
        </div>
      )}

      {/* Document Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredDocs.map((doc) => (
          <div
            key={doc.id}
            className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:border-slate-300 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-slate-100 text-slate-700 rounded-lg">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-2 py-0.5 rounded">
                      {doc.category}
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 mt-1">
                      {doc.title}
                    </h3>
                  </div>
                </div>
                {doc.verified && (
                  <span className="text-emerald-600" title="যাচাইকৃত নথি">
                    <FileCheck className="w-4 h-4" />
                  </span>
                )}
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs text-slate-500 py-3 border-y border-slate-100 my-2">
                <div>
                  <span className="text-slate-400 block">সংরক্ষণ তারিখ:</span>
                  <span className="font-medium text-slate-700">{doc.date}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">ফাইলের আকার:</span>
                  <span className="font-medium text-slate-700">{doc.size}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-[11px] text-slate-400 flex items-center gap-1 font-mono">
                ID: {doc.id}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => alert(`নথি প্রাকদর্শন: ${doc.title}`)}
                  className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-xs font-semibold flex items-center gap-1"
                >
                  <Eye className="w-3.5 h-3.5" />
                  দেখুন
                </button>
                <button
                  onClick={() => alert(`ডাউনলোড শুরু হচ্ছে: ${doc.title}`)}
                  className="px-2.5 py-1 bg-teal-50 hover:bg-teal-100 text-teal-800 rounded text-xs font-semibold flex items-center gap-1"
                >
                  <Download className="w-3.5 h-3.5" />
                  ডাউনলোড
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Institutional Disclaimer */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs text-slate-500 leading-relaxed flex items-start gap-2.5">
        <AlertCircle className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-slate-700">গুরুত্বপূর্ণ সতর্কবার্তা:</span> এই ডিজিটাল ভল্টে প্রদর্শিত বা আপলোডকৃত নথিসমূহ ডেমো প্ল্যাটফর্মের সিমুলেশন উদ্দেশ্যে ব্যবহৃত। এটি কোনো সরকারি রেকর্ড রুমের সাব-রেজিস্ট্রি প্রত্যয়নপত্র বা সার্টিফাইড কপির সরাসরি বিকল্প নয়।
        </div>
      </div>
    </div>
  );
}
