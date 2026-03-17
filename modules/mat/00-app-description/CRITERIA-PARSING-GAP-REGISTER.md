# MAT Criteria Parsing Pipeline — Holistic Gap Register

**Document type**: Governance Gap Register (Deliverables A1, B1, C1, G1)
**Wave**: wave-gov-mat-criteria-repair-1135
**Issue**: maturion-isms#1135 — [GOV] MAT Criteria Parsing Holistic Repair
**Author**: foreman-v2-agent v6.2.0 (POLC-Orchestration)
**Date**: 2026-03-17
**Authority**: CS2 (@APGI-cmy) | LIVING_AGENT_SYSTEM.md v6.2.0
**Status**: PLANNING ARTIFACT — No implementation in this issue

---

## Executive Summary

End-to-end testing of the MAT Criteria Upload → Parse → Review pipeline against a live LDCS compliance document at https://matfrontend.vercel.app confirmed that the pipeline is entirely non-functional in production. CS2 SQL probes returned zero rows in both `audit_logs` (parse events) and `criteria` (parsed output). This document records 12 identified gaps covering schema, AI Gateway extraction, Edge Function wiring, environment configuration, error handling, and test coverage. It also provides the remediation plan for Issue #2.

### Production Evidence (CS2 SQL probes, 2026-03-17)

```sql
-- Probe 1: No parse audit log events in production
SELECT id, audit_id, action, details, created_at
FROM public.audit_logs
WHERE action IN ('criteria_parsed', 'criteria_parse_failed')
ORDER BY created_at DESC LIMIT 20;
-- Result: Success. No rows returned. (see issue #1135 screenshot)

-- Probe 2: No criteria in production
SELECT audit_id, count(*) as criteria_count
FROM public.criteria
GROUP BY audit_id
ORDER BY count(*) DESC LIMIT 20;
-- Result: Success. No rows returned. (see issue #1135 screenshot)
```

---

## Deliverable A1 — Runtime Chain + "Where It Can Die Silently" Fault Tree

