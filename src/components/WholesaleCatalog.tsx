import React, { useState, useMemo } from 'react';
import { Product, PricingTier, FilterState } from '../types';
import { ProductCard } from './ProductCard';
import { ProductTableRow } from './ProductTableRow';
import { 
  Search, 
  LayoutGrid, 
  TableProperties, 
  RotateCcw, 
  Leaf, 
  SlidersHorizontal,
  Building
} from 'lucide-react';

interface WholesaleCatalogProps {
  products: Product[];
  onAddToCart: (product: Product, quantity: number, tier: PricingTier) => void;
  onOpenSpecs: (product: Product) => void;
  onOpenSample: (product: Product) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedCategory: string;
  onSelectCategory: (c: string) => void;
}

export const WholesaleCatalog: React.FC<WholesaleCatalogProps> = ({
  products,
  onAddToCart,
  onOpenSpecs,
  onOpenSample,
  searchQuery,
  onSearchChange,
  selectedCategory,
  onSelectCategory,
}) => {
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [showFilterDrawer, setShowFilterDrawer] = useState(false);

  // Filter state
  const [filters, setFilters] = useState<FilterState>({
    searchQuery: '',
    category: '',
    ecoOnly: false,
    inStockOnly: false,
    packagingType: 'all',
    maxMoq: 10,
    sortBy: 'popular',
  });

  const categories = [
    { id: '', label: 'All Wholesale' },
    { id: 'Paper & Print', label: 'Paper & Print' },
    { id: 'Furniture', label: 'Furniture' },
    { id: 'Packaging & Shipping', label: 'Packaging & Shipping' },
    { id: 'Desk Supplies', label: 'Desk Supplies' },
    { id: 'Breakroom & Janitorial', label: 'Breakroom & Janitorial' },
  ];

  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        // Search query
        const query = (searchQuery || filters.searchQuery).toLowerCase().trim();
        if (query) {
          const matchTitle = p.name.toLowerCase().includes(query);
          const matchSku = p.sku.toLowerCase().includes(query);
          const matchDesc = p.description.toLowerCase().includes(query);
          const matchCat = p.category.toLowerCase().includes(query);
          if (!matchTitle && !matchSku && !matchDesc && !matchCat) return false;
        }

        // Category
        const cat = selectedCategory || filters.category;
        if (cat && p.category !== cat) return false;

        // Eco only
        if (filters.ecoOnly && !p.ecoFriendly) return false;

        // In stock only
        if (filters.inStockOnly && (!p.inStock || p.stockUnits <= 0)) return false;

        // Packaging
        if (filters.packagingType !== 'all') {
          if (filters.packagingType === 'pallet' && !p.packaging.packType.toLowerCase().includes('pallet') && !p.packaging.packType.toLowerCase().includes('skid')) {
            return false;
          }
          if (filters.packagingType === 'carton' && !p.packaging.packType.toLowerCase().includes('carton') && !p.packaging.packType.toLowerCase().includes('bundle') && !p.packaging.packType.toLowerCase().includes('box')) {
            return false;
          }
        }

        // Max MOQ
        if (p.moq > filters.maxMoq) return false;

        return true;
      })
      .sort((a, b) => {
        if (filters.sortBy === 'popular') {
          return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
        }
        if (filters.sortBy === 'discount') {
          const maxDiscA = Math.max(...a.pricingTiers.map((t) => t.discountPct));
          const maxDiscB = Math.max(...b.pricingTiers.map((t) => t.discountPct));
          return maxDiscB - maxDiscA;
        }
        if (filters.sortBy === 'price-asc') {
          return a.basePrice - b.basePrice;
        }
        if (filters.sortBy === 'price-desc') {
          return b.basePrice - a.basePrice;
        }
        if (filters.sortBy === 'moq-asc') {
          return a.moq - b.moq;
        }
        return 0;
      });
  }, [products, searchQuery, selectedCategory, filters]);

  const resetAllFilters = () => {
    onSearchChange('');
    onSelectCategory('');
    setFilters({
      searchQuery: '',
      category: '',
      ecoOnly: false,
      inStockOnly: false,
      packagingType: 'all',
      maxMoq: 10,
      sortBy: 'popular',
    });
  };

  const hasActiveFilters =
    Boolean(searchQuery) ||
    Boolean(selectedCategory) ||
    filters.ecoOnly ||
    filters.inStockOnly ||
    filters.packagingType !== 'all' ||
    filters.maxMoq < 10 ||
    filters.sortBy !== 'popular';

  return (
    <section id="wholesale-catalog" className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-blue-700 text-xs font-bold uppercase tracking-wider mb-1">
            <Building className="w-4 h-4" />
            <span>Commercial Inventory & Pallet Dispatch</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Wholesale Bulk Office Supply Catalog
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Factory-direct pricing on full pallets, master cases, and bulk office equipment. Tiered contract discounts applied automatically.
          </p>
        </div>

        {/* View Switcher & Fast Filter Toggle */}
        <div className="flex items-center gap-2 self-start md:self-auto">
          <button
            onClick={() => setShowFilterDrawer(!showFilterDrawer)}
            className={`px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 border transition cursor-pointer ${
              hasActiveFilters
                ? 'bg-blue-50 text-blue-700 border-blue-300'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-blue-600" />
            <span>Filters</span>
            {hasActiveFilters && (
              <span className="w-2 h-2 rounded-full bg-blue-600" />
            )}
          </button>

          {/* Grid vs Table View Buttons */}
          <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded text-xs font-semibold flex items-center gap-1 transition cursor-pointer ${
                viewMode === 'grid'
                  ? 'bg-white text-blue-700 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Card Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
              <span className="hidden sm:inline">Grid</span>
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded text-xs font-semibold flex items-center gap-1 transition cursor-pointer ${
                viewMode === 'table'
                  ? 'bg-white text-blue-700 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Dense B2B Procurement Table View"
            >
              <TableProperties className="w-4 h-4" />
              <span className="hidden sm:inline">B2B Table</span>
            </button>
          </div>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto py-4 scrollbar-none">
        {categories.map((c) => {
          const isSelected = selectedCategory === c.id;
          return (
            <button
              key={c.id}
              onClick={() => onSelectCategory(c.id)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                isSelected
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              {c.label}
            </button>
          );
        })}
      </div>

      {/* Advanced Filter Expansion Bar */}
      {showFilterDrawer && (
        <div className="bg-white border border-slate-200 rounded-xl p-4 mb-6 shadow-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Packaging Unit Filter */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Fulfillment Packaging:
              </label>
              <select
                value={filters.packagingType}
                onChange={(e) => setFilters({ ...filters, packagingType: e.target.value })}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-600"
              >
                <option value="all">All Packaging Types</option>
                <option value="pallet">Full Pallets & Skids Only</option>
                <option value="carton">Master Cartons & Bundles</option>
              </select>
            </div>

            {/* Sort by */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Sort Inventory By:
              </label>
              <div className="relative">
                <select
                  value={filters.sortBy}
                  onChange={(e) => setFilters({ ...filters, sortBy: e.target.value as any })}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-600"
                >
                  <option value="popular">Most Popular / Featured</option>
                  <option value="discount">Highest Tier Savings (-%)</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="moq-asc">Lowest Minimum Order (MOQ)</option>
                </select>
              </div>
            </div>

            {/* Quick check toggles */}
            <div className="flex flex-col justify-center space-y-2 pt-1">
              <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.ecoOnly}
                  onChange={(e) => setFilters({ ...filters, ecoOnly: e.target.checked })}
                  className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 w-4 h-4 cursor-pointer"
                />
                <span className="flex items-center gap-1">
                  <Leaf className="w-3.5 h-3.5 text-emerald-600" />
                  Eco-Certified Only (FSC / Recycled)
                </span>
              </label>

              <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.inStockOnly}
                  onChange={(e) => setFilters({ ...filters, inStockOnly: e.target.checked })}
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                />
                <span>In-Stock Immediate 48h Dispatch Only</span>
              </label>
            </div>

            {/* MOQ filter */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-bold text-slate-700">Max MOQ Limit:</span>
                <span className="font-mono font-bold text-blue-700">{filters.maxMoq} Units/Packs</span>
              </div>
              <input
                type="range"
                min={1}
                max={10}
                value={filters.maxMoq}
                onChange={(e) => setFilters({ ...filters, maxMoq: Number(e.target.value) })}
                className="w-full h-1.5 bg-slate-200 rounded-lg cursor-pointer accent-blue-600"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>1 MOQ</span>
                <span>5</span>
                <span>10+ Max</span>
              </div>
            </div>
          </div>

          {/* Reset Row */}
          {hasActiveFilters && (
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500">
                Filtered: <strong className="text-slate-800">{filteredProducts.length}</strong> items match criteria
              </span>
              <button
                onClick={resetAllFilters}
                className="text-blue-700 hover:text-blue-900 font-semibold flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset All Filters</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* Status Bar */}
      <div className="flex items-center justify-between text-xs text-slate-500 mb-4 px-1">
        <div>
          Showing <span className="font-bold text-slate-800">{filteredProducts.length}</span> wholesale product lines
          {selectedCategory && (
            <span> in <span className="text-blue-700 font-semibold">{selectedCategory}</span></span>
          )}
        </div>
        <div className="text-[11px] text-slate-400 hidden sm:block">
          All prices reflect standard commercial wholesale. Volume contract brackets apply at checkout.
        </div>
      </div>

      {/* Catalog Render: Grid vs Table */}
      {filteredProducts.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center my-6">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900">No matching wholesale supplies found</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 mb-4">
            Try adjusting your search query, increasing your MOQ filter, or resetting category parameters.
          </p>
          <button
            onClick={resetAllFilters}
            className="px-4 py-2 bg-blue-700 text-white rounded-lg text-xs font-bold hover:bg-blue-800 transition cursor-pointer"
          >
            Reset All Filters
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={onAddToCart}
              onOpenSpecs={onOpenSpecs}
              onOpenSample={onOpenSample}
            />
          ))}
        </div>
      ) : (
        /* Dense Procurement Table View */
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-700 text-[11px] uppercase tracking-wider font-semibold border-b border-slate-200">
                  <th className="py-3 px-3">Product / SKU Spec</th>
                  <th className="py-3 px-3 hidden md:table-cell">Category</th>
                  <th className="py-3 px-3 hidden lg:table-cell">Warehouse Stock</th>
                  <th className="py-3 px-3">Tiered Unit Price</th>
                  <th className="py-3 px-3 text-center">Procurement Qty</th>
                  <th className="py-3 px-3 text-right">Line Total & Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredProducts.map((product) => (
                  <ProductTableRow
                    key={product.id}
                    product={product}
                    onAddToCart={onAddToCart}
                    onOpenSpecs={onOpenSpecs}
                    onOpenSample={onOpenSample}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </section>
  );
};
