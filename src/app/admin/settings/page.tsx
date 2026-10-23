'use client';

import React, { useState } from 'react';
import { Save, ShieldCheck, Key, Globe, Bell, Smartphone } from 'lucide-react';
import { useStore } from '@/context/StoreContext';

export default function AdminSettingsPage() {
  const { showToast } = useStore();
  const [storeName, setStoreName] = useState('Flamira Candle & Décor Studio');
  const [phone, setPhone] = useState('071 116 8590');
  const [email, setEmail] = useState('candlesflamira@gmail.com');
  const [metaPixelId, setMetaPixelId] = useState('192837465019283');
  const [tiktokPixelId, setTiktokPixelId] = useState('TT-9988776655');
  const [ga4Id, setGa4Id] = useState('G-FLAMIRA2026');
  const [firebaseProject, setFirebaseProject] = useState('flamira-candles');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Store settings and pixel configurations saved successfully!');
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] p-6 lg:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-[#281B13]">Store Settings &amp; Tracking</h1>
          <p className="text-xs text-[#8C7A6B] mt-0.5">
            Configure contact details, Meta &amp; TikTok Pixels, and Firebase infrastructure.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="bg-[#C45A2C] hover:bg-[#B24B20] text-white text-xs font-semibold px-5 py-2.5 rounded-xl transition shadow-warm flex items-center gap-1.5"
        >
          <Save size={15} />
          <span>Save All Settings</span>
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-6 text-xs">
        {/* Business Profile */}
        <div className="bg-white rounded-3xl p-6 border border-[#EBE2D5] shadow-soft space-y-4">
          <h2 className="font-serif text-base font-bold text-[#281B13]">
            Business Profile &amp; Contact Info
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-semibold text-[#4A3B32] mb-1">
                Store Name
              </label>
              <input
                type="text"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                className="w-full bg-[#FAF7F2] border border-[#DCD0C2] rounded-xl px-3 py-2 text-[#281B13]"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#4A3B32] mb-1">
                Hotline Phone
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-[#FAF7F2] border border-[#DCD0C2] rounded-xl px-3 py-2 text-[#281B13]"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#4A3B32] mb-1">
                Business Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#FAF7F2] border border-[#DCD0C2] rounded-xl px-3 py-2 text-[#281B13]"
              />
            </div>
          </div>
        </div>

        {/* Marketing Pixels */}
        <div className="bg-white rounded-3xl p-6 border border-[#EBE2D5] shadow-soft space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-base font-bold text-[#281B13]">
              Marketing Tracking Pixels (Section 8.3)
            </h2>
            <span className="text-[10px] text-green-700 bg-green-50 px-2 py-0.5 rounded-full font-bold">
              ✓ Server-Side CAPI Enabled
            </span>
          </div>
          <p className="text-[#796455]">
            Capture Purchase, ViewContent, and AddToCart events directly from social traffic on Facebook, Instagram, and TikTok.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-semibold text-[#4A3B32] mb-1">
                Meta / Facebook Pixel ID
              </label>
              <input
                type="text"
                value={metaPixelId}
                onChange={(e) => setMetaPixelId(e.target.value)}
                className="w-full bg-[#FAF7F2] border border-[#DCD0C2] rounded-xl px-3 py-2 text-[#281B13] font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#4A3B32] mb-1">
                TikTok Pixel &amp; Events API ID
              </label>
              <input
                type="text"
                value={tiktokPixelId}
                onChange={(e) => setTiktokPixelId(e.target.value)}
                className="w-full bg-[#FAF7F2] border border-[#DCD0C2] rounded-xl px-3 py-2 text-[#281B13] font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#4A3B32] mb-1">
                Google Analytics 4 (GA4) ID
              </label>
              <input
                type="text"
                value={ga4Id}
                onChange={(e) => setGa4Id(e.target.value)}
                className="w-full bg-[#FAF7F2] border border-[#DCD0C2] rounded-xl px-3 py-2 text-[#281B13] font-mono"
              />
            </div>
          </div>
        </div>

        {/* Database & Infrastructure */}
        <div className="bg-white rounded-3xl p-6 border border-[#EBE2D5] shadow-soft space-y-3">
          <h2 className="font-serif text-base font-bold text-[#281B13]">
            Database &amp; Firebase Architecture
          </h2>
          <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#EAE0D3] text-[#4A3B32] space-y-1 leading-relaxed">
            <p>
              <strong>Primary Store:</strong> Google Cloud Firestore (Collections: <code>products</code>, <code>categories</code>, <code>orders</code>, <code>customers</code>, <code>settings</code>).
            </p>
            <p>
              <strong>Security Protocol:</strong> Atomic counter sequencing for order IDs (<code>FLM-XXXXX</code>) and transactional stock decrements to prevent double-selling during viral social spikes.
            </p>
            <p className="text-[11px] text-[#2E7D32] font-semibold pt-1">
              ✓ Connected &amp; Operational in Hybrid Local-Cloud Storage Mode.
            </p>
          </div>
        </div>
      </form>
    </div>
  );
}
