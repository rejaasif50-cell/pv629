import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  CreditCard,
  CheckCircle2,
  Truck,
  Sparkles,
  Calculator,
  ArrowRight,
  ShieldCheck,
  Award
} from 'lucide-react';

export const PricingPage: React.FC = () => {
  const { services, settings, navigate } = useApp();

  const [calcServiceId, setCalcServiceId] = useState(services[0]?.id || '');
  const [calcQuantity, setCalcQuantity] = useState(3);

  const selectedCalcService = services.find(s => s.id === calcServiceId) || services[0];
  const unitPrice = selectedCalcService ? selectedCalcService.offerPrice : 69;

  // Bulk tier discount calculation
  let bulkDiscountPercent = 0;
  if (calcQuantity >= 50) bulkDiscountPercent = 30;
  else if (calcQuantity >= 20) bulkDiscountPercent = 20;
  else if (calcQuantity >= 10) bulkDiscountPercent = 15;
  else if (calcQuantity >= 5) bulkDiscountPercent = 10;

  const rawSubtotal = unitPrice * calcQuantity;
  const bulkDiscountAmount = Math.round((rawSubtotal * bulkDiscountPercent) / 100);
  const discountedSubtotal = rawSubtotal - bulkDiscountAmount;
  const isFreeDelivery = discountedSubtotal >= settings.freeShippingThreshold;
  const deliveryFee = isFreeDelivery ? 0 : settings.standardDeliveryCharge;
  const estimatedTotal = discountedSubtotal + deliveryFee;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-extrabold uppercase tracking-widest text-blue-600 bg-blue-50 px-3 py-1 rounded-md">
          Transparent Rates
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
          Simple, Affordable PVC Card Pricing
        </h1>
        <p className="text-slate-600 text-sm sm:text-base">
          No hidden fees. Premium Japanese thermal dye-sublimation print on 800-micron solid PVC with protective overlay included in all prices.
        </p>
      </div>

      {/* Tier Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Tier 1: Single & Retail */}
        <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between">
          <div>
            <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full uppercase">
              Individual Order
            </span>
            <h3 className="text-xl font-bold text-slate-900 mt-4">Retail & Family Cards</h3>
            <p className="text-xs text-slate-500 mt-1">1 to 4 Cards</p>

            <div className="mt-6 flex items-baseline gap-1">
              <span className="text-4xl font-extrabold text-slate-900">₹49 - ₹79</span>
              <span className="text-xs text-slate-400">/ card</span>
            </div>

            <ul className="mt-6 space-y-3 text-xs text-slate-600">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>800 Micron Solid CR80 PVC</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>300 DPI High-Definition Print</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>100% Scannable QR Codes</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>24-48 Hours Dispatch</span>
              </li>
              <li className="flex items-center gap-2 text-slate-400">
                <Truck className="w-4 h-4 text-slate-400 shrink-0" />
                <span>Standard Delivery ₹40 (Free &gt; ₹499)</span>
              </li>
            </ul>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-100">
            <button
              onClick={() => navigate('order')}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 rounded-xl text-xs transition-colors"
            >
              Order 1-4 Cards
            </button>
          </div>
        </div>

        {/* Tier 2: Popular Group / Small Batch */}
        <div className="bg-gradient-to-b from-blue-900 to-indigo-950 text-white rounded-3xl p-8 shadow-xl flex flex-col justify-between relative transform md:-translate-y-2">
          <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-amber-400 text-slate-950 text-[11px] font-extrabold px-4 py-1 rounded-full uppercase tracking-wider shadow-md">
            Most Popular Choice
          </div>

          <div>
            <span className="text-xs font-bold text-blue-200 bg-white/10 px-3 py-1 rounded-full uppercase">
              Family & Small Office
            </span>
            <h3 className="text-xl font-bold mt-4">Batch Pack Discount</h3>
            <p className="text-xs text-blue-200 mt-1">5 to 19 Cards</p>

            <div className="mt-6 flex items-baseline gap-1">
              <span className="text-4xl font-extrabold text-amber-300">10% - 15%</span>
              <span className="text-xs text-blue-200">OFF Total</span>
            </div>

            <ul className="mt-6 space-y-3 text-xs text-blue-100">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="font-bold">FREE Express Doorstep Shipping</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Mix & Match different card types</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Priority Printing Queue</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Free Lamination Protection</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                <span>WhatsApp Dedicated Proof Approval</span>
              </li>
            </ul>
          </div>

          <div className="mt-8 pt-6 border-t border-white/15">
            <button
              onClick={() => navigate('order')}
              className="w-full bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold py-3 rounded-xl text-xs transition-colors shadow-md"
            >
              Order Batch with Free Delivery
            </button>
          </div>
        </div>

        {/* Tier 3: Institutional / Schools / Bulk */}
        <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between">
          <div>
            <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full uppercase">
              Institutions & Bulk
            </span>
            <h3 className="text-xl font-bold text-slate-900 mt-4">Corporate & Schools</h3>
            <p className="text-xs text-slate-500 mt-1">20+ to 1,000+ Cards</p>

            <div className="mt-6 flex items-baseline gap-1">
              <span className="text-4xl font-extrabold text-slate-900">₹29 - ₹39</span>
              <span className="text-xs text-slate-400">/ card in bulk</span>
            </div>

            <ul className="mt-6 space-y-3 text-xs text-slate-600">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Up to 30% Wholesale Discount</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Custom Lanyards & Card Holders option</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Excel Spreadsheet Bulk Upload</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>GST Commercial Tax Invoice</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Dedicated Account Manager</span>
              </li>
            </ul>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-100">
            <button
              onClick={() => navigate('contact')}
              className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold py-3 rounded-xl text-xs transition-colors"
            >
              Contact for Custom Bulk Quote
            </button>
          </div>
        </div>
      </div>

      {/* Interactive Price Calculator Widget */}
      <div className="bg-slate-50 p-6 sm:p-8 rounded-3xl border border-slate-200 max-w-4xl mx-auto shadow-sm">
        <div className="flex items-center gap-2 text-blue-600 mb-2">
          <Calculator className="w-5 h-5" />
          <span className="text-xs font-bold uppercase tracking-wider">Live Price Estimator</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 mb-6">
          Calculate Your Exact Order Cost
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          <div className="md:col-span-7 space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Choose Card Service:
              </label>
              <select
                value={calcServiceId}
                onChange={e => setCalcServiceId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium bg-white"
              >
                {services.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.name} (Base Price: ₹{s.offerPrice})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-bold text-slate-700">Quantity of Cards:</label>
                <span className="text-xs font-mono font-bold text-blue-600">{calcQuantity} cards</span>
              </div>
              <input
                type="range"
                min="1"
                max="50"
                value={calcQuantity}
                onChange={e => setCalcQuantity(parseInt(e.target.value) || 1)}
                className="w-full accent-blue-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>1 card</span>
                <span>10 cards (15% off)</span>
                <span>20 cards (20% off)</span>
                <span>50 cards (30% off)</span>
              </div>
            </div>
          </div>

          <div className="md:col-span-5 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>Card Printing ({calcQuantity}x ₹{unitPrice})</span>
              <span className="font-semibold text-slate-900">₹{rawSubtotal}</span>
            </div>

            {bulkDiscountAmount > 0 && (
              <div className="flex justify-between text-emerald-600 font-semibold">
                <span>Bulk Savings ({bulkDiscountPercent}%)</span>
                <span>-₹{bulkDiscountAmount}</span>
              </div>
            )}

            <div className="flex justify-between text-slate-600">
              <span>Doorstep Shipping</span>
              <span className="font-semibold text-slate-900">
                {isFreeDelivery ? (
                  <span className="text-emerald-600 font-bold">FREE</span>
                ) : (
                  `₹${settings.standardDeliveryCharge}`
                )}
              </span>
            </div>

            <div className="pt-2 border-t border-slate-100 flex justify-between items-baseline">
              <span className="font-extrabold text-sm text-slate-900">Estimated Total</span>
              <span className="text-2xl font-black text-slate-900">₹{estimatedTotal}</span>
            </div>

            <button
              onClick={() => navigate('order', { serviceId: selectedCalcService.id })}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5 mt-2"
            >
              <span>Order this Card</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Complete Card Services Price List Table */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-slate-900">All PVC Card Printing Rates</h3>
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                  <th className="py-3 px-4">Card Category</th>
                  <th className="py-3 px-4">Regular Price</th>
                  <th className="py-3 px-4">Offer Price</th>
                  <th className="py-3 px-4">Dispatch Turnaround</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {services.map(s => (
                  <tr key={s.id} className="hover:bg-slate-50/70">
                    <td className="py-3 px-4 font-bold text-slate-900">{s.name}</td>
                    <td className="py-3 px-4 text-slate-400 line-through">₹{s.price}</td>
                    <td className="py-3 px-4 font-extrabold text-slate-900 text-sm">
                      ₹{s.offerPrice}
                    </td>
                    <td className="py-3 px-4 text-slate-600">{s.turnaroundTime}</td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => navigate('order', { serviceId: s.id })}
                        className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold rounded-lg text-xs"
                      >
                        Order
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
