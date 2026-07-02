/**
 * useEntitlements — Backend-validated entitlement hook
 *
 * Fetches live usage vs plan limits from the server once per mount (cached 60s).
 * Never relies solely on client-side profile state — all limits are validated
 * against the Supabase entitlements + usage_counters tables server-side.
 *
 * Usage:
 *   const { canUseAI, canStartLesson, aiRemaining, isPremium } = useEntitlements();
 */
'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '@/app/context/AuthContext';

export interface EntitlementState {
  // Loading
  loading: boolean;

  // Plan info
  isPremium: boolean;
  isExpired: boolean;
  planId: string;
  planStatus: string;

  // AI limits
  aiLimit: number;
  aiUsedToday: number;
  aiRemaining: number;
  canUseAI: boolean;

  // Lesson limits
  lessonsLimit: number;
  lessonsToday: number;
  lessonsRemaining: number;
  canStartLesson: boolean;

  // Hearts
  heartsLimit: number;
  heartsUsed: number;
  heartsRemaining: number;

  // Misc
  adsEnabled: boolean;

  // Actions
  refetch: () => Promise<void>;
}

const CACHE_TTL_MS = 60_000; // 60 seconds

let _cache: { data: EntitlementState; fetchedAt: number } | null = null;

export function useEntitlements(): EntitlementState {
  const { profile, session } = useAuth();
  const [state, setState] = useState<EntitlementState>(() => buildFromProfile(profile));
  const fetchingRef = useRef(false);

  const fetchFromServer = useCallback(async () => {
    if (fetchingRef.current) return;
    if (!session?.access_token) return;

    // Return cached if still fresh
    if (_cache && Date.now() - _cache.fetchedAt < CACHE_TTL_MS) {
      setState(_cache.data);
      return;
    }

    fetchingRef.current = true;
    try {
      const res = await fetch('/api/limits/check', {
        headers: { Authorization: `Bearer ${session.access_token}` },
        cache: 'no-store',
      });

      if (!res.ok) {
        // Fall back to profile-derived values on error
        setState(buildFromProfile(profile));
        return;
      }

      const data = await res.json();

      // Check expiry from profile
      const isExpired = !!(
        profile?.endsAt && new Date(profile.endsAt) < new Date()
      );

      const entState: EntitlementState = {
        loading:           false,
        isPremium:         profile?.isPremium ?? false,
        isExpired,
        planId:            data.plan      ?? profile?.planId     ?? 'free',
        planStatus:        data.status    ?? profile?.planStatus ?? 'free',
        aiLimit:           data.ai_limit_daily      ?? profile?.aiLimitDaily      ?? 5,
        aiUsedToday:       data.ai_used_today        ?? 0,
        aiRemaining:       Math.max(0, (data.ai_limit_daily ?? 5) - (data.ai_used_today ?? 0)),
        canUseAI:          data.can_use_ai           ?? true,
        lessonsLimit:      data.lessons_limit_daily  ?? profile?.lessonsLimitDaily ?? 5,
        lessonsToday:      data.lessons_today        ?? 0,
        lessonsRemaining:  Math.max(0, (data.lessons_limit_daily ?? 5) - (data.lessons_today ?? 0)),
        canStartLesson:    data.can_start_lesson     ?? true,
        heartsLimit:       data.hearts_limit         ?? profile?.heartsLimit       ?? 25,
        heartsUsed:        data.hearts_used          ?? 0,
        heartsRemaining:   data.hearts_remaining     ?? (profile?.heartsLimit ?? 25),
        adsEnabled:        data.ads_enabled          ?? profile?.adsEnabled        ?? true,
        refetch:           fetchFromServer,
      };

      _cache = { data: entState, fetchedAt: Date.now() };
      setState(entState);
    } catch {
      setState(buildFromProfile(profile));
    } finally {
      fetchingRef.current = false;
    }
  }, [session?.access_token, profile]);

  useEffect(() => {
    if (profile) {
      // Immediately set profile-derived values (optimistic)
      setState(buildFromProfile(profile));
      // Then validate against server
      fetchFromServer();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile?.planId, profile?.isPremium, session?.access_token]);

  return state;
}

/** Build entitlement state directly from the profile (client-side optimistic) */
function buildFromProfile(profile: ReturnType<typeof useAuth>['profile']): EntitlementState {
  if (!profile) {
    return {
      loading: true,
      isPremium: false,
      isExpired: false,
      planId: 'free',
      planStatus: 'free',
      aiLimit: 5,
      aiUsedToday: 0,
      aiRemaining: 5,
      canUseAI: true,
      lessonsLimit: 5,
      lessonsToday: 0,
      lessonsRemaining: 5,
      canStartLesson: true,
      heartsLimit: 25,
      heartsUsed: 0,
      heartsRemaining: 25,
      adsEnabled: true,
      refetch: async () => {},
    };
  }

  const isExpired = !!(profile.endsAt && new Date(profile.endsAt) < new Date());

  return {
    loading: false,
    isPremium: profile.isPremium && !isExpired,
    isExpired,
    planId: profile.planId,
    planStatus: profile.planStatus,
    aiLimit: profile.aiLimitDaily,
    aiUsedToday: 0,
    aiRemaining: profile.aiLimitDaily,
    canUseAI: true,
    lessonsLimit: profile.lessonsLimitDaily,
    lessonsToday: 0,
    lessonsRemaining: profile.lessonsLimitDaily,
    canStartLesson: true,
    heartsLimit: profile.heartsLimit,
    heartsUsed: profile.heartsUsedToday ?? 0,
    heartsRemaining: profile.heartsLimit - (profile.heartsUsedToday ?? 0),
    adsEnabled: profile.adsEnabled,
    refetch: async () => {},
  };
}

/** Invalidate the server-side cache (call after payment or plan change) */
export function invalidateEntitlementCache() {
  _cache = null;
}
