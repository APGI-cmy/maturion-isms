/**
 * Supabase Edge Function: mmm-qiw-status
 *
 * Wave B7 — Boundary Integrations (AI telemetry metrics added)
 * Route: GET /api/qiw/status — TR-060, TR-065
 * Tests: T-MMM-S6-126, T-MMM-S6-128
 * Issue: maturion-isms#1428
 * Builder: integration-builder (B7 — AI telemetry dashboard)
 * Date: 2026-04-25
 *
 * JWT required; ADMIN or LEAD_AUDITOR role only
 *
 * T-MMM-S6-126: AI Telemetry Dashboard Displays All Five Metrics:
 *   1. token_usage (from mmm_ai_interactions)
 *   2. latency (avg AI call latency)
 *   3. cost (estimated cost from token usage)
 *   4. error_rate (failed interactions / total)
 *   5. interaction_volume (seven_day_trend + total count)
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { validateJWT, requireRole, jsonResponse, corsHeaders } from '../_shared/mmm-auth.ts';
import { getCircuitBreakerStatus } from '../_shared/mmm-circuit-breaker.ts';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL') ?? '';
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders() });

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

  try {
    const claims = await validateJWT(req, supabase);
    requireRole(claims.role, ['ADMIN', 'LEAD_AUDITOR']);

    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();

    // Fetch pipeline and assessment data (existing pipeline_stages logic)
    const [jobsRes, assessRes, evidRes, aiInteractionsRes] = await Promise.all([
      supabase.from('mmm_parse_jobs').select('status', { count: 'exact', head: false }),
      supabase.from('mmm_assessments').select('status, created_at', { count: 'exact', head: false }).gte('created_at', sevenDaysAgo),
      supabase.from('mmm_evidence').select('id', { count: 'exact', head: false }).gte('created_at', sevenDaysAgo),
      // T-MMM-S6-126: AI Interaction telemetry for the 5 metrics
      supabase
        .from('mmm_ai_interactions')
        .select('interaction_type, model_id, confidence, latency_ms, token_count, estimated_cost_usd, error_code, created_at')
        .gte('created_at', sevenDaysAgo),
    ]);

    const jobs: Array<{ status: string }> = jobsRes.data ?? [];
    const assessments: Array<{ status: string }> = assessRes.data ?? [];
    const aiInteractions: Array<{
      interaction_type: string;
      model_id: string | null;
      confidence: number | null;
      latency_ms: number | null;
      token_count: number | null;
      estimated_cost_usd: number | null;
      error_code: string | null;
      created_at: string;
    }> = aiInteractionsRes.data ?? [];

    const countByStatus = (arr: Array<{ status: string }>, s: string) => arr.filter(r => r.status === s).length;
    const jobStatus = (s: string): 'ACTIVE' | 'IDLE' | 'ERROR' =>
      countByStatus(jobs, s) > 0 ? 'ACTIVE' : (jobs.some(j => j.status === 'ERROR') ? 'ERROR' : 'IDLE');

    // ── T-MMM-S6-126: Five AI Telemetry Metrics ──────────────────────────────

    // Metric 1: token_usage — total tokens consumed in 7-day window
    const token_usage = {
      total: aiInteractions.reduce((sum, i) => sum + (i.token_count ?? 0), 0),
      by_operation_type: aiInteractions.reduce((acc, i) => {
        acc[i.interaction_type] = (acc[i.interaction_type] ?? 0) + (i.token_count ?? 0);
        return acc;
      }, {} as Record<string, number>),
    };

    // Metric 2: latency — average and p95 AI call latency (ms)
    const latencyValues = aiInteractions
      .map(i => i.latency_ms)
      .filter((v): v is number => typeof v === 'number' && v > 0)
      .sort((a, b) => a - b);

    const latency = {
      avg_ms: latencyValues.length > 0
        ? Math.round(latencyValues.reduce((s, v) => s + v, 0) / latencyValues.length)
        : null,
      p95_ms: latencyValues.length > 0
        ? latencyValues[Math.floor(latencyValues.length * 0.95)]
        : null,
      sample_count: latencyValues.length,
    };

    // Metric 3: cost — estimated USD cost in 7-day window
    const cost = {
      total_usd: parseFloat(
        aiInteractions
          .reduce((sum, i) => sum + (i.estimated_cost_usd ?? 0), 0)
          .toFixed(4),
      ),
      by_model: aiInteractions.reduce((acc, i) => {
        if (i.model_id) {
          acc[i.model_id] = parseFloat(
            ((acc[i.model_id] ?? 0) + (i.estimated_cost_usd ?? 0)).toFixed(4),
          );
        }
        return acc;
      }, {} as Record<string, number>),
    };

    // Metric 4: error_rate — failed interactions / total in 7-day window
    const totalInteractions = aiInteractions.length;
    const failedInteractions = aiInteractions.filter(i => i.error_code !== null).length;

    const error_rate = {
      rate: totalInteractions > 0 ? parseFloat((failedInteractions / totalInteractions).toFixed(4)) : 0,
      failed: failedInteractions,
      total: totalInteractions,
    };

    // Metric 5: interaction_volume — 7-day count per interaction type
    const interaction_volume = {
      total: totalInteractions,
      by_type: aiInteractions.reduce((acc, i) => {
        acc[i.interaction_type] = (acc[i.interaction_type] ?? 0) + 1;
        return acc;
      }, {} as Record<string, number>),
    };

    // Circuit breaker status (observable per audit integrity requirement — T-MMM-S6-128)
    const circuit_breaker_status = getCircuitBreakerStatus();

    const body = {
      pipeline_stages: [
        { id: 'upload', status: jobStatus('PENDING'), count: countByStatus(jobs, 'PENDING') },
        { id: 'parse', status: jobStatus('PROCESSING'), count: countByStatus(jobs, 'PROCESSING') },
        { id: 'criteria_map', status: jobStatus('MAPPING'), count: countByStatus(jobs, 'MAPPING') },
        { id: 'score_proposal', status: jobStatus('SCORING'), count: countByStatus(jobs, 'SCORING') },
        { id: 'review', status: jobStatus('REVIEW'), count: countByStatus(jobs, 'REVIEW') },
      ],
      seven_day_trend: {
        assessments_started: assessments.length,
        assessments_completed: countByStatus(assessments, 'COMPLETE'),
        evidence_uploaded: evidRes.count ?? 0,
        ai_interactions: totalInteractions,
      },
      // T-MMM-S6-126: Five AI Telemetry Metrics
      ai_telemetry: {
        token_usage,
        latency,
        cost,
        error_rate,
        interaction_volume,
      },
      circuit_breaker_status,
      retrieved_at: now.toISOString(),
    };

    return jsonResponse(body);
  } catch (e) {
    if (e instanceof Response) return e;
    return jsonResponse({ error: 'Internal server error' }, 500);
  }
});
