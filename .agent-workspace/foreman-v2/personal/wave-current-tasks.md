# Wave Current Tasks — foreman-v2-agent

Wave: mmm-domain-workflow-framework-workspace
Session ID: session-mmm-domain-workflow-framework-workspace-20260520
Date: 2026-05-20
Branch: copilot/wire-existing-mmm-domain-workflow
Issue: PENDING — Wire existing MMM domain workflow into framework workspace
PR: #1700
CS2 Authorization: Task issued directly by CS2 (@APGI-cmy) in the active Copilot session for PR #1700
iaa_prebrief_path: .agent-admin/assurance/iaa-wave-record-mmm-domain-workflow-framework-workspace-20260520.md
iaa_wave_record_path: .agent-admin/assurance/iaa-wave-record-mmm-domain-workflow-framework-workspace-20260520.md
ceremony_admin_appointed: PENDING (product-delivery wave; Phase 4 appointment required)

IAA_PREFLIGHT_BRIEF_REVIEWED: yes
IAA_PREFLIGHT_BRIEF_PATH: .agent-admin/assurance/iaa-wave-record-mmm-domain-workflow-framework-workspace-20260520.md
IAA_PREFLIGHT_BRIEF_SHA_OR_TIMESTAMP: eb786f8
FOREMAN_CONSUMED_PREFLIGHT_BEFORE_IMPLEMENTATION: yes
BUILDER_DELEGATION_INCLUDES_PREFLIGHT_SCOPE: no
WAVE_TASKS_PATH: .agent-workspace/foreman-v2/personal/wave-current-tasks.md

PHASE_0_FREEZE_STATUS: lifted
PHASE_0_FREEZE_EVIDENCE: PR #1688 merged 2026-05-19T15:08:45Z

---

## Outstanding Tasks

| # | Task | Owner | Status | Evidence |
|---|------|-------|--------|----------|
| 1 | Verify Stage 2, Stage 5, and Stage 6 authorization chain; confirm Stage 7/8/9 readiness | foreman-v2-agent | 🟢 DONE | Stage 2 lines 470-497; Stage 5 §A5.2; Stage 6 T-MMM-S6-051 + T-MMM-S6-177–180; Stage 7/8/9 attested in builder-checklist.md + builder-contract.md |
| 2 | Establish RED QA suite for MPS / intent / criteria workflow actions and five-domain anti-regression | qa-builder | 🟡 PENDING | New/updated MMM tests; RED proof before UI delegation |
| 3 | Wire DomainWorkspacePage to existing MMM workflow data and preserve contextual navigation | ui-builder | 🟡 PENDING | `apps/mmm/src/pages/DomainWorkspacePage.tsx` + targeted supporting files |
| 4 | Record manual finding in `modules/MMM/BUILD_PROGRESS_TRACKER.md` and attach functional evidence | ui-builder | 🟡 PENDING | Tracker entry + evidence artifacts for click-through / actions / back navigation |
| 5 | Refresh PR admin + scope artifacts to exact diff after builder handback | foreman-v2-agent | 🟡 PENDING | `.admin/prs/pr-1700.json` + `.agent-admin/scope-declarations/pr-1700.md` |
