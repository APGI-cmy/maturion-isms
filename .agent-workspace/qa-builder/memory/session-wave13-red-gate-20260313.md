# QA Builder Session Memory — Wave 13 RED Gate Implementation

**Session ID**: session-wave13-red-gate-20260313
**Agent**: qa-builder
**Class**: Builder
**Date**: 2026-03-13
**Branch**: copilot/mat-wave-13-live-deployment-fix
**Wave**: 13 — Live Deployment Wiring Regression Fix & Continuous Improvement

---

## Task Description

Implement 24 RED gate tests for Wave 13 under Foreman Wave 13 orchestration (ISMS POLC model).

All 24 tests MUST fail (RED) at commit time. They will turn GREEN only when the relevant
builders deliver their implementations.

---

## Pre-Brief Artifact

**Cited**: `.agent-admin/assurance/iaa-prebrief-wave13-live-deployment-fix.md`

Pre-brief confirms Wave 13 tasks, IAA classification (`PHASE_B_BLOCKING`), and evidence requirements.

---

## Files Created

| File | SHA256 (approx) | Purpose |
|------|-----------------|---------|
| `modules/mat/tests/wave13/wave13-gate.test.ts` | *(see git)* | 24 RED gate tests for Wave 13 |
| `.agent-workspace/qa-builder/memory/session-wave13-red-gate-20260313.md` | *(this file)* | Session memory |

**Files NOT modified**: All existing test files preserved exactly (POLC mandate: Do NOT modify existing tests).

---

## Actions Taken

1. **Bootstrap**: Read `.github/agents/qa-builder.md` (Phase 1 complete).
2. **Pre-Brief**: Read `.agent-admin/assurance/iaa-prebrief-wave13-live-deployment-fix.md`.
3. **Baseline audit**: Ran full test suite — confirmed baseline:
   - 940 tests PASSING
   - 8 tests FAILING (pre-existing in wave13 schema/CI tests)
   - 102 test files (2 failing | 100 passing)
4. **Style reference**: Read `modules/mat/tests/wave15/wave15-criteria-parsing.test.ts` for conventions.
5. **Existing tests**: Read all 5 existing wave13 test files to understand what's already covered.
6. **Created**: `modules/mat/tests/wave13/wave13-gate.test.ts` — 24 RED gate tests.
7. **Verified RED**: Ran `vitest run` on the new file — 24/24 FAILING ✓.
8. **Verified baseline**: Full suite run — 940 passing still passing ✓.

---

## Test ID Coverage

| Category | Test IDs | Count | Builder | Fail Trigger |
|----------|----------|-------|---------|--------------|
| Schema & Env-Var Gate | T-W13-SCH-1–4 | 4 | schema-builder | VITE_SUPABASE_URL unset / migration not applied |
| CI Gate (Schema) | T-W13-CI-1–2 | 2 | schema-builder | `schema-existence-check` job / `VITE_LIVE_DEPLOYMENT_URL` absent from workflow |
| Auth Session Wiring | T-W13-AUTH-1–4 | 4 | api-builder | LIVENESS_TEST_EMAIL unset |
| UI Wiring | T-W13-WIRE-1–8 | 8 | ui-builder | LIVENESS_TEST_EMAIL unset + source files absent |
| E2E CWT | T-W13-E2E-1–5 | 5 | integration-builder + qa-builder | VITE_LIVE_DEPLOYMENT_URL unset |
| CI Gate (E2E Auth) | T-W13-CI-3 | 1 | integration-builder | `e2e-auth-smoke` step absent from workflow |
| **TOTAL** | | **24** | | |

---

## Decisions Made

1. **New file vs modifying existing**: Created `wave13-gate.test.ts` as a NEW file per mission spec.
   Existing wave13 test files have overlapping test IDs (T-W13-SCH-1–4, T-W13-CI-1–3 etc.) but
   different assertions. Per POLC: "Do NOT modify any existing test file" — both coexist.

