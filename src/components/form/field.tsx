"use client";

import { Children, cloneElement, isValidElement, useId, type ReactNode } from "react";
import { TriangleAlert } from "lucide-react";

interface FieldProps {
  /** Visible label text (rendered 12px uppercase peach per the design bar). */
  label: string;
  /** Single control element. aria-invalid/describedby are injected via cloneElement. */
  children: ReactNode;
  error?: string | null;
  hint?: string;
  className?: string;
}

/**
 * Label + control + inline error, wired for assistive tech. The error pairs a
 * TriangleAlert icon with a plain sentence and is linked to the control with
 * aria-describedby, so meaning never depends on colour alone.
 */
export function Field({
  label,
  children,
  error,
  hint,
  className,
}: FieldProps) {
  const controlId = useId();
  const errorId = useId();
  const hintId = useId();

  const describedBy =
    [error ? errorId : null, hint ? hintId : null].filter(Boolean).join(" ") ||
    undefined;

  const child = Children.only(children);
  const control = isValidElement<Record<string, unknown>>(child)
    ? cloneElement(child, {
        id: child.props.id ?? controlId,
        "aria-invalid": error ? true : child.props["aria-invalid"],
        "aria-describedby": describedBy ?? child.props["aria-describedby"],
      })
    : child;

  return (
    <div className={className}>
      <label className="rh-label" htmlFor={controlId}>
        {label}
      </label>
      {control}
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

interface FieldGroupProps {
  /** Rendered as the fieldset legend, 12px uppercase peach. */
  label: string;
  /** Group element (fieldset or role="group"). aria wiring is injected. */
  children: ReactNode;
  error?: string | null;
  hint?: string;
  hintNode?: ReactNode;
  className?: string;
}

/**
 * Group form of Field: for chip groups, date groups and other multi-control
 * inputs where a single <label> would be wrong. The group element receives
 * role/aria-describedby so the error is announced once for the whole set.
 */
export function FieldGroup({
  label,
  children,
  error,
  hint,
  hintNode,
  className,
}: FieldGroupProps) {
  const labelId = useId();
  const errorId = useId();
  const hintId = useId();

  const describedBy =
    [error ? errorId : null, hint ? hintId : null].filter(Boolean).join(" ") ||
    undefined;

  return (
    <fieldset
      className={className}
      aria-describedby={describedBy}
      aria-invalid={error ? true : undefined}
      aria-labelledby={labelId}
    >
      <legend className="rh-label" id={labelId}>
        {label}
      </legend>
      {children}
      {hint && (
        <p id={hintId} className="rh-hint">
          {hint}
        </p>
      )}
      {hintNode}
      {error && (
        <p id={errorId} className="rh-error">
          <TriangleAlert aria-hidden="true" />
          <span>{error}</span>
        </p>
      )}
    </fieldset>
  );
}
