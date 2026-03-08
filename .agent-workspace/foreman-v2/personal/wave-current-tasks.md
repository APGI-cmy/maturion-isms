# Wave Current Tasks — foreman-v2-agent — wave15r-gov

**Wave**: wave15r-gov
**Branch**: copilot/update-governance-orchestration-wave15
**Issue**: maturion-isms#996 — gov(wave15): Foreman — full governance update + orchestration for failed Wave 15 criteria parsing pipeline
**Date**: 2026-03-08
**Session**: session-wave15r-gov-20260308
**CS2 Authorization**: Issue #996 opened directly by @APGI-cmy
**Protocol Reference**: IAA_PRE_BRIEF_PROTOCOL.md v1.1.0 §Trigger
**IAA Pre-Brief**: `.agent-admin/assurance/iaa-prebrief-wave15r.md` — COMMITTED

---

## Wave Context

**Wave Slug**: wave15r-gov
**Summary**: Wave 15 was declared complete but confirmed FAILED in production on 2026-03-08 by CS2.
Root cause: Edge Function never deployed; `AI_GATEWAY_URL` not configured; UI missing document list, retry mechanism, and inline error log.
This governance session documents the failure, plans Wave 15R remediation, and delegates RED QA.

**This is governance-only** — no production code written by Foreman.

---

## Outstanding Tasks

| # | Task ID | Task | Builder | Status |
|---|---------|------|---------|--------|
| 1 | T-W15R-GOV-001 | Update `modules/mat/03-implementation-plan/implementation-plan.md` — Wave 15 FAILED + Wave 15R plan | foreman | 🔴 PENDING |
| 2 | T-W15R-GOV-002 | Update `modules/mat/BUILD_PROGRESS_TRACKER.md` — INC-WAVE15-PARSE-001 | foreman | 🔴 PENDING |
| 3 | T-W15R-GOV-003 | Annotate `modules/mat/00-app-description/app-description.md` — §6.2 production gap | foreman | 🔴 PENDING |
| 4 | T-W15R-GOV-004 | Annotate `modules/mat/01-frs/functional-requirements.md` — FR-005 + FR-103 not satisfied | foreman | 🔴 PENDING |
| 5 | T-W15R-GOV-005 | Annotate `modules/mat/01.5-trs/technical-requirements-specification.md` — Wave 15R TRs | foreman | 🔴 PENDING |
| 6 | T-W15R-GOV-006 | Update FAIL-ONLY-ONCE registry — INC-WAVE15-PARSE-001 + S-024 | foreman | 🔴 PENDING |
| 7 | T-W15R-QA-001 | RED QA tests for Wave 15R (5 new tests) | qa-builder | 🔴 PENDING (delegated separately) |

**Status key**: 🔴 PENDING | 🟡 IN PROGRESS | 🟢 DONE | ❌ BLOCKED

---

## Wave Completion Gate

- [x] IAA Pre-Brief committed (`.agent-admin/assurance/iaa-prebrief-wave15r.md`)
- [ ] T-W15R-GOV-001: implementation plan updated
- [ ] T-W15R-GOV-002: BUILD_PROGRESS_TRACKER updated
- [ ] T-W15R-GOV-003: App Description annotated
- [ ] T-W15R-GOV-004: FRS annotated
- [ ] T-W15R-GOV-005: TRS annotated
- [ ] T-W15R-GOV-006: FAIL-ONLY-ONCE updated
- [ ] QP evaluation: PASS
- [ ] Session memory written
- [ ] PREHANDOVER proof committed
- [ ] IAA ASSURANCE-TOKEN received
- [ ] CS2 notified for merge approval

## Re-Anchor Pulse Data

**Last Re-Anchor**: 2026-03-08T11:28:52Z
**Branch**: copilot/update-governance-orchestration-wave15
**Active PREHANDOVER**: PENDING
**Wave Completion**: IN PROGRESS
