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
import {
  saveOrderToFirestore,
  updateOrderInFirestore,
  deleteOrderFromFirestore,
  subscribeToOrders,
  saveServiceToFirestore,
  deleteServiceFromFirestore,
  subscribeToServices,
  saveSettingsToFirestore,
  subscribeToSettings,
  firebaseSignIn,
  firebaseSignUp,
  firebaseSignOut,
  isAdminEmail
} from '../services/firebaseService';

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
  login: (email: string, pass: string) => Promise<UserProfile>;
  loginWithDemo: (role: 'customer' | 'admin') => void;
  register: (nameOrData: string | { name: string; email: string; mobile: string; password?: string }, email?: string, mobile?: string, pass?: string) => Promise<UserProfile>;
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

  // Sync real-time data from Firebase Firestore
  useEffect(() => {
    const unsubOrders = subscribeToOrders((remoteOrders) => {
      if (remoteOrders && remoteOrders.length > 0) {
        setOrders(prev => {
          const map = new Map<string, OrderItem>();
          // Remote first
          remoteOrders.forEach(o => map.set(o.orderId, o));
          // Keep local if not yet in remote
          prev.forEach(o => {
            if (!map.has(o.orderId)) map.set(o.orderId, o);
          });
          return Array.from(map.values());
        });
      }
    });

    const unsubServices = subscribeToServices((remoteServices) => {
      if (remoteServices && remoteServices.length > 0) {
        setServices(remoteServices);
      }
    });

    const unsubSettings = subscribeToSettings((remoteSettings) => {
      if (remoteSettings) {
        setSettings(prev => ({ ...prev, ...remoteSettings }));
      }
    });

    return () => {
      unsubOrders();
      unsubServices();
      unsubSettings();
    };
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
  const login = async (email: string, pass: string): Promise<UserProfile> => {
    try {
      // Authenticate via Firebase Auth
      const userProfile = await firebaseSignIn(email, pass);
      setCurrentUser(userProfile);
      setCustomers(prev => {
        const exists = prev.some(c => c.email.toLowerCase() === userProfile.email.toLowerCase());
        if (exists) {
          return prev.map(c => c.email.toLowerCase() === userProfile.email.toLowerCase() ? userProfile : c);
        }
        return [userProfile, ...prev];
      });
      showToast(`Welcome back, ${userProfile.name}!`, 'success');
      return userProfile;
    } catch (err: any) {
      showToast(err?.message || 'Login failed', 'error');
      throw err;
    }
  };

  const loginWithDemo = (role: 'customer' | 'admin') => {
    if (role === 'admin') {
      const admin: UserProfile = {
        uid: 'admin_reza_primary',
        name: 'Reza Administrator',
        email: 'admin@rezaenterprise.com',
        mobile: '+91 9876543210',
        role: 'admin',
        status: 'active',
        createdAt: new Date().toISOString()
      };
      setCurrentUser(admin);
      showToast('Logged in as Administrator', 'success');
      navigate('admin', { adminTab: 'dashboard' });
    } else {
      const cust = customers.find(c => c.role === 'customer') || INITIAL_USERS[1];
      setCurrentUser(cust);
      showToast(`Logged in as Customer: ${cust.name}`, 'success');
      navigate('dashboard');
    }
  };

  const register = async (
    nameOrData: string | { name: string; email: string; mobile: string; password?: string },
    email?: string,
    mobile?: string,
    pass?: string
  ): Promise<UserProfile> => {
    let finalName = '';
    let finalEmail = '';
    let finalMobile = '';
    let finalPass = '';

    if (typeof nameOrData === 'object') {
      finalName = nameOrData.name;
      finalEmail = nameOrData.email;
      finalMobile = nameOrData.mobile;
      finalPass = nameOrData.password || '';
    } else {
      finalName = nameOrData;
      finalEmail = email || '';
      finalMobile = mobile || '';
      finalPass = pass || '';
    }

    try {
      const userProfile = await firebaseSignUp(finalName, finalEmail, finalMobile, finalPass);
      setCurrentUser(userProfile);
      setCustomers(prev => [userProfile, ...prev]);
      showToast('Registration successful! Welcome to Reza Enterprise.', 'success');
      return userProfile;
    } catch (err: any) {
      showToast(err?.message || 'Registration failed', 'error');
      throw err;
    }
  };

  const logout = async () => {
    await firebaseSignOut();
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

    // Update local state immediately
    setOrders(prev => [newOrder, ...prev]);

    // Save to Firebase Firestore
    saveOrderToFirestore(newOrder);

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
    const updates: Partial<OrderItem> = {
      orderStatus: status,
      ...(courier !== undefined ? { courierName: courier } : {}),
      ...(tracking !== undefined ? { trackingNumber: tracking } : {}),
      ...(adminNote !== undefined ? { adminNote } : {})
    };

    setOrders(prev =>
      prev.map(o => {
        if (o.orderId === orderId) {
          return {
            ...o,
            ...updates,
            updatedAt: new Date().toISOString()
          };
        }
        return o;
      })
    );

    // Update in Firebase Firestore
    updateOrderInFirestore(orderId, updates);

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
    const newOrderStatus = paymentStatus === 'Verified' ? 'Payment Verified' : undefined;
    const updates: Partial<OrderItem> = {
      paymentStatus,
      ...(transactionId ? { transactionId } : {}),
      ...(newOrderStatus ? { orderStatus: newOrderStatus } : {})
    };

    setOrders(prev =>
      prev.map(o => {
        if (o.orderId === orderId) {
          return {
            ...o,
            ...updates,
            updatedAt: new Date().toISOString()
          };
        }
        return o;
      })
    );

    // Update in Firebase Firestore
    updateOrderInFirestore(orderId, updates);

    showToast(`Payment for #${orderId} marked as ${paymentStatus}`, 'success');
  };

  const submitUpiPayment = async (orderId: string, transactionId: string, screenshotUrl?: string): Promise<boolean> => {
    const updates: Partial<OrderItem> = {
      transactionId,
      ...(screenshotUrl ? { paymentScreenshot: screenshotUrl } : {}),
      paymentStatus: 'Pending Verification'
    };

    setOrders(prev =>
      prev.map(o => {
        if (o.orderId === orderId) {
          return {
            ...o,
            ...updates,
            updatedAt: new Date().toISOString()
          };
        }
        return o;
      })
    );

    // Update in Firebase Firestore
    updateOrderInFirestore(orderId, updates);

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
    deleteOrderFromFirestore(orderId);
    showToast(`Order #${orderId} removed`, 'info');
  };

  // Services
  const addService = (serviceInput: Omit<CardService, 'id'>) => {
    const id = serviceInput.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now().toString().slice(-4);
    const newService: CardService = { ...serviceInput, id };
    setServices(prev => [newService, ...prev]);
    saveServiceToFirestore(newService);
    showToast(`Service "${newService.name}" created`, 'success');
  };

  const updateService = (updated: CardService) => {
    setServices(prev => prev.map(s => (s.id === updated.id ? updated : s)));
    saveServiceToFirestore(updated);
    showToast(`Service "${updated.name}" updated`, 'success');
  };

  const deleteService = (id: string) => {
    setServices(prev => prev.filter(s => s.id !== id));
    deleteServiceFromFirestore(id);
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
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    saveSettingsToFirestore(updated);
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
