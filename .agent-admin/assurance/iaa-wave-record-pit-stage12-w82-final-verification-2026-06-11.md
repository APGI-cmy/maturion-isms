# IAA Wave Record — PIT Stage 12 W8.2 Final Verification

**Wave ID**: pit-stage12-w82-final-verification
**Date**: 2026-06-11
**Branch**: pit-stage12-w82-final-verification-wave
**Issue**: APGI-cmy/maturion-isms#1774 — PIT Stage 12 W8.2 final actor-based RLS and deployed denied-path verification
**PR**: TBD
**IAA Adoption Phase**: PHASE_B_BLOCKING — Hard gate ACTIVE
**Authority**: CS2 (Johan Ras / @APGI-cmy)
**STOP-AND-FIX**: ACTIVE

---

IAA_PREFLIGHT_BRIEF
PR: TBD
ISSUE: #1774
WAVE: pit-stage12-w82-final-verification
WAVE_TASKS_PATH: .agent-workspace/foreman-v2/personal/wave-current-tasks.md
CURRENT_HEAD_SHA: GITHUB_PR_HEAD_SHA

EXPECTED_QA_SCOPE:
- `.agent-admin/scope-declarations/pit-stage12-w82-final-verification.md` (NEW — wave-start scope declaration with IN_SCOPE/OUT_OF_SCOPE/FILES_CHANGED)
- `.agent-admin/builder-appointments/pit-stage12-w82-final-verification-builder-task.md` (NEW — bounded builder task order with explicit Supabase seed block)
- `.agent-admin/assurance/iaa-wave-record-pit-stage12-w82-final-verification-2026-06-11.md` (this file — IAA pre-brief wave record)
- `.agent-admin/ecap/pit-stage12-w82-final-verification-ecap.md` (NEW — ECAP expected-administration record marked pending builder handover)
- `modules/pit/12-build/w82-final-role-matrix-denied-path-evidence.md` (NEW — evidence ledger with TODO tables for all required W8.2 verification items)

EXPECTED_FAILURE_MODES:
- Scope declaration missing FILES_CHANGED or OUT_OF_SCOPE sections
- Builder task order allows Supabase seeding without explicit CS2 seed plan authorization
- Evidence ledger tables pre-filled with fabricated results instead of TODO placeholders
- Final W8.2 verification decision claimed as PASS or READY in any artifact
- Stage 12 completion or PIT FUNCTIONAL_PASS claimed in any artifact
- Migrations, application code, or `.github/agents/*` modified
- New auth users created without CS2 approval
- ECAP disposition marked complete instead of pending builder handover

FOREMAN_INSTRUCTIONS:
- Keep this wave governance/admin wave-start artifacts only — no builder execution
- Keep all evidence ledger tables in TODO state — no fabricated results
- Keep W8.2 final verification decision as NOT_READY until evidence is collected and QP confirms
- Keep Supabase seed blocked until CS2 issues a separate seed plan authorization
- Keep PR as draft — not merge-ready, not review-ready until Foreman/QP evaluates after builder handover
- Non-overclaim posture must be enforced: no completion, FUNCTIONAL_PASS, or Stage 12 claim in any artifact

ECAP_REQUIRED / ECAP_EXPECTED_ARTIFACTS:
- ECAP_REQUIRED: YES (governance wave-start — new admin/evidence artifacts added)
- ECAP_EXPECTED_ARTIFACTS: `.agent-admin/scope-declarations/pit-stage12-w82-final-verification.md`, `.agent-admin/builder-appointments/pit-stage12-w82-final-verification-builder-task.md`, `.agent-admin/assurance/iaa-wave-record-pit-stage12-w82-final-verification-2026-06-11.md`, `.agent-admin/ecap/pit-stage12-w82-final-verification-ecap.md`, `modules/pit/12-build/w82-final-role-matrix-denied-path-evidence.md`

CURRENT_HEAD_CI_EXPECTATIONS:
- Preflight evidence/admin parity gates must see active wave-record binding for this PR
- Scope declaration parity must match the exact five-file changed-file set for this wave
- IAA final assurance: N/A for governance/admin-only PRs (no implementation files changed)
- No migration, application code, or workflow changes expected in diff

POLC_AND_BUILDER_DELEGATION_EXPECTATIONS:
- POLC mode: governance wave-start orchestration
- pit-specialist is designated builder for W8.2 final verification — execution blocked pending CS2 seed approval
- Foreman creates wave-start artifacts only; builder execution is a subsequent authorized step
- No build execution claim in this wave
- No Supabase seed or live identity execution in this wave

IAA_WILL_QA:
- Scope declaration includes all five expected files in FILES_CHANGED and correct IN_SCOPE/OUT_OF_SCOPE boundaries
- Builder task order explicitly blocks Supabase seeding until CS2-approved seed plan exists
- Evidence ledger contains all required TODO tables with no fabricated results
- Final W8.2 verification decision is NOT_READY in the evidence ledger
- ECAP record is marked pending builder handover with expected bundle contents listed
- No runtime code, test code, migration, deployment config, CI, completion claim, FUNCTIONAL_PASS claim, or Stage 12 completion claim introduced

RESULT: PREFLIGHT_BRIEF_COMPLETE

---

## TOKEN

PHASE_B_BLOCKING_TOKEN: PENDING
PR: TBD
Issue: APGI-cmy/maturion-isms#1774
Reviewed SHA: PENDING
