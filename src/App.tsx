import { useState } from 'react';
import { PRODUCTS } from './data/products';
import { Product, PricingTier, CartItem } from './types';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { WholesaleCatalog } from './components/WholesaleCatalog';
import { PricingTiersSection } from './components/PricingTiersSection';
import { TrustAndLogistics } from './components/TrustAndLogistics';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { B2BCheckoutModal } from './components/B2BCheckoutModal';
import { ProductDetailModal } from './components/ProductDetailModal';
import { QuickOrderBySkuModal } from './components/QuickOrderBySkuModal';
import { SampleRequestModal } from './components/SampleRequestModal';
import { RfqModal } from './components/RfqModal';
import { ShoppingCart, FileSpreadsheet, FileText, CheckCircle2 } from 'lucide-react';

export function App() {
  // Search & category filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  // Cart state - pre-populate with 2 realistic wholesale items so buyer can immediately test cart & checkout
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      product: PRODUCTS[0], // Copy Paper Pallet
      quantity: 3,
      selectedTier: PRODUCTS[0].pricingTiers[1], // 3-7 pallets: $1740 (-12%)
      unitPrice: 1740.00,
      totalPrice: 1740.00 * 3,
    },
    {
      product: PRODUCTS[1], // Ergonomic Task Chair 10-packs
      quantity: 2,
      selectedTier: PRODUCTS[1].pricingTiers[0], // 2-4 crates: $1850
      unitPrice: 1850.00,
      totalPrice: 1850.00 * 2,
    },
  ]);

  // Modal open states
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isQuickOrderOpen, setIsQuickOrderOpen] = useState(false);
  const [isRfqOpen, setIsRfqOpen] = useState(false);
  const [isSampleOpen, setIsSampleOpen] = useState(false);

  // Selected product for technical spec deep dive modal
  const [specProduct, setSpecProduct] = useState<Product | null>(null);
  const [sampleTargetProduct, setSampleTargetProduct] = useState<Product | null>(null);

  // Toast notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2500);
  };

  // Add single product to cart with chosen quantity and tier
  const handleAddToCart = (product: Product, quantity: number, tier: PricingTier) => {
    setCartItems((prev) => {
      const existingIdx = prev.findIndex((item) => item.product.id === product.id);
      if (existingIdx > -1) {
        const updated = [...prev];
        const newQty = updated[existingIdx].quantity + quantity;
        // Recalculate tier for new quantity
        const newTier = product.pricingTiers.reduce((acc, t) => {
          if (newQty >= t.minQty) {
            if (!t.maxQty || newQty <= t.maxQty) return t;
            return t;
          }
          return acc;
        }, product.pricingTiers[0]);

        updated[existingIdx] = {
          product,
          quantity: newQty,
          selectedTier: newTier,
          unitPrice: newTier.unitPrice,
          totalPrice: newTier.unitPrice * newQty,
        };
        return updated;
      } else {
        return [
          ...prev,
          {
            product,
            quantity,
            selectedTier: tier,
            unitPrice: tier.unitPrice,
            totalPrice: tier.unitPrice * quantity,
          },
        ];
      }
    });

    showToast(`Added ${quantity}x ${product.name} to Wholesale Cart`);
  };

  // Batch add (from Quick Order by SKU modal)
  const handleBatchAddToCart = (items: { product: Product; quantity: number; tier: PricingTier }[]) => {
    items.forEach((item) => {
      handleAddToCart(item.product, item.quantity, item.tier);
    });
    showToast(`Added ${items.length} bulk line items to order`);
  };

  // Update item quantity in cart drawer
  const handleUpdateCartQuantity = (productId: string, quantity: number) => {
    setCartItems((prev) => {
      return prev
        .map((item) => {
          if (item.product.id === productId) {
            if (quantity <= 0) return null;
            // Recalculate tier
            const newTier = item.product.pricingTiers.reduce((acc, t) => {
              if (quantity >= t.minQty) {
                if (!t.maxQty || quantity <= t.maxQty) return t;
                return t;
              }
              return acc;
            }, item.product.pricingTiers[0]);

            return {
              ...item,
              quantity,
              selectedTier: newTier,
              unitPrice: newTier.unitPrice,
              totalPrice: newTier.unitPrice * quantity,
            };
          }
          return item;
        })
        .filter(Boolean) as CartItem[];
    });
  };

  // Remove item from cart
  const handleRemoveFromCart = (productId: string) => {
    setCartItems((prev) => prev.filter((item) => item.product.id !== productId));
    showToast('Removed item from wholesale order');
  };

  const handleOpenSpecs = (product: Product) => {
    setSpecProduct(product);
  };

  const handleOpenSample = (product: Product) => {
    setSampleTargetProduct(product);
    setIsSampleOpen(true);
  };

  const scrollToCatalog = () => {
    const el = document.getElementById('wholesale-catalog');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col selection:bg-blue-600 selection:text-white">
      {/* Toast feedback */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl border border-slate-700 flex items-center gap-2.5 text-xs font-semibold animate-in fade-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Header & Nav */}
      <Header
        cartItems={cartItems}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenQuickOrder={() => setIsQuickOrderOpen(true)}
        onOpenRfq={() => setIsRfqOpen(true)}
        onOpenSampleModal={() => {
          setSampleTargetProduct(null);
          setIsSampleOpen(true);
        }}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />

      {/* Main Content Sections */}
      <main className="flex-1">
        {/* Conversion Hero with Live Procurement Savings Calculator */}
        <Hero
          onScrollToCatalog={scrollToCatalog}
          onOpenRfq={() => setIsRfqOpen(true)}
          onOpenSampleModal={() => {
            setSampleTargetProduct(null);
            setIsSampleOpen(true);
          }}
        />

        {/* Wholesale Product Catalog with Grid/Table Views & Bulk Pricing Tables */}
        <WholesaleCatalog
          products={PRODUCTS}
          onAddToCart={handleAddToCart}
          onOpenSpecs={handleOpenSpecs}
          onOpenSample={handleOpenSample}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />

        {/* Contract Tiers & Pallet Logistics Section */}
        <PricingTiersSection
          onOpenRfq={() => setIsRfqOpen(true)}
          onOpenQuickOrder={() => setIsQuickOrderOpen(true)}
        />

        {/* Enterprise Trust, Strategic Hubs, ERP Integrations & Reviews */}
        <TrustAndLogistics />
      </main>

      {/* Enterprise B2B Footer */}
      <Footer
        onOpenQuickOrder={() => setIsQuickOrderOpen(true)}
        onOpenRfq={() => setIsRfqOpen(true)}
        onOpenSampleModal={() => {
          setSampleTargetProduct(null);
          setIsSampleOpen(true);
        }}
      />

      {/* Slide-out Cart Drawer with Pallet Freight Meter */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveFromCart}
        onOpenCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
      />

      {/* Streamlined B2B Checkout Modal (4-step Procurement, Dock Logistics, Net Terms, Review) */}
      <B2BCheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cartItems={cartItems}
        onOrderSuccess={() => {
          // After checkout completion, keep or clear items
          showToast('Purchase Order Authorized! Logistics dispatch initiated.');
        }}
      />

      {/* Technical Data Sheet / Pallet Spec Modal */}
      <ProductDetailModal
        product={specProduct}
        onClose={() => setSpecProduct(null)}
        onAddToCart={handleAddToCart}
        onOpenSample={handleOpenSample}
      />

      {/* Quick Order by SKU / Bulk Re-Order Modal */}
      <QuickOrderBySkuModal
        isOpen={isQuickOrderOpen}
        onClose={() => setIsQuickOrderOpen(false)}
        products={PRODUCTS}
        onBatchAddToCart={handleBatchAddToCart}
      />

      {/* Free Sample Request Evaluation Kit Modal */}
      <SampleRequestModal
        isOpen={isSampleOpen}
        onClose={() => {
          setIsSampleOpen(false);
          setSampleTargetProduct(null);
        }}
        products={PRODUCTS}
        initialProduct={sampleTargetProduct}
      />

      {/* Request For Quote (RFQ) Modal */}
      <RfqModal
        isOpen={isRfqOpen}
        onClose={() => setIsRfqOpen(false)}
      />

      {/* Mobile Floating Bar for Quick Action */}
      <div className="fixed bottom-4 left-4 right-4 sm:hidden z-30">
        <div className="bg-slate-900/95 backdrop-blur-md rounded-2xl p-2.5 shadow-2xl border border-slate-700 flex items-center justify-between gap-2">
          <button
            onClick={() => setIsQuickOrderOpen(true)}
            className="flex-1 py-2 px-3 rounded-xl bg-slate-800 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-blue-400" />
            <span>SKU Order</span>
          </button>
          <button
            onClick={() => setIsRfqOpen(true)}
            className="flex-1 py-2 px-3 rounded-xl bg-slate-800 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5 text-emerald-400" />
            <span>RFQ Quote</span>
          </button>
          <button
            onClick={() => setIsCartOpen(true)}
            className="flex-1 py-2 px-3 rounded-xl bg-blue-600 text-white text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            <span>Cart ({totalCartCount})</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
