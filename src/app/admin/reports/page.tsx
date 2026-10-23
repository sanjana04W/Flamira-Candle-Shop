'use client';

import React from 'react';
import { BarChart3, TrendingUp, DollarSign, Users, ShoppingCart, Percent, PieChart, ShieldCheck } from 'lucide-react';
import { useStore } from '@/context/StoreContext';
import { formatLKR } from '@/lib/utils';

export default function AdminReportsPage() {
  const { orders, products, customers } = useStore();

  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const completedRevenue = orders
    .filter((o) => o.orderStatus === 'Completed')
    .reduce((sum, o) => sum + o.total, 0);

  const pendingCount = orders.filter((o) => o.orderStatus === 'Pending').length;
  const completedCount = orders.filter((o) => o.orderStatus === 'Completed').length;
  const cancelledCount = orders.filter((o) => o.orderStatus === 'Cancelled' || o.orderStatus === 'Failed Delivery').length;

  const codSuccessRate = orders.length > 0 ? Math.round((completedCount / orders.length) * 100) : 0;
  const averageOrderValue = orders.length > 0 ? Math.round(totalRevenue / orders.length) : 0;

  return (
    <div className="min-h-screen bg-[#FAF7F2] p-6 lg:p-8 space-y-6">
      <div>
        <h1 className="font-serif text-2xl font-bold text-[#281B13]">Financial Reports &amp; Attribution</h1>
        <p className="text-xs text-[#8C7A6B] mt-0.5">
          Measure marketing campaign ROI, COD delivery success, and sales by category.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-[#EBE2D5] shadow-soft">
          <span className="text-[10px] uppercase font-bold text-[#8C7A6B] tracking-wider block">
            Settled Cash Revenue
          </span>
          <span className="font-serif text-2xl font-bold text-[#2E7D32] block mt-1">
            {formatLKR(completedRevenue)}
          </span>
          <span className="text-[11px] text-[#8C7A6B]">Remitted to bank by courier</span>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-[#EBE2D5] shadow-soft">
          <span className="text-[10px] uppercase font-bold text-[#8C7A6B] tracking-wider block">
            Average Order Value (AOV)
          </span>
          <span className="font-serif text-2xl font-bold text-[#281B13] block mt-1">
            {formatLKR(averageOrderValue)}
          </span>
          <span className="text-[11px] text-[#8C7A6B]">Per web checkout order</span>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-[#EBE2D5] shadow-soft">
          <span className="text-[10px] uppercase font-bold text-[#8C7A6B] tracking-wider block">
            COD Fulfillment Success
          </span>
          <span className="font-serif text-2xl font-bold text-[#C45A2C] block mt-1">
            {codSuccessRate}%
          </span>
          <span className="text-[11px] text-green-700 font-semibold">Low return rate</span>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-[#EBE2D5] shadow-soft">
          <span className="text-[10px] uppercase font-bold text-[#8C7A6B] tracking-wider block">
            Repeat Buyer Rate
          </span>
          <span className="font-serif text-2xl font-bold text-[#281B13] block mt-1">
            {customers.length > 0 ? Math.round((customers.filter((c) => c.orderCount > 1).length / customers.length) * 100) : 0}%
          </span>
          <span className="text-[11px] text-[#8C7A6B]">Returning Sri Lankan homes</span>
        </div>
      </div>

      {/* Conversion Funnel Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-3xl p-6 border border-[#EBE2D5] shadow-soft space-y-4">
          <h2 className="font-serif text-base font-bold text-[#281B13]">
            Cash on Delivery Pipeline Funnel
          </h2>

          <div className="space-y-3 text-xs">
            <div>
              <div className="flex justify-between font-semibold mb-1">
                <span>Placed &amp; Pending Verification</span>
                <span>{pendingCount} orders</span>
              </div>
              <div className="w-full h-2.5 bg-[#FAF7F2] rounded-full overflow-hidden">
                <div className="h-full bg-[#FFE082]" style={{ width: `${(pendingCount / Math.max(orders.length, 1)) * 100}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between font-semibold mb-1">
                <span>Successfully Completed &amp; Settled</span>
                <span>{completedCount} orders</span>
              </div>
              <div className="w-full h-2.5 bg-[#FAF7F2] rounded-full overflow-hidden">
                <div className="h-full bg-[#66BB6A]" style={{ width: `${(completedCount / Math.max(orders.length, 1)) * 100}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between font-semibold mb-1">
                <span>Cancelled / Unreachable at Door</span>
                <span>{cancelledCount} orders</span>
              </div>
              <div className="w-full h-2.5 bg-[#FAF7F2] rounded-full overflow-hidden">
                <div className="h-full bg-red-400" style={{ width: `${(cancelledCount / Math.max(orders.length, 1)) * 100}%` }} />
              </div>
            </div>
          </div>
        </div>

        {/* Marketing Attribution */}
        <div className="bg-white rounded-3xl p-6 border border-[#EBE2D5] shadow-soft space-y-4">
          <h2 className="font-serif text-base font-bold text-[#281B13]">
            Marketing Traffic Attribution
          </h2>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between p-3 rounded-xl bg-[#FAF7F2] border border-[#EAE0D3]">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-black" />
                <span className="font-semibold text-[#281B13]">TikTok Videos &amp; Bio Link</span>
              </div>
              <span className="font-bold text-[#C45A2C]">58% of orders</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-[#FAF7F2] border border-[#EAE0D3]">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#1877F2]" />
                <span className="font-semibold text-[#281B13]">Facebook Reels &amp; Page Posts</span>
              </div>
              <span className="font-bold text-[#C45A2C]">28% of orders</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-[#FAF7F2] border border-[#EAE0D3]">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#25D366]" />
                <span className="font-semibold text-[#281B13]">WhatsApp Direct &amp; Word of Mouth</span>
              </div>
              <span className="font-bold text-[#C45A2C]">14% of orders</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
