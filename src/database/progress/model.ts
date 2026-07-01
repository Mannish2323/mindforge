// src/database/progress/model.ts

/**
 * Progress model representing a user's learning progress.
 */
export interface Progress {
  id: string; // UUID
  userId: string; // references Identity.id
  lessonId: string; // references Learning.id
  status: "not_started" | "in_progress" | "completed";
  startedAt?: string;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
}
