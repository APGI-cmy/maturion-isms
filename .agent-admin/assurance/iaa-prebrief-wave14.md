# IAA Pre-Brief — Wave 14 / Governance Remediation: UX Workflow Gaps

**Status**: ACTIVE
**Wave**: Wave 14
**Pre-Brief Date**: 2026-03-04
**Issue**: #909 — Governance compliance: UX workflow gaps (GAP-W01 to GAP-W14)
**Source Authority Document**: `modules/mat/00-app-description/MAT_UX_WORKFLOW_AND_WIRING.md` (v1.0, CS2 direct, 2026-03-04)
**Foreman**: foreman-v2-agent
**CS2 Authorization**: Issue #909 (opened by CS2 @APGI-cmy)
**IAA Agent**: independent-assurance-agent v6.2.0
**IAA Adoption Phase**: PHASE_B_BLOCKING — Hard gate ACTIVE
**Pre-Brief invoked by**: foreman-v2-agent via PRE-BRIEF action (Wave 14 start)
**Authority**: CS2 only (@APGI-cmy)
**Next IAA session (expected)**: session-133 or higher (assigned at handover invocation)

---

## Purpose

This Pre-Brief declares, per qualifying wave task, the exact assurance requirements IAA will
check at handover. Its purpose is to shift assurance left: Foreman and builders build knowing
the acceptance bar rather than discovering it at rejection.

**Foreman and all builders must read this document before beginning Wave 14 tasks.**
**Failure to satisfy any declared requirement will result in REJECTION-PACKAGE at handover.**
**Zero exceptions under PHASE_B_BLOCKING.**

---

## Wave Context Summary

Wave 14 remediates governance compliance failures identified in issue #909 (CS2 direct).
The source authority document — `MAT_UX_WORKFLOW_AND_WIRING.md` v1.0 (2026-03-04) — defines
14 UX workflow gaps (GAP-W01 to GAP-W14) that are not currently captured in the MAT FRS, TRS,
or QA specifications.

**Gap scope**: GAP-W01 through GAP-W14 — UX workflow wiring gaps in the MAT application.
**FR scope**: FR-089 to FR-102 (14 new functional requirements).
**TR scope**: TR-089 to TR-102 (14 new technical requirements).
**QA scope**: 16 RED test descriptions (RED QA suite spec, not yet implemented).
**Planning scope**: Implementation plan Wave 14 entry + BUILD_PROGRESS_TRACKER governance failure heading.

**Prior session learning notes applied** (from session-132, session-130, session-131):
1. **A-021 (persistent pattern)**: PREHANDOVER proof MUST be committed and pushed BEFORE invoking IAA.
   Untracked/unstaged files are invisible to CI and IAA. Commit-then-invoke is non-negotiable.
2. **A-029 (effective 2026-03-04)**: `iaa_audit_token` in PREHANDOVER proof must be pre-populated with
   the expected reference format `IAA-session-NNN-wave14-YYYYMMDD-PASS` — NOT `PENDING`, NOT blank.
3. **A-026 (persistent pattern)**: SCOPE_DECLARATION.md must be updated to exactly match the diff of
   this wave's PR. Stale SCOPE_DECLARATION from a prior PR = immediate FAIL.
4. **OVL-AM-001**: All FRS/TRS/planning artifacts must be complete — no placeholders, no stub sections.
   Every FR and TR must have id, title, description, acceptance criteria, and priority.
5. **Source authority trace**: All deliverables in this wave must trace back to
   `MAT_UX_WORKFLOW_AND_WIRING.md` explicitly. IAA will verify this trace is documented in the
   PREHANDOVER proof. Missing trace = REJECTION-PACKAGE.

---

## Qualifying Task Classification

All 5 wave tasks qualify for IAA assurance per the trigger table.
Category applied: **AAWP_MAT** (all files match MAT path patterns: `modules/mat/`).
IAA trigger is mandatory for all tasks. Adoption phase: **PHASE_B_BLOCKING**.

Risk tier for all tasks: **T2-doc** (planning and governance documents — no executable code,
no schema migrations, no API endpoints, no Supabase operations).

> **PR structure note**: All 5 tasks are governance/planning artifacts with no executable code.
> They may be delivered in a single PR or multiple PRs.
> If delivered in a single PR: all 5 task evidence artifacts must be present in the same PR bundle.
> If split across PRs: each PR requires its own PREHANDOVER proof, session memory, and IAA invocation.
> IAA is mandatory for ALL PRs regardless of structure. The highest-tier check governs each PR.

