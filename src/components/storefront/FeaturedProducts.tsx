'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ProductCard } from './ProductCard';
import { useStore } from '@/context/StoreContext';
import { Sparkles, ArrowRight } from 'lucide-react';

export const FeaturedProducts: React.FC = () => {
  const { products } = useStore();
  const [activeTab, setActiveTab] = useState<'all' | 'wax-sachets' | 'candles' | 'gift-boxes' | 'resin'>('all');

  const filteredProducts = products.filter((prod) => {
    if (activeTab === 'all') return true;
    if (activeTab === 'wax-sachets') return prod.categoryId === 'cat-wax-sachets';
    if (activeTab === 'candles') return prod.categoryId === 'cat-candles';
    if (activeTab === 'gift-boxes') return prod.categoryId === 'cat-gift-boxes';
    if (activeTab === 'resin') return prod.categoryId === 'cat-resin-keepsakes';
    return true;
  });

  return (
    <section className="py-16 sm:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-[#C45A2C] font-bold mb-2">
            <Sparkles size={13} />
            <span>Artisan Best Sellers</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#281B13]">
            Most Loved Handcrafted Creations
          </h2>
          <p className="text-sm text-[#796455] mt-2">
            Hand-poured in small batches in Ceylon. Scented with natural botanicals, pure soy wax, and delivered Cash on Delivery to your doorstep.
          </p>
        </div>

        {/* Tab Filters */}
        <div className="flex items-center justify-center gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar">
          {[
            { id: 'all', label: 'All Items' },
            { id: 'wax-sachets', label: 'Wax Sachets' },
            { id: 'candles', label: 'Soy Candles' },
            { id: 'gift-boxes', label: 'Gift Boxes' },
            { id: 'resin', label: 'Resin Art' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`text-xs sm:text-sm font-medium px-5 py-2 rounded-full whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'bg-[#281B13] text-white shadow-sm'
                  : 'bg-[#FAF7F2] text-[#5C4A3E] hover:bg-[#F2ECE1] border border-[#EAE0D3]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.slice(0, 8).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 text-center">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 bg-[#FAF7F2] hover:bg-[#F2ECE1] text-[#281B13] border border-[#D5C2B1] font-semibold text-sm px-8 py-3.5 rounded-full transition shadow-sm hover:shadow"
          >
            <span>Explore All {products.length} Products</span>
            <ArrowRight size={16} className="text-[#C45A2C]" />
          </Link>
        </div>
      </div>
    </section>
  );
};
