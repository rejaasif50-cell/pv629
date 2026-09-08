import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard,
  ShoppingBag,
  CreditCard,
  QrCode,
  Settings,
  LogOut,
  ExternalLink,
  ShieldCheck,
  Bell,
  Menu,
  X
} from 'lucide-react';

interface AdminLayoutProps {
  currentTab: 'dashboard' | 'orders' | 'services' | 'payments' | 'settings';
  setCurrentTab: (tab: 'dashboard' | 'orders' | 'services' | 'payments' | 'settings') => void;
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  currentTab,
  setCurrentTab,
  children
}) => {
  const { currentUser, logout, navigate, orders } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const pendingPaymentsCount = orders.filter(
    o => o.paymentStatus === 'Pending Verification'
  ).length;

  const pendingOrdersCount = orders.filter(
    o => o.orderStatus === 'Order Received' || o.orderStatus === 'Payment Pending'
  ).length;

  const navItems = [
    {
      id: 'dashboard' as const,
      label: 'Dashboard',
      icon: LayoutDashboard
    },
    {
      id: 'orders' as const,
      label: 'Orders Management',
      icon: ShoppingBag,
      badge: pendingOrdersCount > 0 ? pendingOrdersCount : undefined
    },
    {
      id: 'payments' as const,
      label: 'Payment Verifications',
      icon: QrCode,
      badge: pendingPaymentsCount > 0 ? pendingPaymentsCount : undefined
    },
    {
      id: 'services' as const,
      label: 'Card Services & Pricing',
      icon: CreditCard
    },
    {
      id: 'settings' as const,
      label: 'Website & UPI Settings',
      icon: Settings
    }
  ];

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row">
      {/* Sidebar for Desktop */}
      <aside className="hidden md:flex md:w-64 flex-col justify-between bg-slate-900 text-white p-5 border-r border-slate-800 shrink-0">
        <div className="space-y-6">
          {/* Logo */}
          <div className="flex items-center gap-3 px-2">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center font-bold text-white shadow-md shadow-blue-500/20">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-extrabold text-sm tracking-tight text-white">REZA ADMIN</h2>
              <span className="text-[10px] font-semibold text-blue-400 block uppercase">
                PVC Printing Bureau
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentTab(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-colors ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-500 text-white">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom user & quick links */}
        <div className="space-y-3 pt-6 border-t border-slate-800">
          <button
            onClick={() => navigate('home')}
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-4 h-4" />
              <span>View Customer Site</span>
            </span>
          </button>

          <div className="p-3 bg-slate-800/60 rounded-xl flex items-center justify-between">
            <div className="truncate">
              <p className="text-xs font-bold text-white truncate">{currentUser?.name || 'Administrator'}</p>
              <p className="text-[10px] text-slate-400 truncate">{currentUser?.email}</p>
            </div>
            <button
              onClick={() => logout()}
              className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-slate-700/50"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Top bar */}
      <div className="md:hidden bg-slate-900 text-white p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-blue-400" />
          <span className="font-bold text-sm">Reza Admin Panel</span>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-1.5 text-slate-400 hover:text-white"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-900 text-white p-4 border-b border-slate-800 space-y-2">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => {
                setCurrentTab(item.id);
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold ${
                currentTab === item.id ? 'bg-blue-600 text-white' : 'text-slate-300'
              }`}
            >
              <span>{item.label}</span>
              {item.badge !== undefined && (
                <span className="px-2 py-0.5 rounded-full text-[10px] bg-rose-500 text-white">
                  {item.badge}
                </span>
              )}
            </button>
          ))}
          <div className="pt-2 border-t border-slate-800 flex justify-between text-xs">
            <button
              onClick={() => navigate('home')}
              className="text-blue-400 flex items-center gap-1 font-semibold"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Customer Website</span>
            </button>
            <button
              onClick={() => logout()}
              className="text-rose-400 flex items-center gap-1 font-semibold"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-8 max-w-7xl mx-auto w-full overflow-y-auto">
        {children}
      </main>
    </div>
  );
};
