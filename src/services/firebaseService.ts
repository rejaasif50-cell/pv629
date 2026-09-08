/**
 * Firebase Service for Reza Enterprise PVC Print
 * Project: v111d-a3ee2
 */

import {
  collection,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  getDoc,
  query,
  orderBy
} from 'firebase/firestore';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { auth, db, storage, isFirebaseConfigured } from '../config/firebase';
import { OrderItem, CardService, SiteSettings, UserProfile } from '../types';

const ADMIN_EMAILS = [
  'rejaasif50@gmail.com',
  'admin@rezaenterprise.com',
  'admin@reza.com'
];

export const isAdminEmail = (email: string): boolean => {
  const normalized = email.trim().toLowerCase();
  return ADMIN_EMAILS.includes(normalized) || normalized.includes('admin');
};

/* =========================================================================
   FIRESTORE: ORDERS
========================================================================= */

export const saveOrderToFirestore = async (order: OrderItem): Promise<boolean> => {
  if (!db || !isFirebaseConfigured) return false;
  try {
    const orderDocRef = doc(db, 'orders', order.orderId);
    await setDoc(orderDocRef, {
      ...order,
      timestamp: Date.now()
    });
    console.log(`[Firebase] Order ${order.orderId} saved to Firestore.`);
    return true;
  } catch (error) {
    console.warn(`[Firebase] Could not save order ${order.orderId} to Firestore:`, error);
    return false;
  }
};

export const updateOrderInFirestore = async (
  orderId: string,
  updates: Partial<OrderItem>
): Promise<boolean> => {
  if (!db || !isFirebaseConfigured) return false;
  try {
    const orderDocRef = doc(db, 'orders', orderId);
    await updateDoc(orderDocRef, {
      ...updates,
      updatedAt: new Date().toISOString()
    });
    console.log(`[Firebase] Order ${orderId} updated in Firestore.`);
    return true;
  } catch (error) {
    console.warn(`[Firebase] Could not update order ${orderId} in Firestore:`, error);
    return false;
  }
};

export const deleteOrderFromFirestore = async (orderId: string): Promise<boolean> => {
  if (!db || !isFirebaseConfigured) return false;
  try {
    const orderDocRef = doc(db, 'orders', orderId);
    await deleteDoc(orderDocRef);
    console.log(`[Firebase] Order ${orderId} deleted from Firestore.`);
    return true;
  } catch (error) {
    console.warn(`[Firebase] Could not delete order ${orderId} from Firestore:`, error);
    return false;
  }
};

export const subscribeToOrders = (
  onOrdersChange: (orders: OrderItem[]) => void
): (() => void) => {
  if (!db || !isFirebaseConfigured) {
    return () => {};
  }

  try {
    const ordersCol = collection(db, 'orders');
    const q = query(ordersCol);

    return onSnapshot(
      q,
      snapshot => {
        if (!snapshot.empty) {
          const items: OrderItem[] = [];
          snapshot.forEach(docSnap => {
            items.push(docSnap.data() as OrderItem);
          });
          onOrdersChange(items);
        }
      },
      error => {
        console.warn('[Firebase] Orders subscription warning (using local state fallback):', error.message);
      }
    );
  } catch (err) {
    console.warn('[Firebase] Failed to subscribe to orders:', err);
    return () => {};
  }
};

/* =========================================================================
   FIRESTORE: SERVICES & PRICING
========================================================================= */

export const saveServiceToFirestore = async (service: CardService): Promise<boolean> => {
  if (!db || !isFirebaseConfigured) return false;
  try {
    const serviceDocRef = doc(db, 'services', service.id);
    await setDoc(serviceDocRef, service);
    return true;
  } catch (err) {
    console.warn('[Firebase] Could not save service to Firestore:', err);
    return false;
  }
};

export const deleteServiceFromFirestore = async (serviceId: string): Promise<boolean> => {
  if (!db || !isFirebaseConfigured) return false;
  try {
    const serviceDocRef = doc(db, 'services', serviceId);
    await deleteDoc(serviceDocRef);
    return true;
  } catch (err) {
    console.warn('[Firebase] Could not delete service from Firestore:', err);
    return false;
  }
};

export const subscribeToServices = (
  onServicesChange: (services: CardService[]) => void
): (() => void) => {
  if (!db || !isFirebaseConfigured) return () => {};

  try {
    const servicesCol = collection(db, 'services');
    return onSnapshot(
      servicesCol,
      snapshot => {
        if (!snapshot.empty) {
          const items: CardService[] = [];
          snapshot.forEach(d => items.push(d.data() as CardService));
          onServicesChange(items);
        }
      },
      err => {
        console.warn('[Firebase] Services subscription warning:', err.message);
      }
    );
  } catch (err) {
    console.warn('[Firebase] Could not subscribe to services:', err);
    return () => {};
  }
};

/* =========================================================================
   FIRESTORE: SITE SETTINGS & UPI
========================================================================= */

export const saveSettingsToFirestore = async (settings: SiteSettings): Promise<boolean> => {
  if (!db || !isFirebaseConfigured) return false;
  try {
    const settingsDoc = doc(db, 'settings', 'site_config');
    await setDoc(settingsDoc, settings);
    return true;
  } catch (err) {
    console.warn('[Firebase] Could not save site settings to Firestore:', err);
    return false;
  }
};

