import { computed, inject, Injectable, signal } from '@angular/core';
import type { Auth, User } from 'firebase/auth';
import { authentication, database, firebaseEnabled } from '../firebase/firebase';
import { AdminStatus, SignInProblem } from '../models/admin';
import { LanguageService } from './language.service';
import { readStorage, removeStorage, writeStorage } from './storage';

/** Set while an admin is signed in on this browser, so the sign-in code loads at start only for them. */
const ADMIN_KEY = 'asmaa.admin.v1';

/**
 * The admins' sign-in (Firebase Authentication, email and password). An admin is an account whose
 * user id is listed in the database's /admins collection, which only the project's owner can change
 * (in the Firebase console); the database rules check the same list before every write.
 */
@Injectable({ providedIn: 'root' })
export class AdminService {
  private readonly language = inject(LanguageService);

  /** False until Firebase is set up: there is then no sign-in at all. */
  readonly enabled = firebaseEnabled;
  readonly status = signal<AdminStatus>(firebaseEnabled && readStorage(ADMIN_KEY) ? 'starting' : 'signed-out');
  /** The signed-in account's email. */
  readonly email = signal<string | null>(null);
  readonly isAdmin = computed(() => this.status() === 'admin');

  private started?: Promise<Auth>;
  /** The signed-in account's user id. */
  private uid: string | null = null;

  constructor() {
    // A failure shows as the 'error' status.
    if (this.status() === 'starting') this.start().catch(() => undefined);
  }

  /** Signs in. On failure, throws the SignInProblem. */
  async signIn(email: string, password: string): Promise<void> {
    try {
      const [auth, { signInWithEmailAndPassword }] = await Promise.all([this.start(), import('firebase/auth')]);
      await signInWithEmailAndPassword(auth, email.trim(), password);
    } catch (error) {
      throw problemOf(error);
    }
  }

  async signOut(): Promise<void> {
    const [auth, { signOut }] = await Promise.all([this.start(), import('firebase/auth')]);
    await signOut(auth);
  }

  /**
   * Emails a link to set a new password, in the site's language. Firebase does not say whether the
   * address has an account, so this succeeds either way. On failure, throws the SignInProblem.
   */
  async sendPasswordReset(email: string): Promise<void> {
    try {
      const [auth, { sendPasswordResetEmail }] = await Promise.all([this.start(), import('firebase/auth')]);
      auth.languageCode = this.language.lang();
      await sendPasswordResetEmail(auth, email.trim());
    } catch (error) {
      throw problemOf(error);
    }
  }

  /** Loads sign-in, and from then on follows the account: signed in or out, admin or not. */
  private start(): Promise<Auth> {
    this.started ??= Promise.all([authentication(), import('firebase/auth')]).then(([auth, { onAuthStateChanged }]) => {
      onAuthStateChanged(auth, (user) => void this.follow(user));
      return auth;
    });
    return this.started.catch((error) => {
      this.started = undefined;
      if (this.status() === 'starting') this.status.set('error');
      throw error;
    });
  }

  private async follow(user: User | null): Promise<void> {
    this.uid = user?.uid ?? null;
    this.email.set(user?.email ?? null);
    if (!user) {
      removeStorage(ADMIN_KEY);
      this.status.set('signed-out');
      return;
    }
    writeStorage(ADMIN_KEY, '1');
    this.status.set('starting');
    try {
      const [db, { doc, getDoc }] = await Promise.all([database(), import('firebase/firestore/lite')]);
      const entry = await getDoc(doc(db, 'admins', user.uid));
      // The account may have changed meanwhile (signed out, or another one signed in).
      if (this.uid === user.uid) this.status.set(entry.exists() ? 'admin' : 'not-admin');
    } catch {
      if (this.uid === user.uid) this.status.set('error');
    }
  }
}

function problemOf(error: unknown): SignInProblem {
  const code = (error as { code?: unknown } | null)?.code;
  switch (code) {
    case 'auth/invalid-credential':
    case 'auth/invalid-email':
    case 'auth/missing-password':
    case 'auth/user-disabled':
    case 'auth/user-not-found':
    case 'auth/wrong-password':
      return 'wrong';
    case 'auth/too-many-requests':
      return 'tooMany';
    case 'auth/network-request-failed':
      return 'network';
    default:
      return 'other';
  }
}
