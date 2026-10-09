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
  const { fall } = useBackground();
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
    if (
      !reduce &&
      !root.classList.contains("rh-anim") &&
      !root.classList.contains("rh-anim-fade")
    ) {
      root.classList.add(maskSupported ? "rh-anim" : "rh-anim-fade");
    }
    if (document.fonts) {
      document.fonts.ready.then(
        () => root.classList.add("rh-begin"),
        () => root.classList.add("rh-begin"),
      );
    } else {
      root.classList.add("rh-begin");
    }
  }, []);

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
        <h1 aria-label="Rabbit Hole" className="rh-title">
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
