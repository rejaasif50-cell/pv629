import React from 'react';
import { useApp } from '../context/AppContext';
import {
  ShieldCheck,
  Award,
  Truck,
  Printer,
  Users,
  CheckCircle2,
  Clock,
  Zap,
  MapPin,
  Phone,
  Mail
} from 'lucide-react';

export const AboutPage: React.FC = () => {
  const { navigate } = useApp();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-extrabold uppercase tracking-widest text-blue-600 bg-blue-50 px-3 py-1 rounded-md">
          About Our Bureau
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
          Reza Enterprise PVC Print
        </h1>
        <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
          India&apos;s trusted online PVC card printing destination. Transforming digital identity documents, e-Aadhaars, voter cards, and institutional IDs into military-grade, waterproof solid plastic smart cards.
        </p>
      </div>

      {/* Story & Vision */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        <div className="space-y-4 text-slate-600 text-sm leading-relaxed">
          <h2 className="text-2xl font-extrabold text-slate-900">
            Precision Printing Technology Engineered for Durability
          </h2>
          <p>
            Founded with a passion for quality and digital accessibility, <b>Reza Enterprise</b> serves thousands of citizens, cyber cafes, schools, colleges, and corporations across India.
          </p>
          <p>
            Unlike regular paper-laminated cards that fray, fade, or tear in moisture, our cards are manufactured strictly on <b>CR80 standard solid Polyvinyl Chloride (PVC)</b> using thermal re-transfer technology at 300 DPI resolution.
          </p>
          <div className="space-y-2 pt-2">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="font-semibold text-slate-800">100% Waterproof, scratch-resistant & bend-proof</span>
            </div>
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="font-semibold text-slate-800">Guaranteed optical QR code & barcode scannability</span>
            </div>
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="font-semibold text-slate-800">Strict data privacy & immediate post-print file purge</span>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-600 to-indigo-900 rounded-3xl p-8 text-white shadow-xl space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center">
              <Award className="w-6 h-6 text-amber-300" />
            </div>
            <div>
              <h3 className="font-bold text-lg">ISO 7810 CR80 Standard</h3>
              <p className="text-xs text-blue-200">Standard Wallet / Credit Card Dimensions</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="bg-white/10 p-4 rounded-xl">
              <span className="text-blue-200 block">Thickness:</span>
              <span className="font-mono text-lg font-bold">800 Microns</span>
            </div>
            <div className="bg-white/10 p-4 rounded-xl">
              <span className="text-blue-200 block">Print Resolution:</span>
              <span className="font-mono text-lg font-bold">300 DPI HD</span>
            </div>
            <div className="bg-white/10 p-4 rounded-xl">
              <span className="text-blue-200 block">Coating:</span>
              <span className="font-mono text-lg font-bold">Dual UV Overlay</span>
            </div>
            <div className="bg-white/10 p-4 rounded-xl">
              <span className="text-blue-200 block">Durability:</span>
              <span className="font-mono text-lg font-bold">5+ Years Life</span>
            </div>
          </div>

          <button
            onClick={() => navigate('order')}
            className="w-full bg-white text-blue-900 hover:bg-blue-50 font-extrabold py-3 rounded-xl text-xs transition-colors shadow-sm"
          >
            Order Your Card Now
          </button>
        </div>
      </div>

      {/* 4 Pillars */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <Printer className="w-8 h-8 text-blue-600 mb-2" />
          <h4 className="font-bold text-sm text-slate-900">Industrial HD Printers</h4>
          <p className="text-xs text-slate-500 leading-relaxed">
            Japanese thermal dye-sublimation presses delivering sharp microscopic text and rich saturated colors.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <Truck className="w-8 h-8 text-emerald-600 mb-2" />
          <h4 className="font-bold text-sm text-slate-900">Pan-India Courier</h4>
          <p className="text-xs text-slate-500 leading-relaxed">
            Partnered with Bluedart, Delhivery and India Post Speed Post reaching 28,000+ pin codes.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <ShieldCheck className="w-8 h-8 text-indigo-600 mb-2" />
          <h4 className="font-bold text-sm text-slate-900">100% Privacy Protected</h4>
          <p className="text-xs text-slate-500 leading-relaxed">
            Uploaded e-cards are used strictly for printing and permanently shredded from active storage after dispatch.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <Clock className="w-8 h-8 text-amber-600 mb-2" />
          <h4 className="font-bold text-sm text-slate-900">Rapid 24-48h Dispatch</h4>
          <p className="text-xs text-slate-500 leading-relaxed">
            Most single card orders placed before 2:00 PM are printed, laminated, and handed to the courier the same day.
          </p>
        </div>
      </div>
    </div>
  );
};
