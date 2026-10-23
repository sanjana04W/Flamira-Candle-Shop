import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, Sparkles, Flame, ShieldCheck, MapPin, ArrowRight } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="bg-[#FAF7F2] min-h-screen py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Story Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-[#C45A2C] font-bold mb-2">
            <Sparkles size={14} />
            <span>The Flamira Story</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#281B13]">
            Handmade in Ceylon with Soul &amp; Scent
          </h1>
          <p className="text-sm text-[#796455] mt-3">
            Born from a passion for botanical aesthetics, artisanal candles, and the organic flora of Sri Lanka.
          </p>
        </div>

        {/* Hero Image Collage */}
        <div className="relative w-full h-80 sm:h-96 rounded-3xl overflow-hidden mb-12 shadow-md border border-[#E6DCCF]">
          <Image
            src="/658124889_122093619152882346_561578412808274042_n.jpg"
            alt="Handcrafting Flamira Candles"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex items-end p-6 sm:p-8">
            <div className="text-white max-w-lg">
              <span className="text-xs uppercase font-bold text-[#E4BD4C] tracking-wider block mb-1">
                Artisan Studio • Colombo, Sri Lanka
              </span>
              <p className="font-serif text-xl sm:text-2xl font-bold leading-tight">
                Every wax sachet and candle is poured in small batches with personal dedication.
              </p>
            </div>
          </div>
        </div>

        {/* Narrative & Values */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#EBE2D5] shadow-soft space-y-8 mb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4 text-sm text-[#4A3B32] leading-relaxed">
              <h2 className="font-serif text-2xl font-bold text-[#281B13]">
                Our Humble Beginnings
              </h2>
              <p>
                Flamira began as a creative sanctuary — experimenting with natural soy waxes, local botanical dried blooms, and aromatic essences to create home fragrances that don&apos;t just smell pleasant, but tell a story.
              </p>
              <p>
                In a market filled with synthetic paraffin and imported factory candles, we wanted to champion slow, ethical craftsmanship. We work with local Sri Lankan spice growers, botanical gardens, and sustainable packaging suppliers to ensure every creation is gentle on both your lungs and our island home.
              </p>
            </div>

            <div className="relative h-72 rounded-2xl overflow-hidden border border-[#E8DEC8]">
              <Image
                src="/695095052_122111502290882346_4085690875383256839_n.jpg"
                alt="Botanical Dried Flowers"
                fill
                className="object-cover"
              />
            </div>
          </div>

          {/* Pillars */}
          <div className="pt-8 border-t border-[#F2ECE1]">
            <h3 className="font-serif text-xl font-bold text-[#281B13] text-center mb-8">
              The Flamira Four Pillars
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#EAE0D3] text-center">
                <div className="w-10 h-10 rounded-full bg-[#FFF3E0] text-[#C45A2C] flex items-center justify-center mx-auto mb-3">
                  <Flame size={20} />
                </div>
                <h4 className="font-bold text-sm text-[#281B13]">100% Pure Soy</h4>
                <p className="text-xs text-[#796455] mt-1">
                  Plant-derived soy wax burns cooler and cleaner without harmful soot or black residue.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#EAE0D3] text-center">
                <div className="w-10 h-10 rounded-full bg-[#FFF3E0] text-[#C45A2C] flex items-center justify-center mx-auto mb-3">
                  <Sparkles size={20} />
                </div>
                <h4 className="font-bold text-sm text-[#281B13]">Ceylon Botanicals</h4>
                <p className="text-xs text-[#796455] mt-1">
                  Infused with genuine dried Ceylon cinnamon quills, cloves, citrus slices, and fresh rose petals.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#EAE0D3] text-center">
                <div className="w-10 h-10 rounded-full bg-[#FFF3E0] text-[#C45A2C] flex items-center justify-center mx-auto mb-3">
                  <Heart size={20} />
                </div>
                <h4 className="font-bold text-sm text-[#281B13]">Heirloom Keepsakes</h4>
                <p className="text-xs text-[#796455] mt-1">
                  Resin bookmarks, greeting cards, and floral tags made to be cherished for years to come.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#EAE0D3] text-center">
                <div className="w-10 h-10 rounded-full bg-[#FFF3E0] text-[#C45A2C] flex items-center justify-center mx-auto mb-3">
                  <ShieldCheck size={20} />
                </div>
                <h4 className="font-bold text-sm text-[#281B13]">Sri Lanka Wide COD</h4>
                <p className="text-xs text-[#796455] mt-1">
                  Safe Cash on Delivery to all 25 districts with fair, transparent shipping rates.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 bg-[#C45A2C] hover:bg-[#B24B20] text-white font-semibold text-sm px-8 py-3.5 rounded-full shadow-warm transition"
          >
            <span>Explore Our Artisan Catalogue</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}