| # | Task ID | Task Summary | Builder | Category | Tier | IAA Required |
|---|---------|-------------|---------|----------|------|-------------|
| 1 | TASK-W14-001 | FRS addendum — FR-089 to FR-102 (14 FRs for GAP-W01 to GAP-W14) | foreman | AAWP_MAT | T2-doc | YES — MANDATORY |
| 2 | TASK-W14-002 | TRS addendum — TR-089 to TR-102 (14 TRs matching the FRs) | foreman | AAWP_MAT | T2-doc | YES — MANDATORY |
| 3 | TASK-W14-003 | RED QA suite specification — 16 test descriptions (foreman spec only) | foreman | AAWP_MAT | T2-doc | YES — MANDATORY |
| 4 | TASK-W14-004 | Implementation plan update — Wave 14 gap waves entry | foreman | AAWP_MAT | T2-doc | YES — MANDATORY |
| 5 | TASK-W14-005 | BUILD_PROGRESS_TRACKER.md — governance failure heading + gap entries | foreman | AAWP_MAT | T2-doc | YES — MANDATORY |

---

## Task 1 — FRS Addendum: FR-089 to FR-102

```yaml
task_id: TASK-W14-001
task_summary: >
  Create FRS addendum in modules/mat/01-frs/functional-requirements.md (or a dedicated
  addendum file at modules/mat/01-frs/frs-addendum-wave14.md) covering FR-089 through FR-102.
  Each FR must map to exactly one UX workflow gap (GAP-W01 to GAP-W14) from
  MAT_UX_WORKFLOW_AND_WIRING.md.
builder: foreman-v2-agent
file_paths:
  - modules/mat/01-frs/functional-requirements.md
    OR modules/mat/01-frs/frs-addendum-wave14.md (if using addendum file)
iaa_trigger_category: AAWP_MAT
iaa_trigger_reason: >
  File path matches MAT path pattern (modules/mat/01-frs/). FRS is a MAT module
  governance deliverable. AAWP_MAT trigger is mandatory per iaa-trigger-table.md.
risk_tier: T2-doc (FRS document update — no executable code, no migrations)
ceremony_required: Full Five-Phase
iaa_required: YES — MANDATORY (PHASE_B_BLOCKING)

ffa_required:
  FFA-01 (Delivery Completeness): APPLICABLE — IAA will count FR entries. Must be exactly 14
    (FR-089 through FR-102). Each FR must have: id, title, description, acceptance criteria,
    priority, and gap_reference (GAP-W01 to GAP-W14). Missing or incomplete FR = REJECTION-PACKAGE.
  FFA-02 (Wiring Verification): NOT APPLICABLE — FRS document only; no executable paths.
    Must be explicitly stated in PREHANDOVER proof with justification.
  FFA-03 (Cross-Delivery Integration): APPLICABLE (scoped) — Each FR must have a corresponding
    TR in TASK-W14-002. IAA will verify FR IDs (089–102) match TR IDs (089–102). Mismatches
    = REJECTION-PACKAGE.
  FFA-04 (Supabase Alignment): NOT APPLICABLE — document-only. Must be explicitly stated.
  FFA-05 (Carry-Forward Mandate): APPLICABLE — FR IDs must not collide with existing FRs
    (FR-001 through FR-088 from prior waves). IAA will check for numbering continuity.

required_phases:
  - Phase 1 (Preflight Proof): Agent identity declared from YAML; Tier 1 + Tier 2 citations
    with versions; FAIL-ONLY-ONCE attestation (A-001 through A-003 minimum); OPOJD confirmation.
  - Phase 2 (Governance Proof): MAT_APP_CANON.md and INDEPENDENT_ASSURANCE_AGENT_CANON.md
    cited with versions and SHA references; GATE_REQUIREMENTS_INDEX.json referenced;
    MAT_UX_WORKFLOW_AND_WIRING.md v1.0 cited as source authority with explicit trace.
  - Phase 3 (Working Phase Proof): Rationale for each FR; gap-to-FR mapping table documented;
    design decisions for acceptance criteria recorded.
  - Phase 4 (Handover Proof): PREHANDOVER proof committed; GREEN state declared; OPOJD
    confirmed; SCOPE_DECLARATION.md updated to match diff exactly; improvement suggestions
    parked (not inline); iaa_audit_token pre-populated per A-029 (NOT PENDING).

required_evidence_artifacts:
  - PREHANDOVER proof file committed on branch (may be combined with Tasks 2–5 if same PR)
  - Session memory file (.agent-workspace/foreman-v2/memory/session-NNN-YYYYMMDD.md) on branch
  - Updated/new FRS file with FR-089 to FR-102 (14 complete entries)
  - SCOPE_DECLARATION.md updated and matching the diff (not stale)
  - Gap-to-FR mapping table (either in PREHANDOVER proof or in the FRS document itself)

applicable_overlays:
  - AAWP_MAT overlay (OVL-AM-001 through OVL-AM-008)

specific_rules:
  OVL-AM-001: All 14 FRs must be complete — no stubs, no TODO, no placeholder text.
    Each FR requires id, title, description, acceptance_criteria, priority, gap_reference.
    A single incomplete FR = REJECTION-PACKAGE.
  OVL-AM-002: MAT_UX_WORKFLOW_AND_WIRING.md v1.0 must be cited as the authoritative source
    document for all 14 FRs. No FR may be invented outside this source document.
  OVL-AM-003: Governance alignment — each FR must trace directly to its named gap
    (GAP-W01 through GAP-W14). The gap description in the FR must match the gap definition
    in MAT_UX_WORKFLOW_AND_WIRING.md.
  OVL-AM-004: Architecture ripple/impact plan — PREHANDOVER must state "document-only FRS addendum;
    no schema/data model/API impact at this stage; builder appointment will specify implementation."
  OVL-AM-005: Wave gap register trace — PREHANDOVER must link to MAT_UX_WORKFLOW_AND_WIRING.md
    as the gap register for this wave.
  OVL-AM-006: Environment parity — "FRS document-only; no environment impact" must be
    explicitly stated in PREHANDOVER.
  OVL-AM-007: Session memory learning note — at least one concrete, non-blank learning note
    required in session memory (blank = session memory integrity failure).
  OVL-AM-008: End-to-end wiring trace — NOT APPLICABLE for FRS document. Must be explicitly
    stated in PREHANDOVER with justification.
  NUMBERING_CHECK: IAA will independently verify FR IDs 089–102 are present and sequential.
    Any gap in numbering or ID collision with existing FRs (001–088) = REJECTION-PACKAGE.
  SOURCE_TRACE: PREHANDOVER proof MUST include an explicit sentence: "All FRs in this addendum
    derive from MAT_UX_WORKFLOW_AND_WIRING.md v1.0 (CS2 direct, 2026-03-04)."
  A-021: PREHANDOVER proof MUST be committed and pushed BEFORE invoking IAA.
  A-026: SCOPE_DECLARATION.md must declare exactly the FRS file(s) changed in this task.
  A-029: iaa_audit_token must be pre-populated with expected IAA reference. NOT PENDING.
```

