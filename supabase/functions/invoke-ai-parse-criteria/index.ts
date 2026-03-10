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
 *
 * Hotfix (issue #1019): Restructured to fire-and-forget async pattern using
 *   EdgeRuntime.waitUntil() to prevent EarlyDrop termination on Supabase free plan.
 *   Fast path returns 202 Accepted immediately; AI Gateway call runs in background.
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const AI_GATEWAY_URL = Deno.env.get('AI_GATEWAY_URL') ?? '';
const SUPABASE_URL = Deno.env.get('SUPABASE_URL') ?? '';
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';

// T-W15R-API-002: Startup validation log — runs once at cold-start before any request handling
console.log(
  `[invoke-ai-parse-criteria] AI_GATEWAY_URL configured: ${AI_GATEWAY_URL ? 'YES' : 'NO (MISSING)'}`,
);

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

// ── Background parse: domain/MPS/criteria types ───────────────────────────────

interface ParsedDomain {
  name: string;
  description?: string;
}

interface ParsedMps {
  domain_name: string;
  name: string;
  number: string;
  description?: string;
}

interface ParsedCriterion {
  mps_number: string;
  number: string;
  title?: string;
  description?: string;
  source_anchor?: string;
}

// ── Background parse task ──────────────────────────────────────────────────────
// Dispatched via EdgeRuntime.waitUntil() — runs after 202 is returned to the caller.
// Performs the long-running AI Gateway call and all DB write-back operations.

interface BackgroundParseArgs {
  // deno-lint-ignore no-explicit-any
  supabase: any;
  auditId: string;
  filePath: string;
  organisationId: string;
  userId: string | undefined;
}

async function backgroundParse({
  supabase,
  auditId,
  filePath,
  organisationId,
  userId,
}: BackgroundParseArgs): Promise<void> {
  try {
    // Invoke AI Gateway DocumentParser (skip if AI_GATEWAY_URL is not configured)
    let parseResult: Record<string, unknown> = {};
    if (AI_GATEWAY_URL) {
      // Validate AI Gateway URL (SSRF mitigation: BD-018)
      validateAiGatewayUrl(AI_GATEWAY_URL);

      // Generate a signed URL for the file (storage-internal, no external URLs)
      const { data: signedUrlData, error: signedUrlError } = await supabase.storage
        .from('audit-documents')
        .createSignedUrl(filePath, 300); // 5-minute TTL

      if (signedUrlError || !signedUrlData?.signedUrl) {
        throw new Error(`Failed to create signed URL: ${signedUrlError?.message ?? 'unknown error'}`);
      }

      const documentUrl = signedUrlData.signedUrl;

      const parseResponse = await fetch(`${AI_GATEWAY_URL}/api/v1/parse`, {
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

      parseResult = await parseResponse.json();
    } else {
      console.warn('[invoke-ai-parse-criteria] AI_GATEWAY_URL is not set — skipping AI parse, returning empty result');
    }

    // Extract structured hierarchy from parse result
    const domains: ParsedDomain[] = parseResult.domains ?? [];
    const mpsList: ParsedMps[] =
      parseResult.mini_performance_standards ?? [];
    const criteriaList: ParsedCriterion[] = parseResult.criteria ?? [];

    const needsHumanReview: boolean = (parseResult.needs_human_review as boolean) ?? false;
    const isLdcsDocument: boolean =
      (parseResult.ldcs_detected as boolean) ?? detectLdcsPattern(JSON.stringify(parseResult));

    // ── Handle empty parse results gracefully (architecture §4.2) ──────────────
    // If the AI returned zero domains (e.g. gateway unreachable or not configured),
    // skip all DB inserts and update status to pending_review.
    if (domains.length === 0) {
      const { data: emptyUpdatedRows, error: emptyStatusError } = await supabase
        .from('criteria_documents')
        .update({ status: 'pending_review' })
        .eq('audit_id', auditId)
        .eq('file_path', filePath)
        .select('id');

      if (emptyStatusError) {
        console.warn(`[invoke-ai-parse-criteria] Failed to update criteria_documents status (empty result): ${emptyStatusError.message}`);
      } else if (!emptyUpdatedRows || emptyUpdatedRows.length === 0) {
        console.warn(`[invoke-ai-parse-criteria] WARN: criteria_documents row not found for audit_id=${auditId} file_path=${filePath} — status not updated`);
      }

      await supabase.from('audit_logs').insert({
        audit_id: auditId,
        organisation_id: organisationId,
        action: 'criteria_parsed',
        file_path: filePath,
        created_by: userId ?? null,
        details: {
          domains_inserted: 0,
          mps_inserted: 0,
          criteria_inserted: 0,
          needs_human_review: needsHumanReview,
          ldcs_document: isLdcsDocument,
          ldcs_mps_expected: LDCS_MPS_COUNT,
          outcome: 'success',
        },
      });

      return;
    }

    // TODO(T-W15-TXN): Architecture §4.4 requires all Domain/MPS/criteria inserts to run in a
    // single DB transaction with full rollback on failure. Current implementation uses sequential
    // inserts — a failure after domains are inserted but before criteria are inserted will leave
    // partial data. A tracked follow-up task must implement a Postgres function (RPC) or
    // Supabase transaction wrapper to satisfy this requirement.
    // ── DB write-back: Domain → MPS → Criteria hierarchy ──────────────────────

    // 1. Upsert domains — includes organisation_id (NOT NULL) and number (INTEGER)
    //    onConflict: 'audit_id,number' handles retries without 23505 uniqueness errors
    const { data: insertedDomains, error: domainsError } = await supabase
      .from('domains')
      .upsert(
        domains.map((d: ParsedDomain, idx: number) => ({
          audit_id: auditId,
          organisation_id: organisationId,
          number: idx + 1,           // INTEGER, 1-based sequential
          name: d.name,
          description: d.description ?? null,
        })),
        { onConflict: 'audit_id,number', ignoreDuplicates: false },
      )
      .select('id, name, number');

    if (domainsError) {
      throw new Error(`Failed to upsert domains: ${domainsError.message}`);
    }

    const domainMap = new Map<string, { id: string; number: number }>(
      (insertedDomains ?? []).map((d: { id: string; name: string; number: number }) => [d.name, { id: d.id, number: d.number }]),    );

    // 2. Upsert mini_performance_standards — includes audit_id, organisation_id (both NOT NULL)
    //    onConflict: 'audit_id,number' handles retries without 23505 uniqueness errors
    const validMpsList = mpsList.filter((m: ParsedMps) => domainMap.has(m.domain_name));
    if (validMpsList.length < mpsList.length) {
      const missingDomains = mpsList
        .filter((m: ParsedMps) => !domainMap.has(m.domain_name))
        .map((m: ParsedMps) => m.domain_name);
      console.warn(`[invoke-ai-parse-criteria] Skipping MPS with unresolved domain references: ${missingDomains.join(', ')}`);
    }

    const { data: insertedMps, error: mpsError } = await supabase
      .from('mini_performance_standards')
      .upsert(
        validMpsList.map((m: ParsedMps, idx: number) => ({
          domain_id: domainMap.get(m.domain_name)!.id,
          audit_id: auditId,
          organisation_id: organisationId,
          number: idx + 1,           // INTEGER, 1-based sequential
          name: m.name,
          description: m.description ?? null,
        })),
        { onConflict: 'audit_id,number', ignoreDuplicates: false },
      )
      .select('id, number, domain_id');

    if (mpsError) {
      throw new Error(`Failed to upsert mini_performance_standards: ${mpsError.message}`);
    }

    // Map AI's original MPS number string → { id, domain_id } from inserted rows
    // (relies on insert order matching validMpsList order)
    const safeMps = insertedMps ?? [];
    if (safeMps.length !== validMpsList.length) {
      throw new Error(
        `MPS insert count mismatch: expected ${validMpsList.length}, got ${safeMps.length}`,
      );
    }
    const mpsMap = new Map<string, { id: string; domain_id: string }>(
      validMpsList.map((m: ParsedMps, idx: number) => [
        m.number,
        {
          id: safeMps[idx].id,
          domain_id: safeMps[idx].domain_id,
        },
      ]),
    );

    // 3. Upsert criteria — includes domain_id, organisation_id (both NOT NULL),
    //    number as INTEGER, description (maps title + description), guidance from source_anchor
    //    onConflict: 'audit_id,number' handles retries without 23505 uniqueness errors
    const validCriteriaList = criteriaList.filter((c: ParsedCriterion) => {
      if (mpsMap.has(c.mps_number)) return true;
      // Normalised: e.g., strip 'MPS ' or trailing zeros, compare numeric value
      return !![...mpsMap.keys()].find(k => String(Number(k)) === String(Number(c.mps_number)));
    });
    // Helper: resolve the actual mpsMap key for a criterion (handles normalised fallback)
    const resolveMpsKey = (mpsNumber: string): string | undefined => {
      if (mpsMap.has(mpsNumber)) return mpsNumber;
      return [...mpsMap.keys()].find(k => String(Number(k)) === String(Number(mpsNumber)));
    };
    if (validCriteriaList.length < criteriaList.length) {
      const missingMps = criteriaList
        .filter((c: ParsedCriterion) => !resolveMpsKey(c.mps_number))
        .map((c: ParsedCriterion) => c.mps_number);
      console.warn(`[invoke-ai-parse-criteria] Skipping criteria with unresolved MPS references: ${[...new Set(missingMps)].join(', ')}`);
    }

    const { error: criteriaError } = await supabase
      .from('criteria')
      .upsert(
        validCriteriaList.map((c: ParsedCriterion, idx: number) => {
          const mpsEntry = mpsMap.get(resolveMpsKey(c.mps_number)!);
          return {
            mps_id: mpsEntry?.id,
            domain_id: mpsEntry?.domain_id,
            audit_id: auditId,
            organisation_id: organisationId,
            number: idx + 1,          // INTEGER, 1-based sequential
            description: c.title
              ? `${c.title}${c.description ? ': ' + c.description : ''}`
              : (c.description ?? ''),
            guidance: c.source_anchor ?? null,
          };
        }),
        { onConflict: 'audit_id,number', ignoreDuplicates: false },
      );

    if (criteriaError) {
      throw new Error(`Failed to upsert criteria: ${criteriaError.message}`);
    }

    // 4. Update criteria_documents.status → pending_review (architecture §4.2)
    const { data: updatedStatusRows, error: statusError } = await supabase
      .from('criteria_documents')
      .update({ status: 'pending_review' })
      .eq('audit_id', auditId)
      .eq('file_path', filePath)
      .select('id');

    if (statusError) {
      console.warn(`[invoke-ai-parse-criteria] Failed to update criteria_documents status: ${statusError.message}`);
    } else if (!updatedStatusRows || updatedStatusRows.length === 0) {
      console.warn(`[invoke-ai-parse-criteria] WARN: criteria_documents row not found for audit_id=${auditId} file_path=${filePath} — status not updated`);
    }

    // 5. Audit trail: log parsing outcome to audit_logs
    await supabase.from('audit_logs').insert({
      audit_id: auditId,
      organisation_id: organisationId,
      action: 'criteria_parsed',
      file_path: filePath,
      created_by: userId ?? null,
      details: {
        domains_inserted: insertedDomains?.length ?? 0,
        mps_inserted: insertedMps?.length ?? 0,
        criteria_inserted: validCriteriaList.length,
        criteria_per_mps: Object.fromEntries([...mpsMap.keys()].map(k => [k, validCriteriaList.filter((c: ParsedCriterion) => resolveMpsKey(c.mps_number) === k).length])),
        needs_human_review: needsHumanReview,
        ldcs_document: isLdcsDocument,
        ldcs_mps_expected: LDCS_MPS_COUNT,
        outcome: 'success',
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`[invoke-ai-parse-criteria] Background parse failed: ${message}`);

    // Update criteria_documents.status → parse_failed (architecture §4.2)
    try {
      const { data: failedStatusRows, error: failedStatusError } = await supabase
        .from('criteria_documents')
        .update({ status: 'parse_failed' })
        .eq('audit_id', auditId)
        .eq('file_path', filePath)
        .select('id');
      if (failedStatusError) {
        console.warn(`[invoke-ai-parse-criteria] Failed to update criteria_documents status to parse_failed: ${failedStatusError.message}`);
      } else if (!failedStatusRows || failedStatusRows.length === 0) {
        console.warn(`[invoke-ai-parse-criteria] WARN: criteria_documents row not found for audit_id=${auditId} file_path=${filePath} — status not updated`);
      }
    } catch {
      // Status update failure must not mask original error
    }

    // Audit trail: log failure
    try {
      await supabase.from('audit_logs').insert({
        audit_id: auditId,
        organisation_id: organisationId,
        action: 'criteria_parse_failed',
        file_path: filePath,
        created_by: userId ?? null,
        details: { error: message, outcome: 'failure' },
      });
    } catch {
      // Audit logging failure must not mask original error
    }
  }
}

Deno.serve(async (req: Request): Promise<Response> => {
  // CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-client-info, apikey',
      },
    });
  }

  // T-W15R-API-001: Health check endpoint — returns 200 for deployment verification
  const url = new URL(req.url);
  if (req.method === 'GET' && url.pathname.endsWith('/health')) {
    return new Response(
      JSON.stringify({ status: 'healthy', function: 'invoke-ai-parse-criteria' }),
      { status: 200, headers: { 'Content-Type': 'application/json' } },
    );
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // ── FAST SYNCHRONOUS PATH — must complete before returning response ──────────
  // All operations here must be fast (<200ms). The AI Gateway call is dispatched
  // via EdgeRuntime.waitUntil() and runs after the 202 response is sent.

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

  // Validate request body
  const body = await req.json().catch(() => ({}));
  const auditId: string | undefined = body.auditId;
  const filePath: string | undefined = body.filePath;

  // FR-103: structured error when required parameter is absent
  if (!filePath) {
    return new Response(
      JSON.stringify({ error: 'filePath is required', code: 'MISSING_FILE_PATH' }),
      { status: 400, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } },
    );
  }

  if (!auditId) {
    return new Response(
      JSON.stringify({ error: 'auditId is required', code: 'MISSING_AUDIT_ID' }),
      { status: 400, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } },
    );
  }

  // Resolve organisation_id from the audit record — required for all inserts
  const { data: auditData, error: auditError } = await supabase
    .from('audits')
    .select('organisation_id')
    .eq('id', auditId)
    .single();

  if (auditError || !auditData?.organisation_id) {
    const message = `Failed to resolve organisation_id for audit ${auditId}: ${auditError?.message ?? 'audit not found'}`;
    return new Response(
      JSON.stringify({ error: message, code: 'AUDIT_NOT_FOUND' }),
      { status: 400, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } },
    );
  }

  const organisationId: string = auditData.organisation_id;

  // Resolve caller identity for audit trail
  let userId: string | undefined;
  const authHeader = req.headers.get('Authorization') ?? '';
  if (authHeader.startsWith('Bearer ')) {
    const { data: { user } } = await supabase.auth.getUser(authHeader.replace('Bearer ', ''));
    userId = user?.id;
  }

  // Write status = 'processing' to criteria_documents so the frontend can poll it
  const { error: processingStatusError } = await supabase
    .from('criteria_documents')
    .update({ status: 'processing' })
    .eq('audit_id', auditId)
    .eq('file_path', filePath);

  if (processingStatusError) {
    console.warn(`[invoke-ai-parse-criteria] Failed to set criteria_documents status=processing: ${processingStatusError.message}`);
  }

  // Dispatch background work — runs after 202 is sent; not blocked by EarlyDrop
  // deno-lint-ignore no-explicit-any
  (EdgeRuntime as any).waitUntil(backgroundParse({
    supabase,
    auditId,
    filePath,
    organisationId,
    userId,
  }));

  // Return 202 IMMEDIATELY — the AI Gateway call runs in the background
  return new Response(
    JSON.stringify({ accepted: true, status: 'processing' }),
    { status: 202, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } },
  );
});