import React, { useState } from 'react';
import { 
  Product, 
  PricingTier 
} from '../types';
import { 
  Check, 
  Plus, 
  Minus, 
  ShoppingCart, 
  Leaf, 
  MapPin, 
  Package, 
  Sparkles,
  Info
} from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product, quantity: number, tier: PricingTier) => void;
  onOpenSpecs: (product: Product) => void;
  onOpenSample: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
  onOpenSpecs,
  onOpenSample,
}) => {
  const [quantity, setQuantity] = useState<number>(product.moq);
  const [justAdded, setJustAdded] = useState(false);

  // Find the matching pricing tier based on quantity
  const activeTier = product.pricingTiers.reduce((acc, tier) => {
    if (quantity >= tier.minQty) {
      if (!tier.maxQty || quantity <= tier.maxQty) {
        return tier;
      }
      return tier;
    }
    return acc;
  }, product.pricingTiers[0]);

  const unitPrice = activeTier.unitPrice;
  const lineTotal = unitPrice * quantity;
  const originalTotal = product.basePrice * quantity;
  const savings = originalTotal - lineTotal;

  const handleQuantityChange = (val: number) => {
    if (isNaN(val)) return;
    if (val < product.moq) val = product.moq;
    setQuantity(val);
  };

  const handleAdd = () => {
    onAddToCart(product, quantity, activeTier);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1600);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 hover:border-blue-400 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col h-full overflow-hidden group">
      {/* Product Image Header with Badges */}
      <div className="relative h-52 sm:h-56 bg-slate-100 overflow-hidden shrink-0">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-black/20" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-start justify-between gap-2 pointer-events-none">
          <div className="flex flex-wrap gap-1.5">
            {product.featured && (
              <span className="px-2.5 py-1 rounded-md bg-blue-600 text-white text-[11px] font-bold shadow-xs flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-300" />
                Featured
              </span>
            )}
            {product.ecoFriendly && (
              <span className="px-2 py-1 rounded-md bg-emerald-600 text-white text-[11px] font-bold shadow-xs flex items-center gap-1">
                <Leaf className="w-3 h-3" />
                Eco-Certified
              </span>
            )}
          </div>

          <span className="px-2 py-0.5 rounded-md bg-slate-900/80 backdrop-blur-xs text-slate-200 text-[10px] font-mono tracking-wider border border-white/20">
            {product.sku}
          </span>
        </div>

        {/* Bottom Image Overlay Details */}
        <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-white text-xs">
          <span className="flex items-center gap-1 font-medium bg-black/40 backdrop-blur-xs px-2 py-0.5 rounded">
            <Package className="w-3.5 h-3.5 text-blue-300" />
            {product.unitOfMeasure}
          </span>
          <span className="flex items-center gap-1 text-[11px] text-emerald-300 font-semibold bg-emerald-950/60 backdrop-blur-xs px-2 py-0.5 rounded border border-emerald-500/30">
            <MapPin className="w-3 h-3" />
            {product.stockUnits} In Stock
          </span>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Category & Certifications */}
          <div className="flex items-center justify-between gap-2 text-xs text-slate-500 mb-1.5">
            <span className="font-semibold text-blue-700 tracking-wide uppercase text-[10px]">
              {product.category}
            </span>
            <div className="flex items-center gap-1 text-[11px] text-slate-600 truncate">
              {product.certifications[0]}
            </div>
          </div>

          {/* Product Name */}
          <h3 className="font-bold text-slate-900 text-base group-hover:text-blue-700 transition-colors line-clamp-2 leading-snug">
            {product.name}
          </h3>

          {/* Short specs */}
          <p className="text-xs text-slate-600 mt-1 line-clamp-1 font-medium">
            {product.shortSpec}
          </p>

          {/* Pallet/Carton logistics metric */}
          <div className="mt-3 py-1.5 px-2.5 bg-slate-50 border border-slate-200/80 rounded-lg flex items-center justify-between text-[11px] text-slate-600">
            <span className="flex items-center gap-1">
              <span className="text-slate-400">Pallet Spec:</span>
              <strong className="text-slate-800">{product.packaging.packType}</strong>
            </span>
            <span className="font-mono text-slate-700">
              {product.packaging.weightLbs} lbs / unit
            </span>
          </div>

          {/* Bulk Pricing Tier Table */}
          <div className="mt-3.5">
            <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
              <span>Bulk Pricing Matrix</span>
              <span className="text-emerald-700 font-semibold lowercase">
                MOQ: {product.moq} {product.moq === 1 ? 'pack' : 'packs'}
              </span>
            </div>

            <div className="border border-slate-200 rounded-lg overflow-hidden text-xs">
              <div className="grid grid-cols-12 bg-slate-100 text-slate-600 font-semibold py-1 px-2 border-b border-slate-200 text-[10px] uppercase">
                <span className="col-span-5">Qty Range</span>
                <span className="col-span-4 text-right">Unit Price</span>
                <span className="col-span-3 text-right">Savings</span>
              </div>
              <div className="divide-y divide-slate-100 font-mono">
                {product.pricingTiers.map((tier, idx) => {
                  const isCurrentTier = activeTier.minQty === tier.minQty;
                  return (
                    <div
                      key={idx}
                      className={`grid grid-cols-12 py-1.5 px-2 items-center transition-colors ${
                        isCurrentTier
                          ? 'bg-blue-50/90 text-blue-950 font-bold border-l-3 border-blue-600'
                          : 'bg-white text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <span className="col-span-5 font-sans truncate text-[11px]">
                        {tier.label.split('(')[0].trim()}
                      </span>
                      <span className="col-span-4 text-right text-[11px] font-bold text-slate-900">
                        ${tier.unitPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </span>
                      <span className="col-span-3 text-right text-[11px]">
                        {tier.discountPct > 0 ? (
                          <span className="inline-block px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                            -{tier.discountPct}%
                          </span>
                        ) : (
                          <span className="text-slate-400 text-[10px]">List</span>
                        )}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Pricing Summary & Action Area */}
        <div className="mt-4 pt-3.5 border-t border-slate-200">
          <div className="flex items-baseline justify-between mb-2">
            <div>
              <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold block">
                Line Total ({quantity} {quantity === 1 ? 'pack' : 'packs'})
              </span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-xl font-extrabold text-slate-900 font-mono">
                  ${lineTotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </span>
                {savings > 0 && (
                  <span className="text-xs text-slate-400 line-through font-mono">
                    ${originalTotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </span>
                )}
              </div>
            </div>

            {savings > 0 && (
              <div className="text-right">
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                  You save ${savings.toLocaleString('en-US', { minimumFractionDigits: 0 })}
                </span>
              </div>
            )}
          </div>

          {/* Quantity Stepper & Add to Cart Controls */}
          <div className="grid grid-cols-12 gap-2">
            {/* Stepper */}
            <div className="col-span-5 flex items-center border border-slate-300 rounded-lg overflow-hidden bg-slate-50">
              <button
                type="button"
                onClick={() => handleQuantityChange(quantity - 1)}
                disabled={quantity <= product.moq}
                className="w-8 h-9 flex items-center justify-center text-slate-600 hover:bg-slate-200 disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer transition"
                aria-label="Decrease quantity"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <input
                type="number"
                min={product.moq}
                value={quantity}
                onChange={(e) => handleQuantityChange(parseInt(e.target.value) || product.moq)}
                className="w-full text-center text-xs font-bold font-mono text-slate-900 bg-transparent focus:outline-none"
                aria-label="Quantity"
              />
              <button
                type="button"
                onClick={() => handleQuantityChange(quantity + 1)}
                className="w-8 h-9 flex items-center justify-center text-slate-600 hover:bg-slate-200 cursor-pointer transition"
                aria-label="Increase quantity"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Add to Wholesale Order Button */}
            <button
              type="button"
              onClick={handleAdd}
              className={`col-span-7 h-9 rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs ${
                justAdded
                  ? 'bg-emerald-600 text-white'
                  : 'bg-blue-700 hover:bg-blue-800 text-white'
              }`}
            >
              {justAdded ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Added to Order</span>
                </>
              ) : (
                <>
                  <ShoppingCart className="w-3.5 h-3.5" />
                  <span>Add to Order</span>
                </>
              )}
            </button>
          </div>

          {/* Secondary Action Links */}
          <div className="mt-2.5 flex items-center justify-between text-[11px] text-slate-500 pt-1">
            <button
              type="button"
              onClick={() => onOpenSpecs(product)}
              className="hover:text-blue-700 font-medium flex items-center gap-1 transition cursor-pointer"
            >
              <Info className="w-3 h-3 text-slate-400" />
              <span>Pallet Specs & PDF</span>
            </button>

            <button
              type="button"
              onClick={() => onOpenSample(product)}
              className="text-slate-600 hover:text-emerald-700 font-medium flex items-center gap-1 transition cursor-pointer"
            >
              <Package className="w-3 h-3 text-amber-500" />
              <span>Request Sample</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