---

## Task 2 — TRS Addendum: TR-089 to TR-102

```yaml
task_id: TASK-W14-002
task_summary: >
  Create TRS addendum in modules/mat/01.5-trs/technical-requirements-specification.md (or
  dedicated modules/mat/01.5-trs/trs-addendum-wave14.md) covering TR-089 through TR-102.
  Each TR must match exactly one FR from TASK-W14-001 (TR-089 ↔ FR-089, ..., TR-102 ↔ FR-102).
  Each TR must specify technical implementation detail, not just restate the FR.
builder: foreman-v2-agent
file_paths:
  - modules/mat/01.5-trs/technical-requirements-specification.md
    OR modules/mat/01.5-trs/trs-addendum-wave14.md (if using addendum file)
iaa_trigger_category: AAWP_MAT
iaa_trigger_reason: >
  File path matches MAT path pattern (modules/mat/01.5-trs/). TRS is a MAT module
  governance deliverable. AAWP_MAT trigger is mandatory per iaa-trigger-table.md.
risk_tier: T2-doc (TRS document update — no executable code, no migrations)
ceremony_required: Full Five-Phase
iaa_required: YES — MANDATORY (PHASE_B_BLOCKING)

ffa_required:
  FFA-01 (Delivery Completeness): APPLICABLE — IAA will count TR entries. Must be exactly 14
    (TR-089 through TR-102). Each TR must have: id, title, technical_description, acceptance_criteria,
    priority, fr_reference. Missing or incomplete TR = REJECTION-PACKAGE.
  FFA-02 (Wiring Verification): NOT APPLICABLE — TRS document only. Must be stated explicitly.
  FFA-03 (Cross-Delivery Integration): APPLICABLE — Each TR must reference its corresponding FR
    (TR-089 references FR-089, etc.). IAA will check all 14 cross-references are correct.
    A TR referencing a non-existent or wrong FR = REJECTION-PACKAGE.
  FFA-04 (Supabase Alignment): NOT APPLICABLE — document-only at this stage. Must be stated.
  FFA-05 (Carry-Forward Mandate): APPLICABLE — TR IDs must not collide with TR-001 to TR-088.

required_phases:
  - Phase 1 through Phase 4: Same as TASK-W14-001 (may share combined PREHANDOVER proof
    if delivered in same PR as Task 1).

required_evidence_artifacts:
  - PREHANDOVER proof file (may be combined with Tasks 1, 3–5)
  - Session memory file on branch
  - Updated/new TRS file with TR-089 to TR-102 (14 complete entries)
  - SCOPE_DECLARATION.md matching diff
  - FR-to-TR cross-reference table (in PREHANDOVER proof or TRS document)

applicable_overlays:
  - AAWP_MAT overlay (OVL-AM-001 through OVL-AM-008)

specific_rules:
  OVL-AM-001: All 14 TRs must be complete — no stubs. Each TR requires:
    id, title, technical_description, acceptance_criteria, priority, fr_reference.
  OVL-AM-002: MAT_UX_WORKFLOW_AND_WIRING.md v1.0 must be cited as authoritative source.
  OVL-AM-003: Each TR must add technical specificity beyond the FR — not a restatement.
    TRs that merely copy FR text without technical detail = REJECTION-PACKAGE.
  OVL-AM-004: "Document-only TRS addendum; no schema impact at this stage" must be stated.
  OVL-AM-005: Wave gap register trace — MAT_UX_WORKFLOW_AND_WIRING.md cited explicitly.
  OVL-AM-006: "TRS document-only; no environment impact" must be explicitly stated.
  OVL-AM-007: Session memory learning note required (non-blank).
  OVL-AM-008: NOT APPLICABLE for TRS document — must be stated with justification.
  NUMBERING_CHECK: IAA will verify TR IDs 089–102 are present, sequential, and non-colliding
    with existing TR-001 to TR-088.
  FR_TR_PARITY: IAA will verify 1:1 FR-TR correspondence. If any FR has no matching TR
    or any TR references a non-existent FR → REJECTION-PACKAGE.
  TECHNICAL_SUBSTANCE: TRs must specify HOW, not just WHAT. A TR that only restates the FR
    with "system shall" language without technical implementation guidance fails OVL-AM-001.
  SOURCE_TRACE: PREHANDOVER must include: "All TRs derive from MAT_UX_WORKFLOW_AND_WIRING.md
    v1.0 (CS2 direct, 2026-03-04) and match FR-089 to FR-102 from TASK-W14-001."
  A-021 / A-026 / A-029: As declared in Task 1.
```

