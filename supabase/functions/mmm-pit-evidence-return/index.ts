/**
 * Supabase Edge Function: mmm-pit-evidence-return
 *
 * Wave B6 — Findings & Reporting
 * Route:   POST /api/evidence/pit-return
 * Tests:   T-MMM-S6-082
 * Issue:   maturion-isms#1428
 * Builder: ui-builder
 * Date:    2026-04-22
 *
 * Service role — receives PIT evidence return payload.
 *
 * Stub for B6 (live in B7).
 *
 * Behaviour:
 *   - Receives PIT evidence return payload
 *   - Creates mmm_evidence records from payload
 *   - Return: { received: true, evidence_count: N }
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

  let body: {
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

  const { assessment_id, organisation_id, evidence_items = [] } = body;

  if (!assessment_id || !organisation_id) {
    return jsonResponse({ error: 'assessment_id and organisation_id are required' }, 400);
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
    });

    if (!error) {
      evidenceCount++;
    }
  }

  return jsonResponse({ received: true, evidence_count: evidenceCount });
});
