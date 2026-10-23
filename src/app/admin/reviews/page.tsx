'use client';

import React, { useState } from 'react';
import { Star, CheckCircle, Trash2, Clock } from 'lucide-react';
import { INITIAL_REVIEWS } from '@/data/initialData';
import { useStore } from '@/context/StoreContext';

export default function AdminReviewsPage() {
  const { showToast } = useStore();
  const [reviews, setReviews] = useState(INITIAL_REVIEWS);

  const handleApprove = (id: string) => {
    setReviews(reviews.map((r) => (r.id === id ? { ...r, status: 'approved' } : r)));
    showToast('Review approved and visible on product page.');
  };

  const handleDelete = (id: string) => {
    setReviews(reviews.filter((r) => r.id !== id));
    showToast('Review removed.');
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] p-6 lg:p-8 space-y-6">
      <div>
        <h1 className="font-serif text-2xl font-bold text-[#281B13]">Customer Reviews &amp; Moderation</h1>
        <p className="text-xs text-[#8C7A6B] mt-0.5">
          Moderate verified buyer reviews from customer orders to maintain strong social proof.
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-[#EBE2D5] shadow-soft overflow-hidden">
        <div className="p-5 border-b border-[#F2ECE1] flex justify-between items-center">
          <h2 className="font-serif text-base font-bold text-[#281B13]">
            Verified Buyer Feedback ({reviews.length})
          </h2>
        </div>

        <div className="divide-y divide-[#F5EFE8]">
          {reviews.map((r) => (
            <div key={r.id} className="p-5 flex flex-col sm:flex-row items-start justify-between gap-4">
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-[#281B13]">{r.customerName}</span>
                  <span className="text-[10px] bg-green-50 text-green-700 font-semibold px-2 py-0.5 rounded-full">
                    Verified Purchase
                  </span>
                  <div className="flex text-[#FFA000] text-xs">
                    {'★'.repeat(r.rating)}
                  </div>
                </div>

                <p className="text-xs text-[#C45A2C] font-semibold">
                  Product: {r.productTitle}
                </p>

                <p className="text-xs text-[#4A3B32] italic leading-relaxed">
                  &ldquo;{r.comment}&rdquo;
                </p>

                <span className="text-[10px] text-[#8C7A6B] block">{r.date}</span>
              </div>

              <div className="flex items-center gap-2">
                {r.status === 'pending' ? (
                  <button
                    onClick={() => handleApprove(r.id)}
                    className="bg-[#2E7D32] text-white text-xs font-semibold px-3 py-1.5 rounded-xl hover:bg-green-800 transition"
                  >
                    Approve
                  </button>
                ) : (
                  <span className="text-xs text-green-700 font-bold px-2 py-1">
                    ✓ Published
                  </span>
                )}
                <button
                  onClick={() => handleDelete(r.id)}
                  className="p-1.5 text-stone-400 hover:text-red-600 rounded-lg hover:bg-[#FAF7F2] transition"
                  title="Delete review"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