---

## Task 3 — RED QA Suite Specification: 16 Test Descriptions

```yaml
task_id: TASK-W14-003
task_summary: >
  Produce a RED QA suite specification document at modules/mat/01-frs/ or
  modules/mat/02-architecture/ or a dedicated qa-specs path, listing exactly 16 test
  descriptions for the Wave 14 UX workflow gap remediation. This is a Foreman spec document
  only — NOT a qa-builder implementation. Tests described here will be handed to qa-builder
  for implementation in a future wave.
builder: foreman-v2-agent
file_paths:
  - Likely path: modules/mat/04-builder-appointment/qa-red-suite-wave14.md
    OR modules/mat/05-build-evidence/qa-red-spec-wave14.md
    OR a path declared explicitly in the PREHANDOVER proof
iaa_trigger_category: AAWP_MAT
iaa_trigger_reason: >
  File path will match MAT path pattern (modules/mat/). RED QA spec is a MAT module
  governance deliverable defining the acceptance test baseline. AAWP_MAT trigger mandatory.
risk_tier: T2-doc (specification document — no test code implementation in this task)
ceremony_required: Full Five-Phase
iaa_required: YES — MANDATORY (PHASE_B_BLOCKING)

ffa_required:
  FFA-01 (Delivery Completeness): APPLICABLE — IAA will count test descriptions. Must be
    exactly 16. Each test description must include: test_id, test_title, test_description,
    related_gap, related_fr, expected_outcome, RED_status_justification.
    Fewer than 16 descriptions = REJECTION-PACKAGE citing count discrepancy.
  FFA-02 (Wiring Verification): NOT APPLICABLE — spec document only (no test code).
    Must be explicitly stated.
  FFA-03 (Cross-Delivery Integration): APPLICABLE — Each test description must reference
    the corresponding FR (FR-089 to FR-102) and gap (GAP-W01 to GAP-W14). IAA will verify
    cross-references are correct. Missing or wrong cross-reference = REJECTION-PACKAGE.
  FFA-04 (Supabase Alignment): NOT APPLICABLE — spec document. Must be stated.
  FFA-05 (Carry-Forward Mandate): APPLICABLE — PREHANDOVER must declare this RED spec will
    be handed to qa-builder for implementation. The handover path must be identified.

required_phases:
  - Phase 1 through Phase 4: Same protocol as Tasks 1 and 2. May share combined PREHANDOVER.

required_evidence_artifacts:
  - PREHANDOVER proof (may be combined)
  - Session memory on branch
  - RED QA suite spec document with exactly 16 test descriptions
  - SCOPE_DECLARATION.md matching diff
  - Explicit statement in PREHANDOVER: "This RED spec is for qa-builder implementation;
    no test code is delivered in this task."

applicable_overlays:
  - AAWP_MAT overlay (OVL-AM-001 through OVL-AM-008)

specific_rules:
  OVL-AM-001: All 16 test descriptions must be complete — no stubs, no "TBD" test descriptions.
    Each description must contain enough detail for qa-builder to implement without ambiguity.
    A vague test description ("test that the UI works") = REJECTION-PACKAGE.
  OVL-AM-002: MAT_UX_WORKFLOW_AND_WIRING.md v1.0 cited as source authority.
  OVL-AM-003: Test descriptions must trace to specific gaps and FRs. IAA will spot-check
    3 random test descriptions for alignment with their stated gap and FR.
  OVL-AM-004: "RED spec document only; no test implementation; no schema/env impact" must be stated.
  OVL-AM-005: Wave gap register trace to MAT_UX_WORKFLOW_AND_WIRING.md.
  OVL-AM-006: "No environment impact" must be explicitly stated.
  OVL-AM-007: Session memory learning note required (non-blank).
  OVL-AM-008: NOT APPLICABLE — spec document. Must be stated.
  COUNT_CHECK: IAA will count test descriptions exactly. 15 = REJECTION-PACKAGE. 17 = REJECTION-PACKAGE.
    Exactly 16 required. If the description contains a count discrepancy between the
    PREHANDOVER proof and the spec file, that is also a FAIL.
  DESCRIPTION_QUALITY: Test descriptions must specify (a) the scenario/workflow being tested,
    (b) the expected outcome, and (c) why it is RED (i.e., not yet implemented). Descriptions
    without all three elements fail OVL-AM-001.
  HANDOVER_PATH: PREHANDOVER proof must identify the future qa-builder wave where these tests
    will be implemented. "Will be implemented in a future wave" without identification of
    the planned wave is insufficient.
  SOURCE_TRACE: "All 16 test descriptions derive from MAT_UX_WORKFLOW_AND_WIRING.md v1.0
    and cover FR-089 to FR-102 acceptance criteria." Must appear in PREHANDOVER proof.
  A-021 / A-026 / A-029: As declared in Task 1.
```

