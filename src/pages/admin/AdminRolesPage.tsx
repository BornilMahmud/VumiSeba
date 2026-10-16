import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { UserCog, Shield, CheckCircle2, Clock, Search, RefreshCw, Building } from 'lucide-react';

export const AdminRolesPage: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Role Edit Modal
  const [editingUser, setEditingUser] = useState<any | null>(null);
  const [selectedRole, setSelectedRole] = useState('citizen');
  const [designationBn, setDesignationBn] = useState('');
  const [officeNameBn, setOfficeNameBn] = useState('');
  const [submitting, setSubmitting] = useState(false);
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

  const openEditModal = (user: any) => {
    setEditingUser(user);
    setSelectedRole(user.role || 'citizen');
    setDesignationBn(user.designation_bn || '');
    setOfficeNameBn(user.office_name_bn || '');
  };

  const handleRoleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    setSubmitting(true);
    try {
      const payload = {
        userId: editingUser.id,
        role: selectedRole,
        designation_bn: designationBn.trim() || undefined,
        office_name_bn: officeNameBn.trim() || undefined,
      };

      const res = await api.officer.updateRole(payload);
      if (res.success) {
        setSuccessMessage(res.message_bn || 'কর্মকর্তার ভূমিকা ও পদবি সফলভাবে হালনাগাদ করা হয়েছে।');
        setEditingUser(null);
        await fetchUsers();
      } else {
        alert(res.message_bn || 'রোল হালনাগাদ ব্যর্থ হয়েছে।');
      }
    } catch (err: any) {
      alert(err.message || 'সার্ভার ত্রুটি।');
    } finally {
      setSubmitting(false);
    }
  };

  const filtered = users.filter((u) => {
    const q = searchTerm.toLowerCase();
    return (
      (u.name_bn || u.name || '').toLowerCase().includes(q) ||
      (u.email || '').toLowerCase().includes(q) ||
      (u.role || '').toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6 font-bengali">
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <UserCog className="text-cyan-700" size={20} />
            ভূমি দপ্তর কর্মকর্তা ও পদবি নির্ধারণ কনসোল (Role Management)
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            ইউনিয়ন তহশিলদার, এসি ল্যান্ড, সাব-রেজিস্ট্রার ও প্রশাসনিক পদবি বরাদ্দকরণ ও নিয়ন্ত্রণ
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search size={15} className="absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="নাম বা ভূমিকা খুঁজুন..."
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

      {/* Role Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
                <th className="py-3 px-4">কর্মকর্তা / নাগরিকের নাম</th>
                <th className="py-3 px-4">ইমেইল অ্যাকাউন্ট</th>
                <th className="py-3 px-4">বর্তমান ভূমিকা (System Role)</th>
                <th className="py-3 px-4">দাপ্তরিক পদবি</th>
                <th className="py-3 px-4">কর্মস্থল / অফিস</th>
                <th className="py-3 px-4 text-right">পদবি বরাদ্দ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500">
                    <Clock size={16} className="animate-spin inline-block mr-2" />
                    তালিকা লোড হচ্ছে...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500">
                    কোন অ্যাকাউন্ট পাওয়া যায়নি।
                  </td>
                </tr>
              ) : (
                filtered.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/70 transition">
                    <td className="py-3 px-4 font-bold text-slate-900">
                      {u.name_bn || u.name}
                    </td>
                    <td className="py-3 px-4 text-slate-500 font-mono">
                      {u.email}
                    </td>
                    <td className="py-3 px-4">
                      <span className="capitalize font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded border border-slate-200 text-[11px]">
                        {u.role === 'citizen' && 'নাগরিক (Citizen)'}
                        {u.role === 'union_land_officer' && 'তহশিলদার (Union Officer)'}
                        {u.role === 'ac_land' && 'এসি ল্যান্ড (AC Land)'}
                        {u.role === 'sub_registrar' && 'সাব-রেজিস্ট্রার (Sub-Registrar)'}
                        {u.role === 'central_admin' && 'সুপার অ্যাডমিন (Central Admin)'}
                        {!['citizen', 'union_land_officer', 'ac_land', 'sub_registrar', 'central_admin'].includes(u.role) && u.role}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-700">
                      {u.designation_bn || 'প্রযোজ্য নয়'}
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      {u.office_name_bn || 'প্রযোজ্য নয়'}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => openEditModal(u)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-cyan-700 hover:bg-cyan-800 text-white font-bold rounded-lg text-xs transition"
                      >
                        <UserCog size={13} />
                        রোল পরিবর্তন করুন
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Role Modal */}
      {editingUser && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 font-bengali">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
              <UserCog className="w-5 h-5 text-cyan-600" />
              দাপ্তরিক ভূমিকা ও অনুমতি বরাদ্দকরণ
            </h3>

            <form onSubmit={handleRoleUpdate} className="space-y-4 text-xs">
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                <p className="font-bold text-slate-900">{editingUser.name_bn || editingUser.name}</p>
                <p className="text-[11px] text-slate-500">{editingUser.email}</p>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 block">সিস্টেম ভূমিকা (Role) *</label>
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-cyan-500 text-xs font-semibold"
                >
                  <option value="citizen">নাগরিক (Citizen) — সাধারণ ব্যবহারকারী</option>
                  <option value="union_land_officer">ইউনিয়ন ভূমি সহকারী কর্মকর্তা (ULAO) — তহশিল প্যানেল</option>
                  <option value="ac_land">সহকারী কমিশনার (ভূমি) — এসি ল্যান্ড আদালত ও নামজারি প্যানেল</option>
                  <option value="sub_registrar">সাব-রেজিস্ট্রার — দলিল নিবন্ধন প্যানেল</option>
                  <option value="central_admin">কেন্দ্রীয় সুপার অ্যাডমিনিস্ট্রেটর — পূর্ণ নিয়ন্ত্রণ</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 block">দাপ্তরিক পদবি (বাংলা)</label>
                <input
                  type="text"
                  value={designationBn}
                  onChange={(e) => setDesignationBn(e.target.value)}
                  placeholder="যেমন: সহকারী কমিশনার (ভূমি)"
                  className="w-full p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-cyan-500 text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 block">কর্মস্থলের নাম / সার্কেল</label>
                <input
                  type="text"
                  value={officeNameBn}
                  onChange={(e) => setOfficeNameBn(e.target.value)}
                  placeholder="যেমন: উপজেলা ভূমি অফিস, গুলশান রাজস্ব সার্কেল"
                  className="w-full p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-cyan-500 text-xs"
                />
              </div>

              <div className="p-3 rounded-lg bg-cyan-50 border border-cyan-200 text-cyan-900 text-[11px]">
                <strong>নিরাপত্তা নিয়মাবলী:</strong> পদবি পরিবর্তনের সাথে সাথে সংশ্লিষ্ট ব্যবহারকারীর সেশন পারমিশন ও নির্দিষ্ট অফিস প্যানেলে প্রবেশাধিকার হালনাগাদ হবে। এই কার্যক্রমটি অপরিবর্তনীয় অডিট লগে রেকর্ড থাকবে।
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 font-semibold hover:bg-slate-50"
                  disabled={submitting}
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 bg-cyan-700 hover:bg-cyan-800 text-white font-bold rounded-lg transition"
                >
                  {submitting ? 'সংরক্ষণ হচ্ছে...' : 'রোল বরাদ্দ নিশ্চিত করুন'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminRolesPage;
