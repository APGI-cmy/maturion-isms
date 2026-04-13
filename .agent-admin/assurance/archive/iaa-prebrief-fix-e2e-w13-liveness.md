# IAA Pre-Brief — fix-e2e-w13-liveness

**Wave**: fix-e2e-w13-liveness
**Branch**: copilot/fix-e2e-liveness-failures
**Issue**: maturion-isms — fix(test/e2e): E2E-liveness failures T-W13-E2E-1 and T-W13-E2E-4
**Date**: 2026-03-08
**Foreman Session**: session-fix-e2e-w13-liveness-20260308
**Requested by**: foreman-v2-agent (Phase 1 Step 1.8 + Phase 2 Step 2.7 pre-brief trigger)

---

## Scope Declaration

This wave makes targeted fixes to a single test file:
- **File**: `modules/mat/tests/wave13/e2e-live-deployment.test.ts`
- **No schema changes**
- **No CI workflow changes**
- **No agent contract changes**
- **No production code changes**

---

## Trigger Categories

- `T_FIX` — Test fix (existing test modified to correct failure modes)
- `E2E_TEST` — E2E test scope

---

## Tasks Requiring IAA Assurance

| Task ID | Description | IAA Proof Phases Required |
|---------|-------------|--------------------------|
| T-001 | Add `if (!process.env.E2E_ENABLED) return;` guard to T-W13-E2E-1 | Phase 1 (code correctness), Phase 2 (CI impact) |
| T-002 | Query profiles for organisation_id after signIn; include in audits insert in T-W13-E2E-4 | Phase 1 (code correctness), Phase 2 (RLS compliance) |

---

## FFA Checks Planned

1. Test guard syntax is correct and returns early without side effects
2. `organisation_id` query follows the exact pattern from `useAudits.ts`
3. No new dependencies introduced
4. No existing passing tests are modified to fail
5. Liveness workflow (`liveness.yml`) does not need changes (E2E_ENABLED is a test-level guard)

---

## Evidence Artifacts Required at Handover

- Modified test file with both fixes applied
- PREHANDOVER proof confirming: no regressions introduced, fix follows established patterns

---

## Scope Blockers / Governance Conflicts

None identified. This is a surgical fix to an existing test file. No architecture document needed (test-only change). The fix pattern is derived directly from `useAudits.ts` which is the canonical example cited in the issue.

---

**IAA Phase Status**: PHASE_A_ADVISORY
**Authority**: CS2 (@APGI-cmy)
