import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  CreditCard,
  Upload,
  X,
  CheckCircle2,
  FileText,
  AlertCircle,
  ShieldCheck,
  Tag,
  ArrowRight,
  Info,
  Truck,
  Sparkles
} from 'lucide-react';

export const OrderPage: React.FC = () => {
  const {
    services,
    settings,
    currentUser,
    selectedServiceId,
    validateCoupon,
    createOrder,
    navigate,
    showToast
  } = useApp();

  // Selected Service
  const [serviceId, setServiceId] = useState<string>(selectedServiceId || services[0]?.id || '');
  
  // Customer details
  const [customerName, setCustomerName] = useState(currentUser?.name || '');
  const [mobile, setMobile] = useState(currentUser?.mobile || '');
  const [whatsapp, setWhatsapp] = useState(currentUser?.mobile || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [address, setAddress] = useState('');
  const [stateName, setStateName] = useState('West Bengal');
  const [district, setDistrict] = useState('');
  const [pincode, setPincode] = useState('');
  
  // Card details
  const [cardHolderName, setCardHolderName] = useState('');
  const [quantity, setQuantity] = useState<number>(1);
  const [deliveryType, setDeliveryType] = useState<'Standard Delivery' | 'Express Delivery' | 'Urgent Same-Day Dispatch'>('Standard Delivery');
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'PhonePe / GPay' | 'NetBanking / Card'>('UPI');
  const [notes, setNotes] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(true);

  // Uploaded files
  const [frontImage, setFrontImage] = useState<{ url: string; name: string } | null>(null);
  const [backImage, setBackImage] = useState<{ url: string; name: string } | null>(null);
  const [documentFile, setDocumentFile] = useState<{ url: string; name: string } | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Coupon
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number } | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);

  const [submitting, setSubmitting] = useState(false);

  // Set service if coming with selectedServiceId
  useEffect(() => {
    if (selectedServiceId) {
      setServiceId(selectedServiceId);
    }
  }, [selectedServiceId]);

  // Autofill user info if user changes
  useEffect(() => {
    if (currentUser) {
      if (!customerName) setCustomerName(currentUser.name);
      if (!email) setEmail(currentUser.email);
      if (!mobile) setMobile(currentUser.mobile);
      if (!whatsapp) setWhatsapp(currentUser.mobile);
    }
  }, [currentUser]);

  const selectedService = services.find(s => s.id === serviceId) || services[0];
  const unitPrice = selectedService ? selectedService.offerPrice : 69;
  const subtotal = unitPrice * quantity;

  // Shipping calculation
  const isFreeShipping = subtotal >= settings.freeShippingThreshold;
  let shippingCharge = 0;
  if (!isFreeShipping) {
    shippingCharge = deliveryType === 'Express Delivery' ? settings.expressDeliveryCharge : settings.standardDeliveryCharge;
  } else if (deliveryType === 'Express Delivery') {
    // If express selected but threshold met, small express upgrade fee
    shippingCharge = 50;
  }

  // Discount
  const discount = appliedCoupon ? appliedCoupon.discount : 0;
  const grandTotal = Math.max(0, subtotal + shippingCharge - discount);

  // Handle Coupon Apply
  const handleApplyCoupon = () => {
    setCouponError(null);
    if (!couponCode.trim()) return;

    const result = validateCoupon(couponCode, subtotal);
    if (!result.valid) {
      setCouponError(result.error || 'Invalid coupon');
      setAppliedCoupon(null);
    } else {
      setAppliedCoupon({ code: result.coupon!.code, discount: result.discount });
      showToast(`Coupon ${result.coupon!.code} applied! Saved ₹${result.discount}`, 'success');
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
    setCouponError(null);
  };

  // Generic File Upload Handler
  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    target: 'front' | 'back' | 'doc'
  ) => {
    setUploadError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    const maxSizeBytes = (settings.maxUploadSizeMB || 15) * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      setUploadError(`File size exceeds maximum limit of ${settings.maxUploadSizeMB}MB.`);
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const resultStr = reader.result as string;
      if (target === 'front') {
        setFrontImage({ url: resultStr, name: file.name });
      } else if (target === 'back') {
        setBackImage({ url: resultStr, name: file.name });
      } else {
        setDocumentFile({ url: resultStr, name: file.name });
      }
    };
    reader.readAsDataURL(file);
  };

  // Form Submit
  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!customerName.trim()) {
      showToast('Please enter your full name', 'error');
      return;
    }
    if (!mobile.trim() || mobile.replace(/\D/g, '').length < 10) {
      showToast('Please enter a valid 10-digit mobile number', 'error');
      return;
    }
    if (!pincode.trim() || pincode.replace(/\D/g, '').length !== 6) {
      showToast('Please enter a valid 6-digit PIN Code', 'error');
      return;
    }
    if (!address.trim()) {
      showToast('Please enter complete delivery address', 'error');
      return;
    }
    if (!frontImage) {
      showToast('Please upload front side image or e-card PDF', 'error');
      return;
    }
    if (!acceptTerms) {
      showToast('Please accept the Terms & Conditions', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const order = await createOrder({
        userId: currentUser?.uid || 'guest_' + Date.now(),
        customerName: customerName.trim(),
        mobile: mobile.trim(),
        whatsapp: (whatsapp || mobile).trim(),
        email: email.trim(),
        address: address.trim(),
        state: stateName.trim(),
        district: district.trim() || 'General District',
        pincode: pincode.trim(),
        serviceId: selectedService.id,
        serviceName: selectedService.name,
        cardHolderName: cardHolderName.trim() || customerName.trim(),
        quantity,
        unitPrice,
        subtotal,
        shippingCharge,
        discount,
        grandTotal,
        deliveryType,
        frontImageUrl: frontImage.url,
        frontImageName: frontImage.name,
        backImageUrl: backImage?.url,
        backImageName: backImage?.name,
        documentUrl: documentFile?.url,
        documentName: documentFile?.name,
        paymentMethod,
        customerNote: notes.trim()
      });

      // Navigate directly to payment page with newly created order
      navigate('payment', { orderId: order.orderId });
    } catch (err) {
      console.error(err);
      showToast('Failed to create order. Please try again.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Title */}
      <div className="text-center max-w-3xl mx-auto mb-10 space-y-2">
        <span className="text-xs font-extrabold uppercase tracking-widest text-blue-600 bg-blue-50 px-3 py-1 rounded-md">
          Online Order Form
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          PVC Card Printing Order
        </h1>
        <p className="text-slate-600 text-sm">
          Fill in your details, upload card document/photos, and get fast doorstep delivery with tracked shipping.
        </p>
      </div>

      <form onSubmit={handleSubmitOrder}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Form Fields Column (7 cols) */}
          <div className="lg:col-span-7 space-y-8">
            {/* Step 1: Card Selection */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
                <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
                  1
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Select PVC Card Type</h3>
                  <p className="text-xs text-slate-500">Choose the card service you want printed</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Card Service <span className="text-rose-500">*</span>
                  </label>
                  <select
                    id="select-card-type"
                    value={serviceId}
                    onChange={e => setServiceId(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    {services
                      .filter(s => s.active)
                      .map(s => (
                        <option key={s.id} value={s.id}>
                          {s.name} — ₹{s.offerPrice} (Was ₹{s.price})
                        </option>
                      ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Card Holder Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="input-cardholder-name"
                    type="text"
                    required
                    value={cardHolderName}
                    onChange={e => setCardHolderName(e.target.value)}
                    placeholder="Name printed on card"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Quantity Counter */}
              <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-50 p-4 rounded-xl border border-slate-100">
                <div>
                  <span className="text-xs font-bold text-slate-800 block">Quantity</span>
                  <span className="text-[11px] text-slate-500">
                    Order 3+ cards for automatic Free Shipping!
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-9 h-9 rounded-lg bg-white border border-slate-200 font-bold text-slate-700 hover:bg-slate-100 transition-colors flex items-center justify-center text-lg"
                  >
                    -
                  </button>
                  <span className="font-extrabold text-base text-slate-900 w-8 text-center">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-9 h-9 rounded-lg bg-white border border-slate-200 font-bold text-slate-700 hover:bg-slate-100 transition-colors flex items-center justify-center text-lg"
                  >
                    +
                  </button>
                </div>
              </div>

              {selectedService && (
                <div className="p-3 rounded-xl bg-blue-50/70 border border-blue-100 text-xs text-blue-900 flex items-start gap-2">
                  <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">Required File: </span>
                    {selectedService.uploadRequirements}
                  </div>
                </div>
              )}
            </div>

            {/* Step 2: Document & Photo Upload */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
                <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
                  2
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Upload Card Documents / Photos</h3>
                  <p className="text-xs text-slate-500">
                    Supported: JPG, JPEG, PNG, PDF (Max {settings.maxUploadSizeMB}MB)
                  </p>
                </div>
              </div>

              {uploadError && (
                <div className="p-3 rounded-xl bg-rose-50 text-rose-800 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{uploadError}</span>
                </div>
              )}

              {/* Upload Front Image */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Upload Front Image / e-Card PDF <span className="text-rose-500">*</span>
                </label>
                {frontImage ? (
                  <div className="flex items-center justify-between p-3.5 bg-blue-50/60 border border-blue-200 rounded-xl">
                    <div className="flex items-center gap-3 overflow-hidden">
                      {frontImage.url.startsWith('data:image') ? (
                        <img
                          src={frontImage.url}
                          alt="Front preview"
                          className="w-14 h-10 object-cover rounded-lg border border-blue-300"
                        />
                      ) : (
                        <FileText className="w-8 h-8 text-blue-600" />
                      )}
                      <div className="truncate">
                        <p className="text-xs font-bold text-slate-800 truncate">{frontImage.name}</p>
                        <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Ready for print
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setFrontImage(null)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <label
                    id="dropzone-front"
                    className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-xl cursor-pointer bg-slate-50/50 hover:bg-blue-50/30 transition-all text-center group"
                  >
                    <Upload className="w-8 h-8 text-slate-400 group-hover:text-blue-600 mb-2 transition-colors" />
                    <span className="text-xs font-bold text-slate-700 group-hover:text-blue-600">
                      Click to upload or drag Front Side / e-PDF
                    </span>
                    <span className="text-[11px] text-slate-400 mt-0.5">
                      JPG, PNG, or e-Aadhaar/e-PAN PDF
                    </span>
                    <input
                      type="file"
                      accept=".jpg,.jpeg,.png,.pdf"
                      onChange={e => handleFileUpload(e, 'front')}
                      className="hidden"
                    />
                  </label>
                )}
              </div>

              {/* Upload Back Image */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Upload Back Image (Optional if PDF contains both sides)
                </label>
                {backImage ? (
                  <div className="flex items-center justify-between p-3.5 bg-blue-50/60 border border-blue-200 rounded-xl">
                    <div className="flex items-center gap-3 overflow-hidden">
                      {backImage.url.startsWith('data:image') ? (
                        <img
                          src={backImage.url}
                          alt="Back preview"
                          className="w-14 h-10 object-cover rounded-lg border border-blue-300"
                        />
                      ) : (
                        <FileText className="w-8 h-8 text-blue-600" />
                      )}
                      <div className="truncate">
                        <p className="text-xs font-bold text-slate-800 truncate">{backImage.name}</p>
                        <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Back uploaded
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setBackImage(null)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <label
                    id="dropzone-back"
                    className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-slate-200 hover:border-blue-500 rounded-xl cursor-pointer bg-slate-50/30 hover:bg-blue-50/30 transition-all text-center group"
                  >
                    <Upload className="w-6 h-6 text-slate-400 group-hover:text-blue-600 mb-1" />
                    <span className="text-xs font-medium text-slate-600">
                      Upload Back Side Image (Optional)
                    </span>
                    <input
                      type="file"
                      accept=".jpg,.jpeg,.png,.pdf"
                      onChange={e => handleFileUpload(e, 'back')}
                      className="hidden"
                    />
                  </label>
                )}
              </div>

              {/* Optional Supporting Document */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Optional Supporting Document (e.g. authorization letter, fee receipt)
                </label>
                {documentFile ? (
                  <div className="flex items-center justify-between p-3 bg-slate-100 rounded-xl">
                    <span className="text-xs text-slate-700 truncate">{documentFile.name}</span>
                    <button
                      type="button"
                      onClick={() => setDocumentFile(null)}
                      className="text-slate-400 hover:text-rose-600 p-1"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <input
                    type="file"
                    accept=".jpg,.jpeg,.png,.pdf"
                    onChange={e => handleFileUpload(e, 'doc')}
                    className="block w-full text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200 cursor-pointer"
                  />
                )}
              </div>
            </div>

            {/* Step 3: Delivery & Contact Details */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
                <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
                  3
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Delivery Address & Contact</h3>
                  <p className="text-xs text-slate-500">Provide accurate address for courier dispatch</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Customer Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="input-customer-name"
                    type="text"
                    required
                    value={customerName}
                    onChange={e => setCustomerName(e.target.value)}
                    placeholder="Full Name"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Mobile Number <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="input-mobile-number"
                    type="tel"
                    required
                    maxLength={10}
                    value={mobile}
                    onChange={e => setMobile(e.target.value)}
                    placeholder="10 digit mobile"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    WhatsApp Number
                  </label>
                  <input
                    id="input-whatsapp-number"
                    type="tel"
                    maxLength={10}
                    value={whatsapp}
                    onChange={e => setWhatsapp(e.target.value)}
                    placeholder="WhatsApp for order updates"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Email Address
                  </label>
                  <input
                    id="input-email-address"
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="Email for invoice & tracking"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Full Street Address (House/Flat No, Landmark) <span className="text-rose-500">*</span>
                </label>
                <textarea
                  id="textarea-address"
                  required
                  rows={2}
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  placeholder="Complete postal address for courier delivery"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    PIN Code <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="input-pincode"
                    type="text"
                    required
                    maxLength={6}
                    value={pincode}
                    onChange={e => setPincode(e.target.value)}
                    placeholder="6 digit PIN"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    District
                  </label>
                  <input
                    id="input-district"
                    type="text"
                    value={district}
                    onChange={e => setDistrict(e.target.value)}
                    placeholder="District / City"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    State
                  </label>
                  <select
                    id="select-state"
                    value={stateName}
                    onChange={e => setStateName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    <option value="West Bengal">West Bengal</option>
                    <option value="Bihar">Bihar</option>
                    <option value="Jharkhand">Jharkhand</option>
                    <option value="Odisha">Odisha</option>
                    <option value="Assam">Assam</option>
                    <option value="Uttar Pradesh">Uttar Pradesh</option>
                    <option value="Delhi">Delhi</option>
                    <option value="Maharashtra">Maharashtra</option>
                    <option value="Other States">Other State / UT</option>
                  </select>
                </div>
              </div>

              {/* Delivery Speed Selector */}
              <div className="pt-2">
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  Delivery Speed Option
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label
                    className={`p-3.5 rounded-xl border cursor-pointer flex items-center justify-between transition-all ${
                      deliveryType === 'Standard Delivery'
                        ? 'border-blue-600 bg-blue-50/50'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <input
                        type="radio"
                        name="deliverySpeed"
                        checked={deliveryType === 'Standard Delivery'}
                        onChange={() => setDeliveryType('Standard Delivery')}
                        className="text-blue-600"
                      />
                      <div>
                        <span className="text-xs font-bold text-slate-800 block">Standard Courier</span>
                        <span className="text-[11px] text-slate-500">3-5 days delivery</span>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-slate-700">
                      {isFreeShipping ? 'FREE' : `₹${settings.standardDeliveryCharge}`}
                    </span>
                  </label>

                  <label
                    className={`p-3.5 rounded-xl border cursor-pointer flex items-center justify-between transition-all ${
                      deliveryType === 'Express Delivery'
                        ? 'border-blue-600 bg-blue-50/50'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <input
                        type="radio"
                        name="deliverySpeed"
                        checked={deliveryType === 'Express Delivery'}
                        onChange={() => setDeliveryType('Express Delivery')}
                        className="text-blue-600"
                      />
                      <div>
                        <span className="text-xs font-bold text-slate-800 block">Express Air Courier</span>
                        <span className="text-[11px] text-slate-500">1-2 days priority air</span>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-slate-700">
                      {isFreeShipping ? '₹50' : `₹${settings.expressDeliveryCharge}`}
                    </span>
                  </label>
                </div>
              </div>

              {/* PDF Password / Additional Notes */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Additional Notes (e.g. PDF password if protected, special cropping instructions)
                </label>
                <input
                  id="input-notes"
                  type="text"
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder="e.g. Aadhaar PDF password: RAHU1996"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Right Summary & Price Breakdown Sticky Box (5 cols) */}
          <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-md space-y-5">
              <h3 className="font-extrabold text-slate-900 text-lg border-b border-slate-100 pb-3 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-blue-600" />
                <span>Order Summary</span>
              </h3>

              {/* Selected Service Card snippet */}
              <div className="flex items-start justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                <div>
                  <h4 className="font-bold text-xs text-slate-900">{selectedService.name}</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">800 Micron Solid PVC</p>
                  <span className="inline-block text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded mt-1.5">
                    Qty: {quantity} Card{quantity > 1 ? 's' : ''}
                  </span>
                </div>
                <div className="text-right">
                  <span className="font-extrabold text-sm text-slate-900">₹{subtotal}</span>
                  <p className="text-[10px] text-slate-400">₹{unitPrice} / card</p>
                </div>
              </div>

              {/* Coupon Code Section */}
              <div className="pt-1">
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Have a Coupon Code?
                </label>
                {appliedCoupon ? (
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800">
                    <div className="flex items-center gap-1.5">
                      <Tag className="w-4 h-4 text-emerald-600" />
                      <span>{appliedCoupon.code} Applied (-₹{appliedCoupon.discount})</span>
                    </div>
                    <button
                      type="button"
                      onClick={handleRemoveCoupon}
                      className="text-rose-600 hover:text-rose-800 text-[11px] underline"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={couponCode}
                        onChange={e => setCouponCode(e.target.value.toUpperCase())}
                        placeholder="Try: WELCOME50 or BULK10"
                        className="flex-1 px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono uppercase focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        type="button"
                        onClick={handleApplyCoupon}
                        className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors"
                      >
                        Apply
                      </button>
                    </div>
                    {couponError && (
                      <p className="text-[11px] text-rose-600 font-medium">{couponError}</p>
                    )}
                  </div>
                )}
              </div>

              {/* Line Items Calculation */}
              <div className="space-y-2.5 pt-2 border-t border-slate-100 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span>Card Printing Price ({quantity}x)</span>
                  <span className="font-semibold text-slate-800">₹{subtotal}</span>
                </div>

                <div className="flex justify-between">
                  <span className="flex items-center gap-1">
                    <Truck className="w-3.5 h-3.5 text-slate-400" />
                    Delivery Charges
                  </span>
                  <span className="font-semibold text-slate-800">
                    {shippingCharge === 0 ? (
                      <span className="text-emerald-600 font-bold">FREE</span>
                    ) : (
                      `₹${shippingCharge}`
                    )}
                  </span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-semibold">
                    <span>Coupon Discount</span>
                    <span>-₹{discount}</span>
                  </div>
                )}

                <div className="pt-3 border-t border-slate-200 flex justify-between items-baseline">
                  <span className="text-sm font-extrabold text-slate-900">Grand Total</span>
                  <div className="text-right">
                    <span className="text-2xl font-black text-slate-900">₹{grandTotal}</span>
                    <p className="text-[10px] text-slate-400 font-medium">Inclusive of all taxes</p>
                  </div>
                </div>
              </div>

              {/* Terms Checkbox */}
              <div className="pt-2">
                <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-600">
                  <input
                    id="checkbox-terms"
                    type="checkbox"
                    checked={acceptTerms}
                    onChange={e => setAcceptTerms(e.target.checked)}
                    className="mt-0.5 rounded text-blue-600 focus:ring-blue-500"
                  />
                  <span>
                    I confirm that I am authorized to print this document and I agree to the{' '}
                    <button
                      type="button"
                      onClick={() => navigate('terms')}
                      className="text-blue-600 font-semibold underline"
                    >
                      Terms & Conditions
                    </button>
                    .
                  </span>
                </label>
              </div>

              {/* Submit CTA */}
              <button
                id="btn-submit-order"
                type="submit"
                disabled={submitting}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-50 text-white font-extrabold py-3.5 px-6 rounded-xl shadow-lg shadow-blue-500/25 transition-all text-sm flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <span>Generating Order...</span>
                ) : (
                  <>
                    <span>Place Order & Pay ₹{grandTotal}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="text-center text-[11px] text-slate-400 flex items-center justify-center gap-1.5 pt-1">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>100% Secure UPI Payment & Data Privacy</span>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
