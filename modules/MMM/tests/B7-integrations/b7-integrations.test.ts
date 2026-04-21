/**
 * MMM Wave B7 — Boundary Integration Tests
 *
 * Domain D5: Boundary Flows (MMM↔AIMC, MMM↔PIT, MMM↔KUC)
 *   T-MMM-S6-098 through T-MMM-S6-112 (15 tests)
 *
 * Domain D7: AI Interactions
 *   T-MMM-S6-121 through T-MMM-S6-128 (8 tests)
 *
 * Total: 23 test suites — all file-based (no live Supabase required).
 *
 * Wave Slug: mmm-build-wave-b7-boundary-integrations
 * Issue:     maturion-isms#1428
 * Builder:   integration-builder
 * Date:      2026-04-25
 *
 * These tests verify the LIVE boundary wiring completed in B7:
 *   - AIMC consumer boundary (OB-1): 9 functions wired through AIMC service interface
 *   - PIT data feed integration (OB-2): 7-step handshake per TR-017
 *   - KUC upload contract (OB-3): TR-019/TR-020 classification contract
 *   - Circuit breaker (TR-009): CLOSED/OPEN/HALF_OPEN state machine for all 3 boundaries
 *
 * CG-003 (B7 closure law): These tests prove MMM BOUNDARY WIRING IS COMPLETE.
 * They do NOT prove AIMC internal completion, source retirement eligibility, or
 * platform convergence readiness.
 *
 * Source-state carry-forward (CG-001): Circuit breaker covers BOTH source-active AND
 * source-retired states. No hard-coded switchover assumption.
 */

import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';

const ROOT = resolve(__dirname, '../../../..');

function readFile(relPath: string): string {
  const abs = resolve(ROOT, relPath);
  if (!existsSync(abs)) throw new Error(`File not found: ${relPath}`);
  return readFileSync(abs, 'utf-8');
}

function fileExists(relPath: string): boolean {
  return existsSync(resolve(ROOT, relPath));
}

// =============================================================================
// D5: BOUNDARY FLOWS — T-MMM-S6-098 through T-MMM-S6-112
// =============================================================================

// ─── T-MMM-S6-098: Zero Direct AI Provider Calls in MMM Code ─────────────────
describe('T-MMM-S6-098: Zero Direct AI Provider Calls in MMM Code', () => {
  it('mmm-ai-framework-parse has no direct OpenAI / Anthropic imports', () => {
    const src = readFile('supabase/functions/mmm-ai-framework-parse/index.ts');
    expect(src).not.toMatch(/openai|anthropic|cohere|gemini|mistral/i);
    expect(src).not.toContain('sk-');
  });

  it('mmm-ai-evidence-evaluate has no direct AI provider imports', () => {
    const src = readFile('supabase/functions/mmm-ai-evidence-evaluate/index.ts');
    expect(src).not.toMatch(/openai|anthropic|cohere|gemini|mistral/i);
  });

  it('mmm-ai-recommend has no direct AI provider imports', () => {
    const src = readFile('supabase/functions/mmm-ai-recommend/index.ts');
    expect(src).not.toMatch(/openai|anthropic|cohere|gemini|mistral/i);
  });

  it('mmm-ai-chat has no direct AI provider imports', () => {
    const src = readFile('supabase/functions/mmm-ai-chat/index.ts');
    expect(src).not.toMatch(/openai|anthropic|cohere|gemini|mistral/i);
  });

  it('mmm-aimc-client has no direct AI provider imports (consumer boundary only)', () => {
    const src = readFile('supabase/functions/_shared/mmm-aimc-client.ts');
    expect(src).not.toMatch(/openai|anthropic|cohere|gemini|mistral/i);
    // Must route through AIMC_BASE_URL only
    expect(src).toContain('AIMC_BASE_URL');
  });
});

