'use client';

import React, { useState } from 'react';
import { Users, Shield, Plus, Lock } from 'lucide-react';
import { useStore } from '@/context/StoreContext';

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'Owner' | 'Manager' | 'Order Staff' | 'Content Editor';
  status: 'Active' | 'Invited';
}

export default function AdminUsersPage() {
  const { showToast } = useStore();
  const [users, setUsers] = useState<AdminUser[]>([
    { id: '1', name: 'Flamira Owner', email: 'candlesflamira@gmail.com', role: 'Owner', status: 'Active' },
    { id: '2', name: 'Packing & Order Staff', email: 'dispatch@flamira.lk', role: 'Order Staff', status: 'Active' },
  ]);

  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<'Manager' | 'Order Staff' | 'Content Editor'>('Order Staff');

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail.trim()) return;

    setUsers([
      ...users,
      {
        id: `u-${Date.now()}`,
        name: inviteEmail.split('@')[0],
        email: inviteEmail.trim(),
        role: inviteRole,
        status: 'Invited',
      },
    ]);
    setInviteEmail('');
    showToast(`Invitation sent to ${inviteEmail}`);
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] p-6 lg:p-8 space-y-6">
      <div>
        <h1 className="font-serif text-2xl font-bold text-[#281B13]">User Control &amp; Staff Roles</h1>
        <p className="text-xs text-[#8C7A6B] mt-0.5">
          Role-based access control (RBAC) enforced via Firebase custom claims.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Users Table */}
        <div className="lg:col-span-8 bg-white rounded-3xl border border-[#EBE2D5] shadow-soft overflow-hidden">
          <div className="p-5 border-b border-[#F2ECE1]">
            <h2 className="font-serif text-base font-bold text-[#281B13]">
              Authorized Administrative Accounts
            </h2>
          </div>

          <div className="divide-y divide-[#F5EFE8] text-xs">
            {users.map((u) => (
              <div key={u.id} className="p-4 sm:p-5 flex items-center justify-between gap-4">
                <div>
                  <span className="font-bold text-[#281B13] block">{u.name}</span>
                  <span className="text-[11px] text-[#8C7A6B]">{u.email}</span>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`font-semibold px-3 py-1 rounded-full text-[10px] ${
                      u.role === 'Owner'
                        ? 'bg-[#FBEFEA] text-[#943B17] border border-[#ECC3B1]'
                        : 'bg-[#FAF7F2] text-[#4A3B32] border border-[#EAE0D3]'
                    }`}
                  >
                    {u.role}
                  </span>

                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      u.status === 'Active' ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'
                    }`}
                  >
                    {u.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Invite User Box */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-6 border border-[#EBE2D5] shadow-soft space-y-4">
          <h2 className="font-serif text-base font-bold text-[#281B13]">
            Invite Staff Member
          </h2>

          <form onSubmit={handleInvite} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-[#4A3B32] mb-1">
                Staff Email Address *
              </label>
              <input
                type="email"
                required
                placeholder="staff@flamira.lk"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                className="w-full bg-[#FAF7F2] border border-[#DCD0C2] rounded-xl px-3 py-2 text-[#281B13]"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#4A3B32] mb-1">
                Assigned Role
              </label>
              <select
                value={inviteRole}
                onChange={(e) => setInviteRole(e.target.value as any)}
                className="w-full bg-[#FAF7F2] border border-[#DCD0C2] rounded-xl px-3 py-2 text-[#281B13]"
              >
                <option value="Order Staff">Order Staff / Packer (Orders Only)</option>
                <option value="Manager">Manager (Catalogue &amp; Orders)</option>
                <option value="Content Editor">Content Editor (Banners &amp; Posts)</option>
              </select>
            </div>

            <div className="p-3 rounded-xl bg-[#FAF7F2] border border-[#EAE0D3] text-[11px] text-[#796455] space-y-1">
              <p><strong>Order Staff:</strong> Can view orders, verify phones, update statuses, enter courier tracking numbers. Blocked from store revenue and pricing.</p>
            </div>

            <button
              type="submit"
              className="w-full bg-[#C45A2C] hover:bg-[#B24B20] text-white font-bold py-2.5 px-4 rounded-xl shadow-warm transition"
            >
              Send Invite Link
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