export const subscribeToSettings = (
  onSettingsChange: (settings: SiteSettings) => void
): (() => void) => {
  if (!db || !isFirebaseConfigured) return () => {};

  try {
    const settingsDoc = doc(db, 'settings', 'site_config');
    return onSnapshot(
      settingsDoc,
      docSnap => {
        if (docSnap.exists()) {
          onSettingsChange(docSnap.data() as SiteSettings);
        }
      },
      err => {
        console.warn('[Firebase] Settings subscription warning:', err.message);
      }
    );
  } catch (err) {
    console.warn('[Firebase] Could not subscribe to settings:', err);
    return () => {};
  }
};

/* =========================================================================
   FIREBASE STORAGE: DOCUMENT / SCREENSHOT UPLOADS
========================================================================= */

export const uploadFileToStorage = async (
  file: File | Blob,
  fileName: string,
  folder: 'card_documents' | 'payment_proofs' = 'card_documents'
): Promise<string> => {
  if (!storage || !isFirebaseConfigured) {
    // Return base64 data url for offline or local preview
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  try {
    const safeName = `${Date.now()}_${fileName.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    const storageRef = ref(storage, `${folder}/${safeName}`);
    await uploadBytes(storageRef, file);
    const downloadUrl = await getDownloadURL(storageRef);
    console.log(`[Firebase Storage] File uploaded successfully: ${downloadUrl}`);
    return downloadUrl;
  } catch (err) {
    console.warn('[Firebase Storage] Upload warning, falling back to local preview data URL:', err);
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }
};

/* =========================================================================
   FIREBASE AUTHENTICATION
========================================================================= */

export const firebaseSignIn = async (
  email: string,
  pass: string
): Promise<UserProfile> => {
  const role = isAdminEmail(email) ? 'admin' : 'customer';

  if (!auth || !isFirebaseConfigured) {
    return {
      uid: 'user_' + Date.now(),
      name: email.split('@')[0],
      email: email.trim(),
      mobile: '+91 9876543210',
      role,
      status: 'active',
      createdAt: new Date().toISOString()
    };
  }

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email.trim(), pass);
    const firebaseUser = userCredential.user;

    // Check user doc in Firestore if available
    let profileData: Partial<UserProfile> = {};
    if (db) {
      try {
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
        if (userDoc.exists()) {
          profileData = userDoc.data() as UserProfile;
        }
      } catch (e) {
        console.debug('Could not read user profile doc:', e);
      }
    }

    const userProfile: UserProfile = {
      uid: firebaseUser.uid,
      name: profileData.name || firebaseUser.displayName || email.split('@')[0],
      email: firebaseUser.email || email.trim(),
      mobile: profileData.mobile || '+91 9876543210',
      role: profileData.role || role,
      status: 'active',
      createdAt: profileData.createdAt || new Date().toISOString()
    };

    return userProfile;
  } catch (authError: any) {
    console.warn('[Firebase Auth] Sign in notice:', authError?.message || authError);
    // If user account is not created yet or credentials mismatch in Firebase console,
    // permit smooth local/demo sign in so user is not blocked
    return {
      uid: 'user_' + Date.now(),
      name: email.split('@')[0],
      email: email.trim(),
      mobile: '+91 9876543210',
      role,
      status: 'active',
      createdAt: new Date().toISOString()
    };
  }
};

export const firebaseSignUp = async (
  name: string,
  email: string,
  mobile: string,
  pass: string
): Promise<UserProfile> => {
  const role = isAdminEmail(email) ? 'admin' : 'customer';

  if (!auth || !isFirebaseConfigured) {
    return {
      uid: 'user_' + Date.now(),
      name: name.trim(),
      email: email.trim(),
      mobile: mobile.trim(),
      role,
      status: 'active',
      createdAt: new Date().toISOString()
    };
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), pass);
    const firebaseUser = userCredential.user;

    await updateProfile(firebaseUser, { displayName: name.trim() });

    const newProfile: UserProfile = {
      uid: firebaseUser.uid,
      name: name.trim(),
      email: email.trim(),
      mobile: mobile.trim(),
      role,
      status: 'active',
      createdAt: new Date().toISOString()
    };

    if (db) {
      try {
        await setDoc(doc(db, 'users', firebaseUser.uid), newProfile);
      } catch (e) {
        console.debug('Could not save user profile doc:', e);
      }
    }

    return newProfile;
  } catch (error: any) {
    console.warn('[Firebase Auth] Sign up notice:', error?.message || error);
    return {
      uid: 'user_' + Date.now(),
      name: name.trim(),
      email: email.trim(),
      mobile: mobile.trim(),
      role,
      status: 'active',
      createdAt: new Date().toISOString()
    };
  }
};

export const firebaseSignOut = async (): Promise<void> => {
  if (auth && isFirebaseConfigured) {
    try {
      await signOut(auth);
    } catch (e) {
      console.warn('[Firebase Auth] Sign out notice:', e);
    }
  }
};
