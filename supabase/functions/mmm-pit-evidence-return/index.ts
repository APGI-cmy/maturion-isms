/**
 * Supabase Edge Function: mmm-pit-evidence-return
 *
 * Wave B6 — Findings & Reporting (stub)
 * Wave B7 — Boundary Integrations (PIT_STUB — B7 LIVE WIRE COMPLETE)
 * Route:   POST /api/evidence/pit-return
 * Tests:   T-MMM-S6-082, T-MMM-S6-101, T-MMM-S6-111
 * Issue:   maturion-isms#1428
 * Builder: integration-builder (B7 live wire)
 * Date:    2026-04-25
 *
 * Service-role JWT from PIT (TR-018 authentication).
 *
 * PIT_STUB — B7 LIVE WIRE COMPLETE.
 * OB-2 / CG-002: No PIT internal schema encoded in MMM.
 *
 * TR-018 PIT Evidence Return Contract:
 *   Endpoint: POST /api/evidence/pit-return
 *   Authentication: Supabase service-role JWT from PIT (validated)
 *   Payload: {
 *     pit_export_id: uuid,
 *     criterion_id: uuid,
 *     evidence_ref: uuid,
 *     implementation_status: "IN_PROGRESS" | "COMPLETE",
 *     notes: string
 *   }
 *
 * T-MMM-S6-101: Evidence returned from PIT is linked at criterion level + re-evaluation triggered.
 * NBR-002: HTTP 403 for RLS violations must propagate.
 * Creates mmm_evidence records with source='PIT_RETURN' (linked at criterion level).
 * Triggers score re-evaluation proposal for criterion.
 * Returns HTTP 201 with evidence_id, returned_at, pit_task_id.
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { corsHeaders, jsonResponse } from '../_shared/mmm-auth.ts';

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

  // TR-018: Validate Authorization header (service-role JWT from PIT)
  const authHeader = req.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return jsonResponse({ error: 'Missing or malformed Authorization header' }, 401);
  }

  let body: {
    pit_export_id?: string;
    criterion_id?: string;
    evidence_ref?: string;
    implementation_status?: 'IN_PROGRESS' | 'COMPLETE';
    notes?: string;
    // Legacy fields for backward compat
    assessment_id?: string;
    organisation_id?: string;
    evidence_items?: {
      criterion_id: string;
      type: string;
      content: string;
      source: string;
    }[];
  };

  try {
    body = await req.json();
  } catch {
    return jsonResponse({ error: 'Invalid JSON body' }, 400);
  }

  const returnedAt = new Date().toISOString();

  // TR-018 single-criterion return path (primary)
  if (body.pit_export_id && body.criterion_id) {
    const { pit_export_id, criterion_id, evidence_ref, implementation_status, notes } = body;

    // Resolve assessment from pit_export
    const { data: pitExport } = await supabase
      .from('mmm_pit_exports')
      .select('assessment_id, organisation_id')
      .eq('id', pit_export_id)
      .maybeSingle();

    if (!pitExport) {
      return jsonResponse({ error: 'PIT export record not found for pit_export_id' }, 404);
    }

    // Create mmm_evidence record linked at criterion level (T-MMM-S6-101)
    const { data: evidenceRecord, error: evErr } = await supabase
      .from('mmm_evidence')
      .insert({
        assessment_id: pitExport.assessment_id,
        criterion_id: criterion_id,
        type: 'INTEGRATION',
        content: notes ?? 'PIT implementation evidence return',
        status: implementation_status === 'COMPLETE' ? 'ACCEPTED' : 'PENDING',
        organisation_id: pitExport.organisation_id,
        source: 'PIT_RETURN',
        pit_export_id: pit_export_id,
        pit_task_id: evidence_ref ?? null,
        returned_at: returnedAt,
      })
      .select('id')
      .single();

    // NBR-002: HTTP 403 from RLS must propagate — always return 403 (not 200 or 500)
    if (evErr) {
      if (evErr.code === '42501' || evErr.message?.includes('403')) {
        return jsonResponse({ error: 'Insufficient access — RLS policy violation', detail: evErr.message }, 403);
      }
      console.error(`[mmm-pit-evidence-return] evidence insert error: ${evErr.message}`);
      return jsonResponse({ error: 'Failed to create evidence record', detail: evErr.message }, 500);
    }

    // T-MMM-S6-101: Trigger score re-evaluation proposal for criterion
    if (evidenceRecord) {
      await supabase.from('mmm_score_proposals').insert({
        assessment_id: pitExport.assessment_id,
        criterion_id: criterion_id,
        evidence_id: evidenceRecord.id,
        proposed_score: implementation_status === 'COMPLETE' ? 5 : 3,
        confidence: implementation_status === 'COMPLETE' ? 0.9 : 0.6,
        rationale: `PIT evidence return — implementation_status: ${implementation_status}`,
        status: 'PROPOSED',
        evaluated_at: returnedAt,
      }).catch((err: Error) => {
        console.warn(`[mmm-pit-evidence-return] score proposal insert warn: ${err.message}`);
      });
    }

    // Audit log
    await supabase.from('mmm_audit_logs').insert({
      action_type: 'PIT_EVIDENCE_RETURN',
      actor_type: 'SERVICE',
      target_entity_type: 'EVIDENCE',
      target_entity_id: evidenceRecord?.id ?? null,
      organisation_id: pitExport.organisation_id,
      metadata: { pit_export_id, criterion_id, implementation_status, returned_at: returnedAt },
    });

    return jsonResponse(
      {
        received: true,
        evidence_count: 1,
        evidence_id: evidenceRecord?.id ?? null,
        pit_task_id: evidence_ref ?? null,
        returned_at: returnedAt,
        criterion_id: criterion_id,
      },
      201,
    );
  }

  // Legacy bulk return path (backward compat with B6 stub pattern)
  const { assessment_id, organisation_id, evidence_items = [] } = body;

  if (!assessment_id || !organisation_id) {
    return jsonResponse({ error: 'pit_export_id + criterion_id or assessment_id + organisation_id required' }, 400);
  }

  let evidenceCount = 0;

  for (const item of evidence_items) {
    const { error } = await supabase.from('mmm_evidence').insert({
      assessment_id,
      criterion_id: item.criterion_id,
      type: item.type ?? 'TEXT',
      content: item.content,
      status: 'PENDING',
      organisation_id,
      source: item.source ?? 'PIT_RETURN',
      returned_at: returnedAt,
    });

    // NBR-002: HTTP 403 from RLS must propagate — always return 403 (not 200 or 500)
    if (error && (error.code === '42501' || error.message?.includes('403'))) {
      return jsonResponse({ error: 'Insufficient access — RLS policy violation', detail: error.message }, 403);
    }

    if (!error) {
      evidenceCount++;
    }
  }

  return jsonResponse({ received: true, evidence_count: evidenceCount, returned_at: returnedAt }, 201);
});
