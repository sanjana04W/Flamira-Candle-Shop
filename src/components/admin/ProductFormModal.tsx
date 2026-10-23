'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { X, Upload, Plus, Check } from 'lucide-react';
import { Product } from '@/types';
import { useStore } from '@/context/StoreContext';

interface ProductFormModalProps {
  productToEdit?: Product | null;
  onClose: () => void;
}

const AVAILABLE_PHOTOS = [
  '/655262671_122093121632882346_8581853442807059261_n.jpg',
  '/658124889_122093619152882346_561578412808274042_n.jpg',
  '/660066117_122103933722882346_7544193734310796186_n.jpg',
  '/662851553_122104325228882346_7184983019654848002_n.jpg',
  '/668883716_122104862786882346_752871602877632378_n.jpg',
  '/672148837_122107617404882346_2846548033191575758_n.jpg',
  '/679422366_122110270298882346_7669181391876092969_n.jpg',
  '/680440423_122109343136882346_5388814879692104964_n.jpg',
  '/687890525_122111011526882346_6060026060767211306_n.jpg',
  '/689351605_122111175746882346_6458185944789427247_n.jpg',
  '/689467206_122111338388882346_7988076411671648754_n.jpg',
  '/690737234_122111175788882346_3720678699200967590_n.jpg',
  '/690797105_122111175830882346_1667326613950145715_n.jpg',
  '/695095052_122111502290882346_4085690875383256839_n.jpg',
  '/698844608_122112137762882346_6244009896054320085_n.jpg',
  '/699056767_122112529430882346_3571476391820059021_n.jpg',
  '/702106998_122113589072882346_4147217457947796703_n.jpg',
  '/702164271_122113496186882346_6854832126310709165_n.jpg',
  '/702982588_122113589084882346_4017194765845109875_n.jpg',
  '/703180892_122113795334882346_7965782958347142697_n.jpg',
  '/703762871_122113964222882346_4421959720945823284_n.jpg',
  '/703914909_122113795346882346_7699315113295781373_n.jpg',
  '/704188000_122113795376882346_3723514591264962049_n.jpg',
  '/706474323_122114700044882346_195413676853915904_n.jpg',
  '/706559778_122114527112882346_2152457209714746659_n.jpg',
  '/708517157_122115029120882346_7289785111891474156_n.jpg',
  '/709135415_122115029198882346_4415760695545297038_n.jpg',
  '/709135419_122115029204882346_1583563683756917110_n.jpg',
  '/709709570_122115029348882346_4157585918315441383_n.jpg',
  '/709821638_122115029288882346_7055015103981512208_n.jpg',
  '/714264670_122115842870882346_2439752414631607631_n.jpg',
  '/715138275_122115842894882346_6325419023057040877_n.jpg',
  '/715158052_122115842804882346_6746907012076202854_n.jpg',
  '/716986238_122116133288882346_7117211736496752732_n.jpg',
];

