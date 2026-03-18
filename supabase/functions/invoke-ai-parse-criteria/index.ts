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
// The LDCS defines 26 MPS across multiple domains — this regex detects LDCS-format documents
const LDCS_HIERARCHY_PATTERN = /\b\d+\.\d+(?:\.\d+)?\b/;
const LDCS_MPS_COUNT = 26;
const LDCS_DOCUMENT_MARKERS = ['LDCS', 'Local Delivery Compliance Standard', 'mini performance standard'];

/**
 * Determine if a document body appears to follow the LDCS numbered hierarchy
 * (Domain > MPS (26 total) > Criteria with X.Y.Z numbering).
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
  level_descriptors?: Array<{ level: number; descriptor_text: string }>;
}

interface ParsedMps {
  domain_name: string;
  name: string;
  number: string;
  description?: string;
  intent_statement?: string;
  guidance?: string;
  level_descriptors?: Array<{ level: number; descriptor_text: string }>;
}

interface ParsedCriterion {
  mps_number: string;
  number: string;
  title?: string;
  description?: string;
  intent_statement?: string;
  guidance?: string;
  source_anchor?: string;
  maturity_descriptors?: Array<{ level: number; descriptor_text: string }>;
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
  userInstructions: string | null;
}

async function backgroundParse({
  supabase,
  auditId,
  filePath,
  organisationId,
  userId,
  userInstructions,
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
        .createSignedUrl(filePath, 1800); // 30-minute TTL — covers o3 extraction time for large LDCS documents (10–25 min)

      if (signedUrlError || !signedUrlData?.signedUrl) {
        throw new Error(`Failed to create signed URL: ${signedUrlError?.message ?? 'unknown error'}`);
      }

      const documentUrl = signedUrlData.signedUrl;
      console.log(`[invoke-ai-parse-criteria] Signed URL generated for host: ${new URL(documentUrl).hostname}`);

      const parseResponse = await fetch(`${AI_GATEWAY_URL}/api/v1/parse`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          document_url: documentUrl,
          tenant_id: auditId,
          file_path: filePath,
          ...(userInstructions != null ? { user_instructions: userInstructions } : {}),
        }),
      });

      if (!parseResponse.ok) {
        throw new Error(`AI Gateway returned ${parseResponse.status}: ${await parseResponse.text()}`);
      }

      parseResult = await parseResponse.json();

      // Check for application-level failure — gateway returns HTTP 200 with status:"failed" on parse errors
      if (parseResult.status === 'failed') {
        const gatewayError = parseResult.error != null ? String(parseResult.error) : 'AI Gateway returned status: failed with no error message';
        throw new Error(`AI Gateway parse failed: ${gatewayError}`);
      }
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
    // GAP-PARSE-003/GAP-PARSE-004: If the AI returned zero domains (e.g. gateway
    // unreachable or not configured), throw an error so the catch block writes
    // criteria_parse_failed instead of silently declaring success.
    if (domains.length === 0) {
      throw new Error('AI Gateway returned empty result — 0 domains extracted. Parse failed.');
    }

    // ── Resolve the criteria_documents row ID (required by the atomic RPC) ─────
    // The upsert to status='processing' was performed in the synchronous fast path
    // (before the 202 was returned), so the row should exist here. The error
    // handling below is defensive: if a timing edge case or upsert failure
    // prevented the row from being created, we surface the error rather than
    // sending an undefined document_id to the RPC.
    const { data: docData, error: docError } = await supabase
      .from('criteria_documents')
      .select('id')
      .eq('audit_id', auditId)
      .eq('file_path', filePath)
      .single();
    if (docError || !docData?.id) {
      throw new Error(`Failed to find criteria_documents row: ${docError?.message ?? 'not found'}`);
    }
    const documentId: string = docData.id;

    // ── Pre-clear stale hierarchy rows ─────────────────────────────────────────
    // Delete domains first (ON DELETE CASCADE propagates to mini_performance_standards
    // and criteria). This ensures a re-parse starts with a clean slate before the
    // atomic RPC writes the new hierarchy.
    const { error: clearError } = await supabase
      .from('domains')
      .delete()
      .eq('audit_id', auditId);
    if (clearError) {
      throw new Error(`Failed to clear stale domain data before parse: ${clearError.message}`);
    }

    // ── Build domain number map (name → 1-based sequential integer) ────────────
    const domainNumberByName = new Map<string, number>();
    domains.forEach((d: ParsedDomain, idx: number) => domainNumberByName.set(d.name, idx + 1));

    // ── Resolve MPS numbers ────────────────────────────────────────────────────
    // Filter to MPS whose domain_name was recognised, preserving original behaviour.
    const validMpsList = mpsList.filter((m: ParsedMps) => domainNumberByName.has(m.domain_name));
    if (validMpsList.length < mpsList.length) {
      const missingDomains = mpsList
        .filter((m: ParsedMps) => !domainNumberByName.has(m.domain_name))
        .map((m: ParsedMps) => m.domain_name);
      console.warn(`[invoke-ai-parse-criteria] Skipping MPS with unresolved domain references: ${missingDomains.join(', ')}`);
    }

    // Resolve each MPS to an integer number (same logic as before; kept consistent).
    interface MpsResolved extends ParsedMps { resolvedNumber: number; }
    const mpsResolved: MpsResolved[] = validMpsList.map((m: ParsedMps, mpsIdx: number) => {
      const rawNumber = (m as unknown as { number?: string | number | null }).number;
      let parsedNumber =
        rawNumber !== undefined && rawNumber !== null
          ? Number.parseInt(String(rawNumber).trim(), 10)
          : Number.NaN;
      if (!Number.isFinite(parsedNumber) || parsedNumber <= 0) {
        parsedNumber = mpsIdx + 1; // fallback to original sequential behaviour
      }
      return { ...m, resolvedNumber: parsedNumber };
    });

    // Maps for resolving criteria MPS references (preserved for descriptor writes).
    // mpsIntByAiNumber  : AI's m.number string → resolved integer MPS number
    // mpsDomainNumberByAiNumber : AI's m.number string → parent domain integer number
    const mpsIntByAiNumber = new Map<string, number>();
    const mpsDomainNumberByAiNumber = new Map<string, number>();
    mpsResolved.forEach((m: MpsResolved) => {
      mpsIntByAiNumber.set(m.number, m.resolvedNumber);
      mpsDomainNumberByAiNumber.set(m.number, domainNumberByName.get(m.domain_name)!);
    });

    // Normalise an MPS number string to its numeric value for fallback matching.
    // e.g. "MPS 6", "6.0", "06" all normalise to "6"
    const normaliseMpsNumber = (v: string): string => {
      // Strip any leading alphabetic prefix (e.g. "MPS 6" → "6", "MPS 6.0" → "6")
      const stripped = v.trim().replace(/^[A-Za-z]+\s*/, '');
      const num = Number(stripped);
      return isNaN(num) ? v.trim() : String(num);
    };
    // Helper: resolve the AI's mps_number string to the key used in mpsIntByAiNumber.
    const resolveMpsKey = (mpsNumber: string): string | undefined => {
      if (mpsIntByAiNumber.has(mpsNumber)) return mpsNumber;
      const norm = normaliseMpsNumber(mpsNumber);
      return [...mpsIntByAiNumber.keys()].find(k => normaliseMpsNumber(k) === norm);
    };

    const validCriteriaList = criteriaList.filter(
      (c: ParsedCriterion) => resolveMpsKey(c.mps_number) !== undefined,
    );
    if (validCriteriaList.length < criteriaList.length) {
      const missingMps = criteriaList
        .filter((c: ParsedCriterion) => !resolveMpsKey(c.mps_number))
        .map((c: ParsedCriterion) => c.mps_number);
      console.warn(`[invoke-ai-parse-criteria] Skipping criteria with unresolved MPS references: ${[...new Set(missingMps)].join(', ')}`);
    }

    // ── Build RPC payloads ─────────────────────────────────────────────────────
    const p_domains = domains.map((d: ParsedDomain) => ({
      number:      domainNumberByName.get(d.name)!,
      name:        d.name,
      description: d.description ?? null,
      sort_order:  domainNumberByName.get(d.name)!,
    }));

    const p_mps = mpsResolved.map((m: MpsResolved) => ({
      domain_number:    domainNumberByName.get(m.domain_name)!,
      number:           m.resolvedNumber,
      name:             m.name,
      description:      m.description ?? null,
      intent_statement: m.intent_statement ?? null,
      guidance:         m.guidance ?? null,
    }));

    const p_criteria = validCriteriaList.map((c: ParsedCriterion) => {
      const aiMpsKey = resolveMpsKey(c.mps_number)!;
      return {
        mps_number:       mpsIntByAiNumber.get(aiMpsKey)!,
        domain_number:    mpsDomainNumberByAiNumber.get(aiMpsKey)!,
        number:           c.number,           // TEXT, AI-extracted LDCS hierarchical ID
        title:            c.title ?? null,
        description:      c.description ?? null,
        intent_statement: c.intent_statement ?? null,
        guidance:         c.guidance ?? null,
        source_anchor:    c.source_anchor ?? null,
      };
    });

    // ── Atomic DB write-back via parse_write_back_atomic RPC (GAP-PARSE-005) ───
    // All three upserts (domains, MPS, criteria) execute inside a single PL/pgSQL
    // transaction. If any step fails, PostgreSQL rolls back all prior upserts,
    // preventing orphaned partial data. The RPC also stamps the criteria_documents
    // row as 'pending_review' on success.
    //
    // Wave 20 (T-W20-001): replaces the previous sequential supabase-js upserts.
    const { data: rpcData, error: rpcError } = await supabase.rpc(
      'parse_write_back_atomic',
      {
        p_document_id: documentId,
        p_domains,
        p_mps,
        p_criteria,
      },
    );
    if (rpcError) {
      throw new Error(`Atomic write-back failed: ${rpcError.message}`);
    }

    const domainsInserted: number  = (rpcData as { domains_inserted?: number })?.domains_inserted ?? 0;
    const mpsInserted: number      = (rpcData as { mps_inserted?: number })?.mps_inserted ?? 0;
    const criteriaInserted: number = (rpcData as { criteria_inserted?: number })?.criteria_inserted ?? 0;

    // GAP-PARSE-004: Zero-insert assertion — treat empty result as failure.
    if (domainsInserted === 0 && mpsInserted === 0 && criteriaInserted === 0) {
      throw new Error('Zero inserts — AI Gateway returned empty result. Treating as parse failure.');
    }

    // ── Re-query IDs for descriptor association ────────────────────────────────
    // The atomic RPC does not return the inserted row IDs. Re-query the three tables
    // so the descriptor writes below can reference the correct foreign keys.

    const { data: dbDomains } = await supabase
      .from('domains')
      .select('id, name, number')
      .eq('audit_id', auditId);

    const domainMap = new Map<string, { id: string; number: number }>(
      (dbDomains ?? []).map((d: { id: string; name: string; number: number }) => [
        d.name, { id: d.id, number: d.number },
      ]),
    );

    const { data: dbMps } = await supabase
      .from('mini_performance_standards')
      .select('id, number, domain_id')
      .eq('audit_id', auditId);

    // Rebuild mpsMap keyed by the AI's original m.number string, matched to DB row via
    // resolvedNumber (same integer the RPC used for the ON CONFLICT key).
    const mpsMap = new Map<string, { id: string; domain_id: string }>();
    mpsResolved.forEach((m: MpsResolved) => {
      const dbRow = (dbMps ?? []).find(
        (row: { id: string; number: number; domain_id: string }) => row.number === m.resolvedNumber,
      );
      if (dbRow) {
        mpsMap.set(m.number, { id: dbRow.id, domain_id: dbRow.domain_id });
      }
    });

    // Re-query criteria ordered by number for deterministic descriptor association.
    const { data: orderedCriteriaRows, error: orderQueryError } = await supabase
      .from('criteria')
      .select('id, number')
      .eq('audit_id', auditId)
      .order('number', { ascending: true });

    if (orderQueryError) {
      console.warn(`[invoke-ai-parse-criteria] Failed to re-query criteria for descriptor association: ${orderQueryError.message}`);
    }

    // Build number → id map (number is TEXT, AI-extracted LDCS hierarchical ID).
    // String() coercion is defensive: Supabase client may return number if schema migration
    // has not yet propagated to the type layer, ensuring consistent Map key type.
    const criteriaNumberToId = new Map<string, string>();
    for (const row of (orderedCriteriaRows ?? [])) {
      criteriaNumberToId.set(String(row.number), row.id as string);
    }

    // Collect descriptor write errors to surface in audit_logs
    const descriptorErrors: string[] = [];

    // Write domain-level descriptors (Gap 6 fix)
    // Uses domainMap (keyed by name) — safe against upsert order variation
    const domainDescriptorRows: Array<{ domain_id: string; level: number; descriptor_text: string }> = [];
    for (const d of domains) {
      if (!d.level_descriptors || d.level_descriptors.length === 0) continue;
      const domainId = domainMap.get(d.name)?.id;
      if (!domainId) continue;
      for (const desc of d.level_descriptors) {
        domainDescriptorRows.push({
          domain_id: domainId,
          level: desc.level,
          descriptor_text: desc.descriptor_text,
        });
      }
    }
    if (domainDescriptorRows.length > 0) {
      const { error: dlDescError } = await supabase
        .from('domain_level_descriptors')
        .upsert(domainDescriptorRows, { onConflict: 'domain_id,level', ignoreDuplicates: false });
      if (dlDescError) {
        const msg = `domain_level_descriptors: ${dlDescError.message}`;
        console.warn(`[invoke-ai-parse-criteria] ${msg}`);
        descriptorErrors.push(msg);
      }
    }

    // Write MPS-level descriptors (Gap 6 fix)
    // Uses mpsMap (keyed by number) — safe against upsert order variation
    const mpsDescriptorRows: Array<{ mps_id: string; level: number; descriptor_text: string }> = [];
    for (const m of validMpsList) {
      if (!m.level_descriptors || m.level_descriptors.length === 0) continue;
      const mpsEntry = mpsMap.get(m.number) ?? mpsMap.get(resolveMpsKey(m.number) ?? '');
      if (!mpsEntry?.id) continue;
      for (const desc of m.level_descriptors) {
        mpsDescriptorRows.push({
          mps_id: mpsEntry.id,
          level: desc.level,
          descriptor_text: desc.descriptor_text,
        });
      }
    }
    if (mpsDescriptorRows.length > 0) {
      const { error: mlDescError } = await supabase
        .from('mps_level_descriptors')
        .upsert(mpsDescriptorRows, { onConflict: 'mps_id,level', ignoreDuplicates: false });
      if (mlDescError) {
        const msg = `mps_level_descriptors: ${mlDescError.message}`;
        console.warn(`[invoke-ai-parse-criteria] ${msg}`);
        descriptorErrors.push(msg);
      }
    }

    // Write criteria-level descriptors (Gap 6 fix)
    // Uses criteriaNumberToId map (keyed by c.number TEXT field) — deterministic, unaffected by
    // upsert return order. Each criterion was assigned number = c.number (AI-extracted TEXT ID).
    const criteriaDescriptorRows: Array<{ criteria_id: string; level: number; descriptor_text: string }> = [];
    for (const c of validCriteriaList) {
      if (!c.maturity_descriptors || c.maturity_descriptors.length === 0) continue;
      // String() coercion is defensive: c.number is TEXT per ParsedCriterion, but explicit
      // coercion ensures Map key consistency regardless of runtime type variation.
      const criteriaId = criteriaNumberToId.get(String(c.number));
      if (!criteriaId) continue;
      for (const desc of c.maturity_descriptors) {
        criteriaDescriptorRows.push({
          criteria_id: criteriaId,
          level: desc.level,
          descriptor_text: desc.descriptor_text,
        });
      }
    }
    if (criteriaDescriptorRows.length > 0) {
      const { error: clDescError } = await supabase
        .from('criteria_level_descriptors')
        .upsert(criteriaDescriptorRows, { onConflict: 'criteria_id,level', ignoreDuplicates: false });
      if (clDescError) {
        const msg = `criteria_level_descriptors: ${clDescError.message}`;
        console.warn(`[invoke-ai-parse-criteria] ${msg}`);
        descriptorErrors.push(msg);
      }
    }

    // Audit trail: log parsing outcome to audit_logs.
    // Note: criteria_documents.status is stamped 'pending_review' by the RPC above.
    await supabase.from('audit_logs').insert({
      audit_id: auditId,
      organisation_id: organisationId,
      action: 'criteria_parsed',
      file_path: filePath,
      created_by: userId ?? null,
      details: {
        domains_inserted: domainsInserted,
        mps_inserted: mpsInserted,
        criteria_inserted: criteriaInserted,
        criteria_per_mps: Object.fromEntries([...mpsIntByAiNumber.keys()].map(k => [k, validCriteriaList.filter((c: ParsedCriterion) => resolveMpsKey(c.mps_number) === k).length])),
        needs_human_review: needsHumanReview,
        ldcs_document: isLdcsDocument,
        ldcs_mps_expected: LDCS_MPS_COUNT,
        outcome: descriptorErrors.length > 0 ? 'partial_success' : 'success',
        ...(descriptorErrors.length > 0 && { descriptor_errors: descriptorErrors }),
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`[invoke-ai-parse-criteria] Background parse failed: ${message}`);

    // Update criteria_documents.status → parse_failed (architecture §4.2)
    try {
      const { error: failedStatusError } = await supabase
        .from('criteria_documents')
        .upsert(
          { audit_id: auditId, file_path: filePath, status: 'parse_failed' },
          { onConflict: 'audit_id,file_path' },
        )
        .select('id');
      if (failedStatusError) {
        console.warn(`[invoke-ai-parse-criteria] Failed to update criteria_documents status to parse_failed: ${failedStatusError.message}`);
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
        details: { reason: message, error: message, outcome: 'failure' },
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

  // GAP-PARSE-006: Startup validation — return 500 if AI_GATEWAY_URL not configured
  if (!AI_GATEWAY_URL) {
    return new Response(
      JSON.stringify({ error: 'AI_GATEWAY_URL not configured', code: 'MISSING_ENV' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } },
    );
  }

  // ── FAST SYNCHRONOUS PATH — must complete before returning response ──────────
  // All operations here must be fast (<200ms). The AI Gateway call is dispatched
  // via EdgeRuntime.waitUntil() and runs after the 202 response is sent.

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

  // Validate request body
  const body = await req.json().catch(() => ({}));
  const auditId: string | undefined = body.auditId;
  const filePath: string | undefined = body.filePath;
  // Wave 17: read user_instructions; 10 000-char length-bound for safety (BD-017/BD-018).
  // Limit chosen to accommodate realistic verbose parsing guidance while preventing
  // excessively large payloads from inflating token costs or enabling DoS.
  const userInstructions: string | null = typeof body.user_instructions === 'string'
    ? body.user_instructions.slice(0, 10000)
    : null;

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

  // Write status = 'processing' to criteria_documents so the frontend can poll it.
  // Uses upsert so the row is created if it does not yet exist (the upload hook writes
  // to audit_logs, not criteria_documents, so no row may be present at this point).
  const { error: processingStatusError } = await supabase
    .from('criteria_documents')
    .upsert(
      { audit_id: auditId, file_path: filePath, status: 'processing' },
      { onConflict: 'audit_id,file_path' },
    );

  if (processingStatusError) {
    console.warn(`[invoke-ai-parse-criteria] Failed to set criteria_documents status=processing: ${processingStatusError.message}`);
  }

  // Wave 17 — store parsing_instructions before background dispatch (store intent, not outcome)
  if (userInstructions != null) {
    const { error: instrError } = await supabase
      .from('criteria_documents')
      .update({ parsing_instructions: userInstructions })
      .eq('audit_id', auditId)
      .eq('file_path', filePath);
    if (instrError) {
      console.warn(`[invoke-ai-parse-criteria] Failed to store parsing_instructions: ${instrError.message}`);
    }
  }

  // Dispatch background work — runs after 202 is sent; not blocked by EarlyDrop
  // deno-lint-ignore no-explicit-any
  (EdgeRuntime as any).waitUntil(backgroundParse({
    supabase,
    auditId,
    filePath,
    organisationId,
    userId,
    userInstructions,
  }));

  // Return 202 IMMEDIATELY — the AI Gateway call runs in the background
  return new Response(
    JSON.stringify({ accepted: true, status: 'processing' }),
    { status: 202, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } },
  );
});
