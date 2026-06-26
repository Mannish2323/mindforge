import { LeagueTier } from "../types";

// Compute league tier from weekly XP
export function calculateLeagueTier(weeklyXP: number): LeagueTier {
  if (weeklyXP >= 2000) return 'obsidian';
  if (weeklyXP >= 1000) return 'diamond';
  if (weeklyXP >= 500) return 'platinum';
  if (weeklyXP >= 250) return 'gold';
  if (weeklyXP >= 100) return 'silver';
  return 'bronze';
}

// Get promotion/demotion thresholds for a tier
export function getLeagueThresholds(tier: LeagueTier): { promotion: number; demotion: number } {
  const thresholds: Record<LeagueTier, { promotion: number; demotion: number }> = {
    bronze: { promotion: 100, demotion: 0 },
    silver: { promotion: 250, demotion: 80 },
    gold: { promotion: 500, demotion: 200 },
    platinum: { promotion: 1000, demotion: 400 },
    diamond: { promotion: 2000, demotion: 800 },
    obsidian: { promotion: Infinity, demotion: 1500 },
  };
  return thresholds[tier];
}

// Get days until league season reset (weekly, resets Monday midnight)
export function getDaysUntilLeagueReset(): number {
  const now = new Date();
  const dayOfWeek = now.getDay(); // 0 = Sunday, 1 = Monday
  const daysUntilMonday = dayOfWeek === 0 ? 1 : 8 - dayOfWeek;
  return daysUntilMonday;
}
