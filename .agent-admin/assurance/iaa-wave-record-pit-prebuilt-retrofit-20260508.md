# IAA Wave Record — pit-prebuilt-retrofit-20260508

**Wave**: pit-prebuilt-retrofit-20260508
**Branch**: copilot/foreman-retrofit-pit-artifacts
**PR**: #1576
**Issue**: Foreman: Retrofit PIT pre-build artifacts with functional delivery upgrades
**Wave Record Version**: 1.0
**Date Created**: 2026-05-08
**Authority**: CS2 (Johan Ras / @APGI-cmy)
**Created By**: independent-assurance-agent (Phase 0 — PRE-BRIEF mode)
**Adoption Phase**: PHASE_B_BLOCKING — Hard gate ACTIVE

---

## PRE-BRIEF

**Invocation Type**: Phase 0 — PRE-BRIEF (action: "PRE-BRIEF")
**Produced By**: independent-assurance-agent
**Invoked By**: foreman-v2-agent (via issue comment on #1576)
**Ceremony Admin Appointed**: NOT_YET_DETERMINABLE — wave-current-tasks.md not yet committed on branch at pre-brief time

---

### Qualifying Tasks

| # | Task | Trigger Category | IAA Required? |
|---|------|-----------------|--------------|
| T-1 | Review and update PIT Stage 1–4 pre-build governance artifacts (docs/markdown files in modules/pit/) | PRE_BUILD_STAGE_MODEL | YES — MANDATORY |
| T-2 | Update modules/pit/BUILD_PROGRESS_TRACKER.md with functional-delivery guardrails for Stages 6–12 | PRE_BUILD_STAGE_MODEL | YES — MANDATORY |
| T-3 | Create optional _readiness artifacts under modules/pit/_readiness/ | PRE_BUILD_STAGE_MODEL | YES — MANDATORY |
| T-4 | Create wave ceremony artifacts: wave-current-tasks.md, scope declaration, pr-1576.json, PREHANDOVER proof, session memory | GOVERNANCE_AUDIT (ceremony) | N/A — ceremony artifacts; IAA triggered by T-1/T-2/T-3 |

**Qualifying task count**: 3 triggering tasks (T-1, T-2, T-3)

---

### Applicable Overlay

**Primary Category**: `PRE_BUILD_STAGE_MODEL`

**Classification Rationale**:

The PR explicitly modifies:
- `modules/pit/BUILD_PROGRESS_TRACKER.md` → listed verbatim in trigger table as `modules/*/BUILD_PROGRESS_TRACKER.md`
- `modules/pit/00-app-description/app-description.md` → listed verbatim as `modules/*/00-app-description/`
- `modules/pit/01-ux-workflow-wiring-spec/ux-workflow-wiring-spec.md` → pre-build stage lifecycle artifact
- `modules/pit/02-frs/functional-requirements.md` → pre-build stage lifecycle artifact
- `modules/pit/03-trs/technical-requirements-specification.md` → pre-build stage lifecycle artifact
- `modules/pit/03-trs/frs-to-trs-traceability.md` → pre-build stage lifecycle artifact
- `modules/pit/04-architecture/` (tracker notes) → pre-build stage lifecycle artifact
- `modules/pit/_readiness/` (new) → pre-build readiness artifacts

The ceremony artifacts (wave-current-tasks.md, PREHANDOVER proof, session memory) are
`GOVERNANCE_AUDIT` in isolation but the entire PR is classified `PRE_BUILD_STAGE_MODEL` per
the MIXED rule: any triggering artifact activates IAA for the whole PR.

**Applicable Overlay**: `PRE_BUILD_GATES` (OVL-PBG-001 through OVL-PBG-017 + OVL-PBG-ADM-001)
**Also Applied**: `PRE_BRIEF_ASSURANCE` (OVL-INJ-001, OVL-INJ-ADM-001/002/003)
**Core Invariants**: CORE-020 (zero partial pass), CORE-021 (zero severity tolerance)

---

### Anti-Regression Obligations

**FUNCTIONAL-BEHAVIOUR-REGISTRY applicable**: **NO**

Rationale: The Functional Behaviour Registry (NBR-001, NBR-002, etc.) applies exclusively to
BUILD/AAWP_MAT PRs that introduce or modify application code, TanStack Query mutations, or
Supabase RLS policies. This wave is GOVERNANCE-ONLY — no src/, no migrations, no application
code. NBR patterns are not triggered.

**Governance state integrity obligations DO apply** (not FBR-class):
- Stage status claims in BUILD_PROGRESS_TRACKER must be truthful and consistent with actual
  upstream approval state (Stages 2–4 remain PENDING CS2 approval; no retroactive COMPLETE
  claims permitted without CS2 approval evidence)
- FRS-to-TRS traceability must remain internally consistent if either artifact is modified
- OVL-PBG-014 Change-Propagation Audit applies if upstream artifacts (Stage 1–4) are
  substantively modified — downstream impact to Stage 5–12 must be assessed in the PR

---

### Stage-Readiness View

**Module**: PIT (Project Implementation Tracker) | Slug: `pit` | Directory: `modules/pit/`
**Stage-readiness view as of**: 2026-05-08 (based on BUILD_PROGRESS_TRACKER.md last updated 2026-05-07)
**Artifacts Reviewed**: `modules/pit/BUILD_PROGRESS_TRACKER.md`, `modules/pit/module.manifest.json`

| Stage | Name | Current Status | Evidence Ref | COMPLETE? |
|-------|------|---------------|-------------|-----------|
| Stage 1 | App Description | CS2_APPROVED_AUTHORITATIVE | maturion-isms#1540, 2026-05-06 | ✅ YES |
| Stage 2 | UX Workflow & Wiring Spec | STAGE_2_COMPLETE_FOREMAN_REVIEWED — pending CS2 approval | maturion-isms#1548 | ⚠️ PARTIAL — Foreman-reviewed; CS2 approval outstanding |
| Stage 3 | FRS | DRAFT_HARDENED v0.2 — pending CS2 approval | maturion-isms#1556 | ⚠️ PARTIAL — hardened draft; CS2 approval outstanding |
| Stage 4 | TRS | DRAFT_CREATED — pending upstream CS2 approvals (Stage 2 + Stage 3) | maturion-isms#1554 | ⚠️ PARTIAL — draft only; blocked upstream |
| Stage 5 | Architecture | IN_PROGRESS | existing architecture/ artifacts | ❌ NOT COMPLETE |
| Stage 6 | QA-to-Red | NOT_STARTED | — | ❌ NOT STARTED |
| Stage 7 | PBFAG | NOT_STARTED | — | ❌ NOT STARTED |
| Stage 8 | Implementation Plan | NOT_STARTED | — | ❌ NOT STARTED |
| Stage 9 | Builder Checklist | NOT_STARTED | — | ❌ NOT STARTED |
| Stage 10 | IAA Pre-Brief | NOT_STARTED (this wave is a retrofit/governance wave, not Stage 10) | — | ❌ NOT STARTED |
| Stage 11 | Builder Appointment | NOT_STARTED | — | ❌ NOT STARTED |
| Stage 12 | Build Execution | NOT_STARTED | — | ❌ NOT STARTED |

**STAGE-READINESS VERDICT**: Build appointment (Stage 11) is NOT REACHABLE in this wave.
This is a GOVERNANCE-ONLY retrofit wave. No stage advancement beyond the current partial states
of Stages 2–4 is claimed or authorised.

**Blockers preventing Stage 11 builder appointment**:
1. Stage 2 UX Spec: CS2 approval outstanding (maturion-isms#1548)
2. Stage 3 FRS: CS2 approval outstanding (maturion-isms#1556)
3. Stage 4 TRS: blocked pending Stage 2 + Stage 3 CS2 approvals
4. Stage 5 Architecture: IN_PROGRESS, gate-pass not yet issued
5. Stages 6–9: NOT_STARTED
6. Stage 10 IAA Pre-Brief (canonical stage 10, not this pre-brief): NOT_STARTED

**Build Authorization**: NOT CLEARED — confirmed. No implementation authorised.

---

### OVL-INJ-001 Architecture Note (MANDATORY — forward to Foreman)

> **ADVISORY**: `OVL-INJ-001` in the PRE_BRIEF_ASSURANCE overlay checks for a standalone file
> at `.agent-admin/assurance/iaa-prebrief-<slug>.md`. The current IAA contract (v6.2.0)
> prohibits standalone pre-brief files (`NO-STANDALONE-PREBRIEF-001`) and places all pre-brief
> content in `## PRE-BRIEF` of the wave record. The wave record at
> `.agent-admin/assurance/iaa-wave-record-pit-prebuilt-retrofit-20260508.md` is the canonical
> pre-brief artifact for this wave. **Foreman must declare this path as the pre-brief artifact
> in the PREHANDOVER proof** to satisfy OVL-INJ-001 at final audit. The PREHANDOVER field
> `pre_brief_artifact` must reference this wave record path explicitly.

---

## Declared Trigger Categories, FFA Checks, and Blockers

### 1. Trigger Categories

| Category | Triggered? | Reason |
|----------|-----------|--------|
| PRE_BUILD_STAGE_MODEL | ✅ YES — PRIMARY | BUILD_PROGRESS_TRACKER.md + stage governance artifacts in scope |
| AGENT_CONTRACT | ❌ NO | No `.github/agents/` files in scope |
| CANON_GOVERNANCE | ❌ NO | No `governance/canon/` files in scope |
| CI_WORKFLOW | ❌ NO | No `.github/workflows/` files in scope |
| AAWP_MAT | ❌ NO | Not an AAWP/MAT deliverable PR |
| KNOWLEDGE_GOVERNANCE | ❌ NO | No `.agent-workspace/*/knowledge/` files in scope |
| GOVERNANCE_AUDIT | ✅ SECONDARY | Ceremony artifacts (wave-current-tasks, PREHANDOVER, session memory) |
| EXEMPT | ❌ NOT APPLICABLE | PR contains PRE_BUILD_STAGE_MODEL triggering artifacts; AMBIGUITY RULE applies |

**Final Classification**: `PRE_BUILD_STAGE_MODEL` (MIXED — ceremony artifacts present but absorbed by primary trigger)
**IAA Required at Handover**: YES — MANDATORY

---

### 2. FFA Checks Applicable to Governance-Document Waves

The following checks apply at final handover audit for this governance-only wave:

#### Core Invariants (always active)
| Check | Description | Application to This Wave |
|-------|-------------|-------------------------|
| CORE-020 | Zero partial pass | Any check that cannot be verified due to missing/blank evidence = REJECTION-PACKAGE. No assumed passes. |
| CORE-021 | Zero severity tolerance | Any finding, regardless of perceived severity, blocks merge. No "minor", "trivial", "cosmetic" language. |

#### PRE_BUILD_GATES Overlay (OVL-PBG-001 to OVL-PBG-017)

For a GOVERNANCE-ONLY wave (no build authorisation), only the following OVL-PBG checks are active:

| Check ID | Active? | Reason |
|----------|---------|--------|
| OVL-PBG-001 | ✅ ACTIVE | module.manifest.json slug matches directory name — always checked |
| OVL-PBG-002 | ✅ ACTIVE | BUILD_PROGRESS_TRACKER identity consistent with manifest |
| OVL-PBG-003 | ⚠️ ADVISORY | Architecture doc references correct module name — advisory only; architecture is Stage 5 IN_PROGRESS, gate-pass not in scope |
| OVL-PBG-004 | ❌ NOT TRIGGERED | No FRS wave builder delegation in this wave |
| OVL-PBG-005 | ❌ NOT TRIGGERED | No AGENT_HANDOVER_AUTOMATION version citations in scope artifacts |
| OVL-PBG-006 | ✅ ACTIVE | BUILD_PROGRESS_TRACKER must use full 12-stage model — already present; verify no regression |
| OVL-PBG-007 | ⚠️ ADVISORY | Architecture doc sequence — advisory; Stage 5 gate-pass not in scope |
| OVL-PBG-008 | ✅ ACTIVE — CRITICAL | Stage gating respected — no stage advancement without upstream CS2 approval |
| OVL-PBG-009 | ✅ ADVISORY | Legacy directory numbering (00-, 01-, 02-, 03- vs canonical 01-, 02-, 03-) — structural note expected |
| OVL-PBG-010 | ❌ NOT TRIGGERED | No Stage 5+ advancement in this wave |
| OVL-PBG-011 | ❌ NOT TRIGGERED | No build work begins in this wave |
| OVL-PBG-012 | ❌ NOT TRIGGERED | No builder delegation in this wave |
| OVL-PBG-013 | ❌ NOT TRIGGERED | No builder appointment in this wave |
| OVL-PBG-014 | ✅ ACTIVE — CRITICAL | Change-Propagation Audit: if upstream artifacts (Stage 1–4) are substantively modified, downstream impacts to Stage 5–12 must be assessed |
| OVL-PBG-015 | ❌ NOT TRIGGERED | No first build wave begins |
| OVL-PBG-016 | ❌ NOT TRIGGERED | No first build wave begins |
| OVL-PBG-017 | ❌ NOT TRIGGERED | No first build wave begins |
| OVL-PBG-ADM-001 | ✅ REQUIRED | IAA must state OVL-PBG-001 through OVL-PBG-017 applied |

#### PRE_BRIEF_ASSURANCE Overlay
| Check ID | Active? | Note |
|----------|---------|------|
| OVL-INJ-001 | ✅ ACTIVE | Pre-brief artifact must exist before any qualifying builder task — satisfied by this wave record |
| OVL-INJ-ADM-001 | ✅ ACTIVE | Pre-brief artifact must be non-empty and non-placeholder — this wave record satisfies |
| OVL-INJ-ADM-002 | ✅ ACTIVE | Pre-brief references correct wave — wave ID confirmed: pit-prebuilt-retrofit-20260508 |
| OVL-INJ-ADM-003 | ✅ ACTIVE | Stage-readiness view declared — present in this pre-brief |

#### FAIL-ONLY-ONCE Rules Applicable to This Wave
| Rule | Active? | Application |
|------|---------|------------|
| A-001 | ✅ | IAA invocation evidence must be in PREHANDOVER proof — Foreman must reference this wave record in PREHANDOVER |
| A-019 | ✅ | Trigger table misapplication is IAA bypass — IAA independently classified PRE_BUILD_STAGE_MODEL |
| A-021 | ✅ | Commit and push before IAA invocation (CI run evidence) — wave record must be committed before PR #1576 opened |
| A-026 | ✅ | SCOPE_DECLARATION must match PR diff exactly at handover |
| A-036 | ✅ | No future-dated factual claims — stage status must reflect actual current state |
| A-039 | ✅ | Agent claims are not evidence — all stage completion claims must cite verifiable artifacts |
| A-041 | ✅ | Diff-first classification — IAA will independently compute changed files at handover |

---

### 3. PREHANDOVER Structure Required

The PREHANDOVER proof for this wave must contain ALL of the following sections. Missing section = REJECTION-PACKAGE.

```
# PREHANDOVER PROOF — pit-prebuilt-retrofit-20260508

## Wave Identity
- wave_id: pit-prebuilt-retrofit-20260508
- branch: copilot/foreman-retrofit-pit-artifacts
- pr_number: 1576
- issue: [issue URL/number]
- pr_type: GOVERNANCE_ONLY — no code, no schema, no CI changes

## Build Authorization
- build_authorization: NOT CLEARED
- implementation_blocked: YES
- reason: Stages 2–11 incomplete; upstream CS2 approvals outstanding

## Scope Declaration
- scope_declaration_path: .agent-admin/scope-declarations/pr-1576.md
- scope_declaration_committed: [YES/NO + SHA]
- files_changed_count: [N]
- files_changed: [list]

## Non-Scope Verification (MANDATORY for governance-only waves)
- src_changes: NONE — verified
- supabase_migration_changes: NONE — verified
- github_workflows_changes: NONE — verified
- builder_appointment: NONE — verified
- architecture_gate_pass: NONE — verified
- qa_to_red_gate_pass: NONE — verified
- pbfag_pass: NONE — verified
- build_authorization_pass: NONE — verified
- deployment_authorisation: NONE — verified

## Stage-Readiness Summary
- stage_1_app_description: CS2_APPROVED_AUTHORITATIVE (2026-05-06)
- stage_2_ux_wiring_spec: FOREMAN_REVIEWED — CS2 approval pending (maturion-isms#1548)
- stage_3_frs: DRAFT_HARDENED v0.2 — CS2 approval pending (maturion-isms#1556)
- stage_4_trs: DRAFT_CREATED — blocked pending Stage 2+3 CS2 approvals
- stage_5_architecture: IN_PROGRESS — gate-pass not in scope
- stages_6_to_12: NOT_STARTED / NOT_IN_SCOPE_THIS_WAVE

## OVL-PBG-001: Manifest Slug
- module_slug_in_manifest: pit
- directory_name: pit
- match: [PASS/FAIL]

## OVL-PBG-002: BUILD_PROGRESS_TRACKER Identity
- tracker_module_name: [value]
- manifest_module_name: PIT (Project Implementation Tracker)
- match: [PASS/FAIL]

## OVL-PBG-006: 12-Stage Model Complete
- all_12_stages_present: [YES/NO]
- evidence: [citation]

## OVL-PBG-008: Stage Gating (CRITICAL)
- no_stage_advancement_without_cs2_approval: [YES/NO]
- new_stage_completion_claims_in_this_wave: [list or NONE]
- all_new_claims_cs2_backed: [YES/NO/N/A]

## OVL-PBG-014: Change-Propagation Audit
- upstream_artifacts_modified: [list of Stage 1–4 files changed]
- downstream_impact_assessed: [YES/NO]
- change_propagation_log: [path or inline summary]
- propagation_audit_complete: [YES/NO]

## OVL-INJ-001: Pre-Brief Artifact
- pre_brief_artifact: .agent-admin/assurance/iaa-wave-record-pit-prebuilt-retrofit-20260508.md
- pre_brief_section_present: YES (## PRE-BRIEF section)
- pre_brief_committed_before_builder_task: [YES/NO + SHA evidence]

## IAA Audit Token Reference
- iaa_audit_token: IAA-session-pit-prebuilt-retrofit-20260508-PASS [PENDING IAA final verdict]
- iaa_invocation_evidence: .agent-admin/assurance/iaa-wave-record-pit-prebuilt-retrofit-20260508.md

## Gate Status
- merge_gate_parity: [PASS/FAIL]
- governance_alignment: [PASS/FAIL]
- stop_and_fix_enforcement: [PASS/FAIL]

## Final State
- final_state: [COMPLETE/INCOMPLETE — set to COMPLETE only when all above items are verified]
- foreman_readiness_declaration: [YES/NO]
```

---

### 4. Scope Blockers

The following items are confirmed NON-SCOPE and will be verified at final audit as absent from the PR diff:

| Blocker | Type | Status |
|---------|------|--------|
| Any `src/` or `app/` code changes | HARD BLOCKER — auto-reject if present | Must be absent |
| Any `supabase/` migration changes | HARD BLOCKER — auto-reject if present | Must be absent |
| Any `.github/workflows/` changes | HARD BLOCKER — auto-reject if present | Must be absent |
| Builder appointment artifacts | HARD BLOCKER — no PBFAG, no Stage 7–9 gate-passes | Must be absent |
| Architecture gate-pass | HARD BLOCKER — Stage 5 gate-pass not in scope | Must be absent |
| QA-to-Red gate-pass | HARD BLOCKER — Stage 6 not in scope | Must be absent |
| PBFAG pass | HARD BLOCKER — Stage 7 not in scope | Must be absent |
| Build authorisation | HARD BLOCKER — NOT CLEARED; must not appear in any artifact | Must be absent |
| Deployment authorisation | HARD BLOCKER | Must be absent |

**Wave-specific governance blocker**: If any BUILD_PROGRESS_TRACKER.md Stage 6–12 guardrail
update inadvertently marks a stage as `STARTED`, `IN_PROGRESS`, or `COMPLETE` without the
requisite upstream evidence, this constitutes a false stage advancement claim → REJECTION-PACKAGE
under OVL-PBG-008.

---

### 5. IAA Challenge Questions for Final Audit

IAA will challenge the following at handover:

1. **Stage advancement integrity (OVL-PBG-008)**: Do any of the BUILD_PROGRESS_TRACKER.md
   Stage 6–12 guardrail entries inadvertently claim stage completion, "STARTED", or
   "IN_PROGRESS" for Stage 6–9 without the required upstream CS2 approvals for Stages 2–4
   being in place? IAA will verify that all Stages 6–12 entries remain `NOT_STARTED` or
   explicitly `FUTURE_SCOPE`.

2. **Change-Propagation Audit (OVL-PBG-014)**: Which Stage 1–4 artifacts were substantively
   modified in this wave? For each modified artifact, is there a change-propagation log entry
   showing downstream artifact assessment (e.g., if FRS changed: was TRS traceability updated?
   If TRS changed: was Architecture impact assessed?)?

3. **Stage 4 TRS ↔ FRS v0.2-hardened consistency**: Does the TRS reflect the FRS v0.2-hardened
   changes from maturion-isms#1556? The TRS was explicitly noted as "draft-only — Issue #1556
   changes must be propagated before Stage 4 can be reviewed." If FRS was modified in this wave,
   was the corresponding TRS update made?

4. **Non-scope verification (HARD)**: IAA will independently run `git diff --name-only` against
   main at handover. Any `src/`, `supabase/`, or `.github/workflows/` file in the diff =
   REJECTION-PACKAGE regardless of Foreman's declarations.

5. **_readiness/ artifact framing**: Are the new `modules/pit/_readiness/` artifacts framed
   explicitly as preparation/governance notes (not gate-pass evidence)? Any artifact that
   implies a gate has been passed (Stage 6 QA-to-Red, Stage 7 PBFAG, etc.) when it has not =
   REJECTION-PACKAGE.

6. **Temporal integrity (A-036)**: Do any artifact revisions contain future-dated claims
   (e.g., "Stage X will be complete by [date]" framed as a factual completion statement)?

7. **OVL-INJ-001 pre-brief path**: Has Foreman declared
   `.agent-admin/assurance/iaa-wave-record-pit-prebuilt-retrofit-20260508.md` as the
   pre-brief artifact path in the PREHANDOVER proof? This wave record contains the `## PRE-BRIEF`
   section per v6.2.0 contract architecture (NO-STANDALONE-PREBRIEF-001).

8. **Ceremony completeness (A-021)**: Were all ceremony artifacts committed to the branch before
   PR #1576 was opened? IAA will verify commit timestamps at handover.

---

## TOKEN

> **[PLACEHOLDER]** — IAA final-verdict token to be appended here after Phase 3–4 assurance at PR handover.
> Token format: `PHASE_B_BLOCKING_TOKEN: IAA-session-pit-prebuilt-retrofit-20260508-[PASS/FAIL]-[date]`
> This section is populated by IAA only. No other agent may write to this section.

---

## REJECTION_HISTORY

**Rejection 1**: IAA-session-pit-prebuilt-retrofit-20260508-FAIL-20260508
- FAIL-1 (A-021): ECAP bundles staged but not committed before IAA invocation
- FAIL-2 (A-026): Scope declaration listed uncommitted files
- FAIL-3 (ACR-01): Dependent on FAIL-1
- Substantive content: PASS (all OVL-PBG checks passed)
- Resolution: Committed all staged/untracked files; re-invoking IAA

**Rejection 2**: IAA-session-pit-prebuilt-retrofit-20260508-R2-FAIL-20260508
- **FAIL-1 (ACR-04 AUTO-REJECT)**: PREHANDOVER `files_changed_count_final_expected: 16` — actual `git diff --name-only origin/main...HEAD | wc -l` = **19**. Count understated by 3. AUTO-REJECT per ACR-04.
- **FAIL-2 (A-026 / ACR-07)**: Scope declaration IN_SCOPE list declares **18 files**; actual diff contains **19 files**. Undeclared file: `.agent-workspace/execution-ceremony-admin-agent/bundles/session-pit-prebuilt-retrofit-20260508.md`. Scope declaration's own rule states `.agent-workspace/**` is out of scope except explicitly listed files — this file is NOT listed. PREHANDOVER (16), scope declaration (18), actual (19) are mutually inconsistent across artifacts — ACR-07 AUTO-REJECT.
- **Classification**: Ceremony (process/artifact/naming). Introduced by Rejection 1 fix: committing staged files added this ECAP session-memory bundle file but scope declaration and PREHANDOVER counts were not updated.
- **Systemic pattern**: Second consecutive rejection for file-count/scope-declaration staleness. Pattern: "fix-commit adds files not tracked in scope declaration counts." Prevention action required: FAIL-ONLY-ONCE promotion.
- **Substantive content**: PASS — OVL-PBG-001/002/006/008/014, OVL-INJ-001, non-scope verification, build-authorization, and stage-gating all PASS. No src/supabase/CI files in diff.
- **Required fix**:
  1. Add `.agent-workspace/execution-ceremony-admin-agent/bundles/session-pit-prebuilt-retrofit-20260508.md` to scope declaration IN_SCOPE list with description.
  2. Update PREHANDOVER `files_changed_count_final_expected` from `16` to `19`.
  3. Run `git diff --name-only origin/main...HEAD | wc -l` after fix commit to confirm = 20 (or whatever final count is after the fix commit itself is included).
  4. Verify no other undeclared files exist in diff.
  5. Re-commit both documents with clean `git status --porcelain`.
   6. Re-invoke IAA.

**Rejection 3 (R4 invocation)**: IAA-session-pit-prebuilt-retrofit-20260508-R4-FAIL-20260508
- **FAIL-1 (ACR-02 AUTO-REJECT)**: Active-bundle session memory still contains stale pre-invocation wording while PASS gates are declared and final assurance is being requested. Evidence: `.agent-workspace/execution-ceremony-admin-agent/bundles/session-pit-prebuilt-retrofit-20260508.md` line 269 (`IAA assurance verdict | PENDING — IAA invocation not yet performed`) and lines 277–278/282 (`Pending Foreman commit` for already committed artifacts).
- **FAIL-2 (ACR-10 AUTO-REJECT)**: Final-state proof contains pending/in-progress gate language while `merge_gate_parity: PASS` is declared. Evidence: `.agent-workspace/execution-ceremony-admin-agent/bundles/PREHANDOVER-session-pit-prebuilt-retrofit-20260508.md` lines 501 (`guard_result: IN_PROGRESS — pending successful re-invocation`) and 514 (`merge_gate_parity: PASS`).
- **FAIL-3 (ACR-12 AUTO-REJECT)**: Cross-artifact final-state contradiction inside active bundle. Evidence: same session artifact declares ECAP artifacts `✅ Committed` (lines 66–67) and later `Pending Foreman commit` (lines 277–278/282) for the same files.
- **Classification**: Ceremony + Systemic recurrence (same stale-status normalization family as prior rejection chain).
- **Required fix**:
  1. Normalize active-bundle PREHANDOVER and session-memory files to a single committed/post-invocation truth model (remove `PENDING — IAA invocation not yet performed`, `Pending Foreman commit`, and `guard_result: IN_PROGRESS` wording).
  2. Ensure no active artifact contains pending/in-progress gate language when asserting `merge_gate_parity: PASS`.
  3. Re-run cross-artifact coherence sweep and commit synchronized ECAP + Foreman memory copies.
  4. Re-invoke IAA after commit; no additional scope/count drift permitted.

---

*Wave record created: 2026-05-08 | IAA v6.2.0 | Phase 0 PRE-BRIEF mode | Adoption: PHASE_B_BLOCKING*
