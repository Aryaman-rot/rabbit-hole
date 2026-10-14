"use client";

import Link from "next/link";
import { useEffect, useId, useState } from "react";
import { useRouter } from "next/navigation";
import { TriangleAlert } from "lucide-react";
import { useAuth } from "@/lib/auth/auth-context";
import { fakeProfile } from "@/lib/profile/fake-profile";
import {
  AGE_MAX_ALLOWED,
  AGE_MIN_ALLOWED,
  CITY_OPTIONS,
  CITY_OUTSIDE_NOTE,
  GENDER_OPTIONS,
  INTENT_OPTIONS,
  INTERESTED_IN_OPTIONS,
  type City,
  type Gender,
  type Intent,
  type InterestedIn,
} from "@/lib/profile/profile-types";
import { cn } from "@/lib/utils";

const STEPS = ["About you", "Who you'd like to meet", "What you're looking for"] as const;

const FIRST_NAME_PATTERN = /^[\p{L}][\p{L} '\u2019-]{0,29}$/u;

const MESSAGE = {
  firstNameRequired: "Please tell us your first name.",
  firstNameInvalid: "Use 1-30 letters, spaces, hyphens or apostrophes.",
  birthDateRequired: "Please add your date of birth.",
  birthDateInvalid:
    "Please check your date of birth - it can't be in the future or more than 99 years ago.",
  genderRequired: "Please choose one option.",
  interestedInRequired: "Please choose at least one option.",
  ageRangeInvalid: "The lowest age can't be above the highest age.",
  cityRequired: "Please choose a city.",
  intentRequired: "Please choose one option.",
  consentRequired: "Please agree before continuing.",
} as const;

type Errors = Partial<Record<string, string>>;

function ageFromBirthDate(birthDate: string, now = new Date()): number | null {
  const [year, month, day] = birthDate.split("-").map(Number);
  if (!year || !month || !day) return null;
  let age = now.getFullYear() - year;
  const beforeBirthday =
    now.getMonth() + 1 < month ||
    (now.getMonth() + 1 === month && now.getDate() < day);
  if (beforeBirthday) age -= 1;
  return age;
}

function isPossibleBirthDate(birthDate: string, now = new Date()): boolean {
  const age = ageFromBirthDate(birthDate, now);
  if (age === null) return false;
  return age >= 0 && age <= 99;
}

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

export function BasicsWizard({
  onAgeBlocked,
}: {
  onAgeBlocked: () => void;
}) {
  const router = useRouter();
  const { user, signOut } = useAuth();

  const [step, setStep] = useState(0);
  const [firstName, setFirstName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [gender, setGender] = useState<Gender | "">("");
  const [interestedIn, setInterestedIn] = useState<InterestedIn[]>([]);
  const [city, setCity] = useState<City | "">("");
  const [ageMin, setAgeMin] = useState(AGE_MIN_ALLOWED);
  const [ageMax, setAgeMax] = useState(AGE_MIN_ALLOWED);
  const [ageRangeTouched, setAgeRangeTouched] = useState(false);
  const [intent, setIntent] = useState<Intent | "">("");
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [prefilled, setPrefilled] = useState(false);
  const [saving, setSaving] = useState(false);

  const firstNameErrorId = useId();
  const birthDateErrorId = useId();
  const genderErrorId = useId();
  const interestedInErrorId = useId();
  const ageRangeErrorId = useId();
  const cityErrorId = useId();
  const intentErrorId = useId();
  const consentErrorId = useId();

  useEffect(() => {
    if (!user || prefilled) return;
    let cancelled = false;
    fakeProfile.getProfile(user.uid).then((profile) => {
      if (cancelled || !profile) {
        setPrefilled(true);
        return;
      }
      setFirstName(profile.firstName);
      setBirthDate(profile.birthDate);
      setGender(profile.gender);
      setInterestedIn(profile.interestedIn);
      setCity(profile.city);
      setAgeMin(profile.ageMin);
      setAgeMax(profile.ageMax);
      setAgeRangeTouched(true);
      setIntent(profile.intent);
      setPrefilled(true);
    });
    return () => {
      cancelled = true;
    };
  }, [user, prefilled]);

  function applyDefaultAgeRange(nextAge: number) {
    if (ageRangeTouched) return;
    setAgeMin(clamp(nextAge - 5, AGE_MIN_ALLOWED, AGE_MAX_ALLOWED));
    setAgeMax(clamp(nextAge + 5, AGE_MIN_ALLOWED, AGE_MAX_ALLOWED));
  }

  function handleBirthDateChange(value: string) {
    setBirthDate(value);
    if (errors.birthDate) setErrors((prev) => ({ ...prev, birthDate: undefined }));
    if (value && isPossibleBirthDate(value)) {
      const nextAge = ageFromBirthDate(value);
      if (nextAge !== null) applyDefaultAgeRange(nextAge);
    }
  }

  function toggleInterestedIn(value: InterestedIn) {
    setInterestedIn((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value],
    );
    if (errors.interestedIn) {
      setErrors((prev) => ({ ...prev, interestedIn: undefined }));
    }
  }

  function validateStep(index: number): Errors {
    const found: Errors = {};
    if (index === 0) {
      const trimmed = firstName.trim();
      if (!trimmed) found.firstName = MESSAGE.firstNameRequired;
      else if (!FIRST_NAME_PATTERN.test(trimmed)) {
        found.firstName = MESSAGE.firstNameInvalid;
      }
      if (!birthDate) found.birthDate = MESSAGE.birthDateRequired;
      else if (!isPossibleBirthDate(birthDate)) {
        found.birthDate = MESSAGE.birthDateInvalid;
      }
      if (!gender) found.gender = MESSAGE.genderRequired;
    }
    if (index === 1) {
      if (interestedIn.length === 0) {
        found.interestedIn = MESSAGE.interestedInRequired;
      }
      if (ageMin > ageMax) found.ageRange = MESSAGE.ageRangeInvalid;
      if (!city) found.city = MESSAGE.cityRequired;
    }
    if (index === 2) {
      if (!intent) found.intent = MESSAGE.intentRequired;
      if (!consent) found.consent = MESSAGE.consentRequired;
    }
    return found;
  }

  function handleNext() {
    const found = validateStep(step);
    setErrors(found);
    if (Object.keys(found).length === 0) {
      setStep((current) => Math.min(current + 1, STEPS.length - 1));
    }
  }

  function handleBack() {
    setErrors({});
    setStep((current) => Math.max(current - 1, 0));
  }

  async function handleContinue() {
    const found = validateStep(2);
    if (Object.keys(found).length > 0) {
      setErrors(found);
      return;
    }
    if (!user) return;

    const submitAge = ageFromBirthDate(birthDate);
    if (submitAge === null || !isPossibleBirthDate(birthDate)) {
      setErrors({ birthDate: MESSAGE.birthDateInvalid });
      setStep(0);
      return;
    }
    if (submitAge < 18) {
      // Age gate: persist nothing, surface the block, sign out, offer a way home.
      setSaving(false);
      onAgeBlocked();
      try {
        await signOut();
      } catch {
        /* fake auth cannot fail; ignore */
      }
      return;
    }

    setSaving(true);
    try {
      await fakeProfile.saveProfile(user.uid, {
        firstName: firstName.trim(),
        birthDate,
        gender: gender as Gender,
        interestedIn,
        city: city as City,
        ageMin,
        ageMax,
        intent: intent as Intent,
        consentAt: new Date().toISOString(),
        schemaVersion: 1,
      });
      router.push("/quiz");
    } finally {
      setSaving(false);
    }
  }

  const ageOptions = Array.from(
    { length: AGE_MAX_ALLOWED - AGE_MIN_ALLOWED + 1 },
    (_, index) => AGE_MIN_ALLOWED + index,
  );

  const firstError = Object.values(errors).find(Boolean) ?? "";

  return (
    <main className="flex min-h-dvh w-full items-center justify-center p-4 sm:p-6">
      <section className="rh-glass rh-panel-in w-full max-w-md p-6 sm:p-8">
        <div className="flex items-center justify-center gap-2" aria-hidden="true">
          {STEPS.map((label, index) => (
            <span
              key={label}
              className={cn(
                "rh-dot",
                index === step && "rh-dot-active",
                index !== step && "h-1.5 w-1.5 rounded-full bg-primary-soft/35",
              )}
            />
          ))}
        </div>
        <p className="mt-3 text-center text-xs text-primary-soft/80">
          Step {step + 1} of {STEPS.length}
        </p>

        <div aria-live="polite" className="sr-only">
          {firstError}
        </div>

        {step === 0 && (
          <div key="step-0" className="rh-slide mt-6">
            <h1 className="text-2xl font-bold text-white">About you</h1>

            <label htmlFor="basics-first-name" className="rh-label mt-6">
              First name
            </label>
            <input
              id="basics-first-name"
              type="text"
              autoComplete="given-name"
              maxLength={30}
              value={firstName}
              onChange={(event) => {
                setFirstName(event.target.value);
                if (errors.firstName) {
                  setErrors((prev) => ({ ...prev, firstName: undefined }));
                }
              }}
              aria-invalid={errors.firstName ? true : undefined}
              aria-describedby={errors.firstName ? firstNameErrorId : undefined}
              className="rh-input"
              placeholder="Aarav"
            />
            {errors.firstName && (
              <p id={firstNameErrorId} className="rh-error">
                <TriangleAlert aria-hidden="true" />
                <span>{errors.firstName}</span>
              </p>
            )}

            <label htmlFor="basics-birth-date" className="rh-label mt-5">
              Date of birth
            </label>
            <input
              id="basics-birth-date"
              type="date"
              autoComplete="bday"
              value={birthDate}
              onChange={(event) => handleBirthDateChange(event.target.value)}
              aria-invalid={errors.birthDate ? true : undefined}
              aria-describedby={errors.birthDate ? birthDateErrorId : undefined}
              className="rh-input"
            />
            {errors.birthDate && (
              <p id={birthDateErrorId} className="rh-error">
                <TriangleAlert aria-hidden="true" />
                <span>{errors.birthDate}</span>
              </p>
            )}

            <fieldset
              className="mt-5"
              aria-invalid={errors.gender ? true : undefined}
              aria-describedby={errors.gender ? genderErrorId : undefined}
            >
              <legend className="rh-label">I am</legend>
              <div className="flex flex-wrap gap-2">
                {GENDER_OPTIONS.map((option) => (
                  <label key={option.value} className="inline-flex">
                    <input
                      type="radio"
                      name="basics-gender"
                      className="rh-chip-input"
                      checked={gender === option.value}
                      onChange={() => {
                        setGender(option.value);
                        if (errors.gender) {
                          setErrors((prev) => ({ ...prev, gender: undefined }));
                        }
                      }}
                    />
                    <span
                      className={cn(
                        "rh-chip",
                        gender === option.value && "rh-chip-selected",
                      )}
                    >
                      {option.label}
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>
            {errors.gender && (
              <p id={genderErrorId} className="rh-error">
                <TriangleAlert aria-hidden="true" />
                <span>{errors.gender}</span>
              </p>
            )}
          </div>
        )}

        {step === 1 && (
          <div key="step-1" className="rh-slide mt-6">
            <h1 className="text-2xl font-bold text-white">
              Who you&rsquo;d like to meet
            </h1>

            <fieldset
              className="mt-6"
              aria-invalid={errors.interestedIn ? true : undefined}
              aria-describedby={
                errors.interestedIn ? interestedInErrorId : undefined
              }
            >
              <legend className="rh-label">Show me</legend>
              <div className="flex flex-wrap gap-2">
                {INTERESTED_IN_OPTIONS.map((option) => (
                  <label key={option.value} className="inline-flex">
                    <input
                      type="checkbox"
                      className="rh-chip-input"
                      checked={interestedIn.includes(option.value)}
                      onChange={() => toggleInterestedIn(option.value)}
                    />
                    <span
                      className={cn(
                        "rh-chip",
                        interestedIn.includes(option.value) &&
                          "rh-chip-selected",
                      )}
                    >
                      {option.label}
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>
            {errors.interestedIn && (
              <p id={interestedInErrorId} className="rh-error">
                <TriangleAlert aria-hidden="true" />
                <span>{errors.interestedIn}</span>
              </p>
            )}

            <fieldset
              className="mt-5"
              aria-invalid={errors.ageRange ? true : undefined}
              aria-describedby={errors.ageRange ? ageRangeErrorId : undefined}
            >
              <legend className="rh-label">Age range</legend>
              <div className="flex items-center gap-3">
                <select
                  aria-label="Lowest age"
                  className="rh-input"
                  value={ageMin}
                  onChange={(event) => {
                    setAgeRangeTouched(true);
                    setAgeMin(Number(event.target.value));
                    if (errors.ageRange) {
                      setErrors((prev) => ({ ...prev, ageRange: undefined }));
                    }
                  }}
                >
                  {ageOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
                <span aria-hidden="true" className="text-primary-soft">
                  to
                </span>
                <select
                  aria-label="Highest age"
                  className="rh-input"
                  value={ageMax}
                  onChange={(event) => {
                    setAgeRangeTouched(true);
                    setAgeMax(Number(event.target.value));
                    if (errors.ageRange) {
                      setErrors((prev) => ({ ...prev, ageRange: undefined }));
                    }
                  }}
                >
                  {ageOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
            </fieldset>
            {errors.ageRange && (
              <p id={ageRangeErrorId} className="rh-error">
                <TriangleAlert aria-hidden="true" />
                <span>{errors.ageRange}</span>
              </p>
            )}

            <fieldset
              className="mt-5"
              aria-invalid={errors.city ? true : undefined}
              aria-describedby={errors.city ? cityErrorId : undefined}
            >
              <legend className="rh-label">City</legend>
              <div className="flex flex-wrap gap-2">
                {CITY_OPTIONS.map((option) => (
                  <label key={option.value} className="inline-flex">
                    <input
                      type="radio"
                      name="basics-city"
                      className="rh-chip-input"
                      checked={city === option.value}
                      onChange={() => {
                        setCity(option.value);
                        if (errors.city) {
                          setErrors((prev) => ({ ...prev, city: undefined }));
                        }
                      }}
                    />
                    <span
                      className={cn(
                        "rh-chip",
                        city === option.value && "rh-chip-selected",
                      )}
                    >
                      {option.label}
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>
            {errors.city && (
              <p id={cityErrorId} className="rh-error">
                <TriangleAlert aria-hidden="true" />
                <span>{errors.city}</span>
              </p>
            )}

            {city === "Somewhere else" && (
              <p className="mt-4 text-sm text-primary-soft">{CITY_OUTSIDE_NOTE}</p>
            )}
          </div>
        )}

        {step === 2 && (
          <div key="step-2" className="rh-slide mt-6">
            <h1 className="text-2xl font-bold text-white">
              What you&rsquo;re looking for
            </h1>

            <fieldset
              className="mt-6"
              aria-invalid={errors.intent ? true : undefined}
              aria-describedby={errors.intent ? intentErrorId : undefined}
            >
              <legend className="rh-label">I&rsquo;m looking for</legend>
              <div className="flex flex-wrap gap-2">
                {INTENT_OPTIONS.map((option) => (
                  <label key={option.value} className="inline-flex">
                    <input
                      type="radio"
                      name="basics-intent"
                      className="rh-chip-input"
                      checked={intent === option.value}
                      onChange={() => {
                        setIntent(option.value);
                        if (errors.intent) {
                          setErrors((prev) => ({ ...prev, intent: undefined }));
                        }
                      }}
                    />
                    <span
                      className={cn(
                        "rh-chip",
                        intent === option.value && "rh-chip-selected",
                      )}
                    >
                      {option.label}
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>
            {errors.intent && (
              <p id={intentErrorId} className="rh-error">
                <TriangleAlert aria-hidden="true" />
                <span>{errors.intent}</span>
              </p>
            )}

            <div className="mt-6 flex items-start gap-3">
              <input
                id="basics-consent"
                type="checkbox"
                checked={consent}
                onChange={(event) => {
                  setConsent(event.target.checked);
                  if (errors.consent) {
                    setErrors((prev) => ({ ...prev, consent: undefined }));
                  }
                }}
                aria-invalid={errors.consent ? true : undefined}
                aria-describedby={errors.consent ? consentErrorId : undefined}
                className="rh-focus rh-check"
              />
              <label htmlFor="basics-consent" className="text-sm text-primary-soft">
                I agree to Rabbit Hole using these details, including who
                I&rsquo;m interested in, to show me relevant people. I can
                change or delete them later.
              </label>
            </div>
            {errors.consent && (
              <p id={consentErrorId} className="rh-error mt-2">
                <TriangleAlert aria-hidden="true" />
                <span>{errors.consent}</span>
              </p>
            )}
          </div>
        )}

        <div className="mt-8 flex items-center justify-between gap-3">
          {step > 0 ? (
            <button
              type="button"
              onClick={handleBack}
              className="rh-focus rh-quiet"
            >
              Back
            </button>
          ) : (
            <span aria-hidden="true" />
          )}
          {step < STEPS.length - 1 ? (
            <button
              type="button"
              onClick={handleNext}
              className="rh-focus rh-primary-btn"
            >
              Next
            </button>
          ) : (
            <button
              type="button"
              onClick={handleContinue}
              disabled={saving}
              aria-busy={saving}
              className="rh-focus rh-primary-btn"
            >
              {saving ? "Saving…" : "Continue"}
            </button>
          )}
        </div>
      </section>
    </main>
  );
}

export function AgeBlockedNotice() {
  return (
    <main className="flex min-h-dvh w-full items-center justify-center p-4 sm:p-6">
      <section className="rh-glass rh-panel-in w-full max-w-md p-6 text-center sm:p-8">
        <TriangleAlert aria-hidden="true" className="mx-auto" style={{ width: 22, height: 22, color: "var(--color-primary-soft)" }} />
        <h1 className="mt-4 text-2xl font-bold text-white">
          You need to be 18 or older to use Rabbit Hole
        </h1>
        <Link href="/" className="rh-focus rh-primary-btn mt-6">
          Back to the start
        </Link>
      </section>
    </main>
  );
}
