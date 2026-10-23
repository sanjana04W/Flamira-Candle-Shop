'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Trash2, Plus, Minus, ArrowRight, ShieldCheck, Tag, ShoppingBag, Truck } from 'lucide-react';
import { useStore } from '@/context/StoreContext';
import { formatLKR } from '@/lib/utils';
import { SRI_LANKA_DISTRICTS } from '@/data/initialData';

export default function CartPage() {
  const router = useRouter();
  const {
    cart,
    cartSubtotal,
    deliveryFee,
    finalTotal,
    discountAmount,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    updateCartQuantity,
    removeFromCart,
    selectedDistrict,
    setSelectedDistrict,
  } = useStore();

  const [couponCode, setCouponCode] = useState('');
  const [couponMsg, setCouponMsg] = useState<{ text: string; error: boolean } | null>(null);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    const res = applyCoupon(couponCode);
    setCouponMsg({ text: res.message, error: !res.success });
    if (res.success) setCouponCode('');
  };

  const freeDeliveryThreshold = 3500;
  const distanceToFree = Math.max(0, freeDeliveryThreshold - cartSubtotal);
  const freePercent = Math.min(100, Math.round((cartSubtotal / freeDeliveryThreshold) * 100));

  if (cart.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-8 text-center bg-[#FAF7F2]">
        <div className="w-24 h-24 rounded-full bg-[#F3ECE0] flex items-center justify-center text-[#B24B20] mb-4">
          <ShoppingBag size={40} />
        </div>
        <h1 className="font-serif text-3xl font-bold text-[#281B13]">Your Shopping Bag is Empty</h1>
        <p className="text-sm text-[#796455] max-w-md mt-2 mb-6">
          Explore our handmade botanical wax sachets, scented soy candles, and curated gift hampers.
        </p>
        <Link
          href="/shop"
          className="bg-[#C45A2C] hover:bg-[#B24B20] text-white font-semibold text-sm px-8 py-3 rounded-full transition shadow-warm"
        >
          Explore Shop Collection
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-[#FAF7F2] min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#281B13] mb-8">
          Your Shopping Bag ({cart.reduce((s, i) => s + i.quantity, 0)} items)
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Cart Items List */}
          <div className="lg:col-span-8 space-y-4">
            {/* Free shipping banner */}
            <div className="bg-white p-4 rounded-2xl border border-[#EBE2D5] shadow-soft">
              <div className="flex justify-between items-center text-xs mb-2">
                <span className="font-semibold text-[#793216]">
                  {distanceToFree > 0
                    ? `Add ${formatLKR(distanceToFree)} more for Free Island-Wide Delivery!`
                    : '🎉 Free Island-Wide Delivery Unlocked!'}
                </span>
                <span className="font-bold text-[#C45A2C]">{freePercent}%</span>
              </div>
              <div className="w-full h-2 bg-[#EADDCF] rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#DC9B7E] to-[#C45A2C] transition-all duration-300"
                  style={{ width: `${freePercent}%` }}
                />
              </div>
            </div>

            {/* List */}
            <div className="bg-white rounded-3xl p-6 border border-[#EBE2D5] shadow-soft divide-y divide-[#F2ECE1]">
              {cart.map((item) => (
                <div key={item.productId} className="py-4 first:pt-0 last:pb-0 flex gap-4 sm:gap-6">
                  <div className="relative w-24 h-24 rounded-2xl overflow-hidden bg-[#F6F1EA] shrink-0 border border-[#EAE2D5]">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="flex-1 flex flex-col justify-between">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="font-serif text-base sm:text-lg font-bold text-[#281B13]">
                          {item.title}
                        </h3>
                        <span className="text-xs text-[#8C7A6B] block">SKU: {item.sku}</span>
                        {item.customNote && (
                          <span className="text-xs text-[#C45A2C] italic block mt-1">
                            Note: &ldquo;{item.customNote}&rdquo;
                          </span>
                        )}
                      </div>

                      <button
                        onClick={() => removeFromCart(item.productId)}
                        className="text-stone-400 hover:text-red-600 p-1 transition"
                        title="Remove item"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      {/* Quantity Stepper */}
                      <div className="flex items-center border border-[#DFD5C6] rounded-xl bg-[#FAF7F2] overflow-hidden">
                        <button
                          onClick={() => updateCartQuantity(item.productId, item.quantity - 1)}
                          className="px-3 py-1.5 text-[#4A3B32] hover:bg-[#EDE3D5] transition"
                        >
                          <Minus size={13} />
                        </button>
                        <span className="px-3 text-xs font-bold text-[#281B13] min-w-[24px] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateCartQuantity(item.productId, item.quantity + 1)}
                          className="px-3 py-1.5 text-[#4A3B32] hover:bg-[#EDE3D5] transition"
                        >
                          <Plus size={13} />
                        </button>
                      </div>

                      <div className="text-right">
                        <span className="font-bold text-base sm:text-lg text-[#C45A2C]">
                          {formatLKR(item.price * item.quantity)}
                        </span>
                        {item.quantity > 1 && (
                          <span className="block text-[11px] text-[#8C7A6B]">
                            {formatLKR(item.price)} each
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center pt-2">
              <Link
                href="/shop"
                className="text-xs font-semibold text-[#C45A2C] hover:underline"
              >
                ← Continue Shopping
              </Link>
            </div>
          </div>

          {/* Order Summary & District Calculator */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-white rounded-3xl p-6 border border-[#EBE2D5] shadow-soft space-y-5">
              <h2 className="font-serif text-lg font-bold text-[#281B13]">
                Order Summary
              </h2>

              {/* Delivery District Selector */}
              <div>
                <label className="block text-xs font-semibold text-[#665446] uppercase tracking-wider mb-1.5">
                  Delivery District
                </label>
                <select
                  value={selectedDistrict}
                  onChange={(e) => setSelectedDistrict(e.target.value)}
                  className="w-full text-xs bg-[#FAF7F2] border border-[#DCD0C2] rounded-xl px-3.5 py-2.5 text-[#281B13] focus:outline-none focus:ring-1 focus:ring-[#C45A2C]"
                >
                  {SRI_LANKA_DISTRICTS.map((d) => (
                    <option key={d.district} value={d.district}>
                      {d.district} ({d.estimatedDays}) — {d.rate === 0 ? 'Free' : formatLKR(d.rate)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Coupon code */}
              <div>
                {appliedCoupon ? (
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#F4F9F2] border border-[#D0E6CC] text-xs">
                    <div className="flex items-center gap-1.5 text-[#2E7D32] font-semibold">
                      <Tag size={14} />
                      <span>{appliedCoupon.code} (-{formatLKR(discountAmount)})</span>
                    </div>
                    <button
                      onClick={removeCoupon}
                      className="text-stone-400 hover:text-red-500 font-bold"
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="space-y-1.5">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Coupon (e.g. FLAMIRA10)"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        className="flex-1 text-xs bg-[#FAF7F2] border border-[#DCD0C2] rounded-xl px-3 py-2 text-[#281B13] uppercase"
                      />
                      <button
                        type="submit"
                        className="bg-[#281B13] hover:bg-[#4A3B32] text-white text-xs font-semibold px-4 py-2 rounded-xl transition"
                      >
                        Apply
                      </button>
                    </div>
                    {couponMsg && (
                      <p
                        className={`text-[11px] ${
                          couponMsg.error ? 'text-red-600' : 'text-green-700'
                        }`}
                      >
                        {couponMsg.text}
                      </p>
                    )}
                  </form>
                )}
              </div>

              {/* Breakdown */}
              <div className="space-y-2 text-xs text-[#5C4A3E] pt-2 border-t border-[#F2ECE1]">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-[#281B13]">{formatLKR(cartSubtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery ({selectedDistrict})</span>
                  <span>{deliveryFee === 0 ? <strong className="text-green-700">FREE</strong> : formatLKR(deliveryFee)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-green-700">
                    <span>Discount</span>
                    <span>-{formatLKR(discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-base font-bold text-[#281B13] pt-3 border-t border-[#EFE8DF]">
                  <span>Total Amount</span>
                  <span className="text-[#C45A2C] text-lg">{formatLKR(finalTotal)}</span>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                onClick={() => router.push('/checkout')}
                className="w-full bg-[#C45A2C] hover:bg-[#B24B20] text-white font-bold py-3.5 px-4 rounded-2xl text-center text-sm flex items-center justify-center gap-2 shadow-warm hover:shadow-hover transition"
              >
                <span>Proceed to Cash on Delivery</span>
                <ArrowRight size={16} />
              </button>

              <div className="text-[11px] text-[#796455] text-center space-y-1">
                <p className="flex items-center justify-center gap-1">
                  <ShieldCheck size={13} className="text-green-700" />
                  <span>No credit card needed • Pay cash to courier</span>
                </p>
                <p className="text-[10px] text-stone-400">
                  Island-wide 25 districts • Reliable third-party couriers
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
