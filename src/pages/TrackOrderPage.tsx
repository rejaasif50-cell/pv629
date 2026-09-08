import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { OrderStatus } from '../types';
import {
  Search,
  CheckCircle2,
  Clock,
  Truck,
  Package,
  Printer,
  ShieldCheck,
  AlertCircle,
  ExternalLink,
  MessageCircle,
  FileText
} from 'lucide-react';

export const TrackOrderPage: React.FC = () => {
  const { orders, selectedOrderId, settings, navigate, showToast } = useApp();

  const [orderIdInput, setOrderIdInput] = useState(selectedOrderId || '');
  const [mobileInput, setMobileInput] = useState('');
  const [searchedOrder, setSearchedOrder] = useState<any>(null);
  const [searchError, setSearchError] = useState<string | null>(null);

  useEffect(() => {
    if (selectedOrderId) {
      setOrderIdInput(selectedOrderId);
      const found = orders.find(o => o.orderId.toLowerCase() === selectedOrderId.toLowerCase());
      if (found) {
        setSearchedOrder(found);
      }
    }
  }, [selectedOrderId, orders]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchError(null);

    const cleanOrderId = orderIdInput.trim().toUpperCase();
    const cleanMobile = mobileInput.trim();

    if (!cleanOrderId) {
      setSearchError('Please enter a valid Order ID (e.g. REZA-PVC-2026-000101)');
      return;
    }

    const matched = orders.find(o => {
      const matchId = o.orderId.toUpperCase() === cleanOrderId;
      if (!cleanMobile) return matchId;
      return matchId && o.mobile.includes(cleanMobile.slice(-4));
    });

    if (matched) {
      setSearchedOrder(matched);
      showToast(`Order found: ${matched.orderStatus}`, 'info');
    } else {
      setSearchedOrder(null);
      setSearchError('No matching order found. Please verify Order ID and Mobile Number.');
    }
  };

  // 6 Primary milestones for customer visual progress
  const milestones: { status: OrderStatus; label: string; icon: any }[] = [
    { status: 'Order Received', label: 'Order Placed', icon: Clock },
    { status: 'Payment Verified', label: 'Payment Verified', icon: CheckCircle2 },
    { status: 'Printing', label: 'Printing HD PVC', icon: Printer },
    { status: 'Packed', label: 'Packed', icon: Package },
    { status: 'Shipped', label: 'Shipped', icon: Truck },
    { status: 'Delivered', label: 'Delivered', icon: ShieldCheck }
  ];

  // Helper to determine active step in sequence
  const getStepProgress = (currentStatus: OrderStatus) => {
    const orderHierarchy: Record<string, number> = {
      'Order Received': 1,
      'Payment Pending': 1,
      'Payment Verified': 2,
      'Design Processing': 2.5,
      'Printing': 3,
      'Quality Check': 3.5,
      'Packed': 4,
      'Shipped': 5,
      'Out For Delivery': 5.5,
      'Delivered': 6,
      'Cancelled': -1,
      'Refunded': -2
    };

    return orderHierarchy[currentStatus] || 1;
  };

  const currentStepNum = searchedOrder ? getStepProgress(searchedOrder.orderStatus) : 1;

  // Mask sensitive information
  const maskText = (text: string) => {
    if (!text) return '';
    if (text.length <= 4) return text;
    return text.substring(0, 2) + '****' + text.substring(text.length - 2);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header Banner */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="text-xs font-extrabold uppercase tracking-widest text-blue-600 bg-blue-50 px-3 py-1 rounded-md">
          Live Tracking
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Track Your PVC Card Order
        </h1>
        <p className="text-slate-600 text-sm">
          Enter your Order ID and registered mobile number to check real-time printing and dispatch status.
        </p>
      </div>

      {/* Tracking Form Box */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm max-w-2xl mx-auto">
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Order ID <span className="text-rose-500">*</span>
              </label>
              <input
                id="track-order-id-input"
                type="text"
                required
                value={orderIdInput}
                onChange={e => setOrderIdInput(e.target.value)}
                placeholder="e.g. REZA-PVC-2026-000101"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-mono uppercase focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Mobile Number (Optional verification)
              </label>
              <input
                id="track-mobile-input"
                type="tel"
                value={mobileInput}
                onChange={e => setMobileInput(e.target.value)}
                placeholder="10 digit mobile"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {searchError && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{searchError}</span>
            </div>
          )}

          <button
            id="btn-track-submit"
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-extrabold py-3 px-4 rounded-xl text-sm transition-colors flex items-center justify-center gap-2 shadow-sm"
          >
            <Search className="w-4 h-4" />
            <span>Track Order Status</span>
          </button>
        </form>

        {/* Quick sample chips */}
        <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-center gap-2 text-xs text-slate-500">
          <span>Try sample order IDs:</span>
          {orders.slice(0, 3).map(o => (
            <button
              key={o.orderId}
              type="button"
              onClick={() => {
                setOrderIdInput(o.orderId);
                setSearchedOrder(o);
                setSearchError(null);
              }}
              className="font-mono bg-slate-100 hover:bg-slate-200 px-2 py-1 rounded text-slate-700 font-semibold"
            >
              {o.orderId}
            </button>
          ))}
        </div>
      </div>

      {/* Result Display */}
      {searchedOrder && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-md space-y-8 animate-in fade-in">
          {/* Header Summary */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-200 gap-4">
            <div>
              <span className="text-xs font-mono font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md">
                {searchedOrder.orderId}
              </span>
              <h2 className="text-xl font-extrabold text-slate-900 mt-1.5">
                {searchedOrder.serviceName}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Recipient: <b>{maskText(searchedOrder.customerName)}</b> | Destination: <b>{searchedOrder.district}, {searchedOrder.pincode}</b>
              </p>
            </div>

            <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2">
              <span
                className={`text-xs font-extrabold px-3 py-1.5 rounded-full ${
                  searchedOrder.orderStatus === 'Delivered'
                    ? 'bg-emerald-100 text-emerald-800'
                    : searchedOrder.orderStatus === 'Cancelled'
                    ? 'bg-rose-100 text-rose-800'
                    : 'bg-blue-100 text-blue-800'
                }`}
              >
                {searchedOrder.orderStatus}
              </span>
              <span className="text-[11px] text-slate-400">
                Ordered: {new Date(searchedOrder.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>

          {/* Timeline Visual Progress */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-6">
              Order Timeline Progress
            </h3>

            {searchedOrder.orderStatus === 'Cancelled' || searchedOrder.orderStatus === 'Refunded' ? (
              <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 font-semibold text-center">
                This order is marked as {searchedOrder.orderStatus}. Please contact customer support for details.
              </div>
            ) : (
              <div className="relative">
                {/* Horizontal / Vertical Stepper */}
                <div className="grid grid-cols-2 sm:grid-cols-6 gap-4 relative">
                  {milestones.map((step, idx) => {
                    const stepNum = idx + 1;
                    const isCompleted = currentStepNum >= stepNum;
                    const isCurrent = Math.floor(currentStepNum) === stepNum;
                    const StepIcon = step.icon;

                    return (
                      <div
                        key={step.status}
                        className={`flex flex-col items-center text-center p-3 rounded-xl transition-all ${
                          isCurrent
                            ? 'bg-blue-50/80 border border-blue-200 ring-2 ring-blue-500/20'
                            : isCompleted
                            ? 'bg-emerald-50/50'
                            : 'bg-slate-50/50 opacity-60'
                        }`}
                      >
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm mb-2 shadow-xs ${
                            isCompleted
                              ? 'bg-emerald-600 text-white'
                              : isCurrent
                              ? 'bg-blue-600 text-white animate-pulse'
                              : 'bg-slate-200 text-slate-500'
                          }`}
                        >
                          <StepIcon className="w-5 h-5" />
                        </div>
                        <span className="text-xs font-bold text-slate-800 leading-tight">
                          {step.label}
                        </span>
                        {isCompleted && (
                          <span className="text-[10px] text-emerald-600 font-semibold mt-1">
                            Completed
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Shipping & Courier Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-200">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-2">
              <h4 className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-blue-600" />
                <span>Courier & Dispatch Details</span>
              </h4>
              <div className="text-xs space-y-1 text-slate-600">
                <p>
                  Courier Partner:{' '}
                  <span className="font-bold text-slate-800">
                    {searchedOrder.courierName || 'Assigned upon packing (Bluedart / Delhivery / Speed Post)'}
                  </span>
                </p>
                {searchedOrder.trackingNumber ? (
                  <p className="flex items-center gap-2">
                    Tracking No:{' '}
                    <span className="font-mono font-bold text-blue-600">
                      {searchedOrder.trackingNumber}
                    </span>
                    {searchedOrder.trackingUrl && (
                      <a
                        href={searchedOrder.trackingUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-bold text-blue-600 hover:underline inline-flex items-center gap-1"
                      >
                        Track Courier <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </p>
                ) : (
                  <p className="text-[11px] text-slate-400">
                    Tracking number will be updated once shipped.
                  </p>
                )}
                {searchedOrder.expectedDeliveryDate && (
                  <p>
                    Expected Delivery:{' '}
                    <span className="font-semibold text-emerald-700">
                      {new Date(searchedOrder.expectedDeliveryDate).toLocaleDateString()}
                    </span>
                  </p>
                )}
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-2">
              <h4 className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Payment & Order Summary</span>
              </h4>
              <div className="text-xs space-y-1 text-slate-600">
                <p>
                  Payment Status:{' '}
                  <span
                    className={`font-bold ${
                      searchedOrder.paymentStatus === 'Verified'
                        ? 'text-emerald-600'
                        : 'text-amber-600'
                    }`}
                  >
                    {searchedOrder.paymentStatus}
                  </span>
                </p>
                <p>
                  Total Paid / Due: <span className="font-bold text-slate-800">₹{searchedOrder.grandTotal}</span>
                </p>
                <p>
                  Quantity: <span className="font-semibold">{searchedOrder.quantity} PVC Card(s)</span>
                </p>
              </div>
            </div>
          </div>

          {/* Bottom Actions: Invoice & WhatsApp query */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-200">
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate('invoice', { orderId: searchedOrder.orderId })}
                className="inline-flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>View Tax Invoice</span>
              </button>

              {searchedOrder.paymentStatus === 'Pending Verification' && (
                <button
                  onClick={() => navigate('payment', { orderId: searchedOrder.orderId })}
                  className="inline-flex items-center gap-1 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors"
                >
                  <span>Pay Now / Submit UTR</span>
                </button>
              )}
            </div>

            <a
              href={`https://wa.me/${settings.whatsappNumber.replace(/[^0-9]/g, '')}?text=Hello%20Reza%20Enterprise,%20I%20have%20a%20question%20about%20my%20Order%20ID:%20${searchedOrder.orderId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-800 bg-emerald-50 border border-emerald-200 px-3.5 py-2 rounded-xl"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Contact Support for this Order</span>
            </a>
          </div>
        </div>
      )}
    </div>
  );
};
