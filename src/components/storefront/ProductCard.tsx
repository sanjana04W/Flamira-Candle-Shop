'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingBag, Star, Heart, Check, Sparkles } from 'lucide-react';
import { Product } from '@/types';
import { useStore } from '@/context/StoreContext';
import { formatLKR } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart, setIsCartOpen } = useStore();

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
  };

  const handleBuyNow = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
    setIsCartOpen(true);
  };

  const isLowStock = product.stockQty > 0 && product.stockQty <= product.lowStockThreshold;
  const isOutOfStock = product.stockQty === 0;

  return (
    <div className="group relative bg-white rounded-3xl p-3.5 sm:p-4 border border-[#EBE2D5] shadow-soft hover:shadow-hover transition-all duration-300 flex flex-col justify-between">
      <div>
        {/* Product Image */}
        <Link
          href={`/product/${product.slug}`}
          className="relative block w-full aspect-square rounded-2xl overflow-hidden bg-[#F6F1EA] mb-3.5 group-hover:opacity-95 transition"
        >
          <Image
            src={product.images[0] || '/flamira-logo.png'}
            alt={product.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-108"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />

          {/* Badges Overlay */}
          <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 z-10">
            {product.salePrice && (
              <span className="bg-[#C45A2C] text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full tracking-wider uppercase shadow-sm">
                Sale
              </span>
            )}
            {product.isFeatured && (
              <span className="bg-[#281B13]/90 text-white text-[10px] font-medium px-2 py-0.5 rounded-full backdrop-blur-sm">
                Artisan Pick
              </span>
            )}
            {isLowStock && (
              <span className="bg-[#FFF8E1] text-[#B78103] border border-[#FFE082] text-[10px] font-bold px-2 py-0.5 rounded-full">
                Only {product.stockQty} left
              </span>
            )}
          </div>

          {/* Quick Add Floating Button on Hover */}
          {!isOutOfStock && (
            <button
              onClick={handleQuickAdd}
              className="absolute bottom-3 right-3 w-10 h-10 rounded-full bg-white/95 text-[#281B13] hover:bg-[#C45A2C] hover:text-white shadow-md flex items-center justify-center transition-all duration-200 opacity-90 sm:opacity-0 sm:group-hover:opacity-100 transform sm:translate-y-2 sm:group-hover:translate-y-0 z-10"
              title="Add to Cart"
              aria-label="Add to Cart"
            >
              <ShoppingBag size={17} />
            </button>
          )}
        </Link>

        {/* Category & Rating */}
        <div className="flex items-center justify-between text-xs mb-1.5">
          <span className="text-[#8C7A6B] font-medium truncate max-w-[150px]">
            {product.categoryName}
          </span>
          <div className="flex items-center gap-1 text-[#FFA000]">
            <Star size={12} className="fill-[#FFA000]" />
            <span className="text-[#4A3B32] font-semibold text-[11px]">{product.rating.toFixed(1)}</span>
            <span className="text-[#8C7A6B] text-[10px]">({product.reviewCount})</span>
          </div>
        </div>

        {/* Title */}
        <Link href={`/product/${product.slug}`} className="block">
          <h3 className="font-serif text-base font-bold text-[#281B13] line-clamp-1 group-hover:text-[#C45A2C] transition-colors">
            {product.title}
          </h3>
        </Link>

        {/* Short Description */}
        <p className="text-xs text-[#796455] line-clamp-2 mt-1 leading-relaxed">
          {product.shortDesc}
        </p>
      </div>

      {/* Pricing & CTA */}
      <div className="mt-4 pt-3 border-t border-[#F2ECE1] flex items-center justify-between">
        <div>
          <div className="flex items-baseline gap-1.5">
            <span className="font-bold text-base text-[#281B13]">
              {formatLKR(product.salePrice ?? product.price)}
            </span>
            {product.salePrice && (
              <span className="text-xs text-stone-400 line-through">
                {formatLKR(product.price)}
              </span>
            )}
          </div>
          <span className="text-[10px] text-green-700 block font-medium">
            Cash on Delivery
          </span>
        </div>

        {isOutOfStock ? (
          <span className="text-xs font-semibold text-stone-400 bg-stone-100 px-3 py-1.5 rounded-full">
            Out of Stock
          </span>
        ) : (
          <button
            onClick={handleBuyNow}
            className="text-xs font-semibold px-3.5 py-1.5 rounded-full bg-[#FAF3EA] text-[#C45A2C] hover:bg-[#C45A2C] hover:text-white border border-[#E8DEC8] transition shadow-xs"
          >
            Buy COD
          </button>
        )}
      </div>
    </div>
  );
};
