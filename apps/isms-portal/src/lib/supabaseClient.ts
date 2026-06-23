import { createClient, type SupabaseClient } from '@supabase/supabase-js';

export interface IsmsSupabaseConfig {
  url: string;
  anonKey: string;
}

let cachedClient: SupabaseClient | null | undefined;

export function readIsmsSupabaseConfig(): IsmsSupabaseConfig | null {
  const url = import.meta.env.VITE_SUPABASE_URL;
  const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  if (!url || !anonKey) return null;

  return { url, anonKey };
}

export function getIsmsSupabaseClient(): SupabaseClient | null {
  if (cachedClient !== undefined) return cachedClient;

  const config = readIsmsSupabaseConfig();
  if (!config) {
    cachedClient = null;
    return cachedClient;
  }

  cachedClient = createClient(config.url, config.anonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  });

  return cachedClient;
}
