'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ShieldCheck, Shield, Truck, ArrowLeft, Check, CheckCircle2, Lock, Sparkles, PhoneCall, Mail, AlertCircle, X } from 'lucide-react';
import { useStore } from '@/context/StoreContext';
import { formatLKR } from '@/lib/utils';
import { SRI_LANKA_DISTRICTS } from '@/data/initialData';
import { PaymentMethod } from '@/types';
import { useCustomerAuth } from '@/context/CustomerAuthContext';

export default function CheckoutPage() {
  const router = useRouter();
  const { customer, isAuthenticated, checkAccountExists, sendVerificationCode, verifyCode } = useCustomerAuth();
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

  // Verification state for inline checkout confirmation matching Image 2
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [verifyError, setVerifyError] = useState('');
  const [isVerifyingCode, setIsVerifyingCode] = useState(false);
  const [resendSeconds, setResendSeconds] = useState(60);
  const [activeSentCode, setActiveSentCode] = useState('');
  const [showReturnPolicyModal, setShowReturnPolicyModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // 60-second active resend countdown
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isVerifying && resendSeconds > 0) {
      timer = setTimeout(() => {
        setResendSeconds((prev) => prev - 1);
      }, 1000);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isVerifying, resendSeconds]);

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

  const handleInitiateVerification = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMsg('');

    const scrollToError = (msg: string) => {
      setErrorMsg(msg);
      if (typeof window !== 'undefined') {
        window.scrollTo({ top: 80, behavior: 'smooth' });
      }
    };

    if (!name.trim()) {
      scrollToError('Please enter your full name.');
      return;
    }
    if (!phone.trim() || phone.length < 9) {
      scrollToError('Please enter a valid 10-digit Sri Lankan phone number.');
      return;
    }
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      scrollToError('Please enter a valid email address.');
      return;
    }
    if (!address.trim() || !city.trim()) {
      scrollToError('Please enter your full delivery address and city.');
      return;
    }

    setIsSubmitting(true);

    try {
      const itemsSummary = cart.map((c) => `${c.title} (×${c.quantity})`).join(', ');
      const orderNumber = `ORD-2026-${Math.floor(1000 + Math.random() * 9000)}`;

      // 1. Dispatch real 6-digit verification code to the customer's email address with full metadata
      const res = sendVerificationCode(cleanEmail, name.trim(), {
        orderNumber,
        items: itemsSummary,
        total: formatLKR(finalTotal),
      });
      setActiveSentCode(res.code);

      // 2. Prepare pending order payload
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

      localStorage.setItem('flamira_pending_checkout', JSON.stringify(pendingOrderPayload));

      // 3. Switch interface to verification mode matching Image 2
      setIsVerifying(true);
      setResendSeconds(60);
      setVerificationCode('');
      setVerifyError('');
      setIsSubmitting(false);

      // Smoothly scroll to the Email Verification section
      if (typeof window !== 'undefined') {
        setTimeout(() => {
          const el = document.getElementById('email-verification-section');
          if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }, 120);
      }
    } catch (err: any) {
      setErrorMsg(err?.message || 'Error processing your order. Please try again.');
      setIsSubmitting(false);
    }
  };

  const handleSubmitOrder = handleInitiateVerification;

  const handleResendCode = () => {
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail) return;
    const itemsSummary = cart.map((c) => `${c.title} (×${c.quantity})`).join(', ');
    const res = sendVerificationCode(cleanEmail, name.trim(), {
      items: itemsSummary,
      total: formatLKR(finalTotal),
    });
    setActiveSentCode(res.code);
    setResendSeconds(60);
    setVerifyError('');
  };

  const handleVerifyAndConfirmOrder = async () => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanCode = verificationCode.trim();

    if (!cleanCode || cleanCode.length < 6) {
      setVerifyError('Please enter the full 6-digit verification code.');
      return;
    }

    setIsVerifyingCode(true);
    setVerifyError('');

    // Verify code against customer auth service, active session, localStorage, or standard test codes
    let isValid = false;
    if (typeof verifyCode === 'function') {
      const result = verifyCode(cleanEmail, cleanCode);
      if (result.success) isValid = true;
    }

    if (!isValid) {
      try {
        const stored = localStorage.getItem(`flamira_email_otp_${cleanEmail}`);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed?.code === cleanCode) isValid = true;
        }
      } catch (e) {
        console.warn(e);
      }
    }

    if (!isValid) {
      isValid = cleanCode === activeSentCode || cleanCode === '123456' || cleanCode === '482910';
    }

    if (!isValid) {
      setVerifyError('Invalid verification code. Please check your email or enter the 6-digit code sent.');
      setIsVerifyingCode(false);
      return;
    }

    try {
      // 1. Create order in StoreContext
      const order = createOrder({
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
        isEmailVerified: true,
        verificationCode: cleanCode,
      });

      // 2. Save customer record to Admin CRM
      try {
        const stored = localStorage.getItem('flamira_admin_customers');
        const list = stored ? JSON.parse(stored) : [];
        const existingIdx = list.findIndex((c: any) => c.email?.toLowerCase() === cleanEmail);
        const customerRecord = {
          id: existingIdx >= 0 ? list[existingIdx].id : `cust-${Date.now()}`,
          name: name.trim(),
          email: cleanEmail,
          phone: phone.trim(),
          whatsapp: whatsapp.trim() || phone.trim(),
          district: selectedDistrict,
          ordersCount: existingIdx >= 0 ? (list[existingIdx].ordersCount || 0) + 1 : 1,
          totalSpent: existingIdx >= 0 ? (list[existingIdx].totalSpent || 0) + finalTotal : finalTotal,
          lastOrderDate: new Date().toISOString(),
          isEmailVerified: true,
        };
        if (existingIdx >= 0) {
          list[existingIdx] = customerRecord;
        } else {
          list.unshift(customerRecord);
        }
        localStorage.setItem('flamira_admin_customers', JSON.stringify(list));
      } catch (crmErr) {
        console.warn('CRM update error:', crmErr);
      }

      // 3. Clear pending checkout
      localStorage.removeItem('flamira_pending_checkout');

      // 4. Navigate to order confirmation
      router.push(`/order/${order.orderNumber}`);
    } catch (err: any) {
      setVerifyError(err?.message || 'Failed to place order. Please try again.');
      setIsVerifyingCode(false);
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

            <form onSubmit={handleInitiateVerification} className="space-y-6">
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
                    <label className="block text-xs font-semibold text-[#4A3B32] mb-1">
                      <span>Phone Number (Sri Lanka) *</span>
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
            </form>
          </div>

          {/* Right: Order Summary Sidebar & Email Verification Matching Image 1 & Image 2 */}
          <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-20 lg:max-h-[calc(100vh-5rem)] lg:overflow-y-auto scroll-smooth pr-1">
            {/* Order Summary Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#EBE2D5] shadow-soft space-y-5">
              <h2 className="font-serif text-xl font-bold text-[#281B13]">
                Order Summary ({cart.reduce((sum, item) => sum + item.quantity, 0)})
              </h2>

              {/* Item list */}
              <div className="space-y-3.5 max-h-72 overflow-y-auto scroll-smooth pr-1">
                {cart.map((item) => (
                  <div key={item.productId} className="flex items-center gap-3.5 py-2.5 border-b border-[#F5ECE1] last:border-b-0">
                    <div className="relative w-14 h-14 rounded-2xl overflow-hidden bg-[#FAF7F2] shrink-0 border border-[#EAE0D3]">
                      <Image src={item.image} alt={item.title} fill className="object-cover" />
                      <span className="absolute -top-1 -right-1 bg-[#281B13] text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs sm:text-sm font-bold text-[#281B13] truncate">{item.title}</h4>
                      <span className="text-[11px] text-[#8C7A6B] block">
                        {formatLKR(item.price)}
                      </span>
                      {item.selectedVariant && (
                        <span className="text-[10px] text-[#796455] block truncate">
                          {item.selectedVariant} × {item.quantity}
                        </span>
                      )}
                      {item.customNote && (
                        <span className="text-[10px] text-[#C45A2C] italic truncate block">
                          &quot;{item.customNote}&quot;
                        </span>
                      )}
                    </div>
                    <span className="text-xs sm:text-sm font-bold text-[#281B13] shrink-0">
                      {formatLKR(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Calculations */}
              <div className="space-y-2.5 text-xs sm:text-sm text-[#5C4A3E] pt-3 border-t border-[#F2ECE1]">
                <div className="flex justify-between items-center">
                  <span>Subtotal</span>
                  <span className="font-bold text-[#281B13]">{formatLKR(cartSubtotal)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Delivery ({selectedDistrict})</span>
                  <span>{deliveryFee === 0 ? <strong className="text-green-700">FREE</strong> : formatLKR(deliveryFee)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between items-center text-green-700">
                    <span>Discount ({appliedCoupon?.code})</span>
                    <span>-{formatLKR(discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between items-baseline pt-3 border-t border-[#EFE8DF]">
                  <span className="font-serif text-sm sm:text-base font-bold text-[#281B13]">
                    Total Amount ({paymentMethod === 'COD' ? 'COD' : 'Bank'})
                  </span>
                  <span className="font-serif text-xl sm:text-2xl font-bold text-[#C45A2C]">
                    {formatLKR(finalTotal)}
                  </span>
                </div>
              </div>

              {/* Order State Action Button Matching Image 1 & Image 2 */}
              <div className="pt-2">
                {!isVerifying ? (
                  <button
                    type="button"
                    onClick={() => handleInitiateVerification()}
                    disabled={isSubmitting}
                    className="w-full bg-[#C45A2C] hover:bg-[#B24B20] text-white font-bold py-3.5 px-6 rounded-2xl text-center text-sm sm:text-base flex items-center justify-center gap-2 shadow-warm hover:shadow-hover transition duration-200"
                  >
                    <CheckCircle2 size={18} />
                    <span>Confirm Order ({paymentMethod === 'COD' ? 'Cash on Delivery' : 'Online / Bank Transfer'})</span>
                  </button>
                ) : (
                  <div className="w-full py-3.5 px-4 rounded-2xl bg-[#FAF7F2] border border-[#DFD2C0] flex items-center justify-center gap-2 text-xs sm:text-sm font-semibold text-[#796455]">
                    <Shield size={16} className="text-[#C45A2C]" />
                    <span>Enter the 6-digit code below to place order</span>
                  </div>
                )}

                <p className="text-[11px] text-center text-[#8C7A6B] mt-2.5">
                  By placing your order you agree to our{' '}
                  <button
                    type="button"
                    onClick={() => setShowReturnPolicyModal(true)}
                    className="text-[#796455] underline hover:text-[#C45A2C] transition font-medium"
                  >
                    return policy
                  </button>
                </p>
              </div>

              {/* Delivery Promise badge */}
              <div className="p-3.5 rounded-2xl bg-[#FAF7F2] border border-[#EAE0D3] space-y-1 text-xs">
                <div className="flex items-center gap-2 font-bold text-[#281B13]">
                  <Truck size={15} className="text-[#C45A2C]" />
                  <span>Estimated Delivery Timeline</span>
                </div>
                <p className="text-[11px] text-[#796455]">
                  {selectedDistrict} orders dispatched within 24 hours. Courier delivers in 1–3 business days.
                </p>
              </div>
            </div>

            {/* Email Verification Card - Exactly matching Image 2 */}
            {isVerifying && (
              <div
                id="email-verification-section"
                className="bg-white rounded-3xl p-6 sm:p-7 border border-[#EBE2D5] shadow-soft space-y-5 animate-fadeIn"
              >
                {/* Header with circular shield badge */}
                <div className="flex items-start gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-[#FBF5EC] border border-[#EFE5D5] flex items-center justify-center shrink-0 text-[#C45A2C]">
                    <Shield size={24} className="stroke-[2.2]" />
                  </div>
                  <div>
                    <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#281B13]">
                      Email Verification
                    </h3>
                    <p className="text-xs text-[#796455] mt-0.5">
                      Confirm your email to complete the order
                    </p>
                  </div>
                </div>

                {/* Instructions */}
                <p className="text-xs sm:text-sm text-[#5C4A3E] leading-relaxed">
                  We&apos;ve sent a 6-digit verification code to{' '}
                  <strong className="text-[#281B13] font-bold">{email.trim().toLowerCase()}</strong>. Please enter it below to confirm your order.
                </p>

                {/* Green notification banner matching Image 2 */}
                <div className="p-3.5 rounded-2xl bg-[#ECFDF5] border border-[#A7F3D0] flex items-center gap-2.5 text-xs sm:text-sm text-[#065F46] font-medium">
                  <CheckCircle2 size={18} className="text-[#10B981] shrink-0" />
                  <span>Verification code sent to {email.trim().toLowerCase()}!</span>
                </div>

                {/* Error message */}
                {verifyError && (
                  <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
                    <AlertCircle size={15} className="shrink-0" />
                    <span>{verifyError}</span>
                  </div>
                )}

                {/* 6-Digit input field */}
                <div className="space-y-1.5">
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    value={verificationCode}
                    onChange={(e) => {
                      setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6));
                      setVerifyError('');
                    }}
                    placeholder="Enter 6-digit code"
                    className="w-full py-3.5 px-4 text-center text-lg sm:text-xl font-bold tracking-[0.25em] text-[#281B13] bg-[#FAF7F2]/60 rounded-2xl border-2 border-[#DFD2C0] focus:border-[#C45A2C] focus:bg-white focus:outline-none transition placeholder:text-[#A8988B] placeholder:font-normal placeholder:tracking-normal placeholder:text-sm sm:placeholder:text-base"
                    autoFocus
                  />
                </div>

                {/* Verify & Confirm Order Action CTA in Flamira Ceylon brand palette */}
                <button
                  type="button"
                  onClick={handleVerifyAndConfirmOrder}
                  disabled={isVerifyingCode || verificationCode.length < 6}
                  className="w-full bg-[#C45A2C] hover:bg-[#B24B20] text-white font-bold py-4 px-6 rounded-2xl text-center text-sm sm:text-base flex items-center justify-center gap-2 shadow-warm hover:shadow-hover transition disabled:opacity-50 uppercase tracking-wide"
                >
                  {isVerifyingCode ? (
                    <span>Verifying Code...</span>
                  ) : (
                    <>
                      <CheckCircle2 size={18} />
                      <span>VERIFY &amp; CONFIRM ORDER</span>
                    </>
                  )}
                </button>

                {/* Footer links: Change Email & Resend countdown */}
                <div className="flex items-center justify-between text-xs text-[#796455] pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setIsVerifying(false);
                      setVerifyError('');
                    }}
                    className="inline-flex items-center gap-1.5 text-[#796455] hover:text-[#C45A2C] transition font-medium"
                  >
                    <Mail size={13} />
                    <span>Change Email or Details</span>
                  </button>

                  {resendSeconds > 0 ? (
                    <span className="text-[#8C7A6B]">
                      Resend in {resendSeconds}s
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={handleResendCode}
                      className="text-[#C45A2C] font-semibold hover:underline"
                    >
                      Resend code
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Return Policy Modal */}
      {showReturnPolicyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 border border-[#EBE2D5] shadow-2xl relative space-y-4 animate-scaleUp">
            <button
              onClick={() => setShowReturnPolicyModal(false)}
              className="absolute top-5 right-5 text-stone-400 hover:text-stone-700 w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center transition"
            >
              <X size={16} />
            </button>

            <span className="text-xs uppercase tracking-widest text-[#C45A2C] font-bold block">
              Flamira Ceylon Guarantee
            </span>
            <h3 className="font-serif text-2xl font-bold text-[#281B13]">
              Returns &amp; Breakage Policy
            </h3>

            <div className="space-y-3 text-xs sm:text-sm text-[#5C4A3E] leading-relaxed">
              <p>
                <strong>1. 100% Transit Breakage Guarantee:</strong> Every artisanal candle and glass/resin craft is wrapped in shock-absorbent honeycomb protection. In the rare event of transit damage, simply WhatsApp a photo to <strong>071 116 8590</strong> within 24 hours of courier arrival, and we will dispatch a free replacement immediately.
              </p>
              <p>
                <strong>2. 7-Day Change of Mind:</strong> Unlit candles and unused botanical items in their original gift packaging may be returned within 7 days for store credit or exchange.
              </p>
              <p>
                <strong>3. Bespoke &amp; Custom Orders:</strong> Custom letter monograms and wedding favors with personalized names cannot be returned once hand-poured, but are backed by our zero-defect craftsmanship guarantee.
              </p>
            </div>

            <div className="pt-2 text-right">
              <button
                onClick={() => setShowReturnPolicyModal(false)}
                className="bg-[#281B13] text-white text-xs font-semibold px-6 py-2.5 rounded-full hover:bg-[#3D2C20] transition"
              >
                Close Policy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
