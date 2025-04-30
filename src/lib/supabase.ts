import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      assets: {
        Row: {
          id: string;
          created_at: string;
          type: '振替' | '貯金' | '支払い' | '収入';
          amount: number;
          payment_method: string | null;
          note: string | null;
          user_id: string;
        };
        Insert: {
          id?: string;
          created_at?: string;
          type: '振替' | '貯金' | '支払い' | '収入';
          amount: number;
          payment_method?: string | null;
          note?: string | null;
          user_id: string;
        };
        Update: {
          id?: string;
          created_at?: string;
          type?: '振替' | '貯金' | '支払い' | '収入';
          amount?: number;
          payment_method?: string | null;
          note?: string | null;
          user_id?: string;
        };
      };
    };
  };
}; 