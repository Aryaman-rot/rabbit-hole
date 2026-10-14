"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { TriangleAlert } from "lucide-react";
import { useAuth } from "@/lib/auth/auth-context";
import { fakeProfile } from "@/lib/profile/fake-profile";
import {
  AGE_MAX_ALLOWED,
  AGE_MIN_ALLOWED,
  AGE_RANGE_FALLBACK,
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
import { Field } from "@/components/form/field";
import { ChipCheckGroup, ChipRadioGroup } from "@/components/form/chip-group";
import {
  DateOfBirthInput,
  type DobParts,
} from "@/components/form/date-of-birth-input";
import { AgeRangeInput } from "@/components/form/age-range-input";
import { cn } from "@/lib/utils";

const STEPS = [
  "About you",
  "Who you'd like to meet",
  "What you're looking for",
] as const;

const FIRST_NAME_PATTERN = /^[\p{L}][\p{L} '\u2019-]{0,29}$/u;

const MESSAGE = {
  firstNameRequired: "Please tell us your first name.",
  firstNameInvalid: "Use 1-30 letters, spaces, hyphens or apostrophes.",
  birthDateRequired: "Please add your date of birth.",
  birthDateInvalid:
    "That date doesn't exist - please check the day, month and year.",
  birthDateFuture: "Your date of birth can't be in the future.",
  birthDateTooOld: "Please check your date of birth - it looks over 99 years ago.",
  genderRequired: "Please choose one option.",
  interestedInRequired: "Please choose at least one option.",
  ageRangeInvalid: "The lowest age can't be above the highest age.",
  cityRequired: "Please choose a city.",
  intentRequired: "Please choose one option.",
  consentRequired: "Please agree before continuing.",
} as const;

const EMPTY_DOB: DobParts = { day: "", month: "", year: "" };

type Errors = Partial<Record<string, string>>;

const pad = (value: string) => value.padStart(2, "0");

/** ISO date string, or null when a part is missing or the date doesn't exist. */
function toIsoDate(parts: DobParts): string | null {
  if (!parts.day || !parts.month || !parts.year) return null;
  const day = Number(parts.day);
  const month = Number(parts.month);
  const year = Number(parts.year);
  if (month < 1 || month > 12 || day < 1 || day > 31) return null;
  const date = new Date(year, month - 1, day);
  // Rejects impossible dates such as 31 February.
  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return null;
  }
  return `${year}-${pad(String(month))}-${pad(String(day))}`;
}

function ageFromIsoDate(isoDate: string, now = new Date()): number | null {
  const [year, month, day] = isoDate.split("-").map(Number);
  if (!year || !month || !day) return null;
  let age = now.getFullYear() - year;
  const beforeBirthday =
    now.getMonth() + 1 < month ||
    (now.getMonth() + 1 === month && now.getDate() < day);
  if (beforeBirthday) age -= 1;
  return age;
}

/** Split a stored ISO date back into the three fields. */
function fromIsoDate(isoDate: string): DobParts {
  const [year, month, day] = isoDate.split("-");
  if (!year || !month || !day) return EMPTY_DOB;
  return { day, month, year };
}

function defaultAgeRange(age: number | null): { from: number; to: number } {
  if (age === null) {
    return {
      from: AGE_RANGE_FALLBACK.min,
      to: AGE_RANGE_FALLBACK.max,
    };
  }
  return {
    from: Math.max(age - 5, AGE_MIN_ALLOWED),
    to: Math.min(age + 5, AGE_MAX_ALLOWED),
  };
}

export function BasicsWizard({
  onAgeBlocked,
}: {
  onAgeBlocked: () => void;
}) {
  const router = useRouter();
  const { user, signOut } = useAuth();

  const [step, setStep] = useState(0);
  const [firstName, setFirstName] = useState("");
  const [dob, setDob] = useState<DobParts>(EMPTY_DOB);
  const [gender, setGender] = useState<Gender | "">("");
  const [genderSelfDescribed, setGenderSelfDescribed] = useState("");
  const [interestedIn, setInterestedIn] = useState<InterestedIn[]>([]);
  const [city, setCity] = useState<City | "">("");
  const [ageRange, setAgeRange] = useState<{ from: number; to: number }>({
    from: AGE_RANGE_FALLBACK.min,
    to: AGE_RANGE_FALLBACK.max,
  });
  const [intent, setIntent] = useState<Intent | "">("");
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [prefilled, setPrefilled] = useState(false);
  const [saving, setSaving] = useState(false);

  const isoDate = toIsoDate(dob);
  const age = isoDate ? ageFromIsoDate(isoDate) : null;

  useEffect(() => {
    if (!user || prefilled) return;
    let cancelled = false;
    fakeProfile.getProfile(user.uid).then((profile) => {
      if (cancelled) return;
      if (profile) {
        setFirstName(profile.firstName);
        setDob(fromIsoDate(profile.birthDate));
        setGender(profile.gender);
        setGenderSelfDescribed(profile.genderSelfDescribed ?? "");
        setInterestedIn(profile.interestedIn);
        setCity(profile.city);
        setAgeRange({ from: profile.ageMin, to: profile.ageMax });
        setIntent(profile.intent);
      }
      setPrefilled(true);
    });
    return () => {
      cancelled = true;
    };
  }, [user, prefilled]);

  /** Age gate: nothing is stored, the user is signed out and sent home. */
  async function blockUnder18() {
    setSaving(false);
    onAgeBlocked();
    try {
      await signOut();
    } catch {
      /* the fake auth cannot fail; ignore */
    }
  }

  function handleDobChange(next: DobParts) {
    setDob(next);
    if (errors.birthDate) setErrors((prev) => ({ ...prev, birthDate: undefined }));
    const nextIso = toIsoDate(next);
    if (!nextIso) return;
    const nextAge = ageFromIsoDate(nextIso);
    if (nextAge === null || nextAge < 0 || nextAge > 99) return;
    // Re-derive the suggested range until the user edits it themselves.
    setAgeRange((current) =>
      current.from === AGE_RANGE_FALLBACK.min &&
      current.to === AGE_RANGE_FALLBACK.max
        ? defaultAgeRange(nextAge)
        : current,
    );
  }

  function handleGenderChange(next: Gender) {
    setGender(next);
    if (errors.gender) setErrors((prev) => ({ ...prev, gender: undefined }));
    // Switching away from "Another" clears the free text; nothing is stored for it.
    if (next !== "another") setGenderSelfDescribed("");
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
      if (!dob.day || !dob.month || !dob.year) {
        found.birthDate = MESSAGE.birthDateRequired;
      } else if (!isoDate) {
        found.birthDate = MESSAGE.birthDateInvalid;
      } else if (age !== null && age < 0) {
        found.birthDate = MESSAGE.birthDateFuture;
      } else if (age === null || age > 99) {
        found.birthDate = MESSAGE.birthDateTooOld;
      }
      if (!gender) found.gender = MESSAGE.genderRequired;
    }
    if (index === 1) {
      if (interestedIn.length === 0) {
        found.interestedIn = MESSAGE.interestedInRequired;
      }
      if (
        ageRange.from < AGE_MIN_ALLOWED ||
        ageRange.to < AGE_MIN_ALLOWED ||
        ageRange.from > ageRange.to
      ) {
        found.ageRange = MESSAGE.ageRangeInvalid;
      }
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
    if (Object.keys(found).length > 0) {
      setErrors(found);
      return;
    }
    // Age gate lives at the end of step 1 as well as the final submit, so a
    // minor can never reach step 2.
    if (step === 0 && age !== null && age < 18) {
      void blockUnder18();
      return;
    }
    setErrors({});
    setStep((current) => Math.min(current + 1, STEPS.length - 1));
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
    if (!isoDate || age === null) {
      setErrors({ birthDate: MESSAGE.birthDateInvalid });
      setStep(0);
      return;
    }
    if (age > 99) {
      setErrors({ birthDate: MESSAGE.birthDateTooOld });
      setStep(0);
      return;
    }
    if (age < 18) {
      await blockUnder18();
      return;
    }

    setSaving(true);
    try {
      await fakeProfile.saveProfile(user.uid, {
        firstName: firstName.trim(),
        birthDate: isoDate,
        gender: gender as Gender,
        ...(gender === "another" && genderSelfDescribed.trim()
          ? { genderSelfDescribed: genderSelfDescribed.trim() }
          : {}),
        interestedIn,
        city: city as City,
        ageMin: ageRange.from,
        ageMax: ageRange.to,
        intent: intent as Intent,
        consentAt: new Date().toISOString(),
        schemaVersion: 2,
      });
      router.push("/quiz");
    } finally {
      setSaving(false);
    }
  }

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
                index === step ? "rh-dot-active" : "h-1.5 w-1.5 bg-primary-soft/35",
              )}
            />
          ))}
        </div>
        <p className="mt-4 text-center text-xs text-primary-soft/80">
          Step {step + 1} of {STEPS.length}
        </p>

        <div aria-live="polite" className="sr-only">
          {firstError}
        </div>

        {step === 0 && (
          <div key="step-0" className="rh-slide mt-6">
            <h1 className="text-2xl font-bold tracking-tight text-white">
              About you
            </h1>

            <Field
              label="First name"
              className="mt-6"
              error={errors.firstName}
            >
              <input
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
                className="rh-input"
                placeholder="Aarav"
              />
            </Field>

            <div className="mt-5">
              <DateOfBirthInput
                label="Date of birth"
                value={dob}
                onChange={handleDobChange}
                error={errors.birthDate}
                hint="For age-appropriate matching only."
              />
            </div>

            <ChipRadioGroup
              className="mt-5"
              legend="I am"
              name="basics-gender"
              options={GENDER_OPTIONS}
              value={gender}
              onChange={handleGenderChange}
              error={errors.gender}
            />

            <div
              className={cn("rh-reveal", gender === "another" && "rh-reveal-open")}
            >
              <div>
                <Field
                  label="In your own words"
                  className="mt-4"
                >
                  <input
                    type="text"
                    autoComplete="off"
                    maxLength={30}
                    value={genderSelfDescribed}
                    onChange={(event) =>
                      setGenderSelfDescribed(event.target.value)
                    }
                    placeholder="Optional"
                    tabIndex={gender === "another" ? 0 : -1}
                    aria-hidden={gender === "another" ? undefined : true}
                    className="rh-input"
                  />
                </Field>
              </div>
            </div>
          </div>
        )}

        {step === 1 && (
          <div key="step-1" className="rh-slide mt-6">
            <h1 className="text-2xl font-bold tracking-tight text-white">
              Who you&rsquo;d like to meet
            </h1>

            <ChipCheckGroup
              className="mt-6"
              legend="Show me"
              options={INTERESTED_IN_OPTIONS}
              values={interestedIn}
              onToggle={toggleInterestedIn}
              error={errors.interestedIn}
            />

            <div className="mt-6">
              <AgeRangeInput
                label="Age range"
                from={ageRange.from}
                to={ageRange.to}
                onChange={setAgeRange}
                error={errors.ageRange}
              />            </div>

            <ChipRadioGroup
              className="mt-6"
              legend="City"
              name="basics-city"
              options={CITY_OPTIONS}
              value={city}
              onChange={(value) => {
                setCity(value);
                if (errors.city) {
                  setErrors((prev) => ({ ...prev, city: undefined }));
                }
              }}
              error={errors.city}
            />

            {city === "Somewhere else" && (
              <p className="rh-hint">{CITY_OUTSIDE_NOTE}</p>
            )}
          </div>
        )}

        {step === 2 && (
          <div key="step-2" className="rh-slide mt-6">
            <h1 className="text-2xl font-bold tracking-tight text-white">
              What you&rsquo;re looking for
            </h1>

            <ChipRadioGroup
              className="mt-6"
              legend="I&rsquo;m looking for"
              name="basics-intent"
              options={INTENT_OPTIONS}
              value={intent}
              onChange={(value) => {
                setIntent(value);
                if (errors.intent) {
                  setErrors((prev) => ({ ...prev, intent: undefined }));
                }
              }}
              error={errors.intent}
            />

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
                className="rh-focus rh-check"
              />
              <label htmlFor="basics-consent" className="text-sm leading-relaxed text-primary-soft">
                I agree to Rabbit Hole using these details, including who
                I&rsquo;m interested in, to show me relevant people. I can
                change or delete them later.
              </label>
            </div>
            {errors.consent && (
              <p className="rh-error">
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
        <TriangleAlert
          aria-hidden="true"
          className="mx-auto"
          style={{ width: 22, height: 22, color: "var(--color-primary-soft)" }}
        />
        <h1 className="mt-4 text-2xl font-bold tracking-tight text-white">
          You need to be 18 or older to use Rabbit Hole
        </h1>
        <Link href="/" className="rh-focus rh-primary-btn mt-6">
          Back to the start
        </Link>
      </section>
    </main>
  );
}