---

## Task 4 — Implementation Plan Update: Wave 14 Gap Waves Entry

```yaml
task_id: TASK-W14-004
task_summary: >
  Add a 'Wave 14' entry to modules/mat/03-implementation-plan/implementation-plan.md defining
  the full scope of Wave 14 gap remediation: FRS addendum (FR-089 to FR-102), TRS addendum
  (TR-089 to TR-102), RED QA spec (16 tests), and planned future build waves for
  qa-builder implementation.
builder: foreman-v2-agent
file_paths:
  - modules/mat/03-implementation-plan/implementation-plan.md
iaa_trigger_category: AAWP_MAT
iaa_trigger_reason: >
  File path matches MAT path pattern (modules/mat/). Implementation plan is a MAT module
  governance deliverable. AAWP_MAT trigger mandatory per iaa-trigger-table.md.
risk_tier: T2-doc (planning document update — no executable code)
ceremony_required: Full Five-Phase
iaa_required: YES — MANDATORY (PHASE_B_BLOCKING)

ffa_required:
  FFA-01 (Delivery Completeness): APPLICABLE — Wave 14 entry must be present and must cover
    all 5 tasks of this wave. IAA will verify the wave entry references: TASK-W14-001 (FRS),
    TASK-W14-002 (TRS), TASK-W14-003 (RED QA spec), TASK-W14-004 (this task), TASK-W14-005
    (BUILD_PROGRESS_TRACKER). A partial wave entry omitting any task = REJECTION-PACKAGE.
  FFA-02 (Wiring Verification): NOT APPLICABLE — planning document only. Must be stated.
  FFA-03 (Cross-Delivery Integration): APPLICABLE (scoped) — Wave 14 entry must reference
    the source authority document (MAT_UX_WORKFLOW_AND_WIRING.md v1.0) and issue #909.
    It must also declare the planned future wave(s) where qa-builder will implement tests.
  FFA-04 (Supabase Alignment): NOT APPLICABLE — document-only. Must be stated.
  FFA-05 (Carry-Forward Mandate): APPLICABLE — if any prior wave entry is referenced as
    COMPLETED but the referenced PR has not been merged, flag as regression.

required_phases:
  - Phase 1 through Phase 4: As per Tasks 1–3. May share combined PREHANDOVER proof.

required_evidence_artifacts:
  - PREHANDOVER proof (may be combined)
  - Session memory on branch
  - Updated modules/mat/03-implementation-plan/implementation-plan.md with Wave 14 section
  - SCOPE_DECLARATION.md matching diff

applicable_overlays:
  - AAWP_MAT overlay (OVL-AM-001 through OVL-AM-008)

specific_rules:
  OVL-AM-001: Wave 14 entry must be complete — no placeholder text. It must include:
    wave_number, wave_title, issue_reference (#909), source_authority, scope_summary,
    tasks_list (TASK-W14-001 through TASK-W14-005), status (IN PROGRESS), and
    future_build_plan (qa-builder implementation wave TBD).
  OVL-AM-002: MAT_UX_WORKFLOW_AND_WIRING.md v1.0 cited as the source authority for the wave.
  OVL-AM-003: The wave entry must declare the governance reason — CS2-issued issue #909.
  OVL-AM-004: "Implementation plan document update only; no schema or executable impact" must be stated.
  OVL-AM-005: Wave gap register (MAT_UX_WORKFLOW_AND_WIRING.md) cited in the wave entry.
  OVL-AM-006: "No environment impact" must be explicitly stated in PREHANDOVER.
  OVL-AM-007: Session memory learning note required.
  OVL-AM-008: NOT APPLICABLE — planning document. Must be stated with justification.
  WAVE_ENTRY_COMPLETENESS: IAA will verify the Wave 14 entry explicitly references all 14 gaps
    (GAP-W01 to GAP-W14). An entry that references "14 gaps" without enumerating them is
    acceptable ONLY IF the source authority document is cited with a direct reference.
  FUTURE_WAVE_PLAN: The implementation plan entry MUST declare a planned qa-builder wave
    for test implementation. Foreman may use "Wave 14B (qa-builder, TBD)" or similar.
    An entry with no future build plan = REJECTION-PACKAGE for FFA-03.
  A-021 / A-026 / A-029: As declared in Task 1.
```

