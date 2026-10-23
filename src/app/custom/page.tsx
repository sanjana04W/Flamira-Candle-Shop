'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Gift, Sparkles, MessageCircle, Clock, Heart, CheckCircle2, Send } from 'lucide-react';
import { formatLKR } from '@/lib/utils';

export default function CustomOrdersPage() {
  const [occasion, setOccasion] = useState('Wedding Favors');
  const [quantity, setQuantity] = useState(50);
  const [scent, setScent] = useState('Rose Bud & Peony');
  const [packagingType, setPackagingType] = useState('Custom Kraft Box with Wax Seal');
  const [personalizationText, setPersonalizationText] = useState('Shenali & Kasun • 28.11.2026');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [submitted, setSubmitted] = useState(false);

  // Approximate estimation logic
  const unitRate = quantity >= 100 ? 380 : quantity >= 50 ? 420 : 480;
  const estimatedTotal = unitRate * quantity;
  const leadTimeDays = quantity >= 100 ? '10–14 Days' : '5–7 Days';

  const generateWhatsAppMessage = () => {
    const text = `Hi Flamira! I'd like a custom order quote:\n- Type: ${occasion}\n- Quantity: ${quantity} units\n- Scent: ${scent}\n- Packaging: ${packagingType}\n- Custom Names/Date: "${personalizationText}"\n- Name: ${customerName || 'Inquirer'}\n- Phone: ${customerPhone}\nEstimated Budget: ${formatLKR(estimatedTotal)}`;
    return `https://wa.me/94711168590?text=${encodeURIComponent(text)}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="bg-[#FAF7F2] min-h-screen py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-[#C45A2C] font-bold mb-2">
            <Sparkles size={14} />
            <span>Bespoke Gifting Studio</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#281B13]">
            Custom Orders &amp; Wedding Favors
          </h1>
          <p className="text-sm text-[#796455] mt-3">
            Celebrate your momentous life chapters with fragrant personalized keepsakes. From botanical mini wax sachets for wedding guests to corporate client boxes.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Form */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-[#EBE2D5] shadow-soft space-y-6">
            <h2 className="font-serif text-xl font-bold text-[#281B13]">
              Bespoke Order Calculator &amp; Inquiry
            </h2>

            {submitted ? (
              <div className="text-center py-8 space-y-4">
                <div className="w-16 h-16 rounded-full bg-[#E8F5E9] text-[#2E7D32] flex items-center justify-center mx-auto">
                  <CheckCircle2 size={36} />
                </div>
                <h3 className="font-serif text-2xl font-bold text-[#281B13]">
                  Thank You for Your Inquiry!
                </h3>
                <p className="text-xs text-[#796455] max-w-md mx-auto">
                  Our team will review your quantities and reach out on WhatsApp/Phone with sample photos and a firm timeline.
                </p>
                <div className="pt-2">
                  <a
                    href={generateWhatsAppMessage()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-[#25D366] text-white text-xs font-bold px-6 py-3 rounded-full shadow-sm"
                  >
                    <MessageCircle size={16} />
                    <span>Send details directly to WhatsApp (071 116 8590)</span>
                  </a>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Occasion type */}
                <div>
                  <label className="block text-xs font-semibold text-[#4A3B32] mb-1.5 uppercase tracking-wider">
                    Occasion / Purpose
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {[
                      'Wedding Favors',
                      'Bridal Shower',
                      'Corporate Hampers',
                      'Birthday Favors',
                      'Baby Arrival',
                      'Festive Gifting',
                    ].map((occ) => (
                      <button
                        type="button"
                        key={occ}
                        onClick={() => setOccasion(occ)}
                        className={`text-xs py-2 px-3 rounded-xl border transition-all text-center font-medium ${
                          occasion === occ
                            ? 'border-[#C45A2C] bg-[#FAF3EA] text-[#C45A2C] font-bold shadow-xs'
                            : 'border-[#EAE0D3] bg-white text-[#4A3B32] hover:bg-[#FAF7F2]'
                        }`}
                      >
                        {occ}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quantity */}
                <div>
                  <label className="block text-xs font-semibold text-[#4A3B32] mb-1.5 uppercase tracking-wider flex justify-between">
                    <span>Desired Quantity</span>
                    <span className="text-[#C45A2C] font-bold">{quantity} Pieces</span>
                  </label>
                  <input
                    type="range"
                    min={10}
                    max={300}
                    step={5}
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value, 10))}
                    className="w-full accent-[#C45A2C] cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-[#8C7A6B] mt-1">
                    <span>10 pcs</span>
                    <span>50 pcs</span>
                    <span>100 pcs (Bulk Discount)</span>
                    <span>300 pcs</span>
                  </div>
                </div>

                {/* Scent selection */}
                <div>
                  <label className="block text-xs font-semibold text-[#4A3B32] mb-1.5 uppercase tracking-wider">
                    Signature Fragrance
                  </label>
                  <select
                    value={scent}
                    onChange={(e) => setScent(e.target.value)}
                    className="w-full text-xs bg-[#FAF7F2] border border-[#DCD0C2] rounded-xl px-3.5 py-2.5 text-[#281B13] font-medium"
                  >
                    <option value="Rose Bud & Peony">Rose Bud &amp; Peony (Floral Luxury)</option>
                    <option value="French Lavender & Chamomile">French Lavender &amp; Chamomile (Calming)</option>
                    <option value="Orange, Cinnamon & Clove">Orange, Cinnamon &amp; Clove (Warm Festive)</option>
                    <option value="Madagascar Vanilla & Caramel">Madagascar Vanilla &amp; Caramel (Sweet Gourmand)</option>
                    <option value="Ceylon Jasmine & White Lily">Ceylon Jasmine &amp; White Lily (Classic Ceylon)</option>
                  </select>
                </div>

                {/* Packaging */}
                <div>
                  <label className="block text-xs font-semibold text-[#4A3B32] mb-1.5 uppercase tracking-wider">
                    Packaging Style
                  </label>
                  <select
                    value={packagingType}
                    onChange={(e) => setPackagingType(e.target.value)}
                    className="w-full text-xs bg-[#FAF7F2] border border-[#DCD0C2] rounded-xl px-3.5 py-2.5 text-[#281B13] font-medium"
                  >
                    <option value="Custom Kraft Box with Wax Seal">Individual Kraft Gift Box with Custom Wax Seal</option>
                    <option value="Organza Sheer Pouch with Satin Ribbon">Organza Sheer Pouch with Golden Satin Ribbon</option>
                    <option value="Clear Botanical Gift Bag with Foil Tag">Clear Pillow Box with Gold Foil Tag</option>
                  </select>
                </div>

                {/* Personalization Text */}
                <div>
                  <label className="block text-xs font-semibold text-[#4A3B32] mb-1.5 uppercase tracking-wider">
                    Custom Bride/Groom/Brand Names &amp; Date
                  </label>
                  <input
                    type="text"
                    required
                    value={personalizationText}
                    onChange={(e) => setPersonalizationText(e.target.value)}
                    placeholder="e.g. Shenali & Kasun • 28th Nov 2026"
                    className="w-full bg-[#FAF7F2] border border-[#DCD0C2] rounded-xl px-3.5 py-2.5 text-xs text-[#281B13] focus:ring-1 focus:ring-[#C45A2C] focus:outline-none"
                  />
                </div>

                {/* Contact info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div>
                    <label className="block text-xs font-semibold text-[#4A3B32] mb-1">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="e.g. Shenali Perera"
                      className="w-full bg-[#FAF7F2] border border-[#DCD0C2] rounded-xl px-3.5 py-2.5 text-xs text-[#281B13] focus:ring-1 focus:ring-[#C45A2C] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#4A3B32] mb-1">
                      WhatsApp / Phone *
                    </label>
                    <input
                      type="tel"
                      required
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="e.g. 071 445 5221"
                      className="w-full bg-[#FAF7F2] border border-[#DCD0C2] rounded-xl px-3.5 py-2.5 text-xs text-[#281B13] focus:ring-1 focus:ring-[#C45A2C] focus:outline-none"
                    />
                  </div>
                </div>

                {/* Submit button */}
                <div className="pt-3 flex flex-col sm:flex-row gap-3">
                  <button
                    type="submit"
                    className="flex-1 bg-[#C45A2C] hover:bg-[#B24B20] text-white font-bold py-3.5 px-6 rounded-2xl text-xs flex items-center justify-center gap-2 shadow-warm transition"
                  >
                    <Send size={15} />
                    <span>Submit Online Inquiry</span>
                  </button>

                  <a
                    href={generateWhatsAppMessage()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 bg-[#25D366] hover:bg-[#20BA5C] text-white font-bold py-3.5 px-6 rounded-2xl text-xs flex items-center justify-center gap-2 shadow-sm transition"
                  >
                    <MessageCircle size={16} />
                    <span>Chat on WhatsApp Directly</span>
                  </a>
                </div>
              </form>
            )}
          </div>

          {/* Right Live Estimate & Showcase */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-[#EBE2D5] shadow-soft space-y-4">
              <span className="text-xs uppercase font-bold text-[#8C7A6B] tracking-wider block">
                Instant Estimate Preview
              </span>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-[#FAF7F2]">
                  <span>Item Type:</span>
                  <strong className="text-[#281B13]">{occasion}</strong>
                </div>
                <div className="flex justify-between py-1 border-b border-[#FAF7F2]">
                  <span>Quantity:</span>
                  <strong className="text-[#281B13]">{quantity} units</strong>
                </div>
                <div className="flex justify-between py-1 border-b border-[#FAF7F2]">
                  <span>Unit Price:</span>
                  <strong className="text-[#281B13]">{formatLKR(unitRate)} / unit</strong>
                </div>
                <div className="flex justify-between py-1 border-b border-[#FAF7F2]">
                  <span>Estimated Lead Time:</span>
                  <strong className="text-[#C45A2C] flex items-center gap-1">
                    <Clock size={12} /> {leadTimeDays}
                  </strong>
                </div>
                <div className="flex justify-between pt-3 border-t border-[#EFE8DF] text-base font-bold text-[#281B13]">
                  <span>Estimated Total:</span>
                  <span className="text-[#C45A2C] text-xl font-bold">{formatLKR(estimatedTotal)}</span>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-[#FAF7F2] border border-[#EAE0D3] text-[11px] text-[#796455] space-y-1">
                <p className="font-semibold text-[#281B13]">What is included in every order:</p>
                <p>✓ 100% soy wax infused with therapeutic scent</p>
                <p>✓ Custom typography design &amp; printed name cards</p>
                <p>✓ Choice of ribbon color to match your event theme</p>
                <p>✓ Island-wide courier delivery with safe padding</p>
              </div>
            </div>

            <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-md border border-[#E2D5C4]">
              <Image
                src="/706474323_122114700044882346_195413676853915904_n.jpg"
                alt="Wedding Favors Sachet"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-5">
                <p className="text-white text-xs font-medium">
                  Past Client Order: 120 Rose Bud Mini Sachets for Shenali &amp; Kasun&apos;s Wedding.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
