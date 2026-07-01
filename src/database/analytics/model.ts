// src/database/analytics/model.ts

/**
 * Analytics model representing a generic analytics record.
 */
export interface AnalyticsRecord {
  id: string; // UUID
  userId: string; // references Identity.id
  event: string; // e.g., "lesson_completed", "login"
  payload?: Record<string, unknown>;
  timestamp: string; // ISO
}
