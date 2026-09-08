import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  CreditCard,
  Search,
  ArrowRight,
  Clock,
  Truck,
  CheckCircle2,
  FileCheck,
  ShieldAlert,
  Sparkles
} from 'lucide-react';

export const ServicesPage: React.FC = () => {
  const { services, navigate } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = [
    'All',
    'Government ID',
    'Tax & Finance',
    'Health & Welfare',
    'Vehicle & Transport',
    'Social Schemes',
    'Education & Office',
    'Custom & Other'
  ];

  const filteredServices = services.filter(service => {
    const matchesSearch =
      service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.category.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === 'All' || service.category.toLowerCase() === selectedCategory.toLowerCase();

    return matchesSearch && matchesCategory && service.active;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header Banner */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-extrabold uppercase tracking-widest text-blue-600 bg-blue-50 px-3 py-1 rounded-md">
          Catalog & Services
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
          PVC Card Printing Services
        </h1>
        <p className="text-slate-600 text-sm sm:text-base">
          All identity cards are produced using 800-micron CR80 solid PVC cardstock with HD dye-sublimation thermal printing, dual-side protective overlay, and guaranteed QR scannability.
        </p>
      </div>

      {/* Search & Category Filter Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              id="search-services-input"
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search card type (e.g. Aadhaar, PAN, Voter, Driving Licence, Student ID)..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="text-xs text-slate-500 hover:text-slate-800 px-3 py-2"
            >
              Clear Search
            </button>
          )}
        </div>

        {/* Categories Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Services Grid */}
      {filteredServices.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
          <CreditCard className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">No card services found</h3>
          <p className="text-xs text-slate-500 mt-1">Try searching for a different keyword or category</p>
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('All');
            }}
            className="mt-4 text-xs font-bold text-blue-600 hover:underline"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map(service => (
            <div
              key={service.id}
              className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-start justify-between mb-3">
                  <span className="text-[11px] font-bold text-blue-800 bg-blue-50 border border-blue-100 px-2.5 py-1 rounded-md">
                    {service.category}
                  </span>
                  {service.badge && (
                    <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-emerald-600" />
                      {service.badge}
                    </span>
                  )}
                </div>

                <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                  {service.name}
                </h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  {service.description}
                </p>

                {/* Upload requirements note */}
                <div className="mt-4 p-3 rounded-xl bg-slate-50 border border-slate-100 text-[11px] text-slate-600 flex items-start gap-2">
                  <FileCheck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-slate-800">Requirement: </span>
                    {service.uploadRequirements}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{service.turnaroundTime}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Truck className="w-3.5 h-3.5 text-slate-400" />
                    <span>₹{service.deliveryCharge} Standard</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-extrabold text-slate-900">
                      ₹{service.offerPrice}
                    </span>
                    <span className="text-xs text-slate-400 line-through">₹{service.price}</span>
                  </div>
                  <span className="text-[11px] font-semibold text-emerald-600">
                    Save ₹{service.price - service.offerPrice} per card
                  </span>
                </div>

                <button
                  id={`btn-order-catalog-${service.id}`}
                  onClick={() => navigate('order', { serviceId: service.id })}
                  className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-xs group-hover:shadow-md"
                >
                  <span>Order Print</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Info notice */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 sm:p-5 flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="text-xs text-amber-900 leading-relaxed">
          <span className="font-bold">Authorized Document Printing Policy: </span>
          Reza Enterprise prints customer-provided legitimate government e-documents (e-Aadhaar, e-PAN, e-EPIC) in compliance with standard printing bureau guidelines. We never generate or tamper with identity records. Customers certify that they are the rightful owner or authorized agent for the uploaded document.
        </div>
      </div>
    </div>
  );
};
