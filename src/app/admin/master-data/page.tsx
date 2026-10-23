'use client';

import React, { useState } from 'react';
import { Database, Plus, Trash2, Tag, Sparkles } from 'lucide-react';
import { useStore } from '@/context/StoreContext';

export default function AdminMasterDataPage() {
  const { showToast } = useStore();
  const [scents, setScents] = useState([
    'Ceylon Sweet Orange',
    'Crushed Cinnamon Bark',
    'Spicy Clove Bud',
    'English Rose',
    'Pink Peony',
    'French Lavender',
    'Madagascar Vanilla',
    'Salted Butter Caramel',
    'White Tea & Lotus',
  ]);

  const [occasions, setOccasions] = useState([
    'Birthday',
    'Wedding',
    'Housewarming',
    'Anniversary',
    'Farewell',
    'Thank You',
    'Avurudu',
    'Christmas',
    'Valentine',
  ]);

  const [newScent, setNewScent] = useState('');
  const [newOccasion, setNewOccasion] = useState('');

  const addScent = (e: React.FormEvent) => {
    e.preventDefault();
    if (newScent.trim()) {
      setScents([...scents, newScent.trim()]);
      setNewScent('');
      showToast('New scent note added to master library.');
    }
  };

  const addOccasion = (e: React.FormEvent) => {
    e.preventDefault();
    if (newOccasion.trim()) {
      setOccasions([...occasions, newOccasion.trim()]);
      setNewOccasion('');
      showToast('New occasion tag added to filter axis.');
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] p-6 lg:p-8 space-y-6">
      <div>
        <h1 className="font-serif text-2xl font-bold text-[#281B13]">Master Data &amp; Taxonomies</h1>
        <p className="text-xs text-[#8C7A6B] mt-0.5">
          Standardized scent notes, occasion filters, and candle materials across the store.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Scents Library */}
        <div className="bg-white rounded-3xl p-6 border border-[#EBE2D5] shadow-soft space-y-4">
          <div className="flex items-center justify-between border-b border-[#F2ECE1] pb-3">
            <h2 className="font-serif text-base font-bold text-[#281B13]">
              Botanical Fragrance Library
            </h2>
            <span className="text-xs text-[#8C7A6B]">{scents.length} scents</span>
          </div>

          <div className="flex flex-wrap gap-2">
            {scents.map((s, idx) => (
              <span
                key={idx}
                className="text-xs px-3 py-1.5 rounded-full bg-[#FAF7F2] text-[#4A3B32] border border-[#E8DEC8] flex items-center gap-1.5"
              >
                <span>🌿 {s}</span>
                <button
                  onClick={() => setScents(scents.filter((_, i) => i !== idx))}
                  className="text-stone-400 hover:text-red-600 text-xs ml-1"
                >
                  ✕
                </button>
              </span>
            ))}
          </div>

          <form onSubmit={addScent} className="flex gap-2 pt-2">
            <input
              type="text"
              placeholder="e.g. Ceylon Jasmine &amp; White Lily"
              value={newScent}
              onChange={(e) => setNewScent(e.target.value)}
              className="flex-1 bg-[#FAF7F2] border border-[#DCD0C2] rounded-xl px-3 py-2 text-xs text-[#281B13]"
            />
            <button
              type="submit"
              className="bg-[#281B13] text-white px-4 py-2 rounded-xl text-xs font-semibold hover:bg-stone-800"
            >
              Add Scent
            </button>
          </form>
        </div>

        {/* Occasion Tags Filter Axis */}
        <div className="bg-white rounded-3xl p-6 border border-[#EBE2D5] shadow-soft space-y-4">
          <div className="flex items-center justify-between border-b border-[#F2ECE1] pb-3">
            <h2 className="font-serif text-base font-bold text-[#281B13]">
              Gifting Occasion Axis (Section 6)
            </h2>
            <span className="text-xs text-[#8C7A6B]">{occasions.length} tags</span>
          </div>

          <p className="text-xs text-[#796455]">
            Cross-cutting filter axis allowing products to belong to multiple gifting moments without catalogue duplication.
          </p>

          <div className="flex flex-wrap gap-2">
            {occasions.map((o, idx) => (
              <span
                key={idx}
                className="text-xs px-3 py-1.5 rounded-full bg-[#FAF7F2] text-[#4A3B32] border border-[#E8DEC8] flex items-center gap-1.5"
              >
                <span>🎁 {o}</span>
                <button
                  onClick={() => setOccasions(occasions.filter((_, i) => i !== idx))}
                  className="text-stone-400 hover:text-red-600 text-xs ml-1"
                >
                  ✕
                </button>
              </span>
            ))}
          </div>

          <form onSubmit={addOccasion} className="flex gap-2 pt-2">
            <input
              type="text"
              placeholder="e.g. Bridal Shower"
              value={newOccasion}
              onChange={(e) => setNewOccasion(e.target.value)}
              className="flex-1 bg-[#FAF7F2] border border-[#DCD0C2] rounded-xl px-3 py-2 text-xs text-[#281B13]"
            />
            <button
              type="submit"
              className="bg-[#C45A2C] text-white px-4 py-2 rounded-xl text-xs font-semibold hover:bg-[#B24B20]"
            >
              Add Occasion
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