---

## Task 5 — BUILD_PROGRESS_TRACKER.md: Governance Failure Heading + Gap Entries

```yaml
task_id: TASK-W14-005
task_summary: >
  Update modules/mat/BUILD_PROGRESS_TRACKER.md to add:
  (a) A 'Governance Compliance Failures' heading section for Wave 14 UX workflow gaps, and
  (b) Entries for all 14 gaps (GAP-W01 through GAP-W14) with RED/OPEN status.
  Prior wave entries must not be regressed (all previously CLOSED/GREEN entries remain closed).
builder: foreman-v2-agent
file_paths:
  - modules/mat/BUILD_PROGRESS_TRACKER.md
iaa_trigger_category: AAWP_MAT
iaa_trigger_reason: >
  File path matches MAT path pattern (modules/mat/). BUILD_PROGRESS_TRACKER.md is a
  MAT module governance deliverable. AAWP_MAT trigger mandatory.
risk_tier: T2-doc (governance tracking document — no executable code)
ceremony_required: Full Five-Phase
iaa_required: YES — MANDATORY (PHASE_B_BLOCKING)

ffa_required:
  FFA-01 (Delivery Completeness): APPLICABLE — IAA will count GAP entries added. Must be
    exactly 14 (GAP-W01 through GAP-W14). Each entry must include: gap_id, gap_title,
    related_fr, related_tr, status (OPEN/RED), source (MAT_UX_WORKFLOW_AND_WIRING.md),
    wave_assigned (Wave 14). Missing entries = REJECTION-PACKAGE citing exact count.
  FFA-02 (Wiring Verification): NOT APPLICABLE — tracking document only. Must be stated.
  FFA-03 (Cross-Delivery Integration): APPLICABLE — GAP entries must reference FR-089 to FR-102
    (from Task 1) and TR-089 to TR-102 (from Task 2). IAA will verify cross-references are
    consistent with Tasks 1 and 2. If FR/TR references in tracker don't match addenda = FAIL.
  FFA-04 (Supabase Alignment): NOT APPLICABLE — document-only. Must be stated.
  FFA-05 (Carry-Forward Mandate): APPLICABLE — IAA will scan the tracker for any prior CLOSED
    entries that have been changed to OPEN (regression). Any regression = REJECTION-PACKAGE.

required_phases:
  - Phase 1 through Phase 4: As per Tasks 1–4. May share combined PREHANDOVER proof.

required_evidence_artifacts:
  - PREHANDOVER proof (may be combined)
  - Session memory on branch
  - Updated modules/mat/BUILD_PROGRESS_TRACKER.md with governance failure section + 14 gap entries
  - SCOPE_DECLARATION.md matching diff

applicable_overlays:
  - AAWP_MAT overlay (OVL-AM-001 through OVL-AM-008)

specific_rules:
  OVL-AM-001: All 14 gap entries must be complete — no stub entries. Each entry must include
    gap_id, gap_title, related_fr, related_tr, status, source, wave_assigned.
    A single incomplete or missing entry = REJECTION-PACKAGE.
  OVL-AM-002: MAT_UX_WORKFLOW_AND_WIRING.md v1.0 cited as source authority for all entries.
  OVL-AM-003: 'Governance Compliance Failures' heading must be present as a distinct section.
    IAA will verify this heading exists in the diff. Absence = REJECTION-PACKAGE.
  OVL-AM-004: "Tracking document update only; no schema/executable impact" must be stated.
  OVL-AM-005: Each gap entry must cite MAT_UX_WORKFLOW_AND_WIRING.md as the source.
  OVL-AM-006: "No environment impact" must be explicitly stated.
  OVL-AM-007: Session memory learning note required.
  OVL-AM-008: NOT APPLICABLE — tracking document. Must be stated with justification.
  SECTION_HEADING_CHECK: IAA will verify the exact heading 'Governance Compliance Failures'
    (or equivalent CS2-approved variant per issue #909) exists in the updated tracker.
    A section heading with different wording that was not approved = flag for CS2 review.
  COUNT_CHECK: IAA will count GAP-W01 through GAP-W14 entries. Exactly 14 required.
    Fewer than 14 = REJECTION-PACKAGE. More than 14 without explanation = flag.
  REGRESSION_CHECK: IAA will scan all PRIOR gap entries (from previous waves). Any previously
    CLOSED entry that is now OPEN in the updated tracker = immediate REJECTION-PACKAGE
    (regression breach). This check is mandatory and cannot be waived.
  CROSS_REF_CONSISTENCY: FR and TR references in tracker entries must match exactly the FR and
    TR IDs in the addenda delivered in Tasks 1 and 2. Any discrepancy = REJECTION-PACKAGE.
  A-021 / A-026 / A-029: As declared in Task 1.
```

