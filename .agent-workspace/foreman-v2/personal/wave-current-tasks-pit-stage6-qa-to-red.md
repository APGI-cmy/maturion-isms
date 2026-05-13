# Wave Current Tasks — foreman-v2-agent

**Wave**: pit-stage6-qa-to-red-20260513
**Session ID**: session-pit-stage6-qa-to-red-20260513
**Date**: 2026-05-13
**Branch**: copilot/create-stage-6-red-test-package
**PR**: PR #1626
**Issue**: maturion-isms#1634 — Foreman: PIT Stage 6 QA-to-Red — derive RED suite from Stages 1–5 and LFV package
**iaa_prebrief_path**: `.agent-admin/assurance/iaa-wave-record-pit-stage6-qa-to-red-20260513-20260513.md`
**iaa_wave_record_path**: `.agent-admin/assurance/iaa-wave-record-pit-stage6-qa-to-red-20260513-20260513.md`
**ceremony_admin_appointed**: NONE — governance documentation wave (Foreman direct execution; no builder delegation)

## Blocker (SB-01)

IAA flagged SB-01: PR #1624 (Stage 5b LFV) has active REJECTION-PACKAGE (IAA-session-pit-lfv-package-20260512-REJECT-001). IAA full assurance for Stage 6 is blocked until PR #1624 receives ASSURANCE-TOKEN and is merged. Stage 6 artifact creation (content authoring) proceeds in parallel per IAA authorization.

## Outstanding Tasks — Wave: pit-stage6-qa-to-red-20260513

| # | Task | Executor | Status | Evidence |
|---|------|----------|--------|----------|
| T-1 | Create modules/pit/06-qa-to-red/qa-to-red-plan.md | foreman-v2-agent | 🟢 DONE | Stage 6 methodology, scope, sources, gates, non-goals |
| T-2 | Create modules/pit/06-qa-to-red/red-test-suite-catalog.md | foreman-v2-agent | 🟢 DONE | All 13 PIT RED test categories with stable IDs |
| T-3 | Create modules/pit/06-qa-to-red/frs-to-red-traceability.md | foreman-v2-agent | 🟢 DONE | PIT-FR-001–PIT-FR-123 all mapped |
| T-4 | Create modules/pit/06-qa-to-red/trs-to-red-traceability.md | foreman-v2-agent | 🟢 DONE | PIT-TR-001–PIT-TR-126 all mapped |
| T-5 | Create modules/pit/06-qa-to-red/architecture-to-red-traceability.md | foreman-v2-agent | 🟢 DONE | 27 routes, 22 screens, all architecture domains |
| T-6 | Create modules/pit/06-qa-to-red/lfv-to-red-traceability.md | foreman-v2-agent | 🟢 DONE | 9 LFV artifacts + workflow mapped to RED tests |
| T-7 | Create modules/pit/06-qa-to-red/route-screen-state-red-matrix.md | foreman-v2-agent | 🟢 DONE | All 27 routes × 5 states |
| T-8 | Create modules/pit/06-qa-to-red/role-denied-path-red-matrix.md | foreman-v2-agent | 🟢 DONE | All roles × protected action groups |
| T-9 | Create modules/pit/06-qa-to-red/timeline-engine-red-tests.md | foreman-v2-agent | 🟢 DONE | Timeline RED test specifications |
| T-10 | Create modules/pit/06-qa-to-red/live-functional-red-gates.md | foreman-v2-agent | 🟢 DONE | LFV gate RED specifications |
| T-11 | Create modules/pit/06-qa-to-red/stage6-gate-readiness-checklist.md | foreman-v2-agent | 🟢 DONE | Stage 6 gate readiness checklist |
| T-12 | Update modules/pit/BUILD_PROGRESS_TRACKER.md | foreman-v2-agent | 🟢 DONE | Stage 6 path corrected to 06-qa-to-red/; status IN_PROGRESS |
| T-13 | Create .admin/prs/pr-1626.json | foreman-v2-agent | 🟢 DONE | PR manifest |
| T-14 | Create .agent-admin/scope-declarations/scope-declaration-wave-pit-stage6-qa-to-red.md | foreman-v2-agent | 🟢 DONE | Scope declaration |
| T-15 | Create PREHANDOVER proof | foreman-v2-agent | ⏳ PENDING (blocked: SB-01) | .agent-admin/prehandover/proof-pr-1626-pit-stage6-qa-to-red-20260513.md |
| T-16 | Create session memory | foreman-v2-agent | ⏳ PENDING | .agent-workspace/foreman-v2/memory/session-pit-stage6-qa-to-red-20260513.md |

---

**Blocker Status**: SB-01 (PR #1624 REJECTION-PACKAGE) must be cleared before T-15/T-16 and IAA full assurance.
