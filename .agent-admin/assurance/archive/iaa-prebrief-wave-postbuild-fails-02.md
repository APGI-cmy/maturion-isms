# IAA Pre-Brief — Wave postbuild-fails-02 / MAT Supabase RLS Full Remediation

**Status**: ACTIVE
**Wave**: Wave postbuild-fails-02
**Session**: session-098
**Date**: 2026-03-04
**Branch**: copilot/add-wave-next-entry-supabase-rls
**Issue**: #897 — Wave Next: Foreman to orchestrate remediation for Supabase RLS failures and record all failed states
**Foreman**: foreman-v2-agent v6.2.0
**CS2 Authorization**: Issue #897 (opened by CS2 @APGI-cmy)
**IAA Agent**: independent-assurance-agent v6.2.0
**IAA Adoption Phase**: PHASE_B_BLOCKING — Hard gate ACTIVE
**Pre-Brief invoked by**: foreman-v2-agent (session-098) via PRE-BRIEF action comment
**Authority**: CS2 only (@APGI-cmy)

---

## Purpose

This Pre-Brief declares, per qualifying wave task, the exact assurance requirements IAA will
check at handover. Its purpose is to shift assurance left: builders build knowing the
acceptance bar rather than discovering it at rejection.

**Builders must read this document before beginning their tasks. Failure to satisfy any
declared requirement will result in REJECTION-PACKAGE at handover with no exceptions.**

---

## Wave Context Summary

This wave remediates all remaining Supabase RLS gaps identified in `supabase-sync-audit-20260304.md`:

