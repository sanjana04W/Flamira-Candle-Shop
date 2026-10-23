'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { ShoppingBag, User, Search, Menu, X, Sparkles, ShieldCheck } from 'lucide-react';
import { useStore } from '@/context/StoreContext';
import { useCustomerAuth } from '@/context/CustomerAuthContext';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const { cartCount, setIsCartOpen } = useStore();
  const { isAuthenticated: isCustomerLoggedIn, customer } = useCustomerAuth();
  const [showTopBar, setShowTopBar] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Shop', href: '/shop' },
    { label: 'About', href: '/about' },
    { label: 'Custom Orders', href: '/custom', badge: 'HOT' },
    { label: 'Contact', href: '/contact' },
    { label: 'Track Order', href: '/track' },
  ];

  const isAdminPath = pathname.startsWith('/admin');
  if (isAdminPath) {
    return null; // Admin has its own dedicated navigation
  }

  return (
    <header className="sticky top-0 z-40 w-full bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#EFE8DF] transition-all">
      {/* Top Announcement Bar - exactly like Image 2 */}
      {showTopBar && (
        <div className="relative bg-[#281B13] text-[#FAF7F2] text-xs py-2 px-4 overflow-hidden border-b border-[#3D2C20]">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="overflow-hidden whitespace-nowrap flex-1 flex items-center justify-center gap-6">
              <div className="inline-flex items-center gap-6 animate-marquee text-[11px] sm:text-xs tracking-wide">
                <span>✨ Custom Gift Boxes & Wedding Favors Crafted with Love</span>
                <span className="text-[#C45A2C]">•</span>
                <span>🇱🇰 Made with Heart in Sri Lanka</span>
                <span className="text-[#C45A2C]">•</span>
                <span>🌿 Clean, Eco-Friendly 100% Soy Wax</span>
                <span className="text-[#C45A2C]">•</span>
                <span>📦 Island-Wide Cash on Delivery to All 25 Districts</span>
                <span className="text-[#C45A2C]">•</span>
                <span>✨ Custom Gift Boxes & Wedding Favors Crafted with Love</span>
              </div>
            </div>

            <div className="hidden md:flex items-center gap-3 shrink-0 ml-4">
              <Link
                href="/custom"
                className="bg-[#C45A2C]/90 hover:bg-[#C45A2C] text-white text-[11px] font-medium px-3 py-0.5 rounded-full inline-flex items-center gap-1 transition"
              >
                <span>Custom Orders Available</span>
                <Sparkles size={11} />
              </Link>
              <button
                onClick={() => setShowTopBar(false)}
                className="text-stone-400 hover:text-white text-xs px-1"
                aria-label="Close announcement"
              >
                ✕
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo - Circular Emblem with Flamira HANDMADE IN CEYLON */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-11 h-11 rounded-full overflow-hidden border border-[#D5C2B1] bg-[#1F140E] flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
              <Image
                src="/flamira-logo.png"
                alt="Flamira Logo"
                width={44}
                height={44}
                className="object-cover"
                priority
              />
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-2xl font-bold tracking-tight text-[#281B13] group-hover:text-[#C45A2C] transition-colors leading-none">
                Flamira
              </span>
              <span className="text-[9px] uppercase tracking-[0.25em] text-[#8C7A6B] font-semibold mt-1">
                HANDMADE IN CEYLON
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative text-sm font-medium transition-colors py-2 flex items-center gap-1.5 ${
                    isActive ? 'text-[#C45A2C]' : 'text-[#4A3B32] hover:text-[#C45A2C]'
                  }`}
                >
                  <span>{link.label}</span>
                  {link.badge && (
                    <span className="bg-[#C45A2C] text-white text-[9px] uppercase font-bold px-1.5 py-0.2 rounded-full tracking-wider animate-pulse">
                      {link.badge}
                    </span>
                  )}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#C45A2C] rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Icons */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Search Trigger */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 text-[#4A3B32] hover:text-[#C45A2C] hover:bg-[#F2ECE1] rounded-full transition"
              aria-label="Search products"
            >
              <Search size={20} />
            </button>

            {/* Customer Account / Sign in Profile shortcut */}
            <Link
              href={isCustomerLoggedIn ? '/account' : '/account/login'}
              className={`transition flex items-center justify-center rounded-full ${
                isCustomerLoggedIn
                  ? 'w-9 h-9 bg-[#C45A2C] text-white text-sm font-bold shadow-sm hover:bg-[#B24B20]'
                  : 'p-2 text-[#4A3B32] hover:text-[#C45A2C] hover:bg-[#F2ECE1]'
              }`}
              aria-label="Customer Account"
              title={isCustomerLoggedIn ? `${customer?.name ?? 'My Account'}` : 'Sign In / Register'}
            >
              {isCustomerLoggedIn && customer?.name ? (
                <span className="leading-none select-none">
                  {customer.name.trim().charAt(0).toUpperCase()}
                </span>
              ) : (
                <User size={20} />
              )}
            </Link>

            {/* Shopping Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 bg-[#281B13] text-[#FAF7F2] hover:bg-[#C45A2C] rounded-full transition shadow-sm flex items-center justify-center group"
              aria-label="Shopping Cart"
            >
              <ShoppingBag size={18} className="group-hover:scale-110 transition-transform" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#C45A2C] text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-[#FAF7F2] shadow">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Mobile Hamburger Menu */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-[#4A3B32] hover:text-[#C45A2C] rounded-lg"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Expandable Search Input */}
        {searchOpen && (
          <div className="py-3 px-2 border-t border-[#EFE8DF] animate-fadeIn">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (searchQuery.trim()) {
                  window.location.href = `/shop?q=${encodeURIComponent(searchQuery.trim())}`;
                }
              }}
              className="relative max-w-xl mx-auto"
            >
              <input
                type="text"
                placeholder="Search wax sachets, soy candles, gift hampers, greeting cards..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
                className="w-full bg-white border border-[#DCD0C2] rounded-full py-2.5 pl-11 pr-24 text-sm text-[#281B13] focus:outline-none focus:ring-2 focus:ring-[#C45A2C] shadow-inner"
              />
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8C7A6B]"
              />
              <button
                type="submit"
                className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-[#C45A2C] text-white px-4 py-1.5 rounded-full text-xs font-medium hover:bg-[#AD4C21] transition"
              >
                Search
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#FAF7F2] border-b border-[#EFE8DF] px-4 pt-2 pb-6 space-y-3 shadow-lg">
          <nav className="flex flex-col space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-base font-medium ${
                  pathname === link.href
                    ? 'bg-[#F2ECE1] text-[#C45A2C] font-semibold'
                    : 'text-[#4A3B32] hover:bg-[#F8F3EA]'
                }`}
              >
                <span>{link.label}</span>
                {link.badge && (
                  <span className="bg-[#C45A2C] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {link.badge}
                  </span>
                )}
              </Link>
            ))}
          </nav>

          <div className="pt-4 border-t border-[#EFE8DF] flex flex-col gap-2">
            <p className="text-center text-xs text-[#8C7A6B]">
              Hotline: <a href="tel:0711168590" className="underline font-semibold">071 116 8590</a>
            </p>
          </div>
        </div>
      )}
    </header>
  );
};
