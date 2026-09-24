import React, { useState } from 'react';
import { Product } from '../types';
import { X, PackageCheck, Building2, CheckCircle2 } from 'lucide-react';

interface SampleRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  initialProduct?: Product | null;
}

export const SampleRequestModal: React.FC<SampleRequestModalProps> = ({
  isOpen,
  onClose,
  products,
  initialProduct,
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

  const [selectedProductIds, setSelectedProductIds] = useState<string[]>(
    initialProduct ? [initialProduct.id] : [products[0]?.id || '']
  );

  const [company, setCompany] = useState('Apex Innovations Corp');
  const [name, setName] = useState('Jordan Lee');
  const [email, setEmail] = useState('jordan.lee@apexinnovations.com');
  const [address, setAddress] = useState('4400 Innovation Way, Suite 200, Austin, TX 78701');
  const [employeeCount, setEmployeeCount] = useState('250-1,000 Employees');
  const [notes, setNotes] = useState('Requesting sample ream of copy paper and pen sample box for facility evaluation.');
  const [submitted, setSubmitted] = useState(false);

  const toggleProduct = (id: string) => {
    if (selectedProductIds.includes(id)) {
      if (selectedProductIds.length > 1) {
        setSelectedProductIds(selectedProductIds.filter(x => x !== id));
      }
    } else {
      if (selectedProductIds.length < 3) {
        setSelectedProductIds([...selectedProductIds, id]);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-xs">
      <div 
        className="w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-200 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <PackageCheck className="w-5 h-5 text-amber-400" />
            <div>
              <h3 className="font-bold text-sm text-white">
                Request Free B2B Sample Evaluation Kit
              </h3>
              <p className="text-[11px] text-slate-300">
                Complimentary sample dispatch for corporate & institutional buyers
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <h4 className="text-base font-bold text-slate-900">
              Sample Box Dispatched to Logistics Desk
            </h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Your sample package will ship via FedEx 2-Day Priority Courier to <span className="font-medium text-slate-800">{address}</span>. Tracking will be sent to {email}.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
            {/* Products picker */}
            <div>
              <label className="block font-bold text-slate-700 mb-1.5">
                Select Up to 3 Products to Evaluate (Free Samples):
              </label>
              <div className="grid grid-cols-2 gap-2 max-h-36 overflow-y-auto p-1 border border-slate-200 rounded-lg bg-slate-50">
                {products.map((p) => {
                  const isChecked = selectedProductIds.includes(p.id);
                  return (
                    <label
                      key={p.id}
                      className={`flex items-start gap-2 p-2 rounded-md border transition cursor-pointer text-[11px] ${
                        isChecked
                          ? 'border-blue-500 bg-blue-50 font-medium text-blue-950'
                          : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleProduct(p.id)}
                        className="mt-0.5 rounded text-blue-600"
                      />
                      <span className="truncate">{p.name}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Form details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Company Name *</label>
                <input
                  type="text"
                  required
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Total Organization Employees</label>
                <select
                  value={employeeCount}
                  onChange={(e) => setEmployeeCount(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900"
                >
                  <option>50 - 249 Employees</option>
                  <option>250 - 1,000 Employees</option>
                  <option>1,000 - 5,000 Employees</option>
                  <option>5,000+ Enterprise</option>
                </select>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Procurement Contact Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Work Email *</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-medium text-slate-700 mb-1">Office Delivery Address *</label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-medium text-slate-700 mb-1">Testing Requirements / Notes</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
              <span className="text-[11px] text-slate-500 flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5 text-blue-600" />
                No credit card required. B2B accounts only.
              </span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-3 py-2 text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-700 hover:bg-blue-800 text-white font-bold rounded-lg transition shadow-xs cursor-pointer"
                >
                  Dispatch Sample Kit (FedEx 2-Day)
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
