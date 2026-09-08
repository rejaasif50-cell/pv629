import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import QRCode from 'qrcode';
import {
  CreditCard,
  QrCode,
  Copy,
  Check,
  CheckCircle2,
  Clock,
  ArrowRight,
  Upload,
  FileText,
  AlertCircle,
  ExternalLink,
  Printer,
  ShieldCheck,
  Smartphone
} from 'lucide-react';

export const PaymentPage: React.FC = () => {
  const {
    orders,
    selectedOrderId,
    settings,
    submitUpiPayment,
    navigate,
    showToast
  } = useApp();

  const [orderId, setOrderId] = useState<string>(selectedOrderId || orders[0]?.orderId || '');
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [copiedAmount, setCopiedAmount] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  
  // Transaction submission
  const [transactionId, setTransactionId] = useState('');
  const [screenshotUrl, setScreenshotUrl] = useState<string | null>(null);
  const [screenshotName, setScreenshotName] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [paymentSubmittedSuccess, setPaymentSubmittedSuccess] = useState(false);

  const order = orders.find(o => o.orderId === orderId) || orders[0];

  useEffect(() => {
    if (selectedOrderId) {
      setOrderId(selectedOrderId);
    }
  }, [selectedOrderId]);

  // Generate UPI QR Code
  useEffect(() => {
    if (!order) return;

    // Standard NPCI UPI URI
    const upiUri = `upi://pay?pa=${encodeURIComponent(settings.upiId)}&pn=${encodeURIComponent(
      settings.upiMerchantName
    )}&am=${order.grandTotal.toFixed(2)}&cu=INR&tn=${encodeURIComponent('PVC Card ' + order.orderId)}`;

    QRCode.toDataURL(upiUri, {
      width: 280,
      margin: 2,
      color: {
        dark: '#0f172a',
        light: '#ffffff'
      }
    })
      .then(url => setQrDataUrl(url))
      .catch(err => console.error('QR generation error:', err));
  }, [order, settings]);

  if (!order) {
    return (
      <div className="max-w-2xl mx-auto py-20 px-4 text-center">
        <CreditCard className="w-12 h-12 text-slate-300 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-slate-800">No active order selected</h2>
        <p className="text-xs text-slate-500 mt-1">Please select an order from your history to make payment</p>
        <button
          onClick={() => navigate('my-orders')}
          className="mt-4 px-5 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-bold"
        >
          Go to My Orders
        </button>
      </div>
    );
  }

  const upiIntentUrl = `upi://pay?pa=${encodeURIComponent(settings.upiId)}&pn=${encodeURIComponent(
    settings.upiMerchantName
  )}&am=${order.grandTotal.toFixed(2)}&cu=INR&tn=${encodeURIComponent('PVC Card ' + order.orderId)}`;

  const handleCopy = (text: string, type: 'upi' | 'amount') => {
    navigator.clipboard.writeText(text);
    if (type === 'upi') {
      setCopiedUpi(true);
      setTimeout(() => setCopiedUpi(false), 2000);
      showToast('UPI ID copied to clipboard', 'info');
    } else {
      setCopiedAmount(true);
      setTimeout(() => setCopiedAmount(false), 2000);
      showToast('Amount copied to clipboard', 'info');
    }
  };

  const handleScreenshotUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setScreenshotUrl(reader.result as string);
      setScreenshotName(file.name);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmitPaymentDetails = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!transactionId.trim()) {
      showToast('Please enter the 12-digit UTR / UPI Transaction ID', 'error');
      return;
    }

    setSubmitting(true);
    try {
      await submitUpiPayment(order.orderId, transactionId.trim(), screenshotUrl || undefined);
      setPaymentSubmittedSuccess(true);
    } catch {
      showToast('Failed to submit payment details', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Order Success Greeting Banner */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-3xl p-6 sm:p-8 text-center space-y-3">
        <div className="w-14 h-14 bg-emerald-600 text-white rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-emerald-600/30">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-700 bg-emerald-100/80 px-3 py-1 rounded-md">
          Order Successfully Placed
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Complete Your Payment via UPI
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto">
          Order ID: <span className="font-mono font-bold text-slate-900">{order.orderId}</span>. Scan the UPI QR code below using any UPI app to make payment.
        </p>

        {/* Action quick links */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
          <button
            onClick={() => navigate('invoice', { orderId: order.orderId })}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-blue-600 bg-white border border-slate-200 px-3.5 py-2 rounded-xl transition-colors shadow-xs"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Download Invoice</span>
          </button>
          <button
            onClick={() => navigate('track-order', { orderId: order.orderId })}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-blue-600 bg-white border border-slate-200 px-3.5 py-2 rounded-xl transition-colors shadow-xs"
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Track Order</span>
          </button>
        </div>
      </div>

      {/* Main Payment Container */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* QR Code & Pay Link (5 cols) */}
        <div className="md:col-span-5 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm text-center space-y-4">
          <div className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-800 text-xs font-bold px-3 py-1 rounded-full">
            <QrCode className="w-3.5 h-3.5" />
            <span>Scan & Pay via any UPI App</span>
          </div>

          {/* Dynamic QR Code Canvas */}
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 flex justify-center items-center shadow-inner">
            {qrDataUrl ? (
              <img
                src={qrDataUrl}
                alt="UPI QR Code"
                className="w-56 h-56 rounded-xl border border-slate-200"
              />
            ) : (
              <div className="w-56 h-56 flex items-center justify-center text-xs text-slate-400">
                Generating QR...
              </div>
            )}
          </div>

          {/* Amount to pay */}
          <div>
            <span className="text-[11px] text-slate-400 font-semibold block uppercase">
              Total Amount Due
            </span>
            <div className="flex items-center justify-center gap-2 mt-0.5">
              <span className="text-3xl font-black text-slate-900">₹{order.grandTotal}</span>
              <button
                type="button"
                onClick={() => handleCopy(order.grandTotal.toString(), 'amount')}
                className="text-slate-400 hover:text-slate-700 p-1"
                title="Copy amount"
              >
                {copiedAmount ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Direct Mobile UPI Intent Button */}
          <div>
            <a
              id="btn-upi-intent"
              href={upiIntentUrl}
              className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-extrabold py-3 px-4 rounded-xl text-sm shadow-md shadow-blue-500/20 transition-all"
            >
              <Smartphone className="w-4 h-4" />
              <span>Pay Now Using UPI App</span>
            </a>
            <p className="text-[10px] text-slate-400 mt-1">
              Tap above on Android/iOS to open PhonePe, GPay or Paytm directly.
            </p>
          </div>

          {/* UPI ID Copy Field */}
          <div className="pt-2 border-t border-slate-100 text-left">
            <span className="text-[11px] font-bold text-slate-500 block mb-1">
              Or Send to Merchant UPI ID:
            </span>
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200">
              <span className="font-mono text-xs font-bold text-slate-800 truncate">
                {settings.upiId}
              </span>
              <button
                type="button"
                onClick={() => handleCopy(settings.upiId, 'upi')}
                className="text-blue-600 hover:text-blue-800 text-xs font-bold flex items-center gap-1 shrink-0 ml-2"
              >
                {copiedUpi ? (
                  <span className="text-emerald-600 flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> Copied
                  </span>
                ) : (
                  <span className="flex items-center gap-1">
                    <Copy className="w-3.5 h-3.5" /> Copy
                  </span>
                )}
              </button>
            </div>
            <span className="text-[10px] text-slate-400 mt-1 block">
              Merchant: {settings.upiMerchantName}
            </span>
          </div>
        </div>

        {/* Payment Confirmation & Verification Form (7 cols) */}
        <div className="md:col-span-7 space-y-6">
          {/* Order Details Brief */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div>
                <h4 className="font-bold text-sm text-slate-900">{order.serviceName}</h4>
                <p className="text-xs text-slate-500">
                  Card Holder: <span className="font-semibold text-slate-700">{order.cardHolderName}</span>
                </p>
              </div>
              <div className="text-right">
                <span
                  className={`text-[11px] font-extrabold px-2.5 py-1 rounded-full ${
                    order.paymentStatus === 'Verified'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {order.paymentStatus}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs text-slate-600">
              <div>
                <span className="text-slate-400 block">Quantity:</span>
                <span className="font-semibold text-slate-800">{order.quantity} Card(s)</span>
              </div>
              <div>
                <span className="text-slate-400 block">Delivery To:</span>
                <span className="font-semibold text-slate-800 truncate block">
                  {order.district}, {order.pincode}
                </span>
              </div>
            </div>
          </div>

          {/* Submission Form */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="font-bold text-base text-slate-900">
                Submit Payment Confirmation
              </h3>
              <p className="text-xs text-slate-500">
                After completing payment, please enter your 12-digit UPI Reference / UTR number
              </p>
            </div>

            {paymentSubmittedSuccess ? (
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                <h4 className="font-bold text-sm text-emerald-900">Payment Submitted!</h4>
                <p className="text-xs text-emerald-800">
                  Transaction reference <b>{transactionId || order.transactionId}</b> has been received. Our team will verify and begin high-definition printing shortly.
                </p>
                <div className="pt-3 flex justify-center gap-3">
                  <button
                    onClick={() => navigate('track-order', { orderId: order.orderId })}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors"
                  >
                    Track Order Live
                  </button>
                  <button
                    onClick={() => navigate('my-orders')}
                    className="px-4 py-2 bg-white border border-emerald-300 text-emerald-800 rounded-xl text-xs font-bold"
                  >
                    View My Orders
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmitPaymentDetails} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    UPI Transaction ID / UTR Number <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="input-transaction-id"
                    type="text"
                    required
                    value={transactionId}
                    onChange={e => setTransactionId(e.target.value)}
                    placeholder="e.g. 408291049281 or AXIS92810"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-mono focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-[11px] text-slate-400 mt-1 block">
                    Found in your UPI app payment receipt (PhonePe / GPay / Paytm)
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Upload Payment Screenshot (Optional for faster verification)
                  </label>
                  {screenshotUrl ? (
                    <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-xl">
                      <div className="flex items-center gap-2 overflow-hidden">
                        <img
                          src={screenshotUrl}
                          alt="Screenshot"
                          className="w-12 h-12 object-cover rounded-lg border border-blue-300"
                        />
                        <span className="text-xs font-medium text-slate-800 truncate">
                          {screenshotName}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setScreenshotUrl(null);
                          setScreenshotName(null);
                        }}
                        className="text-slate-400 hover:text-rose-600 text-xs"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <label className="flex items-center justify-center gap-2 p-4 border border-dashed border-slate-200 hover:border-blue-500 rounded-xl cursor-pointer bg-slate-50 hover:bg-blue-50/50 transition-colors">
                      <Upload className="w-4 h-4 text-slate-400" />
                      <span className="text-xs text-slate-600 font-semibold">
                        Choose Screenshot File
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleScreenshotUpload}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>

                <button
                  id="btn-submit-payment-proof"
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-extrabold py-3 px-4 rounded-xl text-sm transition-colors flex items-center justify-center gap-2 shadow-sm"
                >
                  {submitting ? (
                    <span>Verifying...</span>
                  ) : (
                    <>
                      <span>Submit Payment Proof</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-start gap-2 text-xs text-slate-500">
              <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <span>
                Payments are verified manually by admin within 15-30 minutes during working hours. Once verified, your order advances to &ldquo;Printing&rdquo;.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
