# Wave 19 — MAT Criteria Parsing Holistic Repair: Implementation Plan Proposal

**Document type**: Wave Plan Proposal (for Issue #2)
**Wave**: Wave 19 (proposed)
**Based on**: `CRITERIA-PARSING-GAP-REGISTER.md` — wave-gov-mat-criteria-repair-1135
**Issue reference (planning)**: maturion-isms#1135
**Author**: foreman-v2-agent v6.2.0 (POLC-Orchestration)
**Date**: 2026-03-17
**Authority**: CS2 (@APGI-cmy) | LIVING_AGENT_SYSTEM.md v6.2.0
**Status**: PROPOSAL — requires CS2 authorization to open Issue #2 and commence implementation

---

## Wave Overview

Wave 19 repairs all 12 gaps identified in `CRITERIA-PARSING-GAP-REGISTER.md`. The pipeline requires:
1. Schema migrations (`criteria.number` → TEXT; MPS `intent_statement`/`guidance` columns; atomic write-back RPC)
   - **Note**: `mini_performance_standards.number` stays INTEGER — only `criteria.number` changes to TEXT (see AD-W19-001)
2. AI Gateway updates (MpsResult model + system prompt)
3. Edge Function updates (use c.number, write MPS intent/guidance, zero-insert assertion, startup validation)
4. UI update (poll timeout)
5. Environment configuration (AI_GATEWAY_URL, SUPABASE_STORAGE_URL)
6. QA RED suite (16 tests, all RED before implementation begins)

**Prerequisite**: QA-to-Red MUST be completed before any builder receives an implementation task.

---

## Prerequisites (Before Wave 19 Can Begin)

| Pre-ID | Prerequisite | Owner | Status |
|--------|-------------|-------|--------|
| PRE-W19-001 | CS2 authorizes Issue #2 (wave-start authorization) | CS2 | ⏳ PENDING |
| PRE-W19-002 | QA RED suite T-W19-001 through T-W19-016 defined and failing (RED) | qa-builder | ⏳ PENDING |
| PRE-W19-003 | Architecture frozen for Wave 19 (schema changes confirmed) | Foreman / CS2 | ⏳ PENDING |
| PRE-W19-004 | IAA Pre-Brief for Wave 19 committed | IAA + Foreman | ⏳ PENDING |

---

## Task Breakdown by Builder Agent

### Batch A — QA-to-Red (MUST COMPLETE FIRST, before any implementation)

**Delegated to**: `qa-builder`

| Task ID | Description | Gap(s) | Test IDs |
|---------|-------------|--------|----------|
| T-W19A-001 | Write RED test: criteria.number TEXT type assertion | GAP-PARSE-001 | T-W19-002 |
| T-W19A-002 | Write RED test: upload LDCS, assert criteria.number = '1.4.1' format | GAP-PARSE-001, GAP-PARSE-012 | T-W19-001, T-W19-015 |
| T-W19A-003 | Write RED test: MPS intent_statement column exists | GAP-PARSE-002 | T-W19-003 |
| T-W19A-004 | Write RED test: parse LDCS, assert ≥1 MPS intent_statement non-null | GAP-PARSE-002, GAP-PARSE-008 | T-W19-004, T-W19-012 |
| T-W19A-005 | Write RED test: audit_logs has criteria_parsed row after parse | GAP-PARSE-003 | T-W19-005, T-W19-006 |
| T-W19A-006 | Write RED test: zero-insert → criteria_parse_failed | GAP-PARSE-004 | T-W19-007 |
| T-W19A-007 | Write RED test: criteria INSERT fail → domains/MPS rolled back (atomicity) | GAP-PARSE-005 | T-W19-008 |
| T-W19A-008 | Write RED test: Edge Function startup validation (AI_GATEWAY_URL='' → 500) | GAP-PARSE-006 | T-W19-010 |
| T-W19A-009 | Write RED test: poll timeout surfaces user error | GAP-PARSE-009 | T-W19-013 |
| T-W19A-010 | Write RED test: AI Gateway startup with SUPABASE_STORAGE_URL='' → ValueError | GAP-PARSE-011 | T-W19-016 |
| T-W19A-011 | Write RED test: CI schema validation (module hooks vs migrations) | GAP-PARSE-007 | T-W19-011 |
| T-W19A-012 | Write RED test: E2E LDCS fixture content assertion | GAP-PARSE-010 | T-W19-014 |

**Acceptance criteria**: All 16 T-W19-NNN tests FAILING (RED). Zero GREEN. Foreman QP verifies test bodies contain real assertions (not stubs).

---

### Batch B — Schema Migrations

**Delegated to**: `schema-builder`

**Depends on**: Batch A complete (RED tests defined)

| Task ID | Description | Migration | Gap(s) | Test IDs |
|---------|-------------|-----------|--------|----------|
| T-W19B-001 | ALTER TABLE criteria: number TYPE TEXT USING number::TEXT | `20260317000001_criteria_number_text.sql` | GAP-PARSE-001 | T-W19-002 |
| T-W19B-002 | ALTER TABLE mini_performance_standards: ADD COLUMN intent_statement TEXT, ADD COLUMN guidance TEXT | `20260317000002_mps_intent_guidance.sql` | GAP-PARSE-002 | T-W19-003 |
| T-W19B-003 | CREATE OR REPLACE FUNCTION parse_write_back_atomic(...) — atomic write-back RPC | `20260317000003_parse_write_back_atomic_rpc.sql` | GAP-PARSE-005 | T-W19-008 |
| T-W19B-004 | RLS policies for new MPS columns (intent_statement, guidance) | Addendum to `20260317000002` | GAP-PARSE-002 | T-W19-003 |

**Acceptance criteria**: T-W19-002, T-W19-003 → GREEN. T-W19-008 → GREEN (after api-builder Batch C). All existing Wave 18 tests remain GREEN.

---

### Batch C — API / Edge Function Updates

**Delegated to**: `api-builder`

**Depends on**: Batch B complete (schema migrations applied)

| Task ID | Description | File | Gap(s) | Test IDs |
|---------|-------------|------|--------|----------|
| T-W19C-001 | Edge Function: Replace `number: idx + 1` with `number: c.number` in criteria upsert | `supabase/functions/invoke-ai-parse-criteria/index.ts` | GAP-PARSE-012 | T-W19-001, T-W19-015 |
| T-W19C-002 | Edge Function: Write MPS intent_statement + guidance to new columns | `supabase/functions/invoke-ai-parse-criteria/index.ts` | GAP-PARSE-002 | T-W19-004 |
| T-W19C-003 | Edge Function: Add zero-insert assertion (fail if all counts = 0) | `supabase/functions/invoke-ai-parse-criteria/index.ts` | GAP-PARSE-004 | T-W19-007 |
| T-W19C-004 | Edge Function: Replace sequential inserts with `supabase.rpc('parse_write_back_atomic', ...)` | `supabase/functions/invoke-ai-parse-criteria/index.ts` | GAP-PARSE-005 | T-W19-008 |
| T-W19C-005 | Edge Function: Add startup validation — return 500 if `AI_GATEWAY_URL` empty | `supabase/functions/invoke-ai-parse-criteria/index.ts` | GAP-PARSE-006 | T-W19-010 |
| T-W19C-006 | AI Gateway: Add `intent_statement: str = ""` + `guidance: str = ""` to MpsResult | `apps/mat-ai-gateway/services/parsing.py` | GAP-PARSE-008 | T-W19-004, T-W19-012 |
| T-W19C-007 | AI Gateway: Update system prompt to extract MPS-level intent_statement + guidance | `apps/mat-ai-gateway/services/parsing.py` | GAP-PARSE-008 | T-W19-012 |
| T-W19C-008 | AI Gateway: Add startup assertion — raise ValueError if SUPABASE_STORAGE_URL empty | `apps/mat-ai-gateway/services/parsing.py` | GAP-PARSE-011 | T-W19-016 |
| T-W19C-009 | Edge Function: Wire MPS number via normaliseMpsNumber for TEXT column | `supabase/functions/invoke-ai-parse-criteria/index.ts` | GAP-PARSE-001 | T-W19-001 |

**Acceptance criteria**: T-W19-001 through T-W19-016 → all GREEN. All existing Wave 18 tests remain GREEN. Zero skipped/stub tests.

---

### Batch D — UI Update

**Delegated to**: `ui-builder`

**Depends on**: Batch A complete (RED test T-W19-013 exists)

| Task ID | Description | File | Gap(s) | Test IDs |
|---------|-------------|------|--------|----------|
| T-W19D-001 | usePollCriteriaDocumentStatus: Add poll timeout (30 min / 600 iterations) with user-visible error message | `modules/mat/frontend/src/lib/hooks/useCriteria.ts` | GAP-PARSE-009 | T-W19-013 |

**Acceptance criteria**: T-W19-013 → GREEN. All existing criteria hook tests remain GREEN.

---

### Batch E — Integration / Environment Configuration

**Delegated to**: `integration-builder`

**Depends on**: Batches B, C complete

| Task ID | Description | Gap(s) | Test IDs |
|---------|-------------|--------|----------|
| T-W19E-001 | Configure `AI_GATEWAY_URL` in Supabase project Edge Function secrets (Vercel deployment) | GAP-PARSE-006 | T-W19-009 |
| T-W19E-002 | Configure `SUPABASE_STORAGE_URL` in Render AI Gateway environment | GAP-PARSE-011 | T-W19-016 |
| T-W19E-003 | Update `.env.example` with all required env vars (AI_GATEWAY_URL, SUPABASE_STORAGE_URL) | GAP-PARSE-006, GAP-PARSE-011 | N/A |
| T-W19E-004 | Add CI schema validation check: modules/mat hook columns vs migrations | GAP-PARSE-007 | T-W19-011 |

**Acceptance criteria**: T-W19-005, T-W19-006, T-W19-009 → GREEN in staging environment. `.env.example` complete. CI schema diff check passing.

---

### Batch F — E2E Validation

**Delegated to**: `qa-builder` (second pass) + `mat-specialist` (LDCS fixture)

**Depends on**: All batches A–E complete

| Task ID | Description | Gap(s) | Test IDs |
|---------|-------------|--------|----------|
| T-W19F-001 | Create LDCS test fixture (known document → known expected output) | GAP-PARSE-010 | T-W19-014 |
| T-W19F-002 | E2E test: upload LDCS fixture → assert criteria count, hierarchy, number format | GAP-PARSE-010 | T-W19-014, T-W19-015 |
| T-W19F-003 | E2E test: staging environment — full pipeline smoke test | GAP-PARSE-003 | T-W19-005, T-W19-006 |

**Acceptance criteria**: All 16 T-W19-NNN tests GREEN. Zero failures. Zero skipped/stub tests.

---

## Risk Register

| Risk ID | Risk | Probability | Impact | Mitigation |
|---------|------|------------|--------|-----------|
| R-W19-001 | `criteria.number TYPE TEXT` migration breaks existing UI sort/display logic | MEDIUM | HIGH | Audit all usages of criteria.number in frontend; add sort_order column if needed |
| R-W19-002 | Atomic write-back RPC introduces performance regression for large LDCS documents (26 MPS, 180+ criteria) | LOW | MEDIUM | Load test RPC with LDCS fixture before wave close |
| R-W19-003 | AI Gateway system prompt update changes extraction quality for non-LDCS documents | MEDIUM | MEDIUM | Add non-regression test suite for generic document parsing |
| R-W19-004 | `AI_GATEWAY_URL` configuration requires Supabase project admin access (CS2 or ops gate) | HIGH | MEDIUM | Coordinate with CS2; document exact Supabase Dashboard path |
| R-W19-005 | Signed URL TTL (30 min) may expire for very large LDCS documents before AI Gateway processes them | LOW | HIGH | Add monitoring; consider increasing TTL or using service-role download |

---

## Architecture Decisions Required Before Wave 19

| Decision | Options | Recommendation |
|----------|---------|----------------|
| AD-W19-001: criteria.number type | Keep INTEGER (current) / Change to TEXT | **Change to TEXT** — LDCS criteria identifiers are hierarchical strings like "1.4.1" that cannot be stored as INTEGER. The Edge Function currently uses `idx+1` as a workaround (see GAP-PARSE-012). Migration: `ALTER TABLE criteria ALTER COLUMN number TYPE TEXT`. **Note: `mini_performance_standards.number` remains INTEGER** — LDCS MPS numbers are simple integers (1–26) and the existing `normaliseMpsNumber()` function correctly handles variants like "MPS 6" → 6. No MPS number column type change is required. |
| AD-W19-002: Atomic write-back approach | (a) Supabase RPC (recommended) / (b) Postgres function / (c) Application-level retry | **Supabase RPC** — single call, single transaction, compatible with Edge Function Deno runtime |
| AD-W19-003: Poll timeout duration | 15 min / 30 min / 60 min / configurable | **30 min** — matches AI Gateway TR-009 (< 60s expected) with generous buffer for large documents |

---

## Merge Gate Requirements for Wave 19

All of the following must be confirmed before Wave 19 merge gate is released:

- [ ] All 16 T-W19-NNN tests GREEN
- [ ] All pre-existing Wave 18 tests GREEN (no regression)
- [ ] Zero skipped, stub, or TODO tests
- [ ] Zero linter warnings
- [ ] PREHANDOVER proof present and complete
- [ ] IAA ASSURANCE-TOKEN obtained
- [ ] SCOPE_DECLARATION.md matches diff
- [ ] `AI_GATEWAY_URL` configured in Supabase secrets (staging)
- [ ] E2E smoke test passing on staging environment

---

*Authority: CS2 (@APGI-cmy) | LIVING_AGENT_SYSTEM.md v6.2.0 | foreman-v2-agent v6.2.0*
*Issue: maturion-isms#1135 | Wave: wave-gov-mat-criteria-repair-1135 | Date: 2026-03-17*
