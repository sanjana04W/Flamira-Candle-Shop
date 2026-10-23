'use client';

import React, { useState, useEffect } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { usePathname } from 'next/navigation';

export const ScrollNavigation: React.FC = () => {
  const pathname = usePathname();
  const [showTop, setShowTop] = useState(false);
  const [showBottom, setShowBottom] = useState(false);

  // Hide in admin dashboard to keep admin UI clean
  const isAdmin = pathname.startsWith('/admin');

  useEffect(() => {
    if (isAdmin) return;

    const handleScroll = () => {
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      const windowHeight = window.innerHeight;
      const documentHeight = Math.max(
        document.body.scrollHeight,
        document.documentElement.scrollHeight,
        document.body.offsetHeight,
        document.documentElement.offsetHeight,
        document.body.clientHeight,
        document.documentElement.clientHeight
      );

      // Show scroll-to-top if scrolled down more than 180px
      setShowTop(scrollY > 180);

      // Show scroll-to-bottom if page is scrollable and not yet at the bottom
      const isScrollable = documentHeight > windowHeight + 150;
      const isNearBottom = scrollY + windowHeight >= documentHeight - 150;
      setShowBottom(isScrollable && !isNearBottom);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
    // Check initially after render
    const timer = setTimeout(handleScroll, 300);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
      clearTimeout(timer);
    };
  }, [isAdmin, pathname]);

  if (isAdmin || (!showTop && !showBottom)) {
    return null;
  }

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const scrollToBottom = () => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: 'smooth',
    });
  };

  return (
    <div
      className="fixed bottom-6 right-6 z-40 flex flex-col items-center gap-2 transition-all duration-300"
      aria-label="Smooth page scroll navigation"
    >
      {showTop && (
        <button
          onClick={scrollToTop}
          title="Scroll smoothly to top"
          aria-label="Scroll smoothly to top"
          className="w-10 h-10 rounded-full bg-[#FAF7F2]/95 hover:bg-white text-[#C45A2C] border border-[#DFD2C0] shadow-warm hover:shadow-hover flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 group backdrop-blur-sm"
        >
          <ChevronUp size={20} className="group-hover:-translate-y-0.5 transition-transform duration-200" />
        </button>
      )}

      {showBottom && (
        <button
          onClick={scrollToBottom}
          title="Scroll smoothly to bottom"
          aria-label="Scroll smoothly to bottom"
          className="w-10 h-10 rounded-full bg-[#FAF7F2]/95 hover:bg-white text-[#C45A2C] border border-[#DFD2C0] shadow-warm hover:shadow-hover flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 group backdrop-blur-sm"
        >
          <ChevronDown size={20} className="group-hover:translate-y-0.5 transition-transform duration-200" />
        </button>
      )}
    </div>
  );
};