---

## Consolidated PREHANDOVER Ceremony Requirements (All Tasks)

If Tasks 1–5 are delivered in a single PR, the PREHANDOVER proof may be a single combined
document. The following fields are mandatory in every PREHANDOVER proof for this wave,
regardless of whether combined or separate:

### Mandatory PREHANDOVER Proof Fields

```yaml
mandatory_fields:
  iaa_audit_token: "IAA-session-NNN-wave14-YYYYMMDD-PASS"
    # Pre-populated with expected format. NOT PENDING. NOT blank. A-029.
  source_authority_declaration: >
    "All deliverables in Wave 14 derive from MAT_UX_WORKFLOW_AND_WIRING.md v1.0
    (CS2 direct, 2026-03-04). This is the sole authoritative source for
    FR-089 to FR-102, TR-089 to TR-102, and the 16 RED test descriptions."
  ffa_not_applicable_statements:
    - "FFA-02 (Wiring): NOT APPLICABLE — all Wave 14 tasks are planning documents only,
      no executable paths added."
    - "FFA-04 (Supabase Alignment): NOT APPLICABLE — no Supabase operations in this wave."
    - "OVL-AM-008 (End-to-end wiring trace): NOT APPLICABLE for all tasks — planning documents only."
    - "No environment impact for any task in this wave."
  scope_declaration_reference: >
    Path to SCOPE_DECLARATION.md, confirmed matching the PR diff.
  gap_register_reference: >
    "modules/mat/00-app-description/MAT_UX_WORKFLOW_AND_WIRING.md v1.0 is the gap register
    for Wave 14. All 14 gaps (GAP-W01 to GAP-W14) are enumerated in this document."
  future_build_declaration: >
    "RED QA suite spec (Task 3) is for qa-builder implementation in a future wave.
    That wave is [Wave 14B / Wave 15 / as planned — must be identified]."
```

### Ceremony Protocol Reminder

1. **Complete all 5 task deliverables** before committing the PREHANDOVER proof.
2. **Commit the PREHANDOVER proof first** (A-021), then invoke IAA.
3. **Do NOT invoke IAA before committing.** Untracked files = invisible to IAA.
4. **Populate iaa_audit_token** with the expected reference (A-029). Not PENDING.
5. **Update SCOPE_DECLARATION.md** to match exactly what files changed (A-026).
6. **Session memory must be committed** on the branch before IAA invocation.

