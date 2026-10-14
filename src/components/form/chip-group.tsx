"use client";

import { FieldGroup } from "./field";
import { cn } from "@/lib/utils";

export interface ChipOption<T extends string> {
  value: T;
  label: string;
}

interface ChipRadioGroupProps<T extends string> {
  legend: string;
  name: string;
  options: ChipOption<T>[];
  value: T | "";
  onChange: (value: T) => void;
  error?: string | null;
  className?: string;
}

interface ChipCheckGroupProps<T extends string> {
  legend: string;
  options: ChipOption<T>[];
  values: T[];
  onToggle: (value: T) => void;
  error?: string | null;
  className?: string;
}

/**
 * Single-select chip group. The native radio input is visually hidden but keeps
 * its semantics, so arrow keys move between options and screen readers announce
 * the checked state; the chip itself is the visible, focus-ringed control.
 */
export function ChipRadioGroup<T extends string>({
  legend,
  name,
  options,
  value,
  onChange,
  error,
  className,
}: ChipRadioGroupProps<T>) {
  return (
    <FieldGroup label={legend} error={error} className={className}>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <label key={option.value} className="inline-flex">
            <input
              type="radio"
              name={name}
              className="rh-chip-input"
              checked={value === option.value}
              onChange={() => onChange(option.value)}
            />
            <span
              className={cn("rh-chip", value === option.value && "rh-chip-selected")}
            >
              {option.label}
            </span>
          </label>
        ))}
      </div>
    </FieldGroup>
  );
}

/** Multi-select chip group (native checkboxes, visually hidden). */
export function ChipCheckGroup<T extends string>({
  legend,
  options,
  values,
  onToggle,
  error,
  className,
}: ChipCheckGroupProps<T>) {
  return (
    <FieldGroup label={legend} error={error} className={className}>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <label key={option.value} className="inline-flex">
            <input
              type="checkbox"
              className="rh-chip-input"
              checked={values.includes(option.value)}
              onChange={() => onToggle(option.value)}
            />
            <span
              className={cn(
                "rh-chip",
                values.includes(option.value) && "rh-chip-selected",
              )}
            >
              {option.label}
            </span>
          </label>
        ))}
      </div>
    </FieldGroup>
  );
}
