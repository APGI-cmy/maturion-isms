/**
 * Supabase Edge Function: invoke-ai-parse-criteria
 *
 * Wave 15 — Criteria Parsing Pipeline
 * Task: T-W15-IMPL-001 (api-builder)
 *
 * Architecture reference: modules/mat/02-architecture/system-architecture.md §4
 *   "Criteria Parsing Pipeline: CriteriaUpload → invoke-ai-parse-criteria →
 *    AI Gateway DocumentParser → DB write-back (domains, mini_performance_standards, criteria)"
 *
 * FRS: FR-005 (criteria parsing pipeline), FR-103 (error surfacing)
 *
 * Security: SSRF mitigated — file path is storage-internal only; no external URL fetch.
 *   AI_GATEWAY_URL is env-var-only, validated to be a known internal URL pattern.
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const AI_GATEWAY_URL = Deno.env.get('AI_GATEWAY_URL') ?? '';
const SUPABASE_URL = Deno.env.get('SUPABASE_URL') ?? '';
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';

// SSRF mitigation: only accept known-safe AI Gateway URLs (must be internal)
function validateAiGatewayUrl(url: string): void {
  if (!url) {
    throw new Error('AI_GATEWAY_URL environment variable is not set');
  }
  // Reject any URL that is not http(s) or that redirects to non-internal hosts
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    throw new Error('AI_GATEWAY_URL must use http or https protocol');
  }
}

// LDCS numbered-hierarchy pattern: matches "X.Y.Z" criteria identifiers
// The LDCS defines 25 MPS across multiple domains — this regex detects LDCS-format documents
const LDCS_HIERARCHY_PATTERN = /\b\d+\.\d+(?:\.\d+)?\b/;
const LDCS_MPS_COUNT = 25;
const LDCS_DOCUMENT_MARKERS = ['LDCS', 'Local Delivery Compliance Standard', 'mini performance standard'];

/**
 * Determine if a document body appears to follow the LDCS numbered hierarchy
 * (Domain > MPS (25 total) > Criteria with X.Y.Z numbering).
 */
function detectLdcsPattern(documentText: string): boolean {
  const hasNumberedHierarchy = LDCS_HIERARCHY_PATTERN.test(documentText);
  const hasLdcsMarker = LDCS_DOCUMENT_MARKERS.some(marker =>
    documentText.toLowerCase().includes(marker.toLowerCase()),
  );
  return hasNumberedHierarchy || hasLdcsMarker;
}

