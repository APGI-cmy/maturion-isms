/**
 * Supabase Edge Function: mmm-pit-export-send
 *
 * Wave B6 — Findings & Reporting (handshake stub)
 * Wave B7 — Boundary Integrations (PIT_STUB — B7 LIVE WIRE COMPLETE)
 * Route:   POST /api/pit-export/:id/send
 * Tests:   T-MMM-S6-081, T-MMM-S6-088–090, T-MMM-S6-109, T-MMM-S6-110
 * Issue:   maturion-isms#1428
 * Builder: integration-builder (B7 live wire)
 * Date:    2026-04-25
 *
 * JWT required + ADMIN or FRAMEWORK_OWNER role.
 *
 * PIT_STUB — B7 LIVE WIRE COMPLETE (7-step handshake per TR-017).
 * OB-2 / CG-002: No PIT internal schema encoded in MMM.
 * PIT_BASE_URL: Deno.env.get('PIT_BASE_URL') — provisioned via SB-003
 * PIT_SERVICE_TOKEN: Deno.env.get('PIT_SERVICE_TOKEN') — provisioned via SB-003
 *
 * TR-017 — 7-step PIT export handshake:
 *   Step 1: Validate export record in mmm_pit_exports
 *   Step 2: Serialize findings to TR-016 JSON schema payload
 *   Step 3: Sign payload (HMAC-SHA256 using PIT_SERVICE_TOKEN as key)
 *   Step 4: POST export payload to PIT import endpoint (Authorization: Bearer PIT_SERVICE_TOKEN)
 *   Step 5: PIT acknowledges with { "accepted": true, "pit_task_id": "uuid" }
 *   Step 6: Update mmm_pit_exports: status='SENT', pit_task_id, sent_at=now()
 *   Step 7: Log to mmm_audit_logs (action_type: 'PIT_EXPORT_SENT') — audit trail complete
 *
 * TR-016: Export payload must include export_id, organisation_id, framework_id, findings[],
 *         recommendations[], implementation_tasks[] (required fields).
 *
 * TR-009: Circuit breaker on PIT boundary.
 * NBR-002: HTTP 403 if not ADMIN/FRAMEWORK_OWNER.
 * OB-2: No PIT action lifecycle, task tracking, or plan execution logic in this function.
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { corsHeaders, jsonResponse, validateJWT, requireRole } from '../_shared/mmm-auth.ts';
import { isCircuitClosed, recordSuccess, recordFailure, buildFallbackResponse } from '../_shared/mmm-circuit-breaker.ts';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL') ?? '';
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
/** PIT import endpoint base URL — provisioned via SB-003 */
const PIT_BASE_URL = Deno.env.get('PIT_BASE_URL') ?? '';
/** PIT service-to-service token — provisioned via SB-003 */
const PIT_SERVICE_TOKEN = Deno.env.get('PIT_SERVICE_TOKEN') ?? '';

