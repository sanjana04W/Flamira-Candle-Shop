'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCustomerAuth } from '@/context/CustomerAuthContext';import { ShoppingBag } from 'lucide-react';

function RegisterContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { register, sendVerificationCode } = useCustomerAuth();

  const isCheckout = searchParams.get('checkout') === 'true';
  const paramEmail = searchParams.get('email') || '';
  const paramName = searchParams.get('name') || '';
  const paramPhone = searchParams.get('phone') || '';

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (paramName) setFullName(paramName);
    if (paramEmail) setEmail(paramEmail);
    if (paramPhone) setPhone(paramPhone);

    if (!paramEmail || !paramName || !paramPhone) {
      try {
        const pendingRaw = localStorage.getItem('flamira_pending_checkout');
        if (pendingRaw) {
          const parsed = JSON.parse(pendingRaw);
          if (parsed?.customer) {
            if (!paramName && parsed.customer.name) setFullName(parsed.customer.name);
            if (!paramEmail && parsed.customer.email) setEmail(parsed.customer.email);
            if (!paramPhone && parsed.customer.phone) setPhone(parsed.customer.phone);
          }
        }
      } catch (e) {
        console.warn(e);
      }
    }
  }, [paramEmail, paramName, paramPhone]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!fullName.trim() || !email.trim() || !phone.trim() || !password) {
      setError('Please fill in all fields.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setIsSubmitting(true);
    const res = register(fullName, email, phone, password);

    if (res.success) {
      // Send verification code with order details to the registered email
      try {
        const pendingRaw = localStorage.getItem('flamira_pending_checkout');
        if (pendingRaw) {
          const pending = JSON.parse(pendingRaw);
          const itemsSummary = (pending.items || [])
            .map((i: any) => `${i.title} (×${i.quantity})`)
            .join(', ');
          const orderNumber = `ORD-2026-${Math.floor(1000 + Math.random() * 9000)}`;
          sendVerificationCode(email, fullName.trim(), {
            orderNumber,
            items: itemsSummary,
            total: pending.total ? `LKR ${Number(pending.total).toLocaleString()}` : '',
          });
        } else {
          sendVerificationCode(email, fullName.trim());
        }
      } catch {
        sendVerificationCode(email, fullName.trim());
      }

      if (isCheckout) {
        router.push(`/account/verify?checkout=true&email=${encodeURIComponent(email)}`);
      } else {
        router.push('/account');
      }
    } else {
      setError(res.message || 'Account registration failed.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[85vh] bg-[#FAF7F2] flex flex-col justify-center items-center py-12 px-4 sm:px-6">
      <div className="w-full max-w-[430px]">
        {/* Banner if redirected from checkout */}
        {isCheckout && (
          <div className="mb-4 p-3.5 rounded-2xl bg-[#FBEFEA] border border-[#ECC3B1] text-[#943B17] text-xs font-semibold flex items-center gap-2 shadow-xs">
            <ShoppingBag size={16} className="shrink-0 text-[#C45A2C]" />
            <span>Create your account to verify your email and confirm your order.</span>
          </div>
        )}

        {/* Card matching Image 2 */}
        <div className="bg-white rounded-[28px] border border-[#EFE8DF] p-8 sm:p-10 shadow-sm">
          {/* Header */}
          <div className="text-center mb-7">
            <h1 className="font-serif text-3xl font-bold text-[#281B13] tracking-tight">
              Create account
            </h1>
            <p className="text-sm text-[#796455] mt-1.5 font-normal">
              Save your details for faster checkout
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 text-red-700 text-xs font-medium border border-red-200 text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-semibold text-[#281B13] mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Amaya Perera"
                className="w-full bg-white border border-[#DFD5C6] rounded-xl px-4 py-3 text-sm text-[#281B13] placeholder:text-[#A89A8E] focus:outline-none focus:ring-1 focus:ring-[#B85834] focus:border-[#B85834] transition"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-[#281B13] mb-1.5">
                Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full bg-white border border-[#DFD5C6] rounded-xl px-4 py-3 text-sm text-[#281B13] placeholder:text-[#A89A8E] focus:outline-none focus:ring-1 focus:ring-[#B85834] focus:border-[#B85834] transition"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-xs font-semibold text-[#281B13] mb-1.5">
                Phone
              </label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="07X XXX XXXX"
                className="w-full bg-white border border-[#DFD5C6] rounded-xl px-4 py-3 text-sm text-[#281B13] placeholder:text-[#A89A8E] focus:outline-none focus:ring-1 focus:ring-[#B85834] focus:border-[#B85834] transition"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-[#281B13] mb-1.5">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min 6 characters"
                className="w-full bg-white border border-[#DFD5C6] rounded-xl px-4 py-3 text-sm text-[#281B13] placeholder:text-[#A89A8E] focus:outline-none focus:ring-1 focus:ring-[#B85834] focus:border-[#B85834] transition"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#B85834] hover:bg-[#A34B29] text-white font-medium py-3.5 px-4 rounded-xl text-sm transition shadow-xs active:scale-[0.99] disabled:opacity-60"
              >
                {isSubmitting ? 'Creating Account...' : isCheckout ? 'Create Account & Verify' : 'Create Account'}
              </button>
            </div>
          </form>
        </div>

        {/* Footer Link matching Image 2 */}
        <p className="text-xs text-[#5C4A3E] text-center mt-6">
          Already have an account?{' '}
          <Link
            href={
              isCheckout
                ? `/account/login?checkout=true&email=${encodeURIComponent(email)}`
                : '/account/login'
            }
            className="text-[#B85834] hover:underline font-medium"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function CustomerRegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[85vh] bg-[#FAF7F2] flex items-center justify-center text-sm text-[#796455]">
          Loading registration...
        </div>
      }
    >
      <RegisterContent />
    </Suspense>
  );
}
