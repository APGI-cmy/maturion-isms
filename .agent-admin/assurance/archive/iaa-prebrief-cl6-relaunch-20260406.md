# IAA Pre-Brief Artifact — Wave CL-6 Re-launch

**Pre-Brief Session**: session-056-cl6-relaunch-prebrief-20260406
**Date**: 2026-04-06
**IAA Agent**: independent-assurance-agent v6.2.0
**Adoption Phase**: PHASE_B_BLOCKING — Hard gate ACTIVE
**Pre-Brief Mode**: PHASE_0 (Pre-Brief only — Phases 1–4 not executed in this invocation)

---

## Phase 0 Execution Evidence

### Step 0.1 — Pre-Brief Invocation Confirmed

This session was triggered by a comment containing the Pre-Brief invocation pattern for
Wave CL-6 Re-launch (issue #1240). Mode: PRE-BRIEF. Phases 1–4 assurance NOT executed.

### Step 0.2 — Wave Identity

```yaml
wave: cl6-relaunch-20260406
wave_name: "CL-6 Knowledge Re-ingestion Migration — Re-launch through Governed Builder Path"
branch: copilot/cl-6-relaunch-knowledge-ingestion
issue: maturion-isms#1240
cs2_authorization: "Issue #1240 opened by @APGI-cmy (CS2) on 2026-04-06 — assigned to foreman-v2-agent (Copilot)"
cep_reference: "AIMC_LKIAC_COMBINED_EXECUTION_PLAN.md §CL-6 (Wave CL-6: LKIAC Wave 3)"
programme: LKIAC
prior_attempt: "PR #1233 — CLOSED as governance-invalid (GOV-BREACH-AIMC-W5-002)"
```

**Wave description**: Migrate all knowledge embeddings from the legacy Supabase project
(`dmhlxhatogrrrvuruayv`) into the AIMC `ai_knowledge` table. Re-embed content using the
AIMC vector model (1536-dim, OpenAI-compatible). Validate migration. This wave is a re-launch
of the CL-6 objective through the correct builder-governed path — `schema-builder`,
`qa-builder`, and `api-builder` execute; `foreman-v2-agent` orchestrates only.

---

## Section 1 — Qualifying Tasks and Trigger Classification

### Task 1: Schema Verification SQL

| Field | Value |
|-------|-------|
| `task_id` | CL6-T1 |
| `task_summary` | schema-builder produces `010_cl6_schema_verification.sql` — confirms `ai_knowledge` table state, verifies RLS policies (including `ai_knowledge_org_insert` fix to `TO authenticated`), and confirms pgvector extension and index integrity |
| `iaa_trigger_category` | **AAWP_MAT** |
| `trigger_rationale` | Deliverable is a Supabase migration file in `packages/ai-centre/supabase/migrations/` — an AIMC LKIAC wave artifact |
| `required_phases` | Phase 2 (Alignment) + Phase 3 (Assurance Work) + Phase 4 (Verdict) |
| `required_evidence_artifacts` | PREHANDOVER proof, session memory, schema-builder IAA token, RED→GREEN evidence for schema tests, migration file in diff |
| `applicable_overlays` | BUILD_DELIVERABLE (BD-001 through BD-024), PRE_BRIEF_ASSURANCE (OVL-INJ-001) |
| `specific_rules` | BD-002 (no stubs), BD-003 (one-time build compliance), CORE-023 (workflow ripple check on migration file), CL6-FFA-007 (RLS `TO authenticated` fix), CL6-FFA-010 (schema verification correctness) |

### Task 2: RED Gate Test Suite (12 Tests)

| Field | Value |
|-------|-------|
| `task_id` | CL6-T2 |
| `task_summary` | qa-builder produces RED gate test suite with exactly 12 tests covering: chunk schema, embedding dimension (1536), domain queryability, RLS policy, ARC queue, deduplication, Pipeline 1 isolation, row count match, semantic search — all tests must be in RED state before migration script is written |
| `iaa_trigger_category` | **AAWP_MAT** |
| `trigger_rationale` | QA deliverable in AIMC `packages/ai-centre/` path — RED gate is a mandatory LKIAC wave condition (CEP §CL-6 entry criterion) |
| `required_phases` | Phase 2 + Phase 3 + Phase 4 |
| `required_evidence_artifacts` | PREHANDOVER proof, session memory, qa-builder IAA token, test runner output confirming RED state, test file in diff |
| `applicable_overlays` | BUILD_DELIVERABLE (BD-001 through BD-024, BD-000 user journey trace), PRE_BRIEF_ASSURANCE (OVL-INJ-001) |
| `specific_rules` | BD-001 (all 12 tests present), CL6-FFA-001 (RED before implementation), CL6-FFA-003 (1536-dim test present), CL6-FFA-004 (domain-tag tests), CL6-FFA-006 (Pipeline 1 isolation test), CL6-FFA-009 (dedup test) |

### Task 3: Migration TypeScript Script

| Field | Value |
|-------|-------|
| `task_id` | CL6-T3 |
| `task_summary` | api-builder (or integration-builder, per delegation choice) produces the migration TypeScript script — reads from legacy Supabase project, re-embeds using OpenAI 1536-dim model, inserts into `ai_knowledge` with correct `organisation_id`, `source` tags per CL-2 domain mapping, `approval_status = 'pending'`, and deduplication via `content_hash`. Pipeline 1 files must NOT be touched. |
| `iaa_trigger_category` | **AAWP_MAT** |
| `trigger_rationale` | Implementation deliverable in AIMC path — primary LKIAC Wave 3 script (CEP §CL-6-D2) |
| `required_phases` | Phase 2 + Phase 3 + Phase 4 |
| `required_evidence_artifacts` | PREHANDOVER proof, session memory, builder IAA token, GREEN test output (all 12 tests), script in diff, no Pipeline 1 file changes in diff |
| `applicable_overlays` | BUILD_DELIVERABLE (BD-000 through BD-024), PRE_BRIEF_ASSURANCE (OVL-INJ-001) |
| `specific_rules` | BD-000 (user journey trace: legacy rows → re-embed → insert → validation), BD-002 (no stubs), BD-003 (one-time build), CL6-FFA-002 (script path matches CEP), CL6-FFA-003 (1536-dim), CL6-FFA-004 (approved domain tags only), CL6-FFA-005 (approval_status = 'pending'), CL6-FFA-006 (Pipeline 1 isolation), CL6-FFA-007 (RLS), CL6-FFA-008 (ARC queue), CL6-FFA-009 (dedup), CORE-017 (no .github/agents/ changes) |

### Task 4: Migration Report + Semantic Search Validation Artifacts

| Field | Value |
|-------|-------|
| `task_id` | CL6-T4 |
| `task_summary` | api-builder produces migration report (CL-6-D4) with row counts (legacy vs AIMC), per-domain counts, confirmation of migration complete. qa-builder produces semantic search validation artifact (CL-6-D3) with ≥10 queries per domain. Both artifacts required before CP-6 and decommission authorization. |
| `iaa_trigger_category` | **AAWP_MAT** |
| `trigger_rationale` | LKIAC Wave 3 exit criteria artifacts (CEP §CL-6 exit criteria) |
| `required_phases` | Phase 2 + Phase 3 + Phase 4 |
| `required_evidence_artifacts` | PREHANDOVER proof, session memory, migration report at declared path, semantic validation at declared path, no placeholder content |
| `applicable_overlays` | BUILD_DELIVERABLE (BD-001, BD-002, BD-003), PRE_BRIEF_ASSURANCE (OVL-INJ-001) |
| `specific_rules` | CL6-FFA-011 (migration report completeness), CL6-FFA-012 (semantic search ≥10 queries/domain), CORE-007 (no placeholder content) |

---

## Section 2 — IAA Trigger Categories for This Wave

| Category | Triggered? | Reason |
|----------|-----------|--------|
| AAWP_MAT | **YES — MANDATORY** | All four tasks deliver AIMC LKIAC wave artifacts in `packages/ai-centre/` — migration SQL, test suite, TypeScript migration script, validation/report artifacts |
| AGENT_CONTRACT | NO — not in scope | No `.github/agents/` files in scope |
| CANON_GOVERNANCE | NO — not in scope | No `governance/canon/` files in scope |
| CI_WORKFLOW | CONDITIONAL — monitor | No `.github/workflows/` changes declared in scope; however if builder adds test runner workflow steps, CI_WORKFLOW trigger activates. Foreman must gate this. |
| KNOWLEDGE_GOVERNANCE | NO — not in scope | No Tier 2 knowledge files in scope |
| INJECTION_AUDIT_TRAIL (PRE_BRIEF_ASSURANCE) | **YES — ALWAYS** | OVL-INJ-001 applies to every triggered PR — Pre-Brief artifact existence check |
| EXEMPT | NO | Not applicable; all tasks are qualifying |

**Primary category**: AAWP_MAT

---

## Section 3 — FFA Checks IAA Will Run at Handover

The following wave-specific FFA checks will be executed in addition to all CORE invariants
(CORE-001 through CORE-023) and the BUILD_DELIVERABLE overlay (BD-000 through BD-024).

| Check ID | Check Name | Pass Condition | Blocking? |
|----------|-----------|----------------|-----------|
| CL6-FFA-001 | RED gate sequencing proven | Test runner output showing all 12 tests in RED state EXISTS on branch BEFORE migration script commit. Foreman session memory or qa-builder PREHANDOVER proof must evidence this sequencing. | BLOCKING |
| CL6-FFA-002 | Migration script path matches declared architecture | Migration script is at `packages/ai-centre/scripts/migrate-legacy-knowledge.ts` (CEP path) OR at `src/scripts/migrate-knowledge-embeddings.ts` (pre-brief request path) — path mismatch with no architecture decision record → FAIL. One canonical path must be declared in architecture/PREHANDOVER proof before delegation. | BLOCKING |
| CL6-FFA-003 | Embedding dimension = 1536 enforced | (a) Test asserts `embedding.length === 1536`. (b) Migration script calls OpenAI `text-embedding-ada-002` or equivalent 1536-dim model. (c) No hardcoded fallback to different dimension. | BLOCKING |
| CL6-FFA-004 | Domain-tag compliance: approved labels only | All `domain` values inserted are exclusively from the approved set: `iso27001`, `nist`, `pci-dss`, `soc2`, `risk-management`, `general`, `ldcs`, `diamond-industry`. No unlisted label may be inserted. Test must verify this. | BLOCKING |
| CL6-FFA-005 | approval_status = 'pending' on all migrated rows | Migration script sets `approval_status = 'pending'` on every inserted row. Test verifies post-migration `approval_status IS 'pending'` for all migrated entries. | BLOCKING |
| CL6-FFA-006 | Pipeline 1 isolation (ADR-005 files untouched) | PR diff must NOT contain changes to: `CriteriaUpload.tsx`, `CriteriaManagementPage.tsx`, `useCriteria.ts`, `invoke-ai-parse-criteria`. Any change to these files = REJECTION-PACKAGE citing ADR-005. | BLOCKING |
| CL6-FFA-007 | RLS policy `ai_knowledge_org_insert` scoped `TO authenticated` | Schema verification SQL (010) must ALTER the existing `ai_knowledge_org_insert` policy to add `TO authenticated` clause. Current migration 008 omits this clause. Test verifies the policy has `TO authenticated`. | BLOCKING |
| CL6-FFA-008 | ARC queue integration — domain queryability confirmed | Test confirms `ai_knowledge` rows are queryable by `approval_status` and `domain` fields. Migration script correctly sets `domain` per CL-2 domain mapping. Migration report includes per-domain row counts. | BLOCKING |
| CL6-FFA-009 | Deduplication logic present and tested | Migration script uses `content_hash` (SHA-256 or equivalent) to skip rows already present in `ai_knowledge`. Test asserts dedup prevents double-insertion on re-run. | BLOCKING |
| CL6-FFA-010 | Schema verification SQL confirms no schema drift | `010_cl6_schema_verification.sql` reads current schema state and asserts expected columns, types, indexes, and RLS policies. It does NOT mutate data beyond the `TO authenticated` RLS fix. Pass = no assertion failures. | BLOCKING |
| CL6-FFA-011 | Migration report completeness | Migration report exists at declared path. Contains: legacy row count, AIMC row count (must be ≥ legacy), per-domain counts for all 8 approved domains, timestamp, confirmation status. No placeholder values. | BLOCKING |
| CL6-FFA-012 | Semantic search validation: ≥10 queries per applicable domain | Semantic search validation artifact exists. Contains ≥10 query/result pairs per domain area that has migrated content. Results must be substantive (not empty result sets). | BLOCKING |
| CL6-FFA-013 | No PR #1233 code imported directly | PR diff must not be a direct copy or continuation of PR #1233 content. Builders must produce fresh governed implementations. If git history shows a cherry-pick or direct copy from #1233 branch → REJECTION-PACKAGE. | BLOCKING |
| CL6-FFA-014 | Legacy Supabase credentials not hardcoded | Migration script must NOT contain hardcoded Supabase URLs, service role keys, or project IDs for `dmhlxhatogrrrvuruayv`. Credentials must be read from environment variables only. | BLOCKING |
| CL6-FFA-015 | Issue #1237 closure linkage declared | PREHANDOVER proof or session memory must declare that issue #1237 is linked for closure as part of CL-6 completion, per issue #1240 requirement. | BLOCKING |

---

## Section 4 — PREHANDOVER Proof Structure Required

The producing foreman/builders MUST commit a PREHANDOVER proof before invoking IAA.
Per A-029 / §4.3b architecture, the `iaa_audit_token` field is pre-populated with the
expected reference — not left as PENDING.

**Required PREHANDOVER proof YAML fields (minimum — all mandatory):**

```yaml
# PREHANDOVER PROOF — CL-6 Re-launch
wave: cl6-relaunch-20260406
branch: copilot/cl-6-relaunch-knowledge-ingestion
issue: maturion-isms#1240
cs2_authorization: "Issue #1240 opened by @APGI-cmy (CS2) 2026-04-06"
iaa_prebrief_path: .agent-admin/assurance/iaa-prebrief-cl6-relaunch-20260406.md
iaa_prebrief_sha: [SHA of this Pre-Brief commit]

producers:
  foreman: foreman-v2-agent (orchestration only — no implementation)
  schema_builder: schema-builder
  qa_builder: qa-builder
  migration_builder: api-builder OR integration-builder (declare one)

deliverables_manifest:
  CL6-D1_red_gate_tests:
    path: [declared path]
    test_count: 12
    red_evidence_path: [test runner output confirming RED before implementation]
    green_evidence_path: [test runner output confirming all 12 GREEN]
    status: DELIVERED
  CL6-D1_schema_verification:
    path: packages/ai-centre/supabase/migrations/010_cl6_schema_verification.sql
    status: DELIVERED
  CL6-D2_migration_script:
    path: [canonical path — must match architecture declaration]
    status: DELIVERED
  CL6-D3_semantic_validation:
    path: .agent-workspace/audit/LKIAC-W3-semantic-validation-[date].md
    status: DELIVERED
  CL6-D4_migration_report:
    path: .agent-workspace/audit/LKIAC-W3-migration-report-[date].md
    status: DELIVERED

red_gate_sequencing:
  qa_builder_red_commit_sha: [SHA of commit where RED tests were committed]
  migration_builder_first_commit_sha: [SHA — must be AFTER red_commit_sha]
  sequencing_confirmed: true

migration_stats:
  legacy_row_count: [N]
  aimc_row_count: [N]  # must be >= legacy_row_count
  domain_counts:
    iso27001: [N]
    nist: [N]
    pci-dss: [N]
    soc2: [N]
    risk-management: [N]
    general: [N]
    ldcs: [N]
    diamond-industry: [N]

governance_constraints_attested:
  pipeline_1_isolation: true  # CriteriaUpload.tsx et al untouched
  no_pr_1233_continuation: true
  credentials_env_vars_only: true
  issue_1237_linked_for_closure: true

session_memory_path: .agent-workspace/[builder]/memory/session-[NNN]-cl6-relaunch-20260406.md
fail_only_once_attested: true

iaa_audit_token: IAA-session-056-cl6-relaunch-20260406-PASS
```

**Critical notes for producing agents:**
- `iaa_audit_token` must contain the expected reference in format `IAA-session-056-cl6-relaunch-20260406-PASS`
- Do NOT write `PENDING` in the `iaa_audit_token` field (A-029 supersedes A-025)
- The PREHANDOVER proof is immutable post-commit — do not edit it after committing (§4.3b)
- The dedicated IAA token file will be written by IAA at Step 4.2b

---

## Section 5 — Scope Blockers and Governance Conflicts Visible Now

The following blockers and risks are identified from the available scope information.
**None of these are IAA findings — they are pre-implementation governance checks that Foreman
must resolve before delegating to builders.**

### BLOCKER-1 — Migration Script Path Conflict (MUST RESOLVE BEFORE DELEGATION)

**Severity**: BLOCKING
**Finding**: The CEP (§CL-6-D2) declares the migration script path as:
```
packages/ai-centre/scripts/migrate-legacy-knowledge.ts
```
The pre-brief request declares it as:
```
src/scripts/migrate-knowledge-embeddings.ts
```
These are two different paths. There is no Architecture Decision Record (ADR) or architecture
freeze artifact visible on the branch resolving this discrepancy.

**Required action (Foreman)**: Declare the canonical path in the architecture freeze artifact
BEFORE delegating to api-builder/integration-builder. Update the CEP or pre-brief if the
path changed. IAA will check CL6-FFA-002 against whichever path is declared in the frozen
architecture. A builder who delivers at an undeclared path will receive REJECTION-PACKAGE.

### BLOCKER-2 — AAWP CL-6 Assignment Not Confirmed (MUST VERIFY)

**Severity**: BLOCKING
**Finding**: IAA searched `governance/aimc/AIMC_AGENT_ASSIGNMENT_WAVE_PLAN.md` for CL-6
and found no explicit CL-6 row in the AAWP section. The AAWP currently only shows AIMC
Wave 1–8 (and Wave 9 sub-waves) structure. Issue #1240 requires upstream artifact alignment
confirmed before implementation begins.

**Required action (Foreman)**: Verify that AIMC_AGENT_ASSIGNMENT_WAVE_PLAN.md explicitly
assigns CL-6 to the correct builder agents, or confirm that the CEP is the governing
assignment document for LKIAC waves. If AAWP is silent on CL-6, either (a) update AAWP to
include CL-6 before delegation, or (b) document in architecture freeze why CEP alone governs.
IAA will check this at handover under CORE-006 alignment.

### BLOCKER-3 — Architecture Freeze Artifact Not Yet Committed (MUST RESOLVE BEFORE DELEGATION)

**Severity**: BLOCKING
**Finding**: Issue #1240 explicitly requires: *"Architecture must be verified as frozen before
builder delegation begins."* The branch (`copilot/cl-6-relaunch-knowledge-ingestion`) currently
contains only an "Initial plan" commit. No architecture freeze artifact is visible.

**Required action (Foreman)**: Produce the architecture freeze artifact — typically
`ARCH_FREEZE-cl6-relaunch-[date].md` in `architecture/` or equivalent path — confirming:
- CL-6 scope is frozen and matches CEP + issue #1240
- Builder assignments are declared
- Canonical migration script path is declared
- Pipeline 1 isolation boundary confirmed (ADR-005 in effect)
- Upstream alignment confirmed (FRS/TRS/App description still valid)

Only after this artifact exists may builder delegation begin.

### BLOCKER-4 — RLS Policy Gap Requires Schema Fix (SCHEMA-BUILDER MUST ADDRESS)

**Severity**: HIGH (required fix — not optional)
**Finding**: Migration `008_ai_knowledge_chunk_metadata.sql` created `ai_knowledge_org_insert`
WITHOUT a `TO authenticated` clause:
```sql
CREATE POLICY ai_knowledge_org_insert ON ai_knowledge
  FOR INSERT
  WITH CHECK (organisation_id = current_setting('app.current_organisation_id', true));
```
The pre-brief request identifies the required fix as: scope the policy `TO authenticated` only.
Without this fix, the INSERT policy applies to all roles including service_role, which may
allow unauthenticated or service-role bypass of the org isolation check.

**Required action (schema-builder)**: Migration `010_cl6_schema_verification.sql` must include:
```sql
DROP POLICY IF EXISTS ai_knowledge_org_insert ON ai_knowledge;
CREATE POLICY ai_knowledge_org_insert ON ai_knowledge
  FOR INSERT TO authenticated
  WITH CHECK (organisation_id = current_setting('app.current_organisation_id', true));
```
This is CL6-FFA-007 — a blocking FFA check at handover.

### RISK-1 — Legacy Supabase Credentials (Must Not Be Hardcoded)

**Severity**: HIGH (security requirement)
**Finding**: The migration script must connect to legacy Supabase project `dmhlxhatogrrrvuruayv`.
No credential handling pattern is declared in the pre-brief or issue scope.

**Required action (api-builder / integration-builder)**: Credentials (SUPABASE_URL,
SUPABASE_SERVICE_ROLE_KEY for both legacy and AIMC projects) must be read exclusively
from environment variables. No hardcoding permitted. CL6-FFA-014 is a blocking FFA check.
Builder must declare the env var names in PREHANDOVER proof.

### RISK-2 — PR #1233 Technical Reference Usage Must Be Documented

**Severity**: MEDIUM (governance audit trail)
**Finding**: Issue #1240 permits PR #1233 to be used as "technical reference material only."
However, if builders directly copy code from that PR without documentation, IAA cannot
distinguish fresh governed implementation from a rescue continuation.

**Required action (Foreman / Builder)**: If any technical patterns from PR #1233 are referenced
or adapted, the PREHANDOVER proof must declare: "Pattern [X] referenced from PR #1233 as
technical reference; implementation is independently produced." Wholesale code copy = FAIL.
CL6-FFA-013 is a blocking FFA check.

### RISK-3 — Issue #1237 Closure Linkage

**Severity**: LOW-MEDIUM (governance completeness)
**Finding**: Issue #1240 specifies that issue #1237 should be linked for closure as part of
CL-6 completion. No explicit link is confirmed in the current branch state.

**Required action (Foreman)**: PREHANDOVER proof must declare issue #1237 closure linkage.
CL6-FFA-015 will verify this at handover.

---

## Section 6 — Required Evidence Artifacts at IAA Invocation

When the builder(s) deliver and invoke IAA for final assurance, the following artifacts
MUST be present on the branch. Absence of any item = immediate REJECTION-PACKAGE.

| Artifact | Path | IAA Check |
|----------|------|-----------|
| IAA Pre-Brief (this file) | `.agent-admin/assurance/iaa-prebrief-cl6-relaunch-20260406.md` | OVL-INJ-001, OVL-INJ-ADM-001, OVL-INJ-ADM-002 |
| Architecture freeze artifact | `architecture/ARCH_FREEZE-cl6-relaunch-*.md` or equivalent | CORE-018 sweep prerequisite |
| PREHANDOVER proof | Committed on branch per Section 4 structure above | CORE-018, CERT-001 |
| Session memory (producing builder) | `.agent-workspace/[builder]/memory/session-*.md` | CORE-015, CERT-002 |
| RED gate test suite (12 tests) | `packages/ai-centre/src/migrations/` or equivalent | CL6-FFA-001, BD-001 |
| RED test runner output evidence | Declared in PREHANDOVER proof | CL6-FFA-001 |
| GREEN test runner output evidence | Declared in PREHANDOVER proof | BD-003 |
| Schema verification SQL | `packages/ai-centre/supabase/migrations/010_cl6_schema_verification.sql` | CL6-FFA-010 |
| Migration script | Canonical path (per architecture freeze) | CL6-FFA-002 |
| Migration report | `.agent-workspace/audit/LKIAC-W3-migration-report-[date].md` | CL6-FFA-011 |
| Semantic search validation | `.agent-workspace/audit/LKIAC-W3-semantic-validation-[date].md` | CL6-FFA-012 |

---

## Section 7 — IAA Invocation Instructions for Producing Agents

When all deliverables are complete and all evidence artifacts are on the branch:

1. Commit the PREHANDOVER proof (per Section 4 structure)
2. Commit session memory
3. Invoke IAA via:
   ```
   task(agent_type: "independent-assurance-agent", prompt: "[CL-6 final assurance — PR ready for IAA review]")
   ```
4. IAA will execute Phase 1 preflight → Phase 2 alignment → Phase 3 assurance checks
   (CORE-001 through CORE-023, BD-000 through BD-024, CL6-FFA-001 through CL6-FFA-015)
   → Phase 4 verdict
5. If ASSURANCE-TOKEN: IAA writes token file to `.agent-admin/assurance/iaa-token-session-056-cl6-relaunch-20260406.md`
6. PREHANDOVER proof is immutable post-commit — do NOT edit after initial commit

**IAA will REJECT-PACKAGE for any of the following without exception:**
- Pre-Brief artifact absent
- Architecture freeze artifact absent
- RED gate not evidenced before implementation commit
- Any of CL6-FFA-001 through CL6-FFA-015 failing
- CORE-007: placeholder/stub content in any production artifact
- CORE-017: `.github/agents/` modifications without CS2 authorization
- CL6-FFA-006: Any Pipeline 1 (ADR-005) file in diff
- CL6-FFA-014: Hardcoded credentials of any kind

---

## Section 8 — Pre-Brief Summary

| Item | Value |
|------|-------|
| Wave | CL-6 Re-launch (cl6-relaunch-20260406) |
| IAA trigger category (primary) | **AAWP_MAT** |
| Qualifying tasks | 4 (Schema SQL, RED test suite, Migration script, Report+Validation) |
| FFA checks declared | 15 (CL6-FFA-001 through CL6-FFA-015) |
| Core invariants applicable | CORE-001 through CORE-023 (all, applicable subset per category) |
| Overlay checks | BUILD_DELIVERABLE (BD-000 through BD-024), PRE_BRIEF_ASSURANCE (OVL-INJ-001) |
| Total checks at handover | Core (23) + BD overlay (~24) + CL6-FFA (15) = ~62 checks |
| Blockers identified now | 3 BLOCKING (path conflict, AAWP gap, architecture freeze absent) |
| Risks identified now | 3 (credentials, PR #1233 reference audit trail, issue #1237 linkage) |
| Pre-Brief status | **COMMITTED** |
| Next action | Foreman resolves BLOCKER-1, BLOCKER-2, BLOCKER-3 → Architecture freeze committed → Builder delegation authorized |

---

**IAA Pre-Brief issued by**: independent-assurance-agent v6.2.0
**Session**: session-056-cl6-relaunch-prebrief-20260406
**Adoption phase**: PHASE_B_BLOCKING — verdicts are hard-blocking
**Authority**: CS2 only (@APGI-cmy)
**This Pre-Brief does not constitute an ASSURANCE-TOKEN.**
**Phases 1–4 assurance will execute at handover when all deliverables are present.**
