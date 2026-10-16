import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { api } from '../../../services/api';
import { SaleApplication } from '../../../types';
import { StatusBadge } from '../../../components/common/StatusBadge';
import {
  ArrowLeft,
  Stamp,
  User,
  MapPin,
  FileText,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  Clock,
  Printer,
  FileCheck,
  Award,
  Bell,
  Scale
} from 'lucide-react';

export const RegistryApplicationDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [application, setApplication] = useState<SaleApplication | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Scheduling Modal
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [appointmentDate, setAppointmentDate] = useState('');
  const [slotTime, setSlotTime] = useState('সকাল ১১:০০ - ১১:৩০ মি.');
  const [officeLocation, setOfficeLocation] = useState('গুলশান সাব-রেজিস্ট্রি কার্যালয় (বুথ-২, কক্ষ ২০৪)');
  const [checklist, setChecklist] = useState<string[]>([
    'মূল বিএস খতিয়ান ও হালনাগাদ দাখিলা রসিদ',
    'ক্রেতা ও বিক্রেতার মূল জাতীয় পরিচয়পত্র (NID)',
    'সদ্য তোলা পাসপোর্ট সাইজ ছবি (উভয় পক্ষের সত্যায়িত)',
    '১০০ টাকার নন-জুডিশিয়াল স্ট্যাম্পে প্রস্তুতকৃত কবলা দলিল খসড়া',
    'উৎস কর (TDS) ও রেজিস্ট্রেশন ফি পরিশোধের ব্যাংক চালান',
  ]);

  // Completion Modal
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [deedNo, setDeedNo] = useState(`৩৪০৯/${new Date().getFullYear()}`);
  const [volumeNo, setVolumeNo] = useState('বালাম নং ৪২, পৃষ্ঠা ১৮-২৫');
  const [regNotes, setRegNotes] = useState('উভয় পক্ষের উপস্থিতিতে টিপসহি ও দলিলে স্বাক্ষর গ্রহণপূর্বক নিবন্ধন সম্পন্ন করা হলো।');

  const [submitting, setSubmitting] = useState(false);
  const [actionSuccessMessage, setActionSuccessMessage] = useState<string | null>(null);

  const fetchApplication = async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const res = await api.sales.getById(id);
      if (res.success && res.data) {
        setApplication(res.data);
      } else {
        setError(res.message_bn || 'আবেদনটি খুঁজে পাওয়া যায়নি।');
      }
    } catch (err: any) {
      setError(err.message || 'ডাটা লোড করতে সমস্যা হয়েছে।');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplication();
  }, [id]);

  const handleScheduleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!application || !appointmentDate) return;

    setSubmitting(true);
    try {
      const payload = {
        appointment_date: appointmentDate,
        slot_time: slotTime,
        registry_office_name_bn: officeLocation,
        required_documents_bn: checklist,
        notes_bn: 'অ্যাপয়েন্টমেন্ট নির্ধারিত সময়ে মূল দলিল ও জাতীয় পরিচয়পত্রসহ স্বশরীরে উপস্থিত থাকার অনুরোধ করা হলো।',
      };

      const res = await api.sales.scheduleAppointment(application.id, payload);
      if (res.success) {
        setActionSuccessMessage(res.message_bn || 'অ্যাপয়েন্টমেন্ট সফলভাবে নির্ধারিত হয়েছে এবং পক্ষগণকে নোটিফিকেশন প্রেরণ করা হয়েছে।');
        setShowScheduleModal(false);
        await fetchApplication();
      } else {
        alert(res.message_bn || 'অ্যাপয়েন্টমেন্ট সংরক্ষণ ব্যর্থ হয়েছে।');
      }
    } catch (err: any) {
      alert(err.message || 'সার্ভার ত্রুটি।');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCompleteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!application || !deedNo.trim()) return;

    setSubmitting(true);
    try {
      const payload = {
        volume_no: volumeNo.trim(),
        registration_date: new Date().toISOString().split('T')[0],
      };

      const res = await api.sales.completeRegistration(application.id, deedNo.trim(), regNotes.trim(), payload);
      if (res.success) {
        setActionSuccessMessage(res.message_bn || 'দলিল রেজিস্ট্রেশন সফলভাবে সম্পন্ন হয়েছে এবং স্বয়ংক্রিয়ভাবে ই-নামজারি কেস প্রস্তুত হয়েছে।');
        setShowCompleteModal(false);
        await fetchApplication();
      } else {
        alert(res.message_bn || 'রেজিস্ট্রেশন সম্পন্ন করা যায়নি।');
      }
    } catch (err: any) {
      alert(err.message || 'সার্ভার ত্রুটি।');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-slate-500 font-bengali">
        <Clock className="w-8 h-8 animate-spin text-amber-600 mb-3" />
        <p className="text-sm">সাব-রেজিস্ট্রি নথি লোড হচ্ছে...</p>
      </div>
    );
  }

  if (error || !application) {
    return (
      <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-8 text-center max-w-lg mx-auto font-bengali my-8">
        <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto mb-3" />
        <h2 className="text-lg font-bold text-slate-900 mb-2">আবেদন পাওয়া যায়নি</h2>
        <p className="text-sm text-slate-600 mb-4">{error || 'আবেদনের তথ্য বিদ্যমান নেই।'}</p>
        <Link
          to="/office/registry/applications"
          className="inline-flex items-center gap-2 bg-amber-700 text-white px-4 py-2 rounded-lg text-xs font-semibold hover:bg-amber-800 transition"
        >
          <ArrowLeft size={14} />
          তালিকায় ফিরে যান
        </Link>
      </div>
    );
  }

  const isReadyForScheduling =
    application.stage === 'REGISTRATION_READY' ||
    application.stage === 'AC_LAND_APPROVED' ||
    application.stage === 'ac_land_approved';

  const isScheduled =
    application.stage === 'APPOINTMENT_SCHEDULED' ||
    application.stage === 'appointment_scheduled';

  const isCompleted =
    application.stage === 'REGISTRATION_COMPLETED' ||
    application.stage === 'MUTATION_PENDING' ||
    application.stage === 'HEARING_SCHEDULED' ||
    application.stage === 'MUTATION_APPROVED';

  return (
    <div className="space-y-6 font-bengali pb-12">
      {/* Top Breadcrumb & Action bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
        <div className="flex items-center gap-3">
          <Link
            to="/office/registry/applications"
            className="p-2 rounded-lg hover:bg-slate-100 text-slate-600 transition"
            title="তালিকায় ফিরুন"
          >
            <ArrowLeft size={18} />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-amber-900 bg-amber-50 px-2.5 py-0.5 rounded border border-amber-200">
                {application.application_no}
              </span>
              <StatusBadge status={application.stage} />
            </div>
            <p className="text-xs text-slate-500 mt-1">
              উপজেলা: {application.parcel?.upazila_bn} | মৌজা: {application.parcel?.mouza_bn} | দাগ নং: {application.parcel?.dag_no}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isReadyForScheduling && (
            <button
              onClick={() => {
                setShowScheduleModal(true);
                setAppointmentDate(new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0]);
              }}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-amber-700 text-white rounded-lg text-xs font-bold hover:bg-amber-800 transition shadow-xs"
            >
              <Calendar size={15} />
              অ্যাপয়েন্টমেন্ট শিডিউল করুন
            </button>
          )}

          {isScheduled && (
            <button
              onClick={() => setShowCompleteModal(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-700 text-white rounded-lg text-xs font-bold hover:bg-emerald-800 transition shadow-xs"
            >
              <Stamp size={15} />
              রেজিস্ট্রেশন সম্পন্ন রেকর্ড করুন
            </button>
          )}

          <button
            onClick={() => window.print()}
            className="flex items-center gap-1 px-3 py-2 border border-slate-300 text-slate-700 rounded-lg text-xs font-semibold hover:bg-slate-50 transition"
          >
            <Printer size={14} />
            মুদ্রণ
          </button>
        </div>
      </div>

      {actionSuccessMessage && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-sm flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={18} className="text-emerald-700" />
            <span className="font-semibold">{actionSuccessMessage}</span>
          </div>
          <button
            onClick={() => setActionSuccessMessage(null)}
            className="text-xs text-emerald-800 underline hover:text-emerald-950"
          >
            বন্ধ করুন
          </button>
        </div>
      )}

      {/* Appointment Information Card if Scheduled */}
      {application.appointment_details && (
        <div className="p-4 rounded-xl bg-blue-50/80 border border-blue-200 text-blue-950 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <Calendar className="w-5 h-5 text-blue-700 shrink-0 mt-0.5" />
            <div className="text-xs">
              <p className="font-bold text-sm">
                নির্ধারিত রেজিস্ট্রেশন অ্যাপয়েন্টমেন্ট: {application.appointment_details.date} ({application.appointment_details.time || 'সকাল ১১:০০ মি.'})
              </p>
              <p className="mt-0.5 text-blue-800">
                স্থান: {application.appointment_details.office_name_bn || 'গুলশান সাব-রেজিস্ট্রার কার্যালয়, কক্ষ ২০৪'} | টোকেন নম্বর: <strong className="font-mono">{application.appointment_details.token_no || 'TOK-8812'}</strong>
              </p>
              <p className="mt-1 text-[11px] text-blue-700">
                ✓ ক্রেতা ও বিক্রেতা উভয় নাগরিকের ইন-অ্যাপ ড্যাশবোর্ডে অ্যাপয়েন্টমেন্ট নোটিশ ও তলব তালিকা প্রেরণ করা হয়েছে।
              </p>
            </div>
          </div>
          {isScheduled && (
            <button
              onClick={() => setShowCompleteModal(true)}
              className="px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold shrink-0 flex items-center gap-1.5 shadow-2xs"
            >
              <Stamp size={14} />
              রেজিস্ট্রেশন বালামভুক্ত করুন
            </button>
          )}
        </div>
      )}

      {/* Registration Completed Card */}
      {isCompleted && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-950 flex items-start gap-3">
          <Stamp className="w-6 h-6 text-emerald-700 shrink-0 mt-0.5" />
          <div className="text-xs">
            <p className="font-bold text-sm">
              দলিল রেজিস্ট্রেশন সম্পন্ন হয়েছে (দলিল নং {application.registration_details?.deed_no || '৩৪০৯/২০২৬'})
            </p>
            <p className="text-emerald-800 mt-1">
              সম্পাদনের তারিখ: {application.registration_details?.registration_date || '২০২৬-০৩-২০'} | বালাম নম্বর: {application.registration_details?.volume_no || 'বালাম নং ৪২, পৃষ্ঠা ১৮-২৫'}
            </p>
            <p className="text-[11px] text-emerald-900 font-semibold mt-1 flex items-center gap-1">
              <CheckCircle2 size={13} className="text-emerald-700" />
              দলিল নিষ্পত্তির সাথে সাথে স্বয়ংক্রিয়ভাবে সহকারী কমিশনার (ভূমি) এর ই-নামজারি রাজস্ব আদালতে কেস দাখিল হয়েছে।
            </p>
          </div>
        </div>
      )}

      {/* Grid: 2 Column */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 span) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Parties Card */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-5">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-3 mb-4">
              <User size={16} className="text-amber-700" />
              দলিল সম্পাদনকারী পক্ষগণের পরিচয়
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-bold uppercase text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                  সম্পাদনকারী / বিক্রেতা (Seller)
                </span>
                <h4 className="font-bold text-slate-900 mt-2 text-sm">{application.seller?.name_bn || 'মো: রফিকুল ইসলাম'}</h4>
                <div className="mt-2 space-y-1 text-slate-600">
                  <p><span className="text-slate-400">সিটিজেন আইডি:</span> <span className="font-mono font-semibold text-slate-800">{application.seller_citizen_id || 'BHM-CIT-104928'}</span></p>
                  <p><span className="text-slate-400">জাতীয় পরিচয়পত্র:</span> {application.seller?.nid || '১৯৮৫০৯১৯৭৪৫৬১০০০১'}</p>
                </div>
              </div>

              <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-bold uppercase text-amber-700 bg-amber-100 px-2 py-0.5 rounded">
                  গ্রহীতা / ক্রেতা (Buyer)
                </span>
                <h4 className="font-bold text-slate-900 mt-2 text-sm">{application.buyer?.name_bn || 'মিসেস তাসলিমা বেগম'}</h4>
                <div className="mt-2 space-y-1 text-slate-600">
                  <p><span className="text-slate-400">সিটিজেন আইডি:</span> <span className="font-mono font-semibold text-slate-800">{application.buyer_citizen_id || 'BHM-CIT-928471'}</span></p>
                  <p><span className="text-slate-400">জাতীয় পরিচয়পত্র:</span> {application.buyer?.nid || '১৯৯২০৯১৯৮৪১২৩০০৯'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Transfer Deed Schedule */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-5">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-3 mb-4">
              <MapPin size={16} className="text-amber-700" />
              কবলা দলিলের জমি তপশিল ও রেজিস্ট্রি চৌহদ্দি
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs mb-4">
              <div className="p-2.5 rounded bg-slate-50 border border-slate-100">
                <span className="text-slate-400 block text-[11px]">উপজেলা ও জেলা</span>
                <span className="font-semibold text-slate-800">{application.parcel?.upazila_bn}, {application.parcel?.district_bn}</span>
              </div>
              <div className="p-2.5 rounded bg-slate-50 border border-slate-100">
                <span className="text-slate-400 block text-[11px]">মৌজা ও জেএল</span>
                <span className="font-semibold text-slate-800">{application.parcel?.mouza_bn}, জেএল-{application.parcel?.jl_no}</span>
              </div>
              <div className="p-2.5 rounded bg-slate-50 border border-slate-100">
                <span className="text-slate-400 block text-[11px]">খতিয়ান নম্বর</span>
                <span className="font-mono font-bold text-slate-900">{application.parcel?.khatian_no}</span>
              </div>
              <div className="p-2.5 rounded bg-slate-50 border border-slate-100">
                <span className="text-slate-400 block text-[11px]">দাগ নম্বর</span>
                <span className="font-mono font-bold text-slate-900">{application.parcel?.dag_no}</span>
              </div>
            </div>

            <div className="p-3.5 rounded-lg bg-amber-50/70 border border-amber-200 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <span className="text-slate-500 block text-[11px]">বিক্রিত জমির পরিমাণ:</span>
                  <span className="font-bold text-amber-950 text-sm">{application.proposed_area_decimal} শতাংশ (হিস্যা: {application.proposed_share})</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">জমির শ্রেণী ও দাগে মোট জমি:</span>
                  <span className="font-bold text-slate-800">{application.parcel?.land_type_bn || 'নাল'} (মোট {application.parcel?.total_area_decimal || '৩৩.০০'} শতক)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Preparatory Demo Deed Draft */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <FileText size={16} className="text-amber-700" />
                কবলা দলিল খসড়া পূর্বাবলোকন (Draft Deed)
              </h3>
              <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                ডেমো দলিল খসড়া (Preparatory Demo Document)
              </span>
            </div>

            <div className="p-4 bg-amber-50/30 border border-dashed border-amber-300 rounded-lg text-xs text-slate-700 leading-relaxed font-serif">
              <div className="text-center font-bold text-sm text-slate-900 mb-3 border-b border-amber-200 pb-2">
                সফ-কবলা বিক্রয় দলিলপত্র খসড়া (নমুনা)
              </div>
              <p className="mb-2">
                পরম করুণাময় মহান সৃষ্টিকর্তার নাম স্মরণ করিয়া আমি বিক্রেতা <strong>{application.seller?.name_bn || 'মো: রফিকুল ইসলাম'}</strong>, এনআইডি: {application.seller?.nid || '১৯৮৫০৯১৯৭৪৫৬১০০০১'}, অত্র সাফ-কবলা দলিল সম্পাদনপূর্বক ক্রেতা <strong>{application.buyer?.name_bn || 'মিসেস তাসলিমা বেগম'}</strong> বরাবরে জমি হস্তান্তর করিলাম।
              </p>
              <p className="mb-2">
                <strong>তপশিল:</strong> জেলা: {application.parcel?.district_bn}, থানা/উপজেলা: {application.parcel?.upazila_bn}, মৌজা: {application.parcel?.mouza_bn}, খতিয়ান নং: {application.parcel?.khatian_no}, দাগ নং: {application.parcel?.dag_no}, হস্তান্তরিত জমি: {application.proposed_area_decimal} শতাংশ।
              </p>
              <div className="mt-4 pt-3 border-t border-amber-200 flex justify-between text-[11px] text-slate-500 font-sans italic">
                <span>* এটি সফটওয়্যার জেনারেটেড প্রস্তুতিমূলক খসড়া দলিল। সাব-রেজিস্ট্রারের দাপ্তরিক নিবন্ধন ব্যতীত এটি বৈধ স্বত্ব প্রমাণক নয়।</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (1 span) */}
        <div className="space-y-6">
          {/* Scheduling & Registration Status */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-5">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-3 mb-4">
              <Stamp size={16} className="text-amber-700" />
              নিবন্ধন কার্যালয়ের অগ্রগতি
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">বর্তমান পর্যায়:</span>
                <span className="font-bold text-slate-800"><StatusBadge status={application.stage} /></span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">ইউনিয়ন ও এসি ল্যান্ড:</span>
                <span className="font-semibold text-emerald-700">✓ ছাড়পত্র প্রাপ্ত</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">রেজিস্ট্রি অফিস:</span>
                <span className="font-semibold text-slate-800">গুলশান সাব-রেজিস্ট্রি অফিস</span>
              </div>
            </div>
          </div>

          {/* Required Checklist for Citizens */}
          <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 text-xs text-slate-600">
            <h4 className="font-bold text-slate-800 flex items-center gap-1.5 mb-2">
              <FileCheck size={14} className="text-amber-700" />
              রেজিস্ট্রেশনের প্রয়োজনীয় নথিপত্র
            </h4>
            <ul className="list-disc pl-4 space-y-1.5 text-slate-600 text-[11px]">
              <li>বিএস খতিয়ান ও হাল সনের ভূমি উন্নয়ন কর পরিশোধিত দাখিলা।</li>
              <li>ক্রেতা ও বিক্রেতার জাতীয় পরিচয়পত্রের মূল কপি ও সত্যায়িত ফটোকপি।</li>
              <li>উভয় পক্ষের সদ্য তোলা পাসপোর্ট সাইজ রঙিন ছবি।</li>
              <li>সরকারি স্ট্যাম্প শুল্ক ও রেজিস্ট্রেশন ফি জমার রসিদ।</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Schedule Appointment Modal */}
      {showScheduleModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 font-bengali">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
              <Calendar className="w-5 h-5 text-amber-600" />
              রেজিস্ট্রেশন অ্যাপয়েন্টমেন্ট নির্ধারণ ও নোটিফিকেশন জারী
            </h3>

            <form onSubmit={handleScheduleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 block">অ্যাপয়েন্টমেন্টের তারিখ *</label>
                  <input
                    type="date"
                    value={appointmentDate}
                    onChange={(e) => setAppointmentDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500 text-xs"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 block">সময়সূচী (Time Slot) *</label>
                  <select
                    value={slotTime}
                    onChange={(e) => setSlotTime(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500 text-xs"
                  >
                    <option value="সকাল ১০:০০ - ১০:৩০ মি.">সকাল ১০:০০ - ১০:৩০ মি.</option>
                    <option value="সকাল ১০:৩০ - ১১:০০ মি.">সকাল ১০:৩০ - ১১:০০ মি.</option>
                    <option value="সকাল ১১:০০ - ১১:৩০ মি.">সকাল ১১:০০ - ১১:৩০ মি.</option>
                    <option value="সকাল ১১:৩০ - ১২:০০ মি.">সকাল ১১:৩০ - ১২:০০ মি.</option>
                    <option value="দুপুর ১২:০০ - ১২:৩০ মি.">দুপুর ১২:০০ - ১২:৩০ মি.</option>
                    <option value="দুপুর ১২:৩০ - ০১:০০ মি.">দুপুর ১২:৩০ - ০১:০০ মি.</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 block">রেজিস্ট্রি অফিস ও কক্ষ নম্বর</label>
                <input
                  type="text"
                  value={officeLocation}
                  onChange={(e) => setOfficeLocation(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500 text-xs"
                  required
                />
              </div>

              <div className="space-y-2 p-3 bg-amber-50/60 rounded-lg border border-amber-200">
                <label className="font-bold text-amber-950 block">উভয় পক্ষকে হাজিরা তলব ও দলিল চেকলিস্ট:</label>
                <div className="space-y-1.5 text-[11px] text-slate-700">
                  {checklist.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <CheckCircle2 size={13} className="text-emerald-700 shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowScheduleModal(false)}
                  className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 font-semibold hover:bg-slate-50"
                  disabled={submitting}
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 bg-amber-700 hover:bg-amber-800 text-white font-bold rounded-lg transition flex items-center gap-1.5"
                >
                  {submitting ? 'সংরক্ষণ হচ্ছে...' : 'অ্যাপয়েন্টমেন্ট চূড়ান্ত করুন'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Complete Registration Modal */}
      {showCompleteModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 font-bengali">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
              <Stamp className="w-5 h-5 text-emerald-600" />
              দলিল সম্পাদন ও বালামভুক্তি সম্পন্নকরণ
            </h3>

            <form onSubmit={handleCompleteSubmit} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-700 block">রেজিস্ট্রিকৃত কবলা দলিল নম্বর *</label>
                <input
                  type="text"
                  value={deedNo}
                  onChange={(e) => setDeedNo(e.target.value)}
                  placeholder="যেমন: ৩৪০৯/২০২৬"
                  className="w-full p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono text-xs font-bold"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 block">বালাম ভলিউম ও পৃষ্ঠা নম্বর</label>
                <input
                  type="text"
                  value={volumeNo}
                  onChange={(e) => setVolumeNo(e.target.value)}
                  placeholder="যেমন: বালাম নং ৪২, পৃষ্ঠা ১৮-২৫"
                  className="w-full p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500 text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 block">সাব-রেজিস্ট্রারের দাপ্তরিক মন্তব্য</label>
                <textarea
                  rows={3}
                  value={regNotes}
                  onChange={(e) => setRegNotes(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500 text-xs"
                />
              </div>

              <div className="p-3 bg-purple-50 rounded-lg border border-purple-200 text-[11px] text-purple-900">
                <strong>স্বয়ংক্রিয় ইন্টার-অফিস প্রসেসিং:</strong> নিবন্ধন রেকর্ড নিশ্চিতকরণের সাথে সাথে সিস্টেমে স্বয়ংক্রিয়ভাবে এসি ল্যান্ড অফিসের জন্য ই-নামজারি কেস তৈরি হবে এবং ক্রেতা ও বিক্রেতার ফোনে নোটিফিকেশন পৌঁছে যাবে।
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowCompleteModal(false)}
                  className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 font-semibold hover:bg-slate-50"
                  disabled={submitting}
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-lg transition flex items-center gap-1.5"
                >
                  {submitting ? 'সংরক্ষণ হচ্ছে...' : 'নিবন্ধন সম্পন্ন ও নামজারিতে প্রেরণ'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RegistryApplicationDetailPage;