export const ProductFormModal: React.FC<ProductFormModalProps> = ({
  productToEdit,
  onClose,
}) => {
  const { addProduct, updateProduct, categories } = useStore();

  const [title, setTitle] = useState(productToEdit?.title || '');
  const [sku, setSku] = useState(productToEdit?.sku || `FLM-PROD-${Math.floor(Math.random() * 900 + 100)}`);
  const [categoryId, setCategoryId] = useState(productToEdit?.categoryId || categories[0]?.id || 'cat-wax-sachets');
  const [price, setPrice] = useState(productToEdit?.price?.toString() || '1200');
  const [salePrice, setSalePrice] = useState(productToEdit?.salePrice?.toString() || '');
  const [costPrice, setCostPrice] = useState(productToEdit?.costPrice?.toString() || '450');
  const [stockQty, setStockQty] = useState(productToEdit?.stockQty?.toString() || '20');
  const [lowStockThreshold, setLowStockThreshold] = useState(productToEdit?.lowStockThreshold?.toString() || '5');
  const [selectedImage, setSelectedImage] = useState(productToEdit?.images?.[0] || AVAILABLE_PHOTOS[0]);
  const [shortDesc, setShortDesc] = useState(productToEdit?.shortDesc || 'Hand-poured pure soy wax with Ceylon dried botanicals.');
  const [scentNotes, setScentNotes] = useState(productToEdit?.scentNotes?.join(', ') || 'Ceylon Cinnamon, Sweet Orange');
  const [dimensions, setDimensions] = useState(productToEdit?.dimensions || '8cm × 6cm');
  const [material, setMaterial] = useState(productToEdit?.material || '100% Pure Soy Wax');
  const [isFeatured, setIsFeatured] = useState(productToEdit?.isFeatured ?? true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const catObj = categories.find((c) => c.id === categoryId);
    const categoryName = catObj ? catObj.name : 'Handmade Collection';
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');

    const productPayload = {
      title: title.trim(),
      slug: productToEdit?.slug || slug,
      sku: sku.trim(),
      categoryId,
      categoryName,
      price: parseFloat(price) || 1000,
      salePrice: salePrice ? parseFloat(salePrice) : undefined,
      costPrice: parseFloat(costPrice) || 400,
      stockQty: parseInt(stockQty, 10) || 0,
      lowStockThreshold: parseInt(lowStockThreshold, 10) || 5,
      images: [selectedImage],
      shortDesc: shortDesc.trim(),
      longDesc: `${shortDesc.trim()} Hand-poured with love by Flamira in Ceylon.`,
      occasionTags: ['Birthday', 'Gift', 'Housewarming'],
      scentNotes: scentNotes.split(',').map((s) => s.trim()).filter(Boolean),
      dimensions,
      material,
      status: 'active' as const,
      isFeatured,
      rating: productToEdit?.rating || 5.0,
      reviewCount: productToEdit?.reviewCount || 1,
    };

    if (productToEdit) {
      updateProduct(productToEdit.id, productPayload);
    } else {
      addProduct(productPayload);
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-[#EBE2D5]">
        {/* Header */}
        <div className="p-6 border-b border-[#F2ECE1] flex items-center justify-between sticky top-0 bg-white z-10">
          <div>
            <h3 className="font-serif text-xl font-bold text-[#281B13]">
              {productToEdit ? 'Edit Product' : 'Create New Product'}
            </h3>
            <p className="text-xs text-[#8C7A6B]">
              Add or update items in your live Flamira catalogue.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-stone-700 rounded-xl hover:bg-[#FAF7F2]"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 text-xs">
          {/* Title & SKU */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block font-semibold text-[#4A3B32] mb-1">
                Product Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Cinnamon Spice Soy Candle"
                className="w-full bg-[#FAF7F2] border border-[#DCD0C2] rounded-xl px-3 py-2 text-[#281B13] focus:ring-1 focus:ring-[#C45A2C] focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-semibold text-[#4A3B32] mb-1">
                Product SKU *
              </label>
              <input
                type="text"
                required
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                className="w-full bg-[#FAF7F2] border border-[#DCD0C2] rounded-xl px-3 py-2 text-[#281B13] font-mono focus:ring-1 focus:ring-[#C45A2C] focus:outline-none"
              />
            </div>
          </div>

          {/* Category & Featured */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-[#4A3B32] mb-1">
                Category
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full bg-[#FAF7F2] border border-[#DCD0C2] rounded-xl px-3 py-2 text-[#281B13]"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center pt-5">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="rounded text-[#C45A2C] focus:ring-[#C45A2C] h-4 w-4"
                />
                <span className="font-semibold text-[#281B13]">Show in Featured Collection</span>
              </label>
            </div>
          </div>

          {/* Pricing & Stock */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-2xl bg-[#FAF7F2] border border-[#EAE0D3]">
            <div>
              <label className="block font-semibold text-[#4A3B32] mb-1">
                Regular Price (Rs.) *
              </label>
              <input
                type="number"
                required
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full bg-white border border-[#DCD0C2] rounded-xl px-2.5 py-1.5 text-xs text-[#281B13]"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#4A3B32] mb-1">
                Sale Price (Rs.)
              </label>
              <input
                type="number"
                placeholder="Optional"
                value={salePrice}
                onChange={(e) => setSalePrice(e.target.value)}
                className="w-full bg-white border border-[#DCD0C2] rounded-xl px-2.5 py-1.5 text-xs text-[#281B13]"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#4A3B32] mb-1">
                Stock Quantity *
              </label>
              <input
                type="number"
                required
                value={stockQty}
                onChange={(e) => setStockQty(e.target.value)}
                className="w-full bg-white border border-[#DCD0C2] rounded-xl px-2.5 py-1.5 text-xs text-[#281B13]"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#4A3B32] mb-1">
                Low Stock Threshold
              </label>
              <input
                type="number"
                value={lowStockThreshold}
                onChange={(e) => setLowStockThreshold(e.target.value)}
                className="w-full bg-white border border-[#DCD0C2] rounded-xl px-2.5 py-1.5 text-xs text-[#281B13]"
              />
            </div>
          </div>

          {/* Select Photo from uploaded assets */}
          <div>
            <label className="block font-semibold text-[#4A3B32] mb-1.5">
              Select Product Photo (from Flamira Facebook/Studio Catalog)
            </label>
            <div className="grid grid-cols-6 sm:grid-cols-8 gap-2 max-h-44 overflow-y-auto p-2 bg-[#FAF7F2] rounded-2xl border border-[#DCD0C2]">
              {AVAILABLE_PHOTOS.map((photo, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={() => setSelectedImage(photo)}
                  className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                    selectedImage === photo
                      ? 'border-[#C45A2C] scale-105 shadow-md ring-2 ring-[#C45A2C]/30'
                      : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <Image src={photo} alt="Asset" fill className="object-cover" />
                  {selectedImage === photo && (
                    <div className="absolute top-1 right-1 w-4 h-4 bg-[#C45A2C] text-white rounded-full flex items-center justify-center text-[10px]">
                      ✓
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Description & Scents */}
          <div>
            <label className="block font-semibold text-[#4A3B32] mb-1">
              Short Description
            </label>
            <textarea
              rows={2}
              value={shortDesc}
              onChange={(e) => setShortDesc(e.target.value)}
              className="w-full bg-[#FAF7F2] border border-[#DCD0C2] rounded-xl px-3 py-2 text-[#281B13] focus:ring-1 focus:ring-[#C45A2C] focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold text-[#4A3B32] mb-1">
                Scent Notes (comma separated)
              </label>
              <input
                type="text"
                value={scentNotes}
                onChange={(e) => setScentNotes(e.target.value)}
                placeholder="Orange, Cinnamon, Clove"
                className="w-full bg-[#FAF7F2] border border-[#DCD0C2] rounded-xl px-3 py-2 text-[#281B13]"
              />
            </div>
            <div>
              <label className="block font-semibold text-[#4A3B32] mb-1">
                Dimensions
              </label>
              <input
                type="text"
                value={dimensions}
                onChange={(e) => setDimensions(e.target.value)}
                className="w-full bg-[#FAF7F2] border border-[#DCD0C2] rounded-xl px-3 py-2 text-[#281B13]"
              />
            </div>
            <div>
              <label className="block font-semibold text-[#4A3B32] mb-1">
                Material
              </label>
              <input
                type="text"
                value={material}
                onChange={(e) => setMaterial(e.target.value)}
                className="w-full bg-[#FAF7F2] border border-[#DCD0C2] rounded-xl px-3 py-2 text-[#281B13]"
              />
            </div>
          </div>

          {/* Submit CTA */}
          <div className="flex justify-end gap-3 pt-4 border-t border-[#F2ECE1]">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-[#D5C2B1] text-[#4A3B32] hover:bg-[#FAF7F2] font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-[#C45A2C] hover:bg-[#B24B20] text-white font-bold transition shadow-sm"
            >
              {productToEdit ? 'Save Changes' : 'Create Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
