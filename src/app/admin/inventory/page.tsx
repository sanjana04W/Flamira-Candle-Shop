'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { AlertTriangle, Plus, Minus, Search, Check, RefreshCw } from 'lucide-react';
import { useStore } from '@/context/StoreContext';
import { formatLKR } from '@/lib/utils';

export default function AdminInventoryPage() {
  const { products, updateProduct } = useStore();
  const [filterType, setFilterType] = useState<'all' | 'low' | 'out'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [adjustAmounts, setAdjustAmounts] = useState<Record<string, number>>({});

  const lowStockItems = products.filter(
    (p) => p.stockQty > 0 && p.stockQty <= p.lowStockThreshold
  );
  const outOfStockItems = products.filter((p) => p.stockQty === 0);

  const filtered = products.filter((p) => {
    if (filterType === 'low' && (p.stockQty > p.lowStockThreshold || p.stockQty === 0)) {
      return false;
    }
    if (filterType === 'out' && p.stockQty > 0) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return p.title.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q);
    }
    return true;
  });

  const handleQuickDelta = (productId: string, currentQty: number, delta: number) => {
    const newQty = Math.max(0, currentQty + delta);
    updateProduct(productId, { stockQty: newQty });
  };

  const handleCustomSet = (productId: string) => {
    const customVal = adjustAmounts[productId];
    if (customVal !== undefined && !isNaN(customVal)) {
      updateProduct(productId, { stockQty: Math.max(0, customVal) });
      setAdjustAmounts((prev) => {
        const next = { ...prev };
        delete next[productId];
        return next;
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-serif text-2xl font-bold text-[#281B13]">Inventory &amp; Stock Control</h1>
        <p className="text-xs text-[#8C7A6B] mt-0.5">
          Real-time stock tracking with atomic deduction on checkout. Prevent overselling and manage restocks.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div
          onClick={() => setFilterType('all')}
          className={`p-5 rounded-2xl border cursor-pointer transition ${
            filterType === 'all'
              ? 'bg-white border-[#C45A2C] shadow-soft'
              : 'bg-white/70 border-[#EBE2D5]'
          }`}
        >
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#8C7A6B] block">
            Total Inventory Units
          </span>
          <span className="font-serif text-3xl font-bold text-[#281B13] mt-1 block">
            {products.reduce((sum, p) => sum + p.stockQty, 0)}
          </span>
          <span className="text-xs text-[#8C7A6B]">{products.length} active SKUs</span>
        </div>

        <div
          onClick={() => setFilterType('low')}
          className={`p-5 rounded-2xl border cursor-pointer transition ${
            filterType === 'low'
              ? 'bg-[#FFFBF2] border-[#F6C85E] shadow-soft'
              : 'bg-white/70 border-[#EBE2D5]'
          }`}
        >
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#B78103] block">
            Low Stock Alerts
          </span>
          <span className="font-serif text-3xl font-bold text-[#B78103] mt-1 block">
            {lowStockItems.length}
          </span>
          <span className="text-xs text-[#8C7A6B]">Needs small-batch restock</span>
        </div>

        <div
          onClick={() => setFilterType('out')}
          className={`p-5 rounded-2xl border cursor-pointer transition ${
            filterType === 'out'
              ? 'bg-red-50/80 border-red-300 shadow-soft'
              : 'bg-white/70 border-[#EBE2D5]'
          }`}
        >
          <span className="text-[10px] font-bold uppercase tracking-wider text-red-700 block">
            Out of Stock
          </span>
          <span className="font-serif text-3xl font-bold text-red-700 mt-1 block">
            {outOfStockItems.length}
          </span>
          <span className="text-xs text-[#8C7A6B]">Displaying &quot;Out of Stock&quot; to customers</span>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-3xl p-4 border border-[#EBE2D5] shadow-soft flex items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            placeholder="Search by SKU or Product title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#FAF7F2] border border-[#DCD0C2] rounded-2xl py-2 pl-10 pr-4 text-xs text-[#281B13] focus:outline-none focus:ring-1 focus:ring-[#C45A2C]"
          />
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8C7A6B]" />
        </div>

        <div className="flex gap-2">
          {(['all', 'low', 'out'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              className={`text-xs px-3.5 py-1.5 rounded-full capitalize font-semibold transition ${
                filterType === t
                  ? 'bg-[#281B13] text-white'
                  : 'bg-[#FAF7F2] text-[#5C4A3E] hover:bg-[#F2ECE1]'
              }`}
            >
              {t === 'all' ? 'All Items' : t === 'low' ? 'Low Stock' : 'Out of Stock'}
            </button>
          ))}
        </div>
      </div>

      {/* Inventory List */}
      <div className="bg-white rounded-3xl border border-[#EBE2D5] shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="bg-[#FAF7F2] border-b border-[#F2ECE1]">
              <tr>
                {['Item & SKU', 'Category', 'Current Stock', 'Low Alert Threshold', 'Quick Restock Adjust', 'Direct Set', 'Status'].map(
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
              {filtered.map((prod) => {
                const isLow = prod.stockQty > 0 && prod.stockQty <= prod.lowStockThreshold;
                const isOut = prod.stockQty === 0;

                return (
                  <tr key={prod.id} className="hover:bg-[#FAF7F2] transition">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-11 h-11 rounded-xl overflow-hidden bg-[#FAF7F2] border border-[#EAE0D3] shrink-0">
                          <Image src={prod.images[0] || '/flamira-logo.png'} alt={prod.title} fill className="object-cover" />
                        </div>
                        <div>
                          <span className="font-bold text-[#281B13] block truncate max-w-[200px]">
                            {prod.title}
                          </span>
                          <span className="text-[10px] text-[#8C7A6B] font-mono">{prod.sku}</span>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4 text-[#4A3B32]">{prod.categoryName}</td>

                    <td className="px-5 py-4 font-bold text-base text-[#281B13]">
                      {prod.stockQty}
                    </td>

                    <td className="px-5 py-4 text-[#8C7A6B]">
                      {prod.lowStockThreshold} units
                    </td>

                    {/* Quick Stepper Buttons */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleQuickDelta(prod.id, prod.stockQty, -5)}
                          className="px-2 py-1 bg-[#FAF7F2] hover:bg-[#EDE3D5] text-[#4A3B32] border border-[#D5C2B1] rounded-lg font-bold text-[11px]"
                          title="Deduct 5"
                        >
                          -5
                        </button>
                        <button
                          onClick={() => handleQuickDelta(prod.id, prod.stockQty, -1)}
                          className="px-2 py-1 bg-[#FAF7F2] hover:bg-[#EDE3D5] text-[#4A3B32] border border-[#D5C2B1] rounded-lg font-bold text-[11px]"
                          title="Deduct 1"
                        >
                          -1
                        </button>
                        <button
                          onClick={() => handleQuickDelta(prod.id, prod.stockQty, 1)}
                          className="px-2 py-1 bg-[#FAF7F2] hover:bg-[#EDE3D5] text-[#4A3B32] border border-[#D5C2B1] rounded-lg font-bold text-[11px]"
                          title="Add 1"
                        >
                          +1
                        </button>
                        <button
                          onClick={() => handleQuickDelta(prod.id, prod.stockQty, 10)}
                          className="px-2 py-1 bg-[#FAF3EA] hover:bg-[#EAD6C3] text-[#C45A2C] border border-[#E8DEC8] rounded-lg font-bold text-[11px]"
                          title="Restock 10"
                        >
                          +10
                        </button>
                      </div>
                    </td>

                    {/* Direct Set Input */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1.5">
                        <input
                          type="number"
                          placeholder={prod.stockQty.toString()}
                          value={adjustAmounts[prod.id] ?? ''}
                          onChange={(e) =>
                            setAdjustAmounts({
                              ...adjustAmounts,
                              [prod.id]: parseInt(e.target.value, 10),
                            })
                          }
                          className="w-16 bg-[#FAF7F2] border border-[#DCD0C2] rounded-lg px-2 py-1 text-xs text-center"
                        />
                        {adjustAmounts[prod.id] !== undefined && (
                          <button
                            onClick={() => handleCustomSet(prod.id)}
                            className="p-1 bg-[#C45A2C] text-white rounded-lg hover:bg-[#B24B20]"
                            title="Save exact stock quantity"
                          >
                            <Check size={14} />
                          </button>
                        )}
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                          isOut
                            ? 'bg-red-100 text-red-700'
                            : isLow
                            ? 'bg-[#FFF8E1] text-[#B78103] border border-[#FFE082]'
                            : 'bg-green-50 text-green-700'
                        }`}
                      >
                        {isOut ? 'Out of Stock' : isLow ? 'Low Stock' : 'Good'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
