import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Settings,
  Save,
  QrCode,
  Truck,
  Phone,
  Mail,
  MapPin,
  Megaphone,
  HardDrive,
  ShieldCheck
} from 'lucide-react';

export const AdminSettingsTab: React.FC = () => {
  const { settings, updateSettings, showToast } = useApp();

  const [siteName, setSiteName] = useState(settings.siteName);
  const [tagline, setTagline] = useState(settings.tagline);
  const [contactNumber, setContactNumber] = useState(settings.contactNumber);
  const [whatsappNumber, setWhatsappNumber] = useState(settings.whatsappNumber);
  const [email, setEmail] = useState(settings.email);
  const [address, setAddress] = useState(settings.address);
  const [upiId, setUpiId] = useState(settings.upiId);
  const [upiMerchantName, setUpiMerchantName] = useState(settings.upiMerchantName);
  const [standardDeliveryCharge, setStandardDeliveryCharge] = useState(settings.standardDeliveryCharge);
  const [expressDeliveryCharge, setExpressDeliveryCharge] = useState(settings.expressDeliveryCharge);
  const [freeShippingThreshold, setFreeShippingThreshold] = useState(settings.freeShippingThreshold);
  const [announcementBanner, setAnnouncementBanner] = useState(settings.announcementBanner);
  const [bannerActive, setBannerActive] = useState(settings.bannerActive);
  const [maxUploadSizeMB, setMaxUploadSizeMB] = useState(settings.maxUploadSizeMB);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    updateSettings({
      siteName: siteName.trim(),
      tagline: tagline.trim(),
      contactNumber: contactNumber.trim(),
      whatsappNumber: whatsappNumber.trim(),
      email: email.trim(),
      address: address.trim(),
      upiId: upiId.trim(),
      upiMerchantName: upiMerchantName.trim(),
      standardDeliveryCharge: Number(standardDeliveryCharge),
      expressDeliveryCharge: Number(expressDeliveryCharge),
      freeShippingThreshold: Number(freeShippingThreshold),
      announcementBanner: announcementBanner.trim(),
      bannerActive,
      maxUploadSizeMB: Number(maxUploadSizeMB)
    });

    showToast('Website and UPI settings saved successfully!', 'success');
  };

  return (
    <form onSubmit={handleSave} className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Website & UPI Configuration</h1>
          <p className="text-xs text-slate-500">
            Configure merchant UPI payment parameters, shipping fees, bureau address, and banner notices.
          </p>
        </div>

        <button
          type="submit"
          className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-extrabold shadow-sm transition-colors shrink-0"
        >
          <Save className="w-4 h-4" />
          <span>Save Changes</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* UPI Payment Configuration */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <QrCode className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900">UPI Payment Parameters</h3>
              <p className="text-[11px] text-slate-500">
                Used to dynamically generate QR codes and intent links
              </p>
            </div>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Merchant / Business UPI ID <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={upiId}
                onChange={e => setUpiId(e.target.value)}
                placeholder="e.g. rezaenterprise@okaxis"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 font-mono font-semibold"
              />
              <span className="text-[11px] text-slate-400 mt-0.5 block">
                QR codes generated will route customer payments to this UPI VPA.
              </span>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Payee / Merchant Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={upiMerchantName}
                onChange={e => setUpiMerchantName(e.target.value)}
                placeholder="e.g. Reza Enterprise PVC Print"
                className="w-full px-3 py-2 rounded-xl border border-slate-200"
              />
            </div>
          </div>
        </div>

        {/* Shipping & Delivery Rules */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Truck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900">Shipping Rates & Thresholds</h3>
              <p className="text-[11px] text-slate-500">
                Courier fee calculations applied at checkout
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Standard Shipping (₹)
              </label>
              <input
                type="number"
                value={standardDeliveryCharge}
                onChange={e => setStandardDeliveryCharge(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-slate-200"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Express Air Shipping (₹)
              </label>
              <input
                type="number"
                value={expressDeliveryCharge}
                onChange={e => setExpressDeliveryCharge(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-slate-200"
              />
            </div>

            <div className="col-span-2">
              <label className="block font-bold text-slate-700 mb-1">
                Free Shipping Minimum Order Amount (₹)
              </label>
              <input
                type="number"
                value={freeShippingThreshold}
                onChange={e => setFreeShippingThreshold(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 font-bold text-emerald-600"
              />
              <span className="text-[11px] text-slate-400 mt-0.5 block">
                Orders with card subtotal equal to or exceeding this threshold get free shipping.
              </span>
            </div>
          </div>
        </div>

        {/* Bureau Contact & Location */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Phone className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900">Support Numbers & Address</h3>
              <p className="text-[11px] text-slate-500">
                Shown on customer footer, header, and printable invoices
              </p>
            </div>
          </div>

          <div className="space-y-3 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Contact Phone</label>
                <input
                  type="text"
                  value={contactNumber}
                  onChange={e => setContactNumber(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">WhatsApp Helpline</label>
                <input
                  type="text"
                  value={whatsappNumber}
                  onChange={e => setWhatsappNumber(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Official Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Printing Workshop & Dispatch Address
              </label>
              <textarea
                rows={2}
                value={address}
                onChange={e => setAddress(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200"
              />
            </div>
          </div>
        </div>

        {/* Announcement Banner & Upload Limit */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Megaphone className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900">Announcement & Limits</h3>
              <p className="text-[11px] text-slate-500">Top notification bar and file upload limits</p>
            </div>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Announcement Banner Text
              </label>
              <input
                type="text"
                value={announcementBanner}
                onChange={e => setAnnouncementBanner(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200"
              />
            </div>

            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="banner-active-checkbox"
                checked={bannerActive}
                onChange={e => setBannerActive(e.target.checked)}
                className="rounded text-blue-600"
              />
              <label htmlFor="banner-active-checkbox" className="font-bold text-slate-700">
                Display top announcement banner on customer website
              </label>
            </div>

            <div className="pt-2">
              <label className="block font-bold text-slate-700 mb-1">
                Maximum File Upload Size (MB)
              </label>
              <input
                type="number"
                value={maxUploadSizeMB}
                onChange={e => setMaxUploadSizeMB(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-slate-200"
              />
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};