### End-to-End Execution Chain (matfrontend.vercel.app)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ STEP 1: User uploads criteria document                                       │
│  UI: modules/mat/frontend → CriteriaUpload.tsx                               │
│  Hook: useUploadCriteria()                                                   │
│  Action: storage.from('audit-documents').upload(path, file)                  │
│  → Writes: audit_logs(action='criteria_upload', organisation_id, file_path)  │
│  → Writes: criteria_documents(status='pending_parse')                        │
│                                                ↓                             │
│ STEP 2: Frontend triggers AI parsing                                         │
│  Hook: useTriggerAIParsing()                                                 │
│  Action: supabase.functions.invoke('invoke-ai-parse-criteria', body)         │
│  → HTTP POST to Edge Function → HTTP 202 ACCEPTED                            │
│                                                ↓                             │
│ STEP 3: Edge Function background task (async — after 202 returned)          │
│  File: supabase/functions/invoke-ai-parse-criteria/index.ts                  │
│  A. Sign storage URL (30-min TTL)                                            │
│  B. POST to AI Gateway: ${AI_GATEWAY_URL}/api/v1/parse                      │
│  C. Receive ParseResult: { domains, mini_performance_standards, criteria }   │
│  D. Write-back to DB (sequential, NOT transactional):                        │
│     1. DELETE FROM domains WHERE audit_id (cascade)                          │
│     2. INSERT INTO domains                                                   │
│     3. INSERT INTO mini_performance_standards                                │
│     4. INSERT INTO criteria                                                  │
│     5. INSERT INTO domain_level_descriptors (optional, non-fatal)            │
│     6. INSERT INTO mps_level_descriptors (optional, non-fatal)               │
│     7. INSERT INTO criteria_level_descriptors (optional, non-fatal)          │
│  E. INSERT INTO audit_logs(action='criteria_parsed'|'criteria_parse_failed') │
│  F. UPDATE criteria_documents SET status='pending_review'|'parse_failed'    │
│                                                ↓                             │
│ STEP 4: AI Gateway processes the parse request                               │
│  Service: apps/mat-ai-gateway (FastAPI, Render)                              │
│  A. Fetch document from signed Supabase Storage URL                          │
│  B. Extract text (PDF/DOCX/XLSX)                                             │
│  C. Call OpenAI GPT (gpt-4.1 → gpt-5.4 → gpt-5.4-pro on escalation)        │
│  D. Return ParseResponse: { domains[], mini_performance_standards[],         │
│                             criteria[], needs_human_review, confidence_score }│
│                                                ↓                             │
│ STEP 5: Frontend polls for status                                            │
│  Hook: usePollCriteriaDocumentStatus() — refetch every 3s                   │
│  Query: SELECT status FROM criteria_documents WHERE audit_id=? AND file_path=?│
│  Terminal states: 'pending_review' (success), 'parse_failed' (failure)      │
│                                                ↓                             │
│ STEP 6: User reviews parsed structure                                        │
│  Hook: useCriteriaTree() — SELECT domains/MPS/criteria hierarchy             │
│  Approval gate: Lead Auditor approves compiled structure before audit begins │
└─────────────────────────────────────────────────────────────────────────────┘
```

### "Where It Can Die Silently" — Fault Tree

| Failure Point | Silent? | Symptom | Root Cause | Gap ID |
|---------------|---------|---------|------------|--------|
| `AI_GATEWAY_URL` not set → Edge Fn background task throws network error | **YES** | 202 returned, criteria_documents stays 'processing' forever | `Deno.env.get('AI_GATEWAY_URL') ?? ''` → empty string → fetch fails with TypeError | GAP-PARSE-006 |
| `AI_GATEWAY_URL` set but AI Gateway unreachable (Render cold start/crash) | **YES** | 202 returned, status stays 'processing' → polling never terminates | Background task catches error, writes `criteria_parse_failed`, but only if the catch block runs | GAP-PARSE-009 |
| `SUPABASE_STORAGE_URL` not set in Render → SSRF mitigation blocks signed URL fetch | **YES** | AI Gateway returns 403/SSRF error; Edge Fn writes parse_failed | `SUPABASE_STORAGE_URL=''` → URL validation fails | GAP-PARSE-011 |
| Signed URL expires (30 min) before background task reaches AI Gateway call | **YES** | AI Gateway fetch returns 403 Expired; Edge Fn writes parse_failed | Long queue time on AI Gateway exceeds signed URL TTL | None (future gap) |
| `criteria.number` is INTEGER → criteria INSERT fails for LDCS IDs like "1.4.1" | **YES** | criteria INSERT throws; catch block writes `criteria_parse_failed`; 0 criteria in DB | Type mismatch: Edge Fn uses idx+1 to avoid crash but LDCS IDs lost | GAP-PARSE-001 / GAP-PARSE-012 |
| `mini_performance_standards` missing `intent_statement`/`guidance` columns | **YES** | MPS INSERT silently drops these fields (not in INSERT); LDCS MPS intent/guidance lost | Schema not aligned with LDCS document reality | GAP-PARSE-002 |
| Partial DB write: domains inserted, criteria INSERT fails → orphaned domains | **YES** | No audit_log write on partial failure; domains table has rows, criteria table empty | No DB transaction; catch block only triggers if exception propagates | GAP-PARSE-005 |
| AI returns 0 criteria (e.g., empty document, wrong language) | **PARTIAL** | `criteria_parsed` written with `criteria_inserted: 0`; UI shows "0 criteria" with no error | No minimum-count assertion before declaring success | GAP-PARSE-004 |
| `usePollCriteriaDocumentStatus` — `criteria_documents` row never created | **YES** | Polling returns `{ status: 'pending_parse' }` indefinitely; no timeout | PGRST116 error returns default value, poll continues forever | GAP-PARSE-009 |
| `criteria_documents.status` stuck at 'processing' (background task exception before status update) | **YES** | UI polls forever; no user-visible error | Background task exception before final status write | GAP-PARSE-009 |

---

## Deliverable B1 — Field Mapping Matrix

### Source Document → AI Output → Edge Function → DB → UI Rendering

| Source Element | AI Output Field | AI Model | Edge Function Mapping | DB Column | DB Table | UI Rendering |
|---------------|-----------------|----------|-----------------------|-----------|----------|--------------|
| Domain name | `DomainResult.name` | GPT-4.1+ | `d.name` | `domains.name` | `public.domains` | Criteria tree — domain node |
| Domain (sort order) | `DomainResult.sort_order` | GPT-4.1+ | `idx + 1` | `domains.sort_order` (missing wave context) | `public.domains` | N/A (sort) |
| Domain maturity descriptors L1-L5 | `DomainResult.level_descriptors[]` | GPT-4.1+ | Written to descriptor table | `domain_level_descriptors.descriptor_text` | `public.domain_level_descriptors` | Level descriptor cards |
| MPS name | `MpsResult.name` | GPT-4.1+ | `m.name` | `mini_performance_standards.name` | `public.mini_performance_standards` | Criteria tree — MPS node |
| MPS number (hierarchical) | `MpsResult.number` (string) | GPT-4.1+ | `normaliseMpsNumber(m.number)` → INTEGER | `mini_performance_standards.number` (INTEGER) | `public.mini_performance_standards` | Criteria tree |
| **MPS intent statement** | **MISSING — MpsResult has no intent_statement field** | — | **NOT EXTRACTED** | **MISSING COLUMN** | `public.mini_performance_standards` | **NOT RENDERED** |
| **MPS guidance** | **MISSING — MpsResult has no guidance field** | — | **NOT EXTRACTED** | **MISSING COLUMN** | `public.mini_performance_standards` | **NOT RENDERED** |
| MPS maturity descriptors L1-L5 | `MpsResult.level_descriptors[]` | GPT-4.1+ | Written to descriptor table | `mps_level_descriptors.descriptor_text` | `public.mps_level_descriptors` | Level descriptor cards |
| Criteria hierarchical ID (e.g., "1.4.1") | `CriterionResult.number` (string) | GPT-4.1+ | **`idx + 1` (DISCARDS original)** | `criteria.number` (INTEGER) | `public.criteria` | Criteria tree |
| Criteria title | `CriterionResult.title` | GPT-4.1+ | `c.title` | `criteria.title` | `public.criteria` | Criteria card |
| Criteria description (verbatim) | `CriterionResult.description` | GPT-4.1+ | `c.description` | `criteria.description` | `public.criteria` | Criteria card |
| Criteria intent statement | `CriterionResult.intent_statement` | GPT-4.1+ | `c.intent_statement` (Wave 18) | `criteria.intent_statement` | `public.criteria` | Criteria card (Wave 18) |
| Criteria guidance | `CriterionResult.guidance` | GPT-4.1+ | `c.guidance` (Wave 18 fix) | `criteria.guidance` | `public.criteria` | Criteria card |
| Criteria source anchor | `CriterionResult.source_anchor` | GPT-4.1+ | `c.source_anchor` (Wave 18) | `criteria.source_anchor` | `public.criteria` | Criteria card (traceability) |
| Criteria maturity descriptors L1-L5 | `CriterionResult.maturity_descriptors[]` | GPT-4.1+ | Written to descriptor table | `criteria_level_descriptors.descriptor_text` | `public.criteria_level_descriptors` | Level descriptor cards |

### Gap Summary for Field Mapping

| Gap | Affected Mapping | Impact |
|-----|-----------------|--------|
| GAP-PARSE-001/012 | Criteria number: "1.4.1" → discarded → `idx+1` stored | LDCS hierarchical structure entirely lost; cannot trace criteria back to document |
| GAP-PARSE-002 | MPS intent/guidance: not extracted, not stored | LDCS MPS-level context lost; compliance assessment missing key content |
| GAP-PARSE-008 | `MpsResult` has no `intent_statement`/`guidance` fields | AI does not even attempt to extract MPS intent/guidance |

---

## Deliverable C1 — "Silent Fade" Root Cause List

| RC-ID | Root Cause | Evidence | Affected Gap(s) | Required Fix | Owner Agent Class |
|-------|------------|----------|-----------------|--------------|-------------------|
| RC-001 | `AI_GATEWAY_URL` environment variable not configured in Supabase Edge Function secrets | SQL probe: 0 audit_log rows; `Deno.env.get('AI_GATEWAY_URL') ?? ''` → empty string; fetch throws TypeError | GAP-PARSE-003, GAP-PARSE-006 | Configure `AI_GATEWAY_URL` secret in Supabase project settings for production Edge Function | integration-builder (Ops config) |
| RC-002 | `criteria.number` column type is INTEGER — cannot store LDCS hierarchical IDs ("1.4.1", "2.7.5") | CS2 SQL evidence: `public.criteria.number is integer NOT NULL`; migration 20260302000000 uses `INTEGER NOT NULL` | GAP-PARSE-001, GAP-PARSE-012 | Migration: `ALTER TABLE criteria ALTER COLUMN number TYPE TEXT USING number::TEXT` | schema-builder |
| RC-003 | Edge Function discards `CriterionResult.number` (LDCS ID) and substitutes `idx + 1` | Code: `number: idx + 1` in criteria upsert loop | GAP-PARSE-012 | Edge Function: Use `c.number` directly (after migration RC-002 converts column to TEXT) | api-builder |
| RC-004 | `mini_performance_standards` table has no `intent_statement` or `guidance` columns | CS2 SQL evidence: schema inspection confirms missing columns | GAP-PARSE-002 | Migration: `ALTER TABLE mini_performance_standards ADD COLUMN intent_statement TEXT, ADD COLUMN guidance TEXT` | schema-builder |
| RC-005 | `MpsResult` Pydantic model does not include `intent_statement` or `guidance` fields | Code: `parsing.py` MpsResult class; AI system prompt does not ask for MPS intent/guidance | GAP-PARSE-008 | (1) Update AI system prompt to extract MPS intent/guidance; (2) Add `intent_statement`/`guidance` to MpsResult; (3) Edge Function write MPS intent/guidance to new columns | api-builder |
| RC-006 | DB write-back uses sequential INSERT statements with no wrapping SQL transaction | Code: `index.ts` background task steps 1–7 have no BEGIN/COMMIT; descriptors use try/catch | GAP-PARSE-005 | Wrap domain + MPS + criteria inserts in a single Postgres RPC (or use `supabase.rpc('parse_write_back_atomic', {...})`) | schema-builder + api-builder |
| RC-007 | No minimum-count assertion before declaring success — pipeline can "succeed" with 0 inserts | Code: `if (result.status === 'completed')` → writes `criteria_parsed` regardless of insert counts | GAP-PARSE-004 | Add assertion: `if (domainsInserted === 0 && mpsInserted === 0 && criteriaInserted === 0) throw new Error('Zero inserts — treating as failure')` | api-builder |
| RC-008 | `usePollCriteriaDocumentStatus` has no maximum poll count or timeout — polls forever | Code: `refetchInterval: 3000` with no `refetchIntervalInBackground` limit or timeout | GAP-PARSE-009 | Add poll timeout (e.g., 30 minutes max, ~600 iterations); on timeout, surface error to user | ui-builder |
| RC-009 | `SUPABASE_STORAGE_URL` may not be configured in Render production environment | Code: AI Gateway `parsing.py`: `SUPABASE_STORAGE_URL = os.environ.get("SUPABASE_STORAGE_URL", "").rstrip("/")` — empty string disables SSRF mitigation guard | GAP-PARSE-011 | Verify `SUPABASE_STORAGE_URL` is set in Render dashboard; add startup validation that raises if empty | api-builder |
| RC-010 | No end-to-end content assertion tests — QA tests verify schema existence not field values | Code: wave 15/18 tests check column existence and function invocation, not actual extracted content | GAP-PARSE-010 | Add E2E content assertion tests: upload real LDCS document, assert extracted criteria count ≥ expected, assert `number` format matches LDCS hierarchy | qa-builder |
| RC-011 | Environment variable naming drift: `AI_GATEWAY_URL` (Edge Fn) vs `VITE_API_BASE_URL` (Frontend) vs undocumented Render vars | Code: multiple env var names across components; `.env.example` incomplete | GAP-PARSE-006 | Document canonical env var list for each deployment target; add startup validation in Edge Function and AI Gateway | integration-builder |
| RC-012 | Legacy MAT implementation (`apps/maturion-maturity-legacy/`) and new MAT (`modules/mat/`) coexist; schema alignment unverified across both | Codebase survey: two paths; only legacy has migration files | GAP-PARSE-007 | Run schema diff to confirm alignment; add CI check asserting no schema drift between implementations | schema-builder |

---

## Deliverable G1 — Governance Gap Register

### GAP-PARSE-001: criteria.number INTEGER Cannot Represent LDCS Hierarchical IDs

| Field | Value |
|-------|-------|
| **Gap ID** | GAP-PARSE-001 |
| **Severity** | 🔴 CRITICAL |
| **Symptom** | LDCS criteria identifiers like "1.4.1", "2.7.5" are stored as sequential integers (1, 2, 3, ...) — the original document structure is entirely lost |
| **Root Cause** | `public.criteria.number` is defined as `INTEGER NOT NULL` (migration 20260302000000). The Edge Function uses `idx + 1` (sequential counter) instead of the AI-extracted `c.number` to avoid an INSERT type error. |
| **Evidence** | CS2 SQL probe: `public.criteria.number is integer NOT NULL`; Edge Function code: `number: idx + 1`; LDCS document: criteria numbered "1.4.1" through "5.26.7" |
| **Required Fix** | Schema migration: `ALTER TABLE public.criteria ALTER COLUMN number TYPE TEXT USING number::TEXT`; Edge Function update: use `c.number` directly |
| **Owner Agent Class** | schema-builder (migration) + api-builder (Edge Function update) |
| **Acceptance Tests** | T-W19-001: Upload LDCS document; assert criteria.number = '1.4.1' (not 1); T-W19-002: Assert criteria.number is TEXT in schema |
| **Risk Severity** | CRITICAL — without this fix, no LDCS compliance traceability is possible |
| **FRS Reference** | FR-005, FR-007 (traceability) |
| **TRS Reference** | TR-037 (source anchors) |

---

### GAP-PARSE-002: mini_performance_standards Missing intent_statement + guidance Columns

| Field | Value |
|-------|-------|
| **Gap ID** | GAP-PARSE-002 |
| **Severity** | 🔴 CRITICAL |
| **Symptom** | LDCS documents contain MPS-level Intent statements and Guidance that define the purpose and compliance expectation for each MPS. These are never extracted, never stored, and never shown in the UI. |
| **Root Cause** | (1) `public.mini_performance_standards` has no `intent_statement` or `guidance` columns; (2) `MpsResult` Pydantic model has no `intent_statement`/`guidance` fields; (3) AI system prompt does not ask for MPS-level intent/guidance extraction |
| **Evidence** | CS2 SQL evidence: schema inspection confirms missing columns; AI Gateway `parsing.py` MpsResult definition; LDCS document structure requires MPS-level intent |
| **Required Fix** | (1) Migration: `ALTER TABLE mini_performance_standards ADD COLUMN intent_statement TEXT, ADD COLUMN guidance TEXT`; (2) Update `MpsResult` to include these fields; (3) Update AI system prompt; (4) Edge Function writes to new columns |
| **Owner Agent Class** | schema-builder (migration) + api-builder (AI Gateway + Edge Function) |
| **Acceptance Tests** | T-W19-003: Assert `mini_performance_standards.intent_statement` column exists; T-W19-004: Upload LDCS document; assert MPS intent_statement is non-null for at least 1 MPS |
| **Risk Severity** | CRITICAL — LDCS compliance requires preserving MPS-level Intent and Guidance |
| **FRS Reference** | FR-005 |
| **TRS Reference** | TR-037 |

---

### GAP-PARSE-003: No audit_logs Parse Events in Production (0 Rows Confirmed)

| Field | Value |
|-------|-------|
| **Gap ID** | GAP-PARSE-003 |
| **Severity** | 🔴 CRITICAL |
| **Symptom** | SQL probe against production returns 0 rows for `audit_logs WHERE action IN ('criteria_parsed','criteria_parse_failed')` — the parsing pipeline has never successfully completed in production |
| **Root Cause** | Compound failure: (a) `AI_GATEWAY_URL` not configured (GAP-PARSE-006) causes background task to fail with TypeError before reaching the audit_logs write step; (b) criteria.number type mismatch (GAP-PARSE-001) would cause INSERT failure even if AI Gateway were reachable |
| **Evidence** | CS2 SQL probe screenshot in issue #1135; both audit_log and criteria queries return 0 rows |
| **Required Fix** | Fix GAP-PARSE-006 (configure AI_GATEWAY_URL) and GAP-PARSE-001 (criteria.number type); add E2E smoke test that verifies audit_log row creation after parse |
| **Owner Agent Class** | integration-builder (env config) + schema-builder + api-builder |
| **Acceptance Tests** | T-W19-005: Upload LDCS document in staging; assert audit_logs has ≥1 row with action='criteria_parsed'; T-W19-006: Assert criteria count > 0 after parse |
| **Risk Severity** | CRITICAL — pipeline entirely non-functional in production |
| **FRS Reference** | FR-005 (acceptance criteria 7–14) |
| **TRS Reference** | TR-037 |

---

### GAP-PARSE-004: Silent Success — Pipeline Can Complete with 0 Inserts

| Field | Value |
|-------|-------|
| **Gap ID** | GAP-PARSE-004 |
| **Severity** | 🟠 HIGH |
| **Symptom** | If the AI returns an empty or near-empty parse result (0 domains, 0 MPS, 0 criteria), the Edge Function still writes `action='criteria_parsed'` with outcome='success' and `criteria_inserted: 0`. The user sees no error. |
| **Root Cause** | No minimum-count assertion exists before writing audit_logs. `if (result.status === 'completed')` is true even when all count fields are 0. |
| **Evidence** | Edge Function code: no assertion between parse result receipt and audit_log write |
| **Required Fix** | Add pre-write assertion: if all counts (domains, mps, criteria) are 0 → treat as failure, write `criteria_parse_failed` with appropriate error message |
| **Owner Agent Class** | api-builder |
| **Acceptance Tests** | T-W19-007: Mock AI Gateway returning status='completed' with empty arrays; assert audit_logs gets action='criteria_parse_failed' with error detail 'zero_inserts' |
| **Risk Severity** | HIGH — false success misleads user; LDCS gap audits may be silently incomplete |
| **FRS Reference** | FR-005, FR-103 |
| **TRS Reference** | TR-037 |

---

### GAP-PARSE-005: No DB Transaction — Partial Writes on Failure

| Field | Value |
|-------|-------|
| **Gap ID** | GAP-PARSE-005 |
| **Severity** | 🟠 HIGH |
| **Symptom** | If the Edge Function successfully inserts domains and MPS but then fails on criteria INSERT, the DB is left in a partially-written state: orphaned domain/MPS rows with no associated criteria |
| **Root Cause** | DB write-back uses 7 sequential INSERT statements with no wrapping SQL transaction. The CASCADE DELETE on retry clears stale data, but if the new insert fails mid-way, no rollback occurs. |
| **Evidence** | Edge Function code: no BEGIN/COMMIT transaction wrapping; each insert is a separate `supabase.from().upsert()` call |
| **Required Fix** | Implement atomic write-back via Supabase RPC: `supabase.rpc('parse_write_back_atomic', { audit_id, domains, mps, criteria, descriptors })` — single transaction in Postgres |
| **Owner Agent Class** | schema-builder (RPC function) + api-builder (Edge Function update) |
| **Acceptance Tests** | T-W19-008: Mock criteria INSERT to fail; assert domains/MPS also rolled back; assert audit_logs gets criteria_parse_failed |
| **Risk Severity** | HIGH — data integrity risk; corrupted criteria tree in production |
| **FRS Reference** | FR-005 |
| **TRS Reference** | TR-037 |

---

### GAP-PARSE-006: AI_GATEWAY_URL Not Configured in Supabase Edge Function Secrets

| Field | Value |
|-------|-------|
| **Gap ID** | GAP-PARSE-006 |
| **Severity** | 🔴 CRITICAL |
| **Symptom** | `AI_GATEWAY_URL` is not set in Supabase project's Edge Function secrets. `Deno.env.get('AI_GATEWAY_URL') ?? ''` returns empty string. The background parse task calls `fetch('') ` which throws `TypeError: Invalid URL` immediately, before any DB writes. |
| **Root Cause** | Environment variable not configured in Supabase project settings (Edge Function Secrets). CI/CD deployment workflow does not assert or verify this secret exists. |
| **Evidence** | INC-WAVE15-PARSE-001 (status: OPEN in BUILD_PROGRESS_TRACKER); CS2 SQL probe showing 0 audit_log rows; codebase survey confirming `Deno.env.get('AI_GATEWAY_URL') ?? ''` |
| **Required Fix** | (1) Configure `AI_GATEWAY_URL` in Supabase project Edge Function secrets pointing to deployed Render service; (2) Add startup validation in Edge Function: if `!AI_GATEWAY_URL` → return 500 immediately (fail fast, don't accept 202); (3) Add CI health check test |
| **Owner Agent Class** | integration-builder (configuration) + api-builder (startup validation) |
| **Acceptance Tests** | T-W19-009: Edge Function health check with AI_GATEWAY_URL set; assert /health returns 200; T-W19-010: Edge Function with AI_GATEWAY_URL empty; assert 500 returned (not 202) |
| **Risk Severity** | CRITICAL — root cause of complete pipeline non-functionality |
| **FRS Reference** | FR-005 (acceptance criteria 7) |
| **TRS Reference** | TR-037 |

---

### GAP-PARSE-007: Legacy Overlap — Two MAT Implementations, Schema Alignment Risk

| Field | Value |
|-------|-------|
| **Gap ID** | GAP-PARSE-007 |
| **Severity** | 🟡 MEDIUM |
| **Symptom** | Two MAT implementations coexist: `apps/maturion-maturity-legacy/` (has migration files) and `modules/mat/` (active implementation). Schema alignment is unverified across both. |
| **Root Cause** | Historical architectural split: legacy implementation has supabase/migrations; new implementation relies on legacy migrations applied to the same Supabase project |
| **Evidence** | Codebase survey: `apps/maturion-maturity-legacy/supabase/migrations/` contains 11 migration files; `modules/mat/` has no `/supabase/migrations/` directory |
| **Required Fix** | (1) Confirm `modules/mat/` reads from the same Supabase project as `apps/maturion-maturity-legacy/`; (2) Add CI schema diff check: assert `modules/mat/` expected schema matches deployed schema from legacy migrations; (3) Document which implementation is authoritative |
| **Owner Agent Class** | schema-builder + integration-builder |
| **Acceptance Tests** | T-W19-011: CI schema validation — assert all tables referenced in `modules/mat/frontend/src/lib/hooks/` exist in legacy migration output |
| **Risk Severity** | MEDIUM — monitoring; schema appears aligned per Wave 18 but unverified |
| **FRS Reference** | FR-005 |
| **TRS Reference** | TR-037 |

---

### GAP-PARSE-008: AI Gateway MpsResult Missing intent_statement + guidance Fields

| Field | Value |
|-------|-------|
| **Gap ID** | GAP-PARSE-008 |
| **Severity** | 🟠 HIGH |
| **Symptom** | The AI system prompt does not ask the AI model to extract MPS-level Intent or Guidance. `MpsResult` Pydantic model has no `intent_statement` or `guidance` fields. Even after schema fix (GAP-PARSE-002), the AI will not extract this content. |
| **Root Cause** | Gap in AI extraction scope definition. The system prompt was designed for criteria-level extraction only; MPS was treated as structural (name + number) rather than as a content node. |
| **Evidence** | `parsing.py` MpsResult class definition; AI system prompt (no MPS intent/guidance extraction instruction) |
| **Required Fix** | (1) Update AI system prompt to explicitly request MPS-level `intent_statement` and `guidance` extraction from LDCS document; (2) Add `intent_statement: str = ""` and `guidance: str = ""` to MpsResult Pydantic model; (3) Edge Function writes these to new DB columns (GAP-PARSE-002) |
| **Owner Agent Class** | api-builder (AI Gateway + Edge Function) |
| **Acceptance Tests** | T-W19-012: Parse LDCS document; assert MPS result has non-empty `intent_statement` for at least 3 of 26 MPS |
| **Risk Severity** | HIGH — LDCS compliance context incomplete without MPS-level intent/guidance |
| **FRS Reference** | FR-005 |
| **TRS Reference** | TR-037 |

---

### GAP-PARSE-009: usePollCriteriaDocumentStatus Polls Forever on Silent Background Task Failure

| Field | Value |
|-------|-------|
| **Gap ID** | GAP-PARSE-009 |
| **Severity** | 🟠 HIGH |
| **Symptom** | If the Edge Function background task fails silently (before writing a terminal status), `criteria_documents.status` stays 'processing' indefinitely. `usePollCriteriaDocumentStatus` polls every 3 seconds with no timeout — UI is stuck in perpetual loading state. |
| **Root Cause** | `refetchInterval: 3000` has no maximum iteration count or wall-clock timeout. PGRST116 (row not found) returns default `{ status: 'pending_parse' }` rather than surfacing an error. |
| **Evidence** | Hook code: `refetchInterval: 3000` with no limit; background task exception paths may not always write terminal status |
| **Required Fix** | Add poll timeout: after N attempts (e.g., 600 × 3s = 30 minutes) or after a configurable timeout, surface error to user: "Parsing is taking longer than expected. Please try again." |
| **Owner Agent Class** | ui-builder |
| **Acceptance Tests** | T-W19-013: Mock criteria_documents returning 'processing' indefinitely; assert poll stops after timeout and surfaces user-visible error message |
| **Risk Severity** | HIGH — UX degradation; users cannot escape infinite loading state |
| **FRS Reference** | FR-005, FR-103 |
| **TRS Reference** | TR-037 |

---

### GAP-PARSE-010: No End-to-End Content Assertions in QA Tests (S-034)

| Field | Value |
|-------|-------|
| **Gap ID** | GAP-PARSE-010 |
| **Severity** | 🟡 MEDIUM |
| **Symptom** | Current QA tests verify schema existence, function invocation, and column definitions. No test validates that a real LDCS document upload produces the correct extracted field values (criteria count, domain names, MPS numbers, hierarchy structure). |
| **Root Cause** | S-034 improvement suggestion (registered Wave 18): "QA tests for Edge Function write-back and AI parsing MUST assert actual extracted content values." Tests exercise partial pipeline paths only. |
| **Evidence** | Wave 15/18 test files; S-034 registered in FAIL-ONLY-ONCE.md v3.9.0 |
| **Required Fix** | Add E2E content assertion test suite: upload real/mocked LDCS document through full pipeline; assert (a) criteria count ≥ expected LDCS criteria count, (b) domains.number is sequential, (c) criteria.number is TEXT matching LDCS format, (d) audit_logs has criteria_parsed row |
| **Owner Agent Class** | qa-builder |
| **Acceptance Tests** | T-W19-014: E2E pipeline test with known LDCS fixture; assert criteria count = expected; T-W19-015: Assert criteria.number format matches /^\d+\.\d+(\.\d+)?$/ |
| **Risk Severity** | MEDIUM — test gaps enabled Wave 18 production failures to go undetected |
| **FRS Reference** | FR-005, FR-007 |
| **TRS Reference** | TR-037 |

---

### GAP-PARSE-011: SUPABASE_STORAGE_URL Not Verified in Render Production

| Field | Value |
|-------|-------|
| **Gap ID** | GAP-PARSE-011 |
| **Severity** | 🟠 HIGH |
| **Symptom** | AI Gateway uses `SUPABASE_STORAGE_URL` as part of SSRF mitigation (validates that signed URL host matches expected Supabase storage host). If this env var is empty, the validation allows any URL — or depending on implementation, may block the fetch entirely. |
| **Root Cause** | `SUPABASE_STORAGE_URL = os.environ.get("SUPABASE_STORAGE_URL", "").rstrip("/")` defaults to empty string. Render environment configuration not verified for this variable. `.env.example` does not document this variable. |
| **Evidence** | `parsing.py` env var list; `.env.example` missing `SUPABASE_STORAGE_URL` entry; SSRF validation code in AI Gateway |
| **Required Fix** | (1) Add `SUPABASE_STORAGE_URL` to `.env.example` with documentation; (2) Add startup assertion in AI Gateway: raise if empty; (3) Configure in Render dashboard; (4) Add to CI liveness test |
| **Owner Agent Class** | api-builder (startup validation) + integration-builder (env config) |
| **Acceptance Tests** | T-W19-016: AI Gateway startup with `SUPABASE_STORAGE_URL=''`; assert service raises ValueError or refuses to start |
| **Risk Severity** | HIGH — SSRF vulnerability if empty; parse failure if validation incorrectly rejects valid URL |
| **FRS Reference** | FR-005 |
| **TRS Reference** | TR-037 |

---

### GAP-PARSE-012: Edge Function Number Mapping Discards LDCS Criteria IDs

| Field | Value |
|-------|-------|
| **Gap ID** | GAP-PARSE-012 |
| **Severity** | 🔴 CRITICAL |
| **Symptom** | The Edge Function uses `idx + 1` (sequential counter) as `criteria.number`, completely discarding the AI-extracted `c.number` (LDCS hierarchical ID like "1.4.1"). This was a workaround for the INTEGER type constraint. |
| **Root Cause** | `criteria.number` is INTEGER; `c.number` (from AI) is a string like "1.4.1". Rather than surfacing a type error, the Edge Function quietly substitutes `idx + 1`. This workaround persists from pre-Wave-18 and is never flagged as a failure. |
| **Evidence** | Edge Function code: `number: idx + 1` in criteria upsert; `CriterionResult.number` is `str` in AI Gateway |
| **Required Fix** | After schema migration (GAP-PARSE-001): change Edge Function to `number: c.number` |
| **Owner Agent Class** | api-builder (depends on schema-builder completing GAP-PARSE-001 migration) |
| **Acceptance Tests** | T-W19-001 (same as GAP-PARSE-001): Upload LDCS; assert criteria.number = '1.4.1' (not 1) |
| **Risk Severity** | CRITICAL — loss of LDCS traceability; compliance evidence cannot be mapped back to document |
| **FRS Reference** | FR-005, FR-007 |
| **TRS Reference** | TR-037 |

---

## Required QA RED Suite Additions (Issue #2 Prerequisite)

The following test IDs must be implemented as RED (failing) tests BEFORE any implementation begins in Issue #2:

| Test ID | Description | Validates | Owner |
|---------|-------------|-----------|-------|
| T-W19-001 | Upload LDCS document; assert `criteria.number` = '1.4.1' format in DB | GAP-PARSE-001, GAP-PARSE-012 | qa-builder |
| T-W19-002 | Assert `criteria.number` column is TEXT (not INTEGER) in schema | GAP-PARSE-001 | qa-builder |
| T-W19-003 | Assert `mini_performance_standards.intent_statement` column exists | GAP-PARSE-002 | qa-builder |
| T-W19-004 | Parse LDCS; assert ≥1 MPS has non-null `intent_statement` | GAP-PARSE-002, GAP-PARSE-008 | qa-builder |
| T-W19-005 | Post-parse: assert `audit_logs` has ≥1 `criteria_parsed` row | GAP-PARSE-003 | qa-builder |
| T-W19-006 | Post-parse: assert `criteria` count > 0 | GAP-PARSE-003 | qa-builder |
| T-W19-007 | Mock AI: 0 results → assert `criteria_parse_failed` (not `criteria_parsed`) | GAP-PARSE-004 | qa-builder |
| T-W19-008 | Criteria INSERT fails → assert domains/MPS rolled back (atomicity) | GAP-PARSE-005 | qa-builder |
| T-W19-009 | Edge Function with `AI_GATEWAY_URL` configured → assert `/health` 200 | GAP-PARSE-006 | qa-builder |
| T-W19-010 | Edge Function with `AI_GATEWAY_URL=''` → assert 500 (not 202) | GAP-PARSE-006 | qa-builder |
| T-W19-011 | CI schema validation: all `modules/mat/` hook columns exist in migrations | GAP-PARSE-007 | qa-builder |
| T-W19-012 | Parse LDCS; assert ≥3 MPS have non-empty `intent_statement` | GAP-PARSE-008 | qa-builder |
| T-W19-013 | Poll with 'processing' status stuck → assert poll timeout + user error | GAP-PARSE-009 | qa-builder |
| T-W19-014 | E2E LDCS fixture: assert criteria count = expected; assert structure hierarchy | GAP-PARSE-010 | qa-builder |
| T-W19-015 | Assert `criteria.number` matches `/^\d+\.\d+(\.\d+)?$/` format | GAP-PARSE-010, GAP-PARSE-012 | qa-builder |
| T-W19-016 | AI Gateway with `SUPABASE_STORAGE_URL=''` → assert ValueError on startup | GAP-PARSE-011 | qa-builder |

---

## Wave Plan Proposal (for Issue #2)

See `WAVE-19-PLAN-PROPOSAL.md` in this same directory for the full implementation wave plan.

---

*Authority: CS2 (@APGI-cmy) | LIVING_AGENT_SYSTEM.md v6.2.0 | foreman-v2-agent v6.2.0*
*Issue: maturion-isms#1135 | Wave: wave-gov-mat-criteria-repair-1135 | Date: 2026-03-17*
