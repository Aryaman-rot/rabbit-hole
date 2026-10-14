import type { Profile } from "./profile-types";

export interface ProfileService {
  getProfile(uid: string): Promise<Profile | null>;
  saveProfile(uid: string, profile: Profile): Promise<Profile>;
}
