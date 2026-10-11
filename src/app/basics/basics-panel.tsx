"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth/auth-context";

export function BasicsPanel() {
  const { user, signOut } = useAuth();
  const [busy, setBusy] = useState(false);

  async function handleSignOut() {
    if (busy) return;
    setBusy(true);
    try {
      await signOut();
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="flex min-h-dvh w-full items-center justify-center p-4 sm:p-6">
      <section className="rh-glass rh-panel-in w-full max-w-md p-6 text-center sm:p-8">
        <h1 className="text-2xl font-bold text-white">
          Tell us a bit about you - coming next
        </h1>
        <p className="mt-3 text-sm text-primary-soft">
          Signed in as {user?.email}.
        </p>
        <button
          type="button"
          onClick={handleSignOut}
          disabled={busy}
          className="rh-focus rh-alt-btn mt-6"
        >
          {busy ? "Signing you out…" : "Sign out"}
        </button>
      </section>
    </main>
  );
}
