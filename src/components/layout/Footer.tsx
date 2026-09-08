import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  CreditCard,
  Phone,
  Mail,
  MapPin,
  ShieldCheck,
  Truck,
  RotateCcw,
  Sparkles,
  Award
} from 'lucide-react';

export const Footer: React.FC = () => {
  const { navigate, settings } = useApp();

  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      {/* Top Value Badges */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-6 rounded-2xl bg-slate-800/50 border border-slate-700/60">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center shrink-0">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">300 DPI Thermal HD</h4>
              <p className="text-xs text-slate-400">Microtext clarity & official scannable QR</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">Waterproof & Durable</h4>
              <p className="text-xs text-slate-400">800 Micron solid PVC CR80 standard</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">Fast Doorstep Delivery</h4>
              <p className="text-xs text-slate-400">Tracked shipping across all India PIN codes</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center shrink-0">
              <RotateCcw className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">Reprint Guarantee</h4>
              <p className="text-xs text-slate-400">100% replacement for printing defects</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
        {/* Brand Column */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md">
              <CreditCard className="w-6 h-6" />
            </div>
            <div>
              <span className="font-extrabold text-xl text-white tracking-tight">
                REZA ENTERPRISE
              </span>
              <span className="ml-2 text-xs bg-blue-900 text-blue-300 px-2 py-0.5 rounded font-bold">
                PVC PRINT
              </span>
            </div>
          </div>
          <p className="text-sm text-slate-400 leading-relaxed pr-6">
            India&apos;s trusted online PVC card printing service bureau. Turn your e-Aadhaar, PAN, Voter ID, Driving Licence, and digital identity documents into rigid, waterproof, wallet-sized PVC smart cards.
          </p>

          <div className="pt-2 text-xs text-slate-400 space-y-2">
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-blue-400 shrink-0" />
              <span>{settings.contactNumber}</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-blue-400 shrink-0" />
              <span>{settings.email}</span>
            </div>
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
              <span>{settings.address}</span>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-white font-bold text-sm tracking-wider uppercase mb-4">
            Navigation
          </h4>
          <ul className="space-y-2.5 text-sm">
            <li>
              <button
                onClick={() => navigate('home')}
                className="hover:text-white transition-colors"
              >
                Home
              </button>
            </li>
            <li>
              <button
                onClick={() => navigate('services')}
                className="hover:text-white transition-colors"
              >
                PVC Card Services
              </button>
            </li>
            <li>
              <button
                onClick={() => navigate('order')}
                className="hover:text-white transition-colors"
              >
                Order PVC Card
              </button>
            </li>
            <li>
              <button
                onClick={() => navigate('pricing')}
                className="hover:text-white transition-colors"
              >
                Pricing Calculator
              </button>
            </li>
            <li>
              <button
                onClick={() => navigate('track-order')}
                className="hover:text-white transition-colors"
              >
                Track Order Status
              </button>
            </li>
            <li>
              <button
                onClick={() => navigate('my-orders')}
                className="hover:text-white transition-colors"
              >
                My Orders
              </button>
            </li>
            <li>
              <button
                onClick={() => navigate('dashboard')}
                className="hover:text-white transition-colors"
              >
                Customer Dashboard
              </button>
            </li>
          </ul>
        </div>

        {/* Popular Services */}
        <div>
          <h4 className="text-white font-bold text-sm tracking-wider uppercase mb-4">
            Card Categories
          </h4>
          <ul className="space-y-2.5 text-sm">
            <li>
              <button
                onClick={() => navigate('order', { serviceId: 'aadhaar-pvc' })}
                className="hover:text-white transition-colors text-left"
              >
                Aadhaar PVC Print (₹69)
              </button>
            </li>
            <li>
              <button
                onClick={() => navigate('order', { serviceId: 'pan-pvc' })}
                className="hover:text-white transition-colors text-left"
              >
                PAN Card PVC Print (₹69)
              </button>
            </li>
            <li>
              <button
                onClick={() => navigate('order', { serviceId: 'voter-pvc' })}
                className="hover:text-white transition-colors text-left"
              >
                Voter ID PVC Card (₹59)
              </button>
            </li>
            <li>
              <button
                onClick={() => navigate('order', { serviceId: 'ayushman-pvc' })}
                className="hover:text-white transition-colors text-left"
              >
                Ayushman PMJAY Card (₹59)
              </button>
            </li>
            <li>
              <button
                onClick={() => navigate('order', { serviceId: 'driving-licence-pvc' })}
                className="hover:text-white transition-colors text-left"
              >
                Driving Licence Card (₹79)
              </button>
            </li>
            <li>
              <button
                onClick={() => navigate('order', { serviceId: 'student-id-pvc' })}
                className="hover:text-white transition-colors text-left"
              >
                Student & Staff ID (₹49)
              </button>
            </li>
          </ul>
        </div>

        {/* Trust & Policies */}
        <div>
          <h4 className="text-white font-bold text-sm tracking-wider uppercase mb-4">
            Legal & Support
          </h4>
          <ul className="space-y-2.5 text-sm">
            <li>
              <button
                onClick={() => navigate('terms')}
                className="hover:text-white transition-colors"
              >
                Terms & Conditions
              </button>
            </li>
            <li>
              <button
                onClick={() => navigate('privacy')}
                className="hover:text-white transition-colors"
              >
                Privacy Policy
              </button>
            </li>
            <li>
              <button
                onClick={() => navigate('refund')}
                className="hover:text-white transition-colors"
              >
                Refund & Cancellation
              </button>
            </li>
            <li>
              <button
                onClick={() => navigate('about')}
                className="hover:text-white transition-colors"
              >
                About Us
              </button>
            </li>
            <li>
              <button
                onClick={() => navigate('contact')}
                className="hover:text-white transition-colors"
              >
                Customer Support
              </button>
            </li>
            <li className="pt-2">
              <button
                onClick={() => navigate('admin', { adminTab: 'dashboard' })}
                className="text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1 text-xs"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                Admin Portal
              </button>
            </li>
          </ul>

          <div className="mt-6 pt-4 border-t border-slate-800">
            <span className="text-[11px] text-slate-400 block mb-2 font-semibold">
              Supported Payment Modes:
            </span>
            <div className="flex flex-wrap gap-1.5 text-[10px] font-bold text-slate-300">
              <span className="bg-slate-800 px-2 py-1 rounded border border-slate-700">UPI</span>
              <span className="bg-slate-800 px-2 py-1 rounded border border-slate-700">PhonePe</span>
              <span className="bg-slate-800 px-2 py-1 rounded border border-slate-700">GPay</span>
              <span className="bg-slate-800 px-2 py-1 rounded border border-slate-700">Paytm</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
        <div>
          &copy; 2026 Reza Enterprise PVC Print. All rights reserved. Registered Indian Small Business.
        </div>
        <div className="flex items-center gap-6">
          <button onClick={() => navigate('terms')} className="hover:text-slate-300">
            Terms
          </button>
          <button onClick={() => navigate('privacy')} className="hover:text-slate-300">
            Privacy
          </button>
          <button onClick={() => navigate('refund')} className="hover:text-slate-300">
            Refunds
          </button>
          <button onClick={() => navigate('contact')} className="hover:text-slate-300">
            Helpdesk
          </button>
        </div>
      </div>
    </footer>
  );
};
