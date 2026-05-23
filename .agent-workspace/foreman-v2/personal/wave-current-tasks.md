# Wave Current Tasks — foreman-v2-agent

Wave: pit-w8.1-auth-router-shell
Session ID: session-pit-w8.1-auth-router-shell-20260521
Date: 2026-05-21
Branch: copilot/start-pit-w8-1-auth-router-shell
Issue: PENDING — Stage 12: Start PIT W8.1 Auth, Router, Shell build execution
PR: #1741
CS2 Authorization: Triggering issue was opened by @APGI-cmy (CS2) and assigned to Copilot — valid wave-start authorization per Phase 2 Step 2.1 condition 2. Build Authorization is now tracker-explicitly CLEARED on `main` by PR #1738 after Stage 11 builder appointment.
iaa_wave_record_path: .agent-admin/assurance/iaa-wave-record-pit-w8.1-auth-router-shell-20260521.md
iaa_prebrief_path: .agent-admin/assurance/iaa-wave-record-pit-w8.1-auth-router-shell-20260521.md
implementation_plan_path: modules/pit/08-implementation-plan/implementation-plan.md
builder_checklist_path: modules/pit/09-builder-checklist/builder-checklist.md
ceremony_admin_appointed: NOT_REQUIRED

IAA_PREFLIGHT_BRIEF_REVIEWED: yes
IAA_PREFLIGHT_BRIEF_PATH: .agent-admin/assurance/iaa-wave-record-pit-w8.1-auth-router-shell-20260521.md
IAA_PREFLIGHT_BRIEF_SHA_OR_TIMESTAMP: 2026-05-21T15:07:29Z
FOREMAN_CONSUMED_PREFLIGHT_BEFORE_IMPLEMENTATION: yes
BUILDER_DELEGATION_INCLUDES_PREFLIGHT_SCOPE: yes
BUILDER_DELEGATION_NOTE: Build Authorization is CLEARED in `modules/pit/BUILD_PROGRESS_TRACKER.md` via PR #1738; Stage 12 execution remains scoped to W8.1 auth/router/shell and cannot claim FUNCTIONAL_PASS without required runtime evidence gates.

## Wave objective

Prepare the controlled Stage 12 W8.1 auth/router/shell execution posture now that Build Authorization is explicitly CLEARED on `main`.

**Boundaries**:
- Scope remains limited to W8.1 auth/router/shell unless CS2 authorizes broader Stage 12 execution.
- Runtime/source changes must stay tied to the approved implementation plan, builder checklist, and IAA pre-brief scope.
- No FUNCTIONAL_PASS, merge-ready, or live-delivery claim may be made without current-head ECAP/IAA evidence and required runtime verification gates.
- Stage 12 remains evidence-bound: claims must cite concrete artifact paths, current HEAD SHA, and green current-head checks.

## Active task sequence

1. ✅ Phase 1 preflight complete (identity, Tier 2, Tier 1, sessions, breaches, merge gates)
2. ✅ Phase 1.8 IAA pre-brief invoked and recorded
3. ✅ Required Stage 8/11 and tracker artifacts reviewed for W8.1 start gate
4. ✅ Build Authorization checked after `main` update: CLEARED by PR #1738
5. ✅ W8.1 builder delegation may proceed only within the authorized Stage 12 scope and IAA pre-brief boundaries
6. ⏳ Produce current-head ECAP/IAA handover evidence before any merge-ready or FUNCTIONAL_PASS claim
