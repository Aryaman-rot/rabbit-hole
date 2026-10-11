"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { fakeAuth } from "./fake-auth";
import type { AuthUser } from "./auth-service";

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  signUpWithEmail: (email: string, password: string) => Promise<AuthUser>;
  signInWithEmail: (email: string, password: string) => Promise<AuthUser>;
  signInWithGoogle: () => Promise<AuthUser>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return ctx;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = fakeAuth.onAuthChange((nextUser) => {
      setUser(nextUser);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      signUpWithEmail: (email, password) =>
        fakeAuth.signUpWithEmail(email, password),
      signInWithEmail: (email, password) =>
        fakeAuth.signInWithEmail(email, password),
      signInWithGoogle: () => fakeAuth.signInWithGoogle(),
      signOut: () => fakeAuth.signOut(),
    }),
    [user, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
