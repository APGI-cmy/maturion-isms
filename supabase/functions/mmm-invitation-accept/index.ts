/**
 * Supabase Edge Function: mmm-invitation-accept
 * Route: POST /api/invitations/accept — TR-035
 * No JWT required (token-based). verify_jwt = false in config.toml.
 * Validates token, sets accepted_at, creates/updates mmm_profiles.
 */
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { jsonResponse, corsHeaders } from '../_shared/mmm-auth.ts';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL') ?? '';
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
console.log(`[mmm-invitation-accept] SUPABASE_URL configured: ${SUPABASE_URL ? 'YES' : 'NO (MISSING)'}`);

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders() });
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
  try {
    const body = await req.json();
    const { token, email } = body ?? {};
    if (!token || !email) return jsonResponse({ error: 'token and email are required' }, 400);
    const { data: inv, error: fetchError } = await supabase
      .from('mmm_invitations').select('*').eq('token', token).maybeSingle();
    if (fetchError || !inv) return jsonResponse({ error: 'Invalid token' }, 400);
    if (inv.accepted_at) return jsonResponse({ error: 'Invitation already accepted' }, 400);
    if (new Date(inv.expires_at) < new Date()) return jsonResponse({ error: 'Invitation expired' }, 400);
    if (inv.email !== email) return jsonResponse({ error: 'Email does not match invitation' }, 400);
    await supabase.from('mmm_invitations').update({ accepted_at: new Date().toISOString() }).eq('id', inv.id);
    // Upsert profile — user will be created separately via Supabase Auth
    await supabase.from('mmm_profiles').upsert({
      email, organisation_id: inv.organisation_id, role: inv.role,
    }, { onConflict: 'email' });
    return jsonResponse({ success: true, organisation_id: inv.organisation_id, role: inv.role });
  } catch (e) {
    if (e instanceof Response) return e;
    return jsonResponse({ error: 'Internal server error' }, 500);
  }
});
