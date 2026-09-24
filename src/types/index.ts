export interface PricingTier {
  minQty: number;
  maxQty?: number; // undefined means "and above"
  unitPrice: number;
  discountPct: number;
  label: string;
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  category: 'Paper & Print' | 'Furniture' | 'Desk Supplies' | 'Packaging & Shipping' | 'Breakroom & Janitorial';
  description: string;
  shortSpec: string;
  unitOfMeasure: string; // e.g., 'Pallet (40 Cartons)', 'Case of 100', 'Unit'
  moq: number; // Minimum Order Quantity
  packaging: {
    unitsPerPack: number;
    packType: string;
    palletQuantity: number;
    weightLbs: number;
    dimensions: string;
  };
  basePrice: number; // Single pack/unit reference
  pricingTiers: PricingTier[];
  image: string;
  badges: string[];
  inStock: boolean;
  stockUnits: number;
  warehouseLocation: string;
  ecoFriendly: boolean;
  certifications: string[];
  featured?: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedTier: PricingTier;
  unitPrice: number;
  totalPrice: number;
}

export interface FilterState {
  searchQuery: string;
  category: string;
  ecoOnly: boolean;
  inStockOnly: boolean;
  packagingType: string;
  maxMoq: number;
  sortBy: 'popular' | 'discount' | 'price-asc' | 'price-desc' | 'moq-asc';
}

export interface CheckoutFormData {
  // Step 1: Organization & Procurement
  companyName: string;
  taxExemptId: string;
  isTaxExempt: boolean;
  poNumber: string;
  costCenter: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  department: string;

  // Step 2: Shipping & Dock Logistics
  shippingAddress: string;
  city: string;
  state: string;
  zipCode: string;
  hasLoadingDock: boolean;
  needsLiftgate: boolean;
  insideDelivery: boolean;
  appointmentRequired: boolean;
  receivingContactPhone: string;
  dockHours: string;
  deliveryNotes: string;

  // Step 3: Payment & Terms
  paymentMethod: 'net30' | 'net60' | 'pcard' | 'ach' | 'custom_terms';
  creditLineStatus: 'approved' | 'pending';
  billingAddressSameAsShipping: boolean;
  billingAddress?: string;

  // Step 4: Confirmation
  requireApprovalWorkflow: boolean;
  approverEmail?: string;
}
