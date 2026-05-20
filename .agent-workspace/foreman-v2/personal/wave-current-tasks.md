# Wave Current Tasks — foreman-v2-agent

Wave: pit-stage8-hardening
Session ID: session-pr-1693-pit-stage8-hardening-20260519
Date: 2026-05-19
Branch: copilot/harden-pit-stage-8-plan
Issue: #1691 — Foreman: Harden PIT Stage 8 plan into builder-executable delivery package
PR: #1693
CS2 Authorization: Issue #1691 opened by @APGI-cmy and assigned to Copilot/Foreman flow
iaa_prebrief_path: .agent-admin/assurance/iaa-wave-record-pit-stage8-hardening-20260519.md
iaa_wave_record_path: .agent-admin/assurance/iaa-wave-record-pit-stage8-hardening-20260519.md
ceremony_admin_appointed: PENDING (handover-phase only)

IAA_PREFLIGHT_BRIEF_REVIEWED: yes
IAA_PREFLIGHT_BRIEF_PATH: .agent-admin/assurance/iaa-wave-record-pit-stage8-hardening-20260519.md
IAA_PREFLIGHT_BRIEF_SHA_OR_TIMESTAMP: 2026-05-19T15:18:00Z
FOREMAN_CONSUMED_PREFLIGHT_BEFORE_IMPLEMENTATION: yes
BUILDER_DELEGATION_INCLUDES_PREFLIGHT_SCOPE: no
WAVE_TASKS_PATH: .agent-workspace/foreman-v2/personal/wave-current-tasks.md

---

## Outstanding Tasks

| # | Task | Owner | Status | Evidence |
|---|------|-------|--------|----------|
| 1 | Create exact wave-to-RED-test manifest with individual test rows and allocation coverage checks | foreman-v2-agent delegate | 🟢 DONE | `modules/pit/08-implementation-plan/wave-to-red-test-manifest.md` |
| 2 | Create per-wave data/API/audit/notification contract matrix | foreman-v2-agent delegate | 🟢 DONE | `modules/pit/08-implementation-plan/wave-data-api-contract-matrix.md` |
| 3 | Create route/screen/five-state acceptance matrix and reconcile 27 routes vs Stage 2 22 screens | foreman-v2-agent delegate | 🟢 DONE | `modules/pit/08-implementation-plan/route-screen-state-acceptance-matrix.md` |
| 4 | Create timeline engine builder contract and implementation dependency graph | foreman-v2-agent delegate | 🟢 DONE | `modules/pit/08-implementation-plan/timeline-engine-builder-contract.md`, `modules/pit/08-implementation-plan/implementation-dependency-graph.md` |
| 5 | Create wave DoD template, builder responsibility model, and build authorization clearance path | foreman-v2-agent delegate | 🟢 DONE | `modules/pit/08-implementation-plan/wave-definition-of-done-template.md`, `modules/pit/08-implementation-plan/builder-execution-responsibility-model.md`, `modules/pit/08-implementation-plan/build-authorization-clearance-path.md` |
| 6 | Update PIT tracker to preserve Stage 8 gate-pass while recording hardening artifacts and unchanged downstream posture | foreman-v2-agent delegate | 🟢 DONE | `modules/pit/BUILD_PROGRESS_TRACKER.md` |
| 7 | Align PR admin/scope artifacts for PR #1693 | foreman-v2-agent delegate | 🟢 DONE | `.admin/prs/pr-1693.json`, `.agent-admin/scope-declarations/pr-1693.md` |

---

## Wave Completion Gate

- [x] Documentation/governance-only scope maintained
- [x] No runtime/source code, DB migration, deployment config, or active workflow changes
- [x] Stage 8 gate-pass preserved; Stage 9 posture unchanged
- [x] Stage 10/11/12 remain NOT_STARTED
- [x] Build Authorization remains NOT CLEARED
