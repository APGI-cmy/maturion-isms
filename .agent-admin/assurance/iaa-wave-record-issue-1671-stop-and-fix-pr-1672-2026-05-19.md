# IAA Wave Record — issue-1671-stop-and-fix-pr-1672

**Wave**: issue-1671-stop-and-fix-pr-1672  
**Date**: 2026-05-19  
**Branch**: copilot/restore-iaa-pre-flight-briefing  
**Issue**: #1671 — Restore IAA pre-flight briefing as proactive QA contract  
**PR**: #1672  
**Mode**: PRE-BRIEF (PHASE 0 only)

---

## PRE-BRIEF

Qualifying tasks: [Restore pre-flight contract enforcement in `.github/scripts/iaa-preflight-contract-gate.sh`; add/expand regression coverage in `.github/scripts/iaa-preflight-contract-gate.test.sh`; align final-assurance gate and tests (`.github/scripts/iaa-final-assurance-gate.sh`, `.github/scripts/iaa-final-assurance-gate.test.sh`); align checkpoint ingestion behavior in `.github/scripts/pre-handover-checkpoint.js` + tests; update `.github/workflows/preflight-evidence-gate.yml` wiring.]

Applicable overlay: [MIXED → CI_WORKFLOW (mandatory trigger via `.github/workflows/preflight-evidence-gate.yml`) + governance-control script surface; AMBIGUITY RULE ACTIVE — IAA required.]

Anti-regression obligations: [NO — FUNCTIONAL-BEHAVIOUR-REGISTRY mandatory niggle checks are BUILD/AAWP_MAT-scoped; this wave is workflow/governance gate hardening, not product-journey delivery.]

### Trigger categories (declared)
- Primary: `CI_WORKFLOW` (workflow file changed).
- Resolution: `MIXED` (workflow + gate scripts/tests). IAA remains mandatory.

### FFA checks (declared for this wave)
- FFA-01 Delivery Completeness: Required
- FFA-02 Wiring Verification: Required
- FFA-03 Integration Fit: Required
- FFA-04 Security: Required
- FFA-05 Code Quality: Required
- FFA-06 One-Time Build: Required

### PREHANDOVER structure / evidence required before full IAA invocation
1. Scope declaration aligned to exact changed-file inventory.
2. Trigger classification table proving CI/workflow trigger path.
3. Preflight gate execution evidence for pass and fail paths.
4. Current-head parity evidence for checkpoint/freshness logic.
5. Wave checklist reference in PREHANDOVER proof (`wave_checklist`, `status`, `pending`, `descoped`, `iaa_prebrief`, `prebrief_status`).
6. `iaa_audit_token` expected-reference format per A-029 (no legacy `PENDING` format).
7. Ceremony-admin state declaration and ECAP references if appointed.

### Scope blockers
1. `.agent-workspace/foreman-v2/personal/wave-current-tasks.md` currently declares a different wave (`issue-1660-trigger-injection-intake-classification`), not this wave.
2. `ceremony_admin_appointed` is not explicitly declared for wave `issue-1671-stop-and-fix-pr-1672` in an active wave tracker.
3. No committed `.admin/prs/pr-1672.json` artifact found.
4. No committed `.agent-admin/scope-declarations/pr-1672.md` artifact found.

### Ceremony admin appointment check
- Active tracker file shows: `ceremony_admin_appointed: PENDING` (for wave `issue-1660-trigger-injection-intake-classification`).
- For wave `issue-1671-stop-and-fix-pr-1672`: **NOT YET DECLARED**.

### Pre-brief status
**COMPLETE — BLOCKED PENDING SCOPE SETUP.** Phase 0 PRE-BRIEF is recorded; full IAA assurance readiness is blocked until scope blockers are resolved.

---

## PREHANDOVER_EMBEDDED

Pending future full assurance invocation. Not populated in PRE-BRIEF mode.

---

## TOKEN

Pending future full assurance invocation. Not populated in PRE-BRIEF mode.

---

## REJECTION_HISTORY

No rejection entries recorded at PRE-BRIEF stage.
