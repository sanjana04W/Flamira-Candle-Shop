'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';
import { useStore } from '@/context/StoreContext';

export const CategoryGrid: React.FC = () => {
  const { categories } = useStore();

  return (
    <section className="py-16 bg-[#FAF7F2] border-b border-[#EFE8DF]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-xs uppercase tracking-widest text-[#C45A2C] font-bold block mb-1">
              Curated Collections
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#281B13]">
              Shop by Category
            </h2>
          </div>
          <Link
            href="/shop"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#C45A2C] hover:text-[#943B17] transition group"
          >
            <span>View All Categories</span>
            <ArrowUpRight size={16} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/shop?category=${cat.slug}`}
              className="group flex flex-col items-center text-center p-3 rounded-2xl bg-white border border-[#EBE2D5] hover:border-[#C45A2C] shadow-soft hover:shadow-warm transition-all duration-300"
            >
              <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-[#F6F1EA] mb-3">
                <Image
                  src={cat.image}
                  alt={cat.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                />
              </div>
              <h3 className="font-serif text-sm font-bold text-[#281B13] group-hover:text-[#C45A2C] transition-colors leading-tight line-clamp-1">
                {cat.name}
              </h3>
              <span className="text-[11px] text-[#8C7A6B] mt-1">
                {cat.itemCount} Items
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
