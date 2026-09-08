import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Package,
  Clock,
  Printer,
  Truck,
  CheckCircle2,
  User,
  PlusCircle,
  Search,
  MessageCircle,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

export const CustomerDashboard: React.FC = () => {
  const { currentUser, orders, navigate, settings } = useApp();

  const userOrders = orders.filter(o => {
    if (!currentUser) return true;
    if (currentUser.role === 'admin') return true;
    return o.userId === currentUser.uid || o.email.toLowerCase() === currentUser.email.toLowerCase();
  });

  const totalCount = userOrders.length;
  const pendingCount = userOrders.filter(
    o => o.orderStatus === 'Order Received' || o.orderStatus === 'Payment Pending'
  ).length;
  const printingCount = userOrders.filter(
    o => o.orderStatus === 'Printing' || o.orderStatus === 'Design Processing' || o.orderStatus === 'Quality Check'
  ).length;
  const shippedCount = userOrders.filter(
    o => o.orderStatus === 'Shipped' || o.orderStatus === 'Out For Delivery'
  ).length;
  const deliveredCount = userOrders.filter(o => o.orderStatus === 'Delivered').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-800 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full text-xs font-semibold">
            <User className="w-3.5 h-3.5 text-blue-200" />
            <span>Customer Dashboard</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black">
            Welcome back, {currentUser?.name || 'Valued Customer'}!
          </h1>
          <p className="text-xs sm:text-sm text-blue-100">
            Registered: {currentUser?.email || 'Guest User'} | Mobile: {currentUser?.mobile || 'Verified'}
          </p>
        </div>

        <div className="flex flex-wrap gap-2.5 shrink-0">
          <button
            onClick={() => navigate('order')}
            className="inline-flex items-center gap-1.5 bg-white hover:bg-blue-50 text-blue-900 font-extrabold px-4 py-2.5 rounded-xl text-xs transition-colors shadow-sm"
          >
            <PlusCircle className="w-4 h-4 text-blue-600" />
            <span>New PVC Order</span>
          </button>
          <button
            onClick={() => navigate('track-order')}
            className="inline-flex items-center gap-1.5 bg-white/20 hover:bg-white/30 text-white font-bold px-4 py-2.5 rounded-xl text-xs transition-colors"
          >
            <Search className="w-4 h-4" />
            <span>Track Order</span>
          </button>
        </div>
      </div>

      {/* 5 Status Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {/* Total */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase">Total Orders</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 mt-2">{totalCount}</p>
          <span className="text-[10px] text-slate-400">All lifetime orders</span>
        </div>

        {/* Pending */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase">Pending</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-amber-600 mt-2">{pendingCount}</p>
          <span className="text-[10px] text-slate-400">Awaiting payment / review</span>
        </div>

        {/* Printing */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase">Printing</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Printer className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-indigo-600 mt-2">{printingCount}</p>
          <span className="text-[10px] text-slate-400">On HD printing press</span>
        </div>

        {/* Shipped */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase">Shipped</span>
            <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center">
              <Truck className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-sky-600 mt-2">{shippedCount}</p>
          <span className="text-[10px] text-slate-400">In courier transit</span>
        </div>

        {/* Delivered */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase">Delivered</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-emerald-600 mt-2">{deliveredCount}</p>
          <span className="text-[10px] text-slate-400">Completed shipments</span>
        </div>
      </div>

      {/* Recent Orders Section */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900">Recent PVC Card Orders</h3>
            <p className="text-xs text-slate-500">Track and manage your recent prints</p>
          </div>
          <button
            onClick={() => navigate('my-orders')}
            className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1"
          >
            <span>View All Orders</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {userOrders.length === 0 ? (
          <div className="text-center py-8 text-slate-400 text-xs">
            No orders found. Click &ldquo;New PVC Order&rdquo; to begin!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase">
                  <th className="py-2.5 px-3">Order ID</th>
                  <th className="py-2.5 px-3">Card Service</th>
                  <th className="py-2.5 px-3">Amount</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {userOrders.slice(0, 5).map(order => (
                  <tr key={order.orderId} className="hover:bg-slate-50/60">
                    <td className="py-3 px-3 font-mono font-bold text-blue-600">
                      {order.orderId}
                    </td>
                    <td className="py-3 px-3 font-semibold text-slate-800">
                      {order.serviceName}
                    </td>
                    <td className="py-3 px-3 font-bold text-slate-900">₹{order.grandTotal}</td>
                    <td className="py-3 px-3">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          order.orderStatus === 'Delivered'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {order.orderStatus}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-400">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => navigate('track-order', { orderId: order.orderId })}
                        className="text-xs font-bold text-blue-600 hover:underline"
                      >
                        Track
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Support help card */}
      <div className="bg-slate-100 p-6 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center">
            <MessageCircle className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-xs text-slate-900">Direct WhatsApp Assistance</h4>
            <p className="text-[11px] text-slate-500">Need to change an address or send a new PDF?</p>
          </div>
        </div>
        <a
          href={`https://wa.me/${settings.whatsappNumber.replace(/[^0-9]/g, '')}?text=Hello%20Reza%20Enterprise,%20I%20am%20logged%20in%20and%20need%20assistance.`}
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs transition-colors"
        >
          Message on WhatsApp
        </a>
      </div>
    </div>
  );
};
