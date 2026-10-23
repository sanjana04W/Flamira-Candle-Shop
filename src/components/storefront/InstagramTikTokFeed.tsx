'use client';

import React from 'react';
import Image from 'next/image';
import { Play, Sparkles } from 'lucide-react';

const SOCIAL_POSTS = [
  {
    image: '/706474323_122114700044882346_195413676853915904_n.jpg',
    title: 'Packing 120 Wedding Favor Sachets',
    views: '14.2K views',
  },
  {
    image: '/714264670_122115842870882346_2439752414631607631_n.jpg',
    title: 'Pouring pure soy wax with real botanical petals',
    views: '28.5K views',
  },
  {
    image: '/715138275_122115842894882346_6325419023057040877_n.jpg',
    title: 'Custom gold foil calligraphy card unboxing',
    views: '9.8K views',
  },
  {
    image: '/716986238_122116133288882346_7117211736496752732_n.jpg',
    title: 'How our wax sachet rings scent your wardrobe for 3 months',
    views: '32.1K views',
  },
];

export const InstagramTikTokFeed: React.FC = () => {
  return (
    <section className="py-20 bg-[#FAF7F2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-[#C45A2C] font-bold mb-1">
              <Sparkles size={13} />
              <span>Watch The Process</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#281B13]">
              From Our Studio to Your Home
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="https://www.tiktok.com/@flamira11?_r=1&_t=ZS-99vD6syl71o"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-semibold px-4 py-2 rounded-full bg-black text-white hover:bg-stone-800 transition"
            >
              Follow on TikTok
            </a>
            <a
              href="https://www.facebook.com/share/1GfuMD9JvL/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-semibold px-4 py-2 rounded-full bg-[#1877F2] text-white hover:bg-blue-600 transition"
            >
              Facebook Page
            </a>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {SOCIAL_POSTS.map((post, idx) => (
            <div
              key={idx}
              className="group relative aspect-[9/14] rounded-2xl overflow-hidden bg-black shadow-md border border-[#E2D6C5]"
            >
              <Image
                src={post.image}
                alt={post.title}
                fill
                className="object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
              />

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />

              {/* Play Badge */}
              <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/30 backdrop-blur-md flex items-center justify-center text-white group-hover:bg-[#C45A2C] transition-colors">
                <Play size={14} className="fill-white ml-0.5" />
              </div>

              {/* Title & Views */}
              <div className="absolute bottom-3 left-3 right-3 text-white">
                <p className="text-xs font-medium leading-snug line-clamp-2 drop-shadow">
                  {post.title}
                </p>
                <span className="text-[10px] text-stone-300 font-semibold block mt-1">
                  {post.views}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