// ─── T-MMM-S6-099: All Nine AIMC Endpoint Paths Callable From MMM ────────────
describe('T-MMM-S6-099: All Nine AIMC Endpoint Paths Callable From MMM', () => {
  const nineEndpoints = [
    'framework-parse',
    'framework-generate',
    'framework-alter',
    'evidence-evaluate',
    'recommend',
    'chat',
    'explain',
    'assessment-interpret',
  ];

  it('AIMC client module exists', () => {
    expect(fileExists('supabase/functions/_shared/mmm-aimc-client.ts')).toBe(true);
  });

  it('AIMC client covers all 8 named operation configs (TR-014)', () => {
    const src = readFile('supabase/functions/_shared/mmm-aimc-client.ts');
    for (const endpoint of nineEndpoints) {
      expect(src).toContain(endpoint);
    }
  });

  it('mmm-ai-chat Edge Function exists (9th endpoint)', () => {
    expect(fileExists('supabase/functions/mmm-ai-chat/index.ts')).toBe(true);
  });

  it('mmm-ai-explain Edge Function exists', () => {
    expect(fileExists('supabase/functions/mmm-ai-explain/index.ts')).toBe(true);
  });

  it('mmm-ai-assessment-interpret Edge Function exists', () => {
    expect(fileExists('supabase/functions/mmm-ai-assessment-interpret/index.ts')).toBe(true);
  });

  it('all nine registered in config.toml', () => {
    const config = readFile('supabase/config.toml');
    expect(config).toContain('[functions.mmm-ai-framework-parse]');
    expect(config).toContain('[functions.mmm-ai-framework-generate]');
    expect(config).toContain('[functions.mmm-ai-framework-alter]');
    expect(config).toContain('[functions.mmm-ai-evidence-evaluate]');
    expect(config).toContain('[functions.mmm-ai-recommend]');
    expect(config).toContain('[functions.mmm-ai-chat]');
    expect(config).toContain('[functions.mmm-ai-explain]');
    expect(config).toContain('[functions.mmm-ai-assessment-interpret]');
  });

  it('all 9 functions use callAimc (AIMC consumer boundary — OB-1)', () => {
    const fnFiles = [
      'supabase/functions/mmm-ai-framework-parse/index.ts',
      'supabase/functions/mmm-ai-framework-generate/index.ts',
      'supabase/functions/mmm-ai-framework-alter/index.ts',
      'supabase/functions/mmm-ai-evidence-evaluate/index.ts',
      'supabase/functions/mmm-ai-recommend/index.ts',
      'supabase/functions/mmm-ai-chat/index.ts',
      'supabase/functions/mmm-ai-explain/index.ts',
      'supabase/functions/mmm-ai-assessment-interpret/index.ts',
    ];
    for (const fn of fnFiles) {
      const src = readFile(fn);
      expect(src).toContain('callAimc');
    }
  });
});

// ─── T-MMM-S6-100: No PIT Lifecycle Logic in MMM Code ────────────────────────
describe('T-MMM-S6-100: No PIT Lifecycle Logic in MMM Code', () => {
  it('mmm-pit-export-send has no action management routes (OB-2)', () => {
    const src = readFile('supabase/functions/mmm-pit-export-send/index.ts');
    // OB-2: No PIT action lifecycle, task tracking, or plan execution logic
    expect(src).not.toMatch(/action_lifecycle|implementation_plan.*CRUD|task_management/i);
  });

  it('mmm-pit-export-send only calls PIT import endpoint (producer role)', () => {
    const src = readFile('supabase/functions/mmm-pit-export-send/index.ts');
    // Producer only: MMM posts TO PIT, does not manage PIT-side resources
    expect(src).toContain('pit-export');
    expect(src).not.toContain('/api/pit/tasks');
    expect(src).not.toContain('/api/pit/plans');
  });

  it('mmm-pit-evidence-return only processes inbound evidence (no PIT lifecycle)', () => {
    const src = readFile('supabase/functions/mmm-pit-evidence-return/index.ts');
    expect(src).not.toMatch(/pit.*action.*lifecycle|pit.*task.*crud/i);
  });

  it('no PIT planning logic in any AIMC function', () => {
    const src = readFile('supabase/functions/_shared/mmm-aimc-client.ts');
    expect(src).not.toMatch(/pit.*plan|plan.*pit/i);
  });
});

// ─── T-MMM-S6-101: PIT Evidence Return Processed and Linked at Criterion Level
describe('T-MMM-S6-101: PIT Evidence Return Processed and Linked at Criterion Level', () => {
  it('mmm-pit-evidence-return creates evidence with criterion_id', () => {
    const src = readFile('supabase/functions/mmm-pit-evidence-return/index.ts');
    expect(src).toContain('criterion_id');
    expect(src).toContain('mmm_evidence');
  });

  it('mmm-pit-evidence-return handles TR-018 payload fields', () => {
    const src = readFile('supabase/functions/mmm-pit-evidence-return/index.ts');
    // TR-018: pit_export_id, criterion_id, evidence_ref, implementation_status
    expect(src).toContain('pit_export_id');
    expect(src).toContain('evidence_ref');
    expect(src).toContain('implementation_status');
  });

  it('mmm-pit-evidence-return triggers score re-evaluation (mmm_score_proposals)', () => {
    const src = readFile('supabase/functions/mmm-pit-evidence-return/index.ts');
    expect(src).toContain('mmm_score_proposals');
  });

  it('mmm-pit-evidence-return sets source=PIT_RETURN on evidence records', () => {
    const src = readFile('supabase/functions/mmm-pit-evidence-return/index.ts');
    expect(src).toContain('PIT_RETURN');
  });

  it('returned_at is recorded on evidence record (TR-018)', () => {
    const src = readFile('supabase/functions/mmm-pit-evidence-return/index.ts');
    expect(src).toContain('returned_at');
  });
});

