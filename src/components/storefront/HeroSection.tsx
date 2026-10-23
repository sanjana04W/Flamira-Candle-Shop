'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Gift, Check, ChevronLeft, ChevronRight, Star, Flame, Sparkles, Truck } from 'lucide-react';
import { useStore } from '@/context/StoreContext';

const HERO_SLIDES = [
  {
    id: 'slide-1',
    title: 'Signature Gift Hamper Box',
    subtitle: 'Handcrafted in Sri Lanka',
    tag: 'CUSTOM GIFTING',
    price: 'Rs. 2,450',
    image: '/662851553_122104325228882346_7184983019654848002_n.jpg', // Ring wax sachet with pink blossoms matching Image 2!
    slug: 'signature-gift-hamper-box',
    purity: '100% Pure Soy',
  },
  {
    id: 'slide-2',
    title: 'Orange, Cinnamon & Clove Wax Sachet',
    subtitle: 'Infused with Dried Ceylon Spices',
    tag: 'BEST SELLER',
    price: 'Rs. 1,150',
    image: '/655262671_122093121632882346_8581853442807059261_n.jpg',
    slug: 'orange-cinnamon-clove-wax-sachet',
    purity: 'Natural Spices',
  },
  {
    id: 'slide-3',
    title: 'French Lavender Soy Candle',
    subtitle: 'Soot-Free 35-Hour Clean Burn',
    tag: 'RELAXATION',
    price: 'Rs. 1,450',
    image: '/702106998_122113589072882346_4147217457947796703_n.jpg',
    slug: 'french-lavender-soy-scented-candle',
    purity: 'Therapeutic Grade',
  },
  {
    id: 'slide-4',
    title: 'Resin Flower Birthday Greeting Card',
    subtitle: 'Preserved Wildflower Keepsake',
    tag: 'HAND PRESSED',
    price: 'Rs. 450',
    image: '/690737234_122111175788882346_3720678699200967590_n.jpg',
    slug: 'resin-flower-birthday-greeting-card',
    purity: 'Crystal Resin',
  },
];

