'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Flame, Sparkles, Heart, ShieldCheck, ArrowRight } from 'lucide-react';

export const CraftsmanshipSection: React.FC = () => {
  return (
    <section className="py-20 bg-[#FAF7F2] border-y border-[#EFE8DF] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Media Collage */}
          <div className="lg:col-span-6 relative">
            <div className="relative mx-auto max-w-md sm:max-w-lg">
              {/* Main large image */}
              <div className="relative w-full h-[400px] rounded-3xl overflow-hidden shadow-xl border border-[#E6DCCF]">
                <Image
                  src="/687890525_122111011526882346_6060026060767211306_n.jpg"
                  alt="Flamira Artisan Craftsmanship"
                  fill
                  className="object-cover"
                />
              </div>

              {/* Overlapping smaller photo */}
              <div className="absolute -bottom-8 -left-6 sm:-left-8 w-44 sm:w-52 h-44 sm:h-52 rounded-2xl overflow-hidden border-4 border-white shadow-2xl">
                <Image
                  src="/658124889_122093619152882346_561578412808274042_n.jpg"
                  alt="Pouring Soy Candles"
                  fill
                  className="object-cover"
                />
              </div>

              {/* Floating Badge */}
              <div className="absolute -top-4 -right-4 bg-[#281B13] text-white p-4 rounded-2xl shadow-xl max-w-[170px] text-left border border-[#442E20]">
                <span className="text-xl font-bold font-serif text-[#E4BD4C] block">100%</span>
                <span className="text-xs font-medium text-stone-200 leading-tight block mt-0.5">
                  Natural Plant Soy Wax & Ceylon Spices
                </span>
              </div>
            </div>
          </div>

          {/* Right Content */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-[#C45A2C] font-bold">
              <Sparkles size={14} />
              <span>Behind The Flame</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#281B13] leading-tight">
              Crafted in Ceylon with Mindful Intention &amp; Pure Botanicals
            </h2>

            <p className="text-sm sm:text-base text-[#5C4A3E] leading-relaxed">
              Flamira was founded out of a love for calming scents and organic Sri Lankan botanicals.
              Unlike mass-manufactured paraffin candles, every single Flamira creation is poured by hand
              in small micro-batches right here in Sri Lanka.
            </p>

            {/* Feature List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-white border border-[#EAE0D3] shadow-soft">
                <div className="w-9 h-9 rounded-xl bg-[#FDF2EC] flex items-center justify-center text-[#C45A2C] mb-2.5">
                  <Flame size={18} />
                </div>
                <h4 className="font-semibold text-sm text-[#281B13]">Zero Paraffin or Soot</h4>
                <p className="text-xs text-[#796455] mt-1">
                  100% pure soy wax burns 40% slower and cooler, releasing pure aromatic oils without smoke.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-[#EAE0D3] shadow-soft">
                <div className="w-9 h-9 rounded-xl bg-[#FDF2EC] flex items-center justify-center text-[#C45A2C] mb-2.5">
                  <Sparkles size={18} />
                </div>
                <h4 className="font-semibold text-sm text-[#281B13]">Pressed Real Florals</h4>
                <p className="text-xs text-[#796455] mt-1">
                  Locally sourced rose petals, cinnamon quills, lavender, and citrus wheels embedded by hand.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-[#EAE0D3] shadow-soft">
                <div className="w-9 h-9 rounded-xl bg-[#FDF2EC] flex items-center justify-center text-[#C45A2C] mb-2.5">
                  <Heart size={18} />
                </div>
                <h4 className="font-semibold text-sm text-[#281B13]">Personalized Gifting</h4>
                <p className="text-xs text-[#796455] mt-1">
                  Every gift box can include a handwritten calligraphy card and wax seal for weddings or birthdays.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-[#EAE0D3] shadow-soft">
                <div className="w-9 h-9 rounded-xl bg-[#FDF2EC] flex items-center justify-center text-[#C45A2C] mb-2.5">
                  <ShieldCheck size={18} />
                </div>
                <h4 className="font-semibold text-sm text-[#281B13]">Honest COD Delivery</h4>
                <p className="text-xs text-[#796455] mt-1">
                  Transparent shipping fees by district. Pay securely in cash when the courier reaches your gate.
                </p>
              </div>
            </div>

            <div className="pt-2">
              <Link
                href="/about"
                className="inline-flex items-center gap-2 text-sm font-semibold text-[#C45A2C] hover:text-[#943B17] transition group"
              >
                <span>Read Our Full Maker Story</span>
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
