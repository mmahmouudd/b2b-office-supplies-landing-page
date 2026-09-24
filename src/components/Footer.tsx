import React, { useState } from 'react';
import { 
  Building2, 
  Mail, 
  PhoneCall, 
  ShieldCheck, 
  FileSpreadsheet, 
  Download, 
  CheckCircle2, 
  Truck,
  ArrowRight
} from 'lucide-react';

interface FooterProps {
  onOpenQuickOrder: () => void;
  onOpenRfq: () => void;
  onOpenSampleModal: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenQuickOrder,
  onOpenRfq,
  onOpenSampleModal,
}) => {
  const [emailSub, setEmailSub] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (emailSub) {
      setSubscribed(true);
      setTimeout(() => setSubscribed(false), 3000);
      setEmailSub('');
    }
  };

  const handleDownloadFullCatalog = () => {
    const text = `APEXOFFICE COMMERCIAL WHOLESALE FULL PRODUCT CATALOG 2025-2026\n` +
      `GSA Contract GS-02F-4919X | CAGE Code: 7Z8B2 | DUNS: 08-941-2918\n\n` +
      `Product Lines:\n` +
      `1. APX-PPR-8511-PLT: 92-Bright Multi-Purpose Copy Paper Pallet (40 Cartons / 200 Reams)\n` +
      `2. APX-CHR-MESH-PRO: ErgoMatrix Commercial Mesh Task Chair (10 Chairs / Crate)\n` +
      `3. APX-BOX-200B-1612: EcoKraft 200# Corrugated Shipping & Archive Cartons (Bundle of 100)\n` +
      `4. APX-PEN-GEL-BLK-500: ApexGlide Smooth 0.7mm Retractable Gel Pens Master Box (500 Pens)\n` +
      `5. APX-TON-58A-BULK: ApexJet High-Yield Commercial Black Toner Cartridge Lot (12 Units)\n` +
      `6. APX-WIPE-DIS-COMM: SaniClean Commercial Surface Disinfecting Wipes Pallet (48 Buckets)\n` +
      `7. APX-WRAP-80G-SKID: ApexTite Cast Pallet Stretch Film 80G (96 Rolls)\n` +
      `8. APX-COF-COL-300: ApexBrew 100% Arabica Colombian Roast Office Pods (300 Pods)\n\n` +
      `Contact enterprise@apexoffice-wholesale.com for custom volume tier pricing sheets.`;

    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ApexOffice_Wholesale_Catalog_2025.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <footer className="bg-slate-950 text-slate-300 pt-16 pb-12 border-t border-slate-800 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Top Newsletter / Price Alerts Strip */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-7">
              <span className="text-[10px] uppercase tracking-wider text-blue-400 font-bold block mb-1">
                Procurement Intelligence & Commodity Alerts
              </span>
              <h4 className="text-xl font-bold text-white">
                Receive Monthly Bulk Pulp & Paper Price Indexes
              </h4>
              <p className="text-slate-400 text-xs mt-1 max-w-xl">
                Stay ahead of freight rate fluctuations and pulp commodity price adjustments with our monthly commercial briefing.
              </p>
            </div>

            <div className="lg:col-span-5">
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <input
                  type="email"
                  required
                  placeholder="procurement.director@company.com"
                  value={emailSub}
                  onChange={(e) => setEmailSub(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition flex items-center gap-1.5 shrink-0 cursor-pointer"
                >
                  <span>Subscribe</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>
              {subscribed && (
                <p className="text-emerald-400 text-[11px] mt-2 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Subscribed! Next commodity report will arrive on the 1st.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* 4-Column Footer Navigation */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-12 border-b border-slate-800">
          
          {/* Col 1: Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-blue-700 flex items-center justify-center text-white">
                <Building2 className="w-5 h-5 text-blue-200" />
              </div>
              <div>
                <span className="text-lg font-black text-white tracking-tight">
                  Apex<span className="text-blue-500">Office</span> Wholesale
                </span>
                <p className="text-[10px] text-slate-400">
                  Commercial Office & Logistics Supplies
                </p>
              </div>
            </div>

            <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
              ApexOffice Wholesale is a premier B2B manufacturer and master distributor of high-volume office paper, ergonomic facilities furniture, packaging cartons, and commercial breakroom essentials.
            </p>

            <div className="space-y-1.5 text-[11px] text-slate-400">
              <p className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>GSA Multiple Award Schedule: GS-02F-4919X</span>
              </p>
              <p className="flex items-center gap-2">
                <Truck className="w-3.5 h-3.5 text-blue-400" />
                <span>CAGE Code: 7Z8B2 • D-U-N-S: 08-941-2918</span>
              </p>
            </div>
          </div>

          {/* Col 2: Procurement Portals */}
          <div>
            <h5 className="font-bold text-white text-xs uppercase tracking-wider mb-3">
              Procurement Tools
            </h5>
            <ul className="space-y-2 text-slate-400">
              <li>
                <button
                  onClick={onOpenQuickOrder}
                  className="hover:text-white transition flex items-center gap-1.5 cursor-pointer text-left"
                >
                  <FileSpreadsheet className="w-3 h-3 text-blue-400" />
                  <span>SKU & CSV Fast Order</span>
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenRfq}
                  className="hover:text-white transition cursor-pointer text-left"
                >
                  Submit Enterprise RFQ
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenSampleModal}
                  className="hover:text-white transition cursor-pointer text-left"
                >
                  Request Physical Sample Kit
                </button>
              </li>
              <li>
                <button
                  onClick={handleDownloadFullCatalog}
                  className="hover:text-white transition flex items-center gap-1.5 cursor-pointer text-left"
                >
                  <Download className="w-3 h-3 text-emerald-400" />
                  <span>Download Catalog (TXT/CSV)</span>
                </button>
              </li>
              <li>
                <a href="#wholesale-catalog" className="hover:text-white transition">
                  Copy Paper Pallet Matrix
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Commercial Terms & Billing */}
          <div>
            <h5 className="font-bold text-white text-xs uppercase tracking-wider mb-3">
              B2B Accounts & Credit
            </h5>
            <ul className="space-y-2 text-slate-400">
              <li>
                <button
                  onClick={onOpenRfq}
                  className="hover:text-white transition cursor-pointer text-left"
                >
                  Apply for Net 60 Terms
                </button>
              </li>
              <li>
                <a href="#wholesale-catalog" className="hover:text-white transition">
                  State Resale Exemption Upload
                </a>
              </li>
              <li>
                <a href="#wholesale-catalog" className="hover:text-white transition">
                  cXML / Coupa PunchOut Setup
                </a>
              </li>
              <li>
                <a href="#wholesale-catalog" className="hover:text-white transition">
                  ACH Remittance & Escrow
                </a>
              </li>
              <li>
                <a href="#wholesale-catalog" className="hover:text-white transition">
                  Pallet Exchange & Return Policy
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Corporate Logistics Desk */}
          <div>
            <h5 className="font-bold text-white text-xs uppercase tracking-wider mb-3">
              Commercial Desk
            </h5>
            <div className="space-y-2.5 text-slate-400">
              <div className="flex items-start gap-2">
                <PhoneCall className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block">1-800-555-APEX</strong>
                  <span className="text-[10px]">Mon - Fri, 6 AM - 7 PM CST</span>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <Mail className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block">b2b@apexoffice-wholesale.com</strong>
                  <span className="text-[10px]">Enterprise Bids & RFPs</span>
                </div>
              </div>

              <div className="pt-2 text-[11px] text-slate-500">
                Old Dominion & R+L Carriers Preferred Logistics Partner
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Legal & Compliance Strip */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500 text-[11px]">
          <div>
            © {new Date().getFullYear()} ApexOffice Wholesale LLC. All rights reserved. Commercial Wholesale Only.
          </div>

          <div className="flex items-center gap-4 flex-wrap">
            <span className="hover:text-slate-300 transition cursor-pointer">Terms of Commercial Sale</span>
            <span>•</span>
            <span className="hover:text-slate-300 transition cursor-pointer">Dock Delivery Requirements</span>
            <span>•</span>
            <span className="hover:text-slate-300 transition cursor-pointer">FSC Sustainability Statement</span>
            <span>•</span>
            <span className="hover:text-slate-300 transition cursor-pointer">EDI Specifications</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
