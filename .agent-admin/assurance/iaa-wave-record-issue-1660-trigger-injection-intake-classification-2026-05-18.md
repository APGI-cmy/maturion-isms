# IAA Wave Record — issue-1660-trigger-injection-intake-classification

**Wave**: issue-1660-trigger-injection-intake-classification  
**Date**: 2026-05-18  
**Branch**: copilot/trigger-injection-intake-classification  
**Issue**: #1660 — Trigger injection intake and ECAP/IAA classification before review or handover  
**Mode**: PRE-BRIEF (PHASE 0 only)

---

## PRE-BRIEF

Qualifying tasks: [Early injection intake on PR lifecycle events/comments/edits; injection freshness and dirty-state enforcement; early ECAP classification for protected/admin/governance/workflow/gate scope; early IAA classification for product-journey/governance/control/failed-gate scope; current-head CI inspection requirement before review/handover posture; review-ready and handover-ready blocking when intake or controls are stale/missing; `preflight/injection-intake-current` freshness gate introduction; strict pre-handover injection-compliance snapshot enforcement.]

Applicable overlay: [MIXED → CI_WORKFLOW + CANON_GOVERNANCE + PRODUCT_BUILD_ASSURANCE (mandatory if route/handoff/compile/publish/upload/generate flow logic or affected-journey enforcement enters the diff); AMBIGUITY RULE ACTIVE — IAA required.]

Anti-regression obligations: [YES — FUNCTIONAL-BEHAVIOUR-REGISTRY.md is in scope because this wave explicitly governs failed affected-journey signals, current-head gate inspection, review/handover blocking, and PR #1653-style “controls must trigger before handover” behavior.]

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
1. `.agent-workspace/foreman-v2/personal/wave-current-tasks.md` does not yet declare wave `issue-1660-trigger-injection-intake-classification`
2. `ceremony_admin_appointed` is not declared for this wave, so ECAP ceremony posture cannot yet be validated from the active tracker
3. No PR number or committed per-PR scope declaration path is available yet for this wave
4. No branch diff exists yet against `origin/main`, so final trigger classification remains issue-driven/provisional until concrete changed files are present
5. No committed PREHANDOVER proof / checkpoint artifact path is declared yet for this wave
6. No committed current-head injection-intake/freshness evidence location is declared yet; the implementation must use an existing canonical path/check family rather than inventing a new standalone tracked proof family by default

### ECAP / IAA expectation
- ECAP: **YES — EXPECTED**. The issue explicitly requires early ECAP classification for protected/admin/governance/workflow/gate/deployment-control impact. Any diff touching `.github/workflows/**`, `.github/scripts/**`, `governance/**`, `.agent-admin/**`, `.agent-workspace/**`, `.admin/**`, deployment/runtime workflow files, or carrying explicit CS2 ECAP instruction should be treated as ECAP-required before handover.
- IAA: **YES — EXPECTED**. The issue explicitly requires early IAA classification, affects workflow/gate/governance/control behavior, includes failed affected-journey handling and review/handover blocking, and ambiguity cannot resolve to exempt.

### Ceremony admin appointment check
- Active tracker currently references a different wave (`pit-market-comparison-hardening-20260517`)
- For wave `issue-1660-trigger-injection-intake-classification`: **NOT YET DECLARED**

### Pre-brief status
**COMPLETE — BLOCKED PENDING SCOPE SETUP.** Phase 0 PRE-BRIEF completed and committed. Full IAA assurance is not ready until blockers 1–6 are resolved.

---

## PREHANDOVER_EMBEDDED

Pending future full assurance invocation. Not populated in PRE-BRIEF mode.

---

## TOKEN

Pending future full assurance invocation. Not populated in PRE-BRIEF mode.

---

## REJECTION_HISTORY

No rejection entries recorded at PRE-BRIEF stage.
