import React from 'react';
import { 
  Truck, 
  ShieldCheck, 
  Network, 
  Award, 
  FileCheck2, 
  Star, 
  Clock, 
  MapPin, 
  CheckCircle2,
  TrendingUp,
  Cpu
} from 'lucide-react';

export const TrustAndLogistics: React.FC = () => {
  const hubs = [
    { city: 'Chicago Central Hub', state: 'IL', sqft: '450,000 sq ft', coverage: 'Midwest & Great Lakes' },
    { city: 'Dallas Logistics Center', state: 'TX', sqft: '380,000 sq ft', coverage: 'South & Gulf Coast' },
    { city: 'Atlanta Distribution Gateway', state: 'GA', sqft: '320,000 sq ft', coverage: 'Southeast & Mid-Atlantic' },
    { city: 'Reno Pacific Fulfillment', state: 'NV', sqft: '300,000 sq ft', coverage: 'West Coast & Mountain' },
  ];

  const erpIntegrations = [
    { name: 'SAP Ariba', desc: 'PunchOut cXML Level 2' },
    { name: 'Coupa Procurement', desc: 'Direct PO & Contract Invoicing' },
    { name: 'Oracle Fusion', desc: 'Automated ASN & Dispatch' },
    { name: 'Jaggaer Enterprise', desc: 'Higher Ed & State Contracts' },
    { name: 'Workday Financials', desc: 'Expense & Accounting Sync' },
    { name: 'Unimarket', desc: 'Education Consortium PunchOut' },
  ];

  const testimonials = [
    {
      quote:
        "Consolidating our copy paper pallets and ergonomic seating through Apex Wholesale reduced our nationwide facility operating costs by 34%. Their pallet tracking and Net 45 terms make reconciliation painless.",
      author: 'Marcus Holloway',
      role: 'VP of Global Facilities & Real Estate',
      company: 'OmniCorp Tech Solutions',
      spend: '$180k/yr spend',
    },
    {
      quote:
        "When our university district needed 800 ANSI/BIFMA mesh task chairs and 25 pallets of paper for fall semester, Apex delivered directly to 6 school loading docks with zero freight damage.",
      author: 'Dr. Evelyn Sterling',
      role: 'Director of Central Procurement',
      company: 'Metro Unified School District',
      spend: '$320k contract',
    },
    {
      quote:
        "The PunchOut integration with our Coupa ERP was live in 3 days. Our 42 regional branch managers can order their pre-approved SKU lots with instant PO authorization.",
      author: 'Derek Lindqvist',
      role: 'Head of Strategic Sourcing',
      company: 'Vanguard Logistics Group',
      spend: 'Fortune 500 Fleet',
    },
  ];

  return (
    <section className="py-16 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-16">
        
        {/* Logistics & Nationwide Distribution Hubs */}
        <div>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <div className="flex items-center gap-1.5 text-blue-700 text-xs font-bold uppercase tracking-wider mb-1">
                <Truck className="w-4 h-4" />
                <span>Supply Chain Infrastructure</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                4 Strategic Distribution Hubs • 48-Hour Continental Reach
              </h3>
              <p className="text-sm text-slate-500 mt-1">
                Over 1.45 million square feet of high-density pallet racking strategically positioned along major interstate freight corridors.
              </p>
            </div>

            <div className="flex items-center gap-4 text-xs font-semibold text-slate-700 shrink-0">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>99.8% On-Time Dock Dispatch</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-blue-600" />
                <span>2 PM Same-Day LTL Cutoff</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {hubs.map((hub, idx) => (
              <div
                key={idx}
                className="bg-slate-50 border border-slate-200 rounded-xl p-4 hover:border-blue-400 hover:shadow-sm transition group"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-white text-slate-600 border border-slate-200">
                    Active Hub
                  </span>
                </div>
                <h4 className="font-bold text-slate-900 text-sm group-hover:text-blue-700 transition">
                  {hub.city}
                </h4>
                <div className="mt-2 text-xs text-slate-500 space-y-1">
                  <p>Facility Capacity: <strong className="text-slate-800">{hub.sqft}</strong></p>
                  <p>Serving: <span className="text-slate-700 font-medium">{hub.coverage}</span></p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ERP & PunchOut Readiness */}
        <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-5 space-y-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold uppercase tracking-wider">
                <Cpu className="w-3.5 h-3.5 text-sky-400" />
                <span>Enterprise PunchOut & EDI</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
                Plug Directly Into Your Corporate E-Procurement ERP
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Empower department requisitioners to browse contracted catalog pricing directly from within your company's procurement system. Automated PO generation, cXML invoicing, and advance shipping notices (ASN).
              </p>
              
              <div className="pt-2 flex flex-wrap gap-4 text-xs font-medium text-slate-300">
                <div className="flex items-center gap-1.5">
                  <FileCheck2 className="w-4 h-4 text-emerald-400" />
                  <span>cXML & OCI Compliant</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Network className="w-4 h-4 text-sky-400" />
                  <span>EDI 850, 810, 856 Protocols</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {erpIntegrations.map((erp, idx) => (
                  <div
                    key={idx}
                    className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-3.5 text-center hover:bg-slate-800 transition"
                  >
                    <p className="text-xs font-bold text-white mb-0.5">{erp.name}</p>
                    <p className="text-[10px] text-slate-400">{erp.desc}</p>
                    <span className="inline-block mt-2 text-[9px] font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/20">
                      Certified
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Customer Proof & Procurement Reviews */}
        <div>
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-blue-700 text-xs font-bold uppercase tracking-wider">
              Procurement Officer Testimonials
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
              Proven Across 4,200+ Enterprise Facilities
            </h3>
            <p className="text-sm text-slate-500 mt-1">
              Read how facility directors and corporate buyers optimize their bulk office supply spend with Apex.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, idx) => (
              <div
                key={idx}
                className="bg-slate-50 border border-slate-200 rounded-2xl p-6 flex flex-col justify-between hover:shadow-md transition"
              >
                <div>
                  <div className="flex items-center gap-1 text-amber-400 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-xs sm:text-sm text-slate-700 italic leading-relaxed">
                    "{t.quote}"
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-200">
                  <h5 className="font-bold text-slate-900 text-xs">{t.author}</h5>
                  <p className="text-[11px] text-slate-500">{t.role}</p>
                  <div className="flex items-center justify-between mt-1 text-[10px]">
                    <span className="font-semibold text-blue-700">{t.company}</span>
                    <span className="font-mono text-slate-400 font-bold">{t.spend}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Industry Certifications Strip */}
        <div className="pt-6 border-t border-slate-200 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div className="p-3">
            <Award className="w-6 h-6 text-emerald-600 mx-auto mb-1" />
            <h5 className="text-xs font-bold text-slate-900">EcoVadis Gold 2025</h5>
            <p className="text-[10px] text-slate-500">Top 5% Sustainable Procurement</p>
          </div>
          <div className="p-3">
            <ShieldCheck className="w-6 h-6 text-blue-600 mx-auto mb-1" />
            <h5 className="text-xs font-bold text-slate-900">ISO 9001:2015</h5>
            <p className="text-[10px] text-slate-500">Certified Quality Management</p>
          </div>
          <div className="p-3">
            <FileCheck2 className="w-6 h-6 text-indigo-600 mx-auto mb-1" />
            <h5 className="text-xs font-bold text-slate-900">GSA Schedule 71</h5>
            <p className="text-[10px] text-slate-500">Government Contract Approved</p>
          </div>
          <div className="p-3">
            <TrendingUp className="w-6 h-6 text-sky-600 mx-auto mb-1" />
            <h5 className="text-xs font-bold text-slate-900">FSC® Chain-of-Custody</h5>
            <p className="text-[10px] text-slate-500">100% Sustainable Paper Sourcing</p>
          </div>
        </div>

      </div>
    </section>
  );
};
