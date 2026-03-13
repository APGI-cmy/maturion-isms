# Wave Current Tasks — foreman-v2-agent — Wave 13 Execution Start

**Wave**: 13 — Live Deployment Wiring Regression Fix & Continuous Improvement
**Session**: session-wave13-execution-start-20260313
**Date**: 2026-03-13
**Branch**: copilot/mat-wave-13-live-deployment-fix
**Triggering Issue**: maturion-isms — "MAT Wave 13: Live Deployment Wiring Regression Fix — Execution Start"
**CS2 Authorization**: Issue opened by CS2 (@APGI-cmy) and assigns foreman-v2-agent — valid per §2.1
# Wave Current Tasks — foreman-v2-agent — wave-cl-4-aimc-audit-phase-a

**Wave**: CL-4 — AIMC Audit Phase A: Foundation Verification (Parallel Execution Start)
**Session**: session-wave-cl-4-aimc-audit-phase-a-20260313
**Date**: 2026-03-13
**Branch**: copilot/cl-4-launch-audit-verification
**Triggering Issue**: Wave CL-4: AIMC Audit Phase A — Foundation Verification (Parallel Execution Start)
**CS2 Authorization**: Issue opened by CS2 (@APGI-cmy) and assigns foreman-v2-agent; constitutes valid CS2 wave-start authorization per foreman contract §2.1
**Agent**: foreman-v2-agent v6.2.0
**Mode**: POLC-Orchestration
**IAA Pre-Brief**: `.agent-admin/assurance/iaa-prebrief-waveCL-4-launch-20260313.md` — COMMITTED (SHA fbcef8b)
**Plan Registry**: `.agent-admin/waves/cl-4-aimc-audit-phase-a-plan-registry.md`

---

## Tasks

| # | Task ID | Description | Delegated To | Status |
|---|---------|-------------|--------------|--------|
| 1 | T-CL4-001 | Phase 1 — Identity & Preflight complete | Foreman | COMPLETE ✅ |
| 2 | T-CL4-002 | IAA Pre-Brief invoked and committed | IAA | COMPLETE ✅ |
| 3 | T-CL4-003 | Phase 2 — Alignment (CS2 auth, verb classification, architecture frozen) | Foreman | COMPLETE ✅ |
| 4 | T-CL4-004 | Update wave-current-tasks.md for CL-4 | Foreman | COMPLETE ✅ |
| 5 | T-CL4-005 | Create CL-4 plan registry with all Category A/B/C tasks | Foreman | COMPLETE ✅ |
| 6 | T-CL4-006 | Verify prior audit artifacts (BLOCKER-CL4-001 resolution) | Foreman | COMPLETE ✅ |
| 7 | T-CL4-007 | Surface blockers to CS2 in plan registry | Foreman | COMPLETE ✅ |
| 8 | T-CL4-008 | Create session memory | Foreman | COMPLETE ✅ |
| 9 | T-CL4-009 | Create PREHANDOVER proof | Foreman | COMPLETE ✅ |
| 10 | T-CL4-010 | IAA final audit + token ceremony (R3) | IAA | COMPLETE ✅ |
| 11 | T-CL4-011 | Merge gate release | Foreman | COMPLETE ✅ |

---

## Re-Anchor Pulse

```yaml
status: ASSURANCE_TOKEN_PASS
wave: cl-4-aimc-audit-phase-a
session: session-wave-cl-4-aimc-audit-phase-a-20260313
branch: copilot/cl-4-launch-audit-verification
iaa_prebrief_artifact: .agent-admin/assurance/iaa-prebrief-waveCL-4-launch-20260313.md
last_updated: 2026-03-13
tasks_done: 11
tasks_total: 11
iaa_token: IAA-session-wave-cl-4-aimc-audit-phase-a-20260313-R3-PASS
iaa_token_file: .agent-admin/assurance/iaa-token-session-wave-cl-4-aimc-audit-phase-a-20260313-R3.md
```

---

# --- PRIOR WAVE RECORD (wave-status-sweep-20260312) ARCHIVED BELOW ---

# Wave Current Tasks — foreman-v2-agent — wave-status-sweep-20260312

**Wave**: wave-status-sweep-20260312 — Foreman Analogy Sweep: All Outstanding Waves and Plans (MAT, AIMC, LKIAC)
**Session**: session-wave-status-sweep-20260312
**Date**: 2026-03-12
**Branch**: copilot/commission-foreman-analogy-sweep
**Triggering Issue**: maturion-isms — "Foreman Analogy Request: Sweep all outstanding waves and cross-program plans (MAT, AIMC, LKIAC)"
**CS2 Authorization**: Issue opened by CS2 (@APGI-cmy) and assigns foreman-v2-agent; constitutes valid CS2 wave-start authorization per foreman contract §2.1
**Agent**: foreman-v2-agent v6.2.0
**Mode**: POLC-Orchestration/Analysis
**IAA Pre-Brief**: `.agent-admin/assurance/iaa-prebrief-wave-status-sweep-20260312.md` — COMMITTED (SHA a400e34)

**Tasks**: T-SWEEP-001 through T-SWEEP-006 — ALL COMPLETE ✅  
**Status**: COMPLETE (2026-03-12)

---

# --- PRIOR WAVE RECORD (wave17-user-guided-parsing) ARCHIVED BELOW ---

# Wave Current Tasks — foreman-v2-agent — wave17-user-guided-parsing

**Wave**: 17 — User-Guided AI Parsing Instruction System
**Session**: session-wave17-orchestration-20260311
**Date**: 2026-03-11
**Branch**: copilot/implement-user-guided-ai-parsing
**Triggering Issue**: maturion-isms — "Wave 17 — Build Orchestration: User-Guided AI Parsing Instruction System"
**CS2 Authorization**: Issue opened by CS2 (@APGI-cmy) and assigns foreman-v2-agent; constitutes valid CS2 wave-start authorization per foreman contract §2.1
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
