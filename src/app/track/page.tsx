'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Search, Package, Clock, Truck, CheckCircle2, ShieldCheck, Phone, AlertCircle } from 'lucide-react';
import { useStore } from '@/context/StoreContext';
import { formatLKR, formatDateTime } from '@/lib/utils';
import { OrderStatus } from '@/types';

const STATUS_STEPS: OrderStatus[] = [
  'Pending',
  'Confirmed',
  'Processing',
  'Ready to Dispatch',
  'Dispatched',
  'Delivered',
  'Completed',
];

export default function TrackOrderPage() {
  const { orders } = useStore();
  const [query, setQuery] = useState('');
  const [searched, setSearched] = useState(false);
  const [foundOrder, setFoundOrder] = useState<any>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearched(true);
    const clean = query.trim().toUpperCase();

    const matched = orders.find(
      (o) =>
        o.orderNumber.toUpperCase() === clean ||
        o.customer.phone.replace(/[^0-9]/g, '').includes(clean.replace(/[^0-9]/g, ''))
    );
    setFoundOrder(matched || null);
  };

  const getStepIndex = (status: OrderStatus) => {
    return STATUS_STEPS.indexOf(status);
  };

  return (
    <div className="bg-[#FAF7F2] min-h-screen py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-xl mx-auto mb-8">
          <span className="text-xs uppercase tracking-widest text-[#C45A2C] font-bold block mb-1">
            Real-Time Order Tracking
          </span>
          <h1 className="font-serif text-3xl font-bold text-[#281B13]">
            Track Your Parcel
          </h1>
          <p className="text-sm text-[#796455] mt-2">
            Enter your Order ID (e.g. FLM-00017) or your registered 10-digit Sri Lankan phone number to check current fulfillment and courier status.
          </p>
        </div>

        {/* Search Box */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EBE2D5] shadow-soft mb-8">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Enter Order # (e.g. FLM-00017) or Phone"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                required
                className="w-full bg-[#FAF7F2] border border-[#DCD0C2] rounded-2xl py-3 pl-11 pr-4 text-sm text-[#281B13] uppercase placeholder:normal-case focus:outline-none focus:ring-1 focus:ring-[#C45A2C]"
              />
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8C7A6B]"
              />
            </div>
            <button
              type="submit"
              className="bg-[#C45A2C] hover:bg-[#B24B20] text-white text-sm font-semibold px-8 py-3 rounded-2xl transition shadow-warm"
            >
              Track Order
            </button>
          </form>

          {/* Quick Demo links */}
          <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-[#8C7A6B]">
            <span>Try sample order:</span>
            <button
              onClick={() => {
                setQuery('FLM-00017');
                const matched = orders.find((o) => o.orderNumber === 'FLM-00017');
                setFoundOrder(matched);
                setSearched(true);
              }}
              className="underline text-[#C45A2C] font-semibold"
            >
              FLM-00017 (Pending)
            </button>
            <span>•</span>
            <button
              onClick={() => {
                setQuery('FLM-00016');
                const matched = orders.find((o) => o.orderNumber === 'FLM-00016');
                setFoundOrder(matched);
                setSearched(true);
              }}
              className="underline text-[#C45A2C] font-semibold"
            >
              FLM-00016 (Confirmed)
            </button>
            <span>•</span>
            <button
              onClick={() => {
                setQuery('FLM-00010');
                const matched = orders.find((o) => o.orderNumber === 'FLM-00010');
                setFoundOrder(matched);
                setSearched(true);
              }}
              className="underline text-[#C45A2C] font-semibold"
            >
              FLM-00010 (Completed)
            </button>
          </div>
        </div>

        {/* Search Results */}
        {searched && (
          <div>
            {!foundOrder ? (
              <div className="bg-white rounded-3xl p-8 border border-[#EBE2D5] text-center shadow-soft">
                <AlertCircle size={36} className="text-[#C45A2C] mx-auto mb-3" />
                <h3 className="font-serif text-lg font-bold text-[#281B13]">No Order Found</h3>
                <p className="text-xs text-[#796455] mt-1 max-w-sm mx-auto">
                  We couldn’t find an order with &quot;{query}&quot;. Please double check your order number or phone number, or contact us directly on WhatsApp.
                </p>
                <a
                  href="https://wa.me/94711168590?text=Hi%20Flamira,%20I'm%20trying%20to%20track%20my%20order."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-[#128C7E] bg-[#25D366]/10 px-4 py-2 rounded-full"
                >
                  Ask Flamira Support on WhatsApp
                </a>
              </div>
            ) : (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EBE2D5] shadow-soft space-y-6">
                {/* Status Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#F2ECE1] pb-4">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#8C7A6B] tracking-wider block">
                      Order Details
                    </span>
                    <h3 className="font-serif text-2xl font-bold text-[#281B13]">
                      {foundOrder.orderNumber}
                    </h3>
                    <span className="text-xs text-[#8C7A6B]">
                      Placed on {formatDateTime(foundOrder.createdAt)}
                    </span>
                  </div>

                  <div className="text-left sm:text-right">
                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#FAF3EA] text-[#C45A2C] border border-[#E9DAC8] inline-block">
                      Status: {foundOrder.orderStatus}
                    </span>
                    <span className="block text-xs text-green-700 font-semibold mt-1">
                      {foundOrder.paymentMethod} • Total: {formatLKR(foundOrder.total)}
                    </span>
                  </div>
                </div>

                {/* Status Progress Stepper */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#665446] mb-4">
                    Fulfillment Journey
                  </h4>
                  <div className="space-y-4">
                    {STATUS_STEPS.map((step, idx) => {
                      const currentIdx = getStepIndex(foundOrder.orderStatus);
                      const isCompleted = idx <= currentIdx;
                      const isCurrent = idx === currentIdx;

                      return (
                        <div key={step} className="flex items-start gap-3">
                          <div
                            className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-colors ${
                              isCompleted
                                ? 'bg-[#C45A2C] text-white shadow-sm'
                                : 'bg-[#FAF7F2] text-stone-400 border border-[#E2D5C4]'
                            }`}
                          >
                            {isCompleted ? '✓' : idx + 1}
                          </div>
                          <div className="flex-1 min-w-0">
                            <span
                              className={`text-xs font-bold block ${
                                isCurrent ? 'text-[#C45A2C]' : isCompleted ? 'text-[#281B13]' : 'text-stone-400'
                              }`}
                            >
                              {step}
                            </span>
                            {isCurrent && (
                              <p className="text-[11px] text-[#796455] mt-0.5">
                                Current active state. Updates will be notified via SMS/WhatsApp.
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Courier info if dispatched */}
                {foundOrder.courier && (
                  <div className="p-4 rounded-2xl bg-[#F5FBF5] border border-[#CCE8CC] flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-[#2E7D32] block">Courier Dispatched</span>
                      <p className="text-[#4A3B32]">
                        Partner: <strong>{foundOrder.courier.name}</strong> • Tracking #: <strong>{foundOrder.courier.trackingNo}</strong>
                      </p>
                    </div>
                    <span className="text-xl">🚚</span>
                  </div>
                )}

                {/* Items in order */}
                <div className="pt-4 border-t border-[#F2ECE1]">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#665446] mb-3">
                    Items in This Order
                  </h4>
                  <div className="space-y-2">
                    {foundOrder.items.map((i: any, idx: number) => (
                      <div key={idx} className="flex justify-between text-xs py-1.5 border-b border-[#FAF7F2]">
                        <span className="font-medium text-[#281B13]">
                          {i.quantity}× {i.title}
                        </span>
                        <span className="font-bold text-[#281B13]">
                          {formatLKR(i.price * i.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Delivery Address summary */}
                <div className="p-3.5 rounded-2xl bg-[#FAF7F2] border border-[#EAE0D3] text-xs space-y-1">
                  <span className="font-bold text-[#281B13] block">Delivery Recipient:</span>
                  <p>{foundOrder.customer.name} ({foundOrder.customer.phone})</p>
                  <p>{foundOrder.deliveryAddress.address}, {foundOrder.deliveryAddress.city}, {foundOrder.deliveryAddress.district}</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
