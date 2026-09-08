/**
 * Firebase Configuration for Reza Enterprise PVC Print
 * Connected to Firebase project: v111d-a3ee2
 */
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getStorage, FirebaseStorage } from 'firebase/storage';
import { getAnalytics, isSupported, Analytics } from 'firebase/analytics';

export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyAdQNE9TtUfc0k7rBfiq7nFmL_oXmLT2Zk",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "v111d-a3ee2.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "v111d-a3ee2",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "v111d-a3ee2.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "681929047534",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:681929047534:web:3b1ff24cc88ba59a0fe2ff",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-ZHW0KNGK9K"
};

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;
let storage: FirebaseStorage | null = null;
let analytics: Analytics | null = null;
export let isFirebaseConfigured = false;

try {
  const isPlaceholder =
    firebaseConfig.apiKey.includes("Placeholder") ||
    firebaseConfig.apiKey === "YOUR_API_KEY";

  if (!isPlaceholder && firebaseConfig.apiKey) {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    auth = getAuth(app);
    db = getFirestore(app);
    storage = getStorage(app);
    isFirebaseConfigured = true;

    // Analytics initialization if supported in browser environment
    if (typeof window !== 'undefined') {
      isSupported().then(supported => {
        if (supported && app) {
          analytics = getAnalytics(app);
        }
      }).catch(err => {
        console.debug("Firebase Analytics not supported in this environment:", err);
      });
    }

    console.log("Firebase initialized successfully with project:", firebaseConfig.projectId);
  } else {
    console.info("Firebase running with demo credentials.");
  }
} catch (error) {
  console.warn("Firebase initialization notice:", error);
}

export { app, auth, db, storage, analytics };
