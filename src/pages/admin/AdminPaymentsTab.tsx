import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { OrderItem } from '../../types';
import {
  QrCode,
  CheckCircle2,
  XCircle,
  Eye,
  Clock,
  ExternalLink,
  ShieldCheck,
  Search,
  X
} from 'lucide-react';

export const AdminPaymentsTab: React.FC = () => {
  const { orders, updatePaymentStatus, updateOrderStatus, showToast } = useApp();

  const [filterView, setFilterView] = useState<'pending' | 'verified' | 'all'>('pending');
  const [selectedScreenshot, setSelectedScreenshot] = useState<string | null>(null);

  const pendingPayments = orders.filter(o => o.paymentStatus === 'Pending Verification');
  const verifiedPayments = orders.filter(o => o.paymentStatus === 'Verified');

  const displayedOrders = orders.filter(o => {
    if (filterView === 'pending') return o.paymentStatus === 'Pending Verification';
    if (filterView === 'verified') return o.paymentStatus === 'Verified';
    return true;
  });

  const handleApprovePayment = (order: OrderItem) => {
    updatePaymentStatus(order.orderId, 'Verified');
    // If order was in received or pending, advance to Printing
    if (order.orderStatus === 'Order Received' || order.orderStatus === 'Payment Pending') {
      updateOrderStatus(order.orderId, 'Printing');
    }
    showToast(`Payment for ${order.orderId} approved & verified!`, 'success');
  };

  const handleRejectPayment = (order: OrderItem) => {
    const reason = prompt('Enter rejection reason (e.g. UTR not matched in bank):');
    if (reason !== null) {
      updatePaymentStatus(order.orderId, 'Rejected');
      updateOrderStatus(order.orderId, 'Payment Pending', {
        adminNotes: `Payment rejected: ${reason}`
      });
      showToast(`Payment for ${order.orderId} marked as Rejected.`, 'info');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900">UPI Payment Verifications</h1>
          <p className="text-xs text-slate-500">
            Verify 12-digit UTR numbers and payment screenshots submitted by customers.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilterView('pending')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
              filterView === 'pending'
                ? 'bg-amber-500 text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            Pending Review ({pendingPayments.length})
          </button>
          <button
            onClick={() => setFilterView('verified')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
              filterView === 'verified'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            Verified ({verifiedPayments.length})
          </button>
          <button
            onClick={() => setFilterView('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
              filterView === 'all'
                ? 'bg-slate-900 text-white'
                : 'bg-white text-slate-600 border border-slate-200'
            }`}
          >
            All
          </button>
        </div>
      </div>

      {displayedOrders.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
          <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">All caught up!</h3>
          <p className="text-xs text-slate-500">
            There are no {filterView} payments requiring manual review at this time.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                  <th className="py-3 px-3">Order ID</th>
                  <th className="py-3 px-3">Customer</th>
                  <th className="py-3 px-3">Amount</th>
                  <th className="py-3 px-3">UPI UTR / Trans ID</th>
                  <th className="py-3 px-3">Screenshot</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3 text-right">Verification Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {displayedOrders.map(order => (
                  <tr key={order.orderId} className="hover:bg-slate-50/70">
                    <td className="py-3 px-3 font-mono font-bold text-blue-600">
                      {order.orderId}
                    </td>
                    <td className="py-3 px-3">
                      <span className="font-bold text-slate-900 block">{order.customerName}</span>
                      <span className="text-[11px] text-slate-400">{order.mobile}</span>
                    </td>
                    <td className="py-3 px-3 font-black text-slate-900 text-sm">
                      ₹{order.grandTotal}
                    </td>
                    <td className="py-3 px-3">
                      {order.transactionId ? (
                        <span className="font-mono font-bold text-slate-800 bg-slate-100 px-2 py-1 rounded text-xs">
                          {order.transactionId}
                        </span>
                      ) : (
                        <span className="text-slate-400 italic">Not submitted</span>
                      )}
                    </td>
                    <td className="py-3 px-3">
                      {order.paymentScreenshotUrl ? (
                        <button
                          onClick={() => setSelectedScreenshot(order.paymentScreenshotUrl!)}
                          className="flex items-center gap-1.5 text-blue-600 hover:text-blue-800 font-semibold"
                        >
                          <img
                            src={order.paymentScreenshotUrl}
                            alt="Receipt"
                            className="w-8 h-8 object-cover rounded border border-blue-200"
                          />
                          <span>View Proof</span>
                        </button>
                      ) : (
                        <span className="text-slate-400 text-[11px]">No image</span>
                      )}
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          order.paymentStatus === 'Verified'
                            ? 'bg-emerald-100 text-emerald-800'
                            : order.paymentStatus === 'Rejected'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {order.paymentStatus}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {order.paymentStatus !== 'Verified' && (
                          <button
                            onClick={() => handleApprovePayment(order)}
                            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold text-xs flex items-center gap-1 shadow-2xs"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Approve</span>
                          </button>
                        )}
                        {order.paymentStatus !== 'Rejected' && (
                          <button
                            onClick={() => handleRejectPayment(order)}
                            className="px-2.5 py-1.5 bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-700 rounded-lg font-semibold text-xs transition-colors"
                          >
                            Reject
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Screenshot Lightbox */}
      {selectedScreenshot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-4 shadow-2xl space-y-3">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <span className="text-xs font-bold text-slate-800">UPI Payment Proof</span>
              <button
                onClick={() => setSelectedScreenshot(null)}
                className="p-1 text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <img
              src={selectedScreenshot}
              alt="Payment screenshot"
              className="w-full max-h-[70vh] object-contain rounded-xl"
            />
          </div>
        </div>
      )}
    </div>
  );
};
