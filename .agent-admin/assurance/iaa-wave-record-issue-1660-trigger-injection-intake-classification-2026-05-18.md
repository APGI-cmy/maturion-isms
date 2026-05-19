# IAA Wave Record — issue-1671-stop-and-fix-pr-1672

> Record path retained from the original wave-file anchor for deterministic pre-flight timing provenance; content below is the active pre-brief contract for PR #1672.

WAVE: issue-1671-stop-and-fix-pr-1672
DATE: 2026-05-19
BRANCH: copilot/restore-iaa-pre-flight-briefing
ISSUE: #1671 — Restore IAA pre-flight briefing as proactive QA contract
PR: #1672
MODE: PRE-BRIEF (PHASE 0 only)

---

## PRE-BRIEF

IAA_PREFLIGHT_BRIEF
PR: #1672
ISSUE: #1671
WAVE: issue-1671-stop-and-fix-pr-1672
CURRENT_HEAD_SHA: CURRENT_HEAD
WAVE_TASKS_PATH: .agent-workspace/foreman-v2/personal/wave-current-tasks.md
FOREMAN_OBJECTIVE: Resolve CS2 STOP_AND_FIX blockers while preserving strict pre-flight contract semantics and proving no governance weakening.

Qualifying tasks: [Pre-flight contract gate hardening; final IAA cross-reference enforcement; strict gate-change evidence collation; scope/admin parity remediation; full preflight rerun on current head.]

Applicable overlay: [MIXED → CI_WORKFLOW + governance-control script surface. AMBIGUITY RULE ACTIVE — IAA mandatory.]

Anti-regression obligations: [NO product-journey delivery obligations; YES governance gate regression obligations for changed gate scripts/workflows.]

EXPECTED_QA_SCOPE:
- `.github/scripts/iaa-preflight-contract-gate.sh` and `.github/scripts/iaa-preflight-contract-gate.test.sh`
- `.github/scripts/iaa-final-assurance-gate.sh` and `.github/scripts/iaa-final-assurance-gate.test.sh`
- `.github/scripts/pre-handover-checkpoint.js` and `.github/scripts/pre-handover-checkpoint.test.sh`
- `.github/workflows/preflight-evidence-gate.yml`
- `.admin/prs/pr-1672.json`, `.agent-admin/scope-declarations/pr-1672.md`, `.agent-admin/evidence/pr-1672-strict-gate-change-evidence.md`

EXPECTED_FAILURE_MODES:
- stale or mismatched pre-flight artifact reference in `wave-current-tasks.md`
- missing scope declaration parity (`pr-1672.md`) or manifest parity (`pr-1672.json`)
- strict gate logic changed without concrete evidence entries
- missing current-head parity between declared evidence and actual head
- final IAA artifact missing pre-flight cross-reference fields
- post-failure package closure claimed while unresolved items remain

FOREMAN_INSTRUCTIONS:
- produce per-PR scope declaration and PR admin manifest with exact changed-file parity
- include concrete strict gate-change evidence (local command output + current-head workflow run proof + no-weakening statement)
- keep pre-flight contract active and referenced by wave tracker before any handover claim
- do not emit closure posture for rejection package handling until unresolved items are cleared
- ensure final IAA assurance cites active pre-flight artifact and expectation status fields

IAA_WILL_QA:
- `preflight/iaa-prebrief-existence` contract fields and relevance checks
- `preflight/scope-declaration-parity` and `preflight/mmm-pr-admin` exactness/parity
- `preflight/gate-changing-pr-rule` strict evidence requirements for gate/workflow edits
- `preflight/iaa-final-assurance` final cross-reference fields and current-head linkage
- `preflight/evidence-exactness` consistency between scope/admin/evidence artifacts

RESULT: PREFLIGHT_BRIEF_COMPLETE

### Trigger categories (declared)
- Primary: `CI_WORKFLOW` — issue scope explicitly requires PR lifecycle triggers, checkpoint/preflight jobs, and review/handover gate behavior.
- Primary: `CANON_GOVERNANCE` — issue scope changes governance/control posture for injection freshness, ECAP/IAA classification timing, and handover blocking rules.
- Conditional upgrade: `PRODUCT_BUILD_ASSURANCE` — applies if the implementation touches route/handoff/compile/publish/upload/generate journey logic or producer-side affected-gate evaluation paths.
- Resolution: `MIXED` — IAA mandatory. Ambiguity does not resolve to exempt.

