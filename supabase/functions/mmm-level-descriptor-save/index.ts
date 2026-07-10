import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { corsHeaders, jsonResponse, validateJWT } from '../_shared/mmm-auth.ts';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL') ?? '';
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';

interface DescriptorInput {
  level: number;
  label?: string;
  descriptor_text: string;
}

interface SavePayload {
  domain_id?: string;
  domain_name?: string;
  criterion_id?: string;
  criterion_code?: string;
  criterion_text?: string;
  edited_levels?: number[];
  descriptors?: DescriptorInput[];
}

const VALID_LEVELS = new Set([1, 2, 3, 4, 5]);

function normalizeDescriptors(value: unknown): DescriptorInput[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => item as Partial<DescriptorInput>)
    .filter((item) => VALID_LEVELS.has(Number(item.level)))
    .map((item) => ({
      level: Number(item.level),
      label: typeof item.label === 'string' ? item.label : `Level ${item.level}`,
      descriptor_text: typeof item.descriptor_text === 'string' ? item.descriptor_text.trim() : '',
    }))
    .sort((a, b) => a.level - b.level);
}

function changedDescriptors(
  beforeRows: Array<{ level: number; descriptor_text: string }>,
  afterRows: DescriptorInput[],
  editedLevels: number[],
) {
  const beforeByLevel = new Map(beforeRows.map((row) => [row.level, row.descriptor_text.trim()]));
  const editedLevelSet = new Set(editedLevels);
  return afterRows.filter((row) => {
    const beforeText = beforeByLevel.get(row.level) ?? '';
    return editedLevelSet.has(row.level) || beforeText !== row.descriptor_text.trim();
  });
}

function extractEvidenceSubject(descriptorText: string): string | null {
  const text = descriptorText.replace(/\s+/g, ' ').trim();
  const patterns = [
    /^Evidence that\s+(.+?)\s+is absent, weak, outdated, inconsistent, fragmented, or person-dependent\b/i,
    /^Evidence that\s+(.+?)\s+exists in some form\b/i,
    /^Evidence that\s+(.+?)\s+is current, complete, traceable\b/i,
    /^Evidence that\s+(.+?)\s+shows owner-led\b/i,
    /^Evidence that\s+(.+?)\s+is embedded\b/i,
  ];
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match?.[1]) return match[1].trim().replace(/[.;:,]+$/g, '');
  }
  return null;
}

function inferCorrectionCategory(beforeText: string, afterText: string): string {
  const beforeSubject = extractEvidenceSubject(beforeText) ?? '';
  const afterSubject = extractEvidenceSubject(afterText) ?? '';
  if (afterSubject.length > beforeSubject.length + 24) return 'evidence_bundle_preservation';
  if (/\bminutes\b|\bactions\b|\bdecisions\b|\baccountable\b/i.test(afterSubject)) return 'multi_object_evidence_preservation';
  if (beforeSubject !== afterSubject) return 'evidence_subject_reconstruction';
  return 'descriptor_wording_refinement';
}

