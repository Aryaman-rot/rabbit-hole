"use client";

import { useId } from "react";
import { TriangleAlert } from "lucide-react";
import { AGE_MAX_ALLOWED, AGE_MIN_ALLOWED } from "@/lib/profile/profile-types";

interface AgeRangeInputProps {
  label: string;
  from: number;
  to: number;
  onChange: (next: { from: number; to: number }) => void;
  error?: string | null;
}

const clamp = (value: number) =>
  Math.min(Math.max(value, AGE_MIN_ALLOWED), AGE_MAX_ALLOWED);

const pct = (value: number) =>
  ((value - AGE_MIN_ALLOWED) / (AGE_MAX_ALLOWED - AGE_MIN_ALLOWED)) * 100;

/**
 * Age range with typed "From"/"To" inputs and a dual-handle slider kept in
 * sync. The handles are two overlaid native range inputs, so they stay
 * keyboard operable (arrows/Home/End) and each is announced with its own
 * label and value text. The slider never silently reorders the values: typing
 * a From above the To leaves the state crossed and surfaces an inline error.
 */
export function AgeRangeInput({
  label,
  from,
  to,
  onChange,
  error,
}: AgeRangeInputProps) {
  const groupLabelId = useId();
  const errorId = useId();

  const setFrom = (value: number) => onChange({ from: clamp(value), to });
  const setTo = (value: number) => onChange({ from, to: clamp(value) });

  return (
    <div role="group" aria-labelledby={groupLabelId}>
      <span className="rh-label" id={groupLabelId}>
        {label}
      </span>

      <div className="flex items-center gap-2">
        <label className="flex-1">
          <span className="sr-only">From</span>
          <input
            type="text"
            inputMode="numeric"
            autoComplete="off"
            aria-label="From"
            value={String(from)}
            onChange={(event) => {
              const digits = event.target.value.replace(/\D/g, "").slice(0, 3);
              if (!digits) return;
              setFrom(Number(digits));
            }}
            onBlur={(event) => {
              if (event.target.value === "") setFrom(AGE_MIN_ALLOWED);
            }}
            aria-invalid={error ? true : undefined}
            className="rh-input rh-input-number text-center"
          />
        </label>
        <span aria-hidden="true" className="text-primary-soft">
          to
        </span>
        <label className="flex-1">
          <span className="sr-only">To</span>
          <input
            type="text"
            inputMode="numeric"
            autoComplete="off"
            aria-label="To"
            value={String(to)}
            onChange={(event) => {
              const digits = event.target.value.replace(/\D/g, "").slice(0, 3);
              if (!digits) return;
              setTo(Number(digits));
            }}
            onBlur={(event) => {
              if (event.target.value === "") setTo(AGE_MAX_ALLOWED);
            }}
            aria-invalid={error ? true : undefined}
            className="rh-input rh-input-number text-center"
          />
        </label>
      </div>

      <div className="rh-range mt-3">
        <div className="rh-range-track" aria-hidden="true">
          <div
            className="rh-range-fill"
            style={{ left: `${pct(Math.min(from, to))}%`, right: `${100 - pct(Math.max(from, to))}%` }}
          />
        </div>
        <input
          type="range"
          className="rh-range-input"
          min={AGE_MIN_ALLOWED}
          max={AGE_MAX_ALLOWED}
          value={from}
          onChange={(event) => setFrom(Number(event.target.value))}
          aria-label="Lowest age"
          aria-valuetext={`${from} years old`}
        />
        <input
          type="range"
          className="rh-range-input"
          min={AGE_MIN_ALLOWED}
          max={AGE_MAX_ALLOWED}
          value={to}
          onChange={(event) => setTo(Number(event.target.value))}
          aria-label="Highest age"
          aria-valuetext={`${to} years old`}
        />
      </div>

      <p className="rh-age-line">People aged {from} to {to}</p>

      {error && (
        <p id={errorId} className="rh-error">
          <TriangleAlert aria-hidden="true" />
          <span>{error}</span>
        </p>
      )}
    </div>
  );
}
