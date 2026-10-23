'use client';

import React, { useState } from 'react';
import { Phone, Mail, MapPin, MessageCircle, Send, CheckCircle2, ChevronDown } from 'lucide-react';

const FAQS = [
  {
    q: 'How does Cash on Delivery (COD) work?',
    a: 'You can place your order online in seconds without entering any credit card or bank details. Our studio will confirm your order via phone/WhatsApp, pack the items, and hand them to our courier partner (PromptX or Koombiyo). You pay the total cash amount directly to the courier delivery agent when they reach your doorstep.',
  },
  {
    q: 'What are the delivery charges and timelines across Sri Lanka?',
    a: 'Delivery to Western Province (Colombo, Gampaha, Kalutara) is Rs. 350 - Rs. 400 and takes 1 to 3 days. All other 22 outstation districts (Kandy, Galle, Matara, Jaffna, Kurunegala, etc.) are Rs. 450 - Rs. 500 and take 2 to 4 days. Free delivery applies to orders of Rs. 3,500 or more!',
  },
  {
    q: 'Can I send a gift directly to family in Sri Lanka from abroad?',
    a: 'Yes! Many Sri Lankans living in Dubai, Qatar, Australia, UK, and Italy order gifts through Flamira. You can pay via direct online bank transfer to Commercial Bank or Sampath Bank, and we will package the gift with a handwritten card and deliver it island-wide with zero payment due from the recipient.',
  },
  {
    q: 'How long do the botanical wax sachets last?',
    a: 'Our botanical wax sachets scent wardrobes, dressers, linen closets, and enclosed spaces for 3 to 4 months. Because they require no flame, they are safe to hang continuously.',
  },
  {
    q: 'What is your return & damaged-goods policy?',
    a: 'Every parcel is packed with shock-resistant cushioning. If an item arrives damaged during courier handling, simply send us a photo on WhatsApp at 071 116 8590 within 24 hours of delivery, and we will send an immediate free replacement or refund.',
  },
];

const ContactPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="bg-[#FAF7F2] min-h-screen py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs uppercase tracking-widest text-[#C45A2C] font-bold block mb-1">
            We Would Love to Hear from You
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#281B13]">
            Get In Touch
          </h1>
          <p className="text-sm text-[#796455] mt-2">
            Have questions about a custom scented blend, wedding favors, or an active order? Reach our Colombo studio directly.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
          {/* Contact Details Card */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 border border-[#EBE2D5] shadow-soft space-y-6">
            <h2 className="font-serif text-xl font-bold text-[#281B13]">
              Studio Information
            </h2>

            <div className="space-y-4 text-xs sm:text-sm text-[#4A3B32]">
              <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-[#FAF7F2] border border-[#EAE0D3]">
                <div className="w-9 h-9 rounded-xl bg-[#FFF3E0] text-[#C45A2C] flex items-center justify-center shrink-0">
                  <Phone size={18} />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#8C7A6B] block">Hotline &amp; Orders</span>
                  <a href="tel:0711168590" className="font-bold text-[#281B13] hover:text-[#C45A2C] transition">
                    071 116 8590
                  </a>
                  <p className="text-[11px] text-[#796455]">Daily 9:00 AM – 7:30 PM</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-[#FAF7F2] border border-[#EAE0D3]">
                <div className="w-9 h-9 rounded-xl bg-[#E8F5E9] text-[#2E7D32] flex items-center justify-center shrink-0">
                  <MessageCircle size={18} />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#8C7A6B] block">WhatsApp Support</span>
                  <a
                    href="https://wa.me/94711168590?text=Hi%20Flamira!"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-bold text-[#281B13] hover:text-[#25D366] transition"
                  >
                    +94 71 116 8590
                  </a>
                  <p className="text-[11px] text-[#796455]">Instant replies for active orders</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-[#FAF7F2] border border-[#EAE0D3]">
                <div className="w-9 h-9 rounded-xl bg-[#F6DDD2] text-[#943B17] flex items-center justify-center shrink-0">
                  <Mail size={18} />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#8C7A6B] block">Email Inquiries</span>
                  <a href="mailto:candlesflamira@gmail.com" className="font-bold text-[#281B13] hover:text-[#C45A2C] transition">
                    candlesflamira@gmail.com
                  </a>
                  <p className="text-[11px] text-[#796455]">Corporate gifting &amp; press</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-[#FAF7F2] border border-[#EAE0D3]">
                <div className="w-9 h-9 rounded-xl bg-[#FAF0E6] text-[#793216] flex items-center justify-center shrink-0">
                  <MapPin size={18} />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#8C7A6B] block">Artisan Workshop</span>
                  <p className="font-bold text-[#281B13]">Colombo &amp; Western Province</p>
                  <p className="text-[11px] text-[#796455]">Sri Lanka (Deliveries Island-Wide)</p>
                </div>
              </div>
            </div>

            {/* Social channels */}
            <div className="pt-2 border-t border-[#F2ECE1]">
              <span className="text-xs font-bold text-[#281B13] block mb-2">Connect on Social Media</span>
              <div className="flex gap-2 text-xs">
                <a
                  href="https://www.facebook.com/share/1GfuMD9JvL/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-xl bg-[#FAF7F2] text-[#1877F2] font-semibold border border-[#EAE0D3]"
                >
                  Facebook Page
                </a>
                <a
                  href="https://www.tiktok.com/@flamira11?_r=1&_t=ZS-99vD6syl71o"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-xl bg-[#FAF7F2] text-black font-semibold border border-[#EAE0D3]"
                >
                  TikTok @flamira11
                </a>
              </div>
            </div>
          </div>

          {/* Contact Inquiry Form */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-[#EBE2D5] shadow-soft">
            <h2 className="font-serif text-xl font-bold text-[#281B13] mb-4">
              Send a Note to Our Studio
            </h2>

            {submitted ? (
              <div className="text-center py-12 space-y-4">
                <div className="w-16 h-16 rounded-full bg-[#E8F5E9] text-[#2E7D32] flex items-center justify-center mx-auto">
                  <CheckCircle2 size={36} />
                </div>
                <h3 className="font-serif text-2xl font-bold text-[#281B13]">
                  Message Received!
                </h3>
                <p className="text-xs text-[#796455] max-w-sm mx-auto">
                  Thank you for reaching out. We will get back to you within 24 hours.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="text-xs font-semibold text-[#C45A2C] underline"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-[#4A3B32] mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Dinuka Fernando"
                    className="w-full bg-[#FAF7F2] border border-[#DCD0C2] rounded-xl px-3.5 py-2.5 text-[#281B13] focus:ring-1 focus:ring-[#C45A2C] focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-[#4A3B32] mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. dinuka@gmail.com"
                      className="w-full bg-[#FAF7F2] border border-[#DCD0C2] rounded-xl px-3.5 py-2.5 text-[#281B13] focus:ring-1 focus:ring-[#C45A2C] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-[#4A3B32] mb-1">
                      Phone / WhatsApp Number
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="e.g. 076 899 1234"
                      className="w-full bg-[#FAF7F2] border border-[#DCD0C2] rounded-xl px-3.5 py-2.5 text-[#281B13] focus:ring-1 focus:ring-[#C45A2C] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-[#4A3B32] mb-1">
                    Your Message / Custom Request *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="How can we assist you with our candles, wax sachets, or hampers?"
                    className="w-full bg-[#FAF7F2] border border-[#DCD0C2] rounded-xl px-3.5 py-2.5 text-[#281B13] focus:ring-1 focus:ring-[#C45A2C] focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#C45A2C] hover:bg-[#B24B20] text-white font-bold py-3.5 px-6 rounded-xl text-xs flex items-center justify-center gap-2 shadow-warm transition"
                >
                  <Send size={15} />
                  <span>Send Message</span>
                </button>
              </form>
            )}
          </div>
        </div>

        {/* FAQ Section */}
        <div id="faq" className="bg-white rounded-3xl p-6 sm:p-10 border border-[#EBE2D5] shadow-soft">
          <div className="text-center max-w-xl mx-auto mb-8">
            <h2 className="font-serif text-2xl font-bold text-[#281B13]">
              Frequently Asked Questions
            </h2>
            <p className="text-xs text-[#796455] mt-1">
              Common questions about Cash on Delivery, candle ingredients, and shipping.
            </p>
          </div>

          <div className="space-y-3 max-w-3xl mx-auto">
            {FAQS.map((item, idx) => (
              <div
                key={idx}
                className="border border-[#EBE2D5] rounded-2xl overflow-hidden bg-[#FAF7F2]"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full p-4 text-left flex items-center justify-between gap-4 font-semibold text-xs sm:text-sm text-[#281B13]"
                >
                  <span>{item.q}</span>
                  <ChevronDown
                    size={16}
                    className={`transition-transform duration-200 text-[#C45A2C] ${
                      openFaq === idx ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {openFaq === idx && (
                  <div className="px-4 pb-4 text-xs text-[#5C4A3E] leading-relaxed border-t border-[#F0E5D8] pt-3">
                    {item.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