2. **CI test assertion strings**: The mission specifies `schema-existence-check` (T-W13-CI-1),
   `VITE_LIVE_DEPLOYMENT_URL` (T-W13-CI-2), and `e2e-auth-smoke` (T-W13-CI-3). These are
   distinct from the existing `ci-gates.test.ts` assertions (`schema-verification`, `env-var-audit`,
   `post-deploy-smoke-test`). Both sets will need to be GREEN when builders implement CI gates.

3. **WIRE tests**: Used a hybrid env-var-gate + source-level-assertion pattern. The env-var check
   (LIVENESS_TEST_EMAIL) causes immediate RED. The source-level assertions (file existence, testid)
   provide clear guidance to ui-builder on what to implement.

4. **process.env vs import.meta.env**: Used `process.env` throughout (not `import.meta.env`) to
   align with vitest Node.js test environment. The existing wave13 tests use `import.meta.env`
   for Vite compatibility — both work, but `process.env` is simpler in vitest context.

---

## Evidence

### Baseline (before wave13-gate.test.ts)
```
Test Files  2 failed | 100 passed (102)
Tests       8 failed | 940 passed (948)
```

### wave13-gate.test.ts in isolation (RED confirmation)
```
Test Files  1 failed (1)
Tests       24 failed (24)
Duration    387ms
```

### Full suite after creation
```
Test Files  3 failed | 100 passed (103)
Tests       32 failed | 940 passed (972)
```

**Analysis**:
- Baseline PASSING count: 940 → 940 ✅ (unchanged)
- Baseline FAILING count: 8 → 32 (= 8 baseline + 24 new RED) ✅
- New test file: 1 new file (wave13-gate.test.ts) = 24 tests, 24 FAILING ✅

---

## Governance Alignment Verification

- [x] Architecture frozen before test creation (pre-brief artifact exists)
- [x] QA-to-Red pattern: tests created first, all RED, implementation to follow
- [x] No `.skip()` or `.todo()` used anywhere in the new file
- [x] No existing test files modified
- [x] Test descriptions include exact test IDs in brackets (e.g., `[T-W13-SCH-1]`)
- [x] Zero test debt — all 24 tests are active and failing for real reasons
- [x] Branch: `copilot/mat-wave-13-live-deployment-fix`
- [x] Pre-brief artifact cited in session memory
- [x] POLC: QA Builder never bypasses QA gates or creates test debt

---

## IAA Invocation

**Phase**: PHASE_B_BLOCKING (per iaa-prebrief-wave13-live-deployment-fix.md)
**Status**: PHASE_A_ADVISORY — IAA invocation documented; awaiting IAA session for full assurance verdict.
**Required**: IAA must review this RED gate deliverable before wave proceeds to implementation phase.

---

## STOP-AND-FIX Events

None.

---

## Outcome

**COMPLETE** — 24/24 RED gate tests created and confirmed failing.

Baseline passing count (940) unchanged. Ready for Foreman review and IAA invocation.

---

## Lessons / What Future Sessions Should Know

1. **Vitest needs pnpm install first**: The repo uses pnpm workspaces. `pnpm install --frozen-lockfile`
   must be run before vitest is available. Run from repo root.

2. **Existing wave13 tests have different assertions**: The existing `ci-gates.test.ts` asserts
   `schema-verification`, `env-var-audit`, `post-deploy-smoke-test`. The new `wave13-gate.test.ts`
   asserts `schema-existence-check`, `VITE_LIVE_DEPLOYMENT_URL`, `e2e-auth-smoke`. When
   schema-builder and integration-builder implement CI changes, BOTH sets of assertions will
   need to be satisfied. Coordinate with Foreman.

3. **VITE_LIVE_DEPLOYMENT_URL is the new Wave 13 env var**: Not defined anywhere in the codebase
   at wave start. schema-builder must add it to the CI workflow; all builders must document it.

4. **Vitest config**: Root `vitest.config.ts` includes `modules/mat/tests/**/*.test.ts` and
   `modules/mat/tests/**/*.test.tsx`. No separate config needed for wave13 tests.
