"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { usePathname } from "next/navigation";
import { ShaderBackground } from "@/components/ui/red-black-vanila";
import { cn } from "@/lib/utils";

interface BackgroundApi {
  fall: () => Promise<void>;
  warm: () => void;
}

const BackgroundContext = createContext<BackgroundApi | null>(null);

export function useBackground() {
  const ctx = useContext(BackgroundContext);
  if (!ctx) {
    throw new Error("useBackground must be used inside BackgroundProvider");
  }
  return ctx;
}

export function BackgroundProvider({ children }: { children: ReactNode }) {
  const [fallen, setFallen] = useState(false);
  const [warmed, setWarmed] = useState(false);
  const pathname = usePathname();
  const [lastPathname, setLastPathname] = useState(pathname);

  if (lastPathname !== pathname) {
    setLastPathname(pathname);
    if (pathname === "/") setFallen(false);
  }

  const warm = useCallback(() => setWarmed(true), []);

  const fall = useCallback(() => {
    setWarmed(true);
    setFallen(true);
    return new Promise<void>((resolve) => {
      if (
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ) {
        resolve();
        return;
      }
      window.setTimeout(resolve, 1250);
    });
  }, []);

  const value = useMemo(() => ({ fall, warm }), [fall, warm]);
  const visible = fallen || pathname !== "/";
  const mounted = warmed || pathname !== "/";

  return (
    <BackgroundContext.Provider value={value}>
      {mounted && (
        <div
          aria-hidden="true"
          className={cn(
            "rh-bg pointer-events-none fixed inset-0 -z-10",
            visible && "rh-bg-on",
          )}
        >
          <ShaderBackground className="absolute inset-0" />
        </div>
      )}
      {children}
    </BackgroundContext.Provider>
  );
}
