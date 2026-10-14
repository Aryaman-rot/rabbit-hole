/*
 * ===========================================================================
 *  DEV ONLY — REPLACE WITH THE REAL PROFILE STORE.
 * ===========================================================================
 *  Fake ProfileService for the prototype. Like the auth fake it is not a
 *  database:
 *   - Each user's profile lives in this browser's localStorage under ONE key
 *     per user: rh:profile:<uid>.
 *   - It stores EXACTLY the Profile fields (firstName, birthDate, gender,
 *     interestedIn, city, ageMin, ageMax, intent, consentAt, schemaVersion)
 *     and nothing else. No email, no password, no auth data.
 *   - Writes go through a short delay so the UI's loading states behave like
 *     they will against a real backend.
 *  Swap this module's export for a Firestore-backed ProfileService; the
 *  interface in profile-service.ts is the contract everything else consumes.
 * ===========================================================================
 */

import type { ProfileService } from "./profile-service";
import type {
  City,
  Gender,
  Intent,
  InterestedIn,
  Profile,
} from "./profile-types";

const FAKE_LATENCY_MS = 300;

const storageKey = (uid: string) => `rh:profile:${uid}`;

const delay = (ms: number) =>
  new Promise<void>((resolve) => window.setTimeout(resolve, ms));

const isGender = (value: unknown): value is Gender =>
  value === "woman" ||
  value === "man" ||
  value === "non-binary" ||
  value === "another";

const isInterestedIn = (value: unknown): value is InterestedIn =>
  value === "woman" || value === "man" || value === "non-binary";

const isIntent = (value: unknown): value is Intent =>
  value === "serious" ||
  value === "seeing-where-it-goes" ||
  value === "casual" ||
  value === "not-sure";

const isCity = (value: unknown): value is City =>
  value === "Mumbai" ||
  value === "Thane" ||
  value === "Navi Mumbai" ||
  value === "Somewhere else";

/** Rebuild a validated Profile from unknown JSON, or null if it is unusable. */
const parseProfile = (raw: unknown): Profile | null => {
  if (!raw || typeof raw !== "object") return null;
  const value = raw as Record<string, unknown>;
  if (
    typeof value.firstName !== "string" ||
    typeof value.birthDate !== "string" ||
    !isGender(value.gender) ||
    !Array.isArray(value.interestedIn) ||
    !value.interestedIn.every(isInterestedIn) ||
    !isCity(value.city) ||
    typeof value.ageMin !== "number" ||
    typeof value.ageMax !== "number" ||
    !isIntent(value.intent) ||
    typeof value.consentAt !== "string" ||
    value.schemaVersion !== 1
  ) {
    return null;
  }
  return {
    firstName: value.firstName,
    birthDate: value.birthDate,
    gender: value.gender,
    interestedIn: value.interestedIn,
    city: value.city,
    ageMin: value.ageMin,
    ageMax: value.ageMax,
    intent: value.intent,
    consentAt: value.consentAt,
    schemaVersion: 1,
  };
};

export const fakeProfile: ProfileService = {
  async getProfile(uid) {
    await delay(FAKE_LATENCY_MS);
    try {
      const raw = window.localStorage.getItem(storageKey(uid));
      if (!raw) return null;
      return parseProfile(JSON.parse(raw));
    } catch {
      return null;
    }
  },

  async saveProfile(uid, profile) {
    await delay(FAKE_LATENCY_MS);
    // Store only the known fields, in a fixed shape - nothing else leaks in.
    const stored: Profile = {
      firstName: profile.firstName,
      birthDate: profile.birthDate,
      gender: profile.gender,
      interestedIn: profile.interestedIn,
      city: profile.city,
      ageMin: profile.ageMin,
      ageMax: profile.ageMax,
      intent: profile.intent,
      consentAt: profile.consentAt,
      schemaVersion: 1,
    };
    try {
      window.localStorage.setItem(storageKey(uid), JSON.stringify(stored));
    } catch {
      /* storage unavailable - keep the in-memory value for this session */
    }
    return stored;
  },
};
