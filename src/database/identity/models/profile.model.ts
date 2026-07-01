// src/database/identity/models/profile.model.ts

export interface Profile {
  id: string; // UUID
  email: string;
  name: string;
  created_at: string; // ISO timestamp
  updated_at: string;
}
