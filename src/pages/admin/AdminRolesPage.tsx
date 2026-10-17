import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { UserCog, Shield, CheckCircle2, Clock, Search, RefreshCw, Building } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export const AdminRolesPage: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { language } = useLanguage();
  const isBn = language === 'bn';

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

  const openEditModal = (user: any) => {
    setEditingUser(user);
    const mappedRole = user.role === 'union_officer' ? 'union_land_officer' : (user.role || 'citizen');
    setSelectedRole(mappedRole);
    setDesignationBn(user.designation_bn || user.designation_en || '');
    setOfficeNameBn(user.office_name_bn || user.office_name_en || '');
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
        setSuccessMessage(
          isBn
            ? (res.message_bn || 'কর্মকর্তার ভূমিকা ও পদবি সফলভাবে হালনাগাদ করা হয়েছে।')
            : 'Officer role and designation updated successfully.'
        );
        setEditingUser(null);
        await fetchUsers();
      } else {
        alert(res.message_bn || (isBn ? 'রোল হালনাগাদ ব্যর্থ হয়েছে।' : 'Role update failed.'));
      }
    } catch (err: any) {
      alert(err.message || (isBn ? 'সার্ভার ত্রুটি।' : 'Server error.'));
    } finally {
      setSubmitting(false);
    }
  };

  const filtered = users.filter((u) => {
    const q = searchTerm.toLowerCase();
    return (
      (u.name_bn || u.name || '').toLowerCase().includes(q) ||
      (u.name_en || '').toLowerCase().includes(q) ||
      (u.email || '').toLowerCase().includes(q) ||
      (u.role || '').toLowerCase().includes(q)
    );
  });

  return (
    <div className={`space-y-6 ${isBn ? 'font-bengali' : 'font-sans'}`}>
      <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <UserCog className="text-cyan-700 dark:text-cyan-400" size={20} />
            {isBn ? 'ভূমি দপ্তর কর্মকর্তা ও পদবি নির্ধারণ কনসোল (Role Management)' : 'Land Office Personnel & Role Management Console'}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {isBn
              ? 'ইউনিয়ন তহশিলদার, এসি ল্যান্ড, সাব-রেজিস্ট্রার ও প্রশাসনিক পদবি বরাদ্দকরণ ও নিয়ন্ত্রণ'
              : 'Designation assignment and role-based access control across land offices'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search size={15} className="absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={isBn ? 'নাম বা ভূমিকা খুঁজুন...' : 'Search by name or role...'}
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

      {/* Role Table */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-bold">
                <th className="py-3 px-4">{isBn ? 'কর্মকর্তা / নাগরিকের নাম' : 'Officer / User Name'}</th>
                <th className="py-3 px-4">{isBn ? 'ইমেইল অ্যাকাউন্ট' : 'Email Account'}</th>
                <th className="py-3 px-4">{isBn ? 'বর্তমান ভূমিকা (System Role)' : 'System Role'}</th>
                <th className="py-3 px-4">{isBn ? 'দাপ্তরিক পদবি' : 'Official Designation'}</th>
                <th className="py-3 px-4">{isBn ? 'কর্মস্থল / অফিস' : 'Assigned Office / Station'}</th>
                <th className="py-3 px-4 text-right">{isBn ? 'পদবি বরাদ্দ' : 'Action'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500 dark:text-slate-400">
                    <Clock size={16} className="animate-spin inline-block mr-2" />
                    {isBn ? 'তালিকা লোড হচ্ছে...' : 'Loading users list...'}
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500 dark:text-slate-400">
                    {isBn ? 'কোন অ্যাকাউন্ট পাওয়া যায়নি।' : 'No accounts found.'}
                  </td>
                </tr>
              ) : (
                filtered.map((u) => {
                  const displayName = isBn ? (u.name_bn || u.name) : (u.name_en || u.name || u.name_bn);
                  const designation = isBn ? (u.designation_bn || 'প্রযোজ্য নয়') : (u.designation_en || u.designation_bn || 'N/A');
                  const officeName = isBn ? (u.office_name_bn || 'প্রযোজ্য নয়') : (u.office_name_en || u.office_name_bn || 'N/A');

                  return (
                    <tr key={u.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/60 transition">
                      <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">
                        {displayName}
                      </td>
                      <td className="py-3 px-4 text-slate-500 dark:text-slate-400 font-mono">
                        {u.email}
                      </td>
                      <td className="py-3 px-4">
                        <span className="capitalize font-bold text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700 text-[11px]">
                          {u.role === 'citizen' && (isBn ? 'নাগরিক (Citizen)' : 'Citizen')}
                          {(u.role === 'union_land_officer' || u.role === 'union_officer') && (isBn ? 'তহশিলদার (Union Officer)' : 'Union Officer (ULAO)')}
                          {u.role === 'ac_land' && (isBn ? 'এসি ল্যান্ড (AC Land)' : 'AC Land')}
                          {u.role === 'sub_registrar' && (isBn ? 'সাব-রেজিস্ট্রার (Sub-Registrar)' : 'Sub-Registrar')}
                          {u.role === 'central_admin' && (isBn ? 'সুপার অ্যাডমিন (Central Admin)' : 'Super Admin')}
                          {!['citizen', 'union_land_officer', 'union_officer', 'ac_land', 'sub_registrar', 'central_admin'].includes(u.role) && u.role}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-700 dark:text-slate-300">
                        {designation}
                      </td>
                      <td className="py-3 px-4 text-slate-600 dark:text-slate-400">
                        {officeName}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => openEditModal(u)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-cyan-700 hover:bg-cyan-800 text-white font-bold rounded-lg text-xs transition cursor-pointer"
                        >
                          <UserCog size={13} />
                          {isBn ? 'রোল পরিবর্তন করুন' : 'Change Role'}
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Role Modal */}
      {editingUser && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className={`bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 ${isBn ? 'font-bengali' : 'font-sans'}`}>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
              <UserCog className="w-5 h-5 text-cyan-600" />
              {isBn ? 'দাপ্তরিক ভূমিকা ও অনুমতি বরাদ্দকরণ' : 'Assign Official Role & Permissions'}
            </h3>

            <form onSubmit={handleRoleUpdate} className="space-y-4 text-xs">
              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <p className="font-bold text-slate-900 dark:text-white">
                  {isBn ? (editingUser.name_bn || editingUser.name) : (editingUser.name_en || editingUser.name || editingUser.name_bn)}
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">{editingUser.email}</p>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300 block">
                  {isBn ? 'সিস্টেম ভূমিকা (Role) *' : 'System Role *'}
                </label>
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 text-xs font-semibold"
                >
                  <option value="citizen">{isBn ? 'নাগরিক (Citizen) — সাধারণ ব্যবহারকারী' : 'Citizen — Public Portal User'}</option>
                  <option value="union_land_officer">{isBn ? 'ইউনিয়ন ভূমি সহকারী কর্মকর্তা (ULAO) — তহশিল প্যানেল' : 'Union Land Assistant Officer (ULAO) — Tahsil Panel'}</option>
                  <option value="ac_land">{isBn ? 'সহকারী কমিশনার (ভূমি) — এসি ল্যান্ড আদালত ও নামজারি প্যানেল' : 'Assistant Commissioner (Land) — AC Land Court & Mutation'}</option>
                  <option value="sub_registrar">{isBn ? 'সাব-রেজিস্ট্রার — দলিল নিবন্ধন প্যানেল' : 'Sub-Registrar — Deed Registration Panel'}</option>
                  <option value="central_admin">{isBn ? 'কেন্দ্রীয় সুপার অ্যাডমিনিস্ট্রেটর — পূর্ণ নিয়ন্ত্রণ' : 'Central Super Administrator — Full Governance'}</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300 block">
                  {isBn ? 'দাপ্তরিক পদবি' : 'Official Designation'}
                </label>
                <input
                  type="text"
                  value={designationBn}
                  onChange={(e) => setDesignationBn(e.target.value)}
                  placeholder={isBn ? 'যেমন: সহকারী কমিশনার (ভূমি)' : 'e.g. Assistant Commissioner (Land)'}
                  className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300 block">
                  {isBn ? 'কর্মস্থলের নাম / সার্কেল' : 'Office / Revenue Circle'}
                </label>
                <input
                  type="text"
                  value={officeNameBn}
                  onChange={(e) => setOfficeNameBn(e.target.value)}
                  placeholder={isBn ? 'যেমন: উপজেলা ভূমি অফিস, গুলশান রাজস্ব সার্কেল' : 'e.g. Upazila Land Office, Gulshan Revenue Circle'}
                  className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 text-xs"
                />
              </div>

              <div className="p-3 rounded-lg bg-cyan-50 dark:bg-cyan-950/40 border border-cyan-200 dark:border-cyan-800 text-cyan-900 dark:text-cyan-300 text-[11px]">
                <strong>{isBn ? 'নিরাপত্তা নিয়মাবলী:' : 'Security Rules:'}</strong>{' '}
                {isBn
                  ? 'পদবি পরিবর্তনের সাথে সাথে সংশ্লিষ্ট ব্যবহারকারীর সেশন পারমিশন ও নির্দিষ্ট অফিস প্যানেলে প্রবেশাধিকার হালনাগাদ হবে। এই কার্যক্রমটি অপরিবর্তনীয় অডিট লগে রেকর্ড থাকবে।'
                  : 'Updating role immediately updates session permissions and panel access. This event is cryptographically recorded in immutable audit logs.'}
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
                  disabled={submitting}
                >
                  {isBn ? 'বাতিল' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 bg-cyan-700 hover:bg-cyan-800 text-white font-bold rounded-lg transition cursor-pointer"
                >
                  {submitting ? (isBn ? 'সংরক্ষণ হচ্ছে...' : 'Saving...') : (isBn ? 'রোল বরাদ্দ নিশ্চিত করুন' : 'Confirm Role Assignment')}
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
