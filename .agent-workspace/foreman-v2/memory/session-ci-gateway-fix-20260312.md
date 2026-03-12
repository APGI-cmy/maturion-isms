# Session Memory — foreman-v2-agent — CI Gateway Fix

**Session ID**: session-ci-gateway-fix-20260312
**Date**: 2026-03-12
**Agent Version**: foreman-v2-agent v6.2.0 (contract 2.7.0)
**Branch**: copilot/fix-ci-gateway-failure
**Triggering Issue**: maturion-isms#1085 — CI Gateway Failure: Deploy Preview & agent-contract/authority-check
**PR**: maturion-isms#1086

---

## Preflight Attestation

```yaml
fail_only_once_attested: true
fail_only_once_version: 3.7.0
unresolved_breaches: none
canon_inventory_check: PASS
tier2_loaded: true
prior_sessions_reviewed: [session-wave17-orchestration-20260311, session-wave16-2R-20260310, session-wave16-finish-20260309, session-wave16-full-batch-20260310, session-wave15r-opojd-20260308]
unresolved_items_from_prior_sessions: none
iaa_prebrief_artifact: N/A — CI-fix session (no implementation delegation)
prebrief_wave: ci-gateway-fix
prebrief_tasks_count: 0
```

---

## Wave Summary

**Wave**: CI Gateway Fix (Issue #1085)
**Category**: CI/CD maintenance — no feature implementation
**CS2 Authorization**: Issue opened by CS2 (@APGI-cmy) and assigns foreman-v2-agent; constitutes valid CS2 wave-start authorization per foreman contract §2.1

---

## Root Cause Analysis

Two CI gateway failures identified in PRs #1081 and #1084:

### Failure 1: Deploy MAT Frontend to Vercel / Type Check API Routes (pull_request)
- **Root cause**: `typecheck-api` job used `pnpm install --frozen-lockfile`; lockfile was out of sync after `@testing-library/dom ^10.4.0` was added in PR #1082 without updating `pnpm-lock.yaml` specifiers
- **Fix A** (in main via PR #1084): Changed `--frozen-lockfile` → `--no-frozen-lockfile` in `typecheck-api` job only
- **Fix B** (this PR): Added missing `@testing-library/dom` specifier to `modules/mat/frontend` section of `pnpm-lock.yaml` — this resolves Vercel Deploy Preview failure where Vercel uses `pnpm install` with frozen-lockfile semantics by default

### Failure 2: agent-contract/authority-check Expected — Waiting
- **Root cause**: `agent-contract-audit.yml` had `paths: ['.github/agents/**']` filter on `pull_request_target` trigger; PRs not touching agent files never triggered the workflow, so branch protection check `agent-contract/authority-check` never received a status
- **Fix** (in main via PR #1084): (1) Removed `paths:` filter from `pull_request_target` trigger; (2) Added always-run `authority-check` job (JOB 5) that exits 0 whether or not agent files changed — ensuring the required branch protection check always receives a status

---

## Files Changed in This Session

| File | Type | Change |
|------|------|--------|
| `pnpm-lock.yaml` | Dependency lockfile | Added missing `@testing-library/dom ^10.4.0` specifier for `modules/mat/frontend` workspace |

---

## Roles Invoked

```yaml
roles_invoked:
  - POLC-Orchestration
  - Quality-Professor (self-QA of lockfile fix)
```

## Mode Transitions

```yaml
mode_transitions:
  - PREFLIGHT → POLC-Orchestration (CI investigation)
  - POLC-Orchestration → Quality-Professor (verify fix locally)
  - Quality-Professor → POLC-Orchestration (fix PASS)
  - POLC-Orchestration → Phase-4-Handover (CI confirmation)
```

---

## Agents Delegated To

No builder agents delegated. This session was a CI-fix / supervision-correction only:
- `pnpm-lock.yaml` specifier update (dependency file, not implementation code)
- Investigation and root cause analysis performed directly

---

## QP Self-Verification

| Check | Result |
|-------|--------|
| `pnpm install --frozen-lockfile` passes locally | ✅ PASS |
| `pnpm exec tsc -p api/tsconfig.json --noEmit` passes locally | ✅ PASS |
| `agent-contract-audit.yml` has `authority-check` job (JOB 5) | ✅ CONFIRMED |
| `deploy-mat-vercel.yml` `typecheck-api` uses `--no-frozen-lockfile` | ✅ CONFIRMED |
| `pnpm-lock.yaml` specifiers include `@testing-library/dom` for `modules/mat/frontend` | ✅ CONFIRMED |

---

## Escalations Triggered

```yaml
escalations_triggered: none
```

---

## Separation Violations Detected

```yaml
separation_violations_detected: none
```

---

## Suggestions for Improvement

1. **Add `pnpm-lock.yaml` to deploy-mat-vercel.yml paths filter**: Currently the Deploy Preview job only triggers on `modules/**`, `api/**`, etc. Adding `pnpm-lock.yaml` to the paths would ensure CI validates the lockfile fix immediately on the fix PR itself, not just on future feature PRs.

2. **Lockfile sync in CI**: Add an explicit `pnpm install --frozen-lockfile` validation step to the CI pipeline that runs on ALL PRs (not just when module files change) to catch lockfile drift early before it reaches the Deploy Preview stage.

---

**Authority**: CS2 (Johan Ras / @APGI-cmy)
**Session close**: CI gateway fix verified. Both root causes resolved. Lockfile specifier updated. PR #1086 ready for CS2 review.
