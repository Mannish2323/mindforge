'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import type { User, Session } from '@supabase/supabase-js';
import { createClient } from '../lib/supabase';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';

interface UserProfile {
  uid: string;
  name: string;
  email: string;
  xp: number;
  level: number;
  streak: number;
  leafBalance: number;
  isPremium: boolean;
  createdAt: any;
  lastActive: any;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  loginWithEmail: (email: string, pass: string) => Promise<void>;
  signUpWithEmail: (email: string, pass: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfileStats: (xpDelta: number, leafDelta: number) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const supabase = createClient();
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Sync / create user profile in Firestore
  const syncUserProfile = async (supabaseUser: User) => {
    try {
      const userRef = doc(db, 'users', supabaseUser.id);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const data = userSnap.data() as UserProfile;
        setProfile(data);
        await setDoc(userRef, { lastActive: serverTimestamp() }, { merge: true });
      } else {
        const newProfile: UserProfile = {
          uid: supabaseUser.id,
          name:
            supabaseUser.user_metadata?.full_name ||
            supabaseUser.email?.split('@')[0] ||
            'Learner',
          email: supabaseUser.email || '',
          xp: 0,
          level: 1,
          streak: 1,
          leafBalance: 5,
          isPremium: false,
          createdAt: serverTimestamp(),
          lastActive: serverTimestamp(),
        };
        await setDoc(userRef, newProfile);
        setProfile(newProfile);
      }
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
      const userRef = doc(db, 'users', user.id);
      const updatedProfile = {
        ...profile,
        xp: profile.xp + xpDelta,
        leafBalance: Math.max(0, profile.leafBalance + leafDelta),
        level: Math.floor((profile.xp + xpDelta) / 100) + 1,
        lastActive: serverTimestamp(),
      };
      await setDoc(
        userRef,
        {
          xp: updatedProfile.xp,
          leafBalance: updatedProfile.leafBalance,
          level: updatedProfile.level,
          lastActive: updatedProfile.lastActive,
        },
        { merge: true }
      );
      setProfile(updatedProfile);
    } catch (err) {
      console.error('Error updating stats:', err);
    }
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
        logout,
        updateProfileStats,
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
