import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { UserCheck, Shield, Users, Search, Clock, CheckCircle2, RefreshCw } from 'lucide-react';

export const AdminUsersPage: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [verifyingId, setVerifyingId] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await api.officer.users();
      if (res.success && res.users) {
        setUsers(res.users);
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
        setSuccessMessage(res.message_bn || 'কেওয়াইসি যাচাই সম্পন্ন এবং ইউনিক সিটিজেন আইডি প্রদান করা হয়েছে।');
        await fetchUsers();
      } else {
        alert(res.message_bn || 'যাচাই ব্যর্থ হয়েছে।');
      }
    } catch (err: any) {
      alert(err.message || 'সার্ভার ত্রুটি।');
    } finally {
      setVerifyingId(null);
    }
  };

  const filteredUsers = users.filter((u) => {
    const q = searchTerm.toLowerCase();
    return (
      (u.name_bn || u.name || '').toLowerCase().includes(q) ||
      (u.email || '').toLowerCase().includes(q) ||
      (u.nid || '').toLowerCase().includes(q) ||
      (u.citizen_id || '').toLowerCase().includes(q) ||
      (u.role || '').toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6 font-bengali">
      {/* Top Banner */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Users className="text-cyan-700" size={20} />
            নাগরিক হিসাব ও এনআইডি কেওয়াইসি ভেরিফিকেশন কনসোল
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            নির্বাচন কমিশন ডাটাবেজ সাপেক্ষে এনআইডি যাচাইকরণ এবং ইউনিক সিটিজেন আইডি (Citizen ID) অনুমোদন
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search size={15} className="absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="নাম, এনআইডি বা সিটিজেন আইডি..."
              className="pl-9 pr-3 py-1.5 border border-slate-300 rounded-lg text-xs w-60 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>
          <button
            onClick={fetchUsers}
            className="p-1.5 border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-50"
            title="রিফ্রেশ"
          >
            <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {successMessage && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-sm flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={18} className="text-emerald-700" />
            <span className="font-semibold">{successMessage}</span>
          </div>
          <button
            onClick={() => setSuccessMessage(null)}
            className="text-xs text-emerald-800 underline hover:text-emerald-950"
          >
            বন্ধ করুন
          </button>
        </div>
      )}

      {/* Users Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
                <th className="py-3 px-4">নাগরিক / ব্যবহারকারীর নাম</th>
                <th className="py-3 px-4">সিটিজেন আইডি (Citizen ID)</th>
                <th className="py-3 px-4">জাতীয় পরিচয়পত্র (NID)</th>
                <th className="py-3 px-4">ভূমিকা (Role)</th>
                <th className="py-3 px-4">কেওয়াইসি স্ট্যাটাস</th>
                <th className="py-3 px-4 text-right">প্রশাসনিক কার্যক্রম</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500">
                    <Clock size={16} className="animate-spin inline-block mr-2" />
                    ব্যবহারকারী ডাটাবেজ লোড হচ্ছে...
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500">
                    কোন ব্যবহারকারী পাওয়া যায়নি।
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => {
                  const isPendingKyc = u.kyc_status === 'pending' || u.kyc_status === 'submitted' || !u.citizen_id;
                  return (
                    <tr key={u.id} className="hover:bg-slate-50/70 transition">
                      <td className="py-3 px-4">
                        <span className="font-bold text-slate-900 block">{u.name_bn || u.name}</span>
                        <span className="text-[11px] text-slate-400">{u.email}</span>
                      </td>
                      <td className="py-3 px-4 font-mono">
                        {u.citizen_id ? (
                          <span className="font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                            {u.citizen_id}
                          </span>
                        ) : (
                          <span className="text-slate-400 text-[11px]">অনুমোদিত নয়</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-slate-700 font-mono">
                        {u.nid || 'প্রদত্ত হয়নি'}
                      </td>
                      <td className="py-3 px-4">
                        <span className="capitalize font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200 text-[11px]">
                          {u.role === 'citizen' && 'নাগরিক'}
                          {u.role === 'union_land_officer' && 'ইউনিয়ন কর্মকর্তা (ULAO)'}
                          {u.role === 'ac_land' && 'এসি ল্যান্ড (AC Land)'}
                          {u.role === 'sub_registrar' && 'সাব-রেজিস্ট্রার'}
                          {u.role === 'central_admin' && 'সুপার অ্যাডমিন'}
                          {!['citizen', 'union_land_officer', 'ac_land', 'sub_registrar', 'central_admin'].includes(u.role) && u.role}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        {u.kyc_status === 'verified' ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                            <CheckCircle2 size={12} />
                            যাচাইকৃত
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                            <Clock size={12} />
                            অপেক্ষমাণ
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right">
                        {isPendingKyc ? (
                          <button
                            onClick={() => handleVerifyKyc(u.id)}
                            disabled={verifyingId === u.id}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs transition"
                          >
                            <UserCheck size={13} />
                            {verifyingId === u.id ? 'যাচাই হচ্ছে...' : 'কেওয়াইসি অনুমোদন ও আইডি দিন'}
                          </button>
                        ) : (
                          <span className="text-[11px] text-slate-400">অনুমোদিত সম্পন্ন</span>
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
