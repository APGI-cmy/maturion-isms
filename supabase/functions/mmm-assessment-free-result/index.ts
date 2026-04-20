/**
 * Supabase Edge Function: mmm-assessment-free-result
 *
 * Wave B3 — Core UI: Onboarding
 * Route:   GET /api/assessment/free/result?token=xxx
 * Tests:   T-MMM-S6-012
 * Issue:   maturion-isms#1428
 * Builder: ui-builder
 * Date:    2026-04-22
 *
 * No JWT required — public free assessment result retrieval.
 *
 * Behaviour:
 *   - Query mmm_free_assessments WHERE session_token = ?
 *   - Return baseline_result or HTTP 404
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { corsHeaders, jsonResponse } from '../_shared/mmm-auth.ts';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL') ?? '';
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders() });
  }

  if (req.method !== 'GET') {
    return jsonResponse({ error: 'Method not allowed' }, 405);
  }

  const url = new URL(req.url);
  const token = url.searchParams.get('token');

  if (!token) {
    return jsonResponse({ error: 'token query parameter is required' }, 400);
  }

  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    return jsonResponse({ error: 'Service configuration error' }, 500);
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

  const { data, error } = await supabase
    .from('mmm_free_assessments')
    .select('session_token, baseline_result, created_at')
    .eq('session_token', token)
    .maybeSingle();

  if (error) {
    console.error('[mmm-assessment-free-result] DB query error:', error.message);
    return jsonResponse({ error: 'Failed to retrieve assessment' }, 500);
  }

  if (!data) {
    return jsonResponse({ error: 'Assessment not found' }, 404);
  }

  return jsonResponse({
    session_token: data.session_token,
    baseline_result: data.baseline_result,
    created_at: data.created_at,
  });
});
