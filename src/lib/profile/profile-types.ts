export type Gender = "woman" | "man" | "non-binary" | "another";

export type InterestedIn = "woman" | "man" | "non-binary";

export type Intent = "serious" | "seeing-where-it-goes" | "casual" | "not-sure";

export type City = "Mumbai" | "Thane" | "Navi Mumbai" | "Somewhere else";

/**
 * schemaVersion 1: the original profile shape.
 * schemaVersion 2: adds the optional `genderSelfDescribed` free-text field.
 */
export type ProfileSchemaVersion = 1 | 2;

export interface Profile {
  firstName: string;
  birthDate: string;
  gender: Gender;
  /** Only meaningful when gender is "another"; stored only if non-empty. */
  genderSelfDescribed?: string;
  interestedIn: InterestedIn[];
  city: City;
  ageMin: number;
  ageMax: number;
  intent: Intent;
  consentAt: string;
  schemaVersion: ProfileSchemaVersion;
}

export const AGE_MIN_ALLOWED = 18;
export const AGE_MAX_ALLOWED = 99;

/** Fallback range used before (or instead of) a usable date of birth. */
export const AGE_RANGE_FALLBACK = { min: 18, max: 30 };

export const GENDER_OPTIONS: { value: Gender; label: string }[] = [
  { value: "woman", label: "Woman" },
  { value: "man", label: "Man" },
  { value: "non-binary", label: "Non-binary" },
  { value: "another", label: "Another" },
];

export const INTERESTED_IN_OPTIONS: {
  value: InterestedIn;
  label: string;
}[] = [
  { value: "woman", label: "Women" },
  { value: "man", label: "Men" },
  { value: "non-binary", label: "Non-binary people" },
];

export const CITY_OPTIONS: { value: City; label: string }[] = [
  { value: "Mumbai", label: "Mumbai" },
  { value: "Thane", label: "Thane" },
  { value: "Navi Mumbai", label: "Navi Mumbai" },
  { value: "Somewhere else", label: "Somewhere else" },
];

export const INTENT_OPTIONS: { value: Intent; label: string }[] = [
  { value: "serious", label: "Something serious" },
  { value: "seeing-where-it-goes", label: "Seeing where it goes" },
  { value: "casual", label: "Something casual" },
  { value: "not-sure", label: "Not sure yet" },
];

export const CITY_OUTSIDE_NOTE =
  "We're starting in Mumbai first, we'll let you know";
