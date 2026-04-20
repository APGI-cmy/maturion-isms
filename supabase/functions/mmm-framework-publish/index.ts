/**
 * Supabase Edge Function: mmm-framework-publish
 *
 * Wave B4 — Framework Lifecycle
 * Route:   POST /api/frameworks/:id/publish
 * Tests:   T-MMM-S6-022, T-MMM-S6-031, T-MMM-S6-032, T-MMM-S6-033
 * Issue:   maturion-isms#1428
 * Builder: ui-builder
 * Date:    2026-04-22
 *
 * JWT required + ADMIN role.
 *
 * Behaviour:
 *   - Validates framework is in REVIEW status
 *   - Sets status = 'PUBLISHED'
 *   - Increments version
 *   - Logs to mmm_audit_logs (action_type: 'FRAMEWORK_PUBLISH')
 *   - NBR-002: HTTP 403 if not ADMIN
 *   - NBR-001: UI must invalidate ['frameworks'] and ['frameworks', id]
 *   - Return: { framework }
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { corsHeaders, jsonResponse, validateJWT, requireRole } from '../_shared/mmm-auth.ts';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL') ?? '';
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders() });
  }

  if (req.method !== 'POST') {
    return jsonResponse({ error: 'Method not allowed' }, 405);
  }

  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    return jsonResponse({ error: 'Service configuration error' }, 500);
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

  let claims: { userId: string; orgId: string; role: string };
  try {
    claims = await validateJWT(req, supabase);
  } catch (response) {
    return response as Response;
  }

  // NBR-002: HTTP 403 if not ADMIN
  try {
    requireRole(claims.role, ['ADMIN']);
  } catch (response) {
    return response as Response;
  }

  // Extract framework id from URL path
  const url = new URL(req.url);
  const pathParts = url.pathname.split('/');
  const frameworkId = pathParts[pathParts.indexOf('frameworks') + 1] ?? pathParts[pathParts.length - 2];

  if (!frameworkId || frameworkId === 'publish') {
    return jsonResponse({ error: 'framework id is required in path' }, 400);
  }

  // Fetch current framework state
  const { data: framework, error: fetchError } = await supabase
    .from('mmm_frameworks')
    .select('*')
    .eq('id', frameworkId)
    .single();

  if (fetchError || !framework) {
    return jsonResponse({ error: 'Framework not found' }, 404);
  }

  // Validate REVIEW status before publishing
  if (framework.status !== 'REVIEW') {
    return jsonResponse({
      error: `Framework must be in REVIEW status to publish. Current status: ${framework.status}`,
    }, 400);
  }

  const newVersion = (framework.version ?? 0) + 1;

  // Set status = 'PUBLISHED' and increment version
  const { data: updatedFramework, error: updateError } = await supabase
    .from('mmm_frameworks')
    .update({
      status: 'PUBLISHED',
      version: newVersion,
      published_at: new Date().toISOString(),
    })
    .eq('id', frameworkId)
    .select()
    .single();

  if (updateError || !updatedFramework) {
    console.error('[mmm-framework-publish] update error:', updateError?.message);
    return jsonResponse({ error: 'Failed to publish framework' }, 500);
  }

  // Log to mmm_audit_logs (action_type: 'FRAMEWORK_PUBLISH')
  await supabase.from('mmm_audit_logs').insert({
    action_type: 'FRAMEWORK_PUBLISH',
    actor_id: claims.userId,
    actor_type: 'USER',
    target_entity_type: 'FRAMEWORK',
    target_entity_id: frameworkId,
    organisation_id: claims.orgId,
    metadata: { version: newVersion, framework_name: framework.name },
  });

  // NBR-001: UI must invalidate ['frameworks'] and ['frameworks', id]
  return jsonResponse({ framework: updatedFramework });
});
