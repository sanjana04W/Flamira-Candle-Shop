'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Mail, ShieldCheck, CheckCircle2, ArrowRight, RefreshCw, ArrowLeft } from 'lucide-react';
import { useCustomerAuth } from '@/context/CustomerAuthContext';
import { useStore } from '@/context/StoreContext';

function VerifyContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { customer, verifyCode, sendVerificationCode, getLatestVerificationCode } = useCustomerAuth();
  const { createOrder, showToast } = useStore();

  const isCheckout = searchParams.get('checkout') === 'true';
  const paramEmail = searchParams.get('email') || '';

  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeCode, setActiveCode] = useState<string | null>(null);
  const [resendTimer, setResendTimer] = useState(0);

  useEffect(() => {
    // Determine target email
    let targetEmail = paramEmail;
    if (!targetEmail && customer?.email) {
      targetEmail = customer.email;
    }
    if (!targetEmail) {
      try {
        const pendingRaw = localStorage.getItem('flamira_pending_checkout');
        if (pendingRaw) {
          const parsed = JSON.parse(pendingRaw);
          if (parsed?.customer?.email) {
            targetEmail = parsed.customer.email;
          }
        }
      } catch (e) {
        console.warn(e);
      }
    }

    if (targetEmail) {
      setEmail(targetEmail);
      const latest = getLatestVerificationCode(targetEmail);
      setActiveCode(latest || '482910');
    }
  }, [paramEmail, customer, getLatestVerificationCode]);

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const handleResend = () => {
    if (!email) return;
    const res = sendVerificationCode(email);
    setActiveCode(res.code);
    setResendTimer(30);
    setError('');
    showToast(`New verification code sent to ${email}`);
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!code.trim()) {
      setError('Please enter the 6-digit verification code.');
      return;
    }

    setIsSubmitting(true);
    const result = verifyCode(email, code);

    if (!result.success) {
      setError(result.message);
      setIsSubmitting(false);
      return;
    }

    setSuccess(true);

    // If coming from checkout, finalize the order and redirect to order confirmation!
    try {
      const pendingRaw = localStorage.getItem('flamira_pending_checkout');
      if (pendingRaw) {
        const pendingOrder = JSON.parse(pendingRaw);
        const order = createOrder({
          ...pendingOrder,
          customer: {
            ...pendingOrder.customer,
            email: email || pendingOrder.customer.email,
          },
          isEmailVerified: true,
          verificationCode: code.trim(),
        });

        // Clean up pending storage
        localStorage.removeItem('flamira_pending_checkout');
        showToast('Email verified! Your order has been placed.');

        // Navigate to the Order Confirmation page
        setTimeout(() => {
          router.push(`/order/${order.orderNumber}`);
        }, 800);
        return;
      }
    } catch (err: any) {
      console.error('Order creation error:', err);
    }

    // Default redirect to account dashboard if not from checkout
    setTimeout(() => {
      router.push('/account');
    }, 800);
  };

  return (
    <div className="min-h-[85vh] bg-[#FAF7F2] flex flex-col justify-center items-center py-12 px-4 sm:px-6">
      <div className="w-full max-w-[440px]">
        <div className="bg-white rounded-[28px] border border-[#EFE8DF] p-8 sm:p-10 shadow-sm text-center">
          {/* Header Icon */}
          <div className="w-16 h-16 rounded-2xl bg-[#FBEFEA] text-[#C45A2C] border border-[#ECC3B1] flex items-center justify-center mx-auto mb-5 shadow-xs">
            <Mail size={32} />
          </div>

          <h1 className="font-serif text-3xl font-bold text-[#281B13] tracking-tight">
            Verify Your Email
          </h1>
          <p className="text-sm text-[#796455] mt-2 font-normal leading-relaxed">
            We&apos;ve sent a 6-digit verification code to
            <br />
            <span className="font-semibold text-[#281B13] break-all">{email || 'your email'}</span>
          </p>

          {/* Demo helper banner so tester can copy code with 1-click */}
          {activeCode && (
            <div className="mt-5 p-3 rounded-xl bg-[#E8F5E9] border border-[#A5D6A7] text-left text-xs text-[#1B5E20] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span>📨</span>
                <span>
                  Demo Code: <strong className="font-mono text-sm tracking-widest">{activeCode}</strong>
                </span>
              </div>
              <button
                type="button"
                onClick={() => setCode(activeCode)}
                className="text-[11px] font-bold text-[#2E7D32] hover:text-[#1B5E20] underline"
              >
                Auto-fill
              </button>
            </div>
          )}

          {error && (
            <div className="mt-4 p-3 rounded-xl bg-red-50 text-red-700 text-xs font-medium border border-red-200">
              {error}
            </div>
          )}

          {success && (
            <div className="mt-4 p-3 rounded-xl bg-green-50 text-green-800 text-xs font-medium border border-green-200 flex items-center justify-center gap-2">
              <CheckCircle2 size={16} />
              <span>Email verified! Directing to order confirmation...</span>
            </div>
          )}

          <form onSubmit={handleVerify} className="mt-6 space-y-5 text-left">
            <div>
              <label className="block text-xs font-semibold text-[#281B13] mb-2 text-center uppercase tracking-wider">
                6-Digit Verification Code
              </label>
              <input
                type="text"
                maxLength={6}
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/[^0-9]/g, ''))}
                placeholder="••••••"
                className="w-full bg-[#FAF7F2] border-2 border-[#DFD5C6] rounded-2xl py-3.5 text-center font-mono text-2xl font-bold tracking-[0.5em] text-[#281B13] placeholder:text-[#A89A8E] focus:outline-none focus:border-[#C45A2C] focus:bg-white transition shadow-inner"
                autoFocus
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting || success || code.length < 4}
              className="w-full bg-[#C45A2C] hover:bg-[#B24B20] text-white font-bold py-3.5 px-4 rounded-xl text-sm transition shadow-warm active:scale-[0.99] disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <span>Verifying...</span>
              ) : (
                <>
                  <span>Verify Code &amp; Confirm Order</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          {/* Resend Code Section */}
          <div className="mt-6 pt-5 border-t border-[#F2ECE4] flex items-center justify-between text-xs text-[#796455]">
            <span>Didn&apos;t receive code?</span>
            <button
              type="button"
              onClick={handleResend}
              disabled={resendTimer > 0}
              className="text-[#C45A2C] hover:underline font-semibold disabled:text-stone-400 flex items-center gap-1"
            >
              <RefreshCw size={12} className={resendTimer > 0 ? 'animate-spin' : ''} />
              <span>{resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend Code'}</span>
            </button>
          </div>

          {isCheckout && (
            <div className="mt-4">
              <Link
                href="/checkout"
                className="text-xs text-[#8C7A6B] hover:text-[#C45A2C] font-medium inline-flex items-center gap-1"
              >
                <ArrowLeft size={12} />
                <span>Return to Checkout</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function CustomerVerifyPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[85vh] bg-[#FAF7F2] flex items-center justify-center text-sm text-[#796455]">
          Loading verification...
        </div>
      }
    >
      <VerifyContent />
    </Suspense>
  );
}
