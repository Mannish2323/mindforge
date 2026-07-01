// src/database/identity/repositories/identity.repository.ts

import { Profile } from "../models/profile.model";

export interface IdentityRepository {
  /** Get a user profile by its UUID */
  getProfile(id: string): Promise<Profile | null>;

  /** Create a new user profile */
  createProfile(profile: Profile): Promise<Profile>;

  /** Update an existing profile (partial) */
  updateProfile(id: string, updates: Partial<Profile>): Promise<Profile>;

  /** Soft‑delete a profile */
  deleteProfile(id: string): Promise<void>;
}
