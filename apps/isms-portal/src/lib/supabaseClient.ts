export interface IsmsSupabaseConfig {
  url: string;
  anonKey: string;
}

export interface IsmsSupabaseRuntime {
  config: IsmsSupabaseConfig;
  userId: string;
}

export interface IsmsSupabaseWriteResult {
  error: { message?: string } | null;
}

export function readIsmsSupabaseConfig(): IsmsSupabaseConfig | null {
  const url = import.meta.env.VITE_SUPABASE_URL;
  const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  if (!url || !anonKey) return null;

  return { url, anonKey };
}

export function getIsmsSupabaseRuntime(): IsmsSupabaseRuntime | null {
  readIsmsSupabaseConfig();

  // P2 deliberately does not parse browser auth storage or introduce a live
  // Supabase auth adapter. Runtime writes stay disabled until production auth
  // hardening appoints the authenticated Supabase session boundary.
  return null;
}

export async function insertIsmsSupabaseRecord(
  _runtime: IsmsSupabaseRuntime,
  _tableName: string,
  _record: Record<string, unknown>,
): Promise<IsmsSupabaseWriteResult> {
  return {
    error: {
      message: 'Supabase runtime write adapter is not appointed in P2.',
    },
  };
}
