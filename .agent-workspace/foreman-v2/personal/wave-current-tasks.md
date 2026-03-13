# Wave Current Tasks — foreman-v2-agent — Wave 13 Execution Start

**Wave**: 13 — Live Deployment Wiring Regression Fix & Continuous Improvement
**Session**: session-wave13-execution-start-20260313
**Date**: 2026-03-13
**Branch**: copilot/mat-wave-13-live-deployment-fix
**Triggering Issue**: maturion-isms — "MAT Wave 13: Live Deployment Wiring Regression Fix — Execution Start"
**CS2 Authorization**: Issue opened by CS2 (@APGI-cmy) and assigns foreman-v2-agent — valid per §2.1
**Agent**: foreman-v2-agent v6.2.0
**Mode**: POLC-Orchestration
**IAA Pre-Brief**: `.agent-admin/assurance/iaa-prebrief-wave13-live-deployment-fix.md` — COMMITTED

---

## Wave 13 Sub-Wave Sequence

13.1 (schema) → 13.2 (auth) → 13.3 (frontend wiring) → 13.4 (E2E CWT) → 13.5 (CI E2E gate)

## Wave 13 Task Register (from §2.14)

| Sub-Wave | Builder(s) | Tests | Status |
|----------|-----------|-------|--------|
| 13.1 Schema Migration Verification & CI Schema Gate | schema-builder | T-W13-SCH-1–4, T-W13-CI-1–2 | IN_PROGRESS |
| 13.2 Authentication Session Wiring Fix | api-builder | T-W13-AUTH-1–4 | PENDING |
| 13.3 Frontend UI Wiring Fix | ui-builder | T-W13-WIRE-1–8 | PENDING |
| 13.4 Full E2E Wiring Verification CWT | integration-builder + qa-builder | T-W13-E2E-1–5 | PENDING |
| 13.5 CI E2E Auth Smoke Test Gate | integration-builder | T-W13-CI-3 | PENDING |

**RED Gate Test IDs (24 total — all must FAIL before builder implementation begins):**
T-W13-SCH-1, T-W13-SCH-2, T-W13-SCH-3, T-W13-SCH-4,
T-W13-AUTH-1, T-W13-AUTH-2, T-W13-AUTH-3, T-W13-AUTH-4,
T-W13-WIRE-1, T-W13-WIRE-2, T-W13-WIRE-3, T-W13-WIRE-4, T-W13-WIRE-5, T-W13-WIRE-6, T-W13-WIRE-7, T-W13-WIRE-8,
T-W13-E2E-1, T-W13-E2E-2, T-W13-E2E-3, T-W13-E2E-4, T-W13-E2E-5,
T-W13-CI-1, T-W13-CI-2, T-W13-CI-3

## Session Tasks

| # | Task | Agent | Status |
|---|------|-------|--------|
| 1 | Update wave-current-tasks.md with Wave 13 register | Foreman | COMPLETE ✅ |
| 2 | Commission qa-builder for 24 RED gate tests | qa-builder | IN_PROGRESS |
| 3 | Confirm RED gate (all 24 FAILING) | Foreman | PENDING |
| 4 | Delegate Task 13.1 to schema-builder | schema-builder | PENDING |
| 5 | Phase 4 PREHANDOVER proof + session memory + IAA token | Foreman | PENDING |

---

## Re-Anchor Pulse

```yaml
status: IAA_PRE_BRIEF_CONFIRMED
wave: wave13-execution-start
session: session-wave13-execution-start-20260313
branch: copilot/mat-wave-13-live-deployment-fix
iaa_prebrief_artifact: .agent-admin/assurance/iaa-prebrief-wave13-live-deployment-fix.md
last_updated: 2026-03-13
tasks_done: 1
tasks_total: 5
iaa_token: PENDING
```
