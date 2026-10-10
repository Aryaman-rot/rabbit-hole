"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

const slides = [
  {
    headline: "Most dating apps want you to stay.",
    body: "Their business works best when you keep swiping.",
  },
  {
    headline: "We reward you for actually meeting people.",
    body: "Real dates are what move things forward here, not time spent in the app.",
  },
  {
    headline: "Meet, then tell us how it went.",
    body: "A quick confirmation after a date is all it takes. Nothing public, no rankings.",
  },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [current, setCurrent] = useState(0);

  const isLast = current === slides.length - 1;

  return (
    <main className="flex min-h-dvh w-full items-center justify-center p-4 sm:p-6">
      <section className="rh-glass rh-panel-in w-full max-w-md p-6 sm:p-8">
        <header className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            {slides.map((_, idx) => (
              <button
                key={idx}
                type="button"
                aria-label={`Go to slide ${idx + 1}`}
                aria-current={idx === current ? "step" : undefined}
                onClick={() => setCurrent(idx)}
                className={cn(
                  "rh-focus rh-dot",
                  idx === current && "rh-dot-active",
                )}
              />
            ))}
          </div>
          <button
            type="button"
            className="rh-focus rh-quiet"
            onClick={() => router.push("/signup")}
          >
            Skip
          </button>
        </header>

        <div key={current} className="rh-slide my-8 sm:my-10">
          <h1 className="text-2xl leading-tight font-bold text-white sm:text-3xl">
            {slides[current].headline}
          </h1>
          <p className="mt-4 text-base leading-relaxed text-primary-soft">
            {slides[current].body}
          </p>
        </div>

        <footer className="flex items-center justify-between gap-3">
          {current > 0 ? (
            <button
              type="button"
              className="rh-focus rh-quiet"
              onClick={() => setCurrent((c) => c - 1)}
            >
              Back
            </button>
          ) : (
            <span aria-hidden="true" />
          )}
          <button
            type="button"
            className="rh-focus rh-primary-btn"
            onClick={() => {
              if (isLast) {
                router.push("/signup");
              } else {
                setCurrent((c) => c + 1);
              }
            }}
          >
            {isLast ? "Get started" : "Next"}
          </button>
        </footer>
      </section>
    </main>
  );
}