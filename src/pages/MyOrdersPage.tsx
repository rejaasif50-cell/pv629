import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { OrderItem } from '../types';
import {
  Package,
  Search,
  CreditCard,
  FileText,
  Clock,
  Printer,
  ChevronRight,
  ExternalLink,
  MessageCircle,
  X
} from 'lucide-react';

export const MyOrdersPage: React.FC = () => {
  const { orders, currentUser, navigate, settings } = useApp();
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<OrderItem | null>(null);

  // If logged in, filter to current user orders or show all if demo
  const userOrders = orders.filter(o => {
    if (!currentUser) return true;
    if (currentUser.role === 'admin') return true;
    return o.userId === currentUser.uid || o.email.toLowerCase() === currentUser.email.toLowerCase();
  });

  const filtered = userOrders.filter(o => {
    if (filterStatus === 'all') return true;
    if (filterStatus === 'pending') return o.orderStatus === 'Order Received' || o.orderStatus === 'Payment Pending';
    if (filterStatus === 'printing') return o.orderStatus === 'Printing' || o.orderStatus === 'Design Processing';
    if (filterStatus === 'shipped') return o.orderStatus === 'Shipped' || o.orderStatus === 'Out For Delivery';
    if (filterStatus === 'delivered') return o.orderStatus === 'Delivered';
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-extrabold uppercase tracking-widest text-blue-600 bg-blue-50 px-3 py-1 rounded-md">
            Customer Portal
          </span>
          <h1 className="text-3xl font-extrabold text-slate-900 mt-1">My Orders</h1>
          <p className="text-slate-600 text-sm">
            View printing status, track couriers, and download invoices for all your PVC cards.
          </p>
        </div>

        <button
          onClick={() => navigate('order')}
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold px-5 py-2.5 rounded-xl text-sm transition-all shadow-xs shrink-0"
        >
          <Printer className="w-4 h-4" />
          <span>New PVC Order</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
        {['all', 'pending', 'printing', 'shipped', 'delivered'].map(tab => (
          <button
            key={tab}
            onClick={() => setFilterStatus(tab)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold capitalize transition-colors ${
              filterStatus === tab
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {tab === 'all' ? 'All Orders' : tab}
          </button>
        ))}
      </div>

      {/* Orders Table */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
          <Package className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">No orders found in this category</h3>
          <p className="text-xs text-slate-500">Ready to print your high-definition PVC smart card?</p>
          <button
            onClick={() => navigate('order')}
            className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold"
          >
            Create Order Now
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                  <th className="py-3.5 px-4">Order ID</th>
                  <th className="py-3.5 px-4">Card Type</th>
                  <th className="py-3.5 px-4 text-center">Qty</th>
                  <th className="py-3.5 px-4">Amount</th>
                  <th className="py-3.5 px-4">Payment</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map(order => (
                  <tr key={order.orderId} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-blue-600">
                      {order.orderId}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-slate-900 block">{order.serviceName}</span>
                      <span className="text-[10px] text-slate-400">For: {order.cardHolderName}</span>
                    </td>
                    <td className="py-3.5 px-4 text-center font-bold text-slate-700">
                      {order.quantity}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      ₹{order.grandTotal}
                    </td>
                    <td className="py-3.5 px-4">
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
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          order.orderStatus === 'Delivered'
                            ? 'bg-emerald-100 text-emerald-800'
                            : order.orderStatus === 'Cancelled'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {order.orderStatus}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-semibold transition-colors"
                        >
                          View Details
                        </button>
                        <button
                          onClick={() => navigate('track-order', { orderId: order.orderId })}
                          className="p-1.5 text-slate-500 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                          title="Track Live"
                        >
                          <Clock className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => navigate('invoice', { orderId: order.orderId })}
                          className="p-1.5 text-slate-500 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                          title="Invoice"
                        >
                          <FileText className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Order Details Quick Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto space-y-5">
            <div className="flex items-start justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="font-mono text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                  {selectedOrder.orderId}
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-1">
                  {selectedOrder.serviceName}
                </h3>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <div>
                <span className="text-slate-400 block">Card Holder:</span>
                <span className="font-bold text-slate-800">{selectedOrder.cardHolderName}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Quantity:</span>
                <span className="font-bold text-slate-800">{selectedOrder.quantity} Card(s)</span>
              </div>
              <div>
                <span className="text-slate-400 block">Total Amount:</span>
                <span className="font-extrabold text-slate-900">₹{selectedOrder.grandTotal}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Payment Status:</span>
                <span className="font-bold text-emerald-600">{selectedOrder.paymentStatus}</span>
              </div>
            </div>

            {/* Delivery address */}
            <div className="text-xs space-y-1">
              <span className="font-bold text-slate-700 block">Delivery Address:</span>
              <p className="text-slate-600">
                {selectedOrder.address}, {selectedOrder.district}, {selectedOrder.state} -{' '}
                {selectedOrder.pincode}
              </p>
              <p className="text-slate-500">Contact: {selectedOrder.mobile}</p>
            </div>

            {/* Uploaded image preview */}
            <div>
              <span className="font-bold text-xs text-slate-700 block mb-2">Uploaded Document:</span>
              <div className="flex gap-3">
                {selectedOrder.frontImageUrl && (
                  <div className="border border-slate-200 rounded-xl p-2 bg-slate-50 text-center">
                    {selectedOrder.frontImageUrl.startsWith('data:image') ? (
                      <img
                        src={selectedOrder.frontImageUrl}
                        alt="Front"
                        className="w-24 h-16 object-cover rounded-lg mb-1"
                      />
                    ) : (
                      <FileText className="w-8 h-8 text-blue-600 mx-auto my-3" />
                    )}
                    <span className="text-[10px] text-slate-500 font-semibold truncate block max-w-[100px]">
                      {selectedOrder.frontImageName || 'Front File'}
                    </span>
                  </div>
                )}
                {selectedOrder.backImageUrl && (
                  <div className="border border-slate-200 rounded-xl p-2 bg-slate-50 text-center">
                    {selectedOrder.backImageUrl.startsWith('data:image') ? (
                      <img
                        src={selectedOrder.backImageUrl}
                        alt="Back"
                        className="w-24 h-16 object-cover rounded-lg mb-1"
                      />
                    ) : (
                      <FileText className="w-8 h-8 text-blue-600 mx-auto my-3" />
                    )}
                    <span className="text-[10px] text-slate-500 font-semibold truncate block max-w-[100px]">
                      {selectedOrder.backImageName || 'Back File'}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    navigate('invoice', { orderId: selectedOrder.orderId });
                    setSelectedOrder(null);
                  }}
                  className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold"
                >
                  Print Invoice
                </button>
                <button
                  onClick={() => {
                    navigate('track-order', { orderId: selectedOrder.orderId });
                    setSelectedOrder(null);
                  }}
                  className="px-4 py-2 bg-blue-50 text-blue-700 rounded-xl text-xs font-bold"
                >
                  Track Courier
                </button>
              </div>

              {selectedOrder.paymentStatus === 'Pending Verification' && (
                <button
                  onClick={() => {
                    navigate('payment', { orderId: selectedOrder.orderId });
                    setSelectedOrder(null);
                  }}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold"
                >
                  Pay via UPI
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
