'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {
  Star,
  Truck,
  ShieldCheck,
  Heart,
  MessageCircle,
  Plus,
  Minus,
  Sparkles,
  ArrowLeft,
  Check,
  Clock,
  Box,
} from 'lucide-react';
import { useStore } from '@/context/StoreContext';
import { formatLKR, getDeliveryRate } from '@/lib/utils';
import { SRI_LANKA_DISTRICTS } from '@/data/initialData';
import { ProductCard } from '@/components/storefront/ProductCard';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;

  const { products, addToCart, setIsCartOpen, selectedDistrict, setSelectedDistrict } = useStore();

  const product = products.find((p) => p.slug === slug) || products[0];
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [customNote, setCustomNote] = useState('');
  const [activeTab, setActiveTab] = useState<'desc' | 'care' | 'shipping' | 'reviews'>('desc');

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8 text-center bg-[#FAF7F2]">
        <h2 className="font-serif text-2xl font-bold text-[#281B13]">Product Not Found</h2>
        <Link
          href="/shop"
          className="mt-4 bg-[#C45A2C] text-white px-6 py-2.5 rounded-full text-xs font-semibold"
        >
          Back to Shop
        </Link>
      </div>
    );
  }

  const effectivePrice = product.salePrice ?? product.price;
  const isOutOfStock = product.stockQty === 0;
  const deliveryInfo = getDeliveryRate(selectedDistrict, effectivePrice * quantity);

  const handleAddToCart = () => {
    addToCart(product, quantity, undefined, customNote.trim() || undefined);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity, undefined, customNote.trim() || undefined);
    setIsCartOpen(false);
    router.push('/checkout');
  };

  const relatedProducts = products
    .filter((p) => p.categoryId === product.categoryId && p.id !== product.id)
    .slice(0, 4);

  return (
    <div className="bg-[#FAF7F2] min-h-screen py-8 lg:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-[#8C7A6B] mb-8">
          <Link href="/" className="hover:text-[#C45A2C] transition">Home</Link>
          <span>/</span>
          <Link href="/shop" className="hover:text-[#C45A2C] transition">Shop</Link>
          <span>/</span>
          <Link href={`/shop?category=${product.categoryId}`} className="hover:text-[#C45A2C] transition">
            {product.categoryName}
          </Link>
          <span>/</span>
          <span className="text-[#281B13] font-medium truncate max-w-[200px]">{product.title}</span>
        </nav>

        {/* Product Showcase Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 bg-white p-6 sm:p-8 rounded-3xl border border-[#EBE2D5] shadow-soft">
          {/* Left: Image Gallery */}
          <div className="lg:col-span-6 space-y-4">
            {/* Primary Big Image */}
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-[#F6F1EA] border border-[#EAE2D5] shadow-inner group">
              <Image
                src={product.images[selectedImageIndex] || product.images[0] || '/flamira-logo.png'}
                alt={product.title}
                fill
                priority
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              {product.salePrice && (
                <div className="absolute top-4 left-4 bg-[#C45A2C] text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow">
                  Sale
                </div>
              )}
            </div>

            {/* Thumbnail switcher */}
            {product.images.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-2">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`relative w-20 h-20 rounded-xl overflow-hidden bg-[#F6F1EA] border-2 transition-all shrink-0 ${
                      selectedImageIndex === idx
                        ? 'border-[#C45A2C] shadow-md scale-102'
                        : 'border-[#EAE2D5] opacity-70 hover:opacity-100'
                    }`}
                  >
                    <Image src={img} alt={`View ${idx + 1}`} fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Product Details & Purchase Controls */}
          <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              {/* Category, SKU & Rating */}
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                <span className="text-[#C45A2C] font-bold uppercase tracking-wider">
                  {product.categoryName}
                </span>
                <span className="text-[#8C7A6B] bg-[#FAF7F2] px-2.5 py-1 rounded-full border border-[#E8DEC8]">
                  SKU: <strong>{product.sku}</strong>
                </span>
              </div>

              {/* Title */}
              <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-[#281B13] leading-tight">
                {product.title}
              </h1>

              {/* Rating & Review Summary */}
              <div className="flex items-center gap-3">
                <div className="flex items-center text-[#FFA000]">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      className={i < Math.floor(product.rating) ? 'fill-[#FFA000]' : 'text-stone-300'}
                    />
                  ))}
                </div>
                <span className="text-xs font-bold text-[#281B13]">{product.rating.toFixed(1)}</span>
                <span className="text-xs text-[#8C7A6B]">({product.reviewCount} customer reviews)</span>
              </div>

              {/* Price & COD Note */}
              <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#EBE2D5] flex items-center justify-between">
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl sm:text-3xl font-bold text-[#C45A2C]">
                      {formatLKR(effectivePrice)}
                    </span>
                    {product.salePrice && (
                      <span className="text-sm text-stone-400 line-through">
                        {formatLKR(product.price)}
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-green-700 font-semibold block mt-0.5">
                    ✓ Cash on Delivery Available Island-Wide
                  </span>
                </div>

                <div className="text-right">
                  {product.stockQty > 0 ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E8F5E9] text-[#2E7D32] text-xs font-semibold">
                      <span className="w-2 h-2 rounded-full bg-[#2E7D32]" />
                      <span>In Stock ({product.stockQty} units)</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 text-red-700 text-xs font-semibold">
                      <span>Out of Stock</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Scent Notes Badges */}
              {product.scentNotes && product.scentNotes.length > 0 && (
                <div>
                  <label className="block text-xs font-semibold text-[#665446] uppercase tracking-wider mb-2">
                    Aroma &amp; Fragrance Notes:
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {product.scentNotes.map((note, idx) => (
                      <span
                        key={idx}
                        className="text-xs font-medium px-3 py-1 rounded-full bg-white text-[#4A3B32] border border-[#DFD5C6] shadow-2xs"
                      >
                        🌿 {note}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Physical Specifications */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs text-[#5C4A3E] pt-2">
                {product.dimensions && (
                  <div className="p-2.5 rounded-xl bg-[#FAF7F2] border border-[#EAE0D3]">
                    <span className="text-[#8C7A6B] block text-[10px] uppercase font-semibold">Size</span>
                    <span className="font-semibold text-[#281B13]">{product.dimensions}</span>
                  </div>
                )}
                {product.material && (
                  <div className="p-2.5 rounded-xl bg-[#FAF7F2] border border-[#EAE0D3]">
                    <span className="text-[#8C7A6B] block text-[10px] uppercase font-semibold">Material</span>
                    <span className="font-semibold text-[#281B13] truncate block">{product.material}</span>
                  </div>
                )}
                {product.weightGrams && (
                  <div className="p-2.5 rounded-xl bg-[#FAF7F2] border border-[#EAE0D3]">
                    <span className="text-[#8C7A6B] block text-[10px] uppercase font-semibold">Weight</span>
                    <span className="font-semibold text-[#281B13]">{product.weightGrams}g</span>
                  </div>
                )}
              </div>

              {/* Personalization Note */}
              <div className="pt-2">
                <label className="block text-xs font-semibold text-[#665446] uppercase tracking-wider mb-1.5 flex items-center justify-between">
                  <span>Custom Gift Note / Name (Optional)</span>
                  <span className="text-[10px] text-[#8C7A6B]">{customNote.length}/100</span>
                </label>
                <input
                  type="text"
                  maxLength={100}
                  placeholder="e.g. Happy Birthday Shenali! Love from Amaya."
                  value={customNote}
                  onChange={(e) => setCustomNote(e.target.value)}
                  className="w-full bg-[#FAF7F2] border border-[#DCD0C2] rounded-xl px-3.5 py-2.5 text-xs text-[#281B13] focus:outline-none focus:ring-1 focus:ring-[#C45A2C]"
                />
              </div>

              {/* Live District Delivery Estimator */}
              <div className="p-3.5 rounded-2xl bg-[#FFFBF7] border border-[#ECDCCB] space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-[#281B13] flex items-center gap-1.5">
                    <Truck size={15} className="text-[#C45A2C]" />
                    <span>Estimate Delivery to District:</span>
                  </span>
                  <select
                    value={selectedDistrict}
                    onChange={(e) => setSelectedDistrict(e.target.value)}
                    className="text-xs bg-white border border-[#DCD0C2] rounded-lg px-2.5 py-1 text-[#281B13] font-medium"
                  >
                    {SRI_LANKA_DISTRICTS.map((d) => (
                      <option key={d.district} value={d.district}>
                        {d.district}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center justify-between text-xs text-[#796455] pt-1 border-t border-[#F0E4D5]">
                  <span>Courier: <strong>PromptX / Koombiyo</strong> ({deliveryInfo.estimatedDays})</span>
                  <span>
                    Charge:{' '}
                    {deliveryInfo.isFree ? (
                      <strong className="text-green-700">FREE</strong>
                    ) : (
                      <strong className="text-[#281B13]">{formatLKR(deliveryInfo.rate)}</strong>
                    )}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Bar (Quantity, Add to Bag, Buy COD) */}
            <div className="space-y-3 pt-4 border-t border-[#EFE8DF]">
              <div className="flex items-center gap-4">
                {/* Quantity Stepper */}
                <div className="flex items-center border border-[#DFD5C6] rounded-2xl bg-[#FAF7F2] p-1">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={quantity <= 1 || isOutOfStock}
                    className="p-2 text-[#4A3B32] hover:bg-[#EDE3D5] rounded-xl transition disabled:opacity-30"
                    aria-label="Decrease quantity"
                  >
                    <Minus size={15} />
                  </button>
                  <span className="px-4 text-sm font-bold text-[#281B13] min-w-[24px] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => Math.min(product.stockQty, q + 1))}
                    disabled={quantity >= product.stockQty || isOutOfStock}
                    className="p-2 text-[#4A3B32] hover:bg-[#EDE3D5] rounded-xl transition disabled:opacity-30"
                    aria-label="Increase quantity"
                  >
                    <Plus size={15} />
                  </button>
                </div>

                {/* Add to Bag Button */}
                <button
                  onClick={handleAddToCart}
                  disabled={isOutOfStock}
                  className="flex-1 bg-white hover:bg-[#FAF7F2] text-[#281B13] border-2 border-[#281B13] font-bold text-sm py-3 px-5 rounded-2xl transition disabled:opacity-40"
                >
                  Add to Cart
                </button>

                {/* Buy Now COD Button */}
                <button
                  onClick={handleBuyNow}
                  disabled={isOutOfStock}
                  className="flex-1 bg-[#C45A2C] hover:bg-[#B24B20] text-white font-bold text-sm py-3.5 px-5 rounded-2xl transition shadow-warm hover:shadow-hover disabled:opacity-40"
                >
                  Buy Now (COD)
                </button>
              </div>

              {/* Direct WhatsApp Pre-filled Inquiry */}
              <a
                href={`https://wa.me/94711168590?text=Hi%20Flamira,%20I'm%20interested%20in%20"${encodeURIComponent(
                  product.title
                )}"%20(SKU:%20${product.sku}).%20Is%20it%20available%20for%20delivery?`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#25D366]/10 text-[#128C7E] hover:bg-[#25D366]/20 transition text-xs font-semibold border border-[#25D366]/30"
              >
                <MessageCircle size={15} />
                <span>Ask about this item on WhatsApp (Pre-filled SKU: {product.sku})</span>
              </a>
            </div>
          </div>
        </div>

        {/* Tabbed Info (Description, Care Guide, Shipping, Customer Reviews) */}
        <div className="mt-12 bg-white rounded-3xl p-6 sm:p-8 border border-[#EBE2D5] shadow-soft">
          <div className="flex items-center gap-4 border-b border-[#EFE8DF] overflow-x-auto pb-3">
            {[
              { id: 'desc', label: 'Story & Description' },
              { id: 'care', label: 'Candle Care & Usage Guide' },
              { id: 'shipping', label: 'Island-Wide Delivery Policy' },
              { id: 'reviews', label: `Reviews (${product.reviewCount})` },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`text-sm font-semibold pb-2 border-b-2 whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? 'border-[#C45A2C] text-[#C45A2C]'
                    : 'border-transparent text-[#796455] hover:text-[#281B13]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="pt-6 text-sm text-[#4A3B32] leading-relaxed">
            {activeTab === 'desc' && (
              <div className="space-y-4 max-w-3xl">
                <p>{product.longDesc}</p>
                <h4 className="font-serif font-bold text-base text-[#281B13] pt-2">
                  Artisanal Sri Lankan Crafting
                </h4>
                <p>
                  Each piece is designed and hand-poured in Colombo, Sri Lanka.
                  We preserve authentic Ceylon spices, floral blooms, and organic botanical oils.
                  No two pieces are identical, celebrating the true individuality of handmade art.
                </p>
              </div>
            )}

            {activeTab === 'care' && (
              <div className="space-y-3 max-w-2xl">
                <h4 className="font-serif font-bold text-base text-[#281B13]">
                  Maximizing Scent Throw &amp; Lifespan
                </h4>
                <ul className="list-disc pl-5 space-y-2 text-xs sm:text-sm">
                  <li><strong>For Wax Sachets:</strong> Hang in closets, wardrobes, linen drawers, or study corners. Avoid direct midday tropical sunlight or hot car dashboards above 45°C.</li>
                  <li><strong>First Candle Burn:</strong> Allow the wax to melt completely to the edges of the jar on first lighting (approx. 2 hours) to avoid memory rings/tunneling.</li>
                  <li><strong>Wick Trimming:</strong> Trim cotton wick to 5mm before every burn to prevent excess smoke and prolong burn time.</li>
                  <li><strong>After Use:</strong> Once candle wax finishes, wash the glass or clay jar with warm soapy water to repurpose as an aesthetic brush holder or planter.</li>
                </ul>
              </div>
            )}

            {activeTab === 'shipping' && (
              <div className="space-y-3 max-w-2xl text-xs sm:text-sm">
                <h4 className="font-serif font-bold text-base text-[#281B13]">
                  Prompt Island-Wide Delivery via Trusted Couriers
                </h4>
                <p>
                  We dispatch orders using PromptX, Koombiyo, and Domex Courier services across all 25 districts in Sri Lanka.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div className="p-3 rounded-xl bg-[#FAF7F2] border border-[#EAE0D3]">
                    <span className="font-bold text-[#281B13] block">Western Province (Colombo, Gampaha, Kalutara)</span>
                    <span className="text-xs text-[#796455]">Delivered in 1 to 3 business days • Rs. 350 - Rs. 400</span>
                  </div>
                  <div className="p-3 rounded-xl bg-[#FAF7F2] border border-[#EAE0D3]">
                    <span className="font-bold text-[#281B13] block">Outstation Districts (All 22 Districts)</span>
                    <span className="text-xs text-[#796455]">Delivered in 2 to 4 business days • Rs. 450 - Rs. 500</span>
                  </div>
                </div>
                <p className="text-xs text-[#C45A2C] font-semibold pt-1">
                  💡 Free delivery on orders of Rs. 3,500 or more!
                </p>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-4 max-w-2xl">
                <div className="flex items-center justify-between pb-3 border-b border-[#F2ECE1]">
                  <div>
                    <span className="font-bold text-lg text-[#281B13]">{product.rating.toFixed(1)} out of 5</span>
                    <p className="text-xs text-[#8C7A6B]">Based on {product.reviewCount} customer reviews</p>
                  </div>
                  <button
                    onClick={() => alert('Thank you! Review submission is tied to verified order numbers.')}
                    className="text-xs font-semibold px-4 py-2 rounded-full bg-[#FAF7F2] border border-[#D5C2B1] hover:bg-[#F2ECE1]"
                  >
                    Write a Review
                  </button>
                </div>

                <div className="space-y-3 pt-2">
                  <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#EAE0D3]">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-xs text-[#281B13]">Thilini K.</span>
                      <span className="text-[11px] text-[#8C7A6B]">1 week ago</span>
                    </div>
                    <div className="flex text-[#FFA000] text-xs my-1">★★★★★</div>
                    <p className="text-xs text-[#5C4A3E]">
                      The packaging was so delicate with a wax seal. Scent throw is soft and relaxing, perfectly balanced!
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <div className="flex items-center justify-between mb-8">
              <h3 className="font-serif text-2xl font-bold text-[#281B13]">
                You May Also Adore
              </h3>
              <Link href="/shop" className="text-xs font-semibold text-[#C45A2C] hover:underline">
                View All →
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((rel) => (
                <ProductCard key={rel.id} product={rel} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
