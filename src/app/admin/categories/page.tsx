'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Plus, Edit2, Layers, Trash2 } from 'lucide-react';
import { useStore } from '@/context/StoreContext';

export default function AdminCategoriesPage() {
  const { categories, products, showToast } = useStore();
  const [cats, setCats] = useState(categories);
  const [newCatName, setNewCatName] = useState('');
  const [newCatDesc, setNewCatDesc] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;

    const slug = newCatName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const newCat = {
      id: `cat-${Date.now()}`,
      name: newCatName.trim(),
      slug,
      description: newCatDesc.trim() || 'Handmade collection in Ceylon.',
      image: '/655262671_122093121632882346_8581853442807059261_n.jpg',
      itemCount: 0,
      isFeatured: true,
    };

    setCats([...cats, newCat]);
    setNewCatName('');
    setNewCatDesc('');
    showToast(`Category "${newCat.name}" added successfully`);
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] p-6 lg:p-8 space-y-6">
      <div>
        <h1 className="font-serif text-2xl font-bold text-[#281B13]">Category &amp; Collection Management</h1>
        <p className="text-xs text-[#8C7A6B] mt-0.5">
          Organize your product hierarchy and launch seasonal collections (Avurudu, Christmas, Wedding, Valentine's).
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Category List */}
        <div className="lg:col-span-8 bg-white rounded-3xl border border-[#EBE2D5] shadow-soft overflow-hidden">
          <div className="p-5 border-b border-[#F2ECE1]">
            <h2 className="font-serif text-base font-bold text-[#281B13]">
              Active Storefront Categories ({cats.length})
            </h2>
          </div>

          <div className="divide-y divide-[#F5EFE8]">
            {cats.map((cat) => {
              const liveProductCount = products.filter((p) => p.categoryId === cat.id).length;

              return (
                <div key={cat.id} className="p-4 sm:p-5 flex items-center justify-between gap-4 hover:bg-[#FAF7F2] transition">
                  <div className="flex items-center gap-4">
                    <div className="relative w-14 h-14 rounded-2xl overflow-hidden bg-[#FAF7F2] border border-[#EAE0D3] shrink-0">
                      <Image src={cat.image} alt={cat.name} fill className="object-cover" />
                    </div>
                    <div>
                      <h3 className="font-serif font-bold text-sm text-[#281B13]">{cat.name}</h3>
                      <p className="text-xs text-[#796455] max-w-md line-clamp-1 mt-0.5">
                        {cat.description}
                      </p>
                      <span className="text-[10px] text-[#C45A2C] font-semibold">
                        {liveProductCount} Active Products in Store
                      </span>
                    </div>
                  </div>

                  <span className="text-xs font-mono text-[#8C7A6B] bg-[#FAF7F2] px-2.5 py-1 rounded-lg border border-[#E8DEC8]">
                    /{cat.slug}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Add Category Form */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-6 border border-[#EBE2D5] shadow-soft space-y-4">
          <h2 className="font-serif text-base font-bold text-[#281B13]">
            + Add New Category
          </h2>

          <form onSubmit={handleAdd} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-[#4A3B32] mb-1">
                Category Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Avurudu Festive Collection"
                value={newCatName}
                onChange={(e) => setNewCatName(e.target.value)}
                className="w-full bg-[#FAF7F2] border border-[#DCD0C2] rounded-xl px-3 py-2 text-[#281B13]"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#4A3B32] mb-1">
                Description / Intro Copy (for SEO)
              </label>
              <textarea
                rows={3}
                placeholder="e.g. Handmade clay pots and fragrant cinnamon candles designed for traditional celebrations."
                value={newCatDesc}
                onChange={(e) => setNewCatDesc(e.target.value)}
                className="w-full bg-[#FAF7F2] border border-[#DCD0C2] rounded-xl px-3 py-2 text-[#281B13]"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#C45A2C] hover:bg-[#B24B20] text-white font-bold py-2.5 px-4 rounded-xl shadow-warm transition"
            >
              Create Category
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
