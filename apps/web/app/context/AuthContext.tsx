'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import type { User, Session } from '@supabase/supabase-js';
import { createClient } from '../lib/supabase';

export interface UserProfile {
  uid: string;
  username: string;
  name: string; // display_name
  email: string;
  xp: number; // xp_total
  level: number; // computed from xp
  streak: number; // user_streaks.streak
  leafBalance: number; // gems_balance
  isPremium: boolean; // entitlements status
  avatarUrl: string;
  bio: string;
  theme: 'dark' | 'light' | 'system';
  ui_language: string;
  tts_enabled: boolean;
  goal_minutes: number;
  notifications: boolean;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  loginWithEmail: (email: string, pass: string) => Promise<void>;
  signUpWithEmail: (email: string, pass: string, name: string) => Promise<void>;
  signUpStep2: (username: string, displayName: string, avatarUrl: string) => Promise<void>;
  signUpStep3: (goalMinutes: number) => Promise<void>;
  logout: () => Promise<void>;
  updateProfileStats: (xpDelta: number, leafDelta: number) => Promise<void>;
  updateSettings: (settings: Partial<{ theme: 'dark' | 'light' | 'system'; ui_language: string; tts_enabled: boolean; goal_minutes: number; notifications: boolean }>) => Promise<void>;
  updateProfileDetails: (displayName: string, bio: string, avatarUrl: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const supabase = createClient();
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Sync / fetch user profile from Supabase
  const syncUserProfile = async (supabaseUser: User) => {
    try {
      // 1. Fetch profile
      let { data: profileData, error: profileErr } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', supabaseUser.id)
        .single();

      if (profileErr || !profileData) {
        const username = supabaseUser.user_metadata?.username || supabaseUser.email?.split('@')[0] || 'learner_' + Math.random().toString(36).substring(2, 7);
        const displayName = supabaseUser.user_metadata?.full_name || supabaseUser.email?.split('@')[0] || 'Learner';
        
        const { data: newProfile, error: createErr } = await supabase
          .from('profiles')
          .insert({
            id: supabaseUser.id,
            username,
            display_name: displayName,
            avatar_url: null,
            bio: '',
          })
          .select()
          .single();
          
        if (createErr) console.error('Error creating profile:', createErr);
        profileData = newProfile || { id: supabaseUser.id, username, display_name: displayName, avatar_url: null, bio: '' };
      }

      // 2. Fetch Settings
      let { data: settingsData, error: settingsErr } = await supabase
        .from('user_settings')
        .select('*')
        .eq('user_id', supabaseUser.id)
        .single();

      if (settingsErr || !settingsData) {
        const { data: newSettings } = await supabase
          .from('user_settings')
          .insert({ user_id: supabaseUser.id })
          .select()
          .single();
        settingsData = newSettings || { theme: 'dark', ui_language: 'en', tts_enabled: true, goal_minutes: 10, notifications: true };
      }

      // 3. Fetch Stats
      let { data: statsData, error: statsErr } = await supabase
        .from('user_stats')
        .select('*')
        .eq('user_id', supabaseUser.id)
        .single();

      if (statsErr || !statsData) {
        const { data: newStats } = await supabase
          .from('user_stats')
          .insert({ user_id: supabaseUser.id })
          .select()
          .single();
        statsData = newStats || { xp_total: 0, xp_today: 0, gems_balance: 5, lessons_done: 0, words_learned: 0, reviews_done: 0 };
      }

      // 4. Fetch Streaks
      let { data: streakData, error: streakErr } = await supabase
        .from('user_streaks')
        .select('*')
        .eq('user_id', supabaseUser.id)
        .single();

      if (streakErr || !streakData) {
        const { data: newStreak } = await supabase
          .from('user_streaks')
          .insert({ user_id: supabaseUser.id })
          .select()
          .single();
        streakData = newStreak || { streak: 0, longest: 0, freeze_count: 0 };
      }

      // 5. Fetch Entitlements
      let { data: entitlementsData, error: entErr } = await supabase
        .from('entitlements')
        .select('*')
        .eq('user_id', supabaseUser.id)
        .single();

      if (entErr || !entitlementsData) {
        const { data: newEnt } = await supabase
          .from('entitlements')
          .insert({ user_id: supabaseUser.id, plan_id: 'free', status: 'free' })
          .select()
          .single();
        entitlementsData = newEnt || { status: 'free' };
      }

      const mergedProfile: UserProfile = {
        uid: supabaseUser.id,
        username: profileData.username || '',
        name: profileData.display_name || '',
        email: supabaseUser.email || '',
        xp: statsData.xp_total ?? 0,
        level: Math.floor((statsData.xp_total ?? 0) / 100) + 1,
        streak: streakData.streak ?? 0,
        leafBalance: statsData.gems_balance ?? 5,
        isPremium: entitlementsData.status === 'pro' || entitlementsData.status === 'yearly',
        avatarUrl: profileData.avatar_url || '🦊',
        bio: profileData.bio || '',
        theme: settingsData.theme || 'dark',
        ui_language: settingsData.ui_language || 'en',
        tts_enabled: settingsData.tts_enabled ?? true,
        goal_minutes: settingsData.goal_minutes ?? 10,
        notifications: settingsData.notifications ?? true,
        createdAt: profileData.created_at || new Date().toISOString(),
      };

      setProfile(mergedProfile);
    } catch (error) {
      console.error('Error syncing user profile:', error);
    }
  };

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        syncUserProfile(session.user);
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    // Subscribe to auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        await syncUserProfile(session.user);
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo:
            typeof window !== 'undefined'
              ? `${window.location.origin}/auth/callback/`
              : undefined,
        },
      });
      if (error) throw error;
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const loginWithEmail = async (email: string, pass: string) => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password: pass,
      });
      if (error) {
        setLoading(false);
        throw error;
      }
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const signUpWithEmail = async (email: string, pass: string, name: string) => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password: pass,
        options: {
          data: { username: name, full_name: name },
        },
      });
      if (error) {
        setLoading(false);
        throw error;
      }
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const signUpStep2 = async (username: string, displayName: string, avatarUrl: string) => {
    if (!user) throw new Error('Not authenticated');
    const { error } = await supabase
      .from('profiles')
      .update({
        username,
        display_name: displayName,
        avatar_url: avatarUrl,
      })
      .eq('id', user.id);

    if (error) throw error;
    
    // Update local profile state
    setProfile(prev => prev ? {
      ...prev,
      username,
      name: displayName,
      avatarUrl,
    } : null);
  };

  const signUpStep3 = async (goalMinutes: number) => {
    if (!user) throw new Error('Not authenticated');
    const { error } = await supabase
      .from('user_settings')
      .update({ goal_minutes: goalMinutes })
      .eq('user_id', user.id);

    if (error) throw error;

    // Update local profile state
    setProfile(prev => prev ? {
      ...prev,
      goal_minutes: goalMinutes,
    } : null);
  };

  const logout = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        setLoading(false);
        throw error;
      }
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const updateProfileStats = async (xpDelta: number, leafDelta: number) => {
    if (!user || !profile) return;
    try {
      const newXp = profile.xp + xpDelta;
      const newGems = Math.max(0, profile.leafBalance + leafDelta);
      
      const { error } = await supabase
        .from('user_stats')
        .update({
          xp_total: newXp,
          gems_balance: newGems,
          last_active: new Date().toISOString().split('T')[0],
        })
        .eq('user_id', user.id);

      if (error) throw error;

      setProfile(prev => prev ? {
        ...prev,
        xp: newXp,
        level: Math.floor(newXp / 100) + 1,
        leafBalance: newGems,
      } : null);
    } catch (err) {
      console.error('Error updating stats:', err);
    }
  };

  const updateSettings = async (settings: Partial<{ theme: 'dark' | 'light' | 'system'; ui_language: string; tts_enabled: boolean; goal_minutes: number; notifications: boolean }>) => {
    if (!user || !profile) return;
    try {
      const { error } = await supabase
        .from('user_settings')
        .update(settings)
        .eq('user_id', user.id);

      if (error) throw error;

      setProfile(prev => prev ? {
        ...prev,
        ...settings,
      } : null);
    } catch (err) {
      console.error('Error updating settings:', err);
    }
  };

  const updateProfileDetails = async (displayName: string, bio: string, avatarUrl: string) => {
    if (!user) throw new Error('Not authenticated');
    const { error } = await supabase
      .from('profiles')
      .update({
        display_name: displayName,
        bio: bio,
        avatar_url: avatarUrl,
      })
      .eq('id', user.id);

    if (error) throw error;
    
    // Update local profile state
    setProfile(prev => prev ? {
      ...prev,
      name: displayName,
      bio,
      avatarUrl,
    } : null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        loading,
        signInWithGoogle,
        loginWithEmail,
        signUpWithEmail,
        signUpStep2,
        signUpStep3,
        logout,
        updateProfileStats,
        updateSettings,
        updateProfileDetails,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
