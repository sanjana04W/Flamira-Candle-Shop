'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCustomerAuth } from '@/context/CustomerAuthContext';
import { ShoppingBag } from 'lucide-react';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, sendVerificationCode } = useCustomerAuth();

  const isCheckout = searchParams.get('checkout') === 'true';
  const paramEmail = searchParams.get('email') || '';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [forgotSent, setForgotSent] = useState(false);

  useEffect(() => {
    if (paramEmail) {
      setEmail(paramEmail);
    } else {
      try {
        const pendingRaw = localStorage.getItem('flamira_pending_checkout');
        if (pendingRaw) {
          const parsed = JSON.parse(pendingRaw);
          if (parsed?.customer?.email) {
            setEmail(parsed.customer.email);
          }
        }
      } catch (e) {
        console.warn(e);
      }
    }
  }, [paramEmail]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password) {
      setError('Please enter your email and password.');
      return;
    }

    setIsSubmitting(true);
    const res = login(email, password);

    if (res.success) {
      // Upon logging in, send verification code with order details to user's email
      try {
        const pendingRaw = localStorage.getItem('flamira_pending_checkout');
        if (pendingRaw) {
          const pending = JSON.parse(pendingRaw);
          const itemsSummary = (pending.items || [])
            .map((i: any) => `${i.title} (×${i.quantity})`)
            .join(', ');
          const orderNumber = `ORD-2026-${Math.floor(1000 + Math.random() * 9000)}`;
          sendVerificationCode(email, pending.customer?.name || email, {
            orderNumber,
            items: itemsSummary,
            total: pending.total ? `LKR ${Number(pending.total).toLocaleString()}` : '',
          });
        } else {
          sendVerificationCode(email);
        }
      } catch {
        sendVerificationCode(email);
      }

      if (isCheckout) {
        router.push(`/account/verify?checkout=true&email=${encodeURIComponent(email)}`);
      } else {
        router.push('/account');
      }
    } else {
      setError(res.message || 'Invalid email or password.');
      setIsSubmitting(false);
    }
  };

  const handleForgotPassword = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('Please enter your email address first.');
      return;
    }
    setForgotSent(true);
    setError('');
  };

  return (
    <div className="min-h-[85vh] bg-[#FAF7F2] flex flex-col justify-center items-center py-12 px-4 sm:px-6">
      <div className="w-full max-w-[430px]">
        {/* Banner if redirected from checkout */}
        {isCheckout && (
          <div className="mb-4 p-3.5 rounded-2xl bg-[#FBEFEA] border border-[#ECC3B1] text-[#943B17] text-xs font-semibold flex items-center gap-2 shadow-xs">
            <ShoppingBag size={16} className="shrink-0 text-[#C45A2C]" />
            <span>Please sign in to your existing account to verify and confirm your order.</span>
          </div>
        )}

        {/* Card matching Image 1 */}
        <div className="bg-white rounded-[28px] border border-[#EFE8DF] p-8 sm:p-10 shadow-sm">
          {/* Header */}
          <div className="text-center mb-7">
            <h1 className="font-serif text-3xl font-bold text-[#281B13] tracking-tight">
              Welcome back
            </h1>
            <p className="text-sm text-[#796455] mt-1.5 font-normal">
              Sign in to your Flamira account
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 text-red-700 text-xs font-medium border border-red-200 text-center">
              {error}
            </div>
          )}

          {forgotSent && (
            <div className="mb-4 p-3 rounded-xl bg-green-50 text-green-800 text-xs font-medium border border-green-200 text-center">
              Password reset link sent to {email}.
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
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

            {/* Password Field */}
            <div>
              <label className="block text-xs font-semibold text-[#281B13] mb-1.5">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-white border border-[#DFD5C6] rounded-xl px-4 py-3 text-sm text-[#281B13] placeholder:text-[#A89A8E] focus:outline-none focus:ring-1 focus:ring-[#B85834] focus:border-[#B85834] transition"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#B85834] hover:bg-[#A34B29] text-white font-medium py-3.5 px-4 rounded-xl text-sm transition shadow-xs active:scale-[0.99] disabled:opacity-60"
            >
              {isSubmitting ? 'Signing In...' : isCheckout ? 'Sign In & Verify Email' : 'Sign In'}
            </button>

            {/* Forgot Password Link */}
            <div className="text-center pt-1">
              <button
                type="button"
                onClick={handleForgotPassword}
                className="text-xs text-[#B85834] hover:underline"
              >
                Forgot your password?
              </button>
            </div>
          </form>
        </div>

        {/* Footer Link matching Image 1 */}
        <p className="text-xs text-[#5C4A3E] text-center mt-6">
          Don&apos;t have an account?{' '}
          <Link
            href={
              isCheckout
                ? `/account/register?checkout=true&email=${encodeURIComponent(email)}`
                : '/account/register'
            }
            className="text-[#B85834] hover:underline font-medium"
          >
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function CustomerLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[85vh] bg-[#FAF7F2] flex items-center justify-center text-sm text-[#796455]">
          Loading sign in...
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
