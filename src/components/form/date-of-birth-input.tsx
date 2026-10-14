"use client";

import { useId, useRef, type ClipboardEvent, type KeyboardEvent } from "react";
import { TriangleAlert } from "lucide-react";

export interface DobParts {
  day: string;
  month: string;
  year: string;
}

interface DateOfBirthInputProps {
  label: string;
  value: DobParts;
  onChange: (value: DobParts) => void;
  error?: string | null;
  hint?: string;
}

const ORDER = ["day", "month", "year"] as const;
type Part = (typeof ORDER)[number];

const FIELDS: { key: Part; label: string; placeholder: string; max: number }[] = [
  { key: "day", label: "Day", placeholder: "DD", max: 2 },
  { key: "month", label: "Month", placeholder: "MM", max: 2 },
  { key: "year", label: "Year", placeholder: "YYYY", max: 4 },
];

const AUTOCOMPLETE: Record<Part, string> = {
  day: "bday-day",
  month: "bday-month",
  year: "bday-year",
};

/** Accepts "14/10/2000", "14-10-2000", "14.10.2000" or "14102000". */
const parsePastedDate = (text: string): DobParts | null => {
  const match = text.trim().match(/^(\d{1,2})[^\d]{0,2}(\d{1,2})[^\d]{0,2}(\d{4})$/);
  if (!match) return null;
  return {
    day: match[1].padStart(2, "0"),
    month: match[2].padStart(2, "0"),
    year: match[3],
  };
};

/**
 * Custom date-of-birth control: three numeric fields (DD / MM / YYYY) rather
 * than a native date input, which would render a browser-default widget.
 * Typing auto-advances when a field fills, Backspace on an empty field steps
 * back one field, and pasting a full date fills all three at once.
 * Wrapped in role="group" with a visible label plus a per-field aria-label so
 * each part is announced; the error is linked with aria-describedby and pairs
 * an icon with a plain sentence.
 */
export function DateOfBirthInput({
  label,
  value,
  onChange,
  error,
  hint,
}: DateOfBirthInputProps) {
  const groupLabelId = useId();
  const errorId = useId();
  const hintId = useId();

  const refs: Record<Part, React.RefObject<HTMLInputElement | null>> = {
    day: useRef<HTMLInputElement>(null),
    month: useRef<HTMLInputElement>(null),
    year: useRef<HTMLInputElement>(null),
  };

  const focus = (part: Part) => refs[part].current?.focus();

  function handleChange(part: Part, raw: string, max: number) {
    const digits = raw.replace(/\D/g, "").slice(0, max);
    onChange({ ...value, [part]: digits });
    if (digits.length === max) {
      const next = ORDER[ORDER.indexOf(part) + 1];
      if (next) focus(next);
    }
  }

  function handleKeyDown(part: Part, event: KeyboardEvent<HTMLInputElement>) {
    if (event.key !== "Backspace" || value[part]) return;
    const previous = ORDER[ORDER.indexOf(part) - 1];
    if (!previous) return;
    event.preventDefault();
    focus(previous);
  }

  function handlePaste(event: ClipboardEvent<HTMLInputElement>) {
    const parsed = parsePastedDate(event.clipboardData.getData("text"));
    if (!parsed) return;
    event.preventDefault();
    onChange(parsed);
    focus("year");
  }

  const describedBy =
    [error ? errorId : null, hint ? hintId : null].filter(Boolean).join(" ") ||
    undefined;

  return (
    <div role="group" aria-labelledby={groupLabelId}>
      <span className="rh-label" id={groupLabelId}>
        {label}
      </span>
      <div className="grid grid-cols-3 gap-2">
        {FIELDS.map((field) => (
          <input
            key={field.key}
            ref={refs[field.key]}
            type="text"
            inputMode="numeric"
            autoComplete={AUTOCOMPLETE[field.key]}
            aria-label={field.label}
            placeholder={field.placeholder}
            value={value[field.key]}
            onChange={(event) =>
              handleChange(field.key, event.target.value, field.max)
            }
            onKeyDown={(event) => handleKeyDown(field.key, event)}
            onPaste={handlePaste}
            aria-invalid={error ? true : undefined}
            aria-describedby={describedBy}
            className="rh-input rh-input-number text-center"
          />
        ))}
      </div>
      {hint && (
        <p id={hintId} className="rh-hint">
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} className="rh-error">
          <TriangleAlert aria-hidden="true" />
          <span>{error}</span>
        </p>
      )}
    </div>
  );
}
