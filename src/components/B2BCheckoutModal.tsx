import React, { useState } from 'react';
import { CartItem, CheckoutFormData } from '../types';
import { 
  X, 
  CheckCircle2, 
  Building, 
  Truck, 
  CreditCard, 
  FileCheck, 
  ShieldCheck, 
  ArrowRight, 
  ArrowLeft, 
  Download, 
  Check
} from 'lucide-react';

interface B2BCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onOrderSuccess: () => void;
}

export const B2BCheckoutModal: React.FC<B2BCheckoutModalProps> = ({
  isOpen,
  onClose,
  cartItems,
  onOrderSuccess,
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

  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1); // 5 is confirmation
  const [confirmedOrderId, setConfirmedOrderId] = useState<string>('');

  const [formData, setFormData] = useState<CheckoutFormData>({
    companyName: 'Apex Innovations Corp',
    taxExemptId: 'TX-9481920-E',
    isTaxExempt: true,
    poNumber: 'PO-2025-0482-FAC',
    costCenter: 'CC-9040-HQ-PROC',
    contactName: 'Morgan Vance',
    contactEmail: 'm.vance@apexinnovations.com',
    contactPhone: '(555) 234-8901',
    department: 'Corporate Facilities & IT',

    shippingAddress: '4400 Innovation Way, Receiving Dock 3',
    city: 'Austin',
    state: 'TX',
    zipCode: '78701',
    hasLoadingDock: true,
    needsLiftgate: false,
    insideDelivery: false,
    appointmentRequired: true,
    receivingContactPhone: '(555) 234-8999',
    dockHours: '7:30 AM - 3:30 PM CST',
    deliveryNotes: 'Check in with security gate. Pallet jack available on dock.',

    paymentMethod: 'net30',
    creditLineStatus: 'approved',
    billingAddressSameAsShipping: true,

    requireApprovalWorkflow: false,
    approverEmail: 'cfo-approvals@apexinnovations.com',
  });

  const subtotal = cartItems.reduce((acc, item) => acc + item.totalPrice, 0);
  const totalWeightLbs = cartItems.reduce(
    (acc, item) => acc + (item.product.packaging.weightLbs * item.quantity),
    0
  );

  const isFreeFreight = subtotal >= 1500 || totalWeightLbs >= 2000;
  const baseFreight = isFreeFreight ? 0 : 185;
  const liftgateFee = formData.needsLiftgate && !formData.hasLoadingDock ? 65 : 0;
  const insideDeliveryFee = formData.insideDelivery ? 95 : 0;
  const freightTotal = baseFreight + liftgateFee + insideDeliveryFee;

  const tax = formData.isTaxExempt ? 0 : subtotal * 0.0825;
  const grandTotal = subtotal + freightTotal + tax;

  const handleCompleteOrder = () => {
    const randomPo = `APX-${Math.floor(100000 + Math.random() * 900000)}`;
    setConfirmedOrderId(randomPo);
    setStep(5);
    onOrderSuccess();
  };

  const handleDownloadConfirmation = () => {
    const text = `APEXOFFICE COMMERCIAL WHOLESALE B2B ORDER CONFIRMATION\n` +
      `Order Reference: ${confirmedOrderId}\n` +
      `Purchase Order: ${formData.poNumber}\n` +
      `Cost Center: ${formData.costCenter}\n` +
      `Date: ${new Date().toLocaleString()}\n\n` +
      `ORGANIZATION:\n` +
      `Company: ${formData.companyName}\n` +
      `Tax Exemption ID: ${formData.taxExemptId} (VERIFIED)\n` +
      `Procurement Officer: ${formData.contactName} (${formData.contactEmail})\n\n` +
      `RECEIVING & DOCK LOGISTICS:\n` +
      `Destination: ${formData.shippingAddress}, ${formData.city}, ${formData.state} ${formData.zipCode}\n` +
      `Loading Dock: ${formData.hasLoadingDock ? 'Standard 48" Semi Dock' : 'Ground Level'}\n` +
      `Liftgate Required: ${formData.needsLiftgate ? 'YES' : 'NO'}\n` +
      `Dock Hours: ${formData.dockHours}\n` +
      `Notes: ${formData.deliveryNotes}\n\n` +
      `PAYMENT TERMS:\n` +
      `Method: ${formData.paymentMethod.toUpperCase()} (Corporate Credit Line Approved)\n\n` +
      `ITEMS:\n` +
      cartItems.map(item => ` - [${item.product.sku}] ${item.product.name}\n   Qty: ${item.quantity} | Unit: $${item.unitPrice.toFixed(2)} | Subtotal: $${item.totalPrice.toFixed(2)}`).join('\n') +
      `\n\nTotal Pallet Gross Weight: ${totalWeightLbs} lbs\n` +
      `Freight Charges: $${freightTotal.toFixed(2)}\n` +
      `Sales Tax: $${tax.toFixed(2)}\n` +
      `TOTAL ORDER INVOICE AMOUNT: $${grandTotal.toFixed(2)}\n\n` +
      `Old Dominion LTL Tracking will be dispatched to ${formData.contactEmail} within 24 hours.`;

    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `PurchaseOrder_${formData.poNumber}_Confirmation.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-xs overflow-y-auto">
      <div 
        className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-6 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
              <Building className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                B2B Commercial Procurement Checkout
              </h3>
              <p className="text-xs text-slate-300">
                Purchase Order Invoicing • Net 30/60 Terms • Dock Delivery
              </p>
            </div>
          </div>

          {step < 5 && (
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1 rounded-lg transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Multi-Step Indicator (Steps 1 to 4) */}
        {step < 5 && (
          <div className="bg-slate-50 border-b border-slate-200 px-6 py-3">
            <div className="grid grid-cols-4 gap-2 text-xs">
              {[
                { num: 1, label: 'Organization & PO', icon: Building },
                { num: 2, label: 'Dock Logistics', icon: Truck },
                { num: 3, label: 'B2B Terms', icon: CreditCard },
                { num: 4, label: 'Review & Authorize', icon: FileCheck },
              ].map((s) => {
                const StepIcon = s.icon;
                const isCurrent = step === s.num;
                const isPast = step > s.num;
                return (
                  <button
                    key={s.num}
                    onClick={() => {
                      if (isPast) setStep(s.num as any);
                    }}
                    disabled={!isPast && !isCurrent}
                    className={`flex items-center gap-2 p-2 rounded-lg text-left transition ${
                      isCurrent
                        ? 'bg-blue-100/70 text-blue-900 font-bold border border-blue-300'
                        : isPast
                        ? 'text-slate-700 hover:bg-slate-200/60 cursor-pointer font-medium'
                        : 'text-slate-400 cursor-not-allowed opacity-60'
                    }`}
                  >
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 ${
                        isPast
                          ? 'bg-emerald-600 text-white'
                          : isCurrent
                          ? 'bg-blue-700 text-white'
                          : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {isPast ? <Check className="w-3.5 h-3.5" /> : s.num}
                    </div>
                    <div className="hidden sm:block truncate">
                      <div className="text-[10px] text-slate-400 uppercase leading-none flex items-center gap-1">
                        <StepIcon className="w-2.5 h-2.5" />
                        Step {s.num}
                      </div>
                      <div className="truncate font-semibold">{s.label}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Modal Main Content Container */}
        <div className="p-6 max-h-[72vh] overflow-y-auto">
          {/* STEP 1: ORGANIZATION & PROCUREMENT */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div>
                  <h4 className="text-base font-bold text-slate-900">
                    Step 1: Organization & Purchase Order (PO) Details
                  </h4>
                  <p className="text-xs text-slate-500">
                    Enter enterprise billing credentials and internal cost allocation codes
                  </p>
                </div>
                <span className="text-[11px] text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md font-semibold border border-blue-200">
                  Tier 2 Contract Pre-Verified
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Company Legal Entity Name *
                  </label>
                  <input
                    type="text"
                    value={formData.companyName}
                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                    placeholder="e.g. Acme Corporation LLC"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Purchase Order (PO) Number *
                  </label>
                  <input
                    type="text"
                    value={formData.poNumber}
                    onChange={(e) => setFormData({ ...formData, poNumber: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-mono font-bold focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                    placeholder="e.g. PO-2025-XXXX"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Cost Center / Department Code
                  </label>
                  <input
                    type="text"
                    value={formData.costCenter}
                    onChange={(e) => setFormData({ ...formData, costCenter: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-mono focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                    placeholder="e.g. CC-4020-HQ"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Operating Department
                  </label>
                  <input
                    type="text"
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                    placeholder="e.g. Facilities Management"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Procurement Officer Name *
                  </label>
                  <input
                    type="text"
                    value={formData.contactName}
                    onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Business Email (for PO & Invoicing) *
                  </label>
                  <input
                    type="email"
                    value={formData.contactEmail}
                    onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              </div>

              {/* Tax Exemption Section */}
              <div className="bg-blue-50/60 border border-blue-200 rounded-xl p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <label className="flex items-center gap-2 font-bold text-slate-900 text-xs cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.isTaxExempt}
                        onChange={(e) => setFormData({ ...formData, isTaxExempt: e.target.checked })}
                        className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                      />
                      <span>Apply Sales Tax Exemption / Direct Resale Certificate (0% Tax)</span>
                    </label>
                    <p className="text-[11px] text-slate-600 pl-6">
                      For registered non-profits, education, government, and commercial wholesale resale accounts.
                    </p>
                  </div>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded border border-emerald-300 shrink-0">
                    Verified Exemption
                  </span>
                </div>

                {formData.isTaxExempt && (
                  <div className="mt-3 pl-6 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="block text-[11px] font-medium text-slate-700 mb-1">
                        State Resale Certificate / Tax ID:
                      </label>
                      <input
                        type="text"
                        value={formData.taxExemptId}
                        onChange={(e) => setFormData({ ...formData, taxExemptId: e.target.value })}
                        className="w-full p-2 bg-white border border-slate-300 rounded-lg font-mono text-slate-800"
                      />
                    </div>
                    <div className="flex items-end">
                      <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        Valid Resale Certificate on file for 2025
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* STEP 2: DOCK LOGISTICS & RECEIVING */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div>
                  <h4 className="text-base font-bold text-slate-900">
                    Step 2: Receiving Dock & Freight Access Logistics
                  </h4>
                  <p className="text-xs text-slate-500">
                    Ensure carrier Old Dominion Freight Line arrives with correct equipment
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-mono font-bold text-slate-800">
                    Order Weight: {totalWeightLbs.toLocaleString()} lbs
                  </span>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="sm:col-span-3">
                  <label className="block font-bold text-slate-700 mb-1">
                    Facility Dock Delivery Address *
                  </label>
                  <input
                    type="text"
                    value={formData.shippingAddress}
                    onChange={(e) => setFormData({ ...formData, shippingAddress: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">City *</label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">State *</label>
                  <input
                    type="text"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">ZIP / Postal Code *</label>
                  <input
                    type="text"
                    value={formData.zipCode}
                    onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              {/* Dock Specifications Checkboxes */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3 text-xs">
                <h5 className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">
                  Unloading & Dock Capabilities
                </h5>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label className="flex items-start gap-2.5 p-3 rounded-lg border border-slate-200 bg-white cursor-pointer hover:border-blue-400 transition">
                    <input
                      type="checkbox"
                      checked={formData.hasLoadingDock}
                      onChange={(e) => setFormData({ ...formData, hasLoadingDock: e.target.checked })}
                      className="mt-0.5 rounded text-blue-600 focus:ring-blue-500 w-4 h-4"
                    />
                    <div>
                      <strong className="block text-slate-900">Semi-Truck Loading Dock (48" or 52")</strong>
                      <span className="text-[11px] text-slate-500">
                        Facility accommodates 53-ft dry van tractor trailers
                      </span>
                    </div>
                  </label>

                  <label className="flex items-start gap-2.5 p-3 rounded-lg border border-slate-200 bg-white cursor-pointer hover:border-blue-400 transition">
                    <input
                      type="checkbox"
                      checked={formData.needsLiftgate}
                      onChange={(e) => setFormData({ ...formData, needsLiftgate: e.target.checked })}
                      className="mt-0.5 rounded text-blue-600 focus:ring-blue-500 w-4 h-4"
                    />
                    <div>
                      <strong className="block text-slate-900">Hydraulic Liftgate Service Required</strong>
                      <span className="text-[11px] text-slate-500">
                        Required if you have ground-level entrance or no forklift (+${formData.hasLoadingDock ? '0' : '65'})
                      </span>
                    </div>
                  </label>

                  <label className="flex items-start gap-2.5 p-3 rounded-lg border border-slate-200 bg-white cursor-pointer hover:border-blue-400 transition">
                    <input
                      type="checkbox"
                      checked={formData.insideDelivery}
                      onChange={(e) => setFormData({ ...formData, insideDelivery: e.target.checked })}
                      className="mt-0.5 rounded text-blue-600 focus:ring-blue-500 w-4 h-4"
                    />
                    <div>
                      <strong className="block text-slate-900">Inside Threshold Delivery / Staging</strong>
                      <span className="text-[11px] text-slate-500">
                        Driver unloads freight past dock into storage bay (+${formData.insideDelivery ? '95' : '95'})
                      </span>
                    </div>
                  </label>

                  <label className="flex items-start gap-2.5 p-3 rounded-lg border border-slate-200 bg-white cursor-pointer hover:border-blue-400 transition">
                    <input
                      type="checkbox"
                      checked={formData.appointmentRequired}
                      onChange={(e) => setFormData({ ...formData, appointmentRequired: e.target.checked })}
                      className="mt-0.5 rounded text-blue-600 focus:ring-blue-500 w-4 h-4"
                    />
                    <div>
                      <strong className="block text-slate-900">24h Advance Delivery Call / Appointment</strong>
                      <span className="text-[11px] text-slate-500">
                        Carrier calls receiving contact 24 hours prior to dispatch (Included Free)
                      </span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Receiving Contact & Dock Hours */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Receiving Dock Operating Hours
                  </label>
                  <input
                    type="text"
                    value={formData.dockHours}
                    onChange={(e) => setFormData({ ...formData, dockHours: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-800"
                    placeholder="e.g. 7:00 AM - 3:30 PM CST"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Receiving Manager Direct Phone
                  </label>
                  <input
                    type="tel"
                    value={formData.receivingContactPhone}
                    onChange={(e) => setFormData({ ...formData, receivingContactPhone: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-800"
                    placeholder="e.g. (555) 000-0000"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-bold text-slate-700 mb-1">
                    Gate Code / Dock Instructions for Driver
                  </label>
                  <textarea
                    rows={2}
                    value={formData.deliveryNotes}
                    onChange={(e) => setFormData({ ...formData, deliveryNotes: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-800"
                    placeholder="e.g. North Gate entrance, check in with shipping office..."
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: B2B PAYMENT & TERMS */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div>
                  <h4 className="text-base font-bold text-slate-900">
                    Step 3: Commercial Payment Method & Terms
                  </h4>
                  <p className="text-xs text-slate-500">
                    Select Net terms or enterprise purchasing card (P-Card)
                  </p>
                </div>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                  $50,000 Credit Line Active
                </span>
              </div>

              {/* Payment Methods Options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {/* Net 30 Terms */}
                <label
                  className={`p-4 rounded-xl border-2 transition cursor-pointer flex flex-col justify-between ${
                    formData.paymentMethod === 'net30'
                      ? 'border-blue-600 bg-blue-50/50 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="paymentMethod"
                          checked={formData.paymentMethod === 'net30'}
                          onChange={() => setFormData({ ...formData, paymentMethod: 'net30' })}
                          className="text-blue-600 focus:ring-blue-500"
                        />
                        <strong className="text-slate-900 text-sm">Net 30 Terms (PO Invoice)</strong>
                      </div>
                      <p className="text-slate-600 mt-1 pl-5">
                        Invoice issued on dock delivery. 30 days to pay via ACH or Corporate Check.
                      </p>
                    </div>
                  </div>
                  <div className="mt-3 pl-5 pt-2 border-t border-slate-200/60 flex items-center gap-1.5 text-emerald-700 font-semibold text-[11px]">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Instant Credit Line Pre-Approved</span>
                  </div>
                </label>

                {/* Net 60 Terms */}
                <label
                  className={`p-4 rounded-xl border-2 transition cursor-pointer flex flex-col justify-between ${
                    formData.paymentMethod === 'net60'
                      ? 'border-blue-600 bg-blue-50/50 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="paymentMethod"
                          checked={formData.paymentMethod === 'net60'}
                          onChange={() => setFormData({ ...formData, paymentMethod: 'net60' })}
                          className="text-blue-600 focus:ring-blue-500"
                        />
                        <strong className="text-slate-900 text-sm">Net 60 Terms (Enterprise)</strong>
                      </div>
                      <p className="text-slate-600 mt-1 pl-5">
                        Extended 60-day terms available for Corporate Strategic master agreements.
                      </p>
                    </div>
                  </div>
                  <div className="mt-3 pl-5 pt-2 border-t border-slate-200/60 flex items-center gap-1.5 text-blue-700 font-semibold text-[11px]">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Corporate Agreement Required</span>
                  </div>
                </label>

                {/* Corporate P-Card */}
                <label
                  className={`p-4 rounded-xl border-2 transition cursor-pointer flex flex-col justify-between ${
                    formData.paymentMethod === 'pcard'
                      ? 'border-blue-600 bg-blue-50/50 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="paymentMethod"
                        checked={formData.paymentMethod === 'pcard'}
                        onChange={() => setFormData({ ...formData, paymentMethod: 'pcard' })}
                        className="text-blue-600 focus:ring-blue-500"
                      />
                      <strong className="text-slate-900 text-sm">Corporate Purchasing Card (P-Card)</strong>
                    </div>
                    <p className="text-slate-600 mt-1 pl-5">
                      Visa Commercial, MasterCard Corporate, or Amex Corporate Purchasing.
                    </p>
                  </div>
                  <div className="mt-3 pl-5 pt-2 border-t border-slate-200/60 text-[11px] text-slate-500">
                    Level 3 Line-Item Data Passed
                  </div>
                </label>

                {/* ACH Wire Transfer */}
                <label
                  className={`p-4 rounded-xl border-2 transition cursor-pointer flex flex-col justify-between ${
                    formData.paymentMethod === 'ach'
                      ? 'border-blue-600 bg-blue-50/50 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="paymentMethod"
                        checked={formData.paymentMethod === 'ach'}
                        onChange={() => setFormData({ ...formData, paymentMethod: 'ach' })}
                        className="text-blue-600 focus:ring-blue-500"
                      />
                      <strong className="text-slate-900 text-sm">Direct ACH Wire / EFT</strong>
                    </div>
                    <p className="text-slate-600 mt-1 pl-5">
                      Electronic funds transfer to Apex Wholesale JPMorgan Chase bank escrow.
                    </p>
                  </div>
                  <div className="mt-3 pl-5 pt-2 border-t border-slate-200/60 text-[11px] text-emerald-700 font-semibold">
                    1.5% Early-Pay Discount Eligible
                  </div>
                </label>
              </div>

              {/* Internal Approval Workflow Option */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs">
                <label className="flex items-center gap-2.5 font-bold text-slate-900 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.requireApprovalWorkflow}
                    onChange={(e) => setFormData({ ...formData, requireApprovalWorkflow: e.target.checked })}
                    className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4"
                  />
                  <span>Require VP / Controller Approval Before Warehouse Dispatch</span>
                </label>
                <p className="text-slate-500 text-[11px] pl-6">
                  If enabled, a secure single-sign-on approval link will be routed to your finance department before the pallets leave the dock.
                </p>

                {formData.requireApprovalWorkflow && (
                  <div className="pt-2 pl-6">
                    <label className="block text-[11px] font-medium text-slate-700 mb-1">
                      Approver Email Address:
                    </label>
                    <input
                      type="email"
                      value={formData.approverEmail}
                      onChange={(e) => setFormData({ ...formData, approverEmail: e.target.value })}
                      className="w-full sm:w-80 p-2 bg-white border border-slate-300 rounded-lg text-slate-800"
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* STEP 4: REVIEW & AUTHORIZE COMMERCIAL ORDER */}
          {step === 4 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div>
                  <h4 className="text-base font-bold text-slate-900">
                    Step 4: Final Commercial Review & PO Authorization
                  </h4>
                  <p className="text-xs text-slate-500">
                    Verify all dock logistics, invoice terms, and wholesale pricing brackets
                  </p>
                </div>
                <span className="text-xs font-mono font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded border border-blue-200">
                  PO: {formData.poNumber}
                </span>
              </div>

              {/* Logistics & Invoice Summary Box */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">
                    Entity & Accounting
                  </span>
                  <strong className="text-slate-900 block mt-0.5">{formData.companyName}</strong>
                  <span className="text-slate-600 block">PO: {formData.poNumber}</span>
                  <span className="text-slate-600 block font-mono text-[11px]">Cost: {formData.costCenter}</span>
                  <span className="text-emerald-700 font-semibold block text-[11px] mt-1">
                    Tax Exemption: {formData.taxExemptId}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">
                    Receiving Dock Location
                  </span>
                  <strong className="text-slate-900 block mt-0.5">{formData.shippingAddress}</strong>
                  <span className="text-slate-600 block">{formData.city}, {formData.state} {formData.zipCode}</span>
                  <span className="text-slate-600 block">Dock: {formData.hasLoadingDock ? 'Yes (Semi Dock)' : 'Ground Level'}</span>
                  <span className="text-slate-600 block">Liftgate: {formData.needsLiftgate ? 'Required' : 'Standard'}</span>
                </div>

                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">
                    Payment Terms & Contact
                  </span>
                  <strong className="text-slate-900 block mt-0.5 uppercase">{formData.paymentMethod} (Invoiced)</strong>
                  <span className="text-slate-600 block">Officer: {formData.contactName}</span>
                  <span className="text-slate-600 block truncate">{formData.contactEmail}</span>
                  <span className="text-slate-600 block">{formData.contactPhone}</span>
                </div>
              </div>

              {/* Itemized Table */}
              <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
                <table className="w-full text-left">
                  <thead className="bg-slate-100 text-slate-700 text-[11px] uppercase border-b border-slate-200 font-semibold">
                    <tr>
                      <th className="py-2 px-3">Item / SKU</th>
                      <th className="py-2 px-3">Bracket Tier</th>
                      <th className="py-2 px-3 text-center">Qty</th>
                      <th className="py-2 px-3 text-right">Unit Price</th>
                      <th className="py-2 px-3 text-right">Line Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-mono">
                    {cartItems.map((item) => (
                      <tr key={item.product.id}>
                        <td className="py-2.5 px-3">
                          <span className="font-bold text-slate-900 font-sans block">{item.product.name}</span>
                          <span className="text-[10px] text-blue-700 font-mono">{item.product.sku}</span>
                        </td>
                        <td className="py-2.5 px-3 font-sans">
                          <span className="px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-800 text-[10px] font-semibold border border-emerald-200">
                            {item.selectedTier.label} (-{item.selectedTier.discountPct}%)
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-center font-bold text-slate-800">
                          {item.quantity}
                        </td>
                        <td className="py-2.5 px-3 text-right text-slate-700">
                          ${item.unitPrice.toFixed(2)}
                        </td>
                        <td className="py-2.5 px-3 text-right font-bold text-slate-900">
                          ${item.totalPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Financial Calculation Strip */}
              <div className="bg-slate-900 text-white p-5 rounded-xl text-xs space-y-2">
                <div className="flex justify-between text-slate-300">
                  <span>Pallet Freight Subtotal:</span>
                  <span className="font-mono">${subtotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>LTL Commercial Freight ({totalWeightLbs.toLocaleString()} lbs):</span>
                  <span className="font-mono text-emerald-400">
                    {freightTotal === 0 ? 'FREE CONTRACT FREIGHT' : `$${freightTotal.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>State Sales Tax (Exemption Applied):</span>
                  <span className="font-mono text-emerald-400">$0.00 (Exempt)</span>
                </div>
                <div className="pt-2 border-t border-slate-800 flex justify-between items-baseline">
                  <div>
                    <span className="text-sm font-bold text-white block">Authorized Invoice Total:</span>
                    <span className="text-[10px] text-slate-400">Payable via Net 30 upon dock delivery receipt</span>
                  </div>
                  <span className="text-2xl font-black font-mono text-white">
                    ${grandTotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: ORDER CONFIRMATION SCREEN */}
          {step === 5 && (
            <div className="py-8 px-4 text-center space-y-5">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold uppercase tracking-wider">
                  Order Successfully Dispatched to Logistics
                </span>
                <h3 className="text-2xl font-black text-slate-900 mt-2">
                  Purchase Order Authorized: #{formData.poNumber}
                </h3>
                <p className="text-xs text-slate-500 mt-1 max-w-lg mx-auto">
                  Commercial confirmation and packing slip generated. Confirmation has been emailed to <strong className="text-slate-800">{formData.contactEmail}</strong>.
                </p>
              </div>

              {/* Order Reference Box */}
              <div className="max-w-md mx-auto bg-slate-50 rounded-xl border border-slate-200 p-4 text-xs text-left space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">Apex Commercial Reference:</span>
                  <span className="font-mono font-bold text-blue-700">{confirmedOrderId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Corporate PO Number:</span>
                  <span className="font-mono font-bold text-slate-900">{formData.poNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Cost Center:</span>
                  <span className="font-mono text-slate-800">{formData.costCenter}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Freight Carrier Assigned:</span>
                  <span className="font-semibold text-slate-800">Old Dominion Freight Line (LTL)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Target Dock Arrival:</span>
                  <span className="font-semibold text-emerald-700">48 Hours (Guaranteed)</span>
                </div>
                <div className="flex justify-between border-t border-slate-200 pt-2 font-bold">
                  <span className="text-slate-700">Authorized Invoiced Amount:</span>
                  <span className="font-mono text-slate-900 text-sm">
                    ${grandTotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>

              {/* Download & Actions */}
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  onClick={handleDownloadConfirmation}
                  className="px-5 py-2.5 bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs rounded-xl shadow-sm transition flex items-center gap-2 cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Purchase Order Receipt (PDF)</span>
                </button>

                <button
                  onClick={onClose}
                  className="px-5 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold text-xs rounded-xl transition cursor-pointer"
                >
                  Return to Wholesale Portal
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Navigation Footer */}
        {step < 5 && (
          <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep((step - 1) as any)}
                className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-200 rounded-lg transition flex items-center gap-1.5 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800 transition cursor-pointer"
              >
                Cancel
              </button>
            )}

            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-500 hidden sm:inline">
                Step {step} of 4
              </span>

              {step < 4 ? (
                <button
                  type="button"
                  onClick={() => setStep((step + 1) as any)}
                  className="px-5 py-2.5 bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Continue to {step === 1 ? 'Dock Logistics' : step === 2 ? 'Payment Terms' : 'Review'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleCompleteOrder}
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-emerald-600/30 transition flex items-center gap-2 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Authorize Order with PO (#{formData.poNumber})</span>
                </button>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
