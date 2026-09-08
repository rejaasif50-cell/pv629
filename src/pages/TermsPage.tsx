import React from 'react';
import { ShieldCheck, ArrowLeft, FileText } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const TermsPage: React.FC = () => {
  const { navigate } = useApp();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <button
        onClick={() => navigate('home')}
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-800"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Home</span>
      </button>

      <div className="bg-white p-8 sm:p-12 rounded-3xl border border-slate-200 shadow-xs space-y-6">
        <div className="border-b border-slate-100 pb-4">
          <span className="text-xs font-bold uppercase tracking-widest text-blue-600 bg-blue-50 px-2.5 py-1 rounded">
            Legal
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
            Terms & Conditions
          </h1>
          <p className="text-xs text-slate-500 mt-1">Last revised: January 2026</p>
        </div>

        <div className="space-y-4 text-xs sm:text-sm text-slate-600 leading-relaxed">
          <h3 className="font-bold text-slate-800 text-base">1. Document Ownership & Legal Compliance</h3>
          <p>
            Reza Enterprise operates exclusively as an authorized physical printing and thermal lamination bureau. Customers placing orders for government-issued documents (such as e-Aadhaar, e-PAN, Voter ID, Driving Licence, or Ayushman Card) must certify that they are the genuine holder of the record or an authorized representative. Reza Enterprise strictly prohibits creating, fabricating, falsifying, or altering any official identity credential.
          </p>

          <h3 className="font-bold text-slate-800 text-base">2. Order Processing & Payments</h3>
          <p>
            All online orders are processed upon confirmation of payment via UPI or other electronic methods. Customers are requested to upload clear, uncropped files or PDFs with accurate resolution to ensure optical QR scannability.
          </p>

          <h3 className="font-bold text-slate-800 text-base">3. Shipping & Delivery</h3>
          <p>
            Standard shipping takes 3-5 working days; express air delivery takes 1-2 working days. We partner with reputable national couriers (Bluedart, Delhivery, Speed Post). Reza Enterprise is not liable for force majeure transit delays, incorrect shipping addresses provided by the customer, or customer unresponsiveness during courier delivery attempts.
          </p>

          <h3 className="font-bold text-slate-800 text-base">4. Replacement & Reprint Policy</h3>
          <p>
            If a card is received damaged, broken in transit, or has a printing defect attributable to machine error, we offer a 100% free reprint within 7 days of package delivery. Please reach out to our WhatsApp support team with an unboxing photo or video.
          </p>
        </div>
      </div>
    </div>
  );
};
