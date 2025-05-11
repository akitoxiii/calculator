import { createClient } from '@supabase/supabase-js';
import { useAuth } from '@clerk/nextjs';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

console.log('Supabase Configuration:', {
  url: supabaseUrl,
  hasAnonKey: !!supabaseAnonKey
});

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing environment variables for Supabase');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    flowType: 'pkce',
    storage: typeof window !== 'undefined' ? window.localStorage : undefined,
    storageKey: 'supabase.auth.token',
    debug: process.env.NODE_ENV === 'development'
  },
  db: {
    schema: 'public'
  },
  global: {
    headers: {
      'X-Client-Info': 'calculator-app'
    }
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
});

// ClerkのJWTを使ってSupabaseのセッションを更新する関数
export const updateSupabaseSession = async (jwt: string) => {
  try {
    // JWTをデコードして必要な情報を抽出
    const [header, payload, signature] = jwt.split('.');
    const decodedPayload = JSON.parse(atob(payload));
    
    // Supabaseのセッションを更新
    const { data, error } = await supabase.auth.setSession({
      access_token: jwt,
      refresh_token: jwt,
    });

    if (error) {
      console.error('Error updating Supabase session:', error);
      throw error;
    }

    // ユーザーメタデータを更新
    if (decodedPayload.user_metadata) {
      await supabase.auth.updateUser({
        data: {
          user_metadata: decodedPayload.user_metadata,
          user_id: decodedPayload.customSubject // customSubjectをuser_idとして使用
        }
      });
    }

    return data;
  } catch (error) {
    console.error('Error in updateSupabaseSession:', error);
    throw error;
  }
}; 