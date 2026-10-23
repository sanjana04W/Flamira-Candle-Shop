'use client';

import React, { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search, Filter, Phone, MessageCircle, Truck, ExternalLink, Printer, CheckCircle2 } from 'lucide-react';
import { useStore } from '@/context/StoreContext';
import { formatLKR, formatDateTime } from '@/lib/utils';
import { Order, OrderStatus } from '@/types';
import { OrderDetailsModal } from '@/components/admin/OrderDetailsModal';

const STATUS_COLORS: Record<OrderStatus, string> = {
  Pending: 'bg-[#FFF8E1] text-[#B78103] border border-[#FFE082]',
  Confirmed: 'bg-[#E3F2FD] text-[#1565C0] border border-[#90CAF9]',
  Processing: 'bg-[#EDE7F6] text-[#4527A0] border border-[#CE93D8]',
  'Ready to Dispatch': 'bg-[#E8EAF6] text-[#283593] border border-[#9FA8DA]',
  Dispatched: 'bg-[#E8F5E9] text-[#1B5E20] border border-[#A5D6A7]',
  Delivered: 'bg-[#F1F8E9] text-[#33691E] border border-[#C5E1A5]',
  Completed: 'bg-[#E8F5E9] text-[#1B5E20] border border-[#66BB6A]',
  Cancelled: 'bg-red-50 text-red-700 border border-red-200',
  'Failed Delivery': 'bg-orange-50 text-orange-700 border border-orange-200',
};

const ALL_STATUSES: (OrderStatus | 'All')[] = [
  'All',
  'Pending',
  'Confirmed',
  'Processing',
  'Ready to Dispatch',
  'Dispatched',
  'Delivered',
  'Completed',
  'Cancelled',
];

function AdminOrdersContent() {
  const { orders } = useStore();
  const searchParams = useSearchParams();
  const initialStatus = (searchParams.get('status') as OrderStatus) || 'All';

  const [selectedStatus, setSelectedStatus] = useState<OrderStatus | 'All'>(initialStatus);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const filteredOrders = orders.filter((order) => {
    if (selectedStatus !== 'All' && order.orderStatus !== selectedStatus) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchNum = order.orderNumber.toLowerCase().includes(q);
      const matchName = order.customer.name.toLowerCase().includes(q);
      const matchPhone = order.customer.phone.toLowerCase().includes(q);
      const matchDistrict = order.deliveryAddress.district.toLowerCase().includes(q);
      if (!matchNum && !matchName && !matchPhone && !matchDistrict) return false;
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-[#FAF7F2] p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-[#281B13]">Order Management</h1>
          <p className="text-xs text-[#8C7A6B] mt-0.5">
            Manage incoming Cash on Delivery orders, phone verifications, and courier dispatch.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className="font-semibold text-[#8C7A6B]">Total Orders:</span>
          <span className="font-bold text-[#281B13] bg-white px-3 py-1 rounded-full border border-[#EBE2D5]">
            {orders.length}
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-[#EBE2D5] shadow-soft space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search by Order #, Customer Name, Phone (e.g. 0770122331), District..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#FAF7F2] border border-[#DCD0C2] rounded-2xl py-2.5 pl-11 pr-4 text-xs text-[#281B13] focus:outline-none focus:ring-1 focus:ring-[#C45A2C]"
            />
            <Search
              size={16}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8C7A6B]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 text-xs"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Status Pill Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar pt-2 border-t border-[#F2ECE1]">
          {ALL_STATUSES.map((status) => {
            const count =
              status === 'All'
                ? orders.length
                : orders.filter((o) => o.orderStatus === status).length;

            return (
              <button
                key={status}
                onClick={() => setSelectedStatus(status)}
                className={`text-xs font-semibold px-3.5 py-1.5 rounded-full whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  selectedStatus === status
                    ? 'bg-[#281B13] text-white shadow-xs'
                    : 'bg-[#FAF7F2] text-[#5C4A3E] hover:bg-[#F2ECE1] border border-[#EAE0D3]'
                }`}
              >
                <span>{status}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    selectedStatus === status
                      ? 'bg-white/20 text-white'
                      : 'bg-[#EAE0D3] text-[#5C4A3E]'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-3xl border border-[#EBE2D5] shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="bg-[#FAF7F2] border-b border-[#F2ECE1]">
              <tr>
                {['Order #', 'Customer & Contact', 'Items', 'Total', 'District', 'Status', 'Date', 'Action'].map(
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
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-xs text-[#8C7A6B]">
                    No orders found matching the filter criteria.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="hover:bg-[#FAF7F2] transition cursor-pointer"
                    onClick={() => setSelectedOrder(order)}
                  >
                    <td className="px-5 py-4 font-bold text-[#281B13] whitespace-nowrap">
                      {order.orderNumber}
                    </td>

                    <td className="px-5 py-4">
                      <div className="font-semibold text-[#281B13] flex items-center gap-1.5">
                        <span>{order.customer.name}</span>
                        {order.isEmailVerified && (
                          <span className="bg-[#E8F5E9] text-[#2E7D32] border border-[#A5D6A7] text-[9px] font-bold px-1.5 py-0.5 rounded-full inline-flex items-center gap-0.5">
                            <CheckCircle2 size={9} /> Email Verified
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-[#8C7A6B] flex items-center gap-1.5 mt-0.5">
                        <Phone size={10} />
                        <span>{order.customer.phone}</span>
                      </div>
                    </td>

                    <td className="px-5 py-4 max-w-[220px]">
                      <div className="space-y-0.5">
                        {order.items.map((i, idx) => (
                          <div key={idx} className="truncate text-[11px] text-[#4A3B32]">
                            <strong>{i.quantity}×</strong> {i.title}
                          </div>
                        ))}
                      </div>
                    </td>

                    <td className="px-5 py-4 font-bold text-[#C45A2C] whitespace-nowrap">
                      {formatLKR(order.total)}
                      <span className="block text-[10px] text-stone-400 font-normal">
                        {order.paymentMethod}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-[#4A3B32] whitespace-nowrap">
                      {order.deliveryAddress.district}
                    </td>

                    <td className="px-5 py-4 whitespace-nowrap">
                      <span
                        className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                          STATUS_COLORS[order.orderStatus]
                        }`}
                      >
                        {order.orderStatus}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-[#8C7A6B] whitespace-nowrap">
                      {formatDateTime(order.createdAt)}
                    </td>

                    <td className="px-5 py-4 whitespace-nowrap">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedOrder(order);
                        }}
                        className="text-[11px] font-semibold text-[#C45A2C] hover:underline flex items-center gap-1"
                      >
                        <span>Manage</span>
                        <ExternalLink size={11} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Details & Lifecycle Modal */}
      {selectedOrder && (
        <OrderDetailsModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}
    </div>
  );
}

export default function AdminOrdersPage() {
  return (
    <Suspense fallback={<div className="p-8 text-xs text-[#8C7A6B]">Loading orders...</div>}>
      <AdminOrdersContent />
    </Suspense>
  );
}
