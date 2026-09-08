import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  MessageCircle,
  Send,
  CheckCircle2,
  HelpCircle
} from 'lucide-react';

export const ContactPage: React.FC = () => {
  const { settings, showToast, navigate } = useApp();

  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('Order Status Query');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !mobile.trim() || !message.trim()) {
      showToast('Please fill all required fields', 'error');
      return;
    }

    setSubmitted(true);
    showToast('Your message has been received! Our support agent will reach out soon.', 'success');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-extrabold uppercase tracking-widest text-blue-600 bg-blue-50 px-3 py-1 rounded-md">
          Customer Support
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
          Contact Reza Enterprise
        </h1>
        <p className="text-slate-600 text-sm sm:text-base">
          Have questions regarding card printing, document uploads, bulk quotes, or tracking? Reach out to our dedicated support team.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Contact Info Cards (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="font-bold text-base text-slate-900 border-b border-slate-100 pb-3">
              Direct Contact Details
            </h3>

            {/* WhatsApp Card */}
            <a
              href={`https://wa.me/${settings.whatsappNumber.replace(/[^0-9]/g, '')}?text=Hello%20Reza%20Enterprise,%20I%20have%20an%20inquiry.`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 rounded-xl bg-emerald-50 hover:bg-emerald-100/80 border border-emerald-200 flex items-start gap-3.5 transition-colors group block"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                <MessageCircle className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-extrabold text-emerald-800 uppercase">
                  Fastest Support
                </span>
                <h4 className="text-sm font-bold text-slate-900 group-hover:text-emerald-700">
                  WhatsApp Direct Chat
                </h4>
                <p className="text-xs font-semibold text-emerald-700 mt-0.5">
                  {settings.whatsappNumber}
                </p>
                <span className="text-[11px] text-slate-500 mt-1 block">
                  Replies typically within 10-15 minutes
                </span>
              </div>
            </a>

            {/* Phone Card */}
            <a
              href={`tel:${settings.contactNumber}`}
              className="p-4 rounded-xl bg-slate-50 hover:bg-blue-50/50 border border-slate-200 flex items-start gap-3.5 transition-colors group block"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 group-hover:text-blue-600">
                  Customer Helpline
                </h4>
                <p className="text-xs font-semibold text-slate-700 mt-0.5">
                  {settings.contactNumber}
                </p>
                <span className="text-[11px] text-slate-500 mt-1 block">
                  Mon - Sat: 9:00 AM - 8:00 PM IST
                </span>
              </div>
            </a>

            {/* Email */}
            <a
              href={`mailto:${settings.email}`}
              className="p-4 rounded-xl bg-slate-50 hover:bg-blue-50/50 border border-slate-200 flex items-start gap-3.5 transition-colors group block"
            >
              <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600">
                  Official Email
                </h4>
                <p className="text-xs font-semibold text-slate-700 mt-0.5">{settings.email}</p>
                <span className="text-[11px] text-slate-500 mt-1 block">
                  For bulk orders, school proposals & partnerships
                </span>
              </div>
            </a>

            {/* Bureau Address */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-slate-800 text-white flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">Printing Bureau & Dispatch</h4>
                <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                  {settings.address}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form (7 cols) */}
        <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="font-bold text-lg text-slate-900">Send an Online Message</h3>
            <p className="text-xs text-slate-500">
              Leave your contact info and our team will get in touch promptly
            </p>
          </div>

          {submitted ? (
            <div className="p-8 text-center bg-emerald-50 rounded-2xl border border-emerald-200 space-y-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
              <h4 className="font-bold text-base text-emerald-900">Message Dispatched!</h4>
              <p className="text-xs text-emerald-800 max-w-sm mx-auto">
                Thank you, <b>{name}</b>. Your message regarding &ldquo;{subject}&rdquo; has been logged. We will contact you at {mobile}.
              </p>
              <button
                type="button"
                onClick={() => setSubmitted(false)}
                className="mt-2 px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Your Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Full name"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Mobile Number <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="contact-mobile"
                    type="tel"
                    required
                    maxLength={10}
                    value={mobile}
                    onChange={e => setMobile(e.target.value)}
                    placeholder="10 digit mobile"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Email Address
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="youremail@example.com"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Subject Query
                  </label>
                  <select
                    id="contact-subject"
                    value={subject}
                    onChange={e => setSubject(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    <option value="Order Status Query">Existing Order Status Query</option>
                    <option value="Bulk School/Office Quote">Bulk Order / Corporate Pricing</option>
                    <option value="Document Upload Issue">Document / PDF Upload Help</option>
                    <option value="Payment / UTR Confirmation">Payment / UTR Confirmation</option>
                    <option value="Other Feedback">Other Inquiry</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Message Details <span className="text-rose-500">*</span>
                </label>
                <textarea
                  id="contact-message"
                  required
                  rows={4}
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  placeholder="Please describe your inquiry or mention your Order ID if applicable..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <button
                id="btn-contact-submit"
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-extrabold py-3 px-4 rounded-xl text-sm transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                <Send className="w-4 h-4" />
                <span>Submit Inquiry</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
