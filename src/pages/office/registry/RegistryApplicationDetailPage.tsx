import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { api } from '../../../services/api';
import { SaleApplication } from '../../../types';
import { StatusBadge } from '../../../components/common/StatusBadge';
import { useLanguage } from '../../../context/LanguageContext';
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
import { ApplicationTimeline } from '../../../components/common/ApplicationTimeline';
import {
  formatName,
  formatMouza,
  formatPlot,
  formatKhatian,
  formatDistrict,
  formatUpazila,
  formatArea,
  formatLandClass,
  formatDigits,
} from '../../../utils/bilingual';

export const RegistryApplicationDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const isBn = language === 'bn';

  const [application, setApplication] = useState<SaleApplication | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Scheduling Modal
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [appointmentDate, setAppointmentDate] = useState('');
  const [slotTime, setSlotTime] = useState(isBn ? 'সকাল ১১:০০ - ১১:৩০ মি.' : '11:00 AM - 11:30 AM');
  const [officeLocation, setOfficeLocation] = useState(
    isBn ? 'গুলশান সাব-রেজিস্ট্রি কার্যালয় (বুথ-২, কক্ষ ২০৪)' : 'Gulshan Sub-Registry Office (Booth-2, Room 204)'
  );
  const [checklist, setChecklist] = useState<string[]>([
    isBn ? 'মূল বিএস খতিয়ান ও হালনাগাদ দাখিলা রসিদ' : 'Original BS Khatian and up-to-date Land Tax (Dakhila) receipt',
    isBn ? 'ক্রেতা ও বিক্রেতার মূল জাতীয় পরিচয়পত্র (NID)' : 'Original National ID (NID) of Buyer and Seller',
    isBn ? 'সদ্য তোলা পাসপোর্ট সাইজ ছবি (উভয় পক্ষের সত্যায়িত)' : 'Recent passport-size photographs of both parties',
    isBn ? '১০০ টাকার নন-জুডিশিয়াল স্ট্যাম্পে প্রস্তুতকৃত কবলা দলিল খসড়া' : 'Deed draft printed on statutory non-judicial stamps',
    isBn ? 'উৎস কর (TDS) ও রেজিস্ট্রেশন ফি পরিশোধের ব্যাংক চালান' : 'Bank challan receipt for TDS and statutory registration fees',
  ]);

  // Completion Modal
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [deedNo, setDeedNo] = useState(isBn ? `৩৪০৯/${new Date().getFullYear()}` : `3409/${new Date().getFullYear()}`);
  const [volumeNo, setVolumeNo] = useState(isBn ? 'বালাম নং ৪২, পৃষ্ঠা ১৮-২৫' : 'Volume 42, Pages 18-25');
  const [regNotes, setRegNotes] = useState(
    isBn
      ? 'উভয় পক্ষের উপস্থিতিতে টিপসহি ও দলিলে স্বাক্ষর গ্রহণপূর্বক নিবন্ধন সম্পন্ন করা হলো।'
      : 'Deed registered upon biometric fingerprint verification and signature of both parties.'
  );

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
        setError(res.message_bn || (isBn ? 'আবেদনটি খুঁজে পাওয়া যায়নি।' : 'Application record not found.'));
      }
    } catch (err: any) {
      setError(err.message || (isBn ? 'ডাটা লোড করতে সমস্যা হয়েছে।' : 'Failed to load data.'));
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
        notes_bn: isBn
          ? 'অ্যাপয়েন্টমেন্ট নির্ধারিত সময়ে মূল দলিল ও জাতীয় পরিচয়পত্রসহ স্বশরীরে উপস্থিত থাকার অনুরোধ করা হলো।'
          : 'Please appear in person with original deed and NID at the scheduled time slot.',
      };

      const res = await api.sales.scheduleAppointment(application.id, payload);
      if (res.success) {
        setActionSuccessMessage(
          isBn
            ? (res.message_bn || 'অ্যাপয়েন্টমেন্ট সফলভাবে নির্ধারিত হয়েছে এবং পক্ষগণকে নোটিফিকেশন প্রেরণ করা হয়েছে।')
            : 'Appointment scheduled and notifications sent to parties.'
        );
        setShowScheduleModal(false);
        await fetchApplication();
      } else {
        alert(res.message_bn || (isBn ? 'অ্যাপয়েন্টমেন্ট সংরক্ষণ ব্যর্থ হয়েছে।' : 'Failed to save appointment.'));
      }
    } catch (err: any) {
      alert(err.message || (isBn ? 'সার্ভার ত্রুটি।' : 'Server error.'));
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
        setActionSuccessMessage(
          isBn
            ? (res.message_bn || 'দলিল রেজিস্ট্রেশন সফলভাবে সম্পন্ন হয়েছে এবং স্বয়ংক্রিয়ভাবে ই-নামজারি কেস প্রস্তুত হয়েছে।')
            : 'Deed registration completed and e-Mutation case docketed automatically.'
        );
        setShowCompleteModal(false);
        await fetchApplication();
      } else {
        alert(res.message_bn || (isBn ? 'রেজিস্ট্রেশন সম্পন্ন করা যায়নি।' : 'Failed to complete registration.'));
      }
    } catch (err: any) {
      alert(err.message || (isBn ? 'সার্ভার ত্রুটি।' : 'Server error.'));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className={`flex flex-col items-center justify-center min-h-[400px] text-slate-500 ${isBn ? 'font-bengali' : 'font-sans'}`}>
        <Clock className="w-8 h-8 animate-spin text-amber-600 mb-3" />
        <p className="text-sm">{isBn ? 'সাব-রেজিস্ট্রি নথি লোড হচ্ছে...' : 'Loading registry case file...'}</p>
      </div>
    );
  }

  if (error || !application) {
    return (
      <div className={`bg-white dark:bg-slate-900 rounded-xl shadow-xs border border-slate-200 dark:border-slate-800 p-8 text-center max-w-lg mx-auto ${isBn ? 'font-bengali' : 'font-sans'} my-8`}>
        <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto mb-3" />
        <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
          {isBn ? 'আবেদন পাওয়া যায়নি' : 'Application Not Found'}
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">{error || (isBn ? 'আবেদনের তথ্য বিদ্যমান নেই।' : 'No records exist for this application.')}</p>
        <Link
          to="/office/registry/dashboard"
          className="inline-flex items-center gap-2 bg-amber-700 text-white px-4 py-2 rounded-lg text-xs font-semibold hover:bg-amber-800 transition"
        >
          <ArrowLeft size={14} />
          {isBn ? 'তালিকায় ফিরে যান' : 'Back to Registry List'}
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
    <div className={`space-y-6 ${isBn ? 'font-bengali' : 'font-sans'} pb-12`}>
      {/* Top Breadcrumb & Action bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs">
        <div className="flex items-center gap-3">
          <Link
            to="/office/registry/dashboard"
            className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 transition"
            title={isBn ? 'তালিকায় ফিরুন' : 'Back to list'}
          >
            <ArrowLeft size={18} />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-amber-900 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 px-2.5 py-0.5 rounded border border-amber-200 dark:border-amber-800">
                {application.application_no}
              </span>
              <StatusBadge status={application.stage} />
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {isBn ? 'উপজেলা:' : 'Upazila:'} {formatUpazila(application.parcel?.upazila, isBn)} | {isBn ? 'মৌজা:' : 'Mouza:'} {formatMouza(application.parcel, isBn)} | {formatPlot(application.parcel?.dag_no, isBn)}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {isReadyForScheduling && (
            <button
              onClick={() => {
                setShowScheduleModal(true);
                setAppointmentDate(new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0]);
              }}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-amber-700 hover:bg-amber-800 text-white rounded-lg text-xs font-bold transition shadow-xs cursor-pointer"
            >
              <Calendar size={15} />
              {isBn ? 'অ্যাপয়েন্টমেন্ট শিডিউল করুন' : 'Schedule Appointment'}
            </button>
          )}

          {isScheduled && (
            <button
              onClick={() => setShowCompleteModal(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold transition shadow-xs cursor-pointer"
            >
              <Stamp size={15} />
              {isBn ? 'রেজিস্ট্রেশন সম্পন্ন রেকর্ড করুন' : 'Record Deed Execution'}
            </button>
          )}

          <button
            onClick={() => window.print()}
            className="flex items-center gap-1 px-3 py-2 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition cursor-pointer"
          >
            <Printer size={14} />
            {isBn ? 'মুদ্রণ' : 'Print'}
          </button>
        </div>
      </div>

      {actionSuccessMessage && (
        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-300 text-sm flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={18} className="text-emerald-700 dark:text-emerald-400" />
            <span className="font-semibold">{actionSuccessMessage}</span>
          </div>
          <button
            onClick={() => setActionSuccessMessage(null)}
            className="text-xs text-emerald-800 dark:text-emerald-300 underline hover:text-emerald-950 cursor-pointer"
          >
            {isBn ? 'বন্ধ করুন' : 'Dismiss'}
          </button>
        </div>
      )}

      {/* Appointment Information Card if Scheduled */}
      {application.appointment_details && (
        <div className="p-4 rounded-xl bg-blue-50/80 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-blue-950 dark:text-blue-300 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <Calendar className="w-5 h-5 text-blue-700 dark:text-blue-400 shrink-0 mt-0.5" />
            <div className="text-xs">
              <p className="font-bold text-sm">
                {isBn ? 'নির্ধারিত রেজিস্ট্রেশন অ্যাপয়েন্টমেন্ট:' : 'Scheduled Registration Appointment:'} {application.appointment_details.date} ({application.appointment_details.time || (isBn ? 'সকাল ১১:০০ মি.' : '11:00 AM')})
              </p>
              <p className="mt-0.5 text-blue-800 dark:text-blue-300">
                {isBn ? 'স্থান:' : 'Location:'} {isBn ? (application.appointment_details.office_name_bn || 'গুলশান সাব-রেজিস্ট্রার কার্যালয়, কক্ষ ২০৪') : 'Gulshan Sub-Registry Office, Room 204'} | {isBn ? 'টোকেন নম্বর:' : 'Token No:'} <strong className="font-mono">{application.appointment_details.token_no || 'TOK-8812'}</strong>
              </p>
              <p className="mt-1 text-[11px] text-blue-700 dark:text-blue-400">
                {isBn
                  ? '✓ ক্রেতা ও বিক্রেতা উভয় নাগরিকের ইন-অ্যাপ ড্যাশবোর্ডে অ্যাপয়েন্টমেন্ট নোটিশ ও তলব তালিকা প্রেরণ করা হয়েছে।'
                  : '✓ Appointment notice and required checklist dispatched to buyer and seller in-app dashboard.'}
              </p>
            </div>
          </div>
          {isScheduled && (
            <button
              onClick={() => setShowCompleteModal(true)}
              className="px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold shrink-0 flex items-center gap-1.5 shadow-2xs cursor-pointer"
            >
              <Stamp size={14} />
              {isBn ? 'রেজিস্ট্রেশন বালামভুক্ত করুন' : 'Record in Register Volume'}
            </button>
          )}
        </div>
      )}

      {/* Registration Completed Card */}
      {isCompleted && (
        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-emerald-950 dark:text-emerald-300 flex items-start gap-3">
          <Stamp className="w-6 h-6 text-emerald-700 dark:text-emerald-400 shrink-0 mt-0.5" />
          <div className="text-xs">
            <p className="font-bold text-sm">
              {isBn
                ? `দলিল রেজিস্ট্রেশন সম্পন্ন হয়েছে (দলিল নং ${application.registration_details?.deed_no || '৩৪০৯/২০২৬'})`
                : `Deed Registration Completed (Deed No. ${application.registration_details?.deed_no || '3409/2026'})`}
            </p>
            <p className="text-emerald-800 dark:text-emerald-300 mt-1">
              {isBn ? 'সম্পাদনের তারিখ:' : 'Registration Date:'} {application.registration_details?.registration_date || '2026-03-20'} | {isBn ? 'বালাম নম্বর:' : 'Volume:'} {isBn ? (application.registration_details?.volume_no || 'বালাম নং ৪২, পৃষ্ঠা ১৮-২৫') : (application.registration_details?.volume_no || 'Volume 42, Pages 18-25')}
            </p>
            <p className="text-[11px] text-emerald-900 dark:text-emerald-400 font-semibold mt-1 flex items-center gap-1">
              <CheckCircle2 size={13} className="text-emerald-700 dark:text-emerald-400" />
              {isBn
                ? 'দলিল নিষ্পত্তির সাথে সাথে স্বয়ংক্রিয়ভাবে সহকারী কমিশনার (ভূমি) এর ই-নামজারি রাজস্ব আদালতে কেস দাখিল হয়েছে।'
                : 'Upon deed execution, an e-Mutation case has been automatically docketed in the AC Land Court.'}
            </p>
          </div>
        </div>
      )}

      {/* Grid: 2 Column */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 span) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Parties Card */}
          <div className="bg-white dark:bg-[#0c1427] rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-5">
            <h3 className="text-sm font-bold text-slate-800 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3 mb-4">
              <User size={16} className="text-amber-600 dark:text-amber-400" />
              {isBn ? 'দলিল সম্পাদনকারী পক্ষগণের পরিচয়' : 'Identity of Deed Executing Parties'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#111a30] border border-slate-200 dark:border-slate-700/70">
                <span className="text-[10px] font-bold uppercase text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800/60">
                  {isBn ? 'সম্পাদনকারী / বিক্রেতা (Seller)' : 'Executing Party / Seller'}
                </span>
                <h4 className="font-bold text-slate-900 dark:text-white mt-2 text-sm">
                  {formatName(application.seller, isBn)}
                </h4>
                <div className="mt-2 space-y-1 text-slate-600 dark:text-slate-300">
                  <p><span className="text-slate-400 dark:text-slate-400">{isBn ? 'সিটিজেন আইডি:' : 'Citizen ID:'}</span> <span className="font-mono font-semibold text-slate-800 dark:text-slate-200">{application.seller_citizen_id || 'BHM-CIT-104928'}</span></p>
                  <p><span className="text-slate-400 dark:text-slate-400">{isBn ? 'জাতীয় পরিচয়পত্র:' : 'NID:'}</span> <span className="font-mono text-slate-800 dark:text-slate-200">{application.seller?.nid || '19850919745610001'}</span></p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#111a30] border border-slate-200 dark:border-slate-700/70">
                <span className="text-[10px] font-bold uppercase text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded border border-amber-200 dark:border-amber-800/60">
                  {isBn ? 'গ্রহীতা / ক্রেতা (Buyer)' : 'Accepting Party / Buyer'}
                </span>
                <h4 className="font-bold text-slate-900 dark:text-white mt-2 text-sm">
                  {formatName(application.buyer, isBn)}
                </h4>
                <div className="mt-2 space-y-1 text-slate-600 dark:text-slate-300">
                  <p><span className="text-slate-400 dark:text-slate-400">{isBn ? 'সিটিজেন আইডি:' : 'Citizen ID:'}</span> <span className="font-mono font-semibold text-slate-800 dark:text-slate-200">{application.buyer_citizen_id || 'BHM-CIT-928471'}</span></p>
                  <p><span className="text-slate-400 dark:text-slate-400">{isBn ? 'জাতীয় পরিচয়পত্র:' : 'NID:'}</span> <span className="font-mono text-slate-800 dark:text-slate-200">{application.buyer?.nid || '19920919841230009'}</span></p>
                </div>
              </div>
            </div>
          </div>

          {/* Transfer Deed Schedule */}
          <div className="bg-white dark:bg-[#0c1427] rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-5">
            <h3 className="text-sm font-bold text-slate-800 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3 mb-4">
              <MapPin size={16} className="text-amber-600 dark:text-amber-400" />
              {isBn ? 'কবলা দলিলের জমি তপশিল ও রেজিস্ট্রি চৌহদ্দি' : 'Deed Land Schedule & Boundaries'}
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs mb-4">
              <div className="p-3 rounded-lg bg-slate-50 dark:bg-[#111a30] border border-slate-200/80 dark:border-slate-700/60">
                <span className="text-slate-500 dark:text-slate-400 block text-[11px] font-medium">{isBn ? 'উপজেলা ও জেলা' : 'Upazila & District'}</span>
                <span className="font-semibold text-slate-900 dark:text-slate-200">
                  {formatUpazila(application.parcel?.upazila, isBn)}, {formatDistrict(application.parcel?.district, isBn)}
                </span>
              </div>
              <div className="p-3 rounded-lg bg-slate-50 dark:bg-[#111a30] border border-slate-200/80 dark:border-slate-700/60">
                <span className="text-slate-500 dark:text-slate-400 block text-[11px] font-medium">{isBn ? 'মৌজা ও জেএল' : 'Mouza & JL'}</span>
                <span className="font-semibold text-slate-900 dark:text-slate-200">
                  {formatMouza(application.parcel, isBn)}, {isBn ? 'জেএল-' : 'JL-'}{formatDigits(application.parcel?.jl_no || '07', isBn)}
                </span>
              </div>
              <div className="p-3 rounded-lg bg-slate-50 dark:bg-[#111a30] border border-slate-200/80 dark:border-slate-700/60">
                <span className="text-slate-500 dark:text-slate-400 block text-[11px] font-medium">{isBn ? 'খতিয়ান নম্বর' : 'Khatian No'}</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">{formatDigits(application.parcel?.khatian_no, isBn)}</span>
              </div>
              <div className="p-3 rounded-lg bg-slate-50 dark:bg-[#111a30] border border-slate-200/80 dark:border-slate-700/60">
                <span className="text-slate-500 dark:text-slate-400 block text-[11px] font-medium">{isBn ? 'দাগ নম্বর' : 'Plot (Dag) No'}</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">{formatDigits(application.parcel?.dag_no, isBn)}</span>
              </div>
            </div>

            {/* Sold Land Area & Land Class Card */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#131d36] border border-slate-200 dark:border-slate-700/80 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 shrink-0">
                    <MapPin size={16} />
                  </div>
                  <div>
                    <span className="text-slate-500 dark:text-slate-400 block text-[11px] font-medium">{isBn ? 'বিক্রিত জমির পরিমাণ:' : 'Sold Land Area:'}</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400 text-sm font-mono">
                      {formatArea(application.proposed_area_decimal, isBn)}{' '}
                      <span className="text-slate-500 dark:text-slate-400 text-xs font-normal">
                        ({isBn ? 'হিস্যা:' : 'Share:'} {formatDigits(application.proposed_share, isBn)})
                      </span>
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 shrink-0">
                    <FileText size={16} />
                  </div>
                  <div>
                    <span className="text-slate-500 dark:text-slate-400 block text-[11px] font-medium">{isBn ? 'জমির শ্রেণী ও দাগে মোট জমি:' : 'Land Class & Total Plot Area:'}</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200 text-sm">
                      {formatLandClass(application.parcel?.land_type_bn || application.parcel?.land_class, isBn)}{' '}
                      <span className="text-slate-500 dark:text-slate-400 text-xs font-normal">
                        ({isBn ? 'মোট' : 'Total'} {formatArea(application.parcel?.total_area_decimal || '33.00', isBn)})
                      </span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Preparatory Demo Deed Draft */}
          <div className="bg-white dark:bg-[#0c1427] rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-5">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 mb-4">
              <h3 className="text-sm font-bold text-slate-800 dark:text-white flex items-center gap-2">
                <FileText size={16} className="text-amber-600 dark:text-amber-400" />
                {isBn ? 'কবলা দলিল খসড়া পূর্বাবলোকন (Draft Deed)' : 'Sale Deed Draft Preview (Draft Deed)'}
              </h3>
              <span className="text-[10px] font-bold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 px-2.5 py-1 rounded border border-amber-200 dark:border-amber-800/60">
                {isBn ? 'ডেমো দলিল খসড়া (Preparatory Demo Document)' : 'Preparatory Demo Document'}
              </span>
            </div>

            <div className="p-5 bg-slate-50/90 dark:bg-[#10182c] border border-slate-200 dark:border-slate-700/80 rounded-xl text-xs text-slate-800 dark:text-slate-200 leading-relaxed font-sans shadow-inner">
              <div className="text-center font-bold text-sm text-slate-900 dark:text-white mb-4 border-b border-slate-200 dark:border-slate-800 pb-3 tracking-wide">
                {isBn ? 'সাফ-কবলা বিক্রয় দলিলপত্র খসড়া (নমুনা)' : 'Outright Sale Deed (Saf-Kobla) Sample Draft'}
              </div>
              <p className="mb-3 leading-loose text-slate-700 dark:text-slate-300">
                {isBn ? (
                  <>
                    পরম করুণাময় মহান সৃষ্টিকর্তার নাম স্মরণ করিয়া আমি বিক্রেতা{' '}
                    <strong className="text-slate-900 dark:text-white font-bold bg-slate-200/60 dark:bg-slate-800/80 px-1.5 py-0.5 rounded">
                      {formatName(application.seller, true)}
                    </strong>
                    , এনআইডি: {application.seller?.nid || '১৯৮৫০৯১৯৭৪৫৬১০০০১'}, অত্র সাফ-কবলা দলিল সম্পাদনপূর্বক ক্রেতা{' '}
                    <strong className="text-slate-900 dark:text-white font-bold bg-slate-200/60 dark:bg-slate-800/80 px-1.5 py-0.5 rounded">
                      {formatName(application.buyer, true)}
                    </strong>{' '}
                    বরাবরে জমি হস্তান্তর করিলাম।
                  </>
                ) : (
                  <>
                    In the name of the Almighty, I the Seller{' '}
                    <strong className="text-slate-900 dark:text-white font-bold bg-slate-200/60 dark:bg-slate-800/80 px-1.5 py-0.5 rounded">
                      {formatName(application.seller, false)}
                    </strong>
                    , NID: {application.seller?.nid || '19850919745610001'}, do hereby execute this Deed of Outright Sale and transfer the scheduled parcel unto the Buyer{' '}
                    <strong className="text-slate-900 dark:text-white font-bold bg-slate-200/60 dark:bg-slate-800/80 px-1.5 py-0.5 rounded">
                      {formatName(application.buyer, false)}
                    </strong>.
                  </>
                )}
              </p>
              <div className="p-3 bg-white dark:bg-[#0c1427] border border-slate-200 dark:border-slate-800 rounded-lg text-slate-800 dark:text-slate-200 my-3 leading-relaxed">
                <strong className="text-slate-900 dark:text-white">{isBn ? 'তপশিল:' : 'Schedule:'}</strong>{' '}
                {isBn ? 'জেলা:' : 'District:'} {formatDistrict(application.parcel?.district, isBn)},{' '}
                {isBn ? 'থানা/উপজেলা:' : 'Upazila:'} {formatUpazila(application.parcel?.upazila, isBn)},{' '}
                {isBn ? 'মৌজা:' : 'Mouza:'} {formatMouza(application.parcel, isBn)},{' '}
                {formatKhatian(application.parcel?.khatian_no, isBn)}, {formatPlot(application.parcel?.dag_no, isBn)},{' '}
                {isBn ? 'হস্তান্তরিত জমি:' : 'Transferred Area:'}{' '}
                <span className="font-semibold text-emerald-700 dark:text-emerald-400 font-mono">
                  {formatArea(application.proposed_area_decimal, isBn)}
                </span>.
              </div>
              <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800/80 flex justify-between text-[11px] text-slate-500 dark:text-slate-400 font-sans italic">
                <span>
                  {isBn
                    ? '* এটি সফটওয়্যার জেনারেটেড প্রস্তুতিমূলক খসড়া দলিল। সাব-রেজিস্ট্রারের দাপ্তরিক নিবন্ধন ব্যতীত এটি বৈধ স্বত্ব প্রমাণক নয়।'
                    : '* Software-generated preparatory draft. Not proof of legal title without official Sub-Registrar registration.'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (1 span) */}
        <div className="space-y-6">
          {/* Scheduling & Registration Status */}
          <div className="bg-white dark:bg-[#0c1427] rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-5">
            <h3 className="text-sm font-bold text-slate-800 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3 mb-4">
              <Stamp size={16} className="text-amber-600 dark:text-amber-400" />
              {isBn ? 'নিবন্ধন কার্যালয়ের অগ্রগতি' : 'Registry Status & Progress'}
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500 dark:text-slate-400">{isBn ? 'বর্তমান পর্যায়:' : 'Current Stage:'}</span>
                <span className="font-bold text-slate-800 dark:text-slate-200"><StatusBadge status={application.stage} /></span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500 dark:text-slate-400">{isBn ? 'ইউনিয়ন ও এসি ল্যান্ড:' : 'Union & AC Land:'}</span>
                <span className="font-semibold text-emerald-700 dark:text-emerald-400">{isBn ? '✓ ছাড়পত্র প্রাপ্ত' : '✓ Cleared & Forwarded'}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500 dark:text-slate-400">{isBn ? 'রেজিস্ট্রি অফিস:' : 'Registry Office:'}</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{isBn ? 'গুলশান সাব-রেজিস্ট্রি অফিস' : 'Gulshan Sub-Registry Office'}</span>
              </div>
            </div>
          </div>

          {/* Required Checklist for Citizens */}
          <div className="bg-slate-50 dark:bg-[#111a30] rounded-xl border border-slate-200 dark:border-slate-700/70 p-4 text-xs text-slate-600 dark:text-slate-300">
            <h4 className="font-bold text-slate-800 dark:text-white flex items-center gap-1.5 mb-2">
              <FileCheck size={14} className="text-amber-600 dark:text-amber-400" />
              {isBn ? 'রেজিস্ট্রেশনের প্রয়োজনীয় নথিপত্র' : 'Mandatory Registration Documents'}
            </h4>
            <ul className="list-disc pl-4 space-y-1.5 text-[11px]">
              <li>{isBn ? 'বিএস খতিয়ান ও হাল সনের ভূমি উন্নয়ন কর পরিশোধিত দাখিলা।' : 'BS Khatian and paid tax receipt (Dakhila) for current FY.'}</li>
              <li>{isBn ? 'ক্রেতা ও বিক্রেতার জাতীয় পরিচয়পত্রের মূল কপি ও সত্যায়িত ফটোকপি।' : 'Original National ID (NID) and certified copies of both parties.'}</li>
              <li>{isBn ? 'উভয় পক্ষের সদ্য তোলা পাসপোর্ট সাইজ রঙিন ছবি।' : 'Recent passport-size color photographs of parties.'}</li>
              <li>{isBn ? 'সরকারি স্ট্যাম্প শুল্ক ও রেজিস্ট্রেশন ফি জমার রসিদ।' : 'Statutory non-judicial stamp duty and bank fee receipts.'}</li>
            </ul>
          </div>
        </div>
      </div>

      {/* 9-Stage Application Timeline */}
      <ApplicationTimeline
        currentStage={application.stage}
        returnReason={application.return_reason_bn}
        rejectionReason={application.rejection_reason_bn}
        createdAt={application.created_at}
      />

      {/* Schedule Appointment Modal */}
      {showScheduleModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className={`bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 ${isBn ? 'font-bengali' : 'font-sans'}`}>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
              <Calendar className="w-5 h-5 text-amber-600" />
              {isBn ? 'রেজিস্ট্রেশন অ্যাপয়েন্টমেন্ট নির্ধারণ ও নোটিফিকেশন জারী' : 'Schedule Registration Appointment'}
            </h3>

            <form onSubmit={handleScheduleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300 block">
                    {isBn ? 'অ্যাপয়েন্টমেন্টের তারিখ *' : 'Appointment Date *'}
                  </label>
                  <input
                    type="date"
                    value={appointmentDate}
                    onChange={(e) => setAppointmentDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 text-xs"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300 block">
                    {isBn ? 'সময়সূচী (Time Slot) *' : 'Time Slot *'}
                  </label>
                  <select
                    value={slotTime}
                    onChange={(e) => setSlotTime(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 text-xs"
                  >
                    <option value={isBn ? 'সকাল ১০:০০ - ১০:৩০ মি.' : '10:00 AM - 10:30 AM'}>{isBn ? 'সকাল ১০:০০ - ১০:৩০ মি.' : '10:00 AM - 10:30 AM'}</option>
                    <option value={isBn ? 'সকাল ১০:৩০ - ১১:০০ মি.' : '10:30 AM - 11:00 AM'}>{isBn ? 'সকাল ১০:৩০ - ১১:০০ মি.' : '10:30 AM - 11:00 AM'}</option>
                    <option value={isBn ? 'সকাল ১১:০০ - ১১:৩০ মি.' : '11:00 AM - 11:30 AM'}>{isBn ? 'সকাল ১১:০০ - ১১:৩০ মি.' : '11:00 AM - 11:30 AM'}</option>
                    <option value={isBn ? 'সকাল ১১:৩০ - ১২:০০ মি.' : '11:30 AM - 12:00 PM'}>{isBn ? 'সকাল ১১:৩০ - ১২:০০ মি.' : '11:30 AM - 12:00 PM'}</option>
                    <option value={isBn ? 'দুপুর ১২:০০ - ১২:৩০ মি.' : '12:00 PM - 12:30 PM'}>{isBn ? 'দুপুর ১২:০০ - ১২:৩০ মি.' : '12:00 PM - 12:30 PM'}</option>
                    <option value={isBn ? 'দুপুর ১২:৩০ - ০১:০০ মি.' : '12:30 PM - 01:00 PM'}>{isBn ? 'দুপুর ১২:৩০ - ০১:০০ মি.' : '12:30 PM - 01:00 PM'}</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300 block">
                  {isBn ? 'রেজিস্ট্রি অফিস ও কক্ষ নম্বর' : 'Registry Office & Room No'}
                </label>
                <input
                  type="text"
                  value={officeLocation}
                  onChange={(e) => setOfficeLocation(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 text-xs"
                  required
                />
              </div>

              <div className="space-y-2 p-3 bg-slate-50 dark:bg-[#111a30] rounded-lg border border-slate-200 dark:border-slate-700/70">
                <label className="font-bold text-amber-800 dark:text-amber-300 block">
                  {isBn ? 'উভয় পক্ষকে হাজিরা তলব ও দলিল চেকলিস্ট:' : 'Parties Attendance & Document Checklist:'}
                </label>
                <div className="space-y-1.5 text-[11px] text-slate-700 dark:text-slate-300">
                  {checklist.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <CheckCircle2 size={13} className="text-emerald-700 dark:text-emerald-400 shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowScheduleModal(false)}
                  className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
                  disabled={submitting}
                >
                  {isBn ? 'বাতিল' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 bg-amber-700 hover:bg-amber-800 text-white font-bold rounded-lg transition flex items-center gap-1.5 cursor-pointer"
                >
                  {submitting ? (isBn ? 'সংরক্ষণ হচ্ছে...' : 'Saving...') : (isBn ? 'অ্যাপয়েন্টমেন্ট চূড়ান্ত করুন' : 'Confirm Appointment')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Complete Registration Modal */}
      {showCompleteModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className={`bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 ${isBn ? 'font-bengali' : 'font-sans'}`}>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
              <Stamp className="w-5 h-5 text-emerald-600" />
              {isBn ? 'দলিল সম্পাদন ও বালামভুক্তি সম্পন্নকরণ' : 'Complete Deed Execution & Volume Record'}
            </h3>

            <form onSubmit={handleCompleteSubmit} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300 block">
                  {isBn ? 'রেজিস্ট্রিকৃত কবলা দলিল নম্বর *' : 'Registered Deed Number *'}
                </label>
                <input
                  type="text"
                  value={deedNo}
                  onChange={(e) => setDeedNo(e.target.value)}
                  placeholder={isBn ? 'যেমন: ৩৪০৯/২০২৬' : 'e.g. 3409/2026'}
                  className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono text-xs font-bold"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300 block">
                  {isBn ? 'বালাম ভলিউম ও পৃষ্ঠা নম্বর' : 'Volume Book & Page Number'}
                </label>
                <input
                  type="text"
                  value={volumeNo}
                  onChange={(e) => setVolumeNo(e.target.value)}
                  placeholder={isBn ? 'যেমন: বালাম নং ৪২, পৃষ্ঠা ১৮-২৫' : 'e.g. Volume 42, Pages 18-25'}
                  className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300 block">
                  {isBn ? 'সাব-রেজিস্ট্রারের দাপ্তরিক মন্তব্য' : 'Sub-Registrar Official Notes'}
                </label>
                <textarea
                  rows={3}
                  value={regNotes}
                  onChange={(e) => setRegNotes(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 text-xs"
                />
              </div>

              <div className="p-3 bg-purple-50 dark:bg-purple-950/40 rounded-lg border border-purple-200 dark:border-purple-800 text-[11px] text-purple-900 dark:text-purple-300">
                <strong>{isBn ? 'স্বয়ংক্রিয় ইন্টার-অফিস প্রসেসিং:' : 'Automated Inter-Office Processing:'}</strong>{' '}
                {isBn
                  ? 'নিবন্ধন রেকর্ড নিশ্চিতকরণের সাথে সাথে সিস্টেমে স্বয়ংক্রিয়ভাবে এসি ল্যান্ড অফিসের জন্য ই-নামজারি কেস তৈরি হবে এবং ক্রেতা ও বিক্রেতার ফোনে নোটিফিকেশন পৌঁছে যাবে।'
                  : 'Confirming registration automatically creates an e-Mutation case for the AC Land Office and sends notifications to both parties.'}
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowCompleteModal(false)}
                  className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
                  disabled={submitting}
                >
                  {isBn ? 'বাতিল' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-lg transition flex items-center gap-1.5 cursor-pointer"
                >
                  {submitting
                    ? (isBn ? 'সংরক্ষণ হচ্ছে...' : 'Saving...')
                    : (isBn ? 'নিবন্ধন সম্পন্ন ও নামজারিতে প্রেরণ' : 'Complete Deed & Docket for Mutation')}
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
