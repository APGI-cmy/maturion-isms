# IAA Wave Record — pit-stage8-implementation-plan

WAVE: pit-stage8-implementation-plan
DATE: 2026-05-19
BRANCH: copilot/initiate-pit-stage-8-implementation-plan
ISSUE: #1677 — Foreman: Initiate PIT Stage 8 Implementation Plan after Stage 7 gate-pass merge
PR: #1678
MODE: PRE-BRIEF (PHASE 0 only)

---

## PRE-BRIEF

IAA_PREFLIGHT_BRIEF
PR: #1678
ISSUE: #1677
WAVE: pit-stage8-implementation-plan
CURRENT_HEAD_SHA: CURRENT_HEAD
WAVE_TASKS_PATH: .agent-workspace/foreman-v2/personal/wave-current-tasks.md
FOREMAN_OBJECTIVE: Initiate Stage 8 planning artifacts only after Stage 7 gate-pass confirmation while preserving strict non-build boundary and governance parity.

Qualifying tasks: [Stage 8 tracker initiation posture; Stage 8 implementation-plan filing; per-PR admin/scope parity updates; preflight contract alignment for current PR head.]

Applicable overlay: [PRE_BUILD_STAGE_MODEL (mandatory) + PRE_BUILD_GATES overlay for planning-stage readiness artifacts.]

Anti-regression obligations: [No runtime/build delivery obligations in this planning wave; governance parity and preflight contract integrity remain mandatory.]

EXPECTED_QA_SCOPE:
- `modules/pit/BUILD_PROGRESS_TRACKER.md`
- `modules/pit/08-implementation-plan/implementation-plan.md`
- `.admin/prs/pr-1678.json` and `.agent-admin/scope-declarations/pr-1678.md`
- `.agent-workspace/foreman-v2/personal/wave-current-tasks.md`

EXPECTED_FAILURE_MODES:
- PR mismatch between active preflight artifact and actual PR number
- missing per-PR scope/admin artifacts for the active PR
- scope declaration FILES_CHANGED mismatch against current diff
- preflight pointer drift between wave-current-tasks and active IAA artifact

FOREMAN_INSTRUCTIONS:
- maintain Stage 8 as planning-only (no implementation start, no builder appointment, no Stage 9+ progression)
- preserve Build Authorization as NOT CLEARED
- keep per-PR admin/scope evidence aligned to PR #1678 and exact final diff
- keep active preflight path and wave tracker fields synchronized

IAA_WILL_QA:
- `preflight/iaa-prebrief-existence` contract fields and PR/current-head relevance checks
- `preflight/scope-declaration-parity` and `preflight/mmm-pr-admin` exactness checks
- `preflight/evidence-exactness` consistency across tracker/plan/scope/admin artifacts

RESULT: PREFLIGHT_BRIEF_COMPLETE

### Trigger categories (declared)
- Primary: `PRE_BUILD_STAGE_MODEL` — Stage 8 implementation-plan/tracker stage progression artifacts.
- Conditional: `MIXED` — applies when governance/admin evidence artifacts are included with triggering module artifacts.

### FFA checks (declared)
- FFA-01..FFA-06: Not active for Stage 8 planning-only initiation wave.

### PREHANDOVER structure / evidence required before full IAA invocation
1. Scope declaration exact parity with final changed-file set.
2. Stage-readiness posture proving Stage 8 planning-only boundary.
3. RED-to-GREEN allocation evidence references and route allocation completeness.
4. Token/cross-reference fields completed at final assurance phase.

### Scope blockers
1. None open after PR #1678 parity remediation.

### ECAP / IAA expectation
- ECAP: expected at handover phase if required by governed path mix.
- IAA: required for final assurance release.

### Pre-brief status
COMPLETE — CLEAR FOR PLANNING-ONLY STAGE 8 ARTIFACT MAINTENANCE.

---

## PREHANDOVER_EMBEDDED

Pending future full assurance invocation. Not populated in PRE-BRIEF mode.

---

## TOKEN

Pending future full assurance invocation. Not populated in PRE-BRIEF mode.

---

## REJECTION_HISTORY

No rejection entries recorded at PRE-BRIEF stage.
