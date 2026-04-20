/**
 * Supabase Edge Function: mmm-pit-export-send
 *
 * Wave B6 — Findings & Reporting
 * Route:   POST /api/pit-export/:id/send
 * Tests:   T-MMM-S6-081, T-MMM-S6-088, T-MMM-S6-089, T-MMM-S6-090
 * Issue:   maturion-isms#1428
 * Builder: ui-builder
 * Date:    2026-04-22
 *
 * JWT required + ADMIN or FRAMEWORK_OWNER role.
 *
 * 7-step handshake stub (B6; live PIT wire in B7).
 *
 * Behaviour:
 *   Step 1: Validate export record in mmm_pit_exports
 *   Step 2: Serialize findings to TR-016 payload format
 *   Step 3: Sign payload (stub)
 *   Step 4: POST to stub PIT endpoint (return mock ack)
 *   Step 5: Record pit_task_id
 *   Step 6: Set status='SENT', sent_at=now()
 *   Step 7: Log to mmm_audit_logs (action_type: 'PIT_EXPORT_SENT')
 *   - NBR-002: HTTP 403 if not ADMIN/FRAMEWORK_OWNER
 *   - NBR-001: UI must invalidate ['pit-exports', id]
 *   - Return: { status: 'SENT', pit_task_id, sent_at }
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { corsHeaders, jsonResponse, validateJWT, requireRole } from '../_shared/mmm-auth.ts';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL') ?? '';
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
// PIT_BASE_URL: will be wired to Deno.env.get('PIT_BASE_URL') in B7 (SB-003 credential gate)

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

  // NBR-002: HTTP 403 if not ADMIN/FRAMEWORK_OWNER
  try {
    requireRole(claims.role, ['ADMIN', 'FRAMEWORK_OWNER']);
  } catch (response) {
    return response as Response;
  }

  // Extract export id from URL path
  const url = new URL(req.url);
  const pathParts = url.pathname.split('/');
  const exportId = pathParts[pathParts.indexOf('pit-export') + 1] ?? pathParts[pathParts.length - 2];

  if (!exportId || exportId === 'send') {
    return jsonResponse({ error: 'export id is required in path' }, 400);
  }

  // Step 1: Validate export record in mmm_pit_exports
  const { data: exportRecord, error: exportError } = await supabase
    .from('mmm_pit_exports')
    .select('*')
    .eq('id', exportId)
    .maybeSingle();

  if (exportError || !exportRecord) {
    return jsonResponse({ error: 'PIT export record not found' }, 404);
  }

  if (exportRecord.organisation_id !== claims.orgId) {
    return jsonResponse({ error: 'Insufficient access: organisation mismatch' }, 403);
  }

  // Step 2: Serialize findings to TR-016 payload format
  const { data: findings } = await supabase
    .from('mmm_findings')
    .select('*, mmm_criteria(name, code)')
    .eq('assessment_id', exportRecord.assessment_id)
    .order('maturity_position');

  const tr016Payload = {
    export_id: exportId,
    organisation_id: claims.orgId,
    assessment_id: exportRecord.assessment_id,
    findings: (findings ?? []).map((f: any) => ({
      criterion_code: f.mmm_criteria?.code,
      criterion_name: f.mmm_criteria?.name,
      maturity_position: f.maturity_position,
      gap_to_next: f.gap_to_next,
      finding_text: f.finding_text,
    })),
    generated_at: new Date().toISOString(),
  };

  // Step 3: Sign payload (stub — cryptographic signing in B7)
  const stubSignature = `stub-sig-${crypto.randomUUID()}`;

  // Step 4: POST to stub PIT endpoint (mock ack)
  const mockPitAck = { ack: true, pit_task_id: `PIT-TASK-${crypto.randomUUID()}` };

  // Step 5: Record pit_task_id
  const pitTaskId = mockPitAck.pit_task_id;
  const sentAt = new Date().toISOString();

  // Step 6: Set status='SENT', sent_at=now()
  await supabase
    .from('mmm_pit_exports')
    .update({
      status: 'SENT',
      sent_at: sentAt,
      pit_task_id: pitTaskId,
      payload_signature: stubSignature,
    })
    .eq('id', exportId);

  // Step 7: Log to mmm_audit_logs (action_type: 'PIT_EXPORT_SENT')
  await supabase.from('mmm_audit_logs').insert({
    action_type: 'PIT_EXPORT_SENT',
    actor_id: claims.userId,
    actor_type: 'USER',
    target_entity_type: 'PIT_EXPORT',
    target_entity_id: exportId,
    organisation_id: claims.orgId,
    metadata: { pit_task_id: pitTaskId, findings_count: (findings ?? []).length },
  });

  // NBR-001: UI must invalidate ['pit-exports', id]
  return jsonResponse({ status: 'SENT', pit_task_id: pitTaskId, sent_at: sentAt });
});
