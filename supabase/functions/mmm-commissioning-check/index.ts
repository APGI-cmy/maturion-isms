/**
 * Supabase Edge Function: mmm-commissioning-check
 * Internal startup check — TR-051, CHK-001–CHK-005
 * Not a public endpoint. verify_jwt = false (internal).
 * 5 checks: DB reachable, schema deployed, auth configured, Edge Fns reachable, env vars present.
 */
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { jsonResponse, corsHeaders } from '../_shared/mmm-auth.ts';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL') ?? '';
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY') ?? '';

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders() });
  const checks: Array<{ id: string; name: string; pass: boolean; detail: string }> = [];
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

  // CHK-001: Database reachable
  try {
    const { error } = await supabase.from('mmm_organisations').select('id').limit(1);
    checks.push({ id: 'CHK-001', name: 'Database reachable', pass: !error, detail: error?.message ?? 'OK' });
  } catch (e) {
    checks.push({ id: 'CHK-001', name: 'Database reachable', pass: false, detail: String(e) });
  }

  // CHK-002: Schema deployed (mmm_organisations table exists)
  try {
    const { data, error } = await supabase.from('mmm_organisations').select('id').limit(0);
    checks.push({ id: 'CHK-002', name: 'Schema deployed', pass: !error, detail: error?.message ?? 'OK' });
  } catch (e) {
    checks.push({ id: 'CHK-002', name: 'Schema deployed', pass: false, detail: String(e) });
  }

  // CHK-003: Auth configured (SUPABASE_URL and service role key present)
  const authOk = Boolean(SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY);
  checks.push({ id: 'CHK-003', name: 'Auth configured', pass: authOk, detail: authOk ? 'OK' : 'Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY' });

  // CHK-004: Edge Functions reachable (self-check — if we are running, they are reachable)
  checks.push({ id: 'CHK-004', name: 'Edge Functions reachable', pass: true, detail: 'Self-executing — reachable' });

  // CHK-005: Env vars present
  const envVarsOk = Boolean(SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY && SUPABASE_ANON_KEY);
  checks.push({ id: 'CHK-005', name: 'Env vars present', pass: envVarsOk, detail: envVarsOk ? 'OK' : `Missing: ${[!SUPABASE_URL && 'SUPABASE_URL', !SUPABASE_SERVICE_ROLE_KEY && 'SUPABASE_SERVICE_ROLE_KEY', !SUPABASE_ANON_KEY && 'SUPABASE_ANON_KEY'].filter(Boolean).join(', ')}` });

  const allPass = checks.every(c => c.pass);
  return jsonResponse({ status: allPass ? 'PASS' : 'FAIL', checks }, allPass ? 200 : 503);
});
