import React, { useState } from 'react';
import { 
  Building2, 
  Search, 
  ShoppingCart, 
  FileSpreadsheet, 
  ShieldCheck, 
  PhoneCall, 
  FileText, 
  Truck, 
  ChevronDown,
  Sparkles,
  CheckCircle2,
  Package
} from 'lucide-react';
import { CartItem } from '../types';

interface HeaderProps {
  cartItems: CartItem[];
  onOpenCart: () => void;
  onOpenQuickOrder: () => void;
  onOpenRfq: () => void;
  onOpenSampleModal: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  cartItems,
  onOpenCart,
  onOpenQuickOrder,
  onOpenRfq,
  onOpenSampleModal,
  searchQuery,
  onSearchChange,
  selectedCategory,
  onSelectCategory,
}) => {
  const [tierDropdownOpen, setTierDropdownOpen] = useState(false);
  const [activeTier, setActiveTier] = useState<'Gold' | 'Fleet' | 'Strategic'>('Gold');

  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const totalCartValue = cartItems.reduce((acc, item) => acc + item.totalPrice, 0);

  const categories = [
    'All Bulk Supplies',
    'Paper & Print',
    'Furniture',
    'Packaging & Shipping',
    'Desk Supplies',
    'Breakroom & Janitorial',
  ];

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
      {/* Top Enterprise Utility Bar */}
      <div className="bg-slate-900 text-slate-300 text-xs py-2 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-4 flex-wrap">
            <span className="flex items-center gap-1.5 font-medium text-emerald-400">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Q2 Enterprise Contract Rates Active: Save up to 48% on Full Pallets</span>
            </span>
            <span className="hidden md:inline-block text-slate-500">•</span>
            <span className="hidden md:flex items-center gap-1 text-slate-300">
              <Truck className="w-3.5 h-3.5 text-blue-400" />
              Free LTL Freight on orders $1,500+ / Full Pallet Orders
            </span>
          </div>

          <div className="flex items-center gap-4 sm:gap-6 ml-auto">
            <button 
              onClick={onOpenSampleModal}
              className="text-slate-300 hover:text-white transition-colors underline-offset-2 hover:underline cursor-pointer flex items-center gap-1"
            >
              <Package className="w-3.5 h-3.5 text-amber-400" />
              <span>Order Free Sample Box</span>
            </button>
            <div className="hidden lg:flex items-center gap-1 text-slate-300">
              <PhoneCall className="w-3.5 h-3.5 text-emerald-400" />
              <span>Commercial Desk: <strong>1-800-555-APEX</strong></span>
            </div>
            <div className="flex items-center gap-1 text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>GSA Contract #GS-02F-4919X</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5">
        <div className="flex items-center justify-between gap-3 lg:gap-6">
          {/* Logo */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-700 to-indigo-900 flex items-center justify-center text-white shadow-md shadow-blue-900/20">
              <Building2 className="w-5 h-5 text-blue-200" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-extrabold tracking-tight text-slate-900">
                  Apex<span className="text-blue-700">Office</span>
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 uppercase tracking-wider">
                  Wholesale B2B
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium hidden sm:block">
                Commercial Office & Logistics Supplies
              </p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-xl mx-2 hidden md:block">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Search className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search bulk products, paper pallets, BIFMA chairs, SKUs (e.g. APX-PPR-8511)..."
                className="w-full pl-10 pr-24 py-2 bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all shadow-inner"
              />
              <button 
                onClick={onOpenQuickOrder}
                className="absolute right-1.5 top-1.5 bottom-1.5 px-2.5 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-semibold rounded flex items-center gap-1 transition-colors cursor-pointer"
                title="Enter multiple SKUs or upload CSV"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-blue-600" />
                <span>SKU Order</span>
              </button>
            </div>
          </div>

          {/* Right Actions: Account Tier, RFQ, Cart */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Account Tier Selector Pill */}
            <div className="relative hidden xl:block">
              <button
                onClick={() => setTierDropdownOpen(!tierDropdownOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs text-slate-700 font-medium transition cursor-pointer"
              >
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <div className="text-left">
                  <div className="text-[10px] text-slate-400 uppercase font-semibold leading-none">Contract Tier</div>
                  <div className="text-slate-900 font-bold leading-tight">Tier 2: {activeTier} Fleet</div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-1" />
              </button>

              {tierDropdownOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 text-xs">
                  <div className="px-3 py-2 border-b border-slate-100">
                    <p className="font-semibold text-slate-900">Active B2B Contract Rate</p>
                    <p className="text-slate-500 text-[11px]">Net 30 terms pre-approved • 24-38% off list</p>
                  </div>
                  <button
                    onClick={() => { setActiveTier('Fleet'); setTierDropdownOpen(false); }}
                    className={`w-full px-3 py-2.5 text-left flex items-start gap-2 hover:bg-slate-50 transition cursor-pointer ${activeTier === 'Fleet' ? 'bg-blue-50/70' : ''}`}
                  >
                    <CheckCircle2 className={`w-4 h-4 mt-0.5 ${activeTier === 'Fleet' ? 'text-blue-600' : 'text-slate-300'}`} />
                    <div>
                      <p className="font-bold text-slate-800">Commercial Fleet (Tier 1)</p>
                      <p className="text-slate-500 text-[11px]">Up to 25% bulk savings, Free LTL over $1.5k</p>
                    </div>
                  </button>
                  <button
                    onClick={() => { setActiveTier('Gold'); setTierDropdownOpen(false); }}
                    className={`w-full px-3 py-2.5 text-left flex items-start gap-2 hover:bg-slate-50 transition cursor-pointer ${activeTier === 'Gold' ? 'bg-blue-50/70' : ''}`}
                  >
                    <CheckCircle2 className={`w-4 h-4 mt-0.5 ${activeTier === 'Gold' ? 'text-blue-600' : 'text-slate-300'}`} />
                    <div>
                      <p className="font-bold text-slate-800">Corporate Gold (Tier 2 - Active)</p>
                      <p className="text-slate-500 text-[11px]">Up to 38% pallet discount, Net 45, Free Pallet Freight</p>
                    </div>
                  </button>
                  <button
                    onClick={() => { setActiveTier('Strategic'); setTierDropdownOpen(false); }}
                    className={`w-full px-3 py-2.5 text-left flex items-start gap-2 hover:bg-slate-50 transition cursor-pointer ${activeTier === 'Strategic' ? 'bg-blue-50/70' : ''}`}
                  >
                    <CheckCircle2 className={`w-4 h-4 mt-0.5 ${activeTier === 'Strategic' ? 'text-blue-600' : 'text-slate-300'}`} />
                    <div>
                      <p className="font-bold text-slate-800">Enterprise Strategic (Tier 3)</p>
                      <p className="text-slate-500 text-[11px]">Custom contract pricing, Net 60, ERP/PunchOut</p>
                    </div>
                  </button>
                </div>
              )}
            </div>

            {/* Request Quote Button */}
            <button
              onClick={onOpenRfq}
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition border border-slate-300 cursor-pointer"
            >
              <FileText className="w-4 h-4 text-blue-600" />
              <span>Request RFQ / Quote</span>
            </button>

            {/* Mobile SKU Order Button */}
            <button
              onClick={onOpenQuickOrder}
              className="md:hidden p-2 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition"
              title="SKU Fast Order"
            >
              <FileSpreadsheet className="w-4 h-4 text-blue-600" />
            </button>

            {/* Wholesale Cart Button */}
            <button
              onClick={onOpenCart}
              className="flex items-center gap-2.5 px-3 sm:px-4 py-2 rounded-lg bg-blue-700 hover:bg-blue-800 text-white font-semibold text-xs sm:text-sm shadow-sm transition cursor-pointer group"
            >
              <div className="relative">
                <ShoppingCart className="w-4 h-4 text-blue-100" />
                {totalCartCount > 0 && (
                  <span className="absolute -top-2.5 -right-2.5 bg-amber-400 text-slate-950 text-[10px] font-black rounded-full h-4 min-w-4 px-1 flex items-center justify-center shadow-xs">
                    {totalCartCount}
                  </span>
                )}
              </div>
              <div className="hidden sm:block text-left">
                <span className="block text-[10px] text-blue-200 uppercase font-semibold leading-none">
                  Pallet Order
                </span>
                <span className="font-bold text-white text-xs leading-tight">
                  ${totalCartValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
            </button>
          </div>
        </div>

        {/* Mobile search bar */}
        <div className="mt-3 md:hidden">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search products, paper, chairs, SKUs..."
              className="w-full pl-9 pr-3 py-2 bg-slate-100 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>
        </div>
      </div>

      {/* Category Quick Nav Bar */}
      <div className="border-t border-slate-100 bg-slate-50/80 overflow-x-auto scrollbar-none px-4 sm:px-6 py-2">
        <div className="max-w-7xl mx-auto flex items-center gap-2 text-xs font-medium text-slate-600 whitespace-nowrap">
          <span className="text-slate-400 font-semibold mr-1 uppercase text-[10px] tracking-wider">
            Wholesale Categories:
          </span>
          {categories.map((cat) => {
            const isSelected = (selectedCategory === '' && cat === 'All Bulk Supplies') || selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => onSelectCategory(cat === 'All Bulk Supplies' ? '' : cat)}
                className={`px-3 py-1 rounded-full transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-blue-700 text-white font-semibold shadow-xs'
                    : 'bg-white text-slate-700 hover:bg-slate-200/80 border border-slate-200'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
