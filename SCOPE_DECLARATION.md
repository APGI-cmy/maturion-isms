# Scope Declaration — T-W15R-QA-001 — 2026-03-08

**Wave**: T-W15R-QA-001 (Wave 15R Batch C governance closure)
**Branch**: copilot/create-red-tests-wave-15r
**Session**: session-T-W15R-QA-001-20260308
**PR**: #1005 — gov(wave15r-qa001): T-W15R-QA-001 governance closure
**Authority**: CS2 (Johan Ras / @APGI-cmy) — "Please finish this job" directive, issue #1000, 2026-03-08
**IAA Pre-Brief**: `.agent-admin/assurance/iaa-prebrief-wave15r-qa001.md` — COMMITTED

## Scope

This PR produces governance closure artifacts for issue #1000 (T-W15R-QA-001 OPOJD recovery).
The qa-builder deliverable (`wave15r-ux-features.test.ts`, 35 assertions, 5 describe blocks
covering T-W15R-UX-001 through T-W15R-UX-005) was delivered in Wave 15R and is on main.
QP evaluation: 35/35 GREEN, QP VERDICT: PASS.

No production code, tests, CI scripts, or agent contracts are modified. All changes are
governance documents on the `copilot/create-red-tests-wave-15r` branch.

## Files Changed

- `SCOPE_DECLARATION.md` - Updated for wave T-W15R-QA-001
- `.agent-workspace/foreman-v2/personal/wave-current-tasks.md` - Updated for wave T-W15R-QA-001
- `.agent-admin/assurance/iaa-prebrief-wave15r-qa001.md` - IAA Pre-Brief artifact (IAA-authored)
- `.agent-workspace/independent-assurance-agent/memory/session-prebrief-wave15r-qa001-20260308.md` - IAA session memory (IAA-authored)
- `.agent-workspace/independent-assurance-agent/parking-station/suggestions-log.md` - IAA parking station (IAA-authored)
- `.agent-workspace/foreman-v2/memory/PREHANDOVER-session-T-W15R-QA-001-20260308.md` - PREHANDOVER proof
- `.agent-workspace/foreman-v2/memory/session-T-W15R-QA-001-20260308.md` - Session memory
- `.agent-workspace/foreman-v2/parking-station/suggestions-log.md` - Parking station update
- `.agent-admin/assurance/iaa-token-session-T-W15R-QA-001-wave15r-qa001-20260308.md` - IAA token (to be added after IAA-AUDIT-001)

**Wave**: wave15r-closure-correction
**Branch**: copilot/run-cwt-and-ibwr-for-closure
**Session**: session-wave15r-closure-correction-20260308
**PR**: Wave 15R: Run CWT and IBWR after remediation merge for governance closure (#1003)
**Authority**: CS2 (Johan Ras / @APGI-cmy) — FOREMAN RE-ALIGNMENT directive, issue #1003 comment 2026-03-08
**IAA Pre-Brief**: `.agent-admin/assurance/iaa-prebrief-wave15r-closure.md` (SHA `3e3a091`) — RETROACTIVE

## Scope

This correction session addresses the FOREMAN RE-ALIGNMENT directive from CS2 (@APGI-cmy) issued on 2026-03-08.
The original wave15r-closure session committed governance artifacts without invoking the IAA Pre-Brief first.
This correction records the violation, voids the invalid Foreman-authored IAA token, and creates the retroactive Pre-Brief.

## Files Changed

- `.agent-workspace/foreman-v2/knowledge/FAIL-ONLY-ONCE.md` - v3.2.0: INC-PREBRIEF-GOVERNANCE-CLOSURE-001 added; S-026 added; INC-OPOJD-W15R-QA-001 severity corrected (MEDIUM→MODERATE)
- `.agent-workspace/foreman-v2/knowledge/index.md` - FAIL-ONLY-ONCE.md version updated to 3.2.0
- `.agent-workspace/foreman-v2/personal/wave-current-tasks.md` - Updated for wave15r-closure (retroactive)
- `.agent-workspace/foreman-v2/memory/CORRECTION-ADDENDUM-session-wave15r-closure-20260308.md` - CORRECTION-ADDENDUM voiding Foreman-authored IAA token
- `.agent-workspace/foreman-v2/parking-station/suggestions-log.md` - S-026 appended
- `.agent-admin/assurance/iaa-prebrief-wave15r-closure.md` - IAA Pre-Brief (retroactive, committed by IAA agent SHA 3e3a091)
- `.agent-workspace/independent-assurance-agent/memory/session-prebrief-wave15r-closure-20260308.md` - IAA session memory for pre-brief

## Governance Notes

- INC-PREBRIEF-GOVERNANCE-CLOSURE-001: REMEDIATED — violation recorded, corrective actions complete
- Foreman-authored IAA token `.agent-admin/assurance/iaa-token-session-wave15r-closure-20260308.md` declared VOID
- Replacement IAA token will be issued by IAA at final handover audit
- S-026 (GOVERNANCE-CLOSURE-PRE-BRIEF-MANDATORY) added to FAIL-ONLY-ONCE improvements log
- No production code changes in this correction session