export const HeroSection: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { addToCart, products } = useStore();

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  };

  const slide = HERO_SLIDES[currentSlide];

  return (
    <section className="relative overflow-hidden bg-[#FAF7F2] pt-8 pb-16 lg:pt-14 lg:pb-24">
      {/* Decorative ambient background glows */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-[#FBEFEA] rounded-full blur-3xl pointer-events-none opacity-60" />
      <div className="absolute bottom-10 right-0 w-96 h-96 bg-[#FCEEE8] rounded-full blur-3xl pointer-events-none opacity-50" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Hero Text & CTAs */}
          <div className="lg:col-span-7 space-y-6 text-left">
            {/* Tag Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#E8DEC8] text-[#8C7A6B] text-xs font-semibold tracking-wide shadow-sm">
              <span className="w-2 h-2 rounded-full bg-[#C45A2C]" />
              <Sparkles size={13} className="text-[#C45A2C]" />
              <span>ARTISAN SRI LANKAN CRAFTS • 2026 COLLECTION</span>
            </div>

            {/* Main Heading with terracotta accent and underline */}
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-[#281B13] tracking-tight leading-[1.12]">
              Handmade Home Décor & Gifts,{' '}
              <span className="relative inline-block text-[#C45A2C]">
                Delivered Island-Wide
                {/* Wavy Underline Flourish SVG matching Image 2 */}
                <svg
                  className="absolute left-0 -bottom-2 w-full h-3 text-[#DC9B7E]"
                  viewBox="0 0 260 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M3 8.5C35 2.5 70 11.5 105 7C140 2.5 175 10 210 6C230 4 250 8 257 9"
                    stroke="#C45A2C"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-[#5C4A3E] leading-relaxed max-w-xl">
              Lovingly crafted in Sri Lanka — Cash on Delivery available across all 25 districts.
              Pure soy wax candles, artisanal resin keepsakes &amp; bespoke hampers made with heart.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 bg-[#C45A2C] hover:bg-[#AD4C21] text-white font-medium text-sm sm:text-base px-7 py-3.5 rounded-full shadow-warm hover:shadow-hover transition-all duration-200 group"
              >
                <span>Explore Collection</span>
                <ArrowRight size={17} className="group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                href="/custom"
                className="inline-flex items-center gap-2 bg-white hover:bg-[#F8F3EA] text-[#281B13] border border-[#D5C2B1] font-medium text-sm sm:text-base px-6 py-3.5 rounded-full shadow-sm hover:shadow transition-all duration-200"
              >
                <Gift size={18} className="text-[#C45A2C]" />
                <span>Custom Gift Orders</span>
              </Link>
            </div>

            {/* Trust Perks row */}
            <div className="pt-4 flex flex-wrap items-center gap-y-2 gap-x-6 text-xs sm:text-sm font-medium text-[#4A3B32]">
              <div className="flex items-center gap-1.5">
                <span className="w-4 h-4 rounded-full bg-[#E8F5E9] text-[#2E7D32] flex items-center justify-center font-bold text-xs">
                  ✓
                </span>
                <span>Cash on Delivery (Island-Wide)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-4 h-4 rounded-full bg-[#E8F5E9] text-[#2E7D32] flex items-center justify-center font-bold text-xs">
                  ✓
                </span>
                <span>100% Non-Toxic Soy Wax</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-4 h-4 rounded-full bg-[#E8F5E9] text-[#2E7D32] flex items-center justify-center font-bold text-xs">
                  ✓
                </span>
                <span>Custom Hampers on Request</span>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Showcase Carousel matching Image 2 */}
          <div className="lg:col-span-5 relative flex flex-col items-center">
            {/* Floating Top Badge 1: PURITY */}
            <div className="absolute -top-4 right-4 z-20 bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-2xl shadow-soft border border-[#EFE8DF] flex items-center gap-2 text-left animate-fadeIn">
              <div className="w-8 h-8 rounded-xl bg-[#FFF3E0] flex items-center justify-center text-[#E65100]">
                <Flame size={16} />
              </div>
              <div>
                <span className="text-[9px] uppercase tracking-wider text-[#8C7A6B] font-semibold block">PURITY</span>
                <span className="text-xs font-bold text-[#281B13]">{slide.purity}</span>
              </div>
            </div>

            {/* Floating Top Badge 2: COD Island-Wide */}
            <div className="absolute top-12 -left-4 z-20 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-full shadow-soft border border-[#EFE8DF] flex items-center gap-1.5 text-xs font-semibold text-[#4A3B32] animate-fadeIn">
              <Truck size={14} className="text-[#C45A2C]" />
              <span>Island-Wide COD</span>
            </div>

            {/* Stacked Cards Layout */}
            <div className="relative w-full max-w-[370px] sm:max-w-[400px]">
              {/* Underlying stacked paper card shadow */}
              <div className="absolute inset-0 bg-[#EFE5D8] rounded-3xl transform rotate-3 scale-95 opacity-70 translate-y-2 pointer-events-none" />
              <div className="absolute inset-0 bg-[#F5ECE1] rounded-3xl transform -rotate-2 scale-98 opacity-90 translate-y-1 pointer-events-none" />

              {/* Foreground Card */}
              <div className="relative bg-white rounded-3xl p-4 sm:p-5 shadow-2xl border border-[#EAE0D3] transition-all">
                {/* Image Container */}
                <div className="relative w-full h-72 sm:h-80 rounded-2xl overflow-hidden bg-[#F8F4EE] group">
                  <Image
                    src={slide.image}
                    alt={slide.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    priority
                  />

                  {/* Ribbon Tag in top card */}
                  <div className="absolute top-3 left-3 bg-[#281B13]/85 backdrop-blur-sm text-white text-[10px] uppercase font-bold tracking-wider px-3 py-1 rounded-full flex items-center gap-1">
                    <Sparkles size={11} className="text-[#E4BD4C]" />
                    <span>{slide.tag}</span>
                  </div>
                </div>

                {/* Card Bottom Meta */}
                <div className="mt-4 flex items-center justify-between">
                  <div className="min-w-0 pr-2">
                    <h3 className="font-serif text-lg font-bold text-[#281B13] truncate">
                      {slide.title}
                    </h3>
                    <p className="text-xs text-[#8C7A6B] mt-0.5">{slide.subtitle}</p>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="bg-[#FAF3EA] border border-[#E9DAC8] text-[#C45A2C] font-bold text-xs px-3 py-1.5 rounded-full block">
                      {slide.price}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Carousel Navigation Arrows + Progress */}
            <div className="mt-6 flex items-center gap-4">
              <button
                onClick={prevSlide}
                className="w-10 h-10 rounded-full bg-white hover:bg-[#FAF7F2] border border-[#D5C2B1] shadow-sm flex items-center justify-center text-[#281B13] hover:text-[#C45A2C] transition active:scale-95"
                aria-label="Previous slide"
              >
                <ChevronLeft size={20} />
              </button>

              {/* Dots and indicator */}
              <div className="flex items-center gap-2">
                {HERO_SLIDES.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentSlide(idx)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      currentSlide === idx ? 'w-7 bg-[#C45A2C]' : 'w-2 bg-[#D5C2B1]'
                    }`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>

              <button
                onClick={nextSlide}
                className="w-10 h-10 rounded-full bg-white hover:bg-[#FAF7F2] border border-[#D5C2B1] shadow-sm flex items-center justify-center text-[#281B13] hover:text-[#C45A2C] transition active:scale-95"
                aria-label="Next slide"
              >
                <ChevronRight size={20} />
              </button>
            </div>

            {/* Floating Bottom Social Proof Pill - matching Image 2 */}
            <div className="mt-4 bg-white/95 backdrop-blur-md px-4 py-2.5 rounded-2xl shadow-soft border border-[#EFE8DF] flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#FFF8E1] flex items-center justify-center text-[#FFA000]">
                <Star size={18} className="fill-[#FFA000]" />
              </div>
              <div className="text-left">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-[#281B13]">4.9 / 5.0</span>
                  <div className="flex text-[#FFA000] text-xs">★★★★★</div>
                </div>
                <span className="text-[11px] text-[#796455] font-medium">500+ Happy Homes Across Ceylon</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
