import React from 'react';
import { useApp } from '../../context/AppContext';
import { OrderItem } from '../../types';
import {
  ShoppingBag,
  IndianRupee,
  Clock,
  Printer,
  CheckCircle2,
  Truck,
  AlertCircle,
  PlusCircle,
  ArrowRight,
  TrendingUp,
  FileText,
  CreditCard
} from 'lucide-react';

interface Props {
  onSelectOrder: (order: OrderItem) => void;
  onNavigateTab: (tab: 'dashboard' | 'orders' | 'services' | 'payments' | 'settings') => void;
}

export const AdminDashboardTab: React.FC<Props> = ({ onSelectOrder, onNavigateTab }) => {
  const { orders, services, navigate } = useApp();

  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((acc, o) => acc + o.grandTotal, 0);

  const pendingVerification = orders.filter(
    o => o.paymentStatus === 'Pending Verification'
  ).length;

  const inPrinting = orders.filter(
    o => o.orderStatus === 'Printing' || o.orderStatus === 'Design Processing' || o.orderStatus === 'Quality Check'
  ).length;

  const shippedOrOut = orders.filter(
    o => o.orderStatus === 'Shipped' || o.orderStatus === 'Out For Delivery'
  ).length;

  const delivered = orders.filter(o => o.orderStatus === 'Delivered').length;

  return (
    <div className="space-y-8">
      {/* Header with Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
            Operations & Analytics
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time status of PVC card printing queues, courier dispatches, and incoming UPI receipts.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => onNavigateTab('payments')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold transition-colors shadow-xs"
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Verify Payments ({pendingVerification})</span>
          </button>
          <button
            onClick={() => onNavigateTab('services')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-colors shadow-xs"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Manage Card Rates</span>
          </button>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {/* Total Orders */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase">Orders</span>
            <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 mt-2">{totalOrders}</p>
          <span className="text-[10px] text-slate-500 font-medium">All Lifetime</span>
        </div>

        {/* Revenue */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase">Total Revenue</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <IndianRupee className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-emerald-600 mt-2">₹{totalRevenue}</p>
          <span className="text-[10px] text-emerald-700 font-medium">Gross Bookings</span>
        </div>

        {/* Pending Verification */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase">Pending UTR</span>
            <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-amber-600 mt-2">{pendingVerification}</p>
          <span className="text-[10px] text-amber-700 font-medium">Needs Approval</span>
        </div>

        {/* In Printing */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase">Printing</span>
            <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Printer className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-indigo-600 mt-2">{inPrinting}</p>
          <span className="text-[10px] text-indigo-700 font-medium">On HD Presses</span>
        </div>

        {/* Shipped */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase">Shipped</span>
            <div className="w-7 h-7 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center">
              <Truck className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-sky-600 mt-2">{shippedOrOut}</p>
          <span className="text-[10px] text-sky-700 font-medium">In Courier Transit</span>
        </div>

        {/* Delivered */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase">Delivered</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-emerald-600 mt-2">{delivered}</p>
          <span className="text-[10px] text-emerald-700 font-medium">Completed</span>
        </div>
      </div>

      {/* Recent Orders Section */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900">Recent Customer Orders</h3>
            <p className="text-xs text-slate-500">Quickly inspect and update order status</p>
          </div>
          <button
            onClick={() => onNavigateTab('orders')}
            className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1"
          >
            <span>View All Orders ({orders.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 font-bold uppercase tracking-wider">
                <th className="py-3 px-3">Order ID</th>
                <th className="py-3 px-3">Customer</th>
                <th className="py-3 px-3">Card Type</th>
                <th className="py-3 px-3">Grand Total</th>
                <th className="py-3 px-3">Payment</th>
                <th className="py-3 px-3">Order Status</th>
                <th className="py-3 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {orders.slice(0, 6).map(order => (
                <tr key={order.orderId} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-3 font-mono font-bold text-blue-600">
                    {order.orderId}
                  </td>
                  <td className="py-3 px-3">
                    <span className="font-bold text-slate-900 block">{order.customerName}</span>
                    <span className="text-[11px] text-slate-400">{order.mobile}</span>
                  </td>
                  <td className="py-3 px-3 text-slate-700 font-medium">
                    {order.serviceName}
                  </td>
                  <td className="py-3 px-3 font-extrabold text-slate-900">
                    ₹{order.grandTotal}
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
                  <td className="py-3 px-3">
                    <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-800 border border-blue-100">
                      {order.orderStatus}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={() => onSelectOrder(order)}
                      className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition-colors"
                    >
                      Manage
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
