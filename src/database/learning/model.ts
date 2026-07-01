// src/database/learning/model.ts

/**
 * Learning model representing a lesson or module.
 */
export interface Learning {
  id: string; // UUID
  title: string;
  description?: string;
  level: string; // e.g., "beginner", "intermediate", "advanced"
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}
