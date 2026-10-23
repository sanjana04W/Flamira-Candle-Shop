'use client';

import React from 'react';
import Image from 'next/image';
import { Sparkles, Star } from 'lucide-react';
import { useStore } from '@/context/StoreContext';
import { formatLKR } from '@/lib/utils';

export default function AdminFeaturedProductsPage() {
  const { products, updateProduct, showToast } = useStore();

  const toggleFeatured = (id: string, current: boolean) => {
    updateProduct(id, { isFeatured: !current });
    showToast(!current ? 'Added to featured home showcase' : 'Removed from featured home showcase');
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] p-6 lg:p-8 space-y-6">
      <div>
        <h1 className="font-serif text-2xl font-bold text-[#281B13]">Featured Products Curator</h1>
        <p className="text-xs text-[#8C7A6B] mt-0.5">
          Select which artisan candles and wax sachets appear in the top hero showcase on the homepage.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {products.map((p) => (
          <div
            key={p.id}
            className={`p-4 rounded-3xl bg-white border transition-all ${
              p.isFeatured
                ? 'border-[#C45A2C] shadow-warm ring-2 ring-[#C45A2C]/20'
                : 'border-[#EBE2D5] shadow-soft'
            }`}
          >
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-[#FAF7F2] mb-3 border border-[#EAE0D3]">
              <Image src={p.images[0] || '/flamira-logo.png'} alt={p.title} fill className="object-cover" />
              {p.isFeatured && (
                <div className="absolute top-2.5 right-2.5 bg-[#C45A2C] text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow">
                  <Star size={11} className="fill-white" />
                  <span>Featured</span>
                </div>
              )}
            </div>

            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold text-[#8C7A6B] block">
                {p.categoryName}
              </span>
              <h3 className="font-serif font-bold text-sm text-[#281B13] truncate">{p.title}</h3>
              <p className="font-bold text-[#C45A2C] text-sm">{formatLKR(p.price)}</p>
            </div>

            <button
              onClick={() => toggleFeatured(p.id, !!p.isFeatured)}
              className={`w-full mt-3 py-2 rounded-xl text-xs font-semibold transition ${
                p.isFeatured
                  ? 'bg-[#FAF3EA] text-[#C45A2C] border border-[#E8DEC8] hover:bg-red-50 hover:text-red-700 hover:border-red-200'
                  : 'bg-[#281B13] text-white hover:bg-[#4A3B32]'
              }`}
            >
              {p.isFeatured ? 'Remove from Featured' : 'Feature on Homepage'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
