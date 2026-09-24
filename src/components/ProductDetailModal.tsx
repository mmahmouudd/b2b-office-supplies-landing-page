import React, { useState } from 'react';
import { Product, PricingTier } from '../types';
import { 
  X, 
  Package, 
  Truck, 
  FileDown, 
  CheckCircle2, 
  Leaf, 
  ShieldCheck, 
  MapPin, 
  Plus, 
  Minus, 
  ShoppingCart,
  Box
} from 'lucide-react';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number, tier: PricingTier) => void;
  onOpenSample: (product: Product) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onAddToCart,
  onOpenSample,
}) => {
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!product) return null;

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
  const originalTotal = product.basePrice * quantity;
  const savings = originalTotal - lineTotal;

  const handleAdd = () => {
    onAddToCart(product, quantity, activeTier);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1600);
  };

  const handleDownloadTds = () => {
    const text = `APEXOFFICE COMMERCIAL SPECIFICATION SHEET & TDS\n` +
      `Product: ${product.name}\n` +
      `SKU: ${product.sku}\n` +
      `Category: ${product.category}\n` +
      `Unit of Measure: ${product.unitOfMeasure}\n` +
      `MOQ: ${product.moq} Units\n` +
      `Pallet Dimensions: ${product.packaging.dimensions}\n` +
      `Gross Skid Weight: ${product.packaging.weightLbs} lbs\n` +
      `Warehouse Hub: ${product.warehouseLocation}\n` +
      `Certifications: ${product.certifications.join(', ')}\n` +
      `Compliance: GSA Schedule Compliant / ISO 9001 / BIFMA Testing Validated\n\n` +
      `Pricing Tiers:\n` +
      product.pricingTiers.map(t => ` - ${t.label}: $${t.unitPrice} (-${t.discountPct}%)`).join('\n') +
      `\n\nFor bulk fleet RFP or contract pricing, contact enterprise@apexoffice-wholesale.com`;

    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${product.sku}_TDS_SpecSheet.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
      <div 
        className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-blue-700 bg-blue-100/70 px-2 py-0.5 rounded">
              {product.sku}
            </span>
            <span className="text-xs text-slate-500 font-medium">
              Technical Data Sheet & Pallet Specs
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 max-h-[80vh] overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            
            {/* Left: Product Visual & Logistics Specs */}
            <div className="md:col-span-5 space-y-4">
              <div className="rounded-xl overflow-hidden border border-slate-200 bg-slate-100 h-64 sm:h-72">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Warehouse & Stock Box */}
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-medium">Inventory Availability:</span>
                  <span className="font-bold text-emerald-700 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    {product.stockUnits} {product.unitOfMeasure.split(' ')[0]}s In Stock
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-medium">Dispatch Hub:</span>
                  <span className="text-slate-800 font-semibold flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-blue-600" />
                    {product.warehouseLocation}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-medium">Standard Dispatch Lead Time:</span>
                  <span className="font-semibold text-slate-800">24 - 48 Hours LTL</span>
                </div>
              </div>

              {/* Badges / Certifications */}
              <div>
                <h5 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Compliance & Certifications
                </h5>
                <div className="flex flex-wrap gap-1.5">
                  {product.certifications.map((cert, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 rounded bg-slate-100 text-slate-800 text-[11px] font-medium border border-slate-200 flex items-center gap-1"
                    >
                      <ShieldCheck className="w-3 h-3 text-blue-600" />
                      {cert}
                    </span>
                  ))}
                  {product.ecoFriendly && (
                    <span className="px-2 py-1 rounded bg-emerald-50 text-emerald-800 text-[11px] font-bold border border-emerald-200 flex items-center gap-1">
                      <Leaf className="w-3 h-3 text-emerald-600" />
                      FSC Eco-Certified
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Right: Technical Specs, Pallet Footprint & Bulk Pricing */}
            <div className="md:col-span-7 space-y-5">
              <div>
                <span className="text-xs font-bold text-blue-700 uppercase tracking-wide">
                  {product.category}
                </span>
                <h2 className="text-xl font-extrabold text-slate-900 mt-0.5">
                  {product.name}
                </h2>
                <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Logistics & Pallet Footprint Spec Table */}
              <div className="bg-slate-50 rounded-xl border border-slate-200 p-4">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <Box className="w-4 h-4 text-blue-600" />
                  Freight & Pallet Specifications
                </h4>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                    <span className="text-slate-400 block text-[11px]">Packaging Type</span>
                    <strong className="text-slate-900">{product.packaging.packType}</strong>
                  </div>
                  <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                    <span className="text-slate-400 block text-[11px]">Gross Unit Weight</span>
                    <strong className="text-slate-900 font-mono">{product.packaging.weightLbs} lbs</strong>
                  </div>
                  <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                    <span className="text-slate-400 block text-[11px]">Pallet Dimensions (L x W x H)</span>
                    <strong className="text-slate-900 font-mono">{product.packaging.dimensions}</strong>
                  </div>
                  <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                    <span className="text-slate-400 block text-[11px]">Freight Class (NMFC)</span>
                    <strong className="text-slate-900">Class 55 / General Freight</strong>
                  </div>
                </div>

                <div className="mt-3 text-[11px] text-slate-500 flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Loading dock or liftgate required. Pallet exchange program available.</span>
                </div>
              </div>

              {/* Tiered Bulk Pricing Table */}
              <div>
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 flex items-center justify-between">
                  <span>Contract Volume Pricing Matrix</span>
                  <span className="text-emerald-700 font-semibold normal-case">
                    MOQ: {product.moq} {product.unitOfMeasure.split(' ')[0]}
                  </span>
                </h4>

                <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
                  <table className="w-full text-left">
                    <thead className="bg-slate-100 text-slate-700 font-semibold text-[11px] uppercase border-b border-slate-200">
                      <tr>
                        <th className="py-2 px-3">Order Quantity Bracket</th>
                        <th className="py-2 px-3 text-right">Unit Price</th>
                        <th className="py-2 px-3 text-right">Discount</th>
                        <th className="py-2 px-3 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-mono">
                      {product.pricingTiers.map((tier, idx) => {
                        const isMatch = activeTier.minQty === tier.minQty;
                        return (
                          <tr
                            key={idx}
                            className={`transition-colors ${
                              isMatch ? 'bg-blue-50 font-bold text-blue-900' : 'hover:bg-slate-50'
                            }`}
                          >
                            <td className="py-2 px-3 font-sans">
                              {tier.label}
                            </td>
                            <td className="py-2 px-3 text-right font-bold text-slate-900">
                              ${tier.unitPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                            </td>
                            <td className="py-2 px-3 text-right">
                              {tier.discountPct > 0 ? (
                                <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                                  -{tier.discountPct}%
                                </span>
                              ) : (
                                <span className="text-slate-400">Standard</span>
                              )}
                            </td>
                            <td className="py-2 px-3 text-right font-sans text-[11px]">
                              {isMatch ? (
                                <span className="text-blue-700 font-bold flex items-center justify-end gap-1">
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                  Active Bracket
                                </span>
                              ) : (
                                <span className="text-slate-400">Available</span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Order Calculator & Add To Cart Box */}
              <div className="bg-slate-900 text-white rounded-xl p-4">
                <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                      Calculated Order Cost
                    </span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-extrabold font-mono text-white">
                        ${lineTotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </span>
                      {savings > 0 && (
                        <span className="text-xs text-emerald-400 font-semibold font-mono">
                          Saved ${savings.toLocaleString('en-US', { minimumFractionDigits: 0 })}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Quantity Stepper */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-300">Quantity:</span>
                    <div className="flex items-center border border-slate-700 rounded-lg overflow-hidden bg-slate-800">
                      <button
                        type="button"
                        onClick={() => {
                          if (quantity > product.moq) setQuantity(quantity - 1);
                        }}
                        disabled={quantity <= product.moq}
                        className="w-8 h-9 flex items-center justify-center text-slate-300 hover:bg-slate-700 disabled:opacity-30 cursor-pointer"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <input
                        type="number"
                        min={product.moq}
                        value={quantity}
                        onChange={(e) => {
                          const val = parseInt(e.target.value) || product.moq;
                          setQuantity(val < product.moq ? product.moq : val);
                        }}
                        className="w-12 text-center text-xs font-bold font-mono text-white bg-transparent focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => setQuantity(quantity + 1)}
                        className="w-8 h-9 flex items-center justify-center text-slate-300 hover:bg-slate-700 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-slate-800">
                  <button
                    onClick={handleAdd}
                    className={`py-2.5 px-4 rounded-lg font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer ${
                      justAdded
                        ? 'bg-emerald-600 text-white'
                        : 'bg-blue-600 hover:bg-blue-500 text-white'
                    }`}
                  >
                    {justAdded ? (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Added to Wholesale Cart</span>
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="w-4 h-4" />
                        <span>Add to Commercial Order</span>
                      </>
                    )}
                  </button>

                  <div className="flex gap-2">
                    <button
                      onClick={handleDownloadTds}
                      className="flex-1 py-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer border border-slate-700"
                    >
                      <FileDown className="w-3.5 h-3.5 text-blue-400" />
                      <span>Download TDS</span>
                    </button>
                    <button
                      onClick={() => {
                        onClose();
                        onOpenSample(product);
                      }}
                      className="py-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-semibold flex items-center justify-center gap-1 transition cursor-pointer border border-slate-700"
                    >
                      <Package className="w-3.5 h-3.5" />
                      <span>Sample</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};
