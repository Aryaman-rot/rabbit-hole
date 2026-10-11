"use client";

import { useEffect, useId, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, TriangleAlert } from "lucide-react";
import { useAuth } from "@/lib/auth/auth-context";
import { AuthError } from "@/lib/auth/auth-service";
import { cn } from "@/lib/utils";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface FormErrors {
  email: string | null;
  password: string | null;
  age: string | null;
  form: string | null;
}

const NO_ERRORS: FormErrors = {
  email: null,
  password: null,
  age: null,
  form: null,
};

export function SignupForm({ isLogin }: { isLogin: boolean }) {
  const router = useRouter();
  const { user, loading, signUpWithEmail, signInWithEmail, signInWithGoogle } =
    useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [ageAgreed, setAgeAgreed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [googleSubmitting, setGoogleSubmitting] = useState(false);
  const [errors, setErrors] = useState<FormErrors>(NO_ERRORS);

  const emailInputId = useId();
  const emailErrorId = useId();
  const passwordInputId = useId();
  const passwordErrorId = useId();
  const ageInputId = useId();
  const ageErrorId = useId();
  const formErrorId = useId();

  useEffect(() => {
    if (!loading && user) router.replace("/basics");
  }, [loading, user, router]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) return;

    const next: FormErrors = { ...NO_ERRORS };
    if (!EMAIL_PATTERN.test(email.trim())) {
      next.email = "That doesn't look like a valid email address.";
    }
    if (password.length < 8) {
      next.password = "Your password needs at least 8 characters.";
    }
    if (!isLogin && !ageAgreed) {
      next.age = "Please confirm you're 18 or older.";
    }
    setErrors(next);

    if (next.email || next.password || next.age) {
      const firstInvalid = next.email
        ? emailInputId
        : next.password
          ? passwordInputId
          : ageInputId;
      document.getElementById(firstInvalid)?.focus();
      return;
    }

    setSubmitting(true);
    try {
      if (isLogin) {
        await signInWithEmail(email.trim(), password);
      } else {
        await signUpWithEmail(email.trim(), password);
      }
      router.push("/basics");
    } catch (err) {
      const message =
        err instanceof AuthError && err.code === "invalid-credentials"
          ? "We couldn't find an account with those details."
          : "Something went wrong. Please try again.";
      setErrors({ ...NO_ERRORS, form: message });
    } finally {
      setSubmitting(false);
    }
  }

  async function handleGoogle() {
    if (googleSubmitting) return;
    setGoogleSubmitting(true);
    try {
      await signInWithGoogle();
      router.push("/basics");
    } catch {
      setErrors({ ...NO_ERRORS, form: "Something went wrong. Please try again." });
    } finally {
      setGoogleSubmitting(false);
    }
  }

  const firstError =
    errors.email ?? errors.password ?? errors.age ?? errors.form ?? "";

  return (
    <main className="flex min-h-dvh w-full items-center justify-center p-4 sm:p-6">
      <section className="rh-glass rh-panel-in w-full max-w-md p-6 sm:p-8">
        <div className="flex items-center justify-center gap-2">
          <Link
            href="/signup"
            onClick={() => setErrors(NO_ERRORS)}
            aria-current={isLogin ? undefined : "page"}
            className={cn("rh-focus rh-tab", !isLogin && "rh-tab-active")}
          >
            Sign up
          </Link>
          <Link
            href="/signup?mode=login"
            onClick={() => setErrors(NO_ERRORS)}
            aria-current={isLogin ? "page" : undefined}
            className={cn("rh-focus rh-tab", isLogin && "rh-tab-active")}
          >
            Log in
          </Link>
        </div>

        <h1 className="mt-6 text-2xl font-bold text-white">
          {isLogin ? "Welcome back" : "Create your account"}
        </h1>
        <p className="mt-2 text-sm text-primary-soft">
          {isLogin
            ? "Log in to keep falling."
            : "One account, no swiping required."}
        </p>

        <button
          type="button"
          onClick={handleGoogle}
          disabled={googleSubmitting}
          className="rh-focus rh-alt-btn mt-6 w-full"
        >
          {googleSubmitting ? "Signing you in…" : "Continue with Google"}
        </button>

        <div className="rh-or mt-5" aria-hidden="true">
          <span>or</span>
        </div>

        <form onSubmit={handleSubmit} noValidate className="mt-5">
          <div aria-live="polite" className="sr-only">
            {firstError}
          </div>

          {errors.form && (
            <p id={formErrorId} className="rh-error mb-4">
              <TriangleAlert aria-hidden="true" />
              <span>{errors.form}</span>
            </p>
          )}

          <label htmlFor={emailInputId} className="rh-label">
            Email
          </label>
          <input
            id={emailInputId}
            type="email"
            autoComplete="email"
            inputMode="email"
            placeholder="you@example.com"
            value={email}
            onChange={(event) => {
              setEmail(event.target.value);
              if (errors.email || errors.form) {
                setErrors((prev) => ({ ...prev, email: null, form: null }));
              }
            }}
            aria-invalid={errors.email ? true : undefined}
            aria-describedby={errors.email ? emailErrorId : undefined}
            className="rh-input"
          />
          {errors.email && (
            <p id={emailErrorId} className="rh-error">
              <TriangleAlert aria-hidden="true" />
              <span>{errors.email}</span>
            </p>
          )}

          <label htmlFor={passwordInputId} className="rh-label mt-5">
            Password
          </label>
          <div className="rh-password-wrap">
            <input
              id={passwordInputId}
              type={showPassword ? "text" : "password"}
              autoComplete={isLogin ? "current-password" : "new-password"}
              placeholder={isLogin ? "Your password" : "At least 8 characters"}
              value={password}
              onChange={(event) => {
                setPassword(event.target.value);
                if (errors.password || errors.form) {
                  setErrors((prev) => ({ ...prev, password: null, form: null }));
                }
              }}
              aria-invalid={errors.password ? true : undefined}
              aria-describedby={errors.password ? passwordErrorId : undefined}
              className="rh-input rh-password-input"
            />
            <button
              type="button"
              onClick={() => setShowPassword((visible) => !visible)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              aria-pressed={showPassword}
              className="rh-focus rh-show-btn"
            >
              {showPassword ? (
                <EyeOff aria-hidden="true" />
              ) : (
                <Eye aria-hidden="true" />
              )}
            </button>
          </div>
          {errors.password && (
            <p id={passwordErrorId} className="rh-error">
              <TriangleAlert aria-hidden="true" />
              <span>{errors.password}</span>
            </p>
          )}

          {!isLogin && (
            <div className="mt-5 flex items-start gap-3">
              <input
                id={ageInputId}
                type="checkbox"
                checked={ageAgreed}
                onChange={(event) => {
                  setAgeAgreed(event.target.checked);
                  if (errors.age) {
                    setErrors((prev) => ({ ...prev, age: null }));
                  }
                }}
                aria-invalid={errors.age ? true : undefined}
                aria-describedby={errors.age ? ageErrorId : undefined}
                className="rh-focus rh-check"
              />
              <label htmlFor={ageInputId} className="text-sm text-primary-soft">
                I&rsquo;m 18 or older
              </label>
            </div>
          )}
          {errors.age && (
            <p id={ageErrorId} className="rh-error mt-2">
              <TriangleAlert aria-hidden="true" />
              <span>{errors.age}</span>
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            aria-busy={submitting}
            className="rh-focus rh-primary-btn mt-6 w-full"
          >
            {submitting
              ? isLogin
                ? "Signing you in…"
                : "Creating your account…"
              : isLogin
                ? "Log in"
                : "Sign up"}
          </button>
        </form>

        <p className="rh-note mt-5">
          Prototype: no real accounts yet. Please don&rsquo;t use a real
          password.
        </p>
      </section>
    </main>
  );
}
