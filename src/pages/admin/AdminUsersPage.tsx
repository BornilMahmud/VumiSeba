import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { UserCheck, Shield, Users, Search, Clock, CheckCircle2, RefreshCw } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { formatName } from '../../utils/bilingual';

export const AdminUsersPage: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [verifyingId, setVerifyingId] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const { language } = useLanguage();
  const isBn = language === 'bn';

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await api.officer.users();
      const list = res?.users || res?.data;
      if (res && res.success && Array.isArray(list)) {
        setUsers(list);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleVerifyKyc = async (userId: string) => {
    setVerifyingId(userId);
    try {
      const res = await api.officer.approveKyc(userId);
      if (res.success) {
        setSuccessMessage(
          isBn
            ? (res.message_bn || 'কেওয়াইসি যাচাই সম্পন্ন এবং ইউনিক সিটিজেন আইডি প্রদান করা হয়েছে।')
            : 'KYC verified and unique Citizen ID issued successfully.'
        );
        await fetchUsers();
      } else {
        alert(res.message_bn || (isBn ? 'যাচাই ব্যর্থ হয়েছে।' : 'Verification failed.'));
      }
    } catch (err: any) {
      alert(err.message || (isBn ? 'সার্ভার ত্রুটি।' : 'Server error.'));
    } finally {
      setVerifyingId(null);
    }
  };

  const filteredUsers = users.filter((u) => {
    const q = searchTerm.toLowerCase();
    return (
      (u.name_bn || u.name || '').toLowerCase().includes(q) ||
      (u.name_en || '').toLowerCase().includes(q) ||
      (u.email || '').toLowerCase().includes(q) ||
      (u.nid || '').toLowerCase().includes(q) ||
      (u.nid_no || '').toLowerCase().includes(q) ||
      (u.citizen_id || '').toLowerCase().includes(q) ||
      (u.role || '').toLowerCase().includes(q)
    );
  });

  return (
    <div className={`space-y-6 ${isBn ? 'font-bengali' : 'font-sans'}`}>
      {/* Top Banner */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Users className="text-cyan-700 dark:text-cyan-400" size={20} />
            {isBn ? 'নাগরিক হিসাব ও এনআইডি কেওয়াইসি ভেরিফিকেশন কনসোল' : 'Citizen Accounts & NID KYC Verification Console'}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {isBn
              ? 'নির্বাচন কমিশন ডাটাবেজ সাপেক্ষে এনআইডি যাচাইকরণ এবং ইউনিক সিটিজেন আইডি (Citizen ID) অনুমোদন'
              : 'NID verification against Election Commission records and unique Citizen ID approval'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search size={15} className="absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={isBn ? 'নাম, এনআইডি বা সিটিজেন আইডি...' : 'Search name, NID or Citizen ID...'}
              className="pl-9 pr-3 py-1.5 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg text-xs w-60 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>
          <button
            onClick={fetchUsers}
            className="p-1.5 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
            title={isBn ? 'রিফ্রেশ' : 'Refresh'}
          >
            <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {successMessage && (
        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-300 text-sm flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={18} className="text-emerald-700 dark:text-emerald-400" />
            <span className="font-semibold">{successMessage}</span>
          </div>
          <button
            onClick={() => setSuccessMessage(null)}
            className="text-xs text-emerald-800 dark:text-emerald-300 underline hover:text-emerald-950 cursor-pointer"
          >
            {isBn ? 'বন্ধ করুন' : 'Dismiss'}
          </button>
        </div>
      )}

      {/* Users Table */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-bold">
                <th className="py-3 px-4">{isBn ? 'নাগরিক / ব্যবহারকারীর নাম' : 'Citizen / User Name'}</th>
                <th className="py-3 px-4">{isBn ? 'সিটিজেন আইডি (Citizen ID)' : 'Citizen ID'}</th>
                <th className="py-3 px-4">{isBn ? 'জাতীয় পরিচয়পত্র (NID)' : 'National ID (NID)'}</th>
                <th className="py-3 px-4">{isBn ? 'ভূমিকা (Role)' : 'Role'}</th>
                <th className="py-3 px-4">{isBn ? 'কেওয়াইসি স্ট্যাটাস' : 'KYC Status'}</th>
                <th className="py-3 px-4 text-right">{isBn ? 'প্রশাসনিক কার্যক্রম' : 'Action'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500 dark:text-slate-400">
                    <Clock size={16} className="animate-spin inline-block mr-2" />
                    {isBn ? 'ব্যবহারকারী ডাটাবেজ লোড হচ্ছে...' : 'Loading users database...'}
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500 dark:text-slate-400">
                    {isBn ? 'কোন ব্যবহারকারী পাওয়া যায়নি।' : 'No users found.'}
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => {
                  const isPendingKyc = u.kyc_status === 'pending' || u.kyc_status === 'submitted' || u.kyc_status === 'unverified' || !u.citizen_id;
                  const displayName = isBn ? (u.name_bn || u.name) : (u.name_en || u.name || u.name_bn);
                  const displayNid = u.nid || (u.nid_no ? `${u.nid_no.slice(0, 3)} *** *** ${u.nid_no.slice(-3)}` : (isBn ? 'প্রদত্ত হয়নি' : 'Not provided'));

                  return (
                    <tr key={u.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/60 transition">
                      <td className="py-3 px-4">
                        <span className="font-bold text-slate-900 dark:text-white block">{displayName}</span>
                        <span className="text-[11px] text-slate-400">{u.email}</span>
                      </td>
                      <td className="py-3 px-4 font-mono">
                        {u.citizen_id ? (
                          <span className="font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
                            {u.citizen_id}
                          </span>
                        ) : (
                          <span className="text-slate-400 text-[11px]">{isBn ? 'অনুমোদিত নয়' : 'Not Issued'}</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-slate-700 dark:text-slate-300 font-mono">
                        {displayNid}
                      </td>
                      <td className="py-3 px-4">
                        <span className="capitalize font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700 text-[11px]">
                          {u.role === 'citizen' && (isBn ? 'নাগরিক' : 'Citizen')}
                          {(u.role === 'union_land_officer' || u.role === 'union_officer') && (isBn ? 'ইউনিয়ন কর্মকর্তা (ULAO)' : 'Union Officer (ULAO)')}
                          {u.role === 'ac_land' && (isBn ? 'এসি ল্যান্ড (AC Land)' : 'AC Land')}
                          {u.role === 'sub_registrar' && (isBn ? 'সাব-রেজিস্ট্রার' : 'Sub-Registrar')}
                          {u.role === 'central_admin' && (isBn ? 'সুপার অ্যাডমিন' : 'Super Admin')}
                          {!['citizen', 'union_land_officer', 'union_officer', 'ac_land', 'sub_registrar', 'central_admin'].includes(u.role) && u.role}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        {u.kyc_status === 'verified' ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
                            <CheckCircle2 size={12} />
                            {isBn ? 'যাচাইকৃত' : 'Verified'}
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded border border-amber-200 dark:border-amber-800">
                            <Clock size={12} />
                            {isBn ? 'অপেক্ষমাণ' : 'Pending'}
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right">
                        {isPendingKyc ? (
                          <button
                            onClick={() => handleVerifyKyc(u.id)}
                            disabled={verifyingId === u.id}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs transition cursor-pointer"
                          >
                            <UserCheck size={13} />
                            {verifyingId === u.id
                              ? (isBn ? 'যাচাই হচ্ছে...' : 'Verifying...')
                              : (isBn ? 'কেওয়াইসি অনুমোদন ও আইডি দিন' : 'Approve KYC & Issue ID')}
                          </button>
                        ) : (
                          <span className="text-[11px] text-slate-400">{isBn ? 'অনুমোদিত সম্পন্ন' : 'Approved'}</span>
                        )}
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

export default AdminUsersPage;
