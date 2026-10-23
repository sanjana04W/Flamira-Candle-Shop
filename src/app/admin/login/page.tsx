'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Lock, Mail, Eye, EyeOff, ArrowRight, ShieldCheck, Key } from 'lucide-react';
import { useAdminAuth } from '@/context/AdminAuthContext';

export default function AdminLoginPage() {
  const router = useRouter();
  const { login, isAuthenticated } = useAdminAuth();

  const [email, setEmail] = useState('candlesflamira@gmail.com');
  const [password, setPassword] = useState('flamira2026');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // If already logged in, redirect to admin
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/admin');
    }
  }, [isAuthenticated, router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email.trim() || !password.trim()) {
      setErrorMsg('Please enter your email and password.');
      return;
    }

    setIsSubmitting(true);
    const result = login(email, password);

    if (result.success) {
      router.push('/admin');
    } else {
      setErrorMsg(result.message || 'Invalid email or password.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background ambient accents */}
      <div className="absolute top-1/4 -left-20 w-80 h-80 bg-[#FBEFEA] rounded-full blur-3xl pointer-events-none opacity-70" />
      <div className="absolute bottom-10 -right-20 w-80 h-80 bg-[#FCEEE8] rounded-full blur-3xl pointer-events-none opacity-60" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md z-10 px-4">
        {/* Brand Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#1F140E] border-2 border-[#D5C2B1] shadow-md mx-auto overflow-hidden">
            <Image
              src="/flamira-logo.png"
              alt="Flamira Logo"
              width={56}
              height={56}
              className="object-cover"
              priority
            />
          </div>

          <div>
            <h1 className="font-serif text-3xl font-bold text-[#281B13] tracking-tight">
              Flamira Admin Portal
            </h1>
            <p className="text-xs uppercase tracking-widest text-[#8C7A6B] font-semibold mt-1">
              Candle &amp; Décor Studio • Ceylon
            </p>
          </div>
        </div>

        {/* Login Box */}
        <div className="mt-8 bg-white py-8 px-6 sm:px-10 rounded-3xl shadow-warm border border-[#EBE2D5] space-y-6">
          <div className="border-b border-[#F2ECE1] pb-4 text-center">
            <h2 className="font-serif text-lg font-bold text-[#281B13]">
              Administrative Sign In
            </h2>
            <p className="text-xs text-[#796455] mt-0.5">
              Enter owner email and password to access the store management portal.
            </p>
          </div>

          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-red-50 text-red-700 text-xs font-semibold border border-red-200">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {/* Email Field */}
            <div>
              <label className="block font-semibold text-[#4A3B32] mb-1.5 uppercase tracking-wider text-[11px]">
                Admin Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="candlesflamira@gmail.com"
                  className="w-full bg-[#FAF7F2] border border-[#DCD0C2] rounded-xl py-2.5 pl-10 pr-4 text-xs text-[#281B13] focus:outline-none focus:ring-1 focus:ring-[#C45A2C]"
                />
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8C7A6B]" />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block font-semibold text-[#4A3B32] mb-1.5 uppercase tracking-wider text-[11px]">
                Admin Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="flamira2026"
                  className="w-full bg-[#FAF7F2] border border-[#DCD0C2] rounded-xl py-2.5 pl-10 pr-10 text-xs text-[#281B13] focus:outline-none focus:ring-1 focus:ring-[#C45A2C]"
                />
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8C7A6B]" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#8C7A6B] hover:text-[#281B13]"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {/* Credential Confirmation Badge */}
            <div className="p-3 bg-[#FAF7F2] rounded-xl border border-[#EAE0D3] text-[11px] text-[#796455] flex items-center justify-between">
              <div>
                <span className="font-semibold text-[#281B13] block">Owner Authorized Access:</span>
                <span>candlesflamira@gmail.com</span>
              </div>
              <span className="text-[10px] text-green-700 bg-green-50 px-2 py-0.5 rounded-full font-bold">
                Active
              </span>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#C45A2C] hover:bg-[#B24B20] text-white font-bold py-3.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 shadow-warm hover:shadow-hover transition disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>Signing in...</span>
              ) : (
                <>
                  <span>Log In to Admin Panel</span>
                  <ArrowRight size={15} />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Back link */}
        <div className="text-center mt-6">
          <Link
            href="/"
            className="text-xs font-semibold text-[#796455] hover:text-[#C45A2C] transition"
          >
            ← Return to Flamira Storefront
          </Link>
        </div>
      </div>
    </div>
  );
}
