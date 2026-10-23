'use client';

import React, { useState, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useStore } from '@/context/StoreContext';
import { ProductCard } from '@/components/storefront/ProductCard';
import { Search, SlidersHorizontal, Sparkles, Filter, X } from 'lucide-react';

function ShopContent() {
  const { products, categories } = useStore();
  const searchParams = useSearchParams();

  const initialCatSlug = searchParams.get('category') || 'all';
  const initialQuery = searchParams.get('q') || '';

  const [selectedCategory, setSelectedCategory] = useState<string>(initialCatSlug);
  const [selectedOccasion, setSelectedOccasion] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>(initialQuery);
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating'>('featured');
  const [showFiltersMobile, setShowFiltersMobile] = useState<boolean>(false);

  const occasions = [
    'All',
    'Birthday',
    'Wedding',
    'Housewarming',
    'Anniversary',
    'Festive',
    'Valentine',
    'Self Care',
  ];

  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        // Category check
        if (selectedCategory !== 'all') {
          const cat = categories.find((c) => c.slug === selectedCategory);
          if (cat && p.categoryId !== cat.id) return false;
        }

        // Occasion check
        if (selectedOccasion !== 'all') {
          if (!p.occasionTags.some((t) => t.toLowerCase() === selectedOccasion.toLowerCase())) {
            return false;
          }
        }

        // Search text check
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchTitle = p.title.toLowerCase().includes(q);
          const matchDesc = p.shortDesc.toLowerCase().includes(q);
          const matchCat = p.categoryName.toLowerCase().includes(q);
          const matchScents = p.scentNotes?.some((s) => s.toLowerCase().includes(q));
          if (!matchTitle && !matchDesc && !matchCat && !matchScents) return false;
        }

        return true;
      })
      .sort((a, b) => {
        const priceA = a.salePrice ?? a.price;
        const priceB = b.salePrice ?? b.price;

        if (sortBy === 'price-asc') return priceA - priceB;
        if (sortBy === 'price-desc') return priceB - priceA;
        if (sortBy === 'rating') return b.rating - a.rating;
        return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
      });
  }, [products, categories, selectedCategory, selectedOccasion, searchQuery, sortBy]);

  const clearAllFilters = () => {
    setSelectedCategory('all');
    setSelectedOccasion('all');
    setSearchQuery('');
    setSortBy('featured');
  };

  return (
    <div className="bg-[#FAF7F2] min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs uppercase tracking-widest text-[#C45A2C] font-bold block mb-1">
            Flamira Handcrafted Store
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#281B13]">
            Explore All Creations
          </h1>
          <p className="text-sm text-[#796455] mt-2">
            Browse our complete catalogue of {products.length} botanical wax sachets, soy scented jars, and handmade gift keepsakes.
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white rounded-3xl p-4 sm:p-5 border border-[#EBE2D5] shadow-soft mb-8">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search by scent, flower, or product..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#FAF7F2] border border-[#DCD0C2] rounded-2xl py-2.5 pl-11 pr-4 text-sm text-[#281B13] focus:outline-none focus:ring-1 focus:ring-[#C45A2C]"
              />
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8C7A6B]"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 text-xs"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Mobile Filter Toggle */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowFiltersMobile(!showFiltersMobile)}
                className="md:hidden flex-1 flex items-center justify-center gap-2 bg-[#FAF7F2] border border-[#DCD0C2] rounded-2xl py-2.5 px-4 text-xs font-semibold text-[#281B13]"
              >
                <SlidersHorizontal size={15} />
                <span>Filters &amp; Sort</span>
              </button>

              {/* Sort By Dropdown */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-[#8C7A6B] hidden sm:inline">Sort:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-[#FAF7F2] border border-[#DCD0C2] rounded-2xl py-2 px-3 text-xs font-medium text-[#281B13] focus:outline-none focus:ring-1 focus:ring-[#C45A2C]"
                >
                  <option value="featured">Featured First</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="rating">Top Customer Rated</option>
                </select>
              </div>
            </div>
          </div>

          {/* Category Pill Filters (Desktop & Mobile expanded) */}
          <div className={`mt-4 pt-4 border-t border-[#F2ECE1] ${showFiltersMobile ? 'block' : 'hidden md:block'}`}>
            <div className="space-y-3">
              {/* Categories */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-semibold text-[#8C7A6B] mr-1">Category:</span>
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`text-xs px-3.5 py-1.5 rounded-full transition-all ${
                    selectedCategory === 'all'
                      ? 'bg-[#C45A2C] text-white font-semibold shadow-xs'
                      : 'bg-[#FAF7F2] text-[#4A3B32] hover:bg-[#F0E5D8] border border-[#E4D7C7]'
                  }`}
                >
                  All Products
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.slug)}
                    className={`text-xs px-3.5 py-1.5 rounded-full transition-all ${
                      selectedCategory === cat.slug
                        ? 'bg-[#C45A2C] text-white font-semibold shadow-xs'
                        : 'bg-[#FAF7F2] text-[#4A3B32] hover:bg-[#F0E5D8] border border-[#E4D7C7]'
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>

              {/* Occasion Tags */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-semibold text-[#8C7A6B] mr-1">Occasion:</span>
                {occasions.map((occ) => (
                  <button
                    key={occ}
                    onClick={() => setSelectedOccasion(occ.toLowerCase())}
                    className={`text-xs px-3 py-1 rounded-full transition-all ${
                      selectedOccasion === occ.toLowerCase()
                        ? 'bg-[#281B13] text-white font-semibold'
                        : 'bg-white text-[#6B5A4E] hover:bg-[#FAF7F2] border border-[#E4D7C7]'
                    }`}
                  >
                    {occ}
                  </button>
                ))}
              </div>
            </div>

            {/* Active filters summary */}
            {(selectedCategory !== 'all' || selectedOccasion !== 'all' || searchQuery) && (
              <div className="mt-3 flex items-center justify-between text-xs text-[#8C7A6B] pt-2">
                <span>Showing {filteredProducts.length} matching products</span>
                <button
                  onClick={clearAllFilters}
                  className="text-[#C45A2C] hover:underline font-medium"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Product Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-[#EBE2D5] p-8">
            <div className="w-16 h-16 rounded-full bg-[#FAF3EA] text-[#C45A2C] flex items-center justify-center mx-auto mb-4">
              <Sparkles size={28} />
            </div>
            <h3 className="font-serif text-xl font-bold text-[#281B13]">No products found</h3>
            <p className="text-xs text-[#796455] mt-1 max-w-sm mx-auto">
              We couldn’t find any items matching your selected criteria. Try adjusting your search term or clearing the filters.
            </p>
            <button
              onClick={clearAllFilters}
              className="mt-5 bg-[#C45A2C] text-white text-xs font-semibold px-6 py-2.5 rounded-full hover:bg-[#B24B20] transition"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FAF7F2] p-8 text-center text-xs text-[#8C7A6B]">Loading catalogue...</div>}>
      <ShopContent />
    </Suspense>
  );
}
