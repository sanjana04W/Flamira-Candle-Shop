'use client';

import React from 'react';
import { Star, MessageCircle, Heart, CheckCircle2 } from 'lucide-react';

const REVIEWS = [
  {
    name: 'Kaveesha Sanhinda',
    location: 'Maharagama, Colombo',
    item: 'Orange, Cinnamon & Clove Wax Sachet',
    rating: 5,
    text: 'The citrus and cinnamon aroma filled my room the moment I opened the parcel. The wax stamp on the packaging felt so luxurious. Hands down the best wax sachet in Sri Lanka!',
    date: 'Verified Buyer • October 2026',
  },
  {
    name: 'Chamika Dilshan',
    location: 'Gampaha',
    item: 'Resin Flower Birthday Greeting Card & Wax Disc',
    rating: 5,
    text: 'Ordered this for my fiancé’s birthday. The dried wildflowers encased in the resin card look even better in real life. Fast delivery and pay COD at the door was very reassuring.',
    date: 'Verified Buyer • October 2026',
  },
  {
    name: 'Sanduni Perera',
    location: 'Colombo 07',
    item: 'Signature Gift Hamper Box',
    rating: 5,
    text: 'I ordered the gift box with a custom handwritten note. The recipient called me crying tears of joy! The candle burns so evenly and smells heavenly. Will definitely be a repeat customer.',
    date: 'Verified Buyer • September 2026',
  },
];

export const TestimonialsSection: React.FC = () => {
  return (
    <section className="py-20 bg-white border-b border-[#EFE8DF]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-[#C45A2C] font-bold mb-2">
            <Heart size={13} className="fill-[#C45A2C]" />
            <span>Customer Love &amp; Social Proof</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#281B13]">
            What Our Customers Say
          </h2>
          <p className="text-sm text-[#796455] mt-2">
            Over 500+ happy homes across Sri Lanka fragrant with Flamira botanical candles and sachets.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {REVIEWS.map((rev, idx) => (
            <div
              key={idx}
              className="p-6 rounded-3xl bg-[#FAF7F2] border border-[#EBE2D5] flex flex-col justify-between shadow-soft hover:shadow-warm transition-all duration-300"
            >
              <div>
                {/* Rating stars */}
                <div className="flex items-center gap-1 text-[#FFA000] mb-3">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} size={15} className="fill-[#FFA000]" />
                  ))}
                </div>

                {/* Quote */}
                <p className="text-sm text-[#3E3027] italic leading-relaxed mb-4">
                  &ldquo;{rev.text}&rdquo;
                </p>
              </div>

              <div className="pt-4 border-t border-[#EAE0D3]">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-serif font-bold text-sm text-[#281B13]">
                      {rev.name}
                    </h4>
                    <span className="text-xs text-[#8C7A6B] block">
                      {rev.location}
                    </span>
                  </div>
                  <span className="flex items-center gap-1 text-[11px] text-[#2E7D32] bg-[#E8F5E9] px-2.5 py-1 rounded-full font-medium">
                    <CheckCircle2 size={12} />
                    <span>Verified</span>
                  </span>
                </div>
                <div className="mt-2 text-[11px] text-[#C45A2C] font-medium truncate">
                  Purchased: {rev.item}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
