import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  CreditCard,
  Printer,
  Search,
  CheckCircle2,
  ShieldCheck,
  Truck,
  ArrowRight,
  UploadCloud,
  QrCode,
  Sparkles,
  ChevronDown,
  Star,
  Award,
  PhoneCall,
  Clock,
  Layers
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const { navigate, services, settings } = useApp();
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const activeServices = services.filter(s => s.active);

  const faqs = [
    {
      q: 'What is the quality of the PVC cards?',
      a: 'We use premium standard CR80 ISO-standard 800-micron solid PVC card stock (same size and thickness as a bank debit card) printed using high-resolution Japanese dye-sublimation thermal printers at 300+ DPI. They are 100% waterproof, smudge-proof, and fade-resistant.'
    },
    {
      q: 'Will the QR code on my Aadhaar or Ayushman card be scannable?',
      a: 'Yes, 100% guaranteed! We optimize the vector contrast before printing so all QR codes (Aadhaar UIDAI, Ayushman PMJAY, Driving Licence, ABHA) scan instantly on any mobile scanner app.'
    },
    {
      q: 'How do I submit my document for printing?',
      a: 'Simply choose your card type on our Order page, upload your official e-card PDF (e.g. e-Aadhaar, e-PAN) or clear photos of the front and back sides. If your PDF is password protected (like e-Aadhaar), you can write the password in the notes.'
    },
    {
      q: 'How long does delivery take?',
      a: 'Orders are printed and dispatched within 24 to 48 hours. Standard delivery via Speed Post / Delhivery takes 3 to 5 working days depending on your location. Express delivery options are also available.'
    },
    {
      q: 'How do I pay using UPI?',
      a: 'After placing your order, you can scan our dynamic UPI QR code or click "Pay Now Using UPI" to pay directly through PhonePe, Google Pay, Paytm, or BHIM. Enter your UTR / Transaction ID to confirm.'
    },
    {
      q: 'Is my personal information secure?',
      a: 'We treat customer privacy with the utmost confidentiality. Uploaded documents are solely used to print your requested card, stored in secure encrypted buckets, and never shared with third parties.'
    }
  ];

  return (
    <div className="space-y-20 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-50/80 via-white to-slate-50 pt-12 pb-20 lg:pt-20 lg:pb-28 border-b border-slate-200">
        {/* Decorative ambient blobs */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-r from-blue-200/30 to-indigo-200/30 blur-3xl -z-10 pointer-events-none rounded-full" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Hero Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100/80 border border-blue-200 text-blue-800 text-xs sm:text-sm font-semibold shadow-xs">
                <Sparkles className="w-4 h-4 text-blue-600 shrink-0" />
                <span>India&apos;s #1 ISO-Grade PVC Card Print Service</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
                Professional PVC Card Printing{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700">
                  Delivered To Your Doorstep
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                Transform fragile paper printouts and e-cards into durable, waterproof, 800-micron CR80 PVC identity cards. High-definition 300 DPI thermal dye printing with 100% scannable QR codes.
              </p>

              {/* Primary Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
                <button
                  id="hero-order-now-btn"
                  onClick={() => navigate('order')}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-blue-600 hover:bg-blue-500 text-white text-base font-bold px-7 py-3.5 rounded-xl shadow-lg shadow-blue-600/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
                >
                  <Printer className="w-5 h-5" />
                  <span>Order PVC Card</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </button>

                <button
                  id="hero-track-order-btn"
                  onClick={() => navigate('track-order')}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 text-base font-bold px-6 py-3.5 rounded-xl shadow-xs transition-all"
                >
                  <Search className="w-5 h-5 text-slate-600" />
                  <span>Track Order</span>
                </button>
              </div>

              {/* Key Trust Signals */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-slate-200/80">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>₹49 Starting Price</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>300 DPI HD Print</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Waterproof PVC</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>All India Delivery</span>
                </div>
              </div>
            </div>

            {/* Right Interactive Mockup Visual */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-full max-w-md">
                {/* Visual PVC Card Mockup Stack */}
                <div className="relative mx-auto w-80 h-52 sm:w-96 sm:h-60 rounded-2xl p-6 bg-gradient-to-br from-slate-900 via-indigo-950 to-blue-950 text-white shadow-2xl border border-white/20 transform rotate-2 hover:rotate-0 transition-transform duration-500 flex flex-col justify-between overflow-hidden">
                  {/* Card Gloss Sheen */}
                  <div className="absolute top-0 right-0 w-96 h-40 bg-gradient-to-b from-white/15 to-transparent -rotate-45 transform pointer-events-none" />

                  <div className="flex items-start justify-between z-10">
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-7 h-7 text-amber-400" />
                      <div>
                        <p className="text-[10px] font-bold text-amber-300 tracking-wider uppercase">
                          GOVERNMENT OF INDIA
                        </p>
                        <h4 className="text-sm font-extrabold tracking-wide">AADHAAR PVC CARD</h4>
                      </div>
                    </div>
                    <div className="w-8 h-8 rounded bg-amber-400/20 border border-amber-300/40 flex items-center justify-center">
                      <QrCode className="w-5 h-5 text-amber-300" />
                    </div>
                  </div>

                  <div className="flex items-center gap-4 z-10">
                    <div className="w-14 h-16 rounded-md bg-slate-700/80 border border-white/30 flex items-center justify-center overflow-hidden">
                      <div className="w-full h-full bg-gradient-to-t from-slate-800 to-slate-600 flex items-end justify-center pb-1">
                        <span className="text-[9px] text-slate-300 font-mono">PHOTO</span>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[11px] text-slate-300">Name / Name</p>
                      <p className="text-sm font-bold tracking-wide">RAHUL SHARMA</p>
                      <p className="text-[10px] text-slate-400">DOB: 15/08/1996 | Male</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-white/15 z-10">
                    <span className="font-mono text-base tracking-widest font-bold text-amber-200">
                      XXXX XXXX 9821
                    </span>
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded font-bold">
                      VERIFIED PVC
                    </span>
                  </div>
                </div>

                {/* Floating pill badges */}
                <div className="absolute -bottom-5 -left-4 bg-white rounded-xl shadow-lg border border-slate-200 p-3 flex items-center gap-3 animate-bounce duration-1000">
                  <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">800 Micron Solid</p>
                    <p className="text-[11px] text-slate-500">Unbendable & Long Lasting</p>
                  </div>
                </div>

                <div className="absolute -top-4 -right-4 bg-white rounded-xl shadow-lg border border-slate-200 p-2.5 flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
                    <Truck className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-bold text-slate-900">Fast Dispatch</p>
                    <p className="text-[10px] text-slate-500">24-48 Hours</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-extrabold uppercase tracking-widest text-blue-600 bg-blue-50 px-3 py-1 rounded-md">
            Our Card Services
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 mt-3">
            Choose Your PVC Card Category
          </h2>
          <p className="text-slate-600 mt-2 text-sm sm:text-base">
            Select your identity or document type to order high quality thermal PVC print with doorstep shipping.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {activeServices.slice(0, 8).map(service => (
            <div
              key={service.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1"
            >
              <div>
                <div className="flex items-start justify-between mb-3">
                  <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md">
                    {service.category}
                  </span>
                  {service.badge && (
                    <span className="text-[11px] font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-md">
                      {service.badge}
                    </span>
                  )}
                </div>

                <h3 className="font-bold text-slate-900 text-base group-hover:text-blue-600 transition-colors">
                  {service.name}
                </h3>
                <p className="text-xs text-slate-500 mt-1.5 line-clamp-2 leading-relaxed">
                  {service.description}
                </p>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    {service.turnaroundTime}
                  </span>
                  <span className="flex items-center gap-1">
                    <Truck className="w-3.5 h-3.5 text-slate-400" />
                    ₹{service.deliveryCharge} Shipping
                  </span>
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-lg font-extrabold text-slate-900">₹{service.offerPrice}</span>
                    <span className="text-xs text-slate-400 line-through">₹{service.price}</span>
                  </div>
                  <span className="text-[10px] text-emerald-600 font-bold">
                    Save ₹{service.price - service.offerPrice}
                  </span>
                </div>

                <button
                  id={`btn-service-order-${service.id}`}
                  onClick={() => navigate('order', { serviceId: service.id })}
                  className="inline-flex items-center gap-1 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-3.5 py-2 rounded-xl transition-all shadow-xs"
                >
                  <span>Order Now</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <button
            onClick={() => navigate('services')}
            className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold px-6 py-3 rounded-xl text-sm transition-all"
          >
            <span>View All {services.length} PVC Card Services</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-slate-100/70 py-16 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-extrabold uppercase tracking-widest text-blue-600 bg-blue-50 px-3 py-1 rounded-md">
              Simple 4-Step Process
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 mt-3">
              How To Order Your PVC Card
            </h2>
            <p className="text-slate-600 mt-2 text-sm sm:text-base">
              Fast, completely contactless, and secure. We handle printing and ship directly to your home address.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
            {/* Step 1 */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs relative">
              <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center font-extrabold text-lg mb-4 shadow-md shadow-blue-500/20">
                1
              </div>
              <h3 className="font-bold text-slate-900 text-base mb-2">Select Card Type</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Choose Aadhaar, PAN, Voter, Driving Licence, or Custom ID. Specify quantity and your delivery address.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs relative">
              <div className="w-12 h-12 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-extrabold text-lg mb-4 shadow-md shadow-indigo-500/20">
                2
              </div>
              <h3 className="font-bold text-slate-900 text-base mb-2">Upload Document</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Upload your official e-card PDF or front & back photos. Preview image and confirm details.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs relative">
              <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-extrabold text-lg mb-4 shadow-md shadow-emerald-500/20">
                3
              </div>
              <h3 className="font-bold text-slate-900 text-base mb-2">Pay via UPI</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Scan UPI QR code or pay using PhonePe, Google Pay, or Paytm. Submit UTR / transaction number.
              </p>
            </div>

            {/* Step 4 */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs relative">
              <div className="w-12 h-12 rounded-xl bg-slate-900 text-white flex items-center justify-center font-extrabold text-lg mb-4 shadow-md shadow-slate-900/20">
                4
              </div>
              <h3 className="font-bold text-slate-900 text-base mb-2">Print & Delivery</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                We print on high-grade solid PVC, check quality, pack in protective envelopes, and courier with live tracking.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features & Why Reza Enterprise */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <span className="text-xs font-extrabold uppercase tracking-widest text-blue-600 bg-blue-50 px-3 py-1 rounded-md">
              Superior Print Standards
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 leading-tight">
              Why Choose Reza Enterprise for PVC Card Printing?
            </h2>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              We specialize exclusively in high-durability thermal plastic card printing. Unlike ordinary photo paper lamination that peels off or fades after moisture exposure, our dye-sublimated PVC cards are permanent and waterproof.
            </p>

            <div className="space-y-4 pt-2">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center shrink-0 mt-1">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">Official Bank Card Dimensions (CR80)</h4>
                  <p className="text-xs text-slate-500">
                    Exact 85.6mm × 53.98mm dimensions with smoothly rounded corners, fitting perfectly into any standard wallet card slot.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center shrink-0 mt-1">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">Ultra Sharp 300+ DPI Thermal Sublimation</h4>
                  <p className="text-xs text-slate-500">
                    Fine micro-text, national emblems, and official barcodes stay tack-sharp and tamper-resistant.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center shrink-0 mt-1">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">Double Sided Protective Overlay</h4>
                  <p className="text-xs text-slate-500">
                    Clear transparent protective laminate shielding print ink from sunlight UV, keys scratch, and rain water.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <button
                onClick={() => navigate('pricing')}
                className="inline-flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-800"
              >
                <span>Check Bulk Card Pricing & Volume Discounts</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="lg:col-span-6 bg-gradient-to-br from-blue-900 to-indigo-950 p-8 rounded-3xl text-white shadow-xl relative overflow-hidden">
            <h3 className="text-xl font-extrabold mb-3">PVC Card vs. Paper Lamination</h3>
            <p className="text-xs text-blue-200 mb-6">See why millions are switching to solid PVC smart cards:</p>

            <div className="space-y-3">
              <div className="bg-white/10 p-4 rounded-xl border border-white/15 flex items-center justify-between">
                <span className="text-xs font-semibold">Water & Rain Resistance</span>
                <span className="text-xs font-bold text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded">
                  100% Waterproof PVC
                </span>
              </div>
              <div className="bg-white/10 p-4 rounded-xl border border-white/15 flex items-center justify-between">
                <span className="text-xs font-semibold">Material Thickness</span>
                <span className="text-xs font-bold text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded">
                  800 Micron Solid
                </span>
              </div>
              <div className="bg-white/10 p-4 rounded-xl border border-white/15 flex items-center justify-between">
                <span className="text-xs font-semibold">Durability & Lifespan</span>
                <span className="text-xs font-bold text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded">
                  5 - 10+ Years
                </span>
              </div>
              <div className="bg-white/10 p-4 rounded-xl border border-white/15 flex items-center justify-between">
                <span className="text-xs font-semibold">Edge Peeling</span>
                <span className="text-xs font-bold text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded">
                  Never Peels
                </span>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-white/15 text-center">
              <button
                onClick={() => navigate('order')}
                className="w-full bg-white hover:bg-blue-50 text-blue-950 font-bold py-3.5 px-6 rounded-xl transition-colors text-sm shadow-md"
              >
                Order Your Solid PVC Card Today
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-white py-16 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-extrabold uppercase tracking-widest text-blue-600 bg-blue-50 px-3 py-1 rounded-md">
              Customer Feedback
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
              Trusted by Over 10,000+ Happy Customers
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 flex flex-col justify-between">
              <div>
                <div className="flex text-amber-400 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <p className="text-xs text-slate-700 italic leading-relaxed">
                  &ldquo;I ordered an Aadhaar and Ayushman PVC card. The printing quality is top-notch! The QR code scanned right away at the hospital. Received via courier in 3 days.&rdquo;
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-200/80">
                <h4 className="font-bold text-xs text-slate-900">Subhashree Das</h4>
                <p className="text-[10px] text-slate-500">Kolkata, West Bengal</p>
              </div>
            </div>

            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 flex flex-col justify-between">
              <div>
                <div className="flex text-amber-400 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <p className="text-xs text-slate-700 italic leading-relaxed">
                  &ldquo;My Driving Licence paper was torn. Ordered DL PVC print from Reza Enterprise. Looks exactly like original smart card with crisp text. Very easy UPI payment.&rdquo;
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-200/80">
                <h4 className="font-bold text-xs text-slate-900">Mohit Verma</h4>
                <p className="text-[10px] text-slate-500">Patna, Bihar</p>
              </div>
            </div>

            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 flex flex-col justify-between">
              <div>
                <div className="flex text-amber-400 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <p className="text-xs text-slate-700 italic leading-relaxed">
                  &ldquo;Ordered 50 student ID cards for our tuition coaching batch. Got great bulk discount and quick courier delivery. Will definitely order again!&rdquo;
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-200/80">
                <h4 className="font-bold text-xs text-slate-900">Anil Mukherjee</h4>
                <p className="text-[10px] text-slate-500">Siliguri, West Bengal</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <span className="text-xs font-extrabold uppercase tracking-widest text-blue-600 bg-blue-50 px-3 py-1 rounded-md">
            Common Questions
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs"
            >
              <button
                onClick={() => setOpenFaq(openFaq === index ? null : index)}
                className="w-full text-left px-5 py-4 flex items-center justify-between font-bold text-sm text-slate-800 hover:text-blue-600 transition-colors"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  className={`w-4 h-4 text-slate-400 transition-transform duration-200 shrink-0 ml-3 ${
                    openFaq === index ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {openFaq === index && (
                <div className="px-5 pb-5 pt-1 text-xs text-slate-600 leading-relaxed border-t border-slate-100">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Quick Contact & WhatsApp Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 rounded-3xl p-8 sm:p-12 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-2xl sm:text-3xl font-extrabold">Need Help with Your Order?</h3>
            <p className="text-blue-100 text-sm max-w-xl">
              Have bulk order requirements or questions about file formats? Our friendly customer support is available every day from 9 AM to 9 PM.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <a
              href={`https://wa.me/${settings.whatsappNumber.replace(/[^0-9]/g, '')}?text=Hello%20Reza%20Enterprise,%20I%20need%20help%20with%20PVC%20card%20printing.`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-white font-bold px-5 py-3 rounded-xl text-sm transition-all shadow-md"
            >
              <PhoneCall className="w-4 h-4" />
              <span>WhatsApp Us</span>
            </a>
            <button
              onClick={() => navigate('contact')}
              className="inline-flex items-center gap-2 bg-white hover:bg-slate-100 text-slate-900 font-bold px-5 py-3 rounded-xl text-sm transition-all shadow-md"
            >
              <span>Contact Support</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
