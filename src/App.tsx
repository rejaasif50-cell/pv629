/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { ToastContainer } from './components/common/ToastContainer';
import { FloatingWhatsApp } from './components/common/FloatingWhatsApp';

// Customer Pages
import { HomePage } from './pages/HomePage';
import { ServicesPage } from './pages/ServicesPage';
import { OrderPage } from './pages/OrderPage';
import { PaymentPage } from './pages/PaymentPage';
import { TrackOrderPage } from './pages/TrackOrderPage';
import { MyOrdersPage } from './pages/MyOrdersPage';
import { PricingPage } from './pages/PricingPage';
import { CustomerDashboard } from './pages/CustomerDashboard';
import { InvoicePage } from './pages/InvoicePage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { TermsPage } from './pages/TermsPage';
import { PrivacyPolicyPage } from './pages/PrivacyPolicyPage';

// Auth Pages
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { AdminLoginPage } from './pages/auth/AdminLoginPage';

// Admin Panel
import { AdminPanelPage } from './pages/admin/AdminPanelPage';

const AppContent: React.FC = () => {
  const { currentView } = useApp();

  // Scroll to top on view change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentView]);

  const isAdminView =
    currentView === 'admin-dashboard' ||
    currentView === 'admin-orders' ||
    currentView === 'admin-services' ||
    currentView === 'admin-payments' ||
    currentView === 'admin-settings';

  const isInvoiceView = currentView === 'invoice';

  const renderCurrentView = () => {
    switch (currentView) {
      case 'home':
        return <HomePage />;
      case 'services':
        return <ServicesPage />;
      case 'order':
        return <OrderPage />;
      case 'payment':
        return <PaymentPage />;
      case 'track-order':
        return <TrackOrderPage />;
      case 'my-orders':
        return <MyOrdersPage />;
      case 'pricing':
        return <PricingPage />;
      case 'customer-dashboard':
        return <CustomerDashboard />;
      case 'invoice':
        return <InvoicePage />;
      case 'about':
        return <AboutPage />;
      case 'contact':
        return <ContactPage />;
      case 'login':
        return <LoginPage />;
      case 'register':
        return <RegisterPage />;
      case 'admin-login':
        return <AdminLoginPage />;
      case 'admin-dashboard':
      case 'admin-orders':
      case 'admin-services':
      case 'admin-payments':
      case 'admin-settings':
        return <AdminPanelPage />;
      case 'terms':
        return <TermsPage />;
      case 'privacy':
        return <PrivacyPolicyPage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans antialiased selection:bg-blue-600 selection:text-white">
      {/* Toast notifications */}
      <ToastContainer />

      {/* Show Navbar on customer views */}
      {!isAdminView && <Navbar />}

      {/* Main content body */}
      <main className="flex-1">{renderCurrentView()}</main>

      {/* Show Footer on non-admin views */}
      {!isAdminView && !isInvoiceView && <Footer />}

      {/* Floating WhatsApp Support Button on non-admin views */}
      {!isAdminView && <FloatingWhatsApp />}
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
