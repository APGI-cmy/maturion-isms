/**
 * Supabase Edge Function: mmm-assessment-free-respond
 *
 * Wave B3 — Core UI: Onboarding
 * Route:   POST /api/assessment/free/respond
 * Tests:   T-MMM-S6-011, T-MMM-S6-018, T-MMM-S6-020
 * Issue:   maturion-isms#1428
 * Builder: ui-builder
 * Date:    2026-04-22
 *
 * No JWT required — public free assessment endpoint.
 *
 * Behaviour:
 *   - Receives { domain_responses: { domain_name, response: 'YES'|'NO'|'PARTIAL' }[] }
 *   - Saves to mmm_free_assessments with session_token = crypto.randomUUID()
 *   - Calculates baseline_maturity: average score (YES=1.0, PARTIAL=0.5, NO=0.0) * 5
 *   - Returns { session_token, baseline_result: { baseline_maturity, domain_scores } }
 *   - HTTP 400 for missing/invalid input
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { corsHeaders, jsonResponse } from '../_shared/mmm-auth.ts';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL') ?? '';
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';

const SCORE_MAP: Record<string, number> = {
  YES: 1.0,
  PARTIAL: 0.5,
  NO: 0.0,
};

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders() });
  }

  if (req.method !== 'POST') {
    return jsonResponse({ error: 'Method not allowed' }, 405);
  }

  let body: { domain_responses?: { domain_name: string; response: string }[] };
  try {
    body = await req.json();
  } catch {
    return jsonResponse({ error: 'Invalid JSON body' }, 400);
  }

  const { domain_responses } = body;

  if (!domain_responses || !Array.isArray(domain_responses) || domain_responses.length === 0) {
    return jsonResponse({ error: 'domain_responses is required and must be a non-empty array' }, 400);
  }

  // Validate each response
  for (const dr of domain_responses) {
    if (!dr.domain_name || !dr.response) {
      return jsonResponse({ error: 'Each domain_response must have domain_name and response' }, 400);
    }
    if (!['YES', 'NO', 'PARTIAL'].includes(dr.response)) {
      return jsonResponse({ error: `Invalid response value: ${dr.response}. Must be YES, NO, or PARTIAL` }, 400);
    }
  }

  // Calculate scores
  const domain_scores = domain_responses.map((dr) => ({
    domain_name: dr.domain_name,
    response: dr.response,
    score: SCORE_MAP[dr.response] ?? 0,
  }));

  const average = domain_scores.reduce((sum, ds) => sum + ds.score, 0) / domain_scores.length;
  const baseline_maturity = parseFloat((average * 5).toFixed(2));

  const session_token = crypto.randomUUID();

  const baseline_result = {
    baseline_maturity,
    domain_scores,
  };

  // Persist to mmm_free_assessments
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
