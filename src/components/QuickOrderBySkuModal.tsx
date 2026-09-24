import React, { useState } from 'react';
import { Product, PricingTier } from '../types';
import { X, Plus, Trash2, ShoppingCart, Sparkles, AlertCircle, Check } from 'lucide-react';

interface QuickOrderRow {
  sku: string;
  qty: number;
}

interface QuickOrderBySkuModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onBatchAddToCart: (items: { product: Product; quantity: number; tier: PricingTier }[]) => void;
}

export const QuickOrderBySkuModal: React.FC<QuickOrderBySkuModalProps> = ({
  isOpen,
  onClose,
  products,
  onBatchAddToCart,
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

  const [rows, setRows] = useState<QuickOrderRow[]>([
    { sku: 'APX-PPR-8511-PLT', qty: 2 },
    { sku: 'APX-CHR-MESH-PRO', qty: 2 },
    { sku: 'APX-BOX-200B-1612', qty: 3 },
    { sku: '', qty: 1 },
  ]);

  const [submitted, setSubmitted] = useState(false);

  const handleRowChange = (index: number, field: 'sku' | 'qty', value: any) => {
    const updated = [...rows];
    updated[index] = { ...updated[index], [field]: value };
    setRows(updated);
  };

  const addRow = () => {
    setRows([...rows, { sku: '', qty: 1 }]);
  };

  const removeRow = (index: number) => {
    setRows(rows.filter((_, i) => i !== index));
  };

  const loadSampleOrder = () => {
    setRows([
      { sku: 'APX-PPR-8511-PLT', qty: 4 }, // Pallet of copy paper
      { sku: 'APX-CHR-MESH-PRO', qty: 5 }, // Task chairs
      { sku: 'APX-BOX-200B-1612', qty: 10 }, // Archive boxes
      { sku: 'APX-PEN-GEL-BLK-500', qty: 4 }, // Gel pens
      { sku: 'APX-TON-58A-BULK', qty: 4 }, // Toner cartridges
    ]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const itemsToAdd: { product: Product; quantity: number; tier: PricingTier }[] = [];

    rows.forEach((row) => {
      if (!row.sku) return;
      const cleanSku = row.sku.trim().toUpperCase();
      const matched = products.find((p) => p.sku.toUpperCase() === cleanSku);
      if (matched) {
        const qty = Math.max(row.qty, matched.moq);
        const activeTier = matched.pricingTiers.reduce((acc, tier) => {
          if (qty >= tier.minQty) {
            if (!tier.maxQty || qty <= tier.maxQty) return tier;
            return tier;
          }
          return acc;
        }, matched.pricingTiers[0]);

        itemsToAdd.push({
          product: matched,
          quantity: qty,
          tier: activeTier,
        });
      }
    });

    if (itemsToAdd.length > 0) {
      onBatchAddToCart(itemsToAdd);
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        onClose();
      }, 1200);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs">
      <div 
        className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div>
            <h3 className="font-bold text-slate-900 text-base">
              Quick Order by SKU / Bulk Re-Order
            </h3>
            <p className="text-xs text-slate-500">
              Enter part numbers and required lot quantities for rapid procurement
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action helper bar */}
        <div className="px-5 py-2.5 bg-blue-50/70 border-b border-blue-100 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 text-blue-900 font-medium">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>Need a recurring monthly replenishment list?</span>
          </div>
          <button
            type="button"
            onClick={loadSampleOrder}
            className="text-blue-700 font-bold hover:underline cursor-pointer flex items-center gap-1"
          >
            Load Sample Restock Template
          </button>
        </div>

        {/* Rows Form */}
        <form onSubmit={handleSubmit} className="p-5">
          <div className="space-y-2.5 max-h-[50vh] overflow-y-auto pr-1">
            <div className="grid grid-cols-12 gap-2 text-[11px] font-bold uppercase text-slate-400 px-1">
              <span className="col-span-6">Catalog Part / SKU</span>
              <span className="col-span-3 text-center">Quantity (Units)</span>
              <span className="col-span-2">Match Status</span>
              <span className="col-span-1 text-center">Del</span>
            </div>

            {rows.map((row, idx) => {
              const matchedProduct = products.find(
                (p) => p.sku.toUpperCase() === row.sku.trim().toUpperCase()
              );

              return (
                <div key={idx} className="grid grid-cols-12 gap-2 items-center">
                  {/* SKU Input with Autocomplete suggestion */}
                  <div className="col-span-6 relative">
                    <input
                      type="text"
                      value={row.sku}
                      onChange={(e) => handleRowChange(idx, 'sku', e.target.value)}
                      placeholder="e.g. APX-PPR-8511-PLT"
                      list={`sku-list-${idx}`}
                      className="w-full text-xs font-mono font-medium p-2 bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-600 uppercase"
                    />
                    <datalist id={`sku-list-${idx}`}>
                      {products.map((p) => (
                        <option key={p.id} value={p.sku}>
                          {p.name}
                        </option>
                      ))}
                    </datalist>
                  </div>

                  {/* Quantity */}
                  <div className="col-span-3">
                    <input
                      type="number"
                      min={1}
                      value={row.qty}
                      onChange={(e) => handleRowChange(idx, 'qty', parseInt(e.target.value) || 1)}
                      className="w-full text-xs font-mono font-bold text-center p-2 bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-600"
                    />
                  </div>

                  {/* Status */}
                  <div className="col-span-2 text-xs truncate">
                    {row.sku ? (
                      matchedProduct ? (
                        <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 block truncate">
                          Valid SKU
                        </span>
                      ) : (
                        <span className="text-[10px] text-amber-700 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3 shrink-0" />
                          Checking
                        </span>
                      )
                    ) : (
                      <span className="text-slate-400 text-[10px]">-</span>
                    )}
                  </div>

                  {/* Delete */}
                  <div className="col-span-1 text-center">
                    <button
                      type="button"
                      onClick={() => removeRow(idx)}
                      disabled={rows.length === 1}
                      className="p-1.5 text-slate-400 hover:text-rose-600 disabled:opacity-20 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <button
            type="button"
            onClick={addRow}
            className="mt-3 text-xs font-semibold text-blue-700 hover:text-blue-900 flex items-center gap-1 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Another Part Row</span>
          </button>

          {/* Footer Submit */}
          <div className="mt-6 pt-4 border-t border-slate-200 flex items-center justify-between">
            <span className="text-xs text-slate-500">
              Bulk pallet discounts apply automatically upon adding to cart.
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className={`px-5 py-2 rounded-lg text-xs font-bold text-white transition flex items-center gap-1.5 cursor-pointer shadow-xs ${
                  submitted ? 'bg-emerald-600' : 'bg-blue-700 hover:bg-blue-800'
                }`}
              >
                {submitted ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Added to Wholesale Order!</span>
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-4 h-4" />
                    <span>Add All Items to Cart</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
