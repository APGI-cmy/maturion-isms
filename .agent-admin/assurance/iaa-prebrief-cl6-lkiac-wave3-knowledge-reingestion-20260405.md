# IAA Pre-Brief — Wave CL-6: LKIAC Wave 3 — Knowledge Re-ingestion

```yaml
artifact_type: IAA_PRE_BRIEF
wave: CL-6
wave_slug: cl6-lkiac-wave3-knowledge-reingestion-20260405
wave_label: "LKIAC Wave 3 of 6 — Knowledge Re-ingestion"
issue: "maturion-isms#1225"
branch: copilot/cl-6-migrate-knowledge-embeddings
iaa_agent: independent-assurance-agent
iaa_version: 6.2.0
contract_version: 2.3.0
adoption_phase: PHASE_B_BLOCKING
date: "2026-04-05"
cs2_authority: "@APGI-cmy — maturion-isms#1225 opened 2026-04-05"
invocation_mode: PRE_BRIEF
status: COMMITTED
```

---

## 1. Wave Summary

Wave CL-6 is LKIAC Wave 3 of 6. Objective: migrate all knowledge embeddings from the legacy
Supabase project (`dmhlxhatogrrrvuruayv`) into the AIMC `ai_knowledge` table, re-embedding
content using the AIMC vector model (1536-dim, OpenAI-compatible). Validate migration.
Decommission legacy Supabase project after verified row count match.

**Architecture**: FROZEN — migration only. No new AIMC features.

