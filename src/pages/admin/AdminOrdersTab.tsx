import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { OrderItem, OrderStatus, PaymentStatus } from '../../types';
import {
  Search,
  Filter,
  Eye,
  FileText,
  Printer,
  Trash2,
  ExternalLink,
  Truck,
  CheckCircle2,
  X,
  Download,
  AlertCircle
} from 'lucide-react';

interface Props {
  selectedOrder: OrderItem | null;
  setSelectedOrder: (order: OrderItem | null) => void;
}

export const AdminOrdersTab: React.FC<Props> = ({ selectedOrder, setSelectedOrder }) => {
  const { orders, updateOrderStatus, updatePaymentStatus, deleteOrder, showToast, navigate } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterOrderStatus, setFilterOrderStatus] = useState<string>('All');
  const [filterPaymentStatus, setFilterPaymentStatus] = useState<string>('All');

  // Modal Editing State
  const [modalOrderStatus, setModalOrderStatus] = useState<OrderStatus>('Order Received');
  const [modalPaymentStatus, setModalPaymentStatus] = useState<PaymentStatus>('Pending Verification');
  const [modalCourierName, setModalCourierName] = useState('');
  const [modalTrackingNumber, setModalTrackingNumber] = useState('');
  const [modalTrackingUrl, setModalTrackingUrl] = useState('');
  const [modalDeliveryDate, setModalDeliveryDate] = useState('');
  const [modalAdminNote, setModalAdminNote] = useState('');

  // Sync modal state when order is selected
  React.useEffect(() => {
    if (selectedOrder) {
      setModalOrderStatus(selectedOrder.orderStatus);
      setModalPaymentStatus(selectedOrder.paymentStatus);
      setModalCourierName(selectedOrder.courierName || '');
      setModalTrackingNumber(selectedOrder.trackingNumber || '');
      setModalTrackingUrl(selectedOrder.trackingUrl || '');
      setModalDeliveryDate(selectedOrder.expectedDeliveryDate || '');
      setModalAdminNote(selectedOrder.adminNotes || '');
    }
  }, [selectedOrder]);

  const allOrderStatuses: OrderStatus[] = [
    'Order Received',
    'Payment Pending',
    'Payment Verified',
    'Design Processing',
    'Printing',
    'Quality Check',
    'Packed',
    'Shipped',
    'Out For Delivery',
    'Delivered',
    'Cancelled',
    'Refunded'
  ];

  const filteredOrders = orders.filter(order => {
    const matchesSearch =
      order.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.mobile.includes(searchTerm) ||
      order.serviceName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesOrderStatus =
      filterOrderStatus === 'All' || order.orderStatus === filterOrderStatus;

    const matchesPaymentStatus =
      filterPaymentStatus === 'All' || order.paymentStatus === filterPaymentStatus;

    return matchesSearch && matchesOrderStatus && matchesPaymentStatus;
  });

  const handleSaveModalChanges = () => {
    if (!selectedOrder) return;

    updateOrderStatus(selectedOrder.orderId, modalOrderStatus, {
      courierName: modalCourierName.trim() || undefined,
      trackingNumber: modalTrackingNumber.trim() || undefined,
      trackingUrl: modalTrackingUrl.trim() || undefined,
      expectedDeliveryDate: modalDeliveryDate || undefined,
      adminNotes: modalAdminNote.trim() || undefined
    });

    if (modalPaymentStatus !== selectedOrder.paymentStatus) {
      updatePaymentStatus(selectedOrder.orderId, modalPaymentStatus);
    }

    showToast(`Order ${selectedOrder.orderId} updated successfully`, 'success');
    setSelectedOrder(null);
  };

  const handleDeleteOrder = (orderId: string) => {
    if (confirm(`Are you sure you want to delete order ${orderId}?`)) {
      deleteOrder(orderId);
      showToast(`Order ${orderId} deleted`, 'info');
      setSelectedOrder(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Orders Management</h1>
          <p className="text-xs text-slate-500">
            Search, filter, update statuses, assign courier tracking numbers, and view customer documents.
          </p>
        </div>
        <span className="text-xs font-bold text-slate-600 bg-white px-3 py-1.5 rounded-xl border border-slate-200">
          Showing {filteredOrders.length} of {orders.length} orders
        </span>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          <div className="sm:col-span-6 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search by Order ID, Customer Name, Mobile or Card..."
              className="w-full pl-10 pr-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="sm:col-span-3">
            <select
              value={filterOrderStatus}
              onChange={e => setFilterOrderStatus(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium bg-white"
            >
              <option value="All">All Order Statuses</option>
              {allOrderStatuses.map(s => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-3">
            <select
              value={filterPaymentStatus}
              onChange={e => setFilterPaymentStatus(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium bg-white"
            >
              <option value="All">All Payment Statuses</option>
              <option value="Pending Verification">Pending Verification</option>
              <option value="Verified">Verified</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                <th className="py-3 px-3">Order ID</th>
                <th className="py-3 px-3">Customer</th>
                <th className="py-3 px-3">Card & Qty</th>
                <th className="py-3 px-3">Total</th>
                <th className="py-3 px-3">Payment</th>
                <th className="py-3 px-3">Order Status</th>
                <th className="py-3 px-3">Courier AWB</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredOrders.map(order => (
                <tr key={order.orderId} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-3 font-mono font-bold text-blue-600">
                    {order.orderId}
                  </td>
                  <td className="py-3 px-3">
                    <span className="font-bold text-slate-900 block">{order.customerName}</span>
                    <span className="text-[11px] text-slate-400">{order.mobile}</span>
                  </td>
                  <td className="py-3 px-3">
                    <span className="font-semibold text-slate-800 block">{order.serviceName}</span>
                    <span className="text-[10px] text-slate-500">{order.quantity} Card(s)</span>
                  </td>
                  <td className="py-3 px-3 font-extrabold text-slate-900">
                    ₹{order.grandTotal}
                  </td>
                  <td className="py-3 px-3">
                    <select
                      value={order.paymentStatus}
                      onChange={e =>
                        updatePaymentStatus(order.orderId, e.target.value as PaymentStatus)
                      }
                      className={`text-[11px] font-bold px-2 py-1 rounded-lg border focus:outline-none ${
                        order.paymentStatus === 'Verified'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : order.paymentStatus === 'Rejected'
                          ? 'bg-rose-50 text-rose-800 border-rose-200'
                          : 'bg-amber-50 text-amber-800 border-amber-200'
                      }`}
                    >
                      <option value="Pending Verification">Pending</option>
                      <option value="Verified">Verified</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  </td>
                  <td className="py-3 px-3">
                    <select
                      value={order.orderStatus}
                      onChange={e =>
                        updateOrderStatus(order.orderId, e.target.value as OrderStatus)
                      }
                      className="text-[11px] font-medium px-2 py-1 rounded-lg border border-slate-200 bg-white focus:outline-none"
                    >
                      {allOrderStatuses.map(st => (
                        <option key={st} value={st}>
                          {st}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="py-3 px-3 text-[11px]">
                    {order.trackingNumber ? (
                      <div>
                        <span className="font-mono font-bold text-slate-800 block">
                          {order.trackingNumber}
                        </span>
                        <span className="text-slate-400 text-[10px]">{order.courierName}</span>
                      </div>
                    ) : (
                      <span className="text-slate-400 italic">Not assigned</span>
                    )}
                  </td>
                  <td className="py-3 px-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="px-2.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition-colors"
                      >
                        Inspect
                      </button>
                      <button
                        onClick={() => navigate('invoice', { orderId: order.orderId })}
                        className="p-1.5 text-slate-500 hover:text-blue-600 rounded-lg hover:bg-blue-50"
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

      {/* Comprehensive Order Inspect / Manage Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 max-h-[92vh] overflow-y-auto space-y-6">
            <div className="flex items-start justify-between pb-4 border-b border-slate-100">
              <div>
                <span className="font-mono text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded">
                  {selectedOrder.orderId}
                </span>
                <h3 className="text-lg font-black text-slate-900 mt-1">
                  Manage PVC Print Order
                </h3>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Customer & Address Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Customer Details</span>
                <p className="font-bold text-slate-900 mt-1">{selectedOrder.customerName}</p>
                <p className="text-slate-600">Mobile: {selectedOrder.mobile}</p>
                <p className="text-slate-600">WhatsApp: {selectedOrder.whatsapp || selectedOrder.mobile}</p>
                <p className="text-slate-600">Email: {selectedOrder.email || 'N/A'}</p>
              </div>

              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Delivery Address</span>
                <p className="text-slate-700 mt-1 leading-relaxed">
                  {selectedOrder.address}, {selectedOrder.district}
                  <br />
                  {selectedOrder.state} - <span className="font-bold font-mono">{selectedOrder.pincode}</span>
                </p>
                <p className="text-slate-500 mt-1">Speed: {selectedOrder.deliveryType}</p>
              </div>
            </div>

            {/* Document Preview & Download */}
            <div>
              <span className="text-xs font-bold text-slate-700 block mb-2">
                Customer Uploaded Files:
              </span>
              <div className="grid grid-cols-2 gap-3">
                {selectedOrder.frontImageUrl && (
                  <div className="border border-slate-200 rounded-xl p-3 bg-slate-50 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-800">Front Side / PDF</span>
                      {selectedOrder.frontImageUrl.startsWith('data:') && (
                        <a
                          href={selectedOrder.frontImageUrl}
                          download={`front_${selectedOrder.orderId}`}
                          className="text-blue-600 hover:underline text-[11px] flex items-center gap-1 font-semibold"
                        >
                          <Download className="w-3 h-3" /> Save
                        </a>
                      )}
                    </div>
                    {selectedOrder.frontImageUrl.startsWith('data:image') ? (
                      <img
                        src={selectedOrder.frontImageUrl}
                        alt="Front Side"
                        className="w-full h-32 object-contain bg-white rounded-lg border"
                      />
                    ) : (
                      <div className="h-32 flex flex-col items-center justify-center bg-white rounded-lg border text-slate-500">
                        <FileText className="w-8 h-8 text-blue-600 mb-1" />
                        <span className="text-[10px] truncate max-w-[150px]">
                          {selectedOrder.frontImageName || 'Document PDF'}
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {selectedOrder.backImageUrl && (
                  <div className="border border-slate-200 rounded-xl p-3 bg-slate-50 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-800">Back Side</span>
                      {selectedOrder.backImageUrl.startsWith('data:') && (
                        <a
                          href={selectedOrder.backImageUrl}
                          download={`back_${selectedOrder.orderId}`}
                          className="text-blue-600 hover:underline text-[11px] flex items-center gap-1 font-semibold"
                        >
                          <Download className="w-3 h-3" /> Save
                        </a>
                      )}
                    </div>
                    {selectedOrder.backImageUrl.startsWith('data:image') ? (
                      <img
                        src={selectedOrder.backImageUrl}
                        alt="Back Side"
                        className="w-full h-32 object-contain bg-white rounded-lg border"
                      />
                    ) : (
                      <div className="h-32 flex flex-col items-center justify-center bg-white rounded-lg border text-slate-500">
                        <FileText className="w-8 h-8 text-blue-600 mb-1" />
                        <span className="text-[10px] truncate max-w-[150px]">
                          {selectedOrder.backImageName || 'Document PDF'}
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {selectedOrder.customerNote && (
                <div className="mt-3 p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900">
                  <span className="font-bold">Customer Note / Password: </span>
                  {selectedOrder.customerNote}
                </div>
              )}
            </div>

            {/* Status & Courier Controls */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Update Order Status
                </label>
                <select
                  value={modalOrderStatus}
                  onChange={e => setModalOrderStatus(e.target.value as OrderStatus)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium"
                >
                  {allOrderStatuses.map(s => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Payment Verification Status
                </label>
                <select
                  value={modalPaymentStatus}
                  onChange={e => setModalPaymentStatus(e.target.value as PaymentStatus)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium"
                >
                  <option value="Pending Verification">Pending Verification</option>
                  <option value="Verified">Verified</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Courier Partner Name
                </label>
                <input
                  type="text"
                  value={modalCourierName}
                  onChange={e => setModalCourierName(e.target.value)}
                  placeholder="e.g. Bluedart, Delhivery, Speed Post"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Courier Tracking / AWB Number
                </label>
                <input
                  type="text"
                  value={modalTrackingNumber}
                  onChange={e => setModalTrackingNumber(e.target.value)}
                  placeholder="e.g. BD789123019"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Courier Tracking Web URL
                </label>
                <input
                  type="url"
                  value={modalTrackingUrl}
                  onChange={e => setModalTrackingUrl(e.target.value)}
                  placeholder="https://delhivery.com/track/..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Expected Delivery Date
                </label>
                <input
                  type="date"
                  value={modalDeliveryDate}
                  onChange={e => setModalDeliveryDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Internal Admin Notes
              </label>
              <textarea
                rows={2}
                value={modalAdminNote}
                onChange={e => setModalAdminNote(e.target.value)}
                placeholder="Internal notes (e.g. printed by machine 2, dispatched at 4pm)..."
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
              />
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => handleDeleteOrder(selectedOrder.orderId)}
                className="text-rose-600 hover:text-rose-800 text-xs font-bold flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Order</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedOrder(null)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveModalChanges}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow-xs"
                >
                  Save & Update Status
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
