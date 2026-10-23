'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  X,
  Printer,
  Phone,
  MessageCircle,
  Truck,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Clock,
  ShieldCheck,
} from 'lucide-react';
import { Order, OrderStatus } from '@/types';
import { formatLKR, formatDateTime } from '@/lib/utils';
import { useStore } from '@/context/StoreContext';

interface OrderDetailsModalProps {
  order: Order | null;
  onClose: () => void;
}

export const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({ order, onClose }) => {
  const { updateOrderStatus } = useStore();
  const [courierName, setCourierName] = useState('PromptX Courier');
  const [trackingNo, setTrackingNo] = useState('');
  const [noteText, setNoteText] = useState('');
  const [showCourierInput, setShowCourierInput] = useState(false);

  if (!order) return null;

  const handleStatusChange = (newStatus: OrderStatus) => {
    if (newStatus === 'Dispatched' && !showCourierInput && !order.courier) {
      setShowCourierInput(true);
      return;
    }

    const courierPayload =
      newStatus === 'Dispatched' && courierName && trackingNo
        ? { name: courierName, trackingNo }
        : undefined;

    updateOrderStatus(order.orderNumber, newStatus, noteText || undefined, courierPayload);
    setShowCourierInput(false);
    setNoteText('');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-[#EBE2D5] flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-[#F2ECE1] flex items-center justify-between sticky top-0 bg-white z-10">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-serif text-xl font-bold text-[#281B13]">
                {order.orderNumber}
              </h3>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#FAF3EA] text-[#C45A2C] border border-[#E8DEC8]">
                {order.orderStatus}
              </span>
            </div>
            <p className="text-xs text-[#8C7A6B] mt-0.5">
              Placed {formatDateTime(order.createdAt)} • Guest COD
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="p-2 text-[#796455] hover:text-[#281B13] rounded-xl hover:bg-[#FAF7F2] transition"
              title="Print Order Sheet"
            >
              <Printer size={18} />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-stone-400 hover:text-stone-700 rounded-xl hover:bg-[#FAF7F2] transition"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 flex-1 text-xs sm:text-sm">
          {/* Status Progression Bar */}
          <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#EAE0D3] space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[#281B13] text-xs uppercase tracking-wider">
                Quick Status Action
              </span>
              <span className="text-xs text-[#8C7A6B]">
                Current: <strong className="text-[#C45A2C]">{order.orderStatus}</strong>
              </span>
            </div>

            <div className="flex flex-wrap gap-2 pt-1">
              {order.orderStatus === 'Pending' && (
                <button
                  onClick={() => handleStatusChange('Confirmed')}
                  className="bg-[#2E7D32] hover:bg-[#256828] text-white px-4 py-2 rounded-xl text-xs font-bold transition shadow-xs flex items-center gap-1.5"
                >
                  <Phone size={13} />
                  <span>Verify &amp; Confirm Order</span>
                </button>
              )}

              {order.orderStatus === 'Confirmed' && (
                <button
                  onClick={() => handleStatusChange('Processing')}
                  className="bg-[#C45A2C] hover:bg-[#AD4C21] text-white px-4 py-2 rounded-xl text-xs font-bold transition shadow-xs"
                >
                  Start Packing / Processing
                </button>
              )}

              {order.orderStatus === 'Processing' && (
                <button
                  onClick={() => handleStatusChange('Ready to Dispatch')}
                  className="bg-[#8D5B4C] hover:bg-[#72483C] text-white px-4 py-2 rounded-xl text-xs font-bold transition shadow-xs"
                >
                  Ready for Courier Pickup
                </button>
              )}

              {(order.orderStatus === 'Ready to Dispatch' || order.orderStatus === 'Confirmed') && (
                <button
                  onClick={() => handleStatusChange('Dispatched')}
                  className="bg-[#1877F2] hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition shadow-xs flex items-center gap-1.5"
                >
                  <Truck size={13} />
                  <span>Mark as Dispatched</span>
                </button>
              )}

              {order.orderStatus === 'Dispatched' && (
                <button
                  onClick={() => handleStatusChange('Completed')}
                  className="bg-[#2E7D32] hover:bg-green-800 text-white px-4 py-2 rounded-xl text-xs font-bold transition shadow-xs flex items-center gap-1.5"
                >
                  <CheckCircle2 size={13} />
                  <span>Cash Settled (Completed)</span>
                </button>
              )}

              {order.orderStatus !== 'Cancelled' && order.orderStatus !== 'Completed' && (
                <button
                  onClick={() => {
                    if (confirm('Cancel this order and automatically restore product stock?')) {
                      handleStatusChange('Cancelled');
                    }
                  }}
                  className="bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 px-3 py-2 rounded-xl text-xs font-semibold transition ml-auto"
                >
                  Cancel Order
                </button>
              )}
            </div>

            {/* Courier Dispatch Drawer Form */}
            {showCourierInput && (
              <div className="p-3 bg-white rounded-xl border border-[#DFD5C6] space-y-2 mt-3 animate-fadeIn">
                <span className="font-bold text-xs text-[#281B13] block">
                  Courier Details for Customer Dispatch Notification
                </span>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <label className="block text-[10px] text-[#8C7A6B] font-semibold mb-1">
                      Courier Service
                    </label>
                    <select
                      value={courierName}
                      onChange={(e) => setCourierName(e.target.value)}
                      className="w-full bg-[#FAF7F2] border border-[#DCD0C2] rounded-lg px-2 py-1.5"
                    >
                      <option value="PromptX Courier">PromptX Courier</option>
                      <option value="Koombiyo Delivery">Koombiyo Delivery</option>
                      <option value="Domex Courier">Domex Courier</option>
                      <option value="Fardar Express">Fardar Express</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] text-[#8C7A6B] font-semibold mb-1">
                      Tracking Number *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. PX-889123"
                      value={trackingNo}
                      onChange={(e) => setTrackingNo(e.target.value)}
                      className="w-full bg-[#FAF7F2] border border-[#DCD0C2] rounded-lg px-2 py-1.5 text-xs font-mono"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-1">
                  <button
                    onClick={() => setShowCourierInput(false)}
                    className="text-stone-400 hover:text-stone-700 text-xs px-2 py-1"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleStatusChange('Dispatched')}
                    disabled={!trackingNo.trim()}
                    className="bg-[#1877F2] text-white text-xs font-bold px-4 py-1.5 rounded-lg disabled:opacity-40"
                  >
                    Confirm Dispatch
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Customer & Delivery Information */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-white border border-[#EAE0D3] space-y-2">
              <span className="text-[10px] uppercase font-bold text-[#8C7A6B] tracking-wider block">
                Customer Profile
              </span>
              <div className="flex items-center gap-2">
                <p className="font-bold text-sm text-[#281B13]">{order.customer.name}</p>
                {order.isEmailVerified && (
                  <span className="bg-[#E8F5E9] text-[#2E7D32] border border-[#A5D6A7] text-[9px] font-bold px-1.5 py-0.5 rounded-full inline-flex items-center gap-0.5">
                    Email Verified
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 text-xs">
                <a
                  href={`tel:${order.customer.phone}`}
                  className="font-semibold text-[#C45A2C] hover:underline flex items-center gap-1"
                >
                  <Phone size={12} />
                  <span>{order.customer.phone}</span>
                </a>
                <a
                  href={`https://wa.me/${order.customer.phone.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#25D366] hover:underline flex items-center gap-1 font-semibold"
                >
                  <MessageCircle size={12} />
                  <span>WhatsApp</span>
                </a>
              </div>
              <p className="text-xs text-[#796455]">{order.customer.email}</p>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-[#EAE0D3] space-y-1">
              <span className="text-[10px] uppercase font-bold text-[#8C7A6B] tracking-wider block">
                Delivery Destination ({order.deliveryAddress.district})
              </span>
              <p className="text-xs text-[#281B13] font-medium leading-relaxed">
                {order.deliveryAddress.address}
              </p>
              <p className="text-xs text-[#5C4A3E]">
                {order.deliveryAddress.city}, {order.deliveryAddress.district} District
              </p>
              {order.deliveryAddress.postalCode && (
                <p className="text-xs text-[#8C7A6B]">Postal: {order.deliveryAddress.postalCode}</p>
              )}
            </div>
          </div>

          {/* Gift note */}
          {order.giftNote && (
            <div className="p-3.5 rounded-2xl bg-[#FFF8E1] border border-[#FFE082] text-xs">
              <span className="font-bold text-[#8C6B00] block mb-0.5">
                Customer Note / Gift Note:
              </span>
              <p className="text-[#5C4A3E] italic">&ldquo;{order.giftNote}&rdquo;</p>
            </div>
          )}

          {/* Items Table */}
          <div className="border border-[#EBE2D5] rounded-2xl overflow-hidden">
            <div className="bg-[#FAF7F2] px-4 py-2 text-[10px] font-bold text-[#8C7A6B] uppercase tracking-wider flex justify-between">
              <span>Item Description</span>
              <span>Amount</span>
            </div>
            <div className="divide-y divide-[#F2ECE1]">
              {order.items.map((i, idx) => (
                <div key={idx} className="p-3.5 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-[#FAF7F2] shrink-0 border border-[#EAE0D3]">
                      <Image src={i.image} alt={i.title} fill className="object-cover" />
                    </div>
                    <div className="min-w-0">
                      <span className="font-bold text-xs text-[#281B13] block truncate">
                        {i.title}
                      </span>
                      <span className="text-[11px] text-[#8C7A6B]">
                        {i.quantity} × {formatLKR(i.price)} (SKU: {i.sku})
                      </span>
                      {i.customNote && (
                        <span className="text-[10px] text-[#C45A2C] italic block truncate">
                          &quot;{i.customNote}&quot;
                        </span>
                      )}
                    </div>
                  </div>
                  <span className="font-bold text-xs text-[#281B13] shrink-0">
                    {formatLKR(i.price * i.quantity)}
                  </span>
                </div>
              ))}
            </div>

            {/* Calculations Footer */}
            <div className="p-4 bg-[#FAF7F2] border-t border-[#EBE2D5] space-y-1.5 text-xs text-[#5C4A3E]">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatLKR(order.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Charge ({order.deliveryAddress.district})</span>
                <span>{order.deliveryFee === 0 ? 'FREE' : formatLKR(order.deliveryFee)}</span>
              </div>
              <div className="flex justify-between font-bold text-sm text-[#281B13] pt-2 border-t border-[#EAE0D3]">
                <span>Total Due (COD)</span>
                <span className="text-[#C45A2C] text-base">{formatLKR(order.total)}</span>
              </div>
            </div>
          </div>

          {/* Status History Audit Log */}
          <div>
            <span className="text-[10px] uppercase font-bold text-[#8C7A6B] tracking-wider block mb-2">
              Status Movement History (Audit Trail)
            </span>
            <div className="space-y-1.5">
              {order.statusHistory.map((h, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-xl bg-[#FAF7F2] border border-[#EAE0D3] flex items-center justify-between text-xs"
                >
                  <div>
                    <strong className="text-[#281B13]">{h.status}</strong>
                    {h.note && <span className="text-[#796455] ml-2">— {h.note}</span>}
                  </div>
                  <span className="text-[10px] text-[#8C7A6B] shrink-0 ml-2">
                    {formatDateTime(h.timestamp)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