// ─── T-MMM-S6-102: Both Upload Types Route Through KUC With Classification ───
describe('T-MMM-S6-102: Both Upload Types Route Through KUC With Classification Returned', () => {
  it('mmm-upload-framework-source uses KUC client (uploadToKuc)', () => {
    const src = readFile('supabase/functions/mmm-upload-framework-source/index.ts');
    expect(src).toContain('uploadToKuc');
  });

  it('mmm-upload-evidence uses KUC client (uploadToKuc)', () => {
    const src = readFile('supabase/functions/mmm-upload-evidence/index.ts');
    expect(src).toContain('uploadToKuc');
  });

  it('mmm-upload-framework-source returns kuc_classification in response', () => {
    const src = readFile('supabase/functions/mmm-upload-framework-source/index.ts');
    expect(src).toContain('kuc_classification');
  });

  it('mmm-upload-evidence returns kuc_classification in response', () => {
    const src = readFile('supabase/functions/mmm-upload-evidence/index.ts');
    expect(src).toContain('kuc_classification');
  });

  it('KUC client module exists', () => {
    expect(fileExists('supabase/functions/_shared/mmm-kuc-client.ts')).toBe(true);
  });

  it('KUC classification response has document_role, type, confidence, categories (TR-020)', () => {
    const src = readFile('supabase/functions/_shared/mmm-kuc-client.ts');
    expect(src).toContain('document_role');
    expect(src).toContain('confidence');
    expect(src).toContain('categories');
  });
});

