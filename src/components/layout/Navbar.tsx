import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  CreditCard,
  Printer,
  Search,
  Bell,
  User,
  Menu,
  X,
  ShieldCheck,
  Package,
  LogOut,
  ChevronRight,
  ExternalLink,
  Sparkles
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    currentView,
    navigate,
    currentUser,
    logout,
    settings,
    notifications,
    markNotificationRead,
    loginWithDemo
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleNav = (view: string, params?: any) => {
    setMobileMenuOpen(false);
    navigate(view, params);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      {/* Top Banner Announcement */}
      {settings.bannerEnabled && settings.announcementBanner && (
        <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-800 text-white text-xs sm:text-sm py-2 px-4 text-center font-medium flex items-center justify-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-300 animate-pulse shrink-0" />
          <span className="truncate">{settings.announcementBanner}</span>
          <button
            onClick={() => handleNav('order')}
            className="underline underline-offset-2 ml-2 font-bold hover:text-amber-200 shrink-0"
          >
            Order Now &rarr;
          </button>
        </div>
      )}

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Logo & Brand */}
          <div
            id="brand-logo-btn"
            onClick={() => handleNav('home')}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <CreditCard className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg sm:text-xl tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors">
                  REZA ENTERPRISE
                </span>
                <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-1.5 py-0.5 rounded">
                  PVC PRINT
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium hidden sm:block">
                ISO Certified HD Card Printing Service
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2 text-sm font-semibold text-slate-600">
            <button
              id="nav-home"
              onClick={() => handleNav('home')}
              className={`px-3 py-2 rounded-lg transition-colors ${
                currentView === 'home' ? 'text-blue-600 bg-blue-50 font-bold' : 'hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Home
            </button>
            <button
              id="nav-services"
              onClick={() => handleNav('services')}
              className={`px-3 py-2 rounded-lg transition-colors ${
                currentView === 'services' ? 'text-blue-600 bg-blue-50 font-bold' : 'hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Services
            </button>
            <button
              id="nav-order"
              onClick={() => handleNav('order')}
              className={`px-3 py-2 rounded-lg transition-colors flex items-center gap-1.5 ${
                currentView === 'order' ? 'text-blue-600 bg-blue-50 font-bold' : 'text-blue-700 hover:bg-blue-50'
              }`}
            >
              <Printer className="w-4 h-4" />
              Order PVC Card
            </button>
            <button
              id="nav-pricing"
              onClick={() => handleNav('pricing')}
              className={`px-3 py-2 rounded-lg transition-colors ${
                currentView === 'pricing' ? 'text-blue-600 bg-blue-50 font-bold' : 'hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Pricing
            </button>
            <button
              id="nav-track"
              onClick={() => handleNav('track-order')}
              className={`px-3 py-2 rounded-lg transition-colors flex items-center gap-1 ${
                currentView === 'track-order' ? 'text-blue-600 bg-blue-50 font-bold' : 'hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Search className="w-4 h-4" />
              Track Order
            </button>
            <button
              id="nav-about"
              onClick={() => handleNav('about')}
              className={`px-3 py-2 rounded-lg transition-colors ${
                currentView === 'about' ? 'text-blue-600 bg-blue-50 font-bold' : 'hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              About Us
            </button>
            <button
              id="nav-contact"
              onClick={() => handleNav('contact')}
              className={`px-3 py-2 rounded-lg transition-colors ${
                currentView === 'contact' ? 'text-blue-600 bg-blue-50 font-bold' : 'hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Contact
            </button>
          </nav>

          {/* Right Action Icons & Auth */}
          <div className="flex items-center gap-2.5">
            {/* Notification Bell */}
            <div className="relative">
              <button
                id="btn-nav-notifications"
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-colors"
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center ring-2 ring-white animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notification Popup Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 py-3 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                    <span className="font-bold text-sm text-slate-800">Notifications</span>
                    <span className="text-xs text-slate-500">{notifications.length} updates</span>
                  </div>
                  <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                    {notifications.length === 0 ? (
                      <p className="text-center py-6 text-xs text-slate-400">No notifications yet</p>
                    ) : (
                      notifications.slice(0, 5).map(n => (
                        <div
                          key={n.id}
                          onClick={() => {
                            markNotificationRead(n.id);
                            if (n.orderId) {
                              navigate('track-order', { orderId: n.orderId });
                              setShowNotifications(false);
                            }
                          }}
                          className={`p-3.5 hover:bg-slate-50 cursor-pointer transition-colors ${
                            !n.read ? 'bg-blue-50/50' : ''
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="text-xs font-bold text-slate-800">{n.title}</h4>
                            <span className="text-[10px] text-slate-400">
                              {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          <p className="text-xs text-slate-600 mt-1 line-clamp-2">{n.message}</p>
                        </div>
                      ))
                    )}
                  </div>
                  <div className="px-4 pt-2 border-t border-slate-100 text-center">
                    <button
                      onClick={() => setShowNotifications(false)}
                      className="text-xs font-semibold text-blue-600 hover:text-blue-800"
                    >
                      Close
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Auth Buttons */}
            {currentUser ? (
              <div className="flex items-center gap-2">
                {currentUser.role === 'admin' ? (
                  <button
                    id="btn-nav-admin-panel"
                    onClick={() => handleNav('admin', { adminTab: 'dashboard' })}
                    className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-amber-300 text-xs font-bold px-3 py-2 rounded-xl transition-all shadow-sm"
                  >
                    <ShieldCheck className="w-4 h-4 text-amber-400" />
                    <span className="hidden sm:inline">Admin Panel</span>
                  </button>
                ) : (
                  <button
                    id="btn-nav-dashboard"
                    onClick={() => handleNav('dashboard')}
                    className="flex items-center gap-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 text-xs font-bold px-3 py-2 rounded-xl transition-all"
                  >
                    <User className="w-4 h-4" />
                    <span className="hidden sm:inline">{currentUser.name.split(' ')[0]}</span>
                  </button>
                )}

                <button
                  id="btn-nav-my-orders"
                  onClick={() => handleNav('my-orders')}
                  className="hidden md:flex items-center gap-1 text-xs font-semibold text-slate-700 hover:text-blue-600 px-2 py-2"
                >
                  <Package className="w-4 h-4" />
                  My Orders
                </button>

                <button
                  id="btn-nav-logout"
                  onClick={logout}
                  title="Logout"
                  className="p-2 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-1.5">
                <button
                  id="btn-nav-login"
                  onClick={() => handleNav('login')}
                  className="text-xs sm:text-sm font-semibold text-slate-700 hover:text-blue-600 px-3 py-2 rounded-lg transition-colors"
                >
                  Log In
                </button>
                <button
                  id="btn-nav-register"
                  onClick={() => handleNav('register')}
                  className="bg-blue-600 hover:bg-blue-500 text-white text-xs sm:text-sm font-bold px-4 py-2 rounded-xl shadow-sm transition-all shadow-blue-500/20"
                >
                  Register
                </button>

                {/* Quick Admin Demo switch for fast review */}
                <button
                  id="btn-nav-quick-admin"
                  onClick={() => loginWithDemo('admin')}
                  title="Test Admin Dashboard directly"
                  className="hidden xl:flex items-center gap-1 bg-slate-900 text-amber-300 text-[11px] font-bold px-2.5 py-1.5 rounded-lg border border-slate-800 hover:bg-slate-800 transition-colors"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                  Admin
                </button>
              </div>
            )}

            {/* Mobile Menu Toggle Button */}
            <button
              id="btn-mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-2 animate-in slide-in-from-top-2">
          <div className="grid grid-cols-2 gap-2 pb-3 border-b border-slate-100">
            <button
              onClick={() => handleNav('order')}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-2.5 rounded-xl font-bold text-sm shadow-sm"
            >
              <Printer className="w-4 h-4" />
              Order PVC Card
            </button>
            <button
              onClick={() => handleNav('track-order')}
              className="w-full flex items-center justify-center gap-2 bg-slate-100 text-slate-800 py-2.5 rounded-xl font-bold text-sm"
            >
              <Search className="w-4 h-4" />
              Track Order
            </button>
          </div>

          <div className="space-y-1">
            <button
              onClick={() => handleNav('home')}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100"
            >
              <span>Home</span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>
            <button
              onClick={() => handleNav('services')}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100"
            >
              <span>PVC Card Services</span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>
            <button
              onClick={() => handleNav('pricing')}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100"
            >
              <span>Pricing Calculator</span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>
            <button
              onClick={() => handleNav('my-orders')}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100"
            >
              <span>My Orders</span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>
            <button
              onClick={() => handleNav('dashboard')}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100"
            >
              <span>Customer Dashboard</span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>
            <button
              onClick={() => handleNav('about')}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100"
            >
              <span>About Reza Enterprise</span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>
            <button
              onClick={() => handleNav('contact')}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100"
            >
              <span>Contact & Support</span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>
            <button
              onClick={() => handleNav('admin', { adminTab: 'dashboard' })}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-bold text-amber-800 bg-amber-50 hover:bg-amber-100"
            >
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-amber-600" />
                Admin Dashboard
              </span>
              <ChevronRight className="w-4 h-4 text-amber-600" />
            </button>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
            {currentUser ? (
              <div className="flex items-center justify-between w-full">
                <span className="text-xs text-slate-600 font-medium truncate">
                  Logged in as <b>{currentUser.name}</b>
                </span>
                <button
                  onClick={logout}
                  className="text-xs font-bold text-rose-600 hover:underline"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 w-full">
                <button
                  onClick={() => handleNav('login')}
                  className="flex-1 text-center py-2 text-sm font-bold text-slate-700 border border-slate-200 rounded-xl"
                >
                  Log In
                </button>
                <button
                  onClick={() => handleNav('register')}
                  className="flex-1 text-center py-2 text-sm font-bold text-white bg-blue-600 rounded-xl"
                >
                  Register
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
