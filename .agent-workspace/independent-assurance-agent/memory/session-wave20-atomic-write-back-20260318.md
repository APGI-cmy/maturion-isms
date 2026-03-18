# IAA Session Memory — Wave 20 Atomic Write-Back

**Session ID**: session-wave20-atomic-write-back-20260318
**Date**: 2026-03-18
**IAA Version**: independent-assurance-agent v6.2.0 (contract 2.3.0)
**Adoption Phase**: PHASE_B_BLOCKING

---

## Session Fields

```yaml
session_id: session-wave20-atomic-write-back-20260318
date: 2026-03-18
pr_reviewed: "Wave 20 — Wire parse_write_back_atomic RPC into Edge Function (branch: copilot/implement-wire-parse-write-back-rpc, issue #1143)"
invoking_agent: foreman-v2-agent
producing_agent: "api-builder (Edge Function RPC wire-up), schema corrections (migration 20260318000001)"
producing_agent_class: builder

pr_category: AAWP_MAT
checks_executed: 36
checks_passed: 31
checks_failed: 5
merge_gate_parity_result: FAIL
verdict: REJECTION-PACKAGE
token_reference: IAA-session-wave20-atomic-write-back-20260318-REJECTION
adoption_phase_at_time_of_verdict: PHASE_B_BLOCKING

prior_sessions_reviewed:
  - session-wave19-orchestration-20260317 (R1 REJECTION)
  - session-wave19-orchestration-20260317-R2 (R2 REJECTION — A-032 name vs title)
  - session-wave18-postmerge-hotfix-20260315-AUDIT
  - session-wave16-full-batch-20260310
  - session-wave16-orchestration-20260309-R2

failures_cited:
  - check: CORE-013 / A-021
    description: >
      PREHANDOVER proof (.agent-workspace/foreman-v2/memory/PREHANDOVER-session-wave20-atomic-write-back-20260318.md)
      NOT committed to branch. Verified via git ls-files --error-unmatch (error returned).
      Invocation explicitly stated "to be written by Foreman after IAA response" —
      direct A-021 violation (commit before invoking IAA).
    fix: >
      Commit PREHANDOVER proof with all required fields including
      iaa_audit_token: IAA-session-wave20-atomic-write-back-20260318-PASS (expected reference).

  - check: CORE-015
    description: >
      Foreman session memory for Wave 20 NOT committed. git ls-files found nothing for wave20
      in .agent-workspace/foreman-v2/memory/.
    fix: >
      Commit .agent-workspace/foreman-v2/memory/session-wave20-atomic-write-back-20260318.md.

  - check: CORE-018
    description: >
      Complete evidence artifact sweep FAIL. PREHANDOVER absent (item a) and session memory absent (item b).
      Per CORE-018: any absent item = immediate REJECTION-PACKAGE.
    fix: >
      Commit PREHANDOVER and session memory before re-invocation.

  - check: A-026 / BL-027
    description: >
      SCOPE_DECLARATION.md is stale — still shows Wave 19 content (branch copilot/wave-19-..., issue #1137).
      Six Wave 20 files committed, none listed in SCOPE_DECLARATION.
    fix: >
      Overwrite SCOPE_DECLARATION.md with Wave 20 file list. Include A-031 carve-out note.

  - check: OVL-INJ-001
    description: >
      Pre-Brief artifact (.agent-admin/assurance/iaa-prebrief-wave20-atomic-write-back.md) is UNTRACKED
      in git (git status shows '??', git ls-files --error-unmatch returns error). Invocation claimed
      it was committed — factually incorrect per git verification (A-033).
    fix: >
      git add .agent-admin/assurance/iaa-prebrief-wave20-atomic-write-back.md
      git add .agent-workspace/foreman-v2/personal/wave-current-tasks-wave20.md
      Include in ceremony commit.

fail_only_once_rules_applied:
  - rule: A-001
    outcome: "FAIL — PREHANDOVER proof not committed. Evidence absent."
  - rule: A-021
    outcome: "FAIL — Invocation request explicitly deferred PREHANDOVER to after IAA response. Wrong order."
  - rule: A-026
    outcome: "FAIL — SCOPE_DECLARATION stale (Wave 19 content, Wave 20 files not listed)."
  - rule: A-032
    outcome: "PASS — Schema column compliance verified. criteria uses 'title' (not 'name'). All columns for domains/MPS/criteria/criteria_documents verified against DDL. sort_order always non-null in p_domains payload."
  - rule: A-033
    outcome: "APPLIED — All artifact existence checks performed via git ls-files --error-unmatch, not disk -f. Caught untracked pre-brief and missing PREHANDOVER."
  - rule: A-034
    outcome: "APPLIED — FUNCTIONAL-BEHAVIOUR-REGISTRY read. NBR-001 not applicable (no useMutation introduced)."
  - rule: A-035
    outcome: "APPLIED — Niggle Pattern Library read. NP-TQ-* not applicable. NP-SUPA patterns: RPC call pattern correct (parameterized, no injection, error handling present)."

fail_only_once_updates: none

technical_quality_note: >
  Build deliverables are EXCELLENT. 36/36 tests PASS. Edge Function correctly wired.
  Migration fixes all 3 declared bugs. A-032 PASS (title not name). Architecture alignment PASS.
  All 5 failures are governance ceremony artifacts, not technical defects.
  Foreman should be able to resolve all 5 failures in a single ceremony commit and re-invoke IAA.

learning_notes:
  - "Governance ceremony artifacts (PREHANDOVER, session memory, SCOPE_DECLARATION, Pre-Brief) must ALL be committed BEFORE IAA invocation. Even if stated as planned, IAA blocks on absence. A-021 is non-negotiable."
  - "The A-033 rule (git not disk) caught a discrepancy: the Pre-Brief existed on disk (untracked) but was not in git. Without A-033, this might have been missed. Continue applying git ls-files as the standard verification method."
  - "It is structurally incorrect to invoke IAA and plan to write the PREHANDOVER after receiving the verdict. The PREHANDOVER pre-populates the expected token reference (A-029), which requires the PREHANDOVER to exist before the token is issued. The correct ceremony order is: build → commit PREHANDOVER (with expected token ref) → commit session memory → update SCOPE_DECLARATION → commit Pre-Brief → commit all → push → invoke IAA → IAA issues token → IAA writes token file → PREHANDOVER is now immutable."
  - "Wave 20 technical delivery is high quality. The Wave 19 R2 A-032 lesson was applied correctly: criteria INSERT uses 'title' not 'name'. No A-032 failures this time. This represents learning integration from prior wave."

prior_open_rejection_packages_checked: >
  Wave 19 R1 and R2 REJECTION-PACKAGEs resolved at R3 (token: IAA-session-wave19-orchestration-20260317-R3-PASS).
  No Wave 19 items carried forward. Wave 20 R1 REJECTION-PACKAGE is new.
```

---

## Suggestions for Improvement (MANDATORY — must not be blank)

1. **Ceremony commit should be separated from build commit.** The Wave 20 single commit (116b6ae5) contained only build artifacts. The ceremony artifacts (Pre-Brief, PREHANDOVER, session memory, SCOPE_DECLARATION) were not included. The Foreman's workflow should include a ceremony commit immediately after the build commit and before IAA invocation. Consider adding an explicit "Pre-IAA Ceremony Gate" step to the PREHANDOVER template that lists: `git add <all ceremony artifacts>` + `git status` confirmation before IAA is called.

2. **Pre-Brief commitment verification.** Before generating an IAA invocation comment, the Foreman should run `git ls-files .agent-admin/assurance/iaa-prebrief-*.md` to confirm the Pre-Brief is in git, not just on disk. A disk-only pre-brief is invisible to CI and to IAA's git-based verification.

3. **SCOPE_DECLARATION auto-update template.** The PREHANDOVER template should include a mandatory step: "Run `git diff --name-only HEAD~1 HEAD` and copy output to SCOPE_DECLARATION.md." This would prevent the stale-scope failure pattern that has now appeared across multiple waves (Wave 19 also had A-026 issues).

