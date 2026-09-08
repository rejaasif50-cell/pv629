import React, { useRef } from 'react';
import { useApp } from '../context/AppContext';
import {
  Printer,
  Download,
  ArrowLeft,
  CreditCard,
  CheckCircle2,
  Clock,
  ShieldCheck
} from 'lucide-react';

export const InvoicePage: React.FC = () => {
  const { orders, selectedOrderId, settings, navigate } = useApp();
  const invoiceRef = useRef<HTMLDivElement>(null);

  const order = orders.find(o => o.orderId === selectedOrderId) || orders[0];

  if (!order) {
    return (
      <div className="max-w-xl mx-auto py-20 text-center">
        <h2 className="text-lg font-bold text-slate-800">No order selected for invoice</h2>
        <button
          onClick={() => navigate('my-orders')}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold"
        >
          Back to Orders
        </button>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      {/* Top Action Bar (hidden when printing) */}
      <div className="flex items-center justify-between print:hidden">
        <button
          onClick={() => navigate('my-orders')}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 px-3.5 py-2 rounded-xl transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to My Orders</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            id="btn-print-invoice"
            onClick={handlePrint}
            className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors shadow-xs"
          >
            <Printer className="w-4 h-4" />
            <span>Print Invoice</span>
          </button>
        </div>
      </div>

      {/* Printable Invoice Sheet */}
      <div
        ref={invoiceRef}
        className="bg-white p-8 sm:p-12 rounded-3xl border border-slate-200 shadow-sm print:shadow-none print:border-none print:p-0 space-y-8"
      >
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between pb-6 border-b-2 border-slate-900 gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold">
                <CreditCard className="w-5 h-5" />
              </div>
              <span className="text-xl font-extrabold tracking-tight text-slate-900">
                REZA ENTERPRISE
              </span>
            </div>
            <p className="text-xs font-bold text-blue-600 uppercase tracking-wider">
              PVC Card Printing Services Bureau
            </p>
            <p className="text-xs text-slate-500 max-w-sm leading-relaxed">
              {settings.address}
              <br />
              Phone: {settings.contactNumber} | Email: {settings.email}
            </p>
          </div>

          <div className="text-left sm:text-right space-y-1">
            <span className="text-xs font-bold uppercase tracking-widest text-slate-400 block">
              Tax Invoice / Bill of Supply
            </span>
            <h2 className="text-lg font-mono font-black text-slate-900">{order.orderId}</h2>
            <p className="text-xs text-slate-500">
              Date: <b>{new Date(order.createdAt).toLocaleDateString()}</b>
            </p>
            <div className="pt-1">
              <span
                className={`inline-block text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full ${
                  order.paymentStatus === 'Verified'
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-amber-100 text-amber-800'
                }`}
              >
                Payment: {order.paymentStatus}
              </span>
            </div>
          </div>
        </div>

        {/* Bill To & Dispatch info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 text-xs">
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Bill To Customer:
            </span>
            <h3 className="font-extrabold text-sm text-slate-900">{order.customerName}</h3>
            <p className="text-slate-600 leading-relaxed">{order.address}</p>
            <p className="text-slate-600">
              {order.district}, {order.state} - {order.pincode}
            </p>
            <p className="text-slate-600 font-medium">Mobile: {order.mobile}</p>
            {order.email && <p className="text-slate-600">Email: {order.email}</p>}
          </div>

          <div className="space-y-1 sm:text-right">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Shipping & Order Spec:
            </span>
            <p className="text-slate-700">
              Card Holder:{' '}
              <span className="font-bold text-slate-900">{order.cardHolderName}</span>
            </p>
            <p className="text-slate-700">
              Shipping Mode: <span className="font-semibold">{order.deliveryType}</span>
            </p>
            {order.courierName && (
              <p className="text-slate-700">
                Courier: <b>{order.courierName}</b>
              </p>
            )}
            {order.trackingNumber && (
              <p className="text-slate-700 font-mono">
                AWB Tracking: <b>{order.trackingNumber}</b>
              </p>
            )}
            {order.transactionId && (
              <p className="text-slate-700 font-mono text-[11px]">
                UPI Ref/UTR: <b>{order.transactionId}</b>
              </p>
            )}
          </div>
        </div>

        {/* Itemized Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-y-2 border-slate-800 text-slate-700 font-bold uppercase tracking-wider">
                <th className="py-3 px-2">#</th>
                <th className="py-3 px-2">Description / PVC Card Type</th>
                <th className="py-3 px-2 text-center">Qty</th>
                <th className="py-3 px-2 text-right">Unit Rate</th>
                <th className="py-3 px-2 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              <tr>
                <td className="py-4 px-2 font-mono text-slate-500">1</td>
                <td className="py-4 px-2">
                  <span className="font-bold text-slate-900 block">{order.serviceName}</span>
                  <span className="text-[11px] text-slate-500">
                    ISO CR80 800-micron solid PVC thermal printing, dual overlay lamination, QR verified.
                  </span>
                </td>
                <td className="py-4 px-2 text-center font-bold text-slate-800">{order.quantity}</td>
                <td className="py-4 px-2 text-right font-semibold">₹{order.unitPrice}</td>
                <td className="py-4 px-2 text-right font-bold text-slate-900">₹{order.subtotal}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Calculation breakdown */}
        <div className="flex justify-end pt-2">
          <div className="w-full max-w-xs space-y-2 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>Subtotal:</span>
              <span className="font-bold text-slate-900">₹{order.subtotal}</span>
            </div>

            <div className="flex justify-between text-slate-600">
              <span>Shipping & Handling:</span>
              <span className="font-bold text-slate-900">
                {order.shippingCharge === 0 ? 'FREE' : `₹${order.shippingCharge}`}
              </span>
            </div>

            {order.discount > 0 && (
              <div className="flex justify-between text-emerald-600 font-bold">
                <span>Promotional Discount:</span>
                <span>-₹{order.discount}</span>
              </div>
            )}

            <div className="pt-2 border-t-2 border-slate-900 flex justify-between items-baseline text-slate-900 font-extrabold text-sm">
              <span>Grand Total:</span>
              <span className="text-xl">₹{order.grandTotal}</span>
            </div>
            <p className="text-[10px] text-slate-400 text-right">
              Amount in words: Indian Rupees {Math.round(order.grandTotal)} Only
            </p>
          </div>
        </div>

        {/* Footer Notes */}
        <div className="pt-8 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-4 text-[11px] text-slate-500">
          <div>
            <h4 className="font-bold text-slate-700 uppercase mb-1">Terms & Conditions:</h4>
            <p className="leading-relaxed">
              1. This is a computer generated invoice for PVC card printing services rendered by Reza Enterprise.
              <br />
              2. Reprints are guaranteed within 7 days in case of any manufacturing or print clarity defect.
            </p>
          </div>
          <div className="text-left sm:text-right flex flex-col justify-end">
            <p className="font-bold text-slate-900">For Reza Enterprise PVC Print</p>
            <p className="text-slate-400 mt-6">Authorized Signatory</p>
          </div>
        </div>
      </div>
    </div>
  );
};
