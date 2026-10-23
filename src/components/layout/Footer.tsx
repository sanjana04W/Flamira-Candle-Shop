'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Phone, Mail, MapPin, Heart, ShieldCheck, Truck, Sparkles } from 'lucide-react';

export const Footer: React.FC = () => {
  const pathname = usePathname();
  if (pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <footer className="bg-[#24170F] text-[#EDE4DA] pt-16 pb-12 border-t border-[#3D2C20]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Trust Badges Strip */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-12 mb-12 border-b border-[#3D2C20]">
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-[#2D1D13] border border-[#442E20]">
            <div className="w-12 h-12 rounded-xl bg-[#C45A2C]/20 flex items-center justify-center text-[#DC9B7E] shrink-0">
              <Truck size={24} />
            </div>
            <div>
              <h4 className="font-semibold text-white text-sm">Island-Wide Cash on Delivery</h4>
              <p className="text-xs text-[#BFAFA2] mt-0.5">Prompt delivery across all 25 Sri Lankan districts</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-2xl bg-[#2D1D13] border border-[#442E20]">
            <div className="w-12 h-12 rounded-xl bg-[#C45A2C]/20 flex items-center justify-center text-[#DC9B7E] shrink-0">
              <Sparkles size={24} />
            </div>
            <div>
              <h4 className="font-semibold text-white text-sm">100% Pure Natural Soy Wax</h4>
              <p className="text-xs text-[#BFAFA2] mt-0.5">Non-toxic, soot-free, eco-friendly botanical ingredients</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-2xl bg-[#2D1D13] border border-[#442E20]">
            <div className="w-12 h-12 rounded-xl bg-[#C45A2C]/20 flex items-center justify-center text-[#DC9B7E] shrink-0">
              <ShieldCheck size={24} />
            </div>
            <div>
              <h4 className="font-semibold text-white text-sm">Handcrafted With Love</h4>
              <p className="text-xs text-[#BFAFA2] mt-0.5">Artisanal small batches made with heart in Colombo, Ceylon</p>
            </div>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-[#3D2C20]">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="relative w-11 h-11 rounded-full overflow-hidden border border-[#523A2A] bg-[#140C08] flex items-center justify-center shadow">
                <Image
                  src="/flamira-logo.png"
                  alt="Flamira Logo"
                  width={44}
                  height={44}
                  className="object-cover"
                />
              </div>
              <div>
                <span className="font-serif text-2xl font-bold tracking-tight text-white block leading-none">
                  Flamira
                </span>
                <span className="text-[9px] uppercase tracking-[0.25em] text-[#D5A425] font-semibold">
                  HANDMADE IN CEYLON
                </span>
              </div>
            </Link>

            <p className="text-sm text-[#C8B8AA] leading-relaxed max-w-sm">
              Artisan candle studio and botanical keepsakes handcrafted in Sri Lanka.
              From fragrant wax sachet rings to bespoke wedding hampers, we transform moments into lasting scents.
            </p>

            <div className="pt-2 flex flex-col gap-2 text-xs text-[#C8B8AA]">
              <div className="flex items-center gap-2.5">
                <Phone size={15} className="text-[#DC9B7E]" />
                <a href="tel:0711168590" className="hover:text-white transition">071 116 8590</a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail size={15} className="text-[#DC9B7E]" />
                <a href="mailto:candlesflamira@gmail.com" className="hover:text-white transition">candlesflamira@gmail.com</a>
              </div>
              <div className="flex items-center gap-2.5">
                <MapPin size={15} className="text-[#DC9B7E]" />
                <span>Colombo & Western Province, Sri Lanka</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Collections
            </h4>
            <ul className="space-y-2.5 text-sm text-[#C8B8AA]">
              <li>
                <Link href="/shop?category=botanical-wax-sachets" className="hover:text-[#DC9B7E] transition">
                  Botanical Wax Sachets
                </Link>
              </li>
              <li>
                <Link href="/shop?category=scented-soy-candles" className="hover:text-[#DC9B7E] transition">
                  Scented Soy Candles
                </Link>
              </li>
              <li>
                <Link href="/shop?category=gift-boxes-hampers" className="hover:text-[#DC9B7E] transition">
                  Gift Boxes & Hampers
                </Link>
              </li>
              <li>
                <Link href="/shop?category=resin-art-keepsakes" className="hover:text-[#DC9B7E] transition">
                  Resin Art & Coasters
                </Link>
              </li>
              <li>
                <Link href="/shop?category=floral-cards-wax-tags" className="hover:text-[#DC9B7E] transition">
                  Pressed Flower Cards
                </Link>
              </li>
              <li>
                <Link href="/custom" className="text-[#E4BD4C] hover:underline font-medium">
                  Custom Orders & Favors
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Customer Care
            </h4>
            <ul className="space-y-2.5 text-sm text-[#C8B8AA]">
              <li>
                <Link href="/track" className="hover:text-[#DC9B7E] transition">
                  Track Your Order
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-[#DC9B7E] transition">
                  Our Story & Craft
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-[#DC9B7E] transition">
                  Contact & Inquiries
                </Link>
              </li>
              <li>
                <Link href="/contact#faq" className="hover:text-[#DC9B7E] transition">
                  FAQ & Scent Care
                </Link>
              </li>
              <li>
                <Link href="/contact#delivery-policy" className="hover:text-[#DC9B7E] transition">
                  Delivery & Returns Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Connect & Socials */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Follow Flamira
            </h4>
            <p className="text-xs text-[#C8B8AA] mb-4">
              Catch our behind-the-scenes candle pouring and packing clips on TikTok and Facebook.
            </p>

            <div className="flex flex-col gap-2.5 text-xs">
              <a
                href="https://www.facebook.com/share/1GfuMD9JvL/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 p-2 rounded-lg bg-[#2D1D13] hover:bg-[#3D271B] text-white transition border border-[#442E20]"
              >
                <span className="w-6 h-6 rounded-full bg-[#1877F2] text-white flex items-center justify-center font-bold text-xs">f</span>
                <span>Facebook @Flamira</span>
              </a>

              <a
                href="https://www.tiktok.com/@flamira11?_r=1&_t=ZS-99vD6syl71o"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 p-2 rounded-lg bg-[#2D1D13] hover:bg-[#3D271B] text-white transition border border-[#442E20]"
              >
                <span className="w-6 h-6 rounded-full bg-black text-white flex items-center justify-center font-bold text-xs">♫</span>
                <span>TikTok @flamira11</span>
              </a>

              <a
                href="https://wa.me/94711168590?text=Hi%20Flamira,%20I%20would%20like%20to%20inquire%20about%20your%20products"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 p-2 rounded-lg bg-[#2D1D13] hover:bg-[#3D271B] text-white transition border border-[#442E20]"
              >
                <span className="w-6 h-6 rounded-full bg-[#25D366] text-white flex items-center justify-center font-bold text-xs">💬</span>
                <span>WhatsApp 071 116 8590</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#9E8E81] gap-4">
          <p>© {new Date().getFullYear()} Flamira Candle & Décor Studio. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Made with <Heart size={13} className="text-[#C45A2C] fill-[#C45A2C]" /> for candle lovers across Sri Lanka.
          </p>
        </div>
      </div>
    </footer>
  );
};
