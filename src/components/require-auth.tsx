"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/auth-context";

interface RequireAuthProps {
  children: ReactNode;
  /**
   * Lets a child keep rendering after it signs the user out on purpose
   * (the /basics age gate does this so its notice survives the sign-out).
   * Without this, a signed-out user is always redirected to /signup.
   */
  allowSignedOut?: boolean;
}

export function RequireAuth({
  children,
  allowSignedOut = false,
}: RequireAuthProps) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user && !allowSignedOut) router.replace("/signup");
  }, [loading, user, allowSignedOut, router]);

  if (loading || (!user && !allowSignedOut)) return null;

  return <>{children}</>;
}