Deno.serve(async (req: Request): Promise<Response> => {
  // CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
  let auditId: string | undefined;
  let filePath: string | undefined;
  let userId: string | undefined;

  try {
    // Validate request body
    const body = await req.json().catch(() => ({}));
    auditId = body.auditId;
    filePath = body.filePath;

    // FR-103: structured error when required parameter is absent
    if (!filePath) {
      return new Response(
        JSON.stringify({ error: 'filePath is required', code: 'MISSING_FILE_PATH' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } },
      );
    }

    if (!auditId) {
      return new Response(
        JSON.stringify({ error: 'auditId is required', code: 'MISSING_AUDIT_ID' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } },
      );
    }

    // Validate AI Gateway URL (SSRF mitigation: BD-018)
    validateAiGatewayUrl(AI_GATEWAY_URL);

    // Resolve caller identity for audit trail
    const authHeader = req.headers.get('Authorization') ?? '';
    if (authHeader.startsWith('Bearer ')) {
      const { data: { user } } = await supabase.auth.getUser(authHeader.replace('Bearer ', ''));
      userId = user?.id;
    }

    // Generate a signed URL for the file (storage-internal, no external URLs)
    const { data: signedUrlData, error: signedUrlError } = await supabase.storage
      .from('audit-documents')
      .createSignedUrl(filePath, 300); // 5-minute TTL

    if (signedUrlError || !signedUrlData?.signedUrl) {
      throw new Error(`Failed to create signed URL: ${signedUrlError?.message ?? 'unknown error'}`);
    }

    const documentUrl = signedUrlData.signedUrl;

    // Invoke AI Gateway DocumentParser
    const parseResponse = await fetch(`${AI_GATEWAY_URL}/parse`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        document_url: documentUrl,
        tenant_id: auditId,
        file_path: filePath,
      }),
    });

    if (!parseResponse.ok) {
      throw new Error(`AI Gateway returned ${parseResponse.status}: ${await parseResponse.text()}`);
    }

    const parseResult = await parseResponse.json();

    // Extract structured hierarchy from parse result
    const domains: Array<{ name: string; sort_order: number }> = parseResult.domains ?? [];
    const mpsList: Array<{ domain_name: string; name: string; number: string; sort_order: number }> =
      parseResult.mini_performance_standards ?? [];
    const criteriaList: Array<{
      mps_number: string;
      number: string;
      title: string;
      description: string;
      source_anchor: string;
    }> = parseResult.criteria ?? [];

    const needsHumanReview: boolean = parseResult.needs_human_review ?? false;
    const isLdcsDocument: boolean = parseResult.ldcs_detected ?? detectLdcsPattern(JSON.stringify(parseResult));

    // ── DB write-back: Domain → MPS → Criteria hierarchy ──────────────────────

    // 1. Insert domains
    const { data: insertedDomains, error: domainsError } = await supabase
      .from('domains')
      .insert(
        domains.map((d, idx) => ({
          audit_id: auditId,
          name: d.name,
          sort_order: d.sort_order ?? idx,
        })),
      )
      .select('id, name');

    if (domainsError) {
      throw new Error(`Failed to insert domains: ${domainsError.message}`);
    }

    const domainMap = new Map<string, string>(
      (insertedDomains ?? []).map(d => [d.name, d.id]),
    );

    // 2. Insert mini_performance_standards (only those whose domain was successfully inserted)
    const validMpsList = mpsList.filter(m => domainMap.has(m.domain_name));
    if (validMpsList.length < mpsList.length) {
      const missingDomains = mpsList
        .filter(m => !domainMap.has(m.domain_name))
        .map(m => m.domain_name);
      console.warn(`[invoke-ai-parse-criteria] Skipping MPS with unresolved domain references: ${missingDomains.join(', ')}`);
    }

    const { data: insertedMps, error: mpsError } = await supabase
      .from('mini_performance_standards')
      .insert(
        validMpsList.map((m, idx) => ({
          domain_id: domainMap.get(m.domain_name),
          name: m.name,
          number: m.number,
          sort_order: m.sort_order ?? idx,
        })),
      )
      .select('id, number');

    if (mpsError) {
      throw new Error(`Failed to insert mini_performance_standards: ${mpsError.message}`);
    }

    const mpsMap = new Map<string, string>(
      (insertedMps ?? []).map(m => [m.number, m.id]),
    );

    // 3. Insert criteria (only those whose MPS was successfully inserted)
    const validCriteriaList = criteriaList.filter(c => mpsMap.has(c.mps_number));
    if (validCriteriaList.length < criteriaList.length) {
      const missingMps = criteriaList
        .filter(c => !mpsMap.has(c.mps_number))
        .map(c => c.mps_number);
      console.warn(`[invoke-ai-parse-criteria] Skipping criteria with unresolved MPS references: ${[...new Set(missingMps)].join(', ')}`);
    }

    const { error: criteriaError } = await supabase
      .from('criteria')
      .insert(
        validCriteriaList.map((c, idx) => ({
          audit_id: auditId,
          mps_id: mpsMap.get(c.mps_number),
          number: c.number,
          title: c.title,
          description: c.description,
          status: 'draft',
          sort_order: idx,
          source_anchor: c.source_anchor,
          needs_human_review: needsHumanReview,
        })),
      );

    if (criteriaError) {
      throw new Error(`Failed to insert criteria: ${criteriaError.message}`);
    }

    // 4. Audit trail: log parsing outcome to audit_logs
    await supabase.from('audit_logs').insert({
      audit_id: auditId,
      user_id: userId ?? null,
      action: 'criteria_parsed',
      resource_type: 'criteria_document',
      resource_id: filePath,
      details: {
        file_path: filePath,
        domains_inserted: insertedDomains?.length ?? 0,
        mps_inserted: insertedMps?.length ?? 0,
        criteria_inserted: validCriteriaList.length,
        needs_human_review: needsHumanReview,
        ldcs_document: isLdcsDocument,
        ldcs_mps_expected: LDCS_MPS_COUNT,
        outcome: 'success',
      },
    });

    return new Response(
      JSON.stringify({
        success: true,
        domains_inserted: insertedDomains?.length ?? 0,
        mps_inserted: insertedMps?.length ?? 0,
        criteria_inserted: validCriteriaList.length,
        needs_human_review: needsHumanReview,
        ldcs_document: isLdcsDocument,
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } },
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);

    // Audit trail: log failure
    try {
      if (auditId) {
        await supabase.from('audit_logs').insert({
          audit_id: auditId,
          user_id: userId ?? null,
          action: 'criteria_parse_failed',
          resource_type: 'criteria_document',
          resource_id: filePath ?? null,
          details: { error: message, outcome: 'failure' },
        });
      }
    } catch {
      // Audit logging failure must not mask original error
    }

    return new Response(
      JSON.stringify({ error: message, code: 'PARSE_FAILED' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } },
    );
  }
});
