'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { CheckCircle2, Printer, MessageCircle, Truck, PackageCheck, Clock, ArrowRight } from 'lucide-react';
import { useStore } from '@/context/StoreContext';
import { formatLKR, formatDateTime } from '@/lib/utils';

export default function OrderConfirmationPage() {
  const params = useParams();
  const orderNumber = params?.orderNumber as string;
  const { orders } = useStore();

  const order = orders.find((o) => o.orderNumber === orderNumber) || orders[0];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-[#FAF7F2] min-h-screen py-10 print:bg-white print:py-0">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        {/* Success Card Header */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EBE2D5] shadow-soft text-center mb-6 print:border-none print:shadow-none">
          <div className="w-16 h-16 rounded-full bg-[#E8F5E9] text-[#2E7D32] flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 size={36} />
          </div>

          <span className="text-xs uppercase tracking-widest text-[#C45A2C] font-bold block mb-1">
            Order Confirmed &amp; Placed
          </span>
          <h1 className="font-serif text-3xl font-bold text-[#281B13]">
            Thank You, {order.customer.name}!
          </h1>
          <p className="text-sm text-[#796455] mt-2 max-w-md mx-auto">
            Your order has been recorded in our system. A confirmation message has been queued for your phone.
          </p>

          <div className="mt-5 inline-flex flex-col sm:flex-row items-center gap-3 bg-[#FAF7F2] border border-[#EAE0D3] rounded-2xl px-5 py-3">
            <div className="text-center sm:text-left">
              <span className="text-[10px] text-[#8C7A6B] uppercase font-bold tracking-wider block">
                Order Tracking Number
              </span>
              <span className="font-serif text-xl font-bold text-[#C45A2C]">
                {order.orderNumber}
              </span>
            </div>
            <div className="sm:border-l border-[#DFD5C6] sm:pl-4 text-center sm:text-left">
              <span className="text-[10px] text-[#8C7A6B] uppercase font-bold tracking-wider block">
                Current Status
              </span>
              <span className="inline-block bg-[#FFF8E1] text-[#B78103] border border-[#FFE082] text-xs font-bold px-2.5 py-0.5 rounded-full mt-0.5">
                {order.orderStatus} (Awaiting Verification)
              </span>
            </div>
          </div>
        </div>

        {/* Invoice Summary Box */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EBE2D5] shadow-soft space-y-6 print:border-none print:shadow-none">
          <div className="flex items-center justify-between border-b border-[#F2ECE1] pb-4">
            <div>
              <h2 className="font-serif text-lg font-bold text-[#281B13]">
                Order Details
              </h2>
              <span className="text-xs text-[#8C7A6B]">
                Placed on {formatDateTime(order.createdAt)}
              </span>
            </div>

            <button
              onClick={handlePrint}
              className="print:hidden inline-flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-xl bg-[#FAF7F2] text-[#281B13] border border-[#D5C2B1] hover:bg-[#F2ECE1] transition"
            >
              <Printer size={14} />
              <span>Print Invoice</span>
            </button>
          </div>

          {/* Items Table */}
          <div className="space-y-3">
            {order.items.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between gap-4 py-3 border-b border-[#F5ECE1] last:border-b-0"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-[#FAF7F2] shrink-0 border border-[#EAE0D3]">
                    <Image src={item.image} alt={item.title} fill className="object-cover" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs sm:text-sm font-bold text-[#281B13] truncate">
                      {item.title}
                    </h4>
                    <span className="text-[11px] text-[#8C7A6B] block">
                      Quantity: <strong>{item.quantity}</strong> • SKU: {item.sku}
                    </span>
                    {item.customNote && (
                      <span className="text-[11px] text-[#C45A2C] italic block truncate max-w-sm">
                        Note: &ldquo;{item.customNote}&rdquo;
                      </span>
                    )}
                  </div>
                </div>

                <span className="text-xs sm:text-sm font-bold text-[#281B13] shrink-0">
                  {formatLKR(item.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>

          {/* Customer & Address Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-[#FAF7F2] border border-[#EAE0D3] text-xs">
            <div>
              <span className="text-[#8C7A6B] uppercase font-bold text-[10px] block mb-1">
                Customer Contact
              </span>
              <p className="font-bold text-[#281B13]">{order.customer.name}</p>
              <p className="text-[#5C4A3E]">Phone: {order.customer.phone}</p>
              {order.customer.whatsapp && <p className="text-[#5C4A3E]">WhatsApp: {order.customer.whatsapp}</p>}
              <p className="text-[#5C4A3E]">Email: {order.customer.email}</p>
            </div>

            <div>
              <span className="text-[#8C7A6B] uppercase font-bold text-[10px] block mb-1">
                Delivery Address (Cash on Delivery)
              </span>
              <p className="text-[#281B13] font-medium">{order.deliveryAddress.address}</p>
              <p className="text-[#5C4A3E]">
                {order.deliveryAddress.city}, {order.deliveryAddress.district} District
              </p>
              {order.deliveryAddress.postalCode && (
                <p className="text-[#5C4A3E]">Postal Code: {order.deliveryAddress.postalCode}</p>
              )}
            </div>
          </div>

          {/* Pricing Breakdown */}
          <div className="space-y-1.5 text-xs text-[#5C4A3E] pt-2 border-t border-[#F2ECE1]">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-semibold text-[#281B13]">{formatLKR(order.subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery Fee ({order.deliveryAddress.district})</span>
              <span>{order.deliveryFee === 0 ? <strong className="text-green-700">FREE</strong> : formatLKR(order.deliveryFee)}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-green-700 font-semibold">
                <span>Discount</span>
                <span>-{formatLKR(order.discount)}</span>
              </div>
            )}
            <div className="flex justify-between text-base font-bold text-[#281B13] pt-3 border-t border-[#EFE8DF]">
              <span>Cash Amount Payable on Delivery</span>
              <span className="text-[#C45A2C] text-xl font-bold">{formatLKR(order.total)}</span>
            </div>
          </div>

          {/* Next Steps Accordion */}
          <div className="p-4 rounded-2xl bg-[#FFFBF7] border border-[#ECDCCB] space-y-3 print:hidden">
            <h4 className="font-serif font-bold text-sm text-[#281B13] flex items-center gap-2">
              <Clock size={16} className="text-[#C45A2C]" />
              <span>What Happens Next?</span>
            </h4>
            <div className="space-y-2 text-xs text-[#5C4A3E]">
              <div className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-[#FAF3EA] text-[#C45A2C] font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                  1
                </span>
                <span>Our studio will verify your order via WhatsApp / Call from <strong>071 116 8590</strong>.</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-[#FAF3EA] text-[#C45A2C] font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                  2
                </span>
                <span>We lovingly pack your order in sustainable packaging with wax seals.</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-[#FAF3EA] text-[#C45A2C] font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                  3
                </span>
                <span>Dispatched via third-party courier. Hand over {formatLKR(order.total)} cash upon delivery!</span>
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="pt-2 flex flex-col sm:flex-row items-center gap-3 print:hidden">
            <a
              href={`https://wa.me/94711168590?text=Hi%20Flamira,%20I%20just%20placed%20order%20${order.orderNumber}.%20Can%20you%20please%20confirm%20delivery?`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:flex-1 bg-[#25D366] hover:bg-[#20BA5C] text-white font-bold py-3 px-4 rounded-2xl text-center text-xs flex items-center justify-center gap-2 shadow-sm transition"
            >
              <MessageCircle size={16} />
              <span>WhatsApp Flamira Regarding {order.orderNumber}</span>
            </a>

            <Link
              href="/track"
              className="w-full sm:w-auto bg-[#FAF7F2] hover:bg-[#F2ECE1] text-[#281B13] border border-[#D5C2B1] font-bold py-3 px-6 rounded-2xl text-center text-xs transition"
            >
              Track Order
            </Link>

            <Link
              href="/shop"
              className="w-full sm:w-auto bg-[#C45A2C] hover:bg-[#B24B20] text-white font-bold py-3 px-6 rounded-2xl text-center text-xs transition"
            >
              Back to Store
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
