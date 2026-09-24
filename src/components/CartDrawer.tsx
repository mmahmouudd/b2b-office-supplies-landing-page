import React from 'react';
import { CartItem } from '../types';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  Truck, 
  ShieldCheck, 
  ArrowRight, 
  FileText, 
  Package, 
  Building2,
  Sparkles
} from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onOpenCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onOpenCheckout,
}) => {
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const totalUnits = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = cartItems.reduce((acc, item) => acc + item.totalPrice, 0);

  // Calculate gross freight weight
  const totalWeightLbs = cartItems.reduce(
    (acc, item) => acc + (item.product.packaging.weightLbs * item.quantity),
    0
  );

  // Pallet capacity calculation (GMA pallet avg ~2,100 lbs max load)
  const palletEquivalents = (totalWeightLbs / 2100).toFixed(1);
  const isFreeFreight = subtotal >= 1500 || totalWeightLbs >= 2000;
  const freightCost = isFreeFreight ? 0 : 185;

  // Calculate savings compared to base single-unit prices
  const listPriceTotal = cartItems.reduce(
    (acc, item) => acc + (item.product.basePrice * item.quantity),
    0
  );
  const totalDiscountSavings = listPriceTotal - subtotal;

  const handleDownloadProforma = () => {
    const text = `PRO-FORMA INVOICE ESTIMATE\n` +
      `APEXOFFICE COMMERCIAL WHOLESALE LLC\n` +
      `Date: ${new Date().toLocaleDateString()}\n` +
      `Status: Pending Purchase Order Authorization\n\n` +
      `ITEMS INCLUDED:\n` +
      cartItems.map(item => ` - [${item.product.sku}] ${item.product.name} x ${item.quantity} (${item.product.unitOfMeasure})\n` +
        `   Unit: $${item.unitPrice.toFixed(2)} | Subtotal: $${item.totalPrice.toFixed(2)}`).join('\n') +
      `\n\nGross Pallet Weight: ${totalWeightLbs.toLocaleString()} lbs (~${palletEquivalents} GMA Pallets)\n` +
      `Merchandise Subtotal: $${subtotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}\n` +
      `Bulk Volume Contract Savings: -$${totalDiscountSavings.toLocaleString('en-US', { minimumFractionDigits: 2 })}\n` +
      `Freight Delivery: ${isFreeFreight ? 'FREE CONTRACT LTL FREIGHT' : `$${freightCost.toFixed(2)}`}\n` +
      `Estimated Commercial Total: $${(subtotal + freightCost).toLocaleString('en-US', { minimumFractionDigits: 2 })}\n\n` +
      `Terms: Net 30/60 Subject to Corporate Credit Review.`;

    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ApexOffice_ProForma_Estimate_${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-950/70 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          
          {/* Header */}
          <div className="px-5 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-700 text-white flex items-center justify-center font-bold">
                <Building2 className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 leading-tight">
                  Wholesale Procurement Cart
                </h3>
                <p className="text-xs text-slate-500">
                  {totalUnits} {totalUnits === 1 ? 'pack/pallet' : 'packs/pallets'} • Tier 2 Contract Active
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Pallet & Freight Gauge Banner */}
          <div className="bg-slate-900 text-white p-4 text-xs">
            <div className="flex items-center justify-between mb-1.5 font-semibold">
              <span className="flex items-center gap-1.5 text-blue-300">
                <Truck className="w-4 h-4 text-sky-400" />
                <span>Freight Logistics Load</span>
              </span>
              <span className="font-mono text-emerald-400">
                {totalWeightLbs.toLocaleString()} lbs ({palletEquivalents} Pallets)
              </span>
            </div>

            {/* Progress bar */}
            <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden mb-2">
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  isFreeFreight ? 'bg-emerald-500' : 'bg-blue-500'
                }`}
                style={{ width: `${Math.min(100, (subtotal / 1500) * 100)}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-300">
              {isFreeFreight ? (
                <span className="text-emerald-300 font-bold flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  Unlocked Free Standard LTL Dock Freight
                </span>
              ) : (
                <span>
                  Add ${(1500 - subtotal).toFixed(2)} more to unlock <strong>Free LTL Pallet Delivery</strong>
                </span>
              )}
              <span className="font-mono">{isFreeFreight ? 'FREE' : '$185 Base'}</span>
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {cartItems.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
                <Package className="w-12 h-12 text-slate-300 mb-3" />
                <p className="text-sm font-bold text-slate-700">Your commercial order is empty</p>
                <p className="text-xs text-slate-500 mt-1 max-w-xs">
                  Explore bulk copy paper pallets, executive mesh chairs, or shipping supplies to start an order.
                </p>
                <button
                  onClick={onClose}
                  className="mt-4 px-4 py-2 bg-blue-700 text-white text-xs font-bold rounded-lg hover:bg-blue-800 transition cursor-pointer"
                >
                  Explore Catalog
                </button>
              </div>
            ) : (
              cartItems.map((item) => (
                <div
                  key={item.product.id}
                  className="p-3 bg-slate-50 border border-slate-200 rounded-xl relative hover:border-slate-300 transition"
                >
                  <div className="flex items-start gap-3">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-14 h-14 object-cover rounded-lg border border-slate-200 shrink-0"
                    />
                    <div className="flex-1 min-w-0 pr-6">
                      <span className="text-[10px] font-mono text-blue-700 font-bold block">
                        {item.product.sku}
                      </span>
                      <h4 className="text-xs font-bold text-slate-900 truncate">
                        {item.product.name}
                      </h4>
                      <p className="text-[10px] text-slate-500 mt-0.5">
                        {item.product.unitOfMeasure} • {item.product.packaging.weightLbs * item.quantity} lbs
                      </p>

                      {/* Tier applied badge */}
                      <div className="mt-1">
                        <span className="inline-block text-[10px] font-semibold bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded">
                          {item.selectedTier.discountPct > 0
                            ? `${item.selectedTier.label}: -${item.selectedTier.discountPct}% off`
                            : 'Standard Wholesale Rate'}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => onRemoveItem(item.product.id)}
                      className="absolute top-2.5 right-2.5 text-slate-400 hover:text-rose-600 p-1 cursor-pointer"
                      title="Remove Item"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Quantity and Price Row */}
                  <div className="mt-3 pt-2.5 border-t border-slate-200 flex items-center justify-between">
                    <div className="flex items-center border border-slate-300 rounded-lg overflow-hidden bg-white">
                      <button
                        type="button"
                        onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                        disabled={item.quantity <= item.product.moq}
                        className="w-7 h-7 flex items-center justify-center text-slate-600 hover:bg-slate-100 disabled:opacity-30 cursor-pointer"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-8 text-center text-xs font-bold font-mono text-slate-900">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                        className="w-7 h-7 flex items-center justify-center text-slate-600 hover:bg-slate-100 cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <div className="text-right">
                      <div className="text-xs font-mono font-bold text-slate-900">
                        ${item.totalPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        ${item.unitPrice.toFixed(2)} / unit
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Totals & Checkout CTA */}
          {cartItems.length > 0 && (
            <div className="p-4 border-t border-slate-200 bg-slate-50 space-y-3">
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>List Price Subtotal:</span>
                  <span className="font-mono">${listPriceTotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                </div>
                {totalDiscountSavings > 0 && (
                  <div className="flex justify-between text-emerald-700 font-semibold">
                    <span>Volume Contract Savings:</span>
                    <span className="font-mono">-${totalDiscountSavings.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                  </div>
                )}
                <div className="flex justify-between text-slate-600">
                  <span>Commercial Freight (LTL):</span>
                  <span className={`font-mono font-bold ${isFreeFreight ? 'text-emerald-700' : 'text-slate-800'}`}>
                    {isFreeFreight ? 'FREE' : `$${freightCost.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between text-slate-500 text-[11px]">
                  <span>Sales Tax:</span>
                  <span>$0.00 (Exempt with Resale ID)</span>
                </div>

                <div className="pt-2 border-t border-slate-200 flex justify-between items-baseline">
                  <span className="text-sm font-bold text-slate-900">Estimated Total:</span>
                  <span className="text-xl font-black font-mono text-slate-900">
                    ${(subtotal + freightCost).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-1">
                <button
                  onClick={() => {
                    onClose();
                    onOpenCheckout();
                  }}
                  className="w-full py-3 px-4 bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer group"
                >
                  <span>Proceed to B2B Checkout (Net Terms / PO)</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </button>

                <button
                  onClick={handleDownloadProforma}
                  className="w-full py-2 px-3 bg-white hover:bg-slate-100 text-slate-700 font-semibold text-xs rounded-xl border border-slate-200 transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5 text-blue-600" />
                  <span>Download Pro-Forma Invoice (PDF)</span>
                </button>
              </div>

              <div className="flex items-center justify-center gap-2 text-[10px] text-slate-400 pt-1">
                <ShieldCheck className="w-3 h-3 text-emerald-600" />
                <span>Pre-Approved Net 30/60 Invoicing • Verified Corporate POs</span>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
