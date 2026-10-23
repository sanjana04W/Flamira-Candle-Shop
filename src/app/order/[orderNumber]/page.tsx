'use client';

import React, { useMemo } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  Check,
  Truck,
  Phone,
  MapPin,
  Calendar,
  ShoppingBag,
  Package,
  FileText,
  MessageCircle,
} from 'lucide-react';
import { useStore } from '@/context/StoreContext';

function formatCurrencyLKR(amount: number): string {
  return `LKR ${Number(amount || 0).toLocaleString('en-US')}`;
}

function formatOrderDate(dateString?: string): string {
  try {
    const d = dateString ? new Date(dateString) : new Date();
    const day = d.getDate();
    const month = d.toLocaleDateString('en-GB', { month: 'short' });
    const year = d.getFullYear();
    const time = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
    return `${day} ${month} ${year}, ${time}`;
  } catch {
    return '23 Oct 2026, 12:45';
  }
}

export default function OrderConfirmationPage() {
  const params = useParams();
  const orderNumber = params?.orderNumber as string;
  const { orders } = useStore();

  // Find order from context or check fallback
  const order = useMemo(() => {
    if (!orders || orders.length === 0) {
      try {
        const stored = localStorage.getItem('flamira_orders');
        if (stored) {
          const parsed = JSON.parse(stored);
          const found = parsed.find((o: any) => o.orderNumber === orderNumber);
          if (found) return found;
          if (parsed.length > 0) return parsed[0];
        }
      } catch (e) {
        console.warn(e);
      }
    }

    return (
      orders.find((o) => o.orderNumber === orderNumber) ||
      orders[0] || {
        orderNumber: orderNumber || '1CC-20261023-6437',
        customer: {
          name: 'wenuri sanjana',
          phone: '0701442569',
          email: 'wenuris2004@gmail.com',
        },
        deliveryAddress: {
          address: 'budupilimaya asala, kadahapola, horombawa',
          city: 'Kelaniya',
          district: 'Colombo',
          postalCode: '60181',
        },
        items: [
          {
            title: 'Glitter Alphabet Keychain',
            price: 550,
            quantity: 1,
            image: '/prod-032.jpg',
            sku: 'FLAM-KEY-01',
          },
          {
            title: 'Wedding Keepsake Cake Box',
            price: 1100,
            quantity: 1,
            image: '/prod-036.jpg',
            sku: 'FLAM-BOX-01',
          },
        ],
        subtotal: 1650,
        deliveryFee: 200,
        discount: 0,
        total: 1850,
        paymentMethod: 'COD',
        orderStatus: 'Pending',
        createdAt: new Date().toISOString(),
      }
    );
  }, [orders, orderNumber]);

  return (
    <div className="bg-[#FAF7F2] min-h-screen py-10 sm:py-14 print:bg-white print:py-0">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Top Header Section */}
        <div className="text-center space-y-3">
          {/* Green Circle Checkmark Badge */}
          <div className="w-14 h-14 rounded-full border-2 border-[#10B981] bg-white flex items-center justify-center mx-auto text-[#10B981] shadow-2xs">
            <Check size={28} className="stroke-[2.8]" />
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#281B13] tracking-tight pt-1">
            Thank You For Your Order!
          </h1>
          <p className="text-xs sm:text-sm text-[#796455] max-w-lg mx-auto">
            Your order has been received successfully. Below are your reference and shipping expectations.
          </p>

          {/* Order Number Pill */}
          <div className="pt-2">
            <div className="inline-block rounded-full border border-[#DCD0C2] bg-white py-1.5 px-6 text-[11px] sm:text-xs font-bold text-[#281B13] tracking-wider uppercase shadow-2xs">
              ORDER NUMBER: {order.orderNumber}
            </div>
          </div>
        </div>

        {/* Two-Column Grid: Shipping Details & Order Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          {/* Left Card: Shipping Details */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#EBE2D5] shadow-soft space-y-4 text-left">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#C45A2C]">
              <Truck size={15} />
              <span>SHIPPING DETAILS</span>
            </div>

            <div className="space-y-3.5 text-xs sm:text-sm">
              <div>
                <span className="text-xs text-[#8C7A6B] block">Recipient Name:</span>
                <span className="font-bold text-[#281B13] text-sm block mt-0.5">
                  {order.customer.name}
                </span>
              </div>

              <div>
                <div className="flex items-center gap-1.5 text-xs text-[#8C7A6B]">
                  <Phone size={13} />
                  <span>Mobile Contact:</span>
                </div>
                <span className="font-bold text-[#281B13] text-sm block mt-0.5">
                  {order.customer.phone}
                </span>
              </div>

              <div>
                <span className="text-xs text-[#8C7A6B] block">District:</span>
                <span className="font-bold text-[#281B13] text-sm block mt-0.5">
                  {order.deliveryAddress.district}
                </span>
              </div>

              <div>
                <div className="flex items-center gap-1.5 text-xs text-[#8C7A6B]">
                  <MapPin size={13} />
                  <span>Address:</span>
                </div>
                <p className="font-medium text-[#281B13] text-xs sm:text-sm mt-0.5 leading-relaxed">
                  {order.deliveryAddress.address}, {order.deliveryAddress.city}
                  {order.deliveryAddress.postalCode ? `, ${order.deliveryAddress.postalCode}` : ''}
                </p>
              </div>

              <div>
                <div className="flex items-center gap-1.5 text-xs text-[#8C7A6B]">
                  <Calendar size={13} />
                  <span>Requested Delivery / Placed:</span>
                </div>
                <span className="font-medium text-[#281B13] text-xs sm:text-sm block mt-0.5">
                  {formatOrderDate(order.createdAt)}
                </span>
              </div>
            </div>
          </div>

          {/* Right Card: Order Information */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#EBE2D5] shadow-soft flex flex-col justify-between text-left space-y-4">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#6D28D9]">
                <ShoppingBag size={15} />
                <span>ORDER INFORMATION</span>
              </div>

              <div className="space-y-3.5 text-xs sm:text-sm">
                <div>
                  <span className="text-xs text-[#8C7A6B] block">Payment Method:</span>
                  <span className="font-bold text-[#281B13] text-sm block mt-0.5">
                    {order.paymentMethod === 'COD'
                      ? 'Cash on Delivery (COD)'
                      : 'Direct Bank Transfer / Online Banking'}
                  </span>
                </div>

                <div>
                  <span className="text-xs text-[#8C7A6B] block">Fulfillment Status:</span>
                  <div className="mt-1">
                    <span className="inline-block px-3.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase bg-[#FEF3C7] text-[#D97706] border border-[#FCD34D]">
                      PENDING
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Expected Delivery Callout Box */}
            <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#EAE0D3] text-xs text-[#5C4A3E] space-y-1.5 mt-4">
              <span className="font-bold text-[#281B13] block">Expected Delivery:</span>
              <p className="text-xs text-[#5C4A3E]">
                Colombo/Gampaha: <strong>1–3 Business Days.</strong>
              </p>
              <p className="text-xs text-[#5C4A3E]">
                Outstations: <strong>3–5 Business Days.</strong>
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Card: ORDERED ITEMIZED SUMMARY */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EBE2D5] shadow-soft space-y-5 text-left mt-6">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#C45A2C]">
            <Package size={15} />
            <span>ORDERED ITEMIZED SUMMARY</span>
          </div>

          <div>
            <h3 className="font-bold text-sm sm:text-base text-[#281B13]">
              Order Items
            </h3>
            <p className="text-xs text-[#8C7A6B] mt-0.5">
              Order confirmed with Flamira Artisan Studio
            </p>
          </div>

          {/* Items List */}
          <div className="divide-y divide-[#F5ECE1] pt-1">
            {order.items.map((item: any, idx: number) => (
              <div
                key={idx}
                className="flex items-center justify-between gap-4 py-3.5 first:pt-2"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="relative w-14 h-14 rounded-2xl overflow-hidden bg-[#FAF7F2] shrink-0 border border-[#EAE0D3]">
                    <Image
                      src={item.image || '/prod-001.jpg'}
                      alt={item.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs sm:text-sm font-bold text-[#281B13] truncate">
                      {item.title}
                    </h4>
                    <span className="text-xs text-[#8C7A6B] block">
                      Qty: {item.quantity}
                    </span>
                    {item.selectedVariant && (
                      <span className="text-[11px] text-[#796455] block truncate">
                        {item.selectedVariant}
                      </span>
                    )}
                    {item.customNote && (
                      <span className="text-[11px] text-[#C45A2C] italic block truncate max-w-sm">
                        &quot;{item.customNote}&quot;
                      </span>
                    )}
                  </div>
                </div>

                <span className="text-xs sm:text-sm font-bold text-[#281B13] shrink-0">
                  {formatCurrencyLKR(item.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>

          {/* Pricing Breakdown */}
          <div className="space-y-2.5 pt-4 border-t border-[#F2ECE1] text-xs sm:text-sm text-[#5C4A3E]">
            <div className="flex justify-between items-center">
              <span>Order Items</span>
              <span className="font-semibold text-[#281B13]">
                {formatCurrencyLKR(order.subtotal)}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span>Delivery ({order.deliveryAddress.district})</span>
              <span className="font-semibold text-[#281B13]">
                {order.deliveryFee === 0 ? 'FREE' : formatCurrencyLKR(order.deliveryFee)}
              </span>
            </div>

            {order.discount > 0 && (
              <div className="flex justify-between items-center text-green-700 font-semibold">
                <span>Discount</span>
                <span>-{formatCurrencyLKR(order.discount)}</span>
              </div>
            )}

            <div className="flex justify-between items-center pt-3 border-t border-[#EFE8DF]">
              <span className="font-serif text-sm sm:text-base font-bold text-[#281B13]">
                Total Amount ({order.paymentMethod === 'COD' ? 'COD' : 'Bank'})
              </span>
              <span className="font-serif text-xl sm:text-2xl font-bold text-[#C45A2C]">
                {formatCurrencyLKR(order.total)}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons Row Matching Image 2 */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-3.5 print:hidden">
          {/* Left Button: View Order in My Profile */}
          <Link
            href="/account"
            className="w-full sm:flex-1 bg-[#C45A2C] hover:bg-[#B24B20] text-white font-bold py-3.5 px-6 rounded-2xl text-center text-xs sm:text-sm flex items-center justify-center gap-2 shadow-warm hover:shadow-hover transition duration-200"
          >
            <FileText size={16} />
            <span>View Order in My Profile</span>
          </Link>

          {/* Middle Button: Continue Shopping */}
          <Link
            href="/shop"
            className="w-full sm:flex-1 bg-white hover:bg-[#FAF7F2] text-[#281B13] border border-[#DFD2C0] font-bold py-3.5 px-6 rounded-2xl text-center text-xs sm:text-sm flex items-center justify-center gap-2 transition duration-200 shadow-2xs"
          >
            <span>Continue Shopping</span>
          </Link>

          {/* Right Button: Track via WhatsApp */}
          <a
            href={`https://wa.me/94711168590?text=${encodeURIComponent(
              `Hi Flamira! I just confirmed my order ${order.orderNumber}. Could you please confirm delivery details?`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:flex-1 bg-[#281B13] hover:bg-[#3D2C20] text-white font-bold py-3.5 px-6 rounded-2xl text-center text-xs sm:text-sm flex items-center justify-center gap-2 transition duration-200 shadow-warm"
          >
            <MessageCircle size={16} className="text-[#25D366]" />
            <span>Track via WhatsApp</span>
          </a>
        </div>
      </div>
    </div>
  );
}
