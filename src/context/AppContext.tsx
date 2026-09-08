import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  UserProfile,
  CardService,
  OrderItem,
  Coupon,
  SiteSettings,
  AppNotification,
  OrderStatus,
  PaymentStatus
} from '../types';
import {
  INITIAL_SERVICES,
  INITIAL_ORDERS,
  INITIAL_COUPONS,
  INITIAL_SETTINGS,
  INITIAL_USERS
} from '../data/initialData';

export interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface AppContextType {
  currentUser: UserProfile | null;
  services: CardService[];
  orders: OrderItem[];
  coupons: Coupon[];
  settings: SiteSettings;
  notifications: AppNotification[];
  toasts: ToastMessage[];
  currentView: string;
  selectedOrderId: string | null;
  selectedServiceId: string | null;
  adminSubTab: string;
  
  // Navigation
  navigate: (view: string, params?: { orderId?: string; serviceId?: string; adminTab?: string }) => void;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;
  
  // Auth
  login: (email: string, pass: string) => Promise<boolean>;
  loginWithDemo: (role: 'customer' | 'admin') => void;
  register: (name: string, email: string, mobile: string, pass: string) => Promise<boolean>;
  logout: () => void;
  
  // Orders
  createOrder: (orderInput: Omit<OrderItem, 'orderId' | 'createdAt' | 'updatedAt' | 'orderStatus' | 'paymentStatus'>) => Promise<OrderItem>;
  updateOrderStatus: (orderId: string, status: OrderStatus, courier?: string, tracking?: string, adminNote?: string) => void;
  updatePaymentStatus: (orderId: string, paymentStatus: PaymentStatus, transactionId?: string) => void;
  submitUpiPayment: (orderId: string, transactionId: string, screenshotUrl?: string) => Promise<boolean>;
  deleteOrder: (orderId: string) => void;
  
  // Services
  addService: (service: Omit<CardService, 'id'>) => void;
  updateService: (service: CardService) => void;
  deleteService: (id: string) => void;
  
  // Coupons
  addCoupon: (coupon: Omit<Coupon, 'id' | 'usageCount'>) => void;
  toggleCouponStatus: (id: string) => void;
  deleteCoupon: (id: string) => void;
  validateCoupon: (code: string, subtotal: number) => { valid: boolean; discount: number; error?: string; coupon?: Coupon };
  
  // Settings & Customers
  updateSettings: (newSettings: Partial<SiteSettings>) => void;
  customers: UserProfile[];
  toggleCustomerStatus: (uid: string) => void;
  
  // Notifications
  markNotificationRead: (id: string) => void;
  clearAllNotifications: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load persistent state from localStorage with fallbacks
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem('reza_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [customers, setCustomers] = useState<UserProfile[]>(() => {
    try {
      const saved = localStorage.getItem('reza_customers');
      return saved ? JSON.parse(saved) : INITIAL_USERS;
    } catch {
      return INITIAL_USERS;
    }
  });

  const [services, setServices] = useState<CardService[]>(() => {
    try {
      const saved = localStorage.getItem('reza_services');
      return saved ? JSON.parse(saved) : INITIAL_SERVICES;
    } catch {
      return INITIAL_SERVICES;
    }
  });

  const [orders, setOrders] = useState<OrderItem[]>(() => {
    try {
      const saved = localStorage.getItem('reza_orders');
      return saved ? JSON.parse(saved) : INITIAL_ORDERS;
    } catch {
      return INITIAL_ORDERS;
    }
  });

  const [coupons, setCoupons] = useState<Coupon[]>(() => {
    try {
      const saved = localStorage.getItem('reza_coupons');
      return saved ? JSON.parse(saved) : INITIAL_COUPONS;
    } catch {
      return INITIAL_COUPONS;
    }
  });

  const [settings, setSettings] = useState<SiteSettings>(() => {
    try {
      const saved = localStorage.getItem('reza_settings');
      return saved ? { ...INITIAL_SETTINGS, ...JSON.parse(saved) } : INITIAL_SETTINGS;
    } catch {
      return INITIAL_SETTINGS;
    }
  });

  const [notifications, setNotifications] = useState<AppNotification[]>([
    {
      id: 'n1',
      title: 'Welcome to Reza Enterprise',
      message: 'Quality PVC card printing starting at only ₹49. Fast doorstep dispatch!',
      type: 'info',
      read: false,
      createdAt: new Date().toISOString()
    },
    {
      id: 'n2',
      title: 'New Order Received',
      message: 'Order REZA-PVC-2026-000103 received from Rahul Sharma.',
      type: 'order',
      orderId: 'REZA-PVC-2026-000103',
      read: false,
      createdAt: new Date(Date.now() - 3600000).toISOString()
    }
  ]);

  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [currentView, setCurrentView] = useState<string>('home');
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);
  const [adminSubTab, setAdminSubTab] = useState<string>('dashboard');

  // Synchronize URL hash for direct navigation and refresh retention
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.replace('#', '') || 'home';
      const [view, param] = hash.split('/');
      
      if (view === 'admin') {
        setCurrentView('admin');
        if (param) setAdminSubTab(param);
      } else if (view === 'order' && param) {
        setCurrentView('order');
        setSelectedServiceId(param);
      } else if (view === 'payment' && param) {
        setCurrentView('payment');
        setSelectedOrderId(param);
      } else if (view === 'invoice' && param) {
        setCurrentView('invoice');
        setSelectedOrderId(param);
      } else if (hash) {
        setCurrentView(view);
        if (param) setSelectedOrderId(param);
      }
    };

    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  // Save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('reza_services', JSON.stringify(services));
    } catch (e) {
      console.warn(e);
    }
  }, [services]);

  useEffect(() => {
    try {
      localStorage.setItem('reza_orders', JSON.stringify(orders));
    } catch (e) {
      console.warn(e);
    }
  }, [orders]);

  useEffect(() => {
    try {
      localStorage.setItem('reza_coupons', JSON.stringify(coupons));
    } catch (e) {
      console.warn(e);
    }
  }, [coupons]);

  useEffect(() => {
    try {
      localStorage.setItem('reza_settings', JSON.stringify(settings));
    } catch (e) {
      console.warn(e);
    }
  }, [settings]);

  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem('reza_user', JSON.stringify(currentUser));
      } else {
        localStorage.removeItem('reza_user');
      }
    } catch (e) {
      console.warn(e);
    }
  }, [currentUser]);

  useEffect(() => {
    try {
      localStorage.setItem('reza_customers', JSON.stringify(customers));
    } catch (e) {
      console.warn(e);
    }
  }, [customers]);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = 'toast_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const navigate = (view: string, params?: { orderId?: string; serviceId?: string; adminTab?: string }) => {
    setCurrentView(view);
    if (params?.orderId) setSelectedOrderId(params.orderId);
    if (params?.serviceId) setSelectedServiceId(params.serviceId);
    if (params?.adminTab) setAdminSubTab(params.adminTab);

    let hash = view;
    if (view === 'admin' && params?.adminTab) {
      hash = `admin/${params.adminTab}`;
    } else if (params?.orderId) {
      hash = `${view}/${params.orderId}`;
    } else if (params?.serviceId) {
      hash = `${view}/${params.serviceId}`;
    }
    window.location.hash = hash;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Auth functions
  const login = async (email: string, pass: string): Promise<boolean> => {
    const matched = customers.find(c => c.email.toLowerCase() === email.trim().toLowerCase());
    if (matched) {
      if (matched.status === 'blocked') {
        showToast('Your account is blocked. Please contact support.', 'error');
        return false;
      }
      setCurrentUser(matched);
      showToast(`Welcome back, ${matched.name}!`, 'success');
      return true;
    }
    // Check if email contains admin
    if (email.toLowerCase().includes('admin') || email.toLowerCase() === 'rejaasif50@gmail.com') {
      const adminUser: UserProfile = {
        uid: 'admin_reza_' + Date.now(),
        name: 'Administrator',
        email: email.trim(),
        mobile: '+91 9876543210',
        role: 'admin',
        status: 'active',
        createdAt: new Date().toISOString()
      };
      setCurrentUser(adminUser);
      setCustomers(prev => [...prev, adminUser]);
      showToast('Admin logged in successfully', 'success');
      return true;
    }

    // Standard new user login
    const newUser: UserProfile = {
      uid: 'user_' + Date.now(),
      name: email.split('@')[0],
      email: email.trim(),
      mobile: '+91 9876543210',
      role: 'customer',
      status: 'active',
      createdAt: new Date().toISOString()
    };
    setCurrentUser(newUser);
    setCustomers(prev => [...prev, newUser]);
    showToast(`Welcome, ${newUser.name}!`, 'success');
    return true;
  };

  const loginWithDemo = (role: 'customer' | 'admin') => {
    if (role === 'admin') {
      const admin = customers.find(c => c.role === 'admin') || INITIAL_USERS[0];
      setCurrentUser(admin);
      showToast('Logged in as Administrator (Demo Mode)', 'success');
      navigate('admin', { adminTab: 'dashboard' });
    } else {
      const cust = customers.find(c => c.role === 'customer') || INITIAL_USERS[1];
      setCurrentUser(cust);
      showToast(`Logged in as Customer: ${cust.name}`, 'success');
      navigate('dashboard');
    }
  };

  const register = async (name: string, email: string, mobile: string, _pass: string): Promise<boolean> => {
    const existing = customers.find(c => c.email.toLowerCase() === email.trim().toLowerCase());
    if (existing) {
      showToast('Account with this email already exists. Please login.', 'error');
      return false;
    }
    const newUser: UserProfile = {
      uid: 'cust_' + Date.now(),
      name: name.trim(),
      email: email.trim(),
      mobile: mobile.trim(),
      role: email.toLowerCase().includes('admin') ? 'admin' : 'customer',
      status: 'active',
      createdAt: new Date().toISOString()
    };
    setCustomers(prev => [...prev, newUser]);
    setCurrentUser(newUser);
    showToast('Registration successful! Welcome to Reza Enterprise.', 'success');
    return true;
  };

  const logout = () => {
    setCurrentUser(null);
    showToast('You have been logged out.', 'info');
    navigate('home');
  };

  // Order Functions
  const createOrder = async (orderInput: Omit<OrderItem, 'orderId' | 'createdAt' | 'updatedAt' | 'orderStatus' | 'paymentStatus'>): Promise<OrderItem> => {
    const year = new Date().getFullYear();
    const count = orders.length + 101;
    const orderId = `REZA-PVC-${year}-${String(count).padStart(6, '0')}`;
    const now = new Date().toISOString();

    const newOrder: OrderItem = {
      ...orderInput,
      orderId,
      createdAt: now,
      updatedAt: now,
      orderStatus: 'Order Received',
      paymentStatus: 'Pending Verification'
    };

    setOrders(prev => [newOrder, ...prev]);

    // Add in-app notifications
    const newNotif: AppNotification = {
      id: 'notif_' + Date.now(),
      title: 'New Order Received',
      message: `Order #${orderId} placed for ${newOrder.serviceName} (${newOrder.quantity} pcs) by ${newOrder.customerName}.`,
      type: 'order',
      orderId: orderId,
      read: false,
      createdAt: now
    };
    setNotifications(prev => [newNotif, ...prev]);

    showToast(`Order ${orderId} placed successfully!`, 'success');
    return newOrder;
  };

  const updateOrderStatus = (
    orderId: string,
    status: OrderStatus,
    courier?: string,
    tracking?: string,
    adminNote?: string
  ) => {
    setOrders(prev =>
      prev.map(o => {
        if (o.orderId === orderId) {
          return {
            ...o,
            orderStatus: status,
            courierName: courier !== undefined ? courier : o.courierName,
            trackingNumber: tracking !== undefined ? tracking : o.trackingNumber,
            adminNote: adminNote !== undefined ? adminNote : o.adminNote,
            updatedAt: new Date().toISOString()
          };
        }
        return o;
      })
    );

    // Create status notification
    setNotifications(prev => [
      {
        id: 'status_' + Date.now(),
        title: `Order ${status}`,
        message: `Order #${orderId} status has been updated to "${status}".`,
        type: 'order',
        orderId,
        read: false,
        createdAt: new Date().toISOString()
      },
      ...prev
    ]);

    showToast(`Order #${orderId} updated to ${status}`, 'success');
  };

  const updatePaymentStatus = (orderId: string, paymentStatus: PaymentStatus, transactionId?: string) => {
    setOrders(prev =>
      prev.map(o => {
        if (o.orderId === orderId) {
          const newOrderStatus = paymentStatus === 'Verified' ? 'Payment Verified' : o.orderStatus;
          return {
            ...o,
            paymentStatus,
            transactionId: transactionId || o.transactionId,
            orderStatus: newOrderStatus,
            updatedAt: new Date().toISOString()
          };
        }
        return o;
      })
    );
    showToast(`Payment for #${orderId} marked as ${paymentStatus}`, 'success');
  };

  const submitUpiPayment = async (orderId: string, transactionId: string, screenshotUrl?: string): Promise<boolean> => {
    setOrders(prev =>
      prev.map(o => {
        if (o.orderId === orderId) {
          return {
            ...o,
            transactionId,
            paymentScreenshot: screenshotUrl || o.paymentScreenshot,
            paymentStatus: 'Pending Verification',
            updatedAt: new Date().toISOString()
          };
        }
        return o;
      })
    );

    setNotifications(prev => [
      {
        id: 'pay_sub_' + Date.now(),
        title: 'Payment Submitted',
        message: `Customer submitted UTR ${transactionId} for Order #${orderId}. Pending verification.`,
        type: 'payment',
        orderId,
        read: false,
        createdAt: new Date().toISOString()
      },
      ...prev
    ]);

    showToast('Payment submitted successfully! Admin will verify shortly.', 'success');
    return true;
  };

  const deleteOrder = (orderId: string) => {
    setOrders(prev => prev.filter(o => o.orderId !== orderId));
    showToast(`Order #${orderId} removed`, 'info');
  };

  // Services
  const addService = (serviceInput: Omit<CardService, 'id'>) => {
    const id = serviceInput.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now().toString().slice(-4);
    const newService: CardService = { ...serviceInput, id };
    setServices(prev => [newService, ...prev]);
    showToast(`Service "${newService.name}" created`, 'success');
  };

  const updateService = (updated: CardService) => {
    setServices(prev => prev.map(s => (s.id === updated.id ? updated : s)));
    showToast(`Service "${updated.name}" updated`, 'success');
  };

  const deleteService = (id: string) => {
    setServices(prev => prev.filter(s => s.id !== id));
    showToast('Service deleted', 'info');
  };

  // Coupons
  const addCoupon = (couponInput: Omit<Coupon, 'id' | 'usageCount'>) => {
    const id = 'coup_' + Date.now();
    const newCoupon: Coupon = { ...couponInput, id, usageCount: 0 };
    setCoupons(prev => [newCoupon, ...prev]);
    showToast(`Coupon ${newCoupon.code} created!`, 'success');
  };

  const toggleCouponStatus = (id: string) => {
    setCoupons(prev =>
      prev.map(c => (c.id === id ? { ...c, status: c.status === 'active' ? 'inactive' : 'active' } : c))
    );
  };

  const deleteCoupon = (id: string) => {
    setCoupons(prev => prev.filter(c => c.id !== id));
    showToast('Coupon removed', 'info');
  };

  const validateCoupon = (code: string, subtotal: number): { valid: boolean; discount: number; error?: string; coupon?: Coupon } => {
    const normalized = code.trim().toUpperCase();
    const coupon = coupons.find(c => c.code.toUpperCase() === normalized);

    if (!coupon) {
      return { valid: false, discount: 0, error: 'Invalid coupon code.' };
    }
    if (coupon.status !== 'active') {
      return { valid: false, discount: 0, error: 'This coupon is inactive.' };
    }
    if (new Date(coupon.expiryDate) < new Date()) {
      return { valid: false, discount: 0, error: 'This coupon has expired.' };
    }
    if (subtotal < coupon.minimumOrder) {
      return {
        valid: false,
        discount: 0,
        error: `Minimum order amount of ₹${coupon.minimumOrder} required for this coupon.`
      };
    }

    let discount = 0;
    if (coupon.discountType === 'fixed') {
      discount = coupon.discountAmount;
    } else {
      discount = (subtotal * coupon.discountAmount) / 100;
      if (coupon.maximumDiscount && discount > coupon.maximumDiscount) {
        discount = coupon.maximumDiscount;
      }
    }
    discount = Math.min(discount, subtotal);

    return { valid: true, discount: Math.round(discount * 100) / 100, coupon };
  };

  // Settings
  const updateSettings = (newSettings: Partial<SiteSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
    showToast('Website settings saved successfully', 'success');
  };

  // Customers
  const toggleCustomerStatus = (uid: string) => {
    setCustomers(prev =>
      prev.map(c => (c.uid === uid ? { ...c, status: c.status === 'active' ? 'blocked' : 'active' } : c))
    );
    showToast('Customer status updated', 'info');
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => (n.id === id ? { ...n, read: true } : n)));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
    showToast('Notifications cleared', 'info');
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        services,
        orders,
        coupons,
        settings,
        notifications,
        toasts,
        currentView,
        selectedOrderId,
        selectedServiceId,
        adminSubTab,
        navigate,
        showToast,
        removeToast,
        login,
        loginWithDemo,
        register,
        logout,
        createOrder,
        updateOrderStatus,
        updatePaymentStatus,
        submitUpiPayment,
        deleteOrder,
        addService,
        updateService,
        deleteService,
        addCoupon,
        toggleCouponStatus,
        deleteCoupon,
        validateCoupon,
        updateSettings,
        customers,
        toggleCustomerStatus,
        markNotificationRead,
        clearAllNotifications
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
