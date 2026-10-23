'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Plus, Search, Edit3, Trash2, AlertTriangle, Sparkles, Star } from 'lucide-react';
import { useStore } from '@/context/StoreContext';
import { formatLKR } from '@/lib/utils';
import { Product } from '@/types';
import { ProductFormModal } from '@/components/admin/ProductFormModal';

export default function AdminProductsPage() {
  const { products, deleteProduct, updateProduct, categories } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const filteredProducts = products.filter((p) => {
    if (selectedCategory !== 'All' && p.categoryId !== selectedCategory) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = p.title.toLowerCase().includes(q);
      const matchSku = p.sku.toLowerCase().includes(q);
      const matchCat = p.categoryName.toLowerCase().includes(q);
      if (!matchTitle && !matchSku && !matchCat) return false;
    }
    return true;
  });

  const handleEdit = (prod: Product) => {
    setEditingProduct(prod);
    setIsModalOpen(true);
  };

  const handleNew = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string, title: string) => {
    if (confirm(`Are you sure you want to delete "${title}"?`)) {
      deleteProduct(id);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="font-serif text-2xl font-bold text-[#281B13]">Catalogue &amp; Products</h1>
            <span className="bg-[#FAF3EA] text-[#C45A2C] border border-[#E8DEC8] text-xs font-bold px-2.5 py-0.5 rounded-full">
              {products.length} Products
            </span>
          </div>
          <p className="text-xs text-[#8C7A6B] mt-0.5">
            Manage your artisanal candles, wax sachets, pricing, and stock levels.
          </p>
        </div>

        <button
          onClick={handleNew}
          className="bg-[#C45A2C] hover:bg-[#B24B20] text-white text-xs font-semibold px-5 py-2.5 rounded-xl transition shadow-warm flex items-center gap-1.5"
        >
          <Plus size={16} />
          <span>+ Add New Product</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-[#EBE2D5] shadow-soft flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search products by title, SKU, or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#FAF7F2] border border-[#DCD0C2] rounded-2xl py-2.5 pl-11 pr-4 text-xs text-[#281B13] focus:outline-none focus:ring-1 focus:ring-[#C45A2C]"
          />
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8C7A6B]" />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-[#8C7A6B] whitespace-nowrap">Category:</span>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-[#FAF7F2] border border-[#DCD0C2] rounded-2xl py-2 px-3 text-xs text-[#281B13] font-medium"
          >
            <option value="All">All Categories ({products.length})</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-3xl border border-[#EBE2D5] shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="bg-[#FAF7F2] border-b border-[#F2ECE1]">
              <tr>
                {['Item & Image', 'SKU', 'Category', 'Price', 'Stock', 'Threshold', 'Featured', 'Actions'].map(
                  (header) => (
                    <th
                      key={header}
                      className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-[#8C7A6B]"
                    >
                      {header}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F5EFE8]">
              {filteredProducts.map((p) => {
                const isLowStock = p.stockQty > 0 && p.stockQty <= p.lowStockThreshold;
                const isOutOfStock = p.stockQty === 0;

                return (
                  <tr key={p.id} className="hover:bg-[#FAF7F2] transition">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-[#FAF7F2] border border-[#EAE0D3] shrink-0">
                          <Image src={p.images[0] || '/flamira-logo.png'} alt={p.title} fill className="object-cover" />
                        </div>
                        <div className="min-w-0 max-w-[200px]">
                          <span className="font-bold text-[#281B13] block truncate">{p.title}</span>
                          <span className="text-[10px] text-[#8C7A6B] truncate block">{p.material}</span>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-3.5 font-mono text-[11px] text-[#4A3B32]">{p.sku}</td>

                    <td className="px-5 py-3.5 text-[#4A3B32]">{p.categoryName}</td>

                    <td className="px-5 py-3.5 font-bold text-[#281B13]">
                      {formatLKR(p.salePrice ?? p.price)}
                      {p.salePrice && (
                        <span className="block text-[10px] text-stone-400 line-through">
                          {formatLKR(p.price)}
                        </span>
                      )}
                    </td>

                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <span
                          className={`font-bold px-2 py-0.5 rounded-full text-[10px] ${
                            isOutOfStock
                              ? 'bg-red-100 text-red-700'
                              : isLowStock
                              ? 'bg-[#FFF8E1] text-[#B78103] border border-[#FFE082]'
                              : 'bg-green-50 text-green-700'
                          }`}
                        >
                          {p.stockQty} in stock
                        </span>
                      </div>
                    </td>

                    <td className="px-5 py-3.5 text-[#8C7A6B]">{p.lowStockThreshold} units</td>

                    <td className="px-5 py-3.5">
                      <button
                        onClick={() => updateProduct(p.id, { isFeatured: !p.isFeatured })}
                        className={`text-xs px-2.5 py-0.5 rounded-full font-medium transition ${
                          p.isFeatured
                            ? 'bg-[#FAF3EA] text-[#C45A2C] border border-[#E8DEC8]'
                            : 'text-stone-400 hover:text-stone-700'
                        }`}
                      >
                        {p.isFeatured ? '★ Featured' : 'Normal'}
                      </button>
                    </td>

                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEdit(p)}
                          className="p-1.5 text-stone-600 hover:text-[#C45A2C] hover:bg-white rounded-lg transition"
                          title="Edit Product"
                        >
                          <Edit3 size={15} />
                        </button>
                        <button
                          onClick={() => handleDelete(p.id, p.title)}
                          className="p-1.5 text-stone-400 hover:text-red-600 hover:bg-white rounded-lg transition"
                          title="Delete Product"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <ProductFormModal
          productToEdit={editingProduct}
          onClose={() => {
            setIsModalOpen(false);
            setEditingProduct(null);
          }}
        />
      )}
    </div>
  );
}
