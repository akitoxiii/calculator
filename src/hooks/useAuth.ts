'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/utils/supabase';
import { logger } from '@/utils/logger';
import { User as SupabaseUser } from '@supabase/supabase-js';

export interface User {
  id: string;
  email: string | null;
}

function mapSupabaseUser(user: SupabaseUser | null): User | null {
  if (!user) return null;
  return {
    id: user.id,
    email: user.email || null,
  };
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkUser();
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN') {
        setUser(session?.user ? mapSupabaseUser(session.user) : null);
        router.push('/');
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        router.push('/sign-in');
      }
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [router]);

  async function checkUser() {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) {
        throw error;
      }
      setUser(session?.user ? mapSupabaseUser(session.user) : null);
    } catch (error) {
      logger.error('Error checking auth state:', error);
    } finally {
      setLoading(false);
    }
  }

  async function signIn(email: string, password: string) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      logger.error('Sign in error:', error);
      return { data: null, error };
    }
  }

  async function signOut() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      logger.error('Sign out error:', error);
    }
  }

  return {
    user,
    loading,
    signIn,
    signOut,
  };
} 