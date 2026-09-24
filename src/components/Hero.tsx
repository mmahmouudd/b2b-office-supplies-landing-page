import React, { useState } from 'react';
import { 
  Calculator, 
  ShieldCheck, 
  FileCheck, 
  ArrowRight, 
  Download, 
  Clock, 
  BadgePercent,
  CheckCircle,
  PackageCheck
} from 'lucide-react';
import { CLIENT_LOGOS } from '../data/products';

interface HeroProps {
  onScrollToCatalog: () => void;
  onOpenRfq: () => void;
  onOpenSampleModal: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  onScrollToCatalog,
  onOpenRfq,
  onOpenSampleModal,
}) => {
  // Live Procurement Calculator state
  const [monthlySpend, setMonthlySpend] = useState<number>(12000);
  const [officeLocations, setOfficeLocations] = useState<number>(4);
  const [primaryFocus, setPrimaryFocus] = useState<string>('mixed');

  // Calculate dynamic savings
  const annualSpend = monthlySpend * 12;
  let savingsRate = 0.26; // base 26%
  if (monthlySpend >= 25000) savingsRate = 0.38;
  else if (monthlySpend >= 10000) savingsRate = 0.32;
  else if (monthlySpend >= 5000) savingsRate = 0.28;

  if (officeLocations >= 5) savingsRate += 0.03; // multi-hub consolidation bonus

  const projectedAnnualSavings = Math.round(annualSpend * savingsRate);
  const palletFreightSavings = officeLocations * 1850;

  const handleDownloadCatalog = () => {
    // Generate dummy printable/viewable price sheet alert or prompt
    const blob = new Blob([
      `APEXOFFICE COMMERCIAL WHOLESALE PRICE MATRIX 2025-2026\n\n` +
      `GSA Contract GS-02F-4919X | ISO 9001:2015\n` +
      `Prepared for Enterprise Procurement Assessment\n\n` +
      `Category: Bulk Copy Paper Pallets (APX-PPR-8511-PLT)\n` +
      `Tier 1 (1-2 Pallets): $1,980/pallet\n` +
      `Tier 2 (3-7 Pallets): $1,740/pallet (-12%)\n` +
      `Tier 3 (8-15 Pallets): $1,520/pallet (-23%)\n` +
      `Tier 4 (16+ Pallets FTL): $1,340/pallet (-32%)\n\n` +
      `Net 30/Net 60 Invoicing Available Upon Credit Check.`
    ], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ApexOffice_Commercial_Wholesale_Price_Matrix_2025.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <section className="relative bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white overflow-hidden pt-8 pb-16 lg:pt-12 lg:pb-20">
      {/* Subtle grid pattern background */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

      {/* Ambient glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-blue-600/15 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* Left Column: B2B Value Proposition */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-400/25 text-blue-300 text-xs font-semibold tracking-wide">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>Commercial Direct Wholesale Portal</span>
              <span className="text-slate-500">•</span>
              <span className="text-blue-200">GSA Schedule Compliant</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Direct-From-Manufacturer <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-300">
                Bulk Office Supplies & Pallet Logistics
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 font-normal leading-relaxed max-w-2xl">
              Equip regional hubs, corporate headquarters, and multi-campus facilities with factory-direct pallet pricing, pre-approved Net 30/60 terms, and guaranteed 48-hour dock freight.
            </p>

            {/* Core Value Checkmarks */}
            <div className="grid grid-cols-2 gap-3 text-xs sm:text-sm text-slate-200 pt-1">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Tiered bulk savings up to <strong>48%</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Net 30/60 Invoicing & PO Billing</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Multi-location split shipments</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Free LTL freight on full pallets</span>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-3">
              <button
                onClick={onScrollToCatalog}
                className="px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-lg shadow-blue-600/30 flex items-center gap-2 transition duration-200 cursor-pointer group"
              >
                <span>Browse Bulk Pallet Catalog</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>

              <button
                onClick={handleDownloadCatalog}
                className="px-5 py-3.5 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 text-slate-200 hover:text-white border border-slate-700 font-semibold text-sm flex items-center gap-2 transition duration-200 cursor-pointer"
              >
                <Download className="w-4 h-4 text-blue-400" />
                <span>Download Wholesale Price Matrix (PDF)</span>
              </button>

              <button
                onClick={onOpenSampleModal}
                className="px-4 py-3.5 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800/50 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
              >
                <PackageCheck className="w-4 h-4 text-amber-400" />
                <span>Request Free Sample Box</span>
              </button>
            </div>

            {/* Quick Micro Badges */}
            <div className="flex flex-wrap items-center gap-6 pt-4 border-t border-slate-800 text-xs text-slate-400">
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-sky-400" />
                <span>Same-day 2:00 PM dispatch cutoff</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>FSC & ANSI/BIFMA Certified</span>
              </div>
              <div className="flex items-center gap-1.5">
                <FileCheck className="w-4 h-4 text-indigo-400" />
                <span>cXML / SAP Ariba / Coupa Ready</span>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive B2B Wholesale Savings Estimator */}
          <div className="lg:col-span-5">
            <div className="bg-slate-800/90 backdrop-blur-md rounded-2xl border border-slate-700/80 p-5 sm:p-6 shadow-2xl shadow-black/40 relative">
              <div className="flex items-center justify-between pb-4 border-b border-slate-700/60">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                    <Calculator className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white leading-tight">
                      Enterprise Spend & Savings Estimator
                    </h3>
                    <p className="text-[11px] text-slate-400">
                      Based on nationwide pallet wholesale contract rates
                    </p>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[11px] font-bold border border-emerald-500/30">
                  Live Calculator
                </span>
              </div>

              <div className="space-y-4 pt-4">
                {/* Monthly spend slider */}
                <div>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-slate-300 font-medium">Estimated Monthly Office Supplies Spend:</span>
                    <span className="font-mono font-bold text-blue-400 text-sm">
                      ${monthlySpend.toLocaleString()} / mo
                    </span>
                  </div>
                  <input
                    type="range"
                    min={2500}
                    max={50000}
                    step={1000}
                    value={monthlySpend}
                    onChange={(e) => setMonthlySpend(Number(e.target.value))}
                    className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-mono">
                    <span>$2,500</span>
                    <span>$25,000</span>
                    <span>$50,000+</span>
                  </div>
                </div>

                {/* Office locations slider */}
                <div>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-slate-300 font-medium">Number of Facilities / Office Branches:</span>
                    <span className="font-mono font-bold text-sky-400 text-sm">
                      {officeLocations} {officeLocations === 1 ? 'Location' : 'Locations'}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={1}
                    max={25}
                    step={1}
                    value={officeLocations}
                    onChange={(e) => setOfficeLocations(Number(e.target.value))}
                    className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-sky-500"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-mono">
                    <span>1 (Single Dock)</span>
                    <span>10 Facilities</span>
                    <span>25+ Enterprise Hubs</span>
                  </div>
                </div>

                {/* Primary Spend category */}
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Primary Volume Driver:
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'mixed', label: 'Full Facility Mix' },
                      { id: 'paper', label: 'Paper & Print' },
                      { id: 'packaging', label: 'Boxes & Logistics' },
                    ].map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setPrimaryFocus(item.id)}
                        className={`py-1.5 px-2 text-xs rounded-lg font-medium transition cursor-pointer text-center ${
                          primaryFocus === item.id
                            ? 'bg-blue-600 text-white font-semibold'
                            : 'bg-slate-700/60 text-slate-300 hover:bg-slate-700'
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Real-time Calculation Result Card */}
                <div className="bg-gradient-to-br from-emerald-950/60 to-slate-900 border border-emerald-500/30 rounded-xl p-4 mt-2">
                  <div className="grid grid-cols-2 gap-3 items-center">
                    <div>
                      <span className="text-[11px] uppercase tracking-wider text-emerald-400 font-semibold block">
                        Projected Annual Savings
                      </span>
                      <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono flex items-baseline gap-1">
                        ${projectedAnnualSavings.toLocaleString()}
                        <span className="text-xs text-emerald-400 font-sans font-medium">/ year</span>
                      </div>
                      <span className="text-[10px] text-slate-400">
                        (~{Math.round(savingsRate * 100)}% off retail retail list)
                      </span>
                    </div>

                    <div className="border-l border-emerald-500/20 pl-3 space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-400">Contract Tier:</span>
                        <span className="font-bold text-amber-400">
                          {monthlySpend >= 20000 ? 'Strategic 3' : monthlySpend >= 8000 ? 'Gold Tier 2' : 'Fleet Tier 1'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-400">Freight Allowance:</span>
                        <span className="font-bold text-emerald-400">100% Free Pallet</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-400">Credit Terms:</span>
                        <span className="font-semibold text-white">Net 30 / Net 60</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-emerald-500/20 flex items-center justify-between gap-2">
                    <span className="text-[11px] text-emerald-300 font-medium flex items-center gap-1">
                      <BadgePercent className="w-3.5 h-3.5" />
                      Additional pallet freight savings: +${palletFreightSavings.toLocaleString()}/yr
                    </span>
                    <button
                      onClick={onOpenRfq}
                      className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition cursor-pointer"
                    >
                      Lock In This Rate
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enterprise Client Trust Bar */}
        <div className="mt-12 pt-8 border-t border-slate-800">
          <p className="text-center text-xs font-semibold uppercase tracking-wider text-slate-400 mb-6">
            Trusted by Procurement & Facilities Directors at Leading Organizations
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 items-center justify-center">
            {CLIENT_LOGOS.map((client, idx) => (
              <div 
                key={idx} 
                className="bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50 rounded-lg py-2.5 px-3 text-center transition group"
              >
                <p className="text-xs font-bold text-slate-300 group-hover:text-white transition-colors truncate">
                  {client.name}
                </p>
                <p className="text-[10px] text-slate-500 truncate">
                  {client.domain}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