function buildPatternCandidate(criterionText: string, correctedDescriptorText: string): string {
  const correctedSubject = extractEvidenceSubject(correctedDescriptorText);
  const criterionTokens = criterionText.toLowerCase();
  const patternParts: string[] = [];

  if (/\bminutes\b/.test(criterionTokens)) patternParts.push('preserve minutes as evidence');
  if (/\bactions?\b/.test(criterionTokens)) patternParts.push('preserve agreed actions as evidence');
  if (/\bdecisions?\b/.test(criterionTokens)) patternParts.push('preserve recorded decisions as evidence');
  if (/\baccountab/.test(criterionTokens)) patternParts.push('preserve accountable individuals or owners as evidence');
  if (/\bdeliver/.test(criterionTokens) || /\bimplement/.test(criterionTokens)) patternParts.push('preserve delivery or implementation traceability');

  if (patternParts.length > 0) {
    return `For similar criteria, do not reduce the criterion to the first clause. ${patternParts.join('; ')} across all maturity levels.`;
  }

  if (correctedSubject) {
    return `For similar criteria, preserve the corrected evidence subject structure: ${correctedSubject}.`;
  }

  return 'For similar criteria, use the corrected descriptor as a reasoning pattern and preserve criterion-specific evidence objects.';
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders() });
  if (req.method !== 'POST') return jsonResponse({ error: 'Method not allowed' }, 405);
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

  let body: SavePayload = {};
  try {
    body = await req.json();
  } catch {
    return jsonResponse({ error: 'Invalid JSON body' }, 400);
  }

  const descriptors = normalizeDescriptors(body.descriptors);
  if (!body.criterion_id) {
    return jsonResponse({ error: 'criterion_id is required.' }, 400);
  }
  if (descriptors.length !== 5 || descriptors.some((descriptor) => !descriptor.descriptor_text)) {
    return jsonResponse({ error: 'Exactly five non-empty maturity descriptors are required.' }, 400);
  }

  const { data: criterion, error: criterionError } = await supabase
    .from('mmm_criteria')
    .select('id, code, name, mps_id')
    .eq('id', body.criterion_id)
    .single();
  if (criterionError || !criterion) {
    return jsonResponse({ error: criterionError?.message || 'Criterion not found.' }, 404);
  }

  const { data: mps, error: mpsError } = await supabase
    .from('mmm_maturity_process_steps')
    .select('id, code, name, domain_id')
    .eq('id', criterion.mps_id)
    .single();
  if (mpsError || !mps) {
    return jsonResponse({ error: mpsError?.message || 'MPS not found for criterion.' }, 404);
  }

  const { data: domain, error: domainError } = await supabase
    .from('mmm_domains')
    .select('id, name, framework_id')
    .eq('id', mps.domain_id)
    .single();
  if (domainError || !domain) {
    return jsonResponse({ error: domainError?.message || 'Domain not found for criterion.' }, 404);
  }

  const { data: framework, error: frameworkError } = await supabase
    .from('mmm_frameworks')
    .select('id, organisation_id, source_type')
    .eq('id', domain.framework_id)
    .single();
  if (frameworkError || !framework) {
    return jsonResponse({ error: frameworkError?.message || 'Framework not found for criterion.' }, 404);
  }
  if (framework.organisation_id !== claims.orgId) {
    return jsonResponse({ error: 'Criterion is outside the authenticated organisation.' }, 403);
  }

  const { data: beforeRows, error: beforeError } = await supabase
    .from('mmm_level_descriptors')
    .select('criterion_id, level, descriptor_text')
    .eq('criterion_id', body.criterion_id)
    .order('level', { ascending: true });
  if (beforeError) {
    return jsonResponse({ error: beforeError.message || 'Failed to load existing descriptors.' }, 500);
  }

  const upsertRows = descriptors.map((descriptor) => ({
    criterion_id: body.criterion_id,
    level: descriptor.level,
    descriptor_text: descriptor.descriptor_text,
  }));
  const { error: upsertError } = await supabase
    .from('mmm_level_descriptors')
    .upsert(upsertRows, { onConflict: 'criterion_id,level' });
  if (upsertError) {
    return jsonResponse({ error: upsertError.message || 'Failed to save maturity descriptors.' }, 500);
  }

  const editedLevels = Array.isArray(body.edited_levels)
    ? body.edited_levels.filter((level) => VALID_LEVELS.has(Number(level))).map(Number)
    : [];
  const editedLevelSet = new Set(editedLevels);
  const changed = changedDescriptors(
    (beforeRows ?? []) as Array<{ level: number; descriptor_text: string }>,
    descriptors,
    editedLevels,
  );
  const userEditedDescriptors = descriptors.filter((descriptor) => editedLevelSet.has(descriptor.level));

  await supabase.from('mmm_audit_logs').insert({
    action_type: 'MATURITY_DESCRIPTOR_SAVE',
    actor_id: claims.userId,
    target_entity_type: 'criterion',
    target_entity_id: body.criterion_id,
    before_state: {
      descriptors: beforeRows ?? [],
    },
    after_state: {
      domain_id: domain.id,
      domain_name: body.domain_name ?? domain.name,
      mps_id: mps.id,
      mps_code: mps.code,
      criterion_id: body.criterion_id,
      criterion_code: body.criterion_code ?? criterion.code,
      criterion_text: body.criterion_text ?? criterion.name,
      descriptors,
      changed_levels: changed.map((descriptor) => descriptor.level),
    },
  });

  if (userEditedDescriptors.length > 0) {
    const beforeByLevel = new Map(
      ((beforeRows ?? []) as Array<{ level: number; descriptor_text: string }>).map((row) => [row.level, row.descriptor_text]),
    );
    const criterionText = body.criterion_text ?? criterion.name;
    const learningEvents = userEditedDescriptors.map((descriptor) => {
      const originalGeneratedDescriptorText = beforeByLevel.get(descriptor.level) ?? '';
      const userCorrectedDescriptorText = descriptor.descriptor_text;
      const learnedEvidenceSubject = extractEvidenceSubject(userCorrectedDescriptorText);
      const correctionCategory = inferCorrectionCategory(originalGeneratedDescriptorText, userCorrectedDescriptorText);
      return {
        level: descriptor.level,
        label: descriptor.label,
        original_generated_descriptor_text: originalGeneratedDescriptorText,
        user_corrected_descriptor_text: userCorrectedDescriptorText,
        learned_evidence_subject: learnedEvidenceSubject,
        correction_category: correctionCategory,
        transformation_summary: `User corrected level ${descriptor.level} descriptor; category=${correctionCategory}.`,
        reusable_pattern_candidate_text: buildPatternCandidate(criterionText, userCorrectedDescriptorText),
      };
    });

    await supabase.from('mmm_ai_interactions').insert({
      actor_id: claims.userId,
      action_type: 'USER_PREFERENCE_CAPTURE',
      context_type: 'MATURITY_DESCRIPTOR_EDIT',
      target_entity_id: body.criterion_id,
      status: 'recorded',
      request_json: {
        workflow_stage: 'criteria_maturity_descriptor_edit',
        tenant_id: claims.orgId,
        organisation_id: claims.orgId,
        framework_id: framework.id,
        source_mode: framework.source_type ?? null,
        domain_id: domain.id,
        domain_name: body.domain_name ?? domain.name,
        mps_id: mps.id,
        mps_code: mps.code,
        criterion_id: body.criterion_id,
        criterion_code: body.criterion_code ?? criterion.code,
        criterion_text: criterionText,
        edited_levels: editedLevels,
        before_descriptors: beforeRows ?? [],
        after_descriptors: descriptors,
        changed_descriptors: userEditedDescriptors,
        learning_events: learningEvents,
      },
      response_json: {
        captured: true,
        learning_scope: 'descriptor_authoring',
        reuse_scope: 'tenant_specific_pattern',
        review_status: 'validated',
        conflict_status: 'none',
        lifecycle_status: 'active',
        consented_at: new Date().toISOString(),
      },
    });
  }

  return jsonResponse({
    ok: true,
    saved_count: descriptors.length,
    changed_count: userEditedDescriptors.length,
    learning_event_recorded: userEditedDescriptors.length > 0,
  }, 200);
});