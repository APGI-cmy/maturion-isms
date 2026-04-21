/**
 * Supabase Edge Function: mmm-org-update
 * Route: PUT /api/organisations/:id — FR-060
 * JWT required + ADMIN role. Logs to mmm_audit_logs (action_type: 'ORG_UPDATE').
 * NBR-001: B3 UI must invalidate ['organisations'] query cache after this mutation
 */
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { validateJWT, requireRole, jsonResponse, corsHeaders } from '../_shared/mmm-auth.ts';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL') ?? '';
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
console.log(`[mmm-org-update] SUPABASE_URL configured: ${SUPABASE_URL ? 'YES' : 'NO (MISSING)'}`);

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders() });
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
  try {
    const claims = await validateJWT(req, supabase);
    // NBR-002: ADMIN-only — returns 403 (not 500) if not ADMIN
    requireRole(claims.role, ['ADMIN']);
    // Extract org id from URL: /functions/v1/mmm-org-update/<id>
    const url = new URL(req.url);
    const pathParts = url.pathname.split('/').filter(Boolean);
    const orgId = pathParts[pathParts.length - 1];
    if (!orgId || orgId === 'mmm-org-update') {
      return jsonResponse({ error: 'Missing organisation id in path' }, 400);
    }
    // Verify caller belongs to this org
    if (claims.orgId !== orgId) {
      return jsonResponse({ error: 'Forbidden: you do not belong to this organisation' }, 403);
    }
    const body = await req.json();
    const allowed = ['name', 'tier', 'evidence_freshness_days', 'subscription_status'];
    const updates: Record<string, unknown> = {};
    for (const k of allowed) { if (k in body) updates[k] = body[k]; }
    if (Object.keys(updates).length === 0) return jsonResponse({ error: 'No valid fields to update' }, 400);
    const { data: org, error: updateError } = await supabase
      .from('mmm_organisations').update(updates).eq('id', orgId).select().maybeSingle();
    if (updateError) return jsonResponse({ error: updateError.message }, 500);
    // NBR-001: B3 UI must invalidate ['organisations'] query cache after this mutation
    await supabase.from('mmm_audit_logs').insert({
      action_type: 'ORG_UPDATE', actor_id: claims.userId, actor_type: 'USER',
      target_entity_type: 'ORGANISATION', target_entity_id: orgId, metadata: { updates },
    });
    return jsonResponse(org);
  } catch (e) {
    if (e instanceof Response) return e;
    return jsonResponse({ error: 'Internal server error' }, 500);
  }
});
