'use client';

import { useEffect } from 'react';
import { useAuth } from '@clerk/nextjs';
import { updateSupabaseSession } from '@/utils/supabase';

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { getToken } = useAuth();

  useEffect(() => {
    const syncAuth = async () => {
      try {
        const token = await getToken();
        if (token) {
          await updateSupabaseSession(token);
        }
      } catch (error) {
        console.error('Error syncing auth:', error);
      }
    };

    syncAuth();
  }, [getToken]);

  return <>{children}</>;
}; 