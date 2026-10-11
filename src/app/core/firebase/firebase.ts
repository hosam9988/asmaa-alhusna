import type { FirebaseApp } from 'firebase/app';
import type { Auth } from 'firebase/auth';
import type { Firestore } from 'firebase/firestore/lite';
import { FIREBASE_CONFIG } from './firebase.config';

/** False until the project is filled in, in firebase.config.ts. */
export const firebaseEnabled = FIREBASE_CONFIG !== null;

// Each part of Firebase is fetched the first time it is needed. A visitor's browser only loads the
// small read-only database client, and only on a name's page; the sign-in code loads for admins alone.
let app: Promise<FirebaseApp> | undefined;
let db: Promise<Firestore> | undefined;
let auth: Promise<Auth> | undefined;

function firebaseApp(): Promise<FirebaseApp> {
  const config = FIREBASE_CONFIG;
  if (!config) return Promise.reject(new Error('Firebase is not set up yet (firebase.config.ts).'));
  return (app ??= import('firebase/app').then(({ initializeApp }) => initializeApp(config)));
}

/** The database (Cloud Firestore, its lighter client: plain reads and writes, no live updates). */
export function database(): Promise<Firestore> {
  db ??= Promise.all([firebaseApp(), import('firebase/firestore/lite')]).then(([a, { getFirestore }]) =>
    getFirestore(a),
  );
  // A failed download (say, the connection dropped) may succeed next time.
  return db.catch((error) => {
    db = undefined;
    throw error;
  });
}

/** Sign-in, keeping the admin signed in on this browser between visits. */
export function authentication(): Promise<Auth> {
  auth ??= Promise.all([firebaseApp(), import('firebase/auth')]).then(([a, m]) =>
    m.initializeAuth(a, { persistence: [m.indexedDBLocalPersistence, m.browserLocalPersistence] }),
  );
  return auth.catch((error) => {
    auth = undefined;
    throw error;
  });
}
