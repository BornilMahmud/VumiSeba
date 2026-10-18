import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Printer, AlertTriangle, FileText } from 'lucide-react';
import { SaleApplication } from '../../types';

interface DeedDraftModalProps {
  application: SaleApplication;
  onClose: () => void;
}

export const DeedDraftModal: React.FC<DeedDraftModalProps> = ({ application, onClose }) => {
  const parcel = application.parcel;
  const seller = application.seller;
  const buyer = application.buyer;

  useEffect(() => {
    document.body.classList.add('printing-deed-modal-active');
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.classList.remove('printing-deed-modal-active');
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  const handlePrint = () => {
    window.print();
  };

  const modalNode = (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto deed-modal-backdrop">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-4xl w-full border border-slate-300 dark:border-slate-700 max-h-[90vh] flex flex-col transition-colors deed-modal-dialog">
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/80 rounded-t-2xl no-print">
          <div className="flex items-center gap-2">
            <FileText className="text-teal-600 dark:text-teal-400" size={20} />
            <h3 className="font-semibold text-slate-900 dark:text-white text-lg">
              প্রস্তুতিমূলক খসড়া বিক্রয় দলিল ও নিবন্ধন প্যাকেট
            </h3>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-1.5 rounded-lg text-sm font-medium transition shadow-sm cursor-pointer"
            >
              <Printer size={16} />
              প্রিন্ট করুন
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Printable Content Body */}
        <div id="printable-deed" className="p-8 overflow-y-auto font-bengali text-slate-800 leading-relaxed text-sm">
          {/* Statutory Hackathon Disclaimer */}
          <div className="border-4 border-dashed border-red-500 bg-red-50 p-4 rounded-md mb-6 text-center">
            <div className="flex items-center justify-center gap-2 text-red-700 font-bold text-base mb-1">
              <AlertTriangle size={20} />
              <span>DEMO DRAFT — NOT AN OFFICIAL GOVERNMENT DOCUMENT</span>
            </div>
            <p className="text-red-600 text-xs font-semibold">
              এটি একটি নমুনা খসড়া দলিল। এতে কোনো আসল সরকারি স্ট্যাম্প, নিবন্ধন সিলমোহর বা সাব-রেজিস্ট্রারের স্বাক্ষর অন্তর্ভুক্ত নয়।
              শুধুমাত্র হ্যাকাথন ও সেবা যাচাই ডেমো প্রদর্শনের জন্য প্রণীত।
            </p>
          </div>

          <div className="text-center mb-6 border-b pb-4">
            <span className="text-xs font-bold text-slate-600 uppercase tracking-widest block">
              বাংলাদেশ ফরম নং ১৬০১ (সংশোধিত নমুনা)
            </span>
            <h1 className="text-2xl font-bold text-slate-900 mt-1">
              অস্থাবর/স্থাবর সম্পত্তি হস্তান্তর সংক্রান্ত সাফ-কবলা দলিল (খসড়া)
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              রেজিস্ট্রেশন অফিস: গুলশান সাব-রেজিস্ট্রি অফিস, জেলা: ঢাকা
            </p>
            <p className="text-xs font-mono text-slate-600 mt-0.5">
              আবেদন নম্বর: {application.application_no} | তারিখ: {new Date().toLocaleDateString('bn-BD')}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-6 mb-6 bg-slate-50 p-4 rounded border border-slate-200">
            <div>
              <h4 className="font-bold text-slate-900 border-b pb-1 mb-2">১ম পক্ষ (বিক্রেতা / দাতা):</h4>
              <p><strong>নাম:</strong> {seller?.name_bn || 'মোঃ রফিকুল ইসলাম'}</p>
              <p><strong>সিটিজেন আইডি:</strong> {seller?.citizen_id || 'BHM-CIT-882194'}</p>
              <p><strong>এনআইডি:</strong> {seller?.nid_no || '১৯৮৫২৬৯১০২৯৩৮৪৭৫৬'}</p>
              <p><strong>মোবাইল:</strong> {seller?.mobile || '০১৭১১০০০০০১'}</p>
            </div>
            <div>
              <h4 className="font-bold text-slate-900 border-b pb-1 mb-2">২য় পক্ষ (ক্রেতা / গ্রহীতা):</h4>
              <p><strong>নাম:</strong> {buyer?.name_bn || 'ফারহান আহমেদ'}</p>
              <p><strong>সিটিজেন আইডি:</strong> {buyer?.citizen_id || application.buyer_citizen_id}</p>
              <p><strong>এনআইডি:</strong> {buyer?.nid_no || '১৯৯২২৬৯৪০১৮২৭৪৬১৯'}</p>
              <p><strong>মোবাইল:</strong> {buyer?.mobile || '০১৮১১০00002'}</p>
            </div>
          </div>

          <div className="mb-6">
            <h4 className="font-bold text-slate-900 border-b pb-1 mb-2">হস্তান্তরিত সম্পত্তির তফশিল:</h4>
            <table className="w-full border border-slate-300 text-xs text-left mb-2">
              <thead className="bg-slate-100 font-semibold text-slate-700">
                <tr>
                  <th className="border p-2">জেলা ও উপজেলা</th>
                  <th className="border p-2">মৌজা ও জে.এল</th>
                  <th className="border p-2">খতিয়ান নম্বর</th>
                  <th className="border p-2">দাগ নম্বর</th>
                  <th className="border p-2">জমির শ্রেণি</th>
                  <th className="border p-2">বিক্রিত পরিমাণ</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border p-2">{parcel?.district || 'ঢাকা'}, {parcel?.upazila || 'গুলশান'}</td>
                  <td className="border p-2">{parcel?.mouza || 'বাড্ডা'}, জে.এল: {parcel?.jl_no || '২৮'}</td>
                  <td className="border p-2">{parcel?.khatian_no || '১২০৪'} ({parcel?.khatian_type || 'RS'})</td>
                  <td className="border p-2 font-bold">{parcel?.dag_no || '৪০৫'}</td>
                  <td className="border p-2">{parcel?.land_class || 'বাস্তু'}</td>
                  <td className="border p-2 font-bold text-gov-blue">{application.proposed_area_decimal} শতক</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="mb-6">
            <h4 className="font-bold text-slate-900 border-b pb-1 mb-2">পণমূল্য ও পরিশোধ শর্ত:</h4>
            <p className="mb-1">
              মোট নির্ধারিত বিক্রয়মূল্য <strong>৳ {application.agreed_price_bdt.toLocaleString('bn-BD')}</strong> (কথায়: আঠারো লক্ষ টাকা মাত্র)। 
              উক্ত সমুদয় পণমূল্য ১ম পক্ষ ২য় পক্ষের নিকট হইতে বুঝিয়া পাইয়াছেন।
            </p>
          </div>

          <div className="mb-6">
            <h4 className="font-bold text-slate-900 border-b pb-1 mb-2">চৌহদ্দি বিবরণ (Boundaries):</h4>
            <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-3 rounded border">
              <div><strong>উত্তর:</strong> সরকারি পাকা রাস্তা ও ড্রেন</div>
              <div><strong>দক্ষিণ:</strong> দাগ ৪০৬ এর মোজাম্মেল হকের অবশিষ্টাংশ</div>
              <div><strong>পূর্ব:</strong> সহ-শরিক শফিকুল ইসলামের ভিটা</div>
              <div><strong>পশ্চিম:</strong> বাড্ডা বাজার সংযোগ সড়ক</div>
            </div>
          </div>

          <div className="border-t pt-4 mt-8">
            <div className="flex justify-between items-end pt-12">
              <div className="text-center">
                <div className="border-t border-slate-400 w-40 pt-1 font-semibold text-xs">
                  ১ম পক্ষ (বিক্রেতার স্বাক্ষর/টিপ)
                </div>
              </div>
              <div className="text-center">
                <div className="border-t border-slate-400 w-40 pt-1 font-semibold text-xs">
                  ২য় পক্ষ (ক্রেতার স্বাক্ষর/টিপ)
                </div>
              </div>
              <div className="text-center">
                <div className="border-t border-slate-400 w-48 pt-1 font-semibold text-xs text-slate-600">
                  দলিল লেখক ও সনাক্তকারী
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/80 rounded-b-2xl text-right no-print">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-sm font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-600 transition cursor-pointer"
          >
            বন্ধ করুন
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(modalNode, document.body);
};

export default DeedDraftModal;