- **GAP-001 to GAP-005**: Fixed in Wave postbuild-fails-01 (PR #895 — ASSURANCE-TOKEN: IAA-session-097-20260304-PASS)
- **GAP-006 to GAP-013**: OPEN — target of this wave (organisations, domains, mini_performance_standards, criteria, evidence, scores, organisation_settings, audit_scores)

**Prior session learning notes applied** (from session-097-20260304):
1. **A-021 pattern (2x in prior wave)**: PREHANDOVER proof MUST be committed BEFORE invoking IAA. Untracked files are invisible to CI and IAA. Commit-then-invoke is mandatory, not optional.
2. **A-026 pattern**: SCOPE_DECLARATION.md must be updated per PR diff. Stale SCOPE_DECLARATION from a different PR is an immediate FAIL.
3. **A-029 (effective 2026-03-04)**: Post-2026-03-04 PREHANDOVER proofs MUST have `iaa_audit_token` pre-populated with the expected reference (`IAA-session-NNN-waveY-YYYYMMDD-PASS`) — NOT `PENDING`. `PENDING` is now a protocol violation.
4. **OVL-AM-008**: End-to-end wiring trace is mandatory for schema migration PRs. The supabase-sync-audit document from prior wave provides an excellent template for this — reference it and extend it.

---

## Qualifying Task Classification

All 5 wave tasks qualify for IAA assurance per the trigger table. Category applied: **AAWP_MAT**
(files match MAT path patterns: `modules/mat/` and `apps/maturion-maturity-legacy/supabase/`).
IAA trigger is mandatory for all. Adoption phase: **PHASE_B_BLOCKING**.

| # | Task | Builder | Category | Tier | IAA Required |
|---|------|---------|----------|------|-------------|
| 1 | Add 'Wave postbuild-fails-02' entry to implementation-plan.md | foreman | AAWP_MAT | T2-doc | YES — MANDATORY |
| 2 | Record GAP-006–GAP-013 in BUILD_PROGRESS_TRACKER.md | foreman | AAWP_MAT | T2-doc | YES — MANDATORY |
| 3 | Update App Description, FRS, TRS — mark RLS sections RED | foreman | AAWP_MAT | T2-doc | YES — MANDATORY |
| 4 | RED gate QA tests T-PBF2-001 to T-PBF2-008 | qa-builder | AAWP_MAT | T2-build | YES — MANDATORY |
| 5 | RLS policy migrations for all remaining tables | schema-builder | AAWP_MAT | T2-build | YES — MANDATORY |

> **PR structure note**: If Tasks 1–3 (Foreman governance docs) and Tasks 4–5 (builder deliverables)
> are delivered in a single PR, the **highest tier governs** (T2-build / full FFA-01 through FFA-05).
> If delivered in separate PRs, each PR is subject to its own ceremony level as declared below.
> IAA is required for all PRs regardless of structure.

---

## Task 1 — Add 'Wave postbuild-fails-02' Entry to Implementation Plan

```yaml
task_id: TASK-PBF2-001
task_summary: >
  Add a 'Wave postbuild-fails-02' entry to modules/mat/03-implementation-plan/implementation-plan.md
  defining full RLS remediation scope for GAP-006 through GAP-013.
builder: foreman-v2-agent
file_paths:
  - modules/mat/03-implementation-plan/implementation-plan.md
iaa_trigger_category: AAWP_MAT
iaa_trigger_reason: >
  File path matches MAT path pattern (modules/mat/). AAWP_MAT trigger is mandatory per iaa-trigger-table.md.
  AMBIGUITY RULE applied: doc-only MAT files default to mandatory IAA invocation.
risk_tier: T2-doc (documentation update within MAT module — no migrations or hooks)
ceremony_required: Full Five-Phase
iaa_required: YES
ffa_required:
  FFA-01 (Delivery Completeness): NOT APPLICABLE — document-only change; no executable paths added. Must be stated explicitly with justification in PREHANDOVER.
  FFA-02 (Wiring Verification): NOT APPLICABLE — no schema writes, no API endpoints, no Supabase operations. Must be stated explicitly with justification.
  FFA-03 (Cross-Delivery Integration): NOT APPLICABLE — documentation does not depend on executable deliverables at PR level.
  FFA-04 (Supabase Alignment): NOT APPLICABLE — no table references.
  FFA-05 (Carry-Forward Mandate): APPLICABLE — if this wave entry references GAP-006 to GAP-013 fixes as "planned", IAA will confirm the scope declared matches the tasks in wave-current-tasks.md.

required_phases:
  - Phase 1 (Preflight Proof): Agent identity, Tier 1 + Tier 2 citations with versions, FAIL-ONLY-ONCE attestation, OPOJD confirmation
  - Phase 2 (Governance Proof): MAT_APP_CANON.md + INDEPENDENT_ASSURANCE_AGENT_CANON.md cited with versions; canon hash validation performed; GATE_REQUIREMENTS_INDEX.json referenced
  - Phase 3 (Working Phase Proof): Rationale for wave entry content; scope definition for GAP-006 to GAP-013; design decisions documented
  - Phase 4 (Handover Proof): PREHANDOVER proof committed; GREEN state declared; OPOJD confirmed; SCOPE_DECLARATION.md updated to match diff; improvement suggestions parked not inline; `iaa_audit_token` pre-populated (NOT PENDING — A-029)

required_evidence_artifacts:
  - .agent-admin/prehandover/prehandover_proof-wave-postbuild-fails-02-task1.md (or combined with tasks 2–3)
  - Session memory file (.agent-workspace/foreman-v2/memory/session-*.md) committed on branch
  - Updated modules/mat/03-implementation-plan/implementation-plan.md with 'Wave postbuild-fails-02' section
  - SCOPE_DECLARATION.md updated and matching the diff (not stale from another PR)

applicable_overlays:
  - AAWP_MAT overlay (OVL-AM-001 through OVL-AM-008)

specific_rules:
  OVL-AM-001: No stub/TODO content in deliverable — wave entry must be complete, not placeholder
  OVL-AM-002: Evidence artifacts present — supabase-sync-audit-20260304.md referenced as source of truth
  OVL-AM-003: Governance alignment — wave entry must align with GAP-006 to GAP-013 from the audit doc
  OVL-AM-004: Architecture ripple/impact plan — PREHANDOVER must state "no schema/data model impact" with justification (doc-only change)
  OVL-AM-005: Wave gap register trace — PREHANDOVER must link to supabase-sync-audit-20260304.md as the gap register
  OVL-AM-006: Environment parity — PREHANDOVER must explicitly state "document-only, no environment impact"
  OVL-AM-007: Session memory learning note — at least one concrete non-blank learning note required
  OVL-AM-008: End-to-end wiring trace — NOT APPLICABLE for doc-only change; must be explicitly stated with justification
  CORE-016: iaa_audit_token must be pre-populated with expected IAA reference (NOT PENDING — A-029)
  CORE-018: All 4 evidence sweep conditions must be satisfied before IAA invocation
  CORE-019: iaa_audit_token cross-verification will be run at handover
  A-021: PREHANDOVER proof MUST be committed and pushed BEFORE invoking IAA
  A-026: SCOPE_DECLARATION.md must declare exactly the files changed in this task's diff
  A-029: No PENDING tokens on post-2026-03-04 PREHANDOVER proofs
```

---

## Task 2 — Record GAP-006 to GAP-013 in BUILD_PROGRESS_TRACKER.md

```yaml
task_id: TASK-PBF2-002
task_summary: >
  Record ALL failures from supabase-sync-audit-20260304.md in BUILD_PROGRESS_TRACKER.md.
  GAP-001–GAP-005 were fixed in postbuild-fails-01. GAP-006 to GAP-013 (organisations, domains,
  mini_performance_standards, criteria, evidence, scores, organisation_settings, audit_scores)
  must be recorded as OPEN/RED in the tracker with full detail.
builder: foreman-v2-agent
file_paths:
  - modules/mat/BUILD_PROGRESS_TRACKER.md
iaa_trigger_category: AAWP_MAT
iaa_trigger_reason: >
  File path matches MAT path pattern (modules/mat/). BUILD_PROGRESS_TRACKER.md is a
  MAT governance deliverable. AAWP_MAT trigger is mandatory.
risk_tier: T2-doc (governance/tracking document — no executable code)
ceremony_required: Full Five-Phase
iaa_required: YES
ffa_required:
  FFA-01 (Delivery Completeness): APPLICABLE (scoped) — all 8 remaining gaps (GAP-006 to GAP-013) must be recorded. IAA will count entries and verify completeness against supabase-sync-audit-20260304.md.
  FFA-02 (Wiring Verification): NOT APPLICABLE — no schema writes. Must be explicitly stated.
  FFA-03 (Cross-Delivery Integration): APPLICABLE (scoped) — GAP-001 to GAP-005 entries must remain CLOSED/GREEN. No regression of prior wave's recorded state.
  FFA-04 (Supabase Alignment): NOT APPLICABLE — document-only. Must be explicitly stated.
  FFA-05 (Carry-Forward Mandate): APPLICABLE — if GAP-001 to GAP-005 are present but marked OPEN, that is a regression and will generate a CFM.

required_phases:
  - Phase 1 (Preflight Proof): As per Task 1 (may share combined proof if same PR)
  - Phase 2 (Governance Proof): As per Task 1 (may share combined proof if same PR)
  - Phase 3 (Working Phase Proof): Rationale for each GAP entry recorded; mapping from audit doc to tracker
  - Phase 4 (Handover Proof): All 8 gaps (GAP-006 to GAP-013) confirmed recorded; GAP-001–GAP-005 still CLOSED confirmed; `iaa_audit_token` pre-populated

required_evidence_artifacts:
  - PREHANDOVER proof (may be combined with Tasks 1 + 3)
  - Updated modules/mat/BUILD_PROGRESS_TRACKER.md with 8 new GAP entries
  - Session memory on branch
  - SCOPE_DECLARATION.md matching diff

applicable_overlays:
  - AAWP_MAT overlay (OVL-AM-001 through OVL-AM-008)

specific_rules:
  OVL-AM-001: All 8 GAP entries must be complete — no placeholders. Each entry must include: table name, gap description, priority, and status (OPEN/RED).
  OVL-AM-002: supabase-sync-audit-20260304.md must be cited as the authoritative source
  OVL-AM-003: Entries must align precisely with GAP-006 to GAP-013 definitions in the audit doc
  OVL-AM-004: "Document-only change — no schema/data model impact" must be explicitly stated
  OVL-AM-005: supabase-sync-audit-20260304.md is the gap register — reference it explicitly
  OVL-AM-006: No environment impact — must be explicitly stated
  OVL-AM-007: Learning note required — session memory must be non-blank
  OVL-AM-008: NOT APPLICABLE for doc-only change — must be stated with justification
  COMPLETENESS_CHECK: IAA will independently count GAP entries in the updated BUILD_PROGRESS_TRACKER.md and verify all 13 gaps (001–013) are present. A tracker missing any gap = REJECTION-PACKAGE.
  A-021 / A-026 / A-029: As declared in Task 1.
```

---

## Task 3 — Update App Description, FRS, TRS — Mark RLS Sections RED

```yaml
task_id: TASK-PBF2-003
task_summary: >
  Update modules/mat/00-app-description/app-description.md,
  modules/mat/01-frs/functional-requirements.md (FR-084–FR-088), and
  modules/mat/01.5-trs/technical-requirements-specification.md (TR-084–TR-088)
  to mark all RLS-incomplete sections as RED / Needs Remediation.
builder: foreman-v2-agent
file_paths:
  - modules/mat/00-app-description/app-description.md
  - modules/mat/01-frs/functional-requirements.md
  - modules/mat/01.5-trs/technical-requirements-specification.md
iaa_trigger_category: AAWP_MAT
iaa_trigger_reason: >
  Files match MAT path patterns. FRS and TRS are MAT module deliverables.
  AAWP_MAT trigger is mandatory per trigger table.
risk_tier: T2-doc (governance documents — no executable code)
ceremony_required: Full Five-Phase
iaa_required: YES
ffa_required:
  FFA-01 (Delivery Completeness): APPLICABLE (scoped) — all affected FR/TR entries for the 8 remaining tables must be marked. IAA will verify FR-084–FR-088 and TR-084–TR-088 are updated.
  FFA-02 (Wiring Verification): NOT APPLICABLE — document-only. Must be explicitly stated.
  FFA-03 (Cross-Delivery Integration): APPLICABLE (scoped) — previously-GREEN FR/TR entries (for profiles/audits) must not be regressed to RED. IAA will spot-check.
  FFA-04 (Supabase Alignment): NOT APPLICABLE — document-only. Must be explicitly stated.
  FFA-05 (Carry-Forward Mandate): APPLICABLE — if any table with open RLS gaps is NOT marked RED in FRS/TRS, IAA will issue a CFM requiring correction before merge.

required_phases:
  - Phase 1 (Preflight Proof): May share combined proof with Tasks 1 + 2 if same PR
  - Phase 2 (Governance Proof): May share combined proof; cite MAT_APP_CANON.md and FR/TRS governance standards
  - Phase 3 (Working Phase Proof): Document which FR/TR entries were changed; justify RED classification against audit gaps
  - Phase 4 (Handover Proof): Confirm all 8 RLS-incomplete tables are marked RED in FRS + TRS + App Description; GREEN entries for profiles/audits untouched; `iaa_audit_token` pre-populated

required_evidence_artifacts:
  - PREHANDOVER proof (may be combined with Tasks 1 + 2)
  - Updated modules/mat/00-app-description/app-description.md
  - Updated modules/mat/01-frs/functional-requirements.md (FR-084–FR-088 marked RED)
  - Updated modules/mat/01.5-trs/technical-requirements-specification.md (TR-084–TR-088 marked RED)
  - Session memory on branch
  - SCOPE_DECLARATION.md updated to include all 3 modified files

applicable_overlays:
  - AAWP_MAT overlay (OVL-AM-001 through OVL-AM-008)

specific_rules:
  OVL-AM-001: No placeholder RED markings — each entry must include actual justification referencing the specific gap (table + gap type)
  OVL-AM-003: Alignment — RED markings must map to the 8 open gaps from supabase-sync-audit-20260304.md. No extra tables marked RED without audit evidence; no required tables omitted.
  OVL-AM-004: "Document-only change — no schema/data model impact" explicitly stated in PREHANDOVER
  OVL-AM-005: Wave gap register trace — link to supabase-sync-audit-20260304.md
  OVL-AM-008: NOT APPLICABLE for doc-only change — must be stated with justification
  REGRESSION_CHECK: IAA will verify that FR/TR entries covering profiles (GAP-001–003) and audits (GAP-004) retain their GREEN status from postbuild-fails-01. Regression = immediate CFM.
  SCOPE_COMPLETENESS: SCOPE_DECLARATION.md must list all 3 files (app-description.md, functional-requirements.md, technical-requirements-specification.md). Missing any = FAIL on A-026.
  A-021 / A-026 / A-029: As declared in Task 1.
```

---

## Task 4 — RED Gate QA Tests T-PBF2-001 to T-PBF2-008

```yaml
task_id: TASK-PBF2-004
task_summary: >
  Implement RED gate QA tests T-PBF2-001 to T-PBF2-008 in
  modules/mat/tests/security-rls/ (or equivalent path) asserting that RLS policies
  exist for the 8 remaining tables: evidence, scores, audit_scores,
  organisation_settings, criteria, domains, organisations, mini_performance_standards.
  These tests must be RED at time of PR submission (schema-builder has not yet written
  the policies). Tests turn GREEN after Task 5 migrations land.
builder: qa-builder
file_paths:
  - modules/mat/tests/security-rls/wave-postbuild-fails-02.test.ts (expected path)
iaa_trigger_category: AAWP_MAT
iaa_trigger_reason: >
  Test files in modules/mat/ path. MAT build deliverable. T2 full FFA required.
  Prior wave pattern (T-PBF-001 to T-PBF-004) was at this same path.
risk_tier: T2-build
ceremony_required: Full Five-Phase + all FFA checks
iaa_required: YES
ffa_required:
  FFA-01 (Delivery Completeness): APPLICABLE — all 8 test IDs (T-PBF2-001 to T-PBF2-008) must be present. Each test must assert the presence of an RLS policy for its designated table. No missing tests. IAA will count test IDs.
  FFA-02 (Wiring Verification): APPLICABLE — each test must reference the correct table name. Column references must match the migration schema (once schema-builder delivers Task 5). Tests must be technically correct (not just syntactically present).
  FFA-03 (Cross-Delivery Integration): APPLICABLE — tests from prior wave (T-PBF-001 to T-PBF-004) in wave-postbuild-fails-01.test.ts must not be modified or regressed. IAA will verify prior test file is unchanged.
  FFA-04 (Supabase Alignment): APPLICABLE (scoped) — test targets must align with tables confirmed in supabase-sync-audit-20260304.md. No phantom table references.
  FFA-05 (Carry-Forward Mandate): APPLICABLE — if any of the 8 tables from GAP-006 to GAP-013 is missing from test coverage, IAA will issue a CFM.

required_phases:
  - Phase 1 (Preflight Proof): qa-builder identity, version, FAIL-ONLY-ONCE attestation
  - Phase 2 (Governance Proof): Cite QA_BUILDER_CANON.md + MAT_APP_CANON.md; canon hash validation
  - Phase 3 (Working Phase Proof): Design rationale for each test; why these 8 tables; why RED-gate pattern matches prior wave approach
  - Phase 4 (Handover Proof): All 8 tests confirmed RED (expected, since migrations not yet applied); test file committed; PREHANDOVER proof committed; `iaa_audit_token` pre-populated

required_evidence_artifacts:
  - .agent-admin/prehandover/prehandover_proof-wave-postbuild-fails-02-task4.md
  - modules/mat/tests/security-rls/wave-postbuild-fails-02.test.ts with T-PBF2-001 to T-PBF2-008
  - Test run output showing RED state for all 8 tests (screenshot or pasted output)
  - Session memory committed on branch
  - SCOPE_DECLARATION.md updated

applicable_overlays:
  - AAWP_MAT overlay (OVL-AM-001 through OVL-AM-008)

specific_rules:
  OVL-AM-001: No placeholder test bodies — each test must have substantive assertions
  OVL-AM-002: Test evidence bundle — QA test plan or description confirming RED-gate intent
  OVL-AM-003: Alignment — each T-PBF2-NNN test must map to a specific GAP-NNN entry from the audit doc. This mapping must be documented in the test file comments.
  OVL-AM-004: Architecture ripple/impact plan — confirm tests do not modify schema, add to or break existing RLS policies, or alter hook behaviour
  OVL-AM-005: Wave gap register trace — PREHANDOVER must link tests to supabase-sync-audit-20260304.md GAP entries
  OVL-AM-006: Environment parity — confirm tests run against the same Supabase migration stack in all environments
  OVL-AM-007: Session memory learning note — at least one concrete non-blank note (e.g., how RED-gate was verified)
  OVL-AM-008: End-to-end wiring trace — APPLICABLE (scoped): For the test file itself: (a) Writers — the tests assert RLS policy presence only, they do not write to tables; (b) Readers — each test reads policy metadata from Supabase; (c) Auth/RLS model — confirm which Supabase key the tests use (anon key expected); (d) Shape — confirm the assertion shape matches Supabase policy metadata format; (e) FK — N/A for test-only file.
  RED_STATE_EVIDENCE: IAA requires evidence that tests are RED before Task 5 migrations land. Acceptable: pasted test run output with all 8 tests FAIL. Unacceptable: asserted without evidence.
  PRIOR_WAVE_REGRESSION: IAA will check that wave-postbuild-fails-01.test.ts is unmodified. Any modification = immediate FAIL unless justified.
  A-021 / A-026 / A-029: As declared in Task 1.
```

---

## Task 5 — RLS Policy Migrations for All Remaining Tables

```yaml
task_id: TASK-PBF2-005
task_summary: >
  Implement SQL migration file(s) in apps/maturion-maturity-legacy/supabase/migrations/
  adding RLS INSERT/UPDATE policies for all 8 remaining tables:
    - organisations: INSERT + UPDATE (org-owner isolation)
    - domains: INSERT + UPDATE (org-isolation)
    - criteria: INSERT + UPDATE (org-isolation)
    - evidence: INSERT + UPDATE + DELETE (user + org-isolation)
    - scores: INSERT + UPDATE (user + org-isolation)
    - organisation_settings: INSERT + UPDATE (org-owner isolation)
    - audit_scores: INSERT + UPDATE (org-isolation)
    - mini_performance_standards: read-only guard (service_role write only — org-isolation SELECT)
builder: schema-builder
file_paths:
  - apps/maturion-maturity-legacy/supabase/migrations/20260304XXXXXX_fix_rls_policies_postbuild02.sql
iaa_trigger_category: AAWP_MAT
iaa_trigger_reason: >
  SQL migration files in Supabase migrations path. T2 build deliverable — schema migration.
  IAA mandatory per trigger table (MAT deliverable, schema migration).
risk_tier: T2-build (HIGHEST RISK IN THIS WAVE)
ceremony_required: Full Five-Phase + all FFA checks + OVL-AM-008 mandatory
iaa_required: YES — HIGHEST CEREMONY LEVEL
ffa_required:
  FFA-01 (Delivery Completeness): MANDATORY — all 8 tables must have complete RLS policies. No partial migrations (e.g., INSERT policy without UPDATE policy where both are declared as gaps). Evidence required that migration is complete and not dependent on future deliverables.
  FFA-02 (Wiring Verification): MANDATORY — for every .from('table').insert()/.update()/.upsert() call in the frontend hooks corresponding to these tables, confirm: (a) table exists in migration, (b) written columns exist, (c) column types match, (d) RLS policy is consistent with anon key runtime, (e) FK references resolve. This is the hardest FFA check — must be evidenced, not asserted.
  FFA-03 (Cross-Delivery Integration): MANDATORY — migration must not break prior wave's policies for profiles/audits. Confirm via "IF NOT EXISTS" guards or equivalent. IAA will check for policy name collisions.
  FFA-04 (Supabase Alignment): MANDATORY — for every table: RLS enabled (confirm pre-existing per audit), all written columns exist (confirm against prior migrations), column types confirmed, org-isolation policy present for multi-tenant tables, FK chain resolves.
  FFA-05 (Carry-Forward Mandate): MANDATORY — if any table has additional gaps beyond what the migration covers (e.g., DELETE policy on evidence not included), IAA will issue a CFM identifying the gap. CFM must be resolved before merge or explicitly tracked with CS2-approved deferral.

required_phases:
  - Phase 1 (Preflight Proof): schema-builder identity, version, FAIL-ONLY-ONCE attestation, OPOJD confirmation
  - Phase 2 (Governance Proof): SCHEMA_BUILDER_CANON.md + MAT_APP_CANON.md + INDEPENDENT_ASSURANCE_AGENT_CANON.md cited; canon hash validation performed; GATE_REQUIREMENTS_INDEX.json referenced
  - Phase 3 (Working Phase Proof): Policy design decisions per table (RLS pattern used, isolation level, key type); alternatives considered; migration order and timestamp verified; pre-existing RLS status per table (from audit doc) confirmed correct
  - Phase 4 (Handover Proof): All 8 tables' policies present in migration SQL; migration file committed and pushed; T-PBF2-001 to T-PBF2-008 test GREEN evidence provided; PREHANDOVER proof committed; `iaa_audit_token` pre-populated (expected reference format); SCOPE_DECLARATION.md matches diff; improvement suggestions parked not inline

required_evidence_artifacts:
  - .agent-admin/prehandover/prehandover_proof-wave-postbuild-fails-02-task5.md
  - apps/maturion-maturity-legacy/supabase/migrations/20260304XXXXXX_fix_rls_policies_postbuild02.sql (full migration SQL)
  - Test run output showing T-PBF2-001 to T-PBF2-008 GREEN after migration
  - End-to-End Wiring Trace (OVL-AM-008) — see specific_rules below
  - Session memory committed on branch
  - SCOPE_DECLARATION.md updated

applicable_overlays:
  - AAWP_MAT overlay (OVL-AM-001 through OVL-AM-008) — ALL checks APPLICABLE

specific_rules:
  OVL-AM-001: Migration SQL must be complete — no TODO or placeholder policy bodies
  OVL-AM-002: Evidence bundle: supabase-sync-audit-20260304.md cited; test results pasted
  OVL-AM-003: Governance alignment — every policy name must match a pattern consistent with existing conventions (e.g., `<table>_insert_<scope>`, `<table>_update_<scope>`) as established in the prior wave migration
  OVL-AM-004: Architecture ripple/impact plan: list all frontend hooks affected by these new policies; confirm no hook will be newly broken. Prior policies (profiles/audits) explicitly confirmed as unaffected.
  OVL-AM-005: Wave gap register trace: PREHANDOVER must link each policy to its GAP entry (e.g., "organisations INSERT policy resolves GAP-006")
  OVL-AM-006: Environment parity: confirm migration will execute cleanly in dev/staging/production; no environment-specific SQL; migration timestamp is unique
  OVL-AM-007: Session memory learning note: at least one concrete non-blank note (e.g., any surprise encountered during RLS design for a specific table)
  OVL-AM-008 (MANDATORY — END-TO-END WIRING TRACE):
    The PREHANDOVER proof MUST include an 'End-to-End Wiring Trace' section with ALL of the following:
    (a) Writers — for each table: which runtime client writes to it (anon key / service role / edge function). List the specific hook name.
        Evidence required per table:
        - organisations: which hook writes? (useOrganisations, admin function, sign-up flow?)
        - domains: which hook writes? (useDomains?)
        - criteria: which hook writes? (useCreateCriteria?)
        - evidence: which hook writes? (useCreateEvidence, useEvidence?)
        - scores: which hook writes? (useSubmitScore, useScores?)
        - organisation_settings: which hook writes? (useOrganisationSettings?)
        - audit_scores: which hook writes? (useAuditScores?)
        - mini_performance_standards: READ-ONLY — confirm no hook writes directly (service_role only)
    (b) Readers — which hooks SELECT from each table; confirm SELECT policies already exist (from audit doc) or are added in this migration
    (c) Shape compatibility — confirm writer payload fields map to migration columns; no field name mismatches
    (d) Auth/RLS model — for each table: state which Supabase key the writer uses; confirm the new INSERT/UPDATE policy is compatible with that key (anon key = RLS applies; service role = bypasses RLS)
    (e) FK/dependency chain — confirm all FK references in new policies resolve. Specifically: evidence.audit_id → audits.id; audit_scores.audit_id → audits.id; organisation_settings.organisation_id → organisations.id. Each FK must be explicitly confirmed.
    An absent, blank, or boilerplate wiring trace = REJECTION-PACKAGE (no exceptions).

  POLICY_NAME_CONVENTION: All new policy names must follow the convention established in migration 20260304000003 (postbuild-fails-01):
    - `<table>_select_<scope>` | `<table>_insert_<scope>` | `<table>_update_<scope>` | `<table>_delete_<scope>`
    - Scope values: `own` (uid-scoped), `authenticated` (role-scoped), `org_isolation` (org-scoped)
    Any deviation must be justified in Phase 3 Working Proof.

  MINI_PERFORMANCE_STANDARDS_SPECIAL_RULE: This table is listed as "read-only" (service_role write only). The policy must implement a SELECT guard for org-isolation AND must NOT add an INSERT/UPDATE policy for the anon key. If an INSERT/UPDATE policy for mini_performance_standards is added with anon key access, IAA will issue a CFM flagging the security over-grant.

  EVIDENCE_DELETE_POLICY: Evidence table is flagged for INSERT + UPDATE + DELETE per task summary. The migration must include all three operations. Missing DELETE policy for evidence = CFM (FFA-05 will fire).

  PRIOR_WAVE_COLLISION_CHECK: IAA will grep the new migration for policy names `profiles_select_own`, `profiles_insert_own`, `profiles_update_own`, `audits_insert_authenticated`, `audits_org_isolation`. If any are present without "IF NOT EXISTS" or "DROP IF EXISTS" guard → REJECTION-PACKAGE (prior wave regression).

  A-021: PREHANDOVER proof AND migration SQL must both be committed and pushed BEFORE invoking IAA.
  A-026: SCOPE_DECLARATION.md must list the migration file path. If test files are also in this PR, all test files must be listed.
  A-029: `iaa_audit_token` MUST NOT be PENDING. Expected format: `IAA-session-NNN-waveY-YYYYMMDD-PASS`.
```

---

## Consolidated PR Ceremony Note

If all 5 tasks are delivered in a **single PR** on branch `copilot/add-wave-next-entry-supabase-rls`,
the ceremony level is determined by the **highest-risk task** (Task 5 — T2-build with full FFA).

The PREHANDOVER proof may be combined but must address:
- [ ] All 5 task deliverables explicitly
- [ ] Phase 1–4 for each contributing builder (foreman-v2-agent, qa-builder, schema-builder)
- [ ] OVL-AM-008 wiring trace (mandatory — Task 5)
- [ ] All 8 test results GREEN (T-PBF2-001 to T-PBF2-008)
- [ ] All GAP-006 to GAP-013 policies confirmed in migration SQL
- [ ] SCOPE_DECLARATION.md listing ALL modified files across all 5 tasks
- [ ] `iaa_audit_token` pre-populated with expected IAA session reference

If tasks are split into **separate PRs** (recommended for builder boundary clarity):
- **PR A** (Foreman — Tasks 1–3): AAWP_MAT T2-doc ceremony; OVL-AM-008 explicitly NA
- **PR B** (QA builder — Task 4): AAWP_MAT T2-build; RED evidence required at time of PR
- **PR C** (Schema builder — Task 5): AAWP_MAT T2-build; Full FFA + OVL-AM-008 mandatory
  - PR C should ideally merge AFTER PR B (QA tests define the bar before migration satisfies it)

---

## Critical Warnings (learning from session-097 — prior wave)

> **⚠️ WARNING 1 — A-021 (COMMITTED BEFORE INVOKE)**  
> Two consecutive REJECTION-PACKAGEs in prior wave were caused by invoking IAA before committing PREHANDOVER artifacts.  
> **Rule**: Run `git status && git log --oneline origin/main..HEAD` and paste output verbatim in PREHANDOVER before invoking IAA. CI cannot see untracked/unstaged files.

> **⚠️ WARNING 2 — A-029 (NO PENDING TOKENS)**  
> Effective 2026-03-04: `iaa_audit_token: PENDING` in a PREHANDOVER proof is a protocol violation.  
> **Rule**: Before invoking IAA, set `iaa_audit_token` to the expected session reference. Format: `IAA-session-NNN-waveY-YYYYMMDD-PASS`.  
> The exact session number will be assigned by IAA at handover — coordinate with IAA to determine the expected session number before committing.

> **⚠️ WARNING 3 — A-026 (SCOPE_DECLARATION.md)**  
> Stale SCOPE_DECLARATION.md (from a different PR) caused failures in multiple prior sessions.  
> **Rule**: Update SCOPE_DECLARATION.md as part of the same commit as your deliverable. It must list ONLY the files changed in the current PR — not more, not less.

> **⚠️ WARNING 4 — OVL-AM-008 (WIRING TRACE — TASK 5)**  
> Prior PR #865, #868 failed this check. The check is substantive: Writers, Readers, Shape, Auth/RLS, FK — each with named evidence per table.  
> **Rule**: Do not write a generic paragraph. Fill in each of the 5 sub-sections per table. "Not applicable" for items that truly don't apply — but must be stated explicitly.

---

## Pre-Brief Amendment Protocol

This Pre-Brief is the authoritative acceptance bar for wave postbuild-fails-02.

If wave scope changes after this Pre-Brief is issued (tasks added, removed, or materially changed):
1. Foreman must request an amended Pre-Brief from IAA
2. IAA will mark this artifact `SUPERSEDED` and generate `iaa-prebrief-wave-postbuild-fails-02-v2.md`
3. No new tasks may be added to the wave without an amended Pre-Brief covering those tasks

Foreman additions acknowledged: This Pre-Brief covers Tasks 1–5 as declared in wave-current-tasks.md.
Any additional task (e.g., data migration, hook-level fix) requires Pre-Brief amendment before builder execution.

---

## Sign-off

This Pre-Brief was generated by:

**Agent**: independent-assurance-agent
**Version**: 6.2.0
**Session**: session-098
**Date**: 2026-03-04
**Phase**: Phase 0 — PRE-BRIEF (not a Phase 2–4 assurance review)
**Adoption phase**: PHASE_B_BLOCKING
**Authority**: CS2 only (@APGI-cmy)

This Pre-Brief does NOT constitute an ASSURANCE-TOKEN. It is a declaration of requirements.
ASSURANCE-TOKEN will be issued separately at handover after each PR is submitted for Phase 2–4 review.

---

*Pre-Brief artifact path: `.agent-admin/assurance/iaa-prebrief-wave-postbuild-fails-02.md`*
*Generated as part of Phase 0 Pre-Brief Protocol per INDEPENDENT_ASSURANCE_AGENT_CANON.md v1.3.0 §Proactive Assurance*
