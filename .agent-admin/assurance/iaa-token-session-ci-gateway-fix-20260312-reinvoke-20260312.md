# IAA Assurance Token — Re-Invocation Verdict

**Token Reference**: IAA-session-ci-gateway-fix-20260312-reinvoke-20260312-PASS
**Token Type**: ASSURANCE-TOKEN
**Date**: 2026-03-12
**Agent**: independent-assurance-agent v6.2.0 (contract 2.2.0)
**Adoption Phase**: PHASE_B_BLOCKING

---

## PR Under Review

- **PR**: maturion-isms#1086 — fix(ci): sync pnpm-lock.yaml + add pnpm-lock.yaml to deploy-mat-vercel.yml paths
- **Branch**: copilot/fix-ci-gateway-failure
- **Wave**: ci-gateway-fix-20260312
- **Issue**: maturion-isms#1085
- **Producing Agent**: foreman-v2-agent (class: foreman)
- **Invoked By**: foreman-v2-agent (via CS2 re-alignment directive 2026-03-12)

---

## Re-Invocation Context

This is a RE-INVOCATION after REJECTION-PACKAGE `IAA-session-ci-gateway-fix-20260312-REJECTION-20260312`.
All 3 cited failures have been resolved and committed.

| Prior Failure | Resolution | Git Verified |
|--------------|-----------|-------------|
| CORE-018(a): PREHANDOVER not committed | PREHANDOVER committed at HEAD | ✅ git ls-tree confirmed |
| CORE-018/CORE-021: FAIL-ONLY-ONCE v3.8.0 INC-CI-GATEWAY-FIX-001 not committed | Committed at HEAD; v3.8.0 with INC-CI-GATEWAY-FIX-001 confirmed | ✅ git show confirmed |
| CORE-007/CORE-021: Corrected session memory not committed (iaa_prebrief_artifact: N/A) | Committed corrected version: fail_only_once_version: 3.8.0, iaa_prebrief_artifact: correct path | ✅ git show confirmed |

---

## Verdict

```
═══════════════════════════════════════
ASSURANCE-TOKEN
PR: maturion-isms#1086
All 24 checks PASS. Merge gate parity: PASS.
Merge permitted (subject to CS2 approval).
Token reference: IAA-session-ci-gateway-fix-20260312-reinvoke-20260312-PASS
Adoption phase: PHASE_B_BLOCKING
═══════════════════════════════════════
```

---

## Checks Summary

| Category | Checks | PASS | FAIL |
|---------|--------|------|------|
| FAIL-ONLY-ONCE learning | 7 | 7 | 0 |
| Core invariants (applicable) | 9 | 9 | 0 |
| CI_WORKFLOW overlay | 5 | 5 | 0 |
| PRE_BRIEF_ASSURANCE overlay | 3 | 3 | 0 |
| **Total** | **24** | **24** | **0** |

---

## Key Evidence (A-033 Git-Verified)

All artifacts verified via `git ls-tree -r HEAD` and `git show HEAD:<path>` — NOT disk existence.

1. `pnpm-lock.yaml` — FOUND IN GIT TREE ✅
2. `.github/workflows/deploy-mat-vercel.yml` — FOUND IN GIT TREE ✅
3. `.agent-admin/assurance/iaa-prebrief-ci-gateway-fix-20260312.md` — FOUND IN GIT TREE (332 lines) ✅
4. `.agent-workspace/independent-assurance-agent/memory/session-prebrief-ci-gateway-fix-20260312.md` — FOUND IN GIT TREE ✅
5. `.agent-workspace/foreman-v2/knowledge/FAIL-ONLY-ONCE.md` — v3.8.0 + INC-CI-GATEWAY-FIX-001 CONFIRMED ✅
6. `.agent-workspace/foreman-v2/memory/session-ci-gateway-fix-20260312.md` — corrected version CONFIRMED ✅
7. `.agent-workspace/foreman-v2/memory/PREHANDOVER-session-ci-gateway-fix-20260312.md` — FOUND IN GIT TREE ✅
8. `.agent-workspace/foreman-v2/personal/wave-current-tasks.md` — FOUND IN GIT TREE ✅
9. `.agent-workspace/foreman-v2/parking-station/suggestions-log.md` — FOUND IN GIT TREE ✅
10. `.agent-admin/assurance/iaa-token-session-ci-gateway-fix-20260312.md` (prior REJECTION) — FOUND IN GIT TREE ✅

---

## Governance Observation (non-blocking)

`SCOPE_DECLARATION.md` at HEAD shows wave-16.2-gap-remediation (different wave/branch). This was evaluated as MOOT in the prior REJECTION-PACKAGE session and was not cited as a required fix. Flagged for future wave hygiene. Not a blocking finding for this invocation per Orientation Mandate §1.3 (ceremony admin) and A-030 re-invocation scope.

---

**Authority**: CS2 only (@APGI-cmy)
**IAA Version**: independent-assurance-agent v6.2.0
**Session**: session-ci-gateway-fix-20260312-reinvoke
**Verdict**: ASSURANCE-TOKEN — IAA-session-ci-gateway-fix-20260312-reinvoke-20260312-PASS
