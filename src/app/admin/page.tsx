'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ShoppingCart,
  DollarSign,
  AlertTriangle,
  Package,
  ExternalLink,
  Plus,
  TrendingUp,
  Clock,
  CheckCircle2,
  Truck,
  XCircle,
} from 'lucide-react';
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

export default function AdminDashboard() {
  const { orders, products, customers } = useStore();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const today = new Date().toDateString();
  const todayOrders = orders.filter(
    (o) => new Date(o.createdAt).toDateString() === today
  );

  const thisMonthRevenue = orders
    .filter((o) => o.orderStatus === 'Completed')
    .reduce((sum, o) => sum + o.total, 0);

  const pendingOrders = orders.filter((o) => o.orderStatus === 'Pending');
  const lowStockItems = products.filter(
    (p) => p.stockQty <= p.lowStockThreshold && p.stockQty > 0
  );
  const outOfStockItems = products.filter((p) => p.stockQty === 0);

  return (
    <div className="min-h-screen bg-[#FAF7F2] p-6 lg:p-8 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-[#281B13]">Store Dashboard</h1>
          <p className="text-xs text-[#8C7A6B] mt-0.5">Welcome back to Flamira Candle & Décor Studio Admin.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/shop"
            target="_blank"
            className="text-xs font-semibold px-4 py-2 rounded-xl bg-white text-[#4A3B32] border border-[#D5C2B1] hover:bg-[#FAF7F2] transition flex items-center gap-1.5"
          >
            <ExternalLink size={14} />
            <span>View Live Store</span>
          </Link>
          <button
            onClick={() => setSelectedOrder(null)}
            className="text-xs font-semibold px-4 py-2 rounded-xl bg-[#C45A2C] text-white hover:bg-[#B24B20] transition flex items-center gap-1.5 shadow-warm"
          >
            <Plus size={14} />
            <span>+ New Product</span>
          </button>
        </div>
      </div>

      {/* Stat Cards — matching Image 1 layout exactly */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Today's Orders */}
        <div className="bg-white rounded-2xl p-5 border border-[#EBE2D5] shadow-soft">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#8C7A6B]">
                Today's Orders
              </span>
              <div className="font-serif text-3xl font-bold text-[#281B13] mt-1">
                {todayOrders.length}
              </div>
              <span className="text-[11px] text-[#8C7A6B]">Received today</span>
            </div>
            <div className="w-9 h-9 rounded-xl bg-[#FAF3EA] flex items-center justify-center text-[#C45A2C]">
              <ShoppingCart size={18} />
            </div>
          </div>
          <Link
            href="/admin/orders"
            className="mt-3 text-[11px] font-semibold text-[#C45A2C] hover:underline flex items-center gap-1"
          >
            <span>View →</span>
          </Link>
        </div>

        {/* This Month Revenue */}
        <div className="bg-white rounded-2xl p-5 border border-[#EBE2D5] shadow-soft">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#8C7A6B]">
                This Month's Revenue
              </span>
              <div className="font-serif text-2xl font-bold text-[#281B13] mt-1">
                {formatLKR(thisMonthRevenue)}
              </div>
              <span className="text-[11px] text-[#8C7A6B]">Completed orders only</span>
            </div>
            <div className="w-9 h-9 rounded-xl bg-[#F4FBF4] flex items-center justify-center text-[#2E7D32]">
              <DollarSign size={18} />
            </div>
          </div>
          <Link
            href="/admin/reports"
            className="mt-3 text-[11px] font-semibold text-[#C45A2C] hover:underline flex items-center gap-1"
          >
            <span>View →</span>
          </Link>
        </div>

        {/* Pending Orders — highlighted orange per Image 1 */}
        <div className="bg-[#FFFBF2] rounded-2xl p-5 border-2 border-[#F6C85E] shadow-soft">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#B78103]">
                Pending Orders
              </span>
              <div className="font-serif text-4xl font-bold text-[#281B13] mt-1">
                {pendingOrders.length}
              </div>
              <span className="text-[11px] text-[#B78103] font-semibold">Awaiting verification</span>
            </div>
            <div className="w-9 h-9 rounded-xl bg-[#FFF3CD] flex items-center justify-center text-[#B78103]">
              <Clock size={18} />
            </div>
          </div>
          <Link
            href="/admin/orders?status=Pending"
            className="mt-3 text-[11px] font-semibold text-[#C45A2C] hover:underline flex items-center gap-1"
          >
            <span>View →</span>
          </Link>
        </div>

        {/* Low Stock Items */}
        <div className="bg-white rounded-2xl p-5 border border-[#EBE2D5] shadow-soft">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#8C7A6B]">
                Low Stock Items
              </span>
              <div className="font-serif text-3xl font-bold text-[#281B13] mt-1">
                {lowStockItems.length}
              </div>
              <span className="text-[11px] text-[#8C7A6B]">Needs restocking</span>
            </div>
            <div className="w-9 h-9 rounded-xl bg-red-50 flex items-center justify-center text-red-600">
              <AlertTriangle size={18} />
            </div>
          </div>
          <Link
            href="/admin/inventory"
            className="mt-3 text-[11px] font-semibold text-[#C45A2C] hover:underline flex items-center gap-1"
          >
            <span>View →</span>
          </Link>
        </div>
      </div>

      {/* Pending Orders Action Cards — like Image 1 */}
      <div className="bg-white rounded-3xl border border-[#EBE2D5] shadow-soft overflow-hidden">
        <div className="p-5 border-b border-[#F2ECE1] flex items-center justify-between">
          <h2 className="font-serif text-base font-bold text-[#281B13]">
            Action Required: Pending Orders ({pendingOrders.length})
          </h2>
          <Link
            href="/admin/orders?status=Pending"
            className="text-xs font-semibold text-[#C45A2C] hover:underline flex items-center gap-1"
          >
            View all {pendingOrders.length} pending orders →
          </Link>
        </div>

        {pendingOrders.length === 0 ? (
          <div className="p-8 text-center">
            <CheckCircle2 size={32} className="text-green-600 mx-auto mb-2" />
            <p className="text-sm font-semibold text-[#281B13]">All caught up!</p>
            <p className="text-xs text-[#8C7A6B]">No pending orders need verification right now.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-0 divide-x divide-y divide-[#F2ECE1]">
            {pendingOrders.slice(0, 6).map((order) => (
              <div
                key={order.id}
                className="p-5 hover:bg-[#FAF7F2] transition"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <span className="font-bold text-sm text-[#281B13]">{order.orderNumber}</span>
                    <span className="ml-2 text-[10px] font-bold bg-[#FFF8E1] text-[#B78103] border border-[#FFE082] px-2 py-0.5 rounded-full">
                      Pending
                    </span>
                  </div>
                </div>

                <p className="font-semibold text-xs text-[#281B13]">{order.customer.name}</p>
                <p className="text-[11px] text-[#8C7A6B]">{order.customer.phone}</p>

                <div className="mt-2 space-y-0.5">
                  {order.items.map((item, idx) => (
                    <p key={idx} className="text-[11px] text-[#796455] truncate">
                      {item.quantity}× {item.title}
                    </p>
                  ))}
                </div>

                <div className="mt-3 flex items-center justify-between">
                  <span className="font-bold text-sm text-[#C45A2C]">
                    {formatLKR(order.total)}
                  </span>
                  <button
                    onClick={() => setSelectedOrder(order)}
                    className="text-[11px] font-semibold text-[#C45A2C] hover:underline flex items-center gap-1"
                  >
                    Open Details <ExternalLink size={11} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recent Orders Table — like Image 1 */}
      <div className="bg-white rounded-3xl border border-[#EBE2D5] shadow-soft overflow-hidden">
        <div className="p-5 border-b border-[#F2ECE1] flex items-center justify-between">
          <h2 className="font-serif text-base font-bold text-[#281B13]">Recent Customer Orders</h2>
          <Link
            href="/admin/orders"
            className="text-xs font-semibold text-[#C45A2C] hover:underline"
          >
            View all orders →
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="bg-[#FAF7F2] border-b border-[#F2ECE1]">
              <tr>
                {['Order #', 'Customer', 'Total', 'Status', 'Date', 'Action'].map((h) => (
                  <th
                    key={h}
                    className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-[#8C7A6B]"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F5EFE8]">
              {orders.slice(0, 10).map((order) => (
                <tr
                  key={order.id}
                  className="hover:bg-[#FAF7F2] transition cursor-pointer"
                  onClick={() => setSelectedOrder(order)}
                >
                  <td className="px-5 py-3.5 font-bold text-[#281B13]">
                    {order.orderNumber}
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="font-semibold text-[#281B13]">{order.customer.name}</div>
                    <div className="text-[10px] text-[#8C7A6B]">{order.customer.phone}</div>
                  </td>
                  <td className="px-5 py-3.5 font-bold text-[#C45A2C]">
                    {formatLKR(order.total)}
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${STATUS_COLORS[order.orderStatus]}`}>
                      {order.orderStatus}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-[#8C7A6B]">
                    {formatDateTime(order.createdAt)}
                  </td>
                  <td className="px-5 py-3.5">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedOrder(order);
                      }}
                      className="text-[11px] font-semibold text-[#C45A2C] hover:underline"
                    >
                      Open Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-4 border border-[#EBE2D5] shadow-soft text-center">
          <div className="text-xl font-bold text-[#281B13]">{products.length}</div>
          <div className="text-[11px] text-[#8C7A6B]">Total Products</div>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-[#EBE2D5] shadow-soft text-center">
          <div className="text-xl font-bold text-[#281B13]">{customers.length}</div>
          <div className="text-[11px] text-[#8C7A6B]">Total Customers</div>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-[#EBE2D5] shadow-soft text-center">
          <div className="text-xl font-bold text-[#281B13]">
            {orders.filter((o) => o.orderStatus === 'Completed').length}
          </div>
          <div className="text-[11px] text-[#8C7A6B]">Completed Orders</div>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-red-100 shadow-soft text-center">
          <div className="text-xl font-bold text-red-600">{outOfStockItems.length}</div>
          <div className="text-[11px] text-[#8C7A6B]">Out of Stock</div>
        </div>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <OrderDetailsModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}
    </div>
  );
}
