import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { AdminDashboardTab } from './AdminDashboardTab';
import { AdminOrdersTab } from './AdminOrdersTab';
import { AdminServicesTab } from './AdminServicesTab';
import { AdminPaymentsTab } from './AdminPaymentsTab';
import { AdminSettingsTab } from './AdminSettingsTab';
import { OrderItem } from '../../types';

export const AdminPanelPage: React.FC = () => {
  const { currentUser, navigate } = useApp();
  const [currentTab, setCurrentTab] = useState<
    'dashboard' | 'orders' | 'services' | 'payments' | 'settings'
  >('dashboard');
  const [selectedOrder, setSelectedOrder] = useState<OrderItem | null>(null);

  // If not logged in as admin, show notice or redirect
  if (!currentUser || currentUser.role !== 'admin') {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl max-w-md w-full p-8 text-center space-y-4">
          <h2 className="text-xl font-bold text-slate-900">Admin Authentication Required</h2>
          <p className="text-xs text-slate-500">
            Please log in with administrative credentials to access the bureau management console.
          </p>
          <button
            onClick={() => navigate('admin-login')}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 rounded-xl text-xs"
          >
            Go to Admin Login
          </button>
        </div>
      </div>
    );
  }

  const handleSelectOrderFromDashboard = (order: OrderItem) => {
    setSelectedOrder(order);
    setCurrentTab('orders');
  };

  return (
    <AdminLayout currentTab={currentTab} setCurrentTab={setCurrentTab}>
      {currentTab === 'dashboard' && (
        <AdminDashboardTab
          onSelectOrder={handleSelectOrderFromDashboard}
          onNavigateTab={tab => setCurrentTab(tab)}
        />
      )}
      {currentTab === 'orders' && (
        <AdminOrdersTab
          selectedOrder={selectedOrder}
          setSelectedOrder={setSelectedOrder}
        />
      )}
      {currentTab === 'payments' && <AdminPaymentsTab />}
      {currentTab === 'services' && <AdminServicesTab />}
      {currentTab === 'settings' && <AdminSettingsTab />}
    </AdminLayout>
  );
};
