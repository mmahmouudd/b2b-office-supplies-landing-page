import React from 'react';
import { CONTRACT_TIERS } from '../data/products';
import { 
  Check, 
  Truck, 
  CreditCard, 
  Layers, 
  ArrowRight, 
  ShieldCheck, 
  Sparkles, 
  FileCheck2,
  PhoneCall
} from 'lucide-react';

interface PricingTiersSectionProps {
  onOpenRfq: () => void;
  onOpenQuickOrder: () => void;
}

export const PricingTiersSection: React.FC<PricingTiersSectionProps> = ({
  onOpenRfq,
  onOpenQuickOrder,
}) => {
  return (
    <section className="bg-slate-100/80 border-y border-slate-200 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold uppercase tracking-wider mb-2">
            <Layers className="w-3.5 h-3.5" />
            <span>Enterprise Procurement Tiers</span>
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight sm:text-4xl">
            Volume Contract Agreements & Payment Terms
          </h2>
          <p className="text-sm sm:text-base text-slate-600 mt-2">
            Whether managing a single regional warehouse or 50 corporate office campuses, our contract tiers deliver predictable wholesale pricing, dedicated account managers, and automated PO invoicing.
          </p>
        </div>

        {/* Pricing Tiers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch">
          {CONTRACT_TIERS.map((tier, idx) => (
            <div
              key={idx}
              className={`rounded-2xl p-6 sm:p-7 flex flex-col justify-between transition-all relative ${
                tier.popular
                  ? 'bg-slate-900 text-white shadow-2xl ring-2 ring-blue-500 md:-translate-y-2'
                  : 'bg-white text-slate-900 border border-slate-200 shadow-sm hover:shadow-md'
              }`}
            >
              {tier.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-[11px] font-extrabold py-1 px-3.5 rounded-full uppercase tracking-wider shadow-md flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-300" />
                  Most Popular For Mid-Market
                </div>
              )}

              <div>
                {/* Header */}
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-bold tracking-tight">
                    {tier.tierName}
                  </h3>
                  <span
                    className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                      tier.popular
                        ? 'bg-blue-500/20 text-blue-300 border border-blue-400/30'
                        : 'bg-slate-100 text-slate-700 border border-slate-200'
                    }`}
                  >
                    {tier.threshold}
                  </span>
                </div>

                {/* Big Discount Rate */}
                <div className="my-4 pb-4 border-b border-slate-200/20">
                  <div
                    className={`text-2xl sm:text-3xl font-black font-mono tracking-tight ${
                      tier.popular ? 'text-white' : 'text-blue-700'
                    }`}
                  >
                    {tier.discount}
                  </div>
                  <p
                    className={`text-xs mt-1 font-medium ${
                      tier.popular ? 'text-slate-400' : 'text-slate-500'
                    }`}
                  >
                    Guaranteed contract discount across all 15,000+ catalog SKUs
                  </p>
                </div>

                {/* Key Logistics & Terms Badges */}
                <div className="space-y-2.5 mb-6 text-xs font-medium">
                  <div className="flex items-center gap-2">
                    <CreditCard
                      className={`w-4 h-4 shrink-0 ${
                        tier.popular ? 'text-emerald-400' : 'text-emerald-600'
                      }`}
                    />
                    <span>
                      Payment: <strong>{tier.paymentTerms}</strong>
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Truck
                      className={`w-4 h-4 shrink-0 ${
                        tier.popular ? 'text-sky-400' : 'text-sky-600'
                      }`}
                    />
                    <span>
                      Freight: <strong>{tier.shipping}</strong>
                    </span>
                  </div>
                </div>

                {/* Detailed Benefit List */}
                <div className="space-y-2.5 text-xs">
                  <p
                    className={`text-[11px] uppercase font-bold tracking-wider ${
                      tier.popular ? 'text-slate-400' : 'text-slate-500'
                    }`}
                  >
                    Included Capabilities:
                  </p>
                  {tier.benefits.map((b, bIdx) => (
                    <div key={bIdx} className="flex items-start gap-2">
                      <Check
                        className={`w-3.5 h-3.5 mt-0.5 shrink-0 ${
                          tier.popular ? 'text-emerald-400' : 'text-blue-700'
                        }`}
                      />
                      <span className={tier.popular ? 'text-slate-300' : 'text-slate-700'}>
                        {b}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-8 pt-4 border-t border-slate-200/20">
                <button
                  onClick={onOpenRfq}
                  className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                    tier.popular
                      ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/30'
                      : 'bg-slate-900 hover:bg-slate-800 text-white'
                  }`}
                >
                  <span>Request Tier Approval & Net Terms</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Pallet Logistics Breakdown Banner */}
        <div className="mt-12 bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-8">
              <div className="flex items-center gap-2 text-blue-700 text-xs font-bold uppercase tracking-wider mb-1">
                <Truck className="w-4 h-4" />
                <span>Nationwide Freight Optimization</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900">
                Pallet & Truckload Logistics (LTL / FTL)
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
                Save an additional 18-35% on logistics by ordering standard GMA full skids (40" x 48"). We coordinate with your loading dock personnel, provide liftgate delivery for street-level facilities, and offer scheduled pallet consolidation.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4 text-xs font-medium text-slate-700">
                <div className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Guaranteed 48hr Dock Dispatch</span>
                </div>
                <div className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                  <FileCheck2 className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>EDI & ASN Barcoding</span>
                </div>
                <div className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                  <PhoneCall className="w-4 h-4 text-indigo-600 shrink-0" />
                  <span>Dedicated Logistics Hotline</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 flex flex-col gap-3 justify-center">
              <button
                onClick={onOpenRfq}
                className="w-full py-3 px-4 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer shadow-xs"
              >
                <span>Request Custom LTL Freight Quote</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={onOpenQuickOrder}
                className="w-full py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-semibold transition text-center cursor-pointer border border-slate-200"
              >
                Fast Order Multiple SKUs / CSV
              </button>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
