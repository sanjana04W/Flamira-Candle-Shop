'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ShieldCheck, Truck, ArrowLeft, Check, Lock, Sparkles, PhoneCall } from 'lucide-react';
import { useStore } from '@/context/StoreContext';
import { formatLKR } from '@/lib/utils';
import { SRI_LANKA_DISTRICTS } from '@/data/initialData';
import { PaymentMethod } from '@/types';
import { useCustomerAuth } from '@/context/CustomerAuthContext';

export default function CheckoutPage() {
  const router = useRouter();
  const { customer, isAuthenticated, checkAccountExists, sendVerificationCode } = useCustomerAuth();
  const {
    cart,
    cartSubtotal,
    deliveryFee,
    finalTotal,
    discountAmount,
    appliedCoupon,
    selectedDistrict,
    setSelectedDistrict,
    createOrder,
  } = useStore();

  // Form fields
  const [name, setName] = useState('Chamika Dilshan');
  const [phone, setPhone] = useState('0770122331');
  const [whatsapp, setWhatsapp] = useState('0770122331');
  const [sameAsPhone, setSameAsPhone] = useState(true);
  const [email, setEmail] = useState('chamika.d@gmail.com');
  const [address, setAddress] = useState('No. 24, Flower Road, Kiribathgoda');
  const [city, setCity] = useState('Kelaniya');
  const [postalCode, setPostalCode] = useState('11600');
  const [giftNote, setGiftNote] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('COD');

  // Pre-fill profile details when authenticated customer is logged in
  useEffect(() => {
    if (customer) {
      if (customer.name) setName(customer.name);
      if (customer.email) setEmail(customer.email);
      if (customer.phone) {
        setPhone(customer.phone);
        if (sameAsPhone) setWhatsapp(customer.phone);
      }
    }
  }, [customer, sameAsPhone]);

  // OTP verification state (simulated for Sri Lankan phone fraud prevention)
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [otpVerified, setOtpVerified] = useState(true); // default verified for demo, with option to test
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (cart.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 text-center bg-[#FAF7F2]">
        <h2 className="font-serif text-2xl font-bold text-[#281B13]">Your bag is empty</h2>
        <p className="text-xs text-[#796455] mt-1 mb-4">Add products to your cart before proceeding to checkout.</p>
        <Link
          href="/shop"
          className="bg-[#C45A2C] text-white px-6 py-2.5 rounded-full text-xs font-semibold"
        >
          Browse Collection
        </Link>
      </div>
    );
  }

  const handlePhoneChange = (val: string) => {
    setPhone(val);
    if (sameAsPhone) {
      setWhatsapp(val);
    }
  };

  const handleSendOtp = () => {
    if (!phone || phone.length < 9) {
      setErrorMsg('Please enter a valid Sri Lankan mobile number first.');
      return;
    }
    setOtpSent(true);
    setOtpVerified(false);
    setErrorMsg('');
  };

  const handleVerifyOtp = () => {
    if (otpCode === '1234' || otpCode.length === 4) {
      setOtpVerified(true);
      setErrorMsg('');
    } else {
      setErrorMsg('Invalid OTP. For demo testing, enter code 1234.');
    }
  };

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!name.trim()) {
      setErrorMsg('Please enter your full name.');
      return;
    }
    if (!phone.trim() || phone.length < 9) {
      setErrorMsg('Please enter a valid 10-digit Sri Lankan phone number.');
      return;
    }
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }
    if (!address.trim() || !city.trim()) {
      setErrorMsg('Please enter your full delivery address and city.');
      return;
    }

    setIsSubmitting(true);

    try {
      const pendingOrderPayload = {
        items: cart.map((c) => ({
          productId: c.productId,
          title: c.title,
          sku: c.sku,
          image: c.image,
          price: c.price,
          quantity: c.quantity,
          selectedVariant: c.selectedVariant,
          customNote: c.customNote,
        })),
        customer: {
          name: name.trim(),
          phone: phone.trim(),
          whatsapp: whatsapp.trim() || phone.trim(),
          email: cleanEmail,
        },
        deliveryAddress: {
          address: address.trim(),
          city: city.trim(),
          district: selectedDistrict,
          postalCode: postalCode.trim() || undefined,
        },
        subtotal: cartSubtotal,
        deliveryFee,
        discount: discountAmount,
        total: finalTotal,
        paymentMethod,
        paymentStatus: 'Pending',
        orderStatus: 'Pending',
        giftNote: giftNote.trim() || undefined,
      };

      // Store in pending storage to finalize once verification code is entered
      localStorage.setItem('flamira_pending_checkout', JSON.stringify(pendingOrderPayload));

      if (isAuthenticated) {
        // User already has an active logged-in session -> send verification code to email and verify
        sendVerificationCode(cleanEmail);
        router.push(`/account/verify?checkout=true&email=${encodeURIComponent(cleanEmail)}`);
      } else {
        // Check whether this email already has an account
        const accountExists = checkAccountExists(cleanEmail);
        if (accountExists) {
          // Outcome A: User already has an account -> direct to Sign In page
          router.push(`/account/login?checkout=true&email=${encodeURIComponent(cleanEmail)}`);
        } else {
          // Outcome B: User does not have an account -> direct to Create Account page
          router.push(
            `/account/register?checkout=true&email=${encodeURIComponent(cleanEmail)}&name=${encodeURIComponent(
              name.trim()
            )}&phone=${encodeURIComponent(phone.trim())}`
          );
        }
      }
    } catch (err: any) {
      setErrorMsg(err?.message || 'Error processing your order. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#FAF7F2] min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 text-xs text-[#8C7A6B] mb-6">
          <Link href="/cart" className="hover:text-[#C45A2C] flex items-center gap-1 font-semibold">
            <ArrowLeft size={14} />
            <span>Back to Shopping Bag</span>
          </Link>
          <span>/</span>
          <span className="text-[#281B13] font-semibold">Self-Service Guest Checkout</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Customer Information & Delivery Address Form */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-[#EBE2D5] shadow-soft space-y-6">
            <div className="flex items-center justify-between border-b border-[#F2ECE1] pb-4">
              <div>
                <h1 className="font-serif text-2xl font-bold text-[#281B13]">
                  Guest Cash on Delivery Checkout
                </h1>
                <p className="text-xs text-[#796455] mt-0.5">
                  No password required. Pay cash to courier upon arrival at your doorstep.
                </p>
              </div>
              <span className="hidden sm:flex items-center gap-1 text-[11px] font-semibold bg-[#E8F5E9] text-[#2E7D32] px-3 py-1 rounded-full">
                <Lock size={12} />
                <span>Secure SSL</span>
              </span>
            </div>

            <form onSubmit={handleSubmitOrder} className="space-y-6">
              {/* Section 1: Customer Contact */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-[#C45A2C] uppercase tracking-wider">
                  1. Contact Information
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#4A3B32] mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Kaveesha Sanhinda"
                      className="w-full bg-[#FAF7F2] border border-[#DCD0C2] rounded-xl px-3.5 py-2.5 text-xs text-[#281B13] focus:ring-1 focus:ring-[#C45A2C] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#4A3B32] mb-1">
                      Email Address (for order receipt)
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. kaveesha@gmail.com"
                      className="w-full bg-[#FAF7F2] border border-[#DCD0C2] rounded-xl px-3.5 py-2.5 text-xs text-[#281B13] focus:ring-1 focus:ring-[#C45A2C] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                  <div>
                    <label className="block text-xs font-semibold text-[#4A3B32] mb-1 flex items-center justify-between">
                      <span>Phone Number (Sri Lanka) *</span>
                      {otpVerified && (
                        <span className="text-[10px] text-green-700 font-semibold flex items-center gap-1">
                          <Check size={11} /> Verified
                        </span>
                      )}
                    </label>
                    <div className="relative">
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => handlePhoneChange(e.target.value)}
                        placeholder="e.g. 077 012 2331"
                        className="w-full bg-[#FAF7F2] border border-[#DCD0C2] rounded-xl px-3.5 py-2.5 text-xs text-[#281B13] focus:ring-1 focus:ring-[#C45A2C] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#4A3B32] mb-1">
                      WhatsApp Number (for delivery tracking updates)
                    </label>
                    <input
                      type="tel"
                      value={whatsapp}
                      disabled={sameAsPhone}
                      onChange={(e) => setWhatsapp(e.target.value)}
                      placeholder="e.g. 077 012 2331"
                      className="w-full bg-[#FAF7F2] border border-[#DCD0C2] rounded-xl px-3.5 py-2.5 text-xs text-[#281B13] disabled:opacity-60 focus:ring-1 focus:ring-[#C45A2C] focus:outline-none"
                    />
                    <label className="flex items-center gap-2 mt-1.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={sameAsPhone}
                        onChange={(e) => {
                          setSameAsPhone(e.target.checked);
                          if (e.target.checked) setWhatsapp(phone);
                        }}
                        className="rounded text-[#C45A2C] focus:ring-[#C45A2C] h-3.5 w-3.5"
                      />
                      <span className="text-[11px] text-[#796455]">WhatsApp is same as phone number</span>
                    </label>
                  </div>
                </div>

                {/* Phone verification panel */}
                {!otpVerified && (
                  <div className="p-3.5 rounded-2xl bg-[#FFF8E1] border border-[#FFE082] text-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-[#8C6B00] flex items-center gap-1.5">
                        <PhoneCall size={14} />
                        <span>COD Security Verification</span>
                      </span>
                      {!otpSent && (
                        <button
                          type="button"
                          onClick={handleSendOtp}
                          className="bg-[#281B13] text-white text-[10px] font-bold px-3 py-1 rounded-full hover:bg-stone-800"
                        >
                          Send SMS OTP
                        </button>
                      )}
                    </div>
                    {otpSent && (
                      <div className="flex items-center gap-2 pt-1">
                        <input
                          type="text"
                          maxLength={4}
                          placeholder="Enter code (1234)"
                          value={otpCode}
                          onChange={(e) => setOtpCode(e.target.value)}
                          className="bg-white border border-[#DCD0C2] rounded-xl px-3 py-1.5 text-xs font-mono w-32 text-center"
                        />
                        <button
                          type="button"
                          onClick={handleVerifyOtp}
                          className="bg-[#C45A2C] text-white text-xs font-bold px-4 py-1.5 rounded-xl hover:bg-[#B24B20]"
                        >
                          Verify Code
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Section 2: Delivery Address */}
              <div className="space-y-3 pt-4 border-t border-[#F2ECE1]">
                <h3 className="text-xs font-bold text-[#C45A2C] uppercase tracking-wider">
                  2. Delivery Address in Sri Lanka
                </h3>

                <div>
                  <label className="block text-xs font-semibold text-[#4A3B32] mb-1">
                    Street Address (House No, Street, Landmark) *
                  </label>
                  <input
                    type="text"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="e.g. No. 45/2, Temple Road"
                    className="w-full bg-[#FAF7F2] border border-[#DCD0C2] rounded-xl px-3.5 py-2.5 text-xs text-[#281B13] focus:ring-1 focus:ring-[#C45A2C] focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#4A3B32] mb-1">
                      City / Town *
                    </label>
                    <input
                      type="text"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="e.g. Maharagama"
                      className="w-full bg-[#FAF7F2] border border-[#DCD0C2] rounded-xl px-3.5 py-2.5 text-xs text-[#281B13] focus:ring-1 focus:ring-[#C45A2C] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#4A3B32] mb-1">
                      District *
                    </label>
                    <select
                      value={selectedDistrict}
                      onChange={(e) => setSelectedDistrict(e.target.value)}
                      className="w-full bg-[#FAF7F2] border border-[#DCD0C2] rounded-xl px-3 py-2.5 text-xs text-[#281B13] focus:ring-1 focus:ring-[#C45A2C] focus:outline-none font-medium"
                    >
                      {SRI_LANKA_DISTRICTS.map((d) => (
                        <option key={d.district} value={d.district}>
                          {d.district} ({d.province} Prov.)
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#4A3B32] mb-1">
                      Postal Code (Optional)
                    </label>
                    <input
                      type="text"
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      placeholder="e.g. 10280"
                      className="w-full bg-[#FAF7F2] border border-[#DCD0C2] rounded-xl px-3.5 py-2.5 text-xs text-[#281B13] focus:ring-1 focus:ring-[#C45A2C] focus:outline-none"
                    />
                  </div>
                </div>

                {/* Gift Note / Courier Instructions */}
                <div className="pt-2">
                  <label className="block text-xs font-semibold text-[#4A3B32] mb-1">
                    Order Notes / Gift Note (Optional)
                  </label>
                  <textarea
                    rows={2}
                    value={giftNote}
                    onChange={(e) => setGiftNote(e.target.value)}
                    placeholder="e.g. Please include a birthday note saying 'Happy Birthday Shenali!', or call before arrival."
                    className="w-full bg-[#FAF7F2] border border-[#DCD0C2] rounded-xl px-3.5 py-2 text-xs text-[#281B13] focus:ring-1 focus:ring-[#C45A2C] focus:outline-none"
                  />
                </div>
              </div>

              {/* Section 3: Payment Method Selection */}
              <div className="space-y-3 pt-4 border-t border-[#F2ECE1]">
                <h3 className="text-xs font-bold text-[#C45A2C] uppercase tracking-wider">
                  3. Payment Method
                </h3>

                <div className="space-y-3">
                  {/* COD Option (Default) */}
                  <label
                    onClick={() => setPaymentMethod('COD')}
                    className={`block p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                      paymentMethod === 'COD'
                        ? 'border-[#C45A2C] bg-[#FAF3EA]'
                        : 'border-[#EAE0D3] bg-white hover:bg-[#FAF7F2]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="payment"
                          checked={paymentMethod === 'COD'}
                          onChange={() => setPaymentMethod('COD')}
                          className="text-[#C45A2C] focus:ring-[#C45A2C]"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-[#281B13]">
                              Cash on Delivery (Island-Wide COD)
                            </span>
                            <span className="bg-[#2E7D32] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                              POPULAR
                            </span>
                          </div>
                          <p className="text-xs text-[#796455] mt-0.5">
                            Pay in cash to the delivery courier when your parcel arrives. No card needed.
                          </p>
                        </div>
                      </div>
                      <span className="text-xl">💵</span>
                    </div>
                  </label>

                  {/* Bank Transfer Option */}
                  <label
                    onClick={() => setPaymentMethod('Bank Transfer')}
                    className={`block p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                      paymentMethod === 'Bank Transfer'
                        ? 'border-[#C45A2C] bg-[#FAF3EA]'
                        : 'border-[#EAE0D3] bg-white hover:bg-[#FAF7F2]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="payment"
                          checked={paymentMethod === 'Bank Transfer'}
                          onChange={() => setPaymentMethod('Bank Transfer')}
                          className="text-[#C45A2C] focus:ring-[#C45A2C]"
                        />
                        <div>
                          <span className="font-bold text-sm text-[#281B13]">
                            Direct Bank Transfer / Online Banking
                          </span>
                          <p className="text-xs text-[#796455] mt-0.5">
                            Transfer directly to Commercial Bank / Sampath Bank. Recommended for overseas gift senders.
                          </p>
                        </div>
                      </div>
                      <span className="text-xl">🏦</span>
                    </div>

                    {paymentMethod === 'Bank Transfer' && (
                      <div className="mt-3 p-3 bg-white rounded-xl border border-[#D5C2B1] text-xs text-[#4A3B32] space-y-1">
                        <p><strong>Account Name:</strong> Flamira Studio</p>
                        <p><strong>Bank:</strong> Commercial Bank of Ceylon (Kollupitiya Branch)</p>
                        <p><strong>Account Number:</strong> 8009 2314 9012</p>
                        <p className="text-[11px] text-[#C45A2C] pt-1">
                          * Please WhatsApp the deposit receipt to 071 116 8590 after placing order.
                        </p>
                      </div>
                    )}
                  </label>
                </div>
              </div>

              {errorMsg && (
                <div className="p-3.5 rounded-xl bg-red-50 text-red-700 text-xs font-semibold border border-red-200">
                  {errorMsg}
                </div>
              )}

              {/* Submit CTA */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#C45A2C] hover:bg-[#B24B20] text-white font-bold py-4 px-6 rounded-2xl text-center text-base flex items-center justify-center gap-2 shadow-warm hover:shadow-hover transition disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>Processing Order...</span>
                  ) : (
                    <>
                      <span>Confirm Order ({formatLKR(finalTotal)})</span>
                      <ShieldCheck size={18} />
                    </>
                  )}
                </button>
                <p className="text-[11px] text-center text-[#796455] mt-2">
                  By clicking Confirm Order, you agree to receive delivery updates via SMS &amp; WhatsApp.
                </p>
              </div>
            </form>
          </div>

          {/* Right: Order Summary Sidebar */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-[#EBE2D5] shadow-soft space-y-5 sticky top-28">
            <h2 className="font-serif text-lg font-bold text-[#281B13]">
              Your Order Review
            </h2>

            {/* Item list */}
            <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
              {cart.map((item) => (
                <div key={item.productId} className="flex items-center gap-3 py-2 border-b border-[#F5ECE1] last:border-b-0">
                  <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-[#FAF7F2] shrink-0 border border-[#EAE0D3]">
                    <Image src={item.image} alt={item.title} fill className="object-cover" />
                    <span className="absolute -top-1 -right-1 bg-[#281B13] text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                      {item.quantity}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-[#281B13] truncate">{item.title}</h4>
                    <span className="text-[10px] text-[#8C7A6B] block">SKU: {item.sku}</span>
                    {item.customNote && (
                      <span className="text-[10px] text-[#C45A2C] italic truncate block">
                        &quot;{item.customNote}&quot;
                      </span>
                    )}
                  </div>
                  <span className="text-xs font-bold text-[#281B13]">
                    {formatLKR(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            {/* Calculations */}
            <div className="space-y-2 text-xs text-[#5C4A3E] pt-2 border-t border-[#F2ECE1]">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-[#281B13]">{formatLKR(cartSubtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery to {selectedDistrict}</span>
                <span>{deliveryFee === 0 ? <strong className="text-green-700">FREE</strong> : formatLKR(deliveryFee)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-green-700">
                  <span>Discount ({appliedCoupon?.code})</span>
                  <span>-{formatLKR(discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between text-base font-bold text-[#281B13] pt-3 border-t border-[#EFE8DF]">
                <span>Total Amount Due</span>
                <span className="text-[#C45A2C] text-lg font-bold">{formatLKR(finalTotal)}</span>
              </div>
            </div>

            {/* Delivery Promise badge */}
            <div className="p-3.5 rounded-2xl bg-[#FAF7F2] border border-[#EAE0D3] space-y-1.5 text-xs">
              <div className="flex items-center gap-2 font-bold text-[#281B13]">
                <Truck size={16} className="text-[#C45A2C]" />
                <span>Estimated Delivery Timeline</span>
              </div>
              <p className="text-[11px] text-[#796455]">
                {selectedDistrict} orders dispatched within 24 hours. Courier delivers in 1–3 business days.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
