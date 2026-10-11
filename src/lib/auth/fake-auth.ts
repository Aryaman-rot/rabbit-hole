/*
 * ===========================================================================
 *  DEV ONLY — REPLACE WITH FIREBASE.
 * ===========================================================================
 *  This is a fake AuthService used to build and demo the sign-up / log-in
 *  UI before Firebase exists. It has no security whatsoever:
 *   - "Accounts" live in this browser's localStorage under ONE key
 *     (rabbit_hole_auth_user_v1) and store ONLY { uid, email, createdAt }.
 *   - The password is NEVER stored, compared, or logged — it is discarded.
 *   - Email/password sign-in succeeds for any registered email (passwords
 *     cannot be checked because they are never stored); an unknown email
 *     fails with an "invalid-credentials" AuthError.
 *   - "Continue with Google" always signs in a demo user
 *     (demo@rabbithole.test).
 *  Swap this module's export for a Firebase-backed AuthService; the
 *  interface in auth-service.ts is the contract everything else consumes.
 * ===========================================================================
 */

import { AuthError, type AuthUser, type AuthService } from "./auth-service";

const STORAGE_KEY = "rabbit_hole_auth_user_v1";
const FAKE_LATENCY_MS = 400;
const DEMO_EMAIL = "demo@rabbithole.test";

interface StoredUser {
  uid: string;
  email: string;
  createdAt: string;
}

const listeners = new Set<(user: AuthUser | null) => void>();

const delay = (ms: number) =>
  new Promise<void>((resolve) => window.setTimeout(resolve, ms));

const makeUid = () =>
  typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
    ? crypto.randomUUID()
    : `uid-${Date.now()}-${Math.random().toString(36).slice(2)}`;

const readStored = (): StoredUser | null => {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StoredUser;
    if (
      typeof parsed?.uid !== "string" ||
      typeof parsed?.email !== "string" ||
      typeof parsed?.createdAt !== "string"
    ) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
};

const writeStored = (user: StoredUser | null) => {
  try {
    if (user === null) {
      window.localStorage.removeItem(STORAGE_KEY);
    } else {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    }
  } catch {
    /* storage unavailable — stay signed out */
  }
};

const emit = (user: AuthUser | null) => {
  for (const callback of listeners) callback(user);
};

const storeAndEmit = (user: StoredUser) => {
  writeStored(user);
  emit(user);
};

export const fakeAuth: AuthService = {
  async signUpWithEmail(email, password) {
    void password;
    await delay(FAKE_LATENCY_MS);
    const user: StoredUser = {
      uid: makeUid(),
      email,
      createdAt: new Date().toISOString(),
    };
    storeAndEmit(user);
    return user;
  },

  async signInWithEmail(email, password) {
    void password;
    await delay(FAKE_LATENCY_MS);
    const stored = readStored();
    if (!stored || stored.email !== email) {
      throw new AuthError(
        "invalid-credentials",
        "No account found with those details.",
      );
    }
    emit(stored);
    return stored;
  },

  async signInWithGoogle() {
    await delay(FAKE_LATENCY_MS);
    const stored = readStored();
    const user: StoredUser =
      stored?.email === DEMO_EMAIL
        ? stored
        : {
            uid: makeUid(),
            email: DEMO_EMAIL,
            createdAt: new Date().toISOString(),
          };
    storeAndEmit(user);
    return user;
  },

  async signOut() {
    writeStored(null);
    emit(null);
  },

  onAuthChange(callback) {
    listeners.add(callback);
    queueMicrotask(() => callback(readStored()));
    return () => {
      listeners.delete(callback);
    };
  },
};
