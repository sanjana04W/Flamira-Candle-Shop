'use client';

import React, { useState } from 'react';
import { Search, Phone, MessageCircle, Mail, MapPin, Download, UserCheck, ShieldAlert, Heart } from 'lucide-react';
import { useStore } from '@/context/StoreContext';
import { formatLKR, formatDateTime } from '@/lib/utils';
import { Customer } from '@/types';

export default function AdminCustomersPage() {
  const { customers, orders } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  const filtered = customers.filter((c) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        c.name.toLowerCase().includes(q) ||
        c.phone.includes(q) ||
        c.email.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const exportCSV = () => {
    const headers = ['Name,Phone,WhatsApp,Email,Order Count,Total Spent (LKR),Last Order Date'];
    const rows = customers.map(
      (c) =>
        `"${c.name}","${c.phone}","${c.whatsapp || ''}","${c.email}",${c.orderCount},${c.totalSpent},"${c.lastOrderAt}"`
    );
    const content = [...headers, ...rows].join('\n');
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `flamira_customers_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-[#281B13]">Customer CRM Lite</h1>
          <p className="text-xs text-[#8C7A6B] mt-0.5">
            Owned first-party customer directory keyed by Sri Lankan phone number.
          </p>
        </div>

        <button
          onClick={exportCSV}
          className="bg-white hover:bg-[#FAF7F2] text-[#281B13] border border-[#D5C2B1] text-xs font-semibold px-4 py-2 rounded-xl transition flex items-center gap-1.5 shadow-xs"
        >
          <Download size={14} className="text-[#C45A2C]" />
          <span>Export Customer CSV</span>
        </button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-3xl p-4 border border-[#EBE2D5] shadow-soft flex items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            placeholder="Search by customer name, phone (+94 / 07X), or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#FAF7F2] border border-[#DCD0C2] rounded-2xl py-2 pl-10 pr-4 text-xs text-[#281B13] focus:outline-none focus:ring-1 focus:ring-[#C45A2C]"
          />
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8C7A6B]" />
        </div>

        <span className="text-xs text-[#8C7A6B]">
          Showing {filtered.length} customers
        </span>
      </div>

      {/* Customer Directory Table */}
      <div className="bg-white rounded-3xl border border-[#EBE2D5] shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="bg-[#FAF7F2] border-b border-[#F2ECE1]">
              <tr>
                {['Customer', 'Phone & WhatsApp', 'Total Orders', 'Lifetime Value', 'Primary District', 'Last Order', 'Status'].map(
                  (header) => (
                    <th
                      key={header}
                      className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-[#8C7A6B]"
                    >
                      {header}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F5EFE8]">
              {filtered.map((cust) => {
                const isRepeat = cust.orderCount > 1;
                const primaryDistrict = cust.addresses[0]?.district || 'Colombo';

                return (
                  <tr
                    key={cust.id}
                    onClick={() => setSelectedCustomer(cust)}
                    className="hover:bg-[#FAF7F2] transition cursor-pointer"
                  >
                    <td className="px-5 py-4">
                      <div className="font-bold text-[#281B13] flex items-center gap-1.5 flex-wrap">
                        <span>{cust.name}</span>
                        {isRepeat && (
                          <span className="bg-[#FBEFEA] text-[#943B17] text-[9px] font-bold px-1.5 py-0.5 rounded-full border border-[#ECC3B1]">
                            Repeat VIP
                          </span>
                        )}
                        {cust.isEmailVerified && (
                          <span className="bg-[#E8F5E9] text-[#2E7D32] text-[9px] font-bold px-1.5 py-0.5 rounded-full border border-[#A5D6A7] inline-flex items-center gap-0.5">
                            <UserCheck size={9} /> Verified
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-[#8C7A6B]">{cust.email}</span>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <a
                          href={`tel:${cust.phone}`}
                          onClick={(e) => e.stopPropagation()}
                          className="font-mono text-[#281B13] hover:text-[#C45A2C] flex items-center gap-1"
                        >
                          <Phone size={11} className="text-[#8C7A6B]" />
                          <span>{cust.phone}</span>
                        </a>
                        <a
                          href={`https://wa.me/${cust.phone.replace(/[^0-9]/g, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="p-1 rounded-full text-[#25D366] hover:bg-[#E8F5E9]"
                          title="Message on WhatsApp"
                        >
                          <MessageCircle size={14} />
                        </a>
                      </div>
                    </td>

                    <td className="px-5 py-4 font-bold text-[#281B13]">
                      {cust.orderCount} orders
                    </td>

                    <td className="px-5 py-4 font-bold text-[#C45A2C]">
                      {formatLKR(cust.totalSpent)}
                    </td>

                    <td className="px-5 py-4 text-[#4A3B32]">
                      {primaryDistrict}
                    </td>

                    <td className="px-5 py-4 text-[#8C7A6B]">
                      {formatDateTime(cust.lastOrderAt)}
                    </td>

                    <td className="px-5 py-4">
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-green-700 bg-green-50 px-2.5 py-0.5 rounded-full">
                        <UserCheck size={11} /> Verified COD
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Customer Drawer Details Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-[#EBE2D5] space-y-5">
            <div className="flex items-center justify-between border-b border-[#F2ECE1] pb-3">
              <div>
                <h3 className="font-serif text-lg font-bold text-[#281B13]">
                  {selectedCustomer.name}
                </h3>
                <span className="text-xs text-[#8C7A6B]">{selectedCustomer.phone}</span>
              </div>
              <button
                onClick={() => setSelectedCustomer(null)}
                className="text-stone-400 hover:text-stone-700"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-[#FAF7F2] border border-[#EAE0D3]">
                <span className="text-[10px] text-[#8C7A6B] block">Total Orders</span>
                <span className="text-lg font-bold text-[#281B13]">
                  {selectedCustomer.orderCount}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-[#FAF7F2] border border-[#EAE0D3]">
                <span className="text-[10px] text-[#8C7A6B] block">Lifetime Value</span>
                <span className="text-lg font-bold text-[#C45A2C]">
                  {formatLKR(selectedCustomer.totalSpent)}
                </span>
              </div>
            </div>

            {selectedCustomer.notes && (
              <div className="p-3 rounded-xl bg-[#FFF8E1] border border-[#FFE082] text-xs">
                <span className="font-bold text-[#8C6B00] block mb-0.5">Staff Notes:</span>
                <p className="text-[#5C4A3E]">{selectedCustomer.notes}</p>
              </div>
            )}

            <div>
              <span className="text-xs font-bold text-[#281B13] block mb-2">Saved Addresses:</span>
              <div className="space-y-1.5">
                {selectedCustomer.addresses.map((addr, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-[#FAF7F2] text-xs text-[#4A3B32]">
                    <p className="font-medium">{addr.address}</p>
                    <p className="text-[#796455]">{addr.city}, {addr.district} District</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2 flex gap-2">
              <a
                href={`https://wa.me/${selectedCustomer.phone.replace(/[^0-9]/g, '')}?text=Hi%20${encodeURIComponent(
                  selectedCustomer.name
                )},%20this%20is%20Flamira%20Candle%20Studio!`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 bg-[#25D366] text-white text-xs font-bold py-2.5 px-4 rounded-xl text-center flex items-center justify-center gap-1.5"
              >
                <MessageCircle size={15} />
                <span>Open WhatsApp Chat</span>
              </a>
              <button
                onClick={() => setSelectedCustomer(null)}
                className="px-4 py-2.5 rounded-xl border border-[#D5C2B1] text-xs font-semibold hover:bg-[#FAF7F2]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
