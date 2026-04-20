/**
 * Supabase Edge Function: mmm-ai-recommend
 *
 * Wave B6 — Findings & Reporting
 * Route:   POST /api/ai/recommend
 * Tests:   T-MMM-S6-083, T-MMM-S6-097
 * Issue:   maturion-isms#1428
 * Builder: ui-builder
 * Date:    2026-04-22
 *
 * JWT required.
 *
 * AIMC stub (B6; live in B7).
 *
 * Behaviour:
 *   - Body: { assessment_id }
 *   - Returns mock recommendations per domain
 *   - Return: { recommendations: [{ domain, gap_to_next, recommendation_text }] }
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { corsHeaders, jsonResponse, validateJWT } from '../_shared/mmm-auth.ts';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL') ?? '';
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
// AIMC_BASE_URL: will be wired to Deno.env.get('AIMC_BASE_URL') in B7

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

  let body: { assessment_id?: string };
  try {
    body = await req.json();
  } catch {
    return jsonResponse({ error: 'Invalid JSON body' }, 400);
  }

  const { assessment_id } = body;

  if (!assessment_id) {
    return jsonResponse({ error: 'assessment_id is required' }, 400);
  }

  // AIMC stub: generate mock recommendations per domain
  // In B7, this will call AIMC_BASE_URL with real assessment data
  const mockRecommendations = [
    {
      domain: 'Governance',
      gap_to_next: 1.2,
      recommendation_text:
        'Formalise governance policy documentation and establish a review cadence. Consider implementing a governance committee.',
    },
    {
      domain: 'Risk Management',
      gap_to_next: 0.8,
      recommendation_text:
        'Establish a risk register and risk appetite statement. Implement quarterly risk reviews.',
    },
    {
      domain: 'Compliance',
      gap_to_next: 1.5,
      recommendation_text:
        'Map regulatory requirements to internal controls. Conduct annual compliance audit.',
    },
    {
      domain: 'Technology',
      gap_to_next: 0.5,
      recommendation_text:
        'Implement automated vulnerability scanning. Establish a patch management process.',
    },
    {
      domain: 'People',
      gap_to_next: 1.0,
      recommendation_text:
        'Develop a security awareness training programme. Define clear roles and responsibilities.',
    },
  ];

  return jsonResponse({ recommendations: mockRecommendations });
});
