"use client";

import { useEffect, useLayoutEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Component as SpotlightCursor } from "@/components/ui/spotlight-cursor";
import { useBackground } from "@/components/background-provider";
import { cn } from "@/lib/utils";

const spotlightConfig = {
  color: "#CD1C18",
  brightness: 0.18,
  radius: 220,
};

export function Landing() {
  const router = useRouter();
  const { fall, warm } = useBackground();
  const [finePointer, setFinePointer] = useState(false);
  const [entered, setEntered] = useState(false);
  const [settled, setSettled] = useState(false);

  useLayoutEffect(() => {
    const root = document.documentElement;
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const maskSupported =
      typeof CSS !== "undefined" &&
      (CSS.supports("mask-image", "linear-gradient(#000, #000)") ||
        CSS.supports("-webkit-mask-image", "linear-gradient(#000, #000)"));
    const animClass = maskSupported ? "rh-anim" : "rh-anim-fade";
    const animated = !reduce;
    if (animated) root.classList.add(animClass);

    let cancelled = false;
    const warmWhenIdle = () => {
      if (cancelled) return;
      const requestIdle =
        typeof window.requestIdleCallback === "function"
          ? window.requestIdleCallback.bind(window)
          : null;
      if (requestIdle) {
        requestIdle(
          () => {
            if (!cancelled) warm();
          },
          { timeout: 2000 },
        );
      } else {
        window.setTimeout(() => {
          if (!cancelled) warm();
        }, 200);
      }
    };

    if (!animated) {
      warmWhenIdle();
    } else {
      const begin = () => {
        if (cancelled) return;
        root.classList.add("rh-begin");
        window.setTimeout(warmWhenIdle, 3600);
      };
      if (document.fonts) {
        document.fonts.ready.then(begin, begin);
      } else {
        begin();
      }
    }
    return () => {
      cancelled = true;
    };
  }, [warm]);

  useEffect(() => {
    router.prefetch("/onboarding");
  }, [router]);

  useEffect(() => {
    const mq = window.matchMedia("(pointer: fine)");
    const update = () => setFinePointer(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (!entered) return;
    const t = window.setTimeout(() => setSettled(true), 700);
    return () => window.clearTimeout(t);
  }, [entered]);

  const handleFallIn = () => {
    setEntered(true);
    fall().then(() => {
      router.push("/onboarding");
    });
  };

  return (
    <>
      {finePointer && !settled && (
        <SpotlightCursor
          config={spotlightConfig}
          className={cn(
            "transition-opacity duration-700",
            entered && "opacity-0",
          )}
        />
      )}
      <main className="fixed inset-0 z-10">
        <h1
          aria-label="Rabbit Hole"
          className={cn("rh-title", entered && "rh-title-out")}
        >
          <span aria-hidden="true" className="rh-script">
            Rabbit
          </span>
          <span aria-hidden="true" className="rh-sans">
            Hole
          </span>
        </h1>
        <div className={cn("rh-fall-in", entered && "rh-exited")}>
          <button type="button" className="rh-cta" onClick={handleFallIn}>
            Fall in
          </button>
        </div>
      </main>
    </>
  );
}
