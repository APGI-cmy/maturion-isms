import { createClient } from '@supabase/supabase-js';
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL ?? '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY ?? '';
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function getEdgeInvokeHeaders(): Promise<Record<string, string>> {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.access_token) {
    throw new Error('Authentication required for MMM Edge Function call');
  }
  const headers: Record<string, string> = {
    Authorization: `Bearer ${session.access_token}`,
  };
  if (supabaseAnonKey) {
    headers.apikey = supabaseAnonKey;
  }
  return headers;
}
