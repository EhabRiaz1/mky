import { createClient, type SupabaseClient } from '@supabase/supabase-js';

let cached: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient | null {
  if (cached) return cached;
  const url = (import.meta as any).env.PUBLIC_SUPABASE_URL || (import.meta as any).env.VITE_SUPABASE_URL;
  const anon = (import.meta as any).env.PUBLIC_SUPABASE_ANON_KEY || (import.meta as any).env.VITE_SUPABASE_ANON_KEY;
  if (!url || !anon) return null;
  cached = createClient(url as string, anon as string);
  return cached;
}



