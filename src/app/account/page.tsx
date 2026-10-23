'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User, Package, Phone, Mail, LogOut, ArrowRight, ShoppingBag, ShieldCheck } from 'lucide-react';
import { useCustomerAuth } from '@/context/CustomerAuthContext';
import { useStore } from '@/context/StoreContext';
import { formatLKR, formatDateTime } from '@/lib/utils';

export default function CustomerAccountPage() {
  const router = useRouter();
  const { customer, isAuthenticated, logout } = useCustomerAuth();
  const { orders } = useStore();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/account/login');
    }
  }, [isAuthenticated, router]);

  if (!customer) {
    return (
      <div className="min-h-[60vh] bg-[#FAF7F2] flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-[#B85834] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Filter orders matching customer's phone or email
  const customerOrders = orders.filter(
    (o) =>
      (customer.phone && o.customer.phone.includes(customer.phone.replace(/[^0-9]/g, ''))) ||
      (customer.email && o.customer.email.toLowerCase() === customer.email.toLowerCase())
  );

  return (
    <div className="min-h-[80vh] bg-[#FAF7F2] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Welcome Banner */}
        <div className="bg-white rounded-[28px] border border-[#EFE8DF] p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-[#FAF3EA] border border-[#E8DEC8] flex items-center justify-center text-[#B85834]">
              <User size={28} />
            </div>
            <div>
              <span className="text-[11px] uppercase tracking-wider text-[#8C7A6B] font-bold block">
                Flamira Member Account
              </span>
              <h1 className="font-serif text-2xl font-bold text-[#281B13]">
                Welcome, {customer.name}
              </h1>
              <p className="text-xs text-[#796455] mt-0.5">{customer.email}</p>
            </div>
          </div>

          <button
            onClick={() => {
              logout();
              router.push('/account/login');
            }}
            className="flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-xl border border-[#DFD5C6] text-[#796455] hover:text-[#B85834] hover:bg-[#FAF7F2] transition"
          >
            <LogOut size={14} />
            <span>Sign Out</span>
          </button>
        </div>

        {/* Account Details & Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-3xl border border-[#EFE8DF] p-6 shadow-sm space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#8C7A6B] block">
              Contact Profile
            </span>
            <div className="space-y-2 text-xs text-[#4A3B32]">
              <p className="flex items-center gap-2">
                <User size={14} className="text-[#B85834]" />
                <span className="font-semibold">{customer.name}</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail size={14} className="text-[#B85834]" />
                <span>{customer.email}</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone size={14} className="text-[#B85834]" />
                <span>{customer.phone}</span>
              </p>
            </div>
            <p className="text-[11px] text-[#2E7D32] bg-green-50 px-2.5 py-1 rounded-lg inline-flex items-center gap-1 mt-2">
              <ShieldCheck size={12} />
              <span>Saved for faster COD checkout</span>
            </p>
          </div>

          <div className="bg-white rounded-3xl border border-[#EFE8DF] p-6 shadow-sm space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#8C7A6B] block">
              Orders Placed
            </span>
            <div className="font-serif text-3xl font-bold text-[#281B13]">
              {customerOrders.length}
            </div>
            <p className="text-xs text-[#796455]">
              Track deliveries and inspect itemized Cash on Delivery receipts.
            </p>
            <Link
              href="/track"
              className="text-xs font-semibold text-[#B85834] hover:underline inline-flex items-center gap-1 pt-1"
            >
              <span>Track with Order ID</span>
              <ArrowRight size={12} />
            </Link>
          </div>

          <div className="bg-white rounded-3xl border border-[#EFE8DF] p-6 shadow-sm space-y-3 flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#8C7A6B] block">
                Storefront
              </span>
              <h3 className="font-serif text-base font-bold text-[#281B13] mt-1">
                Explore Botanical Collections
              </h3>
              <p className="text-xs text-[#796455] mt-1">
                Pure soy wax candles, wax sachets &amp; bespoke hampers.
              </p>
            </div>
            <Link
              href="/shop"
              className="w-full bg-[#B85834] hover:bg-[#A34B29] text-white text-xs font-semibold py-2.5 px-4 rounded-xl text-center transition flex items-center justify-center gap-1.5"
            >
              <ShoppingBag size={14} />
              <span>Browse Shop</span>
            </Link>
          </div>
        </div>

        {/* Order History */}
        <div className="bg-white rounded-[28px] border border-[#EFE8DF] p-6 sm:p-8 shadow-sm">
          <h2 className="font-serif text-lg font-bold text-[#281B13] mb-4">
            Recent Orders
          </h2>

          {customerOrders.length === 0 ? (
            <div className="text-center py-8 text-xs text-[#796455] space-y-2">
              <Package size={32} className="mx-auto text-stone-300" />
              <p>No orders linked to your phone/email yet.</p>
              <Link href="/shop" className="text-[#B85834] font-semibold hover:underline block pt-1">
                Start shopping now →
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-[#F2ECE1] text-xs">
              {customerOrders.map((ord) => (
                <div key={ord.id} className="py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div>
                    <span className="font-bold text-[#281B13] text-sm">{ord.orderNumber}</span>
                    <span className="text-[11px] text-[#8C7A6B] ml-2">{formatDateTime(ord.createdAt)}</span>
                    <p className="text-[#5C4A3E] mt-0.5">
                      {ord.items.map((i) => `${i.quantity}× ${i.title}`).join(', ')}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-[#B85834] text-sm">{formatLKR(ord.total)}</span>
                    <span className="bg-[#FAF3EA] text-[#B85834] text-[10px] font-bold px-2.5 py-1 rounded-full border border-[#E8DEC8]">
                      {ord.orderStatus}
                    </span>
                    <Link
                      href={`/order/${ord.orderNumber}`}
                      className="text-[#B85834] hover:underline font-semibold"
                    >
                      View Receipt
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
