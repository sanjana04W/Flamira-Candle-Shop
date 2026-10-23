'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { X, Trash2, Plus, Minus, ArrowRight, ShieldCheck, Tag } from 'lucide-react';
import { useStore } from '@/context/StoreContext';
import { formatLKR } from '@/lib/utils';
import { SRI_LANKA_DISTRICTS } from '@/data/initialData';

export const CartDrawer: React.FC = () => {
  const {
    isCartOpen,
    setIsCartOpen,
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

  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');

  if (!isCartOpen) return null;

  const freeDeliveryThreshold = 3500;
  const distanceToFree = Math.max(0, freeDeliveryThreshold - cartSubtotal);
  const freePercent = Math.min(100, Math.round((cartSubtotal / freeDeliveryThreshold) * 100));

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    if (!couponInput.trim()) return;

    const res = applyCoupon(couponInput);
    if (!res.success) {
      setCouponError(res.message);
    } else {
      setCouponInput('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-[#1F140E]/60 backdrop-blur-sm transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#FAF7F2] text-[#281B13] shadow-2xl flex flex-col border-l border-[#E6DCCF]">
          {/* Header */}
          <div className="p-5 border-b border-[#EFE8DF] flex items-center justify-between bg-white">
            <div className="flex items-center gap-2">
              <span className="font-serif text-lg font-bold text-[#281B13]">Your Shopping Bag</span>
              <span className="bg-[#F6DDD2] text-[#943B17] text-xs font-semibold px-2 py-0.5 rounded-full">
                {cart.reduce((s, i) => s + i.quantity, 0)} items
              </span>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 text-[#796455] hover:text-[#281B13] rounded-full hover:bg-[#F2ECE1] transition"
              aria-label="Close cart"
            >
              <X size={20} />
            </button>
          </div>

          {/* Free Shipping Progress bar */}
          <div className="bg-[#FAF3EA] px-5 py-3 border-b border-[#EFE8DF]">
            <div className="flex justify-between items-center text-xs mb-1.5">
              <span className="font-medium text-[#793216]">
                {distanceToFree > 0
                  ? `Add ${formatLKR(distanceToFree)} more for Free Island-Wide Delivery!`
                  : '🎉 Congratulations! You have unlocked FREE Delivery!'}
              </span>
              <span className="text-[#943B17] font-bold">{freePercent}%</span>
            </div>
            <div className="w-full h-2 bg-[#EADDCF] rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#DC9B7E] to-[#C45A2C] transition-all duration-300"
                style={{ width: `${freePercent}%` }}
              />
            </div>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                <div className="w-20 h-20 rounded-full bg-[#F3ECE0] flex items-center justify-center text-[#B24B20]">
                  <Image
                    src="/flamira-logo.png"
                    alt="Flamira"
                    width={48}
                    height={48}
                    className="opacity-70"
                  />
                </div>
                <h3 className="font-serif text-lg font-semibold text-[#281B13]">Your bag is empty</h3>
                <p className="text-xs text-[#796455] max-w-xs">
                  Discover our handmade botanical wax sachets, scented soy candles, and gift hampers.
                </p>
                <Link
                  href="/shop"
                  onClick={() => setIsCartOpen(false)}
                  className="bg-[#C45A2C] text-white text-xs font-semibold px-6 py-2.5 rounded-full hover:bg-[#B24B20] transition shadow-sm inline-block"
                >
                  Browse Collection
                </Link>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={`${item.productId}-${item.selectedVariant || 'def'}`}
                  className="flex gap-4 p-3 bg-white rounded-2xl border border-[#EBE2D5] shadow-soft"
                >
                  <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-[#F6F1EA] shrink-0 border border-[#EAE2D5]">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="flex-1 flex flex-col justify-between min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="text-sm font-semibold text-[#281B13] truncate">
                          {item.title}
                        </h4>
                        {item.selectedVariant && (
                          <span className="text-[11px] text-[#796455] block">
                            Variant: {item.selectedVariant}
                          </span>
                        )}
                        {item.customNote && (
                          <span className="text-[10px] text-[#C45A2C] italic block truncate max-w-[190px]">
                            &quot;{item.customNote}&quot;
                          </span>
                        )}
                      </div>
                      <button
                        onClick={() => removeFromCart(item.productId)}
                        className="text-stone-400 hover:text-red-600 transition p-1"
                        aria-label="Remove item"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      <span className="text-sm font-bold text-[#C45A2C]">
                        {formatLKR(item.price * item.quantity)}
                      </span>

                      {/* Quantity Stepper */}
                      <div className="flex items-center border border-[#DFD5C6] rounded-full bg-[#FAF7F2] overflow-hidden">
                        <button
                          onClick={() => updateCartQuantity(item.productId, item.quantity - 1)}
                          className="px-2.5 py-1 text-[#4A3B32] hover:bg-[#EDE3D5] transition text-xs"
                          aria-label="Decrease quantity"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="px-2 text-xs font-semibold text-[#281B13] min-w-[20px] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateCartQuantity(item.productId, item.quantity + 1)}
                          className="px-2.5 py-1 text-[#4A3B32] hover:bg-[#EDE3D5] transition text-xs"
                          aria-label="Increase quantity"
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Calculations */}
          {cart.length > 0 && (
            <div className="p-5 bg-white border-t border-[#EFE8DF] space-y-4 shadow-lg">
              {/* Delivery District Selector */}
              <div>
                <label className="block text-[11px] font-semibold text-[#665446] uppercase tracking-wider mb-1">
                  Delivery District (Sri Lanka)
                </label>
                <select
                  value={selectedDistrict}
                  onChange={(e) => setSelectedDistrict(e.target.value)}
                  className="w-full text-xs bg-[#FAF7F2] border border-[#DCD0C2] rounded-xl px-3 py-2 text-[#281B13] focus:outline-none focus:ring-1 focus:ring-[#C45A2C]"
                >
                  {SRI_LANKA_DISTRICTS.map((d) => (
                    <option key={d.district} value={d.district}>
                      {d.district} ({d.estimatedDays}) — {d.rate === 0 ? 'Free' : formatLKR(d.rate)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Promo Coupon Form */}
              <div>
                {appliedCoupon ? (
                  <div className="flex items-center justify-between p-2 rounded-xl bg-[#F4F9F2] border border-[#D0E6CC] text-xs">
                    <div className="flex items-center gap-1.5 text-[#2E7D32] font-medium">
                      <Tag size={13} />
                      <span>Coupon <strong>{appliedCoupon.code}</strong> applied (-{formatLKR(discountAmount)})</span>
                    </div>
                    <button
                      onClick={removeCoupon}
                      className="text-stone-400 hover:text-red-500 text-xs px-1"
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Coupon Code (e.g. FLAMIRA10)"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      className="flex-1 text-xs bg-[#FAF7F2] border border-[#DCD0C2] rounded-xl px-3 py-2 text-[#281B13] uppercase placeholder:normal-case focus:outline-none focus:ring-1 focus:ring-[#C45A2C]"
                    />
                    <button
                      type="submit"
                      className="bg-[#281B13] hover:bg-[#4A3B32] text-white text-xs font-semibold px-4 py-2 rounded-xl transition"
                    >
                      Apply
                    </button>
                  </form>
                )}
                {couponError && <p className="text-[11px] text-red-600 mt-1">{couponError}</p>}
              </div>

              {/* Subtotal breakdown */}
              <div className="space-y-1.5 text-xs text-[#665446] pt-1 border-t border-[#F2ECE1]">
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
                <div className="flex justify-between text-sm font-bold text-[#281B13] pt-2 border-t border-[#EFE8DF]">
                  <span>Total Payable</span>
                  <span className="text-[#C45A2C] text-base">{formatLKR(finalTotal)}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-1">
                <Link
                  href="/checkout"
                  onClick={() => setIsCartOpen(false)}
                  className="w-full bg-[#C45A2C] hover:bg-[#B24B20] text-white font-semibold py-3 px-4 rounded-xl text-center text-sm flex items-center justify-center gap-2 shadow-sm transition"
                >
                  <span>Proceed to Cash on Delivery</span>
                  <ArrowRight size={16} />
                </Link>

                <p className="text-[10px] text-center text-[#8C7A6B] flex items-center justify-center gap-1">
                  <ShieldCheck size={12} className="text-green-700" />
                  <span>No upfront payment required • Pay Cash to courier at your door</span>
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