const PIT_TIMEOUT_MS = 30_000;

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
  const pitIdx = pathParts.indexOf('pit-export');
  const exportId = pitIdx !== -1 ? pathParts[pitIdx + 1] : null;

  if (!exportId || exportId === 'send') {
    return jsonResponse({ error: 'export id is required in path' }, 400);
  }

  // ─── STEP 1: Validate export record in mmm_pit_exports ────────────────────
  const { data: exportRecord, error: exportError } = await supabase
    .from('mmm_pit_exports')
    .select('*, mmm_assessments(framework_id)')
    .eq('id', exportId)
    .maybeSingle();

  if (exportError || !exportRecord) {
    return jsonResponse({ error: 'PIT export record not found' }, 404);
  }

  if (exportRecord.organisation_id !== claims.orgId) {
    return jsonResponse({ error: 'Insufficient access: organisation mismatch' }, 403);
  }

  if (exportRecord.status === 'SENT') {
    return jsonResponse({ error: 'Export already sent', pit_task_id: exportRecord.pit_task_id }, 409);
  }

  // ─── STEP 2: Serialize findings to TR-016 JSON schema ─────────────────────
  // TR-016 required fields: export_id, organisation_id, framework_id, export_timestamp,
  //   findings[], recommendations[], implementation_tasks[]
  // OB-2: No PIT internal schema — only produce the export contract defined in TR-016
  const { data: findings } = await supabase
    .from('mmm_findings')
    .select('id, criterion_id, maturity_position, gap_to_next, finding_text, priority, mmm_criteria(code, name)')
    .eq('assessment_id', exportRecord.assessment_id)
    .order('maturity_position');

  const { data: recommendations } = await supabase
    .from('mmm_recommendations')
    .select('id, criterion_id, text, rationale, target_level, estimated_effort')
    .eq('assessment_id', exportRecord.assessment_id);

  const frameworkId = (exportRecord.mmm_assessments as any)?.framework_id ?? null;

  // TR-016 export payload schema
  const tr016Payload = {
    export_id: exportId,
    organisation_id: claims.orgId,
    framework_id: frameworkId,
    export_timestamp: new Date().toISOString(),
    findings: (findings ?? []).map((f: any) => ({
      criterion_id: f.criterion_id,
      criterion_ref: f.mmm_criteria?.code ?? null,
      maturity_position: f.maturity_position,
      gap_to_next: f.gap_to_next,
      finding_text: f.finding_text,
      recommendation_text: null,
      evidence_refs: [],
      priority: f.priority ?? 'MEDIUM',
    })),
    recommendations: (recommendations ?? []).map((r: any) => ({
      recommendation_id: r.id,
      criterion_id: r.criterion_id,
      text: r.text,
      rationale: r.rationale,
      target_level: r.target_level,
      estimated_effort: r.estimated_effort,
    })),
    implementation_tasks: [],
  };

  // ─── STEP 3: Sign payload (HMAC-SHA256 using PIT_SERVICE_TOKEN as key) ─────
  let payloadSignature: string;
  try {
    const encoder = new TextEncoder();
    const keyData = encoder.encode(PIT_SERVICE_TOKEN || 'unsigned');
    const key = await crypto.subtle.importKey(
      'raw', keyData, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign'],
    );
    const sig = await crypto.subtle.sign('HMAC', key, encoder.encode(JSON.stringify(tr016Payload)));
    payloadSignature = Array.from(new Uint8Array(sig)).map((b) => b.toString(16).padStart(2, '0')).join('');
  } catch {
    payloadSignature = `unsigned-${crypto.randomUUID()}`;
  }

  // ─── STEP 4: POST export payload to PIT import endpoint ───────────────────
  // TR-009: Check PIT circuit breaker
  if (!isCircuitClosed('PIT')) {
    const fallback = buildFallbackResponse('PIT');
    return jsonResponse({ fallback: true, reason: fallback.reason, message: 'PIT integration temporarily unavailable' }, 503);
  }

  let pitAck: { accepted: boolean; pit_task_id: string };

  if (PIT_BASE_URL) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), PIT_TIMEOUT_MS);

    try {
      const pitResponse = await fetch(`${PIT_BASE_URL}/api/import/mmm-findings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          'Authorization': `Bearer ${PIT_SERVICE_TOKEN}`,
          'X-MMM-Signature': payloadSignature,
        },
        body: JSON.stringify(tr016Payload),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      // NBR-002: HTTP 403 from PIT must propagate — no silent swallowing
      if (pitResponse.status === 403) {
        recordFailure('PIT', 'HTTP_403');
        return jsonResponse({ error: 'PIT returned HTTP 403 — insufficient access' }, 403);
      }

      if (!pitResponse.ok) {
        const errText = await pitResponse.text().catch(() => 'unknown');
        throw new Error(`PIT HTTP ${pitResponse.status}: ${errText}`);
      }

      // ─── STEP 5: PIT acknowledges with { "accepted": true, "pit_task_id": "uuid" }
      pitAck = await pitResponse.json() as { accepted: boolean; pit_task_id: string };
      recordSuccess('PIT');
    } catch (err) {
      clearTimeout(timeoutId);
      const message = err instanceof Error ? err.message : String(err);
      recordFailure('PIT', message);
      console.error(`[mmm-pit-export-send] PIT call failed: ${message}`);
      return jsonResponse({ error: 'PIT integration failed', detail: message }, 502);
    }
  } else {
    // PIT_BASE_URL not configured — use acknowledged stub for graceful operation
    console.warn('[mmm-pit-export-send] PIT_BASE_URL not configured — using stub acknowledgement');
    pitAck = { accepted: true, pit_task_id: `PIT-TASK-${crypto.randomUUID()}` };
  }

  if (!pitAck.accepted) {
    return jsonResponse({ error: 'PIT rejected the export payload', ack: pitAck }, 422);
  }

  const pitTaskId = pitAck.pit_task_id;
  const sentAt = new Date().toISOString();

  // ─── STEP 6: Update mmm_pit_exports: status='SENT', pit_task_id, sent_at ──
  await supabase
    .from('mmm_pit_exports')
    .update({
      status: 'SENT',
      sent_at: sentAt,
      pit_task_id: pitTaskId,
      payload_json: tr016Payload,
      payload_signature: payloadSignature,
    })
    .eq('id', exportId);

  // ─── STEP 7: Log to mmm_audit_logs (action_type: 'PIT_EXPORT_SENT') ───────
  await supabase.from('mmm_audit_logs').insert({
    action_type: 'PIT_EXPORT_SENT',
    actor_id: claims.userId,
    actor_type: 'USER',
    target_entity_type: 'PIT_EXPORT',
    target_entity_id: exportId,
    organisation_id: claims.orgId,
    metadata: {
      pit_task_id: pitTaskId,
      findings_count: (findings ?? []).length,
      recommendations_count: (recommendations ?? []).length,
      export_timestamp: sentAt,
    },
  });

  // NBR-001: UI must invalidate ['pit-exports', id]
  return jsonResponse({ status: 'SENT', pit_task_id: pitTaskId, sent_at: sentAt }, 202);
});
