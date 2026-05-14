/**
 * Supabase Edge Function: mmm-org-create
 *
 * Wave B3 — Core UI: Onboarding
 * Issue:   maturion-isms#1428
 * Updated: maturion-isms#13 — extended for Get To Know You wizard context fields
 * Builder: ui-builder / api-builder
 * Date:    2026-04-22 / 2026-05-14
 *
 * JWT required.
 *
 * Behaviour:
 *   - Body: { name: string, tier: string, context?: OnboardingContext }
 *   - Create mmm_organisations record (with context JSONB + onboarding_complete flag)
 *   - Create/update mmm_profiles for the user (set organisation_id, role='ADMIN')
 *   - NBR-001: UI must call queryClient.invalidateQueries(['organisations'])
 *   - NBR-002: HTTP 403 if no valid JWT (validateJWT pattern; raw auth.getUser used here
 *     because mmm_profiles does not yet exist at org-create time — validateJWT requires
 *     a pre-existing profile and would return 403 for new sign-ups)
 *   - Return: { organisation }
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
// `validateJWT` and `requireRole` are the standard auth helpers for other MMM Edge Functions.
// This function intentionally does not import or call `validateJWT`: mmm-org-create uses
// auth.getUser directly (NBR-002 enforced below) because the mmm_profiles row is created
// here, and `validateJWT` would throw 403 before the profile is written.
import { corsHeaders, jsonResponse } from '../_shared/mmm-auth.ts';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL') ?? '';
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
const UNIQUE_VIOLATION_CODE = '23505';

function toSlug(name: string): string {
  const slug = name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return slug || 'organisation';
}

/** Onboarding wizard context fields (maturion-isms#13) */
interface OnboardingContext {
  fullName?: string;
  title?: string;
  bio?: string;
  primaryColor?: string;
  secondaryColor?: string;
  textColor?: string;
  modelName?: string;
  primaryWebsiteUrl?: string;
  linkedDomains?: string[];
  industryTags?: string[];
  customIndustry?: string;
  regionOperating?: string;
  riskConcerns?: string[];
  complianceCommitments?: string[];
  threatSensitivityLevel?: string;
  documentNotes?: string;
}

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

  const authHeader = req.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    // NBR-002: explicit 401/403 — never silent failure
    return jsonResponse({ error: 'Missing or malformed Authorization header' }, 401);
  }
  const token = authHeader.replace('Bearer ', '').trim();
  const { data: userData, error: authError } = await supabase.auth.getUser(token);
  if (authError || !userData?.user) {
    return jsonResponse({ error: 'Invalid or expired JWT' }, 401);
  }

  let body: { name?: string; tier?: string; context?: OnboardingContext };
  try {
    body = await req.json();
  } catch {
    return jsonResponse({ error: 'Invalid JSON body' }, 400);
  }

  const { name, tier, context } = body;

  if (!name || typeof name !== 'string' || name.trim() === '') {
    return jsonResponse({ error: 'name is required' }, 400);
  }

  if (!tier || typeof tier !== 'string') {
    return jsonResponse({ error: 'tier is required' }, 400);
  }

  // Create mmm_organisations record
  const trimmedName = name.trim();
  const baseSlug = toSlug(trimmedName);
  let org: { id: string } | null = null;
  let orgError: { code?: string; message?: string } | null = null;

  for (let attempt = 0; attempt < 10; attempt++) {
    const slug = attempt === 0 ? baseSlug : `${baseSlug}-${attempt}`;
    // Store context fields and mark onboarding_complete when context is provided (maturion-isms#13)
    const onboarding_complete = !!(context && (context.fullName || context.title));
    const result = await supabase
      .from('mmm_organisations')
      .insert({ name: trimmedName, slug, tier, context: context ?? null, onboarding_complete })
      .select()
      .single();

    org = result.data;
    orgError = result.error;
    if (!orgError && org) {
      break;
    }
    if (orgError?.code !== UNIQUE_VIOLATION_CODE) {
      break;
    }
  }

  if (orgError || !org) {
    console.error('[mmm-org-create] org insert error:', orgError?.message);
    return jsonResponse({ error: 'Failed to create organisation' }, 500);
  }

  // Create/update mmm_profiles for the user with organisation_id and role='ADMIN'
  const { error: profileError } = await supabase
    .from('mmm_profiles')
    .upsert(
      {
        id: userData.user.id,
        organisation_id: org.id,
        role: 'ADMIN',
      },
      { onConflict: 'id' },
    );

  if (profileError) {
    console.error('[mmm-org-create] profile upsert error:', profileError.message);
    return jsonResponse({ error: 'Failed to update user profile' }, 500);
  }

  // NBR-001: UI must call queryClient.invalidateQueries(['organisations'])
  return jsonResponse({ organisation: org }, 201);
});
