/**
 * Supabase Edge Function: mmm-invitation-create
 * Route: POST /api/invitations — J-16, TR-035
 * JWT required + ADMIN role.
 * NBR-002: Returns HTTP 403 (not 500) when caller is not ADMIN — hard checkpoint.
 * NBR-001: B3 UI must invalidate ['organisations'] query cache after this mutation
 */
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { validateJWT, requireRole, jsonResponse, corsHeaders } from '../_shared/mmm-auth.ts';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL') ?? '';
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
console.log(`[mmm-invitation-create] SUPABASE_URL configured: ${SUPABASE_URL ? 'YES' : 'NO (MISSING)'}`);

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders() });
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
  try {
    const claims = await validateJWT(req, supabase);
    // NBR-002: ADMIN-only enforcement — MUST return 403 (not 500, not silent failure)
    requireRole(claims.role, ['ADMIN']);
    const body = await req.json();
    const { email, role, organisation_id } = body ?? {};
    if (!email || !role || !organisation_id) {
      return jsonResponse({ error: 'email, role, and organisation_id are required' }, 400);
    }
    // Verify caller is ADMIN of the target org
    if (claims.orgId !== organisation_id) {
      // NBR-002: explicit 403
      return jsonResponse({ error: 'Forbidden: you are not ADMIN of the target organisation' }, 403);
    }
    const token = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
    const { data: invitation, error: insertError } = await supabase
      .from('mmm_invitations').insert({
        email, role, organisation_id, token,
        expires_at: expiresAt, created_by: claims.userId,
      }).select().maybeSingle();
    if (insertError) return jsonResponse({ error: insertError.message }, 500);
    // NBR-001: B3 UI must invalidate ['organisations'] query cache after this mutation
    return jsonResponse({
      invitation_id: invitation.id,
      token: invitation.token,
      expires_at: invitation.expires_at,
    }, 201);
  } catch (e) {
    if (e instanceof Response) return e;
    return jsonResponse({ error: 'Internal server error' }, 500);
  }
});
