# Wave Current Tasks — foreman-v2-agent

Wave: pit-w8.1-auth-router-shell
Session ID: session-pit-w8.1-auth-router-shell-20260521
Date: 2026-05-21
Branch: copilot/start-pit-w8-1-auth-router-shell
Issue: PENDING — Stage 12: Start PIT W8.1 Auth, Router, Shell build execution
PR: PENDING
CS2 Authorization: Triggering issue was opened by @APGI-cmy (CS2) and assigned to Copilot — valid wave-start authorization per Phase 2 Step 2.1 condition 2
iaa_wave_record_path: .agent-admin/assurance/iaa-wave-record-pit-w8.1-auth-router-shell-20260521.md
iaa_prebrief_path: .agent-admin/assurance/iaa-wave-record-pit-w8.1-auth-router-shell-20260521.md
implementation_plan_path: modules/pit/08-implementation-plan/implementation-plan.md
builder_checklist_path: modules/pit/09-builder-checklist/builder-checklist.md
ceremony_admin_appointed: NOT_REQUIRED

IAA_PREFLIGHT_BRIEF_REVIEWED: yes
IAA_PREFLIGHT_BRIEF_PATH: .agent-admin/assurance/iaa-wave-record-pit-w8.1-auth-router-shell-20260521.md
IAA_PREFLIGHT_BRIEF_SHA_OR_TIMESTAMP: 2026-05-21T15:07:29Z
FOREMAN_CONSUMED_PREFLIGHT_BEFORE_IMPLEMENTATION: yes
BUILDER_DELEGATION_INCLUDES_PREFLIGHT_SCOPE: no — Build Authorization remains NOT CLEARED

## Wave objective

Validate whether Stage 12 W8.1 execution is authorized on `main` and proceed only if Build Authorization is explicitly CLEARED.

**Boundaries**:
- Do not implement runtime/source code unless Build Authorization is explicitly CLEARED in `modules/pit/BUILD_PROGRESS_TRACKER.md` on `main`.
- Keep Stage 12 status unchanged while authorization is NOT CLEARED.
- Keep scope constrained to W8.1 only if and when authorization is cleared.

## Active task sequence

1. ✅ Phase 1 preflight complete (identity, Tier 2, Tier 1, sessions, breaches, merge gates)
2. ✅ Phase 1.8 IAA pre-brief invoked and recorded
3. ✅ Required Stage 8/11 and tracker artifacts reviewed for W8.1 start gate
4. ✅ Build Authorization checked on branch and `origin/main`: NOT CLEARED
5. ✅ HALT implementation/start delegation due unmet authorization gate
6. ⏳ Await CS2 Build Authorization clearance issue merge and tracker update to CLEARED
