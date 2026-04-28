/**
 * Supabase Edge Function: mmm-assessment-free-respond
 *
 * Wave B3 — Core UI: Onboarding (updated for MPS-level questionnaire)
 * Route:   POST /api/assessment/free/respond
 * Tests:   T-MMM-S6-011, T-MMM-S6-018, T-MMM-S6-020
 * Issue:   maturion-isms#1428, maturion-isms#1503
 * Builder: ui-builder
 * Date:    2026-04-28
 *
 * No JWT required — public free assessment endpoint.
 *
 * Behaviour (v2 — MPS-level):
 *   - Receives { assessment_version, responses: { domain_id, mps_id, question_id, response: 'A'|'B'|'C' }[] }
 *   - Scores: A=0.0 (reactive), B=0.5 (developing), C=1.0 (systematic)
 *   - Computes per-question, per-MPS, per-domain, and overall baseline scores (0–5 scale)
 *   - Saves to mmm_free_assessments with session_token = crypto.randomUUID()
 *   - Returns { session_token, baseline_result: { baseline_maturity, domain_scores, mps_scores } }
 *   - HTTP 400 for missing/invalid input
 *
 * AIMC/KUC note: generic-mps-baseline-v1 question bank is shipped as a static interim
 * implementation. Follow-up required to ingest through the governed KUC path.
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { corsHeaders, jsonResponse } from '../_shared/mmm-auth.ts';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL') ?? '';
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';

// Scoring: A=0.0 (reactive/absent), B=0.5 (developing/partial), C=1.0 (systematic/embedded)
const CHOICE_SCORE_MAP: Record<string, number> = {
  A: 0.0,
  B: 0.5,
  C: 1.0,
};

// YES/NO/PARTIAL kept for backward-compatibility in scoring lookups
const LEGACY_SCORE_MAP: Record<string, number> = {
  YES: 1.0,
  PARTIAL: 0.5,
  NO: 0.0,
};

interface AssessmentResponse {
  domain_id: string;
  mps_id: string;
  question_id: string;
  response: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders() });
  }

  if (req.method !== 'POST') {
    return jsonResponse({ error: 'Method not allowed' }, 405);
  }

  let body: {
    assessment_version?: string;
    responses?: AssessmentResponse[];
    // legacy flat format kept for graceful degradation
    domain_responses?: { domain_name: string; response: string }[];
  };

  try {
    body = await req.json();
  } catch {
    return jsonResponse({ error: 'Invalid JSON body' }, 400);
  }

  // ── MPS-level structured path (primary) ────────────────────────────────────
  if (body.responses && Array.isArray(body.responses)) {
    const { assessment_version = 'generic-mps-baseline-v1', responses } = body;

    if (responses.length === 0) {
      return jsonResponse({ error: 'responses must be a non-empty array' }, 400);
    }

    for (const r of responses) {
      if (!r.domain_id || !r.mps_id || !r.question_id || !r.response) {
        return jsonResponse(
          { error: 'Each response must have domain_id, mps_id, question_id, and response' },
          400,
        );
      }
      if (CHOICE_SCORE_MAP[r.response] === undefined) {
        return jsonResponse(
          { error: `Invalid response value: ${r.response}. Must be A, B, or C` },
          400,
        );
      }
    }

    // Score each response
    const scored = responses.map((r) => ({
      ...r,
      score: CHOICE_SCORE_MAP[r.response],
    }));

    // Aggregate per MPS (one question per MPS in v1)
    const mpsByKey: Record<string, { domain_id: string; mps_id: string; scores: number[] }> = {};
    for (const s of scored) {
      const key = `${s.domain_id}__${s.mps_id}`;
      if (!mpsByKey[key]) {
        mpsByKey[key] = { domain_id: s.domain_id, mps_id: s.mps_id, scores: [] };
      }
      mpsByKey[key].scores.push(s.score);
    }
    const mps_scores = Object.values(mpsByKey).map((m) => ({
      domain_id: m.domain_id,
      mps_id: m.mps_id,
      score: parseFloat(
        (m.scores.reduce((a, b) => a + b, 0) / m.scores.length).toFixed(2),
      ),
    }));

    // Aggregate per domain: average MPS scores × 5 for 0–5 scale
    const domainMap: Record<string, number[]> = {};
    for (const m of mps_scores) {
      if (!domainMap[m.domain_id]) domainMap[m.domain_id] = [];
      domainMap[m.domain_id].push(m.score);
    }
    const domain_scores = Object.entries(domainMap).map(([domain_id, scores]) => ({
      domain_id,
      score: parseFloat(
        ((scores.reduce((a, b) => a + b, 0) / scores.length) * 5).toFixed(2),
      ),
    }));

    // Overall baseline: average of domain scores (each already on 0–5 scale)
    const baseline_maturity = parseFloat(
      (
        domain_scores.reduce((a, b) => a + b.score, 0) / domain_scores.length
      ).toFixed(2),
    );

    const session_token = crypto.randomUUID();
    const baseline_result = { baseline_maturity, domain_scores, mps_scores };

    if (SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY) {
      const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
      const { error } = await supabase.from('mmm_free_assessments').insert({
        session_token,
        responses: { assessment_version, responses },
        baseline_result,
      });
      if (error) {
        console.error('[mmm-assessment-free-respond] DB insert error:', error.message);
        return jsonResponse({ error: 'Failed to save assessment' }, 500);
      }
    }

    return jsonResponse({ session_token, baseline_result });
  }

  // ── Legacy domain_responses path (backward-compat) ─────────────────────────
  const { domain_responses } = body;

  if (!domain_responses || !Array.isArray(domain_responses) || domain_responses.length === 0) {
    return jsonResponse(
      { error: 'Either responses (MPS-level) or domain_responses (legacy) is required' },
      400,
    );
  }

  for (const dr of domain_responses) {
    if (!dr.domain_name || !dr.response) {
      return jsonResponse(
        { error: 'Each domain_response must have domain_name and response' },
        400,
      );
    }
    if (!['YES', 'NO', 'PARTIAL'].includes(dr.response)) {
      return jsonResponse(
        { error: `Invalid response value: ${dr.response}. Must be YES, NO, or PARTIAL` },
        400,
      );
    }
  }

  const domain_scores_legacy = domain_responses.map((dr) => ({
    domain_name: dr.domain_name,
    response: dr.response,
    score: LEGACY_SCORE_MAP[dr.response] ?? 0,
  }));

  const average = domain_scores_legacy.reduce((sum, ds) => sum + ds.score, 0) / domain_scores_legacy.length;
  const baseline_maturity = parseFloat((average * 5).toFixed(2));

  const session_token = crypto.randomUUID();
  const baseline_result = {
    baseline_maturity,
    domain_scores: domain_scores_legacy,
  };

  if (SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY) {
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    const { error } = await supabase.from('mmm_free_assessments').insert({
      session_token,
      domain_responses,
      baseline_result,
    });
    if (error) {
      console.error('[mmm-assessment-free-respond] DB insert error:', error.message);
      return jsonResponse({ error: 'Failed to save assessment' }, 500);
    }
  }

  return jsonResponse({ session_token, baseline_result });
});