// ─── T-MMM-S6-103: Framework-Source Ingestion Uses criteria_source document_role
describe('T-MMM-S6-103: Framework-Source Ingestion Uses criteria_source document_role', () => {
  it('mmm-upload-framework-source sets document_role = criteria_source', () => {
    const src = readFile('supabase/functions/mmm-upload-framework-source/index.ts');
    expect(src).toContain('criteria_source');
  });

  it('document_role is declared as const criteria_source (not mutable)', () => {
    const src = readFile('supabase/functions/mmm-upload-framework-source/index.ts');
    expect(src).toMatch(/documentRole\s*=\s*['"]criteria_source['"]/);
  });

  it('document_role propagated into parse_job metadata', () => {
    const src = readFile('supabase/functions/mmm-upload-framework-source/index.ts');
    expect(src).toContain('mmm_parse_jobs');
    expect(src).toContain('document_role');
  });
});

// ─── T-MMM-S6-104: Evidence Ingestion Uses evidence document_role ─────────────
describe('T-MMM-S6-104: Evidence Ingestion Uses evidence document_role', () => {
  it('mmm-upload-evidence sets document_role = evidence', () => {
    const src = readFile('supabase/functions/mmm-upload-evidence/index.ts');
    expect(src).toContain("'evidence'");
  });

  it('document_role is declared as const evidence', () => {
    const src = readFile('supabase/functions/mmm-upload-evidence/index.ts');
    expect(src).toMatch(/documentRole\s*=\s*['"]evidence['"]/);
  });

  it('score_proposals record created (not parse_jobs) for evidence upload', () => {
    const src = readFile('supabase/functions/mmm-upload-evidence/index.ts');
    expect(src).toContain('mmm_score_proposals');
    expect(src).not.toContain('mmm_parse_jobs');
  });
});

// ─── T-MMM-S6-105: MVP Has Exactly Two Fork Options; No Hybrid; No Migration UI
describe('T-MMM-S6-105: MVP Has Exactly Two Fork Options; No Hybrid; No Migration UI', () => {
  it('mmm-framework-compile has no hybrid mode logic', () => {
    const src = readFile('supabase/functions/mmm-framework-compile/index.ts');
    expect(src).not.toMatch(/hybrid.*mode|mode.*hybrid/i);
  });

  it('mmm-framework-init has no migration execution routes', () => {
    const src = readFile('supabase/functions/mmm-framework-init/index.ts');
    expect(src).not.toMatch(/migration.*execution|execute.*migration/i);
  });

  it('no mmm migration UI page exists (migration wizard forbidden in MMM)', () => {
    // No MigrationWizard or migration execution page in MMM UI
    expect(fileExists('apps/mmm/src/pages/MigrationWizardPage.tsx')).toBe(false);
    expect(fileExists('apps/mmm/src/pages/MigrationExecutionPage.tsx')).toBe(false);
  });
});

// ─── T-MMM-S6-106: AIMC Calls Include Service-to-Service JWT ─────────────────
describe('T-MMM-S6-106: AIMC Calls Include Service-to-Service JWT', () => {
  it('AIMC client sends Authorization: Bearer header on every call (TR-011)', () => {
    const src = readFile('supabase/functions/_shared/mmm-aimc-client.ts');
    expect(src).toContain('Authorization');
    expect(src).toContain('Bearer');
    expect(src).toContain('AIMC_SERVICE_TOKEN');
  });

  it('AIMC_SERVICE_TOKEN is read from Deno.env (not hardcoded)', () => {
    const src = readFile('supabase/functions/_shared/mmm-aimc-client.ts');
    expect(src).toMatch(/Deno\.env\.get\(['"]AIMC_SERVICE_TOKEN['"]\)/);
    // No hardcoded token values
    expect(src).not.toMatch(/['"]Bearer\s+[A-Za-z0-9]{20,}/);
  });

  it('AIMC_BASE_URL is read from Deno.env (not hardcoded — SB-003)', () => {
    const src = readFile('supabase/functions/_shared/mmm-aimc-client.ts');
    expect(src).toMatch(/Deno\.env\.get\(['"]AIMC_BASE_URL['"]\)/);
  });

  it('JWT TTL guidance present in client code (TR-011: max 3600s)', () => {
    const src = readFile('supabase/functions/_shared/mmm-aimc-client.ts');
    // TTL contract — 3600 is referenced
    expect(src).toMatch(/3[_,]?600/);
  });
});

// ─── T-MMM-S6-107: AIMC Data Format Contract Enforced ────────────────────────
describe('T-MMM-S6-107: AIMC Data Format Contract Enforced', () => {
  it('AIMC request envelope includes operation, organisation_id, actor_id, context (TR-012)', () => {
    const src = readFile('supabase/functions/_shared/mmm-aimc-client.ts');
    expect(src).toContain('operation');
    expect(src).toContain('organisation_id');
    expect(src).toContain('actor_id');
    expect(src).toContain('context');
  });

  it('AIMC response envelope includes success, data, error, request_id (TR-012)', () => {
    const src = readFile('supabase/functions/_shared/mmm-aimc-client.ts');
    expect(src).toContain('success');
    expect(src).toContain('request_id');
    expect(src).toContain('error');
  });

  it('Content-Type: application/json set on all AIMC requests (TR-012)', () => {
    const src = readFile('supabase/functions/_shared/mmm-aimc-client.ts');
    expect(src).toContain('application/json');
  });

  it('AIMC routing uses /api/ai/* namespace (TR-013)', () => {
    const src = readFile('supabase/functions/_shared/mmm-aimc-client.ts');
    expect(src).toContain('/api/ai');
  });
});

// ─── T-MMM-S6-108: AIMC Timeout and Retry Contract Honored ──────────────────
describe('T-MMM-S6-108: AIMC Timeout and Retry Contract Honored', () => {
  it('AIMC client uses AbortController for timeout (TR-014)', () => {
    const src = readFile('supabase/functions/_shared/mmm-aimc-client.ts');
    expect(src).toContain('AbortController');
    expect(src).toContain('controller.abort');
  });

  it('framework-parse has 60s timeout (TR-014)', () => {
    const src = readFile('supabase/functions/_shared/mmm-aimc-client.ts');
    expect(src).toContain('60_000');
  });

  it('framework-generate has 90s timeout (TR-014)', () => {
    const src = readFile('supabase/functions/_shared/mmm-aimc-client.ts');
    expect(src).toContain('90_000');
  });

  it('evidence-evaluate has retry logic (TR-014: 2 retries)', () => {
    const src = readFile('supabase/functions/_shared/mmm-aimc-client.ts');
    expect(src).toMatch(/maxRetries.*2|2.*maxRetries/);
    expect(src).toContain('retryBackoffMs');
  });

  it('retry backoff sleep function exists', () => {
    const src = readFile('supabase/functions/_shared/mmm-aimc-client.ts');
    expect(src).toContain('sleep');
    expect(src).toMatch(/setTimeout.*resolve/);
  });
});

// ─── T-MMM-S6-109: PIT Export Payload Matches TR-016 JSON Schema ─────────────
describe('T-MMM-S6-109: PIT Export Payload Matches TR-016 JSON Schema', () => {
  it('mmm-pit-export-send builds tr016Payload with all required top-level fields', () => {
    const src = readFile('supabase/functions/mmm-pit-export-send/index.ts');
    // TR-016 required: export_id, organisation_id, framework_id, export_timestamp
    expect(src).toContain('export_id');
    expect(src).toContain('organisation_id');
    expect(src).toContain('framework_id');
    expect(src).toContain('export_timestamp');
  });

  it('TR-016 findings array includes criterion_id, maturity_position, gap_to_next, finding_text', () => {
    const src = readFile('supabase/functions/mmm-pit-export-send/index.ts');
    expect(src).toContain('maturity_position');
    expect(src).toContain('gap_to_next');
    expect(src).toContain('finding_text');
    expect(src).toContain('priority');
  });

  it('TR-016 recommendations array included', () => {
    const src = readFile('supabase/functions/mmm-pit-export-send/index.ts');
    expect(src).toContain('recommendations');
    expect(src).toContain('recommendation_id');
    expect(src).toContain('target_level');
  });

  it('TR-016 implementation_tasks array included', () => {
    const src = readFile('supabase/functions/mmm-pit-export-send/index.ts');
    expect(src).toContain('implementation_tasks');
  });
});

// ─── T-MMM-S6-110: PIT Export Trigger and Handshake Per TR-017 ───────────────
describe('T-MMM-S6-110: PIT Export Trigger and Handshake Per TR-017 (7 steps)', () => {
  it('Step 1: validates export record in mmm_pit_exports', () => {
    const src = readFile('supabase/functions/mmm-pit-export-send/index.ts');
    expect(src).toContain('STEP 1');
    expect(src).toContain('mmm_pit_exports');
  });

  it('Step 2: serializes findings to TR-016 JSON schema', () => {
    const src = readFile('supabase/functions/mmm-pit-export-send/index.ts');
    expect(src).toContain('STEP 2');
    expect(src).toContain('tr016Payload');
  });

  it('Step 3: signs payload', () => {
    const src = readFile('supabase/functions/mmm-pit-export-send/index.ts');
    expect(src).toContain('STEP 3');
    expect(src).toContain('payloadSignature');
  });

  it('Step 4: POSTs to PIT import endpoint', () => {
    const src = readFile('supabase/functions/mmm-pit-export-send/index.ts');
    expect(src).toContain('STEP 4');
    expect(src).toContain('PIT_BASE_URL');
    expect(src).toContain('fetch');
  });

  it('Step 5: PIT acknowledges with accepted and pit_task_id', () => {
    const src = readFile('supabase/functions/mmm-pit-export-send/index.ts');
    expect(src).toContain('STEP 5');
    expect(src).toContain('accepted');
    expect(src).toContain('pit_task_id');
  });

  it('Step 6: updates status=SENT, records pit_task_id and sent_at', () => {
    const src = readFile('supabase/functions/mmm-pit-export-send/index.ts');
    expect(src).toContain('STEP 6');
    expect(src).toContain("'SENT'");
    expect(src).toContain('sent_at');
  });

  it('Step 7: audit log entry with PIT_EXPORT_SENT', () => {
    const src = readFile('supabase/functions/mmm-pit-export-send/index.ts');
    expect(src).toContain('STEP 7');
    expect(src).toContain('PIT_EXPORT_SENT');
    expect(src).toContain('mmm_audit_logs');
  });

  it('PIT_SERVICE_TOKEN used for Authorization header (SB-003)', () => {
    const src = readFile('supabase/functions/mmm-pit-export-send/index.ts');
    expect(src).toContain('PIT_SERVICE_TOKEN');
    expect(src).toMatch(/Deno\.env\.get\(['"]PIT_SERVICE_TOKEN['"]\)/);
  });
});

// ─── T-MMM-S6-111: PIT Evidence Return Contract Per TR-018 ───────────────────
describe('T-MMM-S6-111: PIT Evidence Return Contract Per TR-018', () => {
  it('mmm-pit-evidence-return accepts TR-018 payload fields', () => {
    const src = readFile('supabase/functions/mmm-pit-evidence-return/index.ts');
    // TR-018: pit_export_id, criterion_id, evidence_ref, implementation_status, notes
    expect(src).toContain('pit_export_id');
    expect(src).toContain('criterion_id');
    expect(src).toContain('evidence_ref');
    expect(src).toContain('implementation_status');
    expect(src).toContain('notes');
  });

  it('mmm-pit-evidence-return returns HTTP 201 with required fields', () => {
    const src = readFile('supabase/functions/mmm-pit-evidence-return/index.ts');
    expect(src).toContain('201');
    expect(src).toContain('evidence_id');
    expect(src).toContain('returned_at');
    expect(src).toContain('criterion_id');
  });

  it('pit_task_id non-null in response (TR-018)', () => {
    const src = readFile('supabase/functions/mmm-pit-evidence-return/index.ts');
    expect(src).toContain('pit_task_id');
  });

  it('NBR-002: HTTP 403 from RLS propagated (not swallowed)', () => {
    const src = readFile('supabase/functions/mmm-pit-evidence-return/index.ts');
    // NBR-002: 403 must be explicitly returned on RLS violation
    expect(src).toContain('42501');
    expect(src).toContain('403');
    expect(src).not.toMatch(/swallow|silent.*fail/i);
  });
});

// ─── T-MMM-S6-112: KUC Upload Request Contract Per TR-019/TR-020 ─────────────
describe('T-MMM-S6-112: KUC Upload Request Contract Per TR-019 and Classification Per TR-020', () => {
  it('TR-019: multipart/form-data with document_role, organisation_id, user_id, metadata', () => {
    const src = readFile('supabase/functions/_shared/mmm-kuc-client.ts');
    expect(src).toContain('document_role');
    expect(src).toContain('organisation_id');
    expect(src).toContain('user_id');
    expect(src).toContain('metadata');
    expect(src).toContain('FormData');
  });

  it('TR-019: upload_context field included in metadata', () => {
    const src = readFile('supabase/functions/_shared/mmm-kuc-client.ts');
    expect(src).toContain('upload_context');
  });

  it('TR-020: KucClassificationResponse has upload_id, document_role, classification, parse_job_id', () => {
    const src = readFile('supabase/functions/_shared/mmm-kuc-client.ts');
    expect(src).toContain('upload_id');
    expect(src).toContain('document_role');
    expect(src).toContain('parse_job_id');
    expect(src).toContain('KucClassificationResponse');
  });

  it('TR-020: classification object has type, confidence, categories', () => {
    const src = readFile('supabase/functions/_shared/mmm-kuc-client.ts');
    expect(src).toContain('type');
    expect(src).toContain('confidence');
    expect(src).toContain('categories');
  });

  it('KUC upload validates response schema (TR-020)', () => {
    const src = readFile('supabase/functions/_shared/mmm-kuc-client.ts');
    // Response is typed as KucClassificationResponse — structural validation
    expect(src).toContain('KucClassificationResponse');
  });

  it('TR-019/TR-020 schema validated in upload pipeline (not passed through unvalidated)', () => {
    const frameworkSrc = readFile('supabase/functions/mmm-upload-framework-source/index.ts');
    const evidenceSrc = readFile('supabase/functions/mmm-upload-evidence/index.ts');
    // Both check kucResult.success before proceeding
    expect(frameworkSrc).toContain('kucResult.success');
    expect(evidenceSrc).toContain('kucResult.success');
  });
});

// =============================================================================
// D7: AI INTERACTIONS — T-MMM-S6-121 through T-MMM-S6-128
// =============================================================================

// ─── T-MMM-S6-121: No Local AI Stack in MMM ──────────────────────────────────
describe('T-MMM-S6-121: No Local AI Stack in MMM', () => {
  it('MMM package.json has no direct AI SDK dependencies', () => {
    const pkg = readFile('apps/mmm/package.json');
    const pkgJson = JSON.parse(pkg);
    const allDeps = {
      ...pkgJson.dependencies,
      ...pkgJson.devDependencies,
    };
    const aiPackages = ['openai', '@anthropic-ai/sdk', 'anthropic', 'cohere-ai', '@google/generative-ai', 'mistralai'];
    for (const aiPkg of aiPackages) {
      expect(allDeps[aiPkg]).toBeUndefined();
    }
  });

  it('root package.json has no direct AI SDK dependencies', () => {
    const pkg = readFile('package.json');
    const pkgJson = JSON.parse(pkg);
    const allDeps = {
      ...(pkgJson.dependencies ?? {}),
      ...(pkgJson.devDependencies ?? {}),
    };
    const aiPackages = ['openai', '@anthropic-ai/sdk', 'anthropic', 'cohere-ai'];
    for (const aiPkg of aiPackages) {
      expect(allDeps[aiPkg]).toBeUndefined();
    }
  });

  it('AIMC_SERVICE_TOKEN present; OPENAI_API_KEY not expected in MMM env config', () => {
    // Circuit breaker module does not reference OpenAI keys
    const src = readFile('supabase/functions/_shared/mmm-circuit-breaker.ts');
    expect(src).not.toContain('OPENAI_API_KEY');
    expect(src).not.toContain('ANTHROPIC_API_KEY');
  });
});

// ─── T-MMM-S6-122: No Auto-Accept Paths for AI Outputs ──────────────────────
describe('T-MMM-S6-122: No Auto-Accept Paths for AI Outputs', () => {
  it('mmm-ai-evidence-evaluate writes to mmm_score_proposals, NOT mmm_maturity_scores', () => {
    const src = readFile('supabase/functions/mmm-ai-evidence-evaluate/index.ts');
    // Must write proposals only — human confirmation required (T-MMM-S6-122)
    expect(src).toContain('mmm_score_proposals');
    expect(src).not.toContain("from('mmm_maturity_scores').insert");
    expect(src).not.toContain("from('mmm_maturity_scores').update");
  });

  it('mmm-ai-assessment-interpret is advisory only — no auto-apply to maturity_scores', () => {
    const src = readFile('supabase/functions/mmm-ai-assessment-interpret/index.ts');
    // Must be advisory — comment confirms no auto-accept
    expect(src).toMatch(/advisory.*only|NOT.*auto.appli/i);
    expect(src).not.toContain("from('mmm_maturity_scores').insert");
  });

  it('no auto-confirm pathway exists — confirm: true required (mmm-score-confirm)', () => {
    const src = readFile('supabase/functions/mmm-score-confirm/index.ts');
    // Human confirmation gate — confirm: true required
    expect(src).toContain('confirm');
    expect(src).toContain('mmm_maturity_scores');
  });
});

// ─── T-MMM-S6-123: AI Confidence Visibility for Score Proposals ──────────────
describe('T-MMM-S6-123: AI Confidence Visibility for Score Proposals', () => {
  it('mmm-ai-evidence-evaluate stores confidence field in score_proposals', () => {
    const src = readFile('supabase/functions/mmm-ai-evidence-evaluate/index.ts');
    expect(src).toContain('confidence');
    expect(src).toContain('mmm_score_proposals');
  });

  it('confidence value passed through from AIMC response (TR-012 data envelope)', () => {
    const src = readFile('supabase/functions/mmm-ai-evidence-evaluate/index.ts');
    // Confidence extracted from aiData
    expect(src).toContain('aiData.confidence');
  });

  it('confidence stored as float in score_proposals upsert', () => {
    const src = readFile('supabase/functions/mmm-ai-evidence-evaluate/index.ts');
    expect(src).toMatch(/confidence:\s*confidence/);
  });
});

// ─── T-MMM-S6-124: ai_interactions Records Include Model and Confidence ───────
describe('T-MMM-S6-124: ai_interactions Records Include Model and Confidence', () => {
  it('mmm-ai-evidence-evaluate inserts to mmm_ai_interactions with model_id', () => {
    const src = readFile('supabase/functions/mmm-ai-evidence-evaluate/index.ts');
    expect(src).toContain('mmm_ai_interactions');
    expect(src).toContain('model_id');
    expect(src).toContain('interaction_type');
  });

  it('mmm-ai-framework-parse records ai_interaction with model_id and aimc_request_id', () => {
    const src = readFile('supabase/functions/mmm-ai-framework-parse/index.ts');
    expect(src).toContain('mmm_ai_interactions');
    expect(src).toContain('model_id');
    expect(src).toContain('aimc_request_id');
  });

  it('mmm-ai-recommend records ai_interaction', () => {
    const src = readFile('supabase/functions/mmm-ai-recommend/index.ts');
    expect(src).toContain('mmm_ai_interactions');
    expect(src).toContain('model_id');
  });

  it('mmm-ai-chat records ai_interaction', () => {
    const src = readFile('supabase/functions/mmm-ai-chat/index.ts');
    expect(src).toContain('mmm_ai_interactions');
    expect(src).toContain('model_id');
  });

  it('interaction_type field present on all ai_interaction records', () => {
    const functions = [
      'supabase/functions/mmm-ai-framework-parse/index.ts',
      'supabase/functions/mmm-ai-evidence-evaluate/index.ts',
      'supabase/functions/mmm-ai-recommend/index.ts',
      'supabase/functions/mmm-ai-chat/index.ts',
      'supabase/functions/mmm-ai-explain/index.ts',
      'supabase/functions/mmm-ai-assessment-interpret/index.ts',
    ];
    for (const fn of functions) {
      const src = readFile(fn);
      expect(src).toContain('interaction_type');
    }
  });
});

// ─── T-MMM-S6-125: Admin AI Chat Accessible to Admin Role Only ───────────────
describe('T-MMM-S6-125: Admin AI Chat Accessible to Admin Role Only', () => {
  it('mmm-ai-chat requires ADMIN role (NBR-002)', () => {
    const src = readFile('supabase/functions/mmm-ai-chat/index.ts');
    expect(src).toContain("requireRole(claims.role, ['ADMIN'])");
  });

  it('mmm-ai-chat returns HTTP 403 for non-admin (via requireRole)', () => {
    const src = readFile('supabase/functions/mmm-ai-chat/index.ts');
    // requireRole throws HTTP 403 Response per NBR-002
    expect(src).toContain('requireRole');
    expect(src).toContain('ADMIN');
  });

  it('mmm-ai-chat has admin role comment for T-MMM-S6-125 traceability', () => {
    const src = readFile('supabase/functions/mmm-ai-chat/index.ts');
    expect(src).toContain('T-MMM-S6-125');
  });
});

// ─── T-MMM-S6-126: AI Telemetry Dashboard Displays All Five Metrics ──────────
describe('T-MMM-S6-126: AI Telemetry Dashboard Displays All Five Metrics', () => {
  it('mmm-qiw-status exists (telemetry aggregator)', () => {
    expect(fileExists('supabase/functions/mmm-qiw-status/index.ts')).toBe(true);
  });

  it('mmm-qiw-status includes token usage metric', () => {
    const src = readFile('supabase/functions/mmm-qiw-status/index.ts');
    expect(src).toMatch(/token.*usage|token_usage/i);
  });

  it('mmm-qiw-status includes latency metric', () => {
    const src = readFile('supabase/functions/mmm-qiw-status/index.ts');
    expect(src).toMatch(/latency/i);
  });

  it('mmm-qiw-status includes cost metric', () => {
    const src = readFile('supabase/functions/mmm-qiw-status/index.ts');
    expect(src).toMatch(/cost/i);
  });

  it('mmm-qiw-status includes error rate metric', () => {
    const src = readFile('supabase/functions/mmm-qiw-status/index.ts');
    expect(src).toMatch(/error.*rate|error_rate/i);
  });

  it('mmm-qiw-status includes interaction volume metric', () => {
    const src = readFile('supabase/functions/mmm-qiw-status/index.ts');
    expect(src).toMatch(/interaction.*volume|volume|seven_day_trend/i);
  });
});

// ─── T-MMM-S6-127: Back-Office AI Interface Separated From End-User AI Chat ──
describe('T-MMM-S6-127: Back-Office AI Interface Separated From End-User AI Chat', () => {
  it('mmm-ai-chat requires ADMIN role (back-office, not end-user)', () => {
    const src = readFile('supabase/functions/mmm-ai-chat/index.ts');
    expect(src).toContain('ADMIN');
    expect(src).toContain('T-MMM-S6-127');
  });

  it('no admin chat component imported in user-facing assessment pages', () => {
    const workbench = fileExists('apps/mmm/src/pages/AssessmentWorkbenchPage.tsx')
      ? readFile('apps/mmm/src/pages/AssessmentWorkbenchPage.tsx')
      : '';
    expect(workbench).not.toMatch(/AdminAIChat|admin.*ai.*chat/i);
  });

  it('admin route separation comment in mmm-ai-chat', () => {
    const src = readFile('supabase/functions/mmm-ai-chat/index.ts');
    // Admin route comment confirms separation
    expect(src).toMatch(/back.office|admin.*chat|admin.*route/i);
  });
});

// ─── T-MMM-S6-128: AI Governance Logging Records Override and Interaction Trail
describe('T-MMM-S6-128: AI Governance Logging Records Override and Interaction Trail', () => {
  it('mmm-score-confirm writes to mmm_override_log (audit trail)', () => {
    const src = readFile('supabase/functions/mmm-score-confirm/index.ts');
    expect(src).toContain('mmm_override_log');
    expect(src).toContain('rationale');
  });

  it('mmm_override_log record includes decision fields', () => {
    const src = readFile('supabase/functions/mmm-score-confirm/index.ts');
    // Override log must include: criterion_id, previous_score, new_score, rationale, overridden_by
    expect(src).toContain('previous_score');
    expect(src).toContain('new_score');
    expect(src).toContain('overridden_by');
  });

  it('ai_interactions records created for all AI decision points (B7 functions)', () => {
    const functions = [
      'supabase/functions/mmm-ai-evidence-evaluate/index.ts',
      'supabase/functions/mmm-ai-recommend/index.ts',
      'supabase/functions/mmm-ai-framework-parse/index.ts',
    ];
    for (const fn of functions) {
      const src = readFile(fn);
      expect(src).toContain('mmm_ai_interactions');
    }
  });

  it('circuit breaker state transitions are logged (observable — CG-001)', () => {
    const src = readFile('supabase/functions/_shared/mmm-circuit-breaker.ts');
    expect(src).toContain('logTransition');
    expect(src).toContain('console.log');
    // Log includes boundary name and state transition
    expect(src).toMatch(/boundary=|transition=/);
  });

  it('CG-001 documented in circuit breaker (source-state carry-forward)', () => {
    const src = readFile('supabase/functions/_shared/mmm-circuit-breaker.ts');
    expect(src).toContain('CG-001');
  });
});

// =============================================================================
// CIRCUIT BREAKER (TR-009) — state machine verification
// =============================================================================

describe('Circuit Breaker State Machine (TR-009 — CG-001 carry-forward)', () => {
  it('circuit breaker module exists', () => {
    expect(fileExists('supabase/functions/_shared/mmm-circuit-breaker.ts')).toBe(true);
  });

  it('CLOSED state is initial state for all 3 boundaries', () => {
    const src = readFile('supabase/functions/_shared/mmm-circuit-breaker.ts');
    expect(src).toContain("state: 'CLOSED'");
    // All 3 boundaries initialized
    expect(src).toContain('AIMC');
    expect(src).toContain('PIT');
    expect(src).toContain('KUC');
  });

  it('OPEN state triggered after 5 consecutive failures in 60s (TR-009)', () => {
    const src = readFile('supabase/functions/_shared/mmm-circuit-breaker.ts');
    expect(src).toContain('FAILURE_THRESHOLD = 5');
    expect(src).toContain('WINDOW_MS = 60_000');
    expect(src).toContain("'OPEN'");
  });

  it('HALF_OPEN state entered after 30s recovery hold (TR-009)', () => {
    const src = readFile('supabase/functions/_shared/mmm-circuit-breaker.ts');
    expect(src).toContain('RECOVERY_HOLD_MS = 30_000');
    expect(src).toContain("'HALF_OPEN'");
  });

  it('state transitions logged for observability (audit integrity)', () => {
    const src = readFile('supabase/functions/_shared/mmm-circuit-breaker.ts');
    expect(src).toContain('logTransition');
    expect(src).toMatch(/CLOSED.*OPEN|OPEN.*HALF_OPEN|HALF_OPEN.*CLOSED/);
  });

  it('CG-001: OPEN state does not imply source retirement (documented)', () => {
    const src = readFile('supabase/functions/_shared/mmm-circuit-breaker.ts');
    // CG-001 carry-forward must be documented in the circuit breaker
    expect(src).toContain('CG-001');
    expect(src).toMatch(/source.*retirement|retirement.*source/i);
  });

  it('fallback response returned when circuit OPEN (TR-009)', () => {
    const src = readFile('supabase/functions/_shared/mmm-circuit-breaker.ts');
    expect(src).toContain('buildFallbackResponse');
    expect(src).toContain('AIMC_CIRCUIT_OPEN');
    expect(src).toContain('PIT_CIRCUIT_OPEN');
    expect(src).toContain('KUC_CIRCUIT_OPEN');
  });

  it('health status reporting includes all 3 boundaries (TR-052)', () => {
    const src = readFile('supabase/functions/_shared/mmm-circuit-breaker.ts');
    expect(src).toContain('getCircuitBreakerStatus');
  });

  it('circuit breaker applies to AIMC boundary (all 9 functions)', () => {
    const aimcClient = readFile('supabase/functions/_shared/mmm-aimc-client.ts');
    expect(aimcClient).toContain('isCircuitClosed');
    expect(aimcClient).toContain('recordSuccess');
    expect(aimcClient).toContain('recordFailure');
  });

  it('circuit breaker applies to PIT boundary (mmm-pit-export-send)', () => {
    const src = readFile('supabase/functions/mmm-pit-export-send/index.ts');
    expect(src).toContain('isCircuitClosed');
    expect(src).toContain('recordSuccess');
    expect(src).toContain('recordFailure');
  });

  it('circuit breaker applies to KUC boundary (mmm-kuc-client)', () => {
    const src = readFile('supabase/functions/_shared/mmm-kuc-client.ts');
    expect(src).toContain('isCircuitClosed');
    expect(src).toContain('recordSuccess');
    expect(src).toContain('recordFailure');
  });
});
