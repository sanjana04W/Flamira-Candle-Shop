'use client';

import React, { useState } from 'react';
import { FileText, Save, Sparkles, MessageCircle, AlertCircle } from 'lucide-react';
import { useStore } from '@/context/StoreContext';

export default function AdminContentPage() {
  const { showToast } = useStore();
  const [tickerText, setTickerText] = useState(
    'Custom Gift Boxes & Wedding Favors Crafted with Love • Made with Heart in Sri Lanka • Clean & Eco-Friendly • 100% Hand-Poured Soy Wax • Island-Wide COD'
  );
  const [heroHeading, setHeroHeading] = useState('Handmade Home Décor & Gifts, Delivered Island-Wide');
  const [heroSubtitle, setHeroSubtitle] = useState(
    'Lovingly crafted in Sri Lanka — Cash on Delivery available across all 25 districts. Pure soy wax candles, artisanal resin keepsakes & bespoke hampers made with heart.'
  );
  const [activePromoBanner, setActivePromoBanner] = useState('Custom Orders Available ✨');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Storefront content and hero copy updated successfully!');
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] p-6 lg:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-[#281B13]">
            Content &amp; Campaign Manager
          </h1>
          <p className="text-xs text-[#8C7A6B] mt-0.5">
            Update homepage hero headlines, announcement banners, and seasonal campaign text without touching code.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="bg-[#C45A2C] hover:bg-[#B24B20] text-white text-xs font-semibold px-5 py-2.5 rounded-xl transition shadow-warm flex items-center gap-1.5"
        >
          <Save size={15} />
          <span>Publish Changes</span>
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-6 text-xs">
        {/* Top Ticker Announcement */}
        <div className="bg-white rounded-3xl p-6 border border-[#EBE2D5] shadow-soft space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-base font-bold text-[#281B13]">
              Top Announcement Ticker Bar (Image 2)
            </h2>
            <span className="text-[10px] bg-[#FAF3EA] text-[#C45A2C] font-bold px-2 py-0.5 rounded-full">
              Live on Homepage Header
            </span>
          </div>

          <div>
            <label className="block font-semibold text-[#4A3B32] mb-1">
              Marquee Ticker Text (Separated by dots)
            </label>
            <input
              type="text"
              value={tickerText}
              onChange={(e) => setTickerText(e.target.value)}
              className="w-full bg-[#FAF7F2] border border-[#DCD0C2] rounded-xl px-3.5 py-2.5 text-[#281B13]"
            />
          </div>

          <div>
            <label className="block font-semibold text-[#4A3B32] mb-1">
              Call-to-Action Pill Text
            </label>
            <input
              type="text"
              value={activePromoBanner}
              onChange={(e) => setActivePromoBanner(e.target.value)}
              className="w-full sm:w-72 bg-[#FAF7F2] border border-[#DCD0C2] rounded-xl px-3.5 py-2 text-[#281B13]"
            />
          </div>
        </div>

        {/* Hero Section Copy */}
        <div className="bg-white rounded-3xl p-6 border border-[#EBE2D5] shadow-soft space-y-4">
          <h2 className="font-serif text-base font-bold text-[#281B13]">
            Homepage Hero Headline &amp; Story (Image 2)
          </h2>

          <div>
            <label className="block font-semibold text-[#4A3B32] mb-1">
              Main Hero Heading
            </label>
            <input
              type="text"
              value={heroHeading}
              onChange={(e) => setHeroHeading(e.target.value)}
              className="w-full bg-[#FAF7F2] border border-[#DCD0C2] rounded-xl px-3.5 py-2.5 text-[#281B13] font-serif text-sm font-bold"
            />
          </div>

          <div>
            <label className="block font-semibold text-[#4A3B32] mb-1">
              Hero Paragraph Subtitle
            </label>
            <textarea
              rows={3}
              value={heroSubtitle}
              onChange={(e) => setHeroSubtitle(e.target.value)}
              className="w-full bg-[#FAF7F2] border border-[#DCD0C2] rounded-xl px-3.5 py-2.5 text-[#281B13] leading-relaxed"
            />
          </div>
        </div>

        {/* Seasonal Theme Switcher */}
        <div className="bg-white rounded-3xl p-6 border border-[#EBE2D5] shadow-soft space-y-3">
          <h2 className="font-serif text-base font-bold text-[#281B13]">
            Seasonal Merchandising Presets
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { name: 'Standard Artisan Ceylon', desc: 'Default botanical terracotta theme' },
              { name: 'Avurudu Festive', desc: 'Clay bowls & sweet spicy aromas' },
              { name: 'Christmas & New Year', desc: 'Cinnamon, clove & holiday hampers' },
              { name: "Valentine's & Love", desc: 'Rose bud sachets & couple keepsakes' },
            ].map((theme, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-2xl bg-[#FAF7F2] border border-[#EAE0D3] hover:border-[#C45A2C] cursor-pointer transition text-left"
              >
                <span className="font-bold text-xs text-[#281B13] block">{theme.name}</span>
                <span className="text-[10px] text-[#796455] mt-0.5 block">{theme.desc}</span>
              </div>
            ))}
          </div>
        </div>
      </form>
    </div>
  );
}
