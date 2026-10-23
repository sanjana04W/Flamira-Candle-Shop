'use client';

import React, { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { usePathname } from 'next/navigation';

export const FloatingWhatsApp: React.FC = () => {
  const pathname = usePathname();
  const [showTooltip, setShowTooltip] = useState(true);

  if (pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <div className="fixed bottom-6 left-6 z-40 flex items-center gap-3">
      {/* Floating Button */}
      <a
        href="https://wa.me/94711168590?text=Hello%20Flamira!%20I'm%20visiting%20your%20website%20and%20would%20like%20to%20inquire%20about%20your%20candles%20and%20gift%20items."
        target="_blank"
        rel="noopener noreferrer"
        className="group relative flex items-center justify-center w-14 h-14 rounded-full bg-[#25D366] text-white shadow-xl hover:scale-110 hover:shadow-2xl transition-all duration-300 border-2 border-white"
        aria-label="Chat with Flamira on WhatsApp"
      >
        <MessageCircle size={28} className="fill-white" />
        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-white rounded-full flex items-center justify-center">
          <span className="w-2.5 h-2.5 bg-[#25D366] rounded-full animate-ping"></span>
        </span>
      </a>

      {/* Tooltip speech bubble */}
      {showTooltip && (
        <div className="hidden sm:flex items-center gap-2 bg-white text-[#281B13] px-3.5 py-2 rounded-2xl shadow-lg border border-[#E8DFC0] text-xs font-medium animate-fadeIn">
          <span>Need help choosing a scent? Chat with us!</span>
          <button
            onClick={() => setShowTooltip(false)}
            className="text-stone-400 hover:text-stone-700"
            aria-label="Dismiss tooltip"
          >
            <X size={12} />
          </button>
        </div>
      )}
    </div>
  );
};
