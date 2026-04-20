/**
 * Supabase Edge Function: mmm-qiw-status
 * Route: GET /api/qiw/status — TR-060, TR-065
 * JWT required; ADMIN or LEAD_AUDITOR role only
 */
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { validateJWT, requireRole, jsonResponse, corsHeaders } from '../_shared/mmm-auth.ts';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL') ?? '';
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
console.log(`[mmm-qiw-status] SUPABASE_URL configured: ${SUPABASE_URL ? 'YES' : 'NO (MISSING)'}`);

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders() });
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
  try {
    const claims = await validateJWT(req, supabase);
    requireRole(claims.role, ['ADMIN', 'LEAD_AUDITOR']);
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
    const [jobsRes, assessRes, evidRes] = await Promise.all([
      supabase.from('mmm_parse_jobs').select('status', { count: 'exact', head: false }),
      supabase.from('mmm_assessments').select('status, created_at', { count: 'exact', head: false }).gte('created_at', sevenDaysAgo),
      supabase.from('mmm_evidence').select('id', { count: 'exact', head: false }).gte('created_at', sevenDaysAgo),
    ]);
    const jobs: Array<{status: string}> = jobsRes.data ?? [];
    const assessments: Array<{status: string}> = assessRes.data ?? [];
    const countByStatus = (arr: Array<{status: string}>, s: string) => arr.filter(r => r.status === s).length;
    const jobStatus = (s: string): 'ACTIVE' | 'IDLE' | 'ERROR' =>
      countByStatus(jobs, s) > 0 ? 'ACTIVE' : (jobs.some(j => j.status === 'ERROR') ? 'ERROR' : 'IDLE');
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
      },
      retrieved_at: now.toISOString(),
    };
    return jsonResponse(body);
  } catch (e) {
    if (e instanceof Response) return e;
    return jsonResponse({ error: 'Internal server error' }, 500);
  }
});
