export type Gender = "woman" | "man" | "non-binary" | "another";

export type InterestedIn = "woman" | "man" | "non-binary";

export type Intent = "serious" | "seeing-where-it-goes" | "casual" | "not-sure";

export type City = "Mumbai" | "Thane" | "Navi Mumbai" | "Somewhere else";

export interface Profile {
  firstName: string;
  birthDate: string;
  gender: Gender;
  interestedIn: InterestedIn[];
  city: City;
  ageMin: number;
  ageMax: number;
  intent: Intent;
  consentAt: string;
  schemaVersion: 1;
}

export const AGE_MIN_ALLOWED = 18;
export const AGE_MAX_ALLOWED = 60;

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
