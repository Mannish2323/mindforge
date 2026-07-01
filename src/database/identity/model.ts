// src/database/identity/model.ts

/**
 * Identity model representing a user profile and authentication details.
 */
export interface Identity {
  id: string; // UUID primary key
  email: string;
  displayName?: string;
  avatarUrl?: string;
  createdAt: string; // ISO timestamp
  updatedAt: string; // ISO timestamp
  deletedAt?: string | null;
}