**Entry gates met (per issue #1225)**:
- CL-2 COMPLETE: CP-2 signed off 2026-04-03 (`.agent-admin/checkpoints/cp-2-closure-20260403.md`)
- CL-4 COMPLETE: CP-4 signed off 2026-04-03

---

## 2. Qualifying Tasks

| Task ID | Summary | Delegated Agent | IAA Trigger Category | QUALIFYING? |
|---------|---------|-----------------|---------------------|-------------|
| CL-6-D1 | RED gate test suite — 12 tests (T-CL6-CHUNK-001 through T-CL6-SEMANTIC-001) | `qa-builder` | AAWP_MAT (BUILD_DELIVERABLE) | ✅ YES |
| CL-6-D2 | Migration script + Edge Function wiring | `api-builder` | AAWP_MAT (BUILD_DELIVERABLE) | ✅ YES |
| CL-6-D3 | Schema verification — `ai_knowledge` columns correct before migration | `schema-builder` | AAWP_MAT (BUILD_DELIVERABLE) | ✅ YES |
| CL-6-D4 | Domain tag validation against CL-2-D2 mapping | `mat-specialist` | AAWP_MAT (BUILD_DELIVERABLE) | ✅ YES |

**Non-qualifying tasks**: None declared in scope.

---

## 3. IAA Trigger Categories — Declared

| Category | Applies? | Basis |
|----------|----------|-------|
| `AAWP_MAT` (primary) | ✅ YES — MANDATORY | Migration script, Edge Function, test suite, and schema verification all touch `packages/ai-centre/` and AIMC `ai_knowledge` table — AIMC deliverables per trigger table step 4 |
| `AGENT_CONTRACT` | ❌ NO | No agent contract files (`.github/agents/*.md`) are in scope for this wave |
| `CANON_GOVERNANCE` | ❌ NO | No `governance/canon/` or `CANON_INVENTORY.json` changes in scope |
| `CI_WORKFLOW` | ❌ NO unless any `.github/workflows/` file is added or modified by a delegated agent — must re-classify if workflow files appear in diff |
| `KNOWLEDGE_GOVERNANCE` | ❌ NO — advisory note | CL-6 targets runtime Supabase `ai_knowledge` data migration, not `.agent-workspace/*/knowledge/` agent Tier 2 knowledge files. The trigger does not activate. **However**: if any builder modifies agent Tier 2 knowledge indexes as a side-effect, this category immediately triggers. |
| `AGENT_INTEGRITY` | ❌ NO | No `governance/quality/agent-integrity/` changes in scope |

**Primary applicable overlay**: `BUILD_DELIVERABLE` (AAWP_MAT).

**AMBIGUITY NOTE**: If any CI/workflow files appear in the PR diff, IAA re-classifies as `MIXED` and the `CI_WORKFLOW` overlay activates in addition to `BUILD_DELIVERABLE`. Builders must not touch `.github/workflows/` files unless explicitly authorised by CS2.

---

## 4. FFA Checks IAA Will Run at Handover

All checks below are BLOCKING (PHASE_B_BLOCKING is active). ONE FAIL = REJECTION-PACKAGE.

### 4.1 Core Invariants (CORE-001 through CORE-023)

| Check ID | Check Name | Category | Applies to CL-6? |
|----------|-----------|----------|-----------------|
| CORE-005 | Governance block present in artifacts | ALL | ✅ |
| CORE-006 | CANON_INVENTORY alignment | ALL | ✅ |
| CORE-007 | No placeholder content in any deliverable (migration script, test files, Edge Function, schema spec) | ALL | ✅ |
| CORE-013 | IAA invocation evidence present | ALL | ✅ |
| CORE-014 | No class exemption claim | ALL | ✅ |
| CORE-015 | Session memory present | ALL | ✅ |
| CORE-016 | IAA token file present at `.agent-admin/assurance/iaa-token-session-NNN-cl6-lkiac-wave3-20260405.md` | ALL | ✅ |
| CORE-017 | No `.github/agents/` modifications by unauthorised agent | ALL | ✅ |
| CORE-018 | Complete evidence artifact sweep (PREHANDOVER, session memory, iaa_audit_token, token file) | ALL | ✅ |
| CORE-019 | IAA token cross-verification | ALL | ✅ — first invocation exception will apply |
| CORE-020 | Zero partial pass rule | ALL | ✅ |
| CORE-021 | Zero-severity-tolerance | ALL | ✅ |
| CORE-023 | Workflow integrity ripple check | ALL | ✅ — applies if migration script or Edge Function is invoked by or affects workflow paths |

> **CORE-001 through CORE-004, CORE-008 through CORE-012, CORE-022**: These are AGENT_CONTRACT-specific checks. They are N/A for this wave unless an agent contract is produced as a side-effect.

### 4.2 BUILD_DELIVERABLE Overlay (BD-000 through BD-017)

| Check ID | Check Name | CL-6-Specific Application |
|----------|-----------|--------------------------|
| BD-000-A | User journey trace: migration flow declared | Migration journey must be declared: "The operator runs the migration script → the script reads all rows from legacy `knowledge_embeddings` → re-embeds via AIMC vector model → inserts into `ai_knowledge` with `approval_status='pending'` → row appears in ARC queue" |
| BD-000-B | Migration journey step-by-step trace | IAA traces: legacy read → embedding generation → AIMC write → ARC queue → row count verification |
| BD-000-C | Edge cases declared | At minimum: duplicate chunk handling (T-CL6-SCR-001), RLS denial for anon (T-CL6-WRITE-002), row count mismatch (T-CL6-ROWCOUNT-001) |
| BD-000-D | Edge cases implemented | All declared edge cases must be handled in migration script and evidenced by passing RED gate tests |
| BD-001 | Full scope delivered | All 12 RED gate tests (T-CL6-CHUNK-001 through T-CL6-SEMANTIC-001) must be present and GREEN; migration script present; Edge Function wired; schema verified; domain tags validated |
| BD-002 | No stub/TODO in production paths | Migration script, Edge Function, and any Supabase function must have zero TODO/stub/placeholder lines |
| BD-003 | One-time build compliance | Migration must run successfully end-to-end in a single deployment without requiring a follow-up fix |
| BD-005 | End-to-end wiring verified | Full chain: legacy Supabase → migration script → AIMC `ai_knowledge` table → ARC review queue. Every link verified in diff or existing code. |
| BD-006 | Writers and readers confirmed | `ai_knowledge` has: confirmed writer (migration INSERT) and confirmed reader (ARC queue reader, semantic search). Both must be evidenced. |
| BD-007 | Auth guards applied end-to-end | RLS restricts INSERT to service-role only (T-CL6-WRITE-002). IAA verifies RLS policy in schema spec or migration. |
| BD-008 | FK and relational integrity | Any FK from `ai_knowledge` to `organisations` or other tables must have application-layer handling declared |
| BD-009 | Cross-component integration fit | Migration output must be compatible with existing ARC queue consumer (CL-4 AIMC Audit Phase A artefacts) |
| BD-010 | No orphaned deliverables | No new schema tables or Edge Functions that are not consumed by the migration pipeline |
| BD-011 | 100% test pass rate | All 12 RED gate tests (T-CL6-CHUNK-001 through T-CL6-SEMANTIC-001) must be GREEN. Evidence: test run output in PREHANDOVER. |
| BD-012 | Zero test debt | No `.skip()`, `.only()`, commented-out tests in the test suite |
| BD-013 | No test dodging | Each test must assert on actual migration behaviour — not vacuous checks |
| BD-015 | RLS policies complete | `ai_knowledge` table: SELECT, INSERT, UPDATE, DELETE policies for each relevant role fully specified and enforced |
| BD-016 | No hardcoded secrets | Legacy project ID (`dmhlxhatogrrrvuruayv`) and any connection strings must NOT appear hardcoded in any source file. Must be injected via environment variable. |
| BD-017 | Input validation present | Migration script must validate source rows before insertion (reject malformed embeddings, invalid dimension, unknown source labels) |

### 4.3 CL-6-Specific FFA Checks (Wave-Domain Checks)

These checks derive from the CL-6 RED gate specification and architecture constraints. They are applied in Phase 3 alongside core and overlay checks with equal blocking weight.

| Check ID | Check Name | Blocking? | Specification Source |
|----------|-----------|-----------|---------------------|
| CL6-FFA-001 | Pipeline 1 isolation confirmed | ✅ BLOCKING | T-CL6-PIPE-001: migration must NOT touch `criteria_documents` table or `ai_knowledge` rows with `source='criteria'`. Row counts for Pipeline 1 tables must be unchanged before/after migration run. PREHANDOVER must include explicit confirmation. |
| CL6-FFA-002 | Legacy row count ≥ threshold (T-CL6-ROWCOUNT-001) | ✅ BLOCKING | PREHANDOVER must include: (a) legacy `knowledge_embeddings` row count at migration start, (b) `ai_knowledge` row count after migration, (c) assertion that (b) ≥ (a). Decommission gate blocked until this passes. |
| CL6-FFA-003 | Legacy decommission gated on row count match | ✅ BLOCKING | Legacy Supabase project `dmhlxhatogrrrvuruayv` must NOT be decommissioned until T-CL6-ROWCOUNT-001 PASSES and is evidenced in PREHANDOVER. Any PREHANDOVER claiming decommission without this evidence = REJECTION-PACKAGE. |
| CL6-FFA-004 | `org_page_chunks` scope included | ✅ BLOCKING | Issue #1225 explicitly includes `org_page_chunks` in CL-6 scope. Migration script must handle `org_page_chunks` data. Absence from diff = REJECTION-PACKAGE. |
| CL6-FFA-005 | Domain labels match CL-2-D2 taxonomy | ✅ BLOCKING | T-CL6-CHUNK-003, T-CL6-DOM-001, T-CL6-DOM-002: `ldcs` and `diamond-industry` domain labels must be used (per CP-2 Extended Taxonomy Decision). Any unknown label in migrated rows = REJECTION-PACKAGE. mat-specialist validation evidence must be in PREHANDOVER. |
| CL6-FFA-006 | Embedding dimension = 1536 throughout | ✅ BLOCKING | T-CL6-CHUNK-002: all migrated embeddings must be 1536-dimensional. Migration must re-embed (not carry forward legacy embeddings of unknown dimension). |
| CL6-FFA-007 | Smart Chunk Reuse deduplication active | ✅ BLOCKING | T-CL6-SCR-001: deduplication on `page_id` + `chunk_text` must be implemented in migration. Evidence: test passes + migration script logic visible in diff. |
| CL6-FFA-008 | `approval_status='pending'` on all migrated rows | ✅ BLOCKING | T-CL6-WRITE-001: every migrated row must be inserted with `approval_status='pending'`. No migrated row may carry a pre-approved status. |
| CL6-FFA-009 | ARC queue integration confirmed | ✅ BLOCKING | T-CL6-ARC-001: at least one migrated row must appear in ARC pending review queue post-migration. Evidence must be present in PREHANDOVER (test output or screenshot/log). |
| CL6-FFA-010 | No AIMC feature additions | ✅ BLOCKING | Architecture is FROZEN. IAA will scan the diff for any new AIMC features, new API endpoints not specified in issue #1225, or schema changes beyond what is required for migration. Any unauthorised addition = out-of-scope REJECTION-PACKAGE. |
| CL6-FFA-011 | Semantic search validated post-migration | ✅ BLOCKING | T-CL6-SEMANTIC-001: query "diamond certification standards" must return ≥ 1 result with `domain='ldcs'` after migration. Evidence in PREHANDOVER. |

---

## 5. Required PREHANDOVER Proof Structure

The PREHANDOVER proof committed by the producing agents (foreman orchestrating qa-builder, api-builder, schema-builder, mat-specialist) MUST include the following fields. An incomplete proof = immediate REJECTION-PACKAGE (CORE-018).

```yaml
# Required PREHANDOVER Proof Fields — Wave CL-6

prehandover_proof:
  session_id: "<session-NNN-cl6-lkiac-wave3-YYYYMMDD>"
  date: "YYYY-MM-DD"
  wave_slug: "cl6-lkiac-wave3-knowledge-reingestion-20260405"
  wave: "CL-6"
  issue: "maturion-isms#1225"
  branch: "copilot/cl-6-migrate-knowledge-embeddings"
  iaa_audit_token: "IAA-session-NNN-cl6-lkiac-wave3-20260405-PASS"  # pre-populated expected reference (A-029)

  producing_agents:
    - agent: "qa-builder"
      deliverable: "CL-6-D1 — RED gate test suite (12 tests)"
      path: "<path to test file(s)>"
      status: "DELIVERED"
    - agent: "api-builder"
      deliverable: "CL-6-D2 — Migration script + Edge Function wiring"
      path: "<path to migration script and edge function>"
      status: "DELIVERED"
    - agent: "schema-builder"
      deliverable: "CL-6-D3 — ai_knowledge schema verification"
      path: "<path to schema verification artifact>"
      status: "DELIVERED"
    - agent: "mat-specialist"
      deliverable: "CL-6-D4 — Domain tag validation against CL-2-D2"
      path: "<path to domain validation artifact or test evidence>"
      status: "DELIVERED"

  red_gate_tests:
    T-CL6-CHUNK-001: "GREEN ✅ / RED ❌"
    T-CL6-CHUNK-002: "GREEN ✅ / RED ❌"
    T-CL6-CHUNK-003: "GREEN ✅ / RED ❌"
    T-CL6-DOM-001: "GREEN ✅ / RED ❌"
    T-CL6-DOM-002: "GREEN ✅ / RED ❌"
    T-CL6-WRITE-001: "GREEN ✅ / RED ❌"
    T-CL6-WRITE-002: "GREEN ✅ / RED ❌"
    T-CL6-ARC-001: "GREEN ✅ / RED ❌"
    T-CL6-SCR-001: "GREEN ✅ / RED ❌"
    T-CL6-PIPE-001: "GREEN ✅ / RED ❌"
    T-CL6-ROWCOUNT-001: "GREEN ✅ / RED ❌"
    T-CL6-SEMANTIC-001: "GREEN ✅ / RED ❌"
    all_12_green: "YES / NO"

  migration_verification:
    legacy_row_count_at_start: <integer>
    aimc_ai_knowledge_row_count_after_migration: <integer>
    row_count_match: "YES (migrated ≥ legacy) / NO"
    legacy_decommissioned: "YES / NO — if YES: evidence reference required"

  pipeline_1_isolation_confirmed: "YES / NO"
  pipeline_1_tables_untouched: "YES / NO"

  org_page_chunks_migrated: "YES / NO"

  domain_labels_validated:
    ldcs_adopted: "YES / NO"
    diamond_industry_adopted: "YES / NO"
    unknown_labels_found: "NONE / <list>"

  embedding_dimension_verified: "1536 / <actual>"

  no_hardcoded_secrets_confirmed: "YES / NO"
  no_new_aimc_features_in_diff: "YES / NO"

  session_memory_path: "<path>"
```

**CRITICAL**: The `iaa_audit_token` field MUST contain the expected reference in format
`IAA-session-NNN-cl6-lkiac-wave3-20260405-PASS`. Do NOT use `PENDING`, `TBD`, or a bare date.
The dedicated IAA token file will be written separately by IAA per §4.3b architecture (A-029).

---

## 6. Scope Blockers & Governance Conflicts — Visible Now

### SB-001 — Hardcoded Legacy Credentials Risk (ADVISORY — Pre-emptive)

**Risk**: The legacy Supabase project ID `dmhlxhatogrrrvuruayv` and its connection URL must
not appear in any source file. Migration scripts commonly embed connection strings during
development. IAA will scan for this pattern at handover (BD-016, CL6-FFA-011 derivative).

**Mitigation required**: All legacy credentials must be injected via environment variables.
PREHANDOVER must explicitly confirm `no_hardcoded_secrets_confirmed: YES`.

### SB-002 — Pipeline 1 Isolation Boundary (HARD GATE — Pre-existing constraint)

**Risk**: The migration target table `ai_knowledge` is shared between Pipeline 2 (knowledge
embeddings) and Pipeline 1 (criteria documents, `source='criteria'`). Any migration that
incorrectly writes to Pipeline 1 rows or touches `criteria_documents` is a data integrity
violation that cannot be reversed without rollback.

**Mitigation required**: T-CL6-PIPE-001 must pass GREEN. PREHANDOVER must confirm
`pipeline_1_isolation_confirmed: YES`. IAA treats any Pipeline 1 contamination as a
CRITICAL REJECTION-PACKAGE with no waiver path.

### SB-003 — Decommission Sequencing (HARD GATE)

**Risk**: Legacy Supabase project decommission must be gated on verified row count match
(T-CL6-ROWCOUNT-001 GREEN). Premature decommission = permanent data loss.

**Mitigation required**: Decommission must not occur until T-CL6-ROWCOUNT-001 is GREEN and
documented in PREHANDOVER. If PREHANDOVER claims decommission without this evidence →
IAA issues REJECTION-PACKAGE under CL6-FFA-003.

### SB-004 — Architecture Freeze Compliance (GOVERNANCE BOUNDARY)

**Risk**: CL-6 is migration-only. Any new AIMC feature, new API endpoint, new schema column
beyond what is required for migration constitutes an unauthorised scope expansion. Architecture
is FROZEN per issue #1225 and CEP v1.8.0 §Wave CL-6.

**Mitigation required**: Builders must limit diff strictly to migration scope. IAA will scan
for out-of-scope additions under CL6-FFA-010.

### SB-005 — `org_page_chunks` Inclusion Must Be Explicit (SCOPE GATE)

**Risk**: The issue explicitly includes `org_page_chunks` scope in CL-6. If api-builder
delivers a migration script that handles only `knowledge_embeddings` and omits `org_page_chunks`,
the scope is incomplete → REJECTION-PACKAGE under CL6-FFA-004.

**Mitigation required**: api-builder must handle both data sources in CL-6-D2.

### SB-006 — RED Gate Test Ordering Gate (PROCEDURAL GATE)

**Established by issue #1225**: `qa-builder` must deliver ALL 12 RED gate tests BEFORE
`api-builder` receives the migration script task. If the PR diff shows api-builder
deliverables but the RED gate tests are missing or only partially delivered →
REJECTION-PACKAGE under BD-001 (full scope not delivered).

**Mitigation required**: Foreman must enforce RED-before-GREEN delegation sequence.
PREHANDOVER must show that qa-builder delivered CL-6-D1 before api-builder delivered CL-6-D2.

### SB-007 — No Scope Conflicts Detected (CLEAR)

No governance conflicts between CL-6 scope and completed waves CL-2 and CL-4 are visible
at Pre-Brief time. Entry gates are confirmed met. CL-6 is authorized to proceed per CS2
authority (issue #1225, 2026-04-05).

---

## 7. Applicable Overlays Summary

| Overlay | Applies? | Checks Count |
|---------|----------|-------------|
| Core Invariants (CORE-005 through CORE-023, applicable subset) | ✅ YES | 13 applicable checks |
| BUILD_DELIVERABLE (BD-000 through BD-017) | ✅ YES | 18 checks |
| CL-6 Wave-Domain FFA (CL6-FFA-001 through CL6-FFA-011) | ✅ YES | 11 checks |
| AGENT_CONTRACT overlay | ❌ N/A | 0 checks |
| CI_WORKFLOW overlay | ❌ N/A unless workflow files appear in diff | 0 (or activates if triggered) |
| KNOWLEDGE_GOVERNANCE overlay | ❌ N/A unless agent Tier 2 files modified | 0 (or activates if triggered) |

**Total declared checks at handover**: ~42 checks (subject to N/A determinations for CORE-001–004, CORE-008–012, CORE-022).

---

## 8. IAA Invocation Instruction

When all CL-6 deliverables are complete and the PREHANDOVER proof is committed, invoke IAA as follows:

1. Confirm all 12 RED gate tests are GREEN (evidenced in PREHANDOVER).
2. Confirm PREHANDOVER proof is committed to branch `copilot/cl-6-migrate-knowledge-embeddings`.
3. Confirm session memory is committed.
4. Then: `@independent-assurance-agent` — CL-6 handover review — wave `cl6-lkiac-wave3-knowledge-reingestion-20260405`.

IAA will re-read this Pre-Brief at invocation and verify all declared checks are satisfied.

---

**IAA Pre-Brief Authority**: CS2 (@APGI-cmy) — maturion-isms#1225
**Adoption Phase at Pre-Brief**: PHASE_B_BLOCKING
**Pre-Brief Date**: 2026-04-05
**Agent**: independent-assurance-agent v6.2.0 / contract v2.3.0
