import type { FirebaseOptions } from 'firebase/app';

/**
 * The Firebase project behind the admins' sign-in and the added tabs (setup: docs/firebase-setup.md).
 * These values are public by design: who may read or write what is decided by firestore.rules.
 * (Analytics is not used, so its measurementId is left out.)
 *
 * Set to null, the site runs without Firebase: the added tabs show as coming soon, and there is no
 * sign-in.
 */
export const FIREBASE_CONFIG: FirebaseOptions | null = {
  apiKey: 'AIzaSyBCZHiIErzgmwwBI2iI5MFar9yZ2unw2kg',
  authDomain: 'tawheed-akidah.firebaseapp.com',
  projectId: 'tawheed-akidah',
  storageBucket: 'tawheed-akidah.firebasestorage.app',
  messagingSenderId: '949895517960',
  appId: '1:949895517960:web:81e59da2cf675c3447bebd',
};
