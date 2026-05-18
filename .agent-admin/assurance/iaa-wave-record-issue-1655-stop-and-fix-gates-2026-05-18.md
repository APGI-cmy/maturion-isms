# IAA Wave Record — issue-1655-stop-and-fix-gates

**Wave**: issue-1655-stop-and-fix-gates  
**Date**: 2026-05-18  
**Branch**: copilot/enforce-iaa-stop-and-fix-gates  
**Issue**: #1655 — Enforce IAA and producer-side STOP_AND_FIX on failed product journey gates before handover  
**Mode**: FULL ASSURANCE INVOKED (PRE-BRIEF + FINAL TOKEN)

---

## PRE-BRIEF (HISTORICAL SNAPSHOT)

Qualifying tasks: [Journey classification for affected product flows; producer-side affected-gate enforcement before handover; IAA hard rejection on failed affected journey gates; Foreman/POLC handover rejection on failed journey gates; injection compliance failed-gate extraction; behavioural-evidence-quality enforcement for route/handoff/compile/publish/upload; handover claim state enforcement (STOP_AND_FIX or CS2_INTERVENTION_REQUIRED only)]

Applicable overlay: [MIXED → PRODUCT_BUILD_ASSURANCE + CI_WORKFLOW + CANON_GOVERNANCE (AMBIGUITY RULE: IAA mandatory)]

Anti-regression obligations: [YES — FUNCTIONAL-BEHAVIOUR-REGISTRY.md is in scope because this wave enforces failed user-journey gate behavior (no handover on known red journey gates)]

### Trigger categories (declared)
- Primary: `PRODUCT_BUILD_ASSURANCE` (issue scope is failed live journey gates and handover prohibition on red journeys)
- Secondary: `CI_WORKFLOW` (explicit gate-enforcement behavior is expected in workflow/preflight gates)
- Secondary: `CANON_GOVERNANCE` (STOP_AND_FIX governance behavior and handover posture rules)
- Resolution: `MIXED` (IAA required)

### FFA checks (declared for this wave)
- FFA-01 Delivery Completeness: Required
- FFA-02 Wiring Verification: Required
- FFA-03 Integration Fit: Required
- FFA-04 Security: Required
- FFA-05 Code Quality: Required
- FFA-06 One-Time Build: Required
- FFA-CARRY-FORWARD: Allowed only for out-of-sandbox blockers; never for known in-scope failed journey gates

### PREHANDOVER structure (required before full IAA invocation)
1. Session metadata (wave/branch/issue/PR/session)
2. Scope declaration parity and changed-file inventory
3. Affected journey classification table (changed file → journey → required gates)
4. Failed affected gate extraction snapshot (current-head, per gate, PASS/FAIL/PENDING with evidence timestamp)
5. STOP_AND_FIX decision block (`RESULT`, `HANDOVER_ALLOWED`, `REQUIRED_ACTION`)
6. Behavioral evidence section (not source-string-only) for route/handoff/compile/publish/upload flows
7. `iaa_audit_token` expected-reference format per A-029 (not `PENDING`)
8. Ceremony admin state (`ceremony_admin_appointed`) and ECAP references if appointed

### Scope blockers (resolved before full assurance invocation)
1. `wave-current-tasks.md` has no active wave entry for `issue-1655-stop-and-fix-gates`
2. `ceremony_admin_appointed` is not declared for this wave in the active task tracker
3. No committed PREHANDOVER proof artifact path declared for this wave
4. No committed per-PR/per-wave scope declaration path declared for this wave
5. No committed current-head affected-gate evidence bundle linked yet for calibration baseline PR #1653 failure pattern

### Pre-brief status
**COMPLETE** — scope blockers 1–5 were resolved and full assurance invocation was completed for this PR context.

---

## TOKEN

PHASE_B_BLOCKING_TOKEN: IAA-PR1656-STOP-AND-FIX-GATES-20260518-PASS
- **Verdict**: ASSURANCE-TOKEN (PASS)
- **PR**: maturion-isms#1656
- **Issue**: maturion-isms#1655
- **Reviewed SHA**: CURRENT_HEAD
