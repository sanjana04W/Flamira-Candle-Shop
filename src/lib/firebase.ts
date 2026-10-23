// Firebase Client configuration for Flamira
// Compatible with Firebase v10/v11 Cloud Firestore, Storage, and Authentication

export interface FirebaseConfig {
  apiKey?: string;
  authDomain?: string;
  projectId?: string;
  storageBucket?: string;
  messagingSenderId?: string;
  appId?: string;
}

export const firebaseConfig: FirebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 'AIzaSyFlamiraMockKey2026Ceylon',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'flamira-candles.firebaseapp.com',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'flamira-candles',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'flamira-candles.appspot.com',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '1029384756',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '1:1029384756:web:flamiradevceylon',
};

export const isFirebaseConfigured = Boolean(
  process.env.NEXT_PUBLIC_FIREBASE_API_KEY &&
  process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
);

// High-level service connector
export const getFirebaseServices = () => {
  return {
    isLive: isFirebaseConfigured,
    config: firebaseConfig,
    provider: isFirebaseConfigured ? 'Live Firebase Cloud Firestore' : 'High-Performance Local Hybrid Store (Client + Memory)',
  };
};
