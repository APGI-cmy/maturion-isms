# Scope Declaration — wave15r-closure-correction — 2026-03-08

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