---

## Phase 0 Confirmation: Pre-Brief Invocation

> **IAA Pre-Brief Invocation Mode confirmed.**
>
> This is a Phase 0 (Pre-Brief) invocation. IAA does NOT execute Phases 1–4 assurance in this
> session. The Pre-Brief artifact above is the sole output of this invocation.
>
> Foreman reads this Pre-Brief BEFORE beginning Wave 14 tasks. The Pre-Brief defines the
> acceptance bar. Building to any lower standard will result in REJECTION-PACKAGE at handover.
>
> When Foreman has completed all 5 tasks and committed the PREHANDOVER proof,
> IAA must be re-invoked (Phase 2–4 assurance mode) for the actual verdict.

---

## Summary: Qualifying Tasks

| Task | Qualifying | Category | Trigger Reason | Phases Required | Key Evidence |
|------|-----------|----------|---------------|----------------|-------------|
| TASK-W14-001 (FRS addendum) | YES | AAWP_MAT | modules/mat/01-frs/ path | Full Five-Phase | PREHANDOVER, 14 complete FRs, session memory, SCOPE_DECLARATION |
| TASK-W14-002 (TRS addendum) | YES | AAWP_MAT | modules/mat/01.5-trs/ path | Full Five-Phase | PREHANDOVER, 14 complete TRs, FR-TR cross-ref table, session memory |
| TASK-W14-003 (RED QA spec) | YES | AAWP_MAT | modules/mat/ path | Full Five-Phase | PREHANDOVER, exactly 16 test descriptions, session memory |
| TASK-W14-004 (Impl plan) | YES | AAWP_MAT | modules/mat/03-implementation-plan/ path | Full Five-Phase | PREHANDOVER, Wave 14 entry with future build plan, session memory |
| TASK-W14-005 (Tracker update) | YES | AAWP_MAT | modules/mat/ path | Full Five-Phase | PREHANDOVER, 14 gap entries, governance failure heading, session memory |

**Non-qualifying tasks**: None identified. All 5 tasks are QUALIFYING under AAWP_MAT.
**PHASE_A_ADVISORY tasks**: None. Adoption phase is PHASE_B_BLOCKING for all.

---

## IAA Hard-Gate Checks at Handover (Summary)

At handover, IAA will run the following hard-gate checks (among all CORE + AAWP_MAT checks):

| Check | What IAA Will Verify |
|-------|---------------------|
| CORE-007 | No stub/TODO/placeholder in any delivered document |
| CORE-013 | IAA invocation evidence present in PREHANDOVER proof |
| CORE-015 | Session memory file committed on branch |
| CORE-016 | Dedicated IAA token file path pre-declared in PREHANDOVER (§4.3b architecture) |
| CORE-018 | All 4 evidence sweep conditions satisfied |
| CORE-019 | iaa_audit_token in PREHANDOVER is correctly formatted (NOT PENDING) |
| CORE-021 | Zero-severity-tolerance: any finding = REJECTION-PACKAGE |
| OVL-AM-001 | All deliverable documents complete with no stubs |
| OVL-AM-002 | MAT_UX_WORKFLOW_AND_WIRING.md v1.0 cited as source authority |
| OVL-AM-003 | Governance alignment — all FRs/TRs/tests trace to named gaps |
| OVL-AM-007 | Non-blank session memory learning note |
| COUNT: FRS | Exactly 14 FRs (FR-089 to FR-102) present and complete |
| COUNT: TRS | Exactly 14 TRs (TR-089 to TR-102) present and complete |
| COUNT: QA | Exactly 16 test descriptions present and complete |
| COUNT: GAPS | Exactly 14 gap entries in BUILD_PROGRESS_TRACKER.md |
| SECTION HEAD | 'Governance Compliance Failures' heading in tracker |
| FR-TR PARITY | 1:1 correspondence between FR and TR addenda |
| REGRESSION | No prior CLOSED tracker entries regressed to OPEN |
| SOURCE TRACE | Explicit source authority declaration in PREHANDOVER proof |
| A-021 | PREHANDOVER committed before IAA invocation |
| A-026 | SCOPE_DECLARATION.md matches diff exactly |
| A-029 | iaa_audit_token not PENDING |

---

**Pre-Brief artifact committed.**
**Wave 14 build may now commence.**
**IAA re-invocation required at handover before PR opens.**

---

*IAA Pre-Brief | Wave 14 | independent-assurance-agent v6.2.0 | PHASE_B_BLOCKING | 2026-03-04*
*Authority: CS2 (Johan Ras / @APGI-cmy) | Issue #909*
