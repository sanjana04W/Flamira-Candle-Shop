'use client';

import React, { useState } from 'react';
import { Truck, Save, ShieldCheck, MapPin, Check } from 'lucide-react';
import { SRI_LANKA_DISTRICTS } from '@/data/initialData';
import { formatLKR } from '@/lib/utils';
import { useStore } from '@/context/StoreContext';

export default function AdminDeliveryPage() {
  const { showToast } = useStore();
  const [rates, setRates] = useState(SRI_LANKA_DISTRICTS);
  const [freeThreshold, setFreeThreshold] = useState('3500');
  const [couriers, setCouriers] = useState([
    { name: 'PromptX Courier', active: true, contact: '011 234 5678', codSettlementDays: '2 Business Days' },
    { name: 'Koombiyo Delivery', active: true, contact: '011 789 0123', codSettlementDays: '3 Business Days' },
    { name: 'Domex Courier', active: true, contact: '011 456 7890', codSettlementDays: '2 Business Days' },
    { name: 'Fardar Express', active: false, contact: '011 901 2345', codSettlementDays: '5 Business Days' },
  ]);

  const handleRateChange = (district: string, newRate: number) => {
    setRates((prev) =>
      prev.map((d) => (d.district === district ? { ...d, rate: newRate } : d))
    );
  };

  const handleSave = () => {
    showToast('Delivery rates and courier configurations saved successfully!');
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-[#281B13]">
            Delivery &amp; Shipping Rates
          </h1>
          <p className="text-xs text-[#8C7A6B] mt-0.5">
            Configure island-wide delivery charges across all 25 Sri Lankan districts and courier partner settlements.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="bg-[#C45A2C] hover:bg-[#B24B20] text-white text-xs font-semibold px-5 py-2.5 rounded-xl transition shadow-warm flex items-center gap-1.5"
        >
          <Save size={15} />
          <span>Save Changes</span>
        </button>
      </div>

      {/* Free Delivery Threshold Box */}
      <div className="bg-white rounded-3xl p-6 border border-[#EBE2D5] shadow-soft">
        <h2 className="font-serif text-base font-bold text-[#281B13] mb-3">
          Free Delivery Incentive Configuration
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
          <div>
            <label className="block text-xs font-semibold text-[#4A3B32] mb-1">
              Free Delivery Order Value (LKR)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-[#8C7A6B]">Rs.</span>
              <input
                type="number"
                value={freeThreshold}
                onChange={(e) => setFreeThreshold(e.target.value)}
                className="w-full bg-[#FAF7F2] border border-[#DCD0C2] rounded-xl py-2 pl-9 pr-3 text-xs text-[#281B13] font-bold"
              />
            </div>
          </div>
          <div className="sm:col-span-2 text-xs text-[#796455] space-y-1">
            <p>
              💡 Orders equal to or above <strong>{formatLKR(parseInt(freeThreshold, 10) || 0)}</strong> will automatically receive 100% Free Island-Wide Delivery at checkout.
            </p>
            <p className="text-[#8C7A6B]">
              This directly drives higher average order values (AOV) for multiple candle &amp; wax sachet bundles.
            </p>
          </div>
        </div>
      </div>

      {/* Courier Partners */}
      <div className="bg-white rounded-3xl p-6 border border-[#EBE2D5] shadow-soft">
        <h2 className="font-serif text-base font-bold text-[#281B13] mb-3">
          Active Courier Partners (Cash on Delivery)
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {couriers.map((c, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-2xl border transition ${
                c.active ? 'bg-[#FAF7F2] border-[#D5C2B1]' : 'bg-stone-50 border-stone-200 opacity-60'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-xs text-[#281B13]">{c.name}</span>
                <input
                  type="checkbox"
                  checked={c.active}
                  onChange={() => {
                    const updated = [...couriers];
                    updated[idx].active = !updated[idx].active;
                    setCouriers(updated);
                  }}
                  className="rounded text-[#C45A2C] focus:ring-[#C45A2C]"
                />
              </div>
              <p className="text-[11px] text-[#8C7A6B]">Contact: {c.contact}</p>
              <p className="text-[11px] text-[#2E7D32] font-medium mt-1">
                COD Remittance: {c.codSettlementDays}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* District Rates Table */}
      <div className="bg-white rounded-3xl border border-[#EBE2D5] shadow-soft overflow-hidden">
        <div className="p-5 border-b border-[#F2ECE1] flex items-center justify-between">
          <h2 className="font-serif text-base font-bold text-[#281B13]">
            District Shipping Rate Schedule (25 Districts)
          </h2>
          <span className="text-xs text-[#8C7A6B]">Auto-applied in cart &amp; checkout</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="bg-[#FAF7F2] border-b border-[#F2ECE1]">
              <tr>
                {['District', 'Province', 'Delivery Charge (LKR)', 'Estimated Arrival', 'Action'].map(
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
              {rates.map((d) => (
                <tr key={d.district} className="hover:bg-[#FAF7F2] transition">
                  <td className="px-5 py-3.5 font-bold text-[#281B13]">{d.district}</td>
                  <td className="px-5 py-3.5 text-[#5C4A3E]">{d.province} Province</td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[#8C7A6B]">Rs.</span>
                      <input
                        type="number"
                        value={d.rate}
                        onChange={(e) => handleRateChange(d.district, parseInt(e.target.value, 10) || 0)}
                        className="w-24 bg-[#FAF7F2] border border-[#DCD0C2] rounded-lg px-2.5 py-1 text-xs font-bold text-[#281B13]"
                      />
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-[#4A3B32]">{d.estimatedDays}</td>
                  <td className="px-5 py-3.5">
                    <button
                      onClick={handleSave}
                      className="text-[11px] text-[#C45A2C] font-semibold hover:underline"
                    >
                      Update
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