### FFA checks (declared for this wave)
- FFA-01 Delivery Completeness: Required
- FFA-02 Wiring Verification: Required
- FFA-03 Integration Fit: Required
- FFA-04 Security: Required
- FFA-05 Code Quality: Required
- FFA-06 One-Time Build: Required
- FFA-CARRY-FORWARD: Allowed only for genuine out-of-sandbox blockers; never for stale injection extraction, missing current-head inspection, or missing ECAP/IAA invocation evidence.

### PREHANDOVER structure / evidence required before full IAA invocation
1. Session metadata (wave, branch, issue, PR, current-head SHA, session)
2. Scope declaration parity with changed-file inventory and trigger-category mapping
3. Injection intake snapshot showing: `INJECTION_INTAKE_STATUS`, `CURRENT_HEAD_SHA`, `GOVERNING_ISSUE`, `CS2_COMMENTS_DETECTED`, `PR_CHECKLIST_ITEMS_DETECTED`, `FAILED_GATE_COMMENTS_DETECTED`, `ECAP_REQUIRED`, `IAA_REQUIRED`, `PRODUCER_SIDE_GATES_REQUIRED`, `NEXT_REQUIRED_CONTROL`, `HANDOVER_ALLOWED`
4. Injection freshness evidence showing: `LATEST_INJECTION_INTAKE_SHA`, `LATEST_INJECTION_INTAKE_AT`, `LATEST_RELEVANT_INSTRUCTION_AT`, `LATEST_INJECTION_INTAKE_AFTER_LAST_CS2_COMMENT`, `LATEST_INJECTION_INTAKE_AFTER_LAST_PR_BODY_EDIT`, `LATEST_INJECTION_INTAKE_AFTER_LAST_FAILED_GATE_SIGNAL`, `INJECTION_STATE`
5. Trigger-classification table mapping changed files / signals to ECAP, IAA, producer-side gates, and required next control action
6. Current-head CI inspection evidence showing: `CURRENT_HEAD_CI_INSPECTED`, `AFFECTED_GATES_RUN_OR_INSPECTED`, `FAILED_AFFECTED_GATES`, `PENDING_AFFECTED_GATES`, `MISSING_AFFECTED_GATES`, `RESULT`, `HANDOVER_ALLOWED`
7. Review-ready / handover-ready posture evidence proving stale or missing intake/control state blocks review or handover claims with `REVIEW_READY_BLOCKED`, `CHECKPOINT_REQUIRED`, or `STOP_AND_FIX`
8. Injection-compliance final safety-net snapshot proving: `INJECTION_COMPLIANCE_RESULT: COMPLIANT`, `UNCHECKED_REQUIRED_ITEMS: none`, `UNAUTHORIZED_DEVIATIONS: none`, ECAP/IAA requirement satisfied, and no failed/pending/missing affected gates
9. Evidence location declaration for the intake/checkpoint output using an existing canonical artifact/check path (issue forbids creating a new default standalone proof family)
10. `iaa_audit_token` expected-reference format per A-029 (not legacy `PENDING`)
11. Ceremony-admin state (`ceremony_admin_appointed`) plus ECAP bundle/reconciliation references if appointed

### Scope blockers
1. `.agent-admin/scope-declarations/pr-1672.md` missing at pre-brief time.
2. `.admin/prs/pr-1672.json` missing at pre-brief time.
3. Strict gate evidence bundle not yet committed at pre-brief time.

### ECAP / IAA expectation
- ECAP: **YES — EXPECTED** for workflow/governance-control surface prior to handover.
- IAA: **YES — EXPECTED** for this wave and for final assurance release.

### Ceremony admin appointment check
- Active tracker must declare `ceremony_admin_appointed` for wave `issue-1671-stop-and-fix-pr-1672` prior to handover.

### Pre-brief status
**COMPLETE — BLOCKED PENDING STOP_AND_FIX REMEDIATION.** Full assurance remains blocked until scope/admin/evidence blockers are resolved.

---

## PREHANDOVER_EMBEDDED

Pending future full assurance invocation. Not populated in PRE-BRIEF mode.

---

## TOKEN

Pending future full assurance invocation. Not populated in PRE-BRIEF mode.

---

## REJECTION_HISTORY

No rejection entries recorded at PRE-BRIEF stage.
