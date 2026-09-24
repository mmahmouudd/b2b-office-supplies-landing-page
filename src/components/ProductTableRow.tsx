import React, { useState } from 'react';
import { Product, PricingTier } from '../types';
import { ShoppingCart, Check, Plus, Minus, Info, Leaf, Package } from 'lucide-react';

interface ProductTableRowProps {
  product: Product;
  onAddToCart: (product: Product, quantity: number, tier: PricingTier) => void;
  onOpenSpecs: (product: Product) => void;
  onOpenSample: (product: Product) => void;
}

export const ProductTableRow: React.FC<ProductTableRowProps> = ({
  product,
  onAddToCart,
  onOpenSpecs,
  onOpenSample,
}) => {
  const [quantity, setQuantity] = useState<number>(product.moq);
  const [justAdded, setJustAdded] = useState(false);

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

  const handleQuantityChange = (val: number) => {
    if (isNaN(val)) return;
    if (val < product.moq) val = product.moq;
    setQuantity(val);
  };

  const handleAdd = () => {
    onAddToCart(product, quantity, activeTier);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1500);
  };

  return (
    <tr className="border-b border-slate-200 hover:bg-blue-50/30 transition-colors">
      {/* Product Image & SKU */}
      <td className="py-3 px-3">
        <div className="flex items-center gap-3">
          <img
            src={product.image}
            alt={product.name}
            className="w-14 h-14 object-cover rounded-lg border border-slate-200 shrink-0"
            loading="lazy"
          />
          <div className="min-w-0">
            <span className="font-mono text-[11px] text-blue-700 font-bold block">
              {product.sku}
            </span>
            <span className="text-xs font-bold text-slate-900 hover:text-blue-700 transition line-clamp-1 cursor-pointer" onClick={() => onOpenSpecs(product)}>
              {product.name}
            </span>
            <div className="flex items-center gap-2 text-[10px] text-slate-500 mt-0.5">
              <span>{product.packaging.packType}</span>
              <span>•</span>
              <span>{product.packaging.weightLbs} lbs</span>
              {product.ecoFriendly && (
                <>
                  <span>•</span>
                  <span className="text-emerald-600 flex items-center gap-0.5">
                    <Leaf className="w-2.5 h-2.5" /> Eco
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
      </td>

      {/* Category & Certifications */}
      <td className="py-3 px-3 text-xs text-slate-600 hidden md:table-cell">
        <span className="font-medium text-slate-800 block">{product.category}</span>
        <span className="text-[10px] text-slate-500">{product.certifications[0]}</span>
      </td>

      {/* Stock & Warehouse */}
      <td className="py-3 px-3 text-xs hidden lg:table-cell">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <span className="font-semibold text-slate-800">{product.stockUnits} units</span>
        </div>
        <span className="text-[10px] text-slate-500">{product.warehouseLocation}</span>
      </td>

      {/* Tiered Price Summary */}
      <td className="py-3 px-3">
        <div className="space-y-1">
          <div className="flex items-baseline gap-1.5">
            <span className="font-mono font-bold text-slate-900 text-sm">
              ${unitPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </span>
            <span className="text-[10px] text-slate-500">/ {product.unitOfMeasure.split(' ')[0]}</span>
          </div>

          <div className="flex flex-wrap gap-1">
            {product.pricingTiers.map((tier, idx) => (
              <span
                key={idx}
                className={`text-[9px] px-1.5 py-0.5 rounded font-mono ${
                  activeTier.minQty === tier.minQty
                    ? 'bg-blue-600 text-white font-bold'
                    : 'bg-slate-100 text-slate-600'
                }`}
                title={`Order ${tier.label}: $${tier.unitPrice}`}
              >
                {tier.discountPct > 0 ? `-${tier.discountPct}%` : 'Base'}
              </span>
            ))}
          </div>
        </div>
      </td>

      {/* Quantity Stepper (MOQ enforced) */}
      <td className="py-3 px-3">
        <div className="flex flex-col items-center">
          <div className="flex items-center border border-slate-300 rounded-lg overflow-hidden bg-slate-50 w-28">
            <button
              type="button"
              onClick={() => handleQuantityChange(quantity - 1)}
              disabled={quantity <= product.moq}
              className="w-7 h-8 flex items-center justify-center text-slate-600 hover:bg-slate-200 disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer"
            >
              <Minus className="w-3 h-3" />
            </button>
            <input
              type="number"
              min={product.moq}
              value={quantity}
              onChange={(e) => handleQuantityChange(parseInt(e.target.value) || product.moq)}
              className="w-full text-center text-xs font-bold font-mono text-slate-900 bg-transparent focus:outline-none"
            />
            <button
              type="button"
              onClick={() => handleQuantityChange(quantity + 1)}
              className="w-7 h-8 flex items-center justify-center text-slate-600 hover:bg-slate-200 cursor-pointer"
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>
          <span className="text-[9px] text-slate-400 mt-0.5">MOQ: {product.moq}</span>
        </div>
      </td>

      {/* Line Total & Add Button */}
      <td className="py-3 px-3 text-right">
        <div className="font-mono font-bold text-slate-900 text-sm">
          ${lineTotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}
        </div>

        <div className="flex items-center justify-end gap-1.5 mt-1.5">
          <button
            onClick={() => onOpenSpecs(product)}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded hover:bg-slate-100 transition cursor-pointer"
            title="View Specifications"
          >
            <Info className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onOpenSample(product)}
            className="p-1.5 text-slate-400 hover:text-amber-600 rounded hover:bg-slate-100 transition cursor-pointer"
            title="Request Physical Sample"
          >
            <Package className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleAdd}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition cursor-pointer ${
              justAdded
                ? 'bg-emerald-600 text-white'
                : 'bg-blue-700 hover:bg-blue-800 text-white'
            }`}
          >
            {justAdded ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Added</span>
              </>
            ) : (
              <>
                <ShoppingCart className="w-3.5 h-3.5" />
                <span>Add</span>
              </>
            )}
          </button>
        </div>
      </td>
    </tr>
  );
};
