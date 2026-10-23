'use client';

import React from 'react';
import { Check, X } from 'lucide-react';
import { useStore } from '@/context/StoreContext';

export const CartNotificationToast: React.FC = () => {
  const { cartToast, dismissCartToast } = useStore();

  if (!cartToast) return null;

  return (
    <div
      key={cartToast.id}
      className="fixed top-2 sm:top-3 right-3 sm:right-6 md:right-7 z-50 bg-[#009966] text-white px-4 sm:px-5 py-3 rounded-2xl shadow-lg shadow-black/15 max-w-sm sm:max-w-md animate-toast-in flex items-start gap-3 select-none"
      role="alert"
      aria-live="polite"
    >
      <div className="shrink-0 mt-0.5">
        <Check className="w-5 h-5 text-white stroke-[2.5]" />
      </div>

      <div className="flex-1 min-w-0 pr-1">
        <p className="font-semibold text-sm text-white leading-tight break-words">
          {cartToast.productTitle}
        </p>
        <p className="text-sm font-medium text-white/95 leading-tight mt-0.5">
          added to cart!
        </p>
      </div>

      <button
        type="button"
        onClick={dismissCartToast}
        className="text-white/80 hover:text-white transition p-0.5 shrink-0 -mr-1 -mt-0.5 cursor-pointer rounded-full"
        aria-label="Close notification"
      >
        <X className="w-4 h-4 stroke-[2]" />
      </button>
    </div>
  );
};
