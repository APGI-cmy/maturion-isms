# IAA Pre-Brief Artifact — Wave CL-6 Wave 3 (Third Attempt)

**Pre-Brief Session**: session-prebrief-cl6-wave3-20260409
**Date**: 2026-04-09
**IAA Agent**: independent-assurance-agent v6.2.0
**Contract Version**: 2.5.0
**Adoption Phase**: PHASE_B_BLOCKING — Hard gate ACTIVE
**Pre-Brief Mode**: PHASE_0 (Pre-Brief only — Phases 1–4 not executed in this invocation)
**Authority**: CS2 only (@APGI-cmy)

---

## Phase 0 Execution Evidence

### Step 0.1 — Pre-Brief Invocation Confirmed

Triggered by comment containing `[IAA PRE-BRIEF REQUEST]` for Wave CL-6
(cl6-wave3-knowledge-reingestion), Branch `copilot/cl-6-migrate-knowledge-embeddings-again`,
Issue/PR #1325. Mode: **PRE-BRIEF**. Phases 1–4 assurance NOT executed in this invocation.

Prior pre-brief on file: `iaa-prebrief-cl6-relaunch-20260406.md` — authored for a
**different branch** (`copilot/cl-6-relaunch-knowledge-ingestion`, issue #1240).
That pre-brief is NOT applicable to this new branch/PR. This document supersedes it for
wave `cl6-wave3-knowledge-reingestion`.

### Step 0.2 — Wave Identity

```yaml
wave: cl6-wave3-knowledge-reingestion
wave_name: "CL-6: LKIAC Wave 3 — Knowledge Re-ingestion (Third Attempt)"
branch: copilot/cl-6-migrate-knowledge-embeddings-again
issue_pr: maturion-isms#1325
cs2_authorization: "PR #1325 opened by @APGI-cmy (CS2), assigned to foreman-v2-agent (Copilot); Issue #1221 (2026-04-05) authorised CL-6 wave-start"
cep_reference: "governance/EXECUTION/AIMC_LKIAC_COMBINED_EXECUTION_PLAN.md §Wave CL-6 v1.8.0"
programme: LKIAC — Wave 3 of 6
prior_attempt_1: "PR #1233 — CLOSED governance-invalid (GOV-BREACH-AIMC-W5-002)"
prior_attempt_2: "Branch copilot/cl-6-relaunch-knowledge-ingestion / Issue #1240 — REJECTION-PACKAGE issued session-cl6-relaunch-20260406 (A-021: ceremony artifacts untracked at IAA invocation)"
architecture: "FROZEN — migration only, no new AIMC features"
entry_gates_met:
  - "CL-2: Legacy Knowledge Inventory COMPLETE — CP-2 signed off 2026-04-03"
  - "CL-4: AIMC Audit Phase A COMPLETE — CP-4 signed off 2026-04-03"
```

**Wave description**: Migrate all knowledge embeddings from the legacy Supabase project
(`dmhlxhatogrrrvuruayv`) into the AIMC `ai_knowledge` table. Re-embed content using the
AIMC vector model (1536-dim, OpenAI-compatible). Validate migration. Decommission legacy
Supabase project after verified row count match.

---

## Section 1 — Qualifying Tasks and Trigger Classification

### Task CL6-T1: Schema Verification SQL

| Field | Value |
|-------|-------|
| `task_id` | CL6-T1 |
| `task_summary` | `schema-builder` confirms `ai_knowledge` table state: required columns present, RLS policies correct (including `ai_knowledge_org_insert TO authenticated`), pgvector extension active, vector index integrity verified |
| `delegated_to` | schema-builder |
| `iaa_trigger_category` | **AAWP_MAT** |
| `trigger_rationale` | Supabase SQL migration/verification file in `packages/ai-centre/supabase/migrations/` — AIMC LKIAC wave artifact matching `packages/ai-centre/` path pattern |
| `required_phases` | Phase 2 (Alignment) + Phase 3 (Assurance Work) + Phase 4 (Verdict) |
| `required_evidence_artifacts` | PREHANDOVER proof committed to branch; session memory committed to branch; schema-builder IAA token; RED→GREEN evidence for schema tests; SQL file in PR diff; git-verified commit before IAA invocation |
| `applicable_overlays` | BUILD_DELIVERABLE (BD-001 through BD-024), OVL-INJ-001 (Pre-Brief existence) |
| `specific_rules` | BD-002 (no stubs in SQL), BD-003 (one-time build compliance), CORE-023 (workflow ripple check), NBR-005 (schema column compliance — `ai_knowledge` column spec), NP-SB-001 (RLS TO authenticated not TO public), A-021 (commit before IAA invocation — RECURRING PATTERN) |

### Task CL6-T2: RED Gate Test Suite (12 Tests)

| Field | Value |
|-------|-------|
| `task_id` | CL6-T2 |
| `task_summary` | `qa-builder` produces exactly 12 RED gate tests: T-CL6-CHUNK-001/002/003, T-CL6-DOM-001/002, T-CL6-WRITE-001/002, T-CL6-ARC-001, T-CL6-SCR-001, T-CL6-PIPE-001, T-CL6-ROWCOUNT-001, T-CL6-SEMANTIC-001. All 12 tests must be in RED state before `api-builder` receives migration script task |
| `delegated_to` | qa-builder |
| `iaa_trigger_category` | **AAWP_MAT** |
| `trigger_rationale` | QA deliverable in `packages/ai-centre/` path — RED gate is a mandatory LKIAC wave condition per CEP §CL-6 entry criterion |
| `required_phases` | Phase 2 + Phase 3 + Phase 4 |
| `required_evidence_artifacts` | PREHANDOVER proof committed; session memory committed; qa-builder IAA token; test runner output confirming RED state for all 12 tests; test file in PR diff; git commit history showing tests committed before migration script |
| `applicable_overlays` | BUILD_DELIVERABLE (BD-000 through BD-024), OVL-INJ-001 |
| `specific_rules` | BD-001 (all 12 tests present — exact count), CL6-FFA-001 (RED before implementation), CL6-FFA-003 (1536-dim test present), CL6-FFA-004 (domain-tag tests for `ldcs` + `diamond-industry`), CL6-FFA-006 (Pipeline 1 isolation test present and meaningful), CL6-FFA-009 (dedup test), NP-SB-002 (T-CL6-WRITE-002: anon INSERT must be explicitly DENIED — silent pass = security failure), A-021 (commit before IAA invocation) |

**Critical check for T-CL6-WRITE-002**: The test must explicitly assert anon role INSERT is DENIED, not merely that service-role INSERT succeeds. Evidence must show HTTP 403 or RLS rejection in test output. Per NP-SB-002 anti-regression.

### Task CL6-T3: TypeScript Migration Script

| Field | Value |
|-------|-------|
| `task_id` | CL6-T3 |
| `deliverable_id` | CL-6-D2 |
| `task_summary` | `api-builder` produces TypeScript migration script: reads from legacy Supabase project (`dmhlxhatogrrrvuruayv`), re-embeds using OpenAI 1536-dim model, inserts into `ai_knowledge` with correct `organisation_id`, `source` tags per CL-2 domain mapping, `approval_status = 'pending'`, deduplication via `content_hash`. Pipeline 1 files must NOT be touched. |
| `delegated_to` | api-builder |
| `iaa_trigger_category` | **AAWP_MAT** |
| `trigger_rationale` | Primary LKIAC Wave 3 implementation script (CEP §CL-6-D2) — AIMC path |
| `required_phases` | Phase 2 + Phase 3 + Phase 4 |
| `required_evidence_artifacts` | PREHANDOVER proof committed; session memory committed; builder IAA token; GREEN test output (all 12 tests PASS); script in PR diff; git diff showing NO Pipeline 1 file changes (`criteria_documents`, `ai_knowledge` rows with `source='criteria'`); mat-specialist domain tag validation evidence |
| `applicable_overlays` | BUILD_DELIVERABLE (BD-000 through BD-024), OVL-INJ-001 |
| `specific_rules` | BD-000 (user journey trace: legacy rows → re-embed → insert with correct fields → validation → row count match), BD-002 (no stubs), BD-003 (one-time build), CL6-FFA-002 (script path matches CEP: `packages/ai-centre/scripts/` or equivalent), CL6-FFA-003 (1536-dim embedding), CL6-FFA-004 (approved domain tags: `ldcs`, `diamond-industry`, approved `source` values only), CL6-FFA-005 (`approval_status = 'pending'` on every inserted row), CL6-FFA-006 (Pipeline 1 isolation — zero changes to `criteria_documents`), CL6-FFA-007 (RLS — migration uses service-role key, not anon), CL6-FFA-008 (ARC queue — newly migrated rows visible in `approval_status = 'pending'` queue), CL6-FFA-009 (dedup — content_hash deduplication present), CORE-017 (no `.github/agents/` changes), A-021 (commit before IAA invocation — MANDATORY) |

### Task CL6-T4: Migration Report + Semantic Search Validation

| Field | Value |
|-------|-------|
| `task_id` | CL6-T4 |
| `deliverable_id` | CL-6-D4 |
| `task_summary` | `api-builder` produces migration report confirming: row count match (`ai_knowledge` ≥ legacy `knowledge_embeddings`), semantic search validation showing all domain areas returning relevant results, CP-6 readiness declaration for CS2 review before legacy decommission |
| `delegated_to` | api-builder |
| `iaa_trigger_category` | **AAWP_MAT** |
| `trigger_rationale` | LKIAC Wave 3 validation and closure artifact (CEP §CL-6-D4) |
| `required_phases` | Phase 2 + Phase 3 + Phase 4 |
| `required_evidence_artifacts` | Migration report in PR diff with row count table; semantic search test output; T-CL6-ROWCOUNT-001 GREEN evidence; T-CL6-SEMANTIC-001 GREEN evidence; CP-6 readiness section |
| `applicable_overlays` | BUILD_DELIVERABLE (BD-000 through BD-024), OVL-INJ-001 |
| `specific_rules` | BD-002 (no placeholder values in report), CL6-FFA-010 (row count match ≥ legacy), CL6-FFA-011 (semantic search returns ≥1 result for `domain='ldcs'` query "diamond certification standards"), CORE-023 (no accidental workflow changes) |

### Task mat-specialist — Domain Tag Validation

| Field | Value |
|-------|-------|
| `task_id` | CL-2-D2-validation |
| `task_summary` | `mat-specialist` validates all migrated rows have approved domain tags: `ldcs`, `diamond-industry`, or approved `source` values from CL-2-D2 domain mapping. No undeclared domain labels permitted in migrated data. |
| `delegated_to` | mat-specialist |
| `iaa_trigger_category` | **AAWP_MAT** |
| `trigger_rationale` | Domain mapping validation is a mandatory CL-6 acceptance criterion per issue #1325 |
| `required_phases` | Phase 2 + Phase 3 + Phase 4 (may be bundled with CL6-T3 IAA invocation) |
| `required_evidence_artifacts` | mat-specialist validation report or annotation in PREHANDOVER proof; list of all `domain`/`source` values found in migrated data; confirmation no unknown labels present |
| `applicable_overlays` | BUILD_DELIVERABLE, OVL-INJ-001 |
| `specific_rules` | CL6-FFA-004 (domain tags), CL-2-D2 mapping reference: `governance/aimc/` — `ldcs` ADOPTED, `diamond-industry` ADOPTED; `org_page_chunks` scope INCLUDED per CP-2 2026-04-03 |

---

## Section 2 — Anti-Regression Obligations (Step 0.3b)

### Known Recurring Failure Patterns for This Wave

| Pattern ID | Description | Source | Applies? |
|-----------|-------------|--------|---------|
| **A-021-CL6** | Ceremony artifacts (PREHANDOVER proof + session memory) created on disk but NOT committed to branch before IAA invocation | session-cl6-relaunch-20260406 REJECTION-PACKAGE (FAILURE-3) | ✅ DIRECTLY APPLICABLE — same wave type, same builders, same risk |
| **NBR-005** | `ai_knowledge` schema column mismatch — migrated rows missing required columns | FUNCTIONAL-BEHAVIOUR-REGISTRY.md | ✅ APPLICABLE — same `ai_knowledge` table |
| **NP-SB-001** | RLS policy uses `TO public` instead of `TO authenticated` | niggle-pattern-library.md | ✅ APPLICABLE — `ai_knowledge_org_insert` policy under review |
| **NP-SB-002** | Silent write block — anon INSERT not explicitly denied, test passes by mistake | niggle-pattern-library.md | ✅ APPLICABLE — T-CL6-WRITE-002 |

### Declared Anti-Regression Obligations Per Builder

**schema-builder (CL6-T1):**
- OBLIGATION-1: RLS policy `ai_knowledge_org_insert` MUST use `TO authenticated`, not `TO public` or absent. Verify in SQL diff.
- OBLIGATION-2: All required `ai_knowledge` columns present per NBR-005 schema spec.

**qa-builder (CL6-T2):**
- OBLIGATION-3: T-CL6-WRITE-002 must explicitly assert anon INSERT returns HTTP 403 or RLS rejection. Test that only checks service-role success (not anon denial) is INSUFFICIENT.
- OBLIGATION-4: Commit evidence for RED state must show all 12 tests FAILING before any migration script is written. Git commit hash required.

**api-builder (CL6-T3/T4):**
- OBLIGATION-5: **A-021 PREVENTION — MANDATORY**: Before Foreman invokes IAA, run `git ls-files --error-unmatch <PREHANDOVER_PATH> <SESSION_MEMORY_PATH>`. Non-empty output (both paths returned) = files are committed. Error or blank = ABORT — do NOT invoke IAA. This is a direct lesson from the prior REJECTION-PACKAGE.
- OBLIGATION-6: Migration script must set `approval_status = 'pending'` on EVERY inserted row. No row may be inserted with any other value.
- OBLIGATION-7: `content_hash` deduplication must be present. Second INSERT of identical content must not create a duplicate row.

**mat-specialist (domain validation):**
- OBLIGATION-8: Validation must enumerate ALL unique `domain` and `source` values found in migrated data and confirm each against CL-2-D2 approved list. "Values look correct" is not sufficient — an explicit enumeration is required.

### Mechanical Verification Before Phase 2–4 Proceeds

These items MUST be mechanically verified at Phase 3 (not assumed):

1. `git ls-files --error-unmatch <PREHANDOVER_PATH>` — confirms PREHANDOVER is committed (not just on disk)
2. `git ls-files --error-unmatch <SESSION_MEMORY_PATH>` — confirms session memory is committed
3. `git log --oneline --follow <TEST_FILE>` — confirms RED gate tests were committed BEFORE migration script
4. `grep -c "approval_status.*pending" <MIGRATION_SCRIPT>` — confirms every insert uses `pending`
5. `grep "TO authenticated" <SCHEMA_SQL>` — confirms RLS uses correct role
6. Pipeline 1 isolation: `git diff HEAD -- packages/ai-centre/supabase/migrations/ | grep -i criteria_documents` must return EMPTY

---

## Section 3 — Ceremony-Admin Appointment Check (Step 0.3c)

`wave-current-tasks.md` reviewed: Wave `cl6-wave3-knowledge-reingestion` is not yet present in `wave-current-tasks.md` (current file covers `optimize-iaa-invocation-workflows`, issue #1311). **`execution-ceremony-admin-agent` is NOT appointed for this wave.**

ECAP-001 three-role split checks will be N/A at Phase 3 invocation time. Foreman retains full Phase 4 bundle preparation responsibility.

---

## Section 4 — PREHANDOVER Structure Requirements

Per **OVL-INJ-001** and **A-021 prevention**, EVERY IAA invocation for this wave requires:

### Minimum PREHANDOVER Proof Contents

```
PREHANDOVER proof for CL-6 [TASK_ID] — wave cl6-wave3-knowledge-reingestion
Branch: copilot/cl-6-migrate-knowledge-embeddings-again
Issue: #1325
Builder: [builder-name]

DELIVERABLES:
- [List each file produced, with path]
- [Git commit SHA for each]

RED→GREEN EVIDENCE:
- RED state commit: [SHA] — [test count] tests FAILING
- GREEN state commit: [SHA] — [test count] tests PASSING
- Test output excerpt: [paste failing then passing lines]

FFA CHECKS:
- CL6-FFA-001 (RED before implementation): [PASS — commit SHA X predates commit SHA Y]
- CL6-FFA-003 (1536-dim): [PASS — test T-CL6-CHUNK-002 passes]
- CL6-FFA-004 (domain tags): [PASS — ldcs + diamond-industry confirmed]
- CL6-FFA-005 (approval_status pending): [PASS — grep evidence]
- CL6-FFA-006 (Pipeline 1 isolation): [PASS — git diff confirms no criteria_documents changes]
- CL6-FFA-007 (RLS): [PASS — grep TO authenticated evidence]
- CL6-FFA-008 (ARC queue): [PASS — test T-CL6-ARC-001 passes]
- CL6-FFA-009 (dedup): [PASS — test T-CL6-SCR-001 passes]
- NBR-005 (schema column compliance): [PASS — columns verified]
- NP-SB-001 (RLS TO authenticated): [PASS — evidence]
- NP-SB-002 (anon denied): [PASS — T-CL6-WRITE-002 shows HTTP 403]
- A-021 PREVENTION (committed before IAA): [PASS — git ls-files output shows both PREHANDOVER + session memory tracked]

IAA AUDIT TOKEN: [leave blank — IAA populates]
```

### Critical A-021 Prevention Gate

**Before Foreman calls IAA — mandatory pre-invocation check:**

```bash
git ls-files --error-unmatch .agent-workspace/foreman-v2/memory/PREHANDOVER-session-[ID].md
git ls-files --error-unmatch .agent-workspace/foreman-v2/memory/session-[ID].md
```

If either command returns an error or blank output → **DO NOT INVOKE IAA**. Commit and push first.

---

## Section 5 — Scope Blockers

The following conditions will trigger automatic **REJECTION-PACKAGE** at Phase 3:

| Blocker ID | Condition | Enforcement |
|-----------|-----------|-------------|
| SB-001 | Architecture boundary violated — any new AIMC feature or schema column added (not migration-only) | REJECTION-PACKAGE (architecture frozen per issue #1325) |
| SB-002 | Pipeline 1 isolation broken — any `criteria_documents` row count change or `ai_knowledge` rows with `source='criteria'` modified/deleted during migration | REJECTION-PACKAGE (T-CL6-PIPE-001 failure) |
| SB-003 | Legacy Supabase decommissioned before CP-6 CS2 review gate | OUT OF SCOPE — decommission requires CP-6 sign-off, not CL-6 wave merge |
| SB-004 | `.github/agents/` files modified (CORE-017) | REJECTION-PACKAGE |
| SB-005 | Migration script uses anon key (not service-role key) for Supabase writes | REJECTION-PACKAGE (security) |
| SB-006 | Any migrated row inserted with `approval_status` != `'pending'` | REJECTION-PACKAGE (CL6-FFA-005) |
| SB-007 | Row count after migration < legacy `knowledge_embeddings` row count | REJECTION-PACKAGE (T-CL6-ROWCOUNT-001 failure) |
| SB-008 | Undeclared domain label found in migrated data (not in CL-2-D2 approved list) | REJECTION-PACKAGE (CL6-FFA-004 failure) |
| SB-009 | A-021 recurrence — ceremony artifacts untracked at IAA invocation time | REJECTION-PACKAGE (same pattern as prior wave — no tolerance) |

---

## Section 6 — Stage-Readiness View (OVL-INJ-ADM-003)

Per `PRE_BUILD_STAGE_MODEL_CANON.md §10`:

| Stage | Description | Status |
|-------|-------------|--------|
| Stage 1–5 | Programme authorization, architecture freeze, CEP ratification, entry gate verification, domain mapping | ✅ COMPLETE — CS2 auth (#1325/#1221), architecture frozen, CEP v1.8.0 present, CL-2 + CL-4 closed, CL-2-D2 domain mapping accepted |
| Stage 6 | IAA Pre-Brief committed | ✅ COMPLETE (this artifact) |
| Stage 7 | RED gate tests produced and FAILING | ⏳ PENDING — qa-builder CL6-T2 |
| Stage 8 | Schema verification SQL produced | ⏳ PENDING — schema-builder CL6-T1 |
| Stage 9 | Migration script produced | ⏳ PENDING — api-builder CL6-T3 |
| Stage 10 | All RED tests GREEN + row count match | ⏳ PENDING |
| Stage 11 | Migration report + semantic validation | ⏳ PENDING — api-builder CL6-T4 |
| Stage 12 | IAA Phase 2–4 final audit | ⏳ PENDING — IAA invocation (full) |

**Blockers preventing Stage 7 builder appointment:**
- NONE — all entry gates met, architecture frozen, Pre-Brief committed. Foreman may delegate CL6-T2 to qa-builder immediately.
- Recommended sequence: CL6-T2 (RED gate) → CL6-T1 (schema verify) → CL6-T3 (migration script) → CL6-T4 (report). IAA invoked once after CL6-T4 delivery.

---

## Section 7 — IAA Invocation Checklist (For Foreman Reference)

Before invoking IAA for Phase 2–4 on this wave:

- [ ] All builder PREHANDOVER proofs committed to branch (git-verified, not just disk-present)
- [ ] All builder session memory files committed to branch (git-verified)
- [ ] RED gate test run output attached to PREHANDOVER (shows RED → GREEN transition)
- [ ] Migration script `git diff` shows zero Pipeline 1 changes
- [ ] Row count match evidence in migration report
- [ ] Semantic search validation output present
- [ ] mat-specialist domain enumeration present
- [ ] No `.github/agents/` changes in PR diff
- [ ] A-021 pre-invocation check executed and PASSED: `git ls-files --error-unmatch` for both PREHANDOVER + session memory
- [ ] SCOPE_DECLARATION.md updated to match PR diff (A-026)
- [ ] This Pre-Brief artifact referenced in PREHANDOVER proof (OVL-INJ-001)

---

## Metadata

```yaml
prebrief_id: iaa-prebrief-cl6-wave3-20260409
session_id: session-prebrief-cl6-wave3-20260409
wave: cl6-wave3-knowledge-reingestion
branch: copilot/cl-6-migrate-knowledge-embeddings-again
issue_pr: "maturion-isms#1325"
date: 2026-04-09
iaa_agent: independent-assurance-agent
iaa_version: 6.2.0
contract_version: 2.5.0
adoption_phase: PHASE_B_BLOCKING
qualifying_tasks: 5
trigger_categories_found: [AAWP_MAT]
ceremony_admin_appointed: NO
prior_prebrief_superseded: "iaa-prebrief-cl6-relaunch-20260406.md (for branch copilot/cl-6-relaunch-knowledge-ingestion / #1240)"
anti_regression_obligations_declared: 8
scope_blockers_declared: 9
pre_brief_status: COMPLETE
```

---

**Authority**: CS2 only (Johan Ras / @APGI-cmy)
**IAA Adoption Phase**: PHASE_B_BLOCKING — Hard gate ACTIVE
**Self-Modification Lock**: SELF-MOD-IAA-001 — ACTIVE
