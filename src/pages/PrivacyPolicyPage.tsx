import React from 'react';
import { ShieldCheck, ArrowLeft, Lock } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const PrivacyPolicyPage: React.FC = () => {
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
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded">
            Data Security
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
            Privacy & Document Protection Policy
          </h1>
          <p className="text-xs text-slate-500 mt-1">Strict confidentiality standards</p>
        </div>

        <div className="space-y-4 text-xs sm:text-sm text-slate-600 leading-relaxed">
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-start gap-3">
            <Lock className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <p className="text-xs text-emerald-900 leading-relaxed font-medium">
              We treat identity documents with the utmost confidentiality. Uploaded files are accessed exclusively by authorized print machine operators and are never shared, sold, or redistributed to third parties.
            </p>
          </div>

          <h3 className="font-bold text-slate-800 text-base">1. Information We Collect</h3>
          <p>
            We collect the customer&apos;s name, phone number, shipping address, and the uploaded image/PDF file strictly for processing the PVC printing order, dispatching via courier, and communicating tracking notifications.
          </p>

          <h3 className="font-bold text-slate-800 text-base">2. Automated Data Purge</h3>
          <p>
            Customer print files are retained in high-security encrypted storage only for the duration required to print and verify quality. Following order delivery confirmation, files are securely scheduled for automated deletion.
          </p>

          <h3 className="font-bold text-slate-800 text-base">3. Payment Security</h3>
          <p>
            Payments are transacted using end-to-end encrypted Unified Payments Interface (UPI) protocols. Reza Enterprise does not store debit/credit card numbers or bank credentials on our servers.
          </p>
        </div>
      </div>
    </div>
  );
};
