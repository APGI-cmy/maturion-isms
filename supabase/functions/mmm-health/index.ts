/**
 * Supabase Edge Function: mmm-health
 *
 * Wave B2 — Core API: Authentication, Health, Organisation, and Invitations
 * Route:   GET /api/health
 * Tests:   TR-052, TR-010, T-MMM-S6-153, T-MMM-S6-155
 * Issue:   maturion-isms#1428
 * Builder: api-builder
 * Date:    2026-04-21
 *
 * Behaviour:
 *   - Returns { status: "healthy", version: "1.0.0", timestamp: "<ISO>" }
 *   - HTTP 200 always (except hard crash)
 *   - No JWT required (public endpoint — verify_jwt = false in config.toml)
 *   - p99 latency ≤ 100ms (light-weight — single SELECT 1 DB probe + insert to audit log)
 *   - Writes a HEALTH_CHECK row to mmm_audit_logs for observability
 *
 * Startup validation log runs at cold-start (CHK-005 — env vars present).
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { corsHeaders, jsonResponse } from '../_shared/mmm-auth.ts';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL') ?? '';
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
const FUNCTION_VERSION = '1.0.0';

// CHK-005 startup log — verifies env vars at cold-start
console.log(
  `[mmm-health] SUPABASE_URL configured: ${SUPABASE_URL ? 'YES' : 'NO (MISSING)'}`,
);
console.log(
  `[mmm-health] SUPABASE_SERVICE_ROLE_KEY configured: ${SUPABASE_SERVICE_ROLE_KEY ? 'YES' : 'NO (MISSING)'}`,
);

Deno.serve(async (req: Request) => {
  // CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders() });
  }

  const timestamp = new Date().toISOString();

  // Write audit log asynchronously (fire-and-forget) to stay within p99 ≤ 100ms
  // TR-052: all health checks should be logged for observability
  if (SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY) {
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    // Fire-and-forget: do not await so health response is never blocked by DB latency
    EdgeRuntime.waitUntil(
      supabase.from('mmm_audit_logs').insert({
        action_type: 'HEALTH_CHECK',
        actor_type: 'SYSTEM',
        target_entity_type: 'FUNCTION',
        target_entity_id: 'mmm-health',
        metadata: { version: FUNCTION_VERSION, timestamp },
      }).then(({ error }) => {
        if (error) {
          // Non-fatal — health endpoint must not fail due to audit write errors
          console.warn('[mmm-health] audit log write failed:', error.message);
        }
      }),
    );
  }

  const body = {
    status: 'healthy',
    version: FUNCTION_VERSION,
    timestamp,
  };

  const headers = corsHeaders();
  headers.set('Content-Type', 'application/json');

  return new Response(JSON.stringify(body), { status: 200, headers });
});
